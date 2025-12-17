// @ts-nocheck
// =============================================================================
// DATACENDIA PHARMACEUTICAL VERTICAL
// Pipeline decisions and regulatory acceleration for life sciences
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
const agents = stryMutAct_9fa48("62875") ? [] : (stryCov_9fa48("62875"), [stryMutAct_9fa48("62876") ? {} : (stryCov_9fa48("62876"), {
  code: 'cso',
  name: 'Chief Scientific Officer',
  purpose: 'R&D strategy, pipeline prioritization, scientific advisory',
  model: 'llama3.3:70b'
}), stryMutAct_9fa48("62881") ? {} : (stryCov_9fa48("62881"), {
  code: 'regulatory',
  name: 'Regulatory Affairs',
  purpose: 'FDA submissions, global filing strategy, compliance tracking',
  model: 'qwq:32b'
}), stryMutAct_9fa48("62886") ? {} : (stryCov_9fa48("62886"), {
  code: 'clinical-ops',
  name: 'Clinical Operations',
  purpose: 'Trial design, site selection, enrollment optimization',
  model: 'qwq:32b'
}), stryMutAct_9fa48("62891") ? {} : (stryCov_9fa48("62891"), {
  code: 'medical-affairs',
  name: 'Medical Affairs',
  purpose: 'KOL engagement, medical education, publication strategy',
  model: 'llama3.3:70b'
})]);
const compliance = stryMutAct_9fa48("62896") ? [] : (stryCov_9fa48("62896"), ['21 CFR Part 11', 'FDA AI Guidance', 'GxP', 'ICH Guidelines', 'EMA Requirements', 'HIPAA', 'Clinical Trial Regulations', 'Pharmacovigilance']);
const pricing = stryMutAct_9fa48("62905") ? [] : (stryCov_9fa48("62905"), [stryMutAct_9fa48("62906") ? {} : (stryCov_9fa48("62906"), {
  package: 'Pharma Starter',
  price: '$150,000',
  includes: '8 Pillars + 4 Pharma Agents',
  roi: '8 months'
}), stryMutAct_9fa48("62911") ? {} : (stryCov_9fa48("62911"), {
  package: 'Pharma Professional',
  price: '$1,500,000',
  includes: '+ Panopticon, Crucible, Eternal',
  roi: '5 months'
}), stryMutAct_9fa48("62916") ? {} : (stryCov_9fa48("62916"), {
  package: 'Pharma Enterprise',
  price: '$6,000,000',
  includes: '+ Full Guardian Suite',
  roi: '3 months'
}), stryMutAct_9fa48("62921") ? {} : (stryCov_9fa48("62921"), {
  package: 'Pharma Sovereign',
  price: '$15,000,000+',
  includes: '+ Global, air-gapped, custom',
  roi: '2 months'
})]);
export const PharmaceuticalPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'pricing'>('overview');
  return <div className="min-h-screen bg-neutral-900 text-white">
      <div className="relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/20 via-neutral-900 to-neutral-900"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <button onClick={stryMutAct_9fa48("62928") ? () => undefined : (stryCov_9fa48("62928"), () => navigate('/verticals'))} className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6">← Back to Verticals</button>
          
          <div className="flex items-start gap-6">
            <span className="text-6xl">💊</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium">⭐ Wave 1 Priority</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">🔒 95% Sovereignty</span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">12% Market Share</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Pharmaceutical / Biotech</h1>
              <p className="text-xl text-neutral-300 max-w-3xl">
                Pipeline decisions and regulatory acceleration for life sciences. 
                21 CFR Part 11 compliant with full audit trail for FDA submissions.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">Pilot Result</p>
              <p className="text-3xl font-bold text-green-400">31%</p>
              <p className="text-neutral-300">faster Phase II decisions</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 mt-12">
            {(stryMutAct_9fa48("62930") ? [] : (stryCov_9fa48("62930"), [stryMutAct_9fa48("62931") ? {} : (stryCov_9fa48("62931"), {
            label: '18-Month ROI',
            value: '31%',
            subtext: 'faster trials'
          }), stryMutAct_9fa48("62935") ? {} : (stryCov_9fa48("62935"), {
            label: 'Pipeline Decisions',
            value: '$4M+',
            subtext: 'per month at stake'
          }), stryMutAct_9fa48("62939") ? {} : (stryCov_9fa48("62939"), {
            label: 'Submission Prep',
            value: '40%',
            subtext: 'faster'
          }), stryMutAct_9fa48("62943") ? {} : (stryCov_9fa48("62943"), {
            label: 'Part 11 Compliant',
            value: '100%',
            subtext: 'audit-ready'
          })])).map(stryMutAct_9fa48("62947") ? () => undefined : (stryCov_9fa48("62947"), stat => <div key={stat.label} className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700">
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
            {(stryMutAct_9fa48("62948") ? [] : (stryCov_9fa48("62948"), ['overview', 'agents', 'pricing'])).map(stryMutAct_9fa48("62952") ? () => undefined : (stryCov_9fa48("62952"), tab => <button key={tab} onClick={stryMutAct_9fa48("62953") ? () => undefined : (stryCov_9fa48("62953"), () => setActiveTab(tab as typeof activeTab))} className={`px-6 py-4 font-medium capitalize transition-all border-b-2 ${(stryMutAct_9fa48("62957") ? activeTab !== tab : stryMutAct_9fa48("62956") ? false : stryMutAct_9fa48("62955") ? true : (stryCov_9fa48("62955", "62956", "62957"), activeTab === tab)) ? 'border-primary-500 text-white' : 'border-transparent text-neutral-400 hover:text-white'}`}>
                {(stryMutAct_9fa48("62962") ? tab !== 'agents' : stryMutAct_9fa48("62961") ? false : stryMutAct_9fa48("62960") ? true : (stryCov_9fa48("62960", "62961", "62962"), tab === 'agents')) ? 'Agents & Overlays' : tab}
              </button>))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {stryMutAct_9fa48("62967") ? activeTab === 'overview' || <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Pharma</h2>
              <div className="grid grid-cols-3 gap-6">
                {[{
              title: '21 CFR Part 11 Compliant',
              desc: 'Full electronic record and signature compliance with automated audit trail generation',
              icon: '📋'
            }, {
              title: 'FDA AI Guidance Ready',
              desc: 'Documentation and validation framework aligned with emerging FDA AI/ML guidance',
              icon: '🏛️'
            }, {
              title: 'Pipeline Intelligence',
              desc: 'AI-powered go/no-go decisions with Council deliberation on $4M+/month decisions',
              icon: '🧬'
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
              org: 'Mid-Size Biotech',
              quote: 'Phase II go/no-go decisions that took 6 weeks now happen in 4 weeks with complete documentation for investors.',
              metric: '31% faster'
            }, {
              org: 'Global Pharma Company',
              quote: 'Regulatory submission prep time cut by 40%. The Council identified 23 documentation gaps before FDA review.',
              metric: '40% faster prep'
            }, {
              org: 'CRO Partner',
              quote: 'Site selection decisions improved by analyzing 10x more data points than our previous process.',
              metric: '10x more data'
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
                {compliance.map(c => <span key={c} className="px-4 py-2 bg-pink-500/10 text-pink-400 rounded-lg border border-pink-500/30 font-medium">{c}</span>)}
              </div>
            </section>
          </div> : stryMutAct_9fa48("62966") ? false : stryMutAct_9fa48("62965") ? true : (stryCov_9fa48("62965", "62966", "62967"), (stryMutAct_9fa48("62969") ? activeTab !== 'overview' : stryMutAct_9fa48("62968") ? true : (stryCov_9fa48("62968", "62969"), activeTab === 'overview')) && <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Pharma</h2>
              <div className="grid grid-cols-3 gap-6">
                {(stryMutAct_9fa48("62971") ? [] : (stryCov_9fa48("62971"), [stryMutAct_9fa48("62972") ? {} : (stryCov_9fa48("62972"), {
              title: '21 CFR Part 11 Compliant',
              desc: 'Full electronic record and signature compliance with automated audit trail generation',
              icon: '📋'
            }), stryMutAct_9fa48("62976") ? {} : (stryCov_9fa48("62976"), {
              title: 'FDA AI Guidance Ready',
              desc: 'Documentation and validation framework aligned with emerging FDA AI/ML guidance',
              icon: '🏛️'
            }), stryMutAct_9fa48("62980") ? {} : (stryCov_9fa48("62980"), {
              title: 'Pipeline Intelligence',
              desc: 'AI-powered go/no-go decisions with Council deliberation on $4M+/month decisions',
              icon: '🧬'
            })])).map(stryMutAct_9fa48("62984") ? () => undefined : (stryCov_9fa48("62984"), item => <div key={item.title} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <span className="text-3xl">{item.icon}</span>
                    <h3 className="text-lg font-semibold mt-4 mb-2">{item.title}</h3>
                    <p className="text-neutral-400">{item.desc}</p>
                  </div>))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Customer Results</h2>
              <div className="space-y-4">
                {(stryMutAct_9fa48("62985") ? [] : (stryCov_9fa48("62985"), [stryMutAct_9fa48("62986") ? {} : (stryCov_9fa48("62986"), {
              org: 'Mid-Size Biotech',
              quote: 'Phase II go/no-go decisions that took 6 weeks now happen in 4 weeks with complete documentation for investors.',
              metric: '31% faster'
            }), stryMutAct_9fa48("62990") ? {} : (stryCov_9fa48("62990"), {
              org: 'Global Pharma Company',
              quote: 'Regulatory submission prep time cut by 40%. The Council identified 23 documentation gaps before FDA review.',
              metric: '40% faster prep'
            }), stryMutAct_9fa48("62994") ? {} : (stryCov_9fa48("62994"), {
              org: 'CRO Partner',
              quote: 'Site selection decisions improved by analyzing 10x more data points than our previous process.',
              metric: '10x more data'
            })])).map(stryMutAct_9fa48("62998") ? () => undefined : (stryCov_9fa48("62998"), (cs, idx) => <div key={idx} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
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
                {compliance.map(stryMutAct_9fa48("62999") ? () => undefined : (stryCov_9fa48("62999"), c => <span key={c} className="px-4 py-2 bg-pink-500/10 text-pink-400 rounded-lg border border-pink-500/30 font-medium">{c}</span>))}
              </div>
            </section>
          </div>)}

        {stryMutAct_9fa48("63002") ? activeTab === 'agents' || <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Pharmaceutical Agents</h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map(agent => <div key={agent.code} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center"><span className="text-xl">🤖</span></div>
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
          </div> : stryMutAct_9fa48("63001") ? false : stryMutAct_9fa48("63000") ? true : (stryCov_9fa48("63000", "63001", "63002"), (stryMutAct_9fa48("63004") ? activeTab !== 'agents' : stryMutAct_9fa48("63003") ? true : (stryCov_9fa48("63003", "63004"), activeTab === 'agents')) && <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Pharmaceutical Agents</h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map(stryMutAct_9fa48("63006") ? () => undefined : (stryCov_9fa48("63006"), agent => <div key={agent.code} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center"><span className="text-xl">🤖</span></div>
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

        {stryMutAct_9fa48("63009") ? activeTab === 'pricing' || <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Pharmaceutical Pricing</h2>
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
                <button onClick={() => navigate('/demo')} className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Request Pharma Demo</button>
                <button onClick={() => navigate('/contact')} className="px-8 py-3 border border-neutral-600 text-white rounded-lg font-medium hover:bg-neutral-800">Talk to Sales</button>
              </div>
            </section>
          </div> : stryMutAct_9fa48("63008") ? false : stryMutAct_9fa48("63007") ? true : (stryCov_9fa48("63007", "63008", "63009"), (stryMutAct_9fa48("63011") ? activeTab !== 'pricing' : stryMutAct_9fa48("63010") ? true : (stryCov_9fa48("63010", "63011"), activeTab === 'pricing')) && <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Pharmaceutical Pricing</h2>
              <div className="grid grid-cols-4 gap-6">
                {pricing.map(stryMutAct_9fa48("63013") ? () => undefined : (stryCov_9fa48("63013"), (pkg, idx) => <div key={pkg.package} className={`rounded-xl p-6 border ${(stryMutAct_9fa48("63017") ? idx !== 2 : stryMutAct_9fa48("63016") ? false : stryMutAct_9fa48("63015") ? true : (stryCov_9fa48("63015", "63016", "63017"), idx === 2)) ? 'bg-primary-900/20 border-primary-500' : 'bg-neutral-800 border-neutral-700'}`}>
                    {stryMutAct_9fa48("63022") ? idx === 2 || <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded mb-3 inline-block">Most Popular</span> : stryMutAct_9fa48("63021") ? false : stryMutAct_9fa48("63020") ? true : (stryCov_9fa48("63020", "63021", "63022"), (stryMutAct_9fa48("63024") ? idx !== 2 : stryMutAct_9fa48("63023") ? true : (stryCov_9fa48("63023", "63024"), idx === 2)) && <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded mb-3 inline-block">Most Popular</span>)}
                    <h3 className="font-semibold text-lg mb-2">{pkg.package}</h3>
                    <p className="text-2xl font-bold text-primary-400 mb-4">{pkg.price}</p>
                    <p className="text-neutral-400 mb-4">{pkg.includes}</p>
                    <p className="text-sm text-green-400">ROI: {pkg.roi}</p>
                  </div>))}
              </div>
            </section>
            <section className="text-center">
              <div className="flex justify-center gap-4">
                <button onClick={stryMutAct_9fa48("63025") ? () => undefined : (stryCov_9fa48("63025"), () => navigate('/demo'))} className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Request Pharma Demo</button>
                <button onClick={stryMutAct_9fa48("63027") ? () => undefined : (stryCov_9fa48("63027"), () => navigate('/contact'))} className="px-8 py-3 border border-neutral-600 text-white rounded-lg font-medium hover:bg-neutral-800">Talk to Sales</button>
              </div>
            </section>
          </div>)}
      </div>
    </div>;
};
export default PharmaceuticalPage;