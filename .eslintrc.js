module.exports = {
  root: true,

  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },

  env: {
    browser: true,
    node: true,
    es6: true
  },

  // add your custom rules here
  //it is base on https://github.com/vuejs/eslint-config-vue
  extends: ["plugin:vue/recommended", "eslint:recommended"],

  'extends': [
    'plugin:vue/recommended',
    'eslint:recommended',
    'plugin:vue/essential',
    '@vue/airbnb'
  ],

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  }
};
