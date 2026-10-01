import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, StatusBar, Platform } from 'react-native';
import { TabBar, TabId } from './src/components/TabBar';
import { ScanScreen } from './src/screens/ScanScreen';
import { PocketBookScreen } from './src/screens/PocketBookScreen';
import { FaqScreen } from './src/screens/FaqScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('scan');
  const [targetPocketBookSection, setTargetPocketBookSection] = useState<string | undefined>(undefined);

  const handleOpenPocketBookSection = (sectionId: string) => {
    setTargetPocketBookSection(sectionId);
    setActiveTab('pocketbook');
  };

  const handleSelectTab = (tab: TabId) => {
    if (tab !== 'pocketbook') {
      setTargetPocketBookSection(undefined);
    }
    setActiveTab(tab);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#020617" />
      
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
        {activeTab === 'pocketbook' && (
          <PocketBookScreen initialSectionId={targetPocketBookSection} />
        )}
        {activeTab === 'faq' && (
          <FaqScreen onOpenPocketBookSection={handleOpenPocketBookSection} />
        )}
        {activeTab === 'history' && <HistoryScreen />}
      </View>

      {/* Bottom Navigation */}
      <TabBar activeTab={activeTab} onSelectTab={handleSelectTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#020617',
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
