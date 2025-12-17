// @ts-nocheck
// =============================================================================
// DATACENDIA - DECISION DNA TIMELINE
// Full lifecycle visualization for enterprise decisions
// "Black Box Flight Recorder" with step-by-step replay
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
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../../lib/utils';
import { api } from '../../../lib/api';
import { PageGuide, GUIDES } from '../../../components/PageGuide';
interface DecisionEvent {
  id: string;
  timestamp: string;
  type: 'created' | 'context_added' | 'premortem_run' | 'council_session' | 'ghost_board' | 'decision_made' | 'outcome_recorded' | 'reopened';
  title: string;
  summary: string;
  data: Record<string, any>;
  userId: string;
  agentsInvolved?: string[];
}
interface Decision {
  id: string;
  decisionId?: string; // Human-readable ID like DC-2025-0003
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  budget?: number;
  timeframe?: string;
  owner?: {
    name: string;
    role: string;
  };
  councilConfidence?: number;
  linkedWorkflows?: {
    id: string;
    name: string;
  }[];
  timeline: DecisionEvent[];
  preMortems: any[];
  councilSessions: any[];
  ghostBoardSimulations: any[];
  finalDecision?: string;
  decisionMadeAt?: string;
  outcome?: {
    actualResult: string;
    notes: string;
    lessonsLearned: string[];
  };
  auditHash?: string;
}
interface DecisionSummary {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
  riskScore?: number;
  eventCount: number;
}
const EVENT_ICONS: Record<string, string> = stryMutAct_9fa48("45076") ? {} : (stryCov_9fa48("45076"), {
  created: '🎯',
  context_added: '📝',
  premortem_run: '💀',
  council_session: '🏛️',
  ghost_board: '👻',
  decision_made: '✅',
  outcome_recorded: '📊',
  reopened: '🔄'
});
const EVENT_COLORS: Record<string, string> = stryMutAct_9fa48("45085") ? {} : (stryCov_9fa48("45085"), {
  created: 'bg-blue-500',
  context_added: 'bg-purple-500',
  premortem_run: 'bg-amber-500',
  council_session: 'bg-indigo-500',
  ghost_board: 'bg-pink-500',
  decision_made: 'bg-green-500',
  outcome_recorded: 'bg-teal-500',
  reopened: 'bg-orange-500'
});
const STATUS_COLORS: Record<string, string> = stryMutAct_9fa48("45094") ? {} : (stryCov_9fa48("45094"), {
  draft: 'bg-gray-500',
  analyzing: 'bg-amber-500',
  deliberating: 'bg-indigo-500',
  decided: 'bg-green-500',
  implemented: 'bg-teal-500',
  closed: 'bg-neutral-500'
});

