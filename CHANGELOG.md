# Meridian Design System — Changelog

All notable changes to the Meridian Design System are documented in this file.
The system follows [Semantic Versioning](https://semver.org/).

---

## [1.2.0] — 2026-09-08

### Added
- **Token Tooling & DTCG Compilation**:
  - `tools/build-tokens.mjs`: Parses all 16 `tokens/*.css` files into a W3C DTCG-standard `tokens.json` (1,005 tokens).
  - `tools/lint-tokens.mjs`: Automated linter enforcing one-direction referencing, no peer-component references, and theme isolation.
  - `package.json`: Added `tokens:build`, `tokens:lint`, `tokens:check`, and `verify` npm scripts.
- **Master Guidelines**:
  - `guidelines/composition-rules.card.html`: Universal composition standard (card nesting law, table-card union, description list framing, feedback boundaries, 5-state collection choreography).
  - `guidelines/dc-runtime.card.html`: Guide for the Declarative Component runtime (`<x-dc>`, `<x-import>`, `<sc-if>`, `<sc-for>`, `DCLogic`).
  - `guidelines/foundations-overview.card.html`: Master navigation taxonomy indexing all 51+ foundation cards.
- **Multi-Theme (Dark Mode) & Density Harnesses**:
  - Interactive `☀ Light / 🌙 Dark` and `Compact / Comfortable / Expanded` switches in `specs/core/Card.spec.html` and `specs/data/Table.spec.html`.
  - Added `theme` harness property and live `syncTheme()` lifecycle hooks across all 7 layout templates (`Dashboard`, `SingleColumn`, `CollectionWorkspace`, `MasterDetail`, `HolyGrail`, `Sidebar`, `SplitView`).
- **Container Queries**:
  - Expanded `tokens/container-queries.css` with `@container` rules for `Card` (adaptive padding under 340px) and `Toolbar` (adaptive wrap under 420px).

### Fixed
- **WCAG 2.1 AA 1.4.11 Non-Text Contrast**:
  - Retargeted `Checkbox`, `Radio`, and `Switch` control boundaries to `--border-control` (4.74:1 in light, 5.45:1 in dark).
  - Retargeted `Avatar` offline indicator dot to `--text-tertiary` (~4.1:1).
  - Updated documentation in `tokens/semantic.css`.
- **Peer-Component References**:
  - Fixed `SplitButton` `--split-button-radius` to reference `--radius-sm` directly.
  - Fixed `IconButton` critical states to reference `--status-critical-solid*` directly.
- **Double-Hairline Collisions**:
  - Added `tr[data-table-row]:last-child td { border-bottom: none; }` to `tokens/base.css` to eliminate 2px border stacking when Table sits inside Card.

---

## [1.1.0] — 2026-09-05

### Added
- `--border-control` (grey-500, 4.74:1) and `--border-control-hover` (grey-600, 7.78:1) for load-bearing interactive boundaries.
- `[data-density]` system with compact (28px/36px), comfortable (34px/44px), and expanded (44px/56px) modes.

---

## [1.0.0] — 2026-09-01

### Added
- Initial frozen foundations, 78 React components in `_ds_bundle.js`.
- 16 CSS token files in 3-tier architecture.
- 7 Layout Templates and 15 Interaction Pattern specifications.
