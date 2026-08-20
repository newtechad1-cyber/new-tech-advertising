import ServicePageLayout from '../components/service-pages/ServicePageLayout';

import SEOHead from '@/components/shared/SEOHead';
export default function ContractorMarketingNorthIowa() {
  return (
    <>
      <SEOHead
        title="Contractor Marketing in Iowa & Southern Minnesota | NTA"
        description="Practical contractor marketing for Iowa, North Iowa, and Southern Minnesota: local SEO, useful content, social media, and follow-up systems."
      />
      <ServicePageLayout
      seoTitle="Contractor Marketing in Iowa & Southern Minnesota | NTA"
      seoDescription="A practical contractor marketing system for Iowa, North Iowa, and Southern Minnesota—local SEO, social media, service-area pages, and lead follow-up."
      eyebrow="Contractor Marketing · Iowa & Southern Minnesota"
      headline="A Practical Contractor Marketing System for Iowa & Southern Minnesota"
      subheadline="We help HVAC, plumbing, electrical, roofing, excavating, lawn care, landscaping, and other home-service businesses improve local visibility and follow up on the right inquiries across Iowa, North Iowa, and Southern Minnesota."
      problem={[
        "Project-based work means income is inconsistent — you need a system to fill the pipeline.",
        "You don't have time to market between jobs — and when you're slow, it's too late.",
        "Word-of-mouth alone isn't scaling your business the way you want it to.",
        "Bigger companies with better websites are winning bids you should be getting.",
      ]}
      solution={[
        "Build a professional website that shows your work and wins bids before you even talk to someone.",
        "Create useful service-area pages for the Iowa communities and Southern Minnesota markets you actually serve.",
        "Run campaign pages around project types — grading, dump services, seasonal work.",
        "Use video and before/after content to show the quality of your work.",
        "Set up a lead capture and follow-up system so inquiries get responses fast.",
      ]}
      includes={[
        "Contractor-focused website and messaging",
        "Project gallery and service pages",
        "Local SEO for Iowa and Southern Minnesota service areas",
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
        { q: "Can you help contractors outside North Iowa?", a: "Yes. We can work with contractors across Iowa and Southern Minnesota. We start with the communities and services you actually want to reach, so the content stays specific and useful instead of becoming a stack of thin location pages." },
        { q: "What if I don't have a website at all?", a: "That's actually a great starting point. We can build you something clean and professional from scratch that immediately puts you ahead of most local competitors." },
        { q: "Can you help with before/after project photos?", a: "We can help you build a content plan around your project photos. Just send them — we'll turn them into posts, pages, and video content." },
        { q: "Do I need paid ads?", a: "Not necessarily. Many contractors see results from organic SEO and social without ad spend. Paid ads can accelerate results when you're ready." },
      ]}
      relatedLinks={[
        { label: "Local Lead Systems", href: "/local-lead-systems" },
        { label: "Website Rebuilds", href: "/website-rebuilds" },
        { label: "Seasonal Campaigns", href: "/seasonal-campaigns" },
        { label: "Social Media Management", href: "/services/social-media-management" },
        { label: "Free Gap Audit", href: "/gap-audit" },
      ]}
      formSource="ContractorMarketing"
    />
    </>
  );
}