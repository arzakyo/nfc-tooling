export interface FaqItem {
  id: string;
  category: 'General' | 'Security & Cloning' | 'E-Money & Banking' | 'Web vs Native';
  question: string;
  shortAnswer: string;
  detailedAnswer: string;
  pocketBookSectionId: string;
  pocketBookSectionTitle: string;
}

export const FAQ_DATA_EN: FaqItem[] = [
  {
    id: 'faq-how-app-works',
    category: 'General',
    question: 'How does this app work and is it safe to use?',
    shortAnswer: 'It connects directly to your phone NFC chip 100% offline. Zero cloud data harvesting.',
    detailedAnswer:
      'This app operates locally on your device. When an NFC card is presented, the app establishes an RF session, reads public descriptors (UID, ATQA, SAK, NDEF records), and queries smart-card files via APDU if an e-money card is detected. No data is ever transmitted across the internet.',
    pocketBookSectionId: 'how-it-works',
    pocketBookSectionTitle: 'How This App Works (Dual-Engine & Privacy)'
  },
  {
    id: 'faq-cloning-desfire',
    category: 'Security & Cloning',
    question: 'Can someone clone my DESFire EV3 card (from the screenshot)?',
    shortAnswer: 'No. DESFire EV3 uses unbroken AES-128 encryption stored in a tamper-proof Secure Element.',
    detailedAnswer:
      'DESFire EV3 is virtually uncloneable with modern tools. Keys are physically locked inside silicon. Even if an attacker reads the 4-byte serial number (which is randomized anyway), door turnstiles and readers verify cards using dynamic AES cryptographic handshakes, not the outer serial number.',
    pocketBookSectionId: 'security-locking',
    pocketBookSectionTitle: 'Security & Anti-Tampering (AES-128 & Random UID)'
  },
  {
    id: 'faq-why-web-cannot-read-saldo',
    category: 'Web vs Native',
    question: 'Why can’t web browsers or PWAs read my e-money balance or 16-digit number?',
    shortAnswer: 'Browsers deliberately block raw ISO-DEP APDU commands for web security.',
    detailedAnswer:
      'Web NFC (NDEFReader) is strictly limited to standardized NDEF messages (URLs, plain text). E-money balance and 16-digit PANs are stored in smart card files (ISO 7816-4) that require sending raw byte commands (APDU). Browsers block this to protect against malicious websites probing banking chips.',
    pocketBookSectionId: 'how-it-works',
    pocketBookSectionTitle: 'How This App Works (Platform Comparison)'
  },
  {
    id: 'faq-emoney-offline-balance',
    category: 'E-Money & Banking',
    question: 'Can e-money balance be topped up without physically tapping the card?',
    shortAnswer: 'No. E-money balance lives locally in the chip EEPROM to allow sub-300ms transit gate taps.',
    detailedAnswer:
      'Unlike server e-wallets (GoPay, OVO, DANA), transit cards (Mandiri e-Money, BCA Flazz, Brizzi, TapCash) must deduct funds offline without waiting for cellular connectivity. Top-ups done online only create a "Pending Balance" (Saldo Tertunda) that must be synced to the chip via an NFC tap.',
    pocketBookSectionId: 'chips-matrix',
    pocketBookSectionTitle: 'NFC Chips Matrix (Smart Cards & E-Money)'
  },
  {
    id: 'faq-recover-locked-card',
    category: 'Security & Cloning',
    question: 'If a card is permanently locked, can it ever be recovered?',
    shortAnswer: 'No. Permanent locking physically blows electrical fuses (OTP) inside the silicon.',
    detailedAnswer:
      'When One-Time Programmable (OTP) lock bits are set on an NTAG or Mifare chip, internal electrical fuses are permanently burned. The write circuitry is physically disconnected. Neither software, backdoor commands, nor the factory can ever unlock it.',
    pocketBookSectionId: 'security-locking',
    pocketBookSectionTitle: 'Security & Anti-Tampering (OTP Lock Bits)'
  },
  {
    id: 'faq-which-card-to-buy',
    category: 'General',
    question: 'Which bare cards should I buy to test and experiment with?',
    shortAnswer: 'Buy NTAG215 stickers (universal) and Mifare Classic CUID Magic Cards (for gate cloning).',
    detailedAnswer:
      'NTAG215 stickers cost ~Rp 3.000–5.000 and work universally across Android, iPhone, and Web NFC. If you want to experiment with cloning legacy condo/lift access cards, buy Mifare Classic 1K CUID (Magic Cards), which have rewritable Sector 0 / UID.',
    pocketBookSectionId: 'chips-matrix',
    pocketBookSectionTitle: 'NFC Chips Matrix (Recommendations)'
  }
];

