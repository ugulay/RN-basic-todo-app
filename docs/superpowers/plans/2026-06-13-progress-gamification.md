# Progress & Gamification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add streak, daily-goal ring, stats screen, achievement badges, and XP/levels to BasicNotes, all driven by one local MMKV progress store.

**Architecture:** A pure logic module (`src/progress.ts`) owns a single `progress` MMKV blob (daily-rollup + aggregates). A `useProgress` hook exposes it live via MMKV change listeners. `useTodos` calls `recordCompletion` on done-toggles. A native-stack adds a Stats screen; the home header shows streak/level/goal-ring.

**Tech Stack:** React Native 0.82, TypeScript, react-native-mmkv v3, @react-navigation/native-stack (already installed), Jest.

**Spec:** `docs/superpowers/specs/2026-06-13-progress-gamification-design.md`

**Test loop:** Debug APK already installed + Metro live on device → JS changes appear via Metro reload (`adb shell input keyevent 82` then Reload, or kill+relaunch). No reinstall (no new native deps).

---

## File Structure

- `src/progress.types.ts` — `Progress`, `DayStat`, `StatsView`, `Badge` types.
- `src/progress.ts` — store (get/save/default), `recordCompletion`, XP/level math, streak recompute, `getStats`, `todayKey`.
- `src/achievements.ts` — badge definitions + `checkBadges`.
- `src/hooks/useProgress.tsx` — MMKV-listener hook.
- `src/components/StreakChip.tsx`, `LevelBadge.tsx`, `DailyGoalRing.tsx`, `BadgeGrid.tsx`, `UnlockToast.tsx`.
- `src/screens/StatsScreen.tsx`.
- `src/hooks/useTodos.tsx` — reserved-key fix + completion calls (modify).
- `src/components/TodoList.tsx` — header + navigation (modify).
- `App.tsx` — native-stack (modify).
- `src/styles.tsx` — new styles (modify).
- `src/translations/en.json`, `tr.json` — new strings (modify).
- `__tests__/progress.test.ts`, `__tests__/achievements.test.ts` — tests.

---

## Task 1: Types + store skeleton

**Files:**
- Create: `src/progress.types.ts`
- Create: `src/progress.ts`
- Create: `__tests__/progress.test.ts`

- [ ] **Step 1: Types**

```ts
// src/progress.types.ts
export interface DayStat { completed: number; goalMet: boolean; }
export interface Progress {
  version: number;
  totalCompleted: number;
  totalXP: number;
  currentStreak: number;
  bestStreak: number;
  lastActiveDay: string | null;
  dailyGoal: number;
  days: Record<string, DayStat>;
  unlockedBadges: string[];
}
export interface StatsView {
  currentStreak: number; bestStreak: number;
  level: number; xp: number; xpIntoLevel: number; xpSpan: number; levelProgress: number;
  totalCompleted: number; dailyGoal: number; todayCompleted: number;
  last7: { key: string; label: string; completed: number; isToday: boolean }[];
  last30Total: number;
  unlockedBadges: string[];
}
export const PROGRESS_KEY = 'progress';
export const DEFAULT_PROGRESS: Progress = {
  version: 1, totalCompleted: 0, totalXP: 0, currentStreak: 0, bestStreak: 0,
  lastActiveDay: null, dailyGoal: 3, days: {}, unlockedBadges: [],
};
```

- [ ] **Step 2: Failing test for default load**

```ts
// __tests__/progress.test.ts
import { MMKV } from 'react-native-mmkv';
jest.mock('react-native-mmkv');
import { getProgress, todayKey } from '../src/progress';

describe('progress store', () => {
  it('returns defaults when empty', () => {
    const p = getProgress();
    expect(p.level ?? 0).toBe(0);
    expect(p.currentStreak).toBe(0);
    expect(p.dailyGoal).toBe(3);
  });
  it('todayKey is YYYY-MM-DD', () => {
    expect(todayKey()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
```

- [ ] **Step 3: Run — expect FAIL** (`yarn jest progress` → "Cannot find module '../src/progress'").

- [ ] **Step 4: Store skeleton**

```ts
// src/progress.ts
import { MMKV } from 'react-native-mmkv';
import { Progress, DEFAULT_PROGRESS, PROGRESS_KEY } from './progress.types';

const storage = new MMKV();

export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getProgress(): Progress {
  try {
    const raw = storage.getString(PROGRESS_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS, days: {} };
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PROGRESS, days: {} };
  }
}

export function saveProgress(p: Progress): void {
  storage.set(PROGRESS_KEY, JSON.stringify(p));
}
```

