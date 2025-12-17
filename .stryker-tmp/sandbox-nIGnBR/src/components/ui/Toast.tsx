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
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { cn } from '../../../lib/utils';
type ToastType = 'success' | 'error' | 'warning' | 'info';
interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}
interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}
const ToastContext = createContext<ToastContextValue | null>(null);
export const useToast = () => {
  const context = useContext(ToastContext);
  if (stryMutAct_9fa48("6733") ? false : stryMutAct_9fa48("6732") ? true : stryMutAct_9fa48("6731") ? context : (stryCov_9fa48("6731", "6732", "6733"), !context)) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
export const ToastProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [toasts, setToasts] = useState<Toast[]>(stryMutAct_9fa48("6737") ? ["Stryker was here"] : (stryCov_9fa48("6737"), []));
  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = stryMutAct_9fa48("6739") ? Math.random().toString(36) : (stryCov_9fa48("6739"), Math.random().toString(36).slice(2, 9));
    const newToast = stryMutAct_9fa48("6740") ? {} : (stryCov_9fa48("6740"), {
      ...toast,
      id,
      duration: stryMutAct_9fa48("6741") ? toast.duration && 4000 : (stryCov_9fa48("6741"), toast.duration ?? 4000)
    });
    setToasts(stryMutAct_9fa48("6742") ? () => undefined : (stryCov_9fa48("6742"), prev => stryMutAct_9fa48("6743") ? [] : (stryCov_9fa48("6743"), [...prev, newToast])));
    if (stryMutAct_9fa48("6747") ? newToast.duration <= 0 : stryMutAct_9fa48("6746") ? newToast.duration >= 0 : stryMutAct_9fa48("6745") ? false : stryMutAct_9fa48("6744") ? true : (stryCov_9fa48("6744", "6745", "6746", "6747"), newToast.duration > 0)) {
      setTimeout(() => {
        setToasts(stryMutAct_9fa48("6750") ? () => undefined : (stryCov_9fa48("6750"), prev => stryMutAct_9fa48("6751") ? prev : (stryCov_9fa48("6751"), prev.filter(stryMutAct_9fa48("6752") ? () => undefined : (stryCov_9fa48("6752"), t => stryMutAct_9fa48("6755") ? t.id === id : stryMutAct_9fa48("6754") ? false : stryMutAct_9fa48("6753") ? true : (stryCov_9fa48("6753", "6754", "6755"), t.id !== id))))));
      }, newToast.duration);
    }
  }, stryMutAct_9fa48("6756") ? ["Stryker was here"] : (stryCov_9fa48("6756"), []));
  const removeToast = useCallback((id: string) => {
    setToasts(stryMutAct_9fa48("6758") ? () => undefined : (stryCov_9fa48("6758"), prev => stryMutAct_9fa48("6759") ? prev : (stryCov_9fa48("6759"), prev.filter(stryMutAct_9fa48("6760") ? () => undefined : (stryCov_9fa48("6760"), t => stryMutAct_9fa48("6763") ? t.id === id : stryMutAct_9fa48("6762") ? false : stryMutAct_9fa48("6761") ? true : (stryCov_9fa48("6761", "6762", "6763"), t.id !== id))))));
  }, stryMutAct_9fa48("6764") ? ["Stryker was here"] : (stryCov_9fa48("6764"), []));
  return <ToastContext.Provider value={stryMutAct_9fa48("6765") ? {} : (stryCov_9fa48("6765"), {
    toasts,
    addToast,
    removeToast
  })}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>;
};
const ToastContainer: React.FC<{
  toasts: Toast[];
  removeToast: (id: string) => void;
}> = ({
  toasts,
  removeToast
}) => {
  if (stryMutAct_9fa48("6769") ? toasts.length !== 0 : stryMutAct_9fa48("6768") ? false : stryMutAct_9fa48("6767") ? true : (stryCov_9fa48("6767", "6768", "6769"), toasts.length === 0)) return null;
  return <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm">
      {toasts.map(stryMutAct_9fa48("6770") ? () => undefined : (stryCov_9fa48("6770"), toast => <ToastItem key={toast.id} toast={toast} onClose={stryMutAct_9fa48("6771") ? () => undefined : (stryCov_9fa48("6771"), () => removeToast(toast.id))} />))}
    </div>;
};
const ToastItem: React.FC<{
  toast: Toast;
  onClose: () => void;
}> = ({
  toast,
  onClose
}) => {
  const icons: Record<ToastType, string> = stryMutAct_9fa48("6773") ? {} : (stryCov_9fa48("6773"), {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  });
  const styles: Record<ToastType, string> = stryMutAct_9fa48("6778") ? {} : (stryCov_9fa48("6778"), {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  });
  const iconStyles: Record<ToastType, string> = stryMutAct_9fa48("6783") ? {} : (stryCov_9fa48("6783"), {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-amber-500 text-white',
    info: 'bg-blue-500 text-white'
  });
  return <div className={cn('flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-in slide-in-from-right-5 duration-300', styles[toast.type])}>
      <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0', iconStyles[toast.type])}>
        {icons[toast.type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{toast.title}</p>
        {stryMutAct_9fa48("6792") ? toast.message || <p className="text-sm opacity-90 mt-0.5">{toast.message}</p> : stryMutAct_9fa48("6791") ? false : stryMutAct_9fa48("6790") ? true : (stryCov_9fa48("6790", "6791", "6792"), toast.message && <p className="text-sm opacity-90 mt-0.5">{toast.message}</p>)}
      </div>
      <button onClick={onClose} className="text-current opacity-50 hover:opacity-100 transition-opacity">
        ✕
      </button>
    </div>;
};

// Convenience hooks
export const useSuccessToast = () => {
  const {
    addToast
  } = useToast();
  return stryMutAct_9fa48("6794") ? () => undefined : (stryCov_9fa48("6794"), (title: string, message?: string) => addToast(stryMutAct_9fa48("6795") ? {} : (stryCov_9fa48("6795"), {
    type: 'success',
    title,
    message
  })));
};
export const useErrorToast = () => {
  const {
    addToast
  } = useToast();
  return stryMutAct_9fa48("6798") ? () => undefined : (stryCov_9fa48("6798"), (title: string, message?: string) => addToast(stryMutAct_9fa48("6799") ? {} : (stryCov_9fa48("6799"), {
    type: 'error',
    title,
    message
  })));
};
export default ToastProvider;