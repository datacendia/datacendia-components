// @ts-nocheck
// =============================================================================
// DATACENDIA - GRAPH SUB-PAGES
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
import { useNavigate, useParams } from 'react-router-dom';
import { cn, formatRelativeTime } from '../../../../lib/utils';

// =============================================================================
// LINEAGE VIEW PAGE
// =============================================================================

export const LineageViewPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    entityId
  } = useParams();
  const [direction, setDirection] = useState<'upstream' | 'downstream' | 'both'>('both');

  // Mock lineage data
  const centralEntity = stryMutAct_9fa48("36304") ? {} : (stryCov_9fa48("36304"), {
    id: stryMutAct_9fa48("36307") ? entityId && 'revenue_metrics' : stryMutAct_9fa48("36306") ? false : stryMutAct_9fa48("36305") ? true : (stryCov_9fa48("36305", "36306", "36307"), entityId || 'revenue_metrics'),
    name: 'revenue_metrics',
    type: 'dataset'
  });
  const upstreamNodes = stryMutAct_9fa48("36311") ? [] : (stryCov_9fa48("36311"), [stryMutAct_9fa48("36312") ? {} : (stryCov_9fa48("36312"), {
    id: 'orders',
    name: 'orders',
    type: 'dataset',
    distance: 1
  }), stryMutAct_9fa48("36316") ? {} : (stryCov_9fa48("36316"), {
    id: 'customers',
    name: 'customers',
    type: 'dataset',
    distance: 1
  }), stryMutAct_9fa48("36320") ? {} : (stryCov_9fa48("36320"), {
    id: 'products',
    name: 'products',
    type: 'dataset',
    distance: 2
  }), stryMutAct_9fa48("36324") ? {} : (stryCov_9fa48("36324"), {
    id: 'salesforce',
    name: 'Salesforce CRM',
    type: 'source',
    distance: 3
  }), stryMutAct_9fa48("36328") ? {} : (stryCov_9fa48("36328"), {
    id: 'sap',
    name: 'SAP ERP',
    type: 'source',
    distance: 3
  })]);
  const downstreamNodes = stryMutAct_9fa48("36332") ? [] : (stryCov_9fa48("36332"), [stryMutAct_9fa48("36333") ? {} : (stryCov_9fa48("36333"), {
    id: 'revenue_dashboard',
    name: 'Revenue Dashboard',
    type: 'dashboard',
    distance: 1
  }), stryMutAct_9fa48("36337") ? {} : (stryCov_9fa48("36337"), {
    id: 'monthly_report',
    name: 'Monthly Revenue Report',
    type: 'report',
    distance: 1
  }), stryMutAct_9fa48("36341") ? {} : (stryCov_9fa48("36341"), {
    id: 'forecast_pipeline',
    name: 'Revenue Forecast',
    type: 'process',
    distance: 2
  }), stryMutAct_9fa48("36345") ? {} : (stryCov_9fa48("36345"), {
    id: 'exec_dashboard',
    name: 'Executive Dashboard',
    type: 'dashboard',
    distance: 2
  })]);
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'dataset':
        if (stryMutAct_9fa48("36350")) {} else {
          stryCov_9fa48("36350");
          return 'bg-blue-500';
        }
      case 'source':
        if (stryMutAct_9fa48("36353")) {} else {
          stryCov_9fa48("36353");
          return 'bg-purple-500';
        }
      case 'dashboard':
        if (stryMutAct_9fa48("36356")) {} else {
          stryCov_9fa48("36356");
          return 'bg-green-500';
        }
      case 'report':
        if (stryMutAct_9fa48("36359")) {} else {
          stryCov_9fa48("36359");
          return 'bg-amber-500';
        }
      case 'process':
        if (stryMutAct_9fa48("36362")) {} else {
          stryCov_9fa48("36362");
          return 'bg-teal-500';
        }
      default:
        if (stryMutAct_9fa48("36365")) {} else {
          stryCov_9fa48("36365");
          return 'bg-neutral-500';
        }
    }
  };
  return <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
            <button onClick={stryMutAct_9fa48("36367") ? () => undefined : (stryCov_9fa48("36367"), () => navigate('/cortex/graph'))} className="hover:text-primary-600">
              Graph
            </button>
            <span>/</span>
            <span>Lineage</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Data Lineage: {centralEntity.name}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {(['upstream', 'both', 'downstream'] as const).map(stryMutAct_9fa48("36369") ? () => undefined : (stryCov_9fa48("36369"), dir => <button key={dir} onClick={stryMutAct_9fa48("36370") ? () => undefined : (stryCov_9fa48("36370"), () => setDirection(dir))} className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize', (stryMutAct_9fa48("36374") ? direction !== dir : stryMutAct_9fa48("36373") ? false : stryMutAct_9fa48("36372") ? true : (stryCov_9fa48("36372", "36373", "36374"), direction === dir)) ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200')}>
              {dir}
            </button>))}
        </div>
      </div>

      {/* Lineage Visualization */}
      <div className="bg-white rounded-xl border border-neutral-200 p-8 mb-6 min-h-[500px]">
        <div className="flex items-center justify-center gap-8">
          {/* Upstream */}
          {stryMutAct_9fa48("36379") ? direction === 'upstream' || direction === 'both' || <div className="flex flex-col items-end gap-4">
              <h3 className="text-sm font-medium text-neutral-500 mb-2">Upstream (Sources)</h3>
              {upstreamNodes.map(node => <div key={node.id} onClick={() => navigate(`/cortex/graph/entity/${node.id}`)} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 cursor-pointer group">
                  <span className="text-sm text-neutral-500">{node.distance} hop{node.distance > 1 ? 's' : ''}</span>
                  <div className={cn('w-3 h-3 rounded-full', getNodeColor(node.type))} />
                  <span className="font-medium text-neutral-900 group-hover:text-primary-600">{node.name}</span>
                </div>)}
            </div> : stryMutAct_9fa48("36378") ? false : stryMutAct_9fa48("36377") ? true : (stryCov_9fa48("36377", "36378", "36379"), (stryMutAct_9fa48("36381") ? direction === 'upstream' && direction === 'both' : stryMutAct_9fa48("36380") ? true : (stryCov_9fa48("36380", "36381"), (stryMutAct_9fa48("36383") ? direction !== 'upstream' : stryMutAct_9fa48("36382") ? false : (stryCov_9fa48("36382", "36383"), direction === 'upstream')) || (stryMutAct_9fa48("36386") ? direction !== 'both' : stryMutAct_9fa48("36385") ? false : (stryCov_9fa48("36385", "36386"), direction === 'both')))) && <div className="flex flex-col items-end gap-4">
              <h3 className="text-sm font-medium text-neutral-500 mb-2">Upstream (Sources)</h3>
              {upstreamNodes.map(stryMutAct_9fa48("36388") ? () => undefined : (stryCov_9fa48("36388"), node => <div key={node.id} onClick={stryMutAct_9fa48("36389") ? () => undefined : (stryCov_9fa48("36389"), () => navigate(`/cortex/graph/entity/${node.id}`))} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 cursor-pointer group">
                  <span className="text-sm text-neutral-500">{node.distance} hop{(stryMutAct_9fa48("36394") ? node.distance <= 1 : stryMutAct_9fa48("36393") ? node.distance >= 1 : stryMutAct_9fa48("36392") ? false : stryMutAct_9fa48("36391") ? true : (stryCov_9fa48("36391", "36392", "36393", "36394"), node.distance > 1)) ? 's' : ''}</span>
                  <div className={cn('w-3 h-3 rounded-full', getNodeColor(node.type))} />
                  <span className="font-medium text-neutral-900 group-hover:text-primary-600">{node.name}</span>
                </div>))}
            </div>)}

          {/* Arrows */}
          {stryMutAct_9fa48("36400") ? direction === 'upstream' || direction === 'both' || <div className="text-4xl text-neutral-300">→</div> : stryMutAct_9fa48("36399") ? false : stryMutAct_9fa48("36398") ? true : (stryCov_9fa48("36398", "36399", "36400"), (stryMutAct_9fa48("36402") ? direction === 'upstream' && direction === 'both' : stryMutAct_9fa48("36401") ? true : (stryCov_9fa48("36401", "36402"), (stryMutAct_9fa48("36404") ? direction !== 'upstream' : stryMutAct_9fa48("36403") ? false : (stryCov_9fa48("36403", "36404"), direction === 'upstream')) || (stryMutAct_9fa48("36407") ? direction !== 'both' : stryMutAct_9fa48("36406") ? false : (stryCov_9fa48("36406", "36407"), direction === 'both')))) && <div className="text-4xl text-neutral-300">→</div>)}

          {/* Central Entity */}
          <div className="p-6 bg-primary-50 border-2 border-primary-500 rounded-xl">
            <div className={cn('w-4 h-4 rounded-full mx-auto mb-2', getNodeColor(centralEntity.type))} />
            <p className="font-bold text-lg text-neutral-900 text-center">{centralEntity.name}</p>
            <p className="text-sm text-neutral-500 text-center">{centralEntity.type}</p>
          </div>

          {/* Arrows */}
          {stryMutAct_9fa48("36412") ? direction === 'downstream' || direction === 'both' || <div className="text-4xl text-neutral-300">→</div> : stryMutAct_9fa48("36411") ? false : stryMutAct_9fa48("36410") ? true : (stryCov_9fa48("36410", "36411", "36412"), (stryMutAct_9fa48("36414") ? direction === 'downstream' && direction === 'both' : stryMutAct_9fa48("36413") ? true : (stryCov_9fa48("36413", "36414"), (stryMutAct_9fa48("36416") ? direction !== 'downstream' : stryMutAct_9fa48("36415") ? false : (stryCov_9fa48("36415", "36416"), direction === 'downstream')) || (stryMutAct_9fa48("36419") ? direction !== 'both' : stryMutAct_9fa48("36418") ? false : (stryCov_9fa48("36418", "36419"), direction === 'both')))) && <div className="text-4xl text-neutral-300">→</div>)}

          {/* Downstream */}
          {stryMutAct_9fa48("36423") ? direction === 'downstream' || direction === 'both' || <div className="flex flex-col items-start gap-4">
              <h3 className="text-sm font-medium text-neutral-500 mb-2">Downstream (Consumers)</h3>
              {downstreamNodes.map(node => <div key={node.id} onClick={() => navigate(`/cortex/graph/entity/${node.id}`)} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 cursor-pointer group">
                  <span className="font-medium text-neutral-900 group-hover:text-primary-600">{node.name}</span>
                  <div className={cn('w-3 h-3 rounded-full', getNodeColor(node.type))} />
                  <span className="text-sm text-neutral-500">{node.distance} hop{node.distance > 1 ? 's' : ''}</span>
                </div>)}
            </div> : stryMutAct_9fa48("36422") ? false : stryMutAct_9fa48("36421") ? true : (stryCov_9fa48("36421", "36422", "36423"), (stryMutAct_9fa48("36425") ? direction === 'downstream' && direction === 'both' : stryMutAct_9fa48("36424") ? true : (stryCov_9fa48("36424", "36425"), (stryMutAct_9fa48("36427") ? direction !== 'downstream' : stryMutAct_9fa48("36426") ? false : (stryCov_9fa48("36426", "36427"), direction === 'downstream')) || (stryMutAct_9fa48("36430") ? direction !== 'both' : stryMutAct_9fa48("36429") ? false : (stryCov_9fa48("36429", "36430"), direction === 'both')))) && <div className="flex flex-col items-start gap-4">
              <h3 className="text-sm font-medium text-neutral-500 mb-2">Downstream (Consumers)</h3>
              {downstreamNodes.map(stryMutAct_9fa48("36432") ? () => undefined : (stryCov_9fa48("36432"), node => <div key={node.id} onClick={stryMutAct_9fa48("36433") ? () => undefined : (stryCov_9fa48("36433"), () => navigate(`/cortex/graph/entity/${node.id}`))} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 cursor-pointer group">
                  <span className="font-medium text-neutral-900 group-hover:text-primary-600">{node.name}</span>
                  <div className={cn('w-3 h-3 rounded-full', getNodeColor(node.type))} />
                  <span className="text-sm text-neutral-500">{node.distance} hop{(stryMutAct_9fa48("36439") ? node.distance <= 1 : stryMutAct_9fa48("36438") ? node.distance >= 1 : stryMutAct_9fa48("36437") ? false : stryMutAct_9fa48("36436") ? true : (stryCov_9fa48("36436", "36437", "36438", "36439"), node.distance > 1)) ? 's' : ''}</span>
                </div>))}
            </div>)}
        </div>
      </div>

      {/* Impact Analysis */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Impact Analysis</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-neutral-50 rounded-lg">
            <p className="text-sm text-neutral-500">Upstream Dependencies</p>
            <p className="text-2xl font-bold text-neutral-900">{upstreamNodes.length}</p>
          </div>
          <div className="p-4 bg-neutral-50 rounded-lg">
            <p className="text-sm text-neutral-500">Downstream Consumers</p>
            <p className="text-2xl font-bold text-neutral-900">{downstreamNodes.length}</p>
          </div>
          <div className="p-4 bg-neutral-50 rounded-lg">
            <p className="text-sm text-neutral-500">Max Depth</p>
            <p className="text-2xl font-bold text-neutral-900">3 hops</p>
          </div>
          <div className="p-4 bg-neutral-50 rounded-lg">
            <p className="text-sm text-neutral-500">Risk Score</p>
            <p className="text-2xl font-bold text-warning-main">Medium</p>
          </div>
        </div>
      </div>
    </div>;
};