// Sample decisions to demonstrate the feature
const SAMPLE_DECISIONS: DecisionSummary[] = stryMutAct_9fa48("45101") ? [] : (stryCov_9fa48("45101"), [stryMutAct_9fa48("45102") ? {} : (stryCov_9fa48("45102"), {
  id: 'sample-1',
  title: 'Q2 Market Expansion Strategy',
  status: 'decided',
  priority: 'high',
  createdAt: new Date(stryMutAct_9fa48("45107") ? Date.now() + 7 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("45107"), Date.now() - (stryMutAct_9fa48("45108") ? 7 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("45108"), (stryMutAct_9fa48("45109") ? 7 * 24 * 60 / 60 : (stryCov_9fa48("45109"), (stryMutAct_9fa48("45110") ? 7 * 24 / 60 : (stryCov_9fa48("45110"), (stryMutAct_9fa48("45111") ? 7 / 24 : (stryCov_9fa48("45111"), 7 * 24)) * 60)) * 60)) * 1000)))).toISOString(),
  riskScore: 65,
  eventCount: 8
}), stryMutAct_9fa48("45112") ? {} : (stryCov_9fa48("45112"), {
  id: 'sample-2',
  title: 'Enterprise Pricing Model Revision',
  status: 'deliberating',
  priority: 'high',
  createdAt: new Date(stryMutAct_9fa48("45117") ? Date.now() + 3 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("45117"), Date.now() - (stryMutAct_9fa48("45118") ? 3 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("45118"), (stryMutAct_9fa48("45119") ? 3 * 24 * 60 / 60 : (stryCov_9fa48("45119"), (stryMutAct_9fa48("45120") ? 3 * 24 / 60 : (stryCov_9fa48("45120"), (stryMutAct_9fa48("45121") ? 3 / 24 : (stryCov_9fa48("45121"), 3 * 24)) * 60)) * 60)) * 1000)))).toISOString(),
  riskScore: 42,
  eventCount: 5
}), stryMutAct_9fa48("45122") ? {} : (stryCov_9fa48("45122"), {
  id: 'sample-3',
  title: 'Engineering Team Restructure',
  status: 'analyzing',
  priority: 'medium',
  createdAt: new Date(stryMutAct_9fa48("45127") ? Date.now() + 1 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("45127"), Date.now() - (stryMutAct_9fa48("45128") ? 1 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("45128"), (stryMutAct_9fa48("45129") ? 1 * 24 * 60 / 60 : (stryCov_9fa48("45129"), (stryMutAct_9fa48("45130") ? 1 * 24 / 60 : (stryCov_9fa48("45130"), (stryMutAct_9fa48("45131") ? 1 / 24 : (stryCov_9fa48("45131"), 1 * 24)) * 60)) * 60)) * 1000)))).toISOString(),
  riskScore: 78,
  eventCount: 3
})]);
const SAMPLE_DECISIONS_DETAIL: Record<string, Decision> = stryMutAct_9fa48("45132") ? {} : (stryCov_9fa48("45132"), {
  'sample-1': stryMutAct_9fa48("45133") ? {} : (stryCov_9fa48("45133"), {
    id: 'sample-1',
    decisionId: 'DC-2025-0003',
    title: 'Q2 Market Expansion Strategy',
    description: 'Evaluate and decide on expanding into European markets, specifically Germany and UK, with a focus on enterprise clients.',
    status: 'decided',
    priority: 'high',
    category: 'strategy',
    createdAt: new Date(stryMutAct_9fa48("45141") ? Date.now() + 7 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("45141"), Date.now() - (stryMutAct_9fa48("45142") ? 7 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("45142"), (stryMutAct_9fa48("45143") ? 7 * 24 * 60 / 60 : (stryCov_9fa48("45143"), (stryMutAct_9fa48("45144") ? 7 * 24 / 60 : (stryCov_9fa48("45144"), (stryMutAct_9fa48("45145") ? 7 / 24 : (stryCov_9fa48("45145"), 7 * 24)) * 60)) * 60)) * 1000)))).toISOString(),
    updatedAt: new Date(stryMutAct_9fa48("45146") ? Date.now() + 1 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("45146"), Date.now() - (stryMutAct_9fa48("45147") ? 1 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("45147"), (stryMutAct_9fa48("45148") ? 1 * 24 * 60 / 60 : (stryCov_9fa48("45148"), (stryMutAct_9fa48("45149") ? 1 * 24 / 60 : (stryCov_9fa48("45149"), (stryMutAct_9fa48("45150") ? 1 / 24 : (stryCov_9fa48("45150"), 1 * 24)) * 60)) * 60)) * 1000)))).toISOString(),
    budget: 500000,
    timeframe: 'Q2 2025',
    owner: stryMutAct_9fa48("45152") ? {} : (stryCov_9fa48("45152"), {
      name: 'Jane Doe',
      role: 'CEO'
    }),
    councilConfidence: 92,
    linkedWorkflows: stryMutAct_9fa48("45155") ? [] : (stryCov_9fa48("45155"), [stryMutAct_9fa48("45156") ? {} : (stryCov_9fa48("45156"), {
      id: 'wf-1',
      name: 'EU Market Entry Checklist'
    }), stryMutAct_9fa48("45159") ? {} : (stryCov_9fa48("45159"), {
      id: 'wf-2',
      name: 'UK Entity Formation'
    }), stryMutAct_9fa48("45162") ? {} : (stryCov_9fa48("45162"), {
      id: 'wf-3',
      name: 'GDPR Compliance Review'
    })]),
    timeline: stryMutAct_9fa48("45165") ? [] : (stryCov_9fa48("45165"), [stryMutAct_9fa48("45166") ? {} : (stryCov_9fa48("45166"), {
      id: 'e1',
      timestamp: new Date(stryMutAct_9fa48("45168") ? Date.now() + 7 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("45168"), Date.now() - (stryMutAct_9fa48("45169") ? 7 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("45169"), (stryMutAct_9fa48("45170") ? 7 * 24 * 60 / 60 : (stryCov_9fa48("45170"), (stryMutAct_9fa48("45171") ? 7 * 24 / 60 : (stryCov_9fa48("45171"), (stryMutAct_9fa48("45172") ? 7 / 24 : (stryCov_9fa48("45172"), 7 * 24)) * 60)) * 60)) * 1000)))).toISOString(),
      type: 'created',
      title: 'Decision Created',
      summary: 'Strategic decision initiated by CEO',
      data: {},
      userId: 'user-1'
    }), stryMutAct_9fa48("45177") ? {} : (stryCov_9fa48("45177"), {
      id: 'e2',
      timestamp: new Date(stryMutAct_9fa48("45179") ? Date.now() + 6 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("45179"), Date.now() - (stryMutAct_9fa48("45180") ? 6 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("45180"), (stryMutAct_9fa48("45181") ? 6 * 24 * 60 / 60 : (stryCov_9fa48("45181"), (stryMutAct_9fa48("45182") ? 6 * 24 / 60 : (stryCov_9fa48("45182"), (stryMutAct_9fa48("45183") ? 6 / 24 : (stryCov_9fa48("45183"), 6 * 24)) * 60)) * 60)) * 1000)))).toISOString(),
      type: 'context_added',
      title: 'Market Research Added',
      summary: 'Added competitive analysis for EU markets',
      data: stryMutAct_9fa48("45187") ? {} : (stryCov_9fa48("45187"), {
        documents: 3
      }),
      userId: 'user-2'
    }), stryMutAct_9fa48("45189") ? {} : (stryCov_9fa48("45189"), {
      id: 'e3',
      timestamp: new Date(stryMutAct_9fa48("45191") ? Date.now() + 5 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("45191"), Date.now() - (stryMutAct_9fa48("45192") ? 5 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("45192"), (stryMutAct_9fa48("45193") ? 5 * 24 * 60 / 60 : (stryCov_9fa48("45193"), (stryMutAct_9fa48("45194") ? 5 * 24 / 60 : (stryCov_9fa48("45194"), (stryMutAct_9fa48("45195") ? 5 / 24 : (stryCov_9fa48("45195"), 5 * 24)) * 60)) * 60)) * 1000)))).toISOString(),
      type: 'premortem_run',
      title: 'Pre-Mortem Analysis',
      summary: 'Identified 12 potential failure modes, 4 high-risk',
      data: stryMutAct_9fa48("45199") ? {} : (stryCov_9fa48("45199"), {
        riskScore: 42,
        totalExposure: 1850000,
        recommendation: 'proceed',
        failureModes: stryMutAct_9fa48("45201") ? [] : (stryCov_9fa48("45201"), [stryMutAct_9fa48("45202") ? {} : (stryCov_9fa48("45202"), {
          title: 'Regulatory compliance delays',
          probability: 65,
          costImpact: 450000,
          category: 'Legal'
        }), stryMutAct_9fa48("45205") ? {} : (stryCov_9fa48("45205"), {
          title: 'Currency fluctuation impact',
          probability: 55,
          costImpact: 320000,
          category: 'Financial'
        }), stryMutAct_9fa48("45208") ? {} : (stryCov_9fa48("45208"), {
          title: 'Talent acquisition challenges',
          probability: 70,
          costImpact: 280000,
          category: 'Operations'
        }), stryMutAct_9fa48("45211") ? {} : (stryCov_9fa48("45211"), {
          title: 'Brand localization missteps',
          probability: 35,
          costImpact: 180000,
          category: 'Marketing'
        })])
      }),
      userId: 'user-1',
      agentsInvolved: stryMutAct_9fa48("45215") ? [] : (stryCov_9fa48("45215"), ['CendiaCFO', 'CendiaCRO'])
    }), stryMutAct_9fa48("45218") ? {} : (stryCov_9fa48("45218"), {
      id: 'e4',
      timestamp: new Date(stryMutAct_9fa48("45220") ? Date.now() + 4 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("45220"), Date.now() - (stryMutAct_9fa48("45221") ? 4 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("45221"), (stryMutAct_9fa48("45222") ? 4 * 24 * 60 / 60 : (stryCov_9fa48("45222"), (stryMutAct_9fa48("45223") ? 4 * 24 / 60 : (stryCov_9fa48("45223"), (stryMutAct_9fa48("45224") ? 4 / 24 : (stryCov_9fa48("45224"), 4 * 24)) * 60)) * 60)) * 1000)))).toISOString(),
      type: 'council_session',
      title: 'Council Deliberation',
      summary: 'AI Council evaluated options with 85% confidence',
      data: stryMutAct_9fa48("45228") ? {} : (stryCov_9fa48("45228"), {
        confidence: 0.85,
        recommendation: 'Proceed with UK first',
        deliberation: stryMutAct_9fa48("45230") ? [] : (stryCov_9fa48("45230"), [stryMutAct_9fa48("45231") ? {} : (stryCov_9fa48("45231"), {
          agent: 'CendiaCEO',
          stance: 'support',
          summary: 'Strategic alignment with 3-year growth plan. UK market offers lower regulatory friction than Germany.',
          confidence: 0.88
        }), stryMutAct_9fa48("45235") ? {} : (stryCov_9fa48("45235"), {
          agent: 'CendiaCFO',
          stance: 'cautious',
          summary: 'ROI projections solid but currency exposure needs hedging. Recommend phased capital deployment.',
          confidence: 0.82
        }), stryMutAct_9fa48("45239") ? {} : (stryCov_9fa48("45239"), {
          agent: 'CendiaCRO',
          stance: 'support',
          summary: 'Pipeline analysis shows 12 enterprise prospects in UK already engaged. Sales cycle ~6 months shorter than DACH.',
          confidence: 0.91
        }), stryMutAct_9fa48("45243") ? {} : (stryCov_9fa48("45243"), {
          agent: 'CendiaCMO',
          stance: 'support',
          summary: 'Brand recognition higher in UK. Existing content can be repurposed with minimal localization.',
          confidence: 0.85
        })]),
        consensus: 'Proceed with UK expansion in Q2, defer Germany to Q4 pending UK validation.',
        voteSummary: stryMutAct_9fa48("45248") ? {} : (stryCov_9fa48("45248"), {
          support: 3,
          cautious: 1,
          oppose: 0
        })
      }),
      userId: 'user-1',
      agentsInvolved: stryMutAct_9fa48("45250") ? [] : (stryCov_9fa48("45250"), ['CendiaCEO', 'CendiaCFO', 'CendiaCRO', 'CendiaCMO'])
    }), stryMutAct_9fa48("45255") ? {} : (stryCov_9fa48("45255"), {
      id: 'e5',
      timestamp: new Date(stryMutAct_9fa48("45257") ? Date.now() + 3 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("45257"), Date.now() - (stryMutAct_9fa48("45258") ? 3 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("45258"), (stryMutAct_9fa48("45259") ? 3 * 24 * 60 / 60 : (stryCov_9fa48("45259"), (stryMutAct_9fa48("45260") ? 3 * 24 / 60 : (stryCov_9fa48("45260"), (stryMutAct_9fa48("45261") ? 3 / 24 : (stryCov_9fa48("45261"), 3 * 24)) * 60)) * 60)) * 1000)))).toISOString(),
      type: 'ghost_board',
      title: 'Ghost Board Simulation',
      summary: 'Simulated board review - 3 concerns raised',
      data: stryMutAct_9fa48("45265") ? {} : (stryCov_9fa48("45265"), {
        preparednessScore: 78,
        questions: stryMutAct_9fa48("45266") ? [] : (stryCov_9fa48("45266"), [stryMutAct_9fa48("45267") ? {} : (stryCov_9fa48("45267"), {
          member: 'Board Chair',
          question: 'What is the exit strategy if UK expansion underperforms?',
          difficulty: 'hard',
          answered: stryMutAct_9fa48("45271") ? false : (stryCov_9fa48("45271"), true)
        }), stryMutAct_9fa48("45272") ? {} : (stryCov_9fa48("45272"), {
          member: 'Lead Investor',
          question: 'How does this affect our runway and next funding round?',
          difficulty: 'medium',
          answered: stryMutAct_9fa48("45276") ? false : (stryCov_9fa48("45276"), true)
        }), stryMutAct_9fa48("45277") ? {} : (stryCov_9fa48("45277"), {
          member: 'Independent Director',
          question: 'What are the regulatory risks with Brexit implications?',
          difficulty: 'hard',
          answered: stryMutAct_9fa48("45281") ? true : (stryCov_9fa48("45281"), false)
        })]),
        concerns: stryMutAct_9fa48("45282") ? [] : (stryCov_9fa48("45282"), ['Timeline aggressive', 'Currency risk', 'Talent acquisition'])
      }),
      userId: 'user-1'
    }), stryMutAct_9fa48("45287") ? {} : (stryCov_9fa48("45287"), {
      id: 'e6',
      timestamp: new Date(stryMutAct_9fa48("45289") ? Date.now() + 2 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("45289"), Date.now() - (stryMutAct_9fa48("45290") ? 2 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("45290"), (stryMutAct_9fa48("45291") ? 2 * 24 * 60 / 60 : (stryCov_9fa48("45291"), (stryMutAct_9fa48("45292") ? 2 * 24 / 60 : (stryCov_9fa48("45292"), (stryMutAct_9fa48("45293") ? 2 / 24 : (stryCov_9fa48("45293"), 2 * 24)) * 60)) * 60)) * 1000)))).toISOString(),
      type: 'context_added',
      title: 'Financial Model Updated',
      summary: 'Added 3-year projection with sensitivity analysis',
      data: stryMutAct_9fa48("45297") ? {} : (stryCov_9fa48("45297"), {
        npv: 2400000
      }),
      userId: 'user-3'
    }), stryMutAct_9fa48("45299") ? {} : (stryCov_9fa48("45299"), {
      id: 'e7',
      timestamp: new Date(stryMutAct_9fa48("45301") ? Date.now() + 1.5 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("45301"), Date.now() - (stryMutAct_9fa48("45302") ? 1.5 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("45302"), (stryMutAct_9fa48("45303") ? 1.5 * 24 * 60 / 60 : (stryCov_9fa48("45303"), (stryMutAct_9fa48("45304") ? 1.5 * 24 / 60 : (stryCov_9fa48("45304"), (stryMutAct_9fa48("45305") ? 1.5 / 24 : (stryCov_9fa48("45305"), 1.5 * 24)) * 60)) * 60)) * 1000)))).toISOString(),
      type: 'council_session',
      title: 'Final Council Review',
      summary: 'Updated recommendation with mitigations',
      data: stryMutAct_9fa48("45309") ? {} : (stryCov_9fa48("45309"), {
        confidence: 0.92,
        recommendation: 'Proceed with mitigations in place',
        deliberation: stryMutAct_9fa48("45311") ? [] : (stryCov_9fa48("45311"), [stryMutAct_9fa48("45312") ? {} : (stryCov_9fa48("45312"), {
          agent: 'CendiaCEO',
          stance: 'support',
          summary: 'Risk mitigations address key concerns. Ready to proceed with phased approach.',
          confidence: 0.94
        }), stryMutAct_9fa48("45316") ? {} : (stryCov_9fa48("45316"), {
          agent: 'CendiaCFO',
          stance: 'support',
          summary: 'Currency hedging strategy approved. Budget milestones provide adequate controls.',
          confidence: 0.90
        })]),
        consensus: 'Full approval to proceed. Mitigations validated by finance.',
        voteSummary: stryMutAct_9fa48("45321") ? {} : (stryCov_9fa48("45321"), {
          support: 2,
          cautious: 0,
          oppose: 0
        })
      }),
      userId: 'user-1',
      agentsInvolved: stryMutAct_9fa48("45323") ? [] : (stryCov_9fa48("45323"), ['CendiaCEO', 'CendiaCFO'])
    }), stryMutAct_9fa48("45326") ? {} : (stryCov_9fa48("45326"), {
      id: 'e8',
      timestamp: new Date(stryMutAct_9fa48("45328") ? Date.now() + 1 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("45328"), Date.now() - (stryMutAct_9fa48("45329") ? 1 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("45329"), (stryMutAct_9fa48("45330") ? 1 * 24 * 60 / 60 : (stryCov_9fa48("45330"), (stryMutAct_9fa48("45331") ? 1 * 24 / 60 : (stryCov_9fa48("45331"), (stryMutAct_9fa48("45332") ? 1 / 24 : (stryCov_9fa48("45332"), 1 * 24)) * 60)) * 60)) * 1000)))).toISOString(),
      type: 'decision_made',
      title: 'Decision Finalized',
      summary: 'Approved: UK expansion Q2, Germany Q4',
      data: stryMutAct_9fa48("45336") ? {} : (stryCov_9fa48("45336"), {
        approved: stryMutAct_9fa48("45337") ? false : (stryCov_9fa48("45337"), true)
      }),
      userId: 'user-1'
    })]),
    preMortems: stryMutAct_9fa48("45339") ? [] : (stryCov_9fa48("45339"), [stryMutAct_9fa48("45340") ? {} : (stryCov_9fa48("45340"), {
      id: 'pm-1',
      risks: 12,
      highRisk: 4
    })]),
    councilSessions: stryMutAct_9fa48("45342") ? [] : (stryCov_9fa48("45342"), [stryMutAct_9fa48("45343") ? {} : (stryCov_9fa48("45343"), {
      id: 'cs-1',
      confidence: 0.92
    })]),
    ghostBoardSimulations: stryMutAct_9fa48("45345") ? [] : (stryCov_9fa48("45345"), [stryMutAct_9fa48("45346") ? {} : (stryCov_9fa48("45346"), {
      id: 'gb-1',
      concerns: 3
    })]),
    finalDecision: 'Proceed with UK market expansion in Q2 2025, followed by Germany in Q4 2025. Initial investment capped at $500K with milestone-based releases.',
    decisionMadeAt: new Date(stryMutAct_9fa48("45349") ? Date.now() + 1 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("45349"), Date.now() - (stryMutAct_9fa48("45350") ? 1 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("45350"), (stryMutAct_9fa48("45351") ? 1 * 24 * 60 / 60 : (stryCov_9fa48("45351"), (stryMutAct_9fa48("45352") ? 1 * 24 / 60 : (stryCov_9fa48("45352"), (stryMutAct_9fa48("45353") ? 1 / 24 : (stryCov_9fa48("45353"), 1 * 24)) * 60)) * 60)) * 1000)))).toISOString(),
    auditHash: 'sha256:a1b2c3d4e5f6...'
  }),
  'sample-2': stryMutAct_9fa48("45355") ? {} : (stryCov_9fa48("45355"), {
    id: 'sample-2',
    title: 'Enterprise Pricing Model Revision',
    description: 'Review and update enterprise pricing tiers based on competitive analysis and customer feedback.',
    status: 'deliberating',
    priority: 'high',
    category: 'revenue',
    createdAt: new Date(stryMutAct_9fa48("45362") ? Date.now() + 3 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("45362"), Date.now() - (stryMutAct_9fa48("45363") ? 3 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("45363"), (stryMutAct_9fa48("45364") ? 3 * 24 * 60 / 60 : (stryCov_9fa48("45364"), (stryMutAct_9fa48("45365") ? 3 * 24 / 60 : (stryCov_9fa48("45365"), (stryMutAct_9fa48("45366") ? 3 / 24 : (stryCov_9fa48("45366"), 3 * 24)) * 60)) * 60)) * 1000)))).toISOString(),
    updatedAt: new Date(stryMutAct_9fa48("45367") ? Date.now() + 0.5 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("45367"), Date.now() - (stryMutAct_9fa48("45368") ? 0.5 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("45368"), (stryMutAct_9fa48("45369") ? 0.5 * 24 * 60 / 60 : (stryCov_9fa48("45369"), (stryMutAct_9fa48("45370") ? 0.5 * 24 / 60 : (stryCov_9fa48("45370"), (stryMutAct_9fa48("45371") ? 0.5 / 24 : (stryCov_9fa48("45371"), 0.5 * 24)) * 60)) * 60)) * 1000)))).toISOString(),
    budget: 0,
    timeframe: 'Q1 2025',
    timeline: stryMutAct_9fa48("45373") ? [] : (stryCov_9fa48("45373"), [stryMutAct_9fa48("45374") ? {} : (stryCov_9fa48("45374"), {
      id: 'e1',
      timestamp: new Date(stryMutAct_9fa48("45376") ? Date.now() + 3 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("45376"), Date.now() - (stryMutAct_9fa48("45377") ? 3 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("45377"), (stryMutAct_9fa48("45378") ? 3 * 24 * 60 / 60 : (stryCov_9fa48("45378"), (stryMutAct_9fa48("45379") ? 3 * 24 / 60 : (stryCov_9fa48("45379"), (stryMutAct_9fa48("45380") ? 3 / 24 : (stryCov_9fa48("45380"), 3 * 24)) * 60)) * 60)) * 1000)))).toISOString(),
      type: 'created',
      title: 'Decision Created',
      summary: 'Pricing review initiated by CRO',
      data: {},
      userId: 'user-1'
    }), stryMutAct_9fa48("45385") ? {} : (stryCov_9fa48("45385"), {
      id: 'e2',
      timestamp: new Date(stryMutAct_9fa48("45387") ? Date.now() + 2.5 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("45387"), Date.now() - (stryMutAct_9fa48("45388") ? 2.5 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("45388"), (stryMutAct_9fa48("45389") ? 2.5 * 24 * 60 / 60 : (stryCov_9fa48("45389"), (stryMutAct_9fa48("45390") ? 2.5 * 24 / 60 : (stryCov_9fa48("45390"), (stryMutAct_9fa48("45391") ? 2.5 / 24 : (stryCov_9fa48("45391"), 2.5 * 24)) * 60)) * 60)) * 1000)))).toISOString(),
      type: 'context_added',
      title: 'Competitive Analysis',
      summary: 'Added pricing benchmarks from 8 competitors',
      data: stryMutAct_9fa48("45395") ? {} : (stryCov_9fa48("45395"), {
        competitors: 8
      }),
      userId: 'user-2'
    }), stryMutAct_9fa48("45397") ? {} : (stryCov_9fa48("45397"), {
      id: 'e3',
      timestamp: new Date(stryMutAct_9fa48("45399") ? Date.now() + 2 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("45399"), Date.now() - (stryMutAct_9fa48("45400") ? 2 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("45400"), (stryMutAct_9fa48("45401") ? 2 * 24 * 60 / 60 : (stryCov_9fa48("45401"), (stryMutAct_9fa48("45402") ? 2 * 24 / 60 : (stryCov_9fa48("45402"), (stryMutAct_9fa48("45403") ? 2 / 24 : (stryCov_9fa48("45403"), 2 * 24)) * 60)) * 60)) * 1000)))).toISOString(),
      type: 'premortem_run',
      title: 'Pre-Mortem Analysis',
      summary: 'Identified churn risk with aggressive pricing',
      data: stryMutAct_9fa48("45407") ? {} : (stryCov_9fa48("45407"), {
        risks: 8,
        highRisk: 2
      }),
      userId: 'user-1',
      agentsInvolved: stryMutAct_9fa48("45409") ? [] : (stryCov_9fa48("45409"), ['CendiaCFO', 'CendiaCRO'])
    }), stryMutAct_9fa48("45412") ? {} : (stryCov_9fa48("45412"), {
      id: 'e4',
      timestamp: new Date(stryMutAct_9fa48("45414") ? Date.now() + 1 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("45414"), Date.now() - (stryMutAct_9fa48("45415") ? 1 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("45415"), (stryMutAct_9fa48("45416") ? 1 * 24 * 60 / 60 : (stryCov_9fa48("45416"), (stryMutAct_9fa48("45417") ? 1 * 24 / 60 : (stryCov_9fa48("45417"), (stryMutAct_9fa48("45418") ? 1 / 24 : (stryCov_9fa48("45418"), 1 * 24)) * 60)) * 60)) * 1000)))).toISOString(),
      type: 'council_session',
      title: 'Council Deliberation',
      summary: 'AI Council analyzing pricing options',
      data: stryMutAct_9fa48("45422") ? {} : (stryCov_9fa48("45422"), {
        confidence: 0.72,
        recommendation: 'Implement value-based pricing',
        deliberation: stryMutAct_9fa48("45424") ? [] : (stryCov_9fa48("45424"), [stryMutAct_9fa48("45425") ? {} : (stryCov_9fa48("45425"), {
          agent: 'CendiaCFO',
          stance: 'support',
          summary: 'Value-based model aligns with enterprise expectations. 15% margin improvement projected.',
          confidence: 0.78
        }), stryMutAct_9fa48("45429") ? {} : (stryCov_9fa48("45429"), {
          agent: 'CendiaCRO',
          stance: 'cautious',
          summary: 'Concerned about mid-market churn. Suggest grandfather clause for existing customers.',
          confidence: 0.68
        }), stryMutAct_9fa48("45433") ? {} : (stryCov_9fa48("45433"), {
          agent: 'CendiaCMO',
          stance: 'support',
          summary: 'Premium positioning strengthens brand. Competitors moving same direction.',
          confidence: 0.75
        }), stryMutAct_9fa48("45437") ? {} : (stryCov_9fa48("45437"), {
          agent: 'CendiaChro',
          stance: 'cautious',
          summary: 'Sales team needs training on value selling. 30-day ramp period recommended.',
          confidence: 0.65
        })]),
        consensus: 'Proceed with value-based pricing but include transition support for existing customers.',
        voteSummary: stryMutAct_9fa48("45442") ? {} : (stryCov_9fa48("45442"), {
          support: 2,
          cautious: 2,
          oppose: 0
        })
      }),
      userId: 'user-1',
      agentsInvolved: stryMutAct_9fa48("45444") ? [] : (stryCov_9fa48("45444"), ['CendiaCFO', 'CendiaCRO', 'CendiaCMO', 'CendiaChro'])
    }), stryMutAct_9fa48("45449") ? {} : (stryCov_9fa48("45449"), {
      id: 'e5',
      timestamp: new Date(stryMutAct_9fa48("45451") ? Date.now() + 0.5 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("45451"), Date.now() - (stryMutAct_9fa48("45452") ? 0.5 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("45452"), (stryMutAct_9fa48("45453") ? 0.5 * 24 * 60 / 60 : (stryCov_9fa48("45453"), (stryMutAct_9fa48("45454") ? 0.5 * 24 / 60 : (stryCov_9fa48("45454"), (stryMutAct_9fa48("45455") ? 0.5 / 24 : (stryCov_9fa48("45455"), 0.5 * 24)) * 60)) * 60)) * 1000)))).toISOString(),
      type: 'context_added',
      title: 'Customer Survey Results',
      summary: 'Added feedback from 50 enterprise customers',
      data: stryMutAct_9fa48("45459") ? {} : (stryCov_9fa48("45459"), {
        responses: 50,
        satisfaction: 0.72
      }),
      userId: 'user-3'
    })]),
    preMortems: stryMutAct_9fa48("45461") ? [] : (stryCov_9fa48("45461"), [stryMutAct_9fa48("45462") ? {} : (stryCov_9fa48("45462"), {
      id: 'pm-1',
      risks: 8,
      highRisk: 2
    })]),
    councilSessions: stryMutAct_9fa48("45464") ? [] : (stryCov_9fa48("45464"), [stryMutAct_9fa48("45465") ? {} : (stryCov_9fa48("45465"), {
      id: 'cs-1',
      confidence: 0.72
    })]),
    ghostBoardSimulations: stryMutAct_9fa48("45467") ? ["Stryker was here"] : (stryCov_9fa48("45467"), []),
    auditHash: 'sha256:b2c3d4e5f6g7...'
  }),
  'sample-3': stryMutAct_9fa48("45469") ? {} : (stryCov_9fa48("45469"), {
    id: 'sample-3',
    title: 'Engineering Team Restructure',
    description: 'Evaluate restructuring engineering into product-aligned squads vs current functional teams.',
    status: 'analyzing',
    priority: 'medium',
    category: 'operations',
    createdAt: new Date(stryMutAct_9fa48("45476") ? Date.now() + 1 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("45476"), Date.now() - (stryMutAct_9fa48("45477") ? 1 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("45477"), (stryMutAct_9fa48("45478") ? 1 * 24 * 60 / 60 : (stryCov_9fa48("45478"), (stryMutAct_9fa48("45479") ? 1 * 24 / 60 : (stryCov_9fa48("45479"), (stryMutAct_9fa48("45480") ? 1 / 24 : (stryCov_9fa48("45480"), 1 * 24)) * 60)) * 60)) * 1000)))).toISOString(),
    updatedAt: new Date(stryMutAct_9fa48("45481") ? Date.now() + 0.2 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("45481"), Date.now() - (stryMutAct_9fa48("45482") ? 0.2 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("45482"), (stryMutAct_9fa48("45483") ? 0.2 * 24 * 60 / 60 : (stryCov_9fa48("45483"), (stryMutAct_9fa48("45484") ? 0.2 * 24 / 60 : (stryCov_9fa48("45484"), (stryMutAct_9fa48("45485") ? 0.2 / 24 : (stryCov_9fa48("45485"), 0.2 * 24)) * 60)) * 60)) * 1000)))).toISOString(),
    budget: 50000,
    timeframe: 'Q1 2025',
    timeline: stryMutAct_9fa48("45487") ? [] : (stryCov_9fa48("45487"), [stryMutAct_9fa48("45488") ? {} : (stryCov_9fa48("45488"), {
      id: 'e1',
      timestamp: new Date(stryMutAct_9fa48("45490") ? Date.now() + 1 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("45490"), Date.now() - (stryMutAct_9fa48("45491") ? 1 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("45491"), (stryMutAct_9fa48("45492") ? 1 * 24 * 60 / 60 : (stryCov_9fa48("45492"), (stryMutAct_9fa48("45493") ? 1 * 24 / 60 : (stryCov_9fa48("45493"), (stryMutAct_9fa48("45494") ? 1 / 24 : (stryCov_9fa48("45494"), 1 * 24)) * 60)) * 60)) * 1000)))).toISOString(),
      type: 'created',
      title: 'Decision Created',
      summary: 'Restructure proposal from VP Engineering',
      data: {},
      userId: 'user-1'
    }), stryMutAct_9fa48("45499") ? {} : (stryCov_9fa48("45499"), {
      id: 'e2',
      timestamp: new Date(stryMutAct_9fa48("45501") ? Date.now() + 0.5 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("45501"), Date.now() - (stryMutAct_9fa48("45502") ? 0.5 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("45502"), (stryMutAct_9fa48("45503") ? 0.5 * 24 * 60 / 60 : (stryCov_9fa48("45503"), (stryMutAct_9fa48("45504") ? 0.5 * 24 / 60 : (stryCov_9fa48("45504"), (stryMutAct_9fa48("45505") ? 0.5 / 24 : (stryCov_9fa48("45505"), 0.5 * 24)) * 60)) * 60)) * 1000)))).toISOString(),
      type: 'context_added',
      title: 'Current State Analysis',
      summary: 'Documented existing team structure and dependencies',
      data: stryMutAct_9fa48("45509") ? {} : (stryCov_9fa48("45509"), {
        teams: 6,
        engineers: 42
      }),
      userId: 'user-2'
    }), stryMutAct_9fa48("45511") ? {} : (stryCov_9fa48("45511"), {
      id: 'e3',
      timestamp: new Date(stryMutAct_9fa48("45513") ? Date.now() + 0.2 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("45513"), Date.now() - (stryMutAct_9fa48("45514") ? 0.2 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("45514"), (stryMutAct_9fa48("45515") ? 0.2 * 24 * 60 / 60 : (stryCov_9fa48("45515"), (stryMutAct_9fa48("45516") ? 0.2 * 24 / 60 : (stryCov_9fa48("45516"), (stryMutAct_9fa48("45517") ? 0.2 / 24 : (stryCov_9fa48("45517"), 0.2 * 24)) * 60)) * 60)) * 1000)))).toISOString(),
      type: 'council_session',
      title: 'Initial Council Review',
      summary: 'AI Council providing initial assessment',
      data: stryMutAct_9fa48("45521") ? {} : (stryCov_9fa48("45521"), {
        confidence: 0.58,
        recommendation: 'More analysis needed',
        deliberation: stryMutAct_9fa48("45523") ? [] : (stryCov_9fa48("45523"), [stryMutAct_9fa48("45524") ? {} : (stryCov_9fa48("45524"), {
          agent: 'CendiaCEO',
          stance: 'cautious',
          summary: 'Timing concern - Q1 is critical for product launches. Consider Q2 implementation.',
          confidence: 0.55
        }), stryMutAct_9fa48("45528") ? {} : (stryCov_9fa48("45528"), {
          agent: 'CendiaChro',
          stance: 'support',
          summary: 'Squad model improves ownership and reduces handoffs. Similar transitions successful at peer companies.',
          confidence: 0.72
        }), stryMutAct_9fa48("45532") ? {} : (stryCov_9fa48("45532"), {
          agent: 'CendiaCTO',
          stance: 'support',
          summary: 'Technical debt reduction will accelerate with product-aligned ownership. Recommend pilot with Platform team.',
          confidence: 0.68
        })]),
        consensus: 'Recommend pilot program before full restructure. Need more data on productivity impact.',
        voteSummary: stryMutAct_9fa48("45537") ? {} : (stryCov_9fa48("45537"), {
          support: 2,
          cautious: 1,
          oppose: 0
        })
      }),
      userId: 'user-1',
      agentsInvolved: stryMutAct_9fa48("45539") ? [] : (stryCov_9fa48("45539"), ['CendiaCEO', 'CendiaChro', 'CendiaCTO'])
    })]),
    preMortems: stryMutAct_9fa48("45543") ? ["Stryker was here"] : (stryCov_9fa48("45543"), []),
    councilSessions: stryMutAct_9fa48("45544") ? [] : (stryCov_9fa48("45544"), [stryMutAct_9fa48("45545") ? {} : (stryCov_9fa48("45545"), {
      id: 'cs-1',
      confidence: 0.58
    })]),
    ghostBoardSimulations: stryMutAct_9fa48("45547") ? ["Stryker was here"] : (stryCov_9fa48("45547"), []),
    auditHash: 'sha256:c3d4e5f6g7h8...'
  })
});
export const DecisionDNAPage: React.FC = () => {
  const navigate = useNavigate();
  const [decisions, setDecisions] = useState<DecisionSummary[]>(SAMPLE_DECISIONS);
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("45550") ? true : (stryCov_9fa48("45550"), false));
  const [preMortemError, setPreMortemError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(stryMutAct_9fa48("45551") ? true : (stryCov_9fa48("45551"), false));
  const [replayMode, setReplayMode] = useState(stryMutAct_9fa48("45552") ? true : (stryCov_9fa48("45552"), false));
  const [replayStep, setReplayStep] = useState(0);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [decisionFilter, setDecisionFilter] = useState<'all' | 'deciding' | 'decided' | 'at-risk'>('all');

  // New decision form
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [newTimeframe, setNewTimeframe] = useState('');

  // Filter decisions based on selected filter
  const filteredDecisions = stryMutAct_9fa48("45558") ? decisions : (stryCov_9fa48("45558"), decisions.filter(d => {
    if (stryMutAct_9fa48("45562") ? decisionFilter !== 'all' : stryMutAct_9fa48("45561") ? false : stryMutAct_9fa48("45560") ? true : (stryCov_9fa48("45560", "45561", "45562"), decisionFilter === 'all')) return stryMutAct_9fa48("45564") ? false : (stryCov_9fa48("45564"), true);
    if (stryMutAct_9fa48("45567") ? decisionFilter !== 'deciding' : stryMutAct_9fa48("45566") ? false : stryMutAct_9fa48("45565") ? true : (stryCov_9fa48("45565", "45566", "45567"), decisionFilter === 'deciding')) return (stryMutAct_9fa48("45569") ? [] : (stryCov_9fa48("45569"), ['draft', 'analyzing', 'deliberating'])).includes(d.status);
    if (stryMutAct_9fa48("45575") ? decisionFilter !== 'decided' : stryMutAct_9fa48("45574") ? false : stryMutAct_9fa48("45573") ? true : (stryCov_9fa48("45573", "45574", "45575"), decisionFilter === 'decided')) return (stryMutAct_9fa48("45577") ? [] : (stryCov_9fa48("45577"), ['decided', 'implemented', 'closed'])).includes(d.status);
    if (stryMutAct_9fa48("45583") ? decisionFilter !== 'at-risk' : stryMutAct_9fa48("45582") ? false : stryMutAct_9fa48("45581") ? true : (stryCov_9fa48("45581", "45582", "45583"), decisionFilter === 'at-risk')) return stryMutAct_9fa48("45588") ? (d.riskScore || 0) < 60 : stryMutAct_9fa48("45587") ? (d.riskScore || 0) > 60 : stryMutAct_9fa48("45586") ? false : stryMutAct_9fa48("45585") ? true : (stryCov_9fa48("45585", "45586", "45587", "45588"), (stryMutAct_9fa48("45591") ? d.riskScore && 0 : stryMutAct_9fa48("45590") ? false : stryMutAct_9fa48("45589") ? true : (stryCov_9fa48("45589", "45590", "45591"), d.riskScore || 0)) >= 60);
    return stryMutAct_9fa48("45592") ? false : (stryCov_9fa48("45592"), true);
  }));

  // Load decisions
  useEffect(() => {
    loadDecisions();
  }, stryMutAct_9fa48("45594") ? ["Stryker was here"] : (stryCov_9fa48("45594"), []));
  const loadDecisions = async () => {
    try {
      const res = await api.get<any>('/decisions', stryMutAct_9fa48("45598") ? {} : (stryCov_9fa48("45598"), {
        organizationId: 'demo-org-id'
      }));
      const payload = res as any;
      if (stryMutAct_9fa48("45602") ? payload.success && payload.decisions || payload.decisions.length > 0 : stryMutAct_9fa48("45601") ? false : stryMutAct_9fa48("45600") ? true : (stryCov_9fa48("45600", "45601", "45602"), (stryMutAct_9fa48("45604") ? payload.success || payload.decisions : stryMutAct_9fa48("45603") ? true : (stryCov_9fa48("45603", "45604"), payload.success && payload.decisions)) && (stryMutAct_9fa48("45607") ? payload.decisions.length <= 0 : stryMutAct_9fa48("45606") ? payload.decisions.length >= 0 : stryMutAct_9fa48("45605") ? true : (stryCov_9fa48("45605", "45606", "45607"), payload.decisions.length > 0)))) {
        // Merge API decisions with samples
        setDecisions(stryMutAct_9fa48("45609") ? [] : (stryCov_9fa48("45609"), [...SAMPLE_DECISIONS, ...(payload.decisions as DecisionSummary[])]));
      }
    } catch (error) {
      // Keep sample decisions on error
      console.log('Using sample decisions');
    }
  };
  const loadDecision = async (id: string) => {
    setIsLoading(stryMutAct_9fa48("45613") ? false : (stryCov_9fa48("45613"), true));

    // Use sample data for demo decisions
    if (stryMutAct_9fa48("45616") ? id.startsWith('sample-') || SAMPLE_DECISIONS_DETAIL[id] : stryMutAct_9fa48("45615") ? false : stryMutAct_9fa48("45614") ? true : (stryCov_9fa48("45614", "45615", "45616"), (stryMutAct_9fa48("45617") ? id.endsWith('sample-') : (stryCov_9fa48("45617"), id.startsWith('sample-'))) && SAMPLE_DECISIONS_DETAIL[id])) {
      setSelectedDecision(SAMPLE_DECISIONS_DETAIL[id]);
      setReplayStep(0);
      setReplayMode(stryMutAct_9fa48("45620") ? true : (stryCov_9fa48("45620"), false));
      setIsLoading(stryMutAct_9fa48("45621") ? true : (stryCov_9fa48("45621"), false));
      return;
    }
    try {
      const res = await api.get<any>(`/decisions/${id}`);
      const payload = res as any;
      if (stryMutAct_9fa48("45626") ? payload.success || payload.decision : stryMutAct_9fa48("45625") ? false : stryMutAct_9fa48("45624") ? true : (stryCov_9fa48("45624", "45625", "45626"), payload.success && payload.decision)) {
        setSelectedDecision(payload.decision as Decision);
        setReplayStep(0);
        setReplayMode(stryMutAct_9fa48("45628") ? true : (stryCov_9fa48("45628"), false));
      }
    } catch (error) {
      console.error('Failed to load decision:', error);
    }
    setIsLoading(stryMutAct_9fa48("45631") ? true : (stryCov_9fa48("45631"), false));
  };
  const createDecision = async () => {
    if (stryMutAct_9fa48("45635") ? !newTitle.trim() && !newDescription.trim() : stryMutAct_9fa48("45634") ? false : stryMutAct_9fa48("45633") ? true : (stryCov_9fa48("45633", "45634", "45635"), (stryMutAct_9fa48("45636") ? newTitle.trim() : (stryCov_9fa48("45636"), !(stryMutAct_9fa48("45637") ? newTitle : (stryCov_9fa48("45637"), newTitle.trim())))) || (stryMutAct_9fa48("45638") ? newDescription.trim() : (stryCov_9fa48("45638"), !(stryMutAct_9fa48("45639") ? newDescription : (stryCov_9fa48("45639"), newDescription.trim())))))) {
      return;
    }
    setIsCreating(stryMutAct_9fa48("45641") ? false : (stryCov_9fa48("45641"), true));
    try {
      const res = await api.post<any>('/decisions', stryMutAct_9fa48("45644") ? {} : (stryCov_9fa48("45644"), {
        title: newTitle,
        description: newDescription,
        budget: newBudget ? parseFloat(newBudget) : undefined,
        timeframe: stryMutAct_9fa48("45647") ? newTimeframe && undefined : stryMutAct_9fa48("45646") ? false : stryMutAct_9fa48("45645") ? true : (stryCov_9fa48("45645", "45646", "45647"), newTimeframe || undefined)
      }));
      const payload = res as any;
      if (stryMutAct_9fa48("45650") ? payload.success || payload.decision : stryMutAct_9fa48("45649") ? false : stryMutAct_9fa48("45648") ? true : (stryCov_9fa48("45648", "45649", "45650"), payload.success && payload.decision)) {
        setNewTitle('');
        setNewDescription('');
        setNewBudget('');
        setNewTimeframe('');
        loadDecisions();
        loadDecision(payload.decision.id);
      }
    } catch (error) {
      console.error('Failed to create decision:', error);
    }
    setIsCreating(stryMutAct_9fa48("45658") ? true : (stryCov_9fa48("45658"), false));
  };
  const runPreMortem = async () => {
    if (stryMutAct_9fa48("45662") ? false : stryMutAct_9fa48("45661") ? true : stryMutAct_9fa48("45660") ? selectedDecision : (stryCov_9fa48("45660", "45661", "45662"), !selectedDecision)) {
      return;
    }
    setPreMortemError(null);

    // For sample decisions or if backend unavailable, navigate to Pre-Mortem page
    if (stryMutAct_9fa48("45666") ? selectedDecision.id.endsWith('sample-') : stryMutAct_9fa48("45665") ? false : stryMutAct_9fa48("45664") ? true : (stryCov_9fa48("45664", "45665", "45666"), selectedDecision.id.startsWith('sample-'))) {
      // Navigate to Pre-Mortem page with decision context
      navigate(`/cortex/intelligence/pre-mortem?decision=${encodeURIComponent(selectedDecision.title)}&context=${encodeURIComponent(selectedDecision.description)}`);
      return;
    }
    setIsLoading(stryMutAct_9fa48("45670") ? false : (stryCov_9fa48("45670"), true));
    try {
      const res = await api.post<any>(`/decisions/${selectedDecision.id}/premortem`, {});
      if (stryMutAct_9fa48("45674") ? false : stryMutAct_9fa48("45673") ? true : (stryCov_9fa48("45673", "45674"), res.success)) {
        loadDecision(selectedDecision.id);
      } else {
        // Fallback: navigate to Pre-Mortem page
        navigate(`/cortex/intelligence/pre-mortem?decision=${encodeURIComponent(selectedDecision.title)}&context=${encodeURIComponent(selectedDecision.description)}`);
      }
    } catch (error) {
      console.error('Failed to run pre-mortem:', error);
      // Fallback: navigate to Pre-Mortem page with decision context
      navigate(`/cortex/intelligence/pre-mortem?decision=${encodeURIComponent(selectedDecision.title)}&context=${encodeURIComponent(selectedDecision.description)}`);
    }
    setIsLoading(stryMutAct_9fa48("45681") ? true : (stryCov_9fa48("45681"), false));
  };
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', stryMutAct_9fa48("45684") ? {} : (stryCov_9fa48("45684"), {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }));
  };
  const getVisibleEvents = () => {
    if (stryMutAct_9fa48("45693") ? false : stryMutAct_9fa48("45692") ? true : stryMutAct_9fa48("45691") ? selectedDecision : (stryCov_9fa48("45691", "45692", "45693"), !selectedDecision)) {
      return stryMutAct_9fa48("45695") ? ["Stryker was here"] : (stryCov_9fa48("45695"), []);
    }
    if (stryMutAct_9fa48("45698") ? false : stryMutAct_9fa48("45697") ? true : stryMutAct_9fa48("45696") ? replayMode : (stryCov_9fa48("45696", "45697", "45698"), !replayMode)) {
      return selectedDecision.timeline;
    }
    return stryMutAct_9fa48("45700") ? selectedDecision.timeline : (stryCov_9fa48("45700"), selectedDecision.timeline.slice(0, stryMutAct_9fa48("45701") ? replayStep - 1 : (stryCov_9fa48("45701"), replayStep + 1)));
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🧬</span>
            <h1 className="text-3xl font-bold text-white">Decision DNA</h1>
          </div>
          <p className="text-slate-400 text-lg">
            Full lifecycle tracking with step-by-step replay. Every decision, every analysis, every outcome.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Decision List */}
          <div className="col-span-4 space-y-4">
            {/* Create New Decision */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span>➕</span> New Decision
              </h3>
              <div className="space-y-3">
                <input type="text" value={newTitle} onChange={stryMutAct_9fa48("45702") ? () => undefined : (stryCov_9fa48("45702"), e => setNewTitle(e.target.value))} placeholder="Decision title..." className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm" />
                <textarea value={newDescription} onChange={stryMutAct_9fa48("45703") ? () => undefined : (stryCov_9fa48("45703"), e => setNewDescription(e.target.value))} placeholder="What decision needs to be made?" className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm h-20 resize-none" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" value={newBudget} onChange={stryMutAct_9fa48("45704") ? () => undefined : (stryCov_9fa48("45704"), e => setNewBudget(e.target.value))} placeholder="Budget ($)" className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm" />
                  <input type="text" value={newTimeframe} onChange={stryMutAct_9fa48("45705") ? () => undefined : (stryCov_9fa48("45705"), e => setNewTimeframe(e.target.value))} placeholder="Timeframe" className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm" />
                </div>
                <button onClick={createDecision} disabled={stryMutAct_9fa48("45708") ? (isCreating || !newTitle.trim()) && !newDescription.trim() : stryMutAct_9fa48("45707") ? false : stryMutAct_9fa48("45706") ? true : (stryCov_9fa48("45706", "45707", "45708"), (stryMutAct_9fa48("45710") ? isCreating && !newTitle.trim() : stryMutAct_9fa48("45709") ? false : (stryCov_9fa48("45709", "45710"), isCreating || (stryMutAct_9fa48("45711") ? newTitle.trim() : (stryCov_9fa48("45711"), !(stryMutAct_9fa48("45712") ? newTitle : (stryCov_9fa48("45712"), newTitle.trim())))))) || (stryMutAct_9fa48("45713") ? newDescription.trim() : (stryCov_9fa48("45713"), !(stryMutAct_9fa48("45714") ? newDescription : (stryCov_9fa48("45714"), newDescription.trim())))))} className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium text-sm transition-colors">
                  {isCreating ? 'Creating...' : 'Create Decision'}
                </button>
              </div>
            </div>

            {/* Decision List */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span>📋</span> Tracked Decisions ({filteredDecisions.length})
              </h3>
              
              {/* Filter Tabs */}
              <div className="flex items-center gap-1 mb-3 p-1 bg-slate-700/50 rounded-lg">
                {(['all', 'deciding', 'decided', 'at-risk'] as const).map(stryMutAct_9fa48("45717") ? () => undefined : (stryCov_9fa48("45717"), filter => <button key={filter} onClick={stryMutAct_9fa48("45718") ? () => undefined : (stryCov_9fa48("45718"), () => setDecisionFilter(filter))} className={cn('flex-1 px-2 py-1.5 rounded text-xs font-medium transition-all', (stryMutAct_9fa48("45722") ? decisionFilter !== filter : stryMutAct_9fa48("45721") ? false : stryMutAct_9fa48("45720") ? true : (stryCov_9fa48("45720", "45721", "45722"), decisionFilter === filter)) ? (stryMutAct_9fa48("45725") ? filter !== 'at-risk' : stryMutAct_9fa48("45724") ? false : stryMutAct_9fa48("45723") ? true : (stryCov_9fa48("45723", "45724", "45725"), filter === 'at-risk')) ? 'bg-red-600 text-white' : 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-600/50')}>
                    {stryMutAct_9fa48("45732") ? filter === 'all' || 'All' : stryMutAct_9fa48("45731") ? false : stryMutAct_9fa48("45730") ? true : (stryCov_9fa48("45730", "45731", "45732"), (stryMutAct_9fa48("45734") ? filter !== 'all' : stryMutAct_9fa48("45733") ? true : (stryCov_9fa48("45733", "45734"), filter === 'all')) && 'All')}
                    {stryMutAct_9fa48("45739") ? filter === 'deciding' || 'Deciding' : stryMutAct_9fa48("45738") ? false : stryMutAct_9fa48("45737") ? true : (stryCov_9fa48("45737", "45738", "45739"), (stryMutAct_9fa48("45741") ? filter !== 'deciding' : stryMutAct_9fa48("45740") ? true : (stryCov_9fa48("45740", "45741"), filter === 'deciding')) && 'Deciding')}
                    {stryMutAct_9fa48("45746") ? filter === 'decided' || 'Decided' : stryMutAct_9fa48("45745") ? false : stryMutAct_9fa48("45744") ? true : (stryCov_9fa48("45744", "45745", "45746"), (stryMutAct_9fa48("45748") ? filter !== 'decided' : stryMutAct_9fa48("45747") ? true : (stryCov_9fa48("45747", "45748"), filter === 'decided')) && 'Decided')}
                    {stryMutAct_9fa48("45753") ? filter === 'at-risk' || '⚠️ At Risk' : stryMutAct_9fa48("45752") ? false : stryMutAct_9fa48("45751") ? true : (stryCov_9fa48("45751", "45752", "45753"), (stryMutAct_9fa48("45755") ? filter !== 'at-risk' : stryMutAct_9fa48("45754") ? true : (stryCov_9fa48("45754", "45755"), filter === 'at-risk')) && '⚠️ At Risk')}
                  </button>))}
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {(stryMutAct_9fa48("45760") ? filteredDecisions.length !== 0 : stryMutAct_9fa48("45759") ? false : stryMutAct_9fa48("45758") ? true : (stryCov_9fa48("45758", "45759", "45760"), filteredDecisions.length === 0)) ? <p className="text-slate-500 text-sm text-center py-4">
                    {(stryMutAct_9fa48("45763") ? decisionFilter !== 'all' : stryMutAct_9fa48("45762") ? false : stryMutAct_9fa48("45761") ? true : (stryCov_9fa48("45761", "45762", "45763"), decisionFilter === 'all')) ? 'No decisions tracked yet. Create one above!' : `No ${decisionFilter} decisions found.`}
                  </p> : filteredDecisions.map(stryMutAct_9fa48("45767") ? () => undefined : (stryCov_9fa48("45767"), d => <button key={d.id} onClick={stryMutAct_9fa48("45768") ? () => undefined : (stryCov_9fa48("45768"), () => loadDecision(d.id))} className={cn('w-full p-3 rounded-lg border text-left transition-all', (stryMutAct_9fa48("45772") ? selectedDecision?.id !== d.id : stryMutAct_9fa48("45771") ? false : stryMutAct_9fa48("45770") ? true : (stryCov_9fa48("45770", "45771", "45772"), (stryMutAct_9fa48("45773") ? selectedDecision.id : (stryCov_9fa48("45773"), selectedDecision?.id)) === d.id)) ? 'bg-blue-600/20 border-blue-500' : 'bg-slate-700/50 border-slate-600 hover:border-slate-500')}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="text-white font-medium text-sm truncate">{d.title}</div>
                          <div className="text-slate-400 text-xs mt-1">
                            {d.eventCount} events • {formatDate(d.createdAt)}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={cn('px-2 py-0.5 rounded text-xs font-medium', stryMutAct_9fa48("45779") ? STATUS_COLORS[d.status] && 'bg-gray-500' : stryMutAct_9fa48("45778") ? false : stryMutAct_9fa48("45777") ? true : (stryCov_9fa48("45777", "45778", "45779"), STATUS_COLORS[d.status] || 'bg-gray-500'))}>
                            {d.status}
                          </span>
                          {stryMutAct_9fa48("45783") ? d.riskScore !== undefined || <span className={cn('text-xs', d.riskScore > 60 ? 'text-red-400' : d.riskScore > 40 ? 'text-yellow-400' : 'text-green-400')}>
                              {d.riskScore}% risk
                            </span> : stryMutAct_9fa48("45782") ? false : stryMutAct_9fa48("45781") ? true : (stryCov_9fa48("45781", "45782", "45783"), (stryMutAct_9fa48("45785") ? d.riskScore === undefined : stryMutAct_9fa48("45784") ? true : (stryCov_9fa48("45784", "45785"), d.riskScore !== undefined)) && <span className={cn('text-xs', (stryMutAct_9fa48("45790") ? d.riskScore <= 60 : stryMutAct_9fa48("45789") ? d.riskScore >= 60 : stryMutAct_9fa48("45788") ? false : stryMutAct_9fa48("45787") ? true : (stryCov_9fa48("45787", "45788", "45789", "45790"), d.riskScore > 60)) ? 'text-red-400' : (stryMutAct_9fa48("45795") ? d.riskScore <= 40 : stryMutAct_9fa48("45794") ? d.riskScore >= 40 : stryMutAct_9fa48("45793") ? false : stryMutAct_9fa48("45792") ? true : (stryCov_9fa48("45792", "45793", "45794", "45795"), d.riskScore > 40)) ? 'text-yellow-400' : 'text-green-400')}>
                              {d.riskScore}% risk
                            </span>)}
                        </div>
                      </div>
                    </button>))}
              </div>
            </div>
          </div>

          {/* Right Panel - Timeline */}
          <div className="col-span-8">
            {(stryMutAct_9fa48("45798") ? selectedDecision : (stryCov_9fa48("45798"), !selectedDecision)) ? <div className="bg-slate-800/50 rounded-xl p-12 border border-slate-700 text-center">
                <span className="text-6xl mb-4 block">🧬</span>
                <h3 className="text-xl font-semibold text-white mb-2">Select or Create a Decision</h3>
                <p className="text-slate-400">
                  Track the full DNA of any business decision - from initial context through analysis to outcome.
                </p>
              </div> : <div className="space-y-4">
                {/* Decision Header */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-white">{selectedDecision.title}</h2>
                      <p className="text-slate-400 mt-1">{selectedDecision.description}</p>
                      
                      {/* Decision ID & Owner Metadata Strip */}
                      <div className="flex flex-wrap items-center gap-3 mt-3 py-2 px-3 bg-slate-700/50 rounded-lg text-xs">
                        {stryMutAct_9fa48("45801") ? selectedDecision.decisionId || <span className="text-slate-300">
                            <span className="text-slate-500">Decision ID:</span>{' '}
                            <span className="font-mono font-medium text-cyan-400">{selectedDecision.decisionId}</span>
                          </span> : stryMutAct_9fa48("45800") ? false : stryMutAct_9fa48("45799") ? true : (stryCov_9fa48("45799", "45800", "45801"), selectedDecision.decisionId && <span className="text-slate-300">
                            <span className="text-slate-500">Decision ID:</span>{' '}
                            <span className="font-mono font-medium text-cyan-400">{selectedDecision.decisionId}</span>
                          </span>)}
                        {stryMutAct_9fa48("45805") ? selectedDecision.owner || <span className="text-slate-300">
                            <span className="text-slate-500">Owner:</span>{' '}
                            <span className="font-medium">{selectedDecision.owner.role} ({selectedDecision.owner.name})</span>
                          </span> : stryMutAct_9fa48("45804") ? false : stryMutAct_9fa48("45803") ? true : (stryCov_9fa48("45803", "45804", "45805"), selectedDecision.owner && <span className="text-slate-300">
                            <span className="text-slate-500">Owner:</span>{' '}
                            <span className="font-medium">{selectedDecision.owner.role} ({selectedDecision.owner.name})</span>
                          </span>)}
                        <span className="text-slate-300">
                          <span className="text-slate-500">Council Status:</span>{' '}
                          <span className={cn('font-medium', (stryMutAct_9fa48("45811") ? selectedDecision.status !== 'decided' : stryMutAct_9fa48("45810") ? false : stryMutAct_9fa48("45809") ? true : (stryCov_9fa48("45809", "45810", "45811"), selectedDecision.status === 'decided')) ? 'text-green-400' : 'text-amber-400')}>
                            {stryMutAct_9fa48("45815") ? selectedDecision.status.charAt(0).toUpperCase() - selectedDecision.status.slice(1) : (stryCov_9fa48("45815"), (stryMutAct_9fa48("45817") ? selectedDecision.status.toUpperCase() : stryMutAct_9fa48("45816") ? selectedDecision.status.charAt(0).toLowerCase() : (stryCov_9fa48("45816", "45817"), selectedDecision.status.charAt(0).toUpperCase())) + (stryMutAct_9fa48("45818") ? selectedDecision.status : (stryCov_9fa48("45818"), selectedDecision.status.slice(1))))}
                            {stryMutAct_9fa48("45821") ? selectedDecision.councilConfidence || ` (${selectedDecision.councilConfidence}% confidence)` : stryMutAct_9fa48("45820") ? false : stryMutAct_9fa48("45819") ? true : (stryCov_9fa48("45819", "45820", "45821"), selectedDecision.councilConfidence && ` (${selectedDecision.councilConfidence}% confidence)`)}
                          </span>
                        </span>
                        <span className="text-slate-300">
                          <span className="text-slate-500">Last updated:</span>{' '}
                          <span className="font-medium">{formatDate(selectedDecision.updatedAt)}</span>
                        </span>
                      </div>

                      {/* Status & Budget Row */}
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <span className={cn('px-2 py-0.5 rounded font-medium', stryMutAct_9fa48("45827") ? STATUS_COLORS[selectedDecision.status] && 'bg-gray-500' : stryMutAct_9fa48("45826") ? false : stryMutAct_9fa48("45825") ? true : (stryCov_9fa48("45825", "45826", "45827"), STATUS_COLORS[selectedDecision.status] || 'bg-gray-500'))}>
                          {selectedDecision.status}
                        </span>
                        {stryMutAct_9fa48("45831") ? selectedDecision.budget || <span className="text-slate-400">
                            💰 ${selectedDecision.budget.toLocaleString()}
                          </span> : stryMutAct_9fa48("45830") ? false : stryMutAct_9fa48("45829") ? true : (stryCov_9fa48("45829", "45830", "45831"), selectedDecision.budget && <span className="text-slate-400">
                            💰 ${selectedDecision.budget.toLocaleString()}
                          </span>)}
                        {stryMutAct_9fa48("45834") ? selectedDecision.timeframe || <span className="text-slate-400">
                            📅 {selectedDecision.timeframe}
                          </span> : stryMutAct_9fa48("45833") ? false : stryMutAct_9fa48("45832") ? true : (stryCov_9fa48("45832", "45833", "45834"), selectedDecision.timeframe && <span className="text-slate-400">
                            📅 {selectedDecision.timeframe}
                          </span>)}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <button onClick={runPreMortem} disabled={isLoading} className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium disabled:opacity-50">
                        💀 Pre-Mortem
                      </button>
                      <button onClick={stryMutAct_9fa48("45835") ? () => undefined : (stryCov_9fa48("45835"), () => setReplayMode(stryMutAct_9fa48("45836") ? replayMode : (stryCov_9fa48("45836"), !replayMode)))} className={cn('px-3 py-2 rounded-lg text-sm font-medium', replayMode ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600')} title="Replay decision timeline step-by-step in Chronos">
                        {replayMode ? '⏹️ Exit Replay' : '🎬 Replay in Chronos'}
                      </button>
                    </div>
                  </div>

                  {/* Immutable Hash Banner */}
                  {stryMutAct_9fa48("45844") ? selectedDecision.auditHash || <div className="mt-3 p-2 bg-green-900/30 border border-green-700/50 rounded-lg flex items-center justify-between group cursor-help" title="Any change to this decision's record would change this hash. It's anchored in the immutable Chronos ledger.">
                      <div className="flex items-center gap-2">
                        <span className="text-green-400 text-lg">🔐</span>
                        <div>
                          <span className="text-green-400 text-xs font-medium">Immutable Hash (Chronos Ledger)</span>
                          <span className="text-green-300 text-xs font-mono ml-2">{selectedDecision.auditHash}</span>
                        </div>
                      </div>
                      <span className="text-green-500/50 text-xs group-hover:text-green-400 transition-colors">
                        ℹ️ Cryptographically anchored
                      </span>
                    </div> : stryMutAct_9fa48("45843") ? false : stryMutAct_9fa48("45842") ? true : (stryCov_9fa48("45842", "45843", "45844"), selectedDecision.auditHash && <div className="mt-3 p-2 bg-green-900/30 border border-green-700/50 rounded-lg flex items-center justify-between group cursor-help" title="Any change to this decision's record would change this hash. It's anchored in the immutable Chronos ledger.">
                      <div className="flex items-center gap-2">
                        <span className="text-green-400 text-lg">🔐</span>
                        <div>
                          <span className="text-green-400 text-xs font-medium">Immutable Hash (Chronos Ledger)</span>
                          <span className="text-green-300 text-xs font-mono ml-2">{selectedDecision.auditHash}</span>
                        </div>
                      </div>
                      <span className="text-green-500/50 text-xs group-hover:text-green-400 transition-colors">
                        ℹ️ Cryptographically anchored
                      </span>
                    </div>)}

                  {/* Linked Workflows */}
                  {stryMutAct_9fa48("45847") ? selectedDecision.linkedWorkflows && selectedDecision.linkedWorkflows.length > 0 || <div className="mt-3 flex items-center gap-2">
                      <span className="text-slate-500 text-xs">Linked Workflows:</span>
                      <div className="flex items-center gap-1">
                        {selectedDecision.linkedWorkflows.map(wf => <button key={wf.id} onClick={() => window.open(`/cortex/bridge/workflows/${wf.id}`, '_blank')} className="px-2 py-0.5 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/30 rounded text-xs text-indigo-300 hover:text-indigo-200 transition-colors" title={`Open "${wf.name}" in Bridge`}>
                            ⚙️ {wf.name}
                          </button>)}
                      </div>
                      <span className="text-slate-500 text-xs ml-1" title="These are the automations/actions this decision triggered">
                        ({selectedDecision.linkedWorkflows.length} workflows triggered)
                      </span>
                    </div> : stryMutAct_9fa48("45846") ? false : stryMutAct_9fa48("45845") ? true : (stryCov_9fa48("45845", "45846", "45847"), (stryMutAct_9fa48("45849") ? selectedDecision.linkedWorkflows || selectedDecision.linkedWorkflows.length > 0 : stryMutAct_9fa48("45848") ? true : (stryCov_9fa48("45848", "45849"), selectedDecision.linkedWorkflows && (stryMutAct_9fa48("45852") ? selectedDecision.linkedWorkflows.length <= 0 : stryMutAct_9fa48("45851") ? selectedDecision.linkedWorkflows.length >= 0 : stryMutAct_9fa48("45850") ? true : (stryCov_9fa48("45850", "45851", "45852"), selectedDecision.linkedWorkflows.length > 0)))) && <div className="mt-3 flex items-center gap-2">
                      <span className="text-slate-500 text-xs">Linked Workflows:</span>
                      <div className="flex items-center gap-1">
                        {selectedDecision.linkedWorkflows.map(stryMutAct_9fa48("45853") ? () => undefined : (stryCov_9fa48("45853"), wf => <button key={wf.id} onClick={stryMutAct_9fa48("45854") ? () => undefined : (stryCov_9fa48("45854"), () => window.open(`/cortex/bridge/workflows/${wf.id}`, '_blank'))} className="px-2 py-0.5 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/30 rounded text-xs text-indigo-300 hover:text-indigo-200 transition-colors" title={`Open "${wf.name}" in Bridge`}>
                            ⚙️ {wf.name}
                          </button>))}
                      </div>
                      <span className="text-slate-500 text-xs ml-1" title="These are the automations/actions this decision triggered">
                        ({selectedDecision.linkedWorkflows.length} workflows triggered)
                      </span>
                    </div>)}
                </div>

                {/* Replay Controls */}
                {stryMutAct_9fa48("45860") ? replayMode || <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-700">
                    <div className="flex items-center justify-between">
                      <span className="text-purple-300 font-medium">
                        🎬 Replay Mode - Step {replayStep + 1} of {selectedDecision.timeline.length}
                      </span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setReplayStep(Math.max(0, replayStep - 1))} disabled={replayStep === 0} className="px-3 py-1 bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white rounded text-sm">
                          ◀ Prev
                        </button>
                        <button onClick={() => setReplayStep(Math.min(selectedDecision.timeline.length - 1, replayStep + 1))} disabled={replayStep >= selectedDecision.timeline.length - 1} className="px-3 py-1 bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white rounded text-sm">
                          Next ▶
                        </button>
                        <button onClick={() => setReplayStep(selectedDecision.timeline.length - 1)} className="px-3 py-1 bg-purple-700 hover:bg-purple-600 text-white rounded text-sm">
                          ⏭ End
                        </button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <input type="range" min={0} max={selectedDecision.timeline.length - 1} value={replayStep} onChange={e => setReplayStep(parseInt(e.target.value))} className="w-full" />
                    </div>
                  </div> : stryMutAct_9fa48("45859") ? false : stryMutAct_9fa48("45858") ? true : (stryCov_9fa48("45858", "45859", "45860"), replayMode && <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-700">
                    <div className="flex items-center justify-between">
                      <span className="text-purple-300 font-medium">
                        🎬 Replay Mode - Step {stryMutAct_9fa48("45861") ? replayStep - 1 : (stryCov_9fa48("45861"), replayStep + 1)} of {selectedDecision.timeline.length}
                      </span>
                      <div className="flex items-center gap-2">
                        <button onClick={stryMutAct_9fa48("45862") ? () => undefined : (stryCov_9fa48("45862"), () => setReplayStep(stryMutAct_9fa48("45863") ? Math.min(0, replayStep - 1) : (stryCov_9fa48("45863"), Math.max(0, stryMutAct_9fa48("45864") ? replayStep + 1 : (stryCov_9fa48("45864"), replayStep - 1)))))} disabled={stryMutAct_9fa48("45867") ? replayStep !== 0 : stryMutAct_9fa48("45866") ? false : stryMutAct_9fa48("45865") ? true : (stryCov_9fa48("45865", "45866", "45867"), replayStep === 0)} className="px-3 py-1 bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white rounded text-sm">
                          ◀ Prev
                        </button>
                        <button onClick={stryMutAct_9fa48("45868") ? () => undefined : (stryCov_9fa48("45868"), () => setReplayStep(stryMutAct_9fa48("45869") ? Math.max(selectedDecision.timeline.length - 1, replayStep + 1) : (stryCov_9fa48("45869"), Math.min(stryMutAct_9fa48("45870") ? selectedDecision.timeline.length + 1 : (stryCov_9fa48("45870"), selectedDecision.timeline.length - 1), stryMutAct_9fa48("45871") ? replayStep - 1 : (stryCov_9fa48("45871"), replayStep + 1)))))} disabled={stryMutAct_9fa48("45875") ? replayStep < selectedDecision.timeline.length - 1 : stryMutAct_9fa48("45874") ? replayStep > selectedDecision.timeline.length - 1 : stryMutAct_9fa48("45873") ? false : stryMutAct_9fa48("45872") ? true : (stryCov_9fa48("45872", "45873", "45874", "45875"), replayStep >= (stryMutAct_9fa48("45876") ? selectedDecision.timeline.length + 1 : (stryCov_9fa48("45876"), selectedDecision.timeline.length - 1)))} className="px-3 py-1 bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white rounded text-sm">
                          Next ▶
                        </button>
                        <button onClick={stryMutAct_9fa48("45877") ? () => undefined : (stryCov_9fa48("45877"), () => setReplayStep(stryMutAct_9fa48("45878") ? selectedDecision.timeline.length + 1 : (stryCov_9fa48("45878"), selectedDecision.timeline.length - 1)))} className="px-3 py-1 bg-purple-700 hover:bg-purple-600 text-white rounded text-sm">
                          ⏭ End
                        </button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <input type="range" min={0} max={stryMutAct_9fa48("45879") ? selectedDecision.timeline.length + 1 : (stryCov_9fa48("45879"), selectedDecision.timeline.length - 1)} value={replayStep} onChange={stryMutAct_9fa48("45880") ? () => undefined : (stryCov_9fa48("45880"), e => setReplayStep(parseInt(e.target.value)))} className="w-full" />
                    </div>
                  </div>)}

                {/* Timeline */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <span>📜</span> Decision Timeline
                  </h3>
                  
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-600" />

                    {/* Events */}
                    <div className="space-y-4">
                      {getVisibleEvents().map(stryMutAct_9fa48("45881") ? () => undefined : (stryCov_9fa48("45881"), (event, idx) => <div key={event.id} className={cn('relative pl-14 transition-all', stryMutAct_9fa48("45885") ? replayMode && idx === replayStep || 'scale-105' : stryMutAct_9fa48("45884") ? false : stryMutAct_9fa48("45883") ? true : (stryCov_9fa48("45883", "45884", "45885"), (stryMutAct_9fa48("45887") ? replayMode || idx === replayStep : stryMutAct_9fa48("45886") ? true : (stryCov_9fa48("45886", "45887"), replayMode && (stryMutAct_9fa48("45889") ? idx !== replayStep : stryMutAct_9fa48("45888") ? true : (stryCov_9fa48("45888", "45889"), idx === replayStep)))) && 'scale-105'))}>
                          {/* Event dot */}
                          <div className={cn('absolute left-4 w-5 h-5 rounded-full flex items-center justify-center text-xs', stryMutAct_9fa48("45894") ? EVENT_COLORS[event.type] && 'bg-gray-500' : stryMutAct_9fa48("45893") ? false : stryMutAct_9fa48("45892") ? true : (stryCov_9fa48("45892", "45893", "45894"), EVENT_COLORS[event.type] || 'bg-gray-500'), stryMutAct_9fa48("45898") ? replayMode && idx === replayStep || 'ring-2 ring-purple-400 ring-offset-2 ring-offset-slate-800' : stryMutAct_9fa48("45897") ? false : stryMutAct_9fa48("45896") ? true : (stryCov_9fa48("45896", "45897", "45898"), (stryMutAct_9fa48("45900") ? replayMode || idx === replayStep : stryMutAct_9fa48("45899") ? true : (stryCov_9fa48("45899", "45900"), replayMode && (stryMutAct_9fa48("45902") ? idx !== replayStep : stryMutAct_9fa48("45901") ? true : (stryCov_9fa48("45901", "45902"), idx === replayStep)))) && 'ring-2 ring-purple-400 ring-offset-2 ring-offset-slate-800'))}>
                            {stryMutAct_9fa48("45906") ? EVENT_ICONS[event.type] && '📌' : stryMutAct_9fa48("45905") ? false : stryMutAct_9fa48("45904") ? true : (stryCov_9fa48("45904", "45905", "45906"), EVENT_ICONS[event.type] || '📌')}
                          </div>

                          {/* Event card */}
                          <div className={cn('bg-slate-700/50 rounded-lg p-3 border cursor-pointer transition-all group', (stryMutAct_9fa48("45911") ? expandedEvent !== event.id : stryMutAct_9fa48("45910") ? false : stryMutAct_9fa48("45909") ? true : (stryCov_9fa48("45909", "45910", "45911"), expandedEvent === event.id)) ? 'border-blue-500' : 'border-slate-600 hover:border-slate-500')} onClick={stryMutAct_9fa48("45914") ? () => undefined : (stryCov_9fa48("45914"), () => setExpandedEvent((stryMutAct_9fa48("45917") ? expandedEvent !== event.id : stryMutAct_9fa48("45916") ? false : stryMutAct_9fa48("45915") ? true : (stryCov_9fa48("45915", "45916", "45917"), expandedEvent === event.id)) ? null : event.id))}>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-white font-medium">{event.title}</span>
                                  {/* Artefact type icon */}
                                  <span className="text-slate-500 text-xs" title={`${event.type.replace('_', ' ')} artefact`}>
                                    {stryMutAct_9fa48("45923") ? event.type === 'context_added' || '📄' : stryMutAct_9fa48("45922") ? false : stryMutAct_9fa48("45921") ? true : (stryCov_9fa48("45921", "45922", "45923"), (stryMutAct_9fa48("45925") ? event.type !== 'context_added' : stryMutAct_9fa48("45924") ? true : (stryCov_9fa48("45924", "45925"), event.type === 'context_added')) && '📄')}
                                    {stryMutAct_9fa48("45930") ? event.type === 'premortem_run' || '⚠️' : stryMutAct_9fa48("45929") ? false : stryMutAct_9fa48("45928") ? true : (stryCov_9fa48("45928", "45929", "45930"), (stryMutAct_9fa48("45932") ? event.type !== 'premortem_run' : stryMutAct_9fa48("45931") ? true : (stryCov_9fa48("45931", "45932"), event.type === 'premortem_run')) && '⚠️')}
                                    {stryMutAct_9fa48("45937") ? event.type === 'council_session' || '📋' : stryMutAct_9fa48("45936") ? false : stryMutAct_9fa48("45935") ? true : (stryCov_9fa48("45935", "45936", "45937"), (stryMutAct_9fa48("45939") ? event.type !== 'council_session' : stryMutAct_9fa48("45938") ? true : (stryCov_9fa48("45938", "45939"), event.type === 'council_session')) && '📋')}
                                    {stryMutAct_9fa48("45944") ? event.type === 'ghost_board' || '🎭' : stryMutAct_9fa48("45943") ? false : stryMutAct_9fa48("45942") ? true : (stryCov_9fa48("45942", "45943", "45944"), (stryMutAct_9fa48("45946") ? event.type !== 'ghost_board' : stryMutAct_9fa48("45945") ? true : (stryCov_9fa48("45945", "45946"), event.type === 'ghost_board')) && '🎭')}
                                  </span>
                                </div>
                                <div className="text-slate-400 text-sm mt-1">{event.summary}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-slate-500 text-xs whitespace-nowrap">
                                  {formatDate(event.timestamp)}
                                </span>
                                {/* Open Artefact button */}
                                {stryMutAct_9fa48("45951") ? event.type === 'premortem_run' || event.type === 'council_session' || event.type === 'ghost_board' || event.type === 'context_added' || <button onClick={e => {
                            e.stopPropagation();
                            // Navigate to the appropriate artefact
                            if (event.type === 'premortem_run') {
                              window.open('/cortex/intelligence/crucible', '_blank');
                            } else if (event.type === 'council_session') {
                              window.open('/cortex/council', '_blank');
                            } else if (event.type === 'ghost_board') {
                              window.open('/cortex/intelligence/ghost-board', '_blank');
                            } else if (event.type === 'context_added') {
                              // Could link to document viewer
                              setExpandedEvent(event.id);
                            }
                          }} className="opacity-0 group-hover:opacity-100 px-2 py-1 bg-slate-600 hover:bg-slate-500 rounded text-xs text-slate-300 hover:text-white transition-all" title="Open artefact">
                                    ↗️ Open
                                  </button> : stryMutAct_9fa48("45950") ? false : stryMutAct_9fa48("45949") ? true : (stryCov_9fa48("45949", "45950", "45951"), (stryMutAct_9fa48("45953") ? (event.type === 'premortem_run' || event.type === 'council_session' || event.type === 'ghost_board') && event.type === 'context_added' : stryMutAct_9fa48("45952") ? true : (stryCov_9fa48("45952", "45953"), (stryMutAct_9fa48("45955") ? (event.type === 'premortem_run' || event.type === 'council_session') && event.type === 'ghost_board' : stryMutAct_9fa48("45954") ? false : (stryCov_9fa48("45954", "45955"), (stryMutAct_9fa48("45957") ? event.type === 'premortem_run' && event.type === 'council_session' : stryMutAct_9fa48("45956") ? false : (stryCov_9fa48("45956", "45957"), (stryMutAct_9fa48("45959") ? event.type !== 'premortem_run' : stryMutAct_9fa48("45958") ? false : (stryCov_9fa48("45958", "45959"), event.type === 'premortem_run')) || (stryMutAct_9fa48("45962") ? event.type !== 'council_session' : stryMutAct_9fa48("45961") ? false : (stryCov_9fa48("45961", "45962"), event.type === 'council_session')))) || (stryMutAct_9fa48("45965") ? event.type !== 'ghost_board' : stryMutAct_9fa48("45964") ? false : (stryCov_9fa48("45964", "45965"), event.type === 'ghost_board')))) || (stryMutAct_9fa48("45968") ? event.type !== 'context_added' : stryMutAct_9fa48("45967") ? false : (stryCov_9fa48("45967", "45968"), event.type === 'context_added')))) && <button onClick={e => {
                            e.stopPropagation();
                            // Navigate to the appropriate artefact
                            if (stryMutAct_9fa48("45973") ? event.type !== 'premortem_run' : stryMutAct_9fa48("45972") ? false : stryMutAct_9fa48("45971") ? true : (stryCov_9fa48("45971", "45972", "45973"), event.type === 'premortem_run')) {
                              window.open('/cortex/intelligence/crucible', '_blank');
                            } else if (stryMutAct_9fa48("45980") ? event.type !== 'council_session' : stryMutAct_9fa48("45979") ? false : stryMutAct_9fa48("45978") ? true : (stryCov_9fa48("45978", "45979", "45980"), event.type === 'council_session')) {
                              window.open('/cortex/council', '_blank');
                            } else if (stryMutAct_9fa48("45987") ? event.type !== 'ghost_board' : stryMutAct_9fa48("45986") ? false : stryMutAct_9fa48("45985") ? true : (stryCov_9fa48("45985", "45986", "45987"), event.type === 'ghost_board')) {
                              window.open('/cortex/intelligence/ghost-board', '_blank');
                            } else if (stryMutAct_9fa48("45994") ? event.type !== 'context_added' : stryMutAct_9fa48("45993") ? false : stryMutAct_9fa48("45992") ? true : (stryCov_9fa48("45992", "45993", "45994"), event.type === 'context_added')) {
                              // Could link to document viewer
                              setExpandedEvent(event.id);
                            }
                          }} className="opacity-0 group-hover:opacity-100 px-2 py-1 bg-slate-600 hover:bg-slate-500 rounded text-xs text-slate-300 hover:text-white transition-all" title="Open artefact">
                                    ↗️ Open
                                  </button>)}
                              </div>
                            </div>

                            {/* Expanded data */}
                            {stryMutAct_9fa48("45999") ? expandedEvent === event.id && event.data || <div className="mt-3 pt-3 border-t border-slate-600">
                                {event.agentsInvolved && event.agentsInvolved.length > 0 && <div className="mb-3 flex items-center gap-2 flex-wrap">
                                    <span className="text-slate-400 text-xs">Agents:</span>
                                    {event.agentsInvolved.map(agent => <span key={agent} className="px-2 py-0.5 bg-slate-600 rounded text-xs text-white">
                                        {agent}
                                      </span>)}
                                  </div>}
                                
                                {/* Council Session formatted view */}
                                {event.type === 'council_session' && (event.data.deliberation || event.data.agentResponses) ? <div className="space-y-3">
                                    {/* Confidence & Consensus */}
                                    <div className="flex items-center gap-4 p-3 bg-slate-800 rounded-lg">
                                      <div className="text-center">
                                        <div className={cn('text-2xl font-bold', (event.data.confidence || event.data.consensusLevel / 100) >= 0.8 ? 'text-green-400' : (event.data.confidence || event.data.consensusLevel / 100) >= 0.6 ? 'text-amber-400' : 'text-red-400')}>
                                          {Math.round((event.data.confidence || event.data.consensusLevel / 100) * 100)}%
                                        </div>
                                        <div className="text-xs text-slate-400">Confidence</div>
                                      </div>
                                      <div className="h-10 w-px bg-slate-600" />
                                      <div className="flex-1">
                                        {event.data.voteSummary ? <>
                                            <div className="flex gap-2 mb-1">
                                              <span className="px-2 py-0.5 bg-green-600/30 text-green-400 rounded text-xs">
                                                {event.data.voteSummary.support || 0} Support
                                              </span>
                                              <span className="px-2 py-0.5 bg-amber-600/30 text-amber-400 rounded text-xs">
                                                {event.data.voteSummary.cautious || 0} Cautious
                                              </span>
                                              <span className="px-2 py-0.5 bg-red-600/30 text-red-400 rounded text-xs">
                                                {event.data.voteSummary.oppose || 0} Oppose
                                              </span>
                                            </div>
                                            <div className="text-xs text-slate-400">Agent Votes</div>
                                          </> : <>
                                            <div className="text-sm text-white font-medium">
                                              {(event.data.deliberation || event.data.agentResponses)?.length || 0} Agents
                                            </div>
                                            <div className="text-xs text-slate-400">Participated</div>
                                          </>}
                                      </div>
                                    </div>

                                    {/* Consensus */}
                                    {(event.data.consensus || event.data.synthesis) && <div className="p-3 bg-indigo-900/30 border border-indigo-700/50 rounded-lg">
                                        <div className="text-xs text-indigo-400 font-medium mb-1">🏛️ Council Consensus</div>
                                        <div className="text-white text-sm">{event.data.consensus || event.data.synthesis}</div>
                                      </div>}

                                    {/* Agent Deliberations - supports both sample format and backend format */}
                                    <div>
                                      <div className="text-sm font-medium text-slate-300 mb-2">
                                        Agent Deliberations ({(event.data.deliberation || event.data.agentResponses)?.length || 0})
                                      </div>
                                      <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {(event.data.deliberation || event.data.agentResponses)?.map((d: any, i: number) => <div key={i} className="p-3 bg-slate-800 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                              <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 bg-indigo-600 rounded text-xs text-white font-medium">
                                                  {d.agent || d.agentName || d.agentId}
                                                </span>
                                                {d.stance && <span className={cn('px-2 py-0.5 rounded text-xs font-medium', d.stance === 'support' ? 'bg-green-600/30 text-green-400' : d.stance === 'cautious' ? 'bg-amber-600/30 text-amber-400' : 'bg-red-600/30 text-red-400')}>
                                                    {d.stance === 'support' ? '✓ Support' : d.stance === 'cautious' ? '⚠ Cautious' : '✗ Oppose'}
                                                  </span>}
                                              </div>
                                              <span className="text-xs text-slate-400">
                                                {Math.round((d.confidence || 0) * 100)}% confident
                                              </span>
                                            </div>
                                            <p className="text-sm text-slate-300">{d.summary || d.response}</p>
                                          </div>)}
                                      </div>
                                    </div>
                                  </div> : event.type === 'premortem_run' && event.data.failureModes ? <div className="space-y-3">
                                    {/* Risk Summary */}
                                    <div className="flex items-center gap-4 p-3 bg-slate-800 rounded-lg">
                                      <div className="text-center">
                                        <div className={cn('text-2xl font-bold', event.data.riskScore >= 70 ? 'text-red-400' : event.data.riskScore >= 40 ? 'text-amber-400' : 'text-green-400')}>
                                          {event.data.riskScore}%
                                        </div>
                                        <div className="text-xs text-slate-400">Risk Score</div>
                                      </div>
                                      <div className="h-10 w-px bg-slate-600" />
                                      <div className="text-center">
                                        <div className="text-2xl font-bold text-white">
                                          ${(event.data.totalExposure / 1000000).toFixed(1)}M
                                        </div>
                                        <div className="text-xs text-slate-400">Exposure</div>
                                      </div>
                                      <div className="h-10 w-px bg-slate-600" />
                                      <div className="text-center flex-1">
                                        <div className={cn('text-lg font-semibold uppercase', event.data.recommendation === 'proceed' ? 'text-green-400' : event.data.recommendation === 'delay' ? 'text-amber-400' : 'text-red-400')}>
                                          {event.data.recommendation}
                                        </div>
                                        <div className="text-xs text-slate-400">Recommendation</div>
                                      </div>
                                    </div>

                                    {/* Failure Modes */}
                                    <div>
                                      <div className="text-sm font-medium text-slate-300 mb-2">
                                        Top Failure Modes ({event.data.failureModes.length})
                                      </div>
                                      <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {event.data.failureModes.map((fm: any, i: number) => <div key={i} className="p-3 bg-slate-800 rounded-lg flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                              <div className={cn('w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold', fm.probability >= 70 ? 'bg-red-500/20 text-red-400' : fm.probability >= 50 ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400')}>
                                                {fm.probability}%
                                              </div>
                                              <div>
                                                <div className="text-white font-medium">{fm.title}</div>
                                                <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-400">
                                                  {fm.category}
                                                </span>
                                              </div>
                                            </div>
                                            <div className="text-right">
                                              <div className="text-red-400 font-semibold">
                                                ${(fm.costImpact / 1000).toFixed(0)}K
                                              </div>
                                              <div className="text-xs text-slate-500">impact</div>
                                            </div>
                                          </div>)}
                                      </div>
                                    </div>
                                  </div> : event.type === 'ghost_board' && event.data.questions ? <div className="space-y-3">
                                    {/* Preparedness Score */}
                                    <div className="flex items-center gap-4 p-3 bg-slate-800 rounded-lg">
                                      <div className="text-center">
                                        <div className={cn('text-2xl font-bold', event.data.preparednessScore >= 80 ? 'text-green-400' : event.data.preparednessScore >= 60 ? 'text-amber-400' : 'text-red-400')}>
                                          {event.data.preparednessScore}%
                                        </div>
                                        <div className="text-xs text-slate-400">Preparedness</div>
                                      </div>
                                      <div className="h-10 w-px bg-slate-600" />
                                      <div className="text-center">
                                        <div className="text-2xl font-bold text-white">
                                          {event.data.questions?.length || 0}
                                        </div>
                                        <div className="text-xs text-slate-400">Questions</div>
                                      </div>
                                      <div className="h-10 w-px bg-slate-600" />
                                      <div className="text-center flex-1">
                                        <div className="text-lg font-semibold text-pink-400">
                                          {event.data.concerns?.length || 0} Concerns
                                        </div>
                                        <div className="text-xs text-slate-400">Raised</div>
                                      </div>
                                    </div>

                                    {/* Board Questions */}
                                    <div>
                                      <div className="text-sm font-medium text-slate-300 mb-2">
                                        Board Questions ({event.data.questions?.length || 0})
                                      </div>
                                      <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {event.data.questions?.map((q: any, i: number) => <div key={i} className="p-3 bg-slate-800 rounded-lg">
                                            <div className="flex items-center justify-between mb-1">
                                              <span className="px-2 py-0.5 bg-pink-600/30 text-pink-400 rounded text-xs font-medium">
                                                {q.member}
                                              </span>
                                              <div className="flex items-center gap-2">
                                                <span className={cn('px-2 py-0.5 rounded text-xs', q.difficulty === 'hard' ? 'bg-red-600/30 text-red-400' : q.difficulty === 'medium' ? 'bg-amber-600/30 text-amber-400' : 'bg-green-600/30 text-green-400')}>
                                                  {q.difficulty}
                                                </span>
                                                <span className={cn('text-xs', q.answered ? 'text-green-400' : 'text-red-400')}>
                                                  {q.answered ? '✓ Answered' : '✗ Unanswered'}
                                                </span>
                                              </div>
                                            </div>
                                            <p className="text-sm text-slate-300">{q.question}</p>
                                          </div>)}
                                      </div>
                                    </div>

                                    {/* Concerns */}
                                    {event.data.concerns && event.data.concerns.length > 0 && <div className="p-3 bg-pink-900/30 border border-pink-700/50 rounded-lg">
                                        <div className="text-xs text-pink-400 font-medium mb-2">👻 Board Concerns</div>
                                        <div className="flex flex-wrap gap-2">
                                          {event.data.concerns.map((c: string, i: number) => <span key={i} className="px-2 py-1 bg-pink-600/20 border border-pink-600/30 rounded text-xs text-pink-300">
                                              {c}
                                            </span>)}
                                        </div>
                                      </div>}
                                  </div> : event.type === 'context_added' && event.data ? <div className="p-3 bg-purple-900/30 border border-purple-700/50 rounded-lg">
                                    <div className="text-xs text-purple-400 font-medium mb-2">📄 Context Added</div>
                                    <div className="flex flex-wrap gap-3">
                                      {event.data.documents && <span className="text-sm text-slate-300">
                                          <span className="text-purple-400 font-medium">{event.data.documents}</span> documents attached
                                        </span>}
                                      {event.data.npv && <span className="text-sm text-slate-300">
                                          NPV: <span className="text-green-400 font-medium">${(event.data.npv / 1000000).toFixed(1)}M</span>
                                        </span>}
                                    </div>
                                  </div> : Object.keys(event.data).length > 0 ? <pre className="text-xs text-slate-300 bg-slate-800 rounded p-2 overflow-x-auto max-h-48">
                                    {JSON.stringify(event.data, null, 2)}
                                  </pre> : null}
                              </div> : stryMutAct_9fa48("45998") ? false : stryMutAct_9fa48("45997") ? true : (stryCov_9fa48("45997", "45998", "45999"), (stryMutAct_9fa48("46001") ? expandedEvent === event.id || event.data : stryMutAct_9fa48("46000") ? true : (stryCov_9fa48("46000", "46001"), (stryMutAct_9fa48("46003") ? expandedEvent !== event.id : stryMutAct_9fa48("46002") ? true : (stryCov_9fa48("46002", "46003"), expandedEvent === event.id)) && event.data)) && <div className="mt-3 pt-3 border-t border-slate-600">
                                {stryMutAct_9fa48("46006") ? event.agentsInvolved && event.agentsInvolved.length > 0 || <div className="mb-3 flex items-center gap-2 flex-wrap">
                                    <span className="text-slate-400 text-xs">Agents:</span>
                                    {event.agentsInvolved.map(agent => <span key={agent} className="px-2 py-0.5 bg-slate-600 rounded text-xs text-white">
                                        {agent}
                                      </span>)}
                                  </div> : stryMutAct_9fa48("46005") ? false : stryMutAct_9fa48("46004") ? true : (stryCov_9fa48("46004", "46005", "46006"), (stryMutAct_9fa48("46008") ? event.agentsInvolved || event.agentsInvolved.length > 0 : stryMutAct_9fa48("46007") ? true : (stryCov_9fa48("46007", "46008"), event.agentsInvolved && (stryMutAct_9fa48("46011") ? event.agentsInvolved.length <= 0 : stryMutAct_9fa48("46010") ? event.agentsInvolved.length >= 0 : stryMutAct_9fa48("46009") ? true : (stryCov_9fa48("46009", "46010", "46011"), event.agentsInvolved.length > 0)))) && <div className="mb-3 flex items-center gap-2 flex-wrap">
                                    <span className="text-slate-400 text-xs">Agents:</span>
                                    {event.agentsInvolved.map(stryMutAct_9fa48("46012") ? () => undefined : (stryCov_9fa48("46012"), agent => <span key={agent} className="px-2 py-0.5 bg-slate-600 rounded text-xs text-white">
                                        {agent}
                                      </span>))}
                                  </div>)}
                                
                                {/* Council Session formatted view */}
                                {(stryMutAct_9fa48("46015") ? event.type === 'council_session' || event.data.deliberation || event.data.agentResponses : stryMutAct_9fa48("46014") ? false : stryMutAct_9fa48("46013") ? true : (stryCov_9fa48("46013", "46014", "46015"), (stryMutAct_9fa48("46017") ? event.type !== 'council_session' : stryMutAct_9fa48("46016") ? true : (stryCov_9fa48("46016", "46017"), event.type === 'council_session')) && (stryMutAct_9fa48("46020") ? event.data.deliberation && event.data.agentResponses : stryMutAct_9fa48("46019") ? true : (stryCov_9fa48("46019", "46020"), event.data.deliberation || event.data.agentResponses)))) ? <div className="space-y-3">
                                    {/* Confidence & Consensus */}
                                    <div className="flex items-center gap-4 p-3 bg-slate-800 rounded-lg">
                                      <div className="text-center">
                                        <div className={cn('text-2xl font-bold', (stryMutAct_9fa48("46025") ? (event.data.confidence || event.data.consensusLevel / 100) < 0.8 : stryMutAct_9fa48("46024") ? (event.data.confidence || event.data.consensusLevel / 100) > 0.8 : stryMutAct_9fa48("46023") ? false : stryMutAct_9fa48("46022") ? true : (stryCov_9fa48("46022", "46023", "46024", "46025"), (stryMutAct_9fa48("46028") ? event.data.confidence && event.data.consensusLevel / 100 : stryMutAct_9fa48("46027") ? false : stryMutAct_9fa48("46026") ? true : (stryCov_9fa48("46026", "46027", "46028"), event.data.confidence || (stryMutAct_9fa48("46029") ? event.data.consensusLevel * 100 : (stryCov_9fa48("46029"), event.data.consensusLevel / 100)))) >= 0.8)) ? 'text-green-400' : (stryMutAct_9fa48("46034") ? (event.data.confidence || event.data.consensusLevel / 100) < 0.6 : stryMutAct_9fa48("46033") ? (event.data.confidence || event.data.consensusLevel / 100) > 0.6 : stryMutAct_9fa48("46032") ? false : stryMutAct_9fa48("46031") ? true : (stryCov_9fa48("46031", "46032", "46033", "46034"), (stryMutAct_9fa48("46037") ? event.data.confidence && event.data.consensusLevel / 100 : stryMutAct_9fa48("46036") ? false : stryMutAct_9fa48("46035") ? true : (stryCov_9fa48("46035", "46036", "46037"), event.data.confidence || (stryMutAct_9fa48("46038") ? event.data.consensusLevel * 100 : (stryCov_9fa48("46038"), event.data.consensusLevel / 100)))) >= 0.6)) ? 'text-amber-400' : 'text-red-400')}>
                                          {Math.round(stryMutAct_9fa48("46041") ? (event.data.confidence || event.data.consensusLevel / 100) / 100 : (stryCov_9fa48("46041"), (stryMutAct_9fa48("46044") ? event.data.confidence && event.data.consensusLevel / 100 : stryMutAct_9fa48("46043") ? false : stryMutAct_9fa48("46042") ? true : (stryCov_9fa48("46042", "46043", "46044"), event.data.confidence || (stryMutAct_9fa48("46045") ? event.data.consensusLevel * 100 : (stryCov_9fa48("46045"), event.data.consensusLevel / 100)))) * 100))}%
                                        </div>
                                        <div className="text-xs text-slate-400">Confidence</div>
                                      </div>
                                      <div className="h-10 w-px bg-slate-600" />
                                      <div className="flex-1">
                                        {event.data.voteSummary ? <>
                                            <div className="flex gap-2 mb-1">
                                              <span className="px-2 py-0.5 bg-green-600/30 text-green-400 rounded text-xs">
                                                {stryMutAct_9fa48("46048") ? event.data.voteSummary.support && 0 : stryMutAct_9fa48("46047") ? false : stryMutAct_9fa48("46046") ? true : (stryCov_9fa48("46046", "46047", "46048"), event.data.voteSummary.support || 0)} Support
                                              </span>
                                              <span className="px-2 py-0.5 bg-amber-600/30 text-amber-400 rounded text-xs">
                                                {stryMutAct_9fa48("46051") ? event.data.voteSummary.cautious && 0 : stryMutAct_9fa48("46050") ? false : stryMutAct_9fa48("46049") ? true : (stryCov_9fa48("46049", "46050", "46051"), event.data.voteSummary.cautious || 0)} Cautious
                                              </span>
                                              <span className="px-2 py-0.5 bg-red-600/30 text-red-400 rounded text-xs">
                                                {stryMutAct_9fa48("46054") ? event.data.voteSummary.oppose && 0 : stryMutAct_9fa48("46053") ? false : stryMutAct_9fa48("46052") ? true : (stryCov_9fa48("46052", "46053", "46054"), event.data.voteSummary.oppose || 0)} Oppose
                                              </span>
                                            </div>
                                            <div className="text-xs text-slate-400">Agent Votes</div>
                                          </> : <>
                                            <div className="text-sm text-white font-medium">
                                              {stryMutAct_9fa48("46057") ? (event.data.deliberation || event.data.agentResponses)?.length && 0 : stryMutAct_9fa48("46056") ? false : stryMutAct_9fa48("46055") ? true : (stryCov_9fa48("46055", "46056", "46057"), (stryMutAct_9fa48("46058") ? (event.data.deliberation || event.data.agentResponses).length : (stryCov_9fa48("46058"), (stryMutAct_9fa48("46061") ? event.data.deliberation && event.data.agentResponses : stryMutAct_9fa48("46060") ? false : stryMutAct_9fa48("46059") ? true : (stryCov_9fa48("46059", "46060", "46061"), event.data.deliberation || event.data.agentResponses))?.length)) || 0)} Agents
                                            </div>
                                            <div className="text-xs text-slate-400">Participated</div>
                                          </>}
                                      </div>
                                    </div>

                                    {/* Consensus */}
                                    {stryMutAct_9fa48("46064") ? event.data.consensus || event.data.synthesis || <div className="p-3 bg-indigo-900/30 border border-indigo-700/50 rounded-lg">
                                        <div className="text-xs text-indigo-400 font-medium mb-1">🏛️ Council Consensus</div>
                                        <div className="text-white text-sm">{event.data.consensus || event.data.synthesis}</div>
                                      </div> : stryMutAct_9fa48("46063") ? false : stryMutAct_9fa48("46062") ? true : (stryCov_9fa48("46062", "46063", "46064"), (stryMutAct_9fa48("46066") ? event.data.consensus && event.data.synthesis : stryMutAct_9fa48("46065") ? true : (stryCov_9fa48("46065", "46066"), event.data.consensus || event.data.synthesis)) && <div className="p-3 bg-indigo-900/30 border border-indigo-700/50 rounded-lg">
                                        <div className="text-xs text-indigo-400 font-medium mb-1">🏛️ Council Consensus</div>
                                        <div className="text-white text-sm">{stryMutAct_9fa48("46069") ? event.data.consensus && event.data.synthesis : stryMutAct_9fa48("46068") ? false : stryMutAct_9fa48("46067") ? true : (stryCov_9fa48("46067", "46068", "46069"), event.data.consensus || event.data.synthesis)}</div>
                                      </div>)}

                                    {/* Agent Deliberations - supports both sample format and backend format */}
                                    <div>
                                      <div className="text-sm font-medium text-slate-300 mb-2">
                                        Agent Deliberations ({stryMutAct_9fa48("46072") ? (event.data.deliberation || event.data.agentResponses)?.length && 0 : stryMutAct_9fa48("46071") ? false : stryMutAct_9fa48("46070") ? true : (stryCov_9fa48("46070", "46071", "46072"), (stryMutAct_9fa48("46073") ? (event.data.deliberation || event.data.agentResponses).length : (stryCov_9fa48("46073"), (stryMutAct_9fa48("46076") ? event.data.deliberation && event.data.agentResponses : stryMutAct_9fa48("46075") ? false : stryMutAct_9fa48("46074") ? true : (stryCov_9fa48("46074", "46075", "46076"), event.data.deliberation || event.data.agentResponses))?.length)) || 0)})
                                      </div>
                                      <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {stryMutAct_9fa48("46077") ? (event.data.deliberation || event.data.agentResponses).map((d: any, i: number) => <div key={i} className="p-3 bg-slate-800 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                              <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 bg-indigo-600 rounded text-xs text-white font-medium">
                                                  {d.agent || d.agentName || d.agentId}
                                                </span>
                                                {d.stance && <span className={cn('px-2 py-0.5 rounded text-xs font-medium', d.stance === 'support' ? 'bg-green-600/30 text-green-400' : d.stance === 'cautious' ? 'bg-amber-600/30 text-amber-400' : 'bg-red-600/30 text-red-400')}>
                                                    {d.stance === 'support' ? '✓ Support' : d.stance === 'cautious' ? '⚠ Cautious' : '✗ Oppose'}
                                                  </span>}
                                              </div>
                                              <span className="text-xs text-slate-400">
                                                {Math.round((d.confidence || 0) * 100)}% confident
                                              </span>
                                            </div>
                                            <p className="text-sm text-slate-300">{d.summary || d.response}</p>
                                          </div>) : (stryCov_9fa48("46077"), (stryMutAct_9fa48("46080") ? event.data.deliberation && event.data.agentResponses : stryMutAct_9fa48("46079") ? false : stryMutAct_9fa48("46078") ? true : (stryCov_9fa48("46078", "46079", "46080"), event.data.deliberation || event.data.agentResponses))?.map(stryMutAct_9fa48("46081") ? () => undefined : (stryCov_9fa48("46081"), (d: any, i: number) => <div key={i} className="p-3 bg-slate-800 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                              <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 bg-indigo-600 rounded text-xs text-white font-medium">
                                                  {stryMutAct_9fa48("46084") ? (d.agent || d.agentName) && d.agentId : stryMutAct_9fa48("46083") ? false : stryMutAct_9fa48("46082") ? true : (stryCov_9fa48("46082", "46083", "46084"), (stryMutAct_9fa48("46086") ? d.agent && d.agentName : stryMutAct_9fa48("46085") ? false : (stryCov_9fa48("46085", "46086"), d.agent || d.agentName)) || d.agentId)}
                                                </span>
                                                {stryMutAct_9fa48("46089") ? d.stance || <span className={cn('px-2 py-0.5 rounded text-xs font-medium', d.stance === 'support' ? 'bg-green-600/30 text-green-400' : d.stance === 'cautious' ? 'bg-amber-600/30 text-amber-400' : 'bg-red-600/30 text-red-400')}>
                                                    {d.stance === 'support' ? '✓ Support' : d.stance === 'cautious' ? '⚠ Cautious' : '✗ Oppose'}
                                                  </span> : stryMutAct_9fa48("46088") ? false : stryMutAct_9fa48("46087") ? true : (stryCov_9fa48("46087", "46088", "46089"), d.stance && <span className={cn('px-2 py-0.5 rounded text-xs font-medium', (stryMutAct_9fa48("46093") ? d.stance !== 'support' : stryMutAct_9fa48("46092") ? false : stryMutAct_9fa48("46091") ? true : (stryCov_9fa48("46091", "46092", "46093"), d.stance === 'support')) ? 'bg-green-600/30 text-green-400' : (stryMutAct_9fa48("46098") ? d.stance !== 'cautious' : stryMutAct_9fa48("46097") ? false : stryMutAct_9fa48("46096") ? true : (stryCov_9fa48("46096", "46097", "46098"), d.stance === 'cautious')) ? 'bg-amber-600/30 text-amber-400' : 'bg-red-600/30 text-red-400')}>
                                                    {(stryMutAct_9fa48("46104") ? d.stance !== 'support' : stryMutAct_9fa48("46103") ? false : stryMutAct_9fa48("46102") ? true : (stryCov_9fa48("46102", "46103", "46104"), d.stance === 'support')) ? '✓ Support' : (stryMutAct_9fa48("46109") ? d.stance !== 'cautious' : stryMutAct_9fa48("46108") ? false : stryMutAct_9fa48("46107") ? true : (stryCov_9fa48("46107", "46108", "46109"), d.stance === 'cautious')) ? '⚠ Cautious' : '✗ Oppose'}
                                                  </span>)}
                                              </div>
                                              <span className="text-xs text-slate-400">
                                                {Math.round(stryMutAct_9fa48("46113") ? (d.confidence || 0) / 100 : (stryCov_9fa48("46113"), (stryMutAct_9fa48("46116") ? d.confidence && 0 : stryMutAct_9fa48("46115") ? false : stryMutAct_9fa48("46114") ? true : (stryCov_9fa48("46114", "46115", "46116"), d.confidence || 0)) * 100))}% confident
                                              </span>
                                            </div>
                                            <p className="text-sm text-slate-300">{stryMutAct_9fa48("46119") ? d.summary && d.response : stryMutAct_9fa48("46118") ? false : stryMutAct_9fa48("46117") ? true : (stryCov_9fa48("46117", "46118", "46119"), d.summary || d.response)}</p>
                                          </div>)))}
                                      </div>
                                    </div>
                                  </div> : (stryMutAct_9fa48("46122") ? event.type === 'premortem_run' || event.data.failureModes : stryMutAct_9fa48("46121") ? false : stryMutAct_9fa48("46120") ? true : (stryCov_9fa48("46120", "46121", "46122"), (stryMutAct_9fa48("46124") ? event.type !== 'premortem_run' : stryMutAct_9fa48("46123") ? true : (stryCov_9fa48("46123", "46124"), event.type === 'premortem_run')) && event.data.failureModes)) ? <div className="space-y-3">
                                    {/* Risk Summary */}
                                    <div className="flex items-center gap-4 p-3 bg-slate-800 rounded-lg">
                                      <div className="text-center">
                                        <div className={cn('text-2xl font-bold', (stryMutAct_9fa48("46130") ? event.data.riskScore < 70 : stryMutAct_9fa48("46129") ? event.data.riskScore > 70 : stryMutAct_9fa48("46128") ? false : stryMutAct_9fa48("46127") ? true : (stryCov_9fa48("46127", "46128", "46129", "46130"), event.data.riskScore >= 70)) ? 'text-red-400' : (stryMutAct_9fa48("46135") ? event.data.riskScore < 40 : stryMutAct_9fa48("46134") ? event.data.riskScore > 40 : stryMutAct_9fa48("46133") ? false : stryMutAct_9fa48("46132") ? true : (stryCov_9fa48("46132", "46133", "46134", "46135"), event.data.riskScore >= 40)) ? 'text-amber-400' : 'text-green-400')}>
                                          {event.data.riskScore}%
                                        </div>
                                        <div className="text-xs text-slate-400">Risk Score</div>
                                      </div>
                                      <div className="h-10 w-px bg-slate-600" />
                                      <div className="text-center">
                                        <div className="text-2xl font-bold text-white">
                                          ${(stryMutAct_9fa48("46138") ? event.data.totalExposure * 1000000 : (stryCov_9fa48("46138"), event.data.totalExposure / 1000000)).toFixed(1)}M
                                        </div>
                                        <div className="text-xs text-slate-400">Exposure</div>
                                      </div>
                                      <div className="h-10 w-px bg-slate-600" />
                                      <div className="text-center flex-1">
                                        <div className={cn('text-lg font-semibold uppercase', (stryMutAct_9fa48("46142") ? event.data.recommendation !== 'proceed' : stryMutAct_9fa48("46141") ? false : stryMutAct_9fa48("46140") ? true : (stryCov_9fa48("46140", "46141", "46142"), event.data.recommendation === 'proceed')) ? 'text-green-400' : (stryMutAct_9fa48("46147") ? event.data.recommendation !== 'delay' : stryMutAct_9fa48("46146") ? false : stryMutAct_9fa48("46145") ? true : (stryCov_9fa48("46145", "46146", "46147"), event.data.recommendation === 'delay')) ? 'text-amber-400' : 'text-red-400')}>
                                          {event.data.recommendation}
                                        </div>
                                        <div className="text-xs text-slate-400">Recommendation</div>
                                      </div>
                                    </div>

                                    {/* Failure Modes */}
                                    <div>
                                      <div className="text-sm font-medium text-slate-300 mb-2">
                                        Top Failure Modes ({event.data.failureModes.length})
                                      </div>
                                      <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {event.data.failureModes.map(stryMutAct_9fa48("46151") ? () => undefined : (stryCov_9fa48("46151"), (fm: any, i: number) => <div key={i} className="p-3 bg-slate-800 rounded-lg flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                              <div className={cn('w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold', (stryMutAct_9fa48("46156") ? fm.probability < 70 : stryMutAct_9fa48("46155") ? fm.probability > 70 : stryMutAct_9fa48("46154") ? false : stryMutAct_9fa48("46153") ? true : (stryCov_9fa48("46153", "46154", "46155", "46156"), fm.probability >= 70)) ? 'bg-red-500/20 text-red-400' : (stryMutAct_9fa48("46161") ? fm.probability < 50 : stryMutAct_9fa48("46160") ? fm.probability > 50 : stryMutAct_9fa48("46159") ? false : stryMutAct_9fa48("46158") ? true : (stryCov_9fa48("46158", "46159", "46160", "46161"), fm.probability >= 50)) ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400')}>
                                                {fm.probability}%
                                              </div>
                                              <div>
                                                <div className="text-white font-medium">{fm.title}</div>
                                                <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-400">
                                                  {fm.category}
                                                </span>
                                              </div>
                                            </div>
                                            <div className="text-right">
                                              <div className="text-red-400 font-semibold">
                                                ${(stryMutAct_9fa48("46164") ? fm.costImpact * 1000 : (stryCov_9fa48("46164"), fm.costImpact / 1000)).toFixed(0)}K
                                              </div>
                                              <div className="text-xs text-slate-500">impact</div>
                                            </div>
                                          </div>))}
                                      </div>
                                    </div>
                                  </div> : (stryMutAct_9fa48("46167") ? event.type === 'ghost_board' || event.data.questions : stryMutAct_9fa48("46166") ? false : stryMutAct_9fa48("46165") ? true : (stryCov_9fa48("46165", "46166", "46167"), (stryMutAct_9fa48("46169") ? event.type !== 'ghost_board' : stryMutAct_9fa48("46168") ? true : (stryCov_9fa48("46168", "46169"), event.type === 'ghost_board')) && event.data.questions)) ? <div className="space-y-3">
                                    {/* Preparedness Score */}
                                    <div className="flex items-center gap-4 p-3 bg-slate-800 rounded-lg">
                                      <div className="text-center">
                                        <div className={cn('text-2xl font-bold', (stryMutAct_9fa48("46175") ? event.data.preparednessScore < 80 : stryMutAct_9fa48("46174") ? event.data.preparednessScore > 80 : stryMutAct_9fa48("46173") ? false : stryMutAct_9fa48("46172") ? true : (stryCov_9fa48("46172", "46173", "46174", "46175"), event.data.preparednessScore >= 80)) ? 'text-green-400' : (stryMutAct_9fa48("46180") ? event.data.preparednessScore < 60 : stryMutAct_9fa48("46179") ? event.data.preparednessScore > 60 : stryMutAct_9fa48("46178") ? false : stryMutAct_9fa48("46177") ? true : (stryCov_9fa48("46177", "46178", "46179", "46180"), event.data.preparednessScore >= 60)) ? 'text-amber-400' : 'text-red-400')}>
                                          {event.data.preparednessScore}%
                                        </div>
                                        <div className="text-xs text-slate-400">Preparedness</div>
                                      </div>
                                      <div className="h-10 w-px bg-slate-600" />
                                      <div className="text-center">
                                        <div className="text-2xl font-bold text-white">
                                          {stryMutAct_9fa48("46185") ? event.data.questions?.length && 0 : stryMutAct_9fa48("46184") ? false : stryMutAct_9fa48("46183") ? true : (stryCov_9fa48("46183", "46184", "46185"), (stryMutAct_9fa48("46186") ? event.data.questions.length : (stryCov_9fa48("46186"), event.data.questions?.length)) || 0)}
                                        </div>
                                        <div className="text-xs text-slate-400">Questions</div>
                                      </div>
                                      <div className="h-10 w-px bg-slate-600" />
                                      <div className="text-center flex-1">
                                        <div className="text-lg font-semibold text-pink-400">
                                          {stryMutAct_9fa48("46189") ? event.data.concerns?.length && 0 : stryMutAct_9fa48("46188") ? false : stryMutAct_9fa48("46187") ? true : (stryCov_9fa48("46187", "46188", "46189"), (stryMutAct_9fa48("46190") ? event.data.concerns.length : (stryCov_9fa48("46190"), event.data.concerns?.length)) || 0)} Concerns
                                        </div>
                                        <div className="text-xs text-slate-400">Raised</div>
                                      </div>
                                    </div>

                                    {/* Board Questions */}
                                    <div>
                                      <div className="text-sm font-medium text-slate-300 mb-2">
                                        Board Questions ({stryMutAct_9fa48("46193") ? event.data.questions?.length && 0 : stryMutAct_9fa48("46192") ? false : stryMutAct_9fa48("46191") ? true : (stryCov_9fa48("46191", "46192", "46193"), (stryMutAct_9fa48("46194") ? event.data.questions.length : (stryCov_9fa48("46194"), event.data.questions?.length)) || 0)})
                                      </div>
                                      <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {stryMutAct_9fa48("46195") ? event.data.questions.map((q: any, i: number) => <div key={i} className="p-3 bg-slate-800 rounded-lg">
                                            <div className="flex items-center justify-between mb-1">
                                              <span className="px-2 py-0.5 bg-pink-600/30 text-pink-400 rounded text-xs font-medium">
                                                {q.member}
                                              </span>
                                              <div className="flex items-center gap-2">
                                                <span className={cn('px-2 py-0.5 rounded text-xs', q.difficulty === 'hard' ? 'bg-red-600/30 text-red-400' : q.difficulty === 'medium' ? 'bg-amber-600/30 text-amber-400' : 'bg-green-600/30 text-green-400')}>
                                                  {q.difficulty}
                                                </span>
                                                <span className={cn('text-xs', q.answered ? 'text-green-400' : 'text-red-400')}>
                                                  {q.answered ? '✓ Answered' : '✗ Unanswered'}
                                                </span>
                                              </div>
                                            </div>
                                            <p className="text-sm text-slate-300">{q.question}</p>
                                          </div>) : (stryCov_9fa48("46195"), event.data.questions?.map(stryMutAct_9fa48("46196") ? () => undefined : (stryCov_9fa48("46196"), (q: any, i: number) => <div key={i} className="p-3 bg-slate-800 rounded-lg">
                                            <div className="flex items-center justify-between mb-1">
                                              <span className="px-2 py-0.5 bg-pink-600/30 text-pink-400 rounded text-xs font-medium">
                                                {q.member}
                                              </span>
                                              <div className="flex items-center gap-2">
                                                <span className={cn('px-2 py-0.5 rounded text-xs', (stryMutAct_9fa48("46200") ? q.difficulty !== 'hard' : stryMutAct_9fa48("46199") ? false : stryMutAct_9fa48("46198") ? true : (stryCov_9fa48("46198", "46199", "46200"), q.difficulty === 'hard')) ? 'bg-red-600/30 text-red-400' : (stryMutAct_9fa48("46205") ? q.difficulty !== 'medium' : stryMutAct_9fa48("46204") ? false : stryMutAct_9fa48("46203") ? true : (stryCov_9fa48("46203", "46204", "46205"), q.difficulty === 'medium')) ? 'bg-amber-600/30 text-amber-400' : 'bg-green-600/30 text-green-400')}>
                                                  {q.difficulty}
                                                </span>
                                                <span className={cn('text-xs', q.answered ? 'text-green-400' : 'text-red-400')}>
                                                  {q.answered ? '✓ Answered' : '✗ Unanswered'}
                                                </span>
                                              </div>
                                            </div>
                                            <p className="text-sm text-slate-300">{q.question}</p>
                                          </div>)))}
                                      </div>
                                    </div>

                                    {/* Concerns */}
                                    {stryMutAct_9fa48("46216") ? event.data.concerns && event.data.concerns.length > 0 || <div className="p-3 bg-pink-900/30 border border-pink-700/50 rounded-lg">
                                        <div className="text-xs text-pink-400 font-medium mb-2">👻 Board Concerns</div>
                                        <div className="flex flex-wrap gap-2">
                                          {event.data.concerns.map((c: string, i: number) => <span key={i} className="px-2 py-1 bg-pink-600/20 border border-pink-600/30 rounded text-xs text-pink-300">
                                              {c}
                                            </span>)}
                                        </div>
                                      </div> : stryMutAct_9fa48("46215") ? false : stryMutAct_9fa48("46214") ? true : (stryCov_9fa48("46214", "46215", "46216"), (stryMutAct_9fa48("46218") ? event.data.concerns || event.data.concerns.length > 0 : stryMutAct_9fa48("46217") ? true : (stryCov_9fa48("46217", "46218"), event.data.concerns && (stryMutAct_9fa48("46221") ? event.data.concerns.length <= 0 : stryMutAct_9fa48("46220") ? event.data.concerns.length >= 0 : stryMutAct_9fa48("46219") ? true : (stryCov_9fa48("46219", "46220", "46221"), event.data.concerns.length > 0)))) && <div className="p-3 bg-pink-900/30 border border-pink-700/50 rounded-lg">
                                        <div className="text-xs text-pink-400 font-medium mb-2">👻 Board Concerns</div>
                                        <div className="flex flex-wrap gap-2">
                                          {event.data.concerns.map(stryMutAct_9fa48("46222") ? () => undefined : (stryCov_9fa48("46222"), (c: string, i: number) => <span key={i} className="px-2 py-1 bg-pink-600/20 border border-pink-600/30 rounded text-xs text-pink-300">
                                              {c}
                                            </span>))}
                                        </div>
                                      </div>)}
                                  </div> : (stryMutAct_9fa48("46225") ? event.type === 'context_added' || event.data : stryMutAct_9fa48("46224") ? false : stryMutAct_9fa48("46223") ? true : (stryCov_9fa48("46223", "46224", "46225"), (stryMutAct_9fa48("46227") ? event.type !== 'context_added' : stryMutAct_9fa48("46226") ? true : (stryCov_9fa48("46226", "46227"), event.type === 'context_added')) && event.data)) ? <div className="p-3 bg-purple-900/30 border border-purple-700/50 rounded-lg">
                                    <div className="text-xs text-purple-400 font-medium mb-2">📄 Context Added</div>
                                    <div className="flex flex-wrap gap-3">
                                      {stryMutAct_9fa48("46231") ? event.data.documents || <span className="text-sm text-slate-300">
                                          <span className="text-purple-400 font-medium">{event.data.documents}</span> documents attached
                                        </span> : stryMutAct_9fa48("46230") ? false : stryMutAct_9fa48("46229") ? true : (stryCov_9fa48("46229", "46230", "46231"), event.data.documents && <span className="text-sm text-slate-300">
                                          <span className="text-purple-400 font-medium">{event.data.documents}</span> documents attached
                                        </span>)}
                                      {stryMutAct_9fa48("46234") ? event.data.npv || <span className="text-sm text-slate-300">
                                          NPV: <span className="text-green-400 font-medium">${(event.data.npv / 1000000).toFixed(1)}M</span>
                                        </span> : stryMutAct_9fa48("46233") ? false : stryMutAct_9fa48("46232") ? true : (stryCov_9fa48("46232", "46233", "46234"), event.data.npv && <span className="text-sm text-slate-300">
                                          NPV: <span className="text-green-400 font-medium">${(stryMutAct_9fa48("46235") ? event.data.npv * 1000000 : (stryCov_9fa48("46235"), event.data.npv / 1000000)).toFixed(1)}M</span>
                                        </span>)}
                                    </div>
                                  </div> : (stryMutAct_9fa48("46239") ? Object.keys(event.data).length <= 0 : stryMutAct_9fa48("46238") ? Object.keys(event.data).length >= 0 : stryMutAct_9fa48("46237") ? false : stryMutAct_9fa48("46236") ? true : (stryCov_9fa48("46236", "46237", "46238", "46239"), Object.keys(event.data).length > 0)) ? <pre className="text-xs text-slate-300 bg-slate-800 rounded p-2 overflow-x-auto max-h-48">
                                    {JSON.stringify(event.data, null, 2)}
                                  </pre> : null}
                              </div>)}
                          </div>
                        </div>))}
                    </div>
                  </div>
                </div>

                {/* Summary Cards - Clickable */}
                <div className="grid grid-cols-3 gap-4">
                  <button onClick={() => {
                // Scroll to pre-mortem events in timeline
                const pmEvent = selectedDecision.timeline.find(stryMutAct_9fa48("46241") ? () => undefined : (stryCov_9fa48("46241"), e => stryMutAct_9fa48("46244") ? e.type !== 'premortem_run' : stryMutAct_9fa48("46243") ? false : stryMutAct_9fa48("46242") ? true : (stryCov_9fa48("46242", "46243", "46244"), e.type === 'premortem_run')));
                if (stryMutAct_9fa48("46247") ? false : stryMutAct_9fa48("46246") ? true : (stryCov_9fa48("46246", "46247"), pmEvent)) setExpandedEvent(pmEvent.id);
              }} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-amber-500/50 hover:bg-slate-700/50 transition-all text-left group" title="Click to view Pre-Mortem details in timeline">
                    <div className="text-amber-400 text-2xl mb-2">💀</div>
                    <div className="text-white font-semibold group-hover:text-amber-300">Pre-Mortems</div>
                    <div className="text-3xl font-bold text-white mt-1">
                      {selectedDecision.preMortems.length}
                    </div>
                    {stryMutAct_9fa48("46250") ? selectedDecision.preMortems.length > 0 || <div className="text-slate-400 text-sm mt-1">
                        Last risk: {selectedDecision.preMortems[selectedDecision.preMortems.length - 1]?.riskScore || selectedDecision.preMortems[selectedDecision.preMortems.length - 1]?.highRisk}%
                      </div> : stryMutAct_9fa48("46249") ? false : stryMutAct_9fa48("46248") ? true : (stryCov_9fa48("46248", "46249", "46250"), (stryMutAct_9fa48("46253") ? selectedDecision.preMortems.length <= 0 : stryMutAct_9fa48("46252") ? selectedDecision.preMortems.length >= 0 : stryMutAct_9fa48("46251") ? true : (stryCov_9fa48("46251", "46252", "46253"), selectedDecision.preMortems.length > 0)) && <div className="text-slate-400 text-sm mt-1">
                        Last risk: {stryMutAct_9fa48("46256") ? selectedDecision.preMortems[selectedDecision.preMortems.length - 1]?.riskScore && selectedDecision.preMortems[selectedDecision.preMortems.length - 1]?.highRisk : stryMutAct_9fa48("46255") ? false : stryMutAct_9fa48("46254") ? true : (stryCov_9fa48("46254", "46255", "46256"), (stryMutAct_9fa48("46257") ? selectedDecision.preMortems[selectedDecision.preMortems.length - 1].riskScore : (stryCov_9fa48("46257"), selectedDecision.preMortems[stryMutAct_9fa48("46258") ? selectedDecision.preMortems.length + 1 : (stryCov_9fa48("46258"), selectedDecision.preMortems.length - 1)]?.riskScore)) || (stryMutAct_9fa48("46259") ? selectedDecision.preMortems[selectedDecision.preMortems.length - 1].highRisk : (stryCov_9fa48("46259"), selectedDecision.preMortems[stryMutAct_9fa48("46260") ? selectedDecision.preMortems.length + 1 : (stryCov_9fa48("46260"), selectedDecision.preMortems.length - 1)]?.highRisk)))}%
                      </div>)}
                    <div className="text-slate-500 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to view →
                    </div>
                  </button>
                  <button onClick={() => {
                // Scroll to council events in timeline
                const csEvent = selectedDecision.timeline.find(stryMutAct_9fa48("46262") ? () => undefined : (stryCov_9fa48("46262"), e => stryMutAct_9fa48("46265") ? e.type !== 'council_session' : stryMutAct_9fa48("46264") ? false : stryMutAct_9fa48("46263") ? true : (stryCov_9fa48("46263", "46264", "46265"), e.type === 'council_session')));
                if (stryMutAct_9fa48("46268") ? false : stryMutAct_9fa48("46267") ? true : (stryCov_9fa48("46267", "46268"), csEvent)) setExpandedEvent(csEvent.id);
              }} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-indigo-500/50 hover:bg-slate-700/50 transition-all text-left group" title="Click to view Council Session details in timeline">
                    <div className="text-indigo-400 text-2xl mb-2">🏛️</div>
                    <div className="text-white font-semibold group-hover:text-indigo-300">Council Sessions</div>
                    <div className="text-3xl font-bold text-white mt-1">
                      {selectedDecision.councilSessions.length}
                    </div>
                    <div className="text-slate-500 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to view →
                    </div>
                  </button>
                  <button onClick={() => {
                // Scroll to ghost board events in timeline
                const gbEvent = selectedDecision.timeline.find(stryMutAct_9fa48("46270") ? () => undefined : (stryCov_9fa48("46270"), e => stryMutAct_9fa48("46273") ? e.type !== 'ghost_board' : stryMutAct_9fa48("46272") ? false : stryMutAct_9fa48("46271") ? true : (stryCov_9fa48("46271", "46272", "46273"), e.type === 'ghost_board')));
                if (stryMutAct_9fa48("46276") ? false : stryMutAct_9fa48("46275") ? true : (stryCov_9fa48("46275", "46276"), gbEvent)) setExpandedEvent(gbEvent.id);
              }} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-pink-500/50 hover:bg-slate-700/50 transition-all text-left group" title="Click to view Ghost Board details in timeline">
                    <div className="text-pink-400 text-2xl mb-2">👻</div>
                    <div className="text-white font-semibold group-hover:text-pink-300">Board Simulations</div>
                    <div className="text-3xl font-bold text-white mt-1">
                      {selectedDecision.ghostBoardSimulations.length}
                    </div>
                    <div className="text-slate-500 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to view →
                    </div>
                  </button>
                </div>

                {/* Audit Export - Enhanced */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">🔒 Audit Export</h3>
                      <p className="text-slate-400 text-sm" title="Full decision record for regulators, auditors, or M&A diligence">
                        Export full decision record for compliance and auditing
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => {
                    // Generate a simple HTML/PDF-friendly format
                    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Decision Audit: ${selectedDecision.title}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
    h1 { color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
    h2 { color: #334155; margin-top: 30px; }
    .meta { background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .meta span { display: block; margin: 5px 0; }
    .timeline { border-left: 3px solid #3b82f6; padding-left: 20px; }
    .event { margin: 20px 0; padding: 10px; background: #f8fafc; border-radius: 8px; }
    .event-title { font-weight: bold; color: #1e293b; }
    .event-date { color: #64748b; font-size: 12px; }
    .hash { font-family: monospace; background: #dcfce7; padding: 10px; border-radius: 4px; color: #166534; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px; }
  </style>
</head>
<body>
  <h1>📋 Decision Audit Report</h1>
  <h2>${selectedDecision.title}</h2>
  <p>${selectedDecision.description}</p>
  
  <div class="meta">
    <span><strong>Decision ID:</strong> ${stryMutAct_9fa48("46281") ? selectedDecision.decisionId && selectedDecision.id : stryMutAct_9fa48("46280") ? false : stryMutAct_9fa48("46279") ? true : (stryCov_9fa48("46279", "46280", "46281"), selectedDecision.decisionId || selectedDecision.id)}</span>
    <span><strong>Status:</strong> ${selectedDecision.status}</span>
    <span><strong>Owner:</strong> ${stryMutAct_9fa48("46284") ? selectedDecision.owner?.role && 'N/A' : stryMutAct_9fa48("46283") ? false : stryMutAct_9fa48("46282") ? true : (stryCov_9fa48("46282", "46283", "46284"), (stryMutAct_9fa48("46285") ? selectedDecision.owner.role : (stryCov_9fa48("46285"), selectedDecision.owner?.role)) || 'N/A')} (${stryMutAct_9fa48("46289") ? selectedDecision.owner?.name && 'N/A' : stryMutAct_9fa48("46288") ? false : stryMutAct_9fa48("46287") ? true : (stryCov_9fa48("46287", "46288", "46289"), (stryMutAct_9fa48("46290") ? selectedDecision.owner.name : (stryCov_9fa48("46290"), selectedDecision.owner?.name)) || 'N/A')})</span>
    <span><strong>Created:</strong> ${new Date(selectedDecision.createdAt).toLocaleString()}</span>
    <span><strong>Last Updated:</strong> ${new Date(selectedDecision.updatedAt).toLocaleString()}</span>
    ${selectedDecision.budget ? `<span><strong>Budget:</strong> $${selectedDecision.budget.toLocaleString()}</span>` : ''}
  </div>

  <h2>Decision Timeline</h2>
  <div class="timeline">
    ${selectedDecision.timeline.map(stryMutAct_9fa48("46294") ? () => undefined : (stryCov_9fa48("46294"), e => `
      <div class="event">
        <div class="event-title">${e.title}</div>
        <div class="event-date">${new Date(e.timestamp).toLocaleString()}</div>
        <p>${e.summary}</p>
      </div>
    `)).join('')}
  </div>

  ${selectedDecision.finalDecision ? `
    <h2>Final Decision</h2>
    <p>${selectedDecision.finalDecision}</p>
  ` : ''}

  <h2>Cryptographic Verification</h2>
  <div class="hash">${stryMutAct_9fa48("46301") ? selectedDecision.auditHash && 'Hash not yet generated' : stryMutAct_9fa48("46300") ? false : stryMutAct_9fa48("46299") ? true : (stryCov_9fa48("46299", "46300", "46301"), selectedDecision.auditHash || 'Hash not yet generated')}</div>
  <p><em>This hash anchors the decision record to the Chronos immutable ledger. Any modification would change this hash.</em></p>

  <div class="footer">
    Generated by Datacendia Decision DNA • ${new Date().toLocaleString()} • For audit and compliance purposes
  </div>
</body>
</html>`;
                    const blob = new Blob(stryMutAct_9fa48("46303") ? [] : (stryCov_9fa48("46303"), [htmlContent]), stryMutAct_9fa48("46304") ? {} : (stryCov_9fa48("46304"), {
                      type: 'text/html'
                    }));
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `decision-${stryMutAct_9fa48("46310") ? selectedDecision.decisionId && selectedDecision.id : stryMutAct_9fa48("46309") ? false : stryMutAct_9fa48("46308") ? true : (stryCov_9fa48("46308", "46309", "46310"), selectedDecision.decisionId || selectedDecision.id)}-audit.html`;
                    a.click();
                  }} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium" title="Board-friendly HTML format for printing/PDF">
                        📄 Export PDF
                      </button>
                      <button onClick={() => {
                    const blob = new Blob(stryMutAct_9fa48("46312") ? [] : (stryCov_9fa48("46312"), [JSON.stringify(selectedDecision, null, 2)]), stryMutAct_9fa48("46313") ? {} : (stryCov_9fa48("46313"), {
                      type: 'application/json'
                    }));
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `decision-${stryMutAct_9fa48("46319") ? selectedDecision.decisionId && selectedDecision.id : stryMutAct_9fa48("46318") ? false : stryMutAct_9fa48("46317") ? true : (stryCov_9fa48("46317", "46318", "46319"), selectedDecision.decisionId || selectedDecision.id)}-audit.json`;
                    a.click();
                  }} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium" title="Machine-friendly JSON format for integrations">
                        📥 Export JSON
                      </button>
                    </div>
                  </div>
                </div>
              </div>}
          </div>
        </div>
      </div>
      
      {/* Page Guide */}
      <PageGuide {...GUIDES.decisionDNA} />
    </div>;
};
export default DecisionDNAPage;