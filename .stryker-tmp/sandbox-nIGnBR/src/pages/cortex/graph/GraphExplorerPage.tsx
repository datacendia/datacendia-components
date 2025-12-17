// @ts-nocheck
// =============================================================================
// DATACENDIA - GRAPH EXPLORER PAGE (Enhanced Dark Theme)
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
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from '../../../../lib/utils';
import { graphApi, lineageApi } from '../../../lib/api';
import type { GraphEntity } from '../../../lib/api/types';
import GraphCanvas from '../../../components/graph/GraphCanvas';
import type { GraphNode, GraphEdge, GraphData } from '../../../components/graph/GraphCanvas';
import { useLanguage } from '../../../contexts/LanguageContext';

// =============================================================================
// TYPES
// =============================================================================

interface SelectedEntity {
  id: string;
  type: string;
  name: string;
  properties?: Record<string, unknown>;
  owner?: string;
  lastUpdated?: string;
  connections?: {
    incoming: number;
    outgoing: number;
  };
}
interface SearchSuggestion {
  id: string;
  name: string;
  type: string;
}

// Node colors by type (dark theme optimized)
const nodeColors: Record<string, {
  bg: string;
  border: string;
  glow: string;
}> = stryMutAct_9fa48("35951") ? {} : (stryCov_9fa48("35951"), {
  dataset: stryMutAct_9fa48("35952") ? {} : (stryCov_9fa48("35952"), {
    bg: '#1E3A5F',
    border: '#3B82F6',
    glow: 'rgba(59, 130, 246, 0.3)'
  }),
  metric: stryMutAct_9fa48("35956") ? {} : (stryCov_9fa48("35956"), {
    bg: '#1A3D2E',
    border: '#10B981',
    glow: 'rgba(16, 185, 129, 0.3)'
  }),
  process: stryMutAct_9fa48("35960") ? {} : (stryCov_9fa48("35960"), {
    bg: '#3D2E1A',
    border: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.3)'
  }),
  entity: stryMutAct_9fa48("35964") ? {} : (stryCov_9fa48("35964"), {
    bg: '#2E1A3D',
    border: '#8B5CF6',
    glow: 'rgba(139, 92, 246, 0.3)'
  }),
  report: stryMutAct_9fa48("35968") ? {} : (stryCov_9fa48("35968"), {
    bg: '#3D1A2E',
    border: '#EC4899',
    glow: 'rgba(236, 72, 153, 0.3)'
  }),
  dashboard: stryMutAct_9fa48("35972") ? {} : (stryCov_9fa48("35972"), {
    bg: '#1A3D3D',
    border: '#06B6D4',
    glow: 'rgba(6, 182, 212, 0.3)'
  }),
  workflow: stryMutAct_9fa48("35976") ? {} : (stryCov_9fa48("35976"), {
    bg: '#3D2B1A',
    border: '#F97316',
    glow: 'rgba(249, 115, 22, 0.3)'
  })
});
const nodeIcons: Record<string, string> = stryMutAct_9fa48("35980") ? {} : (stryCov_9fa48("35980"), {
  dataset: '📊',
  metric: '📈',
  process: '⚙️',
  entity: '🏢',
  report: '📄',
  dashboard: '📋',
  workflow: '🔄'
});
const edgeTypes: Record<string, {
  color: string;
  label: string;
}> = stryMutAct_9fa48("35988") ? {} : (stryCov_9fa48("35988"), {
  derives: stryMutAct_9fa48("35989") ? {} : (stryCov_9fa48("35989"), {
    color: '#3B82F6',
    label: 'Derives From'
  }),
  feeds: stryMutAct_9fa48("35992") ? {} : (stryCov_9fa48("35992"), {
    color: '#10B981',
    label: 'Feeds Into'
  }),
  transforms: stryMutAct_9fa48("35995") ? {} : (stryCov_9fa48("35995"), {
    color: '#F59E0B',
    label: 'Transforms'
  }),
  owns: stryMutAct_9fa48("35998") ? {} : (stryCov_9fa48("35998"), {
    color: '#8B5CF6',
    label: 'Owns'
  }),
  related: stryMutAct_9fa48("36001") ? {} : (stryCov_9fa48("36001"), {
    color: '#6B7280',
    label: 'Related To'
  }),
  inferred: stryMutAct_9fa48("36004") ? {} : (stryCov_9fa48("36004"), {
    color: '#9CA3AF',
    label: 'Inferred (Heuristic)'
  })
});

// =============================================================================
// ENTITY DETAILS PANEL
// =============================================================================