export const FAQ_DATA_ID: FaqItem[] = [
  {
    id: 'faq-how-app-works',
    category: 'General',
    question: 'Bagaimana cara kerja aplikasi ini dan apakah aman digunakan?',
    shortAnswer: 'Aplikasi terhubung langsung ke antena chip NFC ponsel Anda 100% offline tanpa perantara cloud.',
    detailedAnswer:
      'Aplikasi ini beroperasi sepenuhnya secara lokal di perangkat Anda. Saat kartu NFC didekatkan, aplikasi membuka sesi RF, membaca deskriptor publik (UID, ATQA, SAK, dan record NDEF), serta meminta file kartu pintar melalui perintah APDU jika kartu uang elektronik terdeteksi. Tidak ada data yang dikirimkan ke internet.',
    pocketBookSectionId: 'how-it-works',
    pocketBookSectionTitle: 'Cara Kerja Aplikasi (Arsitektur & Privasi)'
  },
  {
    id: 'faq-cloning-desfire',
    category: 'Security & Cloning',
    question: 'Bisakah seseorang menduplikasi (kloning) kartu DESFire EV3 saya?',
    shortAnswer: 'Tidak. DESFire EV3 menggunakan enkripsi AES-128 canggih di dalam Secure Element tahan sabotase.',
    detailedAnswer:
      'DESFire EV3 hampir mustahil dikloning dengan perangkat modern saat ini. Kunci kriptografi terkunci secara fisik di dalam silikon. Sekalipun pihak luar membaca nomor seri 4-byte (yang juga biasanya diacak), turnstile gerbang memverifikasi kartu melalui jabat tangan kriptografi dinamis AES, bukan nomor seri luarnya.',
    pocketBookSectionId: 'security-locking',
    pocketBookSectionTitle: 'Keamanan & Anti-Sabotase (AES-128 & Random UID)'
  },
  {
    id: 'faq-why-web-cannot-read-saldo',
    category: 'Web vs Native',
    question: 'Mengapa browser web atau PWA tidak bisa membaca saldo atau nomor kartu e-money?',
    shortAnswer: 'Browser sengaja memblokir perintah APDU ISO-DEP mentah demi perlindungan keamanan web.',
    detailedAnswer:
      'Web NFC (NDEFReader) dibatasi secara ketat hanya untuk pesan standar NDEF (tautan web, teks). Saldo e-money dan 16 digit nomor kartu disimpan dalam file smart card (ISO 7816-4) yang memerlukan pengiriman perintah byte mentah (APDU). Browser memblokirnya agar situs jahat tidak dapat mengeksploitasi chip perbankan Anda.',
    pocketBookSectionId: 'how-it-works',
    pocketBookSectionTitle: 'Cara Kerja Aplikasi (Komparasi Platform)'
  },
  {
    id: 'faq-emoney-offline-balance',
    category: 'E-Money & Banking',
    question: 'Bisakah saldo e-money diisi ulang tanpa menempelkan kartu ke ponsel?',
    shortAnswer: 'Tidak bisa. Saldo e-money tersimpan di EEPROM chip fisik agar gerbang tol dapat membaca dalam waktu di bawah 300ms.',
    detailedAnswer:
      'Berbeda dengan dompet digital berbasis server (GoPay, OVO, DANA), kartu transit (Mandiri e-Money, BCA Flazz, Brizzi, TapCash) harus dapat memotong dana secara offline tanpa menunggu sinyal seluler. Pengisian ulang online hanya membuat "Saldo Tertunda" yang wajib disinkronkan ke dalam chip melalui tempelan NFC.',
    pocketBookSectionId: 'chips-matrix',
    pocketBookSectionTitle: 'Matriks Chip NFC (Smart Card & E-Money)'
  },
  {
    id: 'faq-recover-locked-card',
    category: 'Security & Cloning',
    question: 'Jika kartu terkunci permanen (OTP lock), bisakah dipulihkan kembali?',
    shortAnswer: 'Tidak bisa. Penguncian permanen secara fisik memutuskan sekring listrik mikroskopis (OTP) di dalam silikon.',
    detailedAnswer:
      'Ketika bit pengunci One-Time Programmable (OTP) diaktifkan pada chip NTAG atau Mifare, sekring listrik internal di dalam chip terbakar secara permanen. Jalur penulisan terputus secara fisik. Baik perangkat lunak, perintah backdoor, maupun pihak pabrikan tidak dapat membukanya kembali.',
    pocketBookSectionId: 'security-locking',
    pocketBookSectionTitle: 'Keamanan & Anti-Sabotase (Bit Pengunci OTP)'
  },
  {
    id: 'faq-which-card-to-buy',
    category: 'General',
    question: 'Kartu atau stiker NFC apa yang sebaiknya dibeli untuk latihan dan pengujian?',
    shortAnswer: 'Beli stiker NTAG215 (universal) dan kartu Mifare Classic CUID Magic Card (untuk kloning akses gerbang).',
    detailedAnswer:
      'Stiker NTAG215 berharga sekitar Rp 3.000–5.000 dan kompatibel universal di Android, iPhone, dan Web NFC. Jika Anda ingin bereksperimen menduplikasi kartu akses lift apartemen atau perumahan lama, beli kartu Mifare Classic 1K CUID yang Sektor 0 / UID-nya dapat ditulis ulang.',
    pocketBookSectionId: 'chips-matrix',
    pocketBookSectionTitle: 'Matriks Chip NFC (Rekomendasi)'
  }
];

export const FAQ_DATA = FAQ_DATA_EN;
