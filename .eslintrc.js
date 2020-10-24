module.exports = {
  env: {
    es2020: true,
    node: true,
  },
  extends: ['eslint:recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'consistent-return': 2,
    'no-else-return': 1,
    'semi': [1, 'always'],
    'space-unary-ops': 2,
    indent: [
      'error',
      // eslint-disable-next-line no-magic-numbers
      2,
    ],
    'max-len': [
      'error',
      { code: 120 },
    ],
    '@typescript-eslint/no-unused-vars': [2, { args: 'after-used' }],
    'object-curly-spacing': [
      'error',
      'always',
    ],
    quotes: [
      'error',
      'single',
    ],
  },
};
