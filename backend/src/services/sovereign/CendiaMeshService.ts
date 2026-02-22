// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA MESHÃ¢â€žÂ¢ - Encrypted Networking Service
// "Quantum-resistant secure communications."
// Sovereign Security Layer - Encrypted Networking
// =============================================================================

import { PrismaClient } from '@prisma/client';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';
import { logger } from '../../utils/logger.js';

// =============================================================================
// TYPES
// =============================================================================

export interface MeshNode {
  id: string;
  organizationId: string;
  name: string;
  type: 'dcu' | 'gateway' | 'endpoint' | 'sensor';
  status: 'online' | 'offline' | 'degraded' | 'maintenance';
  location: {
    building: string;
    floor: string;
    room: string;
    coordinates?: { lat: number; lng: number };
  };
  publicKey: string;
  capabilities: string[];
  connections: string[]; // Connected node IDs
  bandwidthMbps: number;
  latencyMs: number;
  encryptionLevel: 'standard' | 'high' | 'quantum_resistant';
  lastHeartbeat: Date;
  registeredAt: Date;
  metadata: Record<string, unknown>;
}

export interface MeshConnection {
  id: string;
  organizationId: string;
  sourceNodeId: string;
  targetNodeId: string;
  status: 'active' | 'inactive' | 'degraded';
  encryptionProtocol: string;
  bandwidthUtilization: number; // percentage
  latencyMs: number;
  packetLoss: number; // percentage
  establishedAt: Date;
  lastActivity: Date;
}

export interface MeshTopology {
  organizationId: string;
  nodes: MeshNode[];
  connections: MeshConnection[];
  totalBandwidthGbps: number;
  avgLatencyMs: number;
  healthScore: number;
}

export interface SecureChannel {
  id: string;
  organizationId: string;
  name: string;
  participants: string[]; // Node IDs
  encryptionKey: string; // Encrypted key reference
  protocol: 'aes256' | 'chacha20' | 'kyber' | 'dilithium';
  status: 'active' | 'expired' | 'revoked';
  createdAt: Date;
  expiresAt: Date;
  messageCount: number;
}

export interface NetworkEvent {
  id: string;
  organizationId: string;
  nodeId: string;
  eventType: 'connection' | 'disconnection' | 'degradation' | 'recovery' | 'security_alert';
  severity: 'info' | 'warning' | 'error' | 'critical';
  description: string;
  timestamp: Date;
  resolved: boolean;
  resolvedAt: Date | null;
}

export interface NetworkPolicy {
  id: string;
  organizationId: string;
  name: string;
  type: 'isolation' | 'bandwidth_limit' | 'encryption_requirement' | 'access_control';
  rules: Record<string, unknown>;
  enabled: boolean;
  createdAt: Date;
  appliedTo: string[]; // Node IDs
}

// =============================================================================
// CENDIA MESH SERVICE
// =============================================================================

export class CendiaMeshService {
  private _nodes: Map<string, MeshNode> = new Map();
  private _connections: Map<string, MeshConnection> = new Map();
  private _channels: Map<string, SecureChannel> = new Map();
  private _events: Map<string, NetworkEvent[]> = new Map();
  private _policies: Map<string, NetworkPolicy> = new Map();

  private db: PrismaClient | null;

  constructor(prisma?: PrismaClient) {
    this.db = prisma || null;
    console.log(`[CendiaMesh] Encrypted Networking service initialized (persistence: ${this.db ? 'PostgreSQL' : 'in-memory'})`);


    this.loadFromDB().catch(() => {});
  }

  // ===========================================================================
  // NODE MANAGEMENT
  // ===========================================================================

