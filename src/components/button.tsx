import { StyleSheet, Text, View } from 'react-native';
import type { SFSymbol } from 'expo-symbols';

import { Icon } from '@/components/icon';
import { PressableScale, type PressableScaleProps } from '@/components/pressable-scale';
import { Radius, Spacing, TouchTarget, Type } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';

export interface ButtonProps extends Omit<PressableScaleProps, 'children'> {
  label: string;
  variant?: ButtonVariant;
  icon?: SFSymbol;
  compact?: boolean;
  fullWidth?: boolean;
}

export function Button({ label, variant = 'primary', icon, compact, fullWidth, disabled, style, ...rest }: ButtonProps) {
  const theme = useTheme();
  const colors = {
    primary: { bg: theme.accent, fg: theme.onAccent },
    secondary: { bg: theme.accentSoft, fg: theme.accent },
    ghost: { bg: 'transparent', fg: theme.accent },
    destructive: { bg: 'transparent', fg: theme.danger },
  }[variant];

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      style={[
        styles.base,
        compact && styles.compact,
        fullWidth && styles.fullWidth,
        { backgroundColor: colors.bg, opacity: disabled ? 0.4 : 1 },
        style,
      ]}
      {...rest}>
      <View style={styles.row}>
        {icon ? <Icon name={icon} color={colors.fg} size={compact ? 16 : 18} weight="semibold" /> : null}
        <Text style={[compact ? Type.subhead : Type.headline, { color: colors.fg, fontWeight: '600' }]}>{label}</Text>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: TouchTarget,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compact: {
    minHeight: 34,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.chip + 2,
  },
  fullWidth: { alignSelf: 'stretch' },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
});
