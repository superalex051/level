import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { USERS } from '@/lib/seed';
import type { ActivityEvent } from '@/lib/types';
import { useCircle } from '@/stores/circle';
import { storage } from '@/stores/storage';

/**
 * What other people did with YOUR posts. Only you ever see it, and only in
 * the insights panel.
 *
 * STAND-IN: there is no backend, so `simulateCircle` plays the part of your
 * circle noticing a post over the next half minute. A real server delivers
 * the same events. Timers live in a registry so delete account can clear them.
 */
interface ActivityState {
  events: ActivityEvent[];
  record: (event: ActivityEvent) => void;
  simulateCircle: (postId: string) => void;
  reset: () => void;
}

const timers = new Set<ReturnType<typeof setTimeout>>();

function later(ms: number, fn: () => void) {
  const t = setTimeout(() => {
    timers.delete(t);
    fn();
  }, ms);
  timers.add(t);
}

function shuffle<T>(items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export const useActivity = create<ActivityState>()(
  persist(
    (set, get) => ({
      events: [],
      record: (event) => set((s) => ({ events: [...s.events, event] })),
      simulateCircle: (postId) => {
        const following = useCircle.getState().following;
        const pool = following.length ? following : USERS.slice(0, 4).map((u) => u.id);
        const viewers = shuffle(pool).slice(0, Math.min(pool.length, 3 + Math.floor(Math.random() * 3)));
        viewers.forEach((userId, i) => {
          const seeAt = 3000 + i * 4500 + Math.random() * 3000;
          later(seeAt, () => {
            get().record({ postId, userId, kind: 'seen', at: Date.now() });
            if (Math.random() < 0.6) {
              later(1000 + Math.random() * 4000, () =>
                get().record({ postId, userId, kind: 'liked', at: Date.now() }),
              );
            }
            if (Math.random() < 0.2) {
              later(2000 + Math.random() * 4000, () =>
                get().record({ postId, userId, kind: 'shared', at: Date.now() }),
              );
            }
          });
        });
      },
      reset: () => {
        for (const t of timers) clearTimeout(t);
        timers.clear();
        set({ events: [] });
      },
    }),
    { name: 'level.activity.v1', storage, partialize: (s) => ({ events: s.events }) },
  ),
);
