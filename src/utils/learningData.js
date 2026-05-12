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
  { id: 'a4', title: 'Practical AI For Small Businesses', category: 'AI Basics For Small Businesses', link: '/practical-ai-for-small-businesses', description: 'Real tools you can use today to save time and generate more leads.', status: 'published', priority: 'high', relatedArticleSlug: 'practical-ai-for-small-businesses', relatedVideoIds: ['v14'], youtubeUrl: null, thumbnailUrl: null }
];

export const LEARNING_VIDEOS = [
  {
    id: 'v1',
    title: 'How AI Overviews Choose Which Businesses To Show',
    category: 'AI Visibility & Search',
    duration: '5:42',
    youtubeId: 'jNQXAC9IVRw', 
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    description: 'Learn the exact ranking signals ChatGPT and Google AI Overviews use when deciding which local business to recommend.',
    status: 'published', priority: 'high', relatedArticleSlug: 'ai-visibility-basics', relatedVideoIds: ['v2', 'v11'], youtubeUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'v2',
    title: 'SEO is Dead. Long Live AISO.',
    category: 'AI Visibility & Search',
    duration: '8:15',
    youtubeId: 'jNQXAC9IVRw',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    description: 'Why you should stop buying traditional keyword SEO and start optimizing for AI search models instead.',
    status: 'published', priority: 'high', relatedArticleSlug: 'seo-vs-ai-search', relatedVideoIds: ['v1', 'v11'], youtubeUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'v3',
    title: 'The Truth About Video Marketing For Local Services',
    category: 'Video & CTV Marketing',
    duration: '4:20',
    youtubeId: 'jNQXAC9IVRw',
    thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=800',
    description: 'How simple, authentic videos are outperforming high-production commercials on social media.',
    status: 'published', priority: 'high', relatedArticleSlug: null, relatedVideoIds: ['v4', 'v15'], youtubeUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', thumbnailUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'v4',
    title: 'Connecting CTV Advertising to Local Lead Gen',
    category: 'Video & CTV Marketing',
    duration: '6:10',
    youtubeId: 'jNQXAC9IVRw',
    thumbnail: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80&w=800',
    description: 'How to run TV commercials directly in your local market on Hulu, Roku, and Amazon without a massive budget.',
    status: 'published', priority: 'medium', relatedArticleSlug: null, relatedVideoIds: ['v3', 'v15'], youtubeUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', thumbnailUrl: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'v5',
    title: 'Why Websites Are Becoming "Trust Verification" Hubs',
    category: 'Digital Trust & Reputation',
    duration: '7:30',
    youtubeId: 'jNQXAC9IVRw',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    description: 'People don\'t browse websites to discover you anymore. They visit them to verify you are legit. Make sure your site passes the test.',
    status: 'published', priority: 'high', relatedArticleSlug: null, relatedVideoIds: ['v7', 'v10'], youtubeUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'v6',
    title: 'Inside The NTA Growth System',
    category: 'Modern Marketing Systems',
    duration: '12:45',
    youtubeId: 'jNQXAC9IVRw',
    thumbnail: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800',
    description: 'A complete walkthrough of the NTA Client Operations System and how we manage your visibility end-to-end.',
    status: 'published', priority: 'high', relatedArticleSlug: null, relatedVideoIds: ['v8', 'v9'], youtubeUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', thumbnailUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'v7',
    title: 'Building Digital Trust',
    category: 'Digital Trust & Reputation',
    duration: '4:15',
    youtubeId: 'E5vE1kXlAhw',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800',
    description: 'How to proactively build a digital reputation that search engines and AI models trust implicitly.',
    status: 'published', priority: 'high', relatedArticleSlug: 'digital-trust-reputation', relatedVideoIds: ['v5', 'v10', 'v13'], youtubeUrl: 'https://youtu.be/E5vE1kXlAhw', thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800',
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
    status: 'published', priority: 'high', relatedArticleSlug: 'seo-vs-ai-search', relatedVideoIds: ['v6', 'v9'], youtubeUrl: 'https://youtu.be/6Toyby7CTsA', thumbnailUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
    tags: ['AI Visibility', 'Authority Marketing', 'SEO', 'Content Marketing', 'Small Business Marketing', 'Digital Trust']
  },
  {
    id: 'v9',
    title: 'Growth Systems vs Campaigns',
    category: 'Modern Marketing Systems',
    duration: '5:45',
    youtubeId: 'jNQXAC9IVRw',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    description: 'How a true growth system scales predictably, while campaigns burn through cash.',
    status: 'needs_video', priority: 'high', relatedArticleSlug: null, relatedVideoIds: ['v6', 'v8'], youtubeUrl: null, thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'v10',
    title: 'Reputation Is Now a Growth Engine',
    category: 'Digital Trust & Reputation',
    duration: '4:50',
    youtubeId: 'jNQXAC9IVRw',
    thumbnail: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff0f?auto=format&fit=crop&q=80&w=800',
    description: 'Turn your customer reviews into your most powerful local SEO asset.',
    status: 'placeholder', priority: 'medium', relatedArticleSlug: null, relatedVideoIds: ['v5', 'v7'], youtubeUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', thumbnailUrl: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff0f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'v11',
    title: 'The Future Belongs to Market Leaders',
    category: 'AI Visibility & Search',
    duration: '8:20',
    youtubeId: 'jNQXAC9IVRw',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800',
    description: 'Why AI overviews naturally create a winner-takes-all scenario in local markets.',
    status: 'planned', priority: 'medium', relatedArticleSlug: null, relatedVideoIds: ['v1', 'v2'], youtubeUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'v12',
    title: 'The Hidden Cost of Outdated Marketing',
    category: 'Modern Marketing Systems',
    duration: '5:10',
    youtubeId: 'jNQXAC9IVRw',
    thumbnail: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=800',
    description: 'How holding onto legacy SEO and traditional websites is slowly bleeding your business dry.',
    status: 'placeholder', priority: 'high', relatedArticleSlug: null, relatedVideoIds: ['v8', 'v16'], youtubeUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', thumbnailUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=800'
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
    youtubeId: 'jNQXAC9IVRw',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    description: 'A no-BS guide to how small businesses are actually using AI to generate more revenue.',
    status: 'placeholder', priority: 'medium', relatedArticleSlug: 'practical-ai-for-small-businesses', relatedVideoIds: [], youtubeUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'v15',
    title: 'Video Storytelling Builds Confidence',
    category: 'Video & CTV Marketing',
    duration: '6:05',
    youtubeId: 'jNQXAC9IVRw',
    thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=800',
    description: 'Stop selling and start showing. How authentic video creates instant customer confidence.',
    status: 'placeholder', priority: 'medium', relatedArticleSlug: null, relatedVideoIds: ['v3'], youtubeUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', thumbnailUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=800'
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