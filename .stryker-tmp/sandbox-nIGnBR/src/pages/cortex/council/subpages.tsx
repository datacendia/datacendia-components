// @ts-nocheck
// =============================================================================
// DATACENDIA - COUNCIL SUB-PAGES
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
import { useNavigate, useParams } from 'react-router-dom';
import { cn, formatRelativeTime } from '../../../../lib/utils';

// =============================================================================
// DELIBERATION VIEW PAGE
// =============================================================================

export const DeliberationViewPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    deliberationId
  } = useParams();
  const [isLive, setIsLive] = useState(stryMutAct_9fa48("23153") ? false : (stryCov_9fa48("23153"), true));

  // Mock deliberation data
  const deliberation = stryMutAct_9fa48("23154") ? {} : (stryCov_9fa48("23154"), {
    id: stryMutAct_9fa48("23157") ? deliberationId && 'delib-1' : stryMutAct_9fa48("23156") ? false : stryMutAct_9fa48("23155") ? true : (stryCov_9fa48("23155", "23156", "23157"), deliberationId || 'delib-1'),
    query: 'What would be the impact of expanding into the European market in Q2 2026?',
    status: 'in_progress',
    phase: 'cross_examination',
    progress: 65,
    startedAt: new Date(stryMutAct_9fa48("23162") ? Date.now() + 1800000 : (stryCov_9fa48("23162"), Date.now() - 1800000)),
    participants: stryMutAct_9fa48("23163") ? [] : (stryCov_9fa48("23163"), ['chief', 'cfo', 'coo', 'cro', 'risk'])
  });
  const agentInfo: Record<string, {
    name: string;
    icon: string;
    color: string;
  }> = stryMutAct_9fa48("23169") ? {} : (stryCov_9fa48("23169"), {
    chief: stryMutAct_9fa48("23170") ? {} : (stryCov_9fa48("23170"), {
      name: 'CendiaChief',
      icon: '👔',
      color: '#6366F1'
    }),
    cfo: stryMutAct_9fa48("23174") ? {} : (stryCov_9fa48("23174"), {
      name: 'CendiaCFO',
      icon: '💰',
      color: '#10B981'
    }),
    coo: stryMutAct_9fa48("23178") ? {} : (stryCov_9fa48("23178"), {
      name: 'CendiaCOO',
      icon: '⚙️',
      color: '#F59E0B'
    }),
    cro: stryMutAct_9fa48("23182") ? {} : (stryCov_9fa48("23182"), {
      name: 'CendiaCRO',
      icon: '📈',
      color: '#8B5CF6'
    }),
    risk: stryMutAct_9fa48("23186") ? {} : (stryCov_9fa48("23186"), {
      name: 'CendiaRisk',
      icon: '⚠️',
      color: '#F97316'
    })
  });
  const transcript = stryMutAct_9fa48("23190") ? [] : (stryCov_9fa48("23190"), [stryMutAct_9fa48("23191") ? {} : (stryCov_9fa48("23191"), {
    agent: 'chief',
    phase: 'initial',
    message: "I'll coordinate this analysis. Let me gather perspectives from the relevant agents on the European expansion question.",
    timestamp: new Date(stryMutAct_9fa48("23195") ? Date.now() + 1800000 : (stryCov_9fa48("23195"), Date.now() - 1800000))
  }), stryMutAct_9fa48("23196") ? {} : (stryCov_9fa48("23196"), {
    agent: 'cfo',
    phase: 'initial',
    message: "From a financial perspective, European expansion in Q2 2026 would require approximately $15M in initial investment. Based on our current cash position of $45M and projected Q1 revenues, this is feasible but would reduce our runway to 18 months.",
    timestamp: new Date(stryMutAct_9fa48("23200") ? Date.now() + 1700000 : (stryCov_9fa48("23200"), Date.now() - 1700000))
  }), stryMutAct_9fa48("23201") ? {} : (stryCov_9fa48("23201"), {
    agent: 'coo',
    phase: 'initial',
    message: "Operationally, we'd need to establish a legal entity, hire 15-20 local staff, and set up EU data infrastructure for GDPR compliance. Timeline estimate: 4-6 months prep before launch.",
    timestamp: new Date(stryMutAct_9fa48("23205") ? Date.now() + 1600000 : (stryCov_9fa48("23205"), Date.now() - 1600000))
  }), stryMutAct_9fa48("23206") ? {} : (stryCov_9fa48("23206"), {
    agent: 'cro',
    phase: 'initial',
    message: "The European market represents a $2.3B TAM for our segment. Our analysis shows 3 primary competitors with <40% market penetration. I project we could capture 5% market share within 18 months, translating to ~$8-12M ARR.",
    timestamp: new Date(stryMutAct_9fa48("23210") ? Date.now() + 1500000 : (stryCov_9fa48("23210"), Date.now() - 1500000))
  }), stryMutAct_9fa48("23211") ? {} : (stryCov_9fa48("23211"), {
    agent: 'risk',
    phase: 'initial',
    message: "Key risks include: currency fluctuation (EUR/USD), regulatory complexity across EU member states, and potential economic slowdown in the Eurozone. I recommend building in a 20% contingency buffer.",
    timestamp: new Date(stryMutAct_9fa48("23215") ? Date.now() + 1400000 : (stryCov_9fa48("23215"), Date.now() - 1400000))
  }), stryMutAct_9fa48("23216") ? {} : (stryCov_9fa48("23216"), {
    agent: 'cfo',
    phase: 'cross_examination',
    message: "CendiaRisk, given the 20% contingency you mentioned, what's the worst-case scenario for our cash position if revenue projections are 30% below target?",
    timestamp: new Date(stryMutAct_9fa48("23220") ? Date.now() + 1200000 : (stryCov_9fa48("23220"), Date.now() - 1200000))
  }), stryMutAct_9fa48("23221") ? {} : (stryCov_9fa48("23221"), {
    agent: 'risk',
    phase: 'cross_examination',
    message: "In a 30% revenue shortfall scenario with 20% contingency, we'd have 12 months runway remaining. This is below our 15-month threshold. I'd recommend either reducing initial investment or securing a line of credit.",
    timestamp: new Date(stryMutAct_9fa48("23225") ? Date.now() + 1100000 : (stryCov_9fa48("23225"), Date.now() - 1100000))
  }), stryMutAct_9fa48("23226") ? {} : (stryCov_9fa48("23226"), {
    agent: 'cro',
    phase: 'cross_examination',
    message: "I want to challenge the 30% shortfall assumption. Our pipeline data shows strong European demand - 45 qualified leads from EMEA in Q4 alone. A more realistic downside is 15%.",
    timestamp: new Date(stryMutAct_9fa48("23230") ? Date.now() + 1000000 : (stryCov_9fa48("23230"), Date.now() - 1000000))
  })]);
  const phases = stryMutAct_9fa48("23231") ? [] : (stryCov_9fa48("23231"), [stryMutAct_9fa48("23232") ? {} : (stryCov_9fa48("23232"), {
    id: 'initial',
    name: 'Initial Analysis',
    complete: stryMutAct_9fa48("23235") ? false : (stryCov_9fa48("23235"), true)
  }), stryMutAct_9fa48("23236") ? {} : (stryCov_9fa48("23236"), {
    id: 'cross_examination',
    name: 'Cross-Examination',
    complete: stryMutAct_9fa48("23239") ? true : (stryCov_9fa48("23239"), false),
    active: stryMutAct_9fa48("23240") ? false : (stryCov_9fa48("23240"), true)
  }), stryMutAct_9fa48("23241") ? {} : (stryCov_9fa48("23241"), {
    id: 'synthesis',
    name: 'Synthesis',
    complete: stryMutAct_9fa48("23244") ? true : (stryCov_9fa48("23244"), false)
  }), stryMutAct_9fa48("23245") ? {} : (stryCov_9fa48("23245"), {
    id: 'ethics',
    name: 'Ethics Check',
    complete: stryMutAct_9fa48("23248") ? true : (stryCov_9fa48("23248"), false)
  }), stryMutAct_9fa48("23249") ? {} : (stryCov_9fa48("23249"), {
    id: 'final',
    name: 'Final Recommendation',
    complete: stryMutAct_9fa48("23252") ? true : (stryCov_9fa48("23252"), false)
  })]);
  return <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={stryMutAct_9fa48("23253") ? () => undefined : (stryCov_9fa48("23253"), () => navigate('/cortex/council'))} className="text-sm text-neutral-500 hover:text-primary-600 mb-2">
            ← Back to Council
          </button>
          <h1 className="text-2xl font-bold text-neutral-900">Deliberation in Progress</h1>
        </div>
        <div className="flex items-center gap-4">
          {stryMutAct_9fa48("23257") ? isLive || <span className="flex items-center gap-2 px-3 py-1.5 bg-success-light text-success-dark rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-success-main rounded-full animate-pulse" />
              Live
            </span> : stryMutAct_9fa48("23256") ? false : stryMutAct_9fa48("23255") ? true : (stryCov_9fa48("23255", "23256", "23257"), isLive && <span className="flex items-center gap-2 px-3 py-1.5 bg-success-light text-success-dark rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-success-main rounded-full animate-pulse" />
              Live
            </span>)}
          <button onClick={stryMutAct_9fa48("23258") ? () => undefined : (stryCov_9fa48("23258"), () => setIsLive(stryMutAct_9fa48("23259") ? isLive : (stryCov_9fa48("23259"), !isLive)))} className="px-4 py-2 border border-neutral-300 rounded-lg text-sm hover:bg-neutral-50">
            {isLive ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>

      {/* Query Card */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 mb-6 text-white">
        <p className="text-sm text-white/70 mb-2">Query</p>
        <p className="text-xl font-medium">{deliberation.query}</p>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex -space-x-2">
            {deliberation.participants.map(stryMutAct_9fa48("23262") ? () => undefined : (stryCov_9fa48("23262"), p => <div key={p} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center" style={stryMutAct_9fa48("23263") ? {} : (stryCov_9fa48("23263"), {
            backgroundColor: agentInfo[p].color
          })} title={agentInfo[p].name}>
                <span className="text-sm">{agentInfo[p].icon}</span>
              </div>))}
          </div>
          <span className="text-sm text-white/70">
            {deliberation.participants.length} agents participating
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Transcript */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="p-4 border-b border-neutral-200">
            <h2 className="font-semibold text-neutral-900">Deliberation Transcript</h2>
          </div>
          <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
            {transcript.map(stryMutAct_9fa48("23264") ? () => undefined : (stryCov_9fa48("23264"), (msg, i) => <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={stryMutAct_9fa48("23265") ? {} : (stryCov_9fa48("23265"), {
              backgroundColor: agentInfo[msg.agent].color
            })}>
                  <span className="text-lg">{agentInfo[msg.agent].icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-neutral-900">{agentInfo[msg.agent].name}</span>
                    <span className="px-2 py-0.5 bg-neutral-100 text-neutral-500 text-xs rounded capitalize">
                      {msg.phase.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-neutral-400">{formatRelativeTime(msg.timestamp)}</span>
                  </div>
                  <p className="text-neutral-700">{msg.message}</p>
                </div>
              </div>))}
            
            {stryMutAct_9fa48("23270") ? isLive || <div className="flex gap-4 items-center text-neutral-400">
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center animate-pulse">
                  <span>💭</span>
                </div>
                <span className="text-sm">Agents are deliberating...</span>
              </div> : stryMutAct_9fa48("23269") ? false : stryMutAct_9fa48("23268") ? true : (stryCov_9fa48("23268", "23269", "23270"), isLive && <div className="flex gap-4 items-center text-neutral-400">
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center animate-pulse">
                  <span>💭</span>
                </div>
                <span className="text-sm">Agents are deliberating...</span>
              </div>)}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Phase Progress */}
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <h3 className="font-semibold text-neutral-900 mb-4">Deliberation Phases</h3>
            <div className="space-y-3">
              {phases.map(stryMutAct_9fa48("23271") ? () => undefined : (stryCov_9fa48("23271"), (phase, i) => <div key={phase.id} className="flex items-center gap-3">
                  <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium', phase.complete ? 'bg-success-main text-white' : phase.active ? 'bg-primary-600 text-white' : 'bg-neutral-200 text-neutral-500')}>
                    {phase.complete ? '✓' : stryMutAct_9fa48("23277") ? i - 1 : (stryCov_9fa48("23277"), i + 1)}
                  </div>
                  <span className={cn('text-sm', phase.active ? 'font-medium text-neutral-900' : 'text-neutral-500')}>
                    {phase.name}
                  </span>
                </div>))}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <h3 className="font-semibold text-neutral-900 mb-4">Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 rounded-lg">
                📤 Export Transcript
              </button>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 rounded-lg">
                🔔 Set Alert
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-error-main hover:bg-error-light rounded-lg">
                ⏹️ Cancel Deliberation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};

