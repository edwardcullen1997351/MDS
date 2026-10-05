import * as React from 'react';

export interface DescriptionField {
  /** The label. Required — a value with no label is a string on a page. */
  term: React.ReactNode;
  /** One value, or several for one term (two owners, three tags). Missing renders `emptyValue`. */
  value?: React.ReactNode | React.ReactNode[];
  /** Mono with tabular figures — for IDs, counts, timestamps and anything out of the data. */
  mono?: boolean;
}

/**
 * One record's fields, as a real `dl` of `dt`/`dd` pairs.
 *
 * Requested by name three times before it existed: `Table` §01 ("show one
 * record's fields → a definition list"), `Table` §12 ("a table for one record
 * is a definition list wearing a table") and `List` §14.
 *
 * Not `List` with two slots renamed: the `dt`/`dd` pairing is the semantic
 * payload, the term column is ONE width down the whole list (that alignment is
 * the component), and there is no leading slot, no actions and no per-row link.
 */
export interface DescriptionListProps extends Omit<React.HTMLAttributes<HTMLDListElement>, 'style'> {
  items: DescriptionField[];
  /** `columns` — term and value side by side. `stacked` — term above value; for narrow panels and long values (§11). */
  layout?: 'columns' | 'stacked';
  size?: 'sm' | 'md';
  /** Rendered for a field with no value. Default `—`. Never a blank cell — that reads as a rendering failure. */
  emptyValue?: React.ReactNode;
  /** Hairlines between rows. Off by default: alignment already groups them. */
  divided?: boolean;
  /** Override the term column width. Any absolute CSS length. */
  termWidth?: string;
  /** Collapse to stacked pairs below 360px of CONTAINER width, via a container query. Opt-in: the default layout is frozen and does not change under a shipped product. Ignored when `layout="stacked"` (already stacked). */
  responsive?: boolean;
  style?: React.CSSProperties;
}
export declare function DescriptionList(props: DescriptionListProps): JSX.Element;
