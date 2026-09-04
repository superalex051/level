import { useMemo } from 'react';

import { SEED_POSTS } from '@/lib/seed';
import type { Post } from '@/lib/types';
import { useCircle } from '@/stores/circle';
import { useEngagement } from '@/stores/engagement';
import { usePosts } from '@/stores/posts';

/** Every post you are allowed to see: yours plus the seed, minus blocked people and hidden posts. */
export function useVisiblePosts(): Post[] {
  const myPosts = usePosts((s) => s.myPosts);
  const blocked = useCircle((s) => s.blocked);
  const hidden = useEngagement((s) => s.hidden);
  return useMemo(
    () => [...myPosts, ...SEED_POSTS].filter((p) => !blocked.includes(p.authorId) && !hidden[p.id]),
    [myPosts, blocked, hidden],
  );
}

export function usePost(id: string): Post | undefined {
  const mine = usePosts((s) => s.myPosts.find((p) => p.id === id));
  return mine ?? SEED_POSTS.find((p) => p.id === id);
}

export function usePostsBy(userId: string): Post[] {
  const myPosts = usePosts((s) => s.myPosts);
  return useMemo(
    () => (userId === 'me' ? myPosts : SEED_POSTS.filter((p) => p.authorId === userId)),
    [userId, myPosts],
  );
}
