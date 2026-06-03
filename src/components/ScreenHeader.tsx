import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme, useThemedStyles } from '../theme';
import type { ColorScheme } from '../theme/palettes';
import { Spacing } from '../theme';

type Props = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
};

export const ScreenHeader: React.FC<Props> = ({ title, subtitle, onBack, right }) => {
  const { colors: c } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backBtn} accessibilityLabel="Go back">
            <MaterialCommunityIcons name="chevron-left" size={28} color={c.textPrimary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
        <View style={styles.titles}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <View style={styles.right}>{right ?? <View style={styles.backPlaceholder} />}</View>
      </View>
    </View>
  );
};

const createStyles = (c: ColorScheme) => {
  const sheet = StyleSheet.create({
    wrap: { paddingHorizontal: Spacing.base, paddingTop: Spacing.sm, paddingBottom: Spacing.md },
    row: { flexDirection: 'row', alignItems: 'center' },
    backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    backPlaceholder: { width: 40 },
    titles: { flex: 1 },
    title: { fontSize: 20, fontWeight: '800', color: c.textPrimary },
    subtitle: { fontSize: 13, color: c.textSecondary, marginTop: 2, fontWeight: '500' },
    right: { minWidth: 40, alignItems: 'flex-end' },
  });
  return sheet;
};
