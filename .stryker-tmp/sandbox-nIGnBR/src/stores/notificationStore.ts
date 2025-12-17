/**
 * Notification Store - Real-time notifications and alerts
 * 
 * Manages system notifications, alerts, and real-time updates.
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
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// =============================================================================
// TYPES
// =============================================================================

export type NotificationType = 'alert' | 'decision' | 'deliberation' | 'workflow' | 'system' | 'mention' | 'approval';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';
export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  read: boolean;
  archived: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  readAt?: Date;
}
export interface NotificationPreferences {
  enableSound: boolean;
  enableDesktop: boolean;
  enableEmail: boolean;
  mutedTypes: NotificationType[];
  quietHoursStart?: string; // HH:mm format
  quietHoursEnd?: string;
}
export interface NotificationState {
  // State
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;

  // Preferences
  preferences: NotificationPreferences;

  // Connection
  isConnected: boolean;

  // Actions
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read' | 'archived'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  archiveNotification: (id: string) => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  fetchNotifications: (limit?: number) => Promise<void>;
  setPreferences: (preferences: Partial<NotificationPreferences>) => void;
  muteType: (type: NotificationType) => void;
  unmuteType: (type: NotificationType) => void;
  setConnected: (connected: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// =============================================================================
// HELPERS
// =============================================================================

let notificationCounter = 0;
function generateNotificationId(): string {
  return `notif-${stryMutAct_9fa48("71424") ? --notificationCounter : (stryCov_9fa48("71424"), ++notificationCounter)}-${Date.now()}`;
}
function playNotificationSound() {
  try {
    const audio = new Audio('/sounds/notification.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  } catch {
    // Ignore audio errors
  }
}
function showDesktopNotification(title: string, body: string) {
  if (stryMutAct_9fa48("71431") ? 'Notification' in window || Notification.permission === 'granted' : stryMutAct_9fa48("71430") ? false : stryMutAct_9fa48("71429") ? true : (stryCov_9fa48("71429", "71430", "71431"), 'Notification' in window && (stryMutAct_9fa48("71434") ? Notification.permission !== 'granted' : stryMutAct_9fa48("71433") ? true : (stryCov_9fa48("71433", "71434"), Notification.permission === 'granted')))) {
    new Notification(title, stryMutAct_9fa48("71437") ? {} : (stryCov_9fa48("71437"), {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico'
    }));
  }
}
function isQuietHours(start?: string, end?: string): boolean {
  if (stryMutAct_9fa48("71443") ? !start && !end : stryMutAct_9fa48("71442") ? false : stryMutAct_9fa48("71441") ? true : (stryCov_9fa48("71441", "71442", "71443"), (stryMutAct_9fa48("71444") ? start : (stryCov_9fa48("71444"), !start)) || (stryMutAct_9fa48("71445") ? end : (stryCov_9fa48("71445"), !end)))) return stryMutAct_9fa48("71446") ? true : (stryCov_9fa48("71446"), false);
  const now = new Date();
  const currentTime = stryMutAct_9fa48("71447") ? now.getHours() * 60 - now.getMinutes() : (stryCov_9fa48("71447"), (stryMutAct_9fa48("71448") ? now.getHours() / 60 : (stryCov_9fa48("71448"), now.getHours() * 60)) + now.getMinutes());
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  const startMinutes = stryMutAct_9fa48("71451") ? startH * 60 - startM : (stryCov_9fa48("71451"), (stryMutAct_9fa48("71452") ? startH / 60 : (stryCov_9fa48("71452"), startH * 60)) + startM);
  const endMinutes = stryMutAct_9fa48("71453") ? endH * 60 - endM : (stryCov_9fa48("71453"), (stryMutAct_9fa48("71454") ? endH / 60 : (stryCov_9fa48("71454"), endH * 60)) + endM);
  if (stryMutAct_9fa48("71458") ? startMinutes > endMinutes : stryMutAct_9fa48("71457") ? startMinutes < endMinutes : stryMutAct_9fa48("71456") ? false : stryMutAct_9fa48("71455") ? true : (stryCov_9fa48("71455", "71456", "71457", "71458"), startMinutes <= endMinutes)) {
    return stryMutAct_9fa48("71462") ? currentTime >= startMinutes || currentTime <= endMinutes : stryMutAct_9fa48("71461") ? false : stryMutAct_9fa48("71460") ? true : (stryCov_9fa48("71460", "71461", "71462"), (stryMutAct_9fa48("71465") ? currentTime < startMinutes : stryMutAct_9fa48("71464") ? currentTime > startMinutes : stryMutAct_9fa48("71463") ? true : (stryCov_9fa48("71463", "71464", "71465"), currentTime >= startMinutes)) && (stryMutAct_9fa48("71468") ? currentTime > endMinutes : stryMutAct_9fa48("71467") ? currentTime < endMinutes : stryMutAct_9fa48("71466") ? true : (stryCov_9fa48("71466", "71467", "71468"), currentTime <= endMinutes)));
  } else {
    return stryMutAct_9fa48("71472") ? currentTime >= startMinutes && currentTime <= endMinutes : stryMutAct_9fa48("71471") ? false : stryMutAct_9fa48("71470") ? true : (stryCov_9fa48("71470", "71471", "71472"), (stryMutAct_9fa48("71475") ? currentTime < startMinutes : stryMutAct_9fa48("71474") ? currentTime > startMinutes : stryMutAct_9fa48("71473") ? false : (stryCov_9fa48("71473", "71474", "71475"), currentTime >= startMinutes)) || (stryMutAct_9fa48("71478") ? currentTime > endMinutes : stryMutAct_9fa48("71477") ? currentTime < endMinutes : stryMutAct_9fa48("71476") ? false : (stryCov_9fa48("71476", "71477", "71478"), currentTime <= endMinutes)));
  }
}

// =============================================================================
// API HELPERS
// =============================================================================

const API_BASE = stryMutAct_9fa48("71481") ? import.meta.env.VITE_API_URL && 'http://localhost:3000/api/v1' : stryMutAct_9fa48("71480") ? false : stryMutAct_9fa48("71479") ? true : (stryCov_9fa48("71479", "71480", "71481"), import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1');
async function notificationApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('datacendia-auth') ? stryMutAct_9fa48("71485") ? JSON.parse(localStorage.getItem('datacendia-auth')!).state.token : (stryCov_9fa48("71485"), JSON.parse(localStorage.getItem('datacendia-auth')!).state?.token) : null;
  const response = await fetch(`${API_BASE}${endpoint}`, stryMutAct_9fa48("71488") ? {} : (stryCov_9fa48("71488"), {
    ...options,
    headers: stryMutAct_9fa48("71489") ? {} : (stryCov_9fa48("71489"), {
      'Content-Type': 'application/json',
      ...(stryMutAct_9fa48("71493") ? token || {
        Authorization: `Bearer ${token}`
      } : stryMutAct_9fa48("71492") ? false : stryMutAct_9fa48("71491") ? true : (stryCov_9fa48("71491", "71492", "71493"), token && (stryMutAct_9fa48("71494") ? {} : (stryCov_9fa48("71494"), {
        Authorization: `Bearer ${token}`
      })))),
      ...options.headers
    })
  }));
  if (stryMutAct_9fa48("71498") ? false : stryMutAct_9fa48("71497") ? true : stryMutAct_9fa48("71496") ? response.ok : (stryCov_9fa48("71496", "71497", "71498"), !response.ok)) {
    const error = await response.json().catch(stryMutAct_9fa48("71500") ? () => undefined : (stryCov_9fa48("71500"), () => stryMutAct_9fa48("71501") ? {} : (stryCov_9fa48("71501"), {
      message: 'Request failed'
    })));
    throw new Error(stryMutAct_9fa48("71505") ? error.message && 'Request failed' : stryMutAct_9fa48("71504") ? false : stryMutAct_9fa48("71503") ? true : (stryCov_9fa48("71503", "71504", "71505"), error.message || 'Request failed'));
  }
  return response.json();
}

// =============================================================================
// STORE
// =============================================================================

export const useNotificationStore = create<NotificationState>()(persist(immer(stryMutAct_9fa48("71507") ? () => undefined : (stryCov_9fa48("71507"), (set, get) => stryMutAct_9fa48("71508") ? {} : (stryCov_9fa48("71508"), {
  // Initial State
  notifications: stryMutAct_9fa48("71509") ? ["Stryker was here"] : (stryCov_9fa48("71509"), []),
  unreadCount: 0,
  isLoading: stryMutAct_9fa48("71510") ? true : (stryCov_9fa48("71510"), false),
  error: null,
  preferences: stryMutAct_9fa48("71511") ? {} : (stryCov_9fa48("71511"), {
    enableSound: stryMutAct_9fa48("71512") ? false : (stryCov_9fa48("71512"), true),
    enableDesktop: stryMutAct_9fa48("71513") ? false : (stryCov_9fa48("71513"), true),
    enableEmail: stryMutAct_9fa48("71514") ? false : (stryCov_9fa48("71514"), true),
    mutedTypes: stryMutAct_9fa48("71515") ? ["Stryker was here"] : (stryCov_9fa48("71515"), [])
  }),
  isConnected: stryMutAct_9fa48("71516") ? true : (stryCov_9fa48("71516"), false),
  // Notification Actions
  setNotifications: stryMutAct_9fa48("71517") ? () => undefined : (stryCov_9fa48("71517"), notifications => set(state => {
    state.notifications = notifications;
    state.unreadCount = stryMutAct_9fa48("71519") ? notifications.length : (stryCov_9fa48("71519"), notifications.filter(stryMutAct_9fa48("71520") ? () => undefined : (stryCov_9fa48("71520"), (n: Notification) => stryMutAct_9fa48("71521") ? n.read : (stryCov_9fa48("71521"), !n.read))).length);
  })),
  addNotification: notification => {
    const {
      preferences
    } = get();

    // Check if type is muted
    if (stryMutAct_9fa48("71524") ? false : stryMutAct_9fa48("71523") ? true : (stryCov_9fa48("71523", "71524"), preferences.mutedTypes.includes(notification.type))) {
      return;
    }

    // Check quiet hours
    const inQuietHours = isQuietHours(preferences.quietHoursStart, preferences.quietHoursEnd);
    const newNotification: Notification = stryMutAct_9fa48("71526") ? {} : (stryCov_9fa48("71526"), {
      ...notification,
      id: generateNotificationId(),
      read: stryMutAct_9fa48("71527") ? true : (stryCov_9fa48("71527"), false),
      archived: stryMutAct_9fa48("71528") ? true : (stryCov_9fa48("71528"), false),
      createdAt: new Date()
    });
    set(state => {
      state.notifications.unshift(newNotification);
      stryMutAct_9fa48("71530") ? state.unreadCount -= 1 : (stryCov_9fa48("71530"), state.unreadCount += 1);
    });

    // Play sound and show desktop notification if not in quiet hours
    if (stryMutAct_9fa48("71533") ? false : stryMutAct_9fa48("71532") ? true : stryMutAct_9fa48("71531") ? inQuietHours : (stryCov_9fa48("71531", "71532", "71533"), !inQuietHours)) {
      if (stryMutAct_9fa48("71536") ? false : stryMutAct_9fa48("71535") ? true : (stryCov_9fa48("71535", "71536"), preferences.enableSound)) {
        playNotificationSound();
      }
      if (stryMutAct_9fa48("71539") ? false : stryMutAct_9fa48("71538") ? true : (stryCov_9fa48("71538", "71539"), preferences.enableDesktop)) {
        showDesktopNotification(notification.title, notification.message);
      }
    }
  },
  markAsRead: stryMutAct_9fa48("71541") ? () => undefined : (stryCov_9fa48("71541"), id => set(state => {
    const notification = state.notifications.find(stryMutAct_9fa48("71543") ? () => undefined : (stryCov_9fa48("71543"), (n: Notification) => stryMutAct_9fa48("71546") ? n.id !== id : stryMutAct_9fa48("71545") ? false : stryMutAct_9fa48("71544") ? true : (stryCov_9fa48("71544", "71545", "71546"), n.id === id)));
    if (stryMutAct_9fa48("71549") ? notification || !notification.read : stryMutAct_9fa48("71548") ? false : stryMutAct_9fa48("71547") ? true : (stryCov_9fa48("71547", "71548", "71549"), notification && (stryMutAct_9fa48("71550") ? notification.read : (stryCov_9fa48("71550"), !notification.read)))) {
      notification.read = stryMutAct_9fa48("71552") ? false : (stryCov_9fa48("71552"), true);
      notification.readAt = new Date();
      state.unreadCount = stryMutAct_9fa48("71553") ? Math.min(0, state.unreadCount - 1) : (stryCov_9fa48("71553"), Math.max(0, stryMutAct_9fa48("71554") ? state.unreadCount + 1 : (stryCov_9fa48("71554"), state.unreadCount - 1)));
    }
  })),
  markAllAsRead: stryMutAct_9fa48("71555") ? () => undefined : (stryCov_9fa48("71555"), () => set(state => {
    const now = new Date();
    state.notifications.forEach((n: Notification) => {
      if (stryMutAct_9fa48("71560") ? false : stryMutAct_9fa48("71559") ? true : stryMutAct_9fa48("71558") ? n.read : (stryCov_9fa48("71558", "71559", "71560"), !n.read)) {
        n.read = stryMutAct_9fa48("71562") ? false : (stryCov_9fa48("71562"), true);
        n.readAt = now;
      }
    });
    state.unreadCount = 0;
  })),
  archiveNotification: stryMutAct_9fa48("71563") ? () => undefined : (stryCov_9fa48("71563"), id => set(state => {
    const notification = state.notifications.find(stryMutAct_9fa48("71565") ? () => undefined : (stryCov_9fa48("71565"), (n: Notification) => stryMutAct_9fa48("71568") ? n.id !== id : stryMutAct_9fa48("71567") ? false : stryMutAct_9fa48("71566") ? true : (stryCov_9fa48("71566", "71567", "71568"), n.id === id)));
    if (stryMutAct_9fa48("71570") ? false : stryMutAct_9fa48("71569") ? true : (stryCov_9fa48("71569", "71570"), notification)) {
      notification.archived = stryMutAct_9fa48("71572") ? false : (stryCov_9fa48("71572"), true);
    }
  })),
  deleteNotification: stryMutAct_9fa48("71573") ? () => undefined : (stryCov_9fa48("71573"), id => set(state => {
    const index = state.notifications.findIndex(stryMutAct_9fa48("71575") ? () => undefined : (stryCov_9fa48("71575"), (n: Notification) => stryMutAct_9fa48("71578") ? n.id !== id : stryMutAct_9fa48("71577") ? false : stryMutAct_9fa48("71576") ? true : (stryCov_9fa48("71576", "71577", "71578"), n.id === id)));
    if (stryMutAct_9fa48("71581") ? index === -1 : stryMutAct_9fa48("71580") ? false : stryMutAct_9fa48("71579") ? true : (stryCov_9fa48("71579", "71580", "71581"), index !== (stryMutAct_9fa48("71582") ? +1 : (stryCov_9fa48("71582"), -1)))) {
      const notification = state.notifications[index];
      if (stryMutAct_9fa48("71586") ? false : stryMutAct_9fa48("71585") ? true : stryMutAct_9fa48("71584") ? notification.read : (stryCov_9fa48("71584", "71585", "71586"), !notification.read)) {
        state.unreadCount = stryMutAct_9fa48("71588") ? Math.min(0, state.unreadCount - 1) : (stryCov_9fa48("71588"), Math.max(0, stryMutAct_9fa48("71589") ? state.unreadCount + 1 : (stryCov_9fa48("71589"), state.unreadCount - 1)));
      }
      state.notifications.splice(index, 1);
    }
  })),
  clearAll: stryMutAct_9fa48("71590") ? () => undefined : (stryCov_9fa48("71590"), () => set(state => {
    state.notifications = stryMutAct_9fa48("71592") ? ["Stryker was here"] : (stryCov_9fa48("71592"), []);
    state.unreadCount = 0;
  })),
  fetchNotifications: async (limit = 50) => {
    set(state => {
      state.isLoading = stryMutAct_9fa48("71595") ? false : (stryCov_9fa48("71595"), true);
    });
    try {
      const response = await notificationApi<{
        notifications: Notification[];
      }>(`/alerts?limit=${limit}`);
      set(state => {
        state.notifications = response.notifications;
        state.unreadCount = stryMutAct_9fa48("71599") ? response.notifications.length : (stryCov_9fa48("71599"), response.notifications.filter(stryMutAct_9fa48("71600") ? () => undefined : (stryCov_9fa48("71600"), (n: Notification) => stryMutAct_9fa48("71601") ? n.read : (stryCov_9fa48("71601"), !n.read))).length);
        state.isLoading = stryMutAct_9fa48("71602") ? true : (stryCov_9fa48("71602"), false);
      });
    } catch (error) {
      set(state => {
        state.error = error instanceof Error ? error.message : 'Failed to fetch notifications';
        state.isLoading = stryMutAct_9fa48("71606") ? true : (stryCov_9fa48("71606"), false);
      });
    }
  },
  // Preference Actions
  setPreferences: stryMutAct_9fa48("71607") ? () => undefined : (stryCov_9fa48("71607"), preferences => set(state => {
    Object.assign(state.preferences, preferences);
  })),
  muteType: stryMutAct_9fa48("71609") ? () => undefined : (stryCov_9fa48("71609"), type => set(state => {
    if (stryMutAct_9fa48("71613") ? false : stryMutAct_9fa48("71612") ? true : stryMutAct_9fa48("71611") ? state.preferences.mutedTypes.includes(type) : (stryCov_9fa48("71611", "71612", "71613"), !state.preferences.mutedTypes.includes(type))) {
      state.preferences.mutedTypes.push(type);
    }
  })),
  unmuteType: stryMutAct_9fa48("71615") ? () => undefined : (stryCov_9fa48("71615"), type => set(state => {
    state.preferences.mutedTypes = stryMutAct_9fa48("71617") ? state.preferences.mutedTypes : (stryCov_9fa48("71617"), state.preferences.mutedTypes.filter(stryMutAct_9fa48("71618") ? () => undefined : (stryCov_9fa48("71618"), (t: NotificationType) => stryMutAct_9fa48("71621") ? t === type : stryMutAct_9fa48("71620") ? false : stryMutAct_9fa48("71619") ? true : (stryCov_9fa48("71619", "71620", "71621"), t !== type))));
  })),
  // Connection Actions
  setConnected: stryMutAct_9fa48("71622") ? () => undefined : (stryCov_9fa48("71622"), connected => set(state => {
    state.isConnected = connected;
  })),
  setLoading: stryMutAct_9fa48("71624") ? () => undefined : (stryCov_9fa48("71624"), loading => set(state => {
    state.isLoading = loading;
  })),
  setError: stryMutAct_9fa48("71626") ? () => undefined : (stryCov_9fa48("71626"), error => set(state => {
    state.error = error;
  }))
}))), stryMutAct_9fa48("71628") ? {} : (stryCov_9fa48("71628"), {
  name: 'datacendia-notifications',
  storage: createJSONStorage(stryMutAct_9fa48("71630") ? () => undefined : (stryCov_9fa48("71630"), () => localStorage)),
  partialize: stryMutAct_9fa48("71631") ? () => undefined : (stryCov_9fa48("71631"), state => stryMutAct_9fa48("71632") ? {} : (stryCov_9fa48("71632"), {
    preferences: state.preferences
  }))
})));

// =============================================================================
// SELECTORS
// =============================================================================

export const selectNotifications = stryMutAct_9fa48("71633") ? () => undefined : (stryCov_9fa48("71633"), (() => {
  const selectNotifications = (state: NotificationState) => state.notifications;
  return selectNotifications;
})());
export const selectUnreadCount = stryMutAct_9fa48("71634") ? () => undefined : (stryCov_9fa48("71634"), (() => {
  const selectUnreadCount = (state: NotificationState) => state.unreadCount;
  return selectUnreadCount;
})());
export const selectUnreadNotifications = stryMutAct_9fa48("71635") ? () => undefined : (stryCov_9fa48("71635"), (() => {
  const selectUnreadNotifications = (state: NotificationState) => stryMutAct_9fa48("71636") ? state.notifications : (stryCov_9fa48("71636"), state.notifications.filter(stryMutAct_9fa48("71637") ? () => undefined : (stryCov_9fa48("71637"), n => stryMutAct_9fa48("71640") ? !n.read || !n.archived : stryMutAct_9fa48("71639") ? false : stryMutAct_9fa48("71638") ? true : (stryCov_9fa48("71638", "71639", "71640"), (stryMutAct_9fa48("71641") ? n.read : (stryCov_9fa48("71641"), !n.read)) && (stryMutAct_9fa48("71642") ? n.archived : (stryCov_9fa48("71642"), !n.archived))))));
  return selectUnreadNotifications;
})());
export const selectCriticalNotifications = stryMutAct_9fa48("71643") ? () => undefined : (stryCov_9fa48("71643"), (() => {
  const selectCriticalNotifications = (state: NotificationState) => stryMutAct_9fa48("71644") ? state.notifications : (stryCov_9fa48("71644"), state.notifications.filter(stryMutAct_9fa48("71645") ? () => undefined : (stryCov_9fa48("71645"), n => stryMutAct_9fa48("71648") ? n.priority === 'critical' || !n.read : stryMutAct_9fa48("71647") ? false : stryMutAct_9fa48("71646") ? true : (stryCov_9fa48("71646", "71647", "71648"), (stryMutAct_9fa48("71650") ? n.priority !== 'critical' : stryMutAct_9fa48("71649") ? true : (stryCov_9fa48("71649", "71650"), n.priority === 'critical')) && (stryMutAct_9fa48("71652") ? n.read : (stryCov_9fa48("71652"), !n.read))))));
  return selectCriticalNotifications;
})());