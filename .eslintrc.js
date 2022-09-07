module.exports = {
  parserOptions: {
    ecmaVersion: "latest"
  },
  env: {
    browser: false,
    es6: true,
    node: true,
    mocha: true
  },
  extends: [
    'eslint:recommended'
  ],
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
  }
}