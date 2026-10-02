import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useI18n } from '../i18n/I18nContext';

interface HexViewerProps {
  label: string;
  hex: string;
}

export const HexViewer: React.FC<HexViewerProps> = ({ label, hex }) => {
  const [copied, setCopied] = useState(false);
  const { colors } = useTheme();
  const { t } = useI18n();

  const handleCopy = () => {
    // In web or native, copy to clipboard
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(hex.replace(/\s+/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceBg,
          borderColor: colors.borderColor,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
        <TouchableOpacity onPress={handleCopy} style={styles.copyBtn}>
          <Ionicons
            name={copied ? 'checkmark' : 'copy-outline'}
            size={14}
            color={copied ? colors.success : colors.textMuted}
          />
          <Text
            style={[
              styles.copyText,
              { color: colors.textMuted },
              copied && { color: colors.success },
            ]}
          >
            {copied ? t.common.copied : t.common.copy}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.hexBox, { backgroundColor: colors.inputBg }]}>
        <Text style={[styles.hexText, { color: colors.primary }]}>{hex}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
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
    fontSize: 11,
  },
  hexBox: {
    padding: 8,
    borderRadius: 6,
  },
  hexText: {
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 1,
  },
});
