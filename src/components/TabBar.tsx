import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export type TabId = 'scan' | 'history' | 'more';

interface TabBarProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onSelectTab }) => {
  const insets = useSafeAreaInsets();
  const tabs: Array<{ id: TabId; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
    { id: 'scan', label: 'Inspector', icon: 'scan-outline' },
    { id: 'history', label: 'History', icon: 'time-outline' },
    { id: 'more', label: 'More', icon: 'grid-outline' },
  ];

  // Dynamic bottom padding: uses system insets if present (gesture bar / 3-button nav), or safe default
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'android' ? 16 : Platform.OS === 'ios' ? 20 : 12);

  return (
    <View style={[styles.container, { paddingBottom: bottomPadding }]}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => onSelectTab(tab.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={tab.icon}
              size={22}
              color={isActive ? '#38BDF8' : '#64748B'}
            />
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingTop: 10,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 4,
    minHeight: 46,
  },
  label: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    lineHeight: 14,
  },
  activeLabel: {
    color: '#38BDF8',
    fontWeight: '700',
  },
});
