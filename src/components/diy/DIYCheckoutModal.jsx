import React, { useState } from 'react';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DIYCheckoutModal({ isOpen, onClose, onProceed, isLoading, selectedPlan = 'diy_social' }) {
  if (!isOpen) return null;

  const isSuite = selectedPlan === 'diy_suite';
  const planName = isSuite ? 'DIY Marketing Suite' : 'DIY Social';
  const price = isSuite ? '$197' : '$97';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Headline */}
        <h2 className="text-3xl font-bold text-white mb-2">
          Start {planName}
        </h2>
        <p className="text-slate-400 mb-8">
          Everything you need for {price}/month
        </p>

        {/* What's Included */}
        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-semibold">Structured Marketing Plan</p>
              <p className="text-slate-400 text-sm">Weekly action plan tailored to your business</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-semibold">AI Content & Video Tools</p>
              <p className="text-slate-400 text-sm">Generate articles, posts, and videos in minutes</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-semibold">Growth Tracking System</p>
              <p className="text-slate-400 text-sm">Track leads, conversions, and marketing ROI</p>
            </div>
          </div>
        </div>

        {/* Guarantee */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-8">
          <p className="text-slate-300 text-sm">
            <span className="text-white font-semibold">30-day guarantee:</span> If you don't see value, we'll refund your first month.
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onProceed}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white py-3 text-base font-bold rounded-lg flex items-center justify-center gap-2"
          >
            {isLoading ? 'Processing...' : 'Continue to Secure Checkout'}
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </Button>

          <Button
            onClick={onClose}
            variant="outline"
            className="w-full bg-slate-800 border-slate-700 text-white hover:bg-slate-700 py-3 text-base font-semibold rounded-lg"
          >
            Ask a Question
          </Button>
        </div>

        {/* Security Footer */}
        <p className="text-slate-500 text-xs text-center mt-6">
          💳 Payments secured by Stripe • 30-day money-back guarantee
        </p>
      </div>
    </div>
  );
}