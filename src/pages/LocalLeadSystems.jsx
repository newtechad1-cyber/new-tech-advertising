import React from 'react';
import ServicePageLayout from '../components/service-pages/ServicePageLayout';

export default function LocalLeadSystems() {
  return (
    <ServicePageLayout
      seoTitle="Local Lead Systems for Service Businesses | NTA North Iowa"
      seoDescription="NTA builds complete local lead systems for service businesses in North Iowa — websites, SEO pages, seasonal campaigns, social content, video, and follow-up automation."
      eyebrow="Local Lead Systems · North Iowa"
      headline="Stop Losing Leads to Competitors Who Show Up Online"
      subheadline="A complete lead system for local service businesses — not just a website, but every piece that brings customers in the door consistently."
      problem={[
        "Your competitors are showing up on Google and you're not — even though you've been in business longer.",
        "You don't have time to manage marketing — you're already running the business.",
        "You tried a website or ads before and didn't see real results.",
        "You're depending entirely on word-of-mouth with no system to capture new leads.",
      ]}
      solution={[
        "We audit your current online presence and identify the exact gaps costing you leads.",
        "We build or rebuild your website with the right structure, content, and conversion elements.",
        "We add city and service-specific SEO pages so you show up when customers search.",
        "We create seasonal campaigns that drive calls during your busy seasons.",
        "We layer in regular social content and video to keep your brand visible.",
        "We set up simple follow-up systems so no lead falls through the cracks.",
      ]}
      includes={[
        "Free gap audit showing your biggest lead opportunities",
        "Website rebuild or improvement with local SEO structure",
        "City and service-specific landing pages",
        "Seasonal Facebook and social campaigns",
        "Regular social media content — done for you",
        "AI video marketing for YouTube and social",
        "Lead capture forms and call CTAs on every page",
        "Follow-up automation (text/email) for new leads",
        "Monthly reporting on what's working",
      ]}
      example={{
        client: "Johnson Heating & A/C — Mason City, IA",
        story: "Johnson Heating had a basic website that wasn't generating calls. We built a complete lead system: rebuilt their site with proper local SEO, added a seasonal spring tune-up campaign on Facebook, and set up a follow-up sequence for new inquiries. Their spring season saw a measurable increase in inbound service calls.",
        result: "More inbound calls during spring season — from both Google and Facebook.",
      }}
      faqs={[
        { q: "What does a 'lead system' actually mean?", a: "It means every piece of your marketing works together — your website, search rankings, social presence, campaigns, and follow-up. Most businesses have one or two of these. We build the whole system." },
        { q: "How long does it take to set up?", a: "A basic system can be up in 2–4 weeks. A full system with campaigns and content takes 4–8 weeks depending on scope." },
        { q: "Do I have to manage it myself?", a: "No. We handle the technical side. You approve content and take the calls." },
        { q: "What types of businesses do you work with?", a: "Primarily local service businesses in North Iowa — HVAC, plumbing, excavating, lawn care, home services, care providers, and equipment companies." },
      ]}
      relatedLinks={[
        { label: "Website Rebuilds", href: "/website-rebuilds" },
        { label: "SEO Pages", href: "/seo-pages-for-local-businesses" },
        { label: "Seasonal Campaigns", href: "/seasonal-campaigns" },
        { label: "Social Media Content", href: "/social-media-content-system" },
        { label: "AI Video Marketing", href: "/ai-video-marketing" },
        { label: "Free Gap Audit", href: "/gap-audit" },
      ]}
      formSource="LocalLeadSystems"
    />
  );
}