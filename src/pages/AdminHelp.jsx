import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import AdminNav from '@/components/nav/AdminNav';
import {
  BookOpen, ChevronDown, ChevronUp, Search,
  LayoutDashboard, Brain, Cpu, Bell, Target, Users, Briefcase,
  UserCog, FileText, FolderKanban, CheckSquare, TrendingUp,
  Share2, Bot, Globe, CreditCard, Settings, DollarSign,
  Zap, AlertCircle, Star, Shield, BarChart2, RefreshCw, Video
} from 'lucide-react';

const ALL_SECTIONS = [
  // ─── GETTING STARTED ────────────────────────────────────────────────────────
  {
    id: 'getting-started',
    category: 'Getting Started',
    icon: Star,
    color: 'bg-violet-100 text-violet-700',
    title: 'New Employee Orientation',
    summary: 'Start here — understand the platform, your role, and how everything connects.',
    steps: [
      {
        title: 'What is New Tech Advertising (NTA)?',
        content: `NTA is a full-service AI-powered marketing platform for small businesses. We provide:

• Social media content creation & scheduling
• AI-generated blog articles and SEO pages
• Streaming TV advertising campaigns
• Website rebuilds and ADA compliance services
• Reseller/white-label partnerships

As an admin, you manage all client accounts, content pipelines, fulfillment, billing, and internal operations through this panel.`
      },
      {
        title: 'How to Log In as Admin',
        content: `1. Go to newtechadvertising.com and log in with your credentials.
2. You will be redirected to the Admin Dashboard automatically if your account role is "admin".
3. If you are taken to a client dashboard instead, your account role has not been set correctly — contact your manager.

The left sidebar (dark navy) is your main navigation. It is always visible on desktop.`
      },
      {
        title: 'Understanding the Navigation Sidebar',
        content: `The sidebar is organized into 5 groups:

📊 Executive — Big-picture dashboards: revenue, AI copilot, KPIs
⚙️ Operations — Day-to-day work: alerts, sales, clients, proposals, onboarding, fulfillment, tasks
📝 Content — Content queues, studio, AI automation, video
🧠 Intelligence — Market intel, AI signals, orchestrator, optimizer
🖥️ Platform — Blog, social accounts, chatbots, billing, settings

Start each day in Executive → Executive Dashboard for a full business overview, then move to Operations → Alert Center.`
      },
      {
        title: 'Client Tiers & Priority Colors',
        content: `Clients are on different service tiers. You will see colored indicators throughout the system:

🟣 Purple = $297 DFY (Done For You) — highest tier, highest priority, fastest turnaround
🔵 Blue = $197 Collaborative — standard tier, client provides content
⚫ Grey = DIY — self-service tier, minimal admin involvement

Always prioritize purple clients first, then blue, then grey. This applies to content queues, support, and fulfillment tasks.`
      },
      {
        title: 'Daily Workflow Overview',
        content: `Recommended daily routine:

Morning (first 30 min):
1. Executive Dashboard → review overnight KPIs
2. Alert Center → address any flagged items
3. Sales Alerts → follow up on hot leads

Mid-morning:
4. Content Queue → review pending posts, mark statuses
5. Fulfillment → check task deadlines

Afternoon:
6. Clients → respond to any support/approval requests
7. Proposals → follow up on pending proposals
8. Onboarding → check stuck clients

End of day:
9. Mark any content as Scheduled/Posted
10. Complete any upgrades and log them`
      }
    ]
  },

  // ─── EXECUTIVE DASHBOARD ────────────────────────────────────────────────────
  {
    id: 'executive',
    category: 'Executive',
    icon: LayoutDashboard,
    color: 'bg-slate-100 text-slate-700',
    title: 'Executive Dashboard',
    summary: 'The top-level business overview — revenue, client health, operations, and growth.',
    steps: [
      {
        title: 'What the Executive Dashboard Shows',
        content: `This is the owner/executive-level view of the entire business. It aggregates data from every module into one screen. Key sections:

• Summary Cards — total MRR, active clients, churn risk count, pipeline value, open tasks, fulfillment load, reviews, and SLA score
• AI Copilot Summary — AI-generated briefing with risks, opportunities, and recommended actions
• Revenue Overview — MRR trends, forecast, and pipeline
• Client Health Portfolio — every client scored by health (green/yellow/red)
• Renewals Radar — clients approaching renewal in the next 30/60/90 days
• Operations Risk — overdue tasks, SLA breaches, and capacity alerts
• Account Spotlights — accounts needing immediate attention
• Owner Action Queue — prioritized list of things only the owner needs to decide
• Fulfillment Load — team bandwidth and task distribution
• Communication Watchlist — client threads with no recent reply
• Strategy Readiness — strategy reviews due or overdue`
      },
      {
        title: 'Reading the Summary Cards',
        content: `The top row of cards gives you 8 key numbers at a glance:

• MRR (Monthly Recurring Revenue) — total monthly subscription revenue
• Active Clients — clients with active subscriptions
• Churn Risk — clients flagged by AI as likely to cancel
• Pipeline — total value of open proposals
• Open Tasks — unfulfilled tasks across all clients
• Fulfillment Load — % capacity across the team
• Reviews This Month — new Google/Yelp reviews collected
• SLA Score — % of service level agreements met

Click any card to go directly to that section of the system.`
      },
      {
        title: 'Client Health Portfolio',
        content: `Every client gets a health score (0–100) calculated from:
• Content delivery rate (are posts going out on time?)
• Engagement trends (are their posts performing?)
• Support ticket volume (are they having problems?)
• Payment status (are they current?)
• Communication frequency (have we talked recently?)

🟢 Green (70–100) = healthy
🟡 Yellow (40–69) = at risk, needs attention
🔴 Red (0–39) = churn risk, escalate immediately

Sort by score ascending to see who needs attention first.`
      },
      {
        title: 'Owner Action Queue',
        content: `This section shows items that specifically require an executive decision — things the team cannot handle on their own:

• Proposal approvals above a certain dollar threshold
• Client escalations
• Churn risk accounts needing a personal call
• Contract renewals requiring negotiation
• Revenue opportunities flagged by AI

Work through this list daily. Items are sorted by urgency (Critical → High → Medium).`
      },
      {
        title: 'Communication Watchlist',
        content: `Shows client conversations where:
• The last message was from the client and has not been replied to in 24+ hours
• A thread has been idle for 7+ days despite an open support ticket

These represent relationship risks. Click any thread to go directly to the messaging view.`
      }
    ]
  },

  // ─── AI COPILOT ─────────────────────────────────────────────────────────────
  {
    id: 'copilot',
    category: 'Executive',
    icon: Brain,
    color: 'bg-purple-100 text-purple-700',
    title: 'AI Copilot',
    summary: 'Your AI business partner — generates briefs, insights, and recommended actions.',
    steps: [
      {
        title: 'What is the AI Copilot?',
        content: `The AI Copilot analyzes data across the entire platform and produces:

• Daily Executive Briefs — a written summary of the business state
• Insights — specific observations (e.g., "Client X's engagement dropped 40% this week")
• Action Queue — tasks the AI recommends based on its analysis
• Opportunity Signals — revenue opportunities it has identified

Think of it as an AI chief of staff that reads all the data so you do not have to.`
      },
      {
        title: 'Generating a New Brief',
        content: `1. Go to AI Copilot from the sidebar.
2. Click "Generate New Brief" (or it may auto-generate daily).
3. Wait 10–30 seconds for the AI to analyze the platform.
4. The brief appears with sections: Executive Summary, Key Risks, Revenue Opportunities, Recommended Actions.

Briefs are time-stamped. You can review past briefs for trend comparison.`
      },
      {
        title: 'Reading Copilot Insights',
        content: `Insights are categorized by type:
• 🔴 Risk — something that could hurt the business (churn signal, missed SLA, etc.)
• 🟡 Warning — early warning sign worth monitoring
• 🟢 Opportunity — a growth or revenue action you could take
• 🔵 Info — neutral observation

Each insight links to the relevant page/client where you can take action. Click "View Details" to see the full reasoning.`
      },
      {
        title: 'The Copilot Action Queue',
        content: `The Action Queue is different from the Owner Action Queue on the Executive Dashboard. This one is AI-generated and contains specific, tactical recommendations:

• "Follow up with [Client] — no activity in 14 days"
• "Send renewal proposal to [Client] — contract ends in 21 days"
• "Review content for [Client] — 3 posts pending over 48 hours"

You can mark each action as Done or Dismissed. Dismissed items will not reappear.`
      },
      {
        title: 'Per-Account Copilot (AdminCopilotAccount)',
        content: `In addition to the global copilot, each client account has its own AI analysis. Access it by going to Clients, opening a client record, and clicking "AI Copilot" tab.

The per-account view shows:
• That client's health trend
• Content performance analysis
• Recommended next steps specifically for that account
• Growth opportunities based on their industry and location`
      }
    ]
  },

  // ─── COMMAND CENTER ─────────────────────────────────────────────────────────
  {
    id: 'command',
    category: 'Operations',
    icon: Cpu,
    color: 'bg-blue-100 text-blue-700',
    title: 'Command Center',
    summary: 'High-level operations overview — content engine, lead funnel, autopilot, and alerts.',
    steps: [
      {
        title: 'What is the Command Center?',
        content: `The Command Center is an operational dashboard that shows the real-time state of all automated systems:

• Content Engine Stats — how many posts are in the pipeline, published, and pending
• Lead Funnel Metrics — leads by stage, conversion rates
• Autopilot Status — whether automated jobs are running correctly
• Alert Summary — active alerts that need attention
• City SEO Table — programmatic SEO page status by city
• Recent Activity Feed — latest actions across the platform

Use this page to quickly spot any system-wide issues before they become client problems.`
      },
      {
        title: 'Content Engine Stats',
        content: `This widget shows:
• Total posts created this month (AI-generated + client-submitted)
• Posts published vs. pending vs. overdue
• Posts by channel (Facebook, Instagram, LinkedIn, TikTok, etc.)
• AI generation success rate

If you see a high number of overdue posts, go to Content Queue immediately and work through the backlog.`
      },
      {
        title: 'Autopilot Status',
        content: `The Autopilot section shows whether scheduled automation jobs are running:

🟢 Running = job executed successfully
🟡 Warning = job ran but with warnings
🔴 Failed = job failed and needs investigation

Common autopilot jobs:
• Daily content generation
• Weekly blog post creation
• Lead scoring updates
• SLA compliance checks
• Revenue engine sweep

If a job shows red, go to Admin → Autopilot for details and manual re-run.`
      },
      {
        title: 'City SEO Table',
        content: `Shows the status of programmatic location pages:
• Total pages generated vs. queued
• Pages published vs. draft
• Most recent generation date per city

If cities show as queued for more than 24 hours, check the Page Generation Queue under the admin tools.`
      }
    ]
  },

  // ─── ALERT CENTER ───────────────────────────────────────────────────────────
  {
    id: 'alerts',
    category: 'Operations',
    icon: Bell,
    color: 'bg-red-100 text-red-700',
    title: 'Alert Center',
    summary: 'Centralized view of all system alerts requiring admin attention.',
    steps: [
      {
        title: 'Types of Alerts',
        content: `The Alert Center aggregates alerts from across the system:

🔴 Critical — requires immediate action (payment failure, SLA breach, automation failure)
🟠 High — needs attention within 24 hours (churn risk, overdue fulfillment)
🟡 Medium — address within 48–72 hours (low engagement, pending approvals)
🔵 Low — informational, no urgency

Alerts are auto-generated by:
• The AI Copilot analysis engine
• SLA monitoring rules
• Billing/payment processors
• Content pipeline monitors`
      },
      {
        title: 'Resolving an Alert',
        content: `1. Click any alert to expand the details.
2. Read the full description and linked context.
3. Click "View Related" to go directly to the affected record (client, invoice, task, etc.).
4. Take the required action in that section.
5. Return to Alert Center and click "Mark Resolved".

Resolved alerts are archived — they do not disappear immediately so you can review your history.`
      },
      {
        title: 'Payment Failure Alerts',
        content: `When a client's payment fails, an alert is auto-created. Steps to resolve:

1. Click the alert → View the client's billing page.
2. Check Stripe for the failure reason (card declined, expired, insufficient funds).
3. Send the client a payment update email (use AdminBilling → Payment Methods).
4. If unresolved in 3 days, pause their service and notify them.
5. Mark the alert resolved once payment is confirmed.`
      },
      {
        title: 'SLA Breach Alerts',
        content: `SLA (Service Level Agreement) alerts fire when:
• A content post has been pending for more than the agreed turnaround time
• A support ticket has been open past the SLA window
• An onboarding task is overdue

These are HIGH priority — they directly affect client satisfaction and contractual obligations. Address within 24 hours and log your resolution notes.`
      }
    ]
  },

  // ─── SALES ──────────────────────────────────────────────────────────────────
  {
    id: 'sales',
    category: 'Operations',
    icon: Target,
    color: 'bg-orange-100 text-orange-700',
    title: 'Sales & Leads',
    summary: 'Lead management, pipeline, proposals, and deal tracking.',
    steps: [
      {
        title: 'Sales Dashboard Overview',
        content: `The Sales Dashboard (sidebar: "Sales Alerts") shows:
• Hot Leads — high-score leads needing immediate follow-up
• Trial Signups — recent trial accounts that may convert
• Pipeline Summary — total deal value by stage
• Proposal Tracker — proposals sent, viewed, accepted, declined
• Recent Activity — all lead/deal events

Use this daily to manage your sales pipeline.`
      },
      {
        title: 'Leads & CRM (LeadsDashboard)',
        content: `Leads come from:
• Website contact form
• ADA intake forms
• Streaming TV intake forms
• Website Rebuild intake forms
• Landing page signups

Lead statuses:
🆕 New — just came in, not contacted
📞 Contacted — you've reached out
🤝 Qualified — confirmed interest and budget
💰 Converted — became a paying client
❌ Lost — decided not to move forward

Update status after every interaction. Use the Notes field to log call summaries.`
      },
      {
        title: 'AI Lead Scoring',
        content: `Each lead gets a score from 0–100 based on:
• Form responses and service interest
• Budget indicators
• Business type and location
• Engagement (did they visit multiple pages?)

🔴 70–100 = Hot lead, follow up within 1 hour
🟡 40–69 = Warm lead, follow up within 24 hours  
🔵 0–39 = Cold lead, nurture sequence

Never ignore a hot lead. These convert at a significantly higher rate.`
      },
      {
        title: 'Creating & Sending a Proposal',
        content: `1. Go to Proposals → Proposal Builder (or click "New Proposal").
2. Select the client (or create a new contact).
3. Choose services to include.
4. Fill in: project scope, deliverables, pricing, ROI projections, timeline, FAQ, testimonials.
5. Click Preview to see how the client will see it.
6. Click Send — the client gets an email with a unique link.
7. Track opens in the Proposal Tracker (you'll see when they viewed it).

Follow up within 24 hours of the first view if no response.`
      },
      {
        title: 'The Sales Pipeline (ProposalPipeline)',
        content: `The Pipeline view shows all open deals in kanban stages:
• Lead — initial contact made
• Qualified — needs/budget confirmed
• Proposal Sent — proposal delivered, awaiting response
• Negotiation — in discussion
• Closed Won — signed!
• Closed Lost — did not proceed

Drag cards between stages as deals progress. Add notes and tasks to each deal card.`
      },
      {
        title: 'Reseller Program',
        content: `Resellers are partners who sell NTA services under their own brand. The reseller admin pages are:

• Admin → Resellers — manage all reseller accounts
• Admin → Reseller Clients — clients that came through a reseller
• Admin → Reseller Revenue — commission tracking
• Admin → Reseller Commissions — payout management
• ResellerSignupLinks — unique signup URLs per reseller

Resellers get a white-label dashboard and their own commission tier. All their clients are tracked separately.`
      }
    ]
  },

  // ─── CLIENTS ────────────────────────────────────────────────────────────────
  {
    id: 'clients',
    category: 'Operations',
    icon: Briefcase,
    color: 'bg-green-100 text-green-700',
    title: 'Client Management',
    summary: 'View, manage, and monitor all client accounts.',
    steps: [
      {
        title: 'Finding a Client',
        content: `Go to Operations → Clients. Use the search bar to find by:
• Business name
• Client name  
• Email address

You can also filter by:
• Status (Active, Trial, Churned, Paused)
• Service tier ($297 DFY, $197 Collaborative, DIY)
• Health score range
• Assigned team member`
      },
      {
        title: 'Client Profile Overview',
        content: `Clicking a client opens their full profile with tabs:
• Overview — key info, health score, subscription details
• Content — their post submissions and content calendar
• Fulfillment — tasks and deliverables for this account
• Billing — invoices, subscription, payment history
• Communications — messages and support tickets
• Analytics — traffic, leads, engagement data
• AI Copilot — AI analysis and recommendations for this account
• Notes — internal admin notes (clients cannot see these)`
      },
      {
        title: 'Client Settings & Permissions',
        content: `For each client you can control:
• Which portal pages they can see (via ClientPortalVisibilitySettings)
• Approval policies — do their posts need admin approval before scheduling?
• Notification preferences — what emails they receive
• Portal roles — if they have multiple team members, what each person can do

Access these via the client's Settings tab or Admin → Client Settings.`
      },
      {
        title: 'Adding a New Client Manually',
        content: `If a client signs up outside the normal funnel (e.g., you enrolled them directly):

1. Go to Admin → Users → Invite User
2. Enter their email and set role to "user"
3. They receive an invite email to set their password
4. Then go to Admin → Clients → Create Client Record
5. Fill in their business profile, service tier, and start date
6. Assign the subscription plan in Billing
7. Initiate their onboarding workroom`
      },
      {
        title: 'Pausing or Canceling a Client',
        content: `To pause a client (temporary break):
1. Go to their profile → Billing tab
2. Click "Pause Subscription"
3. Set the resume date
4. Log a note explaining why

To cancel:
1. Billing tab → Cancel Subscription
2. Select reason (required for reporting)
3. Set final billing date
4. Archive their record

Cancellation data feeds into churn analysis reports.`
      }
    ]
  },

  // ─── USERS ──────────────────────────────────────────────────────────────────
  {
    id: 'users',
    category: 'Operations',
    icon: UserCog,
    color: 'bg-teal-100 text-teal-700',
    title: 'User Management',
    summary: 'Manage admin and client user accounts, roles, and access.',
    steps: [
      {
        title: 'User Roles',
        content: `There are two main roles:

👔 Admin — full access to the admin panel and all features
👤 User (Client) — access only to the client portal

Sub-roles within the client portal (set per client):
• Owner — full portal access, can approve/decline proposals and invoices
• Admin Contact — can manage content and settings
• Viewer — read-only access to reports and dashboards

Set client sub-roles in Admin → Client Settings → Portal Roles.`
      },
      {
        title: 'Inviting a New Admin',
        content: `1. Go to Admin → Users
2. Click "Invite User"
3. Enter their email
4. Set role to "admin"
5. They receive an email to set their password

Important: Admin role gives full access to ALL data including billing and client records. Only give admin access to trusted team members.`
      },
      {
        title: 'Resetting a User\'s Access',
        content: `If a user is locked out or cannot log in:
1. Go to Admin → Users
2. Find their account
3. Click "Resend Invite" to send a new password setup email

If they need their role changed:
1. Find their user record
2. Edit the "role" field
3. Save — the change takes effect on their next login`
      }
    ]
  },

  // ─── ONBOARDING ─────────────────────────────────────────────────────────────
  {
    id: 'onboarding',
    category: 'Operations',
    icon: CheckSquare,
    color: 'bg-cyan-100 text-cyan-700',
    title: 'Client Onboarding',
    summary: 'Guide new clients through setup from signup to fully active.',
    steps: [
      {
        title: 'The Onboarding Flow',
        content: `When a new client joins, they go through these steps in their portal:
1. Business Profile — name, location, industry, description
2. Brand Profile — logo, colors, voice/tone
3. Social Accounts — connect Facebook, Instagram, etc.
4. Content Preferences — topics, posting frequency, content types
5. Goals — what they want to achieve
6. Review & Complete

As admin, you can see exactly which step they are on and intervene if they get stuck.`
      },
      {
        title: 'Admin Onboarding Dashboard',
        content: `Go to Operations → Onboarding. You will see:
• All clients currently in onboarding
• Their current step number
• Days since they signed up
• Days since last activity on onboarding

Sort by "Days Since Signup" descending to find clients who signed up but never completed onboarding — these need a personal follow-up call.`
      },
      {
        title: 'Onboarding Workrooms',
        content: `Each client gets a private Workroom — a shared space where they:
• Submit brand assets (logo, photos)
• Complete intake forms
• Communicate with your team

You can send messages inside the workroom and attach files. The client sees this in their portal under "Onboarding".

Access via: Operations → Onboarding → [Client Name] → Open Workroom`
      },
      {
        title: 'What to Do When a Client is Stuck',
        content: `If a client has been in onboarding for more than 5 days without completing:

1. Check their current step in the Onboarding dashboard
2. Send a message in their Workroom asking if they need help
3. If no response in 48 hours, call them directly
4. Offer to walk them through the remaining steps on a screen share
5. Log the interaction in their profile Notes

Stuck onboarding is the #1 cause of early churn — address it proactively.`
      },
      {
        title: 'Manually Completing Onboarding Steps',
        content: `If a client cannot figure out a step, you can fill it in for them:
1. Go to their client profile
2. Click the Onboarding tab
3. Edit any step directly
4. Save — this marks the step complete for them

This is especially common for social account connections — sometimes you need to walk them through OAuth on a call.`
      }
    ]
  },

  // ─── FULFILLMENT ────────────────────────────────────────────────────────────
  {
    id: 'fulfillment',
    category: 'Operations',
    icon: Briefcase,
    color: 'bg-indigo-100 text-indigo-700',
    title: 'Fulfillment',
    summary: 'Track and deliver all client work — tasks, deliverables, and workrooms.',
    steps: [
      {
        title: 'Fulfillment Overview',
        content: `Fulfillment is where all client work is tracked. Every service you deliver (content, SEO pages, website builds, video, ADA audits) has tasks and deliverables in Fulfillment.

The main dashboard shows:
• Total open tasks across all clients
• Tasks by type (Content, SEO, Website, Video, ADA)
• Overdue tasks highlighted in red
• Team workload distribution
• Clients with the most open tasks`
      },
      {
        title: 'Fulfillment Tasks',
        content: `Each task has:
• Client name and service type
• Task description
• Due date
• Assigned team member
• Status: Open → In Progress → Review → Complete

To update a task:
1. Click the task to open it
2. Update status using the dropdown
3. Add a note describing what you did
4. Save

If you cannot complete a task by the due date, update the due date AND add a note explaining why.`
      },
      {
        title: 'Fulfillment Workrooms',
        content: `Similar to Onboarding Workrooms, each active service can have a Fulfillment Workroom — a private space for that client's deliverables.

Use workrooms to:
• Share completed work for client review
• Collect client feedback and revisions
• Store all project files in one place
• Communicate progress updates

Access: Operations → Fulfillment → [Client] → Open Workroom`
      },
      {
        title: 'Deliverables',
        content: `Deliverables are the specific outputs of each task:
• Blog articles (with links to published pages)
• Social posts (with post IDs)
• SEO pages (with published URLs)
• Video files
• ADA audit reports
• Website launch confirmation

Log deliverables inside the task with a URL or file attachment. This creates a paper trail and lets clients see what has been completed in their portal.`
      },
      {
        title: 'Client Requests',
        content: `Clients can submit requests through their portal. These appear in Fulfillment → Client Requests.

Request types:
• Content revision — change a post before it goes live
• Extra post request — they want an additional post
• Service change — upgrade or downgrade
• Technical issue — something broken in their portal
• General question — requires a response

Assign each request to a team member and set a response deadline.`
      }
    ]
  },

  // ─── CONTENT QUEUE ──────────────────────────────────────────────────────────
  {
    id: 'content-queue',
    category: 'Content',
    icon: Share2,
    color: 'bg-sky-100 text-sky-700',
    title: 'Content Queue',
    summary: 'Review, approve, and schedule all client social media content.',
    steps: [
      {
        title: 'What Goes in the Content Queue?',
        content: `Two types of content appear here:
1. Client-submitted posts — the client created and submitted via their portal
2. AI-generated posts — the AI content engine created posts for DFY clients

Both types go through the same review process before being scheduled or published.`
      },
      {
        title: 'Filtering the Queue',
        content: `Use the filters to focus:
• Status — Pending, Scheduled, Posted
• Client tier — $297 DFY, $197 Collaborative
• Channel — Facebook, Instagram, LinkedIn, TikTok, Twitter
• Date range — submissions from a specific period

The queue auto-sorts by priority (purple DFY clients first) and then by submission date (oldest first).`
      },
      {
        title: 'Quality Control Process',
        content: `For each post, you must set a quality status:

✅ Ready — post is good as-is, schedule it
❓ Needs Clarification — something is unclear, contact the client before scheduling
✨ Recommend Upgrade — post would benefit from a paid enhancement

Click the relevant button on the post card. This updates the post status in the client's dashboard too.`
      },
      {
        title: 'Scheduling a Post',
        content: `Once quality status is set to Ready:
1. Copy the post content from the card
2. Open your scheduling tool (Hootsuite, Buffer, Meta Business Suite, etc.)
3. Schedule the post for the appropriate date and channel(s)
4. Return to the Content Queue
5. Click "Mark Scheduled" on the post card
6. The client's dashboard updates to show "Scheduled"

Do not click "Mark Scheduled" until the post is actually in your scheduling tool.`
      },
      {
        title: 'Marking Posts as Posted',
        content: `After a post goes live:
1. Go to Content Queue and filter by "Scheduled"
2. Find posts whose scheduled date has passed
3. Click "Mark Posted"
4. The client sees "Posted" status in their dashboard

You can also use the Scheduled Queue page (separate from Content Queue) to see all posts queued for today.`
      },
      {
        title: 'Post-Now Feature',
        content: `For posts that need to go out immediately:
1. Open the post card
2. Click "Post Now" (if the client's social accounts are connected via Meta/other OAuth)
3. The system publishes directly to connected channels
4. Status auto-updates to "Posted"

This works for Facebook and Instagram if the Meta connection is active. Check Social Accounts to verify connections.`
      }
    ]
  },

  // ─── CONTENT STUDIO ─────────────────────────────────────────────────────────
  {
    id: 'content-studio',
    category: 'Content',
    icon: Bot,
    color: 'bg-fuchsia-100 text-fuchsia-700',
    title: 'Content Studio',
    summary: 'AI-powered tools for creating posts, images, emails, videos, and more.',
    steps: [
      {
        title: 'Content Studio Overview',
        content: `The Content Studio contains multiple AI creation tools:
• Social Image Post — generate branded social images with AI
• Email Marketing — create email campaigns
• Image Editor — edit and enhance images
• Media Images — browse and manage image assets
• Media Videos — manage video assets
• Products Store — manage digital products
• Ebook Writer — AI-assisted ebook creation
• Notes — internal content notes
• Subscribers List — email subscriber management
• Autoresponder — automated email sequences`
      },
      {
        title: 'Generating AI Social Posts',
        content: `1. Go to Content → AI Operations
2. Select the client
3. Choose content type (social post, blog excerpt, ad copy)
4. Enter a topic or brief description
5. Select tone (professional, casual, humorous, inspirational)
6. Click "Generate"
7. Review and edit the output
8. Click "Save to Content Queue" or copy manually

DFY clients ($297 tier) have this done for them automatically on a schedule.`
      },
      {
        title: 'Authority Map / Blog Engine',
        content: `The Authority Blog Engine auto-generates blog articles for client SEO. It works based on topic clusters:

1. Set up the Authority Map for a client (Admin → Authority Map)
2. Configure target keywords, industries, and locations
3. The engine generates articles on a schedule
4. Articles go to Content Drafts for review before publishing
5. Approved drafts are published to the blog

Review drafts weekly and ensure they are factually accurate before approving.`
      },
      {
        title: 'Video Queue & AI Videos',
        content: `For video content:
1. Go to Content → Video Queue
2. See all pending video requests from clients
3. For AI-generated videos, click the request to open the AI Video Studio
4. Select avatar, voice, script, and music
5. Generate and review the video
6. Approve and deliver to the client

The AI Video Studio uses HeyGen for avatar videos. Ensure the HEYGEN_API_KEY secret is active.`
      }
    ]
  },

  // ─── INTELLIGENCE ────────────────────────────────────────────────────────────
  {
    id: 'intelligence',
    category: 'Intelligence',
    icon: TrendingUp,
    color: 'bg-amber-100 text-amber-700',
    title: 'Intelligence Hub',
    summary: 'AI signals, market intelligence, opportunity detection, and automation.',
    steps: [
      {
        title: 'Intel Hub Overview',
        content: `The Intelligence section contains AI-powered analysis tools:
• Intel Hub — aggregated signals and insights across all clients
• Industry Intel — trends and data for specific industries we serve
• Local Market Intel — data on specific cities and markets
• Business Profiles — enriched profiles of client businesses
• Marketing Brain — AI marketing recommendations per client
• Opportunities — revenue and growth opportunities flagged by AI
• Weekly Plans — AI-generated weekly marketing plans
• Performance Signals — trend changes worth acting on
• Workflow Orchestrator — automated multi-step workflow management
• Optimizer — campaign performance optimization engine`
      },
      {
        title: 'Reading Opportunity Signals',
        content: `Opportunity Signals are AI-detected moments where a client could benefit from a new service or expansion:

• "Client in HVAC industry — spring season is approaching, great time for a campaign push"
• "Client has 50+ 5-star reviews — ideal time to launch a testimonial campaign"
• "Client's blog traffic doubled — propose SEO expansion package"

Each signal has:
• Signal type (seasonal, competitive, performance-based)
• Recommended action
• Estimated revenue potential
• Confidence score (how certain the AI is)

Act on high-confidence, high-value signals first.`
      },
      {
        title: 'Workflow Orchestrator',
        content: `The Orchestrator manages complex, multi-step automated workflows. Each workflow has:
• Trigger condition (e.g., "new client completes onboarding")
• Action steps (e.g., "create workroom → assign tasks → send welcome email → generate first content pack")
• Status tracking (Running, Completed, Failed, Paused)

If a workflow fails, you will see it here in red with an error log. Click to see which step failed and re-trigger from that point.`
      },
      {
        title: 'The Optimizer',
        content: `The Optimizer analyzes campaign performance and recommends adjustments:
• Which content types are performing best per client
• Best posting times per channel per client
• Keyword opportunities for SEO content
• Budget allocation recommendations for ads clients

Review Optimizer recommendations weekly. Accept or dismiss each one. Accepted recommendations flow into the team's task queue.`
      },
      {
        title: 'Weekly Marketing Plans',
        content: `For DFY clients, the AI generates a Weekly Marketing Plan every Monday. Each plan includes:
• 5–7 social posts for the week (topics, captions, best times)
• 1 blog post topic
• Any promotional or seasonal angles to use
• Performance targets based on recent data

Review these plans each Monday. Approve them to release to the content production queue. Request revisions if a plan misses the mark for a client.`
      }
    ]
  },

  // ─── BILLING & FINANCE ──────────────────────────────────────────────────────
  {
    id: 'billing',
    category: 'Platform',
    icon: CreditCard,
    color: 'bg-emerald-100 text-emerald-700',
    title: 'Billing & Finance',
    summary: 'Subscriptions, invoices, payments, contracts, and revenue tracking.',
    steps: [
      {
        title: 'Billing Overview (AdminBilling)',
        content: `The Billing section manages all financial aspects:
• Subscriptions — recurring plans per client
• Invoices — monthly invoice history
• Billing Customers — Stripe customer records
• Payment Methods — saved cards per client
• Billing Plans — the plan tiers available
• Billing Transactions — all payment history

Our billing is integrated with Stripe. All subscription and payment data syncs automatically.`
      },
      {
        title: 'Subscription Plans',
        content: `Current plan tiers (configured in Billing Plans):
• DIY — entry level, self-service
• $197 Collaborative — client submits content, we schedule
• $297 DFY — we create and manage all content
• Custom — negotiated pricing for large accounts
• Reseller — wholesale pricing for partner agencies

Each plan has specific entitlements (posts per month, channels, services included). These are enforced automatically.`
      },
      {
        title: 'Handling a Failed Payment',
        content: `When a payment fails, Stripe retries automatically (day 1, 3, 5, 7). As admin:

1. You receive a payment failure alert in Alert Center
2. Go to Admin → Billing → find the client
3. Check the failed invoice
4. Contact the client via email with a payment update link
5. If they update their card, Stripe auto-charges within minutes
6. If 7 days pass with no resolution, pause their subscription
7. Update the billing record with your notes

Never manually delete a failed invoice — it affects accounting records.`
      },
      {
        title: 'Contracts (AdminBillingContract)',
        content: `For annual or multi-month contracts:
1. Go to Admin → Billing → Contracts
2. Click "New Contract"
3. Set: client, service package, start/end dates, total value, payment schedule
4. Add contract line items (what services are included)
5. Save and send for client e-signature (if integrated)
6. Once signed, activate the contract — billing flows automatically

Contracts show in the Revenue Engine for forecasting purposes.`
      },
      {
        title: 'Finance Reports (AdminFinance)',
        content: `The Finance section has:
• Monthly Revenue Summary — MRR, one-time payments, refunds
• Finance Transactions — every financial event (subscription charges, refunds, payouts)
• Revenue Forecasts — projected revenue based on active contracts and subscriptions
• Expenses — operational costs (track manually or import)
• Payouts — reseller commission payouts

Run the monthly revenue summary at the start of each month and share with the owner.`
      }
    ]
  },

  // ─── SETTINGS ───────────────────────────────────────────────────────────────
  {
    id: 'settings',
    category: 'Platform',
    icon: Settings,
    color: 'bg-slate-100 text-slate-700',
    title: 'Settings & Platform Config',
    summary: 'System settings, automation rules, social accounts, chatbots, and more.',
    steps: [
      {
        title: 'Admin Settings Overview',
        content: `Admin → Settings contains system-wide configuration:
• Global Settings — app name, logo, default timezone
• Email Templates — the emails the system sends automatically
• Automation Rules — what triggers automated actions
• Governance Policies — compliance and approval rules
• SLA Rules and Profiles — service level agreement configurations
• Notification Preferences — when and how admins get notified`
      },
      {
        title: 'Social Accounts',
        content: `Admin → Platform → Social Accounts shows all connected social media accounts:
• Each client's connected Facebook pages, Instagram accounts, TikTok, LinkedIn
• OAuth connection status (active/expired)
• Last successful post date

If a client's connection shows as expired:
1. Open their profile
2. Go to Social Accounts tab
3. Click "Reconnect" and walk them through the OAuth flow
4. Test the connection by posting a draft`
      },
      {
        title: 'Chatbot Management',
        content: `For clients with chatbot services:
1. Go to Admin → Platform → Chatbots
2. Find the client's chatbot
3. Manage: knowledge base articles, lead capture forms, response templates
4. View chatbot leads that came in
5. Get the embed code to install on their website

The chatbot uses the knowledge base you build to answer visitor questions and capture contact info.`
      },
      {
        title: 'Email Templates',
        content: `System emails are sent automatically for:
• Welcome / onboarding confirmation
• Post scheduled / posted notifications
• Invoice sent / payment received / payment failed
• Proposal sent
• Report ready

To edit a template:
1. Admin → Settings → Email Templates
2. Find the template by trigger type
3. Edit subject line and body
4. Use {{variable}} placeholders for dynamic content (e.g., {{client_name}}, {{invoice_amount}})
5. Save — takes effect on next trigger`
      },
      {
        title: 'Automation Rules',
        content: `Automation Rules define what happens automatically when certain events occur. Examples:

• When new lead created → assign to sales rep → send follow-up email after 1 hour
• When client completes onboarding → create fulfillment workroom → send welcome email
• When invoice is unpaid after 7 days → pause subscription → notify admin

Be careful when editing automation rules — changes affect all clients. Always test with a dummy record first.`
      }
    ]
  },

  // ─── SYSTEM HEALTH & QA ─────────────────────────────────────────────────────
  {
    id: 'system-health',
    category: 'Platform',
    icon: Shield,
    color: 'bg-rose-100 text-rose-700',
    title: 'System Health & QA',
    summary: 'Monitor system performance, run tests, and track bugs.',
    steps: [
      {
        title: 'System Health Dashboard',
        content: `Admin → System Health shows the status of all automated systems:
• API connections (Stripe, OpenAI, HeyGen, Meta, Google)
• Database health indicators
• Scheduled job success rates
• Error rates by module
• Recent critical errors

Check this page if anything in the system seems slow or broken. Red indicators mean something needs fixing.`
      },
      {
        title: 'Autopilot (AdminAutopilot)',
        content: `The Autopilot page manages all scheduled automated jobs:
• Daily content generator — creates AI posts for DFY clients
• Weekly blog generator — writes weekly SEO articles
• Lead scoring — updates lead scores nightly
• Revenue engine sweep — evaluates opportunities daily
• SLA compliance check — runs every 4 hours

For each job you can:
• See last run time and result
• View error logs if it failed
• Manually trigger a re-run
• Enable/disable the job`
      },
      {
        title: 'QA Test Cases (AdminQATests)',
        content: `The QA system has a full library of test cases for every major flow. When testing:

1. Go to Admin → QA → Tests
2. Filter by test group (e.g., "Lead Capture", "Billing", "Content")
3. Click a test to see the step-by-step instructions
4. Execute the test manually following each step
5. Log the result: Pass, Fail, Blocked, or Needs Review
6. If failed, create an Issue record with details`
      },
      {
        title: 'QA Issues (AdminQAIssues)',
        content: `When you find a bug:
1. Go to Admin → QA → Issues
2. Click "New Issue"
3. Fill in: title, severity (Critical/High/Medium/Low), issue type, description, reproduction steps, expected vs. actual behavior
4. Link to the test case that revealed it (if applicable)
5. Assign to the responsible team member
6. Set priority

Monitor open Critical and High issues daily. They block releases and must be resolved before new features ship.`
      },
      {
        title: 'QA Readiness (AdminQAReadiness)',
        content: `Before any major release:
1. Go to Admin → QA → Readiness
2. Review the current release status
3. Check the "Must Pass" flow results
4. Verify critical P0 tests are passing
5. Review open issues count by severity
6. The system calculates a readiness score (0–100)

Release gates:
• "Not Ready" — do not deploy
• "At Risk" — deploy with caution and extra monitoring
• "Ready for Internal Use" — safe for team testing
• "Ready for Beta" — safe for selected clients
• "Ready for Sale" — full public release`
      }
    ]
  },

  // ─── REPORTS & ANALYTICS ────────────────────────────────────────────────────
  {
    id: 'analytics',
    category: 'Executive',
    icon: BarChart2,
    color: 'bg-blue-100 text-blue-700',
    title: 'Reports & Analytics',
    summary: 'Google Analytics, traffic data, social engagement, and executive reports.',
    steps: [
      {
        title: 'Google Analytics Integration',
        content: `Each client can have their Google Analytics connected. To set up:
1. The client must grant access to their GA property
2. Admin adds the GA Property ID to the client's settings
3. Traffic data syncs daily

View client analytics at: Client Profile → Analytics tab

Shows:
• Sessions, users, page views
• Bounce rate and session duration
• Top pages and traffic sources
• Organic vs. paid vs. social traffic`
      },
      {
        title: 'Executive Reports (Monthly)',
        content: `At the end of each month, generate executive reports for clients:
1. Go to Fulfillment → Executive Reports (or use the generate function)
2. Select the client and month
3. The AI generates a report including:
   • Social media performance summary
   • Website traffic trends
   • SEO progress (if applicable)
   • Content published
   • Goals progress
4. Review the draft report
5. Add any manual notes or highlights
6. Click "Send to Client" or download as PDF`
      },
      {
        title: 'Social Analytics',
        content: `Social engagement data (likes, comments, shares, reach) is pulled from:
• Facebook/Instagram via Meta Graph API
• LinkedIn via LinkedIn API
• TikTok via TikTok API

View in: Client Profile → Analytics → Social tab

Key metrics to watch:
• Reach — how many unique accounts saw the post
• Engagement rate — (likes + comments + shares) / reach × 100
• Follower growth — month-over-month
• Best performing post types (image vs. video vs. text)`
      },
      {
        title: 'Performance Signals',
        content: `Performance Signals are auto-detected trend changes:
• "Traffic up 35% this week" → confirm attribution, share with client
• "Engagement rate down 20%" → investigate content quality, adjust strategy
• "Lead form conversions doubled" → share positive news, identify what changed

Access: Intelligence → Performance Signals

Signals feed into the AI Copilot briefing. You can also manually acknowledge signals and log your action.`
      }
    ]
  },

  // ─── GOVERNANCE ─────────────────────────────────────────────────────────────
  {
    id: 'governance',
    category: 'Intelligence',
    icon: Shield,
    color: 'bg-gray-100 text-gray-700',
    title: 'Governance & Revenue Engine',
    summary: 'Automated business rules, approval workflows, and revenue optimization.',
    steps: [
      {
        title: 'What is Governance?',
        content: `Governance refers to the automated rules that ensure business operations run correctly and compliantly:

• Governance Policies — rules like "all proposals over $5,000 require owner approval"
• Governance Audit Log — every action taken by the system, logged for compliance
• Rollback Actions — ability to undo automated actions that ran incorrectly
• Approval Requests — items flagged for human review before proceeding`
      },
      {
        title: 'Revenue Engine',
        content: `The Revenue Engine automatically identifies growth opportunities:
• Upsell candidates — clients who are good candidates for higher tiers
• Cross-sell opportunities — clients who could benefit from additional services
• Renewal risk — clients who may not renew and why
• Revenue sequences — automated outreach sequences tied to opportunities

The engine runs daily. Review its output in Intelligence → Revenue Engine.`
      },
      {
        title: 'Approval Requests',
        content: `Certain actions require explicit admin or owner approval before proceeding:
• Large proposals (configurable threshold)
• Subscription cancellations for high-value clients
• Bulk email campaigns
• Automated workflow changes

These appear in: Admin → Approval (or the Owner Action Queue on Executive Dashboard)

Approve or decline each request with a note. Declined requests notify the requester with your reason.`
      }
    ]
  },

  // ─── TIPS & BEST PRACTICES ──────────────────────────────────────────────────
  {
    id: 'tips',
    category: 'Getting Started',
    icon: Star,
    color: 'bg-yellow-100 text-yellow-700',
    title: 'Daily Workflow & Best Practices',
    summary: 'Pro tips, daily routines, and what to do when things go wrong.',
    steps: [
      {
        title: 'Ideal Daily Routine',
        content: `Morning (9:00–9:30 AM):
1. Executive Dashboard → check overnight KPIs
2. Alert Center → resolve any Critical alerts
3. Sales Alerts → check hot leads, follow up

Mid-Morning (9:30–11:00 AM):
4. Content Queue → review pending posts, set quality status, mark scheduled
5. Fulfillment → check overdue tasks, update statuses

Afternoon (1:00–3:00 PM):
6. Client communications → respond to workroom messages
7. Onboarding → follow up on stuck clients
8. Operations Hub → process opportunity signals

End of Day (4:00–5:00 PM):
9. Mark any published posts as "Posted"
10. Complete fulfilled tasks, log deliverables
11. Check the AI Copilot brief for tomorrow's priorities`
      },
      {
        title: 'Common Mistakes to Avoid',
        content: `❌ Marking a post "Scheduled" before actually adding it to your scheduling tool
→ Always schedule it first, then mark in the system

❌ Ignoring yellow client health scores
→ Yellow turns red fast. Address them weekly.

❌ Leaving alert notifications unread
→ Check Alert Center every morning. Unresolved alerts compound.

❌ Not logging notes on client interactions
→ Notes in the client profile protect you if there's ever a dispute

❌ Pausing a subscription without logging why
→ Always add a note with the reason — needed for churn reporting

❌ Publishing AI-generated content without review
→ Always read AI content before it goes live. AI makes factual errors.`
      },
      {
        title: 'When Something Breaks',
        content: `If a client reports something not working:
1. Check the Alert Center — may already be flagged
2. Check System Health — is a service down?
3. Check the Autopilot log — did a related job fail?
4. Try to reproduce the issue yourself
5. If reproducible, log a QA Issue with full details
6. Communicate with the client: acknowledge the issue, give a timeline
7. Never promise a fix time you cannot guarantee

For payment issues:
→ Always direct to the billing portal, never ask for card info directly

For login issues:
→ Use Admin → Users → Resend Invite`
      },
      {
        title: 'Communication Standards',
        content: `When communicating with clients through the system:

• Response time: same business day for all messages
• Priority clients ($297 DFY): within 2 hours
• Tone: professional but friendly, not corporate-stiff
• Always confirm receipt: "Got it! I'll have this updated by [time]."
• Never leave a message on read — even "I'm looking into this" is better than silence

For upgrade recommendations:
• Be specific about why the upgrade benefits THEM, not just that it's available
• Include example outcomes ("clients with video posts see 3x the reach")
• Keep the tone consultative, not salesy`
      },
      {
        title: 'Escalation Path',
        content: `Use this escalation chain when you cannot resolve something yourself:

Level 1 (You): Most content, scheduling, client communication, onboarding support
Level 2 (Senior Team Member): Technical issues, billing disputes under $500, SLA breaches
Level 3 (Manager): Billing disputes over $500, legal questions, client threats to cancel
Level 4 (Owner): Contract negotiations, partnership decisions, anything that could affect MRR significantly

When escalating:
• Send a written summary (email or Slack) with: what happened, what you tried, what you need
• Attach relevant screenshots or logs
• Do NOT tell the client "I'm escalating" unless explicitly asked — just say "I'm getting you an answer quickly"`
      }
    ]
  }
];

