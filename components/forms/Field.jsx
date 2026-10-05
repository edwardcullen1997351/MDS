import React from 'react';
import { Icon } from '../core/Icon.jsx';

/* Field owns the accessible plumbing for every control in the system: the
   label association, the id, aria-describedby, aria-invalid, aria-required.
   Nine components read it. That reach is the reason it is worth being strict
   here — a defect in Field is a defect in every form in the product, and it
   arrives silently, because nothing about it is visible in a screenshot.

   Hardened 1.16.0. Three real defects, all about labelling and announcement:

   • The hint was DESTROYED by the error. `error ? err : hint ? hint : null`
     removed the instruction at the exact moment the user needed it to fix
     the problem — a WCAG 3.3.2/3.3.3 failure, and the most consequential
     thing in this file. "Must be under 30000" is what makes "Too large"
     actionable, and it vanished when the error appeared.
   • Both messages shared ONE id (`<id>-msg`), which is *why* only one could
     render: two nodes with the same id is invalid, and aria-describedby had
     no way to point at both. Now `-hint` and `-err`, with describedBy
     listing whichever exist.
   • role="alert" was on a conditionally-rendered node, so the live region
     was inserted into the DOM together with its text — announced
     unreliably across screen readers. The same defect Snackbar and Alert
     were both built to avoid; the error region is now always mounted and
     only its content is conditional. */

export const FieldContext = React.createContext(null);

export function Field({
  label,
  labelHidden = false,
  hint,
  error,
  required = false,
  htmlFor,
  children,
  style,
  ...rest
}) {
  const auto = React.useId();
  const id = htmlFor || auto;
  const hintId = `${id}-hint`;
  const errId = `${id}-err`;
  const labelId = `${id}-label`;

  /* A composite child (DateRangePicker) is a role="group" of SEVERAL named
     controls, not one control. It claims the group on mount and the label
     then stops pointing at a single input: `htmlFor` would otherwise name
     one endpoint "Shift period First shift" while its partner got only
     "Last shift" — browsers concatenate every <label for> aimed at an
     input. The label stays a <label> element, keeps its styling, and is
     referenced by the group through `labelId`. */
  const [group, setGroup] = React.useState(false);
  const claimGroup = React.useCallback(() => setGroup(true), []);

  if (!label) {
    console.warn('[Meridian] Field: no label. Field wires the label association, so without one the control inside it has an id, a description and no NAME — which is invisible on screen and leaves the control unusable by a screen reader. Pass `label` (with labelHidden if it must not be seen), or give the control its own aria-label and do not wrap it in a Field.');
  }

  /* Both ids are listed when both exist, and the hint comes first: it is the
     instruction, and it should be read before the failure. */
  const described = [hint ? hintId : null, error ? errId : null].filter(Boolean).join(' ') || undefined;

  const ctx = React.useMemo(
    () => ({ id, labelId, describedBy: described, invalid: !!error, required, claimGroup }),
    [id, labelId, described, error, required, claimGroup],
  );

  return (
    <div {...rest} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--field-gap)', minWidth: 0, ...style }}>
      {label && (
        <label
          id={labelId}
          htmlFor={group ? undefined : id}
          style={labelHidden
            ? { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }
            : { display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)', color: 'var(--field-label-text)', letterSpacing: 'var(--tracking-body)' }}
        >
          {label}
          {required && <span style={{ color: 'var(--field-required-mark)' }} aria-hidden="true">*</span>}
        </label>
      )}
      <FieldContext.Provider value={ctx}>{children}</FieldContext.Provider>
      {/* The hint SURVIVES the error. It carries the rule; the error carries
          what went wrong. Removing the rule when the user finally needs it
          is the defect this component shipped with. */}
      {hint && <span id={hintId} style={{ fontSize: 'var(--text-xs)', color: 'var(--field-hint-text)' }}>{hint}</span>}
      {/* Always mounted, even with no error: a live region added to the DOM
          at the same moment as its content is announced inconsistently. */}
      <span id={errId} role="alert" style={error ? { display: 'flex', alignItems: 'flex-start', gap: 'var(--field-message-gap)', fontSize: 'var(--text-xs)', color: 'var(--field-error-text)' } : { display: 'none' }}>
        {error ? <><Icon name="circle-alert" size="xs" aria-hidden="true" style={{ flex: 'none', marginTop: 2 }} />{error}</> : null}
      </span>
    </div>
  );
}
