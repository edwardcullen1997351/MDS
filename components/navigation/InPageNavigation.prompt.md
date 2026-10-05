Provides direct navigation to named sections within a single page or continuous document view (documentation, SOP manuals, audit checklists, long dashboards).

```jsx
import { InPageNavigation } from '@meridian/design-system';

<InPageNavigation
  sections={[
    { id: 'spec-overview', title: '1. Machine Specifications', level: 2 },
    { id: 'safety-loto', title: '2. Safety & LOTO Protocol', level: 2 },
    { id: 'daily-preflight', title: '2.1 Shift Pre-flight Inspection', level: 3 },
    { id: 'tooling-offsets', title: '3. Tooling Calibration', level: 2 },
    { id: 'emergency-rca', title: '4. Emergency Shutdown', level: 2 }
  ]}
  variant="sidebar"
  autoScrollspy={true}
  headerOffset={64}
  label="Machine Manual Table of Contents"
/>
```

Rules:
- Targets must be existing DOM elements with matching `id` attributes.
- Use `aria-current="location"` for the actively visible section.
- Content sections in main body must specify `scroll-margin-top` to avoid being occluded by fixed headers.
- For isolated peer views where content is unmounted/switched, use `Tabs`.
- For multi-page ordered sequences, use `SequentialNavigation` or `StepNavigation`.
