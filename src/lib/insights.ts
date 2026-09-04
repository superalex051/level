import type { ActivityEvent, User } from '@/lib/types';

export interface Insights {
  likes: User[];
  shares: User[];
  /** Everyone who saw the post, including those who then liked or shared. */
  seenBy: User[];
}

/**
 * Groups raw activity into what the insights panel shows. Newest first.
 * Counting happens in the panel and nowhere else; see AGENTS.md.
 */
export function groupInsights(
  events: ActivityEvent[],
  resolve: (id: string) => User | undefined,
): Insights {
  const sorted = [...events].sort((a, b) => b.at - a.at);
  const pick = (kind: ActivityEvent['kind']) => {
    const seenIds = new Set<string>();
    const out: User[] = [];
    for (const e of sorted) {
      if (e.kind !== kind || seenIds.has(e.userId)) continue;
      const u = resolve(e.userId);
      if (!u) continue;
      seenIds.add(e.userId);
      out.push(u);
    }
    return out;
  };
  const seenIds = new Set<string>();
  const seenBy: User[] = [];
  for (const e of sorted) {
    if (seenIds.has(e.userId)) continue;
    const u = resolve(e.userId);
    if (!u) continue;
    seenIds.add(e.userId);
    seenBy.push(u);
  }
  return { likes: pick('liked'), shares: pick('shared'), seenBy };
}

/** "Maya, Jordan and Sam" or "Maya, Jordan, Sam and more". Never a number. */
export function nameList(users: User[], max = 3): string {
  const first = users.slice(0, max).map((u) => u.name.split(' ')[0]);
  const more = users.length > max;
  if (first.length === 0) return '';
  if (first.length === 1) return more ? `${first[0]} and more` : first[0];
  const head = first.slice(0, -1).join(', ');
  const last = first[first.length - 1];
  return more ? `${head}, ${last} and more` : `${head} and ${last}`;
}
