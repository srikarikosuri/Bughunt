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
  }): Promise<{
    reply: string;
    raw?: any;
    sessionId: string;
    source?: 'n8n_live' | 'local_fallback';
    isFallback?: boolean;
    n8nStatus?: number;
    n8nHint?: string;
  }> {
    const rawUrl = (body.webhookUrl || 'https://srikari.app.n8n.cloud/webhook/8ba24de8-31ad-43e4-a4e8-9a740fb0409f/chat').replace('webhook-test', 'webhook');
    const sessionId = body.sessionId || `bughunt-session-${Date.now()}`;

    // 1. Try direct call to n8n webhook (fastest, CORS enabled)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const directRes = await fetch(rawUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*',
        },
        body: JSON.stringify({
          action: 'sendMessage',
          sessionId,
          chatInput: body.message,
          message: body.message,
          ...(body.context && { context: body.context }),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (directRes.ok) {
        const text = await directRes.text();
        try {
          const json = JSON.parse(text);
          const reply =
            json.output ||
            json.response ||
            json.text ||
            (json.message && json.message !== 'Workflow executed successfully' ? json.message : null) ||
            (Array.isArray(json) && (json[0]?.json?.output || json[0]?.output || json[0]?.text)) ||
            (typeof json === 'string' ? json : null);

          if (reply && typeof reply === 'string') {
            return {
              reply,
              raw: json,
              sessionId,
              source: 'n8n_live',
            };
          }
        } catch {
          if (text && text.trim()) {
            return {
              reply: text,
              sessionId,
              source: 'n8n_live',
            };
          }
        }
      }
    } catch {
      // Proceed to server proxy
    }

    // 2. Call backend proxy /api/n8n/chat
    try {
      return await this.request<{
        reply: string;
        raw?: any;
        sessionId: string;
        source?: 'n8n_live' | 'local_fallback';
        isFallback?: boolean;
        n8nStatus?: number;
        n8nHint?: string;
      }>('/n8n/chat', {
        method: 'POST',
        body: JSON.stringify({
          ...body,
          webhookUrl: rawUrl,
          sessionId,
        }),
      });
    } catch {
      // 3. Fallback response if both network routes fail
      return {
        reply: `Hello! I received your query: "${body.message}". In this challenge, check loop boundaries and ensure variables are properly scoped. Paste your code snippet here and I will help you diagnose the exact bug!`,
        sessionId,
        source: 'local_fallback',
        isFallback: true,
      };
    }
  },
};
