// @ts-nocheck
// =============================================================================
// DATACENDIA - DATA SOURCE SELECTOR
// Shared component for selecting data source across all Cortex pages
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
import { Database, ChevronDown, Check, RefreshCw, Link2, AlertCircle } from 'lucide-react';
import { useDataSource, DataSource } from '../../contexts/DataSourceContext';
import { cn } from '../../../lib/utils';
export interface ConnectorDefinition {
  type: string;
  name: string;
  icon: string;
  category: string;
  id?: string;
  color?: string;
  oauth?: boolean;
}
export const AVAILABLE_CONNECTORS: ConnectorDefinition[] = stryMutAct_9fa48("2280") ? [] : (stryCov_9fa48("2280"), [stryMutAct_9fa48("2281") ? {} : (stryCov_9fa48("2281"), {
  type: 'POSTGRESQL',
  name: 'PostgreSQL',
  icon: '🗄️',
  category: 'Database'
}), stryMutAct_9fa48("2286") ? {} : (stryCov_9fa48("2286"), {
  type: 'MYSQL',
  name: 'MySQL',
  icon: '🗄️',
  category: 'Database'
}), stryMutAct_9fa48("2291") ? {} : (stryCov_9fa48("2291"), {
  type: 'MONGODB',
  name: 'MongoDB',
  icon: '🍃',
  category: 'Database'
}), stryMutAct_9fa48("2296") ? {} : (stryCov_9fa48("2296"), {
  type: 'REDIS',
  name: 'Redis',
  icon: '🔴',
  category: 'Database'
}), stryMutAct_9fa48("2301") ? {} : (stryCov_9fa48("2301"), {
  type: 'NEO4J',
  name: 'Neo4j',
  icon: '🔵',
  category: 'Database'
}), stryMutAct_9fa48("2306") ? {} : (stryCov_9fa48("2306"), {
  type: 'SNOWFLAKE',
  name: 'Snowflake',
  icon: '❄️',
  category: 'Data Warehouse'
}), stryMutAct_9fa48("2311") ? {} : (stryCov_9fa48("2311"), {
  type: 'BIGQUERY',
  name: 'Google BigQuery',
  icon: '📊',
  category: 'Data Warehouse'
}), stryMutAct_9fa48("2316") ? {} : (stryCov_9fa48("2316"), {
  type: 'SALESFORCE',
  name: 'Salesforce',
  icon: '☁️',
  category: 'CRM',
  id: 'salesforce',
  color: 'bg-blue-500',
  oauth: stryMutAct_9fa48("2323") ? false : (stryCov_9fa48("2323"), true)
}), stryMutAct_9fa48("2324") ? {} : (stryCov_9fa48("2324"), {
  type: 'HUBSPOT',
  name: 'HubSpot',
  icon: '🧡',
  category: 'CRM',
  id: 'hubspot',
  color: 'bg-orange-500',
  oauth: stryMutAct_9fa48("2331") ? false : (stryCov_9fa48("2331"), true)
}), stryMutAct_9fa48("2332") ? {} : (stryCov_9fa48("2332"), {
  type: 'SAP',
  name: 'SAP',
  icon: '🏢',
  category: 'ERP'
}), stryMutAct_9fa48("2337") ? {} : (stryCov_9fa48("2337"), {
  type: 'AWS',
  name: 'AWS (S3, Redshift)',
  icon: '🔶',
  category: 'Cloud'
}), stryMutAct_9fa48("2342") ? {} : (stryCov_9fa48("2342"), {
  type: 'AZURE',
  name: 'Microsoft Azure',
  icon: '🔷',
  category: 'Cloud'
}), stryMutAct_9fa48("2347") ? {} : (stryCov_9fa48("2347"), {
  type: 'REST_API',
  name: 'REST API',
  icon: '🔌',
  category: 'API'
}), stryMutAct_9fa48("2352") ? {} : (stryCov_9fa48("2352"), {
  type: 'GRAPHQL',
  name: 'GraphQL',
  icon: '🔗',
  category: 'API'
}), stryMutAct_9fa48("2357") ? {} : (stryCov_9fa48("2357"), {
  type: 'CSV_UPLOAD',
  name: 'CSV / Excel',
  icon: '📁',
  category: 'File'
}), stryMutAct_9fa48("2362") ? {} : (stryCov_9fa48("2362"), {
  type: 'SLACK',
  name: 'Slack',
  icon: '💬',
  category: 'SaaS',
  id: 'slack',
  color: 'bg-purple-500',
  oauth: stryMutAct_9fa48("2369") ? false : (stryCov_9fa48("2369"), true)
}), stryMutAct_9fa48("2370") ? {} : (stryCov_9fa48("2370"), {
  type: 'JIRA',
  name: 'Jira',
  icon: '📋',
  category: 'SaaS',
  id: 'jira',
  color: 'bg-blue-600',
  oauth: stryMutAct_9fa48("2377") ? false : (stryCov_9fa48("2377"), true)
}), stryMutAct_9fa48("2378") ? {} : (stryCov_9fa48("2378"), {
  type: 'GITHUB',
  name: 'GitHub',
  icon: '🐙',
  category: 'SaaS',
  id: 'github',
  color: 'bg-gray-800',
  oauth: stryMutAct_9fa48("2385") ? false : (stryCov_9fa48("2385"), true)
}), stryMutAct_9fa48("2386") ? {} : (stryCov_9fa48("2386"), {
  type: 'STRIPE',
  name: 'Stripe',
  icon: '💳',
  category: 'SaaS',
  id: 'stripe',
  color: 'bg-indigo-500',
  oauth: stryMutAct_9fa48("2393") ? false : (stryCov_9fa48("2393"), true)
})]);
interface DataSourceSelectorProps {
  className?: string;
  compact?: boolean;
  showStatus?: boolean;
}
export const DataSourceSelector: React.FC<DataSourceSelectorProps> = ({
  className,
  compact = stryMutAct_9fa48("2394") ? true : (stryCov_9fa48("2394"), false),
  showStatus = stryMutAct_9fa48("2395") ? false : (stryCov_9fa48("2395"), true)
}) => {
  const {
    dataSources,
    selectedDataSource,
    selectDataSource,
    isLoading
  } = useDataSource();
  const [isOpen, setIsOpen] = useState(stryMutAct_9fa48("2397") ? true : (stryCov_9fa48("2397"), false));
  const getStatusColor = (status: DataSource['status']) => {
    switch (status) {
      case 'connected':
        if (stryMutAct_9fa48("2399")) {} else {
          stryCov_9fa48("2399");
          return 'bg-green-500';
        }
      case 'syncing':
        if (stryMutAct_9fa48("2402")) {} else {
          stryCov_9fa48("2402");
          return 'bg-yellow-500 animate-pulse';
        }
      case 'disconnected':
        if (stryMutAct_9fa48("2405")) {} else {
          stryCov_9fa48("2405");
          return 'bg-gray-500';
        }
      case 'error':
        if (stryMutAct_9fa48("2408")) {} else {
          stryCov_9fa48("2408");
          return 'bg-red-500';
        }
      default:
        if (stryMutAct_9fa48("2411")) {} else {
          stryCov_9fa48("2411");
          return 'bg-gray-500';
        }
    }
  };
  const getStatusIcon = (status: DataSource['status']) => {
    switch (status) {
      case 'connected':
        if (stryMutAct_9fa48("2414")) {} else {
          stryCov_9fa48("2414");
          return <Link2 className="w-3 h-3 text-green-400" />;
        }
      case 'syncing':
        if (stryMutAct_9fa48("2416")) {} else {
          stryCov_9fa48("2416");
          return <RefreshCw className="w-3 h-3 text-yellow-400 animate-spin" />;
        }
      case 'error':
        if (stryMutAct_9fa48("2418")) {} else {
          stryCov_9fa48("2418");
          return <AlertCircle className="w-3 h-3 text-red-400" />;
        }
      default:
        if (stryMutAct_9fa48("2420")) {} else {
          stryCov_9fa48("2420");
          return null;
        }
    }
  };
  const getTypeIcon = (type: string) => {
    switch (stryMutAct_9fa48("2423") ? type.toUpperCase() : stryMutAct_9fa48("2422") ? type?.toLowerCase() : (stryCov_9fa48("2422", "2423"), type?.toUpperCase())) {
      case 'POSTGRESQL':
      case 'MYSQL':
      case 'MONGODB':
      case 'ORACLE':
        if (stryMutAct_9fa48("2427")) {} else {
          stryCov_9fa48("2427");
          return '🗄️';
        }
      case 'REDIS':
        if (stryMutAct_9fa48("2430")) {} else {
          stryCov_9fa48("2430");
          return '🔴';
        }
      case 'NEO4J':
        if (stryMutAct_9fa48("2433")) {} else {
          stryCov_9fa48("2433");
          return '🔵';
        }
      case 'REST_API':
      case 'GRAPHQL':
        if (stryMutAct_9fa48("2437")) {} else {
          stryCov_9fa48("2437");
          return '🔌';
        }
      case 'CSV_UPLOAD':
        if (stryMutAct_9fa48("2440")) {} else {
          stryCov_9fa48("2440");
          return '📁';
        }
      case 'SALESFORCE':
        if (stryMutAct_9fa48("2443")) {} else {
          stryCov_9fa48("2443");
          return '☁️';
        }
      case 'SAP':
        if (stryMutAct_9fa48("2446")) {} else {
          stryCov_9fa48("2446");
          return '🏢';
        }
      case 'SNOWFLAKE':
      case 'BIGQUERY':
        if (stryMutAct_9fa48("2450")) {} else {
          stryCov_9fa48("2450");
          return '❄️';
        }
      case 'AWS':
        if (stryMutAct_9fa48("2453")) {} else {
          stryCov_9fa48("2453");
          return '🔶';
        }
      case 'AZURE':
        if (stryMutAct_9fa48("2456")) {} else {
          stryCov_9fa48("2456");
          return '🔷';
        }
      case 'HUBSPOT':
        if (stryMutAct_9fa48("2459")) {} else {
          stryCov_9fa48("2459");
          return '🟠';
        }
      case 'SLACK':
        if (stryMutAct_9fa48("2462")) {} else {
          stryCov_9fa48("2462");
          return '💬';
        }
      case 'JIRA':
        if (stryMutAct_9fa48("2465")) {} else {
          stryCov_9fa48("2465");
          return '📋';
        }
      case 'GITHUB':
        if (stryMutAct_9fa48("2468")) {} else {
          stryCov_9fa48("2468");
          return '🐙';
        }
      case 'STRIPE':
        if (stryMutAct_9fa48("2471")) {} else {
          stryCov_9fa48("2471");
          return '💳';
        }
      default:
        if (stryMutAct_9fa48("2474")) {} else {
          stryCov_9fa48("2474");
          return '📊';
        }
    }
  };
  if (stryMutAct_9fa48("2477") ? false : stryMutAct_9fa48("2476") ? true : (stryCov_9fa48("2476", "2477"), isLoading)) {
    return <div className={cn("flex items-center gap-2 px-3 py-2 bg-sovereign-card rounded-lg border border-sovereign-border", className)}>
        <RefreshCw className="w-4 h-4 text-cyan-500 animate-spin" />
        <span className="text-sm text-gray-400">Loading sources...</span>
      </div>;
  }

  // Available connector types to show even when no sources configured
  const availableConnectors = AVAILABLE_CONNECTORS;
  return <div className={cn("relative", className)}>
      {/* Trigger Button */}
      <button onClick={stryMutAct_9fa48("2481") ? () => undefined : (stryCov_9fa48("2481"), () => setIsOpen(stryMutAct_9fa48("2482") ? isOpen : (stryCov_9fa48("2482"), !isOpen)))} className={cn("flex items-center gap-2 px-3 py-2 bg-sovereign-card hover:bg-sovereign-hover rounded-lg border border-sovereign-border transition-colors w-full", stryMutAct_9fa48("2486") ? isOpen || "ring-2 ring-cyan-500 border-cyan-500/50" : stryMutAct_9fa48("2485") ? false : stryMutAct_9fa48("2484") ? true : (stryCov_9fa48("2484", "2485", "2486"), isOpen && "ring-2 ring-cyan-500 border-cyan-500/50"))}>
        {selectedDataSource ? <>
            <span className="text-lg">{getTypeIcon(selectedDataSource.type)}</span>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-white truncate">
                {selectedDataSource.name}
              </p>
              {stryMutAct_9fa48("2490") ? showStatus && !compact || <p className="text-xs text-gray-400 flex items-center gap-1">
                  <span className={cn("w-1.5 h-1.5 rounded-full", getStatusColor(selectedDataSource.status))} />
                  {selectedDataSource.status}
                  {selectedDataSource.recordCount && <span className="ml-1">• {selectedDataSource.recordCount.toLocaleString()} records</span>}
                </p> : stryMutAct_9fa48("2489") ? false : stryMutAct_9fa48("2488") ? true : (stryCov_9fa48("2488", "2489", "2490"), (stryMutAct_9fa48("2492") ? showStatus || !compact : stryMutAct_9fa48("2491") ? true : (stryCov_9fa48("2491", "2492"), showStatus && (stryMutAct_9fa48("2493") ? compact : (stryCov_9fa48("2493"), !compact)))) && <p className="text-xs text-gray-400 flex items-center gap-1">
                  <span className={cn("w-1.5 h-1.5 rounded-full", getStatusColor(selectedDataSource.status))} />
                  {selectedDataSource.status}
                  {stryMutAct_9fa48("2497") ? selectedDataSource.recordCount || <span className="ml-1">• {selectedDataSource.recordCount.toLocaleString()} records</span> : stryMutAct_9fa48("2496") ? false : stryMutAct_9fa48("2495") ? true : (stryCov_9fa48("2495", "2496", "2497"), selectedDataSource.recordCount && <span className="ml-1">• {selectedDataSource.recordCount.toLocaleString()} records</span>)}
                </p>)}
            </div>
            <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", stryMutAct_9fa48("2501") ? isOpen || "rotate-180" : stryMutAct_9fa48("2500") ? false : stryMutAct_9fa48("2499") ? true : (stryCov_9fa48("2499", "2500", "2501"), isOpen && "rotate-180"))} />
          </> : <>
            <Database className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-white flex-1 text-left">
              {(stryMutAct_9fa48("2506") ? dataSources.length <= 0 : stryMutAct_9fa48("2505") ? dataSources.length >= 0 : stryMutAct_9fa48("2504") ? false : stryMutAct_9fa48("2503") ? true : (stryCov_9fa48("2503", "2504", "2505", "2506"), dataSources.length > 0)) ? 'Select data source' : 'Connect a data source'}
            </span>
            <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", stryMutAct_9fa48("2512") ? isOpen || "rotate-180" : stryMutAct_9fa48("2511") ? false : stryMutAct_9fa48("2510") ? true : (stryCov_9fa48("2510", "2511", "2512"), isOpen && "rotate-180"))} />
          </>}
      </button>

      {/* Dropdown */}
      {stryMutAct_9fa48("2516") ? isOpen || <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-1 bg-sovereign-card border border-sovereign-border rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto min-w-[320px]">
            {/* Configured Sources Section */}
            {dataSources.length > 0 && <>
                <div className="px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider bg-sovereign-elevated">
                  Configured Sources
                </div>
                {dataSources.map(source => <button key={source.id} onClick={() => {
            selectDataSource(source);
            setIsOpen(false);
          }} disabled={source.status === 'disconnected' || source.status === 'error'} className={cn("w-full flex items-center gap-3 px-3 py-2 hover:bg-sovereign-hover transition-colors", selectedDataSource?.id === source.id && "bg-sovereign-active border-l-2 border-cyan-500", (source.status === 'disconnected' || source.status === 'error') && "opacity-50 cursor-not-allowed")}>
                    <span className="text-lg">{getTypeIcon(source.type)}</span>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">{source.name}</p>
                        {getStatusIcon(source.status)}
                      </div>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <span className={cn("w-1.5 h-1.5 rounded-full", getStatusColor(source.status))} />
                        {source.status}
                        {source.recordCount && <span className="ml-1">• {source.recordCount.toLocaleString()} records</span>}
                      </p>
                    </div>
                    {selectedDataSource?.id === source.id && <Check className="w-4 h-4 text-cyan-400" />}
                  </button>)}
                <div className="h-px bg-sovereign-border-subtle my-1" />
              </>}

            {/* Available Connectors Section */}
            <div className="px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider bg-sovereign-elevated">
              Available Integrations
            </div>
            
            {/* Group by category */}
            {['Database', 'Data Warehouse', 'CRM', 'ERP', 'Cloud', 'API', 'File', 'SaaS'].map(category => {
          const categoryConnectors = availableConnectors.filter(c => c.category === category);
          if (categoryConnectors.length === 0) {
            return null;
          }
          return <div key={category}>
                  <div className="px-3 py-1 text-xs text-gray-500 bg-sovereign-base">
                    {category}
                  </div>
                  {categoryConnectors.map(connector => {
              const isConfigured = dataSources.some(ds => ds.type === connector.type);
              return <a key={connector.type} href="/admin/data-sources" onClick={() => setIsOpen(false)} className={cn("w-full flex items-center gap-3 px-3 py-2 hover:bg-sovereign-hover transition-colors", isConfigured && "opacity-50")}>
                        <span className="text-lg">{connector.icon}</span>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-white">{connector.name}</p>
                          <p className="text-xs text-gray-500">
                            {isConfigured ? 'Configured' : 'Click to configure'}
                          </p>
                        </div>
                        {!isConfigured && <span className="text-xs text-cyan-400">+ Add</span>}
                      </a>;
            })}
                </div>;
        })}
          </div>
        </> : stryMutAct_9fa48("2515") ? false : stryMutAct_9fa48("2514") ? true : (stryCov_9fa48("2514", "2515", "2516"), isOpen && <>
          <div className="fixed inset-0 z-40" onClick={stryMutAct_9fa48("2517") ? () => undefined : (stryCov_9fa48("2517"), () => setIsOpen(stryMutAct_9fa48("2518") ? true : (stryCov_9fa48("2518"), false)))} />
          <div className="absolute top-full left-0 right-0 mt-1 bg-sovereign-card border border-sovereign-border rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto min-w-[320px]">
            {/* Configured Sources Section */}
            {stryMutAct_9fa48("2521") ? dataSources.length > 0 || <>
                <div className="px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider bg-sovereign-elevated">
                  Configured Sources
                </div>
                {dataSources.map(source => <button key={source.id} onClick={() => {
            selectDataSource(source);
            setIsOpen(false);
          }} disabled={source.status === 'disconnected' || source.status === 'error'} className={cn("w-full flex items-center gap-3 px-3 py-2 hover:bg-sovereign-hover transition-colors", selectedDataSource?.id === source.id && "bg-sovereign-active border-l-2 border-cyan-500", (source.status === 'disconnected' || source.status === 'error') && "opacity-50 cursor-not-allowed")}>
                    <span className="text-lg">{getTypeIcon(source.type)}</span>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">{source.name}</p>
                        {getStatusIcon(source.status)}
                      </div>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <span className={cn("w-1.5 h-1.5 rounded-full", getStatusColor(source.status))} />
                        {source.status}
                        {source.recordCount && <span className="ml-1">• {source.recordCount.toLocaleString()} records</span>}
                      </p>
                    </div>
                    {selectedDataSource?.id === source.id && <Check className="w-4 h-4 text-cyan-400" />}
                  </button>)}
                <div className="h-px bg-sovereign-border-subtle my-1" />
              </> : stryMutAct_9fa48("2520") ? false : stryMutAct_9fa48("2519") ? true : (stryCov_9fa48("2519", "2520", "2521"), (stryMutAct_9fa48("2524") ? dataSources.length <= 0 : stryMutAct_9fa48("2523") ? dataSources.length >= 0 : stryMutAct_9fa48("2522") ? true : (stryCov_9fa48("2522", "2523", "2524"), dataSources.length > 0)) && <>
                <div className="px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider bg-sovereign-elevated">
                  Configured Sources
                </div>
                {dataSources.map(stryMutAct_9fa48("2525") ? () => undefined : (stryCov_9fa48("2525"), source => <button key={source.id} onClick={() => {
            selectDataSource(source);
            setIsOpen(stryMutAct_9fa48("2527") ? true : (stryCov_9fa48("2527"), false));
          }} disabled={stryMutAct_9fa48("2530") ? source.status === 'disconnected' && source.status === 'error' : stryMutAct_9fa48("2529") ? false : stryMutAct_9fa48("2528") ? true : (stryCov_9fa48("2528", "2529", "2530"), (stryMutAct_9fa48("2532") ? source.status !== 'disconnected' : stryMutAct_9fa48("2531") ? false : (stryCov_9fa48("2531", "2532"), source.status === 'disconnected')) || (stryMutAct_9fa48("2535") ? source.status !== 'error' : stryMutAct_9fa48("2534") ? false : (stryCov_9fa48("2534", "2535"), source.status === 'error')))} className={cn("w-full flex items-center gap-3 px-3 py-2 hover:bg-sovereign-hover transition-colors", stryMutAct_9fa48("2540") ? selectedDataSource?.id === source.id || "bg-sovereign-active border-l-2 border-cyan-500" : stryMutAct_9fa48("2539") ? false : stryMutAct_9fa48("2538") ? true : (stryCov_9fa48("2538", "2539", "2540"), (stryMutAct_9fa48("2542") ? selectedDataSource?.id !== source.id : stryMutAct_9fa48("2541") ? true : (stryCov_9fa48("2541", "2542"), (stryMutAct_9fa48("2543") ? selectedDataSource.id : (stryCov_9fa48("2543"), selectedDataSource?.id)) === source.id)) && "bg-sovereign-active border-l-2 border-cyan-500"), stryMutAct_9fa48("2547") ? source.status === 'disconnected' || source.status === 'error' || "opacity-50 cursor-not-allowed" : stryMutAct_9fa48("2546") ? false : stryMutAct_9fa48("2545") ? true : (stryCov_9fa48("2545", "2546", "2547"), (stryMutAct_9fa48("2549") ? source.status === 'disconnected' && source.status === 'error' : stryMutAct_9fa48("2548") ? true : (stryCov_9fa48("2548", "2549"), (stryMutAct_9fa48("2551") ? source.status !== 'disconnected' : stryMutAct_9fa48("2550") ? false : (stryCov_9fa48("2550", "2551"), source.status === 'disconnected')) || (stryMutAct_9fa48("2554") ? source.status !== 'error' : stryMutAct_9fa48("2553") ? false : (stryCov_9fa48("2553", "2554"), source.status === 'error')))) && "opacity-50 cursor-not-allowed"))}>
                    <span className="text-lg">{getTypeIcon(source.type)}</span>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">{source.name}</p>
                        {getStatusIcon(source.status)}
                      </div>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <span className={cn("w-1.5 h-1.5 rounded-full", getStatusColor(source.status))} />
                        {source.status}
                        {stryMutAct_9fa48("2560") ? source.recordCount || <span className="ml-1">• {source.recordCount.toLocaleString()} records</span> : stryMutAct_9fa48("2559") ? false : stryMutAct_9fa48("2558") ? true : (stryCov_9fa48("2558", "2559", "2560"), source.recordCount && <span className="ml-1">• {source.recordCount.toLocaleString()} records</span>)}
                      </p>
                    </div>
                    {stryMutAct_9fa48("2563") ? selectedDataSource?.id === source.id || <Check className="w-4 h-4 text-cyan-400" /> : stryMutAct_9fa48("2562") ? false : stryMutAct_9fa48("2561") ? true : (stryCov_9fa48("2561", "2562", "2563"), (stryMutAct_9fa48("2565") ? selectedDataSource?.id !== source.id : stryMutAct_9fa48("2564") ? true : (stryCov_9fa48("2564", "2565"), (stryMutAct_9fa48("2566") ? selectedDataSource.id : (stryCov_9fa48("2566"), selectedDataSource?.id)) === source.id)) && <Check className="w-4 h-4 text-cyan-400" />)}
                  </button>))}
                <div className="h-px bg-sovereign-border-subtle my-1" />
              </>)}

            {/* Available Connectors Section */}
            <div className="px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider bg-sovereign-elevated">
              Available Integrations
            </div>
            
            {/* Group by category */}
            {(stryMutAct_9fa48("2567") ? [] : (stryCov_9fa48("2567"), ['Database', 'Data Warehouse', 'CRM', 'ERP', 'Cloud', 'API', 'File', 'SaaS'])).map(category => {
          const categoryConnectors = stryMutAct_9fa48("2577") ? availableConnectors : (stryCov_9fa48("2577"), availableConnectors.filter(stryMutAct_9fa48("2578") ? () => undefined : (stryCov_9fa48("2578"), c => stryMutAct_9fa48("2581") ? c.category !== category : stryMutAct_9fa48("2580") ? false : stryMutAct_9fa48("2579") ? true : (stryCov_9fa48("2579", "2580", "2581"), c.category === category))));
          if (stryMutAct_9fa48("2584") ? categoryConnectors.length !== 0 : stryMutAct_9fa48("2583") ? false : stryMutAct_9fa48("2582") ? true : (stryCov_9fa48("2582", "2583", "2584"), categoryConnectors.length === 0)) {
            return null;
          }
          return <div key={category}>
                  <div className="px-3 py-1 text-xs text-gray-500 bg-sovereign-base">
                    {category}
                  </div>
                  {categoryConnectors.map(connector => {
              const isConfigured = stryMutAct_9fa48("2587") ? dataSources.every(ds => ds.type === connector.type) : (stryCov_9fa48("2587"), dataSources.some(stryMutAct_9fa48("2588") ? () => undefined : (stryCov_9fa48("2588"), ds => stryMutAct_9fa48("2591") ? ds.type !== connector.type : stryMutAct_9fa48("2590") ? false : stryMutAct_9fa48("2589") ? true : (stryCov_9fa48("2589", "2590", "2591"), ds.type === connector.type))));
              return <a key={connector.type} href="/admin/data-sources" onClick={stryMutAct_9fa48("2592") ? () => undefined : (stryCov_9fa48("2592"), () => setIsOpen(stryMutAct_9fa48("2593") ? true : (stryCov_9fa48("2593"), false)))} className={cn("w-full flex items-center gap-3 px-3 py-2 hover:bg-sovereign-hover transition-colors", stryMutAct_9fa48("2597") ? isConfigured || "opacity-50" : stryMutAct_9fa48("2596") ? false : stryMutAct_9fa48("2595") ? true : (stryCov_9fa48("2595", "2596", "2597"), isConfigured && "opacity-50"))}>
                        <span className="text-lg">{connector.icon}</span>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-white">{connector.name}</p>
                          <p className="text-xs text-gray-500">
                            {isConfigured ? 'Configured' : 'Click to configure'}
                          </p>
                        </div>
                        {stryMutAct_9fa48("2603") ? !isConfigured || <span className="text-xs text-cyan-400">+ Add</span> : stryMutAct_9fa48("2602") ? false : stryMutAct_9fa48("2601") ? true : (stryCov_9fa48("2601", "2602", "2603"), (stryMutAct_9fa48("2604") ? isConfigured : (stryCov_9fa48("2604"), !isConfigured)) && <span className="text-xs text-cyan-400">+ Add</span>)}
                      </a>;
            })}
                </div>;
        })}
          </div>
        </>)}
    </div>;
};

