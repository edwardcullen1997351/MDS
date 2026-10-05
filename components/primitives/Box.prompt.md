**Purpose** — the unstyled layout atom. Box applies spacing, sizing and surface tokens to exactly one element and adds nothing else: no colour, no type, no opinion. Reach for it when a div needs padding or a background; reach for Stack or Grid when it needs to arrange children.

**Properties** — `as` · padding `p px py pt pr pb pl` · margin `m mx my mt mr mb ml` · `width height minWidth maxWidth minHeight maxHeight` · `display background radius border borderTop borderBottom elevation` · `overflow position flex grow shrink basis` · `align justify gap` (flex/grid only). Spacing props take space steps (0, 1..24, 'px', 'half'); anything else passes through as CSS.

**Variants** — none. Box is configuration, not variants. A Box that needs a background *and* a border *and* a radius is a Surface.

**States** — none. Box is stateless; hover and selection belong to Surface or a real control.

**Accessibility** — renders a `div` unless `as` says otherwise. Use `as="section" | "ul" | "nav"` so the structure is real; never put an `onClick` on a Box — use Button or IconButton.

**Responsive rules** — Box does not respond on its own. Give it `maxWidth`/`minWidth` and let the parent Grid or Container reflow it. Do not hard-code widths below the tablet breakpoint.

**Do** — Use one Box for one job: pad it, size it, or give it a background — then stop.

**Don't** — don't pass raw pixel padding (`p="13px"`), don't stack Boxes with margins to fake a gap, don't use Box to build a card (that is Surface or Card).

**Examples**
```jsx
<Box p={4} background="surface-sunken" radius="md">…</Box>
<Box as="section" py={6} maxWidth={640}>…</Box>
```
