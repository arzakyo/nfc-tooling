import { CURRENT_RELEASE, ReleaseInfo } from '../data/releaseData';

export interface GitHubRelease {
  id: number;
  tagName: string;
  name: string;
  publishedAt: string;
  body: string;
  apkDownloadUrl: string;
  fileSize?: string;
}

const GITHUB_REPO = 'arzakyo/nfc-tooling';
export const DIRECT_LATEST_APK_URL = `https://github.com/${GITHUB_REPO}/releases/latest/download/nfc-tooling.apk`;
export const GITHUB_RELEASES_PAGE_URL = `https://github.com/${GITHUB_REPO}/releases`;

/**
 * Fetches all published releases from the GitHub Releases API.
 * Falls back to static CURRENT_RELEASE if network fails or repo is not yet published.
 */
export async function fetchGitHubReleases(): Promise<GitHubRelease[]> {
  try {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      return getFallbackReleases();
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      return getFallbackReleases();
    }

    return data.map((item: any) => {
      const apkAsset = (item.assets || []).find((asset: any) =>
        asset.name.toLowerCase().endsWith('.apk')
      );

      const sizeInMb = apkAsset?.size
        ? `~${Math.round(apkAsset.size / (1024 * 1024))} MB`
        : '~38 MB';

      return {
        id: item.id,
        tagName: item.tag_name,
        name: item.name || item.tag_name,
        publishedAt: new Date(item.published_at).toLocaleDateString(),
        body: item.body || 'No release notes provided.',
        apkDownloadUrl: apkAsset ? apkAsset.browser_download_url : DIRECT_LATEST_APK_URL,
        fileSize: sizeInMb,
      };
    });
  } catch (err) {
    console.warn('Failed to fetch GitHub releases, using fallback.', err);
    return getFallbackReleases();
  }
}

function getFallbackReleases(): GitHubRelease[] {
  return [
    {
      id: 1,
      tagName: `v${CURRENT_RELEASE.version}`,
      name: `Release v${CURRENT_RELEASE.version}`,
      publishedAt: CURRENT_RELEASE.releaseDate,
      body: CURRENT_RELEASE.changelog.map((c) => `- ${c}`).join('\n'),
      apkDownloadUrl: DIRECT_LATEST_APK_URL,
      fileSize: CURRENT_RELEASE.fileSize,
    },
  ];
}
