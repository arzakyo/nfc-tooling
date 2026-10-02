import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FAQ_DATA_EN, FAQ_DATA_ID, FaqItem } from '../data/faqData';
import { useTheme } from '../theme/ThemeContext';
import { useI18n } from '../i18n/I18nContext';

interface FaqScreenProps {
  onOpenPocketBookSection: (sectionId: string) => void;
}

export const FaqScreen: React.FC<FaqScreenProps> = ({ onOpenPocketBookSection }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>('faq-how-app-works');

  const { colors } = useTheme();
  const { language, t } = useI18n();

  const faqData: FaqItem[] = language === 'id' ? FAQ_DATA_ID : FAQ_DATA_EN;

  const categories = [
    { key: 'All', label: t.faq.categoryAll },
    { key: 'General', label: t.faq.categoryGeneral },
    { key: 'Security & Cloning', label: t.faq.categorySecurity },
    { key: 'E-Money & Banking', label: t.faq.categoryEmoney },
    { key: 'Web vs Native', label: t.faq.categoryWebNative },
  ];

  const filteredFaqs = selectedCategory === 'All'
    ? faqData
    : faqData.filter(item => item.category === selectedCategory);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.catScroll, { backgroundColor: colors.navBg, borderBottomColor: colors.borderColor }]}
        contentContainerStyle={styles.catScrollContent}
      >
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.key;
          return (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.catPill,
                { backgroundColor: colors.surfaceBg, borderColor: colors.borderColor },
                isSelected && { backgroundColor: colors.primary, borderColor: colors.primary },
              ]}
              onPress={() => setSelectedCategory(cat.key)}
            >
              <Text
                style={[
                  styles.catText,
                  { color: colors.textSecondary },
                  isSelected && { color: '#FFFFFF', fontWeight: '700' },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* FAQ Accordion List */}
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{t.faq.title}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {t.faq.subtitle}
          </Text>
        </View>

        {filteredFaqs.map((faq) => {
          const isExpanded = expandedId === faq.id;
          return (
            <View
              key={faq.id}
              style={[
                styles.faqCard,
                { backgroundColor: colors.cardBg, borderColor: colors.borderColor },
              ]}
            >
              <TouchableOpacity
                style={styles.faqQuestionRow}
                onPress={() => toggleExpand(faq.id)}
                activeOpacity={0.7}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.categoryBadge, { color: colors.primary }]}>{faq.category}</Text>
                  <Text style={[styles.questionText, { color: colors.textPrimary }]}>{faq.question}</Text>
                </View>
                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.textMuted}
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>

              {/* Short Answer Always Visible */}
              <View style={[styles.shortAnswerBox, { backgroundColor: colors.surfaceBg }]}>
                <Ionicons name="bulb-outline" size={16} color={colors.warning} />
                <Text style={[styles.shortAnswerText, { color: colors.textPrimary }]}>{faq.shortAnswer}</Text>
              </View>

              {/* Expanded Detailed Content */}
              {isExpanded && (
                <View style={[styles.expandedContent, { borderTopColor: colors.borderColor }]}>
                  <Text style={[styles.detailedAnswer, { color: colors.textSecondary }]}>{faq.detailedAnswer}</Text>

                  {/* Deep Dive Action Link */}
                  <TouchableOpacity
                    style={[
                      styles.deepDiveLink,
                      { backgroundColor: colors.primaryLight, borderColor: colors.primary },
                    ]}
                    onPress={() => onOpenPocketBookSection(faq.pocketBookSectionId)}
                  >
                    <Ionicons name="book-outline" size={16} color={colors.primary} />
                    <Text style={[styles.deepDiveText, { color: colors.primary }]}>
                      {t.faq.readPocketBookRef}: {faq.pocketBookSectionTitle} ➔
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  catScroll: {
    flexGrow: 0,
    flexShrink: 0,
    borderBottomWidth: 1,
  },
  catScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: Platform.OS === 'web' ? 'wrap' : 'nowrap',
  },
  catPill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  catText: {
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
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  faqCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
  },
  faqQuestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  questionText: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  shortAnswerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  shortAnswerText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    lineHeight: 18,
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  detailedAnswer: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  deepDiveLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  deepDiveText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
