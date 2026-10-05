# Meridian — Design Principles

The north star. `readme.md` describes *what* the system contains; this file describes *how to
decide* when the system doesn't already say. When a spec, a stakeholder and a principle
disagree, the order of authority is: **accessibility requirement → principle → token →
existing pattern → personal preference.**

Scope note: Meridian was authored without brand inputs (see Provenance in `readme.md`). These
principles are written to survive a rebrand — colours and fonts may change, the reasoning
should not.

---

## 1. Design Philosophy

**Meridian is an instrument, not a destination.** Nobody opens a plant console for pleasure;
they open it because something needs to be understood, changed, or stopped. Every decision
serves the operator's next action.

Five commitments, in priority order. When two conflict, the higher one wins.

1. **Truth over comfort.** Show the real number, the real state, the real error. Never round a
   failure into a friendlier word, never hide a stopped machine behind an aggregate green tick.
2. **Density over decoration.** Screen real estate belongs to data. A 44px row that fits twelve
   lines beats a 96px card that fits four. Whitespace is structure, not luxury.
3. **Calm over emphasis.** One saturated colour, one primary button, one hairline border.
   If everything is emphasised, the one thing that is actually on fire cannot be seen.
4. **Recoverable over restrictive.** Prefer letting the operator act and offering undo over
   blocking them with a confirmation. Reserve modals for the genuinely irreversible.
5. **Boring over novel.** A pattern the operator already knows costs zero attention. Novelty is
   a cost paid by the user and expensed to the designer's portfolio.

**The house test:** *would a shift supervisor at 3 a.m., on a floor tablet, with one line already
down, be able to find the stopped machine and get it running?* If a decision doesn't help that person, it is decoration.

**What Meridian is not:** a marketing surface, a dashboard-as-art-piece, a playground for
motion, or a system that assumes the happy path. Empty, loading, partial, stale, denied and
failed states are the design — not edge cases appended afterwards.

---

## 2. UX Principles

1. **One primary action per view.** The `primary` Button is a scarce resource. Two primaries mean
   the hierarchy hasn't been decided yet.
2. **Status before detail.** Every list and every panel answers "is this okay?" before it answers
   "what is this?". State columns sit between identity and metrics for exactly this reason.
3. **Filter, don't paginate away.** Operators arrive knowing roughly what they want. Give them a
   text filter and 2–3 scoped selects at the top of every collection; paginate only below the fold.
4. **Never lose a keystroke.** Filters, selections, sort order, expanded panels and tab position
   survive navigation within a session. Destructive-free state is never "reset for cleanliness".
5. **Selection implies bulk action.** The moment rows are selected, the toolbar must show what can
   be done with them, plus the count. Selection with no visible consequence is a dead end.
6. **Progressive depth, not progressive disclosure.** Summary → drawer → full page. Each level is
   a superset of the last, addressable, and shareable. Never hide critical state one hover deep.
7. **Empty states teach.** They state the fact plainly (`No services match that filter`) and offer
   the one action that resolves it. No illustration, no cheerleading.
8. **Failure is a first-class screen.** Every async surface has designed loading, empty, partial
   and error variants. "Spinner forever" is a bug in the design, not the backend.
9. **Latency has a budget.** Under 100 ms → no feedback needed. 100–400 ms → optimistic state.
   Over 400 ms → skeleton or progress with a cancel affordance. Never a bare spinner over content.
10. **Keyboard is not an accessibility feature, it is the power path.** Search is `⌘K`, Escape
    always closes the topmost layer, Enter submits the focused form, arrow keys move within
    tables and tab groups.
11. **Confirm the irreversible, undo the rest.** A Dialog is justified only when the action
    destroys data, scraps product, or pages a human. Everything else gets a Toast with Undo.
12. **Ask once.** Never re-request information the system already holds — including in
    onboarding, forms and support flows.

---

## 3. Accessibility Principles

Non-negotiable. These are the only principles that outrank a design decision.

- **Contrast.** WCAG 2.2 AA minimum: 4.5:1 body text, 3:1 for text ≥18px semibold and for
  meaningful non-text (icons, chart strokes, focus rings, control borders). `--text-tertiary` is
  the lightest permitted text on `--surface-card` and is never used for anything the operator
  must read to act.
