The system's modal — **there is no separate `Modal` component; this is it.** Use it for a decision that must be taken before continuing, or a short focused form. Never for information (that is an `Alert`), a confirmation of something done (`Toast`), or a long form (that is a page).

```jsx
<Dialog open={confirming} tone="danger" width="sm"
  title="Delete cluster?"
  description="This removes all 14 nodes and their volumes. It cannot be undone."
  onClose={() => setConfirming(false)}
  footer={<>
    <Button variant="ghost" onClick={() => setConfirming(false)}>Cancel</Button>
    <Button variant="danger" onClick={destroy}>Delete cluster</Button>
  </>} />
```

Focus is trapped, restored on close, and page scroll is locked — all handled. Title is required (it is the accessible name). Cancel first, confirm last; label the confirm button with the verb, never "OK". `dismissible={false}` only when closing would lose work in progress. Top-aligned 64px down, so tall content grows downward instead of shifting the title.
