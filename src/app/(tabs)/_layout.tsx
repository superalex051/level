import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { useTheme } from '@/hooks/use-theme';
import { copy } from '@/lib/copy';

/**
 * Native iOS tab bar. Tinted with the text color, not the accent, because
 * terracotta is reserved for circle actions and the liked state. No badges:
 * a badge is a count, and counts never reach a viewer.
 */
export default function TabsLayout() {
  const theme = useTheme();
  return (
    <NativeTabs tintColor={theme.text}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>{copy.tabs.feed}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'photo.on.rectangle', selected: 'photo.fill.on.rectangle.fill' }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="circle">
        <NativeTabs.Trigger.Label>{copy.tabs.circle}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'person.2', selected: 'person.2.fill' }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="you">
        <NativeTabs.Trigger.Label>{copy.tabs.you}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' }} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
