/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  // App ships light-only: with `class`, the `dark:` variant only applies when a
  // dark class is manually toggled (never) instead of following the OS scheme, so
  // every `dark:` utility stays inert. Set back to "media" to re-enable system
  // dark mode (also restore components/useColorScheme.ts — see app/_layout.tsx).
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        // App font: Outfit. The utility NAMES are font-agnostic (font-sans,
        // font-sans-medium, …) so swapping the app font only means changing the
        // Outfit_* values here + in constants/fonts.ts + the useFonts import in
        // app/_layout.tsx — screen classNames never change. See the swap
        // procedure documented in constants/fonts.ts.
        //   font-sans           → Outfit 400 (default for <Text>)
        //   font-sans-medium    → Outfit 500
        //   font-sans-semibold  → Outfit 600
        //   font-sans-bold      → Outfit 700
        //   font-sans-extrabold → Outfit 800
        //   font-sans-black     → Outfit 900
        sans: ['Outfit_400Regular'],
        'sans-medium': ['Outfit_500Medium'],
        'sans-semibold': ['Outfit_600SemiBold'],
        'sans-bold': ['Outfit_700Bold'],
        'sans-extrabold': ['Outfit_800ExtraBold'],
        'sans-black': ['Outfit_900Black'],
      },
    },
  },
  plugins: [],
}