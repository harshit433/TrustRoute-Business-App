import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { formatDistanceToNow } from 'date-fns';
import { useTheme, useThemedStyles, Spacing, BorderRadius } from '../../theme';
import type { ColorScheme } from '../../theme/palettes';
import { ScreenHeader } from '../../components/ScreenHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuthStore } from '../../store/auth.store';
import { useChannelsStore } from '../../store/channels.store';
import { loadScanHistory, todayHistory, type ScanHistoryEntry } from '../../services/scanHistory';
import { businessApi } from '../../api/business.api';
import { updateScanHistoryStatus } from '../../services/scanHistory';
import type { RootStackParamList } from '../../navigation/types';
import { getUserFacingError } from '../../utils/errors';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const profile = useAuthStore((s) => s.profile);
  const logout = useAuthStore((s) => s.logout);
  const { channels, selectedChannelId, load } = useChannelsStore();
  const channel = useChannelsStore((s) =>
    s.channels.find((c) => c.channel_id === s.selectedChannelId) ?? null,
  );

  const [history, setHistory] = useState<ScanHistoryEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await load();
      const local = await loadScanHistory();
      setHistory(todayHistory(local));

      const subs = await businessApi.listSubscriptions({ limit: 50 });
      for (const sub of subs) {
        if (sub.status === 'active' || sub.status === 'cancelled') {
          await updateScanHistoryStatus(
            sub.subscription_id,
            sub.status === 'active' ? 'active' : 'cancelled',
          );
        }
      }
      const updated = await loadScanHistory();
      setHistory(todayHistory(updated));
    } catch (e) {
      Alert.alert('Refresh failed', getUserFacingError(e, 'Could not refresh data.'));
    } finally {
      setRefreshing(false);
    }
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const onScan = () => {
    if (!selectedChannelId) {
      Alert.alert('Select a channel', 'Choose which channel to subscribe customers to.');
      navigation.navigate('ChannelSelector');
      return;
    }
    navigation.navigate('Scanner');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title={profile?.name ?? 'TrustRoute Scan'}
        subtitle="Customer subscription scanner"
        right={
          <TouchableOpacity
            onPress={() =>
              Alert.alert('Sign out?', undefined, [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign out', style: 'destructive', onPress: () => logout() },
              ])
            }
          >
            <MaterialCommunityIcons name="logout" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} />}
      >
        <TouchableOpacity style={styles.scanHero} onPress={onScan} activeOpacity={0.85}>
          <View style={styles.scanIconWrap}>
            <MaterialCommunityIcons name="qrcode-scan" size={48} color={colors.white} />
          </View>
          <Text style={styles.scanTitle}>Scan customer QR</Text>
          <Text style={styles.scanSub}>Point at the TrustRoute app on their phone</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.channelCard} onPress={() => navigation.navigate('ChannelSelector')}>
          <View style={styles.channelRow}>
            <MaterialCommunityIcons name="broadcast" size={22} color={colors.primary} />
            <View style={styles.channelText}>
              <Text style={styles.channelLabel}>Active channel</Text>
              <Text style={styles.channelName}>
                {channel?.name ?? (channels.length ? 'Select channel' : 'No channels yet')}
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textMuted} />
          </View>
        </TouchableOpacity>

        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Today&apos;s scans</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ScanHistory')}>
            <Text style={styles.sectionLink}>See all</Text>
          </TouchableOpacity>
        </View>

        {history.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No scans yet today</Text>
          </View>
        ) : (
          history.slice(0, 5).map((item) => (
            <View key={item.id} style={styles.historyRow}>
              <View style={styles.historyMain}>
                <Text style={styles.historyName}>{item.customer_label}</Text>
                <Text style={styles.historyMeta}>
                  {item.channel_name} · {formatDistanceToNow(new Date(item.scanned_at), { addSuffix: true })}
                </Text>
              </View>
              <StatusBadge status={item.status} />
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (c: ColorScheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    scroll: { padding: Spacing.base, paddingBottom: Spacing['2xl'] },
    scanHero: {
      backgroundColor: c.primary,
      borderRadius: BorderRadius.xl,
      padding: Spacing.xl,
      alignItems: 'center',
      marginBottom: Spacing.base,
    },
    scanIconWrap: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: 'rgba(255,255,255,0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.base,
    },
    scanTitle: { fontSize: 22, fontWeight: '800', color: c.white },
    scanSub: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: Spacing.xs, textAlign: 'center' },
    channelCard: {
      backgroundColor: c.surface,
      borderRadius: BorderRadius.lg,
      padding: Spacing.base,
      borderWidth: 1.5,
      borderColor: c.border,
      marginBottom: Spacing.lg,
    },
    channelRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
    channelText: { flex: 1 },
    channelLabel: { fontSize: 12, color: c.textSecondary, fontWeight: '600' },
    channelName: { fontSize: 16, fontWeight: '800', color: c.textPrimary, marginTop: 2 },
    sectionHead: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: c.textPrimary },
    sectionLink: { fontSize: 13, fontWeight: '700', color: c.primary },
    empty: {
      padding: Spacing.xl,
      alignItems: 'center',
      backgroundColor: c.surface,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: c.border,
    },
    emptyText: { color: c.textMuted, fontSize: 14, fontWeight: '600' },
    historyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.surface,
      borderRadius: BorderRadius.md,
      padding: Spacing.base,
      marginBottom: Spacing.sm,
      borderWidth: 1,
      borderColor: c.border,
    },
    historyMain: { flex: 1, marginRight: Spacing.sm },
    historyName: { fontSize: 15, fontWeight: '700', color: c.textPrimary },
    historyMeta: { fontSize: 12, color: c.textMuted, marginTop: 2 },
  });
