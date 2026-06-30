import { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { Link, router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSignIn } from '@clerk/expo/legacy';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/Text';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { BRAND_LOGO_URL } from '@/lib/format';
import { Image } from 'react-native';

const emailSchema = z.object({
  email: z.string().email('Adresse e-mail invalide'),
});
const codeSchema = z.object({
  code: z.string().min(6, 'Code à 6 chiffres'),
});

type EmailForm = z.infer<typeof emailSchema>;
type CodeForm = z.infer<typeof codeSchema>;

export default function SignInScreen() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState<'email' | 'code'>('email');
  const [pendingEmail, setPendingEmail] = useState('');
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const emailForm = useForm<EmailForm>({ resolver: zodResolver(emailSchema) });
  const codeForm = useForm<CodeForm>({ resolver: zodResolver(codeSchema) });

  async function sendCode(email: string) {
    if (!isLoaded) return;
    setLoading(true);
    setServerError(null);
    try {
      await signIn.create({ strategy: 'email_code', identifier: email });
      setPendingEmail(email);
      setStep('code');
    } catch (e: any) {
      const msg = e?.errors?.[0]?.message ?? 'Impossible d’envoyer le code.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(code: string) {
    if (!isLoaded) return;
    setLoading(true);
    setServerError(null);
    try {
      const res = await signIn.attemptFirstFactor({ strategy: 'email_code', code });
      if (res.status === 'complete') {
        await setActive({ session: res.createdSessionId });
        // The profile row is upserted automatically when the user first visits
        // the Profile tab (ensureCurrentUser is called there with full Clerk data).
        router.replace('/(tabs)');
      } else {
        setServerError('Vérification incomplète, réessayez.');
      }
    } catch (e: any) {
      const msg = e?.errors?.[0]?.message ?? 'Code incorrect.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-paper">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }}
          keyboardShouldPersistTaps="handled">
          {/* Hero */}
          <View className="items-center px-6 pb-8">
            <Image
              source={{ uri: BRAND_LOGO_URL }}
              style={{ width: 64, height: 64, borderRadius: 18 }}
              resizeMode="contain"
            />
            <Text className="mt-5 font-sans-extrabold text-3xl tracking-tight text-ink">
              Bon retour
            </Text>
            <Text className="mt-2 text-center text-base text-neutral-500">
              {step === 'email'
                ? 'Connectez-vous pour découvrir les photographes'
                : 'Saisissez le code reçu par e-mail'}
            </Text>
          </View>

          {/* Form */}
          <View className="px-6">
            {step === 'email' ? (
              <>
                <Controller
                  control={emailForm.control}
                  name="email"
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                      label="Adresse e-mail"
                      icon="mail-outline"
                      placeholder="vous@exemple.com"
                      value={value ?? ''}
                      onChangeText={onChange}
                      error={error?.message}
                      keyboardType="email-address"
                    />
                  )}
                />

                {serverError ? (
                  <View className="mt-4 flex-row items-center gap-2 rounded-2xl bg-coral/10 px-4 py-3">
                    <Ionicons name="alert-circle" size={18} color="#FF5A3C" />
                    <Text className="flex-1 text-sm text-coral">{serverError}</Text>
                  </View>
                ) : null}

                <View className="mt-6">
                  <Button
                    label="Recevoir un code"
                    loading={loading}
                    onPress={emailForm.handleSubmit((v) => sendCode(v.email))}
                  />
                </View>

                <Pressable
                  onPress={() => router.push('/sign-up')}
                  className="mt-6 flex-row items-center justify-center gap-1.5">
                  <Text className="text-sm text-neutral-500">Pas encore de compte ?</Text>
                  <Text className="font-sans-bold text-sm text-coral">S’inscrire</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Controller
                  control={codeForm.control}
                  name="code"
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                      label="Code de vérification"
                      icon="keypad-outline"
                      placeholder="123456"
                      value={value ?? ''}
                      onChangeText={onChange}
                      error={error?.message}
                      keyboardType="number-pad"
                      maxLength={6}
                    />
                  )}
                />

                {serverError ? (
                  <View className="mt-4 flex-row items-center gap-2 rounded-2xl bg-coral/10 px-4 py-3">
                    <Ionicons name="alert-circle" size={18} color="#FF5A3C" />
                    <Text className="flex-1 text-sm text-coral">{serverError}</Text>
                  </View>
                ) : null}

                <View className="mt-6 gap-3">
                  <Button
                    label="Se connecter"
                    loading={loading}
                    onPress={codeForm.handleSubmit((v) => verifyCode(v.code))}
                  />
                  <Button
                    label="Changer d’e-mail"
                    variant="ghost"
                    loading={false}
                    onPress={() => {
                      setStep('email');
                      setServerError(null);
                      codeForm.reset();
                    }}
                  />
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
