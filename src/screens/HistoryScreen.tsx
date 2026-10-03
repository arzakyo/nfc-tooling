import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScannedCard } from '../services/nfc/nfcTypes';
import { getScanHistory, clearScanHistory } from '../services/storageService';
import { CardInspectorView } from '../components/CardInspectorView';
import { useBackHandler } from '../hooks/useBackHandler';
import { useTheme } from '../theme/ThemeContext';
import { useI18n } from '../i18n/I18nContext';

interface HistoryScreenProps {
  initialSelectedCardId?: string;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ initialSelectedCardId }) => {
  const [history, setHistory] = useState<ScannedCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<ScannedCard | null>(null);

  const { colors } = useTheme();
  const { t } = useI18n();

  const loadHistory = async () => {
    const list = await getScanHistory();
    setHistory(list);

    if (initialSelectedCardId) {
      const match = list.find((c) => c.id === initialSelectedCardId);
      if (match) setSelectedCard(match);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // Listen to hash / browser forward & back (Web only)
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const checkHash = () => {
      const hash = window.location?.hash || '';
      if (hash.startsWith('#history/')) {
        const id = hash.replace('#history/', '');
        const found = history.find((c) => c.id === id);
        if (found) setSelectedCard(found);
      } else if (hash === '#history') {
        setSelectedCard(null);
      }
    };

    window.addEventListener('popstate', checkHash);
    return () => window.removeEventListener('popstate', checkHash);
  }, [history]);

  // Universal back handler (Android hardware back)
  useBackHandler({
    enabled: Boolean(selectedCard),
    onBack: () => {
      setSelectedCard(null);
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.hash?.startsWith('#history/')) {
        window.history.pushState({ tab: 'history' }, '', '#history');
      }
    },
    historyKey: 'history-detail',
  });

  const handleClear = async () => {
    const performClear = async () => {
      await clearScanHistory();
      setHistory([]);
      setSelectedCard(null);
    };

    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.confirm) {
      if (window.confirm(t.history.clearConfirmMessage)) {
        await performClear();
      }
    } else {
      Alert.alert(
        t.history.clearConfirmTitle,
        t.history.clearConfirmMessage,
        [
          { text: t.history.clearConfirmCancel, style: 'cancel' },
          { text: t.history.clearConfirmDelete, style: 'destructive', onPress: performClear },
        ]
      );
    }
  };

  if (selectedCard) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.hash?.startsWith('#history/')) {
                window.history.back();
              } else {
                setSelectedCard(null);
              }
            }}
          >
            <Ionicons name="arrow-back" size={18} color={colors.primary} />
            <Text style={[styles.backBtnText, { color: colors.primary }]}>{t.history.backToHistory}</Text>
          </TouchableOpacity>
        </View>
        <CardInspectorView card={selectedCard} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{t.history.title}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {t.history.historyCount.replace('{{count}}', String(history.length))}
          </Text>
        </View>
        {history.length > 0 && (
          <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
            <Ionicons name="trash-outline" size={16} color={colors.error} />
            <Text style={[styles.clearBtnText, { color: colors.error }]}>{t.history.clearAll}</Text>
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="time-outline" size={48} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>{t.history.emptyTitle}</Text>
          <Text style={[styles.emptyDesc, { color: colors.textMuted }]}>
            {t.history.emptySubtitle}
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.cardItem,
                {
                  backgroundColor: colors.cardBg,
                  borderColor: colors.borderColor,
                },
              ]}
              onPress={() => {
                setSelectedCard(item);
                if (Platform.OS === 'web' && typeof window !== 'undefined') {
                  window.history.pushState({ tab: 'history', cardId: item.id }, '', `#history/${item.id}`);
                }
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.cardIcon, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="card-outline" size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.cardTopRow}>
                  <Text style={[styles.cardType, { color: colors.textPrimary }]}>{item.cardType}</Text>
                  <Text style={[styles.cardDate, { color: colors.textMuted }]}>
                    {new Date(item.scannedAt).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={[styles.cardUid, { color: colors.primary }]}>{item.uid}</Text>
                {item.emoney && (
                  <Text style={[styles.emoneySnippet, { color: colors.success }]}>
                    {item.emoney.bank} {item.emoney.balance !== undefined ? `• Rp ${item.emoney.balance.toLocaleString('id-ID')}` : ''}
                  </Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    maxWidth: 860,
    width: '100%',
    alignSelf: 'center',
  },
  topBar: {
    marginBottom: 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  backBtnText: {
    fontWeight: '700',
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
  emptyDesc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 6,
  },
  listContent: {
    paddingBottom: 24,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    gap: 12,
  },
  cardIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  cardType: {
    fontSize: 14,
    fontWeight: '700',
  },
  cardDate: {
    fontSize: 11,
  },
  cardUid: {
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: '600',
  },
  emoneySnippet: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});
