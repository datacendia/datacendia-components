// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  system?: string;
  template?: string;
  context?: number[];
  stream?: boolean;
  raw?: boolean;
  format?: 'json';
  options?: {
    num_ctx?: number;
    num_predict?: number;
    temperature?: number;
    top_p?: number;
    top_k?: number;
    repeat_penalty?: number;
    seed?: number;
    stop?: string[];
  };
}

interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

interface OllamaChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OllamaChatRequest {
  model: string;
  messages: OllamaChatMessage[];
  stream?: boolean;
  format?: 'json';
  options?: OllamaGenerateRequest['options'];
}

interface OllamaChatResponse {
  model: string;
  created_at: string;
  message: OllamaChatMessage;
  done: boolean;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
}

interface OllamaEmbeddingRequest {
  model: string;
  prompt: string;
}

interface OllamaEmbeddingResponse {
  embedding: number[];
}

interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details: {
    format: string;
    family: string;
    families: string[] | null;
    parameter_size: string;
    quantization_level: string;
  };
}

class OllamaService {
  private baseUrl: string;
  private defaultModel: string;

  constructor() {
    this.baseUrl = config.ollamaBaseUrl;
    this.defaultModel = config.ollamaModel;
  }

  /**
   * Check if Ollama is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * List available models
   */
  async listModels(): Promise<OllamaModel[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json() as { models: OllamaModel[] };
      return data.models;
    } catch (error) {
      logger.error('Failed to list Ollama models:', error);
      throw error;
    }
  }

  /**
   * Pull a model if not available
   */
  async pullModel(modelName: string): Promise<void> {
    logger.info(`Pulling Ollama model: ${modelName}`);
    
    const response = await fetch(`${this.baseUrl}/api/pull`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: modelName, stream: false }),
    });

    if (!response.ok) {
      throw new Error(`Failed to pull model: HTTP ${response.status}`);
    }

    logger.info(`Model ${modelName} pulled successfully`);
  }

  /**
   * Generate a completion (non-chat)
   */
  async generate(
    prompt: string,
    options: Partial<OllamaGenerateRequest> = {}
  ): Promise<string> {
    const request: OllamaGenerateRequest = {
      model: options.model || this.defaultModel,
      prompt,
      stream: false,
      ...options,
    };

    const startTime = Date.now();
    
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama generate failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json() as OllamaGenerateResponse;
      
      const duration = Date.now() - startTime;
      logger.debug(`Ollama generate completed in ${duration}ms`, {
        model: request.model,
        promptTokens: data.prompt_eval_count,
        responseTokens: data.eval_count,
      });

      return data.response;
    } catch (error) {
      logger.error('Ollama generate error:', error);
      throw error;
    }
  }

  /**
   * Chat completion (multi-turn conversation)
   */
  async chat(
    messages: OllamaChatMessage[],
    options: Partial<OllamaChatRequest> = {}
  ): Promise<OllamaChatMessage> {
    const request: OllamaChatRequest = {
      model: options.model || this.defaultModel,
      messages,
      stream: false,
      ...options,
    };

    const startTime = Date.now();

    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama chat failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json() as OllamaChatResponse;
      
      const duration = Date.now() - startTime;
      logger.debug(`Ollama chat completed in ${duration}ms`, {
        model: request.model,
        promptTokens: data.prompt_eval_count,
        responseTokens: data.eval_count,
      });

      return data.message;
    } catch (error) {
      logger.error('Ollama chat error:', error);
      throw error;
    }
  }

  /**
   * Generate embeddings for semantic search
   */
  async embed(text: string, model?: string): Promise<number[]> {
    const request: OllamaEmbeddingRequest = {
      model: model || 'nomic-embed-text',
      prompt: text,
    };

    try {
      const response = await fetch(`${this.baseUrl}/api/embeddings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama embed failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json() as OllamaEmbeddingResponse;
      return data.embedding;
    } catch (error) {
      logger.error('Ollama embed error:', error);
      throw error;
    }
  }

  /**
   * Stream a chat completion
   */
  async *streamChat(
    messages: OllamaChatMessage[],
    options: Partial<OllamaChatRequest> = {}
  ): AsyncGenerator<string, void, unknown> {
    const request: OllamaChatRequest = {
      model: options.model || this.defaultModel,
      messages,
      stream: true,
      ...options,
    };

    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok || !response.body) {
      throw new Error(`Ollama stream chat failed: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line) as OllamaChatResponse;
              if (data.message?.content) {
                yield data.message.content;
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}

// Export singleton instance
export const ollama = new OllamaService();
export default ollama;
