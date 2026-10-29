import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  Key, 
  AlertCircle, 
  Sliders, 
  Terminal, 
  BookOpen, 
  HelpCircle,
  Wrench,
  GraduationCap,
  ShieldAlert
} from 'lucide-react';
import { ChatMessage } from '../../types';
import { aiTutorService } from '../../services/aiTutorService';
import { useApp } from '../../context/AppContext';

export const TutorChat: React.FC = () => {
  const { settings, updateSettings, completeExperiment } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      content: `👋 **Welcome to the ENTC AI Engineering Tutor!**
I am your smart companion for Electronics and Telecommunication Engineering. 

I can help you:
- Derive formulas (Fourier, Nyquist, Shannon-Hartley, Ohm's & Kirchhoff's laws)
- Debug embedded C++ code and Arduino circuits
- Explain microcontrollers, RF communication, DSP filters, and digital logic gates
- Provide step-by-step circuit analysis and hardware troubleshooting

*Feel free to select an explanation mode below or ask any question!*`,
      timestamp: new Date().toLocaleTimeString(),
      suggestedFollowUps: [
        'Explain the difference between analog and digital signals.',
        'Why does an AND gate output zero if one input is zero?',
        'How does Pulse Width Modulation (PWM) work?',
        'How does an LM35 temperature sensor interface with an ADC?'
      ],
      isDemoMode: !settings.geminiApiKey
    }
  ]);

  const [input, setInput] = useState<string>('');
  const [mode, setMode] = useState<'beginner' | 'step-by-step' | 'troubleshoot' | 'coding'>('beginner');
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false);
  const [tempApiKey, setTempApiKey] = useState<string>(settings.geminiApiKey || '');

  const suggestedQuestions = [
    'Explain the difference between analog and digital signals.',
    'Why does an AND gate output zero if one input is zero?',
    'Help me debug this Arduino temperature-monitoring code.',
    'Explain PWM with a practical example.',
    'How does a temperature sensor work?'
  ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString(),
      mode
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await aiTutorService.sendMessage({
        message: textToSend,
        mode,
        history: messages,
        apiKey: settings.geminiApiKey,
        model: settings.aiModel
      });

      const assistantMsg: ChatMessage = {
        id: 'asst-' + Date.now(),
        sender: 'assistant',
        content: response.content,
        timestamp: new Date().toLocaleTimeString(),
        mode,
        suggestedFollowUps: response.suggestedFollowUps,
        isDemoMode: response.isDemoMode
      };

      setMessages(prev => [...prev, assistantMsg]);
      completeExperiment('ai-chat', 'AI Tutor Consultation', 20);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
        id: 'init-reset',
        sender: 'assistant',
        content: 'Conversation reset. How can I assist with your ENTC studies today?',
        timestamp: new Date().toLocaleTimeString(),
        suggestedFollowUps: suggestedQuestions.slice(0, 3),
        isDemoMode: !settings.geminiApiKey
      }
    ]);
  };

  const handleSaveApiKey = () => {
    updateSettings({ geminiApiKey: tempApiKey.trim() });
    setShowApiKeyModal(false);
  };

  return (
    <div className="flex flex-col h-[750px] rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
      {/* Top Header / Mode Switcher */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">ENTC AI Learning Assistant</h3>
              {settings.geminiApiKey ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                  Gemini API Connected
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold">
                  Demo Knowledge Engine
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              Interactive Hardware, Circuitry & Telecom Tutor
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowApiKeyModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition-colors"
          >
            <Key className="h-3.5 w-3.5 text-cyan-400" />
            <span>{settings.geminiApiKey ? 'API Configured' : 'Setup Gemini API'}</span>
          </button>

          <button
            onClick={handleClear}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            title="Clear Chat History"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mode Switcher Chips */}
      <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-semibold mr-1">Tutor Persona:</span>
        {[
          { id: 'beginner', label: 'Explain Like Beginner', icon: GraduationCap },
          { id: 'step-by-step', label: 'Step-by-Step Derivation', icon: BookOpen },
          { id: 'troubleshoot', label: 'Hardware Troubleshooting', icon: Wrench },
          { id: 'coding', label: 'Embedded C++ / Code', icon: Terminal }
        ].map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                mode === m.id
                  ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold shadow-sm shadow-cyan-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-2 mb-1 px-1">
              <span className="text-[10px] text-slate-400 font-mono">
                {msg.sender === 'user' ? 'You' : 'ENTC Tutor AI'} • {msg.timestamp}
              </span>
              {msg.isDemoMode && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/20">
                  ENTC Demo Engine
                </span>
              )}
            </div>

            <div
              className={`relative max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-br-none shadow-md shadow-cyan-500/10'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none shadow-lg'
              }`}
            >
              {/* Copy Button */}
              {msg.sender === 'assistant' && (
                <button
                  onClick={() => handleCopy(msg.id, msg.content)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
                  title="Copy Answer"
                >
                  {copiedId === msg.id ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              )}

              <div className="whitespace-pre-line font-sans space-y-2">
                {msg.content}
              </div>

              {/* Follow Up Suggestion Chips */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5">
                  <div className="text-[11px] font-semibold text-cyan-400 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Suggested Next Questions:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestedFollowUps.map((fu, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(fu)}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors text-left"
                      >
                        {fu}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-cyan-400 animate-pulse font-mono">
            <Bot className="h-4 w-4 animate-bounce" />
            <span>Analyzing engineering schematics and computing response...</span>
          </div>
        )}
      </div>

      {/* Suggested Questions Carousel */}
      <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
        <span className="text-slate-400 text-[11px] whitespace-nowrap">Examples:</span>
        {suggestedQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q)}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 whitespace-nowrap text-[11px] transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Composer Box */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Ask anything about circuits, PWM, DSP, sensors, microcontrollers (${mode} mode)...`}
          className="flex-1 py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
        />

        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/25 transition-all disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      {/* Gemini API Key Configuration Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-md w-full rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
            <div className="flex items-center gap-2.5 mb-3 text-cyan-400">
              <Key className="h-5 w-5" />
              <h4 className="text-base font-bold text-white">Google Gemini API Configuration</h4>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Connect your free Google Gemini API key to unlock unlimited live generative engineering reasoning across custom circuits, schematics, and datasheets.
            </p>

            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Gemini API Key:
              </label>
              <input
                type="password"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1 mb-5">
              <div className="font-semibold text-slate-200">How to get a free API key:</div>
              <div>1. Visit Google AI Studio at <span className="text-cyan-400 font-mono">aistudio.google.com</span></div>
              <div>2. Click &quot;Get API key&quot; and create a free project key</div>
              <div>3. Paste it here. Keys are stored locally in your browser and never sent to third parties.</div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveApiKey}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs transition-all shadow-md shadow-cyan-500/20"
              >
                Save & Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
