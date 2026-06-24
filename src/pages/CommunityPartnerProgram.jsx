import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Users, TrendingUp, Handshake, ChevronRight, CheckCircle2, 
  ArrowRight, Phone, Globe, MapPin, BadgeDollarSign, ShieldCheck, PieChart, HeartHandshake, UserCircle, GraduationCap
} from 'lucide-react';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';

export default function CommunityPartnerProgram() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    organizationType: '',
    memberCount: '',
    serviceArea: '',
    comments: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const calendarLink = "https://calendar.app.google/p6ieYanvwhixXxZ67";

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <MarketingNav />
      {/* SECTION 1: HERO */}
      <section className="relative bg-slate-950 text-white pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 opacity-90" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950/0 to-slate-950/0" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-semibold mb-8 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <Handshake className="w-4 h-4" />
            NTA Community Partner Program
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 tracking-tight">
            NTA Community Partner Program
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            Help local businesses improve their digital visibility while creating new income and growth opportunities for yourself or your organization.
            <br /><br />
            <span className="font-bold text-blue-400 text-xl md:text-2xl">You sell. We deliver.</span>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#apply"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-blue-600/25"
            >
              Apply To Become A Community Partner
            </a>
            <a 
              href={calendarLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold px-8 py-4 rounded-xl transition-all"
            >
              Schedule A Discovery Call
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 2: WHO THIS PROGRAM IS FOR */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Who This Program Is For</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">Designed to empower relationship-driven professionals and community-focused organizations.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Card 1: Individual */}
            <div className="bg-slate-50 p-8 md:p-10 rounded-3xl border border-slate-200 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <UserCircle className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Individual Community Partners</h3>
              
              <div className="mb-8">
                <h4 className="font-semibold text-slate-900 mb-4 text-lg">Ideal for:</h4>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> Current media sales professionals</li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> Former radio, TV, newspaper, or digital reps</li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> Retired media professionals</li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> Independent sales professionals</li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> Business networkers</li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> Relationship-driven professionals</li>
                </ul>
              </div>
              
              <p className="text-slate-600 mb-8 flex-grow leading-relaxed">
                If you have built trust with local business owners and enjoy helping businesses grow, the Community Partner Program allows you to leverage those relationships while creating both upfront commission opportunities and recurring income. <strong className="text-blue-600">You sell. We deliver.</strong>
              </p>
              
              <a href="#apply" onClick={() => handleSelectChange('organizationType', 'Independent Professional')} className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold px-6 py-4 rounded-xl transition-all w-full text-center shadow-sm">
                Explore Individual Partner Opportunities
              </a>
            </div>

            {/* Card 2: Organization */}
            <div className="bg-slate-50 p-8 md:p-10 rounded-3xl border border-slate-200 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Organizational Community Partners</h3>
              
              <div className="mb-8">
                <h4 className="font-semibold text-slate-900 mb-4 text-lg">Ideal for:</h4>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" /> Chambers of Commerce</li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" /> Economic Development Organizations</li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" /> Main Street Programs</li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" /> Business Associations</li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" /> Community Development Groups</li>
                </ul>
              </div>
              
              <p className="text-slate-600 mb-8 flex-grow leading-relaxed">
                Provide valuable resources to your members, help local businesses improve their digital visibility, and create new non-dues revenue opportunities through strategic partnership.
              </p>
              
              <a href="#apply" onClick={() => handleSelectChange('organizationType', 'Chamber of Commerce')} className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold px-6 py-4 rounded-xl transition-all w-full text-center shadow-sm">
                Explore Organizational Partnership Opportunities
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: WHY MANY EXPERIENCED MEDIA PROFESSIONALS ARE LOOKING FOR A NEW MODEL */}
      <section className="py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 leading-tight">
            Why Many Experienced Media Professionals Are Looking For A New Model
          </h2>
          <div className="space-y-8 text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto text-left md:text-center">
            <p>Many media professionals entered the industry because they enjoy helping local businesses succeed.</p>
            <p>Today, many sales positions continue to offer compensation levels that have changed very little over the past several decades, while marketing has become increasingly complex.</p>
            <p>The NTA Community Partner Program provides an opportunity to build long-term recurring income by helping businesses improve their digital visibility, build trust, and grow consistently month after month.</p>
            <p className="text-blue-400 font-medium">Instead of selling a single advertising product, partners can introduce businesses to solutions that continue creating value over time.</p>
          </div>
        </div>
      </section>

      {/* SECTION 4: HOW PARTNERS CREATE VALUE */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How Partners Create Value</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">A simple, effective process that generates value for businesses while building your income. <strong className="text-blue-600">You sell. We deliver.</strong></p>
          </div>
          
          <div className="space-y-4">
            {[
              "Introduce Businesses To NTA",
              "Businesses Receive Digital Visibility Insights",
              "Businesses Gain Access To AI Learning & Marketing Solutions",
              "Partners Earn Upfront And Recurring Revenue",
              "Local Businesses Improve Their Competitive Position"
            ].map((step, idx) => (
              <div key={idx} className="flex items-center gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl shrink-0">
                  {idx + 1}
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-800">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: INCOME OPPORTUNITY (Keeps existing commission graphics) */}
      <section className="py-24 px-6 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Building Long-Term Relationship-Based Income</h2>
            
            <div className="flex flex-wrap justify-center gap-4 text-slate-700 font-medium mb-12">
              <span className="flex items-center gap-2 bg-slate-50 px-5 py-3 rounded-full border border-slate-200"><BadgeDollarSign className="w-5 h-5 text-blue-500" /> Upfront project commissions</span>
              <span className="flex items-center gap-2 bg-slate-50 px-5 py-3 rounded-full border border-slate-200"><TrendingUp className="w-5 h-5 text-blue-500" /> Recurring monthly income</span>
              <span className="flex items-center gap-2 bg-slate-50 px-5 py-3 rounded-full border border-slate-200"><Users className="w-5 h-5 text-blue-500" /> Long-term client relationships</span>
              <span className="flex items-center gap-2 bg-slate-50 px-5 py-3 rounded-full border border-slate-200"><MapPin className="w-5 h-5 text-blue-500" /> Territory growth potential</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { clients: "Approximately 10 Visibility Growth clients", revenue: "$595+", subtitle: "Per Month" },
              { clients: "Approximately 25 Visibility Growth clients", revenue: "$1,485+", subtitle: "Per Month", featured: true },
              { clients: "Approximately 50 Visibility Growth clients", revenue: "$2,975+", subtitle: "Per Month" }
            ].map((tier, idx) => (
              <div key={idx} className={`p-8 rounded-3xl border ${tier.featured ? 'bg-blue-600 border-blue-500 shadow-xl shadow-blue-600/20' : 'bg-slate-50 border-slate-200'} text-center relative`}>
                {tier.featured && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-950 text-blue-400 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
                    Average Goal
                  </div>
                )}
                <div className={`text-5xl font-black mb-2 ${tier.featured ? 'text-white' : 'text-blue-600'}`}>
                  {tier.revenue}
                </div>
                <div className={`text-sm font-bold uppercase tracking-wider mb-6 ${tier.featured ? 'text-blue-200' : 'text-slate-500'}`}>
                  {tier.subtitle}
                </div>
                <div className={`border-t pt-6 ${tier.featured ? 'border-blue-500/50' : 'border-slate-200'}`}>
                  <p className={`font-medium ${tier.featured ? 'text-white' : 'text-slate-700'}`}>
                    {tier.clients}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-500 text-sm mt-8">* Examples based on an average client value of our $397/month Visibility Growth package and a 15% recurring revenue share. Plus, you can earn upfront commission on setup fees (e.g. $497 setup). Actual results vary based on participation and service mix.</p>
        </div>
      </section>

      {/* SECTION 6: ORGANIZATIONAL PARTNER BENEFITS */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="bg-slate-950 p-10 md:p-16 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="text-center mb-12 relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Organizational Partner Benefits</h2>
              <p className="text-slate-400 text-lg">Empowering Chambers, Main Streets, and Associations</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 relative z-10">
              <div className="flex gap-5">
                <BadgeDollarSign className="w-8 h-8 text-blue-400 shrink-0" />
                <div>
                  <h3 className="font-bold text-xl mb-2">New Non-Dues Revenue</h3>
                  <p className="text-slate-400 leading-relaxed">Create reliable, sustainable non-dues revenue streams for your organization through local participation.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <Users className="w-8 h-8 text-blue-400 shrink-0" />
                <div>
                  <h3 className="font-bold text-xl mb-2">Additional Member Value</h3>
                  <p className="text-slate-400 leading-relaxed">Offer an exclusive, high-value technical program to your members without managing any of the fulfillment.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <Globe className="w-8 h-8 text-blue-400 shrink-0" />
                <div>
                  <h3 className="font-bold text-xl mb-2">Digital Visibility Resources</h3>
                  <p className="text-slate-400 leading-relaxed">Equip local businesses with the tools, audits, and insights they need to dominate local search.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <GraduationCap className="w-8 h-8 text-blue-400 shrink-0" />
                <div>
                  <h3 className="font-bold text-xl mb-2">AI Education</h3>
                  <p className="text-slate-400 leading-relaxed">Provide direct access to practical, actionable AI training via the NTA AI Learning Center.</p>
                </div>
              </div>
              <div className="flex gap-5 md:col-span-2 max-w-2xl mx-auto">
                <Building2 className="w-8 h-8 text-blue-400 shrink-0" />
                <div>
                  <h3 className="font-bold text-xl mb-2">Stronger Local Communities</h3>
                  <p className="text-slate-400 leading-relaxed">When local businesses thrive, adapt to technology, and capture market share, the entire community benefits economically.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 px-6 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/50 p-8 md:p-12 rounded-[2rem] border border-slate-700 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />
            
            <h2 className="text-3xl font-bold text-white mb-6 relative z-10">Do I need marketing or technical experience?</h2>
            
            <div className="text-slate-300 space-y-5 text-lg leading-relaxed relative z-10">
              <p className="font-bold text-white text-xl">No.</p>
              <p>
                If you've worked in radio, television, newspaper, direct mail, digital advertising, chamber sales, or business development, you already have the most important skill: <strong className="text-white">building relationships with local businesses.</strong>
              </p>
              <p>
                Your job is to introduce business owners to New Tech Advertising's visibility solutions. NTA handles the websites, marketing, content creation, automation, reporting, onboarding, and ongoing fulfillment.
              </p>
              <p className="text-blue-400 font-bold text-2xl pt-4">
                You sell. We deliver.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: CHOOSE YOUR PARTNER PATH & Application Form */}
      <section id="apply" className="py-24 px-6 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Choose Your Partner Path</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="#apply-form" 
              onClick={() => handleSelectChange('organizationType', 'Independent Professional')} 
              className="w-full sm:w-auto inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg"
            >
              Become An Individual Community Partner
            </a>
            <a 
              href="#apply-form" 
              onClick={() => handleSelectChange('organizationType', 'Chamber of Commerce')} 
              className="w-full sm:w-auto inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg"
            >
              Become An Organizational Community Partner
            </a>
          </div>
        </div>

        <div id="apply-form" className="max-w-3xl mx-auto">
          <div className="bg-slate-50 rounded-[2rem] shadow-xl p-8 md:p-12 border border-slate-200">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Partner Application</h2>
              <p className="text-slate-600">Fill out the form below to express your interest. Our partnership team will review your application and contact you shortly.</p>
            </div>

            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 text-center"
              >
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-900 mb-4">Application Received!</h3>
                <p className="text-emerald-700 text-lg">
                  Thank you for your interest in becoming a Community Partner. We'll contact you within one business day to discuss next steps.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Organization Name * (or "Independent")</label>
                    <input required name="organizationName" value={formData.organizationName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="e.g. Mason City Chamber / Independent" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Contact Name *</label>
                    <input required name="contactName" value={formData.contactName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Your full name" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Email Address *</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="you@organization.org" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Phone Number *</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="(555) 123-4567" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Website URL</label>
                  <input type="url" name="website" value={formData.website} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="https://www.yourorganization.org" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Organization Type *</label>
                    <select required name="organizationType" value={formData.organizationType} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">
                      <option value="">Select an option</option>
                      <option value="Independent Professional">Independent Professional / Individual</option>
                      <option value="Chamber of Commerce">Chamber of Commerce</option>
                      <option value="Main Street Organization">Main Street Organization</option>
                      <option value="Economic Development">Economic Development Group</option>
                      <option value="Merchant Association">Merchant Association</option>
                      <option value="Other">Other Local Organization</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Number of Members (Or Network Size)</label>
                    <select name="memberCount" value={formData.memberCount} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">
                      <option value="">Select an option</option>
                      <option value="1-50">1 - 50</option>
                      <option value="51-150">51 - 150</option>
                      <option value="151-500">151 - 500</option>
                      <option value="500+">500+</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Service Area (City/Region) *</label>
                  <input required name="serviceArea" value={formData.serviceArea} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="e.g. Mason City, North Iowa" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Additional Comments (Optional)</label>
                  <textarea name="comments" value={formData.comments} onChange={handleChange} rows="4" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none" placeholder="Tell us a little about your goals..." />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-lg shadow-lg"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Submit Application <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>
                <p className="text-center text-slate-500 text-sm">
                  We respect your privacy. Your information is secure.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}