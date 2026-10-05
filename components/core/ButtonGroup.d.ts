import * as React from 'react';

/**
 * A cluster of joined action buttons — `[Refresh][Export][⌄]`. Each child
 * fires its own action; nothing stays selected.
 *
 * NOT a view switcher (one option staying highlighted) — that is `Tabs`.
 * NOT a spaced action row (a dialog footer) — that is
 * `Stack direction="row" gap="8"`.
 *
 * Horizontal only. There is no vertical orientation and none is planned — a
 * stacked list of actions is a menu, not a group.
 */
export interface ButtonGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /**
   * Required accessible name for the group, e.g. "Chart actions".
   * `role="group"` with no name is announced as an unlabelled group.
   */
  label: string;
  /**
   * Variant pushed to every child that does not set its own. Translated for
   * icon children, which use a different vocabulary
   * (secondary → outline, primary → solid).
   */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** Size pushed to every child that does not set its own. */
  size?: 'sm' | 'md' | 'lg';
  /**
   * `Button` and `IconButton` children only, 2–4 of them — anything else warns
   * and will not pick up the corner and seam styles.
   *
   * A child `variant="link"` is rejected (warns, renders as `secondary`): a link
   * has no border or height, so it cannot form a seam.
   */
  children: React.ReactNode;
  /** Layout only — merged onto the group container, never the buttons. */
  style?: React.CSSProperties;
}
export declare function ButtonGroup(props: ButtonGroupProps): JSX.Element;
