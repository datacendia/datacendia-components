// @ts-nocheck
// =============================================================================
// DATACENDIA - PULSE SUB-PAGES
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
import { cn, formatRelativeTime } from '../../../../lib/utils';
import { alertsApi, metricsApi } from '../../../lib/api';
import { PageGuide, GUIDES } from '../../../components/PageGuide';

// =============================================================================
// ALERTS PAGE
// =============================================================================

interface Alert {
  id: string;
  severity: string;
  title: string;
  message: string;
  source: string;
  timestamp: Date;
  status: string;
}
const FALLBACK_ALERTS: Alert[] = stryMutAct_9fa48("49742") ? [] : (stryCov_9fa48("49742"), [stryMutAct_9fa48("49743") ? {} : (stryCov_9fa48("49743"), {
  id: 'demo-1',
  severity: 'critical',
  title: 'Database Connection Pool Exhausted',
  message: 'Primary PostgreSQL connection pool at 100% capacity',
  source: 'Database',
  timestamp: new Date(stryMutAct_9fa48("49749") ? Date.now() + 300000 : (stryCov_9fa48("49749"), Date.now() - 300000)),
  status: 'active'
}), stryMutAct_9fa48("49751") ? {} : (stryCov_9fa48("49751"), {
  id: 'demo-2',
  severity: 'critical',
  title: 'Revenue Anomaly Detected',
  message: 'Q4 revenue tracking 25% below forecast',
  source: 'CendiaCFO',
  timestamp: new Date(stryMutAct_9fa48("49757") ? Date.now() + 600000 : (stryCov_9fa48("49757"), Date.now() - 600000)),
  status: 'active'
}), stryMutAct_9fa48("49759") ? {} : (stryCov_9fa48("49759"), {
  id: 'demo-3',
  severity: 'critical',
  title: 'Security Policy Violation',
  message: 'Unauthorized export attempt blocked',
  source: 'Security',
  timestamp: new Date(stryMutAct_9fa48("49765") ? Date.now() + 900000 : (stryCov_9fa48("49765"), Date.now() - 900000)),
  status: 'acknowledged'
}), stryMutAct_9fa48("49767") ? {} : (stryCov_9fa48("49767"), {
  id: 'demo-4',
  severity: 'warning',
  title: 'ML Pipeline Latency High',
  message: 'Forecast model inference time >5s',
  source: 'ML Pipeline',
  timestamp: new Date(stryMutAct_9fa48("49773") ? Date.now() + 1800000 : (stryCov_9fa48("49773"), Date.now() - 1800000)),
  status: 'active'
}), stryMutAct_9fa48("49775") ? {} : (stryCov_9fa48("49775"), {
  id: 'demo-5',
  severity: 'warning',
  title: 'Data Sync Delay',
  message: 'Salesforce sync delayed by 45 minutes',
  source: 'Integrations',
  timestamp: new Date(stryMutAct_9fa48("49781") ? Date.now() + 3600000 : (stryCov_9fa48("49781"), Date.now() - 3600000)),
  status: 'active'
}), stryMutAct_9fa48("49783") ? {} : (stryCov_9fa48("49783"), {
  id: 'demo-6',
  severity: 'warning',
  title: 'License Limit Approaching',
  message: 'Using 45 of 50 user licenses',
  source: 'System',
  timestamp: new Date(stryMutAct_9fa48("49789") ? Date.now() + 7200000 : (stryCov_9fa48("49789"), Date.now() - 7200000)),
  status: 'active'
}), stryMutAct_9fa48("49791") ? {} : (stryCov_9fa48("49791"), {
  id: 'demo-7',
  severity: 'warning',
  title: 'Churn Risk Identified',
  message: 'Customer segment showing increased churn indicators',
  source: 'CendiaCRO',
  timestamp: new Date(stryMutAct_9fa48("49797") ? Date.now() + 14400000 : (stryCov_9fa48("49797"), Date.now() - 14400000)),
  status: 'acknowledged'
}), stryMutAct_9fa48("49799") ? {} : (stryCov_9fa48("49799"), {
  id: 'demo-8',
  severity: 'info',
  title: 'Scheduled Maintenance',
  message: 'System update scheduled for Sunday 2am EST',
  source: 'System',
  timestamp: new Date(stryMutAct_9fa48("49805") ? Date.now() + 28800000 : (stryCov_9fa48("49805"), Date.now() - 28800000)),
  status: 'active'
}), stryMutAct_9fa48("49807") ? {} : (stryCov_9fa48("49807"), {
  id: 'demo-9',
  severity: 'info',
  title: 'New Integration Available',
  message: 'Jira connector now available',
  source: 'Integrations',
  timestamp: new Date(stryMutAct_9fa48("49813") ? Date.now() + 86400000 : (stryCov_9fa48("49813"), Date.now() - 86400000)),
  status: 'resolved'
})]);
export const AlertsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingAlertId, setLoadingAlertId] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>(FALLBACK_ALERTS);
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("49819") ? false : (stryCov_9fa48("49819"), true));

  // Fetch real alerts from API on mount
  React.useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await alertsApi.getAlerts({});
        if (stryMutAct_9fa48("49825") ? response.success && response.data || Array.isArray(response.data) : stryMutAct_9fa48("49824") ? false : stryMutAct_9fa48("49823") ? true : (stryCov_9fa48("49823", "49824", "49825"), (stryMutAct_9fa48("49827") ? response.success || response.data : stryMutAct_9fa48("49826") ? true : (stryCov_9fa48("49826", "49827"), response.success && response.data)) && Array.isArray(response.data))) {
          const mappedAlerts: Alert[] = response.data.map(stryMutAct_9fa48("49829") ? () => undefined : (stryCov_9fa48("49829"), (a: any) => stryMutAct_9fa48("49830") ? {} : (stryCov_9fa48("49830"), {
            id: a.id,
            severity: stryMutAct_9fa48("49831") ? (a.severity || 'info').toUpperCase() : (stryCov_9fa48("49831"), (stryMutAct_9fa48("49834") ? a.severity && 'info' : stryMutAct_9fa48("49833") ? false : stryMutAct_9fa48("49832") ? true : (stryCov_9fa48("49832", "49833", "49834"), a.severity || 'info')).toLowerCase()),
            title: a.title,
            message: stryMutAct_9fa48("49838") ? (a.message || a.description) && '' : stryMutAct_9fa48("49837") ? false : stryMutAct_9fa48("49836") ? true : (stryCov_9fa48("49836", "49837", "49838"), (stryMutAct_9fa48("49840") ? a.message && a.description : stryMutAct_9fa48("49839") ? false : (stryCov_9fa48("49839", "49840"), a.message || a.description)) || ''),
            source: stryMutAct_9fa48("49844") ? a.source && 'System' : stryMutAct_9fa48("49843") ? false : stryMutAct_9fa48("49842") ? true : (stryCov_9fa48("49842", "49843", "49844"), a.source || 'System'),
            timestamp: new Date(stryMutAct_9fa48("49848") ? (a.created_at || a.timestamp) && Date.now() : stryMutAct_9fa48("49847") ? false : stryMutAct_9fa48("49846") ? true : (stryCov_9fa48("49846", "49847", "49848"), (stryMutAct_9fa48("49850") ? a.created_at && a.timestamp : stryMutAct_9fa48("49849") ? false : (stryCov_9fa48("49849", "49850"), a.created_at || a.timestamp)) || Date.now())),
            status: stryMutAct_9fa48("49851") ? (a.status || 'active').toUpperCase() : (stryCov_9fa48("49851"), (stryMutAct_9fa48("49854") ? a.status && 'active' : stryMutAct_9fa48("49853") ? false : stryMutAct_9fa48("49852") ? true : (stryCov_9fa48("49852", "49853", "49854"), a.status || 'active')).toLowerCase())
          })));
          if (stryMutAct_9fa48("49859") ? mappedAlerts.length <= 0 : stryMutAct_9fa48("49858") ? mappedAlerts.length >= 0 : stryMutAct_9fa48("49857") ? false : stryMutAct_9fa48("49856") ? true : (stryCov_9fa48("49856", "49857", "49858", "49859"), mappedAlerts.length > 0)) {
            setAlerts(mappedAlerts);
          }
        }
      } catch (err) {
        console.log('Using fallback alerts (API unavailable)');
      } finally {
        setIsLoading(stryMutAct_9fa48("49864") ? true : (stryCov_9fa48("49864"), false));
      }
    };
    fetchAlerts();
  }, stryMutAct_9fa48("49865") ? ["Stryker was here"] : (stryCov_9fa48("49865"), []));
  const filteredAlerts = stryMutAct_9fa48("49866") ? alerts : (stryCov_9fa48("49866"), alerts.filter((a: Alert) => {
    if (stryMutAct_9fa48("49870") ? filter !== 'all' || a.severity !== filter : stryMutAct_9fa48("49869") ? false : stryMutAct_9fa48("49868") ? true : (stryCov_9fa48("49868", "49869", "49870"), (stryMutAct_9fa48("49872") ? filter === 'all' : stryMutAct_9fa48("49871") ? true : (stryCov_9fa48("49871", "49872"), filter !== 'all')) && (stryMutAct_9fa48("49875") ? a.severity === filter : stryMutAct_9fa48("49874") ? true : (stryCov_9fa48("49874", "49875"), a.severity !== filter)))) {
      return stryMutAct_9fa48("49877") ? true : (stryCov_9fa48("49877"), false);
    }
    if (stryMutAct_9fa48("49880") ? statusFilter !== 'all' || a.status !== statusFilter : stryMutAct_9fa48("49879") ? false : stryMutAct_9fa48("49878") ? true : (stryCov_9fa48("49878", "49879", "49880"), (stryMutAct_9fa48("49882") ? statusFilter === 'all' : stryMutAct_9fa48("49881") ? true : (stryCov_9fa48("49881", "49882"), statusFilter !== 'all')) && (stryMutAct_9fa48("49885") ? a.status === statusFilter : stryMutAct_9fa48("49884") ? true : (stryCov_9fa48("49884", "49885"), a.status !== statusFilter)))) {
      return stryMutAct_9fa48("49887") ? true : (stryCov_9fa48("49887"), false);
    }
    if (stryMutAct_9fa48("49890") ? searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase()) && !a.message.toLowerCase().includes(searchQuery.toLowerCase()) || !a.source.toLowerCase().includes(searchQuery.toLowerCase()) : stryMutAct_9fa48("49889") ? false : stryMutAct_9fa48("49888") ? true : (stryCov_9fa48("49888", "49889", "49890"), (stryMutAct_9fa48("49892") ? searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase()) || !a.message.toLowerCase().includes(searchQuery.toLowerCase()) : stryMutAct_9fa48("49891") ? true : (stryCov_9fa48("49891", "49892"), (stryMutAct_9fa48("49894") ? searchQuery || !a.title.toLowerCase().includes(searchQuery.toLowerCase()) : stryMutAct_9fa48("49893") ? true : (stryCov_9fa48("49893", "49894"), searchQuery && (stryMutAct_9fa48("49895") ? a.title.toLowerCase().includes(searchQuery.toLowerCase()) : (stryCov_9fa48("49895"), !(stryMutAct_9fa48("49896") ? a.title.toUpperCase().includes(searchQuery.toLowerCase()) : (stryCov_9fa48("49896"), a.title.toLowerCase().includes(stryMutAct_9fa48("49897") ? searchQuery.toUpperCase() : (stryCov_9fa48("49897"), searchQuery.toLowerCase())))))))) && (stryMutAct_9fa48("49898") ? a.message.toLowerCase().includes(searchQuery.toLowerCase()) : (stryCov_9fa48("49898"), !(stryMutAct_9fa48("49899") ? a.message.toUpperCase().includes(searchQuery.toLowerCase()) : (stryCov_9fa48("49899"), a.message.toLowerCase().includes(stryMutAct_9fa48("49900") ? searchQuery.toUpperCase() : (stryCov_9fa48("49900"), searchQuery.toLowerCase())))))))) && (stryMutAct_9fa48("49901") ? a.source.toLowerCase().includes(searchQuery.toLowerCase()) : (stryCov_9fa48("49901"), !(stryMutAct_9fa48("49902") ? a.source.toUpperCase().includes(searchQuery.toLowerCase()) : (stryCov_9fa48("49902"), a.source.toLowerCase().includes(stryMutAct_9fa48("49903") ? searchQuery.toUpperCase() : (stryCov_9fa48("49903"), searchQuery.toLowerCase())))))))) {
      return stryMutAct_9fa48("49905") ? true : (stryCov_9fa48("49905"), false);
    }
    return stryMutAct_9fa48("49906") ? false : (stryCov_9fa48("49906"), true);
  }));
  const severityCounts = stryMutAct_9fa48("49907") ? {} : (stryCov_9fa48("49907"), {
    critical: stryMutAct_9fa48("49908") ? alerts.length : (stryCov_9fa48("49908"), alerts.filter(stryMutAct_9fa48("49909") ? () => undefined : (stryCov_9fa48("49909"), a => stryMutAct_9fa48("49912") ? a.severity !== 'critical' : stryMutAct_9fa48("49911") ? false : stryMutAct_9fa48("49910") ? true : (stryCov_9fa48("49910", "49911", "49912"), a.severity === 'critical'))).length),
    warning: stryMutAct_9fa48("49914") ? alerts.length : (stryCov_9fa48("49914"), alerts.filter(stryMutAct_9fa48("49915") ? () => undefined : (stryCov_9fa48("49915"), a => stryMutAct_9fa48("49918") ? a.severity !== 'warning' : stryMutAct_9fa48("49917") ? false : stryMutAct_9fa48("49916") ? true : (stryCov_9fa48("49916", "49917", "49918"), a.severity === 'warning'))).length),
    info: stryMutAct_9fa48("49920") ? alerts.length : (stryCov_9fa48("49920"), alerts.filter(stryMutAct_9fa48("49921") ? () => undefined : (stryCov_9fa48("49921"), a => stryMutAct_9fa48("49924") ? a.severity !== 'info' : stryMutAct_9fa48("49923") ? false : stryMutAct_9fa48("49922") ? true : (stryCov_9fa48("49922", "49923", "49924"), a.severity === 'info'))).length)
  });
  return <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Alerts</h1>
          <p className="text-neutral-500">Monitor and manage system alerts</p>
        </div>
        <button onClick={() => {
        const ruleName = prompt('Enter alert rule name:');
        if (stryMutAct_9fa48("49929") ? false : stryMutAct_9fa48("49928") ? true : (stryCov_9fa48("49928", "49929"), ruleName)) {
          alert(`Alert rule "${ruleName}" created successfully!\n\nThis would configure automatic alerting based on your criteria.`);
        }
      }} className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          + Create Alert Rule
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div onClick={stryMutAct_9fa48("49932") ? () => undefined : (stryCov_9fa48("49932"), () => setFilter('all'))} className={cn('p-4 rounded-xl border cursor-pointer transition-all', (stryMutAct_9fa48("49937") ? filter !== 'all' : stryMutAct_9fa48("49936") ? false : stryMutAct_9fa48("49935") ? true : (stryCov_9fa48("49935", "49936", "49937"), filter === 'all')) ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 bg-white hover:border-neutral-300')}>
          <p className="text-sm text-neutral-500">Total Active</p>
          <p className="text-2xl font-bold text-neutral-900">{stryMutAct_9fa48("49941") ? alerts.length : (stryCov_9fa48("49941"), alerts.filter(stryMutAct_9fa48("49942") ? () => undefined : (stryCov_9fa48("49942"), a => stryMutAct_9fa48("49945") ? a.status !== 'active' : stryMutAct_9fa48("49944") ? false : stryMutAct_9fa48("49943") ? true : (stryCov_9fa48("49943", "49944", "49945"), a.status === 'active'))).length)}</p>
        </div>
        <div onClick={stryMutAct_9fa48("49947") ? () => undefined : (stryCov_9fa48("49947"), () => setFilter('critical'))} className={cn('p-4 rounded-xl border cursor-pointer transition-all', (stryMutAct_9fa48("49952") ? filter !== 'critical' : stryMutAct_9fa48("49951") ? false : stryMutAct_9fa48("49950") ? true : (stryCov_9fa48("49950", "49951", "49952"), filter === 'critical')) ? 'border-error-main bg-error-light' : 'border-neutral-200 bg-white hover:border-neutral-300')}>
          <p className="text-sm text-neutral-500">Critical</p>
          <p className="text-2xl font-bold text-error-main">{severityCounts.critical}</p>
        </div>
        <div onClick={stryMutAct_9fa48("49956") ? () => undefined : (stryCov_9fa48("49956"), () => setFilter('warning'))} className={cn('p-4 rounded-xl border cursor-pointer transition-all', (stryMutAct_9fa48("49961") ? filter !== 'warning' : stryMutAct_9fa48("49960") ? false : stryMutAct_9fa48("49959") ? true : (stryCov_9fa48("49959", "49960", "49961"), filter === 'warning')) ? 'border-warning-main bg-warning-light' : 'border-neutral-200 bg-white hover:border-neutral-300')}>
          <p className="text-sm text-neutral-500">Warning</p>
          <p className="text-2xl font-bold text-warning-main">{severityCounts.warning}</p>
        </div>
        <div onClick={stryMutAct_9fa48("49965") ? () => undefined : (stryCov_9fa48("49965"), () => setFilter('info'))} className={cn('p-4 rounded-xl border cursor-pointer transition-all', (stryMutAct_9fa48("49970") ? filter !== 'info' : stryMutAct_9fa48("49969") ? false : stryMutAct_9fa48("49968") ? true : (stryCov_9fa48("49968", "49969", "49970"), filter === 'info')) ? 'border-info-main bg-info-light' : 'border-neutral-200 bg-white hover:border-neutral-300')}>
          <p className="text-sm text-neutral-500">Info</p>
          <p className="text-2xl font-bold text-info-main">{severityCounts.info}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          {(['all', 'active', 'acknowledged', 'resolved'] as const).map(stryMutAct_9fa48("49974") ? () => undefined : (stryCov_9fa48("49974"), status => <button key={status} onClick={stryMutAct_9fa48("49975") ? () => undefined : (stryCov_9fa48("49975"), () => setStatusFilter(status))} className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize', (stryMutAct_9fa48("49979") ? statusFilter !== status : stryMutAct_9fa48("49978") ? false : stryMutAct_9fa48("49977") ? true : (stryCov_9fa48("49977", "49978", "49979"), statusFilter === status)) ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100')}>
              {status}
            </button>))}
        </div>
        <input type="text" placeholder="Search alerts..." value={searchQuery} onChange={stryMutAct_9fa48("49982") ? () => undefined : (stryCov_9fa48("49982"), e => setSearchQuery(e.target.value))} className="ml-auto w-64 h-9 px-3 border border-neutral-300 rounded-lg text-sm" />
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {filteredAlerts.map(stryMutAct_9fa48("49983") ? () => undefined : (stryCov_9fa48("49983"), alert => <div key={alert.id} className={cn('bg-white rounded-xl border-l-4 p-4', stryMutAct_9fa48("49987") ? alert.severity === 'critical' || 'border-l-error-main border border-neutral-200' : stryMutAct_9fa48("49986") ? false : stryMutAct_9fa48("49985") ? true : (stryCov_9fa48("49985", "49986", "49987"), (stryMutAct_9fa48("49989") ? alert.severity !== 'critical' : stryMutAct_9fa48("49988") ? true : (stryCov_9fa48("49988", "49989"), alert.severity === 'critical')) && 'border-l-error-main border border-neutral-200'), stryMutAct_9fa48("49994") ? alert.severity === 'warning' || 'border-l-warning-main border border-neutral-200' : stryMutAct_9fa48("49993") ? false : stryMutAct_9fa48("49992") ? true : (stryCov_9fa48("49992", "49993", "49994"), (stryMutAct_9fa48("49996") ? alert.severity !== 'warning' : stryMutAct_9fa48("49995") ? true : (stryCov_9fa48("49995", "49996"), alert.severity === 'warning')) && 'border-l-warning-main border border-neutral-200'), stryMutAct_9fa48("50001") ? alert.severity === 'info' || 'border-l-info-main border border-neutral-200' : stryMutAct_9fa48("50000") ? false : stryMutAct_9fa48("49999") ? true : (stryCov_9fa48("49999", "50000", "50001"), (stryMutAct_9fa48("50003") ? alert.severity !== 'info' : stryMutAct_9fa48("50002") ? true : (stryCov_9fa48("50002", "50003"), alert.severity === 'info')) && 'border-l-info-main border border-neutral-200'))}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <span className={cn('mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0', stryMutAct_9fa48("50009") ? alert.severity === 'critical' || 'bg-error-main' : stryMutAct_9fa48("50008") ? false : stryMutAct_9fa48("50007") ? true : (stryCov_9fa48("50007", "50008", "50009"), (stryMutAct_9fa48("50011") ? alert.severity !== 'critical' : stryMutAct_9fa48("50010") ? true : (stryCov_9fa48("50010", "50011"), alert.severity === 'critical')) && 'bg-error-main'), stryMutAct_9fa48("50016") ? alert.severity === 'warning' || 'bg-warning-main' : stryMutAct_9fa48("50015") ? false : stryMutAct_9fa48("50014") ? true : (stryCov_9fa48("50014", "50015", "50016"), (stryMutAct_9fa48("50018") ? alert.severity !== 'warning' : stryMutAct_9fa48("50017") ? true : (stryCov_9fa48("50017", "50018"), alert.severity === 'warning')) && 'bg-warning-main'), stryMutAct_9fa48("50023") ? alert.severity === 'info' || 'bg-info-main' : stryMutAct_9fa48("50022") ? false : stryMutAct_9fa48("50021") ? true : (stryCov_9fa48("50021", "50022", "50023"), (stryMutAct_9fa48("50025") ? alert.severity !== 'info' : stryMutAct_9fa48("50024") ? true : (stryCov_9fa48("50024", "50025"), alert.severity === 'info')) && 'bg-info-main'))} />
                <div>
                  <h3 className="font-semibold text-neutral-900">{alert.title}</h3>
                  <p className="text-neutral-600 mt-1">{alert.message}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-neutral-500">{alert.source}</span>
                    <span className="text-sm text-neutral-400">{formatRelativeTime(alert.timestamp)}</span>
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium capitalize', stryMutAct_9fa48("50031") ? alert.status === 'active' || 'bg-error-light text-error-dark' : stryMutAct_9fa48("50030") ? false : stryMutAct_9fa48("50029") ? true : (stryCov_9fa48("50029", "50030", "50031"), (stryMutAct_9fa48("50033") ? alert.status !== 'active' : stryMutAct_9fa48("50032") ? true : (stryCov_9fa48("50032", "50033"), alert.status === 'active')) && 'bg-error-light text-error-dark'), stryMutAct_9fa48("50038") ? alert.status === 'acknowledged' || 'bg-warning-light text-warning-dark' : stryMutAct_9fa48("50037") ? false : stryMutAct_9fa48("50036") ? true : (stryCov_9fa48("50036", "50037", "50038"), (stryMutAct_9fa48("50040") ? alert.status !== 'acknowledged' : stryMutAct_9fa48("50039") ? true : (stryCov_9fa48("50039", "50040"), alert.status === 'acknowledged')) && 'bg-warning-light text-warning-dark'), stryMutAct_9fa48("50045") ? alert.status === 'resolved' || 'bg-success-light text-success-dark' : stryMutAct_9fa48("50044") ? false : stryMutAct_9fa48("50043") ? true : (stryCov_9fa48("50043", "50044", "50045"), (stryMutAct_9fa48("50047") ? alert.status !== 'resolved' : stryMutAct_9fa48("50046") ? true : (stryCov_9fa48("50046", "50047"), alert.status === 'resolved')) && 'bg-success-light text-success-dark'))}>
                      {alert.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {stryMutAct_9fa48("50052") ? alert.status === 'active' || <button onClick={async e => {
              e.stopPropagation();
              setLoadingAlertId(alert.id);
              try {
                await alertsApi.acknowledgeAlert(alert.id);
                setAlerts(prev => prev.map(a => a.id === alert.id ? {
                  ...a,
                  status: 'acknowledged'
                } : a));
              } catch (err) {
                console.error('Acknowledge failed:', err);
                // Update state for demo even on API error
                setAlerts(prev => prev.map(a => a.id === alert.id ? {
                  ...a,
                  status: 'acknowledged'
                } : a));
              } finally {
                setLoadingAlertId(null);
              }
            }} disabled={loadingAlertId === alert.id} className="px-3 py-1.5 border border-neutral-300 text-neutral-700 text-sm rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loadingAlertId === alert.id ? 'Acknowledging...' : 'Acknowledge'}
                  </button> : stryMutAct_9fa48("50051") ? false : stryMutAct_9fa48("50050") ? true : (stryCov_9fa48("50050", "50051", "50052"), (stryMutAct_9fa48("50054") ? alert.status !== 'active' : stryMutAct_9fa48("50053") ? true : (stryCov_9fa48("50053", "50054"), alert.status === 'active')) && <button onClick={async e => {
              e.stopPropagation();
              setLoadingAlertId(alert.id);
              try {
                await alertsApi.acknowledgeAlert(alert.id);
                setAlerts(stryMutAct_9fa48("50058") ? () => undefined : (stryCov_9fa48("50058"), prev => prev.map(stryMutAct_9fa48("50059") ? () => undefined : (stryCov_9fa48("50059"), a => (stryMutAct_9fa48("50062") ? a.id !== alert.id : stryMutAct_9fa48("50061") ? false : stryMutAct_9fa48("50060") ? true : (stryCov_9fa48("50060", "50061", "50062"), a.id === alert.id)) ? stryMutAct_9fa48("50063") ? {} : (stryCov_9fa48("50063"), {
                  ...a,
                  status: 'acknowledged'
                }) : a))));
              } catch (err) {
                console.error('Acknowledge failed:', err);
                // Update state for demo even on API error
                setAlerts(stryMutAct_9fa48("50067") ? () => undefined : (stryCov_9fa48("50067"), prev => prev.map(stryMutAct_9fa48("50068") ? () => undefined : (stryCov_9fa48("50068"), a => (stryMutAct_9fa48("50071") ? a.id !== alert.id : stryMutAct_9fa48("50070") ? false : stryMutAct_9fa48("50069") ? true : (stryCov_9fa48("50069", "50070", "50071"), a.id === alert.id)) ? stryMutAct_9fa48("50072") ? {} : (stryCov_9fa48("50072"), {
                  ...a,
                  status: 'acknowledged'
                }) : a))));
              } finally {
                setLoadingAlertId(null);
              }
            }} disabled={stryMutAct_9fa48("50077") ? loadingAlertId !== alert.id : stryMutAct_9fa48("50076") ? false : stryMutAct_9fa48("50075") ? true : (stryCov_9fa48("50075", "50076", "50077"), loadingAlertId === alert.id)} className="px-3 py-1.5 border border-neutral-300 text-neutral-700 text-sm rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    {(stryMutAct_9fa48("50080") ? loadingAlertId !== alert.id : stryMutAct_9fa48("50079") ? false : stryMutAct_9fa48("50078") ? true : (stryCov_9fa48("50078", "50079", "50080"), loadingAlertId === alert.id)) ? 'Acknowledging...' : 'Acknowledge'}
                  </button>)}
                {stryMutAct_9fa48("50085") ? alert.status !== 'resolved' || <button onClick={async e => {
              e.stopPropagation();
              setLoadingAlertId(alert.id);
              try {
                await alertsApi.resolveAlert(alert.id, {
                  resolution: 'Resolved via dashboard'
                });
                setAlerts(prev => prev.map(a => a.id === alert.id ? {
                  ...a,
                  status: 'resolved'
                } : a));
              } catch (err) {
                console.error('Resolve failed:', err);
                // Update state for demo even on API error
                setAlerts(prev => prev.map(a => a.id === alert.id ? {
                  ...a,
                  status: 'resolved'
                } : a));
              } finally {
                setLoadingAlertId(null);
              }
            }} disabled={loadingAlertId === alert.id} className="px-3 py-1.5 bg-success-main text-white text-sm rounded-lg hover:bg-success-dark disabled:opacity-50 disabled:cursor-not-allowed">
                    {loadingAlertId === alert.id ? 'Resolving...' : 'Resolve'}
                  </button> : stryMutAct_9fa48("50084") ? false : stryMutAct_9fa48("50083") ? true : (stryCov_9fa48("50083", "50084", "50085"), (stryMutAct_9fa48("50087") ? alert.status === 'resolved' : stryMutAct_9fa48("50086") ? true : (stryCov_9fa48("50086", "50087"), alert.status !== 'resolved')) && <button onClick={async e => {
              e.stopPropagation();
              setLoadingAlertId(alert.id);
              try {
                await alertsApi.resolveAlert(alert.id, stryMutAct_9fa48("50091") ? {} : (stryCov_9fa48("50091"), {
                  resolution: 'Resolved via dashboard'
                }));
                setAlerts(stryMutAct_9fa48("50093") ? () => undefined : (stryCov_9fa48("50093"), prev => prev.map(stryMutAct_9fa48("50094") ? () => undefined : (stryCov_9fa48("50094"), a => (stryMutAct_9fa48("50097") ? a.id !== alert.id : stryMutAct_9fa48("50096") ? false : stryMutAct_9fa48("50095") ? true : (stryCov_9fa48("50095", "50096", "50097"), a.id === alert.id)) ? stryMutAct_9fa48("50098") ? {} : (stryCov_9fa48("50098"), {
                  ...a,
                  status: 'resolved'
                }) : a))));
              } catch (err) {
                console.error('Resolve failed:', err);
                // Update state for demo even on API error
                setAlerts(stryMutAct_9fa48("50102") ? () => undefined : (stryCov_9fa48("50102"), prev => prev.map(stryMutAct_9fa48("50103") ? () => undefined : (stryCov_9fa48("50103"), a => (stryMutAct_9fa48("50106") ? a.id !== alert.id : stryMutAct_9fa48("50105") ? false : stryMutAct_9fa48("50104") ? true : (stryCov_9fa48("50104", "50105", "50106"), a.id === alert.id)) ? stryMutAct_9fa48("50107") ? {} : (stryCov_9fa48("50107"), {
                  ...a,
                  status: 'resolved'
                }) : a))));
              } finally {
                setLoadingAlertId(null);
              }
            }} disabled={stryMutAct_9fa48("50112") ? loadingAlertId !== alert.id : stryMutAct_9fa48("50111") ? false : stryMutAct_9fa48("50110") ? true : (stryCov_9fa48("50110", "50111", "50112"), loadingAlertId === alert.id)} className="px-3 py-1.5 bg-success-main text-white text-sm rounded-lg hover:bg-success-dark disabled:opacity-50 disabled:cursor-not-allowed">
                    {(stryMutAct_9fa48("50115") ? loadingAlertId !== alert.id : stryMutAct_9fa48("50114") ? false : stryMutAct_9fa48("50113") ? true : (stryCov_9fa48("50113", "50114", "50115"), loadingAlertId === alert.id)) ? 'Resolving...' : 'Resolve'}
                  </button>)}
              </div>
            </div>
          </div>))}
      </div>
      
      {/* Page Guide */}
      <PageGuide {...GUIDES.alerts} />
    </div>;
};

