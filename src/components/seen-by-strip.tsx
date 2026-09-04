import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { useShallow } from 'zustand/react/shallow';

import { Avatar } from '@/components/avatar';
import { ThemedText } from '@/components/themed-text';
import { Motion, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { copy } from '@/lib/copy';
import { groupInsights, nameList } from '@/lib/insights';
import { useActivity } from '@/stores/activity';
import { getUser } from '@/stores/session';

const FACE = 24;
const MAX_FACES = 5;

export interface SeenByStripProps {
  postId: string;
}

/**
 * Faces and names of who saw your post. Only rendered under your own posts,
 * and never a number: past three names it says "and more", past five faces
 * it stops drawing them.
 */
export function SeenByStrip({ postId }: SeenByStripProps) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  // useShallow: filter returns a fresh array every call; shallow compare keeps
  // the selector from re-rendering (or looping) when nothing changed.
  const events = useActivity(useShallow((s) => s.events.filter((e) => e.postId === postId)));
  const { seenBy } = groupInsights(events, getUser);
  const hasFaces = seenBy.length > 0;

  // The one designed peak: the first face appearing. If the strip mounts with
  // faces already there, that moment already happened, so no fade and no haptic.
  // Lazy state, not useRef().current: the compiler lint forbids reading a ref in render.
  const [opacity] = useState(() => new Animated.Value(hasFaces ? 1 : 0));
  const celebrated = useRef(hasFaces);

  useEffect(() => {
    if (!hasFaces || celebrated.current) return;
    celebrated.current = true;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.timing(opacity, {
      toValue: 1,
      duration: reduceMotion ? 0 : Motion.peak,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [hasFaces, opacity, reduceMotion]);

  if (!hasFaces) {
    return (
      <View style={styles.wrap}>
        <ThemedText variant="footnote" color="textTertiary">
          {copy.seenBy.none}
        </ThemedText>
      </View>
    );
  }

  const label = copy.seenBy.sawThis(nameList(seenBy));

  return (
    <Animated.View style={[styles.wrap, styles.row, { opacity }]} accessible accessibilityLabel={label}>
      <View style={styles.faces}>
        {seenBy.slice(0, MAX_FACES).map((user, i) => (
          <View key={user.id} style={[styles.ring, { borderColor: theme.canvas }, i > 0 && styles.overlap]}>
            <Avatar name={user.name} uri={user.avatar} size={FACE} />
          </View>
        ))}
      </View>
      <ThemedText variant="footnote" color="textSecondary" style={styles.text} numberOfLines={2}>
        {label}
      </ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: Spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  faces: { flexDirection: 'row', alignItems: 'center' },
  // A 2pt canvas ring so overlapping faces read as separate people.
  ring: { borderWidth: 2, borderRadius: (FACE + 4) / 2 },
  overlap: { marginLeft: -8 },
  text: { flex: 1 },
});