- **Never colour alone.** Every status pairs its hue with a second channel: `Badge` gets a dot
  plus a word, alert rows get a severity label, charts get direct labels — never a legend
  requiring hue matching alone. The system must remain readable in greyscale.
- **Focus is always visible.** The 3px `--ring-focus` is drawn as a box-shadow so it never
  reflows, and no stylesheet may remove an outline without replacing it. Focus order follows
  DOM order; DOM order follows visual order.
- **Everything reachable by keyboard.** No hover-only affordances. Row actions, drawer controls
  and menu items are focusable and operable. Any interactive element is a real `button`,
  `a`, or labelled input — never a `div` with a click handler.
- **44px touch, 28px pointer.** Pointer controls may be as small as `--control-h-sm` (28px);
  touch targets are never below 44px, achieved with padding rather than by growing the visual box.
- **Labels are permanent.** Placeholders are examples, never labels. Icon-only controls carry a
  real accessible name (`IconButton.label` is required, not optional) plus a Tooltip for sighted
  users. A tooltip is never the only label.
- **Motion is optional.** Every transition must survive `prefers-reduced-motion: reduce` being
  honoured: transitions collapse to instant, nothing loops, nothing auto-advances. No animation
  is load-bearing for meaning.
- **Announce what changed.** Toasts are `role="status"`, destructive dialogs are
  `role="dialog" aria-modal`, validation errors are tied to their field, and live-updating
  metrics do not steal focus or re-announce on every tick.
- **Zoom and reflow.** Layouts remain usable at 200% zoom and at 320px effective width; tables
  scroll horizontally rather than truncating meaning. Never suppress user text sizing.
- **Language over jargon in ARIA.** An accessible name reads like something a person would say:
  "Close panel", not "close-drawer-btn".

---

## 4. Motion Principles

Motion in Meridian explains change. It never entertains and never announces the interface's
own cleverness.

1. **Motion has one job: continuity.** It answers "where did this come from, and where did it
   go?" If a transition doesn't answer that, remove it.
2. **Short and flat.** 90ms tints and presses, 140ms control state and tooltips, 200ms panels,
   tabs and toasts, 320ms dialogs and drawers. Nothing exceeds 320ms; there is no slow reveal.
3. **One curve family.** `--ease-out` for anything entering or settling, `--ease-in-out` for
   anything moving in place. **No spring, no overshoot, no bounce, ever** — bounce reads as
   playful, and nothing about a stopped line is playful.
4. **Animate five properties only:** `opacity`, `transform: translate`, `background-color`,
   `border-color`, `box-shadow`. Never height, width, or anything that reflows.
5. **Nothing loops.** No ambient shimmer, no pulsing dot, no breathing gradient. The single
   exception is an indeterminate progress indicator while work is genuinely in flight.
6. **Enter with direction, exit without.** Panels and drawers enter from the edge they belong to;
   exits are a straight fade so dismissal never feels slower than the decision to dismiss.
7. **Data never animates in.** Numbers, rows and chart values appear at their true value.
   Counting-up animations misrepresent state and delay comprehension.
8. **Press does not deform.** No scale-down, no lift, no tilt. Press deepens colour only.
9. **Reduced motion is a real mode, not a downgrade.** With it on, every transition becomes
   instant and the product remains complete.

---

## 5. Visual Language

The full specification lives in `readme.md` → Visual Foundations. The principles behind it:

- **The border is the elevation system.** Structure comes from 1px hairlines, not shadows.
  Shadow is reserved for things that genuinely float — menus, drawers, toasts, dialogs — and its
  five steps are a z-order vocabulary, not a decorative range.
- **Colour is meaning, never mood.** One saturated brand hue means *action*. Green/amber/red mean
  *state* and nothing else. The `--viz-1…6` series means *series identity*. A colour used
  decoratively is a colour that can no longer carry meaning.
- **Flat surfaces.** Page, card, sunken. No gradients on surfaces, no glow, no glassmorphism, no
  coloured left-border accent cards, no purple-blue hero gradients. Transparency and blur appear
  only in the dialog scrim and in the dark scope's compositing borders.
- **Two typefaces, two jobs.** Sans for everything human, mono for everything machine-generated
  or numeric. If a value could be copied and pasted into a terminal, it is mono with tabular
  figures. This is a semantic rule, not a stylistic one.
