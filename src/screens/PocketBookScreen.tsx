import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { POCKET_BOOK_SECTIONS } from '../data/pocketBookData';

interface PocketBookScreenProps {
  initialSectionId?: string;
}

export const PocketBookScreen: React.FC<PocketBookScreenProps> = ({ initialSectionId }) => {
  const [selectedId, setSelectedId] = useState(initialSectionId || POCKET_BOOK_SECTIONS[0].id);

  const activeSection = POCKET_BOOK_SECTIONS.find(s => s.id === selectedId) || POCKET_BOOK_SECTIONS[0];

  return (
    <View style={styles.container}>
      {/* Horizontal Category Nav */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll} contentContainerStyle={styles.tabScrollContent}>
        {POCKET_BOOK_SECTIONS.map((sec) => {
          const isSelected = sec.id === selectedId;
          return (
            <TouchableOpacity
              key={sec.id}
              style={[styles.tabButton, isSelected && styles.tabButtonActive]}
              onPress={() => setSelectedId(sec.id)}
            >
              <Ionicons
                name={sec.icon as any}
                size={16}
                color={isSelected ? '#0F172A' : '#94A3B8'}
              />
              <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
                {sec.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Main Content Area */}
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerArea}>
          <Text style={styles.title}>{activeSection.title}</Text>
          <Text style={styles.subtitle}>{activeSection.subtitle}</Text>
        </View>

        {/* Summary Card */}
        <View style={styles.card}>
          <Text style={styles.summaryText}>{activeSection.content.summary}</Text>
        </View>

        {/* Key Highlights */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionHeader}>Key Highlights & Insights</Text>
          {activeSection.content.highlights.map((item, idx) => (
            <View key={idx} style={styles.highlightRow}>
              <Ionicons name="checkmark-circle" size={16} color="#38BDF8" style={{ marginTop: 2 }} />
              <Text style={styles.highlightText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Comparison Table */}
        {activeSection.content.table && (
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeader}>Comparison Matrix</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.tableScroll}>
              <View style={styles.table}>
                {/* Header Row */}
                <View style={styles.tableRowHeader}>
                  {activeSection.content.table.headers.map((h, i) => (
                    <Text key={i} style={[styles.tableCell, styles.tableCellHeader, i === 0 && { width: 140 }]}>
                      {h}
                    </Text>
                  ))}
                </View>
                {/* Data Rows */}
                {activeSection.content.table.rows.map((row, rIdx) => (
                  <View key={rIdx} style={[styles.tableRow, rIdx % 2 === 1 && styles.tableRowAlt]}>
                    {row.map((cell, cIdx) => (
                      <Text key={cIdx} style={[styles.tableCell, cIdx === 0 && styles.tableCellPrimary, cIdx === 0 && { width: 140 }]}>
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
          <View style={styles.notesBox}>
            <Ionicons name="information-circle" size={20} color="#38BDF8" />
            <View style={{ flex: 1 }}>
              {activeSection.content.notes.map((n, i) => (
                <Text key={i} style={styles.noteText}>{n}</Text>
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
    backgroundColor: '#020617',
  },
  tabScroll: {
    maxHeight: 52,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  tabScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1E293B',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tabButtonActive: {
    backgroundColor: '#38BDF8',
    borderColor: '#38BDF8',
  },
  tabText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#0F172A',
    fontWeight: '700',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  headerArea: {
    marginBottom: 16,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  summaryText: {
    color: '#E2E8F0',
    fontSize: 14,
    lineHeight: 20,
  },
  sectionBlock: {
    marginBottom: 20,
  },
  sectionHeader: {
    color: '#94A3B8',
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
    color: '#E2E8F0',
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  tableScroll: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#0F172A',
  },
  table: {
    minWidth: 460,
  },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  tableRowAlt: {
    backgroundColor: '#090D1A',
  },
  tableCell: {
    color: '#E2E8F0',
    fontSize: 12,
    paddingHorizontal: 12,
    width: 120,
  },
  tableCellHeader: {
    color: '#94A3B8',
    fontWeight: '700',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  tableCellPrimary: {
    color: '#38BDF8',
    fontWeight: '700',
  },
  notesBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  noteText: {
    color: '#BAE6FD',
    fontSize: 12,
    lineHeight: 17,
  },
});
