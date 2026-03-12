import React from 'react';
import { PhoneIcon, Calendar, FileText, ArrowRight } from 'lucide-react';

export default function DecisionPanel() {
  return (
    <div className="bg-slate-900 text-white py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Ready to Grow?</h2>
        <p className="text-xl text-slate-300 mb-12">
          Choose your next step. No pressure, just clarity.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Option 1 */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 hover:border-blue-500 transition-colors cursor-pointer">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-400 flex-shrink-0" />
              <h3 className="text-lg font-semibold">Start Setup</h3>
            </div>
            <p className="text-slate-300 mb-6">
              Begin onboarding immediately. We'll have you live within 2 weeks.
            </p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
              Start Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Option 2 */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 hover:border-blue-500 transition-colors cursor-pointer">
            <div className="flex items-start gap-3 mb-4">
              <Calendar className="w-6 h-6 text-blue-400 flex-shrink-0" />
              <h3 className="text-lg font-semibold">Strategy Call</h3>
            </div>
            <p className="text-slate-300 mb-6">
              30-min focused conversation to answer final questions. Book a time that works.
            </p>
            <button className="w-full bg-slate-700 hover:bg-slate-600 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
              Schedule Call
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Option 3 */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 hover:border-blue-500 transition-colors cursor-pointer">
            <div className="flex items-start gap-3 mb-4">
              <PhoneIcon className="w-6 h-6 text-blue-400 flex-shrink-0" />
              <h3 className="text-lg font-semibold">Custom Proposal</h3>
            </div>
            <p className="text-slate-300 mb-6">
              Need something different? Let's create a custom package that works for you.
            </p>
            <button className="w-full bg-slate-700 hover:bg-slate-600 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
              Request Proposal
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Urgency Box */}
        <div className="bg-blue-600 rounded-lg p-8 text-center">
          <p className="text-lg font-semibold mb-2">
            ⏱️ Your growth plan slot is reserved for the next 7 days.
          </p>
          <p className="text-blue-100">
            Secure your pricing and onboarding timeline today.
          </p>
        </div>

        {/* FAQ Link */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 mb-2">Questions?</p>
          <button className="text-blue-400 hover:text-blue-300 font-semibold">
            View Frequently Asked Questions →
          </button>
        </div>
      </div>
    </div>
  );
}