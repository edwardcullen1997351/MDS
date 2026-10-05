Communicates position in a bounded multi-stage process (wizards, order creation, equipment setup, multi-step approvals) and allows navigation among stages.

```jsx
import { StepNavigation } from '@meridian/design-system';

<StepNavigation
  steps={[
    { id: 'STG-01', title: 'BOM & Material Requisition' },
    { id: 'STG-02', title: 'Line Allocation' },
    { id: 'STG-03', title: 'Die Setup & Clearance' },
    { id: 'STG-04', title: 'First-Piece QA Inspection', optional: true },
    { id: 'STG-05', title: 'Dispatch & E-Way Bill' }
  ]}
  currentStep={activeStepIndex}
  completedSteps={[0, 1]}
  isLinear={true}
  variant="horizontal"
  onStepClick={(idx) => setActiveStepIndex(idx)}
  label="Job Order Workflow Navigation"
/>
```

Rules:
- Step labels must name overarching workflow stages, not individual form fields.
- In linear workflows, unvisited future steps must be disabled and not focusable.
- Active stage receives `aria-current="step"`. Completed stages display checkmarks.
- For in-page peer view switching without sequence gates, use `Tabs`.
- For linear document / manual reading without completion gates, use `SequentialNavigation`.
- For paginating large data tables, use `PaginationNavigation`.
