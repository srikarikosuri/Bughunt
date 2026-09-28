import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Github,
  Mail,
  Flame,
  Award,
  Edit2,
  Check,
  Code2,
  Calendar,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { BadgeCard } from '../components/BadgeCard';
import { UserProgressData, Language } from '../types';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [data, setData] = useState<UserProgressData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states
  const [bio, setBio] = useState(user?.bio || '');
  const [githubUrl, setGithubUrl] = useState(user?.github_url || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [preferredLanguage, setPreferredLanguage] = useState<Language>(
    user?.preferred_language || 'python'
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setBio(user.bio || '');
      setGithubUrl(user.github_url || '');
      setAvatar(user.avatar || '');
      setPreferredLanguage(user.preferred_language || 'python');
      loadProgress();
    }
  }, [user]);

  const loadProgress = async () => {
    try {
      setLoading(true);
      const res = await api.getUserProgress();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        bio,
        github_url: githubUrl,
        avatar,
        preferred_language: preferredLanguage,
      });
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile', err);
    }
  };

  if (!user) {
    return (
      <div className="py-20 text-center text-slate-400">
        Please sign in to view your hunter profile.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`}
              alt={user.username}
              className="w-20 h-20 rounded-2xl bg-slate-800 object-cover border-2 border-purple-500/40 p-1"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">{user.username}</h1>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-950/80 border border-purple-800 text-purple-300">
                  Level {user.level}
                </span>
                {user.role === 'admin' && (
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800 text-amber-300">
                    Admin
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>{user.email}</span>
                <span>·</span>
                <Calendar className="w-3.5 h-3.5" />
                <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
              </p>

              <div className="pt-1 flex items-center gap-4 text-xs font-mono text-slate-300">
                <span className="text-cyan-400 font-semibold">{user.xp} XP</span>
                <span>·</span>
                <span className="flex items-center gap-1 text-orange-400 font-semibold">
                  <Flame className="w-3.5 h-3.5 fill-orange-400" />
                  {user.streak}d streak
                </span>
                <span>·</span>
                <span className="capitalize">Prefers {user.preferred_language}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* Bio and GitHub Link */}
        <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            {user.bio || 'No hunter bio provided yet. Add one in settings!'}
          </p>

          {user.github_url && (
            <a
              href={user.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-mono"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Profile</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Edit Form Modal/Drawer */}
      {isEditing && (
        <form onSubmit={handleSave} className="p-6 rounded-3xl bg-slate-900 border border-purple-500/40 space-y-4">
          <h3 className="text-base font-bold text-white mb-2">Edit Hunter Profile</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Preferred Programming Language
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value as Language)}
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
                GitHub Profile URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/your-handle"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Custom Avatar Image URL
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Bio / Tagline
            </label>
            <textarea
              rows={3}
              placeholder="Tell the community about your coding journey..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl hover:opacity-90"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Badges Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Unlocked Badges & Achievements</h2>
        {data?.badges && data.badges.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.badges.map((b) => (
              <BadgeCard key={b.id} badge={b} isUnlocked={true} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No badges unlocked yet. Solve challenges to earn your first badge!</p>
        )}
      </div>
    </div>
  );
};
