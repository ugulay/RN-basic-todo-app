# Play Store ASO — BasicNotes

Listing copy for `com.basicnotes`, optimized for the new streak/XP/stats positioning.
Canonical text lives in `fastlane/metadata/android/<locale>/` (auto-uploadable via fastlane `supply` or Gradle Play Publisher). This doc adds rationale, limits, and keyword strategy.

## Positioning

Shift from "simple todo" → **"the to-do list that becomes a habit"** — gamified (streaks/XP/badges) + privacy-first (offline, no ads, no account). Those two angles differentiate against Todoist/TickTick/Microsoft To Do (cloud, accounts, paywalls).

## Field limits (Google Play)

| Field | Limit | EN | TR |
|---|---|---|---|
| App title | 30 | `BasicNotes: To-Do & Streaks` (27) | `BasicNotes: Görev & Seri` (24) |
| Short description | 80 | 75 chars | 72 chars |
| Full description | 4000 | ~1.4k | ~1.5k |
| Release notes | 500/lang | see `changelogs/4.txt` | see `changelogs/4.txt` |

> Google Play has **no keyword field** — ranking comes from the title, short description, and full description. Weave keywords naturally there (don't keyword-stuff; Play penalizes it).

## Title A/B candidates

EN:
1. `BasicNotes: To-Do & Streaks` ← current (habit hook)
2. `BasicNotes: To-Do List & XP`
3. `BasicNotes – Habit To-Do List`

TR:
1. `BasicNotes: Görev & Seri` ← current
2. `BasicNotes: Yapılacaklar` (strongest single keyword)
3. `BasicNotes – Alışkanlık & Görev`

Test one variable at a time in Play Console **Store listing experiments** (50/50, ≥7 days, watch install conversion).

## Keyword targets (work into the copy, not a list)

**EN:** to-do list, todo, task manager, checklist, habit tracker, streak, daily planner, productivity, daily goals, reminders, get things done, offline, private, no ads, open source.

**TR:** yapılacaklar listesi, görev yöneticisi, görev takip, alışkanlık takibi, seri, günlük plan, üretkenlik, hatırlatıcı, çevrimdışı, gizli, reklamsız, açık kaynak.

## Short descriptions

- **EN (75):** `Free, private to-do list with streaks, XP & daily goals. No ads, no sign-up.`
- **TR (72):** `Ücretsiz, gizli yapılacaklar listesi. Seri, XP, günlük hedef. Reklamsız.`

The short description is the single highest-leverage ASO field — front-load the strongest keyword + the differentiator. Both lead with free/private + the new gamification terms.

## Full descriptions

See `fastlane/metadata/android/en-US/full_description.txt` and `tr-TR/full_description.txt`. Structure: one-line hook → privacy promise → ★ STAY ON TRACK (gamification) → ★ GET THINGS DONE (core) → ★ PRIVATE BY DESIGN → ★ BEAUTIFUL & FAST → CTA. First 2 lines matter most (shown before "read more").

## Creative / visual asset checklist (update for this release)

- [ ] **Feature graphic** (1024×500) — show the streak 🔥 + goal ring + "Build the habit".
- [ ] **Screenshots** (≥4, phone) — reshoot to include: new header, a filled goal ring / perfect day, the Stats screen (chart + level), the badge grid + unlock toast. Add short captions ("Keep your streak", "Level up", "See your progress").
- [ ] **Promo/short video** (optional) — 15–30s of completing tasks → streak climbs → badge unlock.
- [ ] App icon unchanged.

## What's new (release notes)

EN/TR in `changelogs/4.txt` (versionCode 4). Keep ≤500 chars, lead with the headline feature (streaks).

## Uploading the metadata

```bash
# fastlane supply (reads fastlane/metadata/android/**)
fastlane supply --aab android/app/build/outputs/bundle/release/app-release.aab \
  --metadata_path fastlane/metadata/android --skip_upload_images true
```
Or wire Gradle Play Publisher (`com.github.triplet.play`) to read the same tree. Start on the **internal testing** track, verify the listing, then promote.
