import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { FONT_REGULAR } from '@/constants/fonts';

type TextProps = RNTextProps & {
  className?: string;
};

/**
 * Drop-in replacement for React Native's <Text>.
 * Applies the app font (Outfit, 400 Regular) as the app-wide default via
 * `font-sans` (mapped in tailwind.config.js). Override the weight with an
 * additional className utility:
 *
 *   font-sans-medium    → 500 Medium
 *   font-sans-semibold  → 600 SemiBold
 *   font-sans-bold      → 700 Bold
 *   font-sans-extrabold → 800 ExtraBold
 *   font-sans-black     → 900 Black
 *
 * (The utility names are font-agnostic — to change the app font, see the swap
 * procedure in constants/fonts.ts; classNames here never need to change.)
 *
 * Usage:
 *   import { Text } from '@/components/Text';
 *   <Text className="text-base text-neutral-900">Hello</Text>
 *   <Text className="font-sans-bold text-xl">Bold heading</Text>
 */
export function Text({ className = '', ...props }: TextProps) {
  return <RNText className={`font-sans ${className}`} {...props} />;
}
