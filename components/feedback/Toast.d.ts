import * as React from 'react';

export type ToastTone = 'info' | 'success' | 'warning' | 'danger';

/** Transient confirmation or failure notice, 360px wide. */
export interface ToastProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'title'> {
  tone?: ToastTone;
  title: React.ReactNode;
  /** One sentence of detail. Skip it when the title says everything. */
  message?: React.ReactNode;
  /** A single `variant="link"` Button, e.g. Undo or View logs. */
  action?: React.ReactNode;
  onDismiss?: () => void;
  /** Announce this toast itself — only for a Toast rendered outside Toaster. */
  live?: 'off' | 'on';
  style?: React.CSSProperties;
}
export declare function Toast(props: ToastProps): JSX.Element;

export interface ToastSpec {
  /** Reuse an id to replace a toast in place ("Exporting…" → "Export ready"). */
  id?: string;
  tone?: ToastTone;
  title: React.ReactNode;
  message?: React.ReactNode;
  action?: React.ReactNode;
  /** Milliseconds, or null to persist. Defaults: info/success 5000, warning 8000, danger null. */
  duration?: number | null;
  /** false removes the dismiss button — only for a toast that expires on its own. */
  dismissible?: boolean;
}

/** The viewport, queue and timers. Mount once at the app root. */
export interface ToasterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  position?: 'bottom-right' | 'top-right' | 'bottom-center' | 'top-center';
  /** Toasts rendered at once; the rest queue behind a "+N more" line. */
  maxVisible?: number;
  style?: React.CSSProperties;
}
export declare function Toaster(props: ToasterProps): JSX.Element;
export declare namespace Toaster {
  /** Returns the toast id. A string is shorthand for { title }. */
  function show(input: string | ToastSpec): string;
  function success(input: string | ToastSpec): string;
  function warning(input: string | ToastSpec): string;
  function error(input: string | ToastSpec): string;
  function dismiss(id: string): void;
  function dismissAll(): void;
}
