// @ts-nocheck
// =============================================================================
// DATACENDIA HIGHER EDUCATION VERTICAL
// Enrollment, research, and institutional intelligence
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
const agents = stryMutAct_9fa48("62261") ? [] : (stryCov_9fa48("62261"), [stryMutAct_9fa48("62262") ? {} : (stryCov_9fa48("62262"), {
  code: 'enrollment',
  name: 'Enrollment Director',
  purpose: 'Admissions strategy, yield optimization, scholarship allocation',
  model: 'qwq:32b'
}), stryMutAct_9fa48("62267") ? {} : (stryCov_9fa48("62267"), {
  code: 'provost',
  name: 'Academic Affairs',
  purpose: 'Curriculum decisions, faculty hiring, program assessment',
  model: 'llama3.3:70b'
}), stryMutAct_9fa48("62272") ? {} : (stryCov_9fa48("62272"), {
  code: 'research',
  name: 'Research Director',
  purpose: 'Grant strategy, research portfolio, partnership evaluation',
  model: 'qwq:32b'
}), stryMutAct_9fa48("62277") ? {} : (stryCov_9fa48("62277"), {
  code: 'finance-edu',
  name: 'CFO/Finance',
  purpose: 'Budget planning, endowment strategy, tuition modeling',
  model: 'llama3.3:70b'
})]);
const compliance = stryMutAct_9fa48("62282") ? [] : (stryCov_9fa48("62282"), ['FERPA', 'Title IX', 'ADA', 'Accreditation Standards', 'NCAA', 'Research Ethics (IRB)', 'Federal Financial Aid']);
const pricing = stryMutAct_9fa48("62290") ? [] : (stryCov_9fa48("62290"), [stryMutAct_9fa48("62291") ? {} : (stryCov_9fa48("62291"), {
  package: 'Education Starter',
  price: '$60,000',
  includes: '8 Pillars + 4 Education Agents',
  roi: '8 months'
}), stryMutAct_9fa48("62296") ? {} : (stryCov_9fa48("62296"), {
  package: 'Education Professional',
  price: '$400,000',
  includes: '+ Predict, Eternal, Panopticon',
  roi: '5 months'
}), stryMutAct_9fa48("62301") ? {} : (stryCov_9fa48("62301"), {
  package: 'Education Enterprise',
  price: '$2,000,000',
  includes: '+ Full Guardian Suite',
  roi: '3 months'
}), stryMutAct_9fa48("62306") ? {} : (stryCov_9fa48("62306"), {
  package: 'Education Sovereign',
  price: '$5,000,000+',
  includes: '+ University system, custom',
  roi: '2 months'
})]);
export const HigherEducationPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'pricing'>('overview');
  return <div className="min-h-screen bg-neutral-900 text-white">
      <div className="relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-neutral-900 to-neutral-900"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <button onClick={stryMutAct_9fa48("62313") ? () => undefined : (stryCov_9fa48("62313"), () => navigate('/verticals'))} className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6">← Back to Verticals</button>
          
          <div className="flex items-start gap-6">
            <span className="text-6xl">🎓</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">📈 Growth Vertical</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">🔒 95% Sovereignty</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Higher Education</h1>
              <p className="text-xl text-neutral-300 max-w-3xl">
                Enrollment optimization, research portfolio management, and institutional decision intelligence. 
                From admissions to endowment to academic planning.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">Pilot Result</p>
              <p className="text-3xl font-bold text-green-400">23%</p>
              <p className="text-neutral-300">yield improvement</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 mt-12">
            {(stryMutAct_9fa48("62315") ? [] : (stryCov_9fa48("62315"), [stryMutAct_9fa48("62316") ? {} : (stryCov_9fa48("62316"), {
            label: '18-Month ROI',
            value: '21%',
            subtext: 'efficiency gain'
          }), stryMutAct_9fa48("62320") ? {} : (stryCov_9fa48("62320"), {
            label: 'Enrollment Yield',
            value: '+23%',
            subtext: 'improvement'
          }), stryMutAct_9fa48("62324") ? {} : (stryCov_9fa48("62324"), {
            label: 'Grant Success',
            value: '+35%',
            subtext: 'win rate'
          }), stryMutAct_9fa48("62328") ? {} : (stryCov_9fa48("62328"), {
            label: 'Retention',
            value: '+8%',
            subtext: 'improvement'
          })])).map(stryMutAct_9fa48("62332") ? () => undefined : (stryCov_9fa48("62332"), stat => <div key={stat.label} className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700">
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
            {(stryMutAct_9fa48("62333") ? [] : (stryCov_9fa48("62333"), ['overview', 'agents', 'pricing'])).map(stryMutAct_9fa48("62337") ? () => undefined : (stryCov_9fa48("62337"), tab => <button key={tab} onClick={stryMutAct_9fa48("62338") ? () => undefined : (stryCov_9fa48("62338"), () => setActiveTab(tab as typeof activeTab))} className={`px-6 py-4 font-medium capitalize transition-all border-b-2 ${(stryMutAct_9fa48("62342") ? activeTab !== tab : stryMutAct_9fa48("62341") ? false : stryMutAct_9fa48("62340") ? true : (stryCov_9fa48("62340", "62341", "62342"), activeTab === tab)) ? 'border-primary-500 text-white' : 'border-transparent text-neutral-400 hover:text-white'}`}>
                {(stryMutAct_9fa48("62347") ? tab !== 'agents' : stryMutAct_9fa48("62346") ? false : stryMutAct_9fa48("62345") ? true : (stryCov_9fa48("62345", "62346", "62347"), tab === 'agents')) ? 'Agents & Analytics' : tab}
              </button>))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {stryMutAct_9fa48("62352") ? activeTab === 'overview' || <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Higher Education</h2>
              <div className="grid grid-cols-3 gap-6">
                {[{
              title: 'Enrollment Intelligence',
              desc: 'AI-powered yield optimization, scholarship allocation, and applicant scoring with full FERPA compliance',
              icon: '📊'
            }, {
              title: 'Research Portfolio',
              desc: 'Grant opportunity matching, collaboration recommendations, and research impact prediction',
              icon: '🔬'
            }, {
              title: 'Institutional Planning',
              desc: 'Program viability analysis, budget scenario modeling, and strategic resource allocation',
              icon: '🏛️'
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
              org: 'Regional University',
              quote: 'Enrollment yield improved 23% by optimizing scholarship offers and applicant communications. Net tuition revenue up $4.2M.',
              metric: '23% yield'
            }, {
              org: 'Research University',
              quote: 'Grant application success rate increased 35% by matching researchers to the right opportunities.',
              metric: '35% grant success'
            }, {
              org: 'Community College System',
              quote: 'Student retention improved 8% through early warning system that identified at-risk students 6 weeks earlier.',
              metric: '8% retention'
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
                {compliance.map(c => <span key={c} className="px-4 py-2 bg-violet-500/10 text-violet-400 rounded-lg border border-violet-500/30 font-medium">{c}</span>)}
              </div>
            </section>
          </div> : stryMutAct_9fa48("62351") ? false : stryMutAct_9fa48("62350") ? true : (stryCov_9fa48("62350", "62351", "62352"), (stryMutAct_9fa48("62354") ? activeTab !== 'overview' : stryMutAct_9fa48("62353") ? true : (stryCov_9fa48("62353", "62354"), activeTab === 'overview')) && <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Why Datacendia for Higher Education</h2>
              <div className="grid grid-cols-3 gap-6">
                {(stryMutAct_9fa48("62356") ? [] : (stryCov_9fa48("62356"), [stryMutAct_9fa48("62357") ? {} : (stryCov_9fa48("62357"), {
              title: 'Enrollment Intelligence',
              desc: 'AI-powered yield optimization, scholarship allocation, and applicant scoring with full FERPA compliance',
              icon: '📊'
            }), stryMutAct_9fa48("62361") ? {} : (stryCov_9fa48("62361"), {
              title: 'Research Portfolio',
              desc: 'Grant opportunity matching, collaboration recommendations, and research impact prediction',
              icon: '🔬'
            }), stryMutAct_9fa48("62365") ? {} : (stryCov_9fa48("62365"), {
              title: 'Institutional Planning',
              desc: 'Program viability analysis, budget scenario modeling, and strategic resource allocation',
              icon: '🏛️'
            })])).map(stryMutAct_9fa48("62369") ? () => undefined : (stryCov_9fa48("62369"), item => <div key={item.title} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <span className="text-3xl">{item.icon}</span>
                    <h3 className="text-lg font-semibold mt-4 mb-2">{item.title}</h3>
                    <p className="text-neutral-400">{item.desc}</p>
                  </div>))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Customer Results</h2>
              <div className="space-y-4">
                {(stryMutAct_9fa48("62370") ? [] : (stryCov_9fa48("62370"), [stryMutAct_9fa48("62371") ? {} : (stryCov_9fa48("62371"), {
              org: 'Regional University',
              quote: 'Enrollment yield improved 23% by optimizing scholarship offers and applicant communications. Net tuition revenue up $4.2M.',
              metric: '23% yield'
            }), stryMutAct_9fa48("62375") ? {} : (stryCov_9fa48("62375"), {
              org: 'Research University',
              quote: 'Grant application success rate increased 35% by matching researchers to the right opportunities.',
              metric: '35% grant success'
            }), stryMutAct_9fa48("62379") ? {} : (stryCov_9fa48("62379"), {
              org: 'Community College System',
              quote: 'Student retention improved 8% through early warning system that identified at-risk students 6 weeks earlier.',
              metric: '8% retention'
            })])).map(stryMutAct_9fa48("62383") ? () => undefined : (stryCov_9fa48("62383"), (cs, idx) => <div key={idx} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
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
                {compliance.map(stryMutAct_9fa48("62384") ? () => undefined : (stryCov_9fa48("62384"), c => <span key={c} className="px-4 py-2 bg-violet-500/10 text-violet-400 rounded-lg border border-violet-500/30 font-medium">{c}</span>))}
              </div>
            </section>
          </div>)}

        {stryMutAct_9fa48("62387") ? activeTab === 'agents' || <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Higher Education Agents</h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map(agent => <div key={agent.code} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-violet-500/20 rounded-full flex items-center justify-center"><span className="text-xl">🤖</span></div>
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
          </div> : stryMutAct_9fa48("62386") ? false : stryMutAct_9fa48("62385") ? true : (stryCov_9fa48("62385", "62386", "62387"), (stryMutAct_9fa48("62389") ? activeTab !== 'agents' : stryMutAct_9fa48("62388") ? true : (stryCov_9fa48("62388", "62389"), activeTab === 'agents')) && <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Higher Education Agents</h2>
              <div className="grid grid-cols-2 gap-6">
                {agents.map(stryMutAct_9fa48("62391") ? () => undefined : (stryCov_9fa48("62391"), agent => <div key={agent.code} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-violet-500/20 rounded-full flex items-center justify-center"><span className="text-xl">🤖</span></div>
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

        {stryMutAct_9fa48("62394") ? activeTab === 'pricing' || <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Higher Education Pricing</h2>
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
                <button onClick={() => navigate('/demo')} className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Request Education Demo</button>
                <button onClick={() => navigate('/contact')} className="px-8 py-3 border border-neutral-600 text-white rounded-lg font-medium hover:bg-neutral-800">Talk to Sales</button>
              </div>
            </section>
          </div> : stryMutAct_9fa48("62393") ? false : stryMutAct_9fa48("62392") ? true : (stryCov_9fa48("62392", "62393", "62394"), (stryMutAct_9fa48("62396") ? activeTab !== 'pricing' : stryMutAct_9fa48("62395") ? true : (stryCov_9fa48("62395", "62396"), activeTab === 'pricing')) && <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Higher Education Pricing</h2>
              <div className="grid grid-cols-4 gap-6">
                {pricing.map(stryMutAct_9fa48("62398") ? () => undefined : (stryCov_9fa48("62398"), (pkg, idx) => <div key={pkg.package} className={`rounded-xl p-6 border ${(stryMutAct_9fa48("62402") ? idx !== 1 : stryMutAct_9fa48("62401") ? false : stryMutAct_9fa48("62400") ? true : (stryCov_9fa48("62400", "62401", "62402"), idx === 1)) ? 'bg-primary-900/20 border-primary-500' : 'bg-neutral-800 border-neutral-700'}`}>
                    {stryMutAct_9fa48("62407") ? idx === 1 || <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded mb-3 inline-block">Most Popular</span> : stryMutAct_9fa48("62406") ? false : stryMutAct_9fa48("62405") ? true : (stryCov_9fa48("62405", "62406", "62407"), (stryMutAct_9fa48("62409") ? idx !== 1 : stryMutAct_9fa48("62408") ? true : (stryCov_9fa48("62408", "62409"), idx === 1)) && <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded mb-3 inline-block">Most Popular</span>)}
                    <h3 className="font-semibold text-lg mb-2">{pkg.package}</h3>
                    <p className="text-2xl font-bold text-primary-400 mb-4">{pkg.price}</p>
                    <p className="text-neutral-400 mb-4">{pkg.includes}</p>
                    <p className="text-sm text-green-400">ROI: {pkg.roi}</p>
                  </div>))}
              </div>
            </section>
            <section className="text-center">
              <div className="flex justify-center gap-4">
                <button onClick={stryMutAct_9fa48("62410") ? () => undefined : (stryCov_9fa48("62410"), () => navigate('/demo'))} className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Request Education Demo</button>
                <button onClick={stryMutAct_9fa48("62412") ? () => undefined : (stryCov_9fa48("62412"), () => navigate('/contact'))} className="px-8 py-3 border border-neutral-600 text-white rounded-lg font-medium hover:bg-neutral-800">Talk to Sales</button>
              </div>
            </section>
          </div>)}
      </div>
    </div>;
};
export default HigherEducationPage;