import React from 'react';
import ServicePageLayout from '../components/service-pages/ServicePageLayout';

import SEOHead from '@/components/shared/SEOHead';
export default function SeasonalCampaigns() {
  return (
    <>
      <SEOHead
        title="Seasonal Marketing Campaigns for Small Business | New Tech Advertising"
        description="How to plan seasonal marketing campaigns for HVAC, plumbing, and restaurant businesses. AI-powered seasonal content strategies."
      />
      <ServicePageLayout
      seoTitle="Seasonal Marketing Campaigns for Local Businesses | NTA North Iowa"
      seoDescription="NTA runs seasonal Facebook and social media campaigns for local service businesses in North Iowa — HVAC tune-ups, spring landscaping, fall clean-ups, and more."
      eyebrow="Seasonal Campaigns · North Iowa"
      headline="Run Campaigns That Hit at Exactly the Right Time"
      subheadline="Seasonal Facebook and social campaigns built around your busy periods — spring tune-ups, fall clean-ups, summer projects, and winter emergency calls."
      problem={[
        "You get busy and forget to promote until the season is already underway.",
        "You don't have time to set up ads or don't know how to target local customers.",
        "You're leaving seasonal revenue on the table because customers don't know you're available.",
        "Your competitors are running specials and showing up in people's feeds — you're not.",
      ]}
      solution={[
        "Plan and schedule campaigns before your busy season begins.",
        "Build a targeted Facebook ad or organic campaign around a specific offer or service.",
        "Create a dedicated landing page tied to the campaign so leads convert.",
        "Set up lead capture and follow-up so no inquiry goes unanswered.",
        "Run the numbers and improve each season based on what worked.",
      ]}
      includes={[
        "Campaign strategy and timing recommendation",
        "Facebook ad or organic post creation",
        "Dedicated landing page for the campaign",
        "Lead capture form with follow-up",
        "Ad targeting setup (if paid)",
        "Campaign monitoring and adjustment",
        "Post-campaign results summary",
      ]}
      example={{
        client: "Johnson Heating & A/C — Spring Tune-Up Campaign",
        story: "We ran a spring AC tune-up campaign for Johnson Heating before the season peaked. We created Facebook posts and a simple landing page promoting a $79 tune-up special. The campaign ran for 3 weeks and drove a consistent flow of inbound calls from local homeowners.",
        result: "Steady inbound calls for tune-up appointments throughout the spring push.",
      }}
      faqs={[
        { q: "What platforms do you run campaigns on?", a: "Primarily Facebook and Instagram, but we can also do Google ads, organic posts, or email campaigns depending on your situation." },
        { q: "Do I need a big ad budget?", a: "Not necessarily. Some of our most effective campaigns have been organic (no ad spend). If you want paid ads, even $5–10/day can make a meaningful difference in a small local market." },
        { q: "How far in advance should I plan?", a: "Ideally 4–6 weeks before your season starts. That gives us time to build the campaign, landing page, and get it approved." },
        { q: "What industries does this work best for?", a: "Any seasonal service — HVAC, lawn care, landscaping, plumbing, home services, excavating. Basically any business that has a busy season." },
      ]}
      relatedLinks={[
        { label: "Local Lead Systems", href: "/local-lead-systems" },
        { label: "Social Media Content", href: "/social-media-content-system" },
        { label: "HVAC Marketing", href: "/hvac-marketing-north-iowa" },
        { label: "Contractor Marketing", href: "/contractor-marketing-north-iowa" },
        { label: "Gap Audit", href: "/gap-audit" },
      ]}
      formSource="SeasonalCampaigns"
    />
    </>
  );
}