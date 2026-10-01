import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  fetchGitHubReleases,
  GitHubRelease,
  DIRECT_LATEST_APK_URL,
  GITHUB_RELEASES_PAGE_URL,
} from '../services/githubReleaseService';

export const DownloadAppBanner: React.FC = () => {
  // Only display on Web
  if (Platform.OS !== 'web') {
    return null;
  }

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
    <View style={styles.banner}>
      {/* Top Header */}
      <View style={styles.topRow}>
        <View style={styles.iconCircle}>
          <Ionicons name="phone-portrait-outline" size={24} color="#38BDF8" />
        </View>
        <View style={styles.headerText}>
          <View style={styles.badgeRow}>
            <Text style={styles.title}>Download Native Mobile App</Text>
            {latestRelease && (
              <View style={styles.versionBadge}>
                <Text style={styles.versionText}>{latestRelease.tagName}</Text>
              </View>
            )}
          </View>
          <Text style={styles.description}>
            Web browsers block raw APDU commands for security. Install the Android APK to unlock deep
            scanning for Mandiri e-Money, BCA Flazz balances, and Mifare/DESFire cards.
          </Text>
        </View>
      </View>

      {/* Primary Action Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.downloadBtn}
          onPress={handleDownloadLatest}
          activeOpacity={0.8}
        >
          <Ionicons name="download-outline" size={16} color="#0F172A" />
          <Text style={styles.downloadBtnText}>
            Download Latest APK {latestRelease?.fileSize ? `(${latestRelease.fileSize})` : ''}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toggleBtn}
          onPress={() => setShowAllVersions(!showAllVersions)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={showAllVersions ? 'chevron-up-outline' : 'list-outline'}
            size={16}
            color="#E2E8F0"
          />
          <Text style={styles.toggleBtnText}>
            {showAllVersions ? 'Hide Versions' : 'Releases & Changelog'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.githubBtn} onPress={handleOpenGithub} activeOpacity={0.7}>
          <Ionicons name="logo-github" size={16} color="#94A3B8" />
          <Text style={styles.githubBtnText}>GitHub</Text>
        </TouchableOpacity>
      </View>

      {/* Expandable Version List & Changelogs */}
      {showAllVersions && (
        <View style={styles.versionDrawer}>
          <Text style={styles.drawerTitle}>Release History & Downloads</Text>
          {loading ? (
            <ActivityIndicator color="#38BDF8" style={{ marginVertical: 12 }} />
          ) : (
            releases.map((rel, idx) => (
              <View key={rel.id || idx} style={styles.releaseCard}>
                <View style={styles.releaseHeader}>
                  <View style={styles.releaseTagBadge}>
                    <Text style={styles.releaseTagText}>{rel.tagName}</Text>
                  </View>
                  <Text style={styles.releaseDate}>{rel.publishedAt}</Text>
                  <TouchableOpacity
                    style={styles.inlineDownloadBtn}
                    onPress={() => handleDownloadSpecific(rel.apkDownloadUrl)}
                  >
                    <Ionicons name="download-outline" size={13} color="#38BDF8" />
                    <Text style={styles.inlineDownloadText}>Get APK</Text>
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
                          color="#38BDF8"
                          style={{ marginTop: 2 }}
                        />
                        <Text style={styles.changelogText}>{line.replace(/^[-*]\s*/, '')}</Text>
                      </View>
                    ))}
                </View>
              </View>
            ))
          )}

          <Text style={styles.installTip}>
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
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#334155',
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
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
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
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  versionBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
  },
  versionText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  description: {
    color: '#94A3B8',
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
    backgroundColor: '#38BDF8',
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
    backgroundColor: '#0F172A',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toggleBtnText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
  githubBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  githubBtnText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  versionDrawer: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  drawerTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  releaseCard: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  releaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  releaseTagBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  releaseTagText: {
    color: '#38BDF8',
    fontWeight: '700',
    fontSize: 12,
  },
  releaseDate: {
    color: '#64748B',
    fontSize: 12,
    flex: 1,
  },
  inlineDownloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  inlineDownloadText: {
    color: '#38BDF8',
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
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
  },
  installTip: {
    color: '#94A3B8',
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    padding: 8,
    borderRadius: 6,
  },
});
