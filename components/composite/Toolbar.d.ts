import * as React from 'react';

/**
 * A persistent, semantically related set of actions or controls operating on
 * one context — the system's action surface.
 *
 * The composite owns four things its children cannot: the `role="toolbar"`
 * group boundary, one tab stop with arrow-key movement between controls, the
 * relationship between directly visible and overflowed actions, and an
 * aggregate disabled state. It also coordinates one height rhythm through
 * `size`. Activation, selection and menu behaviour stay with `Button`,
 * `IconButton`, `SegmentedControl` and `Menu`.
 *
 * NOT application navigation (a nav landmark or `Tabs`). NOT a generic
 * container for unrelated controls. NOT a way to align things in a row —
 * that is `Stack direction="row" gap="8"`.
 */
export interface ToolbarProps extends Omit<React.HTMLAttributes<HTMLElement>, 'style'> {
  /**
   * Required accessible name — what this set of controls acts on
   * ("Document actions", "Chart controls"). `role="toolbar"` with no name is
   * announced as an unlabelled group of controls.
   */
  label: string;
  /**
   * Coordinated control height for the whole surface: any child that does not
   * set its own `size` takes this one. There is no `lg` — `SegmentedControl`
   * and `Menu` top out at `md`, and a 40px control row stops reading as a
   * toolbar. Default `md`.
   */
  size?: 'sm' | 'md';
  /**
   * `vertical` stacks the controls and swaps the arrow contract to ↑/↓. The
   * action-surface meaning does not change; only the axis does.
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Aggregate disabled state: renders a native `<fieldset disabled>`, so the
   * platform disables the whole subtree including nested groups. Use it when
   * the context the toolbar acts on is unavailable — never to disable one
   * action, which is that control's own `disabled`.
   */
  disabled?: boolean;
  /**
   * `menu` measures the toolbar and moves trailing low-priority actions into
   * an overflow `Menu` when the container cannot hold them. Horizontal only.
   * Default `none`.
   */
  overflow?: 'none' | 'menu';
  /** Accessible name of the overflow trigger and its menu. Default "More actions". */
  overflowLabel?: string;
  /**
   * `Button`, `IconButton`, `ButtonGroup`, `SegmentedControl`, `Menu` and
   * `Divider` children, in logical action order — DOM order is the keyboard
   * order and the visual order.
   *
   * Only `Button` (with a string label) and `IconButton` can collapse into the
   * overflow menu; a `ButtonGroup`, `SegmentedControl` or `Menu` has no
   * single-row equivalent and stays visible. Mark an action that must never
   * collapse with `data-priority="high"`.
   */
  children: React.ReactNode;
  /** Layout only — merged onto the toolbar container, never the controls. */
  style?: React.CSSProperties;
}
export declare function Toolbar(props: ToolbarProps): JSX.Element;
