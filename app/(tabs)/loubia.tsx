import { ScrollView, View, Image, Pressable, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/Text';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1600336153113-d62c7ec3a8fd?auto=format&fit=crop&w=900&q=80';

const TAGS = ['Plat traditionnel', 'Végétarien', 'Mijoté'];

const STATS = [
  { icon: 'time-outline' as const, label: 'Prépa', value: '20 min' },
  { icon: 'flame-outline' as const, label: 'Cuisson', value: '1h30' },
  { icon: 'people-outline' as const, label: 'Parts', value: '4' },
];

const INGREDIENTS = [
  'Haricots blancs secs',
  'Tomates fraîches',
  'Oignon & ail',
  'Cumin & paprika',
  'Coriandre fraîche',
  "Huile d'olive",
];

const STEPS = [
  'Faire tremper les haricots une nuit.',
  'Faire revenir l’oignon, l’ail et les tomates.',
  'Ajouter les haricots égouttés et les épices.',
  'Mijoter à couvert pendant 1h30.',
  'Servir bien chaud, parsemé de coriandre.',
];

export default function LoubiaScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  return (
    <View className="flex-1 bg-paper">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        {/* Hero */}
        <View className="overflow-hidden rounded-b-[40px] bg-red-950 pb-10">
          <View
            className="px-6 pb-2"
            style={{ paddingTop: insets.top + 20 }}>
            <View className="flex-row items-center justify-between">
              <View className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5">
                <Text className="font-sans-semibold text-xs uppercase tracking-widest text-white/90">
                  Spécialité algérienne
                </Text>
              </View>
              <View className="h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <Ionicons name="heart-outline" size={20} color="#fff" />
              </View>
            </View>

            <Text className="mt-6 text-5xl font-sans-extrabold leading-[1.1] text-white">
              Alger
            </Text>
            <Text className="mt-4 max-w-[320px] text-base leading-relaxed text-white/80">
              Un mijoté onctueux de haricots blancs parfumé au cumin, idéal pour les repas conviviaux.
            </Text>

            <View className="mt-6 flex-row flex-wrap gap-2">
              {TAGS.map((tag) => (
                <View key={tag} className="rounded-full bg-white/10 px-3.5 py-1.5">
                  <Text className="font-sans-semibold text-xs text-white">{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Decorative circles */}
          <View className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
          <View className="absolute -left-20 bottom-0 h-40 w-40 rounded-full bg-white/5" />
        </View>

        {/* Floating image card */}
        <View
          className="mx-5 rounded-[32px] bg-white p-4"
          style={{
            marginTop: -56,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 24 },
            shadowOpacity: 0.12,
            shadowRadius: 32,
            elevation: 10,
          }}>
          <Image
            source={{ uri: HERO_IMAGE }}
            style={{ width: width - 56, height: 240, borderRadius: 24 }}
            resizeMode="cover"
          />
          <View className="mt-5 px-2 pb-2">
            <View className="flex-row items-center gap-2">
              <Ionicons name="star" size={16} color="#EF4444" />
              <Text className="font-sans-semibold text-sm text-ink">4.9</Text>
              <Text className="text-sm text-neutral-500">(128 avis)</Text>
            </View>
            <Text className="mt-3 text-xl font-sans-bold text-ink">
              Mijoté réconfortant aux haricots blancs
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View className="mx-5 mt-6 flex-row gap-3">
          {STATS.map((stat, i) => (
            <View
              key={i}
              className="flex-1 rounded-3xl bg-white p-4"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.05,
                shadowRadius: 12,
                elevation: 3,
              }}>
              <Ionicons name={stat.icon} size={22} color="#EF4444" />
              <Text className="mt-3 text-lg font-sans-bold text-ink">{stat.value}</Text>
              <Text className="text-xs text-neutral-500">{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Ingredients */}
        <View className="mt-8 px-6">
          <Text className="text-2xl font-sans-bold text-ink">Ingrédients</Text>
          <Text className="mt-1 text-sm text-neutral-500">
            Tout ce qu’il faut pour réussir le plat
          </Text>
          <View className="mt-5 gap-3">
            {INGREDIENTS.map((ingredient, i) => (
              <View
                key={i}
                className="flex-row items-center gap-3 rounded-2xl bg-white px-4 py-3.5">
                <View className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <Text className="flex-1 text-base text-ink">{ingredient}</Text>
                <Ionicons name="checkmark-circle-outline" size={22} color="#d1d5db" />
              </View>
            ))}
          </View>
        </View>

        {/* Preparation steps */}
        <View className="mt-8 px-6 pb-4">
          <Text className="text-2xl font-sans-bold text-ink">Préparation</Text>
          <Text className="mt-1 text-sm text-neutral-500">5 étapes simples</Text>
          <View className="mt-6 gap-6">
            {STEPS.map((step, i) => (
              <View key={i} className="flex-row gap-4">
                <View className="items-center">
                  <View className="h-8 w-8 items-center justify-center rounded-full bg-red-500">
                    <Text className="font-sans-bold text-xs text-white">{i + 1}</Text>
                  </View>
                  {i !== STEPS.length - 1 ? (
                    <View
                      style={{
                        width: 2,
                        flex: 1,
                        backgroundColor: '#FEE2E2',
                        marginTop: 8,
                      }}
                    />
                  ) : null}
                </View>
                <View className="flex-1 pb-3 pt-0.5">
                  <Text className="text-base leading-relaxed text-ink">{step}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* CTA */}
        <View className="px-6 pt-2">
          <Pressable
            className="h-14 items-center justify-center rounded-2xl bg-red-500"
            android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: false }}>
            <Text className="font-sans-bold text-base text-white">
              Essayer cette recette
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}