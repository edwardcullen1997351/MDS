Several values from a list the system knows. Tokens in the box, a searchable list beneath, the list stays open while you pick.

```jsx
<Field label="Ingredients" hint="Anything the recipe must avoid.">
  <MultiCombobox
    value={avoid} onChange={setAvoid}
    placeholder="Search ingredients"
    options={[
      {value:'peanut',label:'Peanut',description:'Tree-nut cross-contact likely'},
      {value:'shellfish',label:'Shellfish'},
      {value:'sesame',label:'Sesame'},
    ]} />
</Field>
```

Backspace on an empty query removes the last token; × removes any. At rest the box collapses to three tokens and “+N”; focused, it shows them all. Values come back in **option order**, not click order.

One value is a `Combobox`. Free text the user invents is `Autocomplete` plus a `Tag` list. A short closed set that filters data is `ChipGroup`. Server-side search needs `onSearch` **and** `filter={false}`.

`creatable` offers the typed text as a new value — a real `role="option"` row at the end of the list, so ArrowDown reaches it and Enter takes it. Only for **open** sets (tags, keywords, part numbers); on a closed set it manufactures values the backend will reject, which is worse than "No matches". Pass `onCreate` to map the text to your own id.
