Square icon-only button for toolbars, table row actions, and panel headers.

```jsx
<IconButton icon="refresh-cw" label="Refresh" />
<IconButton icon="panel-left" label="Toggle sidebar" selected />
<IconButton icon="plus" label="Add" variant="solid" size="sm" />
<IconButton icon="trash-2" label="Delete permanently" variant="danger" />
```

`ghost` is correct in toolbars; reach for `outline` only when the button stands alone on a page surface; `danger` is the filled destructive fill, matching `Button`'s. `label` is mandatory. The box is sized from `--control-h-*`, so it follows `[data-density]` and always matches a `Button` of the same `size`.
