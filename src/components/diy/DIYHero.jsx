import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DIYHero({ onCTA, isLoading }) {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-violet-600/20 border border-violet-600/50 rounded-full px-4 py-2 mb-6">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span className="text-sm text-violet-300">AI-Powered Marketing System</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
          Build Your AI Marketing System for{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
            $99/Month
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
          All the AI tools you need to generate content, manage social media, create videos, and track ROI — without hiring an agency.
        </p>

        {/* CTA Button */}
        <Button
          onClick={onCTA}
          disabled={isLoading}
          size="lg"
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-8 py-6 text-lg rounded-lg font-semibold inline-flex items-center gap-2"
        >
          {isLoading ? 'Processing...' : 'Start DIY Plan'}
          {!isLoading && <ArrowRight className="w-5 h-5" />}
        </Button>

        {/* Trust indicators */}
        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            No setup fees
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            Cancel anytime
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            Full access to all AI tools
          </div>
        </div>
      </div>
    </section>
  );
}