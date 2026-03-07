import React, { useState } from 'react';
import { ChevronDown, BookOpen, ShoppingBag, Mail, Users, Image, Video, FileText, BarChart2, Briefcase, StickyNote, BrainCircuit, Settings, CalendarDays, Wrench, Cpu, Tv, Share2, MonitorPlay, RefreshCw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TOOL_GUIDE = [
  {
    category: 'Website Management',
    color: 'bg-sky-500',
    tools: [
      {
        name: 'Blog Management',
        icon: FileText,
        description: 'Create and manage blog posts to drive SEO traffic and establish authority.',
        howTo: [
          'Click "New Post" to start creating content',
          'Write your post with the rich text editor',
          'Add meta descriptions and keywords for SEO',
          'Schedule or publish immediately',
          'Monitor engagement and performance metrics'
        ]
      },
      {
        name: 'Products',
        icon: ShoppingBag,
        description: 'Manage your digital and physical product catalog.',
        howTo: [
          'Add products with images, descriptions, and pricing',
          'Set inventory levels and stock alerts',
          'Configure product variants (size, color, etc)',
          'Organize into collections or categories',
          'Track sales and customer reviews'
        ]
      },
      {
        name: 'Ebook Writer',
        icon: BookOpen,
        description: 'Write, organize, and publish multi-chapter ebooks.',
        howTo: [
          'Create a new ebook and set metadata',
          'Add chapters and write content chapter by chapter',
          'Reorder chapters with drag-and-drop',
          'Generate PDF or publish as interactive ebook',
          'Use as lead magnet to build your email list'
        ]
      },
      {
        name: 'Analytics',
        icon: BarChart2,
        description: 'Track Google Analytics data and understand visitor behavior.',
        howTo: [
          'Connect your Google Analytics account',
          'View traffic trends and user sessions',
          'Analyze which pages convert best',
          'Identify top traffic sources',
          'Track goal completions and revenue'
        ]
      },
      {
        name: 'Portfolio',
        icon: Briefcase,
        description: 'Showcase your best work and case studies.',
        howTo: [
          'Add portfolio items with images and descriptions',
          'Include client testimonials and results',
          'Organize by project type or industry',
          'Add before/after comparisons',
          'Link to case studies for more detail'
        ]
      },
      {
        name: 'Notes',
        icon: StickyNote,
        description: 'Keep ideas, reminders, and internal notes.',
        howTo: [
          'Create quick notes for brainstorming',
          'Organize notes into categories',
          'Add tags for easy searching',
          'Set reminders for important notes',
          'Share notes with team members'
        ]
      }
    ]
  },
  {
    category: 'Social Media Management',
    color: 'bg-pink-500',
    tools: [
      {
        name: 'AI Video Studio',
        icon: MonitorPlay,
        description: 'Generate professional AI videos from scripts automatically.',
        howTo: [
          'Write or paste your video script',
          'Select AI avatar and voice',
          'Choose background music and styling',
          'Preview before generating',
          'Export to MP4 or publish directly to social'
        ]
      },
      {
        name: 'Streaming TV Scripts',
        icon: Tv,
        description: 'AI-generate optimized TV commercial scripts for your services.',
        howTo: [
          'Select your service type and target audience',
          'Let AI generate multiple script options',
          'Edit and refine the scripts',
          'Specify duration (15, 30, or 60 seconds)',
          'Use with AI Video Studio to create ads'
        ]
      },
      {
        name: 'Website Video Manager',
        icon: Video,
        description: 'Auto-generate and publish videos for website video placeholders.',
        howTo: [
          'Identify pages with video placeholders',
          'Generate videos using AI or upload existing',
          'Auto-publish to your website',
          'Track video engagement and views',
          'A/B test different videos'
        ]
      },
      {
        name: 'Connected Channels',
        icon: Share2,
        description: 'Connect and manage all your social media accounts.',
        howTo: [
          'Click "Connect Account" and authorize via social platform',
          'Manage multiple accounts across Facebook, Instagram, LinkedIn, TikTok',
          'Schedule posts across all channels',
          'View unified analytics',
          'Manage messaging and comments'
        ]
      },
      {
        name: 'Images',
        icon: Image,
        description: 'Central media library for social posts and videos.',
        howTo: [
          'Upload images or generate with AI',
          'Organize by campaign, product, or category',
          'Tag images for easy searching',
          'Generate multiple sizes for different platforms',
          'Use in social posts and email campaigns'
        ]
      },
      {
        name: 'Videos',
        icon: Video,
        description: 'Store and organize all your video assets.',
        howTo: [
          'Upload videos or link to YouTube/Vimeo',
          'Add titles, descriptions, and tags',
          'Organize by content type',
          'Generate thumbnails automatically',
          'Track views and engagement'
        ]
      }
    ]
  },
  {
    category: 'Email Marketing',
    color: 'bg-blue-500',
    tools: [
      {
        name: 'Email Marketing',
        icon: Mail,
        description: 'Create and send email campaigns to your subscriber list.',
        howTo: [
          'Create a new campaign or use templates',
          'Design emails with drag-and-drop builder',
          'Add personalization tokens for names, company, etc',
          'Set send time optimization',
          'Track opens, clicks, and conversions'
        ]
      },
      {
        name: 'Autoresponder',
        icon: RefreshCw,
        description: 'Set up automated email sequences triggered by user actions.',
        howTo: [
          'Create a new automation sequence',
          'Set trigger conditions (new subscriber, purchase, etc)',
          'Design sequence of emails',
          'Set delays between emails',
          'Monitor performance and adjust'
        ]
      },
      {
        name: 'Subscribers',
        icon: Users,
        description: 'Manage your email subscriber list.',
        howTo: [
          'Import subscribers from CSV or paste list',
          'Add custom fields for segmentation',
          'Segment by behavior, demographics, or engagement',
          'Monitor subscription status and unsubscribes',
          'Clean invalid emails automatically'
        ]
      }
    ]
  },
  {
    category: 'CRM & Marketing',
    color: 'bg-green-500',
    tools: [
      {
        name: 'CRM & Marketing Hub',
        icon: Users,
        description: 'Centralized management of leads, clients, email, and subscribers.',
        howTo: [
          'Manage lead pipeline from prospect to customer',
          'Log interactions and next steps',
          'Send targeted emails to segments',
          'Track engagement metrics',
          'Generate reports and forecasts'
        ]
      },
      {
        name: 'Operations Hub',
        icon: Briefcase,
        description: 'Manage workflows from prospect through proposal to fulfillment.',
        howTo: [
          'Track prospects through sales pipeline',
          'Create and send proposals',
          'Manage project workflows',
          'Assign tasks and set deadlines',
          'Monitor project status and profitability'
        ]
      }
    ]
  },
  {
    category: 'AI Content Engine',
    color: 'bg-violet-600',
    tools: [
      {
        name: 'System Settings',
        icon: Settings,
        description: 'Configure business info and AI model settings.',
        howTo: [
          'Set your business name and branding',
          'Configure AI model preferences',
          'Set content tone and style guides',
          'Manage API keys and integrations',
          'Set budget limits and spending controls'
        ]
      },
      {
        name: 'Weekly Authority Plans',
        icon: BrainCircuit,
        description: 'Create topical authority maps and content pillars.',
        howTo: [
          'Define your core topics and keywords',
          'Create pillar pages for each topic',
          'Plan supporting content clusters',
          'Generate weekly content recommendations',
          'Track topical coverage over time'
        ]
      },
      {
        name: 'Content Calendar & Queue',
        icon: CalendarDays,
        description: 'Plan, generate, and publish content automatically.',
        howTo: [
          'View your content calendar',
          'Generate new content with AI',
          'Schedule posts for future dates',
          'Batch generate multiple pieces',
          'Track what\'s queued, published, and performing'
        ]
      },
      {
        name: 'Trial Onboarding Queue',
        icon: Users,
        description: 'Review and configure new trial account setups.',
        howTo: [
          'View pending trial accounts',
          'Configure business profiles',
          'Generate initial content plans',
          'Provision dashboard access',
          'Monitor onboarding completion'
        ]
      },
      {
        name: 'AI Operations',
        icon: Cpu,
        description: 'Manage AI tasks, budgets, cost ledger, and memory.',
        howTo: [
          'Monitor active AI tasks',
          'Set and track budget limits',
          'View cost breakdown by task type',
          'Manage AI memory and context',
          'Optimize spending and efficiency'
        ]
      },
      {
        name: 'Agent Architecture',
        icon: BrainCircuit,
        description: 'Manage the 22-agent event-driven business system.',
        howTo: [
          'View all 22 specialized agents',
          'Configure agent roles and responsibilities',
          'Monitor agent performance',
          'Set up event triggers',
          'Review agent decision logs'
        ]
      },
      {
        name: 'Workflow Map',
        icon: Wrench,
        description: 'Master page, entity, and agent architecture map.',
        howTo: [
          'View system architecture diagram',
          'Understand entity relationships',
          'See how pages connect to agents',
          'Trace data flow through system',
          'Export architecture documentation'
        ]
      }
    ]
  }
];

export default function AdminHelpSupport({ onStartWizard }) {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedTool, setExpandedTool] = useState(null);

  return (
    <div className="space-y-6">
      {/* Quick Start */}
      <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-700/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-3">New to the Admin Dashboard?</h2>
        <p className="text-slate-300 mb-4">
          Get up to speed with an interactive wizard that walks you through creating your first campaign.
        </p>
        <Button 
          onClick={onStartWizard}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Zap className="w-4 h-4 mr-2" />
          Start Campaign Creation Wizard
        </Button>
      </div>

      {/* Tools Guide */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Tools & Features Guide</h2>
        <div className="space-y-3">
          {TOOL_GUIDE.map((category) => (
            <div key={category.category} className="border border-slate-700 rounded-lg overflow-hidden bg-slate-900/50">
              <button
                onClick={() => setExpandedCategory(expandedCategory === category.category ? null : category.category)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className={`${category.color} w-3 h-3 rounded-full`}></div>
                  <h3 className="text-white font-semibold">{category.category}</h3>
                  <span className="text-slate-400 text-sm">({category.tools.length} tools)</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedCategory === category.category ? 'rotate-180' : ''}`} />
              </button>

              {expandedCategory === category.category && (
                <div className="border-t border-slate-700 divide-y divide-slate-700">
                  {category.tools.map((tool) => {
                    const Icon = tool.icon;
                    const isExpanded = expandedTool === `${category.category}-${tool.name}`;
                    return (
                      <div key={tool.name}>
                        <button
                          onClick={() => setExpandedTool(isExpanded ? null : `${category.category}-${tool.name}`)}
                          className="w-full px-6 py-4 flex items-start gap-3 hover:bg-slate-800/30 transition-colors text-left"
                        >
                          <Icon className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{tool.name}</h4>
                            <p className="text-slate-400 text-sm mt-1">{tool.description}</p>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>

                        {isExpanded && (
                          <div className="px-6 py-4 bg-slate-800/20 border-t border-slate-700 space-y-3">
                            <h5 className="text-white font-medium text-sm">How to Use:</h5>
                            <ol className="space-y-2">
                              {tool.howTo.map((step, idx) => (
                                <li key={idx} className="flex gap-3 text-sm text-slate-300">
                                  <span className="bg-slate-700 text-slate-300 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-medium">{idx + 1}</span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-10 pt-6 border-t border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              q: 'How do I connect my social media accounts?',
              a: 'Go to "Connected Channels" under Social Media Management, click "Connect Account," and authorize with your social platform.'
            },
            {
              q: 'Can I schedule posts across multiple platforms?',
              a: 'Yes! Connect all your accounts, then create content that can be scheduled simultaneously across all connected channels.'
            },
            {
              q: 'How do I track campaign performance?',
              a: 'Check Analytics under Website Management to see traffic, or go to CRM & Marketing Hub for email and lead metrics.'
            },
            {
              q: 'What\'s the difference between AI Video Studio and Streaming TV Scripts?',
              a: 'Streaming TV Scripts generates optimized 15/30/60-second ad scripts, while AI Video Studio creates actual videos from scripts.'
            }
          ].map((faq, idx) => (
            <div key={idx} className="border border-slate-700 rounded-lg p-4 bg-slate-900/50 hover:bg-slate-900 transition-colors">
              <p className="text-white font-medium mb-2">{faq.q}</p>
              <p className="text-slate-400 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}