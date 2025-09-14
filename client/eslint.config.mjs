import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      // TypeScript
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-var-requires": "off",

      // Style / Formatting
      "semi": "off",
      "quotes": "off",
      "indent": "off",
      "comma-dangle": "off",
      "object-curly-spacing": "off",
      "array-bracket-spacing": "off",
      "space-before-function-paren": "off",
      "max-len": "off",

      // Variables / Imports
      "no-unused-vars": "off",
      "no-undef": "off",
      "no-shadow": "off",
      "import/no-unresolved": "off",
      "import/extensions": "off",

      // Functions / Classes
      "class-methods-use-this": "off",
      "no-empty-function": "off",
      "no-useless-constructor": "off",

      // React
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/display-name": "off",
      "react/no-unescaped-entities": "off",

      // General
      "no-console": "off",
      "no-alert": "off",
      "no-debugger": "off",
      "eqeqeq": "off",
      "curly": "off",
    },
  },
];

export default eslintConfig;
