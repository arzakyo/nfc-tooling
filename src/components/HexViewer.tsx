import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HexViewerProps {
  label: string;
  hex: string;
}

export const HexViewer: React.FC<HexViewerProps> = ({ label, hex }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // In web or native, copy to clipboard
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(hex.replace(/\s+/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity onPress={handleCopy} style={styles.copyBtn}>
          <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={14} color={copied ? '#10B981' : '#94A3B8'} />
          <Text style={[styles.copyText, copied && { color: '#10B981' }]}>
            {copied ? 'Copied' : 'Copy'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.hexBox}>
        <Text style={styles.hexText}>{hex}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: '#0F172A',
    padding: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  copyText: {
    color: '#94A3B8',
    fontSize: 11,
  },
  hexBox: {
    backgroundColor: '#020617',
    padding: 8,
    borderRadius: 6,
  },
  hexText: {
    fontFamily: 'monospace',
    color: '#38BDF8',
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 1,
  },
});
