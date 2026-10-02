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
  version: '1.0.2',
  releaseDate: 'October 2026',
  apkDownloadUrl: 'https://github.com/arzakyo/nfc-tooling/releases/latest/download/nfc-tooling.apk',
  githubReleasesUrl: 'https://github.com/arzakyo/nfc-tooling/releases',
  fileSize: '68.0 MB',
  targetPlatform: 'Android 8.0+ (ARM64 & x86_64)',
  changelog: [
    'Dynamic bottom safe area insets via react-native-safe-area-context',
    'Fixed navigation bar overlap with Android 3-button nav and gesture pills',
    'Seamless status bar and navigation bar system colors'
  ]
};
