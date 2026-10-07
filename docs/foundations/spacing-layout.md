# Spacing & Layout Foundations

Meridian is built on a 4px base grid optimized for information density.

---

## 1. Spacing Scale
| Token | Pixels | Common Application |
| --- | --- | --- |
| `--space-0` | 0px | Reset |
| `--space-1` | 2px | Micro padding, hairline offsets |
| `--space-2` | 4px | Icon-to-text gap, compact badge padding |
| `--space-3` | 8px | Button inline gap, form field vertical margin |
| `--space-4` | 12px | Compact card padding, dense table cell padding |
| `--space-5` | 16px | Standard card padding, modal content padding |
| `--space-6` | 20px | Section gap within cards |
| `--space-7` | 24px | Page gutter on standard screens |
| `--space-8` | 32px | Major layout region gap |
| `--space-9` | 40px | Hero section vertical spacing |

---

## 2. Density Modes
- **Compact (`density="compact"`):** Row height 28px, font size 12px. Used for high-volume tabular plant telemetry.
- **Normal (`density="normal"`):** Row height 36px, font size 13px. Default operations view.
- **Comfortable (`density="comfortable"`):** Row height 44px, font size 14px. Tablet/touch or supervisor summary views.
