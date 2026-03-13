import React, { useState } from 'react';
import { BookOpen, Download, ExternalLink, FileText, Video, Presentation, Megaphone } from 'lucide-react';

const ASSETS = [
  {
    category: 'Sales Process',
    icon: FileText,
    color: '#3b82f6',
    items: [
      { title: 'NTA Discovery Call Script', type: 'PDF', desc: '12-page guided discovery framework' },
      { title: 'Demo Day Presentation Deck', type: 'PPT', desc: '24-slide authority-building demo' },
      { title: 'Objection Handling Playbook', type: 'PDF', desc: 'Top 20 objections + proven responses' },
      { title: 'Proposal Walk-Through Guide', type: 'PDF', desc: 'How to present and close the proposal' },
    ],
  },
  {
    category: 'Onboarding Guides',
    icon: BookOpen,
    color: '#10b981',
    items: [
      { title: 'Client Onboarding Checklist', type: 'PDF', desc: 'Full setup process step-by-step' },
      { title: 'Channel Connection Tutorial', type: 'Video', desc: 'Screen-recorded platform walkthroughs' },
      { title: 'Brand Intake Form Template', type: 'Form', desc: 'Collect all client brand assets' },
      { title: '90-Day Success Roadmap', type: 'PDF', desc: 'What clients can expect month by month' },
    ],
  },
  {
    category: 'Marketing Assets',
    icon: Megaphone,
    color: '#8b5cf6',
    items: [
      { title: 'White-Label Case Studies (5)', type: 'PDF', desc: 'Anonymized client results to use in proposals' },
      { title: 'Email Outreach Templates', type: 'DOC', desc: '8 proven cold outreach sequences' },
      { title: 'LinkedIn Messaging Scripts', type: 'PDF', desc: 'B2B outreach for local business owners' },
      { title: 'Social Proof Slide Deck', type: 'PPT', desc: 'Stats, testimonials, and result highlights' },
    ],
  },
  {
    category: 'Platform Training',
    icon: Video,
    color: '#f59e0b',
    items: [
      { title: 'Platform Overview — 30 min', type: 'Video', desc: 'Full walkthrough of the NTA system' },
      { title: 'How to Use the Demo Machine', type: 'Video', desc: 'Live demo workflow training' },
      { title: 'Reporting & ROI Explanation', type: 'Video', desc: 'How to present client results' },
      { title: 'Partner Certification Program', type: 'Course', desc: 'Earn Elite status + higher rev share' },
    ],
  },
];

const TYPE_COLORS = { PDF: '#ef4444', PPT: '#f59e0b', Video: '#3b82f6', Form: '#10b981', DOC: '#8b5cf6', Course: '#ec4899' };

export default function RSEnablementHub() {
  const [openCat, setOpenCat] = useState('Sales Process');

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-blue-400" />
        <div>
          <h3 className="text-white font-bold text-sm">Reseller Enablement Hub</h3>
          <p className="text-slate-500 text-xs mt-0.5">Training materials, scripts, and sales assets</p>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex border-b border-slate-800">
        {ASSETS.map((cat) => {
          const Icon = cat.icon;
          return (
            <button key={cat.category} onClick={() => setOpenCat(cat.category)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold transition-all border-b-2 ${
                openCat === cat.category
                  ? 'text-white border-blue-500'
                  : 'text-slate-500 border-transparent hover:text-slate-300'
              }`}>
              <Icon className="w-3.5 h-3.5" /> {cat.category}
            </button>
          );
        })}
      </div>

      <div className="p-4">
        {ASSETS.filter(c => c.category === openCat).map((cat) => (
          <div key={cat.category} className="grid grid-cols-2 gap-3">
            {cat.items.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 bg-slate-800/30 border border-slate-700/30 rounded-xl hover:border-slate-600/50 transition-colors group">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${TYPE_COLORS[item.type] || '#94a3b8'}15` }}>
                  <FileText className="w-4 h-4" style={{ color: TYPE_COLORS[item.type] || '#94a3b8' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <p className="text-white text-xs font-semibold flex-1 leading-tight">{item.title}</p>
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0" style={{ color: TYPE_COLORS[item.type], background: `${TYPE_COLORS[item.type]}18` }}>
                      {item.type}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <Download className="w-3.5 h-3.5 text-slate-400 hover:text-white" />
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}