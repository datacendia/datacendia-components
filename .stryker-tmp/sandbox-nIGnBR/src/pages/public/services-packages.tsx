// @ts-nocheck
// =============================================================================
// DATACENDIA - SERVICES & PACKAGES PAGES
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
import { Link, useNavigate } from 'react-router-dom';
import { cn, formatCurrency } from '../../../lib/utils';

// =============================================================================
// SHARED HEADER
// =============================================================================

const PageHeader: React.FC = () => {
  const navigate = useNavigate();
  return <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <span className="text-xl font-bold text-neutral-900">Datacendia</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/product" className="text-neutral-600 hover:text-neutral-900">Product</Link>
          <Link to="/pricing" className="text-neutral-600 hover:text-neutral-900">Pricing</Link>
          <Link to="/services" className="text-neutral-600 hover:text-neutral-900">Services</Link>
          <Link to="/packages" className="text-neutral-600 hover:text-neutral-900">Packages</Link>
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={stryMutAct_9fa48("55694") ? () => undefined : (stryCov_9fa48("55694"), () => navigate('/login'))} className="text-neutral-600 hover:text-neutral-900 font-medium">
            Sign In
          </button>
          <button onClick={stryMutAct_9fa48("55696") ? () => undefined : (stryCov_9fa48("55696"), () => navigate('/demo'))} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            Request Demo
          </button>
        </div>
      </div>
    </header>;
};

// =============================================================================
// SHARED FOOTER
// =============================================================================

const PageFooter: React.FC = stryMutAct_9fa48("55698") ? () => undefined : (stryCov_9fa48("55698"), (() => {
  const PageFooter: React.FC = () => <footer className="bg-neutral-900 text-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">D</span>
            </div>
            <span className="font-bold">Datacendia</span>
          </div>
          <p className="text-neutral-400 text-sm">Sovereign Enterprise Intelligence</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Product</h4>
          <ul className="space-y-2 text-neutral-400 text-sm">
            <li><Link to="/product" className="hover:text-white">Features</Link></li>
            <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
            <li><Link to="/downloads" className="hover:text-white">Downloads</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Services</h4>
          <ul className="space-y-2 text-neutral-400 text-sm">
            <li><Link to="/services" className="hover:text-white">Professional Services</Link></li>
            <li><Link to="/packages" className="hover:text-white">Solution Packages</Link></li>
            <li><Link to="/demo" className="hover:text-white">Request Demo</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-neutral-400 text-sm">
            <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
            <li><Link to="/license" className="hover:text-white">License</Link></li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-neutral-800 text-center text-neutral-400 text-sm">
        © {new Date().getFullYear()} Datacendia. All rights reserved.
      </div>
    </div>
  </footer>;
  return PageFooter;
})());

