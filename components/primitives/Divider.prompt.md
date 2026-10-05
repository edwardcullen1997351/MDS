**Purpose** — a hairline rule between groups of content. Structure comes first: try a gap or a surface change before you draw a line.

**Properties** — `orientation` · `tone` subtle/default/strong · `spacing` · `inset` · `label`.

**Variants** — horizontal (section and list separation) · vertical (toolbar and metadata separation, stretches to the row) · labelled (a caps label centred in the rule, for "or" splits and log sections).

**States** — none.

**Accessibility** — renders `role="separator"` with `aria-orientation` on the vertical form. Decorative rules inside an already-semantic list can take `aria-hidden`.

**Responsive rules** — vertical dividers do not survive a wrap; drop them below the tablet breakpoint and rely on the column gap instead.

**Do** — Use the lightest rule that still separates, and let the parent gap do the spacing.

**Don't** — don't put a divider between every row of a table (the row hairline already does it), don't use `strong` on a white card, don't add margin around one — use `spacing`.

**Examples**
```jsx
<Divider tone="subtle" />
<Stack direction="row" gap={3}><Text>WO-88431</Text><Divider orientation="vertical" /><Text tone="secondary">Line 3</Text></Stack>
```
