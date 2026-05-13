export const LEARNING_CATEGORIES = [
  { id: 'ai-visibility-search', title: 'AI Visibility & Search', description: 'Master zero-click searches, AI overviews, and structured data.' },
  { id: 'digital-trust-reputation', title: 'Digital Trust & Reputation', description: 'Build a verifiable digital footprint that AI models trust.' },
  { id: 'modern-marketing-systems', title: 'Modern Marketing Systems', description: 'Stop buying random tactics and start building growth engines.' },
  { id: 'video-ctv-marketing', title: 'Video & CTV Marketing', description: 'Leverage authentic video and connected TV to drive local leads.' },
  { id: 'ai-basics-small-businesses', title: 'AI Basics For Small Businesses', description: 'Practical AI applications to save time and punch above your weight.' }
];

export const VIDEO_CATEGORIES = [
  'All', 'AI Visibility & Search', 'Digital Trust & Reputation', 'Modern Marketing Systems', 'Video & CTV Marketing', 'AI Basics For Small Businesses'
];

export const LEARNING_ARTICLES = [
  { id: 'a1', title: 'What Changed Online', category: 'AI Visibility & Search', link: '/what-changed-online', description: 'Understand zero-click searches, AI overviews, and what to do next.', status: 'published', priority: 'high', relatedArticleSlug: 'what-changed-online', relatedVideoIds: ['v1', 'v11'], youtubeUrl: null, thumbnailUrl: null },
  { id: 'a2', title: 'AI Visibility Basics', category: 'AI Visibility & Search', link: '/ai-visibility-basics', description: 'How ChatGPT and Gemini choose which local businesses to recommend.', status: 'published', priority: 'high', relatedArticleSlug: 'ai-visibility-basics', relatedVideoIds: ['v1'], youtubeUrl: null, thumbnailUrl: null },
  { id: 'a3', title: 'SEO vs AI Search', category: 'AI Visibility & Search', link: '/seo-vs-ai-search', description: 'Why traditional SEO is dying and how AI Search Optimization replaces it.', status: 'published', priority: 'high', relatedArticleSlug: 'seo-vs-ai-search', relatedVideoIds: ['v2'], youtubeUrl: null, thumbnailUrl: null },
  { id: 'a4', title: 'Practical AI For Small Businesses', category: 'AI Basics For Small Businesses', link: '/practical-ai-for-small-businesses', description: 'Real tools you can use today to save time and generate more leads.', status: 'published', priority: 'high', relatedArticleSlug: 'practical-ai-for-small-businesses', relatedVideoIds: ['v14'], youtubeUrl: null, thumbnailUrl: null },
  { id: 'a5', title: 'Growth Systems vs Campaigns', category: 'Modern Marketing Systems', link: '/growth-systems-vs-campaigns', description: 'How a true growth system scales predictably, while campaigns burn through cash.', status: 'published', priority: 'high', relatedArticleSlug: 'growth-systems-vs-campaigns', relatedVideoIds: ['v9'], youtubeUrl: null, thumbnailUrl: null },
  { id: 'a6', title: 'Reputation Is Now a Growth Engine', category: 'Digital Trust & Reputation', link: '/reputation-is-now-a-growth-engine', description: 'Turn your customer reviews into your most powerful local SEO asset.', status: 'published', priority: 'high', relatedArticleSlug: 'reputation-is-now-a-growth-engine', relatedVideoIds: ['v10'], youtubeUrl: null, thumbnailUrl: null },
  { id: 'a7', title: 'The Hidden Cost of Outdated Marketing', category: 'Modern Marketing Systems', link: '/hidden-cost-of-outdated-marketing', description: 'How holding onto legacy SEO and traditional websites is slowly bleeding your business dry.', status: 'published', priority: 'high', relatedArticleSlug: 'hidden-cost-of-outdated-marketing', relatedVideoIds: ['v12'], youtubeUrl: null, thumbnailUrl: null },
  { id: 'a8', title: 'The Role of AI in Local Marketing', category: 'AI Basics For Small Businesses', link: '/role-of-ai-in-local-marketing', description: 'A no-BS guide to how small businesses are actually using AI to generate more revenue.', status: 'published', priority: 'high', relatedArticleSlug: 'role-of-ai-in-local-marketing', relatedVideoIds: ['v14'], youtubeUrl: null, thumbnailUrl: null },
  { id: 'a9', title: 'Web Accessibility: The Foundation of Digital Trust', category: 'Digital Trust & Reputation', link: '/web-accessibility-trust', description: 'Why accessible websites rank better in AI search and build instant credibility.', status: 'published', priority: 'high', relatedArticleSlug: 'web-accessibility-trust', relatedVideoIds: ['v7'], youtubeUrl: null, thumbnailUrl: null },
  { id: 'a10', title: 'Building Digital Trust', category: 'Digital Trust & Reputation', link: '/building-digital-trust', description: 'How to proactively build a digital reputation that search engines and AI models trust implicitly.', status: 'published', priority: 'high', relatedArticleSlug: 'building-digital-trust', relatedVideoIds: ['v7', 'v10'], youtubeUrl: null, thumbnailUrl: null },
  { id: 'a11', title: 'Video Storytelling Builds Confidence', category: 'Video & CTV Marketing', link: '/video-storytelling-builds-confidence', description: 'Stop selling and start showing. How authentic video creates instant customer confidence.', status: 'published', priority: 'high', relatedArticleSlug: 'video-storytelling-builds-confidence', relatedVideoIds: ['v15'], youtubeUrl: null, thumbnailUrl: null },
  { id: 'a12', title: 'Campaigns vs Authority', category: 'AI Visibility & Search', link: '/campaigns-vs-authority', description: 'Stop running endless disconnected campaigns and start building compounding digital authority.', status: 'published', priority: 'high', relatedArticleSlug: 'campaigns-vs-authority', relatedVideoIds: ['v8'], youtubeUrl: null, thumbnailUrl: null },
  { id: 'a13', title: 'The Future Belongs to Market Leaders', category: 'AI Visibility & Search', link: '/the-future-belongs-to-market-leaders', description: 'Why AI search, customer behavior, trust signals, and digital authority are increasingly favoring businesses that become recognized local market leaders.', status: 'published', priority: 'high', relatedArticleSlug: 'the-future-belongs-to-market-leaders', relatedVideoIds: ['v11'], youtubeUrl: null, thumbnailUrl: null }
];

