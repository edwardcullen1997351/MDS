# Meridian Token Architecture Standard

> Full reference standard: see root [Token Architecture.md](file:///Token%20Architecture.md).

## Token Contract Summary
1. **Three Tiers:**
   - **Tier 1 (Primitives):** Raw color ramps, spacing scales, font definitions (e.g., `--grey-300`, `--space-4`).
   - **Tier 2 (Semantic):** Purpose-driven tokens (e.g., `--border-strong`, `--background-page`).
   - **Tier 3 (Component):** Scoped component variables (e.g., `--button-h-md`, `--card-border`).
2. **One-Way Reference Rule:**
   - Primitives → Semantic → Component.
   - Components must never reference primitives directly.
3. **Canonical Enforcements:**
   - `--action-*` (never `--accent-*`)
   - `--status-critical-*` & `--text-critical` (never `--status-danger-*` or `--text-danger`)
   - `--background-page` (never `--surface-page`)
   - `--orange-*` (never `--amber-*`)
