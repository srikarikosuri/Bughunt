import React, { useState } from 'react';
import { CheckCircle2, XCircle, Clock, AlertTriangle, Terminal } from 'lucide-react';
import { TestResultItem } from '../types';

interface TestResultViewerProps {
  status?: 'idle' | 'running' | 'submitting' | 'passed' | 'failed' | 'error';
  runs?: TestResultItem[];
  xpEarned?: number;
  alreadySolved?: boolean;
  activeTab?: 'tests' | 'console';
  consoleOutput?: string;
  errorMessage?: string;
}

export const TestResultViewer: React.FC<TestResultViewerProps> = ({
  status = 'idle',
  runs = [],
  xpEarned = 0,
  alreadySolved = false,
  consoleOutput = '',
  errorMessage = '',
}) => {
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const [viewTab, setViewTab] = useState<'cases' | 'console'>('cases');

  if (status === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800/80">
        <Terminal className="w-8 h-8 text-slate-600 mb-2" />
        <p className="text-sm font-medium">Ready to run</p>
        <p className="text-xs text-slate-500 mt-1">
          Click <span className="text-slate-300 font-semibold">"Run Code"</span> to test visible samples or <span className="text-cyan-400 font-semibold">"Submit Solution"</span> to verify all cases.
        </p>
      </div>
    );
  }

  if (status === 'running' || status === 'submitting') {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center bg-slate-900/40 rounded-xl border border-slate-800">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-medium text-slate-300">
          {status === 'running' ? 'Running code in isolated sandbox...' : 'Validating all test cases...'}
        </p>
        <p className="text-xs text-slate-500 mt-1">Executing securely within runtime resource boundaries</p>
      </div>
    );
  }

  const passedCount = runs.filter((r) => r.passed).length;
  const totalCount = runs.length;
  const isAllPassed = passedCount === totalCount && totalCount > 0;
  const currentCase = runs[selectedCaseIdx] || runs[0];

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0a0e17] overflow-hidden shadow-lg">
      {/* Result Status Header */}
      <div
        className={`px-4 py-3 flex items-center justify-between border-b ${
          isAllPassed
            ? 'bg-emerald-950/40 border-emerald-900/60'
            : 'bg-rose-950/40 border-rose-900/60'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {isAllPassed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-400" />
          )}
          <div>
            <span className={`text-sm font-bold ${isAllPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isAllPassed ? 'All Test Cases Passed!' : 'Some Test Cases Failed'}
            </span>
            <span className="text-xs text-slate-400 ml-2">
              ({passedCount}/{totalCount} passed)
            </span>
          </div>
        </div>

        {/* Gamification Callout */}
        {isAllPassed && (
          <div className="flex items-center gap-2">
            {xpEarned > 0 ? (
              <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/60 border border-amber-600/40 px-2 py-0.5 rounded">
                +{xpEarned} XP Awarded!
              </span>
            ) : alreadySolved ? (
              <span className="text-xs text-slate-400">
                (Already solved · +0 XP)
              </span>
            ) : null}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {runs.map((r, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedCaseIdx(idx);
                setViewTab('cases');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                viewTab === 'cases' && selectedCaseIdx === idx
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {r.passed ? (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
              )}
              <span>Case {r.caseNumber}</span>
              {r.isHidden && <span className="text-[10px] text-slate-500 font-mono">(hidden)</span>}
            </button>
          ))}
        </div>

        <button
          onClick={() => setViewTab('console')}
          className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
            viewTab === 'console'
              ? 'bg-slate-800 text-cyan-300 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Raw Logs
        </button>
      </div>

      {/* Body View */}
      <div className="p-4 text-xs font-mono">
        {viewTab === 'cases' && currentCase ? (
          <div className="space-y-3">
            {/* Input */}
            <div>
              <div className="text-[11px] font-sans font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Input
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 overflow-x-auto whitespace-pre-wrap">
                {currentCase.input || '<empty>'}
              </div>
            </div>

            {/* Expected vs Actual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="text-[11px] font-sans font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Expected Output
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                  {currentCase.expected}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-sans font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Actual Output
                </div>
                <div
                  className={`p-2.5 rounded-lg bg-slate-950 border overflow-x-auto whitespace-pre-wrap ${
                    currentCase.passed
                      ? 'border-emerald-900/50 text-emerald-300'
                      : 'border-rose-900/50 text-rose-300'
                  }`}
                >
                  {currentCase.actual || '<no output>'}
                </div>
              </div>
            </div>

            {/* Error or Stderr if any */}
            {currentCase.stderr && (
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-sans font-semibold text-rose-400 uppercase tracking-wider mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Stderr / Diagnostic Trace</span>
                </div>
                <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-900/40 text-rose-300 overflow-x-auto whitespace-pre-wrap">
                  {currentCase.stderr}
                </div>
              </div>
            )}

            {/* Execution stats */}
            <div className="flex items-center gap-3 text-slate-500 text-[11px] pt-1 border-t border-slate-900">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Execution time: {currentCase.executionTimeMs}ms</span>
              </span>
              <span>·</span>
              <span>Status: {currentCase.passed ? 'PASSED' : 'FAILED'}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-[11px] font-sans font-semibold text-slate-400 uppercase tracking-wider">
              Console Standard Output
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 min-h-[120px] max-h-[240px] overflow-y-auto whitespace-pre-wrap">
              {consoleOutput || errorMessage || 'No additional console messages logged.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
