const PUBLIC_ORIGIN = 'https://newtechadvertising.com';
const PUBLIC_ORIGINS = new Set([PUBLIC_ORIGIN, 'https://www.newtechadvertising.com']);
const clean = (value, limit) => typeof value === 'string' ? value.trim().slice(0, limit) : '';

export function contentPath(value) {
  const text = clean(value, 1500);
  if (!text || text.startsWith('//')) return '';
  try {
    const url = new URL(text, PUBLIC_ORIGIN);
    if (!PUBLIC_ORIGINS.has(url.origin) || url.username || url.password) return '';
    if (!/^\/[a-z0-9][a-z0-9/_-]*$/i.test(url.pathname)) return '';
    return url.pathname.replace(/\/+$/, '');
  } catch { return ''; }
}

export function contentContext(value) {
  const path = contentPath(value?.path);
  const title = clean(value?.title || value?.question, 240);
  return path && title ? { path, title } : null;
}

export function followUpPath(value) {
  const context = contentContext(value);
  if (!context) return '/contact';
  return '/contact?' + new URLSearchParams({ from: context.path, topic: context.title }).toString();
}

export function contextFromSearch(search) {
  const params = new URLSearchParams(search || '');
  return contentContext({ path: params.get('from'), title: params.get('topic') });
}

export function guideQuestion(value) {
  const context = contentContext(value);
  return context ? 'How could I apply "' + context.title + '" in my business?' : '';
}

// Learning links stay on NTA or point to a specific YouTube video.
export function learningHref(value) {
  const path = contentPath(value);
  if (path) return path;
  try {
    const url = new URL(clean(value, 1500));
    if (url.protocol !== 'https:' || url.username || url.password) return '';
    if (url.hostname === 'youtu.be' && /^\/[A-Za-z0-9_-]{11}$/.test(url.pathname)) return url.href;
    if (['www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com'].includes(url.hostname)) {
      if (url.pathname === '/watch' && /^[A-Za-z0-9_-]{11}$/.test(url.searchParams.get('v') || '')) return url.href;
      if (/^\/(?:embed|shorts)\/[A-Za-z0-9_-]{11}$/.test(url.pathname)) return url.href;
    }
  } catch { /* Unusable links are omitted. */ }
  return '';
}

export function learningLinks(resources, currentPath) {
  const seen = new Set([contentPath(currentPath)]);
  return (Array.isArray(resources) ? resources : []).flatMap(resource => {
    const href = learningHref(resource?.href || resource?.path);
    const title = clean(resource?.title, 240);
    if (!href || !title || seen.has(href)) return [];
    seen.add(href);
    return [{ href, title, kind: resource.kind === 'video' ? 'video' : 'article' }];
  }).slice(0, 3);
}

export function relatedEpisodeLinks(value, episodes) {
  const context = contentContext(value);
  if (!context) return [];
  return (episodes || []).filter(episode => {
    if (episode.status !== 'Published' || !/^[a-z0-9-]+$/i.test(episode.slug || '')) return false;
    const articles = [episode.article, ...(episode.lessons || [])].filter(Boolean);
    const paths = articles.map(article => contentPath(article.canonical_url || '/canon/' + article.slug));
    paths.push(...(episode.journals || []).map(issue => contentPath('/journal/' + (issue.slug || 'issue-' + issue.issue_number))));
    return paths.includes(context.path);
  }).slice(0, 2).map(episode => ({
    path: '/growth-show/' + episode.slug,
    title: episode.title,
    kind: 'video',
  }));
}

export function followUpDetails({ message, context: value, preference = 'email' }) {
  const context = contentContext(value);
  const channel = ['email', 'call', 'text'].includes(preference) ? preference : 'email';
  const notes = [
    'Requested personal follow-up. Preferred reply: ' + channel + '.',
    context ? 'About: ' + context.title + '\nReading or watching: ' + PUBLIC_ORIGIN + context.path : '',
    clean(message, 2500),
  ].filter(Boolean).join('\n\n');
  return {
    notes,
    metadata: {
      requested_follow_up: true,
      preferred_contact: channel,
      ...(context ? { content_context: context } : {}),
      consent_scope: 'Reply to this request; newsletter subscription is separate.',
    },
  };
}
