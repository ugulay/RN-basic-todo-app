# BasicNotes — Progress & Gamification (v1)

**Date:** 2026-06-13
**Status:** Approved design, pending implementation plan
**App:** BasicNotes (`com.basicnotes`), React Native 0.82, offline/local (MMKV), no backend/accounts.

## Goal

Make the todo app more engaging along two directions the user chose: **daily habit** and **progress/mastery**. The honest, non-manipulative kind of "addictive": rewarding to return to, satisfying to make progress in. No dark patterns, no pressure mechanics, no accounts, stays 100% offline.

## Scope

### In (v1)
1. **Streak counter** — consecutive active days, shown in the home header (🔥).
2. **Daily goal ring** — today's completions vs a target, in the header.
3. **Stats screen** — second screen: streak, level/XP, last-7/30-day chart, badges, goal setting.
4. **Achievement badges** — 8 milestone unlocks, shown on the stats screen.
5. **XP & levels** — points per completed task → level, with a progress bar.

### Out (v2+, explicitly deferred)
- **Daily reminder notifications** — highest retention value but needs a new native dependency (Android notifications; existing `push-notification-ios` is iOS-only). Deferred to keep v1 dependency-free.
- **Configurable streak rule** — v1 ships the forgiving rule only (below).
- Cloud sync / cross-device, social/leaderboards, sound effects, confetti (the "delight" direction was not chosen).

## Key decisions

| Decision | Choice | Rationale |
|---|---|---|
| Streak rule | **Forgiving**: a day counts if ≥1 task completed | Habit-building over pressure; one busy day won't nuke a long streak |
| Daily goal | Stretch target, default **3**, editable 1–20 | Hitting it = "perfect day" bonus + badge, but NOT required for streak |
| Storage | Single MMKV key `progress` (blob), Approach A | One read/write, no `getAllKeys` pollution, undo-safe, easy chart queries |
| Deleting a completed task | Does **not** revoke earned XP/streak | History is sacred — you did complete it |
| Pre-existing done tasks | **No** retro-credit (no timestamps exist) | Everyone starts streak 0; one-time, documented |
| Live UI refresh | MMKV value-changed listener (`useProgress`) | `useTodos` writes, header + stats auto-update; no prop-drilling |

## Data model

Stored under the single MMKV key `progress` as JSON:

```ts
interface Progress {
  version: number;                 // schema version, starts at 1
  totalCompleted: number;          // lifetime completed count
  totalXP: number;
  currentStreak: number;           // cached, recomputed from `days`
  bestStreak: number;
  lastActiveDay: string | null;    // 'YYYY-MM-DD' local
  dailyGoal: number;               // default 3
  days: Record<string, DayStat>;   // key 'YYYY-MM-DD' local
  unlockedBadges: string[];        // badge ids
}

interface DayStat { completed: number; goalMet: boolean; }
```

Size: ~30 bytes/day → ~11 KB/year. Prune entries older than 90 days lazily on write (chart never needs more than 30; streak only needs the contiguous tail). `totalCompleted`/`totalXP`/`bestStreak` are lifetime aggregates and survive pruning.

### Reserved-key safety
`useTodos.loadNotes()` currently does:
```ts
const todoKeys = allKeys.filter(key => !key.startsWith('reminder-'));
```
then `JSON.parse`s **every** remaining key as a `Task`. The new `progress` key must be excluded or it corrupts the list. Fix:
```ts
const RESERVED = (k: string) => k.startsWith('reminder-') || k === 'progress';
const todoKeys = allKeys.filter(k => !RESERVED(k));
```

## Logic module — `src/progress.ts`

Pure, testable functions over the store. No React.

```ts
getProgress(): Progress                       // load or default
saveProgress(p: Progress): void
recordCompletion(delta: 1 | -1, opts: { important: boolean }): Progress
computeLevel(xp: number): number
levelBounds(xp): { level, intoLevel, span, progress } // for the XP bar
checkBadges(p: Progress): string[]            // returns newly unlocked ids
getStats(): StatsView                         // derived view for the screen
todayKey(): string                            // 'YYYY-MM-DD' local
```

### XP & levels
- Per completed task: **+10 XP**, **+5** if the task is important.
- **Perfect-day bonus: +20 XP** the moment today's `completed` first reaches `dailyGoal` (guarded by `goalMet` so it awards once/day).
- Cumulative XP to reach level L: `T(L) = 50·L·(L−1)` → L1=0, L2=100, L3=300, L4=600, L5=1000, …
- `computeLevel(xp) = max(1, floor((50 + sqrt(2500 + 200·xp)) / 100))`.
- XP bar uses `T(level)` … `T(level+1)`.

### Streak (forgiving), recomputed from the log
`currentStreak` = count of consecutive days, walking back from **today**, where `days[date].completed > 0`. If today is still 0, start the walk from **yesterday** (streak is preserved until the day ends). `bestStreak = max(bestStreak, currentStreak)` after every change. Recomputing from `days` (instead of incrementing) makes undo and day-gaps drift-proof.

