/**
 * DecisionLifecycle - A unified visualization of how decisions flow through Datacendia modules
 * 
 * Shows the complete journey:
 * 1. Question asked in Council
 * 2. Council produces synthesis + confidence + dissent
 * 3. Output becomes Decision DNA record
 * 4. Crucible runs stress scenarios
 * 5. Vox runs stakeholder assembly (optional)
 * 6. Panopticon/Aegis checks regulatory and security exposure
 * 7. Eternal archives final decision pack
 */
// @ts-nocheck
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
import React, { useState } from 'react';
import { MessageSquare, Brain, Dna, FlaskConical, Users, Shield, Archive, ArrowRight, CheckCircle, Clock, AlertTriangle, Play, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

// Decision lifecycle stages
const LIFECYCLE_STAGES = stryMutAct_9fa48("1130") ? [] : (stryCov_9fa48("1130"), [stryMutAct_9fa48("1131") ? {} : (stryCov_9fa48("1131"), {
  id: 'council',
  name: 'Council Deliberation',
  module: 'CendiaCouncil™',
  icon: <MessageSquare className="w-6 h-6" />,
  color: 'cyan',
  description: 'Question submitted, agents deliberate, synthesis produced',
  outputs: stryMutAct_9fa48("1137") ? [] : (stryCov_9fa48("1137"), ['Executive synthesis', 'Confidence score', 'Dissent registry', 'Cross-examination log']),
  link: '/cortex/intelligence/council'
}), stryMutAct_9fa48("1143") ? {} : (stryCov_9fa48("1143"), {
  id: 'dna',
  name: 'Decision DNA Record',
  module: 'CendiaDecisionDNA™',
  icon: <Dna className="w-6 h-6" />,
  color: 'purple',
  description: 'Decision recorded with full provenance and rationale',
  outputs: stryMutAct_9fa48("1149") ? [] : (stryCov_9fa48("1149"), ['Immutable record', 'Linked evidence', 'Stakeholder sign-offs', 'Version history']),
  link: '/cortex/intelligence/decision-dna'
}), stryMutAct_9fa48("1155") ? {} : (stryCov_9fa48("1155"), {
  id: 'crucible',
  name: 'Stress Testing',
  module: 'CendiaCrucible™',
  icon: <FlaskConical className="w-6 h-6" />,
  color: 'orange',
  description: 'Decision tested against multiple failure scenarios',
  outputs: stryMutAct_9fa48("1161") ? [] : (stryCov_9fa48("1161"), ['Resilience score', 'Break points', 'Mitigation plan', 'Monte Carlo results']),
  link: '/sovereign/crucible',
  optional: stryMutAct_9fa48("1167") ? false : (stryCov_9fa48("1167"), true)
}), stryMutAct_9fa48("1168") ? {} : (stryCov_9fa48("1168"), {
  id: 'vox',
  name: 'Stakeholder Assembly',
  module: 'CendiaVox™',
  icon: <Users className="w-6 h-6" />,
  color: 'teal',
  description: 'Stakeholder voices gathered, vetoes checked',
  outputs: stryMutAct_9fa48("1174") ? [] : (stryCov_9fa48("1174"), ['Voice assembly', 'Veto check', 'Sentiment analysis', 'Resolution record']),
  link: '/sovereign/vox',
  optional: stryMutAct_9fa48("1180") ? false : (stryCov_9fa48("1180"), true)
}), stryMutAct_9fa48("1181") ? {} : (stryCov_9fa48("1181"), {
  id: 'compliance',
  name: 'Compliance & Security',
  module: 'CendiaPanopticon™ + CendiaAegis™',
  icon: <Shield className="w-6 h-6" />,
  color: 'emerald',
  description: 'Regulatory and security exposure assessed',
  outputs: stryMutAct_9fa48("1187") ? [] : (stryCov_9fa48("1187"), ['Compliance impact', 'Security assessment', 'Risk flags', 'Remediation items']),
  link: '/sovereign/panopticon'
}), stryMutAct_9fa48("1193") ? {} : (stryCov_9fa48("1193"), {
  id: 'eternal',
  name: 'Archive',
  module: 'CendiaEternal™',
  icon: <Archive className="w-6 h-6" />,
  color: 'amber',
  description: 'Final decision pack archived for long-term preservation',
  outputs: stryMutAct_9fa48("1199") ? [] : (stryCov_9fa48("1199"), ['Archived artifact', 'Hash chain entry', 'Successor access', 'Retention policy']),
  link: '/sovereign/eternal'
})]);

// Example decision journey data
const EXAMPLE_JOURNEY = stryMutAct_9fa48("1205") ? {} : (stryCov_9fa48("1205"), {
  id: 'dec-2025-042',
  title: 'Facility Expansion Phase 2',
  status: 'in_progress',
  currentStage: 'vox',
  stages: stryMutAct_9fa48("1210") ? {} : (stryCov_9fa48("1210"), {
    council: stryMutAct_9fa48("1211") ? {} : (stryCov_9fa48("1211"), {
      status: 'completed',
      timestamp: '2025-01-10 09:00',
      confidence: 82,
      hasDissent: stryMutAct_9fa48("1214") ? false : (stryCov_9fa48("1214"), true)
    }),
    dna: stryMutAct_9fa48("1215") ? {} : (stryCov_9fa48("1215"), {
      status: 'completed',
      timestamp: '2025-01-10 09:15',
      recordId: 'DNA-2025-042'
    }),
    crucible: stryMutAct_9fa48("1219") ? {} : (stryCov_9fa48("1219"), {
      status: 'completed',
      timestamp: '2025-01-10 10:30',
      resilienceScore: 68,
      breakPoints: 3
    }),
    vox: stryMutAct_9fa48("1222") ? {} : (stryCov_9fa48("1222"), {
      status: 'vetoed',
      timestamp: '2025-01-10 11:00',
      vetoBy: 'Environment',
      reason: 'Irreversible harm'
    }),
    compliance: stryMutAct_9fa48("1227") ? {} : (stryCov_9fa48("1227"), {
      status: 'pending'
    }),
    eternal: stryMutAct_9fa48("1229") ? {} : (stryCov_9fa48("1229"), {
      status: 'pending'
    })
  })
});
interface DecisionLifecycleProps {
  variant?: 'full' | 'compact' | 'inline';
  showExample?: boolean;
  onStageClick?: (stageId: string, link: string) => void;
}
export const DecisionLifecycle: React.FC<DecisionLifecycleProps> = ({
  variant = 'full',
  showExample = stryMutAct_9fa48("1232") ? false : (stryCov_9fa48("1232"), true),
  onStageClick
}) => {
  const [expandedStage, setExpandedStage] = useState<string | null>(null);
  const [showJourneyExample, setShowJourneyExample] = useState(showExample);
  const getColorClasses = (color: string, isActive: boolean = stryMutAct_9fa48("1234") ? true : (stryCov_9fa48("1234"), false)) => {
    const colors: Record<string, {
      bg: string;
      border: string;
      text: string;
      bgActive: string;
    }> = stryMutAct_9fa48("1236") ? {} : (stryCov_9fa48("1236"), {
      cyan: stryMutAct_9fa48("1237") ? {} : (stryCov_9fa48("1237"), {
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/30',
        text: 'text-cyan-400',
        bgActive: 'bg-cyan-500/20'
      }),
      purple: stryMutAct_9fa48("1242") ? {} : (stryCov_9fa48("1242"), {
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        text: 'text-purple-400',
        bgActive: 'bg-purple-500/20'
      }),
      orange: stryMutAct_9fa48("1247") ? {} : (stryCov_9fa48("1247"), {
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/30',
        text: 'text-orange-400',
        bgActive: 'bg-orange-500/20'
      }),
      teal: stryMutAct_9fa48("1252") ? {} : (stryCov_9fa48("1252"), {
        bg: 'bg-teal-500/10',
        border: 'border-teal-500/30',
        text: 'text-teal-400',
        bgActive: 'bg-teal-500/20'
      }),
      emerald: stryMutAct_9fa48("1257") ? {} : (stryCov_9fa48("1257"), {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
        bgActive: 'bg-emerald-500/20'
      }),
      amber: stryMutAct_9fa48("1262") ? {} : (stryCov_9fa48("1262"), {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        text: 'text-amber-400',
        bgActive: 'bg-amber-500/20'
      })
    });
    return stryMutAct_9fa48("1269") ? colors[color] && colors.purple : stryMutAct_9fa48("1268") ? false : stryMutAct_9fa48("1267") ? true : (stryCov_9fa48("1267", "1268", "1269"), colors[color] || colors.purple);
  };
  const getStageStatus = (stageId: string) => {
    const stageData = EXAMPLE_JOURNEY.stages[stageId as keyof typeof EXAMPLE_JOURNEY.stages];
    return stryMutAct_9fa48("1273") ? stageData?.status && 'pending' : stryMutAct_9fa48("1272") ? false : stryMutAct_9fa48("1271") ? true : (stryCov_9fa48("1271", "1272", "1273"), (stryMutAct_9fa48("1274") ? stageData.status : (stryCov_9fa48("1274"), stageData?.status)) || 'pending');
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        if (stryMutAct_9fa48("1277")) {} else {
          stryCov_9fa48("1277");
          return <CheckCircle className="w-4 h-4 text-emerald-400" />;
        }
      case 'vetoed':
        if (stryMutAct_9fa48("1279")) {} else {
          stryCov_9fa48("1279");
          return <AlertTriangle className="w-4 h-4 text-red-400" />;
        }
      case 'in_progress':
        if (stryMutAct_9fa48("1281")) {} else {
          stryCov_9fa48("1281");
          return <Clock className="w-4 h-4 text-amber-400 animate-pulse" />;
        }
      default:
        if (stryMutAct_9fa48("1283")) {} else {
          stryCov_9fa48("1283");
          return <Clock className="w-4 h-4 text-slate-500" />;
        }
    }
  };
  if (stryMutAct_9fa48("1286") ? variant !== 'compact' : stryMutAct_9fa48("1285") ? false : stryMutAct_9fa48("1284") ? true : (stryCov_9fa48("1284", "1285", "1286"), variant === 'compact')) {
    return <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white text-sm">Decision Lifecycle</h3>
          <span className="text-xs text-slate-500">7 stages</span>
        </div>
        <div className="flex items-center gap-1">
          {LIFECYCLE_STAGES.map((stage, i) => {
          const colors = getColorClasses(stage.color);
          return <React.Fragment key={stage.id}>
                <button onClick={stryMutAct_9fa48("1290") ? () => undefined : (stryCov_9fa48("1290"), () => stryMutAct_9fa48("1291") ? onStageClick(stage.id, stage.link) : (stryCov_9fa48("1291"), onStageClick?.(stage.id, stage.link)))} className={`w-8 h-8 rounded-full ${colors.bg} ${colors.border} border flex items-center justify-center hover:${colors.bgActive} transition-all`} title={stage.name}>
                  <span className={colors.text}>{React.cloneElement(stage.icon, stryMutAct_9fa48("1293") ? {} : (stryCov_9fa48("1293"), {
                  className: 'w-4 h-4'
                }))}</span>
                </button>
                {stryMutAct_9fa48("1297") ? i < LIFECYCLE_STAGES.length - 1 || <ArrowRight className="w-3 h-3 text-slate-600" /> : stryMutAct_9fa48("1296") ? false : stryMutAct_9fa48("1295") ? true : (stryCov_9fa48("1295", "1296", "1297"), (stryMutAct_9fa48("1300") ? i >= LIFECYCLE_STAGES.length - 1 : stryMutAct_9fa48("1299") ? i <= LIFECYCLE_STAGES.length - 1 : stryMutAct_9fa48("1298") ? true : (stryCov_9fa48("1298", "1299", "1300"), i < (stryMutAct_9fa48("1301") ? LIFECYCLE_STAGES.length + 1 : (stryCov_9fa48("1301"), LIFECYCLE_STAGES.length - 1)))) && <ArrowRight className="w-3 h-3 text-slate-600" />)}
              </React.Fragment>;
        })}
        </div>
      </div>;
  }
  if (stryMutAct_9fa48("1304") ? variant !== 'inline' : stryMutAct_9fa48("1303") ? false : stryMutAct_9fa48("1302") ? true : (stryCov_9fa48("1302", "1303", "1304"), variant === 'inline')) {
    return <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-500">Journey:</span>
        {LIFECYCLE_STAGES.map(stryMutAct_9fa48("1307") ? () => undefined : (stryCov_9fa48("1307"), (stage, i) => <React.Fragment key={stage.id}>
            <button onClick={stryMutAct_9fa48("1308") ? () => undefined : (stryCov_9fa48("1308"), () => stryMutAct_9fa48("1309") ? onStageClick(stage.id, stage.link) : (stryCov_9fa48("1309"), onStageClick?.(stage.id, stage.link)))} className={`${getColorClasses(stage.color).text} hover:underline`}>
              {stage.name.split(' ')[0]}
            </button>
            {stryMutAct_9fa48("1314") ? i < LIFECYCLE_STAGES.length - 1 || <span className="text-slate-600">→</span> : stryMutAct_9fa48("1313") ? false : stryMutAct_9fa48("1312") ? true : (stryCov_9fa48("1312", "1313", "1314"), (stryMutAct_9fa48("1317") ? i >= LIFECYCLE_STAGES.length - 1 : stryMutAct_9fa48("1316") ? i <= LIFECYCLE_STAGES.length - 1 : stryMutAct_9fa48("1315") ? true : (stryCov_9fa48("1315", "1316", "1317"), i < (stryMutAct_9fa48("1318") ? LIFECYCLE_STAGES.length + 1 : (stryCov_9fa48("1318"), LIFECYCLE_STAGES.length - 1)))) && <span className="text-slate-600">→</span>)}
          </React.Fragment>))}
      </div>;
  }

  // Full variant
  return <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-400" />
              Decision Lifecycle
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              How decisions flow through Datacendia's Sovereign Stack
            </p>
          </div>
          <button onClick={stryMutAct_9fa48("1319") ? () => undefined : (stryCov_9fa48("1319"), () => setShowJourneyExample(stryMutAct_9fa48("1320") ? showJourneyExample : (stryCov_9fa48("1320"), !showJourneyExample)))} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-slate-300 flex items-center gap-1">
            {showJourneyExample ? 'Hide' : 'Show'} live example
          </button>
        </div>
      </div>

      {/* Lifecycle Stages */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {LIFECYCLE_STAGES.map((stage, i) => {
          const colors = getColorClasses(stage.color);
          const isExpanded = stryMutAct_9fa48("1326") ? expandedStage !== stage.id : stryMutAct_9fa48("1325") ? false : stryMutAct_9fa48("1324") ? true : (stryCov_9fa48("1324", "1325", "1326"), expandedStage === stage.id);
          const status = showJourneyExample ? getStageStatus(stage.id) : 'pending';
          return <div key={stage.id} className="relative">
                {/* Connector Arrow (hidden on first item and mobile) */}
                {stryMutAct_9fa48("1330") ? i > 0 || <div className="hidden xl:block absolute -left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-4 h-4 text-slate-600" />
                  </div> : stryMutAct_9fa48("1329") ? false : stryMutAct_9fa48("1328") ? true : (stryCov_9fa48("1328", "1329", "1330"), (stryMutAct_9fa48("1333") ? i <= 0 : stryMutAct_9fa48("1332") ? i >= 0 : stryMutAct_9fa48("1331") ? true : (stryCov_9fa48("1331", "1332", "1333"), i > 0)) && <div className="hidden xl:block absolute -left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-4 h-4 text-slate-600" />
                  </div>)}
                
                <div className={`p-4 rounded-xl border ${colors.border} ${colors.bg} hover:${colors.bgActive} transition-all cursor-pointer ${(stryMutAct_9fa48("1337") ? status !== 'vetoed' : stryMutAct_9fa48("1336") ? false : stryMutAct_9fa48("1335") ? true : (stryCov_9fa48("1335", "1336", "1337"), status === 'vetoed')) ? 'ring-2 ring-red-500/50' : ''}`} onClick={stryMutAct_9fa48("1341") ? () => undefined : (stryCov_9fa48("1341"), () => setExpandedStage(isExpanded ? null : stage.id))}>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg ${colors.bgActive}`}>
                      <span className={colors.text}>{stage.icon}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {stryMutAct_9fa48("1345") ? stage.optional || <span className="text-[10px] text-slate-500 px-1.5 py-0.5 bg-slate-700 rounded">Optional</span> : stryMutAct_9fa48("1344") ? false : stryMutAct_9fa48("1343") ? true : (stryCov_9fa48("1343", "1344", "1345"), stage.optional && <span className="text-[10px] text-slate-500 px-1.5 py-0.5 bg-slate-700 rounded">Optional</span>)}
                      {stryMutAct_9fa48("1348") ? showJourneyExample || getStatusIcon(status) : stryMutAct_9fa48("1347") ? false : stryMutAct_9fa48("1346") ? true : (stryCov_9fa48("1346", "1347", "1348"), showJourneyExample && getStatusIcon(status))}
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="font-semibold text-white text-sm mb-1">{stage.name}</h3>
                  <p className="text-xs text-slate-500 mb-2">{stage.module}</p>
                  
                  {/* Description */}
                  <p className="text-xs text-slate-400 mb-3">{stage.description}</p>
                  
                  {/* Expand/Collapse */}
                  <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300">
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {isExpanded ? 'Less' : 'More'}
                  </button>
                  
                  {/* Expanded Content */}
                  {stryMutAct_9fa48("1353") ? isExpanded || <div className="mt-3 pt-3 border-t border-slate-700 space-y-2">
                      <div className="text-xs text-slate-400">Outputs:</div>
                      <ul className="space-y-1">
                        {stage.outputs.map((output, j) => <li key={j} className="text-xs text-slate-300 flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${colors.bgActive}`}></span>
                            {output}
                          </li>)}
                      </ul>
                      <button onClick={e => {
                  e.stopPropagation();
                  onStageClick?.(stage.id, stage.link);
                }} className={`mt-2 w-full px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 ${colors.text} bg-slate-800 hover:bg-slate-700`}>
                        Open {stage.module.split('™')[0]} <ExternalLink className="w-3 h-3" />
                      </button>
                    </div> : stryMutAct_9fa48("1352") ? false : stryMutAct_9fa48("1351") ? true : (stryCov_9fa48("1351", "1352", "1353"), isExpanded && <div className="mt-3 pt-3 border-t border-slate-700 space-y-2">
                      <div className="text-xs text-slate-400">Outputs:</div>
                      <ul className="space-y-1">
                        {stage.outputs.map(stryMutAct_9fa48("1354") ? () => undefined : (stryCov_9fa48("1354"), (output, j) => <li key={j} className="text-xs text-slate-300 flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${colors.bgActive}`}></span>
                            {output}
                          </li>))}
                      </ul>
                      <button onClick={e => {
                  e.stopPropagation();
                  stryMutAct_9fa48("1357") ? onStageClick(stage.id, stage.link) : (stryCov_9fa48("1357"), onStageClick?.(stage.id, stage.link));
                }} className={`mt-2 w-full px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 ${colors.text} bg-slate-800 hover:bg-slate-700`}>
                        Open {stage.module.split('™')[0]} <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>)}
                </div>
              </div>;
        })}
        </div>
      </div>

      {/* Live Example Journey */}
      {stryMutAct_9fa48("1362") ? showJourneyExample || <div className="p-6 border-t border-slate-700 bg-slate-900/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white">Live Example: {EXAMPLE_JOURNEY.title}</h3>
              <p className="text-xs text-slate-500">ID: {EXAMPLE_JOURNEY.id}</p>
            </div>
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-medium">
              Veto Active
            </span>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            {LIFECYCLE_STAGES.map((stage, i) => {
          const stageData = EXAMPLE_JOURNEY.stages[stage.id as keyof typeof EXAMPLE_JOURNEY.stages];
          const status = stageData?.status || 'pending';
          return <React.Fragment key={stage.id}>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${status === 'completed' ? 'bg-emerald-500/10 text-emerald-300' : status === 'vetoed' ? 'bg-red-500/10 text-red-300' : status === 'in_progress' ? 'bg-amber-500/10 text-amber-300' : 'bg-slate-800 text-slate-500'}`}>
                    {getStatusIcon(status)}
                    <span>{stage.name.split(' ')[0]}</span>
                    {stageData && 'timestamp' in stageData && stageData.timestamp && <span className="text-[10px] text-slate-500">{stageData.timestamp.split(' ')[1]}</span>}
                  </div>
                  {i < LIFECYCLE_STAGES.length - 1 && <ArrowRight className={`w-3 h-3 ${status === 'pending' ? 'text-slate-700' : 'text-slate-500'}`} />}
                </React.Fragment>;
        })}
          </div>
          
          {/* Veto Details */}
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-red-400 text-sm font-medium mb-1">
              <AlertTriangle className="w-4 h-4" />
              Veto Triggered: Environment Stakeholder
            </div>
            <p className="text-xs text-slate-300">
              Reason: Irreversible environmental harm. Decision requires mitigation plan before proceeding.
            </p>
          </div>
        </div> : stryMutAct_9fa48("1361") ? false : stryMutAct_9fa48("1360") ? true : (stryCov_9fa48("1360", "1361", "1362"), showJourneyExample && <div className="p-6 border-t border-slate-700 bg-slate-900/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white">Live Example: {EXAMPLE_JOURNEY.title}</h3>
              <p className="text-xs text-slate-500">ID: {EXAMPLE_JOURNEY.id}</p>
            </div>
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-medium">
              Veto Active
            </span>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            {LIFECYCLE_STAGES.map((stage, i) => {
          const stageData = EXAMPLE_JOURNEY.stages[stage.id as keyof typeof EXAMPLE_JOURNEY.stages];
          const status = stryMutAct_9fa48("1366") ? stageData?.status && 'pending' : stryMutAct_9fa48("1365") ? false : stryMutAct_9fa48("1364") ? true : (stryCov_9fa48("1364", "1365", "1366"), (stryMutAct_9fa48("1367") ? stageData.status : (stryCov_9fa48("1367"), stageData?.status)) || 'pending');
          return <React.Fragment key={stage.id}>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${(stryMutAct_9fa48("1372") ? status !== 'completed' : stryMutAct_9fa48("1371") ? false : stryMutAct_9fa48("1370") ? true : (stryCov_9fa48("1370", "1371", "1372"), status === 'completed')) ? 'bg-emerald-500/10 text-emerald-300' : (stryMutAct_9fa48("1377") ? status !== 'vetoed' : stryMutAct_9fa48("1376") ? false : stryMutAct_9fa48("1375") ? true : (stryCov_9fa48("1375", "1376", "1377"), status === 'vetoed')) ? 'bg-red-500/10 text-red-300' : (stryMutAct_9fa48("1382") ? status !== 'in_progress' : stryMutAct_9fa48("1381") ? false : stryMutAct_9fa48("1380") ? true : (stryCov_9fa48("1380", "1381", "1382"), status === 'in_progress')) ? 'bg-amber-500/10 text-amber-300' : 'bg-slate-800 text-slate-500'}`}>
                    {getStatusIcon(status)}
                    <span>{stage.name.split(' ')[0]}</span>
                    {stryMutAct_9fa48("1389") ? stageData && 'timestamp' in stageData && stageData.timestamp || <span className="text-[10px] text-slate-500">{stageData.timestamp.split(' ')[1]}</span> : stryMutAct_9fa48("1388") ? false : stryMutAct_9fa48("1387") ? true : (stryCov_9fa48("1387", "1388", "1389"), (stryMutAct_9fa48("1391") ? stageData && 'timestamp' in stageData || stageData.timestamp : stryMutAct_9fa48("1390") ? true : (stryCov_9fa48("1390", "1391"), (stryMutAct_9fa48("1393") ? stageData || 'timestamp' in stageData : stryMutAct_9fa48("1392") ? true : (stryCov_9fa48("1392", "1393"), stageData && 'timestamp' in stageData)) && stageData.timestamp)) && <span className="text-[10px] text-slate-500">{stageData.timestamp.split(' ')[1]}</span>)}
                  </div>
                  {stryMutAct_9fa48("1398") ? i < LIFECYCLE_STAGES.length - 1 || <ArrowRight className={`w-3 h-3 ${status === 'pending' ? 'text-slate-700' : 'text-slate-500'}`} /> : stryMutAct_9fa48("1397") ? false : stryMutAct_9fa48("1396") ? true : (stryCov_9fa48("1396", "1397", "1398"), (stryMutAct_9fa48("1401") ? i >= LIFECYCLE_STAGES.length - 1 : stryMutAct_9fa48("1400") ? i <= LIFECYCLE_STAGES.length - 1 : stryMutAct_9fa48("1399") ? true : (stryCov_9fa48("1399", "1400", "1401"), i < (stryMutAct_9fa48("1402") ? LIFECYCLE_STAGES.length + 1 : (stryCov_9fa48("1402"), LIFECYCLE_STAGES.length - 1)))) && <ArrowRight className={`w-3 h-3 ${(stryMutAct_9fa48("1406") ? status !== 'pending' : stryMutAct_9fa48("1405") ? false : stryMutAct_9fa48("1404") ? true : (stryCov_9fa48("1404", "1405", "1406"), status === 'pending')) ? 'text-slate-700' : 'text-slate-500'}`} />)}
                </React.Fragment>;
        })}
          </div>
          
          {/* Veto Details */}
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-red-400 text-sm font-medium mb-1">
              <AlertTriangle className="w-4 h-4" />
              Veto Triggered: Environment Stakeholder
            </div>
            <p className="text-xs text-slate-300">
              Reason: Irreversible environmental harm. Decision requires mitigation plan before proceeding.
            </p>
          </div>
        </div>)}

      {/* Footer CTA */}
      <div className="p-4 border-t border-slate-700 flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Every decision creates a permanent, auditable record across the Sovereign Stack
        </p>
        <button onClick={stryMutAct_9fa48("1410") ? () => undefined : (stryCov_9fa48("1410"), () => stryMutAct_9fa48("1411") ? onStageClick('council', '/cortex/intelligence/council') : (stryCov_9fa48("1411"), onStageClick?.('council', '/cortex/intelligence/council')))} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium flex items-center gap-2">
          <Play className="w-4 h-4" /> Start New Decision
        </button>
      </div>
    </div>;
};
export default DecisionLifecycle;