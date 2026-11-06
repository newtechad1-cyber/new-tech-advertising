// Shared ownership for crawler HTML and the React page. Only our marked schema
// is adopted or removed; unrelated JSON-LD (including third-party data) is left alone.
export const SEO_SITE_ORIGIN = 'https://newtechadvertising.com';

export function canonicalPageUrl(value) {
  const url = new URL(value, SEO_SITE_ORIGIN);
  const path = url.pathname.replace(/\/+$/, '') || '/';
  return SEO_SITE_ORIGIN + path;
}

const suffixes = {
  Article: 'article', LearningResource: 'learning-resource',
  CollectionPage: 'collection', WebPage: 'webpage', Service: 'service',
  FAQPage: 'faq', BreadcrumbList: 'breadcrumbs', HowTo: 'howto', Book: 'book',
};

export function schemaIdentity(schema, canonical) {
  if (schema['@id']) return schema['@id'];
  const type = Array.isArray(schema['@type']) ? schema['@type'][0] : schema['@type'];
  if (type === 'VideoObject') {
    // Different videos on the same page must keep separate identities.
    const url = new URL(schema.embedUrl || schema.contentUrl || schema.url || canonical, canonical);
    const youtubeHosts = ['youtube.com', 'www.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com', 'youtu.be'];
    const videoId = youtubeHosts.includes(url.hostname) && (
      url.pathname.match(/^\/embed\/([^/]+)/)?.[1] ||
      (url.hostname === 'youtu.be' ? url.pathname.slice(1) : url.searchParams.get('v'))
    );
    return canonical + '#video:' + (videoId || url.origin + url.pathname);
  }
  return canonical + '#' + (suffixes[type] || type);
}

const encodeSchema = schema => JSON.stringify(schema).replace(/</g, '\\u003c');
const scriptSchemas = script => {
  const schema = JSON.parse(script.textContent);
  return schema['@graph'] || [schema];
};

// Consolidate duplicate generated nodes before writing the initial HTML. Keep
// the first script's provenance attributes and all non-overridden schema fields.
export function pageSchemaMarkup(markup, canonical) {
  const nodes = new Map();
  for (const match of markup.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const schema = JSON.parse(match[2]);
    const key = schemaIdentity(schema, canonical);
    const previous = nodes.get(key);
    nodes.set(key, {
      attributes: previous?.attributes || match[1],
      schema: { ...previous?.schema, ...schema },
    });
  }
  return Array.from(nodes.values(), node =>
    '<script' + node.attributes + ' data-seo-canonical="' + canonical + '">' +
    encodeSchema(node.schema) + '</script>'
  ).join('\n');
}

export function updateSiteSchemas(doc, definitions) {
  const scripts = Array.from(doc.head.querySelectorAll('script[data-seo-site-schema="true"]'));
  const nodes = new Map();
  for (const script of scripts) {
    for (const schema of scriptSchemas(script)) nodes.set(schema['@id'], schema);
  }
  for (const schema of definitions) {
    nodes.set(schema['@id'], { ...nodes.get(schema['@id']), ...schema });
  }
  const script = scripts[0] || doc.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-seo-site-schema', 'true');
  script.textContent = encodeSchema({ '@context': 'https://schema.org', '@graph': Array.from(nodes.values()) });
  if (!script.parentNode) doc.head.appendChild(script);
  scripts.slice(1).forEach(node => node.remove());
}

export function clearStalePageSchemas(doc, canonical) {
  doc.head.querySelectorAll('script[data-seo-canonical]').forEach(script => {
    if (script.getAttribute('data-seo-canonical') !== canonical) script.remove();
  });
}

export function addPageSchema(doc, schema, canonical) {
  const key = schemaIdentity(schema, canonical);
  const existing = Array.from(doc.head.querySelectorAll('script[data-seo-canonical]')).find(script =>
    script.getAttribute('data-seo-canonical') === canonical &&
    schemaIdentity(JSON.parse(script.textContent), canonical) === key
  );
  if (existing) {
    const original = existing.textContent;
    const updated = encodeSchema({ ...JSON.parse(original), ...schema });
    existing.textContent = updated;
    return () => {
      // A route change removes this node first. Never restore a retired page's
      // schema or overwrite a subsequent owner while React cleans up.
      if (existing.parentNode && existing.textContent === updated) existing.textContent = original;
    };
  }
  const script = doc.createElement('script');
  script.type = 'application/ld+json';
  script.className = 'seo-schema';
  script.setAttribute('data-seo-canonical', canonical);
  script.textContent = encodeSchema(schema);
  doc.head.appendChild(script);
  return () => script.remove();
}
