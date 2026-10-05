import * as React from 'react';

/**
 * One file in a selection: its identity, its size, its state and its removal.
 *
 * A representation, not an uploader. `state` and `progress` are props the
 * caller drives; the component starts nothing and retries nothing itself.
 */
export interface FileItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** The file name, shown in mono and truncated from the right. */
  name: string;
  /** Bytes. Printed as B / KB / MB / GB. */
  size?: number;
  state?: 'queued' | 'uploading' | 'complete' | 'failed';
  /** 0–100. Required when `state="uploading"` — the bar is determinate only. */
  progress?: number;
  /** Why it failed, in the operator's words. Replaces the status text. */
  error?: React.ReactNode;
  /** One extra fact after the size — revision, sheet count, who attached it. */
  meta?: React.ReactNode;
  /** Remove, or cancel while uploading. Omit for a read-only attachment. */
  onRemove?: () => void;
  /** Offered only when `state="failed"`. */
  onRetry?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function FileItem(props: FileItemProps): JSX.Element;