- [ ] **Step 5: Run — expect PASS.** Commit: `feat(progress): add types + MMKV store skeleton`.

---

## Task 2: XP / level math

**Files:** Modify `src/progress.ts`, `__tests__/progress.test.ts`.

- [ ] **Step 1: Failing tests**

```ts
import { computeLevel, levelBounds } from '../src/progress';
it('levels at thresholds', () => {
  expect(computeLevel(0)).toBe(1);
  expect(computeLevel(99)).toBe(1);
  expect(computeLevel(100)).toBe(2);
  expect(computeLevel(300)).toBe(3);
  expect(computeLevel(600)).toBe(4);
  expect(computeLevel(1000)).toBe(5);
});
it('level bounds give progress fraction', () => {
  const b = levelBounds(150); // level 2 (100..300)
  expect(b.level).toBe(2);
  expect(b.intoLevel).toBe(50);
  expect(b.span).toBe(200);
  expect(b.progress).toBeCloseTo(0.25);
});
```

- [ ] **Step 2: Run — expect FAIL.**

- [ ] **Step 3: Implement**

```ts
// T(L) = 50*L*(L-1) cumulative XP to reach level L
const xpToReach = (L: number) => 50 * L * (L - 1);
export function computeLevel(xp: number): number {
  return Math.max(1, Math.floor((50 + Math.sqrt(2500 + 200 * Math.max(0, xp))) / 100));
}
export function levelBounds(xp: number) {
  const level = computeLevel(xp);
  const start = xpToReach(level), next = xpToReach(level + 1);
  const intoLevel = xp - start, span = next - start;
  return { level, intoLevel, span, progress: span > 0 ? intoLevel / span : 0 };
}
```

- [ ] **Step 4: Run — expect PASS.** Commit: `feat(progress): xp and level math`.

---

## Task 3: recordCompletion + streak recompute

**Files:** Modify `src/progress.ts`, `__tests__/progress.test.ts`.

- [ ] **Step 1: Failing tests**

```ts
import { getProgress, saveProgress, recordCompletion, recomputeStreak } from '../src/progress';
import { DEFAULT_PROGRESS } from '../src/progress.types';

beforeEach(() => saveProgress({ ...DEFAULT_PROGRESS, days: {} }));

it('+1 awards 10 xp and counts today', () => {
  const p = recordCompletion(1, { important: false });
  expect(p.totalXP).toBe(10);
  expect(p.totalCompleted).toBe(1);
  expect(p.currentStreak).toBe(1);
});
it('important adds 5', () => {
  const p = recordCompletion(1, { important: true });
  expect(p.totalXP).toBe(15);
});
it('undo (-1) reverses count + base xp, never below 0', () => {
  recordCompletion(1, { important: false });
  const p = recordCompletion(-1, { important: false });
  expect(p.totalCompleted).toBe(0);
  expect(p.totalXP).toBe(0);
  expect(p.currentStreak).toBe(0);
});
it('perfect-day bonus +20 once when goal hit', () => {
  saveProgress({ ...DEFAULT_PROGRESS, dailyGoal: 2, days: {} });
  recordCompletion(1, { important: false });
  const p = recordCompletion(1, { important: false }); // hits goal=2
  expect(p.days[Object.keys(p.days)[0]].goalMet).toBe(true);
  expect(p.totalXP).toBe(10 + 10 + 20);
});
it('streak counts consecutive days, breaks on gap', () => {
  const p = { ...DEFAULT_PROGRESS, days: {
    '2026-06-10': { completed: 1, goalMet: false },
    '2026-06-11': { completed: 2, goalMet: false },
    // gap 06-12
    '2026-06-13': { completed: 1, goalMet: false },
  }};
  expect(recomputeStreak(p, '2026-06-13')).toBe(1);
  expect(recomputeStreak(p, '2026-06-11')).toBe(2);
});
it('today still 0 preserves yesterday run', () => {
  const p = { ...DEFAULT_PROGRESS, days: {
    '2026-06-12': { completed: 3, goalMet: true },
  }};
  expect(recomputeStreak(p, '2026-06-13')).toBe(1); // counts back from yesterday
});
```

