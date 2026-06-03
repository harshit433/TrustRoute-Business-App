import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { brand } from '../theme/brand';
import { Spacing } from '../theme';

const LOGO = require('../../Assets/trustroute-logo.png');

type Size = 'sm' | 'md' | 'lg';

const SIZES: Record<
  Size,
  { shield: number; logo: number; radius: number; outerPad: number; title: number; subtitle: number }
> = {
  sm: { shield: 40, logo: 24, radius: 12, outerPad: 6, title: 18, subtitle: 11 },
  md: { shield: 52, logo: 32, radius: 15, outerPad: 8, title: 22, subtitle: 12 },
  lg: { shield: 100, logo: 58, radius: 30, outerPad: 12, title: 36, subtitle: 14 },
};

export type TrustRouteBrandProps = {
  size?: Size;
  stacked?: boolean;
  subtitle?: string;
  /** Shown after wordmark in secondary color (e.g. "Scan") */
  productSuffix?: string;
  hideSubtitle?: boolean;
};

/**
 * White logo on green shield + Trust (ink) / Route (green) wordmark.
 */
export const TrustRouteBrand: React.FC<TrustRouteBrandProps> = ({
  size = 'md',
  stacked = false,
  subtitle,
  productSuffix,
  hideSubtitle = false,
}) => {
  const s = SIZES[size];

  return (
    <View style={[styles.root, stacked && styles.rootStacked]}>
      <View style={[styles.shieldOuter, { padding: s.outerPad, borderRadius: s.radius + 12 }]}>
        <View
          style={[
            styles.shield,
            {
              width: s.shield,
              height: s.shield,
              borderRadius: s.radius,
            },
          ]}
        >
          <Image
            source={LOGO}
            style={{ width: s.logo, height: s.logo }}
            resizeMode="contain"
            accessibilityLabel="TrustRoute"
          />
        </View>
      </View>
      <View style={[styles.textBlock, stacked && styles.textBlockStacked]}>
        <Text style={[styles.wordmark, { fontSize: s.title }]}>
          Trust<Text style={styles.wordmarkRoute}>Route</Text>
          {productSuffix ? (
            <Text style={[styles.suffix, { fontSize: s.title * 0.72 }]}> {productSuffix}</Text>
          ) : null}
        </Text>
        {!hideSubtitle && subtitle ? (
          <Text
            style={[
              styles.subtitle,
              { fontSize: s.subtitle },
              stacked ? styles.subtitleStacked : styles.subtitleInline,
            ]}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  rootStacked: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: Spacing.base,
  },
  shieldOuter: {
    backgroundColor: brand.primaryGlow,
  },
  shield: {
    backgroundColor: brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: brand.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  textBlock: {
    flexShrink: 1,
  },
  textBlockStacked: {
    alignItems: 'center',
  },
  wordmark: {
    fontWeight: '900',
    color: brand.wordmarkTrust,
    letterSpacing: -0.5,
  },
  wordmarkRoute: {
    color: brand.wordmarkRoute,
  },
  suffix: {
    fontWeight: '800',
    color: brand.textSecondary,
  },
  subtitle: {
    marginTop: Spacing.xs,
    fontWeight: '600',
    color: brand.textSecondary,
  },
  subtitleStacked: {
    textAlign: 'center',
  },
  subtitleInline: {
    textAlign: 'left',
  },
});
