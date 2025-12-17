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
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { logComponentError } from '../lib/errorTracking';
interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}
interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}
class ErrorBoundary extends Component<Props, State> {
  public state: State = stryMutAct_9fa48("4479") ? {} : (stryCov_9fa48("4479"), {
    hasError: stryMutAct_9fa48("4480") ? true : (stryCov_9fa48("4480"), false),
    error: null,
    errorInfo: null
  });
  public static getDerivedStateFromError(error: Error): State {
    return stryMutAct_9fa48("4482") ? {} : (stryCov_9fa48("4482"), {
      hasError: stryMutAct_9fa48("4483") ? false : (stryCov_9fa48("4483"), true),
      error,
      errorInfo: null
    });
  }
  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo);
    this.setState(stryMutAct_9fa48("4486") ? {} : (stryCov_9fa48("4486"), {
      errorInfo
    }));

    // Send to error tracking service
    logComponentError(error, stryMutAct_9fa48("4487") ? {} : (stryCov_9fa48("4487"), {
      componentStack: stryMutAct_9fa48("4490") ? errorInfo.componentStack && undefined : stryMutAct_9fa48("4489") ? false : stryMutAct_9fa48("4488") ? true : (stryCov_9fa48("4488", "4489", "4490"), errorInfo.componentStack || undefined)
    }));
  }
  private handleReload = (): void => {
    window.location.reload();
  };
  private handleReset = (): void => {
    this.setState(stryMutAct_9fa48("4493") ? {} : (stryCov_9fa48("4493"), {
      hasError: stryMutAct_9fa48("4494") ? true : (stryCov_9fa48("4494"), false),
      error: null,
      errorInfo: null
    }));
  };
  public render(): ReactNode {
    if (stryMutAct_9fa48("4497") ? false : stryMutAct_9fa48("4496") ? true : (stryCov_9fa48("4496", "4497"), this.state.hasError)) {
      if (stryMutAct_9fa48("4500") ? false : stryMutAct_9fa48("4499") ? true : (stryCov_9fa48("4499", "4500"), this.props.fallback)) {
        return this.props.fallback;
      }
      return <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">
              Something went wrong
            </h1>
            
            <p className="text-slate-400 mb-6">
              We're sorry, but something unexpected happened. Our team has been notified.
            </p>

            {stryMutAct_9fa48("4504") ? this.state.error || <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 mb-6 text-left overflow-auto max-h-40">
                <p className="text-red-400 text-sm font-mono">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && <pre className="text-slate-500 text-xs mt-2 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>}
              </div> : stryMutAct_9fa48("4503") ? false : stryMutAct_9fa48("4502") ? true : (stryCov_9fa48("4502", "4503", "4504"), this.state.error && <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 mb-6 text-left overflow-auto max-h-40">
                <p className="text-red-400 text-sm font-mono">
                  {this.state.error.toString()}
                </p>
                {stryMutAct_9fa48("4507") ? this.state.errorInfo || <pre className="text-slate-500 text-xs mt-2 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre> : stryMutAct_9fa48("4506") ? false : stryMutAct_9fa48("4505") ? true : (stryCov_9fa48("4505", "4506", "4507"), this.state.errorInfo && <pre className="text-slate-500 text-xs mt-2 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>)}
              </div>)}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={this.handleReload} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition-colors">
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
              
              <Link to="/" onClick={this.handleReset} className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors">
                <Home className="w-4 h-4" />
                Go Home
              </Link>
            </div>

            <p className="text-slate-600 text-sm mt-8">
              Error ID: {stryMutAct_9fa48("4508") ? Date.now().toString(36).toLowerCase() : (stryCov_9fa48("4508"), Date.now().toString(36).toUpperCase())}
            </p>
          </div>
        </div>;
    }
    return this.props.children;
  }
}
export default ErrorBoundary;