- [ ] **Step 2: Run — expect FAIL.**

- [ ] **Step 3: Implement**

```ts
import { computeLevel } from './progress'; // already in file
const prevDay = (key: string) => {
  const [y, m, d] = key.split('-').map(Number);
  const dt = new Date(y, m - 1, d - 1);
  return todayKey(dt);
};

export function recomputeStreak(p: Progress, today: string): number {
  let cursor = (p.days[today]?.completed ?? 0) > 0 ? today : prevDay(today);
  let streak = 0;
  while ((p.days[cursor]?.completed ?? 0) > 0) { streak++; cursor = prevDay(cursor); }
  return streak;
}

export function recordCompletion(delta: 1 | -1, opts: { important: boolean }): Progress {
  const p = getProgress();
  const key = todayKey();
  const day = p.days[key] ?? { completed: 0, goalMet: false };
  day.completed = Math.max(0, day.completed + delta);

  let xpDelta = delta * (10 + (opts.important ? 5 : 0));
  if (!day.goalMet && day.completed >= p.dailyGoal) { day.goalMet = true; xpDelta += 20; }

  p.days[key] = day;
  p.totalXP = Math.max(0, p.totalXP + xpDelta);
  p.totalCompleted = Math.max(0, p.totalCompleted + delta);
  if (day.completed > 0) p.lastActiveDay = key;
  p.currentStreak = recomputeStreak(p, key);
  p.bestStreak = Math.max(p.bestStreak, p.currentStreak);

  // prune > 90 days
  const cutoff = todayKey(new Date(Date.now() - 90 * 864e5));
  for (const k of Object.keys(p.days)) if (k < cutoff) delete p.days[k];

  saveProgress(p);
  return p;
}
```

- [ ] **Step 4: Run — expect PASS.** Commit: `feat(progress): recordCompletion + forgiving streak`.

---

## Task 4: Achievements

**Files:** Create `src/achievements.ts`, `__tests__/achievements.test.ts`. Modify `src/progress.ts` (call checkBadges in recordCompletion).

- [ ] **Step 1: Failing test**

```ts
// __tests__/achievements.test.ts
import { checkBadges, BADGES } from '../src/achievements';
import { DEFAULT_PROGRESS } from '../src/progress.types';
it('unlocks first_task at 1 completion', () => {
  const got = checkBadges({ ...DEFAULT_PROGRESS, totalCompleted: 1 });
  expect(got).toContain('first_task');
});
it('does not re-report already unlocked', () => {
  const got = checkBadges({ ...DEFAULT_PROGRESS, totalCompleted: 1, unlockedBadges: ['first_task'] });
  expect(got).not.toContain('first_task');
});
it('streak_7 at bestStreak 7', () => {
  expect(checkBadges({ ...DEFAULT_PROGRESS, bestStreak: 7 })).toContain('streak_7');
});
```

- [ ] **Step 2: Run — expect FAIL.**

- [ ] **Step 3: Implement**

```ts
// src/achievements.ts
import { Progress } from './progress.types';
import { computeLevel } from './progress';
export interface Badge { id: string; icon: string; test: (p: Progress) => boolean; }
const anyDay = (p: Progress, f: (d: { completed: number; goalMet: boolean }) => boolean) =>
  Object.values(p.days).some(f);
export const BADGES: Badge[] = [
  { id: 'first_task',     icon: '🎯', test: p => p.totalCompleted >= 1 },
  { id: 'perfect_day',    icon: '⭐', test: p => anyDay(p, d => d.goalMet) },
  { id: 'streak_7',       icon: '🔥', test: p => p.bestStreak >= 7 },
  { id: 'completed_100',  icon: '💯', test: p => p.totalCompleted >= 100 },
  { id: 'level_5',        icon: '🏆', test: p => computeLevel(p.totalXP) >= 5 },
  { id: 'streak_30',      icon: '📅', test: p => p.bestStreak >= 30 },
  { id: 'completed_500',  icon: '🌟', test: p => p.totalCompleted >= 500 },
  { id: 'busy_bee',       icon: '⚡', test: p => anyDay(p, d => d.completed >= 10) },
];
export function checkBadges(p: Progress): string[] {
  return BADGES.filter(b => b.test(p) && !p.unlockedBadges.includes(b.id)).map(b => b.id);
}
```

