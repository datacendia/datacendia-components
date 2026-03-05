/**
 * Service — Local R L H F Service
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports localRLHFService, FeedbackRecord, TrainingPair, TrainingDataset, LoraConfig, TrainingMetrics, PersonalizedModel, FeedbackType
 * @module services/sovereign/LocalRLHFService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA LOCAL RLHF™ - ZERO-CLOUD REINFORCEMENT LEARNING FROM HUMAN FEEDBACK
// "Your AI learns your judgment locally. No data ever leaves."
//
// Captures user feedback (votes, overrides, dissents) and generates local
// fine-tuning datasets. Supports LoRA adapter export for personalized models.
// =============================================================================

import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { logger } from '../../utils/logger.js';
import { prisma } from '../../config/database.js';

import { loadServiceRecords } from '../../utils/servicePersistence.js';
// =============================================================================
// TYPES
// =============================================================================

export type FeedbackType = 
  | 'vote_agree'           // User agreed with agent response
  | 'vote_disagree'        // User disagreed
  | 'vote_partial'         // Partially agreed
  | 'override'             // User overrode agent recommendation
  | 'dissent'              // Formal dissent filed
  | 'edit'                 // User edited the output
  | 'regenerate'           // User requested regeneration
  | 'preferred'            // User selected this over alternatives
  | 'rejected'             // User rejected this option
  | 'rating';              // Explicit 1-5 rating

export type FeedbackSignal = 'positive' | 'negative' | 'neutral';

export interface FeedbackRecord {
  id: string;
  organizationId: string;
  userId: string;
  
  // Context
  sessionId: string;
  deliberationId?: string;
  agentCode: string;
  modelUsed: string;
  
  // Input/Output pair
  systemPrompt: string;
  userPrompt: string;
  assistantResponse: string;
  
  // Feedback
  feedbackType: FeedbackType;
  signal: FeedbackSignal;
  rating?: number;           // 1-5 if provided
  userCorrection?: string;   // If user provided alternative
  reason?: string;           // Why they gave this feedback
  
  // Metadata
  responseLatencyMs: number;
  tokenCount: number;
  temperature: number;
  
  // Timestamps
  responseAt: Date;
  feedbackAt: Date;
  
  // Processing
  processedForTraining: boolean;
  trainingBatchId?: string;
}

export interface TrainingPair {
  id: string;
  system: string;
  user: string;
  
  // For preference learning (DPO)
  chosen: string;           // Preferred response
  rejected: string;         // Non-preferred response
  
  // Metadata
  source: 'feedback' | 'synthetic' | 'imported';
  quality: number;          // 0-1 confidence in this pair
  tags: string[];
}

export interface TrainingDataset {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  
  // Statistics
  totalPairs: number;
  positivePairs: number;
  negativePairs: number;
  
  // Quality metrics
  averageQuality: number;
  coverageByAgent: Record<string, number>;
  
  // Export info
  format: 'alpaca' | 'sharegpt' | 'dpo' | 'orpo' | 'custom';
  exportPath?: string;
  exportedAt?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface LoraConfig {
  id: string;
  organizationId: string;
  name: string;
  
  // Base model
  baseModel: string;
  
  // LoRA parameters
  r: number;                // Rank (4, 8, 16, 32, 64)
  alpha: number;            // Scaling (typically 2x rank)
  dropout: number;          // 0.0-0.1 typical
  targetModules: string[];  // ['q_proj', 'k_proj', 'v_proj', 'o_proj', 'gate_proj', 'up_proj', 'down_proj']
  
  // Training parameters
  learningRate: number;
  epochs: number;
  batchSize: number;
  warmupSteps: number;
  
  // Dataset
  datasetId: string;
  
  // Status
  status: 'pending' | 'training' | 'completed' | 'failed';
  progress: number;
  
  // Output
  adapterPath?: string;
  metrics?: TrainingMetrics;
  
  // Timestamps
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface TrainingMetrics {
  finalLoss: number;
  evalLoss?: number;
  trainSamples: number;
  evalSamples: number;
  epochLosses: number[];
  trainingTimeSeconds: number;
}

export interface PersonalizedModel {
  id: string;
  organizationId: string;
  userId?: string;           // User-specific or org-wide
  
  name: string;
  description: string;
  
  // Base + adapter
  baseModel: string;
  loraAdapterId: string;
  
  // Performance
  feedbackScore: number;    // Based on post-deployment feedback
  usageCount: number;
  
  // Deployment
  deployed: boolean;
  deployedAt?: Date;
  ollamaModelName?: string;
  
  // Timestamps
  createdAt: Date;
}

// =============================================================================
// LOCAL RLHF SERVICE
// =============================================================================

class LocalRLHFService extends EventEmitter {
  private feedbackRecords: Map<string, FeedbackRecord> = new Map();
  private datasets: Map<string, TrainingDataset> = new Map();
  private loraConfigs: Map<string, LoraConfig> = new Map();
  private dataPath: string;
  
  constructor() {
    super();
    this.dataPath = process.env.RLHF_DATA_PATH || '/var/datacendia/rlhf';
    this.ensureDirectories();
    logger.info('[LocalRLHF] Service initialized - Zero-cloud learning ready');


    this.loadFromDB().catch(() => {});
  }

  private ensureDirectories(): void {
    const dirs = [
      this.dataPath,
      path.join(this.dataPath, 'feedback'),
      path.join(this.dataPath, 'datasets'),
      path.join(this.dataPath, 'adapters'),
      path.join(this.dataPath, 'exports'),
    ];
    
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  }

  // ===========================================================================
  // FEEDBACK COLLECTION
  // ===========================================================================

  /**
   * Record user feedback on an AI response
   */
  async recordFeedback(params: {
    organizationId: string;
    userId: string;
    sessionId: string;
    deliberationId?: string;
    agentCode: string;
    modelUsed: string;
    systemPrompt: string;
    userPrompt: string;
    assistantResponse: string;
    feedbackType: FeedbackType;
    rating?: number;
    userCorrection?: string;
    reason?: string;
    responseLatencyMs: number;
    tokenCount: number;
    temperature: number;
    responseAt: Date;
  }): Promise<FeedbackRecord> {
    const id = `fb-${crypto.randomUUID()}`;
    
    // Determine signal from feedback type
    let signal: FeedbackSignal;
    switch (params.feedbackType) {
      case 'vote_agree':
      case 'preferred':
      case 'rating':
        signal = params.rating && params.rating >= 4 ? 'positive' : 
                 params.rating && params.rating <= 2 ? 'negative' : 'neutral';
        if (params.feedbackType === 'vote_agree') signal = 'positive';
        if (params.feedbackType === 'preferred') signal = 'positive';
        break;
      case 'vote_disagree':
      case 'override':
      case 'dissent':
      case 'rejected':
      case 'regenerate':
        signal = 'negative';
        break;
      case 'vote_partial':
      case 'edit':
        signal = 'neutral';
        break;
      default:
        signal = 'neutral';
    }
    
    const record: FeedbackRecord = {
      id,
      organizationId: params.organizationId,
      userId: params.userId,
      sessionId: params.sessionId,
      deliberationId: params.deliberationId,
      agentCode: params.agentCode,
      modelUsed: params.modelUsed,
      systemPrompt: params.systemPrompt,
      userPrompt: params.userPrompt,
      assistantResponse: params.assistantResponse,
      feedbackType: params.feedbackType,
      signal,
      rating: params.rating,
      userCorrection: params.userCorrection,
      reason: params.reason,
      responseLatencyMs: params.responseLatencyMs,
      tokenCount: params.tokenCount,
      temperature: params.temperature,
      responseAt: params.responseAt,
      feedbackAt: new Date(),
      processedForTraining: false,
    };
    
    this.feedbackRecords.set(id, record);
    
    // Persist to disk
    await this.persistFeedback(record);
    
    // Check if we have enough for a training batch
    await this.checkTrainingThreshold(params.organizationId);
    
    logger.info(`[LocalRLHF] Recorded ${signal} feedback from ${params.agentCode}`);
    this.emit('feedback:recorded', record);
    
    return record;
  }

  /**
   * Persist feedback to disk (append to JSONL file)
   */
  private async persistFeedback(record: FeedbackRecord): Promise<void> {
    const date = new Date().toISOString().split('T')[0];
    const filePath = path.join(
      this.dataPath, 
      'feedback', 
      `${record.organizationId}_${date}.jsonl`
    );
    
    const line = JSON.stringify(record) + '\n';
    fs.appendFileSync(filePath, line);
  }

  /**
   * Check if we have enough feedback for training
   */
  private async checkTrainingThreshold(organizationId: string): Promise<void> {
    const threshold = parseInt(process.env.RLHF_TRAINING_THRESHOLD || '500');
    
    const unprocessed = Array.from(this.feedbackRecords.values())
      .filter(r => r.organizationId === organizationId && !r.processedForTraining);
    
    if (unprocessed.length >= threshold) {
      this.emit('training:threshold_reached', { organizationId, count: unprocessed.length });
      logger.info(`[LocalRLHF] Training threshold reached for ${organizationId}: ${unprocessed.length} samples`);
    }
  }

  /**
   * Get feedback statistics
   */
  getFeedbackStats(organizationId: string): {
    total: number;
    positive: number;
    negative: number;
    neutral: number;
    byAgent: Record<string, number>;
    byType: Record<string, number>;
    unprocessed: number;
  } {
    const records = Array.from(this.feedbackRecords.values())
      .filter(r => r.organizationId === organizationId);
    
    const stats = {
      total: records.length,
      positive: records.filter(r => r.signal === 'positive').length,
      negative: records.filter(r => r.signal === 'negative').length,
      neutral: records.filter(r => r.signal === 'neutral').length,
      byAgent: {} as Record<string, number>,
      byType: {} as Record<string, number>,
      unprocessed: records.filter(r => !r.processedForTraining).length,
    };
    
    for (const r of records) {
      stats.byAgent[r.agentCode] = (stats.byAgent[r.agentCode] || 0) + 1;
      stats.byType[r.feedbackType] = (stats.byType[r.feedbackType] || 0) + 1;
    }
    
    return stats;
  }

  // ===========================================================================
  // DATASET GENERATION
  // ===========================================================================

  /**
   * Generate training dataset from feedback
   */
  async generateDataset(params: {
    organizationId: string;
    name: string;
    description: string;
    format: 'alpaca' | 'sharegpt' | 'dpo' | 'orpo' | 'custom';
    minQuality?: number;
    agents?: string[];
    maxPairs?: number;
  }): Promise<TrainingDataset> {
    const id = `ds-${crypto.randomUUID().slice(0, 8)}`;
    
    // Get unprocessed feedback
    let records = Array.from(this.feedbackRecords.values())
      .filter(r => r.organizationId === params.organizationId);
    
    // Filter by agents if specified
    if (params.agents?.length) {
      records = records.filter(r => params.agents!.includes(r.agentCode));
    }
    
    // Limit size
    if (params.maxPairs && records.length > params.maxPairs) {
      records = records.slice(0, params.maxPairs);
    }
    
    // Generate training pairs based on format
    const pairs = await this.generateTrainingPairs(records, params.format);
    
    // Calculate statistics
    const positiveCount = pairs.filter(p => p.quality > 0.7).length;
    const negativeCount = pairs.filter(p => p.quality < 0.3).length;
    
    const coverageByAgent: Record<string, number> = {};
    for (const r of records) {
      coverageByAgent[r.agentCode] = (coverageByAgent[r.agentCode] || 0) + 1;
    }
    
    const dataset: TrainingDataset = {
      id,
      organizationId: params.organizationId,
      name: params.name,
      description: params.description,
      totalPairs: pairs.length,
      positivePairs: positiveCount,
      negativePairs: negativeCount,
      averageQuality: pairs.reduce((sum, p) => sum + p.quality, 0) / pairs.length,
      coverageByAgent,
      format: params.format,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.datasets.set(id, dataset);
    
    // Save dataset to disk
    await this.saveDataset(dataset, pairs);
    
    // Mark feedback as processed
    for (const r of records) {
      r.processedForTraining = true;
      r.trainingBatchId = id;
    }
    
    logger.info(`[LocalRLHF] Generated dataset ${params.name}: ${pairs.length} pairs`);
    this.emit('dataset:generated', dataset);
    
    return dataset;
  }

  /**
   * Generate training pairs from feedback records
   */
  private async generateTrainingPairs(
    records: FeedbackRecord[],
    format: string
  ): Promise<TrainingPair[]> {
    const pairs: TrainingPair[] = [];
    
    for (const record of records) {
      const pair: TrainingPair = {
        id: `pair-${crypto.randomUUID().slice(0, 8)}`,
        system: record.systemPrompt,
        user: record.userPrompt,
        chosen: record.signal === 'positive' ? record.assistantResponse : 
                record.userCorrection || record.assistantResponse,
        rejected: record.signal === 'negative' ? record.assistantResponse : '',
        source: 'feedback',
        quality: this.calculatePairQuality(record),
        tags: [record.agentCode, record.feedbackType],
      };
      
      // For DPO/ORPO, we need both chosen and rejected
      if (format === 'dpo' || format === 'orpo') {
        if (record.signal === 'negative' && record.userCorrection) {
          pair.chosen = record.userCorrection;
          pair.rejected = record.assistantResponse;
        } else if (record.signal === 'positive') {
          // For positive feedback without explicit rejection, skip for DPO
          continue;
        }
      }
      
      pairs.push(pair);
    }
    
    return pairs;
  }

  /**
   * Calculate quality score for a training pair
   */
  private calculatePairQuality(record: FeedbackRecord): number {
    let quality = 0.5; // Base quality
    
    // Rating-based quality
    if (record.rating) {
      quality = record.rating / 5;
    }
    
    // User correction indicates high-quality correction data
    if (record.userCorrection) {
      quality = Math.min(1, quality + 0.2);
    }
    
    // Explicit reason improves quality
    if (record.reason) {
      quality = Math.min(1, quality + 0.1);
    }
    
    // Strong signals (agree/disagree) are higher quality than neutral
    if (record.signal === 'positive' || record.signal === 'negative') {
      quality = Math.min(1, quality + 0.1);
    }
    
    return quality;
  }

  /**
   * Save dataset to disk in specified format
   */
  private async saveDataset(dataset: TrainingDataset, pairs: TrainingPair[]): Promise<void> {
    const datasetDir = path.join(this.dataPath, 'datasets', dataset.id);
    fs.mkdirSync(datasetDir, { recursive: true });
    
    // Save metadata
    fs.writeFileSync(
      path.join(datasetDir, 'metadata.json'),
      JSON.stringify(dataset, null, 2)
    );
    
    // Save in appropriate format
    switch (dataset.format) {
      case 'alpaca':
        await this.saveAlpacaFormat(datasetDir, pairs);
        break;
      case 'sharegpt':
        await this.saveShareGPTFormat(datasetDir, pairs);
        break;
      case 'dpo':
      case 'orpo':
        await this.saveDPOFormat(datasetDir, pairs);
        break;
      default:
        await this.saveCustomFormat(datasetDir, pairs);
    }
    
    dataset.exportPath = datasetDir;
    dataset.exportedAt = new Date();
  }

  /**
   * Save in Alpaca format (instruction-following)
   */
  private async saveAlpacaFormat(dir: string, pairs: TrainingPair[]): Promise<void> {
    const data = pairs.map(p => ({
      instruction: p.system,
      input: p.user,
      output: p.chosen,
    }));
    
    fs.writeFileSync(
      path.join(dir, 'train.json'),
      JSON.stringify(data, null, 2)
    );
  }

  /**
   * Save in ShareGPT format (conversations)
   */
  private async saveShareGPTFormat(dir: string, pairs: TrainingPair[]): Promise<void> {
    const data = pairs.map(p => ({
      conversations: [
        { from: 'system', value: p.system },
        { from: 'human', value: p.user },
        { from: 'gpt', value: p.chosen },
      ],
    }));
    
    fs.writeFileSync(
      path.join(dir, 'train.json'),
      JSON.stringify(data, null, 2)
    );
  }

  /**
   * Save in DPO format (preference pairs)
   */
  private async saveDPOFormat(dir: string, pairs: TrainingPair[]): Promise<void> {
    const data = pairs
      .filter(p => p.rejected) // DPO needs both chosen and rejected
      .map(p => ({
        prompt: `${p.system}\n\n${p.user}`,
        chosen: p.chosen,
        rejected: p.rejected,
      }));
    
    fs.writeFileSync(
      path.join(dir, 'train.json'),
      JSON.stringify(data, null, 2)
    );
  }

  /**
   * Save in custom JSONL format
   */
  private async saveCustomFormat(dir: string, pairs: TrainingPair[]): Promise<void> {
    const lines = pairs.map(p => JSON.stringify(p)).join('\n');
    fs.writeFileSync(path.join(dir, 'train.jsonl'), lines);
  }

  // ===========================================================================
  // LORA TRAINING
  // ===========================================================================

  /**
   * Create LoRA training configuration
   */
  async createLoraConfig(params: {
    organizationId: string;
    name: string;
    baseModel: string;
    datasetId: string;
    r?: number;
    alpha?: number;
    dropout?: number;
    learningRate?: number;
    epochs?: number;
    batchSize?: number;
  }): Promise<LoraConfig> {
    const id = `lora-${crypto.randomUUID().slice(0, 8)}`;
    
    const config: LoraConfig = {
      id,
      organizationId: params.organizationId,
      name: params.name,
      baseModel: params.baseModel,
      r: params.r || 16,
      alpha: params.alpha || 32,
      dropout: params.dropout || 0.05,
      targetModules: ['q_proj', 'k_proj', 'v_proj', 'o_proj', 'gate_proj', 'up_proj', 'down_proj'],
      learningRate: params.learningRate || 2e-4,
      epochs: params.epochs || 3,
      batchSize: params.batchSize || 4,
      warmupSteps: 100,
      datasetId: params.datasetId,
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
    };
    
    this.loraConfigs.set(id, config);
    
    // Save config
    const configPath = path.join(this.dataPath, 'adapters', id);
    fs.mkdirSync(configPath, { recursive: true });
    fs.writeFileSync(
      path.join(configPath, 'config.json'),
      JSON.stringify(config, null, 2)
    );
    
    logger.info(`[LocalRLHF] Created LoRA config: ${params.name}`);
    this.emit('lora:created', config);
    
    return config;
  }

  /**
   * Generate training script for local execution
   */
  async generateTrainingScript(loraId: string): Promise<string> {
    const config = this.loraConfigs.get(loraId);
    if (!config) throw new Error(`LoRA config not found: ${loraId}`);
    
    const dataset = this.datasets.get(config.datasetId);
    if (!dataset) throw new Error(`Dataset not found: ${config.datasetId}`);
    
    const script = `#!/bin/bash
# =============================================================================
# DATACENDIA LOCAL RLHF - LoRA Training Script
# Generated: ${new Date().toISOString()}
# Config: ${config.name}
# =============================================================================

# This script trains a LoRA adapter locally using unsloth/peft
# No data is sent to any external service

set -e

# Configuration
BASE_MODEL="${config.baseModel}"
DATASET_PATH="${dataset.exportPath}/train.json"
OUTPUT_DIR="${path.join(this.dataPath, 'adapters', config.id, 'output')}"
LORA_R=${config.r}
LORA_ALPHA=${config.alpha}
LORA_DROPOUT=${config.dropout}
LEARNING_RATE=${config.learningRate}
EPOCHS=${config.epochs}
BATCH_SIZE=${config.batchSize}
WARMUP_STEPS=${config.warmupSteps}

echo "🚀 Starting Datacendia Local LoRA Training"
echo "   Base Model: $BASE_MODEL"
echo "   Dataset: $DATASET_PATH"
echo "   Output: $OUTPUT_DIR"

# Check for required tools
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 required. Please install Python 3.10+"
    exit 1
fi

# Create virtual environment if needed
if [ ! -d "venv" ]; then
    python3 -m venv venv
    source venv/bin/activate
    pip install --upgrade pip
    pip install torch transformers peft datasets accelerate bitsandbytes
else
    source venv/bin/activate
fi

# Training script
python3 << 'TRAINING_SCRIPT'
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from datasets import load_dataset
import json

print("Loading base model...")
model = AutoModelForCausalLM.from_pretrained(
    "${config.baseModel}",
    load_in_4bit=True,
    device_map="auto",
    torch_dtype=torch.float16,
)

tokenizer = AutoTokenizer.from_pretrained("${config.baseModel}")
tokenizer.pad_token = tokenizer.eos_token

print("Configuring LoRA...")
lora_config = LoraConfig(
    r=${config.r},
    lora_alpha=${config.alpha},
    target_modules=${JSON.stringify(config.targetModules)},
    lora_dropout=${config.dropout},
    bias="none",
    task_type="CAUSAL_LM",
)

model = prepare_model_for_kbit_training(model)
model = get_peft_model(model, lora_config)

print(f"Trainable parameters: {model.print_trainable_parameters()}")

print("Loading dataset...")
with open("${dataset.exportPath}/train.json", "r") as f:
    data = json.load(f)

def format_prompt(example):
    if 'instruction' in example:
        text = f"### Instruction:\\n{example['instruction']}\\n\\n"
        if example.get('input'):
            text += f"### Input:\\n{example['input']}\\n\\n"
        text += f"### Response:\\n{example['output']}"
    else:
        text = f"{example.get('system', '')}\\n\\nUser: {example['user']}\\n\\nAssistant: {example['chosen']}"
    return {"text": text}

from datasets import Dataset
dataset = Dataset.from_list(data)
dataset = dataset.map(format_prompt)

def tokenize(example):
    return tokenizer(
        example["text"],
        truncation=True,
        max_length=2048,
        padding="max_length",
    )

dataset = dataset.map(tokenize, remove_columns=dataset.column_names)

print("Starting training...")
training_args = TrainingArguments(
    output_dir="${path.join(this.dataPath, 'adapters', config.id, 'output')}",
    num_train_epochs=${config.epochs},
    per_device_train_batch_size=${config.batchSize},
    learning_rate=${config.learningRate},
    warmup_steps=${config.warmupSteps},
    logging_steps=10,
    save_strategy="epoch",
    fp16=True,
    gradient_accumulation_steps=4,
)

from transformers import Trainer, DataCollatorForLanguageModeling

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset,
    data_collator=DataCollatorForLanguageModeling(tokenizer, mlm=False),
)

trainer.train()

print("Saving adapter...")
model.save_pretrained("${path.join(this.dataPath, 'adapters', config.id, 'output')}")
tokenizer.save_pretrained("${path.join(this.dataPath, 'adapters', config.id, 'output')}")

print("✅ Training complete!")
print(f"   Adapter saved to: ${path.join(this.dataPath, 'adapters', config.id, 'output')}")
TRAINING_SCRIPT

echo ""
echo "✅ LoRA adapter training complete!"
echo "   To use with Ollama, create a Modelfile and run:"
echo "   ollama create ${config.name.toLowerCase().replace(/\s+/g, '-')} -f Modelfile"
`;
    // Save script
    const scriptPath = path.join(this.dataPath, 'adapters', config.id, 'train.sh');
    fs.writeFileSync(scriptPath, script);
    fs.chmodSync(scriptPath, '755');
    
    // Also generate Modelfile for Ollama
    const modelfile = `# Datacendia Personalized Model
# Generated: ${new Date().toISOString()}

FROM ${config.baseModel}
ADAPTER ${path.join(this.dataPath, 'adapters', config.id, 'output')}

PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER stop "<|im_end|>"

SYSTEM """You are a personalized AI assistant fine-tuned on ${config.organizationId}'s preferences and feedback. You have learned from ${dataset.totalPairs} examples of preferred responses."""
`;

    fs.writeFileSync(
      path.join(this.dataPath, 'adapters', config.id, 'Modelfile'),
      modelfile
    );
    
    logger.info(`[LocalRLHF] Generated training script: ${scriptPath}`);
    return scriptPath;
  }

  /**
   * Export dataset for external training
   */
  async exportDataset(datasetId: string, format: 'huggingface' | 'axolotl' | 'llamafactory'): Promise<string> {
    const dataset = this.datasets.get(datasetId);
    if (!dataset) throw new Error(`Dataset not found: ${datasetId}`);
    
    const exportDir = path.join(this.dataPath, 'exports', `${datasetId}_${format}`);
    fs.mkdirSync(exportDir, { recursive: true });
    
    // Read original data
    const trainPath = path.join(dataset.exportPath!, 'train.json');
    const data = JSON.parse(fs.readFileSync(trainPath, 'utf8'));
    
    switch (format) {
      case 'huggingface':
        // HuggingFace datasets format
        fs.writeFileSync(
          path.join(exportDir, 'dataset_dict.json'),
          JSON.stringify({ splits: ['train'] })
        );
        fs.writeFileSync(
          path.join(exportDir, 'train', 'data.json'),
          JSON.stringify(data, null, 2)
        );
        break;
        
      case 'axolotl':
        // Axolotl training format
        const axolotlConfig = {
          base_model: 'meta-llama/Llama-3-8B',
          datasets: [{
            path: 'train.json',
            type: dataset.format === 'alpaca' ? 'alpaca' : 'completion',
          }],
          lora_r: 16,
          lora_alpha: 32,
          learning_rate: 2e-4,
          num_epochs: 3,
        };
        fs.writeFileSync(
          path.join(exportDir, 'config.yml'),
          JSON.stringify(axolotlConfig, null, 2)
        );
        fs.copyFileSync(trainPath, path.join(exportDir, 'train.json'));
        break;
        
      case 'llamafactory':
        // LlamaFactory format
        fs.writeFileSync(
          path.join(exportDir, 'dataset_info.json'),
          JSON.stringify({
            datacendia_custom: {
              file_name: 'train.json',
              columns: { prompt: 'instruction', query: 'input', response: 'output' },
            },
          }, null, 2)
        );
        fs.copyFileSync(trainPath, path.join(exportDir, 'train.json'));
        break;
    }
    
    logger.info(`[LocalRLHF] Exported dataset to ${exportDir}`);
    return exportDir;
  }

  // ===========================================================================
  // QUERY METHODS
  // ===========================================================================

  getDatasets(organizationId: string): TrainingDataset[] {
    return Array.from(this.datasets.values())
      .filter(d => d.organizationId === organizationId);
  }

  getLoraConfigs(organizationId: string): LoraConfig[] {
    return Array.from(this.loraConfigs.values())
      .filter(c => c.organizationId === organizationId);
  }

  getFeedbackRecords(organizationId: string, limit: number = 100): FeedbackRecord[] {
    return Array.from(this.feedbackRecords.values())
      .filter(r => r.organizationId === organizationId)
      .sort((a, b) => b.feedbackAt.getTime() - a.feedbackAt.getTime())
      .slice(0, limit);
  }

  // ===========================================================================
  // DASHBOARD & HEALTH
  // ===========================================================================

  async getDashboard(): Promise<{
    serviceName: string;
    status: string;
    feedback: {
      total: number;
      positive: number;
      negative: number;
      neutral: number;
      unprocessed: number;
      byAgent: Record<string, number>;
    };
    datasets: {
      total: number;
      totalPairs: number;
      avgQuality: number;
      formats: Record<string, number>;
    };
    training: {
      totalConfigs: number;
      pending: number;
      completed: number;
      failed: number;
    };
    recentFeedback: Array<{ id: string; agentCode: string; signal: string; feedbackType: string; feedbackAt: Date }>;
    insights: string[];
  }> {
    const records = Array.from(this.feedbackRecords.values());
    const datasets = Array.from(this.datasets.values());
    const configs = Array.from(this.loraConfigs.values());

    const byAgent: Record<string, number> = {};
    for (const r of records) {
      byAgent[r.agentCode] = (byAgent[r.agentCode] || 0) + 1;
    }

    const formats: Record<string, number> = {};
    for (const d of datasets) {
      formats[d.format] = (formats[d.format] || 0) + 1;
    }

    const recentFeedback = records
      .sort((a, b) => b.feedbackAt.getTime() - a.feedbackAt.getTime())
      .slice(0, 10)
      .map(r => ({ id: r.id, agentCode: r.agentCode, signal: r.signal, feedbackType: r.feedbackType, feedbackAt: r.feedbackAt }));

    const insights: string[] = [];
    const unprocessed = records.filter(r => !r.processedForTraining).length;
    if (unprocessed > 100) insights.push(`${unprocessed} unprocessed feedback records — consider generating a training dataset`);
    const negativeRate = records.length > 0 ? records.filter(r => r.signal === 'negative').length / records.length : 0;
    if (negativeRate > 0.4) insights.push(`High negative feedback rate (${Math.round(negativeRate * 100)}%) — model quality may need attention`);
    if (configs.some(c => c.status === 'failed')) insights.push('One or more LoRA training jobs have failed');
    if (insights.length === 0) insights.push('RLHF pipeline operating normally');

    return {
      serviceName: 'LocalRLHF',
      status: 'operational',
      feedback: {
        total: records.length,
        positive: records.filter(r => r.signal === 'positive').length,
        negative: records.filter(r => r.signal === 'negative').length,
        neutral: records.filter(r => r.signal === 'neutral').length,
        unprocessed,
        byAgent,
      },
      datasets: {
        total: datasets.length,
        totalPairs: datasets.reduce((sum, d) => sum + d.totalPairs, 0),
        avgQuality: datasets.length > 0 ? Math.round(datasets.reduce((sum, d) => sum + d.averageQuality, 0) / datasets.length * 100) / 100 : 0,
        formats,
      },
      training: {
        totalConfigs: configs.length,
        pending: configs.filter(c => c.status === 'pending').length,
        completed: configs.filter(c => c.status === 'completed').length,
        failed: configs.filter(c => c.status === 'failed').length,
      },
      recentFeedback,
      insights,
    };
  }

  async getHealth(): Promise<{ healthy: boolean; service: string; timestamp: Date; details: Record<string, unknown> }> {
    return {
      healthy: true,
      service: 'LocalRLHF',
      timestamp: new Date(),
      details: {
        uptime: process.uptime(),
        memoryMB: Math.round(process.memoryUsage().heapUsed / 1048576),
        feedbackRecords: this.feedbackRecords.size,
        datasets: this.datasets.size,
        loraConfigs: this.loraConfigs.size,
        dataPath: this.dataPath,
      },
    };
  }

  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'LocalRLHF', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.feedbackRecords.has(d.id)) this.feedbackRecords.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'LocalRLHF', recordType: 'record', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.datasets.has(d.id)) this.datasets.set(d.id, d);


      }


      restored += recs_1.length;


      const recs_2 = await loadServiceRecords({ serviceName: 'LocalRLHF', recordType: 'record', limit: 1000 });


      for (const rec of recs_2) {


        const d = rec.data as any;


        if (d?.id && !this.loraConfigs.has(d.id)) this.loraConfigs.set(d.id, d);


      }


      restored += recs_2.length;


      if (restored > 0) logger.info(`[LocalRLHFService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[LocalRLHFService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

export const localRLHFService = new LocalRLHFService();
export { LocalRLHFService };
