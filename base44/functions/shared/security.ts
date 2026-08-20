const TRUSTED_APP_ORIGINS = new Set([
  'https://newtechadvertising.com',
  'https://www.newtechadvertising.com',
  'https://app.newtechadvertising.com',
]);

const TRUSTED_STRIPE_HOSTS = new Set([
  'checkout.stripe.com',
  'buy.stripe.com',
]);

const PRIVATE_HOST_SUFFIXES = [
  '.localhost',
  '.local',
  '.internal',
  '.lan',
  '.home',
];

function stripIpv6Brackets(hostname) {
  return String(hostname || '').replace(/^\[|\]$/g, '').toLowerCase();
}

function isPrivateIpv4(hostname) {
  const parts = hostname.split('.').map(Number);
  if (parts.length !== 4 || parts.some(part => !Number.isInteger(part) || part < 0 || part > 255)) {
    return false;
  }

  const [a, b] = parts;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 0) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) ||
    (a === 198 && b === 51) ||
    (a === 203 && b === 0) ||
    a >= 224
  );
}

function isPrivateIpv6(hostname) {
  const value = hostname.replace(/^::ffff:/i, '');
  if (value.includes('.') && isPrivateIpv4(value)) return true;

  return (
    value === '::' ||
    value === '::1' ||
    value.startsWith('fc') ||
    value.startsWith('fd') ||
    value.startsWith('fe8') ||
    value.startsWith('fe9') ||
    value.startsWith('fea') ||
    value.startsWith('feb')
  );
}

export function isPrivateOrLocalHostname(input) {
  const hostname = stripIpv6Brackets(input);
  if (!hostname) return true;
  if (hostname === 'localhost' || hostname === 'metadata.google.internal' || hostname === 'instance-data') return true;
  if (PRIVATE_HOST_SUFFIXES.some(suffix => hostname.endsWith(suffix))) return true;
  if (isPrivateIpv4(hostname) || (hostname.includes(':') && isPrivateIpv6(hostname))) return true;
  return false;
}

export function validatePublicHttpUrl(input, { allowPath = true } = {}) {
  const raw = String(input || '').trim();
  if (!raw || raw.length > 2048) {
    throw new Error('A valid public website URL is required.');
  }

  const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`;
  let url;
  try {
    url = new URL(candidate);
  } catch {
    throw new Error('Invalid website URL.');
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('Only HTTP and HTTPS website URLs are allowed.');
  }
  if (url.username || url.password) {
    throw new Error('Website URLs may not contain credentials.');
  }
  if (url.port && !['80', '443'].includes(url.port)) {
    throw new Error('Website URLs may only use ports 80 or 443.');
  }
  if (isPrivateOrLocalHostname(url.hostname)) {
    throw new Error('Private and local network addresses are not allowed.');
  }
  if (!allowPath) {
    url.pathname = '/';
    url.search = '';
    url.hash = '';
  }
  return url;
}

export async function assertPublicDns(hostname) {
  const normalized = stripIpv6Brackets(hostname);
  if (isPrivateOrLocalHostname(normalized)) {
    throw new Error('Private and local network addresses are not allowed.');
  }

  // Direct IPs were checked above. Resolve hostnames before fetching so a
  // public-looking hostname cannot point at a private or metadata address.
  if (/^[0-9a-f:.]+$/i.test(normalized)) return;
  if (typeof Deno?.resolveDns !== 'function') return;

  let addresses = [];
  for (const recordType of ['A', 'AAAA']) {
    try {
      const result = await Deno.resolveDns(normalized, recordType);
      addresses = addresses.concat(result || []);
    } catch {
      // A hostname may have only A or only AAAA records.
    }
  }

  if (!addresses.length) {
    throw new Error('The website hostname could not be resolved.');
  }
  if (addresses.some(address => isPrivateOrLocalHostname(address))) {
    throw new Error('The website resolves to a private or local network address.');
  }
}

export async function fetchPublicUrl(input, init = {}, maxRedirects = 3) {
  let current = validatePublicHttpUrl(input);

  for (let redirectCount = 0; redirectCount <= maxRedirects; redirectCount += 1) {
    await assertPublicDns(current.hostname);

    const response = await fetch(current, {
      ...init,
      redirect: 'manual',
    });

    if (![301, 302, 303, 307, 308].includes(response.status)) {
      return { response, url: current };
    }

    const location = response.headers.get('location');
    if (!location || redirectCount === maxRedirects) {
      throw new Error('The website redirected too many times or returned an invalid redirect.');
    }
    current = validatePublicHttpUrl(new URL(location, current).toString());
  }

  throw new Error('The website redirected too many times.');
}

export function isAdminUser(user) {
  const adminEmails = String(Deno.env.get('ADMIN_EMAILS') || '')
    .split(',')
    .map(value => value.trim().toLowerCase())
    .filter(Boolean);

  return Boolean(
    user &&
    (user.role === 'admin' || adminEmails.includes(String(user.email || '').toLowerCase()))
  );
}

export function trustedQuoteLink(leadId, candidate) {
  const safeLeadId = String(leadId || '').trim();
  const fallback = `https://newtechadvertising.com/ada-quote?lead_id=${encodeURIComponent(safeLeadId)}`;
  const raw = String(candidate || '').trim();
  if (!raw) return fallback;

  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' || url.username || url.password) return fallback;

    const hostname = url.hostname.toLowerCase();
    if (TRUSTED_STRIPE_HOSTS.has(hostname)) {
      return url.toString();
    }

    if (!TRUSTED_APP_ORIGINS.has(url.origin)) return fallback;
    if (!['/ada-quote', '/ada/quote'].includes(url.pathname)) return fallback;
    if (url.searchParams.get('lead_id') !== safeLeadId) return fallback;

    return url.toString();
  } catch {
    return fallback;
  }
}
