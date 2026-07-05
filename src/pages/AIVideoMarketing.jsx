import React from 'react';
import ServicePageLayout from '../components/service-pages/ServicePageLayout';

import SEOHead from '@/components/shared/SEOHead';
export default function AIVideoMarketing() {
  return (
    <ServicePageLayout
      seoTitle="AI Video Marketing for Local Businesses | NTA North Iowa"
      seoDescription="NTA creates AI-powered video content for local service businesses in North Iowa — affordable short videos, YouTube content, and social reels that build trust and drive leads."
      eyebrow="AI Video Marketing · North Iowa"
      headline="Video Builds Trust Faster Than Anything Else"
      subheadline="Short videos, YouTube content, and social reels for local service businesses — created with AI to keep production costs low and quality high."
      problem={[
        "Video is the highest-converting content format, but production costs have kept it out of reach for small businesses.",
        "You don't have time to script, film, edit, and post videos consistently.",
        "Customers want to see who they're hiring before they call — video answers that question.",
        "Competitors with video content are building trust faster than businesses without it.",
      ]}
      solution={[
        "AI-assisted video production that dramatically reduces cost and turnaround time.",
        "Script writing, production, and publishing handled by our team.",
        "Short-form videos for Facebook, Instagram, and YouTube Shorts.",
        "Longer explainer or service overview videos for your website and YouTube channel.",
        "Consistent video content that builds familiarity and trust over time.",
      ]}
      includes={[
        "Video content strategy and topic planning",
        "AI-assisted script writing",
        "Video production and editing",
        "Branded intro/outro and graphics",
        "Short-form vertical videos (Reels/Shorts)",
        "YouTube upload and optimization",
        "Social publishing and captioning",
        "Monthly video content calendar",
      ]}
      example={{
        client: "Local HVAC Company — North Iowa",
        story: "We created a series of short educational videos for an HVAC company — 'How to know if your furnace needs service', 'What to check before calling for AC repair', and a company overview. The videos were published on YouTube and shared on Facebook. They drove organic traffic and helped prospects feel comfortable calling before they'd ever spoken to anyone.",
        result: "Measurable increase in qualified calls from people who had watched the videos first.",
      }}
      faqs={[
        { q: "Do I need to be on camera?", a: "Not necessarily. We can create videos using AI presenters, screen recordings, text-based content, or a mix — no filming required if that's not your preference." },
        { q: "How often do you publish?", a: "Typically 2–4 videos per month. We'll recommend a cadence that fits your service type." },
        { q: "Will this actually help my rankings?", a: "YouTube is the second-largest search engine. Video on your website also increases time-on-page, which is a positive SEO signal." },
        { q: "What if I want to be on camera?", a: "Even better. We can incorporate your own footage into the production. Send us clips from the job site or your shop and we'll build around them." },
      ]}
      relatedLinks={[
        { label: "Social Media Content", href: "/social-media-content-system" },
        { label: "Seasonal Campaigns", href: "/seasonal-campaigns" },
        { label: "Local Lead Systems", href: "/local-lead-systems" },
        { label: "Gap Audit", href: "/gap-audit" },
        { label: "Small Business Marketing", href: "/small-business-marketing-north-iowa" },
      ]}
      formSource="AIVideoMarketing"
    />
      <SEOHead 
        title="AI Video Marketing for Small Business | New Tech Advertising"
        description="AI-powered video content creation for small businesses. Automated video production, editing, and distribution for local marketing."
      />
  );
}