import React from 'react';
import VerticalPageTemplate from '@/components/verticals/VerticalPageTemplate';
import { Zap, Search, Share2, Star, BarChart2, Video } from 'lucide-react';

const DATA = {
  industry: 'Plumbing',
  headline: 'Get Found First When Pipes Burst at 2am',
  subheadline: 'Emergency calls drive plumbing revenue. Our AI platform keeps your business top-of-mind online 24/7 — so when something breaks, they call you first.',
  color: '#3b82f6',
  stats: [
    { value: '5x', label: 'More online visibility' },
    { value: '40+', label: 'Posts auto-published per month' },
    { value: '2hr', label: 'Avg setup time' },
    { value: '4.9★', label: 'Avg client review rating' },
  ],
  contentExamples: [
    {
      companyName: 'Fast Flow Plumbing',
      platform: 'Facebook',
      caption: '🚰 Slow drains are the #1 sign of a bigger problem. Don\'t wait until it\'s a full backup — our team can clear clogs same-day. Save this post and call us before the weekend rush!',
      hashtags: '#PlumbingTips #LocalPlumber #FastFlowPlumbing',
      likes: 56,
      comments: 18,
    },
    {
      companyName: 'Rivera Plumbing Co.',
      platform: 'Instagram',
      caption: '💧 Water heater giving you lukewarm results? We install same-day in most cases. Tankless options available — save up to 30% on water heating costs! Tap the link in bio for a free quote.',
      hashtags: '#WaterHeater #Plumber #HomeImprovement #RiveraPlumbing',
      likes: 102,
      comments: 31,
    },
    {
      companyName: 'Clearwater Services',
      platform: 'Google Business',
      caption: 'Winter pipe prep season is here! We\'re offering free pipe insulation assessments through the end of the month. Prevent a costly burst pipe — book your inspection online.',
      hashtags: '',
      likes: 28,
      comments: 6,
    },
  ],
  features: [
    { icon: Share2, title: 'Seasonal Social Content', desc: 'AI generates plumbing tips, emergency reminders, and promotions timed to seasons and local weather.' },
    { icon: Search, title: 'Emergency SEO Keywords', desc: 'Rank for high-intent searches like "emergency plumber near me" with automated blog content.' },
    { icon: Star, title: 'Review Generation', desc: 'Automatically follow up with customers post-job to capture 5-star reviews while the experience is fresh.' },
    { icon: Video, title: 'How-To Video Content', desc: 'Generate DIY tip videos that position you as the local expert and drive inbound calls.' },
    { icon: BarChart2, title: 'Call Source Tracking', desc: 'Know exactly which posts and campaigns are driving service calls to your business.' },
  ],
  testimonial: {
    quote: 'I was spending $800/month on a social media manager doing the same thing this platform does automatically. Switching saved me $600/month.',
    author: 'Carlos R.',
    company: 'Rivera Plumbing Co., Austin TX',
  },
};

export default function PlumbingMarketing() {
  return <VerticalPageTemplate data={DATA} />;
}