import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { X, Send, Loader2, AlertCircle, Zap, ChevronRight, Brain } from 'lucide-react';
import { Button } from "@/components/ui/button";

const NTA_FAVICON = "https://media.base44.com/images/public/691f41a18de4a7f498c8f884/04e19b127_favicon_64x64.png";
const DISCOVERY_ACTION = 'Walk through my business growth';
const DISCOVERY_STORAGE_KEY = 'nta_discovery_session';
const SAVED_DISCOVERY_STORAGE_KEY = 'nta_saved_discovery_session';
import { Input } from "@/components/ui/input";
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from 'react-router-dom';
import { getJourneyMemory } from '@/lib/journeyMemory';
import DiscoveryWalkthrough from './DiscoveryWalkthrough';

const FunctionDisplay = ({ toolCall }) => {
    const [expanded, setExpanded] = useState(false);
    
    let isFailed = toolCall?.status === 'failed' || toolCall?.status === 'error';
    let parsedResults = null;
    if (toolCall?.results) {
        try {
            parsedResults = typeof toolCall.results === 'string' ? JSON.parse(toolCall.results) : toolCall.results;
            if (parsedResults?.success === false) isFailed = true;
        } catch {
            parsedResults = toolCall.results;
        }
    }
    
    const dp = toolCall?.display_projection || {};
    const hideDetails = dp.hide_details && dp.details_redacted;
    
    let label = dp.label || toolCall?.name || 'System Action';
    if (isFailed && dp.error_label) label = dp.error_label;
    else if (!toolCall?.results && dp.active_label) label = dp.active_label;

    return (
        <div className="mt-2 text-xs">
            <button
                onClick={() => !hideDetails && setExpanded(!expanded)}
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors",
                    isFailed ? "bg-red-900/20 border-red-800/50 text-red-400" : 
                    !toolCall?.results ? "bg-blue-900/20 border-blue-800/50 text-blue-400" : 
                    "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                )}
            >
                {isFailed ? <AlertCircle className="h-3 w-3" /> : 
                 !toolCall?.results ? <Loader2 className="h-3 w-3 animate-spin" /> : 
                 <Zap className="h-3 w-3" />}
                <span className="font-medium">{label}</span>
                {!hideDetails && (
                    <ChevronRight className={cn("h-3 w-3 opacity-50 ml-auto transition-transform", expanded && "rotate-90")} />
                )}
            </button>
            {expanded && !hideDetails && (
                <div className="mt-1.5 ml-3 pl-3 border-l-2 border-slate-700 text-slate-400 space-y-1 overflow-hidden">
                    {toolCall?.arguments_string && (
                        <div>
                            <span className="text-slate-500 font-medium">Parameters:</span>
                            <pre className="mt-0.5 p-1.5 bg-slate-900 rounded text-[10px] overflow-x-auto">
                                {toolCall.arguments_string}
                            </pre>
                        </div>
                    )}
                    {toolCall?.results && (
                        <div>
                            <span className="text-slate-500 font-medium">Result:</span>
                            <pre className="mt-0.5 p-1.5 bg-slate-900 rounded text-[10px] overflow-x-auto whitespace-pre-wrap">
                                {typeof parsedResults === 'object' ? JSON.stringify(parsedResults, null, 2) : parsedResults}
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
    
    // Strip trailing "(Context: ...)" from user messages if present for display
    const displayContent = isUser && message.content 
        ? message.content.replace(/\s*\(Context: Currently on .*\)$/, '')
        : message.content;

    return (
        <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
            {!isUser && (
                <div className="h-8 w-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm overflow-hidden">
                    <img src={NTA_FAVICON} alt="NTA Guide" className="w-5 h-5 object-contain" />
                </div>
            )}
            <div className={cn("max-w-[85%]", isUser && "flex flex-col items-end")}>
                {displayContent && (
                    <div className={cn(
                        "rounded-2xl px-4 py-3 shadow-sm text-sm",
                        isUser ? "bg-blue-600 text-white" : "bg-slate-800 border border-slate-700 text-slate-200"
                    )}>
                        {isUser ? (
                            <p className="leading-relaxed">{displayContent}</p>
                        ) : (
                            <ReactMarkdown 
                                className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 text-slate-200 prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-strong:text-white"
                                components={{
                                    a: ({ children, ...props }) => (
                                        <a {...props} className="font-medium underline decoration-blue-500/30 underline-offset-2" target="_blank" rel="noopener noreferrer">{children}</a>
                                    )
                                }}
                            >
                                {displayContent}
                            </ReactMarkdown>
                        )}
                    </div>
                )}
                {message.tool_calls?.map((toolCall, idx) => (
                    <FunctionDisplay key={idx} toolCall={toolCall} />
                ))}
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
  const [discoveryMode, setDiscoveryMode] = useState(false);
  const [discoveryCreds, setDiscoveryCreds] = useState(null);
  const [pendingSubmission, setPendingSubmission] = useState(false);
  const [failedSubmission, setFailedSubmission] = useState(null);
  const [pendingAIResponse, setPendingAIResponse] = useState(null);
  const submissionLockRef = useRef(false);
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const quickActionsRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const scrollQuickActions = (dir) => {
    if (quickActionsRef.current) {
      quickActionsRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
    }
  };
  const location = useLocation();
  const navigate = useNavigate();
  const dragControls = useDragControls();

  const quickActions = [
    'What is the NTA Operating System™?',
    DISCOVERY_ACTION,
    'Help me understand AI for my business',
    'Show me the Growth Roadmap™',
    'I’m interested in becoming a Community Partner',
    'Schedule a Discovery Meeting'
  ];

  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);

  const exitDiscovery = () => {
    sessionStorage.removeItem(DISCOVERY_STORAGE_KEY);
    setDiscoveryCreds(null);
    setDiscoveryMode(false);
  };

  const rememberSavedDiscovery = sessionUpdates => {
    const saved = { ...discoveryCreds, expires_at: sessionUpdates?.expires_at || discoveryCreds?.expires_at };
    localStorage.setItem(SAVED_DISCOVERY_STORAGE_KEY, JSON.stringify(saved));
    sessionStorage.setItem(DISCOVERY_STORAGE_KEY, JSON.stringify(saved));
    setDiscoveryCreds(saved);
  };

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(DISCOVERY_STORAGE_KEY) || localStorage.getItem(SAVED_DISCOVERY_STORAGE_KEY);
      if (!saved) return;

      const parsed = JSON.parse(saved);
      const isUnexpired = !parsed?.expires_at || new Date(parsed.expires_at) > new Date();
      if (parsed?.session_id && parsed?.public_session_key && isUnexpired) {
        setDiscoveryCreds(parsed);
        setDiscoveryMode(true);
      } else {
        sessionStorage.removeItem(DISCOVERY_STORAGE_KEY);
      }
    } catch {
      sessionStorage.removeItem(DISCOVERY_STORAGE_KEY);
    }
  }, []);

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

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setAutoScroll(isNearBottom);
  };

  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView();
    }
  }, [messages, autoScroll]);

  const sendToAgent = async (text) => {
    await base44.agents.addMessage(conversation, {
      role: "user",
      content: text + ` (Context: Currently on ${location.pathname})`
    });
  };

  const startDiscovery = async () => {
    if (submissionLockRef.current) return;
    submissionLockRef.current = true;
    setPendingSubmission(true);
    setFailedSubmission(null);

    try {
      const response = await base44.functions.invoke('startDiscoverySession', { mode: 'text' });
      const creds = response?.data ?? response;

      if (!creds?.session_id || !creds?.public_session_key) {
        throw new Error('Discovery session credentials were not returned');
      }

      const storedCreds = {
        session_id: creds.session_id,
        public_session_key: creds.public_session_key,
        expires_at: creds.expires_at
      };

      sessionStorage.setItem(DISCOVERY_STORAGE_KEY, JSON.stringify(storedCreds));
      setDiscoveryCreds(storedCreds);
      setDiscoveryMode(true);

      try {
        await sendToAgent(DISCOVERY_ACTION);
      } catch {
        setPendingAIResponse({ text: DISCOVERY_ACTION });
        toast.error("Your audit is ready, but the Guide didn't respond. Retry below.");
      }
    } catch {
      toast.error('Unable to start the audit. Please try again.');
    } finally {
      submissionLockRef.current = false;
      setPendingSubmission(false);
    }
  };

  const persistDiscoveryAnswer = async (submission) => {
    const response = await base44.functions.invoke('appendDiscoveryEntry', {
      session_id: discoveryCreds.session_id,
      public_session_key: discoveryCreds.public_session_key,
      client_request_id: submission.clientRequestId,
      text: submission.text,
      speaker: 'owner',
      source_mode: 'text'
    });
    return response?.data ?? response;
  };

  const submitDiscoveryAnswer = async (submission) => {
    if (submissionLockRef.current) return;
    submissionLockRef.current = true;
    setPendingSubmission(true);

    try {
      await persistDiscoveryAnswer(submission);
      setFailedSubmission(null);

      try {
        await sendToAgent(submission.text);
        setPendingAIResponse(null);
      } catch {
        setPendingAIResponse({ text: submission.text });
        toast.error("Your answer was saved, but the Guide didn't respond. Retry below.");
      }
    } catch {
      setFailedSubmission(submission);
      toast.error('Your answer was not saved. Retry before continuing.');
    } finally {
      submissionLockRef.current = false;
      setPendingSubmission(false);
    }
  };

  const retryAIResponse = async () => {
    if (!pendingAIResponse || pendingSubmission || submissionLockRef.current) return;

    submissionLockRef.current = true;
    setPendingSubmission(true);
    try {
      await sendToAgent(pendingAIResponse.text);
      setPendingAIResponse(null);
    } catch {
      toast.error("The Guide still couldn't respond. Your saved answer is safe.");
    } finally {
      submissionLockRef.current = false;
      setPendingSubmission(false);
    }
  };

  const handleSend = async (e, forcedText = null) => {
    if (e) e.preventDefault();
    const text = forcedText || input.trim();
    if (!text || !conversation || pendingSubmission || submissionLockRef.current) return;

    if (text === DISCOVERY_ACTION) {
      if (!discoveryMode) {
        await startDiscovery();
      } else {
        submissionLockRef.current = true;
        setPendingSubmission(true);
        try {
          await sendToAgent(DISCOVERY_ACTION);
        } catch {
          setPendingAIResponse({ text: DISCOVERY_ACTION });
          toast.error("The Guide didn't respond. Retry below.");
        } finally {
          submissionLockRef.current = false;
          setPendingSubmission(false);
        }
      }
      return;
    }

    if (!forcedText) setInput('');

    setAutoScroll(true);
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);

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

    if (discoveryMode) {
      const submission = {
        text,
        clientRequestId: crypto.randomUUID()
      };
      await submitDiscoveryAnswer(submission);
      return;
    }

    try {
      await sendToAgent(text);
    } catch {
      toast.error("Failed to send message.");
    }
  };

  return (
    <div id="nta-guide-container">
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            drag
            dragMomentum={false}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            id="nta-guide-container"
            className="fixed bottom-8 right-6 z-50 flex flex-col items-end"
          >
            <div className="flex items-center gap-3">
                <div className="hidden sm:block bg-slate-900/95 backdrop-blur-sm border border-slate-700/50 shadow-lg px-4 py-2 rounded-2xl pointer-events-none">
                    <p className="text-xs font-medium text-slate-200 flex items-center gap-2">
                        <img src={NTA_FAVICON} alt="NTA" className="w-4 h-4 object-contain" />
                        The NTA Growth Guide™
                    </p>
                </div>
                <button
                  onClick={() => setIsOpen(true)}
                  className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform overflow-hidden border border-white/20 bg-slate-900 cursor-grab active:cursor-grabbing"
                >
                  <img src={NTA_FAVICON} alt="Open Guide" className="w-8 h-8 object-contain pointer-events-none" />
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
            className="fixed bottom-6 right-6 z-50 w-[400px] h-[650px] max-h-[85vh] bg-slate-950 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden border border-slate-700/50"
          >
            {/* Header */}
            <div 
              onPointerDown={(e) => dragControls.start(e)}
              className="bg-slate-900 border-b border-slate-800 p-5 flex items-center justify-between shadow-sm z-10 relative overflow-hidden cursor-move touch-none"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-slate-950 border border-slate-700 rounded-xl flex items-center justify-center shadow-inner">
                  <img src={NTA_FAVICON} alt="NTA Guide" className="w-7 h-7 object-contain" />
                </div>
                <div>
                  <h3 className="text-white font-bold tracking-wide">The NTA Growth Guide™</h3>
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
                discoveryMode && discoveryCreds ? (
                  <DiscoveryWalkthrough credentials={discoveryCreds} onExit={exitDiscovery} onSaved={rememberSavedDiscovery} onSchedule={() => { setIsOpen(false); navigate('/growth-conversation'); }} />
                ) : (
                <>
                    {/* Messages */}
                    {discoveryMode && (
                      <div className="px-5 py-2 bg-blue-950/40 border-b border-blue-800/50 text-xs text-blue-200">
                        Discovery Mode · Your audit answers are being saved for this browser session.
                      </div>
                    )}
                    <div 
                      ref={scrollContainerRef}
                      onScroll={handleScroll}
                      className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-950 custom-scrollbar"
                    >
                      {isLoading && messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                            <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-500" />
                            <p className="text-sm font-medium">Initializing Growth Guide...</p>
                        </div>
                      )}
                      {messages.map((message, index) => (
                        <MessageBubble key={message.id || index} message={message} />
                      ))}
                      
                      <div ref={messagesEndRef} className="h-1" />
                    </div>

                    {/* Footer Area */}
                    <div className="bg-slate-900 border-t border-slate-800 flex flex-col shrink-0">
                      {/* Expandable Knowledge Base Info */}
                      <div className="px-4 py-2 border-b border-slate-800">
                        <button 
                          onClick={() => setShowKnowledgeBase(!showKnowledgeBase)}
                          className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 hover:text-blue-400 transition-colors"
                        >
                          <Brain className="w-3 h-3" />
                          Powered by the NTA Knowledge Base™
                        </button>
                        <AnimatePresence>
                          {showKnowledgeBase && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2 p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-300 leading-relaxed overflow-hidden"
                            >
                              The NTA Knowledge Base™ is the living intelligence behind New Tech Advertising. It connects the Brand Book™, Operating System™, product library, partner materials, and approved messaging so every conversation reflects the same commitment to education, clarity, and sustainable growth.
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Quick Start Actions */}
                      {messages.length < 5 && (
                          <div className="relative pt-3 pb-1 flex items-center group">
                              <button 
                                type="button"
                                onClick={() => scrollQuickActions('left')}
                                className="absolute left-0 z-10 h-full pl-2 pr-6 flex items-center bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent text-slate-400 hover:text-white opacity-0 md:group-hover:opacity-100 transition-opacity pointer-events-none md:pointer-events-auto"
                              >
                                <ChevronRight className="w-5 h-5 rotate-180" />
                              </button>
                              
                              <div 
                                  ref={quickActionsRef}
                                  className="px-4 flex overflow-x-auto gap-2 w-full scroll-smooth" 
                                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                              >
                                  {quickActions.map((action, i) => (
                                      <button 
                                          key={i}
                                          onClick={() => handleSend(null, action)}
                                          disabled={pendingSubmission}
                                          className="shrink-0 text-xs bg-slate-800 border border-slate-700 shadow-sm text-slate-300 font-medium px-3 py-1.5 rounded-xl hover:border-blue-500/50 hover:bg-slate-700 hover:text-white transition-colors"
                                      >
                                          {action}
                                      </button>
                                  ))}
                              </div>

                              <button 
                                type="button"
                                onClick={() => scrollQuickActions('right')}
                                className="absolute right-0 z-10 h-full pr-2 pl-6 flex items-center bg-gradient-to-l from-slate-900 via-slate-900/90 to-transparent text-slate-400 hover:text-white opacity-0 md:group-hover:opacity-100 transition-opacity pointer-events-none md:pointer-events-auto"
                              >
                                <ChevronRight className="w-5 h-5" />
                              </button>
                          </div>
                      )}

                      {(failedSubmission || pendingAIResponse) && (
                        <div className="px-4 pt-3 flex gap-2">
                          {failedSubmission && (
                            <Button
                              type="button"
                              size="sm"
                              disabled={pendingSubmission}
                              onClick={() => submitDiscoveryAnswer(failedSubmission)}
                              className="bg-amber-600 hover:bg-amber-500 text-white"
                            >
                              Retry saving answer
                            </Button>
                          )}
                          {pendingAIResponse && (
                            <Button
                              type="button"
                              size="sm"
                              disabled={pendingSubmission}
                              onClick={retryAIResponse}
                              className="bg-blue-600 hover:bg-blue-500 text-white"
                            >
                              Retry AI response
                            </Button>
                          )}
                        </div>
                      )}

                      {/* Input */}
                      <div className="p-4 pt-2">
                          <form onSubmit={(e) => handleSend(e)} className="relative">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={discoveryMode ? "Answer the next audit question..." : "Ask a question or request guidance..."}
                                disabled={pendingSubmission || Boolean(failedSubmission) || Boolean(pendingAIResponse)}
                                className="w-full pr-14 pl-4 py-6 rounded-2xl border-slate-700 bg-slate-800 text-white placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:bg-slate-800 transition-all shadow-sm text-sm"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!input.trim() || pendingSubmission || Boolean(failedSubmission) || Boolean(pendingAIResponse)}
                                className="absolute right-2 top-2 bottom-2 h-auto w-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:bg-slate-700 disabled:text-slate-500 shadow-md transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                      </div>
                    </div>
                </>
                )
            ) : (
                <div className="flex-1 flex justify-center items-center bg-slate-950">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
