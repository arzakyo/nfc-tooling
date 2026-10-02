import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScannedCard } from '../services/nfc/nfcTypes';
import { getScanHistory, clearScanHistory } from '../services/storageService';
import { CardInspectorView } from '../components/CardInspectorView';
import { useBackHandler } from '../hooks/useBackHandler';

interface HistoryScreenProps {
  initialSelectedCardId?: string;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ initialSelectedCardId }) => {
  const [history, setHistory] = useState<ScannedCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<ScannedCard | null>(null);

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

  // Listen to hash / browser forward & back
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkHash = () => {
      const hash = window.location.hash;
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
      if (typeof window !== 'undefined' && window.location.hash.startsWith('#history/')) {
        window.history.pushState({ tab: 'history' }, '', '#history');
      }
    },
    historyKey: 'history-detail',
  });

  const handleClear = async () => {
    await clearScanHistory();
    setHistory([]);
    setSelectedCard(null);
  };

  if (selectedCard) {
    return (
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              if (typeof window !== 'undefined' && window.location.hash.startsWith('#history/')) {
                window.history.back();
              } else {
                setSelectedCard(null);
              }
            }}
          >
            <Ionicons name="arrow-back" size={18} color="#38BDF8" />
            <Text style={styles.backBtnText}>Back to History</Text>
          </TouchableOpacity>
        </View>
        <CardInspectorView card={selectedCard} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Scan History</Text>
          <Text style={styles.subtitle}>{history.length} cards saved on this device</Text>
        </View>
        {history.length > 0 && (
          <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
            <Ionicons name="trash-outline" size={16} color="#F87171" />
            <Text style={styles.clearBtnText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="time-outline" size={48} color="#475569" />
          <Text style={styles.emptyTitle}>No Scanned Cards Yet</Text>
          <Text style={styles.emptyDesc}>
            Cards you scan in the Inspector tab will be saved locally here for quick reference.
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.cardItem}
              onPress={() => {
                setSelectedCard(item);
                if (typeof window !== 'undefined') {
                  window.history.pushState({ tab: 'history', cardId: item.id }, '', `#history/${item.id}`);
                }
              }}
              activeOpacity={0.7}
            >
              <View style={styles.cardIcon}>
                <Ionicons name="card-outline" size={20} color="#38BDF8" />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.cardTopRow}>
                  <Text style={styles.cardType}>{item.cardType}</Text>
                  <Text style={styles.cardDate}>
                    {new Date(item.scannedAt).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.cardUid}>{item.uid}</Text>
                {item.emoney && (
                  <Text style={styles.emoneySnippet}>
                    {item.emoney.bank} {item.emoney.balance !== undefined ? `• Rp ${item.emoney.balance.toLocaleString('id-ID')}` : ''}
                  </Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={18} color="#64748B" />
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
    backgroundColor: '#020617',
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
    color: '#38BDF8',
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
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    color: '#94A3B8',
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
    color: '#F87171',
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
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
  emptyDesc: {
    color: '#64748B',
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
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
  },
  cardIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  cardType: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  cardDate: {
    color: '#64748B',
    fontSize: 11,
  },
  cardUid: {
    fontFamily: 'monospace',
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '600',
  },
  emoneySnippet: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});
