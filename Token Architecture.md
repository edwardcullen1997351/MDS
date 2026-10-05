# Meridian — Token Architecture

Three tiers, one direction of reference. `readme.md` describes the **foundations** (the visual
decisions); this file describes the **token architecture** (how those decisions are encoded,
named and consumed). The two are deliberately separate documents: a foundation is a design
choice, a token is a contract. Changing a foundation is a design conversation; changing a token
name is a breaking change to every consumer.

Frozen 4 Sep 2026 · version 1.2.0 · source of truth `tokens/*.css` · mirror `tokens.json`

---

## 1. The three tiers

```
PRIMITIVE          SEMANTIC              COMPONENT
what it is    →    what it's for    →    where it's used
--grey-300         --border-strong       --card-border-hover
--blue-500         --action-solid        --button-primary-background
--space-4          --density-gap         --table-cell-padding-x
--radius-8         --radius-lg           --dialog-radius
```

| Tier | File | Count | May reference | Consumed by |
| --- | --- | --- | --- | --- |
| **1 · Primitive** | `tokens/colors.css`, `typography.css`, `spacing.css`, `radius.css`, `borders.css`, `elevation.css`, `opacity.css`, `iconography.css`, `motion.css`, `layout.css` | 263 | nothing — literal values only | the semantic tier, and nothing else |
| **2 · Semantic** | `tokens/semantic.css`, plus the role tokens in `radius.css` / `elevation.css` / `density.css` | 117 | primitives, or another semantic token | components, product code, the dark scope |
| **3 · Component** | `tokens/components.css` | 171 | semantics only | exactly one component each |

**The one-direction rule.** Cross-tier references only ever point *up* the list:
primitive ← semantic ← component. A component token that reads a primitive skips the theming
layer and breaks dark mode. A semantic token that reads a component token is a cycle. Both are
review-blocking.

**Same-tier aliases are legal inside tier 2, and only tier 2.** A semantic token may reference
another semantic token when two families must always share one value — `--surface-sunken` is
`var(--background-sunken)`, `--focus-border` is `var(--border-focus)`, `--selection-text-foreground`
is `var(--text-primary)`. That is the point of the alias: the two names exist because two
families need the slot, and the reference guarantees they can never drift apart. Seven such
aliases ship today. A component token, by contrast, never references another component
token — two components sharing a value share the *semantic* token above them.

**Never mix tiers in one declaration.** `border: 1px solid var(--grey-200)` inside a component
is wrong even though it renders correctly — the value is right and the *contract* is missing.

**Tier is a role, not a file.** `--radius-sm`, `--elevation-3`, `--row-h` and `--control-px-md`
are tier-2 tokens authored beside their numeric scale, because a radius role reads better next
to the radius scale than in a file of colour aliases. `tokens.json` groups by role
(`semantic.radius`, `semantic.elevation`, `semantic.density`, `semantic.control`), so the JSON
is the place to check a token's tier — not the filename.

**One exception to the literal rule.** Twenty tier-2 tokens hold literals because their
category has no numeric primitive beneath it: control and row geometry (`--control-h-md`,
`--row-h`, `--cell-py`), the composite focus rings, `--scrim` and `--blur-overlay`. A
box-shadow composite cannot be assembled from primitives without a colour-alpha function, and
inventing `--size-34` to back a 34px control height would be a fake primitive. Each carries
`$extensions["com.meridian.tier2Literal"]` so a linter can allow-list them precisely. **Tier 3
permits no literals at all, ever.**

### What belongs in each tier

- **Primitive** — a value that exists because the eye needs it: a ramp step, a spacing step, a
  radius, a duration. It has no opinion about usage. Adding a primitive is cheap; primitives
  are never referenced by product code, so an unused one is dead weight, not a risk.
- **Semantic** — a *job*: text, background, surface, border, action, success, warning, critical,
  info, focus, overlay, selection. This is the layer a rebrand and dark mode operate on, and the
  layer 90 % of product code should use. If two things must always change together, they share
  a semantic token.
- **Component** — one component's use of a semantic token, named after the component. Its whole
  purpose is to make a single component retheme-able without touching anything else: change
  `--button-primary-background` and only buttons move. **A component token is a rename, not a
  new value** — if you find yourself giving it a literal, the value belongs in the semantic tier
  first.

**When does a component token earn its place?** When the component is in the shipped inventory
and the property is one a consumer could plausibly want to override on its own. Not every
declaration needs one: geometry that follows the grid (`padding: var(--space-3)`), type sizes,
and transitions stay on the primitive/semantic tokens they already use.

