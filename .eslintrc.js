module.exports = {
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  ignorePatterns: ["next.config.js", "tailwind.config.js"],
  parserOptions: {
    project: ["tsconfig.json"],
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "@next/next/no-img-element": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/consistent-type-imports": "warn",
    "@typescript-eslint/no-misused-promises": "warn",
  },
  // rules: {
  //   "react-hooks/rules-of-hooks": "error",
  //   "react/react-in-jsx-scope": "off",
  //   "react/prop-types": "off",
  //   "@typescript-eslint/camelcase": "off",
  //   "@typescript-eslint/explicit-function-return-type": ["warn"],
  // },
};