- **One grid: 4px.** Every gap, pad and control height is a multiple (the 2px half-step is for
  optical corrections only, never a layout gap). 12 inside controls, 16
  between siblings, 24 between sections. An off-grid value is a bug unless it is an optical
  correction, and then it is commented.
- **Radius is a scale of intent.** An even scale (0 / 2 / 4 / 6 / 8 / 12 / 16 / 24 / full):
  2px chips, **4px the house corner**, 6px cards, 8px dialogs; pill only for switches, radios
  and status dots. Radius never scales with element size.
- **Restraint is the aesthetic.** Nothing is added to make a screen look designed. The
  distinctive quality of a Meridian screen is that a dense table looks calm.

---

## 6. Interaction Philosophy

- **Direct over indirect.** Edit in place where the data lives. A drawer beats a page change; an
  inline field beats a modal form; a modal beats a wizard.
- **Reversible by default.** Design the undo before designing the action. If undo is impossible,
  that is what earns a Dialog — and the confirm button restates the verb (`Delete routing`,
  never `OK`).
- **State is visible, not remembered.** Selected, filtered, muted, stale, read-only and
  degraded are all shown on the surface. The operator should never have to recall what mode
  they are in.
- **Four states, always designed:** rest, hover, press, focus — plus disabled and selected where
  they apply. Hover tints the surface and strengthens the border; press deepens one step; focus
  rings. Nothing moves.
- **Disabled must explain itself.** A disabled control carries a Tooltip saying what would enable
  it. An unexplained disabled control is a dead end, and hiding the control is usually better.
- **Optimistic, with honesty.** Reflect the intended result immediately, then reconcile. If it
  fails, say so specifically (`Station 4 sensor is offline`), restore the prior state, and keep the
  operator’s input.
- **Interruption is a cost.** Rank feedback by intrusiveness and always pick the cheapest that
  works: inline state → Toast → banner → Dialog. Never a toast for something requiring action;
  never a dialog for something already done.
- **Bulk is the norm.** Anything doable to one row is doable to many, with the count stated
  before the verb. Destructive bulk actions name the scale (`Archive 12 routings`).
- **Respect the pointer and the keyboard equally.** No drag-only, no hover-only, no
  right-click-only path to any function.

---

## 7. Consistency Rules

Consistency is a debugging tool: when everything behaves the same, anomalies are information.

1. **Tokens or nothing, and the right tier.** No literal hex, px radius, shadow or duration in
   product code. If a token is missing, add a token — don't inline the value. A component reads
   its own component tokens; new UI reads semantic tokens; nothing outside `tokens/semantic.css`
   reads a primitive ramp.
2. **Compose, never fork.** Use the primitive from `window.MeridianDesignSystem_962c43`. Never
   re-implement Button/Table/Badge locally, and never restyle one past its props (the UI kit's
   charts are the only sanctioned local visual code).
3. **One pattern per job.** Badge for system state, Tag for user filters. Switch for
   apply-immediately, Checkbox for needs-Save. Tabs for sibling views within a screen, nav for
   changing screen. Select for 4+ options, Radio below that. Drawer for context, Dialog for
   decision, page for depth.
4. **Same thing, same place.** Page title top-left; primary action top-right; filters directly
   under the header; bulk actions in the same row as filters; toasts bottom-right; row actions
   last column, right-aligned.
5. **Tables are uniform.** 36px uppercase header, 44px rows, hairline rules, numerics
   right-aligned with tabular figures, IDs in mono, status as a Badge, actions last.
6. **Density is global.** 34px controls, `--space-4` between siblings, `--space-6` between
   sections. A screen does not get to be roomier because it feels emptier.
7. **Dark parity.** Every component works under `[data-theme="dark"]` using semantic tokens only.
   No component may reference a base ramp value (`--grey-200`) for a themed property.
8. **Deviation is documented.** Any intentional break gets a one-line comment saying why, and
   if it survives twice it becomes a token or a component prop.

## 8. Component Hierarchy & Classification

Meridian structures its UI inventory into **three discrete tiers of classification**, resolving the distinction between structural composition and functional domain:

