import { Image, Pressable, View } from 'react-native';
import { Link, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/Text';
import { BRAND_LOGO_URL } from '@/lib/format';

/**
 * Top brand header. Safe-area aware. Shows the EyeSwap wordmark/logo and an
 * optional trailing element (profile avatar, message badge, etc.).
 */
export function Header({
  right,
  showBack = false,
  title,
}: {
  right?: React.ReactNode;
  showBack?: boolean;
  title?: string;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ paddingTop: insets.top + 8 }}
      className="bg-paper px-5 pb-3">
      <View className="flex-row items-center justify-between">
        {showBack ? (
          <Pressable
            hitSlop={12}
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-white/80">
            <Ionicons name="chevron-back" size={22} color="#101013" />
          </Pressable>
        ) : null}

        {title ? (
          <Text className="font-sans-bold text-2xl text-ink">{title}</Text>
        ) : (
          <View className="flex-row items-center gap-2.5">
            <Image
              source={{ uri: BRAND_LOGO_URL }}
              style={{ width: 34, height: 34, borderRadius: 9 }}
              resizeMode="contain"
            />
            <Text className="font-sans-extrabold text-xl tracking-tight text-ink">
              EyeSwap
            </Text>
          </View>
        )}

        <View className="min-w-[40px] items-end">{right ?? <View className="h-10 w-10" />}</View>
      </View>
    </View>
  );
}