const EntityDetailsPanel: React.FC<{
  entity: SelectedEntity | null;
  onClose: () => void;
  onViewLineage: () => void;
  onViewImpact: () => void;
  onAskCouncil: () => void;
}> = ({
  entity,
  onClose,
  onViewLineage,
  onViewImpact,
  onAskCouncil
}) => {
  if (stryMutAct_9fa48("36010") ? false : stryMutAct_9fa48("36009") ? true : stryMutAct_9fa48("36008") ? entity : (stryCov_9fa48("36008", "36009", "36010"), !entity)) {
    return null;
  }
  const colors = stryMutAct_9fa48("36014") ? nodeColors[entity.type] && nodeColors.entity : stryMutAct_9fa48("36013") ? false : stryMutAct_9fa48("36012") ? true : (stryCov_9fa48("36012", "36013", "36014"), nodeColors[entity.type] || nodeColors.entity);
  return <div className="absolute bottom-4 left-4 bg-neutral-800 rounded-xl shadow-xl border border-neutral-700 p-4 w-80 z-10">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl border" style={stryMutAct_9fa48("36015") ? {} : (stryCov_9fa48("36015"), {
          backgroundColor: colors.bg,
          borderColor: colors.border
        })}>
            {stryMutAct_9fa48("36018") ? nodeIcons[entity.type] && '📦' : stryMutAct_9fa48("36017") ? false : stryMutAct_9fa48("36016") ? true : (stryCov_9fa48("36016", "36017", "36018"), nodeIcons[entity.type] || '📦')}
          </div>
          <div>
            <h3 className="font-semibold text-white">{entity.name}</h3>
            <p className="text-sm text-neutral-400 capitalize">{entity.type}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-md text-neutral-500 hover:text-white hover:bg-neutral-700">
          ✕
        </button>
      </div>

      <div className="space-y-3 mb-4">
        {stryMutAct_9fa48("36022") ? entity.owner || <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Owner</span>
            <span className="text-white">{entity.owner}</span>
          </div> : stryMutAct_9fa48("36021") ? false : stryMutAct_9fa48("36020") ? true : (stryCov_9fa48("36020", "36021", "36022"), entity.owner && <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Owner</span>
            <span className="text-white">{entity.owner}</span>
          </div>)}
        {stryMutAct_9fa48("36025") ? entity.lastUpdated || <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Last Updated</span>
            <span className="text-white">{entity.lastUpdated}</span>
          </div> : stryMutAct_9fa48("36024") ? false : stryMutAct_9fa48("36023") ? true : (stryCov_9fa48("36023", "36024", "36025"), entity.lastUpdated && <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Last Updated</span>
            <span className="text-white">{entity.lastUpdated}</span>
          </div>)}
        {stryMutAct_9fa48("36028") ? entity.connections || <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Connections</span>
            <span className="text-white">
              {entity.connections.incoming} in, {entity.connections.outgoing} out
            </span>
          </div> : stryMutAct_9fa48("36027") ? false : stryMutAct_9fa48("36026") ? true : (stryCov_9fa48("36026", "36027", "36028"), entity.connections && <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Connections</span>
            <span className="text-white">
              {entity.connections.incoming} in, {entity.connections.outgoing} out
            </span>
          </div>)}
      </div>

      <div className="space-y-2">
        {/* Ask Council - Primary CTA */}
        <button onClick={onAskCouncil} className="w-full px-3 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-lg hover:from-primary-500 hover:to-primary-400 transition-all flex items-center justify-center gap-2">
          🧠 Ask the Council about this entity
        </button>
        <div className="flex gap-2">
          <button onClick={onViewLineage} className="flex-1 px-3 py-2 text-sm font-medium text-primary-400 bg-primary-900/30 border border-primary-700 rounded-lg hover:bg-primary-900/50 transition-colors">
            View Lineage
          </button>
          <button onClick={onViewImpact} className="flex-1 px-3 py-2 text-sm font-medium text-neutral-300 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition-colors">
            Impact Analysis
          </button>
        </div>
      </div>
    </div>;
};

// =============================================================================
// MINI MAP COMPONENT
// =============================================================================

const MiniMap: React.FC<{
  nodes: GraphNode[];
}> = ({
  nodes
}) => {
  if (stryMutAct_9fa48("36032") ? nodes.length !== 0 : stryMutAct_9fa48("36031") ? false : stryMutAct_9fa48("36030") ? true : (stryCov_9fa48("36030", "36031", "36032"), nodes.length === 0)) {
    return null;
  }
  return <div className="absolute bottom-4 right-4 w-32 h-24 bg-neutral-800/90 rounded-lg border border-neutral-700 p-2 z-10">
      <div className="relative w-full h-full">
        {stryMutAct_9fa48("36034") ? nodes.map((node, i) => {
        const x = i % 5 * 20 + 10;
        const y = Math.floor(i / 5) * 15 + 5;
        const colors = nodeColors[node.type] || nodeColors.entity;
        return <div key={node.id} className="absolute w-2 h-2 rounded-full" style={{
          left: `${x}%`,
          top: `${y}%`,
          backgroundColor: colors.border
        }} />;
      }) : (stryCov_9fa48("36034"), nodes.slice(0, 20).map((node, i) => {
        const x = stryMutAct_9fa48("36036") ? i % 5 * 20 - 10 : (stryCov_9fa48("36036"), (stryMutAct_9fa48("36037") ? i % 5 / 20 : (stryCov_9fa48("36037"), (stryMutAct_9fa48("36038") ? i * 5 : (stryCov_9fa48("36038"), i % 5)) * 20)) + 10);
        const y = stryMutAct_9fa48("36039") ? Math.floor(i / 5) * 15 - 5 : (stryCov_9fa48("36039"), (stryMutAct_9fa48("36040") ? Math.floor(i / 5) / 15 : (stryCov_9fa48("36040"), Math.floor(stryMutAct_9fa48("36041") ? i * 5 : (stryCov_9fa48("36041"), i / 5)) * 15)) + 5);
        const colors = stryMutAct_9fa48("36044") ? nodeColors[node.type] && nodeColors.entity : stryMutAct_9fa48("36043") ? false : stryMutAct_9fa48("36042") ? true : (stryCov_9fa48("36042", "36043", "36044"), nodeColors[node.type] || nodeColors.entity);
        return <div key={node.id} className="absolute w-2 h-2 rounded-full" style={stryMutAct_9fa48("36045") ? {} : (stryCov_9fa48("36045"), {
          left: `${x}%`,
          top: `${y}%`,
          backgroundColor: colors.border
        })} />;
      }))}
        {/* Viewport indicator */}
        <div className="absolute inset-2 border border-white/30 rounded" />
      </div>
    </div>;
};

