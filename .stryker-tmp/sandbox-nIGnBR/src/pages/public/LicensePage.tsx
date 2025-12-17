// @ts-nocheck
// =============================================================================
// DATACENDIA - LICENSE PAGE
// Enterprise Licensing & EULA
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
import { Link } from 'react-router-dom';

// =============================================================================
// TYPES
// =============================================================================

type LicenseType = 'enterprise' | 'commercial' | 'academic' | 'opensource';
interface LicenseOption {
  id: LicenseType;
  name: string;
  description: string;
  icon: string;
  features: string[];
  price: string;
  cta: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const licenseOptions: LicenseOption[] = stryMutAct_9fa48("54776") ? [] : (stryCov_9fa48("54776"), [stryMutAct_9fa48("54777") ? {} : (stryCov_9fa48("54777"), {
  id: 'enterprise',
  name: 'Enterprise License',
  description: 'Full-featured license for large organizations with advanced needs.',
  icon: '🏢',
  features: stryMutAct_9fa48("54782") ? [] : (stryCov_9fa48("54782"), ['Unlimited users', 'All 8 Pillars & 5 Spaces', 'Self-hosted or cloud deployment', 'Air-gapped deployment support', 'Custom AI agent development', 'Priority 24/7 support', 'SLA guarantee (99.99% uptime)', 'Dedicated success manager', 'Custom integrations', 'Audit logging & compliance', 'SSO/SAML/SCIM support', 'Multi-region deployment']),
  price: 'Custom',
  cta: 'Contact Sales'
}), stryMutAct_9fa48("54797") ? {} : (stryCov_9fa48("54797"), {
  id: 'commercial',
  name: 'Commercial License',
  description: 'Standard license for businesses of all sizes.',
  icon: '💼',
  features: stryMutAct_9fa48("54802") ? [] : (stryCov_9fa48("54802"), ['Per-seat licensing', 'Core Pillars & Spaces', 'Cloud deployment', 'Standard AI agents', 'Business hours support', 'SLA guarantee (99.9% uptime)', 'Standard integrations', 'Basic audit logging', 'SSO support']),
  price: 'From $8,000/mo',
  cta: 'Start Trial'
}), stryMutAct_9fa48("54814") ? {} : (stryCov_9fa48("54814"), {
  id: 'academic',
  name: 'Academic License',
  description: 'Discounted license for educational institutions and researchers.',
  icon: '🎓',
  features: stryMutAct_9fa48("54819") ? [] : (stryCov_9fa48("54819"), ['Up to 100 users', 'Full feature access', 'Cloud deployment', 'Community support', 'Research collaboration tools', 'Publication support', '50% discount']),
  price: 'From $2,000/mo',
  cta: 'Apply Now'
}), stryMutAct_9fa48("54829") ? {} : (stryCov_9fa48("54829"), {
  id: 'opensource',
  name: 'Open Source License',
  description: 'Community edition under AGPL-3.0 for open source projects.',
  icon: '🌐',
  features: stryMutAct_9fa48("54834") ? [] : (stryCov_9fa48("54834"), ['Core functionality', 'Self-hosted only', 'Community support', 'Must release modifications', 'No commercial restrictions removal', 'GitHub access']),
  price: 'Free',
  cta: 'View on GitHub'
})]);

// =============================================================================
// COMPONENT
// =============================================================================

export const LicensePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'licenses' | 'eula' | 'thirdparty'>('licenses');
  return <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="text-xl font-bold text-neutral-900">Datacendia</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/product" className="text-neutral-600 hover:text-neutral-900">Product</Link>
            <Link to="/pricing" className="text-neutral-600 hover:text-neutral-900">Pricing</Link>
            <Link to="/downloads" className="text-neutral-600 hover:text-neutral-900">Downloads</Link>
            <Link to="/login" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white py-12 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Licensing</h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Flexible licensing options to meet your organization's needs.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {(stryMutAct_9fa48("54845") ? [] : (stryCov_9fa48("54845"), [stryMutAct_9fa48("54846") ? {} : (stryCov_9fa48("54846"), {
            id: 'licenses',
            label: 'License Options'
          }), stryMutAct_9fa48("54849") ? {} : (stryCov_9fa48("54849"), {
            id: 'eula',
            label: 'End User License Agreement'
          }), stryMutAct_9fa48("54852") ? {} : (stryCov_9fa48("54852"), {
            id: 'thirdparty',
            label: 'Third-Party Licenses'
          })])).map(stryMutAct_9fa48("54855") ? () => undefined : (stryCov_9fa48("54855"), tab => <button key={tab.id} onClick={stryMutAct_9fa48("54856") ? () => undefined : (stryCov_9fa48("54856"), () => setActiveTab(tab.id as typeof activeTab))} className={`py-4 border-b-2 font-medium transition-colors ${(stryMutAct_9fa48("54860") ? activeTab !== tab.id : stryMutAct_9fa48("54859") ? false : stryMutAct_9fa48("54858") ? true : (stryCov_9fa48("54858", "54859", "54860"), activeTab === tab.id)) ? 'border-primary-600 text-primary-600' : 'border-transparent text-neutral-600 hover:text-neutral-900'}`}>
                {tab.label}
              </button>))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {stryMutAct_9fa48("54865") ? activeTab === 'licenses' || <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {licenseOptions.map(license => <div key={license.id} className={`bg-white rounded-xl border-2 p-6 ${license.id === 'enterprise' ? 'border-primary-500 shadow-lg' : 'border-neutral-200'}`}>
                  {license.id === 'enterprise' && <div className="mb-4">
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                        Most Popular
                      </span>
                    </div>}
                  <div className="text-4xl mb-4">{license.icon}</div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">{license.name}</h3>
                  <p className="text-sm text-neutral-600 mb-4">{license.description}</p>
                  <p className="text-2xl font-bold text-neutral-900 mb-6">{license.price}</p>
                  <ul className="space-y-2 mb-6">
                    {license.features.map(feature => <li key={feature} className="flex items-start gap-2 text-sm">
                        <span className="text-success-500 mt-0.5">✓</span>
                        <span className="text-neutral-600">{feature}</span>
                      </li>)}
                  </ul>
                  <button className={`w-full py-3 rounded-lg font-medium transition-colors ${license.id === 'enterprise' ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}>
                    {license.cta}
                  </button>
                </div>)}
            </div> : stryMutAct_9fa48("54864") ? false : stryMutAct_9fa48("54863") ? true : (stryCov_9fa48("54863", "54864", "54865"), (stryMutAct_9fa48("54867") ? activeTab !== 'licenses' : stryMutAct_9fa48("54866") ? true : (stryCov_9fa48("54866", "54867"), activeTab === 'licenses')) && <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {licenseOptions.map(stryMutAct_9fa48("54869") ? () => undefined : (stryCov_9fa48("54869"), license => <div key={license.id} className={`bg-white rounded-xl border-2 p-6 ${(stryMutAct_9fa48("54873") ? license.id !== 'enterprise' : stryMutAct_9fa48("54872") ? false : stryMutAct_9fa48("54871") ? true : (stryCov_9fa48("54871", "54872", "54873"), license.id === 'enterprise')) ? 'border-primary-500 shadow-lg' : 'border-neutral-200'}`}>
                  {stryMutAct_9fa48("54879") ? license.id === 'enterprise' || <div className="mb-4">
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                        Most Popular
                      </span>
                    </div> : stryMutAct_9fa48("54878") ? false : stryMutAct_9fa48("54877") ? true : (stryCov_9fa48("54877", "54878", "54879"), (stryMutAct_9fa48("54881") ? license.id !== 'enterprise' : stryMutAct_9fa48("54880") ? true : (stryCov_9fa48("54880", "54881"), license.id === 'enterprise')) && <div className="mb-4">
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                        Most Popular
                      </span>
                    </div>)}
                  <div className="text-4xl mb-4">{license.icon}</div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">{license.name}</h3>
                  <p className="text-sm text-neutral-600 mb-4">{license.description}</p>
                  <p className="text-2xl font-bold text-neutral-900 mb-6">{license.price}</p>
                  <ul className="space-y-2 mb-6">
                    {license.features.map(stryMutAct_9fa48("54883") ? () => undefined : (stryCov_9fa48("54883"), feature => <li key={feature} className="flex items-start gap-2 text-sm">
                        <span className="text-success-500 mt-0.5">✓</span>
                        <span className="text-neutral-600">{feature}</span>
                      </li>))}
                  </ul>
                  <button className={`w-full py-3 rounded-lg font-medium transition-colors ${(stryMutAct_9fa48("54887") ? license.id !== 'enterprise' : stryMutAct_9fa48("54886") ? false : stryMutAct_9fa48("54885") ? true : (stryCov_9fa48("54885", "54886", "54887"), license.id === 'enterprise')) ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}>
                    {license.cta}
                  </button>
                </div>))}
            </div>)}

          {stryMutAct_9fa48("54893") ? activeTab === 'eula' || <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl border border-neutral-200 p-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                  Datacendia End User License Agreement
                </h2>
                <p className="text-sm text-neutral-500 mb-8">Last updated: November 15, 2024</p>

                <div className="prose prose-neutral max-w-none space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold text-neutral-900">1. Acceptance of Terms</h3>
                    <p className="text-neutral-600">
                      By downloading, installing, or using Datacendia software ("Software"), you agree to be bound 
                      by the terms of this End User License Agreement ("Agreement"). If you do not agree to these 
                      terms, do not download, install, or use the Software.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-neutral-900">2. Grant of License</h3>
                    <p className="text-neutral-600">
                      Subject to the terms of this Agreement and payment of applicable fees, Datacendia grants you 
                      a non-exclusive, non-transferable, limited license to use the Software in accordance with 
                      your purchased license tier.
                    </p>
                    <ul className="list-disc pl-6 text-neutral-600 mt-2">
                      <li><strong>Enterprise License:</strong> Permits use by unlimited users within your organization.</li>
                      <li><strong>Commercial License:</strong> Permits use by the number of users specified in your order.</li>
                      <li><strong>Academic License:</strong> Permits use for non-commercial educational purposes only.</li>
                      <li><strong>Open Source License:</strong> Subject to AGPL-3.0 terms.</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-neutral-900">3. Restrictions</h3>
                    <p className="text-neutral-600">You may not:</p>
                    <ul className="list-disc pl-6 text-neutral-600 mt-2">
                      <li>Sublicense, sell, resell, or transfer the Software</li>
                      <li>Modify, adapt, or create derivative works (except under Open Source License)</li>
                      <li>Reverse engineer, decompile, or disassemble the Software</li>
                      <li>Remove any proprietary notices or labels</li>
                      <li>Use the Software for any unlawful purpose</li>
                      <li>Circumvent any license key or copy protection mechanisms</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-neutral-900">4. Intellectual Property</h3>
                    <p className="text-neutral-600">
                      Datacendia and its licensors retain all intellectual property rights in the Software. 
                      This Agreement does not grant you any rights to trademarks or service marks of Datacendia.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-neutral-900">5. Data Privacy</h3>
                    <p className="text-neutral-600">
                      Datacendia processes data in accordance with our Privacy Policy. For self-hosted deployments, 
                      you retain full control over your data. For cloud deployments, data is processed in accordance 
                      with our Data Processing Agreement.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-neutral-900">6. Support and Maintenance</h3>
                    <p className="text-neutral-600">
                      Support and maintenance terms vary by license tier. Enterprise and Commercial licenses 
                      include software updates and support as specified in your service agreement.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-neutral-900">7. Warranty Disclaimer</h3>
                    <p className="text-neutral-600">
                      THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
                      INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
                      PURPOSE, AND NONINFRINGEMENT.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-neutral-900">8. Limitation of Liability</h3>
                    <p className="text-neutral-600">
                      IN NO EVENT SHALL DATACENDIA BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
                      CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO THIS AGREEMENT, 
                      REGARDLESS OF WHETHER SUCH DAMAGES ARE BASED ON WARRANTY, CONTRACT, TORT, STRICT 
                      LIABILITY, OR ANY OTHER THEORY.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-neutral-900">9. Termination</h3>
                    <p className="text-neutral-600">
                      This Agreement is effective until terminated. Your license rights terminate automatically 
                      if you fail to comply with any term of this Agreement. Upon termination, you must destroy 
                      all copies of the Software.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-neutral-900">10. Governing Law</h3>
                    <p className="text-neutral-600">
                      This Agreement shall be governed by the laws of the State of Delaware, United States, 
                      without regard to its conflict of laws provisions.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-neutral-900">11. Export Compliance</h3>
                    <p className="text-neutral-600">
                      You agree to comply with all applicable export control laws and regulations. The Software 
                      may not be exported to countries subject to U.S. sanctions or to individuals on restricted 
                      party lists.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-neutral-900">12. Contact Information</h3>
                    <p className="text-neutral-600">
                      For questions about this Agreement, please contact:<br />
                      Datacendia Legal<br />
                      Email: legal@datacendia.com<br />
                      Address: 100 Enterprise Way, Suite 500, San Francisco, CA 94105
                    </p>
                  </section>
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-200">
                  <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    Download PDF Version
                  </button>
                </div>
              </div>
            </div> : stryMutAct_9fa48("54892") ? false : stryMutAct_9fa48("54891") ? true : (stryCov_9fa48("54891", "54892", "54893"), (stryMutAct_9fa48("54895") ? activeTab !== 'eula' : stryMutAct_9fa48("54894") ? true : (stryCov_9fa48("54894", "54895"), activeTab === 'eula')) && <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl border border-neutral-200 p-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                  Datacendia End User License Agreement
                </h2>
                <p className="text-sm text-neutral-500 mb-8">Last updated: November 15, 2024</p>

                <div className="prose prose-neutral max-w-none space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold text-neutral-900">1. Acceptance of Terms</h3>
                    <p className="text-neutral-600">
                      By downloading, installing, or using Datacendia software ("Software"), you agree to be bound 
                      by the terms of this End User License Agreement ("Agreement"). If you do not agree to these 
                      terms, do not download, install, or use the Software.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-neutral-900">2. Grant of License</h3>
                    <p className="text-neutral-600">
                      Subject to the terms of this Agreement and payment of applicable fees, Datacendia grants you 
                      a non-exclusive, non-transferable, limited license to use the Software in accordance with 
                      your purchased license tier.
                    </p>
                    <ul className="list-disc pl-6 text-neutral-600 mt-2">
                      <li><strong>Enterprise License:</strong> Permits use by unlimited users within your organization.</li>
                      <li><strong>Commercial License:</strong> Permits use by the number of users specified in your order.</li>
                      <li><strong>Academic License:</strong> Permits use for non-commercial educational purposes only.</li>
                      <li><strong>Open Source License:</strong> Subject to AGPL-3.0 terms.</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-neutral-900">3. Restrictions</h3>
                    <p className="text-neutral-600">You may not:</p>
                    <ul className="list-disc pl-6 text-neutral-600 mt-2">
                      <li>Sublicense, sell, resell, or transfer the Software</li>
                      <li>Modify, adapt, or create derivative works (except under Open Source License)</li>
                      <li>Reverse engineer, decompile, or disassemble the Software</li>
                      <li>Remove any proprietary notices or labels</li>
                      <li>Use the Software for any unlawful purpose</li>
                      <li>Circumvent any license key or copy protection mechanisms</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-neutral-900">4. Intellectual Property</h3>
                    <p className="text-neutral-600">
                      Datacendia and its licensors retain all intellectual property rights in the Software. 
                      This Agreement does not grant you any rights to trademarks or service marks of Datacendia.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-neutral-900">5. Data Privacy</h3>
                    <p className="text-neutral-600">
                      Datacendia processes data in accordance with our Privacy Policy. For self-hosted deployments, 
                      you retain full control over your data. For cloud deployments, data is processed in accordance 
                      with our Data Processing Agreement.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-neutral-900">6. Support and Maintenance</h3>
                    <p className="text-neutral-600">
                      Support and maintenance terms vary by license tier. Enterprise and Commercial licenses 
                      include software updates and support as specified in your service agreement.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-neutral-900">7. Warranty Disclaimer</h3>
                    <p className="text-neutral-600">
                      THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
                      INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
                      PURPOSE, AND NONINFRINGEMENT.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-neutral-900">8. Limitation of Liability</h3>
                    <p className="text-neutral-600">
                      IN NO EVENT SHALL DATACENDIA BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
                      CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO THIS AGREEMENT, 
                      REGARDLESS OF WHETHER SUCH DAMAGES ARE BASED ON WARRANTY, CONTRACT, TORT, STRICT 
                      LIABILITY, OR ANY OTHER THEORY.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-neutral-900">9. Termination</h3>
                    <p className="text-neutral-600">
                      This Agreement is effective until terminated. Your license rights terminate automatically 
                      if you fail to comply with any term of this Agreement. Upon termination, you must destroy 
                      all copies of the Software.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-neutral-900">10. Governing Law</h3>
                    <p className="text-neutral-600">
                      This Agreement shall be governed by the laws of the State of Delaware, United States, 
                      without regard to its conflict of laws provisions.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-neutral-900">11. Export Compliance</h3>
                    <p className="text-neutral-600">
                      You agree to comply with all applicable export control laws and regulations. The Software 
                      may not be exported to countries subject to U.S. sanctions or to individuals on restricted 
                      party lists.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-neutral-900">12. Contact Information</h3>
                    <p className="text-neutral-600">
                      For questions about this Agreement, please contact:<br />
                      Datacendia Legal<br />
                      Email: legal@datacendia.com<br />
                      Address: 100 Enterprise Way, Suite 500, San Francisco, CA 94105
                    </p>
                  </section>
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-200">
                  <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    Download PDF Version
                  </button>
                </div>
              </div>
            </div>)}

          {stryMutAct_9fa48("54899") ? activeTab === 'thirdparty' || <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl border border-neutral-200 p-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                  Third-Party Software Licenses
                </h2>
                <p className="text-neutral-600 mb-8">
                  Datacendia incorporates the following open source components. We are grateful to 
                  the open source community for their contributions.
                </p>

                <div className="space-y-6">
                  {[{
                name: 'React',
                version: '18.2.0',
                license: 'MIT',
                url: 'https://react.dev'
              }, {
                name: 'TypeScript',
                version: '5.3.0',
                license: 'Apache-2.0',
                url: 'https://typescriptlang.org'
              }, {
                name: 'Tailwind CSS',
                version: '3.4.0',
                license: 'MIT',
                url: 'https://tailwindcss.com'
              }, {
                name: 'Express.js',
                version: '4.18.0',
                license: 'MIT',
                url: 'https://expressjs.com'
              }, {
                name: 'Prisma',
                version: '5.7.0',
                license: 'Apache-2.0',
                url: 'https://prisma.io'
              }, {
                name: 'PostgreSQL',
                version: '16',
                license: 'PostgreSQL License',
                url: 'https://postgresql.org'
              }, {
                name: 'Redis',
                version: '7.2',
                license: 'BSD-3-Clause',
                url: 'https://redis.io'
              }, {
                name: 'Neo4j',
                version: '5.x',
                license: 'GPL-3.0',
                url: 'https://neo4j.com'
              }, {
                name: 'Socket.IO',
                version: '4.6.0',
                license: 'MIT',
                url: 'https://socket.io'
              }, {
                name: 'Cytoscape.js',
                version: '3.26.0',
                license: 'MIT',
                url: 'https://js.cytoscape.org'
              }, {
                name: 'Chart.js',
                version: '4.4.0',
                license: 'MIT',
                url: 'https://chartjs.org'
              }, {
                name: 'Lucide Icons',
                version: '0.300.0',
                license: 'ISC',
                url: 'https://lucide.dev'
              }, {
                name: 'date-fns',
                version: '3.0.0',
                license: 'MIT',
                url: 'https://date-fns.org'
              }, {
                name: 'zod',
                version: '3.22.0',
                license: 'MIT',
                url: 'https://zod.dev'
              }, {
                name: 'jsonwebtoken',
                version: '9.0.0',
                license: 'MIT',
                url: 'https://github.com/auth0/node-jsonwebtoken'
              }, {
                name: 'bcrypt',
                version: '5.1.0',
                license: 'MIT',
                url: 'https://github.com/kelektiv/node.bcrypt.js'
              }].map(lib => <div key={lib.name} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-neutral-900">{lib.name}</h4>
                        <p className="text-sm text-neutral-500">Version {lib.version}</p>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-1 bg-neutral-200 text-neutral-700 text-xs font-medium rounded">
                          {lib.license}
                        </span>
                        <a href={lib.url} target="_blank" rel="noopener noreferrer" className="block text-sm text-primary-600 hover:text-primary-700 mt-1">
                          View Project →
                        </a>
                      </div>
                    </div>)}
                </div>

                <div className="mt-8 p-4 bg-neutral-100 rounded-lg">
                  <p className="text-sm text-neutral-600">
                    <strong>Full License Texts:</strong> Complete license texts for all third-party 
                    software are included in the <code className="px-1 py-0.5 bg-neutral-200 rounded">LICENSES</code> directory 
                    of the Datacendia installation.
                  </p>
                </div>
              </div>
            </div> : stryMutAct_9fa48("54898") ? false : stryMutAct_9fa48("54897") ? true : (stryCov_9fa48("54897", "54898", "54899"), (stryMutAct_9fa48("54901") ? activeTab !== 'thirdparty' : stryMutAct_9fa48("54900") ? true : (stryCov_9fa48("54900", "54901"), activeTab === 'thirdparty')) && <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl border border-neutral-200 p-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                  Third-Party Software Licenses
                </h2>
                <p className="text-neutral-600 mb-8">
                  Datacendia incorporates the following open source components. We are grateful to 
                  the open source community for their contributions.
                </p>

                <div className="space-y-6">
                  {(stryMutAct_9fa48("54903") ? [] : (stryCov_9fa48("54903"), [stryMutAct_9fa48("54904") ? {} : (stryCov_9fa48("54904"), {
                name: 'React',
                version: '18.2.0',
                license: 'MIT',
                url: 'https://react.dev'
              }), stryMutAct_9fa48("54909") ? {} : (stryCov_9fa48("54909"), {
                name: 'TypeScript',
                version: '5.3.0',
                license: 'Apache-2.0',
                url: 'https://typescriptlang.org'
              }), stryMutAct_9fa48("54914") ? {} : (stryCov_9fa48("54914"), {
                name: 'Tailwind CSS',
                version: '3.4.0',
                license: 'MIT',
                url: 'https://tailwindcss.com'
              }), stryMutAct_9fa48("54919") ? {} : (stryCov_9fa48("54919"), {
                name: 'Express.js',
                version: '4.18.0',
                license: 'MIT',
                url: 'https://expressjs.com'
              }), stryMutAct_9fa48("54924") ? {} : (stryCov_9fa48("54924"), {
                name: 'Prisma',
                version: '5.7.0',
                license: 'Apache-2.0',
                url: 'https://prisma.io'
              }), stryMutAct_9fa48("54929") ? {} : (stryCov_9fa48("54929"), {
                name: 'PostgreSQL',
                version: '16',
                license: 'PostgreSQL License',
                url: 'https://postgresql.org'
              }), stryMutAct_9fa48("54934") ? {} : (stryCov_9fa48("54934"), {
                name: 'Redis',
                version: '7.2',
                license: 'BSD-3-Clause',
                url: 'https://redis.io'
              }), stryMutAct_9fa48("54939") ? {} : (stryCov_9fa48("54939"), {
                name: 'Neo4j',
                version: '5.x',
                license: 'GPL-3.0',
                url: 'https://neo4j.com'
              }), stryMutAct_9fa48("54944") ? {} : (stryCov_9fa48("54944"), {
                name: 'Socket.IO',
                version: '4.6.0',
                license: 'MIT',
                url: 'https://socket.io'
              }), stryMutAct_9fa48("54949") ? {} : (stryCov_9fa48("54949"), {
                name: 'Cytoscape.js',
                version: '3.26.0',
                license: 'MIT',
                url: 'https://js.cytoscape.org'
              }), stryMutAct_9fa48("54954") ? {} : (stryCov_9fa48("54954"), {
                name: 'Chart.js',
                version: '4.4.0',
                license: 'MIT',
                url: 'https://chartjs.org'
              }), stryMutAct_9fa48("54959") ? {} : (stryCov_9fa48("54959"), {
                name: 'Lucide Icons',
                version: '0.300.0',
                license: 'ISC',
                url: 'https://lucide.dev'
              }), stryMutAct_9fa48("54964") ? {} : (stryCov_9fa48("54964"), {
                name: 'date-fns',
                version: '3.0.0',
                license: 'MIT',
                url: 'https://date-fns.org'
              }), stryMutAct_9fa48("54969") ? {} : (stryCov_9fa48("54969"), {
                name: 'zod',
                version: '3.22.0',
                license: 'MIT',
                url: 'https://zod.dev'
              }), stryMutAct_9fa48("54974") ? {} : (stryCov_9fa48("54974"), {
                name: 'jsonwebtoken',
                version: '9.0.0',
                license: 'MIT',
                url: 'https://github.com/auth0/node-jsonwebtoken'
              }), stryMutAct_9fa48("54979") ? {} : (stryCov_9fa48("54979"), {
                name: 'bcrypt',
                version: '5.1.0',
                license: 'MIT',
                url: 'https://github.com/kelektiv/node.bcrypt.js'
              })])).map(stryMutAct_9fa48("54984") ? () => undefined : (stryCov_9fa48("54984"), lib => <div key={lib.name} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-neutral-900">{lib.name}</h4>
                        <p className="text-sm text-neutral-500">Version {lib.version}</p>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-1 bg-neutral-200 text-neutral-700 text-xs font-medium rounded">
                          {lib.license}
                        </span>
                        <a href={lib.url} target="_blank" rel="noopener noreferrer" className="block text-sm text-primary-600 hover:text-primary-700 mt-1">
                          View Project →
                        </a>
                      </div>
                    </div>))}
                </div>

                <div className="mt-8 p-4 bg-neutral-100 rounded-lg">
                  <p className="text-sm text-neutral-600">
                    <strong>Full License Texts:</strong> Complete license texts for all third-party 
                    software are included in the <code className="px-1 py-0.5 bg-neutral-200 rounded">LICENSES</code> directory 
                    of the Datacendia installation.
                  </p>
                </div>
              </div>
            </div>)}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-white border-t border-neutral-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">
            Licensing FAQ
          </h2>
          <div className="space-y-4">
            {(stryMutAct_9fa48("54985") ? [] : (stryCov_9fa48("54985"), [stryMutAct_9fa48("54986") ? {} : (stryCov_9fa48("54986"), {
            q: 'Can I try Datacendia before purchasing a license?',
            a: 'Yes! We offer a 14-day free trial of all commercial features. No credit card required.'
          }), stryMutAct_9fa48("54989") ? {} : (stryCov_9fa48("54989"), {
            q: 'What happens when my license expires?',
            a: 'Your data remains accessible, but you will not receive updates or support. You can renew at any time.'
          }), stryMutAct_9fa48("54992") ? {} : (stryCov_9fa48("54992"), {
            q: 'Can I transfer my license to another organization?',
            a: 'Licenses are non-transferable. Please contact sales if you have special requirements.'
          }), stryMutAct_9fa48("54995") ? {} : (stryCov_9fa48("54995"), {
            q: 'Do you offer volume discounts?',
            a: 'Yes, we offer volume discounts for Enterprise licenses. Contact sales for a custom quote.'
          }), stryMutAct_9fa48("54998") ? {} : (stryCov_9fa48("54998"), {
            q: 'Is there a difference between cloud and self-hosted licensing?',
            a: 'The licensing model is the same. Self-hosted deployments may have additional setup requirements.'
          }), stryMutAct_9fa48("55001") ? {} : (stryCov_9fa48("55001"), {
            q: 'How does the Open Source license work?',
            a: 'The community edition is licensed under AGPL-3.0. You can use it freely but must release any modifications.'
          })])).map(stryMutAct_9fa48("55004") ? () => undefined : (stryCov_9fa48("55004"), faq => <div key={faq.q} className="bg-neutral-50 rounded-xl p-6">
                <h3 className="font-semibold text-neutral-900 mb-2">{faq.q}</h3>
                <p className="text-neutral-600">{faq.a}</p>
              </div>))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><Link to="/product" className="hover:text-white">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link to="/downloads" className="hover:text-white">Downloads</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><Link to="/about" className="hover:text-white">About</Link></li>
                <li><Link to="/manifesto" className="hover:text-white">Manifesto</Link></li>
                <li><a href="mailto:careers@datacendia.com" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><Link to="/license" className="hover:text-white">Licensing</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="https://docs.datacendia.com" className="hover:text-white">Documentation</a></li>
                <li><a href="https://status.datacendia.com" className="hover:text-white">System Status</a></li>
                <li><a href="mailto:support@datacendia.com" className="hover:text-white">Contact Support</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-neutral-800 text-center text-neutral-400">
            <p>© {new Date().getFullYear()} Datacendia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>;
};
export default LicensePage;