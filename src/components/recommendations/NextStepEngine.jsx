import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Activity, Map, Users, Brain, Target, ArrowRight, ShieldCheck } from 'lucide-react';
import { getJourneyMemory } from '@/lib/journeyMemory';

export default function NextStepEngine() {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const memory = getJourneyMemory();
    const audience = memory.visitor?.role || 'business';
    const recs = [];

    // Rule 1: Always prioritize Business Score if not taken
    if (!memory.businessScore) {
      recs.push({
        id: 'business-score',
        title: 'NTA Business Score™',
        description: 'Evaluate your current operations and uncover blind spots to form a baseline.',
        icon: Activity,
        path: '/business-score',
        primary: true
      });
    }

    // Rule 2: If Business Score exists but no Roadmap, recommend Roadmap
    if (memory.businessScore && memory.roadmaps.length === 0) {
      recs.push({
        id: 'roadmap',
        title: 'Growth Roadmap Generator™',
        description: 'Turn your Business Score into a step-by-step personalized digital strategy.',
        icon: Map,
        path: '/growth-roadmap-generator',
        primary: true
      });
    }

    // Rule 3: If Roadmap exists, recommend Relationship Builder
    if (memory.roadmaps.length > 0 && !memory.completedModules?.includes('relationship_builder')) {
      recs.push({
        id: 'relationship-builder',
        title: 'NTA Relationship Builder™',
        description: 'Learn how to transform local connections into sustainable digital growth.',
        icon: Users,
        path: '/relationship-builder',
        primary: !recs.find(r => r.primary)
      });
    }

    // Rule 4: Learning Center
    if (memory.completedModules?.includes('relationship_builder') || Object.keys(memory.learningProgress || {}).length > 0) {
      recs.push({
        id: 'ai-learning',
        title: 'AI Learning Center™',
        description: 'Access curated learning paths to master AI for your local business.',
        icon: Brain,
        path: '/ai-learning-center',
        primary: !recs.find(r => r.primary)
      });
    }

    // Rule 5: Community-specific
    if (audience === 'community') {
      if (!memory.completedConversations?.includes('community_growth')) {
        recs.push({
          id: 'community-growth',
          title: 'Community Growth Conversation™',
          description: 'Discover how to elevate your entire local network.',
          icon: Compass,
          path: '/community-growth-conversation',
          primary: !recs.find(r => r.primary)
        });
      } else {
        recs.push({
          id: 'partner-portal',
          title: 'Community Partner Portal™',
          description: 'Access your dedicated workspace, resources, and commission tracking.',
          icon: ShieldCheck,
          path: '/partner-portal',
          primary: !recs.find(r => r.primary)
        });
      }
    }

    // Rule 6: Track overall journey
    if (memory.businessScore || memory.guideState?.step > 0) {
       recs.push({
          id: 'my-journey',
          title: 'My Growth Journey™',
          description: 'Review your progress, milestones, and achievements so far.',
          icon: Target,
          path: '/my-growth-journey',
          primary: false
       });
    }

    // Filter to top 3 recommendations to avoid overwhelming the user
    setRecommendations(recs.slice(0, 3));
  }, []);

  if (recommendations.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-6 border-t border-slate-800/50 mt-12 bg-slate-950/30">
      <div className="mb-8">
        <h3 className="text-2xl font-heading font-bold text-white mb-2">Recommended Next Steps</h3>
        <p className="text-slate-400">Based on your progress and focus, here is where you should go next.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec) => (
          <div 
            key={rec.id}
            onClick={() => navigate(rec.path)}
            className={`cursor-pointer group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 ${
              rec.primary 
                ? 'bg-blue-900/20 border-blue-500/50 hover:bg-blue-900/30 hover:border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.1)]' 
                : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800 hover:border-slate-600'
            }`}
          >
            <div className="relative z-10 flex flex-col h-full">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                rec.primary 
                  ? 'bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white' 
                  : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white'
              }`}>
                <rec.icon className="w-6 h-6" />
              </div>
              
              <h4 className="text-xl font-bold text-white mb-2">{rec.title}</h4>
              <p className="text-sm text-slate-400 mb-6 flex-1 leading-relaxed">
                {rec.description}
              </p>
              
              <div className={`flex items-center text-sm font-bold transition-colors ${
                rec.primary ? 'text-blue-400 group-hover:text-blue-300' : 'text-slate-400 group-hover:text-slate-300'
              }`}>
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            
            {/* Background glow for primary cards */}
            {rec.primary && (
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full group-hover:bg-blue-500/20 transition-all"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}