import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Globe, MessageSquare, 
  BarChart, Zap, Brain, Target, Megaphone, FolderKanban, Cpu
} from 'lucide-react';
import SEOHead from '@/components/shared/SEOHead';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';

export default function NTAOperatingSystem() {
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const capabilities = [
    {
      title: "Digital Foundation",
      desc: "Website, search presence, local listings, accessibility, and the information customers need to trust the business.",
      icon: Globe,
      label: "Public Growth System"
    },
    {
      title: "Visibility and Content",
      desc: "Articles, social content, videos, campaigns, educational resources, and ongoing publishing.",
      icon: Megaphone,
      label: "Public Growth System"
    },
    {
      title: "Leads and Sales",
      desc: "Lead capture, CRM organization, follow-up, sales conversations, proposals, and opportunity tracking.",
      icon: Target,
      label: "Connected Operations"
    },
    {
      title: "Customer Relationships",
      desc: "Reviews, referrals, communication, retention, and systems that help customers stay connected.",
      icon: MessageSquare,
      label: "Client Workspace"
    },
    {
      title: "AI and Automation",
      desc: "Practical automation for repetitive work, communication, content support, and business intelligence.",
      icon: Zap,
      label: "Connected Operations"
    },
    {
      title: "Business Knowledge",
      desc: "Turn the owner’s experience, processes, answers, and expertise into an organized business asset.",
      icon: Brain,
      label: "Client Workspace"
    },
    {
      title: "Operations and Back Office",
      desc: "Customers, scheduling, invoicing, tasks, documents, internal workflows, and team visibility.",
      icon: FolderKanban,
      label: "Connected Operations"
    },
    {
      title: "Measurement and Direction",
      desc: "Reports, Business Score progress, priorities, recommendations, and the next best action.",
      icon: BarChart,
      label: "Client Workspace"
    }
  ];

  const views = [
    {
      title: "Business Owner",
      desc: "Sees priorities, leads, customers, approvals, results, and what needs attention."
    },
    {
      title: "Team Members",
      desc: "See the tasks, customers, content, and workflows relevant to their role."
    },
    {
      title: "NTA",
      desc: "Helps manage strategy, implementation, campaigns, automation, and continuous improvement."
    },
    {
      title: "AI Workforce",
      desc: "Assists with monitoring, organization, recommendations, content, and repetitive work under human direction."
    }
  ];

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <SEOHead 
        title="NTA Digital Growth Office™ | One Connected Business Growth System"
        description="The NTA Digital Growth Office connects your website, marketing, customer relationships, AI, business knowledge, and operations into one practical growth system."
      />
      <MarketingNav />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-blue-400 text-sm font-medium tracking-wide uppercase mb-8 backdrop-blur-md shadow-2xl"
          >
            <Cpu className="w-4 h-4" /> The NTA Digital Growth Office™
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight mb-8"
          >
            One Connected System to Help You Run and Grow Your Business
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-300 font-light mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Most business owners have accumulated websites, social platforms, advertising accounts, customer lists, software, and AI tools. The problem is not a lack of tools. The problem is that the tools do not work together as one system.
            <br/><br/>
            NTA helps organize what you already have, identify what is missing, and build a practical Digital Growth Office around the way your business actually works.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Link to="/growth-conversation" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-blue-500/25">
              Start Your Growth Conversation
            </Link>
            <a href="#method" className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all border border-slate-700 hover:border-slate-600">
              Explore the Operating System
            </a>
          </motion.div>

          {/* Visual System Map */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 max-w-4xl mx-auto"
          >
            {['Discover', 'Plan', 'Build', 'Operate', 'Grow'].map((step, idx, arr) => (
              <React.Fragment key={step}>
                <div className="bg-slate-900 border border-slate-700 px-6 py-3 rounded-lg shadow-xl font-medium text-slate-200">
                  {step}
                </div>
                {idx < arr.length - 1 && (
                  <div className="hidden md:block text-slate-600">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
                {idx < arr.length - 1 && (
                  <div className="block md:hidden h-4 w-px bg-slate-600 my-1"></div>
                )}
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section: Method versus working environment */}
      <section id="method" className="py-24 relative border-t border-slate-800/50 bg-slate-900/20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              The NTA Operating System™ is the method.<br/>
              <span className="text-blue-400">The NTA Digital Growth Office™ is where the method comes to life.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-slate-900/50 border border-slate-700 rounded-3xl p-10 relative overflow-hidden"
            >
              <h3 className="text-2xl font-bold text-white mb-6">NTA Operating System™</h3>
              <p className="text-slate-400 mb-6">The repeatable growth methodology:</p>
              <ul className="space-y-4">
                {[
                  "Discover where the business stands",
                  "Build the right foundations",
                  "Improve visibility",
                  "Strengthen trust",
                  "Connect customers and systems",
                  "Automate repeatable work",
                  "Measure progress"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 shrink-0"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-500/30 rounded-3xl p-10 relative overflow-hidden shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-white mb-6">NTA Digital Growth Office™</h3>
              <p className="text-blue-200/80 mb-6">The connected working environment containing:</p>
              <ul className="space-y-4">
                {[
                  "Website and digital presence",
                  "CRM and customer information",
                  "Content and publishing",
                  "Reviews and reputation",
                  "Lead follow-up",
                  "AI and automation",
                  "Business knowledge",
                  "Reporting and priorities",
                  "Client and team collaboration"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-blue-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2.5 shrink-0"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section: The business-owner journey */}
      <section className="py-24 relative border-t border-slate-800/50">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">The Business-Owner Journey</h2>
            <p className="text-xl text-slate-400">A clear path from understanding your current position to scaling your operations.</p>
          </motion.div>

          <div className="space-y-6">
            {[
              { num: 1, title: "Discover", desc: "Understand the current business, bottlenecks, opportunities, and goals.", link: "/growth-conversation", linkText: "Start Discovery" },
              { num: 2, title: "Score", desc: "Measure the business across the most important areas of digital growth.", link: "/business-score", linkText: "View Score" },
              { num: 3, title: "Plan", desc: "Create a practical Growth Roadmap based on priorities, budget, and readiness.", link: "/growth-roadmap-generator", linkText: "Build Roadmap" },
              { num: 4, title: "Build", desc: "Connect the website, content, customer systems, automation, and back office.", link: "#", linkText: "Explore Tools" },
              { num: 5, title: "Operate", desc: "Give the owner, team, and NTA one connected place to manage the work.", link: null, plainText: "Inside the Client Workspace" },
              { num: 6, title: "Grow", desc: "Review results, improve the system, and add capabilities as the business is ready.", link: "/relationship-builder", linkText: "Build Relationships" }
            ].map((stage, i) => (
              <motion.div 
                key={stage.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6"
              >
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-2xl font-bold text-blue-400 shrink-0">
                  {stage.num}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{stage.title}</h3>
                  <p className="text-slate-400">{stage.desc}</p>
                </div>
                <div className="shrink-0 pt-4 md:pt-0">
                  {stage.link ? (
                    <Link to={stage.link} className="text-blue-400 font-medium hover:text-blue-300 flex items-center gap-1">
                      {stage.linkText} <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <span className="text-slate-500 font-medium flex items-center gap-1">
                      {stage.plainText}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Digital Growth Office capabilities */}
      <section className="py-24 relative border-t border-slate-800/50 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Digital Growth Office Capabilities</h2>
            <p className="text-xl text-slate-400">Everything working together inside one connected environment.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((cap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-slate-900/60 border border-slate-700 rounded-2xl p-6 flex flex-col hover:border-slate-500 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 text-blue-400 border border-blue-800/50">
                  <cap.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{cap.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">{cap.desc}</p>
                <div className="mt-auto inline-block bg-slate-800 text-slate-300 text-xs font-semibold px-3 py-1 rounded-full w-max">
                  {cap.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: One system, different views */}
      <section className="py-24 relative border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">One System, Different Views</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              AI assists the business owner and team. It does not replace judgment, relationships, or responsibility.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {views.map((view, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-slate-800/30 border border-slate-700 rounded-2xl p-8"
              >
                <h3 className="text-xl font-bold text-blue-400 mb-3">{view.title}</h3>
                <p className="text-slate-300">{view.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Start with what the business needs now */}
      <section className="py-24 relative border-t border-slate-800/50 bg-slate-900/20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Start With What The Business Needs Now</h2>
            <p className="text-2xl text-blue-300 font-medium mb-16">
              We do not force every business into the same package. We build the right system in the right order.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-8 hover:border-slate-500 transition-colors">
              <h3 className="text-2xl font-bold text-white mb-6 pb-4 border-b border-slate-700">Start</h3>
              <ul className="space-y-4 text-slate-300">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div> Growth Conversation</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div> Business Score</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div> Immediate fixes</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div> One clear priority</li>
              </ul>
            </div>
            <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-8 hover:border-slate-500 transition-colors">
              <h3 className="text-2xl font-bold text-white mb-6 pb-4 border-b border-slate-700">Build</h3>
              <ul className="space-y-4 text-slate-300">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div> Website and visibility</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div> Content system</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div> CRM and follow-up</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div> Reviews and relationships</li>
              </ul>
            </div>
            <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-8 hover:border-slate-500 transition-colors">
              <h3 className="text-2xl font-bold text-white mb-6 pb-4 border-b border-slate-700">Expand</h3>
              <ul className="space-y-4 text-slate-300">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div> Automation</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div> Back-office workflows</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div> AI workforce</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div> Reporting & deeper integrations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Connected NTA tools */}
      <section className="py-24 relative border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Connected NTA Tools & Experiences</h2>
            <p className="text-xl text-slate-400">Explore specific pieces of the ecosystem.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Growth Conversation", link: "/growth-conversation" },
              { name: "NTA Business Score", link: "/business-score" },
              { name: "Growth Roadmap", link: "/growth-roadmap-generator" },
              { name: "Relationship Builder", link: "/relationship-builder" },
              { name: "Knowledge Library", link: "/knowledge" },
              { name: "AI Foundations", link: "/knowledge/ai-foundations" },
              { name: "Back-Office Solutions", link: "/back-office-solutions" },
              { name: "Restaurant Solutions", link: "/restaurants" }
            ].map((tool, i) => (
              <Link 
                key={i} 
                to={tool.link}
                className="bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-slate-500 rounded-xl p-4 text-center transition-all flex flex-col items-center justify-center gap-2 group"
              >
                <span className="text-slate-200 font-medium group-hover:text-white transition-colors">{tool.name}</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-32 relative border-t border-slate-800/50 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950 z-0"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight"
          >
            You Do Not Need More Disconnected Tools
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-400 leading-relaxed mb-12 max-w-3xl mx-auto"
          >
            You need a clear understanding of where your business stands, a practical plan, and a connected system that helps you follow through.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/growth-conversation" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-5 rounded-xl text-lg transition-all shadow-lg hover:shadow-blue-500/25">
              Start the Growth Conversation
            </Link>
            <a 
              href="https://calendar.app.google/p6ieYanvwhixXxZ67" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-white font-semibold px-8 py-5 rounded-xl text-lg transition-all"
            >
              Book a Call
            </a>
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}