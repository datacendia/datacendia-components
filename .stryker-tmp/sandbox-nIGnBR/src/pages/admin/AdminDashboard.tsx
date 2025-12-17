/**
 * Admin Dashboard - Tenant Management & System Overview
 * 
 * Multi-tenant admin view showing all organizations, usage metrics,
 * health status, feature flags, and audit logs.
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
import React, { useState, useEffect } from 'react';
import { cn } from '../../../lib/utils';

// Types
interface Tenant {
  id: string;
  name: string;
  slug: string;
  tier: 'free' | 'pro' | 'enterprise' | 'sovereign';
  status: 'active' | 'suspended' | 'trial' | 'churned';
  users: number;
  deliberations: number;
  storageUsedMB: number;
  apiCallsToday: number;
  createdAt: Date;
  lastActiveAt: Date;
}
interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  description: string;
  enabled: boolean;
  enabledForTenants: string[];
  rolloutPercentage: number;
  createdAt: Date;
}
interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  severity: 'info' | 'warning' | 'critical';
}
interface ServiceHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  uptime: number;
  lastCheck: Date;
}

// Mock data
const mockTenants: Tenant[] = stryMutAct_9fa48("15611") ? [] : (stryCov_9fa48("15611"), [stryMutAct_9fa48("15612") ? {} : (stryCov_9fa48("15612"), {
  id: 't1',
  name: 'Acme Corp',
  slug: 'acme',
  tier: 'enterprise',
  status: 'active',
  users: 156,
  deliberations: 2340,
  storageUsedMB: 4500,
  apiCallsToday: 12500,
  createdAt: new Date('2024-01-15'),
  lastActiveAt: new Date()
}), stryMutAct_9fa48("15619") ? {} : (stryCov_9fa48("15619"), {
  id: 't2',
  name: 'TechStart Inc',
  slug: 'techstart',
  tier: 'pro',
  status: 'active',
  users: 45,
  deliberations: 890,
  storageUsedMB: 1200,
  apiCallsToday: 3400,
  createdAt: new Date('2024-03-20'),
  lastActiveAt: new Date()
}), stryMutAct_9fa48("15626") ? {} : (stryCov_9fa48("15626"), {
  id: 't3',
  name: 'Global Finance',
  slug: 'globalfin',
  tier: 'sovereign',
  status: 'active',
  users: 320,
  deliberations: 5600,
  storageUsedMB: 12000,
  apiCallsToday: 45000,
  createdAt: new Date('2023-11-01'),
  lastActiveAt: new Date()
}), stryMutAct_9fa48("15633") ? {} : (stryCov_9fa48("15633"), {
  id: 't4',
  name: 'StartupXYZ',
  slug: 'startupxyz',
  tier: 'free',
  status: 'trial',
  users: 5,
  deliberations: 23,
  storageUsedMB: 50,
  apiCallsToday: 89,
  createdAt: new Date('2025-01-01'),
  lastActiveAt: new Date()
}), stryMutAct_9fa48("15640") ? {} : (stryCov_9fa48("15640"), {
  id: 't5',
  name: 'MedCare Health',
  slug: 'medcare',
  tier: 'enterprise',
  status: 'active',
  users: 89,
  deliberations: 1560,
  storageUsedMB: 3200,
  apiCallsToday: 8900,
  createdAt: new Date('2024-06-15'),
  lastActiveAt: new Date()
})]);
const mockFeatureFlags: FeatureFlag[] = stryMutAct_9fa48("15647") ? [] : (stryCov_9fa48("15647"), [stryMutAct_9fa48("15648") ? {} : (stryCov_9fa48("15648"), {
  id: 'ff1',
  name: 'AI Cross-Examination',
  key: 'ai_cross_exam',
  description: 'Enable AI agents to challenge each other',
  enabled: stryMutAct_9fa48("15653") ? false : (stryCov_9fa48("15653"), true),
  enabledForTenants: stryMutAct_9fa48("15654") ? ["Stryker was here"] : (stryCov_9fa48("15654"), []),
  rolloutPercentage: 100,
  createdAt: new Date('2024-06-01')
}), stryMutAct_9fa48("15656") ? {} : (stryCov_9fa48("15656"), {
  id: 'ff2',
  name: 'Monte Carlo Simulations',
  key: 'monte_carlo',
  description: 'Future prediction with uncertainty cones',
  enabled: stryMutAct_9fa48("15661") ? false : (stryCov_9fa48("15661"), true),
  enabledForTenants: stryMutAct_9fa48("15662") ? [] : (stryCov_9fa48("15662"), ['t1', 't3']),
  rolloutPercentage: 50,
  createdAt: new Date('2024-09-15')
}), stryMutAct_9fa48("15666") ? {} : (stryCov_9fa48("15666"), {
  id: 'ff3',
  name: 'Custom Agents',
  key: 'custom_agents',
  description: 'Allow users to create custom AI agents',
  enabled: stryMutAct_9fa48("15671") ? false : (stryCov_9fa48("15671"), true),
  enabledForTenants: stryMutAct_9fa48("15672") ? ["Stryker was here"] : (stryCov_9fa48("15672"), []),
  rolloutPercentage: 75,
  createdAt: new Date('2024-08-01')
}), stryMutAct_9fa48("15674") ? {} : (stryCov_9fa48("15674"), {
  id: 'ff4',
  name: 'Zero-Knowledge Proofs',
  key: 'zk_proofs',
  description: 'Privacy-preserving audit verification',
  enabled: stryMutAct_9fa48("15679") ? true : (stryCov_9fa48("15679"), false),
  enabledForTenants: stryMutAct_9fa48("15680") ? [] : (stryCov_9fa48("15680"), ['t3']),
  rolloutPercentage: 0,
  createdAt: new Date('2025-01-01')
}), stryMutAct_9fa48("15683") ? {} : (stryCov_9fa48("15683"), {
  id: 'ff5',
  name: 'Real-time Collaboration',
  key: 'realtime_collab',
  description: 'Multiple users in same deliberation',
  enabled: stryMutAct_9fa48("15688") ? true : (stryCov_9fa48("15688"), false),
  enabledForTenants: stryMutAct_9fa48("15689") ? ["Stryker was here"] : (stryCov_9fa48("15689"), []),
  rolloutPercentage: 0,
  createdAt: new Date('2025-01-10')
})]);
const mockAuditLog: AuditLogEntry[] = stryMutAct_9fa48("15691") ? [] : (stryCov_9fa48("15691"), [stryMutAct_9fa48("15692") ? {} : (stryCov_9fa48("15692"), {
  id: 'a1',
  timestamp: new Date(),
  userId: 'u1',
  userName: 'John Admin',
  action: 'tenant.suspend',
  resource: 't4',
  details: 'Suspended tenant for payment failure',
  ipAddress: '192.168.1.100',
  severity: 'warning'
}), stryMutAct_9fa48("15701") ? {} : (stryCov_9fa48("15701"), {
  id: 'a2',
  timestamp: new Date(stryMutAct_9fa48("15703") ? Date.now() + 3600000 : (stryCov_9fa48("15703"), Date.now() - 3600000)),
  userId: 'u2',
  userName: 'Sarah Ops',
  action: 'feature_flag.enable',
  resource: 'ff2',
  details: 'Enabled Monte Carlo for enterprise tenants',
  ipAddress: '192.168.1.101',
  severity: 'info'
}), stryMutAct_9fa48("15711") ? {} : (stryCov_9fa48("15711"), {
  id: 'a3',
  timestamp: new Date(stryMutAct_9fa48("15713") ? Date.now() + 7200000 : (stryCov_9fa48("15713"), Date.now() - 7200000)),
  userId: 'u1',
  userName: 'John Admin',
  action: 'user.impersonate',
  resource: 'u123',
  details: 'Impersonated user for support ticket #4521',
  ipAddress: '192.168.1.100',
  severity: 'warning'
}), stryMutAct_9fa48("15721") ? {} : (stryCov_9fa48("15721"), {
  id: 'a4',
  timestamp: new Date(stryMutAct_9fa48("15723") ? Date.now() + 86400000 : (stryCov_9fa48("15723"), Date.now() - 86400000)),
  userId: 'system',
  userName: 'System',
  action: 'backup.complete',
  resource: 'db',
  details: 'Daily backup completed successfully',
  ipAddress: '127.0.0.1',
  severity: 'info'
}), stryMutAct_9fa48("15731") ? {} : (stryCov_9fa48("15731"), {
  id: 'a5',
  timestamp: new Date(stryMutAct_9fa48("15733") ? Date.now() + 172800000 : (stryCov_9fa48("15733"), Date.now() - 172800000)),
  userId: 'u3',
  userName: 'Mike Security',
  action: 'security.alert',
  resource: 'api',
  details: 'Detected unusual API pattern from IP 45.33.32.156',
  ipAddress: '192.168.1.102',
  severity: 'critical'
})]);
const mockServices: ServiceHealth[] = stryMutAct_9fa48("15741") ? [] : (stryCov_9fa48("15741"), [stryMutAct_9fa48("15742") ? {} : (stryCov_9fa48("15742"), {
  name: 'API Gateway',
  status: 'healthy',
  latency: 45,
  uptime: 99.99,
  lastCheck: new Date()
}), stryMutAct_9fa48("15745") ? {} : (stryCov_9fa48("15745"), {
  name: 'Ollama LLM',
  status: 'healthy',
  latency: 1200,
  uptime: 99.8,
  lastCheck: new Date()
}), stryMutAct_9fa48("15748") ? {} : (stryCov_9fa48("15748"), {
  name: 'Apache Druid',
  status: 'healthy',
  latency: 23,
  uptime: 99.95,
  lastCheck: new Date()
}), stryMutAct_9fa48("15751") ? {} : (stryCov_9fa48("15751"), {
  name: 'MinIO Storage',
  status: 'healthy',
  latency: 15,
  uptime: 99.99,
  lastCheck: new Date()
}), stryMutAct_9fa48("15754") ? {} : (stryCov_9fa48("15754"), {
  name: 'PostgreSQL',
  status: 'healthy',
  latency: 8,
  uptime: 99.99,
  lastCheck: new Date()
}), stryMutAct_9fa48("15757") ? {} : (stryCov_9fa48("15757"), {
  name: 'Redis Cache',
  status: 'degraded',
  latency: 120,
  uptime: 98.5,
  lastCheck: new Date()
}), stryMutAct_9fa48("15760") ? {} : (stryCov_9fa48("15760"), {
  name: 'Neo4j Graph',
  status: 'healthy',
  latency: 35,
  uptime: 99.9,
  lastCheck: new Date()
}), stryMutAct_9fa48("15763") ? {} : (stryCov_9fa48("15763"), {
  name: 'Webhook Service',
  status: 'healthy',
  latency: 28,
  uptime: 99.7,
  lastCheck: new Date()
})]);
type AdminTab = 'overview' | 'tenants' | 'features' | 'audit' | 'health';
const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>(mockFeatureFlags);
  const [auditLog] = useState<AuditLogEntry[]>(mockAuditLog);
  const [services] = useState<ServiceHealth[]>(mockServices);
  const [searchQuery, setSearchQuery] = useState('');
  const [impersonating, setImpersonating] = useState<string | null>(null);

  // Calculate overview stats
  const overviewStats = stryMutAct_9fa48("15769") ? {} : (stryCov_9fa48("15769"), {
    totalTenants: tenants.length,
    activeTenants: stryMutAct_9fa48("15770") ? tenants.length : (stryCov_9fa48("15770"), tenants.filter(stryMutAct_9fa48("15771") ? () => undefined : (stryCov_9fa48("15771"), t => stryMutAct_9fa48("15774") ? t.status !== 'active' : stryMutAct_9fa48("15773") ? false : stryMutAct_9fa48("15772") ? true : (stryCov_9fa48("15772", "15773", "15774"), t.status === 'active'))).length),
    totalUsers: tenants.reduce(stryMutAct_9fa48("15776") ? () => undefined : (stryCov_9fa48("15776"), (sum, t) => stryMutAct_9fa48("15777") ? sum - t.users : (stryCov_9fa48("15777"), sum + t.users)), 0),
    totalDeliberations: tenants.reduce(stryMutAct_9fa48("15778") ? () => undefined : (stryCov_9fa48("15778"), (sum, t) => stryMutAct_9fa48("15779") ? sum - t.deliberations : (stryCov_9fa48("15779"), sum + t.deliberations)), 0),
    totalStorageGB: (stryMutAct_9fa48("15780") ? tenants.reduce((sum, t) => sum + t.storageUsedMB, 0) * 1024 : (stryCov_9fa48("15780"), tenants.reduce(stryMutAct_9fa48("15781") ? () => undefined : (stryCov_9fa48("15781"), (sum, t) => stryMutAct_9fa48("15782") ? sum - t.storageUsedMB : (stryCov_9fa48("15782"), sum + t.storageUsedMB)), 0) / 1024)).toFixed(1),
    apiCallsToday: tenants.reduce(stryMutAct_9fa48("15783") ? () => undefined : (stryCov_9fa48("15783"), (sum, t) => stryMutAct_9fa48("15784") ? sum - t.apiCallsToday : (stryCov_9fa48("15784"), sum + t.apiCallsToday)), 0),
    healthyServices: stryMutAct_9fa48("15785") ? services.length : (stryCov_9fa48("15785"), services.filter(stryMutAct_9fa48("15786") ? () => undefined : (stryCov_9fa48("15786"), s => stryMutAct_9fa48("15789") ? s.status !== 'healthy' : stryMutAct_9fa48("15788") ? false : stryMutAct_9fa48("15787") ? true : (stryCov_9fa48("15787", "15788", "15789"), s.status === 'healthy'))).length),
    totalServices: services.length,
    mrr: tenants.reduce((sum, t) => {
      const prices = stryMutAct_9fa48("15792") ? {} : (stryCov_9fa48("15792"), {
        free: 0,
        pro: 299,
        enterprise: 1499,
        sovereign: 4999
      });
      return stryMutAct_9fa48("15793") ? sum - prices[t.tier] : (stryCov_9fa48("15793"), sum + prices[t.tier]);
    }, 0)
  });
  const toggleFeatureFlag = (flagId: string) => {
    setFeatureFlags(stryMutAct_9fa48("15795") ? () => undefined : (stryCov_9fa48("15795"), prev => prev.map(stryMutAct_9fa48("15796") ? () => undefined : (stryCov_9fa48("15796"), f => (stryMutAct_9fa48("15799") ? f.id !== flagId : stryMutAct_9fa48("15798") ? false : stryMutAct_9fa48("15797") ? true : (stryCov_9fa48("15797", "15798", "15799"), f.id === flagId)) ? stryMutAct_9fa48("15800") ? {} : (stryCov_9fa48("15800"), {
      ...f,
      enabled: stryMutAct_9fa48("15801") ? f.enabled : (stryCov_9fa48("15801"), !f.enabled)
    }) : f))));
  };
  const handleImpersonate = (tenantId: string) => {
    const tenant = tenants.find(stryMutAct_9fa48("15803") ? () => undefined : (stryCov_9fa48("15803"), t => stryMutAct_9fa48("15806") ? t.id !== tenantId : stryMutAct_9fa48("15805") ? false : stryMutAct_9fa48("15804") ? true : (stryCov_9fa48("15804", "15805", "15806"), t.id === tenantId)));
    if (stryMutAct_9fa48("15809") ? tenant || window.confirm(`Impersonate ${tenant.name}? This will be logged for audit.`) : stryMutAct_9fa48("15808") ? false : stryMutAct_9fa48("15807") ? true : (stryCov_9fa48("15807", "15808", "15809"), tenant && window.confirm(`Impersonate ${tenant.name}? This will be logged for audit.`))) {
      setImpersonating(tenantId);
      console.log(`[Admin] Impersonating tenant ${tenantId}`);
    }
  };
  const tierColors = stryMutAct_9fa48("15813") ? {} : (stryCov_9fa48("15813"), {
    free: 'bg-neutral-100 text-neutral-700',
    pro: 'bg-blue-100 text-blue-700',
    enterprise: 'bg-purple-100 text-purple-700',
    sovereign: 'bg-amber-100 text-amber-700'
  });
  const statusColors = stryMutAct_9fa48("15818") ? {} : (stryCov_9fa48("15818"), {
    active: 'bg-green-100 text-green-700',
    suspended: 'bg-red-100 text-red-700',
    trial: 'bg-yellow-100 text-yellow-700',
    churned: 'bg-neutral-100 text-neutral-700'
  });
  const healthColors = stryMutAct_9fa48("15823") ? {} : (stryCov_9fa48("15823"), {
    healthy: 'text-green-500',
    degraded: 'text-yellow-500',
    down: 'text-red-500'
  });
  const severityColors = stryMutAct_9fa48("15827") ? {} : (stryCov_9fa48("15827"), {
    info: 'bg-blue-100 text-blue-700',
    warning: 'bg-yellow-100 text-yellow-700',
    critical: 'bg-red-100 text-red-700'
  });
  return <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-neutral-900">🛡️ Admin Dashboard</h1>
            {stryMutAct_9fa48("15833") ? impersonating || <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm">
                <span>👤 Impersonating: {tenants.find(t => t.id === impersonating)?.name}</span>
                <button onClick={() => setImpersonating(null)} className="font-bold hover:text-amber-900">
                  ✕ Exit
                </button>
              </div> : stryMutAct_9fa48("15832") ? false : stryMutAct_9fa48("15831") ? true : (stryCov_9fa48("15831", "15832", "15833"), impersonating && <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm">
                <span>👤 Impersonating: {stryMutAct_9fa48("15834") ? tenants.find(t => t.id === impersonating).name : (stryCov_9fa48("15834"), tenants.find(stryMutAct_9fa48("15835") ? () => undefined : (stryCov_9fa48("15835"), t => stryMutAct_9fa48("15838") ? t.id !== impersonating : stryMutAct_9fa48("15837") ? false : stryMutAct_9fa48("15836") ? true : (stryCov_9fa48("15836", "15837", "15838"), t.id === impersonating)))?.name)}</span>
                <button onClick={stryMutAct_9fa48("15839") ? () => undefined : (stryCov_9fa48("15839"), () => setImpersonating(null))} className="font-bold hover:text-amber-900">
                  ✕ Exit
                </button>
              </div>)}
          </div>
          <div className="flex items-center gap-4">
            <input type="text" placeholder="Search tenants, users, logs..." value={searchQuery} onChange={stryMutAct_9fa48("15840") ? () => undefined : (stryCov_9fa48("15840"), e => setSearchQuery(e.target.value))} className="w-64 px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              + Add Tenant
            </button>
          </div>
        </div>

        {/* Tabs */}
        <nav className="flex gap-1 mt-4">
          {(stryMutAct_9fa48("15841") ? [] : (stryCov_9fa48("15841"), [stryMutAct_9fa48("15842") ? {} : (stryCov_9fa48("15842"), {
          id: 'overview',
          label: '📊 Overview',
          icon: '📊'
        }), stryMutAct_9fa48("15846") ? {} : (stryCov_9fa48("15846"), {
          id: 'tenants',
          label: '🏢 Tenants',
          icon: '🏢'
        }), stryMutAct_9fa48("15850") ? {} : (stryCov_9fa48("15850"), {
          id: 'features',
          label: '🚀 Feature Flags',
          icon: '🚀'
        }), stryMutAct_9fa48("15854") ? {} : (stryCov_9fa48("15854"), {
          id: 'audit',
          label: '📋 Audit Log',
          icon: '📋'
        }), stryMutAct_9fa48("15858") ? {} : (stryCov_9fa48("15858"), {
          id: 'health',
          label: '💓 Health',
          icon: '💓'
        })])).map(stryMutAct_9fa48("15862") ? () => undefined : (stryCov_9fa48("15862"), tab => <button key={tab.id} onClick={stryMutAct_9fa48("15863") ? () => undefined : (stryCov_9fa48("15863"), () => setActiveTab(tab.id as AdminTab))} className={cn('px-4 py-2 rounded-lg font-medium transition-colors', (stryMutAct_9fa48("15867") ? activeTab !== tab.id : stryMutAct_9fa48("15866") ? false : stryMutAct_9fa48("15865") ? true : (stryCov_9fa48("15865", "15866", "15867"), activeTab === tab.id)) ? 'bg-primary-100 text-primary-700' : 'text-neutral-600 hover:bg-neutral-100')}>
              {tab.label}
            </button>))}
        </nav>
      </header>

      {/* Content */}
      <main className="p-6">
        {/* Overview Tab */}
        {stryMutAct_9fa48("15872") ? activeTab === 'overview' || <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-5 border border-neutral-200">
                <div className="text-sm text-neutral-500">Total Tenants</div>
                <div className="text-3xl font-bold text-neutral-900">{overviewStats.totalTenants}</div>
                <div className="text-sm text-green-600">+3 this month</div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-neutral-200">
                <div className="text-sm text-neutral-500">Active Users</div>
                <div className="text-3xl font-bold text-neutral-900">{overviewStats.totalUsers.toLocaleString()}</div>
                <div className="text-sm text-green-600">+12% MoM</div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-neutral-200">
                <div className="text-sm text-neutral-500">Monthly Revenue</div>
                <div className="text-3xl font-bold text-neutral-900">${overviewStats.mrr.toLocaleString()}</div>
                <div className="text-sm text-green-600">+8% MoM</div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-neutral-200">
                <div className="text-sm text-neutral-500">System Health</div>
                <div className="text-3xl font-bold text-green-600">{overviewStats.healthyServices}/{overviewStats.totalServices}</div>
                <div className="text-sm text-neutral-500">services healthy</div>
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 border border-neutral-200">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Deliberations Today</span>
                  <span className="text-2xl font-bold">1,234</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-neutral-200">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">API Calls Today</span>
                  <span className="text-2xl font-bold">{overviewStats.apiCallsToday.toLocaleString()}</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-neutral-200">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Storage Used</span>
                  <span className="text-2xl font-bold">{overviewStats.totalStorageGB} GB</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-neutral-200">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Feature Flags</span>
                  <span className="text-2xl font-bold">{featureFlags.filter(f => f.enabled).length}/{featureFlags.length}</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-neutral-200">
              <div className="px-5 py-4 border-b border-neutral-200">
                <h2 className="font-semibold text-neutral-900">Recent Activity</h2>
              </div>
              <div className="divide-y divide-neutral-100">
                {auditLog.slice(0, 5).map(entry => <div key={entry.id} className="px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={cn('px-2 py-0.5 rounded text-xs font-medium', severityColors[entry.severity])}>
                        {entry.severity}
                      </span>
                      <span className="text-neutral-900">{entry.action}</span>
                      <span className="text-neutral-500">by {entry.userName}</span>
                    </div>
                    <span className="text-sm text-neutral-400">
                      {entry.timestamp.toLocaleTimeString()}
                    </span>
                  </div>)}
              </div>
            </div>
          </div> : stryMutAct_9fa48("15871") ? false : stryMutAct_9fa48("15870") ? true : (stryCov_9fa48("15870", "15871", "15872"), (stryMutAct_9fa48("15874") ? activeTab !== 'overview' : stryMutAct_9fa48("15873") ? true : (stryCov_9fa48("15873", "15874"), activeTab === 'overview')) && <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-5 border border-neutral-200">
                <div className="text-sm text-neutral-500">Total Tenants</div>
                <div className="text-3xl font-bold text-neutral-900">{overviewStats.totalTenants}</div>
                <div className="text-sm text-green-600">+3 this month</div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-neutral-200">
                <div className="text-sm text-neutral-500">Active Users</div>
                <div className="text-3xl font-bold text-neutral-900">{overviewStats.totalUsers.toLocaleString()}</div>
                <div className="text-sm text-green-600">+12% MoM</div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-neutral-200">
                <div className="text-sm text-neutral-500">Monthly Revenue</div>
                <div className="text-3xl font-bold text-neutral-900">${overviewStats.mrr.toLocaleString()}</div>
                <div className="text-sm text-green-600">+8% MoM</div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-neutral-200">
                <div className="text-sm text-neutral-500">System Health</div>
                <div className="text-3xl font-bold text-green-600">{overviewStats.healthyServices}/{overviewStats.totalServices}</div>
                <div className="text-sm text-neutral-500">services healthy</div>
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 border border-neutral-200">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Deliberations Today</span>
                  <span className="text-2xl font-bold">1,234</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-neutral-200">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">API Calls Today</span>
                  <span className="text-2xl font-bold">{overviewStats.apiCallsToday.toLocaleString()}</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-neutral-200">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Storage Used</span>
                  <span className="text-2xl font-bold">{overviewStats.totalStorageGB} GB</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-neutral-200">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Feature Flags</span>
                  <span className="text-2xl font-bold">{stryMutAct_9fa48("15876") ? featureFlags.length : (stryCov_9fa48("15876"), featureFlags.filter(stryMutAct_9fa48("15877") ? () => undefined : (stryCov_9fa48("15877"), f => f.enabled)).length)}/{featureFlags.length}</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-neutral-200">
              <div className="px-5 py-4 border-b border-neutral-200">
                <h2 className="font-semibold text-neutral-900">Recent Activity</h2>
              </div>
              <div className="divide-y divide-neutral-100">
                {stryMutAct_9fa48("15878") ? auditLog.map(entry => <div key={entry.id} className="px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={cn('px-2 py-0.5 rounded text-xs font-medium', severityColors[entry.severity])}>
                        {entry.severity}
                      </span>
                      <span className="text-neutral-900">{entry.action}</span>
                      <span className="text-neutral-500">by {entry.userName}</span>
                    </div>
                    <span className="text-sm text-neutral-400">
                      {entry.timestamp.toLocaleTimeString()}
                    </span>
                  </div>) : (stryCov_9fa48("15878"), auditLog.slice(0, 5).map(stryMutAct_9fa48("15879") ? () => undefined : (stryCov_9fa48("15879"), entry => <div key={entry.id} className="px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={cn('px-2 py-0.5 rounded text-xs font-medium', severityColors[entry.severity])}>
                        {entry.severity}
                      </span>
                      <span className="text-neutral-900">{entry.action}</span>
                      <span className="text-neutral-500">by {entry.userName}</span>
                    </div>
                    <span className="text-sm text-neutral-400">
                      {entry.timestamp.toLocaleTimeString()}
                    </span>
                  </div>)))}
              </div>
            </div>
          </div>)}

        {/* Tenants Tab */}
        {stryMutAct_9fa48("15883") ? activeTab === 'tenants' || <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left px-5 py-3 text-sm font-medium text-neutral-500">Organization</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-neutral-500">Tier</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-neutral-500">Status</th>
                  <th className="text-right px-5 py-3 text-sm font-medium text-neutral-500">Users</th>
                  <th className="text-right px-5 py-3 text-sm font-medium text-neutral-500">Deliberations</th>
                  <th className="text-right px-5 py-3 text-sm font-medium text-neutral-500">API Calls</th>
                  <th className="text-right px-5 py-3 text-sm font-medium text-neutral-500">Storage</th>
                  <th className="text-right px-5 py-3 text-sm font-medium text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {tenants.map(tenant => <tr key={tenant.id} className="hover:bg-neutral-50">
                    <td className="px-5 py-4">
                      <div>
                        <div className="font-medium text-neutral-900">{tenant.name}</div>
                        <div className="text-sm text-neutral-500">{tenant.slug}</div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn('px-2 py-1 rounded text-xs font-medium', tierColors[tenant.tier])}>
                        {tenant.tier}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn('px-2 py-1 rounded text-xs font-medium', statusColors[tenant.status])}>
                        {tenant.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right text-neutral-900">{tenant.users}</td>
                    <td className="px-5 py-4 text-right text-neutral-900">{tenant.deliberations.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right text-neutral-900">{tenant.apiCallsToday.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right text-neutral-900">{(tenant.storageUsedMB / 1024).toFixed(1)} GB</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleImpersonate(tenant.id)} className="px-2 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 rounded" title="Impersonate">
                          👤
                        </button>
                        <button className="px-2 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 rounded" title="Edit">
                          ✏️
                        </button>
                        <button className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded" title="Suspend">
                          ⏸️
                        </button>
                      </div>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div> : stryMutAct_9fa48("15882") ? false : stryMutAct_9fa48("15881") ? true : (stryCov_9fa48("15881", "15882", "15883"), (stryMutAct_9fa48("15885") ? activeTab !== 'tenants' : stryMutAct_9fa48("15884") ? true : (stryCov_9fa48("15884", "15885"), activeTab === 'tenants')) && <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left px-5 py-3 text-sm font-medium text-neutral-500">Organization</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-neutral-500">Tier</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-neutral-500">Status</th>
                  <th className="text-right px-5 py-3 text-sm font-medium text-neutral-500">Users</th>
                  <th className="text-right px-5 py-3 text-sm font-medium text-neutral-500">Deliberations</th>
                  <th className="text-right px-5 py-3 text-sm font-medium text-neutral-500">API Calls</th>
                  <th className="text-right px-5 py-3 text-sm font-medium text-neutral-500">Storage</th>
                  <th className="text-right px-5 py-3 text-sm font-medium text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {tenants.map(stryMutAct_9fa48("15887") ? () => undefined : (stryCov_9fa48("15887"), tenant => <tr key={tenant.id} className="hover:bg-neutral-50">
                    <td className="px-5 py-4">
                      <div>
                        <div className="font-medium text-neutral-900">{tenant.name}</div>
                        <div className="text-sm text-neutral-500">{tenant.slug}</div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn('px-2 py-1 rounded text-xs font-medium', tierColors[tenant.tier])}>
                        {tenant.tier}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn('px-2 py-1 rounded text-xs font-medium', statusColors[tenant.status])}>
                        {tenant.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right text-neutral-900">{tenant.users}</td>
                    <td className="px-5 py-4 text-right text-neutral-900">{tenant.deliberations.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right text-neutral-900">{tenant.apiCallsToday.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right text-neutral-900">{(stryMutAct_9fa48("15890") ? tenant.storageUsedMB * 1024 : (stryCov_9fa48("15890"), tenant.storageUsedMB / 1024)).toFixed(1)} GB</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={stryMutAct_9fa48("15891") ? () => undefined : (stryCov_9fa48("15891"), () => handleImpersonate(tenant.id))} className="px-2 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 rounded" title="Impersonate">
                          👤
                        </button>
                        <button className="px-2 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 rounded" title="Edit">
                          ✏️
                        </button>
                        <button className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded" title="Suspend">
                          ⏸️
                        </button>
                      </div>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>)}

        {/* Feature Flags Tab */}
        {stryMutAct_9fa48("15894") ? activeTab === 'features' || <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-neutral-900">Feature Flags</h2>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                + New Flag
              </button>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 divide-y divide-neutral-100">
              {featureFlags.map(flag => <div key={flag.id} className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-neutral-900">{flag.name}</h3>
                        <code className="px-2 py-0.5 bg-neutral-100 rounded text-sm text-neutral-600">{flag.key}</code>
                      </div>
                      <p className="text-sm text-neutral-500 mt-1">{flag.description}</p>
                      {flag.enabledForTenants.length > 0 && <p className="text-xs text-neutral-400 mt-2">
                          Enabled for: {flag.enabledForTenants.map(id => tenants.find(t => t.id === id)?.name).join(', ')}
                        </p>}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-neutral-500">Rollout</div>
                        <div className="font-medium">{flag.rolloutPercentage}%</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={flag.enabled} onChange={() => toggleFeatureFlag(flag.id)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </div>)}
            </div>
          </div> : stryMutAct_9fa48("15893") ? false : stryMutAct_9fa48("15892") ? true : (stryCov_9fa48("15892", "15893", "15894"), (stryMutAct_9fa48("15896") ? activeTab !== 'features' : stryMutAct_9fa48("15895") ? true : (stryCov_9fa48("15895", "15896"), activeTab === 'features')) && <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-neutral-900">Feature Flags</h2>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                + New Flag
              </button>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 divide-y divide-neutral-100">
              {featureFlags.map(stryMutAct_9fa48("15898") ? () => undefined : (stryCov_9fa48("15898"), flag => <div key={flag.id} className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-neutral-900">{flag.name}</h3>
                        <code className="px-2 py-0.5 bg-neutral-100 rounded text-sm text-neutral-600">{flag.key}</code>
                      </div>
                      <p className="text-sm text-neutral-500 mt-1">{flag.description}</p>
                      {stryMutAct_9fa48("15901") ? flag.enabledForTenants.length > 0 || <p className="text-xs text-neutral-400 mt-2">
                          Enabled for: {flag.enabledForTenants.map(id => tenants.find(t => t.id === id)?.name).join(', ')}
                        </p> : stryMutAct_9fa48("15900") ? false : stryMutAct_9fa48("15899") ? true : (stryCov_9fa48("15899", "15900", "15901"), (stryMutAct_9fa48("15904") ? flag.enabledForTenants.length <= 0 : stryMutAct_9fa48("15903") ? flag.enabledForTenants.length >= 0 : stryMutAct_9fa48("15902") ? true : (stryCov_9fa48("15902", "15903", "15904"), flag.enabledForTenants.length > 0)) && <p className="text-xs text-neutral-400 mt-2">
                          Enabled for: {flag.enabledForTenants.map(stryMutAct_9fa48("15905") ? () => undefined : (stryCov_9fa48("15905"), id => stryMutAct_9fa48("15906") ? tenants.find(t => t.id === id).name : (stryCov_9fa48("15906"), tenants.find(stryMutAct_9fa48("15907") ? () => undefined : (stryCov_9fa48("15907"), t => stryMutAct_9fa48("15910") ? t.id !== id : stryMutAct_9fa48("15909") ? false : stryMutAct_9fa48("15908") ? true : (stryCov_9fa48("15908", "15909", "15910"), t.id === id)))?.name))).join(', ')}
                        </p>)}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-neutral-500">Rollout</div>
                        <div className="font-medium">{flag.rolloutPercentage}%</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={flag.enabled} onChange={stryMutAct_9fa48("15912") ? () => undefined : (stryCov_9fa48("15912"), () => toggleFeatureFlag(flag.id))} className="sr-only peer" />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </div>))}
            </div>
          </div>)}

        {/* Audit Log Tab */}
        {stryMutAct_9fa48("15915") ? activeTab === 'audit' || <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="font-semibold text-neutral-900">Audit Log</h2>
              <div className="flex items-center gap-2">
                <select className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm">
                  <option>All Severity</option>
                  <option>Critical</option>
                  <option>Warning</option>
                  <option>Info</option>
                </select>
                <button className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm">
                  📥 Export
                </button>
              </div>
            </div>
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left px-5 py-3 text-sm font-medium text-neutral-500">Timestamp</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-neutral-500">Severity</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-neutral-500">User</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-neutral-500">Action</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-neutral-500">Details</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-neutral-500">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {auditLog.map(entry => <tr key={entry.id} className="hover:bg-neutral-50">
                    <td className="px-5 py-3 text-sm text-neutral-900">
                      {entry.timestamp.toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      <span className={cn('px-2 py-0.5 rounded text-xs font-medium', severityColors[entry.severity])}>
                        {entry.severity}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-neutral-900">{entry.userName}</td>
                    <td className="px-5 py-3 text-sm font-mono text-neutral-700">{entry.action}</td>
                    <td className="px-5 py-3 text-sm text-neutral-500 max-w-xs truncate">{entry.details}</td>
                    <td className="px-5 py-3 text-sm font-mono text-neutral-500">{entry.ipAddress}</td>
                  </tr>)}
              </tbody>
            </table>
          </div> : stryMutAct_9fa48("15914") ? false : stryMutAct_9fa48("15913") ? true : (stryCov_9fa48("15913", "15914", "15915"), (stryMutAct_9fa48("15917") ? activeTab !== 'audit' : stryMutAct_9fa48("15916") ? true : (stryCov_9fa48("15916", "15917"), activeTab === 'audit')) && <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="font-semibold text-neutral-900">Audit Log</h2>
              <div className="flex items-center gap-2">
                <select className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm">
                  <option>All Severity</option>
                  <option>Critical</option>
                  <option>Warning</option>
                  <option>Info</option>
                </select>
                <button className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm">
                  📥 Export
                </button>
              </div>
            </div>
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left px-5 py-3 text-sm font-medium text-neutral-500">Timestamp</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-neutral-500">Severity</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-neutral-500">User</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-neutral-500">Action</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-neutral-500">Details</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-neutral-500">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {auditLog.map(stryMutAct_9fa48("15919") ? () => undefined : (stryCov_9fa48("15919"), entry => <tr key={entry.id} className="hover:bg-neutral-50">
                    <td className="px-5 py-3 text-sm text-neutral-900">
                      {entry.timestamp.toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      <span className={cn('px-2 py-0.5 rounded text-xs font-medium', severityColors[entry.severity])}>
                        {entry.severity}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-neutral-900">{entry.userName}</td>
                    <td className="px-5 py-3 text-sm font-mono text-neutral-700">{entry.action}</td>
                    <td className="px-5 py-3 text-sm text-neutral-500 max-w-xs truncate">{entry.details}</td>
                    <td className="px-5 py-3 text-sm font-mono text-neutral-500">{entry.ipAddress}</td>
                  </tr>))}
              </tbody>
            </table>
          </div>)}

        {/* Health Tab */}
        {stryMutAct_9fa48("15923") ? activeTab === 'health' || <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900">Service Health</h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm text-neutral-500">Last checked: just now</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {services.map(service => <div key={service.name} className="bg-white rounded-xl p-5 border border-neutral-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-neutral-900">{service.name}</h3>
                    <span className={cn('text-2xl', healthColors[service.status])}>
                      {service.status === 'healthy' ? '●' : service.status === 'degraded' ? '◐' : '○'}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Latency</span>
                      <span className="font-medium">{service.latency}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Uptime</span>
                      <span className="font-medium">{service.uptime}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Status</span>
                      <span className={cn('font-medium capitalize', healthColors[service.status])}>
                        {service.status}
                      </span>
                    </div>
                  </div>
                </div>)}
            </div>
          </div> : stryMutAct_9fa48("15922") ? false : stryMutAct_9fa48("15921") ? true : (stryCov_9fa48("15921", "15922", "15923"), (stryMutAct_9fa48("15925") ? activeTab !== 'health' : stryMutAct_9fa48("15924") ? true : (stryCov_9fa48("15924", "15925"), activeTab === 'health')) && <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900">Service Health</h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm text-neutral-500">Last checked: just now</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {services.map(stryMutAct_9fa48("15927") ? () => undefined : (stryCov_9fa48("15927"), service => <div key={service.name} className="bg-white rounded-xl p-5 border border-neutral-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-neutral-900">{service.name}</h3>
                    <span className={cn('text-2xl', healthColors[service.status])}>
                      {(stryMutAct_9fa48("15931") ? service.status !== 'healthy' : stryMutAct_9fa48("15930") ? false : stryMutAct_9fa48("15929") ? true : (stryCov_9fa48("15929", "15930", "15931"), service.status === 'healthy')) ? '●' : (stryMutAct_9fa48("15936") ? service.status !== 'degraded' : stryMutAct_9fa48("15935") ? false : stryMutAct_9fa48("15934") ? true : (stryCov_9fa48("15934", "15935", "15936"), service.status === 'degraded')) ? '◐' : '○'}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Latency</span>
                      <span className="font-medium">{service.latency}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Uptime</span>
                      <span className="font-medium">{service.uptime}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Status</span>
                      <span className={cn('font-medium capitalize', healthColors[service.status])}>
                        {service.status}
                      </span>
                    </div>
                  </div>
                </div>))}
            </div>
          </div>)}
      </main>
    </div>;
};
export default AdminDashboard;