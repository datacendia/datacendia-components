/* eslint-env node */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'security', 'n'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:security/recommended-legacy',
  ],
  env: {
    node: true,
    es2022: true,
  },
  ignorePatterns: [
    'dist/**',
    'node_modules/**',
    'coverage/**',
    'prisma/migrations/**',
    'src/**/*.test.ts',
    'src/**/*.spec.ts',
    'src/__tests__/**',
    'src/**/__tests__/**',
    'tests/**',
    '**/*.js',
    '**/*.cjs',
    '**/*.mjs',
  ],
  rules: {
    // TypeScript adjustments — start pragmatic, ratchet later
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
    }],
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/ban-ts-comment': ['warn', {
      'ts-expect-error': 'allow-with-description',
      'ts-ignore': true,
      'ts-nocheck': true,
      'ts-check': false,
    }],
    '@typescript-eslint/no-empty-function': 'off',

    // eslint-plugin-security — enabled via recommended; tune noisy ones
    'security/detect-object-injection': 'off', // too noisy for typed code
    'security/detect-non-literal-fs-filename': 'warn',
    'security/detect-non-literal-require': 'warn',
    'security/detect-unsafe-regex': 'error',
    'security/detect-child-process': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-buffer-noassert': 'error',

    // eslint-plugin-n — Node-specific correctness
    'n/no-deprecated-api': 'warn',
    'n/no-process-exit': 'warn',
    'n/no-sync': ['warn', { allowAtRootLevel: true }],
    // These don't play well with TS path aliases / workspaces — disable
    'n/no-missing-import': 'off',
    'n/no-unpublished-import': 'off',
    'n/no-extraneous-import': 'off',
    'n/no-unsupported-features/es-syntax': 'off',
    'n/no-unsupported-features/node-builtins': 'off',

    // General hygiene
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    'no-throw-literal': 'error',
    'prefer-const': 'warn',
  },
  overrides: [
    {
      files: ['src/config/**', 'src/index.ts', 'src/server.ts', 'src/startup/**'],
      rules: {
        'no-console': 'off',
        'n/no-process-exit': 'off',
      },
    },
    {
      files: ['scripts/**'],
      rules: {
        'no-console': 'off',
        'security/detect-non-literal-fs-filename': 'off',
      },
    },
  ],
};
