import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight } from 'lucide-react';

export default function NewToAISection() {
  const { data: posts = [] } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: () => base44.entities.BlogPost.list('-published_date', 100),
  });

  const getPostId = (slug) => posts.find(p => p.slug === slug)?.id;

  const cards = [
    {
      num: 1,
      title: "What Is AI, Really?",
      subtitle: "The basics explained like you're talking to a friend",
      slug: 'what-is-ai-really-a-no-bs-guide-for-business-owners'
    },
    {
      num: 2,
      title: "Chatbots vs AI Agents",
      subtitle: "Which layer does YOUR business actually need?",
      slug: 'ai-chatbots-and-ai-agents-a-simple-guide-for-small-business'
    },
    {
      num: 3,
      title: "The Digital Tollbooth",
      subtitle: "How software companies really make their money",
      slug: 'the-digital-tollbooth-how-software-empires-are-built-on-your-pennies'
    }
  ];

  return (
    <section className="bg-slate-950 py-16 px-4 border-b border-slate-800">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">New to AI? Start Here.</h2>
        <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto">
          A 3-part series that explains AI for business owners — no jargon, no hype, just what you need to know.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12 text-left">
          {cards.map((card) => {
            const id = getPostId(card.slug);
            const to = id ? `${createPageUrl('BlogPost')}?id=${id}` : '#';
            return (
              <Link key={card.num} to={to} className="bg-slate-900 border border-slate-800 hover:border-violet-500/50 p-6 rounded-2xl flex flex-col transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10 group">
                <div className="w-10 h-10 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 font-bold text-lg mb-5 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                  {card.num}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">{card.title}</h3>
                <p className="text-slate-400 text-sm flex-1 mb-4">{card.subtitle}</p>
                <span className="text-violet-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all mt-auto pt-2">
                  Read →
                </span>
              </Link>
            );
          })}
        </div>

        <Link to="/free-audit" className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-violet-600/20">
          Take the Free AI Gap Audit <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}