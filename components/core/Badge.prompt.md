Status label — reads state, never used as decoration, never a button.

```jsx
<Badge tone="success" dot>Running</Badge>
<Badge tone="warning" icon="triangle-alert">Degraded</Badge>
<Badge tone="critical" dot aria-label="Down" />
<Badge size="sm">v2.4.1</Badge>
<Badge tone="accent" max={99}>{348}</Badge>
```

Tone carries the meaning: neutral for metadata, accent for the active thing, success/warning/critical for state. Text is one or two words, sentence case, from a fixed set the system owns — user- or data-derived text is `Tag`. A dot- or icon-only badge needs `aria-label`.
