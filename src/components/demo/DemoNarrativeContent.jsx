import React from 'react';
import { AlertCircle, Eye, Share2, TrendingUp, Zap, CheckCircle } from 'lucide-react';

const narrativeSteps = {
  1: {
    icon: AlertCircle,
    content: 'Most businesses we work with are doing marketing, but nothing is actually running as a system.',
    points: [
      'Inconsistent marketing across channels',
      'Wasted agency spend with unclear ROI',
      'No visibility into what\'s working',
      'Social media chaos and manual posting'
    ]
  },
  2: {
    icon: Zap,
    content: 'Imagine logging in and seeing your marketing content already scheduled, visibility growing, and customers engaging — without managing everything daily.',
    points: [
      'Content runs automatically on schedule',
      'Visibility grows predictably',
      'Customers actively engage',
      'You have time to focus on business'
    ]
  },
  3: {
    icon: Share2,
    content: 'Here\'s how the system works as one connected machine:',
    points: [
      'Content Engine — Creates and distributes posts across channels',
      'Video Authority — Builds credibility through strategic video',
      'Social Distribution — Reaches the right people, the right way',
      'Reputation Growth — Positive signals compound over time',
      'Reporting Clarity — See exactly what\'s driving results'
    ]
  },
  4: {
    icon: Eye,
    content: 'Now let\'s walk through the platform in business order:',
    points: [
      '1. Client Dashboard — See your marketing running',
      '2. Content Pipeline — View production visibility',
      '3. Channel Connection — Control operations',
      '4. Publishing Calendar — System consistency',
      '5. ROI Results — Proof of impact'
    ]
  },
  5: {
    icon: TrendingUp,
    content: 'A typical client sees visibility growth within 30–60 days, then engagement momentum builds, then expansion into more aggressive campaigns.',
    points: [
      'Local HVAC company: 12 more calls/month in 45 days',
      'Restaurant: 25% increase in foot traffic in 60 days',
      'Service business: 8 new qualified leads/month within 90 days'
    ]
  },
  6: {
    icon: Zap,
    content: 'Once the base system is running, we can scale content, video, locations, or ad amplification.',
    points: [
      'Expand to multiple locations simultaneously',
      'Increase video production for authority',
      'Add paid amplification for growth',
      'Scale what\'s already working'
    ]
  },
  7: {
    icon: CheckCircle,
    content: 'Would you like to see what this would look like specifically for your business?',
    points: [
      'Schedule a Strategy Session — Deep dive into your specific situation',
      'Start a Trial — See the platform in action for your business',
      'Get a Proposal — Understand investment and timeline'
    ]
  }
};

export default function DemoNarrativeContent({ step }) {
  const data = narrativeSteps[step];
  if (!data) return null;

  const Icon = data.icon;

  return (
    <div>
      <div className="flex items-start gap-4 mb-8">
        <Icon className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />
        <p className="text-2xl text-slate-100 leading-relaxed">
          {data.content}
        </p>
      </div>

      <div className="space-y-3">
        {data.points.map((point, idx) => (
          <div key={idx} className="flex items-start gap-3 bg-slate-700/50 p-4 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
            <p className="text-slate-100">{point}</p>
          </div>
        ))}
      </div>
    </div>
  );
}