import { Pressable, ScrollView, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Text } from '@/components/Text';
import { Header } from '@/components/Header';

/* ============================================================
   DATA
   ============================================================ */
const PROGRAMS = [
  {
    id: '01',
    title: 'Éducation Fondamentale',
    subtitle: 'Assis · Couché · Rappel',
    description:
      'Les bases indispensables pour une cohabitation sereine et harmonieuse au quotidien.',
    image:
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
    duration: '6 séances',
    level: 'Tous niveaux',
    icon: 'school-outline' as const,
  },
  {
    id: '02',
    title: 'Rééducation Comportementale',
    subtitle: 'Agressivité · Anxiété · Peurs',
    description:
      "Comprendre l'origine des troubles et mettre en place un protocole de correction durable.",
    image:
      'https://images.unsplash.com/photo-1517423440428-a5a00ad49331?auto=format&fit=crop&w=800&q=80',
    duration: '8 séances',
    level: 'Intermédiaire',
    icon: 'heart-circle-outline' as const,
  },
  {
    id: '03',
    title: 'École des Chiots',
    subtitle: '2 à 6 mois',
    description:
      'Sociabilisation et premiers apprentissages pour construire un adulte équilibré et confiant.',
    image:
      'https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&w=800&q=80',
    duration: '5 séances',
    level: 'Débutant',
    icon: 'paw-outline' as const,
  },
];

const TRAINERS = [
  {
    name: 'Claire Moreau',
    specialty: 'Comportementaliste',
    experience: '12 ans',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Thomas Renaud',
    specialty: 'Éducateur Canin',
    experience: '8 ans',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Sophie Laurent',
    specialty: 'Spécialiste Chiots',
    experience: '6 ans',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
  },
];

const STATS = [
  { value: '500+', label: 'Chiens éduqués' },
  { value: '12', label: "Ans d'expérience" },
  { value: '98%', label: 'Satisfaction' },
];

const STEPS = [
  {
    num: '01',
    title: 'Évaluation',
    description: 'Rencontre, observation et diagnostic personnalisé de votre compagnon.',
    icon: 'search-outline' as const,
  },
  {
    num: '02',
    title: 'Programme',
    description: "Élaboration d'un plan sur-mesure adapté au caractère et aux besoins de votre chien.",
    icon: 'create-outline' as const,
  },
  {
    num: '03',
    title: 'Suivi',
    description: 'Accompagnement continu, ajustements et conseils tout au long du parcours.',
    icon: 'trending-up-outline' as const,
  },
];

/* ============================================================
   HERO — immersive full-bleed cover
   ============================================================ */
