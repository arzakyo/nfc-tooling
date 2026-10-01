import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const DownloadAppBanner: React.FC = () => {
  // Only display on Web
  if (Platform.OS !== 'web') {
    return null;
  }

  const handleDownload = () => {
    // Direct link to GitHub releases / APK download
    Linking.openURL('https://github.com/arzakyo/nfc-tooling/releases');
  };

  return (
    <View style={styles.banner}>
      <View style={styles.iconContainer}>
        <Ionicons name="phone-portrait-outline" size={24} color="#38BDF8" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Unlock Deep NFC & E-Money Reading</Text>
        <Text style={styles.description}>
          Web browsers block raw APDU commands for security. Download the native mobile app to read
          e-Money balances, transaction logs, and DESFire smart cards on Android & iOS.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleDownload}>
          <Ionicons name="download-outline" size={16} color="#0F172A" />
          <Text style={styles.buttonText}>Download Android APK / iOS App</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconContainer: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    padding: 10,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  description: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#38BDF8',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 13,
  },
});
