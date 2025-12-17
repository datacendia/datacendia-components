/**
 * GraphCanvas - Cytoscape.js-based graph visualization component
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
import React, { useEffect, useRef, useCallback, useState } from 'react';
import cytoscape, { Core, NodeSingular, EdgeSingular, EventObject } from 'cytoscape';
import { cn } from '../../../lib/utils';

// Graph element types
export interface GraphNode {
  id: string;
  type: string;
  name: string;
  properties?: Record<string, unknown>;
}
export interface GraphEdge {
  source: string;
  target: string;
  type: string;
  properties?: Record<string, unknown>;
}
export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
interface GraphCanvasProps {
  data: GraphData;
  selectedNodeId?: string | null;
  onNodeSelect?: (node: GraphNode | null) => void;
  onNodeDoubleClick?: (node: GraphNode) => void;
  onEdgeSelect?: (edge: GraphEdge | null) => void;
  className?: string;
  layout?: 'cose' | 'breadthfirst' | 'circle' | 'concentric' | 'grid' | 'dagre';
}

// Color scheme for different node types
const nodeColors: Record<string, string> = stryMutAct_9fa48("4509") ? {} : (stryCov_9fa48("4509"), {
  Dataset: '#3B82F6',
  // Blue
  Metric: '#10B981',
  // Green
  Process: '#8B5CF6',
  // Purple
  Report: '#F59E0B',
  // Amber
  Dashboard: '#EC4899',
  // Pink
  Entity: '#6366F1',
  // Indigo
  User: '#14B8A6',
  // Teal
  Team: '#F97316',
  // Orange
  default: '#6B7280' // Gray
});

// Edge colors by relationship type
const edgeColors: Record<string, string> = stryMutAct_9fa48("4519") ? {} : (stryCov_9fa48("4519"), {
  DERIVES_FROM: '#3B82F6',
  CALCULATED_FROM: '#10B981',
  IMPACTS: '#F59E0B',
  OWNS: '#8B5CF6',
  USES: '#EC4899',
  default: '#9CA3AF'
});
export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  data,
  selectedNodeId,
  onNodeSelect,
  onNodeDoubleClick,
  onEdgeSelect,
  className,
  layout = 'cose'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const [isInitialized, setIsInitialized] = useState(stryMutAct_9fa48("4528") ? true : (stryCov_9fa48("4528"), false));

  // Convert data to Cytoscape format
  const getCytoscapeElements = useCallback(() => {
    const nodes = data.nodes.map(stryMutAct_9fa48("4530") ? () => undefined : (stryCov_9fa48("4530"), node => stryMutAct_9fa48("4531") ? {} : (stryCov_9fa48("4531"), {
      data: stryMutAct_9fa48("4532") ? {} : (stryCov_9fa48("4532"), {
        id: node.id,
        label: node.name,
        type: node.type,
        ...node.properties
      })
    })));
    const edges = data.edges.map(stryMutAct_9fa48("4533") ? () => undefined : (stryCov_9fa48("4533"), (edge, index) => stryMutAct_9fa48("4534") ? {} : (stryCov_9fa48("4534"), {
      data: stryMutAct_9fa48("4535") ? {} : (stryCov_9fa48("4535"), {
        id: `edge-${index}`,
        source: edge.source,
        target: edge.target,
        type: edge.type,
        label: stryMutAct_9fa48("4537") ? edge.type.replace(/_/g, ' ').toUpperCase() : (stryCov_9fa48("4537"), edge.type.replace(/_/g, ' ').toLowerCase()),
        ...edge.properties
      })
    })));
    return stryMutAct_9fa48("4539") ? [] : (stryCov_9fa48("4539"), [...nodes, ...edges]);
  }, stryMutAct_9fa48("4540") ? [] : (stryCov_9fa48("4540"), [data]));

  // Initialize Cytoscape
  useEffect(() => {
    if (stryMutAct_9fa48("4544") ? false : stryMutAct_9fa48("4543") ? true : stryMutAct_9fa48("4542") ? containerRef.current : (stryCov_9fa48("4542", "4543", "4544"), !containerRef.current)) {
      return;
    }
    const cy = cytoscape(stryMutAct_9fa48("4546") ? {} : (stryCov_9fa48("4546"), {
      container: containerRef.current,
      elements: getCytoscapeElements(),
      style: stryMutAct_9fa48("4547") ? [] : (stryCov_9fa48("4547"), [// Node styles
      stryMutAct_9fa48("4548") ? {} : (stryCov_9fa48("4548"), {
        selector: 'node',
        style: {
          'background-color': (ele: NodeSingular) => nodeColors[ele.data('type')] || nodeColors.default,
          'label': 'data(label)',
          'text-valign': 'bottom',
          'text-halign': 'center',
          'text-margin-y': 8,
          'font-size': 12,
          'font-weight': 500,
          'color': '#374151',
          'text-outline-color': '#ffffff',
          'text-outline-width': 2,
          'width': 40,
          'height': 40,
          'border-width': 2,
          'border-color': '#ffffff',
          'transition-property': 'background-color, border-color, width, height',
          'transition-duration': 150
        } as cytoscape.Css.Node
      }), // Selected node
      stryMutAct_9fa48("4550") ? {} : (stryCov_9fa48("4550"), {
        selector: 'node:selected',
        style: {
          'border-width': 3,
          'border-color': '#1D4ED8',
          'width': 50,
          'height': 50
        } as cytoscape.Css.Node
      }), // Hovered node
      stryMutAct_9fa48("4552") ? {} : (stryCov_9fa48("4552"), {
        selector: 'node:active',
        style: {
          'overlay-opacity': 0.1
        } as cytoscape.Css.Node
      }), // Edge styles
      stryMutAct_9fa48("4554") ? {} : (stryCov_9fa48("4554"), {
        selector: 'edge',
        style: {
          'width': 2,
          'line-color': (ele: EdgeSingular) => edgeColors[ele.data('type')] || edgeColors.default,
          'target-arrow-color': (ele: EdgeSingular) => edgeColors[ele.data('type')] || edgeColors.default,
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier',
          'label': 'data(label)',
          'font-size': 10,
          'color': '#6B7280',
          'text-rotation': 'autorotate',
          'text-margin-y': -10,
          'text-background-color': '#ffffff',
          'text-background-opacity': 0.8,
          'text-background-padding': 2
        } as unknown as cytoscape.Css.Edge
      }), // Selected edge
      stryMutAct_9fa48("4556") ? {} : (stryCov_9fa48("4556"), {
        selector: 'edge:selected',
        style: {
          'width': 3,
          'line-color': '#1D4ED8',
          'target-arrow-color': '#1D4ED8'
        } as cytoscape.Css.Edge
      }), // Inferred (heuristic) edges
      stryMutAct_9fa48("4558") ? {} : (stryCov_9fa48("4558"), {
        selector: 'edge[inferred = true]',
        style: {
          'line-style': 'dashed'
        } as cytoscape.Css.Edge
      }), // Dimmed elements (when filtering)
      stryMutAct_9fa48("4560") ? {} : (stryCov_9fa48("4560"), {
        selector: '.dimmed',
        style: {
          'opacity': 0.2
        } as cytoscape.Css.Node
      }), // Highlighted path
      stryMutAct_9fa48("4562") ? {} : (stryCov_9fa48("4562"), {
        selector: '.highlighted',
        style: {
          'background-color': '#1D4ED8',
          'line-color': '#1D4ED8',
          'target-arrow-color': '#1D4ED8'
        } as cytoscape.Css.Node
      })]),
      layout: stryMutAct_9fa48("4564") ? {} : (stryCov_9fa48("4564"), {
        name: layout,
        animate: stryMutAct_9fa48("4565") ? false : (stryCov_9fa48("4565"), true),
        animationDuration: 500,
        fit: stryMutAct_9fa48("4566") ? false : (stryCov_9fa48("4566"), true),
        padding: 50,
        ...((stryMutAct_9fa48("4569") ? layout !== 'cose' : stryMutAct_9fa48("4568") ? false : stryMutAct_9fa48("4567") ? true : (stryCov_9fa48("4567", "4568", "4569"), layout === 'cose')) ? stryMutAct_9fa48("4571") ? {} : (stryCov_9fa48("4571"), {
          nodeRepulsion: stryMutAct_9fa48("4572") ? () => undefined : (stryCov_9fa48("4572"), () => 8000),
          idealEdgeLength: stryMutAct_9fa48("4573") ? () => undefined : (stryCov_9fa48("4573"), () => 100),
          edgeElasticity: stryMutAct_9fa48("4574") ? () => undefined : (stryCov_9fa48("4574"), () => 100),
          gravity: 0.25,
          numIter: 1000
        }) : {})
      }),
      minZoom: 0.2,
      maxZoom: 3,
      wheelSensitivity: 0.3
    }));
    cyRef.current = cy;

    // Event handlers
    cy.on('tap', 'node', (evt: EventObject) => {
      const node = evt.target;
      const nodeData: GraphNode = stryMutAct_9fa48("4578") ? {} : (stryCov_9fa48("4578"), {
        id: node.data('id'),
        type: node.data('type'),
        name: node.data('label'),
        properties: node.data()
      });
      stryMutAct_9fa48("4582") ? onNodeSelect(nodeData) : (stryCov_9fa48("4582"), onNodeSelect?.(nodeData));
    });
    cy.on('tap', 'edge', (evt: EventObject) => {
      const edge = evt.target;
      const edgeData: GraphEdge = stryMutAct_9fa48("4586") ? {} : (stryCov_9fa48("4586"), {
        source: edge.data('source'),
        target: edge.data('target'),
        type: edge.data('type'),
        properties: edge.data()
      });
      stryMutAct_9fa48("4590") ? onEdgeSelect(edgeData) : (stryCov_9fa48("4590"), onEdgeSelect?.(edgeData));
    });
    cy.on('tap', (evt: EventObject) => {
      if (stryMutAct_9fa48("4595") ? evt.target !== cy : stryMutAct_9fa48("4594") ? false : stryMutAct_9fa48("4593") ? true : (stryCov_9fa48("4593", "4594", "4595"), evt.target === cy)) {
        stryMutAct_9fa48("4597") ? onNodeSelect(null) : (stryCov_9fa48("4597"), onNodeSelect?.(null));
        stryMutAct_9fa48("4598") ? onEdgeSelect(null) : (stryCov_9fa48("4598"), onEdgeSelect?.(null));
      }
    });
    cy.on('dbltap', 'node', (evt: EventObject) => {
      const node = evt.target;
      const nodeData: GraphNode = stryMutAct_9fa48("4602") ? {} : (stryCov_9fa48("4602"), {
        id: node.data('id'),
        type: node.data('type'),
        name: node.data('label'),
        properties: node.data()
      });
      stryMutAct_9fa48("4606") ? onNodeDoubleClick(nodeData) : (stryCov_9fa48("4606"), onNodeDoubleClick?.(nodeData));
    });
    setIsInitialized(stryMutAct_9fa48("4607") ? false : (stryCov_9fa48("4607"), true));
    return () => {
      cy.destroy();
      cyRef.current = null;
    };
  }, stryMutAct_9fa48("4609") ? ["Stryker was here"] : (stryCov_9fa48("4609"), []));

  // Update elements when data changes
  useEffect(() => {
    if (stryMutAct_9fa48("4613") ? !cyRef.current && !isInitialized : stryMutAct_9fa48("4612") ? false : stryMutAct_9fa48("4611") ? true : (stryCov_9fa48("4611", "4612", "4613"), (stryMutAct_9fa48("4614") ? cyRef.current : (stryCov_9fa48("4614"), !cyRef.current)) || (stryMutAct_9fa48("4615") ? isInitialized : (stryCov_9fa48("4615"), !isInitialized)))) {
      return;
    }
    const cy = cyRef.current;
    cy.elements().remove();
    cy.add(getCytoscapeElements());
    cy.layout(stryMutAct_9fa48("4617") ? {} : (stryCov_9fa48("4617"), {
      name: layout,
      animate: stryMutAct_9fa48("4618") ? false : (stryCov_9fa48("4618"), true),
      animationDuration: 500,
      fit: stryMutAct_9fa48("4619") ? false : (stryCov_9fa48("4619"), true),
      padding: 50
    })).run();
  }, stryMutAct_9fa48("4620") ? [] : (stryCov_9fa48("4620"), [data, isInitialized, getCytoscapeElements, layout]));

  // Handle external selection
  useEffect(() => {
    if (stryMutAct_9fa48("4624") ? !cyRef.current && !isInitialized : stryMutAct_9fa48("4623") ? false : stryMutAct_9fa48("4622") ? true : (stryCov_9fa48("4622", "4623", "4624"), (stryMutAct_9fa48("4625") ? cyRef.current : (stryCov_9fa48("4625"), !cyRef.current)) || (stryMutAct_9fa48("4626") ? isInitialized : (stryCov_9fa48("4626"), !isInitialized)))) {
      return;
    }
    const cy = cyRef.current;
    cy.elements().unselect();
    if (stryMutAct_9fa48("4629") ? false : stryMutAct_9fa48("4628") ? true : (stryCov_9fa48("4628", "4629"), selectedNodeId)) {
      const node = cy.getElementById(selectedNodeId);
      if (stryMutAct_9fa48("4634") ? node.length <= 0 : stryMutAct_9fa48("4633") ? node.length >= 0 : stryMutAct_9fa48("4632") ? false : stryMutAct_9fa48("4631") ? true : (stryCov_9fa48("4631", "4632", "4633", "4634"), node.length > 0)) {
        node.select();
        cy.animate(stryMutAct_9fa48("4636") ? {} : (stryCov_9fa48("4636"), {
          center: stryMutAct_9fa48("4637") ? {} : (stryCov_9fa48("4637"), {
            eles: node
          }),
          zoom: 1.5,
          duration: 300
        }));
      }
    }
  }, stryMutAct_9fa48("4638") ? [] : (stryCov_9fa48("4638"), [selectedNodeId, isInitialized]));

  // Public methods exposed via ref
  const zoomIn = useCallback(() => {
    stryMutAct_9fa48("4640") ? cyRef.current.zoom(cyRef.current.zoom() * 1.2) : (stryCov_9fa48("4640"), cyRef.current?.zoom(stryMutAct_9fa48("4641") ? cyRef.current.zoom() / 1.2 : (stryCov_9fa48("4641"), cyRef.current.zoom() * 1.2)));
  }, stryMutAct_9fa48("4642") ? ["Stryker was here"] : (stryCov_9fa48("4642"), []));
  const zoomOut = useCallback(() => {
    stryMutAct_9fa48("4644") ? cyRef.current.zoom(cyRef.current.zoom() * 0.8) : (stryCov_9fa48("4644"), cyRef.current?.zoom(stryMutAct_9fa48("4645") ? cyRef.current.zoom() / 0.8 : (stryCov_9fa48("4645"), cyRef.current.zoom() * 0.8)));
  }, stryMutAct_9fa48("4646") ? ["Stryker was here"] : (stryCov_9fa48("4646"), []));
  const fitToScreen = useCallback(() => {
    stryMutAct_9fa48("4648") ? cyRef.current.fit(undefined, 50) : (stryCov_9fa48("4648"), cyRef.current?.fit(undefined, 50));
  }, stryMutAct_9fa48("4649") ? ["Stryker was here"] : (stryCov_9fa48("4649"), []));
  const resetView = useCallback(() => {
    stryMutAct_9fa48("4651") ? cyRef.current.reset() : (stryCov_9fa48("4651"), cyRef.current?.reset());
  }, stryMutAct_9fa48("4652") ? ["Stryker was here"] : (stryCov_9fa48("4652"), []));
  const highlightPath = useCallback((nodeIds: string[]) => {
    if (stryMutAct_9fa48("4656") ? false : stryMutAct_9fa48("4655") ? true : stryMutAct_9fa48("4654") ? cyRef.current : (stryCov_9fa48("4654", "4655", "4656"), !cyRef.current)) {
      return;
    }
    const cy = cyRef.current;
    cy.elements().removeClass('highlighted dimmed');
    if (stryMutAct_9fa48("4661") ? nodeIds.length !== 0 : stryMutAct_9fa48("4660") ? false : stryMutAct_9fa48("4659") ? true : (stryCov_9fa48("4659", "4660", "4661"), nodeIds.length === 0)) {
      return;
    }
    const nodes = stryMutAct_9fa48("4663") ? cy.nodes() : (stryCov_9fa48("4663"), cy.nodes().filter(stryMutAct_9fa48("4664") ? () => undefined : (stryCov_9fa48("4664"), n => nodeIds.includes(n.data('id')))));
    const edges = nodes.edgesWith(nodes);
    cy.elements().addClass('dimmed');
    nodes.removeClass('dimmed').addClass('highlighted');
    edges.removeClass('dimmed').addClass('highlighted');
  }, stryMutAct_9fa48("4671") ? ["Stryker was here"] : (stryCov_9fa48("4671"), []));
  const clearHighlight = useCallback(() => {
    stryMutAct_9fa48("4673") ? cyRef.current.elements().removeClass('highlighted dimmed') : (stryCov_9fa48("4673"), cyRef.current?.elements().removeClass('highlighted dimmed'));
  }, stryMutAct_9fa48("4675") ? ["Stryker was here"] : (stryCov_9fa48("4675"), []));
  return <div className={cn('relative w-full h-full bg-gray-50 rounded-lg overflow-hidden', className)}>
      {/* Graph container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Controls */}
      <div className="absolute bottom-4 left-4 flex gap-2 bg-white rounded-lg shadow-lg p-1">
        <button onClick={zoomIn} className="p-2 hover:bg-gray-100 rounded transition-colors" title="Zoom In">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <button onClick={zoomOut} className="p-2 hover:bg-gray-100 rounded transition-colors" title="Zoom Out">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
          </svg>
        </button>
        <div className="w-px bg-gray-200" />
        <button onClick={fitToScreen} className="p-2 hover:bg-gray-100 rounded transition-colors" title="Fit to Screen">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
        <button onClick={resetView} className="p-2 hover:bg-gray-100 rounded transition-colors" title="Reset View">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3">
        <h4 className="text-xs font-semibold text-gray-500 mb-2">LEGEND</h4>
        <div className="space-y-1">
          {stryMutAct_9fa48("4678") ? Object.entries(nodeColors).slice(0, 5).map(([type, color]) => <div key={type} className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full" style={{
            backgroundColor: color
          }} />
              <span className="text-gray-600">{type}</span>
            </div>) : stryMutAct_9fa48("4677") ? Object.entries(nodeColors).filter(([k]) => k !== 'default').map(([type, color]) => <div key={type} className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full" style={{
            backgroundColor: color
          }} />
              <span className="text-gray-600">{type}</span>
            </div>) : (stryCov_9fa48("4677", "4678"), Object.entries(nodeColors).filter(stryMutAct_9fa48("4679") ? () => undefined : (stryCov_9fa48("4679"), ([k]) => stryMutAct_9fa48("4682") ? k === 'default' : stryMutAct_9fa48("4681") ? false : stryMutAct_9fa48("4680") ? true : (stryCov_9fa48("4680", "4681", "4682"), k !== 'default'))).slice(0, 5).map(stryMutAct_9fa48("4684") ? () => undefined : (stryCov_9fa48("4684"), ([type, color]) => <div key={type} className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full" style={stryMutAct_9fa48("4685") ? {} : (stryCov_9fa48("4685"), {
            backgroundColor: color
          })} />
              <span className="text-gray-600">{type}</span>
            </div>)))}
        </div>
      </div>
    </div>;
};
export default GraphCanvas;