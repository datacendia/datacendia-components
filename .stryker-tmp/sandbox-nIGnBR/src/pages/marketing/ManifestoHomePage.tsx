// @ts-nocheck
// =============================================================================
// DATACENDIA - THE MANIFESTO HOMEPAGE
// The page that closes $100M deals.
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
import React, { useState } from 'react';

// Request Access Modal
const RequestAccessModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({
  isOpen,
  onClose
}) => {
  const [formData, setFormData] = useState(stryMutAct_9fa48("50867") ? {} : (stryCov_9fa48("50867"), {
    name: '',
    title: '',
    organization: '',
    concern: ''
  }));
  const [isSubmitting, setIsSubmitting] = useState(stryMutAct_9fa48("50872") ? true : (stryCov_9fa48("50872"), false));
  const [isSubmitted, setIsSubmitted] = useState(stryMutAct_9fa48("50873") ? true : (stryCov_9fa48("50873"), false));
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(stryMutAct_9fa48("50875") ? false : (stryCov_9fa48("50875"), true));
    await new Promise(stryMutAct_9fa48("50876") ? () => undefined : (stryCov_9fa48("50876"), resolve => setTimeout(resolve, 1500)));
    setIsSubmitting(stryMutAct_9fa48("50877") ? true : (stryCov_9fa48("50877"), false));
    setIsSubmitted(stryMutAct_9fa48("50878") ? false : (stryCov_9fa48("50878"), true));
  };
  if (stryMutAct_9fa48("50881") ? false : stryMutAct_9fa48("50880") ? true : stryMutAct_9fa48("50879") ? isOpen : (stryCov_9fa48("50879", "50880", "50881"), !isOpen)) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
      <div className="relative w-full max-w-lg">
        <button onClick={onClose} className="absolute -top-12 right-0 text-gray-500 hover:text-white text-sm tracking-widest">
          CLOSE
        </button>
        
        {isSubmitted ? <div className="text-center py-16">
            <div className="w-16 h-16 border border-red-900/50 rounded-full flex items-center justify-center mx-auto mb-8">
              <div className="w-3 h-3 bg-red-900 rounded-full" />
            </div>
            <h3 className="text-2xl font-light text-white mb-4 tracking-wide">Access Requested</h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
              Your inquiry has been received. If approved, you will be contacted within 48 hours 
              to schedule a secure demonstration.
            </p>
          </div> : <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input type="text" placeholder="Full Name" required value={formData.name} onChange={stryMutAct_9fa48("50882") ? () => undefined : (stryCov_9fa48("50882"), e => setFormData(stryMutAct_9fa48("50883") ? {} : (stryCov_9fa48("50883"), {
            ...formData,
            name: e.target.value
          })))} className="w-full bg-transparent border-b border-gray-800 focus:border-red-900/50 text-white py-4 px-0 text-lg outline-none transition-colors placeholder:text-gray-600" />
            </div>
            <div>
              <input type="text" placeholder="Title" required value={formData.title} onChange={stryMutAct_9fa48("50884") ? () => undefined : (stryCov_9fa48("50884"), e => setFormData(stryMutAct_9fa48("50885") ? {} : (stryCov_9fa48("50885"), {
            ...formData,
            title: e.target.value
          })))} className="w-full bg-transparent border-b border-gray-800 focus:border-red-900/50 text-white py-4 px-0 text-lg outline-none transition-colors placeholder:text-gray-600" />
            </div>
            <div>
              <input type="text" placeholder="Organization" required value={formData.organization} onChange={stryMutAct_9fa48("50886") ? () => undefined : (stryCov_9fa48("50886"), e => setFormData(stryMutAct_9fa48("50887") ? {} : (stryCov_9fa48("50887"), {
            ...formData,
            organization: e.target.value
          })))} className="w-full bg-transparent border-b border-gray-800 focus:border-red-900/50 text-white py-4 px-0 text-lg outline-none transition-colors placeholder:text-gray-600" />
            </div>
            <div>
              <textarea placeholder="What keeps you up at night?" required rows={3} value={formData.concern} onChange={stryMutAct_9fa48("50888") ? () => undefined : (stryCov_9fa48("50888"), e => setFormData(stryMutAct_9fa48("50889") ? {} : (stryCov_9fa48("50889"), {
            ...formData,
            concern: e.target.value
          })))} className="w-full bg-transparent border-b border-gray-800 focus:border-red-900/50 text-white py-4 px-0 text-lg outline-none transition-colors placeholder:text-gray-600 resize-none" />
            </div>
            <div className="pt-8">
              <button type="submit" disabled={isSubmitting} className="w-full py-4 border border-red-900/50 text-white hover:bg-red-900/10 transition-colors text-sm tracking-widest disabled:opacity-50">
                {isSubmitting ? 'SUBMITTING...' : 'SUBMIT REQUEST'}
              </button>
            </div>
          </form>}
      </div>
    </div>;
};
export const ManifestoHomePage: React.FC = () => {
  const [showModal, setShowModal] = useState(stryMutAct_9fa48("50893") ? true : (stryCov_9fa48("50893"), false));
  return <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Main Content - Centered */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          
          {/* Brand */}
          <h1 className="text-3xl md:text-5xl font-extralight tracking-[0.3em] text-white mb-2">
            DATACENDIA
          </h1>
          <p className="text-xs tracking-[0.4em] text-gray-600 uppercase mb-16 md:mb-24">
            The Sovereign Intelligence Platform
          </p>

          {/* The Manifesto */}
          <div className="space-y-8 md:space-y-12 text-left md:text-center">
            
            {/* Opening */}
            <p className="text-lg md:text-xl lg:text-2xl font-light text-gray-300 leading-relaxed">
              Modern enterprises have surrendered their minds.
            </p>
            
            <p className="text-base md:text-lg text-gray-400 leading-relaxed">
              They've traded ownership for convenience, and now they're tenants in their own house.
            </p>

            {/* The Crescendo */}
            <div className="space-y-3 text-sm md:text-base text-gray-500">
              <p>They have data. They don't have understanding.</p>
              <p>They have dashboards. They don't have direction.</p>
              <p>They have AI. They don't have agency.</p>
              <p>They have predictions. They don't have power.</p>
              <p>They have tools. They don't have truth.</p>
            </div>

            {/* The Mission */}
            <p className="text-xl md:text-2xl lg:text-3xl font-light text-white leading-relaxed pt-4">
              Datacendia exists to return the mind to its rightful owner.
            </p>

            {/* The Beliefs */}
            <div className="pt-8 md:pt-12 border-t border-gray-900">
              <p className="text-xs tracking-[0.3em] text-gray-600 uppercase mb-8">We Believe</p>
              <ol className="space-y-4 text-sm md:text-base text-gray-400 text-left max-w-xl mx-auto">
                <li className="flex gap-4">
                  <span className="text-red-900 font-mono">1.</span>
                  <span>Your intelligence should live on your infrastructure, under your control.</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-red-900 font-mono">2.</span>
                  <span>Decisions made by machines should be explainable to humans.</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-red-900 font-mono">3.</span>
                  <span>Disagreement is not disloyalty — it is the immune system of good judgment.</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-red-900 font-mono">4.</span>
                  <span>The past is not a black box — it is a teacher, if you can replay it.</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-red-900 font-mono">5.</span>
                  <span>Transparency is not a feature. It is the foundation.</span>
                </li>
              </ol>
            </div>

            {/* The Destiny */}
            <p className="text-lg md:text-xl text-gray-300 pt-8 md:pt-12 italic">
              The future belongs to those who can see it —
              <br />
              <span className="text-white not-italic">and refuse to rent it from someone else.</span>
            </p>

          </div>

          {/* Single CTA */}
          <div className="pt-16 md:pt-24">
            <button onClick={stryMutAct_9fa48("50894") ? () => undefined : (stryCov_9fa48("50894"), () => setShowModal(stryMutAct_9fa48("50895") ? false : (stryCov_9fa48("50895"), true)))} className="group px-8 md:px-12 py-4 md:py-5 border border-red-900/50 hover:border-red-900 bg-black hover:bg-red-900/10 transition-all duration-500">
              <span className="text-sm md:text-base tracking-[0.2em] text-gray-300 group-hover:text-white transition-colors">
                Request the Sovereign OS Bible
              </span>
            </button>
          </div>

        </div>
      </main>

      {/* Footer - Minimal */}
      <footer className="py-8 px-6 text-center">
        <p className="text-[10px] md:text-xs text-gray-700 tracking-widest">
          For organizations that cannot afford to be tenants.
        </p>
        <div className="mt-4 text-[10px] text-gray-800">
          © {new Date().getFullYear()} Datacendia
        </div>
      </footer>

      {/* Request Access Modal */}
      <RequestAccessModal isOpen={showModal} onClose={stryMutAct_9fa48("50896") ? () => undefined : (stryCov_9fa48("50896"), () => setShowModal(stryMutAct_9fa48("50897") ? true : (stryCov_9fa48("50897"), false)))} />
    </div>;
};
export default ManifestoHomePage;