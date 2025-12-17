/**
 * UI Store - Global UI state management
 * 
 * Manages sidebar, modals, toasts, command palette, and other UI state.
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
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// =============================================================================
// TYPES
// =============================================================================

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}
export interface Modal {
  id: string;
  component: string;
  props?: Record<string, unknown>;
  onClose?: () => void;
}
export interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;

  // Command Palette
  commandPaletteOpen: boolean;

  // Search
  globalSearchOpen: boolean;
  globalSearchQuery: string;

  // Modals
  activeModals: Modal[];

  // Toasts
  toasts: Toast[];

  // Loading States
  globalLoading: boolean;
  loadingMessage: string | null;

  // Panels
  rightPanelOpen: boolean;
  rightPanelContent: string | null;

  // Page State
  pageTitle: string;
  breadcrumbs: Array<{
    label: string;
    path?: string;
  }>;

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setGlobalSearchOpen: (open: boolean) => void;
  setGlobalSearchQuery: (query: string) => void;
  openModal: (modal: Omit<Modal, 'id'>) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  setGlobalLoading: (loading: boolean, message?: string) => void;
  setRightPanel: (open: boolean, content?: string) => void;
  setPageTitle: (title: string) => void;
  setBreadcrumbs: (breadcrumbs: Array<{
    label: string;
    path?: string;
  }>) => void;
}

// =============================================================================
// HELPERS
// =============================================================================

let toastCounter = 0;
let modalCounter = 0;
function generateToastId(): string {
  return `toast-${stryMutAct_9fa48("71655") ? --toastCounter : (stryCov_9fa48("71655"), ++toastCounter)}-${Date.now()}`;
}
function generateModalId(): string {
  return `modal-${stryMutAct_9fa48("71658") ? --modalCounter : (stryCov_9fa48("71658"), ++modalCounter)}-${Date.now()}`;
}

// =============================================================================
// STORE
// =============================================================================

export const useUIStore = create<UIState>()(immer(stryMutAct_9fa48("71659") ? () => undefined : (stryCov_9fa48("71659"), (set, get) => stryMutAct_9fa48("71660") ? {} : (stryCov_9fa48("71660"), {
  // Initial State
  sidebarOpen: stryMutAct_9fa48("71661") ? false : (stryCov_9fa48("71661"), true),
  sidebarCollapsed: stryMutAct_9fa48("71662") ? true : (stryCov_9fa48("71662"), false),
  commandPaletteOpen: stryMutAct_9fa48("71663") ? true : (stryCov_9fa48("71663"), false),
  globalSearchOpen: stryMutAct_9fa48("71664") ? true : (stryCov_9fa48("71664"), false),
  globalSearchQuery: '',
  activeModals: stryMutAct_9fa48("71666") ? ["Stryker was here"] : (stryCov_9fa48("71666"), []),
  toasts: stryMutAct_9fa48("71667") ? ["Stryker was here"] : (stryCov_9fa48("71667"), []),
  globalLoading: stryMutAct_9fa48("71668") ? true : (stryCov_9fa48("71668"), false),
  loadingMessage: null,
  rightPanelOpen: stryMutAct_9fa48("71669") ? true : (stryCov_9fa48("71669"), false),
  rightPanelContent: null,
  pageTitle: 'Datacendia',
  breadcrumbs: stryMutAct_9fa48("71671") ? ["Stryker was here"] : (stryCov_9fa48("71671"), []),
  // Sidebar Actions
  toggleSidebar: stryMutAct_9fa48("71672") ? () => undefined : (stryCov_9fa48("71672"), () => set(state => {
    state.sidebarOpen = stryMutAct_9fa48("71674") ? state.sidebarOpen : (stryCov_9fa48("71674"), !state.sidebarOpen);
  })),
  setSidebarOpen: stryMutAct_9fa48("71675") ? () => undefined : (stryCov_9fa48("71675"), open => set(state => {
    state.sidebarOpen = open;
  })),
  setSidebarCollapsed: stryMutAct_9fa48("71677") ? () => undefined : (stryCov_9fa48("71677"), collapsed => set(state => {
    state.sidebarCollapsed = collapsed;
  })),
  // Command Palette Actions
  toggleCommandPalette: stryMutAct_9fa48("71679") ? () => undefined : (stryCov_9fa48("71679"), () => set(state => {
    state.commandPaletteOpen = stryMutAct_9fa48("71681") ? state.commandPaletteOpen : (stryCov_9fa48("71681"), !state.commandPaletteOpen);
  })),
  setCommandPaletteOpen: stryMutAct_9fa48("71682") ? () => undefined : (stryCov_9fa48("71682"), open => set(state => {
    state.commandPaletteOpen = open;
  })),
  // Search Actions
  setGlobalSearchOpen: stryMutAct_9fa48("71684") ? () => undefined : (stryCov_9fa48("71684"), open => set(state => {
    state.globalSearchOpen = open;
    if (stryMutAct_9fa48("71688") ? false : stryMutAct_9fa48("71687") ? true : stryMutAct_9fa48("71686") ? open : (stryCov_9fa48("71686", "71687", "71688"), !open)) {
      state.globalSearchQuery = '';
    }
  })),
  setGlobalSearchQuery: stryMutAct_9fa48("71691") ? () => undefined : (stryCov_9fa48("71691"), query => set(state => {
    state.globalSearchQuery = query;
  })),
  // Modal Actions
  openModal: modal => {
    const id = generateModalId();
    set(state => {
      state.activeModals.push(stryMutAct_9fa48("71695") ? {} : (stryCov_9fa48("71695"), {
        ...modal,
        id
      }));
    });
    return id;
  },
  closeModal: stryMutAct_9fa48("71696") ? () => undefined : (stryCov_9fa48("71696"), id => set(state => {
    const modal = state.activeModals.find(stryMutAct_9fa48("71698") ? () => undefined : (stryCov_9fa48("71698"), (m: Modal) => stryMutAct_9fa48("71701") ? m.id !== id : stryMutAct_9fa48("71700") ? false : stryMutAct_9fa48("71699") ? true : (stryCov_9fa48("71699", "71700", "71701"), m.id === id)));
    if (stryMutAct_9fa48("71704") ? modal.onClose : stryMutAct_9fa48("71703") ? false : stryMutAct_9fa48("71702") ? true : (stryCov_9fa48("71702", "71703", "71704"), modal?.onClose)) {
      modal.onClose();
    }
    state.activeModals = stryMutAct_9fa48("71706") ? state.activeModals : (stryCov_9fa48("71706"), state.activeModals.filter(stryMutAct_9fa48("71707") ? () => undefined : (stryCov_9fa48("71707"), (m: Modal) => stryMutAct_9fa48("71710") ? m.id === id : stryMutAct_9fa48("71709") ? false : stryMutAct_9fa48("71708") ? true : (stryCov_9fa48("71708", "71709", "71710"), m.id !== id))));
  })),
  closeAllModals: stryMutAct_9fa48("71711") ? () => undefined : (stryCov_9fa48("71711"), () => set(state => {
    state.activeModals.forEach((modal: Modal) => {
      if (stryMutAct_9fa48("71715") ? false : stryMutAct_9fa48("71714") ? true : (stryCov_9fa48("71714", "71715"), modal.onClose)) {
        modal.onClose();
      }
    });
    state.activeModals = stryMutAct_9fa48("71717") ? ["Stryker was here"] : (stryCov_9fa48("71717"), []);
  })),
  // Toast Actions
  addToast: toast => {
    const id = generateToastId();
    const duration = stryMutAct_9fa48("71719") ? toast.duration && 5000 : (stryCov_9fa48("71719"), toast.duration ?? 5000);
    set(state => {
      state.toasts.push(stryMutAct_9fa48("71721") ? {} : (stryCov_9fa48("71721"), {
        ...toast,
        id
      }));
    });

    // Auto-remove after duration
    if (stryMutAct_9fa48("71725") ? duration <= 0 : stryMutAct_9fa48("71724") ? duration >= 0 : stryMutAct_9fa48("71723") ? false : stryMutAct_9fa48("71722") ? true : (stryCov_9fa48("71722", "71723", "71724", "71725"), duration > 0)) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }
    return id;
  },
  removeToast: stryMutAct_9fa48("71728") ? () => undefined : (stryCov_9fa48("71728"), id => set(state => {
    state.toasts = stryMutAct_9fa48("71730") ? state.toasts : (stryCov_9fa48("71730"), state.toasts.filter(stryMutAct_9fa48("71731") ? () => undefined : (stryCov_9fa48("71731"), (t: Toast) => stryMutAct_9fa48("71734") ? t.id === id : stryMutAct_9fa48("71733") ? false : stryMutAct_9fa48("71732") ? true : (stryCov_9fa48("71732", "71733", "71734"), t.id !== id))));
  })),
  clearToasts: stryMutAct_9fa48("71735") ? () => undefined : (stryCov_9fa48("71735"), () => set(state => {
    state.toasts = stryMutAct_9fa48("71737") ? ["Stryker was here"] : (stryCov_9fa48("71737"), []);
  })),
  // Loading Actions
  setGlobalLoading: stryMutAct_9fa48("71738") ? () => undefined : (stryCov_9fa48("71738"), (loading, message) => set(state => {
    state.globalLoading = loading;
    state.loadingMessage = loading ? stryMutAct_9fa48("71740") ? message && null : (stryCov_9fa48("71740"), message ?? null) : null;
  })),
  // Right Panel Actions
  setRightPanel: stryMutAct_9fa48("71741") ? () => undefined : (stryCov_9fa48("71741"), (open, content) => set(state => {
    state.rightPanelOpen = open;
    state.rightPanelContent = open ? stryMutAct_9fa48("71743") ? content && null : (stryCov_9fa48("71743"), content ?? null) : null;
  })),
  // Page Actions
  setPageTitle: stryMutAct_9fa48("71744") ? () => undefined : (stryCov_9fa48("71744"), title => set(state => {
    state.pageTitle = title;
    document.title = `${title} | Datacendia`;
  })),
  setBreadcrumbs: stryMutAct_9fa48("71747") ? () => undefined : (stryCov_9fa48("71747"), breadcrumbs => set(state => {
    state.breadcrumbs = breadcrumbs;
  }))
}))));

// =============================================================================
// CONVENIENCE HOOKS
// =============================================================================

export function useToast() {
  const addToast = useUIStore(stryMutAct_9fa48("71750") ? () => undefined : (stryCov_9fa48("71750"), state => state.addToast));
  const removeToast = useUIStore(stryMutAct_9fa48("71751") ? () => undefined : (stryCov_9fa48("71751"), state => state.removeToast));
  return stryMutAct_9fa48("71752") ? {} : (stryCov_9fa48("71752"), {
    success: stryMutAct_9fa48("71753") ? () => undefined : (stryCov_9fa48("71753"), (title: string, message?: string) => addToast(stryMutAct_9fa48("71754") ? {} : (stryCov_9fa48("71754"), {
      type: 'success',
      title,
      message
    }))),
    error: stryMutAct_9fa48("71756") ? () => undefined : (stryCov_9fa48("71756"), (title: string, message?: string) => addToast(stryMutAct_9fa48("71757") ? {} : (stryCov_9fa48("71757"), {
      type: 'error',
      title,
      message
    }))),
    warning: stryMutAct_9fa48("71759") ? () => undefined : (stryCov_9fa48("71759"), (title: string, message?: string) => addToast(stryMutAct_9fa48("71760") ? {} : (stryCov_9fa48("71760"), {
      type: 'warning',
      title,
      message
    }))),
    info: stryMutAct_9fa48("71762") ? () => undefined : (stryCov_9fa48("71762"), (title: string, message?: string) => addToast(stryMutAct_9fa48("71763") ? {} : (stryCov_9fa48("71763"), {
      type: 'info',
      title,
      message
    }))),
    remove: removeToast
  });
}

// =============================================================================
// SELECTORS
// =============================================================================

export const selectSidebarOpen = stryMutAct_9fa48("71765") ? () => undefined : (stryCov_9fa48("71765"), (() => {
  const selectSidebarOpen = (state: UIState) => state.sidebarOpen;
  return selectSidebarOpen;
})());
export const selectCommandPaletteOpen = stryMutAct_9fa48("71766") ? () => undefined : (stryCov_9fa48("71766"), (() => {
  const selectCommandPaletteOpen = (state: UIState) => state.commandPaletteOpen;
  return selectCommandPaletteOpen;
})());
export const selectToasts = stryMutAct_9fa48("71767") ? () => undefined : (stryCov_9fa48("71767"), (() => {
  const selectToasts = (state: UIState) => state.toasts;
  return selectToasts;
})());
export const selectGlobalLoading = stryMutAct_9fa48("71768") ? () => undefined : (stryCov_9fa48("71768"), (() => {
  const selectGlobalLoading = (state: UIState) => state.globalLoading;
  return selectGlobalLoading;
})());