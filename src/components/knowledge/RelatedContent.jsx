import React from 'react';
import { Link } from 'react-router-dom';
import { 
  PlayCircle, Layers, ChevronRight, BookOpen, 
  MessageSquare, Compass, Tv, ArrowRight 
} from 'lucide-react';

export default function RelatedContent({ lesson }) {
  if (!lesson) return null;

  const hasRelated = 
    lesson.relatedVideos?.length > 0 || 
    lesson.relatedModules?.length > 0 ||
    lesson.relatedLessons?.length > 0 ||
    lesson.relatedPrompts?.length > 0 ||
    lesson.relatedGrowthShow?.length > 0 ||
    lesson.relatedFounderLessons?.length > 0;

  if (!hasRelated) return null;

  return (
    <div className="mt-16 pt-12 border-t border-slate-800">
      <h2 className="text-2xl font-bold text-white mb-8">Related Content & Resources</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {lesson.relatedLessons?.length > 0 && (
          <RelatedBlock 
            title="Related Lessons" 
            icon={BookOpen} 
            color="text-indigo-400" 
            items={lesson.relatedLessons} 
          />
        )}

        {lesson.relatedVideos?.length > 0 && (
          <RelatedBlock 
            title="Watch & Learn" 
            icon={PlayCircle} 
            color="text-blue-400" 
            items={lesson.relatedVideos} 
          />
        )}

        {lesson.relatedModules?.length > 0 && (
          <RelatedBlock 
            title="OS Modules" 
            icon={Layers} 
            color="text-emerald-400" 
            items={lesson.relatedModules} 
          />
        )}

        {lesson.relatedPrompts?.length > 0 && (
          <RelatedBlock 
            title="Related Prompts" 
            icon={MessageSquare} 
            color="text-violet-400" 
            items={lesson.relatedPrompts} 
          />
        )}

        {lesson.relatedFounderLessons?.length > 0 && (
          <RelatedBlock 
            title="Founder Lessons" 
            icon={Compass} 
            color="text-orange-400" 
            items={lesson.relatedFounderLessons} 
          />
        )}

        {lesson.relatedGrowthShow?.length > 0 && (
          <RelatedBlock 
            title="Growth Show Episodes" 
            icon={Tv} 
            color="text-pink-400" 
            items={lesson.relatedGrowthShow} 
          />
        )}

      </div>
    </div>
  );
}

function RelatedBlock({ title, icon: Icon, color, items }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
      <h3 className="text-slate-300 font-bold flex items-center gap-2 mb-4">
        <Icon className={`w-5 h-5 ${color}`} /> {title}
      </h3>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i}>
            <Link to={item.link} className={`${color} hover:text-white transition-colors text-sm flex items-start gap-2 group`}>
              <ChevronRight className="w-4 h-4 shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" /> 
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}