**Purpose** — a content plane. Surface is the one place background, hairline, radius and elevation are decided together, so every layer in the product reads at the same depth as every other.

**Properties** — `tone` · `elevation` 0-5 · `padding` none/sm/md/lg (0/16/24/32) · `radius` · `border` · `interactive` · `fill` · `as`.

**Variants** — `card` default plane on the page background · `sunken` wells, code blocks, empty states · `raised` a card that must separate from other cards · `overlay` popovers and menus · `selected` the chosen item in a list · `inverse` dark panels and console readouts.

**States** — rest; hover (only with `interactive`, steps the background to `--surface-hover`); selected via `tone="selected"`. There is no disabled Surface — disable the control inside it.

**Accessibility** — `interactive` adds a cursor and hover only. The clickable thing inside must still be a button or link with its own focus ring. Never rely on the selected tint alone: pair it with a checkmark, a bold label or `aria-current`.

**Responsive rules** — padding steps down one level below the tablet breakpoint (md → sm) when the surface is edge-to-edge. Radius stays constant; corners do not scale.

**Do** — Let Surface own the plane; put content, not more surfaces, inside it.

**Don't** — don't nest three surfaces deep, don't use elevation 3+ for anything that isn't floating, don't tint a surface with a status colour (that is a Badge or an inline alert).

**Examples**
```jsx
<Surface padding="md" elevation={1}>…</Surface>
<Surface tone="sunken" padding="sm" border={false}>…</Surface>
```
