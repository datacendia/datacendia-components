// @ts-nocheck
// =============================================================================
// DATACENDIA - LIVE DEMO MODE PAGE
// Connect to customer data in real-time during demos
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
import { cn } from '../../../../lib/utils';
import { api } from '../../../lib/api';
import { AVAILABLE_CONNECTORS } from '../../../components/cortex/DataSourceSelector';
const CONNECTORS = stryMutAct_9fa48("46500") ? AVAILABLE_CONNECTORS.map(connector => ({
  id: connector.id || connector.type.toLowerCase(),
  name: connector.name,
  icon: connector.icon,
  color: connector.color || 'bg-blue-500'
})) : (stryCov_9fa48("46500"), AVAILABLE_CONNECTORS.filter(stryMutAct_9fa48("46501") ? () => undefined : (stryCov_9fa48("46501"), connector => connector.oauth)).map(stryMutAct_9fa48("46502") ? () => undefined : (stryCov_9fa48("46502"), connector => stryMutAct_9fa48("46503") ? {} : (stryCov_9fa48("46503"), {
  id: stryMutAct_9fa48("46506") ? connector.id && connector.type.toLowerCase() : stryMutAct_9fa48("46505") ? false : stryMutAct_9fa48("46504") ? true : (stryCov_9fa48("46504", "46505", "46506"), connector.id || (stryMutAct_9fa48("46507") ? connector.type.toUpperCase() : (stryCov_9fa48("46507"), connector.type.toLowerCase()))),
  name: connector.name,
  icon: connector.icon,
  color: stryMutAct_9fa48("46510") ? connector.color && 'bg-blue-500' : stryMutAct_9fa48("46509") ? false : stryMutAct_9fa48("46508") ? true : (stryCov_9fa48("46508", "46509", "46510"), connector.color || 'bg-blue-500')
}))));
interface Session {
  id: string;
  status: 'pending' | 'connected' | 'active';
  connector: string;
  dataIngested: {
    progress: number;
    recordsScanned: number;
    contextBuilt: boolean;
  };
}
export const LiveDemoPage: React.FC = () => {
  const [selectedConnector, setSelectedConnector] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isConnecting, setIsConnecting] = useState(stryMutAct_9fa48("46513") ? true : (stryCov_9fa48("46513"), false));
  const [question, setQuestion] = useState('');
  const [deliberationResult, setDeliberationResult] = useState<any>(null);
  const [isDeliberating, setIsDeliberating] = useState(stryMutAct_9fa48("46515") ? true : (stryCov_9fa48("46515"), false));
  const startSession = async () => {
    if (stryMutAct_9fa48("46519") ? false : stryMutAct_9fa48("46518") ? true : stryMutAct_9fa48("46517") ? selectedConnector : (stryCov_9fa48("46517", "46518", "46519"), !selectedConnector)) {
      return;
    }
    setIsConnecting(stryMutAct_9fa48("46521") ? false : (stryCov_9fa48("46521"), true));
    try {
      const res = await api.post<any>('/premium/live-demo/session', stryMutAct_9fa48("46524") ? {} : (stryCov_9fa48("46524"), {
        connector: selectedConnector,
        tier: 'enterprise'
      }));
      const payload = res as any;
      if (stryMutAct_9fa48("46528") ? payload.success || payload.session : stryMutAct_9fa48("46527") ? false : stryMutAct_9fa48("46526") ? true : (stryCov_9fa48("46526", "46527", "46528"), payload.success && payload.session)) {
        setSession(payload.session as Session);
        // Simulate OAuth callback after 2s for demo
        setTimeout(stryMutAct_9fa48("46530") ? () => undefined : (stryCov_9fa48("46530"), () => simulateConnection(payload.session.id)), 2000);
      }
    } catch (err) {
      console.error('Failed to start session:', err);
    }
  };
  const simulateConnection = async (sessionId: string) => {
    try {
      const res = await api.post<any>('/premium/live-demo/connect', stryMutAct_9fa48("46536") ? {} : (stryCov_9fa48("46536"), {
        sessionId,
        authCode: 'demo-auth-code'
      }));
      const payload = res as any;
      if (stryMutAct_9fa48("46540") ? payload.success || payload.session : stryMutAct_9fa48("46539") ? false : stryMutAct_9fa48("46538") ? true : (stryCov_9fa48("46538", "46539", "46540"), payload.success && payload.session)) {
        setSession(payload.session as Session);
        setIsConnecting(stryMutAct_9fa48("46542") ? true : (stryCov_9fa48("46542"), false));
      }
    } catch (err) {
      console.error('Connection failed:', err);
      setIsConnecting(stryMutAct_9fa48("46545") ? true : (stryCov_9fa48("46545"), false));
    }
  };
  const runDeliberation = async () => {
    if (stryMutAct_9fa48("46549") ? !question.trim() && !selectedConnector : stryMutAct_9fa48("46548") ? false : stryMutAct_9fa48("46547") ? true : (stryCov_9fa48("46547", "46548", "46549"), (stryMutAct_9fa48("46550") ? question.trim() : (stryCov_9fa48("46550"), !(stryMutAct_9fa48("46551") ? question : (stryCov_9fa48("46551"), question.trim())))) || (stryMutAct_9fa48("46552") ? selectedConnector : (stryCov_9fa48("46552"), !selectedConnector)))) {
      return;
    }
    setIsDeliberating(stryMutAct_9fa48("46554") ? false : (stryCov_9fa48("46554"), true));
    try {
      const res = await api.post<any>('/premium/live-demo/deliberate', stryMutAct_9fa48("46557") ? {} : (stryCov_9fa48("46557"), {
        connector: selectedConnector,
        question,
        tier: 'enterprise'
      }));
      const payload = res as any;
      if (stryMutAct_9fa48("46561") ? payload.success || payload.result : stryMutAct_9fa48("46560") ? false : stryMutAct_9fa48("46559") ? true : (stryCov_9fa48("46559", "46560", "46561"), payload.success && payload.result)) {
        setDeliberationResult(payload.result);
      }
    } catch (err) {
      console.error('Deliberation failed:', err);
    } finally {
      setIsDeliberating(stryMutAct_9fa48("46566") ? true : (stryCov_9fa48("46566"), false));
    }
  };
  return <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">⚡</span>
          <h1 className="text-3xl font-bold text-neutral-900">Live Demo Mode</h1>
        </div>
        <p className="text-neutral-600 text-lg">
          Connect to YOUR data right now and run a real deliberation.
        </p>
      </div>

      {(stryMutAct_9fa48("46569") ? !session?.status && session.status === 'pending' : stryMutAct_9fa48("46568") ? false : stryMutAct_9fa48("46567") ? true : (stryCov_9fa48("46567", "46568", "46569"), (stryMutAct_9fa48("46570") ? session?.status : (stryCov_9fa48("46570"), !(stryMutAct_9fa48("46571") ? session.status : (stryCov_9fa48("46571"), session?.status)))) || (stryMutAct_9fa48("46573") ? session.status !== 'pending' : stryMutAct_9fa48("46572") ? false : (stryCov_9fa48("46572", "46573"), session.status === 'pending')))) ? <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Connector Selection */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Select a Data Source
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {CONNECTORS.map(stryMutAct_9fa48("46575") ? () => undefined : (stryCov_9fa48("46575"), connector => <button key={connector.id} onClick={stryMutAct_9fa48("46576") ? () => undefined : (stryCov_9fa48("46576"), () => setSelectedConnector(connector.id))} className={cn('p-4 rounded-lg border text-left transition-all', (stryMutAct_9fa48("46580") ? selectedConnector !== connector.id : stryMutAct_9fa48("46579") ? false : stryMutAct_9fa48("46578") ? true : (stryCov_9fa48("46578", "46579", "46580"), selectedConnector === connector.id)) ? 'border-yellow-500 bg-yellow-50 ring-2 ring-yellow-200' : 'border-neutral-200 hover:border-neutral-300')}>
                  <div className="flex items-center gap-3">
                    <span className={cn('w-10 h-10 rounded-lg flex items-center justify-center text-xl', connector.color, 'text-white')}>
                      {connector.icon}
                    </span>
                    <span className="font-medium">{connector.name}</span>
                  </div>
                </button>))}
            </div>

            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h3 className="font-medium text-amber-800 flex items-center gap-2">
                🔐 Read-Only Access
              </h3>
              <ul className="mt-2 text-sm text-amber-700 space-y-1">
                <li>• No write permissions requested</li>
                <li>• Session expires in 30 minutes</li>
                <li>• Data is not stored after session</li>
              </ul>
            </div>

            <button onClick={startSession} disabled={stryMutAct_9fa48("46587") ? !selectedConnector && isConnecting : stryMutAct_9fa48("46586") ? false : stryMutAct_9fa48("46585") ? true : (stryCov_9fa48("46585", "46586", "46587"), (stryMutAct_9fa48("46588") ? selectedConnector : (stryCov_9fa48("46588"), !selectedConnector)) || isConnecting)} className={cn('w-full mt-6 py-3 px-4 rounded-lg font-medium text-white', 'bg-gradient-to-r from-yellow-500 to-amber-500', 'hover:from-yellow-600 hover:to-amber-600', 'disabled:opacity-50 disabled:cursor-not-allowed', 'transition-all shadow-sm hover:shadow-md')}>
              {isConnecting ? 'Connecting...' : '⚡ Connect & Start Demo'}
            </button>
          </div>

          {/* How it Works */}
          <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-8">
            <h3 className="text-xl font-semibold text-neutral-900 mb-6">
              How Live Demo Mode Works
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700 font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900">OAuth Connect</h4>
                  <p className="text-sm text-neutral-600">
                    Grant read-only access to one of your systems
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700 font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900">Data Ingestion</h4>
                  <p className="text-sm text-neutral-600">
                    We scan your data and build context in seconds
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700 font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900">Ask Your Question</h4>
                  <p className="text-sm text-neutral-600">
                    Run a real Council deliberation on YOUR data
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700 font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900">See Real Results</h4>
                  <p className="text-sm text-neutral-600">
                    AI agents analyze YOUR actual business context
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div> : <div className="space-y-6">
          {/* Connected Status */}
          <div className="bg-green-50 rounded-xl border border-green-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                  ✓
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-green-800">
                    Connected to {stryMutAct_9fa48("46596") ? CONNECTORS.find(c => c.id === selectedConnector).name : (stryCov_9fa48("46596"), CONNECTORS.find(stryMutAct_9fa48("46597") ? () => undefined : (stryCov_9fa48("46597"), c => stryMutAct_9fa48("46600") ? c.id !== selectedConnector : stryMutAct_9fa48("46599") ? false : stryMutAct_9fa48("46598") ? true : (stryCov_9fa48("46598", "46599", "46600"), c.id === selectedConnector)))?.name)}
                  </h2>
                  <p className="text-green-600">
                    {session.dataIngested.recordsScanned.toLocaleString()} records indexed
                  </p>
                </div>
              </div>
              <div className="text-sm text-green-600">
                Session expires in 28 minutes
              </div>
            </div>
          </div>

          {/* Question Input */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Ask Your Question
            </h2>
            <div className="space-y-4">
              <textarea value={question} onChange={stryMutAct_9fa48("46601") ? () => undefined : (stryCov_9fa48("46601"), e => setQuestion(e.target.value))} placeholder="e.g., Which enterprise deals should we focus on this quarter?" className="w-full h-24 px-4 py-3 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-yellow-500" />
              <button onClick={runDeliberation} disabled={stryMutAct_9fa48("46604") ? !question.trim() && isDeliberating : stryMutAct_9fa48("46603") ? false : stryMutAct_9fa48("46602") ? true : (stryCov_9fa48("46602", "46603", "46604"), (stryMutAct_9fa48("46605") ? question.trim() : (stryCov_9fa48("46605"), !(stryMutAct_9fa48("46606") ? question : (stryCov_9fa48("46606"), question.trim())))) || isDeliberating)} className={cn('w-full py-3 px-4 rounded-lg font-medium text-white', 'bg-gradient-to-r from-yellow-500 to-amber-500', 'hover:from-yellow-600 hover:to-amber-600', 'disabled:opacity-50 disabled:cursor-not-allowed')}>
                {isDeliberating ? 'Running Deliberation...' : '🚀 Run Council Deliberation'}
              </button>
            </div>
          </div>

          {/* Deliberation Results */}
          {stryMutAct_9fa48("46615") ? deliberationResult || <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                Deliberation Results
              </h2>
              
              <div className="mb-4 p-3 bg-neutral-50 rounded-lg">
                <div className="text-sm text-neutral-500">
                  Analyzed {deliberationResult.dataPointsAnalyzed.toLocaleString()} data points in{' '}
                  {(deliberationResult.duration / 1000).toFixed(1)}s
                </div>
              </div>

              <div className="prose prose-neutral max-w-none">
                <p>{deliberationResult.synthesis}</p>
              </div>

              {deliberationResult.realDataHighlights?.length > 0 && <div className="mt-6">
                  <h3 className="font-medium text-neutral-900 mb-3">Your Data Highlights</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {deliberationResult.realDataHighlights.map((highlight: any, idx: number) => <div key={idx} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="text-sm font-medium text-yellow-800">{highlight.name}</div>
                        <div className="text-lg font-bold text-yellow-900">{highlight.value}</div>
                        <div className="text-xs text-yellow-700">{highlight.context}</div>
                      </div>)}
                  </div>
                </div>}
            </div> : stryMutAct_9fa48("46614") ? false : stryMutAct_9fa48("46613") ? true : (stryCov_9fa48("46613", "46614", "46615"), deliberationResult && <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                Deliberation Results
              </h2>
              
              <div className="mb-4 p-3 bg-neutral-50 rounded-lg">
                <div className="text-sm text-neutral-500">
                  Analyzed {deliberationResult.dataPointsAnalyzed.toLocaleString()} data points in{' '}
                  {(stryMutAct_9fa48("46617") ? deliberationResult.duration * 1000 : (stryCov_9fa48("46617"), deliberationResult.duration / 1000)).toFixed(1)}s
                </div>
              </div>

              <div className="prose prose-neutral max-w-none">
                <p>{deliberationResult.synthesis}</p>
              </div>

              {stryMutAct_9fa48("46620") ? deliberationResult.realDataHighlights?.length > 0 || <div className="mt-6">
                  <h3 className="font-medium text-neutral-900 mb-3">Your Data Highlights</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {deliberationResult.realDataHighlights.map((highlight: any, idx: number) => <div key={idx} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="text-sm font-medium text-yellow-800">{highlight.name}</div>
                        <div className="text-lg font-bold text-yellow-900">{highlight.value}</div>
                        <div className="text-xs text-yellow-700">{highlight.context}</div>
                      </div>)}
                  </div>
                </div> : stryMutAct_9fa48("46619") ? false : stryMutAct_9fa48("46618") ? true : (stryCov_9fa48("46618", "46619", "46620"), (stryMutAct_9fa48("46623") ? deliberationResult.realDataHighlights?.length <= 0 : stryMutAct_9fa48("46622") ? deliberationResult.realDataHighlights?.length >= 0 : stryMutAct_9fa48("46621") ? true : (stryCov_9fa48("46621", "46622", "46623"), (stryMutAct_9fa48("46624") ? deliberationResult.realDataHighlights.length : (stryCov_9fa48("46624"), deliberationResult.realDataHighlights?.length)) > 0)) && <div className="mt-6">
                  <h3 className="font-medium text-neutral-900 mb-3">Your Data Highlights</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {deliberationResult.realDataHighlights.map(stryMutAct_9fa48("46625") ? () => undefined : (stryCov_9fa48("46625"), (highlight: any, idx: number) => <div key={idx} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="text-sm font-medium text-yellow-800">{highlight.name}</div>
                        <div className="text-lg font-bold text-yellow-900">{highlight.value}</div>
                        <div className="text-xs text-yellow-700">{highlight.context}</div>
                      </div>))}
                  </div>
                </div>)}
            </div>)}
        </div>}
    </div>;
};
export default LiveDemoPage;