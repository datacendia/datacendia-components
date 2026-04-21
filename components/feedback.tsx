// =============================================================================
// DATACENDIA DESIGN SYSTEM - FEEDBACK COMPONENTS
// =============================================================================

import React, { useEffect, useRef, createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn, trapFocus, generateId } from '../lib/utils';
import type {
  AlertProps,
  ToastProps,
  ModalProps,
  DrawerProps,
  SkeletonProps,
  SpinnerProps,
  EmptyStateProps,
} from '../lib/types';

// =============================================================================
// ALERT
// =============================================================================

export const Alert: React.FC<AlertProps> = ({
  status,
  title,
  description,
  icon,
  isClosable = false,
  onClose,
  action,
}) => {
  const statusStyles = {
    critical: {
      container: 'bg-error-light border-error-main',
      icon: 'text-error-main',
      title: 'text-error-dark',
    },
    warning: {
      container: 'bg-warning-light border-warning-main',
      icon: 'text-warning-main',
      title: 'text-warning-dark',
    },
    info: {
      container: 'bg-info-light border-info-main',
      icon: 'text-info-main',
      title: 'text-info-dark',
    },
    success: {
      container: 'bg-success-light border-success-main',
      icon: 'text-success-main',
      title: 'text-success-dark',
    },
  };

  const defaultIcons = {
    critical: <XCircleIcon className="h-5 w-5" />,
    warning: <ExclamationIcon className="h-5 w-5" />,
    info: <InfoIcon className="h-5 w-5" />,
    success: <CheckCircleIcon className="h-5 w-5" />,
  };

  const styles = statusStyles[status];

  return (
    <div
      className={cn(
        'flex gap-3 p-4 rounded-lg border',
        styles.container
      )}
      role="alert"
    >
      <div className={cn('flex-shrink-0', styles.icon)}>
        {icon || defaultIcons[status]}
      </div>
      
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className={cn('text-sm font-medium', styles.title)}>{title}</h3>
        )}
        {description && (
          <p className={cn('text-sm mt-1', styles.title, 'opacity-80')}>
            {description}
          </p>
        )}
        {action && <div className="mt-3">{action}</div>}
      </div>
      
      {isClosable && (
        <button
          onClick={onClose}
          className={cn(
            'flex-shrink-0 p-1 rounded-md transition-colors',
            'hover:bg-black/5',
            styles.icon
          )}
          aria-label="Dismiss"
        >
          <XIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

// =============================================================================
// TOAST CONTEXT & PROVIDER
// =============================================================================

interface ToastContextValue {
  addToast: (toast: Omit<ToastProps, 'id' | 'onClose'>) => string;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback((toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = generateId('toast');
    setToasts((prev) => [...prev, { ...toast, id, onClose: () => removeToast(id) }]);
    
    if (toast.duration !== 0) {
      setTimeout(() => removeToast(id), toast.duration || 5000);
    }
    
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
};

// =============================================================================
// TOAST
// =============================================================================

const Toast: React.FC<ToastProps> = ({
  id: _id,
  status,
  title,
  description,
  isClosable = true,
  onClose,
}) => {
  const statusStyles = {
    critical: 'bg-error-main',
    warning: 'bg-warning-main',
    info: 'bg-info-main',
    success: 'bg-success-main',
  };

  const icons = {
    critical: <XCircleIcon className="h-5 w-5" />,
    warning: <ExclamationIcon className="h-5 w-5" />,
    info: <InfoIcon className="h-5 w-5" />,
    success: <CheckCircleIcon className="h-5 w-5" />,
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 w-80 p-4 rounded-lg shadow-lg text-white',
        'animate-in slide-in-from-right duration-300',
        statusStyles[status]
      )}
      role="alert"
    >
      <div className="flex-shrink-0">{icons[status]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{title}</p>
        {description && <p className="text-sm mt-1 opacity-90">{description}</p>}
      </div>
      {isClosable && (
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
          aria-label="Dismiss"
        >
          <XIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

const ToastContainer: React.FC<{ toasts: ToastProps[] }> = ({ toasts }) => {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>,
    document.body
  );
};

// =============================================================================
// MODAL
// =============================================================================

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  children,
  footer,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEsc) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    // Trap focus
    let cleanup: (() => void) | undefined;
    if (modalRef.current) {
      cleanup = trapFocus(modalRef.current);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      cleanup?.();
    };
  }, [isOpen, closeOnEsc, onClose]);

  if (!isOpen) return null;

  const sizeStyles = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };

  const content = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 animate-in fade-in duration-200"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className={cn(
          'relative w-full bg-white rounded-xl shadow-2xl',
          'animate-in zoom-in-95 fade-in duration-200',
          sizeStyles[size]
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
            <h2 id="modal-title" className="text-lg font-semibold text-neutral-900">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
              aria-label="Close"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        )}
        
        {/* Body */}
        <div className="px-6 py-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(content, document.body);
};

