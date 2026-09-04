import type { SFSymbol } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Icon } from '@/components/icon';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface EmptyStateProps {
  icon: SFSymbol;
  title: string;
  body: string;
  action?: { label: string; onPress: () => void };
}

/** Acknowledge, explain the value, one action. */
export function EmptyState({ icon, title, body, action }: EmptyStateProps) {
  const theme = useTheme();
  return (
    <View style={styles.wrap}>
      <Icon name={icon} color={theme.textTertiary} size={36} weight="light" />
      <ThemedText variant="headline" style={styles.center}>
        {title}
      </ThemedText>
      <ThemedText variant="subhead" color="textSecondary" style={styles.center}>
        {body}
      </ThemedText>
      {action ? <Button label={action.label} onPress={action.onPress} variant="secondary" style={styles.action} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.xxl },
  center: { textAlign: 'center' },
  action: { marginTop: Spacing.sm },
});
