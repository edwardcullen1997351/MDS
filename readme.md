# Meridian Design System

Meridian is a **Swiss-technical console system**: a dense, light-first interface language for
manufacturing operations software. Hairline borders carry the structure, one saturated blue
carries every action, and type does the rest. It is built for screens where 300 machine
rows and a shift-long output chart have to sit on the same page without shouting.

## Provenance — read this first

This system was authored **from scratch, with no brand inputs**. The opening brief said only
"Organization Design System"; no codebase, Figma file, deck, logo, font binary, or screenshot
was attached, and the direction question was answered *decide for me*.

That means everything below is a **proposal, not a recreation**:

| Thing | Status |
| --- | --- |
| Sources given | None. No Figma links, no GitHub repos, no codebase paths, no decks. |
| Brand name "Meridian" | Invented as a neutral placeholder. Rename freely. |
| Logo / brand mark | **None exists.** The wordmark is plain type (Public Sans 600, −0.045em) and the console uses a plain "M" square. Nothing was drawn or reconstructed. |
| Fonts | **Substituted.** Public Sans (UI/display) and IBM Plex Mono (data) are loaded from Google Fonts because no font files were supplied. |
| Icons | **Substituted.** Lucide 0.469.0 via the `lucide-static` CDN, tinted with a CSS mask. |
| Product surface | One: a plant operations web console (chosen in the brief). No marketing site, docs site or mobile app. |
| Component inventory | No source defined one, so the standard primitive set was authored (see below). |
| Photography / illustration | None. No imagery was supplied and none was generated. |

**If you have the real thing** — brand fonts, a logo, a Figma library, a repo — hand it over and
this system should be re-derived from it rather than adjusted on top of these guesses.

## Architecture in one line

**Foundations** are the visual decisions (`readme.md`, `Design Principles.md`); **tokens** are
how they are encoded (`Token Architecture.md`). They are never mixed: primitives hold values,
semantics hold jobs, component tokens hold usage, and references only ever point one way —
`--grey-300` → `--border-strong` → `--card-border-hover`. Product code touches the semantic
tier, or a component's own tokens; never a primitive.

## Component Architecture — The 3-Tier Hierarchy

Authoring and PR review use the [Component Accessibility Specification Template and Definition of Done](guidelines/component-accessibility.md).

The Meridian component library is structured into **three canonical tiers of classification**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MERIDIAN DESIGN SYSTEM                          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
   1. PRIMITIVES              2. COMPONENTS              3. COMPOSITES
   (Foundational)            (Single-Purpose)             (Multi-Part)
