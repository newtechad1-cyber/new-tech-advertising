import { Clock, Lightbulb, Target, Users } from 'lucide-react';

export default function BCWhyChooseNTA() {
  const reasons = [
    {
      icon: Users,
      title: 'A Digital Growth Office',
      desc: 'NTA connects the website, visibility, content, trust, systems, and the human relationship instead of treating them as separate campaigns.'
    },
    {
      icon: Lightbulb,
      title: 'Teach before selling',
      desc: 'You can use the Knowledge Library and Your Digital Growth Guide™ before deciding whether a human conversation is useful.'
    },
    {
      icon: Clock,
      title: 'Continue in the way that fits',
      desc: 'Call, text, email, Talk to My Office™, or choose a time with Rick. You are not required to follow one path.'
    },
    {
      icon: Target,
      title: 'Clear scope before paid work',
      desc: 'A deeper diagnostic or implementation begins only when the work, price, and next step are clearly agreed.'
    },
  ];

  return (
    <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-blue-600 text-sm font-semibold uppercase tracking-widest">Why NTA</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
            A conversation should make the next step clearer
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {reasons.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <div key={i} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 pt-1">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">{reason.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{reason.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}