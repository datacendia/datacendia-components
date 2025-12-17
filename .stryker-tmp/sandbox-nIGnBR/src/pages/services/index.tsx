// @ts-nocheck
// =============================================================================
// DATACENDIA - SERVICES PAGES
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
import { cn, formatCurrency, formatRelativeTime } from '../../../lib/utils';

// =============================================================================
// SERVICES CATALOG PAGE
// =============================================================================

export const ServicesCatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const serviceCategories = stryMutAct_9fa48("56453") ? [] : (stryCov_9fa48("56453"), [stryMutAct_9fa48("56454") ? {} : (stryCov_9fa48("56454"), {
    id: 'implementation',
    name: 'Implementation Services',
    icon: '🚀',
    services: stryMutAct_9fa48("56458") ? [] : (stryCov_9fa48("56458"), [stryMutAct_9fa48("56459") ? {} : (stryCov_9fa48("56459"), {
      id: 'quick-start',
      name: 'Quick Start',
      price: 15000,
      duration: '2 weeks',
      description: 'Basic setup and configuration'
    }), stryMutAct_9fa48("56464") ? {} : (stryCov_9fa48("56464"), {
      id: 'standard-impl',
      name: 'Standard Implementation',
      price: 45000,
      duration: '6 weeks',
      description: 'Full platform deployment with integrations'
    }), stryMutAct_9fa48("56469") ? {} : (stryCov_9fa48("56469"), {
      id: 'enterprise-impl',
      name: 'Enterprise Implementation',
      price: 120000,
      duration: '12 weeks',
      description: 'Complex multi-system deployment'
    })])
  }), stryMutAct_9fa48("56474") ? {} : (stryCov_9fa48("56474"), {
    id: 'consulting',
    name: 'Consulting Services',
    icon: '💼',
    services: stryMutAct_9fa48("56478") ? [] : (stryCov_9fa48("56478"), [stryMutAct_9fa48("56479") ? {} : (stryCov_9fa48("56479"), {
      id: 'data-strategy',
      name: 'Data Strategy Workshop',
      price: 8000,
      duration: '2 days',
      description: 'Define your data roadmap'
    }), stryMutAct_9fa48("56484") ? {} : (stryCov_9fa48("56484"), {
      id: 'architecture-review',
      name: 'Architecture Review',
      price: 12000,
      duration: '1 week',
      description: 'Technical architecture assessment'
    }), stryMutAct_9fa48("56489") ? {} : (stryCov_9fa48("56489"), {
      id: 'governance-design',
      name: 'Governance Design',
      price: 25000,
      duration: '3 weeks',
      description: 'Data governance framework'
    })])
  }), stryMutAct_9fa48("56494") ? {} : (stryCov_9fa48("56494"), {
    id: 'training',
    name: 'Training & Enablement',
    icon: '📚',
    services: stryMutAct_9fa48("56498") ? [] : (stryCov_9fa48("56498"), [stryMutAct_9fa48("56499") ? {} : (stryCov_9fa48("56499"), {
      id: 'admin-training',
      name: 'Administrator Training',
      price: 3000,
      duration: '1 day',
      description: 'Platform administration basics'
    }), stryMutAct_9fa48("56504") ? {} : (stryCov_9fa48("56504"), {
      id: 'analyst-training',
      name: 'Analyst Training',
      price: 2500,
      duration: '1 day',
      description: 'Analytics and reporting'
    }), stryMutAct_9fa48("56509") ? {} : (stryCov_9fa48("56509"), {
      id: 'developer-training',
      name: 'Developer Training',
      price: 5000,
      duration: '2 days',
      description: 'API and integrations'
    })])
  }), stryMutAct_9fa48("56514") ? {} : (stryCov_9fa48("56514"), {
    id: 'custom',
    name: 'Custom Development',
    icon: '🛠️',
    services: stryMutAct_9fa48("56518") ? [] : (stryCov_9fa48("56518"), [stryMutAct_9fa48("56519") ? {} : (stryCov_9fa48("56519"), {
      id: 'custom-agent',
      name: 'Custom Agent Development',
      price: 35000,
      duration: '4 weeks',
      description: 'Build a custom AI agent'
    }), stryMutAct_9fa48("56524") ? {} : (stryCov_9fa48("56524"), {
      id: 'custom-integration',
      name: 'Custom Integration',
      price: 15000,
      duration: '2 weeks',
      description: 'Connect to any system'
    }), stryMutAct_9fa48("56529") ? {} : (stryCov_9fa48("56529"), {
      id: 'custom-workflow',
      name: 'Custom Workflow',
      price: 8000,
      duration: '1 week',
      description: 'Automated business process'
    })])
  }), stryMutAct_9fa48("56534") ? {} : (stryCov_9fa48("56534"), {
    id: 'support',
    name: 'Support Services',
    icon: '🛟',
    services: stryMutAct_9fa48("56538") ? [] : (stryCov_9fa48("56538"), [stryMutAct_9fa48("56539") ? {} : (stryCov_9fa48("56539"), {
      id: 'premium-support',
      name: 'Premium Support',
      price: 4000,
      duration: '/month',
      description: '24/7 priority support'
    }), stryMutAct_9fa48("56544") ? {} : (stryCov_9fa48("56544"), {
      id: 'dedicated-csm',
      name: 'Dedicated CSM',
      price: 6000,
      duration: '/month',
      description: 'Named customer success manager'
    }), stryMutAct_9fa48("56549") ? {} : (stryCov_9fa48("56549"), {
      id: 'health-check',
      name: 'Quarterly Health Check',
      price: 5000,
      duration: '/quarter',
      description: 'Platform optimization review'
    })])
  })]);
  return <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Services Catalog</h1>
          <p className="text-neutral-500">Professional services to accelerate your success</p>
        </div>
        <button onClick={stryMutAct_9fa48("56554") ? () => undefined : (stryCov_9fa48("56554"), () => navigate('/services/request'))} className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          Request Service
        </button>
      </div>

      <div className="space-y-8">
        {serviceCategories.map(stryMutAct_9fa48("56556") ? () => undefined : (stryCov_9fa48("56556"), category => <div key={category.id}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{category.icon}</span>
              <h2 className="text-xl font-semibold text-neutral-900">{category.name}</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              {category.services.map(stryMutAct_9fa48("56557") ? () => undefined : (stryCov_9fa48("56557"), service => <div key={service.id} className="bg-white rounded-xl border border-neutral-200 p-6 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer">
                  <h3 className="font-semibold text-neutral-900 mb-2">{service.name}</h3>
                  <p className="text-sm text-neutral-500 mb-4">{service.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-neutral-900">{formatCurrency(service.price)}</p>
                      <p className="text-xs text-neutral-400">{service.duration}</p>
                    </div>
                    <button className="px-3 py-1.5 text-sm text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>))}
            </div>
          </div>))}
      </div>
    </div>;
};

// =============================================================================
// SERVICE REQUEST PAGE
// =============================================================================

export const ServiceRequestPage: React.FC = () => {
  const [formData, setFormData] = useState(stryMutAct_9fa48("56559") ? {} : (stryCov_9fa48("56559"), {
    serviceType: '',
    urgency: 'normal',
    description: '',
    preferredDate: '',
    additionalNotes: ''
  }));
  const [isSubmitting, setIsSubmitting] = useState(stryMutAct_9fa48("56565") ? true : (stryCov_9fa48("56565"), false));
  const [isSubmitted, setIsSubmitted] = useState(stryMutAct_9fa48("56566") ? true : (stryCov_9fa48("56566"), false));
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(stryMutAct_9fa48("56568") ? false : (stryCov_9fa48("56568"), true));
    await new Promise(stryMutAct_9fa48("56569") ? () => undefined : (stryCov_9fa48("56569"), resolve => setTimeout(resolve, 1500)));
    setIsSubmitted(stryMutAct_9fa48("56570") ? false : (stryCov_9fa48("56570"), true));
  };
  if (stryMutAct_9fa48("56572") ? false : stryMutAct_9fa48("56571") ? true : (stryCov_9fa48("56571", "56572"), isSubmitted)) {
    return <div className="p-6 lg:p-8 max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
          <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">✓</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Request Submitted!</h1>
          <p className="text-neutral-600 mb-6">
            Your service request has been received. Our team will contact you within 24 hours.
          </p>
          <p className="text-sm text-neutral-500 mb-8">Reference: SR-2025-00123</p>
          <a href="/services" className="text-primary-600 hover:text-primary-700 font-medium">
            ← Back to Services
          </a>
        </div>
      </div>;
  }
  return <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">Request a Service</h1>
      <p className="text-neutral-500 mb-8">Tell us about your needs and we'll get back to you shortly</p>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Service Type *</label>
            <select required value={formData.serviceType} onChange={stryMutAct_9fa48("56574") ? () => undefined : (stryCov_9fa48("56574"), e => setFormData(stryMutAct_9fa48("56575") ? {} : (stryCov_9fa48("56575"), {
            ...formData,
            serviceType: e.target.value
          })))} className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500">
              <option value="">Select a service...</option>
              <optgroup label="Implementation">
                <option value="quick-start">Quick Start</option>
                <option value="standard-impl">Standard Implementation</option>
                <option value="enterprise-impl">Enterprise Implementation</option>
              </optgroup>
              <optgroup label="Consulting">
                <option value="data-strategy">Data Strategy Workshop</option>
                <option value="architecture-review">Architecture Review</option>
                <option value="governance-design">Governance Design</option>
              </optgroup>
              <optgroup label="Training">
                <option value="admin-training">Administrator Training</option>
                <option value="analyst-training">Analyst Training</option>
                <option value="developer-training">Developer Training</option>
              </optgroup>
              <optgroup label="Custom Development">
                <option value="custom-agent">Custom Agent Development</option>
                <option value="custom-integration">Custom Integration</option>
                <option value="custom-workflow">Custom Workflow</option>
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Urgency</label>
            <div className="flex gap-4">
              {(stryMutAct_9fa48("56576") ? [] : (stryCov_9fa48("56576"), ['normal', 'high', 'critical'])).map(stryMutAct_9fa48("56580") ? () => undefined : (stryCov_9fa48("56580"), level => <label key={level} className="flex items-center gap-2">
                  <input type="radio" name="urgency" value={level} checked={stryMutAct_9fa48("56583") ? formData.urgency !== level : stryMutAct_9fa48("56582") ? false : stryMutAct_9fa48("56581") ? true : (stryCov_9fa48("56581", "56582", "56583"), formData.urgency === level)} onChange={stryMutAct_9fa48("56584") ? () => undefined : (stryCov_9fa48("56584"), e => setFormData(stryMutAct_9fa48("56585") ? {} : (stryCov_9fa48("56585"), {
                ...formData,
                urgency: e.target.value
              })))} className="text-primary-600" />
                  <span className="capitalize">{level}</span>
                </label>))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Description *</label>
            <textarea required rows={4} value={formData.description} onChange={stryMutAct_9fa48("56586") ? () => undefined : (stryCov_9fa48("56586"), e => setFormData(stryMutAct_9fa48("56587") ? {} : (stryCov_9fa48("56587"), {
            ...formData,
            description: e.target.value
          })))} placeholder="Describe your requirements..." className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Preferred Start Date</label>
            <input type="date" value={formData.preferredDate} onChange={stryMutAct_9fa48("56588") ? () => undefined : (stryCov_9fa48("56588"), e => setFormData(stryMutAct_9fa48("56589") ? {} : (stryCov_9fa48("56589"), {
            ...formData,
            preferredDate: e.target.value
          })))} className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Additional Notes</label>
            <textarea rows={3} value={formData.additionalNotes} onChange={stryMutAct_9fa48("56590") ? () => undefined : (stryCov_9fa48("56590"), e => setFormData(stryMutAct_9fa48("56591") ? {} : (stryCov_9fa48("56591"), {
            ...formData,
            additionalNotes: e.target.value
          })))} placeholder="Any other details..." className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none" />
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50">
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>;
};

// =============================================================================
// MY SERVICE REQUESTS PAGE
// =============================================================================

export const MyServiceRequestsPage: React.FC = () => {
  const requests = stryMutAct_9fa48("56595") ? [] : (stryCov_9fa48("56595"), [stryMutAct_9fa48("56596") ? {} : (stryCov_9fa48("56596"), {
    id: 'SR-2025-00122',
    service: 'Custom Integration',
    status: 'in_progress',
    created: new Date(stryMutAct_9fa48("56600") ? Date.now() + 604800000 : (stryCov_9fa48("56600"), Date.now() - 604800000)),
    assignee: 'John Smith'
  }), stryMutAct_9fa48("56602") ? {} : (stryCov_9fa48("56602"), {
    id: 'SR-2025-00098',
    service: 'Developer Training',
    status: 'scheduled',
    created: new Date(stryMutAct_9fa48("56606") ? Date.now() + 1209600000 : (stryCov_9fa48("56606"), Date.now() - 1209600000)),
    assignee: 'Sarah Chen',
    scheduledDate: 'Dec 15, 2025'
  }), stryMutAct_9fa48("56609") ? {} : (stryCov_9fa48("56609"), {
    id: 'SR-2025-00075',
    service: 'Architecture Review',
    status: 'completed',
    created: new Date(stryMutAct_9fa48("56613") ? Date.now() + 2592000000 : (stryCov_9fa48("56613"), Date.now() - 2592000000)),
    assignee: 'Mike Johnson'
  })]);
  return <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">My Service Requests</h1>
        <a href="/services/request" className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          + New Request
        </a>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Request ID</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Service</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Assignee</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Created</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {requests.map(stryMutAct_9fa48("56615") ? () => undefined : (stryCov_9fa48("56615"), req => <tr key={req.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-4">
                  <code className="text-sm text-primary-600">{req.id}</code>
                </td>
                <td className="px-4 py-4 font-medium text-neutral-900">{req.service}</td>
                <td className="px-4 py-4">
                  <span className={cn('px-2 py-1 rounded-full text-xs font-medium', stryMutAct_9fa48("56619") ? req.status === 'in_progress' || 'bg-warning-light text-warning-dark' : stryMutAct_9fa48("56618") ? false : stryMutAct_9fa48("56617") ? true : (stryCov_9fa48("56617", "56618", "56619"), (stryMutAct_9fa48("56621") ? req.status !== 'in_progress' : stryMutAct_9fa48("56620") ? true : (stryCov_9fa48("56620", "56621"), req.status === 'in_progress')) && 'bg-warning-light text-warning-dark'), stryMutAct_9fa48("56626") ? req.status === 'scheduled' || 'bg-info-light text-info-dark' : stryMutAct_9fa48("56625") ? false : stryMutAct_9fa48("56624") ? true : (stryCov_9fa48("56624", "56625", "56626"), (stryMutAct_9fa48("56628") ? req.status !== 'scheduled' : stryMutAct_9fa48("56627") ? true : (stryCov_9fa48("56627", "56628"), req.status === 'scheduled')) && 'bg-info-light text-info-dark'), stryMutAct_9fa48("56633") ? req.status === 'completed' || 'bg-success-light text-success-dark' : stryMutAct_9fa48("56632") ? false : stryMutAct_9fa48("56631") ? true : (stryCov_9fa48("56631", "56632", "56633"), (stryMutAct_9fa48("56635") ? req.status !== 'completed' : stryMutAct_9fa48("56634") ? true : (stryCov_9fa48("56634", "56635"), req.status === 'completed')) && 'bg-success-light text-success-dark'))}>
                    {req.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-4 text-neutral-600">{req.assignee}</td>
                <td className="px-4 py-4 text-sm text-neutral-500">{formatRelativeTime(req.created)}</td>
                <td className="px-4 py-4 text-right">
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">View</button>
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>
    </div>;
};

// =============================================================================
// SERVICES MANAGEMENT PAGE (Admin)
// =============================================================================

export const ServicesManagementPage: React.FC = () => {
  const allRequests = stryMutAct_9fa48("56641") ? [] : (stryCov_9fa48("56641"), [stryMutAct_9fa48("56642") ? {} : (stryCov_9fa48("56642"), {
    id: 'SR-2025-00123',
    client: 'Acme Corp',
    service: 'Enterprise Implementation',
    status: 'pending',
    priority: 'high',
    created: new Date(stryMutAct_9fa48("56648") ? Date.now() + 3600000 : (stryCov_9fa48("56648"), Date.now() - 3600000))
  }), stryMutAct_9fa48("56649") ? {} : (stryCov_9fa48("56649"), {
    id: 'SR-2025-00122',
    client: 'TechStart',
    service: 'Custom Integration',
    status: 'in_progress',
    priority: 'normal',
    created: new Date(stryMutAct_9fa48("56655") ? Date.now() + 604800000 : (stryCov_9fa48("56655"), Date.now() - 604800000))
  }), stryMutAct_9fa48("56656") ? {} : (stryCov_9fa48("56656"), {
    id: 'SR-2025-00121',
    client: 'GlobalCo',
    service: 'Premium Support',
    status: 'pending',
    priority: 'critical',
    created: new Date(stryMutAct_9fa48("56662") ? Date.now() + 7200000 : (stryCov_9fa48("56662"), Date.now() - 7200000))
  }), stryMutAct_9fa48("56663") ? {} : (stryCov_9fa48("56663"), {
    id: 'SR-2025-00120',
    client: 'FinanceFirst',
    service: 'Data Strategy Workshop',
    status: 'scheduled',
    priority: 'normal',
    created: new Date(stryMutAct_9fa48("56669") ? Date.now() + 172800000 : (stryCov_9fa48("56669"), Date.now() - 172800000))
  })]);
  return <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Services Management</h1>
        <div className="flex gap-2">
          <select className="h-10 px-3 border border-neutral-300 rounded-lg">
            <option>All Status</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Scheduled</option>
            <option>Completed</option>
          </select>
          <select className="h-10 px-3 border border-neutral-300 rounded-lg">
            <option>All Priority</option>
            <option>Critical</option>
            <option>High</option>
            <option>Normal</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {(stryMutAct_9fa48("56670") ? [] : (stryCov_9fa48("56670"), [stryMutAct_9fa48("56671") ? {} : (stryCov_9fa48("56671"), {
        label: 'Pending',
        value: 12,
        color: 'text-warning-main'
      }), stryMutAct_9fa48("56674") ? {} : (stryCov_9fa48("56674"), {
        label: 'In Progress',
        value: 8,
        color: 'text-info-main'
      }), stryMutAct_9fa48("56677") ? {} : (stryCov_9fa48("56677"), {
        label: 'Scheduled',
        value: 5,
        color: 'text-primary-600'
      }), stryMutAct_9fa48("56680") ? {} : (stryCov_9fa48("56680"), {
        label: 'Completed (30d)',
        value: 34,
        color: 'text-success-main'
      })])).map(stryMutAct_9fa48("56683") ? () => undefined : (stryCov_9fa48("56683"), stat => <div key={stat.label} className="bg-white rounded-xl border border-neutral-200 p-4">
            <p className="text-sm text-neutral-500">{stat.label}</p>
            <p className={cn('text-2xl font-bold', stat.color)}>{stat.value}</p>
          </div>))}
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Request</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Client</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Service</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Priority</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Created</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {allRequests.map(stryMutAct_9fa48("56685") ? () => undefined : (stryCov_9fa48("56685"), req => <tr key={req.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-4">
                  <code className="text-sm text-primary-600">{req.id}</code>
                </td>
                <td className="px-4 py-4 font-medium text-neutral-900">{req.client}</td>
                <td className="px-4 py-4 text-neutral-600">{req.service}</td>
                <td className="px-4 py-4">
                  <span className={cn('px-2 py-1 rounded-full text-xs font-medium', stryMutAct_9fa48("56689") ? req.priority === 'critical' || 'bg-error-light text-error-dark' : stryMutAct_9fa48("56688") ? false : stryMutAct_9fa48("56687") ? true : (stryCov_9fa48("56687", "56688", "56689"), (stryMutAct_9fa48("56691") ? req.priority !== 'critical' : stryMutAct_9fa48("56690") ? true : (stryCov_9fa48("56690", "56691"), req.priority === 'critical')) && 'bg-error-light text-error-dark'), stryMutAct_9fa48("56696") ? req.priority === 'high' || 'bg-warning-light text-warning-dark' : stryMutAct_9fa48("56695") ? false : stryMutAct_9fa48("56694") ? true : (stryCov_9fa48("56694", "56695", "56696"), (stryMutAct_9fa48("56698") ? req.priority !== 'high' : stryMutAct_9fa48("56697") ? true : (stryCov_9fa48("56697", "56698"), req.priority === 'high')) && 'bg-warning-light text-warning-dark'), stryMutAct_9fa48("56703") ? req.priority === 'normal' || 'bg-neutral-100 text-neutral-600' : stryMutAct_9fa48("56702") ? false : stryMutAct_9fa48("56701") ? true : (stryCov_9fa48("56701", "56702", "56703"), (stryMutAct_9fa48("56705") ? req.priority !== 'normal' : stryMutAct_9fa48("56704") ? true : (stryCov_9fa48("56704", "56705"), req.priority === 'normal')) && 'bg-neutral-100 text-neutral-600'))}>
                    {req.priority}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={cn('px-2 py-1 rounded-full text-xs font-medium', stryMutAct_9fa48("56711") ? req.status === 'pending' || 'bg-warning-light text-warning-dark' : stryMutAct_9fa48("56710") ? false : stryMutAct_9fa48("56709") ? true : (stryCov_9fa48("56709", "56710", "56711"), (stryMutAct_9fa48("56713") ? req.status !== 'pending' : stryMutAct_9fa48("56712") ? true : (stryCov_9fa48("56712", "56713"), req.status === 'pending')) && 'bg-warning-light text-warning-dark'), stryMutAct_9fa48("56718") ? req.status === 'in_progress' || 'bg-info-light text-info-dark' : stryMutAct_9fa48("56717") ? false : stryMutAct_9fa48("56716") ? true : (stryCov_9fa48("56716", "56717", "56718"), (stryMutAct_9fa48("56720") ? req.status !== 'in_progress' : stryMutAct_9fa48("56719") ? true : (stryCov_9fa48("56719", "56720"), req.status === 'in_progress')) && 'bg-info-light text-info-dark'), stryMutAct_9fa48("56725") ? req.status === 'scheduled' || 'bg-primary-100 text-primary-700' : stryMutAct_9fa48("56724") ? false : stryMutAct_9fa48("56723") ? true : (stryCov_9fa48("56723", "56724", "56725"), (stryMutAct_9fa48("56727") ? req.status !== 'scheduled' : stryMutAct_9fa48("56726") ? true : (stryCov_9fa48("56726", "56727"), req.status === 'scheduled')) && 'bg-primary-100 text-primary-700'))}>
                    {req.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-neutral-500">{formatRelativeTime(req.created)}</td>
                <td className="px-4 py-4 text-right">
                  <button className="text-neutral-400 hover:text-neutral-600">•••</button>
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>
    </div>;
};
export default ServicesCatalogPage;