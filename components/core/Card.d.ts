import * as React from 'react';

/**
 * Bordered content container — the default grouping device in Meridian.
 *
 * The element follows the content: a card with a `title` is a named
 * `<section>` (a real landmark), an untitled one is a `<div>`, because an
 * unnamed `<section>` is not exposed as a region at all.
 */
export interface CardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'style' | 'title'> {
  /** Override the element. Defaults to `section` when titled, `div` otherwise. */
  as?: keyof JSX.IntrinsicElements;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Right-aligned header controls, usually IconButtons or a ghost Button. */
  actions?: React.ReactNode;
  /** Footer bar, usually confirm/cancel Buttons. */
  footer?: React.ReactNode;
  /**
   * `end` (default) for an action row. **`between` for a footer holding one
   * full-width child that distributes itself** — `Pagination`, a summary
   * row: it stretches the child, which a `space-between` parent cannot do
   * for an item that has collapsed to its content.
   */
  footerAlign?: 'end' | 'start' | 'between';
  /** Heading level for `title` — 1-6. Match the surrounding document outline. */
  headingLevel?: number;
  /** none (tables/charts) | sm | md (default) | lg */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Adds elevation-3. Reserve for cards that genuinely float above the page. */
  elevated?: boolean;
  /** Makes the whole card a control. Requires `onClick` (warns without it). */
  interactive?: boolean;
  /** With `interactive`, wires click plus Enter/Space, focus and a focus ring. */
  onClick?: (e: React.SyntheticEvent) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Card(props: CardProps): JSX.Element;
