import React from 'react';
import ServicePageLayout from '../components/service-pages/ServicePageLayout';

export default function HVACMarketingNorthIowa() {
  return (
    <ServicePageLayout
      seoTitle="HVAC Marketing North Iowa | New Tech Advertising"
      seoDescription="AI-powered HVAC marketing for North Iowa contractors. Get more furnace and AC calls with Google Business Profile, AI search optimization & social media."
      eyebrow="HVAC Marketing · North Iowa"
      headline="More Service Calls for Your HVAC Business in North Iowa"
      subheadline="We build complete lead systems for heating and cooling companies — from seasonal campaigns to local SEO pages to follow-up automation — so your phone keeps ringing."
      problem={[
        "Your busy seasons come and go without a consistent marketing system driving calls.",
        "Customers are searching for 'AC repair Mason City' or 'furnace tune-up North Iowa' and finding someone else.",
        "You're relying on word-of-mouth but it isn't growing fast enough.",
        "You tried Facebook ads or a website before and didn't see results.",
      ]}
      solution={[
        "Build or rebuild your website with HVAC-specific local SEO structure.",
        "Create city-specific pages targeting searches in your service area.",
        "Run seasonal campaigns before spring and fall to drive tune-up and service calls.",
        "Set up a follow-up system so every lead gets a response fast.",
        "Keep your brand visible with regular social content between seasons.",
      ]}
      includes={[
        "HVAC-specific website rebuild or improvement",
        "Service area SEO pages (heating, cooling, emergency service)",
        "Seasonal campaign setup (spring + fall)",
        "Google Business Profile optimization",
        "Facebook campaign management",
        "Lead capture and follow-up sequence",
        "Monthly performance reporting",
      ]}
      example={{
        client: "Johnson Heating & A/C — Mason City, IA",
        story: "Johnson Heating came to us with a basic website and no marketing system. We rebuilt their site with local SEO, created landing pages for spring and fall seasonal services, and ran a Facebook campaign targeting homeowners in Mason City and surrounding communities. The result was a steady flow of inbound service calls — especially during their peak seasons.",
        result: "Consistent inbound service calls from local homeowners during seasonal peaks.",
      }}
      faqs={[
        { q: "What's the most important thing for HVAC marketing?", a: "Timing and visibility. You want campaigns running 2–3 weeks before your season starts, and you want to show up when people search for your service in your area. Both require planning ahead." },
        { q: "Do seasonal campaigns work in a small market?", a: "Yes — often better than in large cities. Competition is lower, ad costs are lower, and you're marketing to a community where trust and name recognition matter." },
        { q: "Can you handle emergency service call marketing?", a: "Yes. We can set up pages and campaigns specifically for emergency calls — one of the highest-value leads for HVAC businesses." },
        { q: "How much does HVAC marketing cost?", a: "It depends on what you need. We start with a free gap audit to understand your situation and build a proposal from there. No guesswork." },
      ]}
      relatedLinks={[
        { label: "Local Lead Systems", href: "/local-lead-systems" },
        { label: "Seasonal Campaigns", href: "/seasonal-campaigns" },
        { label: "Website Rebuilds", href: "/website-rebuilds" },
        { label: "SEO Pages", href: "/seo-pages-for-local-businesses" },
        { label: "Free Gap Audit", href: "/gap-audit" },
      ]}
      formSource="HVACMarketing"
    />
  );
}