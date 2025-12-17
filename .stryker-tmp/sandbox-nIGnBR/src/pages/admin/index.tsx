// @ts-nocheck
// =============================================================================
// DATACENDIA - ADMIN CONSOLE PAGES
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
import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { cn, formatNumber, formatCurrency, formatRelativeTime } from '../../../lib/utils';
import { LogoSimple } from '../../components/brand/Logo';
import { adminService, type PlatformDashboard, type Tenant, type License, type HealthDashboard } from '../../services/AdminService';

// =============================================================================
// ADMIN LAYOUT
// =============================================================================

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const adminNav = stryMutAct_9fa48("17668") ? [] : (stryCov_9fa48("17668"), [stryMutAct_9fa48("17669") ? {} : (stryCov_9fa48("17669"), {
    id: 'dashboard',
    label: 'Dashboard',
    icon: '📊',
    path: '/admin'
  }), stryMutAct_9fa48("17674") ? {} : (stryCov_9fa48("17674"), {
    id: 'sovereign-stack',
    label: 'Sovereign Stack',
    icon: '🖥️',
    path: '/admin/sovereign-stack'
  }), stryMutAct_9fa48("17679") ? {} : (stryCov_9fa48("17679"), {
    id: 'control-center',
    label: 'Control Center',
    icon: '🎛️',
    path: '/admin/control-center'
  }), stryMutAct_9fa48("17684") ? {} : (stryCov_9fa48("17684"), {
    id: 'ai',
    label: 'Admin AI',
    icon: '🤖',
    path: '/admin/ai'
  }), stryMutAct_9fa48("17689") ? {} : (stryCov_9fa48("17689"), {
    id: 'tenants',
    label: 'Tenants',
    icon: '🏢',
    path: '/admin/tenants'
  }), stryMutAct_9fa48("17694") ? {} : (stryCov_9fa48("17694"), {
    id: 'data-sources',
    label: 'Data Sources',
    icon: '🗄️',
    path: '/admin/data-sources'
  }), stryMutAct_9fa48("17699") ? {} : (stryCov_9fa48("17699"), {
    id: 'mode-analytics',
    label: 'Council Analytics',
    icon: '🎯',
    path: '/admin/mode-analytics'
  }), stryMutAct_9fa48("17704") ? {} : (stryCov_9fa48("17704"), {
    id: 'rd-lab',
    label: 'R&D Lab',
    icon: '🔬',
    path: '/admin/rd-lab'
  }), stryMutAct_9fa48("17709") ? {} : (stryCov_9fa48("17709"), {
    id: 'core',
    label: 'Datacendia Core',
    icon: '👑',
    path: '/admin/core'
  }), stryMutAct_9fa48("17714") ? {} : (stryCov_9fa48("17714"), {
    id: 'licenses',
    label: 'Licenses',
    icon: '📜',
    path: '/admin/licenses'
  }), stryMutAct_9fa48("17719") ? {} : (stryCov_9fa48("17719"), {
    id: 'usage',
    label: 'Usage Analytics',
    icon: '📈',
    path: '/admin/usage'
  }), stryMutAct_9fa48("17724") ? {} : (stryCov_9fa48("17724"), {
    id: 'health',
    label: 'System Health',
    icon: '💓',
    path: '/admin/health'
  }), stryMutAct_9fa48("17729") ? {} : (stryCov_9fa48("17729"), {
    id: 'features',
    label: 'Feature Flags',
    icon: '🚩',
    path: '/admin/features'
  })]);
  return <div className="min-h-screen bg-neutral-900">
      {/* Admin Header */}
      <header className="h-16 bg-neutral-800 border-b border-neutral-700 flex items-center px-6">
        <div className="flex items-center gap-3">
          <LogoSimple size={32} />
          <span className="text-white font-semibold">Datacendia Admin</span>
          <span className="px-2 py-0.5 bg-warning-main/20 text-warning-main text-xs rounded-full">Admin Console</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <a href="/cortex" className="text-neutral-400 hover:text-white text-sm">← Back to Cortex</a>
          <div className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">A</span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-neutral-800 min-h-[calc(100vh-64px)] p-4">
          <nav className="space-y-1">
            {adminNav.map(stryMutAct_9fa48("17734") ? () => undefined : (stryCov_9fa48("17734"), item => <button key={item.id} onClick={stryMutAct_9fa48("17735") ? () => undefined : (stryCov_9fa48("17735"), () => navigate(item.path))} className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left', (stryMutAct_9fa48("17739") ? location.pathname !== item.path : stryMutAct_9fa48("17738") ? false : stryMutAct_9fa48("17737") ? true : (stryCov_9fa48("17737", "17738", "17739"), location.pathname === item.path)) ? 'bg-primary-600 text-white' : 'text-neutral-400 hover:bg-neutral-700 hover:text-white')}>
                <span>{item.icon}</span>
                {item.label}
              </button>))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>;
};

// =============================================================================
// ADMIN DASHBOARD
// =============================================================================

