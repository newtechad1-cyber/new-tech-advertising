import React, { useState } from 'react';
import { MessageSquare, HeartHandshake, ShieldCheck, Phone, BookOpen, AlertCircle, Users, CheckCircle2 } from 'lucide-react';
import KnowledgeLibraryLayout from '@/components/knowledge/KnowledgeLibraryLayout';

const CONVERSATION_CATEGORIES = [
  "First Contact",
  "Discovery Conversation",
  "Explaining the NTA OS",
  "Follow-Up",
  "Handling Uncertainty",
  "Discussing Investment",
  "Partnership Conversations",
  "Client Check-Ins"
];

const seedConversations = [
  {
    id: 1,
    title: "The Initial Outreach",
    summary: "How to introduce yourself without pitching or applying pressure.",
    category: "First Contact",
    type: "Guide",
    content: "When reaching out to a local business for the first time, our goal is never to sell. The goal is to see if they are open to an honest conversation about their digital footprint. Use the 'Visibility Audit Invitation' as a low-friction way to offer value upfront."
  },
  {
    id: 2,
    title: "Leading a Discovery Conversation",
    summary: "Questions to ask to truly understand the business's current state.",
    category: "Discovery Conversation",
    type: "Framework",
    content: "Start by listening. Ask: 'What is the biggest bottleneck to your growth right now?' Follow up with: 'If we could fix one piece of your marketing in the next 90 days, what would have the biggest impact?'"
  },
  {
    id: 3,
    title: "Explaining the System over Tactics",
    summary: "How to shift the conversation from 'buying ads' to 'building a system'.",
    category: "Explaining the NTA OS",
    type: "Talking Points",
    content: "Clients often ask for a specific tactic (like Facebook Ads). Pivot the conversation by saying: 'Ads are great, but they are just an amplifier. Before we amplify, we need to ensure the foundation—Visibility, Education, and Trust—is solid. Otherwise, we are amplifying a broken message.'"
  },
  {
    id: 4,
    title: "Following Up Without Being Annoying",
    summary: "Adding value during the follow-up process.",
    category: "Follow-Up",
    type: "Strategy",
    content: "Never send a 'just checking in' email. Every follow-up must contain a piece of value: an article, a quick observation about their competitor, or a personalized idea. 'I was thinking about our conversation and realized X...'"
  },
  {
    id: 5,
    title: "When NTA Is Not the Right Fit",
    summary: "How to politely decline a prospect that doesn't align with our principles.",
    category: "Handling Uncertainty",
    type: "Script Outline",
    content: "If a prospect wants immediate magic bullets or refuses to collaborate, say: 'Based on what you've shared, I don't believe our operating system is the right fit for your current goals. We build long-term authority, which takes time. I'd be happy to recommend someone who specializes in short-term direct response.'"
  },
  {
    id: 6,
    title: "Discussing the Investment",
    summary: "Framing cost as a strategic investment in business equity.",
    category: "Discussing Investment",
    type: "Talking Points",
    content: "Don't justify the price; explain the value. 'You are investing in a system that builds digital equity for your brand. Unlike rented ads that disappear when you stop paying, the authority and trust we build compound over time.'"
  }
];

export default function SalesConversations() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = seedConversations.filter(c => {
    const matchesCategory = activeCategory === 'All' || c.category === activeCategory;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <KnowledgeLibraryLayout
      title="Conversations That Help People Decide"
      subtitle="NTA’s teaching-first approach to outreach, discovery, follow-up, and client conversations."
      breadcrumbCurrent="Sales Conversations"
      categories={CONVERSATION_CATEGORIES}
      activeCategory={activeCategory}
      onCategoryChange={setActiveCategory}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <div className="mb-10 bg-slate-900 rounded-3xl p-8 md:p-10 border border-slate-800 text-center relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
        
        <ShieldCheck className="w-12 h-12 text-blue-400 mx-auto mb-6 relative z-10" />
        
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 relative z-10">
          We don't pressure people into buying marketing.
        </h2>
        
        <p className="text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto mb-10 relative z-10">
          These conversation guides help us listen, teach, explain, follow up, and determine whether working together is a healthy fit.
        </p>
        
        <blockquote className="max-w-2xl mx-auto bg-slate-950/50 p-6 rounded-2xl border border-slate-800 relative z-10">
          <p className="text-xl text-blue-100 font-medium italic mb-4">
            "If you can offer me enough trust to begin, I will work to earn enough trust to continue."
          </p>
          <footer className="text-sm">
            <span className="text-white font-bold block">Rick Hesse</span>
            <span className="text-slate-400">Founder, New Tech Advertising</span>
          </footer>
        </blockquote>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900">Conversation Guides</h3>
        <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">Public Educational Summaries</span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{item.category}</span>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">{item.type}</span>
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h4>
            <p className="text-slate-600 mb-6 text-sm flex-1">{item.summary}</p>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-sm text-slate-700 leading-relaxed">{item.content}</p>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-20 bg-white rounded-3xl border border-slate-200">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">No guides found</h3>
            <p className="text-slate-500">Try adjusting your category or search term.</p>
          </div>
        )}
      </div>

      <div className="mt-12 bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-indigo-900">Need Internal Sales Scripts?</h4>
            <p className="text-sm text-indigo-700">Full internal scripts, objection handling, and proposal guides are stored in the secure Admin Sales Prompts portal.</p>
          </div>
        </div>
        <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors whitespace-nowrap shadow-sm shadow-indigo-600/20">
          Access Secure Admin
        </button>
      </div>

    </KnowledgeLibraryLayout>
  );
}