const CATEGORIES = ['Getting Started', 'Executive', 'Operations', 'Content', 'Intelligence', 'Platform'];

const CATEGORY_COLORS = {
  'Getting Started': 'bg-violet-100 text-violet-700 border-violet-200',
  'Executive': 'bg-slate-100 text-slate-700 border-slate-200',
  'Operations': 'bg-blue-100 text-blue-700 border-blue-200',
  'Content': 'bg-sky-100 text-sky-700 border-sky-200',
  'Intelligence': 'bg-amber-100 text-amber-700 border-amber-200',
  'Platform': 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

function SectionCard({ section }) {
  const [open, setOpen] = useState(false);
  const [openStep, setOpenStep] = useState(null);
  const Icon = section.icon;

  return (
    <Card className="overflow-hidden" id={section.id}>
      <button
        className="w-full text-left p-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${section.color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">{section.title}</h2>
              <Badge variant="outline" className={`text-xs ${CATEGORY_COLORS[section.category]}`}>{section.category}</Badge>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">{section.summary}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
          <span className="text-xs text-slate-400 hidden sm:block">{section.steps.length} topics</span>
          {open ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </div>
      </button>

      {open && (
        <div className="border-t">
          {section.steps.map((step, idx) => (
            <div key={idx} className="border-b last:border-b-0">
              <button
                className="w-full text-left px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                onClick={() => setOpenStep(openStep === idx ? null : idx)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <span className="font-medium text-slate-800 text-sm">{step.title}</span>
                </div>
                {openStep === idx
                  ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
              </button>
              {openStep === idx && (
                <div className="px-5 pb-5 ml-9">
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
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = useMemo(() => {
    let result = ALL_SECTIONS;
    if (activeCategory !== 'All') {
      result = result.filter(s => s.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.steps.some(st => st.title.toLowerCase().includes(q) || st.content.toLowerCase().includes(q))
      );
    }
    return result;
  }, [search, activeCategory]);

  return (
    <AdminNav>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-20">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
            <BookOpen className="w-6 h-6 text-violet-600 flex-shrink-0" />
            <div className="flex-1">
              <h1 className="text-lg font-bold text-slate-900">Help & Tutorials</h1>
              <p className="text-xs text-slate-500">Complete Admin Guide — Everything you need to work the system</p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">Welcome to the NTA Admin Guide 👋</h2>
            <p className="text-violet-100 leading-relaxed text-sm">
              This is your complete reference for every feature in the Admin Panel. Whether you are brand new or need a refresher on a specific area, find your topic below and click to expand. Every section has step-by-step instructions written in plain English.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="bg-white/20 rounded-full px-3 py-1">{ALL_SECTIONS.length} sections</span>
              <span className="bg-white/20 rounded-full px-3 py-1">{ALL_SECTIONS.reduce((a, s) => a + s.steps.length, 0)} topics</span>
              <span className="bg-white/20 rounded-full px-3 py-1">All admin pages covered</span>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search tutorials..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['All', ...CATEGORIES].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    activeCategory === cat
                      ? 'bg-violet-600 text-white border-violet-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-violet-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          {(search || activeCategory !== 'All') && (
            <p className="text-sm text-slate-500">{filtered.length} section{filtered.length !== 1 ? 's' : ''} found</p>
          )}

          {/* Sections */}
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium">No results found</p>
                <p className="text-sm mt-1">Try a different search term or category</p>
              </div>
            ) : (
              filtered.map(section => (
                <SectionCard key={section.id} section={section} />
              ))
            )}
          </div>

          <div className="text-center py-6 text-slate-400 text-sm border-t">
            Questions not covered here? Ask your manager or reach out to the tech team.<br />
            This guide is updated whenever new features are added.
          </div>
        </div>
      </div>
    </AdminNav>
  );
}