import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/avatar';
import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { Wordmark } from '@/components/wordmark';
import { Radius, ScreenMargin, Spacing, TouchTarget, Type } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { copy } from '@/lib/copy';
import { USERS } from '@/lib/seed';
import type { User } from '@/lib/types';
import { useCircle } from '@/stores/circle';
import { useSession } from '@/stores/session';

const MIN_NAME = 2;
const MAX_NAME = 30;
const AVATAR = 44;

type Step = 'name' | 'circle';

/**
 * First run. Two steps in one screen: your name, then who to add. Nothing
 * here navigates. finishOnboarding flips the root guard and the router lands
 * on the tabs by itself.
 */
export default function WelcomeScreen() {
  const theme = useTheme();
  const [step, setStep] = useState<Step>('name');
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<ReadonlySet<string>>(() => new Set());

  const canContinue = name.trim().length >= MIN_NAME;

  const goToCircle = () => {
    if (!canContinue) return;
    Keyboard.dismiss();
    setStep('circle');
  };

  const toggle = (id: string) => {
    Haptics.selectionAsync();
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Circle first, session last: finishOnboarding flips the root guard, so the
  // circle has to be in place before the feed mounts and reads it.
  const finish = () => {
    useCircle.getState().setFollowing([...selected]);
    useSession.getState().finishOnboarding(name);
  };

  return (
    <SafeAreaView style={[styles.fill, { backgroundColor: theme.canvas }]}>
      <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {step === 'name' ? (
          <NameStep name={name} onChangeName={setName} canContinue={canContinue} onContinue={goToCircle} />
        ) : (
          <CircleStep selected={selected} onToggle={toggle} onDone={finish} onSkip={finish} />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

interface NameStepProps {
  name: string;
  onChangeName: (name: string) => void;
  canContinue: boolean;
  onContinue: () => void;
}

function NameStep({ name, onChangeName, canContinue, onContinue }: NameStepProps) {
  const theme = useTheme();
  const router = useRouter();
  return (
    <View style={styles.fill}>
      <View style={styles.top}>
        <Wordmark size={40} />
        <ThemedText variant="title" style={styles.claim}>
          {copy.welcome.claim}
        </ThemedText>
        <ThemedText color="textSecondary">{copy.welcome.explain}</ThemedText>
        <View style={styles.field}>
          <ThemedText variant="headline">{copy.welcome.nameLabel}</ThemedText>
          <TextInput
            value={name}
            onChangeText={onChangeName}
            placeholder={copy.welcome.namePlaceholder}
            placeholderTextColor={theme.textTertiary}
            autoFocus
            autoCorrect={false}
            autoCapitalize="words"
            returnKeyType="done"
            maxLength={MAX_NAME}
            onSubmitEditing={onContinue}
            accessibilityLabel={copy.welcome.nameLabel}
            style={[
              Type.body,
              styles.input,
              { backgroundColor: theme.surface, borderColor: theme.hairline, color: theme.text },
            ]}
          />
        </View>
      </View>
      <View style={styles.bottom}>
        <Button label={copy.welcome.continue} fullWidth disabled={!canContinue} onPress={onContinue} />
        <View style={styles.rules}>
          <ThemedText variant="footnote" color="textSecondary" style={styles.center}>
            {copy.welcome.rulesLine}
          </ThemedText>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={copy.welcome.rulesLink}
            onPress={() => router.push('/rules')}
            hitSlop={8}
            style={styles.rulesLink}>
            <ThemedText variant="footnote" color="accent">
              {copy.welcome.rulesLink}
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

interface CircleStepProps {
  selected: ReadonlySet<string>;
  onToggle: (id: string) => void;
  onDone: () => void;
  onSkip: () => void;
}

function CircleStep({ selected, onToggle, onDone, onSkip }: CircleStepProps) {
  const theme = useTheme();
  return (
    <View style={styles.fill}>
      <FlatList
        data={USERS}
        keyExtractor={(u) => u.id}
        extraData={selected}
        style={styles.fill}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <ThemedText variant="title">{copy.welcome.circleTitle}</ThemedText>
            <ThemedText color="textSecondary">{copy.welcome.circleExplain}</ThemedText>
          </View>
        }
        ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: theme.hairline }]} />}
        renderItem={({ item }) => (
          <PickRow user={item} selected={selected.has(item.id)} onToggle={() => onToggle(item.id)} />
        )}
      />
      <View style={[styles.pinned, { borderTopColor: theme.hairline }]}>
        <Button label={copy.welcome.circleDone} fullWidth onPress={onDone} />
        <Button label={copy.welcome.circleSkip} variant="ghost" fullWidth onPress={onSkip} />
      </View>
    </View>
  );
}

interface PickRowProps {
  user: User;
  selected: boolean;
  onToggle: () => void;
}

/**
 * Local on purpose. UserRow taps through to the profile route, which the root
 * guard keeps out until onboarding is done, so here the row is inert and only
 * the button does anything.
 */
function PickRow({ user, selected, onToggle }: PickRowProps) {
  return (
    <View style={styles.row}>
      <Avatar name={user.name} uri={user.avatar} size={AVATAR} />
      <View style={styles.rowText}>
        <ThemedText variant="headline" numberOfLines={1}>
          {user.name}
        </ThemedText>
        <ThemedText variant="subhead" color="textSecondary" numberOfLines={1}>
          {user.bio}
        </ThemedText>
      </View>
      <Button
        label={selected ? copy.circle.addedShort : copy.circle.addShort}
        variant={selected ? 'secondary' : 'primary'}
        icon={selected ? 'checkmark' : 'plus'}
        compact
        hitSlop={6}
        accessibilityState={{ selected }}
        onPress={onToggle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  top: { flex: 1, paddingHorizontal: ScreenMargin, paddingTop: Spacing.xl, gap: Spacing.md },
  claim: { marginTop: Spacing.xl },
  field: { marginTop: Spacing.xl, gap: Spacing.sm },
  input: {
    height: 48,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.button,
    borderWidth: 1,
  },
  bottom: { paddingHorizontal: ScreenMargin, paddingTop: Spacing.md, gap: Spacing.sm },
  rules: { alignItems: 'center' },
  center: { textAlign: 'center' },
  rulesLink: { minHeight: TouchTarget, justifyContent: 'center' },
  listHeader: {
    paddingHorizontal: ScreenMargin,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  separator: { height: 1, marginLeft: ScreenMargin + AVATAR + Spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: ScreenMargin,
    paddingVertical: Spacing.md,
  },
  rowText: { flex: 1, gap: 2 },
  pinned: {
    paddingHorizontal: ScreenMargin,
    paddingTop: Spacing.md,
    gap: Spacing.xs,
    borderTopWidth: 1,
  },
});
