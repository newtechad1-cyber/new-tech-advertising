import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, Monitor, Store, Workflow, Wrench } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import LCRelatedArticles from '@/components/learning-center/LCRelatedArticles';

const workAreas = [
  {
    icon: Monitor,
    title: 'Website and service foundation',
    description: 'NTA has been updating the Monson website to better explain the company’s plumbing, heating, and excavating work and to reflect current business direction.',
  },
  {
    icon: Store,
    title: 'Brothers Ace relationship development',
    description: 'NTA has developed signs, brand concepts, and supporting materials for a working relationship in which Brothers Ace displays relevant products and Monson provides installation and service.',
  },
  {
    icon: Wrench,
    title: 'Brand and field assets',
    description: 'The work includes using Monson’s real pipe-and-droplet identity, current service-van photography, employee images, and polished materials that respect both businesses.',
  },
  {
    icon: Workflow,
    title: 'Back-office exploration',
    description: 'Monson is also the first practical model for shaping dispatching, invoicing, voice or text input, and a simpler single-login system around the way Jay actually works.',
  },
];

export default function CaseStudyMonsonPlumbing() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
      <SEOHead
        title="Monson Plumbing | Building a Connected Digital Presence | NTA"
        description="How NTA is helping Monson Plumbing, Heating & Excavating connect its website, branding, partnership materials, and practical back-office ideas."
      />
      <MarketingNav />
      <div className="flex-grow pt-24 pb-12">
        <main className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>›</span>
            <Link to="/case-studies" className="hover:text-white">Case Studies</Link>
            <span>›</span>
            <span className="text-slate-300">Monson Plumbing</span>
          </div>

          <header className="mb-12">
            <span className="text-cyan-400 font-bold uppercase tracking-wider text-sm">Client Work in Development</span>
            <h1 className="text-4xl md:text-5xl font-black text-white mt-3 mb-5 leading-tight">
              Monson Plumbing — Bringing the Real Business Into One Connected System
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed">
              Monson Plumbing, Heating & Excavating is an established Mason City trades business. NTA’s work has focused on making its website, brand, developing retail relationship, and future back-office tools reflect how Jay Monson’s business actually operates.
            </p>
          </header>

          <article className="prose prose-invert prose-lg max-w-none">
            <h2>The starting point</h2>
            <p>
              The challenge was not to manufacture a new story for Monson. It was to organize a real business with several service lines, existing local relationships, field employees, equipment, and a growing set of opportunities.
            </p>
            <p>
              That requires more than putting up a website. The public message, current services, photographs, logos, partnership materials, and future operating tools all need to agree—and the work has to remain practical for the people using it.
            </p>

            <h2>What NTA is building with Monson</h2>
          </article>

          <div className="grid md:grid-cols-2 gap-4 my-8">
            {workAreas.map(item => (
              <div key={item.title} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <item.icon className="w-6 h-6 text-cyan-400 mb-4" />
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <article className="prose prose-invert prose-lg max-w-none">
            <h2>Work completed and underway</h2>
          </article>

          <div className="space-y-3 my-8">
            {[
              'Website revisions have been approved and merged; live deployment still needs to be checked against the intended changes.',
              'New photography and business assets have been organized so Randy Mitchell, Sawyer Mishak, and their roles are represented accurately.',
              'Partnership sign concepts have been developed with equal, respectful billing for Monson and Brothers Ace.',
              'The exact Monson pipe-and-droplet symbol is the approved brand reference; substitutes or redrawn versions should not be used.',
              'Partnership landing-page, water-treatment, video, tracking, analytics, and back-office work remain in development.',
            ].map(item => (
              <div key={item} className="flex items-start gap-3 bg-slate-900/60 border border-slate-800 p-4 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>

          <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl p-6 my-10">
            <div className="flex items-center gap-2 text-amber-300 font-semibold mb-2"><Clock3 className="w-5 h-5" /> Why this is labeled “in development”</div>
            <p className="text-slate-300 leading-relaxed">
              Final public partnership wording and specific product or service claims still require confirmation from Jay Monson and Sawyer Mishak. NTA is not presenting Monson as “dominant online,” claiming verified search rankings, or claiming lead results that have not been documented.
            </p>
          </div>

          <article className="prose prose-invert prose-lg max-w-none">
            <h2>The lesson so far</h2>
            <p>
              A useful digital system begins with the real business. For Monson, that means the website, field identity, retail relationship, content, and back-office ideas should reinforce one another. The technology matters, but the collaboration—listening to how Jay works and building around it—is the more important part.
            </p>
          </article>

          <div className="mt-12 bg-gradient-to-r from-cyan-900/30 to-slate-900 border border-cyan-500/30 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">Your business may need a connected foundation, too.</h3>
            <p className="text-slate-400 mb-6 max-w-xl mx-auto">Start with the way your business really works, then decide what the website and systems should do.</p>
            <Link to="/growth-guide" className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-6 py-3 rounded-xl">
              Talk to My Office™ <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col gap-4">
            <Link to="/case-studies/johnson-heating" className="text-slate-400 hover:text-white font-medium flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Previous: Johnson Heating & AC
            </Link>
            <Link to="/case-studies/how-nta-became-a-digital-growth-office" className="w-full bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 text-purple-300 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2">
              Next: How NTA Became a Digital Growth Office <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </main>

        <LCRelatedArticles articles={[
          { tag: 'Websites', title: 'Websites as Salespeople', description: 'Why the website must reflect the real business.', link: '/websites-as-salespeople', date: 'Guide' },
          { tag: 'Trust', title: 'Building Digital Trust', description: 'How consistent information and real evidence build confidence.', link: '/building-digital-trust', date: 'Guide' },
        ]} />
      </div>
      <SiteFooter />
    </div>
  );
}
