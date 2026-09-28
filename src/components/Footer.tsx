import React from 'react';
import { Bug, Terminal, Github, Heart, Shield } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#0a0e17] text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 p-0.5">
                <div className="w-full h-full bg-[#0a0e17] rounded-[6px] flex items-center justify-center">
                  <Bug className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Bug<span className="text-cyan-400">Hunt</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Find Bugs. Fix Code. Level Up. Interactive gamified programming and debugging education across Python, JavaScript, Java, and C in isolated sandbox environments.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            <div className="font-semibold text-slate-200 uppercase text-[11px] font-mono tracking-wider">
              Platform
            </div>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onNavigate('arena')} className="hover:text-cyan-400 transition-colors">
                  Debugging Arena
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('leaderboard')} className="hover:text-cyan-400 transition-colors">
                  Global Leaderboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-cyan-400 transition-colors">
                  Hunter Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('landing')} className="hover:text-cyan-400 transition-colors">
                  How It Works
                </button>
              </li>
            </ul>
          </div>

          {/* Languages Supported */}
          <div className="space-y-2">
            <div className="font-semibold text-slate-200 uppercase text-[11px] font-mono tracking-wider">
              Sandboxes
            </div>
            <ul className="space-y-1.5 font-mono text-[11px] text-slate-400">
              <li>Python 3.12 (CPython Subprocess)</li>
              <li>JavaScript (Isolated VM Context)</li>
              <li>Java (Object Reference Analyzer)</li>
              <li>C (Memory Safety Harness)</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} BugHunt Arena. Engineered for curious software problem-solvers.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400">
              <Shield className="w-3.5 h-3.5" />
              <span>Sandbox Isolation Active</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
