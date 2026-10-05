Joins related action buttons into one continuous control. Each button fires its own action — nothing stays selected.

```jsx
<ButtonGroup label="Chart actions">
  <Button iconLeft="refresh-cw">Refresh</Button>
  <Button iconLeft="download">Export</Button>
  <IconButton icon="ellipsis" label="More chart actions" />
</ButtonGroup>

<ButtonGroup label="Save options" variant="primary">
  <Button>Save</Button>
  <IconButton icon="chevron-down" label="Save options" />
</ButtonGroup>
```

`label` is mandatory. `variant` and `size` are pushed to every child, so set them once on the group — and keep at most one filled button, since two solid fills side by side read as two competing primaries.

Children must be `Button` or `IconButton`; `variant="link"` is rejected inside a group because a link has no border or height to join. Horizontal only — a stacked list of actions is a menu.

Use `Tabs` for a view switcher where one option stays highlighted, and `Stack direction="row" gap="8"` for a spaced action row such as a dialog footer. Two to four buttons; beyond that use one button plus an overflow menu.
