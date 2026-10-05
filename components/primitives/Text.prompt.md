**Purpose** — every run of non-heading text. Text resolves family, size, weight, leading, tracking and colour from tokens in one decision, so no screen invents its own typography.

**Properties** — `as size weight tone family leading align caps numeric measure truncate block`.

**Variants** — body (`size="base"`, the default) · secondary/tertiary tone for supporting copy · `caps` micro-label for group headers · `family="mono"` for IDs, codes and timestamps · `measure="prose"` for long-form paragraphs.

**States** — `tone="disabled"` mirrors a disabled control. Status tones (success, warning, critical, info) are for text that carries the status itself, never for emphasis.

**Accessibility** — never below 11px, and 11px only with `caps`. Body copy is 13-14px. `tertiary` does not hold 4.5:1 at small sizes — it is for supporting copy the operator does not need to act on. Colour alone never carries meaning; pair a status tone with a word or icon.

**Responsive rules** — UI text is fixed at every breakpoint by design: a 13px label is 13px on a floor tablet and a 1440px monitor. Only `measure` responds, by capping the line, and only display type is fluid (see Heading).

**Do** — Pick a size and tone from the list and let the component set the rest.

**Don't** — don't use `bold` for more than one word in a sentence, don't set colour outside the tone list, don't use mono for prose, don't wrap a heading in Text.

**Examples**
```jsx
<Text tone="secondary" size="sm">Last synced 4 minutes ago</Text>
<Text family="mono" numeric>WO-88431</Text>
<Text caps tone="tertiary">Downtime</Text>
```
