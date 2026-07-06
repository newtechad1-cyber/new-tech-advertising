/**
 * R0.6.2 — Related Content Component
 * Universal related content panel powered by the Knowledge Graph.
 * Shows: Related Reading, Watch Next, Learn Next, Related Services,
 *        Related Case Studies, Related Industries, Related Geos.
 *
 * Derives all relationships from PublishingArticle fields — no manual links.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, PlayCircle, GraduationCap, Briefcase,
  BarChart3, Building2, MapPin, ArrowRight, BookOpen
} from 'lucide-react';

const SECTION_CONFIG = {
  reading:     { title: 'Related Reading',       icon: FileText,      color: 'text-blue-400' },
  watching:    { title: 'Watch Next',             icon: PlayCircle,    color: 'text-red-400' },
  learning:    { title: 'Continue Learning',      icon: GraduationCap, color: 'text-indigo-400' },
  services:    { title: 'Related Services',       icon: Briefcase,     color: 'text-emerald-400' },
  caseStudies: { title: 'Success Stories',        icon: BarChart3,     color: 'text-teal-400' },
  industries:  { title: 'Industry Solutions',     icon: Building2,     color: 'text-orange-400' },
  geos:        { title: 'Local Pages',            icon: MapPin,        color: 'text-purple-400' },
};

function RelatedSection({ sectionKey, items }) {
  if (!items || items.length === 0) return null;
  const config = SECTION_CONFIG[sectionKey];
  if (!config) return null;
  const Icon = config.icon;

  return (
    <div>
      <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
        <Icon className={`w-3.5 h-3.5 ${config.color}`} />
        {config.title}
      </h4>
      <div className="space-y-2">
        {items.map((item, i) => {
          const url = item.canonical_url || `/${item.slug || item.canon_id || ''}`;
          return (
            <Link
              key={`${sectionKey}-${i}`}
              to={url}
              className="group flex items-center gap-3 p-3 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-slate-700 transition-all"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                  {item.title}
                </p>
                {item.summary && (
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.summary}</p>
                )}
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 flex-shrink-0 transition-colors" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/**
 * @param {Object} related - Output of knowledgeGraph.getRelatedContent(canonId)
 * @param {string} variant - 'sidebar' (vertical) or 'inline' (horizontal cards)
 */
export default function RelatedContent({ related, variant = 'sidebar' }) {
  if (!related) return null;

  const sections = Object.entries(SECTION_CONFIG)
    .filter(([key]) => related[key]?.length > 0)
    .map(([key]) => key);

  if (sections.length === 0) return null;

  if (variant === 'inline') {
    // Horizontal card layout for embedding in article pages
    const allRelated = [
      ...((related.reading || []).map(r => ({ ...r, _type: 'reading' }))),
      ...((related.caseStudies || []).map(r => ({ ...r, _type: 'caseStudies' }))),
      ...((related.learning || []).map(r => ({ ...r, _type: 'learning' }))),
      ...((related.watching || []).map(r => ({ ...r, _type: 'watching' }))),
    ].slice(0, 6);

    if (allRelated.length === 0) return null;

    return (
      <div className="mt-12 pt-8 border-t border-slate-800">
        <h3 className="flex items-center gap-2 text-lg font-black text-white mb-6">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          Continue Exploring
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allRelated.map((item, i) => {
            const config = SECTION_CONFIG[item._type];
            const Icon = config?.icon || FileText;
            const url = item.canonical_url || `/${item.slug || ''}`;
            return (
              <Link
                key={i}
                to={url}
                className="group p-4 rounded-xl bg-slate-900/30 border border-slate-800 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-3.5 h-3.5 ${config?.color || 'text-slate-400'}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {config?.title || 'Related'}
                  </span>
                </div>
                <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                  {item.title}
                </p>
                {item.summary && (
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{item.summary}</p>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  // Sidebar layout (default)
  return (
    <div className="space-y-6">
      <h3 className="text-sm font-black text-white uppercase tracking-wider">Knowledge Graph</h3>
      {sections.map(key => (
        <RelatedSection key={key} sectionKey={key} items={related[key]} />
      ))}
    </div>
  );
}
