import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { USERS_BY_ID } from '@/lib/seed';
import type { User } from '@/lib/types';
import { storage } from '@/stores/storage';

export const ME_ID = 'me';

export interface Me extends User {
  onboarded: boolean;
}

const EMPTY_ME: Me = {
  id: ME_ID,
  name: '',
  handle: '',
  bio: '',
  tags: [],
  onboarded: false,
};

interface SessionState {
  me: Me;
  finishOnboarding: (name: string) => void;
  reset: () => void;
}

function toHandle(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.|\.$/g, '');
  return base.slice(0, 18) || 'you';
}

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      me: EMPTY_ME,
      finishOnboarding: (name) =>
        set({ me: { ...EMPTY_ME, name: name.trim(), handle: toHandle(name), onboarded: true } }),
      reset: () => set({ me: EMPTY_ME }),
    }),
    { name: 'level.session.v1', storage },
  ),
);

/** Resolve an id to a person, including yourself. Stable references, safe as a selector. */
export function useUser(id: string): User | undefined {
  return useSession((s) => (id === ME_ID ? s.me : USERS_BY_ID[id]));
}

export function getUser(id: string): User | undefined {
  return id === ME_ID ? useSession.getState().me : USERS_BY_ID[id];
}
