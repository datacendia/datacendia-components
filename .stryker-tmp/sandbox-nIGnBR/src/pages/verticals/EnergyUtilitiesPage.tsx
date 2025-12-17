// @ts-nocheck
// =============================================================================
// DATACENDIA ENERGY & UTILITIES VERTICAL
// Grid intelligence and regulatory compliance for energy transition
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
const agents = stryMutAct_9fa48("61382") ? [] : (stryCov_9fa48("61382"), [stryMutAct_9fa48("61383") ? {} : (stryCov_9fa48("61383"), {
  code: 'grid-ops',
  name: 'Grid Operations',
  purpose: 'Load balancing, outage management, renewable integration',
  model: 'qwq:32b'
}), stryMutAct_9fa48("61388") ? {} : (stryCov_9fa48("61388"), {
  code: 'regulatory-energy',
  name: 'Regulatory Manager',
  purpose: 'Rate cases, PUC filings, compliance tracking',
  model: 'llama3.3:70b'
}), stryMutAct_9fa48("61393") ? {} : (stryCov_9fa48("61393"), {
  code: 'asset-mgr',
  name: 'Asset Manager',
  purpose: 'Infrastructure planning, maintenance optimization, lifecycle',
  model: 'qwq:32b'
}), stryMutAct_9fa48("61398") ? {} : (stryCov_9fa48("61398"), {
  code: 'trading',
  name: 'Trading Analyst',
  purpose: 'Energy trading, hedging strategy, market analysis',
  model: 'llama3.3:70b'
})]);
const compliance = stryMutAct_9fa48("61403") ? [] : (stryCov_9fa48("61403"), ['NERC CIP', 'FERC', 'EPA', 'State PUC', 'ISO/RTO Rules', 'OSHA', 'Clean Air Act', 'Renewable Standards']);
const pricing = stryMutAct_9fa48("61412") ? [] : (stryCov_9fa48("61412"), [stryMutAct_9fa48("61413") ? {} : (stryCov_9fa48("61413"), {
  package: 'Energy Starter',
  price: '$120,000',
  includes: '8 Pillars + 4 Energy Agents',
  roi: '8 months'
}), stryMutAct_9fa48("61418") ? {} : (stryCov_9fa48("61418"), {
  package: 'Energy Professional',
  price: '$1,200,000',
  includes: '+ Panopticon, Aegis, Crucible',
  roi: '5 months'
}), stryMutAct_9fa48("61423") ? {} : (stryCov_9fa48("61423"), {
  package: 'Energy Enterprise',
  price: '$6,000,000',
  includes: '+ Full Guardian Suite',
  roi: '3 months'
}), stryMutAct_9fa48("61428") ? {} : (stryCov_9fa48("61428"), {
  package: 'Energy Sovereign',
  price: '$15,000,000+',
  includes: '+ Grid-scale, SCADA secure',
  roi: '2 months'
})]);
export const EnergyUtilitiesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'pricing'>('overview');
  return <div className="min-h-screen bg-neutral-900 text-white">
      <div className="relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/20 via-neutral-900 to-neutral-900"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <button onClick={stryMutAct_9fa48("61435") ? () => undefined : (stryCov_9fa48("61435"), () => navigate('/verticals'))} className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6">← Back to Verticals</button>
          
          <div className="flex items-start gap-6">
            <span className="text-6xl">⚡</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">📈 Growth Vertical</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">🔒 100% Sovereignty</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Energy & Utilities</h1>
              <p className="text-xl text-neutral-300 max-w-3xl">
                Grid intelligence and regulatory compliance for the energy transition. 
                NERC CIP compliant with full air-gap capability for critical infrastructure.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">Pilot Result</p>
              <p className="text-3xl font-bold text-green-400">45%</p>
              <p className="text-neutral-300">faster rate case prep</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 mt-12">
            {(stryMutAct_9fa48("61437") ? [] : (stryCov_9fa48("61437"), [stryMutAct_9fa48("61438") ? {} : (stryCov_9fa48("61438"), {
            label: '18-Month ROI',
            value: '32%',
            subtext: 'efficiency gain'
          }), stryMutAct_9fa48("61442") ? {} : (stryCov_9fa48("61442"), {
            label: 'Rate Case Prep',
            value: '45%',
            subtext: 'faster'
          }), stryMutAct_9fa48("61446") ? {} : (stryCov_9fa48("61446"), {
            label: 'Outage Response',
            value: '28%',
            subtext: 'improvement'
          }), stryMutAct_9fa48("61450") ? {} : (stryCov_9fa48("61450"), {
            label: 'NERC CIP',
            value: '100%',
            subtext: 'compliant'
          })])).map(stryMutAct_9fa48("61454") ? () => undefined : (stryCov_9fa48("61454"), stat => <div key={stat.label} className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700">
                <p className="text-3xl font-bold text-primary-400">{stat.value}</p>
                <p className="font-medium">{stat.label}</p>
                <p className="text-sm text-neutral-500">{stat.subtext}</p>
              </div>))}
          </div>
        </div>
      </div>

      <div className="border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {(stryMutAct_9fa48("61455") ? [] : (stryCov_9fa48("61455"), ['overview', 'agents', 'pricing'])).map(stryMutAct_9fa48("61459") ? () => undefined : (stryCov_9fa48("61459"), tab => <button key={tab} onClick={stryMutAct_9fa48("61460") ? () => undefined : (stryCov_9fa48("61460"), () => setActiveTab(tab as typeof activeTab))} className={`px-6 py-4 font-medium capitalize transition-all border-b-2 ${(stryMutAct_9fa48("61464") ? activeTab !== tab : stryMutAct_9fa48("61463") ? false : stryMutAct_9fa48("61462") ? true : (stryCov_9fa48("61462", "61463", "61464"), activeTab === tab)) ? 'border-primary-500 text-white' : 'border-transparent text-neutral-400 hover:text-white'}`}>
                {(stryMutAct_9fa48("61469") ? tab !== 'agents' : stryMutAct_9fa48("61468") ? false : stryMutAct_9fa48("61467") ? true : (stryCov_9fa48("61467", "61468", "61469"), tab === 'agents')) ? 'Agents & Overlays' : tab}
              </button>))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {stryMutAct_9fa48("61474") ? activeTab === 'overview' || <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Energy</h2>
              <div className="grid grid-cols-3 gap-6">
                {[{
              title: 'NERC CIP Compliant',
              desc: 'Full compliance with critical infrastructure protection standards, air-gapped deployment option',
              icon: '🔒'
            }, {
              title: 'Energy Transition Ready',
              desc: 'AI-powered renewable integration, storage optimization, and grid balancing',
              icon: '🌱'
            }, {
              title: 'Rate Case Acceleration',
              desc: '45% faster preparation with automated evidence gathering and analysis',
              icon: '📋'
            }].map(item => <div key={item.title} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <span className="text-3xl">{item.icon}</span>
                    <h3 className="text-lg font-semibold mt-4 mb-2">{item.title}</h3>
                    <p className="text-neutral-400">{item.desc}</p>
                  </div>)}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Customer Results</h2>
              <div className="space-y-4">
                {[{
              org: 'Investor-Owned Utility',
              quote: 'Rate case preparation time cut by 45%. The Council assembled evidence from 12 systems that took our team months to compile manually.',
              metric: '45% faster'
            }, {
              org: 'Regional Transmission Org',
              quote: 'Grid reliability decisions now happen in real-time instead of weekly planning meetings.',
              metric: 'Real-time decisions'
            }, {
              org: 'Renewable Developer',
              quote: 'Interconnection queue decisions accelerated by 60%. We can evaluate 3x more projects per quarter.',
              metric: '3x throughput'
            }].map((cs, idx) => <div key={idx} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-neutral-300 text-lg italic">"{cs.quote}"</p>
                        <p className="text-neutral-500 mt-3">— {cs.org}</p>
                      </div>
                      <div className="ml-6 text-right">
                        <p className="text-2xl font-bold text-green-400">{cs.metric}</p>
                      </div>
                    </div>
                  </div>)}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Compliance Frameworks</h2>
              <div className="flex flex-wrap gap-2">
                {compliance.map(c => <span key={c} className="px-4 py-2 bg-yellow-500/10 text-yellow-400 rounded-lg border border-yellow-500/30 font-medium">{c}</span>)}
              </div>
            </section>
          </div> : stryMutAct_9fa48("61473") ? false : stryMutAct_9fa48("61472") ? true : (stryCov_9fa48("61472", "61473", "61474"), (stryMutAct_9fa48("61476") ? activeTab !== 'overview' : stryMutAct_9fa48("61475") ? true : (stryCov_9fa48("61475", "61476"), activeTab === 'overview')) && <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Energy</h2>
              <div className="grid grid-cols-3 gap-6">
                {(stryMutAct_9fa48("61478") ? [] : (stryCov_9fa48("61478"), [stryMutAct_9fa48("61479") ? {} : (stryCov_9fa48("61479"), {
              title: 'NERC CIP Compliant',
              desc: 'Full compliance with critical infrastructure protection standards, air-gapped deployment option',
              icon: '🔒'
            }), stryMutAct_9fa48("61483") ? {} : (stryCov_9fa48("61483"), {
              title: 'Energy Transition Ready',
              desc: 'AI-powered renewable integration, storage optimization, and grid balancing',
              icon: '🌱'
            }), stryMutAct_9fa48("61487") ? {} : (stryCov_9fa48("61487"), {
              title: 'Rate Case Acceleration',
              desc: '45% faster preparation with automated evidence gathering and analysis',
              icon: '📋'
            })])).map(stryMutAct_9fa48("61491") ? () => undefined : (stryCov_9fa48("61491"), item => <div key={item.title} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <span className="text-3xl">{item.icon}</span>
                    <h3 className="text-lg font-semibold mt-4 mb-2">{item.title}</h3>
                    <p className="text-neutral-400">{item.desc}</p>
                  </div>))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Customer Results</h2>
              <div className="space-y-4">
                {(stryMutAct_9fa48("61492") ? [] : (stryCov_9fa48("61492"), [stryMutAct_9fa48("61493") ? {} : (stryCov_9fa48("61493"), {
              org: 'Investor-Owned Utility',
              quote: 'Rate case preparation time cut by 45%. The Council assembled evidence from 12 systems that took our team months to compile manually.',
              metric: '45% faster'
            }), stryMutAct_9fa48("61497") ? {} : (stryCov_9fa48("61497"), {
              org: 'Regional Transmission Org',
              quote: 'Grid reliability decisions now happen in real-time instead of weekly planning meetings.',
              metric: 'Real-time decisions'
            }), stryMutAct_9fa48("61501") ? {} : (stryCov_9fa48("61501"), {
              org: 'Renewable Developer',
              quote: 'Interconnection queue decisions accelerated by 60%. We can evaluate 3x more projects per quarter.',
              metric: '3x throughput'
            })])).map(stryMutAct_9fa48("61505") ? () => undefined : (stryCov_9fa48("61505"), (cs, idx) => <div key={idx} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-neutral-300 text-lg italic">"{cs.quote}"</p>
                        <p className="text-neutral-500 mt-3">— {cs.org}</p>
                      </div>
                      <div className="ml-6 text-right">
                        <p className="text-2xl font-bold text-green-400">{cs.metric}</p>
                      </div>
                    </div>
                  </div>))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Compliance Frameworks</h2>
              <div className="flex flex-wrap gap-2">
                {compliance.map(stryMutAct_9fa48("61506") ? () => undefined : (stryCov_9fa48("61506"), c => <span key={c} className="px-4 py-2 bg-yellow-500/10 text-yellow-400 rounded-lg border border-yellow-500/30 font-medium">{c}</span>))}
              </div>
            </section>
          </div>)}

        {stryMutAct_9fa48("61509") ? activeTab === 'agents' || <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Energy & Utilities Agents</h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map(agent => <div key={agent.code} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center"><span className="text-xl">🤖</span></div>
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
          </div> : stryMutAct_9fa48("61508") ? false : stryMutAct_9fa48("61507") ? true : (stryCov_9fa48("61507", "61508", "61509"), (stryMutAct_9fa48("61511") ? activeTab !== 'agents' : stryMutAct_9fa48("61510") ? true : (stryCov_9fa48("61510", "61511"), activeTab === 'agents')) && <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Energy & Utilities Agents</h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map(stryMutAct_9fa48("61513") ? () => undefined : (stryCov_9fa48("61513"), agent => <div key={agent.code} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center"><span className="text-xl">🤖</span></div>
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
          </div>)}

        {stryMutAct_9fa48("61516") ? activeTab === 'pricing' || <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Energy Pricing</h2>
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
              <div className="flex justify-center gap-4">
                <button onClick={() => navigate('/demo')} className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Request Energy Demo</button>
                <button onClick={() => navigate('/contact')} className="px-8 py-3 border border-neutral-600 text-white rounded-lg font-medium hover:bg-neutral-800">Talk to Sales</button>
              </div>
            </section>
          </div> : stryMutAct_9fa48("61515") ? false : stryMutAct_9fa48("61514") ? true : (stryCov_9fa48("61514", "61515", "61516"), (stryMutAct_9fa48("61518") ? activeTab !== 'pricing' : stryMutAct_9fa48("61517") ? true : (stryCov_9fa48("61517", "61518"), activeTab === 'pricing')) && <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Energy Pricing</h2>
              <div className="grid grid-cols-4 gap-6">
                {pricing.map(stryMutAct_9fa48("61520") ? () => undefined : (stryCov_9fa48("61520"), (pkg, idx) => <div key={pkg.package} className={`rounded-xl p-6 border ${(stryMutAct_9fa48("61524") ? idx !== 2 : stryMutAct_9fa48("61523") ? false : stryMutAct_9fa48("61522") ? true : (stryCov_9fa48("61522", "61523", "61524"), idx === 2)) ? 'bg-primary-900/20 border-primary-500' : 'bg-neutral-800 border-neutral-700'}`}>
                    {stryMutAct_9fa48("61529") ? idx === 2 || <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded mb-3 inline-block">Most Popular</span> : stryMutAct_9fa48("61528") ? false : stryMutAct_9fa48("61527") ? true : (stryCov_9fa48("61527", "61528", "61529"), (stryMutAct_9fa48("61531") ? idx !== 2 : stryMutAct_9fa48("61530") ? true : (stryCov_9fa48("61530", "61531"), idx === 2)) && <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded mb-3 inline-block">Most Popular</span>)}
                    <h3 className="font-semibold text-lg mb-2">{pkg.package}</h3>
                    <p className="text-2xl font-bold text-primary-400 mb-4">{pkg.price}</p>
                    <p className="text-neutral-400 mb-4">{pkg.includes}</p>
                    <p className="text-sm text-green-400">ROI: {pkg.roi}</p>
                  </div>))}
              </div>
            </section>
            <section className="text-center">
              <div className="flex justify-center gap-4">
                <button onClick={stryMutAct_9fa48("61532") ? () => undefined : (stryCov_9fa48("61532"), () => navigate('/demo'))} className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Request Energy Demo</button>
                <button onClick={stryMutAct_9fa48("61534") ? () => undefined : (stryCov_9fa48("61534"), () => navigate('/contact'))} className="px-8 py-3 border border-neutral-600 text-white rounded-lg font-medium hover:bg-neutral-800">Talk to Sales</button>
              </div>
            </section>
          </div>)}
      </div>
    </div>;
};
export default EnergyUtilitiesPage;