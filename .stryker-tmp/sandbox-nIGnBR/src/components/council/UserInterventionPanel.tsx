// @ts-nocheck
// =============================================================================
// DATACENDIA - USER INTERVENTION PANEL
// Allows users to participate in AI Council deliberations
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
import { cn } from '../../../lib/utils';

// =============================================================================
// TYPES
// =============================================================================

export interface UserRole {
  code: string;
  title: string;
  department: string;
  icon: string;
}
export interface UserIntervention {
  id: string;
  userId: string;
  userRole: UserRole;
  content: string;
  type: 'perspective' | 'question' | 'objection' | 'support' | 'data';
  timestamp: Date;
  targetAgentId?: string; // If responding to a specific agent
}
interface UserInterventionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (intervention: Omit<UserIntervention, 'id' | 'timestamp'>) => void;
  currentPhase?: string;
  agentMessages?: {
    agentId: string;
    agentName: string;
    content: string;
  }[];
  savedRole?: UserRole | null;
  onRoleSave?: (role: UserRole) => void;
  disabled?: boolean;
}

// =============================================================================
// PREDEFINED ROLES
// =============================================================================

const COMMON_ROLES: UserRole[] = stryMutAct_9fa48("3939") ? [] : (stryCov_9fa48("3939"), [stryMutAct_9fa48("3940") ? {} : (stryCov_9fa48("3940"), {
  code: 'ceo',
  title: 'CEO',
  department: 'Executive',
  icon: '👔'
}), stryMutAct_9fa48("3945") ? {} : (stryCov_9fa48("3945"), {
  code: 'cfo',
  title: 'CFO',
  department: 'Finance',
  icon: '💰'
}), stryMutAct_9fa48("3950") ? {} : (stryCov_9fa48("3950"), {
  code: 'coo',
  title: 'COO',
  department: 'Operations',
  icon: '⚙️'
}), stryMutAct_9fa48("3955") ? {} : (stryCov_9fa48("3955"), {
  code: 'cto',
  title: 'CTO',
  department: 'Technology',
  icon: '💻'
}), stryMutAct_9fa48("3960") ? {} : (stryCov_9fa48("3960"), {
  code: 'cmo',
  title: 'CMO',
  department: 'Marketing',
  icon: '📢'
}), stryMutAct_9fa48("3965") ? {} : (stryCov_9fa48("3965"), {
  code: 'chro',
  title: 'CHRO',
  department: 'Human Resources',
  icon: '👥'
}), stryMutAct_9fa48("3970") ? {} : (stryCov_9fa48("3970"), {
  code: 'ciso',
  title: 'CISO',
  department: 'Security',
  icon: '🔒'
}), stryMutAct_9fa48("3975") ? {} : (stryCov_9fa48("3975"), {
  code: 'vp_sales',
  title: 'VP of Sales',
  department: 'Sales',
  icon: '📈'
}), stryMutAct_9fa48("3980") ? {} : (stryCov_9fa48("3980"), {
  code: 'vp_product',
  title: 'VP of Product',
  department: 'Product',
  icon: '🎯'
}), stryMutAct_9fa48("3985") ? {} : (stryCov_9fa48("3985"), {
  code: 'vp_engineering',
  title: 'VP of Engineering',
  department: 'Engineering',
  icon: '🛠️'
}), stryMutAct_9fa48("3990") ? {} : (stryCov_9fa48("3990"), {
  code: 'director',
  title: 'Director',
  department: 'Management',
  icon: '📋'
}), stryMutAct_9fa48("3995") ? {} : (stryCov_9fa48("3995"), {
  code: 'manager',
  title: 'Manager',
  department: 'Management',
  icon: '👤'
}), stryMutAct_9fa48("4000") ? {} : (stryCov_9fa48("4000"), {
  code: 'analyst',
  title: 'Analyst',
  department: 'Analytics',
  icon: '📊'
}), stryMutAct_9fa48("4005") ? {} : (stryCov_9fa48("4005"), {
  code: 'consultant',
  title: 'Consultant',
  department: 'Advisory',
  icon: '💡'
}), stryMutAct_9fa48("4010") ? {} : (stryCov_9fa48("4010"), {
  code: 'board_member',
  title: 'Board Member',
  department: 'Governance',
  icon: '🏛️'
}), stryMutAct_9fa48("4015") ? {} : (stryCov_9fa48("4015"), {
  code: 'investor',
  title: 'Investor',
  department: 'Stakeholder',
  icon: '💎'
})]);
const INTERVENTION_TYPES = stryMutAct_9fa48("4020") ? [] : (stryCov_9fa48("4020"), [stryMutAct_9fa48("4021") ? {} : (stryCov_9fa48("4021"), {
  code: 'perspective',
  label: 'Share Perspective',
  icon: '💭',
  description: 'Add your viewpoint to the discussion'
}), stryMutAct_9fa48("4026") ? {} : (stryCov_9fa48("4026"), {
  code: 'question',
  label: 'Ask Question',
  icon: '❓',
  description: 'Request clarification or more detail'
}), stryMutAct_9fa48("4031") ? {} : (stryCov_9fa48("4031"), {
  code: 'objection',
  label: 'Raise Objection',
  icon: '⚠️',
  description: 'Challenge a point or assumption'
}), stryMutAct_9fa48("4036") ? {} : (stryCov_9fa48("4036"), {
  code: 'support',
  label: 'Show Support',
  icon: '👍',
  description: 'Endorse an agent\'s position'
}), stryMutAct_9fa48("4041") ? {} : (stryCov_9fa48("4041"), {
  code: 'data',
  label: 'Provide Data',
  icon: '📊',
  description: 'Share relevant facts or figures'
})]);