// =============================================================================
// FILTER CHIPS COMPONENT
// =============================================================================

const FilterChips: React.FC<{
  types: string[];
  activeTypes: string[];
  onToggle: (type: string) => void;
}> = stryMutAct_9fa48("36048") ? () => undefined : (stryCov_9fa48("36048"), (() => {
  const FilterChips: React.FC<{
    types: string[];
    activeTypes: string[];
    onToggle: (type: string) => void;
  }> = ({
    types,
    activeTypes,
    onToggle
  }) => <div className="flex flex-wrap gap-2">
    {types.map(type => {
      const colors = stryMutAct_9fa48("36052") ? nodeColors[type] && nodeColors.entity : stryMutAct_9fa48("36051") ? false : stryMutAct_9fa48("36050") ? true : (stryCov_9fa48("36050", "36051", "36052"), nodeColors[type] || nodeColors.entity);
      const isActive = stryMutAct_9fa48("36055") ? activeTypes.includes(type) && activeTypes.length === 0 : stryMutAct_9fa48("36054") ? false : stryMutAct_9fa48("36053") ? true : (stryCov_9fa48("36053", "36054", "36055"), activeTypes.includes(type) || (stryMutAct_9fa48("36057") ? activeTypes.length !== 0 : stryMutAct_9fa48("36056") ? false : (stryCov_9fa48("36056", "36057"), activeTypes.length === 0)));
      return <button key={type} onClick={stryMutAct_9fa48("36058") ? () => undefined : (stryCov_9fa48("36058"), () => onToggle(type))} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border', isActive ? 'bg-opacity-100 text-white' : 'bg-opacity-20 text-neutral-500 border-transparent')} style={stryMutAct_9fa48("36062") ? {} : (stryCov_9fa48("36062"), {
        backgroundColor: isActive ? colors.bg : 'transparent',
        borderColor: isActive ? colors.border : 'transparent'
      })}>
          <span>{nodeIcons[type]}</span>
          <span className="capitalize">{type}</span>
        </button>;
    })}
  </div>;
  return FilterChips;
})());

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const GraphExplorerPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    t
  } = useLanguage();

  // State
  const [nodes, setNodes] = useState<GraphNode[]>(stryMutAct_9fa48("36066") ? ["Stryker was here"] : (stryCov_9fa48("36066"), []));
  const [edges, setEdges] = useState<GraphEdge[]>(stryMutAct_9fa48("36067") ? ["Stryker was here"] : (stryCov_9fa48("36067"), []));
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>(stryMutAct_9fa48("36069") ? ["Stryker was here"] : (stryCov_9fa48("36069"), []));
  const [showSuggestions, setShowSuggestions] = useState(stryMutAct_9fa48("36070") ? true : (stryCov_9fa48("36070"), false));
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("36071") ? false : (stryCov_9fa48("36071"), true));
  const [error, setError] = useState<string | null>(null);

  // Search suggestions
  const suggestions = useMemo<SearchSuggestion[]>(() => {
    if (stryMutAct_9fa48("36075") ? !searchQuery && searchQuery.length < 2 : stryMutAct_9fa48("36074") ? false : stryMutAct_9fa48("36073") ? true : (stryCov_9fa48("36073", "36074", "36075"), (stryMutAct_9fa48("36076") ? searchQuery : (stryCov_9fa48("36076"), !searchQuery)) || (stryMutAct_9fa48("36079") ? searchQuery.length >= 2 : stryMutAct_9fa48("36078") ? searchQuery.length <= 2 : stryMutAct_9fa48("36077") ? false : (stryCov_9fa48("36077", "36078", "36079"), searchQuery.length < 2)))) {
      return stryMutAct_9fa48("36081") ? ["Stryker was here"] : (stryCov_9fa48("36081"), []);
    }
    return stryMutAct_9fa48("36083") ? nodes.slice(0, 5).map(n => ({
      id: n.id,
      name: (n.name ?? n.id ?? 'Unnamed') as string,
      type: n.type
    })) : stryMutAct_9fa48("36082") ? nodes.filter(n => {
      const name = (n.name ?? '').toString();
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    }).map(n => ({
      id: n.id,
      name: (n.name ?? n.id ?? 'Unnamed') as string,
      type: n.type
    })) : (stryCov_9fa48("36082", "36083"), nodes.filter(n => {
      const name = (stryMutAct_9fa48("36085") ? n.name && '' : (stryCov_9fa48("36085"), n.name ?? '')).toString();
      return stryMutAct_9fa48("36087") ? name.toUpperCase().includes(searchQuery.toLowerCase()) : (stryCov_9fa48("36087"), name.toLowerCase().includes(stryMutAct_9fa48("36088") ? searchQuery.toUpperCase() : (stryCov_9fa48("36088"), searchQuery.toLowerCase())));
    }).slice(0, 5).map(stryMutAct_9fa48("36089") ? () => undefined : (stryCov_9fa48("36089"), n => stryMutAct_9fa48("36090") ? {} : (stryCov_9fa48("36090"), {
      id: n.id,
      name: (n.name ?? n.id ?? 'Unnamed') as string,
      type: n.type
    }))));
  }, stryMutAct_9fa48("36091") ? [] : (stryCov_9fa48("36091"), [searchQuery, nodes]));

  // Toggle filter
  const toggleFilter = useCallback((type: string) => {
    setActiveFilters(stryMutAct_9fa48("36093") ? () => undefined : (stryCov_9fa48("36093"), prev => prev.includes(type) ? stryMutAct_9fa48("36094") ? prev : (stryCov_9fa48("36094"), prev.filter(stryMutAct_9fa48("36095") ? () => undefined : (stryCov_9fa48("36095"), t => stryMutAct_9fa48("36098") ? t === type : stryMutAct_9fa48("36097") ? false : stryMutAct_9fa48("36096") ? true : (stryCov_9fa48("36096", "36097", "36098"), t !== type)))) : stryMutAct_9fa48("36099") ? [] : (stryCov_9fa48("36099"), [...prev, type])));
  }, stryMutAct_9fa48("36100") ? ["Stryker was here"] : (stryCov_9fa48("36100"), []));

  // Load graph data from API
  useEffect(() => {
    const loadGraph = async () => {
      try {
        setIsLoading(stryMutAct_9fa48("36104") ? false : (stryCov_9fa48("36104"), true));
        setError(null);
        const entityId = searchParams.get('entity');
        if (stryMutAct_9fa48("36107") ? false : stryMutAct_9fa48("36106") ? true : (stryCov_9fa48("36106", "36107"), entityId)) {
          // Load lineage for specific entity
          const lineageRes = await lineageApi.getLineage(entityId, stryMutAct_9fa48("36109") ? {} : (stryCov_9fa48("36109"), {
            direction: 'both',
            depth: 3
          }));
          if (stryMutAct_9fa48("36113") ? lineageRes.success || lineageRes.data : stryMutAct_9fa48("36112") ? false : stryMutAct_9fa48("36111") ? true : (stryCov_9fa48("36111", "36112", "36113"), lineageRes.success && lineageRes.data)) {
            const data = lineageRes.data as any;
            const lineageNodes: GraphNode[] = (stryMutAct_9fa48("36117") ? (data.entities || data.nodes) && [] : stryMutAct_9fa48("36116") ? false : stryMutAct_9fa48("36115") ? true : (stryCov_9fa48("36115", "36116", "36117"), (stryMutAct_9fa48("36119") ? data.entities && data.nodes : stryMutAct_9fa48("36118") ? false : (stryCov_9fa48("36118", "36119"), data.entities || data.nodes)) || (stryMutAct_9fa48("36120") ? ["Stryker was here"] : (stryCov_9fa48("36120"), [])))).map(stryMutAct_9fa48("36121") ? () => undefined : (stryCov_9fa48("36121"), (e: any) => stryMutAct_9fa48("36122") ? {} : (stryCov_9fa48("36122"), {
              id: e.id,
              type: stryMutAct_9fa48("36125") ? e.type && 'entity' : stryMutAct_9fa48("36124") ? false : stryMutAct_9fa48("36123") ? true : (stryCov_9fa48("36123", "36124", "36125"), e.type || 'entity'),
              name: stryMutAct_9fa48("36129") ? (e.name || e.label) && e.id : stryMutAct_9fa48("36128") ? false : stryMutAct_9fa48("36127") ? true : (stryCov_9fa48("36127", "36128", "36129"), (stryMutAct_9fa48("36131") ? e.name && e.label : stryMutAct_9fa48("36130") ? false : (stryCov_9fa48("36130", "36131"), e.name || e.label)) || e.id),
              properties: stryMutAct_9fa48("36134") ? e.properties && {} : stryMutAct_9fa48("36133") ? false : stryMutAct_9fa48("36132") ? true : (stryCov_9fa48("36132", "36133", "36134"), e.properties || {})
            })));
            const lineageEdges: GraphEdge[] = (stryMutAct_9fa48("36137") ? (data.relationships || data.edges) && [] : stryMutAct_9fa48("36136") ? false : stryMutAct_9fa48("36135") ? true : (stryCov_9fa48("36135", "36136", "36137"), (stryMutAct_9fa48("36139") ? data.relationships && data.edges : stryMutAct_9fa48("36138") ? false : (stryCov_9fa48("36138", "36139"), data.relationships || data.edges)) || (stryMutAct_9fa48("36140") ? ["Stryker was here"] : (stryCov_9fa48("36140"), [])))).map(stryMutAct_9fa48("36141") ? () => undefined : (stryCov_9fa48("36141"), (r: any, idx: number) => stryMutAct_9fa48("36142") ? {} : (stryCov_9fa48("36142"), {
              id: stryMutAct_9fa48("36145") ? r.id && `edge-${idx}` : stryMutAct_9fa48("36144") ? false : stryMutAct_9fa48("36143") ? true : (stryCov_9fa48("36143", "36144", "36145"), r.id || `edge-${idx}`),
              source: stryMutAct_9fa48("36149") ? r.sourceId && r.source : stryMutAct_9fa48("36148") ? false : stryMutAct_9fa48("36147") ? true : (stryCov_9fa48("36147", "36148", "36149"), r.sourceId || r.source),
              target: stryMutAct_9fa48("36152") ? r.targetId && r.target : stryMutAct_9fa48("36151") ? false : stryMutAct_9fa48("36150") ? true : (stryCov_9fa48("36150", "36151", "36152"), r.targetId || r.target),
              type: stryMutAct_9fa48("36155") ? r.type && 'related' : stryMutAct_9fa48("36154") ? false : stryMutAct_9fa48("36153") ? true : (stryCov_9fa48("36153", "36154", "36155"), r.type || 'related'),
              label: stryMutAct_9fa48("36159") ? r.label && r.type : stryMutAct_9fa48("36158") ? false : stryMutAct_9fa48("36157") ? true : (stryCov_9fa48("36157", "36158", "36159"), r.label || r.type)
            })));
            setNodes(lineageNodes);
            setEdges(lineageEdges);
          }
        } else {
          // Load full graph (nodes + relationships)
          const graphRes = await graphApi.getEntities(stryMutAct_9fa48("36161") ? {} : (stryCov_9fa48("36161"), {
            pageSize: 100
          }));
          if (stryMutAct_9fa48("36164") ? graphRes.success || graphRes.data : stryMutAct_9fa48("36163") ? false : stryMutAct_9fa48("36162") ? true : (stryCov_9fa48("36162", "36163", "36164"), graphRes.success && graphRes.data)) {
            const entities = graphRes.data as GraphEntity[];
            const graphNodes: GraphNode[] = entities.map(stryMutAct_9fa48("36166") ? () => undefined : (stryCov_9fa48("36166"), e => stryMutAct_9fa48("36167") ? {} : (stryCov_9fa48("36167"), {
              id: e.id,
              type: e.type,
              name: e.name,
              properties: e.properties
            })));
            setNodes(graphNodes);

            // Fetch relationships between the loaded nodes using the generic graph query API
            try {
              const relQuery = `
                MATCH (source {organizationId: $_orgId})-[r]->(target {organizationId: $_orgId})
                WHERE source.id IN $nodeIds AND target.id IN $nodeIds
                RETURN source.id AS sourceId, target.id AS targetId, type(r) AS relType, r AS properties
              `;
              const relRes = await graphApi.executeQuery(relQuery, stryMutAct_9fa48("36170") ? {} : (stryCov_9fa48("36170"), {
                nodeIds: graphNodes.map(stryMutAct_9fa48("36171") ? () => undefined : (stryCov_9fa48("36171"), n => n.id))
              }));
              if (stryMutAct_9fa48("36174") ? relRes.success || Array.isArray(relRes.data) : stryMutAct_9fa48("36173") ? false : stryMutAct_9fa48("36172") ? true : (stryCov_9fa48("36172", "36173", "36174"), relRes.success && Array.isArray(relRes.data))) {
                const graphEdges: GraphEdge[] = stryMutAct_9fa48("36176") ? (relRes.data as any[]).map((row: any) => ({
                  source: String(row.sourceId ?? row.source ?? ''),
                  target: String(row.targetId ?? row.target ?? ''),
                  type: String(row.relType ?? row.type ?? 'related'),
                  properties: row.properties || {}
                })) : (stryCov_9fa48("36176"), (relRes.data as any[]).map(stryMutAct_9fa48("36177") ? () => undefined : (stryCov_9fa48("36177"), (row: any) => stryMutAct_9fa48("36178") ? {} : (stryCov_9fa48("36178"), {
                  source: String(stryMutAct_9fa48("36179") ? (row.sourceId ?? row.source) && '' : (stryCov_9fa48("36179"), (stryMutAct_9fa48("36180") ? row.sourceId && row.source : (stryCov_9fa48("36180"), row.sourceId ?? row.source)) ?? '')),
                  target: String(stryMutAct_9fa48("36182") ? (row.targetId ?? row.target) && '' : (stryCov_9fa48("36182"), (stryMutAct_9fa48("36183") ? row.targetId && row.target : (stryCov_9fa48("36183"), row.targetId ?? row.target)) ?? '')),
                  type: String(stryMutAct_9fa48("36185") ? (row.relType ?? row.type) && 'related' : (stryCov_9fa48("36185"), (stryMutAct_9fa48("36186") ? row.relType && row.type : (stryCov_9fa48("36186"), row.relType ?? row.type)) ?? 'related')),
                  properties: stryMutAct_9fa48("36190") ? row.properties && {} : stryMutAct_9fa48("36189") ? false : stryMutAct_9fa48("36188") ? true : (stryCov_9fa48("36188", "36189", "36190"), row.properties || {})
                }))).filter(stryMutAct_9fa48("36191") ? () => undefined : (stryCov_9fa48("36191"), e => stryMutAct_9fa48("36194") ? e.source || e.target : stryMutAct_9fa48("36193") ? false : stryMutAct_9fa48("36192") ? true : (stryCov_9fa48("36192", "36193", "36194"), e.source && e.target))));
                setEdges(graphEdges);
              } else {
                setEdges(stryMutAct_9fa48("36196") ? ["Stryker was here"] : (stryCov_9fa48("36196"), []));
              }
            } catch (relErr) {
              console.error('Graph relationships load error:', relErr);
              setEdges(stryMutAct_9fa48("36199") ? ["Stryker was here"] : (stryCov_9fa48("36199"), []));
            }
          }
        }
      } catch (err) {
        setError('Failed to load graph data');
        console.error('Graph load error:', err);
      } finally {
        setIsLoading(stryMutAct_9fa48("36204") ? true : (stryCov_9fa48("36204"), false));
      }
    };
    loadGraph();
  }, stryMutAct_9fa48("36205") ? [] : (stryCov_9fa48("36205"), [searchParams]));

  // Handle node selection from GraphCanvas
  const handleNodeSelect = useCallback((node: GraphNode | null) => {
    if (stryMutAct_9fa48("36208") ? false : stryMutAct_9fa48("36207") ? true : (stryCov_9fa48("36207", "36208"), node)) {
      setSelectedEntity(stryMutAct_9fa48("36210") ? {} : (stryCov_9fa48("36210"), {
        id: node.id,
        type: node.type,
        name: node.name,
        properties: node.properties,
        owner: 'Data Team',
        lastUpdated: 'Recently',
        connections: stryMutAct_9fa48("36213") ? {} : (stryCov_9fa48("36213"), {
          incoming: 5,
          outgoing: 3
        })
      }));
    } else {
      setSelectedEntity(null);
    }
  }, stryMutAct_9fa48("36215") ? ["Stryker was here"] : (stryCov_9fa48("36215"), []));

  // Handle node double-click (drill down)
  const handleNodeDoubleClick = useCallback((node: GraphNode) => {
    navigate(`/cortex/graph?entity=${node.id}`);
  }, stryMutAct_9fa48("36218") ? [] : (stryCov_9fa48("36218"), [navigate]));

  // View lineage for selected entity
  const handleViewLineage = useCallback(() => {
    if (stryMutAct_9fa48("36221") ? false : stryMutAct_9fa48("36220") ? true : (stryCov_9fa48("36220", "36221"), selectedEntity)) {
      navigate(`/cortex/graph?entity=${selectedEntity.id}`);
    }
  }, stryMutAct_9fa48("36224") ? [] : (stryCov_9fa48("36224"), [selectedEntity, navigate]));

  // View impact analysis
  const handleViewImpact = useCallback(async () => {
    if (stryMutAct_9fa48("36227") ? false : stryMutAct_9fa48("36226") ? true : (stryCov_9fa48("36226", "36227"), selectedEntity)) {
      const impactRes = await lineageApi.getImpact(selectedEntity.id);
      if (stryMutAct_9fa48("36230") ? false : stryMutAct_9fa48("36229") ? true : (stryCov_9fa48("36229", "36230"), impactRes.success)) {
        console.log('Impact analysis:', impactRes.data);
        // Could open a modal or navigate to impact view
      }
    }
  }, stryMutAct_9fa48("36233") ? [] : (stryCov_9fa48("36233"), [selectedEntity]));

  // Filter nodes
  const filteredNodes = stryMutAct_9fa48("36234") ? nodes : (stryCov_9fa48("36234"), nodes.filter(node => {
    const name = (stryMutAct_9fa48("36236") ? node.name && '' : (stryCov_9fa48("36236"), node.name ?? '')).toString();
    const matchesSearch = stryMutAct_9fa48("36238") ? name.toUpperCase().includes(searchQuery.toLowerCase()) : (stryCov_9fa48("36238"), name.toLowerCase().includes(stryMutAct_9fa48("36239") ? searchQuery.toUpperCase() : (stryCov_9fa48("36239"), searchQuery.toLowerCase())));
    const matchesType = stryMutAct_9fa48("36242") ? activeFilters.length === 0 && activeFilters.includes(node.type) : stryMutAct_9fa48("36241") ? false : stryMutAct_9fa48("36240") ? true : (stryCov_9fa48("36240", "36241", "36242"), (stryMutAct_9fa48("36244") ? activeFilters.length !== 0 : stryMutAct_9fa48("36243") ? false : (stryCov_9fa48("36243", "36244"), activeFilters.length === 0)) || activeFilters.includes(node.type));
    return stryMutAct_9fa48("36247") ? matchesSearch || matchesType : stryMutAct_9fa48("36246") ? false : stryMutAct_9fa48("36245") ? true : (stryCov_9fa48("36245", "36246", "36247"), matchesSearch && matchesType);
  }));
  const filteredEdges = stryMutAct_9fa48("36248") ? edges : (stryCov_9fa48("36248"), edges.filter(edge => {
    const sourceVisible = stryMutAct_9fa48("36250") ? filteredNodes.every(n => n.id === edge.source) : (stryCov_9fa48("36250"), filteredNodes.some(stryMutAct_9fa48("36251") ? () => undefined : (stryCov_9fa48("36251"), n => stryMutAct_9fa48("36254") ? n.id !== edge.source : stryMutAct_9fa48("36253") ? false : stryMutAct_9fa48("36252") ? true : (stryCov_9fa48("36252", "36253", "36254"), n.id === edge.source))));
    const targetVisible = stryMutAct_9fa48("36255") ? filteredNodes.every(n => n.id === edge.target) : (stryCov_9fa48("36255"), filteredNodes.some(stryMutAct_9fa48("36256") ? () => undefined : (stryCov_9fa48("36256"), n => stryMutAct_9fa48("36259") ? n.id !== edge.target : stryMutAct_9fa48("36258") ? false : stryMutAct_9fa48("36257") ? true : (stryCov_9fa48("36257", "36258", "36259"), n.id === edge.target))));
    return stryMutAct_9fa48("36262") ? sourceVisible || targetVisible : stryMutAct_9fa48("36261") ? false : stryMutAct_9fa48("36260") ? true : (stryCov_9fa48("36260", "36261", "36262"), sourceVisible && targetVisible);
  }));

  // Graph data for canvas
  const graphData: GraphData = stryMutAct_9fa48("36263") ? {} : (stryCov_9fa48("36263"), {
    nodes: filteredNodes,
    edges: filteredEdges
  });

  // Get unique types for filter
  const nodeTypes = stryMutAct_9fa48("36264") ? [] : (stryCov_9fa48("36264"), [...new Set(nodes.map(stryMutAct_9fa48("36265") ? () => undefined : (stryCov_9fa48("36265"), n => n.type)))]);
  return <div className="h-full flex flex-col bg-neutral-900">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-neutral-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Graph Explorer</h1>
            <p className="text-sm text-neutral-400">
              Explore entities and their relationships
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-500">
              {filteredNodes.length} entities • {filteredEdges.length} relationships
            </span>
          </div>
        </div>

        {/* Search with Suggestions */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 max-w-md relative">
            <input type="text" value={searchQuery} onChange={e => {
            setSearchQuery(e.target.value);
            setShowSuggestions(stryMutAct_9fa48("36267") ? false : (stryCov_9fa48("36267"), true));
          }} onFocus={stryMutAct_9fa48("36268") ? () => undefined : (stryCov_9fa48("36268"), () => setShowSuggestions(stryMutAct_9fa48("36269") ? false : (stryCov_9fa48("36269"), true)))} onBlur={stryMutAct_9fa48("36270") ? () => undefined : (stryCov_9fa48("36270"), () => setTimeout(stryMutAct_9fa48("36271") ? () => undefined : (stryCov_9fa48("36271"), () => setShowSuggestions(stryMutAct_9fa48("36272") ? true : (stryCov_9fa48("36272"), false))), 200))} placeholder="Search entities..." className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            {/* Search Suggestions Dropdown */}
            {stryMutAct_9fa48("36275") ? showSuggestions && suggestions.length > 0 || <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl z-20 overflow-hidden">
                {suggestions.map(s => <button key={s.id} onClick={() => {
              setSearchQuery(s.name);
              setShowSuggestions(false);
            }} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-neutral-700 transition-colors text-left">
                    <span>{nodeIcons[s.type] || '📦'}</span>
                    <div>
                      <p className="text-sm text-white">{s.name}</p>
                      <p className="text-xs text-neutral-500 capitalize">{s.type}</p>
                    </div>
                  </button>)}
              </div> : stryMutAct_9fa48("36274") ? false : stryMutAct_9fa48("36273") ? true : (stryCov_9fa48("36273", "36274", "36275"), (stryMutAct_9fa48("36277") ? showSuggestions || suggestions.length > 0 : stryMutAct_9fa48("36276") ? true : (stryCov_9fa48("36276", "36277"), showSuggestions && (stryMutAct_9fa48("36280") ? suggestions.length <= 0 : stryMutAct_9fa48("36279") ? suggestions.length >= 0 : stryMutAct_9fa48("36278") ? true : (stryCov_9fa48("36278", "36279", "36280"), suggestions.length > 0)))) && <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl z-20 overflow-hidden">
                {suggestions.map(stryMutAct_9fa48("36281") ? () => undefined : (stryCov_9fa48("36281"), s => <button key={s.id} onClick={() => {
              setSearchQuery(s.name);
              setShowSuggestions(stryMutAct_9fa48("36283") ? true : (stryCov_9fa48("36283"), false));
            }} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-neutral-700 transition-colors text-left">
                    <span>{stryMutAct_9fa48("36286") ? nodeIcons[s.type] && '📦' : stryMutAct_9fa48("36285") ? false : stryMutAct_9fa48("36284") ? true : (stryCov_9fa48("36284", "36285", "36286"), nodeIcons[s.type] || '📦')}</span>
                    <div>
                      <p className="text-sm text-white">{s.name}</p>
                      <p className="text-xs text-neutral-500 capitalize">{s.type}</p>
                    </div>
                  </button>))}
              </div>)}
          </div>
        </div>

        {/* Filter Chips */}
        <FilterChips types={nodeTypes} activeTypes={activeFilters} onToggle={toggleFilter} />
      </div>

      {/* Graph Canvas */}
      <div className="flex-1 relative bg-neutral-950">
        {isLoading ? <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-neutral-400">Loading graph...</p>
            </div>
          </div> : error ? <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-400 mb-2">⚠️ {error}</p>
              <button onClick={stryMutAct_9fa48("36288") ? () => undefined : (stryCov_9fa48("36288"), () => window.location.reload())} className="text-primary-400 hover:underline">
                Retry
              </button>
            </div>
          </div> : (stryMutAct_9fa48("36291") ? nodes.length !== 0 : stryMutAct_9fa48("36290") ? false : stryMutAct_9fa48("36289") ? true : (stryCov_9fa48("36289", "36290", "36291"), nodes.length === 0)) ? <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl mb-2">🔍</p>
              <p className="text-neutral-400">No entities found</p>
              <p className="text-sm text-neutral-500">Try adjusting your search or filters</p>
            </div>
          </div> : <GraphCanvas data={graphData} onNodeSelect={handleNodeSelect} onNodeDoubleClick={handleNodeDoubleClick} className="w-full h-full" />}

        {/* Entity Details Panel */}
        <EntityDetailsPanel entity={selectedEntity} onClose={stryMutAct_9fa48("36292") ? () => undefined : (stryCov_9fa48("36292"), () => setSelectedEntity(null))} onViewLineage={handleViewLineage} onViewImpact={handleViewImpact} onAskCouncil={() => {
        if (stryMutAct_9fa48("36295") ? false : stryMutAct_9fa48("36294") ? true : (stryCov_9fa48("36294", "36295"), selectedEntity)) {
          navigate(`/cortex/council?q=Tell me about the ${selectedEntity.type} "${selectedEntity.name}" - its purpose, data quality, dependencies, and any risks or concerns.`);
        }
      }} />

        {/* Legend - Node Types */}
        <div className="absolute top-4 right-4 bg-neutral-800/90 rounded-lg border border-neutral-700 p-3 z-10">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">Node Types</p>
          <div className="space-y-1.5 mb-3">
            {Object.entries(nodeColors).map(stryMutAct_9fa48("36298") ? () => undefined : (stryCov_9fa48("36298"), ([type, colors]) => <div key={type} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded border" style={stryMutAct_9fa48("36299") ? {} : (stryCov_9fa48("36299"), {
              backgroundColor: colors.bg,
              borderColor: colors.border
            })} />
                <span className="capitalize text-neutral-300">{type}</span>
              </div>))}
          </div>
          <div className="border-t border-neutral-700 pt-2 mt-2">
            <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">Edge Types</p>
            <div className="space-y-1.5">
              {Object.entries(edgeTypes).map(stryMutAct_9fa48("36300") ? () => undefined : (stryCov_9fa48("36300"), ([type, config]) => <div key={type} className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-0.5 rounded" style={stryMutAct_9fa48("36301") ? {} : (stryCov_9fa48("36301"), {
                backgroundColor: config.color
              })} />
                  <span className="text-neutral-300">{config.label}</span>
                </div>))}
            </div>
          </div>
        </div>

        {/* Mini Map */}
        <MiniMap nodes={filteredNodes} />
      </div>
    </div>;
};
export default GraphExplorerPage;