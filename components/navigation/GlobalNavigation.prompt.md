Persistent L1 wayfinding across the highest-level architectural domains of the application. It establishes top-level orientation and routing across the plant suite.

```jsx
import { GlobalNavigation } from '@meridian/design-system';

<GlobalNavigation
  activeId="work-orders"
  plantContext={{ company: 'Suryodaya Autocomp', plant: 'PL-04', location: 'Chakan, Pune' }}
  userProfile={{ name: 'Sandeep Kulkarni', role: 'Line Supervisor' }}
  items={[
    { id: 'planning', label: 'Shift Planning', icon: 'calendar', badge: 3, href: '/planning' },
    { id: 'work-orders', label: 'Work Orders', icon: 'clipboard-list', badge: 14, href: '/work-orders' },
    { id: 'quality', label: 'Quality & NCs', icon: 'shield-alert', badge: 2, href: '/quality' },
    { id: 'maintenance', label: 'Maintenance', icon: 'wrench', href: '/maintenance' },
    { id: 'stores', label: 'Stores & BOM', icon: 'boxes', href: '/stores' },
    { id: 'assets', label: 'Plant Assets', icon: 'cpu', disabled: true, disabledReason: 'Requires Shop Floor Manager role' },
  ]}
  LinkComponent={NavLink}
  onNavigate={(item) => router.push(item.href)}
/>
```

Rules:
- Destination labels must be stable nouns (e.g. *Work Orders*, *Quality & NCs*), never verbs or transactional action commands (*Create Order*).
- Active item receives `aria-current="page"` and soft-tinted visual focus.
- Collapse into compact icon rail or off-canvas drawer preserves the exact same destination hierarchy.
- For in-page sub-views of one record, use `Tabs`, not `GlobalNavigation`.
