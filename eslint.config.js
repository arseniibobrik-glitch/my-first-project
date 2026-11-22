import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  // Base configs только для TS/TSX
  {
    files: ["**/*.{ts,tsx}"],
    ...js.configs.recommended,
    ...tseslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        project: ["./tsconfig.base.json", "./apps/*/tsconfig.json", "./packages/*/tsconfig.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-misused-promises": "warn",
      "@typescript-eslint/require-await": "warn",
    },
  },
  // Prettier для всех файлов
  {
    ...prettierConfig,
  },
  // Config files (JS/TS) — без type-checked
  {
    files: ["*.config.*", "*.config.js", "*.config.ts", "eslint.config.js"],
    ...tseslint.configs.disableTypeChecked,
  },
  // Ignore patterns
  {
    ignores: ["node_modules", "dist", "build", ".turbo"],
  }
);