```

1. **Tier 1: Primitives (Foundations & Layout)**
   - Low-level layout, geometry, and typographic wrappers with zero business logic.
   - Props directly consume token scales (`gap`, `p`, `tone`, `radius`).
   - *Inventory:* `Box`, `Stack`, `Grid`, `Container`, `Spacer`, `Divider`, `Text`, `Heading`, `Surface`, `Image`, `AspectRatio`.
   - *Governance:* Documented by `.d.ts`, `.prompt.md`, `scale.js`, and `guidelines/primitives-policy.card.html`.

2. **Tier 2: Components (Single-Purpose UI Elements)**
   - Standard UI controls and building blocks. Organized across five functional sub-domains:
     - **Core / General:** `Button`, `IconButton`, `ButtonGroup`, `Avatar`, `AvatarGroup`, `Badge`, `Chip`, `Tag`, `Card`, `Link`, `SegmentedControl`, `Fieldset`, `Icon`.
     - **Forms:** `Input`, `Textarea`, `Select`, `Checkbox`, `CheckboxGroup`, `Radio`, `RadioGroup`, `Switch`, `Slider`, `RangeSlider`, `DatePicker`, `TimeField`, `Autocomplete`, `Combobox`, `MultiCombobox`, `FileDropzone`, `FileItem`.
     - **Feedback:** `Alert`, `Dialog`, `Drawer`, `Popover`, `Tooltip`, `Toast`, `Snackbar`, `Progress`.
     - **Navigation:** `Tabs`, `Breadcrumb`, `Menu`, `Pagination`, `StepNavigation`, `SequentialNavigation`, `GlobalNavigation`, `LocalNavigation`, `InPageNavigation`, `TreeNavigation`, `ScopeNavigation`.
     - **Data:** `Table`, `List`, `DescriptionList`, `Tree`, `EmptyState`, `Skeleton`, and Data Visualizations (`BarChart`, `LineChart`, `AreaChart`, `PieChart`, `Heatmap`, `GeoMap`, `GanttChart`, `ScatterPlot`, `Treemap`, `NetworkDiagram`, `ParallelCoordinates`, `DistributionPlot`, `RangeChart`, `SankeyDiagram`, `TreeDiagram`).
   - *Governance:* Every component is governed by a 14-section specification (`.spec.html`) and contract tests.

3. **Tier 3: Composites (Multi-Part Assemblies & Compound Widgets)**
   - Coordinated multi-component assemblies that introduce specialized contracts, multi-field synchronization, or aggregate business workflows.
   - *Inventory:* `DateRangePicker`, `DateTimePicker`, `FileUpload`, `ScopePicker`, `SearchField`, `SortableCollection`, `SplitButton`, `Toolbar`, `TelemetryConsole`.
   - *Governance:* Governed by `guidelines/composite-spec-standard.card.html`.

## Foundations — frozen 4 Sep 2026

The token layer is closed. Every foundation has tokens **and** a specimen card in
`guidelines/`: primitive palette (8 ramps) · 12 semantic families · typography (families,
weights, scale, responsive display sizes, line heights, letter spacing, paragraph spacing,
code) · spacing · radius · elevation 0–5 · opacity · borders · iconography · illustration ·
motion · animation · density · responsive · grid.

Five rules that come with the freeze:

1. **Never mix foundations and tokens.** A foundation is a design decision; a token is a
   contract. `readme.md` and `Design Principles.md` own the first, `Token Architecture.md`
   owns the second.

2. **One name per value — there are no aliases.** `--accent-*`, `--status-danger-*`,
   `--text-danger`, `--surface-page` and `--amber-*` were retired on the freeze; use
   `--action-*`, `--status-critical-*`, `--text-critical`, `--background-page` and
   `--orange-*`. Component props keep `tone="danger"` / `variant="danger"`: *Critical* is the
   severity word, `danger` is the prop value, and both resolve to the same tokens.
3. **Additive changes only — from here.** A new token is fine; renaming or removing one is a
   breaking change to every consumer and needs a version bump, not an edit. Note that the
   freeze itself shipped a breaking rename: the retired names in (1) and the radius change in
   (3) invalidate any consumer pinned to a pre-freeze `_ds_bundle.js`. Re-pull the bundle and
   the stylesheet together — a new bundle against an old `styles.css` (or the reverse) renders
   transparent buttons and missing table bands, because the dead `var(--…)` simply resolves to
   nothing.
4. **The contract is enforced, not just documented.** `npm run verify` runs
   `build-tokens.mjs --check` (is `tokens.json` in sync with the CSS?) and
   `lint-tokens.mjs` (does every token obey its tier and the naming standard?). Both exit
   non-zero on failure — run them in CI.
5. **Radius moved to an even scale** (0/2/4/6/8/12/16/24/full). The house corner is now 4px,
   cards 6px, dialogs 8px — every component tightened by 1–2px on the freeze.

### What "frozen" means for a component

Used on every component spec's masthead since 4 Sep and never defined until 1.15.1. A component
is **frozen** when all five hold:

1. **A 14-section spec exists** — Purpose, Anatomy, Properties, Variants, Sizes, States, Keyboard,
   Accessibility, Motion, Content Rules, Responsive, Anti Patterns, Implementation Notes,
   Developer Notes. Sections that genuinely do not apply say so and say why; they are not omitted.
2. **Its API is closed.** Additive props are fine; renaming or removing one is a breaking change
   needing a version bump, not an edit — the same rule the token freeze carries.
3. **Its geometry and colour are in tokens**, not hard-coded in JSX, so a product can re-scale it
   without forking. This is what `Badge` 1.8.0 and `Table` 1.14.0 were about.
4. **Every interactive element is a real control** — focusable, keyboard-operable, named. The
   recurring defect in this system is an element that looks interactive and answers only a mouse
   (`Dialog`'s `<th onClick>`, `Table`'s `<tr onClick>`, `Card`'s fake `interactive`).
5. **No dead tokens, and zero open items.** Anything deferred is either closed as decided —
   with the decision and its reason, so it cannot return as a fresh question — or the component
   is not frozen yet, it is `built <version>`. The `guidelines/promotion-policy.card.html` card
   owns this and two rules the list above does not: **freeze follows a consumer, not a build**
   (`FileUpload` was built at 1.30.0 and frozen at 1.30.1, two props found in between), and
   unfreezing is a breaking change with a version and a note.

There is no second status. **"Hardened" is not a rank** — it describes the work done in a pass, and
three specs (`Dialog`, `Table`, `Card`) briefly carried it in the masthead's status slot where a
freeze date belongs, which made it read as a tier below frozen. All three met the five criteria and
are stamped `frozen 5 Sep 2026`; "hardened" now appears only in changelog prose.

**Open — glyph files are not vendored.** `Icon` can now be pointed at a local path, but
`assets/` is still empty, so the product depends on unpkg at runtime. Copy
`lucide-static/icons/*.svg` into `assets/icons/` and call `Icon.setBasePath('/assets/icons/')`
at startup.


## Index

| Path | What it is |
| --- | --- |
| `reference-assembly-standard.md` | **Reference assembly operating standard** — governs proposal, ownership, required artifacts, implementation evidence, certification gates, auditing, refinement, exceptions, versioning, deprecation, and retirement for enterprise reference assemblies. |
| `Token Architecture.md` | **The token contract** — three tiers (primitive → semantic → component), naming convention, naming standards, JSON structure, and which tier product code may touch. Read before adding or renaming any token. |
| `Design Principles.md` | **North star** (includes the manufacturing terminology, tenancy and lifecycle rules) — design philosophy, UX / accessibility / motion principles, visual language, interaction philosophy, consistency rules, decision framework, terminology and naming rules. Read this before making a call the readme doesn't answer. |
| `styles.css` | The one file consumers link. `@import`s everything below. |
| `tokens/fonts.css` | Webfont imports (Google Fonts). |
| `tokens/colors.css` | Primitive palette: eight ramps (gray, blue, green, red, orange, yellow, purple, teal) + the viz series. |
| `tokens/typography.css` | Families, size scale, weights, tracking. |
| `tokens/spacing.css` | 4px space scale, control heights, layout frame. |
| `tokens/radius.css` | Corner radius scale (0–24 + full) and its named roles. |
| `tokens/borders.css` | Border widths, composites, dashed rule, divider inset. |
| `tokens/opacity.css` | Opacity scale and compositing roles. |
| `tokens/iconography.css` | Icon sizes, stroke, grid, gaps, status dots. |
| `tokens/layout.css` | Breakpoints, grid, containers, z-index ladder, layer geometry. |
| `tokens/density.css` | `[data-density]` compact / comfortable / expanded scopes. |
| `tokens/elevation.css` | Shadows, focus rings, scrim, blur. |
| `tokens/motion.css` | Durations, easing, transition composites, the six animation keyframes, reduced-motion. |
| `tokens/semantic.css` | Tier 2 — the twelve semantic families + the `[data-theme="dark"]` scope. |
| `tokens/components.css` | Tier 3 — 171 component tokens, one group per component, referencing semantics only. |
| `tokens/base.css` | Element defaults (body, headings, links, selection). |
| `components/primitives/` | Box, Surface, Container, Stack, Grid (+ GridItem), Spacer, Divider, AspectRatio, Image, Text, Heading — the layout and typography layer everything else is built from. **These deliberately have no specs** — see `guidelines/primitives-policy.card.html`. Shared token resolvers and their validation live in `scale.js`. |
| `components/core/` | Icon, Button, IconButton (**box sized from `--control-h-*`, so it follows `[data-density]` and always matches a `Button` of the same `size`; `variant="danger"` is the filled critical fill, added additively when `SplitButton` needed a destructive cap**), ButtonGroup, SegmentedControl (**the mode switch — a value, not panels; `Tabs variant="pill"` is the same paint with tab semantics**), Link, Card, Badge, Tag (+ TagList), Chip, ChipGroup, Fieldset, Accordion (+ AccordionItem). Also `anchor.js` — the shared `useAnchor` engine behind every anchored surface (Combobox, Autocomplete, MultiCombobox, DatePicker, Menu, Tooltip, Popover); it sits at tier 2 because all seven consumers are tier 3. **Avatar** (+ **AvatarGroup**) — a person or a machine, with **no colour identity**: every ramp here already means something, so initials identify and only the presence dot is coloured. |
| `components/forms/` | Field, Input, Textarea, Select, Checkbox (+ CheckboxGroup), Radio (+ RadioGroup), Switch, Slider (**a value on a range — never a gauge; it may not borrow `--progress-*`**), Combobox, Autocomplete, DatePicker (ISO strings, never `Date`; date maths in `date.js`), TimeField (`'HH:mm'` strings; `time.js`). For an instant use **DateTimePicker** (composite), which converts via `zone.js` — the system's timezone capability, added at 1.28.0: `Intl` carries the database, no `Date` leaves the file, and the wall-clock → instant direction reports non-existent and twice-occurring clock times rather than guessing. **MultiCombobox** — several values from a known list; tokens in the box, a list that stays open, Backspace to remove. Not `Combobox multiple`. **RangeSlider** — two thumbs, one range; a sibling of Slider, not a prop on it. **FileDropzone** and **FileItem** — the file-selection capability added at 1.29.0 to close the upload gap: `FileDropzone` owns picking, dropping and validation (`accept`, `maxSize`, `maxFiles`) and returns accepted and rejected lists; `FileItem` owns one file's identity, size, state and removal, with a determinate progress bar only. **Neither uploads** — transport, retry and cancel stay with the consumer, so a `FileUpload` composite assembles these two rather than hiding a transport layer. Three helpers ship beside them — `validateFiles`, `formatBytes` and `fileGlyph` (extension → Lucide glyph name, for file rows rendered outside `FileItem`, which carries no file-type glyph by design). All three are package imports only — lowercase exports stay bundle-internal and never reach `window.<Namespace>`, so cards and spec pages cannot call them. |
| `components/navigation/` | Tabs (+ TabPanel), Menu (+ MenuList), Breadcrumb. |
| `components/composite/` | **Toolbar** — the first composite: a semantically related action set on one context, as one operable surface. It owns only what the parts cannot — the `role="toolbar"` boundary and accessible name, one tab stop with a coordinated arrow contract (the main axis belongs to the toolbar; the cross axis stays with a `SegmentedControl`), the visible/overflowed relationship, one coordinated control `size` (`sm`/`md`, no `lg`), and an aggregate disabled state via native `fieldset`. Composed from Box, Divider, Button, IconButton, ButtonGroup, SegmentedControl, Menu. **SearchField** — query entry with search semantics: the query contract (`value`/`onChange`, clearing as an ordinary value change), the `role="search"` boundary and scope name, clear and submit as permanently separate actions, and one `size` across field, clear and submit. Composed from Box, Text, Input, Icon, IconButton, Button; it owns no results, suggestions or counts — suggestions are `Autocomplete`. **SplitButton** — one default action with its close alternatives one press away: it owns the *relationship* — which action is primary, that the disclosure never invokes it, one aggregate disabled state across both surfaces, two distinct accessible purposes (the cap is named "More &lt;label&gt; actions", never a second "Save"), matched geometry with a single seam, and the menu's ownership by the cap. Composed from Box, Button, IconButton, Menu, MenuList, Icon; only `link` is refused (no height, no border, no seam). `danger` is supported — it drove an additive Core change, `IconButton variant="danger"`, since a critical cap could not be drawn in action blue. Not `ButtonGroup` (peer actions), not a `Menu` with a lettered trigger (no default), and never a space-saving device. **DateRangePicker** — two dates that mean one bounded interval: one range value (`[start, end]`, `DatePicker`'s own pair shape), ordering, cross-field validation and which endpoint a failure implicates, per-endpoint `<label>` identity and validation association (it republishes a distinct `FieldContext` per endpoint — two pickers under one `Field` would share an id — and claims the outer `Field`'s label as the *group's* name rather than letting it become a second label on the start input), bounds on each endpoint derived from the other, and an arrangement that may stack without reordering time. A half-filled range is invalid by default (`allowPartial={false}`), though the message waits until the empty endpoint has been visited and left — while `onValidityChange` reports the truth immediately, since a submit gate must not depend on where the caret has been. Composed from Box, Text, DatePicker, Icon, optional Field. **Not `DatePicker range`** — that is one control with one shared panel, presets and swapping ends, right for picking a window on a calendar; this is for forms that name, bound, validate and describe each endpoint separately. **DateTimePicker** — one moment assembled from a date and a wall-clock time: it owns assembly/disassembly, explicitly defined partial behaviour (**nothing is inferred** — no midnight, no today), combined validation against bounds compared at the precision given (a date-only `max` means the *end* of that day; time bounds bind only on a boundary day), per-half `<label>` identity and validation association, and reflow that never reorders date and time. The value is **a UTC instant** when the record's Site `zone` is given — stored in UTC, edited on that Site's clock with the zone named beside the field, never the browser's zone; real conversion via `components/forms/zone.js`, added for it (`Intl` carries the zone database, no `Date` leaves the file). Two states only visible once conversion is real, both composite-owned: a clock time that **does not exist** (spring forward) is invalid and emits nothing, and one that happens **twice** (autumn back) uses the earlier occurrence and discloses it. Omitting `zone` gives an explicit **floating wall clock** (`'YYYY-MM-DDTHH:mm'`) for a value that genuinely has no zone — a shift template — which never pretends to be an instant. Composed from Box, Text, DatePicker, TimeField, Icon, optional Field. All written against `guidelines/composite-spec-standard.card.html`; specs in `specs/composite/`.  **FileUpload** — one attachment set on one record, added 1.30.0: it assembles `FileDropzone` + `FileItem` in a `Field` and owns the only thing neither part can see — the set's aggregate status (`idle` / `busy` / `failed` / `invalid`), reported through `onStatusChange`, which is what makes a surface's Save or Release button correct. Controlled only; it stores nothing and uploads nothing. **ScopePicker** — several hierarchy nodes as ONE scope value, added at 1.30.0 with `Tree`: the field a rework charge, a BOM revision or a PM plan states its coverage in. It owns three contracts no part can hold — the value is the **covering set** (the shallowest nodes that imply the rest, normalised in both directions, so ticking four presses stores one id and a form can never submit a scope other than the one it displayed); **completeness**, since a selected branch with unfetched children makes the scope *provisional* and only the assembly can see it (`Tree` sees nodes, the form sees ids); and that **the query and the tree agree** — hits arrive with their ancestors, each path opens, the operator's own expansion returns when the query clears, and the scope is never touched by filtering. Composed from Tree, SearchField, Text. Not `Tree` (browse, no value), not `MultiCombobox` (flat), and it owns no Apply button — the commit is the surrounding form's. **SortableCollection** — the mechanics of moving an item to a new position, promoted from the direct-manipulation-of-order pattern: it owns the grab (identity <em>and</em> origin index), the modal keyboard grab with its arrow/Home/End/Escape contract, the insertion indicator, per-candidate-position legality declared through `canDrop` as a <em>reason</em> rather than a boolean, bounded auto-scroll, the position text on every row, and the announcements — while owning no commit at all: `items` is the consumer's committed order and the component never reorders it, calling `onMove(id, fromIndex, toIndex)` and leaving the write, the optimism and the rollback where they belong. Composed from IconButton. Not `Table`'s column sort (a view, nothing committed), and not transfer between two collections, whose commit spans both and stays a pattern. |
| `components/feedback/` | Dialog (**the system's modal — there is no separate `Modal`**), Drawer (the side surface; `modal={false}` for a non-blocking inspector), Progress (work in flight — **never a level**; there is no separate `Spinner`), Toast (+ Toaster), Snackbar, Alert, Tooltip, Popover. The anchoring engine these last two share moved to `core/anchor.js` at 1.27.0 — see the tier note below. The Toast / Snackbar / Alert boundary is documented in `guidelines/feedback-boundaries.card.html`. |
| `components/data/` | Table — reads `--row-h`, `--header-h`, `--cell-px`, `--cell-py` so it responds to `[data-density]`; Pagination; Skeleton. **EmptyState** — the absence of data, explained; `variant` names the *situation* (`first-run` / `no-results` / `cleared` / `restricted`) because "empty" is four unrelated cases and one message cannot serve them. **List** (+ **ListItem**) — the run of records `Table` refuses; the row is **not** a control. **DescriptionList** — one record's fields as a real `dl`; the term column is one width down the list. **Tree** — the **nested** collection, shipped at 1.30.0 alongside `FileUpload` to close the hierarchical-collection gap: `List` is flat, `Accordion` is one level with a tab stop per header, `Menu` closes on selection and a `Table` row group is not a parent, so nesting any of them yields indentation without tree semantics. It owns generic tree semantics (`role="tree"`/`treeitem`/`group` with level and position), **expansion state separable from selection** (collapsing never deselects), and one tab stop with the full tree keyboard contract over the flattened visible order — which is why its shape is `items` data, not composed children. Here the row **is** a control, which reverses nothing: what `List` and `Card` refuse is a mouse-only row with no role, tabindex or keys. It follows that a tree row hosts no commands and no nested `Checkbox` — commands act on the selection from the pane beside the tree. |
| `guidelines/*.card.html` | 37 foundation specimen cards feeding the Design System tab — including `feedback-boundaries`, the one decision card for the notice family: an **event** off-screen → Toast, an **event** on the surface in view → Snackbar, a **condition** that persists → Alert. |
| `assets/` | Empty by design (`icons/README.md` carries the Lucide vendoring recipe) — no logo, imagery or icon binaries were supplied. |
| `SKILL.md` | Agent Skills front matter for use in Claude Code. |

Every component directory carries `<Name>.jsx`, `<Name>.d.ts` (props contract) and
`<Name>.prompt.md` (what & when, usage example, variants), plus one `@dsCard` HTML.

### Counting components

**67 components.** primitives 12, core 17, forms 16, feedback 9, data 8,
navigation 5.

Do not trust that number — re-derive it. `_ds_manifest.json` is generated from
the sources and is the only authority; the count above is a convenience and
will rot the moment a component lands without this line being touched.

Run `npm run build:browser-artifacts` to refresh the manifest's card, template,
theme and token inventories, then rebuild `_ds_bundle.js` from the public
component entries in the manifest. `npm run check:browser-artifacts` performs
the same build in memory and fails if either generated file is stale. When the
browser API adds or removes a public component, update its entry in
`_ds_manifest.json` before rebuilding.

The namespace carries **69** names, not 67, and the difference is a rule rather
than an oversight: only **capital-initial** exports reach
`window.<Namespace>`, so anything capitalised is published whether or not it
is a component. `FieldContext` is the one non-component that qualifies, and it
is deliberate — `Field`'s spec documents it and nine controls read it. Every
other shared internal is lowercase on purpose (`useAnchor`, `anchorStyle`,
`useImageFallback`, `chipContext`, `deriveInitials`, and every resolver in
`primitives/scale.js`). A capitalised helper is a published API by accident:
`TEXT_SIZES` was one until 1.27.5.

### The three tiers, and which way imports may point

The folders above are **siblings on disk but ordered by dependency**, and the
order is enforced by what each may import:

| Tier | Folders | May import from |
| --- | --- | --- |
| 1 | `primitives/` | itself only — it is the leaf |
| 2 | `core/` | tier 1, and itself |
| 3 | `forms/` · `navigation/` · `feedback/` · `data/` | tiers 1–2, and **each other** |

Read the tiers as *dependency direction*, not containment: `forms/` is not part
of `core/`, it **depends on** core — nearly every tier-3 file imports `Icon` or
`IconButton`. That is why they are not nested inside `core/`; a child folder
that imports its parent states the relationship backwards.

**Tier 3 is unordered peers, not a chain.** `data/Table` imports
`forms/Checkbox` and `data/Pagination` imports `forms/Select`, and both are
correct — a table with selectable rows needs the system's real checkbox, not a
second one. Do not "fix" these by duplicating a control or by hoisting it into
`core/`; sideways imports within tier 3 are legal by design.

The rule with teeth is the one that runs the other way: **nothing in tier 1 or 2
may import from tier 3.** `core/AvatarGroup` did, once — it reached for
`feedback/Tooltip` to name its overflow chip — and 1.26.0 removed the edge
rather than relocating it.

**The rule is enforced, not remembered.** `layer-violation` in
`tools/check-contracts.mjs` fails on any upward edge, and `npm run verify`
already runs it. It flags upward edges only; sideways within tier 3 passes.

A module that several tier-3 folders share therefore cannot itself live in
tier 3 — its consumers' imports would be sideways only by luck. That is why
`anchor.js` moved from `feedback/` to `core/` at 1.27.0: seven consumers
across three tier-3 folders. Uncapitalised, so it stays bundle-internal like
`primitives/scale.js` and `primitives/media.js`.
Components are exposed at `window.MeridianDesignSystem_962c43.<Name>`.

### Intentional additions
No source defined the inventory, so the standard set was authored. Beyond the usual list:

- **Icon** — a wrapper is required because the glyph set is a CDN substitution; centralising it
  means one edit swaps Lucide for real brand glyphs later.
- **Field** — label/hint/error wrapper; without it every consumer re-invents form rhythm.
- **Textarea** — the console has query and description inputs that a single-line `Input` can't hold.
- **Table** — a platform console is mostly tables; omitting it would push the most important
  pattern in the product into ad-hoc markup.

- **Accordion** — settings and detail screens ran long enough that products were hiding
  sections behind ad-hoc chevrons; one disclosure stack with a real keyboard story replaces them.

Not built (no evidence they are needed): Avatar, and `DateTimePicker` — the
fused single-input instant, deferred at 1.21.0, its timezone question settled at 1.21.2 and its
practical route shipped at 1.22.0 (`DatePicker` + `TimeField`). It now waits only on a product
that needs one instant in one input; see TimeField §13.
(`Slider` was on this list until 1.23.0; the evidence was a token rule written against a component
that did not exist — Progress §07 refused to lend it `--progress-*` and described its role in the
conditional. It ships with its own `--slider-*` group and that refusal intact.)
(`Drawer` was on this list until 1.19.0; the evidence was the console kit's own local
`LineDrawer`, which had no focus trap, no restore, no Escape and no accessible name.)

## Content fundamentals

**Voice.** Terse, factual, operator-to-operator. Meridian states what happened and what will
happen next; it does not congratulate, apologise at length, or sell inside the product.

- **Person.** Address the user as **you**; the product never says "I". Use "we" only for
  Meridian-the-company in billing and legal copy ("We charge on the 1st").
- **Casing.** **Sentence case everywhere** — buttons, headings, menu items, table headers
  excepted (headers are UPPERCASE with `--tracking-caps`). Never Title Case A Button.
- **Punctuation.** No exclamation marks, ever. Full stops in hints, descriptions and body copy;
  **no** full stop on button labels, badges, table cells or single-line toast titles.
- **Emoji.** Never — not in UI, not in empty states, not in docs headings.
- **Numbers.** Always with a unit and a thin space: `142 ms`, `1,984 req/s`, `99.982 %`.
  Deltas carry a sign and use a true minus: `−11 ms`, `+0.09 pt`. Mono face, tabular figures.
- **Machine strings** (IDs, keys, filters, SHAs, regions) are always mono: `i-0a91f2c`,
  `env:prod`, `sha 4b19e07`.

Specific examples, all drawn from the shipped kit:

| Context | Write | Not |
| --- | --- | --- |
| Toast title | `Deploy queued` | `Success! 🎉` |
| Toast body | `Rollout starts in a few seconds.` | `Your deployment has been successfully queued.` |
| Field error | `Must be under 30000.` | `Invalid input` |
| Confirm dialog | `Delete cluster?` + `Delete cluster` | `Are you sure?` + `OK` |
| Button | `New service` | `Create New Service` |
| Switch label | `Auto-scale replicas` | `Enable auto-scaling` |
| Empty state | `No services match that filter` | `Nothing here yet!` |
| Tooltip | `p95 over the last hour` | `95th percentile latency metric value` |
| Marketing line | `Observability, in one pane` | `Supercharge your observability journey` |

Headline copy (sign-in, empty states) is the one place the voice loosens: short declarative
noun phrases, 3–6 words, no verb inflation. Never a question, never a pun.

**Labels vs. state.** `Badge` copy is one or two words the *system* owns (Healthy, Degraded,
Failing, Acknowledged). `Tag` copy is `key:value` the *user* owns (`env:prod`).

## Visual foundations

**Colour.** Eight primitive ramps; one saturated hue (Meridian Blue, action colour
`--blue-600` #2143e6) against a cool-leaning 12-step grey ramp. Green / orange / red / teal
exist **only** to carry state (Success / Warning / Critical / Info) — never as decoration,
never as a category colour. Yellow is Changeover and planned stops only; purple is the one
ramp with no state attached, so charts can use it freely. Use the ordered `--viz-1…6` series
for series identity. Product code touches only the twelve semantic families: Background,
Surface, Border, Text, Action, Success, Warning, Critical, Info, Focus, Overlay, Selection.
Backgrounds are flat: page `--grey-50`, cards `--grey-0`. **No gradients** anywhere except a
single vertical blue fill inside chart bars and the solid brand panel on the sign-in screen.
No purple-blue hero gradients, no mesh, no glow.

**Type.** Two families, no third. Public Sans for everything human; IBM Plex Mono for
everything machine-generated or numeric. 14px UI base; 13px for controls and table cells; 12px
hints; 11px uppercase overlines with 0.08em tracking. Display sizes (36–64px) run **light (300)**
with −0.022em tracking — the only place weight 300 appears. Headings are 600. Body is 400.
Controls and tabs are 500. Line-height 1.5 body, 1.2 headings. `text-wrap: pretty` on paragraphs.

**Spacing & density.** Strict 4px rhythm (with one 2px optical half-step); 12px inside controls, 16px between fields and cards,
24px between page sections and as page padding. Control heights 28 / 34 / 40px with 34 the
default — this is a console, not a landing page. `[data-density]` offers compact (28px controls,
36px rows), comfortable (the default) and expanded (44px controls, 56px rows) on any subtree;
density changes geometry only, never type, colour or radius. Table rows are 44px; table headers 36px.
Layout frame: 236px sidebar (56px collapsed), 52px topbar, 1240px content max, centred.

**Borders & cards.** The border *is* the elevation system. A card is
`background var(--surface-card)` + `var(--border-hairline)` + `--radius-md` (6px) +
`--shadow-xs`. Card headers and footers are separated by `--border-subtle` hairlines; footers
sit on `--background-page` so action rows read as a distinct band. Corner radii run on an even scale — 0 / 2 / 4 / 6 / 8 / 12 / 16 / 24 / full: 2px chips and
checkboxes, **4px the house corner** (buttons, inputs, tags), 6px cards, 8px dialogs and
drawers, 12px full-bleed panels, 16 and 24 reserved, pill only for switches, radios and status
dots. Never a coloured left-border accent card.

**Shadows.** Five steps, all cool-black at low alpha, all with tight blur. `xs` for resting
cards and buttons, `sm` sticky bars, `md` menus and tooltips, `lg` toasts and drawers,
`xl` dialogs. Inner shadow exists (`--shadow-inset`) but is used only on dark surfaces.

**Interaction states.** Hover tints the surface (`--surface-hover`) and strengthens the border
to `--border-strong`; solid buttons go one step darker in the ramp (600 → 700). Press deepens
again (`--surface-active`, 800) with **no scale transform and no translate** — nothing bounces
or shrinks. Focus is a 3px translucent blue ring (`--ring-focus`) plus a blue border, drawn as
a box-shadow so it never shifts layout; invalid controls swap it for `--ring-danger`. Disabled
= `--surface-disabled` fill, `--border-default`, `--text-disabled`, `not-allowed` cursor —
never opacity on the whole element. Selected nav and rows use `--surface-selected` (blue-50)
with `--text-accent`.

**Motion.** Short, flat, no bounce: 90ms for tints and presses, 140ms for control state and
tooltips, 200ms for panels, tabs and toasts, 320ms for dialogs and drawers.
`--ease-out` cubic-bezier(.2,.8,.3,1) for anything entering; `--ease-in-out` for anything
moving in place. Only opacity, transform-translate, background-color, border-color and
box-shadow are animated — never height, never layout. No spring, no overshoot, no looping
ambient animation. Prefer no animation to a decorative one.

**Transparency & blur.** Used sparingly and only for depth: the dialog scrim
(`--scrim`, black at 44%) with a 2px `--blur-overlay`, and the dark scope's borders and
hover fills which are white at 5–20% so they compose over any raised surface. No frosted
cards, no translucent sidebars, no blurred hero panels.

**Layout rules.** Four min-width breakpoints — mobile 0, tablet 600 (the primary surface),
desktop 1024, ultrawide 1600 — driving a 4 / 8 / 12-column grid. Sidebar and topbar are fixed;
only the main column scrolls. Content is capped at 1240px and centred; an ultrawide display
gets more margin, never longer lines. Toasts stack bottom-right, 24px from both edges, newest at the bottom,
360px wide. Drawers enter from the edge they are attached to — right (detail), left (filters) or bottom (the sheet) — at 360 / 460 / 640px, and only the leading edge is drawn. Dialogs are top-aligned 64px down (not
vertically centred) at 400/520/720px, so tall content grows downward predictably. Numeric table
columns are right-aligned with tabular figures; status columns sit between name and metrics.

**Imagery.** None shipped and none required. If photography is added later it should be
cool-toned, desaturated, no grain, no duotone, and always full-bleed inside a card with no
rounding on the bleed edge. Illustration is not part of the language — empty states use a single
16–22px Lucide glyph in `--text-tertiary` above a sentence, not a drawing.

**Dark mode.** `[data-theme="dark"]` on any subtree. Surfaces climb as they rise
(page #0b0e12 → card #14181d → raised #22272e), borders lighten instead of darkening, the
action colour steps up to `--blue-500` for contrast, and shadows deepen to near-black. Light
is the primary mode; dark is complete at the token level and untested at the component level.

## Iconography

- **Set:** [Lucide](https://lucide.dev) 0.469.0 — 24px grid, 2px stroke, round caps, outline
  only. This is a **substitution**: no icon assets were supplied. Flagged again here because
  it is the single most visible guess in the system.
- **Delivery:** no icon font, no sprite, no local SVGs. Glyphs are fetched per-name from
  `https://unpkg.com/lucide-static@0.469.0/icons/<name>.svg` and painted with
  `mask-image` + `background-color: currentColor`, so every icon inherits text colour and
  respects the dark scope for free. `assets/` is intentionally empty.
- **Component:** always `<Icon name="…" />` from `components/core`. Never inline SVG, never
  an `<img>` with a fixed colour, never emoji, never Unicode dingbats as icons. The only
  Unicode glyphs allowed in UI text are the mono keyboard hints in tooltips (⌘K) and a true
  minus sign in deltas (−).
- **Sizes:** 14px in table rows, badges and small controls · 16px in buttons, nav and default ·
  20px in page headers and specimen rows · 22px in empty states. Nothing larger.
- **Colour:** icons take `--text-secondary` at rest, `--text-primary` on hover, `--text-accent`
  when selected, and a status solid only when the icon *is* the status (Toast, alert rows).
- **Common names in use:** `layout-dashboard`, `boxes`, `bell`, `git-branch`, `database`,
  `scroll-text`, `settings`, `shield-check`, `search`, `plus`, `filter`, `refresh-cw`,
  `ellipsis`, `chevron-down`, `chevron-right`, `arrow-up`/`arrow-down`, `chevrons-up-down`,
  `check`, `minus`, `x`, `circle-check`, `triangle-alert`, `circle-alert`, `info`,
  `trash-2`, `log-out`, `panel-left`, `book-open`, `rocket`, `download`, `key-round`.
- **To de-risk this:** drop a real icon set into `assets/icons/` and change the `CDN` constant
  (and mask URLs in `guidelines/brand-iconography.card.html`) — nothing else references glyphs.

## Using the system

```html
<link rel="stylesheet" href="styles.css">
<script src="_ds_bundle.js"></script>
<script type="text/babel">
  const { Button, Card, Table, Badge } = window.MeridianDesignSystem_962c43;
</script>
```

Rules of thumb: reach for a primitive before a `div` — `Stack`/`Grid` gaps instead of margins, `Text`/`Heading` instead of raw type, `Surface` instead of hand-rolled background + hairline · one `primary` button per view · never hard-code a hex, always a token ·
tables live in `Card padding="none"` · `Badge` for system state, `Tag` for user filters ·
`Switch` when the change applies instantly, `Checkbox` when it needs Save ·
`Slider` when the position on a range is the judgement, `Input` when the exact figure is.
