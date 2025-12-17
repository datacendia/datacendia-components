// @ts-nocheck
// =============================================================================
// DATACENDIA - DATA PAGES
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
import { cn, formatNumber, formatRelativeTime, formatBytes } from '../../../../lib/utils';

// =============================================================================
// DATA SOURCES PAGE
// =============================================================================

export const DataSourcesPage: React.FC = () => {
  const navigate = useNavigate();
  const sources = stryMutAct_9fa48("25748") ? [] : (stryCov_9fa48("25748"), [stryMutAct_9fa48("25749") ? {} : (stryCov_9fa48("25749"), {
    id: 1,
    name: 'Salesforce CRM',
    type: 'CRM',
    icon: '☁️',
    status: 'connected',
    lastSync: new Date(stryMutAct_9fa48("25754") ? Date.now() + 300000 : (stryCov_9fa48("25754"), Date.now() - 300000)),
    records: 125000,
    growth: 12
  }), stryMutAct_9fa48("25755") ? {} : (stryCov_9fa48("25755"), {
    id: 2,
    name: 'Snowflake DW',
    type: 'Data Warehouse',
    icon: '❄️',
    status: 'connected',
    lastSync: new Date(stryMutAct_9fa48("25760") ? Date.now() + 1800000 : (stryCov_9fa48("25760"), Date.now() - 1800000)),
    records: 45000000,
    growth: 5
  }), stryMutAct_9fa48("25761") ? {} : (stryCov_9fa48("25761"), {
    id: 3,
    name: 'SAP ERP',
    type: 'ERP',
    icon: '📊',
    status: 'connected',
    lastSync: new Date(stryMutAct_9fa48("25766") ? Date.now() + 3600000 : (stryCov_9fa48("25766"), Date.now() - 3600000)),
    records: 8500000,
    growth: 3
  }), stryMutAct_9fa48("25767") ? {} : (stryCov_9fa48("25767"), {
    id: 4,
    name: 'HubSpot',
    type: 'Marketing',
    icon: '🧡',
    status: 'syncing',
    lastSync: null,
    records: 250000,
    growth: 18
  }), stryMutAct_9fa48("25772") ? {} : (stryCov_9fa48("25772"), {
    id: 5,
    name: 'Stripe',
    type: 'Payments',
    icon: '💳',
    status: 'connected',
    lastSync: new Date(stryMutAct_9fa48("25777") ? Date.now() + 600000 : (stryCov_9fa48("25777"), Date.now() - 600000)),
    records: 890000,
    growth: 8
  }), stryMutAct_9fa48("25778") ? {} : (stryCov_9fa48("25778"), {
    id: 6,
    name: 'PostgreSQL (Legacy)',
    type: 'Database',
    icon: '🐘',
    status: 'error',
    lastSync: new Date(stryMutAct_9fa48("25783") ? Date.now() + 86400000 : (stryCov_9fa48("25783"), Date.now() - 86400000)),
    records: 12000000,
    growth: stryMutAct_9fa48("25784") ? +2 : (stryCov_9fa48("25784"), -2)
  })]);
  const categories = stryMutAct_9fa48("25785") ? [] : (stryCov_9fa48("25785"), ['All', 'CRM', 'ERP', 'Data Warehouse', 'Database', 'API']);
  return <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Data Sources</h1>
          <p className="text-neutral-500">Manage your connected data sources</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          + Connect Source
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {(stryMutAct_9fa48("25792") ? [] : (stryCov_9fa48("25792"), [stryMutAct_9fa48("25793") ? {} : (stryCov_9fa48("25793"), {
        label: 'Connected Sources',
        value: stryMutAct_9fa48("25795") ? sources.length : (stryCov_9fa48("25795"), sources.filter(stryMutAct_9fa48("25796") ? () => undefined : (stryCov_9fa48("25796"), s => stryMutAct_9fa48("25799") ? s.status !== 'connected' : stryMutAct_9fa48("25798") ? false : stryMutAct_9fa48("25797") ? true : (stryCov_9fa48("25797", "25798", "25799"), s.status === 'connected'))).length)
      }), stryMutAct_9fa48("25801") ? {} : (stryCov_9fa48("25801"), {
        label: 'Total Records',
        value: '66.5M'
      }), stryMutAct_9fa48("25804") ? {} : (stryCov_9fa48("25804"), {
        label: 'Last Sync',
        value: '5 min ago'
      }), stryMutAct_9fa48("25807") ? {} : (stryCov_9fa48("25807"), {
        label: 'Sync Health',
        value: '83%'
      })])).map(stryMutAct_9fa48("25810") ? () => undefined : (stryCov_9fa48("25810"), stat => <div key={stat.label} className="bg-white rounded-xl border border-neutral-200 p-4">
            <p className="text-sm text-neutral-500">{stat.label}</p>
            <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
          </div>))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          {categories.map(stryMutAct_9fa48("25811") ? () => undefined : (stryCov_9fa48("25811"), cat => <button key={cat} className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors', (stryMutAct_9fa48("25815") ? cat !== 'All' : stryMutAct_9fa48("25814") ? false : stryMutAct_9fa48("25813") ? true : (stryCov_9fa48("25813", "25814", "25815"), cat === 'All')) ? 'bg-primary-100 text-primary-700' : 'text-neutral-600 hover:bg-neutral-100')}>
              {cat}
            </button>))}
        </div>
        <input type="text" placeholder="Search sources..." className="ml-auto w-64 h-9 px-3 border border-neutral-300 rounded-lg text-sm" />
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.map(stryMutAct_9fa48("25819") ? () => undefined : (stryCov_9fa48("25819"), source => <div key={source.id} className="bg-white rounded-xl border border-neutral-200 p-5 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{source.icon}</div>
                <div>
                  <h3 className="font-semibold text-neutral-900">{source.name}</h3>
                  <p className="text-sm text-neutral-500">{source.type}</p>
                </div>
              </div>
              <span className={cn('w-2.5 h-2.5 rounded-full mt-1', stryMutAct_9fa48("25823") ? source.status === 'connected' || 'bg-success-main' : stryMutAct_9fa48("25822") ? false : stryMutAct_9fa48("25821") ? true : (stryCov_9fa48("25821", "25822", "25823"), (stryMutAct_9fa48("25825") ? source.status !== 'connected' : stryMutAct_9fa48("25824") ? true : (stryCov_9fa48("25824", "25825"), source.status === 'connected')) && 'bg-success-main'), stryMutAct_9fa48("25830") ? source.status === 'syncing' || 'bg-warning-main animate-pulse' : stryMutAct_9fa48("25829") ? false : stryMutAct_9fa48("25828") ? true : (stryCov_9fa48("25828", "25829", "25830"), (stryMutAct_9fa48("25832") ? source.status !== 'syncing' : stryMutAct_9fa48("25831") ? true : (stryCov_9fa48("25831", "25832"), source.status === 'syncing')) && 'bg-warning-main animate-pulse'), stryMutAct_9fa48("25837") ? source.status === 'error' || 'bg-error-main' : stryMutAct_9fa48("25836") ? false : stryMutAct_9fa48("25835") ? true : (stryCov_9fa48("25835", "25836", "25837"), (stryMutAct_9fa48("25839") ? source.status !== 'error' : stryMutAct_9fa48("25838") ? true : (stryCov_9fa48("25838", "25839"), source.status === 'error')) && 'bg-error-main'))} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-neutral-500">Records</p>
                <p className="font-medium text-neutral-900">{formatNumber(source.records)}</p>
              </div>
              <div>
                <p className="text-neutral-500">Growth</p>
                <p className={cn('font-medium', (stryMutAct_9fa48("25846") ? source.growth < 0 : stryMutAct_9fa48("25845") ? source.growth > 0 : stryMutAct_9fa48("25844") ? false : stryMutAct_9fa48("25843") ? true : (stryCov_9fa48("25843", "25844", "25845", "25846"), source.growth >= 0)) ? 'text-success-main' : 'text-error-main')}>
                  {(stryMutAct_9fa48("25852") ? source.growth < 0 : stryMutAct_9fa48("25851") ? source.growth > 0 : stryMutAct_9fa48("25850") ? false : stryMutAct_9fa48("25849") ? true : (stryCov_9fa48("25849", "25850", "25851", "25852"), source.growth >= 0)) ? '+' : ''}{source.growth}%
                </p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-xs text-neutral-400">
                {(stryMutAct_9fa48("25857") ? source.status !== 'syncing' : stryMutAct_9fa48("25856") ? false : stryMutAct_9fa48("25855") ? true : (stryCov_9fa48("25855", "25856", "25857"), source.status === 'syncing')) ? 'Syncing now...' : source.lastSync ? `Last sync ${formatRelativeTime(source.lastSync)}` : 'Never synced'}
              </span>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Configure
              </button>
            </div>
          </div>))}
      </div>
    </div>;
};

