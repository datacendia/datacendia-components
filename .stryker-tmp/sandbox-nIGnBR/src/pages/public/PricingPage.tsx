// @ts-nocheck
// =============================================================================
// DATACENDIA - PRICING PAGE
// =============================================================================

// File: src/pages/public/PricingPage.tsx
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
import { cn, formatCurrency } from '../../../lib/utils';
interface PlanFeature {
  name: string;
  foundation: boolean | string;
  intelligence: boolean | string;
  governance: boolean | string;
  sovereign: boolean | string;
}
const plans = stryMutAct_9fa48("55005") ? [] : (stryCov_9fa48("55005"), [stryMutAct_9fa48("55006") ? {} : (stryCov_9fa48("55006"), {
  id: 'foundation',
  name: 'Foundation',
  price: 5000,
  description: 'Essential data intelligence for growing teams',
  cta: 'Start Free Trial',
  highlighted: stryMutAct_9fa48("55011") ? true : (stryCov_9fa48("55011"), false)
}), stryMutAct_9fa48("55012") ? {} : (stryCov_9fa48("55012"), {
  id: 'intelligence',
  name: 'Intelligence',
  price: 10000,
  description: 'Advanced analytics and AI-powered insights',
  cta: 'Start Free Trial',
  highlighted: stryMutAct_9fa48("55017") ? false : (stryCov_9fa48("55017"), true)
}), stryMutAct_9fa48("55018") ? {} : (stryCov_9fa48("55018"), {
  id: 'governance',
  name: 'Governance',
  price: 15000,
  description: 'Complete data governance and compliance',
  cta: 'Contact Sales',
  highlighted: stryMutAct_9fa48("55023") ? true : (stryCov_9fa48("55023"), false)
}), stryMutAct_9fa48("55024") ? {} : (stryCov_9fa48("55024"), {
  id: 'sovereign',
  name: 'Sovereign',
  price: 25000,
  description: 'Full platform with unlimited capabilities',
  cta: 'Contact Sales',
  highlighted: stryMutAct_9fa48("55029") ? true : (stryCov_9fa48("55029"), false)
})]);
const features: PlanFeature[] = stryMutAct_9fa48("55030") ? [] : (stryCov_9fa48("55030"), [stryMutAct_9fa48("55031") ? {} : (stryCov_9fa48("55031"), {
  name: 'Users',
  foundation: '10',
  intelligence: '50',
  governance: '200',
  sovereign: 'Unlimited'
}), stryMutAct_9fa48("55037") ? {} : (stryCov_9fa48("55037"), {
  name: 'Agents',
  foundation: '1',
  intelligence: '3',
  governance: '5',
  sovereign: 'Unlimited'
}), stryMutAct_9fa48("55043") ? {} : (stryCov_9fa48("55043"), {
  name: 'Data Sources',
  foundation: '5',
  intelligence: '20',
  governance: '50',
  sovereign: 'Unlimited'
}), stryMutAct_9fa48("55049") ? {} : (stryCov_9fa48("55049"), {
  name: 'API Calls/month',
  foundation: '10K',
  intelligence: '100K',
  governance: '500K',
  sovereign: 'Unlimited'
}), stryMutAct_9fa48("55055") ? {} : (stryCov_9fa48("55055"), {
  name: 'Storage',
  foundation: '10 GB',
  intelligence: '50 GB',
  governance: '200 GB',
  sovereign: '1 TB'
}), stryMutAct_9fa48("55061") ? {} : (stryCov_9fa48("55061"), {
  name: 'Lineage Tracking',
  foundation: stryMutAct_9fa48("55063") ? false : (stryCov_9fa48("55063"), true),
  intelligence: stryMutAct_9fa48("55064") ? false : (stryCov_9fa48("55064"), true),
  governance: stryMutAct_9fa48("55065") ? false : (stryCov_9fa48("55065"), true),
  sovereign: stryMutAct_9fa48("55066") ? false : (stryCov_9fa48("55066"), true)
}), stryMutAct_9fa48("55067") ? {} : (stryCov_9fa48("55067"), {
  name: 'Unified Metrics',
  foundation: stryMutAct_9fa48("55069") ? false : (stryCov_9fa48("55069"), true),
  intelligence: stryMutAct_9fa48("55070") ? false : (stryCov_9fa48("55070"), true),
  governance: stryMutAct_9fa48("55071") ? false : (stryCov_9fa48("55071"), true),
  sovereign: stryMutAct_9fa48("55072") ? false : (stryCov_9fa48("55072"), true)
}), stryMutAct_9fa48("55073") ? {} : (stryCov_9fa48("55073"), {
  name: 'Basic Helm',
  foundation: stryMutAct_9fa48("55075") ? false : (stryCov_9fa48("55075"), true),
  intelligence: stryMutAct_9fa48("55076") ? false : (stryCov_9fa48("55076"), true),
  governance: stryMutAct_9fa48("55077") ? false : (stryCov_9fa48("55077"), true),
  sovereign: stryMutAct_9fa48("55078") ? false : (stryCov_9fa48("55078"), true)
}), stryMutAct_9fa48("55079") ? {} : (stryCov_9fa48("55079"), {
  name: 'Predict (AI Forecasting)',
  foundation: stryMutAct_9fa48("55081") ? true : (stryCov_9fa48("55081"), false),
  intelligence: stryMutAct_9fa48("55082") ? false : (stryCov_9fa48("55082"), true),
  governance: stryMutAct_9fa48("55083") ? false : (stryCov_9fa48("55083"), true),
  sovereign: stryMutAct_9fa48("55084") ? false : (stryCov_9fa48("55084"), true)
}), stryMutAct_9fa48("55085") ? {} : (stryCov_9fa48("55085"), {
  name: 'Health Monitoring',
  foundation: stryMutAct_9fa48("55087") ? true : (stryCov_9fa48("55087"), false),
  intelligence: stryMutAct_9fa48("55088") ? false : (stryCov_9fa48("55088"), true),
  governance: stryMutAct_9fa48("55089") ? false : (stryCov_9fa48("55089"), true),
  sovereign: stryMutAct_9fa48("55090") ? false : (stryCov_9fa48("55090"), true)
}), stryMutAct_9fa48("55091") ? {} : (stryCov_9fa48("55091"), {
  name: 'Full Helm',
  foundation: stryMutAct_9fa48("55093") ? true : (stryCov_9fa48("55093"), false),
  intelligence: stryMutAct_9fa48("55094") ? false : (stryCov_9fa48("55094"), true),
  governance: stryMutAct_9fa48("55095") ? false : (stryCov_9fa48("55095"), true),
  sovereign: stryMutAct_9fa48("55096") ? false : (stryCov_9fa48("55096"), true)
}), stryMutAct_9fa48("55097") ? {} : (stryCov_9fa48("55097"), {
  name: 'Guard (Governance)',
  foundation: stryMutAct_9fa48("55099") ? true : (stryCov_9fa48("55099"), false),
  intelligence: stryMutAct_9fa48("55100") ? true : (stryCov_9fa48("55100"), false),
  governance: stryMutAct_9fa48("55101") ? false : (stryCov_9fa48("55101"), true),
  sovereign: stryMutAct_9fa48("55102") ? false : (stryCov_9fa48("55102"), true)
}), stryMutAct_9fa48("55103") ? {} : (stryCov_9fa48("55103"), {
  name: 'Ethics Engine',
  foundation: stryMutAct_9fa48("55105") ? true : (stryCov_9fa48("55105"), false),
  intelligence: stryMutAct_9fa48("55106") ? true : (stryCov_9fa48("55106"), false),
  governance: stryMutAct_9fa48("55107") ? false : (stryCov_9fa48("55107"), true),
  sovereign: stryMutAct_9fa48("55108") ? false : (stryCov_9fa48("55108"), true)
}), stryMutAct_9fa48("55109") ? {} : (stryCov_9fa48("55109"), {
  name: 'Flow (Automation)',
  foundation: stryMutAct_9fa48("55111") ? true : (stryCov_9fa48("55111"), false),
  intelligence: stryMutAct_9fa48("55112") ? true : (stryCov_9fa48("55112"), false),
  governance: stryMutAct_9fa48("55113") ? true : (stryCov_9fa48("55113"), false),
  sovereign: stryMutAct_9fa48("55114") ? false : (stryCov_9fa48("55114"), true)
}), stryMutAct_9fa48("55115") ? {} : (stryCov_9fa48("55115"), {
  name: 'Custom Agents',
  foundation: stryMutAct_9fa48("55117") ? true : (stryCov_9fa48("55117"), false),
  intelligence: stryMutAct_9fa48("55118") ? true : (stryCov_9fa48("55118"), false),
  governance: stryMutAct_9fa48("55119") ? true : (stryCov_9fa48("55119"), false),
  sovereign: stryMutAct_9fa48("55120") ? false : (stryCov_9fa48("55120"), true)
}), stryMutAct_9fa48("55121") ? {} : (stryCov_9fa48("55121"), {
  name: 'SSO/SAML',
  foundation: stryMutAct_9fa48("55123") ? true : (stryCov_9fa48("55123"), false),
  intelligence: stryMutAct_9fa48("55124") ? false : (stryCov_9fa48("55124"), true),
  governance: stryMutAct_9fa48("55125") ? false : (stryCov_9fa48("55125"), true),
  sovereign: stryMutAct_9fa48("55126") ? false : (stryCov_9fa48("55126"), true)
}), stryMutAct_9fa48("55127") ? {} : (stryCov_9fa48("55127"), {
  name: 'Audit Logs',
  foundation: '30 days',
  intelligence: '90 days',
  governance: '1 year',
  sovereign: '7 years'
}), stryMutAct_9fa48("55133") ? {} : (stryCov_9fa48("55133"), {
  name: 'Support',
  foundation: 'Email',
  intelligence: 'Priority',
  governance: 'Dedicated',
  sovereign: 'White Glove'
})]);
const addons = stryMutAct_9fa48("55139") ? [] : (stryCov_9fa48("55139"), [stryMutAct_9fa48("55140") ? {} : (stryCov_9fa48("55140"), {
  name: 'Additional Agent',
  price: 3000,
  description: 'Add another AI advisor to your Council'
}), stryMutAct_9fa48("55143") ? {} : (stryCov_9fa48("55143"), {
  name: 'Custom Agent',
  price: 6000,
  description: 'Custom-trained agent for your domain'
}), stryMutAct_9fa48("55146") ? {} : (stryCov_9fa48("55146"), {
  name: 'Reference Implementation',
  price: 5000,
  description: 'Industry-specific workflows & templates'
}), stryMutAct_9fa48("55149") ? {} : (stryCov_9fa48("55149"), {
  name: 'Air-Gapped Deployment',
  price: '+50%',
  description: 'Fully isolated deployment option'
}), stryMutAct_9fa48("55153") ? {} : (stryCov_9fa48("55153"), {
  name: 'Premium Support',
  price: 4000,
  description: '24/7 support with 1-hour SLA'
})]);
const faqs = stryMutAct_9fa48("55156") ? [] : (stryCov_9fa48("55156"), [stryMutAct_9fa48("55157") ? {} : (stryCov_9fa48("55157"), {
  question: 'Can I try Datacendia before committing?',
  answer: 'Yes! We offer a 14-day free trial for Foundation and Intelligence plans. For Governance and Sovereign plans, we provide a personalized demo and proof-of-concept.'
}), stryMutAct_9fa48("55160") ? {} : (stryCov_9fa48("55160"), {
  question: 'How does billing work?',
  answer: 'All plans are billed annually. Monthly billing is available at a 20% premium. We accept credit cards, ACH, and wire transfers for enterprise accounts.'
}), stryMutAct_9fa48("55163") ? {} : (stryCov_9fa48("55163"), {
  question: 'Can I upgrade or downgrade my plan?',
  answer: 'Yes, you can upgrade at any time and the price difference will be prorated. Downgrades take effect at the next billing cycle.'
}), stryMutAct_9fa48("55166") ? {} : (stryCov_9fa48("55166"), {
  question: 'What happens if I exceed my usage limits?',
  answer: 'We\'ll notify you when you reach 80% of any limit. Overages are billed at standard rates, or you can upgrade to a higher plan.'
}), stryMutAct_9fa48("55169") ? {} : (stryCov_9fa48("55169"), {
  question: 'Do you offer discounts for nonprofits or startups?',
  answer: 'Yes! We offer 50% off for qualified nonprofits and a special startup program. Contact us for details.'
}), stryMutAct_9fa48("55172") ? {} : (stryCov_9fa48("55172"), {
  question: 'Is there a self-hosted option?',
  answer: 'Yes, Sovereign plan includes the option for on-premise or private cloud deployment. Air-gapped deployments are available as an add-on.'
})]);
export const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const getPrice = (price: number) => {
    const monthlyPrice = (stryMutAct_9fa48("55180") ? billingCycle !== 'monthly' : stryMutAct_9fa48("55179") ? false : stryMutAct_9fa48("55178") ? true : (stryCov_9fa48("55178", "55179", "55180"), billingCycle === 'monthly')) ? stryMutAct_9fa48("55182") ? price / 1.2 : (stryCov_9fa48("55182"), price * 1.2) : price;
    return formatCurrency(monthlyPrice);
  };
  return <div className="min-h-screen bg-white">
      {/* Navigation would be shared - simplified here */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">D</span>
              </div>
              <span className="font-semibold text-neutral-900">Datacendia</span>
            </Link>
            <Link to="/login" className="text-sm text-neutral-600 hover:text-neutral-900">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-8">
            Choose the plan that fits your organization. All plans include core Cortex access.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={cn('text-sm', (stryMutAct_9fa48("55186") ? billingCycle !== 'monthly' : stryMutAct_9fa48("55185") ? false : stryMutAct_9fa48("55184") ? true : (stryCov_9fa48("55184", "55185", "55186"), billingCycle === 'monthly')) ? 'text-neutral-900' : 'text-neutral-500')}>
              Monthly
            </span>
            <button onClick={stryMutAct_9fa48("55190") ? () => undefined : (stryCov_9fa48("55190"), () => setBillingCycle((stryMutAct_9fa48("55193") ? billingCycle !== 'monthly' : stryMutAct_9fa48("55192") ? false : stryMutAct_9fa48("55191") ? true : (stryCov_9fa48("55191", "55192", "55193"), billingCycle === 'monthly')) ? 'annual' : 'monthly'))} className={cn('relative w-14 h-7 rounded-full transition-colors', (stryMutAct_9fa48("55200") ? billingCycle !== 'annual' : stryMutAct_9fa48("55199") ? false : stryMutAct_9fa48("55198") ? true : (stryCov_9fa48("55198", "55199", "55200"), billingCycle === 'annual')) ? 'bg-primary-600' : 'bg-neutral-200')}>
              <span className={cn('absolute top-1 w-5 h-5 bg-white rounded-full transition-transform', (stryMutAct_9fa48("55207") ? billingCycle !== 'annual' : stryMutAct_9fa48("55206") ? false : stryMutAct_9fa48("55205") ? true : (stryCov_9fa48("55205", "55206", "55207"), billingCycle === 'annual')) ? 'left-8' : 'left-1')} />
            </button>
            <span className={cn('text-sm', (stryMutAct_9fa48("55214") ? billingCycle !== 'annual' : stryMutAct_9fa48("55213") ? false : stryMutAct_9fa48("55212") ? true : (stryCov_9fa48("55212", "55213", "55214"), billingCycle === 'annual')) ? 'text-neutral-900' : 'text-neutral-500')}>
              Annual
            </span>
            {stryMutAct_9fa48("55220") ? billingCycle === 'annual' || <span className="px-2 py-1 bg-success-light text-success-dark text-xs font-medium rounded-full">
                Save 20%
              </span> : stryMutAct_9fa48("55219") ? false : stryMutAct_9fa48("55218") ? true : (stryCov_9fa48("55218", "55219", "55220"), (stryMutAct_9fa48("55222") ? billingCycle !== 'annual' : stryMutAct_9fa48("55221") ? true : (stryCov_9fa48("55221", "55222"), billingCycle === 'annual')) && <span className="px-2 py-1 bg-success-light text-success-dark text-xs font-medium rounded-full">
                Save 20%
              </span>)}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map(stryMutAct_9fa48("55224") ? () => undefined : (stryCov_9fa48("55224"), plan => <div key={plan.id} className={cn('rounded-2xl border p-6 relative', plan.highlighted ? 'border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/10' : 'border-neutral-200 bg-white')}>
                {stryMutAct_9fa48("55230") ? plan.highlighted || <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
                      Most Popular
                    </span>
                  </div> : stryMutAct_9fa48("55229") ? false : stryMutAct_9fa48("55228") ? true : (stryCov_9fa48("55228", "55229", "55230"), plan.highlighted && <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
                      Most Popular
                    </span>
                  </div>)}

                <h3 className="text-xl font-semibold text-neutral-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-neutral-500 mb-4">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-neutral-900">{getPrice(plan.price)}</span>
                  <span className="text-neutral-500">/month</span>
                </div>

                <Link to={(stryMutAct_9fa48("55233") ? plan.cta !== 'Contact Sales' : stryMutAct_9fa48("55232") ? false : stryMutAct_9fa48("55231") ? true : (stryCov_9fa48("55231", "55232", "55233"), plan.cta === 'Contact Sales')) ? '/demo' : '/register'} className={cn('block w-full py-3 text-center font-medium rounded-lg transition-colors', plan.highlighted ? 'bg-primary-600 text-white hover:bg-primary-700' : 'border border-neutral-200 text-neutral-700 hover:bg-neutral-50')}>
                  {plan.cta}
                </Link>
              </div>))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-neutral-900 text-center mb-12">
            Compare Plans
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-4 px-4 font-semibold text-neutral-900">Feature</th>
                  {plans.map(stryMutAct_9fa48("55240") ? () => undefined : (stryCov_9fa48("55240"), plan => <th key={plan.id} className="text-center py-4 px-4 font-semibold text-neutral-900">
                      {plan.name}
                    </th>))}
                </tr>
              </thead>
              <tbody>
                {features.map(stryMutAct_9fa48("55241") ? () => undefined : (stryCov_9fa48("55241"), (feature, index) => <tr key={index} className="border-b border-neutral-100">
                    <td className="py-4 px-4 text-sm text-neutral-600">{feature.name}</td>
                    {(['foundation', 'intelligence', 'governance', 'sovereign'] as const).map(stryMutAct_9fa48("55242") ? () => undefined : (stryCov_9fa48("55242"), plan => <td key={plan} className="py-4 px-4 text-center">
                        {(stryMutAct_9fa48("55245") ? typeof feature[plan] !== 'boolean' : stryMutAct_9fa48("55244") ? false : stryMutAct_9fa48("55243") ? true : (stryCov_9fa48("55243", "55244", "55245"), typeof feature[plan] === 'boolean')) ? feature[plan] ? <span className="text-success-main">✓</span> : <span className="text-neutral-300">—</span> : <span className="text-sm text-neutral-700">{feature[plan]}</span>}
                      </td>))}
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-neutral-900 text-center mb-4">Add-ons</h2>
          <p className="text-neutral-600 text-center mb-12">
            Extend your plan with additional capabilities
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {addons.map(stryMutAct_9fa48("55247") ? () => undefined : (stryCov_9fa48("55247"), (addon, index) => <div key={index} className="p-6 bg-white rounded-xl border border-neutral-200">
                <h3 className="font-semibold text-neutral-900 mb-1">{addon.name}</h3>
                <p className="text-sm text-neutral-500 mb-3">{addon.description}</p>
                <p className="text-lg font-bold text-primary-600">
                  {(stryMutAct_9fa48("55250") ? typeof addon.price !== 'number' : stryMutAct_9fa48("55249") ? false : stryMutAct_9fa48("55248") ? true : (stryCov_9fa48("55248", "55249", "55250"), typeof addon.price === 'number')) ? `${formatCurrency(addon.price)}/mo` : addon.price}
                </p>
              </div>))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-neutral-900 text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map(stryMutAct_9fa48("55253") ? () => undefined : (stryCov_9fa48("55253"), (faq, index) => <div key={index} className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                <button onClick={stryMutAct_9fa48("55254") ? () => undefined : (stryCov_9fa48("55254"), () => setExpandedFaq((stryMutAct_9fa48("55257") ? expandedFaq !== index : stryMutAct_9fa48("55256") ? false : stryMutAct_9fa48("55255") ? true : (stryCov_9fa48("55255", "55256", "55257"), expandedFaq === index)) ? null : index))} className="w-full flex items-center justify-between p-6 text-left">
                  <span className="font-medium text-neutral-900">{faq.question}</span>
                  <span className={cn('text-xl text-neutral-400 transition-transform', stryMutAct_9fa48("55261") ? expandedFaq === index || 'rotate-180' : stryMutAct_9fa48("55260") ? false : stryMutAct_9fa48("55259") ? true : (stryCov_9fa48("55259", "55260", "55261"), (stryMutAct_9fa48("55263") ? expandedFaq !== index : stryMutAct_9fa48("55262") ? true : (stryCov_9fa48("55262", "55263"), expandedFaq === index)) && 'rotate-180'))}>
                    ▼
                  </span>
                </button>
                {stryMutAct_9fa48("55267") ? expandedFaq === index || <div className="px-6 pb-6 text-neutral-600">
                    {faq.answer}
                  </div> : stryMutAct_9fa48("55266") ? false : stryMutAct_9fa48("55265") ? true : (stryCov_9fa48("55265", "55266", "55267"), (stryMutAct_9fa48("55269") ? expandedFaq !== index : stryMutAct_9fa48("55268") ? true : (stryCov_9fa48("55268", "55269"), expandedFaq === index)) && <div className="px-6 pb-6 text-neutral-600">
                    {faq.answer}
                  </div>)}
              </div>))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-white/70 mb-8">
            Start your 14-day free trial or talk to our team about your needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-white text-primary-600 font-medium rounded-xl hover:bg-white/90 transition-colors">
              Start Free Trial
            </Link>
            <Link to="/demo" className="w-full sm:w-auto px-8 py-4 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-colors">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>;
};
export default PricingPage;