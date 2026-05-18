import React from 'react';
import VerticalPageTemplate from '@/components/verticals/VerticalPageTemplate';
import { Search, Share2, Star, BarChart2, Video, Zap } from 'lucide-react';

const DATA = {
  industry: 'Med Spa',
  headline: 'Fill Your Med Spa Appointment Book With AI Marketing',
  subheadline: 'Your clients are on Instagram before they call to book. Our AI platform creates stunning content, manages reviews, and builds the brand that premium clients trust.',
  color: '#ec4899',
  stats: [
    { value: '200%', label: 'Average Instagram growth (90 days)' },
    { value: '$850', label: 'Avg client lifetime value' },
    { value: '68%', label: 'Bookings from social media' },
    { value: '5x', label: 'Return on marketing spend' },
  ],
  contentExamples: [
    {
      companyName: 'Glow Aesthetic Studio',
      platform: 'Instagram',
      caption: '✨ Botox myth busted: "It looks unnatural." Not with our technique. We specialize in subtle, natural-looking results that refresh — not freeze. See our client gallery in the highlights. Book a free consultation this week! ⬇️',
      hashtags: '#Botox #AestheticMedicine #GlowUp #NaturalBeauty #MedSpa',
      likes: 487,
      comments: 94,
    },
    {
      companyName: 'Luxe Skin & Body',
      platform: 'Facebook',
      caption: '💆‍♀️ Mother\'s Day is 3 weeks away! Give Mom the gift she\'ll actually use — a $150 Luxe Skin gift card. Redeemable for facials, fillers, laser treatments, and more. Limited cards available. Order online now!',
      hashtags: '#MothersDay #GiftIdeas #SkincareTreatment #LuxeSkin',
      likes: 203,
      comments: 58,
    },
    {
      companyName: 'Renew Medical Aesthetics',
      platform: 'Instagram',
      caption: '🔬 Introducing Morpheus8 — the gold standard in skin tightening and rejuvenation. Minimal downtime, maximum results. We\'re now booking intro appointments with $100 off your first session. DM for availability!',
      hashtags: '#Morpheus8 #SkinTightening #MedicalAesthetics #AntiAging',
      likes: 614,
      comments: 128,
    },
  ],
  features: [
    { icon: Share2, title: 'Premium Visual Content', desc: 'AI creates aspirational posts, treatment spotlights, client transformations, and seasonal promotions.' },
    { icon: Star, title: 'Reputation Management', desc: 'Automatically collect glowing reviews post-treatment and respond to feedback professionally.' },
    { icon: Video, title: 'Treatment Showcase Videos', desc: 'Generate educational and aspirational video content for Reels, TikTok, and YouTube.' },
    { icon: Search, title: 'Aesthetic SEO', desc: 'Rank for "Botox near me," "lip filler [city]," and other high-converting local searches.' },
    { icon: BarChart2, title: 'Booking Attribution', desc: 'See which posts, promotions, and platforms are driving appointment bookings and revenue.' },
  ],
  testimonial: {
    quote: 'Our Instagram went from 800 to 4,500 followers in four months. We\'re fully booked on Fridays and Saturdays. The content the AI creates is honestly better than what our old agency did.',
    author: 'Jessica M.',
    company: 'Glow Aesthetic Studio, Scottsdale AZ',
  },
};

import SEOHead from '@/components/shared/SEOHead';

export default function MedSpaMarketing() {
  return (
    <>
      <SEOHead 
        title="Med Spa Marketing | AI Marketing for Medical Spas"
        description="AI-driven marketing for med spas and aesthetic practices. Patient acquisition, social media, Google Business Profile & online booking. New Tech Advertising."
      />
      <VerticalPageTemplate data={DATA} />
    </>
  );
}