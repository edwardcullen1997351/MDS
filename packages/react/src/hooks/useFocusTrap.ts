import { useEffect, type RefObject } from 'react';

type FocusEntry = { container: HTMLElement; returnTo: HTMLElement | null; allowed: HTMLElement[] };

/** Shared across every React overlay in the document. */
export const FocusRestorationStack: FocusEntry[] = [];
const originalInert = new Map<HTMLElement, boolean>();

const focusable = (root: HTMLElement): HTMLElement[] =>
  Array.from(root.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'))
    .filter((node) => !node.closest('[inert]') && node.getClientRects().length > 0);

function syncInert(): void {
  for (const [node, value] of originalInert) node.inert = value;
  originalInert.clear();
  const top = FocusRestorationStack.at(-1);
  if (!top) return;
  const allowed = [top.container, ...top.allowed];
  let branch: HTMLElement | null = top.container;
  while (branch?.parentElement) {
    for (const sibling of Array.from(branch.parentElement.children)) {
      if (!(sibling instanceof HTMLElement) || sibling === branch) continue;
      if (allowed.some((node) => sibling === node || sibling.contains(node))) continue;
      if (!originalInert.has(sibling)) originalInert.set(sibling, sibling.inert);
      sibling.inert = true;
    }
    branch = branch.parentElement;
  }
}

/** Activates a focus trap and returns its cleanup function. */
export function activateFocusTrap(container: HTMLElement, allowed: HTMLElement[] = []): () => void {
    const returnTo = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const entry: FocusEntry = { container, returnTo, allowed };
    FocusRestorationStack.push(entry);
    syncInert();
    (focusable(container)[0] ?? container).focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (FocusRestorationStack.at(-1) !== entry || event.key !== 'Tab') return;
      const nodes = focusable(container);
      if (!nodes.length) { event.preventDefault(); container.focus(); return; }
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (event.shiftKey && (document.activeElement === first || !container.contains(document.activeElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !container.contains(document.activeElement))) {
        event.preventDefault(); first.focus();
      }
    };
    const onFocus = (event: FocusEvent) => {
      if (FocusRestorationStack.at(-1) === entry && !container.contains(event.target as Node)) {
        (focusable(container)[0] ?? container).focus();
      }
    };
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('focusin', onFocus);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('focusin', onFocus);
      const wasTop = FocusRestorationStack.at(-1) === entry;
      const index = FocusRestorationStack.indexOf(entry);
      if (index >= 0) FocusRestorationStack.splice(index, 1);
      syncInert();
      if (wasTop && returnTo?.isConnected && !returnTo.closest('[inert]')) returnTo.focus();
      else if (wasTop) FocusRestorationStack.at(-1)?.container.focus();
    };
}

/** Trap Tab within an active overlay and restore focus in stack order. */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
  allowedRefs?: RefObject<HTMLElement | null>[]
): void {
  useEffect(() => {
    const container = containerRef.current;
    if (!active || !container) return;
    const allowed = allowedRefs?.map((ref) => ref.current).filter((node): node is HTMLElement => !!node) ?? [];
    return activateFocusTrap(container, allowed);
  }, [active, containerRef, allowedRefs]);
}
