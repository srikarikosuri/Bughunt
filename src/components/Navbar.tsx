import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Terminal,
  Bug,
  Flame,
  Award,
  LogOut,
  User as UserIcon,
  Shield,
  Sun,
  Moon,
  Menu,
  X,
  Code2,
  Trophy,
  LayoutDashboard,
  Bot,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, param?: string) => void;
  onOpenChat?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate, onOpenChat }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleNav = (tab: string, param?: string) => {
    onNavigate(tab, param);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#0a0e17]/90 backdrop-blur-md dark:bg-[#0a0e17]/90 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNav('landing')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 p-0.5 shadow-lg shadow-purple-500/20">
              <div className="w-full h-full bg-[#0a0e17] rounded-[10px] flex items-center justify-center">
                <Bug className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-white">
                  Bug<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Hunt</span>
                </span>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60">
                  v2.0
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => handleNav('arena')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentTab === 'arena'
                  ? 'text-white bg-slate-800/80 shadow-sm border border-slate-700/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Arena</span>
            </button>

            <button
              onClick={() => handleNav('leaderboard')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentTab === 'leaderboard'
                  ? 'text-white bg-slate-800/80 shadow-sm border border-slate-700/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Leaderboard</span>
            </button>

            <button
              onClick={() => handleNav('copilot')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentTab === 'copilot'
                  ? 'text-cyan-300 bg-cyan-950/40 shadow-sm border border-cyan-700/50'
                  : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/40'
              }`}
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>AI Copilot</span>
            </button>

            {user && (
              <button
                onClick={() => handleNav('dashboard')}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentTab === 'dashboard'
                    ? 'text-white bg-slate-800/80 shadow-sm border border-slate-700/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-purple-400" />
                <span>Dashboard</span>
              </button>
            )}

            {user?.role === 'admin' && (
              <button
                onClick={() => handleNav('admin')}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentTab === 'admin'
                    ? 'text-amber-300 bg-amber-950/40 border border-amber-800/50'
                    : 'text-amber-400/80 hover:text-amber-300 hover:bg-amber-950/20'
                }`}
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Admin Panel</span>
              </button>
            )}

            {/* AI Copilot Chat Button */}
            {onOpenChat && (
              <button
                onClick={onOpenChat}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-purple-950/80 to-cyan-950/80 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 hover:text-white transition-all shadow-sm shadow-cyan-950/30 cursor-pointer"
                title="Open AI Debugging Copilot (n8n Webhook)"
              >
                <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>AI Copilot</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </button>
            )}
          </div>

          {/* Right Controls: Stats, Theme, Profile */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Streak Counter */}
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-950/40 border border-orange-500/30 text-orange-400 text-xs font-semibold cursor-pointer"
                  title={`${user.streak} Day Debugging Streak`}
                  onClick={() => handleNav('dashboard')}
                >
                  <Flame className="w-4 h-4 fill-orange-500 text-orange-400 animate-bounce" />
                  <span>{user.streak}d</span>
                </div>

                {/* Level & XP */}
                <div
                  className="flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-950/40 border border-purple-500/30 text-xs cursor-pointer hover:border-purple-400 transition-colors"
                  onClick={() => handleNav('dashboard')}
                >
                  <span className="font-mono text-purple-300 font-bold">Lvl {user.level}</span>
                  <span className="text-slate-500">|</span>
                  <span className="text-cyan-400 font-medium">{user.xp} XP</span>
                </div>

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
                </button>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-full border border-slate-700/60 hover:border-cyan-500/60 transition-colors focus:outline-none"
                  >
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`}
                      alt={user.username}
                      className="w-8 h-8 rounded-full bg-slate-800 object-cover"
                    />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1.5 z-50 text-sm">
                      <div className="px-4 py-2 border-b border-slate-800">
                        <p className="font-semibold text-white truncate">{user.username}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>

                      <button
                        onClick={() => handleNav('profile')}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left"
                      >
                        <UserIcon className="w-4 h-4 text-cyan-400" />
                        <span>My Profile</span>
                      </button>

                      <button
                        onClick={() => handleNav('dashboard')}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left"
                      >
                        <LayoutDashboard className="w-4 h-4 text-purple-400" />
                        <span>Dashboard</span>
                      </button>

                      {user.role === 'admin' && (
                        <button
                          onClick={() => handleNav('admin')}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-amber-300 hover:bg-amber-950/30 transition-colors text-left"
                        >
                          <Shield className="w-4 h-4 text-amber-400" />
                          <span>Admin Portal</span>
                        </button>
                      )}

                      <div className="border-t border-slate-800 my-1"></div>

                      <button
                        onClick={() => {
                          logout();
                          handleNav('landing');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
                </button>
                <button
                  onClick={() => handleNav('auth', 'login')}
                  className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNav('auth', 'register')}
                  className="px-4 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg hover:opacity-90 transition-opacity shadow-md shadow-purple-600/20"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0a0e17] px-4 pt-3 pb-5 space-y-2">
          {user && (
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`}
                  alt={user.username}
                  className="w-9 h-9 rounded-full bg-slate-800"
                />
                <div>
                  <div className="font-medium text-white">{user.username}</div>
                  <div className="text-xs text-slate-400">Level {user.level} · {user.xp} XP</div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-orange-400 text-xs font-bold">
                <Flame className="w-4 h-4 fill-orange-500" />
                <span>{user.streak}d streak</span>
              </div>
            </div>
          )}

          <button
            onClick={() => handleNav('arena')}
            className="w-full flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg text-left"
          >
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span>Arena Challenges</span>
          </button>

          <button
            onClick={() => handleNav('leaderboard')}
            className="w-full flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg text-left"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Leaderboard</span>
          </button>

          {onOpenChat && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenChat();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-cyan-300 hover:bg-slate-800 rounded-lg text-left font-medium"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>AI Debugging Copilot (n8n)</span>
            </button>
          )}

          {user && (
            <>
              <button
                onClick={() => handleNav('dashboard')}
                className="w-full flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg text-left"
              >
                <LayoutDashboard className="w-4 h-4 text-purple-400" />
                <span>My Dashboard</span>
              </button>

              <button
                onClick={() => handleNav('profile')}
                className="w-full flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg text-left"
              >
                <UserIcon className="w-4 h-4 text-cyan-400" />
                <span>Profile Settings</span>
              </button>

              {user.role === 'admin' && (
                <button
                  onClick={() => handleNav('admin')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-amber-300 hover:bg-amber-950/30 rounded-lg text-left"
                >
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>Admin Panel</span>
                </button>
              )}

              <button
                onClick={() => {
                  logout();
                  handleNav('landing');
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-rose-400 hover:bg-rose-950/20 rounded-lg text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </>
          )}

          {!user && (
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => handleNav('auth', 'login')}
                className="w-full py-2 text-center text-slate-300 hover:text-white bg-slate-800 rounded-lg font-medium"
              >
                Log In
              </button>
              <button
                onClick={() => handleNav('auth', 'register')}
                className="w-full py-2 text-center text-white bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg font-medium"
              >
                Create Free Account
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
