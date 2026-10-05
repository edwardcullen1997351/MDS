User- or data-derived token: applied filters, facets, ids, typed labels. Not for status — a word the system chose, in a colour that means something, is `Badge`.

```jsx
<TagList limit={6}>
  {filters.map(f => <Tag key={f.id} label={f.token} onRemove={() => drop(f.id)} />)}
</TagList>
<Tag label="area:assembly" selected onClick={() => toggle('assembly')} />
```

No tones — Tag is monochrome by decision; `selected` is its only colour state. `font="sans"` for typed phrases, mono (default) for keys and ids. Pressable only with `onClick` (then it is a real `<button>`); removable tags accept Delete/Backspace. Wrap rows in `TagList` so a filter bar is one tab stop, not twelve — `limit` turns the remainder into a real button (`onShowMore`, or it expands in place). Touch is automatic: heights and the × target rise under a coarse pointer.
