# Level brand kit · Hearth

Chosen by Alex from three directions derived from his installed design skills
(impeccable, mobile-app-ui-design, minimalist-ui, typeset, layout, polish,
emil-design-eng, quieter). The rules below are the ones that bind.

## Feel

Cream and clay. A shared album between people who know each other, not a
stage. Photos carry all the color. The UI is warm neutral with one terracotta
accent used only on circle actions and the liked state. Closest reference app:
Retro.

## Palette

Every neutral is tinted toward the clay hue. Never pure black or pure white.

| Token          | Light     | Dark      | Use                                   |
| -------------- | --------- | --------- | ------------------------------------- |
| canvas         | `#FBF7F2` | `#1A1614` | screen background                     |
| surface        | `#FFFFFF` | `#251F1B` | panels, rows, sheets                  |
| surfaceRaised  | `#F3EDE6` | `#2F2823` | pressed state, chips, secondary fills |
| hairline       | `#EADFD5` | `#3A322C` | dividers, 1pt borders                 |
| text           | `#2A2320` | `#F2EAE2` | primary text                          |
| textSecondary  | `#7A6E66` | `#A3968C` | secondary text, inactive icons        |
| textTertiary   | `#8C7F76` | `#8E8279` | placeholders (4.5:1 checked)          |
| accent         | `#A84E2F` | `#E08A66` | add to circle, liked state, wordmark  |
| accentSoft     | `#F6E7E0` | `#3A2A22` | secondary buttons, in-your-circle     |
| onAccent       | `#FFF8F4` | `#1A1614` | text on accent                        |
| danger         | `#FF3B30` | `#FF453A` | report, block, delete only            |

Weight on screen: 60% canvas and surface, 30% secondary text and hairlines,
10% accent. The accent works because it is rare.

## Type

System font only. Headings in SF Pro Rounded (`fontFamily: 'ui-rounded'`),
everything else SF Pro (`'system-ui'`).

| Style      | Size / line | Weight | Notes                          |
| ---------- | ----------- | ------ | ------------------------------ |
| largeTitle | 34 / 39     | 700    | rounded, tracking -0.4         |
| title      | 22 / 26     | 700    | rounded, tracking -0.2         |
| headline   | 17 / 22     | 600    | names, buttons                 |
| body       | 17 / 24     | 400    | captions, paragraphs           |
| subhead    | 15 / 20     | 400    | secondary rows                 |
| footnote   | 13 / 18     | 400    | timestamps, why chips          |
| label      | 12 / 16     | 600    | uppercase, tracking +0.6       |

Insights numbers use tabular figures (`fontVariant: ['tabular-nums']`).

## Shape and space

Radius 20 on sheets and surface panels, 16 on feed photos, 12 on buttons, 8 on
chips. Avatars are circles. Concentric radii: inner radius equals outer radius
minus padding.

Spacing scale 4 / 8 / 12 / 16 / 24 / 32 / 48. Siblings 8 to 12, sections 24 to
32. Screen margin 16. Touch targets 44pt.

Feed posts are not cards on cards. Canvas background, photo inset 16pt with a
16pt radius, header and caption in the margin. Surfaces are for panels only:
insights, user rows, compose.

Shadows: none. Depth in dark mode comes from the three surface steps.

## Iconography

SF Symbols through `expo-symbols`. heart and heart.fill (like), paperplane
(send), bookmark (save), plus (new post), eye (insights), person.2 (circle),
photo.on.rectangle (feed), person.crop.circle (you), ellipsis (menus),
exclamationmark.bubble (report), eye.slash (hide), hand.raised (block).

## Motion

Press feedback scale 0.97 over 120ms ease-out. Like swaps to the filled symbol
with a selection haptic, no burst. Double-tap like shows a heart fading over
200ms from scale 0.95 to 1. Sheets are the native modal. The one designed peak:
the first face appearing in "Seen by" under your own post, a 250ms fade plus a
success haptic. Reduced motion is respected. Nothing in-app exceeds 300ms.

## Voice

Sentence case. Verb plus object on buttons: "Add to circle", "Post photo",
"Keep editing". No emoji in UI copy. No exclamation marks. No em or en dashes.
No clichés: elevate, seamless, unleash, authentic, premium. Empty states
acknowledge, explain the value, and offer one action. Loading copy is specific:
"Posting to your circle".

The claim, written plainly, not reframed: "No like counts. No follower counts.
Nobody sees who is popular."

## Mark

Wordmark: "Level" in SF Pro Rounded Bold, tracking -0.4. Symbol: an equals
sign, two equal rounded bars, terracotta on cream. App icon is the symbol on a
cream field. In the feed header the symbol sits at 20pt beside the wordmark.
Source: `assets/brand/mark.svg`. Render with `node scripts/render-brand.mjs`.
