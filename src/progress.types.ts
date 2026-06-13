export interface DayStat {
  completed: number;
  goalMet: boolean;
}

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

export interface Last7Item {
  key: string;
  dow: number; // 0 (Sun) .. 6 (Sat)
  completed: number;
  isToday: boolean;
}

export interface StatsView {
  currentStreak: number;
  bestStreak: number;
  level: number;
  xp: number;
  xpIntoLevel: number;
  xpSpan: number;
  levelProgress: number; // 0..1
  totalCompleted: number;
  dailyGoal: number;
  todayCompleted: number;
  last7: Last7Item[];
  last30Total: number;
  unlockedBadges: string[];
}

export const PROGRESS_KEY = 'progress';

export const DEFAULT_PROGRESS: Progress = {
  version: 1,
  totalCompleted: 0,
  totalXP: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastActiveDay: null,
  dailyGoal: 3,
  days: {},
  unlockedBadges: [],
};
