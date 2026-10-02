import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, StatusBar, Platform, BackHandler } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { TabBar, TabId } from './src/components/TabBar';
import { ScanScreen } from './src/screens/ScanScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { MoreScreen } from './src/screens/MoreScreen';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('scan');

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
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
        
        <View style={styles.appShell}>
          {/* Top Navigation Bar */}
          <View style={styles.navBar}>
            <View style={styles.brandRow}>
              <View style={styles.logoIcon}>
                <Ionicons name="hardware-chip" size={18} color="#38BDF8" />
              </View>
              <Text style={styles.brandTitle}>NFC Tooling</Text>
            </View>
            <View style={styles.platformBadge}>
              <Text style={styles.platformText}>
                {Platform.OS === 'web' ? 'Web Mode' : `${Platform.OS.toUpperCase()} Native`}
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
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  appShell: {
    flex: 1,
    width: '100%',
    maxWidth: 860,
    alignSelf: 'center',
    backgroundColor: '#020617',
    borderLeftWidth: Platform.OS === 'web' ? 1 : 0,
    borderRightWidth: Platform.OS === 'web' ? 1 : 0,
    borderColor: '#1E293B',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    backgroundColor: '#0F172A',
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
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  platformBadge: {
    backgroundColor: '#1E293B',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  platformText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  screenContainer: {
    flex: 1,
  },
});
