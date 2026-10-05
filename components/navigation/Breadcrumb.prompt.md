The ancestor trail above a page title — where this page sits, and one press back up. Only for hierarchies at least three levels deep; a two-level app needs a back link, not a trail.

```jsx
<Breadcrumb items={[
  { label: 'Tilburg', href: '/sites/tilburg', icon: 'factory' },
  { label: 'Assembly', href: '/sites/tilburg/assembly' },
  { label: 'Line 4' },                    // current page — no href
]} />

<Breadcrumb size="sm" variant="slash" maxItems={3} items={trail} onNavigate={(i) => router.push(i.href)} />
```

The last crumb is the current page: plain text with `aria-current="page"`, never a link. Past `maxItems` the middle collapses into a `…` menu — the root and the parent always stay visible. Pass `onNavigate` in an SPA so collapsed crumbs stay inside the router.
