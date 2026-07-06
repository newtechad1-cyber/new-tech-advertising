/**
 * R0.7 — Topical Authority Map
 * Defines topic clusters for SEO and AI search authority.
 * Each cluster has a pillar page and supporting content that
 * creates depth signals for Google and AI systems.
 *
 * Structure: Pillar → Supporting pages → Related articles → Videos
 * This file drives both the TopicalAuthorityMap component
 * and the internal linking recommendations engine.
 */

export const TOPIC_CLUSTERS = [
  {
    id: 'ai-search-visibility',
    name: 'AI Search & Visibility',
    description: 'How AI is reshaping online search and what businesses must do to stay visible',
    icon: 'Search',
    color: 'blue',
    pillar: {
      title: 'SEO vs AI Search',
      slug: 'seo-vs-ai-search',
      url: '/seo-vs-ai-search',
      type: 'article',
    },
    supporting: [
      { title: 'What Changed Online', url: '/what-changed-online', type: 'article', relationship: 'context' },
      { title: 'AI Visibility Basics', url: '/ai-visibility-basics', type: 'article', relationship: 'education' },
      { title: 'The Future Belongs to Market Leaders', url: '/the-future-belongs-to-market-leaders', type: 'article', relationship: 'philosophy' },
      { title: 'AI Learning Center', url: '/learning-center', type: 'learning', relationship: 'deep-dive' },
      { title: 'AI SEO Service', url: '/AiSeo', type: 'service', relationship: 'solution' },
    ],
    buyer_stages: ['Awareness', 'Consideration'],
    keywords: ['AI search optimization', 'SEO vs AI', 'AI visibility', 'Google AI Overview', 'zero click search', 'AISO'],
  },
  {
    id: 'digital-trust-authority',
    name: 'Digital Trust & Authority',
    description: 'Building the trust signals that Google, AI, and customers all evaluate',
    icon: 'Shield',
    color: 'emerald',
    pillar: {
      title: 'Building Digital Trust',
      slug: 'building-digital-trust',
      url: '/building-digital-trust',
      type: 'article',
    },
    supporting: [
      { title: 'Reputation Is Now a Growth Engine', url: '/reputation-is-now-a-growth-engine', type: 'article', relationship: 'extension' },
      { title: 'Web Accessibility Builds Trust', url: '/web-accessibility-trust', type: 'article', relationship: 'extension' },
      { title: 'Campaigns vs. Authority', url: '/campaigns-vs-authority', type: 'article', relationship: 'philosophy' },
      { title: 'Websites as Salespeople', url: '/websites-as-salespeople', type: 'article', relationship: 'application' },
      { title: 'Accessible Websites', url: '/accessible-websites', type: 'service', relationship: 'solution' },
    ],
    buyer_stages: ['Awareness', 'Consideration'],
    keywords: ['digital trust', 'online reputation', 'web accessibility', 'brand authority', 'review management', 'ADA compliance'],
  },
  {
    id: 'ai-local-marketing',
    name: 'AI Marketing for Local Business',
    description: 'How AI levels the playing field so small businesses compete with bigger budgets',
    icon: 'Zap',
    color: 'purple',
    pillar: {
      title: 'The Role of AI in Local Marketing',
      slug: 'role-of-ai-in-local-marketing',
      url: '/role-of-ai-in-local-marketing',
      type: 'article',
    },
    supporting: [
      { title: 'Practical AI for Small Businesses', url: '/practical-ai-for-small-businesses', type: 'article', relationship: 'education' },
      { title: 'Growth Systems vs. Campaigns', url: '/growth-systems-vs-campaigns', type: 'article', relationship: 'philosophy' },
      { title: 'The Hidden Cost of Outdated Marketing', url: '/hidden-cost-of-outdated-marketing', type: 'article', relationship: 'problem' },
      { title: 'Local Lead Systems', url: '/local-lead-systems', type: 'service', relationship: 'solution' },
      { title: 'AI Social Media', url: '/AiSocialMedia', type: 'service', relationship: 'solution' },
      { title: 'AI Advertising', url: '/AiAdvertising', type: 'service', relationship: 'solution' },
    ],
    buyer_stages: ['Awareness', 'Consideration', 'Decision'],
    keywords: ['AI local marketing', 'small business AI', 'marketing automation', 'AI advertising', 'AI social media'],
  },
  {
    id: 'content-video-strategy',
    name: 'Content & Video Strategy',
    description: 'Creating content that builds authority and converts — from video to written to social',
    icon: 'Play',
    color: 'rose',
    pillar: {
      title: 'Video Storytelling Builds Confidence',
      slug: 'video-storytelling-builds-confidence',
      url: '/video-storytelling-builds-confidence',
      type: 'article',
    },
    supporting: [
      { title: 'AI Video Marketing', url: '/ai-video-marketing', type: 'service', relationship: 'solution' },
      { title: 'Social Media Content System', url: '/social-media-content-system', type: 'service', relationship: 'solution' },
      { title: 'The Canon', url: '/canon', type: 'collection', relationship: 'example' },
      { title: 'NTA Journal', url: '/journal', type: 'collection', relationship: 'example' },
      { title: 'AI Videos Service', url: '/AiVideos', type: 'service', relationship: 'solution' },
    ],
    buyer_stages: ['Consideration', 'Decision'],
    keywords: ['video marketing small business', 'content strategy', 'social media content', 'video storytelling', 'AI video'],
  },
  {
    id: 'small-business-growth',
    name: 'Small Business Growth Systems',
    description: 'Systematic approaches to growing a local business — diagnostics, planning, and execution',
    icon: 'TrendingUp',
    color: 'amber',
    pillar: {
      title: 'Growth Systems vs. Campaigns',
      slug: 'growth-systems-vs-campaigns',
      url: '/growth-systems-vs-campaigns',
      type: 'article',
    },
    supporting: [
      { title: 'Digital Risks Nobody Warns About', url: '/digital-risks', type: 'article', relationship: 'problem' },
      { title: 'Business Score', url: '/business-score', type: 'tool', relationship: 'diagnostic' },
      { title: 'Growth Roadmap Generator', url: '/growth-roadmap-generator', type: 'tool', relationship: 'planning' },
      { title: 'Growth Conversation', url: '/growth-conversation', type: 'tool', relationship: 'entry-point' },
      { title: 'Seasonal Campaigns', url: '/seasonal-campaigns', type: 'service', relationship: 'execution' },
    ],
    buyer_stages: ['Awareness', 'Consideration', 'Decision'],
    keywords: ['business growth systems', 'marketing ROI', 'business score', 'growth roadmap', 'local business growth'],
  },
  {
    id: 'founder-story',
    name: 'The Founder Journey',
    description: 'Rick Hesse\'s story — 45 years of entrepreneurship, early adoption, and building NTA in public',
    icon: 'User',
    color: 'cyan',
    pillar: {
      title: 'AI Brought Me Out of Retirement',
      slug: 'ai-brought-me-out-of-retirement',
      url: '/ai-brought-me-out-of-retirement',
      type: 'article',
    },
    supporting: [
      { title: 'I Was Early Again', url: '/i-was-early-again', type: 'article', relationship: 'continuation' },
      { title: 'Our Story', url: '/our-story', type: 'page', relationship: 'context' },
      { title: 'About', url: '/About', type: 'page', relationship: 'context' },
      { title: 'Our Work', url: '/our-work', type: 'page', relationship: 'proof' },
    ],
    buyer_stages: ['Awareness'],
    keywords: ['Rick Hesse', 'New Tech Advertising founder', 'mason city entrepreneur', 'AI marketing pioneer'],
  },
  {
    id: 'industry-hvac',
    name: 'HVAC Marketing',
    description: 'AI-powered marketing specifically for HVAC contractors — from seasonal campaigns to lead systems',
    icon: 'Thermometer',
    color: 'orange',
    pillar: {
      title: 'HVAC Marketing',
      slug: 'HvacMarketing',
      url: '/HvacMarketing',
      type: 'industry',
    },
    supporting: [
      { title: 'HVAC Marketing North Iowa', url: '/hvac-marketing-north-iowa', type: 'geo', relationship: 'local' },
      { title: 'Contractor Marketing North Iowa', url: '/contractor-marketing-north-iowa', type: 'geo', relationship: 'local' },
      { title: 'Johnson Heating Case Study', url: '/case-studies/johnson-heating', type: 'case_study', relationship: 'proof' },
      { title: 'Seasonal Campaigns', url: '/seasonal-campaigns', type: 'service', relationship: 'solution' },
    ],
    buyer_stages: ['Awareness', 'Consideration', 'Decision'],
    keywords: ['HVAC marketing', 'HVAC advertising', 'HVAC leads', 'heating and cooling marketing', 'north iowa HVAC'],
  },
  {
    id: 'industry-plumbing',
    name: 'Plumbing Marketing',
    description: 'Marketing systems for plumbing, heating, and excavating businesses',
    icon: 'Wrench',
    color: 'indigo',
    pillar: {
      title: 'Plumbing Marketing',
      slug: 'PlumbingMarketing',
      url: '/PlumbingMarketing',
      type: 'industry',
    },
    supporting: [
      { title: 'Monson Plumbing Case Study', url: '/case-study/monson-plumbing', type: 'case_study', relationship: 'proof' },
      { title: 'Small Business Marketing North Iowa', url: '/small-business-marketing-north-iowa', type: 'geo', relationship: 'local' },
      { title: 'Local Lead Systems', url: '/local-lead-systems', type: 'service', relationship: 'solution' },
    ],
    buyer_stages: ['Awareness', 'Consideration', 'Decision'],
    keywords: ['plumbing marketing', 'plumber advertising', 'plumbing leads', 'plumber SEO'],
  },
];

