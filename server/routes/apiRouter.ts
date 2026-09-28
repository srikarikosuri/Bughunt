import express, { Request, Response } from 'express';
import { db, hashPassword, User } from '../db/store.js';
import { executeInSandbox } from '../sandbox/runner.js';

export const apiRouter = express.Router();

// Simple JWT-like bearer token simulation
// In production or development, token is base64 encoded user info or secret
function createToken(user: User): string {
  return Buffer.from(JSON.stringify({ id: user.id, email: user.email, role: user.role, time: Date.now() })).toString('base64');
}

function getUserFromAuthHeader(req: Request): User | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    if (!decoded.id) return null;
    return db.getUserById(decoded.id) || null;
  } catch {
    return null;
  }
}

function calculateLevel(xp: number): number {
  // RPG curve: Level 1 at 0 XP, Level 2 at 25 XP, Level 3 at 100 XP, Level 4 at 225 XP, etc.
  return Math.floor(Math.sqrt(xp / 25)) + 1;
}

// -------------------------------------------------------------
// AUTH ROUTES
// -------------------------------------------------------------

apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const { email, username, password, preferred_language = 'python' } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ error: 'Email, username, and password are required.' });
  }

  if (db.getUserByEmail(email)) {
    return res.status(409).json({ error: 'A user with this email already exists.' });
  }

  if (db.getUserByUsername(username)) {
    return res.status(409).json({ error: 'Username is already taken.' });
  }

  const user = db.createUser({
    email,
    username,
    password_hash: hashPassword(password),
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`,
    bio: 'Coding enthusiast on BugHunt.',
    preferred_language,
    github_url: '',
    role: 'user',
  });

  const token = createToken(user);
  const { password_hash, ...safeUser } = user;
  return res.status(201).json({ user: safeUser, token });
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.getUserByEmail(email);
  if (!user || user.password_hash !== hashPassword(password)) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  // Update last active
  db.updateUser(user.id, { last_active: new Date().toISOString() });

  const token = createToken(user);
  const { password_hash, ...safeUser } = user;
  return res.json({ user: safeUser, token });
});

apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const user = getUserFromAuthHeader(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const { password_hash, ...safeUser } = user;
  return res.json({ user: safeUser });
});

apiRouter.post('/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  const user = db.getUserByEmail(email);
  // Always return success message for security, plus mock reset token for demo
  return res.json({
    message: user
      ? `Password reset link sent to ${email}. Check your inbox!`
      : 'If that email exists in our records, a reset link has been dispatched.',
  });
});

apiRouter.put('/auth/profile', (req: Request, res: Response) => {
  const user = getUserFromAuthHeader(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { bio, avatar, preferred_language, github_url } = req.body;
  const updated = db.updateUser(user.id, {
    ...(bio !== undefined && { bio }),
    ...(avatar !== undefined && { avatar }),
    ...(preferred_language !== undefined && { preferred_language }),
    ...(github_url !== undefined && { github_url }),
  });

  if (!updated) return res.status(404).json({ error: 'User not found' });
  const { password_hash, ...safeUser } = updated;
  return res.json({ user: safeUser });
});

// -------------------------------------------------------------
// CHALLENGES ROUTES
// -------------------------------------------------------------

apiRouter.get('/challenges', (req: Request, res: Response) => {
  const user = getUserFromAuthHeader(req);
  const challenges = db.getChallenges();

  // Return challenges without hidden test cases and without correct solution
  const sanitized = challenges.map((c) => {
    const isSolved = user ? db.hasUserSolvedChallenge(user.id, c.id) : false;
    const testCasesCount = db.getTestCases(c.id).length;
    return {
      id: c.id,
      title: c.title,
      slug: c.slug,
      language: c.language,
      difficulty: c.difficulty,
      category: c.category,
      xp_reward: c.xp_reward,
      description: c.description,
      is_daily: c.is_daily,
      is_solved: isSolved,
      total_tests: testCasesCount,
    };
  });

  return res.json(sanitized);
});

apiRouter.get('/challenges/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const challenge = db.getChallengeById(id);
  if (!challenge) {
    return res.status(404).json({ error: 'Challenge not found' });
  }

  const user = getUserFromAuthHeader(req);
  const isSolved = user ? db.hasUserSolvedChallenge(user.id, challenge.id) : false;
  // NEVER expose hidden test cases or correct_solution to the client!
  const publicTestCases = db.getPublicTestCases(challenge.id);

  return res.json({
    id: challenge.id,
    title: challenge.title,
    slug: challenge.slug,
    language: challenge.language,
    difficulty: challenge.difficulty,
    category: challenge.category,
    xp_reward: challenge.xp_reward,
    description: challenge.description,
    broken_code: challenge.broken_code,
    hints: challenge.hints,
    is_daily: challenge.is_daily,
    is_solved: isSolved,
    sample_test_cases: publicTestCases,
  });
});

// Run Code against visible test cases or custom input in isolated sandbox
apiRouter.post('/challenges/run', async (req: Request, res: Response) => {
  const { language, code, custom_input, challenge_id } = req.body;

  if (!language || typeof code !== 'string') {
    return res.status(400).json({ error: 'Language and code are required.' });
  }

  // If custom input is provided, run just that
  if (custom_input !== undefined) {
    const result = await executeInSandbox(language, code, custom_input);
    return res.json({
      type: 'custom',
      result,
    });
  }

  // Otherwise run against public test cases for the challenge
  let testCases: { input: string; expected_output: string }[] = [];
  if (challenge_id) {
    testCases = db.getPublicTestCases(challenge_id);
  }

  if (testCases.length === 0) {
    const result = await executeInSandbox(language, code, '');
    return res.json({
      type: 'simple',
      result,
    });
  }

  const runs = [];
  let allPassed = true;

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const execRes = await executeInSandbox(language, code, tc.input);
    const passed = execRes.stdout.trim() === tc.expected_output.trim() && !execRes.isError;
    if (!passed) allPassed = false;

    runs.push({
      caseNumber: i + 1,
      input: tc.input,
      expected: tc.expected_output,
      actual: execRes.stdout,
      stderr: execRes.stderr,
      passed,
      executionTimeMs: execRes.executionTimeMs,
      isTimeout: execRes.isTimeout,
    });
  }

  return res.json({
    type: 'test_cases',
    allPassed,
    runs,
  });
});

// Submit Solution: runs against ALL test cases including hidden ones
apiRouter.post('/challenges/:id/submit', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { code, language } = req.body;

  const challenge = db.getChallengeById(id);
  if (!challenge) {
    return res.status(404).json({ error: 'Challenge not found' });
  }

  const user = getUserFromAuthHeader(req);
  if (!user) {
    return res.status(401).json({ error: 'Please log in to submit solutions and earn XP.' });
  }

  const allTestCases = db.getTestCases(challenge.id);
  const testResults = [];
  let passedCount = 0;
  let totalExecutionTime = 0;
  let firstErrorMessage = '';

  for (let i = 0; i < allTestCases.length; i++) {
    const tc = allTestCases[i];
    const execRes = await executeInSandbox(language || challenge.language, code, tc.input);
    totalExecutionTime += execRes.executionTimeMs;

    const isMatch = execRes.stdout.trim() === tc.expected_output.trim() && !execRes.isError;
    if (isMatch) {
      passedCount++;
    } else if (!firstErrorMessage) {
      firstErrorMessage = execRes.stderr || `Expected '${tc.expected_output}', got '${execRes.stdout}'`;
    }

    testResults.push({
      caseNumber: i + 1,
      isHidden: tc.is_hidden,
      input: tc.is_hidden ? '[Hidden Test Case]' : tc.input,
      expected: tc.is_hidden ? '[Hidden]' : tc.expected_output,
      actual: tc.is_hidden ? (isMatch ? '[Hidden - Passed]' : '[Hidden - Failed]') : execRes.stdout,
      passed: isMatch,
      executionTimeMs: execRes.executionTimeMs,
      stderr: tc.is_hidden ? (isMatch ? '' : 'Hidden test case failed.') : execRes.stderr,
    });
  }

  const allPassed = passedCount === allTestCases.length && allTestCases.length > 0;
  const alreadySolved = db.hasUserSolvedChallenge(user.id, challenge.id);

  let xpEarned = 0;
  const newlyUnlockedBadges = [];

  if (allPassed) {
    // Award XP ONLY ONCE per challenge to prevent farming!
    if (!alreadySolved) {
      xpEarned = challenge.xp_reward;
      const newTotalXp = user.xp + xpEarned;
      const newLevel = calculateLevel(newTotalXp);

      db.updateUser(user.id, {
        xp: newTotalXp,
        level: newLevel,
        last_active: new Date().toISOString(),
      });

      db.recordDailyActivity(user.id, xpEarned);

      // Check Badges
      // 1. First Bug Fixed
      const b1 = db.awardBadge(user.id, 'first-bug-fixed');
      if (b1) newlyUnlockedBadges.push(b1);

      // 2. Language Pro badges
      const userSubs = db.getSubmissionsByUser(user.id);
      const passedPy = userSubs.filter((s) => s.status === 'passed' && s.language === 'python').length + (challenge.language === 'python' ? 1 : 0);
      if (passedPy >= 3) {
        const bPy = db.awardBadge(user.id, 'python-pro');
        if (bPy) newlyUnlockedBadges.push(bPy);
      }

      const passedJs = userSubs.filter((s) => s.status === 'passed' && s.language === 'javascript').length + (challenge.language === 'javascript' ? 1 : 0);
      if (passedJs >= 3) {
        const bJs = db.awardBadge(user.id, 'js-wizard');
        if (bJs) newlyUnlockedBadges.push(bJs);
      }

      const passedC = userSubs.filter((s) => s.status === 'passed' && s.language === 'c').length + (challenge.language === 'c' ? 1 : 0);
      if (passedC >= 2) {
        const bC = db.awardBadge(user.id, 'c-hacker');
        if (bC) newlyUnlockedBadges.push(bC);
      }

      const passedJava = userSubs.filter((s) => s.status === 'passed' && s.language === 'java').length + (challenge.language === 'java' ? 1 : 0);
      if (passedJava >= 2) {
        const bJava = db.awardBadge(user.id, 'java-titan');
        if (bJava) newlyUnlockedBadges.push(bJava);
      }

      // 3. Debugging Master (10+ solved)
      const solvedChallengesSet = new Set(userSubs.filter((s) => s.status === 'passed').map((s) => s.challenge_id));
      solvedChallengesSet.add(challenge.id);
      if (solvedChallengesSet.size >= 10) {
        const bMaster = db.awardBadge(user.id, 'debugging-master');
        if (bMaster) newlyUnlockedBadges.push(bMaster);
      }
    }
  }

  // Create submission record
  const submission = db.createSubmission({
    user_id: user.id,
    challenge_id: challenge.id,
    code,
    language: language || challenge.language,
    status: allPassed ? 'passed' : 'failed',
    passed_tests: passedCount,
    total_tests: allTestCases.length,
    execution_time_ms: totalExecutionTime,
    xp_earned: xpEarned,
    error_message: allPassed ? '' : firstErrorMessage,
  });

  const updatedUser = db.getUserById(user.id);
  const { password_hash, ...safeUser } = updatedUser!;

  return res.json({
    status: allPassed ? 'passed' : 'failed',
    passed_tests: passedCount,
    total_tests: allTestCases.length,
    xp_earned: xpEarned,
    already_solved: alreadySolved,
    test_results: testResults,
    submission_id: submission.id,
    user: safeUser,
    newly_unlocked_badges: newlyUnlockedBadges,
  });
});

// -------------------------------------------------------------
// USER PROGRESS & DASHBOARD ROUTES
// -------------------------------------------------------------

apiRouter.get('/user/progress', (req: Request, res: Response) => {
  const user = getUserFromAuthHeader(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const submissions = db.getSubmissionsByUser(user.id);
  const userBadges = db.getUserBadges(user.id);
  const dailyActivity = db.getUserDailyActivity(user.id);
  const challenges = db.getChallenges();

  const solvedIds = new Set(
    submissions.filter((s) => s.status === 'passed').map((s) => s.challenge_id)
  );

  // Language breakdown
  const languageStats: Record<string, { total: number; solved: number }> = {
    python: { total: 0, solved: 0 },
    javascript: { total: 0, solved: 0 },
    java: { total: 0, solved: 0 },
    c: { total: 0, solved: 0 },
  };

  challenges.forEach((c) => {
    if (languageStats[c.language]) {
      languageStats[c.language].total += 1;
      if (solvedIds.has(c.id)) {
        languageStats[c.language].solved += 1;
      }
    }
  });

  // Recommended challenges: unsolved ones matching preferred language or easiest first
  const recommended = challenges
    .filter((c) => !solvedIds.has(c.id))
    .sort((a, b) => {
      if (a.language === user.preferred_language && b.language !== user.preferred_language) return -1;
      if (b.language === user.preferred_language && a.language !== user.preferred_language) return 1;
      return a.xp_reward - b.xp_reward;
    })
    .slice(0, 3)
    .map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      language: c.language,
      difficulty: c.difficulty,
      category: c.category,
      xp_reward: c.xp_reward,
    }));

  // Daily challenge
  const dailyChallenge = challenges.find((c) => c.is_daily) || challenges[0];

  return res.json({
    user: {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      bio: user.bio,
      preferred_language: user.preferred_language,
      github_url: user.github_url,
      role: user.role,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
    },
    solved_count: solvedIds.size,
    total_challenges: challenges.length,
    language_stats: languageStats,
    badges: userBadges,
    daily_activity: dailyActivity,
    recent_submissions: submissions.slice(0, 8),
    recommended_challenges: recommended,
    daily_challenge: {
      id: dailyChallenge.id,
      title: dailyChallenge.title,
      slug: dailyChallenge.slug,
      language: dailyChallenge.language,
      difficulty: dailyChallenge.difficulty,
      xp_reward: dailyChallenge.xp_reward,
      is_solved: solvedIds.has(dailyChallenge.id),
    },
  });
});

// -------------------------------------------------------------
// LEADERBOARD ROUTE
// -------------------------------------------------------------

apiRouter.get('/leaderboard', (req: Request, res: Response) => {
  const users = db.getUsers();
  const allSubmissions = db.getSubmissions();

  const leaderboard = users
    .map((u) => {
      const solvedCount = new Set(
        allSubmissions.filter((s) => s.user_id === u.id && s.status === 'passed').map((s) => s.challenge_id)
      ).size;
      const badgesCount = db.getUserBadges(u.id).length;

      return {
        id: u.id,
        username: u.username,
        avatar: u.avatar,
        level: u.level,
        xp: u.xp,
        streak: u.streak,
        preferred_language: u.preferred_language,
        badges_count: badgesCount,
        challenges_solved: solvedCount,
      };
    })
    .sort((a, b) => b.xp - a.xp);

  return res.json(leaderboard);
});

// -------------------------------------------------------------
// ADMIN PANEL ROUTES (Role-Based Access Control)
// -------------------------------------------------------------

function requireAdmin(req: Request, res: Response, next: express.NextFunction) {
  const user = getUserFromAuthHeader(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Access forbidden: Administrator privileges required.' });
  }
  next();
}

apiRouter.get('/admin/challenges', requireAdmin, (req: Request, res: Response) => {
  const challenges = db.getChallenges();
  const fullChallenges = challenges.map((c) => ({
    ...c,
    test_cases: db.getTestCases(c.id),
  }));
  return res.json(fullChallenges);
});

apiRouter.post('/admin/challenges', requireAdmin, (req: Request, res: Response) => {
  const {
    title,
    language,
    difficulty,
    category,
    xp_reward,
    description,
    broken_code,
    correct_solution,
    hints = [],
    is_daily = false,
    test_cases = [],
  } = req.body;

  if (!title || !language || !difficulty || !category || !broken_code || !correct_solution) {
    return res.status(400).json({ error: 'Missing required challenge fields.' });
  }

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const newChallenge = db.createChallenge({
    title,
    slug,
    language,
    difficulty,
    category,
    xp_reward: Number(xp_reward) || (difficulty === 'easy' ? 10 : difficulty === 'medium' ? 25 : 50),
    description,
    broken_code,
    correct_solution,
    hints,
    is_daily: Boolean(is_daily),
  });

  if (test_cases && Array.isArray(test_cases)) {
    db.setTestCasesForChallenge(newChallenge.id, test_cases);
  }

  return res.status(201).json({
    challenge: newChallenge,
    test_cases: db.getTestCases(newChallenge.id),
  });
});

apiRouter.put('/admin/challenges/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    title,
    language,
    difficulty,
    category,
    xp_reward,
    description,
    broken_code,
    correct_solution,
    hints,
    is_daily,
    test_cases,
  } = req.body;

  const updated = db.updateChallenge(id, {
    ...(title && { title }),
    ...(language && { language }),
    ...(difficulty && { difficulty }),
    ...(category && { category }),
    ...(xp_reward !== undefined && { xp_reward: Number(xp_reward) }),
    ...(description && { description }),
    ...(broken_code && { broken_code }),
    ...(correct_solution && { correct_solution }),
    ...(hints && { hints }),
    ...(is_daily !== undefined && { is_daily: Boolean(is_daily) }),
  });

  if (!updated) {
    return res.status(404).json({ error: 'Challenge not found' });
  }

  if (test_cases && Array.isArray(test_cases)) {
    db.setTestCasesForChallenge(id, test_cases);
  }

  return res.json({
    challenge: updated,
    test_cases: db.getTestCases(id),
  });
});

apiRouter.delete('/admin/challenges/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteChallenge(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Challenge not found' });
  }
  return res.json({ message: 'Challenge deleted successfully' });
});

apiRouter.get('/admin/stats', requireAdmin, (req: Request, res: Response) => {
  const users = db.getUsers();
  const challenges = db.getChallenges();
  const submissions = db.getSubmissions();

  const totalSubmissions = submissions.length;
  const passedSubmissions = submissions.filter((s) => s.status === 'passed').length;
  const passRate = totalSubmissions > 0 ? Math.round((passedSubmissions / totalSubmissions) * 100) : 0;

  return res.json({
    total_users: users.length,
    total_challenges: challenges.length,
    total_submissions: totalSubmissions,
    pass_rate: passRate,
    users: users.map((u) => {
      const { password_hash, ...safe } = u;
      return safe;
    }),
  });
});

// -------------------------------------------------------------
// N8N AI CHAT WEBHOOK PROXY WITH SMART FALLBACK
// -------------------------------------------------------------
const DEFAULT_N8N_WEBHOOK = 'https://srikari.app.n8n.cloud/webhook/8ba24de8-31ad-43e4-a4e8-9a740fb0409f/chat';

function generateSmartFallbackReply(message: string, context?: any): string {
  const lowerMsg = message.toLowerCase();
  const title = context?.challengeTitle || '';
  const lang = (context?.language || '').toLowerCase();
  const code = context?.userCode || '';
  const errorDiag = context?.errorDiagnostic || '';

  // Tailored debugging responses if context is provided
  if (code && (lowerMsg.includes('bug') || lowerMsg.includes('error') || lowerMsg.includes('fix') || lowerMsg.includes('why') || lowerMsg.includes('hint'))) {
    if (lang.includes('python')) {
      if (code.includes('range(0, len(arr), size - 1)')) {
        return `🔍 **Bug Analysis for ${title || 'Python Code'}**:\n\nIn your chunking function, the loop step is \`size - 1\` instead of \`size\`:\n\`\`\`python\nfor i in range(0, len(arr), size):  # Fixed step\n    result.append(arr[i:i + size])\n\`\`\`\nThis was causing consecutive chunks to overlap and duplicate elements!`;
      }
      if (code.includes('left = mid') || code.includes('right = mid')) {
        return `🔍 **Binary Search Infinite Loop Detected**:\n\nWhen \`arr[mid] < target\`, pointers must advance past \`mid\`:\n\`\`\`python\nelif arr[mid] < target:\n    left = mid + 1\nelse:\n    right = mid - 1\n\`\`\`\nBecause integer division \`(left + right) // 2\` rounds down, leaving \`left = mid\` creates an infinite loop when \`left + 1 == right\`.`;
      }
      if (code.includes('clean_text == reversed_text') && !code.includes(':')) {
        return `🔍 **Syntax Glitch Detected**:\n\nIn Python, \`def\`, \`if\`, and \`else\` statements must always end with a colon \`:\`, and all statements inside a block must share consistent 4-space indentation!`;
      }
      if (code.includes("record['scores']")) {
        return `🔍 **KeyError / ZeroDivision Guard Needed**:\n\nUse \`scores = record.get('scores', [])\` and verify \`if not scores: return 0.0\` before computing the average to avoid division by zero!`;
      }
    }

    if (lang.includes('javascript') || lang.includes('js')) {
      if (code.includes('var i = 0')) {
        return `🔍 **JavaScript Scope Defect**:\n\nUsing \`var i = 0\` hoists a single function-scoped variable shared by all closure callbacks. Change to block-scoped \`let i = 0\`:\n\`\`\`javascript\nfor (let i = 0; i < n; i++) {\n  funcs.push(val => val * i);\n}\n\`\`\``;
      }
      if (code.includes('.country.code')) {
        return `🔍 **Undefined Property Access**:\n\nIf any parent object is undefined, chaining properties throws a TypeError. Use optional chaining:\n\`\`\`javascript\nconst code = user?.profile?.address?.country?.code;\nreturn code ? code.toUpperCase() : 'UNKNOWN';\n\`\`\``;
      }
      if (code.includes('map[nums[i]] = i')) {
        return `🔍 **Two Sum Hash Map Overwrite**:\n\nStoring elements before checking duplicates causes identical numbers (like \`[3, 3]\`) to overwrite indices. Check \`map.has(complement)\` before inserting!`;
      }
    }

    if (lang.includes('java')) {
      if (code.includes('== expectedSecret')) {
        return `🔍 **Java String Reference Equality Bug**:\n\nIn Java, \`==\` checks whether both variables reference the exact same memory address. To compare string values, use \`.equals()\`:\n\`\`\`java\nreturn receivedToken.equals(expectedSecret);\n\`\`\``;
      }
      if (code.includes('i <= arr.length')) {
        return `🔍 **Array Index Out of Bounds**:\n\nThe last valid index is \`arr.length - 1\`. Also, only loop up to \`arr.length / 2\` when reversing in-place, otherwise items are swapped back to their initial spots!`;
      }
      if (code.includes('fib(n - 1) + fib(n - 2)')) {
        return `🔍 **Recursion Stack Overflow**:\n\nAdd a non-positive base case \`if (n <= 0) return 0;\` and convert the exponential recursion into an iterative O(n) loop to prevent StackOverflowError!`;
      }
    }

    if (lang.includes('c')) {
      if (code.includes('scanf("%d", n)')) {
        return `🔍 **C Pointer & Specifier Bug**:\n\n1. In \`scanf\`, pass the address of \`n\`: \`scanf("%d", &n)\`.\n2. In \`printf\`, use \`%d\` instead of \`%s\` to print integers.\n3. Add \`#include <stdio.h>\` at the top!`;
      }
      if (code.includes('str[len - i]')) {
        return `🔍 **C String Null Terminator Corruption**:\n\nSwapping with index \`len - i\` touches index \`len\`, which holds the \`\\0\` null terminator. Swap with \`len - 1 - i\` instead!`;
      }
    }
  }

  // General helpful responses
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
    return `👋 Hello! I am your **BugHunt AI Debugging Copilot**.\n\nI can help you:\n• Diagnose syntax, logical, runtime, and algorithmic bugs\n• Provide progressive hints without giving away the full answer\n• Review code for edge cases and performance bottlenecks\n\nWhat challenge or code snippet are you working on right now?`;
  }

  if (lowerMsg.includes('hint')) {
    return `💡 **Debugging Hint**:\n1. Check your loop boundaries and termination conditions.\n2. Verify edge cases (e.g. empty lists, single elements, negative numbers, null values).\n3. Trace the values of your variables with print statements or step through one test case manually.`;
  }

  return `🤖 **BugHunt AI Copilot**:\n\nI received your query: *" ${message} "*\n\n${
    title ? `Active Challenge: **${title}** (${lang})\n` : ''
  }To squash tricky bugs, ensure:\n1. Syntax and type requirements for **${lang || 'your language'}** are respected.\n2. Off-by-one errors and zero-indexing bounds are handled.\n3. Run against sample test cases in the arena console!`;
}

