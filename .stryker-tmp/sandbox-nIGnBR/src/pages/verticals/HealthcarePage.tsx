// @ts-nocheck
// =============================================================================
// DATACENDIA HEALTHCARE VERTICAL
// HIPAA-compliant clinical decision intelligence with 100% data sovereignty
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
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// =============================================================================
// TYPES & DATA
// =============================================================================

interface Agent {
  code: string;
  name: string;
  purpose: string;
  model: string;
}
interface CaseStudy {
  org: string;
  quote: string;
  metric: string;
  anonymized: boolean;
}
const agents: Agent[] = stryMutAct_9fa48("61986") ? [] : (stryCov_9fa48("61986"), [stryMutAct_9fa48("61987") ? {} : (stryCov_9fa48("61987"), {
  code: 'cmio',
  name: 'Chief Medical Info Officer',
  purpose: 'Health IT strategy, EHR optimization, clinical workflows',
  model: 'llama3.3:70b'
}), stryMutAct_9fa48("61992") ? {} : (stryCov_9fa48("61992"), {
  code: 'pso',
  name: 'Patient Safety Officer',
  purpose: 'Clinical safety, adverse event analysis, quality metrics',
  model: 'qwq:32b'
}), stryMutAct_9fa48("61997") ? {} : (stryCov_9fa48("61997"), {
  code: 'hco',
  name: 'Healthcare Compliance',
  purpose: 'HIPAA, Stark Law, Anti-Kickback, billing compliance',
  model: 'qwq:32b'
}), stryMutAct_9fa48("62002") ? {} : (stryCov_9fa48("62002"), {
  code: 'cod',
  name: 'Clinical Operations Director',
  purpose: 'Patient flow, staffing optimization, capacity planning',
  model: 'llama3.3:70b'
})]);
const overlays = stryMutAct_9fa48("62007") ? [] : (stryCov_9fa48("62007"), [stryMutAct_9fa48("62008") ? {} : (stryCov_9fa48("62008"), {
  name: 'Clinical Safety Monitor',
  function: 'Real-time adverse event detection, near-miss patterns',
  integrates: 'CendiaAegis™'
}), stryMutAct_9fa48("62012") ? {} : (stryCov_9fa48("62012"), {
  name: 'CMS Compliance Tracker',
  function: 'CoP changes, billing rule updates, quality measure shifts',
  integrates: 'CendiaPanopticon™'
}), stryMutAct_9fa48("62016") ? {} : (stryCov_9fa48("62016"), {
  name: 'Physician Knowledge Vault',
  function: 'Retiring physician expertise capture, protocol preservation',
  integrates: 'CendiaEternal™'
}), stryMutAct_9fa48("62020") ? {} : (stryCov_9fa48("62020"), {
  name: 'Capacity Predictor',
  function: 'ED surge forecasting, staffing optimization',
  integrates: 'CendiaPredict™'
})]);
const pillars = stryMutAct_9fa48("62024") ? [] : (stryCov_9fa48("62024"), [stryMutAct_9fa48("62025") ? {} : (stryCov_9fa48("62025"), {
  name: 'Helm',
  application: 'Patient census dashboards, quality metrics, financial performance'
}), stryMutAct_9fa48("62028") ? {} : (stryCov_9fa48("62028"), {
  name: 'Health',
  application: 'EHR uptime, system monitoring, clinical system health'
}), stryMutAct_9fa48("62031") ? {} : (stryCov_9fa48("62031"), {
  name: 'Guard',
  application: 'HIPAA enforcement, PHI protection, access controls'
}), stryMutAct_9fa48("62034") ? {} : (stryCov_9fa48("62034"), {
  name: 'Flow',
  application: 'Clinical workflows, care coordination, discharge planning'
}), stryMutAct_9fa48("62037") ? {} : (stryCov_9fa48("62037"), {
  name: 'Ethics',
  application: 'Clinical decision support, treatment protocol governance'
})]);
const caseStudies: CaseStudy[] = stryMutAct_9fa48("62040") ? [] : (stryCov_9fa48("62040"), [stryMutAct_9fa48("62041") ? {} : (stryCov_9fa48("62041"), {
  org: 'Regional Health System (12 hospitals)',
  quote: 'Reduced ED boarding time 34% by accelerating discharge decisions. Council identified 7 bottleneck patterns in care coordination.',
  metric: '34% faster discharge',
  anonymized: stryMutAct_9fa48("62045") ? false : (stryCov_9fa48("62045"), true)
}), stryMutAct_9fa48("62046") ? {} : (stryCov_9fa48("62046"), {
  org: 'Academic Medical Center',
  quote: 'Captured 40+ years of retiring surgeon expertise via CendiaEternal™. New residents access institutional knowledge instantly.',
  metric: '40+ years preserved',
  anonymized: stryMutAct_9fa48("62050") ? true : (stryCov_9fa48("62050"), false)
}), stryMutAct_9fa48("62051") ? {} : (stryCov_9fa48("62051"), {
  org: 'Rural Hospital Network',
  quote: 'Avoided $2.3M in CMS penalties. Panopticon flagged CoP violations 90 days before survey.',
  metric: '$2.3M saved',
  anonymized: stryMutAct_9fa48("62055") ? true : (stryCov_9fa48("62055"), false)
})]);
const integrations = stryMutAct_9fa48("62056") ? [] : (stryCov_9fa48("62056"), [stryMutAct_9fa48("62057") ? {} : (stryCov_9fa48("62057"), {
  system: 'Epic/Cerner EHR',
  difficulty: 'medium',
  timeline: '6-12 weeks',
  notes: 'FHIR R4 APIs, requires IT engagement'
}), stryMutAct_9fa48("62062") ? {} : (stryCov_9fa48("62062"), {
  system: 'Meditech',
  difficulty: 'medium',
  timeline: '8-12 weeks',
  notes: 'HL7 v2 typical, FHIR emerging'
}), stryMutAct_9fa48("62067") ? {} : (stryCov_9fa48("62067"), {
  system: 'Legacy (CPSI, Allscripts)',
  difficulty: 'hard',
  timeline: '3-6 months',
  notes: 'Often requires middleware'
}), stryMutAct_9fa48("62072") ? {} : (stryCov_9fa48("62072"), {
  system: 'Revenue Cycle (Optum, Waystar)',
  difficulty: 'easy',
  timeline: '2-4 weeks',
  notes: 'Standard API connectors'
})]);
const compliance = stryMutAct_9fa48("62077") ? [] : (stryCov_9fa48("62077"), ['HIPAA', 'HITECH', 'Stark Law', 'Anti-Kickback', 'Joint Commission', 'CMS CoPs', 'State Health Laws', '21st Century Cures Act', 'MACRA/MIPS', 'Price Transparency']);
const pricing = stryMutAct_9fa48("62088") ? [] : (stryCov_9fa48("62088"), [stryMutAct_9fa48("62089") ? {} : (stryCov_9fa48("62089"), {
  package: 'Healthcare Starter',
  price: '$100,000',
  includes: '8 Pillars + 4 Healthcare Agents',
  roi: '8 months'
}), stryMutAct_9fa48("62094") ? {} : (stryCov_9fa48("62094"), {
  package: 'Healthcare Professional',
  price: '$1,200,000',
  includes: '+ Aegis, Panopticon, Eternal',
  roi: '5 months'
}), stryMutAct_9fa48("62099") ? {} : (stryCov_9fa48("62099"), {
  package: 'Healthcare Enterprise',
  price: '$5,000,000',
  includes: '+ Full Guardian Suite',
  roi: '3 months'
}), stryMutAct_9fa48("62104") ? {} : (stryCov_9fa48("62104"), {
  package: 'Healthcare Sovereign',
  price: '$12,000,000+',
  includes: '+ Air-gapped, custom models',
  roi: '2 months'
})]);

