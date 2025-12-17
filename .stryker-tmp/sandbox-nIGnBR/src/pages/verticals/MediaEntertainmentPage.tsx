// @ts-nocheck
// =============================================================================
// DATACENDIA MEDIA / ENTERTAINMENT VERTICAL
// Content strategy, audience intelligence, and rights management
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
const agents = stryMutAct_9fa48("62722") ? [] : (stryCov_9fa48("62722"), [stryMutAct_9fa48("62723") ? {} : (stryCov_9fa48("62723"), {
  code: 'content',
  name: 'Content Strategist',
  purpose: 'Programming decisions, content acquisition, greenlight analysis',
  model: 'llama3.3:70b'
}), stryMutAct_9fa48("62728") ? {} : (stryCov_9fa48("62728"), {
  code: 'audience',
  name: 'Audience Analyst',
  purpose: 'Viewership prediction, engagement optimization, demographic insights',
  model: 'qwq:32b'
}), stryMutAct_9fa48("62733") ? {} : (stryCov_9fa48("62733"), {
  code: 'rights',
  name: 'Rights Manager',
  purpose: 'Licensing deals, IP valuation, distribution strategy',
  model: 'qwq:32b'
}), stryMutAct_9fa48("62738") ? {} : (stryCov_9fa48("62738"), {
  code: 'ad-ops',
  name: 'Ad Operations',
  purpose: 'Inventory optimization, yield management, programmatic strategy',
  model: 'llama3.3:70b'
})]);
const compliance = stryMutAct_9fa48("62743") ? [] : (stryCov_9fa48("62743"), ['FCC Regulations', 'COPPA', 'Advertising Standards', 'Content Ratings', 'Music Licensing', 'SAG-AFTRA', 'International Distribution']);
const pricing = stryMutAct_9fa48("62751") ? [] : (stryCov_9fa48("62751"), [stryMutAct_9fa48("62752") ? {} : (stryCov_9fa48("62752"), {
  package: 'Media Starter',
  price: '$70,000',
  includes: '8 Pillars + 4 Media Agents',
  roi: '6 months'
}), stryMutAct_9fa48("62757") ? {} : (stryCov_9fa48("62757"), {
  package: 'Media Professional',
  price: '$600,000',
  includes: '+ Predict, Crucible, Eternal',
  roi: '4 months'
}), stryMutAct_9fa48("62762") ? {} : (stryCov_9fa48("62762"), {
  package: 'Media Enterprise',
  price: '$3,000,000',
  includes: '+ Full Guardian Suite',
  roi: '3 months'
}), stryMutAct_9fa48("62767") ? {} : (stryCov_9fa48("62767"), {
  package: 'Media Sovereign',
  price: '$8,000,000+',
  includes: '+ Studio-scale, custom',
  roi: '2 months'
})]);
export const MediaEntertainmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'pricing'>('overview');
  return <div className="min-h-screen bg-neutral-900 text-white">
      <div className="relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-900/20 via-neutral-900 to-neutral-900"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <button onClick={stryMutAct_9fa48("62774") ? () => undefined : (stryCov_9fa48("62774"), () => navigate('/verticals'))} className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6">← Back to Verticals</button>
          
          <div className="flex items-start gap-6">
            <span className="text-6xl">🎬</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">📈 Growth Vertical</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">🔒 80% Sovereignty</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Media / Entertainment</h1>
              <p className="text-xl text-neutral-300 max-w-3xl">
                Content strategy, audience intelligence, and rights management. 
                From greenlight decisions to distribution optimization to ad yield.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">Pilot Result</p>
              <p className="text-3xl font-bold text-green-400">35%</p>
              <p className="text-neutral-300">better content ROI</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 mt-12">
            {(stryMutAct_9fa48("62776") ? [] : (stryCov_9fa48("62776"), [stryMutAct_9fa48("62777") ? {} : (stryCov_9fa48("62777"), {
            label: '18-Month ROI',
            value: '29%',
            subtext: 'revenue lift'
          }), stryMutAct_9fa48("62781") ? {} : (stryCov_9fa48("62781"), {
            label: 'Content Decisions',
            value: '60%',
            subtext: 'faster greenlight'
          }), stryMutAct_9fa48("62785") ? {} : (stryCov_9fa48("62785"), {
            label: 'Ad Yield',
            value: '+24%',
            subtext: 'improvement'
          }), stryMutAct_9fa48("62789") ? {} : (stryCov_9fa48("62789"), {
            label: 'Audience Prediction',
            value: '78%',
            subtext: 'accuracy'
          })])).map(stryMutAct_9fa48("62793") ? () => undefined : (stryCov_9fa48("62793"), stat => <div key={stat.label} className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700">
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
            {(stryMutAct_9fa48("62794") ? [] : (stryCov_9fa48("62794"), ['overview', 'agents', 'pricing'])).map(stryMutAct_9fa48("62798") ? () => undefined : (stryCov_9fa48("62798"), tab => <button key={tab} onClick={stryMutAct_9fa48("62799") ? () => undefined : (stryCov_9fa48("62799"), () => setActiveTab(tab as typeof activeTab))} className={`px-6 py-4 font-medium capitalize transition-all border-b-2 ${(stryMutAct_9fa48("62803") ? activeTab !== tab : stryMutAct_9fa48("62802") ? false : stryMutAct_9fa48("62801") ? true : (stryCov_9fa48("62801", "62802", "62803"), activeTab === tab)) ? 'border-primary-500 text-white' : 'border-transparent text-neutral-400 hover:text-white'}`}>
                {(stryMutAct_9fa48("62808") ? tab !== 'agents' : stryMutAct_9fa48("62807") ? false : stryMutAct_9fa48("62806") ? true : (stryCov_9fa48("62806", "62807", "62808"), tab === 'agents')) ? 'Agents & Analytics' : tab}
              </button>))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {stryMutAct_9fa48("62813") ? activeTab === 'overview' || <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Media</h2>
              <div className="grid grid-cols-3 gap-6">
                {[{
              title: 'Greenlight Intelligence',
              desc: 'AI-powered content investment decisions with audience prediction, comp analysis, and risk modeling',
              icon: '🎯'
            }, {
              title: 'Audience Analytics',
              desc: 'Real-time viewership prediction, engagement optimization, and demographic insights across platforms',
              icon: '👥'
            }, {
              title: 'Rights Optimization',
              desc: 'IP valuation, licensing strategy, and distribution window optimization with full audit trail',
              icon: '📜'
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
              org: 'Streaming Platform',
              quote: 'Content ROI improved 35% by predicting audience response before greenlight. The Council identified 3 shows our team was wrong about.',
              metric: '35% better ROI'
            }, {
              org: 'Broadcast Network',
              quote: 'Ad yield optimization increased revenue 24% without adding inventory. AI found pricing opportunities we were leaving on the table.',
              metric: '24% ad yield'
            }, {
              org: 'Production Studio',
              quote: 'Greenlight decisions that took 6 weeks now happen in 6 days with complete market analysis and risk assessment.',
              metric: '6wk → 6d'
            }].map((cs, idx) => <div key={idx} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-neutral-300 text-lg italic">"{cs.quote}"</p>
                        <p className="text-neutral-500 mt-3">— {cs.org} (Anonymized)</p>
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
                {compliance.map(c => <span key={c} className="px-4 py-2 bg-fuchsia-500/10 text-fuchsia-400 rounded-lg border border-fuchsia-500/30 font-medium">{c}</span>)}
              </div>
            </section>
          </div> : stryMutAct_9fa48("62812") ? false : stryMutAct_9fa48("62811") ? true : (stryCov_9fa48("62811", "62812", "62813"), (stryMutAct_9fa48("62815") ? activeTab !== 'overview' : stryMutAct_9fa48("62814") ? true : (stryCov_9fa48("62814", "62815"), activeTab === 'overview')) && <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Media</h2>
              <div className="grid grid-cols-3 gap-6">
                {(stryMutAct_9fa48("62817") ? [] : (stryCov_9fa48("62817"), [stryMutAct_9fa48("62818") ? {} : (stryCov_9fa48("62818"), {
              title: 'Greenlight Intelligence',
              desc: 'AI-powered content investment decisions with audience prediction, comp analysis, and risk modeling',
              icon: '🎯'
            }), stryMutAct_9fa48("62822") ? {} : (stryCov_9fa48("62822"), {
              title: 'Audience Analytics',
              desc: 'Real-time viewership prediction, engagement optimization, and demographic insights across platforms',
              icon: '👥'
            }), stryMutAct_9fa48("62826") ? {} : (stryCov_9fa48("62826"), {
              title: 'Rights Optimization',
              desc: 'IP valuation, licensing strategy, and distribution window optimization with full audit trail',
              icon: '📜'
            })])).map(stryMutAct_9fa48("62830") ? () => undefined : (stryCov_9fa48("62830"), item => <div key={item.title} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <span className="text-3xl">{item.icon}</span>
                    <h3 className="text-lg font-semibold mt-4 mb-2">{item.title}</h3>
                    <p className="text-neutral-400">{item.desc}</p>
                  </div>))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Customer Results</h2>
              <div className="space-y-4">
                {(stryMutAct_9fa48("62831") ? [] : (stryCov_9fa48("62831"), [stryMutAct_9fa48("62832") ? {} : (stryCov_9fa48("62832"), {
              org: 'Streaming Platform',
              quote: 'Content ROI improved 35% by predicting audience response before greenlight. The Council identified 3 shows our team was wrong about.',
              metric: '35% better ROI'
            }), stryMutAct_9fa48("62836") ? {} : (stryCov_9fa48("62836"), {
              org: 'Broadcast Network',
              quote: 'Ad yield optimization increased revenue 24% without adding inventory. AI found pricing opportunities we were leaving on the table.',
              metric: '24% ad yield'
            }), stryMutAct_9fa48("62840") ? {} : (stryCov_9fa48("62840"), {
              org: 'Production Studio',
              quote: 'Greenlight decisions that took 6 weeks now happen in 6 days with complete market analysis and risk assessment.',
              metric: '6wk → 6d'
            })])).map(stryMutAct_9fa48("62844") ? () => undefined : (stryCov_9fa48("62844"), (cs, idx) => <div key={idx} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-neutral-300 text-lg italic">"{cs.quote}"</p>
                        <p className="text-neutral-500 mt-3">— {cs.org} (Anonymized)</p>
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
                {compliance.map(stryMutAct_9fa48("62845") ? () => undefined : (stryCov_9fa48("62845"), c => <span key={c} className="px-4 py-2 bg-fuchsia-500/10 text-fuchsia-400 rounded-lg border border-fuchsia-500/30 font-medium">{c}</span>))}
              </div>
            </section>
          </div>)}

        {stryMutAct_9fa48("62848") ? activeTab === 'agents' || <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Media & Entertainment Agents</h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map(agent => <div key={agent.code} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-fuchsia-500/20 rounded-full flex items-center justify-center"><span className="text-xl">🤖</span></div>
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
          </div> : stryMutAct_9fa48("62847") ? false : stryMutAct_9fa48("62846") ? true : (stryCov_9fa48("62846", "62847", "62848"), (stryMutAct_9fa48("62850") ? activeTab !== 'agents' : stryMutAct_9fa48("62849") ? true : (stryCov_9fa48("62849", "62850"), activeTab === 'agents')) && <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Media & Entertainment Agents</h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map(stryMutAct_9fa48("62852") ? () => undefined : (stryCov_9fa48("62852"), agent => <div key={agent.code} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-fuchsia-500/20 rounded-full flex items-center justify-center"><span className="text-xl">🤖</span></div>
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

        {stryMutAct_9fa48("62855") ? activeTab === 'pricing' || <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Media Pricing</h2>
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
                <button onClick={() => navigate('/demo')} className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Request Media Demo</button>
                <button onClick={() => navigate('/contact')} className="px-8 py-3 border border-neutral-600 text-white rounded-lg font-medium hover:bg-neutral-800">Talk to Sales</button>
              </div>
            </section>
          </div> : stryMutAct_9fa48("62854") ? false : stryMutAct_9fa48("62853") ? true : (stryCov_9fa48("62853", "62854", "62855"), (stryMutAct_9fa48("62857") ? activeTab !== 'pricing' : stryMutAct_9fa48("62856") ? true : (stryCov_9fa48("62856", "62857"), activeTab === 'pricing')) && <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Media Pricing</h2>
              <div className="grid grid-cols-4 gap-6">
                {pricing.map(stryMutAct_9fa48("62859") ? () => undefined : (stryCov_9fa48("62859"), (pkg, idx) => <div key={pkg.package} className={`rounded-xl p-6 border ${(stryMutAct_9fa48("62863") ? idx !== 1 : stryMutAct_9fa48("62862") ? false : stryMutAct_9fa48("62861") ? true : (stryCov_9fa48("62861", "62862", "62863"), idx === 1)) ? 'bg-primary-900/20 border-primary-500' : 'bg-neutral-800 border-neutral-700'}`}>
                    {stryMutAct_9fa48("62868") ? idx === 1 || <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded mb-3 inline-block">Most Popular</span> : stryMutAct_9fa48("62867") ? false : stryMutAct_9fa48("62866") ? true : (stryCov_9fa48("62866", "62867", "62868"), (stryMutAct_9fa48("62870") ? idx !== 1 : stryMutAct_9fa48("62869") ? true : (stryCov_9fa48("62869", "62870"), idx === 1)) && <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded mb-3 inline-block">Most Popular</span>)}
                    <h3 className="font-semibold text-lg mb-2">{pkg.package}</h3>
                    <p className="text-2xl font-bold text-primary-400 mb-4">{pkg.price}</p>
                    <p className="text-neutral-400 mb-4">{pkg.includes}</p>
                    <p className="text-sm text-green-400">ROI: {pkg.roi}</p>
                  </div>))}
              </div>
            </section>
            <section className="text-center">
              <div className="flex justify-center gap-4">
                <button onClick={stryMutAct_9fa48("62871") ? () => undefined : (stryCov_9fa48("62871"), () => navigate('/demo'))} className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Request Media Demo</button>
                <button onClick={stryMutAct_9fa48("62873") ? () => undefined : (stryCov_9fa48("62873"), () => navigate('/contact'))} className="px-8 py-3 border border-neutral-600 text-white rounded-lg font-medium hover:bg-neutral-800">Talk to Sales</button>
              </div>
            </section>
          </div>)}
      </div>
    </div>;
};
export default MediaEntertainmentPage;