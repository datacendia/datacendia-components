// @ts-nocheck
// =============================================================================
// DATACENDIA SOVEREIGN STACK - Infrastructure Management Page
// Real-time monitoring and control of all sovereign infrastructure services
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
import React, { useState, useEffect, useCallback } from 'react';
import { Server, Database, HardDrive, Activity, Shield, Key, Search, GitBranch, Workflow, ToggleLeft, Box, RefreshCw, ExternalLink, CheckCircle2, AlertTriangle, XCircle, Clock, Cpu, MemoryStick, Network, Zap, Settings, Play, Pause, RotateCcw, Terminal } from 'lucide-react';
import { sovereignApi, enterpriseApi } from '../../lib/sovereignApi';

// =============================================================================
// TYPES
// =============================================================================

interface SovereignService {
  id: string;
  name: string;
  brandName: string;
  description: string;
  icon: React.ElementType;
  category: 'data' | 'observability' | 'security' | 'orchestration' | 'integration';
  port: number;
  status: 'online' | 'degraded' | 'offline' | 'starting';
  url: string;
  metrics?: {
    cpu?: number;
    memory?: number;
    uptime?: string;
    requests?: number;
  };
}
interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  services: SovereignService[];
}

// =============================================================================
// SOVEREIGN SERVICES CONFIGURATION
// =============================================================================

