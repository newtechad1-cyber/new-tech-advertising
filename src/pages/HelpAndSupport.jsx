import React, { useState } from 'react';
import {
  ChevronDown, Zap, BarChart3, Globe, Shield, BookOpen, Lightbulb,
  Share2, Mail, Users, Image, Video, StickyNote, BrainCircuit,
  Settings, CalendarDays, Cpu, Tv, TrendingUp, Briefcase,
  FileText, ShoppingBag, RefreshCw, MonitorPlay, MapPin, HelpCircle
} from 'lucide-react';

const SECTIONS = [
  {
    id: 'website',
    label: 'Website Management',
    icon: Globe,
    color: 'border-sky-500',
    iconColor: 'text-sky-500',
    tools: [
      { name: 'Blog Management', description: 'Create, edit, and publish blog posts with AI-assisted writing, SEO scoring, image uploads, and video embeds. Supports categories, tags, featured images, and meta descriptions.' },
      { name: 'Products / Store', description: 'Manage your product catalog — add items, set prices, upload images, and organize by category. Connects to your storefront.' },
      { name: 'Ebook Writer', description: 'Write and organize long-form guides and ebooks chapter by chapter. Great for lead magnets and downloadable resources.' },
      { name: 'Analytics', description: 'View your Google Analytics data directly in the dashboard — sessions, page views, top pages, traffic sources, and conversions.' },
      { name: 'Portfolio', description: 'Manage your work showcase — add projects, upload images, set categories, and display client results.' },
      { name: 'Notes', description: 'Internal scratch pad for ideas, campaign planning, reminders, and team notes. Private to admins.' },
    ]
  },
  {
    id: 'social',
    label: 'Social Media Management',
    icon: Share2,
    color: 'border-pink-500',
    iconColor: 'text-pink-500',
    tools: [
      { name: 'AI Video Studio', description: 'Generate professional AI avatar videos from a script. Choose from voice, avatar, background and captions. Uses HeyGen integration to produce finished videos.' },
      { name: 'Streaming TV Scripts', description: 'AI-generates 30-second streaming TV ad scripts tailored to each service page and industry. Output includes hook, body, and CTA. Feed directly into video production.' },
      { name: 'Website Video Manager', description: 'Auto-generates and publishes videos for existing website page placeholders. Scans for pages missing video content and creates HeyGen video assets automatically.' },
      { name: 'Connected Channels', description: 'Connect and manage social media accounts — Facebook, Instagram, LinkedIn, TikTok. Authorize OAuth connections and manage posting permissions.' },
      { name: 'Images', description: 'Upload, organize, and manage your media image library used across social posts, blog articles, and email campaigns.' },
      { name: 'Videos', description: 'Manage video asset records — embed URLs, thumbnails, related pages, and publish status for all video content on the platform.' },
    ]
  },
  {
    id: 'email',
    label: 'Email Marketing',
    icon: Mail,
    color: 'border-blue-500',
    iconColor: 'text-blue-500',
    tools: [
      { name: 'Email Marketing', description: 'Create and send broadcast emails to your subscriber list. Rich text editor, subject line preview, send scheduling, and delivery tracking.' },
      { name: 'Autoresponder', description: 'Build automated email sequences triggered by subscriber actions. Set delays between emails, customize by segment, and monitor open rates.' },
      { name: 'Subscribers', description: 'View and manage your full subscriber list — filter by status, export contacts, manually add subscribers, and view engagement history.' },
    ]
  },
  {
    id: 'crm',
    label: 'CRM & Marketing',
    icon: Users,
    color: 'border-green-500',
    iconColor: 'text-green-500',
    tools: [
      { name: 'CRM & Marketing Hub', description: 'Full CRM interface — manage leads, clients, proposals, and campaigns. View pipeline stage, assign tasks, track follow-ups and deal values.' },
      { name: 'Leads Dashboard', description: 'View all leads captured from funnel pages, blog articles, case studies, and authority guides. Filter by status, source, or service. Send individual follow-up emails from the 4-step sequence. Export to CSV. Update lead status (New → Contacted → Consultation Scheduled → Converted).' },
      { name: 'Lead Funnel Pages', description: 'Service-specific landing pages built to convert visitors into leads. Each funnel includes a hero, explainer video section, free guide download form, case studies, and final CTA. Available funnels: Streaming TV Advertising, ADA Compliance, Local SEO, AI Social Media. Exit intent popups and sticky CTA bars are included automatically.' },
      { name: 'Lead Intel Dashboard', description: 'Analytics view of lead pipeline — source attribution, service interest breakdown, location data, and conversion funnel metrics.' },
      { name: 'Operations Hub', description: 'End-to-end workflow for converting prospects to clients — intake → proposal → project → fulfillment. Tracks all active client work in one place.' },
    ]
  },
  {
    id: 'ai-content',
    label: 'AI Content Engine',
    icon: BrainCircuit,
    color: 'border-violet-500',
    iconColor: 'text-violet-500',
    tools: [
      { name: 'System Settings', description: 'Configure global business info, AI tone-of-voice, brand DNA, industry focus, and default CTA destinations used across all AI-generated content.' },
      { name: 'Weekly Authority Plans', description: 'AI generates a weekly content authority plan — pillar topics, cluster articles, and content priorities based on your industry and goals. Drives the content calendar.' },
      { name: 'Content Calendar & Queue', description: 'View all planned, in-progress, and published content across blog, video, social, and email. Drag to reorder, change status, and assign to channels.' },
      { name: 'Trial Onboarding Queue', description: 'Review and configure new trial account submissions. See incoming business info, trigger intelligence generation, create business profiles, and provision dashboard access.' },
      { name: 'AI Operations', description: 'Monitor all AI tasks — active jobs, budget usage, cost ledger per function, agent memory, and performance history. Debug failed tasks and review outputs.' },
      { name: 'Authority Packs', description: 'View all Authority Packs — each contains a pillar page, cluster articles, tool page, lead magnet guide, city pages, video topics, email sequences, and social posts. A complete topical authority system per service.' },
      { name: 'City Page Generator', description: 'Generate SEO-optimized {service}-in-{city} landing pages with AI. Supports 5 services across 100 major US cities. Pages are enriched with local market data, FAQs, case study sections, and CTAs. Daily automation generates 5–10 pages automatically.' },
      { name: 'Case Studies', description: 'Create case studies from client results. AI auto-generates a companion blog article, video script, social posts, and SEO metadata from each case study. Publish to /case-studies.' },
      { name: 'Authority Blog Engine', description: 'Auto-generate SEO blog articles from a service × industry × city matrix. Each article includes a video script, image prompts, FAQs, and internal links. Batch-generate or create one at a time.' },
      { name: 'Content Multiplication Engine', description: 'Feed one source (blog article, case study, service page) and generate 9 formats automatically: full blog article, YouTube script, 3 TikTok scripts, LinkedIn post, 5 Facebook posts, email newsletter, lead magnet content, video prompts, and image prompts. Weekly automation runs every Monday.' },
      { name: 'Agent Architecture', description: 'Visual map of the 22-agent event-driven system — shows how agents trigger each other, what entities they read/write, and what functions they invoke. For debugging and understanding the AI pipeline.' },
      { name: 'Workflow Map', description: 'Master reference map of every page, entity, agent, function, and automation in the platform and how they connect. Use for architecture decisions and onboarding.' },
    ]
  },
  {
    id: 'seo',
    label: 'Programmatic SEO',
    icon: MapPin,
    color: 'border-emerald-500',
    iconColor: 'text-emerald-500',
    tools: [
      { name: 'How It Works', description: 'Initialize the PageGenerationQueue with all 500 city × service combinations using initializeProgrammaticSEOQueue. The daily automation then generates 5–10 pages per day automatically at 3 AM UTC. Each page pulls from IndustryIntel + LocalMarketIntel to produce unique, 900–1,400 word location pages.' },
      { name: 'Page Generation Queue', description: 'Tracks all 500 page slots — queued, in-progress, completed, or failed. Tiered by market size (Tier 1: major cities first). Monitor from the Programmatic SEO Dashboard.' },
      { name: 'Data Inputs', description: 'IndustryIntel provides service-specific pain points, content angles, and keyword patterns. LocalMarketIntel provides city-level competition, local intents, and seasonal patterns. CTAOffer records control the conversion messaging on each page.' },
      { name: 'Expected Results', description: 'Conservative estimate: 25,000–100,000+ monthly organic visits within 6–12 months with 500 pages live. Traffic builds gradually, compounds after 50+ pages rank, and earns traffic for years.' },
    ]
  },
];

