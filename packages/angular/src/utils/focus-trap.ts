type Entry = { element: HTMLElement; restore: HTMLElement | null; allowed: HTMLElement[] };

/** Document-wide restoration order shared by Angular dialogs and drawers. */
export const FocusRestorationStack: Entry[] = [];
const originalInert = new Map<HTMLElement, boolean>();

function focusable(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'))
    .filter((element) => element.getClientRects().length > 0 && !element.closest('[inert]'));
}

function syncInert(): void {
  for (const [element, value] of originalInert) element.inert = value;
  originalInert.clear();
  const top = FocusRestorationStack[FocusRestorationStack.length - 1];
  if (!top) return;
  const allowed = [top.element, ...top.allowed];
  let branch: HTMLElement | null = top.element;
  while (branch?.parentElement) {
    for (const sibling of Array.from(branch.parentElement.children)) {
      if (!(sibling instanceof HTMLElement) || sibling === branch) continue;
      if (allowed.some((element) => sibling === element || sibling.contains(element))) continue;
      if (!originalInert.has(sibling)) originalInert.set(sibling, sibling.inert);
      sibling.inert = true;
    }
    branch = branch.parentElement;
  }
}

/** Activates a focus trap and returns its cleanup function. */
export function useFocusTrap(element: HTMLElement, allowed: HTMLElement[] = []): () => void {
  const restore = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const entry: Entry = { element, restore, allowed };
  FocusRestorationStack.push(entry);
  syncInert();
  (focusable(element)[0] ?? element).focus();
  const keydown = (event: KeyboardEvent) => {
    if (FocusRestorationStack[FocusRestorationStack.length - 1] !== entry || event.key !== 'Tab') return;
    const nodes = focusable(element);
    if (!nodes.length) { event.preventDefault(); element.focus(); return; }
    if (event.shiftKey && (document.activeElement === nodes[0] || !element.contains(document.activeElement))) {
      event.preventDefault(); nodes[nodes.length - 1].focus();
    } else if (!event.shiftKey && (document.activeElement === nodes[nodes.length - 1] || !element.contains(document.activeElement))) {
      event.preventDefault(); nodes[0].focus();
    }
  };
  const focusin = (event: FocusEvent) => {
    if (FocusRestorationStack[FocusRestorationStack.length - 1] === entry && !element.contains(event.target as Node)) {
      (focusable(element)[0] ?? element).focus();
    }
  };
  document.addEventListener('keydown', keydown, true);
  document.addEventListener('focusin', focusin);
  return () => {
    document.removeEventListener('keydown', keydown, true);
    document.removeEventListener('focusin', focusin);
    const wasTop = FocusRestorationStack[FocusRestorationStack.length - 1] === entry;
    const index = FocusRestorationStack.indexOf(entry);
    if (index >= 0) FocusRestorationStack.splice(index, 1);
    syncInert();
    if (wasTop && restore?.isConnected && !restore.closest('[inert]')) restore.focus();
    else if (wasTop) FocusRestorationStack[FocusRestorationStack.length - 1]?.element.focus();
  };
}
