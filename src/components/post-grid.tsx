import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, useWindowDimensions, type FlatListProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { copy } from '@/lib/copy';
import type { Post } from '@/lib/types';

const GAP = 2;
const COLUMNS = 3;

export interface PostGridProps
  extends Pick<
    FlatListProps<Post>,
    'ListHeaderComponent' | 'ListEmptyComponent' | 'contentInsetAdjustmentBehavior' | 'style'
  > {
  posts: Post[];
}

/**
 * Three-column grid of a person's posts. Meant to be the screen root under a
 * tab so iOS insets it for the tab bar. No counts, no ordering by anything but time.
 */
export function PostGrid({ posts, ...rest }: PostGridProps) {
  const router = useRouter();
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const size = (width - GAP * (COLUMNS - 1)) / COLUMNS;

  return (
    <FlatList
      data={posts}
      numColumns={COLUMNS}
      keyExtractor={(p) => p.id}
      columnWrapperStyle={styles.row}
      ItemSeparatorComponent={() => <></>}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <Pressable
          accessibilityRole="imagebutton"
          accessibilityLabel={item.caption || copy.card.photo}
          onPress={() => router.push({ pathname: '/post/[id]', params: { id: item.id } })}
          style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
          <Image
            source={{ uri: item.image }}
            style={{ width: size, height: size, backgroundColor: theme.surfaceRaised }}
            contentFit="cover"
            transition={150}
          />
        </Pressable>
      )}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  row: { gap: GAP },
  content: { gap: GAP },
});
