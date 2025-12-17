// @ts-nocheck
// =============================================================================
// CENDIA SOVEREIGN™ - FULLY LOCAL LLM CLUSTER ORCHESTRATOR
// Enterprise AI Infrastructure: Multi-Model Orchestration & GPU Scheduling
// "Your Organization's Private AI Brain - Zero Cloud Dependencies"
// 
// CAPABILITIES:
// - Multi-model orchestration across GPU clusters
// - Intelligent GPU scheduling & load balancing
// - Model caching with LRU eviction
// - High-availability inference nodes
// - Automatic failover architectures
// - Model sandboxing for compliance review
// - Sovereign AI deployment (air-gapped capable)
// =============================================================================
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { enterpriseService, GPUNode, DeployedModel, ClusterMetrics } from '../../../services/EnterpriseService';
import { ollamaService } from '../../../lib/ollama';
import { decisionIntelApi } from '../../../lib/api';

// =============================================================================
// LOCAL TYPES (GPUNode, DeployedModel, ClusterMetrics imported from EnterpriseService)
// =============================================================================

type InferenceMode = 'balanced' | 'latency' | 'throughput' | 'cost';
interface FailoverConfig {
  id: string;
  primaryModel: string;
  fallbackModels: string[];
  triggerConditions: {
    latencyThreshold: number;
    errorRateThreshold: number;
    queueDepthThreshold: number;
  };
  isActive: boolean;
  lastTriggered?: Date;
  triggerCount: number;
}
interface ComplianceSandbox {
  id: string;
  modelId: string;
  modelName: string;
  submittedBy: string;
  submittedAt: Date;
  status: 'pending' | 'testing' | 'review' | 'approved' | 'rejected';
  tests: {
    name: string;
    status: 'pending' | 'running' | 'passed' | 'failed';
    details?: string;
  }[];
  reviewers: string[];
  notes: string;
}

// =============================================================================
// MOCK DATA GENERATORS
// =============================================================================

