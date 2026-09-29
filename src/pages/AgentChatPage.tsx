import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  ExternalLink,
  RotateCcw,
  Copy,
  Check,
  Code2,
  Terminal,
  Settings,
  AlertCircle,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { api } from '../services/api';
import { ChatMessage } from '../components/N8nChatWidget';

const DEFAULT_WEBHOOK = 'https://srikari.app.n8n.cloud/webhook/8ba24de8-31ad-43e4-a4e8-9a740fb0409f/chat';
const TEST_WEBHOOK = 'https://srikari.app.n8n.cloud/webhook-test/8ba24de8-31ad-43e4-a4e8-9a740fb0409f/chat';

export const AgentChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg-start',
      sender: 'assistant',
      text: "👋 Welcome to the **BugHunt AI Agent Console**!\n\nI am connected to your n8n cloud webhook:\n`https://srikari.app.n8n.cloud/webhook/8ba24de8-31ad-43e4-a4e8-9a740fb0409f/chat`\n\nAsk me about code debugging, algorithmic problem analysis, memory bugs, syntax errors, or ask me to generate starter test cases!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState(() => {
    return localStorage.getItem('bughunt_n8n_webhook') || DEFAULT_WEBHOOK;
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'active' | 'inactive_fallback'>('active');
  const [showActivationTip, setShowActivationTip] = useState(false);
  const [sessionId] = useState(() => `bughunt-page-${Math.random().toString(36).slice(2, 9)}`);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const data = await api.sendN8nChat({
        message: text,
        sessionId,
        webhookUrl,
        allowFallback: true,
      });

      const assistantMessage: ChatMessage = {
        id: `msg-a-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Response received from AI assistant.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const assistantMessage: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'assistant',
        text: "I'm ready to assist you with debugging! What code or challenge are you working on right now? Paste your snippet or question and I'll break down the bug for you.",
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

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const samplePrompts = [
    'How do I detect off-by-one errors in binary search algorithms?',
    'Explain the difference between reference equality (==) and .equals() in Java',
    'Why does capturing `var` variables in JavaScript closures cause bugs?',
    'Give me a debugging checklist for C null-pointer and buffer overflow errors',
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/70 border border-purple-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-purple-600/30">
            <div className="w-full h-full bg-[#0a0e17] rounded-[14px] flex items-center justify-center">
              <Bot className="w-7 h-7 text-cyan-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">n8n AI Copilot Hub</h1>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                n8n Live
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Target Webhook: <span className="text-cyan-400">{webhookUrl}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Settings className="w-4 h-4 text-cyan-400" />
            <span>Webhook Settings</span>
          </button>

          <a
            href="https://srikari.app.n8n.cloud"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-purple-950/60 hover:bg-purple-900 text-purple-300 border border-purple-800/60 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open in n8n</span>
          </a>
        </div>
      </div>

      {/* Webhook Settings Modal/Drawer */}
      {showConfig && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">n8n Endpoint Configuration</h3>
            <button
              onClick={() => {
                setMessages([
                  {
                    id: `msg-reset-${Date.now()}`,
                    sender: 'assistant',
                    text: 'Conversation reset. How can I help you today?',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ]);
              }}
              className="text-xs text-rose-400 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Chat History</span>
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={() => {
                localStorage.setItem('bughunt_n8n_webhook', webhookUrl);
                setShowConfig(false);
              }}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl text-xs font-bold"
            >
              Save Endpoint
            </button>
          </div>

          <div className="flex items-center gap-2 pt-1 text-xs">
            <span className="text-slate-500">Presets:</span>
            <button
              onClick={() => {
                setWebhookUrl(DEFAULT_WEBHOOK);
                localStorage.setItem('bughunt_n8n_webhook', DEFAULT_WEBHOOK);
              }}
              className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 hover:text-white"
            >
              Production URL (/webhook/)
            </button>
            <button
              onClick={() => {
                setWebhookUrl(TEST_WEBHOOK);
                localStorage.setItem('bughunt_n8n_webhook', TEST_WEBHOOK);
              }}
              className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 hover:text-white"
            >
              Test URL (/webhook-test/)
            </button>
          </div>
        </div>
      )}

      {/* Main Chat Box Container */}
      <div className="flex flex-col h-[650px] rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender !== 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-purple-500/40 flex items-center justify-center shrink-0 mt-0.5">
                  {msg.sender === 'assistant' ? (
                    <Bot className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                  )}
                </div>
              )}

              <div
                className={`group relative max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-sm shadow-md'
                    : msg.isError
                    ? 'bg-rose-950/40 border border-rose-900/60 text-rose-200 rounded-bl-sm'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-sm shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                <div className="flex items-center justify-between gap-4 mt-2 pt-1 border-t border-white/10 text-[10px] text-slate-400 font-mono">
                  <span>{msg.timestamp}</span>

                  {msg.sender === 'assistant' && (
                    <button
                      onClick={() => handleCopy(msg.text, msg.id)}
                      className="opacity-60 group-hover:opacity-100 transition-opacity hover:text-cyan-300 flex items-center gap-1"
                      title="Copy response"
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
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-slate-400">
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-purple-500/40 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                <span>Contacting n8n AI agent</span>
                <span className="animate-pulse">●</span>
                <span className="animate-pulse delay-150">●</span>
                <span className="animate-pulse delay-300">●</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Prompts */}
        <div className="px-6 py-2 border-t border-slate-800/80 bg-slate-950/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] text-slate-500 font-mono shrink-0">Ideas:</span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="whitespace-nowrap px-3 py-1 text-[11px] rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 transition-colors shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <div className="relative flex items-center rounded-2xl bg-slate-900 border border-slate-800 focus-within:border-purple-500 transition-colors p-1.5">
            <textarea
              ref={inputRef}
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about code, debugging, or algorithms... (Press Enter to send)"
              className="flex-1 px-4 py-2.5 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none resize-none max-h-32"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white hover:opacity-95 disabled:opacity-40 transition-all cursor-pointer shadow-md shadow-purple-600/30"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1 font-mono">
            <span>Shift + Enter for new lines</span>
            <span>n8n Webhook: 8ba24de8-31ad-43e4-a4e8-9a740fb0409f</span>
          </div>
        </div>
      </div>
    </div>
  );
};
