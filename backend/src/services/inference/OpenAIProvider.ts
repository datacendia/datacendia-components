// Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.
// See LICENSE file for details.

/**
 * @module services/inference/OpenAIProvider
 * @description OpenAI API inference provider — GPT-4o, GPT-4o-mini, o1, o3-mini.
 * Implements IInferenceProvider for seamless model routing alongside Ollama.
 * 
 * Configuration:
 *   OPENAI_API_KEY — required for this provider
 *   OPENAI_API_BASE — optional custom endpoint (default: https://api.openai.com)
 *   OPENAI_DEFAULT_MODEL — optional (default: gpt-4o)
 * 
 * Note: Using OpenAI sends data to external servers. For sovereign deployments,
 * use Ollama, Triton, or NIM providers instead. This provider is for organizations
 * that have approved OpenAI usage and want model quality + governance together.
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

const OPENAI_BASE = process.env['OPENAI_API_BASE'] || 'https://api.openai.com';
const OPENAI_KEY = process.env['OPENAI_API_KEY'] || '';
const DEFAULT_MODEL = process.env['OPENAI_DEFAULT_MODEL'] || 'gpt-4o';

/**
 * OpenAI API inference provider.
 * Supports GPT-4o, GPT-4o-mini, o1, o3-mini, and any OpenAI-compatible endpoint.
 */
export class OpenAIProvider implements IInferenceProvider {
  readonly type = 'openai' as const;

  async isAvailable(): Promise<boolean> {
    if (!OPENAI_KEY) return false;
    try {
      const resp = await fetch(`${OPENAI_BASE}/v1/models`, {
        headers: { 'Authorization': `Bearer ${OPENAI_KEY}` },
        signal: AbortSignal.timeout(5000),
      });
      return resp.ok;
    } catch {
      return false;
    }
  }

  async healthCheck(): Promise<ProviderHealth> {
    const start = Date.now();
    try {
      if (!OPENAI_KEY) {
        return { provider: 'openai', available: false, error: 'OPENAI_API_KEY not set' };
      }
      const resp = await fetch(`${OPENAI_BASE}/v1/models`, {
        headers: { 'Authorization': `Bearer ${OPENAI_KEY}` },
        signal: AbortSignal.timeout(5000),
      });
      if (!resp.ok) {
        return { provider: 'openai', available: false, error: `HTTP ${resp.status}`, latencyMs: Date.now() - start };
      }
      const data = await resp.json() as { data?: Array<{ id: string }> };
      return {
        provider: 'openai',
        available: true,
        latencyMs: Date.now() - start,
        modelsLoaded: data.data?.length || 0,
      };
    } catch (err: any) {
      return { provider: 'openai', available: false, error: err.message, latencyMs: Date.now() - start };
    }
  }

  async resolveModel(requested?: string): Promise<string> {
    return requested || DEFAULT_MODEL;
  }

  async listModels(): Promise<InferenceModel[]> {
    if (!OPENAI_KEY) return [];
    try {
      const resp = await fetch(`${OPENAI_BASE}/v1/models`, {
        headers: { 'Authorization': `Bearer ${OPENAI_KEY}` },
      });
      if (!resp.ok) return [];
      const data = await resp.json() as { data: Array<{ id: string; created: number; owned_by: string }> };
      return (data.data || []).map(m => ({
        name: m.id,
        size: 0,
        family: m.owned_by || 'openai',
        parameterSize: 'unknown',
        quantization: 'none',
        modifiedAt: new Date(m.created * 1000).toISOString(),
      }));
    } catch {
      return [];
    }
  }

  async generate(prompt: string, options?: InferenceOptions): Promise<string> {
    const result = await this.generateWithTelemetry(prompt, options);
    return result.text;
  }

  async chat(messages: InferenceChatMessage[], options?: InferenceOptions): Promise<InferenceChatMessage> {
    const result = await this.chatWithTelemetry(messages, options);
    return result.message;
  }

  async embed(text: string, model?: string): Promise<number[]> {
    const result = await this.embedWithTelemetry(text, model);
    return result.embedding;
  }

  async *streamChat(messages: InferenceChatMessage[], options?: InferenceOptions): AsyncGenerator<string, void, unknown> {
    const model = await this.resolveModel(options?.model);
    const body: any = {
      model,
      messages: options?.system
        ? [{ role: 'system', content: options.system }, ...messages]
        : messages,
      stream: true,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens,
    };

    const resp = await fetch(`${OPENAI_BASE}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok || !resp.body) {
      throw new Error(`OpenAI stream error: HTTP ${resp.status}`);
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
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          try {
            const json = JSON.parse(line.slice(6));
            const content = json.choices?.[0]?.delta?.content;
            if (content) yield content;
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

    const allMessages = options?.system
      ? [{ role: 'system' as const, content: options.system }, ...messages]
      : messages;

    const body: any = {
      model,
      messages: allMessages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens,
      top_p: options?.top_p,
      stop: options?.stop,
      seed: options?.seed,
    };
    if (options?.format === 'json') {
      body.response_format = { type: 'json_object' };
    }

    const resp = await fetch(`${OPENAI_BASE}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const errBody = await resp.text();
      throw new Error(`OpenAI error ${resp.status}: ${errBody}`);
    }

    const data = await resp.json() as {
      choices: Array<{ message: { role: string; content: string } }>;
      usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
    };

    const content = data.choices[0]?.message?.content || '';
    const telemetry: InferenceTelemetry = {
      provider: 'openai',
      model,
      durationMs: Date.now() - start,
      promptTokens: data.usage?.prompt_tokens,
      completionTokens: data.usage?.completion_tokens,
      totalTokens: data.usage?.total_tokens,
    };

    return {
      message: { role: 'assistant', content },
      telemetry,
    };
  }

  async embedWithTelemetry(text: string, model?: string): Promise<EmbedResult> {
    const start = Date.now();
    const embedModel = model || 'text-embedding-3-small';

    const resp = await fetch(`${OPENAI_BASE}/v1/embeddings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model: embedModel, input: text }),
    });

    if (!resp.ok) {
      throw new Error(`OpenAI embed error: HTTP ${resp.status}`);
    }

    const data = await resp.json() as {
      data: Array<{ embedding: number[] }>;
      usage?: { prompt_tokens: number; total_tokens: number };
    };

    return {
      embedding: data.data[0]?.embedding || [],
      telemetry: {
        provider: 'openai',
        model: embedModel,
        durationMs: Date.now() - start,
        promptTokens: data.usage?.prompt_tokens,
        totalTokens: data.usage?.total_tokens,
      },
    };
  }
}
