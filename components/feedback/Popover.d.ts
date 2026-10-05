import * as React from 'react';

/**
 * A non-modal panel anchored to a trigger. The system's anchoring primitive:
 * `Combobox`, `Autocomplete` and `Tooltip` all position through the same
 * engine (`useAnchor`), so a popover is not clipped by an ancestor's
 * `overflow: hidden`, flips when its side runs out of room, and caps its
 * height to the room that exists.
 *
 * Focus MOVES into the panel and returns to the trigger on close. Not modal
 * and not trapped: Escape, an outside pointer-down, or tabbing out dismisses
 * it. For a blocking decision use `Dialog`; for a hover label use `Tooltip`.
 */
export interface PopoverProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'style'> {
  /** The element that opens the panel. Receives `aria-haspopup` and `aria-expanded`. */
  trigger: React.ReactNode;
  /** Panel heading, and its accessible name. Renders a close button. Omit only with `aria-label`. */
  title?: React.ReactNode;
  /** Controlled open state. Omit for uncontrolled. */
  open?: boolean;
  /** Fires with the next open state, from the trigger, Escape, outside click or focus leaving. */
  onOpenChange?: (open: boolean) => void;
  /** Also fires on close, for consumers that only care about dismissal. */
  onClose?: () => void;
  /** Preferred side. Flips to the opposite side when there is not enough room. */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Alignment along the trigger's edge. Shifts to stay in the viewport. */
  align?: 'start' | 'center' | 'end';
  /** Gap between trigger and panel, in px. Default 4. */
  offset?: number;
  /** sm 240 · md 320 · lg 400, or an explicit px number. */
  width?: 'sm' | 'md' | 'lg' | number;
  /** Take the trigger's width instead — for panels that belong to a field. */
  matchTriggerWidth?: boolean;
  /** Padding inside the panel. `false` for edge-to-edge content: lists, tables, menus. */
  padded?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Popover(props: PopoverProps): JSX.Element;
