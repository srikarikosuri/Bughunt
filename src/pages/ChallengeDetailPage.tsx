import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Play,
  Send,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Layers,
  Terminal,
  FileCode,
  Eye,
  ShieldCheck,
  Bot,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ChallengeDetail, TestResultItem, SubmitResponse, Badge } from '../types';
import { MonacoEditorWrapper } from '../components/MonacoEditorWrapper';
import { TestResultViewer } from '../components/TestResultViewer';
import { fireSuccessConfetti, fireLevelUpConfetti } from '../components/ConfettiEffect';

interface ChallengeDetailPageProps {
  challengeId: string;
  onBack: () => void;
  onNavigateToAuth: () => void;
  onOpenChatWithContext?: (context: { title: string; language: string; code: string; latestError?: string }) => void;
}

export const ChallengeDetailPage: React.FC<ChallengeDetailPageProps> = ({
  challengeId,
  onBack,
  onNavigateToAuth,
  onOpenChatWithContext,
}) => {
  const { user, refreshUser } = useAuth();
  const [challenge, setChallenge] = useState<ChallengeDetail | null>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Execution states
  const [executing, setExecuting] = useState<'idle' | 'running' | 'submitting'>('idle');
  const [testRuns, setTestRuns] = useState<TestResultItem[]>([]);
  const [resultStatus, setResultStatus] = useState<'idle' | 'running' | 'submitting' | 'passed' | 'failed' | 'error'>('idle');
  const [lastXpEarned, setLastXpEarned] = useState(0);
  const [alreadySolved, setAlreadySolved] = useState(false);
  const [rawConsoleOutput, setRawConsoleOutput] = useState('');
  const [activeConsoleTab, setActiveConsoleTab] = useState<'tests' | 'console'>('tests');

  // Progressive hints
  const [revealedHints, setRevealedHints] = useState<number>(0);

  // Original broken code modal/drawer
  const [showOriginalModal, setShowOriginalModal] = useState(false);

  // Success celebration modal
  const [newBadges, setNewBadges] = useState<Badge[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    loadChallenge();
  }, [challengeId]);

  const loadChallenge = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getChallenge(challengeId);
      setChallenge(data);
      setCode(data.broken_code);
      setAlreadySolved(data.is_solved);
      setRevealedHints(0);
      setResultStatus('idle');
      setTestRuns([]);
    } catch (err: any) {
      setError(err.message || 'Failed to load challenge');
    } finally {
      setLoading(false);
    }
  };

  const handleResetCode = () => {
    if (!challenge) return;
    if (window.confirm('Reset code back to the original broken code? Any unsaved edits will be discarded.')) {
      setCode(challenge.broken_code);
      setResultStatus('idle');
      setTestRuns([]);
    }
  };

  const handleRevealNextHint = () => {
    if (!challenge || revealedHints >= challenge.hints.length) return;
    setRevealedHints((prev) => prev + 1);
  };

  // Run Code against visible test cases
  const handleRunCode = async () => {
    if (!challenge) return;
    try {
      setExecuting('running');
      setResultStatus('running');
      setActiveConsoleTab('tests');

      const response = await api.runCode({
        language: challenge.language,
        code,
        challenge_id: challenge.id,
      });

      if (response.type === 'test_cases') {
        const runs: TestResultItem[] = response.runs.map((r: any) => ({
          caseNumber: r.caseNumber,
          input: r.input,
          expected: r.expected,
          actual: r.actual,
          passed: r.passed,
          executionTimeMs: r.executionTimeMs,
          stderr: r.stderr,
          isHidden: false,
        }));
        setTestRuns(runs);
        setResultStatus(response.allPassed ? 'passed' : 'failed');
        setRawConsoleOutput(runs.map((r) => r.actual).join('\n'));
      } else if (response.type === 'simple' || response.type === 'custom') {
        setRawConsoleOutput(response.result.stdout || response.result.stderr);
        setTestRuns([]);
        setResultStatus(response.result.isError ? 'error' : 'passed');
      }
    } catch (err: any) {
      setResultStatus('error');
      setRawConsoleOutput(err.message || 'Execution error');
    } finally {
      setExecuting('idle');
    }
  };

  // Submit Solution against all test cases including hidden ones
  const handleSubmitSolution = async () => {
    if (!challenge) return;

    if (!user) {
      onNavigateToAuth();
      return;
    }

    try {
      setExecuting('submitting');
      setResultStatus('submitting');

      const res = await api.submitSolution(challenge.id, {
        code,
        language: challenge.language,
      });

      setTestRuns(res.test_results);
      setLastXpEarned(res.xp_earned);
      setAlreadySolved(res.already_solved);
      setResultStatus(res.status === 'passed' ? 'passed' : 'failed');

      if (res.status === 'passed') {
        fireSuccessConfetti();
        if (res.newly_unlocked_badges && res.newly_unlocked_badges.length > 0) {
          setNewBadges(res.newly_unlocked_badges);
          fireLevelUpConfetti();
        }
        setShowSuccessModal(true);
        await refreshUser();
      }
    } catch (err: any) {
      setResultStatus('error');
      setRawConsoleOutput(err.message || 'Submission error');
    } finally {
      setExecuting('idle');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-medium">Loading challenge environment...</p>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Challenge Not Found</h2>
        <p className="text-sm text-slate-400">{error || 'Unable to retrieve this challenge details.'}</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Arena</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Back to Arena"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{challenge.title}</h1>
              {challenge.is_solved && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                  <CheckCircle2 className="w-3 h-3" />
                  Solved
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
              <span className="capitalize text-purple-300 font-medium">{challenge.language}</span>
              <span>·</span>
              <span className="capitalize">{challenge.difficulty}</span>
              <span>·</span>
              <span className="capitalize">{challenge.category} Bug</span>
              <span>·</span>
              <span className="text-amber-400 font-semibold">+{challenge.xp_reward} XP</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          {onOpenChatWithContext && (
            <button
              onClick={() => {
                onOpenChatWithContext({
                  title: challenge.title,
                  language: challenge.language,
                  code,
                  latestError: rawConsoleOutput || undefined,
                });
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-purple-950/90 to-cyan-950/90 text-cyan-300 border border-cyan-500/50 hover:border-cyan-400 hover:text-white transition-all shadow-sm shadow-cyan-950/40 cursor-pointer"
              title="Ask connected n8n AI agent about this challenge"
            >
              <Bot className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Ask AI Copilot</span>
            </button>
          )}

          <button
            onClick={handleResetCode}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"
            title="Reset code to broken starter code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Code</span>
          </button>

          <button
            onClick={() => setShowOriginalModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"
            title="View original broken starter code"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Inspect Bug</span>
          </button>

          <button
            onClick={handleRunCode}
            disabled={executing !== 'idle'}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-slate-200" />
            <span>{executing === 'running' ? 'Running...' : 'Run Code'}</span>
          </button>

          <button
            onClick={handleSubmitSolution}
            disabled={executing !== 'idle'}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-95 shadow-md shadow-purple-600/30 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{executing === 'submitting' ? 'Evaluating...' : 'Submit Solution'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Problem & Hints, Right Monaco Editor & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Problem Statement & Progressive Hints */}
        <div className="lg:col-span-5 space-y-6">
          {/* Problem Statement Card */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              <FileCode className="w-4 h-4" />
              <span>Problem Brief</span>
            </div>

            <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
              {challenge.description}
            </div>

            {/* Public Test Samples */}
            {challenge.sample_test_cases && challenge.sample_test_cases.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Sample Test Cases
                </div>
                <div className="space-y-2">
                  {challenge.sample_test_cases.map((sample, idx) => (
                    <div key={sample.id || idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
                      <div className="text-slate-500 text-[11px] mb-1">Sample {idx + 1}</div>
                      <div className="flex flex-col gap-1">
                        <div>
                          <span className="text-slate-400">Input:</span>{' '}
                          <span className="text-slate-200">{sample.input || '<none>'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Expected:</span>{' '}
                          <span className="text-emerald-400">{sample.expected_output}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Progressive Hints Section */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                <Lightbulb className="w-4 h-4" />
                <span>Debugging Hints ({revealedHints}/{challenge.hints.length})</span>
              </div>

              {revealedHints < challenge.hints.length && (
                <button
                  onClick={handleRevealNextHint}
                  className="text-xs font-medium text-amber-300 hover:text-amber-200 hover:underline flex items-center gap-1"
                >
                  <span>Reveal Hint {revealedHints + 1}</span>
                </button>
              )}
            </div>

            {revealedHints === 0 ? (
              <p className="text-xs text-slate-400 italic">
                Hints are hidden by default to keep the challenge rewarding. If you're stuck, reveal them step by step.
              </p>
            ) : (
              <div className="space-y-2.5">
                {challenge.hints.slice(0, revealedHints).map((hint, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs text-amber-200 leading-relaxed font-sans"
                  >
                    <span className="font-semibold text-amber-400 mr-1.5 font-mono">Hint {idx + 1}:</span>
                    {hint}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sandbox Security Guarantee */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-900 flex items-start gap-3 text-xs text-slate-400">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-200 font-medium">Safe Execution Sandbox:</span>
              <p className="mt-0.5 leading-relaxed text-[11px]">
                Submissions run in isolated virtual runtimes with strict 2.5s execution limits, memory caps, and syscall interception.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Monaco Editor + Live Test Results */}
        <div className="lg:col-span-7 space-y-6">
          {/* Monaco Code Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="font-mono text-purple-300">solution.{challenge.language === 'python' ? 'py' : challenge.language === 'javascript' ? 'js' : challenge.language === 'c' ? 'c' : 'java'}</span>
              <span className="text-[11px] text-slate-500">Auto-saves in session</span>
            </div>

            <MonacoEditorWrapper
              language={challenge.language}
              code={code}
              onChange={setCode}
              height="440px"
            />
          </div>

          {/* Sandbox Test Result Output */}
          <TestResultViewer
            status={resultStatus}
            runs={testRuns}
            xpEarned={lastXpEarned}
            alreadySolved={alreadySolved}
            consoleOutput={rawConsoleOutput}
          />
        </div>
      </div>

      {/* Inspect Original Broken Code Modal */}
      {showOriginalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">Original Broken Code</h3>
              </div>
              <button
                onClick={() => setShowOriginalModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded-lg"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Here is the starter code that contains the bug before any edits were made:
            </p>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-rose-300 overflow-x-auto max-h-96">
              {challenge.broken_code}
            </pre>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowOriginalModal(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-emerald-500/40 shadow-2xl p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-900/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-white">Bug Annihilated!</h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Your patch passed all public and hidden test cases with flying colors.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 inline-block font-mono text-sm font-bold text-amber-300">
              {lastXpEarned > 0 ? `+${lastXpEarned} XP Earned` : 'Challenge Already Completed (0 XP)'}
            </div>

            {/* Unlocked Badges */}
            {newBadges.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">
                  New Badge Unlocked!
                </span>
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800 text-left flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-cyan-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">{newBadges[0].name}</div>
                    <div className="text-[11px] text-slate-400">{newBadges[0].description}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-3 flex gap-3 justify-center">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-xl"
              >
                Review Code
              </button>

              <button
                onClick={onBack}
                className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl hover:opacity-90 shadow-md shadow-purple-900/40"
              >
                Next Challenge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
