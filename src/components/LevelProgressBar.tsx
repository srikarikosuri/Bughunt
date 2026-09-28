import React from 'react';
import { Award, Zap } from 'lucide-react';

interface LevelProgressBarProps {
  xp: number;
  level: number;
}

export const LevelProgressBar: React.FC<LevelProgressBarProps> = ({ xp, level }) => {
  // Current level threshold: 25 * (level - 1)^2
  // Next level threshold: 25 * level^2
  const currentThreshold = 25 * Math.pow(level - 1, 2);
  const nextThreshold = 25 * Math.pow(level, 2);
  const xpInCurrentLevel = Math.max(0, xp - currentThreshold);
  const xpNeededForNext = Math.max(1, nextThreshold - currentThreshold);
  const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNext) * 100));

  const getRankTitle = (lvl: number) => {
    if (lvl === 1) return 'Novice Bugcatcher';
    if (lvl === 2) return 'Syntax Detective';
    if (lvl === 3) return 'Logic Sorter';
    if (lvl === 4) return 'Patch Artisan';
    if (lvl === 5) return 'Kernel Surgeon';
    return 'Debugging Grandmaster';
  };

  return (
    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-950/60 border border-purple-500/40 text-purple-400">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>Level {level}</span>
              <span className="text-xs font-normal text-purple-400">· {getRankTitle(level)}</span>
            </div>
            <div className="text-xs text-slate-400">
              {xp} Total XP
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs font-mono font-medium text-cyan-400">
            {nextThreshold - xp > 0 ? `${nextThreshold - xp} XP to Level ${level + 1}` : 'Max level!'}
          </div>
          <div className="text-[11px] text-slate-500">
            {progressPercent}% Complete
          </div>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
        <div
          className="h-full bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-700 shadow-sm shadow-cyan-500/50"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </div>
  );
};
