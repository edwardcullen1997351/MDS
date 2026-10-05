**Purpose** — two-dimensional layout on the system grid: 4 columns on mobile, 8 on tablet, 12 on desktop, with the gutter that belongs to each tier.

**Properties** — `columns` 'responsive' | 'fluid' | number · `minItemWidth` (fluid only, default 240) · `gap rowGap columnGap` · `align justify` · `as`. `GridItem` takes `span`, `start`, `rowSpan`.

**Variants** — `responsive` for page layout that must line up with the rest of the product · `fluid` for card decks of unknown length · a fixed number only inside a component where the count is part of the design (a 3-up stat row).

**States** — none.

**Accessibility** — grid placement can decouple visual and DOM order. Never use `start` to reorder content a keyboard user will read.

**Responsive rules** — with `responsive`, a `span` above 4 disappears off mobile; give mobile-critical items `span={4}` or less. `fluid` needs no breakpoints — set `minItemWidth` to the narrowest the card can survive.

**Do** — Use the responsive grid for page layout and fluid for card decks.

**Don't** — don't hand-write `gridTemplateColumns`, don't mix a fixed column count with the responsive grid, don't use Grid for a single row of buttons.

**Examples**
```jsx
<Grid columns="fluid" minItemWidth={260} gap={4}>…</Grid>
<Grid columns="responsive"><GridItem span={8}>…</GridItem><GridItem span={4}>…</GridItem></Grid>
```
