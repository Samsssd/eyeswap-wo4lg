import { Pressable, ActivityIndicator, type PressableProps } from 'react-native';
import { Text } from '@/components/Text';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends PressableProps {
  label: string;
  variant?: Variant;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, { bg: string; text: string; border?: string }> = {
  primary: { bg: 'bg-coral', text: 'text-white' },
  secondary: { bg: 'bg-white', text: 'text-ink', border: 'border border-neutral-200' },
  ghost: { bg: '', text: 'text-coral' },
};

export function Button({
  label,
  variant = 'primary',
  loading = false,
  fullWidth = true,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const v = variantStyles[variant];
  return (
    <Pressable
      disabled={disabled || loading}
      style={style}
      className={`flex-row items-center justify-center rounded-2xl px-6 py-4 ${fullWidth ? 'w-full' : ''} ${v.bg} ${v.border ?? ''} ${disabled || loading ? 'opacity-50' : 'active:opacity-90'}`}
      {...props}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#FF5A3C'} size="small" />
      ) : (
        <Text className={`font-sans-bold text-base ${v.text}`}>{label}</Text>
      )}
    </Pressable>
  );
}
