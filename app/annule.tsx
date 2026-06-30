import { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/Text';
import { Button } from '@/components/ui/Button';

export default function AnnuleScreen() {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    WebBrowser.dismissBrowser().catch(() => {});
  }, []);

  return (
    <View
      className="flex-1 items-center justify-center bg-paper px-8"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <View className="items-center">
        <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-neutral-200">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-neutral-400">
            <Ionicons name="close" size={36} color="#fff" />
          </View>
        </View>

        <Text className="font-sans-extrabold text-2xl text-ink">Paiement annulé</Text>
        <Text className="mt-3 text-center text-[15px] leading-relaxed text-neutral-500">
          Votre paiement a été annulé. Aucun montant n'a été débité. Vous pouvez réessayer quand vous le souhaitez.
        </Text>

        <View className="mt-8 w-full max-w-xs gap-3">
          <Button label="Réessayer" onPress={() => router.back()} />
          <Button
            label="Retour à l'accueil"
            variant="secondary"
            onPress={() => router.replace('/')}
          />
        </View>
      </View>
    </View>
  );
}
