/**
 * DATACENDIA ONBOARDING WIZARD
 * First-time user experience with guided setup
 */
// @ts-nocheck
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
import { useNavigate } from 'react-router-dom';
import { Building2, Users, Database, Sparkles, Shield, Check, ChevronRight, ChevronLeft, Zap, Target, Brain, BarChart3 } from 'lucide-react';

// Step configuration
const STEPS = stryMutAct_9fa48("51096") ? [] : (stryCov_9fa48("51096"), [stryMutAct_9fa48("51097") ? {} : (stryCov_9fa48("51097"), {
  id: 'welcome',
  title: 'Welcome',
  icon: Sparkles
}), stryMutAct_9fa48("51100") ? {} : (stryCov_9fa48("51100"), {
  id: 'organization',
  title: 'Organization',
  icon: Building2
}), stryMutAct_9fa48("51103") ? {} : (stryCov_9fa48("51103"), {
  id: 'team',
  title: 'Team',
  icon: Users
}), stryMutAct_9fa48("51106") ? {} : (stryCov_9fa48("51106"), {
  id: 'data',
  title: 'Data Sources',
  icon: Database
}), stryMutAct_9fa48("51109") ? {} : (stryCov_9fa48("51109"), {
  id: 'goals',
  title: 'Goals',
  icon: Target
}), stryMutAct_9fa48("51112") ? {} : (stryCov_9fa48("51112"), {
  id: 'complete',
  title: 'Ready!',
  icon: Check
})]);
interface OnboardingData {
  organization: {
    name: string;
    industry: string;
    size: string;
  };
  team: {
    invites: string[];
  };
  dataSources: string[];
  goals: string[];
}
export const OnboardingWizard: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("51116") ? true : (stryCov_9fa48("51116"), false));
  const [data, setData] = useState<OnboardingData>(stryMutAct_9fa48("51117") ? {} : (stryCov_9fa48("51117"), {
    organization: stryMutAct_9fa48("51118") ? {} : (stryCov_9fa48("51118"), {
      name: '',
      industry: '',
      size: ''
    }),
    team: stryMutAct_9fa48("51122") ? {} : (stryCov_9fa48("51122"), {
      invites: stryMutAct_9fa48("51123") ? [] : (stryCov_9fa48("51123"), [''])
    }),
    dataSources: stryMutAct_9fa48("51125") ? ["Stryker was here"] : (stryCov_9fa48("51125"), []),
    goals: stryMutAct_9fa48("51126") ? ["Stryker was here"] : (stryCov_9fa48("51126"), [])
  }));
  const currentStepConfig = STEPS[currentStep];
  const progress = stryMutAct_9fa48("51127") ? (currentStep + 1) / STEPS.length / 100 : (stryCov_9fa48("51127"), (stryMutAct_9fa48("51128") ? (currentStep + 1) * STEPS.length : (stryCov_9fa48("51128"), (stryMutAct_9fa48("51129") ? currentStep - 1 : (stryCov_9fa48("51129"), currentStep + 1)) / STEPS.length)) * 100);
  const handleNext = async () => {
    if (stryMutAct_9fa48("51134") ? currentStep >= STEPS.length - 1 : stryMutAct_9fa48("51133") ? currentStep <= STEPS.length - 1 : stryMutAct_9fa48("51132") ? false : stryMutAct_9fa48("51131") ? true : (stryCov_9fa48("51131", "51132", "51133", "51134"), currentStep < (stryMutAct_9fa48("51135") ? STEPS.length + 1 : (stryCov_9fa48("51135"), STEPS.length - 1)))) {
      setCurrentStep(stryMutAct_9fa48("51137") ? currentStep - 1 : (stryCov_9fa48("51137"), currentStep + 1));
    } else {
      // Complete onboarding
      setIsLoading(stryMutAct_9fa48("51139") ? false : (stryCov_9fa48("51139"), true));
      try {
        // Save onboarding data
        await fetch('/api/v1/organizations/current', stryMutAct_9fa48("51142") ? {} : (stryCov_9fa48("51142"), {
          method: 'PUT',
          headers: stryMutAct_9fa48("51144") ? {} : (stryCov_9fa48("51144"), {
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify(stryMutAct_9fa48("51146") ? {} : (stryCov_9fa48("51146"), {
            name: data.organization.name,
            industry: data.organization.industry,
            companySize: data.organization.size,
            settings: stryMutAct_9fa48("51147") ? {} : (stryCov_9fa48("51147"), {
              onboardingCompleted: stryMutAct_9fa48("51148") ? false : (stryCov_9fa48("51148"), true),
              goals: data.goals
            })
          }))
        }));
        navigate('/cortex');
      } catch (error) {
        console.error('Failed to save onboarding:', error);
      }
      setIsLoading(stryMutAct_9fa48("51152") ? true : (stryCov_9fa48("51152"), false));
    }
  };
  const handleBack = () => {
    if (stryMutAct_9fa48("51157") ? currentStep <= 0 : stryMutAct_9fa48("51156") ? currentStep >= 0 : stryMutAct_9fa48("51155") ? false : stryMutAct_9fa48("51154") ? true : (stryCov_9fa48("51154", "51155", "51156", "51157"), currentStep > 0)) {
      setCurrentStep(stryMutAct_9fa48("51159") ? currentStep + 1 : (stryCov_9fa48("51159"), currentStep - 1));
    }
  };
  const updateOrg = (field: string, value: string) => {
    setData(stryMutAct_9fa48("51161") ? () => undefined : (stryCov_9fa48("51161"), prev => stryMutAct_9fa48("51162") ? {} : (stryCov_9fa48("51162"), {
      ...prev,
      organization: stryMutAct_9fa48("51163") ? {} : (stryCov_9fa48("51163"), {
        ...prev.organization,
        [field]: value
      })
    })));
  };
  const toggleDataSource = (source: string) => {
    setData(stryMutAct_9fa48("51165") ? () => undefined : (stryCov_9fa48("51165"), prev => stryMutAct_9fa48("51166") ? {} : (stryCov_9fa48("51166"), {
      ...prev,
      dataSources: prev.dataSources.includes(source) ? stryMutAct_9fa48("51167") ? prev.dataSources : (stryCov_9fa48("51167"), prev.dataSources.filter(stryMutAct_9fa48("51168") ? () => undefined : (stryCov_9fa48("51168"), s => stryMutAct_9fa48("51171") ? s === source : stryMutAct_9fa48("51170") ? false : stryMutAct_9fa48("51169") ? true : (stryCov_9fa48("51169", "51170", "51171"), s !== source)))) : stryMutAct_9fa48("51172") ? [] : (stryCov_9fa48("51172"), [...prev.dataSources, source])
    })));
  };
  const toggleGoal = (goal: string) => {
    setData(stryMutAct_9fa48("51174") ? () => undefined : (stryCov_9fa48("51174"), prev => stryMutAct_9fa48("51175") ? {} : (stryCov_9fa48("51175"), {
      ...prev,
      goals: prev.goals.includes(goal) ? stryMutAct_9fa48("51176") ? prev.goals : (stryCov_9fa48("51176"), prev.goals.filter(stryMutAct_9fa48("51177") ? () => undefined : (stryCov_9fa48("51177"), g => stryMutAct_9fa48("51180") ? g === goal : stryMutAct_9fa48("51179") ? false : stryMutAct_9fa48("51178") ? true : (stryCov_9fa48("51178", "51179", "51180"), g !== goal)))) : stryMutAct_9fa48("51181") ? [] : (stryCov_9fa48("51181"), [...prev.goals, goal])
    })));
  };
  const addInvite = () => {
    setData(stryMutAct_9fa48("51183") ? () => undefined : (stryCov_9fa48("51183"), prev => stryMutAct_9fa48("51184") ? {} : (stryCov_9fa48("51184"), {
      ...prev,
      team: stryMutAct_9fa48("51185") ? {} : (stryCov_9fa48("51185"), {
        invites: stryMutAct_9fa48("51186") ? [] : (stryCov_9fa48("51186"), [...prev.team.invites, ''])
      })
    })));
  };
  const updateInvite = (index: number, value: string) => {
    setData(stryMutAct_9fa48("51189") ? () => undefined : (stryCov_9fa48("51189"), prev => stryMutAct_9fa48("51190") ? {} : (stryCov_9fa48("51190"), {
      ...prev,
      team: stryMutAct_9fa48("51191") ? {} : (stryCov_9fa48("51191"), {
        invites: prev.team.invites.map(stryMutAct_9fa48("51192") ? () => undefined : (stryCov_9fa48("51192"), (email, i) => (stryMutAct_9fa48("51195") ? i !== index : stryMutAct_9fa48("51194") ? false : stryMutAct_9fa48("51193") ? true : (stryCov_9fa48("51193", "51194", "51195"), i === index)) ? value : email))
      })
    })));
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {STEPS.map(stryMutAct_9fa48("51196") ? () => undefined : (stryCov_9fa48("51196"), (step, index) => <div key={step.id} className={`flex items-center gap-2 text-sm ${(stryMutAct_9fa48("51201") ? index > currentStep : stryMutAct_9fa48("51200") ? index < currentStep : stryMutAct_9fa48("51199") ? false : stryMutAct_9fa48("51198") ? true : (stryCov_9fa48("51198", "51199", "51200", "51201"), index <= currentStep)) ? 'text-purple-400' : 'text-slate-500'}`}>
                <step.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{step.title}</span>
              </div>))}
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-500" style={stryMutAct_9fa48("51204") ? {} : (stryCov_9fa48("51204"), {
            width: `${progress}%`
          })} />
          </div>
        </div>

        {/* Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-8">
          {/* Step Content */}
          <div className="min-h-[400px]">
            {stryMutAct_9fa48("51208") ? currentStepConfig.id === 'welcome' || <WelcomeStep /> : stryMutAct_9fa48("51207") ? false : stryMutAct_9fa48("51206") ? true : (stryCov_9fa48("51206", "51207", "51208"), (stryMutAct_9fa48("51210") ? currentStepConfig.id !== 'welcome' : stryMutAct_9fa48("51209") ? true : (stryCov_9fa48("51209", "51210"), currentStepConfig.id === 'welcome')) && <WelcomeStep />)}
            {stryMutAct_9fa48("51214") ? currentStepConfig.id === 'organization' || <OrganizationStep data={data.organization} update={updateOrg} /> : stryMutAct_9fa48("51213") ? false : stryMutAct_9fa48("51212") ? true : (stryCov_9fa48("51212", "51213", "51214"), (stryMutAct_9fa48("51216") ? currentStepConfig.id !== 'organization' : stryMutAct_9fa48("51215") ? true : (stryCov_9fa48("51215", "51216"), currentStepConfig.id === 'organization')) && <OrganizationStep data={data.organization} update={updateOrg} />)}
            {stryMutAct_9fa48("51220") ? currentStepConfig.id === 'team' || <TeamStep invites={data.team.invites} addInvite={addInvite} updateInvite={updateInvite} /> : stryMutAct_9fa48("51219") ? false : stryMutAct_9fa48("51218") ? true : (stryCov_9fa48("51218", "51219", "51220"), (stryMutAct_9fa48("51222") ? currentStepConfig.id !== 'team' : stryMutAct_9fa48("51221") ? true : (stryCov_9fa48("51221", "51222"), currentStepConfig.id === 'team')) && <TeamStep invites={data.team.invites} addInvite={addInvite} updateInvite={updateInvite} />)}
            {stryMutAct_9fa48("51226") ? currentStepConfig.id === 'data' || <DataSourcesStep selected={data.dataSources} toggle={toggleDataSource} /> : stryMutAct_9fa48("51225") ? false : stryMutAct_9fa48("51224") ? true : (stryCov_9fa48("51224", "51225", "51226"), (stryMutAct_9fa48("51228") ? currentStepConfig.id !== 'data' : stryMutAct_9fa48("51227") ? true : (stryCov_9fa48("51227", "51228"), currentStepConfig.id === 'data')) && <DataSourcesStep selected={data.dataSources} toggle={toggleDataSource} />)}
            {stryMutAct_9fa48("51232") ? currentStepConfig.id === 'goals' || <GoalsStep selected={data.goals} toggle={toggleGoal} /> : stryMutAct_9fa48("51231") ? false : stryMutAct_9fa48("51230") ? true : (stryCov_9fa48("51230", "51231", "51232"), (stryMutAct_9fa48("51234") ? currentStepConfig.id !== 'goals' : stryMutAct_9fa48("51233") ? true : (stryCov_9fa48("51233", "51234"), currentStepConfig.id === 'goals')) && <GoalsStep selected={data.goals} toggle={toggleGoal} />)}
            {stryMutAct_9fa48("51238") ? currentStepConfig.id === 'complete' || <CompleteStep data={data} /> : stryMutAct_9fa48("51237") ? false : stryMutAct_9fa48("51236") ? true : (stryCov_9fa48("51236", "51237", "51238"), (stryMutAct_9fa48("51240") ? currentStepConfig.id !== 'complete' : stryMutAct_9fa48("51239") ? true : (stryCov_9fa48("51239", "51240"), currentStepConfig.id === 'complete')) && <CompleteStep data={data} />)}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-700">
            <button onClick={handleBack} disabled={stryMutAct_9fa48("51244") ? currentStep !== 0 : stryMutAct_9fa48("51243") ? false : stryMutAct_9fa48("51242") ? true : (stryCov_9fa48("51242", "51243", "51244"), currentStep === 0)} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${(stryMutAct_9fa48("51248") ? currentStep !== 0 : stryMutAct_9fa48("51247") ? false : stryMutAct_9fa48("51246") ? true : (stryCov_9fa48("51246", "51247", "51248"), currentStep === 0)) ? 'text-slate-500 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-700'}`}>
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
            <button onClick={handleNext} disabled={isLoading} className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-lg hover:opacity-90 transition">
              {isLoading ? 'Saving...' : (stryMutAct_9fa48("51254") ? currentStep !== STEPS.length - 1 : stryMutAct_9fa48("51253") ? false : stryMutAct_9fa48("51252") ? true : (stryCov_9fa48("51252", "51253", "51254"), currentStep === (stryMutAct_9fa48("51255") ? STEPS.length + 1 : (stryCov_9fa48("51255"), STEPS.length - 1)))) ? <>
                  Launch Datacendia
                  <Zap className="w-5 h-5" />
                </> : <>
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </>}
            </button>
          </div>
        </div>

        {/* Skip */}
        {stryMutAct_9fa48("51258") ? currentStep < STEPS.length - 1 || <div className="text-center mt-4">
            <button onClick={() => navigate('/cortex')} className="text-slate-500 hover:text-slate-300 text-sm">
              Skip for now
            </button>
          </div> : stryMutAct_9fa48("51257") ? false : stryMutAct_9fa48("51256") ? true : (stryCov_9fa48("51256", "51257", "51258"), (stryMutAct_9fa48("51261") ? currentStep >= STEPS.length - 1 : stryMutAct_9fa48("51260") ? currentStep <= STEPS.length - 1 : stryMutAct_9fa48("51259") ? true : (stryCov_9fa48("51259", "51260", "51261"), currentStep < (stryMutAct_9fa48("51262") ? STEPS.length + 1 : (stryCov_9fa48("51262"), STEPS.length - 1)))) && <div className="text-center mt-4">
            <button onClick={stryMutAct_9fa48("51263") ? () => undefined : (stryCov_9fa48("51263"), () => navigate('/cortex'))} className="text-slate-500 hover:text-slate-300 text-sm">
              Skip for now
            </button>
          </div>)}
      </div>
    </div>;
};

// Step Components
const WelcomeStep: React.FC = stryMutAct_9fa48("51265") ? () => undefined : (stryCov_9fa48("51265"), (() => {
  const WelcomeStep: React.FC = () => <div className="text-center">
    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center">
      <Brain className="w-10 h-10 text-white" />
    </div>
    <h1 className="text-3xl font-bold text-white mb-4">
      Welcome to Datacendia
    </h1>
    <p className="text-slate-400 text-lg max-w-lg mx-auto mb-8">
      Your AI-powered organizational intelligence platform. Let's set up your
      account in just a few minutes.
    </p>
    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto text-left">
      {(stryMutAct_9fa48("51266") ? [] : (stryCov_9fa48("51266"), [stryMutAct_9fa48("51267") ? {} : (stryCov_9fa48("51267"), {
        icon: Brain,
        label: 'AI Council',
        desc: 'Multi-persona deliberation'
      }), stryMutAct_9fa48("51270") ? {} : (stryCov_9fa48("51270"), {
        icon: BarChart3,
        label: 'Real-time Analytics',
        desc: 'Pulse monitoring'
      }), stryMutAct_9fa48("51273") ? {} : (stryCov_9fa48("51273"), {
        icon: Shield,
        label: 'Enterprise Security',
        desc: 'SOC 2 ready'
      })])).map(stryMutAct_9fa48("51276") ? () => undefined : (stryCov_9fa48("51276"), feature => <div key={feature.label} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <feature.icon className="w-6 h-6 text-purple-400 mb-2" />
          <div className="text-sm font-medium text-white">{feature.label}</div>
          <div className="text-xs text-slate-500">{feature.desc}</div>
        </div>))}
    </div>
  </div>;
  return WelcomeStep;
})());
interface OrgStepProps {
  data: {
    name: string;
    industry: string;
    size: string;
  };
  update: (field: string, value: string) => void;
}
const OrganizationStep: React.FC<OrgStepProps> = ({
  data,
  update
}) => {
  const industries = stryMutAct_9fa48("51278") ? [] : (stryCov_9fa48("51278"), ['Technology', 'Financial Services', 'Healthcare', 'Manufacturing', 'Retail', 'Energy', 'Education', 'Government', 'Other']);
  const sizes = stryMutAct_9fa48("51288") ? [] : (stryCov_9fa48("51288"), ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']);
  return <div>
      <h2 className="text-2xl font-bold text-white mb-2">
        Tell us about your organization
      </h2>
      <p className="text-slate-400 mb-8">
        This helps us customize Datacendia for your needs.
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Organization Name
          </label>
          <input type="text" value={data.name} onChange={stryMutAct_9fa48("51295") ? () => undefined : (stryCov_9fa48("51295"), e => update('name', e.target.value))} placeholder="Acme Corporation" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Industry
          </label>
          <div className="grid grid-cols-3 gap-2">
            {industries.map(stryMutAct_9fa48("51297") ? () => undefined : (stryCov_9fa48("51297"), industry => <button key={industry} onClick={stryMutAct_9fa48("51298") ? () => undefined : (stryCov_9fa48("51298"), () => update('industry', industry))} className={`px-3 py-2 rounded-lg text-sm transition ${(stryMutAct_9fa48("51303") ? data.industry !== industry : stryMutAct_9fa48("51302") ? false : stryMutAct_9fa48("51301") ? true : (stryCov_9fa48("51301", "51302", "51303"), data.industry === industry)) ? 'bg-purple-500 text-white' : 'bg-slate-900 text-slate-400 border border-slate-700 hover:border-purple-500'}`}>
                {industry}
              </button>))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Company Size
          </label>
          <div className="flex gap-2 flex-wrap">
            {sizes.map(stryMutAct_9fa48("51306") ? () => undefined : (stryCov_9fa48("51306"), size => <button key={size} onClick={stryMutAct_9fa48("51307") ? () => undefined : (stryCov_9fa48("51307"), () => update('size', size))} className={`px-4 py-2 rounded-lg text-sm transition ${(stryMutAct_9fa48("51312") ? data.size !== size : stryMutAct_9fa48("51311") ? false : stryMutAct_9fa48("51310") ? true : (stryCov_9fa48("51310", "51311", "51312"), data.size === size)) ? 'bg-purple-500 text-white' : 'bg-slate-900 text-slate-400 border border-slate-700 hover:border-purple-500'}`}>
                {size} employees
              </button>))}
          </div>
        </div>
      </div>
    </div>;
};
interface TeamStepProps {
  invites: string[];
  addInvite: () => void;
  updateInvite: (index: number, value: string) => void;
}
const TeamStep: React.FC<TeamStepProps> = stryMutAct_9fa48("51315") ? () => undefined : (stryCov_9fa48("51315"), (() => {
  const TeamStep: React.FC<TeamStepProps> = ({
    invites,
    addInvite,
    updateInvite
  }) => <div>
    <h2 className="text-2xl font-bold text-white mb-2">
      Invite your team
    </h2>
    <p className="text-slate-400 mb-8">
      Datacendia works best with your whole team. You can skip this and add people later.
    </p>

    <div className="space-y-3">
      {invites.map(stryMutAct_9fa48("51316") ? () => undefined : (stryCov_9fa48("51316"), (email, index) => <input key={index} type="email" value={email} onChange={stryMutAct_9fa48("51317") ? () => undefined : (stryCov_9fa48("51317"), e => updateInvite(index, e.target.value))} placeholder="colleague@company.com" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500" />))}
      <button onClick={addInvite} className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1">
        + Add another team member
      </button>
    </div>

    <div className="mt-8 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
      <h4 className="text-sm font-medium text-white mb-2">Team Roles</h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-purple-400">Admin</span>
          <span className="text-slate-500 ml-2">Full access</span>
        </div>
        <div>
          <span className="text-cyan-400">Analyst</span>
          <span className="text-slate-500 ml-2">View & analyze</span>
        </div>
      </div>
    </div>
  </div>;
  return TeamStep;
})());
interface DataSourcesStepProps {
  selected: string[];
  toggle: (source: string) => void;
}
const DataSourcesStep: React.FC<DataSourcesStepProps> = ({
  selected,
  toggle
}) => {
  const sources = stryMutAct_9fa48("51319") ? [] : (stryCov_9fa48("51319"), [stryMutAct_9fa48("51320") ? {} : (stryCov_9fa48("51320"), {
    id: 'postgresql',
    name: 'PostgreSQL',
    icon: '🐘'
  }), stryMutAct_9fa48("51324") ? {} : (stryCov_9fa48("51324"), {
    id: 'snowflake',
    name: 'Snowflake',
    icon: '❄️'
  }), stryMutAct_9fa48("51328") ? {} : (stryCov_9fa48("51328"), {
    id: 'bigquery',
    name: 'BigQuery',
    icon: '📊'
  }), stryMutAct_9fa48("51332") ? {} : (stryCov_9fa48("51332"), {
    id: 'salesforce',
    name: 'Salesforce',
    icon: '☁️'
  }), stryMutAct_9fa48("51336") ? {} : (stryCov_9fa48("51336"), {
    id: 'hubspot',
    name: 'HubSpot',
    icon: '🟠'
  }), stryMutAct_9fa48("51340") ? {} : (stryCov_9fa48("51340"), {
    id: 'sap',
    name: 'SAP',
    icon: '💼'
  }), stryMutAct_9fa48("51344") ? {} : (stryCov_9fa48("51344"), {
    id: 'excel',
    name: 'Excel/CSV',
    icon: '📗'
  }), stryMutAct_9fa48("51348") ? {} : (stryCov_9fa48("51348"), {
    id: 'api',
    name: 'REST API',
    icon: '🔌'
  })]);
  return <div>
      <h2 className="text-2xl font-bold text-white mb-2">
        Connect your data sources
      </h2>
      <p className="text-slate-400 mb-8">
        Select the systems you'd like to connect. You can add more later.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {sources.map(stryMutAct_9fa48("51352") ? () => undefined : (stryCov_9fa48("51352"), source => <button key={source.id} onClick={stryMutAct_9fa48("51353") ? () => undefined : (stryCov_9fa48("51353"), () => toggle(source.id))} className={`p-4 rounded-lg border transition text-center ${selected.includes(source.id) ? 'bg-purple-500/20 border-purple-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'}`}>
            <div className="text-2xl mb-2">{source.icon}</div>
            <div className="text-sm font-medium">{source.name}</div>
            {stryMutAct_9fa48("51359") ? selected.includes(source.id) || <Check className="w-4 h-4 mx-auto mt-2 text-purple-400" /> : stryMutAct_9fa48("51358") ? false : stryMutAct_9fa48("51357") ? true : (stryCov_9fa48("51357", "51358", "51359"), selected.includes(source.id) && <Check className="w-4 h-4 mx-auto mt-2 text-purple-400" />)}
          </button>))}
      </div>
    </div>;
};
interface GoalsStepProps {
  selected: string[];
  toggle: (goal: string) => void;
}
const GoalsStep: React.FC<GoalsStepProps> = ({
  selected,
  toggle
}) => {
  const goals = stryMutAct_9fa48("51361") ? [] : (stryCov_9fa48("51361"), [stryMutAct_9fa48("51362") ? {} : (stryCov_9fa48("51362"), {
    id: 'strategic',
    label: 'Strategic Decision Making',
    desc: 'AI-powered deliberation for major decisions'
  }), stryMutAct_9fa48("51366") ? {} : (stryCov_9fa48("51366"), {
    id: 'analytics',
    label: 'Real-time Analytics',
    desc: 'Monitor KPIs and organizational health'
  }), stryMutAct_9fa48("51370") ? {} : (stryCov_9fa48("51370"), {
    id: 'automation',
    label: 'Workflow Automation',
    desc: 'Automate approval processes'
  }), stryMutAct_9fa48("51374") ? {} : (stryCov_9fa48("51374"), {
    id: 'forecasting',
    label: 'Predictive Forecasting',
    desc: 'Scenario planning and predictions'
  }), stryMutAct_9fa48("51378") ? {} : (stryCov_9fa48("51378"), {
    id: 'compliance',
    label: 'Compliance & Governance',
    desc: 'Audit trails and policy enforcement'
  }), stryMutAct_9fa48("51382") ? {} : (stryCov_9fa48("51382"), {
    id: 'integration',
    label: 'System Integration',
    desc: 'Unify data across platforms'
  })]);
  return <div>
      <h2 className="text-2xl font-bold text-white mb-2">
        What are your main goals?
      </h2>
      <p className="text-slate-400 mb-8">
        This helps us prioritize features for you.
      </p>

      <div className="space-y-3">
        {goals.map(stryMutAct_9fa48("51386") ? () => undefined : (stryCov_9fa48("51386"), goal => <button key={goal.id} onClick={stryMutAct_9fa48("51387") ? () => undefined : (stryCov_9fa48("51387"), () => toggle(goal.id))} className={`w-full p-4 rounded-lg border text-left transition flex items-start gap-4 ${selected.includes(goal.id) ? 'bg-purple-500/20 border-purple-500' : 'bg-slate-900 border-slate-700 hover:border-slate-600'}`}>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${selected.includes(goal.id) ? 'bg-purple-500 border-purple-500' : 'border-slate-600'}`}>
              {stryMutAct_9fa48("51396") ? selected.includes(goal.id) || <Check className="w-4 h-4 text-white" /> : stryMutAct_9fa48("51395") ? false : stryMutAct_9fa48("51394") ? true : (stryCov_9fa48("51394", "51395", "51396"), selected.includes(goal.id) && <Check className="w-4 h-4 text-white" />)}
            </div>
            <div>
              <div className="font-medium text-white">{goal.label}</div>
              <div className="text-sm text-slate-400">{goal.desc}</div>
            </div>
          </button>))}
      </div>
    </div>;
};
interface CompleteStepProps {
  data: OnboardingData;
}
const CompleteStep: React.FC<CompleteStepProps> = stryMutAct_9fa48("51397") ? () => undefined : (stryCov_9fa48("51397"), (() => {
  const CompleteStep: React.FC<CompleteStepProps> = ({
    data
  }) => <div className="text-center">
    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
      <Check className="w-10 h-10 text-white" />
    </div>
    <h2 className="text-3xl font-bold text-white mb-4">
      You're all set!
    </h2>
    <p className="text-slate-400 text-lg max-w-lg mx-auto mb-8">
      Your Datacendia workspace is ready. Let's explore what you can do.
    </p>

    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-left">
      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <div className="text-2xl mb-2">🧠</div>
        <div className="text-sm font-medium text-white">AI Council</div>
        <div className="text-xs text-slate-500">Start a deliberation</div>
      </div>
      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <div className="text-2xl mb-2">📊</div>
        <div className="text-sm font-medium text-white">Pulse Dashboard</div>
        <div className="text-xs text-slate-500">View real-time metrics</div>
      </div>
      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <div className="text-2xl mb-2">🔗</div>
        <div className="text-sm font-medium text-white">Connect Data</div>
        <div className="text-xs text-slate-500">Add your data sources</div>
      </div>
      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <div className="text-2xl mb-2">⚡</div>
        <div className="text-sm font-medium text-white">Workflows</div>
        <div className="text-xs text-slate-500">Automate processes</div>
      </div>
    </div>

    {stryMutAct_9fa48("51400") ? data.organization.name || <div className="mt-8 p-4 bg-slate-900/50 rounded-lg border border-slate-700 max-w-md mx-auto">
        <div className="text-sm text-slate-500">Your organization</div>
        <div className="text-lg font-semibold text-white">
          {data.organization.name}
        </div>
        <div className="text-sm text-slate-400">
          {data.organization.industry} • {data.organization.size} employees
        </div>
      </div> : stryMutAct_9fa48("51399") ? false : stryMutAct_9fa48("51398") ? true : (stryCov_9fa48("51398", "51399", "51400"), data.organization.name && <div className="mt-8 p-4 bg-slate-900/50 rounded-lg border border-slate-700 max-w-md mx-auto">
        <div className="text-sm text-slate-500">Your organization</div>
        <div className="text-lg font-semibold text-white">
          {data.organization.name}
        </div>
        <div className="text-sm text-slate-400">
          {data.organization.industry} • {data.organization.size} employees
        </div>
      </div>)}
  </div>;
  return CompleteStep;
})());
export default OnboardingWizard;