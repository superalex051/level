import { StyleSheet, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { Avatar } from '@/components/avatar';
import { Icon } from '@/components/icon';
import { ThemedText } from '@/components/themed-text';
import { Radius, ScreenMargin, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { copy } from '@/lib/copy';
import { groupInsights, nameList } from '@/lib/insights';
import type { User } from '@/lib/types';
import { useActivity } from '@/stores/activity';
import { getUser } from '@/stores/session';

const FACE = 28;
const FACE_OVERLAP = -8;

export interface InsightsPanelProps {
  postId: string;
}

/**
 * The author's numbers for one post. This is the only file in the app that
 * renders a count, and only the like and share counts. "Seen by" stays faces
 * and names even here. Plain table, no trend, no comparison; see AGENTS.md.
 */
export function InsightsPanel({ postId }: InsightsPanelProps) {
  const theme = useTheme();
  // useShallow: the filter returns a fresh array each call, and a fresh array
  // from a selector loops forever under React 19.
  const events = useActivity(useShallow((s) => s.events.filter((e) => e.postId === postId)));
  const { likes, shares, seenBy } = groupInsights(events, getUser);

  return (
    <View style={[styles.panel, { backgroundColor: theme.surface, borderColor: theme.hairline }]}>
      <View style={styles.titleRow}>
        <ThemedText variant="title">{copy.insights.title}</ThemedText>
        <View style={styles.onlyYou}>
          <Icon name="lock.fill" color={theme.textTertiary} size={12} />
          <ThemedText variant="footnote" color="textTertiary">
            {copy.insights.onlyYou}
          </ThemedText>
        </View>
      </View>

      {events.length === 0 ? (
        <ThemedText variant="subhead" color="textSecondary">
          {copy.insights.nothingYet}
        </ThemedText>
      ) : (
        <>
          <View style={styles.columns}>
            <Column label={copy.insights.likes} users={likes} />
            <Column label={copy.insights.shares} users={shares} />
          </View>

          <View style={[styles.hairline, { backgroundColor: theme.hairline }]} />

          <View style={styles.block}>
            <ThemedText variant="label" color="textSecondary">
              {copy.insights.seenBy}
            </ThemedText>
            <Faces users={seenBy} max={8} />
            <ThemedText variant="subhead">{nameList(seenBy, 4)}</ThemedText>
          </View>
        </>
      )}
    </View>
  );
}

/** One column of the table: the number, its label, then who. Zero shows no faces. */
function Column({ label, users }: { label: string; users: User[] }) {
  return (
    <View style={styles.column}>
      <ThemedText variant="number">{String(users.length)}</ThemedText>
      <ThemedText variant="label" color="textSecondary">
        {label}
      </ThemedText>
      {users.length > 0 ? (
        <View style={styles.who}>
          <Faces users={users} max={5} />
          <ThemedText variant="footnote" color="textSecondary">
            {nameList(users)}
          </ThemedText>
        </View>
      ) : null}
    </View>
  );
}

/** Overlapping faces, capped. The overflow is said in words by nameList, never as a number. */
function Faces({ users, max }: { users: User[]; max: number }) {
  return (
    <View style={styles.faces}>
      {users.slice(0, max).map((u, i) => (
        <View key={u.id} style={i > 0 ? styles.overlap : undefined}>
          <Avatar name={u.name} uri={u.avatar} size={FACE} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    marginHorizontal: ScreenMargin,
    padding: Spacing.lg,
    borderRadius: Radius.sheet,
    borderWidth: 1,
    gap: Spacing.lg,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.md },
  onlyYou: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, flexShrink: 1 },
  columns: { flexDirection: 'row', gap: Spacing.lg },
  column: { flex: 1, gap: Spacing.xs },
  who: { gap: Spacing.sm, marginTop: Spacing.sm },
  hairline: { height: 1 },
  block: { gap: Spacing.sm },
  faces: { flexDirection: 'row', alignItems: 'center' },
  overlap: { marginLeft: FACE_OVERLAP },
});