export const LEARNING_VIDEOS = [
  {
    id: 'v7',
    title: 'Building Digital Trust',
    category: 'Digital Trust & Reputation',
    duration: '4:15',
    youtubeId: 'E5vE1kXlAhw',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800',
    description: 'How to proactively build a digital reputation that search engines and AI models trust implicitly.',
    status: 'published', priority: 'high', relatedArticleSlug: 'building-digital-trust', relatedVideoIds: ['v5', 'v10', 'v13'], youtubeUrl: 'https://youtu.be/E5vE1kXlAhw', thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800',
    tags: ['Digital Trust', 'Reputation', 'Small Business Marketing', 'AI Visibility', 'Reviews', 'Customer Confidence']
  },
  {
    id: 'v8',
    title: 'Campaigns vs Authority',
    category: 'AI Visibility & Search',
    duration: '6:30',
    youtubeId: '6Toyby7CTsA',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
    description: 'Stop running endless disconnected campaigns and start building compounding digital authority.',
    status: 'published', priority: 'high', relatedArticleSlug: 'campaigns-vs-authority', relatedVideoIds: ['v6', 'v9'], youtubeUrl: 'https://youtu.be/6Toyby7CTsA', thumbnailUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
    tags: ['AI Visibility', 'Authority Marketing', 'SEO', 'Content Marketing', 'Small Business Marketing', 'Digital Trust']
  },
  {
    id: 'v9',
    title: 'Growth Systems vs Campaigns',
    category: 'Modern Marketing Systems',
    duration: '5:45',
    youtubeId: '6kB55gnGGHo',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    description: 'How a true growth system scales predictably, while campaigns burn through cash.',
    status: 'published', priority: 'high', relatedArticleSlug: 'growth-systems-vs-campaigns', relatedVideoIds: ['v6', 'v8'], youtubeUrl: 'https://youtu.be/6kB55gnGGHo', thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    tags: ['Growth Systems', 'Small Business Marketing', 'AI Visibility', 'Marketing Systems', 'SEO', 'Content Marketing', 'Business Growth']
  },
  {
    id: 'v10',
    title: 'Reputation Is Now a Growth Engine',
    category: 'Digital Trust & Reputation',
    duration: '4:50',
    youtubeId: 'BT3WY2WdVDY',
    thumbnail: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff0f?auto=format&fit=crop&q=80&w=800',
    description: 'Turn your customer reviews into your most powerful local SEO asset.',
    status: 'published', priority: 'high', relatedArticleSlug: 'reputation-is-now-a-growth-engine', relatedVideoIds: ['v5', 'v7'], youtubeUrl: 'https://youtu.be/BT3WY2WdVDY', thumbnailUrl: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff0f?auto=format&fit=crop&q=80&w=800',
    tags: ['Reputation Marketing', 'Digital Trust', 'AI Visibility', 'Reviews', 'Small Business Marketing', 'Customer Trust', 'Business Growth']
  },
  {
    id: 'v11',
    title: 'The Future Belongs to Market Leaders',
    category: 'AI Visibility & Search',
    duration: '8:20',
    youtubeId: 'jNQXAC9IVRw',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800',
    description: 'Why AI overviews naturally create a winner-takes-all scenario in local markets.',
    status: 'published', priority: 'high', relatedArticleSlug: 'the-future-belongs-to-market-leaders', relatedVideoIds: ['v1', 'v2'], youtubeUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'v12',
    title: 'The Hidden Cost of Outdated Marketing',
    category: 'Modern Marketing Systems',
    duration: '5:10',
    youtubeId: 'jU_2Wae-_14',
    thumbnail: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=800',
    description: 'How holding onto legacy SEO and traditional websites is slowly bleeding your business dry.',
    status: 'published', priority: 'high', relatedArticleSlug: 'hidden-cost-of-outdated-marketing', relatedVideoIds: ['v8', 'v16'], youtubeUrl: 'https://youtu.be/jU_2Wae-_14', thumbnailUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=800',
    tags: ['AI Visibility', 'Modern Marketing', 'SEO', 'Digital Marketing', 'Small Business Marketing', 'Business Growth', 'Content Marketing']
  },
  {
    id: 'v13',
    title: 'The Power of Consistency',
    category: 'Digital Trust & Reputation',
    duration: '3:45',
    youtubeId: 'jNQXAC9IVRw',
    thumbnail: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&q=80&w=800',
    description: 'Why consistent data across the web is the number one ranking signal for AI.',
    status: 'needs_video', priority: 'high', relatedArticleSlug: null, relatedVideoIds: ['v7'], youtubeUrl: null, thumbnailUrl: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'v14',
    title: 'The Role of AI in Local Marketing',
    category: 'AI Basics For Small Businesses',
    duration: '7:15',
    youtubeId: 'scPcJSMFn-E',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    description: 'A no-BS guide to how small businesses are actually using AI to generate more revenue.',
    status: 'published', priority: 'high', relatedArticleSlug: 'role-of-ai-in-local-marketing', relatedVideoIds: [], youtubeUrl: 'https://youtu.be/scPcJSMFn-E', thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    tags: ['AI For Small Business', 'AI Visibility', 'Local Marketing', 'SEO', 'Digital Marketing', 'Small Business Growth', 'AI Search']
  },
  {
    id: 'v15',
    title: 'Video Storytelling Builds Confidence',
    category: 'Video & CTV Marketing',
    duration: '6:05',
    youtubeId: '3_P36VrK9jc',
    thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=800',
    description: 'Stop selling and start showing. How authentic video creates instant customer confidence.',
    status: 'published', priority: 'high', relatedArticleSlug: 'video-storytelling-builds-confidence', relatedVideoIds: ['v3'], youtubeUrl: 'https://youtu.be/3_P36VrK9jc', thumbnailUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=800',
    tags: ['Video Marketing', 'Digital Trust', 'AI Visibility', 'CTV', 'Content Marketing', 'Small Business Marketing', 'Customer Confidence']
  },
  {
    id: 'v16',
    title: 'Websites as Salespeople',
    category: 'Modern Marketing Systems',
    duration: '5:30',
    youtubeId: 'jNQXAC9IVRw',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    description: 'Turn your brochure website into a 24/7 lead generation engine.',
    status: 'planned', priority: 'low', relatedArticleSlug: null, relatedVideoIds: ['v12'], youtubeUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
  }
];