// =============================================================================
// METRICS PAGE
// =============================================================================

interface Metric {
  id: string;
  name: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  category: string;
  target: string;
  progress: number;
}
const FALLBACK_METRICS: Metric[] = stryMutAct_9fa48("50118") ? [] : (stryCov_9fa48("50118"), [stryMutAct_9fa48("50119") ? {} : (stryCov_9fa48("50119"), {
  id: '1',
  name: 'Monthly Recurring Revenue',
  value: '$1.24M',
  change: 12.5,
  trend: 'up',
  category: 'financial',
  target: '$1.5M',
  progress: 82
}), stryMutAct_9fa48("50126") ? {} : (stryCov_9fa48("50126"), {
  id: '2',
  name: 'Annual Recurring Revenue',
  value: '$14.88M',
  change: 8.2,
  trend: 'up',
  category: 'financial',
  target: '$18M',
  progress: 82
}), stryMutAct_9fa48("50133") ? {} : (stryCov_9fa48("50133"), {
  id: '3',
  name: 'Customer Acquisition Cost',
  value: '$2,450',
  change: stryMutAct_9fa48("50137") ? +5.3 : (stryCov_9fa48("50137"), -5.3),
  trend: 'down',
  category: 'financial',
  target: '$2,000',
  progress: 78
}), stryMutAct_9fa48("50141") ? {} : (stryCov_9fa48("50141"), {
  id: '4',
  name: 'Customer Lifetime Value',
  value: '$45,000',
  change: 3.2,
  trend: 'up',
  category: 'financial',
  target: '$50,000',
  progress: 90
}), stryMutAct_9fa48("50148") ? {} : (stryCov_9fa48("50148"), {
  id: '5',
  name: 'Net Promoter Score',
  value: '72',
  change: 5,
  trend: 'up',
  category: 'customer',
  target: '80',
  progress: 90
}), stryMutAct_9fa48("50155") ? {} : (stryCov_9fa48("50155"), {
  id: '6',
  name: 'Customer Churn Rate',
  value: '2.1%',
  change: stryMutAct_9fa48("50159") ? +0.3 : (stryCov_9fa48("50159"), -0.3),
  trend: 'down',
  category: 'customer',
  target: '< 2%',
  progress: 95
}), stryMutAct_9fa48("50163") ? {} : (stryCov_9fa48("50163"), {
  id: '7',
  name: 'Active Users (DAU)',
  value: '8,450',
  change: 15.2,
  trend: 'up',
  category: 'customer',
  target: '10,000',
  progress: 84
}), stryMutAct_9fa48("50170") ? {} : (stryCov_9fa48("50170"), {
  id: '8',
  name: 'API Uptime',
  value: '99.98%',
  change: 0.02,
  trend: 'up',
  category: 'operational',
  target: '99.9%',
  progress: 100
}), stryMutAct_9fa48("50177") ? {} : (stryCov_9fa48("50177"), {
  id: '9',
  name: 'Avg Response Time',
  value: '124ms',
  change: stryMutAct_9fa48("50181") ? +8.5 : (stryCov_9fa48("50181"), -8.5),
  trend: 'down',
  category: 'operational',
  target: '< 200ms',
  progress: 100
}), stryMutAct_9fa48("50185") ? {} : (stryCov_9fa48("50185"), {
  id: '10',
  name: 'Data Pipeline Health',
  value: '94%',
  change: 2,
  trend: 'up',
  category: 'operational',
  target: '95%',
  progress: 98
})]);
const formatMetricValue = (value: number, unit: string): string => {
  if (stryMutAct_9fa48("50195") ? unit !== 'USD' : stryMutAct_9fa48("50194") ? false : stryMutAct_9fa48("50193") ? true : (stryCov_9fa48("50193", "50194", "50195"), unit === 'USD')) {
    if (stryMutAct_9fa48("50201") ? value < 1000000 : stryMutAct_9fa48("50200") ? value > 1000000 : stryMutAct_9fa48("50199") ? false : stryMutAct_9fa48("50198") ? true : (stryCov_9fa48("50198", "50199", "50200", "50201"), value >= 1000000)) return `$${(stryMutAct_9fa48("50203") ? value * 1000000 : (stryCov_9fa48("50203"), value / 1000000)).toFixed(2)}M`;
    if (stryMutAct_9fa48("50207") ? value < 1000 : stryMutAct_9fa48("50206") ? value > 1000 : stryMutAct_9fa48("50205") ? false : stryMutAct_9fa48("50204") ? true : (stryCov_9fa48("50204", "50205", "50206", "50207"), value >= 1000)) return `$${(stryMutAct_9fa48("50209") ? value * 1000 : (stryCov_9fa48("50209"), value / 1000)).toFixed(1)}K`;
    return `$${value.toLocaleString()}`;
  }
  if (stryMutAct_9fa48("50213") ? unit !== 'percent' : stryMutAct_9fa48("50212") ? false : stryMutAct_9fa48("50211") ? true : (stryCov_9fa48("50211", "50212", "50213"), unit === 'percent')) return `${value}%`;
  if (stryMutAct_9fa48("50218") ? unit !== 'ms' : stryMutAct_9fa48("50217") ? false : stryMutAct_9fa48("50216") ? true : (stryCov_9fa48("50216", "50217", "50218"), unit === 'ms')) return `${value}ms`;
  if (stryMutAct_9fa48("50223") ? unit !== 'count' : stryMutAct_9fa48("50222") ? false : stryMutAct_9fa48("50221") ? true : (stryCov_9fa48("50221", "50222", "50223"), unit === 'count')) return value.toLocaleString();
  return String(value);
};
export const MetricsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [category, setCategory] = useState<'all' | 'financial' | 'operational' | 'customer'>('all');
  const [metrics, setMetrics] = useState<Metric[]>(FALLBACK_METRICS);
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("50228") ? false : (stryCov_9fa48("50228"), true));
  React.useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await metricsApi.getMetrics({});
        if (stryMutAct_9fa48("50234") ? response.success && response.data || Array.isArray(response.data) : stryMutAct_9fa48("50233") ? false : stryMutAct_9fa48("50232") ? true : (stryCov_9fa48("50232", "50233", "50234"), (stryMutAct_9fa48("50236") ? response.success || response.data : stryMutAct_9fa48("50235") ? true : (stryCov_9fa48("50235", "50236"), response.success && response.data)) && Array.isArray(response.data))) {
          const mappedMetrics: Metric[] = response.data.map((m: any) => {
            const currentValue = stryMutAct_9fa48("50241") ? (m.currentValue || m.latestValue) && 0 : stryMutAct_9fa48("50240") ? false : stryMutAct_9fa48("50239") ? true : (stryCov_9fa48("50239", "50240", "50241"), (stryMutAct_9fa48("50243") ? m.currentValue && m.latestValue : stryMutAct_9fa48("50242") ? false : (stryCov_9fa48("50242", "50243"), m.currentValue || m.latestValue)) || 0);
            const target = stryMutAct_9fa48("50246") ? m.thresholds?.target && currentValue * 1.2 : stryMutAct_9fa48("50245") ? false : stryMutAct_9fa48("50244") ? true : (stryCov_9fa48("50244", "50245", "50246"), (stryMutAct_9fa48("50247") ? m.thresholds.target : (stryCov_9fa48("50247"), m.thresholds?.target)) || (stryMutAct_9fa48("50248") ? currentValue / 1.2 : (stryCov_9fa48("50248"), currentValue * 1.2)));
            const change = stryMutAct_9fa48("50251") ? (m.change || m.dimensions?.change) && 0 : stryMutAct_9fa48("50250") ? false : stryMutAct_9fa48("50249") ? true : (stryCov_9fa48("50249", "50250", "50251"), (stryMutAct_9fa48("50253") ? m.change && m.dimensions?.change : stryMutAct_9fa48("50252") ? false : (stryCov_9fa48("50252", "50253"), m.change || (stryMutAct_9fa48("50254") ? m.dimensions.change : (stryCov_9fa48("50254"), m.dimensions?.change)))) || 0);
            const progress = (stryMutAct_9fa48("50258") ? target <= 0 : stryMutAct_9fa48("50257") ? target >= 0 : stryMutAct_9fa48("50256") ? false : stryMutAct_9fa48("50255") ? true : (stryCov_9fa48("50255", "50256", "50257", "50258"), target > 0)) ? Math.round(stryMutAct_9fa48("50259") ? currentValue / target / 100 : (stryCov_9fa48("50259"), (stryMutAct_9fa48("50260") ? currentValue * target : (stryCov_9fa48("50260"), currentValue / target)) * 100)) : 0;
            return stryMutAct_9fa48("50261") ? {} : (stryCov_9fa48("50261"), {
              id: m.id,
              name: m.name,
              value: formatMetricValue(currentValue, stryMutAct_9fa48("50264") ? m.unit && '' : stryMutAct_9fa48("50263") ? false : stryMutAct_9fa48("50262") ? true : (stryCov_9fa48("50262", "50263", "50264"), m.unit || '')),
              change,
              trend: (stryMutAct_9fa48("50269") ? change < 0 : stryMutAct_9fa48("50268") ? change > 0 : stryMutAct_9fa48("50267") ? false : stryMutAct_9fa48("50266") ? true : (stryCov_9fa48("50266", "50267", "50268", "50269"), change >= 0)) ? 'up' as const : 'down' as const,
              category: stryMutAct_9fa48("50272") ? m.category && 'operational' : stryMutAct_9fa48("50271") ? false : stryMutAct_9fa48("50270") ? true : (stryCov_9fa48("50270", "50271", "50272"), m.category || 'operational'),
              target: formatMetricValue(target, stryMutAct_9fa48("50276") ? m.unit && '' : stryMutAct_9fa48("50275") ? false : stryMutAct_9fa48("50274") ? true : (stryCov_9fa48("50274", "50275", "50276"), m.unit || '')),
              progress: stryMutAct_9fa48("50278") ? Math.max(progress, 100) : (stryCov_9fa48("50278"), Math.min(progress, 100))
            });
          });
          if (stryMutAct_9fa48("50282") ? mappedMetrics.length <= 0 : stryMutAct_9fa48("50281") ? mappedMetrics.length >= 0 : stryMutAct_9fa48("50280") ? false : stryMutAct_9fa48("50279") ? true : (stryCov_9fa48("50279", "50280", "50281", "50282"), mappedMetrics.length > 0)) {
            setMetrics(mappedMetrics);
          }
        }
      } catch (err) {
        console.log('Using fallback metrics (API unavailable)');
      } finally {
        setIsLoading(stryMutAct_9fa48("50287") ? true : (stryCov_9fa48("50287"), false));
      }
    };
    fetchMetrics();
  }, stryMutAct_9fa48("50288") ? ["Stryker was here"] : (stryCov_9fa48("50288"), []));
  const filteredMetrics = (stryMutAct_9fa48("50291") ? category !== 'all' : stryMutAct_9fa48("50290") ? false : stryMutAct_9fa48("50289") ? true : (stryCov_9fa48("50289", "50290", "50291"), category === 'all')) ? metrics : stryMutAct_9fa48("50293") ? metrics : (stryCov_9fa48("50293"), metrics.filter(stryMutAct_9fa48("50294") ? () => undefined : (stryCov_9fa48("50294"), m => stryMutAct_9fa48("50297") ? m.category !== category : stryMutAct_9fa48("50296") ? false : stryMutAct_9fa48("50295") ? true : (stryCov_9fa48("50295", "50296", "50297"), m.category === category))));
  return <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Metrics</h1>
          <p className="text-neutral-500">Key performance indicators and business metrics</p>
        </div>
        <button onClick={() => {
        const metricName = prompt('Enter metric name:');
        if (stryMutAct_9fa48("50301") ? false : stryMutAct_9fa48("50300") ? true : (stryCov_9fa48("50300", "50301"), metricName)) {
          alert(`Metric "${metricName}" would be created. Configure data source in Settings.`);
        }
      }} className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          + Add Metric
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {(['all', 'financial', 'operational', 'customer'] as const).map(stryMutAct_9fa48("50304") ? () => undefined : (stryCov_9fa48("50304"), cat => <button key={cat} onClick={stryMutAct_9fa48("50305") ? () => undefined : (stryCov_9fa48("50305"), () => setCategory(cat))} className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize', (stryMutAct_9fa48("50309") ? category !== cat : stryMutAct_9fa48("50308") ? false : stryMutAct_9fa48("50307") ? true : (stryCov_9fa48("50307", "50308", "50309"), category === cat)) ? 'bg-primary-100 text-primary-700' : 'text-neutral-600 hover:bg-neutral-100')}>
              {cat}
            </button>))}
        </div>
        <div className="flex items-center gap-2">
          {(['1h', '24h', '7d', '30d'] as const).map(stryMutAct_9fa48("50312") ? () => undefined : (stryCov_9fa48("50312"), range => <button key={range} onClick={stryMutAct_9fa48("50313") ? () => undefined : (stryCov_9fa48("50313"), () => setTimeRange(range))} className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors', (stryMutAct_9fa48("50317") ? timeRange !== range : stryMutAct_9fa48("50316") ? false : stryMutAct_9fa48("50315") ? true : (stryCov_9fa48("50315", "50316", "50317"), timeRange === range)) ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100')}>
              {range}
            </button>))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMetrics.map(stryMutAct_9fa48("50320") ? () => undefined : (stryCov_9fa48("50320"), metric => <div key={metric.id} className="bg-white rounded-xl border border-neutral-200 p-5 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-medium text-neutral-900">{metric.name}</h3>
                <span className={cn('text-xs px-2 py-0.5 rounded-full capitalize', stryMutAct_9fa48("50324") ? metric.category === 'financial' || 'bg-green-100 text-green-700' : stryMutAct_9fa48("50323") ? false : stryMutAct_9fa48("50322") ? true : (stryCov_9fa48("50322", "50323", "50324"), (stryMutAct_9fa48("50326") ? metric.category !== 'financial' : stryMutAct_9fa48("50325") ? true : (stryCov_9fa48("50325", "50326"), metric.category === 'financial')) && 'bg-green-100 text-green-700'), stryMutAct_9fa48("50331") ? metric.category === 'operational' || 'bg-blue-100 text-blue-700' : stryMutAct_9fa48("50330") ? false : stryMutAct_9fa48("50329") ? true : (stryCov_9fa48("50329", "50330", "50331"), (stryMutAct_9fa48("50333") ? metric.category !== 'operational' : stryMutAct_9fa48("50332") ? true : (stryCov_9fa48("50332", "50333"), metric.category === 'operational')) && 'bg-blue-100 text-blue-700'), stryMutAct_9fa48("50338") ? metric.category === 'customer' || 'bg-purple-100 text-purple-700' : stryMutAct_9fa48("50337") ? false : stryMutAct_9fa48("50336") ? true : (stryCov_9fa48("50336", "50337", "50338"), (stryMutAct_9fa48("50340") ? metric.category !== 'customer' : stryMutAct_9fa48("50339") ? true : (stryCov_9fa48("50339", "50340"), metric.category === 'customer')) && 'bg-purple-100 text-purple-700'))}>
                  {metric.category}
                </span>
              </div>
              <span className={cn('flex items-center text-sm font-medium', (stryMutAct_9fa48("50346") ? metric.trend === 'up' || metric.change > 0 : stryMutAct_9fa48("50345") ? false : stryMutAct_9fa48("50344") ? true : (stryCov_9fa48("50344", "50345", "50346"), (stryMutAct_9fa48("50348") ? metric.trend !== 'up' : stryMutAct_9fa48("50347") ? true : (stryCov_9fa48("50347", "50348"), metric.trend === 'up')) && (stryMutAct_9fa48("50352") ? metric.change <= 0 : stryMutAct_9fa48("50351") ? metric.change >= 0 : stryMutAct_9fa48("50350") ? true : (stryCov_9fa48("50350", "50351", "50352"), metric.change > 0)))) ? 'text-success-main' : (stryMutAct_9fa48("50356") ? metric.trend === 'down' || metric.change < 0 : stryMutAct_9fa48("50355") ? false : stryMutAct_9fa48("50354") ? true : (stryCov_9fa48("50354", "50355", "50356"), (stryMutAct_9fa48("50358") ? metric.trend !== 'down' : stryMutAct_9fa48("50357") ? true : (stryCov_9fa48("50357", "50358"), metric.trend === 'down')) && (stryMutAct_9fa48("50362") ? metric.change >= 0 : stryMutAct_9fa48("50361") ? metric.change <= 0 : stryMutAct_9fa48("50360") ? true : (stryCov_9fa48("50360", "50361", "50362"), metric.change < 0)))) ? 'text-success-main' : 'text-error-main')}>
                {(stryMutAct_9fa48("50368") ? metric.change <= 0 : stryMutAct_9fa48("50367") ? metric.change >= 0 : stryMutAct_9fa48("50366") ? false : stryMutAct_9fa48("50365") ? true : (stryCov_9fa48("50365", "50366", "50367", "50368"), metric.change > 0)) ? '↑' : '↓'} {Math.abs(metric.change)}%
              </span>
            </div>
            
            <p className="text-3xl font-bold text-neutral-900 mb-4">{metric.value}</p>
            
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-neutral-500">Target: {metric.target}</span>
                <span className="font-medium text-neutral-900">{metric.progress}%</span>
              </div>
              <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div className={cn('h-full rounded-full', (stryMutAct_9fa48("50375") ? metric.progress < 90 : stryMutAct_9fa48("50374") ? metric.progress > 90 : stryMutAct_9fa48("50373") ? false : stryMutAct_9fa48("50372") ? true : (stryCov_9fa48("50372", "50373", "50374", "50375"), metric.progress >= 90)) ? 'bg-success-main' : (stryMutAct_9fa48("50380") ? metric.progress < 70 : stryMutAct_9fa48("50379") ? metric.progress > 70 : stryMutAct_9fa48("50378") ? false : stryMutAct_9fa48("50377") ? true : (stryCov_9fa48("50377", "50378", "50379", "50380"), metric.progress >= 70)) ? 'bg-warning-main' : 'bg-error-main')} style={stryMutAct_9fa48("50383") ? {} : (stryCov_9fa48("50383"), {
              width: `${stryMutAct_9fa48("50385") ? Math.max(metric.progress, 100) : (stryCov_9fa48("50385"), Math.min(metric.progress, 100))}%`
            })} />
              </div>
            </div>
          </div>))}
      </div>
      
      {/* Page Guide */}
      <PageGuide {...GUIDES.metrics} />
    </div>;
};
export default AlertsPage;