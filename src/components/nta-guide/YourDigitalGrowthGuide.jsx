import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { X, Send, Loader2, User, FileText, CheckCircle2, AlertCircle, Clock, Zap, ChevronRight, MessageCircle, Map, Compass, Brain, Activity } from 'lucide-react';
import { Button } from "@/components/ui/button";

const NTA_FAVICON = "https://media.base44.com/images/public/691f41a18de4a7f498c8f884/04e19b127_favicon_64x64.png";
import { Input } from "@/components/ui/input";
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from 'react-router-dom';
import { getJourneyMemory } from '@/lib/journeyMemory';

const FunctionDisplay = ({ toolCall }) => {
    // keeping similar structure for tool calls
    const [expanded, setExpanded] = useState(false);
    const name = toolCall?.name || 'Function';
    const status = toolCall?.status || 'pending';
    const results = toolCall?.results;
    
    return (
        <div className="mt-2 text-xs">
            <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-white border-slate-200"
            >
                <Zap className="h-3 w-3 text-slate-500" />
                <span className="text-slate-700">System Action</span>
                <ChevronRight className={cn("h-3 w-3 text-slate-400 ml-auto", expanded && "rotate-90")} />
            </button>
            {expanded && (
                <div className="mt-1.5 ml-3 pl-3 border-l-2 border-slate-200 text-slate-500">
                    Action executed successfully.
                </div>
            )}
        </div>
    );
};