const FAQS = [
  { q: 'How do leads get captured from funnel pages?', a: 'When a visitor fills out the guide download form on any funnel page (/FunnelPage?service=...), their info is saved to the Leads entity. The onLeadCreated automation fires immediately — triggering AI lead scoring and sending Email #1 in the follow-up sequence.' },
  { q: 'What triggers the follow-up email sequence?', a: 'New leads automatically receive Email #1 (Welcome + Guide) via the "Lead Follow-Up Email Sequence" entity automation. Emails #2–4 (Case Study, 3 Mistakes, Free Consultation) can be sent manually from the Leads Dashboard or automated with additional scheduled tasks.' },
  { q: 'How does the Content Multiplication Engine work?', a: 'Go to ContentEngine, paste or select source content, and click Generate. The multiplyContent backend function calls OpenAI to produce all 9 formats in one run. The weekly automation also runs every Monday morning to process any new source content automatically.' },
  { q: 'How do I generate a city landing page?', a: 'Go to Admin Hub → City Page Generator. Select a service and city, click Generate. The generateEnrichedLocationPage function pulls from IndustryIntel + LocalMarketIntel to create a unique 1,000+ word page. For bulk generation, initialize the queue and let the daily automation handle it.' },
  { q: 'How does the Trial Onboarding Queue work?', a: 'When someone submits the /start form, a TrialAccount is created and the onTrialSubmitted automation fires. It generates a BusinessIntelProfile and WeeklyMarketingPlan automatically. The Onboarding Queue shows all pending trials and lets admins review, edit, and provision dashboard access.' },
  { q: 'How do I connect social media accounts?', a: 'Go to Admin Hub → Connected Channels. Use the Meta Connect flow for Facebook/Instagram. LinkedIn uses the app connector OAuth. Once connected, posts scheduled in the Content Calendar are published automatically.' },
  { q: 'What is an Authority Pack?', a: 'An Authority Pack is a complete topical authority system for one service — it bundles a pillar page, 5–10 cluster articles, a tool page, a downloadable guide, city landing pages, video scripts, email sequences, and social posts. Each pack targets one keyword cluster to dominate that topic in search.' },
  { q: 'How do I see what the AI is spending on credits?', a: 'Go to Admin Hub → AI Operations → Cost Ledger tab. Every function invocation that uses AI is logged with the model used, token count, and estimated cost. You can also see budget limits and remaining balance per agent.' },
  { q: 'Can I customize the funnel pages per service?', a: 'Yes — the SERVICE_CONFIG object in FunnelPage.jsx defines the headline, subheadline, features, guide title, and color for each service slug. Add a new key to support additional services. The exit intent popup and sticky CTA bar are included automatically on all funnel pages.' },
  { q: 'What happens after a lead books a consultation?', a: 'Update the lead status to "Consultation Scheduled" in the Leads Dashboard. This is tracked in conversion metrics. After the call, move to "Proposal Sent" and create a proposal in the Operations Hub. Converted leads get status "Won."' },
];

