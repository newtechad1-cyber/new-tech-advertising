import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronRight,
  ArrowLeft, Globe, Youtube, Facebook, Instagram, Tv
} from 'lucide-react';

const PLATFORMS = [
  {
    id: 'google_business',
    name: 'Google Business Profile',
    color: 'blue',
    colorHex: '#4285f4',
    icon: Globe,
    why: "Google Business Profile is the single most important local signal for your business. When someone searches for your service in your city, Google uses your profile to decide whether to show you in the map pack — the top 3 results that get 70% of all clicks. NTA posts to your profile weekly, monitors reviews, and keeps your information accurate so Google continues to rank you.",
    steps: [
      "Go to /nta/channels and click 'Connect' next to Google Business Profile.",
      "You'll be redirected to Google's sign-in page. Sign in with the Google account that owns or manages your Business Profile.",
      "Google will ask you to authorize NTA to manage your business listing. Click 'Allow' for all requested permissions.",
      "After approving, you'll be returned to the Channel Hub. Select your business location from the dropdown if prompted.",
      "Your Google Business Profile will show as 'Connected' within 30 seconds.",
    ],
    errors: [
      { issue: "\"This account doesn't have a Business Profile\"", fix: "You must be logged in as the account owner or a manager of the Business Profile. Go to business.google.com and verify your account has access before retrying." },
      { issue: '"Insufficient permissions" or access denied', fix: "You clicked 'Deny' on one or more permission scopes. Reconnect and approve all permissions — NTA needs post management, insights, and review access to function properly." },
      { issue: "Wrong business location appears", fix: "If you manage multiple locations, select the correct one from the dropdown after authorization. If no dropdown appears, contact support." },
      { issue: "Connection shows 'Error' the next day", fix: "Your token may have expired or been revoked. Go to myaccount.google.com → Security → Third-party apps, remove the NTA connection, then reconnect from the Channel Hub." },
    ],
    success: "Once connected, your Google Business Profile card shows 'Connected' with a green indicator. NTA begins posting Business Profile updates within 24–48 hours. You'll see post activity in your monthly ROI dashboard under 'Local Visibility'.",
  },
  {
    id: 'facebook',
    name: 'Facebook Page',
    color: 'indigo',
    colorHex: '#1877f2',
    icon: Facebook,
    why: "Facebook is the primary social channel for local business authority. NTA publishes 3–5 posts per week to your Facebook Page, including articles, videos, promotional content, and community-focused posts. A consistent Facebook presence builds trust with local audiences and drives referral traffic back to your website.",
    steps: [
      "Go to /nta/channels and click 'Connect' next to Facebook.",
      "You'll be directed to a Meta login window. Sign in with the personal Facebook account that has admin access to your Business Page.",
      "Meta will list the permissions NTA is requesting — these cover posting, reading page insights, and managing messages. Click 'Allow All'.",
      "On the next screen, select the specific Facebook Page you want NTA to post to. If you have multiple pages, choose your primary business page.",
      "Click 'Save' and you'll be returned to the Channel Hub. Facebook shows as 'Connected' within seconds.",
    ],
    errors: [
      { issue: "\"You're not an admin of any Facebook Pages\"", fix: "Your personal Facebook account must be an Admin (not Editor or Analyst) of the business page. In Facebook, go to your Page Settings → Page Roles and verify your role is 'Admin'." },
      { issue: "Page list is empty after login", fix: "This usually means your account has a Business Manager restriction. Make sure the page is added to your Meta Business Suite account, then retry." },
      { issue: '"Token invalid" within a few weeks', fix: "Meta's User Access Tokens expire every 60 days. NTA attempts to auto-refresh, but if it fails, you'll see a yellow 'Needs Attention' status — just click Reconnect." },
      { issue: "Posts are being declined by Meta", fix: "This can happen if your Page has restrictions (age, country, or promotional content policies). Check your Page's 'Publishing Restrictions' in Meta Business Suite." },
    ],
    success: "Your Facebook Page card shows 'Connected' with your page name displayed. NTA begins scheduling posts immediately. First content typically appears within 48 hours of your initial content approval.",
  },
  {
    id: 'instagram',
    name: 'Instagram via Facebook',
    color: 'pink',
    colorHex: '#e1306c',
    icon: Instagram,
    why: "Instagram is connected through your Facebook account — there's no separate login required. NTA posts visual content including graphics, short video clips, and carousel posts to your Instagram Business account. Instagram is particularly effective for service businesses in visual industries like home services, restaurants, and med spas.",
    steps: [
      "Instagram is connected automatically when you connect your Facebook Page — no separate step needed.",
      "During the Facebook connection flow, Meta will ask if you want to pair your Instagram account. Click 'Yes' if prompted.",
      "If Instagram shows 'Not Connected' after Facebook is linked, click 'Connect' on the Instagram card — it will reuse your Facebook authorization without a new login.",
      "Select your Instagram Business Account from the list (it must be a Business or Creator account, not a personal profile).",
      "Instagram will show as 'Connected' and display your @handle.",
    ],
    errors: [
      { issue: "Instagram card stays 'Not Connected' after Facebook is connected", fix: "Your Instagram account needs to be a Business or Creator account linked to your Facebook Page. In Instagram Settings → Account → Switch to Professional Account, then link to your Facebook Page." },
      { issue: '"Instagram account not linked to this Page"', fix: "In Facebook Page Settings → Instagram, click 'Connect Account' and link your Instagram. Then reconnect from the NTA Channel Hub." },
      { issue: "Only personal Instagram account appears (not business)", fix: "NTA can only post to Instagram Business or Creator accounts. Personal accounts do not support third-party publishing. Switch your account type in Instagram Settings first." },
      { issue: "Posts publish to Facebook but not Instagram", fix: "Check that your Instagram token is still valid. In the Channel Hub, if Instagram shows 'Needs Attention', click Reconnect." },
    ],
    success: "Instagram card shows 'Connected' with your @handle. NTA publishes visual posts to Instagram on a schedule aligned with your Facebook content calendar. Instagram engagement metrics appear in your monthly report.",
  },
  {
    id: 'youtube',
    name: 'YouTube Channel',
    color: 'red',
    colorHex: '#ff0000',
    icon: Youtube,
    why: "YouTube is the world's second-largest search engine. Every video NTA produces for you is uploaded to your YouTube channel, which creates a permanent library of authority content that ranks in Google search results. Video content dramatically increases the time people spend engaging with your brand and helps you outrank competitors who rely only on text.",
    steps: [
      "Go to /nta/channels and click 'Connect' next to YouTube.",
      "Sign in with the Google account that owns your YouTube channel. This may be the same account as your Google Business Profile.",
      "Google will ask for permission to upload videos and read channel analytics. Click 'Allow' for all scopes.",
      "Your YouTube channel name will appear in the Channel Hub once connected.",
      "NTA immediately verifies upload access by checking your channel status — this takes about 15 seconds.",
    ],
    errors: [
      { issue: "\"No YouTube channel found on this account\"", fix: "You need to create a YouTube channel first. Go to youtube.com, click your avatar → Create a Channel, and complete the setup. Then reconnect from the Channel Hub." },
      { issue: '"Upload quota exceeded"', fix: "YouTube limits uploads via API to 100 videos per day per account. NTA manages this automatically, but if you see this error it usually resolves within 24 hours." },
      { issue: "Videos upload but are stuck in 'Processing'", fix: "This is YouTube's normal video processing time — typically 5–30 minutes for standard videos. Check your YouTube Studio directly if a video is still processing after 2 hours." },
      { issue: "Channel shows connected but videos don't appear", fix: "Verify the connected Google account actually has access to the correct YouTube channel. Some businesses have multiple Google accounts — make sure you authorized with the right one." },
    ],
    success: "YouTube card shows 'Connected' with your channel name. NTA begins uploading videos as they're produced and approved. Each video includes an optimized title, description, and tags automatically. You'll see your video library grow in your YouTube Studio.",
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    color: 'cyan',
    colorHex: '#69c9d0',
    icon: Tv,
    why: "TikTok's algorithm is uniquely powerful for local discovery — short videos can reach thousands of local users even with zero followers, unlike Facebook or Instagram. NTA creates short-form video clips adapted from your existing video content and publishes them to TikTok. This channel is optional but recommended for service businesses targeting under-35 demographics.",
    steps: [
      "Go to /nta/channels and click 'Connect' next to TikTok.",
      "You'll be redirected to TikTok's authorization page. Make sure you're logged in as your TikTok Business Account.",
      "TikTok will request video upload and profile read permissions. Approve all requested scopes.",
      "After authorization, you'll return to the Channel Hub where TikTok shows as 'Connected'.",
      "Note: TikTok's API sometimes requires a Business Account verification step — if prompted, complete that in your TikTok Business Center first.",
    ],
    errors: [
      { issue: '"Personal accounts cannot authorize third-party apps"', fix: "TikTok requires a Business Account for API access. In the TikTok app, go to Settings → Manage Account → Switch to Business Account. Select a relevant business category, then retry the connection." },
      { issue: "Authorization loop — keeps returning to login page", fix: "Clear your browser cookies and try again in an incognito window. TikTok's OAuth can sometimes conflict with an existing logged-in personal session." },
      { issue: '"Videos rejected" or content policy error', fix: "TikTok has strict content policies. NTA screens content before posting, but if rejections persist, check your TikTok Business Center for specific policy notifications." },
      { issue: "TikTok shows connected but no posts appear", fix: "TikTok Business API access can take 24–48 hours to fully activate on new accounts. If posts don't appear after 48 hours, reconnect from the Channel Hub." },
    ],
    success: "TikTok card shows 'Connected' with your @handle. NTA begins publishing short-form clips within your regular content schedule. TikTok performance metrics (views, reach, follower growth) appear in your monthly ROI dashboard.",
  },
];

