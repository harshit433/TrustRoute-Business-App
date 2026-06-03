import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemedStyles } from '../theme';
import type { ColorScheme } from '../theme/palettes';
import { BorderRadius, Spacing } from '../theme';

type Status = 'pending' | 'active' | 'cancelled';

const labels: Record<Status, string> = {
  pending: 'Pending approval',
  active: 'Approved',
  cancelled: 'Denied',
};

export const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={[styles.badge, styles[`badge_${status}`]]}>
      <Text style={[styles.text, styles[`text_${status}`]]}>{labels[status]}</Text>
    </View>
  );
};

const createStyles = (c: ColorScheme) =>
  StyleSheet.create({
    badge: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: 4,
      borderRadius: BorderRadius.full,
      alignSelf: 'flex-start',
    },
    badge_pending: { backgroundColor: c.warningLight },
    badge_active: { backgroundColor: c.successLight },
    badge_cancelled: { backgroundColor: c.errorLight },
    text: { fontSize: 11, fontWeight: '700' },
    text_pending: { color: c.warning },
    text_active: { color: c.success },
    text_cancelled: { color: c.error },
  });