export const AdminDashboardPage: React.FC = () => {
  const [dashboard, setDashboard] = useState<PlatformDashboard | null>(null);
  const [loading, setLoading] = useState(stryMutAct_9fa48("17743") ? false : (stryCov_9fa48("17743"), true));
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(stryMutAct_9fa48("17747") ? false : (stryCov_9fa48("17747"), true));
        const data = await adminService.getDashboard();
        setDashboard(data);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard. Using cached data.');
        // Fallback to demo data
        setDashboard(stryMutAct_9fa48("17750") ? {} : (stryCov_9fa48("17750"), {
          tenants: stryMutAct_9fa48("17751") ? {} : (stryCov_9fa48("17751"), {
            total: 127,
            active: 98,
            trial: 12,
            churned: 17
          }),
          revenue: stryMutAct_9fa48("17752") ? {} : (stryCov_9fa48("17752"), {
            mrr: 842000,
            arr: 10104000,
            avgPerTenant: 8590
          }),
          licenses: stryMutAct_9fa48("17753") ? {} : (stryCov_9fa48("17753"), {
            total: 127,
            active: 110,
            expiring: 5,
            revenueAtRisk: 75000
          }),
          system: stryMutAct_9fa48("17754") ? {} : (stryCov_9fa48("17754"), {
            status: 'healthy',
            apiRequests24h: 12500000,
            avgLatency: 45,
            errorRate: 0.8
          }),
          users: stryMutAct_9fa48("17756") ? {} : (stryCov_9fa48("17756"), {
            total: 3482
          }),
          recentActivity: stryMutAct_9fa48("17757") ? [] : (stryCov_9fa48("17757"), [stryMutAct_9fa48("17758") ? {} : (stryCov_9fa48("17758"), {
            event: 'New tenant created',
            tenant: 'HealthTech Labs',
            time: new Date(stryMutAct_9fa48("17761") ? Date.now() + 1800000 : (stryCov_9fa48("17761"), Date.now() - 1800000)).toISOString()
          }), stryMutAct_9fa48("17762") ? {} : (stryCov_9fa48("17762"), {
            event: 'License upgraded',
            tenant: 'TechStart Inc',
            time: new Date(stryMutAct_9fa48("17765") ? Date.now() + 3600000 : (stryCov_9fa48("17765"), Date.now() - 3600000)).toISOString()
          }), stryMutAct_9fa48("17766") ? {} : (stryCov_9fa48("17766"), {
            event: 'User limit warning',
            tenant: 'GlobalCo',
            time: new Date(stryMutAct_9fa48("17769") ? Date.now() + 7200000 : (stryCov_9fa48("17769"), Date.now() - 7200000)).toISOString(),
            isAlert: stryMutAct_9fa48("17770") ? false : (stryCov_9fa48("17770"), true)
          }), stryMutAct_9fa48("17771") ? {} : (stryCov_9fa48("17771"), {
            event: 'SSO configured',
            tenant: 'FinanceFirst',
            time: new Date(stryMutAct_9fa48("17774") ? Date.now() + 14400000 : (stryCov_9fa48("17774"), Date.now() - 14400000)).toISOString()
          })]),
          lastUpdated: new Date().toISOString()
        }));
      } finally {
        setLoading(stryMutAct_9fa48("17776") ? true : (stryCov_9fa48("17776"), false));
      }
    };
    loadDashboard();
    // Refresh every 30 seconds
    const interval = setInterval(loadDashboard, 30000);
    return stryMutAct_9fa48("17777") ? () => undefined : (stryCov_9fa48("17777"), () => clearInterval(interval));
  }, stryMutAct_9fa48("17778") ? ["Stryker was here"] : (stryCov_9fa48("17778"), []));
  const stats = dashboard ? stryMutAct_9fa48("17779") ? [] : (stryCov_9fa48("17779"), [stryMutAct_9fa48("17780") ? {} : (stryCov_9fa48("17780"), {
    label: 'Total Tenants',
    value: dashboard.tenants.total,
    change: stryMutAct_9fa48("17782") ? -5 : (stryCov_9fa48("17782"), +5),
    color: 'text-primary-400'
  }), stryMutAct_9fa48("17784") ? {} : (stryCov_9fa48("17784"), {
    label: 'Active Users',
    value: dashboard.users.total,
    change: stryMutAct_9fa48("17786") ? -142 : (stryCov_9fa48("17786"), +142),
    color: 'text-success-main'
  }), stryMutAct_9fa48("17788") ? {} : (stryCov_9fa48("17788"), {
    label: 'MRR',
    value: dashboard.revenue.mrr,
    isCurrency: stryMutAct_9fa48("17790") ? false : (stryCov_9fa48("17790"), true),
    change: stryMutAct_9fa48("17791") ? -8.5 : (stryCov_9fa48("17791"), +8.5),
    isPercent: stryMutAct_9fa48("17792") ? false : (stryCov_9fa48("17792"), true),
    color: 'text-success-main'
  }), stryMutAct_9fa48("17794") ? {} : (stryCov_9fa48("17794"), {
    label: 'API Calls (24h)',
    value: dashboard.system.apiRequests24h,
    change: stryMutAct_9fa48("17796") ? -12 : (stryCov_9fa48("17796"), +12),
    isPercent: stryMutAct_9fa48("17797") ? false : (stryCov_9fa48("17797"), true),
    color: 'text-info-main'
  })]) : stryMutAct_9fa48("17799") ? ["Stryker was here"] : (stryCov_9fa48("17799"), []);
  const recentActivity = stryMutAct_9fa48("17802") ? dashboard?.recentActivity.map(a => ({
    event: a.event,
    tenant: a.tenant,
    time: new Date(a.time),
    isAlert: a.isAlert
  })) && [] : stryMutAct_9fa48("17801") ? false : stryMutAct_9fa48("17800") ? true : (stryCov_9fa48("17800", "17801", "17802"), (stryMutAct_9fa48("17803") ? dashboard.recentActivity.map(a => ({
    event: a.event,
    tenant: a.tenant,
    time: new Date(a.time),
    isAlert: a.isAlert
  })) : (stryCov_9fa48("17803"), dashboard?.recentActivity.map(stryMutAct_9fa48("17804") ? () => undefined : (stryCov_9fa48("17804"), a => stryMutAct_9fa48("17805") ? {} : (stryCov_9fa48("17805"), {
    event: a.event,
    tenant: a.tenant,
    time: new Date(a.time),
    isAlert: a.isAlert
  }))))) || (stryMutAct_9fa48("17806") ? ["Stryker was here"] : (stryCov_9fa48("17806"), [])));
  if (stryMutAct_9fa48("17809") ? loading || !dashboard : stryMutAct_9fa48("17808") ? false : stryMutAct_9fa48("17807") ? true : (stryCov_9fa48("17807", "17808", "17809"), loading && (stryMutAct_9fa48("17810") ? dashboard : (stryCov_9fa48("17810"), !dashboard)))) {
    return <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>;
  }
  return <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        {stryMutAct_9fa48("17814") ? error || <span className="text-warning-main text-sm">{error}</span> : stryMutAct_9fa48("17813") ? false : stryMutAct_9fa48("17812") ? true : (stryCov_9fa48("17812", "17813", "17814"), error && <span className="text-warning-main text-sm">{error}</span>)}
        {stryMutAct_9fa48("17817") ? dashboard || <span className="text-neutral-500 text-xs">
            Last updated: {formatRelativeTime(new Date(dashboard.lastUpdated))}
          </span> : stryMutAct_9fa48("17816") ? false : stryMutAct_9fa48("17815") ? true : (stryCov_9fa48("17815", "17816", "17817"), dashboard && <span className="text-neutral-500 text-xs">
            Last updated: {formatRelativeTime(new Date(dashboard.lastUpdated))}
          </span>)}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map(stryMutAct_9fa48("17818") ? () => undefined : (stryCov_9fa48("17818"), stat => <div key={stat.label} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
            <p className="text-neutral-400 text-sm mb-1">{stat.label}</p>
            <p className={cn('text-3xl font-bold', stat.color)}>
              {stat.isCurrency ? formatCurrency(stat.value) : formatNumber(stat.value)}
            </p>
            <p className="text-success-main text-sm mt-1">
              ↑ {stat.isPercent ? `${stat.change}%` : `+${stat.change}`}
            </p>
          </div>))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
          <h2 className="text-lg font-semibold text-white mb-4">Tenant Growth</h2>
          <div className="h-48 flex items-center justify-center text-neutral-500">
            [Chart Placeholder]
          </div>
        </div>
        <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
          <h2 className="text-lg font-semibold text-white mb-4">Revenue Trend</h2>
          <div className="h-48 flex items-center justify-center text-neutral-500">
            [Chart Placeholder]
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.map(stryMutAct_9fa48("17822") ? () => undefined : (stryCov_9fa48("17822"), (item, i) => <div key={i} className="flex items-center justify-between py-3 border-b border-neutral-700 last:border-0">
              <div className="flex items-center gap-3">
                <span className={cn('w-2 h-2 rounded-full', item.isAlert ? 'bg-warning-main' : 'bg-success-main')} />
                <div>
                  <p className="text-white">{item.event}</p>
                  <p className="text-sm text-neutral-400">{item.tenant}</p>
                </div>
              </div>
              <span className="text-sm text-neutral-500">{formatRelativeTime(item.time)}</span>
            </div>))}
        </div>
      </div>
    </div>;
};

