import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CURRENT_RELEASE } from '../data/releaseData';
import { fetchGitHubReleases, GitHubRelease, GITHUB_RELEASES_PAGE_URL } from '../services/githubReleaseService';

export const AboutScreen: React.FC = () => {
  const [latestRelease, setLatestRelease] = useState<GitHubRelease | null>(null);

  useEffect(() => {
    fetchGitHubReleases().then(releases => {
      if (releases && releases.length > 0) {
        setLatestRelease(releases[0]);
      }
    });
  }, []);

  const handleOpenGitHub = () => {
    Linking.openURL(GITHUB_RELEASES_PAGE_URL);
  };

  const handleOpenSourceRepo = () => {
    Linking.openURL('https://github.com/arzakyo/nfc-tooling');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* App Branding Card */}
      <View style={styles.brandCard}>
        <View style={styles.logoCircle}>
          <Ionicons name="hardware-chip" size={36} color="#38BDF8" />
        </View>
        <Text style={styles.appName}>NFC Tooling</Text>
        <View style={styles.versionPill}>
          <Text style={styles.versionText}>Version {CURRENT_RELEASE.version}</Text>
        </View>
        <Text style={styles.appTagline}>
          Offline NFC & Smart Card Inspector for Android, iOS & Web
        </Text>
      </View>

      {/* Build & Environment Details */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="information-circle-outline" size={18} color="#94A3B8" />
          <Text style={styles.sectionTitle}>Application Information</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>App Version</Text>
            <Text style={[styles.infoValue, { color: '#38BDF8' }]}>v{CURRENT_RELEASE.version}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Release Date</Text>
            <Text style={styles.infoValue}>{CURRENT_RELEASE.releaseDate}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Runtime Platform</Text>
            <Text style={styles.infoValue}>
              {Platform.OS === 'web' ? 'Web Browser (PWA)' : `${Platform.OS.toUpperCase()} Native`}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>NFC Engine</Text>
            <Text style={styles.infoValue}>
              {Platform.OS === 'web' ? 'Web NDEFReader API' : 'react-native-nfc-manager'}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Deep APDU Probing</Text>
            <Text style={[styles.infoValue, { color: Platform.OS === 'web' ? '#F59E0B' : '#10B981' }]}>
              {Platform.OS === 'web' ? 'Requires Mobile App' : 'Enabled (Native IsoDep)'}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Privacy & Telemetry</Text>
            <Text style={[styles.infoValue, { color: '#10B981' }]}>100% Offline / Zero Trackers</Text>
          </View>
        </View>
      </View>

      {/* Latest Release & Changelog */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="sparkles-outline" size={18} color="#94A3B8" />
          <Text style={styles.sectionTitle}>What's New in v{CURRENT_RELEASE.version}</Text>
        </View>

        <View style={styles.changelogCard}>
          {CURRENT_RELEASE.changelog.map((item, index) => (
            <View key={index} style={styles.changelogRow}>
              <Ionicons name="checkmark-circle" size={16} color="#38BDF8" style={{ marginTop: 2 }} />
              <Text style={styles.changelogText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* External Links */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="git-branch-outline" size={18} color="#94A3B8" />
          <Text style={styles.sectionTitle}>Repository & Source</Text>
        </View>

        <TouchableOpacity style={styles.actionBtn} onPress={handleOpenSourceRepo} activeOpacity={0.7}>
          <View style={styles.actionLeft}>
            <Ionicons name="logo-github" size={20} color="#F8FAFC" />
            <Text style={styles.actionText}>GitHub Repository</Text>
          </View>
          <Ionicons name="open-outline" size={16} color="#64748B" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, { marginTop: 8 }]} onPress={handleOpenGitHub} activeOpacity={0.7}>
          <View style={styles.actionLeft}>
            <Ionicons name="cloud-download-outline" size={20} color="#38BDF8" />
            <Text style={styles.actionText}>All Releases & APK Downloads</Text>
          </View>
          <Ionicons name="open-outline" size={16} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Footer Copyright / Open Source Notice */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Built with React Native & Expo. 100% Open Source.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  brandCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 20,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  appName: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  versionPill: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  versionText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
  },
  appTagline: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoCard: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#1E293B',
  },
  infoLabel: {
    color: '#94A3B8',
    fontSize: 13,
  },
  infoValue: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
  },
  changelogCard: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 10,
  },
  changelogRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  changelogText: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 19,
    flex: 1,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 12,
  },
  footerText: {
    color: '#475569',
    fontSize: 12,
    textAlign: 'center',
  },
});
