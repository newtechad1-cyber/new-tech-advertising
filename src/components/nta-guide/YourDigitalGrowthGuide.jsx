import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { appParams } from '@/lib/app-params';
import { X, Send, Loader2, AlertCircle, Zap, ChevronRight, Brain, Mic, MicOff, RotateCcw, Phone, MessageSquare, Volume2, VolumeX } from 'lucide-react';
import { Button } from "@/components/ui/button";
import FreeAIGuyAvatar from "./FreeAIGuyAvatar";

const RICK_PHONE_DISPLAY = '641-420-8816';
const RICK_PHONE_DIGITS = '16414208816';
const TEXT_TOPICS = [
  { value: 'websites', label: 'My website' },
  { value: 'seo', label: 'SEO' },
  { value: 'advertising', label: 'Advertising' },
  { value: 'ai', label: 'AI for my business' },
  { value: 'general question', label: 'A general question' },
];

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
import {
  buildPublicKnowledgeContext,
  buildPublicKnowledgeFallback
} from '@/lib/growth-guide/publicKnowledge';

const GUIDE_POSTER_URL = '/brand/free-ai-guy-approved-portrait.webp';
const RICK_WELCOME_TEXT = `Hi, I’m Rick Hesse, founder of New Tech Advertising. I built this place to help business owners make sense of technology, marketing, and AI without making it complicated. You don’t have to know all the answers before you begin. Take a look around, ask the guide a question, or tell me what is going on in your business. We’ll start with a practical next step, and if you want to talk it through personally, I’m right here.`;
const WELCOME_SEEN_KEY = 'nta_rick_welcome_seen';

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

