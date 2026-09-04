import { StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing, Type } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { copy } from '@/lib/copy';
import type { FeedReason } from '@/lib/types';
import { getUser } from '@/stores/session';

export function reasonLabel(reason: FeedReason): string {
  switch (reason.kind) {
    case 'yours':
      return copy.reasons.yours;
    case 'circle':
      return copy.reasons.circle;
    case 'author':
      return copy.reasons.author(getUser(reason.name)?.name.split(' ')[0] ?? reason.name);
    case 'tag':
      return copy.reasons.tag(reason.tag);
    case 'new':
      return copy.reasons.new;
    case 'suggested':
      return copy.reasons.suggested;
  }
}

/** Why a post is in your feed. Every card says. Nothing here encodes popularity. */
export function WhyChip({ reason }: { reason: FeedReason }) {
  const theme = useTheme();
  return (
    <View style={[styles.chip, { backgroundColor: theme.surfaceRaised }]}>
      <Text style={[Type.footnote, { color: theme.textSecondary }]}>{reasonLabel(reason)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.chip,
  },
});
