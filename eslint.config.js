import js from "@eslint/js";
import tseslint from "typescript-eslint";
export default tseslint.config(
  { ignores: ["node_modules/**"] }, js.configs.recommended,
  ...tseslint.configs.strict, ...tseslint.configs.stylistic,
  { rules: { "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports", fixStyle: "inline-type-imports" }], "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }] } },
  { files: ["**/*.mjs"], languageOptions: { globals: { AbortController: "readonly", Buffer: "readonly", console: "readonly", process: "readonly", URL: "readonly" } } }
);
