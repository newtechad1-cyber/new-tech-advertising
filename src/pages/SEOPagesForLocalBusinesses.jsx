import React from 'react';
import ServicePageLayout from '../components/service-pages/ServicePageLayout';

import SEOHead from '@/components/shared/SEOHead';
export default function SEOPagesForLocalBusinesses() {
  return (
    <ServicePageLayout
      seoTitle="SEO Pages for Local Service Businesses | NTA North Iowa"
      seoDescription="NTA creates city and service-specific SEO landing pages for local businesses in North Iowa. Get found when customers search for your services in your area."
      eyebrow="Local SEO Pages · North Iowa"
      headline="Show Up When Local Customers Search for What You Do"
      subheadline="City and service-specific landing pages that rank on Google and capture leads — built for HVAC, plumbing, excavating, lawn care, and other local service businesses."
      problem={[
        "You only have one generic homepage — no pages targeting specific cities or services.",
        "Competitors with worse reputations are ranking above you because they have more pages.",
        "Customers in nearby towns are searching but finding someone else because you're not there.",
        "Your existing pages are too general to rank for the specific searches that matter.",
      ]}
      solution={[
        "Build dedicated landing pages for each service you offer and city you serve.",
        "Research and target the exact search phrases your local customers use.",
        "Write localized, relevant content that Google and customers both respond to.",
        "Structure each page for conversion — not just traffic.",
        "Interlink pages to build authority across your whole site.",
        "Monitor and improve rankings over time.",
      ]}
      includes={[
        "Keyword research for your services and service area",
        "One page per city or service (scalable)",
        "Locally-written content tailored to each market",
        "Proper on-page SEO structure (title, meta, headings)",
        "Call-to-action and lead capture on every page",
        "Internal linking to related pages",
        "Google Business Profile alignment",
        "Indexing and performance monitoring",
      ]}
      example={{
        client: "HVAC Company — Mason City, IA and surrounding cities",
        story: "We created individual landing pages for each of their service areas — Mason City, Clear Lake, Garner, and Hampton — targeting searches like 'AC repair Clear Lake IA' and 'furnace tune-up Mason City'. Within 60 days, several pages were ranking on page one for those terms.",
        result: "Multiple first-page rankings in smaller nearby cities where competition was low.",
      }}
      faqs={[
        { q: "How many pages do I need?", a: "It depends on how many services you offer and how many cities you serve. A basic setup might be 5–10 pages. A full service-area system can be 20–50+. We'll recommend what makes sense for your market." },
        { q: "How long before I see results?", a: "Local SEO pages typically show results in 30–90 days. Less competitive markets often rank faster." },
        { q: "Do you write the content?", a: "Yes — we research, write, and optimize all the content. You review and approve." },
        { q: "Can these pages work with my existing website?", a: "Yes. We can add SEO pages to your current site or create them as part of a full rebuild." },
      ]}
      relatedLinks={[
        { label: "Website Rebuilds", href: "/website-rebuilds" },
        { label: "Local Lead Systems", href: "/local-lead-systems" },
        { label: "HVAC Marketing", href: "/hvac-marketing-north-iowa" },
        { label: "Small Business Marketing", href: "/small-business-marketing-north-iowa" },
        { label: "Gap Audit", href: "/gap-audit" },
      ]}
      formSource="SEOPages"
    />
      <SEOHead 
        title="SEO Pages for Local Businesses | New Tech Advertising"
        description="How local business SEO pages work. Geo-targeted landing pages that help customers find you in Mason City, Rochester, and beyond."
      />
  );
}