import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

import { Button } from '@/components/button';
import { IconButton } from '@/components/icon-button';
import { Radius, ScreenMargin, Spacing, Type } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { copy } from '@/lib/copy';
import { usePosts } from '@/stores/posts';
import { useUi } from '@/stores/ui';

interface Photo {
  uri: string;
  /** width / height */
  aspect: number;
}

const CAPTION_MAX = 300;

/**
 * New post, as a modal. Pick from the library (PHPicker, no permission prompt)
 * or take a sample photo so the loop can be walked in the simulator. Posting
 * hands off to the posts store, which starts the simulated circle.
 */
export default function ComposeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [caption, setCaption] = useState('');

  const contentWidth = width - ScreenMargin * 2;
  const dirty = photo !== null || caption.trim().length > 0;

  const close = () => {
    if (!dirty) {
      router.back();
      return;
    }
    Alert.alert(copy.compose.discardTitle, copy.compose.discardBody, [
      { text: copy.compose.keepEditing, style: 'cancel' },
      { text: copy.compose.discard, style: 'destructive', onPress: () => router.back() },
    ]);
  };

  const choose = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.85 });
    if (result.canceled) return;
    const asset = result.assets[0];
    if (!asset) return;
    setPhoto({ uri: asset.uri, aspect: asset.width > 0 && asset.height > 0 ? asset.width / asset.height : 1 });
  };

  const sample = () => {
    setPhoto({ uri: `https://picsum.photos/seed/level-mine-${Date.now()}/900/1125`, aspect: 0.8 });
  };

  const post = () => {
    if (!photo) return;
    usePosts.getState().createPost({ image: photo.uri, caption, aspect: photo.aspect });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    useUi.getState().showToast(copy.compose.posted);
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => <IconButton name="xmark" label={copy.compose.close} color={theme.text} onPress={close} />,
          headerRight: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={copy.compose.post}
              accessibilityState={{ disabled: !photo }}
              disabled={!photo}
              onPress={post}
              hitSlop={8}
              style={{ opacity: photo ? 1 : 0.4 }}>
              <Text style={[Type.headline, { color: theme.accent }]}>{copy.compose.post}</Text>
            </Pressable>
          ),
        }}
      />
      <KeyboardAvoidingView behavior="padding" style={styles.flex}>
        <ScrollView
          style={[styles.flex, { backgroundColor: theme.canvas }]}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive">
          {photo ? (
            <View style={styles.preview}>
              <Image
                source={{ uri: photo.uri }}
                style={{
                  width: contentWidth,
                  height: Math.round(contentWidth / photo.aspect),
                  borderRadius: Radius.photo,
                  backgroundColor: theme.surfaceRaised,
                }}
                contentFit="cover"
                transition={150}
              />
              <Button label={copy.compose.change} variant="ghost" compact onPress={choose} />
            </View>
          ) : (
            <View style={[styles.panel, { backgroundColor: theme.surface, borderColor: theme.hairline }]}>
              <Button label={copy.compose.choose} icon="photo.on.rectangle" onPress={choose} />
              <Button label={copy.compose.sample} variant="ghost" onPress={sample} />
            </View>
          )}
          <TextInput
            multiline
            value={caption}
            onChangeText={setCaption}
            maxLength={CAPTION_MAX}
            placeholder={copy.compose.captionPlaceholder}
            placeholderTextColor={theme.textTertiary}
            accessibilityLabel={copy.compose.captionPlaceholder}
            style={[Type.body, styles.caption, { color: theme.text }]}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: ScreenMargin, gap: Spacing.lg },
  preview: { alignItems: 'center', gap: Spacing.sm },
  panel: {
    minHeight: 320,
    borderRadius: Radius.sheet,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.xl,
  },
  caption: { minHeight: 88, textAlignVertical: 'top', paddingVertical: Spacing.sm },
});