- [ ] **Step 4:** In `recordCompletion`, before `saveProgress(p)`:
```ts
const newly = checkBadges(p);
if (newly.length) p.unlockedBadges = [...p.unlockedBadges, ...newly];
(p as any)._newlyUnlocked = newly; // transient, for toast; not persisted meaningfully
```

- [ ] **Step 5: Run — expect PASS.** Commit: `feat(progress): achievement badges`.

---

## Task 5: getStats derived view

**Files:** Modify `src/progress.ts`, `__tests__/progress.test.ts`.

- [ ] **Step 1: Failing test**

```ts
import { getStats } from '../src/progress';
it('getStats returns 7 days ending today', () => {
  const s = getStats();
  expect(s.last7).toHaveLength(7);
  expect(s.last7[6].isToday).toBe(true);
  expect(s.dailyGoal).toBe(3);
});
```

- [ ] **Step 2: Run — expect FAIL.**

- [ ] **Step 3: Implement** (weekday labels localized later; use index for now)

```ts
import { StatsView } from './progress.types';
const DOW = ['Pz','Pt','Sa','Ça','Pe','Cu','Ct']; // Sun..Sat (tr); replaced via i18n in UI
export function getStats(): StatsView {
  const p = getProgress();
  const lb = levelBounds(p.totalXP);
  const today = todayKey();
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const dt = new Date(); dt.setDate(dt.getDate() - (6 - i));
    const key = todayKey(dt);
    return { key, label: DOW[dt.getDay()], completed: p.days[key]?.completed ?? 0, isToday: key === today };
  });
  const last30Total = Array.from({ length: 30 }, (_, i) => {
    const dt = new Date(); dt.setDate(dt.getDate() - i);
    return p.days[todayKey(dt)]?.completed ?? 0;
  }).reduce((a, b) => a + b, 0);
  return {
    currentStreak: p.currentStreak, bestStreak: p.bestStreak,
    level: lb.level, xp: p.totalXP, xpIntoLevel: lb.intoLevel, xpSpan: lb.span, levelProgress: lb.progress,
    totalCompleted: p.totalCompleted, dailyGoal: p.dailyGoal, todayCompleted: p.days[today]?.completed ?? 0,
    last7, last30Total, unlockedBadges: p.unlockedBadges,
  };
}
export function setDailyGoal(n: number): Progress {
  const p = getProgress(); p.dailyGoal = Math.min(20, Math.max(1, n));
  // re-evaluate today's goalMet
  const key = todayKey(); const d = p.days[key];
  if (d && !d.goalMet && d.completed >= p.dailyGoal) { d.goalMet = true; p.totalXP += 20; }
  saveProgress(p); return p;
}
```

- [ ] **Step 4: Run — expect PASS.** Commit: `feat(progress): stats view + setDailyGoal`.

---

## Task 6: useProgress hook

**Files:** Create `src/hooks/useProgress.tsx`.

- [ ] **Step 1: Implement** (MMKV listener → re-read on change)

```tsx
import { useEffect, useState, useCallback } from 'react';
import { MMKV } from 'react-native-mmkv';
import { getProgress, getStats, setDailyGoal as _setGoal } from '../progress';
import { PROGRESS_KEY } from '../progress.types';

const storage = new MMKV();
export const useProgress = () => {
  const [progress, setProgress] = useState(getProgress());
  const [stats, setStats] = useState(getStats());
  const refresh = useCallback(() => { setProgress(getProgress()); setStats(getStats()); }, []);
  useEffect(() => {
    const sub = storage.addOnValueChangedListener(key => { if (key === PROGRESS_KEY) refresh(); });
    return () => sub.remove();
  }, [refresh]);
  const setDailyGoal = useCallback((n: number) => { _setGoal(n); refresh(); }, [refresh]);
  return { progress, stats, refresh, setDailyGoal };
};
```

- [ ] **Step 2: Commit:** `feat(progress): useProgress hook`.

---

## Task 7: useTodos integration

**Files:** Modify `src/hooks/useTodos.tsx`.

- [ ] **Step 1: Reserved-key fix** — replace the filter in `loadNotes`:
```ts
const RESERVED = (k: string) => k.startsWith('reminder-') || k === 'progress';
const todoKeys = allKeys.filter(k => !RESERVED(k));
```

- [ ] **Step 2: Import** `import { recordCompletion } from '../progress';`

