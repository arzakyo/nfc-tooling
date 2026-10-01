import { ScannedCard } from './nfcTypes';
import { isWebNfcSupported, scanWebNfc } from './nfcWeb';

export interface NfcController {
  isSupported: () => Promise<boolean>;
  isNative: boolean;
  startScan: (onCard: (card: ScannedCard) => void, onError: (err: string) => void) => Promise<void>;
  stopScan: () => Promise<void>;
}

let activeStopper: (() => void) | null = null;

export const nfcService: NfcController = {
  isNative: false,

  isSupported: async () => {
    return await isWebNfcSupported();
  },

  startScan: async (onCard, onError) => {
    if (activeStopper) {
      activeStopper();
      activeStopper = null;
    }
    const session = await scanWebNfc(onCard, onError);
    activeStopper = session.stop;
  },

  stopScan: async () => {
    if (activeStopper) {
      activeStopper();
      activeStopper = null;
    }
  }
};
