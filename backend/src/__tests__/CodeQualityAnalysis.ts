/**
 * Module — Code Quality Analysis
 *
 * Platform module.
 *
 * @exports generateReport, ValidationTests
 * @module __tests__/CodeQualityAnalysis
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * CODE QUALITY ANALYSIS & AUTOMATED TESTS
 * =============================================================================
 * 
 * Static analysis and quality validation for the entire codebase
 */

import * as fs from 'fs';
import * as path from 'path';

interface Issue {
  file: string;
  line?: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  message: string;
  recommendation: string;
}

interface AnalysisResult {
  totalFiles: number;
  analyzedFiles: number;
  issues: Issue[];
  metrics: {
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    codeQualityScore: number;
    securityScore: number;
    maintainabilityScore: number;
  };
}

const issues: Issue[] = [];

// =============================================================================
// SECURITY PATTERNS TO DETECT
// =============================================================================

const DANGEROUS_PATTERNS = {
  // Direct req.body access without validation
  UNVALIDATED_INPUT: {
    pattern: /const\s*\{[^}]+\}\s*=\s*req\.body(?!\s*;?\s*\/\*\s*validated)/g,
    severity: 'HIGH' as const,
    category: 'Security',
    message: 'Direct destructuring from req.body without Zod validation',
    recommendation: 'Use Zod schema validation before destructuring',
  },

  // SQL/Cypher string interpolation
  INJECTION_RISK: {
    pattern: /`[^`]*\$\{[^}]+\}[^`]*`.*(?:query|sql|cypher)/gi,
    severity: 'CRITICAL' as const,
    category: 'Security',
    message: 'String interpolation in database query - potential injection',
    recommendation: 'Use parameterized queries',
  },

  // Hardcoded secrets
  HARDCODED_SECRET: {
    pattern: /(password|secret|key|token|apikey)\s*[:=]\s*['"][^'"]{8,}['"]/gi,
    severity: 'CRITICAL' as const,
    category: 'Security',
    message: 'Hardcoded credential detected',
    recommendation: 'Move to environment variables or secrets manager',
  },

  // Console.log in production code
  CONSOLE_LOG: {
    pattern: /console\.(log|debug|info)\(/g,
    severity: 'LOW' as const,
    category: 'Code Quality',
    message: 'Console statement found - use proper logger',
    recommendation: 'Replace with logger.info() or logger.debug()',
  },

  // TODO/FIXME comments
  TODO_FIXME: {
    pattern: /\/\/\s*(TODO|FIXME|HACK|XXX):/gi,
    severity: 'LOW' as const,
    category: 'Technical Debt',
    message: 'TODO/FIXME comment found',
    recommendation: 'Create ticket and resolve',
  },

  // Unsafe eval
  EVAL_USAGE: {
    pattern: /\beval\s*\(/g,
    severity: 'CRITICAL' as const,
    category: 'Security',
    message: 'eval() usage detected - code injection risk',
    recommendation: 'Remove eval() and use safe alternatives',
  },

  // Any type usage
  ANY_TYPE: {
    pattern: /:\s*any\b/g,
    severity: 'MEDIUM' as const,
    category: 'Type Safety',
    message: 'any type used - reduces type safety',
    recommendation: 'Define proper interface/type',
  },

  // Error swallowing
  EMPTY_CATCH: {
    pattern: /catch\s*\([^)]*\)\s*\{\s*\}/g,
    severity: 'MEDIUM' as const,
    category: 'Error Handling',
    message: 'Empty catch block swallows errors',
    recommendation: 'Log error or rethrow',
  },

  // Unsafe type assertion
  TYPE_ASSERTION: {
    pattern: /as\s+any\b/g,
    severity: 'MEDIUM' as const,
    category: 'Type Safety',
    message: 'Type assertion to any bypasses type checking',
    recommendation: 'Use proper type guards or interfaces',
  },

  // Missing await
  MISSING_AWAIT: {
    pattern: /(?<!await\s)(?:fetch|axios|prisma|redis)\.\w+\([^)]*\)(?!\s*\.then)/g,
    severity: 'HIGH' as const,
    category: 'Async',
    message: 'Async call may be missing await',
    recommendation: 'Add await for async operations',
  },
};

// =============================================================================
// CODE METRICS
// =============================================================================

interface FileMetrics {
  lines: number;
  functions: number;
  classes: number;
  imports: number;
  exports: number;
  comments: number;
  complexity: number;
}

