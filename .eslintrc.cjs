// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// ESLINT CONFIGURATION
// TypeScript + React + Tailwind best practices
// =============================================================================

module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: [
    'dist',
    'node_modules',
    '.eslintrc.cjs',
    'vite.config.ts',
    'vitest.config.ts',
    'playwright.config.ts',
    'tailwind.config.js',
    'postcss.config.js',
    'coverage',
    'playwright-report',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'unused-imports',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // TypeScript — auto-removable unused imports/vars via eslint-plugin-unused-imports.
    // The built-in rule is disabled in favor of the plugin's auto-fixable version.
    // unused-imports/no-unused-imports is an ERROR (auto-fixable: eslint --fix
    // removes them cleanly). unused-imports/no-unused-vars stays a WARN because
    // the pre-existing inventory (~236 warnings across the tree) needs a
    // deliberate cleanup pass before it can safely become CI-blocking.
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': ['warn', {
      vars: 'all',
      varsIgnorePattern: '^_',
      args: 'after-used',
      argsIgnorePattern: '^_',
    }],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/prefer-as-const': 'error',
    
    // React
    'react/prop-types': 'off', // Using TypeScript for prop validation
    'react/display-name': 'off',
    'react/no-unescaped-entities': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // General
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    'prefer-const': 'error',
    'no-var': 'error',
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    
    // Allow for development - can be stricter later
    '@typescript-eslint/ban-ts-comment': 'warn',

    // Enterprise/Community boundary enforcement
    // Prevents community-tier code from importing enterprise-only services
    'no-restricted-imports': ['error', {
      patterns: [
        {
          group: ['*/services/enterprise/*'],
          message: 'Enterprise services cannot be imported from community-tier code. Use feature gating via SubscriptionTiers.',
        },
        {
          group: ['*/services/sovereign/*'],
          message: 'Sovereign services cannot be imported from community-tier code. Use feature gating via SubscriptionTiers.',
        },
      ],
    }],
  },
  overrides: [
    // Test files
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
    // Enterprise-tier files CAN import enterprise/sovereign services
    {
      files: [
        'backend/src/services/enterprise/**/*.ts',
        'backend/src/services/sovereign/**/*.ts',
        'backend/src/routes/enterprise/**/*.ts',
        'backend/src/routes/*enterprise*.ts',
        'backend/src/routes/*sovereign*.ts',
        'backend/prisma/seed-enterprise.ts',
      ],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
  ],
};
