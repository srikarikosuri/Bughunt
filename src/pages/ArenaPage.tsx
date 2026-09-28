import React, { useState, useEffect } from 'react';
import {
  Search,
  Code2,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  Filter,
  Flame,
  Terminal,
  Cpu,
  Layers,
  Bug,
} from 'lucide-react';
import { api } from '../services/api';
import { ChallengeSummary, Language, Difficulty, Category } from '../types';

interface ArenaPageProps {
  onSelectChallenge: (challengeId: string) => void;
}

export const ArenaPage: React.FC<ArenaPageProps> = ({ onSelectChallenge }) => {
  const [challenges, setChallenges] = useState<ChallengeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getChallenges();
      setChallenges(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load challenges');
    } finally {
      setLoading(false);
    }
  };

  // Filtered challenges
  const filtered = challenges.filter((c) => {
    if (selectedLanguage !== 'all' && c.language !== selectedLanguage) return false;
    if (selectedDifficulty !== 'all' && c.difficulty !== selectedDifficulty) return false;
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
    if (selectedStatus === 'solved' && !c.is_solved) return false;
    if (selectedStatus === 'unsolved' && c.is_solved) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchDesc = c.description.toLowerCase().includes(q);
      const matchLang = c.language.toLowerCase().includes(q);
      const matchCat = c.category.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchLang || matchCat;
    }
    return true;
  });

  const dailyChallenge = challenges.find((c) => c.is_daily) || challenges[0];

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case 'easy':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40';
      case 'medium':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/40';
      case 'hard':
        return 'text-rose-400 bg-rose-950/60 border-rose-800/40';
    }
  };

  const getCategoryIcon = (cat: Category) => {
    switch (cat) {
      case 'syntax':
        return <Bug className="w-3.5 h-3.5 text-pink-400" />;
      case 'logic':
        return <Cpu className="w-3.5 h-3.5 text-cyan-400" />;
      case 'runtime':
        return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      case 'algorithmic':
        return <Layers className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Daily Challenge Highlight */}
      {dailyChallenge && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-500/40 p-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-600/40 px-2 py-0.5 rounded">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  Daily Bug Hunt
                </span>
                <span className="text-xs text-slate-400">· Today's featured trial</span>
              </div>
              <h2 className="text-xl font-bold text-white">{dailyChallenge.title}</h2>
              <p className="text-xs text-slate-300 max-w-2xl line-clamp-2">
                {dailyChallenge.description}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                <span className="capitalize font-mono text-cyan-400 font-semibold">{dailyChallenge.language}</span>
                <span>·</span>
                <span className="capitalize">{dailyChallenge.difficulty}</span>
                <span>·</span>
                <span className="text-amber-400 font-mono font-semibold">+{dailyChallenge.xp_reward} XP</span>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              {dailyChallenge.is_solved && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Solved</span>
                </div>
              )}
              <button
                onClick={() => onSelectChallenge(dailyChallenge.id)}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl hover:opacity-90 shadow-md shadow-purple-600/30 transition-all cursor-pointer"
              >
                <span>{dailyChallenge.is_solved ? 'Replay Challenge' : 'Solve Today\'s Bug'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by bug name, keyword, or concept..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Quick Stats Summary */}
          <div className="text-xs text-slate-400 flex items-center gap-2 font-mono">
            <span>Showing {filtered.length} of {challenges.length} challenges</span>
            <span>·</span>
            <span className="text-emerald-400">{challenges.filter((c) => c.is_solved).length} Solved</span>
          </div>
        </div>

        {/* Filter Tabs / Segmented Controls */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {/* Language filter */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto text-xs">
            {['all', 'python', 'javascript', 'java', 'c'].map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                  selectedLanguage === lang
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'all' ? 'All Languages' : lang === 'javascript' ? 'JavaScript' : lang}
              </button>
            ))}
          </div>

          {/* Difficulty filter */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
            {['all', 'easy', 'medium', 'hard'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                  selectedDifficulty === diff
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {diff === 'all' ? 'All Difficulties' : diff}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
            {['all', 'syntax', 'logic', 'runtime', 'algorithmic'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Bugs' : cat}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
            {['all', 'unsolved', 'solved'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                  selectedStatus === st
                    ? 'bg-slate-800 text-slate-100 border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st === 'all' ? 'Any Status' : st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Challenges Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm font-medium">Loading challenge arena...</p>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-sm">
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/30 rounded-2xl border border-slate-800 text-slate-400">
          <Search className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <h3 className="text-base font-semibold text-slate-200">No challenges match your filters</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting the language, difficulty, or search query.</p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedLanguage('all');
              setSelectedDifficulty('all');
              setSelectedCategory('all');
              setSelectedStatus('all');
            }}
            className="mt-4 px-4 py-2 text-xs font-medium text-cyan-400 hover:text-cyan-300 bg-slate-800 rounded-lg"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectChallenge(c.id)}
              className="group relative flex flex-col justify-between p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900/90 transition-all cursor-pointer shadow-lg hover:shadow-purple-950/20"
            >
              <div>
                {/* Header row: Category & Difficulty */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    {getCategoryIcon(c.category)}
                    <span className="capitalize">{c.category} Bug</span>
                  </div>

                  <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded border capitalize ${getDifficultyColor(c.difficulty)}`}>
                    {c.difficulty}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mb-2">
                  {c.title}
                </h3>

                {/* Description snippet */}
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {c.description}
                </p>
              </div>

              {/* Footer info & CTA */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-mono text-purple-300 capitalize font-medium">
                    {c.language}
                  </span>
                  <span>·</span>
                  <span className="font-mono text-amber-400 font-semibold">
                    +{c.xp_reward} XP
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {c.is_solved ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium font-sans">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Solved</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-slate-400 group-hover:text-cyan-400 transition-colors font-medium">
                      <span>Hunt</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
