import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScannedCard } from '../services/nfc/nfcTypes';
import { HexViewer } from './HexViewer';

interface CardInspectorViewProps {
  card: ScannedCard;
}

export const CardInspectorView: React.FC<CardInspectorViewProps> = ({ card }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Badge */}
      <View style={styles.headerCard}>
        <View style={styles.typeRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="card-outline" size={24} color="#38BDF8" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardType}>{card.cardType}</Text>
            {card.manufacturer && (
              <Text style={styles.cardManufacturer}>{card.manufacturer}</Text>
            )}
            <Text style={styles.scanDate}>Scanned: {new Date(card.scannedAt).toLocaleTimeString()}</Text>
          </View>
        </View>

        {/* UID Display */}
        <View style={styles.uidBox}>
          <Text style={styles.uidLabel}>Serial Number (UID)</Text>
          <Text style={styles.uidValue}>{card.uid}</Text>
          {card.isRandomUid && (
            <View style={styles.randomUidBadge}>
              <Ionicons name="shield-checkmark" size={12} color="#10B981" />
              <Text style={styles.randomUidText}>Random UID (Anti-Tracking Active)</Text>
            </View>
          )}
        </View>
      </View>

      {/* E-Money Section (If Detected) */}
      {card.emoney && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="wallet-outline" size={18} color="#10B981" />
            <Text style={[styles.sectionTitle, { color: '#10B981' }]}>Smart Card / E-Money Detected</Text>
          </View>
          <View style={styles.emoneyCard}>
            <Text style={styles.bankName}>{card.emoney.bank}</Text>
            {card.emoney.cardNumber && (
              <View style={styles.emoneyRow}>
                <Text style={styles.emoneyField}>Card Number (PAN):</Text>
                <Text style={styles.emoneyValue}>{card.emoney.cardNumber}</Text>
              </View>
            )}
            {card.emoney.balance !== undefined && (
              <View style={styles.emoneyRow}>
                <Text style={styles.emoneyField}>Saldo (Balance):</Text>
                <Text style={styles.emoneyBalance}>
                  Rp {card.emoney.balance.toLocaleString('id-ID')}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Hardware RF Parameters */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="hardware-chip-outline" size={18} color="#94A3B8" />
          <Text style={styles.sectionTitle}>RF Parameters & Protocols</Text>
        </View>
        <View style={styles.paramGrid}>
          {card.memorySize && (
            <View style={styles.paramItem}>
              <Text style={styles.paramLabel}>Memory Size</Text>
              <Text style={[styles.paramVal, { color: '#38BDF8' }]}>{card.memorySize}</Text>
            </View>
          )}
          {card.sak !== undefined && (
            <View style={styles.paramItem}>
              <Text style={styles.paramLabel}>SAK</Text>
              <Text style={styles.paramVal}>0x{card.sak.toString(16).toUpperCase().padStart(2, '0')}</Text>
            </View>
          )}
          {card.atqa && (
            <View style={styles.paramItem}>
              <Text style={styles.paramLabel}>ATQA</Text>
              <Text style={styles.paramVal}>{card.atqa}</Text>
            </View>
          )}
          {card.ats && (
            <View style={styles.paramItem}>
              <Text style={styles.paramLabel}>ATS (Historical Bytes)</Text>
              <Text style={styles.paramVal}>{card.ats}</Text>
            </View>
          )}
          <View style={styles.paramItem}>
            <Text style={styles.paramLabel}>Technologies</Text>
            <Text style={styles.paramVal}>
              {card.techList
                .map(t => t.replace('android.nfc.tech.', ''))
                .join(', ')}
            </Text>
          </View>
        </View>
      </View>

      {/* NDEF Records Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="document-text-outline" size={18} color="#94A3B8" />
          <Text style={styles.sectionTitle}>
            NDEF Records ({card.ndefRecords ? card.ndefRecords.length : 0})
          </Text>
        </View>

        {!card.ndefRecords || card.ndefRecords.length === 0 ? (
          <View style={styles.emptyNdef}>
            <Text style={styles.emptyText}>No NDEF records found on this card.</Text>
            <Text style={styles.emptySubtext}>
              Smart cards (e-Money, DESFire) store data in proprietary applet files instead of NDEF.
            </Text>
          </View>
        ) : (
          card.ndefRecords.map((rec, idx) => (
            <View key={idx} style={styles.ndefCard}>
              <View style={styles.ndefHeader}>
                <Text style={styles.ndefType}>Record #{idx + 1}: {rec.type}</Text>
                {rec.encoding && <Text style={styles.ndefBadge}>{rec.encoding}</Text>}
              </View>
              <Text style={styles.ndefPayload}>{rec.payload}</Text>
              <HexViewer label="Payload Hex Dump" hex={rec.rawHex} />
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 30,
  },
  headerCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardType: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
  cardManufacturer: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 1,
  },
  scanDate: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
  },
  uidBox: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  uidLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  uidValue: {
    fontFamily: 'monospace',
    color: '#38BDF8',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginVertical: 4,
  },
  randomUidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  randomUidText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '600',
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emoneyCard: {
    backgroundColor: '#064E3B',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#059669',
  },
  bankName: {
    color: '#A7F3D0',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  emoneyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  emoneyField: {
    color: '#6EE7B7',
    fontSize: 13,
  },
  emoneyValue: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  emoneyBalance: {
    color: '#FDE047',
    fontWeight: '700',
    fontSize: 16,
  },
  paramGrid: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  paramItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paramLabel: {
    color: '#94A3B8',
    fontSize: 13,
  },
  paramVal: {
    color: '#F8FAFC',
    fontWeight: '600',
    fontSize: 13,
  },
  emptyNdef: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  emptySubtext: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  ndefCard: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  ndefHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  ndefType: {
    color: '#38BDF8',
    fontWeight: '700',
    fontSize: 13,
  },
  ndefBadge: {
    backgroundColor: '#0F172A',
    color: '#94A3B8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 10,
  },
  ndefPayload: {
    color: '#F8FAFC',
    fontSize: 14,
    marginBottom: 8,
  },
});
