import NfcManager, { NfcTech, TagEvent } from 'react-native-nfc-manager';
import * as Haptics from 'expo-haptics';
import { ScannedCard, CardType } from './nfcTypes';
import { parseNdefRecord } from '../parsers/ndefParser';
import { tryParseEmoney } from '../parsers/emoneyParser';

export async function initNativeNfc(): Promise<boolean> {
  try {
    const isSupported = await NfcManager.isSupported();
    if (isSupported) {
      await NfcManager.start();
      return true;
    }
    return false;
  } catch (err) {
    console.warn('Failed to init Native NFC', err);
    return false;
  }
}

export async function scanNativeCard(): Promise<ScannedCard | null> {
  try {
    // Request IsoDep and NfcA for smart cards and standard tags
    await NfcManager.requestTechnology([NfcTech.IsoDep, NfcTech.NfcA, NfcTech.Ndef]);

    const tag: TagEvent | null = await NfcManager.getTag();
    if (!tag) {
      return null;
    }

    // Trigger haptic vibration on success
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      // Ignore if haptics unsupported
    }

    const rawId = tag.id || '';
    const formattedUid = rawId.match(/.{1,2}/g)?.join(':').toUpperCase() || rawId.toUpperCase();
    const isRandomUid = formattedUid.startsWith('08:') || (tag.id?.length === 8 && tag.id.startsWith('08'));

    // Detect SAK, ATQA, ATS
    const sak = (tag as any).sak;
    const atqa = (tag as any).atqa;
    const ats = (tag as any).historicalBytes;

    // Detect Card Type
    let cardType: CardType = 'Unknown NFC Tag';
    const techList = tag.techTypes || [];

    if (techList.includes('android.nfc.tech.IsoDep') || techList.includes('IsoDep')) {
      if (isRandomUid || sak === 0x20 || (tag as any).sak === 32) {
        cardType = 'DESFire EV3';
      } else {
        cardType = 'ISO-DEP Smart Card';
      }
    } else if (techList.includes('android.nfc.tech.MifareClassic') || sak === 0x08) {
      cardType = 'Mifare Classic 1K/4K';
    } else if (techList.includes('android.nfc.tech.Ndef') || sak === 0x00) {
      cardType = 'NTAG21x (Type 2)';
    }

    // Parse NDEF records if present
    const ndefRecords = (tag.ndefMessage || []).map(parseNdefRecord);

    // Try probing Indonesian E-Money / Flazz via APDU
    let emoneyInfo = undefined;
    if (techList.includes('android.nfc.tech.IsoDep') || techList.includes('IsoDep')) {
      try {
        emoneyInfo = await tryParseEmoney({
          transceive: async (apdu: number[]) => {
            return await NfcManager.isoDepHandler.transceive(apdu);
          }
        });
      } catch (apduErr) {
        // Non e-money card or rejected APDU
      }
    }

    const scannedCard: ScannedCard = {
      id: `card-${Date.now()}`,
      uid: formattedUid,
      isRandomUid,
      cardType,
      techList,
      sak,
      atqa,
      ats,
      ndefRecords: ndefRecords.length > 0 ? ndefRecords : undefined,
      emoney: emoneyInfo,
      scannedAt: new Date().toISOString(),
      rawInfo: tag
    };

    return scannedCard;
  } catch (err) {
    console.warn('Native scan error:', err);
    throw err;
  } finally {
    try {
      await NfcManager.cancelTechnologyRequest();
    } catch (e) {
      // Ignore
    }
  }
}

export async function cancelNativeScan(): Promise<void> {
  try {
    await NfcManager.cancelTechnologyRequest();
  } catch (err) {
    // Ignore
  }
}
