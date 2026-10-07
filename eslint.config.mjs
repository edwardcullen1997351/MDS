/**
 * Meridian Design System — ESLint Flat Configuration
 *
 * Purpose: Checks production React components for raw design values that
 * should use design tokens. Strict TypeScript checks JSX prop contracts in
 * both the library and Storybook without duplicating the stale selector list.
 *
 * Run:  npx eslint packages/react/src apps/storybook/src --config eslint.config.mjs
 * CI:   See .github/workflows/ci.yml — "JSX Accessibility Lint" step
 *
 * NOTE: oxlint handles no-restricted-imports and react/forbid-elements via
 * .oxlintrc.json (faster, Rust-based). Storybook examples are documentation,
 * so raw token values in their illustrative styles are not checked here.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import tsParser from '@typescript-eslint/parser';
import jsxA11y from 'eslint-plugin-jsx-a11y-x';

const __dir = dirname(fileURLToPath(import.meta.url));
const adherence = JSON.parse(
  readFileSync(join(__dir, '_adherence.oxlintrc.json'), 'utf-8')
);

// Keep only the token-literal selectors; TypeScript owns JSX prop validation.
const nrsConfig = adherence.rules?.['no-restricted-syntax'] ?? [];
const configuredRules = Array.isArray(nrsConfig) ? nrsConfig : [];
const tokenComplianceRules = [
  configuredRules[0] ?? 'warn',
  ...configuredRules.slice(1).filter(({ message }) =>
    message?.startsWith('Raw hex color') ||
    message?.startsWith('Raw px value') ||
    message?.startsWith('Font not provided')
  ),
];

export default [
  {
    files: [
      'packages/react/src/**/*.{jsx,tsx}',
      'apps/storybook/src/**/*.{jsx,tsx}',
    ],
    plugins: { 'jsx-a11y': jsxA11y },
    languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
    // Preserve the rule IDs used by the accessibility baseline.
    rules: Object.fromEntries(
      Object.entries(jsxA11y.configs.strict.rules).map(([rule, severity]) => [
        rule.replace('jsx-a11y-x/', 'jsx-a11y/'),
        severity,
      ])
    ),
  },
  {
    // TypeScript parsing is also needed for Storybook's TypeScript sources.
    files: [
      'packages/react/src/**/*.{ts,tsx}',
      'apps/storybook/src/**/*.{ts,tsx}',
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
  },
  {
    files: ['packages/react/src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': tokenComplianceRules,
    },
  },
  {
    // Chart glyphs and axes use data-dependent geometry and categorical
    // palettes; the generic UI token-literal rule misclassifies those values.
    // Visualization contracts are checked by the data-visualization specs.
    files: [
      'packages/react/src/components/{AreaChart,BarChart,DistributionPlot,GanttChart,GeoMap,Heatmap,LineChart,NetworkDiagram,ParallelCoordinates,PieChart,RangeChart,SankeyDiagram,ScatterPlot,TreeDiagram,Treemap}/**/*.{ts,tsx}',
      'packages/react/src/utils/viz-core.ts',
    ],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
  {
    // Explicitly ignore build artefacts, generated files, and config files
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/storybook-static/**',
      '**/*.config.{js,mjs,cjs,ts}',
      '**/.storybook/**',
      'tools/**',
    ],
  },
];