// =============================================================================
// DATA CATALOG PAGE
// =============================================================================

export const DataCatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const datasets = stryMutAct_9fa48("25864") ? [] : (stryCov_9fa48("25864"), [stryMutAct_9fa48("25865") ? {} : (stryCov_9fa48("25865"), {
    id: 1,
    name: 'customers',
    source: 'Salesforce',
    type: 'Table',
    columns: 45,
    rows: 125000,
    owner: 'Sales',
    tags: stryMutAct_9fa48("25870") ? [] : (stryCov_9fa48("25870"), ['core', 'pii']),
    quality: 94
  }), stryMutAct_9fa48("25873") ? {} : (stryCov_9fa48("25873"), {
    id: 2,
    name: 'orders',
    source: 'SAP ERP',
    type: 'Table',
    columns: 32,
    rows: 890000,
    owner: 'Finance',
    tags: stryMutAct_9fa48("25878") ? [] : (stryCov_9fa48("25878"), ['core', 'transactional']),
    quality: 98
  }), stryMutAct_9fa48("25881") ? {} : (stryCov_9fa48("25881"), {
    id: 3,
    name: 'products',
    source: 'PostgreSQL',
    type: 'Table',
    columns: 28,
    rows: 15000,
    owner: 'Product',
    tags: stryMutAct_9fa48("25886") ? [] : (stryCov_9fa48("25886"), ['master']),
    quality: 87
  }), stryMutAct_9fa48("25888") ? {} : (stryCov_9fa48("25888"), {
    id: 4,
    name: 'revenue_metrics',
    source: 'Snowflake',
    type: 'View',
    columns: 12,
    rows: null,
    owner: 'Finance',
    tags: stryMutAct_9fa48("25893") ? [] : (stryCov_9fa48("25893"), ['kpi', 'aggregated']),
    quality: 96
  }), stryMutAct_9fa48("25896") ? {} : (stryCov_9fa48("25896"), {
    id: 5,
    name: 'marketing_campaigns',
    source: 'HubSpot',
    type: 'Table',
    columns: 38,
    rows: 2500,
    owner: 'Marketing',
    tags: stryMutAct_9fa48("25901") ? [] : (stryCov_9fa48("25901"), ['campaigns']),
    quality: 82
  }), stryMutAct_9fa48("25903") ? {} : (stryCov_9fa48("25903"), {
    id: 6,
    name: 'employee_directory',
    source: 'Workday',
    type: 'Table',
    columns: 52,
    rows: 1200,
    owner: 'HR',
    tags: stryMutAct_9fa48("25908") ? [] : (stryCov_9fa48("25908"), ['pii', 'sensitive']),
    quality: 91
  })]);
  return <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Data Catalog</h1>
          <p className="text-neutral-500">Discover and understand your data assets</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={stryMutAct_9fa48("25911") ? () => undefined : (stryCov_9fa48("25911"), () => setViewMode('grid'))} className={cn('p-2 rounded-lg', (stryMutAct_9fa48("25916") ? viewMode !== 'grid' : stryMutAct_9fa48("25915") ? false : stryMutAct_9fa48("25914") ? true : (stryCov_9fa48("25914", "25915", "25916"), viewMode === 'grid')) ? 'bg-neutral-100' : 'hover:bg-neutral-50')}>
            ▦
          </button>
          <button onClick={stryMutAct_9fa48("25920") ? () => undefined : (stryCov_9fa48("25920"), () => setViewMode('list'))} className={cn('p-2 rounded-lg', (stryMutAct_9fa48("25925") ? viewMode !== 'list' : stryMutAct_9fa48("25924") ? false : stryMutAct_9fa48("25923") ? true : (stryCov_9fa48("25923", "25924", "25925"), viewMode === 'list')) ? 'bg-neutral-100' : 'hover:bg-neutral-50')}>
            ≡
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <input type="text" placeholder="Search datasets, columns, or tags..." className="flex-1 min-w-64 h-10 px-4 border border-neutral-300 rounded-lg" />
          <select className="h-10 px-3 border border-neutral-300 rounded-lg">
            <option>All Sources</option>
            <option>Salesforce</option>
            <option>Snowflake</option>
            <option>SAP ERP</option>
          </select>
          <select className="h-10 px-3 border border-neutral-300 rounded-lg">
            <option>All Owners</option>
            <option>Sales</option>
            <option>Finance</option>
            <option>Marketing</option>
          </select>
          <select className="h-10 px-3 border border-neutral-300 rounded-lg">
            <option>All Tags</option>
            <option>core</option>
            <option>pii</option>
            <option>kpi</option>
          </select>
        </div>
      </div>

      {/* Datasets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {datasets.map(stryMutAct_9fa48("25929") ? () => undefined : (stryCov_9fa48("25929"), dataset => <div key={dataset.id} onClick={stryMutAct_9fa48("25930") ? () => undefined : (stryCov_9fa48("25930"), () => navigate(`/cortex/graph/entity/dataset-${dataset.id}`))} className="bg-white rounded-xl border border-neutral-200 p-5 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">📊</span>
                  <h3 className="font-semibold text-neutral-900">{dataset.name}</h3>
                </div>
                <p className="text-sm text-neutral-500 mt-1">{dataset.source} • {dataset.type}</p>
              </div>
              <div className={cn('px-2 py-1 rounded-full text-xs font-medium', (stryMutAct_9fa48("25936") ? dataset.quality < 90 : stryMutAct_9fa48("25935") ? dataset.quality > 90 : stryMutAct_9fa48("25934") ? false : stryMutAct_9fa48("25933") ? true : (stryCov_9fa48("25933", "25934", "25935", "25936"), dataset.quality >= 90)) ? 'bg-success-light text-success-dark' : (stryMutAct_9fa48("25941") ? dataset.quality < 70 : stryMutAct_9fa48("25940") ? dataset.quality > 70 : stryMutAct_9fa48("25939") ? false : stryMutAct_9fa48("25938") ? true : (stryCov_9fa48("25938", "25939", "25940", "25941"), dataset.quality >= 70)) ? 'bg-warning-light text-warning-dark' : 'bg-error-light text-error-dark')}>
                {dataset.quality}%
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-neutral-500 mb-3">
              <span>{dataset.columns} columns</span>
              <span>•</span>
              <span>{dataset.rows ? formatNumber(dataset.rows) + ' rows' : 'View'}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {dataset.tags.map(stryMutAct_9fa48("25946") ? () => undefined : (stryCov_9fa48("25946"), tag => <span key={tag} className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs rounded">
                    {tag}
                  </span>))}
              </div>
              <span className="text-xs text-neutral-400">{dataset.owner}</span>
            </div>
          </div>))}
      </div>
    </div>;
};

// =============================================================================
// DATA QUALITY PAGE
// =============================================================================

export const DataQualityPage: React.FC = () => {
  const qualityDimensions = stryMutAct_9fa48("25948") ? [] : (stryCov_9fa48("25948"), [stryMutAct_9fa48("25949") ? {} : (stryCov_9fa48("25949"), {
    name: 'Completeness',
    score: 92,
    trend: 'up',
    issues: 234
  }), stryMutAct_9fa48("25952") ? {} : (stryCov_9fa48("25952"), {
    name: 'Accuracy',
    score: 96,
    trend: 'stable',
    issues: 89
  }), stryMutAct_9fa48("25955") ? {} : (stryCov_9fa48("25955"), {
    name: 'Consistency',
    score: 87,
    trend: 'down',
    issues: 456
  }), stryMutAct_9fa48("25958") ? {} : (stryCov_9fa48("25958"), {
    name: 'Timeliness',
    score: 78,
    trend: 'up',
    issues: 123
  }), stryMutAct_9fa48("25961") ? {} : (stryCov_9fa48("25961"), {
    name: 'Uniqueness',
    score: 94,
    trend: 'stable',
    issues: 45
  }), stryMutAct_9fa48("25964") ? {} : (stryCov_9fa48("25964"), {
    name: 'Validity',
    score: 91,
    trend: 'up',
    issues: 178
  })]);
  const recentIssues = stryMutAct_9fa48("25967") ? [] : (stryCov_9fa48("25967"), [stryMutAct_9fa48("25968") ? {} : (stryCov_9fa48("25968"), {
    id: 1,
    severity: 'critical',
    dataset: 'customers',
    issue: 'Null values in email column',
    affected: 1234,
    detected: new Date(stryMutAct_9fa48("25972") ? Date.now() + 3600000 : (stryCov_9fa48("25972"), Date.now() - 3600000))
  }), stryMutAct_9fa48("25973") ? {} : (stryCov_9fa48("25973"), {
    id: 2,
    severity: 'warning',
    dataset: 'orders',
    issue: 'Date format inconsistency',
    affected: 567,
    detected: new Date(stryMutAct_9fa48("25977") ? Date.now() + 7200000 : (stryCov_9fa48("25977"), Date.now() - 7200000))
  }), stryMutAct_9fa48("25978") ? {} : (stryCov_9fa48("25978"), {
    id: 3,
    severity: 'warning',
    dataset: 'products',
    issue: 'Duplicate SKU values',
    affected: 23,
    detected: new Date(stryMutAct_9fa48("25982") ? Date.now() + 14400000 : (stryCov_9fa48("25982"), Date.now() - 14400000))
  }), stryMutAct_9fa48("25983") ? {} : (stryCov_9fa48("25983"), {
    id: 4,
    severity: 'info',
    dataset: 'marketing_campaigns',
    issue: 'Missing campaign end dates',
    affected: 45,
    detected: new Date(stryMutAct_9fa48("25987") ? Date.now() + 28800000 : (stryCov_9fa48("25987"), Date.now() - 28800000))
  })]);
  return <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Data Quality</h1>
          <p className="text-neutral-500">Monitor and improve data quality across your organization</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          Run Quality Check
        </button>
      </div>

      {/* Overall Score */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <div className="flex items-center gap-8">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="56" fill="none" stroke="#E2E8F0" strokeWidth="12" />
              <circle cx="64" cy="64" r="56" fill="none" stroke="#22C55E" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${stryMutAct_9fa48("25989") ? 91 / 100 / 352 : (stryCov_9fa48("25989"), (stryMutAct_9fa48("25990") ? 91 * 100 : (stryCov_9fa48("25990"), 91 / 100)) * 352)} 352`} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-neutral-900">91%</span>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Overall Data Quality</h2>
            <p className="text-neutral-500">Based on 6 quality dimensions across 42 datasets</p>
            <p className="text-success-main font-medium mt-2">↑ 2% from last week</p>
          </div>
        </div>
      </div>

      {/* Quality Dimensions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {qualityDimensions.map(stryMutAct_9fa48("25991") ? () => undefined : (stryCov_9fa48("25991"), dim => <div key={dim.name} className="bg-white rounded-xl border border-neutral-200 p-4">
            <p className="text-sm text-neutral-500 mb-1">{dim.name}</p>
            <p className="text-2xl font-bold text-neutral-900">{dim.score}%</p>
            <p className={cn('text-sm font-medium', (stryMutAct_9fa48("25995") ? dim.trend !== 'up' : stryMutAct_9fa48("25994") ? false : stryMutAct_9fa48("25993") ? true : (stryCov_9fa48("25993", "25994", "25995"), dim.trend === 'up')) ? 'text-success-main' : (stryMutAct_9fa48("26000") ? dim.trend !== 'down' : stryMutAct_9fa48("25999") ? false : stryMutAct_9fa48("25998") ? true : (stryCov_9fa48("25998", "25999", "26000"), dim.trend === 'down')) ? 'text-error-main' : 'text-neutral-500')}>
              {(stryMutAct_9fa48("26006") ? dim.trend !== 'up' : stryMutAct_9fa48("26005") ? false : stryMutAct_9fa48("26004") ? true : (stryCov_9fa48("26004", "26005", "26006"), dim.trend === 'up')) ? '↑' : (stryMutAct_9fa48("26011") ? dim.trend !== 'down' : stryMutAct_9fa48("26010") ? false : stryMutAct_9fa48("26009") ? true : (stryCov_9fa48("26009", "26010", "26011"), dim.trend === 'down')) ? '↓' : '→'} {dim.issues} issues
            </p>
          </div>))}
      </div>

      {/* Recent Issues */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">Recent Issues</h2>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All →
          </button>
        </div>
        
        <div className="space-y-3">
          {recentIssues.map(stryMutAct_9fa48("26015") ? () => undefined : (stryCov_9fa48("26015"), issue => <div key={issue.id} className={cn('p-4 rounded-lg border-l-4', stryMutAct_9fa48("26019") ? issue.severity === 'critical' || 'bg-error-light/50 border-error-main' : stryMutAct_9fa48("26018") ? false : stryMutAct_9fa48("26017") ? true : (stryCov_9fa48("26017", "26018", "26019"), (stryMutAct_9fa48("26021") ? issue.severity !== 'critical' : stryMutAct_9fa48("26020") ? true : (stryCov_9fa48("26020", "26021"), issue.severity === 'critical')) && 'bg-error-light/50 border-error-main'), stryMutAct_9fa48("26026") ? issue.severity === 'warning' || 'bg-warning-light/50 border-warning-main' : stryMutAct_9fa48("26025") ? false : stryMutAct_9fa48("26024") ? true : (stryCov_9fa48("26024", "26025", "26026"), (stryMutAct_9fa48("26028") ? issue.severity !== 'warning' : stryMutAct_9fa48("26027") ? true : (stryCov_9fa48("26027", "26028"), issue.severity === 'warning')) && 'bg-warning-light/50 border-warning-main'), stryMutAct_9fa48("26033") ? issue.severity === 'info' || 'bg-info-light/50 border-info-main' : stryMutAct_9fa48("26032") ? false : stryMutAct_9fa48("26031") ? true : (stryCov_9fa48("26031", "26032", "26033"), (stryMutAct_9fa48("26035") ? issue.severity !== 'info' : stryMutAct_9fa48("26034") ? true : (stryCov_9fa48("26034", "26035"), issue.severity === 'info')) && 'bg-info-light/50 border-info-main'))}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-neutral-900">{issue.issue}</p>
                  <p className="text-sm text-neutral-500 mt-1">
                    {issue.dataset} • {formatNumber(issue.affected)} records affected
                  </p>
                </div>
                <span className="text-xs text-neutral-400">{formatRelativeTime(issue.detected)}</span>
              </div>
            </div>))}
        </div>
      </div>
    </div>;
};

// =============================================================================
// DATA IMPORT/EXPORT PAGE
// =============================================================================

export const DataImportExportPage: React.FC = () => {
  const recentExports = stryMutAct_9fa48("26039") ? [] : (stryCov_9fa48("26039"), [stryMutAct_9fa48("26040") ? {} : (stryCov_9fa48("26040"), {
    id: 1,
    name: 'customers_backup.csv',
    size: 45600000,
    status: 'completed',
    date: new Date(stryMutAct_9fa48("26043") ? Date.now() + 86400000 : (stryCov_9fa48("26043"), Date.now() - 86400000))
  }), stryMutAct_9fa48("26044") ? {} : (stryCov_9fa48("26044"), {
    id: 2,
    name: 'orders_2025.parquet',
    size: 890000000,
    status: 'completed',
    date: new Date(stryMutAct_9fa48("26047") ? Date.now() + 172800000 : (stryCov_9fa48("26047"), Date.now() - 172800000))
  }), stryMutAct_9fa48("26048") ? {} : (stryCov_9fa48("26048"), {
    id: 3,
    name: 'metrics_q4.json',
    size: 12500000,
    status: 'in_progress',
    date: new Date()
  })]);
  return <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Import / Export</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Import */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Import Data</h2>
          <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">📤</div>
            <p className="text-neutral-600 mb-2">Drop files here or click to upload</p>
            <p className="text-sm text-neutral-400">CSV, JSON, Parquet, Excel (max 500MB)</p>
            <button className="mt-4 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
              Browse Files
            </button>
          </div>
        </div>

        {/* Export */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Export Data</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Dataset</label>
              <select className="w-full h-10 px-3 border border-neutral-300 rounded-lg">
                <option>Select a dataset...</option>
                <option>customers</option>
                <option>orders</option>
                <option>products</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Format</label>
              <select className="w-full h-10 px-3 border border-neutral-300 rounded-lg">
                <option>CSV</option>
                <option>JSON</option>
                <option>Parquet</option>
                <option>Excel</option>
              </select>
            </div>
            <button className="w-full px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Recent Exports */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Recent Exports</h2>
        <div className="space-y-3">
          {recentExports.map(stryMutAct_9fa48("26051") ? () => undefined : (stryCov_9fa48("26051"), exp => <div key={exp.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
              <div className="flex items-center gap-4">
                <span className="text-2xl">📄</span>
                <div>
                  <p className="font-medium text-neutral-900">{exp.name}</p>
                  <p className="text-sm text-neutral-500">{formatBytes(exp.size)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={cn('px-2 py-1 rounded-full text-xs font-medium', (stryMutAct_9fa48("26055") ? exp.status !== 'completed' : stryMutAct_9fa48("26054") ? false : stryMutAct_9fa48("26053") ? true : (stryCov_9fa48("26053", "26054", "26055"), exp.status === 'completed')) ? 'bg-success-light text-success-dark' : 'bg-warning-light text-warning-dark')}>
                  {exp.status}
                </span>
                {stryMutAct_9fa48("26061") ? exp.status === 'completed' || <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Download
                  </button> : stryMutAct_9fa48("26060") ? false : stryMutAct_9fa48("26059") ? true : (stryCov_9fa48("26059", "26060", "26061"), (stryMutAct_9fa48("26063") ? exp.status !== 'completed' : stryMutAct_9fa48("26062") ? true : (stryCov_9fa48("26062", "26063"), exp.status === 'completed')) && <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Download
                  </button>)}
              </div>
            </div>))}
        </div>
      </div>
    </div>;
};
export default DataSourcesPage;