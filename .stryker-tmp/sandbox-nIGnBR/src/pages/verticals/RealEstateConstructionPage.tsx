// @ts-nocheck
// =============================================================================
// DATACENDIA REAL ESTATE / CONSTRUCTION VERTICAL
// Development decisions, project intelligence, and property analytics
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
const agents = stryMutAct_9fa48("63182") ? [] : (stryCov_9fa48("63182"), [stryMutAct_9fa48("63183") ? {} : (stryCov_9fa48("63183"), {
  code: 'development',
  name: 'Development Director',
  purpose: 'Site selection, feasibility analysis, project approval',
  model: 'qwq:32b'
}), stryMutAct_9fa48("63188") ? {} : (stryCov_9fa48("63188"), {
  code: 'construction',
  name: 'Construction Manager',
  purpose: 'Project scheduling, contractor management, cost control',
  model: 'llama3.3:70b'
}), stryMutAct_9fa48("63193") ? {} : (stryCov_9fa48("63193"), {
  code: 'investment',
  name: 'Investment Analyst',
  purpose: 'Deal evaluation, cap rate analysis, portfolio optimization',
  model: 'qwq:32b'
}), stryMutAct_9fa48("63198") ? {} : (stryCov_9fa48("63198"), {
  code: 'property',
  name: 'Property Manager',
  purpose: 'Lease optimization, tenant relations, maintenance planning',
  model: 'llama3.3:70b'
})]);
const compliance = stryMutAct_9fa48("63203") ? [] : (stryCov_9fa48("63203"), ['Zoning Laws', 'Building Codes', 'Environmental (NEPA)', 'ADA', 'OSHA', 'Fair Housing', 'Contractor Licensing']);
const pricing = stryMutAct_9fa48("63211") ? [] : (stryCov_9fa48("63211"), [stryMutAct_9fa48("63212") ? {} : (stryCov_9fa48("63212"), {
  package: 'Real Estate Starter',
  price: '$80,000',
  includes: '8 Pillars + 4 RE Agents',
  roi: '8 months'
}), stryMutAct_9fa48("63217") ? {} : (stryCov_9fa48("63217"), {
  package: 'Real Estate Professional',
  price: '$500,000',
  includes: '+ Predict, Crucible, Panopticon',
  roi: '5 months'
}), stryMutAct_9fa48("63222") ? {} : (stryCov_9fa48("63222"), {
  package: 'Real Estate Enterprise',
  price: '$2,500,000',
  includes: '+ Full Guardian Suite',
  roi: '3 months'
}), stryMutAct_9fa48("63227") ? {} : (stryCov_9fa48("63227"), {
  package: 'Real Estate Sovereign',
  price: '$6,000,000+',
  includes: '+ Multi-portfolio, custom',
  roi: '2 months'
})]);
export const RealEstateConstructionPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'pricing'>('overview');
  return <div className="min-h-screen bg-neutral-900 text-white">
      <div className="relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900/30 via-neutral-900 to-neutral-900"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <button onClick={stryMutAct_9fa48("63234") ? () => undefined : (stryCov_9fa48("63234"), () => navigate('/verticals'))} className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6">← Back to Verticals</button>
          
          <div className="flex items-start gap-6">
            <span className="text-6xl">🏗️</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">📈 Growth Vertical</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">🔒 85% Sovereignty</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Real Estate / Construction</h1>
              <p className="text-xl text-neutral-300 max-w-3xl">
                Development decisions, project intelligence, and property portfolio optimization. 
                From site selection to construction management to asset disposition.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">Pilot Result</p>
              <p className="text-3xl font-bold text-green-400">22%</p>
              <p className="text-neutral-300">project cost savings</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 mt-12">
            {(stryMutAct_9fa48("63236") ? [] : (stryCov_9fa48("63236"), [stryMutAct_9fa48("63237") ? {} : (stryCov_9fa48("63237"), {
            label: '18-Month ROI',
            value: '24%',
            subtext: 'cost reduction'
          }), stryMutAct_9fa48("63241") ? {} : (stryCov_9fa48("63241"), {
            label: 'Project Decisions',
            value: '45%',
            subtext: 'faster'
          }), stryMutAct_9fa48("63245") ? {} : (stryCov_9fa48("63245"), {
            label: 'Deal Analysis',
            value: '5x',
            subtext: 'more deals reviewed'
          }), stryMutAct_9fa48("63249") ? {} : (stryCov_9fa48("63249"), {
            label: 'Change Orders',
            value: '-35%',
            subtext: 'reduction'
          })])).map(stryMutAct_9fa48("63253") ? () => undefined : (stryCov_9fa48("63253"), stat => <div key={stat.label} className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700">
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
            {(stryMutAct_9fa48("63254") ? [] : (stryCov_9fa48("63254"), ['overview', 'agents', 'pricing'])).map(stryMutAct_9fa48("63258") ? () => undefined : (stryCov_9fa48("63258"), tab => <button key={tab} onClick={stryMutAct_9fa48("63259") ? () => undefined : (stryCov_9fa48("63259"), () => setActiveTab(tab as typeof activeTab))} className={`px-6 py-4 font-medium capitalize transition-all border-b-2 ${(stryMutAct_9fa48("63263") ? activeTab !== tab : stryMutAct_9fa48("63262") ? false : stryMutAct_9fa48("63261") ? true : (stryCov_9fa48("63261", "63262", "63263"), activeTab === tab)) ? 'border-primary-500 text-white' : 'border-transparent text-neutral-400 hover:text-white'}`}>
                {(stryMutAct_9fa48("63268") ? tab !== 'agents' : stryMutAct_9fa48("63267") ? false : stryMutAct_9fa48("63266") ? true : (stryCov_9fa48("63266", "63267", "63268"), tab === 'agents')) ? 'Agents & Analytics' : tab}
              </button>))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {stryMutAct_9fa48("63273") ? activeTab === 'overview' || <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Real Estate</h2>
              <div className="grid grid-cols-3 gap-6">
                {[{
              title: 'Deal Intelligence',
              desc: 'AI-powered feasibility analysis reviewing market data, comps, and risk factors for faster go/no-go decisions',
              icon: '📊'
            }, {
              title: 'Construction Optimization',
              desc: 'Project scheduling with AI-predicted delays, change order reduction, and contractor performance tracking',
              icon: '🏗️'
            }, {
              title: 'Portfolio Analytics',
              desc: 'Real-time asset performance monitoring with disposition and refinance recommendations',
              icon: '🏢'
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
              org: 'Regional Developer',
              quote: 'Project cost overruns reduced 22% through AI-predicted change order prevention. Council identified design conflicts before construction.',
              metric: '22% cost savings'
            }, {
              org: 'REIT ($2B AUM)',
              quote: 'Deal analysis time cut from 3 weeks to 3 days. We now review 5x more opportunities with better data.',
              metric: '5x deal velocity'
            }, {
              org: 'General Contractor',
              quote: 'Schedule delays reduced 40% by predicting weather, labor, and supply chain impacts 60 days out.',
              metric: '40% fewer delays'
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
                {compliance.map(c => <span key={c} className="px-4 py-2 bg-stone-500/10 text-stone-400 rounded-lg border border-stone-500/30 font-medium">{c}</span>)}
              </div>
            </section>
          </div> : stryMutAct_9fa48("63272") ? false : stryMutAct_9fa48("63271") ? true : (stryCov_9fa48("63271", "63272", "63273"), (stryMutAct_9fa48("63275") ? activeTab !== 'overview' : stryMutAct_9fa48("63274") ? true : (stryCov_9fa48("63274", "63275"), activeTab === 'overview')) && <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Real Estate</h2>
              <div className="grid grid-cols-3 gap-6">
                {(stryMutAct_9fa48("63277") ? [] : (stryCov_9fa48("63277"), [stryMutAct_9fa48("63278") ? {} : (stryCov_9fa48("63278"), {
              title: 'Deal Intelligence',
              desc: 'AI-powered feasibility analysis reviewing market data, comps, and risk factors for faster go/no-go decisions',
              icon: '📊'
            }), stryMutAct_9fa48("63282") ? {} : (stryCov_9fa48("63282"), {
              title: 'Construction Optimization',
              desc: 'Project scheduling with AI-predicted delays, change order reduction, and contractor performance tracking',
              icon: '🏗️'
            }), stryMutAct_9fa48("63286") ? {} : (stryCov_9fa48("63286"), {
              title: 'Portfolio Analytics',
              desc: 'Real-time asset performance monitoring with disposition and refinance recommendations',
              icon: '🏢'
            })])).map(stryMutAct_9fa48("63290") ? () => undefined : (stryCov_9fa48("63290"), item => <div key={item.title} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <span className="text-3xl">{item.icon}</span>
                    <h3 className="text-lg font-semibold mt-4 mb-2">{item.title}</h3>
                    <p className="text-neutral-400">{item.desc}</p>
                  </div>))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Customer Results</h2>
              <div className="space-y-4">
                {(stryMutAct_9fa48("63291") ? [] : (stryCov_9fa48("63291"), [stryMutAct_9fa48("63292") ? {} : (stryCov_9fa48("63292"), {
              org: 'Regional Developer',
              quote: 'Project cost overruns reduced 22% through AI-predicted change order prevention. Council identified design conflicts before construction.',
              metric: '22% cost savings'
            }), stryMutAct_9fa48("63296") ? {} : (stryCov_9fa48("63296"), {
              org: 'REIT ($2B AUM)',
              quote: 'Deal analysis time cut from 3 weeks to 3 days. We now review 5x more opportunities with better data.',
              metric: '5x deal velocity'
            }), stryMutAct_9fa48("63300") ? {} : (stryCov_9fa48("63300"), {
              org: 'General Contractor',
              quote: 'Schedule delays reduced 40% by predicting weather, labor, and supply chain impacts 60 days out.',
              metric: '40% fewer delays'
            })])).map(stryMutAct_9fa48("63304") ? () => undefined : (stryCov_9fa48("63304"), (cs, idx) => <div key={idx} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
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
                {compliance.map(stryMutAct_9fa48("63305") ? () => undefined : (stryCov_9fa48("63305"), c => <span key={c} className="px-4 py-2 bg-stone-500/10 text-stone-400 rounded-lg border border-stone-500/30 font-medium">{c}</span>))}
              </div>
            </section>
          </div>)}

        {stryMutAct_9fa48("63308") ? activeTab === 'agents' || <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Real Estate & Construction Agents</h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map(agent => <div key={agent.code} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-stone-500/20 rounded-full flex items-center justify-center"><span className="text-xl">🤖</span></div>
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
          </div> : stryMutAct_9fa48("63307") ? false : stryMutAct_9fa48("63306") ? true : (stryCov_9fa48("63306", "63307", "63308"), (stryMutAct_9fa48("63310") ? activeTab !== 'agents' : stryMutAct_9fa48("63309") ? true : (stryCov_9fa48("63309", "63310"), activeTab === 'agents')) && <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Real Estate & Construction Agents</h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map(stryMutAct_9fa48("63312") ? () => undefined : (stryCov_9fa48("63312"), agent => <div key={agent.code} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-stone-500/20 rounded-full flex items-center justify-center"><span className="text-xl">🤖</span></div>
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

        {stryMutAct_9fa48("63315") ? activeTab === 'pricing' || <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Real Estate Pricing</h2>
              <div className="grid grid-cols-4 gap-6">
                {pricing.map((pkg, idx) => <div key={pkg.package} className={`rounded-xl p-6 border ${idx === 1 ? 'bg-primary-900/20 border-primary-500' : 'bg-neutral-800 border-neutral-700'}`}>
                    {idx === 1 && <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded mb-3 inline-block">Most Popular</span>}
                    <h3 className="font-semibold text-lg mb-2">{pkg.package}</h3>
                    <p className="text-2xl font-bold text-primary-400 mb-4">{pkg.price}</p>
                    <p className="text-neutral-400 mb-4">{pkg.includes}</p>
                    <p className="text-sm text-green-400">ROI: {pkg.roi}</p>
                  </div>)}
              </div>
            </section>
            <section className="text-center">
              <div className="flex justify-center gap-4">
                <button onClick={() => navigate('/demo')} className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Request RE Demo</button>
                <button onClick={() => navigate('/contact')} className="px-8 py-3 border border-neutral-600 text-white rounded-lg font-medium hover:bg-neutral-800">Talk to Sales</button>
              </div>
            </section>
          </div> : stryMutAct_9fa48("63314") ? false : stryMutAct_9fa48("63313") ? true : (stryCov_9fa48("63313", "63314", "63315"), (stryMutAct_9fa48("63317") ? activeTab !== 'pricing' : stryMutAct_9fa48("63316") ? true : (stryCov_9fa48("63316", "63317"), activeTab === 'pricing')) && <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Real Estate Pricing</h2>
              <div className="grid grid-cols-4 gap-6">
                {pricing.map(stryMutAct_9fa48("63319") ? () => undefined : (stryCov_9fa48("63319"), (pkg, idx) => <div key={pkg.package} className={`rounded-xl p-6 border ${(stryMutAct_9fa48("63323") ? idx !== 1 : stryMutAct_9fa48("63322") ? false : stryMutAct_9fa48("63321") ? true : (stryCov_9fa48("63321", "63322", "63323"), idx === 1)) ? 'bg-primary-900/20 border-primary-500' : 'bg-neutral-800 border-neutral-700'}`}>
                    {stryMutAct_9fa48("63328") ? idx === 1 || <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded mb-3 inline-block">Most Popular</span> : stryMutAct_9fa48("63327") ? false : stryMutAct_9fa48("63326") ? true : (stryCov_9fa48("63326", "63327", "63328"), (stryMutAct_9fa48("63330") ? idx !== 1 : stryMutAct_9fa48("63329") ? true : (stryCov_9fa48("63329", "63330"), idx === 1)) && <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded mb-3 inline-block">Most Popular</span>)}
                    <h3 className="font-semibold text-lg mb-2">{pkg.package}</h3>
                    <p className="text-2xl font-bold text-primary-400 mb-4">{pkg.price}</p>
                    <p className="text-neutral-400 mb-4">{pkg.includes}</p>
                    <p className="text-sm text-green-400">ROI: {pkg.roi}</p>
                  </div>))}
              </div>
            </section>
            <section className="text-center">
              <div className="flex justify-center gap-4">
                <button onClick={stryMutAct_9fa48("63331") ? () => undefined : (stryCov_9fa48("63331"), () => navigate('/demo'))} className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Request RE Demo</button>
                <button onClick={stryMutAct_9fa48("63333") ? () => undefined : (stryCov_9fa48("63333"), () => navigate('/contact'))} className="px-8 py-3 border border-neutral-600 text-white rounded-lg font-medium hover:bg-neutral-800">Talk to Sales</button>
              </div>
            </section>
          </div>)}
      </div>
    </div>;
};
export default RealEstateConstructionPage;