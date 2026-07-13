import React, { useState } from 'react';
import { Copy, CheckCircle2, Lock, Unlock, Zap, FileText } from 'lucide-react';
import KnowledgeLibraryLayout from '@/components/knowledge/KnowledgeLibraryLayout';

const PROMPT_CATEGORIES = [
  "Business Discovery",
  "Website and Visibility",
  "Content",
  "Brand",
  "Client Relationships",
  "Development"
];

// Initial set of approved prompts based on the work in the NTA system
const seedPrompts = [
  {
    id: 1,
    title: "Prepare for a First Conversation",
    slug: "prepare-for-a-first-conversation",
    summary: "Analyze a local business owner's digital footprint before a discovery call.",
    category: "Business Discovery",
    purpose: "Ensure the NTA rep understands the business's current state and potential gaps before meeting.",
    prompt_text: "You are an expert local business growth strategist. Review the following business name, location, and known details: [BUSINESS_DETAILS]. Identify the top 3 likely digital growth bottlenecks they face in their industry, and suggest 3 empathetic, open-ended questions I should ask them to uncover their true goals without sounding salesy.",
    variables: ["[BUSINESS_DETAILS]"],
    instructions: "Run this prompt 15 minutes before your call. Use the questions as a guide, not a script.",
    example_use: "Business: Smith Plumbing in Mason City. Finding: Weak local SEO. Question: How are people typically finding you right now when they have an emergency?",
    intended_user: "Growth Strategist",
    visibility: "public",
    status: "approved",
    version: "1.0",
    created_at: "2024-05-01",
    updated_at: "2024-05-01",
    related_systems: ["Sales", "Discovery"],
    tags: ["outreach", "research", "preparation"]
  },
  {
    id: 2,
    title: "Turn Conversation into Growth Summary",
    summary: "Summarize notes from a client discovery call into actionable NTA milestones.",
    category: "Business Discovery",
    purpose: "Convert raw call notes into the NTA Growth Roadmap structure.",
    prompt_text: "Take these rough notes from a discovery call with a local business: [CALL_NOTES]. Summarize their current situation, state their primary 12-month goal, and outline a 3-step action plan using the NTA Operating System framework (Visibility, Education, Trust, Relationships, Automation).",
    variables: ["[CALL_NOTES]"],
    instructions: "Paste raw notes. The output is perfect for the follow-up email.",
    visibility: "public"
  },
  {
    id: 3,
    title: "Review Homepage for Clarity",
    summary: "Audit a local business homepage for the 'Grunt Test'.",
    category: "Website and Visibility",
    purpose: "Identify if a website clearly states what they do, who they serve, and how to buy.",
    prompt_text: "Review the following website homepage copy: [HOMEPAGE_COPY]. Does it pass the 'Grunt Test'? Tell me if it clearly answers: 1) What do they offer? 2) How will it make my life better? 3) What do I need to do to buy it? Suggest specific rewrites to make the hero section simpler and clearer.",
    variables: ["[HOMEPAGE_COPY]"],
    instructions: "Use this during the initial Gap Audit.",
    visibility: "public"
  },
  {
    id: 4,
    title: "Create a 30-Day Educational Content Calendar",
    summary: "Generate a month of content ideas focused on teaching, not selling.",
    category: "Content",
    purpose: "Shift a client's social media strategy from promotional to educational.",
    prompt_text: "I represent a [BUSINESS_TYPE] in [CITY]. Give me 12 educational social media post concepts (3 per week for 4 weeks) that teach my ideal customer something valuable about my industry, help them avoid a common mistake, or show behind-the-scenes expertise. Do not include any hard sells. Focus on building trust.",
    variables: ["[BUSINESS_TYPE]", "[CITY]"],
    instructions: "Adapt the output to fit the client's actual operations.",
    visibility: "public"
  },
  {
    id: 5,
    title: "Develop a Referral Conversation",
    summary: "Script a natural, non-pushy way to ask a happy customer for a referral.",
    category: "Client Relationships",
    purpose: "Help business owners leverage their reputation for growth.",
    prompt_text: "Write a short, conversational email and a phone script for a [BUSINESS_TYPE] asking a highly satisfied customer for an introduction to anyone else they know who might need help. Frame it around 'we loved working with you and want to find more clients just like you.' Keep it humble, brief, and pressure-free.",
    variables: ["[BUSINESS_TYPE]"],
    instructions: "Share this with clients during the 'Relationships' phase of the OS.",
    visibility: "public"
  },
  {
    id: 6,
    title: "Safely Enhance a Base44 Page",
    summary: "System prompt for safely updating existing platform routes.",
    category: "Development",
    purpose: "Ensure no existing functionality is broken during platform updates.",
    prompt_text: "I need to update [FILE_PATH]. My goal is to [GOAL]. Before providing code, outline the current state of the file, list any dependencies or state variables that might be affected, and write the minimal, surgical find_replace tool call necessary to achieve this without rewriting the entire file.",
    variables: ["[FILE_PATH]", "[GOAL]"],
    instructions: "Internal engineering prompt. Do not share publicly.",
    visibility: "internal"
  }
];

