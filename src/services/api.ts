import {
  User,
  ChallengeSummary,
  ChallengeDetail,
  SubmitResponse,
  UserProgressData,
  LeaderboardEntry,
  AdminChallenge,
  AdminStats,
} from '../types';

const TOKEN_KEY = 'bughunt_token';

export const api = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`/api${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || `Request failed with status ${res.status}`);
    }
    return data as T;
  },

  // Auth
  async register(body: { email: string; username: string; password: string; preferred_language?: string }) {
    const data = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    this.setToken(data.token);
    return data;
  },

  async login(body: { email: string; password: string }) {
    const data = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    this.setToken(data.token);
    return data;
  },

  async getMe() {
    return this.request<{ user: User }>('/auth/me');
  },

  async forgotPassword(email: string) {
    return this.request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async updateProfile(updates: Partial<User>) {
    return this.request<{ user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Challenges
  async getChallenges() {
    return this.request<ChallengeSummary[]>('/challenges');
  },

  async getChallenge(id: string) {
    return this.request<ChallengeDetail>(`/challenges/${id}`);
  },

  async runCode(body: { language: string; code: string; challenge_id?: string; custom_input?: string }) {
    return this.request<any>('/challenges/run', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async submitSolution(challengeId: string, body: { code: string; language: string }) {
    return this.request<SubmitResponse>(`/challenges/${challengeId}/submit`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  // Progress & Leaderboard
  async getUserProgress() {
    return this.request<UserProgressData>('/user/progress');
  },

  async getLeaderboard() {
    return this.request<LeaderboardEntry[]>('/leaderboard');
  },

  // Admin
  async getAdminChallenges() {
    return this.request<AdminChallenge[]>('/admin/challenges');
  },

  async createAdminChallenge(data: Partial<AdminChallenge>) {
    return this.request<{ challenge: AdminChallenge }>('/admin/challenges', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateAdminChallenge(id: string, data: Partial<AdminChallenge>) {
    return this.request<{ challenge: AdminChallenge }>(`/admin/challenges/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteAdminChallenge(id: string) {
    return this.request<{ message: string }>(`/admin/challenges/${id}`, {
      method: 'DELETE',
    });
  },

  async getAdminStats() {
    return this.request<AdminStats>('/admin/stats');
  },

  // n8n Chat Webhook
  async sendN8nChat(body: {
    message: string;
    sessionId?: string;
    webhookUrl?: string;
    context?: any;
    allowFallback?: boolean;
  }) {
    return this.request<{
      reply: string;
      raw?: any;
      sessionId: string;
      source?: 'n8n_live' | 'local_fallback';
      isFallback?: boolean;
      n8nStatus?: number;
      n8nHint?: string;
    }>('/n8n/chat', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
};
