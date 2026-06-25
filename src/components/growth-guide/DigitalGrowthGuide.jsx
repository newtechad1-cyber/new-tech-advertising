import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { getJourneyMemory } from '@/lib/journeyMemory';
import { X, Send, Loader2, User, FileText, CheckCircle2, AlertCircle, Clock, Zap, ChevronRight, MessageCircle, Map, Target, Compass, Sparkles, Navigation, BookOpen, Activity, ArrowRight, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";

const NTA_FAVICON = "https://media.base44.com/images/public/691f41a18de4a7f498c8f884/04e19b127_favicon_64x64.png";
import { Input } from "@/components/ui/input";
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";

// Reusable Chat Components
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
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300">
                    <FileText className="h-3 w-3 text-slate-400" />
                    <span className="text-slate-200">{label || statusConfig.text || formattedName}</span>
                    <StateIcon className={cn(
                        "h-3 w-3",
                        isActive && "animate-spin text-slate-400",
                        isFailed && "text-red-400",
                        !isActive && !isFailed && "text-blue-400"
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
                    "hover:bg-slate-700",
                    expanded ? "bg-slate-800 border-slate-600" : "bg-slate-800/50 border-slate-700"
                )}
            >
                <Icon className={cn("h-3 w-3", statusConfig.color, statusConfig.spin && "animate-spin")} />
                <span className="text-slate-300">{formattedName}</span>
                {statusConfig.text && (
                    <span className={cn("text-slate-500", isError && "text-red-400")}>
                        • {statusConfig.text}
                    </span>
                )}
                {!statusConfig.spin && (toolCall.arguments_string || results) && (
                    <ChevronRight className={cn("h-3 w-3 text-slate-400 transition-transform ml-auto", 
                        expanded && "rotate-90")} />
                )}
            </button>
            
            {expanded && !statusConfig.spin && (
                <div className="mt-1.5 ml-3 pl-3 border-l-2 border-slate-700 space-y-2">
                    {toolCall.arguments_string && (
                        <div>
                            <div className="text-xs text-slate-500 mb-1">Parameters:</div>
                            <pre className="bg-slate-900 rounded-md p-2 text-xs text-slate-400 whitespace-pre-wrap">
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
                            <pre className="bg-slate-900 rounded-md p-2 text-xs text-slate-400 whitespace-pre-wrap max-h-48 overflow-auto">
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
                <div className="h-7 w-7 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5 overflow-hidden">
                    <img src={NTA_FAVICON} alt="NTA Guide" className="w-4 h-4 object-contain" />
                </div>
            )}
            <div className={cn("max-w-[85%]", isUser && "flex flex-col items-end")}>
                {message.content && (
                    <div className={cn(
                        "rounded-2xl px-4 py-2.5 shadow-sm",
                        isUser ? "bg-blue-600 text-white" : "bg-slate-800 border border-slate-700 text-slate-200"
                    )}>
                        {isUser ? (
                            <p className="text-sm leading-relaxed">{message.content}</p>
                        ) : (
                            <ReactMarkdown 
                                className="text-sm prose prose-sm prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                                components={{
                                    a: ({ children, ...props }) => (
                                        <a {...props} className="text-blue-400 hover:text-blue-300 hover:underline font-medium" target="_blank" rel="noopener noreferrer">{children}</a>
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
                <div className="h-7 w-7 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5 border border-slate-600">
                    <User className="w-4 h-4 text-slate-300" />
                </div>
            )}
        </div>
    );
};

export default function DigitalGrowthGuide() {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState('overview'); // 'overview' | 'chat'
    const location = useLocation();
    const navigate = useNavigate();
    
    // Journey & Context State
    const [memory, setMemory] = useState(null);
    const [pageContext, setPageContext] = useState({ title: '', explanation: '', related: [] });
    
    // Chat State
    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Context Generation
    useEffect(() => {
        setMemory(getJourneyMemory());
        
        const path = location.pathname;
        let ctx = {
            title: 'NTA Operating System™',
            explanation: 'You are currently navigating the core NTA Operating System. This is your command center for accessing all digital growth and diagnostic tools.',
            related: [
                { title: 'My Growth Journey', path: '/my-growth-journey', icon: Compass },
                { title: 'AI Learning Center', path: '/ai-learning-center', icon: BookOpen }
            ]
        };
        
        if (path.includes('business-score')) {
            ctx = {
                title: 'NTA Business Score™',
                explanation: 'This diagnostic evaluates your operational maturity across 6 key areas. It provides a baseline for your growth roadmap.',
                related: [
                    { title: 'Growth Roadmap', path: '/growth-roadmap-generator', icon: Map }
                ]
            };
        } else if (path.includes('growth-roadmap')) {
            ctx = {
                title: 'Growth Roadmap Generator™',
                explanation: 'This module translates your business score into a prioritized execution plan with clear action items.',
                related: [
                    { title: 'Relationship Builder', path: '/relationship-builder', icon: Users }
                ]
            };
        } else if (path.includes('partner-portal')) {
            ctx = {
                title: 'Community Partner Portal™',
                explanation: 'Your dedicated workspace for managing community connections, tracking engagement, and viewing revenue share.',
                related: [
                    { title: 'Community Intelligence', path: '/community-intelligence', icon: Activity }
                ]
            };
        } else if (path.includes('ai-learning-center')) {
            ctx = {
                title: 'AI Learning Center™',
                explanation: 'Curated learning paths designed to help you master AI implementations within your specific business context.',
                related: [
                    { title: 'NTA Operating System', path: '/operating-system', icon: Target }
                ]
            };
        } else if (path.includes('executive-dashboard')) {
            ctx = {
                title: 'NTA Executive Dashboard™',
                explanation: 'Your strategic command center for tracking cross-functional performance and long-term business goals.',
                related: [
                    { title: 'My Growth Journey', path: '/my-growth-journey', icon: Compass }
                ]
            };
        } else if (path.includes('my-growth-journey')) {
            ctx = {
                title: 'My Growth Journey™',
                explanation: 'A visual timeline tracking your completed milestones, diagnostics, and overall progress through the NTA framework.',
                related: [
                    { title: 'NTA Operating System', path: '/operating-system', icon: Target }
                ]
            };
        } else if (path.includes('data-hub')) {
            ctx = {
                title: 'NTA Data Hub™',
                explanation: 'The centralized data architecture that powers your Operating System, managing all local state and integrations.',
                related: [
                    { title: 'Executive Dashboard', path: '/executive-dashboard', icon: Activity }
                ]
            };
        } else if (path.includes('community-intelligence')) {
            ctx = {
                title: 'Community Intelligence Center™',
                explanation: 'Analyze local market trends and discover opportunities for network-wide growth.',
                related: [
                    { title: 'Community Partner Portal', path: '/partner-portal', icon: Users }
                ]
            };
        }
        setPageContext(ctx);
    }, [location.pathname, isOpen]);

    // Chat Init
    useEffect(() => {
        if (isOpen && view === 'chat' && !conversation) {
            initConversation();
        }
    }, [isOpen, view, conversation]);

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
        if (view === 'chat') {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, view]);

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

    const handleNavigate = (path) => {
        setIsOpen(false);
        navigate(path);
    };

    return (
        <>
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="fixed bottom-8 right-8 z-50 flex items-center gap-3"
                    >
                        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 shadow-lg px-4 py-2 rounded-full hidden md:flex items-center gap-2">
                            <img src={NTA_FAVICON} alt="NTA" className="w-4 h-4 object-contain" />
                            <span className="text-sm font-medium text-slate-200">Your Digital Growth Guide™</span>
                        </div>
                        <button
                            onClick={() => { setIsOpen(true); setView('overview'); }}
                            className="w-14 h-14 bg-slate-900 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center hover:scale-105 transition-transform overflow-hidden border border-slate-700"
                        >
                            <img src={NTA_FAVICON} alt="Open Guide" className="w-8 h-8 object-contain" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-6 right-6 z-50 w-[400px] h-[650px] max-h-[85vh] bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-700"
                    >
                        {/* Header */}
                        <div className="bg-slate-950/80 p-4 flex items-center justify-between border-b border-slate-800 shrink-0">
                            <div className="flex items-center gap-3">
                                {view === 'chat' && (
                                    <button 
                                        onClick={() => setView('overview')}
                                        className="text-slate-400 hover:text-white"
                                    >
                                        <ChevronRight className="w-5 h-5 rotate-180" />
                                    </button>
                                )}
                                <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center border border-slate-700">
                                    <img src={NTA_FAVICON} alt="NTA" className="w-6 h-6 object-contain" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-sm">Your Digital Growth Guide™</h3>
                                    <p className="text-blue-400 text-xs font-medium">Context-Aware Assistance</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {view === 'overview' ? (
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                                
                                {/* Context Awareness */}
                                <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Map className="w-4 h-4 text-blue-400" />
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Context</span>
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-2">{pageContext.title}</h4>
                                    <p className="text-sm text-slate-300 leading-relaxed">
                                        {pageContext.explanation}
                                    </p>
                                </div>

                                {/* Suggested Modules */}
                                {pageContext.related.length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Suggested Related Modules</h4>
                                        <div className="grid gap-2">
                                            {pageContext.related.map((mod, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleNavigate(mod.path)}
                                                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors text-left group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {mod.icon && <mod.icon className="w-4 h-4 text-blue-400" />}
                                                        <span className="text-sm font-medium text-slate-200">{mod.title}</span>
                                                    </div>
                                                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Journey Resume */}
                                {memory && memory.roadmaps.length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resume Journey</h4>
                                        <button
                                            onClick={() => handleNavigate('/growth-roadmap-generator')}
                                            className="w-full flex items-center justify-between p-4 rounded-xl bg-blue-900/20 hover:bg-blue-900/40 border border-blue-500/30 transition-colors text-left"
                                        >
                                            <div>
                                                <span className="block text-sm font-bold text-white mb-1">Active Growth Roadmap</span>
                                                <span className="block text-xs text-blue-300">You have a generated execution plan waiting.</span>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-blue-400" />
                                        </button>
                                    </div>
                                )}

                                {/* Launch Conversation */}
                                <div className="mt-8 pt-6 border-t border-slate-800">
                                    <Button 
                                        onClick={() => setView('chat')}
                                        className="w-full py-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-2"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        <span className="text-base font-semibold">Start Conversation</span>
                                    </Button>
                                    <p className="text-center text-xs text-slate-500 mt-3">Ask questions, request explanations, or get strategic advice.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col overflow-hidden bg-slate-900">
                                {/* Chat Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                                    {isLoading && messages.length === 0 && (
                                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                            <Loader2 className="w-6 h-6 animate-spin mb-3 text-blue-500" />
                                            <p className="text-sm font-medium">Initializing Digital Growth Guide...</p>
                                        </div>
                                    )}
                                    
                                    {messages.length === 0 && !isLoading && (
                                        <div className="flex flex-col items-center justify-center h-full text-center px-6">
                                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                                <Sparkles className="w-8 h-8 text-blue-400" />
                                            </div>
                                            <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                                I am Your Digital Growth Guide™. How can I assist you with your strategy or help you navigate the system today?
                                            </p>
                                            <div className="flex flex-wrap justify-center gap-2">
                                                <button onClick={() => setInput("Explain the Business Score module to me.")} className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-full hover:bg-slate-700 transition-colors">
                                                    Explain Business Score
                                                </button>
                                                <button onClick={() => setInput("What should my next strategic step be?")} className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-full hover:bg-slate-700 transition-colors">
                                                    What's my next step?
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {messages.map((message, index) => (
                                        <MessageBubble key={message.id || index} message={message} />
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Chat Input */}
                                <div className="p-4 bg-slate-950/50 border-t border-slate-800 shrink-0">
                                    <form onSubmit={handleSend} className="relative">
                                        <Input
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder="Ask your guide..."
                                            className="w-full pr-12 pl-4 py-6 rounded-xl border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:bg-slate-800 transition-all shadow-sm"
                                        />
                                        <Button
                                            type="submit"
                                            size="icon"
                                            disabled={!input.trim()}
                                            className="absolute right-2 top-2 bottom-2 h-auto w-10 rounded-lg bg-blue-600 hover:bg-blue-500 text-white disabled:bg-slate-800 disabled:text-slate-600 transition-colors"
                                        >
                                            <Send className="w-4 h-4" />
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}