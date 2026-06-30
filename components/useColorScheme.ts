// Pinned to LIGHT. The app ships light-only by design; the dark-mode code is kept
// throughout (the `dark:` utility classes in screens, the DarkTheme branch in
// app/_layout.tsx) but stays inert. To re-enable system dark mode, restore the
// system value below and remove the `colorScheme.set('light')` call in
// app/_layout.tsx:
//   import { useColorScheme as useColorSchemeCore } from 'react-native';
//   export const useColorScheme = () => useColorSchemeCore() ?? 'light';
export const useColorScheme = (): 'light' | 'dark' => 'light';
