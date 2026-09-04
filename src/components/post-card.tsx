import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
  type GestureResponderEvent,
} from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { Avatar } from '@/components/avatar';
import { Icon } from '@/components/icon';
import { IconButton } from '@/components/icon-button';
import { SeenByStrip } from '@/components/seen-by-strip';
import { ThemedText } from '@/components/themed-text';
import { WhyChip } from '@/components/why-chip';
import { Motion, Radius, ScreenMargin, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { copy } from '@/lib/copy';
import { openSendSheet } from '@/lib/send';
import { timeAgo } from '@/lib/time';
import type { FeedReason, Post } from '@/lib/types';
import { useEngagement } from '@/stores/engagement';
import { ME_ID, useUser } from '@/stores/session';
import { useUi } from '@/stores/ui';

export interface PostCardProps {
  post: Post;
  reason?: FeedReason;
  /** On the post screen: no why chip, and no actions that would push the same post again. */
  detail?: boolean;
}

const AVATAR = 36;
const ICON = 24;
const DOUBLE_TAP_MS = 300;
const HEART = 88;

/**
 * One post on the canvas, not a card on a card. Header and caption sit in the
 * screen margin, the photo is inset with its own radius. Nothing here is a
 * count: the like is a private toggle, and "seen by" only appears under your
 * own posts, as faces and names.
 */
export function PostCard({ post, reason, detail }: PostCardProps) {
  const theme = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const author = useUser(post.authorId);
  const liked = useEngagement((s) => !!s.liked[post.id]);
  const saved = useEngagement((s) => !!s.saved[post.id]);
  const toggleLike = useEngagement((s) => s.toggleLike);
  const toggleSave = useEngagement((s) => s.toggleSave);
  const hide = useEngagement((s) => s.hide);
  const report = useEngagement((s) => s.report);
  const showToast = useUi((s) => s.showToast);

  const mine = post.authorId === ME_ID;
  const name = author?.name ?? '';
  const firstName = name.split(' ')[0];
  const photoWidth = width - ScreenMargin * 2;
  const photoHeight = Math.round(photoWidth / post.aspect);
  const href = { pathname: '/post/[id]', params: { id: post.id } } as const;

  const openPost = () => router.push(href);
  const openAuthor = () => router.push({ pathname: '/user/[id]', params: { id: post.authorId } });

  const onLike = () => {
    Haptics.selectionAsync();
    toggleLike(post.id);
  };
  const onSave = () => {
    Haptics.selectionAsync();
    toggleSave(post.id);
  };
  const onHide = () => {
    hide(post.id);
    showToast(copy.moderation.hidden);
  };
  const onReport = () => {
    report(post.id);
    showToast(copy.moderation.reported);
  };

  // Double tap to like. The heart is a fade at 0.95 to 1, no burst, and it is
  // skipped under reduced motion because the filled symbol already confirms.
  const lastTap = useRef(0);
  // Lazy state, not useRef().current: the compiler lint forbids reading a ref in render.
  const [heartOpacity] = useState(() => new Animated.Value(0));
  const [heartScale] = useState(() => new Animated.Value(0.95));
  const playHeart = () => {
    if (reduceMotion) return;
    heartScale.setValue(0.95);
    heartOpacity.setValue(1);
    Animated.parallel([
      Animated.timing(heartScale, {
        toValue: 1,
        duration: Motion.fade,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(heartOpacity, {
        toValue: 0,
        duration: Motion.fade,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  };
  const onPhotoPress = (e: GestureResponderEvent) => {
    // The Link around the photo would navigate on tap; the tap belongs to the
    // double tap, and the Link is only here for its long press menu.
    e.preventDefault();
    const now = Date.now();
    if (now - lastTap.current < DOUBLE_TAP_MS) {
      lastTap.current = 0;
      if (!liked) onLike();
      playHeart();
    } else {
      lastTap.current = now;
    }
  };

  return (
    <View>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={name}
          disabled={mine}
          onPress={openAuthor}
          style={({ pressed }) => [styles.author, { opacity: pressed ? 0.7 : 1 }]}>
          <Avatar name={name} uri={author?.avatar} size={AVATAR} />
          <View style={styles.authorText}>
            <ThemedText variant="headline" numberOfLines={1}>
              {name}
            </ThemedText>
            <View style={styles.meta}>
              <ThemedText variant="footnote" color="textSecondary">
                {timeAgo(post.createdAt)}
              </ThemedText>
              {reason && !detail ? <WhyChip reason={reason} /> : null}
            </View>
          </View>
        </Pressable>
      </View>

      <View style={styles.photoRow}>
        <Link href={href} asChild>
          <Link.Trigger>
            <Pressable
              role="button"
              accessibilityLabel={post.caption || copy.card.photo}
              onPress={onPhotoPress}
              style={styles.photoWrap}>
              <Image
                source={{ uri: post.image }}
                style={{
                  width: photoWidth,
                  height: photoHeight,
                  borderRadius: Radius.photo,
                  backgroundColor: theme.surfaceRaised,
                }}
                contentFit="cover"
                transition={150}
              />
              <Animated.View
                pointerEvents="none"
                style={[styles.heart, { opacity: heartOpacity, transform: [{ scale: heartScale }] }]}>
                <Icon name="heart.fill" color={theme.accent} size={HEART} />
              </Animated.View>
            </Pressable>
          </Link.Trigger>
          {/* Direct MenuAction children only: Link.Menu filters by element type and does not look inside fragments. */}
          <Link.Menu>
            {!detail ? (
              <Link.MenuAction icon="arrow.up.right" onPress={openPost}>
                {copy.card.open}
              </Link.MenuAction>
            ) : null}
            {mine && !detail ? (
              <Link.MenuAction icon="eye" onPress={openPost}>
                {copy.card.insights}
              </Link.MenuAction>
            ) : null}
            {!mine ? (
              <Link.MenuAction icon="paperplane" onPress={() => openSendSheet(post.id)}>
                {copy.card.send}
              </Link.MenuAction>
            ) : null}
            {!mine ? (
              <Link.MenuAction icon="eye.slash" onPress={onHide}>
                {copy.card.hide}
              </Link.MenuAction>
            ) : null}
            {!mine ? (
              <Link.MenuAction icon="exclamationmark.bubble" destructive onPress={onReport}>
                {copy.card.report}
              </Link.MenuAction>
            ) : null}
          </Link.Menu>
        </Link>
      </View>

      <View style={styles.actions}>
        <IconButton
          name={liked ? 'heart.fill' : 'heart'}
          label={liked ? copy.card.unlike : copy.card.like}
          color={liked ? theme.accent : theme.textSecondary}
          size={ICON}
          accessibilityState={{ selected: liked }}
          onPress={onLike}
        />
        <IconButton
          name="paperplane"
          label={copy.card.send}
          color={theme.textSecondary}
          size={ICON}
          onPress={() => openSendSheet(post.id)}
        />
        <View style={styles.spacer} />
        {mine && !detail ? (
          <IconButton name="eye" label={copy.card.insights} color={theme.accent} size={ICON} onPress={openPost} />
        ) : null}
        <IconButton
          name={saved ? 'bookmark.fill' : 'bookmark'}
          label={saved ? copy.card.unsave : copy.card.save}
          color={theme.textSecondary}
          size={ICON}
          accessibilityState={{ selected: saved }}
          onPress={onSave}
        />
      </View>

      <View style={styles.body}>
        {post.caption ? (
          <ThemedText variant="body">
            <ThemedText variant="headline">{firstName}</ThemedText> {post.caption}
          </ThemedText>
        ) : null}
        {mine ? <SeenByStrip postId={post.id} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: ScreenMargin, paddingBottom: Spacing.sm },
  author: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  authorText: { flex: 1, gap: 2 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  photoRow: { paddingHorizontal: ScreenMargin },
  // A plain object, not an array: Link.Trigger merges this style through a Slot.
  photoWrap: { alignItems: 'center', justifyContent: 'center' },
  heart: { position: 'absolute' },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    // Pull the row in by the tap target's padding so the first glyph sits on the photo edge.
    paddingHorizontal: ScreenMargin - (TouchTarget - ICON) / 2,
    paddingTop: Spacing.xs,
  },
  spacer: { flex: 1 },
  body: { paddingHorizontal: ScreenMargin },
});
