import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Base Next.js configuration
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  
  // Custom rules for the project
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    rules: {
      // TypeScript specific rules
      "@typescript-eslint/no-unused-vars": ["warn", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }],
      "@typescript-eslint/no-explicit-any": "warn",
      
      // General JavaScript rules
      "no-unused-vars": "off", // Turn off base rule as TypeScript handles this
      "prefer-const": "error",
      "no-var": "error",
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      
      // React specific rules
      "react/no-unescaped-entities": ["error", {
        "forbid": [">", "}"]
      }],
      
      // React Hooks rules
      "react-hooks/exhaustive-deps": "warn",
      
      // Next.js specific rules
      "@next/next/no-img-element": "warn",
    },
  },
  
  // Test files - more relaxed rules
  {
    files: [
      "**/*.test.{ts,tsx,js,jsx}", 
      "**/*.spec.{ts,tsx,js,jsx}", 
      "**/__tests__/**/*",
      "tests/**/*",
      "jest.setup.js",
      "jest.config.js"
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  
  // Configuration files
  {
    files: [
      "*.config.{js,mjs,ts}", 
      "*.setup.{js,ts}",
      "tailwind.config.ts",
      "next.config.ts",
      "playwright.config.ts"
    ],
    rules: {
      "@typescript-eslint/no-var-requires": "off",
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  
  // Ignore patterns
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "public/**",
      "docs/**",
      "test-results/**",
      "playwright-report/**",
      "*.config.js",
      "*.config.mjs",
      ".gitignore",
      "*.log",
    ],
  },
];

export default eslintConfig;