const SOVEREIGN_SERVICES: SovereignService[] = stryMutAct_9fa48("18810") ? [] : (stryCov_9fa48("18810"), [// Data Layer
stryMutAct_9fa48("18811") ? {} : (stryCov_9fa48("18811"), {
  id: 'postgres',
  name: 'PostgreSQL + pgvector',
  brandName: 'CendiaMemory™',
  description: 'Primary database with vector embeddings for agent long-term memory',
  icon: Database,
  category: 'data',
  port: 5434,
  status: 'online',
  url: 'http://localhost:5434'
}), stryMutAct_9fa48("18819") ? {} : (stryCov_9fa48("18819"), {
  id: 'redis',
  name: 'Redis + BullMQ',
  brandName: 'CendiaQueue™',
  description: 'Cache and job queues for agent orchestration',
  icon: Zap,
  category: 'data',
  port: 6380,
  status: 'online',
  url: 'http://localhost:6380'
}), stryMutAct_9fa48("18827") ? {} : (stryCov_9fa48("18827"), {
  id: 'druid',
  name: 'Apache Druid',
  brandName: 'CendiaChronos™ Engine',
  description: 'High-performance analytics for event history and audit trails',
  icon: Activity,
  category: 'data',
  port: 8888,
  status: 'online',
  url: 'http://localhost:8888'
}), stryMutAct_9fa48("18835") ? {} : (stryCov_9fa48("18835"), {
  id: 'minio',
  name: 'MinIO',
  brandName: 'CendiaVault™',
  description: 'S3-compatible object storage for documents and backups',
  icon: HardDrive,
  category: 'data',
  port: 9001,
  status: 'online',
  url: 'http://localhost:9001'
}), stryMutAct_9fa48("18843") ? {} : (stryCov_9fa48("18843"), {
  id: 'meilisearch',
  name: 'Meilisearch',
  brandName: 'CendiaGnosis™ Search',
  description: 'Lightning-fast full-text search for documents',
  icon: Search,
  category: 'data',
  port: 7700,
  status: 'online',
  url: 'http://localhost:7700'
}), // Observability Layer
stryMutAct_9fa48("18851") ? {} : (stryCov_9fa48("18851"), {
  id: 'prometheus',
  name: 'Prometheus',
  brandName: 'CendiaPulse™ Metrics',
  description: 'Metrics collection and alerting',
  icon: Activity,
  category: 'observability',
  port: 9090,
  status: 'online',
  url: 'http://localhost:9090'
}), stryMutAct_9fa48("18859") ? {} : (stryCov_9fa48("18859"), {
  id: 'grafana',
  name: 'Grafana',
  brandName: 'CendiaPulse™ Dashboards',
  description: 'Visualization and monitoring dashboards',
  icon: Activity,
  category: 'observability',
  port: 3001,
  status: 'online',
  url: 'http://localhost:3001'
}), stryMutAct_9fa48("18867") ? {} : (stryCov_9fa48("18867"), {
  id: 'loki',
  name: 'Loki',
  brandName: 'CendiaWitness™ Logs',
  description: 'Log aggregation and querying',
  icon: Terminal,
  category: 'observability',
  port: 3100,
  status: 'online',
  url: 'http://localhost:3100'
}), // Security Layer
stryMutAct_9fa48("18875") ? {} : (stryCov_9fa48("18875"), {
  id: 'keycloak',
  name: 'Keycloak',
  brandName: 'CendiaKey™',
  description: 'Identity and access management, SSO',
  icon: Key,
  category: 'security',
  port: 8080,
  status: 'online',
  url: 'http://localhost:8080'
}), stryMutAct_9fa48("18883") ? {} : (stryCov_9fa48("18883"), {
  id: 'infisical',
  name: 'Infisical',
  brandName: 'CendiaGuard™ Secrets',
  description: 'Secret management and encryption',
  icon: Shield,
  category: 'security',
  port: 8090,
  status: 'online',
  url: 'http://localhost:8090'
}), // Orchestration Layer
stryMutAct_9fa48("18891") ? {} : (stryCov_9fa48("18891"), {
  id: 'n8n',
  name: 'n8n',
  brandName: 'CendiaFlow™',
  description: 'Visual workflow automation',
  icon: Workflow,
  category: 'orchestration',
  port: 5678,
  status: 'online',
  url: 'http://localhost:5678'
}), stryMutAct_9fa48("18899") ? {} : (stryCov_9fa48("18899"), {
  id: 'unleash',
  name: 'Unleash',
  brandName: 'CendiaControl™',
  description: 'Feature flags and dynamic configuration',
  icon: ToggleLeft,
  category: 'orchestration',
  port: 4242,
  status: 'online',
  url: 'http://localhost:4242'
}), // Enterprise Additions
stryMutAct_9fa48("18907") ? {} : (stryCov_9fa48("18907"), {
  id: 'clickhouse',
  name: 'ClickHouse',
  brandName: 'CendiaAnalytics™ Fast',
  description: 'Fast SQL analytics with auto-routing from Druid',
  icon: Activity,
  category: 'data',
  port: 8123,
  status: 'online',
  url: 'http://localhost:8123'
}), stryMutAct_9fa48("18915") ? {} : (stryCov_9fa48("18915"), {
  id: 'tika',
  name: 'Apache Tika',
  brandName: 'CendiaIngest™',
  description: 'Universal document extraction (PDF, DOCX, PPTX, etc.)',
  icon: Box,
  category: 'orchestration',
  port: 9998,
  status: 'online',
  url: 'http://localhost:9998'
}), stryMutAct_9fa48("18923") ? {} : (stryCov_9fa48("18923"), {
  id: 'tempo',
  name: 'Grafana Tempo',
  brandName: 'CendiaTrace™',
  description: 'Distributed tracing for full request visibility',
  icon: Activity,
  category: 'observability',
  port: 3200,
  status: 'online',
  url: 'http://localhost:3200'
}), stryMutAct_9fa48("18931") ? {} : (stryCov_9fa48("18931"), {
  id: 'falco',
  name: 'Falco',
  brandName: 'CendiaWatchdog™',
  description: 'Runtime security (production Linux only)',
  icon: Shield,
  category: 'security',
  port: 8765,
  status: 'offline',
  url: 'http://localhost:8765'
}), stryMutAct_9fa48("18939") ? {} : (stryCov_9fa48("18939"), {
  id: 'wazuh',
  name: 'Wazuh',
  brandName: 'CendiaSentinel™',
  description: 'Universal IDS/SIEM - file integrity, vulnerability detection',
  icon: Shield,
  category: 'security',
  port: 55000,
  status: 'online',
  url: 'http://localhost:55000'
}), stryMutAct_9fa48("18947") ? {} : (stryCov_9fa48("18947"), {
  id: 'step-ca',
  name: 'step-ca',
  brandName: 'CendiaPKI™',
  description: 'Internal PKI for zero-trust mTLS',
  icon: Key,
  category: 'security',
  port: 9002,
  status: 'online',
  url: 'http://localhost:9002'
}), stryMutAct_9fa48("18955") ? {} : (stryCov_9fa48("18955"), {
  id: 'vaultwarden',
  name: 'Vaultwarden',
  brandName: 'CendiaKey™ Vault',
  description: 'Sovereign credential manager (Rust, 100MB RAM, air-gapped)',
  icon: Key,
  category: 'security',
  port: 8005,
  status: 'online',
  url: 'http://localhost:8005'
})]);
const CATEGORIES: ServiceCategory[] = stryMutAct_9fa48("18963") ? [] : (stryCov_9fa48("18963"), [stryMutAct_9fa48("18964") ? {} : (stryCov_9fa48("18964"), {
  id: 'data',
  name: 'Data Layer',
  description: 'Databases, storage, and search',
  color: '#3B82F6',
  services: stryMutAct_9fa48("18969") ? SOVEREIGN_SERVICES : (stryCov_9fa48("18969"), SOVEREIGN_SERVICES.filter(stryMutAct_9fa48("18970") ? () => undefined : (stryCov_9fa48("18970"), s => stryMutAct_9fa48("18973") ? s.category !== 'data' : stryMutAct_9fa48("18972") ? false : stryMutAct_9fa48("18971") ? true : (stryCov_9fa48("18971", "18972", "18973"), s.category === 'data'))))
}), stryMutAct_9fa48("18975") ? {} : (stryCov_9fa48("18975"), {
  id: 'observability',
  name: 'Observability',
  description: 'Metrics, logs, and monitoring',
  color: '#10B981',
  services: stryMutAct_9fa48("18980") ? SOVEREIGN_SERVICES : (stryCov_9fa48("18980"), SOVEREIGN_SERVICES.filter(stryMutAct_9fa48("18981") ? () => undefined : (stryCov_9fa48("18981"), s => stryMutAct_9fa48("18984") ? s.category !== 'observability' : stryMutAct_9fa48("18983") ? false : stryMutAct_9fa48("18982") ? true : (stryCov_9fa48("18982", "18983", "18984"), s.category === 'observability'))))
}), stryMutAct_9fa48("18986") ? {} : (stryCov_9fa48("18986"), {
  id: 'security',
  name: 'Security',
  description: 'Identity, secrets, and access control',
  color: '#EF4444',
  services: stryMutAct_9fa48("18991") ? SOVEREIGN_SERVICES : (stryCov_9fa48("18991"), SOVEREIGN_SERVICES.filter(stryMutAct_9fa48("18992") ? () => undefined : (stryCov_9fa48("18992"), s => stryMutAct_9fa48("18995") ? s.category !== 'security' : stryMutAct_9fa48("18994") ? false : stryMutAct_9fa48("18993") ? true : (stryCov_9fa48("18993", "18994", "18995"), s.category === 'security'))))
}), stryMutAct_9fa48("18997") ? {} : (stryCov_9fa48("18997"), {
  id: 'orchestration',
  name: 'Orchestration',
  description: 'Workflows, flags, and automation',
  color: '#8B5CF6',
  services: stryMutAct_9fa48("19002") ? SOVEREIGN_SERVICES : (stryCov_9fa48("19002"), SOVEREIGN_SERVICES.filter(stryMutAct_9fa48("19003") ? () => undefined : (stryCov_9fa48("19003"), s => stryMutAct_9fa48("19006") ? s.category !== 'orchestration' : stryMutAct_9fa48("19005") ? false : stryMutAct_9fa48("19004") ? true : (stryCov_9fa48("19004", "19005", "19006"), s.category === 'orchestration'))))
})]);

