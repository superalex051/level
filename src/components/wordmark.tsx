import { StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { copy } from '@/lib/copy';

/** The mark (an equals sign) and the name. Drawn with views, no asset load. */
export function Wordmark({ size = 24 }: { size?: number }) {
  const theme = useTheme();
  const bar = {
    width: size * 0.8,
    height: Math.max(3, size * 0.16),
    borderRadius: size,
    backgroundColor: theme.accent,
  };
  return (
    <View style={[styles.row, { gap: size * 0.35 }]} accessibilityRole="header" accessibilityLabel={copy.app}>
      <View style={{ gap: size * 0.18 }}>
        <View style={bar} />
        <View style={bar} />
      </View>
      <Text
        style={{
          fontFamily: Fonts.rounded,
          fontSize: size,
          lineHeight: size * 1.15,
          fontWeight: '700',
          letterSpacing: -0.4,
          color: theme.text,
        }}>
        {copy.app}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});
