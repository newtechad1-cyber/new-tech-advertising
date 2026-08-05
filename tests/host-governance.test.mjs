import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalHostForRoute, wrongHostRedirect } from '../src/config/hostGovernance.js';

test('public publishing routes stay on the public hostname', () => {
  assert.equal(canonicalHostForRoute('/growth-show/example'), 'newtechadvertising.com');
  assert.equal(canonicalHostForRoute('/knowledge'), 'newtechadvertising.com');
});

test('agency, client, and login routes use the application hostname', () => {
  assert.equal(canonicalHostForRoute('/agency'), 'app.newtechadvertising.com');
  assert.equal(canonicalHostForRoute('/portal'), 'app.newtechadvertising.com');
  assert.equal(canonicalHostForRoute('/Login'), 'app.newtechadvertising.com');
});

test('wrong production hostname redirects but local preview does not', () => {
  assert.equal(
    wrongHostRedirect({ hostname: 'newtechadvertising.com', pathname: '/agency' }),
    'https://app.newtechadvertising.com/agency'
  );
  assert.equal(
    wrongHostRedirect({ hostname: 'app.newtechadvertising.com', pathname: '/growth-show', search: '?episode=1' }),
    'https://newtechadvertising.com/growth-show?episode=1'
  );
  assert.equal(wrongHostRedirect({ hostname: 'localhost', pathname: '/agency' }), null);
});
