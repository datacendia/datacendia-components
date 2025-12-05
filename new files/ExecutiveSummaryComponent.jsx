import React, { useState, useMemo } from 'react';

/**
 * Executive Summary Component
 * 
 * Displays a collapsible summary at the top of deliberations
 * with options to share in different formats
 */

// Helper to format confidence display
function ConfidenceBadge({ confidence }) {
  const { score, level } = confidence;
  const colors = {
    high: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/50' },
    medium: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50' },
    low: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/50' },
    'very low': { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/50' },
    'not specified': { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/50' }
  };
  
  const style = colors[level] || colors['not specified'];
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text} border ${style.border}`}>
      {score ? `${score}% confidence` : level}
    </span>
  );
}

// Helper to format risk display
function RiskBadge({ score }) {
  if (!score) return null;
  
  const level = score <= 3 ? 'low' : score <= 6 ? 'medium' : 'high';
  const colors = {
    low: { bg: 'bg-green-500/20', text: 'text-green-400' },
    medium: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
    high: { bg: 'bg-red-500/20', text: 'text-red-400' }
  };
  
  const style = colors[level];
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      Risk: {score}/10
    </span>
  );
}

// Collapsible section
function CollapsibleSection({ title, icon, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border-b border-slate-700/50 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 text-left hover:bg-slate-800/30 transition-colors"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <span>{icon}</span>
          {title}
        </span>
        <svg 
          className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-3 pl-6">
          {children}
        </div>
      )}
    </div>
  );
}

// Share Menu Component
function ShareMenu({ summaryData, onClose }) {
  const [copied, setCopied] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('tldr');

  const formats = {
    tldr: {
      name: 'TL;DR',
      icon: '⚡',
      description: 'Ultra-short summary',
      generate: () => {
        const conf = summaryData.confidence.score ? `${summaryData.confidence.score}%` : summaryData.confidence.level;
        let text = `TL;DR: ${summaryData.decision} (${conf} confidence)`;
        if (summaryData.actionItems[0]) {
          text += `\n\nNext: ${summaryData.actionItems[0].action}`;
        }
        return text;
      }
    },
    executive: {
      name: 'Executive Summary',
      icon: '📊',
      description: 'Full formatted summary',
      generate: () => {
        let text = `EXECUTIVE SUMMARY\n${'='.repeat(40)}\n\n`;
        text += `DECISION: ${summaryData.decision}\n\n`;
        text += `Confidence: ${summaryData.confidence.score || summaryData.confidence.level}\n`;
        if (summaryData.riskScore) text += `Risk: ${summaryData.riskScore}/10\n`;
        text += `\n`;
        
        if (summaryData.keyFindings.length > 0) {
          text += `KEY FINDINGS:\n`;
          summaryData.keyFindings.forEach((f, i) => text += `${i + 1}. ${f}\n`);
          text += `\n`;
        }
        
        if (summaryData.risks.length > 0) {
          text += `RISKS:\n`;
          summaryData.risks.forEach((r, i) => text += `${i + 1}. ${r}\n`);
          text += `\n`;
        }
        
        if (summaryData.actionItems.length > 0) {
          text += `ACTION ITEMS:\n`;
          summaryData.actionItems.forEach((a, i) => text += `${i + 1}. ${a.action} (${a.owner})\n`);
        }
        
        return text;
      }
    },
    slack: {
      name: 'Slack',
      icon: '💬',
      description: 'Slack-formatted message',
      generate: () => {
        let text = `*🏛️ Council Decision*\n\n`;
        text += `>${summaryData.decision}\n\n`;
        text += `*Confidence:* ${summaryData.confidence.score || summaryData.confidence.level}`;
        if (summaryData.riskScore) text += ` | *Risk:* ${summaryData.riskScore}/10`;
        text += `\n`;
        
        if (summaryData.actionItems.length > 0) {
          text += `\n*Action Items:*\n`;
          summaryData.actionItems.slice(0, 3).forEach(a => {
            text += `• ${a.action}${a.owner !== 'TBD' ? ` → _${a.owner}_` : ''}\n`;
          });
        }
        
        return text;
      }
    },
    email: {
      name: 'Email',
      icon: '📧',
      description: 'Email-ready format',
      generate: () => {
        let text = `Subject: Council Decision - ${summaryData.decision.substring(0, 50)}...\n\n`;
        text += `Hi Team,\n\n`;
        text += `The Council has completed its deliberation.\n\n`;
        text += `DECISION: ${summaryData.decision}\n\n`;
        text += `CONFIDENCE: ${summaryData.confidence.score || summaryData.confidence.level}\n`;
        if (summaryData.riskScore) text += `RISK LEVEL: ${summaryData.riskScore}/10\n`;
        
        if (summaryData.actionItems.length > 0) {
          text += `\nACTION ITEMS:\n`;
          summaryData.actionItems.forEach((a, i) => {
            text += `${i + 1}. ${a.action} (Owner: ${a.owner})\n`;
          });
        }
        
        text += `\nBest,\nThe Council`;
        return text;
      }
    },
    json: {
      name: 'JSON',
      icon: '{ }',
      description: 'Structured data format',
      generate: () => JSON.stringify({
        decision: summaryData.decision,
        confidence: summaryData.confidence,
        risk: summaryData.riskScore,
        findings: summaryData.keyFindings,
        risks: summaryData.risks,
        actions: summaryData.actionItems
      }, null, 2)
    }
  };

  const handleCopy = async (format) => {
    const text = formats[format].generate();
    await navigator.clipboard.writeText(text);
    setCopied(format);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-xl border border-slate-800 w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-white">Share Summary</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4">
          {/* Format selector */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {Object.entries(formats).map(([key, format]) => (
              <button
                key={key}
                onClick={() => setSelectedFormat(key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedFormat === key 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>{format.icon}</span>
                <span className="text-sm">{format.name}</span>
              </button>
            ))}
          </div>

          {/* Preview */}
          <div className="mb-4">
            <div className="text-xs text-slate-500 mb-2">{formats[selectedFormat].description}</div>
            <pre className="p-4 bg-slate-800 rounded-lg text-sm text-slate-300 overflow-x-auto max-h-64 whitespace-pre-wrap font-mono">
              {formats[selectedFormat].generate()}
            </pre>
          </div>

          {/* Copy button */}
          <button
            onClick={() => handleCopy(selectedFormat)}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              copied === selectedFormat
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {copied === selectedFormat ? '✓ Copied!' : `Copy ${formats[selectedFormat].name} to Clipboard`}
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Executive Summary Component
export function ExecutiveSummary({ 
  summaryData, 
  deliberationLength,
  isExpanded = true,
  onToggleExpand,
  showShareButton = true 
}) {
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Estimate reading time for full deliberation
  const readingTime = useMemo(() => {
    const wordsPerMinute = 200;
    const minutes = Math.ceil(deliberationLength / wordsPerMinute);
    return minutes;
  }, [deliberationLength]);

  if (!summaryData) return null;

  return (
    <>
      <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 rounded-xl border border-slate-700 overflow-hidden mb-4">
        {/* Header - Always visible */}
        <div 
          className="p-4 cursor-pointer hover:bg-slate-800/30 transition-colors"
          onClick={onToggleExpand}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📋</span>
                <h3 className="font-semibold text-white">Executive Summary</h3>
                <span className="text-xs text-slate-500">
                  ({readingTime} min read for full deliberation)
                </span>
              </div>
              
              {/* Decision - Always shown */}
              <p className="text-white font-medium mb-2 line-clamp-2">
                {summaryData.decision}
              </p>
              
              {/* Quick metrics */}
              <div className="flex flex-wrap gap-2">
                <ConfidenceBadge confidence={summaryData.confidence} />
                <RiskBadge score={summaryData.riskScore} />
                <span className="px-2 py-1 rounded-full text-xs bg-slate-700 text-slate-400">
                  {summaryData.agentCount} agents
                </span>
                <span className="px-2 py-1 rounded-full text-xs bg-slate-700 text-slate-400">
                  {summaryData.duration}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {showShareButton && (
                <button
                  onClick={(e) => { e.stopPropagation(); setShowShareMenu(true); }}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                  title="Share summary"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              )}
              <svg 
                className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Expanded content */}
        {isExpanded && (
          <div className="px-4 pb-4 border-t border-slate-700/50">
            {/* Key Findings */}
            {summaryData.keyFindings.length > 0 && (
              <CollapsibleSection title="Key Findings" icon="🔍" defaultOpen={true}>
                <ul className="space-y-1">
                  {summaryData.keyFindings.map((finding, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-slate-500">•</span>
                      {finding}
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>
            )}

            {/* Risks */}
            {summaryData.risks.length > 0 && (
              <CollapsibleSection title="Risks" icon="⚠️">
                <ul className="space-y-1">
                  {summaryData.risks.map((risk, i) => (
                    <li key={i} className="text-sm text-yellow-400/80 flex items-start gap-2">
                      <span>⚠️</span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>
            )}

            {/* Action Items */}
            {summaryData.actionItems.length > 0 && (
              <CollapsibleSection title="Action Items" icon="✅" defaultOpen={true}>
                <ul className="space-y-2">
                  {summaryData.actionItems.map((action, i) => (
                    <li key={i} className="text-sm flex items-start justify-between gap-2 bg-slate-800/50 p-2 rounded">
                      <span className="text-slate-300">{action.action}</span>
                      {action.owner !== 'TBD' && (
                        <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded whitespace-nowrap">
                          {action.owner}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>
            )}

            {/* Dissenting Views */}
            {summaryData.dissentingViews.length > 0 && (
              <CollapsibleSection title="Dissenting Views" icon="💬">
                <ul className="space-y-1">
                  {summaryData.dissentingViews.map((view, i) => (
                    <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                      <span>💬</span>
                      {view}
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>
            )}

            {/* Open Questions */}
            {summaryData.unresolvedQuestions.length > 0 && (
              <CollapsibleSection title="Open Questions" icon="❓">
                <ul className="space-y-1">
                  {summaryData.unresolvedQuestions.map((q, i) => (
                    <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                      <span>❓</span>
                      {q}
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>
            )}
          </div>
        )}
      </div>

      {/* Share Menu Modal */}
      {showShareMenu && (
        <ShareMenu 
          summaryData={summaryData} 
          onClose={() => setShowShareMenu(false)} 
        />
      )}
    </>
  );
}

// Sticky Summary Bar (for when scrolling through long deliberations)
export function StickySummaryBar({ summaryData, onClick }) {
  if (!summaryData) return null;

  return (
    <div 
      className="fixed top-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-2 z-40 cursor-pointer hover:bg-slate-800/95 transition-colors"
      onClick={onClick}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-lg">📋</span>
          <p className="text-sm text-white font-medium truncate">
            {summaryData.decision}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <ConfidenceBadge confidence={summaryData.confidence} />
          <span className="text-xs text-slate-500">↑ Summary</span>
        </div>
      </div>
    </div>
  );
}

// Demo/Example Usage Component
export function ExecutiveSummaryDemo() {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Sample summary data
  const sampleSummaryData = {
    decision: "Conditional Approval - Proceed with EU expansion planning, but gate the €2.5M investment on signed LOIs totaling €500K by Feb 15",
    confidence: { score: 72, level: 'medium' },
    riskScore: 6,
    keyFindings: [
      "Market opportunity is real but timing is compressed",
      "Regulatory hurdles are significant but manageable",
      "Financial returns depend heavily on Q2 pipeline conversion",
      "Competitive window closes in 6 months"
    ],
    risks: [
      "GDPR infrastructure not ready for Q1 launch",
      "Currency exposure with EUR commitments",
      "Talent acquisition in EU market is competitive"
    ],
    actionItems: [
      { action: "Model cash flow scenarios with currency hedging", owner: "CFO" },
      { action: "Draft EU hiring plan, focus on Germany and Netherlands", owner: "COO" },
      { action: "Complete GDPR gap analysis", owner: "CISO" },
      { action: "Prioritize EU pipeline deals, weekly updates", owner: "CRO" }
    ],
    dissentingViews: [
      "CISO maintains Q1 timeline is unrealistic given GDPR requirements"
    ],
    unresolvedQuestions: [
      "What is our fallback if Q1 LOI target is not met?",
      "Should we consider acquisition vs. organic entry?"
    ],
    mode: 'war-room',
    query: 'Should we expand into the European market next quarter?',
    duration: '8.2 minutes',
    agentCount: 6,
    wordCount: 2847,
    timestamp: new Date().toISOString()
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Executive Summary Component</h1>
        
        <ExecutiveSummary 
          summaryData={sampleSummaryData}
          deliberationLength={sampleSummaryData.wordCount}
          isExpanded={isExpanded}
          onToggleExpand={() => setIsExpanded(!isExpanded)}
        />

        {/* Placeholder for full deliberation */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Full Deliberation</h2>
          <p className="text-slate-400 text-sm">
            The complete deliberation would appear here ({sampleSummaryData.wordCount} words)...
          </p>
          <div className="mt-4 space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-24 bg-slate-800/50 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExecutiveSummary;
