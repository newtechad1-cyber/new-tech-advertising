import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Users, TrendingUp, Handshake, ChevronRight, CheckCircle2, 
  ArrowRight, Phone, Globe, MapPin, BadgeDollarSign, ShieldCheck, PieChart, HeartHandshake
} from 'lucide-react';

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
      {/* Hero Section */}
      <section className="relative bg-slate-950 text-white pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 opacity-90" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950/0 to-slate-950/0" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-semibold mb-8 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <Handshake className="w-4 h-4" />
            NTA Community Partner Program
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 tracking-tight">
            Help Local Businesses Grow.<br/>
            <span className="text-blue-500">Create Sustainable Revenue For Your Organization.</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            Partner with New Tech Advertising to help local businesses improve their visibility, reputation, and customer growth using affordable AI-powered marketing systems. Your members also gain access to practical AI training through the NTA AI Learning Center while your organization earns recurring revenue.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#apply"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-blue-600/25"
            >
              Apply To Become A Partner
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

      {/* Video Section */}
      <section className="py-16 px-6 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="relative w-full bg-black rounded-2xl overflow-hidden shadow-lg" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/7hw3Fp-pV18"
              title="NTA Community Partner Program"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Local businesses are falling behind in the digital age.
              </h2>
              <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                As a community organization, you see it every day. Main Street businesses struggling to compete with corporate giants, lacking the visibility, SEO, and modern tools to capture local customers.
              </p>
              <p className="text-slate-600 text-lg leading-relaxed">
                Meanwhile, your organization is constantly searching for non-dues revenue to fund your community initiatives. The NTA Community Partner Program solves both problems simultaneously.
              </p>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
              <div className="relative z-10 space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-6 h-6 text-red-600 rotate-180" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">The Challenge</h3>
                    <p className="text-slate-600">Local businesses lack the budget and expertise for enterprise-grade marketing.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                    <HeartHandshake className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">The Solution</h3>
                    <p className="text-slate-600">NTA provides AI-powered, affordable marketing systems that help local businesses improve visibility, strengthen their reputation, attract more customers, and compete more effectively in today's digital economy.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How The Partnership Works</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">We do the heavy lifting. You provide the connection. We both support the community.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 font-bold text-xl">1</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Introduce Us</h3>
              <p className="text-slate-600">Share free Digital Visibility Audits, practical AI training through the NTA AI Learning Center, and affordable AI-powered marketing solutions that help local businesses compete in today's digital economy.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 font-bold text-xl">2</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">We Deliver Results</h3>
              <p className="text-slate-600">Our team consults with the business, builds their AI-powered marketing system, and manages their ongoing digital growth.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 font-bold text-xl">3</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">You Earn Revenue</h3>
              <p className="text-slate-600">When businesses choose NTA through your partnership, your organization receives recurring revenue that can help fund programs, events, community initiatives, and member services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue Opportunity Examples */}
      <section className="py-20 px-6 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Revenue Opportunity</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Generate sustainable non-dues revenue while helping local businesses succeed.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { clients: "Approximately 10 participating businesses", revenue: "$520+", subtitle: "Per Month" },
              { clients: "Approximately 25 participating businesses", revenue: "$1,300+", subtitle: "Per Month", featured: true },
              { clients: "Approximately 50 participating businesses", revenue: "$2,600+", subtitle: "Per Month" }
            ].map((tier, idx) => (
              <div key={idx} className={`p-8 rounded-3xl border ${tier.featured ? 'bg-blue-600 border-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.3)]' : 'bg-slate-800 border-slate-700'} text-center relative`}>
                {tier.featured && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-400 text-blue-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    Average Goal
                  </div>
                )}
                <div className={`text-5xl font-black mb-2 ${tier.featured ? 'text-white' : 'text-blue-400'}`}>
                  {tier.revenue}
                </div>
                <div className={`text-sm font-medium mb-6 ${tier.featured ? 'text-blue-100' : 'text-slate-400'}`}>
                  {tier.subtitle}
                </div>
                <div className={`border-t pt-6 ${tier.featured ? 'border-blue-500' : 'border-slate-700'}`}>
                  <p className={`font-medium ${tier.featured ? 'text-white' : 'text-slate-300'}`}>
                    {tier.clients}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-500 text-sm mt-8">* Examples based on an average client value of approximately $347/month and a 15% recurring revenue share. Actual results vary based on participation and service mix.</p>
        </div>
      </section>

      {/* Benefits & Who Should Apply */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Benefits For Your Organization</h2>
            <ul className="space-y-6">
              {[
                { title: "Turnkey Member Benefit", text: "Provide cutting-edge marketing tech to your members without managing the services yourself." },
                { title: "Recurring Income", text: "Build a predictable revenue stream that compounds over time." },
                { title: "No Tech Expertise Needed", text: "We handle 100% of the fulfillment, support, and technical execution." },
                { title: "Community Growth", text: "When local businesses thrive online, the entire local economy benefits." },
                { title: "NTA AI Learning Center", text: "Provide your members with practical AI education, training, tools, tutorials, and business resources designed specifically for small and midsize businesses. Help local companies understand and adopt AI without needing technical expertise." }
              ].map((benefit, i) => (
                <li key={i} className="flex gap-4">
                  <div className="mt-1 shrink-0"><CheckCircle2 className="w-6 h-6 text-blue-500" /></div>
                  <div>
                    <h4 className="font-bold text-slate-900">{benefit.title}</h4>
                    <p className="text-slate-600">{benefit.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-slate-50 p-10 rounded-3xl border border-slate-200 h-fit">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Who Should Apply?</h2>
            <div className="grid gap-4">
              {[
                { icon: Building2, text: "Chambers of Commerce" },
                { icon: MapPin, text: "Main Street Organizations" },
                { icon: PieChart, text: "Economic Development Groups" },
                { icon: Users, text: "Merchant Associations" },
                { icon: Globe, text: "Local Business Networks" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-semibold text-slate-700">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Community Organizations Partner With NTA</h2>
            <p className="text-slate-600 text-lg">We are committed to helping local businesses thrive with practical, affordable solutions.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
            {[
              "Founded in Mason City and serving local businesses for more than 14 years",
              "AI-powered systems designed specifically for small and midsize businesses",
              "Affordable alternatives to large agency solutions",
              "Local support from a real team that understands Iowa and Southern Minnesota",
              "Decades of marketing, advertising, and digital business experience",
              "Proven systems that help businesses improve visibility, reputation, and growth"
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="mt-1 shrink-0"><ShieldCheck className="w-6 h-6 text-blue-500" /></div>
                <p className="text-slate-700 font-medium leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-24 px-6 bg-slate-100">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-[2rem] shadow-xl p-8 md:p-12 border border-slate-200">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Apply To Become A Partner</h2>
              <p className="text-slate-600">Fill out the form below to express your interest. Our partnership team will review your application and contact you within one business day.</p>
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
                    <label className="text-sm font-semibold text-slate-700">Organization Name *</label>
                    <input required name="organizationName" value={formData.organizationName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="e.g. Mason City Chamber" />
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
                      <option value="Chamber of Commerce">Chamber of Commerce</option>
                      <option value="Main Street Organization">Main Street Organization</option>
                      <option value="Economic Development">Economic Development Group</option>
                      <option value="Merchant Association">Merchant Association</option>
                      <option value="Other">Other Local Organization</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Number of Members</label>
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
                  <textarea name="comments" value={formData.comments} onChange={handleChange} rows="4" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none" placeholder="Tell us a little about your organization's goals..." />
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

      {/* Final CTA */}
      <section className="py-20 px-6 bg-slate-900 text-center border-t border-slate-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to empower your local business community?</h2>
          <p className="text-slate-400 text-lg mb-10">We do the work. You earn the revenue. The community thrives.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#apply"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20"
            >
              Apply Now
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
    </div>
  );
}