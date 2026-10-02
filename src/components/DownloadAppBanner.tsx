import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  fetchGitHubReleases,
  GitHubRelease,
  DIRECT_LATEST_APK_URL,
  GITHUB_RELEASES_PAGE_URL,
} from '../services/githubReleaseService';
import { useTheme } from '../theme/ThemeContext';
import { useI18n } from '../i18n/I18nContext';

export const DownloadAppBanner: React.FC = () => {
  // Only display on Web
  if (Platform.OS !== 'web') {
    return null;
  }

  const { colors } = useTheme();
  const { t } = useI18n();

  const [releases, setReleases] = useState<GitHubRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllVersions, setShowAllVersions] = useState(false);

  useEffect(() => {
    fetchGitHubReleases().then((data) => {
      setReleases(data);
      setLoading(false);
    });
  }, []);

  const latestRelease = releases[0];

  const handleDownloadLatest = () => {
    const url = latestRelease?.apkDownloadUrl || DIRECT_LATEST_APK_URL;
    Linking.openURL(url);
  };

  const handleDownloadSpecific = (url: string) => {
    Linking.openURL(url);
  };

  const handleOpenGithub = () => {
    Linking.openURL(GITHUB_RELEASES_PAGE_URL);
  };

  return (
    <View style={[styles.banner, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
      {/* Top Header */}
      <View style={styles.topRow}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name="phone-portrait-outline" size={24} color={colors.primary} />
        </View>
        <View style={styles.headerText}>
          <View style={styles.badgeRow}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{t.banner.downloadNative}</Text>
            {latestRelease && (
              <View style={[styles.versionBadge, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
                <Text style={[styles.versionText, { color: colors.primary }]}>{latestRelease.tagName}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {t.banner.nativePromo}
          </Text>
        </View>
      </View>

      {/* Primary Action Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.downloadBtn, { backgroundColor: colors.primary }]}
          onPress={handleDownloadLatest}
          activeOpacity={0.8}
        >
          <Ionicons name="download-outline" size={16} color="#0F172A" />
          <Text style={styles.downloadBtnText}>
            {t.banner.downloadApk.replace('{{size}}', latestRelease?.fileSize ? ` (${latestRelease.fileSize})` : '')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleBtn, { backgroundColor: colors.surfaceBg, borderColor: colors.borderColor }]}
          onPress={() => setShowAllVersions(!showAllVersions)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={showAllVersions ? 'chevron-up-outline' : 'list-outline'}
            size={16}
            color={colors.textSecondary}
          />
          <Text style={[styles.toggleBtnText, { color: colors.textSecondary }]}>
            {t.banner.olderVersions}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.githubBtn, { backgroundColor: colors.surfaceBg, borderColor: colors.borderColor }]}
          onPress={handleOpenGithub}
          activeOpacity={0.7}
        >
          <Ionicons name="logo-github" size={16} color={colors.textSecondary} />
          <Text style={[styles.githubBtnText, { color: colors.textSecondary }]}>GitHub</Text>
        </TouchableOpacity>
      </View>

      {/* Expandable Version List & Changelogs */}
      {showAllVersions && (
        <View style={[styles.versionDrawer, { borderTopColor: colors.borderColor }]}>
          <Text style={[styles.drawerTitle, { color: colors.textPrimary }]}>Release History & Downloads</Text>
          {loading ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: 12 }} />
          ) : (
            releases.map((rel, idx) => (
              <View
                key={rel.id || idx}
                style={[styles.releaseCard, { backgroundColor: colors.surfaceBg, borderColor: colors.borderColor }]}
              >
                <View style={styles.releaseHeader}>
                  <View style={[styles.releaseTagBadge, { backgroundColor: colors.primaryLight }]}>
                    <Text style={[styles.releaseTagText, { color: colors.primary }]}>{rel.tagName}</Text>
                  </View>
                  <Text style={[styles.releaseDate, { color: colors.textMuted }]}>{rel.publishedAt}</Text>
                  <TouchableOpacity
                    style={[styles.inlineDownloadBtn, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}
                    onPress={() => handleDownloadSpecific(rel.apkDownloadUrl)}
                  >
                    <Ionicons name="download-outline" size={13} color={colors.primary} />
                    <Text style={[styles.inlineDownloadText, { color: colors.primary }]}>Get APK</Text>
                  </TouchableOpacity>
                </View>

                {/* Changelog lines */}
                <View style={styles.changelogContent}>
                  {rel.body
                    .split('\n')
                    .filter((line) => line.trim().length > 0)
                    .map((line, lIdx) => (
                      <View key={lIdx} style={styles.changelogLine}>
                        <Ionicons
                          name="checkmark-circle"
                          size={13}
                          color={colors.primary}
                          style={{ marginTop: 2 }}
                        />
                        <Text style={[styles.changelogText, { color: colors.textSecondary }]}>
                          {line.replace(/^[-*]\s*/, '')}
                        </Text>
                      </View>
                    ))}
                </View>
              </View>
            ))
          )}

          <Text style={[styles.installTip, { color: colors.textMuted, backgroundColor: colors.surfaceBg }]}>
            💡 Tip: When downloading on Android, tap &quot;Download anyway&quot; if prompted and enable
            &quot;Install from unknown sources&quot; in settings.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    borderRadius: 14,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  versionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  versionText: {
    fontSize: 11,
    fontWeight: '700',
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  downloadBtn: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  downloadBtnText: {
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 13,
  },
  toggleBtn: {
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toggleBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  githubBtn: {
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  githubBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  versionDrawer: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  drawerTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  releaseCard: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  releaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  releaseTagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  releaseTagText: {
    fontWeight: '700',
    fontSize: 12,
  },
  releaseDate: {
    fontSize: 12,
    flex: 1,
  },
  inlineDownloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  inlineDownloadText: {
    fontSize: 11,
    fontWeight: '700',
  },
  changelogContent: {
    marginTop: 4,
  },
  changelogLine: {
    flexDirection: 'row',
    gap: 6,
    marginVertical: 2,
  },
  changelogText: {
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
  },
  installTip: {
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 10,
    padding: 8,
    borderRadius: 6,
  },
});
