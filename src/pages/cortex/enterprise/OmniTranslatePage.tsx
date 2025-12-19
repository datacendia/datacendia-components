// =============================================================================
// CENDIA OMNITRANSLATE™ - 100-LANGUAGE ENTERPRISE TRANSLATOR
// Real-Time Translation for Global Enterprise Operations
// "Breaking Language Barriers Across Your Entire Organization"
//
// CAPABILITIES:
// - 100+ language pairs
// - Real-time meeting translation
// - Document translation with formatting preservation
// - Email/chat translation
// - Voice-to-voice translation
// - Industry-specific terminology
// - Brand voice consistency
// - Context-aware translation
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { decisionIntelApi } from '../../../lib/api';

// =============================================================================
// TYPES
// =============================================================================

type TranslationType = 'document' | 'meeting' | 'email' | 'chat' | 'voice' | 'website';
type QualityLevel = 'draft' | 'business' | 'professional' | 'legal' | 'certified';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  region: string;
  supported: TranslationType[];
  qualityScore: number;
}

interface TranslationJob {
  id: string;
  type: TranslationType;
  sourceLanguage: string;
  targetLanguage: string;
  status: 'queued' | 'processing' | 'review' | 'complete' | 'failed';
  progress: number;
  sourceWordCount: number;
  targetWordCount: number;
  qualityLevel: QualityLevel;
  createdAt: Date;
  completedAt?: Date;
  requestedBy: string;
  department: string;
  cost: number;
}

interface LiveSession {
  id: string;
  type: 'meeting' | 'call' | 'presentation';
  name: string;
  sourceLanguage: string;
  targetLanguages: string[];
  participants: number;
  duration: number;
  wordsTranslated: number;
  status: 'active' | 'paused' | 'ended';
  startedAt: Date;
}

interface TerminologyGlossary {
  id: string;
  name: string;
  industry: string;
  termCount: number;
  languages: string[];
  lastUpdated: Date;
  usageCount: number;
}

interface TranslationMetrics {
  totalWordsTranslated: number;
  documentsProcessed: number;
  meetingsTranslated: number;
  activeLanguages: number;
  avgQualityScore: number;
  avgTurnaround: number;
  costSavings: number;
  glossaryTerms: number;
}

interface LanguageUsage {
  language: string;
  wordCount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

// =============================================================================
// MOCK DATA
// =============================================================================

const LANGUAGES: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    region: 'Global',
    supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'],
    qualityScore: 99,
  },
  {
    code: 'zh',
    name: 'Chinese (Mandarin)',
    nativeName: '中文',
    region: 'Asia',
    supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'],
    qualityScore: 97,
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    region: 'Americas/Europe',
    supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'],
    qualityScore: 98,
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    region: 'Europe/Africa',
    supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'],
    qualityScore: 98,
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    region: 'Europe',
    supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'],
    qualityScore: 98,
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    region: 'Asia',
    supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'],
    qualityScore: 96,
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    region: 'Asia',
    supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'],
    qualityScore: 96,
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    region: 'Americas/Europe',
    supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'],
    qualityScore: 97,
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    region: 'Middle East/Africa',
    supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'],
    qualityScore: 94,
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    region: 'Asia',
    supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'],
    qualityScore: 93,
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    region: 'Europe/Asia',
    supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'],
    qualityScore: 95,
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    region: 'Europe',
    supported: ['document', 'meeting', 'email', 'chat', 'voice', 'website'],
    qualityScore: 97,
  },
];

