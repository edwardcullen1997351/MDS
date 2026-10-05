import * as React from 'react';

/**
 * A hairline rule between groups of content. Structure first: try a gap or a
 * surface change before adding a line.
 */
export interface DividerProps extends Omit<React.HTMLAttributes<HTMLElement>, 'style'> {
  orientation?: 'horizontal' | 'vertical';
  /** subtle inside dense lists · default (standard) · strong only against a sunken plane. */
  tone?: 'subtle' | 'default' | 'strong';
  /** Space step of margin along the rule's axis. Default 0 — let the parent gap do it. */
  spacing?: number | string;
  /** Space step of inset from the cross axis. */
  inset?: number | string;
  /** Optional caps label centred in the rule — for "or" splits and log sections. */
  label?: string;
  style?: React.CSSProperties;
}
export declare function Divider(props: DividerProps): JSX.Element;
