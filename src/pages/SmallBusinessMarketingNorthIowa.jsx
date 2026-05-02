import React from 'react';
import ServicePageLayout from '../components/service-pages/ServicePageLayout';

export default function SmallBusinessMarketingNorthIowa() {
  return (
    <ServicePageLayout
      seoTitle="Small Business Marketing North Iowa | Local Lead Generation | NTA"
      seoDescription="NTA provides complete marketing systems for small businesses in North Iowa — Mason City, Clear Lake, and surrounding communities. Websites, SEO, social content, video, and lead generation."
      eyebrow="Small Business Marketing · North Iowa"
      headline="Practical Marketing for Small Businesses in North Iowa"
      subheadline="We help small local businesses compete online without a big-company budget — real systems, plain-English advice, and work that actually brings in leads."
      problem={[
        "National marketing agencies don't understand small-town markets or local customer behavior.",
        "You've been sold on marketing before and didn't see a return on your investment.",
        "You don't have a full-time marketing person — and don't need one — you just need a system.",
        "The marketing landscape changes constantly and it's hard to know what to focus on.",
      ]}
      solution={[
        "Start with a free gap audit to identify the highest-impact opportunities first.",
        "Build a simple, practical plan based on your goals and budget.",
        "Focus on the channels that actually work for local service businesses — not trends.",
        "Deliver real, measurable improvements to your visibility and lead flow.",
        "Work as a long-term partner, not a vendor you never hear from.",
      ]}
      includes={[
        "Free gap audit as the starting point",
        "Website rebuild or improvement",
        "Local SEO and city-specific pages",
        "Social media content — done for you",
        "Seasonal campaign planning and execution",
        "Google Business Profile management",
        "AI video content for trust and visibility",
        "Simple lead capture and follow-up",
      ]}
      example={{
        client: "Multiple North Iowa Businesses",
        story: "We've worked with HVAC companies, excavating businesses, care providers, and equipment dealers across North Iowa and Southern Minnesota. The common thread: businesses that had been around for years but weren't capturing the leads they deserved online. With the right system — even a basic one — they started showing up, getting calls, and growing.",
        result: "Local businesses growing consistently without a massive marketing budget.",
      }}
      faqs={[
        { q: "I'm in a small town — is online marketing worth it?", a: "More than ever. Even in small markets, people search on their phone before they call anyone. If you're not showing up, someone else is getting that call." },
        { q: "How is NTA different from a big agency?", a: "We're local, we work directly with business owners, and we don't outsource your work to someone who doesn't know North Iowa. You talk to Rick, not an account manager." },
        { q: "What's the minimum to get started?", a: "A free gap audit. We'll look at your situation and tell you what we'd prioritize. From there, you decide what makes sense." },
        { q: "Can I start small and grow from there?", a: "That's how most clients start. We build the foundation first and add to the system over time as results prove out." },
      ]}
      relatedLinks={[
        { label: "Local Lead Systems", href: "/local-lead-systems" },
        { label: "Website Rebuilds", href: "/website-rebuilds" },
        { label: "HVAC Marketing", href: "/hvac-marketing-north-iowa" },
        { label: "Contractor Marketing", href: "/contractor-marketing-north-iowa" },
        { label: "Free Gap Audit", href: "/gap-audit" },
      ]}
      formSource="SmallBusinessMarketing"
    />
  );
}