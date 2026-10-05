A shape standing in for content that has not arrived. Sized by the content it replaces — there is no size scale.

```jsx
<Skeleton />                        {/* one line, fills its container */}
<Skeleton width="80px" />
<Skeleton lines={3} />              {/* stack; last line is short */}
<Table loading loadingRows={8} …/>  {/* Table renders these itself */}
```

Always `aria-hidden`: put `aria-busy` on the loading **region** and make one announcement there, never forty. The sweep is a single low-contrast pass, not a pulse — a table of pulsing blocks is a page that looks broken. Under reduced motion it stops dead and the resting `--surface-sunken` fill still reads as "not data".

`style` and `className` land on the outer element only — the single bar, or the stack wrapper. Don't use it for a load that resolves in under ~200ms (the flash is worse than the wait), for an unknown-length wait (that is a spinner or a progress bar), or as an empty state.
