// @ts-nocheck
// =============================================================================
// SOVEREIGN STACK API CLIENT
// Enterprise Platinum Standard - Full data flow integration
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
const SOVEREIGN_API_BASE = '/api/v1/sovereign';

// =============================================================================
// TYPES
// =============================================================================

export interface TimelineEvent {
  id: string;
  timestamp: string;
  eventType: string;
  entityType: string;
  entityId: string;
  action: string;
  actor: string;
  metadata: Record<string, any>;
}
export interface VectorSearchResult {
  id: string;
  content: string;
  similarity: number;
  metadata: Record<string, any>;
}
export interface QueueStats {
  [queueName: string]: {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
  };
}
export interface ServiceHealth {
  available: boolean;
  latency?: number;
}
export interface SovereignHealthStatus {
  healthy: boolean;
  services: Record<string, ServiceHealth>;
  timestamp: string;
}

// =============================================================================
// DRUID API - Timeline & Analytics
// =============================================================================

export const druidApi = stryMutAct_9fa48("15065") ? {} : (stryCov_9fa48("15065"), {
  /**
   * Query timeline events (powers CendiaChronos™)
   */
  async queryTimeline(startTime: Date, endTime: Date, eventTypes?: string[], limit = 100): Promise<TimelineEvent[]> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/druid/timeline`, stryMutAct_9fa48("15068") ? {} : (stryCov_9fa48("15068"), {
      method: 'POST',
      headers: stryMutAct_9fa48("15070") ? {} : (stryCov_9fa48("15070"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("15072") ? {} : (stryCov_9fa48("15072"), {
        startTime,
        endTime,
        eventTypes,
        limit
      }))
    }));
    const data = await response.json();
    return data.success ? data.data : stryMutAct_9fa48("15073") ? ["Stryker was here"] : (stryCov_9fa48("15073"), []);
  },
  /**
   * Query aggregated metrics
   */
  async queryMetrics(metric: string, startTime: Date, endTime: Date, granularity: 'minute' | 'hour' | 'day' = 'hour'): Promise<any[]> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/druid/metrics`, stryMutAct_9fa48("15077") ? {} : (stryCov_9fa48("15077"), {
      method: 'POST',
      headers: stryMutAct_9fa48("15079") ? {} : (stryCov_9fa48("15079"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("15081") ? {} : (stryCov_9fa48("15081"), {
        metric,
        startTime,
        endTime,
        granularity
      }))
    }));
    const data = await response.json();
    return data.success ? data.data : stryMutAct_9fa48("15082") ? ["Stryker was here"] : (stryCov_9fa48("15082"), []);
  },
  /**
   * Ingest events to Druid
   */
  async ingestEvents(datasource: string, events: any[]): Promise<boolean> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/druid/ingest`, stryMutAct_9fa48("15085") ? {} : (stryCov_9fa48("15085"), {
      method: 'POST',
      headers: stryMutAct_9fa48("15087") ? {} : (stryCov_9fa48("15087"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("15089") ? {} : (stryCov_9fa48("15089"), {
        datasource,
        events
      }))
    }));
    const data = await response.json();
    return data.success;
  },
  /**
   * Check Druid health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${SOVEREIGN_API_BASE}/druid/health`);
      const data = await response.json();
      return data.available;
    } catch {
      return stryMutAct_9fa48("15094") ? true : (stryCov_9fa48("15094"), false);
    }
  }
});

// =============================================================================
// MINIO API - Document Storage
// =============================================================================

