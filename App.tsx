import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Platform, BackHandler } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { TabBar, TabId } from './src/components/TabBar';
import { ScanScreen } from './src/screens/ScanScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { MoreScreen } from './src/screens/MoreScreen';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { I18nProvider, useI18n } from './src/i18n/I18nContext';

function MainApp() {
  const [activeTab, setActiveTab] = useState<TabId>('scan');
  const { colors, activeTheme } = useTheme();
  const { t } = useI18n();

  // Handle hardware back button and browser history for tabs
  useEffect(() => {
    // 1. Android hardware back press
    if (Platform.OS !== 'web') {
      const handleBack = () => {
        if (activeTab !== 'scan') {
          setActiveTab('scan');
          return true; // handled, don't exit app
        }
        return false;
      };

      const sub = BackHandler.addEventListener('hardwareBackPress', handleBack);
      return () => sub.remove();
    }

    // 2. Browser back button for tabs
    if (typeof window !== 'undefined') {
      const currentTab = (window.history.state as any)?.tab;
      if (currentTab !== activeTab) {
        window.history.pushState({ tab: activeTab }, '', `#${activeTab}`);
      }

      const handlePopState = (event: PopStateEvent) => {
        const targetTab = event.state?.tab as TabId | undefined;
        if (targetTab && ['scan', 'history', 'more'].includes(targetTab)) {
          setActiveTab(targetTab);
        } else if (window.location.hash) {
          const rawHash = window.location.hash.replace('#', '').split('/')[0] as TabId;
          if (['scan', 'history', 'more'].includes(rawHash)) {
            setActiveTab(rawHash);
          } else {
            setActiveTab('scan');
          }
        } else {
          setActiveTab('scan');
        }
      };

      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [activeTab]);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.navBg }]}
      edges={['top']}
    >
      <StatusBar
        style={activeTheme === 'dark' ? 'light' : 'dark'}
      />

      <View
        style={[
          styles.appShell,
          {
            backgroundColor: colors.background,
            borderColor: colors.borderColor,
          },
        ]}
      >
        {/* Top Navigation Bar */}
        <View
          style={[
            styles.navBar,
            {
              backgroundColor: colors.navBg,
              borderBottomColor: colors.borderColor,
            },
          ]}
        >
          <View style={styles.brandRow}>
            <View style={[styles.logoIcon, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="hardware-chip" size={18} color={colors.primary} />
            </View>
            <Text style={[styles.brandTitle, { color: colors.textPrimary }]}>NFC Tooling</Text>
          </View>
          <View
            style={[
              styles.platformBadge,
              {
                backgroundColor: colors.surfaceBg,
                borderColor: colors.borderColor,
              },
            ]}
          >
            <Text style={[styles.platformText, { color: colors.textSecondary }]}>
              {Platform.OS === 'web'
                ? t.common.webBadge
                : `${Platform.OS.toUpperCase()} ${t.common.nativeBadge}`}
            </Text>
          </View>
        </View>

        {/* Active Tab Screen */}
        <View style={styles.screenContainer}>
          {activeTab === 'scan' && <ScanScreen />}
          {activeTab === 'history' && <HistoryScreen />}
          {activeTab === 'more' && <MoreScreen />}
        </View>

        {/* Bottom Navigation */}
        <TabBar activeTab={activeTab} onSelectTab={setActiveTab} />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <SafeAreaProvider>
          <MainApp />
        </SafeAreaProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  appShell: {
    flex: 1,
    width: '100%',
    maxWidth: 860,
    alignSelf: 'center',
    borderLeftWidth: Platform.OS === 'web' ? 1 : 0,
    borderRightWidth: Platform.OS === 'web' ? 1 : 0,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  platformBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  platformText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  screenContainer: {
    flex: 1,
  },
});
