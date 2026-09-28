import React, { useState, useEffect } from 'react';
import {
  Flame,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Layers,
  Sparkles,
  Code2,
  Calendar,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { UserProgressData } from '../types';
import { LevelProgressBar } from '../components/LevelProgressBar';
import { BadgeCard } from '../components/BadgeCard';

interface DashboardPageProps {
  onNavigate: (tab: string, param?: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [data, setData] = useState<UserProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      setLoading(true);
      setError('');
      const progress = await api.getUserProgress();
      setData(progress);
    } catch (err: any) {
      setError(err.message || 'Failed to load user dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-medium">Gathering hunter metrics...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center text-slate-400 space-y-4">
        <p className="text-rose-400">{error || 'Please sign in to view dashboard'}</p>
        <button
          onClick={() => onNavigate('auth', 'login')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-semibold"
        >
          Sign In
        </button>
      </div>
    );
  }

  // Activity chart data
  const activityData = data.daily_activity.map((d) => ({
    date: d.date.slice(5), // MM-DD
    xp: d.xp_earned,
    solved: d.challenges_solved,
  }));

  // If activity is sparse, pad with recent dates for clean visualization
  if (activityData.length < 5) {
    const today = new Date();
    const padded = [];
    for (let i = 4; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      const str = day.toISOString().slice(5, 10);
      const match = activityData.find((a) => a.date === str);
      padded.push(match || { date: str, xp: i === 0 ? 10 : 0, solved: i === 0 ? 1 : 0 });
    }
    activityData.splice(0, activityData.length, ...padded);
  }

  // Language mastery data
  const langBarData = [
    { name: 'Python', solved: data.language_stats.python.solved, total: data.language_stats.python.total, color: '#38bdf8' },
    { name: 'JavaScript', solved: data.language_stats.javascript.solved, total: data.language_stats.javascript.total, color: '#f59e0b' },
    { name: 'Java', solved: data.language_stats.java.solved, total: data.language_stats.java.total, color: '#ec4899' },
    { name: 'C', solved: data.language_stats.c.solved, total: data.language_stats.c.total, color: '#a855f7' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username}`}
            alt={user?.username}
            className="w-16 h-16 rounded-2xl bg-slate-800 object-cover border border-purple-500/40 p-0.5"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">
                Welcome back, {user?.username}!
              </h1>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-purple-950/80 border border-purple-800 text-purple-300">
                Lvl {user?.level}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Ready to hunt? Keep your {user?.streak}-day streak alive by solving today's featured bug.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('arena')}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl hover:opacity-90 transition-all shadow-md shadow-purple-600/30 cursor-pointer"
          >
            <span>Jump to Arena</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Level Progress Bar Card */}
      <LevelProgressBar xp={user?.xp || 0} level={user?.level || 1} />

      {/* 4 Stat Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total XP */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-medium">Total XP</div>
            <div className="text-xl font-bold text-white font-mono">{user?.xp}</div>
          </div>
        </div>

        {/* Current Level */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-medium">Rank Level</div>
            <div className="text-xl font-bold text-white font-mono">Level {user?.level}</div>
          </div>
        </div>

        {/* Daily Streak */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-orange-950/60 border border-orange-500/30 text-orange-400">
            <Flame className="w-5 h-5 fill-orange-400" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-medium">Day Streak</div>
            <div className="text-xl font-bold text-white font-mono">{user?.streak} Days</div>
          </div>
        </div>

        {/* Challenges Solved */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-medium">Bugs Squashed</div>
            <div className="text-xl font-bold text-white font-mono">
              {data.solved_count} / {data.total_challenges}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row: XP Over Time + Language Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* XP Activity Line/Area Chart */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Debugging Activity & XP</span>
              </h3>
              <p className="text-xs text-slate-400">Recent daily performance trend</p>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#070b14',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: '#38bdf8' }}
                />
                <Area
                  type="monotone"
                  dataKey="xp"
                  name="XP Earned"
                  stroke="#a855f7"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#xpGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Language Mastery Bar Chart */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-purple-400" />
                <span>Language Mastery</span>
              </h3>
              <p className="text-xs text-slate-400">Bugs solved across runtimes</p>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={langBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#070b14',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="solved" name="Solved Challenges" radius={[6, 6, 0, 0]}>
                  {langBarData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recommended Next Challenges & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recommended Challenges */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Recommended for You</h3>
            <button
              onClick={() => onNavigate('arena')}
              className="text-xs text-cyan-400 hover:underline font-medium"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {data.recommended_challenges.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                Incredible! You have solved all available challenges. Check back soon for new bug packs!
              </p>
            ) : (
              data.recommended_challenges.map((rc) => (
                <div
                  key={rc.id}
                  onClick={() => onNavigate('challenge', rc.id)}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-purple-500/40 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-white">{rc.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                      <span className="capitalize text-purple-300">{rc.language}</span>
                      <span>·</span>
                      <span className="capitalize">{rc.difficulty}</span>
                      <span>·</span>
                      <span className="text-amber-400 font-medium">+{rc.xp_reward} XP</span>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Recent Submissions</h3>

          <div className="space-y-2.5">
            {data.recent_submissions.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No submissions yet. Try solving your first bug!</p>
            ) : (
              data.recent_submissions.slice(0, 5).map((sub: any) => (
                <div
                  key={sub.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    {sub.status === 'passed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <div>
                      <span className="font-mono text-slate-200 capitalize font-medium">{sub.language}</span>
                      <span className="text-slate-500 ml-2">
                        {sub.passed_tests}/{sub.total_tests} tests
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {sub.xp_earned > 0 && (
                      <span className="text-amber-400 font-mono font-bold">+{sub.xp_earned} XP</span>
                    )}
                    <span className="text-[11px] text-slate-500">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Badges Showcase Section */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Your Achievement Badges</h3>
            <p className="text-xs text-slate-400">Unlock trophies by completing milestones</p>
          </div>
          <button
            onClick={() => onNavigate('profile')}
            className="text-xs text-cyan-400 hover:underline font-medium"
          >
            Show All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.badges.map((b) => (
            <BadgeCard key={b.id} badge={b} isUnlocked={true} />
          ))}
        </div>
      </div>
    </div>
  );
};
