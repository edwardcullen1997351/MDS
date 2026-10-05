Free-text field that suggests as you type. The typed text **is** the value —
the inverse of `Combobox`, which only ever commits a row from its list.

```jsx
<Field label="Part number" hint="Type at least three characters.">
  <Autocomplete value={part} onChange={setPart} suggestions={recentParts}
    minChars={3} placeholder="e.g. BRK-4120" />
</Field>
// server-backed, with inline ghost completion
<Autocomplete aria-label="Tag" value={tag} onChange={onType} suggestions={hits}
  filter={false} loading={pending} inline />
```

Always controlled. `onChange` fires on every keystroke *and* on an accepted
suggestion; `onSelect` fires only on acceptance. Blur, Escape and Tab never
change the text, and there is no "no matches" message — the list just closes,
because nothing failed. Use `Combobox` when the value must exist in the list.
