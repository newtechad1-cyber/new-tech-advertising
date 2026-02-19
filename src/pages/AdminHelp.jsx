import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AdminGuard from '../components/auth/AdminGuard';
import { createPageUrl } from '../utils';
import {
  BookOpen, Calendar, DollarSign, Users, FileText, TrendingUp,
  ChevronDown, ChevronUp, CheckCircle, AlertCircle, Sparkles,
  ArrowLeft, Star, Clock, Zap, Eye, Search, Filter, LayoutDashboard
} from 'lucide-react';

const sections = [
  {
    id: 'overview',
    icon: LayoutDashboard,
    color: 'bg-slate-100 text-slate-700',
    title: 'Admin Hub Overview',
    summary: 'Your central command center for managing all client operations.',
    steps: [
      {
        title: 'Accessing the Admin Hub',
        content: 'Go to Admin Dashboard from your navigation. You must be logged in as an admin to see this page. If you are not an admin, you will be redirected to the client dashboard automatically.'
      },
      {
        title: 'The Three Main Sections',
        content: 'The hub has three clickable stat cards at the top:\n\n• Scheduling Queue — content submissions waiting to be scheduled or posted\n• Upsell Queue — upgrade requests from clients or recommendations you have sent\n• Client Management — a list of all registered client accounts\n\nClick any card to enter that section. Use the "← Back to Hub" button to return.'
      },
      {
        title: 'Management Pages',
        content: 'Below the stat cards are quick links to:\n\n• Leads Dashboard — manage incoming leads from the website\n• Blog Management — write and publish blog articles\n\nThese open as separate pages.'
      },
      {
        title: 'Priority Color Dots',
        content: 'Throughout the admin panel you will see colored dots:\n\n🟣 Purple dot = $297 DFY (Done For You) — highest priority, do these first\n🔵 Blue dot = $197 Collaborative — standard priority\n⚫ Grey dot = DIY tier — lowest priority'
      }
    ]
  },
  {
    id: 'scheduling',
    icon: Calendar,
    color: 'bg-blue-100 text-blue-700',
    title: 'Scheduling Queue',
    summary: 'Review, approve, and schedule client content submissions.',
    steps: [
      {
        title: 'What is the Scheduling Queue?',
        content: 'When a client submits a post through their dashboard, it lands here. Your job is to review the content, make sure it is ready to post, and then mark it scheduled once you have put it into your scheduling tool.'
      },
      {
        title: 'Filtering the Queue',
        content: 'Use the three dropdowns at the top right to narrow the list:\n\n• Status — filter by Pending, Scheduled, or Posted\n• Package — filter by $197 Collaborative or $297 DFY clients\n• Channel — filter by Facebook, Instagram, Twitter, LinkedIn, or TikTok\n\nSubmissions are automatically sorted by priority (purple first, then blue).'
      },
      {
        title: 'Reading a Submission Card',
        content: 'Each card shows:\n\n• Colored priority dot and package badge\n• Current status badge (pending / scheduled / posted)\n• Quality control badge (Ready / Needs Clarification / Recommend Upgrade)\n• The client email and date submitted\n• Content type (Image Post, Video Post, Text Only)\n• The full post text\n• Which social channels they requested\n• Their scheduling preference (ASAP, specific date, or team decides)'
      },
      {
        title: 'Setting Quality Status',
        content: 'Before scheduling, use the Quality Control buttons on each card:\n\n✅ Ready — content is good to go, schedule it as-is\n❓ Needs Clarification — something is unclear, you need to contact the client\n✨ Recommend Upgrade — the post could be better with paid improvements\n\nClick the appropriate button. The badge on the card updates immediately.'
      },
      {
        title: 'Marking a Post as Scheduled',
        content: 'Once you have put the post into your scheduling tool (e.g., Hootsuite, Buffer, Meta Business Suite):\n\n1. Find the submission in the queue\n2. Click "Mark Scheduled" (blue button)\n3. The status badge changes from Pending to Scheduled\n\nThe client will see the updated status in their dashboard.'
      },
      {
        title: 'Marking a Post as Posted',
        content: 'After the post actually goes live on social media:\n\n1. Find the submission (filter by Scheduled to find it faster)\n2. Click "Mark Posted" (green button)\n3. Status changes to Posted\n\nThis gives clients visibility that their content has been published.'
      },
      {
        title: 'Recommending an Upgrade',
        content: 'If a post could be improved with a paid upgrade:\n\n1. Click "Recommend Upgrade" on the submission card\n2. A form expands below the card\n3. Select the upgrade type:\n   • Rewrite Text — you rewrite the copy for them\n   • Edit Image — you improve their image\n   • Create Video — you turn their post into a video\n4. Write your reason (the client will see this)\n5. Enter a price in dollars\n6. Click "Send Recommendation"\n\nThe client will see this upgrade offer in their dashboard and can approve or decline it.'
      }
    ]
  },
  {
    id: 'upsells',
    icon: DollarSign,
    color: 'bg-purple-100 text-purple-700',
    title: 'Upsell Queue',
    summary: 'Track upgrade requests and recommendations from start to completion.',
    steps: [
      {
        title: 'What is the Upsell Queue?',
        content: 'This queue tracks all per-post upgrades — both ones you recommended to clients and ones clients requested themselves. It lets you see where each upgrade stands so nothing falls through the cracks.'
      },
      {
        title: 'Understanding Upgrade Statuses',
        content: 'Each upsell card has a status badge:\n\n🔵 Client Requested — the client asked for an upgrade on their own\n🟡 Awaiting Approval — you recommended it, waiting for client to approve or decline\n🟢 Approved - In Progress — client said yes, you need to do the work\n⚫ Completed — upgrade is done and delivered'
      },
      {
        title: 'Filtering Upsells',
        content: 'Use the filter buttons at the top:\n\n• All — shows everything\n• Client Requested — only requests initiated by clients\n• Approved — only upgrades approved and needing your attention\n\nFocus on "Approved" first — these clients have paid and are waiting for delivery.'
      },
      {
        title: 'Reading an Upsell Card',
        content: 'Each card shows:\n\n• The upgrade type (Rewrite Text, Edit Image, Create Video)\n• Client email and last updated date\n• A preview of the original post text\n• Your recommendation note (if you suggested it)\n• The price agreed upon'
      },
      {
        title: 'Completing an Upgrade',
        content: 'Once you have finished the upgrade work and delivered it to the client:\n\n1. Find the card with status "Approved - In Progress"\n2. Click the green "Mark Completed" button\n3. The status moves to Completed\n\nTip: Keep notes outside this system (e.g., in a Google Doc or email) on exactly what was delivered for each upgrade.'
      }
    ]
  },
  {
    id: 'clients',
    icon: Users,
    color: 'bg-green-100 text-green-700',
    title: 'Client Management',
    summary: 'View and look up all registered client accounts.',
    steps: [
      {
        title: 'What is Client Management?',
        content: 'This is your directory of all non-admin users who have created accounts in the system. It shows their name, email, business (if they completed onboarding), and whether they have finished the onboarding process.'
      },
      {
        title: 'Searching for a Client',
        content: 'Use the search box at the top right. You can search by:\n\n• Client full name\n• Client email address\n\nThe list filters in real time as you type. The total count next to the search box updates accordingly.'
      },
      {
        title: 'Reading a Client Card',
        content: 'Each client card shows:\n\n• Full name and email\n• Package badge (their subscription tier)\n• Onboarding status:\n   ✅ Green "Onboarded" = they completed setup\n   🟡 Yellow "Onboarding" = still in progress\n• Business name (if they filled it in during onboarding)\n• Date they joined'
      },
      {
        title: 'Onboarding Status Explained',
        content: '"Onboarding" (yellow) means the client has not completed all setup steps in their dashboard. This is normal for new clients.\n\n"Onboarded" (green) means they finished all steps and their profile is complete.\n\nIf a client has been stuck in onboarding for a while, it is worth reaching out to them to help them finish setup.'
      }
    ]
  },
  {
    id: 'leads',
    icon: TrendingUp,
    color: 'bg-orange-100 text-orange-700',
    title: 'Leads Dashboard',
    summary: 'Manage and follow up on incoming leads from the website.',
    steps: [
      {
        title: 'Accessing the Leads Dashboard',
        content: 'From the Admin Hub, click the "Leads Dashboard" card in the Management Pages section. This opens a separate page.'
      },
      {
        title: 'Lead Sources',
        content: 'Leads come from multiple places on the website:\n\n• Contact page form\n• ADA Accessibility intake forms\n• Streaming TV intake forms\n• Website Rebuild intake forms\n• Signup modals on landing pages\n\nEach lead type may have different fields filled in depending on where they came from.'
      },
      {
        title: 'Lead Statuses',
        content: 'Leads move through three statuses:\n\n🆕 New — just came in, has not been contacted yet\n📞 Contacted — you have reached out to them\n✅ Converted — they became a paying client\n\nUpdate the status after each interaction to keep the pipeline accurate.'
      },
      {
        title: 'Lead Scoring (AI)',
        content: 'Some leads have an AI-calculated score from 0 to 100. A higher score means the system thinks this lead is more likely to convert based on their form responses.\n\nUse this as a guide for prioritization — high-score leads deserve faster follow-up, but always use your own judgment too.'
      }
    ]
  },
  {
    id: 'blog',
    icon: FileText,
    color: 'bg-yellow-100 text-yellow-700',
    title: 'Blog Management',
    summary: 'Create, edit, and publish blog articles on the website.',
    steps: [
      {
        title: 'Accessing Blog Management',
        content: 'From the Admin Hub, click "Blog Management" in the Management Pages section. This opens the blog editor page.'
      },
      {
        title: 'Creating a New Post',
        content: 'Click the "New Post" or similar button. Fill in:\n\n• Title — the main headline of the article\n• Slug — the URL-friendly version (e.g., "how-to-get-more-customers"). Use dashes, no spaces\n• Excerpt — a short 1-2 sentence summary shown in the blog list\n• Content — the full article body (supports Markdown formatting)\n• Image URL — a link to a header image for the post\n• Category — helps organize posts by topic\n• Author — who wrote it\n• Published Date — when it should appear as published\n• Tags — keywords for the post\n• Meta Description — SEO description (keep under 160 characters)'
      },
      {
        title: 'Markdown Basics for Content',
        content: 'The content field uses Markdown. Here are the basics:\n\n# Heading 1\n## Heading 2\n### Heading 3\n\n**Bold text**\n*Italic text*\n\n- Bullet item\n- Another item\n\n1. Numbered item\n2. Second item\n\n[Link text](https://example.com)'
      },
      {
        title: 'Editing an Existing Post',
        content: 'Find the post in the list and click to open it. Make your changes and save. The post updates live on the website immediately after saving.'
      },
      {
        title: 'SEO Tips',
        content: 'For each post:\n\n• Use a keyword phrase in the title (e.g., "Local TV Ads for Small Businesses")\n• Keep the meta description under 160 characters and include the keyword\n• Use a slug that matches the title (no capital letters, no spaces)\n• Add relevant tags to help organize and surface the post'
      }
    ]
  },
  {
    id: 'tips',
    icon: Star,
    color: 'bg-amber-100 text-amber-700',
    title: 'Daily Workflow Tips',
    summary: 'Recommended order of operations for a smooth daily routine.',
    steps: [
      {
        title: 'Suggested Morning Routine',
        content: '1. Open Admin Hub — check the three stat numbers\n2. Go to Scheduling Queue → filter by "Pending" → review quality, mark statuses\n3. Go to Upsell Queue → filter by "Approved" → work on any paid upgrades first\n4. Check Leads Dashboard for any new leads overnight\n5. Return to Scheduling Queue → mark posts as Scheduled after adding to your tool'
      },
      {
        title: 'Priority Order',
        content: 'Always work in this order:\n\n1. 🟣 Purple / $297 DFY clients — they pay more and expect faster service\n2. 🔵 Blue / $197 Collaborative clients — standard turnaround\n3. ⚫ DIY clients — assist only if they have specific requests\n\nWithin each tier, work oldest submissions first (the queue is pre-sorted for you).'
      },
      {
        title: 'When to Recommend an Upgrade',
        content: 'Good reasons to recommend a paid upgrade:\n\n• The post text is too short, vague, or has grammar issues\n• The image is low quality or irrelevant to the message\n• A video would perform significantly better for that type of content\n• The client submitted text-only but their audience responds better to visuals\n\nAlways write a clear, friendly reason — the client sees your note.'
      },
      {
        title: 'When to Mark "Needs Clarification"',
        content: 'Use this when:\n\n• The post references something you do not understand (e.g., an internal promotion)\n• The image is missing but listed as an image post\n• The scheduling request has a specific date that has already passed\n• The channels selected do not match the content type\n\nAfter marking it, reach out to the client directly (email or phone) to clarify. Once resolved, update the quality status to Ready.'
      },
      {
        title: 'Keeping the Queue Clean',
        content: 'At the end of each day:\n\n• Any post you have scheduled in your tool → click "Mark Scheduled"\n• Any post that went live today → click "Mark Posted"\n• Any completed upgrades → click "Mark Completed"\n\nThis keeps client dashboards accurate and prevents the queue from getting backlogged.'
      }
    ]
  }
];