```
Tier 1: Primitives (Foundations & Layout)
   └── Directly consumes token scales; zero business logic; no interactive states.
Tier 2: Components (Single-Purpose Building Blocks)
   └── 5 Functional Domains: Core · Forms · Feedback · Navigation · Data
Tier 3: Composites (Multi-Part Workflows & Compound Widgets)
   └── Coordinates multiple Tier 2 components into synchronized assemblies.
```

### The Three Tiers Defined

1. **Tier 1 — Primitives:** The token layer given React shape. Low-level wrappers for spacing, layout, typography, and surface treatment (`Box`, `Stack`, `Grid`, `Container`, `Spacer`, `Divider`, `Text`, `Heading`, `Surface`, `Image`, `AspectRatio`).
   - *Rule:* A primitive has no interactive state, no keyboard handling, and no business logic. Its props map 1:1 to token scales.
2. **Tier 2 — Components:** Focused, single-purpose controls and elements carrying distinct semantic roles, interactive states, ARIA contracts, and keyboard operations. They are categorized across five functional domains:
   - **Core:** Foundational interactive elements (`Button`, `Badge`, `Avatar`, `Chip`, `Tag`, `Card`, `Link`, `SegmentedControl`, `Icon`).
   - **Forms:** Input fields, selection controls, and form structures (`Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`, `Slider`, `DatePicker`, `TimeField`, `Autocomplete`, `Combobox`).
   - **Feedback:** Modals, overlays, alerts, and loaders (`Alert`, `Dialog`, `Drawer`, `Popover`, `Tooltip`, `Toast`, `Snackbar`, `Progress`).
   - **Navigation:** Routing, hierarchical wayfinding, and pagination (`Tabs`, `Breadcrumb`, `Menu`, `Pagination`, `StepNavigation`, `SequentialNavigation`, `GlobalNavigation`).
   - **Data:** Structured information display and charts (`Table`, `List`, `DescriptionList`, `Tree`, `EmptyState`, `Skeleton`, and Data Visualizations).
3. **Tier 3 — Composites:** Standardized multi-component assemblies that introduce specialized contracts, synchronized state across multiple inputs, or domain-specific workflows (`DateRangePicker`, `DateTimePicker`, `FileUpload`, `ScopePicker`, `SearchField`, `SortableCollection`, `SplitButton`, `Toolbar`).
   - *Rule:* A composite documents only what the composition adds beyond its constituent Tier 2 children (`guidelines/composite-spec-standard.card.html`).

---

## 9. Decision Framework

Run a new design through these in order. The first one that answers, decides.

1. **Does an accessibility requirement settle it?** → Follow it. Stop.
2. **Does the system already solve this?** → Use the existing component or pattern as-is.
   Preference is not a reason to build.
3. **Can it be solved by composing existing primitives?** → Compose. Two primitives beat one
   new component.
4. **Does a prop close the gap?** → Add the prop, with a documented default that keeps every
   existing usage identical. Additive changes only.
5. **Has this need appeared three times, in two different surfaces?** → It becomes a component:
   `.jsx` + `.d.ts` + `.prompt.md` + a card in its directory. Fewer than three occurrences is a
   local implementation, not a primitive.
6. **Still stuck? Apply the priority ladder:**
   **correctness → accessibility → clarity → speed of use → density → consistency → aesthetics.**
   Anything justified only by the last item does not ship.
7. **Then apply the 3 a.m. test** (§1) and the subtraction test: remove the element. If the
   screen still works, it stays removed.

**Escalate rather than guess** when: data could be misrepresented, an action is irreversible,
the copy makes a promise about throughput or traceability, or a decision would set a precedent the system would
have to keep.

**Never justified:** "it looks more modern", "our competitor does it", "the whitespace felt
empty", "users will learn it", "just for this one screen".

---

## 10. Terminology Rules

One concept, one word, everywhere — UI, docs, API, support and this repository. Synonyms are
bugs. Meridian's domain is **discrete manufacturing operations**: a plant floor of lines and
machines running work orders.

### The object hierarchy

```
Organization → Site → Area → Line → Station → Machine
```

Every screen states its scope from this chain and nothing else. There is no "facility",
no "plant" in UI copy (Site), no "cell" (an Area groups Lines; a Line groups Stations).

### Domain vocabulary

