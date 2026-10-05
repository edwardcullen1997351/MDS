Navigation among workspaces belonging to the active major section or functional area (L2). Groups related workspaces within an operational module.

```jsx
import { LocalNavigation } from '@meridian/design-system';

<LocalNavigation
  title="Quality & NCs"
  activeId="ncr"
  variant="grouped"
  items={[
    {
      group: 'Inspections',
      items: [
        { id: 'incoming', label: 'Incoming Material', badge: 5, href: '/quality/incoming' },
        { id: 'in-process', label: 'In-Process Checks', href: '/quality/in-process' },
        { id: 'final', label: 'Final Release', badge: 1, href: '/quality/final' },
      ],
    },
    {
      group: 'Dispositions & Audits',
      items: [
        { id: 'ncr', label: 'NC Reports (NCR)', badge: 8, href: '/quality/ncr' },
        { id: 'vendor-claims', label: 'Vendor Rejections', href: '/quality/vendor-claims' },
        { id: 'calibration', label: 'Gauge Calibration', href: '/quality/calibration' },
        { id: 'audit-log', label: 'ISO Audit Trail', href: '/quality/audit-log', disabled: true, disabledReason: 'Requires Quality Lead role' },
      ],
    },
  ]}
  LinkComponent={NavLink}
  onNavigate={(item) => router.push(item.href)}
/>
```

Rules:
- Scoped to one functional domain (e.g. Quality, Stores, Maintenance).
- Group headers are static categorical titles, not interactive destination links.
- For tree hierarchies deeper than 2 levels, use `TreeNavigation`.
- For sibling views inside a single record, use `Tabs`.
