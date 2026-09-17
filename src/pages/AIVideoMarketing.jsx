import ServicePageLayout from '../components/service-pages/ServicePageLayout';
import SEOHead from '@/components/shared/SEOHead';
import VideoWorkShowcase from '@/components/video-gallery/VideoWorkShowcase';

const title = 'Video Production & Business Storytelling | NTA';
const description = 'See NTA video examples and explore short business profiles, brand messages, educational videos, and stories that help people understand your work.';

export default function AIVideoMarketing() {
  return (
    <>
      <SEOHead title={title} description={description} />
      <ServicePageLayout
        seoTitle={title}
        seoDescription={description}
        eyebrow="Video production & storytelling"
        headline="Help people see what your business does."
        subheadline="Explain your services, introduce the people behind your business, or answer a customer’s question. We start with the message and choose a video format that fits."
        showcase={<VideoWorkShowcase />}
        problem={[
          "You know your business, but explaining it clearly in a short video takes preparation.",
          "Customers may want to understand your work before they are ready to call.",
          "Writing, filming, editing, and keeping information current can be difficult to fit into the workday.",
        ]}
        solution={[
          "Start with the business, the audience, and one useful message.",
          "Prepare the script and choose a format: business profile, brand story, demonstration, or teaching conversation.",
          "Use your footage, a presenter, graphics, or AI assistance where it helps tell the story.",
          "Review the finished video together before publishing, then connect it to the relevant page on your website.",
        ]}
        includes={[
          "Message and topic planning",
          "Script preparation and review",
          "Video production and editing",
          "Branding, captions, and graphics",
          "Formats suited to your website and social channels",
          "YouTube and website connections",
        ]}
        faqs={[
          { q: "Do I need to be on camera?", a: "No. Depending on the message, we can work with your footage, screen recordings, graphics, or an AI presenter. If you want to appear yourself, we can build the video around that." },
          { q: "Can I see examples first?", a: "Yes. The examples above show public work from NTA’s YouTube channel. The gallery includes more video work and educational conversations so you can explore the approach." },
          { q: "How often should we make videos?", a: "That depends on the questions customers ask, what is changing in your business, and the time and budget available. We agree on the scope and schedule together." },
          { q: "How does this connect to my website?", a: "A video belongs beside the service, question, or story it explains. Useful written information gives visitors another way to understand the same subject, while YouTube provides another place to watch." },
        ]}
        relatedLinks={[
          { label: "Video Gallery", href: "/learning-center/videos" },
          { label: "Knowledge Library", href: "/knowledge" },
          { label: "NTA Growth Show", href: "/growth-show" },
          { label: "Client Stories", href: "/case-studies" },
          { label: "Social Media Content", href: "/social-media-content-system" },
        ]}
        formSource="AIVideoMarketing"
      />
    </>
  );
}