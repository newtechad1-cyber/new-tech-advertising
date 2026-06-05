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
                <div className="h-7 w-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-blue-600" />
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

  const handleConnect = async (e) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;
    setIsAuthLoading(true);
    
    let pass = localStorage.getItem('nta_chat_pass');
    if (!pass) {
        pass = crypto.randomUUID();
        localStorage.setItem('nta_chat_pass', pass);
    }
    
    try {
        try {
            await base44.auth.register({ email: email.trim(), password: pass, full_name: name.trim() });
        } catch (regErr) {
            // Might already exist, ignore and try to login
        }
        await base44.auth.loginViaEmailPassword(email.trim(), pass);
        setAuthStep('chat');
    } catch (e) {
        toast.error("Could not connect. Please try again.");
    } finally {
        setIsAuthLoading(false);
    }
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
            <button
              onClick={() => setIsOpen(true)}
              className="w-[50px] h-[50px] bg-slate-900 rounded-full shadow-lg flex items-center justify-center hover:bg-slate-800 transition-colors mb-2 mr-2"
            >
              <Bot className="w-6 h-6 text-white" />
            </button>
            <div className="pr-4">
                <span className="text-[11px] font-medium text-slate-600 bg-white px-2.5 py-1 rounded-full shadow-sm border border-slate-200">
                    Ask the Growth Guide
                </span>
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
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-blue-400" />
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
                <div className="flex-1 p-8 flex flex-col justify-center items-center bg-white">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">Quick connect to chat</h3>
                    <form onSubmit={handleConnect} className="w-full space-y-4">
                        <div>
                            <Input 
                                placeholder="Name" 
                                value={name} 
                                onChange={e => setName(e.target.value)}
                                required
                                className="w-full"
                            />
                        </div>
                        <div>
                            <Input 
                                type="email"
                                placeholder="Email" 
                                value={email} 
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="w-full"
                            />
                        </div>
                        <Button 
                            type="submit" 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 h-auto rounded-xl"
                            disabled={isAuthLoading}
                        >
                            {isAuthLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Start Chatting →'}
                        </Button>
                        <p className="text-center text-xs text-slate-500 mt-4">We'll remember you next time</p>
                    </form>
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
                            <button onClick={() => handleQuickAction("What services do you offer?")} className="snap-start flex-shrink-0 text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                What services do you offer?
                            </button>
                            <button onClick={() => handleQuickAction("Can I get a gap audit?")} className="snap-start flex-shrink-0 text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                Can I get a gap audit?
                            </button>
                            <button onClick={() => handleQuickAction("How much does it cost?")} className="snap-start flex-shrink-0 text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                How much does it cost?
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