// =============================================================================
// WORKFLOW INDICATOR
// =============================================================================

export const WorkflowIndicator: React.FC = () => {
  const {
    activeWorkflow,
    advanceWorkflow,
    cancelWorkflow
  } = useDataSource();
  if (stryMutAct_9fa48("2608") ? !activeWorkflow && activeWorkflow.status === 'completed' : stryMutAct_9fa48("2607") ? false : stryMutAct_9fa48("2606") ? true : (stryCov_9fa48("2606", "2607", "2608"), (stryMutAct_9fa48("2609") ? activeWorkflow : (stryCov_9fa48("2609"), !activeWorkflow)) || (stryMutAct_9fa48("2611") ? activeWorkflow.status !== 'completed' : stryMutAct_9fa48("2610") ? false : (stryCov_9fa48("2610", "2611"), activeWorkflow.status === 'completed')))) {
    return null;
  }
  const currentStep = activeWorkflow.steps[activeWorkflow.currentStep];
  const progress = stryMutAct_9fa48("2614") ? activeWorkflow.currentStep / activeWorkflow.steps.length / 100 : (stryCov_9fa48("2614"), (stryMutAct_9fa48("2615") ? activeWorkflow.currentStep * activeWorkflow.steps.length : (stryCov_9fa48("2615"), activeWorkflow.currentStep / activeWorkflow.steps.length)) * 100);
  return <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-sovereign-card border border-sovereign-border rounded-xl p-4 shadow-2xl z-50 min-w-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-sm font-medium text-white">{activeWorkflow.name}</span>
        </div>
        <button onClick={cancelWorkflow} className="text-gray-400 hover:text-crimson-400 text-sm transition-colors">
          Cancel
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-sovereign-border rounded-full mb-3 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-300" style={stryMutAct_9fa48("2616") ? {} : (stryCov_9fa48("2616"), {
        width: `${progress}%`
      })} />
      </div>

      {/* Current Step */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">
            Step {stryMutAct_9fa48("2618") ? activeWorkflow.currentStep - 1 : (stryCov_9fa48("2618"), activeWorkflow.currentStep + 1)} of {activeWorkflow.steps.length}
          </p>
          <p className="text-sm text-white">{stryMutAct_9fa48("2619") ? currentStep.action : (stryCov_9fa48("2619"), currentStep?.action)}</p>
        </div>
        <button onClick={stryMutAct_9fa48("2620") ? () => undefined : (stryCov_9fa48("2620"), () => advanceWorkflow())} className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium rounded-lg transition-colors">
          Continue →
        </button>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center gap-1 mt-3">
        {activeWorkflow.steps.map(stryMutAct_9fa48("2621") ? () => undefined : (stryCov_9fa48("2621"), (step, idx) => <div key={idx} className={cn("flex-1 h-1 rounded-full transition-colors", step.completed ? "bg-green-500" : (stryMutAct_9fa48("2626") ? idx !== activeWorkflow.currentStep : stryMutAct_9fa48("2625") ? false : stryMutAct_9fa48("2624") ? true : (stryCov_9fa48("2624", "2625", "2626"), idx === activeWorkflow.currentStep)) ? "bg-cyan-500" : "bg-sovereign-border")} />))}
      </div>
    </div>;
};

