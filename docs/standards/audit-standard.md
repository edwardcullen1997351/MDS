# Meridian Technical Audit Standard

> Full reference standard: see root [AUDIT_STANDARD.md](file:///AUDIT_STANDARD.md).

## Quality Gates & Verification Requirements
1. **Accessibility (WCAG 2.1 AA & Section 508):**
   - Minimum contrast ratio 4.5:1 for normal text, 3:1 for large text / controls.
   - 0 violations on automated axe-core playwright audits.
   - 0 JSX a11y lint errors (`npm run lint:a11y`).
2. **Keyboard Navigation:**
   - Full keyboard accessibility (Tab, Shift+Tab, Enter, Space, Arrow keys, Esc).
   - High-visibility focus indicators with `--focus-ring-*`.
3. **Responsive Viewports:**
   - Validated across desktop (1440px), laptop (1280px), tablet (1024px, 768px).
