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

export const POCKET_BOOK_SECTIONS_EN: PocketBookSection[] = [
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

export const POCKET_BOOK_SECTIONS_ID: PocketBookSection[] = [
  {
    id: 'how-it-works',
    title: 'Cara Kerja Aplikasi',
    subtitle: 'Arsitektur Dual-Engine & Privasi 100% Offline',
    icon: 'hardware-chip-outline',
    content: {
      summary:
        'NFC Tooling dirancang sebagai utilitas langsung di perangkat. Aplikasi berkomunikasi langsung dengan chip fisik kontroler NFC tanpa server cloud atau analitik.',
      highlights: [
        '100% Lokal & Offline: Nomor kartu, saldo, dan kunci enkripsi tidak pernah meninggalkan perangkat Anda.',
        'Mesin Native (Android/iOS): Menggunakan react-native-nfc-manager untuk perintah APDU, membaca e-Money Mandiri / BCA Flazz, DESFire EV3, dan Mifare Classic.',
        'Mesin Web (Chrome Android): Menggunakan window.NDEFReader untuk membaca UID dan tag NDEF dalam batasan keamanan browser.',
        'Kompatibel Apple CoreNFC: Mendukung pembacaan smart card ISO 7816 di iPhone mulai dari iOS 13.'
      ],
      table: {
        headers: ['Fitur', 'Aplikasi Mobile Native', 'Browser Web (PWA)'],
        rows: [
          ['Deteksi Kartu & UID', 'Kecepatan penuh (Semua kartu)', 'Hanya Chrome Android'],
          ['Baca & Tulis NDEF', 'Didukung penuh', 'Hanya Chrome Android'],
          ['ISO-DEP / Kirim APDU', 'Didukung (Akses Mendalam)', 'Diblokir oleh browser'],
          ['Saldo & PAN E-Money', 'Didukung', 'Diblokir oleh browser'],
          ['Mifare DESFire / Classic', 'Didukung', 'Diblokir oleh browser'],
          ['Dukungan iPhone (iOS)', 'Didukung via CoreNFC', 'Diblokir oleh WebKit']
        ]
      },
      notes: [
        'Jika Anda menggunakan versi Web, unduh file APK Android untuk membuka kemampuan pemindaian smart-card tingkat dalam.'
      ]
    }
  },
  {
    id: 'chips-matrix',
    title: 'Matriks Chip NFC',
    subtitle: 'Komparasi Frekuensi, Kapasitas Memori & Format',
    icon: 'grid-outline',
    content: {
      summary:
        'NFC beroperasi pada frekuensi 13.56 MHz, namun variasi kartu sangat luas dalam hal daya komputasi, arsitektur memori, dan protokol keamanan.',
      highlights: [
        'Keluarga NTAG (Tipe 2): EEPROM memori datar. Terformat standar NDEF langsung dari pabrik. Sangat cocok untuk URL, teks, dan kontak vCard.',
        'Mifare DESFire EV3 (Tipe 4): Mikrokontroler keamanan tinggi dengan prosesor kriptografi AES-128. Digunakan pada akses gedung modern dan Flazz Gen 2.',
        'Mifare Classic 1K: Kartu legacy 13.56 MHz dengan enkripsi Crypto-1 48-bit yang sudah usang. Umum ditemukan di pintu lift apartemen dan kartu member.',
        'RFID 125 kHz: Kartu frekuensi rendah lawas (EM4100). BUKAN NFC — ponsel cerdas secara fisik tidak memiliki antena 125 kHz.'
      ],
      table: {
        headers: ['Model Chip', 'Kapasitas Memori', 'Format NDEF Pabrik?', 'Bisa Ditulis Ulang?', 'Penggunaan Umum'],
        rows: [
          ['NTAG213', '144 byte', 'Ya', 'Ya', 'URL pendek, tautan sosmed, poster pintar'],
          ['NTAG215', '504 byte', 'Ya', 'Ya', 'Nintendo Amiibo, kartu nama digital'],
          ['NTAG216', '888 byte', 'Ya', 'Ya', 'Teks panjang, konfigurasi Wi-Fi, JSON'],
          ['Mifare Ultralight', '48 / 128 byte', 'Ya', 'Ya', 'Tiket transportasi sekali jalan, gelang festival'],
          ['Mifare DESFire EV3', '2 KB / 4 KB / 8 KB', 'Perlu diformat', 'Ya (dengan Kunci AES)', 'Akses apartemen, Flazz Gen 2, perbankan'],
          ['Mifare Classic 1K', '752 byte (16 sek)', 'Proprietari', 'Crypto-1', 'Akses lift apartemen, kartu gym, loker'],
          ['Mifare CUID (Magic)', '752 byte', 'Proprietari', 'Ya (UID Bisa Ditulis)', 'Menduplikasi kartu Mifare Classic lama'],
          ['EM4100 / TK4100', '5 byte (Hanya ID)', 'Bukan (125 kHz)', 'Tidak (Hanya-Baca)', 'Palang gerbang parkir, gantungan kunci RFID']
        ]
      },
      notes: [
        'Mau beli kartu untuk belajar? Beli 5 lembar stiker NTAG215 dan beberapa kartu Mifare Classic CUID Magic Card di marketplace lokal.'
      ]
    }
  },
  {
    id: 'security-locking',
    title: 'Keamanan & Anti-Sabotase',
    subtitle: 'Kata Sandi, Bit Kunci OTP & Random UID',
    icon: 'shield-checkmark-outline',
    content: {
      summary:
        'Memahami cara chip kartu melindungi integritas data dari modifikasi liar, kloning, dan pelacakan privasi.',
      highlights: [
        'Kata Sandi NTAG 32-bit: Register PWD & PACK mengizinkan siapa pun membaca, namun meminta sandi 4-byte untuk menulis atau menghapus.',
        'Kunci Permanen OTP: Secara mikroskopis memutuskan sekring listrik di silikon chip. Sekali terkunci, kartu selamanya hanya-baca dan TIDAK BISA dipulihkan.',
        'Izin Akses DESFire AES-128: Setiap file memiliki hak akses terpisah (Baca, Tulis, Ubah). Penulisan mewajibkan verifikasi kunci rahasia AES.',
        'Random UID (08:xx:xx:xx): Nomor seri acak 4-byte yang dihasilkan baru pada setiap tempelan untuk mencegah pelacakan dan kloning nomor seri.'
      ],
      notes: [
        'Penguncian permanen bersifat mutlak. Jangan mengunci kartu uji coba Anda kecuali memang ingin membuatnya menjadi hanya-baca selamanya.'
      ]
    }
  }
];

export const POCKET_BOOK_SECTIONS = POCKET_BOOK_SECTIONS_EN;
