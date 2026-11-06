import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const Dialog = require('@radix-ui/react-dialog');
let nextInstance = 0;

// Exercise the actual component handlers and dialog configuration without a
// browser, network, recording or paid provider. Radix owns Tab/Escape handling;
// real keyboard/focus checks must also be recorded from the rendered preview.
function harness(path, { width = 1024, invoke = async () => { throw new Error('Unexpected provider call'); } } = {}) {
  const slots = [];
  const pendingEffects = [];
  const listeners = new Map();
  const timers = new Map();
  const storage = new Map();
  const instance = ++nextInstance;
  let cursor = 0;
  let timerId = 0;
  const focusHistory = [];
  const dragStarts = [];
  const focusable = label => ({
    isConnected: true,
    focus() { focusHistory.push(label); document.activeElement = this; },
  });
  const document = {
    body: {}, activeElement: null,
    addEventListener(name, callback) { listeners.set(name, callback); },
    removeEventListener(name, callback) { if (listeners.get(name) === callback) listeners.delete(name); },
  };
  document.activeElement = focusable('previous');
  const state = initial => {
    const index = cursor++;
    if (!(index in slots)) slots[index] = typeof initial === 'function' ? initial() : initial;
    return [slots[index], next => { slots[index] = typeof next === 'function' ? next(slots[index]) : next; }];
  };
  const react = {
    useState: state,
    useRef(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = { current: initial };
      return slots[index];
    },
    useId() { return ':test-' + instance + '-' + cursor++ + ':'; },
    useEffect(effect, deps) {
      const index = cursor++;
      const previous = slots[index];
      if (!previous || deps.some((dep, i) => !Object.is(dep, previous.deps[i]))) {
        slots[index] = { deps };
        pendingEffects.push(() => {
          previous?.cleanup?.();
          slots[index].cleanup = effect();
        });
      }
    },
  };
  const store = {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: key => storage.delete(key),
  };
  const setTimer = callback => { timers.set(++timerId, callback); return timerId; };
  const clearTimer = id => timers.delete(id);
  const window = {
    innerWidth: width,
    location: { pathname: '/contact', href: 'https://example.test/contact' },
    sessionStorage: store,
    setTimeout: setTimer,
    addEventListener: document.addEventListener,
    removeEventListener: document.removeEventListener,
  };
  const context = {
    exports: {}, document, window, localStorage: store, sessionStorage: store,
    setTimeout: setTimer, clearTimeout: clearTimer, clearInterval: clearTimer,
    cancelAnimationFrame() {}, Date, URL, console, crypto: { randomUUID: () => 'test-id' },
    require(name) {
      if (name === 'react') return react;
      if (name === 'react/jsx-runtime') return require(name);
      if (name === '@radix-ui/react-dialog') return Dialog;
      if (name === 'framer-motion') return {
        motion: new Proxy({}, { get: (_, key) => String(key) }),
        AnimatePresence: 'AnimatePresence', useDragControls: () => ({ start: event => dragStarts.push(event) }),
      };
      if (name === 'react-router-dom') return { useLocation: () => ({ pathname: '/contact' }), useNavigate: () => () => {} };
      if (name === '@/lib/publicVerification') return { invokeVerifiedPublicFunction: invoke };
      if (name === '@/lib/contentJourney') return { contentContext: () => null };
      if (name === '@/lib/utils') return { cn: (...parts) => parts.filter(part => typeof part === 'string').join(' ') };
      if (name === '@/components/ui/input') return { Input: 'input' };
      if (name === '@/components/ui/button') return { Button: 'button' };
      return new Proxy({ __esModule: true, default: () => null }, { get: (target, key) => target[key] ?? (() => null) });
    },
  };
  const compiled = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  vm.runInNewContext(compiled.outputText, context);
  return {
    render(props = {}) {
      cursor = 0;
      const tree = context.exports.default(props);
      while (pendingEffects.length) pendingEffects.shift()();
      return tree;
    },
    document, listeners, timers, storage, focusHistory, focusable, dragStarts,
  };
}
function nodes(node) {
  if (!node || typeof node !== 'object') return [];
  if (Array.isArray(node)) return node.flatMap(nodes);
  return [node, ...nodes(node.props?.children)];
}
const find = (tree, predicate) => nodes(tree).find(predicate);
const text = node => typeof node === 'string' ? node
  : Array.isArray(node) ? node.map(text).join(' ')
  : node?.props ? text(node.props.children) : '';
