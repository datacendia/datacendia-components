// @ts-nocheck
// =============================================================================
// DATACENDIA - COMMAND PALETTE (Cmd+K)
// Global search and quick actions for power users
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
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

// =============================================================================
// TYPES
// =============================================================================

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  category: 'navigation' | 'action' | 'agent' | 'mode' | 'recent';
  action: () => void;
  keywords?: string[];
}

// =============================================================================
// COMMAND PALETTE COMPONENT
// =============================================================================

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(stryMutAct_9fa48("453") ? true : (stryCov_9fa48("453"), false));
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const {
    t,
    language,
    setLanguage,
    languages
  } = useLanguage();

  // Navigation commands
  const navigationCommands: CommandItem[] = useMemo(stryMutAct_9fa48("455") ? () => undefined : (stryCov_9fa48("455"), () => stryMutAct_9fa48("456") ? [] : (stryCov_9fa48("456"), [stryMutAct_9fa48("457") ? {} : (stryCov_9fa48("457"), {
    id: 'nav-dashboard',
    title: t('sidebar.dashboard'),
    subtitle: 'Go to Dashboard',
    icon: '📊',
    category: 'navigation',
    action: stryMutAct_9fa48("463") ? () => undefined : (stryCov_9fa48("463"), () => navigate('/cortex/dashboard')),
    keywords: stryMutAct_9fa48("465") ? [] : (stryCov_9fa48("465"), ['home', 'panel'])
  }), stryMutAct_9fa48("468") ? {} : (stryCov_9fa48("468"), {
    id: 'nav-council',
    title: t('sidebar.the_council'),
    subtitle: 'Ask the AI Council',
    icon: '🧠',
    category: 'navigation',
    action: stryMutAct_9fa48("474") ? () => undefined : (stryCov_9fa48("474"), () => navigate('/cortex/council')),
    keywords: stryMutAct_9fa48("476") ? [] : (stryCov_9fa48("476"), ['agents', 'ai', 'ask'])
  }), stryMutAct_9fa48("480") ? {} : (stryCov_9fa48("480"), {
    id: 'nav-graph',
    title: t('sidebar.the_graph'),
    subtitle: 'Explore Knowledge Graph',
    icon: '🕸️',
    category: 'navigation',
    action: stryMutAct_9fa48("486") ? () => undefined : (stryCov_9fa48("486"), () => navigate('/cortex/graph')),
    keywords: stryMutAct_9fa48("488") ? [] : (stryCov_9fa48("488"), ['knowledge', 'entities', 'explore'])
  }), stryMutAct_9fa48("492") ? {} : (stryCov_9fa48("492"), {
    id: 'nav-pulse',
    title: t('sidebar.the_pulse'),
    subtitle: 'Real-time Health Monitoring',
    icon: '💓',
    category: 'navigation',
    action: stryMutAct_9fa48("498") ? () => undefined : (stryCov_9fa48("498"), () => navigate('/cortex/pulse')),
    keywords: stryMutAct_9fa48("500") ? [] : (stryCov_9fa48("500"), ['health', 'monitoring', 'alerts'])
  }), stryMutAct_9fa48("504") ? {} : (stryCov_9fa48("504"), {
    id: 'nav-lens',
    title: t('sidebar.the_lens'),
    subtitle: 'Predictive Analytics',
    icon: '🔮',
    category: 'navigation',
    action: stryMutAct_9fa48("510") ? () => undefined : (stryCov_9fa48("510"), () => navigate('/cortex/lens')),
    keywords: stryMutAct_9fa48("512") ? [] : (stryCov_9fa48("512"), ['forecast', 'predict', 'scenarios'])
  }), stryMutAct_9fa48("516") ? {} : (stryCov_9fa48("516"), {
    id: 'nav-bridge',
    title: t('sidebar.the_bridge'),
    subtitle: 'Workflow Automation',
    icon: '🌉',
    category: 'navigation',
    action: stryMutAct_9fa48("522") ? () => undefined : (stryCov_9fa48("522"), () => navigate('/cortex/bridge')),
    keywords: stryMutAct_9fa48("524") ? [] : (stryCov_9fa48("524"), ['workflows', 'automation', 'integrations'])
  }), stryMutAct_9fa48("528") ? {} : (stryCov_9fa48("528"), {
    id: 'nav-settings',
    title: t('sidebar.settings'),
    subtitle: 'App Settings',
    icon: '⚙️',
    category: 'navigation',
    action: stryMutAct_9fa48("534") ? () => undefined : (stryCov_9fa48("534"), () => navigate('/cortex/settings')),
    keywords: stryMutAct_9fa48("536") ? [] : (stryCov_9fa48("536"), ['config', 'preferences'])
  })])), stryMutAct_9fa48("539") ? [] : (stryCov_9fa48("539"), [navigate, t]));

  // Action commands
  const actionCommands: CommandItem[] = useMemo(stryMutAct_9fa48("540") ? () => undefined : (stryCov_9fa48("540"), () => stryMutAct_9fa48("541") ? [] : (stryCov_9fa48("541"), [stryMutAct_9fa48("542") ? {} : (stryCov_9fa48("542"), {
    id: 'action-new-query',
    title: t('commandPalette.newQuery'),
    subtitle: t('commandPalette.askCouncil'),
    icon: '💬',
    category: 'action',
    action: () => {
      navigate('/cortex/council');
      setTimeout(stryMutAct_9fa48("550") ? () => undefined : (stryCov_9fa48("550"), () => stryMutAct_9fa48("551") ? document.querySelector<HTMLTextAreaElement>('textarea').focus() : (stryCov_9fa48("551"), document.querySelector<HTMLTextAreaElement>('textarea')?.focus())), 100);
    },
    keywords: stryMutAct_9fa48("553") ? [] : (stryCov_9fa48("553"), ['ask', 'question'])
  }), stryMutAct_9fa48("556") ? {} : (stryCov_9fa48("556"), {
    id: 'action-refresh',
    title: t('commandPalette.refresh'),
    subtitle: t('commandPalette.reloadPage'),
    icon: '🔄',
    category: 'action',
    action: stryMutAct_9fa48("562") ? () => undefined : (stryCov_9fa48("562"), () => window.location.reload()),
    keywords: stryMutAct_9fa48("563") ? [] : (stryCov_9fa48("563"), ['reload'])
  }), stryMutAct_9fa48("565") ? {} : (stryCov_9fa48("565"), {
    id: 'action-fullscreen',
    title: t('commandPalette.fullscreen'),
    subtitle: t('commandPalette.toggleFullscreen'),
    icon: '⛶',
    category: 'action',
    action: stryMutAct_9fa48("571") ? () => undefined : (stryCov_9fa48("571"), () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()),
    keywords: stryMutAct_9fa48("572") ? [] : (stryCov_9fa48("572"), ['full', 'screen'])
  }), ...(stryMutAct_9fa48("575") ? languages.map(lang => ({
    id: `lang-${lang.code}`,
    title: `${t('commandPalette.switchTo')} ${lang.nativeName}`,
    subtitle: `${t('commandPalette.changeLanguage')} ${lang.name}`,
    icon: '🌐',
    category: 'action' as const,
    action: () => setLanguage(lang.code),
    keywords: [lang.code, lang.name.toLowerCase(), lang.nativeName.toLowerCase()]
  })) : (stryCov_9fa48("575"), languages.slice(0, 8).map(stryMutAct_9fa48("576") ? () => undefined : (stryCov_9fa48("576"), lang => stryMutAct_9fa48("577") ? {} : (stryCov_9fa48("577"), {
    id: `lang-${lang.code}`,
    title: `${t('commandPalette.switchTo')} ${lang.nativeName}`,
    subtitle: `${t('commandPalette.changeLanguage')} ${lang.name}`,
    icon: '🌐',
    category: 'action' as const,
    action: stryMutAct_9fa48("584") ? () => undefined : (stryCov_9fa48("584"), () => setLanguage(lang.code)),
    keywords: stryMutAct_9fa48("585") ? [] : (stryCov_9fa48("585"), [lang.code, stryMutAct_9fa48("586") ? lang.name.toUpperCase() : (stryCov_9fa48("586"), lang.name.toLowerCase()), stryMutAct_9fa48("587") ? lang.nativeName.toUpperCase() : (stryCov_9fa48("587"), lang.nativeName.toLowerCase())])
  })))))])), stryMutAct_9fa48("588") ? [] : (stryCov_9fa48("588"), [navigate, languages, setLanguage]));

  // Agent commands
  const agentCommands: CommandItem[] = useMemo(stryMutAct_9fa48("589") ? () => undefined : (stryCov_9fa48("589"), () => stryMutAct_9fa48("590") ? [] : (stryCov_9fa48("590"), [stryMutAct_9fa48("591") ? {} : (stryCov_9fa48("591"), {
    id: 'agent-chief',
    title: t('commandPalette.agents.chief'),
    subtitle: t('commandPalette.agents.chiefDesc'),
    icon: '👔',
    category: 'agent',
    action: stryMutAct_9fa48("597") ? () => undefined : (stryCov_9fa48("597"), () => navigate('/cortex/council?agent=chief')),
    keywords: stryMutAct_9fa48("599") ? [] : (stryCov_9fa48("599"), ['ceo', 'strategy'])
  }), stryMutAct_9fa48("602") ? {} : (stryCov_9fa48("602"), {
    id: 'agent-cfo',
    title: t('commandPalette.agents.cfo'),
    subtitle: t('commandPalette.agents.cfoDesc'),
    icon: '💰',
    category: 'agent',
    action: stryMutAct_9fa48("608") ? () => undefined : (stryCov_9fa48("608"), () => navigate('/cortex/council?agent=cfo')),
    keywords: stryMutAct_9fa48("610") ? [] : (stryCov_9fa48("610"), ['finance', 'money', 'budget'])
  }), stryMutAct_9fa48("614") ? {} : (stryCov_9fa48("614"), {
    id: 'agent-coo',
    title: t('commandPalette.agents.coo'),
    subtitle: t('commandPalette.agents.cooDesc'),
    icon: '⚙️',
    category: 'agent',
    action: stryMutAct_9fa48("620") ? () => undefined : (stryCov_9fa48("620"), () => navigate('/cortex/council?agent=coo')),
    keywords: stryMutAct_9fa48("622") ? [] : (stryCov_9fa48("622"), ['operations', 'efficiency'])
  }), stryMutAct_9fa48("625") ? {} : (stryCov_9fa48("625"), {
    id: 'agent-ciso',
    title: t('commandPalette.agents.ciso'),
    subtitle: t('commandPalette.agents.cisoDesc'),
    icon: '🛡️',
    category: 'agent',
    action: stryMutAct_9fa48("631") ? () => undefined : (stryCov_9fa48("631"), () => navigate('/cortex/council?agent=ciso')),
    keywords: stryMutAct_9fa48("633") ? [] : (stryCov_9fa48("633"), ['security', 'risk'])
  }), stryMutAct_9fa48("636") ? {} : (stryCov_9fa48("636"), {
    id: 'agent-cmo',
    title: t('commandPalette.agents.cmo'),
    subtitle: t('commandPalette.agents.cmoDesc'),
    icon: '📈',
    category: 'agent',
    action: stryMutAct_9fa48("642") ? () => undefined : (stryCov_9fa48("642"), () => navigate('/cortex/council?agent=cmo')),
    keywords: stryMutAct_9fa48("644") ? [] : (stryCov_9fa48("644"), ['marketing', 'market', 'growth'])
  })])), stryMutAct_9fa48("648") ? [] : (stryCov_9fa48("648"), [navigate]));

  // All commands
  const allCommands = useMemo(stryMutAct_9fa48("649") ? () => undefined : (stryCov_9fa48("649"), () => stryMutAct_9fa48("650") ? [] : (stryCov_9fa48("650"), [...navigationCommands, ...actionCommands, ...agentCommands])), stryMutAct_9fa48("651") ? [] : (stryCov_9fa48("651"), [navigationCommands, actionCommands, agentCommands]));

  // Filter commands by query
  const filteredCommands = useMemo(() => {
    if (stryMutAct_9fa48("655") ? false : stryMutAct_9fa48("654") ? true : stryMutAct_9fa48("653") ? query : (stryCov_9fa48("653", "654", "655"), !query)) {
      return stryMutAct_9fa48("657") ? allCommands : (stryCov_9fa48("657"), allCommands.slice(0, 10));
    }
    const lowerQuery = stryMutAct_9fa48("658") ? query.toUpperCase() : (stryCov_9fa48("658"), query.toLowerCase());
    return stryMutAct_9fa48("660") ? allCommands.slice(0, 10) : stryMutAct_9fa48("659") ? allCommands.filter(cmd => cmd.title.toLowerCase().includes(lowerQuery) || cmd.subtitle?.toLowerCase().includes(lowerQuery) || cmd.keywords?.some(k => k.includes(lowerQuery))) : (stryCov_9fa48("659", "660"), allCommands.filter(stryMutAct_9fa48("661") ? () => undefined : (stryCov_9fa48("661"), cmd => stryMutAct_9fa48("664") ? (cmd.title.toLowerCase().includes(lowerQuery) || cmd.subtitle?.toLowerCase().includes(lowerQuery)) && cmd.keywords?.some(k => k.includes(lowerQuery)) : stryMutAct_9fa48("663") ? false : stryMutAct_9fa48("662") ? true : (stryCov_9fa48("662", "663", "664"), (stryMutAct_9fa48("666") ? cmd.title.toLowerCase().includes(lowerQuery) && cmd.subtitle?.toLowerCase().includes(lowerQuery) : stryMutAct_9fa48("665") ? false : (stryCov_9fa48("665", "666"), (stryMutAct_9fa48("667") ? cmd.title.toUpperCase().includes(lowerQuery) : (stryCov_9fa48("667"), cmd.title.toLowerCase().includes(lowerQuery))) || (stryMutAct_9fa48("669") ? cmd.subtitle.toLowerCase().includes(lowerQuery) : stryMutAct_9fa48("668") ? cmd.subtitle?.toUpperCase().includes(lowerQuery) : (stryCov_9fa48("668", "669"), cmd.subtitle?.toLowerCase().includes(lowerQuery))))) || (stryMutAct_9fa48("671") ? cmd.keywords.some(k => k.includes(lowerQuery)) : stryMutAct_9fa48("670") ? cmd.keywords?.every(k => k.includes(lowerQuery)) : (stryCov_9fa48("670", "671"), cmd.keywords?.some(stryMutAct_9fa48("672") ? () => undefined : (stryCov_9fa48("672"), k => k.includes(lowerQuery)))))))).slice(0, 10));
  }, stryMutAct_9fa48("673") ? [] : (stryCov_9fa48("673"), [query, allCommands]));

  // Keyboard shortcut to open (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (stryMutAct_9fa48("678") ? e.metaKey || e.ctrlKey || e.key === 'k' : stryMutAct_9fa48("677") ? false : stryMutAct_9fa48("676") ? true : (stryCov_9fa48("676", "677", "678"), (stryMutAct_9fa48("680") ? e.metaKey && e.ctrlKey : stryMutAct_9fa48("679") ? true : (stryCov_9fa48("679", "680"), e.metaKey || e.ctrlKey)) && (stryMutAct_9fa48("682") ? e.key !== 'k' : stryMutAct_9fa48("681") ? true : (stryCov_9fa48("681", "682"), e.key === 'k')))) {
        e.preventDefault();
        setIsOpen(stryMutAct_9fa48("685") ? () => undefined : (stryCov_9fa48("685"), prev => stryMutAct_9fa48("686") ? prev : (stryCov_9fa48("686"), !prev)));
      }
      if (stryMutAct_9fa48("689") ? e.key === 'Escape' || isOpen : stryMutAct_9fa48("688") ? false : stryMutAct_9fa48("687") ? true : (stryCov_9fa48("687", "688", "689"), (stryMutAct_9fa48("691") ? e.key !== 'Escape' : stryMutAct_9fa48("690") ? true : (stryCov_9fa48("690", "691"), e.key === 'Escape')) && isOpen)) {
        setIsOpen(stryMutAct_9fa48("694") ? true : (stryCov_9fa48("694"), false));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return stryMutAct_9fa48("696") ? () => undefined : (stryCov_9fa48("696"), () => window.removeEventListener('keydown', handleKeyDown));
  }, stryMutAct_9fa48("698") ? [] : (stryCov_9fa48("698"), [isOpen]));

  // Focus input when opened
  useEffect(() => {
    if (stryMutAct_9fa48("701") ? false : stryMutAct_9fa48("700") ? true : (stryCov_9fa48("700", "701"), isOpen)) {
      setTimeout(stryMutAct_9fa48("703") ? () => undefined : (stryCov_9fa48("703"), () => stryMutAct_9fa48("704") ? inputRef.current.focus() : (stryCov_9fa48("704"), inputRef.current?.focus())), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, stryMutAct_9fa48("706") ? [] : (stryCov_9fa48("706"), [isOpen]));

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (stryMutAct_9fa48("710") ? e.key !== 'ArrowDown' : stryMutAct_9fa48("709") ? false : stryMutAct_9fa48("708") ? true : (stryCov_9fa48("708", "709", "710"), e.key === 'ArrowDown')) {
      e.preventDefault();
      setSelectedIndex(stryMutAct_9fa48("713") ? () => undefined : (stryCov_9fa48("713"), prev => stryMutAct_9fa48("714") ? Math.max(prev + 1, filteredCommands.length - 1) : (stryCov_9fa48("714"), Math.min(stryMutAct_9fa48("715") ? prev - 1 : (stryCov_9fa48("715"), prev + 1), stryMutAct_9fa48("716") ? filteredCommands.length + 1 : (stryCov_9fa48("716"), filteredCommands.length - 1)))));
    } else if (stryMutAct_9fa48("719") ? e.key !== 'ArrowUp' : stryMutAct_9fa48("718") ? false : stryMutAct_9fa48("717") ? true : (stryCov_9fa48("717", "718", "719"), e.key === 'ArrowUp')) {
      e.preventDefault();
      setSelectedIndex(stryMutAct_9fa48("722") ? () => undefined : (stryCov_9fa48("722"), prev => stryMutAct_9fa48("723") ? Math.min(prev - 1, 0) : (stryCov_9fa48("723"), Math.max(stryMutAct_9fa48("724") ? prev + 1 : (stryCov_9fa48("724"), prev - 1), 0))));
    } else if (stryMutAct_9fa48("727") ? e.key === 'Enter' || filteredCommands[selectedIndex] : stryMutAct_9fa48("726") ? false : stryMutAct_9fa48("725") ? true : (stryCov_9fa48("725", "726", "727"), (stryMutAct_9fa48("729") ? e.key !== 'Enter' : stryMutAct_9fa48("728") ? true : (stryCov_9fa48("728", "729"), e.key === 'Enter')) && filteredCommands[selectedIndex])) {
      e.preventDefault();
      filteredCommands[selectedIndex].action();
      setIsOpen(stryMutAct_9fa48("732") ? true : (stryCov_9fa48("732"), false));
    }
  }, stryMutAct_9fa48("733") ? [] : (stryCov_9fa48("733"), [filteredCommands, selectedIndex]));

  // Scroll selected item into view
  useEffect(() => {
    const selectedEl = listRef.current?.children[selectedIndex] as HTMLElement;
    stryMutAct_9fa48("735") ? selectedEl.scrollIntoView({
      block: 'nearest'
    }) : (stryCov_9fa48("735"), selectedEl?.scrollIntoView(stryMutAct_9fa48("736") ? {} : (stryCov_9fa48("736"), {
      block: 'nearest'
    })));
  }, stryMutAct_9fa48("738") ? [] : (stryCov_9fa48("738"), [selectedIndex]));

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, stryMutAct_9fa48("740") ? [] : (stryCov_9fa48("740"), [query]));

  // Category labels
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'navigation':
        if (stryMutAct_9fa48("742")) {} else {
          stryCov_9fa48("742");
          return t('commandPalette.categories.navigation');
        }
      case 'action':
        if (stryMutAct_9fa48("745")) {} else {
          stryCov_9fa48("745");
          return t('commandPalette.categories.actions');
        }
      case 'agent':
        if (stryMutAct_9fa48("748")) {} else {
          stryCov_9fa48("748");
          return t('commandPalette.categories.agents');
        }
      case 'mode':
        if (stryMutAct_9fa48("751")) {} else {
          stryCov_9fa48("751");
          return t('commandPalette.categories.modes');
        }
      case 'recent':
        if (stryMutAct_9fa48("754")) {} else {
          stryCov_9fa48("754");
          return t('commandPalette.categories.recent');
        }
      default:
        if (stryMutAct_9fa48("757")) {} else {
          stryCov_9fa48("757");
          return category;
        }
    }
  };

  // Group commands by category
  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filteredCommands.forEach(cmd => {
      if (stryMutAct_9fa48("762") ? false : stryMutAct_9fa48("761") ? true : stryMutAct_9fa48("760") ? groups[cmd.category] : (stryCov_9fa48("760", "761", "762"), !groups[cmd.category])) {
        groups[cmd.category] = stryMutAct_9fa48("764") ? ["Stryker was here"] : (stryCov_9fa48("764"), []);
      }
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, stryMutAct_9fa48("765") ? [] : (stryCov_9fa48("765"), [filteredCommands]));
  if (stryMutAct_9fa48("768") ? false : stryMutAct_9fa48("767") ? true : stryMutAct_9fa48("766") ? isOpen : (stryCov_9fa48("766", "767", "768"), !isOpen)) {
    return null;
  }
  return <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] animate-in fade-in duration-150" onClick={stryMutAct_9fa48("770") ? () => undefined : (stryCov_9fa48("770"), () => setIsOpen(stryMutAct_9fa48("771") ? true : (stryCov_9fa48("771"), false)))} />
      
      {/* Palette */}
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-[201] animate-in slide-in-from-top-4 fade-in duration-200">
        <div className="bg-sovereign-card rounded-2xl shadow-2xl border border-sovereign-border overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-sovereign-border-subtle">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input ref={inputRef} type="text" value={query} onChange={stryMutAct_9fa48("772") ? () => undefined : (stryCov_9fa48("772"), e => setQuery(e.target.value))} onKeyDown={handleKeyDown} placeholder={t('commandPalette.searchPlaceholder')} className="flex-1 bg-transparent text-white placeholder:text-gray-500 focus:outline-none text-base" />
            <kbd className="hidden sm:inline-flex px-2 py-1 text-xs font-mono text-gray-400 bg-sovereign-active rounded">
              esc
            </kbd>
          </div>

          {/* Results */}
          <div ref={listRef} className="max-h-80 overflow-y-auto py-2">
            {(stryMutAct_9fa48("776") ? filteredCommands.length !== 0 : stryMutAct_9fa48("775") ? false : stryMutAct_9fa48("774") ? true : (stryCov_9fa48("774", "775", "776"), filteredCommands.length === 0)) ? <div className="px-4 py-8 text-center text-gray-500">
                <span className="text-2xl mb-2 block">🔍</span>
                {t('commandPalette.noResults')} "{query}"
              </div> : Object.entries(groupedCommands).map(stryMutAct_9fa48("778") ? () => undefined : (stryCov_9fa48("778"), ([category, commands]) => <div key={category}>
                  <div className="px-4 py-1.5 text-xs font-medium text-gray-600 uppercase tracking-wider">
                    {getCategoryLabel(category)}
                  </div>
                  {commands.map((cmd, idx) => {
              const globalIdx = filteredCommands.indexOf(cmd);
              return <button key={cmd.id} onClick={() => {
                cmd.action();
                setIsOpen(stryMutAct_9fa48("781") ? true : (stryCov_9fa48("781"), false));
              }} className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${(stryMutAct_9fa48("785") ? globalIdx !== selectedIndex : stryMutAct_9fa48("784") ? false : stryMutAct_9fa48("783") ? true : (stryCov_9fa48("783", "784", "785"), globalIdx === selectedIndex)) ? 'bg-sovereign-active text-white border-l-2 border-cyan-500' : 'hover:bg-sovereign-hover text-gray-300'}`}>
                        <span className="text-lg w-8 text-center">{cmd.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{cmd.title}</p>
                          {stryMutAct_9fa48("790") ? cmd.subtitle || <p className="text-xs text-gray-500 truncate">{cmd.subtitle}</p> : stryMutAct_9fa48("789") ? false : stryMutAct_9fa48("788") ? true : (stryCov_9fa48("788", "789", "790"), cmd.subtitle && <p className="text-xs text-gray-500 truncate">{cmd.subtitle}</p>)}
                        </div>
                        {stryMutAct_9fa48("793") ? globalIdx === selectedIndex || <kbd className="px-2 py-0.5 text-xs font-mono text-cyan-400 bg-cyan-900/30 rounded">
                            ↵
                          </kbd> : stryMutAct_9fa48("792") ? false : stryMutAct_9fa48("791") ? true : (stryCov_9fa48("791", "792", "793"), (stryMutAct_9fa48("795") ? globalIdx !== selectedIndex : stryMutAct_9fa48("794") ? true : (stryCov_9fa48("794", "795"), globalIdx === selectedIndex)) && <kbd className="px-2 py-0.5 text-xs font-mono text-cyan-400 bg-cyan-900/30 rounded">
                            ↵
                          </kbd>)}
                      </button>;
            })}
                </div>))}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-sovereign-border-subtle bg-sovereign-elevated flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-sovereign-active rounded font-mono text-[10px] text-gray-400">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-sovereign-active rounded font-mono text-[10px] text-gray-400">↓</kbd>
                {t('commandPalette.navigate')}
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-sovereign-active rounded font-mono text-[10px] text-gray-400">↵</kbd>
                {t('commandPalette.select')}
              </span>
            </div>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-sovereign-active rounded font-mono text-[10px] text-gray-400">Ctrl+K</kbd>
              {t('commandPalette.toggle')}
            </span>
          </div>
        </div>
      </div>
    </>;
}
export default CommandPalette;