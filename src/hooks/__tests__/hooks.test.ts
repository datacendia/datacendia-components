/**
 * React Hooks Tests
 * Tests for useDebounce, useToggle, useLocalStorage, useClipboard,
 * useMediaQuery, useDocumentTitle, useInterval, usePagination
 * @module hooks/__tests__/hooks.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// ============================================================================
// useToggle
// ============================================================================
import { useToggle } from '../useToggle';

describe('useToggle', () => {
  it('should initialize with false by default', () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current[0]).toBe(false);
  });

  it('should initialize with provided value', () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current[0]).toBe(true);
  });

  it('should toggle value', () => {
    const { result } = renderHook(() => useToggle(false));
    act(() => result.current[1]());
    expect(result.current[0]).toBe(true);
    act(() => result.current[1]());
    expect(result.current[0]).toBe(false);
  });

  it('should set value directly', () => {
    const { result } = renderHook(() => useToggle(false));
    act(() => result.current[2](true));
    expect(result.current[0]).toBe(true);
    act(() => result.current[2](false));
    expect(result.current[0]).toBe(false);
  });
});

// ============================================================================
// useDebounce
// ============================================================================
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300));
    expect(result.current).toBe('hello');
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'hello' } }
    );
    rerender({ value: 'world' });
    expect(result.current).toBe('hello');
    act(() => { vi.advanceTimersByTime(300); });
    expect(result.current).toBe('world');
  });

  it('should reset timer on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'a' } }
    );
    rerender({ value: 'b' });
    act(() => { vi.advanceTimersByTime(100); });
    rerender({ value: 'c' });
    act(() => { vi.advanceTimersByTime(100); });
    expect(result.current).toBe('a');
    act(() => { vi.advanceTimersByTime(300); });
    expect(result.current).toBe('c');
  });

  it('should use default delay of 300ms', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'initial' } }
    );
    rerender({ value: 'updated' });
    act(() => { vi.advanceTimersByTime(299); });
    expect(result.current).toBe('initial');
    act(() => { vi.advanceTimersByTime(1); });
    expect(result.current).toBe('updated');
  });
});

// ============================================================================
// useLocalStorage
// ============================================================================
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => { localStorage.clear(); });

  it('should return initial value when key not in storage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('should read existing value from storage', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'));
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('stored-value');
  });

  it('should update value and persist to storage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    act(() => result.current[1]('new-value'));
    expect(result.current[0]).toBe('new-value');
    expect(JSON.parse(localStorage.getItem('test-key')!)).toBe('new-value');
  });

  it('should accept updater function', () => {
    const { result } = renderHook(() => useLocalStorage('counter', 0));
    act(() => result.current[1]((prev: number) => prev + 1));
    expect(result.current[0]).toBe(1);
  });

  it('should remove value from storage', () => {
    localStorage.setItem('test-key', JSON.stringify('value'));
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    act(() => result.current[2]());
    expect(result.current[0]).toBe('default');
    expect(localStorage.getItem('test-key')).toBeNull();
  });

  it('should handle complex objects', () => {
    const obj = { name: 'test', nested: { a: 1 } };
    const { result } = renderHook(() => useLocalStorage('obj-key', obj));
    expect(result.current[0]).toEqual(obj);
  });
});

// ============================================================================
// useDocumentTitle
// ============================================================================
import { useDocumentTitle } from '../useDocumentTitle';

describe('useDocumentTitle', () => {
  const originalTitle = document.title;

  afterEach(() => { document.title = originalTitle; });

  it('should set document title with Datacendia suffix', () => {
    renderHook(() => useDocumentTitle('Dashboard'));
    expect(document.title).toBe('Dashboard | Datacendia');
  });

  it('should update title on change', () => {
    const { rerender } = renderHook(
      ({ title }) => useDocumentTitle(title),
      { initialProps: { title: 'Page A' } }
    );
    expect(document.title).toBe('Page A | Datacendia');
    rerender({ title: 'Page B' });
    expect(document.title).toBe('Page B | Datacendia');
  });

  it('should restore title on unmount when restoreOnUnmount=true', () => {
    document.title = 'Original';
    const { unmount } = renderHook(() => useDocumentTitle('Temp', true));
    expect(document.title).toBe('Temp | Datacendia');
    unmount();
    expect(document.title).toBe('Original');
  });
});

// ============================================================================
// useInterval
// ============================================================================
import { useInterval } from '../useInterval';

describe('useInterval', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('should call callback at interval', () => {
    const callback = vi.fn();
    renderHook(() => useInterval(callback, 1000));
    expect(callback).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(1000); });
    expect(callback).toHaveBeenCalledTimes(1);
    act(() => { vi.advanceTimersByTime(2000); });
    expect(callback).toHaveBeenCalledTimes(3);
  });

  it('should not run when delay is null', () => {
    const callback = vi.fn();
    renderHook(() => useInterval(callback, null));
    act(() => { vi.advanceTimersByTime(5000); });
    expect(callback).not.toHaveBeenCalled();
  });

  it('should clean up on unmount', () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useInterval(callback, 1000));
    act(() => { vi.advanceTimersByTime(1000); });
    expect(callback).toHaveBeenCalledTimes(1);
    unmount();
    act(() => { vi.advanceTimersByTime(5000); });
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

// ============================================================================
// usePagination
// ============================================================================
import { usePagination } from '../usePagination';

describe('usePagination', () => {
  it('should initialize with defaults', () => {
    const { result } = renderHook(() => usePagination());
    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(20);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.offset).toBe(0);
  });

  it('should calculate totalPages correctly', () => {
    const { result } = renderHook(() => usePagination({ totalItems: 100, initialPageSize: 10 }));
    expect(result.current.totalPages).toBe(10);
  });

  it('should navigate to next page', () => {
    const { result } = renderHook(() => usePagination({ totalItems: 100, initialPageSize: 10 }));
    act(() => result.current.nextPage());
    expect(result.current.page).toBe(2);
    expect(result.current.offset).toBe(10);
  });

  it('should navigate to previous page', () => {
    const { result } = renderHook(() => usePagination({ totalItems: 100, initialPageSize: 10, initialPage: 3 }));
    act(() => result.current.prevPage());
    expect(result.current.page).toBe(2);
  });

  it('should not go below page 1', () => {
    const { result } = renderHook(() => usePagination({ totalItems: 100 }));
    act(() => result.current.prevPage());
    expect(result.current.page).toBe(1);
    expect(result.current.canPrev).toBe(false);
  });

  it('should not exceed totalPages', () => {
    const { result } = renderHook(() => usePagination({ totalItems: 30, initialPageSize: 10, initialPage: 3 }));
    act(() => result.current.nextPage());
    expect(result.current.page).toBe(3);
    expect(result.current.canNext).toBe(false);
  });

  it('should go to first page', () => {
    const { result } = renderHook(() => usePagination({ totalItems: 100, initialPageSize: 10, initialPage: 5 }));
    act(() => result.current.firstPage());
    expect(result.current.page).toBe(1);
  });

  it('should go to last page', () => {
    const { result } = renderHook(() => usePagination({ totalItems: 100, initialPageSize: 10 }));
    act(() => result.current.lastPage());
    expect(result.current.page).toBe(10);
  });

  it('should reset to page 1 when page size changes', () => {
    const { result } = renderHook(() => usePagination({ totalItems: 100, initialPageSize: 10, initialPage: 5 }));
    act(() => result.current.setPageSize(25));
    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(25);
  });

  it('should report canNext and canPrev correctly', () => {
    const { result } = renderHook(() => usePagination({ totalItems: 30, initialPageSize: 10 }));
    expect(result.current.canNext).toBe(true);
    expect(result.current.canPrev).toBe(false);
    act(() => result.current.setPage(2));
    expect(result.current.canNext).toBe(true);
    expect(result.current.canPrev).toBe(true);
    act(() => result.current.setPage(3));
    expect(result.current.canNext).toBe(false);
    expect(result.current.canPrev).toBe(true);
  });
});

// ============================================================================
// useClipboard
// ============================================================================
import { useClipboard } from '../useClipboard';

describe('useClipboard', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  it('should initialize with copied=false', () => {
    const { result } = renderHook(() => useClipboard());
    expect(result.current.copied).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should copy text to clipboard', async () => {
    const { result } = renderHook(() => useClipboard());
    await act(async () => { await result.current.copy('hello'); });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hello');
    expect(result.current.copied).toBe(true);
  });

  it('should handle clipboard error', async () => {
    (navigator.clipboard.writeText as any).mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() => useClipboard());
    await act(async () => { await result.current.copy('hello'); });
    expect(result.current.copied).toBe(false);
    expect(result.current.error).toBe('Failed to copy to clipboard');
  });
});

// ============================================================================
// useMediaQuery
// ============================================================================
import { useMediaQuery } from '../useMediaQuery';

describe('useMediaQuery', () => {
  it('should return boolean for media query', () => {
    // Mock matchMedia for jsdom
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));
    expect(typeof result.current).toBe('boolean');
    expect(result.current).toBe(false);
  });
});