export const storageApi = stryMutAct_9fa48("15095") ? {} : (stryCov_9fa48("15095"), {
  /**
   * Upload document to MinIO
   */
  async uploadDocument(fileName: string, content: ArrayBuffer | string, contentType: string, metadata?: Record<string, string>, bucket = 'cendia-documents'): Promise<{
    url: string;
    etag: string;
  } | null> {
    const base64Content = (stryMutAct_9fa48("15100") ? typeof content !== 'string' : stryMutAct_9fa48("15099") ? false : stryMutAct_9fa48("15098") ? true : (stryCov_9fa48("15098", "15099", "15100"), typeof content === 'string')) ? btoa(content) : btoa(String.fromCharCode(...new Uint8Array(content)));
    const response = await fetch(`${SOVEREIGN_API_BASE}/storage/upload`, stryMutAct_9fa48("15103") ? {} : (stryCov_9fa48("15103"), {
      method: 'POST',
      headers: stryMutAct_9fa48("15105") ? {} : (stryCov_9fa48("15105"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("15107") ? {} : (stryCov_9fa48("15107"), {
        bucket,
        fileName,
        content: base64Content,
        contentType,
        metadata
      }))
    }));
    const data = await response.json();
    return data.success ? data.data : null;
  },
  /**
   * Download document from MinIO
   */
  async downloadDocument(bucket: string, fileName: string): Promise<Blob | null> {
    try {
      const response = await fetch(`${SOVEREIGN_API_BASE}/storage/download/${bucket}/${fileName}`);
      if (stryMutAct_9fa48("15113") ? false : stryMutAct_9fa48("15112") ? true : stryMutAct_9fa48("15111") ? response.ok : (stryCov_9fa48("15111", "15112", "15113"), !response.ok)) return null;
      return await response.blob();
    } catch {
      return null;
    }
  },
  /**
   * List files in bucket
   */
  async listFiles(bucket: string, prefix?: string): Promise<any[]> {
    const url = prefix ? `${SOVEREIGN_API_BASE}/storage/list/${bucket}?prefix=${encodeURIComponent(prefix)}` : `${SOVEREIGN_API_BASE}/storage/list/${bucket}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.success ? data.data : stryMutAct_9fa48("15118") ? ["Stryker was here"] : (stryCov_9fa48("15118"), []);
  },
  /**
   * Get bucket statistics
   */
  async getBucketStats(bucket: string): Promise<{
    count: number;
    totalSize: number;
  } | null> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/storage/stats/${bucket}`);
    const data = await response.json();
    return data.success ? data.data : null;
  },
  /**
   * Check storage health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${SOVEREIGN_API_BASE}/storage/health`);
      const data = await response.json();
      return data.available;
    } catch {
      return stryMutAct_9fa48("15125") ? true : (stryCov_9fa48("15125"), false);
    }
  }
});

// =============================================================================
// VECTOR API - RAG & Semantic Search
// =============================================================================

export const vectorApi = stryMutAct_9fa48("15126") ? {} : (stryCov_9fa48("15126"), {
  /**
   * Store document with embeddings for RAG
   */
  async storeDocument(documentId: string, content: string, metadata?: Record<string, any>, chunkSize = 500): Promise<number> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/vector/store`, stryMutAct_9fa48("15129") ? {} : (stryCov_9fa48("15129"), {
      method: 'POST',
      headers: stryMutAct_9fa48("15131") ? {} : (stryCov_9fa48("15131"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("15133") ? {} : (stryCov_9fa48("15133"), {
        documentId,
        content,
        metadata,
        chunkSize
      }))
    }));
    const data = await response.json();
    return data.success ? data.chunks : 0;
  },
  /**
   * Search similar documents (RAG retrieval)
   */
  async searchSimilar(query: string, limit = 5, threshold = 0.7): Promise<VectorSearchResult[]> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/vector/search`, stryMutAct_9fa48("15136") ? {} : (stryCov_9fa48("15136"), {
      method: 'POST',
      headers: stryMutAct_9fa48("15138") ? {} : (stryCov_9fa48("15138"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("15140") ? {} : (stryCov_9fa48("15140"), {
        query,
        limit,
        threshold
      }))
    }));
    const data = await response.json();
    return data.success ? data.data : stryMutAct_9fa48("15141") ? ["Stryker was here"] : (stryCov_9fa48("15141"), []);
  },
  /**
   * Store decision context for agent memory
   */
  async storeDecisionContext(decision: {
    decisionId: string;
    title: string;
    context: string;
    outcome: string;
    confidence: number;
    participants: string[];
  }): Promise<boolean> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/vector/decision`, stryMutAct_9fa48("15144") ? {} : (stryCov_9fa48("15144"), {
      method: 'POST',
      headers: stryMutAct_9fa48("15146") ? {} : (stryCov_9fa48("15146"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(decision)
    }));
    const data = await response.json();
    return data.success;
  },
  /**
   * Find similar past decisions
   */
  async findSimilarDecisions(query: string, limit = 5): Promise<any[]> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/vector/decisions/search`, stryMutAct_9fa48("15150") ? {} : (stryCov_9fa48("15150"), {
      method: 'POST',
      headers: stryMutAct_9fa48("15152") ? {} : (stryCov_9fa48("15152"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("15154") ? {} : (stryCov_9fa48("15154"), {
        query,
        limit
      }))
    }));
    const data = await response.json();
    return data.success ? data.data : stryMutAct_9fa48("15155") ? ["Stryker was here"] : (stryCov_9fa48("15155"), []);
  },
  /**
   * Store agent memory
   */
  async storeAgentMemory(memory: {
    agentId: string;
    memoryType: 'episodic' | 'semantic' | 'procedural';
    content: string;
    importance: number;
    expiresAt?: Date;
  }): Promise<boolean> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/vector/agent-memory`, stryMutAct_9fa48("15158") ? {} : (stryCov_9fa48("15158"), {
      method: 'POST',
      headers: stryMutAct_9fa48("15160") ? {} : (stryCov_9fa48("15160"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(memory)
    }));
    const data = await response.json();
    return data.success;
  },
  /**
   * Recall agent memories
   */
  async recallAgentMemories(agentId: string, query: string, limit = 10): Promise<any[]> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/vector/agent-memory/recall`, stryMutAct_9fa48("15164") ? {} : (stryCov_9fa48("15164"), {
      method: 'POST',
      headers: stryMutAct_9fa48("15166") ? {} : (stryCov_9fa48("15166"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("15168") ? {} : (stryCov_9fa48("15168"), {
        agentId,
        query,
        limit
      }))
    }));
    const data = await response.json();
    return data.success ? data.data : stryMutAct_9fa48("15169") ? ["Stryker was here"] : (stryCov_9fa48("15169"), []);
  },
  /**
   * Check vector service health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${SOVEREIGN_API_BASE}/vector/health`);
      const data = await response.json();
      return data.available;
    } catch {
      return stryMutAct_9fa48("15174") ? true : (stryCov_9fa48("15174"), false);
    }
  }
});

// =============================================================================
// QUEUE API - Agent Orchestration
// =============================================================================

export const queueApi = stryMutAct_9fa48("15175") ? {} : (stryCov_9fa48("15175"), {
  /**
   * Queue a deliberation job
   */
  async queueDeliberation(deliberation: {
    sessionId: string;
    question: string;
    agents: string[];
    context?: Record<string, any>;
    priority?: 'critical' | 'high' | 'normal' | 'low';
  }): Promise<string | null> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/queue/deliberation`, stryMutAct_9fa48("15178") ? {} : (stryCov_9fa48("15178"), {
      method: 'POST',
      headers: stryMutAct_9fa48("15180") ? {} : (stryCov_9fa48("15180"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(deliberation)
    }));
    const data = await response.json();
    return data.success ? data.jobId : null;
  },
  /**
   * Queue a document processing job
   */
  async queueDocumentProcessing(doc: {
    documentId: string;
    fileName: string;
    fileType: string;
    storageUrl: string;
    extractText?: boolean;
    generateEmbeddings?: boolean;
    runOCR?: boolean;
  }): Promise<string | null> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/queue/document`, stryMutAct_9fa48("15184") ? {} : (stryCov_9fa48("15184"), {
      method: 'POST',
      headers: stryMutAct_9fa48("15186") ? {} : (stryCov_9fa48("15186"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(doc)
    }));
    const data = await response.json();
    return data.success ? data.jobId : null;
  },
  /**
   * Get queue statistics
   */
  async getStats(): Promise<QueueStats> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/queue/stats`);
    const data = await response.json();
    return data.success ? data.data : {};
  },
  /**
   * Get job status
   */
  async getJobStatus(jobId: string, queue?: string): Promise<any> {
    const url = queue ? `${SOVEREIGN_API_BASE}/queue/job/${jobId}?queue=${queue}` : `${SOVEREIGN_API_BASE}/queue/job/${jobId}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.success ? data.data : null;
  },
  /**
   * Check queue service health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${SOVEREIGN_API_BASE}/queue/health`);
      const data = await response.json();
      return data.available;
    } catch {
      return stryMutAct_9fa48("15197") ? true : (stryCov_9fa48("15197"), false);
    }
  }
});

// =============================================================================
// PROMETHEUS API - Metrics
// =============================================================================

export const metricsApi = stryMutAct_9fa48("15198") ? {} : (stryCov_9fa48("15198"), {
  /**
   * Query Prometheus for time-series metrics
   */
  async queryRange(query: string, start: Date, end: Date, step = '1m'): Promise<any[]> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/prometheus/query`, stryMutAct_9fa48("15202") ? {} : (stryCov_9fa48("15202"), {
      method: 'POST',
      headers: stryMutAct_9fa48("15204") ? {} : (stryCov_9fa48("15204"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("15206") ? {} : (stryCov_9fa48("15206"), {
        query,
        start: Math.floor(stryMutAct_9fa48("15207") ? start.getTime() * 1000 : (stryCov_9fa48("15207"), start.getTime() / 1000)),
        end: Math.floor(stryMutAct_9fa48("15208") ? end.getTime() * 1000 : (stryCov_9fa48("15208"), end.getTime() / 1000)),
        step
      }))
    }));
    const data = await response.json();
    return data.success ? stryMutAct_9fa48("15211") ? data.data?.result && [] : stryMutAct_9fa48("15210") ? false : stryMutAct_9fa48("15209") ? true : (stryCov_9fa48("15209", "15210", "15211"), (stryMutAct_9fa48("15212") ? data.data.result : (stryCov_9fa48("15212"), data.data?.result)) || (stryMutAct_9fa48("15213") ? ["Stryker was here"] : (stryCov_9fa48("15213"), []))) : stryMutAct_9fa48("15214") ? ["Stryker was here"] : (stryCov_9fa48("15214"), []);
  },
  /**
   * Get current metric value
   */
  async getCurrentValue(metricName: string): Promise<number | null> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/prometheus/metric/${encodeURIComponent(metricName)}`);
    const data = await response.json();
    if (stryMutAct_9fa48("15219") ? data.success || data.data?.result?.[0]?.value : stryMutAct_9fa48("15218") ? false : stryMutAct_9fa48("15217") ? true : (stryCov_9fa48("15217", "15218", "15219"), data.success && (stryMutAct_9fa48("15222") ? data.data.result?.[0]?.value : stryMutAct_9fa48("15221") ? data.data?.result[0]?.value : stryMutAct_9fa48("15220") ? data.data?.result?.[0].value : (stryCov_9fa48("15220", "15221", "15222"), data.data?.result?.[0]?.value)))) {
      return parseFloat(data.data.result[0].value[1]);
    }
    return null;
  },
  /**
   * Check Prometheus health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${SOVEREIGN_API_BASE}/prometheus/health`);
      const data = await response.json();
      return data.available;
    } catch {
      return stryMutAct_9fa48("15228") ? true : (stryCov_9fa48("15228"), false);
    }
  }
});

// =============================================================================
// N8N API - Workflow Automation
// =============================================================================

export const workflowApi = stryMutAct_9fa48("15229") ? {} : (stryCov_9fa48("15229"), {
  /**
   * Get all n8n workflows
   */
  async getWorkflows(): Promise<any[]> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/n8n/workflows`);
    const data = await response.json();
    return data.success ? data.data : stryMutAct_9fa48("15232") ? ["Stryker was here"] : (stryCov_9fa48("15232"), []);
  },
  /**
   * Trigger a workflow
   */
  async triggerWorkflow(workflowId: string, payload?: any): Promise<boolean> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/n8n/trigger/${workflowId}`, stryMutAct_9fa48("15235") ? {} : (stryCov_9fa48("15235"), {
      method: 'POST',
      headers: stryMutAct_9fa48("15237") ? {} : (stryCov_9fa48("15237"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("15241") ? payload && {} : stryMutAct_9fa48("15240") ? false : stryMutAct_9fa48("15239") ? true : (stryCov_9fa48("15239", "15240", "15241"), payload || {}))
    }));
    const data = await response.json();
    return data.success;
  },
  /**
   * Check n8n health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${SOVEREIGN_API_BASE}/n8n/health`);
      const data = await response.json();
      return data.available;
    } catch {
      return stryMutAct_9fa48("15246") ? true : (stryCov_9fa48("15246"), false);
    }
  }
});

// =============================================================================
// UNLEASH API - Feature Flags
// =============================================================================

export const featureFlagsApi = stryMutAct_9fa48("15247") ? {} : (stryCov_9fa48("15247"), {
  /**
   * Get all feature flags
   */
  async getAllFlags(): Promise<any[]> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/unleash/features`);
    const data = await response.json();
    return data.success ? data.data : stryMutAct_9fa48("15250") ? ["Stryker was here"] : (stryCov_9fa48("15250"), []);
  },
  /**
   * Check if feature is enabled
   */
  async isEnabled(featureName: string): Promise<boolean> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/unleash/feature/${featureName}`);
    const data = await response.json();
    return stryMutAct_9fa48("15253") ? data.enabled && false : (stryCov_9fa48("15253"), data.enabled ?? (stryMutAct_9fa48("15254") ? true : (stryCov_9fa48("15254"), false)));
  },
  /**
   * Check Unleash health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${SOVEREIGN_API_BASE}/unleash/health`);
      const data = await response.json();
      return data.available;
    } catch {
      return stryMutAct_9fa48("15259") ? true : (stryCov_9fa48("15259"), false);
    }
  }
});

// =============================================================================
// ENTERPRISE SECURITY API - Keycloak, Casbin, Tika
// =============================================================================

const ENTERPRISE_API_BASE = '/api/v1/enterprise/security';
export const enterpriseApi = stryMutAct_9fa48("15261") ? {} : (stryCov_9fa48("15261"), {
  /**
   * Get current authenticated user from Keycloak
   */
  async getCurrentUser(): Promise<any> {
    const response = await fetch(`${ENTERPRISE_API_BASE}/me`, stryMutAct_9fa48("15264") ? {} : (stryCov_9fa48("15264"), {
      headers: stryMutAct_9fa48("15265") ? {} : (stryCov_9fa48("15265"), {
        'Content-Type': 'application/json'
      })
    }));
    const data = await response.json();
    return data.success ? data.data : null;
  },
  /**
   * Check if user has permission (Casbin policy check)
   */
  async checkPermission(resource: string, action: string): Promise<boolean> {
    const response = await fetch(`${ENTERPRISE_API_BASE}/check-permission`, stryMutAct_9fa48("15269") ? {} : (stryCov_9fa48("15269"), {
      method: 'POST',
      headers: stryMutAct_9fa48("15271") ? {} : (stryCov_9fa48("15271"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("15273") ? {} : (stryCov_9fa48("15273"), {
        resource,
        action
      }))
    }));
    const data = await response.json();
    return stryMutAct_9fa48("15274") ? data.allowed && false : (stryCov_9fa48("15274"), data.allowed ?? (stryMutAct_9fa48("15275") ? true : (stryCov_9fa48("15275"), false)));
  },
  /**
   * Check if user can approve a decision type
   */
  async canApproveDecision(decisionType: string, existingApprovers: string[] = stryMutAct_9fa48("15276") ? ["Stryker was here"] : (stryCov_9fa48("15276"), [])): Promise<{
    allowed: boolean;
    reason: string;
  }> {
    const response = await fetch(`${ENTERPRISE_API_BASE}/policies/can-approve`, stryMutAct_9fa48("15279") ? {} : (stryCov_9fa48("15279"), {
      method: 'POST',
      headers: stryMutAct_9fa48("15281") ? {} : (stryCov_9fa48("15281"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("15283") ? {} : (stryCov_9fa48("15283"), {
        decisionType,
        existingApprovers
      }))
    }));
    const data = await response.json();
    return stryMutAct_9fa48("15284") ? {} : (stryCov_9fa48("15284"), {
      allowed: stryMutAct_9fa48("15285") ? data.allowed && false : (stryCov_9fa48("15285"), data.allowed ?? (stryMutAct_9fa48("15286") ? true : (stryCov_9fa48("15286"), false))),
      reason: stryMutAct_9fa48("15287") ? data.reason && '' : (stryCov_9fa48("15287"), data.reason ?? '')
    });
  },
  /**
   * Check if user can veto a decision type
   */
  async canVetoDecision(decisionType: string): Promise<{
    allowed: boolean;
    reason: string;
  }> {
    const response = await fetch(`${ENTERPRISE_API_BASE}/policies/can-veto`, stryMutAct_9fa48("15291") ? {} : (stryCov_9fa48("15291"), {
      method: 'POST',
      headers: stryMutAct_9fa48("15293") ? {} : (stryCov_9fa48("15293"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("15295") ? {} : (stryCov_9fa48("15295"), {
        decisionType
      }))
    }));
    const data = await response.json();
    return stryMutAct_9fa48("15296") ? {} : (stryCov_9fa48("15296"), {
      allowed: stryMutAct_9fa48("15297") ? data.allowed && false : (stryCov_9fa48("15297"), data.allowed ?? (stryMutAct_9fa48("15298") ? true : (stryCov_9fa48("15298"), false))),
      reason: stryMutAct_9fa48("15299") ? data.reason && '' : (stryCov_9fa48("15299"), data.reason ?? '')
    });
  },
  /**
   * Extract text from document using Apache Tika
   */
  async extractDocument(content: string,
  // base64 encoded
  mimeType: string, fileName?: string, useOCR = stryMutAct_9fa48("15301") ? true : (stryCov_9fa48("15301"), false)): Promise<{
    text: string;
    metadata: any;
    wordCount: number;
  } | null> {
    const response = await fetch(`${ENTERPRISE_API_BASE}/documents/extract`, stryMutAct_9fa48("15304") ? {} : (stryCov_9fa48("15304"), {
      method: 'POST',
      headers: stryMutAct_9fa48("15306") ? {} : (stryCov_9fa48("15306"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("15308") ? {} : (stryCov_9fa48("15308"), {
        content,
        mimeType,
        fileName,
        useOCR
      }))
    }));
    const data = await response.json();
    return data.success ? data.data : null;
  },
  async extractDocumentFromVault(bucket: string, path: string, mimeType: string, fileName?: string, useOCR = stryMutAct_9fa48("15309") ? true : (stryCov_9fa48("15309"), false)): Promise<{
    text: string;
    metadata: any;
    wordCount: number;
  } | null> {
    const response = await fetch(`${ENTERPRISE_API_BASE}/documents/extract-from-vault`, stryMutAct_9fa48("15312") ? {} : (stryCov_9fa48("15312"), {
      method: 'POST',
      headers: stryMutAct_9fa48("15314") ? {} : (stryCov_9fa48("15314"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("15316") ? {} : (stryCov_9fa48("15316"), {
        bucket,
        path,
        mimeType,
        fileName,
        useOCR
      }))
    }));
    const data = await response.json();
    return data.success ? data.data : null;
  },
  /**
   * Detect document type
   */
  async detectDocumentType(content: string): Promise<{
    mimeType: string;
    formatName: string;
  } | null> {
    const response = await fetch(`${ENTERPRISE_API_BASE}/documents/detect-type`, stryMutAct_9fa48("15319") ? {} : (stryCov_9fa48("15319"), {
      method: 'POST',
      headers: stryMutAct_9fa48("15321") ? {} : (stryCov_9fa48("15321"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("15323") ? {} : (stryCov_9fa48("15323"), {
        content
      }))
    }));
    const data = await response.json();
    return data.success ? data.data : null;
  },
  /**
   * Get supported document formats
   */
  async getSupportedFormats(): Promise<string[]> {
    const response = await fetch(`${ENTERPRISE_API_BASE}/documents/formats`);
    const data = await response.json();
    return data.success ? data.data : stryMutAct_9fa48("15326") ? ["Stryker was here"] : (stryCov_9fa48("15326"), []);
  },
  /**
   * Get enterprise security status
   */
  async getSecurityStatus(): Promise<any> {
    const response = await fetch(`${ENTERPRISE_API_BASE}/security/status`);
    const data = await response.json();
    return data.success ? data.data : null;
  },
  /**
   * Check Tika service health
   */
  async checkTikaHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${ENTERPRISE_API_BASE}/documents/health`);
      const data = await response.json();
      return stryMutAct_9fa48("15332") ? data.available && false : (stryCov_9fa48("15332"), data.available ?? (stryMutAct_9fa48("15333") ? true : (stryCov_9fa48("15333"), false)));
    } catch {
      return stryMutAct_9fa48("15335") ? true : (stryCov_9fa48("15335"), false);
    }
  }
});

// =============================================================================
// CENDIAVAULT™ - Document Storage (MinIO)
// =============================================================================

export interface VaultDocument {
  id: string;
  filename: string;
  bucket: string;
  path: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  metadata: Record<string, any>;
}
export const vaultApi = stryMutAct_9fa48("15336") ? {} : (stryCov_9fa48("15336"), {
  /**
   * Upload document to CendiaVault (MinIO)
   */
  async uploadDocument(file: File, bucket: string = 'council-documents', metadata?: Record<string, any>): Promise<VaultDocument | null> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);
      if (stryMutAct_9fa48("15343") ? false : stryMutAct_9fa48("15342") ? true : (stryCov_9fa48("15342", "15343"), metadata)) {
        formData.append('metadata', JSON.stringify(metadata));
      }
      const response = await fetch(`${SOVEREIGN_API_BASE}/vault/upload`, stryMutAct_9fa48("15347") ? {} : (stryCov_9fa48("15347"), {
        method: 'POST',
        body: formData
      }));
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.warn('[CendiaVault] Upload failed, document stored locally:', error);
      // Return a local reference for offline/dev mode
      return stryMutAct_9fa48("15351") ? {} : (stryCov_9fa48("15351"), {
        id: `local-${Date.now()}`,
        filename: file.name,
        bucket,
        path: `${bucket}/${file.name}`,
        size: file.size,
        mimeType: file.type,
        uploadedAt: new Date().toISOString(),
        metadata: stryMutAct_9fa48("15356") ? metadata && {} : stryMutAct_9fa48("15355") ? false : stryMutAct_9fa48("15354") ? true : (stryCov_9fa48("15354", "15355", "15356"), metadata || {})
      });
    }
  },
  /**
   * Get document from CendiaVault
   */
  async getDocument(bucket: string, path: string): Promise<Blob | null> {
    try {
      const response = await fetch(`${SOVEREIGN_API_BASE}/vault/download?bucket=${bucket}&path=${encodeURIComponent(path)}`);
      if (stryMutAct_9fa48("15361") ? false : stryMutAct_9fa48("15360") ? true : (stryCov_9fa48("15360", "15361"), response.ok)) {
        return await response.blob();
      }
      return null;
    } catch {
      return null;
    }
  },
  /**
   * List documents in a bucket
   */
  async listDocuments(bucket: string = 'council-documents'): Promise<VaultDocument[]> {
    try {
      const response = await fetch(`${SOVEREIGN_API_BASE}/vault/list?bucket=${bucket}`);
      const data = await response.json();
      return data.success ? data.data : stryMutAct_9fa48("15368") ? ["Stryker was here"] : (stryCov_9fa48("15368"), []);
    } catch {
      return stryMutAct_9fa48("15370") ? ["Stryker was here"] : (stryCov_9fa48("15370"), []);
    }
  },
  /**
   * Delete document from CendiaVault
   */
  async deleteDocument(bucket: string, path: string): Promise<boolean> {
    try {
      const response = await fetch(`${SOVEREIGN_API_BASE}/vault/delete`, stryMutAct_9fa48("15374") ? {} : (stryCov_9fa48("15374"), {
        method: 'DELETE',
        headers: stryMutAct_9fa48("15376") ? {} : (stryCov_9fa48("15376"), {
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(stryMutAct_9fa48("15378") ? {} : (stryCov_9fa48("15378"), {
          bucket,
          path
        }))
      }));
      const data = await response.json();
      return stryMutAct_9fa48("15379") ? data.success && false : (stryCov_9fa48("15379"), data.success ?? (stryMutAct_9fa48("15380") ? true : (stryCov_9fa48("15380"), false)));
    } catch {
      return stryMutAct_9fa48("15382") ? true : (stryCov_9fa48("15382"), false);
    }
  },
  /**
   * Check vault health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${SOVEREIGN_API_BASE}/vault/health`);
      const data = await response.json();
      return stryMutAct_9fa48("15386") ? data.available && false : (stryCov_9fa48("15386"), data.available ?? (stryMutAct_9fa48("15387") ? true : (stryCov_9fa48("15387"), false)));
    } catch {
      return stryMutAct_9fa48("15389") ? true : (stryCov_9fa48("15389"), false);
    }
  }
});

// =============================================================================
// SOVEREIGN STACK HEALTH
// =============================================================================

export const sovereignApi = stryMutAct_9fa48("15390") ? {} : (stryCov_9fa48("15390"), {
  /**
   * Get health status of all sovereign services
   */
  async getHealthStatus(): Promise<SovereignHealthStatus> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/health`);
    const data = await response.json();
    return data;
  },
  // Re-export all service APIs
  druid: druidApi,
  storage: storageApi,
  vector: vectorApi,
  queue: queueApi,
  metrics: metricsApi,
  workflow: workflowApi,
  featureFlags: featureFlagsApi,
  enterprise: enterpriseApi,
  vault: vaultApi
});
export default sovereignApi;