import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  // Base JS configs
  {
    name: 'js/recommended',
    ...js.configs.recommended,
  },
  // TypeScript base configs (each needs a name)
  ...tseslint.configs.recommended.map((config, i) => ({
    name: `tseslint/recommended/${i}`,
    ...config,
  })),
  // TypeScript type-checked configs - only for TS/TSX files
  {
    name: 'tseslint/recommended-type-checked',
    files: ['**/*.{ts,tsx}'],
    ...tseslint.configs.recommendedTypeChecked.reduce((acc, config) => ({ ...acc, ...config }), {}),
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        project: ['./tsconfig.base.json', './apps/*/tsconfig.json', './packages/*/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-misused-promises': 'warn',
      '@typescript-eslint/require-await': 'warn',
    },
  },
  // Prettier for all files
  {
    name: 'prettier',
    ...prettierConfig,
  },
  // Config files (JS/TS) — disable type-checked
  {
    name: 'config-files/no-type-checked',
    files: ['*.config.*', '*.config.js', '*.config.ts', 'eslint.config.js'],
    ...tseslint.configs.disableTypeChecked,
  },
  // Ignore patterns
  {
    name: 'ignores',
    ignores: ['node_modules', '**/dist', '**/build', '.turbo'],
  }
);