| Use | Not | Why |
| --- | --- | --- |
| Site | plant, factory, facility, location | One physical address. The operational scope boundary. |
| Area | zone, department, cell, section | A named group of Lines within a Site. |
| Line | production line (in UI), cell, stream | The unit operators are assigned to and OEE is reported on. |
| Station | workstation, position, post, step | A fixed position on a Line where an Operation happens. |
| Machine | asset, equipment, device, unit | One physical machine. `asset` is a finance word; keep it out of the UI. |
| Part | item, SKU, product, component | What is produced or consumed. `SKU` is commercial, not operational. |
| Work order | job, order, ticket, WO (in prose) | Authorization to produce a quantity of a Part. `WO` only in mono IDs. |
| Run | batch, execution, cycle | One continuous execution of a Work order on a Line. |
| Lot | batch, traceability unit | A traceable produced quantity. A Run may yield several Lots. |
| Operation | task, step, process | One step performed at a Station. |
| Routing | process, workflow, recipe | The ordered Operations that make a Part. `Recipe` is reserved for formulation. |
| Changeover | setup, switchover, transition | Converting a Line from one Part to another. Its own machine state. |
| Downtime | outage, stoppage, breakdown | Time a Line or Machine was not producing. Always qualified planned / unplanned. |
| Alarm | alert, warning, event | A condition the Machine itself signals. |
| Fault | error, failure, trip | An Alarm severe enough to stop production. Every Fault is an Alarm; not the reverse. |
| Acknowledge | ack (in UI), triage, claim | Says a human has seen it. `ack` is acceptable in mono filter syntax only. |
| Andon | escalation, call, signal | An operator-raised call for help. Never used for machine-raised conditions. |
| Maintenance order | work request, ticket, repair job | Planned or corrective work on a Machine. `PM` expands to *preventive maintenance* on first use. |
| Scrap | waste, reject, defect | Product that cannot be sold or reworked. Counted in pieces, never as a rate alone. |
| Rework | repair, fix, second pass | Product that failed but can be recovered. Never merged into Scrap. |
| Shift | crew, turn, rotation | A named, scheduled block of time (Days / Swing / Nights). |
| Operator | worker, employee, user, resource | A person working a Station. |
| Supervisor | manager, lead, foreman | A person accountable for a Line or Area. |
| Deleted | archived, removed, disabled | See the lifecycle rules below — these are four different things. |

### Tenancy (cross-domain, adopted)

Organization / team / member / seat, used exactly as elsewhere in the industry:

| Use | Not | Why |
| --- | --- | --- |
| Organization | company, tenant, customer, account | The billing and access boundary. Owns one or more Sites. |
| Team | group, crew, department, squad | A named set of Members with shared access, e.g. *Assembly maintenance*. |
| Member | user, person, seat (as a human) | A human with access to the Organization. |
| Seat | licence, subscription slot | A paid unit of access. Members occupy Seats; a Seat is never a person. |

**Deliberate deviation:** the generic set includes *workspace*. Meridian does not use it —
**Site** is the operational boundary and *workspace* would be a synonym for either it or
Organization depending on who was speaking. One concept, one word.

### Lifecycle (cross-domain, adopted)

Three distinct state machines. Never mix their words, and never map one onto the other.

**1 — Configuration lifecycle** (Routings, alarm rules, reports, saved views, integrations):
```
Draft → Active → Paused → Archived → Deleted
```
*Draft* has never taken effect · *Active* is in effect · *Paused* is temporarily suspended but
still configured · *Archived* is retained, read-only and hidden from default lists ·
*Deleted* is gone. Never *enabled/disabled*, never *live*, never *inactive* — *Paused* and
*Archived* are the two things people mean by "inactive" and they are not the same.

**2 — Work order progress** (irreversible forward movement, not the lifecycle above):
```
Planned → Released → In progress → Completed → Closed
```
Plus the two exits: *On hold* (reversible) and *Cancelled* (terminal).

**3 — Machine / Line runtime state** (observed, never edited by a human):
```
Running · Idle · Changeover · Blocked · Starved · Down · Unknown
```
*Blocked* means the downstream is full; *Starved* means the upstream is empty — never collapse
both into "stopped". *Down* is unplanned; planned stops are *Changeover* or scheduled
*Downtime*. **Never "up", "green", "healthy" or "offline"** for a Machine, and *Unknown* is an
honest state that must be shown rather than defaulted to Running.

### Precision rules

