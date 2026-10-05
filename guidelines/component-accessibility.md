# Component accessibility authoring

Use this template for every new or materially changed primitive, component, composite, layout, chart, and reference assembly. Record the React and Angular contract separately when their APIs differ. A passing axe scan is evidence for the rules it checks; keyboard and screen reader behavior still needs direct review.

## Component Accessibility Specification Template

Copy this section into the component specification or PR description and fill every field.

| Field | Required answer |
| --- | --- |
| Name and purpose | What task does this component support? |
| Native element and role | Which native HTML element is rendered, and why is any ARIA role needed? |
| Accessible name | Where does the name come from? Define visible text, `aria-labelledby`, and `aria-label` precedence. |
| Description and errors | How are hints, validation errors, and status messages associated and announced? |
| Keyboard contract | List Tab, Shift+Tab, Enter, Space, Escape, arrow, Home, and End behavior as applicable. Identify the single tab stop for composite widgets. |
| Focus contract | Define initial focus, visible focus, disabled focus behavior, focus return, and overlay background inertness. |
| State semantics | Map each interactive state to native attributes or ARIA (`disabled`, `aria-expanded`, `aria-selected`, `aria-pressed`, `aria-invalid`, etc.). |
| Form contract | Define unique IDs, `<label for>`, `name`, required, invalid, reset, and error relationships. |
| Composition contract | State landmark ownership, heading depth, interactive-child rules, and portal behavior. |
| Visual equivalence | State contrast, non-color indicators, text resize, reduced motion, and data-table alternatives for charts. |
| React and Angular parity | Map props/inputs, outputs/events, DOM semantics, and keyboard behavior. Record intentional differences. |
| Evidence | Link the Storybook story IDs, automated tests, and manual keyboard/screen reader notes. |

### Authoring rules

- Prefer native buttons, links, form controls, headings, tables, and landmarks. Use ARIA only to complete semantics that native HTML cannot provide.
- Icon-only and otherwise textless controls need a required accessible name. Visual labels must be programmatically associated with their controls.
- Keep cards noninteractive containers. Use a stretched link pseudo-element for a primary card destination when a card also contains secondary controls; never nest interactive controls.
- Give each assembly one main landmark. Name each secondary navigation or complementary landmark distinctly.
- Use roving `tabindex` for dense toolbars and grids. Document the arrow-key sequence and what remains in the normal Tab order.
- Keep chart data available in a semantic table, and distinguish series with shape, pattern, or stroke as well as color.
- For modal overlays, trap focus, inert the background, and return focus to the trigger when the overlay closes.

## Definition of Done

- [ ] The specification table above is filled for the component and both framework APIs where applicable.
- [ ] Public types enforce required accessible names and valid state combinations; `npm run typecheck` passes.
- [ ] `npm run lint:a11y` reports no new strict JSX accessibility errors. Any baseline increase requires a documented exception and review; routine PRs must reduce or hold the baseline.
- [ ] A Storybook story demonstrates the default, disabled, error, and relevant overlay or dense-data states.
- [ ] `npx turbo run build` and `npm run test:a11y` pass with no new axe findings for every Component, Composite, and Reference Assembly story.
- [ ] Keyboard traversal, visible focus, screen reader name/description/state, and focus return are reviewed manually for new interaction patterns. Record browser and assistive technology used.
- [ ] Light/dark themes, compact/comfortable density, narrow/wide viewport, zoom, and reduced motion are checked where the component uses those features.
- [ ] React and Angular parity is verified in tests or documented with an intentional difference.
- [ ] Any existing accessibility finding touched by the change is fixed or recorded as a bounded follow-up; baseline files are not regenerated solely to make CI green.

## Automated gates and existing findings

The PR workflow runs strict `eslint-plugin-jsx-a11y` rules as errors, TypeScript contract checks, and Playwright plus `@axe-core/playwright` against every Component, Composite, and Reference Assembly story. `A11Y_STORY_FILTER` narrows a local diagnostic run to matching story IDs; the CI gate runs the full set.

The repository has documented pre-existing findings in `tools/jsx-a11y-baseline.json` and `tests/a11y/axe-baseline.json`. The gates fail when a rule gains occurrences beyond its recorded count. Baselines are review artifacts, not waivers: remove entries as findings are fixed, and require an explicit rationale before accepting a new one. Axe cannot prove keyboard usability, correct announcements, or visual equivalence by itself.

The axe gate now supports all relevant Storybook titles: `Components/`, `Composites/`, `Reference Assemblies/`, `Primitives/`, `Data Visualization/`, `Interaction Patterns/`, `Navigation Systems/`, and `Layout Templates/` (771 stories total). The checked-in covered-story baselines currently contain 84 JSX findings and 58 axe violation nodes, all color-contrast findings. The first expanded-category audit snapshot exposed 158 additional axe nodes before the latest token and story fixes; those findings are intentionally not accepted into the baseline. The Definition of Done is not fully met while expanded-category findings remain.
