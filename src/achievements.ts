import { Progress, DayStat } from './progress.types';
import { computeLevel } from './progress';

export interface Badge {
  id: string;
  icon: string;
  test: (p: Progress) => boolean;
}

const anyDay = (p: Progress, f: (d: DayStat) => boolean) =>
  Object.values(p.days).some(f);

export const BADGES: Badge[] = [
  { id: 'first_task', icon: '🎯', test: p => p.totalCompleted >= 1 },
  { id: 'perfect_day', icon: '⭐', test: p => anyDay(p, d => d.goalMet) },
  { id: 'streak_7', icon: '🔥', test: p => p.bestStreak >= 7 },
  { id: 'completed_100', icon: '💯', test: p => p.totalCompleted >= 100 },
  { id: 'level_5', icon: '🏆', test: p => computeLevel(p.totalXP) >= 5 },
  { id: 'streak_30', icon: '📅', test: p => p.bestStreak >= 30 },
  { id: 'completed_500', icon: '🌟', test: p => p.totalCompleted >= 500 },
  { id: 'busy_bee', icon: '⚡', test: p => anyDay(p, d => d.completed >= 10) },
];

/** Returns ids of badges newly satisfied but not yet in unlockedBadges. */
export function checkBadges(p: Progress): string[] {
  return BADGES.filter(b => b.test(p) && !p.unlockedBadges.includes(b.id)).map(
    b => b.id,
  );
}
