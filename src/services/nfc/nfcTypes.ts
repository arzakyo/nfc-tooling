export type CardType = 
  | 'DESFire EV3'
  | 'DESFire EV1/EV2'
  | 'Mifare Classic 1K/4K'
  | 'NTAG21x (Type 2)'
  | 'Mifare Ultralight'
  | 'ISO-DEP Smart Card'
  | 'Unknown NFC Tag';

export interface ParsedNdefRecord {
  id?: string;
  type: string;
  payload: string;
  encoding?: string;
  language?: string;
  rawHex: string;
}

export interface EmoneyDetail {
  bank: 'Mandiri e-Money' | 'BCA Flazz' | 'BNI TapCash' | 'BRI Brizzi' | 'Unknown';
  cardNumber?: string;
  balance?: number;
  lastTransactions?: Array<{
    timestamp: string;
    amount: number;
    type: 'debit' | 'credit';
    terminalId?: string;
  }>;
}

export interface ScannedCard {
  id: string; // generated local uuid
  uid: string; // e.g. "08:BB:48:24"
  isRandomUid: boolean; // true if UID starts with 08 (anti-tracking)
  cardType: CardType;
  techList: string[];
  sak?: number;
  atqa?: string;
  ats?: string;
  ndefRecords?: ParsedNdefRecord[];
  emoney?: EmoneyDetail;
  scannedAt: string; // ISO string
  rawInfo?: Record<string, any>;
}

export interface NfcScanResult {
  success: boolean;
  card?: ScannedCard;
  error?: string;
}
