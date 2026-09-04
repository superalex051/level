import * as Haptics from 'expo-haptics';

import { Button } from '@/components/button';
import { copy } from '@/lib/copy';
import { useCircle, useInCircle } from '@/stores/circle';
import { getUser } from '@/stores/session';
import { useUi } from '@/stores/ui';

export interface CircleButtonProps {
  userId: string;
  compact?: boolean;
}

/**
 * Add to circle / In your circle. Removing is silent for them and undoable
 * for you: a toast with Undo instead of a confirmation dialog.
 */
export function CircleButton({ userId, compact }: CircleButtonProps) {
  const inCircle = useInCircle(userId);
  const add = useCircle((s) => s.add);
  const remove = useCircle((s) => s.remove);
  const showToast = useUi((s) => s.showToast);

  const onPress = () => {
    Haptics.selectionAsync();
    if (inCircle) {
      remove(userId);
      const name = getUser(userId)?.name.split(' ')[0] ?? 'them';
      showToast(copy.circle.removed(name), { label: copy.circle.undo, onPress: () => add(userId) });
    } else {
      add(userId);
    }
  };

  const label = compact
    ? inCircle
      ? copy.circle.addedShort
      : copy.circle.addShort
    : inCircle
      ? copy.circle.added
      : copy.circle.add;

  return (
    <Button
      label={label}
      variant={inCircle ? 'secondary' : 'primary'}
      icon={inCircle ? 'checkmark' : 'plus'}
      compact={compact}
      accessibilityState={{ selected: inCircle }}
      onPress={onPress}
    />
  );
}