const generateTranslationJobs = (): TranslationJob[] => [
  {
    id: 'job-001',
    type: 'document',
    sourceLanguage: 'en',
    targetLanguage: 'zh',
    status: 'complete',
    progress: 100,
    sourceWordCount: 15234,
    targetWordCount: 12456,
    qualityLevel: 'legal',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 30 * 60 * 1000),
    requestedBy: 'Legal Team',
    department: 'Legal',
    cost: 456.78,
  },
  {
    id: 'job-002',
    type: 'document',
    sourceLanguage: 'en',
    targetLanguage: 'ja',
    status: 'processing',
    progress: 67,
    sourceWordCount: 8945,
    targetWordCount: 0,
    qualityLevel: 'professional',
    createdAt: new Date(Date.now() - 45 * 60 * 1000),
    requestedBy: 'Marketing',
    department: 'Marketing',
    cost: 268.35,
  },
  {
    id: 'job-003',
    type: 'email',
    sourceLanguage: 'de',
    targetLanguage: 'en',
    status: 'complete',
    progress: 100,
    sourceWordCount: 523,
    targetWordCount: 548,
    qualityLevel: 'business',
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
    completedAt: new Date(Date.now() - 12 * 60 * 1000),
    requestedBy: 'Sales EMEA',
    department: 'Sales',
    cost: 15.69,
  },
  {
    id: 'job-004',
    type: 'document',
    sourceLanguage: 'en',
    targetLanguage: 'es',
    status: 'review',
    progress: 100,
    sourceWordCount: 4521,
    targetWordCount: 5102,
    qualityLevel: 'certified',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    requestedBy: 'HR',
    department: 'Human Resources',
    cost: 180.84,
  },
  {
    id: 'job-005',
    type: 'website',
    sourceLanguage: 'en',
    targetLanguage: 'fr',
    status: 'queued',
    progress: 0,
    sourceWordCount: 12890,
    targetWordCount: 0,
    qualityLevel: 'professional',
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    requestedBy: 'Digital Team',
    department: 'Marketing',
    cost: 386.7,
  },
];

const generateLiveSessions = (): LiveSession[] => [
  {
    id: 'live-001',
    type: 'meeting',
    name: 'Q4 Planning - APAC Team',
    sourceLanguage: 'en',
    targetLanguages: ['zh', 'ja', 'ko'],
    participants: 24,
    duration: 47,
    wordsTranslated: 8923,
    status: 'active',
    startedAt: new Date(Date.now() - 47 * 60 * 1000),
  },
  {
    id: 'live-002',
    type: 'call',
    name: 'Customer Success - Germany',
    sourceLanguage: 'de',
    targetLanguages: ['en'],
    participants: 4,
    duration: 23,
    wordsTranslated: 2341,
    status: 'active',
    startedAt: new Date(Date.now() - 23 * 60 * 1000),
  },
  {
    id: 'live-003',
    type: 'presentation',
    name: 'Product Launch Webinar',
    sourceLanguage: 'en',
    targetLanguages: ['es', 'pt', 'fr', 'de', 'it'],
    participants: 847,
    duration: 62,
    wordsTranslated: 15234,
    status: 'active',
    startedAt: new Date(Date.now() - 62 * 60 * 1000),
  },
];

const generateGlossaries = (): TerminologyGlossary[] => [
  {
    id: 'gloss-001',
    name: 'Legal & Compliance',
    industry: 'Legal',
    termCount: 4521,
    languages: ['en', 'de', 'fr', 'es', 'zh', 'ja'],
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    usageCount: 12456,
  },
  {
    id: 'gloss-002',
    name: 'Financial Services',
    industry: 'Finance',
    termCount: 3892,
    languages: ['en', 'zh', 'ja', 'de', 'fr'],
    lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    usageCount: 8934,
  },
  {
    id: 'gloss-003',
    name: 'Technology & Software',
    industry: 'Technology',
    termCount: 6234,
    languages: ['en', 'zh', 'ja', 'ko', 'de', 'es', 'fr', 'pt'],
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    usageCount: 23451,
  },
  {
    id: 'gloss-004',
    name: 'Healthcare & Medical',
    industry: 'Healthcare',
    termCount: 8923,
    languages: ['en', 'de', 'fr', 'es', 'zh', 'ja', 'ar'],
    lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    usageCount: 6789,
  },
];

