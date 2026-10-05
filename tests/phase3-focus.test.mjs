import assert from 'node:assert/strict';
import test from 'node:test';

let activeDocument;

class Element {
  constructor(name, focusable = false) {
    this.name = name;
    this.focusable = focusable;
    this.children = [];
    this.parentElement = null;
    this.inert = false;
  }

  append(child) {
    child.parentElement = this;
    this.children.push(child);
  }

  remove() {
    if (!this.parentElement) return;
    this.parentElement.children = this.parentElement.children.filter(child => child !== this);
    this.parentElement = null;
  }

  get isConnected() {
    return this === activeDocument.body || Boolean(this.parentElement?.isConnected);
  }

  contains(target) {
    for (let node = target; node; node = node.parentElement) {
      if (node === this) return true;
    }
    return false;
  }

  closest(selector) {
    assert.equal(selector, '[inert]');
    for (let node = this; node; node = node.parentElement) {
      if (node.inert) return node;
    }
    return null;
  }

  querySelectorAll() {
    const matches = [];
    const visit = node => {
      for (const child of node.children) {
        if (child.focusable) matches.push(child);
        visit(child);
      }
    };
    visit(this);
    return matches;
  }

  getClientRects() {
    return [{}];
  }

  focus() {
    if (!this.isConnected || this.closest('[inert]')) return;
    if (activeDocument.activeElement === this) return;
    activeDocument.activeElement = this;
    activeDocument.dispatchEvent({ type: 'focusin', target: this });
  }
}

class Document {
  constructor() {
    this.body = new Element('body');
    this.activeElement = this.body;
    this.listeners = new Map();
  }

  addEventListener(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(listener);
  }

  removeEventListener(type, listener) {
    this.listeners.get(type)?.delete(listener);
  }

  dispatchEvent(event) {
    for (const listener of this.listeners.get(event.type) ?? []) listener(event);
  }
}

function pressTab(shiftKey = false) {
  const event = {
    type: 'keydown', key: 'Tab', shiftKey, defaultPrevented: false,
    preventDefault() { this.defaultPrevented = true; },
  };
  activeDocument.dispatchEvent(event);
  return event;
}

async function verifyFocusStack(name, modulePath, activateName) {
  test(name, { concurrency: false }, async () => {
    activeDocument = new Document();
    globalThis.HTMLElement = Element;
    globalThis.document = activeDocument;
    const { [activateName]: activate, FocusRestorationStack: stack } = await import(modulePath);
    assert.equal(stack.length, 0);

    const launcher = new Element('launcher', true);
    const background = new Element('background', true);
    const preInert = new Element('pre-inert', true);
    const backdrop = new Element('backdrop');
    preInert.inert = true;
    for (const element of [launcher, background, preInert, backdrop]) activeDocument.body.append(element);
    launcher.focus();

    const outer = new Element('outer');
    const outerFirst = new Element('outer-first', true);
    const openInner = new Element('open-inner', true);
    outer.append(outerFirst);
    outer.append(openInner);
    activeDocument.body.append(outer);
    const releaseOuter = activate(outer, [backdrop]);
    assert.equal(activeDocument.activeElement, outerFirst);
    assert.equal(background.inert, true);
    assert.equal(backdrop.inert, false);
    assert.equal(stack.length, 1);

    openInner.focus();
    const inner = new Element('inner');
    const innerFirst = new Element('inner-first', true);
    const innerLast = new Element('inner-last', true);
    inner.append(innerFirst);
    inner.append(innerLast);
    outer.append(inner);
    const releaseInner = activate(inner);
    assert.equal(activeDocument.activeElement, innerFirst);
    assert.equal(outerFirst.inert, true);
    assert.equal(stack.length, 2);

    innerLast.focus();
    assert.equal(pressTab().defaultPrevented, true);
    assert.equal(activeDocument.activeElement, innerFirst);
    assert.equal(pressTab(true).defaultPrevented, true);
    assert.equal(activeDocument.activeElement, innerLast);

    releaseInner();
    inner.remove();
    assert.equal(activeDocument.activeElement, openInner);
    assert.equal(outerFirst.inert, false);
    assert.equal(stack.length, 1);

    releaseOuter();
    outer.remove();
    assert.equal(activeDocument.activeElement, launcher);
    assert.equal(background.inert, false);
    assert.equal(preInert.inert, true);
    assert.equal(stack.length, 0);
    assert.equal(activeDocument.listeners.get('keydown')?.size, 0);
    assert.equal(activeDocument.listeners.get('focusin')?.size, 0);
  });
}

await verifyFocusStack('Angular focus stack', '../packages/angular/src/utils/focus-trap.ts', 'useFocusTrap');
await verifyFocusStack('React focus stack', '../packages/react/src/hooks/useFocusTrap.ts', 'activateFocusTrap');
