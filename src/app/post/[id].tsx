import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { InsightsPanel } from '@/components/insights-panel';
import { PostCard } from '@/components/post-card';
import { Spacing } from '@/constants/theme';
import { usePost } from '@/hooks/use-posts';
import { copy } from '@/lib/copy';
import { ME_ID, useUser } from '@/stores/session';

/**
 * One post, full size. The card already carries the actions. If it is yours,
 * the insights panel sits under it. There is no comment section because
 * comments do not exist; see AGENTS.md.
 */
export default function PostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const post = usePost(id);
  const author = useUser(post?.authorId ?? '');

  if (!post) {
    return <EmptyState icon="photo" title={copy.post.notFound} body={copy.post.notFoundBody} />;
  }

  const mine = post.authorId === ME_ID;
  const title = author?.name.split(' ')[0] || copy.post.title;

  return (
    <>
      <Stack.Screen options={{ title }} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        <PostCard post={post} detail />
        {mine ? (
          <View style={styles.insights}>
            <InsightsPanel postId={post.id} />
          </View>
        ) : null}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: Spacing.xxl },
  insights: { marginTop: Spacing.lg },
});
