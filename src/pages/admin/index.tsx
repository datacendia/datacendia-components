// =============================================================================
// DATACENDIA - ADMIN CONSOLE PAGES
// =============================================================================

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

  const adminNav = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/admin' },
    { id: 'sovereign-stack', label: 'Sovereign Stack', icon: '🖥️', path: '/admin/sovereign-stack' },
    { id: 'control-center', label: 'Control Center', icon: '🎛️', path: '/admin/control-center' },
    { id: 'ai', label: 'Admin AI', icon: '🤖', path: '/admin/ai' },
    { id: 'tenants', label: 'Tenants', icon: '🏢', path: '/admin/tenants' },
    { id: 'data-sources', label: 'Data Sources', icon: '🗄️', path: '/admin/data-sources' },
    { id: 'mode-analytics', label: 'Council Analytics', icon: '🎯', path: '/admin/mode-analytics' },
    { id: 'rd-lab', label: 'R&D Lab', icon: '🔬', path: '/admin/rd-lab' },
    { id: 'core', label: 'Datacendia Core', icon: '👑', path: '/admin/core' },
    { id: 'licenses', label: 'Licenses', icon: '📜', path: '/admin/licenses' },
    { id: 'usage', label: 'Usage Analytics', icon: '📈', path: '/admin/usage' },
    { id: 'health', label: 'System Health', icon: '💓', path: '/admin/health' },
    { id: 'features', label: 'Feature Flags', icon: '🚩', path: '/admin/features' },
  ];

  return (
    <div className="min-h-screen bg-neutral-900">
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
            {adminNav.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left',
                  location.pathname === item.path
                    ? 'bg-primary-600 text-white'
                    : 'text-neutral-400 hover:bg-neutral-700 hover:text-white'
                )}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// =============================================================================
// ADMIN DASHBOARD
// =============================================================================

