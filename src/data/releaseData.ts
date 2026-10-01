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
  version: '1.0.0',
  releaseDate: 'October 2026',
  apkDownloadUrl: 'https://github.com/arzakyo/nfc-tooling/releases/latest/download/nfc-tooling.apk',
  githubReleasesUrl: 'https://github.com/arzakyo/nfc-tooling/releases',
  fileSize: '~38 MB',
  targetPlatform: 'Android 8.0+ (ARM64 & x86_64)',
  changelog: [
    'Initial Android & Web Hybrid release',
    'Deep card inspection: UID, Random UID (08:) detection, SAK, ATQA, ATS',
    'Smart Card Reader (APDU): Probes Mandiri e-Money & BCA Flazz balance and 16-digit PAN',
    'NDEF Parser: Decodes Text, URI, and JSON payloads with raw hex view',
    'Embedded interactive Pocket Book & FAQ handbook with cross-linking',
    'Local offline scan history with AsyncStorage persistence'
  ]
};
