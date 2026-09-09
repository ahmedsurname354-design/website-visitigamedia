# Public website performance check

Measured the production build before and after the animation changes using the same local HTTP server with gzip. Three fresh browser contexts per device and build, each followed by a cached reload: 24 navigations total. Mobile: 390 × 844, DPR 2; desktop: 1440 × 900, DPR 1. Both used Slow 4G and 4× CPU throttling. Observations cover the initial 6.5 seconds; subsequent lazy image requests can still occur on cached reloads.

## Median results

| Device / load | LCP before → after | CLS before → after | Total long-task duration before → after |
| --- | --- | --- | --- |
| Mobile, fresh context | 3,056 → 2,872 ms | 0 → 0 | 573 → 543 ms |
| Mobile, cached reload | 1,020 → 992 ms | 0 → 0 | 484 → 494 ms |
| Desktop, fresh context | 3,184 → 3,120 ms | 0 → 0 | 520 → 676 ms |
| Desktop, cached reload | 972 → 1,016 ms | 0 → 0 | 305 → 547 ms |

The initial JavaScript bundle decreased from 370.69 KB (120.91 KB gzip) to 326.65 KB (108.06 KB gzip). Homepage JavaScript requests decreased from 16 to 3 by removing unsolicited route prefetches. PDF and flipbook code remain deferred.

The 2.5-second cold-load LCP target was not reached under this throttled configuration. CPU measurements did not improve consistently, especially on desktop. These results demonstrate reduced startup downloads and a modest cold-load LCP improvement, not elimination of all lag. They are local lab measurements, not production user metrics or proof of a particular hardware bottleneck. Long-task duration is not TBT.

## Animation and functional checks

- Three focused-browser scroll passes per build, 0–3,000 px and back over three seconds, at 4× CPU throttling: no requestAnimationFrame gaps above 34 ms in either build. Runs affected by background throttling were excluded. This measures callback cadence, not GPU dropped frames; reliable GPU frame counts were not captured.
- Mobile hero is one viewport tall with no sticky extension, parallax subscription, or blurred glow. Desktop retains a small parallax movement. Resizing between 390 and 844 px updates the policy.
- Public navigation through services, about, portfolio, news, contact, and home preserves the same navbar/footer DOM nodes, shows one main content area, and resets scroll position.
- Mobile menu opens, locks body scrolling, closes with Escape, and restores toggle focus.
- Product page initially requests no PDF/flipbook resources. Scrolling near the catalogue loads them and renders 28 pages.
- Unauthenticated `/admin` redirects to `/admin/login`. An authenticated dashboard session was not available for end-to-end testing.
- Simulated matchMedia reduced-motion preference shows all service cards immediately and disables parallax; changing it back enables desktop parallax. CSS reduced-motion rules were inspected; native OS preference emulation is unavailable in the browser tool.
- Simulated failed hero image leaves the heading fully visible and service CTA present.
- Typecheck, repository lint, and production build passed. Existing Browserslist data warning remains.

## Implementation

Persistent public layout, content-only 200 ms route fade, intent-based prefetch with rejection handling, reduced initial animation feature bundle via LazyMotion, reactive viewport/motion policy, short one-time reveals with 80 px look-ahead, static hero glow, and reserved image dimensions. The hero heading renders immediately instead of waiting for an entrance animation. No API, database, or dependency changes.
