import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, ArrowLeft, Menu, X, LayoutDashboard, ShoppingBag, CalendarDays, Star, BarChart3, CheckCircle2 } from 'lucide-react';

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

      </main>
    </div>
  );
}