/**
 * Hook — useClipboard
 *
 * Copy text to clipboard with success/error feedback.
 */

import { useState, useCallback } from 'react';

interface UseClipboardReturn {
  copied: boolean;
  copy: (text: string) => Promise<void>;
  error: string | null;
}

export function useClipboard(resetDelay: number = 2000): UseClipboardReturn {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setError(null);
      setTimeout(() => setCopied(false), resetDelay);
    } catch (err) {
      setError('Failed to copy to clipboard');
      setCopied(false);
    }
  }, [resetDelay]);

  return { copied, copy, error };
}

export default useClipboard;
