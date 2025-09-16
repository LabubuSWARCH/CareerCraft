const typescriptPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = [
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],

    ignores: ['node_modules/**', 'dist/**', 'build/**', 'pkg/grpc/generated/**'],

    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },

    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },

    rules: {
      ...typescriptPlugin.configs.recommended.rules,
    },
  },
];