- [ ] **Step 3: `handleToggleDone`** — after computing `updatedTask`:
```ts
if (!task.done && updatedTask.done) recordCompletion(1, { important: task.isImportant });
else if (task.done && !updatedTask.done) recordCompletion(-1, { important: task.isImportant });
```

- [ ] **Step 4: `toggleDoneSelected`** — inside the forEach, only when status actually flips:
```ts
if (task.done !== newDoneStatus) recordCompletion(newDoneStatus ? 1 : -1, { important: task.isImportant });
```

- [ ] **Step 5: Manual verify** (covered by device test in Task 12). Commit: `feat(todos): record completions into progress store`.

---

## Task 8: UI components + styles

**Files:** Create `src/components/StreakChip.tsx`, `LevelBadge.tsx`, `DailyGoalRing.tsx`, `BadgeGrid.tsx`, `UnlockToast.tsx`. Modify `src/styles.tsx`.

- [ ] **Step 1: DailyGoalRing** (conic ring via two stacked Views; RN has no conic — use react-native-svg? NOT installed. Use a simple ring: a circular track View + a label; fill shown as a thin arc is complex without svg, so use a 2-segment approach: background circle + a `borderColor` trick is unreliable. Decision: render a circle with the fraction as `done/goal` text inside a teal-bordered circle whose `borderColor` is teal when goal met, surface otherwise, plus a thin linear progress bar under it.)

```tsx
// src/components/DailyGoalRing.tsx
import React from 'react';
import { View, Text } from 'react-native';
import styles, { Colors } from '../styles';
export default function DailyGoalRing({ done, goal }: { done: number; goal: number }) {
  const met = done >= goal;
  const pct = Math.min(1, goal > 0 ? done / goal : 0);
  return (
    <View style={styles.goalRingWrap}>
      <View style={[styles.goalRing, met && { borderColor: Colors.secondary }]}>
        <Text style={styles.goalRingText}>{done}/{goal}</Text>
      </View>
      <View style={styles.goalRingTrack}><View style={[styles.goalRingFill, { width: `${pct * 100}%` }]} /></View>
    </View>
  );
}
```

- [ ] **Step 2: StreakChip / LevelBadge**

```tsx
// StreakChip.tsx
import React from 'react'; import { View, Text } from 'react-native'; import styles from '../styles';
export default function StreakChip({ streak }: { streak: number }) {
  return <View style={styles.streakChip}><Text style={styles.streakFlame}>🔥</Text><Text style={styles.streakNum}>{streak}</Text></View>;
}
// LevelBadge.tsx
import React from 'react'; import { Text } from 'react-native'; import styles from '../styles'; import i18n from '../i18n';
export default function LevelBadge({ level }: { level: number }) {
  return <Text style={styles.levelBadge}>{i18n.t('level_short', { n: level })}</Text>;
}
```

- [ ] **Step 3: BadgeGrid** — renders all `BADGES`, colored if in `unlocked`, else greyscale/opacity.

```tsx
// BadgeGrid.tsx
import React from 'react'; import { View, Text } from 'react-native';
import { BADGES } from '../achievements'; import styles from '../styles';
export default function BadgeGrid({ unlocked }: { unlocked: string[] }) {
  return (
    <View style={styles.badgeGrid}>
      {BADGES.map(b => {
        const on = unlocked.includes(b.id);
        return <Text key={b.id} style={[styles.badgeIcon, !on && styles.badgeLocked]}>{b.icon}</Text>;
      })}
    </View>
  );
}
```

- [ ] **Step 4: UnlockToast** — an absolutely-positioned animated `View` (Animated.timing fade/slide) shown when a new badge unlocks; auto-hides after 2.5s. Props `{ badgeId | null, onHide }`.

- [ ] **Step 5: styles** — add to `src/styles.tsx`: `streakChip, streakFlame, streakNum, levelBadge, goalRingWrap, goalRing, goalRingText, goalRingTrack, goalRingFill, badgeGrid, badgeIcon, badgeLocked, statsScreen, statCard, statBig, statLabel, xpBarTrack, xpBarFill, chartRow, chartBar, chartLabel, goalStepper, stepBtn, unlockToast`. Colors reused from existing palette.

- [ ] **Step 6: Commit:** `feat(ui): progress components + styles`.

---

## Task 9: StatsScreen

**Files:** Create `src/screens/StatsScreen.tsx`.