// =============================================================================
// TENANTS PAGE
// =============================================================================

export const TenantsPage: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>(stryMutAct_9fa48("17827") ? ["Stryker was here"] : (stryCov_9fa48("17827"), []));
  const [loading, setLoading] = useState(stryMutAct_9fa48("17828") ? false : (stryCov_9fa48("17828"), true));
  const [search, setSearch] = useState('');
  useEffect(() => {
    const loadTenants = async () => {
      try {
        setLoading(stryMutAct_9fa48("17833") ? false : (stryCov_9fa48("17833"), true));
        const data = await adminService.listTenants(stryMutAct_9fa48("17834") ? {} : (stryCov_9fa48("17834"), {
          search: stryMutAct_9fa48("17837") ? search && undefined : stryMutAct_9fa48("17836") ? false : stryMutAct_9fa48("17835") ? true : (stryCov_9fa48("17835", "17836", "17837"), search || undefined)
        }));
        setTenants(data.tenants);
      } catch (err) {
        console.error('Failed to load tenants:', err);
      } finally {
        setLoading(stryMutAct_9fa48("17841") ? true : (stryCov_9fa48("17841"), false));
      }
    };
    loadTenants();
  }, stryMutAct_9fa48("17842") ? [] : (stryCov_9fa48("17842"), [search]));
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', stryMutAct_9fa48("17845") ? {} : (stryCov_9fa48("17845"), {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }));
  };
  return <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Tenants</h1>
        <button className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          + Create Tenant
        </button>
      </div>

      <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
        <div className="p-4 border-b border-neutral-700">
          <input type="text" placeholder="Search tenants..." value={search} onChange={stryMutAct_9fa48("17849") ? () => undefined : (stryCov_9fa48("17849"), e => setSearch(e.target.value))} className="w-full h-10 px-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-primary-500" />
        </div>
        
        {loading ? <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div> : <table className="w-full">
            <thead className="bg-neutral-900/50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase">Tenant</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase">Plan</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase">Users</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase">MRR</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase">Created</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {tenants.map(stryMutAct_9fa48("17850") ? () => undefined : (stryCov_9fa48("17850"), tenant => <tr key={tenant.id} className="border-b border-neutral-700 hover:bg-neutral-700/50">
                  <td className="px-4 py-4">
                    <p className="font-medium text-white">{tenant.name}</p>
                    <p className="text-xs text-neutral-500">{tenant.slug}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className="capitalize text-neutral-300">{tenant.plan}</span>
                  </td>
                  <td className="px-4 py-4 text-neutral-300">
                    {tenant.userCount} / {tenant.userLimit}
                  </td>
                  <td className="px-4 py-4">
                    <span className={cn('px-2 py-1 rounded-full text-xs font-medium', stryMutAct_9fa48("17854") ? tenant.status === 'active' || 'bg-success-main/20 text-success-main' : stryMutAct_9fa48("17853") ? false : stryMutAct_9fa48("17852") ? true : (stryCov_9fa48("17852", "17853", "17854"), (stryMutAct_9fa48("17856") ? tenant.status !== 'active' : stryMutAct_9fa48("17855") ? true : (stryCov_9fa48("17855", "17856"), tenant.status === 'active')) && 'bg-success-main/20 text-success-main'), stryMutAct_9fa48("17861") ? tenant.status === 'suspended' || 'bg-error-main/20 text-error-main' : stryMutAct_9fa48("17860") ? false : stryMutAct_9fa48("17859") ? true : (stryCov_9fa48("17859", "17860", "17861"), (stryMutAct_9fa48("17863") ? tenant.status !== 'suspended' : stryMutAct_9fa48("17862") ? true : (stryCov_9fa48("17862", "17863"), tenant.status === 'suspended')) && 'bg-error-main/20 text-error-main'), stryMutAct_9fa48("17868") ? tenant.status === 'trial' || 'bg-info-main/20 text-info-main' : stryMutAct_9fa48("17867") ? false : stryMutAct_9fa48("17866") ? true : (stryCov_9fa48("17866", "17867", "17868"), (stryMutAct_9fa48("17870") ? tenant.status !== 'trial' : stryMutAct_9fa48("17869") ? true : (stryCov_9fa48("17869", "17870"), tenant.status === 'trial')) && 'bg-info-main/20 text-info-main'), stryMutAct_9fa48("17875") ? tenant.status === 'churned' || 'bg-neutral-600/20 text-neutral-400' : stryMutAct_9fa48("17874") ? false : stryMutAct_9fa48("17873") ? true : (stryCov_9fa48("17873", "17874", "17875"), (stryMutAct_9fa48("17877") ? tenant.status !== 'churned' : stryMutAct_9fa48("17876") ? true : (stryCov_9fa48("17876", "17877"), tenant.status === 'churned')) && 'bg-neutral-600/20 text-neutral-400'))}>
                      {tenant.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-neutral-300">{formatCurrency(tenant.mrr)}</td>
                  <td className="px-4 py-4 text-neutral-400 text-sm">{formatDate(tenant.createdAt)}</td>
                  <td className="px-4 py-4 text-right">
                    <button className="text-neutral-400 hover:text-white">•••</button>
                  </td>
                </tr>))}
            </tbody>
          </table>}
      </div>
    </div>;
};

