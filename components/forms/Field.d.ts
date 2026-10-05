import * as React from 'react';

/**
 * Label + hint/error wrapper for any form control.
 *
 * Field owns the accessible plumbing: it generates an id with `React.useId()`
 * (unless `htmlFor` is given), points its `<label>` at it, renders the hint
 * under `<id>-hint` and the error under `<id>-err`, and publishes that wiring
 * on `FieldContext`. Input, Textarea and Select consume it, so `for`/`id`,
 * `aria-describedby`, `aria-invalid` and `aria-required` are correct without
 * being passed by hand. An explicit prop on the control always wins.
 */
export interface FieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Required in practice — Field warns without it, since it owns the label association. */
  label?: React.ReactNode;
  /** Keeps the label as the accessible name but hides it visually — for a table filter under its own column header. */
  labelHidden?: boolean;
  /** Helper copy below the control. **Stays visible when `error` is set** — it carries the rule the error is asking the user to satisfy. */
  hint?: React.ReactNode;
  /** What went wrong. Adds an alert glyph, announces via a permanently-mounted `role="alert"` region, and sets the control's `aria-invalid`. */
  error?: React.ReactNode;
  /** Appends an `aria-hidden` red asterisk to the label and sets the control's `aria-required`. */
  required?: boolean;
  /** Explicit control id. Omit it — Field generates one and wires it. */
  htmlFor?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/** What a Field publishes to the control(s) inside it. */
export interface FieldContextValue {
  /** Id the label points at; apply it to the control. */
  id: string;
  /** Id of the `<label>` element itself — for a composite that names a `role="group"` with `aria-labelledby` instead of taking `id` (see `claimGroup`). */
  labelId: string;
  /** Id of the hint or error node, or undefined when neither is set. Lists **both**, hint first, when both exist. */
  describedBy?: string;
  /** True while the Field has an `error`. */
  invalid: boolean;
  /** Mirrors the Field's `required`. */
  required: boolean;
  /**
   * Call once on mount when the child is a `role="group"` of SEVERAL named
   * controls rather than one control (e.g. `DateRangePicker`). The Field's
   * label then drops `htmlFor` — keeping its element and styling — and the
   * group names itself with `aria-labelledby={labelId}`.
   *
   * Without it, the Field's label and the child's own labels all aim at one
   * input, and browsers *concatenate* every `<label for>` pointing at it:
   * one control absorbs the group's name and its siblings do not.
   */
  claimGroup: () => void;
}

/**
 * The supported extension point for a control that is not Input, Textarea or
 * Select: read it with `React.useContext(FieldContext)` and apply `id`,
 * `aria-describedby`, `aria-invalid` and `aria-required` yourself. A control
 * that is really a *group* of named controls calls `claimGroup()` instead of
 * taking `id`. `null` outside a Field.
 */
export declare const FieldContext: React.Context<FieldContextValue | null>;
export declare function Field(props: FieldProps): JSX.Element;
