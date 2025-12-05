// =============================================================================
// CENDIA GNOSIS™ - Sovereign Education Engine
// "The Council decides tomorrow's strategy tonight. Gnosis teaches every human
//  how to execute it by morning."
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import {
  GraduationCap, BookOpen, Target, Users, TrendingUp, Award,
  ChevronRight, Play, CheckCircle, Clock, Brain, Zap, BarChart3,
  AlertCircle, Star, BookMarked, Layers, RefreshCw
} from 'lucide-react';
import { gnosisApi } from '../../../lib/api';

interface DashboardData {
  userProfile: {
    strengths: string[];
    gaps: string[];
    learningStyle: string;
    skillCount: number;
  };
  organizationMetrics: {
    totalLearners: number;
    activeLearners: number;
    avgCompletionRate: number;
    decisionReadiness: number;
  };
  recommendedPaths: string[];
  topPerformers: Array<{ userId: string; name: string; score: number }>;
  atRiskLearners: Array<{ userId: string; name: string; reason: string }>;
}

interface SkillProfile {
  userId: string;
  skills: Record<string, {
    name: string;
    level: number;
    trend: string;
    certifications: string[];
  }>;
  strengths: string[];
  gaps: string[];
  learningStyle: string;
  preferredPace: string;
}

interface DecisionReadiness {
  readinessScore: number;
  totalLearners: number;
  activeLearners: number;
  completedPaths: number;
  status: string;
  message: string;
}

