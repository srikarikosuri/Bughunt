import React, { useState } from 'react';
import { Play, Check, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';

export const BugSpotterPreview: React.FC = () => {
  const [isFixed, setIsFixed] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [runSuccess, setRunSuccess] = useState<boolean | null>(null);

  const handleToggle = () => {
    setIsFixed(!isFixed);
    setRunSuccess(null);
  };

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setRunSuccess(isFixed);
    }, 450);
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0a0e17] shadow-2xl shadow-purple-900/10">
      {/* Editor Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          </div>
          <span className="text-xs font-mono text-slate-400 ml-2">palindrome_check.py</span>
          <span className="text-[10px] font-mono text-purple-400 bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-800/40">
            Python 3.12
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggle}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors border border-slate-700/60"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isFixed ? 'Show Broken Bug' : 'Show Fixed Code'}</span>
          </button>

          <button
            onClick={handleRun}
            disabled={isRunning}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg text-white transition-all shadow-sm ${
              isRunning
                ? 'bg-slate-700 opacity-60'
                : 'bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isRunning ? 'Running...' : 'Run'}</span>
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div className="p-4 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed overflow-x-auto bg-[#070b14]">
        <div className="space-y-1">
          <div className="flex items-start">
            <span className="w-8 select-none text-slate-600 text-right pr-4">1</span>
            <span className="text-purple-400">def</span>&nbsp;
            <span className="text-blue-300">is_palindrome</span>(text):
          </div>

          <div className="flex items-start">
            <span className="w-8 select-none text-slate-600 text-right pr-4">2</span>
            <span className="pl-4 text-slate-400"># Normalize text case</span>
          </div>

          <div className="flex items-start">
            <span className="w-8 select-none text-slate-600 text-right pr-4">3</span>
            <span className="pl-4">clean = text.lower()</span>
          </div>

          {/* Highlighted Bug Line */}
          <div
            className={`flex items-start transition-colors duration-300 rounded ${
              isFixed
                ? 'bg-emerald-950/30 text-emerald-200'
                : 'bg-rose-950/40 text-rose-200 border-l-2 border-rose-500'
            }`}
          >
            <span
              className={`w-8 select-none text-right pr-4 ${
                isFixed ? 'text-emerald-500 font-bold' : 'text-rose-500 font-bold'
              }`}
            >
              4
            </span>
            <span className="pl-4">
              {isFixed ? (
                <>
                  <span className="text-purple-400">if</span> clean == clean[::-1]:
                  <span className="ml-3 text-[11px] text-emerald-400 font-sans font-medium">
                    ✓ Fixed: Correct slicing notation
                  </span>
                </>
              ) : (
                <>
                  <span className="text-purple-400">if</span> clean == clean[:-1]
                  <span className="ml-3 text-[11px] text-rose-400 font-sans font-medium animate-pulse">
                    ⚠ BUG: Missing colon ':' and off-by-one slice!
                  </span>
                </>
              )}
            </span>
          </div>

          <div className="flex items-start">
            <span className="w-8 select-none text-slate-600 text-right pr-4">5</span>
            <span className="pl-8 text-purple-400">return</span>&nbsp;
            <span className="text-amber-400">True</span>
          </div>

          <div className="flex items-start">
            <span className="w-8 select-none text-slate-600 text-right pr-4">6</span>
            <span className="pl-4 text-purple-400">return</span>&nbsp;
            <span className="text-amber-400">False</span>
          </div>
        </div>
      </div>

      {/* Mini Output Console */}
      <div className="border-t border-slate-800 bg-slate-950 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              runSuccess === null
                ? 'bg-slate-600'
                : runSuccess
                ? 'bg-emerald-400 shadow-sm shadow-emerald-400'
                : 'bg-rose-400 shadow-sm shadow-rose-400'
            }`}
          ></div>
          <span className="text-xs font-mono text-slate-400">
            {runSuccess === null
              ? 'Status: Ready · Input: "racecar"'
              : runSuccess
              ? 'Output: True · All 4 test cases passed (0.012s)'
              : 'SyntaxError: invalid syntax on line 4 (expected \':\')'}
          </span>
        </div>

        {runSuccess && (
          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>+10 XP</span>
          </div>
        )}
      </div>
    </div>
  );
};
