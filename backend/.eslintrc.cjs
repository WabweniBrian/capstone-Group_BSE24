module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
  rules: {
    // Require semicolons at the end of statements
    semi: ["error", "always"],

    // Require let or const instead of var
    "no-var": "error",

    // Suggest using const for variables that are never reassigned
    "prefer-const": "error",

    // Require the use of === and !== instead of == and !=
    eqeqeq: ["error", "always"],
  },
};
