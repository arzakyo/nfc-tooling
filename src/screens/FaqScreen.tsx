import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FAQ_DATA, FaqItem } from '../data/faqData';

interface FaqScreenProps {
  onOpenPocketBookSection: (sectionId: string) => void;
}

export const FaqScreen: React.FC<FaqScreenProps> = ({ onOpenPocketBookSection }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(FAQ_DATA[0].id);

  const categories = ['All', 'General', 'Security & Cloning', 'E-Money & Banking', 'Web vs Native'];

  const filteredFaqs = selectedCategory === 'All'
    ? FAQ_DATA
    : FAQ_DATA.filter(item => item.category === selectedCategory);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <View style={styles.container}>
      {/* Category Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={styles.catScrollContent}>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.catPill, isSelected && styles.catPillActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.catText, isSelected && styles.catTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* FAQ Accordion List */}
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Frequently Asked Questions</Text>
          <Text style={styles.subtitle}>
            Tap any question for quick answers and deep references to the Pocket Book.
          </Text>
        </View>

        {filteredFaqs.map((faq) => {
          const isExpanded = expandedId === faq.id;
          return (
            <View key={faq.id} style={styles.faqCard}>
              <TouchableOpacity
                style={styles.faqQuestionRow}
                onPress={() => toggleExpand(faq.id)}
                activeOpacity={0.7}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.categoryBadge}>{faq.category}</Text>
                  <Text style={styles.questionText}>{faq.question}</Text>
                </View>
                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#94A3B8"
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>

              {/* Short Answer Always Visible */}
              <View style={styles.shortAnswerBox}>
                <Ionicons name="bulb-outline" size={16} color="#FBBF24" />
                <Text style={styles.shortAnswerText}>{faq.shortAnswer}</Text>
              </View>

              {/* Expanded Detailed Content */}
              {isExpanded && (
                <View style={styles.expandedContent}>
                  <Text style={styles.detailedAnswer}>{faq.detailedAnswer}</Text>

                  {/* Deep Dive Action Link */}
                  <TouchableOpacity
                    style={styles.deepDiveLink}
                    onPress={() => onOpenPocketBookSection(faq.pocketBookSectionId)}
                  >
                    <Ionicons name="book-outline" size={16} color="#38BDF8" />
                    <Text style={styles.deepDiveText}>
                      Deep dive: {faq.pocketBookSectionTitle} ➔
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
    backgroundColor: '#020617',
  },
  catScroll: {
    maxHeight: 52,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  catScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  catPill: {
    backgroundColor: '#1E293B',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  catPillActive: {
    backgroundColor: '#38BDF8',
    borderColor: '#38BDF8',
  },
  catText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  catTextActive: {
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
  header: {
    marginBottom: 16,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  faqCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  faqQuestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  questionText: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  shortAnswerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  shortAnswerText: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    lineHeight: 18,
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  detailedAnswer: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  deepDiveLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  deepDiveText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
  },
});
