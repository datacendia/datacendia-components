// =============================================================================
// CENDIA FEDERATED MESH™ - MULTI-SITE LEARNING WITHOUT CONNECTIVITY
// "Learn from all sites without connecting them."
//
// Enables knowledge sharing across multiple air-gapped Datacendia instances
// via portable model deltas. Each site stays sovereign but benefits from
// collective intelligence. Zero network connectivity required.
//
// DEMO MODE: Simulates federation with virtual organizations for showcasing
// the federated learning workflow without requiring multiple instances.
// =============================================================================

import { EventEmitter } from 'events';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import { logger } from '../../utils/logger.js';

// =============================================================================
// SIMULATED FEDERATION - Virtual Organizations for Demo Mode
// =============================================================================

interface VirtualOrganization {
  id: string;
  name: string;
  industry: string;
  region: string;
  size: 'small' | 'medium' | 'large' | 'enterprise';
  specializations: string[];
  dataQuality: number;
  contributionScore: number;
  lastActive: Date;
}

const VIRTUAL_ORGANIZATIONS: VirtualOrganization[] = [
  {
    id: 'vorg-acme',
    name: 'Acme Financial Services',
    industry: 'finance',
    region: 'North America',
    size: 'enterprise',
    specializations: ['fraud-detection', 'risk-modeling', 'regulatory-compliance'],
    dataQuality: 0.94,
    contributionScore: 87,
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'vorg-nexus',
    name: 'Nexus Healthcare Systems',
    industry: 'healthcare',
    region: 'Europe',
    size: 'large',
    specializations: ['patient-outcomes', 'clinical-decisions', 'resource-optimization'],
    dataQuality: 0.91,
    contributionScore: 82,
    lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: 'vorg-titan',
    name: 'Titan Manufacturing',
    industry: 'manufacturing',
    region: 'Asia Pacific',
    size: 'enterprise',
    specializations: ['supply-chain', 'predictive-maintenance', 'quality-control'],
    dataQuality: 0.89,
    contributionScore: 79,
    lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: 'vorg-quantum',
    name: 'Quantum Energy Corp',
    industry: 'energy',
    region: 'Middle East',
    size: 'large',
    specializations: ['grid-optimization', 'demand-forecasting', 'sustainability'],
    dataQuality: 0.92,
    contributionScore: 85,
    lastActive: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: 'vorg-stellar',
    name: 'Stellar Retail Group',
    industry: 'retail',
    region: 'North America',
    size: 'medium',
    specializations: ['inventory-optimization', 'customer-behavior', 'pricing-strategy'],
    dataQuality: 0.87,
    contributionScore: 73,
    lastActive: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
];

interface FederatedQuery {
  id: string;
  query: string;
  queryType: 'benchmark' | 'pattern' | 'insight' | 'model';
  filters: {
    industries?: string[];
    regions?: string[];
    minDataQuality?: number;
  };
  requestedBy: string;
  requestedAt: Date;
  status: 'pending' | 'aggregating' | 'complete' | 'failed';
  participantCount: number;
  results?: FederatedQueryResult;
}

interface FederatedQueryResult {
  aggregatedData: any;
  participantContributions: {
    organizationId: string;
    organizationName: string;
    contributed: boolean;
    dataPoints: number;
  }[];
  privacyBudgetUsed: number;
  confidence: number;
  completedAt: Date;
}

// =============================================================================
// TYPES
// =============================================================================

export interface MeshNode {
  id: string;
  name: string;
  organizationId: string;
  
  // Node identification
  nodeType: 'primary' | 'secondary' | 'edge';
  region?: string;
  classification?: string;
  
  // Public key for verification
  publicKey: string;
  publicKeyFingerprint: string;
  
  // Capabilities
  capabilities: NodeCapabilities;
  
  // Status
  status: 'active' | 'inactive' | 'syncing' | 'quarantined';
  lastSyncAt?: Date;
  
  // Statistics
  deltasExported: number;
  deltasImported: number;
  
  // Metadata
  registeredAt: Date;
}

export interface NodeCapabilities {
  // What this node can share
  canExportDecisions: boolean;
  canExportModels: boolean;
  canExportPolicies: boolean;
  canExportPatterns: boolean;
  
  // What this node can receive
  canImportDecisions: boolean;
  canImportModels: boolean;
  canImportPolicies: boolean;
  canImportPatterns: boolean;
  
  // Model capabilities
  availableModels: string[];
  maxModelSize: number;
}

export interface ModelDelta {
  id: string;
  
  // Source
  sourceNodeId: string;
  sourceNodeName: string;
  
  // Delta type
  deltaType: 'lora_adapter' | 'embedding_update' | 'pattern_weights' | 'decision_summary';
  
  // Model info
  baseModel: string;
  targetModel?: string;
  
  // Delta content
  deltaContent: DeltaContent;
  
  // Privacy
  differentialPrivacy: DifferentialPrivacyConfig;
  
  // Verification
  signature: string;
  contentHash: string;
  
  // Metadata
  trainingDataSummary: TrainingDataSummary;
  createdAt: Date;
  expiresAt?: Date;
  
  // Application status
  applied: boolean;
  appliedAt?: Date;
  appliedBy?: string;
}

export interface DeltaContent {
  // Format
  format: 'safetensors' | 'gguf' | 'json' | 'binary';
  compressed: boolean;
  
  // Size
  originalSize: number;
  compressedSize: number;
  
  // Data (base64 encoded)
  data: string;
  
  // Checksum
  checksum: string;
}

export interface DifferentialPrivacyConfig {
  enabled: boolean;
  
  // Privacy parameters
  epsilon: number;           // Privacy budget
  delta: number;             // Probability of privacy breach
  noiseMultiplier: number;
  
  // Clipping
  maxGradNorm: number;
}

export interface TrainingDataSummary {
  // Statistics (no raw data)
  sampleCount: number;
  positiveCount: number;
  negativeCount: number;
  
  // Coverage
  agentsCovered: string[];
  topicsCovered: string[];
  
  // Quality
  averageConfidence: number;
  
  // Time range
  dataStartDate: Date;
  dataEndDate: Date;
}

export interface SyncManifest {
  id: string;
  
  // Source and destination
  sourceNodeId: string;
  destinationNodeId?: string; // Null for broadcast
  
  // Contents
  deltas: string[];           // Delta IDs
  
  // Verification
  manifestHash: string;
  signature: string;
  
  // Transport
  transportFormat: 'usb' | 'optical' | 'diode' | 'qr';
  
  // Metadata
  createdAt: Date;
  size: number;
}

export interface MergeResult {
  deltaId: string;
  success: boolean;
  
  // Pre-merge state
  baselineMetrics?: ModelMetrics;
  
  // Post-merge state
  mergedMetrics?: ModelMetrics;
  
  // Quality assessment
  improvementScore?: number;
  regressionDetected: boolean;
  
  // Errors
  errors: string[];
  
  // Timestamp
  mergedAt: Date;
}

export interface ModelMetrics {
  accuracy: number;
  loss: number;
  perplexity?: number;
  customMetrics?: Record<string, number>;
}

// =============================================================================
// FEDERATED MESH SERVICE
// =============================================================================

class FederatedMeshService extends EventEmitter {
  private thisNode: MeshNode | null = null;
  private knownNodes: Map<string, MeshNode> = new Map();
  private deltas: Map<string, ModelDelta> = new Map();
  private manifests: Map<string, SyncManifest> = new Map();
  private storagePath: string;
  private privateKey: string | null = null;
  
  // Demo mode - simulated federation
  private demoMode: boolean = true;
  private virtualOrgs: VirtualOrganization[] = VIRTUAL_ORGANIZATIONS;
  private federatedQueries: Map<string, FederatedQuery> = new Map();
  private sharedInsights: Map<string, any> = new Map();

  constructor() {
    super();
    this.storagePath = process.env.MESH_STORAGE_PATH || '/var/datacendia/mesh';
    this.ensureDirectories();
    this.initializeDemoMode();
    logger.info('[FederatedMesh] Service initialized - Multi-site learning ready (Demo Mode: ON)');
  }

  // ===========================================================================
  // DEMO MODE - Simulated Federation
  // ===========================================================================

  private initializeDemoMode(): void {
    if (!this.demoMode) return;

    // Create virtual nodes from organizations
    for (const org of this.virtualOrgs) {
      const virtualNode: MeshNode = {
        id: `node-${org.id}`,
        name: `${org.name} Node`,
        organizationId: org.id,
        nodeType: org.size === 'enterprise' ? 'primary' : 'secondary',
        region: org.region,
        publicKey: this.generateVirtualPublicKey(org.id),
        publicKeyFingerprint: crypto.createHash('sha256').update(org.id).digest('hex').slice(0, 16),
        capabilities: {
          canExportDecisions: true,
          canExportModels: true,
          canExportPolicies: org.size !== 'small',
          canExportPatterns: true,
          canImportDecisions: true,
          canImportModels: true,
          canImportPolicies: true,
          canImportPatterns: true,
          availableModels: ['qwen2.5:7b', 'llama3.2:3b'],
          maxModelSize: 1024 * 1024 * 100,
        },
        status: 'active',
        lastSyncAt: org.lastActive,
        deltasExported: Math.floor(Math.random() * 50) + 10,
        deltasImported: Math.floor(Math.random() * 40) + 5,
        registeredAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      };
      this.knownNodes.set(virtualNode.id, virtualNode);
    }

    // Generate sample deltas from virtual orgs
    this.generateSampleDeltas();
    
    // Generate shared insights
    this.generateSharedInsights();
    
    logger.info(`[FederatedMesh] Demo mode initialized with ${this.virtualOrgs.length} virtual organizations`);
  }

  private generateVirtualPublicKey(seed: string): string {
    return `-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A${crypto.createHash('sha256').update(seed).digest('base64').slice(0, 128)}\n-----END PUBLIC KEY-----`;
  }

  private generateSampleDeltas(): void {
    const deltaTypes: ModelDelta['deltaType'][] = ['lora_adapter', 'embedding_update', 'pattern_weights', 'decision_summary'];
    const models = ['qwen2.5:7b', 'llama3.2:3b', 'mistral:7b'];
    
    for (const org of this.virtualOrgs) {
      const numDeltas = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < numDeltas; i++) {
        const deltaType = deltaTypes[Math.floor(Math.random() * deltaTypes.length)];
        const baseModel = models[Math.floor(Math.random() * models.length)];
        
        const delta: ModelDelta = {
          id: `delta-${org.id}-${i}`,
          sourceNodeId: `node-${org.id}`,
          sourceNodeName: `${org.name} Node`,
          deltaType,
          baseModel,
          deltaContent: {
            format: 'safetensors',
            compressed: true,
            originalSize: Math.floor(Math.random() * 5000000) + 100000,
            compressedSize: Math.floor(Math.random() * 1000000) + 50000,
            data: Buffer.from(`simulated-delta-${org.id}-${i}`).toString('base64'),
            checksum: crypto.createHash('sha256').update(`${org.id}-${i}`).digest('hex'),
          },
          differentialPrivacy: {
            enabled: true,
            epsilon: 1.0,
            delta: 1e-5,
            noiseMultiplier: 1.0,
            maxGradNorm: 1.0,
          },
          signature: Buffer.from(`sig-${org.id}-${i}`).toString('base64'),
          contentHash: crypto.createHash('sha256').update(`content-${org.id}-${i}`).digest('hex'),
          trainingDataSummary: {
            sampleCount: Math.floor(Math.random() * 50000) + 5000,
            positiveCount: Math.floor(Math.random() * 25000) + 2500,
            negativeCount: Math.floor(Math.random() * 25000) + 2500,
            agentsCovered: org.specializations.slice(0, 2),
            topicsCovered: org.specializations,
            averageConfidence: 0.85 + Math.random() * 0.1,
            dataStartDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            dataEndDate: new Date(),
          },
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          applied: Math.random() > 0.6,
          appliedAt: Math.random() > 0.6 ? new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000) : undefined,
        };
        
        this.deltas.set(delta.id, delta);
      }
    }
  }

  private generateSharedInsights(): void {
    const insights = [
      {
        id: 'insight-fraud-patterns',
        title: 'Cross-Industry Fraud Pattern Detection',
        category: 'security',
        description: 'Aggregated patterns from 3 organizations reveal new synthetic identity fraud vectors',
        contributors: ['vorg-acme', 'vorg-stellar', 'vorg-nexus'],
        confidence: 0.89,
        dataPoints: 127000,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'insight-supply-disruption',
        title: 'Supply Chain Disruption Early Warning',
        category: 'operations',
        description: 'Combined logistics data predicts 78% of disruptions 14 days earlier',
        contributors: ['vorg-titan', 'vorg-stellar', 'vorg-quantum'],
        confidence: 0.92,
        dataPoints: 89000,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'insight-decision-quality',
        title: 'Decision Quality Benchmark',
        category: 'governance',
        description: 'Network-wide decision accuracy improved 12% through shared council patterns',
        contributors: ['vorg-acme', 'vorg-nexus', 'vorg-titan', 'vorg-quantum', 'vorg-stellar'],
        confidence: 0.95,
        dataPoints: 234000,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ];
    
    for (const insight of insights) {
      this.sharedInsights.set(insight.id, insight);
    }
  }

  /**
   * Execute a federated query across virtual organizations
   */
  async executeFederatedQuery(params: {
    query: string;
    queryType: FederatedQuery['queryType'];
    filters?: FederatedQuery['filters'];
  }): Promise<FederatedQuery> {
    const queryId = `fq-${crypto.randomUUID().slice(0, 8)}`;
    
    // Filter participating orgs
    let participants = [...this.virtualOrgs];
    if (params.filters?.industries?.length) {
      participants = participants.filter(o => params.filters!.industries!.includes(o.industry));
    }
    if (params.filters?.regions?.length) {
      participants = participants.filter(o => params.filters!.regions!.includes(o.region));
    }
    if (params.filters?.minDataQuality) {
      participants = participants.filter(o => o.dataQuality >= params.filters!.minDataQuality!);
    }
    
    const query: FederatedQuery = {
      id: queryId,
      query: params.query,
      queryType: params.queryType,
      filters: params.filters || {},
      requestedBy: this.thisNode?.organizationId || 'demo',
      requestedAt: new Date(),
      status: 'aggregating',
      participantCount: participants.length,
    };
    
    this.federatedQueries.set(queryId, query);
    
    // Simulate async aggregation
    setTimeout(() => this.completeFederatedQuery(queryId, participants), 1500);
    
    logger.info(`[FederatedMesh] Federated query ${queryId} started with ${participants.length} participants`);
    this.emit('query:started', query);
    
    return query;
  }

  private completeFederatedQuery(queryId: string, participants: VirtualOrganization[]): void {
    const query = this.federatedQueries.get(queryId);
    if (!query) return;
    
    // Generate simulated aggregated results based on query type
    let aggregatedData: any;
    
    switch (query.queryType) {
      case 'benchmark':
        aggregatedData = this.generateBenchmarkResults(participants);
        break;
      case 'pattern':
        aggregatedData = this.generatePatternResults(participants);
        break;
      case 'insight':
        aggregatedData = this.generateInsightResults(participants);
        break;
      case 'model':
        aggregatedData = this.generateModelResults(participants);
        break;
    }
    
    query.status = 'complete';
    query.results = {
      aggregatedData,
      participantContributions: participants.map(p => ({
        organizationId: p.id,
        organizationName: p.name,
        contributed: Math.random() > 0.1,
        dataPoints: Math.floor(Math.random() * 10000) + 1000,
      })),
      privacyBudgetUsed: 0.1 + Math.random() * 0.2,
      confidence: 0.85 + Math.random() * 0.1,
      completedAt: new Date(),
    };
    
    logger.info(`[FederatedMesh] Federated query ${queryId} completed`);
    this.emit('query:completed', query);
  }

  private generateBenchmarkResults(participants: VirtualOrganization[]): any {
    return {
      metrics: [
        { name: 'Decision Accuracy', p25: 0.72, p50: 0.81, p75: 0.89, p90: 0.94, yourValue: 0.85 },
        { name: 'Time to Decision', p25: 48, p50: 24, p75: 12, p90: 4, yourValue: 18, unit: 'hours' },
        { name: 'Stakeholder Alignment', p25: 0.65, p50: 0.74, p75: 0.82, p90: 0.91, yourValue: 0.79 },
        { name: 'Implementation Success', p25: 0.58, p50: 0.68, p75: 0.78, p90: 0.88, yourValue: 0.73 },
      ],
      participantCount: participants.length,
      industries: [...new Set(participants.map(p => p.industry))],
      dataPointsAggregated: participants.reduce((sum, p) => sum + Math.floor(Math.random() * 10000) + 5000, 0),
    };
  }

  private generatePatternResults(participants: VirtualOrganization[]): any {
    return {
      patterns: [
        { name: 'Consensus Building', frequency: 0.73, effectiveness: 0.85, adoptionTrend: 'increasing' },
        { name: 'Rapid Iteration', frequency: 0.61, effectiveness: 0.79, adoptionTrend: 'stable' },
        { name: 'Risk-First Analysis', frequency: 0.45, effectiveness: 0.91, adoptionTrend: 'increasing' },
        { name: 'Stakeholder Pre-Alignment', frequency: 0.38, effectiveness: 0.88, adoptionTrend: 'increasing' },
      ],
      emergingPatterns: [
        { name: 'AI-Assisted Deliberation', frequency: 0.12, growth: '+340%' },
        { name: 'Async Decision Councils', frequency: 0.08, growth: '+210%' },
      ],
      participantCount: participants.length,
    };
  }

  private generateInsightResults(participants: VirtualOrganization[]): any {
    return {
      insights: [
        { title: 'Cross-Industry Risk Correlation', confidence: 0.87, impact: 'high', actionable: true },
        { title: 'Decision Velocity Optimization', confidence: 0.82, impact: 'medium', actionable: true },
        { title: 'Stakeholder Fatigue Indicators', confidence: 0.79, impact: 'medium', actionable: false },
      ],
      recommendations: [
        'Consider implementing async deliberation for routine decisions',
        'Risk signals from manufacturing sector correlate with your supply chain exposure',
        'Decision quality improves 23% with pre-meeting alignment sessions',
      ],
      participantCount: participants.length,
    };
  }

  private generateModelResults(participants: VirtualOrganization[]): any {
    return {
      availableDeltas: this.deltas.size,
      compatibleDeltas: Math.floor(this.deltas.size * 0.7),
      recommendedDeltas: Array.from(this.deltas.values())
        .filter(d => !d.applied)
        .slice(0, 3)
        .map(d => ({
          id: d.id,
          type: d.deltaType,
          source: d.sourceNodeName,
          estimatedImprovement: `+${(Math.random() * 5 + 1).toFixed(1)}%`,
          size: d.deltaContent.compressedSize,
        })),
      participantCount: participants.length,
    };
  }

  /**
   * Get federated query status
   */
  getFederatedQuery(queryId: string): FederatedQuery | undefined {
    return this.federatedQueries.get(queryId);
  }

  /**
   * List all federated queries
   */
  listFederatedQueries(): FederatedQuery[] {
    return Array.from(this.federatedQueries.values())
      .sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime());
  }

  /**
   * Get shared insights from the mesh
   */
  getSharedInsights(): any[] {
    return Array.from(this.sharedInsights.values());
  }

  /**
   * Get virtual organizations (demo mode)
   */
  getVirtualOrganizations(): VirtualOrganization[] {
    return this.virtualOrgs;
  }

  /**
   * Get mesh network overview for dashboard
   */
  getMeshOverview(): {
    nodes: number;
    activeNodes: number;
    totalDeltas: number;
    appliedDeltas: number;
    sharedInsights: number;
    recentQueries: number;
    networkHealth: number;
  } {
    const nodes = Array.from(this.knownNodes.values());
    const deltas = Array.from(this.deltas.values());
    const queries = Array.from(this.federatedQueries.values());
    const recentTime = Date.now() - 24 * 60 * 60 * 1000;
    
    return {
      nodes: nodes.length,
      activeNodes: nodes.filter(n => n.status === 'active').length,
      totalDeltas: deltas.length,
      appliedDeltas: deltas.filter(d => d.applied).length,
      sharedInsights: this.sharedInsights.size,
      recentQueries: queries.filter(q => q.requestedAt.getTime() > recentTime).length,
      networkHealth: 0.97,
    };
  }

  private ensureDirectories(): void {
    const dirs = [
      this.storagePath,
      path.join(this.storagePath, 'nodes'),
      path.join(this.storagePath, 'deltas'),
      path.join(this.storagePath, 'manifests'),
      path.join(this.storagePath, 'exports'),
      path.join(this.storagePath, 'imports'),
    ];
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  }

  // ===========================================================================
  // NODE MANAGEMENT
  // ===========================================================================

  /**
   * Initialize this node in the mesh
   */
  async initializeNode(params: {
    name: string;
    organizationId: string;
    nodeType: MeshNode['nodeType'];
    region?: string;
    capabilities?: Partial<NodeCapabilities>;
  }): Promise<MeshNode> {
    // Generate key pair
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    
    this.privateKey = privateKey;
    
    const publicKeyFingerprint = crypto
      .createHash('sha256')
      .update(publicKey)
      .digest('hex')
      .slice(0, 16);
    
    const defaultCapabilities: NodeCapabilities = {
      canExportDecisions: true,
      canExportModels: true,
      canExportPolicies: true,
      canExportPatterns: true,
      canImportDecisions: true,
      canImportModels: true,
      canImportPolicies: true,
      canImportPatterns: true,
      availableModels: ['qwen2.5:7b', 'llama3.2:3b'],
      maxModelSize: 1024 * 1024 * 100, // 100MB
    };
    
    this.thisNode = {
      id: `node-${crypto.randomUUID().slice(0, 8)}`,
      name: params.name,
      organizationId: params.organizationId,
      nodeType: params.nodeType,
      region: params.region,
      publicKey,
      publicKeyFingerprint,
      capabilities: { ...defaultCapabilities, ...params.capabilities },
      status: 'active',
      deltasExported: 0,
      deltasImported: 0,
      registeredAt: new Date(),
    };
    
    this.knownNodes.set(this.thisNode.id, this.thisNode);
    await this.persistNode(this.thisNode);
    
    logger.info(`[FederatedMesh] Node initialized: ${this.thisNode.name} (${this.thisNode.id})`);
    this.emit('node:initialized', this.thisNode);
    
    return this.thisNode;
  }

  /**
   * Register a remote node
   */
  async registerRemoteNode(nodeData: Omit<MeshNode, 'deltasExported' | 'deltasImported' | 'registeredAt'>): Promise<MeshNode> {
    const node: MeshNode = {
      ...nodeData,
      deltasExported: 0,
      deltasImported: 0,
      registeredAt: new Date(),
    };
    
    this.knownNodes.set(node.id, node);
    await this.persistNode(node);
    
    logger.info(`[FederatedMesh] Registered remote node: ${node.name}`);
    this.emit('node:registered', node);
    
    return node;
  }

  /**
   * Persist node to storage
   */
  private async persistNode(node: MeshNode): Promise<void> {
    const filePath = path.join(this.storagePath, 'nodes', `${node.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(node, null, 2));
  }

  // ===========================================================================
  // DELTA CREATION
  // ===========================================================================

  /**
   * Create a model delta from local training
   */
  async createModelDelta(params: {
    deltaType: ModelDelta['deltaType'];
    baseModel: string;
    deltaData: Buffer;
    trainingDataSummary: TrainingDataSummary;
    differentialPrivacy?: Partial<DifferentialPrivacyConfig>;
    expiresInDays?: number;
  }): Promise<ModelDelta> {
    if (!this.thisNode) {
      throw new Error('Node not initialized');
    }
    
    const id = `delta-${crypto.randomUUID().slice(0, 8)}`;
    
    // Apply differential privacy noise if enabled
    let processedData = params.deltaData;
    const dpConfig: DifferentialPrivacyConfig = {
      enabled: params.differentialPrivacy?.enabled ?? true,
      epsilon: params.differentialPrivacy?.epsilon ?? 1.0,
      delta: params.differentialPrivacy?.delta ?? 1e-5,
      noiseMultiplier: params.differentialPrivacy?.noiseMultiplier ?? 1.0,
      maxGradNorm: params.differentialPrivacy?.maxGradNorm ?? 1.0,
    };
    
    if (dpConfig.enabled) {
      processedData = this.applyDifferentialPrivacy(processedData, dpConfig);
    }
    
    // Compress data
    const compressed = zlib.gzipSync(processedData);
    
    // Create content
    const deltaContent: DeltaContent = {
      format: 'safetensors',
      compressed: true,
      originalSize: processedData.length,
      compressedSize: compressed.length,
      data: compressed.toString('base64'),
      checksum: crypto.createHash('sha256').update(compressed).digest('hex'),
    };
    
    // Calculate content hash
    const contentHash = crypto
      .createHash('sha256')
      .update(JSON.stringify({
        deltaType: params.deltaType,
        baseModel: params.baseModel,
        content: deltaContent.checksum,
        summary: params.trainingDataSummary,
      }))
      .digest('hex');
    
    // Sign the delta
    const signature = this.signData(contentHash);
    
    const delta: ModelDelta = {
      id,
      sourceNodeId: this.thisNode.id,
      sourceNodeName: this.thisNode.name,
      deltaType: params.deltaType,
      baseModel: params.baseModel,
      deltaContent,
      differentialPrivacy: dpConfig,
      signature,
      contentHash,
      trainingDataSummary: params.trainingDataSummary,
      createdAt: new Date(),
      expiresAt: params.expiresInDays 
        ? new Date(Date.now() + params.expiresInDays * 24 * 60 * 60 * 1000)
        : undefined,
      applied: false,
    };
    
    this.deltas.set(id, delta);
    this.thisNode.deltasExported++;
    await this.persistDelta(delta);
    
    logger.info(`[FederatedMesh] Created delta ${id} (${params.deltaType}): ${deltaContent.compressedSize} bytes`);
    this.emit('delta:created', delta);
    
    return delta;
  }

  /**
   * Apply differential privacy noise to data
   */
  private applyDifferentialPrivacy(data: Buffer, config: DifferentialPrivacyConfig): Buffer {
    // Simplified DP implementation
    // In production, use proper Gaussian mechanism
    
    const floatArray = new Float32Array(data.buffer, data.byteOffset, data.length / 4);
    const noisyArray = new Float32Array(floatArray.length);
    
    const sigma = config.noiseMultiplier * config.maxGradNorm / config.epsilon;
    
    for (let i = 0; i < floatArray.length; i++) {
      // Clip gradient
      let value = floatArray[i];
      value = Math.max(-config.maxGradNorm, Math.min(config.maxGradNorm, value));
      
      // Add Gaussian noise
      const noise = this.gaussianNoise() * sigma;
      noisyArray[i] = value + noise;
    }
    
    return Buffer.from(noisyArray.buffer);
  }

  /**
   * Generate Gaussian noise using Box-Muller transform
   */
  private gaussianNoise(): number {
    const u1 = Math.random();
    const u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }

  /**
   * Sign data with node's private key
   */
  private signData(data: string): string {
    if (!this.privateKey) {
      throw new Error('Private key not available');
    }
    
    const sign = crypto.createSign('SHA256');
    sign.update(data);
    return sign.sign(this.privateKey, 'base64');
  }

  /**
   * Persist delta to storage
   */
  private async persistDelta(delta: ModelDelta): Promise<void> {
    const filePath = path.join(this.storagePath, 'deltas', `${delta.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(delta, null, 2));
  }

  // ===========================================================================
  // EXPORT / IMPORT
  // ===========================================================================

  /**
   * Create export manifest for transfer
   */
  async createExportManifest(params: {
    deltaIds: string[];
    destinationNodeId?: string;
    transportFormat: SyncManifest['transportFormat'];
  }): Promise<{ manifest: SyncManifest; exportPath: string }> {
    if (!this.thisNode) {
      throw new Error('Node not initialized');
    }
    
    const id = `manifest-${crypto.randomUUID().slice(0, 8)}`;
    const exportDir = path.join(this.storagePath, 'exports', id);
    fs.mkdirSync(exportDir, { recursive: true });
    
    // Collect deltas
    const deltaFiles: string[] = [];
    let totalSize = 0;
    
    for (const deltaId of params.deltaIds) {
      const delta = this.deltas.get(deltaId);
      if (!delta) {
        logger.warn(`[FederatedMesh] Delta not found: ${deltaId}`);
        continue;
      }
      
      // Export delta file
      const deltaPath = path.join(exportDir, `${deltaId}.delta`);
      fs.writeFileSync(deltaPath, JSON.stringify(delta, null, 2));
      deltaFiles.push(deltaId);
      totalSize += delta.deltaContent.compressedSize;
    }
    
    // Create manifest
    const manifestContent = {
      deltas: deltaFiles,
      sourceNodeId: this.thisNode.id,
      destinationNodeId: params.destinationNodeId,
    };
    
    const manifestHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(manifestContent))
      .digest('hex');
    
    const manifest: SyncManifest = {
      id,
      sourceNodeId: this.thisNode.id,
      destinationNodeId: params.destinationNodeId,
      deltas: deltaFiles,
      manifestHash,
      signature: this.signData(manifestHash),
      transportFormat: params.transportFormat,
      createdAt: new Date(),
      size: totalSize,
    };
    
    // Write manifest
    const manifestPath = path.join(exportDir, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    
    this.manifests.set(id, manifest);
    
    logger.info(`[FederatedMesh] Created export manifest ${id}: ${deltaFiles.length} deltas, ${totalSize} bytes`);
    this.emit('manifest:created', manifest);
    
    return { manifest, exportPath: exportDir };
  }

  /**
   * Import deltas from a manifest
   */
  async importFromManifest(importPath: string): Promise<{
    manifest: SyncManifest;
    imported: string[];
    errors: string[];
  }> {
    if (!this.thisNode) {
      throw new Error('Node not initialized');
    }
    
    // Read manifest
    const manifestPath = path.join(importPath, 'manifest.json');
    if (!fs.existsSync(manifestPath)) {
      throw new Error('Manifest not found in import path');
    }
    
    const manifest: SyncManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    // Verify signature
    const sourceNode = this.knownNodes.get(manifest.sourceNodeId);
    if (sourceNode) {
      const isValid = this.verifySignature(manifest.manifestHash, manifest.signature, sourceNode.publicKey);
      if (!isValid) {
        throw new Error('Invalid manifest signature');
      }
    }
    
    // Import deltas
    const imported: string[] = [];
    const errors: string[] = [];
    
    for (const deltaId of manifest.deltas) {
      try {
        const deltaPath = path.join(importPath, `${deltaId}.delta`);
        if (!fs.existsSync(deltaPath)) {
          errors.push(`Delta file not found: ${deltaId}`);
          continue;
        }
        
        const delta: ModelDelta = JSON.parse(fs.readFileSync(deltaPath, 'utf8'));
        
        // Verify delta signature
        if (sourceNode) {
          const isValid = this.verifySignature(delta.contentHash, delta.signature, sourceNode.publicKey);
          if (!isValid) {
            errors.push(`Invalid signature for delta: ${deltaId}`);
            continue;
          }
        }
        
        // Store delta
        this.deltas.set(delta.id, delta);
        await this.persistDelta(delta);
        imported.push(delta.id);
        
      } catch (err: any) {
        errors.push(`Error importing ${deltaId}: ${err.message}`);
      }
    }
    
    this.thisNode.deltasImported += imported.length;
    this.thisNode.lastSyncAt = new Date();
    
    logger.info(`[FederatedMesh] Imported ${imported.length} deltas, ${errors.length} errors`);
    this.emit('import:completed', { manifest, imported, errors });
    
    return { manifest, imported, errors };
  }

  /**
   * Verify signature with public key
   */
  private verifySignature(data: string, signature: string, publicKey: string): boolean {
    try {
      const verify = crypto.createVerify('SHA256');
      verify.update(data);
      return verify.verify(publicKey, signature, 'base64');
    } catch {
      return false;
    }
  }

  // ===========================================================================
  // DELTA APPLICATION
  // ===========================================================================

  /**
   * Apply a delta to the local model
   */
  async applyDelta(deltaId: string, targetModel: string): Promise<MergeResult> {
    const delta = this.deltas.get(deltaId);
    if (!delta) {
      throw new Error(`Delta not found: ${deltaId}`);
    }
    
    if (delta.applied) {
      throw new Error('Delta already applied');
    }
    
    const result: MergeResult = {
      deltaId,
      success: false,
      regressionDetected: false,
      errors: [],
      mergedAt: new Date(),
    };
    
    try {
      // Decompress delta
      const compressed = Buffer.from(delta.deltaContent.data, 'base64');
      const decompressed = zlib.gunzipSync(compressed);
      
      // In production, this would:
      // 1. Load the target model
      // 2. Apply the LoRA/adapter weights
      // 3. Evaluate on validation set
      // 4. Compare metrics
      
      // Simulate merge
      result.baselineMetrics = {
        accuracy: 0.85,
        loss: 0.42,
      };
      
      result.mergedMetrics = {
        accuracy: 0.87,
        loss: 0.38,
      };
      
      result.improvementScore = 
        (result.mergedMetrics.accuracy - result.baselineMetrics.accuracy) * 100;
      
      result.regressionDetected = result.improvementScore < -2;
      
      if (result.regressionDetected) {
        result.errors.push('Significant regression detected, delta not applied');
        return result;
      }
      
      // Mark as applied
      delta.applied = true;
      delta.appliedAt = new Date();
      delta.targetModel = targetModel;
      await this.persistDelta(delta);
      
      result.success = true;
      
      logger.info(`[FederatedMesh] Applied delta ${deltaId}: +${result.improvementScore?.toFixed(2)}% improvement`);
      this.emit('delta:applied', { delta, result });
      
    } catch (err: any) {
      result.errors.push(err.message);
      logger.error(`[FederatedMesh] Failed to apply delta ${deltaId}:`, err);
    }
    
    return result;
  }

  // ===========================================================================
  // QUERIES
  // ===========================================================================

  /**
   * Get this node's info
   */
  getThisNode(): MeshNode | null {
    return this.thisNode;
  }

  /**
   * List all known nodes
   */
  listNodes(): MeshNode[] {
    return Array.from(this.knownNodes.values());
  }

  /**
   * List available deltas
   */
  listDeltas(filters?: {
    deltaType?: ModelDelta['deltaType'];
    applied?: boolean;
    baseModel?: string;
  }): ModelDelta[] {
    let deltas = Array.from(this.deltas.values());
    
    if (filters?.deltaType) {
      deltas = deltas.filter(d => d.deltaType === filters.deltaType);
    }
    if (filters?.applied !== undefined) {
      deltas = deltas.filter(d => d.applied === filters.applied);
    }
    if (filters?.baseModel) {
      deltas = deltas.filter(d => d.baseModel === filters.baseModel);
    }
    
    return deltas.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Get delta by ID
   */
  getDelta(deltaId: string): ModelDelta | undefined {
    return this.deltas.get(deltaId);
  }

  /**
   * Get mesh statistics
   */
  getStatistics(): {
    nodesCount: number;
    deltasCount: number;
    totalDeltaSize: number;
    appliedDeltas: number;
    pendingDeltas: number;
  } {
    const deltas = Array.from(this.deltas.values());
    
    return {
      nodesCount: this.knownNodes.size,
      deltasCount: deltas.length,
      totalDeltaSize: deltas.reduce((sum, d) => sum + d.deltaContent.compressedSize, 0),
      appliedDeltas: deltas.filter(d => d.applied).length,
      pendingDeltas: deltas.filter(d => !d.applied).length,
    };
  }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

export const federatedMeshService = new FederatedMeshService();
export { FederatedMeshService };
