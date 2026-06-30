import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/Text';

export function EmptyState({
  icon = 'images-outline',
  title,
  message,
  action,
}: {
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  message?: string;
  action?: React.ReactNode;
}) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <View className="mb-5 h-20 w-20 items-center justify-center rounded-full bg-white">
        <View className="h-14 w-14 items-center justify-center rounded-full bg-paper">
          <Ionicons name={icon} size={28} color="#FF5A3C" />
        </View>
      </View>
      <Text className="font-sans-bold text-lg text-ink text-center">{title}</Text>
      {message ? (
        <Text className="mt-2 text-center text-sm text-neutral-500">{message}</Text>
      ) : null}
      {action ? <View className="mt-6">{action}</View> : null}
    </View>
  );
}
