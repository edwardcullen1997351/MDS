**Purpose** — section titles. The level sets the document outline; size is a separate, optional override, so a visually small title can still be an h2.

**Properties** — `level` 1-6 · `as` · `size` · `weight` · `tone` · `display` · `align` · `measure` · `truncate`.

**Variants** — UI headings (levels map to 28 / 22 / 18 / 16 / 15 / 13, semibold, tight leading) · display (`display` or a `display-*` size: fluid, light weight, marketing and hero empty states only).

**States** — none.

**Accessibility** — one h1 per page or dialog, and never skip a level to get a size — use `size` for that. Inside a card header where an outline entry would be noise, keep the visual step and pass `as="div"`.

**Responsive rules** — UI heading sizes are fixed. Display sizes are fluid between the tablet (600px) and desktop (1024px) breakpoints and are the only type in the system that scales.

**Do** — Choose the level for the outline and the size for the look, independently.

**Don't** — don't pick a level by how big it looks, don't put display type in the app shell, don't end a heading in a full stop, don't use two h1s on one screen.

**Examples**
```jsx
<Heading level={1}>Work orders</Heading>
<Heading level={3} size="md">Downtime by cause</Heading>
<Heading level={2} display measure="narrow">Nothing needs your attention</Heading>
```
