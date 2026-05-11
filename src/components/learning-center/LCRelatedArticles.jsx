import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function LCRelatedArticles({ articles }) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="mt-20 pt-16 border-t border-slate-800">
      <h3 className="text-2xl font-black text-white mb-8">Keep Learning</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, idx) => (
          <Link key={idx} to={article.link} className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-colors flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md">
                {article.tag}
              </span>
              {article.date && <span className="text-xs font-medium text-slate-500">{article.date}</span>}
            </div>
            <h4 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
              {article.title}
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-1">
              {article.description}
            </p>
            <div className="flex items-center text-sm font-semibold text-blue-500 group-hover:gap-2 transition-all">
              Read <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}