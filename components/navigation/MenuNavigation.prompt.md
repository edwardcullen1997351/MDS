On-demand, transient destination menu opened via a button or icon trigger. Used for application suite switchers, user profile account portals, and overflow route jumpers.

```jsx
import { MenuNavigation, Button } from '@meridian/design-system';

<MenuNavigation
  trigger={<Button variant="secondary" size="sm">Plant Applications ▾</Button>}
  activeId="mes"
  items={[
    {
      group: 'Plant Operations',
      items: [
        { id: 'mes', label: 'MES Execution Console', icon: 'cpu', href: '/mes' },
        { id: 'scada', label: 'Telemetry & SCADA', icon: 'activity', href: '/scada' },
        { id: 'quality', label: 'Quality Portal', icon: 'shield-alert', badge: 2, href: '/quality' },
      ],
    },
    {
      group: 'Enterprise Services',
      items: [
        { id: 'stores', label: 'Stores & BOM', icon: 'boxes', href: '/stores' },
        { id: 'maintenance', label: 'CMMS Maintenance', icon: 'wrench', href: '/maintenance' },
      ],
    },
  ]}
  onNavigate={(item) => router.push(item.href)}
/>
```

Rules:
- For on-demand destination menus (not in-place action command menus like Duplicate/Delete).
- Trigger carries `aria-haspopup="true"` and `aria-expanded`.
- Pressing <kbd>Esc</kbd> closes the menu and restores focus to the trigger button.
- For high-frequency primary daily workflows, use `GlobalNavigation` or `LocalNavigation`.
