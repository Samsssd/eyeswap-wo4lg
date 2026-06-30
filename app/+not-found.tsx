import { Link, Stack } from 'expo-router';
import { View } from 'react-native';

import { Text } from '@/components/Text';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center p-5 bg-white dark:bg-neutral-900">
        <Text className="font-sans-bold text-xl text-neutral-900 dark:text-white">
          This screen doesn't exist.
        </Text>

        <Link href="/" className="mt-4 py-4">
          <Text className="text-sm text-blue-600">Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
