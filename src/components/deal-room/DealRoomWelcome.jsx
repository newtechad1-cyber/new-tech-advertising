import React from 'react';

export default function DealRoomWelcome({ company, industry }) {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-blue-400 text-sm font-semibold tracking-wide mb-3">
          YOUR PERSONALIZED GROWTH PLAN
        </p>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Your Marketing Growth Plan
        </h1>
        <p className="text-xl text-slate-300 mb-8 leading-relaxed">
          We've mapped how your {industry} business can increase visibility, engagement, and qualified leads.
        </p>
        <p className="text-lg text-slate-400">
          {company} • {industry}
        </p>
      </div>
    </div>
  );
}