---

## 2. Naming convention

### Pattern

```
Primitive   --<category>-<step|variant>
            --grey-300 · --blue-600 · --space-4 · --radius-8 · --duration-fast

Semantic    --<family>-<role>[-<state>]
            --text-secondary · --surface-hover · --action-solid-active
            --status-critical-soft · --border-strong · --focus-ring

Component   --<component>-[<variant>|<part>]-<property>[-<state>]
            --button-primary-background-hover
            --card-border-hover · --table-header-text · --input-border-invalid
```

Read a component token right to left and it tells you the whole story:
`--button-primary-background-hover` = *the hover state, of the background, of the primary
variant, of Button.*

### Slot vocabulary — fixed, not free text

| Slot | Allowed values |
| --- | --- |
| `<property>` | `background` · `foreground` · `border` · `text` · `shadow` · `radius` · `ring` · `height` · `padding-x` / `padding-y` |
| `<state>` | `hover` · `active` · `focus` · `selected` · `checked` · `disabled` · `invalid` |
| `<variant>` | the component's own `variant` / `tone` prop values — `primary`, `secondary`, `ghost`, `critical`, `link`, `solid`, `neutral`, `accent`, `success`, `warning` |
| `<part>` | a named sub-element the component renders — `header`, `footer`, `row`, `cell`, `track`, `knob`, `dot`, `mark`, `indicator`, `label`, `hint`, `title`, `message`, `scrim` |

`foreground` is for a fill-and-text pair (a solid button); `text` is for text that has no fill
of its own (a table header). Never both on one element.

### Standards

1. **Lowercase kebab in CSS, camelCase in JSON, nothing else.** `--button-primary-background`
   ⇄ `buttonPrimaryBackground`. The transform is mechanical in both directions, so neither
   file is authored by hand-translation.
2. **Singular nouns.** `--border-default`, never `--borders-default`.
3. **State goes last, always.** `--tag-background-selected`, never `--tag-selected-background`.
   States may **stack** when a token describes two at once: `--checkbox-background-checked-hover`
   is correct, because the rule forbids a *property* after a state, not a second state. Read it
   as "everything after the first state segment is also a state".
4. **No abbreviations** except the four already in the vocabulary: `bg` is banned, `px`/`py`
   are permitted in `padding-x`/`padding-y`, `x`/`y` for axes, `sm`/`md`/`lg`/`xl` for sizes.
5. **No negative names.** `--button-disabled-foreground`, never `--button-not-enabled-*`.
6. **No ordinals for meaning.** `--surface-1`, `--text-2` are banned; the two exceptions are
   deliberately ordinal — `--viz-1…6` (series order) and `--elevation-0…5` (z-order).
7. **Never name a token after a place or a screen.** `--dashboard-background` is banned at
   every tier; a screen is not a component.
8. **Never put a hue in a semantic or component name.** `--blue-text` is banned; the whole
   point of the tier is that the hue can change.
9. **Component names match the component exactly.** `Button` → `--button-*`, `IconButton` →
   `--icon-button-*`. PascalCase becomes kebab; no prefixes, no abbreviations.
10. **The grey ramp is spelled `grey`** in CSS and JSON alike. One spelling, everywhere.
11. **Additive only.** Adding a token is a minor version. Renaming or removing one is major and
    invalidates every pinned consumer bundle — see `readme.md` → Foundations.

### Anti-patterns

| Wrong | Right | Why |
| --- | --- | --- |
| `--button-blue` | `--button-primary-background` | hue in the name; says nothing about the job |
| `--card-bg` | `--card-background` | abbreviation |
| `--selected-tag-background` | `--tag-background-selected` | state must be last, component first |
| `--table-header-color` | `--table-header-text` | `color` is a CSS property, not a role |
| `--primary` | `--action-solid` | unscoped; "primary" is a variant, not a family |
| `--button-padding: 12px` | `padding: var(--space-3)` | a component token that adds no contract |
| `--modal-*` | `--dialog-*` | the component is called Dialog |

---

## 3. JSON structure