const MessageBubble = ({ message, onSpeak, isSpeaking }) => {
    const isUser = message.role === 'user';
    
    // Strip trailing "(Context: ...)" from user messages if present for display
    const displayContent = isUser && message.content 
        ? message.content.replace(/\s*\(Context: Currently on .*\)$/, '')
        : message.content;

    return (
        <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
            {!isUser && (
                <div className="h-8 w-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm overflow-hidden">
                    <img src={GUIDE_POSTER_URL} alt="Your Digital Growth Guide" className="w-7 h-7 object-cover object-[center_16%]" />
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
                {!isUser && displayContent && (
                    <button
                        type="button"
                        onClick={() => onSpeak?.(displayContent, message.id)}
                        className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-slate-600 bg-slate-900 px-2.5 py-1.5 text-[11px] font-medium text-slate-200 transition-colors hover:border-blue-400 hover:text-white"
                    >
                        {isSpeaking ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                        {isSpeaking ? 'Stop Rick’s voice' : 'Hear Rick explain'}
                    </button>
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
  const [authStep] = useState('chat');
  const [messages, setMessages] = useState([{
    id: 'welcome',
    role: 'assistant',
    content: "Hi, I’m the NTA Digital Growth Guide. Tell me what is happening in your business, and we’ll find a practical next step together."
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [avatarMotion, setAvatarMotion] = useState('idle');
  const [discoveryMode, setDiscoveryMode] = useState(false);
  const [discoveryCreds, setDiscoveryCreds] = useState(null);
  const [pendingSubmission, setPendingSubmission] = useState(false);
  const [failedSubmission, setFailedSubmission] = useState(null);
  const [pendingAIResponse, setPendingAIResponse] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [voiceStatus, setVoiceStatus] = useState('idle');
  const [voiceError, setVoiceError] = useState('');
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [voicePlaybackError, setVoicePlaybackError] = useState('');
  const submissionLockRef = useRef(false);
  const avatarMotionTimerRef = useRef(null);
  const lastAssistantMessageRef = useRef('welcome');
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const recordingChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const recordingClockRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioAnimationRef = useRef(null);
  const guideAudioRef = useRef(null);
  const recordingStartTextRef = useRef('');
  const inputRef = useRef('');
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const dragControls = useDragControls();

  const playAvatarMotion = (motionName, duration = 0) => {
    clearTimeout(avatarMotionTimerRef.current);
    setAvatarMotion(motionName);
    if (duration) {
      avatarMotionTimerRef.current = window.setTimeout(() => setAvatarMotion('idle'), duration);
    }
  };

  useEffect(() => {
    const openGuide = () => setIsOpen(true);
    window.addEventListener('nta:open-growth-guide', openGuide);
    return () => window.removeEventListener('nta:open-growth-guide', openGuide);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      clearTimeout(avatarMotionTimerRef.current);
      setAvatarMotion('idle');
      return;
    }
    playAvatarMotion('hello', 4300);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (isListening || isLoading) {
      playAvatarMotion('listening');
      return;
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'assistant' && lastMessage.id !== lastAssistantMessageRef.current) {
      lastAssistantMessageRef.current = lastMessage.id;
      playAvatarMotion('explaining', 4200);
    }
  }, [isOpen, isListening, isLoading, messages]);

  useEffect(() => () => {
    clearTimeout(avatarMotionTimerRef.current);
    guideAudioRef.current?.pause();
  }, []);

  useEffect(() => {
    if (location.pathname !== '/' || sessionStorage.getItem(WELCOME_SEEN_KEY)) return undefined;
    const timer = window.setTimeout(() => {
      sessionStorage.setItem(WELCOME_SEEN_KEY, 'true');
      setIsOpen(true);
    }, 700);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    inputRef.current = input;
  }, [input]);

  const stopGuideVoice = () => {
    const audio = guideAudioRef.current;
    if (audio) {
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      audio.currentTime = 0;
    }
    guideAudioRef.current = null;
    setSpeakingMessageId(null);
    playAvatarMotion('idle');
  };

  const speakGuideText = async (text, messageId) => {
    if (speakingMessageId === messageId) {
      stopGuideVoice();
      return;
    }

    stopGuideVoice();
    setVoicePlaybackError('');
    try {
      const response = await base44.functions.invoke('speakGrowthGuideAnswer', { text });
      const result = response?.data ?? response;
      if (!result?.audio_url) throw new Error(result?.error || 'No audio was returned');

      const audio = new Audio(result.audio_url);
      guideAudioRef.current = audio;
      audio.onplay = () => {
        setSpeakingMessageId(messageId);
        playAvatarMotion('explaining');
      };
      audio.onended = () => {
        guideAudioRef.current = null;
        setSpeakingMessageId(null);
        playAvatarMotion('idle');
      };
      audio.onerror = () => {
        guideAudioRef.current = null;
        setSpeakingMessageId(null);
        setVoicePlaybackError('Rick’s voice could not play right now. You can still read the answer.');
        playAvatarMotion('idle');
      };
      await audio.play();
    } catch (error) {
      setSpeakingMessageId(null);
      setVoicePlaybackError(error?.response?.data?.error || error?.message || 'Rick’s voice is temporarily unavailable. You can still read the answer.');
      playAvatarMotion('idle');
    }
  };

  const releaseMicrophone = () => {
    clearTimeout(recordingTimerRef.current);
    clearInterval(recordingClockRef.current);
    cancelAnimationFrame(audioAnimationRef.current);
    audioContextRef.current?.close().catch(() => {});
    audioContextRef.current = null;
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    mediaStreamRef.current = null;
    setAudioLevel(0);
  };

  const stopVoiceInput = () => {
    clearTimeout(recordingTimerRef.current);
    const recorder = mediaRecorderRef.current;
    if (recorder?.state === 'recording') recorder.stop();
    else releaseMicrophone();
    setIsListening(false);
  };

  const cancelVoiceInput = () => {
    clearTimeout(recordingTimerRef.current);
    const recorder = mediaRecorderRef.current;
    if (recorder) {
      recorder.ondataavailable = null;
      recorder.onstop = null;
      recorder.onerror = null;
    }
    if (recorder?.state === 'recording') recorder.stop();
    recordingChunksRef.current = [];
    releaseMicrophone();
    setIsListening(false);
  };

  useEffect(() => () => cancelVoiceInput(), []);

  const blobToBase64 = async blob => {
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let binary = '';
    const chunkSize = 0x8000;
    for (let index = 0; index < bytes.length; index += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
    }
    return btoa(binary);
  };

  const toggleVoiceInput = async () => {
    if (isListening) {
      stopVoiceInput();
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      toast.error('Audio recording is not available in this browser. You can still type your message.');
      return;
    }

    try {
      setVoiceError('');
      setVoiceStatus('requesting');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });
      const mimeCandidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];
      const mimeType = mimeCandidates.find(type => MediaRecorder.isTypeSupported(type));
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);

      mediaStreamRef.current = stream;
      mediaRecorderRef.current = recorder;
      recordingChunksRef.current = [];
      recordingStartTextRef.current = inputRef.current.trim();

      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      audioContext.createMediaStreamSource(stream).connect(analyser);
      audioContextRef.current = audioContext;
      const levels = new Uint8Array(analyser.frequencyBinCount);
      const readAudioLevel = () => {
        analyser.getByteFrequencyData(levels);
        const average = levels.reduce((sum, value) => sum + value, 0) / levels.length;
        setAudioLevel(Math.min(100, Math.round(average * 1.6)));
        audioAnimationRef.current = requestAnimationFrame(readAudioLevel);
      };
      readAudioLevel();

      recorder.ondataavailable = event => {
        if (event.data?.size) recordingChunksRef.current.push(event.data);
      };
      recorder.onerror = () => {
        releaseMicrophone();
        setIsListening(false);
        setIsTranscribing(false);
        setVoiceStatus('error');
        setVoiceError('The microphone stopped unexpectedly. Please check the selected microphone and try again.');
      };
      recorder.onstop = async () => {
        releaseMicrophone();
        setIsListening(false);
        const audio = new Blob(recordingChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        recordingChunksRef.current = [];

        if (!audio.size) {
          setVoiceStatus('error');
          setVoiceError('No audio reached the recorder. Check the microphone selected for this site, then try again.');
          return;
        }

        setIsTranscribing(true);
        setVoiceStatus('transcribing');
        try {
          const payload = {
            audio_base64: await blobToBase64(audio),
            mime_type: audio.type
          };

          // Use the current site first so normal requests stay same-origin.
          // If a custom-domain edge returns 404, retry the same request through
          // Base44's direct app endpoint before reporting failure.
          const requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-App-Id': String(appParams.appId)
            },
            body: JSON.stringify(payload)
          };
          const siteFunctionUrl = `/api/apps/${appParams.appId}/functions/transcribeGrowthGuideVoice`;
          const directFunctionUrl = `https://base44.app/api/apps/${appParams.appId}/functions/transcribeGrowthGuideVoice`;
          let functionUrl = siteFunctionUrl;
          let functionResponse = await fetch(functionUrl, requestOptions);
          if (functionResponse.status === 404) {
            functionUrl = directFunctionUrl;
            functionResponse = await fetch(functionUrl, requestOptions);
          }

          let result;
          try {
            result = await functionResponse.json();
          } catch {
            result = null;
          }
          if (!functionResponse.ok) {
            const serverError = result?.error || result?.detail || `Transcription request failed (${functionResponse.status}) at ${functionUrl}.`;
            const requestError = new Error(serverError);
            requestError.response = { data: result };
            throw requestError;
          }
          if (result?.error) {
            const diagnosticCode = result.diagnostic_code ? ` [${result.diagnostic_code}]` : '';
            const providerMessage = result.provider_message ? ` OpenAI: ${result.provider_message}` : '';
            const diagnosticError = new Error(`${result.error}${diagnosticCode}${providerMessage}`);
            diagnosticError.diagnostic_code = result.diagnostic_code;
            throw diagnosticError;
          }
          const transcript = String(result?.transcript || '').trim();
          if (!transcript) throw new Error('No transcript returned');

          const nextInput = [recordingStartTextRef.current, transcript].filter(Boolean).join(' ');
          inputRef.current = nextInput;
          setInput(nextInput);
          setVoiceStatus('ready');
        } catch (error) {
          console.warn('Talk to My Office voice transcription failed.', error);
          setVoiceStatus('error');
          const responseData = error?.response?.data ?? error?.data;
          const diagnosticCode = responseData?.diagnostic_code ? ` [${responseData.diagnostic_code}]` : '';
          const providerMessage = responseData?.provider_message ? ` OpenAI: ${responseData.provider_message}` : '';
          const serverMessage = responseData?.error
            ? `${responseData.error}${diagnosticCode}${providerMessage}`
            : '';
          setVoiceError(serverMessage || error?.message || 'Your audio was recorded, but transcription failed. Please try once more.');
        } finally {
          setIsTranscribing(false);
        }
      };

      recorder.start(1000);
      setIsListening(true);
      setRecordingSeconds(0);
      setVoiceStatus('recording');
      recordingClockRef.current = setInterval(() => {
        setRecordingSeconds(seconds => seconds + 1);
      }, 1000);
      recordingTimerRef.current = setTimeout(() => stopVoiceInput(), 60_000);
    } catch (error) {
      releaseMicrophone();
      setVoiceStatus('error');
      const blocked = error?.name === 'NotAllowedError' || error?.name === 'SecurityError';
      setVoiceError(blocked
        ? 'Your microphone is blocked. Allow microphone access in your browser, then try again.'
        : 'Your browser could not open a working microphone. Check the microphone and try again.');
    }
  };

  const suggestedQuestions = [
    'Where is my business losing growth?',
    'How could AI help my business?',
    'What should I improve first?'
  ];

  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);
  const [showContactOptions, setShowContactOptions] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactTopic, setContactTopic] = useState('websites');

  const selectedTopic = TEXT_TOPICS.find(topic => topic.value === contactTopic)?.label || contactTopic;
  const textMessage = `Hi Rick, my name is ${contactName.trim() || '[your name]'}. I’d like to talk about ${selectedTopic.toLowerCase()}.`;
  const textLink = `sms:${RICK_PHONE_DIGITS}?body=${encodeURIComponent(textMessage)}`;

  const exitDiscovery = () => {
    sessionStorage.removeItem(DISCOVERY_STORAGE_KEY);
    setDiscoveryCreds(null);
    setDiscoveryMode(false);
  };

  const startFreshConversation = () => {
    cancelVoiceInput();
    if (discoveryCreds?.session_id) {
      sessionStorage.removeItem(`nta_discovery_asked_${discoveryCreds.session_id}`);
    }
    sessionStorage.removeItem(DISCOVERY_STORAGE_KEY);
    localStorage.removeItem(SAVED_DISCOVERY_STORAGE_KEY);
    setDiscoveryCreds(null);
    setDiscoveryMode(false);
    setMessages([{
      id: crypto.randomUUID(),
      role: 'assistant',
      content: "Hi, I’m the NTA Digital Growth Guide. This is a fresh conversation. Tell me what is happening in your business, and we’ll find a practical next step together."
    }]);
    inputRef.current = '';
    setInput('');
    setIsLoading(false);
    setPendingSubmission(false);
    setFailedSubmission(null);
    setPendingAIResponse(null);
    setShowKnowledgeBase(false);
    setShowContactOptions(false);
    setContactName('');
    setContactTopic('websites');
    setVoiceStatus('idle');
    setVoiceError('');
    setRecordingSeconds(0);
  };

  const rememberSavedDiscovery = sessionUpdates => {
    const saved = { ...discoveryCreds, expires_at: sessionUpdates?.expires_at || discoveryCreds?.expires_at };
    localStorage.setItem(SAVED_DISCOVERY_STORAGE_KEY, JSON.stringify(saved));
    sessionStorage.setItem(DISCOVERY_STORAGE_KEY, JSON.stringify(saved));
    setDiscoveryCreds(saved);
  };

  useEffect(() => {
    try {
      // Only resume a discovery that is active in this browser tab. A saved
      // session must never make a later visit unexpectedly open an old chat.
      const saved = sessionStorage.getItem(DISCOVERY_STORAGE_KEY);
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

  const sendToAgent = async (text, addUserMessage = true) => {
    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text
    };
    const nextMessages = addUserMessage ? [...messages, userMessage] : messages;

    if (addUserMessage) setMessages(nextMessages);
    setIsLoading(true);

    try {
      const response = await base44.functions.invoke('growthGuideChat', {
        messages: nextMessages.map(({ role, content }) => ({ role, content })),
        page_path: location.pathname,
        knowledge_context: buildPublicKnowledgeContext(text)
      });
      const result = response?.data ?? response;
      if (!result?.reply) throw new Error('The Guide returned an empty response');

      setMessages(current => [...current, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.reply
      }]);
    } catch (error) {
      console.warn('The live Growth Guide response was unavailable; using published NTA knowledge.', error);
      setMessages(current => [...current, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: buildPublicKnowledgeFallback(text)
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startDiscovery = async () => {
    if (submissionLockRef.current) return;
    submissionLockRef.current = true;
    setPendingSubmission(true);
    setFailedSubmission(null);

    try {
      const response = await base44.functions.invoke('startDiscoverySession', { mode: 'mixed' });
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
      setMessages(current => [...current, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: buildPublicKnowledgeFallback(DISCOVERY_ACTION)
      }]);
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
      await sendToAgent(pendingAIResponse.text, false);
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
    if (!text || isLoading || pendingSubmission || submissionLockRef.current) return;

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
                        <img src={GUIDE_POSTER_URL} alt="" className="w-7 h-7 rounded-full object-cover object-[center_16%]" />
                        Talk to My Office™
                    </p>
                </div>
                <button
                  onClick={() => setIsOpen(true)}
                  className="w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform overflow-hidden border border-blue-300/30 bg-slate-900 cursor-grab active:cursor-grabbing"
                >
                  <img
                    src={GUIDE_POSTER_URL}
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full origin-top scale-125 object-cover object-[center_15%] pointer-events-none"
                  />
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
            className="fixed inset-2 sm:inset-auto sm:bottom-5 sm:right-5 z-50 sm:w-[min(560px,calc(100vw-2.5rem))] sm:h-[min(780px,calc(100vh-2.5rem))] bg-slate-950 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden border border-slate-700/50"
          >
            {/* Header */}
            <div 
              onPointerDown={(e) => dragControls.start(e)}
              className="bg-slate-900 border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between shadow-sm z-10 relative overflow-hidden cursor-move touch-none"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 sm:w-28 sm:h-24 bg-slate-950 border border-slate-700 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-inner overflow-hidden">
                  <FreeAIGuyAvatar
                    motion={avatarMotion}
                    decorative
                    className="w-12 h-12 sm:w-[6.5rem] sm:h-[5.5rem] rounded-lg sm:rounded-xl"
                  />
                </div>
                <div>
                  <h3 className="text-white font-bold tracking-wide">Your Digital Growth Guide™</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
                    <span className="text-slate-300 text-xs font-medium">Ready to assist</span>
                  </div>
                </div>
              </div>
              <div className="relative z-10 flex items-center gap-1">
                <button
                  type="button"
                  onClick={startFreshConversation}
                  aria-label="Start a fresh conversation"
                  className="text-slate-300 hover:text-white transition-colors bg-slate-800/70 px-3 py-2 rounded-xl flex items-center gap-2 text-xs font-medium"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">Start fresh</span>
                </button>
                <button
                  type="button"
                  onClick={() => { cancelVoiceInput(); setIsOpen(false); }}
                  aria-label="Close Talk to My Office"
                  className="text-slate-400 hover:text-white transition-colors bg-slate-800/50 p-2 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="px-4 py-3 bg-slate-900/95 border-b border-slate-800 shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-slate-200">Want to talk with Rick directly?</p>
                  <p className="text-[11px] text-slate-400">Call or text New Tech Advertising at {RICK_PHONE_DISPLAY}.</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a
                    href={`tel:${RICK_PHONE_DIGITS}`}
                    onClick={() => playAvatarMotion('next_step', 4000)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-500"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call Rick
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      playAvatarMotion('next_step', 4000);
                      setShowContactOptions(current => !current);
                    }}
                    aria-expanded={showContactOptions}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-500"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Text Rick
                  </button>
                </div>
              </div>
              <AnimatePresence>
                {showContactOptions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 rounded-xl border border-blue-800/60 bg-slate-950/70 p-3 overflow-hidden"
                  >
                    <p className="text-xs leading-relaxed text-slate-300 mb-2">Add your name and choose a topic. Your phone will open a text addressed to Rick with this information already filled in.</p>
                    <Input
                      value={contactName}
                      onChange={event => setContactName(event.target.value)}
                      placeholder="Your name"
                      aria-label="Your name for the text message"
                      className="h-9 border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 text-xs"
                    />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {TEXT_TOPICS.map(topic => (
                        <button
                          key={topic.value}
                          type="button"
                          onClick={() => setContactTopic(topic.value)}
                          className={cn(
                            "rounded-full border px-2.5 py-1 text-[11px] transition-colors",
                            contactTopic === topic.value
                              ? "border-blue-400 bg-blue-600 text-white"
                              : "border-slate-700 bg-slate-800 text-slate-300 hover:border-blue-500 hover:text-white"
                          )}
                        >
                          {topic.label}
                        </button>
                      ))}
                    </div>
                    <a
                      href={textLink}
                      onClick={() => {
                        playAvatarMotion('next_step', 4000);
                        setShowContactOptions(false);
                      }}
                      className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-500"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Open my text message
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
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
                      {messages.length === 1 && !isLoading && (
                        <div className="pt-2 pl-11">
                          <p className="text-[11px] uppercase tracking-wider text-slate-500 mb-2">A few ways to begin</p>
                          <div className="space-y-1.5">
                            {suggestedQuestions.map(question => (
                              <button
                                key={question}
                                type="button"
                                onClick={() => handleSend(null, question)}
                                className="block text-left text-sm text-blue-300 hover:text-blue-200 hover:underline underline-offset-4"
                              >
                                {question}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {isLoading && messages.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                          The Guide is thinking…
                        </div>
                      )}
                      
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
                          <p className="mb-2 text-xs text-slate-300">
                            Talk or type your question below—or choose one of the suggestions to get started.
                          </p>
                          <form onSubmit={(e) => handleSend(e)} className="relative">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={discoveryMode ? "Answer the next audit question..." : "Ask about growth, websites, AI, trust, or your next step…"}
                                disabled={isLoading || isTranscribing || pendingSubmission || Boolean(failedSubmission) || Boolean(pendingAIResponse)}
                                className="w-full pr-24 pl-4 py-6 rounded-2xl border-slate-700 bg-slate-800 text-white placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:bg-slate-800 transition-all shadow-sm text-sm"
                            />
                            <Button
                                type="button"
                                size="icon"
                                onClick={toggleVoiceInput}
                                disabled={isTranscribing}
                                aria-label={isListening ? 'Stop recording' : isTranscribing ? 'Transcribing your recording' : 'Record your message'}
                                className={cn(
                                  "absolute right-14 top-2 bottom-2 h-auto w-10 rounded-xl text-white shadow-md transition-colors",
                                  isListening ? "bg-red-600 hover:bg-red-500" : "bg-slate-700 hover:bg-slate-600",
                                  isTranscribing && "cursor-wait"
                                )}
                            >
                                {isTranscribing
                                  ? <Loader2 className="w-4 h-4 animate-spin" />
                                  : isListening
                                    ? <MicOff className="w-4 h-4" />
                                    : <Mic className="w-4 h-4" />}
                            </Button>
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!input.trim() || isListening || isTranscribing || isLoading || pendingSubmission || Boolean(failedSubmission) || Boolean(pendingAIResponse)}
                                className="absolute right-2 top-2 bottom-2 h-auto w-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:bg-slate-700 disabled:text-slate-500 shadow-md transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                        {isListening && (
                          <div role="status" aria-live="polite" className="mt-3 rounded-xl border border-red-500/30 bg-red-950/30 px-3 py-2">
                            <div className="flex items-center justify-between text-xs text-red-200">
                              <span className="font-medium">Recording · 0:{String(recordingSeconds).padStart(2, '0')}</span>
                              <span>Click the red microphone to finish</span>
                            </div>
                            <div className="mt-2 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                              <div className="h-full bg-red-500 transition-[width] duration-100" style={{ width: `${Math.max(3, audioLevel)}%` }} />
                            </div>
                            {audioLevel < 4 && recordingSeconds >= 3 && (
                              <p className="mt-2 text-xs text-amber-300">I’m not detecting sound. Check that the correct microphone is selected.</p>
                            )}
                          </div>
                        )}
                        {isTranscribing && (
                          <p role="status" aria-live="polite" className="mt-2 text-xs text-blue-300">
                            Turning your recording into editable text…
                          </p>
                        )}
                        {voiceStatus === 'ready' && !isTranscribing && (
                          <p role="status" aria-live="polite" className="mt-2 text-xs text-emerald-300">
                            Transcript ready below. Edit it if needed, then press Send.
                          </p>
                        )}
                        {voiceError && (
                          <div role="alert" className="mt-2 rounded-xl border border-amber-500/30 bg-amber-950/30 px-3 py-2 text-xs text-amber-200">
                            {voiceError}
                          </div>
                        )}
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
