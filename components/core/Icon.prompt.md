Renders a Lucide glyph that inherits text colour — use it for every icon in a Meridian surface instead of inline SVG, an `<img>`, an icon font or emoji.

```jsx
<Icon name="chart-no-axes-column" size={16} />
<Icon name="triangle-alert" size={14} style={{ color: 'var(--status-warning-solid)' }} title="Warning" />
```

Sizes: 14 (table rows, badges), 16 (buttons, nav, default), 20 (page headers), 22 (empty states — the ceiling, `--icon-lg`). Names are Lucide 0.469.0 kebab-case; several were renamed, so verify — `triangle-alert` not `alert-triangle`, `circle-check` not `check-circle`, `ellipsis` not `more-horizontal`. A name that does not resolve renders nothing and warns in the console.

Never set a colour prop — set `color` on the parent and the glyph follows. Never attach `onClick`: Icon has no role, focus or name, so a clickable one is invisible to keyboards and screen readers. Use `IconButton`.

Glyphs load from the pinned lucide-static CDN by default. `Icon.setBasePath('/assets/icons/')` at startup serves them from your own origin instead.
