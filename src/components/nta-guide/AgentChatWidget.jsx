import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Bot, X, Send, Loader2, User, Copy, FileText, CheckCircle2, AlertCircle, Clock, Zap, ChevronRight, MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";

const FunctionDisplay = ({ toolCall }) => {
    const [expanded, setExpanded] = useState(false);
    const name = toolCall?.name || 'Function';
    const status = toolCall?.status || 'pending';
    const results = toolCall?.results;
    const displayProjection = toolCall?.display_projection;
    const hideDetails = !!displayProjection?.hide_details && !!displayProjection?.details_redacted;

    const parsedResults = (() => {
        if (!results) return null;
        try {
            return typeof results === 'string' ? JSON.parse(results) : results;
        } catch {
            return results;
        }
    })();

    const isError = results && (
        (typeof results === 'string' && /error|failed/i.test(results)) ||
        (parsedResults?.success === false)
    );

    const statusConfig = {
        pending: { icon: Clock, color: 'text-slate-400', text: 'Pending' },
        running: { icon: Loader2, color: 'text-slate-500', text: 'Running...', spin: true },
        in_progress: { icon: Loader2, color: 'text-slate-500', text: 'Running...', spin: true },
        completed: isError ?
            { icon: AlertCircle, color: 'text-red-500', text: 'Failed' } :
            { icon: CheckCircle2, color: 'text-green-600', text: 'Success' },
        success: { icon: CheckCircle2, color: 'text-green-600', text: 'Success' },
        failed: { icon: AlertCircle, color: 'text-red-500', text: 'Failed' },
        error: { icon: AlertCircle, color: 'text-red-500', text: 'Failed' }
    }[status] || { icon: Zap, color: 'text-slate-500', text: '' };

    const Icon = statusConfig.icon;
    const formattedName = name.split('.').reverse().join(' ').toLowerCase();

    if (hideDetails) {
        const isActive = status === 'running' || status === 'pending' || status === 'in_progress';
        const isFailed = status === 'failed' || status === 'error' || isError;
        const StateIcon = isActive ? Loader2 : isFailed ? AlertCircle : CheckCircle2;
        const label = isActive
            ? displayProjection.active_label
            : isFailed
                ? displayProjection.error_label
                : displayProjection.label;

        return (
            <div className="mt-2 text-xs">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600">
                    <FileText className="h-3 w-3 text-slate-400" />
                    <span className="text-slate-700">{label || statusConfig.text || formattedName}</span>
                    <StateIcon className={cn(
                        "h-3 w-3",
                        isActive && "animate-spin text-slate-500",
                        isFailed && "text-red-500",
                        !isActive && !isFailed && "text-green-600"
                    )} />
                </div>
            </div>
        );
    }

    return (
        <div className="mt-2 text-xs">
            <button
                onClick={() => setExpanded(!expanded)}
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all",
                    "hover:bg-slate-50",
                    expanded ? "bg-slate-50 border-slate-300" : "bg-white border-slate-200"
                )}
            >
                <Icon className={cn("h-3 w-3", statusConfig.color, statusConfig.spin && "animate-spin")} />
                <span className="text-slate-700">{formattedName}</span>
                {statusConfig.text && (
                    <span className={cn("text-slate-500", isError && "text-red-600")}>
                        • {statusConfig.text}
                    </span>
                )}
                {!statusConfig.spin && (toolCall.arguments_string || results) && (
                    <ChevronRight className={cn("h-3 w-3 text-slate-400 transition-transform ml-auto", 
                        expanded && "rotate-90")} />
                )}
            </button>
            
            {expanded && !statusConfig.spin && (
                <div className="mt-1.5 ml-3 pl-3 border-l-2 border-slate-200 space-y-2">
                    {toolCall.arguments_string && (
                        <div>
                            <div className="text-xs text-slate-500 mb-1">Parameters:</div>
                            <pre className="bg-slate-50 rounded-md p-2 text-xs text-slate-600 whitespace-pre-wrap">
                                {(() => {
                                    try {
                                        return JSON.stringify(JSON.parse(toolCall.arguments_string), null, 2);
                                    } catch {
                                        return toolCall.arguments_string;
                                    }
                                })()}
                            </pre>
                        </div>
                    )}
                    {parsedResults && (
                        <div>
                            <div className="text-xs text-slate-500 mb-1">Result:</div>
                            <pre className="bg-slate-50 rounded-md p-2 text-xs text-slate-600 whitespace-pre-wrap max-h-48 overflow-auto">
                                {typeof parsedResults === 'object' ? 
                                    JSON.stringify(parsedResults, null, 2) : parsedResults}
                            </pre>
                        </div>
                    )}
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
                <div className="h-7 w-7 rounded-lg bg-black flex items-center justify-center flex-shrink-0 mt-0.5 overflow-hidden">
                    <img src="https://media.base44.com/images/public/691f41a18de4a7f498c8f884/04e19b127_favicon_64x64.png" alt="Bot" className="w-full h-full object-cover" />
                </div>
            )}
            <div className={cn("max-w-[85%]", isUser && "flex flex-col items-end")}>
                {message.content && (
                    <div className={cn(
                        "rounded-2xl px-4 py-2.5 shadow-sm",
                        isUser ? "bg-slate-800 text-white" : "bg-white border border-slate-200 text-slate-800"
                    )}>
                        {isUser ? (
                            <p className="text-sm leading-relaxed">{message.content}</p>
                        ) : (
                            <ReactMarkdown 
                                className="text-sm prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
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
                
                {message.tool_calls?.length > 0 && (
                    <div className="space-y-1">
                        {message.tool_calls.map((toolCall, idx) => (
                            <FunctionDisplay key={idx} toolCall={toolCall} />
                        ))}
                    </div>
                )}
            </div>
            {isUser && (
                <div className="h-7 w-7 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-slate-600" />
                </div>
            )}
        </div>
    );
};

export default function AgentChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [authStep, setAuthStep] = useState('loading'); // 'loading', 'connect', 'chat'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && authStep === 'loading') {
      base44.auth.isAuthenticated().then(isAuth => {
        if (isAuth) {
          setAuthStep('chat');
        } else {
          setAuthStep('connect');
        }
      });
    }
  }, [isOpen, authStep]);

  useEffect(() => {
    if (isOpen && authStep === 'chat' && !conversation) {
      initConversation();
    }
  }, [isOpen, authStep, conversation]);

  useEffect(() => {
    if (localStorage.getItem('nta_open_chat') === 'true') {
      base44.auth.isAuthenticated().then(isAuth => {
        if (isAuth) {
          localStorage.removeItem('nta_open_chat');
          setIsOpen(true);
          setAuthStep('chat');
        }
      });
    }
  }, []);

  const handleGoogleSignIn = () => {
    localStorage.setItem('nta_open_chat', 'true');
    base44.auth.redirectToLogin();
  };

  const initConversation = async () => {
    try {
        setIsLoading(true);
        const conv = await base44.agents.createConversation({
            agent_name: "nta_growth_guide",
            metadata: { name: "Website Visitor Chat" }
        });
        setConversation(conv);
        setMessages(conv.messages || []);
    } catch (e) {
        console.error("Error creating conversation:", e);
        toast.error("Failed to connect to agent.");
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

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !conversation) return;

    const text = input.trim();
    setInput('');
    try {
        await base44.agents.addMessage(conversation, {
            role: "user",
            content: text
        });
    } catch (err) {
        console.error("Failed to send message:", err);
        toast.error("Failed to send message.");
    }
  };

  const handleQuickAction = (text) => {
    setInput(text);
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
            <div className="flex items-start">
                <div className="mt-4 mr-2">
                    <span className="text-[11px] font-medium text-slate-600 bg-white px-2.5 py-1 rounded-full shadow-sm border border-slate-200 whitespace-nowrap">
                        Ask the Growth Guide
                    </span>
                </div>
                <button
                  onClick={() => setIsOpen(true)}
                  className="w-[50px] h-[50px] rounded-full shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity overflow-hidden border border-slate-200 bg-white"
                >
                  <img src="https://media.base44.com/images/public/691f41a18de4a7f498c8f884/04e19b127_favicon_64x64.png" alt="Bot" className="w-full h-full object-cover" />
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[600px] max-h-[85vh] bg-slate-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
          >
            {/* Header */}
            <div className="bg-slate-900 p-4 flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center overflow-hidden border border-slate-700">
                  <img src="https://media.base44.com/images/public/691f41a18de4a7f498c8f884/04e19b127_favicon_64x64.png" alt="Bot" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">NTA Growth Guide</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-slate-300 text-xs">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {authStep === 'connect' ? (
                <div className="flex-1 p-8 flex flex-col justify-center items-center bg-white text-center">
                    <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-6 overflow-hidden border border-slate-200 shadow-sm">
                        <img src="https://media.base44.com/images/public/691f41a18de4a7f498c8f884/04e19b127_favicon_64x64.png" alt="Bot" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[15px] text-slate-700 leading-relaxed mb-8">
                        Hi! I'm the NTA Growth Guide — your AI marketing advisor. Sign in to start chatting.
                    </p>
                    <div className="w-full space-y-4">
                        <Button 
                            onClick={handleGoogleSignIn}
                            variant="outline"
                            className="w-full bg-white hover:bg-slate-50 text-slate-700 font-medium py-2.5 h-auto rounded-xl border border-slate-300 shadow-sm flex items-center justify-center transition-colors"
                        >
                            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Continue with Google
                        </Button>
                        <p className="text-center text-xs text-slate-500">Quick sign-in — we'll remember you next time</p>
                    </div>
                </div>
            ) : authStep === 'chat' ? (
                <>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {isLoading && messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500">
                            <Loader2 className="w-6 h-6 animate-spin mb-2" />
                            <p className="text-sm">Connecting to agent...</p>
                        </div>
                      )}
                      {messages.map((message, index) => (
                        <MessageBubble key={message.id || index} message={message} />
                      ))}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions (only show if few messages or input empty) */}
                    {messages.length < 4 && (
                        <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide snap-x">
                            <button onClick={() => handleQuickAction("Free Gap Audit")} className="snap-start flex-shrink-0 text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                Free Gap Audit
                            </button>
                            <button onClick={() => handleQuickAction("See Pricing")} className="snap-start flex-shrink-0 text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                See Pricing
                            </button>
                            <button onClick={() => handleQuickAction("Book a Call")} className="snap-start flex-shrink-0 text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                Book a Call
                            </button>
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-3 bg-white border-t border-slate-200">
                        <form onSubmit={handleSend} className="relative">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask me anything..."
                                className="w-full pr-12 rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:bg-white transition-all shadow-sm"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!input.trim()}
                                className="absolute right-1 top-1 bottom-1 h-auto w-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-200 disabled:text-slate-400"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex justify-center items-center bg-white">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            )}

            {/* WhatsApp button */}
            <div className="bg-slate-50 p-2 text-center border-t border-slate-200 z-10">
                <a 
                    href={base44.agents.getWhatsAppConnectURL('nta_growth_guide')} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-slate-500 hover:text-green-600 flex items-center justify-center gap-1.5 transition-colors"
                >
                    <MessageCircle className="w-3.5 h-3.5" /> Continue on WhatsApp
                </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}