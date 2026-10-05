import * as React from 'react';

export interface TabItem {
  value: string;
  label: string;
  /** Lucide icon name shown before the label. All tabs or none. */
  icon?: string;
  /** Mono-face counter after the label (e.g. open alarms). Display only. */
  count?: number;
  /** Kept in the bar and announced; cannot be selected or arrowed to. */
  disabled?: boolean;
}

/**
 * View switcher within a screen.
 * @startingPoint section="Navigation" subtitle="Underline and segmented tab bars" viewport="700x160"
 */
export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'onChange'> {
  items: Array<string | TabItem>;
  value: string;
  onChange: (value: string) => void;
  /** underline = page-level sections (default). segmented = local view toggle. */
  variant?: 'underline' | 'segmented';
  /** sm = 32px underline / 24px pills. md = 36 / 26, default. */
  size?: 'sm' | 'md';
  /** Accessible name of the tablist — what the tabs switch between. Warns when absent. */
  label?: string;
  /** Opt in to full tab↔panel wiring; pass the same value to each TabPanel. */
  idBase?: string;
  /** Equal-width tabs filling the bar. Segmented only, and only for 2–4 short labels. */
  fitted?: boolean;
  /** automatic = selection follows focus (default, cheap panels). manual = arrows move, Enter/Space selects. */
  activation?: 'automatic' | 'manual';
  style?: React.CSSProperties;
}
export declare function Tabs(props: TabsProps): JSX.Element;

/** Roles and ids for one panel. Requires the Tabs idBase. */
export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  idBase: string;
  value: string;
  active?: boolean;
  children?: React.ReactNode;
}
export declare function TabPanel(props: TabPanelProps): JSX.Element;
