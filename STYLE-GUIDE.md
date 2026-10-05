# HomeWODRx style guide

**Status: agreed direction (October 4, 2026).** Source: the mockups at
https://claude.ai/artifact/8vJ7MWE83bMgFz1MuEgJAU (second row). Wording rules live in
[CONTENT-GUIDE.md](CONTENT-GUIDE.md); this file covers the look.

The direction: **"Training Log"**. Calm, clean, app-like screens for the library, builder
and planner, with one bold action always in reach, and a dark **workout mode** for
training. Phone first: most visitors use the site in the gym.

In the rebuild these values are defined once (Tailwind theme / CSS variables). Pages never
hard-code a color, font or size of their own.

## 1. Color

| Token | Value | Use |
|---|---|---|
| `ground` | `#F6F6F3` | Page background |
| `surface` | `#FFFFFF` | Cards, header, bottom bar |
| `surface-muted` | `#EEEEEA` | Rest days, segmented-control track, quiet tiles |
| `border` | `#E3E3DE` | Card borders, header and bar dividers |
| `divider` | `#ECECE8` | Lines between rows inside a card |
| `ink` | `#16181D` | Text, selected chips, dark tiles |
| `ink-2` | `#3A3F4B` | Secondary text (meets 4.5:1 on white) |
| `ink-3` | `#5B6070` | Labels above values only |
| `accent` | `#C41212` | Brand red: the one primary action per screen, 21-15-9 rep schemes, logo "Rx" |
| `accent-on-dark` | `#FF5A4E` | Red text on dark backgrounds (footer logo) |

Workout mode (dark):

| Token | Value |
|---|---|
| `wm-ground` | `#0E0F12` |
| `wm-surface` | `#1B1D22` |
| `wm-border` | `#2A2D34` |
| `wm-ink` | `#F3F3F1` |
| `wm-ink-2` | `#C8CAD0` |
| `wm-accent` | `#E5352B` (brighter red, readable on dark) |

Rules:
- **One red button per screen.** Everything else is ink, outline or quiet.
- Colors that must be told apart also differ in lightness (the score bar uses four
  greys, not four hues; planner sources use solid, red and outline swatches).
- No gradients, no colored left or top borders on cards, no emoji.

## 2. Type

| Role | Font | Size / weight |
|---|---|---|
| Page title (H1) | Archivo | 40–44 px, 800, letter-spacing -1 px |
| Section title (H2) | Archivo | 17–18 px, 700 |
| Body | Archivo | 15–16 px, 400, line-height 1.5 |
| Labels | Archivo | 13–14 px, 400–600, `ink-3` |
| Numbers (reps, weights, times, counts, dates) | JetBrains Mono | 12–28 px, 500–700 |
| Workout-mode clock | JetBrains Mono | 96 px, 800 |

- Numbers are always in JetBrains Mono so they line up and read as data.
- Sentence case for headings ("Coaching cues"), Title Case for names (movements, equipment,
  categories), per the content guide.
- Both fonts from Google Fonts, self-hosted by Next.js (no third-party font requests).

## 3. Shape and spacing

- **Page gutter:** 16 px on phones. Cards stack with 16 px gaps.
- **Cards:** white, 1 px `border`, radius 16 px, padding 18 px. No shadows.
- **Rows inside cards:** 1 px `divider` on top, 8–12 px vertical padding.
- **Radius scale:** 999 px chips, 14–16 px cards and big buttons, 10–12 px small buttons
  and segmented controls.
- **Touch targets:** at least 44 × 44 px, everywhere, including icon buttons and chips.

## 4. Components

| Component | Spec |
|---|---|
| Header | White, 1 px bottom border. Wordmark "HomeWOD**Rx**" (Archivo 800, "Rx" in red) left; search and menu icon buttons right |
| Primary button | `accent` fill, white text, 50–56 px tall, radius 14 px. One per screen |
| Secondary button | White, 1.5 px `ink` outline, `ink` text |
| Icon button | 44–56 px square, outline or `surface-muted`, always with an `aria-label` |
| **Bottom action bar** | Fixed to the bottom of the screen on workout and builder pages: the primary action (Start Timer, Build my workout) plus up to two icon buttons (Log result, Add to plan). Pages leave 112 px of space for it |
| Chip (multi-select) | Pill, 44 px tall. Off: white with `#CFCFC9` outline. On: `ink` fill, white text |
| Segmented control | `surface-muted` track, selected segment `ink` fill (Rx / Scaled, time options) |
| Fact grid | Two columns of label (`ink-3`) over value (600 weight or mono) |
| Score bar | Horizontal bar split at the benchmark times, greys from dark (elite) to light; labels in mono under it; a "Your best" row below when the athlete has logged a result |
| Day card (Planner) | Day and date column (mono date), source label with swatch, workout name (800), format and time (mono). Today gets a 2 px `ink` border and a Start button. Rest days use `surface-muted` |
| Video | Click-to-play thumbnail (16:9, radius 12 px in cards, full-bleed at the top of movement pages) with a red round play button. Loads YouTube's privacy-enhanced player only when tapped. No caption explaining this; the cookie policy covers it |
| Movement row | Name (700) left, load in mono right, small play button for the demo video |
| Footer | `ink` background, wordmark with `accent-on-dark` "Rx", the tagline, links |

## 5. Workout mode

Opened by Start Timer. Dark, full screen, readable from across the room:
- Workout name and scheme at the top, close and sound buttons either side.
- Elapsed (or remaining) clock in 96 px mono, round progress bars and "Round 2 of 3".
- "Now" card: rep count in 64 px mono plus the movement name, load underneath.
- "Up next" line.
- Big Pause and Next buttons (64 px), then "Finish and log my time".
- The same dark tokens can later become an optional dark theme for the whole site.

## 6. Images and video

- Real workout and movement videos stay the teaching content. AI-generated people are
  never used to demonstrate a movement.
- Photography or AI imagery (for example from Higgsfield) only for atmosphere: homepage,
  blog headers, social posts. Check the tool's commercial-use terms first.
- Every image has useful alt text; decorative ones have empty alt.

## 7. Accessibility checklist (every screen)

- Text contrast 4.5:1 (3:1 for 24 px and larger). `ink-3` only for labels.
- Real `<button>`, `<a href>` and labelled inputs; nothing clickable built from a `div`.
- Visible focus outline on everything that can be focused.
- Works at 320 px wide with no sideways scrolling.
