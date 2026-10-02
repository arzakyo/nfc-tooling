import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { POCKET_BOOK_SECTIONS_EN, POCKET_BOOK_SECTIONS_ID, PocketBookSection } from '../data/pocketBookData';
import { useTheme } from '../theme/ThemeContext';
import { useI18n } from '../i18n/I18nContext';

interface PocketBookScreenProps {
  initialSectionId?: string;
}

export const PocketBookScreen: React.FC<PocketBookScreenProps> = ({ initialSectionId }) => {
  const { colors, activeTheme } = useTheme();
  const { language } = useI18n();

  const sections: PocketBookSection[] = language === 'id' ? POCKET_BOOK_SECTIONS_ID : POCKET_BOOK_SECTIONS_EN;
  const [selectedId, setSelectedId] = useState(initialSectionId || sections[0].id);

  const activeSection = sections.find(s => s.id === selectedId) || sections[0];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Horizontal Category Nav */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.tabScroll, { backgroundColor: colors.navBg, borderBottomColor: colors.borderColor }]}
        contentContainerStyle={styles.tabScrollContent}
      >
        {sections.map((sec) => {
          const isSelected = sec.id === selectedId;
          return (
            <TouchableOpacity
              key={sec.id}
              style={[
                styles.tabButton,
                { backgroundColor: colors.surfaceBg, borderColor: colors.borderColor },
                isSelected && { backgroundColor: colors.primary, borderColor: colors.primary },
              ]}
              onPress={() => setSelectedId(sec.id)}
            >
              <Ionicons
                name={sec.icon as any}
                size={16}
                color={isSelected ? '#FFFFFF' : colors.textMuted}
              />
              <Text
                style={[
                  styles.tabText,
                  { color: colors.textSecondary },
                  isSelected && { color: '#FFFFFF', fontWeight: '700' },
                ]}
              >
                {sec.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Main Content Area */}
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerArea}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{activeSection.title}</Text>
          <Text style={[styles.subtitle, { color: colors.primary }]}>{activeSection.subtitle}</Text>
        </View>

        {/* Summary Card */}
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
          <Text style={[styles.summaryText, { color: colors.textPrimary }]}>{activeSection.content.summary}</Text>
        </View>

        {/* Key Highlights */}
        <View style={styles.sectionBlock}>
          <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>
            {language === 'id' ? 'Sorotan Utama & Wawasan' : 'Key Highlights & Insights'}
          </Text>
          {activeSection.content.highlights.map((item, idx) => (
            <View key={idx} style={styles.highlightRow}>
              <Ionicons name="checkmark-circle" size={16} color={colors.primary} style={{ marginTop: 2 }} />
              <Text style={[styles.highlightText, { color: colors.textSecondary }]}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Comparison Table */}
        {activeSection.content.table && (
          <View style={styles.sectionBlock}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={true}
              style={[styles.tableScroll, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}
              contentContainerStyle={styles.tableScrollContent}
            >
              <View style={styles.table}>
                {/* Header Row */}
                <View
                  style={[
                    styles.tableRowHeader,
                    { backgroundColor: colors.surfaceBg, borderBottomColor: colors.borderColor },
                  ]}
                >
                  {activeSection.content.table.headers.map((h, i) => (
                    <Text
                      key={i}
                      style={[
                        styles.tableCell,
                        styles.tableCellHeader,
                        { color: colors.textMuted },
                        i === 0 ? styles.tableCellFirst : styles.tableCellOther,
                      ]}
                    >
                      {h}
                    </Text>
                  ))}
                </View>
                {/* Data Rows */}
                {activeSection.content.table.rows.map((row, rIdx) => (
                  <View
                    key={rIdx}
                    style={[
                      styles.tableRow,
                      { borderBottomColor: colors.borderColor },
                      rIdx % 2 === 1 && {
                        backgroundColor: activeTheme === 'dark' ? '#090D1A' : '#F8FAFC',
                      },
                    ]}
                  >
                    {row.map((cell, cIdx) => (
                      <Text
                        key={cIdx}
                        style={[
                          styles.tableCell,
                          { color: colors.textPrimary },
                          cIdx === 0 && { color: colors.primary, fontWeight: '700' },
                          cIdx === 0 ? styles.tableCellFirst : styles.tableCellOther,
                        ]}
                      >
                        {cell}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Notes & Tips */}
        {activeSection.content.notes && activeSection.content.notes.length > 0 && (
          <View
            style={[
              styles.notesBox,
              { backgroundColor: colors.primaryLight, borderColor: colors.primary },
            ]}
          >
            <Ionicons name="information-circle" size={20} color={colors.primary} />
            <View style={{ flex: 1 }}>
              {activeSection.content.notes.map((n, i) => (
                <Text key={i} style={[styles.noteText, { color: colors.textPrimary }]}>{n}</Text>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabScroll: {
    flexGrow: 0,
    flexShrink: 0,
    borderBottomWidth: 1,
  },
  tabScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: Platform.OS === 'web' ? 'wrap' : 'nowrap',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    maxWidth: 860,
    width: '100%',
    alignSelf: 'center',
  },
  headerArea: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  card: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionBlock: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  highlightRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  highlightText: {
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  tableScroll: {
    borderRadius: 10,
    borderWidth: 1,
    width: '100%',
  },
  tableScrollContent: {
    minWidth: '100%',
    flexGrow: 1,
  },
  table: {
    width: '100%',
    minWidth: '100%',
  },
  tableRowHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 11,
    borderBottomWidth: 1,
    width: '100%',
  },
  tableCell: {
    fontSize: 12,
    paddingHorizontal: 12,
    lineHeight: 18,
  },
  tableCellFirst: {
    minWidth: 150,
    flex: 1.3,
  },
  tableCellOther: {
    minWidth: 130,
    flex: 1,
  },
  tableCellHeader: {
    fontWeight: '700',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  notesBox: {
    flexDirection: 'row',
    gap: 10,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
  },
  noteText: {
    fontSize: 12,
    lineHeight: 17,
  },
});
