# Meta Ads — BasicNotes (App Installs)

Facebook / Instagram acquisition copy for the streak/XP/stats relaunch. Pairs with the Play ASO (organic). Goal: cheap installs from people who want to build habits without a paywall or account.

## Campaign setup

- **Objective:** App promotion → App installs (Android, `com.basicnotes`).
- **Optimization:** Installs first; switch to in-app event (`task_completed` or `streak_3`) once the SDK/events are wired. *(Note: app currently has no analytics SDK — Meta install attribution needs the Facebook SDK or a MMP like Adjust/AppsFlyer added if you want event optimization. Install-only works via Google Play referrer.)*
- **Placements:** Advantage+ (auto). Strong on Reels + Stories with vertical video.
- **Budget:** start small ($5–10/day/ad set), 3 ad sets, let it learn 3–4 days before judging.

## Audiences (3 ad sets to test)

1. **Habit / self-improvement** — interests: productivity, habit tracker apps, bullet journal, self-improvement, GTD. Age 18–44.
2. **Privacy-minded** — interests: privacy, open source, DuckDuckGo, Signal, "no ads". Age 22–45.
3. **Broad / Advantage+** — no interest targeting, let Meta find installers. Often wins at low budget.

## Creative concepts

- **A. Streak counter** (video): tasks get checked → 🔥 number climbs 1→2→…→12 → badge unlock toast. Caption: "Don't break the chain."
- **B. Privacy** (static/carousel): "No account. No ads. No tracking." over the dark UI.
- **C. Satisfying done** (video): checkbox pop + goal ring fills + "perfect day".

Keep it native/UGC-style for Reels; show the actual dark UI (it reads premium).

---

## Ad copy — EN

**Angle 1 — Streak / habit**
- Primary text:
  1. "Your to-do list, but you actually *want* to open it. Build a 🔥 streak, earn XP, and watch your progress grow — free, no account."
  2. "Most to-do apps are a chore. BasicNotes turns finishing tasks into a daily streak you won't want to break. No ads, no sign-up."
- Headlines: "Build your streak" · "To-do that sticks" · "Level up your day"
- Descriptions: "Free • Private • No account" · "Streaks, XP & badges"

**Angle 2 — Privacy**
- Primary text:
  1. "A to-do list that minds its business. 100% offline, no account, no tracking, no ads — and now with streaks and XP to keep you going."
  2. "No sign-up. No cloud. No data collection. Just a fast, private to-do list that rewards you for getting things done."
- Headlines: "Private by design" · "No account needed" · "Your tasks stay yours"
- Descriptions: "Offline • Open source" · "Free, no ads ever"

## Ad copy — TR

**Açı 1 — Seri / alışkanlık**
- Birincil metin:
  1. "Yapılacaklar listesi ama açmak isteyeceğin türden. 🔥 seri yap, XP kazan, ilerlemeni izle — ücretsiz, hesap yok."
  2. "Çoğu görev uygulaması angarya. BasicNotes görev bitirmeyi kırmak istemeyeceğin bir günlük seriye dönüştürür. Reklam yok, kayıt yok."
- Başlıklar: "Serini başlat" · "Kalıcı görev listesi" · "Gününü seviye atlat"
- Açıklamalar: "Ücretsiz • Gizli • Hesapsız" · "Seri, XP ve rozetler"

**Açı 2 — Gizlilik**
- Birincil metin:
  1. "Haddini bilen bir görev listesi. %100 çevrimdışı, hesap yok, takip yok, reklam yok — üstelik artık seri ve XP ile."
  2. "Kayıt yok. Bulut yok. Veri toplama yok. Sadece hızlı, gizli ve işini bitirdikçe seni ödüllendiren bir liste."
- Başlıklar: "Tasarımı gereği gizli" · "Hesap gerekmez" · "Görevlerin sende kalır"
- Açıklamalar: "Çevrimdışı • Açık kaynak" · "Ücretsiz, reklamsız"

## Length guidance

- Primary text: first ~125 chars show before "See more" — front-load the hook + 🔥.
- Headline: ≤40 chars (≤27 ideal).
- Description: ≤30 chars.

## Measurement

Without an attribution SDK, judge by **Play Console** install lift + cost (Meta cost ÷ Play installs during the flight). Add Facebook SDK or an MMP later for true CPI/ROAS and event optimization.