- [ ] **Step 1: Implement** — consumes `useProgress()`. Layout per mockup: header w/ back, streak card (current + best), level card (XP bar via `levelProgress`), "last 7 days" bar chart (`last7`, bars scaled to max), `BadgeGrid`, daily-goal stepper (`− goal +` calling `setDailyGoal`). All strings via `i18n.t`. Scroll in a `ScrollView`.

- [ ] **Step 2: Commit:** `feat(ui): stats screen`.

---

## Task 10: Navigation + header wiring

**Files:** Modify `App.tsx`, `src/components/TodoList.tsx`.

- [ ] **Step 1: App.tsx** — add stack:
```tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
// inside NavigationContainer:
<Stack.Navigator screenOptions={{ headerShown: false }}>
  <Stack.Screen name="Home" component={TodoList} />
  <Stack.Screen name="Stats" component={StatsScreen} />
</Stack.Navigator>
```

- [ ] **Step 2: TodoList header** — use `useProgress()` for `stats.currentStreak`, `stats.level`, `stats.todayCompleted`, `stats.dailyGoal`. In `renderHeader`, add a top row: `<StreakChip>` left; right side `<LevelBadge>` + a 📊 `TouchableOpacity` calling `navigation.navigate('Stats')` (accept `navigation` via `useNavigation()`). Replace the old per-list progress bar with `<DailyGoalRing done={stats.todayCompleted} goal={stats.dailyGoal} />` in the title row. Keep title + subtitle.

- [ ] **Step 3: UnlockToast wiring** — TodoList reads `progress` for newly-unlocked (or a ref of previous unlocked length) and shows `<UnlockToast>` when the set grows.

- [ ] **Step 4: Commit:** `feat: wire navigation + gamified header`.

---

## Task 11: i18n strings

**Files:** Modify `src/translations/en.json`, `src/translations/tr.json`.

- [ ] **Step 1:** Add keys (both files): `stats_title, streak, best_streak, level_short ("Lv {{n}}" / "Sv {{n}}"), level, xp_progress ("{{into}}/{{span}} XP"), last_7_days, last_30_days, badges, badges_count ("{{n}}/{{total}}"), daily_goal, goal_ring_label, no_tasks_yet (exists), badge names (badge_first_task, badge_perfect_day, …), unlocked_badge ("Yeni rozet! {{name}}")`. Weekday short labels `dow_0..dow_6`.

- [ ] **Step 2: Commit:** `i18n: progress + stats strings (en, tr)`.

---

## Task 12: Build, reload, device test

- [ ] **Step 1:** `yarn jest` — all green.
- [ ] **Step 2:** Metro is live; reload JS on device: `adb shell input keyevent 82` (dev menu) → Reload, or `adb shell am force-stop com.basicnotes && adb shell monkey -p com.basicnotes -c android.intent.category.LAUNCHER 1`.
- [ ] **Step 3:** Manual device checks: add tasks; complete one → streak 1, ring fills, XP up; hit goal → ring "met" + perfect-day; open Stats (📊) → streak/level/chart/badges; first completion → `first_task` toast; change goal stepper; undo a completion → counts drop. Screencap to confirm.
- [ ] **Step 4: Commit** any fixes from device testing.

---

## Self-Review

- **Spec coverage:** streak (T3) ✓, daily goal ring (T8/T10) ✓, stats screen (T9) ✓, badges (T4/T8) ✓, XP/levels (T2) ✓, reserved-key fix (T7) ✓, completion choke point (T7) ✓, no-revoke-on-delete (T7: delete paths untouched) ✓, no retro-credit (default start) ✓, MMKV listener (T6) ✓, navigation (T10) ✓, error/default (T1) ✓, tests (T1–5) ✓, i18n (T11) ✓.
- **Placeholders:** none — code shown for every logic step. UI styles enumerated in T8 Step 5; StatsScreen layout fully specified by mockup + props.
- **Type consistency:** `recordCompletion(delta, {important})`, `getStats(): StatsView`, `levelBounds().progress`, `setDailyGoal(n)`, `checkBadges(p): string[]`, `BADGES[].icon` — names consistent across tasks.
- **Note:** `DailyGoalRing` uses a circle+linear-bar (no `react-native-svg` dependency) instead of a true conic ring — visually close to the mockup, zero new deps (consistent with "no new native deps").
