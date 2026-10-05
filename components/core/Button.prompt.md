The standard Meridian action control — one `primary` per view, `secondary` for everything else.

```jsx
<Button variant="primary" iconLeft="plus">New project</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost" size="sm" iconLeft="filter">Filter</Button>
<Button variant="danger" iconLeft="trash-2">Delete</Button>
```

Variants: primary, secondary, ghost, danger, link. Sizes sm/md/lg map to the 28/34/40px control heights. `loading` replaces the leading icon and disables the button. Labels are sentence case, verb-first, no trailing punctuation.
