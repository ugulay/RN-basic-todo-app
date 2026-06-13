# Changelog

All notable changes to BasicNotes are documented here.

## [3.0.1] — 2026-06-13

### Added — Progress & Gamification
- 🔥 **Daily streak** — complete at least one task a day to keep the chain alive (forgiving rule).
- 🎯 **Daily goal ring** — set a target; the header ring fills as you finish tasks. Hitting it earns a "perfect day" bonus.
- ⭐ **XP & levels** — every completed task earns XP (+5 for important tasks); level up over time.
- 🏆 **Achievement badges** — 8 unlockable milestones (first task, 7- and 30-day streaks, 100/500 completed, level 5, busy day…).
- 📊 **Stats screen** — current & best streak, level/XP progress, and a last-7-days completion chart.

### Changed
- Reworked home header: streak chip, level badge, daily-goal ring, and a stats shortcut.

### Notes
- All progress is stored on-device (MMKV). No account, no tracking, no network.
- Streaks and stats start fresh on this version — past completions are not backfilled (no historical timestamps existed).
