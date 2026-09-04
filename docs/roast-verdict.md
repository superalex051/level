# Roast verdict · 3 September 2026

Alex asked an adversarial council to judge the idea before building. Five
personas scored it, a judge ruled. The council's reshape became the product.

## The brief that was judged

An iOS-first social app with an Instagram-style photo feed and a short-form
video feed. The differentiator: all social proof hidden. No like counts, no
comments, no share counts, no follower or following counts on any profile.
Following and liking still exist as private signals for ranking. Ranking would
borrow from X's open-sourced recommendation algorithm. Target user: 16 to 30
year olds and small creators tired of the status game. Builder: solo, no
audience, no capital, no distribution.

## Verdict: RESHAPE · confidence high

Scores · Contrarian 2 · Expansionist 6 · First-Principles 3 · Researcher 3 · Buyer 3

**One line.** Do not build "Instagram plus TikTok with the numbers turned off".
Build a small, friends-first photo feed where hidden metrics are the default
texture, not the pitch, and where posters get a non-numeric signal of who saw
them.

**Why.** The idea as framed is a subtraction, and subtractions do not pull
people into an empty network. Meta ran the hidden-likes experiment for two years
across seven countries and shipped it as a toggle because half of teens use
like counts to know what is popular (Meta Newsroom, May 2021). Every "quieter
Instagram" built on the subtraction alone died: Ello, Vero, Path, Minus, and
Equal, which launched in March 2026 on this exact pitch and had too few App
Store ratings to show a score by August. The winners with hidden metrics all had
a positive hook underneath: VSCO (millions of paying subscribers, no public
likes), Cara (650k artists in a week on a values wedge), BeReal (sold for 500M
euro on a two-minute prompt mechanic).

## What each persona found

**Contrarian (2/10).** Hidden counts plus no comments removes the only feedback
loop that makes anyone post into a feed with 200 users. "Same playing field" is
false while a ranker still sorts by private signals; the hierarchy is invisible,
which feels like a shadowban with no diagnostics. The X ranker is noise at this
scale.

**Expansionist (6/10).** Incumbents cannot copy an all-in version because their
ad business runs on creator status. VSCO proved the model. Australia's under-16
ban, US age-verification laws, and school phone bans create parents who will pay
for a safe default. Private analytics for creators is a natural paid tier.

**First principles (3/10).** Hiding counts removes the scoreboard, not the game,
and also removes the reward that makes posting repeatable. Silence is worse than
a low number. The real hypothesis: people will keep posting to an audience whose
response they can never see. Smallest test: thirty people in a shared feed with
reactions off for two weeks; count who posts a third time.

**Researcher (3/10).** YPulse: 59% of 13 to 37s supported hiding likes, but only
50% of 13 to 17s. HypeAuditor: hidden likes cut likes per post most for 5k to
20k accounts, the small creators this brief targets. BeReal DAU fell 61% in six
months after peak. Lapse raised 30M and reverted to a camera app. Noplace hit
number one on a 500k waitlist and faded. The x-algorithm repo is Rust services
plus a JAX transformer with no trained weights; only its weighted sum of
predicted actions is reusable, and that is a twenty-line function.

**Buyer (3/10, NO).** "Nobody I know is on it, and no numbers removes the one
part of posting I enjoy without fixing the part that makes me feel bad, which
is three hours of Reels." Would flip if their friend group could join together
and they could privately see who saw their post.

## The reshape

- Keep hidden metrics for viewers as the default, never a toggle.
- Replace the void with faces, not numbers: the author sees who saw and reacted.
- Friends-first, circle-based, not a public follower graph.
- Pick one dense niche before generalizing.
- Drop short-form video from the MVP; it reintroduces the harm being sold against.
- Drop the X algorithm; keep a transparent weighted sum.

**Alex's correction after the verdict.** The creator can see engagement on their
own posts: like count, share count, and the faces and names of who liked,
shared, or saw it. Viewers see nothing. This is stricter than the council's
faces-only suggestion on the creator side and the product rules reflect it.

## The cheapest 48-hour test

DM thirty people from one specific community: "I'm making a private photo feed
for us. No likes, no follower counts, no comments. You just see which of us saw
your photo. Want in?" Put the yeses in a group chat with reactions disabled and
ask everyone to post one photo. Count who posts a third time over two weeks.
Under ten yeses in 48 hours means the pain is stated, not felt.
