Navigation. A Link goes somewhere; a Button does something.

```jsx
<p>Readings are averaged over the shift — see the <Link href="/docs/oee">OEE method</Link>.</p>
<Link href="https://status.example.com" external>Status page</Link>
<Link href="/lines/3" tone="subtle" underline="hover">Line 3</Link>
```

`href` is required. No destination means it is not a link — use `<Button variant="link">` for an action that must read inline; it is announced as a button and activates on Space.

**Underline is an accessibility contract, not a style choice.** `--text-link` is 2.56:1 against body text, under the 3:1 WCAG 1.4.1 needs for colour alone, so links default to underlined. `underline="hover"` is only for a standalone link that is not inside a sentence — a nav row, a breadcrumb, a card title, a table cell.

`external` adds `target="_blank"`, `rel="noopener noreferrer"`, the `arrow-up-right` glyph and an announced "(opens in a new tab)". Links have no size prop — they inherit the type around them — and cannot be disabled: remove the link or render plain text instead.
