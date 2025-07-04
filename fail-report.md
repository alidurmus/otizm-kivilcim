## Error Report

This report summarizes the errors found during linting, unit testing, and building the application.

### Linting Errors/Warnings:
*   **Unused variables/functions:** `useEffect`, `getVoices`, `onBack`, `userIP` are defined but not used in various files.
*   **Unescaped entities:** `"` and `'` characters are not properly escaped in JSX in `app/exercise/literacy/page.tsx` and `app/exercise/vocabulary/KelimeEslestirmeOyunu.tsx`.
*   **Unexpected `any` type:** Several instances of `any` type usage, which should be replaced with more specific types for better type safety, especially in `app/admin/page.tsx`, `app/exercise/literacy/page.tsx`, `app/parent/page.tsx`, `app/sensory-settings/page.tsx`, `lib/performance.ts`, and `src/mocks/handlers.ts`.
*   **Parsing error:** A `>` expected error in `lib/dynamic-imports.ts`. This might indicate a syntax error.
*   **Missing dependencies in `useEffect` and `useCallback` hooks:** `checkAnswer`, `speak`, `resetRound`, and `playWelcomeMessage` are missing from dependency arrays in `app/exercise/literacy/page.tsx`, `app/exercise/vocabulary/HafizaOyunu.tsx`, `app/exercise/vocabulary/KelimeEslestirmeOyunu.tsx`, and `app/page.tsx`. This can lead to stale closures and unexpected behavior.

### Unit Test Errors:
*   **Jest configuration warning:** Unknown option "moduleNameMapping".
*   **Module not found:** `msw/node` from `src/mocks/server.ts`, preventing tests from running.

### Build Errors:
*   **Invalid `next.config.ts` options:** `swcMinify` and `optimizeFonts` are unrecognized options.
*   **Module not found:** `Can't resolve './KelimeEsleştirmeOyunu'` in `app/exercise/vocabulary/page.tsx` (likely a typo).
*   **`useRouter` in Server Component:** `app/exercise/coming-soon/page.tsx` is importing `useRouter` which is a client-side hook, but the component is not marked with `"use client"`.