// =============================================================================
// AGENT PROFILE PAGE
// =============================================================================

export const AgentProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    agentId
  } = useParams();
  const agents: Record<string, any> = stryMutAct_9fa48("23282") ? {} : (stryCov_9fa48("23282"), {
    chief: stryMutAct_9fa48("23283") ? {} : (stryCov_9fa48("23283"), {
      id: 'chief',
      name: 'CendiaChief',
      title: 'Chief of Staff',
      icon: '👔',
      color: '#6366F1',
      status: 'online',
      description: 'The orchestrator and coordinator of all agent activities. Synthesizes insights from specialized agents and provides executive-level recommendations.',
      capabilities: stryMutAct_9fa48("23291") ? [] : (stryCov_9fa48("23291"), ['Multi-agent coordination', 'Executive summary generation', 'Strategic recommendation synthesis', 'Cross-functional analysis', 'Decision facilitation']),
      stats: stryMutAct_9fa48("23297") ? {} : (stryCov_9fa48("23297"), {
        deliberationsLed: 234,
        avgConfidence: 87,
        avgResponseTime: '4.2s',
        satisfactionScore: 92
      }),
      recentActivity: stryMutAct_9fa48("23299") ? [] : (stryCov_9fa48("23299"), [stryMutAct_9fa48("23300") ? {} : (stryCov_9fa48("23300"), {
        action: 'Completed deliberation on Q1 budget allocation',
        time: new Date(stryMutAct_9fa48("23302") ? Date.now() + 3600000 : (stryCov_9fa48("23302"), Date.now() - 3600000))
      }), stryMutAct_9fa48("23303") ? {} : (stryCov_9fa48("23303"), {
        action: 'Synthesized European expansion analysis',
        time: new Date(stryMutAct_9fa48("23305") ? Date.now() + 7200000 : (stryCov_9fa48("23305"), Date.now() - 7200000))
      }), stryMutAct_9fa48("23306") ? {} : (stryCov_9fa48("23306"), {
        action: 'Coordinated security audit review',
        time: new Date(stryMutAct_9fa48("23308") ? Date.now() + 86400000 : (stryCov_9fa48("23308"), Date.now() - 86400000))
      })])
    }),
    cfo: stryMutAct_9fa48("23309") ? {} : (stryCov_9fa48("23309"), {
      id: 'cfo',
      name: 'CendiaCFO',
      title: 'Chief Financial Officer',
      icon: '💰',
      color: '#10B981',
      status: 'online',
      description: 'Financial intelligence agent specializing in budgeting, forecasting, cash flow analysis, and financial strategy.',
      capabilities: stryMutAct_9fa48("23317") ? [] : (stryCov_9fa48("23317"), ['Financial modeling', 'Cash flow forecasting', 'Budget analysis', 'Investment evaluation', 'Risk-adjusted returns']),
      stats: stryMutAct_9fa48("23323") ? {} : (stryCov_9fa48("23323"), {
        analysisCompleted: 456,
        avgConfidence: 91,
        avgResponseTime: '3.8s',
        satisfactionScore: 94
      }),
      recentActivity: stryMutAct_9fa48("23325") ? [] : (stryCov_9fa48("23325"), [stryMutAct_9fa48("23326") ? {} : (stryCov_9fa48("23326"), {
        action: 'Analyzed Q4 revenue projections',
        time: new Date(stryMutAct_9fa48("23328") ? Date.now() + 1800000 : (stryCov_9fa48("23328"), Date.now() - 1800000))
      }), stryMutAct_9fa48("23329") ? {} : (stryCov_9fa48("23329"), {
        action: 'Reviewed vendor contract terms',
        time: new Date(stryMutAct_9fa48("23331") ? Date.now() + 3600000 : (stryCov_9fa48("23331"), Date.now() - 3600000))
      }), stryMutAct_9fa48("23332") ? {} : (stryCov_9fa48("23332"), {
        action: 'Generated cash flow forecast',
        time: new Date(stryMutAct_9fa48("23334") ? Date.now() + 7200000 : (stryCov_9fa48("23334"), Date.now() - 7200000))
      })])
    })
  });
  const agent = stryMutAct_9fa48("23337") ? agents[agentId || 'chief'] && agents.chief : stryMutAct_9fa48("23336") ? false : stryMutAct_9fa48("23335") ? true : (stryCov_9fa48("23335", "23336", "23337"), agents[stryMutAct_9fa48("23340") ? agentId && 'chief' : stryMutAct_9fa48("23339") ? false : stryMutAct_9fa48("23338") ? true : (stryCov_9fa48("23338", "23339", "23340"), agentId || 'chief')] || agents.chief);
  return <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <button onClick={stryMutAct_9fa48("23342") ? () => undefined : (stryCov_9fa48("23342"), () => navigate('/cortex/council'))} className="text-sm text-neutral-500 hover:text-primary-600 mb-4">
        ← Back to Council
      </button>

      {/* Agent Card */}
      <div className="bg-white rounded-xl border border-neutral-200 p-8 mb-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl" style={stryMutAct_9fa48("23344") ? {} : (stryCov_9fa48("23344"), {
          backgroundColor: agent.color + '20'
        })}>
            {agent.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-neutral-900">{agent.name}</h1>
              <span className={cn('flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium', (stryMutAct_9fa48("23349") ? agent.status !== 'online' : stryMutAct_9fa48("23348") ? false : stryMutAct_9fa48("23347") ? true : (stryCov_9fa48("23347", "23348", "23349"), agent.status === 'online')) ? 'bg-success-light text-success-dark' : 'bg-neutral-100 text-neutral-500')}>
                <span className={cn('w-2 h-2 rounded-full', (stryMutAct_9fa48("23356") ? agent.status !== 'online' : stryMutAct_9fa48("23355") ? false : stryMutAct_9fa48("23354") ? true : (stryCov_9fa48("23354", "23355", "23356"), agent.status === 'online')) ? 'bg-success-main' : 'bg-neutral-400')} />
                {agent.status}
              </span>
            </div>
            <p className="text-lg text-neutral-500 mb-4">{agent.title}</p>
            <p className="text-neutral-600">{agent.description}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Stats */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="font-semibold text-neutral-900 mb-4">Performance Stats</h2>
          <div className="space-y-4">
            {Object.entries(agent.stats).map(stryMutAct_9fa48("23360") ? () => undefined : (stryCov_9fa48("23360"), ([key, value]) => <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-neutral-500 capitalize">
                  {stryMutAct_9fa48("23361") ? key.replace(/([A-Z])/g, ' $1') : (stryCov_9fa48("23361"), key.replace(stryMutAct_9fa48("23362") ? /([^A-Z])/g : (stryCov_9fa48("23362"), /([A-Z])/g), ' $1').trim())}
                </span>
                <span className="font-semibold text-neutral-900">{String(value)}{(stryMutAct_9fa48("23366") ? key.includes('Confidence') && key.includes('Score') : stryMutAct_9fa48("23365") ? false : stryMutAct_9fa48("23364") ? true : (stryCov_9fa48("23364", "23365", "23366"), key.includes('Confidence') || key.includes('Score'))) ? '%' : ''}</span>
              </div>))}
          </div>
        </div>

        {/* Capabilities */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="font-semibold text-neutral-900 mb-4">Capabilities</h2>
          <ul className="space-y-2">
            {agent.capabilities.map(stryMutAct_9fa48("23371") ? () => undefined : (stryCov_9fa48("23371"), (cap: string) => <li key={cap} className="flex items-center gap-2 text-sm text-neutral-600">
                <span className="text-success-main">✓</span>
                {cap}
              </li>))}
          </ul>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="font-semibold text-neutral-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {agent.recentActivity.map(stryMutAct_9fa48("23372") ? () => undefined : (stryCov_9fa48("23372"), (activity: any, i: number) => <div key={i} className="border-l-2 border-neutral-200 pl-4">
                <p className="text-sm text-neutral-900">{activity.action}</p>
                <p className="text-xs text-neutral-400 mt-1">{formatRelativeTime(activity.time)}</p>
              </div>))}
          </div>
        </div>
      </div>

      {/* Ask This Agent */}
      <div className="mt-6 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Ask {agent.name}</h2>
        <div className="flex gap-4">
          <input type="text" placeholder={`Ask ${agent.name} a question...`} className="flex-1 h-12 px-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30" />
          <button className="px-6 h-12 bg-white text-primary-600 font-medium rounded-lg hover:bg-white/90 transition-colors">
            Ask
          </button>
        </div>
      </div>
    </div>;
};
export default DeliberationViewPage;