### recordCompletion flow
1. `d = days[today] ?? {completed:0, goalMet:false}`.
2. `d.completed = max(0, d.completed + delta)`.
3. XP: `totalXP += delta * (10 + (important?5:0))`. On reaching goal with `!goalMet` → `goalMet=true`, `totalXP += 20`. (Undo below goal does not strip the perfect-day bonus — once earned, kept.)
4. `totalCompleted = max(0, totalCompleted + delta)`.
5. Write `days[today]=d`, set `lastActiveDay=today` if `d.completed>0`.
6. Recompute `currentStreak`, update `bestStreak`.
7. `checkBadges`; append new ids; save. Return new progress (+ newly-unlocked ids for the toast).

## Integration with `useTodos`

- `handleToggleDone(id)`: detect transition. `false→true` → `recordCompletion(+1, {important})`; `true→false` → `recordCompletion(-1, {important})`.
- `toggleDoneSelected()`: it sets one `newDoneStatus` for all selected — call `recordCompletion` once per task whose `done` actually changes (net transitions only).
- `handleDeleteTask` / `deleteSelected`: **no** progress change (history sacred).
- All completion writes go through `recordCompletion` — single choke point, no double counting.

## Navigation

`App.tsx` gains a `native-stack` (`@react-navigation/native-stack`, already installed) inside the existing `NavigationContainer`:
- **Home** — `TodoList` (header gains 🔥 streak chip, `Lv` badge, 📊 stats icon → navigates to Stats; title row gains the daily-goal ring).
- **Stats** — `StatsScreen` (back nav).

`useProgress` reads `progress` + subscribes to MMKV change events so both screens stay live.

## UI

Mockups approved (saved in `.superpowers/brainstorm/`). Summary:

**Home header** — Row 1: `🔥 12` chip (left), `Lv 4` badge + 📊 icon (right). Row 2: title "Görevlerim" + a 58px conic-gradient **goal ring** (`3/5`). Existing filters / task cards / FAB unchanged. The old per-list progress bar is replaced by the goal ring (today's completions, more habit-relevant).

**Stats screen** — streak card (current + best), level card (XP bar), "Son 7 gün" bar chart (with a 30-day toggle), badge grid (unlocked colored / locked greyed, `n/8`), daily-goal stepper (`− 3 +`). Colors from `src/styles.tsx` (`#121212` bg, `#282828` surface, `#03DAC6` teal, `#BB86FC` purple, `#FFD700` gold).

## Badges (8, all derivable from `Progress`)

| id | icon | unlock condition |
|---|---|---|
| `first_task` | 🎯 | `totalCompleted ≥ 1` |
| `perfect_day` | ⭐ | any `days[*].goalMet` |
| `streak_7` | 🔥 | `bestStreak ≥ 7` |
| `completed_100` | 💯 | `totalCompleted ≥ 100` |
| `level_5` | 🏆 | `computeLevel(totalXP) ≥ 5` |
| `streak_30` | 📅 | `bestStreak ≥ 30` |
| `completed_500` | 🌟 | `totalCompleted ≥ 500` |
| `busy_bee` | ⚡ | any `days[*].completed ≥ 10` |

`checkBadges` runs after each completion; a small in-app toast announces a new unlock (no new dep — a simple animated `View`).

## Error handling & migration

- `getProgress` wraps `JSON.parse` in try/catch → returns a fresh default on corruption (the task list must never crash on bad progress data).
- New users / first run → default `Progress` (streak 0, level 1, goal 3).
- `version` field present for future migrations; v1 has no prior schema.
- Dates are **local** `YYYY-MM-DD` (a task done 23:59 counts today; 00:01 counts the next day).

## Testing

Jest is configured. Unit-test `src/progress.ts` (mock MMKV):
- streak: consecutive days, gap resets, undo-to-0 shrinks correctly, today-still-0 preserves yesterday's run.
- XP/level math at boundaries (0, 99, 100, 600, 1000).
- perfect-day bonus awards once; undo keeps it.
- badge thresholds (each id at its boundary).
- `recordCompletion` idempotency under repeated toggles and bulk transitions.

Lighter component smoke tests for `DailyGoalRing`, `StreakChip`, `StatsScreen`.

## File plan

**New**
- `src/progress.ts` — store + logic
- `src/progress.types.ts` — `Progress`, `DayStat`, `StatsView` (or inline in progress.ts)
- `src/achievements.ts` — badge definitions + `checkBadges`
- `src/hooks/useProgress.tsx` — MMKV-listener-backed hook
- `src/components/StreakChip.tsx`, `LevelBadge.tsx`, `DailyGoalRing.tsx`, `BadgeGrid.tsx`, `UnlockToast.tsx`
- `src/screens/StatsScreen.tsx`
- `__tests__/progress.test.ts`

**Modified**
- `App.tsx` — native-stack (Home + Stats)
- `src/hooks/useTodos.tsx` — reserved-key filter fix + `recordCompletion` on toggle
- `src/components/TodoList.tsx` — header (streak/level/stats-icon/goal-ring), navigation
- `src/styles.tsx` — new styles
- `src/translations/en.json`, `src/translations/tr.json` — new strings (stats, badges, goal, etc.)

## Open questions

None blocking. Defaults chosen for daily goal (3), XP weights (10/+5/+20), and the 8 badges are tunable during implementation without architectural change.
