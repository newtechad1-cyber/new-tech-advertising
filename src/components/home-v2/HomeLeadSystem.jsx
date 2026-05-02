import React from 'react';

const STEPS = [
  { num: '1', title: 'Review', desc: 'I review your website and current setup.' },
  { num: '2', title: 'Identify Gaps', desc: 'I identify gaps in visibility, messaging, and structure.' },
  { num: '3', title: 'Show You What to Fix', desc: 'I show you what can be improved and how. From there, you decide what makes sense.' },
];

export default function HomeLeadSystem() {
  return (
    <>
      {/* What I Do */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-5">What I Do</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-5">
              If your website isn't consistently bringing in calls, messages, or customers, it's usually not just one issue.
            </p>
            <p className="text-slate-600 mb-4">It's a combination of:</p>
            <ul className="space-y-2 mb-6">
              {[
                'Not showing up where people are searching',
                'Messaging that isn\'t clear',
                'A site that doesn\'t guide people to take action',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-slate-700">
                  <span className="text-blue-500 font-bold mt-0.5">·</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-slate-700 font-medium mb-4">That's exactly what I help fix.</p>
            <p className="text-slate-600 leading-relaxed">
              I work with local businesses to put a simple system in place so people can find you, understand what you do quickly, and actually reach out.
            </p>
            <p className="text-slate-500 mt-3 text-sm">This isn't about complicated marketing. It's about making sure your business shows up and makes sense when someone is ready to act.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-slate-950 text-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">How It Works</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
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
        </div>
      </section>
    </>
  );
}