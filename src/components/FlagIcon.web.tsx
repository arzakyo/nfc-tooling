import React from 'react';
import { View, StyleSheet } from 'react-native';

interface FlagIconProps {
  country: 'id' | 'us' | 'en';
  size?: number;
}

/**
 * Web vector flag component using clean SVG.
 */
export const FlagIcon: React.FC<FlagIconProps> = ({ country, size = 20 }) => {
  const isId = country === 'id';
  const height = size;
  const width = Math.round(size * 1.4);

  if (isId) {
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

  // US Flag
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
});
