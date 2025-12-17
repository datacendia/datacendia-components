/**
 * Workflow Builder Component
 * Visual drag-and-drop workflow editor
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
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '../../../lib/utils';
import { workflowsApi } from '../../lib/api';
import type { Workflow, WorkflowNode as ApiWorkflowNode, WorkflowEdge as ApiWorkflowEdge } from '../../lib/api/types';

// =============================================================================
// TYPES
// =============================================================================

interface Position {
  x: number;
  y: number;
}
interface WorkflowNode {
  id: string;
  type: 'trigger' | 'query' | 'transform' | 'condition' | 'action' | 'approval' | 'notification';
  label: string;
  config: Record<string, unknown>;
  position: Position;
}
interface WorkflowEdge {
  id: string;
  from: string;
  to: string;
  condition?: string;
  label?: string;
}
interface WorkflowBuilderProps {
  workflowId?: string;
  initialNodes?: WorkflowNode[];
  initialEdges?: WorkflowEdge[];
  onSave?: (nodes: WorkflowNode[], edges: WorkflowEdge[]) => void;
  onChange?: (nodes: WorkflowNode[], edges: WorkflowEdge[]) => void;
}

// =============================================================================
// NODE TYPES CATALOG
// =============================================================================

const nodeTypes = stryMutAct_9fa48("6801") ? {} : (stryCov_9fa48("6801"), {
  triggers: stryMutAct_9fa48("6802") ? [] : (stryCov_9fa48("6802"), [stryMutAct_9fa48("6803") ? {} : (stryCov_9fa48("6803"), {
    type: 'trigger',
    subtype: 'schedule',
    label: 'Schedule',
    icon: '⏰',
    description: 'Run on a schedule'
  }), stryMutAct_9fa48("6809") ? {} : (stryCov_9fa48("6809"), {
    type: 'trigger',
    subtype: 'event',
    label: 'Event',
    icon: '📨',
    description: 'Triggered by an event'
  }), stryMutAct_9fa48("6815") ? {} : (stryCov_9fa48("6815"), {
    type: 'trigger',
    subtype: 'webhook',
    label: 'Webhook',
    icon: '🔗',
    description: 'External webhook trigger'
  }), stryMutAct_9fa48("6821") ? {} : (stryCov_9fa48("6821"), {
    type: 'trigger',
    subtype: 'manual',
    label: 'Manual',
    icon: '👤',
    description: 'Manual execution'
  })]),
  actions: stryMutAct_9fa48("6827") ? [] : (stryCov_9fa48("6827"), [stryMutAct_9fa48("6828") ? {} : (stryCov_9fa48("6828"), {
    type: 'query',
    subtype: 'query',
    label: 'Query Data',
    icon: '📊',
    description: 'Query from data source'
  }), stryMutAct_9fa48("6834") ? {} : (stryCov_9fa48("6834"), {
    type: 'transform',
    subtype: 'transform',
    label: 'Transform',
    icon: '🔄',
    description: 'Transform data'
  }), stryMutAct_9fa48("6840") ? {} : (stryCov_9fa48("6840"), {
    type: 'action',
    subtype: 'create',
    label: 'Create Record',
    icon: '📝',
    description: 'Create a new record'
  }), stryMutAct_9fa48("6846") ? {} : (stryCov_9fa48("6846"), {
    type: 'action',
    subtype: 'update',
    label: 'Update Record',
    icon: '✏️',
    description: 'Update existing record'
  }), stryMutAct_9fa48("6852") ? {} : (stryCov_9fa48("6852"), {
    type: 'action',
    subtype: 'api',
    label: 'API Call',
    icon: '🔌',
    description: 'Call external API'
  })]),
  logic: stryMutAct_9fa48("6858") ? [] : (stryCov_9fa48("6858"), [stryMutAct_9fa48("6859") ? {} : (stryCov_9fa48("6859"), {
    type: 'condition',
    subtype: 'if',
    label: 'If/Else',
    icon: '◇',
    description: 'Conditional branching'
  }), stryMutAct_9fa48("6865") ? {} : (stryCov_9fa48("6865"), {
    type: 'condition',
    subtype: 'loop',
    label: 'Loop',
    icon: '⟳',
    description: 'Iterate over items'
  }), stryMutAct_9fa48("6871") ? {} : (stryCov_9fa48("6871"), {
    type: 'approval',
    subtype: 'approval',
    label: 'Approval',
    icon: '✓',
    description: 'Request approval'
  }), stryMutAct_9fa48("6877") ? {} : (stryCov_9fa48("6877"), {
    type: 'condition',
    subtype: 'wait',
    label: 'Wait',
    icon: '⏸',
    description: 'Wait for duration/condition'
  })]),
  notifications: stryMutAct_9fa48("6883") ? [] : (stryCov_9fa48("6883"), [stryMutAct_9fa48("6884") ? {} : (stryCov_9fa48("6884"), {
    type: 'notification',
    subtype: 'email',
    label: 'Email',
    icon: '📧',
    description: 'Send email'
  }), stryMutAct_9fa48("6890") ? {} : (stryCov_9fa48("6890"), {
    type: 'notification',
    subtype: 'slack',
    label: 'Slack',
    icon: '💬',
    description: 'Send Slack message'
  }), stryMutAct_9fa48("6896") ? {} : (stryCov_9fa48("6896"), {
    type: 'notification',
    subtype: 'alert',
    label: 'Alert',
    icon: '🔔',
    description: 'Create alert'
  })])
});

// Node colors
const nodeColors: Record<string, {
  bg: string;
  border: string;
}> = stryMutAct_9fa48("6902") ? {} : (stryCov_9fa48("6902"), {
  trigger: stryMutAct_9fa48("6903") ? {} : (stryCov_9fa48("6903"), {
    bg: '#DBEAFE',
    border: '#3B82F6'
  }),
  query: stryMutAct_9fa48("6906") ? {} : (stryCov_9fa48("6906"), {
    bg: '#D1FAE5',
    border: '#10B981'
  }),
  transform: stryMutAct_9fa48("6909") ? {} : (stryCov_9fa48("6909"), {
    bg: '#FEF3C7',
    border: '#F59E0B'
  }),
  condition: stryMutAct_9fa48("6912") ? {} : (stryCov_9fa48("6912"), {
    bg: '#EDE9FE',
    border: '#8B5CF6'
  }),
  action: stryMutAct_9fa48("6915") ? {} : (stryCov_9fa48("6915"), {
    bg: '#FCE7F3',
    border: '#EC4899'
  }),
  approval: stryMutAct_9fa48("6918") ? {} : (stryCov_9fa48("6918"), {
    bg: '#CFFAFE',
    border: '#06B6D4'
  }),
  notification: stryMutAct_9fa48("6921") ? {} : (stryCov_9fa48("6921"), {
    bg: '#FFEDD5',
    border: '#F97316'
  })
});

// =============================================================================
// NODE COMPONENT
// =============================================================================

interface NodeComponentProps {
  node: WorkflowNode;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart: (e: React.MouseEvent) => void;
  onDelete: () => void;
  onConfigure: () => void;
}
const NodeComponent: React.FC<NodeComponentProps> = ({
  node,
  isSelected,
  onSelect,
  onDragStart,
  onDelete,
  onConfigure
}) => {
  const colors = stryMutAct_9fa48("6927") ? nodeColors[node.type] && {
    bg: '#F3F4F6',
    border: '#9CA3AF'
  } : stryMutAct_9fa48("6926") ? false : stryMutAct_9fa48("6925") ? true : (stryCov_9fa48("6925", "6926", "6927"), nodeColors[node.type] || (stryMutAct_9fa48("6928") ? {} : (stryCov_9fa48("6928"), {
    bg: '#F3F4F6',
    border: '#9CA3AF'
  })));
  return <div className={cn('absolute w-40 rounded-lg shadow-md cursor-move transition-shadow', stryMutAct_9fa48("6934") ? isSelected || 'ring-2 ring-primary-500 shadow-lg' : stryMutAct_9fa48("6933") ? false : stryMutAct_9fa48("6932") ? true : (stryCov_9fa48("6932", "6933", "6934"), isSelected && 'ring-2 ring-primary-500 shadow-lg'))} style={stryMutAct_9fa48("6936") ? {} : (stryCov_9fa48("6936"), {
    left: node.position.x,
    top: node.position.y,
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderWidth: 2
  })} onClick={e => {
    e.stopPropagation();
    onSelect();
  }} onMouseDown={onDragStart}>
      {/* Header */}
      <div className="px-3 py-2 border-b flex items-center gap-2" style={stryMutAct_9fa48("6938") ? {} : (stryCov_9fa48("6938"), {
      borderColor: colors.border
    })}>
        <span className="text-lg">{getNodeIcon(node)}</span>
        <span className="text-sm font-medium truncate flex-1">{node.label}</span>
      </div>

      {/* Body */}
      <div className="px-3 py-2">
        <p className="text-xs text-neutral-500 truncate">
          {getNodeDescription(node)}
        </p>
      </div>

      {/* Actions (visible when selected) */}
      {stryMutAct_9fa48("6941") ? isSelected || <div className="absolute -top-3 -right-3 flex gap-1">
          <button onClick={e => {
        e.stopPropagation();
        onConfigure();
      }} className="w-6 h-6 rounded-full bg-white border border-neutral-300 flex items-center justify-center text-xs hover:bg-neutral-100" title="Configure">
            ⚙️
          </button>
          <button onClick={e => {
        e.stopPropagation();
        onDelete();
      }} className="w-6 h-6 rounded-full bg-white border border-red-300 flex items-center justify-center text-xs hover:bg-red-50" title="Delete">
            🗑️
          </button>
        </div> : stryMutAct_9fa48("6940") ? false : stryMutAct_9fa48("6939") ? true : (stryCov_9fa48("6939", "6940", "6941"), isSelected && <div className="absolute -top-3 -right-3 flex gap-1">
          <button onClick={e => {
        e.stopPropagation();
        onConfigure();
      }} className="w-6 h-6 rounded-full bg-white border border-neutral-300 flex items-center justify-center text-xs hover:bg-neutral-100" title="Configure">
            ⚙️
          </button>
          <button onClick={e => {
        e.stopPropagation();
        onDelete();
      }} className="w-6 h-6 rounded-full bg-white border border-red-300 flex items-center justify-center text-xs hover:bg-red-50" title="Delete">
            🗑️
          </button>
        </div>)}

      {/* Connection points */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-4 h-4 rounded-full bg-white border-2 cursor-crosshair" style={stryMutAct_9fa48("6944") ? {} : (stryCov_9fa48("6944"), {
      borderColor: colors.border
    })} title="Input" />
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 rounded-full bg-white border-2 cursor-crosshair" style={stryMutAct_9fa48("6945") ? {} : (stryCov_9fa48("6945"), {
      borderColor: colors.border
    })} title="Output" />
    </div>;
};
function getNodeIcon(node: WorkflowNode): string {
  const config = node.config as {
    subtype?: string;
  };
  const allTypes = stryMutAct_9fa48("6947") ? [] : (stryCov_9fa48("6947"), [...nodeTypes.triggers, ...nodeTypes.actions, ...nodeTypes.logic, ...nodeTypes.notifications]);
  const found = allTypes.find(stryMutAct_9fa48("6948") ? () => undefined : (stryCov_9fa48("6948"), t => stryMutAct_9fa48("6951") ? t.type === node.type || !config.subtype || t.subtype === config.subtype : stryMutAct_9fa48("6950") ? false : stryMutAct_9fa48("6949") ? true : (stryCov_9fa48("6949", "6950", "6951"), (stryMutAct_9fa48("6953") ? t.type !== node.type : stryMutAct_9fa48("6952") ? true : (stryCov_9fa48("6952", "6953"), t.type === node.type)) && (stryMutAct_9fa48("6955") ? !config.subtype && t.subtype === config.subtype : stryMutAct_9fa48("6954") ? true : (stryCov_9fa48("6954", "6955"), (stryMutAct_9fa48("6956") ? config.subtype : (stryCov_9fa48("6956"), !config.subtype)) || (stryMutAct_9fa48("6958") ? t.subtype !== config.subtype : stryMutAct_9fa48("6957") ? false : (stryCov_9fa48("6957", "6958"), t.subtype === config.subtype)))))));
  return stryMutAct_9fa48("6961") ? found?.icon && '📦' : stryMutAct_9fa48("6960") ? false : stryMutAct_9fa48("6959") ? true : (stryCov_9fa48("6959", "6960", "6961"), (stryMutAct_9fa48("6962") ? found.icon : (stryCov_9fa48("6962"), found?.icon)) || '📦');
}
function getNodeDescription(node: WorkflowNode): string {
  const config = node.config as {
    subtype?: string;
  };
  const allTypes = stryMutAct_9fa48("6965") ? [] : (stryCov_9fa48("6965"), [...nodeTypes.triggers, ...nodeTypes.actions, ...nodeTypes.logic, ...nodeTypes.notifications]);
  const found = allTypes.find(stryMutAct_9fa48("6966") ? () => undefined : (stryCov_9fa48("6966"), t => stryMutAct_9fa48("6969") ? t.type === node.type || !config.subtype || t.subtype === config.subtype : stryMutAct_9fa48("6968") ? false : stryMutAct_9fa48("6967") ? true : (stryCov_9fa48("6967", "6968", "6969"), (stryMutAct_9fa48("6971") ? t.type !== node.type : stryMutAct_9fa48("6970") ? true : (stryCov_9fa48("6970", "6971"), t.type === node.type)) && (stryMutAct_9fa48("6973") ? !config.subtype && t.subtype === config.subtype : stryMutAct_9fa48("6972") ? true : (stryCov_9fa48("6972", "6973"), (stryMutAct_9fa48("6974") ? config.subtype : (stryCov_9fa48("6974"), !config.subtype)) || (stryMutAct_9fa48("6976") ? t.subtype !== config.subtype : stryMutAct_9fa48("6975") ? false : (stryCov_9fa48("6975", "6976"), t.subtype === config.subtype)))))));
  return stryMutAct_9fa48("6979") ? found?.description && 'Workflow step' : stryMutAct_9fa48("6978") ? false : stryMutAct_9fa48("6977") ? true : (stryCov_9fa48("6977", "6978", "6979"), (stryMutAct_9fa48("6980") ? found.description : (stryCov_9fa48("6980"), found?.description)) || 'Workflow step');
}

