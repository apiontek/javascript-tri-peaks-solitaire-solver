module.exports = {
  parserOptions: {
    ecmaVersion: "latest",
  },
  env: {
    browser: false,
    es6: true,
    node: true,
    mocha: true,
  },
  extends: ["eslint:recommended", "prettier"]
};
