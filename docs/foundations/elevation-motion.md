# Elevation & Motion Foundations

Structure in Meridian is carried by hairline borders rather than heavy drop shadows.

---

## 1. Elevation Scale
- `--elevation-0`: Flat (standard cards, background panels). Border carries depth.
- `--elevation-1`: Subtle lift on hover (clickable cards).
- `--elevation-2`: Raised overlays, dropdown menus, autocomplete popups.
- `--elevation-3`: Modals, dialogs, drawers.
- `--elevation-4`: System alerts, floating action sheets.
- `--elevation-5`: Top-layer drag previews, tooltips.

---

## 2. Radii Scale
- `--radius-none`: 0px (strict grid alignments, flush tables)
- `--radius-xs`: 2px (subtle chip/tag rounding)
- `--radius-sm`: 4px (default for buttons, inputs, segmented controls)
- `--radius-md`: 6px (cards, flyout containers)
- `--radius-lg`: 8px (dialogs, large modals)
- `--radius-full`: 9999px (circular avatars, pills)

---

## 3. Motion & Durations
- `--duration-instant`: 50ms (micro feedback, toggle states)
- `--duration-fast`: 100ms (hover transitions, menu item highlights)
- `--duration-normal`: 150ms (dropdown expands, tabs switching)
- `--duration-slow`: 250ms (modal open/close, drawer slides)
- `--easing-standard`: `cubic-bezier(0.2, 0, 0, 1)`
