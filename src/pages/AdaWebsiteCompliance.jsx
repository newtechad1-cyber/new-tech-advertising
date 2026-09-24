import { Link } from 'react-router-dom';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

const reviewSteps = [
  { title: 'Identify barriers', body: 'Review representative pages and important tasks such as finding information, contacting us, signing up, and downloading resources.' },
  { title: 'Test the experience', body: 'Combine automated checks with keyboard, zoom, screen reader, and form testing. Include captions and documents in the review.' },
  { title: 'Fix and retest', body: 'Prioritize issues that block people, fix the underlying pages and content, and verify the tasks again after changes.' },
];

export default function AdaWebsiteCompliance() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <SEOHead
        title="Website Accessibility Review and Improvements | NTA"
        description="A practical approach to improving small business website accessibility through testing, repairs, and retesting."
      />
      <MarketingNav />
      <main className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 font-semibold text-amber-300">Website accessibility</p>
          <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl">Make Your Website Easier for People to Use</h1>
          <p className="max-w-3xl text-xl leading-relaxed text-slate-300">
            People should be able to learn about your business and contact you with a keyboard, screen reader, zoom, or other assistive technology. We can help find barriers and work through practical fixes.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/contact" className="rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500">Discuss an accessibility review</Link>
            <Link to="/accessible-websites" className="rounded-lg border border-slate-500 px-6 py-3 font-semibold text-white hover:bg-slate-800">How we approach the work</Link>
          </div>

          <section className="mt-20">
            <h2 className="text-3xl font-bold text-white">How a useful review works</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {reviewSteps.map(({ title, body }, index) => (
                <div key={title} className="rounded-xl border border-slate-700 bg-slate-900 p-6">
                  <p className="mb-3 font-bold text-amber-300">Step {index + 1}</p>
                  <h3 className="mb-3 text-xl font-semibold text-white">{title}</h3>
                  <p className="leading-relaxed text-slate-300">{body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16 rounded-xl border border-slate-700 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold text-white">About ADA and WCAG</h2>
            <p className="mt-4 leading-relaxed text-slate-300">
              The ADA applies to services offered online by businesses open to the public. WCAG is a useful technical benchmark for the work, but a quick scan, badge, or overlay cannot establish accessibility or legal compliance. A claim about compliance calls for a defined scope and a real evaluation of the site and its content.
            </p>
            <p className="mt-4 leading-relaxed text-slate-300">
              If you are experiencing a barrier on our own site, <Link to="/contact" className="font-semibold text-blue-300 underline hover:text-white">tell us which page and task</Link>. We can help you access the information while we address the issue.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
