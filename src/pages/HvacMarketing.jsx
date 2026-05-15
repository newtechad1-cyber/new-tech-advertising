import React from 'react';
import VerticalPageTemplate from '@/components/verticals/VerticalPageTemplate';
import { Zap, Search, Share2, Star, BarChart2, Video } from 'lucide-react';
import SEOHead from '@/components/shared/SEOHead';

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
  faqs: [
    {
      question: "How much does HVAC marketing cost?",
      answer: "HVAC marketing with NTA starts at $297/month. This includes AI-automated social media posting, local SEO, Google review management, and content creation specifically designed for heating and cooling companies."
    },
    {
      question: "How do HVAC companies get more Google reviews?",
      answer: "NTA's AI review management system automatically sends review requests after service calls, monitors new reviews, and helps you respond quickly. Our HVAC clients average 3x more Google reviews within 90 days."
    },
    {
      question: "What social media should an HVAC company use?",
      answer: "Facebook and Instagram are the most effective for HVAC companies. NTA's AI creates seasonal content (AC prep in spring, furnace checks in fall), emergency service posts, and maintenance tip content that drives engagement and phone calls."
    },
    {
      question: "Can AI write social media posts for my HVAC business?",
      answer: "Yes. NTA's AI creates industry-specific HVAC content including seasonal maintenance tips, emergency service announcements, new installation spotlights, and energy-saving advice. Posts are automatically scheduled across all platforms."
    },
    {
      question: "How do HVAC companies rank higher on Google?",
      answer: "Local SEO is key. NTA optimizes your Google Business Profile, creates location-specific content for every city you serve, manages reviews, and publishes consistent blog content that Google's AI citations pull from."
    }
  ]
};

export default function HvacMarketing() {
  return (
    <>
      <SEOHead 
        title="HVAC Marketing & Lead Generation | New Tech Advertising"
        description="Fill your HVAC calendar year-round with our AI marketing platform. Local SEO, social media automation, and review generation."
        faqs={DATA.faqs}
      />
      <VerticalPageTemplate data={DATA} />
    </>
  );
}