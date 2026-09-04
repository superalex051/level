import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { UserRow } from '@/components/user-row';
import { ScreenMargin, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { copy } from '@/lib/copy';
import { USERS, USERS_BY_ID } from '@/lib/seed';
import type { User } from '@/lib/types';
import { useCircle } from '@/stores/circle';

/** Avatar size in UserRow, so the separator inset lines up with the text. */
const AVATAR = 44;

/**
 * Your circle, then people to know. Names and faces only. The list is never
 * counted, and "people to know" is in seed order, not by anything social.
 */
export default function CircleScreen() {
  const following = useCircle((s) => s.following);
  const blocked = useCircle((s) => s.blocked);

  const yours = useMemo(
    () => following.map((id) => USERS_BY_ID[id]).filter((u): u is User => u !== undefined),
    [following],
  );
  const toKnow = useMemo(
    () => USERS.filter((u) => !following.includes(u.id) && !blocked.includes(u.id)),
    [following, blocked],
  );

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <ScreenHeader title={copy.circle.title} />
      <View style={styles.sections}>
        <View>
          <ThemedText variant="label" color="textSecondary" style={styles.label}>
            {copy.circle.yours}
          </ThemedText>
          {yours.length === 0 ? (
            <EmptyState icon="person.2" title={copy.circle.emptyTitle} body={copy.circle.emptyBody} />
          ) : (
            <RowList users={yours} />
          )}
        </View>
        {toKnow.length > 0 ? (
          <View>
            <ThemedText variant="label" color="textSecondary" style={styles.label}>
              {copy.circle.toKnow}
            </ThemedText>
            <RowList users={toKnow} />
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

function RowList({ users }: { users: User[] }) {
  const theme = useTheme();
  return (
    <View>
      {users.map((user, i) => (
        <View key={user.id}>
          {i > 0 ? <View style={[styles.separator, { backgroundColor: theme.hairline }]} /> : null}
          <UserRow user={user} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sections: { gap: Spacing.xl },
  label: { marginHorizontal: ScreenMargin, marginBottom: Spacing.sm },
  separator: { height: 1, marginLeft: ScreenMargin + AVATAR + Spacing.md },
});
