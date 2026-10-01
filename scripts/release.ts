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

  // 3. Check Java JDK (17+)
  console.log('[2/5] Checking Java JDK 17 & Android environment...');
  if (!isCommandAvailable('java') || !isCommandAvailable('javac')) {
    console.log('\x1b[31m⚠️ Java JDK is not found in your PATH.\x1b[0m');
    console.log('Local Android Gradle building requires Java 17 and the Android SDK.');

    const installJava = await askQuestion(
      '\nWould you like to automatically install Java JDK 17 now? (y/n): '
    );

    if (installJava.toLowerCase() === 'y') {
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
        process.exit(0);
      } else if (isMac) {
        runCmd('brew', ['install', 'openjdk@17']);
      } else {
        runCmd('sudo', ['apt-get', 'install', '-y', 'openjdk-17-jdk']);
      }
    } else {
      const fallbackActions = await askQuestion(
        'Would you like to trigger the build on GitHub Actions instead? (y/n): '
      );
      if (fallbackActions.toLowerCase() === 'y') {
        console.log(`\nTriggering GitHub Actions workflow for ${tag}...`);
        runCmd('gh', ['workflow', 'run', 'build-and-release.yml', '-f', `version=${tag}`]);
        console.log('\x1b[32m✓ Workflow triggered! View progress at:\x1b[0m');
        console.log('  https://github.com/arzakyo/nfc-tooling/actions');
        process.exit(0);
      } else {
        console.log('Aborted. Install Java 17 to build locally.');
        process.exit(1);
      }
    }
  }

  // 4. Run Expo Prebuild
  console.log('[3/5] Running Expo Prebuild (generating native Android)...');
  const expoRunner = isCommandAvailable('bunx') ? 'bunx' : 'npx';
  const prebuildSuccess = runCmd(expoRunner, ['expo', 'prebuild', '--platform', 'android', '--clean']);
  if (!prebuildSuccess) {
    console.error('\x1b[31mExpo Prebuild failed.\x1b[0m');
    process.exit(1);
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
