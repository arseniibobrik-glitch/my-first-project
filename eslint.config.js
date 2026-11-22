import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  // Base JS configs
  js.configs.recommended,
  // TypeScript base configs (arrays - spread individually)
  ...tseslint.configs.recommended,
  // TypeScript type-checked configs - only for TS/TSX files
  {
    files: ["**/*.{ts,tsx}"],
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
  // Prettier for all files
  prettierConfig,
  // Config files (JS/TS) — disable type-checked
  {
    files: ["*.config.*", "*.config.js", "*.config.ts", "eslint.config.js"],
    ...tseslint.configs.disableTypeChecked,
  },
  // Ignore patterns
  {
    ignores: ["node_modules", "dist", "build", ".turbo"],
  }
);