// =============================================================================
// EDGE COMPONENT
// =============================================================================

interface EdgeComponentProps {
  edge: WorkflowEdge;
  fromNode: WorkflowNode;
  toNode: WorkflowNode;
  isSelected: boolean;
  onSelect: () => void;
}
const EdgeComponent: React.FC<EdgeComponentProps> = ({
  edge,
  fromNode,
  toNode,
  isSelected,
  onSelect
}) => {
  const fromX = stryMutAct_9fa48("6983") ? fromNode.position.x - 80 : (stryCov_9fa48("6983"), fromNode.position.x + 80); // center of node
  const fromY = stryMutAct_9fa48("6984") ? fromNode.position.y - 80 : (stryCov_9fa48("6984"), fromNode.position.y + 80); // bottom of node
  const toX = stryMutAct_9fa48("6985") ? toNode.position.x - 80 : (stryCov_9fa48("6985"), toNode.position.x + 80);
  const toY = toNode.position.y; // top of node

  // Calculate control points for bezier curve
  const midY = stryMutAct_9fa48("6986") ? (fromY + toY) * 2 : (stryCov_9fa48("6986"), (stryMutAct_9fa48("6987") ? fromY - toY : (stryCov_9fa48("6987"), fromY + toY)) / 2);
  const path = `M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`;
  return <g onClick={onSelect} className="cursor-pointer">
      {/* Invisible wider path for easier clicking */}
      <path d={path} fill="none" stroke="transparent" strokeWidth={20} />
      {/* Visible path */}
      <path d={path} fill="none" stroke={isSelected ? '#6366F1' : '#94A3B8'} strokeWidth={isSelected ? 3 : 2} strokeDasharray={edge.condition ? '5,5' : undefined} markerEnd="url(#arrowhead)" />
      {/* Label */}
      {stryMutAct_9fa48("6994") ? edge.label || <text x={(fromX + toX) / 2} y={(fromY + toY) / 2} textAnchor="middle" className="text-xs fill-neutral-500">
          {edge.label}
        </text> : stryMutAct_9fa48("6993") ? false : stryMutAct_9fa48("6992") ? true : (stryCov_9fa48("6992", "6993", "6994"), edge.label && <text x={stryMutAct_9fa48("6995") ? (fromX + toX) * 2 : (stryCov_9fa48("6995"), (stryMutAct_9fa48("6996") ? fromX - toX : (stryCov_9fa48("6996"), fromX + toX)) / 2)} y={stryMutAct_9fa48("6997") ? (fromY + toY) * 2 : (stryCov_9fa48("6997"), (stryMutAct_9fa48("6998") ? fromY - toY : (stryCov_9fa48("6998"), fromY + toY)) / 2)} textAnchor="middle" className="text-xs fill-neutral-500">
          {edge.label}
        </text>)}
    </g>;
};

