// @ts-nocheck
// =============================================================================
// DATACENDIA TECHNOLOGY / SAAS VERTICAL
// Product decision velocity and AI governance for tech companies
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
const agents = stryMutAct_9fa48("63654") ? [] : (stryCov_9fa48("63654"), [stryMutAct_9fa48("63655") ? {} : (stryCov_9fa48("63655"), {
  code: 'product',
  name: 'Product Director',
  purpose: 'Roadmap prioritization, feature decisions, market analysis',
  model: 'llama3.3:70b'
}), stryMutAct_9fa48("63660") ? {} : (stryCov_9fa48("63660"), {
  code: 'engineering',
  name: 'Engineering Lead',
  purpose: 'Technical architecture, build vs buy, tech debt decisions',
  model: 'qwq:32b'
}), stryMutAct_9fa48("63665") ? {} : (stryCov_9fa48("63665"), {
  code: 'security-arch',
  name: 'Security Architect',
  purpose: 'Security design, threat modeling, compliance alignment',
  model: 'qwq:32b'
}), stryMutAct_9fa48("63670") ? {} : (stryCov_9fa48("63670"), {
  code: 'growth',
  name: 'Growth Strategist',
  purpose: 'GTM strategy, pricing decisions, expansion planning',
  model: 'llama3.3:70b'
})]);
const compliance = stryMutAct_9fa48("63675") ? [] : (stryCov_9fa48("63675"), ['SOC 2', 'ISO 27001', 'GDPR', 'CCPA', 'HIPAA BAA', 'FedRAMP', 'PCI-DSS']);
const pricing = stryMutAct_9fa48("63683") ? [] : (stryCov_9fa48("63683"), [stryMutAct_9fa48("63684") ? {} : (stryCov_9fa48("63684"), {
  package: 'Tech Starter',
  price: '$60,000',
  includes: '8 Pillars + 4 Tech Agents',
  roi: '6 months'
}), stryMutAct_9fa48("63689") ? {} : (stryCov_9fa48("63689"), {
  package: 'Tech Professional',
  price: '$400,000',
  includes: '+ Panopticon, Aegis, Genomics',
  roi: '4 months'
}), stryMutAct_9fa48("63694") ? {} : (stryCov_9fa48("63694"), {
  package: 'Tech Enterprise',
  price: '$2,000,000',
  includes: '+ Full Guardian Suite',
  roi: '3 months'
}), stryMutAct_9fa48("63699") ? {} : (stryCov_9fa48("63699"), {
  package: 'Tech Sovereign',
  price: '$5,000,000+',
  includes: '+ Self-hosted, custom',
  roi: '2 months'
})]);
export const TechnologyPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'pricing'>('overview');
  return <div className="min-h-screen bg-neutral-900 text-white">
      <div className="relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-neutral-900 to-neutral-900"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <button onClick={stryMutAct_9fa48("63706") ? () => undefined : (stryCov_9fa48("63706"), () => navigate('/verticals'))} className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6">← Back to Verticals</button>
          
          <div className="flex items-start gap-6">
            <span className="text-6xl">💻</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">📈 Growth Vertical</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">🔒 82% Sovereignty</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Technology / SaaS</h1>
              <p className="text-xl text-neutral-300 max-w-3xl">
                Product decision velocity and AI governance for tech companies. 
                Ship faster with defensible decisions and clear audit trails.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">Pilot Result</p>
              <p className="text-3xl font-bold text-green-400">41%</p>
              <p className="text-neutral-300">faster releases</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 mt-12">
            {(stryMutAct_9fa48("63708") ? [] : (stryCov_9fa48("63708"), [stryMutAct_9fa48("63709") ? {} : (stryCov_9fa48("63709"), {
            label: '18-Month ROI',
            value: '41%',
            subtext: 'faster releases'
          }), stryMutAct_9fa48("63713") ? {} : (stryCov_9fa48("63713"), {
            label: 'Decision Velocity',
            value: '3x',
            subtext: 'improvement'
          }), stryMutAct_9fa48("63717") ? {} : (stryCov_9fa48("63717"), {
            label: 'Tech Debt',
            value: '35%',
            subtext: 'reduction'
          }), stryMutAct_9fa48("63721") ? {} : (stryCov_9fa48("63721"), {
            label: 'Ship Confidence',
            value: '89%',
            subtext: 'team rating'
          })])).map(stryMutAct_9fa48("63725") ? () => undefined : (stryCov_9fa48("63725"), stat => <div key={stat.label} className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700">
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
            {(stryMutAct_9fa48("63726") ? [] : (stryCov_9fa48("63726"), ['overview', 'agents', 'pricing'])).map(stryMutAct_9fa48("63730") ? () => undefined : (stryCov_9fa48("63730"), tab => <button key={tab} onClick={stryMutAct_9fa48("63731") ? () => undefined : (stryCov_9fa48("63731"), () => setActiveTab(tab as typeof activeTab))} className={`px-6 py-4 font-medium capitalize transition-all border-b-2 ${(stryMutAct_9fa48("63735") ? activeTab !== tab : stryMutAct_9fa48("63734") ? false : stryMutAct_9fa48("63733") ? true : (stryCov_9fa48("63733", "63734", "63735"), activeTab === tab)) ? 'border-primary-500 text-white' : 'border-transparent text-neutral-400 hover:text-white'}`}>
                {(stryMutAct_9fa48("63740") ? tab !== 'agents' : stryMutAct_9fa48("63739") ? false : stryMutAct_9fa48("63738") ? true : (stryCov_9fa48("63738", "63739", "63740"), tab === 'agents')) ? 'Agents & Overlays' : tab}
              </button>))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {stryMutAct_9fa48("63745") ? activeTab === 'overview' || <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Tech</h2>
              <div className="grid grid-cols-3 gap-6">
                {[{
              title: 'Ship Faster',
              desc: 'AI-powered product decisions with full audit trail for board and investors',
              icon: '🚀'
            }, {
              title: 'AI Governance',
              desc: 'Document AI decisions before regulators ask. EU AI Act compliant from day one.',
              icon: '📋'
            }, {
              title: 'Build vs Buy Clarity',
              desc: 'Multi-agent deliberation on technical architecture decisions with cost modeling',
              icon: '⚖️'
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
              org: 'Series B SaaS ($20M ARR)',
              quote: 'Release velocity improved 41%. The Council helped us say no to 60% of feature requests with data-backed reasoning.',
              metric: '41% faster'
            }, {
              org: 'Enterprise Software Company',
              quote: 'Build vs buy decisions that paralyzed us for months now happen in days. Saved $2M on a wrong vendor choice we almost made.',
              metric: '$2M saved'
            }, {
              org: 'AI Startup',
              quote: 'Our AI governance documentation went from "we should do that" to "done" overnight. Critical for enterprise sales.',
              metric: 'Enterprise ready'
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
                {compliance.map(c => <span key={c} className="px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-lg border border-cyan-500/30 font-medium">{c}</span>)}
              </div>
            </section>
          </div> : stryMutAct_9fa48("63744") ? false : stryMutAct_9fa48("63743") ? true : (stryCov_9fa48("63743", "63744", "63745"), (stryMutAct_9fa48("63747") ? activeTab !== 'overview' : stryMutAct_9fa48("63746") ? true : (stryCov_9fa48("63746", "63747"), activeTab === 'overview')) && <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Tech</h2>
              <div className="grid grid-cols-3 gap-6">
                {(stryMutAct_9fa48("63749") ? [] : (stryCov_9fa48("63749"), [stryMutAct_9fa48("63750") ? {} : (stryCov_9fa48("63750"), {
              title: 'Ship Faster',
              desc: 'AI-powered product decisions with full audit trail for board and investors',
              icon: '🚀'
            }), stryMutAct_9fa48("63754") ? {} : (stryCov_9fa48("63754"), {
              title: 'AI Governance',
              desc: 'Document AI decisions before regulators ask. EU AI Act compliant from day one.',
              icon: '📋'
            }), stryMutAct_9fa48("63758") ? {} : (stryCov_9fa48("63758"), {
              title: 'Build vs Buy Clarity',
              desc: 'Multi-agent deliberation on technical architecture decisions with cost modeling',
              icon: '⚖️'
            })])).map(stryMutAct_9fa48("63762") ? () => undefined : (stryCov_9fa48("63762"), item => <div key={item.title} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <span className="text-3xl">{item.icon}</span>
                    <h3 className="text-lg font-semibold mt-4 mb-2">{item.title}</h3>
                    <p className="text-neutral-400">{item.desc}</p>
                  </div>))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Customer Results</h2>
              <div className="space-y-4">
                {(stryMutAct_9fa48("63763") ? [] : (stryCov_9fa48("63763"), [stryMutAct_9fa48("63764") ? {} : (stryCov_9fa48("63764"), {
              org: 'Series B SaaS ($20M ARR)',
              quote: 'Release velocity improved 41%. The Council helped us say no to 60% of feature requests with data-backed reasoning.',
              metric: '41% faster'
            }), stryMutAct_9fa48("63768") ? {} : (stryCov_9fa48("63768"), {
              org: 'Enterprise Software Company',
              quote: 'Build vs buy decisions that paralyzed us for months now happen in days. Saved $2M on a wrong vendor choice we almost made.',
              metric: '$2M saved'
            }), stryMutAct_9fa48("63772") ? {} : (stryCov_9fa48("63772"), {
              org: 'AI Startup',
              quote: 'Our AI governance documentation went from "we should do that" to "done" overnight. Critical for enterprise sales.',
              metric: 'Enterprise ready'
            })])).map(stryMutAct_9fa48("63776") ? () => undefined : (stryCov_9fa48("63776"), (cs, idx) => <div key={idx} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
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
                {compliance.map(stryMutAct_9fa48("63777") ? () => undefined : (stryCov_9fa48("63777"), c => <span key={c} className="px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-lg border border-cyan-500/30 font-medium">{c}</span>))}
              </div>
            </section>
          </div>)}

        {stryMutAct_9fa48("63780") ? activeTab === 'agents' || <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Technology Agents</h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map(agent => <div key={agent.code} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center"><span className="text-xl">🤖</span></div>
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
          </div> : stryMutAct_9fa48("63779") ? false : stryMutAct_9fa48("63778") ? true : (stryCov_9fa48("63778", "63779", "63780"), (stryMutAct_9fa48("63782") ? activeTab !== 'agents' : stryMutAct_9fa48("63781") ? true : (stryCov_9fa48("63781", "63782"), activeTab === 'agents')) && <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Technology Agents</h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map(stryMutAct_9fa48("63784") ? () => undefined : (stryCov_9fa48("63784"), agent => <div key={agent.code} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center"><span className="text-xl">🤖</span></div>
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

        {stryMutAct_9fa48("63787") ? activeTab === 'pricing' || <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Technology Pricing</h2>
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
                <button onClick={() => navigate('/demo')} className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Request Tech Demo</button>
                <button onClick={() => navigate('/contact')} className="px-8 py-3 border border-neutral-600 text-white rounded-lg font-medium hover:bg-neutral-800">Talk to Sales</button>
              </div>
            </section>
          </div> : stryMutAct_9fa48("63786") ? false : stryMutAct_9fa48("63785") ? true : (stryCov_9fa48("63785", "63786", "63787"), (stryMutAct_9fa48("63789") ? activeTab !== 'pricing' : stryMutAct_9fa48("63788") ? true : (stryCov_9fa48("63788", "63789"), activeTab === 'pricing')) && <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Technology Pricing</h2>
              <div className="grid grid-cols-4 gap-6">
                {pricing.map(stryMutAct_9fa48("63791") ? () => undefined : (stryCov_9fa48("63791"), (pkg, idx) => <div key={pkg.package} className={`rounded-xl p-6 border ${(stryMutAct_9fa48("63795") ? idx !== 1 : stryMutAct_9fa48("63794") ? false : stryMutAct_9fa48("63793") ? true : (stryCov_9fa48("63793", "63794", "63795"), idx === 1)) ? 'bg-primary-900/20 border-primary-500' : 'bg-neutral-800 border-neutral-700'}`}>
                    {stryMutAct_9fa48("63800") ? idx === 1 || <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded mb-3 inline-block">Most Popular</span> : stryMutAct_9fa48("63799") ? false : stryMutAct_9fa48("63798") ? true : (stryCov_9fa48("63798", "63799", "63800"), (stryMutAct_9fa48("63802") ? idx !== 1 : stryMutAct_9fa48("63801") ? true : (stryCov_9fa48("63801", "63802"), idx === 1)) && <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded mb-3 inline-block">Most Popular</span>)}
                    <h3 className="font-semibold text-lg mb-2">{pkg.package}</h3>
                    <p className="text-2xl font-bold text-primary-400 mb-4">{pkg.price}</p>
                    <p className="text-neutral-400 mb-4">{pkg.includes}</p>
                    <p className="text-sm text-green-400">ROI: {pkg.roi}</p>
                  </div>))}
              </div>
            </section>
            <section className="text-center">
              <div className="flex justify-center gap-4">
                <button onClick={stryMutAct_9fa48("63803") ? () => undefined : (stryCov_9fa48("63803"), () => navigate('/demo'))} className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Request Tech Demo</button>
                <button onClick={stryMutAct_9fa48("63805") ? () => undefined : (stryCov_9fa48("63805"), () => navigate('/contact'))} className="px-8 py-3 border border-neutral-600 text-white rounded-lg font-medium hover:bg-neutral-800">Talk to Sales</button>
              </div>
            </section>
          </div>)}
      </div>
    </div>;
};
export default TechnologyPage;