const preventedEvent = () => ({ defaultPrevented: false, preventDefault() { this.defaultPrevented = true; } });
const guidePath = 'src/components/nta-guide/YourDigitalGrowthGuide.jsx';
const newsletterPath = 'src/components/newsletter/NewsletterPopup.jsx';
function openGuide(h) {
  const tree = h.render();
  const launcher = find(tree, n => n.props?.['aria-label'] === 'Open Your Digital Growth Guide');
  assert.ok(launcher);
  launcher.props.onClick({});
  return h.render();
}
function openNewsletter(h) {
  assert.equal(h.render(), null);
  h.listeners.get('mouseleave')({ clientY: 0 });
  return h.render();
}

test('Guide has one container, a named nonmodal dialog and named message controls', () => {
  const h = harness(guidePath);
  const closed = h.render();
  assert.equal(nodes(closed).filter(n => n.props?.id === 'nta-guide-container').length, 1);
  const tree = openGuide(h);
  const root = find(tree, n => n.type === Dialog.Root);
  assert.ok(root, 'Guide must use the installed accessible dialog');
  assert.equal(root.props.modal, false);
  assert.ok(find(tree, n => n.type === Dialog.Title && /Your Digital Growth Guide/.test(text(n))));
  assert.equal(find(tree, n => n.type === Dialog.Content).props.id, 'nta-growth-guide-dialog');
  assert.ok(find(tree, n => n.type === 'input' && n.props['aria-label']));
  assert.ok(find(tree, n => n.type === 'button' && n.props['aria-label'] === 'Send your message'));
});

test('Guide videos stay outside keyboard navigation while playback buttons remain reachable', () => {
  const h = harness(guidePath);
  const closed = h.render();
  const tree = openGuide(h);
  for (const node of [...nodes(closed), ...nodes(tree)].filter(n => n.type === 'video')) {
    assert.equal(node.props.tabIndex, -1);
  }
  const avatar = harness('src/components/nta-guide/RickGrowthGuideAvatar.jsx').render({ decorative: true });
  assert.equal(find(avatar, n => n.type === 'video').props.tabIndex, -1);
  assert.ok(find(tree, n => n.type === 'button' && /Hear Rick/.test(text(n))));
});

test('Guide opening focuses Close and closing returns focus to the original opener', () => {
  const h = harness(guidePath);
  const tree = openGuide(h);
  const content = find(tree, n => n.type === Dialog.Content);
  assert.ok(content);
  find(tree, n => n.props?.['aria-label'] === 'Close Your Digital Growth Guide').ref.current = h.focusable('close');
  const openEvent = preventedEvent();
  content.props.onOpenAutoFocus(openEvent);
  assert.equal(openEvent.defaultPrevented, true);
  find(tree, n => n.type === Dialog.Root).props.onOpenChange(false);
  assert.equal(find(h.render(), n => n.type === Dialog.Content), undefined);
  content.props.onCloseAutoFocus(preventedEvent());
  assert.deepEqual(h.focusHistory, ['close', 'previous']);
});

test('Guide minimizes to its launcher when the original opener has unmounted, retaining the draft', () => {
  const h = harness(guidePath);
  let tree = openGuide(h);
  const content = find(tree, n => n.type === Dialog.Content);
  assert.ok(content);
  find(tree, n => n.type === 'input' && n.props['aria-label']).props.onChange({ target: { value: 'Keep this question' } });
  tree = h.render();
  find(tree, n => n.props?.['aria-label'] === 'Minimize Your Digital Growth Guide').props.onClick();
  tree = h.render();
  const launcher = find(tree, n => n.props?.['aria-label'] === 'Open Your Digital Growth Guide');
  launcher.ref.current = h.focusable('launcher');
  h.document.activeElement.isConnected = false;
  content.props.onCloseAutoFocus(preventedEvent());
  assert.deepEqual(h.focusHistory, ['launcher']);
  launcher.props.onClick({});
  assert.equal(find(h.render(), n => n.type === 'input' && n.props['aria-label']).props.value, 'Keep this question');
});

