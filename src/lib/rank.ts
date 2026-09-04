import type { FeedReason, Post } from '@/lib/types';

/**
 * Feed ranking.
 *
 * The one idea worth borrowing from X's open-sourced ranker is the shape of the
 * final step: a weighted sum of engagement signals. Everything upstream of that
 * (candidate sourcing, a trained transformer, safety classifiers) only pays off
 * at a scale this app does not have. At our scale a transparent, hand-tuned sum
 * is both stronger and explainable, so every post can say why it is here.
 *
 * All signals are private. Nothing here is ever shown as a number.
 */
export const WEIGHTS = {
  /** Author is in your circle (or is you). */
  circle: 2.5,
  /** Per post of theirs you have privately liked, capped. */
  authorAffinity: 1.0,
  /** Per liked post sharing a tag with this one, capped. */
  tagInterest: 0.4,
  /** Multiplier on an exponential recency decay with a one day half-life-ish. */
  freshness: 2.0,
  /** Applied once you have already seen the post. */
  seen: -1.5,
} as const;

const AFFINITY_CAP = 3;
const TAG_CAP = 3;
const NEW_HOURS = 6;

export interface RankInput {
  posts: Post[];
  following: ReadonlySet<string>;
  likedPostIds: ReadonlySet<string>;
  seenAt: Readonly<Record<string, number>>;
  meId: string;
  now: number;
}

export interface RankedPost {
  post: Post;
  score: number;
  reason: FeedReason;
}

function countBy(keys: string[]): Map<string, number> {
  const out = new Map<string, number>();
  for (const k of keys) out.set(k, (out.get(k) ?? 0) + 1);
  return out;
}

export function rankFeed(input: RankInput): RankedPost[] {
  const { posts, following, likedPostIds, seenAt, meId, now } = input;
  const byId = new Map(posts.map((p) => [p.id, p]));
  const likedPosts = [...likedPostIds].map((id) => byId.get(id)).filter((p): p is Post => !!p);
  const likedAuthors = countBy(likedPosts.map((p) => p.authorId));
  const likedTags = countBy(likedPosts.flatMap((p) => p.tags));
  const authorName = (post: Post) => post.authorId;

  const ranked = posts.map((post): RankedPost => {
    const isMine = post.authorId === meId;
    const inCircle = isMine || following.has(post.authorId);
    const affinity = Math.min(likedAuthors.get(post.authorId) ?? 0, AFFINITY_CAP);
    let bestTag: string | undefined;
    let interest = 0;
    for (const tag of post.tags) {
      const n = Math.min(likedTags.get(tag) ?? 0, TAG_CAP);
      interest += n;
      if (n > 0 && bestTag === undefined) bestTag = tag;
    }
    const ageHours = Math.max(0, (now - post.createdAt) / 3_600_000);
    const freshness = Math.exp(-ageHours / 24);
    const seen = seenAt[post.id] !== undefined;

    const score =
      (inCircle ? WEIGHTS.circle : 0) +
      affinity * WEIGHTS.authorAffinity +
      interest * WEIGHTS.tagInterest +
      freshness * WEIGHTS.freshness +
      (seen ? WEIGHTS.seen : 0);

    let reason: FeedReason;
    if (isMine) reason = { kind: 'yours' };
    else if (inCircle) reason = { kind: 'circle' };
    else if (affinity > 0) reason = { kind: 'author', name: authorName(post) };
    else if (bestTag) reason = { kind: 'tag', tag: bestTag };
    else if (ageHours < NEW_HOURS) reason = { kind: 'new' };
    else reason = { kind: 'suggested' };

    return { post, score, reason };
  });

  return ranked.sort((a, b) => b.score - a.score || b.post.createdAt - a.post.createdAt);
}