function HeroSection() {
  const router = useRouter();

  return (
    <View className="relative overflow-hidden">
      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1080&q=80',
        }}
        className="w-full"
        style={{ height: 640 }}
        resizeMode="cover"
      />
      {/* Gradient overlay */}
      <View className="absolute inset-0 bg-black/35" />
      {/* Bottom fade */}
      <View className="absolute bottom-0 left-0 right-0 h-48 bg-black/50" />

      <View className="absolute inset-0 justify-between px-6 pt-10 pb-12">
        {/* Top row */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className="h-2 w-2 rounded-full bg-amber-400" />
            <Text className="font-sans-bold text-[10px] uppercase tracking-[3px] text-amber-400">
              Compagnon
            </Text>
          </View>
          <View className="rounded-full border border-white/25 px-3 py-1.5">
            <Text className="font-sans text-[10px] uppercase tracking-widest text-white/80">
              Éducation Canine
            </Text>
          </View>
        </View>

        {/* Headline */}
        <View>
          <Text className="font-sans-bold text-[44px] leading-[0.95] text-white">
            L'art d'éduquer
          </Text>
          <Text className="mt-1 font-sans-bold text-[44px] leading-[0.95] text-amber-400">
            son chien.
          </Text>
          <View className="mt-6 h-0.5 w-24 bg-amber-400" />
          <Text className="mt-5 max-w-[290px] font-sans text-[15px] leading-relaxed text-white/75">
            Des méthodes bienveillantes et scientifiques pour bâtir une relation
            harmonieuse avec votre compagnon à quatre pattes.
          </Text>

          <Pressable
            onPress={() => router.push('/sign-in')}
            className="mt-7 flex-row items-center justify-center gap-2 rounded-2xl bg-amber-400 px-8 py-4 active:opacity-80">
            <Text className="font-sans-bold text-sm uppercase tracking-wider text-ink">
              Commencer
            </Text>
            <Ionicons name="arrow-forward" size={16} color="#1a1a1a" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/* ============================================================
   TICKER
   ============================================================ */
function TickerStrip() {
  return (
    <View className="overflow-hidden bg-ink py-3.5">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} scrollEnabled={false}>
        <Text className="px-6 font-sans-bold text-xs uppercase tracking-[4px] text-amber-400">
          PATIENCE ✦ CONFIANCE ✦ HARMONIE ✦ PROGRÈS ✦ BIENVEILLANCE ✦ PATIENCE ✦ CONFIANCE ✦
          HARMONIE ✦ PROGRÈS ✦ BIENVEILLANCE
        </Text>
      </ScrollView>
    </View>
  );
}

/* ============================================================
   STATS
   ============================================================ */
function StatsSection() {
  return (
    <View className="flex-row px-6 py-12">
      {STATS.map((s, i) => (
        <View key={s.label} className="flex-1 items-center">
          <Text className="font-sans-bold text-3xl text-ink">{s.value}</Text>
          <Text className="mt-2 text-center font-sans text-[11px] uppercase tracking-wider text-ink/45">
            {s.label}
          </Text>
          {i < STATS.length - 1 && (
            <View className="absolute right-0 top-2 h-12 w-px bg-ink/10" />
          )}
        </View>
      ))}
    </View>
  );
}

/* ============================================================
   PROGRAMS
   ============================================================ */
function ProgramCard({
  program,
  index,
}: {
  program: (typeof PROGRAMS)[number];
  index: number;
}) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push('/sign-in')}
      className="mb-5 active:opacity-90"
      style={{ marginTop: index === 0 ? 0 : 0 }}>
      <View className="overflow-hidden rounded-3xl bg-white shadow-sm">
        {/* Image */}
        <View className="relative">
          <Image
            source={{ uri: program.image }}
            className="w-full"
            style={{ height: 220 }}
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/15" />
          {/* Number badge */}
          <View className="absolute left-4 top-4">
            <View className="rounded-2xl bg-ink/80 px-3 py-1.5">
              <Text className="font-sans-bold text-[11px] uppercase tracking-wider text-amber-400">
                {program.id}
              </Text>
            </View>
          </View>
          {/* Icon badge */}
          <View className="absolute right-4 top-4">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-white/90">
              <Ionicons name={program.icon} size={20} color="#1a1a1a" />
            </View>
          </View>
          {/* Duration & level */}
          <View className="absolute bottom-4 left-4 right-4 flex-row items-center gap-3">
            <View className="flex-row items-center gap-1.5 rounded-full bg-black/50 px-3 py-1">
              <Ionicons name="time-outline" size={11} color="#fbbf24" />
              <Text className="font-sans text-[10px] uppercase tracking-wide text-amber-400">
                {program.duration}
              </Text>
            </View>
            <View className="flex-row items-center gap-1.5 rounded-full bg-black/50 px-3 py-1">
              <Ionicons name="bar-chart-outline" size={11} color="#fbbf24" />
              <Text className="font-sans text-[10px] uppercase tracking-wide text-amber-400">
                {program.level}
              </Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View className="p-5">
          <Text className="font-sans text-[10px] uppercase tracking-[2px] text-amber-500">
            {program.subtitle}
          </Text>
          <Text className="mt-1.5 font-sans-bold text-xl leading-tight text-ink">
            {program.title}
          </Text>
          <Text className="mt-2.5 font-sans text-sm leading-relaxed text-ink/55">
            {program.description}
          </Text>
          <View className="mt-4 flex-row items-center gap-1.5">
            <Text className="font-sans-bold text-xs uppercase tracking-wider text-ink">
              Découvrir
            </Text>
            <Ionicons name="arrow-forward" size={14} color="#1a1a1a" />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function ProgramsSection() {
  return (
    <View className="px-6 py-10">
      <View className="mb-8">
        <Text className="mb-3 font-sans-bold text-[11px] uppercase tracking-[3px] text-amber-500">
          01 — Nos Programmes
        </Text>
        <Text className="font-sans-bold text-3xl leading-tight text-ink">
          Un parcours pour{'\n'}chaque chien
        </Text>
        <Text className="mt-3 font-sans text-sm leading-relaxed text-ink/50">
          Des programmes structurés, adaptés à l'âge, au tempérament et aux
          objectifs de votre compagnon.
        </Text>
      </View>

      {PROGRAMS.map((p, i) => (
        <ProgramCard key={p.id} program={p} index={i} />
      ))}
    </View>
  );
}

