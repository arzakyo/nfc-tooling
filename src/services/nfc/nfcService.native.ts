import { ScannedCard } from './nfcTypes';
import { initNativeNfc, scanNativeCard, cancelNativeScan } from './nfcNative';

export interface NfcController {
  isSupported: () => Promise<boolean>;
  isNative: boolean;
  startScan: (onCard: (card: ScannedCard) => void, onError: (err: string) => void) => Promise<void>;
  stopScan: () => Promise<void>;
}

export const nfcService: NfcController = {
  isNative: true,

  isSupported: async () => {
    return await initNativeNfc();
  },

  startScan: async (onCard, onError) => {
    try {
      const card = await scanNativeCard();
      if (card) {
        onCard(card);
      }
    } catch (err: any) {
      if (err?.message !== 'cancelled') {
        onError(err?.message || 'NFC scanning interrupted.');
      }
    }
  },

  stopScan: async () => {
    await cancelNativeScan();
  }
};
