import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Flame, Award, Shield, CheckCircle2, Search } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LeaderboardEntry } from '../types';

export const LeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'all' | 'weekly' | 'monthly'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await api.getLeaderboard();
      setEntries(data);
    } catch (err) {
      console.error('Failed to load leaderboard', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = entries.filter((e) =>
    e.username.toLowerCase().includes(search.toLowerCase())
  );

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs border border-amber-500/40">
          <Trophy className="w-4 h-4 fill-amber-400" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-300/20 text-slate-200 font-bold text-xs border border-slate-300/40">
          <Medal className="w-4 h-4 fill-slate-300" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-700/20 text-amber-600 font-bold text-xs border border-amber-700/40">
          <Medal className="w-4 h-4 fill-amber-700" />
        </div>
      );
    }
    return (
      <span className="font-mono text-xs font-semibold text-slate-500 w-7 text-center">
        #{rank}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/40 border border-amber-500/40 text-amber-400 text-xs font-mono">
          <Trophy className="w-3.5 h-3.5" />
          <span>Hall of Fame</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Global Leaderboard</h1>
        <p className="text-xs text-slate-400">
          Top software exterminators ranked by total XP, problem solving accuracy, and unbroken streaks.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        {/* Timeframe segmented control */}
        <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs">
          <button
            onClick={() => setTimeframe('all')}
            className={`px-4 py-1.5 rounded-lg font-medium transition-colors ${
              timeframe === 'all'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All-Time
          </button>
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-4 py-1.5 rounded-lg font-medium transition-colors ${
              timeframe === 'weekly'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Weekly Sprint
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-4 py-1.5 rounded-lg font-medium transition-colors ${
              timeframe === 'monthly'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search hunter by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm font-medium">Loading rankings...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 w-16 text-center">Rank</th>
                  <th className="py-3 px-4">Hunter</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Streak</th>
                  <th className="py-3 px-4">Solved</th>
                  <th className="py-3 px-4">Badges</th>
                  <th className="py-3 px-4 text-right">Total XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((entry, idx) => {
                  const isCurrentUser = user && user.id === entry.id;
                  const rank = idx + 1;

                  return (
                    <tr
                      key={entry.id}
                      className={`transition-colors ${
                        isCurrentUser
                          ? 'bg-purple-950/30 hover:bg-purple-950/40 border-l-2 border-purple-500'
                          : 'hover:bg-slate-850/50'
                      }`}
                    >
                      <td className="py-3.5 px-4 flex justify-center items-center">
                        {getRankBadge(rank)}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={entry.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${entry.username}`}
                            alt={entry.username}
                            className="w-8 h-8 rounded-full bg-slate-800 object-cover"
                          />
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              <span>{entry.username}</span>
                              {isCurrentUser && (
                                <span className="text-[10px] font-mono text-purple-400 bg-purple-950 px-1.5 py-0.2 rounded border border-purple-800">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500 capitalize font-mono">
                              Prefers {entry.preferred_language}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-medium text-purple-300">
                        Lvl {entry.level}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-orange-400 font-semibold font-mono">
                          <Flame className="w-3.5 h-3.5 fill-orange-400" />
                          <span>{entry.streak}d</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300 font-mono">
                        {entry.challenges_solved} bugs
                      </td>

                      <td className="py-3.5 px-4 text-slate-300 font-mono">
                        {entry.badges_count}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-400 text-sm">
                        {entry.xp} XP
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
