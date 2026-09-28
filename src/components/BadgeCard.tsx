import React from 'react';
import {
  Bug,
  Terminal,
  Code2,
  Cpu,
  Coffee,
  Flame,
  Trophy,
  Zap,
  Lock,
  LucideIcon,
} from 'lucide-react';
import { Badge } from '../types';

interface BadgeCardProps {
  badge: Badge;
  isUnlocked?: boolean;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Bug,
  Terminal,
  Code2,
  Cpu,
  Coffee,
  Flame,
  Trophy,
  Zap,
};

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge, isUnlocked = false }) => {
  const IconComponent = ICON_MAP[badge.icon] || Trophy;

  return (
    <div
      className={`relative p-4 rounded-xl border transition-all ${
        isUnlocked
          ? 'bg-slate-900/80 border-purple-500/30 shadow-lg shadow-purple-950/20 hover:border-purple-500/60'
          : 'bg-slate-900/30 border-slate-800/60 opacity-60'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={`flex items-center justify-center w-11 h-11 rounded-xl border ${
            isUnlocked
              ? 'bg-gradient-to-br from-purple-900/50 to-cyan-900/30 border-purple-500/50 text-cyan-300'
              : 'bg-slate-800/60 border-slate-700/40 text-slate-500'
          }`}
        >
          {isUnlocked ? (
            <IconComponent className="w-5 h-5 text-purple-300" />
          ) : (
            <Lock className="w-5 h-5" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-1">
            <h4 className="text-sm font-semibold text-white truncate">{badge.name}</h4>
            {badge.xp_bonus > 0 && (
              <span className="text-[10px] font-mono text-amber-400 font-medium shrink-0">
                +{badge.xp_bonus} XP
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
            {badge.description}
          </p>

          {isUnlocked && badge.unlocked_at && (
            <div className="text-[10px] text-slate-500 mt-2 font-mono">
              Unlocked {new Date(badge.unlocked_at).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
