import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { ScreenMargin, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { copy } from '@/lib/copy';

const NUMBER = 24;

/**
 * The rules, as a modal. Reachable before onboarding from the welcome step
 * and after it from the You tab, so the root layout keeps this route outside
 * both guards. The native header carries the title.
 */
export default function RulesScreen() {
  const theme = useTheme();
  const router = useRouter();
  return (
    <SafeAreaView edges={['bottom']} style={[styles.fill, { backgroundColor: theme.canvas }]}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        <ThemedText>{copy.rules.intro}</ThemedText>
        <View style={styles.list}>
          {copy.rules.items.map((item, i) => (
            <View key={item} style={styles.row}>
              <View style={[styles.number, { backgroundColor: theme.accentSoft }]}>
                <ThemedText variant="footnote" color="accent" style={styles.numberText}>
                  {i + 1}
                </ThemedText>
              </View>
              <ThemedText style={styles.text}>{item}</ThemedText>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button label={copy.rules.close} fullWidth onPress={() => router.back()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { padding: ScreenMargin, gap: Spacing.xl },
  list: { gap: Spacing.md },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  number: {
    width: NUMBER,
    height: NUMBER,
    borderRadius: NUMBER / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: { fontWeight: '600' },
  text: { flex: 1 },
  footer: { paddingHorizontal: ScreenMargin, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
});
