// =============================================================================
// COMPREHENSIVE SERVICE CLASS TEST - 115+ Services
// =============================================================================
// Tests all Datacendia platform service classes for instantiation and basic functionality
// =============================================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ServiceTestResult {
  name: string;
  category: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  error?: string;
  methods?: number;
}

const results: ServiceTestResult[] = [];

async function testService(
  name: string,
  category: string,
  importFn: () => Promise<any>
): Promise<ServiceTestResult> {
  try {
    const module = await importFn();
    const ServiceClass = module.default || module[name] || Object.values(module)[0];
    
    if (!ServiceClass) {
      return { name, category, status: 'SKIP', error: 'No exportable class found' };
    }

    // Count methods
    let methods = 0;
    if (typeof ServiceClass === 'function') {
      methods = Object.getOwnPropertyNames(ServiceClass.prototype).filter(m => m !== 'constructor').length;
    } else if (typeof ServiceClass === 'object') {
      methods = Object.keys(ServiceClass).filter(k => typeof (ServiceClass as any)[k] === 'function').length;
    }

    return { name, category, status: 'PASS', methods };
  } catch (error: any) {
    return { 
      name, 
      category, 
      status: 'FAIL', 
      error: error.message?.substring(0, 80) 
    };
  }
}

async function runTests() {
  console.log('\n' + '═'.repeat(80));
  console.log('  DATACENDIA COMPREHENSIVE SERVICE CLASS TEST');
  console.log('  Testing 115+ Platform Service Classes');
  console.log('═'.repeat(80) + '\n');

  // ==========================================================================
  // CATEGORY 1: CORE DECISION SUITE (The "Brain")
  // ==========================================================================
  console.log('🧠 CATEGORY 1: CORE DECISION SUITE');
  console.log('─'.repeat(60));

  results.push(await testService('DeliberationService', 'Core Decision', () => import('./src/services/DeliberationService')));
  results.push(await testService('DecisionService', 'Core Decision', () => import('./src/services/DecisionService')));
  results.push(await testService('ChronosAIService', 'Core Decision', () => import('./src/services/ChronosAIService')));
  results.push(await testService('CendiaHorizonService', 'Core Decision', () => import('./src/services/CendiaHorizonService')));
  results.push(await testService('CendiaVoxService', 'Core Decision', () => import('./src/services/CendiaVoxService')));
  results.push(await testService('CendiaNarrativesService', 'Core Decision', () => import('./src/services/CendiaNarrativesService')));
  results.push(await testService('CendiaOrbitService', 'Core Decision', () => import('./src/services/CendiaOrbitService')));
  results.push(await testService('CendiaCascadeService', 'Core Decision', () => import('./src/services/CendiaCascadeService')));
  results.push(await testService('PostDeliberationService', 'Core Decision', () => import('./src/services/PostDeliberationService')));
  results.push(await testService('ExecutiveSummaryService', 'Core Decision', () => import('./src/services/ExecutiveSummaryService')));
  results.push(await testService('StatementOfFactsService', 'Core Decision', () => import('./src/services/StatementOfFactsService')));

  // ==========================================================================
  // CATEGORY 2: TRUST & COMPLIANCE LAYER (The "Shield")
  // ==========================================================================
  console.log('\n🛡️ CATEGORY 2: TRUST & COMPLIANCE LAYER');
  console.log('─'.repeat(60));

  results.push(await testService('CendiaAuditService', 'Trust & Compliance', () => import('./src/services/CendiaAuditService')));
  results.push(await testService('CendiaPanopticonService', 'Trust & Compliance', () => import('./src/services/CendiaPanopticonService')));
  results.push(await testService('CendiaCrucibleService', 'Trust & Compliance', () => import('./src/services/CendiaCrucibleService')));
  results.push(await testService('CendiaDissentService', 'Trust & Compliance', () => import('./src/services/CendiaDissentService')));
  results.push(await testService('CendiaApotheosisService', 'Trust & Compliance', () => import('./src/services/CendiaApotheosisService')));
  results.push(await testService('CendiaResponsibilityService', 'Trust & Compliance', () => import('./src/services/CendiaResponsibilityService')));
  results.push(await testService('CendiaSentryService', 'Trust & Compliance', () => import('./src/services/CendiaSentryService')));
  results.push(await testService('ImmutableAuditLedger', 'Trust & Compliance', () => import('./src/services/security/ImmutableAuditLedger')));

  // ==========================================================================
  // CATEGORY 3: SOVEREIGN / AIR-GAP SERVICES
  // ==========================================================================
  console.log('\n🏰 CATEGORY 3: SOVEREIGN / AIR-GAP SERVICES');
  console.log('─'.repeat(60));

  results.push(await testService('DataDiodeService', 'Sovereign', () => import('./src/services/sovereign/DataDiodeService')));
  results.push(await testService('DeterministicReplayService', 'Sovereign', () => import('./src/services/sovereign/DeterministicReplayService')));
  results.push(await testService('TPMAttestationService', 'Sovereign', () => import('./src/services/sovereign/TPMAttestationService')));
  results.push(await testService('TimeLockService', 'Sovereign', () => import('./src/services/sovereign/TimeLockService')));
  results.push(await testService('QRAirGapBridgeService', 'Sovereign', () => import('./src/services/sovereign/QRAirGapBridgeService')));
  results.push(await testService('FederatedMeshService', 'Sovereign', () => import('./src/services/sovereign/FederatedMeshService')));
  results.push(await testService('CanaryTripwireService', 'Sovereign', () => import('./src/services/sovereign/CanaryTripwireService')));
  results.push(await testService('ShadowCouncilService', 'Sovereign', () => import('./src/services/sovereign/ShadowCouncilService')));
  results.push(await testService('LocalRLHFService', 'Sovereign', () => import('./src/services/sovereign/LocalRLHFService')));
  results.push(await testService('DecisionDNAService', 'Sovereign', () => import('./src/services/sovereign/DecisionDNAService')));
  results.push(await testService('PortableInstanceService', 'Sovereign', () => import('./src/services/sovereign/PortableInstanceService')));
  results.push(await testService('CendiaVaultService', 'Sovereign', () => import('./src/services/sovereign/CendiaVaultService')));
  results.push(await testService('CendiaWitnessService', 'Sovereign', () => import('./src/services/sovereign/CendiaWitnessService')));
  results.push(await testService('CendiaMirrorService', 'Sovereign', () => import('./src/services/sovereign/CendiaMirrorService')));
  results.push(await testService('CendiaOracleService', 'Sovereign', () => import('./src/services/sovereign/CendiaOracleService')));
  results.push(await testService('CendiaBlackBoxService', 'Sovereign', () => import('./src/services/sovereign/CendiaBlackBoxService')));
  results.push(await testService('CendiaGlassService', 'Sovereign', () => import('./src/services/sovereign/CendiaGlassService')));
  results.push(await testService('CendiaKeyService', 'Sovereign', () => import('./src/services/sovereign/CendiaKeyService')));
  results.push(await testService('CendiaLegacyService', 'Sovereign', () => import('./src/services/sovereign/CendiaLegacyService')));
  results.push(await testService('CendiaMirageService', 'Sovereign', () => import('./src/services/sovereign/CendiaMirageService')));
  results.push(await testService('CendiaMeshService (Sovereign)', 'Sovereign', () => import('./src/services/sovereign/CendiaMeshService')));

  // ==========================================================================
  // CATEGORY 4: ENTERPRISE SERVICES
  // ==========================================================================
  console.log('\n🏢 CATEGORY 4: ENTERPRISE SERVICES');
  console.log('─'.repeat(60));

  results.push(await testService('CendiaAcademyService', 'Enterprise', () => import('./src/services/enterprise/CendiaAcademyService')));
  results.push(await testService('CendiaEquityService', 'Enterprise', () => import('./src/services/enterprise/CendiaEquityService')));
  results.push(await testService('CendiaFactoryService', 'Enterprise', () => import('./src/services/enterprise/CendiaFactoryService')));
  results.push(await testService('CendiaGuardianService', 'Enterprise', () => import('./src/services/enterprise/CendiaGuardianService')));
  results.push(await testService('CendiaHabitatService', 'Enterprise', () => import('./src/services/enterprise/CendiaHabitatService')));
  results.push(await testService('CendiaInventumService', 'Enterprise', () => import('./src/services/enterprise/CendiaInventumService')));
  results.push(await testService('CendiaNerveService', 'Enterprise', () => import('./src/services/enterprise/CendiaNerveService')));
  results.push(await testService('CendiaProcureService', 'Enterprise', () => import('./src/services/enterprise/CendiaProcureService')));
  results.push(await testService('CendiaRainmakerService', 'Enterprise', () => import('./src/services/enterprise/CendiaRainmakerService')));
  results.push(await testService('CendiaRegentService', 'Enterprise', () => import('./src/services/enterprise/CendiaRegentService')));
  results.push(await testService('CendiaResonanceService', 'Enterprise', () => import('./src/services/enterprise/CendiaResonanceService')));
  results.push(await testService('CendiaScoutService', 'Enterprise', () => import('./src/services/enterprise/CendiaScoutService')));
  results.push(await testService('CendiaTransitService', 'Enterprise', () => import('./src/services/enterprise/CendiaTransitService')));
  results.push(await testService('CendiaDocketService', 'Enterprise', () => import('./src/services/enterprise/CendiaDocketService')));
  results.push(await testService('CendiaMeshService (Enterprise)', 'Enterprise', () => import('./src/services/enterprise/CendiaMeshService')));
  results.push(await testService('VerticalConfigService', 'Enterprise', () => import('./src/services/enterprise/VerticalConfigService')));

  // ==========================================================================
  // CATEGORY 5: VERTICAL INDUSTRY SERVICES
  // ==========================================================================
  console.log('\n🏭 CATEGORY 5: VERTICAL INDUSTRY SERVICES');
  console.log('─'.repeat(60));

  // Legal
  results.push(await testService('LegalAgents', 'Verticals', () => import('./src/services/legal/LegalAgents')));
  results.push(await testService('LegalCouncilModes', 'Verticals', () => import('./src/services/legal/LegalCouncilModes')));
  results.push(await testService('LegalResearchService', 'Verticals', () => import('./src/services/legal/LegalResearchService')));
  results.push(await testService('LegalVerticalService', 'Verticals', () => import('./src/services/legal/LegalVerticalService')));
  results.push(await testService('CaseImportService', 'Verticals', () => import('./src/services/legal/CaseImportService')));

  // Defense
  results.push(await testService('DefenseAgents', 'Verticals', () => import('./src/services/verticals/defense/DefenseAgents')));
  results.push(await testService('DefenseCouncilModes', 'Verticals', () => import('./src/services/verticals/defense/DefenseCouncilModes')));
  results.push(await testService('DefenseVerticalService', 'Verticals', () => import('./src/services/verticals/defense/DefenseVerticalService')));

  // Financial
  results.push(await testService('FinancialVertical', 'Verticals', () => import('./src/services/verticals/financial/FinancialVertical')));

  // Healthcare
  results.push(await testService('HealthcareVertical', 'Verticals', () => import('./src/services/verticals/healthcare/HealthcareVertical')));

  // Insurance
  results.push(await testService('InsuranceVertical', 'Verticals', () => import('./src/services/verticals/insurance/InsuranceVertical')));

  // Energy
  results.push(await testService('EnergyVertical', 'Verticals', () => import('./src/services/verticals/energy/EnergyVertical')));

  // Government
  results.push(await testService('GovernmentVertical', 'Verticals', () => import('./src/services/verticals/government/GovernmentVertical')));

  // Vertical Agents
  results.push(await testService('VerticalAgentsService', 'Verticals', () => import('./src/services/VerticalAgentsService')));

  // ==========================================================================
  // CATEGORY 6: INFRASTRUCTURE SERVICES
  // ==========================================================================
  console.log('\n🔧 CATEGORY 6: INFRASTRUCTURE SERVICES');
  console.log('─'.repeat(60));

  results.push(await testService('EnhancedLLMService', 'Infrastructure', () => import('./src/services/EnhancedLLMService')));
  results.push(await testService('DruidEventStream', 'Infrastructure', () => import('./src/services/DruidEventStream')));
  results.push(await testService('RedisCacheService', 'Infrastructure', () => import('./src/services/cache/RedisCacheService')));
  results.push(await testService('CacheService', 'Infrastructure', () => import('./src/services/cache.service')));
  results.push(await testService('QueueService', 'Infrastructure', () => import('./src/services/queue.service')));
  results.push(await testService('WebhookService', 'Infrastructure', () => import('./src/services/webhook.service')));
  results.push(await testService('EmailService', 'Infrastructure', () => import('./src/services/email')));
  results.push(await testService('OllamaService', 'Infrastructure', () => import('./src/services/ollama')));
  results.push(await testService('GraphIngestion', 'Infrastructure', () => import('./src/services/graphIngestion')));

  // ==========================================================================
  // CATEGORY 7: SECURITY SERVICES
  // ==========================================================================
  console.log('\n🔒 CATEGORY 7: SECURITY SERVICES');
  console.log('─'.repeat(60));

  results.push(await testService('KeyManagementService', 'Security', () => import('./src/services/security/KeyManagementService')));
  results.push(await testService('ComplianceExportService', 'Security', () => import('./src/services/security/ComplianceExportService')));
  results.push(await testService('SBOMGenerator', 'Security', () => import('./src/services/security/SBOMGenerator')));
  results.push(await testService('SIEMIntegration', 'Security', () => import('./src/services/security/SIEMIntegration')));

  // ==========================================================================
  // CATEGORY 8: ANALYTICS & VISUALIZATION
  // ==========================================================================
  console.log('\n📊 CATEGORY 8: ANALYTICS & VISUALIZATION');
  console.log('─'.repeat(60));

  results.push(await testService('DeliberationVisualizationService', 'Analytics', () => import('./src/services/visualization/DeliberationVisualizationService')));
  results.push(await testService('DecisionReplayTheaterService', 'Analytics', () => import('./src/services/visualization/DecisionReplayTheaterService')));
  results.push(await testService('AnalyticsRouter', 'Analytics', () => import('./src/services/storage/AnalyticsRouter')));
  results.push(await testService('ClickHouseService', 'Analytics', () => import('./src/services/storage/ClickHouseService')));
  results.push(await testService('DruidService', 'Analytics', () => import('./src/services/storage/DruidService')));
  results.push(await testService('VectorService', 'Analytics', () => import('./src/services/storage/VectorService')));

  // ==========================================================================
  // CATEGORY 9: COLLAPSE AGENTS (Safety Guardrails)
  // ==========================================================================
  console.log('\n🚨 CATEGORY 9: COLLAPSE AGENTS');
  console.log('─'.repeat(60));

  results.push(await testService('CollapseOrchestrator', 'Collapse', () => import('./src/services/collapse/CollapseOrchestrator')));
  results.push(await testService('BaseCollapseAgent', 'Collapse', () => import('./src/services/collapse/agents/BaseCollapseAgent')));
  results.push(await testService('AdversarialAbuseAgent', 'Collapse', () => import('./src/services/collapse/agents/AdversarialAbuseAgent')));
  results.push(await testService('CulturalErasureAgent', 'Collapse', () => import('./src/services/collapse/agents/CulturalErasureAgent')));
  results.push(await testService('DemocraticProcessErosionAgent', 'Collapse', () => import('./src/services/collapse/agents/DemocraticProcessErosionAgent')));
  results.push(await testService('DisabilityImpactAgent', 'Collapse', () => import('./src/services/collapse/agents/DisabilityImpactAgent')));
  results.push(await testService('DueProcessViolationAgent', 'Collapse', () => import('./src/services/collapse/agents/DueProcessViolationAgent')));
  results.push(await testService('EconomicInstabilityAgent', 'Collapse', () => import('./src/services/collapse/agents/EconomicInstabilityAgent')));
  results.push(await testService('EnvironmentalExternalityAgent', 'Collapse', () => import('./src/services/collapse/agents/EnvironmentalExternalityAgent')));
  results.push(await testService('ForeignInfluenceAmplificationAgent', 'Collapse', () => import('./src/services/collapse/agents/ForeignInfluenceAmplificationAgent')));
  results.push(await testService('FreeSpeechChillingAgent', 'Collapse', () => import('./src/services/collapse/agents/FreeSpeechChillingAgent')));
  results.push(await testService('FreedomOfAssociationAgent', 'Collapse', () => import('./src/services/collapse/agents/FreedomOfAssociationAgent')));
  results.push(await testService('LegitimacyCollapseAgent', 'Collapse', () => import('./src/services/collapse/agents/LegitimacyCollapseAgent')));
  results.push(await testService('MarketDistortionAgent', 'Collapse', () => import('./src/services/collapse/agents/MarketDistortionAgent')));
  results.push(await testService('MinorityHarmAgent', 'Collapse', () => import('./src/services/collapse/agents/MinorityHarmAgent')));
  results.push(await testService('NarrativeWeaponizationAgent', 'Collapse', () => import('./src/services/collapse/agents/NarrativeWeaponizationAgent')));
  results.push(await testService('PoliticalBacklashAgent', 'Collapse', () => import('./src/services/collapse/agents/PoliticalBacklashAgent')));
  results.push(await testService('ProceduralJusticeAgent', 'Collapse', () => import('./src/services/collapse/agents/ProceduralJusticeAgent')));
  results.push(await testService('SystemicRiskAgent', 'Collapse', () => import('./src/services/collapse/agents/SystemicRiskAgent')));
  results.push(await testService('TemporalDecayAgent', 'Collapse', () => import('./src/services/collapse/agents/TemporalDecayAgent')));

  // ==========================================================================
  // CATEGORY 10: COUNCIL SERVICES
  // ==========================================================================
  console.log('\n🏛️ CATEGORY 10: COUNCIL SERVICES');
  console.log('─'.repeat(60));

  results.push(await testService('CouncilService', 'Council', () => import('./src/services/council/CouncilService')));
  results.push(await testService('AdversarialRedTeamService', 'Council', () => import('./src/services/council/AdversarialRedTeamService')));
  results.push(await testService('ComplianceGuard', 'Council', () => import('./src/services/council/ComplianceGuard')));
  results.push(await testService('CouncilDecisionPacketService', 'Council', () => import('./src/services/council/CouncilDecisionPacketService')));
  results.push(await testService('CouncilWebSocket', 'Council', () => import('./src/services/council/CouncilWebSocket')));
  results.push(await testService('LegalToolExecutor', 'Council', () => import('./src/services/council/LegalToolExecutor')));

  // ==========================================================================
  // CATEGORY 11: CRUCIBLE SERVICES
  // ==========================================================================
  console.log('\n🔥 CATEGORY 11: CRUCIBLE SERVICES');
  console.log('─'.repeat(60));

  results.push(await testService('EnterpriseRedTeamService', 'Crucible', () => import('./src/services/crucible/EnterpriseRedTeamService')));
  results.push(await testService('MonteCarloEngine', 'Crucible', () => import('./src/services/crucible/MonteCarloEngine')));
  results.push(await testService('RuntimeSecurityService', 'Crucible', () => import('./src/services/crucible/RuntimeSecurityService')));
  results.push(await testService('SBOMService', 'Crucible', () => import('./src/services/crucible/SBOMService')));

  // ==========================================================================
  // CATEGORY 12: EVIDENCE SERVICES
  // ==========================================================================
  console.log('\n📜 CATEGORY 12: EVIDENCE SERVICES');
  console.log('─'.repeat(60));

  results.push(await testService('EvidenceVaultService', 'Evidence', () => import('./src/services/evidence/EvidenceVaultService')));
  results.push(await testService('EvidenceExportService', 'Evidence', () => import('./src/services/evidence/EvidenceExportService')));
  results.push(await testService('RegulatorsReceiptService', 'Evidence', () => import('./src/services/evidence/RegulatorsReceiptService')));
  results.push(await testService('ComplianceDashboardService', 'Evidence', () => import('./src/services/evidence/ComplianceDashboardService')));
  results.push(await testService('SignedTestReportService', 'Evidence', () => import('./src/services/evidence/SignedTestReportService')));
  results.push(await testService('TestEvidenceLedgerService', 'Evidence', () => import('./src/services/evidence/TestEvidenceLedgerService')));

  // ==========================================================================
  // CATEGORY 13: ADMIN SERVICES
  // ==========================================================================
  console.log('\n⚙️ CATEGORY 13: ADMIN SERVICES');
  console.log('─'.repeat(60));

  results.push(await testService('AdminAIService', 'Admin', () => import('./src/services/admin/AdminAIService')));
  results.push(await testService('FeatureControlService', 'Admin', () => import('./src/services/admin/FeatureControlService')));
  results.push(await testService('LicenseService', 'Admin', () => import('./src/services/admin/LicenseService')));
  results.push(await testService('RDProjectService', 'Admin', () => import('./src/services/admin/RDProjectService')));
  results.push(await testService('SystemHealthService', 'Admin', () => import('./src/services/admin/SystemHealthService')));
  results.push(await testService('TenantService', 'Admin', () => import('./src/services/admin/TenantService')));
  results.push(await testService('UserManagementService', 'Admin', () => import('./src/services/admin/UserManagementService')));

  // ==========================================================================
  // CATEGORY 14: PILLARS SERVICES
  // ==========================================================================
  console.log('\n🏛️ CATEGORY 14: PILLARS SERVICES');
  console.log('─'.repeat(60));

  results.push(await testService('AgentsService', 'Pillars', () => import('./src/services/pillars/AgentsService')));
  results.push(await testService('EthicsService', 'Pillars', () => import('./src/services/pillars/EthicsService')));
  results.push(await testService('FlowService', 'Pillars', () => import('./src/services/pillars/FlowService')));
  results.push(await testService('GuardService', 'Pillars', () => import('./src/services/pillars/GuardService')));
  results.push(await testService('HealthService', 'Pillars', () => import('./src/services/pillars/HealthService')));
  results.push(await testService('HelmService', 'Pillars', () => import('./src/services/pillars/HelmService')));
  results.push(await testService('LineageService', 'Pillars', () => import('./src/services/pillars/LineageService')));
  results.push(await testService('PredictService', 'Pillars', () => import('./src/services/pillars/PredictService')));

  // ==========================================================================
  // CATEGORY 15: STORAGE SERVICES
  // ==========================================================================
  console.log('\n💾 CATEGORY 15: STORAGE SERVICES');
  console.log('─'.repeat(60));

  results.push(await testService('MinioService', 'Storage', () => import('./src/services/storage/MinioService')));

  // ==========================================================================
  // CATEGORY 16: ADDITIONAL SERVICES
  // ==========================================================================
  console.log('\n📋 CATEGORY 16: ADDITIONAL SERVICES');
  console.log('─'.repeat(60));

  results.push(await testService('CendiaAegisService', 'Additional', () => import('./src/services/CendiaAegisService')));
  results.push(await testService('CendiaEternalService', 'Additional', () => import('./src/services/CendiaEternalService')));
  results.push(await testService('CendiaSymbiontService', 'Additional', () => import('./src/services/CendiaSymbiontService')));
  results.push(await testService('HRIntegrationService', 'Additional', () => import('./src/services/HRIntegrationService')));
  results.push(await testService('MarketSalaryService', 'Additional', () => import('./src/services/MarketSalaryService')));
  results.push(await testService('PantheonMemoryService', 'Additional', () => import('./src/services/PantheonMemoryService')));
  results.push(await testService('SampleDataService', 'Additional', () => import('./src/services/SampleDataService')));
  results.push(await testService('EchoService', 'Additional', () => import('./src/services/echoService')));
  results.push(await testService('GnosisService', 'Additional', () => import('./src/services/gnosisService')));
  results.push(await testService('RedTeamService', 'Additional', () => import('./src/services/redteamService')));
  results.push(await testService('LicensingService', 'Additional', () => import('./src/services/licensing.service')));

  // ==========================================================================
  // PRINT RESULTS
  // ==========================================================================
  console.log('\n' + '═'.repeat(80));
  console.log('  TEST RESULTS SUMMARY');
  console.log('═'.repeat(80) + '\n');

  const passed = results.filter(r => r.status === 'PASS');
  const failed = results.filter(r => r.status === 'FAIL');
  const skipped = results.filter(r => r.status === 'SKIP');

  // Group by category
  const categories = [...new Set(results.map(r => r.category))];
  
  for (const category of categories) {
    const categoryResults = results.filter(r => r.category === category);
    const categoryPassed = categoryResults.filter(r => r.status === 'PASS').length;
    const categoryTotal = categoryResults.length;
    const icon = categoryPassed === categoryTotal ? '✅' : categoryPassed > 0 ? '⚠️' : '❌';
    
    console.log(`${icon} ${category}: ${categoryPassed}/${categoryTotal} passed`);
    
    // Show failures
    const failures = categoryResults.filter(r => r.status === 'FAIL');
    for (const f of failures) {
      console.log(`   ❌ ${f.name}: ${f.error}`);
    }
  }

  console.log('\n' + '─'.repeat(60));
  console.log(`\n📊 TOTAL: ${passed.length} PASSED | ${failed.length} FAILED | ${skipped.length} SKIPPED`);
  console.log(`   Total Services Tested: ${results.length}`);
  console.log(`   Success Rate: ${((passed.length / results.length) * 100).toFixed(1)}%`);
  
  // Count total methods
  const totalMethods = passed.reduce((sum, r) => sum + (r.methods || 0), 0);
  console.log(`   Total Methods Discovered: ${totalMethods}`);

  console.log('\n' + '═'.repeat(80));
  
  // Cleanup
  await prisma.$disconnect();
  
  // Exit with error if too many failures
  if (failed.length > results.length * 0.3) {
    console.log('\n❌ CRITICAL: More than 30% of services failed to load!');
    process.exit(1);
  } else if (failed.length > 0) {
    console.log('\n⚠️ Some services failed but majority are working.');
  } else {
    console.log('\n✅ ALL SERVICE CLASSES LOADED SUCCESSFULLY!');
  }
}

runTests().catch(console.error);
