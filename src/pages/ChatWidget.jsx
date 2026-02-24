import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Send, MessageCircle, Minimize2 } from 'lucide-react';

export default function ChatWidget() {
  const [chatbotId, setChatbotId] = useState(null);
  const [chatbot, setChatbot] = useState(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', business_name: '' });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Read chatbot ID from URL params or script tag
    const params = new URLSearchParams(window.location.search);
    const id = params.get('chatbot_id') || document.currentScript?.getAttribute('data-chatbot-id');
    if (id) {
      setChatbotId(id);
      loadChatbot(id);
    }
  }, []);

  const loadChatbot = async (id) => {
    const bots = await base44.entities.Chatbot.filter({ id });
    const bot = bots[0];
    if (bot && bot.status === 'active') {
      setChatbot(bot);
      setMessages([{ role: 'assistant', content: bot.greeting_message || 'Hi! How can I help you today?' }]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(m => [...m, { role: 'user', content: userMsg }]);
    setLoading(true);

    const res = await base44.functions.invoke('chatbotChat', {
      chatbot_id: chatbotId,
      messages: [...messages, { role: 'user', content: userMsg }],
    });

    if (res.data?.reply) {
      setMessages(m => [...m, { role: 'assistant', content: res.data.reply }]);
      if (res.data?.lead_captured) {
        setMessages(m => [...m, { role: 'system', content: '✅ Thank you! Your information has been submitted. We'll be in touch soon!' }]);
      }
    }
    setLoading(false);
  };

  const handleLeadSubmit = async () => {
    if (!leadForm.email) return;
    setLoading(true);
    const res = await base44.functions.invoke('chatbotChat', {
      chatbot_id: chatbotId,
      messages,
      lead_data: leadForm,
    });
    setShowLeadForm(false);
    setMessages(m => [...m, { role: 'system', content: '✅ Thank you! Your information has been submitted. We'll be in touch soon!' }]);
    setLoading(false);
  };

  if (!chatbot) return null;

  const color = chatbot.color_theme || '#2563eb';

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      {open ? (
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-96 h-[32rem] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b" style={{ backgroundColor: color }}>
            <div className="flex items-center gap-2">
              {chatbot.avatar_url ? (
                <img src={chatbot.avatar_url} className="w-8 h-8 rounded-full object-cover" alt="" />
              ) : (
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-lg">💬</div>
              )}
              <span className="text-white font-semibold">{chatbot.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition-colors">
                <Minimize2 className="w-4 h-4" />
              </button>
              <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'text-white'
                      : msg.role === 'system'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-white border text-slate-800'
                  }`}
                  style={msg.role === 'user' ? { backgroundColor: color } : {}}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border rounded-xl px-3 py-2 text-sm text-slate-500">
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce delay-100">●</span>
                    <span className="animate-bounce delay-200">●</span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Lead Form Overlay */}
          {showLeadForm && (
            <div className="absolute inset-0 bg-white z-10 p-4 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Contact Information</h3>
                <button onClick={() => setShowLeadForm(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto">
                <div>
                  <label className="text-sm font-medium text-slate-700">Name *</label>
                  <Input value={leadForm.name} onChange={e => setLeadForm(f => ({ ...f, name: e.target.value }))} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Email *</label>
                  <Input type="email" value={leadForm.email} onChange={e => setLeadForm(f => ({ ...f, email: e.target.value }))} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Phone</label>
                  <Input value={leadForm.phone} onChange={e => setLeadForm(f => ({ ...f, phone: e.target.value }))} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Business Name</label>
                  <Input value={leadForm.business_name} onChange={e => setLeadForm(f => ({ ...f, business_name: e.target.value }))} className="mt-1" />
                </div>
              </div>
              <Button onClick={handleLeadSubmit} disabled={!leadForm.email || loading} className="mt-4 w-full" style={{ backgroundColor: color }}>
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t bg-white flex gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              disabled={loading}
              className="flex-1"
            />
            <Button size="icon" onClick={handleSend} disabled={loading || !input.trim()} style={{ backgroundColor: color }}>
              <Send className="w-4 h-4 text-white" />
            </Button>
          </div>
          <button
            onClick={() => setShowLeadForm(true)}
            className="text-xs text-center py-2 text-slate-400 hover:text-slate-600 border-t"
          >
            💬 Need help? Leave your details
          </button>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform"
          style={{ backgroundColor: color }}
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}