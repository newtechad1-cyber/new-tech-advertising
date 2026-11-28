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

function harness(invoke, draftQuestion = '', options = {}) {
  const events = [];
  const effects = [];
  const slots = [];
  let cursor = 0;
  const state = initial => {
    const index = cursor++;
    if (!(index in slots)) slots[index] = typeof initial === 'function' ? initial() : initial;
    return [slots[index], next => { slots[index] = typeof next === 'function' ? next(slots[index]) : next; }];
  };
  const react = {
    useState: state,
    useEffect(effect) { effects.push(effect); },
    useRef(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = { current: initial };
      return slots[index];
    },
  };
  const search = options.search || '?from=%2Fcanon%2Fworking-with-ai&topic=Working+with+AI';
  const hash = options.hash || '';
  const context = {
    exports: {},
    URLSearchParams, Date,
    window: { location: { pathname: '/contact', search, href: 'https://newtechadvertising.com/contact' + search } },
    document: { referrer: '' },
    console: { error() {} },
    require(name) {
      if (name === 'react') return react;
      if (name === 'react/jsx-runtime') return require(name);
      if (name === 'react-router-dom') return { Link: 'a', useLocation: () => ({ search, hash, key: 'contact-1', pathname: '/contact', state: { nta_follow_up_question: draftQuestion } }) };
      if (name === '@/lib/contentJourney') return journey;
      if (name === '@/lib/journeyAnalytics') return { trackJourneyEvent(name, details) { events.push({ name, details }); } };
      if (name === '@/lib/publicVerification') return { invokeVerifiedPublicFunction: invoke };
      return new Proxy({}, { get: (_, key) => String(key) });
    },
  };
  vm.runInNewContext(code, context);
  const render = () => { cursor = 0; return context.exports.default(); };
  return { render, events, effects };
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


test('question follow-up targets the form heading and starts measurement only after a visitor changes the form', () => {
  const path = '/knowledge/questions/why-isnt-my-website-generating-leads';
  const link = new URL(journey.followUpPath({ path, title: 'Why isn’t my website generating leads?' }), 'https://newtechadvertising.com');
  const h = harness(() => { throw new Error('No submission expected'); }, '', { search: link.search, hash: link.hash });
  const tree = h.render();
  const heading = find(tree, node => node.props?.id === 'follow-up-request');
  assert.equal(link.hash, '#follow-up-request');
  assert.equal(heading.props.tabIndex, -1);
  const focused = [];
  heading.ref.current = { focus(options) { focused.push(['focus', options]); }, scrollIntoView(options) { focused.push(['scroll', options]); } };
  h.effects.forEach(effect => effect());
  assert.equal(focused.length, 2);
  assert.equal(h.events.length, 0, 'Loading/focusing the form is not a form start');
  const form = find(tree, node => node.type === 'form');
  form.props.onChangeCapture();
  form.props.onChangeCapture();
  assert.deepEqual(JSON.parse(JSON.stringify(h.events)), [{ name: 'website_leads_follow_up_started', details: { route: path, source: 'contact_form' } }]);
});

test('other content paths retain the existing follow-up behavior without manufacturing the measured funnel', () => {
  const h = harness(() => { throw new Error('No submission expected'); });
  const tree = h.render();
  find(tree, node => node.type === 'form').props.onChangeCapture();
  assert.equal(h.events.length, 0);
});


test('the actual question CTA keeps its context, targets the form, and emits only the fixed opened stage', () => {
  const source = ts.transpileModule(readFileSync('src/components/knowledge/ContentNextSteps.jsx', 'utf8'), {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const events = [];
  const context = {
    exports: {},
    require(name) {
      if (name === 'react/jsx-runtime') return require(name);
      if (name === 'react-router-dom') return { Link: 'a' };
      if (name === '@/lib/contentJourney') return journey;
      if (name === '@/lib/journeyAnalytics') return { trackJourneyEvent(name, details) { events.push({ name, details }); } };
      return new Proxy({}, { get: (_, key) => String(key) });
    },
  };
  vm.runInNewContext(source, context);
  const path = '/knowledge/questions/why-isnt-my-website-generating-leads';
  const tree = context.exports.ContentNextSteps({ title: 'Why isn’t my website generating leads?', path });
  const link = find(tree, node => typeof node.props?.to === 'string' && node.props.to.startsWith('/contact?'));
  assert.ok(link.props.to.endsWith('#follow-up-request'));
  assert.equal(events.length, 0, 'Rendering the question does not manufacture an opened stage');
  link.props.onClick();
  assert.deepEqual(events.map(event => event.name), ['content_follow_up_opened', 'website_leads_follow_up_opened']);
  assert.equal(events[1].details.route, path);
  assert.doesNotMatch(JSON.stringify(events), /Why isn|topic=/);
});
