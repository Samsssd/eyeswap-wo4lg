<div align="center">
  <h1 align="center">Excelsior Digital — React Native Boilerplate</h1>
  <p align="center">
    A modern, production-ready mobile application boilerplate built with Expo, TypeScript, and NativeWind. Designed and engineered by <b>Excelsior Digital.</b>
  </p>
</div>

---

## 🚀 Overview

This repository contains our standard mobile app architecture. It's built on a highly optimized modern stack designed for raw speed, type safety, and delightful user experiences:

- **Framework:** [Expo](https://expo.dev/) (Managed Workflow SDK 54)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strictly-typed out of the box)
- **Styling:** [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **Navigation:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation)
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

## 🎨 Styling with NativeWind (Tailwind CSS)

Say goodbye to messy `StyleSheet.create` objects. We use **NativeWind v4**, which allows us to natively pass Tailwind CSS syntax to our components directly via the `className` prop. 

Our UI scales seamlessly between light and dark modes simply by utilizing Tailwind's default `dark:` modifier (e.g., `dark:bg-neutral-900 bg-white`). It automatically reacts to the OS system preferences or user toggles instantly.

## 🧭 File-Based Navigation (Expo Router)

We use **Expo Router** which brings the revolutionary concepts of file-system-based routing (familiar to Next.js developers) directly into React Native.

**How the navigation is structured in this app:**
- Every file inside the `app/` directory automatically acts as an accessible route URI!
- **`app/_layout.tsx`**: This is the root layout wrapper. It mounts our fonts, processes global CSS (`global.css`), and serves as the highest `<Stack>` navigation context.
- **`app/(tabs)/`**: The parentheses indicate a "Route Group". Route Groups don't impact the navigation URL conceptually, but allow us to wrap related screens completely inside of a shared Bottom Tab Bar layout (defined in `app/(tabs)/_layout.tsx`).
- **Adding new screens:** To create a new screen, just add a `.tsx` file anywhere within `app/`, and you can instantly navigate to it using the `<Link href="/filename">` component!

## ✅ State & Form Validation

Handling form state accurately and efficiently without bloating components is crucial. We avoid giant trees of controlled `useState` variables in favor of **React Hook Form (RHF)**, hooked deeply into **Zod** schema validation.

1. **Declare the Schema:** A concise `Zod` object dictates the strict requirements of your form (e.g., max lengths, valid email regexes).
2. **Setup the Resolver:** The `zodResolver` passes this strictly-typed schema seamlessly to the `useForm` hook.
3. **Controller:** We wrap interactive components like `TextInput`s perfectly with RHF's `<Controller>`.
4. **Result:** Highly performant, completely type-safe forms with reactive UI and error messages (dynamically triggering `border-red-500` classes when a field fails validation with zero rendering lag).

*Check out `app/(tabs)/two.tsx` for a live, production-grade example of an Edit Profile form mimicking these best practices.*

## ⚡ Data Fetching (React Query + Axios)

We leverage **TanStack Query (React Query)** paired with **Axios** to handle all asynchronous server-state. Why React Query? Because it provides enterprise-grade caching, robust background updates, stale-while-revalidate logic, and highly performant loading/error states without the need for manual `useEffect` boilerplate.

1. **Global Provider:** The `<QueryClientProvider>` wraps our app at the highest possible level in `app/_layout.tsx`.
2. **Fetching Logic:** Axios natively handles REST abstraction, header management, and automatic JSON formatting.
3. **Execution:** We fetch data cleanly and declaratively using hooks like `useQuery` and mutate state via `useMutation`.
4. **UX Integration:** React Query gives us instantaneous `isLoading`, `error`, and `isRefetching` booleans. We tie these directly into NativeWind layouts to gracefully render `<ActivityIndicator>` spinners, error fallbacks, and standard Pull-to-Refresh (`<FlatList refreshing={isRefetching}>`) capabilities.

*Check out `app/(tabs)/three.tsx` for a live, production-grade example of a discover feed pulling deeply-nested JSON from a public API, strictly-typed and smoothly-rendered.*

## 🐻 Global State Management (Zustand)

Instead of passing props down dozens of components (Prop Drilling) or dealing with the heavy boilerplate of Redux, we use **Zustand**. It is a small, unopinionated, and incredibly fast state-management tool that relies securely on hooks.

1. **Single Source of Truth:** `store/useStore.ts` contains the global logic and reactive state.
2. **Access Anywhere:** You can fetch state slices (`const count = useStore((state) => state.count)`) anywhere in the app hierarchy without mapping providers at the root.
3. **Action Triggers:** `useStore` cleanly provides methods like `increment`, `decrement`, and `reset` mutating the state globally while keeping components decoupled.

*Check out `app/(tabs)/index.tsx` (Tab One) for a beautiful, fully interactive NativeWind mock showing Zustand actively computing global numeric state.*

## 💾 Secure & Local Storage

This architecture supports two distinct on-device storage strategies, unified securely under the cleanly typed `utils/storage.ts` helper.

1. **Generic Storage (AsyncStorage):** Used for fast, unencrypted storage like persisting user preferences, caching API data, or remembering standard UI states. 
2. **Encrypted Storage (SecureStore):** Used explicitly for highly sensitive credentials like JWT authentication tokens, active API keys, or passwords. Data is heavily encrypted natively by the host OS (Keychain on iOS, Keystore on Android).

*Check out `app/(tabs)/four.tsx` (Tab Four) for a beautiful, live mock demonstrating and querying from both internal storage mechanisms side-by-side.*

## 🔤 Custom Fonts (Google Fonts via `@expo-google-fonts`)

Fonts are loaded at the native layer via **`expo-font`** before the splash screen is dismissed, guaranteeing zero flash of unstyled text. Google Fonts are consumed through the **`@expo-google-fonts`** package family — fonts ship as bundled `.ttf` assets with no network requests at runtime.

This boilerplate ships with **Pathway Extreme** as a working reference implementation. The system is designed so that swapping the brand font touches exactly four files and nothing else.

### Architecture overview

The font system is split across four layers, each with a single responsibility:

| Layer | File | Responsibility |
|---|---|---|
| 1. Registration | `app/_layout.tsx` | Loads `.ttf` assets before the app renders |
| 2. Constants | `constants/fonts.ts` | Single source of truth for font family name strings |
| 3. In-app text | `components/Text.tsx` | Branded drop-in for RN's `<Text>` — applies the brand font by default |
| 4. Navigation UI | `app/_layout.tsx` + `app/(tabs)/_layout.tsx` | Applies the font to headers and tab bar labels via `screenOptions` |

### Why React Native needs this approach

Unlike CSS, `fontFamily` in React Native does **not** cascade. Setting it on a parent `<View>` has no effect on child `<Text>` nodes. Every text surface must be set explicitly — which is exactly what this system handles for you.

### Layer 1 — Font registration (`app/_layout.tsx`)

Import only the weights you need (each unused variant adds ~50–100 KB to the bundle) and pass them to `useFonts`. The splash screen stays visible until all assets are ready.

```ts
import {
  PathwayExtreme_400Regular,
  PathwayExtreme_500Medium,
  PathwayExtreme_600SemiBold,
  PathwayExtreme_700Bold,
} from '@expo-google-fonts/pathway-extreme';

const [loaded, error] = useFonts({
  PathwayExtreme_400Regular,
  PathwayExtreme_500Medium,
  PathwayExtreme_600SemiBold,
  PathwayExtreme_700Bold,
});
```

### Layer 2 — Font constants (`constants/fonts.ts`)

A single file exports the font family name strings. This is the **only place** you change when swapping the brand font — everything else reads from here.

```ts
export const FONT_REGULAR  = 'PathwayExtreme_400Regular';
export const FONT_MEDIUM   = 'PathwayExtreme_500Medium';
export const FONT_SEMIBOLD = 'PathwayExtreme_600SemiBold';
export const FONT_BOLD     = 'PathwayExtreme_700Bold';
```

### Layer 3 — Branded Text component (`components/Text.tsx`)

`tailwind.config.js` maps Tailwind's `sans` key (the default font stack) to `PathwayExtreme_400Regular`:

```js
fontFamily: {
  sans: ['PathwayExtreme_400Regular'], // font-sans = brand font
  'pathway-medium':    ['PathwayExtreme_500Medium'],
  'pathway-semibold':  ['PathwayExtreme_600SemiBold'],
  'pathway-bold':      ['PathwayExtreme_700Bold'],
  // ... other weights
}
```

`components/Text.tsx` is a drop-in replacement for React Native's `<Text>` that prepends `font-sans` automatically:

```tsx
export function Text({ className = '', ...props }: TextProps) {
  return <RNText className={`font-sans ${className}`} {...props} />;
}
```

**Always import `Text` from `@/components/Text`, never from `react-native` directly:**

```tsx
import { Text } from '@/components/Text';

<Text>Body copy — brand font applied automatically</Text>
<Text className="font-pathway-semibold text-xl">Section heading</Text>
<Text className="font-pathway-bold text-3xl">Display heading</Text>
```

### Layer 4 — Navigation surfaces (`screenOptions`)

React Navigation renders headers and tab bar labels outside React's component tree — the custom `<Text>` component can't reach them. They are covered via `screenOptions` in the navigator layouts, reading from `constants/fonts.ts`:

```ts
// app/(tabs)/_layout.tsx
screenOptions={{
  tabBarLabelStyle:  { fontFamily: FONT_MEDIUM },
  headerTitleStyle:  { fontFamily: FONT_SEMIBOLD },
}}

// app/_layout.tsx (covers the modal header)
<Stack screenOptions={{ headerTitleStyle: { fontFamily: FONT_SEMIBOLD } }}>
```

### Every text surface covered

| Surface | Covered by |
|---|---|
| In-app `<Text>` | `components/Text.tsx` → `font-sans` |
| Screen / modal headers | `headerTitleStyle` in `screenOptions` |
| Bottom tab bar labels | `tabBarLabelStyle` in `screenOptions` |

### Available weight utilities

| Class | Weight | Style |
|---|---|---|
| *(default — no class needed)* | 400 Regular | Normal |
| `font-pathway-italic` | 400 Regular | Italic |
| `font-pathway-medium` | 500 Medium | Normal |
| `font-pathway-semibold` | 600 SemiBold | Normal |
| `font-pathway-bold` | 700 Bold | Normal |
| `font-pathway-bold-italic` | 700 Bold | Italic |
| `font-pathway-extrabold` | 800 ExtraBold | Normal |
| `font-pathway-black` | 900 Black | Normal |

### Swapping the brand font

1. Install the new `@expo-google-fonts/<font-name>` package.
2. Replace the imports and `useFonts` entries in `app/_layout.tsx`.
3. Update the exports in `constants/fonts.ts`.
4. Update `fontFamily.sans` (and other weight keys) in `tailwind.config.js`.

Restart with `npx expo start -c` to clear the Metro and NativeWind cache. Nothing in your screen files needs to change.

---

## 🔐 Environment Variables

All runtime configuration is centralised in **`config/env.ts`**, which uses **Zod** to parse and validate every variable at startup. If a required variable is missing or malformed the app will throw immediately (fail-fast), preventing silent misconfiguration bugs.

### How it works

| File | Committed? | Purpose |
|---|---|---|
| `.env.example` | ✅ Yes | Template — lists every variable with placeholder values |
| `.env.local` | ❌ No | Your personal overrides (highest priority) |
| `.env.development` | ❌ No | Values used during `expo start` (development channel) |
| `.env.preview` | ❌ No | Values for preview / staging builds |
| `.env.production` | ❌ No | Values for production builds |

Expo automatically loads the right file based on the active channel/environment. The `EXPO_PUBLIC_` prefix is **required** — only variables with this prefix are inlined into the JS bundle (anything else stays server-side).

### Setup

```bash
# 1. Copy the example file and fill in your real values
cp .env.example .env.local
```

Edit `.env.local`:
```
EXPO_PUBLIC_API_URL=https://api.yourapp.com
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_ENV=development
```

### Using env variables in code

Never read `process.env` directly in feature code — always import from the central config:

```ts
import { env } from '@/config/env';

const apiUrl = env.EXPO_PUBLIC_API_URL;
console.log(`Running in ${env.EXPO_PUBLIC_ENV} mode`);
```

The exported `env` object is fully typed via `z.infer<typeof envSchema>`, so you get autocomplete and type safety everywhere.

### Adding a new variable

1. Add it to `.env.example` with a placeholder value.
2. Add it to the `envSchema` in `config/env.ts`.
3. Add it to the `parsed` object in `config/env.ts`.
4. Add real values to your local `.env.*` files and to your CI/CD secrets.

---

## 💻 Getting Started

1. **Install Dependencies:**
   ```bash
   yarn install
   ```

2. **Start the Development Server:**
   ```bash
   npx expo start -c
   ```
   *Note: Using the `-c` flag ensures the Metro bundler cache is wiped and freshly processes NativeWind styles if any config files changed.*

3. **Run on a Device:**
   Scan the generated QR code using the **Expo Go** app on your real device, or press `i` / `a` in the terminal to launch on an iOS Simulator or Android Emulator.

---

## ☁️ Remote Deploy via EAS Update (GitHub API)

The [`.github/workflows/eas-update.yml`](.github/workflows/eas-update.yml) workflow
publishes an **EAS Update** to the `preview` branch so the latest JS bundle is
shareable by link/QR. It is **only** triggered programmatically through the GitHub
REST API (`workflow_dispatch`).

The workflow **provisions the EAS project itself** on first run — it names the
project after the GitHub repo (via [`scripts/eas-set-name.mjs`](scripts/eas-set-name.mjs))
and runs `eas init`, so this boilerplate works under any repo name with no manual
`projectId` wiring.

### One-time setup

1. Create an Expo access token: **Expo dashboard → Account Settings → Access Tokens**.
2. Add it to the GitHub repo as a secret named **`EXPO_TOKEN`**
   (*Settings → Secrets and variables → Actions → New repository secret*).
3. Add your **`EXPO_PUBLIC_*`** app config as repo secrets (same names as `.env.example`).
   These are inlined into the published bundle, so the deployed update talks to the
   right backend/Supabase/Clerk:

   | Secret | Purpose |
   |--------|---------|
   | `EXPO_PUBLIC_API_URL` | Backend API base URL |
   | `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL |
   | `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable/anon key |
   | `EXPO_PUBLIC_APP_ID` | App identifier from your backend |
   | `EXPO_PUBLIC_MOBILE_API_TOKEN` | Mobile → backend API token |
   | `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |

   `EXPO_PUBLIC_ENV` is set automatically to `preview` by the workflow — no secret
   needed. (These are all client-public values by design; they're stored as secrets
   only to keep them out of the repo and masked in logs.)
4. Push this repo so the workflow exists on the **default branch** (required for the
   dispatch API to see it).

### Trigger it via the API

```bash
curl -X POST \
  -H "Authorization: Bearer <GITHUB_PAT_WITH_workflow_SCOPE>" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/<owner>/<repo>/actions/workflows/eas-update.yml/dispatches \
  -d '{"ref":"main"}'
```

The update is published to the **`preview`** branch with the **last commit's message**.
After it completes, grab the preview link/QR from the **EAS dashboard** (or the run
logs). It opens directly in a **preview/development build**; opening an EAS Update in
**Expo Go** additionally requires the project to stay Expo-Go compatible and the
runtime versions to match.

---
*Architected with 🤍 by Excelsior Digital*
