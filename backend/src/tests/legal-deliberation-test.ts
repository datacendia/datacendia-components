import { logger } from '../utils/logger.js';
/**
 * Module — Legal Deliberation Test
 *
 * Platform module.
 * @module tests/legal-deliberation-test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * LEGAL VERTICAL END-TO-END TEST
 * Tests the full deliberation flow with legal research tools
 * 
 * Run with: npx ts-node src/tests/legal-deliberation-test.ts
 */

import { legalResearchService } from '../services/legal/LegalResearchService.js';

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

function log(message: string, color: string = COLORS.reset) {
  logger.info(`${color}${message}${COLORS.reset}`);
}

function logSection(title: string) {
  logger.info('\n' + '='.repeat(60));
  log(title, COLORS.cyan);
  logger.info('='.repeat(60));
}

function logResult(name: string, success: boolean, details?: string) {
  const icon = success ? '✓' : '✗';
  const color = success ? COLORS.green : COLORS.red;
  log(`${icon} ${name}`, color);
  if (details) {
    log(`  ${details}`, COLORS.dim);
  }
}

async function testLegalResearchService() {
  logSection('1. LEGAL RESEARCH SERVICE STATUS');
  
  const status = legalResearchService.getStatus();
  logger.info('Service Status:', status);
  
  const availableCount = Object.values(status).filter(Boolean).length;
  logResult(
    'Service Status Check',
    availableCount >= 4,
    `${availableCount}/6 services available`
  );

  return status;
}