test('Guide header controls do not start a pointer drag', () => {
  const h = harness(guidePath);
  const tree = openGuide(h);
  const header = find(tree, n => n.props?.className?.includes('cursor-move'));
  header.props.onPointerDown({ target: { closest: () => ({ tagName: 'BUTTON' }) } });
  assert.equal(h.dragStarts.length, 0);
  header.props.onPointerDown({ target: { closest: () => null } });
  assert.equal(h.dragStarts.length, 1);
});

test('Newsletter uses a named modal with visible, associated labels and a hidden honeypot', () => {
  const h = harness(newsletterPath);
  const tree = openNewsletter(h);
  assert.ok(find(tree, n => n.type === Dialog.Root));
  assert.ok(find(tree, n => n.type === Dialog.Title));
  assert.ok(find(tree, n => n.type === Dialog.Description));
  assert.equal(find(tree, n => n.type === Dialog.Content).props['aria-modal'], 'true');
  for (const type of ['text', 'email']) {
    const input = find(tree, n => n.type === 'input' && n.props.type === type && n.props.tabIndex !== -1);
    assert.ok(input.props.id, 'input needs a stable label target');
    assert.match(input.props.className, /bg-white/, 'popup fields need an explicit light background');
    const label = find(tree, n => n.type === 'label' && n.props.htmlFor === input.props.id);
    assert.ok(label && text(label).trim());
  }
  const honeypot = find(tree, n => n.props?.name === 'company_url');
  assert.equal(honeypot.props.tabIndex, -1);
  const other = openNewsletter(harness(newsletterPath));
  assert.notEqual(find(tree, n => n.props?.name === 'company_url').props.id, find(other, n => n.props?.name === 'company_url').props.id);
});

test('Newsletter dialog dismissal records the existing cooldown and restores prior focus', () => {
  const h = harness(newsletterPath);
  const tree = openNewsletter(h);
  const root = find(tree, n => n.type === Dialog.Root);
  assert.ok(root);
  root.props.onOpenChange(false);
  assert.ok(h.storage.get('nta_newsletter_dismissed'));
  assert.equal(h.render(), null);
  find(tree, n => n.type === Dialog.Content).props.onCloseAutoFocus(preventedEvent());
  assert.deepEqual(h.focusHistory, ['previous']);
  const mobile = harness(newsletterPath, { width: 390 });
  assert.equal(mobile.render(), null);
  for (const callback of mobile.timers.values()) callback();
  assert.ok(find(mobile.render(), n => n.type === Dialog.Root), 'phone timer still opens the signup');
});

test('Newsletter errors and successful signup are announced; consent payload stays intact', async () => {
  const calls = [];
  const h = harness(newsletterPath, { invoke: async (...args) => { calls.push(args); return { data: { success: true } }; } });
  let tree = openNewsletter(h);
  await find(tree, n => n.type === 'form').props.onSubmit({ preventDefault() {} });
  tree = h.render();
  assert.ok(find(tree, n => n.props?.role === 'alert'));
  assert.equal(calls.length, 0);
  find(tree, n => n.type === 'input' && n.props.type === 'email').props.onChange({ target: { value: 'test@example.test' } });
  find(tree, n => n.type === 'input' && n.props.type === 'checkbox').props.onChange({ target: { checked: true } });
  tree = h.render();
  await find(tree, n => n.type === 'form').props.onSubmit({ preventDefault() {} });
  tree = h.render();
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], 'publicationSignup');
  assert.equal(calls[0][1].consent, true);
  assert.equal(calls[0][1].source, 'website_newsletter_popup');
  assert.equal(calls[0][1].create_delivery_request, false);
  assert.ok(find(tree, n => n.props?.role === 'status'));
});
