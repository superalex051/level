import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View, type ViewToken } from 'react-native';

import { IconButton } from '@/components/icon-button';
import { PostCard } from '@/components/post-card';
import { ScreenHeader } from '@/components/screen-header';
import { Wordmark } from '@/components/wordmark';
import { Spacing } from '@/constants/theme';
import { useVisiblePosts } from '@/hooks/use-posts';
import { useTheme } from '@/hooks/use-theme';
import { copy } from '@/lib/copy';
import { rankFeed, type RankedPost } from '@/lib/rank';
import { useCircle } from '@/stores/circle';
import { useEngagement } from '@/stores/engagement';
import { ME_ID } from '@/stores/session';

const POST_GAP = 28;
const REFRESH_MS = 400;

function Gap() {
  return <View style={styles.gap} />;
}

// Module scope: FlatList requires these two to keep the same identity, and
// neither needs anything from the component.
const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 60 };
function onViewableItemsChanged({ viewableItems }: { viewableItems: ViewToken<RankedPost>[] }) {
  const markSeen = useEngagement.getState().markSeen;
  for (const token of viewableItems) {
    if (token.isViewable) markSeen(token.item.post.id);
  }
}

export default function FeedScreen() {
  const theme = useTheme();
  const router = useRouter();
  const posts = useVisiblePosts();
  const [refreshing, setRefreshing] = useState(false);
  // When the feed was last ranked. Bumped only by pull to refresh; `posts`
  // changes on your own new post (and on hide or block). Likes and seen marks
  // are read as a snapshot inside the memo so they never re-rank under the thumb.
  const [rankedAt, setRankedAt] = useState(() => Date.now());

  const ranked = useMemo(() => {
    const eng = useEngagement.getState();
    return rankFeed({
      posts,
      following: new Set(useCircle.getState().following),
      likedPostIds: new Set([...Object.keys(eng.liked), ...Object.keys(eng.sent)]),
      seenAt: eng.seen,
      meId: ME_ID,
      now: rankedAt,
    });
  }, [posts, rankedAt]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRankedAt(Date.now());
      setRefreshing(false);
    }, REFRESH_MS);
  };

  // No safe area padding on the header: "automatic" already insets the list
  // for the status bar, the same way the circle and you tabs rely on it.
  return (
    <FlatList
      data={ranked}
      keyExtractor={(item) => item.post.id}
      renderItem={({ item }) => <PostCard post={item.post} reason={item.reason} />}
      ItemSeparatorComponent={Gap}
      ListHeaderComponent={
        <ScreenHeader
          right={
            <IconButton
              name="plus"
              label={copy.feed.newPost}
              color={theme.accent}
              onPress={() => router.push('/compose')}
            />
          }>
          <Wordmark size={26} />
        </ScreenHeader>
      }
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.accent} />}
      viewabilityConfig={VIEWABILITY_CONFIG}
      onViewableItemsChanged={onViewableItemsChanged}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      style={[styles.list, { backgroundColor: theme.canvas }]}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1 },
  content: { paddingBottom: Spacing.xl },
  gap: { height: POST_GAP },
});