/* ============================================================
   PROCESS
   ============================================================ */
function ProcessSection() {
  return (
    <View className="bg-ink px-6 py-14">
      <Text className="mb-3 font-sans-bold text-[11px] uppercase tracking-[3px] text-amber-400">
        02 — Notre Méthode
      </Text>
      <Text className="mb-10 font-sans-bold text-3xl leading-tight text-white">
        Trois étapes,{'\n'}un résultat durable
      </Text>

      {STEPS.map((step, i) => (
        <View key={step.num}>
          <View className="flex-row items-start gap-5">
            <View className="h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400">
              <Ionicons name={step.icon} size={22} color="#1a1a1a" />
            </View>
            <View className="flex-1 pt-0.5">
              <View className="flex-row items-center gap-3">
                <Text className="font-sans-bold text-2xl text-amber-400">{step.num}</Text>
                <Text className="font-sans-bold text-lg text-white">{step.title}</Text>
              </View>
              <Text className="mt-2 font-sans text-sm leading-relaxed text-white/55">
                {step.description}
              </Text>
            </View>
          </View>
          {i < STEPS.length - 1 && (
            <View className="ml-6 my-5 h-8 w-px bg-amber-400/25" />
          )}
        </View>
      ))}
    </View>
  );
}

/* ============================================================
   TRAINERS
   ============================================================ */
function TrainerCard({
  name,
  specialty,
  experience,
  image,
}: {
  name: string;
  specialty: string;
  experience: string;
  image: string;
}) {
  return (
    <Pressable className="mr-4 active:opacity-80">
      <View className="relative overflow-hidden rounded-3xl" style={{ width: 260, height: 360 }}>
        <Image source={{ uri: image }} className="absolute inset-0" resizeMode="cover" />
        <View className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        <View className="absolute inset-0 justify-end p-5">
          <Text className="mb-1 font-sans text-[10px] uppercase tracking-[2px] text-amber-400">
            {specialty}
          </Text>
          <Text className="font-sans-bold text-2xl leading-tight text-white">{name}</Text>
          <View className="mt-2.5 flex-row items-center gap-1.5">
            <Ionicons name="ribbon-outline" size={13} color="#fbbf24" />
            <Text className="font-sans text-xs text-white/70">{experience} d'expérience</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function TrainersSection() {
  return (
    <View className="py-12">
      <View className="mb-6 px-6">
        <Text className="mb-3 font-sans-bold text-[11px] uppercase tracking-[3px] text-amber-500">
          03 — L'Équipe
        </Text>
        <Text className="font-sans-bold text-3xl leading-tight text-ink">
          Des experts passionnés
        </Text>
        <Text className="mt-3 font-sans text-sm leading-relaxed text-ink/50">
          Des éducateurs certifiés, formés aux méthodes les plus avancées en
          comportement animal.
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24 }}>
        {TRAINERS.map((t) => (
          <TrainerCard key={t.name} {...t} />
        ))}
      </ScrollView>
    </View>
  );
}

