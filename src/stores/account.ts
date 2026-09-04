import { useActivity } from '@/stores/activity';
import { useCircle } from '@/stores/circle';
import { useEngagement } from '@/stores/engagement';
import { usePosts } from '@/stores/posts';
import { useSession } from '@/stores/session';
import { useUi } from '@/stores/ui';

/**
 * Delete account, MVP edition: wipe every store on this phone. Session goes
 * last so the onboarding guard flips only after the data is already gone.
 */
export function deleteAccount() {
  useUi.getState().hideToast();
  useActivity.getState().reset();
  useEngagement.getState().reset();
  usePosts.getState().reset();
  useCircle.getState().reset();
  useSession.getState().reset();
}
