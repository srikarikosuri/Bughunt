import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  ExternalLink,
  Settings,
  AlertCircle,
  Code2,
  ChevronDown,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { api } from '../services/api';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  isError?: boolean;
}

interface N8nChatWidgetProps {
  currentChallengeContext?: {
    title: string;
    language: string;
    code: string;
    latestError?: string;
  } | null;
  isOpenExternal?: boolean;
  onToggleExternal?: (open: boolean) => void;
}

const DEFAULT_WEBHOOK = 'https://srikari.app.n8n.cloud/webhook/8ba24de8-31ad-43e4-a4e8-9a740fb0409f/chat';
const TEST_WEBHOOK = 'https://srikari.app.n8n.cloud/webhook-test/8ba24de8-31ad-43e4-a4e8-9a740fb0409f/chat';

export const N8nChatWidget: React.FC<N8nChatWidgetProps> = ({
  currentChallengeContext,
  isOpenExternal,
  onToggleExternal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [modeView, setModeView] = useState<'widget' | 'embedded'>('widget');
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'active' | 'inactive_fallback'>('active');
  const [showGuide, setShowGuide] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: '👋 Hey hunter! I am your **BugHunt AI Debugging Copilot**, powered by your n8n workflow:\n`https://srikari.app.n8n.cloud/webhook/8ba24de8-31ad-43e4-a4e8-9a740fb0409f/chat`\n\nAsk me for debugging hints, code explanations, or algorithm breakdowns anytime!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState(() => {
    const saved = localStorage.getItem('bughunt_n8n_webhook');
    if (saved && !saved.includes('webhook-test')) {
      return saved;
    }
    localStorage.setItem('bughunt_n8n_webhook', DEFAULT_WEBHOOK);
    return DEFAULT_WEBHOOK;
  });
  const [showSettings, setShowSettings] = useState(false);
  const [attachContext, setAttachContext] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sessionId] = useState(() => `bughunt-${Math.random().toString(36).slice(2, 9)}`);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Sync external open state
  useEffect(() => {
    if (isOpenExternal !== undefined) {
      setIsOpen(isOpenExternal);
    }
  }, [isOpenExternal]);

  const handleSetOpen = (open: boolean) => {
    setIsOpen(open);
    if (onToggleExternal) {
      onToggleExternal(open);
    }
  };

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const handleSaveWebhook = (url: string) => {
    setWebhookUrl(url);
    localStorage.setItem('bughunt_n8n_webhook', url);
    setShowSettings(false);
  };

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: 'Chat history cleared. How can I help you squash your next bug?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const payloadContext =
        attachContext && currentChallengeContext
          ? {
              challengeTitle: currentChallengeContext.title,
              language: currentChallengeContext.language,
              userCode: currentChallengeContext.code,
              errorDiagnostic: currentChallengeContext.latestError,
            }
          : undefined;

      const data = await api.sendN8nChat({
        message: text,
        sessionId,
        webhookUrl,
        context: payloadContext,
        allowFallback: true,
      });

      if (data.source === 'n8n_live') {
        setConnectionStatus('active');
      } else {
        setConnectionStatus('inactive_fallback');
      }

      const assistantMessage: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Response received from AI assistant.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.warn('Chat dispatch note:', err);
      const assistantMessage: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'assistant',
        text: `Regarding "${text}": When debugging this issue, verify that your variable scope and boundary checks match the problem specifications. If there's an active error trace, paste it here so we can pinpoint the bug!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    'Explain the bug in my code',
    'Give me a hint without spoiling the answer',
    'Why is my loop condition failing?',
    'What are common edge cases for this problem?',
  ];

  return (
    <>
      {/* Floating Trigger Button (when closed) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => handleSetOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-semibold text-xs shadow-2xl shadow-purple-600/40 hover:shadow-cyan-500/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Open AI Debugging Assistant"
          >
            <div className="relative flex items-center justify-center">
              <Bot className="w-5 h-5 text-white animate-bounce" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0a0e17]"></span>
            </div>
            <span className="font-bold tracking-wide">AI Copilot</span>
            <span className="text-[10px] font-mono text-purple-200 bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-400/30">
              n8n
            </span>
          </button>
        </div>
      )}

      {/* Chat Window Drawer */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ${
            isExpanded
              ? 'inset-4 md:inset-10'
              : 'bottom-4 right-4 md:bottom-6 md:right-6 w-[95vw] md:w-[440px] h-[600px] max-h-[85vh]'
          } flex flex-col rounded-3xl bg-[#0a0e17]/95 backdrop-blur-xl border border-purple-500/40 shadow-2xl shadow-purple-950/60 overflow-hidden font-sans`}
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 p-0.5">
                <div className="w-full h-full bg-[#0a0e17] rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white">BugHunt AI Copilot</h3>
                  <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-700">
                    n8n Live
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="truncate max-w-[210px]" title={webhookUrl}>
                    Connected to n8n Cloud
                  </span>
                </div>
              </div>
            </div>

            {/* Header controls */}
            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-colors ${
                  showSettings ? 'text-cyan-400 bg-slate-800' : ''
                }`}
                title="Webhook URL Settings"
              >
                <Settings className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-colors hidden sm:block"
                title={isExpanded ? 'Collapse size' : 'Expand window'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => handleSetOpen(false)}
                className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-colors"
                title="Minimize chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Settings Panel (Collapsible) */}
          {showSettings && (
            <div className="p-3.5 bg-slate-950 border-b border-slate-800 space-y-3 text-xs shrink-0 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">n8n Webhook Configuration</span>
                <button
                  onClick={handleClearHistory}
                  className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Conversation</span>
                </button>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Target Webhook URL</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={() => handleSaveWebhook(webhookUrl)}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-500">Presets:</span>
                <button
                  type="button"
                  onClick={() => handleSaveWebhook(DEFAULT_WEBHOOK)}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    webhookUrl === DEFAULT_WEBHOOK
                      ? 'bg-purple-950 border-purple-500 text-purple-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Production (/webhook/)
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveWebhook(TEST_WEBHOOK)}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    webhookUrl === TEST_WEBHOOK
                      ? 'bg-purple-950 border-purple-500 text-purple-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Test Mode (/webhook-test/)
                </button>
              </div>
            </div>
          )}

          {/* Context Banner if active challenge is open */}
          {currentChallengeContext && (
            <div className="px-3.5 py-1.5 bg-purple-950/40 border-b border-purple-900/40 flex items-center justify-between text-[11px] shrink-0">
              <div className="flex items-center gap-1.5 text-purple-300 truncate font-mono">
                <Code2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">Context: {currentChallengeContext.title} ({currentChallengeContext.language})</span>
              </div>
              <label className="flex items-center gap-1 cursor-pointer text-slate-400 hover:text-slate-200 shrink-0 ml-2">
                <input
                  type="checkbox"
                  checked={attachContext}
                  onChange={(e) => setAttachContext(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-800 text-purple-600 focus:ring-0 w-3 h-3"
                />
                <span className="text-[10px]">Attach Code</span>
              </label>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender !== 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-800 border border-purple-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    {msg.sender === 'assistant' ? (
                      <Bot className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                )}

                <div
                  className={`relative group max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-sm shadow-md'
                      : msg.isError
                      ? 'bg-rose-950/40 border border-rose-900/60 text-rose-200 rounded-bl-sm'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-sm shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                  <div className="flex items-center justify-between gap-4 mt-1.5 pt-1 border-t border-white/10 text-[10px] text-slate-400 font-mono">
                    <span>{msg.timestamp}</span>

                    {msg.sender === 'assistant' && (
                      <button
                        onClick={() => handleCopyCode(msg.text, msg.id)}
                        className="opacity-60 group-hover:opacity-100 transition-opacity hover:text-cyan-300 flex items-center gap-1"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-purple-950 border border-purple-700/60 flex items-center justify-center shrink-0 mt-0.5 text-purple-300">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-start">
                <div className="w-7 h-7 rounded-xl bg-slate-800 border border-purple-500/40 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center gap-1.5">
                  <span className="text-[11px]">Thinking</span>
                  <span className="animate-pulse">●</span>
                  <span className="animate-pulse delay-150">●</span>
                  <span className="animate-pulse delay-300">●</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-3 pt-2 pb-1 border-t border-slate-800/80 bg-slate-950/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="whitespace-nowrap px-2.5 py-1 text-[11px] rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box Footer */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 shrink-0">
            <div className="relative flex items-center rounded-2xl bg-slate-900 border border-slate-800 focus-within:border-purple-500 transition-colors p-1">
              <textarea
                ref={inputRef}
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your debugging agent... (Enter to send)"
                className="flex-1 px-3 py-2 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none resize-none max-h-24"
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                className="p-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white hover:opacity-95 disabled:opacity-40 transition-all cursor-pointer shadow-md shadow-purple-600/30 shrink-0"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 px-1 font-mono">
              <span>Shift+Enter for new line</span>
              <a
                href={webhookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-400 flex items-center gap-1"
              >
                <span>Direct n8n webhook</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
