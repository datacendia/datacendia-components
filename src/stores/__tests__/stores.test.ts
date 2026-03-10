/**
 * Zustand Stores Tests
 * Tests for uiStore, notificationStore, councilStore, dataSourceStore
 * @module stores/__tests__/stores.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';

// ============================================================================
// uiStore
// ============================================================================
import { useUIStore } from '../uiStore';

describe('uiStore', () => {
  beforeEach(() => {
    // Reset store between tests
    const { getState } = useUIStore;
    act(() => {
      getState().setSidebarOpen(true);
      getState().setSidebarCollapsed(false);
      getState().setCommandPaletteOpen(false);
      getState().setGlobalSearchOpen(false);
      getState().setGlobalLoading(false);
      getState().clearToasts();
      getState().closeAllModals();
    });
  });

  describe('sidebar', () => {
    it('should initialize with sidebar open', () => {
      expect(useUIStore.getState().sidebarOpen).toBe(true);
    });

    it('should toggle sidebar', () => {
      act(() => useUIStore.getState().toggleSidebar());
      expect(useUIStore.getState().sidebarOpen).toBe(false);
      act(() => useUIStore.getState().toggleSidebar());
      expect(useUIStore.getState().sidebarOpen).toBe(true);
    });

    it('should set sidebar open directly', () => {
      act(() => useUIStore.getState().setSidebarOpen(false));
      expect(useUIStore.getState().sidebarOpen).toBe(false);
    });

    it('should set sidebar collapsed', () => {
      act(() => useUIStore.getState().setSidebarCollapsed(true));
      expect(useUIStore.getState().sidebarCollapsed).toBe(true);
    });
  });

  describe('command palette', () => {
    it('should toggle command palette', () => {
      act(() => useUIStore.getState().toggleCommandPalette());
      expect(useUIStore.getState().commandPaletteOpen).toBe(true);
      act(() => useUIStore.getState().toggleCommandPalette());
      expect(useUIStore.getState().commandPaletteOpen).toBe(false);
    });

    it('should set command palette open', () => {
      act(() => useUIStore.getState().setCommandPaletteOpen(true));
      expect(useUIStore.getState().commandPaletteOpen).toBe(true);
    });
  });

  describe('search', () => {
    it('should set global search open', () => {
      act(() => useUIStore.getState().setGlobalSearchOpen(true));
      expect(useUIStore.getState().globalSearchOpen).toBe(true);
    });

    it('should clear query when closing search', () => {
      act(() => {
        useUIStore.getState().setGlobalSearchOpen(true);
        useUIStore.getState().setGlobalSearchQuery('test');
      });
      expect(useUIStore.getState().globalSearchQuery).toBe('test');
      act(() => useUIStore.getState().setGlobalSearchOpen(false));
      expect(useUIStore.getState().globalSearchQuery).toBe('');
    });
  });

  describe('toasts', () => {
    it('should add a toast', () => {
      act(() => useUIStore.getState().addToast({ type: 'success', title: 'Done!' }));
      expect(useUIStore.getState().toasts.length).toBe(1);
      expect(useUIStore.getState().toasts[0].title).toBe('Done!');
      expect(useUIStore.getState().toasts[0].type).toBe('success');
    });

    it('should remove a toast', () => {
      let id: string;
      act(() => { id = useUIStore.getState().addToast({ type: 'info', title: 'Test' }); });
      expect(useUIStore.getState().toasts.length).toBe(1);
      act(() => useUIStore.getState().removeToast(id!));
      expect(useUIStore.getState().toasts.length).toBe(0);
    });

    it('should clear all toasts', () => {
      act(() => {
        useUIStore.getState().addToast({ type: 'info', title: 'A' });
        useUIStore.getState().addToast({ type: 'error', title: 'B' });
      });
      expect(useUIStore.getState().toasts.length).toBe(2);
      act(() => useUIStore.getState().clearToasts());
      expect(useUIStore.getState().toasts.length).toBe(0);
    });
  });

  describe('modals', () => {
    it('should open a modal', () => {
      act(() => useUIStore.getState().openModal({ component: 'TestModal' }));
      expect(useUIStore.getState().activeModals.length).toBe(1);
      expect(useUIStore.getState().activeModals[0].component).toBe('TestModal');
    });

    it('should close a modal', () => {
      let id: string;
      act(() => { id = useUIStore.getState().openModal({ component: 'TestModal' }); });
      act(() => useUIStore.getState().closeModal(id!));
      expect(useUIStore.getState().activeModals.length).toBe(0);
    });

    it('should close all modals', () => {
      act(() => {
        useUIStore.getState().openModal({ component: 'A' });
        useUIStore.getState().openModal({ component: 'B' });
      });
      act(() => useUIStore.getState().closeAllModals());
      expect(useUIStore.getState().activeModals.length).toBe(0);
    });
  });

  describe('loading', () => {
    it('should set global loading', () => {
      act(() => useUIStore.getState().setGlobalLoading(true, 'Loading...'));
      expect(useUIStore.getState().globalLoading).toBe(true);
      expect(useUIStore.getState().loadingMessage).toBe('Loading...');
    });

    it('should clear loading message when stopping', () => {
      act(() => useUIStore.getState().setGlobalLoading(true, 'Working'));
      act(() => useUIStore.getState().setGlobalLoading(false));
      expect(useUIStore.getState().globalLoading).toBe(false);
      expect(useUIStore.getState().loadingMessage).toBeNull();
    });
  });

  describe('right panel', () => {
    it('should open right panel with content', () => {
      act(() => useUIStore.getState().setRightPanel(true, 'details'));
      expect(useUIStore.getState().rightPanelOpen).toBe(true);
      expect(useUIStore.getState().rightPanelContent).toBe('details');
    });

    it('should clear content when closing', () => {
      act(() => useUIStore.getState().setRightPanel(true, 'details'));
      act(() => useUIStore.getState().setRightPanel(false));
      expect(useUIStore.getState().rightPanelOpen).toBe(false);
      expect(useUIStore.getState().rightPanelContent).toBeNull();
    });
  });

  describe('page state', () => {
    it('should set page title', () => {
      act(() => useUIStore.getState().setPageTitle('Dashboard'));
      expect(useUIStore.getState().pageTitle).toBe('Dashboard');
    });

    it('should set breadcrumbs', () => {
      const crumbs = [{ label: 'Home', path: '/' }, { label: 'Dashboard' }];
      act(() => useUIStore.getState().setBreadcrumbs(crumbs));
      expect(useUIStore.getState().breadcrumbs).toEqual(crumbs);
    });
  });
});

// ============================================================================
// notificationStore
// ============================================================================
import { useNotificationStore } from '../notificationStore';

describe('notificationStore', () => {
  beforeEach(() => {
    act(() => useNotificationStore.getState().clearAll());
  });

  it('should initialize with empty notifications', () => {
    expect(useNotificationStore.getState().notifications).toEqual([]);
    expect(useNotificationStore.getState().unreadCount).toBe(0);
  });

  it('should add a notification', () => {
    act(() => {
      useNotificationStore.getState().addNotification({
        type: 'alert',
        priority: 'high',
        title: 'Test Alert',
        message: 'Something happened',
      });
    });
    const state = useNotificationStore.getState();
    expect(state.notifications.length).toBe(1);
    expect(state.notifications[0].title).toBe('Test Alert');
    expect(state.notifications[0].read).toBe(false);
    expect(state.unreadCount).toBe(1);
  });

  it('should mark notification as read', () => {
    act(() => {
      useNotificationStore.getState().addNotification({
        type: 'system',
        priority: 'low',
        title: 'Info',
        message: 'msg',
      });
    });
    const id = useNotificationStore.getState().notifications[0].id;
    act(() => useNotificationStore.getState().markAsRead(id));
    expect(useNotificationStore.getState().notifications[0].read).toBe(true);
    expect(useNotificationStore.getState().unreadCount).toBe(0);
  });

  it('should mark all as read', () => {
    act(() => {
      useNotificationStore.getState().addNotification({ type: 'alert', priority: 'low', title: 'A', message: '' });
      useNotificationStore.getState().addNotification({ type: 'alert', priority: 'low', title: 'B', message: '' });
    });
    expect(useNotificationStore.getState().unreadCount).toBe(2);
    act(() => useNotificationStore.getState().markAllAsRead());
    expect(useNotificationStore.getState().unreadCount).toBe(0);
    expect(useNotificationStore.getState().notifications.every((n: any) => n.read)).toBe(true);
  });

  it('should delete a notification', () => {
    act(() => {
      useNotificationStore.getState().addNotification({ type: 'alert', priority: 'low', title: 'Delete me', message: '' });
    });
    const id = useNotificationStore.getState().notifications[0].id;
    act(() => useNotificationStore.getState().deleteNotification(id));
    expect(useNotificationStore.getState().notifications.length).toBe(0);
  });

  it('should archive a notification', () => {
    act(() => {
      useNotificationStore.getState().addNotification({ type: 'system', priority: 'low', title: 'Archive me', message: '' });
    });
    const id = useNotificationStore.getState().notifications[0].id;
    act(() => useNotificationStore.getState().archiveNotification(id));
    expect(useNotificationStore.getState().notifications[0].archived).toBe(true);
  });

  it('should clear all notifications', () => {
    act(() => {
      useNotificationStore.getState().addNotification({ type: 'alert', priority: 'low', title: 'A', message: '' });
      useNotificationStore.getState().addNotification({ type: 'alert', priority: 'low', title: 'B', message: '' });
    });
    act(() => useNotificationStore.getState().clearAll());
    expect(useNotificationStore.getState().notifications.length).toBe(0);
    expect(useNotificationStore.getState().unreadCount).toBe(0);
  });

  it('should mute notification type', () => {
    act(() => useNotificationStore.getState().muteType('alert'));
    expect(useNotificationStore.getState().preferences.mutedTypes).toContain('alert');
  });

  it('should unmute notification type', () => {
    act(() => useNotificationStore.getState().muteType('alert'));
    act(() => useNotificationStore.getState().unmuteType('alert'));
    expect(useNotificationStore.getState().preferences.mutedTypes).not.toContain('alert');
  });

  it('should not add muted notification types', () => {
    act(() => useNotificationStore.getState().muteType('alert'));
    act(() => {
      useNotificationStore.getState().addNotification({ type: 'alert', priority: 'low', title: 'Muted', message: '' });
    });
    expect(useNotificationStore.getState().notifications.length).toBe(0);
  });

  it('should set connection status', () => {
    act(() => useNotificationStore.getState().setConnected(true));
    expect(useNotificationStore.getState().isConnected).toBe(true);
  });

  it('should set error state', () => {
    act(() => useNotificationStore.getState().setError('Connection failed'));
    expect(useNotificationStore.getState().error).toBe('Connection failed');
  });
});

// ============================================================================
// councilStore
// ============================================================================
import { useCouncilStore } from '../councilStore';

describe('councilStore', () => {
  it('should export a store', () => {
    expect(useCouncilStore).toBeDefined();
    expect(typeof useCouncilStore.getState).toBe('function');
  });

  it('should have agents array', () => {
    expect(Array.isArray(useCouncilStore.getState().agents)).toBe(true);
  });

  it('should have deliberation state', () => {
    const state = useCouncilStore.getState();
    expect(state).toHaveProperty('activeDeliberation');
    expect(state).toHaveProperty('isLoading');
  });
});

// ============================================================================
// dataSourceStore
// ============================================================================
import { useDataSourceStore } from '../dataSourceStore';

describe('dataSourceStore', () => {
  it('should export a store', () => {
    expect(useDataSourceStore).toBeDefined();
    expect(typeof useDataSourceStore.getState).toBe('function');
  });

  it('should have dataSources array', () => {
    expect(Array.isArray(useDataSourceStore.getState().dataSources)).toBe(true);
  });

  it('should have loading state', () => {
    expect(typeof useDataSourceStore.getState().isLoading).toBe('boolean');
  });
});
