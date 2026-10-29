import React, { useState } from 'react';
import { Play, RotateCcw, Copy, Check, Terminal, Code2 } from 'lucide-react';

interface CodeEditorProps {
  initialCode: string;
  onRun: (code: string) => void;
  isRunning?: boolean;
  language?: string;
  onReset?: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode,
  onRun,
  isRunning = false,
  language = 'javascript',
  onReset
}) => {
  const [code, setCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);

  // Sync if initialCode changes externally (e.g. switching challenge)
  React.useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle tab indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        const textarea = document.getElementById('code-input-textarea') as HTMLTextAreaElement;
        if (textarea) {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const lines = code.split('\n');

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0B101E] overflow-hidden shadow-xl flex flex-col h-full">
      {/* Editor Top Bar */}
      <div className="bg-[#080D1A] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-mono font-medium text-slate-400 ml-2 flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            firmware_solution.js
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {onReset && (
            <button
              onClick={() => {
                setCode(initialCode);
                onReset();
              }}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
              title="Reset Starter Template"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <button
            onClick={() => onRun(code)}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Evaluating...' : 'Run Test Cases'}</span>
          </button>
        </div>
      </div>

      {/* Editor Area with Line Numbers */}
      <div className="flex-1 relative flex min-h-[280px] font-mono text-sm">
        {/* Line Numbers Column */}
        <div className="w-10 select-none py-3 bg-[#080D1A]/50 text-right pr-3 text-slate-600 font-mono text-xs border-r border-slate-800/60 leading-6">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Text Input Area */}
        <textarea
          id="code-input-textarea"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="flex-1 w-full p-3 bg-transparent text-cyan-100 font-mono text-xs md:text-sm leading-6 resize-none focus:outline-none focus:ring-0 selection:bg-cyan-500/20"
          placeholder="// Enter your firmware logic here..."
        />
      </div>

      {/* Editor Status Bar */}
      <div className="px-4 py-1.5 bg-[#080D1A] border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Sandbox Ready
          </span>
          <span>{lines.length} lines</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Spaces: 2</span>
          <span>UTF-8</span>
          <span className="text-cyan-400 font-semibold">{language.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};
