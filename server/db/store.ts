import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { INITIAL_BADGES, INITIAL_CHALLENGES, INITIAL_TEST_CASES, ChallengeSeed, TestCaseSeed, BadgeSeed } from './seedData.js';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  username: string;
  avatar: string;
  bio: string;
  preferred_language: 'python' | 'javascript' | 'java' | 'c';
  github_url: string;
  role: 'user' | 'admin';
  xp: number;
  level: number;
  streak: number;
  last_active: string;
  created_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  slug: string;
  language: 'python' | 'javascript' | 'java' | 'c';
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'syntax' | 'logic' | 'runtime' | 'algorithmic';
  xp_reward: number;
  description: string;
  broken_code: string;
  correct_solution: string;
  hints: string[];
  is_daily: boolean;
  created_at: string;
}

export interface TestCase {
  id: string;
  challenge_id: string;
  input: string;
  expected_output: string;
  is_hidden: boolean;
  order_num: number;
}

export interface Submission {
  id: string;
  user_id: string;
  challenge_id: string;
  code: string;
  language: string;
  status: 'passed' | 'failed' | 'error' | 'timeout';
  passed_tests: number;
  total_tests: number;
  execution_time_ms: number;
  xp_earned: number;
  error_message: string;
  created_at: string;
}

export interface Badge {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  xp_bonus: number;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  unlocked_at: string;
}

export interface DailyActivity {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  challenges_solved: number;
  xp_earned: number;
}

