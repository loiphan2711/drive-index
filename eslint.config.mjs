import antfu from '@antfu/eslint-config';
import eslintConfigPrettier from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier';

export default antfu(
  {
    react: true,
    nextjs: true,
    typescript: true,

    // Configuration preferences
    lessOpinionated: true,
    isInEditor: false,

    // Code style
    stylistic: {
      semi: true,
    },

    // Format settings
    formatters: {
      css: true,
    },

    // Ignored paths
    ignores: [
      'src/migrations/**/*',
      'src/payload-types.ts',
      'src/app/(payload)/admin/importMap.js',
      'src/**/*.scss',
    ],
  },
  // --- Accessibility Rules ---
  jsxA11y.flatConfigs.recommended,
  // --- E2E Testing Rules ---
  {
    files: ['**/*.spec.ts', '**/*.e2e.ts'],
  },
  // --- Prettier Rules ---
  eslintConfigPrettier,
  {
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'warn',
    },
  },
  // --- Custom Rule Overrides ---
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'antfu/no-top-level-await': 'off', // Allow top-level await
      'style/brace-style': ['error', '1tbs'], // Use the default brace style
      'ts/consistent-type-definitions': ['error', 'type'], // Use `type` instead of `interface`
      'react/prefer-destructuring-assignment': 'off', // Vscode doesn't support automatically destructuring, it's a pain to add a new variable
      'node/prefer-global/process': 'off', // Allow using `process.env`
      'test/padding-around-all': 'error', // Add padding in test files
      'test/prefer-lowercase-title': 'off', // Allow using uppercase titles in test titles,
      'react/no-array-index-key': 'off',
      'react-hooks-extra/no-direct-set-state-in-use-effect': 'off',
    },
  },
);