// =============================================================================
// LICENSES PAGE
// =============================================================================

export const LicensesPage: React.FC = () => {
  const [licenses, setLicenses] = useState<License[]>(stryMutAct_9fa48("17881") ? ["Stryker was here"] : (stryCov_9fa48("17881"), []));
  const [loading, setLoading] = useState(stryMutAct_9fa48("17882") ? false : (stryCov_9fa48("17882"), true));
  useEffect(() => {
    const loadLicenses = async () => {
      try {
        setLoading(stryMutAct_9fa48("17886") ? false : (stryCov_9fa48("17886"), true));
        const data = await adminService.listLicenses();
        setLicenses(data.licenses);
      } catch (err) {
        console.error('Failed to load licenses:', err);
      } finally {
        setLoading(stryMutAct_9fa48("17890") ? true : (stryCov_9fa48("17890"), false));
      }
    };
    loadLicenses();
  }, stryMutAct_9fa48("17891") ? ["Stryker was here"] : (stryCov_9fa48("17891"), []));
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', stryMutAct_9fa48("17894") ? {} : (stryCov_9fa48("17894"), {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }));
  };
  const handleExtend = async (licenseId: string) => {
    try {
      await adminService.extendLicense(licenseId, 12);
      const data = await adminService.listLicenses();
      setLicenses(data.licenses);
    } catch (err) {
      console.error('Failed to extend license:', err);
    }
  };
  if (stryMutAct_9fa48("17903") ? false : stryMutAct_9fa48("17902") ? true : (stryCov_9fa48("17902", "17903"), loading)) {
    return <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>;
  }
  return <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Licenses</h1>
        <button className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          + Issue License
        </button>
      </div>

      <div className="space-y-4">
        {licenses.map(stryMutAct_9fa48("17905") ? () => undefined : (stryCov_9fa48("17905"), license => <div key={license.id} className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <code className="px-2 py-1 bg-neutral-700 text-neutral-300 text-sm rounded">{license.id}</code>
                  <span className={cn('px-2 py-1 rounded-full text-xs font-medium', stryMutAct_9fa48("17909") ? license.status === 'active' || 'bg-success-main/20 text-success-main' : stryMutAct_9fa48("17908") ? false : stryMutAct_9fa48("17907") ? true : (stryCov_9fa48("17907", "17908", "17909"), (stryMutAct_9fa48("17911") ? license.status !== 'active' : stryMutAct_9fa48("17910") ? true : (stryCov_9fa48("17910", "17911"), license.status === 'active')) && 'bg-success-main/20 text-success-main'), stryMutAct_9fa48("17916") ? license.status === 'expiring' || 'bg-warning-main/20 text-warning-main' : stryMutAct_9fa48("17915") ? false : stryMutAct_9fa48("17914") ? true : (stryCov_9fa48("17914", "17915", "17916"), (stryMutAct_9fa48("17918") ? license.status !== 'expiring' : stryMutAct_9fa48("17917") ? true : (stryCov_9fa48("17917", "17918"), license.status === 'expiring')) && 'bg-warning-main/20 text-warning-main'), stryMutAct_9fa48("17923") ? license.status === 'expired' || 'bg-error-main/20 text-error-main' : stryMutAct_9fa48("17922") ? false : stryMutAct_9fa48("17921") ? true : (stryCov_9fa48("17921", "17922", "17923"), (stryMutAct_9fa48("17925") ? license.status !== 'expired' : stryMutAct_9fa48("17924") ? true : (stryCov_9fa48("17924", "17925"), license.status === 'expired')) && 'bg-error-main/20 text-error-main'), stryMutAct_9fa48("17930") ? license.status === 'suspended' || 'bg-neutral-600/20 text-neutral-400' : stryMutAct_9fa48("17929") ? false : stryMutAct_9fa48("17928") ? true : (stryCov_9fa48("17928", "17929", "17930"), (stryMutAct_9fa48("17932") ? license.status !== 'suspended' : stryMutAct_9fa48("17931") ? true : (stryCov_9fa48("17931", "17932"), license.status === 'suspended')) && 'bg-neutral-600/20 text-neutral-400'))}>
                    {license.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white">{license.tenantName}</h3>
                <p className="text-neutral-400 mt-1">
                  <span className="capitalize">{license.type}</span> • Expires {formatDate(license.expiresAt)}
                </p>
                <p className="text-sm text-neutral-500 mt-2">
                  {(stryMutAct_9fa48("17937") ? license.features || typeof license.features === 'object' : stryMutAct_9fa48("17936") ? false : stryMutAct_9fa48("17935") ? true : (stryCov_9fa48("17935", "17936", "17937"), license.features && (stryMutAct_9fa48("17939") ? typeof license.features !== 'object' : stryMutAct_9fa48("17938") ? true : (stryCov_9fa48("17938", "17939"), typeof license.features === 'object')))) ? `${stryMutAct_9fa48("17944") ? (license.features as {
                agents?: number;
                maxUsers?: number;
                maxDeliberationsPerMonth?: number;
              }).agents && 0 : stryMutAct_9fa48("17943") ? false : stryMutAct_9fa48("17942") ? true : (stryCov_9fa48("17942", "17943", "17944"), (license.features as {
                agents?: number;
                maxUsers?: number;
                maxDeliberationsPerMonth?: number;
              }).agents || 0)} agents • ${stryMutAct_9fa48("17947") ? (license.features as {
                agents?: number;
                maxUsers?: number;
                maxDeliberationsPerMonth?: number;
              }).maxUsers && 0 : stryMutAct_9fa48("17946") ? false : stryMutAct_9fa48("17945") ? true : (stryCov_9fa48("17945", "17946", "17947"), (license.features as {
                agents?: number;
                maxUsers?: number;
                maxDeliberationsPerMonth?: number;
              }).maxUsers || 0)} users • ${stryMutAct_9fa48("17950") ? (license.features as {
                agents?: number;
                maxUsers?: number;
                maxDeliberationsPerMonth?: number;
              }).maxDeliberationsPerMonth && 0 : stryMutAct_9fa48("17949") ? false : stryMutAct_9fa48("17948") ? true : (stryCov_9fa48("17948", "17949", "17950"), (license.features as {
                agents?: number;
                maxUsers?: number;
                maxDeliberationsPerMonth?: number;
              }).maxDeliberationsPerMonth || 0)} deliberations/mo` : String(stryMutAct_9fa48("17953") ? license.features && '' : stryMutAct_9fa48("17952") ? false : stryMutAct_9fa48("17951") ? true : (stryCov_9fa48("17951", "17952", "17953"), license.features || ''))}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={stryMutAct_9fa48("17955") ? () => undefined : (stryCov_9fa48("17955"), () => handleExtend(license.id))} className="px-3 py-1.5 bg-neutral-700 text-white text-sm rounded-lg hover:bg-neutral-600 transition-colors">
                  Extend
                </button>
                <button className="px-3 py-1.5 border border-neutral-600 text-neutral-300 text-sm rounded-lg hover:bg-neutral-700 transition-colors">
                  Edit
                </button>
              </div>
            </div>
          </div>))}
      </div>
    </div>;
};