// =============================================================================
// QUICK ACTIONS BAR
// =============================================================================

interface QuickActionsBarProps {
  currentPage: 'graph' | 'council' | 'pulse' | 'lens' | 'bridge';
}
export const QuickActionsBar: React.FC<QuickActionsBarProps> = ({
  currentPage
}) => {
  const {
    selectedEntity,
    selectedDataSource,
    exploreInGraph,
    askCouncil,
    monitorInPulse,
    forecastInLens,
    automateInBridge
  } = useDataSource();
  const entityName = stryMutAct_9fa48("2632") ? (selectedEntity?.name || selectedDataSource?.name) && 'this data' : stryMutAct_9fa48("2631") ? false : stryMutAct_9fa48("2630") ? true : (stryCov_9fa48("2630", "2631", "2632"), (stryMutAct_9fa48("2634") ? selectedEntity?.name && selectedDataSource?.name : stryMutAct_9fa48("2633") ? false : (stryCov_9fa48("2633", "2634"), (stryMutAct_9fa48("2635") ? selectedEntity.name : (stryCov_9fa48("2635"), selectedEntity?.name)) || (stryMutAct_9fa48("2636") ? selectedDataSource.name : (stryCov_9fa48("2636"), selectedDataSource?.name)))) || 'this data');
  const actions = stryMutAct_9fa48("2638") ? [] : (stryCov_9fa48("2638"), [stryMutAct_9fa48("2639") ? {} : (stryCov_9fa48("2639"), {
    page: 'graph' as const,
    label: 'Explore',
    icon: '🔍',
    action: stryMutAct_9fa48("2642") ? () => undefined : (stryCov_9fa48("2642"), () => exploreInGraph(stryMutAct_9fa48("2643") ? selectedEntity.id : (stryCov_9fa48("2643"), selectedEntity?.id))),
    disabled: stryMutAct_9fa48("2646") ? currentPage !== 'graph' : stryMutAct_9fa48("2645") ? false : stryMutAct_9fa48("2644") ? true : (stryCov_9fa48("2644", "2645", "2646"), currentPage === 'graph')
  }), stryMutAct_9fa48("2648") ? {} : (stryCov_9fa48("2648"), {
    page: 'council' as const,
    label: 'Ask Council',
    icon: '🧠',
    action: stryMutAct_9fa48("2651") ? () => undefined : (stryCov_9fa48("2651"), () => askCouncil(`What insights can you provide about ${entityName}?`)),
    disabled: stryMutAct_9fa48("2655") ? currentPage !== 'council' : stryMutAct_9fa48("2654") ? false : stryMutAct_9fa48("2653") ? true : (stryCov_9fa48("2653", "2654", "2655"), currentPage === 'council')
  }), stryMutAct_9fa48("2657") ? {} : (stryCov_9fa48("2657"), {
    page: 'pulse' as const,
    label: 'Monitor',
    icon: '💓',
    action: stryMutAct_9fa48("2660") ? () => undefined : (stryCov_9fa48("2660"), () => monitorInPulse()),
    disabled: stryMutAct_9fa48("2663") ? currentPage !== 'pulse' : stryMutAct_9fa48("2662") ? false : stryMutAct_9fa48("2661") ? true : (stryCov_9fa48("2661", "2662", "2663"), currentPage === 'pulse')
  }), stryMutAct_9fa48("2665") ? {} : (stryCov_9fa48("2665"), {
    page: 'lens' as const,
    label: 'Forecast',
    icon: '🔮',
    action: stryMutAct_9fa48("2668") ? () => undefined : (stryCov_9fa48("2668"), () => forecastInLens()),
    disabled: stryMutAct_9fa48("2671") ? currentPage !== 'lens' : stryMutAct_9fa48("2670") ? false : stryMutAct_9fa48("2669") ? true : (stryCov_9fa48("2669", "2670", "2671"), currentPage === 'lens')
  }), stryMutAct_9fa48("2673") ? {} : (stryCov_9fa48("2673"), {
    page: 'bridge' as const,
    label: 'Automate',
    icon: '⚡',
    action: stryMutAct_9fa48("2676") ? () => undefined : (stryCov_9fa48("2676"), () => automateInBridge()),
    disabled: stryMutAct_9fa48("2679") ? currentPage !== 'bridge' : stryMutAct_9fa48("2678") ? false : stryMutAct_9fa48("2677") ? true : (stryCov_9fa48("2677", "2678", "2679"), currentPage === 'bridge')
  })]);
  return <div className="flex items-center gap-1 p-1 bg-sovereign-card/50 border border-sovereign-border-subtle rounded-lg">
      {actions.map(stryMutAct_9fa48("2681") ? () => undefined : (stryCov_9fa48("2681"), action => <button key={action.page} onClick={action.action} disabled={action.disabled} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors", action.disabled ? "bg-sovereign-active text-gray-500 cursor-default" : "hover:bg-sovereign-hover text-gray-400 hover:text-white")}>
          <span>{action.icon}</span>
          <span>{action.label}</span>
        </button>))}
    </div>;
};
export default DataSourceSelector;