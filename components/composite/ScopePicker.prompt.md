Several hierarchy nodes as **one scope value** — the cost centres a charge posts against, the BOM lines a revision covers, the assets a PM plan includes. `Tree` + `SearchField` + a derived summary, as one form control.

```jsx
const [scope, setScope] = React.useState(['CC-PRESS']);

<ScopePicker
  label="Charge scope"
  unit="cost centre"
  items={costCentres}
  value={scope}
  onChange={setScope}
  required
  requiredMessage="A rework charge must name at least one cost centre."
  hint="A parent charges every centre beneath it."
  loadingIds={fetching}
/>
```

**The value is a scope, not a selection.** `value` is the *covering* set — the shallowest nodes that imply the rest — normalised in both directions, so ticking all four presses stores `['CC-PRESS']` and the form can never submit a different scope than it displayed.

**Completeness is owned here.** A selected branch whose children were never fetched makes the scope *provisional*, and the summary band says so — `Tree` sees nodes and the form sees ids; neither can tell.

**Filtering never changes the answer.** A hit is shown with its ancestors and its path opened; clearing the query restores the operator's own expansion; the scope is untouched throughout.

Reach elsewhere when: the user picks **one** node (`Tree selection="single"`, or a `Combobox` if they'd rather type it); the hierarchy is being *browsed* rather than turned into a value (`Tree`); the set is flat (`MultiCombobox`, or `CheckboxGroup` for a handful); or the selection drives a detail pane instead of a field (`Tree` + the SelectionDrivenDetail pattern).