function SectionCard({ section }) {
  const [open, setOpen] = useState(false);
  const [openStep, setOpenStep] = useState(null);
  const Icon = section.icon;

  return (
    <Card className="overflow-hidden">
      <button
        className="w-full text-left p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${section.color}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{section.title}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{section.summary}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Badge variant="outline" className="text-xs">{section.steps.length} topics</Badge>
          {open ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </div>
      </button>

      {open && (
        <div className="border-t">
          {section.steps.map((step, idx) => (
            <div key={idx} className="border-b last:border-b-0">
              <button
                className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                onClick={() => setOpenStep(openStep === idx ? null : idx)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <span className="font-medium text-slate-800">{step.title}</span>
                </div>
                {openStep === idx
                  ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
              </button>
              {openStep === idx && (
                <div className="px-6 pb-5 ml-10">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    {step.content.split('\n').map((line, i) => (
                      <p key={i} className={`text-sm text-slate-700 ${line === '' ? 'mt-3' : 'leading-relaxed'}`}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default function AdminHelp() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b sticky top-0 z-20">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-slate-900">Help & Tutorials</h1>
                <p className="text-xs text-slate-500">Admin Panel Guide</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => window.location.href = createPageUrl('AdminDashboard')}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Admin Hub
            </Button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">Welcome, Wendy! 👋</h2>
            <p className="text-blue-100 leading-relaxed">
              This guide walks you through every feature in the Admin Panel — from reviewing client posts to managing leads and publishing blog articles.
              Click any section to expand it, then click a topic to read the instructions.
            </p>
          </div>

          {/* Quick Nav */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {sections.map(s => {
              const Icon = s.icon;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all text-sm font-medium text-slate-700"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                >
                  <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${s.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {s.title}
                </a>
              );
            })}
          </div>

          {/* Sections */}
          {sections.map(section => (
            <div key={section.id} id={section.id}>
              <SectionCard section={section} />
            </div>
          ))}

          <div className="text-center py-6 text-slate-400 text-sm">
            Questions? Reach out to the tech team. This guide is updated as new features are added.
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}