// =============================================================================
// DRAWER
// =============================================================================

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  placement = 'right',
  size = 'md',
  title,
  children,
  footer,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeStyles = {
    xs: 'w-64',
    sm: 'w-80',
    md: 'w-96',
    lg: 'w-[32rem]',
    xl: 'w-[40rem]',
    full: 'w-screen',
  };

  const placementStyles = {
    left: 'left-0 top-0 h-full animate-in slide-in-from-left duration-300',
    right: 'right-0 top-0 h-full animate-in slide-in-from-right duration-300',
    top: 'top-0 left-0 w-full animate-in slide-in-from-top duration-300',
    bottom: 'bottom-0 left-0 w-full animate-in slide-in-from-bottom duration-300',
  };

  const isHorizontal = placement === 'left' || placement === 'right';

  const content = (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Drawer */}
      <div
        ref={drawerRef}
        className={cn(
          'absolute bg-white shadow-2xl flex flex-col',
          placementStyles[placement],
          isHorizontal ? sizeStyles[size] : 'h-auto'
        )}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
              aria-label="Close"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        )}
        
        {/* Body */}
        <div className="flex-1 px-6 py-4 overflow-y-auto">{children}</div>
        
        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(content, document.body);
};

// =============================================================================
// SKELETON
// =============================================================================

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  variant = 'rect',
  animation = 'pulse',
}) => {
  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const variantStyles = {
    text: 'rounded',
    rect: 'rounded-md',
    circle: 'rounded-full',
  };

  return (
    <div
      className={cn(
        'bg-neutral-200',
        variantStyles[variant],
        animationStyles[animation]
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
      aria-hidden="true"
    />
  );
};

// Skeleton variants for common use cases
export const SkeletonText: React.FC<{ lines?: number; spacing?: number }> = ({
  lines = 3,
  spacing = 8,
}) => (
  <div className="space-y-2" style={{ gap: spacing }}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        height="0.875rem"
        width={i === lines - 1 ? '60%' : '100%'}
        variant="text"
      />
    ))}
  </div>
);

export const SkeletonAvatar: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <Skeleton width={size} height={size} variant="circle" />
);

export const SkeletonCard: React.FC = () => (
  <div className="p-4 border border-neutral-200 rounded-lg">
    <div className="flex items-center gap-3 mb-4">
      <SkeletonAvatar />
      <div className="flex-1">
        <Skeleton height="1rem" width="50%" />
        <Skeleton height="0.75rem" width="30%" className="mt-2" />
      </div>
    </div>
    <SkeletonText lines={3} />
  </div>
);

// =============================================================================
// SPINNER
// =============================================================================

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'currentColor',
  thickness = 2,
  label,
}) => {
  const sizeStyles = {
    xs: 12,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  };

  const actualSize = typeof size === 'number' ? size : sizeStyles[size];

  return (
    <div className="inline-flex flex-col items-center" role="status">
      <svg
        className="animate-spin"
        width={actualSize}
        height={actualSize}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth={thickness}
        />
        <path
          className="opacity-75"
          fill={color}
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {label && <span className="mt-2 text-sm text-neutral-500">{label}</span>}
      <span className="sr-only">{label || 'Loading...'}</span>
    </div>
  );
};

// =============================================================================
// EMPTY STATE
// =============================================================================

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="mb-4 p-4 bg-neutral-100 rounded-full text-neutral-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-neutral-900">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-neutral-500 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

// =============================================================================
// LOADING OVERLAY
// =============================================================================

interface LoadingOverlayProps {
  isLoading: boolean;
  label?: string;
  blur?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  label = 'Loading...',
  blur = true,
}) => {
  if (!isLoading) return null;

  return (
    <div
      className={cn(
        'absolute inset-0 z-10 flex items-center justify-center',
        'bg-white/80',
        blur && 'backdrop-blur-sm'
      )}
    >
      <Spinner size="lg" label={label} />
    </div>
  );
};

// =============================================================================
// CONFIRM DIALOG
// =============================================================================

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title={title}>
      {description && (
        <p className="text-sm text-neutral-600">{description}</p>
      )}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          disabled={isLoading}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-md',
            'border border-neutral-300 text-neutral-700',
            'hover:bg-neutral-50 transition-colors',
            'disabled:opacity-50'
          )}
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-md text-white',
            'transition-colors disabled:opacity-50',
            isDestructive
              ? 'bg-error-main hover:bg-error-dark'
              : 'bg-primary-600 hover:bg-primary-700'
          )}
        >
          {isLoading ? <Spinner size="sm" color="white" /> : confirmLabel}
        </button>
      </div>
    </Modal>
  );
};

// =============================================================================
// ICON PLACEHOLDERS
// =============================================================================

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ExclamationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