const MessageBubble = ({ message }) => {
    const isUser = message.role === 'user';
    return (
        <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
            {!isUser && (
                <div className="h-8 w-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm overflow-hidden">
                    <img src={NTA_FAVICON} alt="NTA Guide" className="w-5 h-5 object-contain" />
                </div>
            )}
            <div className={cn("max-w-[85%]", isUser && "flex flex-col items-end")}>
                {message.content && (
                    <div className={cn(
                        "rounded-2xl px-4 py-3 shadow-sm",
                        isUser ? "bg-slate-800 text-white" : "bg-white/80 backdrop-blur-md border border-white/40 text-slate-800 shadow-xl"
                    )}>
                        {isUser ? (
                            <p className="text-sm leading-relaxed">{message.content}</p>
                        ) : (
                            <ReactMarkdown 
                                className="text-sm prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 text-slate-700"
                                components={{
                                    a: ({ children, ...props }) => (
                                        <a {...props} className="text-blue-600 hover:underline font-medium" target="_blank" rel="noopener noreferrer">{children}</a>
                                    )
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default function YourDigitalGrowthGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [authStep, setAuthStep] = useState('loading');
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dragControls = useDragControls();

  // Context awareness
  const getContextAwareHelp = () => {
    const memory = getJourneyMemory();
    const path = location.pathname;
    
    if (path.includes('/business-score')) {
      return {
        title: 'Business Score Context',
        description: 'You are currently evaluating your business maturity. Be honest with your answers to get an accurate baseline.',
        actions: ['What happens after the score?', 'How is the score calculated?']
      };
    }
    
    if (path.includes('/growth-roadmap-generator')) {
      return {
        title: 'Roadmap Generator',
        description: 'This tool turns your Business Score into an actionable strategy.',
        actions: ['Can I edit my roadmap later?', 'What if I need help executing?']
      };
    }
    
    if (path.includes('/progress')) {
      return {
        title: 'Progress Center',
        description: 'You are viewing your overall momentum in the Operating System.',
        actions: ['How do I improve my score?', 'Where should I go next?']
      };
    }
    
    // Default
    return {
      title: 'NTA Operating System™',
      description: 'I am Your Digital Growth Guide™. I can help you navigate the system and understand our methodology.',
      actions: ['What should my first step be?', 'Explain the Growth Journey', 'Resume my previous journey']
    };
  };

  const contextData = getContextAwareHelp();

  useEffect(() => {
    if (isOpen && authStep === 'loading') {
      setAuthStep('chat');
    }
  }, [isOpen, authStep]);

  useEffect(() => {
    if (isOpen && authStep === 'chat' && !conversation) {
      initConversation();
    }
  }, [isOpen, authStep, conversation]);

  const initConversation = async () => {
    try {
        setIsLoading(true);
        const conv = await base44.agents.createConversation({
            agent_name: "nta_growth_guide",
            metadata: { name: "Digital Growth Guide Session" }
        });
        setConversation(conv);
        setMessages(conv.messages || []);
    } catch (e) {
        console.error("Error creating conversation:", e);
        setAuthStep('connect');
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
      if (!conversation) return;
      const unsubscribe = base44.agents.subscribeToConversation(conversation.id, (data) => {
          setMessages(data.messages || []);
      });
      return () => unsubscribe();
  }, [conversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e, forcedText = null) => {
    if (e) e.preventDefault();
    const text = forcedText || input.trim();
    if (!text || !conversation) return;

    if (!forcedText) setInput('');
    
    if (text === 'Resume my previous journey') {
        const memory = getJourneyMemory();
        if (memory.roadmaps && memory.roadmaps.length > 0) {
            navigate('/progress');
            setIsOpen(false);
        } else if (memory.businessScore) {
            navigate('/growth-roadmap-generator');
            setIsOpen(false);
        } else {
            navigate('/business-score');
            setIsOpen(false);
        }
        return;
    }

    try {
        await base44.agents.addMessage(conversation, {
            role: "user",
            content: text + ` (Context: Currently on ${location.pathname})`
        });
    } catch (err) {
        toast.error("Failed to send message.");
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-8 right-6 z-50 flex flex-col items-end"
          >
            <div className="flex items-center gap-3">
                <div className="bg-white/90 backdrop-blur-sm border border-white/50 shadow-lg px-4 py-2 rounded-2xl">
                    <p className="text-xs font-medium text-slate-700 flex items-center gap-2">
                        <img src={NTA_FAVICON} alt="NTA" className="w-4 h-4 object-contain" />
                        Your Digital Growth Guide™
                    </p>
                </div>
                <button
                  onClick={() => setIsOpen(true)}
                  className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform overflow-hidden border border-white/20 bg-slate-900"
                >
                  <img src={NTA_FAVICON} alt="Open Guide" className="w-8 h-8 object-contain" />
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            drag
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] h-[650px] max-h-[85vh] bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden border border-white/50"
          >
            {/* Header */}
            <div 
              onPointerDown={(e) => dragControls.start(e)}
              className="bg-gradient-to-br from-slate-900 to-slate-800 p-5 flex items-center justify-between shadow-sm z-10 relative overflow-hidden cursor-move touch-none"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center shadow-inner">
                  <img src={NTA_FAVICON} alt="NTA Guide" className="w-7 h-7 object-contain" />
                </div>
                <div>
                  <h3 className="text-white font-bold tracking-wide">Your Digital Growth Guide™</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
                    <span className="text-slate-300 text-xs font-medium">Ready to assist</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors relative z-10 bg-slate-800/50 p-2 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {authStep === 'chat' ? (
                <>
                    {/* Context Panel */}
                    <div className="bg-blue-50/80 border-b border-blue-100/50 p-4">
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Activity className="w-3 h-3" /> Page Context
                        </p>
                        <p className="text-sm text-slate-700">{contextData.description}</p>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gradient-to-b from-white/50 to-slate-50/50">
                      {isLoading && messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500">
                            <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-500" />
                            <p className="text-sm font-medium">Initializing Growth Guide...</p>
                        </div>
                      )}
                      {messages.map((message, index) => (
                        <MessageBubble key={message.id || index} message={message} />
                      ))}
                      
                      {/* Context Actions */}
                      {messages.length < 5 && (
                          <div className="flex flex-wrap gap-2 pt-2 pb-2">
                              {contextData.actions.map((action, i) => (
                                  <button 
                                      key={i}
                                      onClick={() => handleSend(null, action)} 
                                      className="text-xs bg-white border border-slate-200 shadow-sm text-slate-700 font-medium px-4 py-2 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-colors text-left"
                                  >
                                      {action}
                                  </button>
                              ))}
                          </div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-slate-100">
                        <form onSubmit={(e) => handleSend(e)} className="relative">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask a question or request guidance..."
                                className="w-full pr-14 pl-4 py-6 rounded-2xl border-slate-200 bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:bg-white transition-all shadow-sm text-sm"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!input.trim()}
                                className="absolute right-2 top-2 bottom-2 h-auto w-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white disabled:bg-slate-200 disabled:text-slate-400 shadow-md"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex justify-center items-center bg-white/50">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}