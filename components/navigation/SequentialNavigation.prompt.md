Moves directly to the preceding or following destination in a fixed, ordered sequence (SOPs, machine manuals, PM checklists, training modules).

```jsx
import { SequentialNavigation } from '@meridian/design-system';

<SequentialNavigation
  items={[
    { id: 'SOP-01', title: 'Pre-flight Safety Interlocks', subtitle: 'Press Shop Line 1' },
    { id: 'SOP-02', title: 'Hydraulic Oil Level Check', subtitle: 'Reservoir R-02' },
    { id: 'SOP-03', title: 'Die Bed Alignment & Clamping', subtitle: '500T Platen' },
    { id: 'SOP-04', title: 'Pressure Relief Valve Calibration', subtitle: '280 bar relief' }
  ]}
  currentIndex={currentStepIndex}
  variant="preview-cards"
  onNavigate={(newIndex, item, dir) => setCurrentStepIndex(newIndex)}
  label="Press Tooling SOP Navigation"
/>
```

Rules:
- Order of sequence must be deterministic and stable throughout navigation.
- Boundary handling: Previous disabled on step 0, Next disabled on final step unless `allowWrap` is enabled.
- Always provide human-readable destination titles in `preview-cards` and bar variants.
- For numbered collection pages (e.g. data tables), use `PaginationNavigation`.
- For multi-step transactional wizards with validation blockers, use `StepNavigation`.
