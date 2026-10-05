One-of-N choice. Every radio in a set needs the same `name` — that is what makes them exclusive
and what gives the browser arrow-key navigation between them.

```jsx
<Radio name="attribution" value="first" label="First stop" checked={a === 'first'} onChange={() => setA('first')} />
<Radio name="attribution" value="constraint" label="Constraint"
  description="Attributed to the bottleneck machine." checked={a === 'constraint'} onChange={() => setA('constraint')} />
```

Two to four options; past five use a `Select`. A radio set can never be cleared once chosen, so
include an explicit "Any"/"None" option if empty is a legal answer. The set needs a name of its own
— reach for `RadioGroup`, which owns the shared `name` and the `<fieldset>`/`<legend>` scaffold.
(This line said to hand-write `role="radiogroup"` "until `RadioGroup` ships". It shipped at 1.19.0,
and the system exposes `group` from a real fieldset rather than overriding the role — see
`Fieldset`.) See `specs/forms/Radio.spec.html`.
