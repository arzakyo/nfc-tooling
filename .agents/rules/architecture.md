# NFC Tooling Architecture & Development Rules

## 1. Dual-Engine Platform Isolation
- **Native (Android & iOS):** Direct hardware NFC via `react-native-nfc-manager`. Supports raw APDUs (`IsoDep.transceive`), e-Money balances, transaction logs, and haptic feedback.
- **Web (Desktop & Mobile Web):** Must **NEVER crash** on unsupported native modules. Uses browser `window.NDEFReader` where available.
- **Strict Guarding:** Never import `react-native-nfc-manager` or `expo-haptics` in shared code without platform isolation (`.native.ts` / `.web.ts` file extensions or `Platform.OS !== 'web'` checks).

## 2. 100% Offline & Zero Telemetry
- No third-party tracking, analytics, or external API calls during NFC operations.
- History is saved locally using `@react-native-async-storage/async-storage`.

## 3. Package Management & Commands
- This project uses **Bun**.
- Use `bunx` instead of `npx`.
- Use `bun install` or `npx expo install <package>` for Expo dependencies.
- Local APK build: `bun run build:apk`
- Cloud & Local Release: `bun run release`
- Regenerate Knowledge Graph: `bun run graphify`

## 4. Smart Card APDUs (Indonesian E-Money)
- Web NFC cannot run raw APDUs (`IsoDep`). Reading Indonesian e-money requires the Native Android APK / iOS app.
- Mandiri e-Money AID: `A0 00 00 00 03 00 00 00` (PAN `00 B2 01 0C 1D`, Balance `00 B0 00 00 04`).
- BCA Flazz Gen 2 AID: `A0 00 00 00 03 10 10`.
