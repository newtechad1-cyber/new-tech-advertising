import React from 'react';
import VerticalPageTemplate from '@/components/verticals/VerticalPageTemplate';
import { Zap, Search, Share2, Star, BarChart2, Video } from 'lucide-react';
import SEOHead from '@/components/shared/SEOHead';

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
  faqs: [
    {
      question: "How much does plumbing marketing cost?",
      answer: "Plumbing marketing with NTA starts at $297/month including AI social media, local SEO, review management, and content creation designed specifically for plumbing businesses."
    },
    {
      question: "How do plumbers get more customers online?",
      answer: "The #1 driver is Google Business Profile optimization combined with consistent review generation. NTA automates both — plus creates location-specific content so you rank for 'plumber near me' in every city you serve."
    },
    {
      question: "What marketing works best for plumbers?",
      answer: "Local SEO and review management drive the most calls. 87% of consumers read online reviews before calling a plumber. NTA's AI ensures you have fresh reviews, optimized Google listings, and social proof across all platforms."
    },
    {
      question: "Should plumbers be on social media?",
      answer: "Absolutely. Before/after photos, emergency tips, and seasonal maintenance advice build trust and keep your business top-of-mind. NTA's AI creates and posts this content automatically."
    },
    {
      question: "How do I get my plumbing business on Google's AI answers?",
      answer: "Create FAQ content that directly answers questions people ask. NTA builds FAQ pages, learning center articles, and structured data markup that AI engines like Google AI Overview and ChatGPT pull from."
    }
  ]
};

export default function PlumbingMarketing() {
  return (
    <>
      <SEOHead 
        title="Plumbing Marketing | AI Marketing for Plumbers"
        description="AI-driven marketing for plumbing companies. Google Business Profile, local SEO, social media & lead generation. Get more service calls. New Tech Advertising."
        faqs={DATA.faqs}
      />
      <VerticalPageTemplate data={DATA} />
    </>
  );
}