/**
 * Get internal linking suggestions for a given page URL.
 * Returns pages from other clusters that would strengthen authority.
 */
export function getInternalLinkSuggestions(pageUrl) {
  const suggestions = [];
  const currentCluster = TOPIC_CLUSTERS.find(c =>
    c.pillar.url === pageUrl ||
    c.supporting.some(s => s.url === pageUrl)
  );

  if (!currentCluster) return suggestions;

  // Suggest pillar pages from related clusters
  TOPIC_CLUSTERS.forEach(cluster => {
    if (cluster.id === currentCluster.id) return;
    // Check for overlapping buyer stages
    const hasOverlap = cluster.buyer_stages.some(s =>
      currentCluster.buyer_stages.includes(s)
    );
    if (hasOverlap) {
      suggestions.push({
        url: cluster.pillar.url,
        title: cluster.pillar.title,
        cluster: cluster.name,
        reason: 'Related topic cluster — strengthens topical authority',
      });
    }
  });

  return suggestions.slice(0, 5);
}

/**
 * Get the authority depth for a topic cluster.
 * Returns a score based on how many supporting pages exist.
 */
export function getClusterDepth(clusterId) {
  const cluster = TOPIC_CLUSTERS.find(c => c.id === clusterId);
  if (!cluster) return 0;
  return {
    id: clusterId,
    name: cluster.name,
    pillar: cluster.pillar.title,
    supportingCount: cluster.supporting.length,
    buyerStages: cluster.buyer_stages.length,
    keywordCount: cluster.keywords.length,
    depth: Math.min(10, cluster.supporting.length + cluster.buyer_stages.length),
  };
}