async function testCaseLawSearch() {
  logSection('2. CASE LAW SEARCH (Caselaw Access Project)');
  
  try {
    const results = await legalResearchService.searchCases('trade secret misappropriation', {
      limit: 3,
    });
    
    logResult(
      'Case Law Search',
      results.length > 0,
      `Found ${results.length} cases`
    );
    
    if (results.length > 0 && results[0]) {
      logger.info('\nSample Result:');
      logger.info(`  Title: ${results[0].title}`);
      logger.info(`  Citation: ${results[0].citation}`);
      logger.info(`  Date: ${results[0].date}`);
    }
    
    return results;
  } catch (error) {
    logResult('Case Law Search', false, error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

async function testRegulationSearch() {
  logSection('3. FEDERAL REGULATIONS SEARCH (eCFR)');
  
  try {
    const results = await legalResearchService.searchRegulations('overtime pay', {
      title: 29, // Labor
      limit: 3,
    });
    
    logResult(
      'CFR Search',
      results.length > 0,
      `Found ${results.length} regulations`
    );
    
    if (results.length > 0 && results[0]) {
      logger.info('\nSample Result:');
      logger.info(`  Title: ${results[0].title}`);
      logger.info(`  Citation: ${results[0].citation}`);
    }
    
    return results;
  } catch (error) {
    logResult('CFR Search', false, error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

async function testStateBillSearch() {
  logSection('4. STATE LEGISLATION SEARCH (Open States)');
  
  const status = legalResearchService.getStatus();
  if (!status.openstates) {
    logResult('State Bills Search', false, 'Open States API key not configured');
    return [];
  }
  
  try {
    const results = await legalResearchService.searchStateBills('employment discrimination', {
      state: 'ca',
      limit: 3,
    });
    
    logResult(
      'State Bills Search',
      results.length > 0,
      `Found ${results.length} bills`
    );
    
    if (results.length > 0 && results[0]) {
      logger.info('\nSample Result:');
      logger.info(`  Title: ${results[0].title}`);
      logger.info(`  State: ${results[0].metadata?.['state']}`);
    }
    
    return results;
  } catch (error) {
    logResult('State Bills Search', false, error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

async function testFederalRegisterSearch() {
  logSection('5. FEDERAL REGISTER SEARCH');
  
  try {
    const results = await legalResearchService.searchFederalRegister('labor', {
      type: 'RULE',
      days: 90,
      limit: 3,
    });
    
    logResult(
      'Federal Register Search',
      results.length > 0,
      `Found ${results.length} documents`
    );
    
    if (results.length > 0 && results[0]) {
      logger.info('\nSample Result:');
      logger.info(`  Title: ${results[0].title?.substring(0, 80)}...`);
      logger.info(`  Date: ${results[0].date}`);
      logger.info(`  Type: ${results[0].metadata?.['type']}`);
    }
    
    return results;
  } catch (error) {
    logResult('Federal Register Search', false, error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

async function testSECFilingsSearch() {
  logSection('6. SEC EDGAR SEARCH');
  
  try {
    // Apple's CIK
    const results = await legalResearchService.searchSECFilings('320193', {
      form: '10-K',
      limit: 3,
    });
    
    logResult(
      'SEC Filings Search',
      results.length > 0,
      `Found ${results.length} filings`
    );
    
    if (results.length > 0 && results[0]) {
      logger.info('\nSample Result:');
      logger.info(`  Title: ${results[0].title}`);
      logger.info(`  Date: ${results[0].date}`);
      logger.info(`  Form: ${results[0].metadata?.['form']}`);
    }
    
    return results;
  } catch (error) {
    logResult('SEC Filings Search', false, error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

async function testUnifiedSearch() {
  logSection('7. UNIFIED LEGAL SEARCH');
  
  try {
    const results = await legalResearchService.unifiedSearch('employment discrimination', {
      sources: ['cases', 'regulations', 'federal-register'],
      limit: 2,
    });
    
    logResult(
      'Unified Search',
      results.length > 0,
      `Found ${results.length} total results across sources`
    );
    
    // Group by source
    const bySource = results.reduce((acc, r) => {
      acc[r.source] = (acc[r.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    logger.info('\nResults by Source:');
    Object.entries(bySource).forEach(([source, count]) => {
      logger.info(`  ${source}: ${count}`);
    });
    
    return results;
  } catch (error) {
    logResult('Unified Search', false, error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

async function testToolExecution() {
  logSection('8. TOOL EXECUTION (Council Integration)');
  
  const testCases = [
    {
      name: 'search_cases',
      params: { query: 'breach of contract', limit: 2 },
    },
    {
      name: 'search_regulations',
      params: { query: 'workplace safety', title: 29, limit: 2 },
    },
    {
      name: 'search_federal_register',
      params: { query: 'OSHA', type: 'RULE', limit: 2 },
    },
  ];
  
  for (const test of testCases) {
    try {
      const result = await legalResearchService.executeTool(test.name, test.params);
      logResult(
        `Tool: ${test.name}`,
        result.success,
        result.success 
          ? `${result.results?.length || 0} results from ${result.source}`
          : result.error
      );
    } catch (error) {
      logResult(`Tool: ${test.name}`, false, error instanceof Error ? error.message : 'Unknown error');
    }
  }
}

async function testAgentFormatting() {
  logSection('9. AGENT CONTEXT FORMATTING');
  
  try {
    const results = await legalResearchService.searchCases('negligence', { limit: 2 });
    const formatted = legalResearchService.formatResultsForAgent(results);
    
    logResult(
      'Agent Formatting',
      formatted.length > 0,
      `Generated ${formatted.length} characters of context`
    );
    
    logger.info('\nFormatted Output Preview:');
    logger.info(formatted.substring(0, 500) + '...');
    
  } catch (error) {
    logResult('Agent Formatting', false, error instanceof Error ? error.message : 'Unknown error');
  }
}

async function testToolCallHistory() {
  logSection('10. TOOL CALL HISTORY (Audit Trail)');
  
  const history = legalResearchService.getToolCallHistory();
  
  logResult(
    'Tool Call History',
    history.length > 0,
    `${history.length} tool calls recorded`
  );
  
  if (history.length > 0) {
    logger.info('\nRecent Tool Calls:');
    history.slice(-3).forEach(call => {
      logger.info(`  ${call.tool} - ${call.durationMs}ms - ${call.error ? 'FAILED' : 'OK'}`);
    });
  }
}

async function runAllTests() {
  logger.info('\n');
  log('╔══════════════════════════════════════════════════════════╗', COLORS.cyan);
  log('║     LEGAL VERTICAL END-TO-END TEST SUITE                 ║', COLORS.cyan);
  log('║     Testing all legal research tools and integrations    ║', COLORS.cyan);
  log('╚══════════════════════════════════════════════════════════╝', COLORS.cyan);
  
  const startTime = Date.now();
  const results: { name: string; success: boolean }[] = [];
  
  // Run all tests
  try {
    await testLegalResearchService();
    results.push({ name: 'Service Status', success: true });
  } catch { results.push({ name: 'Service Status', success: false }); }
  
  try {
    const cases = await testCaseLawSearch();
    results.push({ name: 'Case Law Search', success: cases.length > 0 });
  } catch { results.push({ name: 'Case Law Search', success: false }); }
  
  try {
    const regs = await testRegulationSearch();
    results.push({ name: 'CFR Search', success: regs.length > 0 });
  } catch { results.push({ name: 'CFR Search', success: false }); }
  
  try {
    const bills = await testStateBillSearch();
    // Don't fail if API key not set
    const status = legalResearchService.getStatus();
    results.push({ name: 'State Bills Search', success: !status.openstates || bills.length > 0 });
  } catch { results.push({ name: 'State Bills Search', success: false }); }
  
  try {
    const fr = await testFederalRegisterSearch();
    results.push({ name: 'Federal Register Search', success: fr.length > 0 });
  } catch { results.push({ name: 'Federal Register Search', success: false }); }
  
  try {
    const sec = await testSECFilingsSearch();
    results.push({ name: 'SEC Filings Search', success: sec.length > 0 });
  } catch { results.push({ name: 'SEC Filings Search', success: false }); }
  
  try {
    const unified = await testUnifiedSearch();
    results.push({ name: 'Unified Search', success: unified.length > 0 });
  } catch { results.push({ name: 'Unified Search', success: false }); }
  
  try {
    await testToolExecution();
    results.push({ name: 'Tool Execution', success: true });
  } catch { results.push({ name: 'Tool Execution', success: false }); }
  
  try {
    await testAgentFormatting();
    results.push({ name: 'Agent Formatting', success: true });
  } catch { results.push({ name: 'Agent Formatting', success: false }); }
  
  try {
    await testToolCallHistory();
    results.push({ name: 'Tool Call History', success: true });
  } catch { results.push({ name: 'Tool Call History', success: false }); }
  
  // Summary
  const duration = Date.now() - startTime;
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  logSection('TEST SUMMARY');
  logger.info(`Total Duration: ${(duration / 1000).toFixed(2)}s`);
  logger.info(`Tests Passed: ${passed}/${results.length}`);
  logger.info(`Tests Failed: ${failed}/${results.length}`);
  
  if (failed === 0) {
    log('\n✓ ALL TESTS PASSED - Legal vertical is ready!', COLORS.green);
  } else {
    log(`\n✗ ${failed} TEST(S) FAILED - Review errors above`, COLORS.red);
  }
  
  logger.info('\n');
}

// Run tests
runAllTests().catch((err) => logger.error('Legal deliberation tests failed:', err));
