import React from 'react';
import { Layout, Zap, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DIYWebsiteTools({ subscription }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">AI Website Tools</h2>

      <div className="grid lg:grid-cols-2 gap-8">
        {[
          {
            icon: Layout,
            title: 'AI Landing Pages',
            description: 'Create high-converting landing pages in minutes',
            status: 'Ready to use',
          },
          {
            icon: Zap,
            title: 'Pop-up & CTA Builder',
            description: 'Capture leads with AI-optimized popups',
            status: 'Ready to use',
          },
          {
            icon: ArrowUpRight,
            title: 'Conversion Optimization',
            description: 'AI recommendations to improve conversion rates',
            status: 'Ready to use',
          },
          {
            icon: Layout,
            title: 'Form Builder',
            description: 'Create smart forms that adapt to user behavior',
            status: 'Ready to use',
          },
        ].map((tool, idx) => {
          const Icon = tool.icon;
          return (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg p-8">
              <div className="w-12 h-12 bg-violet-600/20 rounded-lg flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{tool.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{tool.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-green-400 text-sm font-semibold">{tool.status}</span>
                <Button variant="outline" size="sm">
                  Launch
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}