interface DatabaseSchema {
  users: User[];
  challenges: Challenge[];
  test_cases: TestCase[];
  submissions: Submission[];
  badges: Badge[];
  user_badges: UserBadge[];
  daily_activity: DailyActivity[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'bughunt_db.json');

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export class DatabaseStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadOrInitialize();
  }

  private loadOrInitialize(): DatabaseSchema {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      } catch (err) {
        console.error('Failed reading database file, recreating initial state:', err);
      }
    }

    // Initialize fresh data with seeds
    const now = new Date().toISOString();
    const today = now.slice(0, 10);

    const initialUsers: User[] = [
      {
        id: 'usr-demo-1',
        email: 'alex@bughunt.dev',
        password_hash: hashPassword('password123'),
        username: 'AlexHunter',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80',
        bio: 'Bug squasher & full-stack tinkerer. Loving logic puzzles and binary trees!',
        preferred_language: 'python',
        github_url: 'https://github.com/alex-bughunter',
        role: 'user',
        xp: 135,
        level: 3,
        streak: 4,
        last_active: now,
        created_at: now,
      },
      {
        id: 'usr-admin-1',
        email: 'admin@bughunt.dev',
        password_hash: hashPassword('admin123'),
        username: 'AdaLovelaceAdmin',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80',
        bio: 'Lead Architect & Problem Author at BugHunt.',
        preferred_language: 'c',
        github_url: 'https://github.com/bughunt-official',
        role: 'admin',
        xp: 350,
        level: 4,
        streak: 12,
        last_active: now,
        created_at: now,
      },
      {
        id: 'usr-top-1',
        email: 'cipher@bughunt.dev',
        password_hash: hashPassword('password123'),
        username: 'ByteSlayer',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80',
        bio: 'Aiming for the #1 spot on BugHunt leaderboard. Memory safety first!',
        preferred_language: 'c',
        github_url: 'https://github.com/byteslayer',
        role: 'user',
        xp: 420,
        level: 5,
        streak: 18,
        last_active: now,
        created_at: now,
      },
      {
        id: 'usr-top-2',
        email: 'sarah@bughunt.dev',
        password_hash: hashPassword('password123'),
        username: 'NovaCoder',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
        bio: 'React and Python enthusiast. Finding bugs before QA does.',
        preferred_language: 'javascript',
        github_url: 'https://github.com/novacoder',
        role: 'user',
        xp: 290,
        level: 4,
        streak: 6,
        last_active: now,
        created_at: now,
      },
    ];

    const initialChallenges: Challenge[] = INITIAL_CHALLENGES.map((c) => ({
      ...c,
      is_daily: Boolean(c.is_daily),
      created_at: now,
    }));

    const initialTestCases: TestCase[] = INITIAL_TEST_CASES.map((tc) => ({
      ...tc,
    }));

    const initialBadges: Badge[] = INITIAL_BADGES.map((b) => ({
      ...b,
    }));

    const initialUserBadges: UserBadge[] = [
      {
        id: 'ub-1',
        user_id: 'usr-demo-1',
        badge_id: 'badge-1', // First Bug Fixed
        unlocked_at: now,
      },
      {
        id: 'ub-2',
        user_id: 'usr-demo-1',
        badge_id: 'badge-2', // Python Pro
        unlocked_at: now,
      },
      {
        id: 'ub-3',
        user_id: 'usr-admin-1',
        badge_id: 'badge-1',
        unlocked_at: now,
      },
      {
        id: 'ub-4',
        user_id: 'usr-admin-1',
        badge_id: 'badge-7', // Debugging Master
        unlocked_at: now,
      },
    ];

    const initialSubmissions: Submission[] = [
      {
        id: 'sub-demo-1',
        user_id: 'usr-demo-1',
        challenge_id: 'ch-py-1',
        code: INITIAL_CHALLENGES[0].correct_solution,
        language: 'python',
        status: 'passed',
        passed_tests: 4,
        total_tests: 4,
        execution_time_ms: 120,
        xp_earned: 10,
        error_message: '',
        created_at: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
      },
      {
        id: 'sub-demo-2',
        user_id: 'usr-demo-1',
        challenge_id: 'ch-py-2',
        code: INITIAL_CHALLENGES[1].correct_solution,
        language: 'python',
        status: 'passed',
        passed_tests: 4,
        total_tests: 4,
        execution_time_ms: 95,
        xp_earned: 10,
        error_message: '',
        created_at: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
      },
      {
        id: 'sub-demo-3',
        user_id: 'usr-demo-1',
        challenge_id: 'ch-js-1',
        code: INITIAL_CHALLENGES[4].correct_solution,
        language: 'javascript',
        status: 'passed',
        passed_tests: 4,
        total_tests: 4,
        execution_time_ms: 45,
        xp_earned: 10,
        error_message: '',
        created_at: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
      },
    ];

    const initialDailyActivity: DailyActivity[] = [
      {
        id: 'da-1',
        user_id: 'usr-demo-1',
        date: today,
        challenges_solved: 1,
        xp_earned: 10,
      },
      {
        id: 'da-2',
        user_id: 'usr-demo-1',
        date: new Date(Date.now() - 3600 * 1000 * 24).toISOString().slice(0, 10),
        challenges_solved: 2,
        xp_earned: 20,
      },
    ];

    const schema: DatabaseSchema = {
      users: initialUsers,
      challenges: initialChallenges,
      test_cases: initialTestCases,
      submissions: initialSubmissions,
      badges: initialBadges,
      user_badges: initialUserBadges,
      daily_activity: initialDailyActivity,
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(schema, null, 2), 'utf-8');
    return schema;
  }

  public save(): void {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed saving database to disk:', err);
    }
  }

  // --- Users ---
  public getUsers(): User[] {
    return this.data.users;
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public getUserByUsername(username: string): User | undefined {
    return this.data.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  }

  public createUser(user: Omit<User, 'id' | 'created_at' | 'xp' | 'level' | 'streak' | 'last_active'>): User {
    const newUser: User = {
      ...user,
      id: `usr-${crypto.randomUUID().slice(0, 8)}`,
      xp: 0,
      level: 1,
      streak: 1,
      last_active: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<User>): User | undefined {
    const user = this.getUserById(id);
    if (!user) return undefined;
    Object.assign(user, updates);
    this.save();
    return user;
  }

  // --- Challenges ---
  public getChallenges(): Challenge[] {
    return this.data.challenges;
  }

  public getChallengeById(id: string): Challenge | undefined {
    return this.data.challenges.find((c) => c.id === id || c.slug === id);
  }

  public createChallenge(challenge: Omit<Challenge, 'id' | 'created_at'>): Challenge {
    const newChallenge: Challenge = {
      ...challenge,
      id: `ch-${crypto.randomUUID().slice(0, 8)}`,
      created_at: new Date().toISOString(),
    };
    this.data.challenges.push(newChallenge);
    this.save();
    return newChallenge;
  }

  public updateChallenge(id: string, updates: Partial<Challenge>): Challenge | undefined {
    const challenge = this.data.challenges.find((c) => c.id === id);
    if (!challenge) return undefined;
    Object.assign(challenge, updates);
    this.save();
    return challenge;
  }

  public deleteChallenge(id: string): boolean {
    const index = this.data.challenges.findIndex((c) => c.id === id);
    if (index === -1) return false;
    this.data.challenges.splice(index, 1);
    this.data.test_cases = this.data.test_cases.filter((tc) => tc.challenge_id !== id);
    this.data.submissions = this.data.submissions.filter((s) => s.challenge_id !== id);
    this.save();
    return true;
  }

  // --- Test Cases ---
  public getTestCases(challengeId: string): TestCase[] {
    return this.data.test_cases
      .filter((tc) => tc.challenge_id === challengeId)
      .sort((a, b) => a.order_num - b.order_num);
  }

  public getPublicTestCases(challengeId: string): Omit<TestCase, 'is_hidden'>[] {
    return this.data.test_cases
      .filter((tc) => tc.challenge_id === challengeId && !tc.is_hidden)
      .sort((a, b) => a.order_num - b.order_num)
      .map(({ id, challenge_id, input, expected_output, order_num }) => ({
        id,
        challenge_id,
        input,
        expected_output,
        order_num,
      }));
  }

  public setTestCasesForChallenge(challengeId: string, testCases: Omit<TestCase, 'id' | 'challenge_id'>[]): void {
    this.data.test_cases = this.data.test_cases.filter((tc) => tc.challenge_id !== challengeId);
    testCases.forEach((tc, idx) => {
      this.data.test_cases.push({
        ...tc,
        id: `tc-${crypto.randomUUID().slice(0, 8)}`,
        challenge_id: challengeId,
        order_num: idx + 1,
      });
    });
    this.save();
  }

  // --- Submissions ---
  public getSubmissions(): Submission[] {
    return this.data.submissions;
  }

  public getSubmissionsByUser(userId: string): Submission[] {
    return this.data.submissions
      .filter((s) => s.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public hasUserSolvedChallenge(userId: string, challengeId: string): boolean {
    return this.data.submissions.some(
      (s) => s.user_id === userId && s.challenge_id === challengeId && s.status === 'passed'
    );
  }

  public createSubmission(sub: Omit<Submission, 'id' | 'created_at'>): Submission {
    const submission: Submission = {
      ...sub,
      id: `sub-${crypto.randomUUID().slice(0, 8)}`,
      created_at: new Date().toISOString(),
    };
    this.data.submissions.push(submission);
    this.save();
    return submission;
  }

  // --- Badges ---
  public getBadges(): Badge[] {
    return this.data.badges;
  }

  public getUserBadges(userId: string): (Badge & { unlocked_at: string })[] {
    const userBadgeRecords = this.data.user_badges.filter((ub) => ub.user_id === userId);
    return userBadgeRecords
      .map((ub) => {
        const badge = this.data.badges.find((b) => b.id === ub.badge_id);
        if (!badge) return null;
        return {
          ...badge,
          unlocked_at: ub.unlocked_at,
        };
      })
      .filter(Boolean) as (Badge & { unlocked_at: string })[];
  }

  public awardBadge(userId: string, badgeKey: string): Badge | null {
    const badge = this.data.badges.find((b) => b.key === badgeKey);
    if (!badge) return null;
    const exists = this.data.user_badges.some(
      (ub) => ub.user_id === userId && ub.badge_id === badge.id
    );
    if (exists) return null;

    this.data.user_badges.push({
      id: `ub-${crypto.randomUUID().slice(0, 8)}`,
      user_id: userId,
      badge_id: badge.id,
      unlocked_at: new Date().toISOString(),
    });
    this.save();
    return badge;
  }

  // --- Daily Activity ---
  public recordDailyActivity(userId: string, xpEarned: number): void {
    const today = new Date().toISOString().slice(0, 10);
    let record = this.data.daily_activity.find((d) => d.user_id === userId && d.date === today);
    if (record) {
      record.challenges_solved += 1;
      record.xp_earned += xpEarned;
    } else {
      this.data.daily_activity.push({
        id: `da-${crypto.randomUUID().slice(0, 8)}`,
        user_id: userId,
        date: today,
        challenges_solved: 1,
        xp_earned: xpEarned,
      });
    }
    this.save();
  }

  public getUserDailyActivity(userId: string): DailyActivity[] {
    return this.data.daily_activity
      .filter((d) => d.user_id === userId)
      .sort((a, b) => a.date.localeCompare(b.date));
  }
}

export const db = new DatabaseStore();
export { hashPassword };