/* ============================================================
   TESTIMONIAL
   ============================================================ */
function TestimonialSection() {
  return (
    <View className="px-6 py-14">
      <View className="relative overflow-hidden rounded-3xl bg-ink p-8">
        {/* Decorative quote mark */}
        <Text className="absolute -top-4 right-6 font-sans-bold text-[120px] leading-none text-amber-400/10">
          "
        </Text>

        <View className="mb-6 flex-row items-center gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <Ionicons key={i} name="star" size={16} color="#fbbf24" />
          ))}
        </View>

        <Text className="font-sans-bold text-xl leading-relaxed text-white">
          En quelques semaines, Rex est devenu un autre chien. Les méthodes sont
          douces, efficaces et le suivi est exceptionnel. Je recommande les yeux
          fermés.
        </Text>

        <View className="mt-7 flex-row items-center gap-3">
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=200&q=80',
            }}
            className="h-12 w-12 rounded-full"
            resizeMode="cover"
          />
          <View>
            <Text className="font-sans-bold text-sm text-white">Marie Dubois</Text>
            <Text className="font-sans text-xs text-white/45">Propriétaire de Rex · Berger Australien</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

/* ============================================================
   CTA
   ============================================================ */
function CTASection() {
  const router = useRouter();

  return (
    <View className="px-6 pb-6">
      <View className="items-center rounded-3xl border border-amber-400/20 bg-amber-50 px-6 py-14">
        <View className="mb-5 h-14 w-14 items-center justify-center rounded-full bg-amber-400">
          <Ionicons name="paw" size={28} color="#1a1a1a" />
        </View>
        <Text className="text-center font-sans-bold text-2xl leading-tight text-ink">
          Prêt à commencer{'\n'}l'aventure ?
        </Text>
        <Text className="mt-4 text-center font-sans text-sm leading-relaxed text-ink/50">
          Première séance d'évaluation offerte.{'\n'}Sans engagement.
        </Text>
        <Pressable
          onPress={() => router.push('/sign-in')}
          className="mt-7 flex-row items-center justify-center gap-2 rounded-2xl bg-ink px-8 py-4 active:opacity-80">
          <Text className="font-sans-bold text-sm uppercase tracking-wider text-amber-400">
            Réserver maintenant
          </Text>
          <Ionicons name="arrow-forward" size={16} color="#fbbf24" />
        </Pressable>
      </View>
    </View>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */
function FooterSection() {
  return (
    <View className="items-center bg-ink px-6 py-14">
      <View className="mb-5 flex-row items-center gap-2">
        <Ionicons name="paw" size={24} color="#fbbf24" />
        <Text className="font-sans-bold text-lg uppercase tracking-widest text-amber-400">
          Compagnon
        </Text>
      </View>
      <View className="mb-6 h-px w-24 bg-amber-400/25" />
      <Text className="text-center font-sans text-[10px] uppercase tracking-[3px] text-white/35">
        Patience · Confiance · Harmonie
      </Text>
      <Text className="mt-3 font-sans text-[10px] text-white/25">
        © 2025 Compagnon. Tous droits réservés.
      </Text>
    </View>
  );
}

/* ============================================================
   SCREEN
   ============================================================ */
export default function HomeScreen() {
  return (
    <View className="flex-1 bg-paper">
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 0 }}>
        <HeroSection />
        <TickerStrip />
        <StatsSection />
        <ProgramsSection />
        <ProcessSection />
        <TrainersSection />
        <TestimonialSection />
        <CTASection />
        <FooterSection />
      </ScrollView>
    </View>
  );
}