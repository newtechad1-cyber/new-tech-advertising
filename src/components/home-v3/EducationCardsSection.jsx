import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const TOPICS = [
  {
    icon: '🤖',
    title: 'AI Visibility for Local Business',
    desc: 'ChatGPT, Perplexity, and voice assistants are now how people find local businesses. Learn how to get found in AI search before your competitors figure it out.',
    href: '/learning-center',
  },
  {
    icon: '🌐',
    title: 'Modern Websites That Build Trust',
    desc: 'Most local business websites are outdated, slow, and not built for how customers search today. Learn what a trust-building website actually looks like.',
    href: '/learning-center',
  },
  {
    icon: '📺',
    title: 'CTV & Streaming TV Advertising',
    desc: 'Your customers are cutting the cord. Streaming TV ads let local businesses reach targeted households on Hulu, Roku, and more — for budgets that actually work.',
    href: '/learning-center',
  },
  {
    icon: '📝',
    title: 'Content That Educates and Converts',
    desc: 'The businesses that win online create helpful, consistent content. Learn the formats, frequency, and topics that turn readers into customers.',
    href: '/learning-center',
  },
  {
    icon: '🔁',
    title: 'Follow-Up Systems That Create Customers',
    desc: 'Most leads go cold because there is no follow-up system. Email, SMS, and automation sequences keep your business top of mind until prospects are ready to buy.',
    href: '/learning-center',
  },
  {
    icon: '📍',
    title: 'Local SEO & Voice Search',
    desc: 'Google Maps, local keywords, and voice search are how nearby customers find you. Learn how to rank where it matters most.',
    href: '/learning-center',
  },
  {
    icon: '⚙️',
    title: 'Practical AI Tools for Business Owners',
    desc: 'AI does not have to be complicated. Learn the specific tools local business owners can use today to save time, create content, and improve customer communication.',
    href: '/learning-center',
  },
];

export default function EducationCardsSection() {
  return (
    <section className="py-20 px-6 bg-white border-t border-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-3">Learning Center</p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
            Education That Actually Helps
          </h2>
          <p className="text-slate-500 text-lg mb-5">
            Plain-spoken, practical guides for local business owners who want to understand what is working online today.
          </p>
          <p className="text-slate-500 text-lg leading-relaxed mb-6">
            A key part of modern online success is ensuring your website is accessible and easy to use for everyone. Meeting accessibility and ADA standards is a core marker of website quality. An accessible website naturally improves customer experience, builds trust, and creates the structured data needed for strong SEO, usability, and AI readability.
          </p>
          <Link to="/accessible-websites" className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-semibold transition-colors">
            Learn About Modern Website Accessibility <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {TOPICS.map((topic) => (
            <div key={topic.title} className="border border-slate-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
              <div className="text-3xl mb-4">{topic.icon}</div>
              <h3 className="font-black text-slate-900 text-base mb-2 leading-snug">{topic.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed flex-1 mb-4">{topic.desc}</p>
              <Link
                to={topic.href}
                className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-sm hover:gap-2.5 transition-all"
              >
                Learn More <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/learning-center" className="inline-block bg-slate-900 hover:bg-slate-800 text-white font-black px-8 py-4 rounded-xl transition-colors text-sm">
            Visit the Learning Center →
          </Link>
        </div>
      </div>
    </section>
  );
}