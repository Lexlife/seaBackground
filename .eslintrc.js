module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'consistent-return': 'off',
    'max-len': 'off',
    'no-underscore-dangle': 'off',
    'import/newline-after-import': 'off',
    'no-plusplus': 'off',
    'object-curly-newline': 'off',
  },
};
