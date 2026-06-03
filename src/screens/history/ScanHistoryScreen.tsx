import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { useTheme, useThemedStyles, Spacing, BorderRadius } from '../../theme';
import type { ColorScheme } from '../../theme/palettes';
import { ScreenHeader } from '../../components/ScreenHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { loadScanHistory, type ScanHistoryEntry } from '../../services/scanHistory';
import { businessApi } from '../../api/business.api';
import { updateScanHistoryStatus } from '../../services/scanHistory';

export const ScanHistoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [entries, setEntries] = useState<ScanHistoryEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const subs = await businessApi.listSubscriptions({ limit: 100 });
      for (const sub of subs) {
        if (sub.status === 'active' || sub.status === 'cancelled') {
          await updateScanHistoryStatus(
            sub.subscription_id,
            sub.status === 'active' ? 'active' : 'cancelled',
          );
        }
      }
      setEntries(await loadScanHistory());
    } finally {
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Scan history" subtitle="All scans on this device" onBack={() => navigation.goBack()} />

      <FlatList
        data={entries}
        keyExtractor={(e) => e.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={<Text style={styles.empty}>No scan history yet</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.rowMain}>
              <Text style={styles.name}>{item.customer_label}</Text>
              <Text style={styles.meta}>
                {item.channel_name} · {format(new Date(item.scanned_at), 'MMM d, h:mm a')}
              </Text>
            </View>
            <StatusBadge status={item.status} />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const createStyles = (c: ColorScheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    list: { padding: Spacing.base },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.surface,
      borderRadius: BorderRadius.md,
      padding: Spacing.base,
      marginBottom: Spacing.sm,
      borderWidth: 1,
      borderColor: c.border,
    },
    rowMain: { flex: 1, marginRight: Spacing.sm },
    name: { fontSize: 15, fontWeight: '700', color: c.textPrimary },
    meta: { fontSize: 12, color: c.textMuted, marginTop: 2 },
    empty: { textAlign: 'center', color: c.textMuted, padding: Spacing['2xl'] },
  });
