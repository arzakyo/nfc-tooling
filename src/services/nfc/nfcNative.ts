import NfcManager, { NfcTech, TagEvent } from 'react-native-nfc-manager';
import * as Haptics from 'expo-haptics';
import { ScannedCard, CardType } from './nfcTypes';
import { parseNdefRecord } from '../parsers/ndefParser';
import { tryParseEmoney } from '../parsers/emoneyParser';
import { tryProbeDesfireVersion, inferChipDetails } from '../parsers/chipIdentifier';

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
    const rawSak = (tag as any).sak;
    const sak = typeof rawSak === 'number' ? rawSak : undefined;
    
    // Format ATQA (usually 2 bytes, e.g. [0x04, 0x03] -> "0x0304" or raw hex)
    let atqa: string | undefined = undefined;
    const rawAtqa = (tag as any).atqa;
    if (Array.isArray(rawAtqa)) {
      atqa = '0x' + rawAtqa.map(b => (b & 0xff).toString(16).padStart(2, '0')).reverse().join('').toUpperCase();
    } else if (typeof rawAtqa === 'string') {
      atqa = rawAtqa.startsWith('0x') ? rawAtqa : `0x${rawAtqa.toUpperCase()}`;
    }

    // Format ATS / Historical Bytes
    let ats: string | undefined = undefined;
    const rawAts = (tag as any).historicalBytes || (tag as any).hiLayerResponse;
    if (Array.isArray(rawAts)) {
      ats = '0x' + rawAts.map(b => (b & 0xff).toString(16).padStart(2, '0').toUpperCase()).join('');
    } else if (typeof rawAts === 'string') {
      ats = rawAts.startsWith('0x') ? rawAts : `0x${rawAts.toUpperCase()}`;
    }

    // Detect Card Type, Manufacturer & Memory
    let cardType: CardType = 'Unknown NFC Tag';
    let manufacturer: string | undefined = undefined;
    let memorySize: string | undefined = undefined;

    const techList = tag.techTypes || [];
    const inferred = inferChipDetails(sak, atqa, formattedUid);
    manufacturer = inferred.manufacturer;
    memorySize = inferred.memorySize;

    if (techList.includes('android.nfc.tech.IsoDep') || techList.includes('IsoDep')) {
      if (isRandomUid || sak === 0x20 || rawSak === 32) {
        cardType = 'DESFire EV3';
      } else {
        cardType = 'ISO-DEP Smart Card';
      }
    } else if (techList.includes('android.nfc.tech.MifareClassic') || sak === 0x08) {
      cardType = 'Mifare Classic 1K/4K';
    } else if (techList.includes('android.nfc.tech.Ndef') || sak === 0x00) {
      cardType = 'NTAG21x (Type 2)';
    }

    // Try probing Indonesian E-Money / Flazz or DESFire deep hardware info via APDU
    let emoneyInfo = undefined;
    if (techList.includes('android.nfc.tech.IsoDep') || techList.includes('IsoDep')) {
      const isoTransceiver = {
        transceive: async (apdu: number[]) => {
          return await NfcManager.isoDepHandler.transceive(apdu);
        }
      };

      // 1. Probe E-Money
      try {
        emoneyInfo = await tryParseEmoney(isoTransceiver);
      } catch (apduErr) {
        // Non e-money card or rejected APDU
      }

      // 2. If not e-money or card is ISO-DEP / DESFire, probe DESFire GetVersion
      try {
        const desfireDetails = await tryProbeDesfireVersion(isoTransceiver);
        if (desfireDetails) {
          if (desfireDetails.manufacturer) manufacturer = desfireDetails.manufacturer;
          if (desfireDetails.memorySize) memorySize = desfireDetails.memorySize;
          if (desfireDetails.chipModel) {
            if (desfireDetails.chipModel.includes('EV3')) cardType = 'DESFire EV3';
            else if (desfireDetails.chipModel.includes('EV1') || desfireDetails.chipModel.includes('EV2')) cardType = 'DESFire EV1/EV2';
          }
        }
      } catch (desfireErr) {
        // Not a DESFire chip or commands disallowed
      }
    }

    // Parse NDEF records if present
    const ndefRecords = (tag.ndefMessage || []).map(parseNdefRecord);

    const scannedCard: ScannedCard = {
      id: `card-${Date.now()}`,
      uid: formattedUid,
      isRandomUid,
      cardType,
      techList,
      sak,
      atqa,
      ats,
      manufacturer,
      memorySize,
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
