import { ParsedNdefRecord } from '../nfc/nfcTypes';

const URI_PREFIX_MAP: { [key: number]: string } = {
  0x00: '',
  0x01: 'http://www.',
  0x02: 'https://www.',
  0x03: 'http://',
  0x04: 'https://',
  0x05: 'tel:',
  0x06: 'mailto:',
  0x07: 'ftp://anonymous:anonymous@',
  0x08: 'ftp://ftp.',
  0x09: 'ftps://',
  0x0a: 'sftp://',
  0x0b: 'smb://',
  0x0c: 'nfs://',
  0x0d: 'ftp://',
  0x0e: 'dav://',
  0x0f: 'news:',
  0x10: 'telnet://',
  0x11: 'imap:',
  0x12: 'rtsp://',
  0x13: 'urn:',
  0x14: 'pop:',
  0x15: 'sip:',
  0x16: 'sips:',
  0x17: 'tftp:',
  0x18: 'btspp://',
  0x19: 'btl2cap://',
  0x1a: 'btgoep://',
  0x1b: 'tcpobex://',
  0x1c: 'irdaobex://',
  0x1d: 'file://',
  0x1e: 'urn:epc:id:',
  0x1f: 'urn:epc:tag:',
  0x20: 'urn:epc:pat:',
  0x21: 'urn:epc:raw:',
  0x22: 'urn:epc:',
  0x23: 'urn:nfc:'
};

export function bytesToHex(bytes: number[] | Uint8Array): string {
  return Array.from(bytes)
    .map(b => (b & 0xff).toString(16).padStart(2, '0').toUpperCase())
    .join(' ');
}

export function parseNdefRecord(record: any): ParsedNdefRecord {
  const typeBytes: number[] = Array.isArray(record.type) ? record.type : [];
  const payloadBytes: number[] = Array.isArray(record.payload) ? record.payload : [];
  const typeStr = String.fromCharCode(...typeBytes);
  const rawHex = bytesToHex(payloadBytes);

  // 1. Text Record ('T')
  if (typeStr === 'T' && payloadBytes.length > 0) {
    const status = payloadBytes[0];
    const isUtf16 = (status & 0x80) !== 0;
    const langLength = status & 0x3f;
    const langCode = String.fromCharCode(...payloadBytes.slice(1, 1 + langLength));
    const textBytes = payloadBytes.slice(1 + langLength);
    const text = String.fromCharCode(...textBytes);

    return {
      type: 'Text',
      payload: text,
      encoding: isUtf16 ? 'UTF-16' : 'UTF-8',
      language: langCode,
      rawHex
    };
  }

  // 2. URI Record ('U')
  if (typeStr === 'U' && payloadBytes.length > 0) {
    const prefixCode = payloadBytes[0];
    const prefix = URI_PREFIX_MAP[prefixCode] || '';
    const uriBody = String.fromCharCode(...payloadBytes.slice(1));

    return {
      type: 'URI / Link',
      payload: `${prefix}${uriBody}`,
      rawHex
    };
  }

  // 3. MIME or JSON Record
  if (typeStr.includes('application/json') || typeStr.includes('text/')) {
    const text = String.fromCharCode(...payloadBytes);
    return {
      type: typeStr,
      payload: text,
      rawHex
    };
  }

  // 4. Default / Binary Record
  return {
    type: typeStr || 'Unknown / Binary',
    payload: `[Binary Data: ${payloadBytes.length} bytes]`,
    rawHex
  };
}
