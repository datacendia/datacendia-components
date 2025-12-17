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
import { Link } from 'react-router-dom';
import { Plug, Database, Cloud, MessageSquare, BarChart, Shield, Workflow, Code } from 'lucide-react';
export const IntegrationsPage: React.FC = () => {
  const integrationCategories = stryMutAct_9fa48("54634") ? [] : (stryCov_9fa48("54634"), [stryMutAct_9fa48("54635") ? {} : (stryCov_9fa48("54635"), {
    category: 'Data Sources',
    icon: Database,
    integrations: stryMutAct_9fa48("54637") ? [] : (stryCov_9fa48("54637"), [stryMutAct_9fa48("54638") ? {} : (stryCov_9fa48("54638"), {
      name: 'PostgreSQL',
      description: 'Primary relational database',
      status: 'native'
    }), stryMutAct_9fa48("54642") ? {} : (stryCov_9fa48("54642"), {
      name: 'Snowflake',
      description: 'Cloud data warehouse',
      status: 'available'
    }), stryMutAct_9fa48("54646") ? {} : (stryCov_9fa48("54646"), {
      name: 'BigQuery',
      description: 'Google analytics warehouse',
      status: 'available'
    }), stryMutAct_9fa48("54650") ? {} : (stryCov_9fa48("54650"), {
      name: 'Databricks',
      description: 'Lakehouse platform',
      status: 'available'
    }), stryMutAct_9fa48("54654") ? {} : (stryCov_9fa48("54654"), {
      name: 'MongoDB',
      description: 'Document database',
      status: 'available'
    }), stryMutAct_9fa48("54658") ? {} : (stryCov_9fa48("54658"), {
      name: 'SQL Server',
      description: 'Microsoft database',
      status: 'available'
    })])
  }), stryMutAct_9fa48("54662") ? {} : (stryCov_9fa48("54662"), {
    category: 'Business Intelligence',
    icon: BarChart,
    integrations: stryMutAct_9fa48("54664") ? [] : (stryCov_9fa48("54664"), [stryMutAct_9fa48("54665") ? {} : (stryCov_9fa48("54665"), {
      name: 'Tableau',
      description: 'Visualization platform',
      status: 'available'
    }), stryMutAct_9fa48("54669") ? {} : (stryCov_9fa48("54669"), {
      name: 'Power BI',
      description: 'Microsoft BI',
      status: 'available'
    }), stryMutAct_9fa48("54673") ? {} : (stryCov_9fa48("54673"), {
      name: 'Looker',
      description: 'Google BI',
      status: 'available'
    }), stryMutAct_9fa48("54677") ? {} : (stryCov_9fa48("54677"), {
      name: 'Metabase',
      description: 'Open source BI',
      status: 'available'
    })])
  }), stryMutAct_9fa48("54681") ? {} : (stryCov_9fa48("54681"), {
    category: 'Communication',
    icon: MessageSquare,
    integrations: stryMutAct_9fa48("54683") ? [] : (stryCov_9fa48("54683"), [stryMutAct_9fa48("54684") ? {} : (stryCov_9fa48("54684"), {
      name: 'Slack',
      description: 'Team messaging',
      status: 'available'
    }), stryMutAct_9fa48("54688") ? {} : (stryCov_9fa48("54688"), {
      name: 'Microsoft Teams',
      description: 'Enterprise chat',
      status: 'available'
    }), stryMutAct_9fa48("54692") ? {} : (stryCov_9fa48("54692"), {
      name: 'Email (SMTP)',
      description: 'Email notifications',
      status: 'native'
    }), stryMutAct_9fa48("54696") ? {} : (stryCov_9fa48("54696"), {
      name: 'Webhooks',
      description: 'Custom integrations',
      status: 'native'
    })])
  }), stryMutAct_9fa48("54700") ? {} : (stryCov_9fa48("54700"), {
    category: 'Identity & Security',
    icon: Shield,
    integrations: stryMutAct_9fa48("54702") ? [] : (stryCov_9fa48("54702"), [stryMutAct_9fa48("54703") ? {} : (stryCov_9fa48("54703"), {
      name: 'Active Directory',
      description: 'LDAP/Kerberos auth',
      status: 'native'
    }), stryMutAct_9fa48("54707") ? {} : (stryCov_9fa48("54707"), {
      name: 'Okta',
      description: 'Identity management',
      status: 'available'
    }), stryMutAct_9fa48("54711") ? {} : (stryCov_9fa48("54711"), {
      name: 'Azure AD',
      description: 'Microsoft identity',
      status: 'available'
    }), stryMutAct_9fa48("54715") ? {} : (stryCov_9fa48("54715"), {
      name: 'Ping Identity',
      description: 'Enterprise SSO',
      status: 'available'
    }), stryMutAct_9fa48("54719") ? {} : (stryCov_9fa48("54719"), {
      name: 'Keycloak',
      description: 'Open source IdP',
      status: 'native'
    })])
  }), stryMutAct_9fa48("54723") ? {} : (stryCov_9fa48("54723"), {
    category: 'Workflow & Automation',
    icon: Workflow,
    integrations: stryMutAct_9fa48("54725") ? [] : (stryCov_9fa48("54725"), [stryMutAct_9fa48("54726") ? {} : (stryCov_9fa48("54726"), {
      name: 'Zapier',
      description: 'No-code automation',
      status: 'available'
    }), stryMutAct_9fa48("54730") ? {} : (stryCov_9fa48("54730"), {
      name: 'n8n',
      description: 'Self-hosted workflows',
      status: 'available'
    }), stryMutAct_9fa48("54734") ? {} : (stryCov_9fa48("54734"), {
      name: 'Airflow',
      description: 'Data pipelines',
      status: 'available'
    }), stryMutAct_9fa48("54738") ? {} : (stryCov_9fa48("54738"), {
      name: 'REST API',
      description: 'Custom integrations',
      status: 'native'
    })])
  }), stryMutAct_9fa48("54742") ? {} : (stryCov_9fa48("54742"), {
    category: 'Cloud Platforms',
    icon: Cloud,
    integrations: stryMutAct_9fa48("54744") ? [] : (stryCov_9fa48("54744"), [stryMutAct_9fa48("54745") ? {} : (stryCov_9fa48("54745"), {
      name: 'AWS',
      description: 'Amazon Web Services',
      status: 'available'
    }), stryMutAct_9fa48("54749") ? {} : (stryCov_9fa48("54749"), {
      name: 'Azure',
      description: 'Microsoft Cloud',
      status: 'available'
    }), stryMutAct_9fa48("54753") ? {} : (stryCov_9fa48("54753"), {
      name: 'GCP',
      description: 'Google Cloud',
      status: 'available'
    }), stryMutAct_9fa48("54757") ? {} : (stryCov_9fa48("54757"), {
      name: 'On-Premise',
      description: 'Your infrastructure',
      status: 'native'
    })])
  })]);
  return <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">D</span>
            </div>
            <span className="text-xl font-bold text-neutral-900">Datacendia</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/product" className="text-neutral-600 hover:text-neutral-900">Product</Link>
            <Link to="/docs" className="text-neutral-600 hover:text-neutral-900">Docs</Link>
            <Link to="/contact" className="text-neutral-600 hover:text-neutral-900">Contact</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-neutral-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Plug className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
          <h1 className="text-3xl font-bold mb-4">Integrations</h1>
          <p className="text-neutral-400">
            Connect Datacendia to your existing tools and infrastructure.
          </p>
        </div>
      </section>

      {/* Integration Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {integrationCategories.map(stryMutAct_9fa48("54761") ? () => undefined : (stryCov_9fa48("54761"), (category, index) => <div key={index}>
                <div className="flex items-center gap-3 mb-6">
                  <category.icon className="w-6 h-6 text-neutral-700" />
                  <h2 className="text-xl font-semibold">{category.category}</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.integrations.map(stryMutAct_9fa48("54762") ? () => undefined : (stryCov_9fa48("54762"), (integration, intIndex) => <div key={intIndex} className="bg-white rounded-lg p-4 border border-neutral-200 flex items-center gap-4">
                      <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                        <Code className="w-5 h-5 text-neutral-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{integration.name}</span>
                          <span className={`px-2 py-0.5 text-xs rounded ${(stryMutAct_9fa48("54766") ? integration.status !== 'native' : stryMutAct_9fa48("54765") ? false : stryMutAct_9fa48("54764") ? true : (stryCov_9fa48("54764", "54765", "54766"), integration.status === 'native')) ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'}`}>
                            {(stryMutAct_9fa48("54772") ? integration.status !== 'native' : stryMutAct_9fa48("54771") ? false : stryMutAct_9fa48("54770") ? true : (stryCov_9fa48("54770", "54771", "54772"), integration.status === 'native')) ? 'Native' : 'Available'}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-500">{integration.description}</p>
                      </div>
                    </div>))}
                </div>
              </div>))}
          </div>
        </div>
      </section>

      {/* Custom Integration */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Need a Custom Integration?</h2>
          <p className="text-neutral-600 mb-6">
            Our API supports custom integrations. Contact us to discuss your requirements.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/docs" className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50">
              View API Docs
            </Link>
            <Link to="/contact" className="px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800">
              Request Integration
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-100 py-8 border-t border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-neutral-500">
          <p>© {new Date().getFullYear()} Datacendia, Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>;
};
export default IntegrationsPage;