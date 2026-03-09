import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { MessageSquare, X, Send, Loader2, ChevronDown } from 'lucide-react';
import { useDemoTrack } from './useDemoSession';
import ReactMarkdown from 'react-markdown';

const QUICK_QUESTIONS = [
  'How much does NTA cost?',
  'How is NTA different from an agency?',
  'What industries do you support?',
  'How long does setup take?',
  'Can I cancel anytime?',
];

export default function DemoAIPanel({ context = '' }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your NTA demo guide. Ask me anything about the platform, pricing, or how it works for your business. 👋" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { track } = useDemoTrack();

  const send = async (text) => {
    const q = text || input.trim();
    if (!q) return;
    setInput('');
    setMessages(m => [...m, { role: 'user', content: q }]);
    setLoading(true);
    track('question_asked', { value: q });

    try {
      const history = messages.map(m => `${m.role === 'user' ? 'Prospect' : 'NTA Guide'}: ${m.content}`).join('\n');
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are the NTA demo guide — a helpful, confident sales assistant for New Tech Advertising, an AI marketing platform for small businesses.
Context about where the prospect is in the demo: ${context || 'browsing the demo'}

Previous conversation:
${history}

Prospect question: ${q}

Answer in 2-4 short paragraphs. Be direct, friendly, and specific. If they ask about pricing, mention plans start at an affordable monthly rate and suggest booking a call for a custom quote. Always end with a relevant CTA like "Want to see this in action?" or "Ready to start your free trial?"`,
      });
      setMessages(m => [...m, { role: 'assistant', content: typeof res === 'string' ? res : res?.text || 'Great question! Let me connect you with our team for a personalized answer.' }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: "I'm having trouble connecting right now. Please try again or book a call with our team!" }]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-20 right-5 z-50 bg-blue-600 hover:bg-blue-500 text-white rounded-full p-3 shadow-xl flex items-center gap-2 transition-all"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-sm font-semibold pr-1 hidden sm:block">Ask AI Guide</span>
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 right-4 z-50 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col" style={{ maxHeight: '480px' }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="font-semibold text-white text-sm">NTA Demo Guide</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ maxHeight: '280px' }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
                  <ReactMarkdown className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 rounded-xl px-3 py-2">
                  <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Quick questions */}
          <div className="px-3 pb-2 flex flex-wrap gap-1">
            {QUICK_QUESTIONS.slice(0, 3).map(q => (
              <button key={q} onClick={() => send(q)} className="text-xs px-2 py-1 rounded-full border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors">
                {q}
              </button>
            ))}
          </div>

          <div className="px-3 pb-3 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !loading && send()}
              placeholder="Ask a question..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-lg px-3 py-2 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}