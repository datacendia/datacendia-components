// @ts-nocheck
// =============================================================================
// CENDIA AUTOPILOT™ - SELF-DRIVING ENTERPRISE MODE
// The System Proposes Decisions Automatically, Humans Approve
// "AI-Run Enterprise Territory"
// 
// CAPABILITIES:
// - Autonomous decision recommendation engine
// - Human-in-the-loop approval workflows
// - Real-time business condition monitoring
// - Automatic budget adjustments
// - Resource reallocation suggestions
// - Predictive intervention system
// - Escalation-only human involvement
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
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { enterpriseService, AutoDecision, AutomationRule, SystemHealth, DecisionCategory } from '../../../services/EnterpriseService';
import { ollamaService } from '../../../lib/ollama';
import api from '../../../lib/api';

// Types imported from EnterpriseService

// =============================================================================
// MOCK DATA
// =============================================================================

const CATEGORY_CONFIG: Record<DecisionCategory, {
  icon: string;
  color: string;
  name: string;
}> = stryMutAct_9fa48("26981") ? {} : (stryCov_9fa48("26981"), {
  financial: stryMutAct_9fa48("26982") ? {} : (stryCov_9fa48("26982"), {
    icon: '💰',
    color: 'from-green-600 to-emerald-600',
    name: 'Financial'
  }),
  operational: stryMutAct_9fa48("26986") ? {} : (stryCov_9fa48("26986"), {
    icon: '⚙️',
    color: 'from-blue-600 to-cyan-600',
    name: 'Operations'
  }),
  hr: stryMutAct_9fa48("26990") ? {} : (stryCov_9fa48("26990"), {
    icon: '👥',
    color: 'from-purple-600 to-pink-600',
    name: 'Human Resources'
  }),
  sales: stryMutAct_9fa48("26994") ? {} : (stryCov_9fa48("26994"), {
    icon: '📈',
    color: 'from-amber-600 to-orange-600',
    name: 'Sales & Revenue'
  }),
  technology: stryMutAct_9fa48("26998") ? {} : (stryCov_9fa48("26998"), {
    icon: '💻',
    color: 'from-indigo-600 to-violet-600',
    name: 'Technology'
  }),
  risk: stryMutAct_9fa48("27002") ? {} : (stryCov_9fa48("27002"), {
    icon: '⚠️',
    color: 'from-red-600 to-rose-600',
    name: 'Risk Management'
  }),
  compliance: stryMutAct_9fa48("27006") ? {} : (stryCov_9fa48("27006"), {
    icon: '⚖️',
    color: 'from-teal-600 to-cyan-600',
    name: 'Compliance'
  })
});
const generateDecisions = stryMutAct_9fa48("27010") ? () => undefined : (stryCov_9fa48("27010"), (() => {
  const generateDecisions = (): AutoDecision[] => stryMutAct_9fa48("27011") ? [] : (stryCov_9fa48("27011"), [stryMutAct_9fa48("27012") ? {} : (stryCov_9fa48("27012"), {
    id: 'dec-001',
    title: 'Q4 Budget Reallocation',
    description: 'Revenue is trending 3.2% below forecast. Recommend adjusting Q4 budgets by 2% across non-critical teams to maintain margin targets.',
    category: 'financial',
    priority: 'high',
    status: 'pending',
    automationLevel: 'approval-required',
    trigger: stryMutAct_9fa48("27020") ? {} : (stryCov_9fa48("27020"), {
      condition: 'Revenue below forecast threshold',
      metric: 'quarterly_revenue',
      threshold: stryMutAct_9fa48("27023") ? +3 : (stryCov_9fa48("27023"), -3),
      currentValue: stryMutAct_9fa48("27024") ? +3.2 : (stryCov_9fa48("27024"), -3.2)
    }),
    recommendation: 'Reduce discretionary spending by 2% ($450K) across Marketing, R&D, and G&A to protect EBITDA margin',
    impact: stryMutAct_9fa48("27026") ? [] : (stryCov_9fa48("27026"), [stryMutAct_9fa48("27027") ? {} : (stryCov_9fa48("27027"), {
      metric: 'EBITDA Margin',
      projectedChange: 0.8,
      unit: '%',
      confidence: 92
    }), stryMutAct_9fa48("27030") ? {} : (stryCov_9fa48("27030"), {
      metric: 'Cash Runway',
      projectedChange: 2.1,
      unit: 'months',
      confidence: 88
    }), stryMutAct_9fa48("27033") ? {} : (stryCov_9fa48("27033"), {
      metric: 'Team Morale',
      projectedChange: stryMutAct_9fa48("27035") ? +5 : (stryCov_9fa48("27035"), -5),
      unit: '%',
      confidence: 65
    })]),
    risks: stryMutAct_9fa48("27037") ? [] : (stryCov_9fa48("27037"), [stryMutAct_9fa48("27038") ? {} : (stryCov_9fa48("27038"), {
      description: 'Delayed product launches',
      probability: 25,
      mitigation: 'Prioritize critical path items'
    }), stryMutAct_9fa48("27041") ? {} : (stryCov_9fa48("27041"), {
      description: 'Reduced marketing reach',
      probability: 40,
      mitigation: 'Focus on high-ROI channels'
    })]),
    alternatives: stryMutAct_9fa48("27044") ? [] : (stryCov_9fa48("27044"), [stryMutAct_9fa48("27045") ? {} : (stryCov_9fa48("27045"), {
      description: 'Accelerate collections on A/R',
      impact: 'Recover $200K within 30 days'
    }), stryMutAct_9fa48("27048") ? {} : (stryCov_9fa48("27048"), {
      description: 'Defer Q4 hiring',
      impact: 'Save $180K, delay 3 hires'
    })]),
    aiReasoning: 'Historical analysis shows similar revenue shortfalls in 2022 and 2023 were addressed with 2-3% budget cuts, resulting in successful margin protection without significant operational impact. Current market conditions suggest conservative approach is prudent.',
    supportingData: stryMutAct_9fa48("27052") ? [] : (stryCov_9fa48("27052"), [stryMutAct_9fa48("27053") ? {} : (stryCov_9fa48("27053"), {
      source: 'SAP',
      value: 'YTD Revenue: $38.2M (vs $39.4M plan)'
    }), stryMutAct_9fa48("27056") ? {} : (stryCov_9fa48("27056"), {
      source: 'Workday',
      value: 'Headcount: 156 (vs 160 plan)'
    }), stryMutAct_9fa48("27059") ? {} : (stryCov_9fa48("27059"), {
      source: 'Salesforce',
      value: 'Pipeline: $45M (vs $52M plan)'
    })]),
    createdAt: new Date(stryMutAct_9fa48("27062") ? Date.now() + 2 * 60 * 60 * 1000 : (stryCov_9fa48("27062"), Date.now() - (stryMutAct_9fa48("27063") ? 2 * 60 * 60 / 1000 : (stryCov_9fa48("27063"), (stryMutAct_9fa48("27064") ? 2 * 60 / 60 : (stryCov_9fa48("27064"), (stryMutAct_9fa48("27065") ? 2 / 60 : (stryCov_9fa48("27065"), 2 * 60)) * 60)) * 1000)))),
    expiresAt: new Date(stryMutAct_9fa48("27066") ? Date.now() - 24 * 60 * 60 * 1000 : (stryCov_9fa48("27066"), Date.now() + (stryMutAct_9fa48("27067") ? 24 * 60 * 60 / 1000 : (stryCov_9fa48("27067"), (stryMutAct_9fa48("27068") ? 24 * 60 / 60 : (stryCov_9fa48("27068"), (stryMutAct_9fa48("27069") ? 24 / 60 : (stryCov_9fa48("27069"), 24 * 60)) * 60)) * 1000))))
  }), stryMutAct_9fa48("27070") ? {} : (stryCov_9fa48("27070"), {
    id: 'dec-002',
    title: 'Cloud Cost Optimization',
    description: 'Cloud infrastructure costs have increased 18% MoM. Analysis indicates 8% of workloads can be moved back on-premises for 34% cost reduction.',
    category: 'technology',
    priority: 'medium',
    status: 'pending',
    automationLevel: 'approval-required',
    trigger: stryMutAct_9fa48("27078") ? {} : (stryCov_9fa48("27078"), {
      condition: 'Cloud costs exceed threshold',
      metric: 'monthly_cloud_spend',
      threshold: 15,
      currentValue: 18
    }),
    recommendation: 'Migrate 8% of non-critical workloads to on-premises infrastructure',
    impact: stryMutAct_9fa48("27082") ? [] : (stryCov_9fa48("27082"), [stryMutAct_9fa48("27083") ? {} : (stryCov_9fa48("27083"), {
      metric: 'Monthly Cloud Spend',
      projectedChange: stryMutAct_9fa48("27085") ? +34 : (stryCov_9fa48("27085"), -34),
      unit: '%',
      confidence: 85
    }), stryMutAct_9fa48("27087") ? {} : (stryCov_9fa48("27087"), {
      metric: 'Annual Savings',
      projectedChange: 180,
      unit: 'K USD',
      confidence: 85
    }), stryMutAct_9fa48("27090") ? {} : (stryCov_9fa48("27090"), {
      metric: 'Latency',
      projectedChange: 5,
      unit: 'ms',
      confidence: 70
    })]),
    risks: stryMutAct_9fa48("27093") ? [] : (stryCov_9fa48("27093"), [stryMutAct_9fa48("27094") ? {} : (stryCov_9fa48("27094"), {
      description: 'Migration complexity',
      probability: 30,
      mitigation: 'Phased migration over 6 weeks'
    }), stryMutAct_9fa48("27097") ? {} : (stryCov_9fa48("27097"), {
      description: 'Capacity constraints',
      probability: 20,
      mitigation: 'Pre-provision on-prem capacity'
    })]),
    alternatives: stryMutAct_9fa48("27100") ? [] : (stryCov_9fa48("27100"), [stryMutAct_9fa48("27101") ? {} : (stryCov_9fa48("27101"), {
      description: 'Reserved instance commitments',
      impact: 'Save 25% on compute'
    }), stryMutAct_9fa48("27104") ? {} : (stryCov_9fa48("27104"), {
      description: 'Rightsizing instances',
      impact: 'Save 15% through optimization'
    })]),
    aiReasoning: 'Workload analysis shows batch processing and dev/test environments are ideal candidates for on-prem migration. These workloads have consistent, predictable resource requirements and don\'t benefit from cloud elasticity.',
    supportingData: stryMutAct_9fa48("27108") ? [] : (stryCov_9fa48("27108"), [stryMutAct_9fa48("27109") ? {} : (stryCov_9fa48("27109"), {
      source: 'AWS Cost Explorer',
      value: 'Monthly spend: $245K (+18% MoM)'
    }), stryMutAct_9fa48("27112") ? {} : (stryCov_9fa48("27112"), {
      source: 'Datadog',
      value: 'Avg utilization: 42%'
    }), stryMutAct_9fa48("27115") ? {} : (stryCov_9fa48("27115"), {
      source: 'Internal',
      value: 'On-prem capacity available: 340 cores'
    })]),
    createdAt: new Date(stryMutAct_9fa48("27118") ? Date.now() + 8 * 60 * 60 * 1000 : (stryCov_9fa48("27118"), Date.now() - (stryMutAct_9fa48("27119") ? 8 * 60 * 60 / 1000 : (stryCov_9fa48("27119"), (stryMutAct_9fa48("27120") ? 8 * 60 / 60 : (stryCov_9fa48("27120"), (stryMutAct_9fa48("27121") ? 8 / 60 : (stryCov_9fa48("27121"), 8 * 60)) * 60)) * 1000)))),
    expiresAt: new Date(stryMutAct_9fa48("27122") ? Date.now() - 72 * 60 * 60 * 1000 : (stryCov_9fa48("27122"), Date.now() + (stryMutAct_9fa48("27123") ? 72 * 60 * 60 / 1000 : (stryCov_9fa48("27123"), (stryMutAct_9fa48("27124") ? 72 * 60 / 60 : (stryCov_9fa48("27124"), (stryMutAct_9fa48("27125") ? 72 / 60 : (stryCov_9fa48("27125"), 72 * 60)) * 60)) * 1000))))
  }), stryMutAct_9fa48("27126") ? {} : (stryCov_9fa48("27126"), {
    id: 'dec-003',
    title: 'Sales Team Retraining Initiative',
    description: 'Sales conversion rate has dropped 12% this quarter. Data suggests skill gaps in enterprise selling. Recommend targeted training program.',
    category: 'sales',
    priority: 'high',
    status: 'auto-executed',
    automationLevel: 'full-auto',
    trigger: stryMutAct_9fa48("27134") ? {} : (stryCov_9fa48("27134"), {
      condition: 'Conversion rate below threshold',
      metric: 'sales_conversion_rate',
      threshold: stryMutAct_9fa48("27137") ? +10 : (stryCov_9fa48("27137"), -10),
      currentValue: stryMutAct_9fa48("27138") ? +12 : (stryCov_9fa48("27138"), -12)
    }),
    recommendation: 'Enroll underperforming reps in Enterprise Sales Accelerator program',
    impact: stryMutAct_9fa48("27140") ? [] : (stryCov_9fa48("27140"), [stryMutAct_9fa48("27141") ? {} : (stryCov_9fa48("27141"), {
      metric: 'Conversion Rate',
      projectedChange: 8,
      unit: '%',
      confidence: 78
    }), stryMutAct_9fa48("27144") ? {} : (stryCov_9fa48("27144"), {
      metric: 'Average Deal Size',
      projectedChange: 15,
      unit: '%',
      confidence: 72
    }), stryMutAct_9fa48("27147") ? {} : (stryCov_9fa48("27147"), {
      metric: 'Quota Attainment',
      projectedChange: 12,
      unit: '%',
      confidence: 75
    })]),
    risks: stryMutAct_9fa48("27150") ? [] : (stryCov_9fa48("27150"), [stryMutAct_9fa48("27151") ? {} : (stryCov_9fa48("27151"), {
      description: 'Rep availability during training',
      probability: 60,
      mitigation: 'Schedule during low-activity periods'
    })]),
    alternatives: stryMutAct_9fa48("27154") ? [] : (stryCov_9fa48("27154"), [stryMutAct_9fa48("27155") ? {} : (stryCov_9fa48("27155"), {
      description: 'External sales coaching',
      impact: 'Higher cost, faster results'
    })]),
    aiReasoning: 'Pattern recognition identified that reps who completed this training in 2023 showed 23% improvement in enterprise deal closure. Current cohort matches the profile of successful candidates.',
    supportingData: stryMutAct_9fa48("27159") ? [] : (stryCov_9fa48("27159"), [stryMutAct_9fa48("27160") ? {} : (stryCov_9fa48("27160"), {
      source: 'Salesforce',
      value: 'Conversion: 18% (vs 20.5% benchmark)'
    }), stryMutAct_9fa48("27163") ? {} : (stryCov_9fa48("27163"), {
      source: 'Gong',
      value: 'Talk ratio: 68% (ideal: 45%)'
    }), stryMutAct_9fa48("27166") ? {} : (stryCov_9fa48("27166"), {
      source: 'LMS',
      value: '8 reps below certification threshold'
    })]),
    createdAt: new Date(stryMutAct_9fa48("27169") ? Date.now() + 24 * 60 * 60 * 1000 : (stryCov_9fa48("27169"), Date.now() - (stryMutAct_9fa48("27170") ? 24 * 60 * 60 / 1000 : (stryCov_9fa48("27170"), (stryMutAct_9fa48("27171") ? 24 * 60 / 60 : (stryCov_9fa48("27171"), (stryMutAct_9fa48("27172") ? 24 / 60 : (stryCov_9fa48("27172"), 24 * 60)) * 60)) * 1000)))),
    expiresAt: new Date(stryMutAct_9fa48("27173") ? Date.now() - 48 * 60 * 60 * 1000 : (stryCov_9fa48("27173"), Date.now() + (stryMutAct_9fa48("27174") ? 48 * 60 * 60 / 1000 : (stryCov_9fa48("27174"), (stryMutAct_9fa48("27175") ? 48 * 60 / 60 : (stryCov_9fa48("27175"), (stryMutAct_9fa48("27176") ? 48 / 60 : (stryCov_9fa48("27176"), 48 * 60)) * 60)) * 1000)))),
    executedAt: new Date(stryMutAct_9fa48("27177") ? Date.now() + 12 * 60 * 60 * 1000 : (stryCov_9fa48("27177"), Date.now() - (stryMutAct_9fa48("27178") ? 12 * 60 * 60 / 1000 : (stryCov_9fa48("27178"), (stryMutAct_9fa48("27179") ? 12 * 60 / 60 : (stryCov_9fa48("27179"), (stryMutAct_9fa48("27180") ? 12 / 60 : (stryCov_9fa48("27180"), 12 * 60)) * 60)) * 1000))))
  }), stryMutAct_9fa48("27181") ? {} : (stryCov_9fa48("27181"), {
    id: 'dec-004',
    title: 'Retention Risk Intervention',
    description: 'AI detected 4 high-performers in Engineering showing turnover risk signals. Recommend immediate retention actions.',
    category: 'hr',
    priority: 'critical',
    status: 'pending',
    automationLevel: 'approval-required',
    trigger: stryMutAct_9fa48("27189") ? {} : (stryCov_9fa48("27189"), {
      condition: 'High-performer turnover risk detected',
      metric: 'retention_risk_score',
      threshold: 75,
      currentValue: 82
    }),
    recommendation: 'Initiate retention conversations with identified engineers, prepare competitive counter-offers',
    impact: stryMutAct_9fa48("27193") ? [] : (stryCov_9fa48("27193"), [stryMutAct_9fa48("27194") ? {} : (stryCov_9fa48("27194"), {
      metric: 'Retention Rate',
      projectedChange: 15,
      unit: '%',
      confidence: 70
    }), stryMutAct_9fa48("27197") ? {} : (stryCov_9fa48("27197"), {
      metric: 'Replacement Cost Avoided',
      projectedChange: 480,
      unit: 'K USD',
      confidence: 85
    }), stryMutAct_9fa48("27200") ? {} : (stryCov_9fa48("27200"), {
      metric: 'Project Continuity',
      projectedChange: 100,
      unit: '%',
      confidence: 90
    })]),
    risks: stryMutAct_9fa48("27203") ? [] : (stryCov_9fa48("27203"), [stryMutAct_9fa48("27204") ? {} : (stryCov_9fa48("27204"), {
      description: 'Salary compression with peers',
      probability: 45,
      mitigation: 'Use equity/bonus instead'
    }), stryMutAct_9fa48("27207") ? {} : (stryCov_9fa48("27207"), {
      description: 'Others may expect similar treatment',
      probability: 35,
      mitigation: 'Position as recognition program'
    })]),
    alternatives: stryMutAct_9fa48("27210") ? [] : (stryCov_9fa48("27210"), [stryMutAct_9fa48("27211") ? {} : (stryCov_9fa48("27211"), {
      description: 'Enhanced career development track',
      impact: 'Lower cost, longer-term impact'
    }), stryMutAct_9fa48("27214") ? {} : (stryCov_9fa48("27214"), {
      description: 'Project reassignment to high-visibility work',
      impact: 'No cost, moderate effectiveness'
    })]),
    aiReasoning: 'Behavioral signals detected: reduced code commits (-40%), calendar availability (-60%), LinkedIn activity (+300%), sentiment in Slack (-25%). Historical pattern matches 87% of engineers who departed within 60 days.',
    supportingData: stryMutAct_9fa48("27218") ? [] : (stryCov_9fa48("27218"), [stryMutAct_9fa48("27219") ? {} : (stryCov_9fa48("27219"), {
      source: 'GitHub',
      value: 'Commit frequency: -40% vs 90-day avg'
    }), stryMutAct_9fa48("27222") ? {} : (stryCov_9fa48("27222"), {
      source: 'Calendar',
      value: 'Meeting declines: +60%'
    }), stryMutAct_9fa48("27225") ? {} : (stryCov_9fa48("27225"), {
      source: 'Slack',
      value: 'Engagement score: 45 (avg: 72)'
    })]),
    createdAt: new Date(stryMutAct_9fa48("27228") ? Date.now() + 4 * 60 * 60 * 1000 : (stryCov_9fa48("27228"), Date.now() - (stryMutAct_9fa48("27229") ? 4 * 60 * 60 / 1000 : (stryCov_9fa48("27229"), (stryMutAct_9fa48("27230") ? 4 * 60 / 60 : (stryCov_9fa48("27230"), (stryMutAct_9fa48("27231") ? 4 / 60 : (stryCov_9fa48("27231"), 4 * 60)) * 60)) * 1000)))),
    expiresAt: new Date(stryMutAct_9fa48("27232") ? Date.now() - 48 * 60 * 60 * 1000 : (stryCov_9fa48("27232"), Date.now() + (stryMutAct_9fa48("27233") ? 48 * 60 * 60 / 1000 : (stryCov_9fa48("27233"), (stryMutAct_9fa48("27234") ? 48 * 60 / 60 : (stryCov_9fa48("27234"), (stryMutAct_9fa48("27235") ? 48 / 60 : (stryCov_9fa48("27235"), 48 * 60)) * 60)) * 1000))))
  }), stryMutAct_9fa48("27236") ? {} : (stryCov_9fa48("27236"), {
    id: 'dec-005',
    title: 'Vendor Contract Renegotiation',
    description: 'Annual renewal approaching for top SaaS vendor. Market analysis suggests 22% savings opportunity through renegotiation.',
    category: 'operational',
    priority: 'medium',
    status: 'approved',
    automationLevel: 'semi-auto',
    trigger: stryMutAct_9fa48("27244") ? {} : (stryCov_9fa48("27244"), {
      condition: 'Contract renewal within 60 days',
      metric: 'contract_renewal_date',
      threshold: 60,
      currentValue: 45
    }),
    recommendation: 'Initiate renegotiation with benchmark data showing 22% below market rate',
    impact: stryMutAct_9fa48("27248") ? [] : (stryCov_9fa48("27248"), [stryMutAct_9fa48("27249") ? {} : (stryCov_9fa48("27249"), {
      metric: 'Annual Spend',
      projectedChange: stryMutAct_9fa48("27251") ? +22 : (stryCov_9fa48("27251"), -22),
      unit: '%',
      confidence: 75
    }), stryMutAct_9fa48("27253") ? {} : (stryCov_9fa48("27253"), {
      metric: 'Savings',
      projectedChange: 85,
      unit: 'K USD',
      confidence: 75
    })]),
    risks: stryMutAct_9fa48("27256") ? [] : (stryCov_9fa48("27256"), [stryMutAct_9fa48("27257") ? {} : (stryCov_9fa48("27257"), {
      description: 'Vendor pushback',
      probability: 50,
      mitigation: 'Have alternative vendor ready'
    })]),
    alternatives: stryMutAct_9fa48("27260") ? [] : (stryCov_9fa48("27260"), [stryMutAct_9fa48("27261") ? {} : (stryCov_9fa48("27261"), {
      description: 'Switch to competitor',
      impact: '$110K savings, 3-month migration'
    })]),
    aiReasoning: 'CendiaMesh benchmark data shows similar-sized companies paying 22% less. Vendor recently lost two enterprise accounts and may be motivated to retain business.',
    supportingData: stryMutAct_9fa48("27265") ? [] : (stryCov_9fa48("27265"), [stryMutAct_9fa48("27266") ? {} : (stryCov_9fa48("27266"), {
      source: 'Contract DB',
      value: 'Current: $385K/year'
    }), stryMutAct_9fa48("27269") ? {} : (stryCov_9fa48("27269"), {
      source: 'CendiaMesh',
      value: 'Benchmark: $300K for comparable usage'
    })]),
    createdAt: new Date(stryMutAct_9fa48("27272") ? Date.now() + 48 * 60 * 60 * 1000 : (stryCov_9fa48("27272"), Date.now() - (stryMutAct_9fa48("27273") ? 48 * 60 * 60 / 1000 : (stryCov_9fa48("27273"), (stryMutAct_9fa48("27274") ? 48 * 60 / 60 : (stryCov_9fa48("27274"), (stryMutAct_9fa48("27275") ? 48 / 60 : (stryCov_9fa48("27275"), 48 * 60)) * 60)) * 1000)))),
    expiresAt: new Date(stryMutAct_9fa48("27276") ? Date.now() - 30 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("27276"), Date.now() + (stryMutAct_9fa48("27277") ? 30 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("27277"), (stryMutAct_9fa48("27278") ? 30 * 24 * 60 / 60 : (stryCov_9fa48("27278"), (stryMutAct_9fa48("27279") ? 30 * 24 / 60 : (stryCov_9fa48("27279"), (stryMutAct_9fa48("27280") ? 30 / 24 : (stryCov_9fa48("27280"), 30 * 24)) * 60)) * 60)) * 1000)))),
    approvedBy: 'CFO',
    approvedAt: new Date(stryMutAct_9fa48("27282") ? Date.now() + 24 * 60 * 60 * 1000 : (stryCov_9fa48("27282"), Date.now() - (stryMutAct_9fa48("27283") ? 24 * 60 * 60 / 1000 : (stryCov_9fa48("27283"), (stryMutAct_9fa48("27284") ? 24 * 60 / 60 : (stryCov_9fa48("27284"), (stryMutAct_9fa48("27285") ? 24 / 60 : (stryCov_9fa48("27285"), 24 * 60)) * 60)) * 1000))))
  })]);
  return generateDecisions;
})());
const generateAutomationRules = stryMutAct_9fa48("27286") ? () => undefined : (stryCov_9fa48("27286"), (() => {
  const generateAutomationRules = (): AutomationRule[] => stryMutAct_9fa48("27287") ? [] : (stryCov_9fa48("27287"), [stryMutAct_9fa48("27288") ? {} : (stryCov_9fa48("27288"), {
    id: 'rule-001',
    name: 'Budget Variance Alert',
    description: 'Trigger budget adjustment recommendations when actual spend exceeds plan by >5%',
    category: 'financial',
    enabled: stryMutAct_9fa48("27293") ? false : (stryCov_9fa48("27293"), true),
    automationLevel: 'approval-required',
    triggers: stryMutAct_9fa48("27295") ? [] : (stryCov_9fa48("27295"), [stryMutAct_9fa48("27296") ? {} : (stryCov_9fa48("27296"), {
      metric: 'budget_variance',
      operator: 'gt',
      value: 5
    })]),
    actions: stryMutAct_9fa48("27299") ? [] : (stryCov_9fa48("27299"), ['Generate budget reallocation recommendation', 'Alert CFO', 'Prepare impact analysis']),
    lastTriggered: new Date(stryMutAct_9fa48("27303") ? Date.now() + 2 * 60 * 60 * 1000 : (stryCov_9fa48("27303"), Date.now() - (stryMutAct_9fa48("27304") ? 2 * 60 * 60 / 1000 : (stryCov_9fa48("27304"), (stryMutAct_9fa48("27305") ? 2 * 60 / 60 : (stryCov_9fa48("27305"), (stryMutAct_9fa48("27306") ? 2 / 60 : (stryCov_9fa48("27306"), 2 * 60)) * 60)) * 1000)))),
    triggerCount: 12
  }), stryMutAct_9fa48("27307") ? {} : (stryCov_9fa48("27307"), {
    id: 'rule-002',
    name: 'High-Performer Retention',
    description: 'Automatically flag and recommend retention actions for high-performers showing risk signals',
    category: 'hr',
    enabled: stryMutAct_9fa48("27312") ? false : (stryCov_9fa48("27312"), true),
    automationLevel: 'approval-required',
    triggers: stryMutAct_9fa48("27314") ? [] : (stryCov_9fa48("27314"), [stryMutAct_9fa48("27315") ? {} : (stryCov_9fa48("27315"), {
      metric: 'retention_risk_score',
      operator: 'gt',
      value: 70
    })]),
    actions: stryMutAct_9fa48("27318") ? [] : (stryCov_9fa48("27318"), ['Alert CHRO', 'Prepare retention package options', 'Schedule manager check-in']),
    lastTriggered: new Date(stryMutAct_9fa48("27322") ? Date.now() + 4 * 60 * 60 * 1000 : (stryCov_9fa48("27322"), Date.now() - (stryMutAct_9fa48("27323") ? 4 * 60 * 60 / 1000 : (stryCov_9fa48("27323"), (stryMutAct_9fa48("27324") ? 4 * 60 / 60 : (stryCov_9fa48("27324"), (stryMutAct_9fa48("27325") ? 4 / 60 : (stryCov_9fa48("27325"), 4 * 60)) * 60)) * 1000)))),
    triggerCount: 8
  }), stryMutAct_9fa48("27326") ? {} : (stryCov_9fa48("27326"), {
    id: 'rule-003',
    name: 'Sales Training Enrollment',
    description: 'Auto-enroll underperforming reps in training when conversion drops',
    category: 'sales',
    enabled: stryMutAct_9fa48("27331") ? false : (stryCov_9fa48("27331"), true),
    automationLevel: 'full-auto',
    triggers: stryMutAct_9fa48("27333") ? [] : (stryCov_9fa48("27333"), [stryMutAct_9fa48("27334") ? {} : (stryCov_9fa48("27334"), {
      metric: 'sales_conversion_rate',
      operator: 'lt',
      value: stryMutAct_9fa48("27337") ? +10 : (stryCov_9fa48("27337"), -10)
    })]),
    actions: stryMutAct_9fa48("27338") ? [] : (stryCov_9fa48("27338"), ['Enroll in training program', 'Notify sales manager', 'Schedule follow-up assessment']),
    lastTriggered: new Date(stryMutAct_9fa48("27342") ? Date.now() + 24 * 60 * 60 * 1000 : (stryCov_9fa48("27342"), Date.now() - (stryMutAct_9fa48("27343") ? 24 * 60 * 60 / 1000 : (stryCov_9fa48("27343"), (stryMutAct_9fa48("27344") ? 24 * 60 / 60 : (stryCov_9fa48("27344"), (stryMutAct_9fa48("27345") ? 24 / 60 : (stryCov_9fa48("27345"), 24 * 60)) * 60)) * 1000)))),
    triggerCount: 23
  }), stryMutAct_9fa48("27346") ? {} : (stryCov_9fa48("27346"), {
    id: 'rule-004',
    name: 'Cloud Cost Optimization',
    description: 'Recommend workload optimization when cloud costs increase >15% MoM',
    category: 'technology',
    enabled: stryMutAct_9fa48("27351") ? false : (stryCov_9fa48("27351"), true),
    automationLevel: 'approval-required',
    triggers: stryMutAct_9fa48("27353") ? [] : (stryCov_9fa48("27353"), [stryMutAct_9fa48("27354") ? {} : (stryCov_9fa48("27354"), {
      metric: 'cloud_cost_mom',
      operator: 'gt',
      value: 15
    })]),
    actions: stryMutAct_9fa48("27357") ? [] : (stryCov_9fa48("27357"), ['Generate optimization report', 'Identify migration candidates', 'Alert CIO']),
    lastTriggered: new Date(stryMutAct_9fa48("27361") ? Date.now() + 8 * 60 * 60 * 1000 : (stryCov_9fa48("27361"), Date.now() - (stryMutAct_9fa48("27362") ? 8 * 60 * 60 / 1000 : (stryCov_9fa48("27362"), (stryMutAct_9fa48("27363") ? 8 * 60 / 60 : (stryCov_9fa48("27363"), (stryMutAct_9fa48("27364") ? 8 / 60 : (stryCov_9fa48("27364"), 8 * 60)) * 60)) * 1000)))),
    triggerCount: 5
  }), stryMutAct_9fa48("27365") ? {} : (stryCov_9fa48("27365"), {
    id: 'rule-005',
    name: 'Security Incident Response',
    description: 'Auto-initiate incident response for critical security events',
    category: 'risk',
    enabled: stryMutAct_9fa48("27370") ? false : (stryCov_9fa48("27370"), true),
    automationLevel: 'full-auto',
    triggers: stryMutAct_9fa48("27372") ? [] : (stryCov_9fa48("27372"), [stryMutAct_9fa48("27373") ? {} : (stryCov_9fa48("27373"), {
      metric: 'security_threat_level',
      operator: 'eq',
      value: 5
    })]),
    actions: stryMutAct_9fa48("27376") ? [] : (stryCov_9fa48("27376"), ['Activate incident response', 'Isolate affected systems', 'Alert CISO and exec team']),
    triggerCount: 2
  })]);
  return generateAutomationRules;
})());
const calculateSystemHealth = (decisions: AutoDecision[]): SystemHealth => {
  const categories: SystemHealth['categories'] = (Object.keys(CATEGORY_CONFIG) as DecisionCategory[]).map(stryMutAct_9fa48("27381") ? () => undefined : (stryCov_9fa48("27381"), cat => stryMutAct_9fa48("27382") ? {} : (stryCov_9fa48("27382"), {
    category: cat,
    score: stryMutAct_9fa48("27383") ? 70 - Math.random() * 25 : (stryCov_9fa48("27383"), 70 + (stryMutAct_9fa48("27384") ? Math.random() / 25 : (stryCov_9fa48("27384"), Math.random() * 25))),
    trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
    activeDecisions: stryMutAct_9fa48("27385") ? decisions.length : (stryCov_9fa48("27385"), decisions.filter(stryMutAct_9fa48("27386") ? () => undefined : (stryCov_9fa48("27386"), d => stryMutAct_9fa48("27389") ? d.category === cat || d.status === 'pending' : stryMutAct_9fa48("27388") ? false : stryMutAct_9fa48("27387") ? true : (stryCov_9fa48("27387", "27388", "27389"), (stryMutAct_9fa48("27391") ? d.category !== cat : stryMutAct_9fa48("27390") ? true : (stryCov_9fa48("27390", "27391"), d.category === cat)) && (stryMutAct_9fa48("27393") ? d.status !== 'pending' : stryMutAct_9fa48("27392") ? true : (stryCov_9fa48("27392", "27393"), d.status === 'pending'))))).length)
  })));
  return stryMutAct_9fa48("27395") ? {} : (stryCov_9fa48("27395"), {
    overallScore: Math.round(stryMutAct_9fa48("27396") ? categories.reduce((sum, c) => sum + c.score, 0) * categories.length : (stryCov_9fa48("27396"), categories.reduce(stryMutAct_9fa48("27397") ? () => undefined : (stryCov_9fa48("27397"), (sum, c) => stryMutAct_9fa48("27398") ? sum - c.score : (stryCov_9fa48("27398"), sum + c.score)), 0) / categories.length)),
    categories,
    pendingDecisions: stryMutAct_9fa48("27399") ? decisions.length : (stryCov_9fa48("27399"), decisions.filter(stryMutAct_9fa48("27400") ? () => undefined : (stryCov_9fa48("27400"), d => stryMutAct_9fa48("27403") ? d.status !== 'pending' : stryMutAct_9fa48("27402") ? false : stryMutAct_9fa48("27401") ? true : (stryCov_9fa48("27401", "27402", "27403"), d.status === 'pending'))).length),
    autoExecutedToday: stryMutAct_9fa48("27405") ? decisions.length : (stryCov_9fa48("27405"), decisions.filter(stryMutAct_9fa48("27406") ? () => undefined : (stryCov_9fa48("27406"), d => stryMutAct_9fa48("27409") ? d.status !== 'auto-executed' : stryMutAct_9fa48("27408") ? false : stryMutAct_9fa48("27407") ? true : (stryCov_9fa48("27407", "27408", "27409"), d.status === 'auto-executed'))).length),
    humanApprovedToday: stryMutAct_9fa48("27411") ? decisions.length : (stryCov_9fa48("27411"), decisions.filter(stryMutAct_9fa48("27412") ? () => undefined : (stryCov_9fa48("27412"), d => stryMutAct_9fa48("27415") ? d.status !== 'approved' : stryMutAct_9fa48("27414") ? false : stryMutAct_9fa48("27413") ? true : (stryCov_9fa48("27413", "27414", "27415"), d.status === 'approved'))).length),
    escalatedToday: stryMutAct_9fa48("27417") ? decisions.length : (stryCov_9fa48("27417"), decisions.filter(stryMutAct_9fa48("27418") ? () => undefined : (stryCov_9fa48("27418"), d => stryMutAct_9fa48("27421") ? d.status !== 'escalated' : stryMutAct_9fa48("27420") ? false : stryMutAct_9fa48("27419") ? true : (stryCov_9fa48("27419", "27420", "27421"), d.status === 'escalated'))).length)
  });
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const AutopilotPage: React.FC = () => {
  const navigate = useNavigate();
  const [decisions, setDecisions] = useState<AutoDecision[]>(stryMutAct_9fa48("27424") ? ["Stryker was here"] : (stryCov_9fa48("27424"), []));
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(stryMutAct_9fa48("27425") ? ["Stryker was here"] : (stryCov_9fa48("27425"), []));
  const [activeTab, setActiveTab] = useState<'dashboard' | 'decisions' | 'rules' | 'history'>('dashboard');
  const [selectedDecision, setSelectedDecision] = useState<AutoDecision | null>(null);
  const [autopilotEnabled, setAutopilotEnabled] = useState(stryMutAct_9fa48("27427") ? false : (stryCov_9fa48("27427"), true));
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [ollamaStatus, setOllamaStatus] = useState(stryMutAct_9fa48("27428") ? {} : (stryCov_9fa48("27428"), {
    available: stryMutAct_9fa48("27429") ? true : (stryCov_9fa48("27429"), false)
  }));

  // Load data from Enterprise Service & API
  const loadData = useCallback(async () => {
    // First try to load from API
    try {
      const [rulesRes, executionsRes] = await Promise.all(stryMutAct_9fa48("27432") ? [] : (stryCov_9fa48("27432"), [api.autopilot.getRules(), api.autopilot.getExecutions()]));
      if (stryMutAct_9fa48("27435") ? rulesRes.success || rulesRes.data : stryMutAct_9fa48("27434") ? false : stryMutAct_9fa48("27433") ? true : (stryCov_9fa48("27433", "27434", "27435"), rulesRes.success && rulesRes.data)) {
        console.log('[Autopilot] Loaded', rulesRes.data.length, 'rules from database');
      }
      if (stryMutAct_9fa48("27441") ? executionsRes.success || executionsRes.data : stryMutAct_9fa48("27440") ? false : stryMutAct_9fa48("27439") ? true : (stryCov_9fa48("27439", "27440", "27441"), executionsRes.success && executionsRes.data)) {
        console.log('[Autopilot] Loaded', executionsRes.data.length, 'executions from database');
      }
    } catch (error) {
      console.log('[Autopilot] API unavailable, using local service');
    }

    // Fall back to enterprise service
    setDecisions(enterpriseService.getAutoDecisions());
    setSystemHealth(enterpriseService.getSystemHealth());
    setOllamaStatus(ollamaService.getStatus());
  }, stryMutAct_9fa48("27447") ? ["Stryker was here"] : (stryCov_9fa48("27447"), []));
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // Refresh every 10s
    return stryMutAct_9fa48("27449") ? () => undefined : (stryCov_9fa48("27449"), () => clearInterval(interval));
  }, stryMutAct_9fa48("27450") ? [] : (stryCov_9fa48("27450"), [loadData]));
  const pendingDecisions = stryMutAct_9fa48("27451") ? decisions : (stryCov_9fa48("27451"), decisions.filter(stryMutAct_9fa48("27452") ? () => undefined : (stryCov_9fa48("27452"), d => stryMutAct_9fa48("27455") ? d.status !== 'pending' : stryMutAct_9fa48("27454") ? false : stryMutAct_9fa48("27453") ? true : (stryCov_9fa48("27453", "27454", "27455"), d.status === 'pending'))));
  const criticalPending = stryMutAct_9fa48("27457") ? pendingDecisions : (stryCov_9fa48("27457"), pendingDecisions.filter(stryMutAct_9fa48("27458") ? () => undefined : (stryCov_9fa48("27458"), d => stryMutAct_9fa48("27461") ? d.priority !== 'critical' : stryMutAct_9fa48("27460") ? false : stryMutAct_9fa48("27459") ? true : (stryCov_9fa48("27459", "27460", "27461"), d.priority === 'critical'))));
  const handleApprove = (decisionId: string) => {
    enterpriseService.approveAutoDecision(decisionId, 'Current User');
    loadData();
    setSelectedDecision(null);
  };
  const handleReject = (decisionId: string) => {
    enterpriseService.rejectAutoDecision(decisionId);
    loadData();
    setSelectedDecision(null);
  };
  return <div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-950 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-amber-800/50 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={stryMutAct_9fa48("27466") ? () => undefined : (stryCov_9fa48("27466"), () => navigate('/cortex/dashboard'))} className="text-white/60 hover:text-white transition-colors">
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-3xl">🚀</span>
                  CendiaAutopilot™
                  <span className="text-xs bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 rounded-full font-medium">
                    AUTONOMOUS
                  </span>
                </h1>
                <p className="text-amber-300 text-sm">Self-Driving Enterprise Mode • AI Proposes, Humans Approve</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Autopilot Toggle */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/60">Autopilot</span>
                <button onClick={stryMutAct_9fa48("27468") ? () => undefined : (stryCov_9fa48("27468"), () => setAutopilotEnabled(stryMutAct_9fa48("27469") ? autopilotEnabled : (stryCov_9fa48("27469"), !autopilotEnabled)))} className={`relative w-14 h-7 rounded-full transition-colors ${autopilotEnabled ? 'bg-green-600' : 'bg-neutral-700'}`}>
                  <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${autopilotEnabled ? 'translate-x-8' : 'translate-x-1'}`} />
                </button>
                <span className={`text-sm font-medium ${autopilotEnabled ? 'text-green-400' : 'text-neutral-400'}`}>
                  {autopilotEnabled ? 'Active' : 'Paused'}
                </span>
              </div>

              {stryMutAct_9fa48("27483") ? criticalPending.length > 0 || <div className="px-4 py-2 bg-red-600 rounded-lg animate-pulse">
                  <div className="text-sm font-bold">{criticalPending.length} Critical</div>
                  <div className="text-xs">Awaiting Approval</div>
                </div> : stryMutAct_9fa48("27482") ? false : stryMutAct_9fa48("27481") ? true : (stryCov_9fa48("27481", "27482", "27483"), (stryMutAct_9fa48("27486") ? criticalPending.length <= 0 : stryMutAct_9fa48("27485") ? criticalPending.length >= 0 : stryMutAct_9fa48("27484") ? true : (stryCov_9fa48("27484", "27485", "27486"), criticalPending.length > 0)) && <div className="px-4 py-2 bg-red-600 rounded-lg animate-pulse">
                  <div className="text-sm font-bold">{criticalPending.length} Critical</div>
                  <div className="text-xs">Awaiting Approval</div>
                </div>)}
            </div>
          </div>
        </div>
      </header>

      {/* System Health Bar */}
      <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-b border-amber-800/30">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="grid grid-cols-6 gap-4 text-center">
            <div>
              <div className={`text-3xl font-bold ${(stryMutAct_9fa48("27491") ? (systemHealth?.overallScore ?? 0) < 80 : stryMutAct_9fa48("27490") ? (systemHealth?.overallScore ?? 0) > 80 : stryMutAct_9fa48("27489") ? false : stryMutAct_9fa48("27488") ? true : (stryCov_9fa48("27488", "27489", "27490", "27491"), (stryMutAct_9fa48("27492") ? systemHealth?.overallScore && 0 : (stryCov_9fa48("27492"), (stryMutAct_9fa48("27493") ? systemHealth.overallScore : (stryCov_9fa48("27493"), systemHealth?.overallScore)) ?? 0)) >= 80)) ? 'text-green-400' : (stryMutAct_9fa48("27498") ? (systemHealth?.overallScore ?? 0) < 60 : stryMutAct_9fa48("27497") ? (systemHealth?.overallScore ?? 0) > 60 : stryMutAct_9fa48("27496") ? false : stryMutAct_9fa48("27495") ? true : (stryCov_9fa48("27495", "27496", "27497", "27498"), (stryMutAct_9fa48("27499") ? systemHealth?.overallScore && 0 : (stryCov_9fa48("27499"), (stryMutAct_9fa48("27500") ? systemHealth.overallScore : (stryCov_9fa48("27500"), systemHealth?.overallScore)) ?? 0)) >= 60)) ? 'text-amber-400' : 'text-red-400'}`}>{stryMutAct_9fa48("27503") ? systemHealth?.overallScore && 0 : (stryCov_9fa48("27503"), (stryMutAct_9fa48("27504") ? systemHealth.overallScore : (stryCov_9fa48("27504"), systemHealth?.overallScore)) ?? 0)}%</div>
              <div className="text-xs text-amber-300">System Health</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-400">{stryMutAct_9fa48("27505") ? systemHealth?.pendingDecisions && 0 : (stryCov_9fa48("27505"), (stryMutAct_9fa48("27506") ? systemHealth.pendingDecisions : (stryCov_9fa48("27506"), systemHealth?.pendingDecisions)) ?? 0)}</div>
              <div className="text-xs text-amber-300">Pending Decisions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">{stryMutAct_9fa48("27507") ? systemHealth?.autoExecutedToday && 0 : (stryCov_9fa48("27507"), (stryMutAct_9fa48("27508") ? systemHealth.autoExecutedToday : (stryCov_9fa48("27508"), systemHealth?.autoExecutedToday)) ?? 0)}</div>
              <div className="text-xs text-amber-300">Auto-Executed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400">{stryMutAct_9fa48("27509") ? systemHealth?.humanApprovedToday && 0 : (stryCov_9fa48("27509"), (stryMutAct_9fa48("27510") ? systemHealth.humanApprovedToday : (stryCov_9fa48("27510"), systemHealth?.humanApprovedToday)) ?? 0)}</div>
              <div className="text-xs text-amber-300">Human Approved</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">{stryMutAct_9fa48("27511") ? automationRules.length : (stryCov_9fa48("27511"), automationRules.filter(stryMutAct_9fa48("27512") ? () => undefined : (stryCov_9fa48("27512"), r => r.enabled)).length)}</div>
              <div className="text-xs text-amber-300">Active Rules</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-400">24/7</div>
              <div className="text-xs text-amber-300">Monitoring</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-amber-800/30 bg-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {(stryMutAct_9fa48("27513") ? [] : (stryCov_9fa48("27513"), [stryMutAct_9fa48("27514") ? {} : (stryCov_9fa48("27514"), {
            id: 'dashboard',
            label: 'Command Center',
            icon: '🎛️'
          }), stryMutAct_9fa48("27518") ? {} : (stryCov_9fa48("27518"), {
            id: 'decisions',
            label: 'Pending Decisions',
            icon: '⏳',
            badge: pendingDecisions.length
          }), stryMutAct_9fa48("27522") ? {} : (stryCov_9fa48("27522"), {
            id: 'rules',
            label: 'Automation Rules',
            icon: '⚙️'
          }), stryMutAct_9fa48("27526") ? {} : (stryCov_9fa48("27526"), {
            id: 'history',
            label: 'Decision History',
            icon: '📜'
          })])).map(stryMutAct_9fa48("27530") ? () => undefined : (stryCov_9fa48("27530"), tab => <button key={tab.id} onClick={stryMutAct_9fa48("27531") ? () => undefined : (stryCov_9fa48("27531"), () => setActiveTab(tab.id as any))} className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${(stryMutAct_9fa48("27535") ? activeTab !== tab.id : stryMutAct_9fa48("27534") ? false : stryMutAct_9fa48("27533") ? true : (stryCov_9fa48("27533", "27534", "27535"), activeTab === tab.id)) ? 'border-amber-400 text-white bg-amber-900/20' : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'}`}>
                {tab.icon} {tab.label}
                {stryMutAct_9fa48("27540") ? tab.badge && tab.badge > 0 || <span className="px-2 py-0.5 bg-amber-600 rounded-full text-xs">{tab.badge}</span> : stryMutAct_9fa48("27539") ? false : stryMutAct_9fa48("27538") ? true : (stryCov_9fa48("27538", "27539", "27540"), (stryMutAct_9fa48("27542") ? tab.badge || tab.badge > 0 : stryMutAct_9fa48("27541") ? true : (stryCov_9fa48("27541", "27542"), tab.badge && (stryMutAct_9fa48("27545") ? tab.badge <= 0 : stryMutAct_9fa48("27544") ? tab.badge >= 0 : stryMutAct_9fa48("27543") ? true : (stryCov_9fa48("27543", "27544", "27545"), tab.badge > 0)))) && <span className="px-2 py-0.5 bg-amber-600 rounded-full text-xs">{tab.badge}</span>)}
              </button>))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {stryMutAct_9fa48("27548") ? activeTab === 'dashboard' || <div className="space-y-6">
            {/* Critical Decisions Alert */}
            {criticalPending.length > 0 && <div className="bg-red-900/30 rounded-2xl p-6 border border-red-700/50">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="text-red-400 animate-pulse">🚨</span> Critical Decisions Requiring Attention
                </h2>
                <div className="space-y-3">
                  {criticalPending.map(d => <div key={d.id} onClick={() => setSelectedDecision(d)} className="p-4 bg-red-900/20 rounded-xl border border-red-700/50 cursor-pointer hover:bg-red-900/30 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{CATEGORY_CONFIG[d.category].icon}</span>
                          <div>
                            <h3 className="font-semibold">{d.title}</h3>
                            <p className="text-sm text-white/60">{d.description.slice(0, 100)}...</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-red-600 rounded-lg font-medium hover:bg-red-500 transition-colors">
                          Review Now
                        </button>
                      </div>
                    </div>)}
                </div>
              </div>}

            {/* Category Health */}
            <div className="bg-black/30 rounded-2xl p-6 border border-amber-800/50">
              <h2 className="text-lg font-semibold mb-4">System Health by Category</h2>
              <div className="grid grid-cols-7 gap-4">
                {(systemHealth?.categories ?? []).map(cat => {
              const config = CATEGORY_CONFIG[cat.category];
              return <div key={cat.category} className="text-center p-4 bg-black/20 rounded-xl">
                      <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-2xl mb-2`}>
                        {config.icon}
                      </div>
                      <div className={`text-2xl font-bold ${cat.score >= 80 ? 'text-green-400' : cat.score >= 60 ? 'text-amber-400' : 'text-red-400'}`}>{Math.round(cat.score)}%</div>
                      <div className="text-xs text-white/50">{config.name}</div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <span className={cat.trend === 'up' ? 'text-green-400' : cat.trend === 'down' ? 'text-red-400' : 'text-white/40'}>
                          {cat.trend === 'up' ? '↑' : cat.trend === 'down' ? '↓' : '→'}
                        </span>
                        {cat.activeDecisions > 0 && <span className="text-xs px-1.5 py-0.5 bg-amber-600 rounded">{cat.activeDecisions}</span>}
                      </div>
                    </div>;
            })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-black/30 rounded-2xl p-6 border border-amber-800/50">
                <h3 className="text-lg font-semibold mb-4">Recent Auto-Executed Decisions</h3>
                <div className="space-y-3">
                  {decisions.filter(d => d.status === 'auto-executed').slice(0, 3).map(d => <div key={d.id} className="p-3 bg-green-900/20 rounded-xl border border-green-700/50">
                      <div className="flex items-center gap-2 mb-1">
                        <span>{CATEGORY_CONFIG[d.category].icon}</span>
                        <span className="font-medium text-sm">{d.title}</span>
                        <span className="text-xs px-2 py-0.5 bg-green-600 rounded">Auto</span>
                      </div>
                      <p className="text-xs text-white/60">{d.recommendation}</p>
                    </div>)}
                </div>
              </div>

              <div className="bg-black/30 rounded-2xl p-6 border border-amber-800/50">
                <h3 className="text-lg font-semibold mb-4">Recently Triggered Rules</h3>
                <div className="space-y-3">
                  {automationRules.filter(r => r.lastTriggered).slice(0, 3).map(r => <div key={r.id} className="p-3 bg-black/20 rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span>{CATEGORY_CONFIG[r.category].icon}</span>
                          <span className="font-medium text-sm">{r.name}</span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded ${r.automationLevel === 'full-auto' ? 'bg-green-900 text-green-300' : r.automationLevel === 'semi-auto' ? 'bg-amber-900 text-amber-300' : 'bg-blue-900 text-blue-300'}`}>
                          {r.automationLevel}
                        </span>
                      </div>
                      <div className="text-xs text-white/50">
                        Triggered {Math.floor((Date.now() - (r.lastTriggered?.getTime() || 0)) / 3600000)}h ago • {r.triggerCount} total
                      </div>
                    </div>)}
                </div>
              </div>
            </div>
          </div> : stryMutAct_9fa48("27547") ? false : stryMutAct_9fa48("27546") ? true : (stryCov_9fa48("27546", "27547", "27548"), (stryMutAct_9fa48("27550") ? activeTab !== 'dashboard' : stryMutAct_9fa48("27549") ? true : (stryCov_9fa48("27549", "27550"), activeTab === 'dashboard')) && <div className="space-y-6">
            {/* Critical Decisions Alert */}
            {stryMutAct_9fa48("27554") ? criticalPending.length > 0 || <div className="bg-red-900/30 rounded-2xl p-6 border border-red-700/50">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="text-red-400 animate-pulse">🚨</span> Critical Decisions Requiring Attention
                </h2>
                <div className="space-y-3">
                  {criticalPending.map(d => <div key={d.id} onClick={() => setSelectedDecision(d)} className="p-4 bg-red-900/20 rounded-xl border border-red-700/50 cursor-pointer hover:bg-red-900/30 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{CATEGORY_CONFIG[d.category].icon}</span>
                          <div>
                            <h3 className="font-semibold">{d.title}</h3>
                            <p className="text-sm text-white/60">{d.description.slice(0, 100)}...</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-red-600 rounded-lg font-medium hover:bg-red-500 transition-colors">
                          Review Now
                        </button>
                      </div>
                    </div>)}
                </div>
              </div> : stryMutAct_9fa48("27553") ? false : stryMutAct_9fa48("27552") ? true : (stryCov_9fa48("27552", "27553", "27554"), (stryMutAct_9fa48("27557") ? criticalPending.length <= 0 : stryMutAct_9fa48("27556") ? criticalPending.length >= 0 : stryMutAct_9fa48("27555") ? true : (stryCov_9fa48("27555", "27556", "27557"), criticalPending.length > 0)) && <div className="bg-red-900/30 rounded-2xl p-6 border border-red-700/50">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="text-red-400 animate-pulse">🚨</span> Critical Decisions Requiring Attention
                </h2>
                <div className="space-y-3">
                  {criticalPending.map(stryMutAct_9fa48("27558") ? () => undefined : (stryCov_9fa48("27558"), d => <div key={d.id} onClick={stryMutAct_9fa48("27559") ? () => undefined : (stryCov_9fa48("27559"), () => setSelectedDecision(d))} className="p-4 bg-red-900/20 rounded-xl border border-red-700/50 cursor-pointer hover:bg-red-900/30 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{CATEGORY_CONFIG[d.category].icon}</span>
                          <div>
                            <h3 className="font-semibold">{d.title}</h3>
                            <p className="text-sm text-white/60">{stryMutAct_9fa48("27560") ? d.description : (stryCov_9fa48("27560"), d.description.slice(0, 100))}...</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-red-600 rounded-lg font-medium hover:bg-red-500 transition-colors">
                          Review Now
                        </button>
                      </div>
                    </div>))}
                </div>
              </div>)}

            {/* Category Health */}
            <div className="bg-black/30 rounded-2xl p-6 border border-amber-800/50">
              <h2 className="text-lg font-semibold mb-4">System Health by Category</h2>
              <div className="grid grid-cols-7 gap-4">
                {(stryMutAct_9fa48("27561") ? systemHealth?.categories && [] : (stryCov_9fa48("27561"), (stryMutAct_9fa48("27562") ? systemHealth.categories : (stryCov_9fa48("27562"), systemHealth?.categories)) ?? (stryMutAct_9fa48("27563") ? ["Stryker was here"] : (stryCov_9fa48("27563"), [])))).map(cat => {
              const config = CATEGORY_CONFIG[cat.category];
              return <div key={cat.category} className="text-center p-4 bg-black/20 rounded-xl">
                      <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-2xl mb-2`}>
                        {config.icon}
                      </div>
                      <div className={`text-2xl font-bold ${(stryMutAct_9fa48("27570") ? cat.score < 80 : stryMutAct_9fa48("27569") ? cat.score > 80 : stryMutAct_9fa48("27568") ? false : stryMutAct_9fa48("27567") ? true : (stryCov_9fa48("27567", "27568", "27569", "27570"), cat.score >= 80)) ? 'text-green-400' : (stryMutAct_9fa48("27575") ? cat.score < 60 : stryMutAct_9fa48("27574") ? cat.score > 60 : stryMutAct_9fa48("27573") ? false : stryMutAct_9fa48("27572") ? true : (stryCov_9fa48("27572", "27573", "27574", "27575"), cat.score >= 60)) ? 'text-amber-400' : 'text-red-400'}`}>{Math.round(cat.score)}%</div>
                      <div className="text-xs text-white/50">{config.name}</div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <span className={(stryMutAct_9fa48("27580") ? cat.trend !== 'up' : stryMutAct_9fa48("27579") ? false : stryMutAct_9fa48("27578") ? true : (stryCov_9fa48("27578", "27579", "27580"), cat.trend === 'up')) ? 'text-green-400' : (stryMutAct_9fa48("27585") ? cat.trend !== 'down' : stryMutAct_9fa48("27584") ? false : stryMutAct_9fa48("27583") ? true : (stryCov_9fa48("27583", "27584", "27585"), cat.trend === 'down')) ? 'text-red-400' : 'text-white/40'}>
                          {(stryMutAct_9fa48("27591") ? cat.trend !== 'up' : stryMutAct_9fa48("27590") ? false : stryMutAct_9fa48("27589") ? true : (stryCov_9fa48("27589", "27590", "27591"), cat.trend === 'up')) ? '↑' : (stryMutAct_9fa48("27596") ? cat.trend !== 'down' : stryMutAct_9fa48("27595") ? false : stryMutAct_9fa48("27594") ? true : (stryCov_9fa48("27594", "27595", "27596"), cat.trend === 'down')) ? '↓' : '→'}
                        </span>
                        {stryMutAct_9fa48("27602") ? cat.activeDecisions > 0 || <span className="text-xs px-1.5 py-0.5 bg-amber-600 rounded">{cat.activeDecisions}</span> : stryMutAct_9fa48("27601") ? false : stryMutAct_9fa48("27600") ? true : (stryCov_9fa48("27600", "27601", "27602"), (stryMutAct_9fa48("27605") ? cat.activeDecisions <= 0 : stryMutAct_9fa48("27604") ? cat.activeDecisions >= 0 : stryMutAct_9fa48("27603") ? true : (stryCov_9fa48("27603", "27604", "27605"), cat.activeDecisions > 0)) && <span className="text-xs px-1.5 py-0.5 bg-amber-600 rounded">{cat.activeDecisions}</span>)}
                      </div>
                    </div>;
            })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-black/30 rounded-2xl p-6 border border-amber-800/50">
                <h3 className="text-lg font-semibold mb-4">Recent Auto-Executed Decisions</h3>
                <div className="space-y-3">
                  {stryMutAct_9fa48("27607") ? decisions.slice(0, 3).map(d => <div key={d.id} className="p-3 bg-green-900/20 rounded-xl border border-green-700/50">
                      <div className="flex items-center gap-2 mb-1">
                        <span>{CATEGORY_CONFIG[d.category].icon}</span>
                        <span className="font-medium text-sm">{d.title}</span>
                        <span className="text-xs px-2 py-0.5 bg-green-600 rounded">Auto</span>
                      </div>
                      <p className="text-xs text-white/60">{d.recommendation}</p>
                    </div>) : stryMutAct_9fa48("27606") ? decisions.filter(d => d.status === 'auto-executed').map(d => <div key={d.id} className="p-3 bg-green-900/20 rounded-xl border border-green-700/50">
                      <div className="flex items-center gap-2 mb-1">
                        <span>{CATEGORY_CONFIG[d.category].icon}</span>
                        <span className="font-medium text-sm">{d.title}</span>
                        <span className="text-xs px-2 py-0.5 bg-green-600 rounded">Auto</span>
                      </div>
                      <p className="text-xs text-white/60">{d.recommendation}</p>
                    </div>) : (stryCov_9fa48("27606", "27607"), decisions.filter(stryMutAct_9fa48("27608") ? () => undefined : (stryCov_9fa48("27608"), d => stryMutAct_9fa48("27611") ? d.status !== 'auto-executed' : stryMutAct_9fa48("27610") ? false : stryMutAct_9fa48("27609") ? true : (stryCov_9fa48("27609", "27610", "27611"), d.status === 'auto-executed'))).slice(0, 3).map(stryMutAct_9fa48("27613") ? () => undefined : (stryCov_9fa48("27613"), d => <div key={d.id} className="p-3 bg-green-900/20 rounded-xl border border-green-700/50">
                      <div className="flex items-center gap-2 mb-1">
                        <span>{CATEGORY_CONFIG[d.category].icon}</span>
                        <span className="font-medium text-sm">{d.title}</span>
                        <span className="text-xs px-2 py-0.5 bg-green-600 rounded">Auto</span>
                      </div>
                      <p className="text-xs text-white/60">{d.recommendation}</p>
                    </div>)))}
                </div>
              </div>

              <div className="bg-black/30 rounded-2xl p-6 border border-amber-800/50">
                <h3 className="text-lg font-semibold mb-4">Recently Triggered Rules</h3>
                <div className="space-y-3">
                  {stryMutAct_9fa48("27615") ? automationRules.slice(0, 3).map(r => <div key={r.id} className="p-3 bg-black/20 rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span>{CATEGORY_CONFIG[r.category].icon}</span>
                          <span className="font-medium text-sm">{r.name}</span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded ${r.automationLevel === 'full-auto' ? 'bg-green-900 text-green-300' : r.automationLevel === 'semi-auto' ? 'bg-amber-900 text-amber-300' : 'bg-blue-900 text-blue-300'}`}>
                          {r.automationLevel}
                        </span>
                      </div>
                      <div className="text-xs text-white/50">
                        Triggered {Math.floor((Date.now() - (r.lastTriggered?.getTime() || 0)) / 3600000)}h ago • {r.triggerCount} total
                      </div>
                    </div>) : stryMutAct_9fa48("27614") ? automationRules.filter(r => r.lastTriggered).map(r => <div key={r.id} className="p-3 bg-black/20 rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span>{CATEGORY_CONFIG[r.category].icon}</span>
                          <span className="font-medium text-sm">{r.name}</span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded ${r.automationLevel === 'full-auto' ? 'bg-green-900 text-green-300' : r.automationLevel === 'semi-auto' ? 'bg-amber-900 text-amber-300' : 'bg-blue-900 text-blue-300'}`}>
                          {r.automationLevel}
                        </span>
                      </div>
                      <div className="text-xs text-white/50">
                        Triggered {Math.floor((Date.now() - (r.lastTriggered?.getTime() || 0)) / 3600000)}h ago • {r.triggerCount} total
                      </div>
                    </div>) : (stryCov_9fa48("27614", "27615"), automationRules.filter(stryMutAct_9fa48("27616") ? () => undefined : (stryCov_9fa48("27616"), r => r.lastTriggered)).slice(0, 3).map(stryMutAct_9fa48("27617") ? () => undefined : (stryCov_9fa48("27617"), r => <div key={r.id} className="p-3 bg-black/20 rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span>{CATEGORY_CONFIG[r.category].icon}</span>
                          <span className="font-medium text-sm">{r.name}</span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded ${(stryMutAct_9fa48("27621") ? r.automationLevel !== 'full-auto' : stryMutAct_9fa48("27620") ? false : stryMutAct_9fa48("27619") ? true : (stryCov_9fa48("27619", "27620", "27621"), r.automationLevel === 'full-auto')) ? 'bg-green-900 text-green-300' : (stryMutAct_9fa48("27626") ? r.automationLevel !== 'semi-auto' : stryMutAct_9fa48("27625") ? false : stryMutAct_9fa48("27624") ? true : (stryCov_9fa48("27624", "27625", "27626"), r.automationLevel === 'semi-auto')) ? 'bg-amber-900 text-amber-300' : 'bg-blue-900 text-blue-300'}`}>
                          {r.automationLevel}
                        </span>
                      </div>
                      <div className="text-xs text-white/50">
                        Triggered {Math.floor(stryMutAct_9fa48("27630") ? (Date.now() - (r.lastTriggered?.getTime() || 0)) * 3600000 : (stryCov_9fa48("27630"), (stryMutAct_9fa48("27631") ? Date.now() + (r.lastTriggered?.getTime() || 0) : (stryCov_9fa48("27631"), Date.now() - (stryMutAct_9fa48("27634") ? r.lastTriggered?.getTime() && 0 : stryMutAct_9fa48("27633") ? false : stryMutAct_9fa48("27632") ? true : (stryCov_9fa48("27632", "27633", "27634"), (stryMutAct_9fa48("27635") ? r.lastTriggered.getTime() : (stryCov_9fa48("27635"), r.lastTriggered?.getTime())) || 0)))) / 3600000))}h ago • {r.triggerCount} total
                      </div>
                    </div>)))}
                </div>
              </div>
            </div>
          </div>)}

        {stryMutAct_9fa48("27638") ? activeTab === 'decisions' || <div className="space-y-4">
            {pendingDecisions.length === 0 ? <div className="text-center py-16">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold mb-2">All Caught Up!</h2>
                <p className="text-white/60">No pending decisions require your attention.</p>
              </div> : pendingDecisions.map(d => <div key={d.id} onClick={() => setSelectedDecision(d)} className={`bg-black/30 rounded-2xl p-6 border cursor-pointer transition-all hover:scale-[1.01] ${d.priority === 'critical' ? 'border-red-700/50 hover:border-red-500' : d.priority === 'high' ? 'border-amber-700/50 hover:border-amber-500' : 'border-amber-800/50 hover:border-amber-600'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${CATEGORY_CONFIG[d.category].color} flex items-center justify-center text-2xl`}>
                        {CATEGORY_CONFIG[d.category].icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{d.title}</h3>
                        <div className="text-sm text-white/50">{CATEGORY_CONFIG[d.category].name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-lg text-sm ${d.priority === 'critical' ? 'bg-red-600' : d.priority === 'high' ? 'bg-amber-600' : d.priority === 'medium' ? 'bg-blue-600' : 'bg-neutral-600'}`}>
                        {d.priority.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-lg text-sm ${d.automationLevel === 'full-auto' ? 'bg-green-900 text-green-300' : d.automationLevel === 'semi-auto' ? 'bg-amber-900 text-amber-300' : 'bg-blue-900 text-blue-300'}`}>
                        {d.automationLevel}
                      </span>
                    </div>
                  </div>

                  <p className="text-white/70 mb-4">{d.description}</p>

                  <div className="p-4 bg-amber-900/20 rounded-xl border border-amber-700/30 mb-4">
                    <div className="text-xs text-amber-400 uppercase tracking-wider mb-1">Recommendation</div>
                    <p className="font-medium">{d.recommendation}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {d.impact.slice(0, 3).map((imp, idx) => <div key={idx} className="text-center p-3 bg-black/20 rounded-xl">
                        <div className={`text-xl font-bold ${imp.projectedChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {imp.projectedChange > 0 ? '+' : ''}{imp.projectedChange}{imp.unit}
                        </div>
                        <div className="text-xs text-white/50">{imp.metric}</div>
                        <div className="text-xs text-white/30">{imp.confidence}% confidence</div>
                      </div>)}
                  </div>
                </div>)}
          </div> : stryMutAct_9fa48("27637") ? false : stryMutAct_9fa48("27636") ? true : (stryCov_9fa48("27636", "27637", "27638"), (stryMutAct_9fa48("27640") ? activeTab !== 'decisions' : stryMutAct_9fa48("27639") ? true : (stryCov_9fa48("27639", "27640"), activeTab === 'decisions')) && <div className="space-y-4">
            {(stryMutAct_9fa48("27644") ? pendingDecisions.length !== 0 : stryMutAct_9fa48("27643") ? false : stryMutAct_9fa48("27642") ? true : (stryCov_9fa48("27642", "27643", "27644"), pendingDecisions.length === 0)) ? <div className="text-center py-16">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold mb-2">All Caught Up!</h2>
                <p className="text-white/60">No pending decisions require your attention.</p>
              </div> : pendingDecisions.map(stryMutAct_9fa48("27645") ? () => undefined : (stryCov_9fa48("27645"), d => <div key={d.id} onClick={stryMutAct_9fa48("27646") ? () => undefined : (stryCov_9fa48("27646"), () => setSelectedDecision(d))} className={`bg-black/30 rounded-2xl p-6 border cursor-pointer transition-all hover:scale-[1.01] ${(stryMutAct_9fa48("27650") ? d.priority !== 'critical' : stryMutAct_9fa48("27649") ? false : stryMutAct_9fa48("27648") ? true : (stryCov_9fa48("27648", "27649", "27650"), d.priority === 'critical')) ? 'border-red-700/50 hover:border-red-500' : (stryMutAct_9fa48("27655") ? d.priority !== 'high' : stryMutAct_9fa48("27654") ? false : stryMutAct_9fa48("27653") ? true : (stryCov_9fa48("27653", "27654", "27655"), d.priority === 'high')) ? 'border-amber-700/50 hover:border-amber-500' : 'border-amber-800/50 hover:border-amber-600'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${CATEGORY_CONFIG[d.category].color} flex items-center justify-center text-2xl`}>
                        {CATEGORY_CONFIG[d.category].icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{d.title}</h3>
                        <div className="text-sm text-white/50">{CATEGORY_CONFIG[d.category].name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-lg text-sm ${(stryMutAct_9fa48("27663") ? d.priority !== 'critical' : stryMutAct_9fa48("27662") ? false : stryMutAct_9fa48("27661") ? true : (stryCov_9fa48("27661", "27662", "27663"), d.priority === 'critical')) ? 'bg-red-600' : (stryMutAct_9fa48("27668") ? d.priority !== 'high' : stryMutAct_9fa48("27667") ? false : stryMutAct_9fa48("27666") ? true : (stryCov_9fa48("27666", "27667", "27668"), d.priority === 'high')) ? 'bg-amber-600' : (stryMutAct_9fa48("27673") ? d.priority !== 'medium' : stryMutAct_9fa48("27672") ? false : stryMutAct_9fa48("27671") ? true : (stryCov_9fa48("27671", "27672", "27673"), d.priority === 'medium')) ? 'bg-blue-600' : 'bg-neutral-600'}`}>
                        {stryMutAct_9fa48("27677") ? d.priority.toLowerCase() : (stryCov_9fa48("27677"), d.priority.toUpperCase())}
                      </span>
                      <span className={`px-3 py-1 rounded-lg text-sm ${(stryMutAct_9fa48("27681") ? d.automationLevel !== 'full-auto' : stryMutAct_9fa48("27680") ? false : stryMutAct_9fa48("27679") ? true : (stryCov_9fa48("27679", "27680", "27681"), d.automationLevel === 'full-auto')) ? 'bg-green-900 text-green-300' : (stryMutAct_9fa48("27686") ? d.automationLevel !== 'semi-auto' : stryMutAct_9fa48("27685") ? false : stryMutAct_9fa48("27684") ? true : (stryCov_9fa48("27684", "27685", "27686"), d.automationLevel === 'semi-auto')) ? 'bg-amber-900 text-amber-300' : 'bg-blue-900 text-blue-300'}`}>
                        {d.automationLevel}
                      </span>
                    </div>
                  </div>

                  <p className="text-white/70 mb-4">{d.description}</p>

                  <div className="p-4 bg-amber-900/20 rounded-xl border border-amber-700/30 mb-4">
                    <div className="text-xs text-amber-400 uppercase tracking-wider mb-1">Recommendation</div>
                    <p className="font-medium">{d.recommendation}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {stryMutAct_9fa48("27690") ? d.impact.map((imp, idx) => <div key={idx} className="text-center p-3 bg-black/20 rounded-xl">
                        <div className={`text-xl font-bold ${imp.projectedChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {imp.projectedChange > 0 ? '+' : ''}{imp.projectedChange}{imp.unit}
                        </div>
                        <div className="text-xs text-white/50">{imp.metric}</div>
                        <div className="text-xs text-white/30">{imp.confidence}% confidence</div>
                      </div>) : (stryCov_9fa48("27690"), d.impact.slice(0, 3).map(stryMutAct_9fa48("27691") ? () => undefined : (stryCov_9fa48("27691"), (imp, idx) => <div key={idx} className="text-center p-3 bg-black/20 rounded-xl">
                        <div className={`text-xl font-bold ${(stryMutAct_9fa48("27696") ? imp.projectedChange <= 0 : stryMutAct_9fa48("27695") ? imp.projectedChange >= 0 : stryMutAct_9fa48("27694") ? false : stryMutAct_9fa48("27693") ? true : (stryCov_9fa48("27693", "27694", "27695", "27696"), imp.projectedChange > 0)) ? 'text-green-400' : 'text-red-400'}`}>
                          {(stryMutAct_9fa48("27702") ? imp.projectedChange <= 0 : stryMutAct_9fa48("27701") ? imp.projectedChange >= 0 : stryMutAct_9fa48("27700") ? false : stryMutAct_9fa48("27699") ? true : (stryCov_9fa48("27699", "27700", "27701", "27702"), imp.projectedChange > 0)) ? '+' : ''}{imp.projectedChange}{imp.unit}
                        </div>
                        <div className="text-xs text-white/50">{imp.metric}</div>
                        <div className="text-xs text-white/30">{imp.confidence}% confidence</div>
                      </div>)))}
                  </div>
                </div>))}
          </div>)}

        {stryMutAct_9fa48("27707") ? activeTab === 'rules' || <div className="space-y-4">
            {automationRules.map(rule => <div key={rule.id} className="bg-black/30 rounded-2xl p-6 border border-amber-800/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{CATEGORY_CONFIG[rule.category].icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold">{rule.name}</h3>
                      <p className="text-sm text-white/50">{rule.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-lg text-sm ${rule.automationLevel === 'full-auto' ? 'bg-green-900 text-green-300' : rule.automationLevel === 'semi-auto' ? 'bg-amber-900 text-amber-300' : rule.automationLevel === 'approval-required' ? 'bg-blue-900 text-blue-300' : 'bg-neutral-800 text-neutral-300'}`}>
                      {rule.automationLevel}
                    </span>
                    <button className={`w-12 h-6 rounded-full transition-colors ${rule.enabled ? 'bg-green-600' : 'bg-neutral-700'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white mx-1 transition-transform ${rule.enabled ? 'translate-x-6' : ''}`} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-black/20 rounded-xl">
                    <div className="text-xs text-white/50 mb-2">Triggers</div>
                    <div className="space-y-1">
                      {rule.triggers.map((t, idx) => <div key={idx} className="text-sm font-mono">
                          {t.metric} {t.operator} {t.value}
                        </div>)}
                    </div>
                  </div>
                  <div className="p-3 bg-black/20 rounded-xl">
                    <div className="text-xs text-white/50 mb-2">Actions</div>
                    <div className="space-y-1">
                      {rule.actions.map((a, idx) => <div key={idx} className="text-sm">→ {a}</div>)}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between text-xs text-white/40 mt-4 pt-4 border-t border-amber-800/30">
                  <span>Triggered {rule.triggerCount} times</span>
                  {rule.lastTriggered && <span>Last: {Math.floor((Date.now() - rule.lastTriggered.getTime()) / 3600000)}h ago</span>}
                </div>
              </div>)}
          </div> : stryMutAct_9fa48("27706") ? false : stryMutAct_9fa48("27705") ? true : (stryCov_9fa48("27705", "27706", "27707"), (stryMutAct_9fa48("27709") ? activeTab !== 'rules' : stryMutAct_9fa48("27708") ? true : (stryCov_9fa48("27708", "27709"), activeTab === 'rules')) && <div className="space-y-4">
            {automationRules.map(stryMutAct_9fa48("27711") ? () => undefined : (stryCov_9fa48("27711"), rule => <div key={rule.id} className="bg-black/30 rounded-2xl p-6 border border-amber-800/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{CATEGORY_CONFIG[rule.category].icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold">{rule.name}</h3>
                      <p className="text-sm text-white/50">{rule.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-lg text-sm ${(stryMutAct_9fa48("27715") ? rule.automationLevel !== 'full-auto' : stryMutAct_9fa48("27714") ? false : stryMutAct_9fa48("27713") ? true : (stryCov_9fa48("27713", "27714", "27715"), rule.automationLevel === 'full-auto')) ? 'bg-green-900 text-green-300' : (stryMutAct_9fa48("27720") ? rule.automationLevel !== 'semi-auto' : stryMutAct_9fa48("27719") ? false : stryMutAct_9fa48("27718") ? true : (stryCov_9fa48("27718", "27719", "27720"), rule.automationLevel === 'semi-auto')) ? 'bg-amber-900 text-amber-300' : (stryMutAct_9fa48("27725") ? rule.automationLevel !== 'approval-required' : stryMutAct_9fa48("27724") ? false : stryMutAct_9fa48("27723") ? true : (stryCov_9fa48("27723", "27724", "27725"), rule.automationLevel === 'approval-required')) ? 'bg-blue-900 text-blue-300' : 'bg-neutral-800 text-neutral-300'}`}>
                      {rule.automationLevel}
                    </span>
                    <button className={`w-12 h-6 rounded-full transition-colors ${rule.enabled ? 'bg-green-600' : 'bg-neutral-700'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white mx-1 transition-transform ${rule.enabled ? 'translate-x-6' : ''}`} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-black/20 rounded-xl">
                    <div className="text-xs text-white/50 mb-2">Triggers</div>
                    <div className="space-y-1">
                      {rule.triggers.map(stryMutAct_9fa48("27735") ? () => undefined : (stryCov_9fa48("27735"), (t, idx) => <div key={idx} className="text-sm font-mono">
                          {t.metric} {t.operator} {t.value}
                        </div>))}
                    </div>
                  </div>
                  <div className="p-3 bg-black/20 rounded-xl">
                    <div className="text-xs text-white/50 mb-2">Actions</div>
                    <div className="space-y-1">
                      {rule.actions.map(stryMutAct_9fa48("27736") ? () => undefined : (stryCov_9fa48("27736"), (a, idx) => <div key={idx} className="text-sm">→ {a}</div>))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between text-xs text-white/40 mt-4 pt-4 border-t border-amber-800/30">
                  <span>Triggered {rule.triggerCount} times</span>
                  {stryMutAct_9fa48("27739") ? rule.lastTriggered || <span>Last: {Math.floor((Date.now() - rule.lastTriggered.getTime()) / 3600000)}h ago</span> : stryMutAct_9fa48("27738") ? false : stryMutAct_9fa48("27737") ? true : (stryCov_9fa48("27737", "27738", "27739"), rule.lastTriggered && <span>Last: {Math.floor(stryMutAct_9fa48("27740") ? (Date.now() - rule.lastTriggered.getTime()) * 3600000 : (stryCov_9fa48("27740"), (stryMutAct_9fa48("27741") ? Date.now() + rule.lastTriggered.getTime() : (stryCov_9fa48("27741"), Date.now() - rule.lastTriggered.getTime())) / 3600000))}h ago</span>)}
                </div>
              </div>))}
          </div>)}

        {stryMutAct_9fa48("27744") ? activeTab === 'history' || <div className="space-y-4">
            {decisions.filter(d => d.status !== 'pending').map(d => <div key={d.id} className={`bg-black/30 rounded-2xl p-6 border ${d.status === 'approved' ? 'border-green-800/50' : d.status === 'auto-executed' ? 'border-blue-800/50' : d.status === 'rejected' ? 'border-red-800/50' : 'border-amber-800/50'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{CATEGORY_CONFIG[d.category].icon}</span>
                    <div>
                      <h3 className="font-semibold">{d.title}</h3>
                      <p className="text-sm text-white/50">{d.recommendation}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-lg text-sm ${d.status === 'approved' ? 'bg-green-600' : d.status === 'auto-executed' ? 'bg-blue-600' : d.status === 'rejected' ? 'bg-red-600' : 'bg-amber-600'}`}>
                      {d.status}
                    </span>
                    <div className="text-xs text-white/40 mt-1">
                      {d.approvedAt?.toLocaleDateString() || d.executedAt?.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>)}
          </div> : stryMutAct_9fa48("27743") ? false : stryMutAct_9fa48("27742") ? true : (stryCov_9fa48("27742", "27743", "27744"), (stryMutAct_9fa48("27746") ? activeTab !== 'history' : stryMutAct_9fa48("27745") ? true : (stryCov_9fa48("27745", "27746"), activeTab === 'history')) && <div className="space-y-4">
            {stryMutAct_9fa48("27748") ? decisions.map(d => <div key={d.id} className={`bg-black/30 rounded-2xl p-6 border ${d.status === 'approved' ? 'border-green-800/50' : d.status === 'auto-executed' ? 'border-blue-800/50' : d.status === 'rejected' ? 'border-red-800/50' : 'border-amber-800/50'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{CATEGORY_CONFIG[d.category].icon}</span>
                    <div>
                      <h3 className="font-semibold">{d.title}</h3>
                      <p className="text-sm text-white/50">{d.recommendation}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-lg text-sm ${d.status === 'approved' ? 'bg-green-600' : d.status === 'auto-executed' ? 'bg-blue-600' : d.status === 'rejected' ? 'bg-red-600' : 'bg-amber-600'}`}>
                      {d.status}
                    </span>
                    <div className="text-xs text-white/40 mt-1">
                      {d.approvedAt?.toLocaleDateString() || d.executedAt?.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>) : (stryCov_9fa48("27748"), decisions.filter(stryMutAct_9fa48("27749") ? () => undefined : (stryCov_9fa48("27749"), d => stryMutAct_9fa48("27752") ? d.status === 'pending' : stryMutAct_9fa48("27751") ? false : stryMutAct_9fa48("27750") ? true : (stryCov_9fa48("27750", "27751", "27752"), d.status !== 'pending'))).map(stryMutAct_9fa48("27754") ? () => undefined : (stryCov_9fa48("27754"), d => <div key={d.id} className={`bg-black/30 rounded-2xl p-6 border ${(stryMutAct_9fa48("27758") ? d.status !== 'approved' : stryMutAct_9fa48("27757") ? false : stryMutAct_9fa48("27756") ? true : (stryCov_9fa48("27756", "27757", "27758"), d.status === 'approved')) ? 'border-green-800/50' : (stryMutAct_9fa48("27763") ? d.status !== 'auto-executed' : stryMutAct_9fa48("27762") ? false : stryMutAct_9fa48("27761") ? true : (stryCov_9fa48("27761", "27762", "27763"), d.status === 'auto-executed')) ? 'border-blue-800/50' : (stryMutAct_9fa48("27768") ? d.status !== 'rejected' : stryMutAct_9fa48("27767") ? false : stryMutAct_9fa48("27766") ? true : (stryCov_9fa48("27766", "27767", "27768"), d.status === 'rejected')) ? 'border-red-800/50' : 'border-amber-800/50'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{CATEGORY_CONFIG[d.category].icon}</span>
                    <div>
                      <h3 className="font-semibold">{d.title}</h3>
                      <p className="text-sm text-white/50">{d.recommendation}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-lg text-sm ${(stryMutAct_9fa48("27775") ? d.status !== 'approved' : stryMutAct_9fa48("27774") ? false : stryMutAct_9fa48("27773") ? true : (stryCov_9fa48("27773", "27774", "27775"), d.status === 'approved')) ? 'bg-green-600' : (stryMutAct_9fa48("27780") ? d.status !== 'auto-executed' : stryMutAct_9fa48("27779") ? false : stryMutAct_9fa48("27778") ? true : (stryCov_9fa48("27778", "27779", "27780"), d.status === 'auto-executed')) ? 'bg-blue-600' : (stryMutAct_9fa48("27785") ? d.status !== 'rejected' : stryMutAct_9fa48("27784") ? false : stryMutAct_9fa48("27783") ? true : (stryCov_9fa48("27783", "27784", "27785"), d.status === 'rejected')) ? 'bg-red-600' : 'bg-amber-600'}`}>
                      {d.status}
                    </span>
                    <div className="text-xs text-white/40 mt-1">
                      {stryMutAct_9fa48("27791") ? d.approvedAt?.toLocaleDateString() && d.executedAt?.toLocaleDateString() : stryMutAct_9fa48("27790") ? false : stryMutAct_9fa48("27789") ? true : (stryCov_9fa48("27789", "27790", "27791"), (stryMutAct_9fa48("27792") ? d.approvedAt.toLocaleDateString() : (stryCov_9fa48("27792"), d.approvedAt?.toLocaleDateString())) || (stryMutAct_9fa48("27793") ? d.executedAt.toLocaleDateString() : (stryCov_9fa48("27793"), d.executedAt?.toLocaleDateString())))}
                    </div>
                  </div>
                </div>
              </div>)))}
          </div>)}
      </main>

      {/* Decision Detail Modal */}
      {stryMutAct_9fa48("27796") ? selectedDecision || <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 rounded-2xl border border-amber-700/50 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className={`p-6 bg-gradient-to-r ${CATEGORY_CONFIG[selectedDecision.category].color}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{CATEGORY_CONFIG[selectedDecision.category].icon}</span>
                  <div>
                    <h2 className="text-xl font-bold">{selectedDecision.title}</h2>
                    <p className="text-white/80">{CATEGORY_CONFIG[selectedDecision.category].name}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedDecision(null)} className="text-white/60 hover:text-white text-2xl">×</button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <p className="text-white/80">{selectedDecision.description}</p>

              <div className="p-4 bg-amber-900/30 rounded-xl border border-amber-700/30">
                <div className="text-xs text-amber-400 uppercase tracking-wider mb-2">AI Recommendation</div>
                <p className="font-semibold text-lg">{selectedDecision.recommendation}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Projected Impact</h4>
                <div className="grid grid-cols-3 gap-3">
                  {selectedDecision.impact.map((imp, idx) => <div key={idx} className="p-4 bg-black/30 rounded-xl text-center">
                      <div className={`text-2xl font-bold ${imp.projectedChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {imp.projectedChange > 0 ? '+' : ''}{imp.projectedChange}{imp.unit}
                      </div>
                      <div className="text-sm text-white/60">{imp.metric}</div>
                      <div className="text-xs text-white/40">{imp.confidence}% confidence</div>
                    </div>)}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">AI Reasoning</h4>
                <p className="text-sm text-white/70 p-4 bg-black/30 rounded-xl">{selectedDecision.aiReasoning}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Supporting Data</h4>
                <div className="space-y-2">
                  {selectedDecision.supportingData.map((data, idx) => <div key={idx} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                      <span className="text-sm text-white/50">{data.source}</span>
                      <span className="font-medium">{data.value}</span>
                    </div>)}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Risks</h4>
                <div className="space-y-2">
                  {selectedDecision.risks.map((risk, idx) => <div key={idx} className="p-3 bg-red-900/20 rounded-xl border border-red-700/30">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{risk.description}</span>
                        <span className="text-xs px-2 py-0.5 bg-red-600 rounded">{risk.probability}% probability</span>
                      </div>
                      <p className="text-sm text-white/60">Mitigation: {risk.mitigation}</p>
                    </div>)}
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-neutral-800">
                <button onClick={() => handleApprove(selectedDecision.id)} className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-semibold hover:opacity-90 transition-all">
                  ✅ Approve & Execute
                </button>
                <button onClick={() => handleReject(selectedDecision.id)} className="flex-1 py-3 bg-gradient-to-r from-red-600 to-rose-600 rounded-xl font-semibold hover:opacity-90 transition-all">
                  ❌ Reject
                </button>
              </div>
            </div>
          </div>
        </div> : stryMutAct_9fa48("27795") ? false : stryMutAct_9fa48("27794") ? true : (stryCov_9fa48("27794", "27795", "27796"), selectedDecision && <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 rounded-2xl border border-amber-700/50 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className={`p-6 bg-gradient-to-r ${CATEGORY_CONFIG[selectedDecision.category].color}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{CATEGORY_CONFIG[selectedDecision.category].icon}</span>
                  <div>
                    <h2 className="text-xl font-bold">{selectedDecision.title}</h2>
                    <p className="text-white/80">{CATEGORY_CONFIG[selectedDecision.category].name}</p>
                  </div>
                </div>
                <button onClick={stryMutAct_9fa48("27798") ? () => undefined : (stryCov_9fa48("27798"), () => setSelectedDecision(null))} className="text-white/60 hover:text-white text-2xl">×</button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <p className="text-white/80">{selectedDecision.description}</p>

              <div className="p-4 bg-amber-900/30 rounded-xl border border-amber-700/30">
                <div className="text-xs text-amber-400 uppercase tracking-wider mb-2">AI Recommendation</div>
                <p className="font-semibold text-lg">{selectedDecision.recommendation}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Projected Impact</h4>
                <div className="grid grid-cols-3 gap-3">
                  {selectedDecision.impact.map(stryMutAct_9fa48("27799") ? () => undefined : (stryCov_9fa48("27799"), (imp, idx) => <div key={idx} className="p-4 bg-black/30 rounded-xl text-center">
                      <div className={`text-2xl font-bold ${(stryMutAct_9fa48("27804") ? imp.projectedChange <= 0 : stryMutAct_9fa48("27803") ? imp.projectedChange >= 0 : stryMutAct_9fa48("27802") ? false : stryMutAct_9fa48("27801") ? true : (stryCov_9fa48("27801", "27802", "27803", "27804"), imp.projectedChange > 0)) ? 'text-green-400' : 'text-red-400'}`}>
                        {(stryMutAct_9fa48("27810") ? imp.projectedChange <= 0 : stryMutAct_9fa48("27809") ? imp.projectedChange >= 0 : stryMutAct_9fa48("27808") ? false : stryMutAct_9fa48("27807") ? true : (stryCov_9fa48("27807", "27808", "27809", "27810"), imp.projectedChange > 0)) ? '+' : ''}{imp.projectedChange}{imp.unit}
                      </div>
                      <div className="text-sm text-white/60">{imp.metric}</div>
                      <div className="text-xs text-white/40">{imp.confidence}% confidence</div>
                    </div>))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">AI Reasoning</h4>
                <p className="text-sm text-white/70 p-4 bg-black/30 rounded-xl">{selectedDecision.aiReasoning}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Supporting Data</h4>
                <div className="space-y-2">
                  {selectedDecision.supportingData.map(stryMutAct_9fa48("27813") ? () => undefined : (stryCov_9fa48("27813"), (data, idx) => <div key={idx} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                      <span className="text-sm text-white/50">{data.source}</span>
                      <span className="font-medium">{data.value}</span>
                    </div>))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Risks</h4>
                <div className="space-y-2">
                  {selectedDecision.risks.map(stryMutAct_9fa48("27814") ? () => undefined : (stryCov_9fa48("27814"), (risk, idx) => <div key={idx} className="p-3 bg-red-900/20 rounded-xl border border-red-700/30">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{risk.description}</span>
                        <span className="text-xs px-2 py-0.5 bg-red-600 rounded">{risk.probability}% probability</span>
                      </div>
                      <p className="text-sm text-white/60">Mitigation: {risk.mitigation}</p>
                    </div>))}
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-neutral-800">
                <button onClick={stryMutAct_9fa48("27815") ? () => undefined : (stryCov_9fa48("27815"), () => handleApprove(selectedDecision.id))} className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-semibold hover:opacity-90 transition-all">
                  ✅ Approve & Execute
                </button>
                <button onClick={stryMutAct_9fa48("27816") ? () => undefined : (stryCov_9fa48("27816"), () => handleReject(selectedDecision.id))} className="flex-1 py-3 bg-gradient-to-r from-red-600 to-rose-600 rounded-xl font-semibold hover:opacity-90 transition-all">
                  ❌ Reject
                </button>
              </div>
            </div>
          </div>
        </div>)}
    </div>;
};
export default AutopilotPage;