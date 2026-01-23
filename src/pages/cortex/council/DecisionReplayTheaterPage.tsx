// =============================================================================
// DECISION REPLAY THEATER PAGE
// Watch past deliberations unfold like a movie
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  Film,
  Clock,
  Users,
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  Download,
  Share2,
  Maximize2,
  Volume2,
  Settings,
  FileText,
  Calendar,
  ChevronRight,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface ReplayFrame {
  id: string;
  timestamp: number;
  type: 'statement' | 'citation' | 'dissent' | 'vote' | 'consensus' | 'round_change';
  agentName?: string;
  agentRole?: string;
  content: string;
  confidence?: number;
}

interface ReplaySession {
  id: string;
  title: string;
  description: string;
  duration: number;
  frameCount: number;
  agentCount: number;
  outcome: string;
  consensusReached: boolean;
  createdAt: Date;
  councilMode: string;
}

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_SESSIONS: ReplaySession[] = [
  {
    id: '1',
    title: 'Q1 2026 Budget Allocation Strategy',
    description: 'Council deliberation on resource allocation across departments',
    duration: 847000,
    frameCount: 156,
    agentCount: 8,
    outcome: 'Approved with modifications',
    consensusReached: true,
    createdAt: new Date(Date.now() - 86400000 * 2),
    councilMode: 'strategic-planning',
  },
  {
    id: '2',
    title: 'New Product Launch Risk Assessment',
    description: 'Comprehensive risk analysis for Project Phoenix',
    duration: 623000,
    frameCount: 98,
    agentCount: 6,
    outcome: 'Proceed with caution',
    consensusReached: true,
    createdAt: new Date(Date.now() - 86400000 * 5),
    councilMode: 'risk-assessment',
  },
  {
    id: '3',
    title: 'Vendor Selection: Cloud Infrastructure',
    description: 'Evaluation of AWS vs Azure vs GCP for enterprise migration',
    duration: 1245000,
    frameCount: 234,
    agentCount: 10,
    outcome: 'Selected AWS with hybrid approach',
    consensusReached: false,
    createdAt: new Date(Date.now() - 86400000 * 7),
    councilMode: 'vendor-evaluation',
  },
];

const MOCK_FRAMES: ReplayFrame[] = [
  { id: '1', timestamp: 0, type: 'round_change', content: 'Round 1 begins' },
  { id: '2', timestamp: 5000, type: 'statement', agentName: 'CendiaChief', agentRole: 'Chief Strategist', content: 'Let\'s begin by examining the key factors driving this decision. We need to consider market conditions, resource availability, and competitive positioning.', confidence: 75 },
  { id: '3', timestamp: 15000, type: 'statement', agentName: 'CendiaCFO', agentRole: 'Financial Advisor', content: 'From a financial perspective, Option A offers better short-term ROI, but Option B has stronger long-term value creation potential.', confidence: 80 },
  { id: '4', timestamp: 25000, type: 'citation', agentName: 'CendiaCFO', content: 'Added citation: Q3 2025 Financial Analysis Report' },
  { id: '5', timestamp: 35000, type: 'statement', agentName: 'CendiaCISO', agentRole: 'Security Officer', content: 'I have concerns about the security implications of Option A. The vendor has had two data breaches in the past 18 months.', confidence: 60 },
  { id: '6', timestamp: 45000, type: 'dissent', agentName: 'CendiaCISO', content: 'Formal dissent: Security risks of Option A are unacceptable' },
  { id: '7', timestamp: 55000, type: 'statement', agentName: 'CendiaRisk', agentRole: 'Risk Analyst', content: 'Quantifying the risk: Option A carries a 23% probability of significant security incident within 24 months.', confidence: 85 },
  { id: '8', timestamp: 65000, type: 'round_change', content: 'Round 2 begins' },
  { id: '9', timestamp: 75000, type: 'statement', agentName: 'CendiaChief', agentRole: 'Chief Strategist', content: 'Given the security concerns, let\'s explore a modified approach that combines the financial benefits of Option A with the security posture of Option B.', confidence: 82 },
  { id: '10', timestamp: 85000, type: 'vote', content: 'Voting initiated on modified proposal' },
  { id: '11', timestamp: 95000, type: 'consensus', content: 'Consensus reached: Modified approach approved with 87% agreement' },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  return `${minutes}m ${seconds % 60}s`;
};

