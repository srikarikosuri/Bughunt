# BugHunt - Gamified Debugging & Code Arena

> **"Find Bugs. Fix Code. Level Up."**

BugHunt is an interactive developer learning platform where students and software engineers sharpen their debugging instincts by diagnosing and repairing intentionally broken code across **Python, JavaScript, Java, and C**.

Solve algorithmic bugs, syntax slips, logic fallacies, and runtime errors, maintain streaks, unlock badges, and climb the global leaderboard.

---

## 🚀 Features

1. **Gamified Debugging Arena**
   - 16+ real, non-trivial challenges across 4 languages: Python, JavaScript, Java, and C.
   - Categorized by bug type: Syntax Errors, Logical Bugs, Runtime Exceptions, and Algorithmic Flaws.
   - Monaco Editor with dark theme, line numbers, and custom editor keybindings.
   - Live runner and submission validation with test case diffing and stdout/stderr inspection.

2. **Secure Isolated Sandbox Execution**
   - Isolated execution environment with timeout protection (2500ms max) and memory containment.
   - Strict pattern guards against unauthorized system calls, network access, and file operations.
   - Client never receives hidden test cases or correct solutions.

3. **Gamification & Progression System**
   - **XP Tiering**: 10 XP for Easy, 25 XP for Medium, 50 XP for Hard.
   - **Single-Reward Rule**: XP is awarded strictly once per challenge to eliminate farming.
   - Level progression curve ($L = \lfloor\sqrt{XP / 25}\rfloor + 1$).
   - Achievement Badges: *First Bug Fixed*, *Python Pro*, *JS Wizard*, *C Hacker*, *Java Titan*, *7-Day Streak*, *Debugging Master*.
   - Celebration effects with `canvas-confetti` upon level-up and passing solutions.

4. **Authentication & User Profiles**
   - User registration, login, logout, and password recovery simulation.
   - Role-Based Access Control (Regular User vs. Admin).
   - Profile personalization: custom bio, avatar, GitHub link, preferred language.
   - Interactive charts via Recharts showing daily debugging activity, language mastery distribution, and recent submissions.

5. **Admin Panel**
   - Full CRUD capability for debugging challenges.
   - Configure public and hidden test cases, progressive hints, and starter vs. correct code.
   - Platform analytics: total hunters, overall pass rate, and submission metrics.

6. **n8n AI Copilot Integration**
   - Connected directly to the user's n8n cloud webhook (`https://srikari.app.n8n.cloud/webhook/8ba24de8-31ad-43e4-a4e8-9a740fb0409f/chat`).
   - Floating chat drawer accessible globally from the bottom-right corner and navbar.
   - Context-aware debugging: automatically packages current challenge title, language, user code, and sandbox errors.
   - Toggle support between Production (`/webhook/`) and Test Mode (`/webhook-test/`).

---

## 📁 Project Structure

```
├── database/
│   └── schema.sql              # PostgreSQL DDL table definitions & indexes
├── data/
│   └── bughunt_db.json         # Persistent JSON relational datastore
├── server/
│   ├── db/
│   │   ├── seedData.ts         # 16+ original challenges, test cases & badges
│   │   └── store.ts            # Relational database store with hashing & CRUD
│   ├── sandbox/
│   │   └── runner.ts           # Sandboxed code execution engine (Python, JS, C, Java)
│   └── routes/
│       └── apiRouter.ts        # Express REST API routes (Auth, Arena, Stats, Admin)
├── src/
│   ├── components/             # Reusable UI (Navbar, MonacoEditor, Confetti, etc.)
│   ├── context/                # AuthContext and ThemeContext
│   ├── pages/                  # Landing, Arena, ChallengeDetail, Dashboard, Leaderboard, Admin, Profile
│   ├── services/               # API client
│   ├── types/                  # Shared TypeScript models
│   ├── App.tsx                 # Client routing and layout shell
│   └── main.tsx                # Client entry point
├── server.ts                   # Full-stack server (Express + Vite middleware on Port 3000)
└── package.json
```

---

## 🛠️ Environment Variables

Create a `.env` file in the root directory (refer to `.env.example`):

```bash
PORT=3000
NODE_ENV=development
# Optional: PostgreSQL Database Connection (if using external PostgreSQL instance)
DATABASE_URL="postgresql://postgres:password@localhost:5432/bughunt"
```

---

## 🗄️ Database Setup Instructions

BugHunt supports both the integrated persistent file database (`data/bughunt_db.json`) and standard PostgreSQL:

### Using PostgreSQL (Cloud SQL / Supabase / Local)
1. Ensure PostgreSQL is installed and running (`psql -U postgres`).
2. Create the `bughunt` database:
   ```sql
   CREATE DATABASE bughunt;
   ```
3. Run the schema script located at `database/schema.sql`:
   ```bash
   psql -U postgres -d bughunt -f database/schema.sql
   ```
4. The schema includes tables:
   - `users`
   - `challenges`
   - `test_cases`
   - `submissions`
   - `badges`
   - `user_badges`
   - `daily_activity`

---

## 🧪 Quick Test Credentials

For fast review, use these pre-seeded demo accounts:

| Role | Email | Password |
|---|---|---|
| **Demo User** | `alex@bughunt.dev` | `password123` |
| **Admin** | `admin@bughunt.dev` | `admin123` |
| **Top Player** | `cipher@bughunt.dev` | `password123` |

Or click the **"Quick Demo Login"** buttons directly on the Sign In page!
