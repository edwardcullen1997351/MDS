import React from 'react';
import { Icon } from './Icon.jsx';

/* Tag is the system's only *user-derived* chip: its text comes from the data
   or from what the user typed, never from a fixed set the design owns. Badge
   is the opposite — a status word we chose, in a colour that means something.
   That single distinction is why Tag has no tones (§04) and why its label is
   set in mono by default: a facet token is a value to be read exactly.

   Two structural decisions the code enforces:
   · The body is a <button> only when there is something to press. A tag that
     merely displays a value is a <span> and is not a tab stop.
   · The remove affordance is a real <button> when the body is not one, and
     pointer-only (with Delete/Backspace on the focused tag) when it is —
     because a button inside a button is invalid HTML, and a filter bar with
     two tab stops per tag cannot be traversed. */

const SIZES = {
  sm: { h: 'var(--tag-height-sm)', px: 'var(--tag-padding-sm)', gap: 4, text: 'var(--text-2xs)', icon: 'mark' },
  md: { h: 'var(--tag-height-md)', px: 'var(--tag-padding-md)', gap: 6, text: 'var(--text-2xs)', icon: 'xs' },
};

export function Tag({
  label,
  children,
  icon,
  onRemove,
  removeLabel,
  selected = false,
  disabled = false,
  size = 'md',
  font = 'mono',
  maxWidth,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const [closeHover, setCloseHover] = React.useState(false);
  const S = SIZES[size] || SIZES.md;
  const text = label ?? children;
  const pressable = Boolean(rest.onClick) && !disabled;
  /* Body is a button only when pressing it does something. */
  const asButton = Boolean(rest.onClick);
  const removeName = removeLabel || `Remove ${typeof text === 'string' ? text : 'tag'}`;

  function onKeyDown(e) {
    rest.onKeyDown?.(e);
    if (disabled || !onRemove) return;
    if (e.key === 'Backspace' || e.key === 'Delete') { e.preventDefault(); onRemove(e); }
  }

  const bg = disabled
    ? 'var(--tag-background-disabled)'
    : selected
      ? (pressable && hover ? 'var(--tag-background-selected-hover)' : 'var(--tag-background-selected)')
      : pressable && hover ? 'var(--tag-background-hover)' : 'var(--tag-background)';

  const removeButton = onRemove && (
    <span
      /* A real button when the body is not one; pointer-only decoration when
         it is (keyboard removal is Delete/Backspace on the tag itself). */
      {...(asButton
        ? { role: 'presentation', 'aria-hidden': true }
        : { role: 'button', tabIndex: disabled ? -1 : 0, 'aria-label': removeName,
            onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!disabled) onRemove(e); } } })}
      onClick={(e) => { e.stopPropagation(); if (!disabled) onRemove(e); }}
      onMouseEnter={() => setCloseHover(true)}
      onMouseLeave={() => setCloseHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        /* The glyph box stays 16px; the TARGET grows on a coarse pointer and
           overflows the tag through negative margins, so a 44px touch area
           costs no layout. */
        width: 'var(--tag-remove-target)', height: 'var(--tag-remove-target)',
        margin: 'calc((var(--tag-remove-target) - 16px) / -2)',
        marginRight: 'calc((var(--tag-remove-target) - 16px) / -2 - 2px)',
        flex: 'none',
        color: disabled ? 'var(--tag-foreground-disabled)' : closeHover ? 'var(--tag-remove-foreground-hover)' : 'var(--tag-remove-foreground)',
        background: closeHover && !disabled ? 'var(--tag-remove-background-hover)' : 'transparent',
        border: 0, borderRadius: 'var(--radius-xs)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'var(--transition-control)',
      }}
    >
      <Icon name="x" size="mark" />
    </span>
  );

  const Body = asButton ? 'button' : 'span';
  return (
    <Body
      {...(asButton ? { type: 'button', disabled, 'aria-pressed': selected } : { 'aria-disabled': disabled || undefined })}
      {...(onRemove && !disabled ? { tabIndex: rest.tabIndex ?? 0, 'aria-keyshortcuts': 'Delete' } : null)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      {...rest}
      onKeyDown={onKeyDown}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: S.gap,
        height: S.h,
        maxWidth,
        padding: `0 ${S.px} 0 ${S.px}`,
        paddingRight: onRemove ? `calc(${S.px} - 4px)` : S.px,
        fontFamily: 'var(--font-sans)',
        fontSize: S.text,
        fontWeight: 'var(--weight-regular)',
        textAlign: 'left',
        color: disabled ? 'var(--tag-foreground-disabled)' : selected ? 'var(--tag-foreground-selected)' : 'var(--tag-foreground)',
        background: bg,
        border: `var(--border-width) solid ${disabled ? 'var(--tag-border-disabled)' : selected ? 'var(--tag-border-selected)' : pressable && hover ? 'var(--tag-border-hover)' : 'var(--tag-border)'}`,
        borderRadius: 'var(--tag-radius)',
        boxShadow: focus && !disabled ? 'var(--tag-focus-ring)' : 'none',
        cursor: disabled ? 'not-allowed' : pressable ? 'pointer' : 'default',
        transition: 'var(--transition-control)',
        ...style,
      }}
    >
      {icon && <Icon name={icon} size={S.icon} style={{ flex: 'none', color: disabled ? 'inherit' : selected ? 'inherit' : 'var(--tag-icon)' }} />}
      <span style={{
        fontFamily: font === 'mono' ? 'var(--font-mono)' : 'var(--font-sans)',
        letterSpacing: font === 'mono' ? 'var(--tracking-label)' : 'var(--tracking-body)',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0,
      }}>{text}</span>
      {removeButton}
    </Body>
  );
}

