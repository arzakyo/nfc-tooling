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
  version: '1.1.0',
  releaseDate: 'October 2026',
  apkDownloadUrl: 'https://github.com/arzakyo/nfc-tooling/releases/latest/download/nfc-tooling.apk',
  githubReleasesUrl: 'https://github.com/arzakyo/nfc-tooling/releases',
  fileSize: '69.0 MB',
  targetPlatform: 'Android 8.0+ (ARM64 & x86_64)',
  changelog: [
    'Multi-language localization (English & Indonesian) with automatic system detection',
    'Theme customization (Light, Dark, and System appearance) with persistence',
    'Interactive settings modal dialogs with vector flag representations',
    'Comprehensive Indonesian translation across Pocket Book and FAQs'
  ]
};
