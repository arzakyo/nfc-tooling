# 📱 NFC Tooling

> **Universal NFC & Smart Card Inspector, Knowledge Base & Dual-Engine Hybrid App**  
> Built with **Expo (React Native + React Native Web)**, **TypeScript**, and **Bun**.

---

## ⚡ Quick Start

### 1. Prerequisites
* [Bun](https://bun.sh) (v1.1+)
* [Node.js](https://nodejs.org) (v18+)
* [GitHub CLI (`gh`)](https://cli.github.com) *(Optional, for releasing)*

### 2. Install Dependencies
```bash
bun install
```

### 3. Run Locally

* **Run on Web (Desktop / Chrome Android):**
  ```bash
  bun run web
  ```
* **Run on Android Device / Emulator:**
  ```bash
  bun run android
  ```
* **Run on iOS Device (requires macOS):**
  ```bash
  bun run ios
  ```

---

## 🏗️ Architecture & Features

### 1. Dual-Engine Platform Architecture
* **Native Engine (Android & iOS):** Deep hardware access using `react-native-nfc-manager`. Supports raw APDUs (`IsoDep.transceive`), Indonesian e-Money (Mandiri e-Money & BCA Flazz) balance & PAN reading, Mifare DESFire EV3 inspection, and haptic feedback.
* **Web Engine (Desktop & Mobile Browser):** Uses browser `window.NDEFReader` where supported (Chrome on Android), and provides an instant *"Download Native App for Deep Scan"* banner to download the compiled `.apk`.
* **100% Offline & Private:** Zero cloud dependencies, zero external tracking.

### 2. Built-In Features
* **Inspector:** Real-time card readout (UID, Random UID detection for `08:` prefix, SAK, ATQA, ATS, NDEF records, raw hex dump).
* **Smart Card Reader:** Probes Mandiri e-Money and BCA Flazz Gen 2 via APDU to read balance (`Rp`) and 16-digit card number.
* **In-App Pocket Book:** Comprehensive comparison matrix of NFC chips (NTAG21x, DESFire EV3, Mifare Classic, 125 kHz) and card security guides.
* **Interactive FAQ:** Searchable FAQ with direct one-tap deep links into the Pocket Book.
* **Scan History:** Local offline storage (`AsyncStorage`) saving previous scans for quick inspection.

---

## 🚀 Build & Release Guide

### Why the `.apk` is NOT Committed to Git
Compiled Android APKs are ~35–45 MB binary files. Committing binaries directly to Git bloats the `.git` repository history permanently. Instead, APKs are hosted on **GitHub Releases** and downloaded directly via permanent latest-release URLs:
```
https://github.com/arzakyo/nfc-tooling/releases/latest/download/nfc-tooling.apk
```

---

### Option A: Local Build & GitHub Release (Recommended)

Run our automated cross-platform TypeScript release script:
```bash
bun run release
```
* **What it does automatically:**
  1. Prompts for version tag (defaults to `v<version>` in `package.json`).
  2. Verifies GitHub CLI (`gh`) and Java JDK 17. If Java is missing, it offers to auto-install it via `winget` (Windows) or `brew` (macOS).
  3. Generates release keystore if missing.
  4. Compiles the release APK with Gradle (`assembleRelease`).
  5. Automatically publishes a new **GitHub Release** with `nfc-tooling.apk` attached and commit notes generated.

To build the APK locally without publishing:
```bash
bun run build:apk
```

---

### Option B: Cloud Build via GitHub Actions (On-Demand)

Automatic GitHub Actions triggers on every git tag are disabled to preserve your free GitHub Actions minutes.

You can trigger a cloud build on-demand whenever you want:
* **Via GitHub CLI:**
  ```bash
  gh workflow run build-and-release.yml -f version=v1.0.0
  ```
* **Via Web UI:** Go to **Actions** tab $\rightarrow$ **Build and Release Android APK** $\rightarrow$ Click **"Run workflow"**.

---

## 🌐 Web Deployment (Cloudflare Pages / Vercel)

### Recommended: Cloudflare Pages (Unlimited Free Bandwidth)
1. Link your GitHub repository in Cloudflare Pages dashboard.
2. Configure build settings:
   * **Framework preset:** `None`
   * **Build command:** `bunx expo export --platform web`
   * **Build output directory:** `dist`
   * **Node version:** `20`
3. Click **Save and Deploy**.

### Vercel Deployment
* **Build command:** `bunx expo export --platform web`
* **Output directory:** `dist`

---

## 🗺️ Roadmap & Future Development

### ✅ Phase 1: MVP Inspector & Learning Handbook (Current Release - v1.0.0)
- [x] **Universal Card Inspector:** Detects UID, SAK, ATQA, ATS, protocol list, and chip models.
- [x] **Anti-Tracking Detection:** Identifies dynamic 4-byte Random UIDs (`08:xx:xx:xx`) used in Mifare DESFire EV2/EV3.
- [x] **Indonesian Smart Card Reader (APDU):** Reads Mandiri e-Money and BCA Flazz Gen 2 current balance (`Rp`) and 16-digit PAN.
- [x] **NDEF Parser:** Decodes Text (UTF-8/UTF-16), URI/URLs, and JSON payloads with raw hex dump.
- [x] **In-App Pocket Book & Interactive FAQ:** Built-in chip comparison matrix, security rules, and linked FAQs.
- [x] **Local Scan Vault:** Saves and timestamps scanned tags locally via `AsyncStorage`.
- [x] **Dual-Engine Architecture:** Responsive Web App with dynamic GitHub Releases APK download drawer.
- [x] **Automated Build Pipeline:** Cross-platform TypeScript release script (`bun run release`) with GitHub CLI integration.

---

### 🔨 Phase 2: Tag Writing & Security Protection Suite
- [ ] **NDEF Tag Writer:**
  - Write custom website URLs, contact vCards, Wi-Fi credentials, and plain text to blank NTAG213/215/216 chips.
- [ ] **Tag Password Protection Tool:**
  - Configure 32-bit (4-byte) PWD and 16-bit PACK on NTAG chips so anyone can read, but only authorized users with the password can write or format.
- [ ] **Permanent OTP Lock Utility:**
  - Safely flip physical One-Time Programmable (OTP) lock bits with confirmation modals to permanently prevent tampering.
- [ ] **Format / Factory Wipe:**
  - Erase writable tags back to empty NDEF format.

---

### 🛡️ Phase 3: Advanced Smart Card & Transit Tooling
- [ ] **Expanded Indonesian E-Money Support:**
  - Add APDU parser support for **BNI TapCash** and **BRI Brizzi**.
- [ ] **Full Transaction History Decoder:**
  - Parse on-chip ISO 7816-4 transaction logs (debit/credit amounts, dates, terminal IDs) into human-readable statements.
- [ ] **Mifare Classic Sector Inspector:**
  - Authenticate sectors using standard transport keys (e.g., `FFFFFFFFFFFF`, `A0A1A2A3A4A5`) to inspect raw blocks.
- [ ] **Magic Card UID Cloner:**
  - Support rewriting Sector 0 / UID on Chinese Magic Cards (CUID / Gen 2) for testing condo gates and elevator permissions.

---

### 💻 Phase 4: Developer Utilities & Desktop Extension
- [ ] **Raw APDU Interactive Terminal:**
  - Send custom byte arrays directly to smart cards on-device and inspect status word responses (`SW1`/`SW2`).
- [ ] **Data Export:**
  - Export scan history and technical readouts to JSON or CSV.
- [ ] **WebUSB / WebHID Support (Desktop):**
  - Connect external USB NFC readers (like ACR122U) directly on desktop Chrome using WebUSB.

---

## 📄 License
MIT
