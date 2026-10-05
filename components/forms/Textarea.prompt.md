Multi-line text. Same chrome, states and tokens as `Input`; `rows` is the only height control.
Always wrap it in `Field` — that supplies the label, the message and the aria wiring.

```jsx
<Field label="Shift note" hint="What the next shift needs to know.">
  <Textarea rows={4} placeholder="Line stopped 14:20, seal replaced." />
</Field>

<Field label="Query" error="Unbalanced parenthesis at line 2.">
  <Textarea rows={6} mono />
</Field>
```

`mono` also turns off spell-check and autocorrect — use it for queries, YAML, paths and logs.
Never `resize="both"`; it drags the control over whatever sits beside it. If you need a character
limit, pass `maxLength` **and** say the limit in the Field hint — truncation on paste is silent.
See `specs/forms/Textarea.spec.html`.
