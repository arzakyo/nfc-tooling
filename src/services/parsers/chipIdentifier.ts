import { ApduTransceiver } from './emoneyParser';

export interface ChipIdentification {
  manufacturer?: string;
  chipModel?: string;
  memorySize?: string;
  rawVersionBytes?: string;
}

/**
 * Probes a DESFire card using native DESFire 0x60 GetVersion command
 * Wrapped inside ISO 7816-4 APDU or sent directly via IsoDep transceive:
 * Command: [0x90, 0x60, 0x00, 0x00, 0x00] (DESFire wrapped APDU) or [0x60]
 *
 * DESFire GetVersion response flow (3 frames):
 * Frame 1 (Hardware info, 7 bytes + 0xAF):
 *   Byte 0: Vendor ID (0x04 = NXP)
 *   Byte 1: Hardware Type (0x01 = DESFire)
 *   Byte 2: Hardware Subtype (0x01 = D40/EV1, 0x02 = EV2, 0x03 = EV3, 0x04 = Light)
 *   Byte 3: Major Version
 *   Byte 4: Minor Version
 *   Byte 5: Storage size code (0x16 = 1KB, 0x18 = 2KB, 0x1A = 4KB, 0x1C = 8KB)
 *   Byte 6: Protocol (0x05 = ISO 14443-3/4)
 */
export async function tryProbeDesfireVersion(transceiver: ApduTransceiver): Promise<ChipIdentification | undefined> {
  try {
    // DESFire Native GetVersion wrapped in ISO 7816-4:
    // CLA=0x90, INS=0x60, P1=0x00, P2=0x00, Le=0x00
    const wrappedGetVersion = [0x90, 0x60, 0x00, 0x00, 0x00];
    let resp = await transceiver.transceive(wrappedGetVersion);

    // If card doesn't support wrapped APDU, try raw command 0x60
    if (!resp || resp.length < 7) {
      try {
        resp = await transceiver.transceive([0x60]);
      } catch (e) {
        // Continue
      }
    }

    if (!resp || resp.length < 7) {
      return undefined;
    }

    // Check if vendor is NXP (0x04)
    const vendorId = resp[0];
    const hwType = resp[1];
    const hwSubtype = resp[2];
    const storageByte = resp[5];

    let manufacturer = vendorId === 0x04 ? 'NXP Semiconductors' : undefined;

    let chipModel = 'Mifare DESFire';
    if (hwType === 0x01) {
      switch (hwSubtype) {
        case 0x01:
          chipModel = 'Mifare DESFire EV1';
          break;
        case 0x02:
          chipModel = 'Mifare DESFire EV2';
          break;
        case 0x03:
          chipModel = 'Mifare DESFire EV3';
          break;
        case 0x04:
          chipModel = 'Mifare DESFire Light';
          break;
        default:
          chipModel = `Mifare DESFire (Subtype 0x${hwSubtype.toString(16).toUpperCase()})`;
      }
    }

    let memorySize: string | undefined;
    switch (storageByte) {
      case 0x14:
        memorySize = '640 Bytes';
        break;
      case 0x16:
        memorySize = '1 kByte';
        break;
      case 0x18:
        memorySize = '2 kByte';
        break;
      case 0x1A:
        memorySize = '4 kByte';
        break;
      case 0x1C:
        memorySize = '8 kByte';
        break;
      case 0x20:
        memorySize = '16 kByte';
        break;
      case 0x22:
        memorySize = '32 kByte';
        break;
      default:
        if (storageByte) {
          const approx = 1 << Math.floor(storageByte / 2);
          memorySize = `${approx} Bytes`;
        }
    }

    if (memorySize && chipModel.startsWith('Mifare DESFire')) {
      chipModel = `${chipModel} ${memorySize.replace(' ', '')}`;
    }

    const rawHex = resp.map(b => (b & 0xff).toString(16).padStart(2, '0').toUpperCase()).join(' ');

    return {
      manufacturer,
      chipModel,
      memorySize,
      rawVersionBytes: rawHex
    };
  } catch (err) {
    return undefined;
  }
}

/**
 * Infer chip details and memory size from standard SAK, ATQA, and UID
 */
export function inferChipDetails(sak?: number, atqa?: string, uid?: string): {
  manufacturer?: string;
  chipModel?: string;
  memorySize?: string;
} {
  const cleanSak = typeof sak === 'number' ? sak : undefined;
  const isRandom = uid?.toUpperCase().startsWith('08');

  // Mifare Classic 1K
  if (cleanSak === 0x08) {
    return {
      manufacturer: 'NXP Semiconductors',
      chipModel: 'Mifare Classic 1K (S50)',
      memorySize: '1 kByte'
    };
  }

  // Mifare Classic 4K
  if (cleanSak === 0x18) {
    return {
      manufacturer: 'NXP Semiconductors',
      chipModel: 'Mifare Classic 4K (S70)',
      memorySize: '4 kByte'
    };
  }

  // Mifare Plus / DESFire fallback if SAK is 0x20
  if (cleanSak === 0x20) {
    return {
      manufacturer: 'NXP Semiconductors',
      chipModel: isRandom ? 'Mifare DESFire EV2/EV3' : 'Mifare DESFire / ISO 14443-4',
      memorySize: '2 - 8 kByte'
    };
  }

  // Mifare Ultralight / NTAG (SAK 0x00)
  if (cleanSak === 0x00) {
    return {
      manufacturer: 'NXP Semiconductors',
      chipModel: 'NTAG / Mifare Ultralight',
      memorySize: '144 - 888 Bytes'
    };
  }

  // Mifare Mini
  if (cleanSak === 0x09) {
    return {
      manufacturer: 'NXP Semiconductors',
      chipModel: 'Mifare Mini',
      memorySize: '320 Bytes'
    };
  }

  return {};
}