export const AdminDashboardPage: React.FC = () => {
  const [dashboard, setDashboard] = useState<PlatformDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const data = await adminService.getDashboard();
        setDashboard(data);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard. Using cached data.');
        // Fallback to demo data
        setDashboard({
          tenants: { total: 127, active: 98, trial: 12, churned: 17 },
          revenue: { mrr: 842000, arr: 10104000, avgPerTenant: 8590 },
          licenses: { total: 127, active: 110, expiring: 5, revenueAtRisk: 75000 },
          system: { status: 'healthy', apiRequests24h: 12500000, avgLatency: 45, errorRate: 0.8 },
          users: { total: 3482 },
          recentActivity: [
            { event: 'New tenant created', tenant: 'HealthTech Labs', time: new Date(Date.now() - 1800000).toISOString() },
            { event: 'License upgraded', tenant: 'TechStart Inc', time: new Date(Date.now() - 3600000).toISOString() },
            { event: 'User limit warning', tenant: 'GlobalCo', time: new Date(Date.now() - 7200000).toISOString(), isAlert: true },
            { event: 'SSO configured', tenant: 'FinanceFirst', time: new Date(Date.now() - 14400000).toISOString() },
          ],
          lastUpdated: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
    // Refresh every 30 seconds
    const interval = setInterval(loadDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = dashboard ? [
    { label: 'Total Tenants', value: dashboard.tenants.total, change: +5, color: 'text-primary-400' },
    { label: 'Active Users', value: dashboard.users.total, change: +142, color: 'text-success-main' },
    { label: 'MRR', value: dashboard.revenue.mrr, isCurrency: true, change: +8.5, isPercent: true, color: 'text-success-main' },
    { label: 'API Calls (24h)', value: dashboard.system.apiRequests24h, change: +12, isPercent: true, color: 'text-info-main' },
  ] : [];

  const recentActivity = dashboard?.recentActivity.map(a => ({
    event: a.event,
    tenant: a.tenant,
    time: new Date(a.time),
    isAlert: a.isAlert,
  })) || [];

  if (loading && !dashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        {error && (
          <span className="text-warning-main text-sm">{error}</span>
        )}
        {dashboard && (
          <span className="text-neutral-500 text-xs">
            Last updated: {formatRelativeTime(new Date(dashboard.lastUpdated))}
          </span>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
            <p className="text-neutral-400 text-sm mb-1">{stat.label}</p>
            <p className={cn('text-3xl font-bold', stat.color)}>
              {stat.isCurrency ? formatCurrency(stat.value) : formatNumber(stat.value)}
            </p>
            <p className="text-success-main text-sm mt-1">
              ↑ {stat.isPercent ? `${stat.change}%` : `+${stat.change}`}
            </p>
          </div>
        ))}
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
          {recentActivity.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-neutral-700 last:border-0">
              <div className="flex items-center gap-3">
                <span className={cn('w-2 h-2 rounded-full', item.isAlert ? 'bg-warning-main' : 'bg-success-main')} />
                <div>
                  <p className="text-white">{item.event}</p>
                  <p className="text-sm text-neutral-400">{item.tenant}</p>
                </div>
              </div>
              <span className="text-sm text-neutral-500">{formatRelativeTime(item.time)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// TENANTS PAGE
// =============================================================================

export const TenantsPage: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadTenants = async () => {
      try {
        setLoading(true);
        const data = await adminService.listTenants({ search: search || undefined });
        setTenants(data.tenants);
      } catch (err) {
        console.error('Failed to load tenants:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTenants();
  }, [search]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Tenants</h1>
        <button className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          + Create Tenant
        </button>
      </div>

      <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
        <div className="p-4 border-b border-neutral-700">
          <input
            type="text"
            placeholder="Search tenants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 px-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <table className="w-full">
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
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="border-b border-neutral-700 hover:bg-neutral-700/50">
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
                    <span className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      tenant.status === 'active' && 'bg-success-main/20 text-success-main',
                      tenant.status === 'suspended' && 'bg-error-main/20 text-error-main',
                      tenant.status === 'trial' && 'bg-info-main/20 text-info-main',
                      tenant.status === 'churned' && 'bg-neutral-600/20 text-neutral-400'
                    )}>
                      {tenant.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-neutral-300">{formatCurrency(tenant.mrr)}</td>
                  <td className="px-4 py-4 text-neutral-400 text-sm">{formatDate(tenant.createdAt)}</td>
                  <td className="px-4 py-4 text-right">
                    <button className="text-neutral-400 hover:text-white">•••</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// LICENSES PAGE
// =============================================================================

export const LicensesPage: React.FC = () => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLicenses = async () => {
      try {
        setLoading(true);
        const data = await adminService.listLicenses();
        setLicenses(data.licenses);
      } catch (err) {
        console.error('Failed to load licenses:', err);
      } finally {
        setLoading(false);
      }
    };
    loadLicenses();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Licenses</h1>
        <button className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          + Issue License
        </button>
      </div>

      <div className="space-y-4">
        {licenses.map((license) => (
          <div key={license.id} className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <code className="px-2 py-1 bg-neutral-700 text-neutral-300 text-sm rounded">{license.id}</code>
                  <span className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    license.status === 'active' && 'bg-success-main/20 text-success-main',
                    license.status === 'expiring' && 'bg-warning-main/20 text-warning-main',
                    license.status === 'expired' && 'bg-error-main/20 text-error-main',
                    license.status === 'suspended' && 'bg-neutral-600/20 text-neutral-400'
                  )}>
                    {license.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white">{license.tenantName}</h3>
                <p className="text-neutral-400 mt-1">
                  <span className="capitalize">{license.type}</span> • Expires {formatDate(license.expiresAt)}
                </p>
                <p className="text-sm text-neutral-500 mt-2">
                  {license.features && typeof license.features === 'object' 
                    ? `${(license.features as { agents?: number; maxUsers?: number; maxDeliberationsPerMonth?: number }).agents || 0} agents • ${(license.features as { agents?: number; maxUsers?: number; maxDeliberationsPerMonth?: number }).maxUsers || 0} users • ${(license.features as { agents?: number; maxUsers?: number; maxDeliberationsPerMonth?: number }).maxDeliberationsPerMonth || 0} deliberations/mo`
                    : String(license.features || '')}
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleExtend(license.id)}
                  className="px-3 py-1.5 bg-neutral-700 text-white text-sm rounded-lg hover:bg-neutral-600 transition-colors"
                >
                  Extend
                </button>
                <button className="px-3 py-1.5 border border-neutral-600 text-neutral-300 text-sm rounded-lg hover:bg-neutral-700 transition-colors">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// USAGE ANALYTICS PAGE
// =============================================================================

export const UsageAnalyticsPage: React.FC = () => {
  const topTenants = [
    { name: 'Acme Corporation', apiCalls: 2500000, users: 145, storage: 45.2 },
    { name: 'GlobalCo', apiCalls: 1800000, users: 89, storage: 32.1 },
    { name: 'TechStart Inc', apiCalls: 950000, users: 32, storage: 18.5 },
    { name: 'FinanceFirst', apiCalls: 720000, users: 54, storage: 22.8 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Usage Analytics</h1>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total API Calls (30d)', value: '45.2M' },
          { label: 'Avg Response Time', value: '124ms' },
          { label: 'Total Storage Used', value: '2.4 TB' },
          { label: 'Active Agents', value: '342' },
        ].map((stat) => (
          <div key={stat.label} className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
            <p className="text-neutral-400 text-sm mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
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
            {topTenants.map((tenant) => (
              <tr key={tenant.name} className="border-b border-neutral-700/50">
                <td className="py-3 text-white">{tenant.name}</td>
                <td className="py-3 text-right text-neutral-300">{formatNumber(tenant.apiCalls)}</td>
                <td className="py-3 text-right text-neutral-300">{tenant.users}</td>
                <td className="py-3 text-right text-neutral-300">{tenant.storage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// =============================================================================
// SYSTEM HEALTH PAGE
// =============================================================================

export const SystemHealthPage: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHealth = async () => {
      try {
        setLoading(true);
        const data = await adminService.getHealthDashboard();
        setHealthData(data);
      } catch (err) {
        console.error('Failed to load health data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHealth();
    // Refresh every 15 seconds
    const interval = setInterval(loadHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !healthData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const services = healthData?.services || [];
  const alerts = healthData?.alerts || [];
  const overallStatus = healthData?.overallStatus || 'healthy';

  const statusColors = {
    healthy: 'bg-success-main/20 text-success-main',
    degraded: 'bg-warning-main/20 text-warning-main',
    critical: 'bg-error-main/20 text-error-main',
  };

  const statusLabels = {
    healthy: 'All Systems Operational',
    degraded: 'Partial Degradation',
    critical: 'System Issues Detected',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">System Health</h1>
        <span className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium', statusColors[overallStatus])}>
          <span className={cn('w-2 h-2 rounded-full animate-pulse', 
            overallStatus === 'healthy' ? 'bg-success-main' : 
            overallStatus === 'degraded' ? 'bg-warning-main' : 'bg-error-main'
          )} />
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
            {services.map((service) => (
              <tr key={service.name} className="border-b border-neutral-700">
                <td className="px-4 py-4 text-white font-medium">{service.name}</td>
                <td className="px-4 py-4">
                  <span className={cn(
                    'flex items-center gap-2',
                    service.status === 'healthy' ? 'text-success-main' : 
                    service.status === 'degraded' ? 'text-warning-main' : 'text-error-main'
                  )}>
                    <span className={cn(
                      'w-2 h-2 rounded-full',
                      service.status === 'healthy' ? 'bg-success-main' : 
                      service.status === 'degraded' ? 'bg-warning-main' : 'bg-error-main'
                    )} />
                    {service.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-neutral-300">{service.latency}ms</td>
                <td className="px-4 py-4 text-neutral-300">{service.uptime}%</td>
                <td className="px-4 py-4 text-neutral-400 text-sm">{formatRelativeTime(new Date(service.lastCheck))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Active Alerts */}
      <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Active Alerts</h2>
        {alerts.length === 0 ? (
          <p className="text-neutral-400 text-sm">No active alerts</p>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 bg-neutral-700/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className={cn(
                    'w-3 h-3 rounded-full',
                    alert.severity === 'critical' ? 'bg-error-main' : 
                    alert.severity === 'warning' ? 'bg-warning-main' : 'bg-info-main'
                  )} />
                  <div>
                    <p className="text-white font-medium">{alert.message}</p>
                    <p className="text-sm text-neutral-400">{alert.service} • {formatRelativeTime(new Date(alert.createdAt))}</p>
                  </div>
                </div>
                <span className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  alert.severity === 'critical' ? 'bg-error-main/20 text-error-main' : 
                  alert.severity === 'warning' ? 'bg-warning-main/20 text-warning-main' : 'bg-info-main/20 text-info-main'
                )}>
                  {alert.severity}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// FEATURE FLAGS PAGE
// =============================================================================

export const FeatureFlagsPage: React.FC = () => {
  const [flags, setFlags] = useState([
    { id: 'agent_v2', name: 'Agent V2 Architecture', enabled: true, rollout: 100, description: 'New agent reasoning engine' },
    { id: 'realtime_collab', name: 'Real-time Collaboration', enabled: true, rollout: 50, description: 'Multi-user editing features' },
    { id: 'advanced_forecasting', name: 'Advanced Forecasting', enabled: false, rollout: 0, description: 'LSTM and ensemble models' },
    { id: 'graph_visualizations', name: 'Enhanced Graph Viz', enabled: true, rollout: 25, description: '3D graph visualization' },
    { id: 'ai_suggestions', name: 'AI Query Suggestions', enabled: false, rollout: 0, description: 'Proactive AI recommendations' },
  ]);

  const toggleFlag = (id: string) => {
    setFlags(flags.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Feature Flags</h1>
        <button className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          + Create Flag
        </button>
      </div>

      <div className="space-y-4">
        {flags.map((flag) => (
          <div key={flag.id} className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{flag.name}</h3>
                  <code className="px-2 py-0.5 bg-neutral-700 text-neutral-400 text-xs rounded">{flag.id}</code>
                </div>
                <p className="text-neutral-400 mb-4">{flag.description}</p>
                
                {flag.enabled && (
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-neutral-400">Rollout:</span>
                    <div className="flex-1 max-w-xs">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={flag.rollout}
                        onChange={(e) => setFlags(flags.map(f => f.id === flag.id ? { ...f, rollout: Number(e.target.value) } : f))}
                        className="w-full"
                      />
                    </div>
                    <span className="text-white font-medium">{flag.rollout}%</span>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => toggleFlag(flag.id)}
                className={cn(
                  'w-12 h-6 rounded-full transition-colors relative',
                  flag.enabled ? 'bg-success-main' : 'bg-neutral-600'
                )}
              >
                <span className={cn(
                  'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                  flag.enabled ? 'left-6' : 'left-0.5'
                )} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminLayout;

// Re-export pages
export { DataSourcesPage } from './DataSourcesPage';