export default function KnowledgePrompts() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Filter prompts
  const filteredPrompts = seedPrompts.filter(prompt => {
    const matchesCategory = activeCategory === 'All' || prompt.category === activeCategory;
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prompt.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <KnowledgeLibraryLayout
      title="Prompt Library"
      subtitle="Reusable AI prompts developed through real NTA business, content, research, and operational work."
      breadcrumbCurrent="Prompt Library"
      categories={PROMPT_CATEGORIES}
      activeCategory={activeCategory}
      onCategoryChange={setActiveCategory}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <div className="mb-8 p-6 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Zap className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-blue-900 mb-1">Foundational NTA Prompt Collection — Version 1</h2>
          <p className="text-blue-800 text-sm leading-relaxed">
            These prompts are the starting point for bringing the NTA Operating System™ to life with AI. They focus on education, clarity, and building trust.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredPrompts.map((prompt) => (
          <div key={prompt.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-shadow hover:shadow-md">
            <div className="p-6 border-b border-slate-100 flex-1">
              <div className="flex justify-between items-start mb-3 gap-4">
                <h3 className="text-xl font-bold text-slate-900">{prompt.title}</h3>
                {prompt.visibility === 'public' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100 whitespace-nowrap">
                    <Unlock className="w-3.5 h-3.5" /> Public
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200 whitespace-nowrap">
                    <Lock className="w-3.5 h-3.5" /> Internal NTA Resource
                  </span>
                )}
              </div>
              <div className="inline-flex items-center text-xs font-semibold text-blue-600 uppercase tracking-wider mb-4">
                {prompt.category}
              </div>
              
              <p className="text-slate-600 mb-4">{prompt.summary}</p>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Purpose</h4>
                <p className="text-sm text-slate-700">{prompt.purpose}</p>
              </div>

              {prompt.visibility === 'public' && (
                <>
                  <div className="bg-slate-900 rounded-xl p-4 mb-4 relative group">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Prompt</h4>
                    <p className="text-sm text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
                      {prompt.prompt_text}
                    </p>
                    <button 
                      onClick={() => handleCopy(prompt.prompt_text, prompt.id)}
                      className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      aria-label="Copy prompt"
                    >
                      {copiedId === prompt.id ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    {prompt.variables && prompt.variables.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Variables</h4>
                        <div className="flex flex-wrap gap-2">
                          {prompt.variables.map((v, i) => (
                            <span key={i} className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded text-xs font-mono">{v}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {prompt.instructions && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Instructions</h4>
                        <p className="text-sm text-slate-600">{prompt.instructions}</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {prompt.visibility === 'internal' && (
                <div className="bg-slate-100 p-6 rounded-xl border border-slate-200 text-center flex flex-col items-center justify-center">
                  <Lock className="w-8 h-8 text-slate-400 mb-3" />
                  <p className="text-slate-600 font-medium mb-1">Internal Prompt</p>
                  <p className="text-slate-500 text-sm">The prompt text and logic are restricted to NTA administrators.</p>
                </div>
              )}
            </div>
          </div>
        ))}
        {filteredPrompts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">No prompts found</h3>
            <p className="text-slate-500">Try adjusting your category or search term.</p>
          </div>
        )}
      </div>
    </KnowledgeLibraryLayout>
  );
}