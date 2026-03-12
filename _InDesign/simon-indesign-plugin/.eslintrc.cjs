/* eslint-env node */
module.exports = {
  parserOptions: {
    ecmaVersion: "latest",
    project: true,
  },
  env: {
    es6: true,
    browser: true,
    node: true,
    jest: true,
  },
  globals: {
    NodeJS: true,
    window: true,
    global: true,
    React: true,
    JSX: true,
  },
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      extends: ["eslint:recommended"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint", "react-hooks"],
      rules: {
        quotes: ["error", "double"],
        "@typescript-eslint/switch-exhaustiveness-check": "error",
        "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-unused-vars": [
          "error",
          { argsIgnorePattern: "^_" },
        ],
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "error",
        "no-unused-vars": "off",
      },
    },
  ],
  ignorePatterns: [
    ".eslintrc.cjs",
    "vite.config.ts",
    "jest.config.ts",
    "aspnetcore-https.js",
    "aspnetcore-react.js",
  ],
  root: true,
};
