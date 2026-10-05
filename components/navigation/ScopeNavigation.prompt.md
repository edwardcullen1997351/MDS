Changes the active organizational, plant, tenant, or environment scope in which surrounding application navigation and datasets are interpreted.

```jsx
import { ScopeNavigation } from '@meridian/design-system';

<ScopeNavigation
  scopes={[
    { id: 'PL-04', name: 'Chakan Plant (PL-04)', region: 'Pune', env: 'PROD', gst: '27AABCS1429B1Z8' },
    { id: 'PL-01', name: 'Bhosari Plant (PL-01)', region: 'Pune', env: 'PROD', gst: '27AABCS1429B1Z2' },
    { id: 'PL-02', name: 'Manesar Plant (PL-02)', region: 'NCR', env: 'PROD', gst: '06AABCS1429B1ZX' },
    { id: 'PL-03', name: 'Oragadam Plant (PL-03)', region: 'Chennai', env: 'PROD', accessible: false, lockReason: 'Restricted' }
  ]}
  currentScopeId={activePlantId}
  onScopeChange={(newId, scope) => handlePlantSwitch(newId)}
  variant="standard-dropdown"
  label="Manufacturing Plant Scope Switcher"
/>
```

Rules:
- Scope changes re-hydrate the entire application shell, local routes, and datasets.
- Never use Scope Navigation for local table filters or form select dropdowns.
- Active scope must carry `aria-selected="true"`; unavailable scopes must carry `aria-disabled="true"`.
- Trigger button must state the current active scope in its `aria-label`.
- Preserve the active sub-route where compatible in the destination scope; fallback to dashboard otherwise.
