import React from 'react';
import VerticalPageTemplate from '@/components/verticals/VerticalPageTemplate';
import { Zap, Search, Share2, Star, BarChart2, Video } from 'lucide-react';

const DATA = {
  industry: 'HVAC',
  headline: 'AI Marketing That Fills Your HVAC Calendar Year-Round',
  subheadline: 'Stop relying on slow seasons. Our AI platform automates your social media, SEO, and review management — so leads find you when their system breaks down.',
  color: '#f97316',
  stats: [
    { value: '3x', label: 'More Google reviews on average' },
    { value: '80%', label: 'Time saved on marketing' },
    { value: '24/7', label: 'Automated posting & monitoring' },
    { value: '$0', label: 'Extra staff needed' },
  ],
  contentExamples: [
    {
      companyName: 'ProAir HVAC',
      platform: 'Facebook',
      caption: '🌡️ Summer is coming — is your AC ready? Don\'t wait until it\'s 95° outside to find out your unit needs work. We\'re booking maintenance appointments now. Call us today and keep your family cool all summer long!',
      hashtags: '#HVACservice #AirConditioning #SummerReady #ProAirHVAC',
      likes: 47,
      comments: 12,
    },
    {
      companyName: 'Arctic Comfort Systems',
      platform: 'Instagram',
      caption: '❄️ Did you know? Changing your air filter every 90 days can reduce energy bills by up to 15%. Our team makes it easy — we\'ll remind you AND do it for you on our maintenance plan. Link in bio to sign up!',
      hashtags: '#HVACTips #EnergySavings #HVACMaintenance',
      likes: 89,
      comments: 23,
    },
    {
      companyName: 'Elite Heating & Cooling',
      platform: 'Google Business',
      caption: 'New heat pump installation completed in Naperville today! This Carrier 20 SEER unit will save the Johnson family an estimated $800/year on energy bills. Call us for a free efficiency estimate!',
      hashtags: '',
      likes: 34,
      comments: 8,
    },
  ],
  features: [
    { icon: Share2, title: 'Automated Social Media', desc: 'AI writes and schedules seasonal HVAC content — maintenance tips, promotions, emergency service posts.' },
    { icon: Search, title: 'Local SEO Automation', desc: 'Rank for "HVAC repair near me" with AI-generated blog posts and Google Business updates.' },
    { icon: Star, title: 'Review Management', desc: 'Automatically request reviews after service calls and monitor your reputation 24/7.' },
    { icon: Video, title: 'AI Video Creation', desc: 'Create professional "before & after" videos and service spotlights without a film crew.' },
    { icon: BarChart2, title: 'Lead Tracking', desc: 'See exactly which marketing channels are bringing in service calls and bookings.' },
  ],
  testimonial: {
    quote: 'We went from 12 Google reviews to 87 in 3 months. The social posts write themselves and the phone keeps ringing.',
    author: 'Mike T.',
    company: 'ProAir HVAC, Chicago IL',
  },
};

export default function HvacMarketing() {
  return <VerticalPageTemplate data={DATA} />;
}