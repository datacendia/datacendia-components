/**
 * Hook — usePagination
 *
 * Pagination state management hook for list views.
 */

import { useState, useCallback, useMemo } from 'react';

interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  totalItems?: number;
}

interface UsePaginationReturn {
  page: number;
  pageSize: number;
  totalPages: number;
  offset: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  canNext: boolean;
  canPrev: boolean;
}

export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
  const { initialPage = 1, initialPageSize = 20, totalItems = 0 } = options;
  const [page, setPageRaw] = useState(initialPage);
  const [pageSize, setPageSizeRaw] = useState(initialPageSize);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalItems / pageSize)), [totalItems, pageSize]);
  const offset = useMemo(() => (page - 1) * pageSize, [page, pageSize]);

  const setPage = useCallback((p: number) => setPageRaw(Math.max(1, Math.min(p, totalPages))), [totalPages]);
  const setPageSize = useCallback((size: number) => { setPageSizeRaw(size); setPageRaw(1); }, []);
  const nextPage = useCallback(() => setPage(page + 1), [page, setPage]);
  const prevPage = useCallback(() => setPage(page - 1), [page, setPage]);
  const firstPage = useCallback(() => setPage(1), [setPage]);
  const lastPage = useCallback(() => setPage(totalPages), [setPage, totalPages]);

  return {
    page, pageSize, totalPages, offset,
    setPage, setPageSize, nextPage, prevPage, firstPage, lastPage,
    canNext: page < totalPages,
    canPrev: page > 1,
  };
}

export default usePagination;
