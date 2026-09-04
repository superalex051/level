import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ActionSheetIOS, Alert, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { CircleButton } from '@/components/circle-button';
import { EmptyState } from '@/components/empty-state';
import { IconButton } from '@/components/icon-button';
import { PostGrid } from '@/components/post-grid';
import { ThemedText } from '@/components/themed-text';
import { Radius, ScreenMargin, Spacing } from '@/constants/theme';
import { usePostsBy } from '@/hooks/use-posts';
import { useTheme } from '@/hooks/use-theme';
import { copy } from '@/lib/copy';
import { useCircle, useInCircle } from '@/stores/circle';
import { ME_ID, useUser } from '@/stores/session';
import { useUi } from '@/stores/ui';

/**
 * Someone else's profile. Name, bio, what they post about, add to circle, and
 * their posts. No numbers anywhere: not posts, not circle size. Every account
 * looks the same size; see the visibility matrix in AGENTS.md.
 */
export default function UserScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const user = useUser(id);
  const posts = usePostsBy(id);
  const inCircle = useInCircle(id);
  const isMe = id === ME_ID;

  if (!user) {
    return (
      <EmptyState
        icon="person.crop.circle.badge.questionmark"
        title={copy.profile.notFound}
        body={copy.profile.notFoundBody}
      />
    );
  }

  const firstName = user.name.split(' ')[0];

  const removeFromCircle = () => {
    useCircle.getState().remove(id);
    useUi.getState().showToast(copy.circle.removed(firstName), {
      label: copy.circle.undo,
      onPress: () => useCircle.getState().add(id),
    });
  };

  const confirmBlock = () => {
    Alert.alert(copy.profile.blockTitle(firstName), copy.profile.blockBody, [
      { text: copy.common.notNow, style: 'cancel' },
      {
        text: copy.profile.block,
        style: 'destructive',
        onPress: () => {
          useCircle.getState().block(id);
          useUi.getState().showToast(copy.profile.blocked(firstName));
          router.back();
        },
      },
    ]);
  };

  const openMenu = () => {
    const options = [copy.profile.block, ...(inCircle ? [copy.circle.remove] : []), copy.common.notNow];
    ActionSheetIOS.showActionSheetWithOptions(
      { options, destructiveButtonIndex: 0, cancelButtonIndex: options.length - 1 },
      (index) => {
        if (index === 0) confirmBlock();
        else if (index === 1 && inCircle) removeFromCircle();
      },
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: `@${user.handle}`,
          headerRight: isMe
            ? undefined
            : () => <IconButton name="ellipsis" label={copy.you.more} color={theme.textSecondary} onPress={openMenu} />,
        }}
      />
      <PostGrid
        posts={posts}
        contentInsetAdjustmentBehavior="automatic"
        ListHeaderComponent={
          <View style={styles.header}>
            <Avatar name={user.name} uri={user.avatar} size={80} />
            <ThemedText variant="title" accessibilityRole="header">
              {user.name}
            </ThemedText>
            {user.bio ? <ThemedText variant="body">{user.bio}</ThemedText> : null}
            {user.tags.length > 0 ? (
              <View style={styles.tags}>
                <ThemedText variant="footnote" color="textSecondary">
                  {copy.profile.postsAbout}
                </ThemedText>
                {user.tags.map((tag) => (
                  <View key={tag} style={[styles.chip, { backgroundColor: theme.surfaceRaised }]}>
                    <ThemedText variant="label" color="textSecondary">
                      {tag}
                    </ThemedText>
                  </View>
                ))}
              </View>
            ) : null}
            {isMe ? null : <CircleButton userId={id} />}
          </View>
        }
        ListEmptyComponent={
          <ThemedText variant="subhead" color="textSecondary" style={styles.empty}>
            {copy.profile.noPosts}
          </ThemedText>
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: { padding: ScreenMargin, gap: Spacing.md },
  tags: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: Spacing.sm },
  chip: { paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, borderRadius: Radius.chip },
  empty: { textAlign: 'center', padding: Spacing.xxl },
});
