import React from 'react';
import ServicePageLayout from '../components/service-pages/ServicePageLayout';

export default function GapAuditPage() {
  return (
    <ServicePageLayout
      seoTitle="Free Gap Audit for Local Service Businesses | NTA North Iowa"
      seoDescription="Get a free gap audit from NTA. We identify the 3–5 biggest lead opportunities your business is missing online — no obligation, no sales pitch."
      eyebrow="Free Gap Audit · No Obligation"
      headline="Find Out Exactly Where You're Losing Leads"
      subheadline="A free, no-pressure review of your online presence — we identify the 3–5 biggest gaps that are costing you leads right now, then show you what to do about them."
      problem={[
        "Most local business owners know their website or marketing isn't working — they just don't know exactly why.",
        "Without knowing the gaps, you can't fix the right things first.",
        "You could spend money on ads or a new website and still not see results if the root problems aren't identified.",
        "Every week without a fix is another week of missed leads.",
      ]}
      solution={[
        "We review your website, Google Business Profile, local search rankings, and social presence.",
        "We identify the specific gaps that are costing you the most leads.",
        "We deliver a clear, plain-English breakdown of what we found and what to do about it.",
        "No sales pitch — if it's something you can fix yourself, we'll tell you how.",
        "If there's a fit to work together, we'll outline what that looks like.",
      ]}
      includes={[
        "Website review (design, speed, mobile, CTAs)",
        "Google Business Profile audit",
        "Local search visibility check",
        "Competitor comparison (top 2–3)",
        "Social media presence review",
        "3–5 specific, prioritized recommendations",
        "Delivered as a written summary or short call",
      ]}
      example={{
        client: "Echo Equipment — North Iowa",
        story: "Echo Equipment had a functional website but weren't getting online leads. Our gap audit found 4 clear issues: no Google Business Profile posts, no mobile call button, missing city-specific pages for nearby markets, and no active review response strategy. None of these required a full rebuild — they were quick wins that immediately improved their visibility.",
        result: "4 actionable fixes identified — most achievable without a full site redesign.",
      }}
      faqs={[
        { q: "Is the gap audit really free?", a: "Yes, completely. We do this because it starts a real conversation — and sometimes you'll find things you can fix on your own, which is fine." },
        { q: "How long does it take?", a: "The audit takes us 1–2 hours to complete. You'll receive a response within 24–48 business hours." },
        { q: "Will I be pressured to buy something?", a: "No. We'll share what we found. If there's a way we can help and you're interested, we'll talk about it. If not, no problem." },
        { q: "What do I need to provide?", a: "Just your business name, website URL, and service area. That's all we need to get started." },
      ]}
      relatedLinks={[
        { label: "Local Lead Systems", href: "/local-lead-systems" },
        { label: "Website Rebuilds", href: "/website-rebuilds" },
        { label: "SEO Pages", href: "/seo-pages-for-local-businesses" },
        { label: "Seasonal Campaigns", href: "/seasonal-campaigns" },
        { label: "See Sample Audit", href: "/gap-audit/example-hvac-mason-city" },
      ]}
      formSource="GapAuditPage"
    />
  );
}