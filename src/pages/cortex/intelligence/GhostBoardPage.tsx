// =============================================================================
// DATACENDIA - GHOST BOARD PAGE
// Rehearse board meetings with AI directors
// =============================================================================

import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import { decisionIntelligenceService, GhostBoardResult, BoardQuestion } from '../../../services/DecisionIntelligenceService';
import { ollamaService } from '../../../lib/ollama';

// Types imported from service

const BOARD_TYPES = [
  { id: 'standard', name: 'Standard Board', description: 'Mixed independent and investor directors' },
  { id: 'vc_backed', name: 'VC-Backed', description: 'Aggressive growth-focused investors' },
  { id: 'public_company', name: 'Public Company', description: 'Governance and compliance focused' },
  { id: 'private_equity', name: 'Private Equity', description: 'Operations and returns focused' },
];

const DIFFICULTY_LEVELS = [
  { id: 'easy', name: 'Warm-Up', description: 'Friendly questions' },
  { id: 'medium', name: 'Standard', description: 'Typical board scrutiny' },
  { id: 'hard', name: 'Challenging', description: 'Tough questions' },
  { id: 'brutal', name: 'Brutal', description: 'Worst case scenario' },
];

export const GhostBoardPage: React.FC = () => {
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalContent, setProposalContent] = useState('');
  const [boardType, setBoardType] = useState('standard');
  const [difficulty, setDifficulty] = useState('hard');
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<GhostBoardResult | null>(null);
  const [ollamaStatus, setOllamaStatus] = useState({ available: false });

  // Check Ollama status on mount
  React.useEffect(() => {
    setOllamaStatus(ollamaService.getStatus());
  }, []);
  const [selectedQuestion, setSelectedQuestion] = useState<BoardQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');

  const runSession = async () => {
    if (!proposalTitle.trim() || !proposalContent.trim()) return;

    setIsRunning(true);
    try {
      // Use real Decision Intelligence Service with Ollama
      const sessionResult = await decisionIntelligenceService.runGhostBoard(
        proposalTitle,
        proposalContent,
        boardType,
        difficulty
      );
      setResult(sessionResult);
    } catch (err) {
      console.error('Session failed:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-orange-100 text-orange-700';
      case 'brutal': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">👻</span>
          <h1 className="text-3xl font-bold text-neutral-900">Ghost Board</h1>
        </div>
        <p className="text-neutral-600 text-lg">
          Rehearse your board meeting with AI directors before the real one.
        </p>
      </div>

      {!result ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Setup Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Your Proposal</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Proposal Title *
                  </label>
                  <input
                    type="text"
                    value={proposalTitle}
                    onChange={(e) => setProposalTitle(e.target.value)}
                    placeholder="e.g., AI Infrastructure Investment Proposal"
                    className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Proposal Content *
                  </label>
                  <textarea
                    value={proposalContent}
                    onChange={(e) => setProposalContent(e.target.value)}
                    placeholder="Describe your proposal in detail..."
                    className="w-full h-40 px-4 py-3 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-purple-500"
                  />
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
                    {BOARD_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setBoardType(type.id)}
                        className={cn(
                          'p-3 rounded-lg border text-left transition-all',
                          boardType === type.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-neutral-200 hover:border-neutral-300'
                        )}
                      >
                        <div className="font-medium text-sm">{type.name}</div>
                        <div className="text-xs text-neutral-500">{type.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {DIFFICULTY_LEVELS.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setDifficulty(level.id)}
                        className={cn(
                          'p-2 rounded-lg border text-center transition-all',
                          difficulty === level.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-neutral-200 hover:border-neutral-300'
                        )}
                      >
                        <div className="font-medium text-sm">{level.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={runSession}
                  disabled={isRunning || !proposalTitle || !proposalContent}
                  className={cn(
                    'w-full py-3 px-4 rounded-lg font-medium text-white',
                    'bg-gradient-to-r from-purple-500 to-indigo-500',
                    'hover:from-purple-600 hover:to-indigo-600',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'transition-all shadow-sm hover:shadow-md'
                  )}
                >
                  {isRunning ? 'Summoning Ghost Board...' : '👻 Start Ghost Board Session'}
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
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
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

            <button
              onClick={() => setResult(null)}
              className="mt-4 px-4 py-2 text-purple-600 hover:text-purple-700 font-medium"
            >
              ← Start New Session
            </button>
          </div>

          {/* Board Members */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Your Board</h3>
            <div className="flex flex-wrap gap-3">
              {result.boardMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-2 px-3 py-2 bg-neutral-50 rounded-lg"
                >
                  <span className="text-xl">{member.icon}</span>
                  <div>
                    <div className="font-medium text-sm">{member.name}</div>
                    <div className="text-xs text-neutral-500">{member.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Questions */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Questions Your Board Will Ask ({result.questions.length})
            </h3>
            <div className="space-y-3">
              {result.questions.map((question, idx) => (
                <div
                  key={question.id}
                  className={cn(
                    'p-4 rounded-lg border cursor-pointer transition-all',
                    selectedQuestion?.id === question.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  )}
                  onClick={() => setSelectedQuestion(question)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{question.askedBy.icon}</span>
                        <span className="font-medium text-neutral-900">
                          {question.askedBy.name}
                        </span>
                        <span className={cn(
                          'px-2 py-0.5 rounded text-xs font-medium',
                          getDifficultyColor(question.difficulty)
                        )}>
                          {question.difficulty}
                        </span>
                      </div>
                      <p className="text-neutral-700">"{question.question}"</p>
                    </div>
                    <span className="text-neutral-400">#{idx + 1}</span>
                  </div>
                  
                  {selectedQuestion?.id === question.id && (
                    <div className="mt-4 pt-4 border-t border-purple-200">
                      <div className="text-sm font-medium text-purple-700 mb-2">
                        Suggested Answer:
                      </div>
                      <p className="text-sm text-neutral-600 bg-white p-3 rounded-lg">
                        {question.suggestedAnswer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Gaps and Strengths */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">⚠️ Key Gaps</h3>
              <ul className="space-y-2">
                {result.keyGaps.map((gap, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-red-700">
                    <span>•</span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">✓ Strengths</h3>
              <ul className="space-y-2">
                {result.strengthAreas.map((strength, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-green-700">
                    <span>•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GhostBoardPage;
