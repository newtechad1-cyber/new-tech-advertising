import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { X, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function NTAAgentWidget() {
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const avatarUrl = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/4180c3dd4_faviconimage_edited.png";

  const suggestions = [
    "What do you do?",
    "Free Gap Audit",
    "I need more customers",
    "Back-office software"
  ];

  useEffect(() => {
    const savedId = localStorage.getItem('nta_growth_guide_conv_id');
    if (savedId) {
      setConversationId(savedId);
    }
  }, []);

  const initializeConversation = async () => {
    if (conversationId) return;
    try {
      setIsLoading(true);
      const conv = await base44.agents.createConversation({
        agent_name: "nta_growth_guide"
      });
      setConversationId(conv.id);
      localStorage.setItem('nta_growth_guide_conv_id', conv.id);
    } catch (e) {
      console.error("Failed to create conversation:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!conversationId) return;
    const unsubscribe = base44.agents.subscribeToConversation(conversationId, (data) => {
      setMessages(data.messages || []);
      // If we got messages, and the last one is from assistant, turn off loading
      if (data.messages?.length > 0 && data.messages[data.messages.length - 1].role === 'assistant') {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, [conversationId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open, isLoading]);

  const handleSend = async (text) => {
    if (!text.trim() || !conversationId) return;
    const currentText = text.trim();
    setInputText('');
    setIsLoading(true);
    try {
      await base44.agents.addMessage({ id: conversationId }, {
        role: "user",
        content: currentText
      });
    } catch (e) {
      console.error("Failed to send message:", e);
      setIsLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    if (!conversationId) {
      initializeConversation();
    }
  };

  const handleClose = () => setOpen(false);

  const welcomeMessage = {
    role: "assistant",
    content: "Hey there! 👋 I'm the NTA Growth Guide. I help local business owners figure out how to get more customers and run things smoother. What kind of business do you run?"
  };

  const displayMessages = [welcomeMessage, ...messages];

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {!open && (
          <div className="bg-slate-900 border border-slate-700 text-white text-xs font-semibold px-3 py-2 rounded-2xl shadow-lg max-w-[180px] text-center leading-snug animate-bounce">
            Ask the Growth Guide
          </div>
        )}
        {!open && (
          <button
            onClick={handleOpen}
            className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl overflow-hidden border-2 border-slate-800 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all hover:scale-105 bg-white group"
          >
            <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-green-500 group-hover:opacity-40 transition-opacity"></div>
            <img src={avatarUrl} alt="Growth Guide" className="w-full h-full object-cover z-10" />
          </button>
        )}
      </div>

      {open && (
        <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 flex flex-col w-full sm:w-[380px] h-[100dvh] sm:h-[600px] max-h-[100dvh] sm:rounded-2xl overflow-hidden shadow-2xl bg-slate-950 border sm:border-slate-800">
          
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 flex-shrink-0 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-blue-500"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="relative">
                <img src={avatarUrl} alt="Growth Guide" className="w-10 h-10 rounded-full border-2 border-slate-800 bg-white" />
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-slate-900"></div>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">NTA Growth Guide</h3>
                <p className="text-slate-400 text-xs">Always here to help</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors relative z-10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950">
            {displayMessages.map((msg, i) => {
              const isUser = msg.role === 'user';
              return (
                <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-2`}>
                  {!isUser && (
                    <img src={avatarUrl} alt="Bot" className="w-6 h-6 rounded-full flex-shrink-0 bg-white mt-1" />
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                      isUser 
                        ? 'bg-blue-600 text-white rounded-tr-sm' 
                        : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm'
                    }`}
                  >
                    {isUser ? (
                      msg.content
                    ) : (
                      <ReactMarkdown 
                        className="prose prose-sm prose-invert max-w-none [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:mt-1 [&>ul]:mb-2 [&>ol]:mt-1 [&>ol]:mb-2 [&>li]:mb-1"
                        components={{
                          a: ({node, ...props}) => <a {...props} className="text-blue-400 hover:underline font-medium" target="_blank" rel="noopener noreferrer" />
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start gap-2">
                <img src={avatarUrl} alt="Bot" className="w-6 h-6 rounded-full flex-shrink-0 bg-white mt-1" />
                <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5 h-10">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 0 && !isLoading && (
            <div className="px-4 pb-3 bg-slate-950 flex flex-wrap gap-2">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(suggestion)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-blue-400 text-xs font-medium rounded-full transition-colors whitespace-nowrap"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <div className="p-3 bg-slate-900 border-t border-slate-800 flex-shrink-0">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(inputText); }}
              className="flex items-center gap-2 relative"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-slate-950 border border-slate-700 text-white text-sm rounded-full pl-4 pr-10 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-500"
                disabled={!conversationId && !isLoading}
              />
              <button
                type="submit"
                disabled={!inputText.trim() || !conversationId}
                className="absolute right-1.5 w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white disabled:bg-slate-800 disabled:text-slate-600 transition-colors"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
            <div className="text-center mt-2">
              <span className="text-[10px] text-slate-600 font-medium tracking-wide uppercase">Powered by NTA AI</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}