import React from 'react';
import { IconButton } from '../core/IconButton.jsx';
import { Menu } from '../navigation/Menu.jsx';
import { Divider } from '../primitives/Divider.jsx';

/* A persistent action surface: one semantically related set of controls that
   all operate on the same context. The composite owns the group boundary, the
   single tab stop, the arrow-key contract and the overflow relationship — the
   controls keep their own activation behaviour. See the Toolbar spec, §01.

   NOT a navigation bar (that is Tabs or a nav landmark), NOT a way to align
   things in a row (that is Stack direction="row"). */

const STOP_SELECTOR = 'button,[href],input:not([type="hidden"]),select,textarea,[tabindex]:not([tabindex="-1"])';

/* The toolbar is one tab stop, so it has to know which controls are stops.
   A radio group (SegmentedControl) counts as ONE stop — the checked option —
   because the platform already owns arrow selection inside it. */
function collectStops(root) {
  const all = Array.from(root.querySelectorAll(STOP_SELECTOR)).filter(
    (el) => !el.disabled && el.offsetParent !== null
  );
  const seen = {};
  return all.filter((el) => {
    if (el.type !== 'radio') return true;
    if (seen[el.name]) return false;
    const group = all.filter((o) => o.type === 'radio' && o.name === el.name);
    const stop = group.filter((o) => o.checked)[0] || group[0];
    if (el !== stop) return false;
    seen[el.name] = true;
    return true;
  });
}

const isDivider = (child) => child?.type === Divider;

/* Only a lettered or icon action can become a menu row: its whole contract is
   label + icon + onClick. A ButtonGroup, a SegmentedControl or a Menu cannot
   be flattened into one row without changing what it means, so those stay put
   and the toolbar collapses around them.

   The label is read by flattening TEXT out of the child's subtree, not by
   requiring a raw string child: an editor, an i18n wrapper or a <strong> all
   legitimately put an element between the Button and its words, and a test
   that demands a bare string silently empties the candidate list and takes the
   whole overflow policy with it. Props, never component identity, for the same
   reason. Spec §11, §13. */
function textOf(node) {
  if (node === null || node === undefined || node === false) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (React.isValidElement(node)) return textOf(node.props?.children);
  return '';
}

/* A child holding controls of its own is a group, not an action. */
function holdsControls(node) {
  if (Array.isArray(node)) return node.some(holdsControls);
  if (!React.isValidElement(node)) return false;
  const p = node.props || {};
  if (p.icon || p.variant || p.options || p.items || p.trigger) return true;
  return holdsControls(p.children);
}

function overflowRow(child) {
  const p = child.props || {};
  if (p.options || p.items || p.trigger) return null; // SegmentedControl, Menu
  if (holdsControls(p.children)) return null; // ButtonGroup
  const text = textOf(p.children).trim();
  if (text) return { label: text, icon: p.iconLeft, disabled: p.disabled, onSelect: p.onClick };
  if (p.icon && typeof p.label === 'string') return { label: p.label, icon: p.icon, disabled: p.disabled, onSelect: p.onClick };
  return null;
}

/* One height rhythm for the surface: a control that does not set its own size
   takes the toolbar's. Forgetting it on one child otherwise puts a 34px button
   beside a 28px one, which is what breaks a toolbar row. Divider is sizeless —
   it only ever needs the cross axis. Spec §05. */
const SIZEABLE = ['icon', 'iconLeft', 'variant', 'options', 'items', 'trigger', 'label'];
const takesSize = (p) => SIZEABLE.some((k) => p[k] !== undefined);
function withSize(child, size, vertical) {
  if (isDivider(child)) return vertical ? child : React.cloneElement(child, { orientation: 'vertical' });
  const p = child.props || {};
  if (p.size || !takesSize(p)) return child;
  /* A Menu's `size` sizes its rows; its trigger is the caller's own control
     and would keep its default height — an md ellipsis beside four sm actions
     is exactly the broken rhythm §05 exists to prevent. */
  if (p.trigger && React.isValidElement(p.trigger) && !p.trigger.props?.size) {
    return React.cloneElement(child, { size, trigger: React.cloneElement(p.trigger, { size }) });
  }
  return React.cloneElement(child, { size });
}

/* One tab stop, enforced against EVERY focusable descendant — not just the
   stops. A SegmentedControl's unchecked radios are not stops, and if they keep
   their default tabIndex the surface quietly has three tab stops, which §08
   calls worse than none. */
function publishStop(root, stops, index) {
  const on = stops[index];
  Array.from(root.querySelectorAll(STOP_SELECTOR)).forEach((el) => {
    if (el !== on) el.tabIndex = -1;
  });
  if (on) on.tabIndex = 0;
}

