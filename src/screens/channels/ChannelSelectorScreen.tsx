import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useTheme, useThemedStyles, Spacing, BorderRadius } from '../../theme';
import type { ColorScheme } from '../../theme/palettes';
import { ScreenHeader } from '../../components/ScreenHeader';
import { useChannelsStore } from '../../store/channels.store';
import type { BusinessChannel } from '../../api/business.api';
import { getUserFacingError } from '../../utils/errors';

export const ChannelSelectorScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { channels, selectedChannelId, load, selectChannel, loading } = useChannelsStore();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    load().catch((e) =>
      Alert.alert('Could not load channels', getUserFacingError(e, 'Try again.')),
    );
  }, [load]);

  const onSelect = async (channel: BusinessChannel) => {
    if (!channel.active) {
      Alert.alert('Channel inactive', 'This channel is turned off in your dashboard.');
      return;
    }
    setBusy(true);
    try {
      await selectChannel(channel.channel_id);
      navigation.goBack();
    } finally {
      setBusy(false);
    }
  };

  const renderItem = ({ item }: { item: BusinessChannel }) => {
    const selected = item.channel_id === selectedChannelId;
    return (
      <TouchableOpacity
        style={[styles.row, selected && styles.rowSelected]}
        onPress={() => onSelect(item)}
        disabled={busy}
      >
        <View style={styles.rowMain}>
          <Text style={styles.rowTitle}>{item.name}</Text>
          <Text style={styles.rowMeta}>
            {item.channel_type} · {item.subscriber_count ?? 0} subscribers
          </Text>
        </View>
        {selected ? (
          <MaterialCommunityIcons name="check-circle" size={24} color={colors.primary} />
        ) : (
          <MaterialCommunityIcons name="circle-outline" size={24} color={colors.textMuted} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="Select channel"
        subtitle="New scans subscribe to this channel"
        onBack={() => navigation.goBack()}
      />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : (
        <FlatList
          data={channels}
          keyExtractor={(c) => c.channel_id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>Create channels in the Business Dashboard first.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const createStyles = (c: ColorScheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    list: { padding: Spacing.base, gap: Spacing.sm },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.surface,
      borderRadius: BorderRadius.lg,
      padding: Spacing.base,
      borderWidth: 1.5,
      borderColor: c.border,
      marginBottom: Spacing.sm,
    },
    rowSelected: { borderColor: c.primary },
    rowMain: { flex: 1 },
    rowTitle: { fontSize: 16, fontWeight: '800', color: c.textPrimary },
    rowMeta: { fontSize: 12, color: c.textMuted, marginTop: 4, textTransform: 'capitalize' },
    empty: { textAlign: 'center', color: c.textMuted, padding: Spacing.xl, fontSize: 14 },
  });