// =============================================================================
// COMPONENT
// =============================================================================

export const HealthcarePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'integrations' | 'pricing'>('overview');
  return <div className="min-h-screen bg-neutral-900 text-white">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-neutral-900 to-neutral-900"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <button onClick={stryMutAct_9fa48("62111") ? () => undefined : (stryCov_9fa48("62111"), () => navigate('/verticals'))} className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
            ← Back to Verticals
          </button>
          
          <div className="flex items-start gap-6">
            <span className="text-6xl">🏥</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium">
                  ⭐ Wave 1 Priority
                </span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  🔒 100% Sovereignty
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                  43% Market Share
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Healthcare / Health Systems</h1>
              <p className="text-xl text-neutral-300 max-w-3xl">
                HIPAA-compliant AI decision intelligence with full data sovereignty. 
                Accelerate clinical operations while maintaining complete audit trails for CMS AI transparency rules.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">Pilot Result</p>
              <p className="text-3xl font-bold text-green-400">34%</p>
              <p className="text-neutral-300">faster discharge decisions</p>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-4 gap-6 mt-12">
            {(stryMutAct_9fa48("62113") ? [] : (stryCov_9fa48("62113"), [stryMutAct_9fa48("62114") ? {} : (stryCov_9fa48("62114"), {
            label: '18-Month ROI',
            value: '27%',
            subtext: 'cost reduction'
          }), stryMutAct_9fa48("62118") ? {} : (stryCov_9fa48("62118"), {
            label: 'Avg Savings',
            value: '$890K',
            subtext: 'operational efficiency'
          }), stryMutAct_9fa48("62122") ? {} : (stryCov_9fa48("62122"), {
            label: 'Readmission Prediction',
            value: '89%',
            subtext: 'accuracy'
          }), stryMutAct_9fa48("62126") ? {} : (stryCov_9fa48("62126"), {
            label: 'Time to Value',
            value: '8 weeks',
            subtext: 'to first ROI'
          })])).map(stryMutAct_9fa48("62130") ? () => undefined : (stryCov_9fa48("62130"), stat => <div key={stat.label} className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700">
                <p className="text-3xl font-bold text-primary-400">{stat.value}</p>
                <p className="font-medium">{stat.label}</p>
                <p className="text-sm text-neutral-500">{stat.subtext}</p>
              </div>))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {(stryMutAct_9fa48("62131") ? [] : (stryCov_9fa48("62131"), [stryMutAct_9fa48("62132") ? {} : (stryCov_9fa48("62132"), {
            id: 'overview',
            label: 'Overview'
          }), stryMutAct_9fa48("62135") ? {} : (stryCov_9fa48("62135"), {
            id: 'agents',
            label: 'Agents & Overlays'
          }), stryMutAct_9fa48("62138") ? {} : (stryCov_9fa48("62138"), {
            id: 'integrations',
            label: 'Integrations'
          }), stryMutAct_9fa48("62141") ? {} : (stryCov_9fa48("62141"), {
            id: 'pricing',
            label: 'Pricing'
          })])).map(stryMutAct_9fa48("62144") ? () => undefined : (stryCov_9fa48("62144"), tab => <button key={tab.id} onClick={stryMutAct_9fa48("62145") ? () => undefined : (stryCov_9fa48("62145"), () => setActiveTab(tab.id as typeof activeTab))} className={`px-6 py-4 font-medium transition-all border-b-2 ${(stryMutAct_9fa48("62149") ? activeTab !== tab.id : stryMutAct_9fa48("62148") ? false : stryMutAct_9fa48("62147") ? true : (stryCov_9fa48("62147", "62148", "62149"), activeTab === tab.id)) ? 'border-primary-500 text-white' : 'border-transparent text-neutral-400 hover:text-white'}`}>
                {tab.label}
              </button>))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Overview Tab */}
        {stryMutAct_9fa48("62154") ? activeTab === 'overview' || <div className="space-y-12">
            {/* Why Healthcare */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Healthcare</h2>
              <div className="grid grid-cols-3 gap-6">
                {[{
              title: 'HIPAA-First Architecture',
              desc: 'Built from the ground up for PHI protection with automatic audit logging of every access',
              icon: '🔒'
            }, {
              title: 'CMS AI Transparency Ready',
              desc: '2025 regulations mandate AI audit trails for clinical decisions—we\'re already compliant',
              icon: '📋'
            }, {
              title: 'Air-Gapped Deployment',
              desc: 'Data never leaves your infrastructure. SCIF-ready for sensitive health systems',
              icon: '🛡️'
            }].map(item => <div key={item.title} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <span className="text-3xl">{item.icon}</span>
                    <h3 className="text-lg font-semibold mt-4 mb-2">{item.title}</h3>
                    <p className="text-neutral-400">{item.desc}</p>
                  </div>)}
              </div>
            </section>

            {/* Case Studies */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Customer Results</h2>
              <div className="space-y-4">
                {caseStudies.map((cs, idx) => <div key={idx} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-neutral-300 text-lg italic">"{cs.quote}"</p>
                        <p className="text-neutral-500 mt-3">— {cs.org} {cs.anonymized && '(Anonymized Demo Available)'}</p>
                      </div>
                      <div className="ml-6 text-right">
                        <p className="text-2xl font-bold text-green-400">{cs.metric}</p>
                      </div>
                    </div>
                  </div>)}
              </div>
            </section>

            {/* Key Decision Types */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Key Decision Types</h2>
              <div className="grid grid-cols-3 gap-4">
                {['Service line expansion/contraction', 'Physician group acquisitions', 'EHR migration decisions', 'Staffing and capacity allocation', 'Payer contract negotiations', 'Quality improvement initiatives'].map(decision => <div key={decision} className="flex items-center gap-3 p-4 bg-neutral-800 rounded-lg border border-neutral-700">
                    <span className="text-green-400">✓</span>
                    <span>{decision}</span>
                    <span className="text-xs text-neutral-500 ml-auto">avg 31% faster</span>
                  </div>)}
              </div>
            </section>

            {/* Compliance */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Compliance Frameworks</h2>
              <div className="flex flex-wrap gap-2">
                {compliance.map(c => <span key={c} className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/30 font-medium">
                    {c}
                  </span>)}
              </div>
            </section>

            {/* Welcome Bonus */}
            <section className="bg-gradient-to-r from-primary-900/30 to-blue-900/30 rounded-2xl p-8 border border-primary-500/30">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Welcome Bonus</h2>
                  <h3 className="text-xl text-primary-400 mb-4">"The Payer Mix Decision Impact Report"</h3>
                  <ul className="space-y-2 text-neutral-300">
                    <li>• Payer mix trends analysis (from CMS data)</li>
                    <li>• Decision bottlenecks common to health system size</li>
                    <li>• Staffing decision patterns affecting patient outcomes</li>
                    <li>• Comparison to regional competitors</li>
                  </ul>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-400">Perceived Value</p>
                  <p className="text-3xl font-bold text-green-400">$30,000–$50,000</p>
                </div>
              </div>
            </section>
          </div> : stryMutAct_9fa48("62153") ? false : stryMutAct_9fa48("62152") ? true : (stryCov_9fa48("62152", "62153", "62154"), (stryMutAct_9fa48("62156") ? activeTab !== 'overview' : stryMutAct_9fa48("62155") ? true : (stryCov_9fa48("62155", "62156"), activeTab === 'overview')) && <div className="space-y-12">
            {/* Why Healthcare */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Healthcare</h2>
              <div className="grid grid-cols-3 gap-6">
                {(stryMutAct_9fa48("62158") ? [] : (stryCov_9fa48("62158"), [stryMutAct_9fa48("62159") ? {} : (stryCov_9fa48("62159"), {
              title: 'HIPAA-First Architecture',
              desc: 'Built from the ground up for PHI protection with automatic audit logging of every access',
              icon: '🔒'
            }), stryMutAct_9fa48("62163") ? {} : (stryCov_9fa48("62163"), {
              title: 'CMS AI Transparency Ready',
              desc: '2025 regulations mandate AI audit trails for clinical decisions—we\'re already compliant',
              icon: '📋'
            }), stryMutAct_9fa48("62167") ? {} : (stryCov_9fa48("62167"), {
              title: 'Air-Gapped Deployment',
              desc: 'Data never leaves your infrastructure. SCIF-ready for sensitive health systems',
              icon: '🛡️'
            })])).map(stryMutAct_9fa48("62171") ? () => undefined : (stryCov_9fa48("62171"), item => <div key={item.title} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <span className="text-3xl">{item.icon}</span>
                    <h3 className="text-lg font-semibold mt-4 mb-2">{item.title}</h3>
                    <p className="text-neutral-400">{item.desc}</p>
                  </div>))}
              </div>
            </section>

            {/* Case Studies */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Customer Results</h2>
              <div className="space-y-4">
                {caseStudies.map(stryMutAct_9fa48("62172") ? () => undefined : (stryCov_9fa48("62172"), (cs, idx) => <div key={idx} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-neutral-300 text-lg italic">"{cs.quote}"</p>
                        <p className="text-neutral-500 mt-3">— {cs.org} {stryMutAct_9fa48("62175") ? cs.anonymized || '(Anonymized Demo Available)' : stryMutAct_9fa48("62174") ? false : stryMutAct_9fa48("62173") ? true : (stryCov_9fa48("62173", "62174", "62175"), cs.anonymized && '(Anonymized Demo Available)')}</p>
                      </div>
                      <div className="ml-6 text-right">
                        <p className="text-2xl font-bold text-green-400">{cs.metric}</p>
                      </div>
                    </div>
                  </div>))}
              </div>
            </section>

            {/* Key Decision Types */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Key Decision Types</h2>
              <div className="grid grid-cols-3 gap-4">
                {(stryMutAct_9fa48("62177") ? [] : (stryCov_9fa48("62177"), ['Service line expansion/contraction', 'Physician group acquisitions', 'EHR migration decisions', 'Staffing and capacity allocation', 'Payer contract negotiations', 'Quality improvement initiatives'])).map(stryMutAct_9fa48("62184") ? () => undefined : (stryCov_9fa48("62184"), decision => <div key={decision} className="flex items-center gap-3 p-4 bg-neutral-800 rounded-lg border border-neutral-700">
                    <span className="text-green-400">✓</span>
                    <span>{decision}</span>
                    <span className="text-xs text-neutral-500 ml-auto">avg 31% faster</span>
                  </div>))}
              </div>
            </section>

            {/* Compliance */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Compliance Frameworks</h2>
              <div className="flex flex-wrap gap-2">
                {compliance.map(stryMutAct_9fa48("62185") ? () => undefined : (stryCov_9fa48("62185"), c => <span key={c} className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/30 font-medium">
                    {c}
                  </span>))}
              </div>
            </section>

            {/* Welcome Bonus */}
            <section className="bg-gradient-to-r from-primary-900/30 to-blue-900/30 rounded-2xl p-8 border border-primary-500/30">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Welcome Bonus</h2>
                  <h3 className="text-xl text-primary-400 mb-4">"The Payer Mix Decision Impact Report"</h3>
                  <ul className="space-y-2 text-neutral-300">
                    <li>• Payer mix trends analysis (from CMS data)</li>
                    <li>• Decision bottlenecks common to health system size</li>
                    <li>• Staffing decision patterns affecting patient outcomes</li>
                    <li>• Comparison to regional competitors</li>
                  </ul>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-400">Perceived Value</p>
                  <p className="text-3xl font-bold text-green-400">$30,000–$50,000</p>
                </div>
              </div>
            </section>
          </div>)}

        {/* Agents Tab */}
        {stryMutAct_9fa48("62188") ? activeTab === 'agents' || <div className="space-y-12">
            {/* Industry Agents */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Healthcare-Specific Agents</h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map(agent => <div key={agent.code} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <span className="text-xl">🤖</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{agent.name}</h3>
                        <code className="text-xs text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded">{agent.code}</code>
                      </div>
                    </div>
                    <p className="text-neutral-300 mb-3">{agent.purpose}</p>
                    <p className="text-sm text-neutral-500">Model: <code className="text-primary-400">{agent.model}</code></p>
                  </div>)}
              </div>
            </section>

            {/* Vertical Overlays */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Vertical Overlays</h2>
              <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-900">
                    <tr>
                      <th className="text-left p-4 font-medium text-neutral-400">Overlay</th>
                      <th className="text-left p-4 font-medium text-neutral-400">Function</th>
                      <th className="text-left p-4 font-medium text-neutral-400">Integrates With</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overlays.map(overlay => <tr key={overlay.name} className="border-t border-neutral-700">
                        <td className="p-4 font-medium">{overlay.name}</td>
                        <td className="p-4 text-neutral-300">{overlay.function}</td>
                        <td className="p-4"><code className="text-primary-400">{overlay.integrates}</code></td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Core Pillars */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Core Pillars in Healthcare</h2>
              <div className="grid grid-cols-5 gap-4">
                {pillars.map(pillar => <div key={pillar.name} className="bg-neutral-800 rounded-xl p-4 border border-neutral-700 text-center">
                    <h3 className="font-semibold text-primary-400 mb-2">{pillar.name}</h3>
                    <p className="text-sm text-neutral-400">{pillar.application}</p>
                  </div>)}
              </div>
            </section>

            {/* Guardian Suite */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Guardian Suite Applications</h2>
              <div className="grid grid-cols-2 gap-6">
                {[{
              name: 'CendiaAegis™',
              use: 'Ransomware defense, medical device security, threat containment'
            }, {
              name: 'CendiaPanopticon™',
              use: 'CMS regulations, Joint Commission, state health laws'
            }, {
              name: 'CendiaEternal™',
              use: 'Clinical knowledge preservation, physician expertise capture'
            }, {
              name: 'CendiaVox™',
              use: 'Patient advocacy, community health input, ethics committee'
            }].map(service => <div key={service.name} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <h3 className="font-semibold text-lg text-primary-400 mb-2">{service.name}</h3>
                    <p className="text-neutral-300">{service.use}</p>
                  </div>)}
              </div>
            </section>
          </div> : stryMutAct_9fa48("62187") ? false : stryMutAct_9fa48("62186") ? true : (stryCov_9fa48("62186", "62187", "62188"), (stryMutAct_9fa48("62190") ? activeTab !== 'agents' : stryMutAct_9fa48("62189") ? true : (stryCov_9fa48("62189", "62190"), activeTab === 'agents')) && <div className="space-y-12">
            {/* Industry Agents */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Healthcare-Specific Agents</h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map(stryMutAct_9fa48("62192") ? () => undefined : (stryCov_9fa48("62192"), agent => <div key={agent.code} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <span className="text-xl">🤖</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{agent.name}</h3>
                        <code className="text-xs text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded">{agent.code}</code>
                      </div>
                    </div>
                    <p className="text-neutral-300 mb-3">{agent.purpose}</p>
                    <p className="text-sm text-neutral-500">Model: <code className="text-primary-400">{agent.model}</code></p>
                  </div>))}
              </div>
            </section>

            {/* Vertical Overlays */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Vertical Overlays</h2>
              <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-900">
                    <tr>
                      <th className="text-left p-4 font-medium text-neutral-400">Overlay</th>
                      <th className="text-left p-4 font-medium text-neutral-400">Function</th>
                      <th className="text-left p-4 font-medium text-neutral-400">Integrates With</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overlays.map(stryMutAct_9fa48("62193") ? () => undefined : (stryCov_9fa48("62193"), overlay => <tr key={overlay.name} className="border-t border-neutral-700">
                        <td className="p-4 font-medium">{overlay.name}</td>
                        <td className="p-4 text-neutral-300">{overlay.function}</td>
                        <td className="p-4"><code className="text-primary-400">{overlay.integrates}</code></td>
                      </tr>))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Core Pillars */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Core Pillars in Healthcare</h2>
              <div className="grid grid-cols-5 gap-4">
                {pillars.map(stryMutAct_9fa48("62194") ? () => undefined : (stryCov_9fa48("62194"), pillar => <div key={pillar.name} className="bg-neutral-800 rounded-xl p-4 border border-neutral-700 text-center">
                    <h3 className="font-semibold text-primary-400 mb-2">{pillar.name}</h3>
                    <p className="text-sm text-neutral-400">{pillar.application}</p>
                  </div>))}
              </div>
            </section>

            {/* Guardian Suite */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Guardian Suite Applications</h2>
              <div className="grid grid-cols-2 gap-6">
                {(stryMutAct_9fa48("62195") ? [] : (stryCov_9fa48("62195"), [stryMutAct_9fa48("62196") ? {} : (stryCov_9fa48("62196"), {
              name: 'CendiaAegis™',
              use: 'Ransomware defense, medical device security, threat containment'
            }), stryMutAct_9fa48("62199") ? {} : (stryCov_9fa48("62199"), {
              name: 'CendiaPanopticon™',
              use: 'CMS regulations, Joint Commission, state health laws'
            }), stryMutAct_9fa48("62202") ? {} : (stryCov_9fa48("62202"), {
              name: 'CendiaEternal™',
              use: 'Clinical knowledge preservation, physician expertise capture'
            }), stryMutAct_9fa48("62205") ? {} : (stryCov_9fa48("62205"), {
              name: 'CendiaVox™',
              use: 'Patient advocacy, community health input, ethics committee'
            })])).map(stryMutAct_9fa48("62208") ? () => undefined : (stryCov_9fa48("62208"), service => <div key={service.name} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <h3 className="font-semibold text-lg text-primary-400 mb-2">{service.name}</h3>
                    <p className="text-neutral-300">{service.use}</p>
                  </div>))}
              </div>
            </section>
          </div>)}

        {/* Integrations Tab */}
        {stryMutAct_9fa48("62211") ? activeTab === 'integrations' || <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Integration Reality</h2>
              <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-900">
                    <tr>
                      <th className="text-left p-4 font-medium text-neutral-400">System</th>
                      <th className="text-left p-4 font-medium text-neutral-400">Difficulty</th>
                      <th className="text-left p-4 font-medium text-neutral-400">Timeline</th>
                      <th className="text-left p-4 font-medium text-neutral-400">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {integrations.map(int => <tr key={int.system} className="border-t border-neutral-700">
                        <td className="p-4 font-medium">{int.system}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${int.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' : int.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                            {int.difficulty === 'easy' ? '✅ Easy' : int.difficulty === 'medium' ? '⚠️ Medium' : '⛔ Hard'}
                          </span>
                        </td>
                        <td className="p-4 text-neutral-300">{int.timeline}</td>
                        <td className="p-4 text-neutral-400">{int.notes}</td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bg-yellow-500/10 rounded-xl p-6 border border-yellow-500/30">
              <h3 className="font-semibold text-yellow-400 mb-2">⚠️ What Breaks</h3>
              <p className="text-neutral-300">
                EHR integrations require hospital IT involvement. Epic MyChart integration adds 4–6 weeks. 
                Budget $100k–$200k for complex EHR connections.
              </p>
            </section>
          </div> : stryMutAct_9fa48("62210") ? false : stryMutAct_9fa48("62209") ? true : (stryCov_9fa48("62209", "62210", "62211"), (stryMutAct_9fa48("62213") ? activeTab !== 'integrations' : stryMutAct_9fa48("62212") ? true : (stryCov_9fa48("62212", "62213"), activeTab === 'integrations')) && <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Integration Reality</h2>
              <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-900">
                    <tr>
                      <th className="text-left p-4 font-medium text-neutral-400">System</th>
                      <th className="text-left p-4 font-medium text-neutral-400">Difficulty</th>
                      <th className="text-left p-4 font-medium text-neutral-400">Timeline</th>
                      <th className="text-left p-4 font-medium text-neutral-400">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {integrations.map(stryMutAct_9fa48("62215") ? () => undefined : (stryCov_9fa48("62215"), int => <tr key={int.system} className="border-t border-neutral-700">
                        <td className="p-4 font-medium">{int.system}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${(stryMutAct_9fa48("62219") ? int.difficulty !== 'easy' : stryMutAct_9fa48("62218") ? false : stryMutAct_9fa48("62217") ? true : (stryCov_9fa48("62217", "62218", "62219"), int.difficulty === 'easy')) ? 'bg-green-500/20 text-green-400' : (stryMutAct_9fa48("62224") ? int.difficulty !== 'medium' : stryMutAct_9fa48("62223") ? false : stryMutAct_9fa48("62222") ? true : (stryCov_9fa48("62222", "62223", "62224"), int.difficulty === 'medium')) ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                            {(stryMutAct_9fa48("62230") ? int.difficulty !== 'easy' : stryMutAct_9fa48("62229") ? false : stryMutAct_9fa48("62228") ? true : (stryCov_9fa48("62228", "62229", "62230"), int.difficulty === 'easy')) ? '✅ Easy' : (stryMutAct_9fa48("62235") ? int.difficulty !== 'medium' : stryMutAct_9fa48("62234") ? false : stryMutAct_9fa48("62233") ? true : (stryCov_9fa48("62233", "62234", "62235"), int.difficulty === 'medium')) ? '⚠️ Medium' : '⛔ Hard'}
                          </span>
                        </td>
                        <td className="p-4 text-neutral-300">{int.timeline}</td>
                        <td className="p-4 text-neutral-400">{int.notes}</td>
                      </tr>))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bg-yellow-500/10 rounded-xl p-6 border border-yellow-500/30">
              <h3 className="font-semibold text-yellow-400 mb-2">⚠️ What Breaks</h3>
              <p className="text-neutral-300">
                EHR integrations require hospital IT involvement. Epic MyChart integration adds 4–6 weeks. 
                Budget $100k–$200k for complex EHR connections.
              </p>
            </section>
          </div>)}

        {/* Pricing Tab */}
        {stryMutAct_9fa48("62241") ? activeTab === 'pricing' || <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Healthcare Pricing</h2>
              <div className="grid grid-cols-4 gap-6">
                {pricing.map((pkg, idx) => <div key={pkg.package} className={`rounded-xl p-6 border ${idx === 2 ? 'bg-primary-900/20 border-primary-500' : 'bg-neutral-800 border-neutral-700'}`}>
                    {idx === 2 && <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded mb-3 inline-block">Most Popular</span>}
                    <h3 className="font-semibold text-lg mb-2">{pkg.package}</h3>
                    <p className="text-2xl font-bold text-primary-400 mb-4">{pkg.price}</p>
                    <p className="text-neutral-400 mb-4">{pkg.includes}</p>
                    <p className="text-sm text-green-400">ROI: {pkg.roi}</p>
                  </div>)}
              </div>
            </section>

            <section className="text-center">
              <p className="text-neutral-400 mb-6">
                <strong>Ecosystem Hook:</strong> Share anonymized clinical outcomes with other health systems 
                via CendiaMesh™ consortium mode (opt-in).
              </p>
              <div className="flex justify-center gap-4">
                <button onClick={() => navigate('/demo')} className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                  Request Healthcare Demo
                </button>
                <button onClick={() => navigate('/contact')} className="px-8 py-3 border border-neutral-600 text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors">
                  Talk to Sales
                </button>
              </div>
            </section>
          </div> : stryMutAct_9fa48("62240") ? false : stryMutAct_9fa48("62239") ? true : (stryCov_9fa48("62239", "62240", "62241"), (stryMutAct_9fa48("62243") ? activeTab !== 'pricing' : stryMutAct_9fa48("62242") ? true : (stryCov_9fa48("62242", "62243"), activeTab === 'pricing')) && <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Healthcare Pricing</h2>
              <div className="grid grid-cols-4 gap-6">
                {pricing.map(stryMutAct_9fa48("62245") ? () => undefined : (stryCov_9fa48("62245"), (pkg, idx) => <div key={pkg.package} className={`rounded-xl p-6 border ${(stryMutAct_9fa48("62249") ? idx !== 2 : stryMutAct_9fa48("62248") ? false : stryMutAct_9fa48("62247") ? true : (stryCov_9fa48("62247", "62248", "62249"), idx === 2)) ? 'bg-primary-900/20 border-primary-500' : 'bg-neutral-800 border-neutral-700'}`}>
                    {stryMutAct_9fa48("62254") ? idx === 2 || <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded mb-3 inline-block">Most Popular</span> : stryMutAct_9fa48("62253") ? false : stryMutAct_9fa48("62252") ? true : (stryCov_9fa48("62252", "62253", "62254"), (stryMutAct_9fa48("62256") ? idx !== 2 : stryMutAct_9fa48("62255") ? true : (stryCov_9fa48("62255", "62256"), idx === 2)) && <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded mb-3 inline-block">Most Popular</span>)}
                    <h3 className="font-semibold text-lg mb-2">{pkg.package}</h3>
                    <p className="text-2xl font-bold text-primary-400 mb-4">{pkg.price}</p>
                    <p className="text-neutral-400 mb-4">{pkg.includes}</p>
                    <p className="text-sm text-green-400">ROI: {pkg.roi}</p>
                  </div>))}
              </div>
            </section>

            <section className="text-center">
              <p className="text-neutral-400 mb-6">
                <strong>Ecosystem Hook:</strong> Share anonymized clinical outcomes with other health systems 
                via CendiaMesh™ consortium mode (opt-in).
              </p>
              <div className="flex justify-center gap-4">
                <button onClick={stryMutAct_9fa48("62257") ? () => undefined : (stryCov_9fa48("62257"), () => navigate('/demo'))} className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                  Request Healthcare Demo
                </button>
                <button onClick={stryMutAct_9fa48("62259") ? () => undefined : (stryCov_9fa48("62259"), () => navigate('/contact'))} className="px-8 py-3 border border-neutral-600 text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors">
                  Talk to Sales
                </button>
              </div>
            </section>
          </div>)}
      </div>
    </div>;
};
export default HealthcarePage;