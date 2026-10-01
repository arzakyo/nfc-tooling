import { spawnSync, execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const isWindows = process.platform === 'win32';
const isMac = process.platform === 'darwin';

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

function isCommandAvailable(cmd: string): boolean {
  try {
    const checkCmd = isWindows ? `where ${cmd}` : `which ${cmd}`;
    execSync(checkCmd, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function runCmd(command: string, args: string[], cwd?: string): boolean {
  const result = spawnSync(command, args, {
    cwd: cwd || process.cwd(),
    stdio: 'inherit',
    shell: true,
  });
  return result.status === 0;
}

async function main() {
  console.log('\x1b[36m%s\x1b[0m', '=========================================');
  console.log('\x1b[36m%s\x1b[0m', ' 📱 NFC Tooling Local APK Builder (TS)   ');
  console.log('\x1b[36m%s\x1b[0m', '=========================================\n');

  if (!isCommandAvailable('java') || !isCommandAvailable('javac')) {
    console.log('\x1b[31m⚠️ Java JDK is not found in your PATH.\x1b[0m');
    console.log('Local Android Gradle building requires Java 17 and Android SDK.');

    const installJava = await askQuestion(
      '\nWould you like to install Java JDK 17 now? (y/n): '
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
      process.exit(1);
    }
  }

  console.log('[1/3] Running Expo Prebuild...');
  const expoRunner = isCommandAvailable('bunx') ? 'bunx' : 'npx';
  runCmd(expoRunner, ['expo', 'prebuild', '--platform', 'android', '--clean']);

  const androidDir = path.join(process.cwd(), 'android');
  const androidAppDir = path.join(androidDir, 'app');
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

  console.log('\n[2/3] Compiling Release APK with Gradle...');
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

  fs.copyFileSync(generatedApk, targetApk);
  console.log(`\n\x1b[32m✓ APK ready at: ${targetApk}\x1b[0m\n`);
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
