import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PocketBookScreen } from './PocketBookScreen';
import { FaqScreen } from './FaqScreen';
import { AboutScreen } from './AboutScreen';
import { CURRENT_RELEASE } from '../data/releaseData';
import { useBackHandler } from '../hooks/useBackHandler';

type SubView = 'menu' | 'pocketbook' | 'faq' | 'about';

interface MoreScreenProps {
  initialSubView?: SubView;
  initialPocketBookSection?: string;
}

export const MoreScreen: React.FC<MoreScreenProps> = ({
  initialSubView = 'menu',
  initialPocketBookSection,
}) => {
  const [currentSubView, setCurrentSubView] = useState<SubView>(initialSubView);
  const [targetPocketBookSection, setTargetPocketBookSection] = useState<string | undefined>(
    initialPocketBookSection
  );

  // Sync with browser hash on initial load and forward/back navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncWithHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#more/pocketbook')) {
        setCurrentSubView('pocketbook');
      } else if (hash.startsWith('#more/faq')) {
        setCurrentSubView('faq');
      } else if (hash.startsWith('#more/about')) {
        setCurrentSubView('about');
      } else if (hash === '#more') {
        setCurrentSubView('menu');
      }
    };

    window.addEventListener('popstate', syncWithHash);
    return () => window.removeEventListener('popstate', syncWithHash);
  }, []);

  // Universal back handler (Android hardware back)
  useBackHandler({
    enabled: currentSubView !== 'menu',
    onBack: () => {
      setCurrentSubView('menu');
      if (typeof window !== 'undefined' && window.location.hash.startsWith('#more/')) {
        window.history.pushState({ tab: 'more' }, '', '#more');
      }
    },
    historyKey: `more-${currentSubView}`,
  });

  const handleOpenPocketBook = (sectionId?: string) => {
    setTargetPocketBookSection(sectionId);
    setCurrentSubView('pocketbook');
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab: 'more', sub: 'pocketbook' }, '', '#more/pocketbook');
    }
  };

  const handleOpenFaq = () => {
    setCurrentSubView('faq');
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab: 'more', sub: 'faq' }, '', '#more/faq');
    }
  };

  const handleOpenAbout = () => {
    setCurrentSubView('about');
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab: 'more', sub: 'about' }, '', '#more/about');
    }
  };

  const handleBackToMenu = () => {
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#more/')) {
      window.history.back();
    } else {
      setCurrentSubView('menu');
    }
  };

  // If inside a sub-screen, render sub-header with Back Button
  if (currentSubView !== 'menu') {
    const titleMap: Record<SubView, string> = {
      menu: 'More',
      pocketbook: 'Pocket Book',
      faq: 'FAQ & Guidance',
      about: 'About App',
    };

    return (
      <View style={styles.container}>
        <View style={styles.subHeader}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackToMenu} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color="#38BDF8" />
            <Text style={styles.backButtonText}>Back to More</Text>
          </TouchableOpacity>
          <Text style={styles.subHeaderTitle}>{titleMap[currentSubView]}</Text>
        </View>

        <View style={styles.subScreenContainer}>
          {currentSubView === 'pocketbook' && (
            <PocketBookScreen initialSectionId={targetPocketBookSection} />
          )}
          {currentSubView === 'faq' && (
            <FaqScreen onOpenPocketBookSection={(secId) => handleOpenPocketBook(secId)} />
          )}
          {currentSubView === 'about' && <AboutScreen />}
        </View>
      </View>
    );
  }

  // Main More Menu
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>More & Information</Text>
        <Text style={styles.subtitle}>Guides, FAQs, App Info & Diagnostics</Text>
      </View>

      {/* Primary Menu Items */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionHeader}>Knowledge & Docs</Text>

        <TouchableOpacity style={styles.menuItem} onPress={() => handleOpenPocketBook()} activeOpacity={0.7}>
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
            <Ionicons name="book-outline" size={22} color="#38BDF8" />
          </View>
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemTitle}>NFC Pocket Book</Text>
            <Text style={styles.itemSubtitle}>Architecture, chip matrix, security & APDUs</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#64748B" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.menuItem} onPress={handleOpenFaq} activeOpacity={0.7}>
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
            <Ionicons name="help-circle-outline" size={22} color="#A855F7" />
          </View>
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemTitle}>Frequently Asked Questions</Text>
            <Text style={styles.itemSubtitle}>Common card reading issues, cloning & tips</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* App Info Section */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionHeader}>Application</Text>

        <TouchableOpacity style={styles.menuItem} onPress={handleOpenAbout} activeOpacity={0.7}>
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
            <Ionicons name="information-circle-outline" size={22} color="#10B981" />
          </View>
          <View style={styles.itemTextContainer}>
            <View style={styles.titleBadgeRow}>
              <Text style={styles.itemTitle}>About NFC Tooling</Text>
              <View style={styles.versionBadge}>
                <Text style={styles.versionText}>v{CURRENT_RELEASE.version}</Text>
              </View>
            </View>
            <Text style={styles.itemSubtitle}>Version details, changelog, offline privacy & GitHub</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#64748B" />
        </TouchableOpacity>
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
  header: {
    marginBottom: 20,
    marginTop: 4,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 4,
  },
  menuSection: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  sectionHeader: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  itemTextContainer: {
    flex: 1,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '600',
  },
  itemSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  versionBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  versionText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#1E293B',
    marginVertical: 4,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backButtonText: {
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: '600',
  },
  subHeaderTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  subScreenContainer: {
    flex: 1,
  },
});
