// =============================================================================
// DATACENDIA - REGULATORY INSTANT-ABSORB PAGE
// Upload any regulation and the Council learns it in seconds
// =============================================================================

import React, { useState, useCallback } from 'react';
import { cn } from '../../../../lib/utils';

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
    penalties: { violation: string; maxPenalty: string }[];
  };
  extractedRequirements: { title: string; category: string; severity: string }[];
  agentUpdates: { agentName: string; knowledgeAdded: string[]; updateStatus: string }[];
}

export const RegulatoryAbsorbPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AbsorptionResult | null>(null);
  const [inputMode, setInputMode] = useState<'file' | 'paste'>('paste');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  const absorbDocument = async () => {
    if (!textContent.trim() && !file) {return;}

    setIsProcessing(true);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(p + Math.random() * 15, 95));
    }, 500);

    try {
      let content = textContent;
      
      if (file) {
        content = await file.text();
      }

      const response = await fetch('/api/v1/premium/regulatory/absorb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document: {
            filename: file?.name || 'pasted-document.txt',
            mimeType: file?.type || 'text/plain',
            size: content.length,
            content,
          },
          tier: 'enterprise',
        }),
      });

      const data = await response.json();
      
      clearInterval(progressInterval);
      setProgress(100);

      if (data.success) {
        setResult(data.result);
      }
    } catch (err) {
      console.error('Absorption failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
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

      {!result ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setInputMode('paste')}
                  className={cn(
                    'px-4 py-2 rounded-lg font-medium text-sm',
                    inputMode === 'paste'
                      ? 'bg-teal-100 text-teal-700'
                      : 'bg-neutral-100 text-neutral-600'
                  )}
                >
                  Paste Text
                </button>
                <button
                  onClick={() => setInputMode('file')}
                  className={cn(
                    'px-4 py-2 rounded-lg font-medium text-sm',
                    inputMode === 'file'
                      ? 'bg-teal-100 text-teal-700'
                      : 'bg-neutral-100 text-neutral-600'
                  )}
                >
                  Upload File
                </button>
              </div>

              {inputMode === 'paste' ? (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Paste Regulatory Text
                  </label>
                  <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Paste the regulatory document content here..."
                    className="w-full h-64 px-4 py-3 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-teal-500 font-mono text-sm"
                  />
                  <p className="text-xs text-neutral-500 mt-2">
                    {textContent.split(/\s+/).filter(Boolean).length} words
                  </p>
                </div>
              ) : (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className={cn(
                    'border-2 border-dashed rounded-lg p-12 text-center',
                    'transition-colors cursor-pointer',
                    file ? 'border-teal-500 bg-teal-50' : 'border-neutral-300 hover:border-neutral-400'
                  )}
                >
                  {file ? (
                    <div>
                      <div className="text-4xl mb-2">📄</div>
                      <div className="font-medium text-neutral-900">{file.name}</div>
                      <div className="text-sm text-neutral-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </div>
                      <button
                        onClick={() => setFile(null)}
                        className="mt-3 text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="text-4xl mb-2">📤</div>
                      <div className="font-medium text-neutral-900">
                        Drop your document here
                      </div>
                      <div className="text-sm text-neutral-500 mt-1">
                        or click to browse
                      </div>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.txt,.doc,.docx"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={absorbDocument}
                disabled={isProcessing || (!textContent.trim() && !file)}
                className={cn(
                  'w-full mt-6 py-3 px-4 rounded-lg font-medium text-white',
                  'bg-gradient-to-r from-teal-500 to-emerald-500',
                  'hover:from-teal-600 hover:to-emerald-600',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'transition-all shadow-sm hover:shadow-md'
                )}
              >
                {isProcessing ? 'Absorbing...' : '📜 Absorb Regulation'}
              </button>

              {isProcessing && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-neutral-600 mb-2">
                    <span>Processing...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className="bg-teal-500 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Example Documents */}
          <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">
              Supported Document Types
            </h3>
            <div className="space-y-3">
              {[
                { icon: '🇪🇺', name: 'EU AI Act 2024', pages: 892, time: '47s' },
                { icon: '🏥', name: 'HIPAA Guidelines', pages: 234, time: '18s' },
                { icon: '📊', name: 'SOX Compliance', pages: 156, time: '12s' },
                { icon: '🔒', name: 'GDPR Requirements', pages: 88, time: '8s' },
                { icon: '📋', name: 'Internal Policies', pages: 45, time: '4s' },
              ].map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{doc.icon}</span>
                    <div>
                      <div className="font-medium text-neutral-900">{doc.name}</div>
                      <div className="text-sm text-neutral-500">{doc.pages} pages</div>
                    </div>
                  </div>
                  <div className="text-teal-600 font-medium">{doc.time}</div>
                </div>
              ))}
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
        </div>
      ) : (
        <div className="space-y-6">
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
              <button
                onClick={() => {
                  setResult(null);
                  setTextContent('');
                  setFile(null);
                }}
                className="px-4 py-2 text-teal-600 hover:text-teal-700 font-medium"
              >
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
              {result.agentUpdates.map((update, idx) => (
                <div key={idx} className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-green-800">{update.agentName}</span>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                      {update.updateStatus}
                    </span>
                  </div>
                  <ul className="text-sm text-green-700 space-y-1">
                    {update.knowledgeAdded.slice(0, 3).map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Extracted Requirements ({result.extractedRequirements.length})
            </h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {result.extractedRequirements.map((req, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div className="flex-1">
                    <span className="font-medium text-neutral-900">{req.title}</span>
                    <span className="ml-2 text-xs text-neutral-500 uppercase">{req.category}</span>
                  </div>
                  <span className={cn(
                    'px-2 py-1 rounded text-xs font-medium',
                    getSeverityColor(req.severity)
                  )}>
                    {req.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Penalties */}
          {result.summary.penalties.length > 0 && (
            <div className="bg-red-50 rounded-xl border border-red-200 p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-4">
                ⚠️ Penalties for Non-Compliance
              </h3>
              <div className="space-y-2">
                {result.summary.penalties.map((penalty, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-lg border border-red-100">
                    <span className="font-mono text-red-700">{penalty.maxPenalty}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 bg-teal-100 rounded-xl border border-teal-200 text-center">
            <p className="text-teal-800 font-medium">
              ✅ All future deliberations will incorporate these regulatory constraints
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegulatoryAbsorbPage;
