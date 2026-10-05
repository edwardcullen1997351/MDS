import * as React from 'react';

export interface ChipOption {
  value: string;
  label: React.ReactNode;
  /** Lucide icon name. */
  icon?: string;
  /** Trailing count — legal on a chip because a chip filters data. */
  count?: number;
  /** Unavailable, still shown: removing it changes the question. */
  disabled?: boolean;
}

/**
 * A labelled set of offered options — the system's segmented control.
 *
 * Renders the shared `Fieldset` scaffold (`<fieldset>`/`<legend>`) over native
 * radios (single-select) or checkboxes (`multiple`), visually hidden behind
 * `<label>` chips, so keyboard and announcement come from the platform.
 *
 * The group is the component: a `Chip` outside one is a toggle `Button`.
 * Two to seven options; past that use `Select` or `Combobox`.
 */
export interface ChipGroupProps extends Omit<React.HTMLAttributes<HTMLFieldSetElement>, 'style' | 'onChange'> {
  /** The question the chips answer ("Shift", "Areas"). Required — `aria-label` accepted when the question is already on screen. */
  label?: React.ReactNode;
  /** The rule, one per set. Survives the error. */
  hint?: React.ReactNode;
  /** Announced through the scaffold's always-mounted `role="alert"` region. Belongs to the SET, never to one chip. */
  error?: React.ReactNode;
  options?: ChipOption[];
  /** `Chip` children, as an alternative to `options`. Not both. */
  children?: React.ReactNode;
  /** A string, or an array when `multiple`. Controlled. */
  value?: string | string[];
  /** Emits the next value (string, or array in OPTION order when `multiple`) — not an event. */
  onChange?: (next: any, e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Checkboxes instead of radios — changes the keyboard model. */
  multiple?: boolean;
  /**
   * Marks the legend, and sets the native `required` on the first enabled
   * radio of a single-select set. `multiple` has no native equivalent: state
   * the rule in `hint`.
   */
  required?: boolean;
  /** Native `<fieldset disabled>`, so the platform owns the whole subtree. */
  disabled?: boolean;
  size?: 'sm' | 'md';
  /** Generated when omitted, so per-row groups cannot collide. Pass one only for a real form POST. */
  name?: string;
  /** Defaults to `var(--space-2)` (8px). */
  gap?: number | string;
  style?: React.CSSProperties;
}
export declare function ChipGroup(props: ChipGroupProps): JSX.Element;
