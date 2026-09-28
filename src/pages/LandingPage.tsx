import React from 'react';
import {
  Code2,
  Bug,
  Terminal,
  Zap,
  CheckCircle,
  Flame,
  Trophy,
  ArrowRight,
  Shield,
  Layers,
  Cpu,
  Coffee,
  Sparkles,
  Users,
  Bot,
} from 'lucide-react';
import { BugSpotterPreview } from '../components/BugSpotterPreview';

interface LandingPageProps {
  onNavigate: (tab: string, param?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 blur-[130px] pointer-events-none rounded-full"></div>
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-cyan-600/15 blur-[120px] pointer-events-none rounded-full"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-purple-500/30 text-purple-300 text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Next-Gen Gamified Debugging Arena</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Find Bugs. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400">
                  Fix Code.
                </span>{' '}
                <br />
                Level Up.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Reading broken code is 10x harder than writing it. BugHunt trains you to diagnose real-world syntax, logic, runtime, and algorithmic flaws in an isolated sandbox.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => onNavigate('arena')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl hover:opacity-95 transition-all shadow-lg shadow-purple-600/25 cursor-pointer"
                >
                  <span>Start Hunting Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('copilot')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-cyan-300 hover:text-white bg-gradient-to-r from-purple-950/60 to-cyan-950/60 hover:bg-slate-800 rounded-xl border border-cyan-500/40 transition-colors cursor-pointer"
                >
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <span>Chat with AI Copilot</span>
                </button>

                <button
                  onClick={() => onNavigate('auth', 'register')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors cursor-pointer"
                >
                  <span>Register</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Python · JS · Java · C</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  <span>Monaco Editor</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400" />
                  <span>Zero Server Farm Exploits</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Preview */}
            <div className="lg:col-span-6">
              <BugSpotterPreview />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
            Game Loop
          </span>
          <h2 className="text-3xl font-bold text-white mt-2">How BugHunt Works</h2>
          <p className="text-slate-400 text-sm mt-2">
            Four streamlined steps from broken stack traces to verified patches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-400 flex items-center justify-center font-mono font-bold mb-4">
              01
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Pick a Challenge</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Filter by language (Python, JavaScript, Java, C) and target bug category from beginner syntax traps to tricky algorithmic edge cases.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-mono font-bold mb-4">
              02
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Spot the Defect</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Read the authentic broken starter code in Monaco Editor. Analyze stack traces, runtime logs, or inspect progressive hints if stuck.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-mono font-bold mb-4">
              03
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Sandbox Test</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Click Run Code to execute in an isolated sandbox. Check standard output against visible samples and inspect error diffs.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center font-mono font-bold mb-4">
              04
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Earn XP & Badges</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Submit your patch to execute against hidden test cases. Earn 10–50 XP once per challenge, extend your streak, and unlock achievements.
            </p>
          </div>
        </div>
      </section>

      {/* Challenge Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 md:p-12 rounded-3xl bg-slate-900/40 border border-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono text-purple-400 font-semibold uppercase tracking-wider">
              Debugging Taxonomy
            </span>
            <h2 className="text-3xl font-bold text-white mt-2">Four Essential Bug Disciplines</h2>
            <p className="text-slate-400 text-sm mt-2">
              Master the exact problem categories that cost engineering teams thousands of hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl bg-[#0a0e17] border border-slate-800">
              <div className="p-2.5 rounded-lg bg-pink-950/40 border border-pink-500/30 text-pink-400 w-fit mb-3">
                <Bug className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">Syntax Errors</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mismatched delimiters, unclosed template strings, missing colons, and illegal type casts.
              </p>
              <div className="mt-3 text-[11px] font-mono text-purple-400">Easy · 10 XP</div>
            </div>

            <div className="p-5 rounded-xl bg-[#0a0e17] border border-slate-800">
              <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 w-fit mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">Logical Bugs</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Off-by-one loop ranges, pointer aliasing, inverted conditionals, and variable hoisting traps.
              </p>
              <div className="mt-3 text-[11px] font-mono text-cyan-400">Easy/Med · 10-25 XP</div>
            </div>

            <div className="p-5 rounded-xl bg-[#0a0e17] border border-slate-800">
              <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-400 w-fit mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">Runtime Crashes</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Null pointer references, division by zero, stack overflow recursion, and array out of bounds.
              </p>
              <div className="mt-3 text-[11px] font-mono text-amber-400">Medium · 25 XP</div>
            </div>

            <div className="p-5 rounded-xl bg-[#0a0e17] border border-slate-800">
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 w-fit mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">Algorithmic Bugs</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Binary search infinite loops, stack underflows, merge pointer corruption, and duplicate collisions.
              </p>
              <div className="mt-3 text-[11px] font-mono text-emerald-400">Hard · 50 XP</div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-mono">
              1,420+
            </div>
            <div className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">
              Bugs Squashed
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
              16+
            </div>
            <div className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">
              Original Arenas
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">
              88.4%
            </div>
            <div className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">
              Sandbox Reliability
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono">
              45,000+
            </div>
            <div className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">
              XP Distributed
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
            Community Love
          </span>
          <h2 className="text-3xl font-bold text-white mt-2">Loved by CS Students & Engineers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "Most platforms just ask you to write LeetCode problems from scratch. BugHunt taught me how to read someone else's cryptic code and spot off-by-one errors in minutes."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600/40 text-purple-300 flex items-center justify-center font-bold text-xs">
                JD
              </div>
              <div>
                <div className="text-xs font-semibold text-white">James Dupont</div>
                <div className="text-[11px] text-slate-500">CS Senior, UC Berkeley</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "The Monaco editor with inline diagnostics and the no-farming XP rules make this feel like a true competitive arena. My team does daily debugging standups here!"
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-600/40 text-cyan-300 flex items-center justify-center font-bold text-xs">
                MR
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Maya Rao</div>
                <div className="text-[11px] text-slate-500">Junior Frontend Dev</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "C pointer arithmetic and Java string reference bugs were my absolute nightmare during technical interviews. After 10 BugHunt challenges, they became second nature."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-600/40 text-amber-300 flex items-center justify-center font-bold text-xs">
                TL
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Thomas Lin</div>
                <div className="text-[11px] text-slate-500">Systems Software Intern</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-cyan-950/80 border border-purple-500/40 p-8 sm:p-12 text-center">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Ready to squash your first bug?
            </h2>
            <p className="text-slate-300 text-sm">
              Jump into the arena right away. Choose a challenge, isolate the defect, and climb the leaderboard.
            </p>
            <div className="pt-2 flex justify-center">
              <button
                onClick={() => onNavigate('arena')}
                className="flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl hover:opacity-90 shadow-xl shadow-purple-900/40 transition-all cursor-pointer"
              >
                <span>Enter Debugging Arena</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
