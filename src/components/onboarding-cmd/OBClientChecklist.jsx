import React from 'react';
import { CheckSquare, Square, Upload, Globe, Share2, MapPin, FileText, Palette } from 'lucide-react';

const CLIENT_TASKS = [
  { id: 'brand_assets', icon: Palette, label: 'Upload Brand Assets', desc: 'Logo, brand colors, and any existing marketing materials', points: 10 },
  { id: 'website_structure', icon: Globe, label: 'Approve Website Structure', desc: 'Review and approve your website sitemap and page layout', points: 15 },
  { id: 'social_platforms', icon: Share2, label: 'Connect Social Platforms', desc: 'Grant access to Facebook, Instagram, YouTube, TikTok', points: 20 },
  { id: 'google_business', icon: MapPin, label: 'Connect Google Business', desc: 'Verify Google Business Profile admin access', points: 15 },
  { id: 'service_areas', icon: MapPin, label: 'Confirm Service Areas', desc: 'Define primary and secondary markets to target', points: 10 },
  { id: 'content_plan', icon: FileText, label: 'Approve First Content Plan', desc: 'Review and approve your month 1 content calendar', points: 20 },
  { id: 'intake_form', icon: Upload, label: 'Complete Business Intake Form', desc: 'Tell us about your business, goals, and ideal clients', points: 10 },
];

export default function OBClientChecklist({ completed, onToggle }) {
  const totalPoints = CLIENT_TASKS.reduce((s, t) => s + t.points, 0);
  const earnedPoints = CLIENT_TASKS.filter(t => completed.includes(t.id)).reduce((s, t) => s + t.points, 0);
  const pct = Math.round((earnedPoints / totalPoints) * 100);

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-sm">Your Setup Checklist</h3>
          <p className="text-slate-500 text-xs mt-0.5">Complete these to unlock your full marketing system</p>
        </div>
        <div className="text-right">
          <p className="text-white font-black text-lg">{pct}%</p>
          <p className="text-slate-600 text-xs">{completed.length}/{CLIENT_TASKS.length} done</p>
        </div>
      </div>

      <div className="p-2">
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3 mx-3 mt-2">
          <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>

        {CLIENT_TASKS.map((task) => {
          const Icon = task.icon;
          const done = completed.includes(task.id);
          return (
            <button key={task.id} onClick={() => onToggle(task.id)}
              className={`w-full flex items-start gap-3 p-3.5 rounded-xl text-left transition-all mb-1 ${
                done ? 'bg-green-950/20 hover:bg-green-950/30' : 'hover:bg-slate-800/50'
              }`}>
              <div className="flex-shrink-0 mt-0.5">
                {done ? <CheckSquare className="w-5 h-5 text-green-400" /> : <Square className="w-5 h-5 text-slate-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <p className={`text-sm font-semibold ${done ? 'text-green-400 line-through' : 'text-white'}`}>{task.label}</p>
                </div>
                <p className="text-slate-500 text-xs mt-0.5 ml-5">{task.desc}</p>
              </div>
              <span className="text-xs font-bold flex-shrink-0 px-2 py-0.5 rounded-full" style={{
                color: done ? '#10b981' : '#94a3b8',
                background: done ? '#10b98118' : '#1e293b'
              }}>+{task.points}pts</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}