import { Link } from 'react-router-dom';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

export default function AccessibilityStatement() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <SEOHead
        title="Accessibility at New Tech Advertising"
        description="How to report an accessibility barrier on the NTA website or request another way to access a video, book, or service."
      />
      <MarketingNav />
      <main className="px-6 py-20">
        <article className="mx-auto max-w-3xl space-y-8 leading-relaxed">
          <h1 className="text-4xl font-bold text-white">Accessibility at New Tech Advertising</h1>
          <p className="text-lg">We want people to be able to use this public website, learn from its resources, and contact us in a way that works for them. We use WCAG 2.2 AA as a practical benchmark while we review and improve the site.</p>
          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">Tell us about a barrier</h2>
            <p>If a page, form, video, or book is difficult to use, please include the page address and what you were trying to do. We will help you get the information or complete the task while we work on the issue.</p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Email <a className="font-semibold text-blue-300 underline" href="mailto:info@newtechadvertising.com?subject=Website%20accessibility">info@newtechadvertising.com</a></li>
              <li>Call or text <a className="font-semibold text-blue-300 underline" href="tel:16414208816">641-420-8816</a></li>
              <li>Use the <Link className="font-semibold text-blue-300 underline" to="/contact">contact page</Link></li>
            </ul>
          </section>
          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">Current review</h2>
            <p>We are checking navigation, forms, zoom, contrast, images, video captions, and downloadable documents. The two free book PDFs need further document accessibility review, and caption accuracy on the videos has not been verified across the catalog. Ask us for an alternative format or help with any resource.</p>
          </section>
          <section>
            <h2 className="mb-3 text-2xl font-semibold text-white">How we evaluate</h2>
            <p>Automated checks can identify some problems. They cannot establish that every page and task works with a keyboard or assistive technology. We also need hands-on testing and retesting as content changes. We are not claiming that the website has completed a full WCAG conformance evaluation.</p>
          </section>
          <p className="text-sm text-slate-400">Last updated September 24, 2026.</p>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
