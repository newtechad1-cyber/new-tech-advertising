import React from 'react';
import ServicePageLayout from '../components/service-pages/ServicePageLayout';

import SEOHead from '@/components/shared/SEOHead';
export default function ContractorMarketingNorthIowa() {
  return (
    <>
      <SEOHead
        title="Contractor Marketing North Iowa | AI Marketing for Contractors"
        description="AI-powered marketing for contractors in North Iowa. HVAC, plumbing, electrical, and construction marketing with automated social media and local SEO."
      />
      <ServicePageLayout
      seoTitle="Contractor Marketing North Iowa | New Tech Advertising"
      seoDescription="Digital marketing for North Iowa contractors. HVAC, plumbing, roofing & trades. Google Business Profile, social media & AI search optimization. Free audit."
      eyebrow="Contractor Marketing · North Iowa"
      headline="Contractor Marketing That Gets You More Jobs in North Iowa"
      subheadline="We help local contractors — excavating, plumbing, lawn care, landscaping, and home service businesses — build lead systems that bring in consistent work."
      problem={[
        "Project-based work means income is inconsistent — you need a system to fill the pipeline.",
        "You don't have time to market between jobs — and when you're slow, it's too late.",
        "Word-of-mouth alone isn't scaling your business the way you want it to.",
        "Bigger companies with better websites are winning bids you should be getting.",
      ]}
      solution={[
        "Build a professional website that shows your work and wins bids before you even talk to someone.",
        "Create service and city-specific pages targeting the jobs and locations you want.",
        "Run campaign pages around project types — grading, dump services, seasonal work.",
        "Use video and before/after content to show the quality of your work.",
        "Set up a lead capture and follow-up system so inquiries get responses fast.",
      ]}
      includes={[
        "Contractor-specific website design",
        "Project gallery and service pages",
        "Local SEO for your service area",
        "Campaign pages for seasonal or specialty services",
        "Lead capture forms and call-to-action setup",
        "Social content highlighting projects",
        "Video content for YouTube and social",
        "Follow-up system for new inquiries",
      ]}
      example={{
        client: "Monson Excavating — North Iowa",
        story: "Monson Excavating does a variety of work — grading, excavating, and their well-known annual Dump Day event. We built their social content strategy around real projects and community events, keeping their name in front of local property owners year-round. The Dump Day campaign became a consistent annual lead driver.",
        result: "Consistent brand visibility and a community-recognized annual campaign that drives local engagement.",
      }}
      faqs={[
        { q: "Does marketing work for project-based businesses?", a: "Yes — it just needs to be built differently. Instead of 'always on' campaigns, you plan ahead of your seasons and use content to stay visible in between projects." },
        { q: "What if I don't have a website at all?", a: "That's actually a great starting point. We can build you something clean and professional from scratch that immediately puts you ahead of most local competitors." },
        { q: "Can you help with before/after project photos?", a: "We can help you build a content plan around your project photos. Just send them — we'll turn them into posts, pages, and video content." },
        { q: "Do I need paid ads?", a: "Not necessarily. Many contractors see results from organic SEO and social without ad spend. Paid ads can accelerate results when you're ready." },
      ]}
      relatedLinks={[
        { label: "Local Lead Systems", href: "/local-lead-systems" },
        { label: "Website Rebuilds", href: "/website-rebuilds" },
        { label: "Seasonal Campaigns", href: "/seasonal-campaigns" },
        { label: "Social Media Content", href: "/social-media-content-system" },
        { label: "Free Gap Audit", href: "/gap-audit" },
      ]}
      formSource="ContractorMarketing"
    />
    </>
  );
}