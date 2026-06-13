import { MMKV } from 'react-native-mmkv';
import {
  Progress,
  StatsView,
  DEFAULT_PROGRESS,
  PROGRESS_KEY,
} from './progress.types';
import { checkBadges } from './achievements';

// Exported so useProgress can subscribe to changes on the SAME instance
// (react-native-mmkv listeners fire for writes made through that instance).
export const storage = new MMKV();

/** Local-time 'YYYY-MM-DD' for a given date (default: now). */
export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function prevDay(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  return todayKey(new Date(y, m - 1, d - 1));
}

export function getProgress(): Progress {
  try {
    const raw = storage.getString(PROGRESS_KEY);
    if (!raw) {
      return { ...DEFAULT_PROGRESS, days: {}, unlockedBadges: [] };
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      days: parsed.days ?? {},
      unlockedBadges: parsed.unlockedBadges ?? [],
    };
  } catch {
    return { ...DEFAULT_PROGRESS, days: {}, unlockedBadges: [] };
  }
}

export function saveProgress(p: Progress): void {
  storage.set(PROGRESS_KEY, JSON.stringify(p));
}

// Cumulative XP required to reach level L: T(L) = 50 * L * (L - 1)
// L1=0, L2=100, L3=300, L4=600, L5=1000, ...
const xpToReach = (L: number) => 50 * L * (L - 1);

export function computeLevel(xp: number): number {
  return Math.max(
    1,
    Math.floor((50 + Math.sqrt(2500 + 200 * Math.max(0, xp))) / 100),
  );
}

export function levelBounds(xp: number) {
  const level = computeLevel(xp);
  const start = xpToReach(level);
  const next = xpToReach(level + 1);
  const intoLevel = xp - start;
  const span = next - start;
  return { level, intoLevel, span, progress: span > 0 ? intoLevel / span : 0 };
}

/** Forgiving streak: consecutive days (walking back from today, or yesterday
 *  if today is still empty) where completed > 0. Recomputed from the log so
 *  undo and day-gaps never drift. */
export function recomputeStreak(p: Progress, today: string): number {
  let cursor = (p.days[today]?.completed ?? 0) > 0 ? today : prevDay(today);
  let streak = 0;
  while ((p.days[cursor]?.completed ?? 0) > 0) {
    streak++;
    cursor = prevDay(cursor);
  }
  return streak;
}

export function recordCompletion(
  delta: 1 | -1,
  opts: { important: boolean },
): Progress {
  const p = getProgress();
  const key = todayKey();
  const day = p.days[key] ?? { completed: 0, goalMet: false };
  day.completed = Math.max(0, day.completed + delta);

  let xpDelta = delta * (10 + (opts.important ? 5 : 0));
  if (!day.goalMet && day.completed >= p.dailyGoal) {
    day.goalMet = true; // perfect-day bonus, awarded once/day, never revoked
    xpDelta += 20;
  }

  p.days[key] = day;
  p.totalXP = Math.max(0, p.totalXP + xpDelta);
  p.totalCompleted = Math.max(0, p.totalCompleted + delta);
  if (day.completed > 0) {
    p.lastActiveDay = key;
  }
  p.currentStreak = recomputeStreak(p, key);
  p.bestStreak = Math.max(p.bestStreak, p.currentStreak);

  // prune entries older than 90 days (aggregates are kept)
  const cutoff = todayKey(new Date(Date.now() - 90 * 86400000));
  for (const k of Object.keys(p.days)) {
    if (k < cutoff) {
      delete p.days[k];
    }
  }

  const newly = checkBadges(p);
  if (newly.length) {
    p.unlockedBadges = [...p.unlockedBadges, ...newly];
  }

  saveProgress(p);
  return p;
}

export function setDailyGoal(n: number): Progress {
  const p = getProgress();
  p.dailyGoal = Math.min(20, Math.max(1, Math.round(n)));
  const key = todayKey();
  const d = p.days[key];
  if (d && !d.goalMet && d.completed >= p.dailyGoal) {
    d.goalMet = true;
    p.totalXP += 20;
    saveProgress(p);
  } else {
    saveProgress(p);
  }
  return p;
}

export function getStats(): StatsView {
  const p = getProgress();
  const lb = levelBounds(p.totalXP);
  const today = todayKey();

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const dt = new Date();
    dt.setDate(dt.getDate() - (6 - i));
    const key = todayKey(dt);
    return {
      key,
      dow: dt.getDay(),
      completed: p.days[key]?.completed ?? 0,
      isToday: key === today,
    };
  });

  const last30Total = Array.from({ length: 30 }, (_, i) => {
    const dt = new Date();
    dt.setDate(dt.getDate() - i);
    return p.days[todayKey(dt)]?.completed ?? 0;
  }).reduce((a, b) => a + b, 0);

  return {
    currentStreak: p.currentStreak,
    bestStreak: p.bestStreak,
    level: lb.level,
    xp: p.totalXP,
    xpIntoLevel: lb.intoLevel,
    xpSpan: lb.span,
    levelProgress: lb.progress,
    totalCompleted: p.totalCompleted,
    dailyGoal: p.dailyGoal,
    todayCompleted: p.days[today]?.completed ?? 0,
    last7,
    last30Total,
    unlockedBadges: p.unlockedBadges,
  };
}