export function Toolbar({
  label,
  size = 'md',
  orientation = 'horizontal',
  disabled = false,
  overflow = 'none',
  overflowLabel = 'More actions',
  children,
  style,
  ...rest
}) {
  const items = React.Children.toArray(children).filter(Boolean);
  const vertical = orientation === 'vertical';
  const ref = React.useRef(null);
  const lastWidth = React.useRef(0);
  const [collapsed, setCollapsed] = React.useState(0);
  const active = React.useRef(0);

  if (!label) {
    console.warn('[Meridian] Toolbar: `label` is required — role="toolbar" with no accessible name is announced as an unlabelled group of controls.');
  }
  if (overflow === 'menu' && vertical) {
    console.warn('[Meridian] Toolbar: overflow="menu" is only measured on the horizontal axis. A vertical toolbar in a short container should scroll or shorten its action list, not collapse.');
  }

  /* Which trailing actions MAY collapse: last first, high-priority pinned,
     and only ones that survive as a menu row. */
  const candidates = [];
  for (let i = items.length - 1; i >= 0; i--) {
    const c = items[i];
    if (c.props?.['data-priority'] === 'high') continue;
    if (overflowRow(c)) candidates.push(i);
  }

  /* Fit by measurement, one action per pass, until the row stops overflowing.
     Measuring the live element rather than cached widths means loaded fonts, a
     size change and a density change are all already accounted for; a hidden
     child contributes nothing to scrollWidth, so the loop converges. */
  React.useLayoutEffect(() => {
    if (overflow !== 'menu' || vertical || !ref.current) return;
    const el = ref.current;
    if (el.scrollWidth > el.clientWidth + 1 && collapsed < candidates.length) {
      setCollapsed(collapsed + 1);
    }
  });

  /* On a real width change, start from everything shown again — an action that
     fits must come back, not stay in the menu because it once did not. */
  React.useEffect(() => {
    if (overflow !== 'menu' || vertical || !ref.current) return;
    const el = ref.current;
    lastWidth.current = el.clientWidth;
    const ro = new ResizeObserver(() => {
      if (Math.abs(el.clientWidth - lastWidth.current) < 1) return;
      lastWidth.current = el.clientWidth;
      setCollapsed(0);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [overflow, vertical, size, items.length]);

  /* Roving tabindex. Recomputed every render: a collapse, a disabled action or
     a changed selection inside a SegmentedControl all move the stops. */
  React.useEffect(() => {
    if (disabled || !ref.current) return;
    const stops = collectStops(ref.current);
    if (!stops.length) return;
    if (active.current > stops.length - 1) active.current = stops.length - 1;
    publishStop(ref.current, stops, active.current);
  });

  const onKeyDown = (e) => {
    if (disabled) return;
    const main = vertical ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight'];
    const isMain = main.indexOf(e.key) > -1;
    if (!isMain && e.key !== 'Home' && e.key !== 'End') return;
    const stops = collectStops(ref.current);
    if (!stops.length) return;
    /* The stop is the checked radio, but focus may sit on any radio in the
       group — walk up to the containing stop. */
    let from = stops.indexOf(e.target);
    if (from < 0) from = stops.findIndex((s) => s.closest('fieldset,[role="group"]') && s.closest('fieldset,[role="group"]').contains(e.target));
    if (from < 0) from = active.current;
    let next = from;
    if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = stops.length - 1;
    else next = from + (e.key === main[1] ? 1 : -1);
    /* Does not wrap: Home and End are the ends. A wrap in a toolbar reads as a
       failed keypress, since nothing about the surface implies a ring. */
    if (next < 0 || next > stops.length - 1) { e.preventDefault(); return; }
    e.preventDefault(); // main-axis arrows belong to the toolbar, so a radio
    e.stopPropagation(); // child cannot also change its value on the way past
    active.current = next;
    publishStop(ref.current, stops, next);
    stops[next].focus();
  };

  const onFocus = (e) => {
    if (disabled) return;
    const stops = collectStops(ref.current);
    const i = stops.indexOf(e.target);
    if (i > -1) active.current = i;
  };

  const hide = candidates.slice(0, collapsed);
  const rows = items
    .map((c, i) => (hide.indexOf(i) > -1 ? { ...overflowRow(c), _i: i } : null))
    .filter(Boolean);

  /* A rule that ends up leading or trailing is separating nothing. */
  const visible = items.map((c, i) => (hide.indexOf(i) > -1 ? null : { c, i })).filter(Boolean);
  while (visible.length && isDivider(visible[0].c)) visible.shift();
  while (visible.length && isDivider(visible[visible.length - 1].c)) visible.pop();
  const shownIdx = visible.map((v) => v.i);

  const Tag = disabled ? 'fieldset' : 'div';

  return (
    <Tag
      ref={ref}
      role="toolbar"
      aria-label={label}
      aria-orientation={vertical ? 'vertical' : undefined}
      disabled={disabled || undefined}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      {...rest}
      style={{
        display: 'flex',
        flexDirection: vertical ? 'column' : 'row',
        alignItems: 'center',
        gap: 'var(--toolbar-gap)',
        padding: 'var(--toolbar-padding)',
        background: 'var(--toolbar-background)',
        border: `var(--border-width) solid var(--toolbar-border)`,
        borderRadius: 'var(--toolbar-radius)',
        flexWrap: 'nowrap',
        minWidth: 0,
        margin: 0,
        /* A failed fit must not spill into the panel — but clipping is only
           safe once something CAN collapse, or an action would be hidden with
           no menu to reach it. §11: availability never changes. */
        ...(overflow === 'menu' && !vertical && candidates.length ? { overflow: 'clip', overflowClipMargin: '4px' } : null),
        ...style,
      }}
    >
      {items.map((child, i) => {
        const on = shownIdx.indexOf(i) > -1;
        return (
          <span
            key={child.key || i}
            style={{
              display: on ? 'inline-flex' : 'none',
              alignItems: 'center',
              flex: 'none',
              alignSelf: isDivider(child) ? 'stretch' : undefined,
            }}
          >
            {withSize(child, size, vertical)}
          </span>
        );
      })}
      {rows.length ? (
        <span style={{ display: 'inline-flex', flex: 'none', marginLeft: vertical ? 0 : 'auto' }}>
          <Menu
            label={overflowLabel}
            size={size}
            items={rows.map((r) => ({ label: r.label, icon: r.icon, disabled: r.disabled, onSelect: r.onSelect }))}
            trigger={<IconButton icon="ellipsis" label={overflowLabel} size={size} />}
          />
        </span>
      ) : null}
    </Tag>
  );
}
