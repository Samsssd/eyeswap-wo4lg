import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/Text';

// Starter Home screen. Replace its contents with your app's first screen.
export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900">
      <View className="flex-1 items-center justify-center gap-2 p-6">
        <Text className="font-sans-bold text-2xl text-neutral-900 dark:text-white">
          Welcome
        </Text>
        <Text className="text-base text-neutral-500 dark:text-neutral-400 text-center">
          Edit app/(tabs)/index.tsx to start building.
        </Text>
      </View>
    </SafeAreaView>
  );
}
