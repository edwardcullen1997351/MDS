**Purpose** — one-dimensional flow with a token gap. This is how siblings are spaced in Meridian; a margin between two elements is a bug.

**Properties** — `direction` row/column · `gap` space step (default 4) · `align` · `justify` · `wrap` · `inline` · `grow` · `fill` · `as`.

**Variants** — row (toolbars, button groups, label + value) and column (forms, card bodies, page sections). Rows default to `align="center"`.

**States** — none.

**Accessibility** — visual order is DOM order, so keyboard order follows for free. `row-reverse` breaks that: reverse the children instead. Use `as="ul"` with `li` children for real lists.

**Responsive rules** — a row of more than three items should carry `wrap`, or switch to `direction="column"` below the tablet breakpoint. Gap does not scale with the viewport; the step you pick is the step you get.

**Do** — Space every sibling group with a Stack gap from the scale.

**Don't** — don't gap 5 where the scale says 4 or 6, don't nest four stacks to build a grid, don't add `marginTop` to a Stack child.

**Examples**
```jsx
<Stack gap={4}>…</Stack>
<Stack direction="row" gap={2} justify="flex-end">
  <Button variant="secondary">Cancel</Button>
  <Button variant="primary">Save</Button>
</Stack>
```
