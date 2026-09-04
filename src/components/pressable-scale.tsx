import { useState } from 'react';
import { Animated, Easing, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { Motion } from '@/constants/theme';

export interface PressableScaleProps extends Omit<PressableProps, 'style' | 'children'> {
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  children?: React.ReactNode;
}

/** Press feedback: scale 0.97 over 120ms, ease-out, no bounce. The house press. */
export function PressableScale({
  style,
  scaleTo = Motion.pressScale,
  onPressIn,
  onPressOut,
  children,
  ...rest
}: PressableScaleProps) {
  // Lazy state, not a ref: the compiler lint forbids reading a ref during render.
  const [scale] = useState(() => new Animated.Value(1));
  const reduceMotion = useReducedMotion();

  const animateTo = (value: number) => {
    if (reduceMotion) return;
    Animated.timing(scale, {
      toValue: value,
      duration: Motion.press,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPressIn={(e) => {
        animateTo(scaleTo);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        animateTo(1);
        onPressOut?.(e);
      }}
      {...rest}>
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}
