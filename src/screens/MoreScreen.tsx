import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PocketBookScreen } from './PocketBookScreen';
import { FaqScreen } from './FaqScreen';
import { AboutScreen } from './AboutScreen';
import { CURRENT_RELEASE } from '../data/releaseData';
import { useBackHandler } from '../hooks/useBackHandler';
import { useTheme, ThemePreference } from '../theme/ThemeContext';
import { useI18n, SupportedLanguage } from '../i18n/I18nContext';
import { FlagIcon } from '../components/FlagIcon';

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

  // Modals for Theme & Language selection
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  const { colors, preference, setPreference } = useTheme();
  const { language, setLanguage, t } = useI18n();

  // Sync with browser hash on initial load and forward/back navigation (Web only)
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const syncWithHash = () => {
      const hash = window.location?.hash || '';
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
    enabled: currentSubView !== 'menu' || isThemeModalOpen || isLangModalOpen,
    onBack: () => {
      if (isThemeModalOpen) {
        setIsThemeModalOpen(false);
        return;
      }
      if (isLangModalOpen) {
        setIsLangModalOpen(false);
        return;
      }
      setCurrentSubView('menu');
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.hash?.startsWith('#more/')) {
        window.history.pushState({ tab: 'more' }, '', '#more');
      }
    },
    historyKey: `more-${currentSubView}-${isThemeModalOpen ? 'theme' : isLangModalOpen ? 'lang' : ''}`,
  });

  const handleOpenPocketBook = (sectionId?: string) => {
    setTargetPocketBookSection(sectionId);
    setCurrentSubView('pocketbook');
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.history.pushState({ tab: 'more', sub: 'pocketbook' }, '', '#more/pocketbook');
    }
  };

  const handleOpenFaq = () => {
    setCurrentSubView('faq');
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.history.pushState({ tab: 'more', sub: 'faq' }, '', '#more/faq');
    }
  };

  const handleOpenAbout = () => {
    setCurrentSubView('about');
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.history.pushState({ tab: 'more', sub: 'about' }, '', '#more/about');
    }
  };

  const handleBackToMenu = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.hash?.startsWith('#more/')) {
      window.history.back();
    } else {
      setCurrentSubView('menu');
    }
  };

  const themeOptions: Array<{ id: ThemePreference; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
    { id: 'system', label: t.more.themeSystem, icon: 'phone-portrait-outline' },
    { id: 'light', label: t.more.themeLight, icon: 'sunny-outline' },
    { id: 'dark', label: t.more.themeDark, icon: 'moon-outline' },
  ];

  const languageOptions: Array<{ id: SupportedLanguage; label: string; abbr: string; nativeName: string }> = [
    { id: 'en', label: 'English', abbr: 'EN', nativeName: 'English' },
    { id: 'id', label: 'Bahasa Indonesia', abbr: 'ID', nativeName: 'Indonesian' },
  ];

  // If inside a sub-screen, render sub-header with Back Button
  if (currentSubView !== 'menu') {
    const titleMap: Record<SubView, string> = {
      menu: t.tabs.more,
      pocketbook: t.more.pocketBookTitle,
      faq: t.faq.title,
      about: t.about.title,
    };

    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.subHeader,
            {
              backgroundColor: colors.navBg,
              borderBottomColor: colors.borderColor,
            },
          ]}
        >
          <TouchableOpacity style={styles.backButton} onPress={handleBackToMenu} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color={colors.primary} />
            <Text style={[styles.backButtonText, { color: colors.primary }]}>{t.more.backToMore}</Text>
          </TouchableOpacity>
          <Text style={[styles.subHeaderTitle, { color: colors.textPrimary }]}>{titleMap[currentSubView]}</Text>
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

  const currentThemeLabel = themeOptions.find(o => o.id === preference)?.label || preference;
  const currentLangObj = languageOptions.find(o => o.id === language) || languageOptions[0];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{t.more.title}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t.more.subtitle}</Text>
      </View>

      {/* Preferences Section (Theme & Language via Popups) */}
      <View
        style={[
          styles.menuSection,
          {
            backgroundColor: colors.cardBg,
            borderColor: colors.borderColor,
          },
        ]}
      >
        <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>{t.more.preferencesSection}</Text>

        {/* Theme Setting Item */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setIsThemeModalOpen(true)}
          activeOpacity={0.7}
        >
          <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
            <Ionicons
              name={preference === 'dark' ? 'moon-outline' : preference === 'light' ? 'sunny-outline' : 'phone-portrait-outline'}
              size={22}
              color={colors.primary}
            />
          </View>
          <View style={styles.itemTextContainer}>
            <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>{t.more.themeLabel}</Text>
            <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>{t.more.themeSub}</Text>
          </View>
          <View style={styles.badgeSelectionRow}>
            <Text style={[styles.currentValueBadge, { color: colors.primary }]}>{currentThemeLabel}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </View>
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: colors.borderColor }]} />

        {/* Language Setting Item */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setIsLangModalOpen(true)}
          activeOpacity={0.7}
        >
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
            <Ionicons name="language-outline" size={22} color={colors.success} />
          </View>
          <View style={styles.itemTextContainer}>
            <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>{t.more.languageLabel}</Text>
            <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>{t.more.languageSub}</Text>
          </View>
          <View style={styles.badgeSelectionRow}>
            <FlagIcon country={language === 'id' ? 'id' : 'us'} size={15} />
            <Text style={[styles.currentValueBadge, { color: colors.success }]}>
              {currentLangObj.abbr}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Primary Menu Items */}
      <View
        style={[
          styles.menuSection,
          {
            backgroundColor: colors.cardBg,
            borderColor: colors.borderColor,
          },
        ]}
      >
        <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>{t.more.knowledgeSection}</Text>

        <TouchableOpacity style={styles.menuItem} onPress={() => handleOpenPocketBook()} activeOpacity={0.7}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="book-outline" size={22} color={colors.primary} />
          </View>
          <View style={styles.itemTextContainer}>
            <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>{t.more.pocketBookTitle}</Text>
            <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>{t.more.pocketBookSub}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: colors.borderColor }]} />

        <TouchableOpacity style={styles.menuItem} onPress={handleOpenFaq} activeOpacity={0.7}>
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
            <Ionicons name="help-circle-outline" size={22} color={colors.accent} />
          </View>
          <View style={styles.itemTextContainer}>
            <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>{t.more.faqTitle}</Text>
            <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>{t.more.faqSub}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* App Info Section */}
      <View
        style={[
          styles.menuSection,
          {
            backgroundColor: colors.cardBg,
            borderColor: colors.borderColor,
          },
        ]}
      >
        <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>{t.more.appSection}</Text>

        <TouchableOpacity style={styles.menuItem} onPress={handleOpenAbout} activeOpacity={0.7}>
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
            <Ionicons name="information-circle-outline" size={22} color={colors.success} />
          </View>
          <View style={styles.itemTextContainer}>
            <View style={styles.titleBadgeRow}>
              <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>{t.more.aboutTitle}</Text>
              <View
                style={[
                  styles.versionBadge,
                  {
                    backgroundColor: colors.primaryLight,
                    borderColor: colors.primary,
                  },
                ]}
              >
                <Text style={[styles.versionText, { color: colors.primary }]}>v{CURRENT_RELEASE.version}</Text>
              </View>
            </View>
            <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>{t.more.aboutSub}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* THEME PICKER MODAL */}
      <Modal
        visible={isThemeModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsThemeModalOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsThemeModalOpen(false)}
        >
          <View
            style={[
              styles.modalCard,
              { backgroundColor: colors.cardBg, borderColor: colors.borderColor },
            ]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <Ionicons name="color-palette-outline" size={20} color={colors.primary} />
                <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>{t.more.themeLabel}</Text>
              </View>
              <TouchableOpacity onPress={() => setIsThemeModalOpen(false)}>
                <Ionicons name="close" size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalOptionsList}>
              {themeOptions.map((opt) => {
                const isSelected = preference === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.modalOptionRow,
                      { backgroundColor: isSelected ? colors.surfaceBg : 'transparent', borderColor: isSelected ? colors.primary : colors.borderColor },
                    ]}
                    onPress={() => {
                      setPreference(opt.id);
                      setIsThemeModalOpen(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.optionLeft}>
                      <Ionicons
                        name={opt.icon}
                        size={20}
                        color={isSelected ? colors.primary : colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.optionLabel,
                          { color: isSelected ? colors.primary : colors.textPrimary },
                          isSelected && { fontWeight: '700' },
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* LANGUAGE PICKER MODAL WITH FLAGS */}
      <Modal
        visible={isLangModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsLangModalOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsLangModalOpen(false)}
        >
          <View
            style={[
              styles.modalCard,
              { backgroundColor: colors.cardBg, borderColor: colors.borderColor },
            ]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <Ionicons name="globe-outline" size={20} color={colors.success} />
                <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>{t.more.languageLabel}</Text>
              </View>
              <TouchableOpacity onPress={() => setIsLangModalOpen(false)}>
                <Ionicons name="close" size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalOptionsList}>
              {languageOptions.map((opt) => {
                const isSelected = language === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.modalOptionRow,
                      { backgroundColor: isSelected ? colors.surfaceBg : 'transparent', borderColor: isSelected ? colors.success : colors.borderColor },
                    ]}
                    onPress={() => {
                      setLanguage(opt.id);
                      setIsLangModalOpen(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.optionLeft}>
                      <FlagIcon country={opt.id === 'id' ? 'id' : 'us'} size={18} />
                      <View>
                        <Text
                          style={[
                            styles.optionLabel,
                            { color: isSelected ? colors.success : colors.textPrimary },
                            isSelected && { fontWeight: '700' },
                          ]}
                        >
                          {opt.label}
                        </Text>
                        <Text style={[styles.optionSub, { color: colors.textMuted }]}>
                          {opt.abbr} - {opt.nativeName}
                        </Text>
                      </View>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
  header: {
    marginBottom: 20,
    marginTop: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  menuSection: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  flagIcon: {
    fontSize: 20,
  },
  itemTextContainer: {
    flex: 1,
  },
  badgeSelectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  currentValueBadge: {
    fontSize: 12,
    fontWeight: '600',
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  itemSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  versionBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  versionText: {
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  subHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  subScreenContainer: {
    flex: 1,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  modalOptionsList: {
    gap: 8,
  },
  modalOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalFlag: {
    fontSize: 22,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  optionSub: {
    fontSize: 11,
    marginTop: 1,
  },
});
