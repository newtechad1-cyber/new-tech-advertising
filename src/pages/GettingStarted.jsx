import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2, Circle, Share2, Calendar, ThumbsUp, BarChart3,
  ArrowRight, Rocket, Globe, Youtube, Facebook, Instagram, Star
} from 'lucide-react';

const CHECKLIST = [
  { id: 'google', label: 'Connect Google Business Profile', path: '/nta/channels', tag: 'Channels' },
  { id: 'facebook', label: 'Connect Facebook Page', path: '/nta/channels', tag: 'Channels' },
  { id: 'instagram', label: 'Confirm Instagram Pairing', path: '/nta/channels', tag: 'Channels' },
  { id: 'youtube', label: 'Connect YouTube Channel', path: '/nta/channels', tag: 'Channels' },
  { id: 'calendar', label: 'Review Your Publishing Calendar', path: '/client/dashboard', tag: 'Dashboard' },
  { id: 'approval', label: 'Approve Your First Piece of Content', path: '/client/dashboard', tag: 'Approvals' },
  { id: 'roi', label: 'Review Your First ROI Dashboard', path: '/client/growth-journey', tag: 'ROI' },
];

const SECTIONS = [
  {
    id: 'welcome',
    number: '01',
    icon: Rocket,
    title: 'Welcome to NTA',
    color: 'blue',
    content: (
      <div className="space-y-4 text-slate-300 leading-relaxed">
        <p>
          NTA (New Tech Advertising) is your all-in-one authority-building platform. We create content, manage your social channels, publish to the web, and track the real business impact — so you can focus on running your business.
        </p>
        <p>
          Over the next 30–90 days, you'll see your brand appear consistently across Google, social media, streaming TV, and more. The system works quietly in the background. Your job is simple: review content, approve it, and watch your visibility grow.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          {[
            { label: 'Content Created For You', desc: 'Articles, videos, social posts — all done.' },
            { label: 'Published Automatically', desc: 'Your calendar runs on autopilot.' },
            { label: 'Results You Can See', desc: 'Live ROI dashboard, updated monthly.' },
          ].map(item => (
            <div key={item.label} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-white font-semibold text-sm mb-1">{item.label}</p>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'channels',
    number: '02',
    icon: Share2,
    title: 'Connect Your Channels',
    color: 'cyan',
    content: (
      <div className="space-y-4 text-slate-300 leading-relaxed">
        <p>
          Before we can publish on your behalf, you'll need to connect each of your business accounts. This is a one-time setup that takes about 5 minutes per platform.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: Globe, name: 'Google Business Profile', why: 'Powers your local search presence and map listing.' },
            { icon: Facebook, name: 'Facebook Page', why: 'We post authority content and promotions for you.' },
            { icon: Instagram, name: 'Instagram', why: 'Paired through Facebook — takes 60 seconds.' },
            { icon: Youtube, name: 'YouTube Channel', why: 'We upload your video content automatically.' },
          ].map(({ icon: Icon, name, why }) => (
            <div key={name} className="flex items-start gap-3 bg-slate-800 border border-slate-700 rounded-xl p-4">
              <Icon className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white font-semibold text-sm">{name}</p>
                <p className="text-slate-400 text-xs mt-0.5">{why}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-2">
          <Link to="/nta/channels" className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
            Go to Channel Hub <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/channel-help" className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
            Connection Help Guide <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    ),
  },
  {
    id: 'publishing',
    number: '03',
    icon: Calendar,
    title: 'How Publishing Works',
    color: 'violet',
    content: (
      <div className="space-y-4 text-slate-300 leading-relaxed">
        <p>
          Once your channels are connected, NTA's content engine begins building your publishing calendar. Here's what happens every month:
        </p>
        <ol className="space-y-3">
          {[
            { step: '1', title: 'Content is Created', desc: 'Our AI and editorial team produce articles, social posts, and video scripts tailored to your industry and city.' },
            { step: '2', title: 'You Review & Approve', desc: "You'll get a notification when content is ready. One click to approve, or leave a note if you'd like changes." },
            { step: '3', title: 'We Publish Everywhere', desc: 'Approved content goes live across your website, Google, Facebook, Instagram, and YouTube — on schedule.' },
            { step: '4', title: 'We Track the Results', desc: 'Impressions, clicks, leads, and ROI are captured automatically and added to your monthly report.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-4 bg-slate-800 border border-slate-700 rounded-xl p-4">
              <span className="w-8 h-8 rounded-full bg-violet-600/20 text-violet-400 font-bold text-sm flex items-center justify-center flex-shrink-0">{step}</span>
              <div>
                <p className="text-white font-semibold text-sm">{title}</p>
                <p className="text-slate-400 text-xs mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </ol>
      </div>
    ),
  },
  {
    id: 'approvals',
    number: '04',
    icon: ThumbsUp,
    title: 'How Approvals Work',
    color: 'green',
    content: (
      <div className="space-y-4 text-slate-300 leading-relaxed">
        <p>
          You're always in control of what gets published. Nothing goes live without your approval (unless you turn on auto-approval for speed).
        </p>
        <div className="space-y-3">
          {[
            { q: 'How do I get notified?', a: "You'll receive an email when content is ready for review. You can also check your dashboard at any time." },
            { q: 'What if I want changes?', a: 'Leave a revision note and our team will update the content within 1 business day.' },
            { q: 'How long do I have to approve?', a: 'Content stays in your queue for 5 days. If not reviewed, it moves to the next scheduled slot.' },
            { q: 'Can I skip approval entirely?', a: 'Yes — turn on Auto-Approve in your settings and content publishes on the planned date automatically.' },
          ].map(({ q, a }) => (
            <div key={q} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-green-400 font-semibold text-sm mb-1">{q}</p>
              <p className="text-slate-400 text-sm">{a}</p>
            </div>
          ))}
        </div>
        <Link to="/client/dashboard" className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors mt-2">
          Go to Your Dashboard <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    ),
  },
  {
    id: 'roi',
    number: '05',
    icon: BarChart3,
    title: 'How ROI Reporting Works',
    color: 'amber',
    content: (
      <div className="space-y-4 text-slate-300 leading-relaxed">
        <p>
          Every month, NTA delivers a plain-language report showing exactly what's working and what's growing. No jargon — just real business results.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Visibility Score', desc: 'How prominently your business appears across Google, social, and streaming.' },
            { label: 'Content Published', desc: 'Total articles, videos, and posts delivered on your behalf.' },
            { label: 'Estimated Leads', desc: 'Contacts generated from your content and online presence.' },
            { label: 'Growth Trend', desc: 'Month-over-month momentum showing your trajectory.' },
          ].map(({ label, desc }) => (
            <div key={label} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-amber-400 font-semibold text-sm mb-1">{label}</p>
              <p className="text-slate-400 text-xs">{desc}</p>
            </div>
          ))}
        </div>
        <Link to="/client/growth-journey" className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors mt-2">
          View Growth Journey <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    ),
  },
];

export default function GettingStarted() {
  const [checked, setChecked] = useState({});
  const completedCount = Object.values(checked).filter(Boolean).length;

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));

  const colorMap = {
    blue: 'text-blue-400 bg-blue-600/10 border-blue-700',
    cyan: 'text-cyan-400 bg-cyan-600/10 border-cyan-700',
    violet: 'text-violet-400 bg-violet-600/10 border-violet-700',
    green: 'text-green-400 bg-green-600/10 border-green-700',
    amber: 'text-amber-400 bg-amber-600/10 border-amber-700',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 border-b border-slate-800 px-6 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block bg-blue-600/20 text-blue-300 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 border border-blue-700">
            Setup Center
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Let's Get You Set Up
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            Follow this guide to connect your channels, understand how NTA works, and complete your first-week checklist. It takes about 15 minutes.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">

        {/* Quick CTA Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Channel Hub', sub: 'Connect accounts', path: '/nta/channels', color: 'bg-cyan-600' },
            { label: 'Onboarding', sub: 'Track your setup', path: '/nta/onboarding', color: 'bg-blue-600' },
            { label: 'Dashboard', sub: 'See your content', path: '/client/dashboard', color: 'bg-violet-600' },
            { label: 'Growth Journey', sub: 'View ROI', path: '/client/growth-journey', color: 'bg-amber-600' },
          ].map(({ label, sub, path, color }) => (
            <Link key={path} to={path}
              className="flex flex-col items-center justify-center text-center bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl p-4 transition-colors group">
              <span className={`w-2 h-2 rounded-full ${color} mb-2`} />
              <p className="text-white font-bold text-sm group-hover:text-blue-300 transition-colors">{label}</p>
              <p className="text-slate-500 text-xs">{sub}</p>
            </Link>
          ))}
        </div>

        {/* Content Sections */}
        {SECTIONS.map(({ id, number, icon: Icon, title, color, content }) => (
          <div key={id} className={`bg-slate-900 border rounded-2xl overflow-hidden ${colorMap[color].split(' ').slice(2).join(' ')}`}>
            <div className={`flex items-center gap-4 px-6 py-4 border-b border-slate-800`}>
              <span className={`text-3xl font-black opacity-30 ${colorMap[color].split(' ')[0]}`}>{number}</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${colorMap[color]}`}>
                <Icon className={`w-5 h-5 ${colorMap[color].split(' ')[0]}`} />
              </div>
              <h2 className="text-white font-bold text-lg">{title}</h2>
            </div>
            <div className="px-6 py-6">{content}</div>
          </div>
        ))}

        {/* First 7 Days Checklist */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-600 bg-slate-800">
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">06 — First 7 Days Checklist</h2>
                <p className="text-slate-400 text-xs">Complete these to unlock the full power of NTA</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-white">{completedCount}<span className="text-slate-500 text-base font-normal">/{CHECKLIST.length}</span></p>
              <p className="text-slate-500 text-xs">completed</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500"
              style={{ width: `${(completedCount / CHECKLIST.length) * 100}%` }}
            />
          </div>

          <div className="px-6 py-4 space-y-2">
            {CHECKLIST.map(({ id, label, path, tag }) => {
              const done = !!checked[id];
              return (
                <div key={id}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-colors cursor-pointer ${
                    done ? 'bg-green-900/20 border-green-800' : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                  }`}
                  onClick={() => toggle(id)}
                >
                  {done
                    ? <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    : <Circle className="w-5 h-5 text-slate-500 flex-shrink-0" />
                  }
                  <p className={`flex-1 text-sm font-medium ${done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {label}
                  </p>
                  <span className="text-xs text-slate-500 bg-slate-700 px-2 py-0.5 rounded-full">{tag}</span>
                  <Link
                    to={path}
                    onClick={e => e.stopPropagation()}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>

          {completedCount === CHECKLIST.length && (
            <div className="mx-6 mb-6 bg-green-900/30 border border-green-700 rounded-xl px-6 py-4 text-center">
              <p className="text-green-300 font-bold text-lg">🎉 You're all set up!</p>
              <p className="text-green-400/70 text-sm mt-1">NTA is now fully configured and publishing on your behalf.</p>
            </div>
          )}
        </div>

        {/* Footer help */}
        <div className="text-center py-6 text-slate-500 text-sm">
          Need help? Reach out to your NTA strategist or visit{' '}
          <Link to="/HelpAndSupport" className="text-blue-400 hover:underline">Help & Support</Link>.
        </div>
      </div>
    </div>
  );
}