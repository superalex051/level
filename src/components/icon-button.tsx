import type { SFSymbol } from 'expo-symbols';
import { StyleSheet } from 'react-native';

import { Icon } from '@/components/icon';
import { PressableScale, type PressableScaleProps } from '@/components/pressable-scale';
import { TouchTarget } from '@/constants/theme';

export interface IconButtonProps extends Omit<PressableScaleProps, 'children'> {
  name: SFSymbol;
  label: string;
  color: string;
  size?: number;
}

/** A 44pt tap target around a symbol. */
export function IconButton({ name, label, color, size = 24, style, ...rest }: IconButtonProps) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={4}
      style={[styles.target, style]}
      {...rest}>
      <Icon name={name} color={color} size={size} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  target: { width: TouchTarget, height: TouchTarget, alignItems: 'center', justifyContent: 'center' },
});
