import { spawnSync, execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const isWindows = process.platform === 'win32';
const isMac = process.platform === 'darwin';

// Helper to ask interactive questions
function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans: string) => {
      rl.close();
      resolve(ans.trim());
    })
  );
}

// Check if a command is available in PATH
function isCommandAvailable(cmd: string): boolean {
  try {
    const checkCmd = isWindows ? `where ${cmd}` : `which ${cmd}`;
    execSync(checkCmd, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Run command and stream output
function runCmd(command: string, args: string[], cwd?: string): boolean {
  const result = spawnSync(command, args, {
    cwd: cwd || process.cwd(),
    stdio: 'inherit',
    shell: true,
  });
  return result.status === 0;
}

async function main() {
  console.log('\x1b[36m%s\x1b[0m', '================================================');
  console.log('\x1b[36m%s\x1b[0m', ' 🚀 NFC Tooling Universal Build & Release (TS) ');
  console.log('\x1b[36m%s\x1b[0m', '================================================\n');

  // 1. Determine Version
  const pkgPath = path.join(process.cwd(), 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  let version = pkg.version || '1.0.0';

  const customVersion = await askQuestion(`Target Version [default: v${version}]: `);
  if (customVersion) {
    version = customVersion.replace(/^v/, '');
  }
  const tag = `v${version}`;
  console.log(`\n\x1b[32mTarget Release: ${tag}\x1b[0m\n`);

  // 2. Check GitHub CLI
  console.log('[1/5] Checking GitHub CLI (gh)...');
  if (!isCommandAvailable('gh')) {
    console.log('\x1b[33m⚠️ GitHub CLI (gh) not found in PATH.\x1b[0m');
    const installGh = await askQuestion('Would you like to install GitHub CLI now? (y/n): ');
    if (installGh.toLowerCase() === 'y') {
      if (isWindows) {
        runCmd('winget', ['install', '--id', 'GitHub.cli', '-e']);
      } else if (isMac) {
        runCmd('brew', ['install', 'gh']);
      } else {
        console.log('Please install gh via your package manager: https://cli.github.com/');
        process.exit(1);
      }
    } else {
      console.log('Cannot publish release to GitHub without GitHub CLI.');
      process.exit(1);
    }
  }

  // Verify auth
  try {
    execSync('gh auth status', { stdio: 'ignore' });
    console.log('\x1b[32m✓ GitHub CLI authenticated.\x1b[0m\n');
  } catch {
    console.log('\x1b[33mGitHub CLI is not logged in. Running gh auth login...\x1b[0m');
    runCmd('gh', ['auth', 'login']);
  }

function checkAndroidSdk(): string | null {
  if (process.env.ANDROID_HOME && fs.existsSync(process.env.ANDROID_HOME)) return process.env.ANDROID_HOME;
  if (process.env.ANDROID_SDK_ROOT && fs.existsSync(process.env.ANDROID_SDK_ROOT)) return process.env.ANDROID_SDK_ROOT;

  const localProp = path.join(process.cwd(), 'android', 'local.properties');
  if (fs.existsSync(localProp)) {
    const content = fs.readFileSync(localProp, 'utf-8');
    const match = content.match(/sdk\.dir=(.*)/);
    if (match && match[1] && fs.existsSync(match[1].trim())) {
      return match[1].trim();
    }
  }

  // Common default locations
  if (isWindows) {
    const defaultWin = path.join(process.env.LOCALAPPDATA || '', 'Android', 'Sdk');
    if (fs.existsSync(defaultWin)) {
      process.env.ANDROID_HOME = defaultWin;
      return defaultWin;
    }
  } else if (isMac) {
    const defaultMac = path.join(process.env.HOME || '', 'Library', 'Android', 'sdk');
    if (fs.existsSync(defaultMac)) {
      process.env.ANDROID_HOME = defaultMac;
      return defaultMac;
    }
  }
  return null;
}

  // 3. Check Java JDK (17+) & Android SDK
  console.log('[2/5] Checking Java JDK 17 & Android environment...');
  const hasJava = isCommandAvailable('java') && isCommandAvailable('javac');
  const androidSdkPath = checkAndroidSdk();

  if (!hasJava || !androidSdkPath) {
    if (!hasJava) {
      console.log('\x1b[31m⚠️ Java JDK is not found in your PATH.\x1b[0m');
    }
    if (!androidSdkPath) {
      console.log('\x1b[33m⚠️ Android SDK is not detected on your local machine.\x1b[0m');
      console.log('Local Android builds require Java 17 and the Android SDK (platforms & build-tools).');
    }

    console.log('\n💡 \x1b[36mRecommendation:\x1b[0m You can build directly in the cloud using GitHub Actions!');
    console.log('GitHub Actions runners already have Java 17, Android SDK, and all build tools preconfigured.');

    const menuOptions: { key: string; label: string; action: () => Promise<void> }[] = [
      {
        key: '1',
        label: 'Build and Release via GitHub Actions (Cloud - Recommended)',
        action: async () => {
          console.log(`\nTriggering GitHub Actions workflow for ${tag}...`);
          const triggered = runCmd('gh', ['workflow', 'run', 'build-and-release.yml', '-f', `version=${tag}`]);
          if (triggered) {
            console.log('\n\x1b[32m✓ GitHub Actions build started successfully!\x1b[0m');
            console.log('View live build progress here:');
            console.log('  \x1b[36mhttps://github.com/arzakyo/nfc-tooling/actions\x1b[0m');
            console.log('\nOnce finished, the release and APK will appear at:');
            console.log(`  \x1b[36mhttps://github.com/arzakyo/nfc-tooling/releases/tag/${tag}\x1b[0m\n`);
          } else {
            console.log('\x1b[31mFailed to trigger workflow. Ensure your changes are committed and pushed to GitHub.\x1b[0m');
          }
          process.exit(0);
        },
      },
    ];

    if (!hasJava) {
      menuOptions.push({
        key: String(menuOptions.length + 1),
        label: 'Install Java JDK 17 via winget',
        action: async () => {
          if (isWindows) {
            console.log('\nInstalling Eclipse Adoptium Temurin 17 JDK via winget...');
            runCmd('winget', [
              'install',
              '-e',
              '--id',
              'EclipseAdoptium.Temurin.17.JDK',
              '--accept-package-agreements',
              '--accept-source-agreements',
            ]);
            console.log(
              '\x1b[33mJava installed. Please restart your terminal/IDE for PATH to update, then re-run this script.\x1b[0m'
            );
          } else if (isMac) {
            runCmd('brew', ['install', 'openjdk@17']);
          } else {
            runCmd('sudo', ['apt-get', 'install', '-y', 'openjdk-17-jdk']);
          }
          process.exit(0);
        },
      });
    }

    if (!androidSdkPath) {
      menuOptions.push({
        key: String(menuOptions.length + 1),
        label: 'Install Android Studio & SDK via winget',
        action: async () => {
          if (isWindows) {
            console.log('\nRequesting Administrator privileges to install Android Studio...');
            const elevated = runCmd('powershell', [
              '-Command',
              `Start-Process winget -ArgumentList 'install -e --id Google.AndroidStudio --accept-package-agreements --accept-source-agreements' -Verb RunAs -Wait`,
            ]);
            if (!elevated) {
              console.log('\n\x1b[33mTip: If UAC failed, open PowerShell as Administrator and run:\x1b[0m');
              console.log('  winget install --id Google.AndroidStudio -e');
            } else {
              console.log('\n\x1b[32mAndroid Studio installation completed/launched.\x1b[0m');
              console.log('Launch Android Studio once to complete SDK setup, then restart your terminal and re-run.');
            }
          } else if (isMac) {
            runCmd('brew', ['install', '--cask', 'android-studio']);
          } else {
            console.log('Please install Android Studio from https://developer.android.com/studio');
          }
          process.exit(0);
        },
      });
    }

    menuOptions.push({
      key: String(menuOptions.length + 1),
      label: 'Cancel',
      action: async () => {
        console.log('Aborted.');
        process.exit(0);
      },
    });

    const promptText =
      '\nChoose an option:\n' +
      menuOptions.map((opt) => ` ${opt.key}. ${opt.label}`).join('\n') +
      `\nSelect (1-${menuOptions.length}) [default: 1]: `;

    const rawChoice = await askQuestion(promptText);
    const selectedKey = rawChoice.trim() || '1';
    const selected = menuOptions.find((opt) => opt.key === selectedKey) || menuOptions[0];

    await selected.action();
  }

  // 4. Run Expo Prebuild
  console.log('[3/5] Running Expo Prebuild (generating native Android)...');
  const expoRunner = isCommandAvailable('bunx') ? 'bunx' : 'npx';
  const prebuildSuccess = runCmd(expoRunner, ['expo', 'prebuild', '--platform', 'android', '--clean']);
  if (!prebuildSuccess) {
    console.error('\x1b[31mExpo Prebuild failed.\x1b[0m');
    process.exit(1);
  }

  // Ensure local.properties has sdk.dir
  if (androidSdkPath) {
    const androidDir = path.join(process.cwd(), 'android');
    const localProp = path.join(androidDir, 'local.properties');
    const escaped = androidSdkPath.replace(/\\/g, '/');
    fs.writeFileSync(localProp, `sdk.dir=${escaped}\n`);
  }

  // 5. Setup Keystore if missing
  const androidAppDir = path.join(process.cwd(), 'android', 'app');
  const keystorePath = path.join(androidAppDir, 'release.keystore');
  if (!fs.existsSync(keystorePath)) {
    console.log('Generating local release keystore...');
    runCmd(
      'keytool',
      [
        '-genkeypair',
        '-v',
        '-storetype',
        'PKCS12',
        '-keystore',
        'release.keystore',
        '-alias',
        'nfctooling',
        '-keyalg',
        'RSA',
        '-keysize',
        '2048',
        '-validity',
        '10000',
        '-storepass',
        'android',
        '-keypass',
        'android',
        '-dname',
        '"CN=NFCTooling, OU=Mobile, O=NFCTooling, L=Jakarta, C=ID"',
      ],
      androidAppDir
    );
  }

  // 6. Compile Release APK
  console.log('\n[4/5] Compiling Release APK with Gradle...');
  const androidDir = path.join(process.cwd(), 'android');
  const gradlewCmd = isWindows ? 'gradlew.bat' : './gradlew';
  const buildSuccess = runCmd(gradlewCmd, ['assembleRelease', '--no-daemon'], androidDir);

  if (!buildSuccess) {
    console.error('\x1b[31mGradle build failed.\x1b[0m');
    process.exit(1);
  }

  const generatedApk = path.join(
    androidDir,
    'app',
    'build',
    'outputs',
    'apk',
    'release',
    'app-release.apk'
  );

  const targetApk = path.join(process.cwd(), 'nfc-tooling.apk');
  if (!fs.existsSync(generatedApk)) {
    console.error(`\x1b[31mAPK was not found at ${generatedApk}\x1b[0m`);
    process.exit(1);
  }

  fs.copyFileSync(generatedApk, targetApk);
  console.log(`\x1b[32m✓ APK successfully copied to: ${targetApk}\x1b[0m\n`);

  // 7. Publish to GitHub Releases
  console.log(`[5/5] Publishing ${tag} to GitHub Releases...`);
  const releaseSuccess = runCmd('gh', [
    'release',
    'create',
    tag,
    targetApk,
    '--title',
    `"Release ${tag}"`,
    '--generate-notes',
  ]);

  if (releaseSuccess) {
    console.log('\n\x1b[32m%s\x1b[0m', `🎉 SUCCESS! Release ${tag} is live on GitHub.`);
    console.log('\x1b[36mDirect APK Download URL:\x1b[0m');
    console.log('  https://github.com/arzakyo/nfc-tooling/releases/latest/download/nfc-tooling.apk');
    console.log('\x1b[36mRelease Details:\x1b[0m');
    console.log(`  https://github.com/arzakyo/nfc-tooling/releases/tag/${tag}\n`);
  } else {
    console.error('\x1b[31mFailed to publish to GitHub Releases.\x1b[0m');
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
