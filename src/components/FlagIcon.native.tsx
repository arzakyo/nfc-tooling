import React from 'react';
import { View, StyleSheet } from 'react-native';

interface FlagIconProps {
  country: 'id' | 'us' | 'en';
  size?: number;
}

/**
 * Native (Android & iOS) vector flag component using pure React Native Views.
 * 100% crash-proof with zero native binary or SVG dependencies.
 */
export const FlagIcon: React.FC<FlagIconProps> = ({ country, size = 20 }) => {
  const isId = country === 'id';
  const height = size;
  const width = Math.round(size * 1.4);

  if (isId) {
    return (
      <View style={[styles.flagWrapper, { width, height }]}>
        <View style={styles.idTop} />
        <View style={styles.idBottom} />
      </View>
    );
  }

  // US Flag Representation
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
