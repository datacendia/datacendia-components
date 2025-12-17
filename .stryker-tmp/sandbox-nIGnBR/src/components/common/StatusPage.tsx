/**
 * Public Status Page Component
 * 
 * Quick Win: Public status page showing system health
 * - Real-time service status
 * - Uptime history
 * - Incident history
 * - Scheduled maintenance
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
interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  latency?: number;
  uptime: number;
  lastChecked: Date;
}
interface Incident {
  id: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'minor' | 'major' | 'critical';
  affectedServices: string[];
  createdAt: Date;
  updatedAt: Date;
  updates: {
    timestamp: Date;
    message: string;
  }[];
}
interface MaintenanceWindow {
  id: string;
  title: string;
  description: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  affectedServices: string[];
  status: 'scheduled' | 'in_progress' | 'completed';
}
const StatusPage: React.FC = () => {
  const [services, setServices] = useState<ServiceStatus[]>(stryMutAct_9fa48("1755") ? [] : (stryCov_9fa48("1755"), [stryMutAct_9fa48("1756") ? {} : (stryCov_9fa48("1756"), {
    name: 'API Gateway',
    status: 'operational',
    latency: 45,
    uptime: 99.99,
    lastChecked: new Date()
  }), stryMutAct_9fa48("1759") ? {} : (stryCov_9fa48("1759"), {
    name: 'Council Deliberations',
    status: 'operational',
    latency: 1200,
    uptime: 99.95,
    lastChecked: new Date()
  }), stryMutAct_9fa48("1762") ? {} : (stryCov_9fa48("1762"), {
    name: 'Knowledge Graph',
    status: 'operational',
    latency: 35,
    uptime: 99.98,
    lastChecked: new Date()
  }), stryMutAct_9fa48("1765") ? {} : (stryCov_9fa48("1765"), {
    name: 'CendiaChronos',
    status: 'operational',
    latency: 28,
    uptime: 99.97,
    lastChecked: new Date()
  }), stryMutAct_9fa48("1768") ? {} : (stryCov_9fa48("1768"), {
    name: 'Real-time Updates',
    status: 'operational',
    latency: 15,
    uptime: 99.99,
    lastChecked: new Date()
  }), stryMutAct_9fa48("1771") ? {} : (stryCov_9fa48("1771"), {
    name: 'File Storage',
    status: 'operational',
    latency: 22,
    uptime: 99.99,
    lastChecked: new Date()
  }), stryMutAct_9fa48("1774") ? {} : (stryCov_9fa48("1774"), {
    name: 'Authentication',
    status: 'operational',
    latency: 18,
    uptime: 99.99,
    lastChecked: new Date()
  }), stryMutAct_9fa48("1777") ? {} : (stryCov_9fa48("1777"), {
    name: 'Analytics',
    status: 'operational',
    latency: 55,
    uptime: 99.90,
    lastChecked: new Date()
  })]));
  const [incidents, setIncidents] = useState<Incident[]>(stryMutAct_9fa48("1780") ? [] : (stryCov_9fa48("1780"), [stryMutAct_9fa48("1781") ? {} : (stryCov_9fa48("1781"), {
    id: 'inc-001',
    title: 'Elevated API latency in EU region',
    status: 'resolved',
    severity: 'minor',
    affectedServices: stryMutAct_9fa48("1786") ? [] : (stryCov_9fa48("1786"), ['API Gateway']),
    createdAt: new Date(stryMutAct_9fa48("1788") ? Date.now() + 86400000 * 2 : (stryCov_9fa48("1788"), Date.now() - (stryMutAct_9fa48("1789") ? 86400000 / 2 : (stryCov_9fa48("1789"), 86400000 * 2)))),
    updatedAt: new Date(stryMutAct_9fa48("1790") ? Date.now() - 86400000 * 2 - 3600000 : (stryCov_9fa48("1790"), (stryMutAct_9fa48("1791") ? Date.now() + 86400000 * 2 : (stryCov_9fa48("1791"), Date.now() - (stryMutAct_9fa48("1792") ? 86400000 / 2 : (stryCov_9fa48("1792"), 86400000 * 2)))) + 3600000)),
    updates: stryMutAct_9fa48("1793") ? [] : (stryCov_9fa48("1793"), [stryMutAct_9fa48("1794") ? {} : (stryCov_9fa48("1794"), {
      timestamp: new Date(stryMutAct_9fa48("1795") ? Date.now() + 86400000 * 2 : (stryCov_9fa48("1795"), Date.now() - (stryMutAct_9fa48("1796") ? 86400000 / 2 : (stryCov_9fa48("1796"), 86400000 * 2)))),
      message: 'Investigating elevated latency in EU region'
    }), stryMutAct_9fa48("1798") ? {} : (stryCov_9fa48("1798"), {
      timestamp: new Date(stryMutAct_9fa48("1799") ? Date.now() - 86400000 * 2 - 1800000 : (stryCov_9fa48("1799"), (stryMutAct_9fa48("1800") ? Date.now() + 86400000 * 2 : (stryCov_9fa48("1800"), Date.now() - (stryMutAct_9fa48("1801") ? 86400000 / 2 : (stryCov_9fa48("1801"), 86400000 * 2)))) + 1800000)),
      message: 'Identified cause as network congestion'
    }), stryMutAct_9fa48("1803") ? {} : (stryCov_9fa48("1803"), {
      timestamp: new Date(stryMutAct_9fa48("1804") ? Date.now() - 86400000 * 2 - 3600000 : (stryCov_9fa48("1804"), (stryMutAct_9fa48("1805") ? Date.now() + 86400000 * 2 : (stryCov_9fa48("1805"), Date.now() - (stryMutAct_9fa48("1806") ? 86400000 / 2 : (stryCov_9fa48("1806"), 86400000 * 2)))) + 3600000)),
      message: 'Issue resolved, latency returned to normal'
    })])
  })]));
  const [maintenance, setMaintenance] = useState<MaintenanceWindow[]>(stryMutAct_9fa48("1808") ? [] : (stryCov_9fa48("1808"), [stryMutAct_9fa48("1809") ? {} : (stryCov_9fa48("1809"), {
    id: 'maint-001',
    title: 'Database maintenance',
    description: 'Scheduled database optimization and index rebuilding',
    scheduledStart: new Date(stryMutAct_9fa48("1813") ? Date.now() - 86400000 * 3 : (stryCov_9fa48("1813"), Date.now() + (stryMutAct_9fa48("1814") ? 86400000 / 3 : (stryCov_9fa48("1814"), 86400000 * 3)))),
    scheduledEnd: new Date(stryMutAct_9fa48("1815") ? Date.now() + 86400000 * 3 - 7200000 : (stryCov_9fa48("1815"), (stryMutAct_9fa48("1816") ? Date.now() - 86400000 * 3 : (stryCov_9fa48("1816"), Date.now() + (stryMutAct_9fa48("1817") ? 86400000 / 3 : (stryCov_9fa48("1817"), 86400000 * 3)))) + 7200000)),
    affectedServices: stryMutAct_9fa48("1818") ? [] : (stryCov_9fa48("1818"), ['Knowledge Graph', 'Analytics']),
    status: 'scheduled'
  })]));
  const [uptimeData] = useState<number[]>(stryMutAct_9fa48("1822") ? [] : (stryCov_9fa48("1822"), [99.99, 99.99, 99.95, 99.99, 99.99, 99.99, 99.99, 99.98, 99.99, 99.99, 99.99, 99.99, 99.90, 99.99, 99.99, 99.99, 99.99, 99.99, 99.95, 99.99, 99.99, 99.99, 99.99, 99.99, 99.99, 99.99, 99.99, 99.99, 99.99, 99.99]));
  const getOverallStatus = () => {
    if (stryMutAct_9fa48("1826") ? services.every(s => s.status === 'outage') : stryMutAct_9fa48("1825") ? false : stryMutAct_9fa48("1824") ? true : (stryCov_9fa48("1824", "1825", "1826"), services.some(stryMutAct_9fa48("1827") ? () => undefined : (stryCov_9fa48("1827"), s => stryMutAct_9fa48("1830") ? s.status !== 'outage' : stryMutAct_9fa48("1829") ? false : stryMutAct_9fa48("1828") ? true : (stryCov_9fa48("1828", "1829", "1830"), s.status === 'outage'))))) return 'outage';
    if (stryMutAct_9fa48("1835") ? services.every(s => s.status === 'degraded') : stryMutAct_9fa48("1834") ? false : stryMutAct_9fa48("1833") ? true : (stryCov_9fa48("1833", "1834", "1835"), services.some(stryMutAct_9fa48("1836") ? () => undefined : (stryCov_9fa48("1836"), s => stryMutAct_9fa48("1839") ? s.status !== 'degraded' : stryMutAct_9fa48("1838") ? false : stryMutAct_9fa48("1837") ? true : (stryCov_9fa48("1837", "1838", "1839"), s.status === 'degraded'))))) return 'degraded';
    if (stryMutAct_9fa48("1844") ? services.every(s => s.status === 'maintenance') : stryMutAct_9fa48("1843") ? false : stryMutAct_9fa48("1842") ? true : (stryCov_9fa48("1842", "1843", "1844"), services.some(stryMutAct_9fa48("1845") ? () => undefined : (stryCov_9fa48("1845"), s => stryMutAct_9fa48("1848") ? s.status !== 'maintenance' : stryMutAct_9fa48("1847") ? false : stryMutAct_9fa48("1846") ? true : (stryCov_9fa48("1846", "1847", "1848"), s.status === 'maintenance'))))) return 'maintenance';
    return 'operational';
  };
  const overallStatus = getOverallStatus();
  const overallUptime = (stryMutAct_9fa48("1852") ? services.reduce((sum, s) => sum + s.uptime, 0) * services.length : (stryCov_9fa48("1852"), services.reduce(stryMutAct_9fa48("1853") ? () => undefined : (stryCov_9fa48("1853"), (sum, s) => stryMutAct_9fa48("1854") ? sum - s.uptime : (stryCov_9fa48("1854"), sum + s.uptime)), 0) / services.length)).toFixed(2);
  const statusConfig = stryMutAct_9fa48("1855") ? {} : (stryCov_9fa48("1855"), {
    operational: stryMutAct_9fa48("1856") ? {} : (stryCov_9fa48("1856"), {
      color: 'bg-green-500',
      text: 'All Systems Operational',
      icon: '✓'
    }),
    degraded: stryMutAct_9fa48("1860") ? {} : (stryCov_9fa48("1860"), {
      color: 'bg-yellow-500',
      text: 'Partial System Outage',
      icon: '⚠'
    }),
    outage: stryMutAct_9fa48("1864") ? {} : (stryCov_9fa48("1864"), {
      color: 'bg-red-500',
      text: 'Major System Outage',
      icon: '✕'
    }),
    maintenance: stryMutAct_9fa48("1868") ? {} : (stryCov_9fa48("1868"), {
      color: 'bg-blue-500',
      text: 'Scheduled Maintenance',
      icon: '🔧'
    })
  });
  const serviceStatusColors = stryMutAct_9fa48("1872") ? {} : (stryCov_9fa48("1872"), {
    operational: 'bg-green-500',
    degraded: 'bg-yellow-500',
    outage: 'bg-red-500',
    maintenance: 'bg-blue-500'
  });
  const incidentSeverityColors = stryMutAct_9fa48("1877") ? {} : (stryCov_9fa48("1877"), {
    minor: 'bg-yellow-100 text-yellow-800',
    major: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  });
  const incidentStatusColors = stryMutAct_9fa48("1881") ? {} : (stryCov_9fa48("1881"), {
    investigating: 'text-red-600',
    identified: 'text-orange-600',
    monitoring: 'text-blue-600',
    resolved: 'text-green-600'
  });
  return <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎯</span>
              <h1 className="text-xl font-bold text-neutral-900">Datacendia Status</h1>
            </div>
            <a href="https://datacendia.com" className="text-sm text-primary-600 hover:text-primary-700">
              ← Back to Datacendia
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Overall Status Banner */}
        <div className={cn("rounded-xl p-6 mb-8 text-white", statusConfig[overallStatus].color)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-3xl">{statusConfig[overallStatus].icon}</span>
              <div>
                <h2 className="text-2xl font-bold">{statusConfig[overallStatus].text}</h2>
                <p className="text-white/80">
                  {overallUptime}% uptime over the last 30 days
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/70">Last updated</div>
              <div className="font-medium">{new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </div>

        {/* Uptime Graph */}
        <section className="bg-white rounded-xl border border-neutral-200 p-6 mb-8">
          <h3 className="font-semibold text-neutral-900 mb-4">30-Day Uptime History</h3>
          <div className="flex items-end gap-1 h-16">
            {uptimeData.map(stryMutAct_9fa48("1887") ? () => undefined : (stryCov_9fa48("1887"), (uptime, i) => <div key={i} className={cn("flex-1 rounded-t transition-all hover:opacity-80", (stryMutAct_9fa48("1892") ? uptime < 99.95 : stryMutAct_9fa48("1891") ? uptime > 99.95 : stryMutAct_9fa48("1890") ? false : stryMutAct_9fa48("1889") ? true : (stryCov_9fa48("1889", "1890", "1891", "1892"), uptime >= 99.95)) ? 'bg-green-500' : (stryMutAct_9fa48("1897") ? uptime < 99.0 : stryMutAct_9fa48("1896") ? uptime > 99.0 : stryMutAct_9fa48("1895") ? false : stryMutAct_9fa48("1894") ? true : (stryCov_9fa48("1894", "1895", "1896", "1897"), uptime >= 99.0)) ? 'bg-yellow-500' : 'bg-red-500')} style={stryMutAct_9fa48("1900") ? {} : (stryCov_9fa48("1900"), {
            height: `${stryMutAct_9fa48("1902") ? Math.min(20, (uptime - 98) * 50) : (stryCov_9fa48("1902"), Math.max(20, stryMutAct_9fa48("1903") ? (uptime - 98) / 50 : (stryCov_9fa48("1903"), (stryMutAct_9fa48("1904") ? uptime + 98 : (stryCov_9fa48("1904"), uptime - 98)) * 50)))}%`
          })} title={`Day ${stryMutAct_9fa48("1906") ? i - 1 : (stryCov_9fa48("1906"), i + 1)}: ${uptime}%`} />))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-neutral-400">
            <span>30 days ago</span>
            <span>Today</span>
          </div>
        </section>

        {/* Services Status */}
        <section className="bg-white rounded-xl border border-neutral-200 mb-8">
          <div className="px-6 py-4 border-b border-neutral-200">
            <h3 className="font-semibold text-neutral-900">Service Status</h3>
          </div>
          <div className="divide-y divide-neutral-100">
            {services.map(stryMutAct_9fa48("1907") ? () => undefined : (stryCov_9fa48("1907"), service => <div key={service.name} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("w-3 h-3 rounded-full", serviceStatusColors[service.status])} />
                  <span className="font-medium text-neutral-900">{service.name}</span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  {stryMutAct_9fa48("1911") ? service.latency || <span className="text-neutral-500">{service.latency}ms</span> : stryMutAct_9fa48("1910") ? false : stryMutAct_9fa48("1909") ? true : (stryCov_9fa48("1909", "1910", "1911"), service.latency && <span className="text-neutral-500">{service.latency}ms</span>)}
                  <span className="text-neutral-500">{service.uptime}%</span>
                  <span className={cn("capitalize font-medium", (stryMutAct_9fa48("1915") ? service.status !== 'operational' : stryMutAct_9fa48("1914") ? false : stryMutAct_9fa48("1913") ? true : (stryCov_9fa48("1913", "1914", "1915"), service.status === 'operational')) ? 'text-green-600' : (stryMutAct_9fa48("1920") ? service.status !== 'degraded' : stryMutAct_9fa48("1919") ? false : stryMutAct_9fa48("1918") ? true : (stryCov_9fa48("1918", "1919", "1920"), service.status === 'degraded')) ? 'text-yellow-600' : (stryMutAct_9fa48("1925") ? service.status !== 'outage' : stryMutAct_9fa48("1924") ? false : stryMutAct_9fa48("1923") ? true : (stryCov_9fa48("1923", "1924", "1925"), service.status === 'outage')) ? 'text-red-600' : 'text-blue-600')}>
                    {service.status}
                  </span>
                </div>
              </div>))}
          </div>
        </section>

        {/* Scheduled Maintenance */}
        {stryMutAct_9fa48("1931") ? maintenance.length > 0 || <section className="bg-white rounded-xl border border-neutral-200 mb-8">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h3 className="font-semibold text-neutral-900">Scheduled Maintenance</h3>
            </div>
            <div className="divide-y divide-neutral-100">
              {maintenance.map(m => <div key={m.id} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-neutral-900">{m.title}</h4>
                    <span className={cn("px-2 py-1 rounded text-xs font-medium", m.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : m.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700')}>
                      {m.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 mb-2">{m.description}</p>
                  <div className="flex items-center gap-4 text-xs text-neutral-500">
                    <span>📅 {m.scheduledStart.toLocaleDateString()} {m.scheduledStart.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })} - {m.scheduledEnd.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
                    <span>Affects: {m.affectedServices.join(', ')}</span>
                  </div>
                </div>)}
            </div>
          </section> : stryMutAct_9fa48("1930") ? false : stryMutAct_9fa48("1929") ? true : (stryCov_9fa48("1929", "1930", "1931"), (stryMutAct_9fa48("1934") ? maintenance.length <= 0 : stryMutAct_9fa48("1933") ? maintenance.length >= 0 : stryMutAct_9fa48("1932") ? true : (stryCov_9fa48("1932", "1933", "1934"), maintenance.length > 0)) && <section className="bg-white rounded-xl border border-neutral-200 mb-8">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h3 className="font-semibold text-neutral-900">Scheduled Maintenance</h3>
            </div>
            <div className="divide-y divide-neutral-100">
              {maintenance.map(stryMutAct_9fa48("1935") ? () => undefined : (stryCov_9fa48("1935"), m => <div key={m.id} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-neutral-900">{m.title}</h4>
                    <span className={cn("px-2 py-1 rounded text-xs font-medium", (stryMutAct_9fa48("1939") ? m.status !== 'scheduled' : stryMutAct_9fa48("1938") ? false : stryMutAct_9fa48("1937") ? true : (stryCov_9fa48("1937", "1938", "1939"), m.status === 'scheduled')) ? 'bg-blue-100 text-blue-700' : (stryMutAct_9fa48("1944") ? m.status !== 'in_progress' : stryMutAct_9fa48("1943") ? false : stryMutAct_9fa48("1942") ? true : (stryCov_9fa48("1942", "1943", "1944"), m.status === 'in_progress')) ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700')}>
                      {m.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 mb-2">{m.description}</p>
                  <div className="flex items-center gap-4 text-xs text-neutral-500">
                    <span>📅 {m.scheduledStart.toLocaleDateString()} {m.scheduledStart.toLocaleTimeString(stryMutAct_9fa48("1950") ? ["Stryker was here"] : (stryCov_9fa48("1950"), []), stryMutAct_9fa48("1951") ? {} : (stryCov_9fa48("1951"), {
                  hour: '2-digit',
                  minute: '2-digit'
                }))} - {m.scheduledEnd.toLocaleTimeString(stryMutAct_9fa48("1954") ? ["Stryker was here"] : (stryCov_9fa48("1954"), []), stryMutAct_9fa48("1955") ? {} : (stryCov_9fa48("1955"), {
                  hour: '2-digit',
                  minute: '2-digit'
                }))}</span>
                    <span>Affects: {m.affectedServices.join(', ')}</span>
                  </div>
                </div>))}
            </div>
          </section>)}

        {/* Incident History */}
        <section className="bg-white rounded-xl border border-neutral-200">
          <div className="px-6 py-4 border-b border-neutral-200">
            <h3 className="font-semibold text-neutral-900">Incident History</h3>
          </div>
          {(stryMutAct_9fa48("1961") ? incidents.length !== 0 : stryMutAct_9fa48("1960") ? false : stryMutAct_9fa48("1959") ? true : (stryCov_9fa48("1959", "1960", "1961"), incidents.length === 0)) ? <div className="px-6 py-8 text-center text-neutral-500">
              No incidents in the last 30 days 🎉
            </div> : <div className="divide-y divide-neutral-100">
              {incidents.map(stryMutAct_9fa48("1962") ? () => undefined : (stryCov_9fa48("1962"), incident => <div key={incident.id} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium text-neutral-900">{incident.title}</h4>
                      <span className={cn("px-2 py-0.5 rounded text-xs font-medium", incidentSeverityColors[incident.severity])}>
                        {incident.severity}
                      </span>
                    </div>
                    <span className={cn("text-sm font-medium capitalize", incidentStatusColors[incident.status])}>
                      {incident.status}
                    </span>
                  </div>
                  <div className="ml-4 border-l-2 border-neutral-200 pl-4 mt-3 space-y-2">
                    {incident.updates.map(stryMutAct_9fa48("1965") ? () => undefined : (stryCov_9fa48("1965"), (update, i) => <div key={i} className="text-sm">
                        <span className="text-neutral-400">{update.timestamp.toLocaleTimeString()}</span>
                        <span className="mx-2 text-neutral-300">—</span>
                        <span className="text-neutral-600">{update.message}</span>
                      </div>))}
                  </div>
                </div>))}
            </div>}
        </section>

        {/* Subscribe */}
        <div className="mt-8 text-center">
          <p className="text-neutral-600 mb-4">Get notified about status updates</p>
          <div className="flex items-center justify-center gap-3">
            <input type="email" placeholder="your@email.com" className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} Datacendia. All rights reserved.
        </div>
      </footer>
    </div>;
};
export default StatusPage;