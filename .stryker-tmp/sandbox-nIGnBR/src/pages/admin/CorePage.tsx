// @ts-nocheck
// =============================================================================
// DATACENDIA CORE - INTERNAL ADMIN PAGE
// "Dogfooding" - Datacendia runs on Datacendia
// The secret admin panel for running the company itself
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
import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Megaphone, Hammer, DollarSign, HeadphonesIcon, Eye, TrendingUp, AlertTriangle, Calendar, FileText, Users, Target, Zap, Brain, Shield, ArrowRight, RefreshCw, CheckCircle2, Clock, Send, BarChart3, Sparkles, Crown, MessageSquare, Settings, ChevronRight, Server, Database, HardDrive, Activity, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

// =============================================================================
// TYPES
// =============================================================================

interface CoreMetrics {
  brand: {
    contentQueue: number;
    scheduledPosts: number;
    voiceScore: number;
  };
  foundry: {
    backlogItems: number;
    technicalDebt: number;
    topPriority: string | null;
    nagMessage: string | null;
  };
  revenue: {
    mrr: number;
    arr: number;
    runwayMonths: number;
    pricingAdvice: string | null;
  };
  support: {
    openTickets: number;
    atRiskCustomers: number;
    avgResponseTime: number;
  };
  watch: {
    activeAlerts: number;
    criticalAlert: string | null;
    competitorsTracked: number;
  };
}
interface ContentItem {
  id: string;
  type: 'linkedin' | 'twitter' | 'blog' | 'newsletter';
  title: string;
  status: 'draft' | 'approved' | 'scheduled';
  scheduledFor?: string;
}

// =============================================================================
// CORE SERVICE CARDS
// =============================================================================

const CoreServices = stryMutAct_9fa48("16499") ? [] : (stryCov_9fa48("16499"), [stryMutAct_9fa48("16500") ? {} : (stryCov_9fa48("16500"), {
  id: 'brand',
  name: 'CendiaBrand™',
  agent: 'The Evangelist',
  icon: Megaphone,
  color: '#8B5CF6',
  description: 'Automated self-branding & marketing. Content generation, voice guard, launch timing.',
  features: stryMutAct_9fa48("16506") ? [] : (stryCov_9fa48("16506"), ['Content Engine', 'Voice Guard', 'Hype Cycle'])
}), stryMutAct_9fa48("16510") ? {} : (stryCov_9fa48("16510"), {
  id: 'foundry',
  name: 'CendiaFoundry™',
  agent: 'The Architect',
  icon: Hammer,
  color: '#F59E0B',
  description: 'Product management & R&D. Feature prioritization, technical debt tracking.',
  features: stryMutAct_9fa48("16516") ? [] : (stryCov_9fa48("16516"), ['Feature Prioritization', 'Technical Debt', '20-Year Vision'])
}), stryMutAct_9fa48("16520") ? {} : (stryCov_9fa48("16520"), {
  id: 'revenue',
  name: 'CendiaRevenue™',
  agent: 'The Treasurer',
  icon: DollarSign,
  color: '#10B981',
  description: 'Financial ops for the founder. Runway calculator, pricing optimizer.',
  features: stryMutAct_9fa48("16526") ? [] : (stryCov_9fa48("16526"), ['Stripe Sync', 'Runway Calculator', 'Pricing Optimizer'])
}), stryMutAct_9fa48("16530") ? {} : (stryCov_9fa48("16530"), {
  id: 'support',
  name: 'CendiaSupport™',
  agent: 'The Caretaker',
  icon: HeadphonesIcon,
  color: '#3B82F6',
  description: 'Automated customer success. Ticket triage, churn prediction.',
  features: stryMutAct_9fa48("16536") ? [] : (stryCov_9fa48("16536"), ['Ticket Triage', 'Churn Predictor', 'Auto-Responses'])
}), stryMutAct_9fa48("16540") ? {} : (stryCov_9fa48("16540"), {
  id: 'watch',
  name: 'CendiaWatch™',
  agent: 'The Sentry',
  icon: Eye,
  color: '#EF4444',
  description: 'Competitor & market surveillance. Real-time monitoring and alerts.',
  features: stryMutAct_9fa48("16546") ? [] : (stryCov_9fa48("16546"), ['Radar', 'Competitor Tracking', 'Threat Alerts'])
})]);

// =============================================================================
// COMPONENT
// =============================================================================

