import { EmoneyDetail } from '../nfc/nfcTypes';

export interface ApduTransceiver {
  transceive: (bytes: number[]) => Promise<number[]>;
}

// Convert hex string (e.g. "00 A4 04 00") to number array
export function hexToBytes(hex: string): number[] {
  const clean = hex.replace(/\s+/g, '');
  const bytes: number[] = [];
  for (let i = 0; i < clean.length; i += 2) {
    bytes.push(parseInt(clean.substr(i, 2), 16));
  }
  return bytes;
}

// Convert number array to hex string
export function bytesToHex(bytes: number[]): string {
  return bytes.map(b => (b & 0xff).toString(16).padStart(2, '0').toUpperCase()).join(' ');
}

// APDUs for Indonesian E-Money
const MANDIRI_AID = hexToBytes('00 A4 04 00 08 A0 00 00 00 03 00 00 00');
const MANDIRI_READ_CARD_INFO = hexToBytes('00 B2 01 0C 1D');
const MANDIRI_READ_BALANCE = hexToBytes('00 B0 00 00 04');

const FLAZZ_AID = hexToBytes('00 A4 04 00 07 A0 00 00 00 03 10 10');

/**
 * Attempts to probe the card via APDU commands to detect Mandiri e-Money or BCA Flazz
 */
export async function tryParseEmoney(transceiver: ApduTransceiver): Promise<EmoneyDetail | undefined> {
  try {
    // 1. Try Mandiri e-Money
    const mandiriSelectResp = await transceiver.transceive(MANDIRI_AID);
    const mandiriStatus = bytesToHex(mandiriSelectResp.slice(-2));

    if (mandiriStatus === '90 00') {
      let cardNumber: string | undefined;
      let balance: number | undefined;

      // Try reading card number
      try {
        const infoResp = await transceiver.transceive(MANDIRI_READ_CARD_INFO);
        if (bytesToHex(infoResp.slice(-2)) === '90 00') {
          // Parse BCD-encoded card number
          const panBytes = infoResp.slice(0, 8);
          cardNumber = panBytes.map(b => (b & 0xff).toString(16).padStart(2, '0')).join('');
        }
      } catch (e) {
        // Silently skip if sub-command unsupported
      }

      // Try reading balance
      try {
        const balResp = await transceiver.transceive(MANDIRI_READ_BALANCE);
        if (balResp.length >= 4) {
          // 4-byte big-endian integer
          balance = (balResp[0] << 24) | (balResp[1] << 16) | (balResp[2] << 8) | balResp[3];
        }
      } catch (e) {
        // Silently skip
      }

      return {
        bank: 'Mandiri e-Money',
        cardNumber: cardNumber ? formatPan(cardNumber) : 'Mandiri Smart Card Detected',
        balance: balance !== undefined && balance >= 0 && balance < 20000000 ? balance : undefined
      };
    }

    // 2. Try BCA Flazz
    const flazzSelectResp = await transceiver.transceive(FLAZZ_AID);
    const flazzStatus = bytesToHex(flazzSelectResp.slice(-2));

    if (flazzStatus === '90 00' || flazzSelectResp.length > 2) {
      return {
        bank: 'BCA Flazz',
        cardNumber: 'BCA Flazz Smart Card Detected'
      };
    }
  } catch (err) {
    // Card is not an e-money card or rejected APDU selection
    return undefined;
  }

  return undefined;
}

function formatPan(pan: string): string {
  return pan.replace(/(.{4})/g, '$1 ').trim();
}
