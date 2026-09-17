import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function BCFAQ() {
  const [expanded, setExpanded] = useState(null);

  const faqs = [
    {
      q: 'How long is the conversation?',
      a: 'The calendar shows the available time. We keep the conversation focused on the question in front of your business rather than trying to cover everything at once.'
    },
    {
      q: 'Is there any cost?',
      a: 'The Growth Conversation is free. A paid diagnostic, Growth Roadmap, or implementation begins only after the scope, price, and next step are clearly agreed.'
    },
    {
      q: 'Do I need to choose a service before we talk?',
      a: 'Start with the question or problem in your business. Rick will help you identify a useful priority and discuss what support would fit.'
    },
    {
      q: 'How is my price decided?',
      a: 'Pricing reflects the agreed work, what is already in place, and the support your business needs. NTA explains the scope and cost in a written recommendation before paid work begins.'
    },
    {
      q: 'How do setup and ongoing support fit together?',
      a: 'Your recommendation separates any one-time setup or foundation work from ongoing support. You can see what each part covers and agree on the responsibilities and cost.'
    },
    {
      q: 'What if I am not sure a conversation is the right step?',
      a: 'Keep learning first. Use the Knowledge Library or ask Your Digital Growth Guide™. You can decide later whether a human conversation would help.'
    },
    {
      q: 'Do I have to schedule through the calendar?',
      a: 'No. Talk to My Office™ can be a call, text, email, or a conversation on the site—whichever is easiest for you.'
    },
    {
      q: 'What if I have questions before choosing a time?',
      a: 'Call or text 641-420-8816, email info@newtechadvertising.com, or start with Your Digital Growth Guide™. Opening the Guide does not create a lead.'
    },
    {
      q: 'Does NTA only work in North Iowa?',
      a: 'North Iowa is part of NTA’s history, proof, and local presence. NTA can work with businesses anywhere when the fit and the work are right.'
    },
  ];

  return (
    <section className="bg-slate-50 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-blue-600 text-sm font-semibold uppercase tracking-widest">Questions?</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
            Frequently asked questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm"
            >
              <button
                type="button"
                aria-expanded={expanded === i}
                aria-controls={'booking-faq-' + i}
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
              >
                <h3 className="text-left font-semibold text-slate-900">{faq.q}</h3>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${
                    expanded === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div id={'booking-faq-' + i} hidden={expanded !== i} className="px-5 pb-5 border-t border-slate-100">
                <p className="text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}