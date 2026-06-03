import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { 
  CheckCircle, ArrowRight, Star, BarChart2, Share2, Video, Search,
  AlertTriangle, DollarSign, ImageOff, MessageSquareWarning, MapPin, 
  Settings, Activity, ThumbsUp, Smartphone, FileText
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const DATA = {
  industry: 'Dentist',
  headline: 'Attract New Dental Patients on Autopilot',
  subheadline: 'Patients choose their dentist based on online reputation. Our AI platform manages your social media, builds 5-star reviews, and keeps your schedule full — all automatically.',
  color: '#06b6d4',
  stats: [
    { value: '40+', label: 'New patients per month avg' },
    { value: '4.9★', label: 'Average Google rating' },
    { value: '90%', label: 'Patients check reviews before booking' },
    { value: '15min', label: 'Weekly time investment' },
  ],
  contentExamples: [
    {
      companyName: 'Bright Smile Dental',
      platform: 'Instagram',
      caption: '😁 Smile transformation Tuesday! Meet Sarah — she came to us feeling self-conscious about her smile. After Invisalign and professional whitening, she can\'t stop smiling! Ready for your transformation? DM us for a free consultation.',
      hashtags: '#SmileTransformation #Invisalign #DentalCare #BrightSmile',
      likes: 312,
      comments: 67,
    },
    {
      companyName: 'Family First Dentistry',
      platform: 'Facebook',
      caption: '🦷 Back to school dental reminder! Make sure your kids\' teeth are healthy before the school year starts. We\'re booking back-to-school checkups now — call or book online. Most insurances accepted!',
      hashtags: '#BackToSchool #KidsDentist #FamilyDentistry',
      likes: 78,
      comments: 22,
    },
    {
      companyName: 'Premier Dental Group',
      platform: 'Google Business',
      caption: 'February is National Children\'s Dental Health Month! We\'re offering free sealant applications for new pediatric patients all month. Help your child start healthy habits early — book now.',
      hashtags: '',
      likes: 52,
      comments: 14,
    },
  ],
  testimonial: {
    quote: 'We went from 23 reviews to 190 in six months. New patients tell us every week they picked us because of our Google rating. The ROI is insane.',
    author: 'Dr. Amanda K.',
    company: 'Bright Smile Dental, Phoenix AZ',
  },
  faqs: [
    {
      question: "How much does dental marketing cost?",
      answer: "Most private dental practices spend $1,000-$3,000/month on their marketing. The average new patient is worth $1,200+ in lifetime revenue, meaning even one new patient per month from organic search easily justifies the investment. NTA's approach focuses on owned assets (SEO, reviews, content) that compound in value over time, rather than rented visibility like PPC ads."
    },
    {
      question: "I already use RevenueWell/Sesame/Officite — why would I switch?",
      answer: "Most dental-specific marketing companies use template websites you don't actually own, charge high monthly fees for automated tools that cost $50/month wholesale, and lock you into restrictive contracts. If you leave them, you lose your website and start over. NTA builds custom digital assets that you own forever, providing a true competitive advantage."
    },
    {
      question: "How do I get more Google reviews without annoying patients?",
      answer: "We use an automated text/email system that sends a review request 2-4 hours after the appointment when the positive experience is fresh. The message is friendly and takes the patient 30 seconds to complete. Most patients are genuinely happy to leave a review — they just need to be asked at the exact right time with zero friction."
    },
    {
      question: "Can you help me rank for specific procedures like implants or Invisalign?",
      answer: "Absolutely. We build procedure-specific landing pages with proper schema markup. These high-intent searches convert at much higher rates than generic 'dentist near me' searches. Ranking locally for high-value procedure terms directly positions your practice as the specialist in your area, driving higher case acceptance."
    },
    {
      question: "Do I need to be on social media as a dentist?",
      answer: "Social media isn't about going viral — it's about validating your practice when potential patients check you out before booking. A practice with an active, professional social presence looks significantly more trustworthy than one with a Facebook page that hasn't posted since 2022. NTA handles it completely so you don't have to worry about it."
    }
  ]
};

const PLAN_FEATURES = {
  Starter: ['12 AI social posts/mo', 'AI blog generator', 'Review monitoring', 'Basic analytics', '$197/mo'],
  Growth: ['20 AI social posts/mo', 'AI video creation', 'SEO automation', 'Content calendar', '$297/mo'],
  Pro: ['AI video campaigns', 'Reputation automation', 'Advanced analytics', 'Priority support', '$497/mo'],
};

export default function DentistMarketing() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-300 font-sans">
      <SEOHead 
        title="Dentist Marketing | AI Marketing for Dental Practices"
        description="AI-driven marketing for dental practices. Patient acquisition, Google Business Profile, social media & review management. New Tech Advertising."
        faqs={DATA.faqs}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": "Dental Practice Marketing",
          "provider": {
            "@type": "Organization",
            "name": "New Tech Advertising",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "15 E State St, Suite 201",
              "addressLocality": "Mason City",
              "addressRegion": "IA",
              "postalCode": "50401",
              "addressCountry": "US"
            },
            "telephone": "641-420-8816"
          },
          "areaServed": [
            { "@type": "City", "name": "Mason City", "addressRegion": "IA" },
            { "@type": "City", "name": "Clear Lake", "addressRegion": "IA" },
            { "@type": "City", "name": "Fort Dodge", "addressRegion": "IA" },
            { "@type": "City", "name": "Charles City", "addressRegion": "IA" },
            { "@type": "City", "name": "Garner", "addressRegion": "IA" },
            { "@type": "City", "name": "Forest City", "addressRegion": "IA" },
            { "@type": "City", "name": "Algona", "addressRegion": "IA" },
            { "@type": "City", "name": "Rochester", "addressRegion": "MN" },
            { "@type": "City", "name": "Albert Lea", "addressRegion": "MN" },
            { "@type": "City", "name": "Austin", "addressRegion": "MN" }
          ]
        })
      }} />

      <MarketingNav />

      {/* Hero */}
      <section className="pt-24 pb-16 px-4 relative overflow-hidden border-b border-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-10"
          style={{ background: DATA.color }} />
        <div className="relative max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest mb-4 block" style={{ color: DATA.color }}>
                {DATA.industry} Marketing
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
                {DATA.headline}
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                {DATA.subheadline}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to={createPageUrl('Get-Started')}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-cyan-600/20">
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to={createPageUrl('Book-Call')}
                  className="border border-slate-700 hover:border-slate-500 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all">
                  Book Demo
                </Link>
              </div>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {DATA.stats.map((s, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <p className="text-3xl md:text-4xl font-extrabold text-white mb-1" style={{ color: DATA.color }}>{s.value}</p>
                  <p className="text-slate-400 text-sm font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Dental Practices Struggle to Grow Online */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white mb-6">Why Dental Practices Struggle to Grow Online</h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Clinical excellence alone doesn't fill your waiting room anymore. If you're struggling to attract consistent new patients, you are likely facing these four industry challenges.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-6">
                <DollarSign className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Corporate DSOs Are Outspending You</h3>
              <p className="text-slate-400 leading-relaxed">New patient acquisition costs keep climbing. Corporate DSOs are outspending private practices on Google Ads 10-to-1, making traditional pay-per-click increasingly unaffordable for solo or small group practices.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-6">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">The Reputation Deficit</h3>
              <p className="text-slate-400 leading-relaxed">Patients choose dentists based on Google reviews and proximity before anything else. A practice with 40 reviews and a 4.2 rating loses to the one across town with 200 reviews at 4.8 stars, even if your clinical care is identical.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center mb-6">
                <ImageOff className="w-6 h-6 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Template Website Trap</h3>
              <p className="text-slate-400 leading-relaxed">Most dental websites are template-based packages sold by dental-specific marketing companies that look the same, say the exact same things, and provide zero competitive advantage in local search rankings.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-6">
                <AlertTriangle className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Aggregator Dependence</h3>
              <p className="text-slate-400 leading-relaxed">Insurance directories and aggregators control the patient relationship and take a commission. The patient thinks they found you through their insurance or Zocdoc, completely diluting your brand marketing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Build for Dental Practices */}
      <section className="py-20 px-6 bg-slate-900 border-y border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white mb-6">What We Build for Dental Practices</h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              We build custom digital infrastructure designed to attract high-value patients, increase case acceptance, and eliminate your reliance on paid ads.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl">
              <Search className="w-8 h-8 text-cyan-500 mb-5" />
              <h3 className="text-lg font-bold text-white mb-3">New Patient Local SEO</h3>
              <p className="text-slate-400 text-sm leading-relaxed">We optimize your practice so you rank for "dentist near me," "emergency dentist [city]," and specific procedure searches like "dental implants [city]." Local SEO compounds over time — unlike paid ads that vanish when you stop paying.</p>
            </div>
            
            <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl">
              <Star className="w-8 h-8 text-cyan-500 mb-5" />
              <h3 className="text-lg font-bold text-white mb-3">Automated Review Generation</h3>
              <p className="text-slate-400 text-sm leading-relaxed">After every appointment, patients receive a friendly text or email asking for a Google review. No front desk reminders, no awkward asks. Consistent review flow is the single biggest factor in local search ranking for dental practices.</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl">
              <MapPin className="w-8 h-8 text-cyan-500 mb-5" />
              <h3 className="text-lg font-bold text-white mb-3">Google Business Profile Optimization</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Weekly posts showcasing your team, office environment, new technology, and patient education content. Dental practices that treat their GBP as an active marketing channel get 3-5x more profile views.</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl">
              <FileText className="w-8 h-8 text-cyan-500 mb-5" />
              <h3 className="text-lg font-bold text-white mb-3">Procedure-Specific Content Pages</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Individual pages for implants, veneers, Invisalign, emergency dentistry, and cosmetic procedures. When a patient searches "how much do dental implants cost in [city]," your page should be the answer.</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl">
              <Share2 className="w-8 h-8 text-cyan-500 mb-5" />
              <h3 className="text-lg font-bold text-white mb-3">Social Media Without the Cringe</h3>
              <p className="text-slate-400 text-sm leading-relaxed">We build content calendars around real practice moments — team spotlights, before/after cases, and office culture — not the generic stock photo posts that every dental marketing company pushes. Real content performs better.</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl">
              <BarChart2 className="w-8 h-8 text-cyan-500 mb-5" />
              <h3 className="text-lg font-bold text-white mb-3">Monthly Performance Reports</h3>
              <p className="text-slate-400 text-sm leading-relaxed">How many people found your practice online, how many booked appointments, which procedures are generating the most search interest. No marketing jargon. Clear, actionable, one page.</p>
            </div>
          </div>
        </div>
      </section>

      {/* THE DENTAL MARKETING TRAP */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-cyan-900/80 to-slate-900 border border-cyan-800/50 rounded-3xl p-10 md:p-14 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Settings className="w-48 h-48 text-white" />
          </div>
          <div className="relative z-10">
            <span className="text-cyan-300 font-bold uppercase tracking-wider text-sm mb-4 block">The Dental Marketing Trap</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 leading-tight">Stop Paying $3,000/Month for a Template Website and Bought Reviews</h2>
            <p className="text-lg text-cyan-100/90 leading-relaxed mb-6">
              The dental marketing industry is full of companies that charge $2,000-$5,000/month for a cookie-cutter website, a handful of social media posts, and "reputation management" that amounts to emailing patients a review link. They lock you into contracts, own your website, and if you leave, you start from zero.
            </p>
            <p className="text-lg text-cyan-100/90 leading-relaxed">
              We do it differently. You own everything we build. Your website, your content, your data. We focus on organic growth that compounds over time rather than paid advertising that stops the day you stop writing checks. A private dental practice doesn't need a massive budget — it needs a smart local strategy executed consistently.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICE AREAS */}
      <section className="py-20 px-6 border-y border-slate-800 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-white mb-6">Service Areas</h2>
              <p className="text-lg text-slate-400 leading-relaxed mb-6">
                We work with private dental practices, group practices, and specialty offices across Iowa and Southern Minnesota. If you're competing against corporate DSOs for new patients, we level the playing field.
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg">
              <ul className="grid grid-cols-2 gap-y-4 gap-x-6 text-slate-300">
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-500" /> Mason City, IA</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-500" /> Clear Lake, IA</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-500" /> Fort Dodge, IA</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-500" /> Charles City, IA</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-500" /> Garner, IA</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-500" /> Forest City, IA</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-500" /> Algona, IA</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-500" /> Rochester, MN</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-500" /> Albert Lea, MN</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-500" /> Austin, MN</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Content Examples */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-3">
              AI-Generated Content Examples
            </h2>
            <p className="text-slate-400">Real examples of posts our AI creates for {DATA.industry.toLowerCase()} practices</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {DATA.contentExamples.map((ex, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: DATA.color }}>{DATA.industry[0]}</div>
                  <div>
                    <p className="text-white text-sm font-semibold">{ex.companyName}</p>
                    <p className="text-slate-500 text-xs">{ex.platform}</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">{ex.caption}</p>
                {ex.hashtags && <p className="text-cyan-400 text-xs">{ex.hashtags}</p>}
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-800">
                  <span className="text-xs text-slate-500">❤️ {ex.likes} likes</span>
                  <span className="text-xs text-slate-500">💬 {ex.comments} comments</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages / Features Comparison */}
      <section className="py-16 px-4 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-white mb-4">
                Choose the right plan for your practice
              </h2>
              <p className="text-slate-400 mb-8">
                Our AI platform handles your marketing automatically — so you can focus on patient care. No hidden fees.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${DATA.color}22`, border: `1px solid ${DATA.color}44` }}>
                    <Star className="w-4 h-4" style={{ color: DATA.color }} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Review Generation</p>
                    <p className="text-slate-500 text-xs mt-0.5">Automated patient review requests post-appointment.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${DATA.color}22`, border: `1px solid ${DATA.color}44` }}>
                    <Share2 className="w-4 h-4" style={{ color: DATA.color }} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Patient Education Content</p>
                    <p className="text-slate-500 text-xs mt-0.5">Engaging posts about dental tips and service spotlights.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${DATA.color}22`, border: `1px solid ${DATA.color}44` }}>
                    <Search className="w-4 h-4" style={{ color: DATA.color }} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Local Dental SEO</p>
                    <p className="text-slate-500 text-xs mt-0.5">Rank for "dentist near me" and high-value terms.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {Object.entries(PLAN_FEATURES).map(([name, feats], i) => (
                <div key={name} className={`rounded-2xl p-5 border ${i === 1 ? 'border-cyan-500/40 bg-cyan-900/10' : 'border-slate-800 bg-slate-900'}`}>
                  {i === 1 && <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2 block">Most Popular</span>}
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-white font-bold">{name}</p>
                    <p className="text-slate-300 font-bold">{feats[feats.length - 1]}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {feats.slice(0, -1).map(f => (
                      <span key={f} className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-400" /> {f}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <Link to={createPageUrl('Pricing')}
                className="block text-center text-cyan-400 hover:text-cyan-300 text-sm underline">
                View full plan comparison →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4 border-t border-slate-800 bg-slate-900/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-white mb-4">Frequently Asked Questions</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {DATA.faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-slate-800">
                <AccordionTrigger className="text-left text-lg font-semibold text-white hover:text-slate-300 py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-400 leading-relaxed text-base pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 px-4 border-t border-slate-800">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
          </div>
          <blockquote className="text-xl text-white font-medium leading-relaxed mb-4">
            "{DATA.testimonial.quote}"
          </blockquote>
          <p className="text-slate-400 text-sm">— {DATA.testimonial.author}, {DATA.testimonial.company}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 border-t border-slate-800">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Ready to grow your practice?
          </h2>
          <p className="text-slate-400 mb-8">Take control of your online presence and attract high-value patients organically.</p>
          <Link to={createPageUrl('Book-Call')}
            className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-cyan-600/20 text-lg">
            Book a Strategy Call <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-slate-600 text-sm mt-4">Questions? Call us at 641-420-8816</p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}