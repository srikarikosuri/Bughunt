import React, { useState, useEffect } from 'react';
import {
  Shield,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Users,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Code2,
  FileCode,
  Eye,
  Check,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AdminChallenge, AdminStats, AdminTestCase, Language, Difficulty, Category } from '../types';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<AdminChallenge[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Editing / Creating Challenge Modal
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Challenge Form State
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState<Language>('python');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [category, setCategory] = useState<Category>('syntax');
  const [xpReward, setXpReward] = useState<number>(10);
  const [description, setDescription] = useState('');
  const [brokenCode, setBrokenCode] = useState('');
  const [correctSolution, setCorrectSolution] = useState('');
  const [hintsText, setHintsText] = useState('');
  const [isDaily, setIsDaily] = useState(false);
  const [testCases, setTestCases] = useState<AdminTestCase[]>([
    { input: '', expected_output: '', is_hidden: false },
    { input: '', expected_output: '', is_hidden: true },
  ]);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [challengeList, adminStats] = await Promise.all([
        api.getAdminChallenges(),
        api.getAdminStats(),
      ]);
      setChallenges(challengeList);
      setStats(adminStats);
    } catch (err: any) {
      setError(err.message || 'Failed to load admin resources');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingId(null);
    setTitle('');
    setLanguage('python');
    setDifficulty('easy');
    setCategory('syntax');
    setXpReward(10);
    setDescription('');
    setBrokenCode('# Broken starter code with intentional bug\n');
    setCorrectSolution('# Working verified solution\n');
    setHintsText('Hint 1: Check the variable definitions.\nHint 2: Review syntax rules.');
    setIsDaily(false);
    setTestCases([
      { input: 'sample_input', expected_output: 'expected_result', is_hidden: false },
      { input: 'hidden_input', expected_output: 'hidden_result', is_hidden: true },
    ]);
  };

  const handleOpenEdit = (ch: AdminChallenge) => {
    setModalMode('edit');
    setEditingId(ch.id);
    setTitle(ch.title);
    setLanguage(ch.language);
    setDifficulty(ch.difficulty);
    setCategory(ch.category);
    setXpReward(ch.xp_reward);
    setDescription(ch.description);
    setBrokenCode(ch.broken_code);
    setCorrectSolution(ch.correct_solution);
    setHintsText(ch.hints.join('\n'));
    setIsDaily(ch.is_daily);
    setTestCases(
      ch.test_cases && ch.test_cases.length > 0
        ? ch.test_cases.map((t) => ({ input: t.input, expected_output: t.expected_output, is_hidden: t.is_hidden }))
        : [{ input: '', expected_output: '', is_hidden: false }]
    );
  };

  const handleDelete = async (id: string, challengeTitle: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${challengeTitle}"?`)) {
      return;
    }
    try {
      await api.deleteAdminChallenge(id);
      setSuccessMessage(`Deleted challenge "${challengeTitle}"`);
      setTimeout(() => setSuccessMessage(''), 3000);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete challenge');
    }
  };

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: '', expected_output: '', is_hidden: false }]);
  };

  const handleRemoveTestCase = (index: number) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const handleTestCaseChange = (index: number, field: keyof AdminTestCase, value: any) => {
    const updated = [...testCases];
    updated[index] = { ...updated[index], [field]: value };
    setTestCases(updated);
  };

  const handleSaveChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const hints = hintsText
        .split('\n')
        .map((h) => h.trim())
        .filter(Boolean);

      const payload = {
        title,
        language,
        difficulty,
        category,
        xp_reward: Number(xpReward),
        description,
        broken_code: brokenCode,
        correct_solution: correctSolution,
        hints,
        is_daily: isDaily,
        test_cases: testCases.filter((tc) => tc.expected_output.trim() !== ''),
      };

      if (modalMode === 'create') {
        await api.createAdminChallenge(payload);
        setSuccessMessage('New debugging challenge published successfully!');
      } else if (modalMode === 'edit' && editingId) {
        await api.updateAdminChallenge(editingId, payload);
        setSuccessMessage('Challenge updated successfully!');
      }

      setModalMode(null);
      setTimeout(() => setSuccessMessage(''), 3000);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save challenge');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <Shield className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Admin Privileges Required</h2>
        <p className="text-xs text-slate-400">
          You must be logged in as an administrator to access the challenge management portal.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <h1 className="text-2xl font-bold text-white">Administrator Portal</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800 text-amber-300">
              RBAC Verified
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Author and inspect challenges, define hidden test suites, and monitor hunter telemetry.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl hover:opacity-90 shadow-md shadow-purple-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Challenge</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
            <div className="text-xs text-slate-400 uppercase font-semibold">Total Hunters</div>
            <div className="text-2xl font-bold text-white font-mono mt-1">{stats.total_users}</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
            <div className="text-xs text-slate-400 uppercase font-semibold">Live Challenges</div>
            <div className="text-2xl font-bold text-purple-400 font-mono mt-1">{stats.total_challenges}</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
            <div className="text-xs text-slate-400 uppercase font-semibold">Total Submissions</div>
            <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">{stats.total_submissions}</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
            <div className="text-xs text-slate-400 uppercase font-semibold">Overall Pass Rate</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">{stats.pass_rate}%</div>
          </div>
        </div>
      )}

      {/* Challenges Management Table */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white">Active Debugging Challenges</h2>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">Loading challenges...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Language</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">XP</th>
                  <th className="py-3 px-4">Test Cases</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {challenges.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-850/50">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <span>{c.title}</span>
                        {c.is_daily && (
                          <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-1 rounded border border-amber-800">
                            Daily
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono capitalize text-purple-300">{c.language}</td>
                    <td className="py-3.5 px-4 capitalize font-mono text-slate-300">{c.difficulty}</td>
                    <td className="py-3.5 px-4 capitalize text-slate-300">{c.category}</td>
                    <td className="py-3.5 px-4 font-mono text-amber-400 font-bold">+{c.xp_reward}</td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono">
                      {c.test_cases?.length || 0} ({c.test_cases?.filter((t) => t.is_hidden).length || 0} hidden)
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                          title="Edit Challenge"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.title)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Delete Challenge"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Challenge Create/Edit Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-4xl my-8 rounded-3xl bg-slate-900 border border-purple-500/40 shadow-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-purple-400" />
                <h3 className="text-xl font-bold text-white">
                  {modalMode === 'create' ? 'Author New Debugging Challenge' : 'Edit Challenge & Test Suite'}
                </h3>
              </div>
              <button
                onClick={() => setModalMode(null)}
                className="p-2 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveChallenge} className="space-y-6">
              {/* Basic Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Challenge Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Off-by-one Pointer Crash"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                    <option value="c">C</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => {
                      const d = e.target.value as Difficulty;
                      setDifficulty(d);
                      setXpReward(d === 'easy' ? 10 : d === 'medium' ? 25 : 50);
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="easy">Easy (10 XP)</option>
                    <option value="medium">Medium (25 XP)</option>
                    <option value="hard">Hard (50 XP)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Bug Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="syntax">Syntax Error</option>
                    <option value="logic">Logical Bug</option>
                    <option value="runtime">Runtime Crash</option>
                    <option value="algorithmic">Algorithmic Flaw</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    XP Reward
                  </label>
                  <input
                    type="number"
                    value={xpReward}
                    onChange={(e) => setXpReward(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={isDaily}
                      onChange={(e) => setIsDaily(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-0"
                    />
                    <span>Featured as Daily Challenge</span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Problem Description & Bug Story
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain the background, scenario, and bug symptoms..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-sans"
                />
              </div>

              {/* Broken Code vs Correct Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-rose-400 uppercase mb-1">
                    Broken Starter Code (Presented to User)
                  </label>
                  <textarea
                    rows={8}
                    required
                    value={brokenCode}
                    onChange={(e) => setBrokenCode(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-rose-300 focus:outline-none focus:border-rose-500 whitespace-pre"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-400 uppercase mb-1">
                    Correct Solution (Reference - NEVER EXPOSED to Client)
                  </label>
                  <textarea
                    rows={8}
                    required
                    value={correctSolution}
                    onChange={(e) => setCorrectSolution(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500 whitespace-pre"
                  />
                </div>
              </div>

              {/* Progressive Hints */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Progressive Hints (One per line)
                </label>
                <textarea
                  rows={3}
                  value={hintsText}
                  onChange={(e) => setHintsText(e.target.value)}
                  placeholder="Hint 1: Check line 4...\nHint 2: Pay attention to edge cases..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Test Cases Editor */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 uppercase">Test Cases</h4>
                    <p className="text-[11px] text-slate-500">
                      Hidden test cases are verified in the sandbox but never sent to the client.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTestCase}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-cyan-400 hover:text-cyan-300 bg-slate-800 rounded-lg"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Test Case</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {testCases.map((tc, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                    >
                      <div className="sm:col-span-4">
                        <label className="text-[10px] text-slate-500 font-mono block">Input (stdin)</label>
                        <input
                          type="text"
                          value={tc.input}
                          onChange={(e) => handleTestCaseChange(idx, 'input', e.target.value)}
                          placeholder="e.g. racecar"
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-white"
                        />
                      </div>

                      <div className="sm:col-span-5">
                        <label className="text-[10px] text-slate-500 font-mono block">Expected Output</label>
                        <input
                          type="text"
                          value={tc.expected_output}
                          onChange={(e) => handleTestCaseChange(idx, 'expected_output', e.target.value)}
                          placeholder="e.g. True"
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-white"
                        />
                      </div>

                      <div className="sm:col-span-2 flex items-center pt-3">
                        <label className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={tc.is_hidden}
                            onChange={(e) => handleTestCaseChange(idx, 'is_hidden', e.target.checked)}
                            className="rounded bg-slate-900 text-purple-600"
                          />
                          <span>Hidden</span>
                        </label>
                      </div>

                      <div className="sm:col-span-1 text-right pt-3">
                        <button
                          type="button"
                          onClick={() => handleRemoveTestCase(idx)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form submit footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl hover:opacity-90 shadow-md shadow-purple-600/30"
                >
                  <Save className="w-4 h-4" />
                  <span>{modalMode === 'create' ? 'Publish Challenge' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
