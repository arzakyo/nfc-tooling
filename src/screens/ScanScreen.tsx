import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { nfcService } from '../services/nfc/nfcService';
import { ScannedCard } from '../services/nfc/nfcTypes';
import { saveScanToHistory } from '../services/storageService';
import { CardInspectorView } from '../components/CardInspectorView';
import { DownloadAppBanner } from '../components/DownloadAppBanner';
import { useBackHandler } from '../hooks/useBackHandler';
import { useTheme } from '../theme/ThemeContext';
import { useI18n } from '../i18n/I18nContext';

export const ScanScreen: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [currentCard, setCurrentCard] = useState<ScannedCard | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  const { colors } = useTheme();
  const { t } = useI18n();

  useEffect(() => {
    nfcService.isSupported().then(supported => {
      setIsSupported(supported);
    });

    return () => {
      nfcService.stopScan();
    };
  }, []);

  // Universal back handler (dismiss card inspection or cancel scan)
  useBackHandler({
    enabled: Boolean(currentCard || scanning),
    onBack: () => {
      if (currentCard) {
        setCurrentCard(null);
      } else if (scanning) {
        handleStopScan();
      }
    },
    historyKey: 'scan-detail',
  });

  const handleStartScan = async () => {
    setErrorMsg(null);
    setScanning(true);

    try {
      await nfcService.startScan(
        async (card: ScannedCard) => {
          setCurrentCard(card);
          setScanning(false);
          await saveScanToHistory(card);
        },
        (err: string) => {
          setErrorMsg(err);
          setScanning(false);
        }
      );
    } catch (e: any) {
      setErrorMsg(e?.message || t.scan.scanErrorTitle);
      setScanning(false);
    }
  };

  const handleStopScan = async () => {
    await nfcService.stopScan();
    setScanning(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {currentCard ? (
        <View style={styles.cardContainer}>
          <View style={styles.topActions}>
            <TouchableOpacity
              style={[styles.rescanBtn, { backgroundColor: colors.primary }]}
              onPress={() => {
                setCurrentCard(null);
                handleStartScan();
              }}
            >
              <Ionicons name="scan-outline" size={16} color="#FFFFFF" />
              <Text style={styles.rescanText}>{t.scan.startScan}</Text>
            </TouchableOpacity>
          </View>
          <CardInspectorView card={currentCard} />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollWrapper}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Web Download App Banner */}
          <DownloadAppBanner />

          <View style={styles.idleContainer}>
            <View
              style={[
                styles.radarCircle,
                { backgroundColor: colors.surfaceBg, borderColor: colors.borderColor },
                scanning && { borderColor: colors.primary, backgroundColor: colors.primaryLight },
              ]}
            >
              <Ionicons
                name={scanning ? 'radio' : 'radio-outline'}
                size={64}
                color={scanning ? colors.primary : colors.textMuted}
              />
            </View>

            <Text style={[styles.headline, { color: colors.textPrimary }]}>
              {scanning ? t.scan.scanningTitle : t.scan.readyTitle}
            </Text>

            <Text style={[styles.subheadline, { color: colors.textSecondary }]}>
              {scanning ? t.scan.scanningSubtitle : t.scan.readySubtitle}
            </Text>

            {errorMsg && (
              <View style={[styles.errorBox, { borderColor: colors.error, backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                <Ionicons name="alert-circle-outline" size={18} color={colors.error} />
                <Text style={[styles.errorText, { color: colors.error }]}>{errorMsg}</Text>
              </View>
            )}

            {scanning ? (
              <TouchableOpacity
                style={[styles.cancelBtn, { backgroundColor: colors.surfaceBg, borderColor: colors.error }]}
                onPress={handleStopScan}
              >
                <ActivityIndicator color={colors.error} style={{ marginRight: 8 }} />
                <Text style={[styles.cancelText, { color: colors.error }]}>{t.scan.cancelScan}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.scanBtn,
                  { backgroundColor: colors.primary },
                  isSupported === false && styles.disabledBtn,
                ]}
                onPress={handleStartScan}
              >
                <Ionicons name="scan" size={20} color="#FFFFFF" />
                <Text style={styles.scanBtnText}>{t.scan.startScan}</Text>
              </TouchableOpacity>
            )}

            {isSupported === false && (
              <Text style={[styles.unsupportedText, { color: colors.error }]}>
                {t.scan.nfcUnsupportedSubtitle}
              </Text>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 860,
    width: '100%',
    alignSelf: 'center',
  },
  scrollWrapper: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  cardContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    width: '100%',
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  rescanBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rescanText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  idleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    minHeight: 380,
  },
  radarCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
  },
  headline: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subheadline: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  scanBtn: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    elevation: 3,
  },
  disabledBtn: {
    backgroundColor: '#94A3B8',
  },
  scanBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelText: {
    fontWeight: '600',
    fontSize: 14,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    fontSize: 12,
    flex: 1,
  },
  unsupportedText: {
    fontSize: 12,
    marginTop: 14,
    textAlign: 'center',
  },
});