- *Cycle time* is per piece at a Station; *takt time* is the demand-driven target;
  *lead time* is order-to-delivery. Three different numbers, never used loosely.
- *Throughput* is good pieces per hour; *output* is total pieces produced;
  *yield* is good ÷ total. *First-pass yield* excludes Rework and is always named in full.
- *OEE* is Availability × Performance × Quality. Never call it efficiency or utilization, and
  never show OEE without its three components being reachable in one click.
- *Stale* means the reading is old; *Unknown* means there is no reading. Not interchangeable.
- *Planned downtime* and *unplanned downtime* are always distinguished; "downtime" unqualified
  is only acceptable in a total that shows the split alongside it.

### Numbers and units

Units always attached and spaced: `1,284 pcs`, `412 pcs/h`, `12.4 s` cycle,
`87.2 %` OEE, `14 min` downtime, `180 °C`, `64 N·m`, `5.2 bar`.
Percentage **points** are `pt`, never `%` (`+1.4 pt` OEE). Deltas carry a sign with a true
minus (`−11 pcs/h`). Piece counts are integers, never abbreviated to `1.3k` on an operations
screen. Relative time in lists (`4 min ago`), absolute local plant time with a zone in detail
views (`12 Mar 2026, 09:14 CET`) — never both in one line. Shifts are named, not numbered
(*Days*, *Swing*, *Nights*), and a shift-to-date figure always says so.

### Dates, times and timezones

Written at 1.21.2, because `DatePicker` was deferred from shipping a date **and time** control
and the blocking question turned out not to be a component question at all: *whose clock?*
An operations product cannot answer that per screen.

**A calendar date and an instant are different types, and they never mix.**

