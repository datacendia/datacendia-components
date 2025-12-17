// @ts-nocheck
// =============================================================================
// EXECUTIVE SUMMARY - Deliberation Summary Component
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
import { ChevronDown, ChevronUp, Copy, Download, Share2, CheckCircle, AlertTriangle, Clock, Users, FileText, Check } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { CouncilModeBadge } from './CouncilModeSelector';
export interface ActionItem {
  action: string;
  owner: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
}
export interface ExecutiveSummaryData {
  decision: string;
  confidence: {
    score: number;
    level: string;
  };
  keyInsights: string[];
  risks: Array<{
    description: string;
    severity: number;
  }>;
  actionItems: ActionItem[];
  dissent?: string;
  mode: string;
  processingTime: number;
  agentCount: number;
}
interface ExecutiveSummaryProps {
  data: ExecutiveSummaryData;
  isExpanded?: boolean;
  onToggle?: () => void;
  className?: string;
}
function ConfidenceBadge({
  confidence
}: {
  confidence: {
    score: number;
    level: string;
  };
}) {
  const colors: Record<string, {
    bg: string;
    text: string;
    border: string;
  }> = stryMutAct_9fa48("3420") ? {} : (stryCov_9fa48("3420"), {
    high: stryMutAct_9fa48("3421") ? {} : (stryCov_9fa48("3421"), {
      bg: 'bg-green-500/20',
      text: 'text-green-400',
      border: 'border-green-500/50'
    }),
    medium: stryMutAct_9fa48("3425") ? {} : (stryCov_9fa48("3425"), {
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-400',
      border: 'border-yellow-500/50'
    }),
    low: stryMutAct_9fa48("3429") ? {} : (stryCov_9fa48("3429"), {
      bg: 'bg-red-500/20',
      text: 'text-red-400',
      border: 'border-red-500/50'
    })
  });
  const level = (stryMutAct_9fa48("3436") ? confidence.score < 80 : stryMutAct_9fa48("3435") ? confidence.score > 80 : stryMutAct_9fa48("3434") ? false : stryMutAct_9fa48("3433") ? true : (stryCov_9fa48("3433", "3434", "3435", "3436"), confidence.score >= 80)) ? 'high' : (stryMutAct_9fa48("3441") ? confidence.score < 60 : stryMutAct_9fa48("3440") ? confidence.score > 60 : stryMutAct_9fa48("3439") ? false : stryMutAct_9fa48("3438") ? true : (stryCov_9fa48("3438", "3439", "3440", "3441"), confidence.score >= 60)) ? 'medium' : 'low';
  const style = colors[level];
  return <span className={cn("px-2 py-1 rounded-full text-xs font-medium border", style.bg, style.text, style.border)}>
      {confidence.score}% confidence
    </span>;
}
function RiskBadge({
  severity
}: {
  severity: number;
}) {
  const level = (stryMutAct_9fa48("3449") ? severity > 3 : stryMutAct_9fa48("3448") ? severity < 3 : stryMutAct_9fa48("3447") ? false : stryMutAct_9fa48("3446") ? true : (stryCov_9fa48("3446", "3447", "3448", "3449"), severity <= 3)) ? 'low' : (stryMutAct_9fa48("3454") ? severity > 6 : stryMutAct_9fa48("3453") ? severity < 6 : stryMutAct_9fa48("3452") ? false : stryMutAct_9fa48("3451") ? true : (stryCov_9fa48("3451", "3452", "3453", "3454"), severity <= 6)) ? 'medium' : 'high';
  const colors: Record<string, {
    bg: string;
    text: string;
  }> = stryMutAct_9fa48("3457") ? {} : (stryCov_9fa48("3457"), {
    low: stryMutAct_9fa48("3458") ? {} : (stryCov_9fa48("3458"), {
      bg: 'bg-green-500/20',
      text: 'text-green-400'
    }),
    medium: stryMutAct_9fa48("3461") ? {} : (stryCov_9fa48("3461"), {
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-400'
    }),
    high: stryMutAct_9fa48("3464") ? {} : (stryCov_9fa48("3464"), {
      bg: 'bg-red-500/20',
      text: 'text-red-400'
    })
  });
  const style = colors[level];
  return <span className={cn("px-2 py-0.5 rounded text-xs font-medium", style.bg, style.text)}>
      {severity}/10
    </span>;
}
export function ExecutiveSummary({
  data,
  isExpanded = stryMutAct_9fa48("3468") ? false : (stryCov_9fa48("3468"), true),
  onToggle,
  className
}: ExecutiveSummaryProps) {
  const [copied, setCopied] = useState(stryMutAct_9fa48("3470") ? true : (stryCov_9fa48("3470"), false));
  const [showShareMenu, setShowShareMenu] = useState(stryMutAct_9fa48("3471") ? true : (stryCov_9fa48("3471"), false));
  const handleCopy = async (format: 'tldr' | 'full' | 'email') => {
    let text = '';
    switch (format) {
      case 'tldr':
        if (stryMutAct_9fa48("3474")) {} else {
          stryCov_9fa48("3474");
          text = `TL;DR: ${data.decision} (${data.confidence.score}% confidence)\n\nNext Action: ${stryMutAct_9fa48("3479") ? data.actionItems[0]?.action && 'N/A' : stryMutAct_9fa48("3478") ? false : stryMutAct_9fa48("3477") ? true : (stryCov_9fa48("3477", "3478", "3479"), (stryMutAct_9fa48("3480") ? data.actionItems[0].action : (stryCov_9fa48("3480"), data.actionItems[0]?.action)) || 'N/A')}`;
          break;
        }
      case 'email':
        if (stryMutAct_9fa48("3482")) {} else {
          stryCov_9fa48("3482");
          text = `Subject: Council Decision Summary\n\n${data.decision}\n\nConfidence: ${data.confidence.score}%\n\nKey Insights:\n${data.keyInsights.map(stryMutAct_9fa48("3485") ? () => undefined : (stryCov_9fa48("3485"), i => `• ${i}`)).join('\n')}\n\nNext Steps:\n${data.actionItems.map(stryMutAct_9fa48("3488") ? () => undefined : (stryCov_9fa48("3488"), a => `• ${a.action} (${a.owner}, by ${a.deadline})`)).join('\n')}`;
          break;
        }
      case 'full':
      default:
        if (stryMutAct_9fa48("3492")) {} else {
          stryCov_9fa48("3492");
          text = JSON.stringify(data, null, 2);
        }
    }
    await navigator.clipboard.writeText(text);
    setCopied(stryMutAct_9fa48("3493") ? false : (stryCov_9fa48("3493"), true));
    setTimeout(stryMutAct_9fa48("3494") ? () => undefined : (stryCov_9fa48("3494"), () => setCopied(stryMutAct_9fa48("3495") ? true : (stryCov_9fa48("3495"), false))), 2000);
  };
  return <div className={cn("bg-slate-900 border border-slate-700 rounded-xl overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={onToggle}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <FileText className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Executive Summary</h3>
            <div className="flex items-center gap-2 mt-1">
              <CouncilModeBadge modeId={data.mode} />
              <ConfidenceBadge confidence={data.confidence} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-slate-400">
            <Users className="w-4 h-4" />
            <span>{data.agentCount} agents</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-slate-400">
            <Clock className="w-4 h-4" />
            <span>{(stryMutAct_9fa48("3497") ? data.processingTime * 1000 : (stryCov_9fa48("3497"), data.processingTime / 1000)).toFixed(1)}s</span>
          </div>
          {stryMutAct_9fa48("3500") ? onToggle || (isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />) : stryMutAct_9fa48("3499") ? false : stryMutAct_9fa48("3498") ? true : (stryCov_9fa48("3498", "3499", "3500"), onToggle && (isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />))}
        </div>
      </div>

      {/* Content */}
      {stryMutAct_9fa48("3503") ? isExpanded || <div className="border-t border-slate-700 p-4 space-y-4">
          {/* Decision */}
          <div>
            <h4 className="text-sm font-medium text-slate-400 mb-2">Decision</h4>
            <p className="text-white text-lg leading-relaxed">{data.decision}</p>
          </div>

          {/* Key Insights */}
          {data.keyInsights.length > 0 && <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">Key Insights</h4>
              <ul className="space-y-2">
                {data.keyInsights.map((insight, i) => <li key={i} className="flex items-start gap-2 text-slate-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>{insight}</span>
                  </li>)}
              </ul>
            </div>}

          {/* Risks */}
          {data.risks.length > 0 && <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">Identified Risks</h4>
              <ul className="space-y-2">
                {data.risks.map((risk, i) => <li key={i} className="flex items-start justify-between gap-2 text-slate-300 bg-slate-800/50 rounded-lg p-2">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <span>{risk.description}</span>
                    </div>
                    <RiskBadge severity={risk.severity} />
                  </li>)}
              </ul>
            </div>}

          {/* Action Items */}
          {data.actionItems.length > 0 && <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">Action Items</h4>
              <div className="space-y-2">
                {data.actionItems.map((item, i) => <div key={i} className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2 h-2 rounded-full", item.priority === 'high' ? 'bg-red-400' : item.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400')} />
                      <div>
                        <div className="text-white">{item.action}</div>
                        <div className="text-sm text-slate-400">{item.owner}</div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-400">{item.deadline}</div>
                  </div>)}
              </div>
            </div>}

          {/* Dissent */}
          {data.dissent && <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
              <h4 className="text-sm font-medium text-amber-400 mb-1">Dissenting View</h4>
              <p className="text-slate-300 text-sm">{data.dissent}</p>
            </div>}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-700">
            <button onClick={() => handleCopy('tldr')} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors">
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy TL;DR'}
            </button>
            <button onClick={() => handleCopy('email')} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors">
              <Share2 className="w-4 h-4" />
              Email Format
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors">
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div> : stryMutAct_9fa48("3502") ? false : stryMutAct_9fa48("3501") ? true : (stryCov_9fa48("3501", "3502", "3503"), isExpanded && <div className="border-t border-slate-700 p-4 space-y-4">
          {/* Decision */}
          <div>
            <h4 className="text-sm font-medium text-slate-400 mb-2">Decision</h4>
            <p className="text-white text-lg leading-relaxed">{data.decision}</p>
          </div>

          {/* Key Insights */}
          {stryMutAct_9fa48("3506") ? data.keyInsights.length > 0 || <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">Key Insights</h4>
              <ul className="space-y-2">
                {data.keyInsights.map((insight, i) => <li key={i} className="flex items-start gap-2 text-slate-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>{insight}</span>
                  </li>)}
              </ul>
            </div> : stryMutAct_9fa48("3505") ? false : stryMutAct_9fa48("3504") ? true : (stryCov_9fa48("3504", "3505", "3506"), (stryMutAct_9fa48("3509") ? data.keyInsights.length <= 0 : stryMutAct_9fa48("3508") ? data.keyInsights.length >= 0 : stryMutAct_9fa48("3507") ? true : (stryCov_9fa48("3507", "3508", "3509"), data.keyInsights.length > 0)) && <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">Key Insights</h4>
              <ul className="space-y-2">
                {data.keyInsights.map(stryMutAct_9fa48("3510") ? () => undefined : (stryCov_9fa48("3510"), (insight, i) => <li key={i} className="flex items-start gap-2 text-slate-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>{insight}</span>
                  </li>))}
              </ul>
            </div>)}

          {/* Risks */}
          {stryMutAct_9fa48("3513") ? data.risks.length > 0 || <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">Identified Risks</h4>
              <ul className="space-y-2">
                {data.risks.map((risk, i) => <li key={i} className="flex items-start justify-between gap-2 text-slate-300 bg-slate-800/50 rounded-lg p-2">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <span>{risk.description}</span>
                    </div>
                    <RiskBadge severity={risk.severity} />
                  </li>)}
              </ul>
            </div> : stryMutAct_9fa48("3512") ? false : stryMutAct_9fa48("3511") ? true : (stryCov_9fa48("3511", "3512", "3513"), (stryMutAct_9fa48("3516") ? data.risks.length <= 0 : stryMutAct_9fa48("3515") ? data.risks.length >= 0 : stryMutAct_9fa48("3514") ? true : (stryCov_9fa48("3514", "3515", "3516"), data.risks.length > 0)) && <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">Identified Risks</h4>
              <ul className="space-y-2">
                {data.risks.map(stryMutAct_9fa48("3517") ? () => undefined : (stryCov_9fa48("3517"), (risk, i) => <li key={i} className="flex items-start justify-between gap-2 text-slate-300 bg-slate-800/50 rounded-lg p-2">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <span>{risk.description}</span>
                    </div>
                    <RiskBadge severity={risk.severity} />
                  </li>))}
              </ul>
            </div>)}

          {/* Action Items */}
          {stryMutAct_9fa48("3520") ? data.actionItems.length > 0 || <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">Action Items</h4>
              <div className="space-y-2">
                {data.actionItems.map((item, i) => <div key={i} className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2 h-2 rounded-full", item.priority === 'high' ? 'bg-red-400' : item.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400')} />
                      <div>
                        <div className="text-white">{item.action}</div>
                        <div className="text-sm text-slate-400">{item.owner}</div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-400">{item.deadline}</div>
                  </div>)}
              </div>
            </div> : stryMutAct_9fa48("3519") ? false : stryMutAct_9fa48("3518") ? true : (stryCov_9fa48("3518", "3519", "3520"), (stryMutAct_9fa48("3523") ? data.actionItems.length <= 0 : stryMutAct_9fa48("3522") ? data.actionItems.length >= 0 : stryMutAct_9fa48("3521") ? true : (stryCov_9fa48("3521", "3522", "3523"), data.actionItems.length > 0)) && <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">Action Items</h4>
              <div className="space-y-2">
                {data.actionItems.map(stryMutAct_9fa48("3524") ? () => undefined : (stryCov_9fa48("3524"), (item, i) => <div key={i} className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2 h-2 rounded-full", (stryMutAct_9fa48("3528") ? item.priority !== 'high' : stryMutAct_9fa48("3527") ? false : stryMutAct_9fa48("3526") ? true : (stryCov_9fa48("3526", "3527", "3528"), item.priority === 'high')) ? 'bg-red-400' : (stryMutAct_9fa48("3533") ? item.priority !== 'medium' : stryMutAct_9fa48("3532") ? false : stryMutAct_9fa48("3531") ? true : (stryCov_9fa48("3531", "3532", "3533"), item.priority === 'medium')) ? 'bg-yellow-400' : 'bg-green-400')} />
                      <div>
                        <div className="text-white">{item.action}</div>
                        <div className="text-sm text-slate-400">{item.owner}</div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-400">{item.deadline}</div>
                  </div>))}
              </div>
            </div>)}

          {/* Dissent */}
          {stryMutAct_9fa48("3539") ? data.dissent || <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
              <h4 className="text-sm font-medium text-amber-400 mb-1">Dissenting View</h4>
              <p className="text-slate-300 text-sm">{data.dissent}</p>
            </div> : stryMutAct_9fa48("3538") ? false : stryMutAct_9fa48("3537") ? true : (stryCov_9fa48("3537", "3538", "3539"), data.dissent && <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
              <h4 className="text-sm font-medium text-amber-400 mb-1">Dissenting View</h4>
              <p className="text-slate-300 text-sm">{data.dissent}</p>
            </div>)}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-700">
            <button onClick={stryMutAct_9fa48("3540") ? () => undefined : (stryCov_9fa48("3540"), () => handleCopy('tldr'))} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors">
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy TL;DR'}
            </button>
            <button onClick={stryMutAct_9fa48("3544") ? () => undefined : (stryCov_9fa48("3544"), () => handleCopy('email'))} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors">
              <Share2 className="w-4 h-4" />
              Email Format
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors">
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>)}
    </div>;
}
export default ExecutiveSummary;