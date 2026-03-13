import React from 'react';
import { Users, Target, Clock, Lightbulb } from 'lucide-react';

export default function BCWhyChooseNTA() {
  const reasons = [
    {
      icon: Users,
      title: 'Real strategists, not robots',
      desc: 'Talk to someone who understands your business, not a sales bot reading a script.'
    },
    {
      icon: Target,
      title: 'Focused on YOUR market',
      desc: 'We analyze your specific competitors and local landscape to create a real plan.'
    },
    {
      icon: Clock,
      title: 'No pressure, just clarity',
      desc: 'This call is about answering YOUR questions and mapping your growth path.'
    },
    {
      icon: Lightbulb,
      title: 'Proven AI methodology',
      desc: 'We\'ve built this system for 300+ businesses. You get years of playbooks in one call.'
    },
  ];

  return (
    <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-blue-600 text-sm font-semibold uppercase tracking-widest">Why Choose NTA</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
            Why small businesses choose NTA
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {reasons.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <div key={i} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 pt-1">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">{reason.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{reason.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}