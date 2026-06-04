import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, ArrowLeft, Menu, X, LayoutDashboard, ShoppingBag, CalendarDays, Star, BarChart3, CheckCircle2 } from 'lucide-react';
import SiteFooter from '../components/marketing/SiteFooter';

export default function RestaurantSolutions() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToFeatures = () => {
    document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCTA = () => {
    document.getElementById('cta-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#0B1120] min-h-screen text-slate-300 font-sans selection:bg-amber-500/30">
      {/* Custom Nav Bar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0B1120]/90 backdrop-blur-md shadow-lg shadow-amber-900/5' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] group-hover:scale-110 transition-transform" />
            <span className="text-white font-bold text-lg tracking-tight">New Tech Advertising</span>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-slate-400 hover:text-white flex items-center gap-1.5 text-sm font-medium transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Main Site
            </Link>
            <button onClick={scrollToFeatures} className="text-slate-400 hover:text-white text-sm font-medium transition-colors">
              Features
            </button>
            <button onClick={scrollToHowItWorks} className="text-slate-400 hover:text-white text-sm font-medium transition-colors">
              How It Works
            </button>
            <button onClick={scrollToCTA} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-lg text-sm transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              Get Started
            </button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-slate-300 hover:text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-[#0B1120] border-t border-slate-800 shadow-xl py-4 px-4 flex flex-col gap-4">
            <Link to="/" className="text-slate-300 hover:text-white py-2 flex items-center gap-2 font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Main Site
            </Link>
            <button onClick={() => { scrollToFeatures(); setMobileOpen(false); }} className="text-left text-slate-300 hover:text-white py-2 font-medium">Features</button>
            <button onClick={() => { scrollToHowItWorks(); setMobileOpen(false); }} className="text-left text-slate-300 hover:text-white py-2 font-medium">How It Works</button>
            <button onClick={() => { scrollToCTA(); setMobileOpen(false); }} className="bg-amber-500 text-slate-950 font-bold py-3 rounded-lg text-center">Get Started</button>
          </div>
        )}
      </nav>

      <main className="pt-32 pb-24">
        {/* HERO SECTION */}
        <section className="max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-medium mb-8 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            🍽️ Built for Restaurants, Bars & Cafes
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-tight mb-6 tracking-tight text-white">
            Fill More Seats.<br />
            <span className="text-amber-500">Stress Less Behind the Counter.</span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            Online ordering, menu management, and smart systems that help local restaurants get found, serve more customers, and stop losing money to third-party apps.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 w-full sm:w-auto">
            <button 
              onClick={scrollToFeatures}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-4 rounded-xl transition-all text-base shadow-[0_0_20px_rgba(16,185,129,0.25)]"
            >
              See What We Build ↓
            </button>
            <a 
              href="tel:6414208816" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-500 bg-slate-900/50 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-xl transition-all text-base"
            >
              <Phone className="w-5 h-5" />
              Call 641-420-8816
            </a>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-sm text-slate-400 font-medium">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500" /> No DoorDash commissions</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500" /> Your brand, your customers</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500" /> Setup in days</span>
          </div>
        </section>

        {/* SOCIAL PROOF BAR */}
        <section className="mt-20 max-w-4xl mx-auto px-6 text-center">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <div className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold mb-3 uppercase tracking-wider">
              🏆 Iowa & Southern Minnesota's First AI-Powered Marketing Agency
            </div>
            <p className="text-slate-400 text-sm">
              We've built AI-powered websites and systems for local businesses before anyone else in the region.
            </p>
          </div>
        </section>

        {/* APP PREVIEW */}
        <section className="mt-24 max-w-6xl mx-auto px-4 sm:px-6" id="features-section">
          <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-[0_0_50px_rgba(245,158,11,0.1)] bg-[#0f172a]">
            {/* Browser Header */}
            <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>
              <div className="flex-1 max-w-md mx-auto bg-slate-800 rounded-md text-center py-1 text-xs text-slate-400 flex items-center justify-center gap-2 border border-slate-700">
                <span>🔒</span> yourrestaurant.newtechadvertising.com
              </div>
              <div className="w-12"></div> {/* Spacer for balance */}
            </div>

            {/* Dashboard Layout */}
            <div className="flex flex-col md:flex-row min-h-[600px]">
              {/* Sidebar */}
              <div className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col gap-2">
                <div className="px-4 py-3 mb-4 text-amber-500 font-bold text-lg border-b border-slate-800 flex items-center gap-2">
                  <span className="text-2xl">🍽️</span> The Local Grill
                </div>
                
                {[
                  { icon: LayoutDashboard, label: "Dashboard", active: true },
                  { icon: ShoppingBag, label: "Menu & Items" },
                  { icon: BarChart3, label: "Orders" },
                  { icon: CalendarDays, label: "Reservations" },
                  { icon: Star, label: "Reviews" }
                ].map((item, idx) => (
                  <div key={idx} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${item.active ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </div>
                ))}
              </div>

              {/* Main Content */}
              <div className="flex-1 bg-[#0f172a] p-6 lg:p-8">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Today's Orders</h2>
                    <p className="text-slate-400 text-sm">Real-time overview of current restaurant activity.</p>
                  </div>
                  <button className="bg-amber-500 text-slate-950 px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-amber-500/20">New Order</button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {[
                    { label: "Orders Today", value: "34", trend: "+12% vs last week" },
                    { label: "Revenue Today", value: "$1,847", trend: "+8% vs last week" },
                    { label: "Avg Wait Time", value: "12 min", trend: "-2 min vs yesterday", positive: true }
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                      <div className="text-slate-400 text-sm mb-2 font-medium">{stat.label}</div>
                      <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                      <div className={`text-xs ${stat.positive ? 'text-emerald-400' : 'text-amber-400'}`}>{stat.trend}</div>
                    </div>
                  ))}
                </div>

                {/* Order Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 bg-slate-900/50">
                          <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Order #</th>
                          <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer</th>
                          <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Items</th>
                          <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {[
                          { id: "#1042", name: "Sarah Jenkins", items: "2x Classic Burger, Fries", status: "Ready", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
                          { id: "#1043", name: "Mike Thompson", items: "3x Fish Tacos, Margaritas", status: "Preparing", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
                          { id: "#1044", name: "Elena Rodriguez", items: "1x Cobb Salad, Iced Tea", status: "Preparing", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
                          { id: "#1041", name: "David Chen", items: "Family Pizza Special", status: "Delivered", color: "bg-slate-800 text-slate-300 border-slate-700" }
                        ].map((order, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                            <td className="py-4 px-6 text-sm font-medium text-white">{order.id}</td>
                            <td className="py-4 px-6 text-sm text-slate-300">{order.name}</td>
                            <td className="py-4 px-6 text-sm text-slate-400">{order.items}</td>
                            <td className="py-4 px-6">
                              <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium border ${order.color}`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* THE MATH */}
        <section className="mt-24 max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              THE MATH
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Keep More of What You Earn</h2>
            <p className="text-slate-400 text-lg">Here's what third-party delivery apps actually cost a typical local restaurant.</p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* VS Badge */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-slate-900 border-4 border-[#0B1120] rounded-full items-center justify-center font-black text-slate-400 z-10">
              VS
            </div>

            {/* Third Party Card */}
            <div className="bg-slate-900/50 border border-red-500/20 rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 text-sm">✗</span>
                WITH THIRD-PARTY APPS
              </h3>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span className="text-slate-300">DoorDash/Grubhub commission (20-30%): <span className="text-red-400 font-medium">-$1,500/mo</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span className="text-slate-300">Lost repeat customers: <span className="text-red-400 font-medium">Priceless</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span className="text-slate-300">No customer data or emails</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span className="text-slate-300">Their branding, not yours</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span className="text-slate-300">You compete with every other restaurant</span>
                </li>
              </ul>
              <div className="border-t border-slate-800 pt-6">
                <div className="text-sm text-slate-400 mb-1">Annual Cost</div>
                <div className="text-2xl font-bold text-red-400">~$18,000+/yr in commissions</div>
              </div>
            </div>

            {/* NTA Card */}
            <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm">✓</span>
                WITH NTA
              </h3>
              <ul className="space-y-4 mb-8 relative z-10">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span className="text-slate-300">Online ordering: <span className="text-emerald-400 font-medium">0% commission</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span className="text-slate-300">You own every customer</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span className="text-slate-300">Customer emails and order history</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span className="text-slate-300">Your brand, your website</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span className="text-slate-300">AI visibility that sends customers to YOU</span>
                </li>
              </ul>
              <div className="border-t border-slate-800 pt-6 relative z-10">
                <div className="text-sm text-slate-400 mb-1">Your Savings</div>
                <div className="text-2xl font-bold text-emerald-400">$18,000+/yr back in your pocket</div>
              </div>
            </div>
          </div>
          
          <p className="text-center text-xl md:text-2xl font-semibold text-white mt-12 max-w-3xl mx-auto">
            That's <span className="text-emerald-400">$1,500/month</span> you're giving away to apps that put your competitor one swipe away.
          </p>
        </section>

        {/* WHAT YOU GET */}
        <section className="mt-32 max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              WHAT YOU GET
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything a Modern Restaurant Needs Online</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "🛒", title: "Online Ordering", desc: "Commission-free ordering page, branded to your restaurant, with real-time kitchen notifications" },
              { icon: "📋", title: "Menu Management", desc: "Update menu items, prices, photos, and daily specials from your phone in seconds" },
              { icon: "🌟", title: "Review Management", desc: "Monitor Google, Yelp, and Facebook reviews. Respond fast with smart templates" },
              { icon: "🔍", title: "Local Visibility", desc: "Show up in Google, AI assistants, and 'near me' searches when hungry locals are looking" },
              { icon: "📧", title: "Customer Follow-Up", desc: "Build an email list from real orders. Send specials, events, and 'we miss you' messages" },
              { icon: "⚡", title: "Custom Features", desc: "Table reservations, kitchen display, catering orders, loyalty programs — whatever you need" }
            ].map((feature, idx) => (
              <div key={idx} className="bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 border-t-2 border-t-amber-500/50 rounded-xl p-6 transition-all hover:bg-slate-900">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="mt-32 max-w-5xl mx-auto px-6" id="how-it-works-section">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              HOW IT WORKS
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">From Conversation to Customers in Days</h2>
            <p className="text-slate-400 text-lg">No enterprise contracts. No 3-month rollout. No IT department needed.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-6 left-[15%] right-[15%] h-0.5 bg-slate-800"></div>
            
            {[
              { num: 1, title: "Tell Us About Your Restaurant", desc: "A quick call about your menu, your workflow, and what's not working. We'll show you exactly what we can build." },
              { num: 2, title: "We Build Your System", desc: "Ordering page, menu management, visibility setup — built around how YOUR restaurant actually runs." },
              { num: 3, title: "Start Taking Orders", desc: "Go live with your own branded ordering. Customers order from you, not DoorDash. You keep every dollar." }
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-slate-900 border-2 border-amber-500 text-amber-500 font-bold text-xl rounded-full flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-32 max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">Common Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Can this really replace DoorDash for my restaurant?", a: "For pickup and local delivery — absolutely. Your customers order directly from your website. You get the order notification, you keep 100% of the revenue, and you own the customer relationship. Many restaurants keep DoorDash for discovery but push regulars to their own ordering page where there are no fees." },
              { q: "What if I already have a website?", a: "We can add the ordering system to your existing site, or build you a new AI-optimized site that actually shows up in search results. Either way, we work with what you have." },
              { q: "Do customers have to download an app?", a: "No. It's a web page — they click a link or scan a QR code and order right from their phone's browser. No app store, no account creation required." },
              { q: "How do I get order notifications?", a: "However you want — email, text, a tablet in the kitchen, or even a kitchen display screen. We set it up based on your workflow." },
              { q: "What does it cost?", a: "A fraction of what you're paying in DoorDash commissions. We'll give you a straight answer after a quick call. Most restaurants save money immediately because they stop giving away 20-30% per order." },
              { q: "I'm not tech-savvy. Can I manage this?", a: "If you can post to Facebook, you can manage your menu. We build everything to be dead simple. And we're local — you can call Rick directly if you ever need help." }
            ].map((faq, idx) => (
              <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-2">{faq.q}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="mt-32 max-w-4xl mx-auto px-6 text-center" id="cta-section">
          <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-3xl p-10 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-amber-500/10 blur-[100px] pointer-events-none"></div>
            
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 relative z-10">
              Ready to Stop Giving Away Your Profits?
            </h2>
            <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto relative z-10">
              Let's talk about what your restaurant needs. 15-minute call, no pitch deck, no pressure.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 relative z-10">
              <a href="/Contact" className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 py-4 rounded-xl transition-all text-base shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                Let's Talk →
              </a>
              <a href="tel:6414208816" className="inline-flex items-center justify-center gap-2 border border-slate-600 hover:border-slate-400 bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-xl transition-all text-base">
                Call 641-420-8816
              </a>
            </div>
            
            <p className="text-slate-500 text-sm relative z-10">
              Mason City, Iowa - Serving restaurants across Iowa & Southern Minnesota
            </p>
          </div>
        </section>

      </main>
      <SiteFooter />
    </div>
  );
}