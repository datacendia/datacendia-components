/**
 * DATACENDIA PITCH DECK
 * Interactive slide presentation for investors and prospects
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
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Home, Download, Maximize2, Brain, TrendingUp, Shield, Users, Target, DollarSign, Building2, Zap, Globe, Check, ArrowRight } from 'lucide-react';
interface Slide {
  id: string;
  title: string;
  content: React.ReactNode;
}
const SLIDES: Slide[] = stryMutAct_9fa48("51401") ? [] : (stryCov_9fa48("51401"), [stryMutAct_9fa48("51402") ? {} : (stryCov_9fa48("51402"), {
  id: 'cover',
  title: 'Cover',
  content: <div className="h-full flex flex-col items-center justify-center text-center p-12">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-8">
          <Brain className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
          Datacendia
        </h1>
        <p className="text-2xl text-purple-300 mb-8">
          Sovereign Enterprise Intelligence
        </p>
        <div className="text-slate-400 text-lg">
          Investor Presentation • 2025
        </div>
      </div>
}), stryMutAct_9fa48("51405") ? {} : (stryCov_9fa48("51405"), {
  id: 'problem',
  title: 'The Problem',
  content: <div className="h-full flex flex-col justify-center p-12">
        <h2 className="text-4xl font-bold text-white mb-8">
          The Enterprise Intelligence Crisis
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {(stryMutAct_9fa48("51408") ? [] : (stryCov_9fa48("51408"), [stryMutAct_9fa48("51409") ? {} : (stryCov_9fa48("51409"), {
        stat: '200+',
        label: 'SaaS tools per enterprise',
        icon: '🌊',
        color: 'red'
      }), stryMutAct_9fa48("51414") ? {} : (stryCov_9fa48("51414"), {
        stat: '73%',
        label: 'of data goes unused',
        icon: '📊',
        color: 'amber'
      }), stryMutAct_9fa48("51419") ? {} : (stryCov_9fa48("51419"), {
        stat: '$3.1T',
        label: 'lost to poor decisions annually',
        icon: '💸',
        color: 'red'
      })])).map(stryMutAct_9fa48("51424") ? () => undefined : (stryCov_9fa48("51424"), item => <div key={item.label} className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="text-4xl mb-4">{item.icon}</div>
              <div className={`text-4xl font-bold ${(stryMutAct_9fa48("51428") ? item.color !== 'red' : stryMutAct_9fa48("51427") ? false : stryMutAct_9fa48("51426") ? true : (stryCov_9fa48("51426", "51427", "51428"), item.color === 'red')) ? 'text-red-400' : 'text-amber-400'}`}>
                {item.stat}
              </div>
              <div className="text-slate-400 mt-2">{item.label}</div>
            </div>))}
        </div>
        <div className="mt-8 p-6 bg-red-500/10 rounded-xl border border-red-500/30">
          <p className="text-lg text-red-300">
            <strong>The Result:</strong> Executives make critical decisions with incomplete data,
            siloed insights, and zero predictive capability.
          </p>
        </div>
      </div>
}), stryMutAct_9fa48("51432") ? {} : (stryCov_9fa48("51432"), {
  id: 'solution',
  title: 'The Solution',
  content: <div className="h-full flex flex-col justify-center p-12">
        <h2 className="text-4xl font-bold text-white mb-4">
          Introducing The Cortex
        </h2>
        <p className="text-xl text-slate-400 mb-8">
          The unified intelligence platform that transforms how organizations think, decide, and act.
        </p>
        <div className="grid md:grid-cols-5 gap-4">
          {(stryMutAct_9fa48("51435") ? [] : (stryCov_9fa48("51435"), [stryMutAct_9fa48("51436") ? {} : (stryCov_9fa48("51436"), {
        name: 'Graph',
        icon: '🕸️',
        desc: 'Knowledge Universe'
      }), stryMutAct_9fa48("51440") ? {} : (stryCov_9fa48("51440"), {
        name: 'Council',
        icon: '🧠',
        desc: 'AI Deliberation'
      }), stryMutAct_9fa48("51444") ? {} : (stryCov_9fa48("51444"), {
        name: 'Pulse',
        icon: '💓',
        desc: 'Real-time Health'
      }), stryMutAct_9fa48("51448") ? {} : (stryCov_9fa48("51448"), {
        name: 'Lens',
        icon: '🔮',
        desc: 'Predictive Analytics'
      }), stryMutAct_9fa48("51452") ? {} : (stryCov_9fa48("51452"), {
        name: 'Bridge',
        icon: '🌉',
        desc: 'Action Orchestration'
      })])).map(stryMutAct_9fa48("51456") ? () => undefined : (stryCov_9fa48("51456"), space => <div key={space.name} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 text-center">
              <div className="text-3xl mb-2">{space.icon}</div>
              <div className="text-white font-semibold">{space.name}</div>
              <div className="text-xs text-slate-500">{space.desc}</div>
            </div>))}
        </div>
      </div>
}), stryMutAct_9fa48("51457") ? {} : (stryCov_9fa48("51457"), {
  id: 'product',
  title: 'Product',
  content: <div className="h-full flex flex-col justify-center p-12">
        <h2 className="text-4xl font-bold text-white mb-8">
          The AI Council: Multi-Persona Deliberation
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-lg text-slate-300">
              Unlike single-agent AI, Datacendia deploys an <strong className="text-purple-400">executive council</strong> of
              specialized AI personas that debate, challenge, and synthesize insights.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(stryMutAct_9fa48("51460") ? [] : (stryCov_9fa48("51460"), ['CFO', 'COO', 'CISO', 'CTO', 'CMO', 'CHRO'])).map(stryMutAct_9fa48("51467") ? () => undefined : (stryCov_9fa48("51467"), role => <div key={role} className="p-2 bg-purple-500/20 rounded text-center text-purple-300 text-sm">
                  {role} Agent
                </div>))}
            </div>
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
              <div className="text-green-400 font-semibold">Key Differentiator</div>
              <p className="text-slate-400 text-sm">
                Deliberation, not just generation. Our agents argue and converge on optimal decisions.
              </p>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <div className="text-sm text-slate-500 mb-4">Example Question:</div>
            <div className="text-white text-lg mb-4">
              "Should we expand into the European market in Q2?"
            </div>
            <div className="space-y-3">
              {(stryMutAct_9fa48("51468") ? [] : (stryCov_9fa48("51468"), [stryMutAct_9fa48("51469") ? {} : (stryCov_9fa48("51469"), {
            role: 'CFO',
            msg: 'Cash flow can support €2M investment...'
          }), stryMutAct_9fa48("51472") ? {} : (stryCov_9fa48("51472"), {
            role: 'COO',
            msg: 'Supply chain needs 3-month lead time...'
          }), stryMutAct_9fa48("51475") ? {} : (stryCov_9fa48("51475"), {
            role: 'CMO',
            msg: 'Brand awareness is 12% in target regions...'
          })])).map(stryMutAct_9fa48("51478") ? () => undefined : (stryCov_9fa48("51478"), item => <div key={item.role} className="flex gap-2 text-sm">
                  <span className="text-purple-400 font-mono">{item.role}:</span>
                  <span className="text-slate-400">{item.msg}</span>
                </div>))}
            </div>
          </div>
        </div>
      </div>
}), stryMutAct_9fa48("51479") ? {} : (stryCov_9fa48("51479"), {
  id: 'market',
  title: 'Market',
  content: <div className="h-full flex flex-col justify-center p-12">
        <h2 className="text-4xl font-bold text-white mb-8">
          $150B+ Total Addressable Market
        </h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {(stryMutAct_9fa48("51482") ? [] : (stryCov_9fa48("51482"), [stryMutAct_9fa48("51483") ? {} : (stryCov_9fa48("51483"), {
        label: 'TAM',
        value: '$150B',
        desc: 'Enterprise Intelligence'
      }), stryMutAct_9fa48("51487") ? {} : (stryCov_9fa48("51487"), {
        label: 'SAM',
        value: '$45B',
        desc: 'Mid-Market + Enterprise'
      }), stryMutAct_9fa48("51491") ? {} : (stryCov_9fa48("51491"), {
        label: 'SOM',
        value: '$2B',
        desc: 'Year 5 Target'
      })])).map(stryMutAct_9fa48("51495") ? () => undefined : (stryCov_9fa48("51495"), item => <div key={item.label} className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 text-center">
              <div className="text-slate-500 text-sm mb-2">{item.label}</div>
              <div className="text-4xl font-bold text-cyan-400">{item.value}</div>
              <div className="text-slate-400 text-sm mt-2">{item.desc}</div>
            </div>))}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
            <h3 className="text-white font-semibold mb-4">Competitive Landscape</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Palantir</span><span>Too complex, too expensive</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Snowflake</span><span>Data only, no intelligence</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tableau</span><span>Visualization, not prediction</span>
              </div>
              <div className="flex justify-between text-purple-400 font-semibold">
                <span>Datacendia</span><span>Full-stack intelligence</span>
              </div>
            </div>
          </div>
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
            <h3 className="text-white font-semibold mb-4">Why Now?</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-400 mt-0.5" />
                LLMs enable multi-agent reasoning
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-400 mt-0.5" />
                Enterprises demanding AI ROI
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-400 mt-0.5" />
                Data governance regulations increasing
              </li>
            </ul>
          </div>
        </div>
      </div>
}), stryMutAct_9fa48("51496") ? {} : (stryCov_9fa48("51496"), {
  id: 'business',
  title: 'Business Model',
  content: <div className="h-full flex flex-col justify-center p-12">
        <h2 className="text-4xl font-bold text-white mb-8">
          SaaS + Usage-Based Revenue
        </h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {(stryMutAct_9fa48("51499") ? [] : (stryCov_9fa48("51499"), [stryMutAct_9fa48("51500") ? {} : (stryCov_9fa48("51500"), {
        tier: 'Starter',
        price: '$2,500/mo',
        users: 'Up to 25 users',
        color: 'slate'
      }), stryMutAct_9fa48("51505") ? {} : (stryCov_9fa48("51505"), {
        tier: 'Professional',
        price: '$7,500/mo',
        users: 'Up to 100 users',
        color: 'purple'
      }), stryMutAct_9fa48("51510") ? {} : (stryCov_9fa48("51510"), {
        tier: 'Enterprise',
        price: 'Custom',
        users: 'Unlimited users',
        color: 'cyan'
      })])).map(stryMutAct_9fa48("51515") ? () => undefined : (stryCov_9fa48("51515"), plan => <div key={plan.tier} className={`p-6 rounded-xl border ${(stryMutAct_9fa48("51519") ? plan.color !== 'purple' : stryMutAct_9fa48("51518") ? false : stryMutAct_9fa48("51517") ? true : (stryCov_9fa48("51517", "51518", "51519"), plan.color === 'purple')) ? 'bg-purple-500/20 border-purple-500' : (stryMutAct_9fa48("51524") ? plan.color !== 'cyan' : stryMutAct_9fa48("51523") ? false : stryMutAct_9fa48("51522") ? true : (stryCov_9fa48("51522", "51523", "51524"), plan.color === 'cyan')) ? 'bg-cyan-500/20 border-cyan-500' : 'bg-slate-800/50 border-slate-700'}`}>
              <div className="text-slate-400 text-sm mb-1">{plan.tier}</div>
              <div className="text-3xl font-bold text-white mb-2">{plan.price}</div>
              <div className="text-slate-400 text-sm">{plan.users}</div>
            </div>))}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
            <h3 className="text-white font-semibold mb-4">Revenue Streams</h3>
            <div className="space-y-3">
              {(stryMutAct_9fa48("51528") ? [] : (stryCov_9fa48("51528"), [stryMutAct_9fa48("51529") ? {} : (stryCov_9fa48("51529"), {
            name: 'Platform Subscription',
            pct: '60%'
          }), stryMutAct_9fa48("51532") ? {} : (stryCov_9fa48("51532"), {
            name: 'Usage (AI/Compute)',
            pct: '25%'
          }), stryMutAct_9fa48("51535") ? {} : (stryCov_9fa48("51535"), {
            name: 'Professional Services',
            pct: '15%'
          })])).map(stryMutAct_9fa48("51538") ? () => undefined : (stryCov_9fa48("51538"), stream => <div key={stream.name} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500" style={stryMutAct_9fa48("51539") ? {} : (stryCov_9fa48("51539"), {
                  width: stream.pct
                })} />
                    </div>
                  </div>
                  <div className="text-slate-400 text-sm w-24">{stream.name}</div>
                  <div className="text-white font-semibold w-12">{stream.pct}</div>
                </div>))}
            </div>
          </div>
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
            <h3 className="text-white font-semibold mb-4">Unit Economics</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              {(stryMutAct_9fa48("51540") ? [] : (stryCov_9fa48("51540"), [stryMutAct_9fa48("51541") ? {} : (stryCov_9fa48("51541"), {
            label: 'CAC',
            value: '$15K'
          }), stryMutAct_9fa48("51544") ? {} : (stryCov_9fa48("51544"), {
            label: 'LTV',
            value: '$180K'
          }), stryMutAct_9fa48("51547") ? {} : (stryCov_9fa48("51547"), {
            label: 'LTV:CAC',
            value: '12:1'
          }), stryMutAct_9fa48("51550") ? {} : (stryCov_9fa48("51550"), {
            label: 'Payback',
            value: '8 mo'
          })])).map(stryMutAct_9fa48("51553") ? () => undefined : (stryCov_9fa48("51553"), metric => <div key={metric.label}>
                  <div className="text-2xl font-bold text-green-400">{metric.value}</div>
                  <div className="text-slate-500 text-sm">{metric.label}</div>
                </div>))}
            </div>
          </div>
        </div>
      </div>
}), stryMutAct_9fa48("51554") ? {} : (stryCov_9fa48("51554"), {
  id: 'traction',
  title: 'Traction',
  content: <div className="h-full flex flex-col justify-center p-12">
        <h2 className="text-4xl font-bold text-white mb-8">
          Early Traction & Roadmap
        </h2>
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {(stryMutAct_9fa48("51557") ? [] : (stryCov_9fa48("51557"), [stryMutAct_9fa48("51558") ? {} : (stryCov_9fa48("51558"), {
        value: '3',
        label: 'Pilot Customers',
        icon: Building2
      }), stryMutAct_9fa48("51561") ? {} : (stryCov_9fa48("51561"), {
        value: '$150K',
        label: 'Pipeline',
        icon: DollarSign
      }), stryMutAct_9fa48("51564") ? {} : (stryCov_9fa48("51564"), {
        value: '12',
        label: 'Active Users',
        icon: Users
      }), stryMutAct_9fa48("51567") ? {} : (stryCov_9fa48("51567"), {
        value: '94%',
        label: 'Satisfaction',
        icon: Target
      })])).map(stryMutAct_9fa48("51570") ? () => undefined : (stryCov_9fa48("51570"), metric => <div key={metric.label} className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 text-center">
              <metric.icon className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white">{metric.value}</div>
              <div className="text-slate-400 text-sm">{metric.label}</div>
            </div>))}
        </div>
        <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
          <h3 className="text-white font-semibold mb-4">Roadmap</h3>
          <div className="flex gap-4">
            {(stryMutAct_9fa48("51571") ? [] : (stryCov_9fa48("51571"), [stryMutAct_9fa48("51572") ? {} : (stryCov_9fa48("51572"), {
          q: 'Q1 2025',
          items: stryMutAct_9fa48("51574") ? [] : (stryCov_9fa48("51574"), ['Platform GA', '10 customers'])
        }), stryMutAct_9fa48("51577") ? {} : (stryCov_9fa48("51577"), {
          q: 'Q2 2025',
          items: stryMutAct_9fa48("51579") ? [] : (stryCov_9fa48("51579"), ['Apex Packages', '$500K ARR'])
        }), stryMutAct_9fa48("51582") ? {} : (stryCov_9fa48("51582"), {
          q: 'Q3 2025',
          items: stryMutAct_9fa48("51584") ? [] : (stryCov_9fa48("51584"), ['Enterprise tier', '25 customers'])
        }), stryMutAct_9fa48("51587") ? {} : (stryCov_9fa48("51587"), {
          q: 'Q4 2025',
          items: stryMutAct_9fa48("51589") ? [] : (stryCov_9fa48("51589"), ['Series A', '$2M ARR'])
        })])).map(stryMutAct_9fa48("51592") ? () => undefined : (stryCov_9fa48("51592"), phase => <div key={phase.q} className="flex-1 p-4 bg-slate-900/50 rounded-lg">
                <div className="text-purple-400 font-semibold mb-2">{phase.q}</div>
                <ul className="text-sm text-slate-400 space-y-1">
                  {phase.items.map(stryMutAct_9fa48("51593") ? () => undefined : (stryCov_9fa48("51593"), item => <li key={item}>• {item}</li>))}
                </ul>
              </div>))}
          </div>
        </div>
      </div>
}), stryMutAct_9fa48("51594") ? {} : (stryCov_9fa48("51594"), {
  id: 'team',
  title: 'Team',
  content: <div className="h-full flex flex-col justify-center p-12">
        <h2 className="text-4xl font-bold text-white mb-8">
          Leadership Team
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {(stryMutAct_9fa48("51597") ? [] : (stryCov_9fa48("51597"), [stryMutAct_9fa48("51598") ? {} : (stryCov_9fa48("51598"), {
        name: 'Stuart Rainey',
        title: 'Founder & CEO',
        bio: 'Serial entrepreneur with 20+ years in enterprise software',
        avatar: '👨‍💼'
      }), stryMutAct_9fa48("51603") ? {} : (stryCov_9fa48("51603"), {
        name: 'Technical Team',
        title: 'Engineering',
        bio: 'Full-stack AI/ML expertise, building production systems',
        avatar: '👨‍💻'
      }), stryMutAct_9fa48("51608") ? {} : (stryCov_9fa48("51608"), {
        name: 'Advisory Board',
        title: 'Advisors',
        bio: 'Fortune 500 executives, AI researchers, enterprise sales leaders',
        avatar: '🎓'
      })])).map(stryMutAct_9fa48("51613") ? () => undefined : (stryCov_9fa48("51613"), member => <div key={member.name} className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                {member.avatar}
              </div>
              <div className="text-center">
                <div className="text-white font-semibold text-lg">{member.name}</div>
                <div className="text-purple-400 text-sm mb-3">{member.title}</div>
                <div className="text-slate-400 text-sm">{member.bio}</div>
              </div>
            </div>))}
        </div>
      </div>
}), stryMutAct_9fa48("51614") ? {} : (stryCov_9fa48("51614"), {
  id: 'ask',
  title: 'The Ask',
  content: <div className="h-full flex flex-col justify-center p-12 text-center">
        <h2 className="text-4xl font-bold text-white mb-8">
          Seed Round: $2M
        </h2>
        <div className="max-w-2xl mx-auto mb-8">
          <div className="grid grid-cols-3 gap-6 mb-8">
            {(stryMutAct_9fa48("51617") ? [] : (stryCov_9fa48("51617"), [stryMutAct_9fa48("51618") ? {} : (stryCov_9fa48("51618"), {
          pct: '50%',
          label: 'Product & Engineering'
        }), stryMutAct_9fa48("51621") ? {} : (stryCov_9fa48("51621"), {
          pct: '30%',
          label: 'Go-to-Market'
        }), stryMutAct_9fa48("51624") ? {} : (stryCov_9fa48("51624"), {
          pct: '20%',
          label: 'Operations'
        })])).map(stryMutAct_9fa48("51627") ? () => undefined : (stryCov_9fa48("51627"), item => <div key={item.label} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <div className="text-3xl font-bold text-purple-400">{item.pct}</div>
                <div className="text-slate-400 text-sm">{item.label}</div>
              </div>))}
          </div>
          <div className="p-6 bg-green-500/10 rounded-xl border border-green-500/30">
            <div className="text-2xl font-bold text-green-400 mb-2">18-Month Runway</div>
            <div className="text-slate-400">
              Path to $2M ARR and Series A readiness
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <Link to="/demo" className="px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition">
            Schedule Demo
          </Link>
          <a href="mailto:invest@datacendia.com" className="px-8 py-4 border border-slate-600 text-white font-semibold rounded-xl hover:bg-slate-800 transition">
            Contact Us
          </a>
        </div>
      </div>
}), stryMutAct_9fa48("51628") ? {} : (stryCov_9fa48("51628"), {
  id: 'closing',
  title: 'Thank You',
  content: <div className="h-full flex flex-col items-center justify-center text-center p-12">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-8">
          <Brain className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-5xl font-bold text-white mb-4">
          Thank You
        </h1>
        <p className="text-2xl text-purple-300 mb-8">
          Let's build the future of enterprise intelligence together
        </p>
        <div className="text-slate-400">
          <div className="mb-2">📧 hello@datacendia.com</div>
          <div className="mb-2">🌐 datacendia.com</div>
        </div>
      </div>
})]);
export const PitchDeck: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(stryMutAct_9fa48("51632") ? true : (stryCov_9fa48("51632"), false));
  const nextSlide = () => {
    setCurrentSlide(stryMutAct_9fa48("51634") ? () => undefined : (stryCov_9fa48("51634"), prev => stryMutAct_9fa48("51635") ? Math.max(prev + 1, SLIDES.length - 1) : (stryCov_9fa48("51635"), Math.min(stryMutAct_9fa48("51636") ? prev - 1 : (stryCov_9fa48("51636"), prev + 1), stryMutAct_9fa48("51637") ? SLIDES.length + 1 : (stryCov_9fa48("51637"), SLIDES.length - 1)))));
  };
  const prevSlide = () => {
    setCurrentSlide(stryMutAct_9fa48("51639") ? () => undefined : (stryCov_9fa48("51639"), prev => stryMutAct_9fa48("51640") ? Math.min(prev - 1, 0) : (stryCov_9fa48("51640"), Math.max(stryMutAct_9fa48("51641") ? prev + 1 : (stryCov_9fa48("51641"), prev - 1), 0))));
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (stryMutAct_9fa48("51645") ? e.key === 'ArrowRight' && e.key === ' ' : stryMutAct_9fa48("51644") ? false : stryMutAct_9fa48("51643") ? true : (stryCov_9fa48("51643", "51644", "51645"), (stryMutAct_9fa48("51647") ? e.key !== 'ArrowRight' : stryMutAct_9fa48("51646") ? false : (stryCov_9fa48("51646", "51647"), e.key === 'ArrowRight')) || (stryMutAct_9fa48("51650") ? e.key !== ' ' : stryMutAct_9fa48("51649") ? false : (stryCov_9fa48("51649", "51650"), e.key === ' ')))) {
      nextSlide();
    }
    if (stryMutAct_9fa48("51655") ? e.key !== 'ArrowLeft' : stryMutAct_9fa48("51654") ? false : stryMutAct_9fa48("51653") ? true : (stryCov_9fa48("51653", "51654", "51655"), e.key === 'ArrowLeft')) {
      prevSlide();
    }
  };
  return <div className={`min-h-screen bg-slate-900 flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`} tabIndex={0} onKeyDown={handleKeyDown}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-slate-400 hover:text-white">
            <Home className="w-5 h-5" />
          </Link>
          <span className="text-white font-semibold">Datacendia Pitch Deck</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm">
            {stryMutAct_9fa48("51661") ? currentSlide - 1 : (stryCov_9fa48("51661"), currentSlide + 1)} / {SLIDES.length}
          </span>
          <button onClick={stryMutAct_9fa48("51662") ? () => undefined : (stryCov_9fa48("51662"), () => setIsFullscreen(stryMutAct_9fa48("51663") ? isFullscreen : (stryCov_9fa48("51663"), !isFullscreen)))} className="text-slate-400 hover:text-white">
            <Maximize2 className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Slide */}
      <div className="flex-1 flex">
        {/* Slide content */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 overflow-hidden">
            {SLIDES[currentSlide].content}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800">
        <button onClick={prevSlide} disabled={stryMutAct_9fa48("51666") ? currentSlide !== 0 : stryMutAct_9fa48("51665") ? false : stryMutAct_9fa48("51664") ? true : (stryCov_9fa48("51664", "51665", "51666"), currentSlide === 0)} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${(stryMutAct_9fa48("51670") ? currentSlide !== 0 : stryMutAct_9fa48("51669") ? false : stryMutAct_9fa48("51668") ? true : (stryCov_9fa48("51668", "51669", "51670"), currentSlide === 0)) ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        {/* Slide thumbnails */}
        <div className="flex gap-2">
          {SLIDES.map(stryMutAct_9fa48("51673") ? () => undefined : (stryCov_9fa48("51673"), (slide, index) => <button key={slide.id} onClick={stryMutAct_9fa48("51674") ? () => undefined : (stryCov_9fa48("51674"), () => setCurrentSlide(index))} className={`w-3 h-3 rounded-full transition ${(stryMutAct_9fa48("51678") ? index !== currentSlide : stryMutAct_9fa48("51677") ? false : stryMutAct_9fa48("51676") ? true : (stryCov_9fa48("51676", "51677", "51678"), index === currentSlide)) ? 'bg-purple-500' : 'bg-slate-700 hover:bg-slate-600'}`} />))}
        </div>

        <button onClick={nextSlide} disabled={stryMutAct_9fa48("51683") ? currentSlide !== SLIDES.length - 1 : stryMutAct_9fa48("51682") ? false : stryMutAct_9fa48("51681") ? true : (stryCov_9fa48("51681", "51682", "51683"), currentSlide === (stryMutAct_9fa48("51684") ? SLIDES.length + 1 : (stryCov_9fa48("51684"), SLIDES.length - 1)))} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${(stryMutAct_9fa48("51688") ? currentSlide !== SLIDES.length - 1 : stryMutAct_9fa48("51687") ? false : stryMutAct_9fa48("51686") ? true : (stryCov_9fa48("51686", "51687", "51688"), currentSlide === (stryMutAct_9fa48("51689") ? SLIDES.length + 1 : (stryCov_9fa48("51689"), SLIDES.length - 1)))) ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
          Next
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>;
};
export default PitchDeck;