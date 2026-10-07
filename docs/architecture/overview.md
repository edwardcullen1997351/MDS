# Meridian Architecture Overview

Meridian is a **Swiss-technical console system**: a dense, light-first interface language built specifically for manufacturing operations software. Hairline borders carry structure, one saturated blue drives action, and type carries the rest.

---

## Key Technical Decisions
1. **Multi-Framework Monorepo:**
   - React 19 (`packages/react`)
   - Angular (`packages/angular`)
   - Design Tokens (`packages/tokens` & `tokens/`)
   - Interactive Workshop (`apps/storybook`)
2. **Token Architecture:**
   - Three-tier token flow: Primitives → Semantic → Component.
   - Zero alias rule (one name per value).
   - Component props touch semantic or component tokens, never primitives.
3. **Enterprise Testing & Quality Gates:**
   - Contract checking (`npm run test:contracts`).
   - Browser artifact integrity checking (`check:browser-artifacts`).
   - JSX accessibility gate (`npm run lint:a11y`).
   - Playwright a11y test harness (`npm run test:a11y`).
