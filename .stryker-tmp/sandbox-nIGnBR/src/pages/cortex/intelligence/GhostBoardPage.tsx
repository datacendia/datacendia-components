// @ts-nocheck
// =============================================================================
// DATACENDIA - GHOST BOARD PAGE
// Rehearse board meetings with AI directors
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
import { decisionIntelligenceService, GhostBoardResult, BoardQuestion } from '../../../services/DecisionIntelligenceService';
import { ollamaService } from '../../../lib/ollama';

// Types imported from service

const BOARD_TYPES = stryMutAct_9fa48("46320") ? [] : (stryCov_9fa48("46320"), [stryMutAct_9fa48("46321") ? {} : (stryCov_9fa48("46321"), {
  id: 'standard',
  name: 'Standard Board',
  description: 'Mixed independent and investor directors',
  tooltip: 'Balanced perspective with governance focus and strategic oversight.'
}), stryMutAct_9fa48("46326") ? {} : (stryCov_9fa48("46326"), {
  id: 'vc_backed',
  name: 'VC-Backed',
  description: 'Aggressive growth-focused investors',
  tooltip: 'Fast growth, burn vs runway, market size, competitive edge.'
}), stryMutAct_9fa48("46331") ? {} : (stryCov_9fa48("46331"), {
  id: 'public_company',
  name: 'Public Company',
  description: 'Governance and compliance focused',
  tooltip: 'Compliance, predictability, risk and downside protection.'
}), stryMutAct_9fa48("46336") ? {} : (stryCov_9fa48("46336"), {
  id: 'private_equity',
  name: 'Private Equity',
  description: 'Operations and returns focused',
  tooltip: 'Cash flow, leverage, covenant risk, exit timing.'
})]);
const DIFFICULTY_LEVELS = stryMutAct_9fa48("46341") ? [] : (stryCov_9fa48("46341"), [stryMutAct_9fa48("46342") ? {} : (stryCov_9fa48("46342"), {
  id: 'easy',
  name: 'Warm-Up',
  description: 'Friendly questions',
  tooltip: 'Supportive, coaching tone.'
}), stryMutAct_9fa48("46347") ? {} : (stryCov_9fa48("46347"), {
  id: 'medium',
  name: 'Standard',
  description: 'Typical board scrutiny',
  tooltip: 'Realistic but fair.'
}), stryMutAct_9fa48("46352") ? {} : (stryCov_9fa48("46352"), {
  id: 'hard',
  name: 'Challenging',
  description: 'Tough questions',
  tooltip: 'Skeptical, detail-oriented.'
}), stryMutAct_9fa48("46357") ? {} : (stryCov_9fa48("46357"), {
  id: 'brutal',
  name: 'Brutal',
  description: 'Worst case scenario',
  tooltip: 'Hostile activist / down-round scenario.'
})]);
const PROPOSAL_PLACEHOLDER = `We're proposing a $5M increase in annual AI infra spend to move Datacendia from hybrid to fully sovereign over the next 18 months...

Current State: Currently running 60% on cloud providers with 40% on-prem.

Ask: $5M capital expenditure + $1.2M annual OpEx increase.

Timeline: 18-month implementation with Q2 2026 full sovereignty.`;
export const GhostBoardPage: React.FC = () => {
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalContent, setProposalContent] = useState('');
  const [boardType, setBoardType] = useState('standard');
  const [difficulty, setDifficulty] = useState('hard');
  const [isRunning, setIsRunning] = useState(stryMutAct_9fa48("46368") ? true : (stryCov_9fa48("46368"), false));
  const [result, setResult] = useState<GhostBoardResult | null>(null);
  const [ollamaStatus, setOllamaStatus] = useState(stryMutAct_9fa48("46369") ? {} : (stryCov_9fa48("46369"), {
    available: stryMutAct_9fa48("46370") ? true : (stryCov_9fa48("46370"), false)
  }));

  // Check Ollama status on mount
  React.useEffect(() => {
    setOllamaStatus(ollamaService.getStatus());
  }, stryMutAct_9fa48("46372") ? ["Stryker was here"] : (stryCov_9fa48("46372"), []));
  const [selectedQuestion, setSelectedQuestion] = useState<BoardQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const runSession = async () => {
    if (stryMutAct_9fa48("46377") ? !proposalTitle.trim() && !proposalContent.trim() : stryMutAct_9fa48("46376") ? false : stryMutAct_9fa48("46375") ? true : (stryCov_9fa48("46375", "46376", "46377"), (stryMutAct_9fa48("46378") ? proposalTitle.trim() : (stryCov_9fa48("46378"), !(stryMutAct_9fa48("46379") ? proposalTitle : (stryCov_9fa48("46379"), proposalTitle.trim())))) || (stryMutAct_9fa48("46380") ? proposalContent.trim() : (stryCov_9fa48("46380"), !(stryMutAct_9fa48("46381") ? proposalContent : (stryCov_9fa48("46381"), proposalContent.trim())))))) {
      return;
    }
    setIsRunning(stryMutAct_9fa48("46383") ? false : (stryCov_9fa48("46383"), true));
    try {
      // Use real Decision Intelligence Service with Ollama
      const sessionResult = await decisionIntelligenceService.runGhostBoard(proposalTitle, proposalContent, boardType, difficulty);
      setResult(sessionResult);
    } catch (err) {
      console.error('Session failed:', err);
    } finally {
      setIsRunning(stryMutAct_9fa48("46388") ? true : (stryCov_9fa48("46388"), false));
    }
  };
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy':
        if (stryMutAct_9fa48("46390")) {} else {
          stryCov_9fa48("46390");
          return 'bg-green-100 text-green-700';
        }
      case 'medium':
        if (stryMutAct_9fa48("46393")) {} else {
          stryCov_9fa48("46393");
          return 'bg-yellow-100 text-yellow-700';
        }
      case 'hard':
        if (stryMutAct_9fa48("46396")) {} else {
          stryCov_9fa48("46396");
          return 'bg-orange-100 text-orange-700';
        }
      case 'brutal':
        if (stryMutAct_9fa48("46399")) {} else {
          stryCov_9fa48("46399");
          return 'bg-red-100 text-red-700';
        }
      default:
        if (stryMutAct_9fa48("46402")) {} else {
          stryCov_9fa48("46402");
          return 'bg-gray-100 text-gray-700';
        }
    }
  };
  return <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">👻</span>
          <h1 className="text-3xl font-bold text-neutral-900">Ghost Board</h1>
        </div>
        <p className="text-neutral-600 text-lg">
          Rehearse your board meeting with AI directors before the real one.
        </p>
        <p className="text-sm text-neutral-500 mt-2 flex items-center gap-2">
          <span className="text-purple-500">📋</span>
          Ghost Board sessions are automatically logged to Decision DNA and Chronos.
          <span className="text-xs text-neutral-400">(marked as rehearsal)</span>
        </p>
      </div>

      {(stryMutAct_9fa48("46404") ? result : (stryCov_9fa48("46404"), !result)) ? <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Setup Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Your Proposal</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Proposal Title *
                  </label>
                  <input type="text" value={proposalTitle} onChange={stryMutAct_9fa48("46405") ? () => undefined : (stryCov_9fa48("46405"), e => setProposalTitle(e.target.value))} placeholder="e.g., AI Infrastructure Investment Proposal" className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-purple-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Proposal Content *
                  </label>
                  <p className="text-xs text-neutral-500 mb-2">
                    Include: current state, what you're asking for (e.g., $ amount, headcount, strategy change), and the time horizon.
                  </p>
                  <textarea value={proposalContent} onChange={stryMutAct_9fa48("46406") ? () => undefined : (stryCov_9fa48("46406"), e => setProposalContent(e.target.value))} placeholder={PROPOSAL_PLACEHOLDER} className="w-full h-48 px-4 py-3 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-purple-500 placeholder:text-neutral-400 placeholder:text-sm" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Board Configuration</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Board Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {BOARD_TYPES.map(stryMutAct_9fa48("46407") ? () => undefined : (stryCov_9fa48("46407"), type => <button key={type.id} onClick={stryMutAct_9fa48("46408") ? () => undefined : (stryCov_9fa48("46408"), () => setBoardType(type.id))} title={type.tooltip} className={cn('p-3 rounded-lg border text-left transition-all group relative', (stryMutAct_9fa48("46412") ? boardType !== type.id : stryMutAct_9fa48("46411") ? false : stryMutAct_9fa48("46410") ? true : (stryCov_9fa48("46410", "46411", "46412"), boardType === type.id)) ? 'border-purple-500 bg-purple-50' : 'border-neutral-200 hover:border-neutral-300')}>
                        <div className="font-medium text-sm">{type.name}</div>
                        <div className="text-xs text-neutral-500">{type.description}</div>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-neutral-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                          {type.tooltip}
                        </div>
                      </button>))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {DIFFICULTY_LEVELS.map(stryMutAct_9fa48("46415") ? () => undefined : (stryCov_9fa48("46415"), level => <button key={level.id} onClick={stryMutAct_9fa48("46416") ? () => undefined : (stryCov_9fa48("46416"), () => setDifficulty(level.id))} title={level.tooltip} className={cn('p-2 rounded-lg border text-center transition-all group relative', (stryMutAct_9fa48("46420") ? difficulty !== level.id : stryMutAct_9fa48("46419") ? false : stryMutAct_9fa48("46418") ? true : (stryCov_9fa48("46418", "46419", "46420"), difficulty === level.id)) ? 'border-purple-500 bg-purple-50' : 'border-neutral-200 hover:border-neutral-300')}>
                        <div className="font-medium text-sm">{level.name}</div>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-neutral-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                          {level.tooltip}
                        </div>
                      </button>))}
                  </div>
                </div>

                <button onClick={runSession} disabled={stryMutAct_9fa48("46425") ? (isRunning || !proposalTitle) && !proposalContent : stryMutAct_9fa48("46424") ? false : stryMutAct_9fa48("46423") ? true : (stryCov_9fa48("46423", "46424", "46425"), (stryMutAct_9fa48("46427") ? isRunning && !proposalTitle : stryMutAct_9fa48("46426") ? false : (stryCov_9fa48("46426", "46427"), isRunning || (stryMutAct_9fa48("46428") ? proposalTitle : (stryCov_9fa48("46428"), !proposalTitle)))) || (stryMutAct_9fa48("46429") ? proposalContent : (stryCov_9fa48("46429"), !proposalContent)))} className={cn('w-full py-3 px-4 rounded-lg font-medium text-white', 'bg-gradient-to-r from-purple-500 to-indigo-500', 'hover:from-purple-600 hover:to-indigo-600', 'disabled:opacity-50 disabled:cursor-not-allowed', 'transition-all shadow-sm hover:shadow-md')}>
                  {isRunning ? 'Summoning Ghost Board...' : '👻 Face the Ghost Board'}
                </button>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-8">
            <div className="text-center">
              <div className="text-8xl mb-6 opacity-50">👻</div>
              <h3 className="text-xl font-semibold text-neutral-700 mb-2">
                Prepare to Face the Board
              </h3>
              <p className="text-neutral-500 mb-6">
                Your AI board members are waiting. They will challenge every assumption,
                question every number, and probe for weaknesses.
              </p>
              <div className="bg-white rounded-lg p-4 text-left">
                <h4 className="font-medium text-neutral-900 mb-2">What to Expect:</h4>
                <ul className="text-sm text-neutral-600 space-y-1">
                  <li>• 12+ challenging questions from diverse perspectives</li>
                  <li>• Suggested answers for each question</li>
                  <li>• Preparedness score and gap analysis</li>
                  <li>• Specific areas needing more preparation</li>
                  <li>• Question style and aggressiveness match your selected board type and difficulty</li>
                  <li>• A downloadable <strong>Board Prep Brief</strong> you can share with your team</li>
                </ul>
              </div>
            </div>
          </div>
        </div> : <div className="space-y-6">
          {/* Results Header */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">{result.proposalTitle}</h2>
                <p className="text-neutral-500">
                  {result.duration} minute session • {result.difficulty} difficulty
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600">
                  {result.preparednessScore}/100
                </div>
                <div className="text-sm text-neutral-500">Preparedness</div>
              </div>
            </div>

            <div className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-neutral-700">{result.overallAssessment}</p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button onClick={stryMutAct_9fa48("46437") ? () => undefined : (stryCov_9fa48("46437"), () => setResult(null))} className="px-4 py-2 text-purple-600 hover:text-purple-700 font-medium">
                ← Start New Session
              </button>
              <button onClick={() => {
            // Generate Board Prep Brief
            const brief = `# Board Prep Brief: ${result.proposalTitle}
                  
## Session Summary
- **Date**: ${new Date().toLocaleDateString()}
- **Board Type**: ${stryMutAct_9fa48("46440") ? boardType.replace('_', ' ').toLowerCase() : (stryCov_9fa48("46440"), boardType.replace('_', ' ').toUpperCase())}
- **Difficulty**: ${stryMutAct_9fa48("46443") ? difficulty.toLowerCase() : (stryCov_9fa48("46443"), difficulty.toUpperCase())}
- **Preparedness Score**: ${result.preparednessScore}/100
- **Session Type**: REHEARSAL (Ghost Board)

## Overall Assessment
${result.overallAssessment}

## Top Questions You May Struggle With
${stryMutAct_9fa48("46445") ? result.questions.slice(0, 10).map((q, i) => `${i + 1}. "${q.question}" - Asked by ${q.askedBy.name}`).join('\n') : stryMutAct_9fa48("46444") ? result.questions.filter(q => q.difficulty === 'hard' || q.difficulty === 'brutal').map((q, i) => `${i + 1}. "${q.question}" - Asked by ${q.askedBy.name}`).join('\n') : (stryCov_9fa48("46444", "46445"), result.questions.filter(stryMutAct_9fa48("46446") ? () => undefined : (stryCov_9fa48("46446"), q => stryMutAct_9fa48("46449") ? q.difficulty === 'hard' && q.difficulty === 'brutal' : stryMutAct_9fa48("46448") ? false : stryMutAct_9fa48("46447") ? true : (stryCov_9fa48("46447", "46448", "46449"), (stryMutAct_9fa48("46451") ? q.difficulty !== 'hard' : stryMutAct_9fa48("46450") ? false : (stryCov_9fa48("46450", "46451"), q.difficulty === 'hard')) || (stryMutAct_9fa48("46454") ? q.difficulty !== 'brutal' : stryMutAct_9fa48("46453") ? false : (stryCov_9fa48("46453", "46454"), q.difficulty === 'brutal'))))).slice(0, 10).map(stryMutAct_9fa48("46456") ? () => undefined : (stryCov_9fa48("46456"), (q, i) => `${stryMutAct_9fa48("46458") ? i - 1 : (stryCov_9fa48("46458"), i + 1)}. "${q.question}" - Asked by ${q.askedBy.name}`)).join('\n'))}

## Suggested Answer Improvements
${stryMutAct_9fa48("46460") ? result.questions.map((q, i) => `${i + 1}. **${q.askedBy.name}**: "${q.question}"\n   → ${q.suggestedAnswer}`).join('\n\n') : (stryCov_9fa48("46460"), result.questions.slice(0, 5).map(stryMutAct_9fa48("46461") ? () => undefined : (stryCov_9fa48("46461"), (q, i) => `${stryMutAct_9fa48("46463") ? i - 1 : (stryCov_9fa48("46463"), i + 1)}. **${q.askedBy.name}**: "${q.question}"\n   → ${q.suggestedAnswer}`)).join('\n\n'))}

## Key Gaps (Red Flags)
${result.keyGaps.map(stryMutAct_9fa48("46465") ? () => undefined : (stryCov_9fa48("46465"), g => `⚠️ ${g}`)).join('\n')}

## Strength Areas
${result.strengthAreas.map(stryMutAct_9fa48("46468") ? () => undefined : (stryCov_9fa48("46468"), s => `✓ ${s}`)).join('\n')}

---
*Generated by Datacendia Ghost Board™ | Logged to Decision DNA & Chronos*
*This is a REHEARSAL session - not an actual board deliberation*`;
            const blob = new Blob(stryMutAct_9fa48("46471") ? [] : (stryCov_9fa48("46471"), [brief]), stryMutAct_9fa48("46472") ? {} : (stryCov_9fa48("46472"), {
              type: 'text/markdown'
            }));
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `board-prep-brief-${stryMutAct_9fa48("46476") ? result.proposalTitle.toUpperCase().replace(/\s+/g, '-') : (stryCov_9fa48("46476"), result.proposalTitle.toLowerCase().replace(stryMutAct_9fa48("46478") ? /\S+/g : stryMutAct_9fa48("46477") ? /\s/g : (stryCov_9fa48("46477", "46478"), /\s+/g), '-'))}.md`;
            a.click();
            URL.revokeObjectURL(url);
          }} className="px-4 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg font-medium flex items-center gap-2">
                📄 Download Board Prep Brief
              </button>
            </div>
            
            {/* Integration Notice */}
            <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
              <p className="text-xs text-purple-700 flex items-center gap-2">
                <span>📋</span>
                <span>This session has been logged to <strong>Decision DNA</strong> and <strong>Chronos</strong> as a rehearsal artifact.</span>
              </p>
            </div>
          </div>

          {/* Board Members */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Your Board</h3>
            <div className="flex flex-wrap gap-3">
              {result.boardMembers.map(stryMutAct_9fa48("46480") ? () => undefined : (stryCov_9fa48("46480"), member => <div key={member.id} className="flex items-center gap-2 px-3 py-2 bg-neutral-50 rounded-lg">
                  <span className="text-xl">{member.icon}</span>
                  <div>
                    <div className="font-medium text-sm">{member.name}</div>
                    <div className="text-xs text-neutral-500">{member.role}</div>
                  </div>
                </div>))}
            </div>
          </div>

          {/* Questions */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Questions Your Board Will Ask ({result.questions.length})
            </h3>
            <div className="space-y-3">
              {result.questions.map(stryMutAct_9fa48("46481") ? () => undefined : (stryCov_9fa48("46481"), (question, idx) => <div key={question.id} className={cn('p-4 rounded-lg border cursor-pointer transition-all', (stryMutAct_9fa48("46485") ? selectedQuestion?.id !== question.id : stryMutAct_9fa48("46484") ? false : stryMutAct_9fa48("46483") ? true : (stryCov_9fa48("46483", "46484", "46485"), (stryMutAct_9fa48("46486") ? selectedQuestion.id : (stryCov_9fa48("46486"), selectedQuestion?.id)) === question.id)) ? 'border-purple-500 bg-purple-50' : 'border-neutral-200 hover:border-neutral-300')} onClick={stryMutAct_9fa48("46489") ? () => undefined : (stryCov_9fa48("46489"), () => setSelectedQuestion(question))}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{question.askedBy.icon}</span>
                        <span className="font-medium text-neutral-900">
                          {question.askedBy.name}
                        </span>
                        <span className={cn('px-2 py-0.5 rounded text-xs font-medium', getDifficultyColor(question.difficulty))}>
                          {question.difficulty}
                        </span>
                      </div>
                      <p className="text-neutral-700">"{question.question}"</p>
                    </div>
                    <span className="text-neutral-400">#{stryMutAct_9fa48("46491") ? idx - 1 : (stryCov_9fa48("46491"), idx + 1)}</span>
                  </div>
                  
                  {stryMutAct_9fa48("46494") ? selectedQuestion?.id === question.id || <div className="mt-4 pt-4 border-t border-purple-200">
                      <div className="text-sm font-medium text-purple-700 mb-2">
                        Suggested Answer:
                      </div>
                      <p className="text-sm text-neutral-600 bg-white p-3 rounded-lg">
                        {question.suggestedAnswer}
                      </p>
                    </div> : stryMutAct_9fa48("46493") ? false : stryMutAct_9fa48("46492") ? true : (stryCov_9fa48("46492", "46493", "46494"), (stryMutAct_9fa48("46496") ? selectedQuestion?.id !== question.id : stryMutAct_9fa48("46495") ? true : (stryCov_9fa48("46495", "46496"), (stryMutAct_9fa48("46497") ? selectedQuestion.id : (stryCov_9fa48("46497"), selectedQuestion?.id)) === question.id)) && <div className="mt-4 pt-4 border-t border-purple-200">
                      <div className="text-sm font-medium text-purple-700 mb-2">
                        Suggested Answer:
                      </div>
                      <p className="text-sm text-neutral-600 bg-white p-3 rounded-lg">
                        {question.suggestedAnswer}
                      </p>
                    </div>)}
                </div>))}
            </div>
          </div>

          {/* Gaps and Strengths */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">⚠️ Key Gaps</h3>
              <ul className="space-y-2">
                {result.keyGaps.map(stryMutAct_9fa48("46498") ? () => undefined : (stryCov_9fa48("46498"), (gap, idx) => <li key={idx} className="flex items-start gap-2 text-red-700">
                    <span>•</span>
                    <span>{gap}</span>
                  </li>))}
              </ul>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">✓ Strengths</h3>
              <ul className="space-y-2">
                {result.strengthAreas.map(stryMutAct_9fa48("46499") ? () => undefined : (stryCov_9fa48("46499"), (strength, idx) => <li key={idx} className="flex items-start gap-2 text-green-700">
                    <span>•</span>
                    <span>{strength}</span>
                  </li>))}
              </ul>
            </div>
          </div>
        </div>}
    </div>;
};
export default GhostBoardPage;