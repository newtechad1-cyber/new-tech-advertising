import React from 'react';
import ServicePageLayout from '../components/service-pages/ServicePageLayout';

export default function SocialMediaContentSystem() {
  return (
    <ServicePageLayout
      seoTitle="Social Media Content for Local Service Businesses | NTA North Iowa"
      seoDescription="NTA creates and manages social media content for local service businesses in North Iowa — done-for-you posts, stories, and campaigns that keep you visible year-round."
      eyebrow="Social Media Content · North Iowa"
      headline="Stay Visible Year-Round Without Spending Hours on Social Media"
      subheadline="Done-for-you social content for local service businesses — consistent posts that keep your name in front of customers so you're the first call when they need you."
      problem={[
        "You know you should be posting but never have the time or ideas.",
        "Your Facebook page has been quiet for months — customers notice.",
        "You post occasionally but it's inconsistent and doesn't feel professional.",
        "Your competitors are posting regularly and staying top of mind.",
      ]}
      solution={[
        "Create a monthly content plan based on your services and seasons.",
        "Write, design, and schedule posts for you — you just approve them.",
        "Mix of educational, trust-building, and promotional content.",
        "Highlight real projects, customer stories, and local community involvement.",
        "Align content with seasonal campaigns for maximum impact.",
      ]}
      includes={[
        "Monthly content plan and calendar",
        "8–16 posts per month (depending on package)",
        "Copywriting and basic graphic design",
        "Scheduling and publishing",
        "Facebook and Instagram coverage",
        "Seasonal and promotional post coordination",
        "Monthly performance summary",
      ]}
      example={{
        client: "Monson Excavating — Dump Day Campaign",
        story: "Monson Excavating had an annual Dump Day event that local residents looked forward to. We built a social content plan around it — teaser posts, event details, behind-the-scenes photos, and follow-up content. The campaign kept their name active on Facebook and drove community engagement well beyond the event itself.",
        result: "Strong community engagement and consistent brand visibility in the local market.",
      }}
      faqs={[
        { q: "Do I have to provide photos?", a: "It helps, but it's not required. We can work with stock images, graphics, and any photos you have from job sites or your business." },
        { q: "How much time will this take on my end?", a: "We send you content for approval each month. Most clients spend less than 30 minutes per month reviewing and approving." },
        { q: "What if I don't like a post?", a: "We revise until you're happy. Your approval is required before anything goes out." },
        { q: "Does social media actually bring in business?", a: "For local service businesses, consistent social presence builds trust and keeps you top-of-mind. It works best combined with SEO and campaigns — not as a standalone." },
      ]}
      relatedLinks={[
        { label: "Seasonal Campaigns", href: "/seasonal-campaigns" },
        { label: "AI Video Marketing", href: "/ai-video-marketing" },
        { label: "Local Lead Systems", href: "/local-lead-systems" },
        { label: "HVAC Marketing", href: "/hvac-marketing-north-iowa" },
        { label: "Gap Audit", href: "/gap-audit" },
      ]}
      formSource="SocialMediaContent"
    />
  );
}