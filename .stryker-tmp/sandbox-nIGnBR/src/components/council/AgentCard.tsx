/**
 * Agent Card Component
 * Displays an AI agent with status and capabilities
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
import React from 'react';
import { cn } from '../../../lib/utils';
interface Agent {
  id: string;
  code: string;
  name: string;
  role: string;
  description: string;
  avatarUrl?: string;
  status: 'online' | 'offline' | 'busy';
  capabilities?: string[];
}
interface AgentCardProps {
  agent: Agent;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

// Agent avatar colors by code
const agentColors: Record<string, {
  bg: string;
  text: string;
}> = stryMutAct_9fa48("2685") ? {} : (stryCov_9fa48("2685"), {
  chief: stryMutAct_9fa48("2686") ? {} : (stryCov_9fa48("2686"), {
    bg: '#6366F1',
    text: 'white'
  }),
  cfo: stryMutAct_9fa48("2689") ? {} : (stryCov_9fa48("2689"), {
    bg: '#10B981',
    text: 'white'
  }),
  coo: stryMutAct_9fa48("2692") ? {} : (stryCov_9fa48("2692"), {
    bg: '#F59E0B',
    text: 'white'
  }),
  ciso: stryMutAct_9fa48("2695") ? {} : (stryCov_9fa48("2695"), {
    bg: '#EF4444',
    text: 'white'
  }),
  cmo: stryMutAct_9fa48("2698") ? {} : (stryCov_9fa48("2698"), {
    bg: '#EC4899',
    text: 'white'
  }),
  cro: stryMutAct_9fa48("2701") ? {} : (stryCov_9fa48("2701"), {
    bg: '#8B5CF6',
    text: 'white'
  }),
  cdo: stryMutAct_9fa48("2704") ? {} : (stryCov_9fa48("2704"), {
    bg: '#3B82F6',
    text: 'white'
  }),
  risk: stryMutAct_9fa48("2707") ? {} : (stryCov_9fa48("2707"), {
    bg: '#14B8A6',
    text: 'white'
  }),
  default: stryMutAct_9fa48("2710") ? {} : (stryCov_9fa48("2710"), {
    bg: '#6B7280',
    text: 'white'
  })
});

// Status indicator colors
const statusColors: Record<string, string> = stryMutAct_9fa48("2713") ? {} : (stryCov_9fa48("2713"), {
  online: '#10B981',
  offline: '#9CA3AF',
  busy: '#F59E0B'
});
export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  isSelected = stryMutAct_9fa48("2717") ? true : (stryCov_9fa48("2717"), false),
  onClick,
  size = 'md'
}) => {
  const colors = stryMutAct_9fa48("2722") ? agentColors[agent.code] && agentColors.default : stryMutAct_9fa48("2721") ? false : stryMutAct_9fa48("2720") ? true : (stryCov_9fa48("2720", "2721", "2722"), agentColors[agent.code] || agentColors.default);
  const sizeClasses = stryMutAct_9fa48("2723") ? {} : (stryCov_9fa48("2723"), {
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6'
  });
  const avatarSizes = stryMutAct_9fa48("2727") ? {} : (stryCov_9fa48("2727"), {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base'
  });
  return <div onClick={onClick} className={cn('rounded-xl border transition-all cursor-pointer', sizeClasses[size], isSelected ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200' : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md')}>
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {agent.avatarUrl ? <img src={agent.avatarUrl} alt={agent.name} className={cn('rounded-full object-cover', avatarSizes[size])} /> : <div className={cn('rounded-full flex items-center justify-center font-semibold', avatarSizes[size])} style={stryMutAct_9fa48("2736") ? {} : (stryCov_9fa48("2736"), {
          backgroundColor: colors.bg,
          color: colors.text
        })}>
              {stryMutAct_9fa48("2738") ? agent.name.toUpperCase() : stryMutAct_9fa48("2737") ? agent.name.slice(0, 2).toLowerCase() : (stryCov_9fa48("2737", "2738"), agent.name.slice(0, 2).toUpperCase())}
            </div>}
          {/* Status indicator */}
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white" style={stryMutAct_9fa48("2739") ? {} : (stryCov_9fa48("2739"), {
          backgroundColor: statusColors[agent.status]
        })} title={agent.status} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className={cn('font-semibold text-neutral-900 truncate', (stryMutAct_9fa48("2743") ? size !== 'sm' : stryMutAct_9fa48("2742") ? false : stryMutAct_9fa48("2741") ? true : (stryCov_9fa48("2741", "2742", "2743"), size === 'sm')) ? 'text-sm' : (stryMutAct_9fa48("2748") ? size !== 'lg' : stryMutAct_9fa48("2747") ? false : stryMutAct_9fa48("2746") ? true : (stryCov_9fa48("2746", "2747", "2748"), size === 'lg')) ? 'text-lg' : 'text-base')}>
            {agent.name}
          </h3>
          <p className={cn('text-neutral-500 truncate', (stryMutAct_9fa48("2755") ? size !== 'sm' : stryMutAct_9fa48("2754") ? false : stryMutAct_9fa48("2753") ? true : (stryCov_9fa48("2753", "2754", "2755"), size === 'sm')) ? 'text-xs' : 'text-sm')}>
            {agent.role}
          </p>
          {stryMutAct_9fa48("2761") ? size !== 'sm' || <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
              {agent.description}
            </p> : stryMutAct_9fa48("2760") ? false : stryMutAct_9fa48("2759") ? true : (stryCov_9fa48("2759", "2760", "2761"), (stryMutAct_9fa48("2763") ? size === 'sm' : stryMutAct_9fa48("2762") ? true : (stryCov_9fa48("2762", "2763"), size !== 'sm')) && <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
              {agent.description}
            </p>)}
        </div>

        {/* Selection checkmark */}
        {stryMutAct_9fa48("2767") ? isSelected || <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div> : stryMutAct_9fa48("2766") ? false : stryMutAct_9fa48("2765") ? true : (stryCov_9fa48("2765", "2766", "2767"), isSelected && <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>)}
      </div>

      {/* Capabilities (only in large size) */}
      {stryMutAct_9fa48("2770") ? size === 'lg' && agent.capabilities && agent.capabilities.length > 0 || <div className="mt-3 pt-3 border-t border-neutral-100">
          <div className="flex flex-wrap gap-1">
            {agent.capabilities.slice(0, 4).map((cap, i) => <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-neutral-100 text-neutral-600">
                {cap.replace(/_/g, ' ')}
              </span>)}
            {agent.capabilities.length > 4 && <span className="px-2 py-0.5 text-xs text-neutral-400">
                +{agent.capabilities.length - 4} more
              </span>}
          </div>
        </div> : stryMutAct_9fa48("2769") ? false : stryMutAct_9fa48("2768") ? true : (stryCov_9fa48("2768", "2769", "2770"), (stryMutAct_9fa48("2772") ? size === 'lg' && agent.capabilities || agent.capabilities.length > 0 : stryMutAct_9fa48("2771") ? true : (stryCov_9fa48("2771", "2772"), (stryMutAct_9fa48("2774") ? size === 'lg' || agent.capabilities : stryMutAct_9fa48("2773") ? true : (stryCov_9fa48("2773", "2774"), (stryMutAct_9fa48("2776") ? size !== 'lg' : stryMutAct_9fa48("2775") ? true : (stryCov_9fa48("2775", "2776"), size === 'lg')) && agent.capabilities)) && (stryMutAct_9fa48("2780") ? agent.capabilities.length <= 0 : stryMutAct_9fa48("2779") ? agent.capabilities.length >= 0 : stryMutAct_9fa48("2778") ? true : (stryCov_9fa48("2778", "2779", "2780"), agent.capabilities.length > 0)))) && <div className="mt-3 pt-3 border-t border-neutral-100">
          <div className="flex flex-wrap gap-1">
            {stryMutAct_9fa48("2781") ? agent.capabilities.map((cap, i) => <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-neutral-100 text-neutral-600">
                {cap.replace(/_/g, ' ')}
              </span>) : (stryCov_9fa48("2781"), agent.capabilities.slice(0, 4).map(stryMutAct_9fa48("2782") ? () => undefined : (stryCov_9fa48("2782"), (cap, i) => <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-neutral-100 text-neutral-600">
                {cap.replace(/_/g, ' ')}
              </span>)))}
            {stryMutAct_9fa48("2786") ? agent.capabilities.length > 4 || <span className="px-2 py-0.5 text-xs text-neutral-400">
                +{agent.capabilities.length - 4} more
              </span> : stryMutAct_9fa48("2785") ? false : stryMutAct_9fa48("2784") ? true : (stryCov_9fa48("2784", "2785", "2786"), (stryMutAct_9fa48("2789") ? agent.capabilities.length <= 4 : stryMutAct_9fa48("2788") ? agent.capabilities.length >= 4 : stryMutAct_9fa48("2787") ? true : (stryCov_9fa48("2787", "2788", "2789"), agent.capabilities.length > 4)) && <span className="px-2 py-0.5 text-xs text-neutral-400">
                +{stryMutAct_9fa48("2790") ? agent.capabilities.length + 4 : (stryCov_9fa48("2790"), agent.capabilities.length - 4)} more
              </span>)}
          </div>
        </div>)}
    </div>;
};
export default AgentCard;