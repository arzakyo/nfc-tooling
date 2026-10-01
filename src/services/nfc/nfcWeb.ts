import { ScannedCard, NfcScanResult, CardType } from './nfcTypes';
import { parseNdefRecord } from '../parsers/ndefParser';

export async function isWebNfcSupported(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  return 'NDEFReader' in window;
}

export async function scanWebNfc(
  onCardDetected: (card: ScannedCard) => void,
  onError: (err: string) => void
): Promise<{ stop: () => void }> {
  if (typeof window === 'undefined' || !('NDEFReader' in window)) {
    onError('Web NFC is not supported in this browser. Please use Chrome on Android or download the native mobile app.');
    return { stop: () => {} };
  }

  const abortController = new AbortController();

  try {
    const NDEFReaderClass = (window as any).NDEFReader;
    const ndef = new NDEFReaderClass();

    await ndef.scan({ signal: abortController.signal });

    ndef.onreading = (event: any) => {
      const serialNumber: string = event.serialNumber || 'Unknown';
      const cleanUid = serialNumber.replace(/:/g, '').toUpperCase();
      const formattedUid = serialNumber.includes(':') 
        ? serialNumber.toUpperCase() 
        : cleanUid.match(/.{1,2}/g)?.join(':').toUpperCase() || serialNumber;

      const isRandomUid = formattedUid.startsWith('08:') || formattedUid.startsWith('08');

      let cardType: CardType = 'NTAG21x (Type 2)';
      if (isRandomUid) {
        cardType = 'DESFire EV3';
      }

      const records = event.message?.records || [];
      const parsedRecords = records.map((rec: any) => {
        let payloadBytes: number[] = [];
        if (rec.data) {
          const buffer = rec.data.buffer || rec.data;
          payloadBytes = Array.from(new Uint8Array(buffer));
        }
        return parseNdefRecord({
          type: Array.from(new TextEncoder().encode(rec.recordType || '')),
          payload: payloadBytes
        });
      });

      const card: ScannedCard = {
        id: `web-${Date.now()}`,
        uid: formattedUid,
        isRandomUid,
        cardType,
        techList: ['NfcA', 'Ndef', isRandomUid ? 'IsoDep' : 'NfcA'],
        ndefRecords: parsedRecords,
        scannedAt: new Date().toISOString()
      };

      onCardDetected(card);
    };

    ndef.onreadingerror = () => {
      onError('Error reading NFC tag. Try holding the card firmly against your phone.');
    };

    return {
      stop: () => {
        try {
          abortController.abort();
        } catch (e) {
          // Ignore
        }
      }
    };
  } catch (err: any) {
    const errorMsg = err?.message || 'Failed to start Web NFC scanner.';
    onError(errorMsg);
    return { stop: () => {} };
  }
}
