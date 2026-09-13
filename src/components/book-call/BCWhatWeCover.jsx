import { BarChart3, Globe, Share2, Video, Zap } from 'lucide-react';

export default function BCWhatWeCover() {
  const topics = [
    { icon: BarChart3, label: 'What is happening now', desc: 'The situation, question, or opportunity that brought you here.' },
    { icon: Globe, label: 'Your website and digital experience', desc: 'What a visitor can understand, trust, and do next today.' },
    { icon: Share2, label: 'Visibility and customer trust', desc: 'Where people may be finding you, hesitating, or losing the thread.' },
    { icon: Zap, label: 'Practical AI and systems', desc: 'Where tools might save time or improve the experience without adding needless complexity.' },
    { icon: Video, label: 'What you have already tried', desc: 'Your audit, existing efforts, and evidence that can make the conversation more useful.' },
    { icon: BarChart3, label: 'A clear next step', desc: 'More learning, a follow-up conversation, or a scoped deeper diagnostic only if it would help.' },
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-blue-600 text-sm font-semibold uppercase tracking-widest">What We Can Explore</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
            Start with your question—not a predetermined package
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {topics.map((topic, i) => {
            const Icon = topic.icon;
            return (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 pt-1">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{topic.label}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{topic.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}