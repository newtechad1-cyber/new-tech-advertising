import React, { useState } from 'react';
import { LayoutTemplate, ChevronRight, Activity, Zap, CheckCircle2, Lock, Unlock } from 'lucide-react';
import KnowledgeLibraryLayout from '@/components/knowledge/KnowledgeLibraryLayout';

const PLAYBOOK_CATEGORIES = [
  "Understand",
  "Discover",
  "Evaluate",
  "Teach",
  "Recommend",
  "Build",
  "Publish",
  "Measure",
  "Improve",
  "Strengthen the Relationship"
];

const seedPlaybooks = [
  {
    id: 1,
    title: "The Initial Gap Audit",
    category: "Evaluate",
    purpose: "Assess a local business's current digital footprint to identify critical visibility and trust gaps.",
    when: "After a prospect requests an audit or before a planned discovery call.",
    role: "Growth Strategist",
    inputs: ["Business Name", "Website URL", "Google Business Profile Link"],
    outcome: "A generated Gap Audit report highlighting 3 key areas of improvement.",
    visibility: "public"
  },
  {
    id: 2,
    title: "Discovery Call Framework",
    category: "Discover",
    purpose: "Uncover the business owner's true goals, frustrations, and operational bottlenecks.",
    when: "During the first scheduled 30-minute meeting.",
    role: "Growth Strategist",
    inputs: ["Gap Audit Results", "Pre-call research notes"],
    outcome: "Clear understanding of whether the business is a fit for the NTA Operating System.",
    visibility: "public"
  },
  {
    id: 3,
    title: "Generating the Growth Roadmap",
    category: "Recommend",
    purpose: "Translate discovery findings into a phased, logical sequence of digital improvements.",
    when: "Following a successful discovery call.",
    role: "Strategist / Admin System",
    inputs: ["Discovery Call notes", "Identified priority goals"],
    outcome: "A presented Growth Roadmap document recommending the optimal OS entry point.",
    visibility: "internal"
  },
  {
    id: 4,
    title: "Client Onboarding Sequence",
    category: "Build",
    purpose: "Seamlessly integrate a new client into the NTA ecosystem and gather necessary assets.",
    when: "Immediately after contract signature.",
    role: "Account Manager",
    inputs: ["Signed agreement", "Initial payment"],
    outcome: "Client access to Portal, completed intake forms, connected social channels.",
    visibility: "internal"
  },
  {
    id: 5,
    title: "Monthly ROI & Progress Reporting",
    category: "Measure",
    purpose: "Demonstrate ongoing value through transparent, easy-to-understand metrics.",
    when: "First week of every month.",
    role: "Account Manager / Reporting System",
    inputs: ["Traffic data", "Lead events", "Publishing logs"],
    outcome: "A recorded Loom video or automated report summarizing wins and next steps.",
    visibility: "public"
  },
  {
    id: 6,
    title: "Proactive Relationship Check-In",
    category: "Strengthen the Relationship",
    purpose: "Maintain trust and ensure alignment with the client's evolving business needs.",
    when: "Every 90 days, separate from standard monthly reporting.",
    role: "Account Manager",
    inputs: ["Recent performance data", "Notes on client's seasonal trends"],
    outcome: "Realigned priorities for the upcoming quarter.",
    visibility: "public"
  }
];

export default function NTAPlaybook() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = seedPlaybooks.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <KnowledgeLibraryLayout
      title="The NTA Playbook"
      subtitle="The processes, workflows, checklists, and operating practices that turn NTA principles into action."
      breadcrumbCurrent="NTA Playbook"
      categories={PLAYBOOK_CATEGORIES}
      activeCategory={activeCategory}
      onCategoryChange={setActiveCategory}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      
      {/* Workflow Visualization */}
      <div className="mb-12 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm overflow-x-auto">
        <h3 className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-6">The NTA Workflow</h3>
        <div className="flex items-center min-w-max pb-4">
          {PLAYBOOK_CATEGORIES.slice(0, 5).map((cat, idx) => (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm mb-2 shadow-sm">
                  {idx + 1}
                </div>
                <span className="text-xs font-semibold text-slate-600">{cat}</span>
              </div>
              {idx < 4 && <div className="w-12 h-px bg-slate-200 mx-2 -translate-y-3"></div>}
            </React.Fragment>
          ))}
          <div className="w-12 h-px bg-slate-200 mx-2 -translate-y-3 border-t border-dashed"></div>
          {PLAYBOOK_CATEGORIES.slice(5, 10).map((cat, idx) => (
            <React.Fragment key={idx + 5}>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-sm mb-2 shadow-sm">
                  {idx + 6}
                </div>
                <span className="text-xs font-semibold text-slate-600">{cat}</span>
              </div>
              {idx < 4 && <div className="w-12 h-px bg-blue-200 mx-2 -translate-y-3"></div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid gap-6">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8 flex flex-col md:flex-row gap-6 transition-shadow hover:shadow-md">
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-1 rounded">
                  {item.category}
                </span>
                {item.visibility === 'public' ? (
                  <span className="inline-flex items-center gap-1 text-slate-500 text-xs font-medium">
                    <Unlock className="w-3 h-3" /> Public Overview
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-medium">
                    <Lock className="w-3 h-3" /> Internal Process
                  </span>
                )}
              </div>
              
              <h4 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h4>
              <p className="text-slate-600 mb-6 text-lg">{item.purpose}</p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <span className="block text-xs font-bold text-slate-400 uppercase mb-1">When to use it</span>
                  <span className="text-sm text-slate-700 font-medium">{item.when}</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Expected Outcome</span>
                  <span className="text-sm text-slate-700 font-medium">{item.outcome}</span>
                </div>
              </div>
            </div>

            <div className="md:w-64 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Responsible Role
                </span>
                <span className="text-sm text-slate-700">{item.role}</span>
              </div>
              
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Required Inputs
                </span>
                <ul className="space-y-1">
                  {item.inputs.map((input, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-slate-300 mt-2 flex-shrink-0"></span>
                      {input}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-4">
                {item.visibility === 'public' ? (
                   <button className="w-full py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm">
                     View Playbook <ChevronRight className="w-4 h-4" />
                   </button>
                ) : (
                  <button className="w-full py-2 bg-slate-100 text-slate-400 cursor-not-allowed text-sm font-medium rounded-lg flex items-center justify-center gap-1">
                    <Lock className="w-4 h-4" /> Internal Only
                  </button>
                )}
              </div>
            </div>
            
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">No playbooks found</h3>
            <p className="text-slate-500">Try adjusting your category or search term.</p>
          </div>
        )}
      </div>

    </KnowledgeLibraryLayout>
  );
}