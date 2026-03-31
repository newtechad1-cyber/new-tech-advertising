/**
 * Automatic contextual internal linking for blog content.
 * Scans markdown text and injects keyword-rich anchor links.
 * Max 3–5 total links per article, first match only per keyword group.
 */

const LINK_RULES = [
  // Website issues / rebuilds
  {
    patterns: [
      /\boutdated website\b/i,
      /\bslow website\b/i,
      /\bwebsite rebuild\b/i,
      /\bwebsite redesign\b/i,
      /\bwebsite performance\b/i,
      /\bwebsite is (costing|hurting|losing)\b/i,
      /\bpoor website\b/i,
      /\bnew website\b/i,
      /\bmodern website\b/i,
    ],
    url: '/services/website-rebuilds',
    group: 'website',
  },
  // ADA / accessibility
  {
    patterns: [
      /\bADA compliance\b/i,
      /\bADA accessible\b/i,
      /\baccessibility compliance\b/i,
      /\bwebsite accessibility\b/i,
      /\bADA lawsuit\b/i,
      /\bADA requirements\b/i,
      /\baccessibility standards\b/i,
    ],
    url: '/AdaWebsiteCompliance',
    group: 'ada',
  },
  // Location: Mason City
  {
    patterns: [
      /\bMason City\b/i,
      /\bNorth Iowa\b/i,
    ],
    url: '/website-rebuilds/mason-city-ia',
    group: 'mason-city',
  },
  // Location: Rochester
  {
    patterns: [
      /\bRochester,?\s*MN\b/i,
      /\bRochester Minnesota\b/i,
    ],
    url: '/website-rebuilds/rochester-mn',
    group: 'rochester',
  },
  // Location: Austin MN
  {
    patterns: [
      /\bAustin,?\s*MN\b/i,
      /\bAustin Minnesota\b/i,
    ],
    url: '/website-rebuilds/austin-mn',
    group: 'austin-mn',
  },
  // Location: Albert Lea
  {
    patterns: [
      /\bAlbert Lea\b/i,
    ],
    url: '/website-rebuilds/albert-lea-mn',
    group: 'albert-lea',
  },
  // Local business (generic — lower priority)
  {
    patterns: [
      /\blocal business(es)?\b/i,
      /\bsmall business(es)?\b/i,
      /\blocal service business\b/i,
    ],
    url: '/services/website-rebuilds',
    group: 'local-business',
  },
  // SEO
  {
    patterns: [
      /\blocal SEO\b/i,
      /\bGoogle ranking\b/i,
      /\bsearch engine ranking\b/i,
      /\brank (higher|on Google)\b/i,
    ],
    url: '/AiSeo',
    group: 'seo',
  },
  // Streaming TV
  {
    patterns: [
      /\bstreaming (TV|television) (advertising|ads|campaign)\b/i,
      /\bconnected TV\b/i,
      /\bOTT advertising\b/i,
    ],
    url: '/StreamingTvAdvertising',
    group: 'streaming',
  },
];

const MAX_LINKS = 4;

/**
 * Apply internal links to markdown content.
 * Skips content inside existing markdown links: [...](...) or code blocks.
 */
export function applyInternalLinks(markdown) {
  if (!markdown) return markdown;

  const usedGroups = new Set();
  let linkCount = 0;
  let result = markdown;

  // Strip code blocks and existing links from consideration (we'll restore them)
  // Strategy: replace them with placeholders, process, then restore
  const preserved = [];
  let processed = result
    // Preserve fenced code blocks
    .replace(/```[\s\S]*?```/g, (m) => { preserved.push(m); return `\x00PRESERVED_${preserved.length - 1}\x00`; })
    // Preserve inline code
    .replace(/`[^`]+`/g, (m) => { preserved.push(m); return `\x00PRESERVED_${preserved.length - 1}\x00`; })
    // Preserve existing markdown links
    .replace(/\[([^\]]+)\]\([^)]+\)/g, (m) => { preserved.push(m); return `\x00PRESERVED_${preserved.length - 1}\x00`; });

  for (const rule of LINK_RULES) {
    if (linkCount >= MAX_LINKS) break;
    if (usedGroups.has(rule.group)) continue;

    for (const pattern of rule.patterns) {
      if (linkCount >= MAX_LINKS) break;

      const match = pattern.exec(processed);
      if (!match) continue;

      // Don't link headings (lines starting with #)
      const lineStart = processed.lastIndexOf('\n', match.index) + 1;
      const linePrefix = processed.slice(lineStart, match.index);
      if (/^#{1,6}\s/.test(linePrefix)) continue;

      const matchedText = match[0];
      processed = processed.slice(0, match.index)
        + `[${matchedText}](${rule.url})`
        + processed.slice(match.index + matchedText.length);

      usedGroups.add(rule.group);
      linkCount++;
      break; // move to next rule after first match
    }
  }

  // Restore preserved blocks
  processed = processed.replace(/\x00PRESERVED_(\d+)\x00/g, (_, i) => preserved[parseInt(i)]);

  return processed;
}