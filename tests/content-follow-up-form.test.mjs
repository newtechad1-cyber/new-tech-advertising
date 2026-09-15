import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';
import * as journey from '../src/lib/contentJourney.js';

const require = createRequire(import.meta.url);
const code = ts.transpileModule(readFileSync('src/pages/Contact.jsx', 'utf8'), {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function harness(invoke, draftQuestion = '') {
  const slots = [];
  let cursor = 0;
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
  };
  const search = '?from=%2Fcanon%2Fworking-with-ai&topic=Working+with+AI';
  const context = {
    exports: {},
    URLSearchParams, Date,
    window: { location: { pathname: '/contact', search, href: 'https://newtechadvertising.com/contact' + search } },
    document: { referrer: '' },
    console: { error() {} },
    require(name) {
      if (name === 'react') return react;
      if (name === 'react/jsx-runtime') return require(name);
      if (name === 'react-router-dom') return { Link: 'a', useLocation: () => ({ search, pathname: '/contact', state: { nta_follow_up_question: draftQuestion } }) };
      if (name === '@/lib/contentJourney') return journey;
      if (name === '@/lib/publicVerification') return { invokeVerifiedPublicFunction: invoke };
      return new Proxy({}, { get: (_, key) => String(key) });
    },
  };
  vm.runInNewContext(code, context);
  const render = () => { cursor = 0; return context.exports.default(); };
  return { render };
}

function nodes(node) {
  if (!node || typeof node !== 'object') return [];
  if (Array.isArray(node)) return node.flatMap(nodes);
  return [node, ...nodes(node.props?.children)];
}
const find = (tree, predicate) => nodes(tree).find(predicate);
const text = node => {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(text).join(' ');
  return node?.props ? text(node.props.children) : '';
};
const submit = tree => find(tree, node => node.type === 'form').props.onSubmit({ preventDefault() {} });

test('visitor can choose a text reply without being forced to supply email', () => {
  const h = harness(() => { throw new Error('No submission expected'); });
  let tree = h.render();
  find(tree, node => node.props?.name === 'preferred_contact' && node.props.value === 'text').props.onChange();
  tree = h.render();
  assert.equal(find(tree, node => node.props?.id === 'contact-phone').props.required, true);
  assert.equal(find(tree, node => node.props?.id === 'contact-email').props.required, false);
  assert.match(text(tree), /Working with AI/);
});

test('one confirmed submission carries the article and reply preference into Core', async () => {
  let finish;
  const calls = [];
  const h = harness((name, payload) => {
    calls.push({ name, payload });
    return new Promise(resolve => { finish = resolve; });
  });
  let tree = h.render();
  find(tree, node => node.props?.name === 'preferred_contact' && node.props.value === 'text').props.onChange();
  tree = h.render();
  find(tree, node => node.props?.id === 'contact-message').props.onChange({ target: { value: 'Help us improve our follow-up.' } });
  tree = h.render();
  const pending = submit(tree);
  await submit(tree);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].name, 'ntaUnifiedIntake');
  assert.equal(calls[0].payload.raw_payload.preferred_contact, 'text');
  assert.equal(calls[0].payload.raw_payload.content_context.path, '/canon/working-with-ai');
  assert.match(calls[0].payload.notes, /Help us improve our follow-up/);
  finish({ data: { success: true, submission_id: 'mock-submission' } });
  await pending;
  tree = h.render();
  assert.match(text(tree), /Your request is saved/);
  assert.ok(find(tree, node => node.props?.to === '/canon/working-with-ai'));
});

test('an unconfirmed response or failed request preserves the message and displays a useful error', async () => {
  for (const invoke of [
    async () => ({ data: { success: true, accepted: false } }),
    async () => { throw new Error('Connection unavailable. Please call Rick.'); },
  ]) {
    const h = harness(invoke);
    let tree = h.render();
    find(tree, node => node.props?.id === 'contact-message').props.onChange({ target: { value: 'Keep my question.' } });
    await submit(h.render());
    tree = h.render();
    assert.ok(find(tree, node => node.props?.role === 'alert'));
    assert.equal(find(tree, node => node.props?.id === 'contact-message').props.value, 'Keep my question.');
    assert.doesNotMatch(text(tree), /Your request is saved/);
  }
});

test('a question from the Guide is an editable draft, never an automatic submission', () => {
  let submissions = 0;
  const h = harness(() => { submissions++; }, 'How would this work for my office?');
  let tree = h.render();
  assert.equal(submissions, 0);
  assert.equal(find(tree, node => node.props?.id === 'contact-message').props.value, 'How would this work for my office?');
  find(tree, node => node.props?.id === 'contact-message').props.onChange({ target: { value: 'Here is my revised question.' } });
  tree = h.render();
  assert.equal(find(tree, node => node.props?.id === 'contact-message').props.value, 'Here is my revised question.');
  assert.equal(submissions, 0);
});
