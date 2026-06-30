/**
 * Central font constants. Used for surfaces set via React Navigation `style`
 * (screen header titles, tab bar labels) — NativeWind screens use the
 * `font-sans*` className utilities instead (mapped in tailwind.config.js).
 *
 * App default font: OUTFIT.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * HOW TO CHANGE THE APP FONT (swap procedure — 3 surfaces, keep them in sync):
 *   1. app/_layout.tsx  — change the `@expo-google-fonts/<family>` import and the
 *      variants passed to useFonts({ ... }).
 *   2. tailwind.config.js — repoint the `sans` / `sans-*` fontFamily values to the
 *      new family's variant names (this re-fonts every <Text> via className).
 *   3. this file — repoint FONT_REGULAR/MEDIUM/SEMIBOLD/BOLD (re-fonts the nav
 *      header + tab bar labels).
 *
 * Pre-installed families to choose from (import names follow `Family_<Weight>`):
 *   Outfit, Inter, HankenGrotesk, Manrope, PlusJakartaSans, DMSans, Sora,
 *   SpaceGrotesk, Figtree, BricolageGrotesque
 * (each from its `@expo-google-fonts/<kebab-name>` package — e.g.
 *  `@expo-google-fonts/plus-jakarta-sans` exports `PlusJakartaSans_700Bold`).
 * ──────────────────────────────────────────────────────────────────────────
 */
export const FONT_REGULAR = 'Outfit_400Regular';
export const FONT_MEDIUM = 'Outfit_500Medium';
export const FONT_SEMIBOLD = 'Outfit_600SemiBold';
export const FONT_BOLD = 'Outfit_700Bold';
