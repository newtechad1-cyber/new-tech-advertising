import React from 'react';
import { Video, Film, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DIYVideoStudio({ subscription }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">AI Video Studio</h2>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Video Generation Credits</h3>
            <p className="text-slate-400 text-sm">You have 2 videos available this month</p>
          </div>
          <Button className="bg-violet-600 hover:bg-violet-700">
            Upgrade to Pro
          </Button>
        </div>
        <div className="w-full bg-slate-800 rounded-lg h-2">
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 h-2 rounded-lg" style={{ width: '40%' }}></div>
        </div>
        <p className="text-slate-400 text-xs mt-2">2 of 5 videos used</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {[
          {
            icon: Video,
            title: 'Product Demo',
            description: 'Showcase your products in action',
          },
          {
            icon: Film,
            title: 'Testimonial Video',
            description: 'Create customer testimonial videos',
          },
          {
            icon: Mic,
            title: 'Promotional Video',
            description: 'Build branded promotional content',
          },
        ].map((template, idx) => {
          const Icon = template.icon;
          return (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="w-10 h-10 bg-violet-600/20 rounded-lg flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">{template.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{template.description}</p>
              <Button variant="outline" size="sm" className="w-full">
                Create Video
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}