// =============================================================================
// USAGE ANALYTICS PAGE
// =============================================================================

export const UsageAnalyticsPage: React.FC = () => {
  const topTenants = stryMutAct_9fa48("17957") ? [] : (stryCov_9fa48("17957"), [stryMutAct_9fa48("17958") ? {} : (stryCov_9fa48("17958"), {
    name: 'Acme Corporation',
    apiCalls: 2500000,
    users: 145,
    storage: 45.2
  }), stryMutAct_9fa48("17960") ? {} : (stryCov_9fa48("17960"), {
    name: 'GlobalCo',
    apiCalls: 1800000,
    users: 89,
    storage: 32.1
  }), stryMutAct_9fa48("17962") ? {} : (stryCov_9fa48("17962"), {
    name: 'TechStart Inc',
    apiCalls: 950000,
    users: 32,
    storage: 18.5
  }), stryMutAct_9fa48("17964") ? {} : (stryCov_9fa48("17964"), {
    name: 'FinanceFirst',
    apiCalls: 720000,
    users: 54,
    storage: 22.8
  })]);
  return <div>
      <h1 className="text-2xl font-bold text-white mb-6">Usage Analytics</h1>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {(stryMutAct_9fa48("17966") ? [] : (stryCov_9fa48("17966"), [stryMutAct_9fa48("17967") ? {} : (stryCov_9fa48("17967"), {
        label: 'Total API Calls (30d)',
        value: '45.2M'
      }), stryMutAct_9fa48("17970") ? {} : (stryCov_9fa48("17970"), {
        label: 'Avg Response Time',
        value: '124ms'
      }), stryMutAct_9fa48("17973") ? {} : (stryCov_9fa48("17973"), {
        label: 'Total Storage Used',
        value: '2.4 TB'
      }), stryMutAct_9fa48("17976") ? {} : (stryCov_9fa48("17976"), {
        label: 'Active Agents',
        value: '342'
      })])).map(stryMutAct_9fa48("17979") ? () => undefined : (stryCov_9fa48("17979"), stat => <div key={stat.label} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
            <p className="text-neutral-400 text-sm mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>))}
      </div>

      {/* Usage Chart */}
      <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">API Calls Over Time</h2>
        <div className="h-64 flex items-center justify-center text-neutral-500">
          [Usage Chart Placeholder]
        </div>
      </div>

      {/* Top Tenants */}
      <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
        <h2 className="text-lg font-semibold text-white mb-4">Top Tenants by Usage</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-700">
              <th className="text-left py-2 text-sm font-medium text-neutral-400">Tenant</th>
              <th className="text-right py-2 text-sm font-medium text-neutral-400">API Calls</th>
              <th className="text-right py-2 text-sm font-medium text-neutral-400">Users</th>
              <th className="text-right py-2 text-sm font-medium text-neutral-400">Storage (GB)</th>
            </tr>
          </thead>
          <tbody>
            {topTenants.map(stryMutAct_9fa48("17980") ? () => undefined : (stryCov_9fa48("17980"), tenant => <tr key={tenant.name} className="border-b border-neutral-700/50">
                <td className="py-3 text-white">{tenant.name}</td>
                <td className="py-3 text-right text-neutral-300">{formatNumber(tenant.apiCalls)}</td>
                <td className="py-3 text-right text-neutral-300">{tenant.users}</td>
                <td className="py-3 text-right text-neutral-300">{tenant.storage}</td>
              </tr>))}
          </tbody>
        </table>
      </div>
    </div>;
};

// =============================================================================
// SYSTEM HEALTH PAGE
// =============================================================================

export const SystemHealthPage: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthDashboard | null>(null);
  const [loading, setLoading] = useState(stryMutAct_9fa48("17982") ? false : (stryCov_9fa48("17982"), true));
  useEffect(() => {
    const loadHealth = async () => {
      try {
        setLoading(stryMutAct_9fa48("17986") ? false : (stryCov_9fa48("17986"), true));
        const data = await adminService.getHealthDashboard();
        setHealthData(data);
      } catch (err) {
        console.error('Failed to load health data:', err);
      } finally {
        setLoading(stryMutAct_9fa48("17990") ? true : (stryCov_9fa48("17990"), false));
      }
    };
    loadHealth();
    // Refresh every 15 seconds
    const interval = setInterval(loadHealth, 15000);
    return stryMutAct_9fa48("17991") ? () => undefined : (stryCov_9fa48("17991"), () => clearInterval(interval));
  }, stryMutAct_9fa48("17992") ? ["Stryker was here"] : (stryCov_9fa48("17992"), []));
  if (stryMutAct_9fa48("17995") ? loading || !healthData : stryMutAct_9fa48("17994") ? false : stryMutAct_9fa48("17993") ? true : (stryCov_9fa48("17993", "17994", "17995"), loading && (stryMutAct_9fa48("17996") ? healthData : (stryCov_9fa48("17996"), !healthData)))) {
    return <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>;
  }
  const services = stryMutAct_9fa48("18000") ? healthData?.services && [] : stryMutAct_9fa48("17999") ? false : stryMutAct_9fa48("17998") ? true : (stryCov_9fa48("17998", "17999", "18000"), (stryMutAct_9fa48("18001") ? healthData.services : (stryCov_9fa48("18001"), healthData?.services)) || (stryMutAct_9fa48("18002") ? ["Stryker was here"] : (stryCov_9fa48("18002"), [])));
  const alerts = stryMutAct_9fa48("18005") ? healthData?.alerts && [] : stryMutAct_9fa48("18004") ? false : stryMutAct_9fa48("18003") ? true : (stryCov_9fa48("18003", "18004", "18005"), (stryMutAct_9fa48("18006") ? healthData.alerts : (stryCov_9fa48("18006"), healthData?.alerts)) || (stryMutAct_9fa48("18007") ? ["Stryker was here"] : (stryCov_9fa48("18007"), [])));
  const overallStatus = stryMutAct_9fa48("18010") ? healthData?.overallStatus && 'healthy' : stryMutAct_9fa48("18009") ? false : stryMutAct_9fa48("18008") ? true : (stryCov_9fa48("18008", "18009", "18010"), (stryMutAct_9fa48("18011") ? healthData.overallStatus : (stryCov_9fa48("18011"), healthData?.overallStatus)) || 'healthy');
  const statusColors = stryMutAct_9fa48("18013") ? {} : (stryCov_9fa48("18013"), {
    healthy: 'bg-success-main/20 text-success-main',
    degraded: 'bg-warning-main/20 text-warning-main',
    critical: 'bg-error-main/20 text-error-main'
  });
  const statusLabels = stryMutAct_9fa48("18017") ? {} : (stryCov_9fa48("18017"), {
    healthy: 'All Systems Operational',
    degraded: 'Partial Degradation',
    critical: 'System Issues Detected'
  });
  return <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">System Health</h1>
        <span className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium', statusColors[overallStatus])}>
          <span className={cn('w-2 h-2 rounded-full animate-pulse', (stryMutAct_9fa48("18025") ? overallStatus !== 'healthy' : stryMutAct_9fa48("18024") ? false : stryMutAct_9fa48("18023") ? true : (stryCov_9fa48("18023", "18024", "18025"), overallStatus === 'healthy')) ? 'bg-success-main' : (stryMutAct_9fa48("18030") ? overallStatus !== 'degraded' : stryMutAct_9fa48("18029") ? false : stryMutAct_9fa48("18028") ? true : (stryCov_9fa48("18028", "18029", "18030"), overallStatus === 'degraded')) ? 'bg-warning-main' : 'bg-error-main')} />
          {statusLabels[overallStatus]}
        </span>
      </div>

      {/* Service Status */}
      <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden mb-8">
        <div className="p-4 border-b border-neutral-700">
          <h2 className="text-lg font-semibold text-white">Service Status</h2>
        </div>
        <table className="w-full">
          <thead className="bg-neutral-900/50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase">Service</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase">Latency</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase">Uptime (30d)</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase">Last Check</th>
            </tr>
          </thead>
          <tbody>
            {services.map(stryMutAct_9fa48("18034") ? () => undefined : (stryCov_9fa48("18034"), service => <tr key={service.name} className="border-b border-neutral-700">
                <td className="px-4 py-4 text-white font-medium">{service.name}</td>
                <td className="px-4 py-4">
                  <span className={cn('flex items-center gap-2', (stryMutAct_9fa48("18038") ? service.status !== 'healthy' : stryMutAct_9fa48("18037") ? false : stryMutAct_9fa48("18036") ? true : (stryCov_9fa48("18036", "18037", "18038"), service.status === 'healthy')) ? 'text-success-main' : (stryMutAct_9fa48("18043") ? service.status !== 'degraded' : stryMutAct_9fa48("18042") ? false : stryMutAct_9fa48("18041") ? true : (stryCov_9fa48("18041", "18042", "18043"), service.status === 'degraded')) ? 'text-warning-main' : 'text-error-main')}>
                    <span className={cn('w-2 h-2 rounded-full', (stryMutAct_9fa48("18050") ? service.status !== 'healthy' : stryMutAct_9fa48("18049") ? false : stryMutAct_9fa48("18048") ? true : (stryCov_9fa48("18048", "18049", "18050"), service.status === 'healthy')) ? 'bg-success-main' : (stryMutAct_9fa48("18055") ? service.status !== 'degraded' : stryMutAct_9fa48("18054") ? false : stryMutAct_9fa48("18053") ? true : (stryCov_9fa48("18053", "18054", "18055"), service.status === 'degraded')) ? 'bg-warning-main' : 'bg-error-main')} />
                    {service.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-neutral-300">{service.latency}ms</td>
                <td className="px-4 py-4 text-neutral-300">{service.uptime}%</td>
                <td className="px-4 py-4 text-neutral-400 text-sm">{formatRelativeTime(new Date(service.lastCheck))}</td>
              </tr>))}
          </tbody>
        </table>
      </div>

      {/* Active Alerts */}
      <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Active Alerts</h2>
        {(stryMutAct_9fa48("18061") ? alerts.length !== 0 : stryMutAct_9fa48("18060") ? false : stryMutAct_9fa48("18059") ? true : (stryCov_9fa48("18059", "18060", "18061"), alerts.length === 0)) ? <p className="text-neutral-400 text-sm">No active alerts</p> : <div className="space-y-4">
            {alerts.map(stryMutAct_9fa48("18062") ? () => undefined : (stryCov_9fa48("18062"), alert => <div key={alert.id} className="flex items-center justify-between p-4 bg-neutral-700/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className={cn('w-3 h-3 rounded-full', (stryMutAct_9fa48("18066") ? alert.severity !== 'critical' : stryMutAct_9fa48("18065") ? false : stryMutAct_9fa48("18064") ? true : (stryCov_9fa48("18064", "18065", "18066"), alert.severity === 'critical')) ? 'bg-error-main' : (stryMutAct_9fa48("18071") ? alert.severity !== 'warning' : stryMutAct_9fa48("18070") ? false : stryMutAct_9fa48("18069") ? true : (stryCov_9fa48("18069", "18070", "18071"), alert.severity === 'warning')) ? 'bg-warning-main' : 'bg-info-main')} />
                  <div>
                    <p className="text-white font-medium">{alert.message}</p>
                    <p className="text-sm text-neutral-400">{alert.service} • {formatRelativeTime(new Date(alert.createdAt))}</p>
                  </div>
                </div>
                <span className={cn('px-2 py-1 rounded-full text-xs font-medium', (stryMutAct_9fa48("18078") ? alert.severity !== 'critical' : stryMutAct_9fa48("18077") ? false : stryMutAct_9fa48("18076") ? true : (stryCov_9fa48("18076", "18077", "18078"), alert.severity === 'critical')) ? 'bg-error-main/20 text-error-main' : (stryMutAct_9fa48("18083") ? alert.severity !== 'warning' : stryMutAct_9fa48("18082") ? false : stryMutAct_9fa48("18081") ? true : (stryCov_9fa48("18081", "18082", "18083"), alert.severity === 'warning')) ? 'bg-warning-main/20 text-warning-main' : 'bg-info-main/20 text-info-main')}>
                  {alert.severity}
                </span>
              </div>))}
          </div>}
      </div>
    </div>;
};

// =============================================================================
// FEATURE FLAGS PAGE
// =============================================================================

export const FeatureFlagsPage: React.FC = () => {
  const [flags, setFlags] = useState(stryMutAct_9fa48("18088") ? [] : (stryCov_9fa48("18088"), [stryMutAct_9fa48("18089") ? {} : (stryCov_9fa48("18089"), {
    id: 'agent_v2',
    name: 'Agent V2 Architecture',
    enabled: stryMutAct_9fa48("18092") ? false : (stryCov_9fa48("18092"), true),
    rollout: 100,
    description: 'New agent reasoning engine'
  }), stryMutAct_9fa48("18094") ? {} : (stryCov_9fa48("18094"), {
    id: 'realtime_collab',
    name: 'Real-time Collaboration',
    enabled: stryMutAct_9fa48("18097") ? false : (stryCov_9fa48("18097"), true),
    rollout: 50,
    description: 'Multi-user editing features'
  }), stryMutAct_9fa48("18099") ? {} : (stryCov_9fa48("18099"), {
    id: 'advanced_forecasting',
    name: 'Advanced Forecasting',
    enabled: stryMutAct_9fa48("18102") ? true : (stryCov_9fa48("18102"), false),
    rollout: 0,
    description: 'LSTM and ensemble models'
  }), stryMutAct_9fa48("18104") ? {} : (stryCov_9fa48("18104"), {
    id: 'graph_visualizations',
    name: 'Enhanced Graph Viz',
    enabled: stryMutAct_9fa48("18107") ? false : (stryCov_9fa48("18107"), true),
    rollout: 25,
    description: '3D graph visualization'
  }), stryMutAct_9fa48("18109") ? {} : (stryCov_9fa48("18109"), {
    id: 'ai_suggestions',
    name: 'AI Query Suggestions',
    enabled: stryMutAct_9fa48("18112") ? true : (stryCov_9fa48("18112"), false),
    rollout: 0,
    description: 'Proactive AI recommendations'
  })]));
  const toggleFlag = (id: string) => {
    setFlags(flags.map(stryMutAct_9fa48("18115") ? () => undefined : (stryCov_9fa48("18115"), f => (stryMutAct_9fa48("18118") ? f.id !== id : stryMutAct_9fa48("18117") ? false : stryMutAct_9fa48("18116") ? true : (stryCov_9fa48("18116", "18117", "18118"), f.id === id)) ? stryMutAct_9fa48("18119") ? {} : (stryCov_9fa48("18119"), {
      ...f,
      enabled: stryMutAct_9fa48("18120") ? f.enabled : (stryCov_9fa48("18120"), !f.enabled)
    }) : f)));
  };
  return <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Feature Flags</h1>
        <button className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          + Create Flag
        </button>
      </div>

      <div className="space-y-4">
        {flags.map(stryMutAct_9fa48("18121") ? () => undefined : (stryCov_9fa48("18121"), flag => <div key={flag.id} className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{flag.name}</h3>
                  <code className="px-2 py-0.5 bg-neutral-700 text-neutral-400 text-xs rounded">{flag.id}</code>
                </div>
                <p className="text-neutral-400 mb-4">{flag.description}</p>
                
                {stryMutAct_9fa48("18124") ? flag.enabled || <div className="flex items-center gap-4">
                    <span className="text-sm text-neutral-400">Rollout:</span>
                    <div className="flex-1 max-w-xs">
                      <input type="range" min="0" max="100" value={flag.rollout} onChange={e => setFlags(flags.map(f => f.id === flag.id ? {
                  ...f,
                  rollout: Number(e.target.value)
                } : f))} className="w-full" />
                    </div>
                    <span className="text-white font-medium">{flag.rollout}%</span>
                  </div> : stryMutAct_9fa48("18123") ? false : stryMutAct_9fa48("18122") ? true : (stryCov_9fa48("18122", "18123", "18124"), flag.enabled && <div className="flex items-center gap-4">
                    <span className="text-sm text-neutral-400">Rollout:</span>
                    <div className="flex-1 max-w-xs">
                      <input type="range" min="0" max="100" value={flag.rollout} onChange={stryMutAct_9fa48("18125") ? () => undefined : (stryCov_9fa48("18125"), e => setFlags(flags.map(stryMutAct_9fa48("18126") ? () => undefined : (stryCov_9fa48("18126"), f => (stryMutAct_9fa48("18129") ? f.id !== flag.id : stryMutAct_9fa48("18128") ? false : stryMutAct_9fa48("18127") ? true : (stryCov_9fa48("18127", "18128", "18129"), f.id === flag.id)) ? stryMutAct_9fa48("18130") ? {} : (stryCov_9fa48("18130"), {
                  ...f,
                  rollout: Number(e.target.value)
                }) : f))))} className="w-full" />
                    </div>
                    <span className="text-white font-medium">{flag.rollout}%</span>
                  </div>)}
              </div>
              
              <button onClick={stryMutAct_9fa48("18131") ? () => undefined : (stryCov_9fa48("18131"), () => toggleFlag(flag.id))} className={cn('w-12 h-6 rounded-full transition-colors relative', flag.enabled ? 'bg-success-main' : 'bg-neutral-600')}>
                <span className={cn('absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform', flag.enabled ? 'left-6' : 'left-0.5')} />
              </button>
            </div>
          </div>))}
      </div>
    </div>;
};
export default AdminLayout;

// Re-export pages
export { DataSourcesPage } from './DataSourcesPage';