// =============================================================================
// SERVICES PAGE
// =============================================================================

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const serviceCategories = stryMutAct_9fa48("55700") ? [] : (stryCov_9fa48("55700"), [stryMutAct_9fa48("55701") ? {} : (stryCov_9fa48("55701"), {
    id: 'implementation',
    name: 'Implementation Services',
    icon: '🚀',
    description: 'Get up and running with expert guidance',
    services: stryMutAct_9fa48("55706") ? [] : (stryCov_9fa48("55706"), [stryMutAct_9fa48("55707") ? {} : (stryCov_9fa48("55707"), {
      name: 'Quick Start',
      duration: '2 weeks',
      price: 15000,
      description: 'Basic setup with 3 integrations'
    }), stryMutAct_9fa48("55711") ? {} : (stryCov_9fa48("55711"), {
      name: 'Standard Implementation',
      duration: '4-6 weeks',
      price: 35000,
      description: 'Full setup with 10 integrations + training'
    }), stryMutAct_9fa48("55715") ? {} : (stryCov_9fa48("55715"), {
      name: 'Enterprise Deployment',
      duration: '8-12 weeks',
      price: 75000,
      description: 'Complex deployment with custom requirements'
    })])
  }), stryMutAct_9fa48("55719") ? {} : (stryCov_9fa48("55719"), {
    id: 'consulting',
    name: 'Consulting Services',
    icon: '💼',
    description: 'Strategic guidance from our experts',
    services: stryMutAct_9fa48("55724") ? [] : (stryCov_9fa48("55724"), [stryMutAct_9fa48("55725") ? {} : (stryCov_9fa48("55725"), {
      name: 'Data Strategy Workshop',
      duration: '2 days',
      price: 8000,
      description: 'Define your data intelligence roadmap'
    }), stryMutAct_9fa48("55729") ? {} : (stryCov_9fa48("55729"), {
      name: 'Architecture Review',
      duration: '1 week',
      price: 12000,
      description: 'Technical assessment and recommendations'
    }), stryMutAct_9fa48("55733") ? {} : (stryCov_9fa48("55733"), {
      name: 'Executive Advisory',
      duration: 'Ongoing',
      price: 5000,
      unit: '/month',
      description: 'Monthly strategic consultation'
    })])
  }), stryMutAct_9fa48("55738") ? {} : (stryCov_9fa48("55738"), {
    id: 'training',
    name: 'Training & Enablement',
    icon: '🎓',
    description: 'Empower your team to maximize value',
    services: stryMutAct_9fa48("55743") ? [] : (stryCov_9fa48("55743"), [stryMutAct_9fa48("55744") ? {} : (stryCov_9fa48("55744"), {
      name: 'Admin Training',
      duration: '1 day',
      price: 2500,
      description: 'System administration essentials'
    }), stryMutAct_9fa48("55748") ? {} : (stryCov_9fa48("55748"), {
      name: 'Power User Bootcamp',
      duration: '2 days',
      price: 4000,
      description: 'Advanced platform capabilities'
    }), stryMutAct_9fa48("55752") ? {} : (stryCov_9fa48("55752"), {
      name: 'Custom Training Program',
      duration: 'Varies',
      price: 8000,
      description: 'Tailored curriculum for your org'
    })])
  }), stryMutAct_9fa48("55756") ? {} : (stryCov_9fa48("55756"), {
    id: 'development',
    name: 'Custom Development',
    icon: '🔧',
    description: 'Extend the platform for your needs',
    services: stryMutAct_9fa48("55761") ? [] : (stryCov_9fa48("55761"), [stryMutAct_9fa48("55762") ? {} : (stryCov_9fa48("55762"), {
      name: 'Custom Integration',
      duration: '2-4 weeks',
      price: 20000,
      description: 'Build connector for your system'
    }), stryMutAct_9fa48("55766") ? {} : (stryCov_9fa48("55766"), {
      name: 'Custom Agent',
      duration: '4-6 weeks',
      price: 40000,
      description: 'Domain-specific AI agent'
    }), stryMutAct_9fa48("55770") ? {} : (stryCov_9fa48("55770"), {
      name: 'White-Label Solution',
      duration: '8-12 weeks',
      price: 100000,
      description: 'Fully branded deployment'
    })])
  }), stryMutAct_9fa48("55774") ? {} : (stryCov_9fa48("55774"), {
    id: 'support',
    name: 'Support Services',
    icon: '🛟',
    description: 'Get help when you need it',
    services: stryMutAct_9fa48("55779") ? [] : (stryCov_9fa48("55779"), [stryMutAct_9fa48("55780") ? {} : (stryCov_9fa48("55780"), {
      name: 'Standard Support',
      duration: 'Ongoing',
      price: 0,
      description: 'Email support, 48hr response (included)'
    }), stryMutAct_9fa48("55784") ? {} : (stryCov_9fa48("55784"), {
      name: 'Priority Support',
      duration: 'Ongoing',
      price: 2500,
      unit: '/month',
      description: '4hr response, phone support'
    }), stryMutAct_9fa48("55789") ? {} : (stryCov_9fa48("55789"), {
      name: 'Premium Support',
      duration: 'Ongoing',
      price: 5000,
      unit: '/month',
      description: '1hr response, dedicated CSM, 24/7'
    })])
  })]);
  return <div className="min-h-screen bg-neutral-50">
      <PageHeader />
      
      {/* Hero */}
      <section className="bg-white py-16 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Professional Services</h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Expert guidance to maximize your Datacendia investment
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {serviceCategories.map(stryMutAct_9fa48("55794") ? () => undefined : (stryCov_9fa48("55794"), category => <div key={category.id} className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                <div className="p-6 border-b border-neutral-100">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{category.icon}</span>
                    <div>
                      <h2 className="text-xl font-bold text-neutral-900">{category.name}</h2>
                      <p className="text-neutral-500">{category.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    {category.services.map(stryMutAct_9fa48("55795") ? () => undefined : (stryCov_9fa48("55795"), service => <div key={service.name} className="p-4 border border-neutral-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all">
                        <h3 className="font-semibold text-neutral-900">{service.name}</h3>
                        <p className="text-sm text-neutral-500 mt-1">{service.description}</p>
                        <div className="mt-4 flex items-end justify-between">
                          <div>
                            <span className="text-2xl font-bold text-neutral-900">
                              {(stryMutAct_9fa48("55798") ? service.price !== 0 : stryMutAct_9fa48("55797") ? false : stryMutAct_9fa48("55796") ? true : (stryCov_9fa48("55796", "55797", "55798"), service.price === 0)) ? 'Included' : formatCurrency(service.price)}
                            </span>
                            {stryMutAct_9fa48("55802") ? service.unit || <span className="text-neutral-500">{service.unit}</span> : stryMutAct_9fa48("55801") ? false : stryMutAct_9fa48("55800") ? true : (stryCov_9fa48("55800", "55801", "55802"), service.unit && <span className="text-neutral-500">{service.unit}</span>)}
                          </div>
                          <span className="text-sm text-neutral-400">{service.duration}</span>
                        </div>
                      </div>))}
                  </div>
                </div>
              </div>))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need a custom solution?</h2>
          <p className="text-xl text-white/80 mb-8">
            Our team can create a tailored service package for your organization
          </p>
          <button onClick={stryMutAct_9fa48("55803") ? () => undefined : (stryCov_9fa48("55803"), () => navigate('/demo'))} className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-white/90 transition-colors">
            Contact Us
          </button>
        </div>
      </section>
      
      <PageFooter />
    </div>;
};

// =============================================================================
// PACKAGES PAGE
// =============================================================================

export const PackagesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const packages = stryMutAct_9fa48("55806") ? [] : (stryCov_9fa48("55806"), [stryMutAct_9fa48("55807") ? {} : (stryCov_9fa48("55807"), {
    id: 'starter',
    name: 'Starter Bundle',
    price: 50000,
    savings: 8000,
    description: 'Everything you need to get started',
    includes: stryMutAct_9fa48("55811") ? [] : (stryCov_9fa48("55811"), [stryMutAct_9fa48("55812") ? {} : (stryCov_9fa48("55812"), {
      item: 'Foundation Plan (1 year)',
      value: 48000
    }), stryMutAct_9fa48("55814") ? {} : (stryCov_9fa48("55814"), {
      item: 'Quick Start Implementation',
      value: 15000
    }), stryMutAct_9fa48("55816") ? {} : (stryCov_9fa48("55816"), {
      item: 'Admin Training',
      value: 2500
    })]),
    popular: stryMutAct_9fa48("55818") ? true : (stryCov_9fa48("55818"), false)
  }), stryMutAct_9fa48("55819") ? {} : (stryCov_9fa48("55819"), {
    id: 'growth',
    name: 'Growth Bundle',
    price: 125000,
    savings: 25000,
    description: 'For scaling organizations',
    includes: stryMutAct_9fa48("55823") ? [] : (stryCov_9fa48("55823"), [stryMutAct_9fa48("55824") ? {} : (stryCov_9fa48("55824"), {
      item: 'Intelligence Plan (1 year)',
      value: 96000
    }), stryMutAct_9fa48("55826") ? {} : (stryCov_9fa48("55826"), {
      item: 'Standard Implementation',
      value: 35000
    }), stryMutAct_9fa48("55828") ? {} : (stryCov_9fa48("55828"), {
      item: 'Power User Bootcamp',
      value: 4000
    }), stryMutAct_9fa48("55830") ? {} : (stryCov_9fa48("55830"), {
      item: 'Priority Support (1 year)',
      value: 30000
    })]),
    popular: stryMutAct_9fa48("55832") ? false : (stryCov_9fa48("55832"), true)
  }), stryMutAct_9fa48("55833") ? {} : (stryCov_9fa48("55833"), {
    id: 'enterprise',
    name: 'Enterprise Bundle',
    price: 300000,
    savings: 75000,
    description: 'Complete enterprise solution',
    includes: stryMutAct_9fa48("55837") ? [] : (stryCov_9fa48("55837"), [stryMutAct_9fa48("55838") ? {} : (stryCov_9fa48("55838"), {
      item: 'Sovereign Plan (1 year)',
      value: 240000
    }), stryMutAct_9fa48("55840") ? {} : (stryCov_9fa48("55840"), {
      item: 'Enterprise Deployment',
      value: 75000
    }), stryMutAct_9fa48("55842") ? {} : (stryCov_9fa48("55842"), {
      item: 'Custom Training Program',
      value: 8000
    }), stryMutAct_9fa48("55844") ? {} : (stryCov_9fa48("55844"), {
      item: 'Premium Support (1 year)',
      value: 60000
    }), stryMutAct_9fa48("55846") ? {} : (stryCov_9fa48("55846"), {
      item: 'Executive Advisory (1 year)',
      value: 60000
    })]),
    popular: stryMutAct_9fa48("55848") ? true : (stryCov_9fa48("55848"), false)
  })]);
  const industryPackages = stryMutAct_9fa48("55849") ? [] : (stryCov_9fa48("55849"), [stryMutAct_9fa48("55850") ? {} : (stryCov_9fa48("55850"), {
    id: 'finserv',
    name: 'Financial Services',
    icon: '🏦',
    description: 'SOC 2 + SOX compliance, financial modeling agents',
    features: stryMutAct_9fa48("55855") ? [] : (stryCov_9fa48("55855"), ['Regulatory reporting', 'Risk analytics', 'Audit trails'])
  }), stryMutAct_9fa48("55859") ? {} : (stryCov_9fa48("55859"), {
    id: 'healthcare',
    name: 'Healthcare',
    icon: '🏥',
    description: 'HIPAA compliant, clinical data integrations',
    features: stryMutAct_9fa48("55864") ? [] : (stryCov_9fa48("55864"), ['PHI protection', 'Clinical workflows', 'Compliance dashboards'])
  }), stryMutAct_9fa48("55868") ? {} : (stryCov_9fa48("55868"), {
    id: 'manufacturing',
    name: 'Manufacturing',
    icon: '🏭',
    description: 'IoT integrations, supply chain analytics',
    features: stryMutAct_9fa48("55873") ? [] : (stryCov_9fa48("55873"), ['OT/IT integration', 'Supply chain visibility', 'Quality metrics'])
  }), stryMutAct_9fa48("55877") ? {} : (stryCov_9fa48("55877"), {
    id: 'retail',
    name: 'Retail & E-commerce',
    icon: '🛍️',
    description: 'Customer analytics, inventory optimization',
    features: stryMutAct_9fa48("55882") ? [] : (stryCov_9fa48("55882"), ['Omnichannel data', 'Demand forecasting', 'Customer 360'])
  })]);
  return <div className="min-h-screen bg-neutral-50">
      <PageHeader />
      
      {/* Hero */}
      <section className="bg-white py-16 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Solution Packages</h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Pre-configured bundles designed for your success
          </p>
        </div>
      </section>

      {/* Bundle Packages */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">Value Bundles</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {packages.map(stryMutAct_9fa48("55886") ? () => undefined : (stryCov_9fa48("55886"), pkg => <div key={pkg.id} className={cn('relative bg-white rounded-xl border-2 p-6', pkg.popular ? 'border-primary-500 shadow-lg' : 'border-neutral-200')}>
                {stryMutAct_9fa48("55892") ? pkg.popular || <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
                    Most Popular
                  </div> : stryMutAct_9fa48("55891") ? false : stryMutAct_9fa48("55890") ? true : (stryCov_9fa48("55890", "55891", "55892"), pkg.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
                    Most Popular
                  </div>)}
                
                <h3 className="text-xl font-bold text-neutral-900">{pkg.name}</h3>
                <p className="text-sm text-neutral-500 mt-1 mb-4">{pkg.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-neutral-900">
                    {formatCurrency(pkg.price)}
                  </span>
                  <p className="text-sm text-success-main font-medium mt-1">
                    Save {formatCurrency(pkg.savings)} vs. à la carte
                  </p>
                </div>
                
                <div className="space-y-3 mb-6">
                  <p className="text-sm font-medium text-neutral-500 uppercase">Includes:</p>
                  {pkg.includes.map(stryMutAct_9fa48("55893") ? () => undefined : (stryCov_9fa48("55893"), item => <div key={item.item} className="flex items-start gap-2">
                      <span className="text-success-main mt-0.5">✓</span>
                      <div className="flex-1">
                        <p className="text-sm text-neutral-700">{item.item}</p>
                        <p className="text-xs text-neutral-400">Value: {formatCurrency(item.value)}</p>
                      </div>
                    </div>))}
                </div>
                
                <button onClick={stryMutAct_9fa48("55894") ? () => undefined : (stryCov_9fa48("55894"), () => navigate('/demo'))} className={cn('w-full py-3 rounded-lg font-medium transition-colors', pkg.popular ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200')}>
                  Get Started
                </button>
              </div>))}
          </div>
        </div>
      </section>

      {/* Industry Packages */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2 text-center">Industry Solutions</h2>
          <p className="text-neutral-600 text-center mb-8">
            Pre-configured for your industry's specific needs
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industryPackages.map(stryMutAct_9fa48("55899") ? () => undefined : (stryCov_9fa48("55899"), pkg => <div key={pkg.id} className="p-6 border border-neutral-200 rounded-xl hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer">
                <div className="text-4xl mb-4">{pkg.icon}</div>
                <h3 className="text-lg font-bold text-neutral-900">{pkg.name}</h3>
                <p className="text-sm text-neutral-500 mt-1 mb-4">{pkg.description}</p>
                <ul className="space-y-2">
                  {pkg.features.map(stryMutAct_9fa48("55900") ? () => undefined : (stryCov_9fa48("55900"), feature => <li key={feature} className="flex items-center gap-2 text-sm text-neutral-600">
                      <span className="text-primary-600">•</span>
                      {feature}
                    </li>))}
                </ul>
                <button className="mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Learn More →
                </button>
              </div>))}
          </div>
        </div>
      </section>

      {/* Custom Package */}
      <section className="py-16 bg-neutral-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need a Custom Package?</h2>
          <p className="text-xl text-white/70 mb-8">
            We'll work with you to create a solution that fits your exact requirements
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={stryMutAct_9fa48("55901") ? () => undefined : (stryCov_9fa48("55901"), () => navigate('/demo'))} className="px-8 py-4 bg-white text-neutral-900 font-semibold rounded-lg hover:bg-white/90 transition-colors">
              Contact Sales
            </button>
            <button onClick={stryMutAct_9fa48("55903") ? () => undefined : (stryCov_9fa48("55903"), () => navigate('/pricing'))} className="px-8 py-4 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
              View Pricing
            </button>
          </div>
        </div>
      </section>
      
      <PageFooter />
    </div>;
};
export default ServicesPage;