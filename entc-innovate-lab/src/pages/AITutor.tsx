import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  Trash2, 
  HelpCircle, 
  Settings, 
  Code2, 
  AlertCircle, 
  Cpu, 
  Layers, 
  Wrench, 
  BookOpen 
} from 'lucide-react';
import { AIMode, ChatMessage } from '../types';
import { aiService } from '../services/aiService';
import { suggestedQuestions } from '../data/aiKnowledgeBase';

export const AITutor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `### Welcome to the ENTC AI Engineering Tutor! ⚡
I am your interactive engineering assistant for Electronics and Telecommunication Engineering.

**Select a teaching mode above**, choose from the suggested engineering topics below, or ask any technical question about:
- **Semiconductor Devices & Op-Amps**
- **Microcontrollers (AVR, ESP32, ARM Cortex)**
- **Signal Processing, Nyquist & Fourier Analysis**
- **Digital Logic & Verilog/HDL Design**`,
      timestamp: 'Just now',
      isDemo: true
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [activeMode, setActiveMode] = useState<AIMode>('beginner');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: activeMode
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const result = await aiService.askTutor(query.trim(), activeMode, messages);

      const botMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        role: 'assistant',
        content: result.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: activeMode,
        isDemo: result.isDemo
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: 'msg-err-' + Date.now(),
        role: 'assistant',
        content: `Error: ${err?.message || 'Unable to generate response'}. Please verify your connection or API key.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDemo: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: 'Conversation cleared. How can I assist with your ENTC coursework or lab experiments today?',
        timestamp: 'Just now',
        isDemo: true
      }
    ]);
  };

  const isConfigured = aiService.isConfigured();

  return (
    <div className="space-y-6 animate-fadeIn h-[calc(100vh-8rem)] flex flex-col">
      {/* Top AI Mode Selector Toolbar */}
      <div className="p-4 rounded-xl bg-[#0B101E] border border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
            Teaching Mode:
          </span>

          <button
            onClick={() => setActiveMode('beginner')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'beginner'
                ? 'bg-cyan-500 text-slate-950 shadow-xs shadow-cyan-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Beginner (Analogy)</span>
          </button>

          <button
            onClick={() => setActiveMode('stepByStep')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'stepByStep'
                ? 'bg-cyan-500 text-slate-950 shadow-xs shadow-cyan-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Step-by-Step Proof</span>
          </button>

          <button
            onClick={() => setActiveMode('troubleshoot')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'troubleshoot'
                ? 'bg-cyan-500 text-slate-950 shadow-xs shadow-cyan-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Hardware Debug</span>
          </button>

          <button
            onClick={() => setActiveMode('coding')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'coding'
                ? 'bg-cyan-500 text-slate-950 shadow-xs shadow-cyan-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Firmware & Code</span>
          </button>
        </div>

        {/* Clear & Settings Links */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <Link
            to="/settings"
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800 transition-colors"
            title="Configure API Key"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{isConfigured ? 'Custom API Active' : 'API Setup'}</span>
          </Link>
        </div>
      </div>

      {/* Main Chat Scroll Container */}
      <div className="flex-1 overflow-y-auto rounded-xl bg-[#0B101E] border border-slate-800 p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isBot = msg.role === 'assistant';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
            >
              {/* Avatar Icon */}
              <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                isBot 
                  ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-xs shadow-cyan-500/30' 
                  : 'bg-slate-800 text-slate-300 ring-1 ring-slate-700'
              }`}>
                {isBot ? <Bot className="w-4 h-4" /> : <div className="text-xs font-bold font-mono">YOU</div>}
              </div>

              {/* Message Bubble */}
              <div className={`space-y-1.5 ${isBot ? 'flex-1' : 'max-w-xl'}`}>
                <div className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed ${
                  isBot 
                    ? 'bg-[#0E1528] border border-slate-800/90 text-slate-200 shadow-md' 
                    : 'bg-cyan-500 text-slate-950 font-medium shadow-md shadow-cyan-500/20'
                }`}>
                  {/* Markdown-like formatting rendering */}
                  <div className="space-y-2 whitespace-pre-wrap font-sans">
                    {msg.content}
                  </div>

                  {/* Message Bottom Action Row (for Bot only) */}
                  {isBot && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-2">
                        <span>{msg.timestamp}</span>
                        {msg.isDemo && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[10px]">
                            ENTC Demo Mode
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 mr-auto max-w-xl">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-xl bg-[#0E1528] border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Analyzing engineering concepts & preparing formula breakdown...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Pills */}
      <div className="shrink-0 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider shrink-0 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Ask:</span>
        </span>
        {suggestedQuestions.map((sq, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(sq)}
            className="shrink-0 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40 text-xs transition-colors"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Input Form Bar */}
      <div className="p-2 rounded-xl bg-[#0B101E] border border-slate-800 flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={`Ask anything about circuits, PWM, Nyquist rate, or embedded firmware in ${activeMode} mode...`}
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputQuery.trim() || isLoading}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition-all disabled:opacity-40"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </div>
    </div>
  );
};