function calculateFileMetrics(content: string): FileMetrics {
  const lines = content.split('\n').length;
  const functions = (content.match(/function\s+\w+|=>\s*{|async\s+\(/g) || []).length;
  const classes = (content.match(/class\s+\w+/g) || []).length;
  const imports = (content.match(/import\s+/g) || []).length;
  const exports = (content.match(/export\s+/g) || []).length;
  const comments = (content.match(/\/\/|\/\*|\*\//g) || []).length;
  
  // Simple cyclomatic complexity approximation
  const complexity = (content.match(/if\s*\(|else\s*{|\?\s*:|while\s*\(|for\s*\(|switch\s*\(|&&|\|\|/g) || []).length;

  return { lines, functions, classes, imports, exports, comments, complexity };
}

// =============================================================================
// ANALYSIS FUNCTIONS
// =============================================================================

function analyzeFile(filePath: string, content: string): void {
  const relativePath = filePath.replace(process.cwd(), '');

  for (const [name, config] of Object.entries(DANGEROUS_PATTERNS)) {
    const matches = content.match(config.pattern);
    if (matches) {
      // Find line numbers
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (config.pattern.test(lines[i])) {
          issues.push({
            file: relativePath,
            line: i + 1,
            severity: config.severity,
            category: config.category,
            message: config.message,
            recommendation: config.recommendation,
          });
        }
        // Reset regex state
        config.pattern.lastIndex = 0;
      }
    }
  }
}

function scanDirectory(dir: string, extensions: string[]): string[] {
  const files: string[] = [];
  
  function walk(currentPath: string) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      
      if (entry.isDirectory()) {
        if (!entry.name.includes('node_modules') && !entry.name.startsWith('.')) {
          walk(fullPath);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  walk(dir);
  return files;
}

// =============================================================================
// SPECIFIC VALIDATION TESTS
// =============================================================================

export const ValidationTests = {
  /**
   * Test: All routes have Zod validation
   */
  testRouteValidation(): { pass: boolean; details: string[] } {
    const details: string[] = [];
    const routesDir = path.join(__dirname, '../../routes');
    
    if (!fs.existsSync(routesDir)) {
      return { pass: false, details: ['Routes directory not found'] };
    }

    const routeFiles = fs.readdirSync(routesDir).filter(f => f.endsWith('.ts'));
    let pass = true;

    for (const file of routeFiles) {
      const content = fs.readFileSync(path.join(routesDir, file), 'utf-8');
      
      // Check if file uses req.body
      if (content.includes('req.body')) {
        // Check if it imports zod
        if (!content.includes("from 'zod'") && !content.includes('from "zod"')) {
          pass = false;
          details.push(`${file}: Uses req.body but doesn't import Zod`);
        }
        
        // Check for direct destructuring without parse
        const unsafePattern = /const\s*\{[^}]+\}\s*=\s*req\.body;/g;
        if (unsafePattern.test(content)) {
          pass = false;
          details.push(`${file}: Direct destructuring from req.body without validation`);
        }
      }
    }

    return { pass, details };
  },

  /**
   * Test: No hardcoded credentials
   */
  testNoHardcodedCredentials(): { pass: boolean; details: string[] } {
    const details: string[] = [];
    let pass = true;

    const sensitivePatterns = [
      /password\s*[:=]\s*['"][^'"]+['"]/gi,
      /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/gi,
      /secret\s*[:=]\s*['"][^'"]+['"]/gi,
      /token\s*[:=]\s*['"][^'"]+['"]/gi,
      /Bearer\s+[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,
    ];

    const files = scanDirectory(path.join(__dirname, '../..'), ['.ts', '.js']);

    for (const file of files) {
      if (file.includes('.test.') || file.includes('.spec.')) continue;
      
      const content = fs.readFileSync(file, 'utf-8');
      
      for (const pattern of sensitivePatterns) {
        if (pattern.test(content)) {
          pass = false;
          details.push(`Potential credential in: ${file}`);
          break;
        }
        pattern.lastIndex = 0;
      }
    }

    return { pass, details };
  },

  /**
   * Test: Error handlers don't expose stack traces
   */
  testErrorHandling(): { pass: boolean; details: string[] } {
    const details: string[] = [];
    let pass = true;

    const files = scanDirectory(path.join(__dirname, '../..'), ['.ts']);

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      
      // Check for stack trace exposure
      if (content.includes('error.stack') && content.includes('res.json')) {
        if (!content.includes('NODE_ENV') && !content.includes("'production'")) {
          pass = false;
          details.push(`${file}: May expose stack trace in response`);
        }
      }
    }

    return { pass, details };
  },

  /**
   * Test: All async functions have error handling
   */
  testAsyncErrorHandling(): { pass: boolean; details: string[] } {
    const details: string[] = [];
    let pass = true;

    const files = scanDirectory(path.join(__dirname, '../../routes'), ['.ts']);

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      
      // Find async route handlers without try-catch
      const asyncHandlerPattern = /router\.\w+\([^,]+,\s*async\s*\([^)]*\)\s*=>\s*\{(?![\s\S]*try\s*\{)/g;
      
      if (asyncHandlerPattern.test(content)) {
        pass = false;
        details.push(`${file}: Async handler may be missing try-catch`);
      }
    }

    return { pass, details };
  },

  /**
   * Test: SQL queries are parameterized
   */
  testSqlParameterization(): { pass: boolean; details: string[] } {
    const details: string[] = [];
    let pass = true;

    const files = scanDirectory(path.join(__dirname, '../..'), ['.ts']);

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      
      // Check for string interpolation in SQL-like queries
      const unsafeSqlPattern = /`[^`]*SELECT[^`]*\$\{[^}]+\}[^`]*`/gi;
      
      if (unsafeSqlPattern.test(content)) {
        pass = false;
        details.push(`${file}: Potential SQL injection via string interpolation`);
      }
    }

    return { pass, details };
  },

  /**
   * Test: Authentication is required on sensitive routes
   */
  testAuthenticationRequired(): { pass: boolean; details: string[] } {
    const details: string[] = [];
    let pass = true;

    const sensitiveRoutes = [
      '/users',
      '/organizations',
      '/admin',
      '/settings',
      '/export',
      '/delete',
    ];

    const files = scanDirectory(path.join(__dirname, '../../routes'), ['.ts']);

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      
      for (const route of sensitiveRoutes) {
        if (content.includes(route)) {
          if (!content.includes('authenticate') && !content.includes('requireAuth')) {
            pass = false;
            details.push(`${file}: Contains ${route} but may not require auth`);
          }
        }
      }
    }

    return { pass, details };
  },

  /**
   * Test: Rate limiting on authentication endpoints
   */
  testRateLimiting(): { pass: boolean; details: string[] } {
    const details: string[] = [];
    let pass = true;

    const authFile = path.join(__dirname, '../../routes/auth.ts');
    
    if (fs.existsSync(authFile)) {
      const content = fs.readFileSync(authFile, 'utf-8');
      
      if (!content.includes('rateLimit') && !content.includes('rateLimiter')) {
        pass = false;
        details.push('auth.ts: No rate limiting found on authentication routes');
      }
    }

    return { pass, details };
  },
};

// =============================================================================
// RUN ANALYSIS
// =============================================================================

export async function runFullAnalysis(): Promise<AnalysisResult> {
  const srcDir = path.join(__dirname, '../..');
  const files = scanDirectory(srcDir, ['.ts', '.tsx', '.js', '.jsx']);

  for (const file of files) {
    if (file.includes('node_modules')) continue;
    
    try {
      const content = fs.readFileSync(file, 'utf-8');
      analyzeFile(file, content);
    } catch (e) {
      // Skip unreadable files
    }
  }

  // Calculate scores
  const criticalCount = issues.filter(i => i.severity === 'CRITICAL').length;
  const highCount = issues.filter(i => i.severity === 'HIGH').length;
  const mediumCount = issues.filter(i => i.severity === 'MEDIUM').length;
  const lowCount = issues.filter(i => i.severity === 'LOW').length;

  const totalWeight = criticalCount * 10 + highCount * 5 + mediumCount * 2 + lowCount * 1;
  const maxScore = 100;
  const codeQualityScore = Math.max(0, maxScore - totalWeight);

  const securityIssues = issues.filter(i => i.category === 'Security').length;
  const securityScore = Math.max(0, 100 - securityIssues * 15);

  const techDebtIssues = issues.filter(i => i.category === 'Technical Debt').length;
  const maintainabilityScore = Math.max(0, 100 - techDebtIssues * 5);

  return {
    totalFiles: files.length,
    analyzedFiles: files.filter(f => !f.includes('node_modules')).length,
    issues,
    metrics: {
      criticalCount,
      highCount,
      mediumCount,
      lowCount,
      codeQualityScore,
      securityScore,
      maintainabilityScore,
    },
  };
}

// =============================================================================
// GENERATE REPORT
// =============================================================================

export function generateReport(result: AnalysisResult): string {
  let report = '# CODE QUALITY ANALYSIS REPORT\n\n';
  report += `Generated: ${new Date().toISOString()}\n\n`;
  
  report += '## Summary\n\n';
  report += `- Total Files: ${result.totalFiles}\n`;
  report += `- Analyzed: ${result.analyzedFiles}\n`;
  report += `- Issues Found: ${result.issues.length}\n\n`;
  
  report += '## Scores\n\n';
  report += `- Code Quality: ${result.metrics.codeQualityScore}/100\n`;
  report += `- Security: ${result.metrics.securityScore}/100\n`;
  report += `- Maintainability: ${result.metrics.maintainabilityScore}/100\n\n`;
  
  report += '## Issues by Severity\n\n';
  report += `- 🔴 Critical: ${result.metrics.criticalCount}\n`;
  report += `- 🟠 High: ${result.metrics.highCount}\n`;
  report += `- 🟡 Medium: ${result.metrics.mediumCount}\n`;
  report += `- 🟢 Low: ${result.metrics.lowCount}\n\n`;
  
  if (result.metrics.criticalCount > 0) {
    report += '## Critical Issues\n\n';
    for (const issue of result.issues.filter(i => i.severity === 'CRITICAL')) {
      report += `### ${issue.file}:${issue.line || '?'}\n`;
      report += `**${issue.message}**\n`;
      report += `Category: ${issue.category}\n`;
      report += `Recommendation: ${issue.recommendation}\n\n`;
    }
  }
  
  return report;
}
