module.exports = {
  parserOptions: {
    sourceType: "module",
  },
  env: {
    browser: true,
    es2022: true,
    mocha: true,
    node: true,
  },
  plugins: ["html"],
  extends: ["eslint:recommended", "prettier"],
};
