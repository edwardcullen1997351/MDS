A surface attached to an edge of the app frame — a **place** beside the page, where `Dialog` is a **decision** on top of it. Detail beside the table it came from, filters beside the results they narrow.

```jsx
// Modal by default: scrim, focus trap, scroll lock, aria-modal.
<Drawer open={!!line} title={line?.name} description={`${line?.machine} · area ${line?.area}`}
  onClose={() => setLine(null)}
  footer={<><Button variant="secondary" fullWidth>Log downtime</Button><Button variant="primary" fullWidth>Resume line</Button></>}>
  …detail…
</Drawer>

// Non-modal: the page beside stays readable AND usable — no scrim, no trap,
// no scroll lock, and no aria-modal, because it is not enforcing modality.
<Drawer modal={false} title="Filters" side="left" size="sm" onClose={close}>…</Drawer>

// The sheet, for touch and narrow viewports.
<Drawer side="bottom" size="md" title="Work order" onClose={close}>…</Drawer>
```

`title` and `onClose` are both required in practice and both warn: the title is the accessible name, and without `onClose` neither Escape, the scrim nor the close button can dismiss it. The body scrolls; the header and footer stay. Two footer buttons at most, primary last.

Use `modal` when the panel must be answered before the page continues (an edit form with unsaved state), `modal={false}` when the point is to keep working beside it (an inspector the user clicks rows into). If losing the panel would lose data, it is modal — or a page.

Not a navigation menu, not a permanent side region (that is layout), not a `Dialog` variant, and never nested inside another drawer.
