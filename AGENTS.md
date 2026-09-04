# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# Level

A social photo app where viewers never see engagement. No like counts, no
comments, no share counts, no follower or following counts on anyone. Every
account looks the same size. You add people to your circle and see what they
post. Only the author of a post can open its numbers.

iOS first. Expo SDK 57, expo-router, React Native 0.86, React 19.2,
TypeScript 6, React Compiler on, typed routes on. Runs in the iOS simulator
through Expo Go with seeded local data. There is no backend yet.

Alex builds and runs it. The roast that shaped the product is in
`docs/roast-verdict.md`. The brand is in `docs/brand-kit.md`.

## Product rules

These are the point of the app. Do not drift from them, and push back if a task
would.

**Glossary.** One term per concept, everywhere: **circle** (people you added),
**add to circle** and **in your circle** (the verb and the state), **post**,
**seen by**, **insights** (author-only numbers). Never "follow", "friends",
"followers", or "likes" as a public noun.

**Visibility matrix.**

| Signal                  | Viewer sees | Author sees                        |
| ----------------------- | ----------- | ---------------------------------- |
| Like count              | never       | yes, in insights                   |
| Who liked               | never       | yes, faces and names               |
| Share count             | never       | yes, in insights                   |
| Who shared              | never       | yes, faces and names               |
| Seen by                 | never       | faces and names, never a count     |
| Comments                | do not exist| do not exist                       |
| Circle size, of anyone  | never       | never, not even your own           |
| Your circle list        | private     | names only, never a number         |

**Anti-status guardrails.** No streaks, badges, leaderboards, "popular",
"trending", verified marks, tab badges, or "better than usual" framing anywhere,
including insights. Insights are plain tabular numbers and faces. Nothing a
viewer sees ever encodes popularity: no ordering by likes, no popularity chips.

**Circle model.** One-way add, no request or accept, nobody is notified.
Removing someone is silent. It is "follow" with the count removed; say so
plainly if asked.

**UGC minimums** (App Store Guideline 1.2) are in the MVP so the shape is right
from day one: report a post, hide a post, block a person, remove from circle,
delete account (local reset), a rules screen accepted on the welcome step, a
specific photo permission string.

## Layout

```
src/
  app/              expo-router routes
    _layout.tsx     root Stack, Stack.Protected on onboarded, hydration gate, Toast host
    welcome.tsx     name + rules, then pick your circle
    (tabs)/         NativeTabs: index (Feed), circle, you
    compose.tsx     modal
    user/[id].tsx   someone else's profile
    post/[id].tsx   full post; insights when it is yours
  components/       one component per file, named exports
  constants/theme.ts  Palette, Type, Spacing, Radius, Motion
  hooks/            useTheme, useColorScheme
  lib/              types, seed data, rank, time, insights, copy
  stores/           zustand, one file per domain, persisted on its own key
assets/brand/       mark.svg, the source of the icon
assets/images/      rendered icon and splash
docs/               roast verdict, brand kit
scripts/            render-brand.mjs
```

## Commands

```bash
npm run ios              # expo start --ios, opens Expo Go on the booted simulator
npx tsc --noEmit         # typecheck, run after the first expo start (it generates expo-env.d.ts)
npx expo lint
node scripts/render-brand.mjs   # re-render icon and splash from assets/brand/mark.svg
```

Simulator helpers: `xcrun simctl io booted screenshot out.png`,
`xcrun simctl ui booted appearance dark`.

There are no tests yet. `rankFeed` in `src/lib/rank.ts` is pure and is the
first thing that should get a `node:test` file when tests arrive.

## Rules that apply everywhere

**Every user-facing string lives in `src/lib/copy.ts`.** Screens import from
there. This is how the voice rules stay checkable with a grep.

**No em dashes and no en dashes in anything a person reads**: UI copy, docs,
commit messages, replies to Alex. Use a period, a comma, or a middle dot `·`.
No emoji in UI copy. No exclamation marks. Sentence case. Buttons are a verb
plus an object ("Add to circle", "Post photo", "Keep editing"), never OK,
Submit, Yes, No. Banned words: elevate, seamless, unleash, authentic, premium.

**Numbers never reach a viewer.** If you find yourself rendering a count
outside `insights-panel.tsx`, stop. "Seen by" is faces and names, and when
there are more than fit, the word "more", never a number.

**One accent.** Terracotta is used for circle actions and the liked state and
nothing else. iOS system red is for destructive actions only.

**Zustand selectors return primitives or use `useShallow`.** A selector that
returns a fresh object or array loops forever under React 19. The React
Compiler does not save you.

**Lists under native tabs are the screen root** with
`contentInsetAdjustmentBehavior="automatic"`. No manual bottom padding.

**The simulated circle is a stand-in.** `src/stores/activity.ts` fakes people
seeing, liking, and sharing your post. Keep it clearly labeled and keep its
timers in the cancellable registry so delete account clears them.

**Do not touch the SDK version or add a dependency** where the house pattern
exists: SF Symbols through `expo-symbols`, menus through expo-router `Link.Menu`
or `ActionSheetIOS`, state through zustand.

## Brand

Direction: Hearth. Cream and clay. A shared album between people who know each
other, not a stage. Photos carry the color; the UI is warm neutral with one
terracotta accent.

Palette light · canvas `#FBF7F2`, surface `#FFFFFF`, surfaceRaised `#F3EDE6`,
hairline `#EADFD5`, text `#2A2320`, textSecondary `#7A6E66`, textTertiary
`#8C7F76`, accent `#A84E2F`, accentSoft `#F6E7E0`, onAccent `#FFF8F4`.
Dark · canvas `#1A1614`, surface `#251F1B`, surfaceRaised `#2F2823`, hairline
`#3A322C`, text `#F2EAE2`, textSecondary `#A3968C`, textTertiary `#8E8279`,
accent `#E08A66`, accentSoft `#3A2A22`, onAccent `#1A1614`.

Type: system font only. Headings SF Pro Rounded (`fontFamily: 'ui-rounded'`),
body SF Pro. Scale in `Type` in `src/constants/theme.ts`. Insights numbers use
tabular figures.

Shape: radius 20 on sheets and panels, 16 on feed photos, 12 on buttons, 8 on
chips. 4pt spacing scale. Feed posts are not cards on cards.

Motion: press scale 0.97 over 120ms ease-out. Like is a filled symbol plus a
selection haptic, no burst. The one designed peak is the first face appearing
under your own post.

Mark: an equals sign, two rounded bars, terracotta on cream. Source in
`assets/brand/mark.svg`.

## Working style

Small, surgical diffs. Match the surrounding code. Comments explain why, and
name the constraint that forced the shape.

When a task is genuinely independent of another, say so and they can run in
parallel. When two pieces of work touch the same file, they cannot.

Report outcomes plainly. If the typecheck fails, paste the error.

Commit trailers:

```
Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_019KZoCJbmR5Utp42vZ1FwyJ
```

## Compact instructions

When compacting, keep: the current task and what remains of it, decisions Alex
has made and the reasoning behind them, file paths and identifiers already
established, anything discovered about Expo 57 that is not written down here,
and any correction Alex has issued. Drop: file contents already read, tool
output already acted on, and exploration that led nowhere.
