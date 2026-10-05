import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { FocusRestorationStack, useFocusTrap } from '../packages/react/src/hooks/useFocusTrap.js';

const checks: string[] = [];
const check = (name: string, passed: boolean) => checks.push(`${name}:${passed ? 'pass' : 'fail'}`);
const delay = () => new Promise(resolve => setTimeout(resolve, 40));

function Inner({ close }: { close: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, true);
  return <div ref={ref} tabIndex={-1}>
    <button id="inner-first">Inner first</button>
    <button id="inner-last">Inner last</button>
    <button id="close-inner" onClick={close}>Close inner</button>
  </div>;
}

function App() {
  const [outerOpen, setOuterOpen] = useState(true);
  const [innerOpen, setInnerOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, outerOpen);
  if (!outerOpen) return null;
  return <div ref={ref} tabIndex={-1}>
    <button id="outer-first">Outer first</button>
    <button id="open-inner" onClick={() => setInnerOpen(true)}>Open inner</button>
    {innerOpen && <Inner close={() => setInnerOpen(false)} />}
    <button id="close-outer" onClick={() => setOuterOpen(false)}>Close outer</button>
  </div>;
}

async function run() {
  const launcher = document.querySelector<HTMLButtonElement>('#launcher')!;
  const background = document.querySelector<HTMLElement>('#background')!;
  launcher.focus();
  createRoot(document.querySelector('#root')!).render(<App />);
  await delay();
  check('initial-focus', (document.activeElement as HTMLElement).id === 'outer-first');
  check('background-inert', background.inert);
  check('stack-one', FocusRestorationStack.length === 1);

  document.querySelector<HTMLButtonElement>('#open-inner')!.focus();
  document.querySelector<HTMLButtonElement>('#open-inner')!.click();
  await delay();
  check('nested-focus', (document.activeElement as HTMLElement).id === 'inner-first');
  check('outer-sibling-inert', document.querySelector<HTMLElement>('#outer-first')!.inert);
  check('stack-two', FocusRestorationStack.length === 2);

  document.querySelector<HTMLButtonElement>('#close-inner')!.focus();
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
  check('tab-wrap', (document.activeElement as HTMLElement).id === 'inner-first');
  document.querySelector<HTMLButtonElement>('#close-inner')!.click();
  await delay();
  check('nested-restore', (document.activeElement as HTMLElement).id === 'open-inner');
  check('stack-one-again', FocusRestorationStack.length === 1);

  document.querySelector<HTMLButtonElement>('#close-outer')!.click();
  await delay();
  check('outer-restore', document.activeElement === launcher);
  check('background-restored', !background.inert);
  check('stack-empty', FocusRestorationStack.length === 0);
  document.querySelector('#result')!.textContent = `PHASE3_RESULT ${checks.join(' ')}`;
}

run().catch(error => {
  document.querySelector('#result')!.textContent = `PHASE3_RESULT script:fail ${String(error)}`;
});
