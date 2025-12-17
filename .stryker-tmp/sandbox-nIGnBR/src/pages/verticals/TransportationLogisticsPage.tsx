// @ts-nocheck
// =============================================================================
// DATACENDIA TRANSPORTATION / LOGISTICS VERTICAL
// Fleet optimization, route intelligence, and supply chain decisions
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
const agents = stryMutAct_9fa48("63948") ? [] : (stryCov_9fa48("63948"), [stryMutAct_9fa48("63949") ? {} : (stryCov_9fa48("63949"), {
  code: 'fleet',
  name: 'Fleet Director',
  purpose: 'Vehicle optimization, maintenance scheduling, asset utilization',
  model: 'qwq:32b'
}), stryMutAct_9fa48("63954") ? {} : (stryCov_9fa48("63954"), {
  code: 'routing',
  name: 'Routing Manager',
  purpose: 'Route optimization, delivery scheduling, capacity planning',
  model: 'llama3.3:70b'
}), stryMutAct_9fa48("63959") ? {} : (stryCov_9fa48("63959"), {
  code: 'logistics',
  name: 'Logistics Analyst',
  purpose: 'Warehouse operations, inventory positioning, 3PL management',
  model: 'qwq:32b'
}), stryMutAct_9fa48("63964") ? {} : (stryCov_9fa48("63964"), {
  code: 'compliance-trans',
  name: 'Compliance Officer',
  purpose: 'DOT regulations, driver hours, safety compliance',
  model: 'llama3.3:70b'
})]);
const compliance = stryMutAct_9fa48("63969") ? [] : (stryCov_9fa48("63969"), ['DOT/FMCSA', 'Hours of Service', 'HAZMAT', 'Customs/CBP', 'EPA Emissions', 'OSHA', 'TSA Security']);
const pricing = stryMutAct_9fa48("63977") ? [] : (stryCov_9fa48("63977"), [stryMutAct_9fa48("63978") ? {} : (stryCov_9fa48("63978"), {
  package: 'Transport Starter',
  price: '$70,000',
  includes: '8 Pillars + 4 Transport Agents',
  roi: '6 months'
}), stryMutAct_9fa48("63983") ? {} : (stryCov_9fa48("63983"), {
  package: 'Transport Professional',
  price: '$500,000',
  includes: '+ Predict, Mesh, Panopticon',
  roi: '4 months'
}), stryMutAct_9fa48("63988") ? {} : (stryCov_9fa48("63988"), {
  package: 'Transport Enterprise',
  price: '$2,500,000',
  includes: '+ Full Guardian Suite',
  roi: '3 months'
}), stryMutAct_9fa48("63993") ? {} : (stryCov_9fa48("63993"), {
  package: 'Transport Sovereign',
  price: '$6,000,000+',
  includes: '+ Multi-modal, custom',
  roi: '2 months'
})]);
export const TransportationLogisticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'pricing'>('overview');
  return <div className="min-h-screen bg-neutral-900 text-white">
      <div className="relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/20 via-neutral-900 to-neutral-900"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <button onClick={stryMutAct_9fa48("64000") ? () => undefined : (stryCov_9fa48("64000"), () => navigate('/verticals'))} className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6">← Back to Verticals</button>
          
          <div className="flex items-start gap-6">
            <span className="text-6xl">🚚</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">📈 Growth Vertical</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">🔒 88% Sovereignty</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Transportation / Logistics</h1>
              <p className="text-xl text-neutral-300 max-w-3xl">
                Fleet optimization, route intelligence, and supply chain decision support. 
                From last-mile delivery to cross-border freight to warehouse operations.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">Pilot Result</p>
              <p className="text-3xl font-bold text-green-400">18%</p>
              <p className="text-neutral-300">fuel cost reduction</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 mt-12">
            {(stryMutAct_9fa48("64002") ? [] : (stryCov_9fa48("64002"), [stryMutAct_9fa48("64003") ? {} : (stryCov_9fa48("64003"), {
            label: '18-Month ROI',
            value: '26%',
            subtext: 'cost reduction'
          }), stryMutAct_9fa48("64007") ? {} : (stryCov_9fa48("64007"), {
            label: 'Route Efficiency',
            value: '18%',
            subtext: 'improvement'
          }), stryMutAct_9fa48("64011") ? {} : (stryCov_9fa48("64011"), {
            label: 'On-Time Delivery',
            value: '94%',
            subtext: 'vs 82% baseline'
          }), stryMutAct_9fa48("64015") ? {} : (stryCov_9fa48("64015"), {
            label: 'Fleet Utilization',
            value: '+22%',
            subtext: 'improvement'
          })])).map(stryMutAct_9fa48("64019") ? () => undefined : (stryCov_9fa48("64019"), stat => <div key={stat.label} className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700">
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
            {(stryMutAct_9fa48("64020") ? [] : (stryCov_9fa48("64020"), ['overview', 'agents', 'pricing'])).map(stryMutAct_9fa48("64024") ? () => undefined : (stryCov_9fa48("64024"), tab => <button key={tab} onClick={stryMutAct_9fa48("64025") ? () => undefined : (stryCov_9fa48("64025"), () => setActiveTab(tab as typeof activeTab))} className={`px-6 py-4 font-medium capitalize transition-all border-b-2 ${(stryMutAct_9fa48("64029") ? activeTab !== tab : stryMutAct_9fa48("64028") ? false : stryMutAct_9fa48("64027") ? true : (stryCov_9fa48("64027", "64028", "64029"), activeTab === tab)) ? 'border-primary-500 text-white' : 'border-transparent text-neutral-400 hover:text-white'}`}>
                {(stryMutAct_9fa48("64034") ? tab !== 'agents' : stryMutAct_9fa48("64033") ? false : stryMutAct_9fa48("64032") ? true : (stryCov_9fa48("64032", "64033", "64034"), tab === 'agents')) ? 'Agents & Analytics' : tab}
              </button>))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {stryMutAct_9fa48("64039") ? activeTab === 'overview' || <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Transportation</h2>
              <div className="grid grid-cols-3 gap-6">
                {[{
              title: 'Route Optimization',
              desc: 'AI-powered routing that considers traffic, weather, driver hours, and delivery windows in real-time',
              icon: '🗺️'
            }, {
              title: 'Fleet Intelligence',
              desc: 'Predictive maintenance, asset utilization optimization, and replacement timing recommendations',
              icon: '🚛'
            }, {
              title: 'Compliance Automation',
              desc: 'DOT hours tracking, safety compliance, and regulatory reporting with full audit trail',
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
              org: 'Regional Trucking Company',
              quote: 'Fuel costs reduced 18% through AI-optimized routing. The Council factors in 23 variables our dispatchers couldn\'t process manually.',
              metric: '18% fuel savings'
            }, {
              org: 'E-Commerce Fulfillment',
              quote: 'On-time delivery improved from 82% to 94%. Customer complaints dropped 60% in first quarter.',
              metric: '94% on-time'
            }, {
              org: '3PL Provider',
              quote: 'Warehouse labor optimization freed 22% capacity without adding headcount. We took on 3 new clients.',
              metric: '22% more capacity'
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
                {compliance.map(c => <span key={c} className="px-4 py-2 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/30 font-medium">{c}</span>)}
              </div>
            </section>
          </div> : stryMutAct_9fa48("64038") ? false : stryMutAct_9fa48("64037") ? true : (stryCov_9fa48("64037", "64038", "64039"), (stryMutAct_9fa48("64041") ? activeTab !== 'overview' : stryMutAct_9fa48("64040") ? true : (stryCov_9fa48("64040", "64041"), activeTab === 'overview')) && <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Transportation</h2>
              <div className="grid grid-cols-3 gap-6">
                {(stryMutAct_9fa48("64043") ? [] : (stryCov_9fa48("64043"), [stryMutAct_9fa48("64044") ? {} : (stryCov_9fa48("64044"), {
              title: 'Route Optimization',
              desc: 'AI-powered routing that considers traffic, weather, driver hours, and delivery windows in real-time',
              icon: '🗺️'
            }), stryMutAct_9fa48("64048") ? {} : (stryCov_9fa48("64048"), {
              title: 'Fleet Intelligence',
              desc: 'Predictive maintenance, asset utilization optimization, and replacement timing recommendations',
              icon: '🚛'
            }), stryMutAct_9fa48("64052") ? {} : (stryCov_9fa48("64052"), {
              title: 'Compliance Automation',
              desc: 'DOT hours tracking, safety compliance, and regulatory reporting with full audit trail',
              icon: '📋'
            })])).map(stryMutAct_9fa48("64056") ? () => undefined : (stryCov_9fa48("64056"), item => <div key={item.title} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <span className="text-3xl">{item.icon}</span>
                    <h3 className="text-lg font-semibold mt-4 mb-2">{item.title}</h3>
                    <p className="text-neutral-400">{item.desc}</p>
                  </div>))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Customer Results</h2>
              <div className="space-y-4">
                {(stryMutAct_9fa48("64057") ? [] : (stryCov_9fa48("64057"), [stryMutAct_9fa48("64058") ? {} : (stryCov_9fa48("64058"), {
              org: 'Regional Trucking Company',
              quote: 'Fuel costs reduced 18% through AI-optimized routing. The Council factors in 23 variables our dispatchers couldn\'t process manually.',
              metric: '18% fuel savings'
            }), stryMutAct_9fa48("64062") ? {} : (stryCov_9fa48("64062"), {
              org: 'E-Commerce Fulfillment',
              quote: 'On-time delivery improved from 82% to 94%. Customer complaints dropped 60% in first quarter.',
              metric: '94% on-time'
            }), stryMutAct_9fa48("64066") ? {} : (stryCov_9fa48("64066"), {
              org: '3PL Provider',
              quote: 'Warehouse labor optimization freed 22% capacity without adding headcount. We took on 3 new clients.',
              metric: '22% more capacity'
            })])).map(stryMutAct_9fa48("64070") ? () => undefined : (stryCov_9fa48("64070"), (cs, idx) => <div key={idx} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
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
                {compliance.map(stryMutAct_9fa48("64071") ? () => undefined : (stryCov_9fa48("64071"), c => <span key={c} className="px-4 py-2 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/30 font-medium">{c}</span>))}
              </div>
            </section>
          </div>)}

        {stryMutAct_9fa48("64074") ? activeTab === 'agents' || <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Transportation & Logistics Agents</h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map(agent => <div key={agent.code} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-sky-500/20 rounded-full flex items-center justify-center"><span className="text-xl">🤖</span></div>
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
          </div> : stryMutAct_9fa48("64073") ? false : stryMutAct_9fa48("64072") ? true : (stryCov_9fa48("64072", "64073", "64074"), (stryMutAct_9fa48("64076") ? activeTab !== 'agents' : stryMutAct_9fa48("64075") ? true : (stryCov_9fa48("64075", "64076"), activeTab === 'agents')) && <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Transportation & Logistics Agents</h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map(stryMutAct_9fa48("64078") ? () => undefined : (stryCov_9fa48("64078"), agent => <div key={agent.code} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-sky-500/20 rounded-full flex items-center justify-center"><span className="text-xl">🤖</span></div>
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

        {stryMutAct_9fa48("64081") ? activeTab === 'pricing' || <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Transportation Pricing</h2>
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
                <button onClick={() => navigate('/demo')} className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Request Transport Demo</button>
                <button onClick={() => navigate('/contact')} className="px-8 py-3 border border-neutral-600 text-white rounded-lg font-medium hover:bg-neutral-800">Talk to Sales</button>
              </div>
            </section>
          </div> : stryMutAct_9fa48("64080") ? false : stryMutAct_9fa48("64079") ? true : (stryCov_9fa48("64079", "64080", "64081"), (stryMutAct_9fa48("64083") ? activeTab !== 'pricing' : stryMutAct_9fa48("64082") ? true : (stryCov_9fa48("64082", "64083"), activeTab === 'pricing')) && <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Transportation Pricing</h2>
              <div className="grid grid-cols-4 gap-6">
                {pricing.map(stryMutAct_9fa48("64085") ? () => undefined : (stryCov_9fa48("64085"), (pkg, idx) => <div key={pkg.package} className={`rounded-xl p-6 border ${(stryMutAct_9fa48("64089") ? idx !== 1 : stryMutAct_9fa48("64088") ? false : stryMutAct_9fa48("64087") ? true : (stryCov_9fa48("64087", "64088", "64089"), idx === 1)) ? 'bg-primary-900/20 border-primary-500' : 'bg-neutral-800 border-neutral-700'}`}>
                    {stryMutAct_9fa48("64094") ? idx === 1 || <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded mb-3 inline-block">Most Popular</span> : stryMutAct_9fa48("64093") ? false : stryMutAct_9fa48("64092") ? true : (stryCov_9fa48("64092", "64093", "64094"), (stryMutAct_9fa48("64096") ? idx !== 1 : stryMutAct_9fa48("64095") ? true : (stryCov_9fa48("64095", "64096"), idx === 1)) && <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded mb-3 inline-block">Most Popular</span>)}
                    <h3 className="font-semibold text-lg mb-2">{pkg.package}</h3>
                    <p className="text-2xl font-bold text-primary-400 mb-4">{pkg.price}</p>
                    <p className="text-neutral-400 mb-4">{pkg.includes}</p>
                    <p className="text-sm text-green-400">ROI: {pkg.roi}</p>
                  </div>))}
              </div>
            </section>
            <section className="text-center">
              <div className="flex justify-center gap-4">
                <button onClick={stryMutAct_9fa48("64097") ? () => undefined : (stryCov_9fa48("64097"), () => navigate('/demo'))} className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Request Transport Demo</button>
                <button onClick={stryMutAct_9fa48("64099") ? () => undefined : (stryCov_9fa48("64099"), () => navigate('/contact'))} className="px-8 py-3 border border-neutral-600 text-white rounded-lg font-medium hover:bg-neutral-800">Talk to Sales</button>
              </div>
            </section>
          </div>)}
      </div>
    </div>;
};
export default TransportationLogisticsPage;