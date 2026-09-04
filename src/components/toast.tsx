import { useEffect, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Motion, Radius, Spacing, Type } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useUi, type Toast } from '@/stores/ui';

/** One toast at a time, above the tab bar. Optional single action (Undo). */
export function ToastHost() {
  const toast = useUi((s) => s.toast);
  const hideToast = useUi((s) => s.hideToast);
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const [opacity] = useState(() => new Animated.Value(0));

  // Keep the last message around while it fades out. Adjusted during render
  // on purpose (the React-sanctioned derived-state pattern) so no ref is read
  // during render and no setState runs inside an effect.
  const [shown, setShown] = useState<Toast | null>(toast);
  if (toast && toast !== shown) setShown(toast);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: toast ? 1 : 0,
      duration: reduceMotion ? 0 : Motion.fade,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [toast, opacity, reduceMotion]);

  if (!shown) return null;

  return (
    <Animated.View
      pointerEvents={toast ? 'box-none' : 'none'}
      style={[styles.host, { bottom: insets.bottom + 72, opacity }]}>
      <View style={[styles.toast, { backgroundColor: theme.text }]} accessibilityLiveRegion="polite">
        <Text style={[Type.subhead, { color: theme.canvas, flexShrink: 1 }]}>{shown.message}</Text>
        {shown.action ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              shown.action?.onPress();
              hideToast();
            }}
            hitSlop={8}>
            <Text style={[Type.headline, { color: theme.accent }]}>{shown.action.label}</Text>
          </Pressable>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  host: { position: 'absolute', left: 0, right: 0, alignItems: 'center', paddingHorizontal: Spacing.lg },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.button,
    maxWidth: 420,
  },
});
