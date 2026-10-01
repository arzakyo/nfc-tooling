export interface PocketBookSection {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  content: {
    summary: string;
    highlights: string[];
    table?: {
      headers: string[];
      rows: string[][];
    };
    notes?: string[];
  };
}

export const POCKET_BOOK_SECTIONS: PocketBookSection[] = [
  {
    id: 'how-it-works',
    title: 'How This App Works',
    subtitle: 'Dual-Engine Architecture & 100% Offline Privacy',
    icon: 'hardware-chip-outline',
    content: {
      summary:
        'NFC Tooling is built to be an on-device utility. It communicates directly with your physical NFC controller without using any cloud servers or telemetry.',
      highlights: [
        '100% Local & Offline: No card numbers, balances, or keys ever leave your device.',
        'Native Engine (Android/iOS): Uses react-native-nfc-manager for raw APDUs, reading smart cards (e-Money/Flazz), DESFire EV3, and Mifare Classic.',
        'Web Engine (Chrome Android): Uses window.NDEFReader for basic UID and NDEF tags within browser security limits.',
        'Apple CoreNFC Compatible: Runs ISO 7816 smart card reading on iPhones starting from iOS 13.'
      ],
      table: {
        headers: ['Feature', 'Native Mobile (App)', 'Web Browser (PWA)'],
        rows: [
          ['Card Detection & UID', 'Full speed (All cards)', 'Chrome Android only'],
          ['NDEF Read & Write', 'Supported', 'Chrome Android only'],
          ['ISO-DEP / APDU Transceive', 'Supported (Deep Access)', 'Blocked by browser'],
          ['E-Money Saldo & PAN', 'Supported', 'Blocked by browser'],
          ['Mifare DESFire / Classic', 'Supported', 'Blocked by browser'],
          ['iPhone (iOS) Support', 'Supported via CoreNFC', 'Blocked by WebKit']
        ]
      },
      notes: [
        'If you are using the Web version, download the standalone APK or native build to unlock deep smart-card scanning.'
      ]
    }
  },
  {
    id: 'chips-matrix',
    title: 'NFC Chips Matrix',
    subtitle: 'Comparison of Frequencies, Memory & Formats',
    icon: 'grid-outline',
    content: {
      summary:
        'NFC operates at 13.56 MHz, but cards vary widely in compute power, memory architecture, and security protocols.',
      highlights: [
        'NTAG Family (Type 2): Flat memory EEPROM. Pre-formatted for NDEF out of the box. Ideal for URLs, text, and vCards.',
        'Mifare DESFire EV3 (Type 4): High-security micro-controller with AES-128 coprocessor. Used in corporate access, high-end gates, and Flazz Gen 2.',
        'Mifare Classic 1K: Legacy 13.56 MHz card with cracked 48-bit Crypto-1 encryption. Common in condo gates and apartment elevators.',
        '125 kHz RFID: Older low-frequency cards (EM4100). NOT NFC — smartphones physically cannot detect them.'
      ],
      table: {
        headers: ['Chip Model', 'Usable Storage', 'Factory NDEF?', 'Rewritable?', 'Typical Use Case'],
        rows: [
          ['NTAG213', '144 bytes', 'Yes', 'Yes', 'Short URLs, social links, smart posters'],
          ['NTAG215', '504 bytes', 'Yes', 'Yes', 'Nintendo Amiibo, contact vCards'],
          ['NTAG216', '888 bytes', 'Yes', 'Yes', 'Long text notes, Wi-Fi configs, JSON'],
          ['Mifare Ultralight', '48 / 128 bytes', 'Yes', 'Yes', 'Single-trip transit tickets, wristbands'],
          ['Mifare DESFire EV3', '2 KB / 4 KB / 8 KB', 'Needs format', 'Yes (with AES Key)', 'Condo access, Flazz Gen 2, bank cards'],
          ['Mifare Classic 1K', '752 bytes (16 sec)', 'Proprietary', 'Crypto-1', 'Apartment keys, gates, gym lockers'],
          ['Mifare CUID (Magic)', '752 bytes', 'Proprietary', 'Yes (UID Writable)', 'Cloning legacy Mifare Classic tags'],
          ['EM4100 / TK4100', '5 bytes (ID only)', 'No (125 kHz)', 'No (Read-only)', 'Parking boom gates, legacy fobs']
        ]
      },
      notes: [
        'Looking to buy test tags? Buy a 5-pack of NTAG215 stickers and a couple of Mifare Classic CUID Magic Cards on Tokopedia/Shopee.'
      ]
    }
  },
  {
    id: 'security-locking',
    title: 'Security & Anti-Tampering',
    subtitle: 'Passwords, OTP Lock Bits & Random UID',
    icon: 'shield-checkmark-outline',
    content: {
      summary:
        'Understanding how card chips protect against unauthorized modification, cloning, and privacy tracking.',
      highlights: [
        'NTAG 32-bit Password: PWD & PACK registers allow anyone to read, but require a 4-byte password to write or wipe.',
        'OTP Permanent Lock: Physically blows silicon microscopic fuses. Once set, the card is read-only forever and can NEVER be recovered.',
        'DESFire AES-128 Permissions: Each file has independent access rights (Read, Write, Change). Writes require presenting the secret AES key.',
        'Random UID (08:xx:xx:xx): Dynamic 4-byte serial number generated on each tap to prevent tracking and UID cloning.'
      ],
      notes: [
        'Permanent lock is irreversible. Do not lock test cards unless you never intend to rewrite them.'
      ]
    }
  }
];
