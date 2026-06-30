import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/Text';
import { Button } from '@/components/ui/Button';
import { useOrdersStore } from '@/store/useOrdersStore';

export default function MerciScreen() {
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const { markPaid } = useOrdersStore();
  const insets = useSafeAreaInsets();
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    WebBrowser.dismissBrowser().catch(() => {});
    if (orderId) {
      setMarking(true);
      markPaid(orderId).finally(() => setMarking(false));
    }
  }, [orderId, markPaid]);

  return (
    <View
      className="flex-1 items-center justify-center bg-paper px-8"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <View className="items-center">
        <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-coral/10">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-coral">
            <Ionicons name="checkmark" size={40} color="#fff" />
          </View>
        </View>

        <Text className="font-sans-extrabold text-2xl text-ink">Paiement confirmé</Text>
        <Text className="mt-3 text-center text-[15px] leading-relaxed text-neutral-500">
          {marking
            ? 'Confirmation de votre réservation…'
            : 'Votre réservation a bien été enregistrée. Le photographe a été notifié et vous pouvez échanger via la messagerie.'}
        </Text>

        <View className="mt-8 w-full max-w-xs gap-3">
          <Button label="Voir mes messages" onPress={() => router.replace('/messages')} />
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
