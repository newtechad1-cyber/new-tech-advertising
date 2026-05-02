import React from 'react';
import ServicePageLayout from '../components/service-pages/ServicePageLayout';

export default function WebsiteRebuildsNTA() {
  return (
    <ServicePageLayout
      seoTitle="Website Rebuilds for Local Service Businesses | NTA North Iowa"
      seoDescription="NTA rebuilds outdated small business websites into lead-generating machines. Local SEO structure, mobile-first design, and conversion-focused layouts for service businesses in North Iowa."
      eyebrow="Website Rebuilds · Local Service Businesses"
      headline="Your Website Should Be Bringing You Leads. Is It?"
      subheadline="We rebuild outdated, underperforming websites for local service businesses — designed specifically to rank locally, load fast, and turn visitors into calls."
      problem={[
        "Your site looks like it was built 10 years ago — and customers notice.",
        "You're not showing up on Google because your site has no local SEO structure.",
        "Visitors land on your site and leave without calling — no clear CTA, no trust signals.",
        "Your site doesn't work on mobile, and that's where most of your customers are searching.",
      ]}
      solution={[
        "Modern, professional design that builds trust immediately.",
        "Local SEO structure built in from the ground up — not bolted on after.",
        "Clear call-to-action on every page so visitors know what to do next.",
        "Fast load times and mobile-first design to capture phone searches.",
        "Service and city-specific pages targeting the searches your customers make.",
        "Lead capture forms and click-to-call buttons that work.",
      ]}
      includes={[
        "Full website design and development",
        "Local SEO page structure and content",
        "Mobile-first responsive design",
        "Click-to-call and contact form CTAs",
        "Google Business Profile optimization",
        "Page speed optimization",
        "SSL and basic security setup",
        "Launch and indexing support",
        "30-day post-launch support",
      ]}
      example={{
        client: "R Loving Care — Iowa",
        story: "R Loving Care had an outdated website that wasn't showing up in local searches for care services. We rebuilt it with a clean, trust-focused design, added local SEO structure, and created service pages targeting nearby cities. The new site established credibility and improved their local search visibility.",
        result: "Improved local visibility and a website families trust when searching for care services.",
      }}
      faqs={[
        { q: "How long does a rebuild take?", a: "Most websites take 2–4 weeks from start to launch, depending on complexity and how quickly we get content and approvals." },
        { q: "Do I need to provide content?", a: "We can write the content for you. If you have photos or specific details about your services, great — but we'll work with what you have." },
        { q: "What platform do you build on?", a: "We build on modern, lightweight platforms optimized for local SEO. We'll recommend the right setup for your situation." },
        { q: "Will I be able to update it myself?", a: "Yes — we set it up so you can make basic updates, or we can handle maintenance for you." },
      ]}
      relatedLinks={[
        { label: "Local Lead Systems", href: "/local-lead-systems" },
        { label: "SEO Pages", href: "/seo-pages-for-local-businesses" },
        { label: "Gap Audit", href: "/gap-audit" },
        { label: "HVAC Marketing", href: "/hvac-marketing-north-iowa" },
        { label: "Contractor Marketing", href: "/contractor-marketing-north-iowa" },
      ]}
      formSource="WebsiteRebuilds"
    />
  );
}