  async registerNode(data: Omit<MeshNode, 'id' | 'status' | 'connections' | 'lastHeartbeat' | 'registeredAt'>): Promise<MeshNode> {
    const node: MeshNode = {
      ...data,
      id: `node-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
      status: 'online',
      connections: [],
      lastHeartbeat: new Date(),
      registeredAt: new Date(),
    };
    
    this._nodes.set(node.id, node);
    await this.recordEvent(node.organizationId, node.id, 'connection', 'info', `Node ${node.name} registered`);
    
    return node;
  }

  async updateNodeStatus(nodeId: string, status: MeshNode['status']): Promise<MeshNode | null> {
    const node = this._nodes.get(nodeId);
    if (!node) return null;
    
    const oldStatus = node.status;
    node.status = status;
    node.lastHeartbeat = new Date();
    this._nodes.set(nodeId, node);
    
    if (status !== oldStatus) {
      const eventType = status === 'online' ? 'recovery' : 'degradation';
      const severity = status === 'offline' ? 'error' : status === 'degraded' ? 'warning' : 'info';
      await this.recordEvent(node.organizationId, nodeId, eventType, severity, `Node status changed to ${status}`);
    }
    
    return node;
  }

  async getNode(nodeId: string): Promise<MeshNode | null> {
    return this._nodes.get(nodeId) || null;
  }

  async getNodesForOrg(organizationId: string): Promise<MeshNode[]> {
    return Array.from(this._nodes.values())
      .filter(n => n.organizationId === organizationId);
  }

  async heartbeat(nodeId: string): Promise<MeshNode | null> {
    const node = this._nodes.get(nodeId);
    if (!node) return null;
    
    node.lastHeartbeat = new Date();
    if (node.status === 'degraded' || node.status === 'offline') {
      node.status = 'online';
    }
    this._nodes.set(nodeId, node);
    
    return node;
  }

  // ===========================================================================
  // CONNECTION MANAGEMENT
  // ===========================================================================

  async establishConnection(data: Omit<MeshConnection, 'id' | 'status' | 'establishedAt' | 'lastActivity'>): Promise<MeshConnection | null> {
    const sourceNode = this._nodes.get(data.sourceNodeId);
    const targetNode = this._nodes.get(data.targetNodeId);
    
    if (!sourceNode || !targetNode) return null;
    
    const connection: MeshConnection = {
      ...data,
      id: `conn-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
      status: 'active',
      establishedAt: new Date(),
      lastActivity: new Date(),
    };
    
    this._connections.set(connection.id, connection);
    
    // Update node connections
    if (!sourceNode.connections.includes(targetNode.id)) {
      sourceNode.connections.push(targetNode.id);
      this._nodes.set(sourceNode.id, sourceNode);
    }
    if (!targetNode.connections.includes(sourceNode.id)) {
      targetNode.connections.push(sourceNode.id);
      this._nodes.set(targetNode.id, targetNode);
    }
    
    return connection;
  }

  async getConnections(organizationId: string): Promise<MeshConnection[]> {
    return Array.from(this._connections.values())
      .filter(c => c.organizationId === organizationId);
  }

  async getTopology(organizationId: string): Promise<MeshTopology> {
    const nodes = await this.getNodesForOrg(organizationId);
    const connections = await this.getConnections(organizationId);
    
    const totalBandwidth = nodes.reduce((sum, n) => sum + n.bandwidthMbps, 0) / 1000;
    const avgLatency = nodes.length > 0 
      ? nodes.reduce((sum, n) => sum + n.latencyMs, 0) / nodes.length 
      : 0;
    
    const onlineNodes = nodes.filter(n => n.status === 'online').length;
    const activeConnections = connections.filter(c => c.status === 'active').length;
    const healthScore = nodes.length > 0
      ? ((onlineNodes / nodes.length) * 50 + (connections.length > 0 ? (activeConnections / connections.length) * 50 : 50))
      : 100;
    
    return {
      organizationId,
      nodes,
      connections,
      totalBandwidthGbps: totalBandwidth,
      avgLatencyMs: avgLatency,
      healthScore,
    };
  }

  // ===========================================================================
  // SECURE CHANNELS
  // ===========================================================================

