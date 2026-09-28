export type Language = 'python' | 'javascript' | 'java' | 'c';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Category = 'syntax' | 'logic' | 'runtime' | 'algorithmic';

export interface User {
  id: string;
  email: string;
  username: string;
  avatar: string;
  bio: string;
  preferred_language: Language;
  github_url: string;
  role: 'user' | 'admin';
  xp: number;
  level: number;
  streak: number;
  last_active: string;
  created_at: string;
}

export interface ChallengeSummary {
  id: string;
  title: string;
  slug: string;
  language: Language;
  difficulty: Difficulty;
  category: Category;
  xp_reward: number;
  description: string;
  is_daily: boolean;
  is_solved: boolean;
  total_tests: number;
}

export interface SampleTestCase {
  id: string;
  challenge_id: string;
  input: string;
  expected_output: string;
  order_num: number;
}

export interface ChallengeDetail extends ChallengeSummary {
  broken_code: string;
  hints: string[];
  sample_test_cases: SampleTestCase[];
}

export interface AdminTestCase {
  id?: string;
  input: string;
  expected_output: string;
  is_hidden: boolean;
  order_num?: number;
}

export interface AdminChallenge {
  id: string;
  title: string;
  slug: string;
  language: Language;
  difficulty: Difficulty;
  category: Category;
  xp_reward: number;
  description: string;
  broken_code: string;
  correct_solution: string;
  hints: string[];
  is_daily: boolean;
  test_cases: AdminTestCase[];
}

export interface TestResultItem {
  caseNumber: number;
  isHidden?: boolean;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  executionTimeMs: number;
  stderr?: string;
}

export interface SubmitResponse {
  status: 'passed' | 'failed';
  passed_tests: number;
  total_tests: number;
  xp_earned: number;
  already_solved: boolean;
  test_results: TestResultItem[];
  submission_id: string;
  user: User;
  newly_unlocked_badges: Badge[];
}

export interface Badge {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  xp_bonus: number;
  unlocked_at?: string;
}

export interface DailyActivity {
  id: string;
  user_id: string;
  date: string;
  challenges_solved: number;
  xp_earned: number;
}

export interface UserProgressData {
  user: User;
  solved_count: number;
  total_challenges: number;
  language_stats: Record<Language, { total: number; solved: number }>;
  badges: Badge[];
  daily_activity: DailyActivity[];
  recent_submissions: any[];
  recommended_challenges: ChallengeSummary[];
  daily_challenge: {
    id: string;
    title: string;
    slug: string;
    language: Language;
    difficulty: Difficulty;
    xp_reward: number;
    is_solved: boolean;
  };
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  avatar: string;
  level: number;
  xp: number;
  streak: number;
  preferred_language: Language;
  badges_count: number;
  challenges_solved: number;
}

export interface AdminStats {
  total_users: number;
  total_challenges: number;
  total_submissions: number;
  pass_rate: number;
  users: User[];
}
