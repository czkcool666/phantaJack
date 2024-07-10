// eslint.config.js
const { FlatCompat } = require('@eslint/eslintrc');
const compat = new FlatCompat();

module.exports = [
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    ignores: ['node_modules/**'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        browser: true,
        es2021: true,
        node: true,
      },
    },
    plugins: {
      react: require('eslint-plugin-react'),
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      // Add more rules as needed
    },
  },
  ...compat.extends('eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended'),
];
