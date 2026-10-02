import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

interface FlagIconProps {
  country: 'id' | 'us' | 'en';
  size?: number;
}

/**
 * Pure SVG/Native-compatible vector flag component.
 * Renders crisp Indonesia (ID) and United States (US) flags with perfect aspect ratio and border.
 * Uses native <svg> on Web and clean view layers on Android/iOS (no native binary dependencies needed).
 */
export const FlagIcon: React.FC<FlagIconProps> = ({ country, size = 20 }) => {
  const isId = country === 'id';
  // Standard flag ratio: 3:2 (width = size * 1.5, height = size)
  const height = size;
  const width = Math.round(size * 1.4);

  if (Platform.OS === 'web') {
    if (isId) {
      // Indonesia flag: Red on top half, White on bottom half
      return (
        <View style={[styles.flagWrapper, { width, height }]}>
          <svg
            width={width}
            height={height}
            viewBox="0 0 28 20"
            fill="none"
            style={{ display: 'block', borderRadius: 3 }}
          >
            <rect width="28" height="20" rx="3" fill="#FFFFFF" />
            <rect width="28" height="10" fill="#E11D48" />
            <rect width="28" height="10" y="10" fill="#FFFFFF" />
            <rect x="0.5" y="0.5" width="27" height="19" rx="2.5" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
          </svg>
        </View>
      );
    }

    // US Flag: 13 Stripes, blue canton with stars
    return (
      <View style={[styles.flagWrapper, { width, height }]}>
        <svg
          width={width}
          height={height}
          viewBox="0 0 28 20"
          fill="none"
          style={{ display: 'block', borderRadius: 3 }}
        >
          <rect width="28" height="20" rx="3" fill="#FFFFFF" />
          {/* Stripes */}
          <rect width="28" height="1.54" fill="#B91C1C" />
          <rect y="3.08" width="28" height="1.54" fill="#B91C1C" />
          <rect y="6.15" width="28" height="1.54" fill="#B91C1C" />
          <rect y="9.23" width="28" height="1.54" fill="#B91C1C" />
          <rect y="12.31" width="28" height="1.54" fill="#B91C1C" />
          <rect y="15.38" width="28" height="1.54" fill="#B91C1C" />
          <rect y="18.46" width="28" height="1.54" fill="#B91C1C" />
          {/* Blue Canton */}
          <rect width="12" height="10.8" fill="#1D4ED8" />
          {/* Simplified crisp stars pattern in canton */}
          <circle cx="2.5" cy="2.2" r="0.75" fill="#FFFFFF" />
          <circle cx="6" cy="2.2" r="0.75" fill="#FFFFFF" />
          <circle cx="9.5" cy="2.2" r="0.75" fill="#FFFFFF" />
          <circle cx="4.25" cy="4.2" r="0.75" fill="#FFFFFF" />
          <circle cx="7.75" cy="4.2" r="0.75" fill="#FFFFFF" />
          <circle cx="2.5" cy="6.2" r="0.75" fill="#FFFFFF" />
          <circle cx="6" cy="6.2" r="0.75" fill="#FFFFFF" />
          <circle cx="9.5" cy="6.2" r="0.75" fill="#FFFFFF" />
          <circle cx="4.25" cy="8.2" r="0.75" fill="#FFFFFF" />
          <circle cx="7.75" cy="8.2" r="0.75" fill="#FFFFFF" />
          <rect x="0.5" y="0.5" width="27" height="19" rx="2.5" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
        </svg>
      </View>
    );
  }

  // Native (Android/iOS) rendered with pure flex views
  if (isId) {
    return (
      <View style={[styles.flagWrapper, { width, height }]}>
        <View style={styles.idTop} />
        <View style={styles.idBottom} />
      </View>
    );
  }

  // US Native Representation
  return (
    <View style={[styles.flagWrapper, { width, height }]}>
      <View style={styles.usStripeContainer}>
        <View style={[styles.usStripe, { backgroundColor: '#B91C1C' }]} />
        <View style={[styles.usStripe, { backgroundColor: '#FFFFFF' }]} />
        <View style={[styles.usStripe, { backgroundColor: '#B91C1C' }]} />
        <View style={[styles.usStripe, { backgroundColor: '#FFFFFF' }]} />
        <View style={[styles.usStripe, { backgroundColor: '#B91C1C' }]} />
        <View style={[styles.usStripe, { backgroundColor: '#FFFFFF' }]} />
        <View style={[styles.usStripe, { backgroundColor: '#B91C1C' }]} />
      </View>
      <View style={styles.usCanton}>
        <View style={styles.usDot} />
        <View style={styles.usDot} />
        <View style={styles.usDot} />
        <View style={styles.usDot} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flagWrapper: {
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  idTop: {
    flex: 1,
    width: '100%',
    backgroundColor: '#E11D48',
  },
  idBottom: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  usStripeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'column',
  },
  usStripe: {
    flex: 1,
  },
  usCanton: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '45%',
    height: '55%',
    backgroundColor: '#1D4ED8',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 1,
    gap: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  usDot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#FFFFFF',
  },
});
