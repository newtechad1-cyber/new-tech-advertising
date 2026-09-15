import { base44 } from '@/api/base44Client';

const ACTIONS = {
  growthGuideChat: 'growth_guide_chat',
  publicationSignup: 'publication_signup',
  ntaUnifiedIntake: 'nta_unified_intake',
};
let scriptPromise;
let verificationQueue = Promise.resolve();
const configCache = new Map();

function loadVerificationScript() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      const timeout = window.setTimeout(() => {
        script.remove();
        reject(new Error('Verification could not load. Please try again.'));
      }, 15_000);
      script.onload = () => {
        window.clearTimeout(timeout);
        if (window.turnstile) resolve(window.turnstile);
        else reject(new Error('Verification could not load. Please try again.'));
      };
      script.onerror = () => {
        window.clearTimeout(timeout);
        script.remove();
        reject(new Error('Verification could not load. Please try again.'));
      };
      document.head.appendChild(script);
    }).catch(error => { scriptPromise = null; throw error; });
  }
  return scriptPromise;
}

async function getVerificationConfig(name) {
  const cached = configCache.get(name);
  if (cached && Date.now() < cached.expiresAt) return cached;
  const response = await base44.functions.invoke(name, { verification_config: true });
  const { site_key: siteKey, action } = response.data || {};
  if (typeof siteKey !== 'string' || siteKey.length < 20 || action !== ACTIONS[name]) {
    throw new Error('Verification is temporarily unavailable. Please call or text 641-420-8816.');
  }
  const value = { siteKey, action, expiresAt: Date.now() + 300_000 };
  configCache.set(name, value);
  return value;
}

async function requestVisitorToken(config) {
  const turnstile = await loadVerificationScript();
  return new Promise((resolve, reject) => {
    const dialog = document.createElement('dialog');
    const previousFocus = document.activeElement;
    dialog.setAttribute('aria-label', 'Verify your request');
    Object.assign(dialog.style, {
      padding: '24px', border: '1px solid #cbd5e1', borderRadius: '16px',
      maxWidth: 'calc(100vw - 32px)', width: '350px', color: '#0f172a',
      background: '#fff', boxShadow: '0 20px 60px #0004', zIndex: '2147483647',
    });
    const message = document.createElement('p');
    message.textContent = 'Checking your request…';
    message.setAttribute('role', 'status');
    Object.assign(message.style, { margin: '0 0 16px', fontSize: '16px' });
    const holder = document.createElement('div');
    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.textContent = 'Cancel';
    Object.assign(cancel.style, {
      display: 'block', margin: '16px 0 0 auto', padding: '8px 16px',
      border: '1px solid #94a3b8', borderRadius: '8px', cursor: 'pointer',
    });
    dialog.append(message, holder, cancel);
    document.body.appendChild(dialog);
    let widgetId;
    let settled = false;
    const timeout = window.setTimeout(() => finish(new Error('Verification timed out. Please try again.')), 120_000);

    function finish(error, token) {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      if (widgetId !== undefined) {
        try { turnstile.remove(widgetId); } catch { /* already removed */ }
      }
      if (dialog.open) dialog.close();
      dialog.remove();
      if (previousFocus?.isConnected && typeof previousFocus.focus === 'function') previousFocus.focus();
      if (error) reject(error);
      else resolve(token);
    }

    cancel.addEventListener('click', () => finish(new Error('Verification cancelled. Your request was not submitted.')));
    dialog.addEventListener('cancel', event => {
      event.preventDefault();
      finish(new Error('Verification cancelled. Your request was not submitted.'));
    });

    try {
      dialog.showModal();
      widgetId = turnstile.render(holder, {
        sitekey: config.siteKey,
        action: config.action,
        theme: 'light',
        execution: 'execute',
        appearance: 'interaction-only',
        callback: token => finish(null, token),
        'error-callback': () => finish(new Error('Verification failed. Please try again.')),
        'expired-callback': () => finish(new Error('Verification expired. Please try again.')),
        'timeout-callback': () => finish(new Error('Verification timed out. Please try again.')),
      });
      turnstile.execute(widgetId);
    } catch {
      finish(new Error('Verification could not start. Please try again.'));
    }
  });
}

// Get a fresh, single-use provider token for every submission. Never store it
// in localStorage or retry a mutation automatically after an uncertain result.
export async function invokeVerifiedPublicFunction(name, payload) {
  if (!ACTIONS[name]) throw new Error('Unsupported public function');
  const config = await getVerificationConfig(name);
  const pending = verificationQueue.then(() => requestVisitorToken(config));
  verificationQueue = pending.catch(() => {});
  const token = await pending;
  return base44.functions.invoke(name, { ...payload, verification_token: token });
}