`tokens.json` is a [DTCG](https://tr.designtokens.org)-shaped mirror, generated from the CSS.
The CSS is the source of truth — edit `tokens/*.css` and regenerate; never hand-edit the JSON.

```json
{
  "primitive": {
    "color":  { "blue600": { "$type": "color",     "$value": "#2143e6" } },
    "space":  { "space4":  { "$type": "dimension", "$value": "16px" } },
    "radius": { "radius8": { "$type": "dimension", "$value": "8px" } }
  },
  "semantic": {
    "action":  { "actionSolid":  { "$type": "color", "$value": "{primitive.color.blue600}" } },
    "surface": { "surfaceCard":  { "$type": "color", "$value": "{primitive.color.grey0}" } },
    "border":  { "borderStrong": { "$type": "color", "$value": "{primitive.color.grey300}" } }
  },
  "component": {
    "button": { "buttonPrimaryBackground": { "$type": "color", "$value": "{semantic.action.actionSolid}" } },
    "card":   { "cardBorder":              { "$type": "color", "$value": "{semantic.border.borderDefault}" } },
    "table":  { "tableHeaderText":         { "$type": "color", "$value": "{semantic.text.textTertiary}" } }
  },
  "theme": { "dark": { "surfaceCard": { "$value": "{primitive.color.grey900}" } } }
}
```

**Structure rules**

- **Three top-level tiers plus `theme`.** Nothing else at the root except `$description` and
  `$extensions`.
- **Tier 2 is the category** (`primitive.color`, `semantic.action`, `component.button`) and
  tier 3 is the token. Depth is exactly three levels, always — no deeper nesting, so a path is
  always `tier.category.token`.
- **Leaf keys are globally unique** and carry their category in the name
  (`buttonPrimaryBackground`, not `button.primary.background`), which is what keeps the
  round-trip to a flat CSS custom property lossless.
- **`$value` is a literal only in the primitive tier.** Above it, `$value` is always a
  `{dotted.path}` reference — pointing at tier 1, or at a sibling in tier 2 for the same-tier
  aliases described above. A literal in tier 2 or 3 is a lint failure; a
  `component.* → component.*` reference is too.
- **`$type`** is one of `color` · `dimension` · `duration` · `number` · `shadow` ·
  `fontFamily` · `fontWeight` · `other`. `other` covers CSS-specific composites (easing
  curves, transition shorthands, keyframe shorthands, blur filters) that DTCG has no type for.
- **`theme.dark`** overrides canonical semantic names only. Component tokens are never listed
  there — they inherit through their references, which is the entire reason the tier exists.

**Regenerating.** `node tools/build-tokens.mjs` (or `npm run tokens:build`). The transform is
mechanical: token name → `camelCase`, role → category, `var(--x)` → `{path.to.x}`. Any
consumer pipeline (Style Dictionary, Tokens Studio, a Swift/Kotlin emitter) can read
`tokens.json` directly; nothing in it is CSS-specific except the `other` values.

**Enforcement.** `npm run verify` = `build-tokens.mjs --check` + `lint-tokens.mjs`. The
linter checks tier references, the literal allow-list, the naming standards and colour-primitive
leakage in component and UI-kit source; it exits non-zero on any violation. `tools/tokens.html`
runs the identical module in the browser for anyone without Node. Every rule in this document
is machine-checked except the judgement calls in §1 (*what belongs in each tier*) — those still
need a human.

**Deliberate exemption.** Type, spacing, motion, border widths and icon sizes have **no
semantic tier**, so components read `var(--text-sm)` and `var(--space-3)` directly and the
linter permits it. A font size has no "job" to abstract and no dark variant; inventing
`--text-body` as an alias of `--text-base` would add a layer that never changes. This makes
the three-tier claim a **colour-and-geometry** claim, which is the honest scope: colour is
where theming lives, and colour is where the tier is enforced absolutely.

---

## 4. Consuming the tiers

```html
<link rel="stylesheet" href="styles.css">   <!-- all three tiers, in order -->
```

`styles.css` imports the tiers in dependency order: primitives → `layout` → `density` →
`semantic` → `components` → `base`. Import order is load-bearing; do not reorder.

**Which tier should product code use?**

| Situation | Use |
| --- | --- |
| Styling a shipped component | nothing — the component owns its tokens |
| Retheming one component in one product | its **component** tokens |
| Building new UI from scratch | **semantic** tokens |
| Building a chart, or anything ordered | `--viz-1…6` (primitive, by design) |
| Anything else | **semantic** — if no semantic token fits, add one |

**Never** reference a primitive from product code. `var(--grey-200)` renders correctly in
light mode and wrongly in dark, and the linter cannot tell you which of the two you meant.
