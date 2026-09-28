import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { ArenaPage } from './pages/ArenaPage';
import { ChallengeDetailPage } from './pages/ChallengeDetailPage';
import { DashboardPage } from './pages/DashboardPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { AuthPage } from './pages/AuthPage';
import { AgentChatPage } from './pages/AgentChatPage';
import { N8nChatWidget } from './components/N8nChatWidget';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [challengeContext, setChallengeContext] = useState<{
    title: string;
    language: string;
    code: string;
    latestError?: string;
  } | null>(null);

  // Sync hash routing for shareable links
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('challenge/')) {
        const id = hash.replace('challenge/', '');
        setActiveChallengeId(id);
        setCurrentTab('challenge');
      } else if (hash) {
        setCurrentTab(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (tab: string, param?: string) => {
    if (tab === 'challenge' && param) {
      setActiveChallengeId(param);
      setCurrentTab('challenge');
      window.location.hash = `challenge/${param}`;
      window.scrollTo(0, 0);
      return;
    }

    if (tab === 'auth') {
      setAuthMode((param as 'login' | 'register' | 'forgot') || 'login');
      setCurrentTab('auth');
      window.location.hash = 'auth';
      window.scrollTo(0, 0);
      return;
    }

    setCurrentTab(tab);
    window.location.hash = tab;
    window.scrollTo(0, 0);
  };

  const handleOpenChatWithContext = (context: {
    title: string;
    language: string;
    code: string;
    latestError?: string;
  }) => {
    setChallengeContext(context);
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0e17] text-slate-100 font-sans selection:bg-purple-600/30 selection:text-purple-200">
      <Navbar
        currentTab={currentTab}
        onNavigate={navigateTo}
        onOpenChat={() => setIsChatOpen(true)}
      />

      <main className="flex-1">
        {currentTab === 'landing' && <LandingPage onNavigate={navigateTo} />}

        {currentTab === 'arena' && (
          <ArenaPage onSelectChallenge={(id) => navigateTo('challenge', id)} />
        )}

        {currentTab === 'challenge' && activeChallengeId && (
          <ChallengeDetailPage
            challengeId={activeChallengeId}
            onBack={() => navigateTo('arena')}
            onNavigateToAuth={() => navigateTo('auth', 'login')}
            onOpenChatWithContext={handleOpenChatWithContext}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardPage onNavigate={navigateTo} />
        )}

        {currentTab === 'leaderboard' && <LeaderboardPage />}

        {currentTab === 'profile' && <ProfilePage />}

        {currentTab === 'admin' && <AdminPage />}

        {(currentTab === 'copilot' || currentTab === 'agent' || currentTab === 'chat') && (
          <AgentChatPage />
        )}

        {currentTab === 'auth' && (
          <AuthPage
            initialMode={authMode}
            onSuccess={() => navigateTo('dashboard')}
          />
        )}
      </main>

      <Footer onNavigate={navigateTo} />

      {/* n8n AI Chat Assistant Widget */}
      <N8nChatWidget
        currentChallengeContext={challengeContext}
        isOpenExternal={isChatOpen}
        onToggleExternal={setIsChatOpen}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