const formatTimestamp = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const DecisionReplayTheaterPage: React.FC = () => {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState<ReplaySession[]>(MOCK_SESSIONS);
  const [selectedSession, setSelectedSession] = useState<ReplaySession | null>(null);
  const [frames, setFrames] = useState<ReplayFrame[]>(MOCK_FRAMES);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const currentFrame = frames[currentFrameIndex];
  const progress = selectedSession ? (currentFrame?.timestamp || 0) / selectedSession.duration * 100 : 0;

  // Playback logic
  useEffect(() => {
    if (!isPlaying || !selectedSession) return;

    const interval = setInterval(() => {
      setCurrentFrameIndex(prev => {
        if (prev >= frames.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2000 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, selectedSession, frames.length]);

  const handleSelectSession = (session: ReplaySession) => {
    setSelectedSession(session);
    setCurrentFrameIndex(0);
    setIsPlaying(false);
  };

  const handleSeek = (frameIndex: number) => {
    setCurrentFrameIndex(Math.max(0, Math.min(frameIndex, frames.length - 1)));
  };

  // Session List View
  if (!selectedSession) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <Film className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Decision Replay Theater</h1>
                <p className="text-purple-200">Watch past deliberations unfold like a movie</p>
              </div>
            </div>
          </div>
        </div>

        {/* Session List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Deliberations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map(session => (
              <button
                key={session.id}
                onClick={() => handleSelectSession(session)}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-left hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Film className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  {session.consensusReached ? (
                    <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      Consensus
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-sm text-yellow-600 dark:text-yellow-400">
                      <AlertTriangle className="w-4 h-4" />
                      No Consensus
                    </span>
                  )}
                </div>
                
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{session.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{session.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(session.duration)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {session.agentCount} agents
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {session.createdAt.toLocaleDateString()}
                  </span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Outcome: </span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{session.outcome}</span>
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Replay View
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Theater Header */}
      <div className="bg-black/50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedSession(null)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <div>
                <h1 className="font-semibold">{selectedSession.title}</h1>
                <p className="text-sm text-gray-400">{selectedSession.councilMode}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Download className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Stage */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Frame Display */}
            <div className="bg-gray-800 rounded-2xl p-8 min-h-[400px] flex flex-col">
              {currentFrame && (
                <>
                  {currentFrame.type === 'round_change' && (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <Play className="w-10 h-10 text-purple-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-purple-400">{currentFrame.content}</h2>
                      </div>
                    </div>
                  )}
                  
                  {currentFrame.type === 'statement' && (
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl font-bold">
                          {currentFrame.agentName?.charAt(6)}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">{currentFrame.agentName}</h3>
                          <p className="text-gray-400">{currentFrame.agentRole}</p>
                        </div>
                        {currentFrame.confidence && (
                          <div className="ml-auto text-right">
                            <p className="text-sm text-gray-400">Confidence</p>
                            <p className="text-2xl font-bold text-blue-400">{currentFrame.confidence}%</p>
                          </div>
                        )}
                      </div>
                      <div className="bg-gray-700/50 rounded-xl p-6">
                        <MessageCircle className="w-6 h-6 text-gray-400 mb-3" />
                        <p className="text-lg leading-relaxed">{currentFrame.content}</p>
                      </div>
                    </div>
                  )}
                  
                  {currentFrame.type === 'dissent' && (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center max-w-lg">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                          <AlertTriangle className="w-10 h-10 text-red-400" />
                        </div>
                        <h2 className="text-xl font-bold text-red-400 mb-2">DISSENT REGISTERED</h2>
                        <p className="text-gray-300">{currentFrame.agentName}</p>
                        <p className="mt-4 text-gray-400">{currentFrame.content}</p>
                      </div>
                    </div>
                  )}
                  
                  {currentFrame.type === 'consensus' && (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center max-w-lg">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                          <CheckCircle className="w-10 h-10 text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-green-400 mb-4">CONSENSUS REACHED</h2>
                        <p className="text-gray-300">{currentFrame.content}</p>
                      </div>
                    </div>
                  )}
                  
                  {currentFrame.type === 'citation' && (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 max-w-md">
                        <div className="flex items-center gap-3 mb-3">
                          <FileText className="w-6 h-6 text-yellow-400" />
                          <span className="font-medium text-yellow-400">Citation Added</span>
                        </div>
                        <p className="text-gray-300">{currentFrame.agentName}</p>
                        <p className="text-gray-400 mt-2">{currentFrame.content}</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Playback Controls */}
            <div className="bg-gray-800 rounded-xl p-4">
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>{formatTimestamp(currentFrame?.timestamp || 0)}</span>
                  <span>{formatTimestamp(selectedSession.duration)}</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden cursor-pointer">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => handleSeek(0)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Rewind className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleSeek(currentFrameIndex - 1)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-4 bg-purple-600 hover:bg-purple-700 rounded-full transition-colors"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                <button
                  onClick={() => handleSeek(currentFrameIndex + 1)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleSeek(frames.length - 1)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FastForward className="w-5 h-5" />
                </button>

                {/* Speed Control */}
                <div className="ml-4 flex items-center gap-2">
                  <span className="text-sm text-gray-400">Speed:</span>
                  {[0.5, 1, 1.5, 2].map(speed => (
                    <button
                      key={speed}
                      onClick={() => setPlaybackSpeed(speed)}
                      className={`px-2 py-1 rounded text-sm ${
                        playbackSpeed === speed
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Sidebar */}
          <div className="bg-gray-800 rounded-xl p-5 max-h-[600px] overflow-y-auto">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Timeline
            </h3>
            <div className="space-y-2">
              {frames.map((frame, index) => (
                <button
                  key={frame.id}
                  onClick={() => handleSeek(index)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    index === currentFrameIndex
                      ? 'bg-purple-600/30 border border-purple-500'
                      : 'hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-12">{formatTimestamp(frame.timestamp)}</span>
                    <div className={`w-2 h-2 rounded-full ${
                      frame.type === 'dissent' ? 'bg-red-500' :
                      frame.type === 'consensus' ? 'bg-green-500' :
                      frame.type === 'citation' ? 'bg-yellow-500' :
                      frame.type === 'round_change' ? 'bg-purple-500' :
                      'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {frame.agentName || frame.type.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{frame.content}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionReplayTheaterPage;
