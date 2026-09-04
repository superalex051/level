import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { storage } from '@/stores/storage';

/**
 * Your circle: the people whose posts you see. One-way, nobody is told.
 * The list is private and is never counted anywhere in the UI.
 */
interface CircleState {
  following: string[];
  blocked: string[];
  add: (userId: string) => void;
  remove: (userId: string) => void;
  toggle: (userId: string) => void;
  setFollowing: (userIds: string[]) => void;
  block: (userId: string) => void;
  reset: () => void;
}

export const useCircle = create<CircleState>()(
  persist(
    (set, get) => ({
      following: [],
      blocked: [],
      add: (userId) =>
        set((s) => (s.following.includes(userId) ? s : { following: [...s.following, userId] })),
      remove: (userId) => set((s) => ({ following: s.following.filter((id) => id !== userId) })),
      toggle: (userId) => (get().following.includes(userId) ? get().remove(userId) : get().add(userId)),
      setFollowing: (userIds) => set({ following: [...new Set(userIds)] }),
      block: (userId) =>
        set((s) => ({
          blocked: s.blocked.includes(userId) ? s.blocked : [...s.blocked, userId],
          following: s.following.filter((id) => id !== userId),
        })),
      reset: () => set({ following: [], blocked: [] }),
    }),
    { name: 'level.circle.v1', storage },
  ),
);

export function useInCircle(userId: string): boolean {
  return useCircle((s) => s.following.includes(userId));
}
