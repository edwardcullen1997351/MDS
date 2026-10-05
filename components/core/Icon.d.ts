import * as React from 'react';

/**
 * Lucide glyph tinted with currentColor. Every icon in a Meridian surface
 * renders through this component — never inline SVG, an <img>, an icon font
 * or emoji, none of which inherit text colour or the dark scope.
 *
 * Not a control: no role, no focus, no accessible name by default. A glyph
 * that must be clicked is an `IconButton`.
 */
export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Lucide icon name in kebab-case, e.g. "arrow-up-right", "circle-check". */
  name: string;
  /**
   * Square size — a token name (preferred) or a number in px.
   *
   *   'xs'   14px  table rows, badges, small controls
   *   'sm'   16px  buttons, nav, DEFAULT
   *   'md'   20px  page headers
   *   'lg'   22px  empty states — the ceiling; nothing larger exists
   *   'mark' 11px  a mark inside a control's OWN box (a checkbox tick, a tag
   *                remove ×, a sort caret). Never on a surface.
   *
   * Numbers still work, so existing call sites are unaffected, but a raw
   * number that is not one of the five steps violates the icon scale.
   */
  size?: 'mark' | 'xs' | 'sm' | 'md' | 'lg' | number;
  /** Accessible label. Omit for decorative icons (they render aria-hidden). */
  title?: string;
}
export declare function Icon(props: IconProps): JSX.Element;
export declare namespace Icon {
  /**
   * Point Icon at your own origin instead of the pinned lucide-static CDN.
   * Call once at startup, before the first render:
   *
   *   Icon.setBasePath('/assets/icons/');   // expects <name>.svg per glyph
   *
   * Removes the runtime CDN dependency, which otherwise makes every glyph in
   * the product invisible offline or under a strict img-src policy.
   *
   * Config lives on the component because only capital-initial exports reach
   * `window.<Namespace>` — a bare `setIconBasePath` would be unreachable for
   * any consumer loading the compiled bundle.
   */
  function setBasePath(path: string): void;
  /** The base path glyphs currently resolve against. */
  function getBasePath(): string;
}
