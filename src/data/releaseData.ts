export interface ReleaseInfo {
  version: string;
  releaseDate: string;
  apkDownloadUrl: string;
  githubReleasesUrl: string;
  fileSize: string;
  targetPlatform: string;
  changelog: string[];
}

export const CURRENT_RELEASE: ReleaseInfo = {
  version: '1.0.1',
  releaseDate: 'October 2026',
  apkDownloadUrl: 'https://github.com/arzakyo/nfc-tooling/releases/latest/download/nfc-tooling.apk',
  githubReleasesUrl: 'https://github.com/arzakyo/nfc-tooling/releases',
  fileSize: '68.0 MB',
  targetPlatform: 'Android 8.0+ (ARM64 & x86_64)',
  changelog: [
    'Seamless Android system bars: matched top/bottom navigation bar colors (#0F172A)',
    'Safe area insets: added status bar padding and tab bar bottom spacing',
    'Home screen scroll fix: release notes expand and scroll smoothly without clipping',
    'Cloudflare Workers SPA configuration with wrangler.json assets deployment',
    'Real APK size metadata calibrated to 68.0 MB'
  ]
};
