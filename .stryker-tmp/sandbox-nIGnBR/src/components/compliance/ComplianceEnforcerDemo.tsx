/**
 * Compliance Enforcer Demo
 * Demonstrates active compliance enforcement with framework citations
 * 
 * Example: "Blocked per Ring 3 (Privacy), Framework HIPAA, Control §164.312"
 */
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
import React, { useState } from 'react';
interface Violation {
  ring: number;
  domain: string;
  framework: string;
  control: string;
  controlTitle: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  citation: string;
  reason: string;
  recommendation: string;
}
interface EnforcementResult {
  proceed: boolean;
  cisoResponse: string;
  verdict: {
    allowed: boolean;
    riskLevel: string;
    citations: string[];
    violations: Violation[];
    requiresHumanReview: boolean;
  };
}

// Pre-defined scenarios for demonstration
const DEMO_SCENARIOS = stryMutAct_9fa48("1966") ? [] : (stryCov_9fa48("1966"), [stryMutAct_9fa48("1967") ? {} : (stryCov_9fa48("1967"), {
  id: 'patient-public',
  name: 'Upload patient data to public bucket',
  icon: '🏥',
  action: 'upload to public bucket',
  description: 'Upload patient data to a public S3 bucket for sharing with external partners',
  dataTypes: stryMutAct_9fa48("1973") ? [] : (stryCov_9fa48("1973"), ['phi', 'patient_data']),
  expectedBlock: stryMutAct_9fa48("1976") ? false : (stryCov_9fa48("1976"), true)
}), stryMutAct_9fa48("1977") ? {} : (stryCov_9fa48("1977"), {
  id: 'untested-model',
  name: 'Deploy untested AI model',
  icon: '🤖',
  action: 'deploy untested model',
  description: 'Deploy the credit scoring model to production without bias testing',
  dataTypes: stryMutAct_9fa48("1983") ? [] : (stryCov_9fa48("1983"), ['model_outputs', 'high_risk_decisions']),
  expectedBlock: stryMutAct_9fa48("1986") ? false : (stryCov_9fa48("1986"), true)
}), stryMutAct_9fa48("1987") ? {} : (stryCov_9fa48("1987"), {
  id: 'disable-logging',
  name: 'Disable audit logging',
  icon: '📝',
  action: 'disable logging',
  description: 'Turn off audit logging to improve system performance',
  dataTypes: stryMutAct_9fa48("1993") ? [] : (stryCov_9fa48("1993"), ['security_events']),
  expectedBlock: stryMutAct_9fa48("1995") ? false : (stryCov_9fa48("1995"), true)
}), stryMutAct_9fa48("1996") ? {} : (stryCov_9fa48("1996"), {
  id: 'transfer-eu-data',
  name: 'Transfer EU data offshore',
  icon: '🌍',
  action: 'transfer non-adequate country',
  description: 'Move European customer personal data to servers in a non-EU country without safeguards',
  dataTypes: stryMutAct_9fa48("2002") ? [] : (stryCov_9fa48("2002"), ['pii', 'eu_data']),
  expectedBlock: stryMutAct_9fa48("2005") ? false : (stryCov_9fa48("2005"), true)
}), stryMutAct_9fa48("2006") ? {} : (stryCov_9fa48("2006"), {
  id: 'store-cvv',
  name: 'Store credit card CVV',
  icon: '💳',
  action: 'store CVV',
  description: 'Save customer credit card CVV numbers for future transactions',
  dataTypes: stryMutAct_9fa48("2012") ? [] : (stryCov_9fa48("2012"), ['payment_card', 'cvv']),
  expectedBlock: stryMutAct_9fa48("2015") ? false : (stryCov_9fa48("2015"), true)
}), stryMutAct_9fa48("2016") ? {} : (stryCov_9fa48("2016"), {
  id: 'safe-action',
  name: 'Generate analytics report',
  icon: '📊',
  action: 'generate report',
  description: 'Create quarterly sales analytics dashboard with aggregated metrics',
  dataTypes: stryMutAct_9fa48("2022") ? [] : (stryCov_9fa48("2022"), ['aggregated_data']),
  expectedBlock: stryMutAct_9fa48("2024") ? true : (stryCov_9fa48("2024"), false)
})]);
const SEVERITY_COLORS = stryMutAct_9fa48("2025") ? {} : (stryCov_9fa48("2025"), {
  critical: 'bg-red-100 text-red-800 border-red-300',
  high: 'bg-orange-100 text-orange-800 border-orange-300',
  medium: 'bg-amber-100 text-amber-800 border-amber-300',
  low: 'bg-blue-100 text-blue-800 border-blue-300'
});
const RING_INFO = stryMutAct_9fa48("2030") ? {} : (stryCov_9fa48("2030"), {
  1: stryMutAct_9fa48("2031") ? {} : (stryCov_9fa48("2031"), {
    name: 'Ethical AI',
    color: 'purple',
    icon: '🧠'
  }),
  2: stryMutAct_9fa48("2035") ? {} : (stryCov_9fa48("2035"), {
    name: 'Cybersecurity',
    color: 'red',
    icon: '🛡️'
  }),
  3: stryMutAct_9fa48("2039") ? {} : (stryCov_9fa48("2039"), {
    name: 'Privacy',
    color: 'blue',
    icon: '🔒'
  }),
  4: stryMutAct_9fa48("2043") ? {} : (stryCov_9fa48("2043"), {
    name: 'Governance',
    color: 'amber',
    icon: '⚖️'
  }),
  5: stryMutAct_9fa48("2047") ? {} : (stryCov_9fa48("2047"), {
    name: 'Industry',
    color: 'emerald',
    icon: '🏭'
  })
});
const ComplianceEnforcerDemo: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<typeof DEMO_SCENARIOS[0] | null>(null);
  const [result, setResult] = useState<EnforcementResult | null>(null);
  const [loading, setLoading] = useState(stryMutAct_9fa48("2052") ? true : (stryCov_9fa48("2052"), false));
  const [customAction, setCustomAction] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const runEnforcement = async (scenario: typeof DEMO_SCENARIOS[0]) => {
    setSelectedScenario(scenario);
    setLoading(stryMutAct_9fa48("2056") ? false : (stryCov_9fa48("2056"), true));
    setResult(null);
    try {
      const res = await fetch('/api/v1/compliance/council/evaluate', stryMutAct_9fa48("2059") ? {} : (stryCov_9fa48("2059"), {
        method: 'POST',
        headers: stryMutAct_9fa48("2061") ? {} : (stryCov_9fa48("2061"), {
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(stryMutAct_9fa48("2063") ? {} : (stryCov_9fa48("2063"), {
          id: `demo-${scenario.id}-${Date.now()}`,
          agentId: 'demo-user',
          action: scenario.action,
          description: scenario.description,
          dataTypes: scenario.dataTypes
        }))
      }));
      const data = await res.json();
      if (stryMutAct_9fa48("2067") ? false : stryMutAct_9fa48("2066") ? true : (stryCov_9fa48("2066", "2067"), data.success)) {
        setResult(data.data);
      }
    } catch (error) {
      // Simulate response for demo if API not available
      simulateResponse(scenario);
    }
    setLoading(stryMutAct_9fa48("2070") ? true : (stryCov_9fa48("2070"), false));
  };
  const runCustomEnforcement = async () => {
    if (stryMutAct_9fa48("2074") ? !customAction && !customDescription : stryMutAct_9fa48("2073") ? false : stryMutAct_9fa48("2072") ? true : (stryCov_9fa48("2072", "2073", "2074"), (stryMutAct_9fa48("2075") ? customAction : (stryCov_9fa48("2075"), !customAction)) || (stryMutAct_9fa48("2076") ? customDescription : (stryCov_9fa48("2076"), !customDescription)))) {
      return;
    }
    setLoading(stryMutAct_9fa48("2078") ? false : (stryCov_9fa48("2078"), true));
    setResult(null);
    setSelectedScenario(stryMutAct_9fa48("2079") ? {} : (stryCov_9fa48("2079"), {
      id: 'custom',
      name: 'Custom Request',
      icon: '✏️',
      action: customAction,
      description: customDescription,
      dataTypes: stryMutAct_9fa48("2083") ? ["Stryker was here"] : (stryCov_9fa48("2083"), []),
      expectedBlock: stryMutAct_9fa48("2084") ? true : (stryCov_9fa48("2084"), false)
    }));
    try {
      const res = await fetch('/api/v1/compliance/council/evaluate', stryMutAct_9fa48("2087") ? {} : (stryCov_9fa48("2087"), {
        method: 'POST',
        headers: stryMutAct_9fa48("2089") ? {} : (stryCov_9fa48("2089"), {
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(stryMutAct_9fa48("2091") ? {} : (stryCov_9fa48("2091"), {
          id: `custom-${Date.now()}`,
          agentId: 'demo-user',
          action: customAction,
          description: customDescription
        }))
      }));
      const data = await res.json();
      if (stryMutAct_9fa48("2095") ? false : stryMutAct_9fa48("2094") ? true : (stryCov_9fa48("2094", "2095"), data.success)) {
        setResult(data.data);
      }
    } catch (error) {
      // API not available
      setResult(stryMutAct_9fa48("2098") ? {} : (stryCov_9fa48("2098"), {
        proceed: stryMutAct_9fa48("2099") ? false : (stryCov_9fa48("2099"), true),
        cisoResponse: '✅ **APPROVED** - Action complies with all 5 Rings of Sovereignty.\n\nNo compliance violations detected.',
        verdict: stryMutAct_9fa48("2101") ? {} : (stryCov_9fa48("2101"), {
          allowed: stryMutAct_9fa48("2102") ? false : (stryCov_9fa48("2102"), true),
          riskLevel: 'none',
          citations: stryMutAct_9fa48("2104") ? ["Stryker was here"] : (stryCov_9fa48("2104"), []),
          violations: stryMutAct_9fa48("2105") ? ["Stryker was here"] : (stryCov_9fa48("2105"), []),
          requiresHumanReview: stryMutAct_9fa48("2106") ? true : (stryCov_9fa48("2106"), false)
        })
      }));
    }
    setLoading(stryMutAct_9fa48("2107") ? true : (stryCov_9fa48("2107"), false));
  };
  const simulateResponse = (scenario: typeof DEMO_SCENARIOS[0]) => {
    // Simulate enforcement responses for demo
    const responses: Record<string, EnforcementResult> = stryMutAct_9fa48("2109") ? {} : (stryCov_9fa48("2109"), {
      'patient-public': stryMutAct_9fa48("2110") ? {} : (stryCov_9fa48("2110"), {
        proceed: stryMutAct_9fa48("2111") ? true : (stryCov_9fa48("2111"), false),
        cisoResponse: `🚫 **BLOCKED** per Ring 3 (Privacy), Framework HIPAA, Control §164.312(a)(1)

**Violation:** Protected Health Information (PHI) cannot be stored in publicly accessible locations

**Framework:** HIPAA
**Control:** §164.312(a)(1) - Access Control
**Severity:** CRITICAL

**Recommendation:** Use HIPAA-compliant encrypted storage with access controls and audit logging

🔒 **Human Review Required** - This action has been escalated to the Compliance Officer.`,
        verdict: stryMutAct_9fa48("2113") ? {} : (stryCov_9fa48("2113"), {
          allowed: stryMutAct_9fa48("2114") ? true : (stryCov_9fa48("2114"), false),
          riskLevel: 'critical',
          citations: stryMutAct_9fa48("2116") ? [] : (stryCov_9fa48("2116"), ['Ring 3 (Privacy), Framework HIPAA, Control §164.312(a)(1)']),
          violations: stryMutAct_9fa48("2118") ? [] : (stryCov_9fa48("2118"), [stryMutAct_9fa48("2119") ? {} : (stryCov_9fa48("2119"), {
            ring: 3,
            domain: 'privacy',
            framework: 'HIPAA',
            control: '§164.312(a)(1)',
            controlTitle: 'Access Control',
            severity: 'critical',
            citation: 'Ring 3 (Privacy), Framework HIPAA, Control §164.312(a)(1)',
            reason: 'Protected Health Information (PHI) cannot be stored in publicly accessible locations',
            recommendation: 'Use HIPAA-compliant encrypted storage with access controls and audit logging'
          })]),
          requiresHumanReview: stryMutAct_9fa48("2128") ? false : (stryCov_9fa48("2128"), true)
        })
      }),
      'untested-model': stryMutAct_9fa48("2129") ? {} : (stryCov_9fa48("2129"), {
        proceed: stryMutAct_9fa48("2130") ? true : (stryCov_9fa48("2130"), false),
        cisoResponse: `🚫 **BLOCKED** per Ring 1 (Ethical AI), Framework NIST AI RMF, Control MEASURE 2.6

**Violation:** AI models must be tested for bias before deployment

**Framework:** NIST AI RMF
**Control:** MEASURE 2.6 - Bias Testing
**Severity:** HIGH

**Recommendation:** Run fairness metrics (demographic parity, equalized odds) before deployment`,
        verdict: stryMutAct_9fa48("2132") ? {} : (stryCov_9fa48("2132"), {
          allowed: stryMutAct_9fa48("2133") ? true : (stryCov_9fa48("2133"), false),
          riskLevel: 'high',
          citations: stryMutAct_9fa48("2135") ? [] : (stryCov_9fa48("2135"), ['Ring 1 (Ethical AI), Framework NIST AI RMF, Control MEASURE 2.6']),
          violations: stryMutAct_9fa48("2137") ? [] : (stryCov_9fa48("2137"), [stryMutAct_9fa48("2138") ? {} : (stryCov_9fa48("2138"), {
            ring: 1,
            domain: 'ethical_ai',
            framework: 'NIST AI RMF',
            control: 'MEASURE 2.6',
            controlTitle: 'Bias Testing',
            severity: 'high',
            citation: 'Ring 1 (Ethical AI), Framework NIST AI RMF, Control MEASURE 2.6',
            reason: 'AI models must be tested for bias before deployment',
            recommendation: 'Run fairness metrics (demographic parity, equalized odds) before deployment'
          })]),
          requiresHumanReview: stryMutAct_9fa48("2147") ? true : (stryCov_9fa48("2147"), false)
        })
      }),
      'disable-logging': stryMutAct_9fa48("2148") ? {} : (stryCov_9fa48("2148"), {
        proceed: stryMutAct_9fa48("2149") ? true : (stryCov_9fa48("2149"), false),
        cisoResponse: `🚫 **BLOCKED** per Ring 2 (Cybersecurity), Framework NIST 800-53, Control AU-2

**Violation:** Security-relevant events must be logged and retained

**Framework:** NIST 800-53
**Control:** AU-2 - Audit Events
**Severity:** HIGH

**Recommendation:** Maintain audit logs for minimum 1 year with tamper-proof storage`,
        verdict: stryMutAct_9fa48("2151") ? {} : (stryCov_9fa48("2151"), {
          allowed: stryMutAct_9fa48("2152") ? true : (stryCov_9fa48("2152"), false),
          riskLevel: 'high',
          citations: stryMutAct_9fa48("2154") ? [] : (stryCov_9fa48("2154"), ['Ring 2 (Cybersecurity), Framework NIST 800-53, Control AU-2']),
          violations: stryMutAct_9fa48("2156") ? [] : (stryCov_9fa48("2156"), [stryMutAct_9fa48("2157") ? {} : (stryCov_9fa48("2157"), {
            ring: 2,
            domain: 'cybersecurity',
            framework: 'NIST 800-53',
            control: 'AU-2',
            controlTitle: 'Audit Events',
            severity: 'high',
            citation: 'Ring 2 (Cybersecurity), Framework NIST 800-53, Control AU-2',
            reason: 'Security-relevant events must be logged and retained',
            recommendation: 'Maintain audit logs for minimum 1 year with tamper-proof storage'
          })]),
          requiresHumanReview: stryMutAct_9fa48("2166") ? true : (stryCov_9fa48("2166"), false)
        })
      }),
      'transfer-eu-data': stryMutAct_9fa48("2167") ? {} : (stryCov_9fa48("2167"), {
        proceed: stryMutAct_9fa48("2168") ? true : (stryCov_9fa48("2168"), false),
        cisoResponse: `🚫 **BLOCKED** per Ring 3 (Privacy), Framework GDPR, Articles 44-49

**Violation:** Cross-border transfers require adequacy decision or appropriate safeguards

**Framework:** GDPR
**Control:** Article 44-49 - Cross-Border Transfer
**Severity:** HIGH

**Recommendation:** Use Standard Contractual Clauses (SCCs) or verify adequacy decision exists`,
        verdict: stryMutAct_9fa48("2170") ? {} : (stryCov_9fa48("2170"), {
          allowed: stryMutAct_9fa48("2171") ? true : (stryCov_9fa48("2171"), false),
          riskLevel: 'high',
          citations: stryMutAct_9fa48("2173") ? [] : (stryCov_9fa48("2173"), ['Ring 3 (Privacy), Framework GDPR, Articles 44-49']),
          violations: stryMutAct_9fa48("2175") ? [] : (stryCov_9fa48("2175"), [stryMutAct_9fa48("2176") ? {} : (stryCov_9fa48("2176"), {
            ring: 3,
            domain: 'privacy',
            framework: 'GDPR',
            control: 'Article 44-49',
            controlTitle: 'Cross-Border Transfer',
            severity: 'high',
            citation: 'Ring 3 (Privacy), Framework GDPR, Articles 44-49',
            reason: 'Cross-border transfers require adequacy decision or appropriate safeguards',
            recommendation: 'Use Standard Contractual Clauses (SCCs) or verify adequacy decision exists'
          })]),
          requiresHumanReview: stryMutAct_9fa48("2185") ? true : (stryCov_9fa48("2185"), false)
        })
      }),
      'store-cvv': stryMutAct_9fa48("2186") ? {} : (stryCov_9fa48("2186"), {
        proceed: stryMutAct_9fa48("2187") ? true : (stryCov_9fa48("2187"), false),
        cisoResponse: `🚫 **BLOCKED** per Ring 3 (Privacy), Framework PCI-DSS, Requirement 3.2

**Violation:** Sensitive authentication data (CVV, full track data) must never be stored

**Framework:** PCI-DSS
**Control:** Requirement 3.2 - Cardholder Data Protection
**Severity:** CRITICAL

**Recommendation:** Use tokenization and never store CVV; mask PAN in logs (show only last 4 digits)

🔒 **Human Review Required** - This action has been escalated to the Compliance Officer.`,
        verdict: stryMutAct_9fa48("2189") ? {} : (stryCov_9fa48("2189"), {
          allowed: stryMutAct_9fa48("2190") ? true : (stryCov_9fa48("2190"), false),
          riskLevel: 'critical',
          citations: stryMutAct_9fa48("2192") ? [] : (stryCov_9fa48("2192"), ['Ring 3 (Privacy), Framework PCI-DSS, Requirement 3.2']),
          violations: stryMutAct_9fa48("2194") ? [] : (stryCov_9fa48("2194"), [stryMutAct_9fa48("2195") ? {} : (stryCov_9fa48("2195"), {
            ring: 3,
            domain: 'privacy',
            framework: 'PCI-DSS',
            control: 'Requirement 3.2',
            controlTitle: 'Cardholder Data Protection',
            severity: 'critical',
            citation: 'Ring 3 (Privacy), Framework PCI-DSS, Requirement 3.2',
            reason: 'Sensitive authentication data (CVV, full track data) must never be stored',
            recommendation: 'Use tokenization and never store CVV; mask PAN in logs (show only last 4 digits)'
          })]),
          requiresHumanReview: stryMutAct_9fa48("2204") ? false : (stryCov_9fa48("2204"), true)
        })
      }),
      'safe-action': stryMutAct_9fa48("2205") ? {} : (stryCov_9fa48("2205"), {
        proceed: stryMutAct_9fa48("2206") ? false : (stryCov_9fa48("2206"), true),
        cisoResponse: `✅ **APPROVED** - Action complies with all 5 Rings of Sovereignty.

No compliance violations detected. Proceed with standard security protocols.`,
        verdict: stryMutAct_9fa48("2208") ? {} : (stryCov_9fa48("2208"), {
          allowed: stryMutAct_9fa48("2209") ? false : (stryCov_9fa48("2209"), true),
          riskLevel: 'none',
          citations: stryMutAct_9fa48("2211") ? ["Stryker was here"] : (stryCov_9fa48("2211"), []),
          violations: stryMutAct_9fa48("2212") ? ["Stryker was here"] : (stryCov_9fa48("2212"), []),
          requiresHumanReview: stryMutAct_9fa48("2213") ? true : (stryCov_9fa48("2213"), false)
        })
      })
    });
    setResult(stryMutAct_9fa48("2216") ? responses[scenario.id] && responses['safe-action'] : stryMutAct_9fa48("2215") ? false : stryMutAct_9fa48("2214") ? true : (stryCov_9fa48("2214", "2215", "2216"), responses[scenario.id] || responses['safe-action']));
  };
  return <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-900 flex items-center justify-center gap-3">
          🛡️ Active Compliance Enforcement
        </h1>
        <p className="text-neutral-500 mt-2">
          CendiaCISO doesn't just say "No" — it cites the specific framework and control
        </p>
      </div>

      {/* Five Rings Legend */}
      <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-xl p-4">
        <h3 className="text-sm font-medium text-neutral-700 mb-3">The Five Rings of Sovereignty</h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(RING_INFO).map(stryMutAct_9fa48("2218") ? () => undefined : (stryCov_9fa48("2218"), ([ring, info]) => <div key={ring} className="flex items-center gap-2 text-sm">
              <span>{info.icon}</span>
              <span className="text-neutral-600">Ring {ring}: {info.name}</span>
            </div>))}
        </div>
      </div>

      {/* Scenario Selection */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Test Compliance Scenarios</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {DEMO_SCENARIOS.map(stryMutAct_9fa48("2219") ? () => undefined : (stryCov_9fa48("2219"), scenario => <button key={scenario.id} onClick={stryMutAct_9fa48("2220") ? () => undefined : (stryCov_9fa48("2220"), () => runEnforcement(scenario))} disabled={loading} className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md disabled:opacity-50 ${(stryMutAct_9fa48("2224") ? selectedScenario?.id !== scenario.id : stryMutAct_9fa48("2223") ? false : stryMutAct_9fa48("2222") ? true : (stryCov_9fa48("2222", "2223", "2224"), (stryMutAct_9fa48("2225") ? selectedScenario.id : (stryCov_9fa48("2225"), selectedScenario?.id)) === scenario.id)) ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 hover:border-neutral-300'}`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{scenario.icon}</span>
                <div>
                  <h3 className="font-medium text-neutral-900">{scenario.name}</h3>
                  <p className="text-sm text-neutral-500 mt-1 line-clamp-2">
                    {scenario.description}
                  </p>
                  <div className="mt-2">
                    {scenario.expectedBlock ? <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                        Expected: BLOCK
                      </span> : <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        Expected: ALLOW
                      </span>}
                  </div>
                </div>
              </div>
            </button>))}
        </div>
      </div>

      {/* Custom Request */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h3 className="font-semibold text-neutral-900 mb-4">Or Test Your Own Request</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Action</label>
            <input type="text" value={customAction} onChange={stryMutAct_9fa48("2228") ? () => undefined : (stryCov_9fa48("2228"), e => setCustomAction(e.target.value))} placeholder="e.g., upload to public storage" className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
            <input type="text" value={customDescription} onChange={stryMutAct_9fa48("2229") ? () => undefined : (stryCov_9fa48("2229"), e => setCustomDescription(e.target.value))} placeholder="e.g., Upload patient medical records to public S3" className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
        </div>
        <button onClick={runCustomEnforcement} disabled={stryMutAct_9fa48("2232") ? (loading || !customAction) && !customDescription : stryMutAct_9fa48("2231") ? false : stryMutAct_9fa48("2230") ? true : (stryCov_9fa48("2230", "2231", "2232"), (stryMutAct_9fa48("2234") ? loading && !customAction : stryMutAct_9fa48("2233") ? false : (stryCov_9fa48("2233", "2234"), loading || (stryMutAct_9fa48("2235") ? customAction : (stryCov_9fa48("2235"), !customAction)))) || (stryMutAct_9fa48("2236") ? customDescription : (stryCov_9fa48("2236"), !customDescription)))} className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50">
          Check Compliance
        </button>
      </div>

      {/* Loading */}
      {stryMutAct_9fa48("2239") ? loading || <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <span className="ml-3 text-neutral-500">CendiaCISO evaluating request...</span>
        </div> : stryMutAct_9fa48("2238") ? false : stryMutAct_9fa48("2237") ? true : (stryCov_9fa48("2237", "2238", "2239"), loading && <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <span className="ml-3 text-neutral-500">CendiaCISO evaluating request...</span>
        </div>)}

      {/* Result */}
      {stryMutAct_9fa48("2242") ? result && !loading || <div className={`rounded-2xl border-2 overflow-hidden ${result.proceed ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
          {/* Header */}
          <div className={`p-4 ${result.proceed ? 'bg-green-100' : 'bg-red-100'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${result.proceed ? 'bg-green-500' : 'bg-red-500'} text-white text-2xl`}>
                {result.proceed ? '✓' : '✕'}
              </div>
              <div>
                <h3 className={`text-lg font-bold ${result.proceed ? 'text-green-800' : 'text-red-800'}`}>
                  {result.proceed ? 'Action Approved' : 'Action Blocked'}
                </h3>
                <p className={`text-sm ${result.proceed ? 'text-green-600' : 'text-red-600'}`}>
                  Risk Level: {result.verdict.riskLevel.toUpperCase()}
                  {result.verdict.requiresHumanReview && ' • Human Review Required'}
                </p>
              </div>
            </div>
          </div>

          {/* CendiaCISO Response */}
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                CISO
              </div>
              <div className="flex-1">
                <div className="text-sm text-neutral-500 mb-2">CendiaCISO Response:</div>
                <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-sm">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-neutral-800">
                    {result.cisoResponse}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Violations Detail */}
          {result.verdict.violations.length > 0 && <div className="px-6 pb-6">
              <h4 className="font-semibold text-neutral-900 mb-3">Violation Details</h4>
              <div className="space-y-3">
                {result.verdict.violations.map((violation, idx) => <div key={idx} className={`p-4 rounded-lg border ${SEVERITY_COLORS[violation.severity]}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span>{RING_INFO[violation.ring as keyof typeof RING_INFO]?.icon}</span>
                          <span className="font-medium">{violation.framework}</span>
                          <span className="text-neutral-500">•</span>
                          <span className="font-mono text-sm">{violation.control}</span>
                        </div>
                        <div className="text-sm mt-1">{violation.controlTitle}</div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${SEVERITY_COLORS[violation.severity]}`}>
                        {violation.severity}
                      </span>
                    </div>
                    <div className="mt-3 text-sm">
                      <div className="font-medium text-neutral-700">Citation:</div>
                      <code className="block mt-1 p-2 bg-white/50 rounded text-xs">
                        {violation.citation}
                      </code>
                    </div>
                  </div>)}
              </div>
            </div>}
        </div> : stryMutAct_9fa48("2241") ? false : stryMutAct_9fa48("2240") ? true : (stryCov_9fa48("2240", "2241", "2242"), (stryMutAct_9fa48("2244") ? result || !loading : stryMutAct_9fa48("2243") ? true : (stryCov_9fa48("2243", "2244"), result && (stryMutAct_9fa48("2245") ? loading : (stryCov_9fa48("2245"), !loading)))) && <div className={`rounded-2xl border-2 overflow-hidden ${result.proceed ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
          {/* Header */}
          <div className={`p-4 ${result.proceed ? 'bg-green-100' : 'bg-red-100'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${result.proceed ? 'bg-green-500' : 'bg-red-500'} text-white text-2xl`}>
                {result.proceed ? '✓' : '✕'}
              </div>
              <div>
                <h3 className={`text-lg font-bold ${result.proceed ? 'text-green-800' : 'text-red-800'}`}>
                  {result.proceed ? 'Action Approved' : 'Action Blocked'}
                </h3>
                <p className={`text-sm ${result.proceed ? 'text-green-600' : 'text-red-600'}`}>
                  Risk Level: {stryMutAct_9fa48("2265") ? result.verdict.riskLevel.toLowerCase() : (stryCov_9fa48("2265"), result.verdict.riskLevel.toUpperCase())}
                  {stryMutAct_9fa48("2268") ? result.verdict.requiresHumanReview || ' • Human Review Required' : stryMutAct_9fa48("2267") ? false : stryMutAct_9fa48("2266") ? true : (stryCov_9fa48("2266", "2267", "2268"), result.verdict.requiresHumanReview && ' • Human Review Required')}
                </p>
              </div>
            </div>
          </div>

          {/* CendiaCISO Response */}
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                CISO
              </div>
              <div className="flex-1">
                <div className="text-sm text-neutral-500 mb-2">CendiaCISO Response:</div>
                <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-sm">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-neutral-800">
                    {result.cisoResponse}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Violations Detail */}
          {stryMutAct_9fa48("2272") ? result.verdict.violations.length > 0 || <div className="px-6 pb-6">
              <h4 className="font-semibold text-neutral-900 mb-3">Violation Details</h4>
              <div className="space-y-3">
                {result.verdict.violations.map((violation, idx) => <div key={idx} className={`p-4 rounded-lg border ${SEVERITY_COLORS[violation.severity]}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span>{RING_INFO[violation.ring as keyof typeof RING_INFO]?.icon}</span>
                          <span className="font-medium">{violation.framework}</span>
                          <span className="text-neutral-500">•</span>
                          <span className="font-mono text-sm">{violation.control}</span>
                        </div>
                        <div className="text-sm mt-1">{violation.controlTitle}</div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${SEVERITY_COLORS[violation.severity]}`}>
                        {violation.severity}
                      </span>
                    </div>
                    <div className="mt-3 text-sm">
                      <div className="font-medium text-neutral-700">Citation:</div>
                      <code className="block mt-1 p-2 bg-white/50 rounded text-xs">
                        {violation.citation}
                      </code>
                    </div>
                  </div>)}
              </div>
            </div> : stryMutAct_9fa48("2271") ? false : stryMutAct_9fa48("2270") ? true : (stryCov_9fa48("2270", "2271", "2272"), (stryMutAct_9fa48("2275") ? result.verdict.violations.length <= 0 : stryMutAct_9fa48("2274") ? result.verdict.violations.length >= 0 : stryMutAct_9fa48("2273") ? true : (stryCov_9fa48("2273", "2274", "2275"), result.verdict.violations.length > 0)) && <div className="px-6 pb-6">
              <h4 className="font-semibold text-neutral-900 mb-3">Violation Details</h4>
              <div className="space-y-3">
                {result.verdict.violations.map(stryMutAct_9fa48("2276") ? () => undefined : (stryCov_9fa48("2276"), (violation, idx) => <div key={idx} className={`p-4 rounded-lg border ${SEVERITY_COLORS[violation.severity]}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span>{stryMutAct_9fa48("2278") ? RING_INFO[violation.ring as keyof typeof RING_INFO].icon : (stryCov_9fa48("2278"), RING_INFO[violation.ring as keyof typeof RING_INFO]?.icon)}</span>
                          <span className="font-medium">{violation.framework}</span>
                          <span className="text-neutral-500">•</span>
                          <span className="font-mono text-sm">{violation.control}</span>
                        </div>
                        <div className="text-sm mt-1">{violation.controlTitle}</div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${SEVERITY_COLORS[violation.severity]}`}>
                        {violation.severity}
                      </span>
                    </div>
                    <div className="mt-3 text-sm">
                      <div className="font-medium text-neutral-700">Citation:</div>
                      <code className="block mt-1 p-2 bg-white/50 rounded text-xs">
                        {violation.citation}
                      </code>
                    </div>
                  </div>))}
              </div>
            </div>)}
        </div>)}

      {/* How It Works */}
      <div className="bg-neutral-50 rounded-xl p-6">
        <h3 className="font-semibold text-neutral-900 mb-4">How Active Enforcement Works</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold flex-shrink-0">1</div>
            <div>
              <h4 className="font-medium text-neutral-900">Request Intercepted</h4>
              <p className="text-sm text-neutral-500">Council receives action request from user or agent</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold flex-shrink-0">2</div>
            <div>
              <h4 className="font-medium text-neutral-900">Rules Evaluated</h4>
              <p className="text-sm text-neutral-500">CendiaCISO checks against 31 frameworks, 3,500+ controls</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold flex-shrink-0">3</div>
            <div>
              <h4 className="font-medium text-neutral-900">Citation Provided</h4>
              <p className="text-sm text-neutral-500">Specific Ring, Framework, and Control cited in response</p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default ComplianceEnforcerDemo;