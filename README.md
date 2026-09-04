# Level

A social photo app where viewers never see engagement. No like counts, no
comments, no share counts, no follower counts on anyone. You add people to
your circle and see what they post. Only the author of a post can open its
numbers.

iOS first. Expo SDK 57, expo-router, React Native 0.86, TypeScript. Runs in
the iOS simulator through Expo Go with seeded local data. No backend yet.

```bash
npm install
npm run ios          # opens Expo Go on the booted simulator
npx tsc --noEmit     # typecheck
npx expo lint
```

New to this? Start with `SETUP.md`, which goes from a blank Mac to the app
running in the simulator with Claude Code.

Read `AGENTS.md` for the product rules and the brand. The roast that shaped
the product is in `docs/roast-verdict.md`; the brand kit is in
`docs/brand-kit.md`.