const generateMetrics = (): TranslationMetrics => ({
  totalWordsTranslated: 48923456,
  documentsProcessed: 12456,
  meetingsTranslated: 3892,
  activeLanguages: 47,
  avgQualityScore: 96.8,
  avgTurnaround: 2.3,
  costSavings: 2340000,
  glossaryTerms: 23570,
});

const generateLanguageUsage = (): LanguageUsage[] => [
  { language: 'Chinese', wordCount: 12345678, percentage: 25.2, trend: 'up' },
  { language: 'Spanish', wordCount: 8923456, percentage: 18.2, trend: 'stable' },
  { language: 'Japanese', wordCount: 6234567, percentage: 12.7, trend: 'up' },
  { language: 'German', wordCount: 5123456, percentage: 10.5, trend: 'stable' },
  { language: 'French', wordCount: 4892345, percentage: 10.0, trend: 'down' },
  { language: 'Portuguese', wordCount: 3456789, percentage: 7.1, trend: 'up' },
  { language: 'Korean', wordCount: 2345678, percentage: 4.8, trend: 'up' },
  { language: 'Arabic', wordCount: 1892345, percentage: 3.9, trend: 'stable' },
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const OmniTranslatePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'translate' | 'live' | 'jobs' | 'glossaries'
  >('dashboard');
  const [translationJobs] = useState<TranslationJob[]>(generateTranslationJobs);
  const [liveSessions] = useState<LiveSession[]>(generateLiveSessions);
  const [glossaries] = useState<TerminologyGlossary[]>(generateGlossaries);
  const [metrics] = useState<TranslationMetrics>(generateMetrics);
  const [languageUsage] = useState<LanguageUsage[]>(generateLanguageUsage);

  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real data from API
  useEffect(() => {
    const fetchTranslationData = async () => {
      try {
        const snapshotsRes = await decisionIntelApi.getChronosSnapshots();
        if (snapshotsRes.success && snapshotsRes.data) {
          console.log('[OmniTranslate] Loaded system snapshots for localization metrics');
        }
      } catch (error) {
        console.log('[OmniTranslate] Using local generators (API unavailable)');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTranslationData();
  }, []);

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      return;
    }
    setIsTranslating(true);

    try {
      const response = await fetch('/api/v1/omnitranslate/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sourceText.trim(),
          sourceLanguage: sourceLang || 'auto',
          targetLanguage: targetLang,
          context: 'enterprise',
        }),
      });

      const result = await response.json();

      if (result.success && result.data?.translatedText) {
        setTranslatedText(result.data.translatedText);
      } else {
        console.error('[OmniTranslate] Translation failed:', result.error);
        setTranslatedText('Translation failed. Please try again.');
      }
    } catch (error) {
      console.error('[OmniTranslate] API error:', error);
      setTranslatedText('Translation service unavailable. Please try again later.');
    } finally {
      setIsTranslating(false);
    }
  };

  const activeJobs = translationJobs.filter(
    (j) => j.status === 'processing' || j.status === 'queued'
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-blue-800/50 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/cortex/dashboard')}
                className="text-white/60 hover:text-white transition-colors"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-3xl">🌍</span>
                  CendiaOmniTranslate™
                  <span className="text-xs bg-gradient-to-r from-blue-500 to-indigo-500 px-2 py-0.5 rounded-full font-medium">
                    100+ LANGUAGES
                  </span>
                </h1>
                <p className="text-blue-300 text-sm">
                  Enterprise Translation Platform • Real-Time • AI-Powered
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                {liveSessions.filter((s) => s.status === 'active').length > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-600/20 border border-green-500/30 rounded-lg animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-green-400 text-sm font-medium">
                      {liveSessions.filter((s) => s.status === 'active').length} Live Sessions
                    </span>
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm text-white/60">Words Translated</div>
                <div className="text-xl font-bold text-blue-400">
                  {(metrics.totalWordsTranslated / 1e6).toFixed(1)}M
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Bar */}
      <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-b border-blue-800/30">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="grid grid-cols-8 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{metrics.activeLanguages}</div>
              <div className="text-xs text-blue-300">Languages</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">
                {(metrics.totalWordsTranslated / 1e6).toFixed(1)}M
              </div>
              <div className="text-xs text-blue-300">Words</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {metrics.documentsProcessed.toLocaleString()}
              </div>
              <div className="text-xs text-blue-300">Documents</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {metrics.meetingsTranslated.toLocaleString()}
              </div>
              <div className="text-xs text-blue-300">Meetings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">{metrics.avgQualityScore}%</div>
              <div className="text-xs text-blue-300">Quality Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{metrics.avgTurnaround}h</div>
              <div className="text-xs text-blue-300">Avg Turnaround</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">
                ${(metrics.costSavings / 1e6).toFixed(1)}M
              </div>
              <div className="text-xs text-blue-300">Cost Savings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-400">
                {(metrics.glossaryTerms / 1000).toFixed(1)}K
              </div>
              <div className="text-xs text-blue-300">Glossary Terms</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-blue-800/30 bg-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'translate', label: 'Translate', icon: '✏️' },
              {
                id: 'live',
                label: 'Live Sessions',
                icon: '🎙️',
                badge: liveSessions.filter((s) => s.status === 'active').length,
              },
              { id: 'jobs', label: 'Translation Jobs', icon: '📄', badge: activeJobs.length },
              { id: 'glossaries', label: 'Glossaries', icon: '📚' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-400 text-white bg-blue-900/20'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon} {tab.label}
                {tab.badge && tab.badge > 0 && (
                  <span className="px-2 py-0.5 bg-blue-600 rounded-full text-xs">{tab.badge}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Live Sessions Alert */}
            {liveSessions.filter((s) => s.status === 'active').length > 0 && (
              <div className="bg-green-900/20 rounded-2xl p-6 border border-green-700/50">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="text-green-400 animate-pulse">🎙️</span> Active Live Translation
                  Sessions
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {liveSessions
                    .filter((s) => s.status === 'active')
                    .map((session) => (
                      <div
                        key={session.id}
                        className="p-4 bg-green-900/30 rounded-xl border border-green-700/30"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">{session.name}</span>
                          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        </div>
                        <div className="text-sm text-white/60 mb-2">
                          {session.sourceLanguage.toUpperCase()} →{' '}
                          {session.targetLanguages.map((l) => l.toUpperCase()).join(', ')}
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center p-2 bg-black/20 rounded">
                            <div className="font-bold">{session.participants}</div>
                            <div className="text-white/50">Participants</div>
                          </div>
                          <div className="text-center p-2 bg-black/20 rounded">
                            <div className="font-bold">{session.duration}m</div>
                            <div className="text-white/50">Duration</div>
                          </div>
                          <div className="text-center p-2 bg-black/20 rounded">
                            <div className="font-bold text-green-400">
                              {session.wordsTranslated.toLocaleString()}
                            </div>
                            <div className="text-white/50">Words</div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Language Usage */}
            <div className="bg-black/30 rounded-2xl p-6 border border-blue-800/50">
              <h2 className="text-lg font-semibold mb-4">Top Languages by Usage</h2>
              <div className="space-y-3">
                {languageUsage.map((usage) => (
                  <div key={usage.language} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-medium">{usage.language}</div>
                    <div className="flex-1 h-4 bg-black/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                        style={{ width: `${usage.percentage}%` }}
                      />
                    </div>
                    <div className="w-20 text-right text-sm">
                      {(usage.wordCount / 1e6).toFixed(1)}M
                    </div>
                    <div
                      className={`w-12 text-right text-sm ${
                        usage.trend === 'up'
                          ? 'text-green-400'
                          : usage.trend === 'down'
                            ? 'text-red-400'
                            : 'text-white/50'
                      }`}
                    >
                      {usage.trend === 'up' ? '↑' : usage.trend === 'down' ? '↓' : '→'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6">
              {/* Supported Languages */}
              <div className="bg-black/30 rounded-2xl p-6 border border-blue-800/50">
                <h3 className="text-lg font-semibold mb-4">Top Quality Languages</h3>
                <div className="space-y-2">
                  {LANGUAGES.slice(0, 6).map((lang) => (
                    <div
                      key={lang.code}
                      className="flex items-center justify-between p-3 bg-black/20 rounded-lg"
                    >
                      <div>
                        <span className="font-medium">{lang.name}</span>
                        <span className="ml-2 text-sm text-white/50">{lang.nativeName}</span>
                      </div>
                      <span className="text-green-400 font-bold">{lang.qualityScore}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Jobs */}
              <div className="bg-black/30 rounded-2xl p-6 border border-blue-800/50">
                <h3 className="text-lg font-semibold mb-4">Recent Jobs</h3>
                <div className="space-y-2">
                  {translationJobs.slice(0, 4).map((job) => (
                    <div key={job.id} className="p-3 bg-black/20 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{job.requestedBy}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            job.status === 'complete'
                              ? 'bg-green-600'
                              : job.status === 'processing'
                                ? 'bg-blue-600'
                                : job.status === 'review'
                                  ? 'bg-purple-600'
                                  : 'bg-neutral-600'
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>
                      <div className="text-xs text-white/50">
                        {job.sourceLanguage.toUpperCase()} → {job.targetLanguage.toUpperCase()} •{' '}
                        {job.sourceWordCount.toLocaleString()} words
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Glossaries */}
              <div className="bg-black/30 rounded-2xl p-6 border border-blue-800/50">
                <h3 className="text-lg font-semibold mb-4">Active Glossaries</h3>
                <div className="space-y-2">
                  {glossaries.map((gloss) => (
                    <div key={gloss.id} className="p-3 bg-black/20 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{gloss.name}</span>
                        <span className="text-cyan-400 font-bold">
                          {gloss.termCount.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs text-white/50">
                        {gloss.languages.length} languages • {gloss.usageCount.toLocaleString()}{' '}
                        uses
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'translate' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-2xl p-6 border border-blue-700/50">
              <h2 className="text-lg font-semibold mb-2">✏️ Quick Translation</h2>
              <p className="text-white/60">
                Instant AI-powered translation with context awareness and industry terminology.
                Supports 100+ language pairs with enterprise-grade accuracy.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Source */}
              <div className="bg-black/30 rounded-2xl p-6 border border-blue-800/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Source Text</h3>
                  <select
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    className="px-3 py-1.5 bg-black/30 border border-blue-800/50 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder="Enter text to translate..."
                  className="w-full h-64 p-4 bg-black/20 border border-blue-800/30 rounded-xl focus:outline-none focus:border-blue-500 resize-none"
                />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-white/50">
                    {sourceText.split(/\s+/).filter(Boolean).length} words
                  </span>
                  <button
                    onClick={handleTranslate}
                    disabled={!sourceText.trim() || isTranslating}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-medium hover:opacity-90 disabled:opacity-50 transition-all"
                  >
                    {isTranslating ? 'Translating...' : 'Translate →'}
                  </button>
                </div>
              </div>

              {/* Target */}
              <div className="bg-black/30 rounded-2xl p-6 border border-blue-800/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Translation</h3>
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="px-3 py-1.5 bg-black/30 border border-blue-800/50 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  >
                    {LANGUAGES.filter((l) => l.code !== sourceLang).map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full h-64 p-4 bg-black/20 border border-blue-800/30 rounded-xl overflow-y-auto">
                  {isTranslating ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-blue-400 animate-pulse">Translating...</div>
                    </div>
                  ) : translatedText ? (
                    <p className="leading-relaxed">{translatedText}</p>
                  ) : (
                    <p className="text-white/30">Translation will appear here...</p>
                  )}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-white/50">
                    {translatedText.split(/\s+/).filter(Boolean).length} words
                  </span>
                  <button
                    onClick={() => navigator.clipboard.writeText(translatedText)}
                    disabled={!translatedText}
                    className="px-4 py-2 bg-black/30 rounded-lg text-sm hover:bg-black/40 disabled:opacity-50 transition-colors"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>
            </div>

            {/* Translation Options */}
            <div className="bg-black/30 rounded-2xl p-6 border border-blue-800/50">
              <h3 className="font-semibold mb-4">Translation Settings</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-black/20 rounded-xl cursor-pointer hover:bg-black/30 transition-colors border border-transparent hover:border-blue-600">
                  <div className="text-2xl mb-2">📄</div>
                  <div className="font-medium">Business</div>
                  <div className="text-xs text-white/50">General business content</div>
                </div>
                <div className="p-4 bg-black/20 rounded-xl cursor-pointer hover:bg-black/30 transition-colors border border-transparent hover:border-blue-600">
                  <div className="text-2xl mb-2">⚖️</div>
                  <div className="font-medium">Legal</div>
                  <div className="text-xs text-white/50">Legal documents & contracts</div>
                </div>
                <div className="p-4 bg-black/20 rounded-xl cursor-pointer hover:bg-black/30 transition-colors border border-transparent hover:border-blue-600">
                  <div className="text-2xl mb-2">💊</div>
                  <div className="font-medium">Medical</div>
                  <div className="text-xs text-white/50">Healthcare & medical</div>
                </div>
                <div className="p-4 bg-black/20 rounded-xl cursor-pointer hover:bg-black/30 transition-colors border border-transparent hover:border-blue-600">
                  <div className="text-2xl mb-2">💻</div>
                  <div className="font-medium">Technical</div>
                  <div className="text-xs text-white/50">Software & technology</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'live' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-2xl p-6 border border-green-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold mb-2">🎙️ Live Translation Sessions</h2>
                  <p className="text-white/60">
                    Real-time translation for meetings, calls, and presentations. Support for
                    multiple target languages simultaneously.
                  </p>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-medium hover:opacity-90 transition-all">
                  Start New Session
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {liveSessions.map((session) => (
                <div
                  key={session.id}
                  className={`bg-black/30 rounded-2xl p-6 border ${
                    session.status === 'active' ? 'border-green-700/50' : 'border-blue-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {session.status === 'active' && (
                        <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                      )}
                      <div>
                        <h3 className="text-lg font-semibold">{session.name}</h3>
                        <div className="text-sm text-white/50">{session.type}</div>
                      </div>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        session.status === 'active'
                          ? 'bg-green-600'
                          : session.status === 'paused'
                            ? 'bg-amber-600'
                            : 'bg-neutral-600'
                      }`}
                    >
                      {session.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-white/60 mb-2">Languages</div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-blue-900/50 rounded-lg">
                        {session.sourceLanguage.toUpperCase()}
                      </span>
                      <span className="text-white/40">→</span>
                      {session.targetLanguages.map((lang) => (
                        <span key={lang} className="px-3 py-1 bg-indigo-900/50 rounded-lg">
                          {lang.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-black/20 rounded-xl">
                      <div className="text-2xl font-bold text-cyan-400">{session.participants}</div>
                      <div className="text-xs text-white/50">Participants</div>
                    </div>
                    <div className="text-center p-4 bg-black/20 rounded-xl">
                      <div className="text-2xl font-bold">{session.duration}m</div>
                      <div className="text-xs text-white/50">Duration</div>
                    </div>
                    <div className="text-center p-4 bg-black/20 rounded-xl">
                      <div className="text-2xl font-bold text-green-400">
                        {session.wordsTranslated.toLocaleString()}
                      </div>
                      <div className="text-xs text-white/50">Words Translated</div>
                    </div>
                    <div className="text-center p-4 bg-black/20 rounded-xl">
                      <div className="text-2xl font-bold text-purple-400">
                        {session.targetLanguages.length}
                      </div>
                      <div className="text-xs text-white/50">Target Languages</div>
                    </div>
                  </div>

                  {session.status === 'active' && (
                    <div className="flex gap-3 mt-4 pt-4 border-t border-blue-800/30">
                      <button className="px-4 py-2 bg-amber-600 rounded-lg text-sm hover:bg-amber-500 transition-colors">
                        ⏸️ Pause
                      </button>
                      <button className="px-4 py-2 bg-red-600 rounded-lg text-sm hover:bg-red-500 transition-colors">
                        ⏹️ End Session
                      </button>
                      <button className="px-4 py-2 bg-blue-600 rounded-lg text-sm hover:bg-blue-500 transition-colors">
                        📥 Download Transcript
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="space-y-4">
            {translationJobs.map((job) => (
              <div key={job.id} className="bg-black/30 rounded-2xl p-6 border border-blue-800/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{job.requestedBy}</h3>
                      <span className="px-2 py-0.5 bg-blue-900 rounded text-xs">{job.type}</span>
                      <span className="px-2 py-0.5 bg-purple-900 rounded text-xs">
                        {job.qualityLevel}
                      </span>
                    </div>
                    <div className="text-sm text-white/50">{job.department}</div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-lg text-sm ${
                      job.status === 'complete'
                        ? 'bg-green-600'
                        : job.status === 'processing'
                          ? 'bg-blue-600'
                          : job.status === 'review'
                            ? 'bg-purple-600'
                            : job.status === 'queued'
                              ? 'bg-amber-600'
                              : 'bg-red-600'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-blue-900/50 rounded-lg font-medium">
                    {job.sourceLanguage.toUpperCase()}
                  </span>
                  <span className="text-white/40">→</span>
                  <span className="px-3 py-1 bg-indigo-900/50 rounded-lg font-medium">
                    {job.targetLanguage.toUpperCase()}
                  </span>
                </div>

                {job.status === 'processing' && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{job.progress}%</span>
                    </div>
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-lg font-bold">{job.sourceWordCount.toLocaleString()}</div>
                    <div className="text-xs text-white/50">Source Words</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-lg font-bold">
                      {job.targetWordCount > 0 ? job.targetWordCount.toLocaleString() : '-'}
                    </div>
                    <div className="text-xs text-white/50">Target Words</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-lg font-bold text-green-400">${job.cost.toFixed(2)}</div>
                    <div className="text-xs text-white/50">Cost</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-lg font-bold">
                      {Math.floor((Date.now() - job.createdAt.getTime()) / 60000)}m
                    </div>
                    <div className="text-xs text-white/50">Age</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'glossaries' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold mb-2">📚 Terminology Glossaries</h2>
                  <p className="text-white/60">
                    Industry-specific terminology databases for consistent, accurate translations.
                    Maintain brand voice and technical accuracy across all languages.
                  </p>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium hover:opacity-90 transition-all">
                  Create Glossary
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {glossaries.map((gloss) => (
                <div
                  key={gloss.id}
                  className="bg-black/30 rounded-2xl p-6 border border-blue-800/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{gloss.name}</h3>
                    <span className="px-3 py-1 bg-purple-900/50 rounded-lg text-sm">
                      {gloss.industry}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-cyan-400">
                        {gloss.termCount.toLocaleString()}
                      </div>
                      <div className="text-xs text-white/50">Terms</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-purple-400">
                        {gloss.languages.length}
                      </div>
                      <div className="text-xs text-white/50">Languages</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-green-400">
                        {gloss.usageCount.toLocaleString()}
                      </div>
                      <div className="text-xs text-white/50">Uses</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs text-white/50 mb-2">Supported Languages</div>
                    <div className="flex flex-wrap gap-1">
                      {gloss.languages.map((lang) => (
                        <span key={lang} className="px-2 py-1 bg-blue-900/50 rounded text-xs">
                          {lang.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-blue-800/30">
                    <span className="text-xs text-white/40">
                      Updated:{' '}
                      {Math.floor(
                        (Date.now() - gloss.lastUpdated.getTime()) / (24 * 60 * 60 * 1000)
                      )}{' '}
                      days ago
                    </span>
                    <button className="px-4 py-2 bg-blue-600 rounded-lg text-sm hover:bg-blue-500 transition-colors">
                      Edit Glossary
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OmniTranslatePage;
