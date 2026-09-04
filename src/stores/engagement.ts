import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { storage } from '@/stores/storage';

/**
 * What you did with other people's posts. All private. These feed the ranker
 * and nothing else; none of it is ever shown as a number to anyone.
 */
interface EngagementState {
  liked: Record<string, true>;
  saved: Record<string, true>;
  /** postId to the time you first saw it. */
  seen: Record<string, number>;
  /** postId to the people you sent it to. */
  sent: Record<string, string[]>;
  hidden: Record<string, true>;
  reported: Record<string, true>;
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
  markSeen: (postId: string) => void;
  markSent: (postId: string, userId: string) => void;
  hide: (postId: string) => void;
  report: (postId: string) => void;
  reset: () => void;
}

function toggleKey(map: Record<string, true>, key: string): Record<string, true> {
  const next = { ...map };
  if (next[key]) delete next[key];
  else next[key] = true;
  return next;
}

const EMPTY = {
  liked: {},
  saved: {},
  seen: {},
  sent: {},
  hidden: {},
  reported: {},
};

export const useEngagement = create<EngagementState>()(
  persist(
    (set, get) => ({
      ...EMPTY,
      toggleLike: (postId) => set((s) => ({ liked: toggleKey(s.liked, postId) })),
      toggleSave: (postId) => set((s) => ({ saved: toggleKey(s.saved, postId) })),
      markSeen: (postId) => {
        if (get().seen[postId] !== undefined) return;
        set((s) => ({ seen: { ...s.seen, [postId]: Date.now() } }));
      },
      markSent: (postId, userId) =>
        set((s) => ({ sent: { ...s.sent, [postId]: [...(s.sent[postId] ?? []), userId] } })),
      hide: (postId) => set((s) => ({ hidden: { ...s.hidden, [postId]: true } })),
      report: (postId) =>
        set((s) => ({ reported: { ...s.reported, [postId]: true }, hidden: { ...s.hidden, [postId]: true } })),
      reset: () => set({ ...EMPTY }),
    }),
    { name: 'level.engagement.v1', storage },
  ),
);