export default function CorePage() {
  const [metrics, setMetrics] = useState<CoreMetrics | null>(null);
  const [activeService, setActiveService] = useState<string>('brand');
  const [contentQueue, setContentQueue] = useState<ContentItem[]>(stryMutAct_9fa48("16552") ? ["Stryker was here"] : (stryCov_9fa48("16552"), []));
  const [loading, setLoading] = useState(stryMutAct_9fa48("16553") ? false : (stryCov_9fa48("16553"), true));
  const [generating, setGenerating] = useState(stryMutAct_9fa48("16554") ? true : (stryCov_9fa48("16554"), false));
  useEffect(() => {
    loadMetrics();
  }, stryMutAct_9fa48("16556") ? ["Stryker was here"] : (stryCov_9fa48("16556"), []));
  const loadMetrics = async () => {
    setLoading(stryMutAct_9fa48("16558") ? false : (stryCov_9fa48("16558"), true));
    try {
      // Fetch real data from Core API
      const [dashboardRes, contentRes] = await Promise.all(stryMutAct_9fa48("16560") ? [] : (stryCov_9fa48("16560"), [api.get<any>('/core/dashboard'), api.get<any>('/core/brand/content')]));
      const dashPayload = dashboardRes as any;
      const rawDashboard = stryMutAct_9fa48("16563") ? dashPayload.dashboard && dashPayload.data?.dashboard : (stryCov_9fa48("16563"), dashPayload.dashboard ?? (stryMutAct_9fa48("16564") ? dashPayload.data.dashboard : (stryCov_9fa48("16564"), dashPayload.data?.dashboard)));
      if (stryMutAct_9fa48("16567") ? dashPayload.success !== false || rawDashboard : stryMutAct_9fa48("16566") ? false : stryMutAct_9fa48("16565") ? true : (stryCov_9fa48("16565", "16566", "16567"), (stryMutAct_9fa48("16569") ? dashPayload.success === false : stryMutAct_9fa48("16568") ? true : (stryCov_9fa48("16568", "16569"), dashPayload.success !== (stryMutAct_9fa48("16570") ? true : (stryCov_9fa48("16570"), false)))) && rawDashboard)) {
        setMetrics(stryMutAct_9fa48("16572") ? {} : (stryCov_9fa48("16572"), {
          brand: stryMutAct_9fa48("16575") ? rawDashboard.brand && {
            contentQueue: 0,
            scheduledPosts: 0,
            voiceScore: 0
          } : stryMutAct_9fa48("16574") ? false : stryMutAct_9fa48("16573") ? true : (stryCov_9fa48("16573", "16574", "16575"), rawDashboard.brand || (stryMutAct_9fa48("16576") ? {} : (stryCov_9fa48("16576"), {
            contentQueue: 0,
            scheduledPosts: 0,
            voiceScore: 0
          }))),
          foundry: stryMutAct_9fa48("16579") ? rawDashboard.foundry && {
            backlogItems: 0,
            technicalDebt: 0,
            topPriority: null,
            nagMessage: null
          } : stryMutAct_9fa48("16578") ? false : stryMutAct_9fa48("16577") ? true : (stryCov_9fa48("16577", "16578", "16579"), rawDashboard.foundry || (stryMutAct_9fa48("16580") ? {} : (stryCov_9fa48("16580"), {
            backlogItems: 0,
            technicalDebt: 0,
            topPriority: null,
            nagMessage: null
          }))),
          revenue: stryMutAct_9fa48("16583") ? rawDashboard.revenue && {
            mrr: 0,
            arr: 0,
            runwayMonths: 0,
            pricingAdvice: null
          } : stryMutAct_9fa48("16582") ? false : stryMutAct_9fa48("16581") ? true : (stryCov_9fa48("16581", "16582", "16583"), rawDashboard.revenue || (stryMutAct_9fa48("16584") ? {} : (stryCov_9fa48("16584"), {
            mrr: 0,
            arr: 0,
            runwayMonths: 0,
            pricingAdvice: null
          }))),
          support: stryMutAct_9fa48("16587") ? rawDashboard.support && {
            openTickets: 0,
            atRiskCustomers: 0,
            avgResponseTime: 0
          } : stryMutAct_9fa48("16586") ? false : stryMutAct_9fa48("16585") ? true : (stryCov_9fa48("16585", "16586", "16587"), rawDashboard.support || (stryMutAct_9fa48("16588") ? {} : (stryCov_9fa48("16588"), {
            openTickets: 0,
            atRiskCustomers: 0,
            avgResponseTime: 0
          }))),
          watch: stryMutAct_9fa48("16591") ? rawDashboard.watch && {
            activeAlerts: 0,
            criticalAlert: null,
            competitorsTracked: 0
          } : stryMutAct_9fa48("16590") ? false : stryMutAct_9fa48("16589") ? true : (stryCov_9fa48("16589", "16590", "16591"), rawDashboard.watch || (stryMutAct_9fa48("16592") ? {} : (stryCov_9fa48("16592"), {
            activeAlerts: 0,
            criticalAlert: null,
            competitorsTracked: 0
          })))
        }));
        console.log('[Core] Loaded dashboard from API');
      }
      const contentPayload = contentRes as any;
      const rawContent = stryMutAct_9fa48("16594") ? contentPayload.content && contentPayload.data?.content : (stryCov_9fa48("16594"), contentPayload.content ?? (stryMutAct_9fa48("16595") ? contentPayload.data.content : (stryCov_9fa48("16595"), contentPayload.data?.content)));
      if (stryMutAct_9fa48("16598") ? contentPayload.success !== false && rawContent || Array.isArray(rawContent) : stryMutAct_9fa48("16597") ? false : stryMutAct_9fa48("16596") ? true : (stryCov_9fa48("16596", "16597", "16598"), (stryMutAct_9fa48("16600") ? contentPayload.success !== false || rawContent : stryMutAct_9fa48("16599") ? true : (stryCov_9fa48("16599", "16600"), (stryMutAct_9fa48("16602") ? contentPayload.success === false : stryMutAct_9fa48("16601") ? true : (stryCov_9fa48("16601", "16602"), contentPayload.success !== (stryMutAct_9fa48("16603") ? true : (stryCov_9fa48("16603"), false)))) && rawContent)) && Array.isArray(rawContent))) {
        setContentQueue(rawContent.map(stryMutAct_9fa48("16605") ? () => undefined : (stryCov_9fa48("16605"), (c: any) => stryMutAct_9fa48("16606") ? {} : (stryCov_9fa48("16606"), {
          id: c.id,
          type: stryMutAct_9fa48("16609") ? c.type && 'blog' : stryMutAct_9fa48("16608") ? false : stryMutAct_9fa48("16607") ? true : (stryCov_9fa48("16607", "16608", "16609"), c.type || 'blog'),
          title: stryMutAct_9fa48("16613") ? c.title && c.name : stryMutAct_9fa48("16612") ? false : stryMutAct_9fa48("16611") ? true : (stryCov_9fa48("16611", "16612", "16613"), c.title || c.name),
          status: stryMutAct_9fa48("16616") ? c.status && 'draft' : stryMutAct_9fa48("16615") ? false : stryMutAct_9fa48("16614") ? true : (stryCov_9fa48("16614", "16615", "16616"), c.status || 'draft'),
          scheduledFor: c.scheduledFor
        }))));
        console.log('[Core] Loaded', rawContent.length, 'content items from API');
      }
    } catch (error) {
      console.error('[Core] Failed to load from API, using fallback:', error);
      // Fallback data
      setMetrics(stryMutAct_9fa48("16622") ? {} : (stryCov_9fa48("16622"), {
        brand: stryMutAct_9fa48("16623") ? {} : (stryCov_9fa48("16623"), {
          contentQueue: 5,
          scheduledPosts: 3,
          voiceScore: 92
        }),
        foundry: stryMutAct_9fa48("16624") ? {} : (stryCov_9fa48("16624"), {
          backlogItems: 12,
          technicalDebt: 4,
          topPriority: 'CendiaVoice Enhancement',
          nagMessage: null
        }),
        revenue: stryMutAct_9fa48("16626") ? {} : (stryCov_9fa48("16626"), {
          mrr: 15000,
          arr: 180000,
          runwayMonths: 18,
          pricingAdvice: 'Consider 15% price increase on Enterprise tier'
        }),
        support: stryMutAct_9fa48("16628") ? {} : (stryCov_9fa48("16628"), {
          openTickets: 3,
          atRiskCustomers: 1,
          avgResponseTime: 2.4
        }),
        watch: stryMutAct_9fa48("16629") ? {} : (stryCov_9fa48("16629"), {
          activeAlerts: 2,
          criticalAlert: null,
          competitorsTracked: 8
        })
      }));
      setContentQueue(stryMutAct_9fa48("16630") ? [] : (stryCov_9fa48("16630"), [stryMutAct_9fa48("16631") ? {} : (stryCov_9fa48("16631"), {
        id: '1',
        type: 'linkedin',
        title: 'Pre-Mortem Feature Launch',
        status: 'draft'
      }), stryMutAct_9fa48("16636") ? {} : (stryCov_9fa48("16636"), {
        id: '2',
        type: 'blog',
        title: 'Why AI Councils Beat Single Agents',
        status: 'approved'
      }), stryMutAct_9fa48("16641") ? {} : (stryCov_9fa48("16641"), {
        id: '3',
        type: 'newsletter',
        title: 'Week 48 Update',
        status: 'scheduled',
        scheduledFor: 'Monday 9am'
      })]));
    } finally {
      setLoading(stryMutAct_9fa48("16648") ? true : (stryCov_9fa48("16648"), false));
    }
  };
  const generateContent = async (type: string) => {
    setGenerating(stryMutAct_9fa48("16650") ? false : (stryCov_9fa48("16650"), true));
    try {
      // Call real API to generate content
      const res = await api.post<any>('/core/brand/generate/linkedin', stryMutAct_9fa48("16653") ? {} : (stryCov_9fa48("16653"), {
        featureName: `${type} content`,
        featureDescription: `Auto-generated ${type} content`
      }));
      const payload = res as any;
      if (stryMutAct_9fa48("16658") ? payload.success === false : stryMutAct_9fa48("16657") ? false : stryMutAct_9fa48("16656") ? true : (stryCov_9fa48("16656", "16657", "16658"), payload.success !== (stryMutAct_9fa48("16659") ? true : (stryCov_9fa48("16659"), false)))) {
        const data = stryMutAct_9fa48("16661") ? payload.data && payload : (stryCov_9fa48("16661"), payload.data ?? payload);
        if (stryMutAct_9fa48("16663") ? false : stryMutAct_9fa48("16662") ? true : (stryCov_9fa48("16662", "16663"), data.post)) {
          setContentQueue(stryMutAct_9fa48("16665") ? () => undefined : (stryCov_9fa48("16665"), prev => stryMutAct_9fa48("16666") ? [] : (stryCov_9fa48("16666"), [stryMutAct_9fa48("16667") ? {} : (stryCov_9fa48("16667"), {
            id: Date.now().toString(),
            type: type as any,
            title: stryMutAct_9fa48("16670") ? data.post.title && `Generated ${type} post` : stryMutAct_9fa48("16669") ? false : stryMutAct_9fa48("16668") ? true : (stryCov_9fa48("16668", "16669", "16670"), data.post.title || `Generated ${type} post`),
            status: 'draft'
          }), ...prev])));
          console.log('[Core] Generated content via API');
          return;
        }
      }
    } catch (error) {
      console.error('[Core] Content generation failed:', error);
    }

    // Fallback
    setContentQueue(stryMutAct_9fa48("16676") ? () => undefined : (stryCov_9fa48("16676"), prev => stryMutAct_9fa48("16677") ? [] : (stryCov_9fa48("16677"), [stryMutAct_9fa48("16678") ? {} : (stryCov_9fa48("16678"), {
      id: Date.now().toString(),
      type: type as any,
      title: `Generated ${type} post`,
      status: 'draft'
    }), ...prev])));
    setGenerating(stryMutAct_9fa48("16681") ? true : (stryCov_9fa48("16681"), false));
  };
  if (stryMutAct_9fa48("16683") ? false : stryMutAct_9fa48("16682") ? true : (stryCov_9fa48("16682", "16683"), loading)) {
    return <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 text-amber-500 mx-auto mb-4 animate-pulse" />
          <p className="text-neutral-400">Loading Datacendia Core...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Crown className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Datacendia Core</h1>
            <p className="text-neutral-400">Internal Admin Suite • Dogfooding Mode</p>
          </div>
        </div>
        <p className="text-neutral-500 mt-4 max-w-2xl">
          "I don't just sell this. I run my entire company on it." — The ultimate proof of confidence.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {(stryMutAct_9fa48("16685") ? [] : (stryCov_9fa48("16685"), [stryMutAct_9fa48("16686") ? {} : (stryCov_9fa48("16686"), {
          label: 'MRR',
          value: `$${stryMutAct_9fa48("16689") ? metrics.revenue.mrr.toLocaleString() : (stryCov_9fa48("16689"), metrics?.revenue.mrr.toLocaleString())}`,
          icon: DollarSign,
          color: 'text-emerald-400'
        }), stryMutAct_9fa48("16691") ? {} : (stryCov_9fa48("16691"), {
          label: 'Runway',
          value: `${stryMutAct_9fa48("16694") ? metrics.revenue.runwayMonths : (stryCov_9fa48("16694"), metrics?.revenue.runwayMonths)} mo`,
          icon: Clock,
          color: 'text-blue-400'
        }), stryMutAct_9fa48("16696") ? {} : (stryCov_9fa48("16696"), {
          label: 'Open Tickets',
          value: stryMutAct_9fa48("16698") ? metrics.support.openTickets : (stryCov_9fa48("16698"), metrics?.support.openTickets),
          icon: HeadphonesIcon,
          color: 'text-amber-400'
        }), stryMutAct_9fa48("16700") ? {} : (stryCov_9fa48("16700"), {
          label: 'Alerts',
          value: stryMutAct_9fa48("16702") ? metrics.watch.activeAlerts : (stryCov_9fa48("16702"), metrics?.watch.activeAlerts),
          icon: AlertTriangle,
          color: 'text-red-400'
        }), stryMutAct_9fa48("16704") ? {} : (stryCov_9fa48("16704"), {
          label: 'Content Queue',
          value: stryMutAct_9fa48("16706") ? metrics.brand.contentQueue : (stryCov_9fa48("16706"), metrics?.brand.contentQueue),
          icon: FileText,
          color: 'text-purple-400'
        })])).map(stryMutAct_9fa48("16708") ? () => undefined : (stryCov_9fa48("16708"), (stat, i) => <div key={i} className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-sm text-neutral-500">{stat.label}</span>
              </div>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>))}
        </div>
      </div>

      {/* Service Navigation */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CoreServices.map(stryMutAct_9fa48("16711") ? () => undefined : (stryCov_9fa48("16711"), service => <button key={service.id} onClick={stryMutAct_9fa48("16712") ? () => undefined : (stryCov_9fa48("16712"), () => setActiveService(service.id))} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${(stryMutAct_9fa48("16716") ? activeService !== service.id : stryMutAct_9fa48("16715") ? false : stryMutAct_9fa48("16714") ? true : (stryCov_9fa48("16714", "16715", "16716"), activeService === service.id)) ? 'bg-neutral-800 border border-neutral-700' : 'bg-neutral-900/50 border border-neutral-800/50 hover:border-neutral-700'}`}>
              <service.icon className="w-4 h-4" style={stryMutAct_9fa48("16719") ? {} : (stryCov_9fa48("16719"), {
            color: service.color
          })} />
              <span className="text-sm text-white">{service.name}</span>
            </button>))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Service Detail Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Service Card */}
          {stryMutAct_9fa48("16720") ? CoreServices.map(service => <div key={service.id} className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{
                backgroundColor: `${service.color}20`
              }}>
                    <service.icon className="w-7 h-7" style={{
                  color: service.color
                }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{service.name}</h2>
                    <p className="text-neutral-400">{service.agent}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-neutral-800 rounded-lg transition-colors">
                  <Settings className="w-5 h-5 text-neutral-500" />
                </button>
              </div>
              <p className="text-neutral-400 mb-6">{service.description}</p>
              <div className="flex flex-wrap gap-2">
                {service.features.map((feature, i) => <span key={i} className="px-3 py-1 rounded-full text-sm" style={{
              backgroundColor: `${service.color}15`,
              color: service.color
            }}>
                    {feature}
                  </span>)}
              </div>
            </div>) : (stryCov_9fa48("16720"), CoreServices.filter(stryMutAct_9fa48("16721") ? () => undefined : (stryCov_9fa48("16721"), s => stryMutAct_9fa48("16724") ? s.id !== activeService : stryMutAct_9fa48("16723") ? false : stryMutAct_9fa48("16722") ? true : (stryCov_9fa48("16722", "16723", "16724"), s.id === activeService))).map(stryMutAct_9fa48("16725") ? () => undefined : (stryCov_9fa48("16725"), service => <div key={service.id} className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={stryMutAct_9fa48("16726") ? {} : (stryCov_9fa48("16726"), {
                backgroundColor: `${service.color}20`
              })}>
                    <service.icon className="w-7 h-7" style={stryMutAct_9fa48("16728") ? {} : (stryCov_9fa48("16728"), {
                  color: service.color
                })} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{service.name}</h2>
                    <p className="text-neutral-400">{service.agent}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-neutral-800 rounded-lg transition-colors">
                  <Settings className="w-5 h-5 text-neutral-500" />
                </button>
              </div>
              <p className="text-neutral-400 mb-6">{service.description}</p>
              <div className="flex flex-wrap gap-2">
                {service.features.map(stryMutAct_9fa48("16729") ? () => undefined : (stryCov_9fa48("16729"), (feature, i) => <span key={i} className="px-3 py-1 rounded-full text-sm" style={stryMutAct_9fa48("16730") ? {} : (stryCov_9fa48("16730"), {
              backgroundColor: `${service.color}15`,
              color: service.color
            })}>
                    {feature}
                  </span>))}
              </div>
            </div>)))}

          {/* Brand Content Section */}
          {stryMutAct_9fa48("16734") ? activeService === 'brand' || <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Content Queue</h3>
                <div className="flex gap-2">
                  <button onClick={() => generateContent('linkedin')} disabled={generating} className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg text-sm transition-colors disabled:opacity-50">
                    {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Generate Post
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {contentQueue.map(item => <div key={item.id} className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${item.status === 'scheduled' ? 'bg-green-400' : item.status === 'approved' ? 'bg-blue-400' : 'bg-amber-400'}`} />
                      <div>
                        <p className="text-white text-sm">{item.title}</p>
                        <p className="text-neutral-500 text-xs capitalize">{item.type} • {item.status}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {item.status === 'draft' && <button className="p-2 hover:bg-neutral-700 rounded-lg transition-colors">
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        </button>}
                      {item.status === 'approved' && <button className="p-2 hover:bg-neutral-700 rounded-lg transition-colors">
                          <Calendar className="w-4 h-4 text-blue-400" />
                        </button>}
                      <button className="p-2 hover:bg-neutral-700 rounded-lg transition-colors">
                        <ChevronRight className="w-4 h-4 text-neutral-400" />
                      </button>
                    </div>
                  </div>)}
              </div>
            </div> : stryMutAct_9fa48("16733") ? false : stryMutAct_9fa48("16732") ? true : (stryCov_9fa48("16732", "16733", "16734"), (stryMutAct_9fa48("16736") ? activeService !== 'brand' : stryMutAct_9fa48("16735") ? true : (stryCov_9fa48("16735", "16736"), activeService === 'brand')) && <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Content Queue</h3>
                <div className="flex gap-2">
                  <button onClick={stryMutAct_9fa48("16738") ? () => undefined : (stryCov_9fa48("16738"), () => generateContent('linkedin'))} disabled={generating} className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg text-sm transition-colors disabled:opacity-50">
                    {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Generate Post
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {contentQueue.map(stryMutAct_9fa48("16740") ? () => undefined : (stryCov_9fa48("16740"), item => <div key={item.id} className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${(stryMutAct_9fa48("16744") ? item.status !== 'scheduled' : stryMutAct_9fa48("16743") ? false : stryMutAct_9fa48("16742") ? true : (stryCov_9fa48("16742", "16743", "16744"), item.status === 'scheduled')) ? 'bg-green-400' : (stryMutAct_9fa48("16749") ? item.status !== 'approved' : stryMutAct_9fa48("16748") ? false : stryMutAct_9fa48("16747") ? true : (stryCov_9fa48("16747", "16748", "16749"), item.status === 'approved')) ? 'bg-blue-400' : 'bg-amber-400'}`} />
                      <div>
                        <p className="text-white text-sm">{item.title}</p>
                        <p className="text-neutral-500 text-xs capitalize">{item.type} • {item.status}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {stryMutAct_9fa48("16755") ? item.status === 'draft' || <button className="p-2 hover:bg-neutral-700 rounded-lg transition-colors">
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        </button> : stryMutAct_9fa48("16754") ? false : stryMutAct_9fa48("16753") ? true : (stryCov_9fa48("16753", "16754", "16755"), (stryMutAct_9fa48("16757") ? item.status !== 'draft' : stryMutAct_9fa48("16756") ? true : (stryCov_9fa48("16756", "16757"), item.status === 'draft')) && <button className="p-2 hover:bg-neutral-700 rounded-lg transition-colors">
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        </button>)}
                      {stryMutAct_9fa48("16761") ? item.status === 'approved' || <button className="p-2 hover:bg-neutral-700 rounded-lg transition-colors">
                          <Calendar className="w-4 h-4 text-blue-400" />
                        </button> : stryMutAct_9fa48("16760") ? false : stryMutAct_9fa48("16759") ? true : (stryCov_9fa48("16759", "16760", "16761"), (stryMutAct_9fa48("16763") ? item.status !== 'approved' : stryMutAct_9fa48("16762") ? true : (stryCov_9fa48("16762", "16763"), item.status === 'approved')) && <button className="p-2 hover:bg-neutral-700 rounded-lg transition-colors">
                          <Calendar className="w-4 h-4 text-blue-400" />
                        </button>)}
                      <button className="p-2 hover:bg-neutral-700 rounded-lg transition-colors">
                        <ChevronRight className="w-4 h-4 text-neutral-400" />
                      </button>
                    </div>
                  </div>))}
              </div>
            </div>)}

          {/* Revenue Section */}
          {stryMutAct_9fa48("16767") ? activeService === 'revenue' && metrics || <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Financial Health</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-neutral-800/50 rounded-xl p-4">
                  <p className="text-neutral-500 text-sm mb-1">Monthly Recurring Revenue</p>
                  <p className="text-2xl font-bold text-emerald-400">${metrics.revenue.mrr.toLocaleString()}</p>
                </div>
                <div className="bg-neutral-800/50 rounded-xl p-4">
                  <p className="text-neutral-500 text-sm mb-1">Annual Run Rate</p>
                  <p className="text-2xl font-bold text-emerald-400">${metrics.revenue.arr.toLocaleString()}</p>
                </div>
                <div className="bg-neutral-800/50 rounded-xl p-4">
                  <p className="text-neutral-500 text-sm mb-1">Runway</p>
                  <p className="text-2xl font-bold text-blue-400">{metrics.revenue.runwayMonths} months</p>
                </div>
                <div className="bg-neutral-800/50 rounded-xl p-4">
                  <p className="text-neutral-500 text-sm mb-1">LTV:CAC Ratio</p>
                  <p className="text-2xl font-bold text-purple-400">4.2x</p>
                </div>
              </div>
              {metrics.revenue.pricingAdvice && <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 text-sm font-medium">Pricing Insight</span>
                  </div>
                  <p className="text-neutral-300 text-sm">{metrics.revenue.pricingAdvice}</p>
                </div>}
            </div> : stryMutAct_9fa48("16766") ? false : stryMutAct_9fa48("16765") ? true : (stryCov_9fa48("16765", "16766", "16767"), (stryMutAct_9fa48("16769") ? activeService === 'revenue' || metrics : stryMutAct_9fa48("16768") ? true : (stryCov_9fa48("16768", "16769"), (stryMutAct_9fa48("16771") ? activeService !== 'revenue' : stryMutAct_9fa48("16770") ? true : (stryCov_9fa48("16770", "16771"), activeService === 'revenue')) && metrics)) && <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Financial Health</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-neutral-800/50 rounded-xl p-4">
                  <p className="text-neutral-500 text-sm mb-1">Monthly Recurring Revenue</p>
                  <p className="text-2xl font-bold text-emerald-400">${metrics.revenue.mrr.toLocaleString()}</p>
                </div>
                <div className="bg-neutral-800/50 rounded-xl p-4">
                  <p className="text-neutral-500 text-sm mb-1">Annual Run Rate</p>
                  <p className="text-2xl font-bold text-emerald-400">${metrics.revenue.arr.toLocaleString()}</p>
                </div>
                <div className="bg-neutral-800/50 rounded-xl p-4">
                  <p className="text-neutral-500 text-sm mb-1">Runway</p>
                  <p className="text-2xl font-bold text-blue-400">{metrics.revenue.runwayMonths} months</p>
                </div>
                <div className="bg-neutral-800/50 rounded-xl p-4">
                  <p className="text-neutral-500 text-sm mb-1">LTV:CAC Ratio</p>
                  <p className="text-2xl font-bold text-purple-400">4.2x</p>
                </div>
              </div>
              {stryMutAct_9fa48("16775") ? metrics.revenue.pricingAdvice || <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 text-sm font-medium">Pricing Insight</span>
                  </div>
                  <p className="text-neutral-300 text-sm">{metrics.revenue.pricingAdvice}</p>
                </div> : stryMutAct_9fa48("16774") ? false : stryMutAct_9fa48("16773") ? true : (stryCov_9fa48("16773", "16774", "16775"), metrics.revenue.pricingAdvice && <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 text-sm font-medium">Pricing Insight</span>
                  </div>
                  <p className="text-neutral-300 text-sm">{metrics.revenue.pricingAdvice}</p>
                </div>)}
            </div>)}

          {/* Foundry Section */}
          {stryMutAct_9fa48("16778") ? activeService === 'foundry' && metrics || <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Product Health</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-neutral-800/50 rounded-xl p-4">
                  <p className="text-neutral-500 text-sm mb-1">Backlog Items</p>
                  <p className="text-2xl font-bold text-amber-400">{metrics.foundry.backlogItems}</p>
                </div>
                <div className="bg-neutral-800/50 rounded-xl p-4">
                  <p className="text-neutral-500 text-sm mb-1">Technical Debt</p>
                  <p className="text-2xl font-bold text-red-400">{metrics.foundry.technicalDebt}</p>
                </div>
              </div>
              {metrics.foundry.topPriority && <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-400 text-sm font-medium">Top Priority</span>
                  </div>
                  <p className="text-white">{metrics.foundry.topPriority}</p>
                </div>}
              {metrics.foundry.nagMessage && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-sm font-medium">Foundry Nag</span>
                  </div>
                  <p className="text-neutral-300 text-sm">{metrics.foundry.nagMessage}</p>
                </div>}
            </div> : stryMutAct_9fa48("16777") ? false : stryMutAct_9fa48("16776") ? true : (stryCov_9fa48("16776", "16777", "16778"), (stryMutAct_9fa48("16780") ? activeService === 'foundry' || metrics : stryMutAct_9fa48("16779") ? true : (stryCov_9fa48("16779", "16780"), (stryMutAct_9fa48("16782") ? activeService !== 'foundry' : stryMutAct_9fa48("16781") ? true : (stryCov_9fa48("16781", "16782"), activeService === 'foundry')) && metrics)) && <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Product Health</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-neutral-800/50 rounded-xl p-4">
                  <p className="text-neutral-500 text-sm mb-1">Backlog Items</p>
                  <p className="text-2xl font-bold text-amber-400">{metrics.foundry.backlogItems}</p>
                </div>
                <div className="bg-neutral-800/50 rounded-xl p-4">
                  <p className="text-neutral-500 text-sm mb-1">Technical Debt</p>
                  <p className="text-2xl font-bold text-red-400">{metrics.foundry.technicalDebt}</p>
                </div>
              </div>
              {stryMutAct_9fa48("16786") ? metrics.foundry.topPriority || <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-400 text-sm font-medium">Top Priority</span>
                  </div>
                  <p className="text-white">{metrics.foundry.topPriority}</p>
                </div> : stryMutAct_9fa48("16785") ? false : stryMutAct_9fa48("16784") ? true : (stryCov_9fa48("16784", "16785", "16786"), metrics.foundry.topPriority && <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-400 text-sm font-medium">Top Priority</span>
                  </div>
                  <p className="text-white">{metrics.foundry.topPriority}</p>
                </div>)}
              {stryMutAct_9fa48("16789") ? metrics.foundry.nagMessage || <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-sm font-medium">Foundry Nag</span>
                  </div>
                  <p className="text-neutral-300 text-sm">{metrics.foundry.nagMessage}</p>
                </div> : stryMutAct_9fa48("16788") ? false : stryMutAct_9fa48("16787") ? true : (stryCov_9fa48("16787", "16788", "16789"), metrics.foundry.nagMessage && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-sm font-medium">Foundry Nag</span>
                  </div>
                  <p className="text-neutral-300 text-sm">{metrics.foundry.nagMessage}</p>
                </div>)}
            </div>)}

          {/* Watch Section */}
          {stryMutAct_9fa48("16792") ? activeService === 'watch' && metrics || <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Market Intelligence</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-neutral-800/50 rounded-xl p-4">
                  <p className="text-neutral-500 text-sm mb-1">Competitors Tracked</p>
                  <p className="text-2xl font-bold text-blue-400">{metrics.watch.competitorsTracked}</p>
                </div>
                <div className="bg-neutral-800/50 rounded-xl p-4">
                  <p className="text-neutral-500 text-sm mb-1">Active Alerts</p>
                  <p className="text-2xl font-bold text-red-400">{metrics.watch.activeAlerts}</p>
                </div>
              </div>
              {metrics.watch.criticalAlert && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-sm font-medium">Critical Alert</span>
                  </div>
                  <p className="text-neutral-300 text-sm">{metrics.watch.criticalAlert}</p>
                </div>}
              <div className="mt-4 space-y-2">
                <p className="text-neutral-500 text-sm">Tracked Keywords:</p>
                <div className="flex flex-wrap gap-2">
                  {['Sovereign AI', 'Palantir', 'AI Council', 'Enterprise AI'].map((kw, i) => <span key={i} className="px-2 py-1 bg-neutral-800 rounded text-xs text-neutral-400">{kw}</span>)}
                </div>
              </div>
            </div> : stryMutAct_9fa48("16791") ? false : stryMutAct_9fa48("16790") ? true : (stryCov_9fa48("16790", "16791", "16792"), (stryMutAct_9fa48("16794") ? activeService === 'watch' || metrics : stryMutAct_9fa48("16793") ? true : (stryCov_9fa48("16793", "16794"), (stryMutAct_9fa48("16796") ? activeService !== 'watch' : stryMutAct_9fa48("16795") ? true : (stryCov_9fa48("16795", "16796"), activeService === 'watch')) && metrics)) && <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Market Intelligence</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-neutral-800/50 rounded-xl p-4">
                  <p className="text-neutral-500 text-sm mb-1">Competitors Tracked</p>
                  <p className="text-2xl font-bold text-blue-400">{metrics.watch.competitorsTracked}</p>
                </div>
                <div className="bg-neutral-800/50 rounded-xl p-4">
                  <p className="text-neutral-500 text-sm mb-1">Active Alerts</p>
                  <p className="text-2xl font-bold text-red-400">{metrics.watch.activeAlerts}</p>
                </div>
              </div>
              {stryMutAct_9fa48("16800") ? metrics.watch.criticalAlert || <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-sm font-medium">Critical Alert</span>
                  </div>
                  <p className="text-neutral-300 text-sm">{metrics.watch.criticalAlert}</p>
                </div> : stryMutAct_9fa48("16799") ? false : stryMutAct_9fa48("16798") ? true : (stryCov_9fa48("16798", "16799", "16800"), metrics.watch.criticalAlert && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-sm font-medium">Critical Alert</span>
                  </div>
                  <p className="text-neutral-300 text-sm">{metrics.watch.criticalAlert}</p>
                </div>)}
              <div className="mt-4 space-y-2">
                <p className="text-neutral-500 text-sm">Tracked Keywords:</p>
                <div className="flex flex-wrap gap-2">
                  {(stryMutAct_9fa48("16801") ? [] : (stryCov_9fa48("16801"), ['Sovereign AI', 'Palantir', 'AI Council', 'Enterprise AI'])).map(stryMutAct_9fa48("16806") ? () => undefined : (stryCov_9fa48("16806"), (kw, i) => <span key={i} className="px-2 py-1 bg-neutral-800 rounded text-xs text-neutral-400">{kw}</span>))}
                </div>
              </div>
            </div>)}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {(stryMutAct_9fa48("16807") ? [] : (stryCov_9fa48("16807"), [stryMutAct_9fa48("16808") ? {} : (stryCov_9fa48("16808"), {
              icon: Sparkles,
              label: 'Generate Marketing Package',
              color: 'text-purple-400'
            }), stryMutAct_9fa48("16811") ? {} : (stryCov_9fa48("16811"), {
              icon: BarChart3,
              label: 'Run Pricing Analysis',
              color: 'text-emerald-400'
            }), stryMutAct_9fa48("16814") ? {} : (stryCov_9fa48("16814"), {
              icon: Eye,
              label: 'Scan Competitors',
              color: 'text-red-400'
            }), stryMutAct_9fa48("16817") ? {} : (stryCov_9fa48("16817"), {
              icon: Brain,
              label: 'Consult the Regent',
              color: 'text-amber-400'
            }), stryMutAct_9fa48("16820") ? {} : (stryCov_9fa48("16820"), {
              icon: RefreshCw,
              label: 'Sync Stripe Data',
              color: 'text-blue-400'
            })])).map(stryMutAct_9fa48("16823") ? () => undefined : (stryCov_9fa48("16823"), (action, i) => <button key={i} className="w-full flex items-center gap-3 p-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-xl transition-colors text-left">
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                  <span className="text-sm text-neutral-300">{action.label}</span>
                  <ArrowRight className="w-4 h-4 text-neutral-600 ml-auto" />
                </button>))}
            </div>
          </div>

          {/* The Mirror */}
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">The Mirror</h3>
                <p className="text-amber-400/70 text-xs">Truth no one else will tell</p>
              </div>
            </div>
            <p className="text-neutral-300 text-sm italic">
              "You're spending too much time on features and not enough on distribution. 
              The best product doesn't win—the best-known product wins."
            </p>
            <button className="mt-4 text-amber-400 text-sm hover:text-amber-300 transition-colors flex items-center gap-1">
              Ask the Mirror <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Sovereign Stack Status */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                  <Server className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Sovereign Stack</h3>
                  <p className="text-indigo-400/70 text-xs">Infrastructure Status</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/20 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-400 font-medium">Online</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="flex items-center gap-2 p-2 bg-neutral-800/50 rounded-lg">
                <Database className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-neutral-300">PostgreSQL</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-neutral-800/50 rounded-lg">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-xs text-neutral-300">Druid</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-neutral-800/50 rounded-lg">
                <HardDrive className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-neutral-300">MinIO</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-neutral-800/50 rounded-lg">
                <Activity className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-neutral-300">Grafana</span>
              </div>
            </div>
            <Link to="/admin/sovereign-stack" className="flex items-center justify-center gap-2 w-full py-2 bg-indigo-500/20 hover:bg-indigo-500/30 rounded-lg text-indigo-400 text-sm transition-colors">
              <ExternalLink className="w-4 h-4" />
              Open Infrastructure
            </Link>
          </div>

          {/* Activity Feed */}
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {(stryMutAct_9fa48("16825") ? [] : (stryCov_9fa48("16825"), [stryMutAct_9fa48("16826") ? {} : (stryCov_9fa48("16826"), {
              time: '2m ago',
              text: 'CendiaBrand generated LinkedIn post',
              icon: Megaphone,
              color: 'text-purple-400'
            }), stryMutAct_9fa48("16830") ? {} : (stryCov_9fa48("16830"), {
              time: '1h ago',
              text: 'New support ticket triaged',
              icon: HeadphonesIcon,
              color: 'text-blue-400'
            }), stryMutAct_9fa48("16834") ? {} : (stryCov_9fa48("16834"), {
              time: '3h ago',
              text: 'Competitor alert: Palantir AIP update',
              icon: Eye,
              color: 'text-red-400'
            }), stryMutAct_9fa48("16838") ? {} : (stryCov_9fa48("16838"), {
              time: '1d ago',
              text: 'Pricing analysis complete',
              icon: DollarSign,
              color: 'text-emerald-400'
            })])).map(stryMutAct_9fa48("16842") ? () => undefined : (stryCov_9fa48("16842"), (item, i) => <div key={i} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center flex-shrink-0`}>
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-300">{item.text}</p>
                    <p className="text-xs text-neutral-600">{item.time}</p>
                  </div>
                </div>))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Dogfood Message */}
      <div className="max-w-7xl mx-auto mt-12 text-center">
        <p className="text-neutral-600 text-sm">
          🐕 Dogfooding Mode Active • Datacendia runs on Datacendia
        </p>
      </div>
    </div>;
}