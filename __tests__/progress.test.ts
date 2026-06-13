import {
  getProgress,
  saveProgress,
  recordCompletion,
  recomputeStreak,
  computeLevel,
  levelBounds,
  getStats,
  setDailyGoal,
  todayKey,
} from '../src/progress';
import { DEFAULT_PROGRESS, Progress } from '../src/progress.types';

const fresh = (over: Partial<Progress> = {}): Progress => ({
  ...DEFAULT_PROGRESS,
  days: {},
  unlockedBadges: [],
  ...over,
});

beforeEach(() => saveProgress(fresh()));

describe('store + dates', () => {
  it('returns defaults', () => {
    const p = getProgress();
    expect(p.currentStreak).toBe(0);
    expect(p.dailyGoal).toBe(3);
    expect(p.totalXP).toBe(0);
  });
  it('todayKey is YYYY-MM-DD', () => {
    expect(todayKey()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(todayKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});

describe('xp + levels', () => {
  it('levels at thresholds', () => {
    expect(computeLevel(0)).toBe(1);
    expect(computeLevel(99)).toBe(1);
    expect(computeLevel(100)).toBe(2);
    expect(computeLevel(300)).toBe(3);
    expect(computeLevel(600)).toBe(4);
    expect(computeLevel(1000)).toBe(5);
  });
  it('level bounds give progress fraction', () => {
    const b = levelBounds(150); // level 2 spans 100..300
    expect(b.level).toBe(2);
    expect(b.intoLevel).toBe(50);
    expect(b.span).toBe(200);
    expect(b.progress).toBeCloseTo(0.25);
  });
});

describe('recordCompletion', () => {
  it('+1 awards 10 xp, counts today, streak 1', () => {
    const p = recordCompletion(1, { important: false });
    expect(p.totalXP).toBe(10);
    expect(p.totalCompleted).toBe(1);
    expect(p.currentStreak).toBe(1);
  });
  it('important adds 5', () => {
    expect(recordCompletion(1, { important: true }).totalXP).toBe(15);
  });
  it('undo reverses count + base xp, never below 0', () => {
    recordCompletion(1, { important: false });
    const p = recordCompletion(-1, { important: false });
    expect(p.totalCompleted).toBe(0);
    expect(p.totalXP).toBe(0);
    expect(p.currentStreak).toBe(0);
  });
  it('perfect-day bonus +20 once when goal hit', () => {
    saveProgress(fresh({ dailyGoal: 2 }));
    recordCompletion(1, { important: false });
    const p = recordCompletion(1, { important: false }); // reaches goal=2
    const day = p.days[todayKey()];
    expect(day.goalMet).toBe(true);
    expect(p.totalXP).toBe(10 + 10 + 20);
  });
  it('perfect-day bonus kept after undo below goal', () => {
    saveProgress(fresh({ dailyGoal: 2 }));
    recordCompletion(1, { important: false });
    recordCompletion(1, { important: false }); // goal met, +20
    const p = recordCompletion(-1, { important: false });
    expect(p.totalXP).toBe(10 + 10 + 20 - 10); // base 10 reversed, bonus kept
    expect(p.days[todayKey()].goalMet).toBe(true);
  });
});

describe('streak recompute', () => {
  it('counts consecutive days, breaks on gap', () => {
    const p = fresh({
      days: {
        '2026-06-10': { completed: 1, goalMet: false },
        '2026-06-11': { completed: 2, goalMet: false },
        '2026-06-13': { completed: 1, goalMet: false },
      },
    });
    expect(recomputeStreak(p, '2026-06-13')).toBe(1);
    expect(recomputeStreak(p, '2026-06-11')).toBe(2);
  });
  it('today still 0 preserves yesterday run', () => {
    const p = fresh({ days: { '2026-06-12': { completed: 3, goalMet: true } } });
    expect(recomputeStreak(p, '2026-06-13')).toBe(1);
  });
  it('crosses month boundary', () => {
    const p = fresh({
      days: {
        '2026-05-31': { completed: 1, goalMet: false },
        '2026-06-01': { completed: 1, goalMet: false },
      },
    });
    expect(recomputeStreak(p, '2026-06-01')).toBe(2);
  });
});

describe('getStats + setDailyGoal', () => {
  it('returns 7 days ending today', () => {
    const s = getStats();
    expect(s.last7).toHaveLength(7);
    expect(s.last7[6].isToday).toBe(true);
    expect(s.dailyGoal).toBe(3);
  });
  it('setDailyGoal clamps 1..20', () => {
    expect(setDailyGoal(0).dailyGoal).toBe(1);
    expect(setDailyGoal(99).dailyGoal).toBe(20);
    expect(setDailyGoal(5).dailyGoal).toBe(5);
  });
});
