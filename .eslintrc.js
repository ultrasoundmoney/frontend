module.exports = {
  extends: [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node",
    // "eslint:recommended",
    // "plugin:@typescript-eslint/recommended",
    // "plugin:@typescript-eslint/recommended-requiring-type-checking",
    // "prettier",
  ],
  rules: {
    "@typescript-eslint/restrict-template-expressions": "off",
  },
};
