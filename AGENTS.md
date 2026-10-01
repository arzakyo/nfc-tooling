This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

## NFC Tooling Specific Architecture & Rules

### Dual-Engine Philosophy (Native vs. Web)
- **Native (Android & iOS):** Deep hardware access using `react-native-nfc-manager`. Supports raw APDUs (`IsoDep.transceive`), e-Money balances, transaction logs, Mifare inspection, and haptic feedback.
- **Web (Desktop & Mobile Web):** Must **NEVER crash** on unsupported native modules. Uses browser `window.NDEFReader` where available, and displays the "Download Mobile App" banner for features requiring deep APDU access.
- **Strict Platform Guarding:**
  - Any import or invocation of `react-native-nfc-manager` or `expo-haptics` MUST be guarded or isolated behind `.native.ts` / `.web.ts` file extensions or explicit `Platform.OS !== 'web'` checks.

### 100% Offline & Zero Telemetry
- This app is an on-device utility tool.
- No external API calls, tracking pixels, or telemetry should be added to the core NFC reading logic.
- All scan history is stored in local storage (`AsyncStorage`).

### NFC Technical Context
- **Random UID Detection:** If a card's 4-byte UID starts with `08:`, flag it as a **Random UID (Anti-Tracking)**. It is typical for Mifare DESFire EV2/EV3 cards.
- **Smart Card APDUs (Indonesian E-Money):** E-money cards (Mandiri, Flazz, Brizzi, TapCash) store data in ISO 7816-4 files, not NDEF. Always use `IsoDep` / `NfcTech.IsoDep` when connecting to these cards. Web NFC cannot run APDUs.

| Card | Application Identifier (AID) | Command Structure |
| :--- | :--- | :--- |
| **Mandiri e-Money** | `A0 00 00 00 03 00 00 00` | Select AID $\rightarrow$ Read PAN (`00 B2 01 0C 1D`) $\rightarrow$ Read Balance (`00 B0 00 00 04`) |
| **BCA Flazz (Gen 2)** | `A0 00 00 00 03 10 10` | Select AID $\rightarrow$ Read Balance & Records |
| **BNI TapCash** | `D2 76 00 00 85 01 01` / Custom | ISO-DEP Applet (Phase 3) |
| **BRI Brizzi** | Custom ISO-DEP Applet | ISO-DEP Applet (Phase 3) |

### Build & Release Scripts
- `bun run release` — Executes `scripts/release.ts`: prebuilds, signs, and publishes directly to GitHub Releases via `gh release create`.
- `bun run build:apk` — Executes `scripts/build-apk.ts`: compiles local `./nfc-tooling.apk` without publishing.
- `bunx expo export --platform web` — Generates static SPA in `dist/` ready for Cloudflare Pages / Vercel.

### Knowledge Graph (Graphify)
- A persistent code knowledge graph is maintained in `graphify-out/graph.json` and `graphify-out/graph.html`.
- **Regenerate on any device:** Run `bun run graphify` or `graphify .` (requires `pip install graphifyy` or `/graphify` in Antigravity). It uses deterministic local AST parsing and requires zero API keys.
- **Query:** Run `graphify query "<question>"` to trace symbols, data flow, or architecture dependencies across the repository.
- Detailed rules are located in `.agents/rules/graphify.md`.


