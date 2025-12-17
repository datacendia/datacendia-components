// @ts-nocheck
// =============================================================================
// DATACENDIA PROTECTED ROUTE
// Enterprise-grade route protection with role-based access control
// =============================================================================
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
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Required roles - user must have at least one */
  requiredRoles?: Array<'VIEWER' | 'ANALYST' | 'ADMIN' | 'SUPER_ADMIN'>;
  /** Required permissions - user must have all */
  requiredPermissions?: string[];
  /** Redirect path when not authenticated */
  redirectTo?: string;
  /** Show loading state while checking auth */
  showLoading?: boolean;
  /** Custom fallback component when access denied */
  fallback?: React.ReactNode;
}

// =============================================================================
// LOADING COMPONENT
// =============================================================================

function AuthLoading() {
  return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 animate-pulse" />
          <Loader2 className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" />
        </div>
        <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">Verifying authentication...</p>
      </div>
    </div>;
}

// =============================================================================
// ACCESS DENIED COMPONENT
// =============================================================================

function AccessDenied({
  reason
}: {
  reason: 'role' | 'permission';
}) {
  return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
          <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Access Denied
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {(stryMutAct_9fa48("373") ? reason !== 'role' : stryMutAct_9fa48("372") ? false : stryMutAct_9fa48("371") ? true : (stryCov_9fa48("371", "372", "373"), reason === 'role')) ? "You don't have the required role to access this page." : "You don't have the required permissions to access this page."}
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>Contact your administrator if you believe this is an error.</span>
        </div>
        <button onClick={stryMutAct_9fa48("377") ? () => undefined : (stryCov_9fa48("377"), () => window.history.back())} className="mt-6 px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
          Go Back
        </button>
      </div>
    </div>;
}

// =============================================================================
// PROTECTED ROUTE COMPONENT
// =============================================================================

export function ProtectedRoute({
  children,
  requiredRoles,
  requiredPermissions,
  redirectTo = '/auth/login',
  showLoading = stryMutAct_9fa48("379") ? false : (stryCov_9fa48("379"), true),
  fallback
}: ProtectedRouteProps) {
  const {
    isAuthenticated,
    isLoading,
    isInitialized,
    user,
    hasRole,
    hasPermission
  } = useAuth();
  const location = useLocation();

  // Still loading auth state
  if (stryMutAct_9fa48("383") ? !isInitialized && isLoading : stryMutAct_9fa48("382") ? false : stryMutAct_9fa48("381") ? true : (stryCov_9fa48("381", "382", "383"), (stryMutAct_9fa48("384") ? isInitialized : (stryCov_9fa48("384"), !isInitialized)) || isLoading)) {
    if (stryMutAct_9fa48("387") ? false : stryMutAct_9fa48("386") ? true : (stryCov_9fa48("386", "387"), showLoading)) {
      return <AuthLoading />;
    }
    return null;
  }

  // Not authenticated - redirect to login
  if (stryMutAct_9fa48("391") ? !isAuthenticated && !user : stryMutAct_9fa48("390") ? false : stryMutAct_9fa48("389") ? true : (stryCov_9fa48("389", "390", "391"), (stryMutAct_9fa48("392") ? isAuthenticated : (stryCov_9fa48("392"), !isAuthenticated)) || (stryMutAct_9fa48("393") ? user : (stryCov_9fa48("393"), !user)))) {
    return <Navigate to={redirectTo} state={stryMutAct_9fa48("395") ? {} : (stryCov_9fa48("395"), {
      from: location.pathname,
      message: 'Please sign in to continue'
    })} replace />;
  }

  // Check role requirements
  if (stryMutAct_9fa48("399") ? requiredRoles || requiredRoles.length > 0 : stryMutAct_9fa48("398") ? false : stryMutAct_9fa48("397") ? true : (stryCov_9fa48("397", "398", "399"), requiredRoles && (stryMutAct_9fa48("402") ? requiredRoles.length <= 0 : stryMutAct_9fa48("401") ? requiredRoles.length >= 0 : stryMutAct_9fa48("400") ? true : (stryCov_9fa48("400", "401", "402"), requiredRoles.length > 0)))) {
    if (stryMutAct_9fa48("406") ? false : stryMutAct_9fa48("405") ? true : stryMutAct_9fa48("404") ? hasRole(requiredRoles) : (stryCov_9fa48("404", "405", "406"), !hasRole(requiredRoles))) {
      return fallback ? <>{fallback}</> : <AccessDenied reason="role" />;
    }
  }

  // Check permission requirements
  if (stryMutAct_9fa48("410") ? requiredPermissions || requiredPermissions.length > 0 : stryMutAct_9fa48("409") ? false : stryMutAct_9fa48("408") ? true : (stryCov_9fa48("408", "409", "410"), requiredPermissions && (stryMutAct_9fa48("413") ? requiredPermissions.length <= 0 : stryMutAct_9fa48("412") ? requiredPermissions.length >= 0 : stryMutAct_9fa48("411") ? true : (stryCov_9fa48("411", "412", "413"), requiredPermissions.length > 0)))) {
    const hasAllPermissions = stryMutAct_9fa48("415") ? requiredPermissions.some(p => hasPermission(p)) : (stryCov_9fa48("415"), requiredPermissions.every(stryMutAct_9fa48("416") ? () => undefined : (stryCov_9fa48("416"), p => hasPermission(p))));
    if (stryMutAct_9fa48("419") ? false : stryMutAct_9fa48("418") ? true : stryMutAct_9fa48("417") ? hasAllPermissions : (stryCov_9fa48("417", "418", "419"), !hasAllPermissions)) {
      return fallback ? <>{fallback}</> : <AccessDenied reason="permission" />;
    }
  }

  // All checks passed - render children
  return <>{children}</>;
}

// =============================================================================
// ADMIN ONLY ROUTE
// =============================================================================

export function AdminRoute({
  children
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute requiredRoles={stryMutAct_9fa48("422") ? [] : (stryCov_9fa48("422"), ['ADMIN', 'SUPER_ADMIN'])}>
      {children}
    </ProtectedRoute>;
}

// =============================================================================
// ANALYST OR HIGHER ROUTE
// =============================================================================

export function AnalystRoute({
  children
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute requiredRoles={stryMutAct_9fa48("426") ? [] : (stryCov_9fa48("426"), ['ANALYST', 'ADMIN', 'SUPER_ADMIN'])}>
      {children}
    </ProtectedRoute>;
}

// =============================================================================
// HOC FOR CLASS COMPONENTS OR LEGACY CODE
// =============================================================================

export function withAuth<P extends object>(Component: React.ComponentType<P>, options?: Omit<ProtectedRouteProps, 'children'>) {
  return function AuthenticatedComponent(props: P) {
    return <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>;
  };
}
export default ProtectedRoute;