// Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.
// See LICENSE file for details.

/**
 * @module services/inference/AnthropicProvider
 * @description Anthropic API inference provider — Claude 3.5 Sonnet, Claude 3 Opus, Claude 3.5 Haiku.
 * Implements IInferenceProvider for seamless model routing alongside Ollama.
 * 
 * Configuration:
 *   ANTHROPIC_API_KEY — required for this provider
 *   ANTHROPIC_DEFAULT_MODEL — optional (default: claude-3-5-sonnet-20241022)
 * 
 * Note: Using Anthropic sends data to external servers. For sovereign deployments,
 * use Ollama, Triton, or NIM providers instead.
 */

import {
  type IInferenceProvider,
  type InferenceChatMessage,
  type InferenceOptions,
  type InferenceTelemetry,
  type GenerateResult,
  type ChatResult,
  type EmbedResult,
  type InferenceModel,
  type ProviderHealth,
} from './InferenceProvider.js';

const ANTHROPIC_BASE = 'https://api.anthropic.com';
const ANTHROPIC_KEY = process.env['ANTHROPIC_API_KEY'] || '';
const DEFAULT_MODEL = process.env['ANTHROPIC_DEFAULT_MODEL'] || 'claude-3-5-sonnet-20241022';
const API_VERSION = '2023-06-01';

/**
 * Anthropic API inference provider.
 * Supports Claude 3.5 Sonnet, Claude 3 Opus, Claude 3.5 Haiku.
 */
export class AnthropicProvider implements IInferenceProvider {
  readonly type = 'anthropic' as const;

  async isAvailable(): Promise<boolean> {
    if (!ANTHROPIC_KEY) return false;
    try {
      const resp = await fetch(`${ANTHROPIC_BASE}/v1/messages`, {
        method: 'POST',
        headers: {
          'x-api-key': ANTHROPIC_KEY,
          'anthropic-version': API_VERSION,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: DEFAULT_MODEL,
          max_tokens: 1,
          messages: [{ role: 'user', content: 'ping' }],
        }),
        signal: AbortSignal.timeout(5000),
      });
      return resp.status !== 401;
    } catch {
      return false;
    }
  }

  async healthCheck(): Promise<ProviderHealth> {
    const start = Date.now();
    if (!ANTHROPIC_KEY) {
      return { provider: 'anthropic', available: false, error: 'ANTHROPIC_API_KEY not set' };
    }
    const available = await this.isAvailable();
    return {
      provider: 'anthropic',
      available,
      latencyMs: Date.now() - start,
      modelsLoaded: available ? 3 : 0,
    };
  }

  async resolveModel(requested?: string): Promise<string> {
    return requested || DEFAULT_MODEL;
  }

  async listModels(): Promise<InferenceModel[]> {
    // Anthropic doesn't have a list models endpoint — return known models
    return [
      { name: 'claude-3-5-sonnet-20241022', size: 0, family: 'claude-3.5', parameterSize: 'unknown', quantization: 'none', modifiedAt: '2024-10-22' },
      { name: 'claude-3-5-haiku-20241022', size: 0, family: 'claude-3.5', parameterSize: 'unknown', quantization: 'none', modifiedAt: '2024-10-22' },
      { name: 'claude-3-opus-20240229', size: 0, family: 'claude-3', parameterSize: 'unknown', quantization: 'none', modifiedAt: '2024-02-29' },
    ];
  }

  async generate(prompt: string, options?: InferenceOptions): Promise<string> {
    const result = await this.generateWithTelemetry(prompt, options);
    return result.text;
  }

  async chat(messages: InferenceChatMessage[], options?: InferenceOptions): Promise<InferenceChatMessage> {
    const result = await this.chatWithTelemetry(messages, options);
    return result.message;
  }

  async embed(_text: string, _model?: string): Promise<number[]> {
    throw new Error('Anthropic does not support embeddings. Use OpenAI or Ollama for embeddings.');
  }

  async *streamChat(messages: InferenceChatMessage[], options?: InferenceOptions): AsyncGenerator<string, void, unknown> {
    const model = await this.resolveModel(options?.model);
    const { system, userMessages } = this.separateSystemMessage(messages, options?.system);

    const body: any = {
      model,
      max_tokens: options?.max_tokens || 4096,
      messages: userMessages,
      stream: true,
      temperature: options?.temperature ?? 0.7,
    };
    if (system) body.system = system;

    const resp = await fetch(`${ANTHROPIC_BASE}/v1/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': API_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok || !resp.body) {
      throw new Error(`Anthropic stream error: HTTP ${resp.status}`);
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const json = JSON.parse(line.slice(6));
            if (json.type === 'content_block_delta' && json.delta?.text) {
              yield json.delta.text;
            }
          } catch {
            // Skip malformed SSE lines
          }
        }
      }
    }
  }

  async generateWithTelemetry(prompt: string, options?: InferenceOptions): Promise<GenerateResult> {
    const messages: InferenceChatMessage[] = [{ role: 'user', content: prompt }];
    const result = await this.chatWithTelemetry(messages, options);
    return { text: result.message.content, telemetry: result.telemetry };
  }

  async chatWithTelemetry(messages: InferenceChatMessage[], options?: InferenceOptions): Promise<ChatResult> {
    const start = Date.now();
    const model = await this.resolveModel(options?.model);
    const { system, userMessages } = this.separateSystemMessage(messages, options?.system);

    const body: any = {
      model,
      max_tokens: options?.max_tokens || 4096,
      messages: userMessages,
      temperature: options?.temperature ?? 0.7,
      top_p: options?.top_p,
      stop_sequences: options?.stop,
    };
    if (system) body.system = system;

    const resp = await fetch(`${ANTHROPIC_BASE}/v1/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': API_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const errBody = await resp.text();
      throw new Error(`Anthropic error ${resp.status}: ${errBody}`);
    }

    const data = await resp.json() as {
      content: Array<{ type: string; text: string }>;
      usage?: { input_tokens: number; output_tokens: number };
    };

    const content = data.content.map(c => c.text).join('');
    const telemetry: InferenceTelemetry = {
      provider: 'anthropic',
      model,
      durationMs: Date.now() - start,
      promptTokens: data.usage?.input_tokens,
      completionTokens: data.usage?.output_tokens,
      totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
    };

    return {
      message: { role: 'assistant', content },
      telemetry,
    };
  }

  async embedWithTelemetry(_text: string, _model?: string): Promise<EmbedResult> {
    throw new Error('Anthropic does not support embeddings. Use OpenAI or Ollama for embeddings.');
  }

  /**
   * Anthropic requires system messages as a top-level parameter, not in the messages array.
   * This separates system messages from user/assistant messages.
   */
  private separateSystemMessage(
    messages: InferenceChatMessage[],
    systemOverride?: string,
  ): { system: string | undefined; userMessages: InferenceChatMessage[] } {
    const systemMessages = messages.filter(m => m.role === 'system');
    const userMessages = messages.filter(m => m.role !== 'system');

    const system = systemOverride || systemMessages.map(m => m.content).join('\n') || undefined;

    return { system, userMessages };
  }
}
