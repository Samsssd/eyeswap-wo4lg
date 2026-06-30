import { View, TextInput, type TextInputProps } from 'react-native';
import { Text } from '@/components/Text';
import { Ionicons } from '@expo/vector-icons';

interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  suffix?: React.ReactNode;
}

export function TextField({ label, error, icon, suffix, style, ...props }: TextFieldProps) {
  return (
    <View className="gap-2">
      <Text className="font-sans-medium text-sm text-neutral-700">{label}</Text>
      <View
        className={`flex-row items-center gap-3 rounded-2xl bg-white px-4 ${error ? 'border border-coral' : 'border border-neutral-200'}`}>
        {icon ? <Ionicons name={icon} size={20} color="#9ca3af" /> : null}
        <TextInput
          placeholderTextColor="#9ca3af"
          className="flex-1 py-4 font-sans text-base text-ink"
          autoCapitalize="none"
          autoCorrect={false}
          style={style}
          {...props}
        />
        {suffix}
      </View>
      {error ? (
        <Text className="font-sans-medium text-xs text-coral">{error}</Text>
      ) : null}
    </View>
  );
}
