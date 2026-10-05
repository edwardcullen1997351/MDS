**Purpose** — the measured content frame. Caps the line length, centres the column, and applies the responsive page gutter so every screen starts from the same margin.

**Properties** — `size` sm 640 / md 900 / lg 1240 (default) / xl 1440 / full · `gutter` · `py` · `center` · `as`.

**Variants** — sm for sign-in and single forms · md for prose and settings · lg for standard app content · xl for wide table-only screens · full for floor views and charts that must bleed.

**States** — none.

**Accessibility** — pair with `as="main"` for the primary region of a page so skip links land somewhere real.

**Responsive rules** — the gutter is `--grid-margin`: 16 mobile, 24 tablet and desktop, 32 ultrawide. An ultrawide display gets more margin, never longer lines. Set `gutter={false}` only when an ancestor already applied one.

**Do** — One Container per page region, wrapping the semantic landmark.

**Don't** — don't nest Containers, don't add your own `max-width` on top of one, don't use `full` because content looks sparse; fix the layout instead.

**Examples**
```jsx
<Container as="main" size="lg" py={6}>…</Container>
<Container size="sm">{/* sign-in */}</Container>
```