/* A wrapped row of tags with one tab stop and arrow-key travel between them,
   plus an overflow count that always has somewhere to go: it is a real button
   that either calls onShowMore or, by default, reveals the rest in place. A
   count with no destination is a dead end, so this component does not offer
   one. */
export const TagList = React.forwardRef(function TagList({ children, limit, moreLabel, onShowMore, gap = 6, align = 'start', style, ...rest }, forwardedRef) {
  const ref = React.useRef(null);
  const [expanded, setExpanded] = React.useState(false);
  React.useImperativeHandle(forwardedRef, () => ref.current);
  const items = React.Children.toArray(children).filter(Boolean);
  const shown = limit != null && !expanded ? items.slice(0, limit) : items;
  const hidden = items.length - shown.length;

  function onKeyDown(e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const stops = Array.from(ref.current?.querySelectorAll('[data-tag-stop]') || []);
    const i = stops.indexOf(e.target.closest?.('[data-tag-stop]'));
    if (i < 0) return;
    e.preventDefault();
    stops[(i + (e.key === 'ArrowRight' ? 1 : -1) + stops.length) % stops.length]?.focus();
  }

  return (
    <div
      ref={ref}
      onKeyDown={onKeyDown}
      {...rest}
      style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: align === 'end' ? 'flex-end' : 'flex-start', gap, minWidth: 0, ...style }}
    >
      {shown.map((child, i) => React.isValidElement(child)
        ? React.cloneElement(child, { 'data-tag-stop': '', tabIndex: i === 0 ? 0 : -1 })
        : child)}
      {hidden > 0 && (
        <button
          type="button"
          data-tag-stop=""
          tabIndex={shown.length ? -1 : 0}
          onClick={(e) => (onShowMore ? onShowMore(e, hidden) : setExpanded(true))}
          style={{
            font: 'inherit', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)',
            color: 'var(--text-tertiary)', background: 'transparent', border: 0,
            padding: '2px 4px', borderRadius: 'var(--radius-xs)', cursor: 'pointer',
            textDecoration: 'underline', textDecorationColor: 'var(--border-default)',
            textUnderlineOffset: 2, minHeight: 'var(--tag-remove-target)',
          }}
        >
          {moreLabel ? moreLabel(hidden) : `+${hidden} more`}
        </button>
      )}
      {expanded && limit != null && items.length > limit && (
        <button
          type="button"
          data-tag-stop=""
          tabIndex={-1}
          onClick={() => setExpanded(false)}
          style={{
            font: 'inherit', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)',
            color: 'var(--text-tertiary)', background: 'transparent', border: 0,
            padding: '2px 4px', borderRadius: 'var(--radius-xs)', cursor: 'pointer',
            textDecoration: 'underline', textDecorationColor: 'var(--border-default)',
            textUnderlineOffset: 2, minHeight: 'var(--tag-remove-target)',
          }}
        >
          show fewer
        </button>
      )}
    </div>
  );
});
