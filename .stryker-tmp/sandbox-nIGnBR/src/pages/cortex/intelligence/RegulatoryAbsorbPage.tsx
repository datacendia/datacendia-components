// @ts-nocheck
// =============================================================================
// DATACENDIA - REGULATORY INSTANT-ABSORB PAGE
// Upload any regulation and the Council learns it in seconds
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
import React, { useState, useCallback } from 'react';
import { cn } from '../../../../lib/utils';
import { api } from '../../../lib/api';
interface AbsorptionResult {
  id: string;
  documentName: string;
  processingTime: number;
  summary: {
    totalPages: number;
    totalWords: number;
    requirementsExtracted: number;
    triggersIdentified: number;
    processesAffected: number;
    agentsUpdated: number;
    constraintsCreated: number;
    penalties: {
      violation: string;
      maxPenalty: string;
    }[];
  };
  extractedRequirements: {
    title: string;
    category: string;
    severity: string;
  }[];
  agentUpdates: {
    agentName: string;
    knowledgeAdded: string[];
    updateStatus: string;
  }[];
}
export const RegulatoryAbsorbPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(stryMutAct_9fa48("46951") ? true : (stryCov_9fa48("46951"), false));
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AbsorptionResult | null>(null);
  const [inputMode, setInputMode] = useState<'file' | 'paste'>('paste');
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (stryMutAct_9fa48("46956") ? e.target.files || e.target.files[0] : stryMutAct_9fa48("46955") ? false : stryMutAct_9fa48("46954") ? true : (stryCov_9fa48("46954", "46955", "46956"), e.target.files && e.target.files[0])) {
      setFile(e.target.files[0]);
    }
  };
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (stryMutAct_9fa48("46961") ? e.dataTransfer.files || e.dataTransfer.files[0] : stryMutAct_9fa48("46960") ? false : stryMutAct_9fa48("46959") ? true : (stryCov_9fa48("46959", "46960", "46961"), e.dataTransfer.files && e.dataTransfer.files[0])) {
      setFile(e.dataTransfer.files[0]);
    }
  }, stryMutAct_9fa48("46963") ? ["Stryker was here"] : (stryCov_9fa48("46963"), []));
  const absorbDocument = async () => {
    if (stryMutAct_9fa48("46967") ? !textContent.trim() || !file : stryMutAct_9fa48("46966") ? false : stryMutAct_9fa48("46965") ? true : (stryCov_9fa48("46965", "46966", "46967"), (stryMutAct_9fa48("46968") ? textContent.trim() : (stryCov_9fa48("46968"), !(stryMutAct_9fa48("46969") ? textContent : (stryCov_9fa48("46969"), textContent.trim())))) && (stryMutAct_9fa48("46970") ? file : (stryCov_9fa48("46970"), !file)))) {
      return;
    }
    setIsProcessing(stryMutAct_9fa48("46972") ? false : (stryCov_9fa48("46972"), true));
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(stryMutAct_9fa48("46974") ? () => undefined : (stryCov_9fa48("46974"), p => stryMutAct_9fa48("46975") ? Math.max(p + Math.random() * 15, 95) : (stryCov_9fa48("46975"), Math.min(stryMutAct_9fa48("46976") ? p - Math.random() * 15 : (stryCov_9fa48("46976"), p + (stryMutAct_9fa48("46977") ? Math.random() / 15 : (stryCov_9fa48("46977"), Math.random() * 15))), 95))));
    }, 500);
    try {
      let content = textContent;
      if (stryMutAct_9fa48("46980") ? false : stryMutAct_9fa48("46979") ? true : (stryCov_9fa48("46979", "46980"), file)) {
        content = await file.text();
      }
      const res = await api.post<any>('/premium/regulatory/absorb', stryMutAct_9fa48("46983") ? {} : (stryCov_9fa48("46983"), {
        document: stryMutAct_9fa48("46984") ? {} : (stryCov_9fa48("46984"), {
          filename: stryMutAct_9fa48("46987") ? file?.name && 'pasted-document.txt' : stryMutAct_9fa48("46986") ? false : stryMutAct_9fa48("46985") ? true : (stryCov_9fa48("46985", "46986", "46987"), (stryMutAct_9fa48("46988") ? file.name : (stryCov_9fa48("46988"), file?.name)) || 'pasted-document.txt'),
          mimeType: stryMutAct_9fa48("46992") ? file?.type && 'text/plain' : stryMutAct_9fa48("46991") ? false : stryMutAct_9fa48("46990") ? true : (stryCov_9fa48("46990", "46991", "46992"), (stryMutAct_9fa48("46993") ? file.type : (stryCov_9fa48("46993"), file?.type)) || 'text/plain'),
          size: content.length,
          content
        }),
        tier: 'enterprise'
      }));
      clearInterval(progressInterval);
      setProgress(100);
      const payload = res as any;
      if (stryMutAct_9fa48("46998") ? payload.success || payload.result : stryMutAct_9fa48("46997") ? false : stryMutAct_9fa48("46996") ? true : (stryCov_9fa48("46996", "46997", "46998"), payload.success && payload.result)) {
        setResult(payload.result as AbsorptionResult);
      }
    } catch (err) {
      console.error('Absorption failed:', err);
    } finally {
      setIsProcessing(stryMutAct_9fa48("47003") ? true : (stryCov_9fa48("47003"), false));
    }
  };
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        if (stryMutAct_9fa48("47005")) {} else {
          stryCov_9fa48("47005");
          return 'bg-red-100 text-red-700';
        }
      case 'high':
        if (stryMutAct_9fa48("47008")) {} else {
          stryCov_9fa48("47008");
          return 'bg-orange-100 text-orange-700';
        }
      case 'medium':
        if (stryMutAct_9fa48("47011")) {} else {
          stryCov_9fa48("47011");
          return 'bg-yellow-100 text-yellow-700';
        }
      case 'low':
        if (stryMutAct_9fa48("47014")) {} else {
          stryCov_9fa48("47014");
          return 'bg-green-100 text-green-700';
        }
      default:
        if (stryMutAct_9fa48("47017")) {} else {
          stryCov_9fa48("47017");
          return 'bg-gray-100 text-gray-700';
        }
    }
  };
  return <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">📜</span>
          <h1 className="text-3xl font-bold text-neutral-900">Regulatory Instant-Absorb</h1>
        </div>
        <p className="text-neutral-600 text-lg">
          Drop in any regulation. The Council knows it in 60 seconds.
        </p>
      </div>

      {(stryMutAct_9fa48("47019") ? result : (stryCov_9fa48("47019"), !result)) ? <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
              <div className="flex gap-2 mb-4">
                <button onClick={stryMutAct_9fa48("47020") ? () => undefined : (stryCov_9fa48("47020"), () => setInputMode('paste'))} className={cn('px-4 py-2 rounded-lg font-medium text-sm', (stryMutAct_9fa48("47025") ? inputMode !== 'paste' : stryMutAct_9fa48("47024") ? false : stryMutAct_9fa48("47023") ? true : (stryCov_9fa48("47023", "47024", "47025"), inputMode === 'paste')) ? 'bg-teal-100 text-teal-700' : 'bg-neutral-100 text-neutral-600')}>
                  Paste Text
                </button>
                <button onClick={stryMutAct_9fa48("47029") ? () => undefined : (stryCov_9fa48("47029"), () => setInputMode('file'))} className={cn('px-4 py-2 rounded-lg font-medium text-sm', (stryMutAct_9fa48("47034") ? inputMode !== 'file' : stryMutAct_9fa48("47033") ? false : stryMutAct_9fa48("47032") ? true : (stryCov_9fa48("47032", "47033", "47034"), inputMode === 'file')) ? 'bg-teal-100 text-teal-700' : 'bg-neutral-100 text-neutral-600')}>
                  Upload File
                </button>
              </div>

              {(stryMutAct_9fa48("47040") ? inputMode !== 'paste' : stryMutAct_9fa48("47039") ? false : stryMutAct_9fa48("47038") ? true : (stryCov_9fa48("47038", "47039", "47040"), inputMode === 'paste')) ? <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Paste Regulatory Text
                  </label>
                  <textarea value={textContent} onChange={stryMutAct_9fa48("47042") ? () => undefined : (stryCov_9fa48("47042"), e => setTextContent(e.target.value))} placeholder="Paste the regulatory document content here..." className="w-full h-64 px-4 py-3 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-teal-500 font-mono text-sm" />
                  <p className="text-xs text-neutral-500 mt-2">
                    {stryMutAct_9fa48("47043") ? textContent.split(/\s+/).length : (stryCov_9fa48("47043"), textContent.split(stryMutAct_9fa48("47045") ? /\S+/ : stryMutAct_9fa48("47044") ? /\s/ : (stryCov_9fa48("47044", "47045"), /\s+/)).filter(Boolean).length)} words
                  </p>
                </div> : <div onDrop={handleDrop} onDragOver={stryMutAct_9fa48("47046") ? () => undefined : (stryCov_9fa48("47046"), e => e.preventDefault())} className={cn('border-2 border-dashed rounded-lg p-12 text-center', 'transition-colors cursor-pointer', file ? 'border-teal-500 bg-teal-50' : 'border-neutral-300 hover:border-neutral-400')}>
                  {file ? <div>
                      <div className="text-4xl mb-2">📄</div>
                      <div className="font-medium text-neutral-900">{file.name}</div>
                      <div className="text-sm text-neutral-500">
                        {(stryMutAct_9fa48("47051") ? file.size * 1024 : (stryCov_9fa48("47051"), file.size / 1024)).toFixed(1)} KB
                      </div>
                      <button onClick={stryMutAct_9fa48("47052") ? () => undefined : (stryCov_9fa48("47052"), () => setFile(null))} className="mt-3 text-sm text-red-600 hover:text-red-700">
                        Remove
                      </button>
                    </div> : <div>
                      <div className="text-4xl mb-2">📤</div>
                      <div className="font-medium text-neutral-900">
                        Drop your document here
                      </div>
                      <div className="text-sm text-neutral-500 mt-1">
                        or click to browse
                      </div>
                      <input type="file" onChange={handleFileChange} accept=".pdf,.txt,.doc,.docx" className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>}
                </div>}

              <button onClick={absorbDocument} disabled={stryMutAct_9fa48("47055") ? isProcessing && !textContent.trim() && !file : stryMutAct_9fa48("47054") ? false : stryMutAct_9fa48("47053") ? true : (stryCov_9fa48("47053", "47054", "47055"), isProcessing || (stryMutAct_9fa48("47057") ? !textContent.trim() || !file : stryMutAct_9fa48("47056") ? false : (stryCov_9fa48("47056", "47057"), (stryMutAct_9fa48("47058") ? textContent.trim() : (stryCov_9fa48("47058"), !(stryMutAct_9fa48("47059") ? textContent : (stryCov_9fa48("47059"), textContent.trim())))) && (stryMutAct_9fa48("47060") ? file : (stryCov_9fa48("47060"), !file)))))} className={cn('w-full mt-6 py-3 px-4 rounded-lg font-medium text-white', 'bg-gradient-to-r from-teal-500 to-emerald-500', 'hover:from-teal-600 hover:to-emerald-600', 'disabled:opacity-50 disabled:cursor-not-allowed', 'transition-all shadow-sm hover:shadow-md')}>
                {isProcessing ? 'Absorbing...' : '📜 Absorb Regulation'}
              </button>

              {stryMutAct_9fa48("47070") ? isProcessing || <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-neutral-600 mb-2">
                    <span>Processing...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div className="bg-teal-500 h-2 rounded-full transition-all" style={{
                width: `${progress}%`
              }} />
                  </div>
                </div> : stryMutAct_9fa48("47069") ? false : stryMutAct_9fa48("47068") ? true : (stryCov_9fa48("47068", "47069", "47070"), isProcessing && <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-neutral-600 mb-2">
                    <span>Processing...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div className="bg-teal-500 h-2 rounded-full transition-all" style={stryMutAct_9fa48("47071") ? {} : (stryCov_9fa48("47071"), {
                width: `${progress}%`
              })} />
                  </div>
                </div>)}
            </div>
          </div>

          {/* Example Documents */}
          <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">
              Supported Document Types
            </h3>
            <div className="space-y-3">
              {(stryMutAct_9fa48("47073") ? [] : (stryCov_9fa48("47073"), [stryMutAct_9fa48("47074") ? {} : (stryCov_9fa48("47074"), {
            icon: '🇪🇺',
            name: 'EU AI Act 2024',
            pages: 892,
            time: '47s'
          }), stryMutAct_9fa48("47078") ? {} : (stryCov_9fa48("47078"), {
            icon: '🏥',
            name: 'HIPAA Guidelines',
            pages: 234,
            time: '18s'
          }), stryMutAct_9fa48("47082") ? {} : (stryCov_9fa48("47082"), {
            icon: '📊',
            name: 'SOX Compliance',
            pages: 156,
            time: '12s'
          }), stryMutAct_9fa48("47086") ? {} : (stryCov_9fa48("47086"), {
            icon: '🔒',
            name: 'GDPR Requirements',
            pages: 88,
            time: '8s'
          }), stryMutAct_9fa48("47090") ? {} : (stryCov_9fa48("47090"), {
            icon: '📋',
            name: 'Internal Policies',
            pages: 45,
            time: '4s'
          })])).map(stryMutAct_9fa48("47094") ? () => undefined : (stryCov_9fa48("47094"), (doc, idx) => <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{doc.icon}</span>
                    <div>
                      <div className="font-medium text-neutral-900">{doc.name}</div>
                      <div className="text-sm text-neutral-500">{doc.pages} pages</div>
                    </div>
                  </div>
                  <div className="text-teal-600 font-medium">{doc.time}</div>
                </div>))}
            </div>

            <div className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
              <h4 className="font-medium text-teal-800 mb-2">🧠 What Happens</h4>
              <ul className="text-sm text-teal-700 space-y-1">
                <li>• Extracts regulatory requirements</li>
                <li>• Identifies compliance triggers</li>
                <li>• Maps to company processes</li>
                <li>• Updates all Council agents</li>
                <li>• Creates decision constraints</li>
              </ul>
            </div>
          </div>
        </div> : <div className="space-y-6">
          {/* Success Header */}
          <div className="bg-teal-50 rounded-xl border border-teal-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center text-3xl">
                  ✓
                </div>
                <div>
                  <h2 className="text-xl font-bold text-teal-800">
                    {result.documentName} Absorbed
                  </h2>
                  <p className="text-teal-600">
                    Processed in {result.processingTime.toFixed(1)} seconds
                  </p>
                </div>
              </div>
              <button onClick={() => {
            setResult(null);
            setTextContent('');
            setFile(null);
          }} className="px-4 py-2 text-teal-600 hover:text-teal-700 font-medium">
                ← Absorb Another
              </button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
              <div className="text-3xl font-bold text-teal-600">
                {result.summary.requirementsExtracted}
              </div>
              <div className="text-sm text-neutral-500">Requirements</div>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">
                {result.summary.triggersIdentified}
              </div>
              <div className="text-sm text-neutral-500">Triggers</div>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
              <div className="text-3xl font-bold text-purple-600">
                {result.summary.processesAffected}
              </div>
              <div className="text-sm text-neutral-500">Processes</div>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
              <div className="text-3xl font-bold text-green-600">
                {result.summary.agentsUpdated}
              </div>
              <div className="text-sm text-neutral-500">Agents Updated</div>
            </div>
          </div>

          {/* Agent Updates */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              🧠 The Council Now Knows
            </h3>
            <div className="space-y-3">
              {result.agentUpdates.map(stryMutAct_9fa48("47097") ? () => undefined : (stryCov_9fa48("47097"), (update, idx) => <div key={idx} className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-green-800">{update.agentName}</span>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                      {update.updateStatus}
                    </span>
                  </div>
                  <ul className="text-sm text-green-700 space-y-1">
                    {stryMutAct_9fa48("47098") ? update.knowledgeAdded.map((item, i) => <li key={i}>• {item}</li>) : (stryCov_9fa48("47098"), update.knowledgeAdded.slice(0, 3).map(stryMutAct_9fa48("47099") ? () => undefined : (stryCov_9fa48("47099"), (item, i) => <li key={i}>• {item}</li>)))}
                  </ul>
                </div>))}
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Extracted Requirements ({result.extractedRequirements.length})
            </h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {result.extractedRequirements.map(stryMutAct_9fa48("47100") ? () => undefined : (stryCov_9fa48("47100"), (req, idx) => <div key={idx} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div className="flex-1">
                    <span className="font-medium text-neutral-900">{req.title}</span>
                    <span className="ml-2 text-xs text-neutral-500 uppercase">{req.category}</span>
                  </div>
                  <span className={cn('px-2 py-1 rounded text-xs font-medium', getSeverityColor(req.severity))}>
                    {req.severity}
                  </span>
                </div>))}
            </div>
          </div>

          {/* Penalties */}
          {stryMutAct_9fa48("47104") ? result.summary.penalties.length > 0 || <div className="bg-red-50 rounded-xl border border-red-200 p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-4">
                ⚠️ Penalties for Non-Compliance
              </h3>
              <div className="space-y-2">
                {result.summary.penalties.map((penalty, idx) => <div key={idx} className="p-3 bg-white rounded-lg border border-red-100">
                    <span className="font-mono text-red-700">{penalty.maxPenalty}</span>
                  </div>)}
              </div>
            </div> : stryMutAct_9fa48("47103") ? false : stryMutAct_9fa48("47102") ? true : (stryCov_9fa48("47102", "47103", "47104"), (stryMutAct_9fa48("47107") ? result.summary.penalties.length <= 0 : stryMutAct_9fa48("47106") ? result.summary.penalties.length >= 0 : stryMutAct_9fa48("47105") ? true : (stryCov_9fa48("47105", "47106", "47107"), result.summary.penalties.length > 0)) && <div className="bg-red-50 rounded-xl border border-red-200 p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-4">
                ⚠️ Penalties for Non-Compliance
              </h3>
              <div className="space-y-2">
                {result.summary.penalties.map(stryMutAct_9fa48("47108") ? () => undefined : (stryCov_9fa48("47108"), (penalty, idx) => <div key={idx} className="p-3 bg-white rounded-lg border border-red-100">
                    <span className="font-mono text-red-700">{penalty.maxPenalty}</span>
                  </div>))}
              </div>
            </div>)}

          <div className="p-4 bg-teal-100 rounded-xl border border-teal-200 text-center">
            <p className="text-teal-800 font-medium">
              ✅ All future deliberations will incorporate these regulatory constraints
            </p>
          </div>
        </div>}
    </div>;
};
export default RegulatoryAbsorbPage;