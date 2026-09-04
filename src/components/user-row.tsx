import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { CircleButton } from '@/components/circle-button';
import { ThemedText } from '@/components/themed-text';
import { ScreenMargin, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { User } from '@/lib/types';

export interface UserRowProps {
  user: User;
  /** Hide the circle button, for the welcome step where selection is local. */
  trailing?: React.ReactNode;
  /** Replaces the default push to their profile, for the welcome step where a tap toggles selection. */
  onPress?: () => void;
}

export function UserRow({ user, trailing, onPress }: UserRowProps) {
  const theme = useTheme();
  const router = useRouter();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={user.name}
      onPress={onPress ?? (() => router.push({ pathname: '/user/[id]', params: { id: user.id } }))}
      style={({ pressed }) => [styles.row, { backgroundColor: pressed ? theme.surfaceRaised : 'transparent' }]}>
      <Avatar name={user.name} uri={user.avatar} size={44} />
      <View style={styles.text}>
        <ThemedText variant="headline" numberOfLines={1}>
          {user.name}
        </ThemedText>
        <ThemedText variant="subhead" color="textSecondary" numberOfLines={1}>
          {user.bio}
        </ThemedText>
      </View>
      {trailing ?? <CircleButton userId={user.id} compact />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: ScreenMargin,
    paddingVertical: Spacing.md,
  },
  text: { flex: 1, gap: 2 },
});