// =============================================================================
// STATUS INDICATOR COMPONENT
// =============================================================================

const StatusIndicator: React.FC<{
  status: SovereignService['status'];
}> = ({
  status
}) => {
  const config = (stryMutAct_9fa48("19009") ? {} : (stryCov_9fa48("19009"), {
    online: stryMutAct_9fa48("19010") ? {} : (stryCov_9fa48("19010"), {
      icon: CheckCircle2,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      label: 'Online'
    }),
    degraded: stryMutAct_9fa48("19014") ? {} : (stryCov_9fa48("19014"), {
      icon: AlertTriangle,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      label: 'Degraded'
    }),
    offline: stryMutAct_9fa48("19018") ? {} : (stryCov_9fa48("19018"), {
      icon: XCircle,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      label: 'Offline'
    }),
    starting: stryMutAct_9fa48("19022") ? {} : (stryCov_9fa48("19022"), {
      icon: Clock,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      label: 'Starting'
    })
  }))[status];
  const Icon = config.icon;
  return <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${config.bg}`}>
      <Icon className={`w-3.5 h-3.5 ${config.color}`} />
      <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
    </div>;
};

// =============================================================================
// SERVICE CARD COMPONENT
// =============================================================================

const ServiceCard: React.FC<{
  service: SovereignService;
  onOpenConsole: (service: SovereignService) => void;
}> = ({
  service,
  onOpenConsole
}) => {
  const Icon = service.icon;
  return <div className="bg-white border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neutral-100 rounded-lg">
            <Icon className="w-5 h-5 text-neutral-600" />
          </div>
          <div>
            <h4 className="font-semibold text-neutral-900">{service.name}</h4>
            <p className="text-xs text-indigo-600 font-medium">{service.brandName}</p>
          </div>
        </div>
        <StatusIndicator status={service.status} />
      </div>

      <p className="text-sm text-neutral-600 mb-3">{service.description}</p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-neutral-500">Port: {service.port}</span>
        <div className="flex gap-2">
          <button onClick={stryMutAct_9fa48("19030") ? () => undefined : (stryCov_9fa48("19030"), () => onOpenConsole(service))} className="p-1.5 text-neutral-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Open Console">
            <ExternalLink className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded transition-colors" title="Settings">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {stryMutAct_9fa48("19033") ? service.metrics || <div className="mt-3 pt-3 border-t border-neutral-100 grid grid-cols-2 gap-2">
          {service.metrics.cpu !== undefined && <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Cpu className="w-3 h-3" />
              <span>CPU: {service.metrics.cpu}%</span>
            </div>}
          {service.metrics.memory !== undefined && <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <MemoryStick className="w-3 h-3" />
              <span>RAM: {service.metrics.memory}%</span>
            </div>}
        </div> : stryMutAct_9fa48("19032") ? false : stryMutAct_9fa48("19031") ? true : (stryCov_9fa48("19031", "19032", "19033"), service.metrics && <div className="mt-3 pt-3 border-t border-neutral-100 grid grid-cols-2 gap-2">
          {stryMutAct_9fa48("19036") ? service.metrics.cpu !== undefined || <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Cpu className="w-3 h-3" />
              <span>CPU: {service.metrics.cpu}%</span>
            </div> : stryMutAct_9fa48("19035") ? false : stryMutAct_9fa48("19034") ? true : (stryCov_9fa48("19034", "19035", "19036"), (stryMutAct_9fa48("19038") ? service.metrics.cpu === undefined : stryMutAct_9fa48("19037") ? true : (stryCov_9fa48("19037", "19038"), service.metrics.cpu !== undefined)) && <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Cpu className="w-3 h-3" />
              <span>CPU: {service.metrics.cpu}%</span>
            </div>)}
          {stryMutAct_9fa48("19041") ? service.metrics.memory !== undefined || <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <MemoryStick className="w-3 h-3" />
              <span>RAM: {service.metrics.memory}%</span>
            </div> : stryMutAct_9fa48("19040") ? false : stryMutAct_9fa48("19039") ? true : (stryCov_9fa48("19039", "19040", "19041"), (stryMutAct_9fa48("19043") ? service.metrics.memory === undefined : stryMutAct_9fa48("19042") ? true : (stryCov_9fa48("19042", "19043"), service.metrics.memory !== undefined)) && <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <MemoryStick className="w-3 h-3" />
              <span>RAM: {service.metrics.memory}%</span>
            </div>)}
        </div>)}
    </div>;
};

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function SovereignStackPage() {
  const [services, setServices] = useState<SovereignService[]>(SOVEREIGN_SERVICES);
  const [isRefreshing, setIsRefreshing] = useState(stryMutAct_9fa48("19045") ? true : (stryCov_9fa48("19045"), false));
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [securityStatus, setSecurityStatus] = useState<any>(null);
  const checkServiceHealth = useCallback(async () => {
    setIsRefreshing(stryMutAct_9fa48("19047") ? false : (stryCov_9fa48("19047"), true));
    try {
      // Use the sovereign API for real health checks
      const [healthStatus, secStatus] = await Promise.all(stryMutAct_9fa48("19049") ? [] : (stryCov_9fa48("19049"), [sovereignApi.getHealthStatus(), enterpriseApi.getSecurityStatus().catch(stryMutAct_9fa48("19050") ? () => undefined : (stryCov_9fa48("19050"), () => null))]));

      // Update enterprise security status
      if (stryMutAct_9fa48("19052") ? false : stryMutAct_9fa48("19051") ? true : (stryCov_9fa48("19051", "19052"), secStatus)) {
        setSecurityStatus(secStatus);
      }

      // Map backend service names to our service IDs
      const serviceHealthMap: Record<string, boolean> = stryMutAct_9fa48("19054") ? {} : (stryCov_9fa48("19054"), {
        druid: stryMutAct_9fa48("19055") ? healthStatus.services?.druid?.available && false : (stryCov_9fa48("19055"), (stryMutAct_9fa48("19057") ? healthStatus.services.druid?.available : stryMutAct_9fa48("19056") ? healthStatus.services?.druid.available : (stryCov_9fa48("19056", "19057"), healthStatus.services?.druid?.available)) ?? (stryMutAct_9fa48("19058") ? true : (stryCov_9fa48("19058"), false))),
        minio: stryMutAct_9fa48("19059") ? healthStatus.services?.minio?.available && false : (stryCov_9fa48("19059"), (stryMutAct_9fa48("19061") ? healthStatus.services.minio?.available : stryMutAct_9fa48("19060") ? healthStatus.services?.minio.available : (stryCov_9fa48("19060", "19061"), healthStatus.services?.minio?.available)) ?? (stryMutAct_9fa48("19062") ? true : (stryCov_9fa48("19062"), false))),
        postgres: stryMutAct_9fa48("19063") ? healthStatus.services?.vector?.available && false : (stryCov_9fa48("19063"), (stryMutAct_9fa48("19065") ? healthStatus.services.vector?.available : stryMutAct_9fa48("19064") ? healthStatus.services?.vector.available : (stryCov_9fa48("19064", "19065"), healthStatus.services?.vector?.available)) ?? (stryMutAct_9fa48("19066") ? true : (stryCov_9fa48("19066"), false))),
        // pgvector uses postgres
        redis: stryMutAct_9fa48("19067") ? healthStatus.services?.queue?.available && false : (stryCov_9fa48("19067"), (stryMutAct_9fa48("19069") ? healthStatus.services.queue?.available : stryMutAct_9fa48("19068") ? healthStatus.services?.queue.available : (stryCov_9fa48("19068", "19069"), healthStatus.services?.queue?.available)) ?? (stryMutAct_9fa48("19070") ? true : (stryCov_9fa48("19070"), false))),
        // BullMQ uses redis
        prometheus: stryMutAct_9fa48("19071") ? healthStatus.services?.prometheus?.available && false : (stryCov_9fa48("19071"), (stryMutAct_9fa48("19073") ? healthStatus.services.prometheus?.available : stryMutAct_9fa48("19072") ? healthStatus.services?.prometheus.available : (stryCov_9fa48("19072", "19073"), healthStatus.services?.prometheus?.available)) ?? (stryMutAct_9fa48("19074") ? true : (stryCov_9fa48("19074"), false))),
        grafana: stryMutAct_9fa48("19075") ? healthStatus.services?.prometheus?.available && false : (stryCov_9fa48("19075"), (stryMutAct_9fa48("19077") ? healthStatus.services.prometheus?.available : stryMutAct_9fa48("19076") ? healthStatus.services?.prometheus.available : (stryCov_9fa48("19076", "19077"), healthStatus.services?.prometheus?.available)) ?? (stryMutAct_9fa48("19078") ? true : (stryCov_9fa48("19078"), false))),
        // Same stack
        loki: stryMutAct_9fa48("19079") ? healthStatus.services?.prometheus?.available && false : (stryCov_9fa48("19079"), (stryMutAct_9fa48("19081") ? healthStatus.services.prometheus?.available : stryMutAct_9fa48("19080") ? healthStatus.services?.prometheus.available : (stryCov_9fa48("19080", "19081"), healthStatus.services?.prometheus?.available)) ?? (stryMutAct_9fa48("19082") ? true : (stryCov_9fa48("19082"), false))),
        // Same stack
        n8n: stryMutAct_9fa48("19083") ? healthStatus.services?.n8n?.available && false : (stryCov_9fa48("19083"), (stryMutAct_9fa48("19085") ? healthStatus.services.n8n?.available : stryMutAct_9fa48("19084") ? healthStatus.services?.n8n.available : (stryCov_9fa48("19084", "19085"), healthStatus.services?.n8n?.available)) ?? (stryMutAct_9fa48("19086") ? true : (stryCov_9fa48("19086"), false))),
        unleash: stryMutAct_9fa48("19087") ? healthStatus.services?.unleash?.available && false : (stryCov_9fa48("19087"), (stryMutAct_9fa48("19089") ? healthStatus.services.unleash?.available : stryMutAct_9fa48("19088") ? healthStatus.services?.unleash.available : (stryCov_9fa48("19088", "19089"), healthStatus.services?.unleash?.available)) ?? (stryMutAct_9fa48("19090") ? true : (stryCov_9fa48("19090"), false))),
        keycloak: stryMutAct_9fa48("19091") ? false : (stryCov_9fa48("19091"), true),
        // Assume online if Docker is running
        infisical: stryMutAct_9fa48("19092") ? false : (stryCov_9fa48("19092"), true),
        meilisearch: stryMutAct_9fa48("19093") ? false : (stryCov_9fa48("19093"), true)
      });
      const updatedServices = services.map(stryMutAct_9fa48("19094") ? () => undefined : (stryCov_9fa48("19094"), service => stryMutAct_9fa48("19095") ? {} : (stryCov_9fa48("19095"), {
        ...service,
        status: (stryMutAct_9fa48("19096") ? serviceHealthMap[service.id] && false : (stryCov_9fa48("19096"), serviceHealthMap[service.id] ?? (stryMutAct_9fa48("19097") ? true : (stryCov_9fa48("19097"), false)))) ? 'online' as const : 'offline' as const,
        metrics: (stryMutAct_9fa48("19099") ? healthStatus.services[service.id]?.latency : stryMutAct_9fa48("19098") ? healthStatus.services?.[service.id].latency : (stryCov_9fa48("19098", "19099"), healthStatus.services?.[service.id]?.latency)) ? stryMutAct_9fa48("19100") ? {} : (stryCov_9fa48("19100"), {
          ...service.metrics,
          latency: healthStatus.services[service.id].latency
        }) : service.metrics
      })));
      setServices(updatedServices);
    } catch (error) {
      console.error('[SovereignStack] Health check failed, falling back to direct checks:', error);

      // Fallback to direct service checks
      const updatedServices = await Promise.all(services.map(async service => {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(stryMutAct_9fa48("19105") ? () => undefined : (stryCov_9fa48("19105"), () => controller.abort()), 3000);
          await fetch(service.url, stryMutAct_9fa48("19106") ? {} : (stryCov_9fa48("19106"), {
            method: 'HEAD',
            signal: controller.signal,
            mode: 'no-cors'
          }));
          clearTimeout(timeout);
          return stryMutAct_9fa48("19109") ? {} : (stryCov_9fa48("19109"), {
            ...service,
            status: 'online' as const
          });
        } catch {
          return stryMutAct_9fa48("19111") ? {} : (stryCov_9fa48("19111"), {
            ...service,
            status: 'offline' as const
          });
        }
      }));
      setServices(updatedServices);
    }
    setLastRefresh(new Date());
    setIsRefreshing(stryMutAct_9fa48("19112") ? true : (stryCov_9fa48("19112"), false));
  }, stryMutAct_9fa48("19113") ? [] : (stryCov_9fa48("19113"), [services]));
  useEffect(() => {
    // Initial health check
    checkServiceHealth();

    // Refresh every 30 seconds
    const interval = setInterval(checkServiceHealth, 30000);
    return stryMutAct_9fa48("19115") ? () => undefined : (stryCov_9fa48("19115"), () => clearInterval(interval));
  }, stryMutAct_9fa48("19116") ? ["Stryker was here"] : (stryCov_9fa48("19116"), []));
  const openConsole = (service: SovereignService) => {
    window.open(service.url, '_blank');
  };
  const onlineCount = stryMutAct_9fa48("19119") ? services.length : (stryCov_9fa48("19119"), services.filter(stryMutAct_9fa48("19120") ? () => undefined : (stryCov_9fa48("19120"), s => stryMutAct_9fa48("19123") ? s.status !== 'online' : stryMutAct_9fa48("19122") ? false : stryMutAct_9fa48("19121") ? true : (stryCov_9fa48("19121", "19122", "19123"), s.status === 'online'))).length);
  const totalCount = services.length;
  return <div className="min-h-screen bg-neutral-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Server className="w-6 h-6 text-indigo-600" />
              </div>
              <h1 className="text-2xl font-bold text-neutral-900">Sovereign Stack</h1>
            </div>
            <p className="text-neutral-600">
              Infrastructure management for your air-gapped, self-hosted platform
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-neutral-900">
                {onlineCount}/{totalCount}
              </div>
              <div className="text-sm text-neutral-500">Services Online</div>
            </div>
            <button onClick={checkServiceHealth} disabled={isRefreshing} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="mt-4 text-xs text-neutral-500">
          Last updated: {lastRefresh.toLocaleTimeString()}
        </div>
      </div>

      {/* Overall Health Banner */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className={`rounded-lg p-4 ${(stryMutAct_9fa48("19131") ? onlineCount !== totalCount : stryMutAct_9fa48("19130") ? false : stryMutAct_9fa48("19129") ? true : (stryCov_9fa48("19129", "19130", "19131"), onlineCount === totalCount)) ? 'bg-green-50 border border-green-200' : (stryMutAct_9fa48("19136") ? onlineCount <= totalCount / 2 : stryMutAct_9fa48("19135") ? onlineCount >= totalCount / 2 : stryMutAct_9fa48("19134") ? false : stryMutAct_9fa48("19133") ? true : (stryCov_9fa48("19133", "19134", "19135", "19136"), onlineCount > (stryMutAct_9fa48("19137") ? totalCount * 2 : (stryCov_9fa48("19137"), totalCount / 2)))) ? 'bg-amber-50 border border-amber-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center gap-3">
            {(stryMutAct_9fa48("19142") ? onlineCount !== totalCount : stryMutAct_9fa48("19141") ? false : stryMutAct_9fa48("19140") ? true : (stryCov_9fa48("19140", "19141", "19142"), onlineCount === totalCount)) ? <>
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">
                  All systems operational. Your sovereign infrastructure is fully online.
                </span>
              </> : <>
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span className="font-medium text-amber-800">
                  {stryMutAct_9fa48("19143") ? totalCount + onlineCount : (stryCov_9fa48("19143"), totalCount - onlineCount)} service(s) require attention.
                </span>
              </>}
          </div>
        </div>
      </div>

      {/* Enterprise Security Status Panel */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Enterprise Security Status</h3>
            </div>
            <div className="flex gap-2">
              <a href="http://localhost:8005" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm">
                <Key className="w-4 h-4" />
                CendiaKey™ Vault
                <ExternalLink className="w-3 h-3" />
              </a>
              <a href="http://localhost:8080" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm">
                <Shield className="w-4 h-4" />
                Keycloak SSO
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-xs text-white/60 mb-1">Keycloak SSO</div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-4 h-4 ${(stryMutAct_9fa48("19146") ? securityStatus.keycloak?.enabled : stryMutAct_9fa48("19145") ? securityStatus?.keycloak.enabled : (stryCov_9fa48("19145", "19146"), securityStatus?.keycloak?.enabled)) ? 'text-green-400' : 'text-neutral-400'}`} />
                <span className="text-sm font-medium">{stryMutAct_9fa48("19151") ? securityStatus?.keycloak?.realm && 'cendia' : stryMutAct_9fa48("19150") ? false : stryMutAct_9fa48("19149") ? true : (stryCov_9fa48("19149", "19150", "19151"), (stryMutAct_9fa48("19153") ? securityStatus.keycloak?.realm : stryMutAct_9fa48("19152") ? securityStatus?.keycloak.realm : (stryCov_9fa48("19152", "19153"), securityStatus?.keycloak?.realm)) || 'cendia')}</span>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-xs text-white/60 mb-1">Policy Engine</div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-4 h-4 ${(stryMutAct_9fa48("19157") ? securityStatus.casbin?.enabled : stryMutAct_9fa48("19156") ? securityStatus?.casbin.enabled : (stryCov_9fa48("19156", "19157"), securityStatus?.casbin?.enabled)) ? 'text-green-400' : 'text-neutral-400'}`} />
                <span className="text-sm font-medium">{stryMutAct_9fa48("19162") ? securityStatus?.casbin?.policyCount && 0 : stryMutAct_9fa48("19161") ? false : stryMutAct_9fa48("19160") ? true : (stryCov_9fa48("19160", "19161", "19162"), (stryMutAct_9fa48("19164") ? securityStatus.casbin?.policyCount : stryMutAct_9fa48("19163") ? securityStatus?.casbin.policyCount : (stryCov_9fa48("19163", "19164"), securityStatus?.casbin?.policyCount)) || 0)} policies</span>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-xs text-white/60 mb-1">Document Extraction</div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-4 h-4 ${(stryMutAct_9fa48("19167") ? securityStatus.tika?.available : stryMutAct_9fa48("19166") ? securityStatus?.tika.available : (stryCov_9fa48("19166", "19167"), securityStatus?.tika?.available)) ? 'text-green-400' : 'text-neutral-400'}`} />
                <span className="text-sm font-medium">Apache Tika</span>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-xs text-white/60 mb-1">Distributed Tracing</div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-4 h-4 ${(stryMutAct_9fa48("19172") ? securityStatus.tempo?.enabled : stryMutAct_9fa48("19171") ? securityStatus?.tempo.enabled : (stryCov_9fa48("19171", "19172"), securityStatus?.tempo?.enabled)) ? 'text-green-400' : 'text-neutral-400'}`} />
                <span className="text-sm font-medium">Tempo OTEL</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Categories */}
      <div className="max-w-7xl mx-auto space-y-8">
        {CATEGORIES.map(stryMutAct_9fa48("19175") ? () => undefined : (stryCov_9fa48("19175"), category => <div key={category.id}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 rounded-full" style={stryMutAct_9fa48("19176") ? {} : (stryCov_9fa48("19176"), {
            backgroundColor: category.color
          })} />
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">{category.name}</h2>
                <p className="text-sm text-neutral-500">{category.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.services.map(stryMutAct_9fa48("19177") ? () => undefined : (stryCov_9fa48("19177"), service => <ServiceCard key={service.id} service={stryMutAct_9fa48("19180") ? services.find(s => s.id === service.id) && service : stryMutAct_9fa48("19179") ? false : stryMutAct_9fa48("19178") ? true : (stryCov_9fa48("19178", "19179", "19180"), services.find(stryMutAct_9fa48("19181") ? () => undefined : (stryCov_9fa48("19181"), s => stryMutAct_9fa48("19184") ? s.id !== service.id : stryMutAct_9fa48("19183") ? false : stryMutAct_9fa48("19182") ? true : (stryCov_9fa48("19182", "19183", "19184"), s.id === service.id))) || service)} onOpenConsole={openConsole} />))}
            </div>
          </div>))}
      </div>

      {/* Architecture Diagram */}
      <div className="max-w-7xl mx-auto mt-12">
        <div className="bg-white border border-neutral-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Architecture Overview</h3>
          <div className="grid grid-cols-4 gap-4 text-center text-sm">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="font-semibold text-blue-800 mb-2">Layer 0: Data</div>
              <div className="text-blue-600 text-xs space-y-1">
                <div>PostgreSQL + pgvector</div>
                <div>Redis + BullMQ</div>
                <div>Apache Druid</div>
                <div>MinIO</div>
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="font-semibold text-green-800 mb-2">Layer 1: Observability</div>
              <div className="text-green-600 text-xs space-y-1">
                <div>Prometheus</div>
                <div>Grafana</div>
                <div>Loki</div>
              </div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="font-semibold text-red-800 mb-2">Layer 2: Security</div>
              <div className="text-red-600 text-xs space-y-1">
                <div>Keycloak (SSO)</div>
                <div>Infisical (Secrets)</div>
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="font-semibold text-purple-800 mb-2">Layer 3: Orchestration</div>
              <div className="text-purple-600 text-xs space-y-1">
                <div>n8n (Workflows)</div>
                <div>Unleash (Flags)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-neutral-900 rounded-lg p-6 text-white">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="http://localhost:3001" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-sm">Open Grafana</span>
            </a>
            <a href="http://localhost:5678" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
              <Workflow className="w-4 h-4 text-purple-400" />
              <span className="text-sm">Open n8n</span>
            </a>
            <a href="http://localhost:9001" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
              <HardDrive className="w-4 h-4 text-blue-400" />
              <span className="text-sm">Open MinIO</span>
            </a>
            <a href="http://localhost:8888" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
              <Database className="w-4 h-4 text-amber-400" />
              <span className="text-sm">Open Druid</span>
            </a>
          </div>
        </div>
      </div>
    </div>;
}