import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CURRENT_RELEASE } from '../data/releaseData';
import { fetchGitHubReleases, GitHubRelease, GITHUB_RELEASES_PAGE_URL } from '../services/githubReleaseService';
import { useTheme } from '../theme/ThemeContext';
import { useI18n } from '../i18n/I18nContext';

export const AboutScreen: React.FC = () => {
  const [latestRelease, setLatestRelease] = useState<GitHubRelease | null>(null);
  const { colors } = useTheme();
  const { t } = useI18n();

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
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      {/* App Branding Card */}
      <View style={[styles.brandCard, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
        <View style={[styles.logoCircle, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
          <Ionicons name="hardware-chip" size={36} color={colors.primary} />
        </View>
        <Text style={[styles.appName, { color: colors.textPrimary }]}>{t.about.appName}</Text>
        <View style={[styles.versionPill, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
          <Text style={[styles.versionText, { color: colors.primary }]}>
            {t.about.appVersion} {CURRENT_RELEASE.version}
          </Text>
        </View>
        <Text style={[styles.appTagline, { color: colors.textSecondary }]}>
          {t.about.tagline}
        </Text>
      </View>

      {/* Build & Environment Details */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="information-circle-outline" size={18} color={colors.textMuted} />
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t.about.appInfoSection}</Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t.about.appVersion}</Text>
            <Text style={[styles.infoValue, { color: colors.primary }]}>v{CURRENT_RELEASE.version}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.borderColor }]} />

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t.about.releaseDate}</Text>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{CURRENT_RELEASE.releaseDate}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.borderColor }]} />

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Runtime Platform</Text>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
              {Platform.OS === 'web' ? 'Web Browser (PWA)' : `${Platform.OS.toUpperCase()} Native`}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.borderColor }]} />

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>NFC Engine</Text>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
              {Platform.OS === 'web' ? 'Web NDEFReader API' : 'react-native-nfc-manager'}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.borderColor }]} />

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Deep APDU Probing</Text>
            <Text style={[styles.infoValue, { color: Platform.OS === 'web' ? colors.warning : colors.success }]}>
              {Platform.OS === 'web' ? 'Requires Mobile App' : 'Enabled (Native IsoDep)'}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.borderColor }]} />

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Privacy & Telemetry</Text>
            <Text style={[styles.infoValue, { color: colors.success }]}>{t.about.privacy100}</Text>
          </View>
        </View>
      </View>

      {/* Latest Release & Changelog */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="sparkles-outline" size={18} color={colors.textMuted} />
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>What's New in v{CURRENT_RELEASE.version}</Text>
        </View>

        <View style={[styles.changelogCard, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
          {CURRENT_RELEASE.changelog.map((item, index) => (
            <View key={index} style={styles.changelogRow}>
              <Ionicons name="checkmark-circle" size={16} color={colors.primary} style={{ marginTop: 2 }} />
              <Text style={[styles.changelogText, { color: colors.textSecondary }]}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* External Links */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="git-branch-outline" size={18} color={colors.textMuted} />
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t.about.githubSection}</Text>
        </View>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}
          onPress={handleOpenSourceRepo}
          activeOpacity={0.7}
        >
          <View style={styles.actionLeft}>
            <Ionicons name="logo-github" size={20} color={colors.textPrimary} />
            <Text style={[styles.actionText, { color: colors.textPrimary }]}>{t.about.viewGithub}</Text>
          </View>
          <Ionicons name="open-outline" size={16} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, { marginTop: 8, backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}
          onPress={handleOpenGitHub}
          activeOpacity={0.7}
        >
          <View style={styles.actionLeft}>
            <Ionicons name="cloud-download-outline" size={20} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.textPrimary }]}>{t.about.releasesPage}</Text>
          </View>
          <Ionicons name="open-outline" size={16} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Footer Copyright / Open Source Notice */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textMuted }]}>
          Built with React Native & Expo. 100% Open Source.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  brandCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 20,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
  },
  appName: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  versionPill: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 6,
    marginBottom: 10,
    borderWidth: 1,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '700',
  },
  appTagline: {
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
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoCard: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  divider: {
    height: 1,
  },
  infoLabel: {
    fontSize: 13,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  changelogCard: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    gap: 10,
  },
  changelogRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  changelogText: {
    fontSize: 13,
    lineHeight: 19,
    flex: 1,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 12,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
