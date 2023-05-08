module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.eslint.json'],
  },
  rules: {
    'arrow-parens': 'off',
    'max-len': ['error', { code: 100 }],
    'no-continue': 'off',
    'import/no-extraneous-dependencies': [
      'error', { devDependencies: ['**/*.test.ts', '**/*.spec.ts', 'test/**'] },
    ],
    '@typescript-eslint/no-shadow': 'off',
    'no-plusplus': 'off',
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message: 'for..in loops iterate over the entire prototype chain, which is virtually never'
          + 'what you want. Use Object.{keys,values,entries}, and iterate over the resulting'
          + 'array.',
      },
      {
        selector: 'LabeledStatement',
        message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain'
          + 'and understand.',
      },
      {
        selector: 'WithStatement',
        message: '`with` is disallowed in strict mode because it makes code impossible to predict'
          + 'and optimize.',
      },
    ],
  },
};
