// @ts-nocheck
// =============================================================================
// DATACENDIA RETAIL & HOSPITALITY VERTICAL
// Pricing optimization and revenue management intelligence
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
const agents = stryMutAct_9fa48("63335") ? [] : (stryCov_9fa48("63335"), [stryMutAct_9fa48("63336") ? {} : (stryCov_9fa48("63336"), {
  code: 'merchandising',
  name: 'Merchandising Director',
  purpose: 'Assortment planning, inventory optimization, category management',
  model: 'llama3.3:70b'
}), stryMutAct_9fa48("63341") ? {} : (stryCov_9fa48("63341"), {
  code: 'revenue-mgr',
  name: 'Revenue Manager',
  purpose: 'Dynamic pricing, demand forecasting, yield optimization',
  model: 'qwq:32b'
}), stryMutAct_9fa48("63346") ? {} : (stryCov_9fa48("63346"), {
  code: 'store-ops',
  name: 'Store Operations',
  purpose: 'Staffing optimization, store performance, operational efficiency',
  model: 'qwq:32b'
}), stryMutAct_9fa48("63351") ? {} : (stryCov_9fa48("63351"), {
  code: 'cx',
  name: 'Customer Experience',
  purpose: 'Journey optimization, loyalty strategy, personalization',
  model: 'llama3.3:70b'
})]);
const compliance = stryMutAct_9fa48("63356") ? [] : (stryCov_9fa48("63356"), ['PCI-DSS', 'GDPR', 'CCPA', 'ADA', 'Labor Laws', 'Food Safety', 'Consumer Protection']);
const pricing = stryMutAct_9fa48("63364") ? [] : (stryCov_9fa48("63364"), [stryMutAct_9fa48("63365") ? {} : (stryCov_9fa48("63365"), {
  package: 'Retail Starter',
  price: '$60,000',
  includes: '8 Pillars + 4 Retail Agents',
  roi: '8 months'
}), stryMutAct_9fa48("63370") ? {} : (stryCov_9fa48("63370"), {
  package: 'Retail Professional',
  price: '$400,000',
  includes: '+ Panopticon, Predict, Mesh',
  roi: '5 months'
}), stryMutAct_9fa48("63375") ? {} : (stryCov_9fa48("63375"), {
  package: 'Retail Enterprise',
  price: '$2,500,000',
  includes: '+ Full Guardian Suite',
  roi: '3 months'
}), stryMutAct_9fa48("63380") ? {} : (stryCov_9fa48("63380"), {
  package: 'Retail Sovereign',
  price: '$6,000,000+',
  includes: '+ Multi-brand, custom',
  roi: '2 months'
})]);
export const RetailHospitalityPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'pricing'>('overview');
  return <div className="min-h-screen bg-neutral-900 text-white">
      <div className="relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-900/20 via-neutral-900 to-neutral-900"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <button onClick={stryMutAct_9fa48("63387") ? () => undefined : (stryCov_9fa48("63387"), () => navigate('/verticals'))} className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6">← Back to Verticals</button>
          
          <div className="flex items-start gap-6">
            <span className="text-6xl">🛒</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">📈 Growth Vertical</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">🔒 85% Sovereignty</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Retail & Hospitality</h1>
              <p className="text-xl text-neutral-300 max-w-3xl">
                Pricing optimization and revenue management intelligence. 
                Real-time demand sensing and dynamic pricing with full audit trail.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">Pilot Result</p>
              <p className="text-3xl font-bold text-green-400">19%</p>
              <p className="text-neutral-300">margin improvement</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 mt-12">
            {(stryMutAct_9fa48("63389") ? [] : (stryCov_9fa48("63389"), [stryMutAct_9fa48("63390") ? {} : (stryCov_9fa48("63390"), {
            label: '18-Month ROI',
            value: '19%',
            subtext: 'margin improvement'
          }), stryMutAct_9fa48("63394") ? {} : (stryCov_9fa48("63394"), {
            label: 'Pricing Velocity',
            value: '10x',
            subtext: 'faster updates'
          }), stryMutAct_9fa48("63398") ? {} : (stryCov_9fa48("63398"), {
            label: 'RevPAR Lift',
            value: '12%',
            subtext: 'hospitality avg'
          }), stryMutAct_9fa48("63402") ? {} : (stryCov_9fa48("63402"), {
            label: 'Markdown Waste',
            value: '-25%',
            subtext: 'reduction'
          })])).map(stryMutAct_9fa48("63406") ? () => undefined : (stryCov_9fa48("63406"), stat => <div key={stat.label} className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700">
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
            {(stryMutAct_9fa48("63407") ? [] : (stryCov_9fa48("63407"), ['overview', 'agents', 'pricing'])).map(stryMutAct_9fa48("63411") ? () => undefined : (stryCov_9fa48("63411"), tab => <button key={tab} onClick={stryMutAct_9fa48("63412") ? () => undefined : (stryCov_9fa48("63412"), () => setActiveTab(tab as typeof activeTab))} className={`px-6 py-4 font-medium capitalize transition-all border-b-2 ${(stryMutAct_9fa48("63416") ? activeTab !== tab : stryMutAct_9fa48("63415") ? false : stryMutAct_9fa48("63414") ? true : (stryCov_9fa48("63414", "63415", "63416"), activeTab === tab)) ? 'border-primary-500 text-white' : 'border-transparent text-neutral-400 hover:text-white'}`}>
                {(stryMutAct_9fa48("63421") ? tab !== 'agents' : stryMutAct_9fa48("63420") ? false : stryMutAct_9fa48("63419") ? true : (stryCov_9fa48("63419", "63420", "63421"), tab === 'agents')) ? 'Agents & Overlays' : tab}
              </button>))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {stryMutAct_9fa48("63426") ? activeTab === 'overview' || <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Retail</h2>
              <div className="grid grid-cols-3 gap-6">
                {[{
              title: 'Dynamic Pricing',
              desc: 'AI-powered pricing decisions that respond to demand signals in real-time with full audit trail',
              icon: '💰'
            }, {
              title: 'Demand Sensing',
              desc: 'Predict demand shifts before they happen with multi-signal analysis',
              icon: '📊'
            }, {
              title: 'Markdown Optimization',
              desc: 'Reduce markdown waste by 25% with AI-optimized clearance strategies',
              icon: '🏷️'
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
              org: 'Regional Retailer (200 stores)',
              quote: 'Gross margin improved 19% with dynamic pricing. The Council identified pricing opportunities we were leaving on the table.',
              metric: '19% margin'
            }, {
              org: 'Hotel Chain (50 properties)',
              quote: 'RevPAR increased 12% with AI-optimized rate management. We can now adjust pricing 10x faster than competitors.',
              metric: '12% RevPAR'
            }, {
              org: 'Quick Service Restaurant',
              quote: 'Menu pricing decisions backed by data instead of gut feel. Reduced customer complaints about price increases by 40%.',
              metric: '40% fewer complaints'
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
                {compliance.map(c => <span key={c} className="px-4 py-2 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/30 font-medium">{c}</span>)}
              </div>
            </section>
          </div> : stryMutAct_9fa48("63425") ? false : stryMutAct_9fa48("63424") ? true : (stryCov_9fa48("63424", "63425", "63426"), (stryMutAct_9fa48("63428") ? activeTab !== 'overview' : stryMutAct_9fa48("63427") ? true : (stryCov_9fa48("63427", "63428"), activeTab === 'overview')) && <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Retail</h2>
              <div className="grid grid-cols-3 gap-6">
                {(stryMutAct_9fa48("63430") ? [] : (stryCov_9fa48("63430"), [stryMutAct_9fa48("63431") ? {} : (stryCov_9fa48("63431"), {
              title: 'Dynamic Pricing',
              desc: 'AI-powered pricing decisions that respond to demand signals in real-time with full audit trail',
              icon: '💰'
            }), stryMutAct_9fa48("63435") ? {} : (stryCov_9fa48("63435"), {
              title: 'Demand Sensing',
              desc: 'Predict demand shifts before they happen with multi-signal analysis',
              icon: '📊'
            }), stryMutAct_9fa48("63439") ? {} : (stryCov_9fa48("63439"), {
              title: 'Markdown Optimization',
              desc: 'Reduce markdown waste by 25% with AI-optimized clearance strategies',
              icon: '🏷️'
            })])).map(stryMutAct_9fa48("63443") ? () => undefined : (stryCov_9fa48("63443"), item => <div key={item.title} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <span className="text-3xl">{item.icon}</span>
                    <h3 className="text-lg font-semibold mt-4 mb-2">{item.title}</h3>
                    <p className="text-neutral-400">{item.desc}</p>
                  </div>))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Customer Results</h2>
              <div className="space-y-4">
                {(stryMutAct_9fa48("63444") ? [] : (stryCov_9fa48("63444"), [stryMutAct_9fa48("63445") ? {} : (stryCov_9fa48("63445"), {
              org: 'Regional Retailer (200 stores)',
              quote: 'Gross margin improved 19% with dynamic pricing. The Council identified pricing opportunities we were leaving on the table.',
              metric: '19% margin'
            }), stryMutAct_9fa48("63449") ? {} : (stryCov_9fa48("63449"), {
              org: 'Hotel Chain (50 properties)',
              quote: 'RevPAR increased 12% with AI-optimized rate management. We can now adjust pricing 10x faster than competitors.',
              metric: '12% RevPAR'
            }), stryMutAct_9fa48("63453") ? {} : (stryCov_9fa48("63453"), {
              org: 'Quick Service Restaurant',
              quote: 'Menu pricing decisions backed by data instead of gut feel. Reduced customer complaints about price increases by 40%.',
              metric: '40% fewer complaints'
            })])).map(stryMutAct_9fa48("63457") ? () => undefined : (stryCov_9fa48("63457"), (cs, idx) => <div key={idx} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
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
                {compliance.map(stryMutAct_9fa48("63458") ? () => undefined : (stryCov_9fa48("63458"), c => <span key={c} className="px-4 py-2 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/30 font-medium">{c}</span>))}
              </div>
            </section>
          </div>)}

        {stryMutAct_9fa48("63461") ? activeTab === 'agents' || <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Retail & Hospitality Agents</h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map(agent => <div key={agent.code} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-rose-500/20 rounded-full flex items-center justify-center"><span className="text-xl">🤖</span></div>
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
          </div> : stryMutAct_9fa48("63460") ? false : stryMutAct_9fa48("63459") ? true : (stryCov_9fa48("63459", "63460", "63461"), (stryMutAct_9fa48("63463") ? activeTab !== 'agents' : stryMutAct_9fa48("63462") ? true : (stryCov_9fa48("63462", "63463"), activeTab === 'agents')) && <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Retail & Hospitality Agents</h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map(stryMutAct_9fa48("63465") ? () => undefined : (stryCov_9fa48("63465"), agent => <div key={agent.code} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-rose-500/20 rounded-full flex items-center justify-center"><span className="text-xl">🤖</span></div>
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

        {stryMutAct_9fa48("63468") ? activeTab === 'pricing' || <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Retail Pricing</h2>
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
                <button onClick={() => navigate('/demo')} className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Request Retail Demo</button>
                <button onClick={() => navigate('/contact')} className="px-8 py-3 border border-neutral-600 text-white rounded-lg font-medium hover:bg-neutral-800">Talk to Sales</button>
              </div>
            </section>
          </div> : stryMutAct_9fa48("63467") ? false : stryMutAct_9fa48("63466") ? true : (stryCov_9fa48("63466", "63467", "63468"), (stryMutAct_9fa48("63470") ? activeTab !== 'pricing' : stryMutAct_9fa48("63469") ? true : (stryCov_9fa48("63469", "63470"), activeTab === 'pricing')) && <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Retail Pricing</h2>
              <div className="grid grid-cols-4 gap-6">
                {pricing.map(stryMutAct_9fa48("63472") ? () => undefined : (stryCov_9fa48("63472"), (pkg, idx) => <div key={pkg.package} className={`rounded-xl p-6 border ${(stryMutAct_9fa48("63476") ? idx !== 1 : stryMutAct_9fa48("63475") ? false : stryMutAct_9fa48("63474") ? true : (stryCov_9fa48("63474", "63475", "63476"), idx === 1)) ? 'bg-primary-900/20 border-primary-500' : 'bg-neutral-800 border-neutral-700'}`}>
                    {stryMutAct_9fa48("63481") ? idx === 1 || <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded mb-3 inline-block">Most Popular</span> : stryMutAct_9fa48("63480") ? false : stryMutAct_9fa48("63479") ? true : (stryCov_9fa48("63479", "63480", "63481"), (stryMutAct_9fa48("63483") ? idx !== 1 : stryMutAct_9fa48("63482") ? true : (stryCov_9fa48("63482", "63483"), idx === 1)) && <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded mb-3 inline-block">Most Popular</span>)}
                    <h3 className="font-semibold text-lg mb-2">{pkg.package}</h3>
                    <p className="text-2xl font-bold text-primary-400 mb-4">{pkg.price}</p>
                    <p className="text-neutral-400 mb-4">{pkg.includes}</p>
                    <p className="text-sm text-green-400">ROI: {pkg.roi}</p>
                  </div>))}
              </div>
            </section>
            <section className="text-center">
              <div className="flex justify-center gap-4">
                <button onClick={stryMutAct_9fa48("63484") ? () => undefined : (stryCov_9fa48("63484"), () => navigate('/demo'))} className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Request Retail Demo</button>
                <button onClick={stryMutAct_9fa48("63486") ? () => undefined : (stryCov_9fa48("63486"), () => navigate('/contact'))} className="px-8 py-3 border border-neutral-600 text-white rounded-lg font-medium hover:bg-neutral-800">Talk to Sales</button>
              </div>
            </section>
          </div>)}
      </div>
    </div>;
};
export default RetailHospitalityPage;