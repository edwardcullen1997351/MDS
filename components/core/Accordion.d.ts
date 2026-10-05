import * as React from 'react';

export interface AccordionItemData {
  /** Stable key and the value reported by onChange. */
  value: string;
  /** Header label. One line — truncated with an ellipsis, never wrapped. */
  title: React.ReactNode;
  /** Optional second line under the title: a count, a state, a qualifier. */
  description?: React.ReactNode;
  /** Lucide icon name before the title. All rows or none. */
  icon?: string;
  /** Right-aligned node before the chevron — a Badge or count, never a control. */
  meta?: React.ReactNode;
  /** Kept in the list and announced; cannot be opened or arrowed to. */
  disabled?: boolean;
  /** Panel content. */
  content?: React.ReactNode;
}

/**
 * Stacked disclosures: headers that stay visible, panels that open one or many at a time.
 * @startingPoint section="Core" subtitle="Disclosure stack — bordered, divided and flush" viewport="720x420"
 */
export interface AccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'onChange' | 'defaultValue'> {
  items: Array<string | AccordionItemData>;
  /** Controlled open set. string for multiple={false}, string[] for multiple. */
  value?: string | string[] | null;
  defaultValue?: string | string[] | null;
  onChange?: (value: string | string[] | null) => void;
  /** Allow several panels open at once. Default one-at-a-time. */
  multiple?: boolean;
  /** sm = 34px headers (dense panels, sidebars). md = 44px, touch-safe default. */
  size?: 'sm' | 'md';
  /** bordered = one card holding rows. divided = hairlines only. flush = no chrome. */
  variant?: 'bordered' | 'divided' | 'flush';
  /** Heading element wrapping each header button. Match the page outline. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Keep collapsed panels in the DOM (hidden) — for forms and media that must not reset. */
  keepMounted?: boolean;
  style?: React.CSSProperties;
}
export declare function Accordion(props: AccordionProps): JSX.Element;

/** A single disclosure — usable standalone, with its own open state. */
export interface AccordionItemProps {
  item: string | AccordionItemData;
  size?: 'sm' | 'md';
  variant?: 'bordered' | 'divided' | 'flush';
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  open?: boolean;
  defaultOpen?: boolean;
  onToggle?: (open: boolean, item: AccordionItemData) => void;
  keepMounted?: boolean;
  first?: boolean;
  last?: boolean;
  children?: React.ReactNode;
}
export declare function AccordionItem(props: AccordionItemProps): JSX.Element;
