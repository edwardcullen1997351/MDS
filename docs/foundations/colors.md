# Color Foundations

Meridian uses a light-first, high-density palette tailored for plant monitoring consoles.

---

## 1. Action Blue (The Core Interactive Hue)
- `--action-default`: Primary interactive elements (buttons, links, focus rings)
- `--action-hover`: Hover state for primary action
- `--action-pressed`: Pressed state
- `--action-subtle`: Subtle action backgrounds (hover on secondary buttons, nav items)
- `--action-contrast`: Text/icon color over action-default (white)

---

## 2. Surfaces & Backgrounds
- `--background-page`: Base canvas color for whole page (`#f8f9fa`)
- `--surface-default`: Default card / container surface (`#ffffff`)
- `--surface-subtle`: Secondary container / inset panels (`#f1f3f5`)
- `--surface-raised`: Menus, modals, popovers (`#ffffff` with elevation shadow)

---

## 3. Borders & Dividers
- `--border-subtle`: Internal cell dividers, light separators
- `--border-default`: Standard card and input container borders (hairline 1px)
- `--border-strong`: Emphasized borders, active tabs, selected states

---

## 4. Semantic Status Ramps
| Status | Text Token | Surface Token | Border Token |
| --- | --- | --- | --- |
| **Critical** | `--text-critical` | `--status-critical-subtle` | `--status-critical-border` |
| **Warning** | `--text-warning` | `--status-warning-subtle` | `--status-warning-border` |
| **Success** | `--text-success` | `--status-success-subtle` | `--status-success-border` |
| **Info** | `--text-info` | `--status-info-subtle` | `--status-info-border` |

*Rule:* Never use `--accent-*`, `--status-danger-*`, or `--amber-*`. Use `--action-*`, `--status-critical-*`, and `--orange-*`.
