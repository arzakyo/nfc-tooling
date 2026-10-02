import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { nfcService } from '../services/nfc/nfcService';
import { ScannedCard } from '../services/nfc/nfcTypes';
import { saveScanToHistory } from '../services/storageService';
import { CardInspectorView } from '../components/CardInspectorView';
import { DownloadAppBanner } from '../components/DownloadAppBanner';
import { useBackHandler } from '../hooks/useBackHandler';

export const ScanScreen: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [currentCard, setCurrentCard] = useState<ScannedCard | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

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
      setErrorMsg(e?.message || 'Failed to scan');
      setScanning(false);
    }
  };

  const handleStopScan = async () => {
    await nfcService.stopScan();
    setScanning(false);
  };

  return (
    <View style={styles.container}>
      {currentCard ? (
        <View style={styles.cardContainer}>
          <View style={styles.topActions}>
            <TouchableOpacity
              style={styles.rescanBtn}
              onPress={() => {
                setCurrentCard(null);
                handleStartScan();
              }}
            >
              <Ionicons name="scan-outline" size={16} color="#0F172A" />
              <Text style={styles.rescanText}>Scan Another Card</Text>
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
            <View style={[styles.radarCircle, scanning && styles.radarActive]}>
              <Ionicons
                name={scanning ? 'radio' : 'radio-outline'}
                size={64}
                color={scanning ? '#38BDF8' : '#64748B'}
              />
            </View>

            <Text style={styles.headline}>
              {scanning ? 'Hold Card Near NFC Antenna' : 'Ready to Inspect NFC Tag'}
            </Text>

            <Text style={styles.subheadline}>
              {scanning
                ? 'Hold your card firmly against the back of your phone...'
                : 'Works with NTAG stickers, Mifare Classic, DESFire EV3, and e-Money smart cards.'}
            </Text>

            {errorMsg && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={18} color="#F87171" />
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            )}

            {scanning ? (
              <TouchableOpacity style={styles.cancelBtn} onPress={handleStopScan}>
                <ActivityIndicator color="#F87171" style={{ marginRight: 8 }} />
                <Text style={styles.cancelText}>Cancel Scanning</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.scanBtn, isSupported === false && styles.disabledBtn]}
                onPress={handleStartScan}
              >
                <Ionicons name="scan" size={20} color="#0F172A" />
                <Text style={styles.scanBtnText}>Start NFC Scan</Text>
              </TouchableOpacity>
            )}

            {isSupported === false && (
              <Text style={styles.unsupportedText}>
                NFC is not supported or not enabled on this device/browser.
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
    backgroundColor: '#38BDF8',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rescanText: {
    color: '#0F172A',
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
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#334155',
  },
  radarActive: {
    borderColor: '#38BDF8',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  headline: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subheadline: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  scanBtn: {
    backgroundColor: '#38BDF8',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    elevation: 3,
  },
  disabledBtn: {
    backgroundColor: '#475569',
  },
  scanBtnText: {
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 16,
  },
  cancelBtn: {
    backgroundColor: '#1E293B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F87171',
  },
  cancelText: {
    color: '#F87171',
    fontWeight: '600',
    fontSize: 14,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: '#EF4444',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    color: '#F87171',
    fontSize: 12,
    flex: 1,
  },
  unsupportedText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 14,
    textAlign: 'center',
  },
});
