Recursive multi-level hierarchy navigation with in-place branch expand/collapse. Used for deep engineering Bills of Material (BOM), plant equipment registries, and folder taxonomies ($\ge 3$ levels).

```jsx
import { TreeNavigation } from '@meridian/design-system';

<TreeNavigation
  label="Plant Equipment Asset Hierarchy"
  activeId="die-set-4820"
  data={[
    {
      id: 'shop-02',
      label: 'Press Shop (Shop 02)',
      children: [
        {
          id: 'line-03',
          label: 'Tandem Press Line 03',
          badge: 4,
          children: [
            { id: 'st-01', label: 'Station 01 (De-coiler)' },
            {
              id: 'st-04',
              label: 'Station 04 (Deep Draw)',
              children: [
                { id: 'die-set-4820', label: 'Die Set DIE-BRK-4820-A', href: '/assets/die-4820' },
                { id: 'ejector-b12', label: 'Ejector Block B-12' },
              ],
            },
          ],
        },
      ],
    },
  ]}
  onSelectNode={(node) => router.push(node.href || `/assets/${node.id}`)}
/>
```

Rules:
- For recursive nested hierarchies ($\ge 3$ levels deep).
- Clicking the branch chevron toggles expand/collapse; clicking node navigates.
- Ancestors of `activeId` auto-expand by default.
- For flat or 2-level module navigation, use `LocalNavigation`.
