A list of commands anchored to a trigger. Commands, never values — a field's options are `Select` or `Combobox`.

```jsx
<Menu label="Row actions" trigger={<IconButton icon="ellipsis" label="Row actions" />} items={[
  {label:'Open line', icon:'external-link', shortcut:'⏎'},
  {label:'Duplicate', icon:'copy', shortcut:'⌘D'},
  'divider',
  {label:'Stop line', icon:'octagon-x', tone:'critical'}]} />
```

Groups (`{group:'Export', items:[…]}`), `'divider'`, `disabled` rows and checkable rows (`checked`) all live in `items`. A checkable row keeps the menu open; a command closes it. Use `size="sm"` in table rows and toolbars. Never nest a menu in a menu, and never put a destructive confirm in one — Escape and an outside click both dismiss, and neither is an answer.
