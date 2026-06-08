import React, { useRef, useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { CheckCircle, DollarSign, MapPin, Users, Zap, TrendingUp, Star, ArrowRight, Building2, Paperclip } from 'lucide-react';

const BENEFITS = [
  {
    icon: MapPin,
    title: 'Early Territory Opportunity',
    desc: 'Get in now before markets are saturated. Rochester and surrounding communities are primed for growth — and the first movers win.',
  },
  {
    icon: DollarSign,
    title: 'Recurring Income Potential',
    desc: 'Every client you bring on generates ongoing monthly commissions. Your income grows as your active client base grows.',
  },
  {
    icon: Zap,
    title: 'Innovative But Understandable Solutions',
    desc: "NTA's tools are built for real small businesses — no tech jargon, no confusion. You can explain them to any business owner over coffee.",
  },
  {
    icon: Users,
    title: 'High-Tech + High-Touch Support',
    desc: "You're not out there alone. We back you with proven materials, onboarding support, and a team that helps you close and deliver.",
  },
  {
    icon: TrendingUp,
    title: 'Expanding Growth Markets',
    desc: "We're strategically targeting regional markets with high business density and low competition. Now is the time to plant your flag.",
  },
];

const EARNINGS = [
  {
    label: 'Single Install',
    install: '$5,000 install',
    detail: '20–30% commission',
    result: '$1,000–$1,500 earned',
    color: 'border-blue-200 bg-blue-50',
    accent: 'text-blue-700',
  },
  {
    label: '10 Active Clients',
    install: '10 clients @ $600/mo avg',
    detail: '$6,000/mo recurring revenue',
    result: '$600–$1,200/mo partner income',
    color: 'border-violet-200 bg-violet-50',
    accent: 'text-violet-700',
  },
  {
    label: '25 Active Clients',
    install: '25 clients @ $600/mo avg',
    detail: '$15,000/mo recurring revenue',
    result: '$1,500–$3,000/mo + install commissions',
    color: 'border-emerald-200 bg-emerald-50',
    accent: 'text-emerald-700',
  },
];

const MARKETS = [
  'Rochester, MN', 'Austin, MN', 'Albert Lea, MN',
  'Mason City, IA', 'Mankato, MN', 'Winona, MN', 
  'Owatonna, MN', 'Faribault, MN', 'Red Wing, MN', 
  'Northfield, MN', 'Southern Minnesota', 'Northern Iowa',
];

const TERRITORIES = [
  {
    city: 'ROCHESTER, MN',
    badge: 'Anchor Market',
    population: '125K+',
    businesses: '5,000+',
    growth: 'Booming (Mayo-Fueled Growth)',
    desc: "Rochester is the fastest-growing city in Minnesota. Mayo Clinic's $5B+ expansion is bringing thousands of new residents and hundreds of new businesses every year. Most don't have a digital marketing strategy — they just know they need one.",
    nearby: ['Stewartville', 'Byron', 'Kasson', 'Dover', 'Pine Island', 'Chatfield', 'Eyota', 'Plainview', 'Zumbrota', 'Lake City'],
    counties: 'Olmsted, Dodge, Wabasha, Fillmore, Mower, Winona'
  },
  {
    city: 'MASON CITY, IA',
    badge: 'Home Base',
    population: '~28K',
    businesses: '1,500+',
    growth: 'Steady (Established Market)',
    desc: "NTA's home base — 14 years of serving North Iowa businesses. The commercial hub of North Iowa anchoring Cerro Gordo County with manufacturing, healthcare, retail, and service businesses.",
    nearby: ['Clear Lake', 'Charles City', 'Osage', 'Garner', 'Forest City', 'Northwood', 'Hampton', 'Sheffield', 'Nora Springs', 'Rockford'],
    counties: 'Cerro Gordo, Floyd, Mitchell, Worth, Hancock, Franklin'
  },
  {
    city: 'AUSTIN, MN',
    badge: 'I-90 Corridor',
    population: '~26K',
    businesses: '1,200+',
    growth: 'Stable (Emerging Digital Market)',
    desc: "Home to Hormel and the heart of Mower County. A blue-collar town with serious buying power. The Austin-Albert Lea corridor serves 80,000 people and 3,000+ businesses almost entirely underserved by digital agencies.",
    nearby: ['Albert Lea', 'Blooming Prairie', 'Hayfield', 'Adams', 'Lyle', 'Grand Meadow', 'Brownsdale'],
    counties: 'Mower, Freeborn, Steele, Dodge'
  },
  {
    city: 'MANKATO, MN',
    badge: 'University Market',
    population: '~44K',
    businesses: '2,500+',
    growth: 'Growing (University-Driven Growth)',
    desc: "The largest metro between the Twin Cities and Sioux Falls. Minnesota State University brings 15,000+ students. The Greater Mankato area has seen 15% population growth since 2010.",
    nearby: ['North Mankato', 'St. Peter', 'New Ulm', 'Waseca', 'Fairmont', 'Blue Earth', 'Le Sueur', 'Nicollet', 'Lake Crystal'],
    counties: 'Blue Earth, Nicollet, Le Sueur, Brown, Waseca, Watonwan'
  }
];

const IDEAL = [
  'Strong local business relationships in your community',
  'Outgoing, energetic personality — you open doors naturally',
  'Consultative sales mindset — you listen before you pitch',
  'Comfortable introducing new technology to business owners',
  'Genuine interest in helping local businesses grow',
  'Entrepreneurial attitude — you want to own your income',
];

export default function JoinNTA() {
  const formRef = useRef(null);
  const [form, setForm] = useState({
    full_name: '', city: '', territory: '', phone: '', email: '',
    current_role: '', business_relationships: '', interest_reason: '',
  });
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);

  useEffect(() => {
    if (form.city) {
      const lowerCity = form.city.toLowerCase();
      if (lowerCity.includes('rochester')) setForm(p => ({ ...p, territory: 'Rochester MN' }));
      else if (lowerCity.includes('mason')) setForm(p => ({ ...p, territory: 'Mason City IA' }));
      else if (lowerCity.includes('austin')) setForm(p => ({ ...p, territory: 'Austin MN' }));
      else if (lowerCity.includes('mankato')) setForm(p => ({ ...p, territory: 'Mankato MN' }));
      else if (lowerCity.includes('albert lea') || lowerCity.includes('owatonna')) setForm(p => ({ ...p, territory: 'Other Southern MN' }));
    }
  }, [form.city]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth' });
  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email) {
      setError('Please fill in your name and email.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const response = await base44.functions.invoke('submitRecruitingApplication', {
        ...form,
        resume_name: resume?.name || null,
        cover_letter_name: coverLetter?.name || null,
      });
      if (response.data?.error) throw new Error(response.data.error);
      setSubmitted(true);
    } catch (err) {
      console.error('JoinNTA submit error:', err);
      setError(err?.message || 'Something went wrong. Please try again or email us directly.');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Nav */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <a href="https://newtechadvertising.com"><img src="https://media.base44.com/images/public/691f41a18de4a7f498c8f884/62de67e4f_finalNTAlogo.png" alt="New Tech Advertising" className="h-10 w-auto object-contain" /></a>
        <button onClick={scrollToForm} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition">
          Apply Now
        </button>
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            Sales Partner Opportunity — Rochester &amp; Surrounding Markets
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
            Build Your Income Helping<br className="hidden sm:block" /> Local Businesses Grow
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">
            Join New Tech Advertising and represent AI-powered marketing, streaming media, and understandable growth solutions for local businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={scrollToForm} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-lg transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2">
              Explore the Opportunity <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={scrollToForm} className="border-2 border-white/30 hover:border-white/60 text-white font-semibold px-8 py-4 rounded-xl text-lg transition">
              Apply Now
            </button>
          </div>
        </div>
      </section>

      {/* LINKEDIN EMBED */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <p className="text-slate-500 text-sm uppercase tracking-widest font-semibold mb-6">See What We're Building</p>
          <div className="w-full flex justify-center overflow-hidden rounded-xl shadow-md">
            <iframe
              src="https://www.linkedin.com/embed/feed/update/urn:li:share:7440754038012399616?collapsed=1"
              height="574"
              width="504"
              frameBorder="0"
              allowFullScreen
              title="Embedded post"
              className="max-w-full"
            />
          </div>
        </div>
      </section>

      {/* OPPORTUNITY OVERVIEW */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-5">The Opportunity</h2>
          <p className="text-lg text-slate-700 mb-5 leading-relaxed">
            NTA is expanding in Rochester and surrounding regional markets — and we're looking for well-connected professionals who already have strong business relationships in their communities.
          </p>
          <p className="text-lg text-slate-700 mb-5 leading-relaxed">
            We're building a <strong>high-tech + high-touch growth network</strong> that helps small businesses increase visibility, generate leads, and grow with confidence. Our solutions are modern, proven, and — most importantly — easy for business owners to understand.
          </p>
          <p className="text-lg text-slate-700 leading-relaxed">
            We're looking for energetic, outgoing professionals who can open doors, build trust, and introduce marketing solutions that actually make sense.
          </p>
        </div>
      </section>

      {/* WHY JOIN NTA */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-14">Why Join NTA</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map(({ icon, title, desc }) => {
              const BenefitIcon = icon;
              return (
              <div key={title} className="border border-slate-200 rounded-2xl p-7 hover:shadow-md transition">
                <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <BenefitIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
              </div>
            );
            })}
          </div>
        </div>
      </section>

      {/* EARNINGS SNAPSHOT */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Earnings Snapshot</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Typical client installs generate strong upfront commissions. Recurring monthly income grows as your active client base grows.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {EARNINGS.map(({ label, install, detail, result, color, accent }) => (
              <div key={label} className={`rounded-2xl border-2 p-8 ${color}`}>
                <div className={`text-xs font-bold uppercase tracking-widest mb-4 ${accent}`}>{label}</div>
                <div className="text-slate-800 font-semibold mb-1">{install}</div>
                <div className="text-slate-600 text-sm mb-4">{detail}</div>
                <div className={`text-xl font-extrabold ${accent}`}>{result}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-500 text-sm mt-6">Earnings are illustrative examples based on typical scenarios. Individual results vary.</p>
        </div>
      </section>

      {/* WHO WE'RE LOOKING FOR */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Who We're Looking For</h2>
          <div className="space-y-4">
            {IDEAL.map((item) => (
              <div key={item} className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 text-lg">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TARGET MARKETS */}
      <section className="py-20 px-6 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Building2 className="w-10 h-10 mx-auto mb-4 text-blue-200" />
          <h2 className="text-3xl font-bold mb-4">Target Markets</h2>
          <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
            We are focused on strategic market expansion in high-opportunity regional business communities.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {MARKETS.map((m) => (
              <span key={m} className="bg-white/15 border border-white/30 text-white font-semibold px-5 py-2.5 rounded-full text-sm">
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* EXPLORE YOUR TERRITORY */}
      <section className="py-20 px-6 bg-slate-100 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <MapPin className="w-10 h-10 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Explore Your Territory</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              We are aggressively expanding into these key regional hubs. Claim your market and build your network.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {TERRITORIES.map((t, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col h-full hover:shadow-md transition">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{t.city}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      {t.badge}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-50 rounded-lg p-3 text-center border border-slate-100 flex flex-col justify-center">
                    <div className="text-xs text-slate-500 font-semibold mb-1">POPULATION</div>
                    <div className="font-bold text-slate-800">{t.population}</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 text-center border border-slate-100 flex flex-col justify-center">
                    <div className="text-xs text-slate-500 font-semibold mb-1">BUSINESSES</div>
                    <div className="font-bold text-slate-800">{t.businesses}</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 text-center border border-slate-100 flex flex-col justify-center">
                    <div className="text-xs text-slate-500 font-semibold mb-1">GROWTH</div>
                    <div className="font-bold text-slate-800 text-sm leading-tight">{t.growth}</div>
                  </div>
                </div>
                
                <p className="text-slate-700 leading-relaxed mb-6 flex-grow">{t.desc}</p>
                
                <div className="space-y-4 mb-8">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase mb-2">Nearby Markets</div>
                    <div className="flex flex-wrap gap-2">
                      {t.nearby.map(n => (
                        <span key={n} className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-md">{n}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">County Coverage</div>
                    <div className="text-sm text-slate-600">{t.counties}</div>
                  </div>
                </div>
                
                <button onClick={scrollToForm} className="mt-auto w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2">
                  Apply for {t.city} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPLICATION FORM */}
      <section ref={formRef} className="py-20 px-6 bg-slate-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <Star className="w-10 h-10 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Explore the Opportunity</h2>
            <p className="text-slate-600">Fill out the form below and we'll reach out if there's a fit.</p>
          </div>

          {submitted ? (
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-12 text-center">
              <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-800 mb-3">Application Received</h3>
              <p className="text-green-700 text-lg">Thank you. We will review your information and reach out if there is a fit.</p>
            </div>
          ) : (
            <>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-2xl mb-8">
                <h3 className="text-lg font-bold text-amber-900 mb-2">Important Requirement</h3>
                <p className="text-amber-800 leading-relaxed">
                  Before applying, please explore newtechadvertising.com to understand our vision, services, and approach. We're looking for people who catch the vision and want to build something meaningful — not just collect a paycheck.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
                    <input name="full_name" value={form.full_name} onChange={handleChange} required placeholder="Jane Smith" className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Home City</label>
                    <input name="city" value={form.city} onChange={handleChange} placeholder="Rochester, MN" className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Target Territory *</label>
                    <select name="territory" value={form.territory} onChange={handleChange} required className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
                      <option value="" disabled>Select a territory</option>
                      <option value="Rochester MN">Rochester, MN</option>
                      <option value="Mason City IA">Mason City, IA</option>
                      <option value="Austin MN">Austin, MN</option>
                      <option value="Mankato MN">Mankato, MN</option>
                      <option value="Other Southern MN">Other Southern MN</option>
                      <option value="Other Northern Iowa">Other Northern Iowa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="(507) 000-0000" className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-1 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email *</label>
                    <input name="email" value={form.email} onChange={handleChange} required type="email" placeholder="jane@example.com" className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Current Role</label>
                <input name="current_role" value={form.current_role} onChange={handleChange} placeholder="e.g. Insurance Sales, Account Manager, Business Owner..." className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tell us about your business relationships</label>
                <textarea name="business_relationships" value={form.business_relationships} onChange={handleChange} rows={3} placeholder="What types of businesses do you have relationships with? How did you build those connections?" className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Why are you interested in this opportunity?</label>
                <textarea name="interest_reason" value={form.interest_reason} onChange={handleChange} rows={3} placeholder="What excites you about this opportunity? What are you looking for?" className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none" />
              </div>
              <div className="border-t border-slate-100 pt-5 space-y-4">
                <p className="text-sm font-semibold text-slate-700">Upload Documents <span className="text-slate-400 font-normal">(optional)</span></p>
                <div>
                  <label className="block text-sm text-slate-600 mb-1.5">Resume</label>
                  <label className="flex items-center gap-3 cursor-pointer border border-dashed border-slate-300 hover:border-blue-400 rounded-lg px-4 py-3 transition">
                    <Paperclip className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-sm text-slate-500 truncate">
                      {resume ? resume.name : 'Choose file (PDF, DOC, DOCX)'}
                    </span>
                    <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => setResume(e.target.files[0] || null)} />
                  </label>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1.5">Cover Letter</label>
                  <label className="flex items-center gap-3 cursor-pointer border border-dashed border-slate-300 hover:border-blue-400 rounded-lg px-4 py-3 transition">
                    <Paperclip className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-sm text-slate-500 truncate">
                      {coverLetter ? coverLetter.name : 'Choose file (PDF, DOC, DOCX)'}
                    </span>
                    <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => setCoverLetter(e.target.files[0] || null)} />
                  </label>
                </div>
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-4 rounded-xl text-lg transition flex items-center justify-center gap-2">
                {submitting ? 'Submitting...' : <><span>Explore Opportunity</span><ArrowRight className="w-5 h-5" /></>}
              </button>
            </form>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-center py-8 px-6 text-sm">
        © {new Date().getFullYear()} New Tech Advertising · Rochester, MN · <a href="/" className="hover:text-white transition">newtechadvertising.com</a>
      </footer>
    </div>
  );
}