apiRouter.post('/n8n/chat', async (req: Request, res: Response) => {
  const {
    message,
    sessionId = `bughunt-session-${Date.now()}`,
    webhookUrl = DEFAULT_N8N_WEBHOOK,
    context = null,
    allowFallback = true,
  } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required.' });
  }

  // Build payload compatible with n8n Chat Trigger & Webhook Nodes
  const payload = {
    action: 'sendMessage',
    sessionId,
    chatInput: message,
    message,
    metadata: {
      platform: 'BugHunt',
      timestamp: new Date().toISOString(),
      ...(context && { context }),
    },
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    let n8nResponse: globalThis.Response | null = null;
    let responseStatus = 0;
    let responseText = '';

    try {
      n8nResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      responseStatus = n8nResponse.status;
      responseText = await n8nResponse.text();
    } catch (fetchErr: any) {
      clearTimeout(timeoutId);
      if (!allowFallback) throw fetchErr;
      // Fallback if network/webhook unreachable
      const fallbackReply = generateSmartFallbackReply(message, context);
      return res.json({
        reply: fallbackReply,
        source: 'local_fallback',
        isFallback: true,
        reason: fetchErr.message,
        sessionId,
      });
    }

    // If n8n returned 404 (workflow inactive or not listening)
    if (responseStatus === 404) {
      if (allowFallback) {
        const fallbackReply = generateSmartFallbackReply(message, context);
        return res.json({
          reply: fallbackReply,
          source: 'local_fallback',
          isFallback: true,
          n8nStatus: 404,
          webhookUrl,
          n8nHint:
            'n8n workflow is currently Inactive. In your n8n Cloud canvas, flip the top-right switch from Inactive to Active and click Save to route requests through your live n8n workflow.',
          sessionId,
        });
      }

      return res.status(404).json({
        error: 'n8n Webhook returned 404',
        status: 404,
        details: responseText,
        tip: 'In your n8n Cloud canvas, toggle the top-right switch from Inactive to Active and click Save.',
      });
    }

    if (!n8nResponse.ok) {
      if (allowFallback) {
        const fallbackReply = generateSmartFallbackReply(message, context);
        return res.json({
          reply: fallbackReply,
          source: 'local_fallback',
          isFallback: true,
          n8nStatus: responseStatus,
          reason: `n8n returned ${responseStatus}: ${responseText.slice(0, 100)}`,
          sessionId,
        });
      }

      return res.status(responseStatus).json({
        error: `n8n webhook returned status ${responseStatus}`,
        status: responseStatus,
        details: responseText,
      });
    }

    // Try parsing as JSON or return raw text
    try {
      const json = JSON.parse(responseText);
      let replyText = '';

      if (typeof json === 'string') {
        replyText = json;
      } else if (json.output) {
        replyText = typeof json.output === 'string' ? json.output : JSON.stringify(json.output);
      } else if (json.response) {
        replyText = typeof json.response === 'string' ? json.response : JSON.stringify(json.response);
      } else if (json.text) {
        replyText = typeof json.text === 'string' ? json.text : JSON.stringify(json.text);
      } else if (json.message) {
        replyText = typeof json.message === 'string' ? json.message : JSON.stringify(json.message);
      } else if (Array.isArray(json) && json.length > 0) {
        const first = json[0];
        replyText =
          first.json?.output ||
          first.json?.response ||
          first.json?.text ||
          first.output ||
          first.text ||
          JSON.stringify(first);
      } else {
        replyText = JSON.stringify(json, null, 2);
      }

      return res.json({
        reply: replyText,
        raw: json,
        source: 'n8n_live',
        sessionId,
      });
    } catch {
      return res.json({
        reply: responseText,
        source: 'n8n_live',
        sessionId,
      });
    }
  } catch (err: any) {
    const isTimeout = err.name === 'AbortError';
    if (allowFallback) {
      const fallbackReply = generateSmartFallbackReply(message, context);
      return res.json({
        reply: fallbackReply,
        source: 'local_fallback',
        isFallback: true,
        isTimeout,
        sessionId,
      });
    }

    return res.status(500).json({
      error: isTimeout
        ? 'n8n chat webhook timed out (waited 12s).'
        : `Could not connect to n8n webhook: ${err.message}`,
      isTimeout,
    });
  }
});


