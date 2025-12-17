// @ts-nocheck
// =============================================================================
// DATACENDIA PLATFORM - PILLARS API CLIENT
// Frontend API service for the 8 Foundational Data Layers
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
const API_BASE = '/api/v1/pillars';

// =============================================================================
// HELM API
// =============================================================================

export const helmApi = stryMutAct_9fa48("14116") ? {} : (stryCov_9fa48("14116"), {
  getDashboard: async (organizationId: string = 'demo') => {
    const res = await fetch(`${API_BASE}/helm/dashboard?organizationId=${organizationId}`);
    return res.json();
  },
  getMetrics: async (organizationId: string = 'demo', category?: string) => {
    const url = category ? `${API_BASE}/helm/metrics?organizationId=${organizationId}&category=${category}` : `${API_BASE}/helm/metrics?organizationId=${organizationId}`;
    const res = await fetch(url);
    return res.json();
  },
  getMetricHistory: async (metricId: string, days: number = 30) => {
    const res = await fetch(`${API_BASE}/helm/metrics/${metricId}/history?days=${days}`);
    return res.json();
  },
  updateMetric: async (metricId: string, value: number) => {
    const res = await fetch(`${API_BASE}/helm/metrics/${metricId}`, stryMutAct_9fa48("14128") ? {} : (stryCov_9fa48("14128"), {
      method: 'PATCH',
      headers: stryMutAct_9fa48("14130") ? {} : (stryCov_9fa48("14130"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("14132") ? {} : (stryCov_9fa48("14132"), {
        value
      }))
    }));
    return res.json();
  },
  getAlerts: async (organizationId: string = 'demo') => {
    const res = await fetch(`${API_BASE}/helm/alerts?organizationId=${organizationId}`);
    return res.json();
  },
  acknowledgeAlert: async (alertId: string) => {
    const res = await fetch(`${API_BASE}/helm/alerts/${alertId}/acknowledge`, stryMutAct_9fa48("14138") ? {} : (stryCov_9fa48("14138"), {
      method: 'POST'
    }));
    return res.json();
  }
});

// =============================================================================
// LINEAGE API
// =============================================================================

export const lineageApi = stryMutAct_9fa48("14140") ? {} : (stryCov_9fa48("14140"), {
  getGraph: async (organizationId: string = 'demo') => {
    const res = await fetch(`${API_BASE}/lineage/graph?organizationId=${organizationId}`);
    return res.json();
  },
  getEntities: async (organizationId: string = 'demo', type?: string) => {
    const url = type ? `${API_BASE}/lineage/entities?organizationId=${organizationId}&type=${type}` : `${API_BASE}/lineage/entities?organizationId=${organizationId}`;
    const res = await fetch(url);
    return res.json();
  },
  traceLineage: async (entityId: string, direction: 'upstream' | 'downstream' | 'both' = 'both') => {
    const res = await fetch(`${API_BASE}/lineage/entities/${entityId}/trace?direction=${direction}`);
    return res.json();
  },
  getQualityOverview: async (organizationId: string = 'demo') => {
    const res = await fetch(`${API_BASE}/lineage/quality?organizationId=${organizationId}`);
    return res.json();
  },
  checkQuality: async (entityId: string) => {
    const res = await fetch(`${API_BASE}/lineage/entities/${entityId}/quality-check`, stryMutAct_9fa48("14156") ? {} : (stryCov_9fa48("14156"), {
      method: 'POST'
    }));
    return res.json();
  }
});

// =============================================================================
// PREDICT API
// =============================================================================

export const predictApi = stryMutAct_9fa48("14158") ? {} : (stryCov_9fa48("14158"), {
  getModels: async (organizationId: string = 'demo') => {
    const res = await fetch(`${API_BASE}/predict/models?organizationId=${organizationId}`);
    return res.json();
  },
  getModel: async (modelId: string) => {
    const res = await fetch(`${API_BASE}/predict/models/${modelId}`);
    return res.json();
  },
  getFeatureImportance: async (modelId: string) => {
    const res = await fetch(`${API_BASE}/predict/models/${modelId}/features`);
    return res.json();
  },
  predict: async (modelId: string, input: Record<string, unknown>) => {
    const res = await fetch(`${API_BASE}/predict/models/${modelId}/predict`, stryMutAct_9fa48("14168") ? {} : (stryCov_9fa48("14168"), {
      method: 'POST',
      headers: stryMutAct_9fa48("14170") ? {} : (stryCov_9fa48("14170"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("14172") ? {} : (stryCov_9fa48("14172"), {
        input
      }))
    }));
    return res.json();
  },
  trainModel: async (modelId: string) => {
    const res = await fetch(`${API_BASE}/predict/models/${modelId}/train`, stryMutAct_9fa48("14175") ? {} : (stryCov_9fa48("14175"), {
      method: 'POST'
    }));
    return res.json();
  },
  getForecasts: async (organizationId: string = 'demo') => {
    const res = await fetch(`${API_BASE}/predict/forecasts?organizationId=${organizationId}`);
    return res.json();
  },
  getInsights: async (organizationId: string = 'demo') => {
    const res = await fetch(`${API_BASE}/predict/insights?organizationId=${organizationId}`);
    return res.json();
  }
});

// =============================================================================
// FLOW API
// =============================================================================

export const flowApi = stryMutAct_9fa48("14183") ? {} : (stryCov_9fa48("14183"), {
  getStats: async (organizationId: string = 'demo') => {
    const res = await fetch(`${API_BASE}/flow/stats?organizationId=${organizationId}`);
    return res.json();
  },
  getWorkflows: async (organizationId: string = 'demo', status?: string) => {
    const url = status ? `${API_BASE}/flow/workflows?organizationId=${organizationId}&status=${status}` : `${API_BASE}/flow/workflows?organizationId=${organizationId}`;
    const res = await fetch(url);
    return res.json();
  },
  getWorkflow: async (workflowId: string) => {
    const res = await fetch(`${API_BASE}/flow/workflows/${workflowId}`);
    return res.json();
  },
  executeWorkflow: async (workflowId: string, triggeredBy: string = 'user', input?: Record<string, unknown>) => {
    const res = await fetch(`${API_BASE}/flow/workflows/${workflowId}/execute`, stryMutAct_9fa48("14196") ? {} : (stryCov_9fa48("14196"), {
      method: 'POST',
      headers: stryMutAct_9fa48("14198") ? {} : (stryCov_9fa48("14198"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("14200") ? {} : (stryCov_9fa48("14200"), {
        triggeredBy,
        input
      }))
    }));
    return res.json();
  },
  getExecutions: async (organizationId: string = 'demo', limit: number = 50) => {
    const res = await fetch(`${API_BASE}/flow/executions?organizationId=${organizationId}&limit=${limit}`);
    return res.json();
  },
  getApprovals: async (organizationId: string = 'demo') => {
    const res = await fetch(`${API_BASE}/flow/approvals?organizationId=${organizationId}`);
    return res.json();
  },
  processApproval: async (approvalId: string, approved: boolean, decidedBy: string, reason?: string) => {
    const res = await fetch(`${API_BASE}/flow/approvals/${approvalId}`, stryMutAct_9fa48("14209") ? {} : (stryCov_9fa48("14209"), {
      method: 'POST',
      headers: stryMutAct_9fa48("14211") ? {} : (stryCov_9fa48("14211"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("14213") ? {} : (stryCov_9fa48("14213"), {
        approved,
        decidedBy,
        reason
      }))
    }));
    return res.json();
  }
});

// =============================================================================
// HEALTH API
// =============================================================================

export const healthPillarApi = stryMutAct_9fa48("14214") ? {} : (stryCov_9fa48("14214"), {
  getStatus: async (organizationId: string = 'demo') => {
    const res = await fetch(`${API_BASE}/health/status?organizationId=${organizationId}`);
    return res.json();
  },
  getAlerts: async (organizationId: string = 'demo', includeResolved: boolean = stryMutAct_9fa48("14219") ? true : (stryCov_9fa48("14219"), false)) => {
    const res = await fetch(`${API_BASE}/health/alerts?organizationId=${organizationId}&includeResolved=${includeResolved}`);
    return res.json();
  },
  acknowledgeAlert: async (alertId: string) => {
    const res = await fetch(`${API_BASE}/health/alerts/${alertId}/acknowledge`, stryMutAct_9fa48("14224") ? {} : (stryCov_9fa48("14224"), {
      method: 'POST'
    }));
    return res.json();
  },
  resolveAlert: async (alertId: string) => {
    const res = await fetch(`${API_BASE}/health/alerts/${alertId}/resolve`, stryMutAct_9fa48("14228") ? {} : (stryCov_9fa48("14228"), {
      method: 'POST'
    }));
    return res.json();
  },
  getTrends: async (organizationId: string = 'demo', hours: number = 24) => {
    const res = await fetch(`${API_BASE}/health/trends?organizationId=${organizationId}&hours=${hours}`);
    return res.json();
  }
});

// =============================================================================
// GUARD API
// =============================================================================

export const guardApi = stryMutAct_9fa48("14233") ? {} : (stryCov_9fa48("14233"), {
  getPosture: async (organizationId: string = 'demo') => {
    const res = await fetch(`${API_BASE}/guard/posture?organizationId=${organizationId}`);
    return res.json();
  },
  getThreats: async (organizationId: string = 'demo', includeResolved: boolean = stryMutAct_9fa48("14238") ? true : (stryCov_9fa48("14238"), false)) => {
    const res = await fetch(`${API_BASE}/guard/threats?organizationId=${organizationId}&includeResolved=${includeResolved}`);
    return res.json();
  },
  updateThreatStatus: async (threatId: string, status: string) => {
    const res = await fetch(`${API_BASE}/guard/threats/${threatId}`, stryMutAct_9fa48("14243") ? {} : (stryCov_9fa48("14243"), {
      method: 'PATCH',
      headers: stryMutAct_9fa48("14245") ? {} : (stryCov_9fa48("14245"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("14247") ? {} : (stryCov_9fa48("14247"), {
        status
      }))
    }));
    return res.json();
  },
  getPolicies: async (organizationId: string = 'demo') => {
    const res = await fetch(`${API_BASE}/guard/policies?organizationId=${organizationId}`);
    return res.json();
  },
  togglePolicy: async (policyId: string, enabled: boolean) => {
    const res = await fetch(`${API_BASE}/guard/policies/${policyId}`, stryMutAct_9fa48("14253") ? {} : (stryCov_9fa48("14253"), {
      method: 'PATCH',
      headers: stryMutAct_9fa48("14255") ? {} : (stryCov_9fa48("14255"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("14257") ? {} : (stryCov_9fa48("14257"), {
        enabled
      }))
    }));
    return res.json();
  },
  getAuditLogs: async (organizationId: string = 'demo', limit: number = 100) => {
    const res = await fetch(`${API_BASE}/guard/audit?organizationId=${organizationId}&limit=${limit}`);
    return res.json();
  }
});

// =============================================================================
// ETHICS API
// =============================================================================

export const ethicsApi = stryMutAct_9fa48("14261") ? {} : (stryCov_9fa48("14261"), {
  getStats: async (organizationId: string = 'demo') => {
    const res = await fetch(`${API_BASE}/ethics/stats?organizationId=${organizationId}`);
    return res.json();
  },
  getPrinciples: async (organizationId: string = 'demo', status?: string) => {
    const url = status ? `${API_BASE}/ethics/principles?organizationId=${organizationId}&status=${status}` : `${API_BASE}/ethics/principles?organizationId=${organizationId}`;
    const res = await fetch(url);
    return res.json();
  },
  getReviews: async (organizationId: string = 'demo', result?: string) => {
    const url = result ? `${API_BASE}/ethics/reviews?organizationId=${organizationId}&result=${result}` : `${API_BASE}/ethics/reviews?organizationId=${organizationId}`;
    const res = await fetch(url);
    return res.json();
  },
  requestReview: async (data: Record<string, unknown>) => {
    const res = await fetch(`${API_BASE}/ethics/reviews`, stryMutAct_9fa48("14275") ? {} : (stryCov_9fa48("14275"), {
      method: 'POST',
      headers: stryMutAct_9fa48("14277") ? {} : (stryCov_9fa48("14277"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(data)
    }));
    return res.json();
  },
  submitReviewDecision: async (reviewId: string, result: string, notes?: string, violations?: string[]) => {
    const res = await fetch(`${API_BASE}/ethics/reviews/${reviewId}/decide`, stryMutAct_9fa48("14281") ? {} : (stryCov_9fa48("14281"), {
      method: 'POST',
      headers: stryMutAct_9fa48("14283") ? {} : (stryCov_9fa48("14283"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("14285") ? {} : (stryCov_9fa48("14285"), {
        result,
        notes,
        violations
      }))
    }));
    return res.json();
  },
  getBiasChecks: async (organizationId: string = 'demo') => {
    const res = await fetch(`${API_BASE}/ethics/bias-checks?organizationId=${organizationId}`);
    return res.json();
  },
  performBiasCheck: async (organizationId: string = 'demo', modelId: string, modelName: string) => {
    const res = await fetch(`${API_BASE}/ethics/bias-check`, stryMutAct_9fa48("14292") ? {} : (stryCov_9fa48("14292"), {
      method: 'POST',
      headers: stryMutAct_9fa48("14294") ? {} : (stryCov_9fa48("14294"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("14296") ? {} : (stryCov_9fa48("14296"), {
        organizationId,
        modelId,
        modelName
      }))
    }));
    return res.json();
  }
});

// =============================================================================
// AGENTS API
// =============================================================================

export const agentsApi = stryMutAct_9fa48("14297") ? {} : (stryCov_9fa48("14297"), {
  getStats: async (organizationId: string = 'demo') => {
    const res = await fetch(`${API_BASE}/agents/stats?organizationId=${organizationId}`);
    return res.json();
  },
  getAgents: async (organizationId: string = 'demo') => {
    const res = await fetch(`${API_BASE}/agents?organizationId=${organizationId}`);
    return res.json();
  },
  getAgent: async (agentId: string) => {
    const res = await fetch(`${API_BASE}/agents/${agentId}`);
    return res.json();
  },
  updateAgentStatus: async (agentId: string, status: string) => {
    const res = await fetch(`${API_BASE}/agents/${agentId}/status`, stryMutAct_9fa48("14308") ? {} : (stryCov_9fa48("14308"), {
      method: 'PATCH',
      headers: stryMutAct_9fa48("14310") ? {} : (stryCov_9fa48("14310"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("14312") ? {} : (stryCov_9fa48("14312"), {
        status
      }))
    }));
    return res.json();
  },
  updateAgentConfig: async (agentId: string, config: Record<string, unknown>) => {
    const res = await fetch(`${API_BASE}/agents/${agentId}/config`, stryMutAct_9fa48("14315") ? {} : (stryCov_9fa48("14315"), {
      method: 'PATCH',
      headers: stryMutAct_9fa48("14317") ? {} : (stryCov_9fa48("14317"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(config)
    }));
    return res.json();
  },
  getInteractions: async (agentId: string, limit: number = 50) => {
    const res = await fetch(`${API_BASE}/agents/${agentId}/interactions?limit=${limit}`);
    return res.json();
  },
  recordInteraction: async (agentId: string, data: Record<string, unknown>) => {
    const res = await fetch(`${API_BASE}/agents/${agentId}/interactions`, stryMutAct_9fa48("14323") ? {} : (stryCov_9fa48("14323"), {
      method: 'POST',
      headers: stryMutAct_9fa48("14325") ? {} : (stryCov_9fa48("14325"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(data)
    }));
    return res.json();
  },
  rateInteraction: async (interactionId: string, rating: number, feedback?: string) => {
    const res = await fetch(`${API_BASE}/agents/interactions/${interactionId}/rate`, stryMutAct_9fa48("14329") ? {} : (stryCov_9fa48("14329"), {
      method: 'POST',
      headers: stryMutAct_9fa48("14331") ? {} : (stryCov_9fa48("14331"), {
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(stryMutAct_9fa48("14333") ? {} : (stryCov_9fa48("14333"), {
        rating,
        feedback
      }))
    }));
    return res.json();
  }
});

// =============================================================================
// INITIALIZE PILLARS
// =============================================================================

export const initializePillars = async (organizationId: string = 'demo') => {
  const res = await fetch(`${API_BASE}/initialize`, stryMutAct_9fa48("14337") ? {} : (stryCov_9fa48("14337"), {
    method: 'POST',
    headers: stryMutAct_9fa48("14339") ? {} : (stryCov_9fa48("14339"), {
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(stryMutAct_9fa48("14341") ? {} : (stryCov_9fa48("14341"), {
      organizationId
    }))
  }));
  return res.json();
};

// Export all as pillarsApi
export const pillarsApi = stryMutAct_9fa48("14342") ? {} : (stryCov_9fa48("14342"), {
  helm: helmApi,
  lineage: lineageApi,
  predict: predictApi,
  flow: flowApi,
  health: healthPillarApi,
  guard: guardApi,
  ethics: ethicsApi,
  agents: agentsApi,
  initialize: initializePillars
});
export default pillarsApi;