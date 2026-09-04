import * as Haptics from 'expo-haptics';
import { ActionSheetIOS, Platform } from 'react-native';

import { copy } from '@/lib/copy';
import type { User } from '@/lib/types';
import { useCircle } from '@/stores/circle';
import { useEngagement } from '@/stores/engagement';
import { getUser } from '@/stores/session';
import { useUi } from '@/stores/ui';

/**
 * "Send to someone": a private share to one person in your circle. Native
 * action sheet on iOS, which is the platform this MVP is for. Nothing about
 * it is public and it is never counted for a viewer.
 */
export function openSendSheet(postId: string) {
  const showToast = useUi.getState().showToast;
  const people = useCircle
    .getState()
    .following.map((id) => getUser(id))
    .filter((u): u is User => !!u);

  if (people.length === 0) {
    showToast(copy.send.needCircle);
    return;
  }

  const deliver = (person: User) => {
    useEngagement.getState().markSent(postId, person.id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showToast(copy.send.sent(person.name.split(' ')[0]));
  };

  if (Platform.OS !== 'ios') {
    deliver(people[0]);
    return;
  }

  const names = people.map((p) => p.name);
  ActionSheetIOS.showActionSheetWithOptions(
    {
      title: copy.send.title,
      options: [...names, copy.send.notNow],
      cancelButtonIndex: names.length,
    },
    (index) => {
      if (index < people.length) deliver(people[index]);
    },
  );
}
