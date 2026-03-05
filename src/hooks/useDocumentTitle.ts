/**
 * Hook — useDocumentTitle
 *
 * Sets the document title and restores it on unmount.
 */

import { useEffect, useRef } from 'react';

export function useDocumentTitle(title: string, restoreOnUnmount: boolean = true): void {
  const previousTitle = useRef(document.title);

  useEffect(() => {
    document.title = `${title} | Datacendia`;
  }, [title]);

  useEffect(() => {
    if (restoreOnUnmount) {
      const prev = previousTitle.current;
      return () => { document.title = prev; };
    }
  }, [restoreOnUnmount]);
}

export default useDocumentTitle;