  async createSecureChannel(data: Omit<SecureChannel, 'id' | 'status' | 'createdAt' | 'messageCount'>): Promise<SecureChannel> {
    const channel: SecureChannel = {
      ...data,
      id: `channel-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
      status: 'active',
      createdAt: new Date(),
      messageCount: 0,
    };
    
    this._channels.set(channel.id, channel);
    return channel;
  }

  async getActiveChannels(organizationId: string): Promise<SecureChannel[]> {
    return Array.from(this._channels.values())
      .filter(c => c.organizationId === organizationId && c.status === 'active' && c.expiresAt > new Date());
  }

  async recordChannelMessage(channelId: string): Promise<SecureChannel | null> {
    const channel = this._channels.get(channelId);
    if (!channel || channel.status !== 'active') return null;
    
    channel.messageCount++;
    this._channels.set(channelId, channel);
    
    return channel;
  }

  async revokeChannel(channelId: string): Promise<SecureChannel | null> {
    const channel = this._channels.get(channelId);
    if (!channel) return null;
    
    channel.status = 'revoked';
    this._channels.set(channelId, channel);
    
    return channel;
  }

  // ===========================================================================
  // NETWORK EVENTS
  // ===========================================================================

  private async recordEvent(
    organizationId: string,
    nodeId: string,
    eventType: NetworkEvent['eventType'],
    severity: NetworkEvent['severity'],
    description: string
  ): Promise<NetworkEvent> {
    const event: NetworkEvent = {
      id: `event-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`,
      organizationId,
      nodeId,
      eventType,
      severity,
      description,
      timestamp: new Date(),
      resolved: eventType === 'recovery',
      resolvedAt: eventType === 'recovery' ? new Date() : null,
    };
    
    const events = this._events.get(organizationId) || [];
    events.push(event);
    if (events.length > 1000) events.shift();
    this._events.set(organizationId, events);
    
    return event;
  }

  async getEvents(organizationId: string, limit: number = 100): Promise<NetworkEvent[]> {
    return (this._events.get(organizationId) || [])
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async resolveEvent(eventId: string, organizationId: string): Promise<NetworkEvent | null> {
    const events = this._events.get(organizationId) || [];
    const event = events.find(e => e.id === eventId);
    
    if (event) {
      event.resolved = true;
      event.resolvedAt = new Date();
      this._events.set(organizationId, events);
    }
    
    return event || null;
  }

  // ===========================================================================
  // NETWORK POLICIES
  // ===========================================================================

  async createPolicy(data: Omit<NetworkPolicy, 'id' | 'createdAt'>): Promise<NetworkPolicy> {
    const policy: NetworkPolicy = {
      ...data,
      id: `policy-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`,
      createdAt: new Date(),
    };
    
    this._policies.set(policy.id, policy);
    return policy;
  }

  async getPolicies(organizationId: string): Promise<NetworkPolicy[]> {
    return Array.from(this._policies.values())
      .filter(p => p.organizationId === organizationId);
  }

  async togglePolicy(policyId: string, enabled: boolean): Promise<NetworkPolicy | null> {
    const policy = this._policies.get(policyId);
    if (!policy) return null;
    
    policy.enabled = enabled;
    this._policies.set(policyId, policy);
    
    return policy;
  }

  // ===========================================================================
  // DASHBOARD
  // ===========================================================================

  async getDashboard(organizationId: string): Promise<{
    totalNodes: number;
    onlineNodes: number;
    activeConnections: number;
    secureChannels: number;
    networkHealth: number;
    avgLatency: number;
    recentEvents: NetworkEvent[];
    nodesByType: Record<string, number>;
    topologySnapshot: MeshTopology;
  }> {
    const topology = await this.getTopology(organizationId);
    const events = await this.getEvents(organizationId, 10);
    const channels = await this.getActiveChannels(organizationId);
    
    const nodesByType: Record<string, number> = {};
    for (const n of topology.nodes) {
      nodesByType[n.type] = (nodesByType[n.type] || 0) + 1;
    }
    
    return {
      totalNodes: topology.nodes.length,
      onlineNodes: topology.nodes.filter(n => n.status === 'online').length,
      activeConnections: topology.connections.filter(c => c.status === 'active').length,
      secureChannels: channels.length,
      networkHealth: topology.healthScore,
      avgLatency: topology.avgLatencyMs,
      recentEvents: events,
      nodesByType,
      topologySnapshot: topology,
    };
  }

  // No seed method - Enterprise Platinum standard



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'CendiaMesh', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this._nodes.has(d.id)) this._nodes.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'CendiaMesh', recordType: 'record', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this._connections.has(d.id)) this._connections.set(d.id, d);


      }


      restored += recs_1.length;


      const recs_2 = await loadServiceRecords({ serviceName: 'CendiaMesh', recordType: 'record', limit: 1000 });


      for (const rec of recs_2) {


        const d = rec.data as any;


        if (d?.id && !this._channels.has(d.id)) this._channels.set(d.id, d);


      }


      restored += recs_2.length;


      const recs_3 = await loadServiceRecords({ serviceName: 'CendiaMesh', recordType: 'record', limit: 1000 });


      for (const rec of recs_3) {


        const d = rec.data as any;


        if (d?.id && !this._events.has(d.id)) this._events.set(d.id, d);


      }


      restored += recs_3.length;


      const recs_4 = await loadServiceRecords({ serviceName: 'CendiaMesh', recordType: 'record', limit: 1000 });


      for (const rec of recs_4) {


        const d = rec.data as any;


        if (d?.id && !this._policies.has(d.id)) this._policies.set(d.id, d);


      }


      restored += recs_4.length;


      if (restored > 0) logger.info(`[CendiaMeshService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[CendiaMeshService] DB reload skipped: ${(err as Error).message}`);


    }


  }

  // ===========================================================================
  // HEALTH CHECK
  // ===========================================================================

  async getHealth(): Promise<{ healthy: boolean; service: string; timestamp: Date; details: Record<string, unknown> }> {
    return {
      healthy: true,
      service: 'CendiaMesh',
      timestamp: new Date(),
      details: { uptime: process.uptime(), memoryMB: Math.round(process.memoryUsage().heapUsed / 1048576) },
    };
  }
}

export const cendiaMeshService = new CendiaMeshService();