// =============================================================================
// PALETTE COMPONENT
// =============================================================================

interface PaletteProps {
  onDragStart: (nodeType: typeof nodeTypes.triggers[0]) => void;
}
const Palette: React.FC<PaletteProps> = ({
  onDragStart
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string>('triggers');
  const categories = stryMutAct_9fa48("7001") ? [] : (stryCov_9fa48("7001"), [stryMutAct_9fa48("7002") ? {} : (stryCov_9fa48("7002"), {
    key: 'triggers',
    label: 'Triggers',
    items: nodeTypes.triggers
  }), stryMutAct_9fa48("7005") ? {} : (stryCov_9fa48("7005"), {
    key: 'actions',
    label: 'Actions',
    items: nodeTypes.actions
  }), stryMutAct_9fa48("7008") ? {} : (stryCov_9fa48("7008"), {
    key: 'logic',
    label: 'Logic',
    items: nodeTypes.logic
  }), stryMutAct_9fa48("7011") ? {} : (stryCov_9fa48("7011"), {
    key: 'notifications',
    label: 'Notifications',
    items: nodeTypes.notifications
  })]);
  return <div className="w-56 bg-white border-r border-neutral-200 overflow-y-auto">
      <div className="p-3 border-b border-neutral-200">
        <h3 className="font-semibold text-neutral-900">Components</h3>
        <p className="text-xs text-neutral-500">Drag to add to canvas</p>
      </div>
      
      {categories.map(stryMutAct_9fa48("7014") ? () => undefined : (stryCov_9fa48("7014"), category => <div key={category.key}>
          <button onClick={stryMutAct_9fa48("7015") ? () => undefined : (stryCov_9fa48("7015"), () => setExpandedCategory((stryMutAct_9fa48("7018") ? expandedCategory !== category.key : stryMutAct_9fa48("7017") ? false : stryMutAct_9fa48("7016") ? true : (stryCov_9fa48("7016", "7017", "7018"), expandedCategory === category.key)) ? '' : category.key))} className="w-full px-3 py-2 flex items-center justify-between text-sm font-medium text-neutral-700 hover:bg-neutral-50">
            <span>{category.label}</span>
            <span className="text-neutral-400">{(stryMutAct_9fa48("7022") ? expandedCategory !== category.key : stryMutAct_9fa48("7021") ? false : stryMutAct_9fa48("7020") ? true : (stryCov_9fa48("7020", "7021", "7022"), expandedCategory === category.key)) ? '▼' : '▶'}</span>
          </button>
          
          {stryMutAct_9fa48("7027") ? expandedCategory === category.key || <div className="px-2 pb-2 space-y-1">
              {category.items.map((item, idx) => <div key={idx} draggable onDragStart={() => onDragStart(item)} className="flex items-center gap-2 p-2 rounded-lg cursor-grab hover:bg-neutral-100 transition-colors" style={{
          backgroundColor: `${nodeColors[item.type]?.bg}40`
        }}>
                  <span className="text-lg">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-800">{item.label}</p>
                    <p className="text-xs text-neutral-500 truncate">{item.description}</p>
                  </div>
                </div>)}
            </div> : stryMutAct_9fa48("7026") ? false : stryMutAct_9fa48("7025") ? true : (stryCov_9fa48("7025", "7026", "7027"), (stryMutAct_9fa48("7029") ? expandedCategory !== category.key : stryMutAct_9fa48("7028") ? true : (stryCov_9fa48("7028", "7029"), expandedCategory === category.key)) && <div className="px-2 pb-2 space-y-1">
              {category.items.map(stryMutAct_9fa48("7030") ? () => undefined : (stryCov_9fa48("7030"), (item, idx) => <div key={idx} draggable onDragStart={stryMutAct_9fa48("7031") ? () => undefined : (stryCov_9fa48("7031"), () => onDragStart(item))} className="flex items-center gap-2 p-2 rounded-lg cursor-grab hover:bg-neutral-100 transition-colors" style={stryMutAct_9fa48("7032") ? {} : (stryCov_9fa48("7032"), {
          backgroundColor: `${stryMutAct_9fa48("7034") ? nodeColors[item.type].bg : (stryCov_9fa48("7034"), nodeColors[item.type]?.bg)}40`
        })}>
                  <span className="text-lg">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-800">{item.label}</p>
                    <p className="text-xs text-neutral-500 truncate">{item.description}</p>
                  </div>
                </div>))}
            </div>)}
        </div>))}
    </div>;
};

// =============================================================================
// CONFIG PANEL COMPONENT
// =============================================================================

interface ConfigPanelProps {
  node: WorkflowNode | null;
  onUpdate: (config: Record<string, unknown>) => void;
  onClose: () => void;
}
const ConfigPanel: React.FC<ConfigPanelProps> = ({
  node,
  onUpdate,
  onClose
}) => {
  if (stryMutAct_9fa48("7038") ? false : stryMutAct_9fa48("7037") ? true : stryMutAct_9fa48("7036") ? node : (stryCov_9fa48("7036", "7037", "7038"), !node)) {
    return null;
  }
  return <div className="w-72 bg-white border-l border-neutral-200 overflow-y-auto">
      <div className="p-3 border-b border-neutral-200 flex items-center justify-between">
        <h3 className="font-semibold text-neutral-900">Configure: {node.label}</h3>
        <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">✕</button>
      </div>
      
      <div className="p-3 space-y-4">
        {/* Node Label */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Label</label>
          <input type="text" value={node.label} onChange={stryMutAct_9fa48("7040") ? () => undefined : (stryCov_9fa48("7040"), e => onUpdate(stryMutAct_9fa48("7041") ? {} : (stryCov_9fa48("7041"), {
          ...node.config,
          label: e.target.value
        })))} className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>

        {/* Type-specific configuration */}
        {stryMutAct_9fa48("7044") ? node.type === 'trigger' || <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Schedule (cron)</label>
            <input type="text" placeholder="0 9 * * 1-5" className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            <p className="text-xs text-neutral-500 mt-1">e.g., "0 9 * * 1-5" for weekdays at 9am</p>
          </div> : stryMutAct_9fa48("7043") ? false : stryMutAct_9fa48("7042") ? true : (stryCov_9fa48("7042", "7043", "7044"), (stryMutAct_9fa48("7046") ? node.type !== 'trigger' : stryMutAct_9fa48("7045") ? true : (stryCov_9fa48("7045", "7046"), node.type === 'trigger')) && <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Schedule (cron)</label>
            <input type="text" placeholder="0 9 * * 1-5" className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            <p className="text-xs text-neutral-500 mt-1">e.g., "0 9 * * 1-5" for weekdays at 9am</p>
          </div>)}

        {stryMutAct_9fa48("7050") ? node.type === 'query' || <>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Data Source</label>
              <select className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>Select source...</option>
                <option>Sales Mart</option>
                <option>CRM Export</option>
                <option>Financial Data</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Query</label>
              <textarea rows={3} placeholder="SELECT * FROM..." className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </> : stryMutAct_9fa48("7049") ? false : stryMutAct_9fa48("7048") ? true : (stryCov_9fa48("7048", "7049", "7050"), (stryMutAct_9fa48("7052") ? node.type !== 'query' : stryMutAct_9fa48("7051") ? true : (stryCov_9fa48("7051", "7052"), node.type === 'query')) && <>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Data Source</label>
              <select className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>Select source...</option>
                <option>Sales Mart</option>
                <option>CRM Export</option>
                <option>Financial Data</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Query</label>
              <textarea rows={3} placeholder="SELECT * FROM..." className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </>)}

        {stryMutAct_9fa48("7056") ? node.type === 'condition' || <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Condition</label>
            <input type="text" placeholder="{{value}} > 100" className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div> : stryMutAct_9fa48("7055") ? false : stryMutAct_9fa48("7054") ? true : (stryCov_9fa48("7054", "7055", "7056"), (stryMutAct_9fa48("7058") ? node.type !== 'condition' : stryMutAct_9fa48("7057") ? true : (stryCov_9fa48("7057", "7058"), node.type === 'condition')) && <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Condition</label>
            <input type="text" placeholder="{{value}} > 100" className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>)}

        {stryMutAct_9fa48("7062") ? node.type === 'notification' || <>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Recipients</label>
              <input type="text" placeholder="email@example.com" className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Message</label>
              <textarea rows={3} placeholder="Enter message..." className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </> : stryMutAct_9fa48("7061") ? false : stryMutAct_9fa48("7060") ? true : (stryCov_9fa48("7060", "7061", "7062"), (stryMutAct_9fa48("7064") ? node.type !== 'notification' : stryMutAct_9fa48("7063") ? true : (stryCov_9fa48("7063", "7064"), node.type === 'notification')) && <>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Recipients</label>
              <input type="text" placeholder="email@example.com" className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Message</label>
              <textarea rows={3} placeholder="Enter message..." className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </>)}

        <div className="pt-3 border-t border-neutral-200">
          <button onClick={onClose} className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">
            Apply Configuration
          </button>
        </div>
      </div>
    </div>;
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  workflowId,
  initialNodes = stryMutAct_9fa48("7066") ? ["Stryker was here"] : (stryCov_9fa48("7066"), []),
  initialEdges = stryMutAct_9fa48("7067") ? ["Stryker was here"] : (stryCov_9fa48("7067"), []),
  onSave,
  onChange
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<WorkflowNode[]>(initialNodes);
  const [edges, setEdges] = useState<WorkflowEdge[]>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [configuringNode, setConfiguringNode] = useState<WorkflowNode | null>(null);
  const [draggedType, setDraggedType] = useState<typeof nodeTypes.triggers[0] | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Position>(stryMutAct_9fa48("7069") ? {} : (stryCov_9fa48("7069"), {
    x: 0,
    y: 0
  }));

  // Notify parent of changes
  useEffect(() => {
    stryMutAct_9fa48("7071") ? onChange(nodes, edges) : (stryCov_9fa48("7071"), onChange?.(nodes, edges));
  }, stryMutAct_9fa48("7072") ? [] : (stryCov_9fa48("7072"), [nodes, edges, onChange]));

  // Handle dropping a new node from palette
  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (stryMutAct_9fa48("7076") ? !draggedType && !canvasRef.current : stryMutAct_9fa48("7075") ? false : stryMutAct_9fa48("7074") ? true : (stryCov_9fa48("7074", "7075", "7076"), (stryMutAct_9fa48("7077") ? draggedType : (stryCov_9fa48("7077"), !draggedType)) || (stryMutAct_9fa48("7078") ? canvasRef.current : (stryCov_9fa48("7078"), !canvasRef.current)))) {
      return;
    }
    const rect = canvasRef.current.getBoundingClientRect();
    const x = stryMutAct_9fa48("7080") ? e.clientX - rect.left + 80 : (stryCov_9fa48("7080"), (stryMutAct_9fa48("7081") ? e.clientX + rect.left : (stryCov_9fa48("7081"), e.clientX - rect.left)) - 80);
    const y = stryMutAct_9fa48("7082") ? e.clientY - rect.top + 40 : (stryCov_9fa48("7082"), (stryMutAct_9fa48("7083") ? e.clientY + rect.top : (stryCov_9fa48("7083"), e.clientY - rect.top)) - 40);
    const newNode: WorkflowNode = stryMutAct_9fa48("7084") ? {} : (stryCov_9fa48("7084"), {
      id: `node-${Date.now()}`,
      type: draggedType.type as WorkflowNode['type'],
      label: draggedType.label,
      config: stryMutAct_9fa48("7086") ? {} : (stryCov_9fa48("7086"), {
        subtype: draggedType.subtype
      }),
      position: stryMutAct_9fa48("7087") ? {} : (stryCov_9fa48("7087"), {
        x,
        y
      })
    });
    setNodes(stryMutAct_9fa48("7088") ? () => undefined : (stryCov_9fa48("7088"), prev => stryMutAct_9fa48("7089") ? [] : (stryCov_9fa48("7089"), [...prev, newNode])));
    setDraggedType(null);
  }, stryMutAct_9fa48("7090") ? [] : (stryCov_9fa48("7090"), [draggedType]));

  // Handle node dragging
  const handleNodeDragStart = useCallback((nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const node = nodes.find(stryMutAct_9fa48("7092") ? () => undefined : (stryCov_9fa48("7092"), n => stryMutAct_9fa48("7095") ? n.id !== nodeId : stryMutAct_9fa48("7094") ? false : stryMutAct_9fa48("7093") ? true : (stryCov_9fa48("7093", "7094", "7095"), n.id === nodeId)));
    if (stryMutAct_9fa48("7098") ? false : stryMutAct_9fa48("7097") ? true : stryMutAct_9fa48("7096") ? node : (stryCov_9fa48("7096", "7097", "7098"), !node)) {
      return;
    }
    setDraggingNodeId(nodeId);
    setDragOffset(stryMutAct_9fa48("7100") ? {} : (stryCov_9fa48("7100"), {
      x: stryMutAct_9fa48("7101") ? e.clientX + node.position.x : (stryCov_9fa48("7101"), e.clientX - node.position.x),
      y: stryMutAct_9fa48("7102") ? e.clientY + node.position.y : (stryCov_9fa48("7102"), e.clientY - node.position.y)
    }));
  }, stryMutAct_9fa48("7103") ? [] : (stryCov_9fa48("7103"), [nodes]));
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (stryMutAct_9fa48("7107") ? false : stryMutAct_9fa48("7106") ? true : stryMutAct_9fa48("7105") ? draggingNodeId : (stryCov_9fa48("7105", "7106", "7107"), !draggingNodeId)) {
      return;
    }
    setNodes(stryMutAct_9fa48("7109") ? () => undefined : (stryCov_9fa48("7109"), prev => prev.map(stryMutAct_9fa48("7110") ? () => undefined : (stryCov_9fa48("7110"), node => (stryMutAct_9fa48("7113") ? node.id !== draggingNodeId : stryMutAct_9fa48("7112") ? false : stryMutAct_9fa48("7111") ? true : (stryCov_9fa48("7111", "7112", "7113"), node.id === draggingNodeId)) ? stryMutAct_9fa48("7114") ? {} : (stryCov_9fa48("7114"), {
      ...node,
      position: stryMutAct_9fa48("7115") ? {} : (stryCov_9fa48("7115"), {
        x: stryMutAct_9fa48("7116") ? e.clientX + dragOffset.x : (stryCov_9fa48("7116"), e.clientX - dragOffset.x),
        y: stryMutAct_9fa48("7117") ? e.clientY + dragOffset.y : (stryCov_9fa48("7117"), e.clientY - dragOffset.y)
      })
    }) : node))));
  }, stryMutAct_9fa48("7118") ? [] : (stryCov_9fa48("7118"), [draggingNodeId, dragOffset]));
  const handleMouseUp = useCallback(() => {
    setDraggingNodeId(null);
  }, stryMutAct_9fa48("7120") ? ["Stryker was here"] : (stryCov_9fa48("7120"), []));

  // Delete node
  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes(stryMutAct_9fa48("7122") ? () => undefined : (stryCov_9fa48("7122"), prev => stryMutAct_9fa48("7123") ? prev : (stryCov_9fa48("7123"), prev.filter(stryMutAct_9fa48("7124") ? () => undefined : (stryCov_9fa48("7124"), n => stryMutAct_9fa48("7127") ? n.id === nodeId : stryMutAct_9fa48("7126") ? false : stryMutAct_9fa48("7125") ? true : (stryCov_9fa48("7125", "7126", "7127"), n.id !== nodeId))))));
    setEdges(stryMutAct_9fa48("7128") ? () => undefined : (stryCov_9fa48("7128"), prev => stryMutAct_9fa48("7129") ? prev : (stryCov_9fa48("7129"), prev.filter(stryMutAct_9fa48("7130") ? () => undefined : (stryCov_9fa48("7130"), e => stryMutAct_9fa48("7133") ? e.from !== nodeId || e.to !== nodeId : stryMutAct_9fa48("7132") ? false : stryMutAct_9fa48("7131") ? true : (stryCov_9fa48("7131", "7132", "7133"), (stryMutAct_9fa48("7135") ? e.from === nodeId : stryMutAct_9fa48("7134") ? true : (stryCov_9fa48("7134", "7135"), e.from !== nodeId)) && (stryMutAct_9fa48("7137") ? e.to === nodeId : stryMutAct_9fa48("7136") ? true : (stryCov_9fa48("7136", "7137"), e.to !== nodeId))))))));
    setSelectedNodeId(null);
  }, stryMutAct_9fa48("7138") ? ["Stryker was here"] : (stryCov_9fa48("7138"), []));

  // Update node config
  const handleUpdateNodeConfig = useCallback((config: Record<string, unknown>) => {
    if (stryMutAct_9fa48("7142") ? false : stryMutAct_9fa48("7141") ? true : stryMutAct_9fa48("7140") ? configuringNode : (stryCov_9fa48("7140", "7141", "7142"), !configuringNode)) {
      return;
    }
    setNodes(stryMutAct_9fa48("7144") ? () => undefined : (stryCov_9fa48("7144"), prev => prev.map(stryMutAct_9fa48("7145") ? () => undefined : (stryCov_9fa48("7145"), n => (stryMutAct_9fa48("7148") ? n.id !== configuringNode.id : stryMutAct_9fa48("7147") ? false : stryMutAct_9fa48("7146") ? true : (stryCov_9fa48("7146", "7147", "7148"), n.id === configuringNode.id)) ? stryMutAct_9fa48("7149") ? {} : (stryCov_9fa48("7149"), {
      ...n,
      config: stryMutAct_9fa48("7150") ? {} : (stryCov_9fa48("7150"), {
        ...n.config,
        ...config
      })
    }) : n))));
  }, stryMutAct_9fa48("7151") ? [] : (stryCov_9fa48("7151"), [configuringNode]));

  // Save workflow
  const handleSave = useCallback(async () => {
    stryMutAct_9fa48("7153") ? onSave(nodes, edges) : (stryCov_9fa48("7153"), onSave?.(nodes, edges));
    if (stryMutAct_9fa48("7155") ? false : stryMutAct_9fa48("7154") ? true : (stryCov_9fa48("7154", "7155"), workflowId)) {
      try {
        await workflowsApi.updateWorkflow(workflowId, stryMutAct_9fa48("7158") ? {} : (stryCov_9fa48("7158"), {
          definition: {
            nodes,
            edges
          } as any
        }));
      } catch (err) {
        console.error('Failed to save workflow:', err);
      }
    }
  }, stryMutAct_9fa48("7161") ? [] : (stryCov_9fa48("7161"), [nodes, edges, workflowId, onSave]));
  const selectedNode = nodes.find(stryMutAct_9fa48("7162") ? () => undefined : (stryCov_9fa48("7162"), n => stryMutAct_9fa48("7165") ? n.id !== selectedNodeId : stryMutAct_9fa48("7164") ? false : stryMutAct_9fa48("7163") ? true : (stryCov_9fa48("7163", "7164", "7165"), n.id === selectedNodeId)));
  return <div className="flex h-full bg-neutral-100">
      {/* Palette */}
      <Palette onDragStart={setDraggedType} />

      {/* Canvas */}
      <div ref={canvasRef} className="flex-1 relative overflow-hidden" onDragOver={stryMutAct_9fa48("7166") ? () => undefined : (stryCov_9fa48("7166"), e => e.preventDefault())} onDrop={handleCanvasDrop} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onClick={() => {
      setSelectedNodeId(null);
      setSelectedEdgeId(null);
    }}>
        {/* Grid background */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5E7EB" strokeWidth="0.5" />
            </pattern>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#94A3B8" />
            </marker>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Edges */}
          {edges.map(edge => {
          const fromNode = nodes.find(stryMutAct_9fa48("7169") ? () => undefined : (stryCov_9fa48("7169"), n => stryMutAct_9fa48("7172") ? n.id !== edge.from : stryMutAct_9fa48("7171") ? false : stryMutAct_9fa48("7170") ? true : (stryCov_9fa48("7170", "7171", "7172"), n.id === edge.from)));
          const toNode = nodes.find(stryMutAct_9fa48("7173") ? () => undefined : (stryCov_9fa48("7173"), n => stryMutAct_9fa48("7176") ? n.id !== edge.to : stryMutAct_9fa48("7175") ? false : stryMutAct_9fa48("7174") ? true : (stryCov_9fa48("7174", "7175", "7176"), n.id === edge.to)));
          if (stryMutAct_9fa48("7179") ? !fromNode && !toNode : stryMutAct_9fa48("7178") ? false : stryMutAct_9fa48("7177") ? true : (stryCov_9fa48("7177", "7178", "7179"), (stryMutAct_9fa48("7180") ? fromNode : (stryCov_9fa48("7180"), !fromNode)) || (stryMutAct_9fa48("7181") ? toNode : (stryCov_9fa48("7181"), !toNode)))) {
            return null;
          }
          return <EdgeComponent key={edge.id} edge={edge} fromNode={fromNode} toNode={toNode} isSelected={stryMutAct_9fa48("7185") ? selectedEdgeId !== edge.id : stryMutAct_9fa48("7184") ? false : stryMutAct_9fa48("7183") ? true : (stryCov_9fa48("7183", "7184", "7185"), selectedEdgeId === edge.id)} onSelect={stryMutAct_9fa48("7186") ? () => undefined : (stryCov_9fa48("7186"), () => setSelectedEdgeId(edge.id))} />;
        })}
        </svg>

        {/* Nodes */}
        {nodes.map(stryMutAct_9fa48("7187") ? () => undefined : (stryCov_9fa48("7187"), node => <NodeComponent key={node.id} node={node} isSelected={stryMutAct_9fa48("7190") ? selectedNodeId !== node.id : stryMutAct_9fa48("7189") ? false : stryMutAct_9fa48("7188") ? true : (stryCov_9fa48("7188", "7189", "7190"), selectedNodeId === node.id)} onSelect={stryMutAct_9fa48("7191") ? () => undefined : (stryCov_9fa48("7191"), () => setSelectedNodeId(node.id))} onDragStart={stryMutAct_9fa48("7192") ? () => undefined : (stryCov_9fa48("7192"), e => handleNodeDragStart(node.id, e))} onDelete={stryMutAct_9fa48("7193") ? () => undefined : (stryCov_9fa48("7193"), () => handleDeleteNode(node.id))} onConfigure={stryMutAct_9fa48("7194") ? () => undefined : (stryCov_9fa48("7194"), () => setConfiguringNode(node))} />))}

        {/* Empty state */}
        {stryMutAct_9fa48("7197") ? nodes.length === 0 || <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-4xl mb-2">📋</div>
              <p className="text-neutral-500">Drag components from the left panel to build your workflow</p>
            </div>
          </div> : stryMutAct_9fa48("7196") ? false : stryMutAct_9fa48("7195") ? true : (stryCov_9fa48("7195", "7196", "7197"), (stryMutAct_9fa48("7199") ? nodes.length !== 0 : stryMutAct_9fa48("7198") ? true : (stryCov_9fa48("7198", "7199"), nodes.length === 0)) && <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-4xl mb-2">📋</div>
              <p className="text-neutral-500">Drag components from the left panel to build your workflow</p>
            </div>
          </div>)}

        {/* Toolbar */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={handleSave} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 shadow-md">
            Save Workflow
          </button>
        </div>
      </div>

      {/* Config Panel */}
      <ConfigPanel node={configuringNode} onUpdate={handleUpdateNodeConfig} onClose={stryMutAct_9fa48("7200") ? () => undefined : (stryCov_9fa48("7200"), () => setConfiguringNode(null))} />
    </div>;
};
export default WorkflowBuilder;