import * as React from 'react';

/** A rejected file and the rule it broke. */
export interface FileRejection {
  file: File;
  reason: 'type' | 'size' | 'count';
}

/**
 * File selection, drop target and validation — nothing else.
 *
 * The component holds no files and performs no upload. `onSelect` receives the
 * accepted files and the rejections; the caller owns the queue, transport,
 * progress, retry and cancel, and renders each file with `FileItem`.
 */
export interface FileDropzoneProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'style' | 'onSelect' | 'accept' | 'multiple'> {
  /** Visible name of the target. Doubles as the picker's accessible name. */
  label?: React.ReactNode;
  /** Second line: what is allowed. State the accept list and the size cap here. */
  hint?: React.ReactNode;
  /** Native accept list — extensions, exact types or wildcards. Also enforced on drop. */
  accept?: string;
  multiple?: boolean;
  /** Per-file byte cap. Files over it arrive in the rejection list, never in `accepted`. */
  maxSize?: number;
  /** Cap across the whole selection, counted together with `currentCount`. */
  maxFiles?: number;
  /** How many files the caller already holds, so `maxFiles` can be enforced. */
  currentCount?: number;
  disabled?: boolean;
  /** Paints the critical boundary. The message itself belongs to the surface. Inside a `Field`, an invalid field sets this too. */
  invalid?: boolean;
  size?: 'sm' | 'md';
  onSelect?: (accepted: File[], rejected: FileRejection[]) => void;
  style?: React.CSSProperties;
}
export declare function FileDropzone(props: FileDropzoneProps): JSX.Element;

/** Same rules the component applies, exposed for callers validating elsewhere. */
export declare function validateFiles(
  files: File[] | FileList,
  opts?: { accept?: string; maxSize?: number; maxFiles?: number; currentCount?: number }
): { accepted: File[]; rejected: FileRejection[] };

/** B / KB / MB / GB, matching what FileItem prints. */
export declare function formatBytes(bytes: number): string;

/**
 * Extension → Lucide glyph name, for callers rendering files themselves
 * (a Table name cell, a document list). Falls back to `'file'`.
 *
 * Not consumed by `FileItem` — see its spec §02: a row carries no file-type
 * glyph, because a set of five drawings would show five identical icons.
 *
 * Import it from the package. Like every other lowercase helper here
 * (`validateFiles`, `formatBytes`, `parseHm`, `useAnchor`), it is NOT on
 * `window.<Namespace>` — the compiler exposes capital-initial names only — so
 * a `@dsCard` demo or spec page cannot call it and must inline its own map.
 */
export declare function fileGlyph(name: string): string;
