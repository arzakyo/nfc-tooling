import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScannedCard } from '../services/nfc/nfcTypes';
import { HexViewer } from './HexViewer';
import { useTheme } from '../theme/ThemeContext';
import { useI18n } from '../i18n/I18nContext';

interface CardInspectorViewProps {
  card: ScannedCard;
}

export const CardInspectorView: React.FC<CardInspectorViewProps> = ({ card }) => {
  const { colors } = useTheme();
  const { t } = useI18n();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Badge */}
      <View style={[styles.headerCard, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
        <View style={styles.typeRow}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="card-outline" size={24} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardType, { color: colors.textPrimary }]}>{card.cardType}</Text>
            {card.manufacturer && (
              <Text style={[styles.cardManufacturer, { color: colors.primary }]}>{card.manufacturer}</Text>
            )}
            <Text style={[styles.scanDate, { color: colors.textMuted }]}>
              {t.inspector.scannedAt.replace('{{time}}', new Date(card.scannedAt).toLocaleTimeString())}
            </Text>
          </View>
        </View>

        {/* UID Display */}
        <View style={[styles.uidBox, { backgroundColor: colors.surfaceBg, borderColor: colors.borderColor }]}>
          <Text style={[styles.uidLabel, { color: colors.textSecondary }]}>{t.inspector.serialNumber}</Text>
          <Text style={[styles.uidValue, { color: colors.primary }]}>{card.uid}</Text>
          {card.isRandomUid && (
            <View style={styles.randomUidBadge}>
              <Ionicons name="shield-checkmark" size={12} color={colors.success} />
              <Text style={[styles.randomUidText, { color: colors.success }]}>
                {t.inspector.randomUidTitle}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* E-Money Section (If Detected) */}
      {card.emoney && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="wallet-outline" size={18} color={colors.success} />
            <Text style={[styles.sectionTitle, { color: colors.success }]}>
              {t.inspector.emoneyDetected}
            </Text>
          </View>
          <View style={[styles.emoneyCard, { backgroundColor: colors.surfaceBg, borderColor: colors.success }]}>
            <Text style={[styles.bankName, { color: colors.textPrimary }]}>{card.emoney.bank}</Text>
            {card.emoney.cardNumber && (
              <View style={styles.emoneyRow}>
                <Text style={[styles.emoneyField, { color: colors.textSecondary }]}>{t.inspector.cardNumber}</Text>
                <Text style={[styles.emoneyValue, { color: colors.textPrimary }]}>{card.emoney.cardNumber}</Text>
              </View>
            )}
            {card.emoney.balance !== undefined && (
              <View style={styles.emoneyRow}>
                <Text style={[styles.emoneyField, { color: colors.textSecondary }]}>{t.inspector.balance}</Text>
                <Text style={[styles.emoneyBalance, { color: colors.warning }]}>
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
          <Ionicons name="hardware-chip-outline" size={18} color={colors.textMuted} />
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t.inspector.techSpecifications}</Text>
        </View>
        <View style={[styles.paramGrid, { backgroundColor: colors.cardBg, borderColor: colors.borderColor, borderWidth: 1 }]}>
          {card.memorySize && (
            <View style={styles.paramItem}>
              <Text style={[styles.paramLabel, { color: colors.textSecondary }]}>Memory Size</Text>
              <Text style={[styles.paramVal, { color: colors.primary }]}>{card.memorySize}</Text>
            </View>
          )}
          {card.sak !== undefined && (
            <View style={styles.paramItem}>
              <Text style={[styles.paramLabel, { color: colors.textSecondary }]}>{t.inspector.sak}</Text>
              <Text style={[styles.paramVal, { color: colors.textPrimary }]}>
                0x{card.sak.toString(16).toUpperCase().padStart(2, '0')}
              </Text>
            </View>
          )}
          {card.atqa && (
            <View style={styles.paramItem}>
              <Text style={[styles.paramLabel, { color: colors.textSecondary }]}>{t.inspector.atqa}</Text>
              <Text style={[styles.paramVal, { color: colors.textPrimary }]}>{card.atqa}</Text>
            </View>
          )}
          {card.ats && (
            <View style={styles.paramItem}>
              <Text style={[styles.paramLabel, { color: colors.textSecondary }]}>{t.inspector.historicalBytes}</Text>
              <Text style={[styles.paramVal, { color: colors.textPrimary }]}>{card.ats}</Text>
            </View>
          )}
          <View style={styles.paramItem}>
            <Text style={[styles.paramLabel, { color: colors.textSecondary }]}>{t.inspector.rfTechnology}</Text>
            <Text style={[styles.paramVal, { color: colors.textPrimary }]}>
              {card.techList
                .map(item => item.replace('android.nfc.tech.', ''))
                .join(', ')}
            </Text>
          </View>
        </View>
      </View>

      {/* NDEF Records Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="document-text-outline" size={18} color={colors.textMuted} />
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {t.inspector.ndefSection} ({card.ndefRecords ? card.ndefRecords.length : 0})
          </Text>
        </View>

        {!card.ndefRecords || card.ndefRecords.length === 0 ? (
          <View style={[styles.emptyNdef, { backgroundColor: colors.cardBg, borderColor: colors.borderColor, borderWidth: 1 }]}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No NDEF records found on this card.</Text>
            <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
              Smart cards (e-Money, DESFire) store data in proprietary applet files instead of NDEF.
            </Text>
          </View>
        ) : (
          card.ndefRecords.map((rec, idx) => (
            <View
              key={idx}
              style={[
                styles.ndefCard,
                { backgroundColor: colors.cardBg, borderColor: colors.borderColor },
              ]}
            >
              <View style={styles.ndefHeader}>
                <Text style={[styles.ndefType, { color: colors.primary }]}>
                  {t.inspector.ndefRawRecord.replace('{{index}}', String(idx + 1)).replace('{{type}}', rec.type)}
                </Text>
                {rec.encoding && (
                  <Text style={[styles.ndefBadge, { backgroundColor: colors.surfaceBg, color: colors.textSecondary }]}>
                    {rec.encoding}
                  </Text>
                )}
              </View>
              <Text style={[styles.ndefPayload, { color: colors.textPrimary }]}>{rec.payload}</Text>
              <HexViewer label={t.inspector.rawPayloadHex} hex={rec.rawHex} />
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
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardType: {
    fontSize: 18,
    fontWeight: '700',
  },
  cardManufacturer: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 1,
  },
  scanDate: {
    fontSize: 12,
    marginTop: 2,
  },
  uidBox: {
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
  },
  uidLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  uidValue: {
    fontFamily: 'monospace',
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
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emoneyCard: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  bankName: {
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
    fontSize: 13,
  },
  emoneyValue: {
    fontWeight: '600',
    fontSize: 13,
  },
  emoneyBalance: {
    fontWeight: '700',
    fontSize: 16,
  },
  paramGrid: {
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  paramItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paramLabel: {
    fontSize: 13,
  },
  paramVal: {
    fontWeight: '600',
    fontSize: 13,
  },
  emptyNdef: {
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  ndefCard: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  ndefHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  ndefType: {
    fontWeight: '700',
    fontSize: 13,
  },
  ndefBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 10,
  },
  ndefPayload: {
    fontSize: 14,
    marginBottom: 8,
  },
});
