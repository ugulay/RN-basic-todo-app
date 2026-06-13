import { checkBadges, BADGES } from '../src/achievements';
import { DEFAULT_PROGRESS, Progress } from '../src/progress.types';

const fresh = (over: Partial<Progress> = {}): Progress => ({
  ...DEFAULT_PROGRESS,
  days: {},
  unlockedBadges: [],
  ...over,
});

describe('achievements', () => {
  it('has 8 badges with unique ids + icons', () => {
    expect(BADGES).toHaveLength(8);
    expect(new Set(BADGES.map(b => b.id)).size).toBe(8);
  });
  it('unlocks first_task at 1 completion', () => {
    expect(checkBadges(fresh({ totalCompleted: 1 }))).toContain('first_task');
  });
  it('does not re-report already unlocked', () => {
    const got = checkBadges(
      fresh({ totalCompleted: 1, unlockedBadges: ['first_task'] }),
    );
    expect(got).not.toContain('first_task');
  });
  it('streak_7 at bestStreak 7', () => {
    expect(checkBadges(fresh({ bestStreak: 7 }))).toContain('streak_7');
  });
  it('level_5 at 1000 xp', () => {
    expect(checkBadges(fresh({ totalXP: 1000 }))).toContain('level_5');
  });
  it('perfect_day when a day goalMet', () => {
    const got = checkBadges(
      fresh({ days: { '2026-06-13': { completed: 3, goalMet: true } } }),
    );
    expect(got).toContain('perfect_day');
  });
  it('busy_bee at 10 in a day', () => {
    const got = checkBadges(
      fresh({ days: { '2026-06-13': { completed: 10, goalMet: true } } }),
    );
    expect(got).toContain('busy_bee');
  });
});
