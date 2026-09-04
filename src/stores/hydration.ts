import { useEffect, useState } from 'react';

import { useActivity } from '@/stores/activity';
import { useCircle } from '@/stores/circle';
import { useEngagement } from '@/stores/engagement';
import { usePosts } from '@/stores/posts';
import { useSession } from '@/stores/session';

const persisted = [useSession, useCircle, useEngagement, usePosts, useActivity] as const;

function allHydrated() {
  return persisted.every((s) => s.persist.hasHydrated());
}

/**
 * True once every persisted store has read AsyncStorage. The root layout
 * holds the splash until then so the onboarding guard flips exactly once.
 */
export function useAllHydrated(): boolean {
  const [ready, setReady] = useState(allHydrated);
  useEffect(() => {
    if (ready) return;
    const check = () => {
      if (allHydrated()) setReady(true);
    };
    const unsubs = persisted.map((s) => s.persist.onFinishHydration(check));
    check();
    return () => unsubs.forEach((u) => u());
  }, [ready]);
  return ready;
}
