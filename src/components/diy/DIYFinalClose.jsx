import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DIYFinalClose({ onCTA, isLoading }) {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-violet-600/10 to-indigo-600/10">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
          🔥 Start Building Your Marketing Momentum Today
        </h2>

        <div className="space-y-4 mb-12">
          <p className="text-2xl font-bold text-white">
            Stop guessing.
          </p>
          <p className="text-2xl font-bold text-white">
            Stop falling behind competitors.
          </p>
          <p className="text-2xl font-bold text-white">
            Start building consistent visibility and lead flow.
          </p>
        </div>

        <Button
          onClick={onCTA}
          disabled={isLoading}
          size="lg"
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-8 py-6 text-lg rounded-lg font-bold inline-flex items-center gap-2"
        >
          {isLoading ? 'Processing...' : 'Start Your DIY Growth System'}
          {!isLoading && <ArrowRight className="w-5 h-5" />}
        </Button>

        <p className="text-slate-400 text-sm mt-8">
          No contracts. Cancel anytime. Results-focused from day one.
        </p>
      </div>
    </section>
  );
}