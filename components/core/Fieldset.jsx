import React from 'react';
import { Icon } from './Icon.jsx';

/* The group scaffold: a real <fieldset> with a <legend>, and one message row
   under it. Extracted in 1.9.1 because RadioGroup, CheckboxGroup and
   ChipGroup had each grown their own copy — three implementations of the same
   twelve lines, already drifting (the newest legend was --text-sm on
   --text-primary while the other two were --text-xs on --field-label-text).

   It is NOT a Field. A Field's <label for> points at exactly one control, so
   it cannot name a set — that is why groups own their labelling at all. What
   this shares is the *rendering*, so a form mixing fields and groups has one
   look, not two.

   Hardened 1.16.0, with the same three defects Field had — which is the
   instructive part: the 1.9.1 extraction unified three copies of this code
   and carried the bug into the shared scaffold, so every group in the system
   inherited it from one place instead of three.

   • The hint was destroyed by the error, removing the rule ("Pick at least
     one") at the moment the user needed it to satisfy the failure.
   • Both messages shared one `-msg` id, which is why only one could render.
   • role="alert" sat on a conditionally-rendered node, so the live region
     arrived together with its text and announced unreliably.

   And one the extraction introduced by itself: it put aria-invalid and
   aria-required on the <fieldset>. Neither is supported on role="group" —
   ARIA defines no required or invalid state for a group — so both were
   ignored at best and flagged by auditing tools at worst. Worse, it
   silently overturned a decision CheckboxGroup's own spec had recorded in
   1.2.0 ("there is NO aria-required: ARIA defines no required state for a
   group"), and then became CheckboxGroup's implementation, leaving that
   spec describing behaviour its component no longer had. Both removed; the
   group's error reaches assistive technology the correct way, through
   aria-describedby plus the always-mounted role="alert" region. */

export function Fieldset({
  label,
  hint,
  error,
  required = false,
  disabled = false,
  gap = 'var(--space-2)',
  children,
  style,
  ...rest
}) {
  const autoId = React.useId();
  const hintId = `${autoId}-hint`;
  const errId = `${autoId}-err`;

  /* The aria-* escape matters: ChipGroup accepts aria-label instead of a
     visible legend, and without this check a correctly-labelled ChipGroup
     drew a false warning from its own scaffold. */
  if (!label && rest['aria-label'] == null && rest['aria-labelledby'] == null) {
    console.warn('[Meridian] Fieldset: no label. A <fieldset> with no <legend> is an unnamed group — the one thing this component exists to provide. Screen readers announce the options with no idea what question they answer. Pass a label, or aria-label if the question is already on screen.');
  }

  /* Hint first: it is the instruction, and it should be read before the
     failure. Both are listed when both exist. */
  const described = [hint ? hintId : null, error ? errId : null].filter(Boolean).join(' ') || undefined;

  return (
    <fieldset
      {...rest}
      disabled={disabled}
      aria-describedby={rest['aria-describedby'] ?? described}
      /* No aria-invalid and no aria-required here: role="group" supports
         neither, so both were dead attributes. The error is announced by the
         role="alert" region below and tied to the group by aria-describedby,
         which is the mechanism that actually works. */
      style={{
        display: 'flex', flexDirection: 'column', gap,
        border: 0, margin: 0, padding: 0,
        /* Both, deliberately: a fieldset's default min-inline-size is
           min-content, which stops it shrinking inside a flex or grid parent
           however small its content is. */
        minInlineSize: 0, minWidth: 0,
        ...style,
      }}
    >
      {label && (
        <legend style={{ float: 'none', display: 'flex', alignItems: 'center', gap: 4, padding: 0, fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)', color: 'var(--field-label-text)', letterSpacing: 'var(--tracking-body)' }}>
          {label}
          {required && <span style={{ color: 'var(--field-required-mark)' }} aria-hidden="true">*</span>}
        </legend>
      )}
      {children}
      {/* The hint SURVIVES the error: it carries the rule, the error carries
          what went wrong. */}
      {hint && <span id={hintId} style={{ fontSize: 'var(--text-xs)', color: 'var(--field-hint-text)' }}>{hint}</span>}
      {/* Always mounted. A live region inserted with its content is
          announced inconsistently. Never on an individual control: the SET
          is what is unanswered. */}
      <span id={errId} role="alert" style={error ? { display: 'flex', alignItems: 'flex-start', gap: 'var(--field-message-gap)', fontSize: 'var(--text-xs)', color: 'var(--field-error-text)' } : { display: 'none' }}>
        {error ? <><Icon name="circle-alert" size="xs" aria-hidden="true" style={{ flex: 'none', marginTop: 2 }} />{error}</> : null}
      </span>
    </fieldset>
  );
}
