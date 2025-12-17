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
import React, { useEffect, useRef } from 'react';
import { cn } from '../../../lib/utils';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = stryMutAct_9fa48("6153") ? false : (stryCov_9fa48("6153"), true)
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (stryMutAct_9fa48("6159") ? e.key !== 'Escape' : stryMutAct_9fa48("6158") ? false : stryMutAct_9fa48("6157") ? true : (stryCov_9fa48("6157", "6158", "6159"), e.key === 'Escape')) onClose();
    };
    if (stryMutAct_9fa48("6162") ? false : stryMutAct_9fa48("6161") ? true : (stryCov_9fa48("6161", "6162"), isOpen)) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, stryMutAct_9fa48("6169") ? [] : (stryCov_9fa48("6169"), [isOpen, onClose]));
  if (stryMutAct_9fa48("6172") ? false : stryMutAct_9fa48("6171") ? true : stryMutAct_9fa48("6170") ? isOpen : (stryCov_9fa48("6170", "6171", "6172"), !isOpen)) return null;
  const sizeClasses = stryMutAct_9fa48("6173") ? {} : (stryCov_9fa48("6173"), {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  });
  return <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 animate-in fade-in duration-200" onClick={onClose} />
      <div ref={modalRef} className={cn('relative bg-white rounded-xl shadow-2xl w-full animate-in zoom-in-95 duration-200', sizeClasses[size])}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
              {stryMutAct_9fa48("6181") ? description || <p className="text-neutral-500 text-sm mt-1">{description}</p> : stryMutAct_9fa48("6180") ? false : stryMutAct_9fa48("6179") ? true : (stryCov_9fa48("6179", "6180", "6181"), description && <p className="text-neutral-500 text-sm mt-1">{description}</p>)}
            </div>
            {stryMutAct_9fa48("6184") ? showCloseButton || <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-600 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button> : stryMutAct_9fa48("6183") ? false : stryMutAct_9fa48("6182") ? true : (stryCov_9fa48("6182", "6183", "6184"), showCloseButton && <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-600 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>)}
          </div>
          {children}
        </div>
      </div>
    </div>;
};

// Confirmation Modal
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = stryMutAct_9fa48("6188") ? true : (stryCov_9fa48("6188"), false)
}) => {
  const variants = stryMutAct_9fa48("6190") ? {} : (stryCov_9fa48("6190"), {
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white',
    info: 'bg-blue-600 hover:bg-blue-700 text-white'
  });
  const icons = stryMutAct_9fa48("6194") ? {} : (stryCov_9fa48("6194"), {
    danger: '⚠️',
    warning: '⚡',
    info: 'ℹ️'
  });
  return <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="text-center mb-6">
        <div className="text-4xl mb-4">{icons[variant]}</div>
        <p className="text-neutral-600">{message}</p>
      </div>
      <div className="flex gap-3">
        <button onClick={onClose} disabled={isLoading} className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50">
          {cancelText}
        </button>
        <button onClick={onConfirm} disabled={isLoading} className={cn('flex-1 px-4 py-2 rounded-lg transition-colors disabled:opacity-50', variants[variant])}>
          {isLoading ? 'Processing...' : confirmText}
        </button>
      </div>
    </Modal>;
};

// Form Modal wrapper
interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  submitText?: string;
  cancelText?: string;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  children,
  submitText = 'Submit',
  cancelText = 'Cancel',
  isLoading = stryMutAct_9fa48("6202") ? true : (stryCov_9fa48("6202"), false),
  size = 'md'
}) => {
  return <Modal isOpen={isOpen} onClose={onClose} title={title} description={description} size={size}>
      <form onSubmit={onSubmit}>
        <div className="space-y-4 mb-6">{children}</div>
        <div className="flex gap-3">
          <button type="button" onClick={onClose} disabled={isLoading} className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50">
            {cancelText}
          </button>
          <button type="submit" disabled={isLoading} className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50">
            {isLoading ? 'Saving...' : submitText}
          </button>
        </div>
      </form>
    </Modal>;
};
export default Modal;