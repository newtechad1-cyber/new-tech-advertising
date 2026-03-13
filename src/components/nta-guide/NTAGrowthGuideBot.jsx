import React, { useState } from 'react';
import NTAGuideAvatar from './NTAGuideAvatar';
import { X, ChevronRight, Globe, Zap, Tv, Share2, BarChart2 } from 'lucide-react';

const TOUR_STEPS = [
  {
    icon: Globe,
    color: '#3b82f6',
    title: 'Authority Website Foundation',
    desc: 'Your website becomes a local authority asset — structured for search dominance with location pages, service pages, and ADA compliance built in.',
  },
  {
    icon: Zap,
    color: '#8b5cf6',
    title: 'AI Content Engine',
    desc: 'Our AI writes industry-specific blog posts, social captions, and video scripts weekly — published automatically, building compounding visibility over time.',
  },
  {
    icon: Tv,
    color: '#ef4444',
    title: 'Streaming TV Visibility',
    desc: 'Branded video campaigns run on Streaming TV channels in your local market — reaching customers who no longer watch cable.',
  },
  {
    icon: Share2,
    color: '#10b981',
    title: 'Automated Publishing',
    desc: 'Every piece of content is auto-published across Facebook, Instagram, YouTube, and Google Business — no manual posting required.',
  },
  {
    icon: BarChart2,
    color: '#f59e0b',
    title: 'ROI Reporting',
    desc: 'Your client dashboard shows rankings, leads, content published, and visibility score — so you always know exactly what your investment is doing.',
  },
];

export default function NTAGrowthGuideBot() {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState('greeting'); // 'greeting' | 'tour'

  const handleOpen = () => setOpen(true);
  const handleClose = () => { setOpen(false); setPhase('greeting'); };

  return (
    <>
      {/* Floating bot button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {/* Tooltip bubble when closed */}
        {!open && (
          <div className="bg-slate-900 border border-slate-700 text-white text-xs font-semibold px-3 py-2 rounded-2xl shadow-lg max-w-[180px] text-center leading-snug animate-bounce-once">
            Ask the Growth Guide
          </div>
        )}
        <NTAGuideAvatar size={56} pulse={!open} onClick={open ? handleClose : handleOpen} />
      </div>

      {/* Side panel */}
      {open && (
        <div className="fixed bottom-0 right-0 z-50 flex flex-col"
          style={{ width: '100%', maxWidth: 360, height: '100dvh', maxHeight: 580, bottom: 80, right: 16, borderRadius: 20, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>
          <div className="flex flex-col h-full bg-slate-950 border border-slate-700 rounded-2xl overflow-hidden">

            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-700 to-blue-600 flex-shrink-0">
              <NTAGuideAvatar size={36} pulse={false} onClick={() => {}} />
              <div className="flex-1">
                <p className="text-white font-black text-sm leading-tight">NTA Growth Guide</p>
                <p className="text-blue-200 text-xs">Powered by NTA Platform</p>
              </div>
              <button onClick={handleClose} className="w-7 h-7 rounded-full bg-blue-800/50 hover:bg-blue-800 flex items-center justify-center transition-colors">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {phase === 'greeting' && (
                <>
                  {/* Bot message */}
                  <div className="flex items-start gap-2.5">
                    <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/4180c3dd4_faviconimage_edited.png" alt="bot" className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5 bg-white" />
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                      <p className="text-slate-200 text-sm leading-relaxed">
                        Hi — I'm the NTA Growth Guide. Want a quick tour of how this platform builds local market authority?
                      </p>
                    </div>
                  </div>

                  {/* CTA buttons */}
                  <div className="flex flex-col gap-2 pl-9">
                    <button onClick={() => setPhase('tour')}
                      className="flex items-center justify-between px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-colors">
                      Show Me
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button onClick={handleClose}
                      className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 font-medium text-sm rounded-xl transition-colors text-left">
                      I'm Just Browsing
                    </button>
                  </div>
                </>
              )}

              {phase === 'tour' && (
                <>
                  <div className="flex items-start gap-2.5">
                    <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/4180c3dd4_faviconimage_edited.png" alt="bot" className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5 bg-white" />
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                      <p className="text-slate-200 text-sm leading-relaxed">
                        Here's how NTA builds authority for local service businesses:
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pl-2">
                    {TOUR_STEPS.map((step, i) => {
                      const Icon = step.icon;
                      return (
                        <div key={i} className="flex items-start gap-3 p-3 bg-slate-900 border border-slate-800 rounded-xl">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: step.color + '22' }}>
                            <Icon className="w-4 h-4" style={{ color: step.color }} />
                          </div>
                          <div>
                            <p className="text-white text-xs font-black">{step.title}</p>
                            <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Footer CTA */}
            {phase === 'tour' && (
              <div className="px-4 py-3 border-t border-slate-800 flex-shrink-0">
                <a href="/nta/demo"
                  className="block w-full text-center px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm rounded-xl transition-colors">
                  Book a Free Strategy Call →
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}