import React from 'react';
import VerticalPageTemplate from '@/components/verticals/VerticalPageTemplate';
import { Search, Share2, Star, BarChart2, Video, Zap } from 'lucide-react';

const DATA = {
  industry: 'Roofing',
  headline: 'Win More Roofing Contracts With AI Marketing That Works While You\'re on the Roof',
  subheadline: 'Storm season is your biggest opportunity. Our AI platform builds your online presence, generates reviews, and keeps you top-of-mind so homeowners call you first after the next big storm.',
  color: '#8b5cf6',
  stats: [
    { value: '10x', label: 'ROI on marketing spend' },
    { value: '72%', label: 'Of homeowners check reviews first' },
    { value: '50+', label: 'Leads per month on average' },
    { value: '5★', label: 'Avg Google rating after 90 days' },
  ],
  contentExamples: [
    {
      companyName: 'Storm Shield Roofing',
      platform: 'Facebook',
      caption: '⛈️ Storm hit your area last night? We\'re offering FREE damage assessments this week — no obligation. A small fix now prevents a massive repair bill later. DM us or call to schedule. Crews available 7 days a week.',
      hashtags: '#StormDamage #RoofRepair #FreeInspection #StormShield',
      likes: 92,
      comments: 34,
    },
    {
      companyName: 'Peak Roofing Solutions',
      platform: 'Instagram',
      caption: '✅ Project Complete! 28 squares of GAF Timberline HDZ® installed in just 2 days for the Martinez family in Plano. Before & after below. 50-year warranty included. Get your free estimate — link in bio!',
      hashtags: '#RoofInstallation #NewRoof #GAFRoofing #PeakRoofing',
      likes: 156,
      comments: 29,
    },
    {
      companyName: 'Apex Roofing Co.',
      platform: 'Google Business',
      caption: 'Gutter cleaning season is here! Clogged gutters are the #1 cause of roof damage over winter. We\'re booking gutter cleanouts now — bundle with a roof inspection and save 20%.',
      hashtags: '',
      likes: 38,
      comments: 9,
    },
  ],
  features: [
    { icon: Zap, title: 'Storm Alert Campaigns', desc: 'AI automatically creates storm-response posts after major weather events to capture emergency leads.' },
    { icon: Share2, title: 'Before & After Content', desc: 'Turn your job photos into compelling social proof posts that drive referrals and new leads.' },
    { icon: Star, title: 'Review Automation', desc: 'After every completed job, automatically request a review. Most roofers go from 15 to 80+ reviews in 90 days.' },
    { icon: Search, title: 'Insurance Claim SEO', desc: 'Rank for "insurance roof claim help" and "hail damage repair" with targeted content.' },
    { icon: Video, title: 'Project Showcase Videos', desc: 'Create professional job highlight videos that convert on Facebook and YouTube.' },
  ],
  testimonial: {
    quote: 'After a bad storm last April, our phones were ringing off the hook because of the posts this system published automatically. We booked $180k in jobs in two weeks.',
    author: 'Derek S.',
    company: 'Storm Shield Roofing, Dallas TX',
  },
};

export default function RoofingMarketing() {
  return <VerticalPageTemplate data={DATA} />;
}