export default function HelpAndSupport() {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-violet-900 text-white py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <HelpCircle className="w-10 h-10 text-violet-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Admin Hub — Help & Support</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">Complete guide to every tool, feature, and automation in the NTA platform.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Quick Nav */}
        <div className="flex flex-wrap gap-2 mb-12">
          {SECTIONS.map(s => (
            <a key={s.id} href={`#${s.id}`} className="bg-white border border-slate-200 rounded-full px-4 py-1.5 text-sm font-medium text-slate-700 hover:border-violet-400 hover:text-violet-700 transition-colors shadow-sm">
              {s.label}
            </a>
          ))}
          <a href="#faqs" className="bg-white border border-slate-200 rounded-full px-4 py-1.5 text-sm font-medium text-slate-700 hover:border-violet-400 hover:text-violet-700 transition-colors shadow-sm">FAQs</a>
        </div>

        {/* Module Sections */}
        {SECTIONS.map(section => {
          const Icon = section.icon;
          return (
            <section key={section.id} id={section.id} className="mb-12 scroll-mt-6">
              <div
                className="flex items-center justify-between cursor-pointer mb-4"
                onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
              >
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <Icon className={`w-7 h-7 ${section.iconColor}`} />
                  {section.label}
                </h2>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedSection === section.id ? 'rotate-180' : ''}`} />
              </div>

              {(expandedSection === section.id || expandedSection === null) && (
                <div className="grid md:grid-cols-2 gap-4">
                  {section.tools.map(tool => (
                    <div key={tool.name} className={`bg-white rounded-xl shadow-sm p-5 border-l-4 ${section.color} hover:shadow-md transition-shadow`}>
                      <h3 className="font-bold text-slate-900 mb-2">{tool.name}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{tool.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}

        {/* Lead Funnel Quick Reference */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <TrendingUp className="w-7 h-7 text-orange-500" />
            Lead Funnel — How Visitors Become Clients
          </h2>
          <div className="bg-white rounded-xl shadow-sm p-8 border-l-4 border-orange-500">
            <ol className="space-y-4 text-slate-700">
              {[
                ['Visitor lands on content', 'Blog article, case study, authority guide, city page, or video page — all include a sticky CTA bar and download guide CTA.'],
                ['Exit intent popup fires', 'If the visitor tries to leave, a popup offers the free guide with a compact lead capture form.'],
                ['Lead fills out guide form', 'Name, business name, email, phone, city are saved to the Leads entity. Source page is tracked automatically.'],
                ['Automation triggers', 'onLeadCreated fires → AI scores the lead + Email #1 (Welcome + Guide) is sent automatically.'],
                ['Admin works the lead', 'From the Leads Dashboard, view the lead, update status, and send follow-up Emails #2–4 manually or via automation.'],
                ['Lead books consultation', 'Status updated to "Consultation Scheduled." Admin moves to Operations Hub to create proposal.'],
                ['Lead converts', 'Status set to "Won." Client is onboarded via the Trial system or Operations Hub.'],
              ].map(([step, desc], i) => (
                <li key={i} className="flex gap-4">
                  <span className="font-bold text-orange-500 flex-shrink-0 w-5">{i + 1}.</span>
                  <span><strong>{step}:</strong> {desc}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Pro Tips */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <Lightbulb className="w-7 h-7 text-amber-500" />
            Pro Tips
          </h2>
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-8">
            <ul className="space-y-4 text-slate-700">
              {[
                ['Use the Content Multiplication Engine weekly', 'Every new blog post or case study can instantly become 9 pieces of content. Run it every time new source content is published.'],
                ['Keep IndustryIntel & LocalMarketIntel up to date', 'All AI-generated pages pull from these records. Richer data = better content = higher rankings.'],
                ['Monitor the Leads Dashboard daily', 'Follow up within 24 hours of lead capture. Leads contacted within 1 hour convert 7x more often.'],
                ['Use funnel page source tracking', 'Each funnel page logs the source (funnel_service field). Use this in the Leads Dashboard to see which pages drive the most leads.'],
                ['Start city pages with Tier 1 markets', 'Initialize the queue and let the daily automation handle bulk generation. Check the SEO Dashboard every morning for failures.'],
                ['Run the 4-email sequence for every lead', 'The 4 follow-up emails are pre-written. Send them from the Leads Dashboard in 2–3 day intervals for best results.'],
              ].map(([tip, desc]) => (
                <li key={tip} className="flex gap-3">
                  <span className="text-amber-500 font-bold mt-0.5">✓</span>
                  <span><strong>{tip}:</strong> {desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQs */}
        <section id="faqs" className="mb-12 scroll-mt-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-rose-500" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                >
                  <span className="font-semibold text-slate-900">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ml-4 ${expandedFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {expandedFaq === i && (
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-slate-700 leading-relaxed text-sm">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Support CTA */}
        <section className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl shadow-lg p-10 text-center text-white">
          <h2 className="text-3xl font-bold mb-3">Need Help?</h2>
          <p className="text-lg text-violet-100 mb-6">For technical issues, setup assistance, or feature requests — reach out to the support team.</p>
          <a href="mailto:support@newtechadvertising.com" className="inline-block bg-white text-violet-700 font-semibold px-8 py-3 rounded-xl hover:bg-violet-50 transition-colors">
            Contact Support
          </a>
        </section>
      </div>
    </div>
  );
}