const generateGPUNodes = stryMutAct_9fa48("33416") ? () => undefined : (stryCov_9fa48("33416"), (() => {
  const generateGPUNodes = (): GPUNode[] => stryMutAct_9fa48("33417") ? [] : (stryCov_9fa48("33417"), [stryMutAct_9fa48("33418") ? {} : (stryCov_9fa48("33418"), {
    id: 'node-001',
    name: 'Sovereign-Primary-01',
    hostname: 'gpu-cluster-01.internal',
    zone: 'on-prem',
    gpuType: 'H100',
    gpuCount: 8,
    vramPerGPU: 80,
    totalVRAM: 640,
    usedVRAM: 480,
    status: 'online',
    temperature: 62,
    powerDraw: 5600,
    loadedModels: stryMutAct_9fa48("33425") ? [] : (stryCov_9fa48("33425"), ['llama-70b', 'mistral-large', 'qwen-72b']),
    currentRequests: 24,
    requestsPerSecond: 12.4,
    avgLatency: 180,
    uptime: 2184,
    lastHealthCheck: new Date(stryMutAct_9fa48("33429") ? Date.now() + 15000 : (stryCov_9fa48("33429"), Date.now() - 15000))
  }), stryMutAct_9fa48("33430") ? {} : (stryCov_9fa48("33430"), {
    id: 'node-002',
    name: 'Sovereign-Primary-02',
    hostname: 'gpu-cluster-02.internal',
    zone: 'on-prem',
    gpuType: 'H100',
    gpuCount: 8,
    vramPerGPU: 80,
    totalVRAM: 640,
    usedVRAM: 520,
    status: 'online',
    temperature: 65,
    powerDraw: 5800,
    loadedModels: stryMutAct_9fa48("33437") ? [] : (stryCov_9fa48("33437"), ['llama-70b', 'deepseek-coder', 'command-r-plus']),
    currentRequests: 31,
    requestsPerSecond: 15.2,
    avgLatency: 165,
    uptime: 2184,
    lastHealthCheck: new Date(stryMutAct_9fa48("33441") ? Date.now() + 12000 : (stryCov_9fa48("33441"), Date.now() - 12000))
  }), stryMutAct_9fa48("33442") ? {} : (stryCov_9fa48("33442"), {
    id: 'node-003',
    name: 'Sovereign-HA-01',
    hostname: 'gpu-ha-01.internal',
    zone: 'on-prem',
    gpuType: 'A100',
    gpuCount: 4,
    vramPerGPU: 80,
    totalVRAM: 320,
    usedVRAM: 240,
    status: 'online',
    temperature: 58,
    powerDraw: 1600,
    loadedModels: stryMutAct_9fa48("33449") ? [] : (stryCov_9fa48("33449"), ['llama-13b', 'mistral-7b']),
    currentRequests: 8,
    requestsPerSecond: 28.5,
    avgLatency: 45,
    uptime: 720,
    lastHealthCheck: new Date(stryMutAct_9fa48("33452") ? Date.now() + 8000 : (stryCov_9fa48("33452"), Date.now() - 8000))
  }), stryMutAct_9fa48("33453") ? {} : (stryCov_9fa48("33453"), {
    id: 'node-004',
    name: 'Sovereign-Edge-01',
    hostname: 'edge-node-01.branch',
    zone: 'edge',
    gpuType: 'RTX4090',
    gpuCount: 2,
    vramPerGPU: 24,
    totalVRAM: 48,
    usedVRAM: 38,
    status: 'online',
    temperature: 71,
    powerDraw: 900,
    loadedModels: stryMutAct_9fa48("33460") ? [] : (stryCov_9fa48("33460"), ['phi-3', 'llama-7b-q4']),
    currentRequests: 3,
    requestsPerSecond: 8.2,
    avgLatency: 85,
    uptime: 168,
    lastHealthCheck: new Date(stryMutAct_9fa48("33463") ? Date.now() + 20000 : (stryCov_9fa48("33463"), Date.now() - 20000))
  }), stryMutAct_9fa48("33464") ? {} : (stryCov_9fa48("33464"), {
    id: 'node-005',
    name: 'Sovereign-Secure-01',
    hostname: 'airgap-01.secure.gov',
    zone: 'air-gapped',
    gpuType: 'H100',
    gpuCount: 4,
    vramPerGPU: 80,
    totalVRAM: 320,
    usedVRAM: 280,
    status: 'online',
    temperature: 55,
    powerDraw: 2800,
    loadedModels: stryMutAct_9fa48("33471") ? [] : (stryCov_9fa48("33471"), ['llama-70b-classified', 'qwen-72b-secure']),
    currentRequests: 5,
    requestsPerSecond: 3.1,
    avgLatency: 220,
    uptime: 4380,
    lastHealthCheck: new Date(stryMutAct_9fa48("33474") ? Date.now() + 30000 : (stryCov_9fa48("33474"), Date.now() - 30000))
  }), stryMutAct_9fa48("33475") ? {} : (stryCov_9fa48("33475"), {
    id: 'node-006',
    name: 'Sovereign-Dev-01',
    hostname: 'gpu-dev-01.internal',
    zone: 'on-prem',
    gpuType: 'L40',
    gpuCount: 4,
    vramPerGPU: 48,
    totalVRAM: 192,
    usedVRAM: 96,
    status: 'draining',
    temperature: 52,
    powerDraw: 1200,
    loadedModels: stryMutAct_9fa48("33482") ? [] : (stryCov_9fa48("33482"), ['test-model-alpha']),
    currentRequests: 0,
    requestsPerSecond: 0,
    avgLatency: 0,
    uptime: 72,
    lastHealthCheck: new Date(stryMutAct_9fa48("33484") ? Date.now() + 5000 : (stryCov_9fa48("33484"), Date.now() - 5000))
  })]);
  return generateGPUNodes;
})());
const generateDeployedModels = stryMutAct_9fa48("33485") ? () => undefined : (stryCov_9fa48("33485"), (() => {
  const generateDeployedModels = (): DeployedModel[] => stryMutAct_9fa48("33486") ? [] : (stryCov_9fa48("33486"), [stryMutAct_9fa48("33487") ? {} : (stryCov_9fa48("33487"), {
    id: 'llama-70b',
    name: 'Llama 3.1 70B Instruct',
    family: 'llama',
    size: '70B',
    parameters: '70.6B',
    quantization: 'FP16',
    vramRequired: 140,
    contextLength: 128000,
    nodes: stryMutAct_9fa48("33494") ? [] : (stryCov_9fa48("33494"), ['node-001', 'node-002']),
    replicas: 2,
    status: 'active',
    requestsToday: 12847,
    avgResponseTime: 175,
    tokensGenerated: 8456000,
    complianceStatus: 'approved',
    lastUsed: new Date(stryMutAct_9fa48("33499") ? Date.now() + 2000 : (stryCov_9fa48("33499"), Date.now() - 2000))
  }), stryMutAct_9fa48("33500") ? {} : (stryCov_9fa48("33500"), {
    id: 'mistral-large',
    name: 'Mistral Large 2',
    family: 'mistral',
    size: '72B',
    parameters: '123B',
    quantization: 'FP16',
    vramRequired: 160,
    contextLength: 32768,
    nodes: stryMutAct_9fa48("33507") ? [] : (stryCov_9fa48("33507"), ['node-001']),
    replicas: 1,
    status: 'active',
    requestsToday: 5234,
    avgResponseTime: 210,
    tokensGenerated: 3245000,
    complianceStatus: 'approved',
    lastUsed: new Date(stryMutAct_9fa48("33511") ? Date.now() + 5000 : (stryCov_9fa48("33511"), Date.now() - 5000))
  }), stryMutAct_9fa48("33512") ? {} : (stryCov_9fa48("33512"), {
    id: 'qwen-72b',
    name: 'Qwen 2.5 72B',
    family: 'qwen',
    size: '72B',
    parameters: '72.7B',
    quantization: 'AWQ',
    vramRequired: 80,
    contextLength: 131072,
    nodes: stryMutAct_9fa48("33519") ? [] : (stryCov_9fa48("33519"), ['node-001', 'node-005']),
    replicas: 2,
    status: 'active',
    requestsToday: 8923,
    avgResponseTime: 145,
    tokensGenerated: 6234000,
    complianceStatus: 'approved',
    lastUsed: new Date(stryMutAct_9fa48("33524") ? Date.now() + 1000 : (stryCov_9fa48("33524"), Date.now() - 1000))
  }), stryMutAct_9fa48("33525") ? {} : (stryCov_9fa48("33525"), {
    id: 'deepseek-coder',
    name: 'DeepSeek Coder V2',
    family: 'deepseek',
    size: '34B',
    parameters: '236B MoE',
    quantization: 'FP16',
    vramRequired: 120,
    contextLength: 128000,
    nodes: stryMutAct_9fa48("33532") ? [] : (stryCov_9fa48("33532"), ['node-002']),
    replicas: 1,
    status: 'active',
    requestsToday: 3456,
    avgResponseTime: 190,
    tokensGenerated: 2890000,
    complianceStatus: 'approved',
    lastUsed: new Date(stryMutAct_9fa48("33536") ? Date.now() + 8000 : (stryCov_9fa48("33536"), Date.now() - 8000))
  }), stryMutAct_9fa48("33537") ? {} : (stryCov_9fa48("33537"), {
    id: 'command-r-plus',
    name: 'Command R+',
    family: 'command-r',
    size: '34B',
    parameters: '104B',
    quantization: 'INT8',
    vramRequired: 60,
    contextLength: 128000,
    nodes: stryMutAct_9fa48("33544") ? [] : (stryCov_9fa48("33544"), ['node-002']),
    replicas: 1,
    status: 'active',
    requestsToday: 2134,
    avgResponseTime: 165,
    tokensGenerated: 1567000,
    complianceStatus: 'approved',
    lastUsed: new Date(stryMutAct_9fa48("33548") ? Date.now() + 15000 : (stryCov_9fa48("33548"), Date.now() - 15000))
  }), stryMutAct_9fa48("33549") ? {} : (stryCov_9fa48("33549"), {
    id: 'llama-13b',
    name: 'Llama 3.1 13B',
    family: 'llama',
    size: '13B',
    parameters: '13B',
    quantization: 'FP16',
    vramRequired: 26,
    contextLength: 128000,
    nodes: stryMutAct_9fa48("33556") ? [] : (stryCov_9fa48("33556"), ['node-003']),
    replicas: 1,
    status: 'active',
    requestsToday: 18234,
    avgResponseTime: 42,
    tokensGenerated: 12450000,
    complianceStatus: 'approved',
    lastUsed: new Date(stryMutAct_9fa48("33560") ? Date.now() + 500 : (stryCov_9fa48("33560"), Date.now() - 500))
  }), stryMutAct_9fa48("33561") ? {} : (stryCov_9fa48("33561"), {
    id: 'phi-3',
    name: 'Phi-3 Medium',
    family: 'phi',
    size: '13B',
    parameters: '14B',
    quantization: 'INT4',
    vramRequired: 8,
    contextLength: 128000,
    nodes: stryMutAct_9fa48("33568") ? [] : (stryCov_9fa48("33568"), ['node-004']),
    replicas: 1,
    status: 'active',
    requestsToday: 4567,
    avgResponseTime: 28,
    tokensGenerated: 3456000,
    complianceStatus: 'approved',
    lastUsed: new Date(stryMutAct_9fa48("33572") ? Date.now() + 3000 : (stryCov_9fa48("33572"), Date.now() - 3000))
  }), stryMutAct_9fa48("33573") ? {} : (stryCov_9fa48("33573"), {
    id: 'test-model-alpha',
    name: 'Custom Finance Model v2',
    family: 'custom',
    size: 'custom',
    parameters: '8B',
    quantization: 'GPTQ',
    vramRequired: 16,
    contextLength: 32768,
    nodes: stryMutAct_9fa48("33580") ? [] : (stryCov_9fa48("33580"), ['node-006']),
    replicas: 1,
    status: 'sandboxed',
    requestsToday: 0,
    avgResponseTime: 0,
    tokensGenerated: 0,
    complianceStatus: 'review',
    lastUsed: new Date(stryMutAct_9fa48("33584") ? Date.now() + 3600000 : (stryCov_9fa48("33584"), Date.now() - 3600000))
  })]);
  return generateDeployedModels;
})());
const generateFailoverConfigs = stryMutAct_9fa48("33585") ? () => undefined : (stryCov_9fa48("33585"), (() => {
  const generateFailoverConfigs = (): FailoverConfig[] => stryMutAct_9fa48("33586") ? [] : (stryCov_9fa48("33586"), [stryMutAct_9fa48("33587") ? {} : (stryCov_9fa48("33587"), {
    id: 'fo-001',
    primaryModel: 'llama-70b',
    fallbackModels: stryMutAct_9fa48("33590") ? [] : (stryCov_9fa48("33590"), ['qwen-72b', 'mistral-large', 'llama-13b']),
    triggerConditions: stryMutAct_9fa48("33594") ? {} : (stryCov_9fa48("33594"), {
      latencyThreshold: 500,
      errorRateThreshold: 5,
      queueDepthThreshold: 50
    }),
    isActive: stryMutAct_9fa48("33595") ? false : (stryCov_9fa48("33595"), true),
    lastTriggered: new Date(stryMutAct_9fa48("33596") ? Date.now() + 86400000 : (stryCov_9fa48("33596"), Date.now() - 86400000)),
    triggerCount: 3
  }), stryMutAct_9fa48("33597") ? {} : (stryCov_9fa48("33597"), {
    id: 'fo-002',
    primaryModel: 'deepseek-coder',
    fallbackModels: stryMutAct_9fa48("33600") ? [] : (stryCov_9fa48("33600"), ['llama-70b', 'qwen-72b']),
    triggerConditions: stryMutAct_9fa48("33603") ? {} : (stryCov_9fa48("33603"), {
      latencyThreshold: 400,
      errorRateThreshold: 3,
      queueDepthThreshold: 30
    }),
    isActive: stryMutAct_9fa48("33604") ? false : (stryCov_9fa48("33604"), true),
    triggerCount: 0
  })]);
  return generateFailoverConfigs;
})());
const generateSandboxes = stryMutAct_9fa48("33605") ? () => undefined : (stryCov_9fa48("33605"), (() => {
  const generateSandboxes = (): ComplianceSandbox[] => stryMutAct_9fa48("33606") ? [] : (stryCov_9fa48("33606"), [stryMutAct_9fa48("33607") ? {} : (stryCov_9fa48("33607"), {
    id: 'sb-001',
    modelId: 'test-model-alpha',
    modelName: 'Custom Finance Model v2',
    submittedBy: 'AI Research Team',
    submittedAt: new Date(stryMutAct_9fa48("33612") ? Date.now() + 172800000 : (stryCov_9fa48("33612"), Date.now() - 172800000)),
    status: 'testing',
    tests: stryMutAct_9fa48("33614") ? [] : (stryCov_9fa48("33614"), [stryMutAct_9fa48("33615") ? {} : (stryCov_9fa48("33615"), {
      name: 'Bias Detection',
      status: 'passed'
    }), stryMutAct_9fa48("33618") ? {} : (stryCov_9fa48("33618"), {
      name: 'Hallucination Rate',
      status: 'passed'
    }), stryMutAct_9fa48("33621") ? {} : (stryCov_9fa48("33621"), {
      name: 'Data Leakage',
      status: 'running'
    }), stryMutAct_9fa48("33624") ? {} : (stryCov_9fa48("33624"), {
      name: 'Adversarial Robustness',
      status: 'pending'
    }), stryMutAct_9fa48("33627") ? {} : (stryCov_9fa48("33627"), {
      name: 'Compliance Output Filter',
      status: 'pending'
    }), stryMutAct_9fa48("33630") ? {} : (stryCov_9fa48("33630"), {
      name: 'PII Detection',
      status: 'pending'
    })]),
    reviewers: stryMutAct_9fa48("33633") ? [] : (stryCov_9fa48("33633"), ['Chief AI Officer', 'Compliance Lead', 'CISO']),
    notes: 'Fine-tuned on proprietary financial data. Requires SOX compliance verification.'
  }), stryMutAct_9fa48("33638") ? {} : (stryCov_9fa48("33638"), {
    id: 'sb-002',
    modelId: 'legal-assistant-v1',
    modelName: 'Legal Contract Analyzer',
    submittedBy: 'Legal Tech Team',
    submittedAt: new Date(stryMutAct_9fa48("33643") ? Date.now() + 86400000 : (stryCov_9fa48("33643"), Date.now() - 86400000)),
    status: 'review',
    tests: stryMutAct_9fa48("33645") ? [] : (stryCov_9fa48("33645"), [stryMutAct_9fa48("33646") ? {} : (stryCov_9fa48("33646"), {
      name: 'Bias Detection',
      status: 'passed'
    }), stryMutAct_9fa48("33649") ? {} : (stryCov_9fa48("33649"), {
      name: 'Hallucination Rate',
      status: 'passed'
    }), stryMutAct_9fa48("33652") ? {} : (stryCov_9fa48("33652"), {
      name: 'Data Leakage',
      status: 'passed'
    }), stryMutAct_9fa48("33655") ? {} : (stryCov_9fa48("33655"), {
      name: 'Adversarial Robustness',
      status: 'passed'
    }), stryMutAct_9fa48("33658") ? {} : (stryCov_9fa48("33658"), {
      name: 'Compliance Output Filter',
      status: 'passed'
    }), stryMutAct_9fa48("33661") ? {} : (stryCov_9fa48("33661"), {
      name: 'PII Detection',
      status: 'passed'
    })]),
    reviewers: stryMutAct_9fa48("33664") ? [] : (stryCov_9fa48("33664"), ['General Counsel', 'Chief AI Officer']),
    notes: 'All automated tests passed. Awaiting legal review for contract analysis capabilities.'
  })]);
  return generateSandboxes;
})());
const calculateClusterMetrics = (nodes: GPUNode[], models: DeployedModel[]): ClusterMetrics => {
  const onlineNodes = stryMutAct_9fa48("33669") ? nodes : (stryCov_9fa48("33669"), nodes.filter(stryMutAct_9fa48("33670") ? () => undefined : (stryCov_9fa48("33670"), n => stryMutAct_9fa48("33673") ? n.status === 'online' && n.status === 'busy' : stryMutAct_9fa48("33672") ? false : stryMutAct_9fa48("33671") ? true : (stryCov_9fa48("33671", "33672", "33673"), (stryMutAct_9fa48("33675") ? n.status !== 'online' : stryMutAct_9fa48("33674") ? false : (stryCov_9fa48("33674", "33675"), n.status === 'online')) || (stryMutAct_9fa48("33678") ? n.status !== 'busy' : stryMutAct_9fa48("33677") ? false : (stryCov_9fa48("33677", "33678"), n.status === 'busy'))))));
  const activeModels = stryMutAct_9fa48("33680") ? models : (stryCov_9fa48("33680"), models.filter(stryMutAct_9fa48("33681") ? () => undefined : (stryCov_9fa48("33681"), m => stryMutAct_9fa48("33684") ? m.status !== 'active' : stryMutAct_9fa48("33683") ? false : stryMutAct_9fa48("33682") ? true : (stryCov_9fa48("33682", "33683", "33684"), m.status === 'active'))));
  return stryMutAct_9fa48("33686") ? {} : (stryCov_9fa48("33686"), {
    totalNodes: nodes.length,
    onlineNodes: onlineNodes.length,
    totalGPUs: nodes.reduce(stryMutAct_9fa48("33687") ? () => undefined : (stryCov_9fa48("33687"), (sum, n) => stryMutAct_9fa48("33688") ? sum - n.gpuCount : (stryCov_9fa48("33688"), sum + n.gpuCount)), 0),
    activeGPUs: onlineNodes.reduce(stryMutAct_9fa48("33689") ? () => undefined : (stryCov_9fa48("33689"), (sum, n) => stryMutAct_9fa48("33690") ? sum - n.gpuCount : (stryCov_9fa48("33690"), sum + n.gpuCount)), 0),
    totalVRAM: nodes.reduce(stryMutAct_9fa48("33691") ? () => undefined : (stryCov_9fa48("33691"), (sum, n) => stryMutAct_9fa48("33692") ? sum - n.totalVRAM : (stryCov_9fa48("33692"), sum + n.totalVRAM)), 0),
    usedVRAM: nodes.reduce(stryMutAct_9fa48("33693") ? () => undefined : (stryCov_9fa48("33693"), (sum, n) => stryMutAct_9fa48("33694") ? sum - n.usedVRAM : (stryCov_9fa48("33694"), sum + n.usedVRAM)), 0),
    totalModels: models.length,
    activeModels: activeModels.length,
    requestsPerSecond: onlineNodes.reduce(stryMutAct_9fa48("33695") ? () => undefined : (stryCov_9fa48("33695"), (sum, n) => stryMutAct_9fa48("33696") ? sum - n.requestsPerSecond : (stryCov_9fa48("33696"), sum + n.requestsPerSecond)), 0),
    avgLatency: (stryMutAct_9fa48("33700") ? onlineNodes.length <= 0 : stryMutAct_9fa48("33699") ? onlineNodes.length >= 0 : stryMutAct_9fa48("33698") ? false : stryMutAct_9fa48("33697") ? true : (stryCov_9fa48("33697", "33698", "33699", "33700"), onlineNodes.length > 0)) ? stryMutAct_9fa48("33701") ? onlineNodes.reduce((sum, n) => sum + n.avgLatency, 0) * onlineNodes.length : (stryCov_9fa48("33701"), onlineNodes.reduce(stryMutAct_9fa48("33702") ? () => undefined : (stryCov_9fa48("33702"), (sum, n) => stryMutAct_9fa48("33703") ? sum - n.avgLatency : (stryCov_9fa48("33703"), sum + n.avgLatency)), 0) / onlineNodes.length) : 0,
    tokensPerSecond: Math.round(stryMutAct_9fa48("33704") ? activeModels.reduce((sum, m) => sum + m.tokensGenerated, 0) * 86400 : (stryCov_9fa48("33704"), activeModels.reduce(stryMutAct_9fa48("33705") ? () => undefined : (stryCov_9fa48("33705"), (sum, m) => stryMutAct_9fa48("33706") ? sum - m.tokensGenerated : (stryCov_9fa48("33706"), sum + m.tokensGenerated)), 0) / 86400)),
    powerConsumption: nodes.reduce(stryMutAct_9fa48("33707") ? () => undefined : (stryCov_9fa48("33707"), (sum, n) => stryMutAct_9fa48("33708") ? sum - n.powerDraw : (stryCov_9fa48("33708"), sum + n.powerDraw)), 0),
    costPerHour: nodes.reduce(stryMutAct_9fa48("33709") ? () => undefined : (stryCov_9fa48("33709"), (sum, n) => stryMutAct_9fa48("33710") ? sum - n.powerDraw * 0.12 / 1000 : (stryCov_9fa48("33710"), sum + (stryMutAct_9fa48("33711") ? n.powerDraw * 0.12 * 1000 : (stryCov_9fa48("33711"), (stryMutAct_9fa48("33712") ? n.powerDraw / 0.12 : (stryCov_9fa48("33712"), n.powerDraw * 0.12)) / 1000)))), 0),
    // $0.12/kWh
    uptime: 99.97
  });
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const SovereignPage: React.FC = () => {
  const navigate = useNavigate();
  const [nodes, setNodes] = useState<GPUNode[]>(stryMutAct_9fa48("33714") ? ["Stryker was here"] : (stryCov_9fa48("33714"), []));
  const [models, setModels] = useState<DeployedModel[]>(stryMutAct_9fa48("33715") ? ["Stryker was here"] : (stryCov_9fa48("33715"), []));
  const [failovers] = useState<FailoverConfig[]>(stryMutAct_9fa48("33716") ? ["Stryker was here"] : (stryCov_9fa48("33716"), []));
  const [sandboxes] = useState<ComplianceSandbox[]>(stryMutAct_9fa48("33717") ? ["Stryker was here"] : (stryCov_9fa48("33717"), []));
  const [selectedNode, setSelectedNode] = useState<GPUNode | null>(null);
  const [selectedModel, setSelectedModel] = useState<DeployedModel | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'nodes' | 'models' | 'routing' | 'sandbox'>('overview');
  const [inferenceMode, setInferenceMode] = useState<InferenceMode>('balanced');
  const [metrics, setMetrics] = useState<ClusterMetrics | null>(null);
  const [ollamaStatus, setOllamaStatus] = useState(stryMutAct_9fa48("33720") ? {} : (stryCov_9fa48("33720"), {
    available: stryMutAct_9fa48("33721") ? true : (stryCov_9fa48("33721"), false),
    models: [] as string[]
  }));

  // Load data from EnterpriseService & API
  const loadData = useCallback(async () => {
    // Try to fetch from API first
    try {
      const snapshotsRes = await decisionIntelApi.getChronosSnapshots();
      if (stryMutAct_9fa48("33726") ? snapshotsRes.success || snapshotsRes.data : stryMutAct_9fa48("33725") ? false : stryMutAct_9fa48("33724") ? true : (stryCov_9fa48("33724", "33725", "33726"), snapshotsRes.success && snapshotsRes.data)) {
        console.log('[Sovereign] Loaded', snapshotsRes.data.length, 'system snapshots');
      }
    } catch (error) {
      console.log('[Sovereign] API unavailable, using local service');
    }

    // Fall back to enterprise service
    enterpriseService.refreshOllamaStatus();
    setNodes(enterpriseService.getGPUNodes());
    setModels(enterpriseService.getDeployedModels());
    setMetrics(enterpriseService.getClusterMetrics());
    setOllamaStatus(ollamaService.getStatus());
  }, stryMutAct_9fa48("33732") ? ["Stryker was here"] : (stryCov_9fa48("33732"), []));

  // Live updates
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return stryMutAct_9fa48("33734") ? () => undefined : (stryCov_9fa48("33734"), () => clearInterval(interval));
  }, stryMutAct_9fa48("33735") ? [] : (stryCov_9fa48("33735"), [loadData]));
  return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-indigo-800/50 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={stryMutAct_9fa48("33736") ? () => undefined : (stryCov_9fa48("33736"), () => navigate('/cortex/dashboard'))} className="text-white/60 hover:text-white transition-colors">
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-3xl">🏰</span>
                  CendiaSovereign™
                  <span className="text-xs bg-gradient-to-r from-indigo-500 to-purple-500 px-2 py-0.5 rounded-full font-medium">
                    ENTERPRISE
                  </span>
                </h1>
                <p className="text-indigo-300 text-sm">Fully Local LLM Cluster Orchestrator • Zero Cloud Dependencies</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Inference Mode Selector */}
              <div className="flex items-center gap-2 bg-black/30 rounded-lg p-1">
                {(['balanced', 'latency', 'throughput', 'cost'] as InferenceMode[]).map(stryMutAct_9fa48("33738") ? () => undefined : (stryCov_9fa48("33738"), mode => <button key={mode} onClick={stryMutAct_9fa48("33739") ? () => undefined : (stryCov_9fa48("33739"), () => setInferenceMode(mode))} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${(stryMutAct_9fa48("33743") ? inferenceMode !== mode : stryMutAct_9fa48("33742") ? false : stryMutAct_9fa48("33741") ? true : (stryCov_9fa48("33741", "33742", "33743"), inferenceMode === mode)) ? 'bg-indigo-600 text-white' : 'text-white/60 hover:text-white'}`}>
                    {stryMutAct_9fa48("33746") ? mode.charAt(0).toUpperCase() - mode.slice(1) : (stryCov_9fa48("33746"), (stryMutAct_9fa48("33748") ? mode.toUpperCase() : stryMutAct_9fa48("33747") ? mode.charAt(0).toLowerCase() : (stryCov_9fa48("33747", "33748"), mode.charAt(0).toUpperCase())) + (stryMutAct_9fa48("33749") ? mode : (stryCov_9fa48("33749"), mode.slice(1))))}
                  </button>))}
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm text-green-400">Cluster Healthy</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Cluster Metrics Bar */}
      <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border-b border-indigo-800/30">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="grid grid-cols-8 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{stryMutAct_9fa48("33750") ? metrics?.onlineNodes && 0 : (stryCov_9fa48("33750"), (stryMutAct_9fa48("33751") ? metrics.onlineNodes : (stryCov_9fa48("33751"), metrics?.onlineNodes)) ?? 0)}/{stryMutAct_9fa48("33752") ? metrics?.totalNodes && 0 : (stryCov_9fa48("33752"), (stryMutAct_9fa48("33753") ? metrics.totalNodes : (stryCov_9fa48("33753"), metrics?.totalNodes)) ?? 0)}</div>
              <div className="text-xs text-indigo-300">Nodes Online</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stryMutAct_9fa48("33754") ? metrics?.activeGPUs && 0 : (stryCov_9fa48("33754"), (stryMutAct_9fa48("33755") ? metrics.activeGPUs : (stryCov_9fa48("33755"), metrics?.activeGPUs)) ?? 0)}</div>
              <div className="text-xs text-indigo-300">Active GPUs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{(stryMutAct_9fa48("33756") ? metrics.totalVRAM : (stryCov_9fa48("33756"), metrics?.totalVRAM)) ? Math.round(stryMutAct_9fa48("33757") ? metrics.usedVRAM / metrics.totalVRAM / 100 : (stryCov_9fa48("33757"), (stryMutAct_9fa48("33758") ? metrics.usedVRAM * metrics.totalVRAM : (stryCov_9fa48("33758"), metrics.usedVRAM / metrics.totalVRAM)) * 100)) : 0}%</div>
              <div className="text-xs text-indigo-300">VRAM Used</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{stryMutAct_9fa48("33759") ? metrics?.activeModels && 0 : (stryCov_9fa48("33759"), (stryMutAct_9fa48("33760") ? metrics.activeModels : (stryCov_9fa48("33760"), metrics?.activeModels)) ?? 0)}</div>
              <div className="text-xs text-indigo-300">Active Models</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">{stryMutAct_9fa48("33761") ? metrics?.requestsPerSecond?.toFixed(1) && '0.0' : (stryCov_9fa48("33761"), (stryMutAct_9fa48("33763") ? metrics.requestsPerSecond?.toFixed(1) : stryMutAct_9fa48("33762") ? metrics?.requestsPerSecond.toFixed(1) : (stryCov_9fa48("33762", "33763"), metrics?.requestsPerSecond?.toFixed(1))) ?? '0.0')}</div>
              <div className="text-xs text-indigo-300">Req/sec</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">{Math.round(stryMutAct_9fa48("33765") ? metrics?.avgLatency && 0 : (stryCov_9fa48("33765"), (stryMutAct_9fa48("33766") ? metrics.avgLatency : (stryCov_9fa48("33766"), metrics?.avgLatency)) ?? 0))}ms</div>
              <div className="text-xs text-indigo-300">Avg Latency</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{(stryMutAct_9fa48("33767") ? (metrics?.tokensPerSecond ?? 0) * 1000 : (stryCov_9fa48("33767"), (stryMutAct_9fa48("33768") ? metrics?.tokensPerSecond && 0 : (stryCov_9fa48("33768"), (stryMutAct_9fa48("33769") ? metrics.tokensPerSecond : (stryCov_9fa48("33769"), metrics?.tokensPerSecond)) ?? 0)) / 1000)).toFixed(1)}K</div>
              <div className="text-xs text-indigo-300">Tokens/sec</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">{stryMutAct_9fa48("33770") ? metrics?.uptime && 0 : (stryCov_9fa48("33770"), (stryMutAct_9fa48("33771") ? metrics.uptime : (stryCov_9fa48("33771"), metrics?.uptime)) ?? 0)}%</div>
              <div className="text-xs text-indigo-300">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-indigo-800/30 bg-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {(stryMutAct_9fa48("33772") ? [] : (stryCov_9fa48("33772"), [stryMutAct_9fa48("33773") ? {} : (stryCov_9fa48("33773"), {
            id: 'overview',
            label: 'Cluster Overview',
            icon: '📊'
          }), stryMutAct_9fa48("33777") ? {} : (stryCov_9fa48("33777"), {
            id: 'nodes',
            label: 'GPU Nodes',
            icon: '🖥️'
          }), stryMutAct_9fa48("33781") ? {} : (stryCov_9fa48("33781"), {
            id: 'models',
            label: 'Deployed Models',
            icon: '🤖'
          }), stryMutAct_9fa48("33785") ? {} : (stryCov_9fa48("33785"), {
            id: 'routing',
            label: 'Smart Routing',
            icon: '🔀'
          }), stryMutAct_9fa48("33789") ? {} : (stryCov_9fa48("33789"), {
            id: 'sandbox',
            label: 'Compliance Sandbox',
            icon: '🔬'
          })])).map(stryMutAct_9fa48("33793") ? () => undefined : (stryCov_9fa48("33793"), tab => <button key={tab.id} onClick={stryMutAct_9fa48("33794") ? () => undefined : (stryCov_9fa48("33794"), () => setActiveTab(tab.id as any))} className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${(stryMutAct_9fa48("33798") ? activeTab !== tab.id : stryMutAct_9fa48("33797") ? false : stryMutAct_9fa48("33796") ? true : (stryCov_9fa48("33796", "33797", "33798"), activeTab === tab.id)) ? 'border-indigo-400 text-white bg-indigo-900/20' : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'}`}>
                {tab.icon} {tab.label}
              </button>))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {stryMutAct_9fa48("33803") ? activeTab === 'overview' || <div className="space-y-6">
            {/* Cluster Architecture Visualization */}
            <div className="bg-black/30 rounded-2xl p-6 border border-indigo-800/50">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                🏗️ Cluster Architecture
              </h2>
              <div className="grid grid-cols-4 gap-4">
                {nodes.map(node => <div key={node.id} onClick={() => setSelectedNode(node)} className={`p-4 rounded-xl border cursor-pointer transition-all ${node.status === 'online' ? 'bg-green-900/20 border-green-700/50 hover:border-green-500' : node.status === 'busy' ? 'bg-amber-900/20 border-amber-700/50 hover:border-amber-500' : node.status === 'draining' ? 'bg-blue-900/20 border-blue-700/50 hover:border-blue-500' : 'bg-red-900/20 border-red-700/50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{node.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${node.zone === 'air-gapped' ? 'bg-red-600' : node.zone === 'edge' ? 'bg-amber-600' : 'bg-indigo-600'}`}>
                        {node.zone}
                      </span>
                    </div>
                    <div className="text-xs text-white/60 mb-3">{node.gpuCount}× {node.gpuType}</div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/50">VRAM</span>
                        <span>{node.usedVRAM}/{node.totalVRAM} GB</span>
                      </div>
                      <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                        <div className={`h-full transition-all ${node.usedVRAM / node.totalVRAM > 0.9 ? 'bg-red-500' : node.usedVRAM / node.totalVRAM > 0.7 ? 'bg-amber-500' : 'bg-green-500'}`} style={{
                    width: `${node.usedVRAM / node.totalVRAM * 100}%`
                  }} />
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-white/50">{node.requestsPerSecond} req/s</span>
                        <span className="text-white/50">{node.avgLatency}ms</span>
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-6">
              {/* Active Models */}
              <div className="bg-black/30 rounded-2xl p-6 border border-indigo-800/50">
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Hot Models</h3>
                <div className="space-y-3">
                  {models.filter(m => m.status === 'active').slice(0, 5).map(model => <div key={model.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{model.name}</div>
                        <div className="text-xs text-white/50">{model.parameters} • {model.quantization}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-cyan-400">{model.requestsToday.toLocaleString()}</div>
                        <div className="text-xs text-white/50">requests</div>
                      </div>
                    </div>)}
                </div>
              </div>

              {/* Power & Cost */}
              <div className="bg-black/30 rounded-2xl p-6 border border-indigo-800/50">
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Power & Cost</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-white/60">Power Draw</span>
                      <span className="font-bold text-amber-400">{((metrics?.powerConsumption ?? 0) / 1000).toFixed(1)} kW</span>
                    </div>
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 via-amber-500 to-red-500 w-3/4" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-green-400">${(metrics?.costPerHour ?? 0).toFixed(2)}</div>
                      <div className="text-xs text-white/50">per hour</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-green-400">${((metrics?.costPerHour ?? 0) * 24 * 30).toFixed(0)}</div>
                      <div className="text-xs text-white/50">per month</div>
                    </div>
                  </div>
                  <div className="text-xs text-white/40 text-center">
                    Cost per 1M tokens: ${((metrics?.costPerHour ?? 0) * 3600 / (metrics?.tokensPerSecond || 1) * 1000000 / 3600).toFixed(4)}
                  </div>
                </div>
              </div>

              {/* Failover Status */}
              <div className="bg-black/30 rounded-2xl p-6 border border-indigo-800/50">
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">High Availability</h3>
                <div className="space-y-3">
                  {failovers.map(fo => {
                const primaryModel = models.find(m => m.id === fo.primaryModel);
                return <div key={fo.id} className="p-3 bg-black/20 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{primaryModel?.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${fo.isActive ? 'bg-green-600' : 'bg-neutral-600'}`}>
                            {fo.isActive ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                        <div className="text-xs text-white/50">
                          {fo.fallbackModels.length} fallback models configured
                        </div>
                        {fo.lastTriggered && <div className="text-xs text-amber-400 mt-1">
                            Last triggered: {Math.floor((Date.now() - fo.lastTriggered.getTime()) / 3600000)}h ago
                          </div>}
                      </div>;
              })}
                </div>
              </div>
            </div>
          </div> : stryMutAct_9fa48("33802") ? false : stryMutAct_9fa48("33801") ? true : (stryCov_9fa48("33801", "33802", "33803"), (stryMutAct_9fa48("33805") ? activeTab !== 'overview' : stryMutAct_9fa48("33804") ? true : (stryCov_9fa48("33804", "33805"), activeTab === 'overview')) && <div className="space-y-6">
            {/* Cluster Architecture Visualization */}
            <div className="bg-black/30 rounded-2xl p-6 border border-indigo-800/50">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                🏗️ Cluster Architecture
              </h2>
              <div className="grid grid-cols-4 gap-4">
                {nodes.map(stryMutAct_9fa48("33807") ? () => undefined : (stryCov_9fa48("33807"), node => <div key={node.id} onClick={stryMutAct_9fa48("33808") ? () => undefined : (stryCov_9fa48("33808"), () => setSelectedNode(node))} className={`p-4 rounded-xl border cursor-pointer transition-all ${(stryMutAct_9fa48("33812") ? node.status !== 'online' : stryMutAct_9fa48("33811") ? false : stryMutAct_9fa48("33810") ? true : (stryCov_9fa48("33810", "33811", "33812"), node.status === 'online')) ? 'bg-green-900/20 border-green-700/50 hover:border-green-500' : (stryMutAct_9fa48("33817") ? node.status !== 'busy' : stryMutAct_9fa48("33816") ? false : stryMutAct_9fa48("33815") ? true : (stryCov_9fa48("33815", "33816", "33817"), node.status === 'busy')) ? 'bg-amber-900/20 border-amber-700/50 hover:border-amber-500' : (stryMutAct_9fa48("33822") ? node.status !== 'draining' : stryMutAct_9fa48("33821") ? false : stryMutAct_9fa48("33820") ? true : (stryCov_9fa48("33820", "33821", "33822"), node.status === 'draining')) ? 'bg-blue-900/20 border-blue-700/50 hover:border-blue-500' : 'bg-red-900/20 border-red-700/50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{node.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${(stryMutAct_9fa48("33829") ? node.zone !== 'air-gapped' : stryMutAct_9fa48("33828") ? false : stryMutAct_9fa48("33827") ? true : (stryCov_9fa48("33827", "33828", "33829"), node.zone === 'air-gapped')) ? 'bg-red-600' : (stryMutAct_9fa48("33834") ? node.zone !== 'edge' : stryMutAct_9fa48("33833") ? false : stryMutAct_9fa48("33832") ? true : (stryCov_9fa48("33832", "33833", "33834"), node.zone === 'edge')) ? 'bg-amber-600' : 'bg-indigo-600'}`}>
                        {node.zone}
                      </span>
                    </div>
                    <div className="text-xs text-white/60 mb-3">{node.gpuCount}× {node.gpuType}</div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/50">VRAM</span>
                        <span>{node.usedVRAM}/{node.totalVRAM} GB</span>
                      </div>
                      <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                        <div className={`h-full transition-all ${(stryMutAct_9fa48("33842") ? node.usedVRAM / node.totalVRAM <= 0.9 : stryMutAct_9fa48("33841") ? node.usedVRAM / node.totalVRAM >= 0.9 : stryMutAct_9fa48("33840") ? false : stryMutAct_9fa48("33839") ? true : (stryCov_9fa48("33839", "33840", "33841", "33842"), (stryMutAct_9fa48("33843") ? node.usedVRAM * node.totalVRAM : (stryCov_9fa48("33843"), node.usedVRAM / node.totalVRAM)) > 0.9)) ? 'bg-red-500' : (stryMutAct_9fa48("33848") ? node.usedVRAM / node.totalVRAM <= 0.7 : stryMutAct_9fa48("33847") ? node.usedVRAM / node.totalVRAM >= 0.7 : stryMutAct_9fa48("33846") ? false : stryMutAct_9fa48("33845") ? true : (stryCov_9fa48("33845", "33846", "33847", "33848"), (stryMutAct_9fa48("33849") ? node.usedVRAM * node.totalVRAM : (stryCov_9fa48("33849"), node.usedVRAM / node.totalVRAM)) > 0.7)) ? 'bg-amber-500' : 'bg-green-500'}`} style={stryMutAct_9fa48("33852") ? {} : (stryCov_9fa48("33852"), {
                    width: `${stryMutAct_9fa48("33854") ? node.usedVRAM / node.totalVRAM / 100 : (stryCov_9fa48("33854"), (stryMutAct_9fa48("33855") ? node.usedVRAM * node.totalVRAM : (stryCov_9fa48("33855"), node.usedVRAM / node.totalVRAM)) * 100)}%`
                  })} />
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-white/50">{node.requestsPerSecond} req/s</span>
                        <span className="text-white/50">{node.avgLatency}ms</span>
                      </div>
                    </div>
                  </div>))}
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-6">
              {/* Active Models */}
              <div className="bg-black/30 rounded-2xl p-6 border border-indigo-800/50">
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Hot Models</h3>
                <div className="space-y-3">
                  {stryMutAct_9fa48("33857") ? models.slice(0, 5).map(model => <div key={model.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{model.name}</div>
                        <div className="text-xs text-white/50">{model.parameters} • {model.quantization}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-cyan-400">{model.requestsToday.toLocaleString()}</div>
                        <div className="text-xs text-white/50">requests</div>
                      </div>
                    </div>) : stryMutAct_9fa48("33856") ? models.filter(m => m.status === 'active').map(model => <div key={model.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{model.name}</div>
                        <div className="text-xs text-white/50">{model.parameters} • {model.quantization}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-cyan-400">{model.requestsToday.toLocaleString()}</div>
                        <div className="text-xs text-white/50">requests</div>
                      </div>
                    </div>) : (stryCov_9fa48("33856", "33857"), models.filter(stryMutAct_9fa48("33858") ? () => undefined : (stryCov_9fa48("33858"), m => stryMutAct_9fa48("33861") ? m.status !== 'active' : stryMutAct_9fa48("33860") ? false : stryMutAct_9fa48("33859") ? true : (stryCov_9fa48("33859", "33860", "33861"), m.status === 'active'))).slice(0, 5).map(stryMutAct_9fa48("33863") ? () => undefined : (stryCov_9fa48("33863"), model => <div key={model.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{model.name}</div>
                        <div className="text-xs text-white/50">{model.parameters} • {model.quantization}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-cyan-400">{model.requestsToday.toLocaleString()}</div>
                        <div className="text-xs text-white/50">requests</div>
                      </div>
                    </div>)))}
                </div>
              </div>

              {/* Power & Cost */}
              <div className="bg-black/30 rounded-2xl p-6 border border-indigo-800/50">
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Power & Cost</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-white/60">Power Draw</span>
                      <span className="font-bold text-amber-400">{(stryMutAct_9fa48("33864") ? (metrics?.powerConsumption ?? 0) * 1000 : (stryCov_9fa48("33864"), (stryMutAct_9fa48("33865") ? metrics?.powerConsumption && 0 : (stryCov_9fa48("33865"), (stryMutAct_9fa48("33866") ? metrics.powerConsumption : (stryCov_9fa48("33866"), metrics?.powerConsumption)) ?? 0)) / 1000)).toFixed(1)} kW</span>
                    </div>
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 via-amber-500 to-red-500 w-3/4" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-green-400">${(stryMutAct_9fa48("33867") ? metrics?.costPerHour && 0 : (stryCov_9fa48("33867"), (stryMutAct_9fa48("33868") ? metrics.costPerHour : (stryCov_9fa48("33868"), metrics?.costPerHour)) ?? 0)).toFixed(2)}</div>
                      <div className="text-xs text-white/50">per hour</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-green-400">${(stryMutAct_9fa48("33869") ? (metrics?.costPerHour ?? 0) * 24 / 30 : (stryCov_9fa48("33869"), (stryMutAct_9fa48("33870") ? (metrics?.costPerHour ?? 0) / 24 : (stryCov_9fa48("33870"), (stryMutAct_9fa48("33871") ? metrics?.costPerHour && 0 : (stryCov_9fa48("33871"), (stryMutAct_9fa48("33872") ? metrics.costPerHour : (stryCov_9fa48("33872"), metrics?.costPerHour)) ?? 0)) * 24)) * 30)).toFixed(0)}</div>
                      <div className="text-xs text-white/50">per month</div>
                    </div>
                  </div>
                  <div className="text-xs text-white/40 text-center">
                    Cost per 1M tokens: ${(stryMutAct_9fa48("33873") ? (metrics?.costPerHour ?? 0) * 3600 / (metrics?.tokensPerSecond || 1) * 1000000 * 3600 : (stryCov_9fa48("33873"), (stryMutAct_9fa48("33874") ? (metrics?.costPerHour ?? 0) * 3600 / (metrics?.tokensPerSecond || 1) / 1000000 : (stryCov_9fa48("33874"), (stryMutAct_9fa48("33875") ? (metrics?.costPerHour ?? 0) * 3600 * (metrics?.tokensPerSecond || 1) : (stryCov_9fa48("33875"), (stryMutAct_9fa48("33876") ? (metrics?.costPerHour ?? 0) / 3600 : (stryCov_9fa48("33876"), (stryMutAct_9fa48("33877") ? metrics?.costPerHour && 0 : (stryCov_9fa48("33877"), (stryMutAct_9fa48("33878") ? metrics.costPerHour : (stryCov_9fa48("33878"), metrics?.costPerHour)) ?? 0)) * 3600)) / (stryMutAct_9fa48("33881") ? metrics?.tokensPerSecond && 1 : stryMutAct_9fa48("33880") ? false : stryMutAct_9fa48("33879") ? true : (stryCov_9fa48("33879", "33880", "33881"), (stryMutAct_9fa48("33882") ? metrics.tokensPerSecond : (stryCov_9fa48("33882"), metrics?.tokensPerSecond)) || 1)))) * 1000000)) / 3600)).toFixed(4)}
                  </div>
                </div>
              </div>

              {/* Failover Status */}
              <div className="bg-black/30 rounded-2xl p-6 border border-indigo-800/50">
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">High Availability</h3>
                <div className="space-y-3">
                  {failovers.map(fo => {
                const primaryModel = models.find(stryMutAct_9fa48("33884") ? () => undefined : (stryCov_9fa48("33884"), m => stryMutAct_9fa48("33887") ? m.id !== fo.primaryModel : stryMutAct_9fa48("33886") ? false : stryMutAct_9fa48("33885") ? true : (stryCov_9fa48("33885", "33886", "33887"), m.id === fo.primaryModel)));
                return <div key={fo.id} className="p-3 bg-black/20 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{stryMutAct_9fa48("33888") ? primaryModel.name : (stryCov_9fa48("33888"), primaryModel?.name)}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${fo.isActive ? 'bg-green-600' : 'bg-neutral-600'}`}>
                            {fo.isActive ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                        <div className="text-xs text-white/50">
                          {fo.fallbackModels.length} fallback models configured
                        </div>
                        {stryMutAct_9fa48("33896") ? fo.lastTriggered || <div className="text-xs text-amber-400 mt-1">
                            Last triggered: {Math.floor((Date.now() - fo.lastTriggered.getTime()) / 3600000)}h ago
                          </div> : stryMutAct_9fa48("33895") ? false : stryMutAct_9fa48("33894") ? true : (stryCov_9fa48("33894", "33895", "33896"), fo.lastTriggered && <div className="text-xs text-amber-400 mt-1">
                            Last triggered: {Math.floor(stryMutAct_9fa48("33897") ? (Date.now() - fo.lastTriggered.getTime()) * 3600000 : (stryCov_9fa48("33897"), (stryMutAct_9fa48("33898") ? Date.now() + fo.lastTriggered.getTime() : (stryCov_9fa48("33898"), Date.now() - fo.lastTriggered.getTime())) / 3600000))}h ago
                          </div>)}
                      </div>;
              })}
                </div>
              </div>
            </div>
          </div>)}

        {stryMutAct_9fa48("33901") ? activeTab === 'nodes' || <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {nodes.map(node => <div key={node.id} className="bg-black/30 rounded-2xl p-6 border border-indigo-800/50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{node.name}</h3>
                      <div className="text-sm text-white/50">{node.hostname}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-lg text-sm ${node.status === 'online' ? 'bg-green-600' : node.status === 'busy' ? 'bg-amber-600' : node.status === 'draining' ? 'bg-blue-600' : 'bg-red-600'}`}>
                        {node.status}
                      </span>
                      <span className={`px-3 py-1 rounded-lg text-sm ${node.zone === 'air-gapped' ? 'bg-red-900 text-red-300' : node.zone === 'edge' ? 'bg-amber-900 text-amber-300' : 'bg-indigo-900 text-indigo-300'}`}>
                        {node.zone}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold">{node.gpuCount}×</div>
                      <div className="text-xs text-white/50">{node.gpuType}</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold">{node.totalVRAM}GB</div>
                      <div className="text-xs text-white/50">VRAM Total</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-cyan-400">{node.requestsPerSecond}</div>
                      <div className="text-xs text-white/50">Req/sec</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-amber-400">{node.avgLatency}ms</div>
                      <div className="text-xs text-white/50">Latency</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/60">VRAM Usage</span>
                        <span>{node.usedVRAM}/{node.totalVRAM} GB ({Math.round(node.usedVRAM / node.totalVRAM * 100)}%)</span>
                      </div>
                      <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                        <div className={`h-full ${node.usedVRAM / node.totalVRAM > 0.9 ? 'bg-red-500' : node.usedVRAM / node.totalVRAM > 0.7 ? 'bg-amber-500' : 'bg-green-500'}`} style={{
                    width: `${node.usedVRAM / node.totalVRAM * 100}%`
                  }} />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="p-2 bg-black/20 rounded-lg">
                        <span className="text-white/50">Temp:</span> <span className={node.temperature > 70 ? 'text-red-400' : 'text-green-400'}>{node.temperature}°C</span>
                      </div>
                      <div className="p-2 bg-black/20 rounded-lg">
                        <span className="text-white/50">Power:</span> <span>{node.powerDraw}W</span>
                      </div>
                      <div className="p-2 bg-black/20 rounded-lg">
                        <span className="text-white/50">Uptime:</span> <span>{Math.floor(node.uptime / 24)}d {node.uptime % 24}h</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-white/50 mb-2">Loaded Models:</div>
                      <div className="flex flex-wrap gap-1">
                        {node.loadedModels.map(m => <span key={m} className="text-xs px-2 py-1 bg-indigo-900/50 rounded">{m}</span>)}
                      </div>
                    </div>
                  </div>
                </div>)}
            </div>
          </div> : stryMutAct_9fa48("33900") ? false : stryMutAct_9fa48("33899") ? true : (stryCov_9fa48("33899", "33900", "33901"), (stryMutAct_9fa48("33903") ? activeTab !== 'nodes' : stryMutAct_9fa48("33902") ? true : (stryCov_9fa48("33902", "33903"), activeTab === 'nodes')) && <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {nodes.map(stryMutAct_9fa48("33905") ? () => undefined : (stryCov_9fa48("33905"), node => <div key={node.id} className="bg-black/30 rounded-2xl p-6 border border-indigo-800/50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{node.name}</h3>
                      <div className="text-sm text-white/50">{node.hostname}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-lg text-sm ${(stryMutAct_9fa48("33909") ? node.status !== 'online' : stryMutAct_9fa48("33908") ? false : stryMutAct_9fa48("33907") ? true : (stryCov_9fa48("33907", "33908", "33909"), node.status === 'online')) ? 'bg-green-600' : (stryMutAct_9fa48("33914") ? node.status !== 'busy' : stryMutAct_9fa48("33913") ? false : stryMutAct_9fa48("33912") ? true : (stryCov_9fa48("33912", "33913", "33914"), node.status === 'busy')) ? 'bg-amber-600' : (stryMutAct_9fa48("33919") ? node.status !== 'draining' : stryMutAct_9fa48("33918") ? false : stryMutAct_9fa48("33917") ? true : (stryCov_9fa48("33917", "33918", "33919"), node.status === 'draining')) ? 'bg-blue-600' : 'bg-red-600'}`}>
                        {node.status}
                      </span>
                      <span className={`px-3 py-1 rounded-lg text-sm ${(stryMutAct_9fa48("33926") ? node.zone !== 'air-gapped' : stryMutAct_9fa48("33925") ? false : stryMutAct_9fa48("33924") ? true : (stryCov_9fa48("33924", "33925", "33926"), node.zone === 'air-gapped')) ? 'bg-red-900 text-red-300' : (stryMutAct_9fa48("33931") ? node.zone !== 'edge' : stryMutAct_9fa48("33930") ? false : stryMutAct_9fa48("33929") ? true : (stryCov_9fa48("33929", "33930", "33931"), node.zone === 'edge')) ? 'bg-amber-900 text-amber-300' : 'bg-indigo-900 text-indigo-300'}`}>
                        {node.zone}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold">{node.gpuCount}×</div>
                      <div className="text-xs text-white/50">{node.gpuType}</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold">{node.totalVRAM}GB</div>
                      <div className="text-xs text-white/50">VRAM Total</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-cyan-400">{node.requestsPerSecond}</div>
                      <div className="text-xs text-white/50">Req/sec</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-amber-400">{node.avgLatency}ms</div>
                      <div className="text-xs text-white/50">Latency</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/60">VRAM Usage</span>
                        <span>{node.usedVRAM}/{node.totalVRAM} GB ({Math.round(stryMutAct_9fa48("33935") ? node.usedVRAM / node.totalVRAM / 100 : (stryCov_9fa48("33935"), (stryMutAct_9fa48("33936") ? node.usedVRAM * node.totalVRAM : (stryCov_9fa48("33936"), node.usedVRAM / node.totalVRAM)) * 100))}%)</span>
                      </div>
                      <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                        <div className={`h-full ${(stryMutAct_9fa48("33941") ? node.usedVRAM / node.totalVRAM <= 0.9 : stryMutAct_9fa48("33940") ? node.usedVRAM / node.totalVRAM >= 0.9 : stryMutAct_9fa48("33939") ? false : stryMutAct_9fa48("33938") ? true : (stryCov_9fa48("33938", "33939", "33940", "33941"), (stryMutAct_9fa48("33942") ? node.usedVRAM * node.totalVRAM : (stryCov_9fa48("33942"), node.usedVRAM / node.totalVRAM)) > 0.9)) ? 'bg-red-500' : (stryMutAct_9fa48("33947") ? node.usedVRAM / node.totalVRAM <= 0.7 : stryMutAct_9fa48("33946") ? node.usedVRAM / node.totalVRAM >= 0.7 : stryMutAct_9fa48("33945") ? false : stryMutAct_9fa48("33944") ? true : (stryCov_9fa48("33944", "33945", "33946", "33947"), (stryMutAct_9fa48("33948") ? node.usedVRAM * node.totalVRAM : (stryCov_9fa48("33948"), node.usedVRAM / node.totalVRAM)) > 0.7)) ? 'bg-amber-500' : 'bg-green-500'}`} style={stryMutAct_9fa48("33951") ? {} : (stryCov_9fa48("33951"), {
                    width: `${stryMutAct_9fa48("33953") ? node.usedVRAM / node.totalVRAM / 100 : (stryCov_9fa48("33953"), (stryMutAct_9fa48("33954") ? node.usedVRAM * node.totalVRAM : (stryCov_9fa48("33954"), node.usedVRAM / node.totalVRAM)) * 100)}%`
                  })} />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="p-2 bg-black/20 rounded-lg">
                        <span className="text-white/50">Temp:</span> <span className={(stryMutAct_9fa48("33958") ? node.temperature <= 70 : stryMutAct_9fa48("33957") ? node.temperature >= 70 : stryMutAct_9fa48("33956") ? false : stryMutAct_9fa48("33955") ? true : (stryCov_9fa48("33955", "33956", "33957", "33958"), node.temperature > 70)) ? 'text-red-400' : 'text-green-400'}>{node.temperature}°C</span>
                      </div>
                      <div className="p-2 bg-black/20 rounded-lg">
                        <span className="text-white/50">Power:</span> <span>{node.powerDraw}W</span>
                      </div>
                      <div className="p-2 bg-black/20 rounded-lg">
                        <span className="text-white/50">Uptime:</span> <span>{Math.floor(stryMutAct_9fa48("33961") ? node.uptime * 24 : (stryCov_9fa48("33961"), node.uptime / 24))}d {stryMutAct_9fa48("33962") ? node.uptime * 24 : (stryCov_9fa48("33962"), node.uptime % 24)}h</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-white/50 mb-2">Loaded Models:</div>
                      <div className="flex flex-wrap gap-1">
                        {node.loadedModels.map(stryMutAct_9fa48("33963") ? () => undefined : (stryCov_9fa48("33963"), m => <span key={m} className="text-xs px-2 py-1 bg-indigo-900/50 rounded">{m}</span>))}
                      </div>
                    </div>
                  </div>
                </div>))}
            </div>
          </div>)}

        {stryMutAct_9fa48("33966") ? activeTab === 'models' || <div className="space-y-4">
            {models.map(model => <div key={model.id} className="bg-black/30 rounded-2xl p-6 border border-indigo-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${model.family === 'llama' ? 'bg-blue-900' : model.family === 'mistral' ? 'bg-orange-900' : model.family === 'qwen' ? 'bg-purple-900' : model.family === 'deepseek' ? 'bg-cyan-900' : 'bg-neutral-800'}`}>
                      🤖
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{model.name}</h3>
                      <div className="text-sm text-white/50">
                        {model.parameters} • {model.quantization} • {model.contextLength.toLocaleString()} ctx
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-lg text-sm ${model.status === 'active' ? 'bg-green-600' : model.status === 'loading' ? 'bg-amber-600' : model.status === 'sandboxed' ? 'bg-purple-600' : 'bg-neutral-600'}`}>
                      {model.status}
                    </span>
                    <span className={`px-3 py-1 rounded-lg text-sm ${model.complianceStatus === 'approved' ? 'bg-green-900 text-green-300' : model.complianceStatus === 'pending' ? 'bg-amber-900 text-amber-300' : model.complianceStatus === 'review' ? 'bg-blue-900 text-blue-300' : 'bg-red-900 text-red-300'}`}>
                      {model.complianceStatus}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-4 mt-4">
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold text-cyan-400">{model.requestsToday.toLocaleString()}</div>
                    <div className="text-xs text-white/50">Requests Today</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold text-purple-400">{(model.tokensGenerated / 1000000).toFixed(1)}M</div>
                    <div className="text-xs text-white/50">Tokens Generated</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold text-amber-400">{model.avgResponseTime}ms</div>
                    <div className="text-xs text-white/50">Avg Response</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold">{model.vramRequired}GB</div>
                    <div className="text-xs text-white/50">VRAM Required</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold text-green-400">{model.replicas}</div>
                    <div className="text-xs text-white/50">Replicas</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold">{model.nodes.length}</div>
                    <div className="text-xs text-white/50">Nodes</div>
                  </div>
                </div>
              </div>)}
          </div> : stryMutAct_9fa48("33965") ? false : stryMutAct_9fa48("33964") ? true : (stryCov_9fa48("33964", "33965", "33966"), (stryMutAct_9fa48("33968") ? activeTab !== 'models' : stryMutAct_9fa48("33967") ? true : (stryCov_9fa48("33967", "33968"), activeTab === 'models')) && <div className="space-y-4">
            {models.map(stryMutAct_9fa48("33970") ? () => undefined : (stryCov_9fa48("33970"), model => <div key={model.id} className="bg-black/30 rounded-2xl p-6 border border-indigo-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${(stryMutAct_9fa48("33974") ? model.family !== 'llama' : stryMutAct_9fa48("33973") ? false : stryMutAct_9fa48("33972") ? true : (stryCov_9fa48("33972", "33973", "33974"), model.family === 'llama')) ? 'bg-blue-900' : (stryMutAct_9fa48("33979") ? model.family !== 'mistral' : stryMutAct_9fa48("33978") ? false : stryMutAct_9fa48("33977") ? true : (stryCov_9fa48("33977", "33978", "33979"), model.family === 'mistral')) ? 'bg-orange-900' : (stryMutAct_9fa48("33984") ? model.family !== 'qwen' : stryMutAct_9fa48("33983") ? false : stryMutAct_9fa48("33982") ? true : (stryCov_9fa48("33982", "33983", "33984"), model.family === 'qwen')) ? 'bg-purple-900' : (stryMutAct_9fa48("33989") ? model.family !== 'deepseek' : stryMutAct_9fa48("33988") ? false : stryMutAct_9fa48("33987") ? true : (stryCov_9fa48("33987", "33988", "33989"), model.family === 'deepseek')) ? 'bg-cyan-900' : 'bg-neutral-800'}`}>
                      🤖
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{model.name}</h3>
                      <div className="text-sm text-white/50">
                        {model.parameters} • {model.quantization} • {model.contextLength.toLocaleString()} ctx
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-lg text-sm ${(stryMutAct_9fa48("33996") ? model.status !== 'active' : stryMutAct_9fa48("33995") ? false : stryMutAct_9fa48("33994") ? true : (stryCov_9fa48("33994", "33995", "33996"), model.status === 'active')) ? 'bg-green-600' : (stryMutAct_9fa48("34001") ? model.status !== 'loading' : stryMutAct_9fa48("34000") ? false : stryMutAct_9fa48("33999") ? true : (stryCov_9fa48("33999", "34000", "34001"), model.status === 'loading')) ? 'bg-amber-600' : (stryMutAct_9fa48("34006") ? model.status !== 'sandboxed' : stryMutAct_9fa48("34005") ? false : stryMutAct_9fa48("34004") ? true : (stryCov_9fa48("34004", "34005", "34006"), model.status === 'sandboxed')) ? 'bg-purple-600' : 'bg-neutral-600'}`}>
                      {model.status}
                    </span>
                    <span className={`px-3 py-1 rounded-lg text-sm ${(stryMutAct_9fa48("34013") ? model.complianceStatus !== 'approved' : stryMutAct_9fa48("34012") ? false : stryMutAct_9fa48("34011") ? true : (stryCov_9fa48("34011", "34012", "34013"), model.complianceStatus === 'approved')) ? 'bg-green-900 text-green-300' : (stryMutAct_9fa48("34018") ? model.complianceStatus !== 'pending' : stryMutAct_9fa48("34017") ? false : stryMutAct_9fa48("34016") ? true : (stryCov_9fa48("34016", "34017", "34018"), model.complianceStatus === 'pending')) ? 'bg-amber-900 text-amber-300' : (stryMutAct_9fa48("34023") ? model.complianceStatus !== 'review' : stryMutAct_9fa48("34022") ? false : stryMutAct_9fa48("34021") ? true : (stryCov_9fa48("34021", "34022", "34023"), model.complianceStatus === 'review')) ? 'bg-blue-900 text-blue-300' : 'bg-red-900 text-red-300'}`}>
                      {model.complianceStatus}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-4 mt-4">
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold text-cyan-400">{model.requestsToday.toLocaleString()}</div>
                    <div className="text-xs text-white/50">Requests Today</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold text-purple-400">{(stryMutAct_9fa48("34027") ? model.tokensGenerated * 1000000 : (stryCov_9fa48("34027"), model.tokensGenerated / 1000000)).toFixed(1)}M</div>
                    <div className="text-xs text-white/50">Tokens Generated</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold text-amber-400">{model.avgResponseTime}ms</div>
                    <div className="text-xs text-white/50">Avg Response</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold">{model.vramRequired}GB</div>
                    <div className="text-xs text-white/50">VRAM Required</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold text-green-400">{model.replicas}</div>
                    <div className="text-xs text-white/50">Replicas</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold">{model.nodes.length}</div>
                    <div className="text-xs text-white/50">Nodes</div>
                  </div>
                </div>
              </div>))}
          </div>)}

        {stryMutAct_9fa48("34030") ? activeTab === 'routing' || <div className="space-y-6">
            <div className="bg-black/30 rounded-2xl p-6 border border-indigo-800/50">
              <h2 className="text-lg font-semibold mb-4">🔀 Smart Request Routing</h2>
              <p className="text-white/60 mb-6">
                Intelligent routing based on model capabilities, load, latency requirements, and cost optimization.
              </p>

              <div className="grid grid-cols-4 gap-4 mb-6">
                {(['balanced', 'latency', 'throughput', 'cost'] as InferenceMode[]).map(mode => <div key={mode} className={`p-4 rounded-xl border cursor-pointer transition-all ${inferenceMode === mode ? 'bg-indigo-600 border-indigo-400' : 'bg-black/20 border-indigo-800/50 hover:border-indigo-600'}`} onClick={() => setInferenceMode(mode)}>
                    <div className="text-lg font-semibold mb-1">{mode.charAt(0).toUpperCase() + mode.slice(1)}</div>
                    <div className="text-xs text-white/60">
                      {mode === 'balanced' && 'Optimize for best overall experience'}
                      {mode === 'latency' && 'Minimize response time at any cost'}
                      {mode === 'throughput' && 'Maximize requests per second'}
                      {mode === 'cost' && 'Minimize compute cost per request'}
                    </div>
                  </div>)}
              </div>
            </div>

            <div className="bg-black/30 rounded-2xl p-6 border border-indigo-800/50">
              <h2 className="text-lg font-semibold mb-4">🛡️ Failover Configuration</h2>
              <div className="space-y-4">
                {failovers.map(fo => {
              const primaryModel = models.find(m => m.id === fo.primaryModel);
              return <div key={fo.id} className="p-4 bg-black/20 rounded-xl border border-indigo-800/30">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{primaryModel?.name}</h3>
                          <div className="text-xs text-white/50">Primary Model</div>
                        </div>
                        <div className={`px-3 py-1 rounded-lg text-sm ${fo.isActive ? 'bg-green-600' : 'bg-neutral-600'}`}>
                          {fo.isActive ? 'Active' : 'Disabled'}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div className="p-2 bg-black/20 rounded-lg text-center">
                          <div className="text-xs text-white/50">Latency Threshold</div>
                          <div className="font-medium">{fo.triggerConditions.latencyThreshold}ms</div>
                        </div>
                        <div className="p-2 bg-black/20 rounded-lg text-center">
                          <div className="text-xs text-white/50">Error Rate Threshold</div>
                          <div className="font-medium">{fo.triggerConditions.errorRateThreshold}%</div>
                        </div>
                        <div className="p-2 bg-black/20 rounded-lg text-center">
                          <div className="text-xs text-white/50">Queue Depth Threshold</div>
                          <div className="font-medium">{fo.triggerConditions.queueDepthThreshold}</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-white/50 mb-2">Fallback Chain:</div>
                        <div className="flex items-center gap-2">
                          {fo.fallbackModels.map((fbId, idx) => {
                      const fbModel = models.find(m => m.id === fbId);
                      return <React.Fragment key={fbId}>
                                {idx > 0 && <span className="text-white/30">→</span>}
                                <span className="px-2 py-1 bg-indigo-900/50 rounded text-sm">{fbModel?.name || fbId}</span>
                              </React.Fragment>;
                    })}
                        </div>
                      </div>
                    </div>;
            })}
              </div>
            </div>
          </div> : stryMutAct_9fa48("34029") ? false : stryMutAct_9fa48("34028") ? true : (stryCov_9fa48("34028", "34029", "34030"), (stryMutAct_9fa48("34032") ? activeTab !== 'routing' : stryMutAct_9fa48("34031") ? true : (stryCov_9fa48("34031", "34032"), activeTab === 'routing')) && <div className="space-y-6">
            <div className="bg-black/30 rounded-2xl p-6 border border-indigo-800/50">
              <h2 className="text-lg font-semibold mb-4">🔀 Smart Request Routing</h2>
              <p className="text-white/60 mb-6">
                Intelligent routing based on model capabilities, load, latency requirements, and cost optimization.
              </p>

              <div className="grid grid-cols-4 gap-4 mb-6">
                {(['balanced', 'latency', 'throughput', 'cost'] as InferenceMode[]).map(stryMutAct_9fa48("34034") ? () => undefined : (stryCov_9fa48("34034"), mode => <div key={mode} className={`p-4 rounded-xl border cursor-pointer transition-all ${(stryMutAct_9fa48("34038") ? inferenceMode !== mode : stryMutAct_9fa48("34037") ? false : stryMutAct_9fa48("34036") ? true : (stryCov_9fa48("34036", "34037", "34038"), inferenceMode === mode)) ? 'bg-indigo-600 border-indigo-400' : 'bg-black/20 border-indigo-800/50 hover:border-indigo-600'}`} onClick={stryMutAct_9fa48("34041") ? () => undefined : (stryCov_9fa48("34041"), () => setInferenceMode(mode))}>
                    <div className="text-lg font-semibold mb-1">{stryMutAct_9fa48("34042") ? mode.charAt(0).toUpperCase() - mode.slice(1) : (stryCov_9fa48("34042"), (stryMutAct_9fa48("34044") ? mode.toUpperCase() : stryMutAct_9fa48("34043") ? mode.charAt(0).toLowerCase() : (stryCov_9fa48("34043", "34044"), mode.charAt(0).toUpperCase())) + (stryMutAct_9fa48("34045") ? mode : (stryCov_9fa48("34045"), mode.slice(1))))}</div>
                    <div className="text-xs text-white/60">
                      {stryMutAct_9fa48("34048") ? mode === 'balanced' || 'Optimize for best overall experience' : stryMutAct_9fa48("34047") ? false : stryMutAct_9fa48("34046") ? true : (stryCov_9fa48("34046", "34047", "34048"), (stryMutAct_9fa48("34050") ? mode !== 'balanced' : stryMutAct_9fa48("34049") ? true : (stryCov_9fa48("34049", "34050"), mode === 'balanced')) && 'Optimize for best overall experience')}
                      {stryMutAct_9fa48("34055") ? mode === 'latency' || 'Minimize response time at any cost' : stryMutAct_9fa48("34054") ? false : stryMutAct_9fa48("34053") ? true : (stryCov_9fa48("34053", "34054", "34055"), (stryMutAct_9fa48("34057") ? mode !== 'latency' : stryMutAct_9fa48("34056") ? true : (stryCov_9fa48("34056", "34057"), mode === 'latency')) && 'Minimize response time at any cost')}
                      {stryMutAct_9fa48("34062") ? mode === 'throughput' || 'Maximize requests per second' : stryMutAct_9fa48("34061") ? false : stryMutAct_9fa48("34060") ? true : (stryCov_9fa48("34060", "34061", "34062"), (stryMutAct_9fa48("34064") ? mode !== 'throughput' : stryMutAct_9fa48("34063") ? true : (stryCov_9fa48("34063", "34064"), mode === 'throughput')) && 'Maximize requests per second')}
                      {stryMutAct_9fa48("34069") ? mode === 'cost' || 'Minimize compute cost per request' : stryMutAct_9fa48("34068") ? false : stryMutAct_9fa48("34067") ? true : (stryCov_9fa48("34067", "34068", "34069"), (stryMutAct_9fa48("34071") ? mode !== 'cost' : stryMutAct_9fa48("34070") ? true : (stryCov_9fa48("34070", "34071"), mode === 'cost')) && 'Minimize compute cost per request')}
                    </div>
                  </div>))}
              </div>
            </div>

            <div className="bg-black/30 rounded-2xl p-6 border border-indigo-800/50">
              <h2 className="text-lg font-semibold mb-4">🛡️ Failover Configuration</h2>
              <div className="space-y-4">
                {failovers.map(fo => {
              const primaryModel = models.find(stryMutAct_9fa48("34075") ? () => undefined : (stryCov_9fa48("34075"), m => stryMutAct_9fa48("34078") ? m.id !== fo.primaryModel : stryMutAct_9fa48("34077") ? false : stryMutAct_9fa48("34076") ? true : (stryCov_9fa48("34076", "34077", "34078"), m.id === fo.primaryModel)));
              return <div key={fo.id} className="p-4 bg-black/20 rounded-xl border border-indigo-800/30">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{stryMutAct_9fa48("34079") ? primaryModel.name : (stryCov_9fa48("34079"), primaryModel?.name)}</h3>
                          <div className="text-xs text-white/50">Primary Model</div>
                        </div>
                        <div className={`px-3 py-1 rounded-lg text-sm ${fo.isActive ? 'bg-green-600' : 'bg-neutral-600'}`}>
                          {fo.isActive ? 'Active' : 'Disabled'}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div className="p-2 bg-black/20 rounded-lg text-center">
                          <div className="text-xs text-white/50">Latency Threshold</div>
                          <div className="font-medium">{fo.triggerConditions.latencyThreshold}ms</div>
                        </div>
                        <div className="p-2 bg-black/20 rounded-lg text-center">
                          <div className="text-xs text-white/50">Error Rate Threshold</div>
                          <div className="font-medium">{fo.triggerConditions.errorRateThreshold}%</div>
                        </div>
                        <div className="p-2 bg-black/20 rounded-lg text-center">
                          <div className="text-xs text-white/50">Queue Depth Threshold</div>
                          <div className="font-medium">{fo.triggerConditions.queueDepthThreshold}</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-white/50 mb-2">Fallback Chain:</div>
                        <div className="flex items-center gap-2">
                          {fo.fallbackModels.map((fbId, idx) => {
                      const fbModel = models.find(stryMutAct_9fa48("34086") ? () => undefined : (stryCov_9fa48("34086"), m => stryMutAct_9fa48("34089") ? m.id !== fbId : stryMutAct_9fa48("34088") ? false : stryMutAct_9fa48("34087") ? true : (stryCov_9fa48("34087", "34088", "34089"), m.id === fbId)));
                      return <React.Fragment key={fbId}>
                                {stryMutAct_9fa48("34092") ? idx > 0 || <span className="text-white/30">→</span> : stryMutAct_9fa48("34091") ? false : stryMutAct_9fa48("34090") ? true : (stryCov_9fa48("34090", "34091", "34092"), (stryMutAct_9fa48("34095") ? idx <= 0 : stryMutAct_9fa48("34094") ? idx >= 0 : stryMutAct_9fa48("34093") ? true : (stryCov_9fa48("34093", "34094", "34095"), idx > 0)) && <span className="text-white/30">→</span>)}
                                <span className="px-2 py-1 bg-indigo-900/50 rounded text-sm">{stryMutAct_9fa48("34098") ? fbModel?.name && fbId : stryMutAct_9fa48("34097") ? false : stryMutAct_9fa48("34096") ? true : (stryCov_9fa48("34096", "34097", "34098"), (stryMutAct_9fa48("34099") ? fbModel.name : (stryCov_9fa48("34099"), fbModel?.name)) || fbId)}</span>
                              </React.Fragment>;
                    })}
                        </div>
                      </div>
                    </div>;
            })}
              </div>
            </div>
          </div>)}

        {stryMutAct_9fa48("34102") ? activeTab === 'sandbox' || <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-700/50">
              <h2 className="text-lg font-semibold mb-2">🔬 Model Compliance Sandbox</h2>
              <p className="text-white/60">
                All new models must pass compliance testing before production deployment. This ensures AI safety,
                data protection, and regulatory compliance.
              </p>
            </div>

            {sandboxes.map(sb => <div key={sb.id} className="bg-black/30 rounded-2xl p-6 border border-indigo-800/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{sb.modelName}</h3>
                    <div className="text-sm text-white/50">
                      Submitted by {sb.submittedBy} • {Math.floor((Date.now() - sb.submittedAt.getTime()) / 3600000)}h ago
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-sm ${sb.status === 'approved' ? 'bg-green-600' : sb.status === 'testing' ? 'bg-blue-600' : sb.status === 'review' ? 'bg-amber-600' : sb.status === 'rejected' ? 'bg-red-600' : 'bg-neutral-600'}`}>
                    {sb.status}
                  </span>
                </div>

                <div className="grid grid-cols-6 gap-3 mb-4">
                  {sb.tests.map(test => <div key={test.name} className={`p-3 rounded-xl text-center ${test.status === 'passed' ? 'bg-green-900/30 border border-green-700/50' : test.status === 'running' ? 'bg-blue-900/30 border border-blue-700/50' : test.status === 'failed' ? 'bg-red-900/30 border border-red-700/50' : 'bg-black/20 border border-neutral-700/50'}`}>
                      <div className="text-lg mb-1">
                        {test.status === 'passed' ? '✅' : test.status === 'running' ? '🔄' : test.status === 'failed' ? '❌' : '⏳'}
                      </div>
                      <div className="text-xs">{test.name}</div>
                    </div>)}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="text-white/50">
                    Reviewers: {sb.reviewers.join(', ')}
                  </div>
                  <div className="text-white/60">
                    {sb.notes}
                  </div>
                </div>
              </div>)}
          </div> : stryMutAct_9fa48("34101") ? false : stryMutAct_9fa48("34100") ? true : (stryCov_9fa48("34100", "34101", "34102"), (stryMutAct_9fa48("34104") ? activeTab !== 'sandbox' : stryMutAct_9fa48("34103") ? true : (stryCov_9fa48("34103", "34104"), activeTab === 'sandbox')) && <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-700/50">
              <h2 className="text-lg font-semibold mb-2">🔬 Model Compliance Sandbox</h2>
              <p className="text-white/60">
                All new models must pass compliance testing before production deployment. This ensures AI safety,
                data protection, and regulatory compliance.
              </p>
            </div>

            {sandboxes.map(stryMutAct_9fa48("34106") ? () => undefined : (stryCov_9fa48("34106"), sb => <div key={sb.id} className="bg-black/30 rounded-2xl p-6 border border-indigo-800/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{sb.modelName}</h3>
                    <div className="text-sm text-white/50">
                      Submitted by {sb.submittedBy} • {Math.floor(stryMutAct_9fa48("34107") ? (Date.now() - sb.submittedAt.getTime()) * 3600000 : (stryCov_9fa48("34107"), (stryMutAct_9fa48("34108") ? Date.now() + sb.submittedAt.getTime() : (stryCov_9fa48("34108"), Date.now() - sb.submittedAt.getTime())) / 3600000))}h ago
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-sm ${(stryMutAct_9fa48("34112") ? sb.status !== 'approved' : stryMutAct_9fa48("34111") ? false : stryMutAct_9fa48("34110") ? true : (stryCov_9fa48("34110", "34111", "34112"), sb.status === 'approved')) ? 'bg-green-600' : (stryMutAct_9fa48("34117") ? sb.status !== 'testing' : stryMutAct_9fa48("34116") ? false : stryMutAct_9fa48("34115") ? true : (stryCov_9fa48("34115", "34116", "34117"), sb.status === 'testing')) ? 'bg-blue-600' : (stryMutAct_9fa48("34122") ? sb.status !== 'review' : stryMutAct_9fa48("34121") ? false : stryMutAct_9fa48("34120") ? true : (stryCov_9fa48("34120", "34121", "34122"), sb.status === 'review')) ? 'bg-amber-600' : (stryMutAct_9fa48("34127") ? sb.status !== 'rejected' : stryMutAct_9fa48("34126") ? false : stryMutAct_9fa48("34125") ? true : (stryCov_9fa48("34125", "34126", "34127"), sb.status === 'rejected')) ? 'bg-red-600' : 'bg-neutral-600'}`}>
                    {sb.status}
                  </span>
                </div>

                <div className="grid grid-cols-6 gap-3 mb-4">
                  {sb.tests.map(stryMutAct_9fa48("34131") ? () => undefined : (stryCov_9fa48("34131"), test => <div key={test.name} className={`p-3 rounded-xl text-center ${(stryMutAct_9fa48("34135") ? test.status !== 'passed' : stryMutAct_9fa48("34134") ? false : stryMutAct_9fa48("34133") ? true : (stryCov_9fa48("34133", "34134", "34135"), test.status === 'passed')) ? 'bg-green-900/30 border border-green-700/50' : (stryMutAct_9fa48("34140") ? test.status !== 'running' : stryMutAct_9fa48("34139") ? false : stryMutAct_9fa48("34138") ? true : (stryCov_9fa48("34138", "34139", "34140"), test.status === 'running')) ? 'bg-blue-900/30 border border-blue-700/50' : (stryMutAct_9fa48("34145") ? test.status !== 'failed' : stryMutAct_9fa48("34144") ? false : stryMutAct_9fa48("34143") ? true : (stryCov_9fa48("34143", "34144", "34145"), test.status === 'failed')) ? 'bg-red-900/30 border border-red-700/50' : 'bg-black/20 border border-neutral-700/50'}`}>
                      <div className="text-lg mb-1">
                        {(stryMutAct_9fa48("34151") ? test.status !== 'passed' : stryMutAct_9fa48("34150") ? false : stryMutAct_9fa48("34149") ? true : (stryCov_9fa48("34149", "34150", "34151"), test.status === 'passed')) ? '✅' : (stryMutAct_9fa48("34156") ? test.status !== 'running' : stryMutAct_9fa48("34155") ? false : stryMutAct_9fa48("34154") ? true : (stryCov_9fa48("34154", "34155", "34156"), test.status === 'running')) ? '🔄' : (stryMutAct_9fa48("34161") ? test.status !== 'failed' : stryMutAct_9fa48("34160") ? false : stryMutAct_9fa48("34159") ? true : (stryCov_9fa48("34159", "34160", "34161"), test.status === 'failed')) ? '❌' : '⏳'}
                      </div>
                      <div className="text-xs">{test.name}</div>
                    </div>))}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="text-white/50">
                    Reviewers: {sb.reviewers.join(', ')}
                  </div>
                  <div className="text-white/60">
                    {sb.notes}
                  </div>
                </div>
              </div>))}
          </div>)}
      </main>
    </div>;
};
export default SovereignPage;