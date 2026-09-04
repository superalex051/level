import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ActionSheetIOS, Alert, Pressable, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { EmptyState } from '@/components/empty-state';
import { Icon } from '@/components/icon';
import { IconButton } from '@/components/icon-button';
import { PostGrid } from '@/components/post-grid';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { ScreenMargin, Spacing, TouchTarget } from '@/constants/theme';
import { usePostsBy } from '@/hooks/use-posts';
import { useTheme } from '@/hooks/use-theme';
import { copy } from '@/lib/copy';
import { USERS_BY_ID } from '@/lib/seed';
import type { User } from '@/lib/types';
import { deleteAccount } from '@/stores/account';
import { useCircle } from '@/stores/circle';
import { ME_ID, useSession } from '@/stores/session';

/** Faces on the circle row. A sample of who is there, never how many. */
const FACES = 6;
const FACE = 28;
const FACE_BORDER = 2;
const FACE_OVERLAP = -8;

/**
 * Your own profile. Same shape as anyone else's: a face, a name, a grid.
 * The only extras are the ways in to compose and to the rules and delete.
 */
export default function YouScreen() {
  const router = useRouter();
  const posts = usePostsBy(ME_ID);
  return (
    <PostGrid
      posts={posts}
      contentInsetAdjustmentBehavior="automatic"
      ListHeaderComponent={<YouHeader />}
      ListEmptyComponent={
        <EmptyState
          icon="photo.on.rectangle"
          title={copy.you.emptyTitle}
          body={copy.you.emptyBody}
          action={{ label: copy.you.post, onPress: () => router.push('/compose') }}
        />
      }
    />
  );
}

function YouHeader() {
  const theme = useTheme();
  const router = useRouter();
  const name = useSession((s) => s.me.name);
  const handle = useSession((s) => s.me.handle);
  const following = useCircle((s) => s.following);
  const faces = useMemo(
    () =>
      following
        .map((id) => USERS_BY_ID[id])
        .filter((u): u is User => u !== undefined)
        .slice(0, FACES),
    [following],
  );

  const confirmDelete = () =>
    Alert.alert(copy.you.deleteTitle, copy.you.deleteBody, [
      { text: copy.you.keep, style: 'cancel' },
      { text: copy.you.deleteConfirm, style: 'destructive', onPress: () => deleteAccount() },
    ]);

  const onMore = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [copy.you.rules, copy.you.deleteAccount, copy.common.notNow],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 2,
      },
      (index) => {
        if (index === 0) router.push('/rules');
        else if (index === 1) confirmDelete();
      },
    );

  return (
    <View>
      <ScreenHeader
        title={copy.you.title}
        right={
          <>
            <IconButton
              name="plus"
              label={copy.feed.newPost}
              color={theme.text}
              onPress={() => router.push('/compose')}
            />
            <IconButton name="ellipsis" label={copy.you.more} color={theme.text} onPress={onMore} />
          </>
        }
      />
      <View style={styles.profile}>
        <Avatar name={name} size={80} />
        <View style={styles.identity}>
          <ThemedText variant="title">{name}</ThemedText>
          <ThemedText variant="subhead" color="textSecondary">
            {'@' + handle}
          </ThemedText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={copy.you.circleRow}
          onPress={() => router.push('/circle')}
          style={({ pressed }) => [
            styles.circleRow,
            { backgroundColor: pressed ? theme.surfaceRaised : 'transparent' },
          ]}>
          <ThemedText variant="headline" style={styles.circleLabel}>
            {copy.you.circleRow}
          </ThemedText>
          {faces.length > 0 ? (
            <View style={styles.faces}>
              {faces.map((u, i) => (
                <View
                  key={u.id}
                  style={[styles.face, { borderColor: theme.canvas, marginLeft: i === 0 ? 0 : FACE_OVERLAP }]}>
                  <Avatar name={u.name} uri={u.avatar} size={FACE} />
                </View>
              ))}
            </View>
          ) : (
            <ThemedText variant="subhead" color="textSecondary">
              {copy.circle.emptyTitle}
            </ThemedText>
          )}
          <Icon name="chevron.right" color={theme.textTertiary} size={16} weight="semibold" />
        </Pressable>
        <ThemedText variant="footnote" color="textTertiary">
          {copy.you.noCounts}
        </ThemedText>
      </View>
      <View style={[styles.divider, { backgroundColor: theme.hairline }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  profile: { paddingHorizontal: ScreenMargin, paddingBottom: Spacing.lg, gap: Spacing.lg },
  identity: { gap: 2 },
  circleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    minHeight: TouchTarget,
    // Bleed the pressed fill past the text and pull it back with the margin,
    // so the row's ink still lines up with the column above it.
    marginHorizontal: -Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: Spacing.sm,
  },
  circleLabel: { flex: 1 },
  faces: { flexDirection: 'row', alignItems: 'center' },
  face: {
    width: FACE + FACE_BORDER * 2,
    height: FACE + FACE_BORDER * 2,
    borderRadius: (FACE + FACE_BORDER * 2) / 2,
    borderWidth: FACE_BORDER,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: { height: 1 },
});
