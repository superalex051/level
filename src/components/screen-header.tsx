import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ScreenMargin, Spacing } from '@/constants/theme';

export interface ScreenHeaderProps {
  title?: string;
  /** Replaces the title, for the wordmark. */
  children?: ReactNode;
  right?: ReactNode;
}

/**
 * In-screen large title for tab screens. The native header is hidden there
 * because it cannot render SF Pro Rounded.
 */
export function ScreenHeader({ title, children, right }: ScreenHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.title}>
        {children ?? (
          <ThemedText variant="largeTitle" accessibilityRole="header">
            {title}
          </ThemedText>
        )}
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ScreenMargin,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  title: { flex: 1 },
  right: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
});
