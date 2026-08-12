import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock3, FileCheck2, Monitor, Search, Settings2 } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import LCRelatedArticles from '@/components/learning-center/LCRelatedArticles';

const workAreas = [
  {
    icon: Monitor,
    title: 'A dependable website foundation',
    description: 'NTA has continued developing and maintaining Johnson Heating’s website as the company, its services, and the way people search have changed.',
  },
  {
    icon: FileCheck2,
    title: 'Accurate business information',
    description: 'Recent work has included correcting contact information and company history so the website, metadata, listings, and other public signals agree.',
  },
  {
    icon: Search,
    title: 'Search and indexing cleanup',
    description: 'NTA has been identifying duplicate or competing URLs, reviewing sitemap and indexing issues, and improving the structured information search systems rely on.',
  },
  {
    icon: Settings2,
    title: 'Connected communication and reporting',
    description: 'The next stage includes dependable form delivery, clearer updates about completed work, and recurring website analytics that show what is happening over time.',
  },
];

export default function CaseStudyJohnsonHeating() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
      <SEOHead
        title="Johnson Heating & AC | Long-Term Client Case Study | NTA"
        description="An honest look at NTA’s long-term work with Johnson Heating & Air Conditioning: website development, accurate business information, search cleanup, and better reporting."
      />
      <MarketingNav />
      <div className="flex-grow pt-24 pb-12">
        <main className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>›</span>
            <Link to="/case-studies" className="hover:text-white">Case Studies</Link>
            <span>›</span>
            <span className="text-slate-300">Johnson Heating & AC</span>
          </div>

          <header className="mb-12">
            <span className="text-purple-400 font-bold uppercase tracking-wider text-sm">Long-Term Client Relationship</span>
            <h1 className="text-4xl md:text-5xl font-black text-white mt-3 mb-5 leading-tight">
              Johnson Heating & AC — Building a Digital Foundation That Can Keep Improving
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed">
              Johnson Heating & Air Conditioning has served the Mason City area since 1996. NTA’s relationship with the company has lasted roughly 14 years, moving from earlier advertising and website work toward a more accurate, connected, and measurable digital system.
            </p>
          </header>

          <div className="grid sm:grid-cols-3 gap-4 mb-14">
            {[
              { value: 'Since 1996', label: 'Johnson Heating in business' },
              { value: 'About 14 Years', label: 'Working relationship with NTA' },
              { value: '+33%', label: 'Website visits from Google profile, July 2026' },
            ].map(item => (
              <div key={item.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
                <div className="text-xl font-bold text-white">{item.value}</div>
                <div className="text-slate-400 text-sm mt-1">{item.label}</div>
              </div>
            ))}
          </div>

          <article className="prose prose-invert prose-lg max-w-none">
            <h2>The real challenge</h2>
            <p>
              A long-standing local company does not need a dramatic marketing story invented for it. It needs its online presence to reflect the real business accurately and keep pace as websites, search, customer expectations, and internal systems change.
            </p>
            <p>
              That work is rarely one finished project. Contact details change. Old pages remain indexed. Website platforms add their own metadata. Forms and notifications need testing. A business owner also deserves clearer evidence of what has been changed and what the website is doing.
            </p>

            <h2>What NTA has been working on</h2>
          </article>

          <div className="grid md:grid-cols-2 gap-4 my-8">
            {workAreas.map(item => (
              <div key={item.title} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <item.icon className="w-6 h-6 text-purple-400 mb-4" />
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <article className="prose prose-invert prose-lg max-w-none">
            <h2>What Google measured after the new website</h2>
            <p>
              Johnson’s current website was rebuilt with AI-assisted tools as part of NTA’s ongoing work to modernize the company’s digital foundation. Google’s July 2026 Business Profile report provides an early, independently reported signal that more people were finding and using that online presence.
            </p>
          </article>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
            {[
              { value: '508', label: 'Business Profile interactions' },
              { value: '127', change: '+33%', label: 'Website visits from the profile' },
              { value: '1,640', change: '+41%', label: 'Business Profile views' },
              { value: '310', change: '+189%', label: 'Searches that showed the profile' },
            ].map(item => (
              <div key={item.label} className="bg-emerald-500/10 border border-emerald-400/30 rounded-xl p-5">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">{item.value}</span>
                  {item.change && <span className="text-emerald-400 font-bold">{item.change}</span>}
                </div>
                <div className="text-slate-400 text-sm mt-2">{item.label}</div>
              </div>
            ))}
          </div>

          <article className="prose prose-invert prose-lg max-w-none">
            <p>
              Google compared July with the previous month. The same report also recorded 309 calls, up 58%, and 72 direction requests, up 1%. These are Business Profile results, not total website analytics, and one monthly report cannot isolate a single cause. The timing does, however, give NTA and Johnson a useful baseline: after the website rebuild and related visibility work, Google measured meaningful month-over-month growth in discovery and action.
            </p>

            <h2>What is established—and what is still being built</h2>
            <p>
              The established result is the relationship itself and the body of work behind it: Johnson has a current website foundation, NTA has continued correcting and improving that foundation, and the work is becoming better documented.
            </p>
          </article>

          <div className="space-y-3 my-8">
            {[
              'The company history is being represented correctly: Johnson Heating has operated since 1996; the roughly 14-year figure describes the NTA relationship.',
              'Current business information is being reconciled across the website, metadata, schema, and listings.',
              'Duplicate pages, sitemap issues, and indexing conflicts are being reviewed instead of assuming that publication alone solves visibility.',
              'Branded campaign and social-sharing materials have been developed using Johnson and Bryant identity where appropriate.',
              'Google’s July 2026 Business Profile report now provides verified month-over-month visibility and interaction data; recurring website analytics and form testing remain active improvement work.',
            ].map(item => (
              <div key={item} className="flex items-start gap-3 bg-slate-900/60 border border-slate-800 p-4 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>

          <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl p-6 my-10">
            <div className="flex items-center gap-2 text-amber-300 font-semibold mb-2"><Clock3 className="w-5 h-5" /> An honest case study in progress</div>
            <p className="text-slate-300 leading-relaxed">
              NTA is not turning one strong month into an unsupported “number one,” guaranteed-growth, or AI-recommendation claim. Google’s July 2026 report is credible evidence of increased Business Profile visibility and website visits from that profile. The longer-term story should continue to be measured through recurring analytics, search data, form testing, and Johnson’s own approved feedback.
            </p>
          </div>

          <article className="prose prose-invert prose-lg max-w-none">
            <h2>The lesson for another business owner</h2>
            <p>
              Long-term digital work is often less glamorous than a one-time redesign, but it is more useful. Accuracy, maintenance, search cleanup, communication, and measurement are what allow a website to remain part of the business instead of becoming another forgotten project.
            </p>
          </article>

          <div className="mt-12 bg-gradient-to-r from-purple-900/40 to-slate-900 border border-purple-500/30 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">Does your online presence still match your business?</h3>
            <p className="text-slate-400 mb-6 max-w-xl mx-auto">NTA starts by understanding what is true today, what is outdated, and what deserves attention first.</p>
            <Link to="/growth-guide" className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-3 rounded-xl">
              Talk to My Office™ <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-800">
            <Link to="/case-studies/monson-plumbing" className="w-full bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 text-purple-300 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2">
              Next: Monson Plumbing Case Study <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </main>

        <LCRelatedArticles articles={[
          { tag: 'Websites', title: 'Websites as Salespeople', description: 'Why a website should help people understand and trust the business.', link: '/websites-as-salespeople', date: 'Guide' },
          { tag: 'Trust', title: 'Building Digital Trust', description: 'How accurate, consistent information supports trust online.', link: '/building-digital-trust', date: 'Guide' },
        ]} />
      </div>
      <SiteFooter />
    </div>
  );
}
