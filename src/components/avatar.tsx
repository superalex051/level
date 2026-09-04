import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface AvatarProps {
  name: string;
  uri?: string;
  size?: number;
}

/** A face. Falls back to the first letter on the accent, which is what you get until you add a photo. */
export function Avatar({ name, uri, size = 40 }: AvatarProps) {
  const theme = useTheme();
  const shape = { width: size, height: size, borderRadius: size / 2 };
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[shape, { backgroundColor: theme.surfaceRaised }]}
        contentFit="cover"
        transition={150}
        accessibilityLabel={name}
      />
    );
  }
  return (
    <View style={[shape, styles.fallback, { backgroundColor: theme.accent }]} accessibilityLabel={name}>
      <Text style={{ fontFamily: Fonts.rounded, fontSize: size * 0.42, fontWeight: '700', color: theme.onAccent }}>
        {name.trim().charAt(0).toUpperCase() || '?'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: { alignItems: 'center', justifyContent: 'center' },
});
