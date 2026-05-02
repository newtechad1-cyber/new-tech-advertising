import React from 'react';

// VIDEO PLACEHOLDER
function VideoPlaceholder({ label }) {
  return (
    <div className="w-full rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden aspect-video flex flex-col items-center justify-center gap-3">
      <div className="w-14 h-14 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center">
        <svg className="w-6 h-6 text-slate-400 ml-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <p className="text-slate-500 text-sm font-medium text-center px-6">{label}</p>
    </div>
  );
}

const STEPS = [
  { num: '1', title: 'Gap Audit', desc: 'We look at your website, SEO, messaging, and how leads actually come in.' },
  { num: '2', title: 'Rebuild & Structure', desc: 'We fix what\'s confusing and simplify how your business is presented.' },
  { num: '3', title: 'SEO Pages', desc: 'We build pages based on what people are actually searching for.' },
  { num: '4', title: 'Campaigns', desc: 'Seasonal offers that give people a reason to act.' },
  { num: '5', title: 'Content & Video', desc: 'Simple content that keeps your business showing up.' },
  { num: '6', title: 'Follow-Up', desc: 'Making sure calls, messages, and opportunities don\'t slip through.' },
];

export default function HomeLeadSystem() {
  return (
    <>
      {/* What We Actually Do */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-5">What We Actually Do</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Most local businesses don't have a traffic problem—they have a clarity and structure problem.
            </p>
            <p className="text-slate-600 text-base leading-relaxed mb-4">
              We help fix that by building systems that connect everything:
            </p>
            <ul className="space-y-2">
              {[
                'Website structure that makes sense',
                'SEO pages that match real searches',
                'Campaigns that get attention',
                'Content and video that keep you visible',
                'Simple follow-up so opportunities don\'t get missed',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-slate-700 text-base">
                  <span className="text-blue-500 font-bold mt-0.5">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Lead System video */}
          <VideoPlaceholder label={`VIDEO — "What a lead system actually is and why most businesses don't have one"`} />
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-slate-950 text-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">How It Works</h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              We don't jump straight into design or ads.<br />
              We start by figuring out what's missing.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
            {STEPS.map(step => (
              <div key={step.num} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm mb-4">
                  {step.num}
                </div>
                <h3 className="font-black text-white text-base mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Process video */}
          <VideoPlaceholder label={`VIDEO — "Here's how I typically help a local business step-by-step"`} />
        </div>
      </section>
    </>
  );
}