const colorClasses = {
  blue: { badge: 'bg-blue-600/20 text-blue-300 border-blue-700', dot: 'bg-blue-400', header: 'border-blue-800 bg-blue-950/20' },
  indigo: { badge: 'bg-indigo-600/20 text-indigo-300 border-indigo-700', dot: 'bg-indigo-400', header: 'border-indigo-800 bg-indigo-950/20' },
  pink: { badge: 'bg-pink-600/20 text-pink-300 border-pink-700', dot: 'bg-pink-400', header: 'border-pink-800 bg-pink-950/20' },
  red: { badge: 'bg-red-600/20 text-red-300 border-red-700', dot: 'bg-red-400', header: 'border-red-800 bg-red-950/20' },
  cyan: { badge: 'bg-cyan-600/20 text-cyan-300 border-cyan-700', dot: 'bg-cyan-400', header: 'border-cyan-800 bg-cyan-950/20' },
};

function PlatformSection({ platform, isOpen, onToggle }) {
  const c = colorClasses[platform.color];
  const Icon = platform.icon;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-4 px-6 py-5 text-left transition-colors hover:bg-slate-800/50 ${isOpen ? c.header + ' border-b' : ''}`}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${c.badge}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold">{platform.name}</p>
          <p className="text-slate-400 text-xs mt-0.5 truncate">{platform.why.slice(0, 80)}...</p>
        </div>
        {isOpen ? <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" /> : <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />}
      </button>

      {isOpen && (
        <div className="px-6 py-6 space-y-8">
          {/* Why it matters */}
          <div>
            <h3 className={`text-sm font-bold uppercase tracking-widest mb-3 ${c.badge.split(' ')[1]}`}>Why It Matters</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{platform.why}</p>
          </div>

          {/* Steps */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3">Step-by-Step Setup</h3>
            <ol className="space-y-3">
              {platform.steps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 border ${c.badge}`}>{i + 1}</span>
                  <p className="text-slate-300 text-sm leading-relaxed pt-0.5">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Common errors */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-amber-400 mb-3">Common Errors & Fixes</h3>
            <div className="space-y-3">
              {platform.errors.map((err, i) => (
                <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-amber-300 font-semibold text-sm">{err.issue}</p>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed pl-6">{err.fix}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Success state */}
          <div className="bg-green-900/20 border border-green-800 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-300 font-bold text-sm mb-1">What Success Looks Like</p>
                <p className="text-green-400/80 text-sm leading-relaxed">{platform.success}</p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link to="/nta/channels"
              className={`inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl border transition-colors ${c.badge} hover:opacity-80`}>
              Connect {platform.name} Now →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChannelHelpCenter() {
  const [openPlatform, setOpenPlatform] = useState('google_business');

  const { data: connections = [] } = useQuery({
    queryKey: ['channel-connections-help'],
    queryFn: () => base44.entities.ChannelConnection.list(),
  });

  const getStatus = (platformId) => {
    const conn = connections.find(c => c.platform === platformId);
    if (!conn) return 'not_connected';
    return conn.status;
  };

  const connectedCount = PLATFORMS.filter(p => getStatus(p.id) === 'connected').length;
  const attentionCount = PLATFORMS.filter(p => ['error', 'disconnected', 'needs_attention'].includes(getStatus(p.id))).length;
  const notConnectedCount = PLATFORMS.filter(p => getStatus(p.id) === 'not_connected').length;

  const statusIcon = (id) => {
    const s = getStatus(id);
    if (s === 'connected') return <CheckCircle2 className="w-4 h-4 text-green-400" />;
    if (['error', 'disconnected', 'needs_attention'].includes(s)) return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    return <XCircle className="w-4 h-4 text-slate-600" />;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950/20 to-slate-950 border-b border-slate-800 px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Link to="/nta/channels" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Channel Hub
            </Link>
          </div>
          <span className="inline-block bg-blue-600/20 text-blue-300 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 border border-blue-700">
            Channel Help Center
          </span>
          <h1 className="text-4xl font-black text-white mb-3">Connecting Your Platforms</h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
            Step-by-step guides for connecting each platform to NTA, including troubleshooting for the most common issues.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

        {/* Status Summary Block */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-900/20 border border-green-800 rounded-2xl p-5 text-center">
            <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-3xl font-black text-white">{connectedCount}</p>
            <p className="text-green-400 font-semibold text-sm mt-1">Connected</p>
          </div>
          <div className="bg-amber-900/20 border border-amber-800 rounded-2xl p-5 text-center">
            <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <p className="text-3xl font-black text-white">{attentionCount}</p>
            <p className="text-amber-400 font-semibold text-sm mt-1">Needs Attention</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 text-center">
            <XCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-3xl font-black text-white">{notConnectedCount}</p>
            <p className="text-slate-400 font-semibold text-sm mt-1">Not Connected</p>
          </div>
        </div>

        {/* Per-platform quick status bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Platform Status</p>
          <div className="flex flex-wrap gap-3">
            {PLATFORMS.map(p => (
              <button key={p.id} onClick={() => setOpenPlatform(openPlatform === p.id ? null : p.id)}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 rounded-lg text-sm transition-colors">
                {statusIcon(p.id)}
                <span className="text-slate-200 font-medium">{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Platform sections */}
        {PLATFORMS.map(platform => (
          <PlatformSection
            key={platform.id}
            platform={platform}
            isOpen={openPlatform === platform.id}
            onToggle={() => setOpenPlatform(openPlatform === platform.id ? null : platform.id)}
          />
        ))}

        {/* Bottom CTA */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 text-center">
          <p className="text-white font-bold text-xl mb-2">Ready to Connect?</p>
          <p className="text-slate-400 text-sm mb-6">Head to the Channel Hub to connect your platforms and activate automated publishing.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/nta/channels" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors">
              Go to Channel Hub →
            </Link>
            <Link to="/getting-started" className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors">
              Back to Getting Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}