// =============================================================================
// ENTITY DETAILS PAGE
// =============================================================================

export const EntityDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    entityId
  } = useParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'schema' | 'lineage' | 'quality' | 'usage'>('overview');

  // Mock entity data
  const entity = stryMutAct_9fa48("36444") ? {} : (stryCov_9fa48("36444"), {
    id: stryMutAct_9fa48("36447") ? entityId && 'customers' : stryMutAct_9fa48("36446") ? false : stryMutAct_9fa48("36445") ? true : (stryCov_9fa48("36445", "36446", "36447"), entityId || 'customers'),
    name: 'customers',
    type: 'dataset',
    source: 'Salesforce CRM',
    owner: 'Sales Team',
    description: 'Master customer data including contact information, account details, and customer lifecycle stage.',
    tags: stryMutAct_9fa48("36454") ? [] : (stryCov_9fa48("36454"), ['core', 'pii', 'master-data']),
    created: 'Jan 15, 2024',
    lastUpdated: new Date(stryMutAct_9fa48("36459") ? Date.now() + 3600000 : (stryCov_9fa48("36459"), Date.now() - 3600000)),
    recordCount: 125000,
    qualityScore: 94
  });
  const columns = stryMutAct_9fa48("36460") ? [] : (stryCov_9fa48("36460"), [stryMutAct_9fa48("36461") ? {} : (stryCov_9fa48("36461"), {
    name: 'customer_id',
    type: 'string',
    nullable: stryMutAct_9fa48("36464") ? true : (stryCov_9fa48("36464"), false),
    pii: stryMutAct_9fa48("36465") ? true : (stryCov_9fa48("36465"), false),
    description: 'Unique customer identifier'
  }), stryMutAct_9fa48("36467") ? {} : (stryCov_9fa48("36467"), {
    name: 'email',
    type: 'string',
    nullable: stryMutAct_9fa48("36470") ? true : (stryCov_9fa48("36470"), false),
    pii: stryMutAct_9fa48("36471") ? false : (stryCov_9fa48("36471"), true),
    description: 'Customer email address'
  }), stryMutAct_9fa48("36473") ? {} : (stryCov_9fa48("36473"), {
    name: 'first_name',
    type: 'string',
    nullable: stryMutAct_9fa48("36476") ? false : (stryCov_9fa48("36476"), true),
    pii: stryMutAct_9fa48("36477") ? false : (stryCov_9fa48("36477"), true),
    description: 'Customer first name'
  }), stryMutAct_9fa48("36479") ? {} : (stryCov_9fa48("36479"), {
    name: 'last_name',
    type: 'string',
    nullable: stryMutAct_9fa48("36482") ? false : (stryCov_9fa48("36482"), true),
    pii: stryMutAct_9fa48("36483") ? false : (stryCov_9fa48("36483"), true),
    description: 'Customer last name'
  }), stryMutAct_9fa48("36485") ? {} : (stryCov_9fa48("36485"), {
    name: 'company',
    type: 'string',
    nullable: stryMutAct_9fa48("36488") ? false : (stryCov_9fa48("36488"), true),
    pii: stryMutAct_9fa48("36489") ? true : (stryCov_9fa48("36489"), false),
    description: 'Company name'
  }), stryMutAct_9fa48("36491") ? {} : (stryCov_9fa48("36491"), {
    name: 'lifecycle_stage',
    type: 'enum',
    nullable: stryMutAct_9fa48("36494") ? true : (stryCov_9fa48("36494"), false),
    pii: stryMutAct_9fa48("36495") ? true : (stryCov_9fa48("36495"), false),
    description: 'Customer lifecycle stage'
  }), stryMutAct_9fa48("36497") ? {} : (stryCov_9fa48("36497"), {
    name: 'created_at',
    type: 'timestamp',
    nullable: stryMutAct_9fa48("36500") ? true : (stryCov_9fa48("36500"), false),
    pii: stryMutAct_9fa48("36501") ? true : (stryCov_9fa48("36501"), false),
    description: 'Record creation timestamp'
  }), stryMutAct_9fa48("36503") ? {} : (stryCov_9fa48("36503"), {
    name: 'updated_at',
    type: 'timestamp',
    nullable: stryMutAct_9fa48("36506") ? true : (stryCov_9fa48("36506"), false),
    pii: stryMutAct_9fa48("36507") ? true : (stryCov_9fa48("36507"), false),
    description: 'Last update timestamp'
  })]);
  const usageStats = stryMutAct_9fa48("36509") ? [] : (stryCov_9fa48("36509"), [stryMutAct_9fa48("36510") ? {} : (stryCov_9fa48("36510"), {
    user: 'Revenue Dashboard',
    type: 'dashboard',
    lastAccess: new Date(stryMutAct_9fa48("36513") ? Date.now() + 300000 : (stryCov_9fa48("36513"), Date.now() - 300000)),
    frequency: 'Real-time'
  }), stryMutAct_9fa48("36515") ? {} : (stryCov_9fa48("36515"), {
    user: 'Marketing Team',
    type: 'query',
    lastAccess: new Date(stryMutAct_9fa48("36518") ? Date.now() + 3600000 : (stryCov_9fa48("36518"), Date.now() - 3600000)),
    frequency: 'Daily'
  }), stryMutAct_9fa48("36520") ? {} : (stryCov_9fa48("36520"), {
    user: 'CendiaCFO Agent',
    type: 'agent',
    lastAccess: new Date(stryMutAct_9fa48("36523") ? Date.now() + 7200000 : (stryCov_9fa48("36523"), Date.now() - 7200000)),
    frequency: 'On-demand'
  }), stryMutAct_9fa48("36525") ? {} : (stryCov_9fa48("36525"), {
    user: 'Monthly Report',
    type: 'report',
    lastAccess: new Date(stryMutAct_9fa48("36528") ? Date.now() + 86400000 : (stryCov_9fa48("36528"), Date.now() - 86400000)),
    frequency: 'Monthly'
  })]);
  return <div className="p-6 lg:p-8">
      {/* Breadcrumb & Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
            <button onClick={stryMutAct_9fa48("36530") ? () => undefined : (stryCov_9fa48("36530"), () => navigate('/cortex/graph'))} className="hover:text-primary-600">
              Graph
            </button>
            <span>/</span>
            <span>{entity.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-neutral-900">{entity.name}</h1>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded">{entity.type}</span>
            <span className={cn('px-2 py-1 rounded text-sm', (stryMutAct_9fa48("36536") ? entity.qualityScore < 90 : stryMutAct_9fa48("36535") ? entity.qualityScore > 90 : stryMutAct_9fa48("36534") ? false : stryMutAct_9fa48("36533") ? true : (stryCov_9fa48("36533", "36534", "36535", "36536"), entity.qualityScore >= 90)) ? 'bg-success-light text-success-dark' : 'bg-warning-light text-warning-dark')}>
              Quality: {entity.qualityScore}%
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button onClick={stryMutAct_9fa48("36539") ? () => undefined : (stryCov_9fa48("36539"), () => navigate(`/cortex/graph/lineage/${entity.id}`))} className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50">
            View Lineage
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            Edit
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 mb-6">
        <nav className="flex gap-6">
          {(['overview', 'schema', 'lineage', 'quality', 'usage'] as const).map(stryMutAct_9fa48("36541") ? () => undefined : (stryCov_9fa48("36541"), tab => <button key={tab} onClick={stryMutAct_9fa48("36542") ? () => undefined : (stryCov_9fa48("36542"), () => setActiveTab(tab))} className={cn('pb-3 text-sm font-medium capitalize border-b-2 transition-colors', (stryMutAct_9fa48("36546") ? activeTab !== tab : stryMutAct_9fa48("36545") ? false : stryMutAct_9fa48("36544") ? true : (stryCov_9fa48("36544", "36545", "36546"), activeTab === tab)) ? 'border-primary-600 text-primary-600' : 'border-transparent text-neutral-500 hover:text-neutral-900')}>
              {tab}
            </button>))}
        </nav>
      </div>

      {/* Tab Content */}
      {stryMutAct_9fa48("36551") ? activeTab === 'overview' || <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Description</h2>
              <p className="text-neutral-600">{entity.description}</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-neutral-200 p-4">
                <p className="text-sm text-neutral-500">Records</p>
                <p className="text-2xl font-bold text-neutral-900">{entity.recordCount.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-xl border border-neutral-200 p-4">
                <p className="text-sm text-neutral-500">Columns</p>
                <p className="text-2xl font-bold text-neutral-900">{columns.length}</p>
              </div>
              <div className="bg-white rounded-xl border border-neutral-200 p-4">
                <p className="text-sm text-neutral-500">PII Fields</p>
                <p className="text-2xl font-bold text-warning-main">{columns.filter(c => c.pii).length}</p>
              </div>
            </div>
          </div>

          {/* Metadata Sidebar */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Metadata</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-neutral-500">Source</dt>
                <dd className="font-medium text-neutral-900">{entity.source}</dd>
              </div>
              <div>
                <dt className="text-sm text-neutral-500">Owner</dt>
                <dd className="font-medium text-neutral-900">{entity.owner}</dd>
              </div>
              <div>
                <dt className="text-sm text-neutral-500">Created</dt>
                <dd className="font-medium text-neutral-900">{entity.created}</dd>
              </div>
              <div>
                <dt className="text-sm text-neutral-500">Last Updated</dt>
                <dd className="font-medium text-neutral-900">{formatRelativeTime(entity.lastUpdated)}</dd>
              </div>
              <div>
                <dt className="text-sm text-neutral-500 mb-2">Tags</dt>
                <dd className="flex flex-wrap gap-2">
                  {entity.tags.map(tag => <span key={tag} className="px-2 py-1 bg-neutral-100 text-neutral-600 text-sm rounded">
                      {tag}
                    </span>)}
                </dd>
              </div>
            </dl>
          </div>
        </div> : stryMutAct_9fa48("36550") ? false : stryMutAct_9fa48("36549") ? true : (stryCov_9fa48("36549", "36550", "36551"), (stryMutAct_9fa48("36553") ? activeTab !== 'overview' : stryMutAct_9fa48("36552") ? true : (stryCov_9fa48("36552", "36553"), activeTab === 'overview')) && <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Description</h2>
              <p className="text-neutral-600">{entity.description}</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-neutral-200 p-4">
                <p className="text-sm text-neutral-500">Records</p>
                <p className="text-2xl font-bold text-neutral-900">{entity.recordCount.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-xl border border-neutral-200 p-4">
                <p className="text-sm text-neutral-500">Columns</p>
                <p className="text-2xl font-bold text-neutral-900">{columns.length}</p>
              </div>
              <div className="bg-white rounded-xl border border-neutral-200 p-4">
                <p className="text-sm text-neutral-500">PII Fields</p>
                <p className="text-2xl font-bold text-warning-main">{stryMutAct_9fa48("36555") ? columns.length : (stryCov_9fa48("36555"), columns.filter(stryMutAct_9fa48("36556") ? () => undefined : (stryCov_9fa48("36556"), c => c.pii)).length)}</p>
              </div>
            </div>
          </div>

          {/* Metadata Sidebar */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Metadata</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-neutral-500">Source</dt>
                <dd className="font-medium text-neutral-900">{entity.source}</dd>
              </div>
              <div>
                <dt className="text-sm text-neutral-500">Owner</dt>
                <dd className="font-medium text-neutral-900">{entity.owner}</dd>
              </div>
              <div>
                <dt className="text-sm text-neutral-500">Created</dt>
                <dd className="font-medium text-neutral-900">{entity.created}</dd>
              </div>
              <div>
                <dt className="text-sm text-neutral-500">Last Updated</dt>
                <dd className="font-medium text-neutral-900">{formatRelativeTime(entity.lastUpdated)}</dd>
              </div>
              <div>
                <dt className="text-sm text-neutral-500 mb-2">Tags</dt>
                <dd className="flex flex-wrap gap-2">
                  {entity.tags.map(stryMutAct_9fa48("36557") ? () => undefined : (stryCov_9fa48("36557"), tag => <span key={tag} className="px-2 py-1 bg-neutral-100 text-neutral-600 text-sm rounded">
                      {tag}
                    </span>))}
                </dd>
              </div>
            </dl>
          </div>
        </div>)}

      {stryMutAct_9fa48("36560") ? activeTab === 'schema' || <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Column</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Nullable</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">PII</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Description</th>
              </tr>
            </thead>
            <tbody>
              {columns.map(col => <tr key={col.name} className="border-b border-neutral-100">
                  <td className="px-4 py-3 font-mono text-sm text-neutral-900">{col.name}</td>
                  <td className="px-4 py-3 font-mono text-sm text-neutral-600">{col.type}</td>
                  <td className="px-4 py-3 text-sm">{col.nullable ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3">
                    {col.pii && <span className="px-2 py-0.5 bg-warning-light text-warning-dark text-xs rounded">PII</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-500">{col.description}</td>
                </tr>)}
            </tbody>
          </table>
        </div> : stryMutAct_9fa48("36559") ? false : stryMutAct_9fa48("36558") ? true : (stryCov_9fa48("36558", "36559", "36560"), (stryMutAct_9fa48("36562") ? activeTab !== 'schema' : stryMutAct_9fa48("36561") ? true : (stryCov_9fa48("36561", "36562"), activeTab === 'schema')) && <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Column</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Nullable</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">PII</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Description</th>
              </tr>
            </thead>
            <tbody>
              {columns.map(stryMutAct_9fa48("36564") ? () => undefined : (stryCov_9fa48("36564"), col => <tr key={col.name} className="border-b border-neutral-100">
                  <td className="px-4 py-3 font-mono text-sm text-neutral-900">{col.name}</td>
                  <td className="px-4 py-3 font-mono text-sm text-neutral-600">{col.type}</td>
                  <td className="px-4 py-3 text-sm">{col.nullable ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3">
                    {stryMutAct_9fa48("36569") ? col.pii || <span className="px-2 py-0.5 bg-warning-light text-warning-dark text-xs rounded">PII</span> : stryMutAct_9fa48("36568") ? false : stryMutAct_9fa48("36567") ? true : (stryCov_9fa48("36567", "36568", "36569"), col.pii && <span className="px-2 py-0.5 bg-warning-light text-warning-dark text-xs rounded">PII</span>)}
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-500">{col.description}</td>
                </tr>))}
            </tbody>
          </table>
        </div>)}

      {stryMutAct_9fa48("36572") ? activeTab === 'usage' || <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Consumer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Last Access</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Frequency</th>
              </tr>
            </thead>
            <tbody>
              {usageStats.map((usage, i) => <tr key={i} className="border-b border-neutral-100">
                  <td className="px-4 py-3 font-medium text-neutral-900">{usage.user}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded">
                      {usage.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-500">{formatRelativeTime(usage.lastAccess)}</td>
                  <td className="px-4 py-3 text-sm text-neutral-600">{usage.frequency}</td>
                </tr>)}
            </tbody>
          </table>
        </div> : stryMutAct_9fa48("36571") ? false : stryMutAct_9fa48("36570") ? true : (stryCov_9fa48("36570", "36571", "36572"), (stryMutAct_9fa48("36574") ? activeTab !== 'usage' : stryMutAct_9fa48("36573") ? true : (stryCov_9fa48("36573", "36574"), activeTab === 'usage')) && <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Consumer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Last Access</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Frequency</th>
              </tr>
            </thead>
            <tbody>
              {usageStats.map(stryMutAct_9fa48("36576") ? () => undefined : (stryCov_9fa48("36576"), (usage, i) => <tr key={i} className="border-b border-neutral-100">
                  <td className="px-4 py-3 font-medium text-neutral-900">{usage.user}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded">
                      {usage.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-500">{formatRelativeTime(usage.lastAccess)}</td>
                  <td className="px-4 py-3 text-sm text-neutral-600">{usage.frequency}</td>
                </tr>))}
            </tbody>
          </table>
        </div>)}

      {stryMutAct_9fa48("36579") ? activeTab === 'quality' || <div className="text-center py-12">
          <div className="inline-flex flex-col items-center gap-4">
            <span className="text-4xl">📊</span>
            <h3 className="text-lg font-semibold text-neutral-700">Data Quality Analysis</h3>
            <p className="text-neutral-500 max-w-md">
              Quality metrics show completeness, accuracy, and freshness scores for this entity.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">98%</p>
                <p className="text-sm text-green-700">Completeness</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">95%</p>
                <p className="text-sm text-blue-700">Accuracy</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">2h</p>
                <p className="text-sm text-purple-700">Freshness</p>
              </div>
            </div>
          </div>
        </div> : stryMutAct_9fa48("36578") ? false : stryMutAct_9fa48("36577") ? true : (stryCov_9fa48("36577", "36578", "36579"), (stryMutAct_9fa48("36581") ? activeTab !== 'quality' : stryMutAct_9fa48("36580") ? true : (stryCov_9fa48("36580", "36581"), activeTab === 'quality')) && <div className="text-center py-12">
          <div className="inline-flex flex-col items-center gap-4">
            <span className="text-4xl">📊</span>
            <h3 className="text-lg font-semibold text-neutral-700">Data Quality Analysis</h3>
            <p className="text-neutral-500 max-w-md">
              Quality metrics show completeness, accuracy, and freshness scores for this entity.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">98%</p>
                <p className="text-sm text-green-700">Completeness</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">95%</p>
                <p className="text-sm text-blue-700">Accuracy</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">2h</p>
                <p className="text-sm text-purple-700">Freshness</p>
              </div>
            </div>
          </div>
        </div>)}

      {stryMutAct_9fa48("36585") ? activeTab === 'lineage' || <div className="text-center py-12">
          <button onClick={() => navigate(`/cortex/graph/lineage/${entity.id}`)} className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            Open Full Lineage View
          </button>
        </div> : stryMutAct_9fa48("36584") ? false : stryMutAct_9fa48("36583") ? true : (stryCov_9fa48("36583", "36584", "36585"), (stryMutAct_9fa48("36587") ? activeTab !== 'lineage' : stryMutAct_9fa48("36586") ? true : (stryCov_9fa48("36586", "36587"), activeTab === 'lineage')) && <div className="text-center py-12">
          <button onClick={stryMutAct_9fa48("36589") ? () => undefined : (stryCov_9fa48("36589"), () => navigate(`/cortex/graph/lineage/${entity.id}`))} className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            Open Full Lineage View
          </button>
        </div>)}
    </div>;
};
export default LineageViewPage;