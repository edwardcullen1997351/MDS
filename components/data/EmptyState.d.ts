import * as React from 'react';

/**
 * The absence of data, explained — and the reason it takes a `variant` rather
 * than just a message: "empty" is four unrelated situations, and treating them
 * as one is the defect this component prevents.
 *
 * Renders no surface and no border by default: it sits inside a `Card` or a
 * `Table` region that already has one.
 *
 * Not an error (that is `Alert tone="danger"`, which keeps a cause, a retry and
 * an assertive announcement) and not a loading state (that is `Skeleton`).
 */
export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /**
   * · `first-run` — nothing exists yet. Wants a create action.
   * · `no-results` — data exists, a filter hides it. Wants a way BACK, never "create your first".
   * · `cleared` — nothing here because the work is done. A success; takes no actions.
   * · `restricted` — this user may not see it. An explanation, not a task.
   */
  variant?: 'first-run' | 'no-results' | 'cleared' | 'restricted';
  /** The one line that is always read. Required in practice — omitting it warns. */
  title: React.ReactNode;
  /** One or two sentences, capped at `--empty-state-measure`. */
  children?: React.ReactNode;
  /** A shortcut or doc link, rendered BELOW the actions. */
  hint?: React.ReactNode;
  /** Overrides the variant's glyph; `false` removes it. Capped at 22px — there is no illustration slot. */
  icon?: string | false;
  /** Buttons. One primary at most. Wraps rather than shrinking. */
  actions?: React.ReactNode;
  /** Match the surrounding outline — a card body under an `h2` needs `3`. Default 3. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** `sm` inside a card or panel · `md` a page region · `lg` a full page or first run. */
  size?: 'sm' | 'md' | 'lg';
  /** `start` for a narrow panel or a drawer, where centred text reads as an error page. */
  align?: 'center' | 'start';
  /** Sunken surface and a hairline — only when NOT already inside a bordered container. */
  bordered?: boolean;
  /** `polite` when this replaces content in response to a user action (a filter that matched nothing). Default off — one present on load was already read in document order. */
  live?: 'off' | 'polite';
  style?: React.CSSProperties;
  /** Hide the illustration and tighten padding below 380px of CONTAINER width, via a container query. Opt-in: the glyph is decoration, the title and action are the content. */
  responsive?: boolean;
}
export declare function EmptyState(props: EmptyStateProps): JSX.Element;
