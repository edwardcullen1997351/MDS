Short description of the control it wraps, on hover and keyboard focus. A *description*, not a name — the trigger must already have its own.

```jsx
<Tooltip content="Refresh the run list" shortcut="⌘R">
  <IconButton icon="refresh-cw" label="Refresh" />
</Tooltip>
```

Waits 400ms for the first one, then opens instantly while the group is warm. Escape dismisses; the pointer may enter it. Never opens on touch, never holds interactive content, never carries information the user needs to complete the task — that is `Popover` or a hint under the field. Set `disabled` when the label is already visible.