| Thing | Type | Stored | Shown | Control |
| --- | --- | --- | --- | --- |
| A calendar date — the day a stoppage is filed against, a due date | Three integers | ISO `YYYY-MM-DD` **string** | ISO, mono | `DatePicker` |
| An instant — a fault, a changeover, an acknowledgement | A point in time | UTC ISO-8601 with offset | Site-local, with the zone named | `DateTimePicker` (`zone` = the Site's IANA zone) |
| A floating wall clock — a shift template, a recurring cut-off | Date + time, no offset | Local `YYYY-MM-DDTHH:mm` | As entered, with no zone claimed | `DateTimePicker` (no `zone`) |

1. **The Site's timezone is the reporting timezone.** Every instant is stored in UTC and
   displayed in the timezone of the **Site the record belongs to**, never the timezone of the
   browser reading it. A manager in Chicago opening a Tilburg line must see Tilburg's clock: the
   fault was at 04:12 on the Nights shift, and browser-local would render it 21:12 the previous
   day — a different shift, a different operating day, and a different person to ask about it.
   **The shift is the unit of work, so the shift's clock wins.**

2. **A zone is always named where a time is absolute.** `12 Mar 2026, 09:14 CET` — never a bare
   `09:14` in a detail view, and never both relative and absolute in one line (Numbers and units,
   above). Relative time (`4 min ago`) needs no zone and is preferred in lists.

3. **Never the browser's locale, and never the browser's timezone.** Both are properties of the
   reader, and an operations record is a property of the Site. This is the same argument that
   makes date display ISO rather than locale-formatted: `05/09` and "your local time" are both
   the reader's convention leaking into the record.

4. **The operating day is not midnight-to-midnight.** A Site's day starts at its first shift
   boundary (06:00 CET at Tilburg), so "today" in a filter means *the current operating day* and a
   date range means whole operating days. Any view that says "today" must mean the same thing as
   the shift report for the same date, or the two disagree and the shift report is right.

5. **When a view spans Sites, say which clock it is on.** Either label each row's zone or convert
   to the Organization's reporting timezone and state that in the view — never silently mix. A
   cross-site alarm list sorted by an unlabelled timestamp is unreadable and quietly wrong.

**What this unblocks.** `DateTimePicker` ships at 1.28.0 and implements this section: it takes
and emits a UTC ISO-8601 instant, displays and edits in the record's Site timezone with the zone
named beside the field, shares `components/forms/date.js` for the calendar half and
`components/forms/time.js` for the clock half, and never offers a "local" option — the Site
supplies the zone. The conversion itself lives in `components/forms/zone.js`, which was added
for it: `Intl` carries the zone database, and no `Date` leaves that file. Two consequences of
this section that only appear once conversion is real, both owned by the composite: a clock time
that **does not exist** (the hour skipped at spring forward) is invalid and emits no instant,
and a clock time that happens **twice** (the hour repeated at autumn back) resolves to the
earlier occurrence and says so on screen. Silence on either would file a record an hour out.

The one value that is *not* an instant keeps a mode of its own: a **floating wall clock** — a
shift template, a recurring cut-off — is edited with no zone and serializes as a local
`YYYY-MM-DDTHH:mm`. "No local option" is a rule about instants; a value that is genuinely not an
instant must not be dressed as one.

**Voice reminders** (full rules in `readme.md` → Content Fundamentals): address the user as
*you*, sentence case everywhere, no exclamation marks, no emoji, no full stop on a button.

## 11. Naming Rules

**Design tokens.** Two layers, and product code only ever touches the second.

- Base ramps describe the value: `--grey-500`, `--blue-600`, `--space-4`, `--radius-sm`,
  `--shadow-md`, `--duration-fast`.
- Semantic aliases describe the job: `--text-secondary`, `--surface-card`, `--border-strong`,
  `--action-solid`, `--status-critical-soft`, `--ring-focus`.
- Pattern: `--<category>-<role>[-<state|variant>]`, lowercase kebab, singular.
  Categories: `text`, `surface`, `border`, `accent`, `status`, `shadow`, `ring`, `space`,
  `radius`, `duration`, `ease`, `font`, `text-<size>`, `weight`, `tracking`, `viz`, plus the
  layout frame (`--sidebar-w`, `--topbar-h`, `--row-h`, `--content-max`).
- Component tokens are the third tier and the **only** place a token may carry a component
  name: `--<component>-[<variant>|<part>]-<property>[-<state>]` — `--button-primary-background`,
  `--card-border-hover`, `--table-header-text`. They reference semantic tokens only.
- Never name a token after a place or a screen (`--dashboard-bg`), or put a hue in a semantic
  or component slot (`--blue-text` for links). Never `-1`/`-2` ordinals for meaning, except
  the deliberately ordinal `--viz-1…6` and `--elevation-0…5`.
- Full convention, standards and JSON structure: `Token Architecture.md`.

**Components.** PascalCase, singular, a noun the team already says out loud: `Button`, `Table`,
`Badge`. No prefixes (`MeridianButton`), no suffixes (`ButtonComponent`), no abbreviations
(`Btn`). Files: `Name.jsx` + `Name.d.ts` + `Name.prompt.md`, one card HTML per directory.
Directories map to the 3-Tier Hierarchy: `primitives/` (Tier 1), functional sub-domains under `core/`, `forms/`, `navigation/`, `feedback/`, `data/` (Tier 2), and `composite/` (Tier 3).

**Props.** camelCase, and the same idea keeps the same prop name across every component:

- `variant` for visual role, `size` for `sm | md | lg`, `tone` for semantic colour
  (`neutral | accent | success | warning | danger`).
- Booleans read as a state the element *is*, and default to `false`: `disabled`, `selected`,
  `invalid`, `loading`, `elevated`, `interactive`, `fullWidth`. Never negative booleans
  (`notEditable`) and never `isDisabled`.
- Handlers are `on<Event>` (`onChange`, `onClose`, `onRowClick`, `onSelectionChange`); their
  props are the past-tense-free noun (`selectedKeys`, not `selection`). A collection prop names
  what it holds, and it holds **identities, not positions** — `Table`'s `selectedRows: number[]`
  of array indices silently reassigned itself on sort until 1.14.0.
- Icons are passed as Lucide **names** (`iconLeft="plus"`), never as elements, so glyph
  substitution stays a one-file change.
- Slots are nouns: `title`, `subtitle`, `description`, `actions`, `footer`, `children`.

**Screens and files.** UI-kit screens are `<Thing>Screen.jsx`; shells and groups are plain nouns
(`Chrome.jsx`, `Charts.jsx`). Specimen cards are `<concept>-<subconcept>.card.html`
(`color-brand.card.html`), tagged with a title-cased `group` reused verbatim across cards.

**Naming test:** say the name out loud to a shift supervisor on the floor. If they'd need it explained, or
if two people in the room use different words for it, it isn't the name.
