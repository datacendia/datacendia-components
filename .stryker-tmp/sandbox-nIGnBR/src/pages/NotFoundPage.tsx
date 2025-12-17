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
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, MessageCircle } from 'lucide-react';
export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* 404 Display */}
        <div className="mb-8">
          <h1 className="text-[150px] md:text-[200px] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-amber-200 to-blue-400">
            404
          </h1>
        </div>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Page Not Found
        </h2>
        
        <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button onClick={stryMutAct_9fa48("51094") ? () => undefined : (stryCov_9fa48("51094"), () => navigate(stryMutAct_9fa48("51095") ? +1 : (stryCov_9fa48("51095"), -1)))} className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          
          <Link to="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition-colors">
            <Home className="w-4 h-4" />
            Home Page
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="border-t border-slate-800 pt-8">
          <p className="text-slate-500 text-sm mb-4">You might be looking for:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/product" className="text-slate-400 hover:text-white text-sm transition-colors">
              Product
            </Link>
            <Link to="/pricing" className="text-slate-400 hover:text-white text-sm transition-colors">
              Pricing
            </Link>
            <Link to="/about" className="text-slate-400 hover:text-white text-sm transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-slate-400 hover:text-white text-sm transition-colors">
              Contact
            </Link>
            <Link to="/cortex" className="text-slate-400 hover:text-white text-sm transition-colors">
              The Cortex
            </Link>
          </div>
        </div>

        {/* Support */}
        <div className="mt-12 flex items-center justify-center gap-2 text-slate-600">
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm">
            Need help? <Link to="/contact" className="text-amber-500 hover:text-amber-400">Contact support</Link>
          </span>
        </div>
      </div>
    </div>;
};
export default NotFoundPage;