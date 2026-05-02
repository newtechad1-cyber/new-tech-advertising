import React from 'react';

export default function HomeLeadSystem() {
  return (
    <>
      {/* What I Do */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-2xl">
            <p className="text-slate-600 text-lg leading-relaxed mb-5">
              If your website isn't consistently bringing in calls or customers, it's usually not just one issue.
            </p>
            <p className="text-slate-600 mb-4">It's a combination of:</p>
            <ul className="space-y-2 mb-7">
              {[
                'Not showing up in search',
                'Messaging that isn\'t clear',
                'A site that doesn\'t guide people to take action',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-slate-700">
                  <span className="text-blue-500 font-bold mt-0.5">·</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-slate-700 font-semibold mb-10">That's what I help fix.</p>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-5">What I Do</h2>
            <p className="text-slate-600 mb-4">I help local businesses put a simple system in place so:</p>
            <ul className="space-y-2 mb-6">
              {[
                'People can find you',
                'Understand what you do quickly',
                'And actually reach out',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-slate-700">
                  <span className="text-blue-500 font-bold mt-0.5">·</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-slate-500 text-sm">No complicated marketing. Just what works.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-950 text-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-xl mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">How It Works</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { num: '1', title: 'Review', desc: 'I review your website.' },
              { num: '2', title: 'Find What\'s Missing', desc: 'I find what\'s missing.' },
              { num: '3', title: 'Show You What to Fix', desc: 'I show you what to fix.' },
            ].map(step => (
              <div key={step.num} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm mb-4">
                  {step.num}
                </div>
                <h3 className="font-black text-white text-base mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-slate-500 text-sm mt-6">Simple.</p>
        </div>
      </section>
    </>
  );
}