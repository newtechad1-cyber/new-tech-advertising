import React from 'react';
import { ChevronDown, CheckCircle2, Circle, Zap } from 'lucide-react';

const STEPS = [
  {
    id: 'pain_discovery',
    number: 1,
    title: 'Business Pain Discovery',
    subtitle: 'Uncover core challenges',
    talking_points: [
      'How are you currently getting new customers?',
      'What does your online presence look like today?',
      'What would 10 new customers per month mean for your business?',
      'Are competitors outranking you on Google?',
    ],
    goal: 'Surface 2–3 specific pain points before showing anything.',
  },
  {
    id: 'authority_positioning',
    number: 2,
    title: 'Authority Positioning',
    subtitle: 'Establish NTA credibility',
    talking_points: [
      'Show local market domination examples',
      'Reference industry-specific client wins',
      'Highlight content volume advantage',
      'Present AI-powered production speed',
    ],
    goal: 'Make them believe NTA is the clear category leader.',
  },
  {
    id: 'platform_overview',
    number: 3,
    title: 'Platform Overview',
    subtitle: 'The full growth system',
    talking_points: [
      'Content engine: 60+ pieces per month',
      'Streaming TV authority layer',
      'SEO + local visibility system',
      'Approval workflow + client portal',
    ],
    goal: 'Connect platform capabilities to their stated pain points.',
  },
  {
    id: 'content_engine',
    number: 4,
    title: 'Content Engine Demo',
    subtitle: 'Show production automation',
    talking_points: [
      'Live example of content calendar',
      'AI-generated content samples for their industry',
      'Posting schedule and channel coverage',
      'Client approval experience walkthrough',
    ],
    goal: 'Make the content volume feel tangible and easy.',
  },
  {
    id: 'streaming_tv',
    number: 5,
    title: 'Streaming TV Layer',
    subtitle: 'The authority differentiator',
    talking_points: [
      'What streaming TV advertising is',
      'How local visibility works on CTV',
      'Sample commercials and production quality',
      'Combined authority + visibility effect',
    ],
    goal: 'Create a wow moment — this is unique to NTA.',
  },
  {
    id: 'roi_proof',
    number: 6,
    title: 'ROI Reporting Proof',
    subtitle: 'Show the results layer',
    talking_points: [
      'Monthly performance reports',
      'Visibility score tracking',
      'Lead source attribution',
      'Client success stories in their vertical',
    ],
    goal: 'Make the investment feel like a certainty, not a gamble.',
  },
  {
    id: 'automation_savings',
    number: 7,
    title: 'Automation & Time Savings',
    subtitle: 'The operator efficiency case',
    talking_points: [
      'How much time they currently spend on marketing',
      'Fully managed vs DIY comparison',
      'What their time is worth per hour',
      'AI workforce handling routine tasks',
    ],
    goal: 'Quantify the time reclaimed by going with NTA.',
  },
  {
    id: 'pricing_packaging',
    number: 8,
    title: 'Pricing & Packaging',
    subtitle: 'Position value before price',
    talking_points: [
      'Start with the value delivered, not the cost',
      'Show tiered options clearly',
      'Anchor to what a single new client is worth',
      'Urgency: limited spots per market',
    ],
    goal: 'Price feels like an obvious yes after ROI framing.',
  },
  {
    id: 'close_strategy',
    number: 9,
    title: 'Close Strategy',
    subtitle: 'Guide the decision',
    talking_points: [
      'Which plan makes the most sense for your goals?',
      'What would need to be true to move forward today?',
      'We can get you onboarded this week',
      'Offer to lock their territory before it closes',
    ],
    goal: 'Get verbal yes or clear next step before ending.',
  },
];

export default function DemoFlowNavigator({ activeStep, setActiveStep, completedSteps, onComplete }) {
  return (
    <div className="flex flex-col h-full bg-slate-900/60 border-r border-slate-800">
      <div className="px-4 py-4 border-b border-slate-800">
        <h2 className="text-white font-bold text-sm">Demo Flow</h2>
        <p className="text-slate-500 text-xs mt-0.5">{completedSteps.length}/{STEPS.length} steps</p>
        <div className="h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
            style={{ width: `${(completedSteps.length / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {STEPS.map((step) => {
          const isActive = activeStep === step.id;
          const isDone = completedSteps.includes(step.id);

          return (
            <div key={step.id}>
              <button
                onClick={() => setActiveStep(isActive ? null : step.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                  isActive ? 'bg-blue-600/10 border-r-2 border-blue-500' : 'hover:bg-slate-800/50'
                }`}
              >
                <div className="flex-shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  ) : (
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                      isActive ? 'border-blue-400 text-blue-400' : 'border-slate-600 text-slate-600'
                    }`}>
                      {step.number}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold leading-tight ${isActive ? 'text-white' : isDone ? 'text-green-400' : 'text-slate-300'}`}>
                    {step.title}
                  </p>
                  <p className="text-slate-500 text-xs truncate">{step.subtitle}</p>
                </div>
                <ChevronDown className={`w-3 h-3 text-slate-500 flex-shrink-0 transition-transform ${isActive ? 'rotate-180' : ''}`} />
              </button>

              {isActive && (
                <div className="px-4 pb-3 bg-blue-950/10 border-r-2 border-blue-500/50">
                  <div className="ml-8 space-y-2">
                    <p className="text-xs text-blue-400 font-semibold mb-2 flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Goal: {step.goal}
                    </p>
                    {step.talking_points.map((tp, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-slate-500 mt-1.5 flex-shrink-0" />
                        <p className="text-slate-400 text-xs leading-relaxed">{tp}</p>
                      </div>
                    ))}
                    <button
                      onClick={() => onComplete(step.id)}
                      className={`mt-3 w-full py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        isDone
                          ? 'bg-green-900/40 text-green-400 border border-green-800'
                          : 'bg-blue-600/20 text-blue-400 border border-blue-600/40 hover:bg-blue-600/30'
                      }`}
                    >
                      {isDone ? '✓ Completed' : 'Mark Complete'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}