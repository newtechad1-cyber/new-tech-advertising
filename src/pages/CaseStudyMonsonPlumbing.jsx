import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, Monitor, Workflow, Wrench } from 'lucide-react';
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
    icon: Clock3,
    title: 'Practical adoption and training',
    description: 'Jay likes the back-office idea and wants to use it, but his workload has made it difficult to set aside time to learn a system that still feels unfamiliar. NTA is working to make adoption simpler and more comfortable.',
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
        description="How Monson Plumbing’s new website began bringing in business even while its Google Business Profile setup remained unresolved."
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
            <span className="text-cyan-400 font-bold uppercase tracking-wider text-sm">Early Results · Work Still in Development</span>
            <h1 className="text-4xl md:text-5xl font-black text-white mt-3 mb-5 leading-tight">
              Monson Plumbing — A Website Producing Business Before the Full Setup Is Finished
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed">
              Monson Plumbing, Heating & Excavating is a Mason City trades business rebuilding its momentum. The complete digital foundation is not finished, but Jay Monson says the new website is already bringing him business—and he credits NTA’s work with helping make the business busier than it has been since he restarted it.
            </p>
          </header>

          <article className="prose prose-invert prose-lg max-w-none">
            <h2>The starting point</h2>
            <p>
              The challenge was not to manufacture a new story for Monson. It was to organize a real business with several service lines, existing local relationships, field employees, equipment, and a growing set of opportunities.
            </p>
            <p>
              That requires more than putting up a website. The public message, current services, photographs, logos, and future operating tools all need to agree—and the work has to remain practical for the people using it.
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
              'The updated website is live and is already bringing Monson new business, according to Jay Monson.',
              'Google Business Profile setup remains unresolved after repeated attempts to complete Google’s verification process.',
              'Current photography and business assets have been organized to represent Monson’s real people, equipment, and work accurately.',
              'The exact Monson pipe-and-droplet symbol is the approved brand reference; substitutes or redrawn versions should not be used.',
              'Video, tracking, analytics, and back-office work remain in development.',
              'Jay wants to use the new back office, but training and regular adoption have not happened yet because his workload makes it difficult to set aside the necessary time.',
            ].map(item => (
              <div key={item} className="flex items-start gap-3 bg-slate-900/60 border border-slate-800 p-4 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>

          <article className="prose prose-invert prose-lg max-w-none">
            <h2>Early evidence before the full foundation is complete</h2>
            <p>
              The most important result so far is straightforward: Jay says the website is bringing him business. He reports that Monson is busier than it has been since he restarted the company, and he credits NTA’s work with helping create that momentum.
            </p>
            <p>
              That result is especially meaningful because one major part of the local-visibility setup is still missing. NTA and Jay have tried repeatedly to complete the Google Business Profile process using Google’s instructions, but the profile has not yet been approved. The website is producing value even without the full Google setup, additional tracking, or the planned connected back-office system in place.
            </p>
            <p>
              This is Jay’s account of what is happening in his business, not a claim that every new job can be traced to one website metric. It is credible early evidence that a clearer, more useful digital presence is already helping.
            </p>
          </article>

          <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl p-6 my-10">
            <div className="flex items-center gap-2 text-amber-300 font-semibold mb-2"><Clock3 className="w-5 h-5" /> Why this is labeled “in development”</div>
            <p className="text-slate-300 leading-relaxed">
              The Google Business Profile still needs to be approved, and the back office has not yet become part of Jay’s regular workflow. NTA is not claiming verified rankings or assigning an exact number of leads to the website. The supported result is Jay’s report that the website is bringing him business and that the company is busier than it has been since restarting.
            </p>
          </div>

          <article className="prose prose-invert prose-lg max-w-none">
            <h2>The lesson so far</h2>
            <p>
              A useful digital system can begin creating value before every piece is finished. For Monson, the website is already helping generate business while the Google profile, tracking, content, and back-office work continue to develop. Jay wants the back-office capability, but a new system can still feel unfamiliar or intimidating when an owner is already busy doing the work. The next step is not to pressure him—it is to make the learning process simpler, work around his available time, and help the system become useful in the way he actually runs the business.
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
