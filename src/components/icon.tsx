import { SymbolView, type SFSymbol, type SymbolViewProps } from 'expo-symbols';
import type { StyleProp, ViewStyle } from 'react-native';

export interface IconProps {
  name: SFSymbol;
  color: string;
  size?: number;
  weight?: SymbolViewProps['weight'];
  style?: StyleProp<ViewStyle>;
}

/** SF Symbol. iOS renders the real glyph; other platforms get expo-symbols' fallback. */
export function Icon({ name, color, size = 22, weight = 'regular', style }: IconProps) {
  return (
    <SymbolView
      name={name}
      size={size}
      tintColor={color}
      weight={weight}
      resizeMode="scaleAspectFit"
      style={[{ width: size, height: size }, style]}
    />
  );
}
