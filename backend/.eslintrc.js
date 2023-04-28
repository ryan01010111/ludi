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
  },
};
