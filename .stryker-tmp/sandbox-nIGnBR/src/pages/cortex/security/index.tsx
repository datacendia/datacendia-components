// @ts-nocheck
// =============================================================================
// DATACENDIA - SECURITY PAGES
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
import { cn, formatRelativeTime } from '../../../../lib/utils';

// =============================================================================
// SECURITY OVERVIEW PAGE
// =============================================================================

export const SecurityOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const securityScore = 85;
  const metrics = stryMutAct_9fa48("50387") ? [] : (stryCov_9fa48("50387"), [stryMutAct_9fa48("50388") ? {} : (stryCov_9fa48("50388"), {
    label: 'Security Score',
    value: `${securityScore}/100`,
    status: 'good'
  }), stryMutAct_9fa48("50392") ? {} : (stryCov_9fa48("50392"), {
    label: 'Active Threats',
    value: '0',
    status: 'good'
  }), stryMutAct_9fa48("50396") ? {} : (stryCov_9fa48("50396"), {
    label: 'Policy Violations',
    value: '3',
    status: 'warning'
  }), stryMutAct_9fa48("50400") ? {} : (stryCov_9fa48("50400"), {
    label: 'Pending Reviews',
    value: '12',
    status: 'info'
  })]);
  const recentEvents = stryMutAct_9fa48("50404") ? [] : (stryCov_9fa48("50404"), [stryMutAct_9fa48("50405") ? {} : (stryCov_9fa48("50405"), {
    id: 1,
    type: 'login',
    user: 'john@acme.com',
    action: 'Successful login',
    location: 'New York, US',
    time: new Date(stryMutAct_9fa48("50410") ? Date.now() + 300000 : (stryCov_9fa48("50410"), Date.now() - 300000))
  }), stryMutAct_9fa48("50411") ? {} : (stryCov_9fa48("50411"), {
    id: 2,
    type: 'access',
    user: 'sarah@acme.com',
    action: 'Accessed sensitive dataset',
    location: 'Chicago, US',
    time: new Date(stryMutAct_9fa48("50416") ? Date.now() + 900000 : (stryCov_9fa48("50416"), Date.now() - 900000))
  }), stryMutAct_9fa48("50417") ? {} : (stryCov_9fa48("50417"), {
    id: 3,
    type: 'policy',
    user: 'mike@acme.com',
    action: 'Policy violation: export attempt',
    location: 'Boston, US',
    time: new Date(stryMutAct_9fa48("50422") ? Date.now() + 1800000 : (stryCov_9fa48("50422"), Date.now() - 1800000)),
    isAlert: stryMutAct_9fa48("50423") ? false : (stryCov_9fa48("50423"), true)
  }), stryMutAct_9fa48("50424") ? {} : (stryCov_9fa48("50424"), {
    id: 4,
    type: 'login',
    user: 'emily@acme.com',
    action: 'Failed login attempt (3x)',
    location: 'Unknown',
    time: new Date(stryMutAct_9fa48("50429") ? Date.now() + 3600000 : (stryCov_9fa48("50429"), Date.now() - 3600000)),
    isAlert: stryMutAct_9fa48("50430") ? false : (stryCov_9fa48("50430"), true)
  })]);
  const complianceStatus = stryMutAct_9fa48("50431") ? [] : (stryCov_9fa48("50431"), [stryMutAct_9fa48("50432") ? {} : (stryCov_9fa48("50432"), {
    framework: 'SOC 2 Type II',
    status: 'compliant',
    lastAudit: 'Oct 15, 2025'
  }), stryMutAct_9fa48("50436") ? {} : (stryCov_9fa48("50436"), {
    framework: 'GDPR',
    status: 'compliant',
    lastAudit: 'Sep 1, 2025'
  }), stryMutAct_9fa48("50440") ? {} : (stryCov_9fa48("50440"), {
    framework: 'HIPAA',
    status: 'in_progress',
    lastAudit: 'Pending'
  }), stryMutAct_9fa48("50444") ? {} : (stryCov_9fa48("50444"), {
    framework: 'ISO 27001',
    status: 'compliant',
    lastAudit: 'Aug 20, 2025'
  })]);
  return <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Security Overview</h1>
          <p className="text-neutral-500">Monitor and manage your security posture</p>
        </div>
        <button onClick={() => {
        const report = stryMutAct_9fa48("50449") ? {} : (stryCov_9fa48("50449"), {
          timestamp: new Date().toISOString(),
          securityScore,
          metrics,
          recentEvents: recentEvents.map(stryMutAct_9fa48("50450") ? () => undefined : (stryCov_9fa48("50450"), e => stryMutAct_9fa48("50451") ? {} : (stryCov_9fa48("50451"), {
            ...e,
            time: e.time.toISOString()
          }))),
          complianceStatus
        });
        const blob = new Blob(stryMutAct_9fa48("50452") ? [] : (stryCov_9fa48("50452"), [JSON.stringify(report, null, 2)]), stryMutAct_9fa48("50453") ? {} : (stryCov_9fa48("50453"), {
          type: 'application/json'
        }));
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `security-report-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }} className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          Security Report
        </button>
      </div>

      {/* Security Score */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <div className="flex items-center gap-8">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="56" fill="none" stroke="#E2E8F0" strokeWidth="12" />
              <circle cx="64" cy="64" r="56" fill="none" stroke={(stryMutAct_9fa48("50461") ? securityScore < 80 : stryMutAct_9fa48("50460") ? securityScore > 80 : stryMutAct_9fa48("50459") ? false : stryMutAct_9fa48("50458") ? true : (stryCov_9fa48("50458", "50459", "50460", "50461"), securityScore >= 80)) ? '#22C55E' : (stryMutAct_9fa48("50466") ? securityScore < 60 : stryMutAct_9fa48("50465") ? securityScore > 60 : stryMutAct_9fa48("50464") ? false : stryMutAct_9fa48("50463") ? true : (stryCov_9fa48("50463", "50464", "50465", "50466"), securityScore >= 60)) ? '#F59E0B' : '#EF4444'} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${stryMutAct_9fa48("50470") ? securityScore / 100 / 352 : (stryCov_9fa48("50470"), (stryMutAct_9fa48("50471") ? securityScore * 100 : (stryCov_9fa48("50471"), securityScore / 100)) * 352)} 352`} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-neutral-900">{securityScore}</span>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-neutral-900 mb-2">Security Score</h2>
            <p className="text-neutral-500 mb-4">Your organization's overall security health</p>
            <div className="grid grid-cols-3 gap-4">
              {stryMutAct_9fa48("50472") ? metrics.map(m => <div key={m.label} className="p-3 bg-neutral-50 rounded-lg">
                  <p className="text-sm text-neutral-500">{m.label}</p>
                  <p className={cn('text-xl font-bold', m.status === 'good' ? 'text-success-main' : m.status === 'warning' ? 'text-warning-main' : 'text-info-main')}>{m.value}</p>
                </div>) : (stryCov_9fa48("50472"), metrics.slice(1).map(stryMutAct_9fa48("50473") ? () => undefined : (stryCov_9fa48("50473"), m => <div key={m.label} className="p-3 bg-neutral-50 rounded-lg">
                  <p className="text-sm text-neutral-500">{m.label}</p>
                  <p className={cn('text-xl font-bold', (stryMutAct_9fa48("50477") ? m.status !== 'good' : stryMutAct_9fa48("50476") ? false : stryMutAct_9fa48("50475") ? true : (stryCov_9fa48("50475", "50476", "50477"), m.status === 'good')) ? 'text-success-main' : (stryMutAct_9fa48("50482") ? m.status !== 'warning' : stryMutAct_9fa48("50481") ? false : stryMutAct_9fa48("50480") ? true : (stryCov_9fa48("50480", "50481", "50482"), m.status === 'warning')) ? 'text-warning-main' : 'text-info-main')}>{m.value}</p>
                </div>)))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Security Events */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Recent Events</h2>
            <a href="/cortex/security/audit" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All →
            </a>
          </div>
          <div className="space-y-3">
            {recentEvents.map(stryMutAct_9fa48("50486") ? () => undefined : (stryCov_9fa48("50486"), event => <div key={event.id} className={cn('p-3 rounded-lg', event.isAlert ? 'bg-warning-light/50' : 'bg-neutral-50')}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-neutral-900">{event.action}</p>
                    <p className="text-sm text-neutral-500">{event.user} • {event.location}</p>
                  </div>
                  <span className="text-xs text-neutral-400">{formatRelativeTime(event.time)}</span>
                </div>
              </div>))}
          </div>
        </div>

        {/* Compliance Status */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Compliance Status</h2>
            <a href="/cortex/security/policies" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Manage →
            </a>
          </div>
          <div className="space-y-3">
            {complianceStatus.map(stryMutAct_9fa48("50490") ? () => undefined : (stryCov_9fa48("50490"), item => <div key={item.framework} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={cn('w-2.5 h-2.5 rounded-full', (stryMutAct_9fa48("50494") ? item.status !== 'compliant' : stryMutAct_9fa48("50493") ? false : stryMutAct_9fa48("50492") ? true : (stryCov_9fa48("50492", "50493", "50494"), item.status === 'compliant')) ? 'bg-success-main' : 'bg-warning-main')} />
                  <span className="font-medium text-neutral-900">{item.framework}</span>
                </div>
                <span className="text-sm text-neutral-500">{item.lastAudit}</span>
              </div>))}
          </div>
        </div>
      </div>
    </div>;
};

// =============================================================================
// ACCESS CONTROL PAGE
// =============================================================================

export const AccessControlPage: React.FC = () => {
  const navigate = useNavigate();
  const [showCreatePolicy, setShowCreatePolicy] = useState(stryMutAct_9fa48("50499") ? true : (stryCov_9fa48("50499"), false));
  const accessPolicies = stryMutAct_9fa48("50500") ? [] : (stryCov_9fa48("50500"), [stryMutAct_9fa48("50501") ? {} : (stryCov_9fa48("50501"), {
    id: 1,
    name: 'Default User Access',
    type: 'Role-based',
    subjects: 'All Users',
    resources: 'Public Dashboards',
    effect: 'Allow'
  }), stryMutAct_9fa48("50507") ? {} : (stryCov_9fa48("50507"), {
    id: 2,
    name: 'Finance Data Access',
    type: 'Attribute-based',
    subjects: 'Finance Team',
    resources: 'Financial Datasets',
    effect: 'Allow'
  }), stryMutAct_9fa48("50513") ? {} : (stryCov_9fa48("50513"), {
    id: 3,
    name: 'PII Data Restriction',
    type: 'Data-based',
    subjects: 'All except HR',
    resources: 'PII Fields',
    effect: 'Deny'
  }), stryMutAct_9fa48("50519") ? {} : (stryCov_9fa48("50519"), {
    id: 4,
    name: 'Admin Full Access',
    type: 'Role-based',
    subjects: 'Admins',
    resources: 'All Resources',
    effect: 'Allow'
  }), stryMutAct_9fa48("50525") ? {} : (stryCov_9fa48("50525"), {
    id: 5,
    name: 'External Contractor',
    type: 'Time-based',
    subjects: 'Contractors',
    resources: 'Project Data',
    effect: 'Allow (9-5 EST)'
  })]);
  const recentRequests = stryMutAct_9fa48("50531") ? [] : (stryCov_9fa48("50531"), [stryMutAct_9fa48("50532") ? {} : (stryCov_9fa48("50532"), {
    id: 1,
    user: 'John Smith',
    resource: 'Financial Reports',
    status: 'pending',
    requestedAt: new Date(stryMutAct_9fa48("50536") ? Date.now() + 3600000 : (stryCov_9fa48("50536"), Date.now() - 3600000))
  }), stryMutAct_9fa48("50537") ? {} : (stryCov_9fa48("50537"), {
    id: 2,
    user: 'Sarah Chen',
    resource: 'Customer PII',
    status: 'approved',
    requestedAt: new Date(stryMutAct_9fa48("50541") ? Date.now() + 86400000 : (stryCov_9fa48("50541"), Date.now() - 86400000))
  }), stryMutAct_9fa48("50542") ? {} : (stryCov_9fa48("50542"), {
    id: 3,
    user: 'Mike Johnson',
    resource: 'Admin Console',
    status: 'denied',
    requestedAt: new Date(stryMutAct_9fa48("50546") ? Date.now() + 172800000 : (stryCov_9fa48("50546"), Date.now() - 172800000))
  })]);
  return <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Access Control</h1>
          <p className="text-neutral-500">Manage access policies and permissions</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          + Create Policy
        </button>
      </div>

      {/* Access Policies */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden mb-6">
        <div className="p-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">Access Policies</h2>
        </div>
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Policy Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Type</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Subjects</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Resources</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Effect</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {accessPolicies.map(stryMutAct_9fa48("50547") ? () => undefined : (stryCov_9fa48("50547"), policy => <tr key={policy.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-4 font-medium text-neutral-900">{policy.name}</td>
                <td className="px-4 py-4 text-neutral-600">{policy.type}</td>
                <td className="px-4 py-4 text-neutral-600">{policy.subjects}</td>
                <td className="px-4 py-4 text-neutral-600">{policy.resources}</td>
                <td className="px-4 py-4">
                  <span className={cn('px-2 py-1 rounded-full text-xs font-medium', policy.effect.includes('Allow') ? 'bg-success-light text-success-dark' : 'bg-error-light text-error-dark')}>
                    {policy.effect}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <button onClick={stryMutAct_9fa48("50552") ? () => undefined : (stryCov_9fa48("50552"), () => alert(`Edit policy: ${policy.name}`))} className="text-neutral-400 hover:text-neutral-600">
                    •••
                  </button>
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>

      {/* Access Requests */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">Recent Access Requests</h2>
          <button onClick={stryMutAct_9fa48("50554") ? () => undefined : (stryCov_9fa48("50554"), () => navigate('/cortex/security/access?tab=requests'))} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="space-y-3">
          {recentRequests.map(stryMutAct_9fa48("50556") ? () => undefined : (stryCov_9fa48("50556"), request => <div key={request.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
              <div>
                <p className="font-medium text-neutral-900">{request.user}</p>
                <p className="text-sm text-neutral-500">Requesting access to {request.resource}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={cn('px-2 py-1 rounded-full text-xs font-medium', stryMutAct_9fa48("50560") ? request.status === 'approved' || 'bg-success-light text-success-dark' : stryMutAct_9fa48("50559") ? false : stryMutAct_9fa48("50558") ? true : (stryCov_9fa48("50558", "50559", "50560"), (stryMutAct_9fa48("50562") ? request.status !== 'approved' : stryMutAct_9fa48("50561") ? true : (stryCov_9fa48("50561", "50562"), request.status === 'approved')) && 'bg-success-light text-success-dark'), stryMutAct_9fa48("50567") ? request.status === 'denied' || 'bg-error-light text-error-dark' : stryMutAct_9fa48("50566") ? false : stryMutAct_9fa48("50565") ? true : (stryCov_9fa48("50565", "50566", "50567"), (stryMutAct_9fa48("50569") ? request.status !== 'denied' : stryMutAct_9fa48("50568") ? true : (stryCov_9fa48("50568", "50569"), request.status === 'denied')) && 'bg-error-light text-error-dark'), stryMutAct_9fa48("50574") ? request.status === 'pending' || 'bg-warning-light text-warning-dark' : stryMutAct_9fa48("50573") ? false : stryMutAct_9fa48("50572") ? true : (stryCov_9fa48("50572", "50573", "50574"), (stryMutAct_9fa48("50576") ? request.status !== 'pending' : stryMutAct_9fa48("50575") ? true : (stryCov_9fa48("50575", "50576"), request.status === 'pending')) && 'bg-warning-light text-warning-dark'))}>
                  {request.status}
                </span>
                {stryMutAct_9fa48("50581") ? request.status === 'pending' || <div className="flex gap-2">
                    <button onClick={() => alert(`Access request for ${request.user} approved!`)} className="px-3 py-1 bg-success-main text-white text-sm rounded-lg hover:bg-success-dark">
                      Approve
                    </button>
                    <button onClick={() => alert(`Access request for ${request.user} denied.`)} className="px-3 py-1 border border-neutral-300 text-neutral-700 text-sm rounded-lg hover:bg-neutral-100">
                      Deny
                    </button>
                  </div> : stryMutAct_9fa48("50580") ? false : stryMutAct_9fa48("50579") ? true : (stryCov_9fa48("50579", "50580", "50581"), (stryMutAct_9fa48("50583") ? request.status !== 'pending' : stryMutAct_9fa48("50582") ? true : (stryCov_9fa48("50582", "50583"), request.status === 'pending')) && <div className="flex gap-2">
                    <button onClick={stryMutAct_9fa48("50585") ? () => undefined : (stryCov_9fa48("50585"), () => alert(`Access request for ${request.user} approved!`))} className="px-3 py-1 bg-success-main text-white text-sm rounded-lg hover:bg-success-dark">
                      Approve
                    </button>
                    <button onClick={stryMutAct_9fa48("50587") ? () => undefined : (stryCov_9fa48("50587"), () => alert(`Access request for ${request.user} denied.`))} className="px-3 py-1 border border-neutral-300 text-neutral-700 text-sm rounded-lg hover:bg-neutral-100">
                      Deny
                    </button>
                  </div>)}
              </div>
            </div>))}
        </div>
      </div>
    </div>;
};

// =============================================================================
// AUDIT LOG PAGE
// =============================================================================

export const AuditLogPage: React.FC = () => {
  const [filters, setFilters] = useState(stryMutAct_9fa48("50590") ? {} : (stryCov_9fa48("50590"), {
    dateRange: '7d',
    eventType: 'all',
    user: ''
  }));
  const auditLogs = stryMutAct_9fa48("50594") ? [] : (stryCov_9fa48("50594"), [stryMutAct_9fa48("50595") ? {} : (stryCov_9fa48("50595"), {
    id: 1,
    timestamp: new Date(stryMutAct_9fa48("50596") ? Date.now() + 60000 : (stryCov_9fa48("50596"), Date.now() - 60000)),
    user: 'john@acme.com',
    action: 'LOGIN',
    resource: '-',
    ip: '192.168.1.1',
    status: 'success'
  }), stryMutAct_9fa48("50602") ? {} : (stryCov_9fa48("50602"), {
    id: 2,
    timestamp: new Date(stryMutAct_9fa48("50603") ? Date.now() + 120000 : (stryCov_9fa48("50603"), Date.now() - 120000)),
    user: 'john@acme.com',
    action: 'VIEW',
    resource: 'Dashboard',
    ip: '192.168.1.1',
    status: 'success'
  }), stryMutAct_9fa48("50609") ? {} : (stryCov_9fa48("50609"), {
    id: 3,
    timestamp: new Date(stryMutAct_9fa48("50610") ? Date.now() + 180000 : (stryCov_9fa48("50610"), Date.now() - 180000)),
    user: 'sarah@acme.com',
    action: 'EXPORT',
    resource: 'customers.csv',
    ip: '192.168.1.2',
    status: 'blocked'
  }), stryMutAct_9fa48("50616") ? {} : (stryCov_9fa48("50616"), {
    id: 4,
    timestamp: new Date(stryMutAct_9fa48("50617") ? Date.now() + 300000 : (stryCov_9fa48("50617"), Date.now() - 300000)),
    user: 'mike@acme.com',
    action: 'UPDATE',
    resource: 'User Settings',
    ip: '192.168.1.3',
    status: 'success'
  }), stryMutAct_9fa48("50623") ? {} : (stryCov_9fa48("50623"), {
    id: 5,
    timestamp: new Date(stryMutAct_9fa48("50624") ? Date.now() + 600000 : (stryCov_9fa48("50624"), Date.now() - 600000)),
    user: 'emily@acme.com',
    action: 'DELETE',
    resource: 'Report #123',
    ip: '192.168.1.4',
    status: 'success'
  }), stryMutAct_9fa48("50630") ? {} : (stryCov_9fa48("50630"), {
    id: 6,
    timestamp: new Date(stryMutAct_9fa48("50631") ? Date.now() + 900000 : (stryCov_9fa48("50631"), Date.now() - 900000)),
    user: 'tom@acme.com',
    action: 'LOGIN',
    resource: '-',
    ip: '10.0.0.1',
    status: 'failed'
  }), stryMutAct_9fa48("50637") ? {} : (stryCov_9fa48("50637"), {
    id: 7,
    timestamp: new Date(stryMutAct_9fa48("50638") ? Date.now() + 1200000 : (stryCov_9fa48("50638"), Date.now() - 1200000)),
    user: 'tom@acme.com',
    action: 'LOGIN',
    resource: '-',
    ip: '10.0.0.1',
    status: 'failed'
  }), stryMutAct_9fa48("50644") ? {} : (stryCov_9fa48("50644"), {
    id: 8,
    timestamp: new Date(stryMutAct_9fa48("50645") ? Date.now() + 1500000 : (stryCov_9fa48("50645"), Date.now() - 1500000)),
    user: 'tom@acme.com',
    action: 'LOGIN',
    resource: '-',
    ip: '10.0.0.1',
    status: 'failed'
  })]);
  return <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Audit Log</h1>
          <p className="text-neutral-500">Complete record of all system activity</p>
        </div>
        <button onClick={() => {
        const logsData = JSON.stringify(auditLogs.map(stryMutAct_9fa48("50652") ? () => undefined : (stryCov_9fa48("50652"), l => stryMutAct_9fa48("50653") ? {} : (stryCov_9fa48("50653"), {
          ...l,
          timestamp: l.timestamp.toISOString()
        }))), null, 2);
        const blob = new Blob(stryMutAct_9fa48("50654") ? [] : (stryCov_9fa48("50654"), [logsData]), stryMutAct_9fa48("50655") ? {} : (stryCov_9fa48("50655"), {
          type: 'application/json'
        }));
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }} className="px-4 py-2 border border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors">
          Export Logs
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <select value={filters.dateRange} onChange={stryMutAct_9fa48("50660") ? () => undefined : (stryCov_9fa48("50660"), e => setFilters(stryMutAct_9fa48("50661") ? {} : (stryCov_9fa48("50661"), {
          ...filters,
          dateRange: e.target.value
        })))} className="h-10 px-3 border border-neutral-300 rounded-lg">
            <option value="1h">Last hour</option>
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="custom">Custom range</option>
          </select>
          <select value={filters.eventType} onChange={stryMutAct_9fa48("50662") ? () => undefined : (stryCov_9fa48("50662"), e => setFilters(stryMutAct_9fa48("50663") ? {} : (stryCov_9fa48("50663"), {
          ...filters,
          eventType: e.target.value
        })))} className="h-10 px-3 border border-neutral-300 rounded-lg">
            <option value="all">All Events</option>
            <option value="login">Login</option>
            <option value="view">View</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="export">Export</option>
          </select>
          <input type="text" placeholder="Filter by user..." value={filters.user} onChange={stryMutAct_9fa48("50664") ? () => undefined : (stryCov_9fa48("50664"), e => setFilters(stryMutAct_9fa48("50665") ? {} : (stryCov_9fa48("50665"), {
          ...filters,
          user: e.target.value
        })))} className="flex-1 min-w-48 h-10 px-3 border border-neutral-300 rounded-lg" />
          <button onClick={stryMutAct_9fa48("50666") ? () => undefined : (stryCov_9fa48("50666"), () => console.log('Filters applied:', filters))} className="h-10 px-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
            Apply Filters
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Timestamp</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">User</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Action</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Resource</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">IP Address</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map(stryMutAct_9fa48("50668") ? () => undefined : (stryCov_9fa48("50668"), log => <tr key={log.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-3 text-sm text-neutral-600">
                  {log.timestamp.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-neutral-900">{log.user}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs font-mono rounded">
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-600">{log.resource}</td>
                <td className="px-4 py-3 text-neutral-500 font-mono text-sm">{log.ip}</td>
                <td className="px-4 py-3">
                  <span className={cn('px-2 py-1 rounded-full text-xs font-medium', stryMutAct_9fa48("50672") ? log.status === 'success' || 'bg-success-light text-success-dark' : stryMutAct_9fa48("50671") ? false : stryMutAct_9fa48("50670") ? true : (stryCov_9fa48("50670", "50671", "50672"), (stryMutAct_9fa48("50674") ? log.status !== 'success' : stryMutAct_9fa48("50673") ? true : (stryCov_9fa48("50673", "50674"), log.status === 'success')) && 'bg-success-light text-success-dark'), stryMutAct_9fa48("50679") ? log.status === 'failed' || 'bg-error-light text-error-dark' : stryMutAct_9fa48("50678") ? false : stryMutAct_9fa48("50677") ? true : (stryCov_9fa48("50677", "50678", "50679"), (stryMutAct_9fa48("50681") ? log.status !== 'failed' : stryMutAct_9fa48("50680") ? true : (stryCov_9fa48("50680", "50681"), log.status === 'failed')) && 'bg-error-light text-error-dark'), stryMutAct_9fa48("50686") ? log.status === 'blocked' || 'bg-warning-light text-warning-dark' : stryMutAct_9fa48("50685") ? false : stryMutAct_9fa48("50684") ? true : (stryCov_9fa48("50684", "50685", "50686"), (stryMutAct_9fa48("50688") ? log.status !== 'blocked' : stryMutAct_9fa48("50687") ? true : (stryCov_9fa48("50687", "50688"), log.status === 'blocked')) && 'bg-warning-light text-warning-dark'))}>
                    {log.status}
                  </span>
                </td>
              </tr>))}
          </tbody>
        </table>
        
        {/* Pagination */}
        <div className="p-4 border-t border-neutral-200 flex items-center justify-between">
          <span className="text-sm text-neutral-500">Showing 1-8 of 1,234 events</span>
          <div className="flex gap-2">
            <button onClick={stryMutAct_9fa48("50691") ? () => undefined : (stryCov_9fa48("50691"), () => console.log('Previous page'))} className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm hover:bg-neutral-50" disabled>
              Previous
            </button>
            <button onClick={stryMutAct_9fa48("50693") ? () => undefined : (stryCov_9fa48("50693"), () => console.log('Next page'))} className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm hover:bg-neutral-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>;
};

// =============================================================================
// SECURITY POLICIES PAGE
// =============================================================================

export const SecurityPoliciesPage: React.FC = () => {
  const [showCreatePolicy, setShowCreatePolicy] = useState(stryMutAct_9fa48("50696") ? true : (stryCov_9fa48("50696"), false));
  const policies = stryMutAct_9fa48("50697") ? [] : (stryCov_9fa48("50697"), [stryMutAct_9fa48("50698") ? {} : (stryCov_9fa48("50698"), {
    id: 1,
    name: 'Password Policy',
    status: 'active',
    description: 'Minimum 12 characters, complexity requirements',
    lastUpdated: 'Nov 1, 2025'
  }), stryMutAct_9fa48("50703") ? {} : (stryCov_9fa48("50703"), {
    id: 2,
    name: 'Session Timeout',
    status: 'active',
    description: 'Auto-logout after 30 minutes of inactivity',
    lastUpdated: 'Oct 15, 2025'
  }), stryMutAct_9fa48("50708") ? {} : (stryCov_9fa48("50708"), {
    id: 3,
    name: 'Data Export Policy',
    status: 'active',
    description: 'Require approval for exports over 1000 records',
    lastUpdated: 'Sep 20, 2025'
  }), stryMutAct_9fa48("50713") ? {} : (stryCov_9fa48("50713"), {
    id: 4,
    name: 'IP Allowlist',
    status: 'draft',
    description: 'Restrict access to corporate IP ranges',
    lastUpdated: 'Nov 20, 2025'
  }), stryMutAct_9fa48("50718") ? {} : (stryCov_9fa48("50718"), {
    id: 5,
    name: 'MFA Enforcement',
    status: 'active',
    description: 'Require MFA for all users',
    lastUpdated: 'Aug 1, 2025'
  })]);
  return <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Security Policies</h1>
          <p className="text-neutral-500">Configure organizational security policies</p>
        </div>
        <button onClick={stryMutAct_9fa48("50723") ? () => undefined : (stryCov_9fa48("50723"), () => setShowCreatePolicy(stryMutAct_9fa48("50724") ? false : (stryCov_9fa48("50724"), true)))} className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          + Create Policy
        </button>
      </div>

      <div className="space-y-4">
        {policies.map(stryMutAct_9fa48("50725") ? () => undefined : (stryCov_9fa48("50725"), policy => <div key={policy.id} className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-neutral-900">{policy.name}</h3>
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', (stryMutAct_9fa48("50729") ? policy.status !== 'active' : stryMutAct_9fa48("50728") ? false : stryMutAct_9fa48("50727") ? true : (stryCov_9fa48("50727", "50728", "50729"), policy.status === 'active')) ? 'bg-success-light text-success-dark' : 'bg-neutral-100 text-neutral-600')}>
                    {policy.status}
                  </span>
                </div>
                <p className="text-neutral-500">{policy.description}</p>
                <p className="text-sm text-neutral-400 mt-2">Last updated: {policy.lastUpdated}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={stryMutAct_9fa48("50733") ? () => undefined : (stryCov_9fa48("50733"), () => alert(`Editing policy: ${policy.name}`))} className="px-3 py-1.5 border border-neutral-300 text-neutral-700 text-sm rounded-lg hover:bg-neutral-50">
                  Edit
                </button>
                {stryMutAct_9fa48("50737") ? policy.status === 'draft' || <button onClick={() => alert(`Policy '${policy.name}' activated!`)} className="px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700">
                    Activate
                  </button> : stryMutAct_9fa48("50736") ? false : stryMutAct_9fa48("50735") ? true : (stryCov_9fa48("50735", "50736", "50737"), (stryMutAct_9fa48("50739") ? policy.status !== 'draft' : stryMutAct_9fa48("50738") ? true : (stryCov_9fa48("50738", "50739"), policy.status === 'draft')) && <button onClick={stryMutAct_9fa48("50741") ? () => undefined : (stryCov_9fa48("50741"), () => alert(`Policy '${policy.name}' activated!`))} className="px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700">
                    Activate
                  </button>)}
              </div>
            </div>
          </div>))}
      </div>
    </div>;
};
export default SecurityOverviewPage;