const GnosisPage = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [profile, setProfile] = useState<SkillProfile | null>(null);
  const [readiness, setReadiness] = useState<DecisionReadiness | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'paths' | 'analytics'>('overview');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [dashboardRes, profileRes, readinessRes] = await Promise.all([
        gnosisApi.getDashboard(),
        gnosisApi.getProfile(),
        gnosisApi.getDecisionReadiness(),
      ]);

      if (dashboardRes.success) {
        setDashboard(dashboardRes.data as DashboardData);
      }
      if (profileRes.success) {
        setProfile(profileRes.data as SkillProfile);
      }
      if (readinessRes.success) {
        setReadiness(readinessRes.data as DecisionReadiness);
      }
    } catch (error) {
      console.error('Failed to fetch Gnosis data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getReadinessColor = (score: number) => {
    if (score >= 80) { return 'text-green-400'; }
    if (score >= 50) { return 'text-amber-400'; }
    return 'text-red-400';
  };

  const getSkillLevelLabel = (level: number) => {
    if (level >= 90) { return 'Expert'; }
    if (level >= 70) { return 'Advanced'; }
    if (level >= 50) { return 'Intermediate'; }
    if (level >= 30) { return 'Beginner'; }
    return 'Novice';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-950">
        <div className="text-center">
          <GraduationCap className="w-12 h-12 text-indigo-500 animate-pulse mx-auto mb-4" />
          <p className="text-neutral-400">Loading Learning Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">CendiaGnosis™</h1>
              <p className="text-neutral-400">Sovereign Education Engine</p>
            </div>
          </div>
          
          <button 
            onClick={fetchData}
            className="px-4 py-2 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-lg flex items-center gap-2 hover:bg-indigo-500/30 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
        
        <p className="text-neutral-500 mt-2 max-w-2xl">
          The Council decides tomorrow's strategy tonight. Gnosis teaches every human how to execute it by morning.
        </p>
      </div>

      {/* Decision Readiness Banner */}
      <div className={`mb-8 p-6 rounded-xl border ${
        readiness?.status === 'ready' 
          ? 'bg-green-500/10 border-green-500/30' 
          : readiness?.status === 'partial'
          ? 'bg-amber-500/10 border-amber-500/30'
          : 'bg-red-500/10 border-red-500/30'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              readiness?.status === 'ready' ? 'bg-green-500/20' :
              readiness?.status === 'partial' ? 'bg-amber-500/20' : 'bg-red-500/20'
            }`}>
              <span className={`text-2xl font-bold ${getReadinessColor(readiness?.readinessScore || 0)}`}>
                {readiness?.readinessScore?.toFixed(0) || 0}%
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Decision Readiness</h2>
              <p className={`text-sm ${
                readiness?.status === 'ready' ? 'text-green-400' :
                readiness?.status === 'partial' ? 'text-amber-400' : 'text-red-400'
              }`}>
                {readiness?.message}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-8 text-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{readiness?.totalLearners || 0}</p>
              <p className="text-neutral-500">Total Learners</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-400">{readiness?.activeLearners || 0}</p>
              <p className="text-neutral-500">Active Now</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{readiness?.completedPaths || 0}</p>
              <p className="text-neutral-500">Paths Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'overview', label: 'Overview', icon: Layers },
          { id: 'skills', label: 'My Skills', icon: Brain },
          { id: 'paths', label: 'Learning Paths', icon: BookOpen },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as typeof activeTab)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
              activeTab === id
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Your Profile Summary */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              Your Profile
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-neutral-500 mb-2">Learning Style</p>
                <p className="text-lg font-medium capitalize">{profile?.learningStyle || 'Visual'}</p>
              </div>
              
              <div>
                <p className="text-sm text-neutral-500 mb-2">Preferred Pace</p>
                <p className="text-lg font-medium capitalize">{profile?.preferredPace?.replace(/_/g, ' ') || 'Self-paced'}</p>
              </div>
              
              <div>
                <p className="text-sm text-neutral-500 mb-2">Skills Tracked</p>
                <p className="text-lg font-medium">{dashboard?.userProfile.skillCount || 0} skills</p>
              </div>
              
              <div className="pt-4 border-t border-neutral-800">
                <p className="text-sm text-neutral-500 mb-2">Strengths</p>
                <div className="flex flex-wrap gap-2">
                  {(profile?.strengths || []).slice(0, 5).map((strength, idx) => (
                    <span key={idx} className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-lg">
                      {strength}
                    </span>
                  ))}
                  {(profile?.strengths || []).length === 0 && (
                    <span className="text-neutral-500 text-sm">Complete assessments to identify strengths</span>
                  )}
                </div>
              </div>
              
              <div className="pt-4 border-t border-neutral-800">
                <p className="text-sm text-neutral-500 mb-2">Skills to Develop</p>
                <div className="flex flex-wrap gap-2">
                  {(profile?.gaps || []).slice(0, 5).map((gap, idx) => (
                    <span key={idx} className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-lg">
                      {gap}
                    </span>
                  ))}
                  {(profile?.gaps || []).length === 0 && (
                    <span className="text-neutral-500 text-sm">No skill gaps identified</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Paths */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-indigo-500" />
              Recommended for You
            </h2>
            
            <div className="space-y-3">
              {/* Sample learning paths */}
              {[
                { title: 'AI-Driven Decision Making', progress: 0, duration: '2h 30m', difficulty: 'intermediate' },
                { title: 'Change Management Fundamentals', progress: 45, duration: '1h 45m', difficulty: 'beginner' },
                { title: 'Strategic Communication', progress: 78, duration: '3h', difficulty: 'advanced' },
              ].map((path, idx) => (
                <div key={idx} className="p-4 bg-neutral-800/50 rounded-lg hover:bg-neutral-800 transition cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium">{path.title}</p>
                    <span className={`px-2 py-1 text-xs rounded capitalize ${
                      path.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                      path.difficulty === 'intermediate' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {path.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-neutral-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {path.duration}
                    </span>
                    {path.progress > 0 && (
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {path.progress}% complete
                      </span>
                    )}
                  </div>
                  
                  <div className="h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${path.progress}%` }}
                    />
                  </div>
                  
                  <button className="mt-3 w-full py-2 bg-indigo-500/20 text-indigo-400 rounded-lg text-sm hover:bg-indigo-500/30 transition flex items-center justify-center gap-2">
                    {path.progress > 0 ? (
                      <>
                        <Play className="w-4 h-4" />
                        Continue Learning
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Start Path
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Organization Leaderboard */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Top Performers
            </h2>
            
            <div className="space-y-3">
              {(dashboard?.topPerformers || []).length > 0 ? (
                dashboard?.topPerformers.map((performer, idx) => (
                  <div key={performer.userId} className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      idx === 0 ? 'bg-amber-500/20 text-amber-400' :
                      idx === 1 ? 'bg-neutral-400/20 text-neutral-300' :
                      idx === 2 ? 'bg-orange-500/20 text-orange-400' :
                      'bg-neutral-700 text-neutral-400'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{performer.name}</p>
                    </div>
                    <span className="text-indigo-400 font-bold">{performer.score}%</span>
                  </div>
                ))
              ) : (
                /* Demo leaderboard */
                [
                  { name: 'Sarah Chen', score: 98 },
                  { name: 'Marcus Johnson', score: 95 },
                  { name: 'Emily Rodriguez', score: 92 },
                  { name: 'David Kim', score: 89 },
                  { name: 'Lisa Thompson', score: 87 },
                ].map((performer, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      idx === 0 ? 'bg-amber-500/20 text-amber-400' :
                      idx === 1 ? 'bg-neutral-400/20 text-neutral-300' :
                      idx === 2 ? 'bg-orange-500/20 text-orange-400' :
                      'bg-neutral-700 text-neutral-400'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{performer.name}</p>
                    </div>
                    <span className="text-indigo-400 font-bold">{performer.score}%</span>
                  </div>
                ))
              )}
            </div>
            
            {/* At Risk Learners */}
            {(dashboard?.atRiskLearners || []).length > 0 && (
              <div className="mt-6 pt-4 border-t border-neutral-800">
                <h3 className="text-sm font-medium text-neutral-400 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  Needs Attention
                </h3>
                
                <div className="space-y-2">
                  {dashboard?.atRiskLearners.slice(0, 3).map((learner) => (
                    <div key={learner.userId} className="flex items-center justify-between p-2 bg-amber-500/10 rounded-lg">
                      <span className="text-sm">{learner.name}</span>
                      <span className="text-xs text-amber-400">{learner.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              Skill Levels
            </h2>
            
            <div className="space-y-4">
              {Object.entries(profile?.skills || {}).length > 0 ? (
                Object.entries(profile?.skills || {}).map(([skillName, skill]) => (
                  <div key={skillName}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{skill.name || skillName}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          skill.level >= 70 ? 'bg-green-500/20 text-green-400' :
                          skill.level >= 50 ? 'bg-amber-500/20 text-amber-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {getSkillLevelLabel(skill.level)}
                        </span>
                        <span className="text-neutral-400">{skill.level}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          skill.level >= 70 ? 'bg-green-500' :
                          skill.level >= 50 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                /* Demo skills */
                [
                  { name: 'Strategic Planning', level: 85 },
                  { name: 'Data Analysis', level: 72 },
                  { name: 'Change Management', level: 65 },
                  { name: 'AI Fundamentals', level: 58 },
                  { name: 'Leadership', level: 78 },
                  { name: 'Communication', level: 90 },
                ].map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          skill.level >= 70 ? 'bg-green-500/20 text-green-400' :
                          skill.level >= 50 ? 'bg-amber-500/20 text-amber-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {getSkillLevelLabel(skill.level)}
                        </span>
                        <span className="text-neutral-400">{skill.level}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          skill.level >= 70 ? 'bg-green-500' :
                          skill.level >= 50 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-500" />
              Take a Skill Assessment
            </h2>
            
            <p className="text-neutral-400 text-sm mb-4">
              Assess your skills to get personalized learning recommendations and track your growth.
            </p>
            
            <div className="space-y-3">
              {['Leadership', 'Data Analysis', 'AI & Automation', 'Strategic Thinking', 'Communication'].map((skill) => (
                <button 
                  key={skill}
                  className="w-full flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg hover:bg-neutral-800 transition"
                >
                  <span className="font-medium">{skill}</span>
                  <div className="flex items-center gap-2 text-indigo-400">
                    <span className="text-sm">Start Assessment</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'paths' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Available Learning Paths</h2>
            <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Generate from Decision
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { 
                title: 'AI Council Operations', 
                description: 'Understand how the AI Council makes decisions and your role in the process',
                modules: 8, 
                duration: '4h 30m', 
                difficulty: 'intermediate',
                enrolled: 234,
                rating: 4.8
              },
              { 
                title: 'Data-Driven Leadership', 
                description: 'Lead with confidence using real-time analytics and AI insights',
                modules: 12, 
                duration: '6h', 
                difficulty: 'advanced',
                enrolled: 156,
                rating: 4.9
              },
              { 
                title: 'Change Management for AI Era', 
                description: 'Navigate organizational transformation in an AI-first world',
                modules: 6, 
                duration: '3h', 
                difficulty: 'beginner',
                enrolled: 412,
                rating: 4.7
              },
              { 
                title: 'Ethics in Automated Decision Making', 
                description: 'Ensure ethical AI practices and governance compliance',
                modules: 10, 
                duration: '5h', 
                difficulty: 'advanced',
                enrolled: 89,
                rating: 4.6
              },
              { 
                title: 'Strategic Communication', 
                description: 'Communicate AI-driven decisions effectively across all levels',
                modules: 5, 
                duration: '2h 30m', 
                difficulty: 'intermediate',
                enrolled: 298,
                rating: 4.8
              },
              { 
                title: 'Risk Assessment Fundamentals', 
                description: 'Identify and mitigate risks in automated processes',
                modules: 7, 
                duration: '3h 45m', 
                difficulty: 'intermediate',
                enrolled: 187,
                rating: 4.5
              },
            ].map((path, idx) => (
              <div key={idx} className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden hover:border-indigo-500/50 transition">
                <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{path.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded capitalize ${
                      path.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                      path.difficulty === 'intermediate' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {path.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-sm text-neutral-400 mb-4">{path.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {path.modules} modules
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {path.duration}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm text-amber-400">{path.rating}</span>
                    </div>
                    <span className="text-sm text-neutral-500">{path.enrolled} enrolled</span>
                  </div>
                  
                  <button className="w-full py-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 transition flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" />
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              Organization Learning Metrics
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-neutral-800/50 rounded-lg">
                <p className="text-sm text-neutral-500">Total Learners</p>
                <p className="text-2xl font-bold mt-1">{dashboard?.organizationMetrics.totalLearners || 0}</p>
              </div>
              <div className="p-4 bg-neutral-800/50 rounded-lg">
                <p className="text-sm text-neutral-500">Active Learners</p>
                <p className="text-2xl font-bold text-green-400 mt-1">{dashboard?.organizationMetrics.activeLearners || 0}</p>
              </div>
              <div className="p-4 bg-neutral-800/50 rounded-lg">
                <p className="text-sm text-neutral-500">Avg. Completion</p>
                <p className="text-2xl font-bold text-indigo-400 mt-1">
                  {(dashboard?.organizationMetrics.avgCompletionRate || 0).toFixed(1)}%
                </p>
              </div>
              <div className="p-4 bg-neutral-800/50 rounded-lg">
                <p className="text-sm text-neutral-500">Decision Readiness</p>
                <p className={`text-2xl font-bold mt-1 ${getReadinessColor(dashboard?.organizationMetrics.decisionReadiness || 0)}`}>
                  {(dashboard?.organizationMetrics.decisionReadiness || 0).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Learning Trends
            </h2>
            
            <div className="h-64 flex items-center justify-center text-neutral-500">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Learning trend chart would be rendered here</p>
                <p className="text-sm">Showing skill growth over time</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GnosisPage;
