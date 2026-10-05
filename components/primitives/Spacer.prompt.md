**Purpose** — a deliberate gap where a gap cannot express it: pushing a trailing action to the far edge of a toolbar, or breaking rhythm inside markup you do not control.

**Properties** — `size` space step (default 4) · `axis` vertical/horizontal · `grow`.

**Variants** — fixed (a size) and elastic (`grow`, absorbing free space in a flex line).

**States** — none.

**Accessibility** — renders `aria-hidden` and carries no content. Never use a Spacer to imply a section break — that is a Divider or a heading.

**Responsive rules** — fixed spacers do not scale; an elastic spacer collapses to zero when the line wraps, so pair `grow` with `wrap={false}` or accept the collapse.

**Do** — Use Spacer only for the one gap a parent gap cannot express.

**Don't** — don't use Spacer between every pair of items (that is what `gap` is for), don't stack spacers to reach a size, don't use one to pad a container.

**Examples**
```jsx
<Stack direction="row" gap={2}>
  <Text>Work orders</Text><Spacer grow /><Button size="sm">New</Button>
</Stack>
```
