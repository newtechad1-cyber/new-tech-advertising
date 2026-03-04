import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, BarChart2, Calendar, ChevronLeft, ChevronRight, ThumbsUp, X, Dna } from 'lucide-react';

const PANEL_DURATION = 5000;

function useCountUp(target, duration = 1200, active = true) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) { setValue(0); return; }
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, active]);
  return value;
}

// Panel 1: Dashboard Overview
function PanelOverview({ accountName }) {
  const reach = useCountUp(3240, 1400, true);
  const approvals = useCountUp(7, 800, true);
  const scheduled = useCountUp(14, 1000, true);

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Dashboard</span>
        {accountName && (
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{accountName}</span>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Reach This Week', value: reach.toLocaleString(), color: 'text-blue-600' },
          { label: 'Pending Approvals', value: approvals, color: 'text-orange-500' },
          { label: 'Posts Scheduled', value: scheduled, color: 'text-green-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-slate-50 rounded-lg p-3 text-center border border-slate-100">
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-400 mt-0.5 leading-tight">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Upcoming</p>
        {[
          { platform: 'Facebook', time: 'Today 2:00 PM', label: 'Spring Promotion Post', color: 'bg-blue-500' },
          { platform: 'Instagram', time: 'Tomorrow 10:00 AM', label: 'Before/After Showcase', color: 'bg-pink-500' },
          { platform: 'LinkedIn', time: 'Thu 9:00 AM', label: 'Industry Tips Article', color: 'bg-blue-700' },
        ].map((item, i) => (
          <motion.div
            key={item.platform}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.12 }}
            className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-slate-100"
          >
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.color}`} />
            <span className="text-xs font-medium text-slate-700 flex-1">{item.label}</span>
            <span className="text-xs text-slate-400">{item.time}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Panel 2: Approval Queue
function PanelApprovals({ accountName }) {
  const cards = [
    { platform: 'Facebook', text: 'Spring is here! Our team is ready to help you get ahead of the season. Call us today for a free estimate.', status: 'pending' },
    { platform: 'Instagram', text: "Hard work, clean results. Here's a look at what we do behind the scenes every single day.", status: 'pending' },
    { platform: 'LinkedIn', text: "We've been serving this community for over 15 years. Here's what that means for your business.", status: 'pending' },
  ];
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Approval Queue</span>
        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-semibold">{cards.length} pending</span>
      </div>
      {cards.map((card, i) => (
        <motion.div
          key={card.platform}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
          className="bg-white border border-slate-200 rounded-lg p-3"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-slate-600">{card.platform}</span>
            <span className="text-xs bg-yellow-50 text-yellow-600 border border-yellow-200 px-1.5 py-0.5 rounded font-medium">Review</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mb-3">{card.text}</p>
          <div className="flex gap-2">
            <button disabled className="flex-1 flex items-center justify-center gap-1 text-xs bg-green-50 text-green-600 border border-green-200 rounded-md py-1.5 cursor-not-allowed opacity-60">
              <ThumbsUp className="w-3 h-3" /> Approve
            </button>
            <button disabled className="flex items-center justify-center gap-1 text-xs bg-red-50 text-red-500 border border-red-200 rounded-md px-3 py-1.5 cursor-not-allowed opacity-60">
              <X className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Panel 3: Scheduler Calendar
function PanelScheduler() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const posts = {
    Mon: [{ color: 'bg-blue-400', label: 'FB Post' }],
    Tue: [{ color: 'bg-pink-400', label: 'IG Post' }, { color: 'bg-blue-700', label: 'LI Post' }],
    Wed: [],
    Thu: [{ color: 'bg-blue-400', label: 'FB Post' }],
    Fri: [{ color: 'bg-pink-400', label: 'IG Story' }],
    Sat: [{ color: 'bg-blue-400', label: 'FB Post' }],
    Sun: [],
  };
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">This Week</span>
        <span className="text-xs text-slate-400">6 posts scheduled</span>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => (
          <div key={day} className="text-center">
            <p className="text-xs text-slate-400 mb-1">{day}</p>
            <div className="min-h-[56px] bg-slate-50 rounded-lg border border-slate-100 p-1 space-y-1">
              {(posts[day] || []).map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + Object.keys(posts).indexOf(day) * 0.08 + i * 0.05 }}
                  className={`${p.color} text-white text-[9px] rounded px-1 py-0.5 text-center leading-tight`}
                >
                  {p.label}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-3 pt-1">
        {[{ color: 'bg-blue-400', label: 'Facebook' }, { color: 'bg-pink-400', label: 'Instagram' }, { color: 'bg-blue-700', label: 'LinkedIn' }].map(p => (
          <span key={p.label} className="flex items-center gap-1 text-xs text-slate-500">
            <span className={`w-2 h-2 rounded-full ${p.color}`} />{p.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// Panel 4: Brand DNA
function PanelBrandDNA({ accountName }) {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Brand DNA Profile</span>
        {accountName && (
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium border border-purple-200 animate-pulse">
            Being configured
          </span>
        )}
      </div>
      {[
        { label: 'Tone', value: 'Friendly · Professional · Trustworthy', color: 'text-blue-700' },
        { label: 'Audience', value: 'Local homeowners, ages 35–65, value reliability', color: 'text-slate-700' },
        { label: 'Goals', items: ['Increase calls', 'Build local trust', 'Stay top-of-mind'] },
        { label: 'Avoid', items: ['Cheap', 'Discount', 'Generic'] },
        { label: 'CTA Style', value: 'Call Us Today', color: 'text-green-700' },
      ].map((row, i) => (
        <motion.div
          key={row.label}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2"
        >
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-0.5">{row.label}</span>
          {row.value && <span className={`text-xs font-medium ${row.color}`}>{row.value}</span>}
          {row.items && (
            <div className="flex flex-wrap gap-1 mt-1">
              {row.items.map(item => (
                <span key={item} className="text-xs bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{item}</span>
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

const PANELS = [
  { id: 'overview', label: 'Dashboard', icon: BarChart2, Component: PanelOverview },
  { id: 'approvals', label: 'Approvals', icon: ThumbsUp, Component: PanelApprovals },
  { id: 'calendar', label: 'Scheduler', icon: Calendar, Component: PanelScheduler },
  { id: 'dna', label: 'Brand DNA', icon: Dna, Component: PanelBrandDNA },
];

export default function LiveDashboardPreview({ accountName = null }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % PANELS.length);
    }, PANEL_DURATION);
    return () => clearInterval(timerRef.current);
  }, [paused]);

  const prev = () => setActive(p => (p - 1 + PANELS.length) % PANELS.length);
  const next = () => setActive(p => (p + 1) % PANELS.length);
  const { Component } = PANELS[active];

  return (
    <div
      className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Browser chrome */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center gap-2">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-slate-400 border border-slate-200 text-center truncate">
          app.newtechadvertising.com/dashboard
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex bg-slate-50 border-b border-slate-200">
        {PANELS.map((panel, i) => {
          const Icon = panel.icon;
          return (
            <button
              key={panel.id}
              onClick={() => setActive(i)}
              className={`flex-1 flex items-center justify-center gap-1.5 text-xs py-2.5 font-medium transition-all border-b-2 ${
                active === i
                  ? 'border-blue-600 text-blue-700 bg-white'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{panel.label}</span>
            </button>
          );
        })}
      </div>

      {/* Panel content */}
      <div className="relative overflow-hidden" style={{ minHeight: 280 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <Component accountName={accountName} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation + progress */}
      <div className="bg-slate-50 border-t border-slate-100 px-4 py-2.5 flex items-center justify-between">
        <button onClick={prev} className="p-1 rounded-full hover:bg-slate-200 transition-colors text-slate-400 hover:text-slate-700">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1.5">
          {PANELS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`transition-all rounded-full ${active === i ? 'w-5 h-2 bg-blue-600' : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'}`}
            />
          ))}
        </div>
        <button onClick={next} className="p-1 rounded-full hover:bg-slate-200 transition-colors text-slate-400 hover:text-slate-700">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Auto-progress bar */}
      {!paused && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-200">
          <motion.div
            key={active}
            className="h-full bg-blue-500"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: PANEL_DURATION / 1000, ease: 'linear' }}
          />
        </div>
      )}
    </div>
  );
}