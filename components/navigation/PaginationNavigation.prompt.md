Moves among discrete indexed pages of large data collections (tables, work queues, catalog listings) while maintaining collection context.

```jsx
import { PaginationNavigation } from '@meridian/design-system';

<PaginationNavigation
  page={currentPage}
  totalItems={342}
  pageSize={25}
  itemNoun="work orders"
  onPageChange={(nextPage) => setPage(nextPage)}
  label="Work Orders Ledger Pagination"
/>
```

Rules:
- Strictly 1-based page indexing (Page 1 of N).
- Reset page to 1 whenever table filter criteria or search queries change.
- Current page carries `aria-current="page"`.
- Previous is disabled on Page 1; Next is disabled on the last page.
- For sequential multi-step forms, use `Stepper`, not `Pagination`.
