import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useI18n } from '../i18n/I18nContext';

export type TabId = 'scan' | 'history' | 'more';

interface TabBarProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onSelectTab }) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { t } = useI18n();

  const tabs: Array<{ id: TabId; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
    { id: 'scan', label: t.tabs.inspector, icon: 'scan-outline' },
    { id: 'history', label: t.tabs.history, icon: 'time-outline' },
    { id: 'more', label: t.tabs.more, icon: 'grid-outline' },
  ];

  // Dynamic bottom padding: uses system insets if present (gesture bar / 3-button nav), or safe default
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'android' ? 16 : Platform.OS === 'ios' ? 20 : 12);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.tabBarBg,
          borderTopColor: colors.tabBarBorder,
          paddingBottom: bottomPadding,
        },
      ]}
    >
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
              color={isActive ? colors.primary : colors.textMuted}
            />
            <Text
              style={[
                styles.label,
                { color: colors.textMuted },
                isActive && { color: colors.primary, fontWeight: '700' },
              ]}
            >
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
    borderTopWidth: 1,
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
    fontWeight: '600',
    lineHeight: 14,
  },
});
