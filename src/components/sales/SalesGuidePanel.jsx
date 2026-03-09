import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Bot, Send, Loader2, ArrowRight, Phone, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const STEP_CONTEXT = {
  'sales': { greeting: "Ready to see how this works?", suggestion: "Start with the demo — it takes about 8 minutes.", next: 'Demo', nextLabel: 'Start Demo →' },
  'demo': { greeting: "Welcome to the NTA Demo.", suggestion: "Let's walk through what the platform actually does for your business.", next: 'DemoOverview', nextLabel: 'Begin Overview →' },
  'DemoOverview': { greeting: "Most owners feel this way.", suggestion: "See the platform next — it's simpler than you think.", next: 'DemoPlatform', nextLabel: 'See the Platform →' },
  'DemoPlatform': { greeting: "That's the full system.", suggestion: "See how it works for businesses like yours.", next: 'DemoExamples', nextLabel: 'See Examples →' },
  'DemoExamples': { greeting: "Ready to talk numbers?", suggestion: "Review pricing — it's less than you probably expect.", next: 'DemoPricing', nextLabel: 'Review Pricing →' },
  'DemoPricing': { greeting: "Good question on pricing.", suggestion: "See your full proposal and ROI estimate.", next: 'DealRoom', nextLabel: 'Open Deal Room →' },
  'DealRoom': { greeting: "You're at the decision point.", suggestion: "Review your personalized proposal or run an ROI estimate.", next: 'DealRoomProposal', nextLabel: 'View Proposal →' },
  'DealRoomProposal': { greeting: "This plan fits your business.", suggestion: "Ready to move forward? Start with a free trial.", next: 'StartTrial', nextLabel: 'Start Trial →' },
  'DealRoomPricing': { greeting: "Questions about pricing?", suggestion: "Run the ROI calculator to see your payback.", next: 'DealRoomRoi', nextLabel: 'Run ROI Calculator →' },
  'DealRoomRoi': { greeting: "The numbers make sense.", suggestion: "Start your trial or book a quick call.", next: 'StartTrial', nextLabel: 'Start Free Trial →' },
};

const QUICK_QUESTIONS = [
  "How much does it cost?",
  "Is this hard to use?",
  "What do I get exactly?",
  "How is this different from an agency?",
  "How long does setup take?",
];

export default function SalesGuidePanel({ step = 'demo', prospectId, sessionId }) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const ctx = STEP_CONTEXT[step] || STEP_CONTEXT['demo'];

  const askQuestion = async (q) => {
    const text = q || question;
    if (!text.trim()) return;
    setQuestion('');
    setMessages(m => [...m, { role: 'user', text }]);
    setLoading(true);
    try {
      const res = await base44.functions.invoke('salesGuideChat', {
        question: text, step, prospect_id: prospectId, session_id: sessionId,
      });
      const reply = res.data?.response || "I'd be happy to help — feel free to call us directly at 641-420-8816.";
      setMessages(m => [...m, { role: 'ai', text: reply }]);
    } catch {
      setMessages(m => [...m, { role: 'ai', text: "Happy to help! Call us at 641-420-8816 or book a free strategy call." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-900/60 to-slate-900 border-b border-slate-700 px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-white text-sm font-semibold">NTA Sales Guide</p>
          <p className="text-slate-400 text-xs">Ask anything · No pressure</p>
        </div>
        <div className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      </div>

      {/* Body */}
      <div className="flex-1 px-4 py-3 space-y-3 min-h-[200px] max-h-[340px] overflow-y-auto">
        {/* Initial greeting */}
        {messages.length === 0 && (
          <div className="bg-slate-800 rounded-xl rounded-tl-sm px-3 py-2.5 text-sm text-slate-200">
            {ctx.greeting} {ctx.suggestion}
          </div>
        )}

        {/* Message thread */}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] px-3 py-2.5 rounded-xl text-sm leading-relaxed ${
              m.role === 'user'
                ? 'bg-violet-700 text-white rounded-br-sm'
                : 'bg-slate-800 text-slate-200 rounded-tl-sm'
            }`}>
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Thinking…
          </div>
        )}
      </div>

      {/* Quick questions */}
      {messages.length === 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-1.5">
          {QUICK_QUESTIONS.map(q => (
            <button key={q} onClick={() => askQuestion(q)}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 hover:border-violet-600 rounded-full px-2.5 py-1 transition-colors">
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4 flex gap-2">
        <Input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && askQuestion()}
          placeholder="Ask a question…"
          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 text-sm"
        />
        <Button size="icon" onClick={() => askQuestion()} disabled={loading || !question.trim()} className="bg-violet-600 hover:bg-violet-500 flex-shrink-0">
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Next step CTA */}
      <div className="px-4 pb-4 space-y-2">
        <Link to={createPageUrl(ctx.next)}>
          <Button className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm">
            {ctx.nextLabel} <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
        <Link to={createPageUrl('Book-Call')}>
          <Button variant="outline" size="sm" className="w-full border-slate-700 text-slate-400 hover:text-white text-xs">
            <Phone className="w-3 h-3 mr-1.5" /> Book a Free Strategy Call
          </Button>
        </Link>
      </div>
    </div>
  );
}