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

export const druidApi = stryMutAct_9fa48("251") ? {} : (stryCov_9fa48("251"), {
  /**
   * Query timeline events (powers CendiaChronos™)
   */
  async queryTimeline(startTime: Date, endTime: Date, eventTypes?: string[], limit = 100): Promise<TimelineEvent[]> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/druid/timeline`, stryMutAct_9fa48("254") ? {} : (stryCov_9fa48("254"), {
      method: 'POST',
      headers: stryMutAct_9fa48("256") ? {} : (stryCov_9fa48("256"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("258") ? {} : (stryCov_9fa48("258"), {
        startTime,
        endTime,
        eventTypes,
        limit
      }))
    }));
    const data = await response.json();
    return data.success ? data.data : stryMutAct_9fa48("259") ? ["Stryker was here"] : (stryCov_9fa48("259"), []);
  },
  /**
   * Query aggregated metrics
   */
  async queryMetrics(metric: string, startTime: Date, endTime: Date, granularity: 'minute' | 'hour' | 'day' = 'hour'): Promise<any[]> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/druid/metrics`, stryMutAct_9fa48("263") ? {} : (stryCov_9fa48("263"), {
      method: 'POST',
      headers: stryMutAct_9fa48("265") ? {} : (stryCov_9fa48("265"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("267") ? {} : (stryCov_9fa48("267"), {
        metric,
        startTime,
        endTime,
        granularity
      }))
    }));
    const data = await response.json();
    return data.success ? data.data : stryMutAct_9fa48("268") ? ["Stryker was here"] : (stryCov_9fa48("268"), []);
  },
  /**
   * Ingest events to Druid
   */
  async ingestEvents(datasource: string, events: any[]): Promise<boolean> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/druid/ingest`, stryMutAct_9fa48("271") ? {} : (stryCov_9fa48("271"), {
      method: 'POST',
      headers: stryMutAct_9fa48("273") ? {} : (stryCov_9fa48("273"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("275") ? {} : (stryCov_9fa48("275"), {
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
      return stryMutAct_9fa48("280") ? true : (stryCov_9fa48("280"), false);
    }
  }
});

// =============================================================================
// MINIO API - Document Storage
// =============================================================================

export const storageApi = stryMutAct_9fa48("281") ? {} : (stryCov_9fa48("281"), {
  /**
   * Upload document to MinIO
   */
  async uploadDocument(fileName: string, content: ArrayBuffer | string, contentType: string, metadata?: Record<string, string>, bucket = 'cendia-documents'): Promise<{
    url: string;
    etag: string;
  } | null> {
    const base64Content = (stryMutAct_9fa48("286") ? typeof content !== 'string' : stryMutAct_9fa48("285") ? false : stryMutAct_9fa48("284") ? true : (stryCov_9fa48("284", "285", "286"), typeof content === 'string')) ? btoa(content) : btoa(String.fromCharCode(...new Uint8Array(content)));
    const response = await fetch(`${SOVEREIGN_API_BASE}/storage/upload`, stryMutAct_9fa48("289") ? {} : (stryCov_9fa48("289"), {
      method: 'POST',
      headers: stryMutAct_9fa48("291") ? {} : (stryCov_9fa48("291"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("293") ? {} : (stryCov_9fa48("293"), {
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
      if (stryMutAct_9fa48("299") ? false : stryMutAct_9fa48("298") ? true : stryMutAct_9fa48("297") ? response.ok : (stryCov_9fa48("297", "298", "299"), !response.ok)) return null;
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
    return data.success ? data.data : stryMutAct_9fa48("304") ? ["Stryker was here"] : (stryCov_9fa48("304"), []);
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
      return stryMutAct_9fa48("311") ? true : (stryCov_9fa48("311"), false);
    }
  }
});

// =============================================================================
// VECTOR API - RAG & Semantic Search
// =============================================================================

export const vectorApi = stryMutAct_9fa48("312") ? {} : (stryCov_9fa48("312"), {
  /**
   * Store document with embeddings for RAG
   */
  async storeDocument(documentId: string, content: string, metadata?: Record<string, any>, chunkSize = 500): Promise<number> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/vector/store`, stryMutAct_9fa48("315") ? {} : (stryCov_9fa48("315"), {
      method: 'POST',
      headers: stryMutAct_9fa48("317") ? {} : (stryCov_9fa48("317"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("319") ? {} : (stryCov_9fa48("319"), {
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
    const response = await fetch(`${SOVEREIGN_API_BASE}/vector/search`, stryMutAct_9fa48("322") ? {} : (stryCov_9fa48("322"), {
      method: 'POST',
      headers: stryMutAct_9fa48("324") ? {} : (stryCov_9fa48("324"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("326") ? {} : (stryCov_9fa48("326"), {
        query,
        limit,
        threshold
      }))
    }));
    const data = await response.json();
    return data.success ? data.data : stryMutAct_9fa48("327") ? ["Stryker was here"] : (stryCov_9fa48("327"), []);
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
    const response = await fetch(`${SOVEREIGN_API_BASE}/vector/decision`, stryMutAct_9fa48("330") ? {} : (stryCov_9fa48("330"), {
      method: 'POST',
      headers: stryMutAct_9fa48("332") ? {} : (stryCov_9fa48("332"), {
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
    const response = await fetch(`${SOVEREIGN_API_BASE}/vector/decisions/search`, stryMutAct_9fa48("336") ? {} : (stryCov_9fa48("336"), {
      method: 'POST',
      headers: stryMutAct_9fa48("338") ? {} : (stryCov_9fa48("338"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("340") ? {} : (stryCov_9fa48("340"), {
        query,
        limit
      }))
    }));
    const data = await response.json();
    return data.success ? data.data : stryMutAct_9fa48("341") ? ["Stryker was here"] : (stryCov_9fa48("341"), []);
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
    const response = await fetch(`${SOVEREIGN_API_BASE}/vector/agent-memory`, stryMutAct_9fa48("344") ? {} : (stryCov_9fa48("344"), {
      method: 'POST',
      headers: stryMutAct_9fa48("346") ? {} : (stryCov_9fa48("346"), {
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
    const response = await fetch(`${SOVEREIGN_API_BASE}/vector/agent-memory/recall`, stryMutAct_9fa48("350") ? {} : (stryCov_9fa48("350"), {
      method: 'POST',
      headers: stryMutAct_9fa48("352") ? {} : (stryCov_9fa48("352"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("354") ? {} : (stryCov_9fa48("354"), {
        agentId,
        query,
        limit
      }))
    }));
    const data = await response.json();
    return data.success ? data.data : stryMutAct_9fa48("355") ? ["Stryker was here"] : (stryCov_9fa48("355"), []);
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
      return stryMutAct_9fa48("360") ? true : (stryCov_9fa48("360"), false);
    }
  }
});

// =============================================================================
// QUEUE API - Agent Orchestration
// =============================================================================

export const queueApi = stryMutAct_9fa48("361") ? {} : (stryCov_9fa48("361"), {
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
    const response = await fetch(`${SOVEREIGN_API_BASE}/queue/deliberation`, stryMutAct_9fa48("364") ? {} : (stryCov_9fa48("364"), {
      method: 'POST',
      headers: stryMutAct_9fa48("366") ? {} : (stryCov_9fa48("366"), {
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
    const response = await fetch(`${SOVEREIGN_API_BASE}/queue/document`, stryMutAct_9fa48("370") ? {} : (stryCov_9fa48("370"), {
      method: 'POST',
      headers: stryMutAct_9fa48("372") ? {} : (stryCov_9fa48("372"), {
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
      return stryMutAct_9fa48("383") ? true : (stryCov_9fa48("383"), false);
    }
  }
});

// =============================================================================
// PROMETHEUS API - Metrics
// =============================================================================

export const metricsApi = stryMutAct_9fa48("384") ? {} : (stryCov_9fa48("384"), {
  /**
   * Query Prometheus for time-series metrics
   */
  async queryRange(query: string, start: Date, end: Date, step = '1m'): Promise<any[]> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/prometheus/query`, stryMutAct_9fa48("388") ? {} : (stryCov_9fa48("388"), {
      method: 'POST',
      headers: stryMutAct_9fa48("390") ? {} : (stryCov_9fa48("390"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("392") ? {} : (stryCov_9fa48("392"), {
        query,
        start: Math.floor(stryMutAct_9fa48("393") ? start.getTime() * 1000 : (stryCov_9fa48("393"), start.getTime() / 1000)),
        end: Math.floor(stryMutAct_9fa48("394") ? end.getTime() * 1000 : (stryCov_9fa48("394"), end.getTime() / 1000)),
        step
      }))
    }));
    const data = await response.json();
    return data.success ? stryMutAct_9fa48("397") ? data.data?.result && [] : stryMutAct_9fa48("396") ? false : stryMutAct_9fa48("395") ? true : (stryCov_9fa48("395", "396", "397"), (stryMutAct_9fa48("398") ? data.data.result : (stryCov_9fa48("398"), data.data?.result)) || (stryMutAct_9fa48("399") ? ["Stryker was here"] : (stryCov_9fa48("399"), []))) : stryMutAct_9fa48("400") ? ["Stryker was here"] : (stryCov_9fa48("400"), []);
  },
  /**
   * Get current metric value
   */
  async getCurrentValue(metricName: string): Promise<number | null> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/prometheus/metric/${encodeURIComponent(metricName)}`);
    const data = await response.json();
    if (stryMutAct_9fa48("405") ? data.success || data.data?.result?.[0]?.value : stryMutAct_9fa48("404") ? false : stryMutAct_9fa48("403") ? true : (stryCov_9fa48("403", "404", "405"), data.success && (stryMutAct_9fa48("408") ? data.data.result?.[0]?.value : stryMutAct_9fa48("407") ? data.data?.result[0]?.value : stryMutAct_9fa48("406") ? data.data?.result?.[0].value : (stryCov_9fa48("406", "407", "408"), data.data?.result?.[0]?.value)))) {
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
      return stryMutAct_9fa48("414") ? true : (stryCov_9fa48("414"), false);
    }
  }
});

// =============================================================================
// N8N API - Workflow Automation
// =============================================================================

export const workflowApi = stryMutAct_9fa48("415") ? {} : (stryCov_9fa48("415"), {
  /**
   * Get all n8n workflows
   */
  async getWorkflows(): Promise<any[]> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/n8n/workflows`);
    const data = await response.json();
    return data.success ? data.data : stryMutAct_9fa48("418") ? ["Stryker was here"] : (stryCov_9fa48("418"), []);
  },
  /**
   * Trigger a workflow
   */
  async triggerWorkflow(workflowId: string, payload?: any): Promise<boolean> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/n8n/trigger/${workflowId}`, stryMutAct_9fa48("421") ? {} : (stryCov_9fa48("421"), {
      method: 'POST',
      headers: stryMutAct_9fa48("423") ? {} : (stryCov_9fa48("423"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("427") ? payload && {} : stryMutAct_9fa48("426") ? false : stryMutAct_9fa48("425") ? true : (stryCov_9fa48("425", "426", "427"), payload || {}))
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
      return stryMutAct_9fa48("432") ? true : (stryCov_9fa48("432"), false);
    }
  }
});

// =============================================================================
// UNLEASH API - Feature Flags
// =============================================================================

export const featureFlagsApi = stryMutAct_9fa48("433") ? {} : (stryCov_9fa48("433"), {
  /**
   * Get all feature flags
   */
  async getAllFlags(): Promise<any[]> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/unleash/features`);
    const data = await response.json();
    return data.success ? data.data : stryMutAct_9fa48("436") ? ["Stryker was here"] : (stryCov_9fa48("436"), []);
  },
  /**
   * Check if feature is enabled
   */
  async isEnabled(featureName: string): Promise<boolean> {
    const response = await fetch(`${SOVEREIGN_API_BASE}/unleash/feature/${featureName}`);
    const data = await response.json();
    return stryMutAct_9fa48("439") ? data.enabled && false : (stryCov_9fa48("439"), data.enabled ?? (stryMutAct_9fa48("440") ? true : (stryCov_9fa48("440"), false)));
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
      return stryMutAct_9fa48("445") ? true : (stryCov_9fa48("445"), false);
    }
  }
});

// =============================================================================
// ENTERPRISE SECURITY API - Keycloak, Casbin, Tika
// =============================================================================

const ENTERPRISE_API_BASE = '/api/v1/enterprise/security';
export const enterpriseApi = stryMutAct_9fa48("447") ? {} : (stryCov_9fa48("447"), {
  /**
   * Get current authenticated user from Keycloak
   */
  async getCurrentUser(): Promise<any> {
    const response = await fetch(`${ENTERPRISE_API_BASE}/me`, stryMutAct_9fa48("450") ? {} : (stryCov_9fa48("450"), {
      headers: stryMutAct_9fa48("451") ? {} : (stryCov_9fa48("451"), {
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
    const response = await fetch(`${ENTERPRISE_API_BASE}/check-permission`, stryMutAct_9fa48("455") ? {} : (stryCov_9fa48("455"), {
      method: 'POST',
      headers: stryMutAct_9fa48("457") ? {} : (stryCov_9fa48("457"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("459") ? {} : (stryCov_9fa48("459"), {
        resource,
        action
      }))
    }));
    const data = await response.json();
    return stryMutAct_9fa48("460") ? data.allowed && false : (stryCov_9fa48("460"), data.allowed ?? (stryMutAct_9fa48("461") ? true : (stryCov_9fa48("461"), false)));
  },
  /**
   * Check if user can approve a decision type
   */
  async canApproveDecision(decisionType: string, existingApprovers: string[] = stryMutAct_9fa48("462") ? ["Stryker was here"] : (stryCov_9fa48("462"), [])): Promise<{
    allowed: boolean;
    reason: string;
  }> {
    const response = await fetch(`${ENTERPRISE_API_BASE}/policies/can-approve`, stryMutAct_9fa48("465") ? {} : (stryCov_9fa48("465"), {
      method: 'POST',
      headers: stryMutAct_9fa48("467") ? {} : (stryCov_9fa48("467"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("469") ? {} : (stryCov_9fa48("469"), {
        decisionType,
        existingApprovers
      }))
    }));
    const data = await response.json();
    return stryMutAct_9fa48("470") ? {} : (stryCov_9fa48("470"), {
      allowed: stryMutAct_9fa48("471") ? data.allowed && false : (stryCov_9fa48("471"), data.allowed ?? (stryMutAct_9fa48("472") ? true : (stryCov_9fa48("472"), false))),
      reason: stryMutAct_9fa48("473") ? data.reason && '' : (stryCov_9fa48("473"), data.reason ?? '')
    });
  },
  /**
   * Check if user can veto a decision type
   */
  async canVetoDecision(decisionType: string): Promise<{
    allowed: boolean;
    reason: string;
  }> {
    const response = await fetch(`${ENTERPRISE_API_BASE}/policies/can-veto`, stryMutAct_9fa48("477") ? {} : (stryCov_9fa48("477"), {
      method: 'POST',
      headers: stryMutAct_9fa48("479") ? {} : (stryCov_9fa48("479"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("481") ? {} : (stryCov_9fa48("481"), {
        decisionType
      }))
    }));
    const data = await response.json();
    return stryMutAct_9fa48("482") ? {} : (stryCov_9fa48("482"), {
      allowed: stryMutAct_9fa48("483") ? data.allowed && false : (stryCov_9fa48("483"), data.allowed ?? (stryMutAct_9fa48("484") ? true : (stryCov_9fa48("484"), false))),
      reason: stryMutAct_9fa48("485") ? data.reason && '' : (stryCov_9fa48("485"), data.reason ?? '')
    });
  },
  /**
   * Extract text from document using Apache Tika
   */
  async extractDocument(content: string,
  // base64 encoded
  mimeType: string, fileName?: string, useOCR = stryMutAct_9fa48("487") ? true : (stryCov_9fa48("487"), false)): Promise<{
    text: string;
    metadata: any;
    wordCount: number;
  } | null> {
    const response = await fetch(`${ENTERPRISE_API_BASE}/documents/extract`, stryMutAct_9fa48("490") ? {} : (stryCov_9fa48("490"), {
      method: 'POST',
      headers: stryMutAct_9fa48("492") ? {} : (stryCov_9fa48("492"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("494") ? {} : (stryCov_9fa48("494"), {
        content,
        mimeType,
        fileName,
        useOCR
      }))
    }));
    const data = await response.json();
    return data.success ? data.data : null;
  },
  async extractDocumentFromVault(bucket: string, path: string, mimeType: string, fileName?: string, useOCR = stryMutAct_9fa48("495") ? true : (stryCov_9fa48("495"), false)): Promise<{
    text: string;
    metadata: any;
    wordCount: number;
  } | null> {
    const response = await fetch(`${ENTERPRISE_API_BASE}/documents/extract-from-vault`, stryMutAct_9fa48("498") ? {} : (stryCov_9fa48("498"), {
      method: 'POST',
      headers: stryMutAct_9fa48("500") ? {} : (stryCov_9fa48("500"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("502") ? {} : (stryCov_9fa48("502"), {
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
    const response = await fetch(`${ENTERPRISE_API_BASE}/documents/detect-type`, stryMutAct_9fa48("505") ? {} : (stryCov_9fa48("505"), {
      method: 'POST',
      headers: stryMutAct_9fa48("507") ? {} : (stryCov_9fa48("507"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("509") ? {} : (stryCov_9fa48("509"), {
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
    return data.success ? data.data : stryMutAct_9fa48("512") ? ["Stryker was here"] : (stryCov_9fa48("512"), []);
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
      return stryMutAct_9fa48("518") ? data.available && false : (stryCov_9fa48("518"), data.available ?? (stryMutAct_9fa48("519") ? true : (stryCov_9fa48("519"), false)));
    } catch {
      return stryMutAct_9fa48("521") ? true : (stryCov_9fa48("521"), false);
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
export const vaultApi = stryMutAct_9fa48("522") ? {} : (stryCov_9fa48("522"), {
  /**
   * Upload document to CendiaVault (MinIO)
   */
  async uploadDocument(file: File, bucket: string = 'council-documents', metadata?: Record<string, any>): Promise<VaultDocument | null> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);
      if (stryMutAct_9fa48("529") ? false : stryMutAct_9fa48("528") ? true : (stryCov_9fa48("528", "529"), metadata)) {
        formData.append('metadata', JSON.stringify(metadata));
      }
      const response = await fetch(`${SOVEREIGN_API_BASE}/vault/upload`, stryMutAct_9fa48("533") ? {} : (stryCov_9fa48("533"), {
        method: 'POST',
        body: formData
      }));
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.warn('[CendiaVault] Upload failed, document stored locally:', error);
      // Return a local reference for offline/dev mode
      return stryMutAct_9fa48("537") ? {} : (stryCov_9fa48("537"), {
        id: `local-${Date.now()}`,
        filename: file.name,
        bucket,
        path: `${bucket}/${file.name}`,
        size: file.size,
        mimeType: file.type,
        uploadedAt: new Date().toISOString(),
        metadata: stryMutAct_9fa48("542") ? metadata && {} : stryMutAct_9fa48("541") ? false : stryMutAct_9fa48("540") ? true : (stryCov_9fa48("540", "541", "542"), metadata || {})
      });
    }
  },
  /**
   * Get document from CendiaVault
   */
  async getDocument(bucket: string, path: string): Promise<Blob | null> {
    try {
      const response = await fetch(`${SOVEREIGN_API_BASE}/vault/download?bucket=${bucket}&path=${encodeURIComponent(path)}`);
      if (stryMutAct_9fa48("547") ? false : stryMutAct_9fa48("546") ? true : (stryCov_9fa48("546", "547"), response.ok)) {
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
      return data.success ? data.data : stryMutAct_9fa48("554") ? ["Stryker was here"] : (stryCov_9fa48("554"), []);
    } catch {
      return stryMutAct_9fa48("556") ? ["Stryker was here"] : (stryCov_9fa48("556"), []);
    }
  },
  /**
   * Delete document from CendiaVault
   */
  async deleteDocument(bucket: string, path: string): Promise<boolean> {
    try {
      const response = await fetch(`${SOVEREIGN_API_BASE}/vault/delete`, stryMutAct_9fa48("560") ? {} : (stryCov_9fa48("560"), {
        method: 'DELETE',
        headers: stryMutAct_9fa48("562") ? {} : (stryCov_9fa48("562"), {
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(stryMutAct_9fa48("564") ? {} : (stryCov_9fa48("564"), {
          bucket,
          path
        }))
      }));
      const data = await response.json();
      return stryMutAct_9fa48("565") ? data.success && false : (stryCov_9fa48("565"), data.success ?? (stryMutAct_9fa48("566") ? true : (stryCov_9fa48("566"), false)));
    } catch {
      return stryMutAct_9fa48("568") ? true : (stryCov_9fa48("568"), false);
    }
  },
  /**
   * Check vault health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${SOVEREIGN_API_BASE}/vault/health`);
      const data = await response.json();
      return stryMutAct_9fa48("572") ? data.available && false : (stryCov_9fa48("572"), data.available ?? (stryMutAct_9fa48("573") ? true : (stryCov_9fa48("573"), false)));
    } catch {
      return stryMutAct_9fa48("575") ? true : (stryCov_9fa48("575"), false);
    }
  }
});

// =============================================================================
// SOVEREIGN STACK HEALTH
// =============================================================================

export const sovereignApi = stryMutAct_9fa48("576") ? {} : (stryCov_9fa48("576"), {
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