// =============================================================================
// COMPONENT
// =============================================================================

export const UserInterventionPanel: React.FC<UserInterventionPanelProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentPhase,
  agentMessages = stryMutAct_9fa48("4046") ? ["Stryker was here"] : (stryCov_9fa48("4046"), []),
  savedRole,
  onRoleSave,
  disabled = stryMutAct_9fa48("4047") ? true : (stryCov_9fa48("4047"), false)
}) => {
  const [step, setStep] = useState<'role' | 'intervention'>(savedRole ? 'intervention' : 'role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(stryMutAct_9fa48("4053") ? savedRole && null : stryMutAct_9fa48("4052") ? false : stryMutAct_9fa48("4051") ? true : (stryCov_9fa48("4051", "4052", "4053"), savedRole || null));
  const [customRole, setCustomRole] = useState(stryMutAct_9fa48("4054") ? {} : (stryCov_9fa48("4054"), {
    title: '',
    department: ''
  }));
  const [showCustomRole, setShowCustomRole] = useState(stryMutAct_9fa48("4057") ? true : (stryCov_9fa48("4057"), false));
  const [interventionType, setInterventionType] = useState<string>('perspective');
  const [content, setContent] = useState('');
  const [targetAgent, setTargetAgent] = useState<string | undefined>(undefined);
  const [rememberRole, setRememberRole] = useState(stryMutAct_9fa48("4060") ? false : (stryCov_9fa48("4060"), true));

  // Reset when panel opens
  useEffect(() => {
    if (stryMutAct_9fa48("4063") ? false : stryMutAct_9fa48("4062") ? true : (stryCov_9fa48("4062", "4063"), isOpen)) {
      setStep(savedRole ? 'intervention' : 'role');
      setSelectedRole(stryMutAct_9fa48("4069") ? savedRole && null : stryMutAct_9fa48("4068") ? false : stryMutAct_9fa48("4067") ? true : (stryCov_9fa48("4067", "4068", "4069"), savedRole || null));
      setContent('');
      setTargetAgent(undefined);
    }
  }, stryMutAct_9fa48("4071") ? [] : (stryCov_9fa48("4071"), [isOpen, savedRole]));
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setShowCustomRole(stryMutAct_9fa48("4073") ? true : (stryCov_9fa48("4073"), false));
  };
  const handleCustomRoleSubmit = () => {
    if (stryMutAct_9fa48("4077") ? customRole.title || customRole.department : stryMutAct_9fa48("4076") ? false : stryMutAct_9fa48("4075") ? true : (stryCov_9fa48("4075", "4076", "4077"), customRole.title && customRole.department)) {
      const role: UserRole = stryMutAct_9fa48("4079") ? {} : (stryCov_9fa48("4079"), {
        code: `custom_${Date.now()}`,
        title: customRole.title,
        department: customRole.department,
        icon: '👤'
      });
      setSelectedRole(role);
      setShowCustomRole(stryMutAct_9fa48("4082") ? true : (stryCov_9fa48("4082"), false));
    }
  };
  const handleContinueToIntervention = () => {
    if (stryMutAct_9fa48("4085") ? false : stryMutAct_9fa48("4084") ? true : (stryCov_9fa48("4084", "4085"), selectedRole)) {
      if (stryMutAct_9fa48("4089") ? rememberRole || onRoleSave : stryMutAct_9fa48("4088") ? false : stryMutAct_9fa48("4087") ? true : (stryCov_9fa48("4087", "4088", "4089"), rememberRole && onRoleSave)) {
        onRoleSave(selectedRole);
      }
      setStep('intervention');
    }
  };
  const handleSubmit = () => {
    if (stryMutAct_9fa48("4095") ? !selectedRole && !content.trim() : stryMutAct_9fa48("4094") ? false : stryMutAct_9fa48("4093") ? true : (stryCov_9fa48("4093", "4094", "4095"), (stryMutAct_9fa48("4096") ? selectedRole : (stryCov_9fa48("4096"), !selectedRole)) || (stryMutAct_9fa48("4097") ? content.trim() : (stryCov_9fa48("4097"), !(stryMutAct_9fa48("4098") ? content : (stryCov_9fa48("4098"), content.trim())))))) {
      return;
    }
    onSubmit(stryMutAct_9fa48("4100") ? {} : (stryCov_9fa48("4100"), {
      userId: 'current-user',
      // Would come from auth context
      userRole: selectedRole,
      content: stryMutAct_9fa48("4102") ? content : (stryCov_9fa48("4102"), content.trim()),
      type: interventionType as UserIntervention['type'],
      targetAgentId: targetAgent
    }));
    setContent('');
    onClose();
  };
  if (stryMutAct_9fa48("4106") ? false : stryMutAct_9fa48("4105") ? true : stryMutAct_9fa48("4104") ? isOpen : (stryCov_9fa48("4104", "4105", "4106"), !isOpen)) {
    return null;
  }
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎤</span>
              <div>
                <h2 className="text-xl font-bold">Your Voice in the Council</h2>
                <p className="text-primary-100 text-sm">
                  {(stryMutAct_9fa48("4110") ? step !== 'role' : stryMutAct_9fa48("4109") ? false : stryMutAct_9fa48("4108") ? true : (stryCov_9fa48("4108", "4109", "4110"), step === 'role')) ? 'First, tell us your role' : 'Share your perspective'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Progress indicator */}
          <div className="flex items-center gap-2 mt-4">
            <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all', (stryMutAct_9fa48("4117") ? step !== 'role' : stryMutAct_9fa48("4116") ? false : stryMutAct_9fa48("4115") ? true : (stryCov_9fa48("4115", "4116", "4117"), step === 'role')) ? 'bg-white text-primary-600' : 'bg-primary-500 text-white')}>
              {(stryMutAct_9fa48("4123") ? step !== 'role' : stryMutAct_9fa48("4122") ? false : stryMutAct_9fa48("4121") ? true : (stryCov_9fa48("4121", "4122", "4123"), step === 'role')) ? '1' : '✓'}
            </div>
            <div className={cn('flex-1 h-1 rounded', (stryMutAct_9fa48("4130") ? step !== 'intervention' : stryMutAct_9fa48("4129") ? false : stryMutAct_9fa48("4128") ? true : (stryCov_9fa48("4128", "4129", "4130"), step === 'intervention')) ? 'bg-white' : 'bg-primary-500')} />
            <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold', (stryMutAct_9fa48("4137") ? step !== 'intervention' : stryMutAct_9fa48("4136") ? false : stryMutAct_9fa48("4135") ? true : (stryCov_9fa48("4135", "4136", "4137"), step === 'intervention')) ? 'bg-white text-primary-600' : 'bg-primary-500 text-white')}>
              2
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {(stryMutAct_9fa48("4143") ? step !== 'role' : stryMutAct_9fa48("4142") ? false : stryMutAct_9fa48("4141") ? true : (stryCov_9fa48("4141", "4142", "4143"), step === 'role')) ? <>
              {/* Role Selection */}
              <div className="mb-6">
                <h3 className="font-semibold text-neutral-900 mb-3">
                  What is your role? <span className="text-red-500">*</span>
                </h3>
                <p className="text-sm text-neutral-500 mb-4">
                  This helps the AI Council understand your perspective and expertise.
                </p>

                {/* Common roles grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                  {COMMON_ROLES.map(stryMutAct_9fa48("4145") ? () => undefined : (stryCov_9fa48("4145"), role => <button key={role.code} onClick={stryMutAct_9fa48("4146") ? () => undefined : (stryCov_9fa48("4146"), () => handleRoleSelect(role))} className={cn('flex items-center gap-2 p-3 rounded-lg border text-left transition-all', (stryMutAct_9fa48("4150") ? selectedRole?.code !== role.code : stryMutAct_9fa48("4149") ? false : stryMutAct_9fa48("4148") ? true : (stryCov_9fa48("4148", "4149", "4150"), (stryMutAct_9fa48("4151") ? selectedRole.code : (stryCov_9fa48("4151"), selectedRole?.code)) === role.code)) ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200' : 'border-neutral-200 hover:border-primary-300 hover:bg-neutral-50')}>
                      <span className="text-xl">{role.icon}</span>
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate">{role.title}</div>
                        <div className="text-xs text-neutral-500 truncate">{role.department}</div>
                      </div>
                    </button>))}
                </div>

                {/* Custom role */}
                <button onClick={stryMutAct_9fa48("4154") ? () => undefined : (stryCov_9fa48("4154"), () => setShowCustomRole(stryMutAct_9fa48("4155") ? showCustomRole : (stryCov_9fa48("4155"), !showCustomRole)))} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  {showCustomRole ? '− Hide custom role' : '+ Add custom role'}
                </button>

                {stryMutAct_9fa48("4160") ? showCustomRole || <div className="mt-3 p-4 bg-neutral-50 rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          Job Title *
                        </label>
                        <input type="text" value={customRole.title} onChange={e => setCustomRole(prev => ({
                    ...prev,
                    title: e.target.value
                  }))} placeholder="e.g., Senior Architect" className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          Department *
                        </label>
                        <input type="text" value={customRole.department} onChange={e => setCustomRole(prev => ({
                    ...prev,
                    department: e.target.value
                  }))} placeholder="e.g., Architecture" className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                      </div>
                    </div>
                    <button onClick={handleCustomRoleSubmit} disabled={!customRole.title || !customRole.department} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed">
                      Use This Role
                    </button>
                  </div> : stryMutAct_9fa48("4159") ? false : stryMutAct_9fa48("4158") ? true : (stryCov_9fa48("4158", "4159", "4160"), showCustomRole && <div className="mt-3 p-4 bg-neutral-50 rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          Job Title *
                        </label>
                        <input type="text" value={customRole.title} onChange={stryMutAct_9fa48("4161") ? () => undefined : (stryCov_9fa48("4161"), e => setCustomRole(stryMutAct_9fa48("4162") ? () => undefined : (stryCov_9fa48("4162"), prev => stryMutAct_9fa48("4163") ? {} : (stryCov_9fa48("4163"), {
                    ...prev,
                    title: e.target.value
                  }))))} placeholder="e.g., Senior Architect" className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          Department *
                        </label>
                        <input type="text" value={customRole.department} onChange={stryMutAct_9fa48("4164") ? () => undefined : (stryCov_9fa48("4164"), e => setCustomRole(stryMutAct_9fa48("4165") ? () => undefined : (stryCov_9fa48("4165"), prev => stryMutAct_9fa48("4166") ? {} : (stryCov_9fa48("4166"), {
                    ...prev,
                    department: e.target.value
                  }))))} placeholder="e.g., Architecture" className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                      </div>
                    </div>
                    <button onClick={handleCustomRoleSubmit} disabled={stryMutAct_9fa48("4169") ? !customRole.title && !customRole.department : stryMutAct_9fa48("4168") ? false : stryMutAct_9fa48("4167") ? true : (stryCov_9fa48("4167", "4168", "4169"), (stryMutAct_9fa48("4170") ? customRole.title : (stryCov_9fa48("4170"), !customRole.title)) || (stryMutAct_9fa48("4171") ? customRole.department : (stryCov_9fa48("4171"), !customRole.department)))} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed">
                      Use This Role
                    </button>
                  </div>)}
              </div>

              {/* Remember role checkbox */}
              <label className="flex items-center gap-2 text-sm text-neutral-600 mb-6">
                <input type="checkbox" checked={rememberRole} onChange={stryMutAct_9fa48("4172") ? () => undefined : (stryCov_9fa48("4172"), e => setRememberRole(e.target.checked))} className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
                Remember my role for future interventions
              </label>
            </> : <>
              {/* Intervention Form */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-4 p-3 bg-primary-50 rounded-lg">
                  <span className="text-xl">{stryMutAct_9fa48("4173") ? selectedRole.icon : (stryCov_9fa48("4173"), selectedRole?.icon)}</span>
                  <div>
                    <span className="font-medium text-primary-900">{stryMutAct_9fa48("4174") ? selectedRole.title : (stryCov_9fa48("4174"), selectedRole?.title)}</span>
                    <span className="text-primary-600 text-sm ml-2">({stryMutAct_9fa48("4175") ? selectedRole.department : (stryCov_9fa48("4175"), selectedRole?.department)})</span>
                  </div>
                  <button onClick={stryMutAct_9fa48("4176") ? () => undefined : (stryCov_9fa48("4176"), () => setStep('role'))} className="ml-auto text-sm text-primary-600 hover:text-primary-700">
                    Change
                  </button>
                </div>

                {/* Current phase indicator */}
                {stryMutAct_9fa48("4180") ? currentPhase || <div className="mb-4 text-sm text-neutral-500">
                    Current deliberation phase: <span className="font-medium text-neutral-700">{currentPhase}</span>
                  </div> : stryMutAct_9fa48("4179") ? false : stryMutAct_9fa48("4178") ? true : (stryCov_9fa48("4178", "4179", "4180"), currentPhase && <div className="mb-4 text-sm text-neutral-500">
                    Current deliberation phase: <span className="font-medium text-neutral-700">{currentPhase}</span>
                  </div>)}

                {/* Intervention type selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Type of Intervention
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {INTERVENTION_TYPES.map(stryMutAct_9fa48("4181") ? () => undefined : (stryCov_9fa48("4181"), type => <button key={type.code} onClick={stryMutAct_9fa48("4182") ? () => undefined : (stryCov_9fa48("4182"), () => setInterventionType(type.code))} className={cn('flex flex-col items-center p-3 rounded-lg border text-center transition-all', (stryMutAct_9fa48("4186") ? interventionType !== type.code : stryMutAct_9fa48("4185") ? false : stryMutAct_9fa48("4184") ? true : (stryCov_9fa48("4184", "4185", "4186"), interventionType === type.code)) ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 hover:border-primary-300')}>
                        <span className="text-2xl mb-1">{type.icon}</span>
                        <span className="text-xs font-medium">{type.label}</span>
                      </button>))}
                  </div>
                </div>

                {/* Target agent (optional) */}
                {stryMutAct_9fa48("4191") ? agentMessages.length > 0 || <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Responding to (optional)
                    </label>
                    <select value={targetAgent || ''} onChange={e => setTargetAgent(e.target.value || undefined)} className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                      <option value="">General comment (not directed at specific agent)</option>
                      {agentMessages.map(msg => <option key={msg.agentId} value={msg.agentId}>
                          {msg.agentName}
                        </option>)}
                    </select>
                  </div> : stryMutAct_9fa48("4190") ? false : stryMutAct_9fa48("4189") ? true : (stryCov_9fa48("4189", "4190", "4191"), (stryMutAct_9fa48("4194") ? agentMessages.length <= 0 : stryMutAct_9fa48("4193") ? agentMessages.length >= 0 : stryMutAct_9fa48("4192") ? true : (stryCov_9fa48("4192", "4193", "4194"), agentMessages.length > 0)) && <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Responding to (optional)
                    </label>
                    <select value={stryMutAct_9fa48("4197") ? targetAgent && '' : stryMutAct_9fa48("4196") ? false : stryMutAct_9fa48("4195") ? true : (stryCov_9fa48("4195", "4196", "4197"), targetAgent || '')} onChange={stryMutAct_9fa48("4199") ? () => undefined : (stryCov_9fa48("4199"), e => setTargetAgent(stryMutAct_9fa48("4202") ? e.target.value && undefined : stryMutAct_9fa48("4201") ? false : stryMutAct_9fa48("4200") ? true : (stryCov_9fa48("4200", "4201", "4202"), e.target.value || undefined)))} className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                      <option value="">General comment (not directed at specific agent)</option>
                      {agentMessages.map(stryMutAct_9fa48("4203") ? () => undefined : (stryCov_9fa48("4203"), msg => <option key={msg.agentId} value={msg.agentId}>
                          {msg.agentName}
                        </option>))}
                    </select>
                  </div>)}

                {/* Content input */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Your Input <span className="text-red-500">*</span>
                  </label>
                  <textarea value={content} onChange={stryMutAct_9fa48("4204") ? () => undefined : (stryCov_9fa48("4204"), e => setContent(e.target.value))} placeholder={(stryMutAct_9fa48("4207") ? interventionType !== 'question' : stryMutAct_9fa48("4206") ? false : stryMutAct_9fa48("4205") ? true : (stryCov_9fa48("4205", "4206", "4207"), interventionType === 'question')) ? 'What would you like to ask the Council?' : (stryMutAct_9fa48("4212") ? interventionType !== 'objection' : stryMutAct_9fa48("4211") ? false : stryMutAct_9fa48("4210") ? true : (stryCov_9fa48("4210", "4211", "4212"), interventionType === 'objection')) ? 'What concern would you like to raise?' : (stryMutAct_9fa48("4217") ? interventionType !== 'data' : stryMutAct_9fa48("4216") ? false : stryMutAct_9fa48("4215") ? true : (stryCov_9fa48("4215", "4216", "4217"), interventionType === 'data')) ? 'What data or facts would you like to share?' : 'Share your perspective with the Council...'} rows={5} className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none" />
                  <div className="flex justify-between mt-1 text-xs text-neutral-500">
                    <span>Be specific and provide context</span>
                    <span>{content.length} characters</span>
                  </div>
                </div>
              </div>
            </>}
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 p-4 bg-neutral-50 flex justify-between">
          {(stryMutAct_9fa48("4223") ? step !== 'role' : stryMutAct_9fa48("4222") ? false : stryMutAct_9fa48("4221") ? true : (stryCov_9fa48("4221", "4222", "4223"), step === 'role')) ? <>
              <button onClick={onClose} className="px-4 py-2 text-neutral-600 hover:text-neutral-800 font-medium">
                Cancel
              </button>
              <button onClick={handleContinueToIntervention} disabled={stryMutAct_9fa48("4225") ? selectedRole : (stryCov_9fa48("4225"), !selectedRole)} className={cn('px-6 py-2 rounded-lg font-medium text-white transition-all', selectedRole ? 'bg-primary-600 hover:bg-primary-700' : 'bg-neutral-300 cursor-not-allowed')}>
                Continue →
              </button>
            </> : <>
              <button onClick={stryMutAct_9fa48("4229") ? () => undefined : (stryCov_9fa48("4229"), () => setStep('role'))} className="px-4 py-2 text-neutral-600 hover:text-neutral-800 font-medium">
                ← Back
              </button>
              <button onClick={handleSubmit} disabled={stryMutAct_9fa48("4233") ? disabled && !content.trim() : stryMutAct_9fa48("4232") ? false : stryMutAct_9fa48("4231") ? true : (stryCov_9fa48("4231", "4232", "4233"), disabled || (stryMutAct_9fa48("4234") ? content.trim() : (stryCov_9fa48("4234"), !(stryMutAct_9fa48("4235") ? content : (stryCov_9fa48("4235"), content.trim())))))} className={cn('px-6 py-2 rounded-lg font-medium text-white transition-all', (stryMutAct_9fa48("4239") ? !disabled || content.trim() : stryMutAct_9fa48("4238") ? false : stryMutAct_9fa48("4237") ? true : (stryCov_9fa48("4237", "4238", "4239"), (stryMutAct_9fa48("4240") ? disabled : (stryCov_9fa48("4240"), !disabled)) && (stryMutAct_9fa48("4241") ? content : (stryCov_9fa48("4241"), content.trim())))) ? 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800' : 'bg-neutral-300 cursor-not-allowed')}>
                🎤 Submit Intervention
              </button>
            </>}
        </div>
      </div>
    </div>;
};
export default UserInterventionPanel;