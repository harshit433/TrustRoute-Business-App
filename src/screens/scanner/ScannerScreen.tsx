import React, { Suspense, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, CameraType } from 'react-native-camera-kit';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useTheme, useThemedStyles, Spacing, BorderRadius } from '../../theme';
import type { ColorScheme } from '../../theme/palettes';
import { ScreenHeader } from '../../components/ScreenHeader';
import { parseBusinessQrToken } from '../../utils/parseBusinessQr';
import { ensureCameraPermission } from '../../utils/permissions';
import { useChannelsStore } from '../../store/channels.store';
import { businessApi } from '../../api/business.api';
import { appendScanHistory } from '../../services/scanHistory';
import { getUserFacingError } from '../../utils/errors';

type Phase = 'scanning' | 'submitting' | 'success' | 'error';

export const ScannerScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const selectedChannelId = useChannelsStore((s) => s.selectedChannelId);
  const channel = useChannelsStore((s) =>
    s.channels.find((c) => c.channel_id === s.selectedChannelId) ?? null,
  );

  const [torchOn, setTorchOn] = useState(false);
  const [cameraReady, setCameraReady] = useState(Platform.OS !== 'android');
  const [phase, setPhase] = useState<Phase>('scanning');
  const [resultMessage, setResultMessage] = useState('');
  const [customerName, setCustomerName] = useState<string | null>(null);
  const scannedRef = useRef(false);

  useEffect(() => {
    ensureCameraPermission().then(setCameraReady);
  }, []);

  useEffect(() => {
    if (!selectedChannelId) {
      Alert.alert('No channel', 'Select a channel before scanning.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  }, [selectedChannelId, navigation]);

  const resetScan = () => {
    scannedRef.current = false;
    setPhase('scanning');
    setResultMessage('');
    setCustomerName(null);
  };

  const handleBarCode = async (event: { nativeEvent: { codeStringValue: string } }) => {
    if (scannedRef.current || phase !== 'scanning') return;
    const token = parseBusinessQrToken(event.nativeEvent.codeStringValue);
    if (!token || !selectedChannelId) return;

    scannedRef.current = true;
    setPhase('submitting');

    try {
      const result = await businessApi.scanSubscription(token, selectedChannelId);
      const label =
        result.user_display_name?.trim() || 'TrustRoute customer';
      setCustomerName(label);

      await appendScanHistory({
        subscription_id: result.subscription_id,
        channel_id: selectedChannelId,
        channel_name: channel?.name ?? 'Channel',
        customer_label: label,
        status: result.status === 'active' ? 'active' : 'pending',
        scanned_at: new Date().toISOString(),
      });

      if (result.already_subscribed || result.status === 'active') {
        setResultMessage('Customer is already subscribed to this channel.');
      } else {
        setResultMessage(
          'Subscription request sent to their TrustRoute app. Waiting for their approval…',
        );
      }
      setPhase('success');
    } catch (e) {
      setPhase('error');
      setResultMessage(getUserFacingError(e, 'Scan failed. Ask the customer to refresh their QR.'));
    }
  };

  if (phase === 'success' || phase === 'error') {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader title="Scan result" onBack={resetScan} />
        <View style={styles.resultWrap}>
          <View
            style={[
              styles.resultIcon,
              phase === 'success' ? styles.resultIconOk : styles.resultIconErr,
            ]}
          >
            <MaterialCommunityIcons
              name={phase === 'success' ? 'check-circle' : 'alert-circle'}
              size={56}
              color={phase === 'success' ? colors.success : colors.error}
            />
          </View>
          {customerName ? (
            <Text style={styles.resultCustomer}>{customerName}</Text>
          ) : null}
          <Text style={styles.resultText}>{resultMessage}</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={resetScan}>
            <Text style={styles.primaryBtnText}>Scan another</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.secondaryBtnText}>Back to home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="Scanning…"
        subtitle={channel?.name}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.cameraWrap}>
        {cameraReady ? (
          <Suspense fallback={<ActivityIndicator color={colors.primary} style={styles.camera} />}>
            <Camera
              style={styles.camera}
              cameraType={CameraType.Back}
              torchMode={torchOn ? 'on' : 'off'}
              scanBarcode
              onReadCode={handleBarCode}
              showFrame={false}
            />
          </Suspense>
        ) : (
          <View style={[styles.camera, styles.placeholder]}>
            <Text style={styles.placeholderText}>Camera permission required</Text>
            <TouchableOpacity
              style={styles.permissionBtn}
              onPress={() => ensureCameraPermission().then(setCameraReady)}
            >
              <Text style={styles.permissionBtnText}>Allow camera</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <View style={styles.overlay}>
            <View style={styles.frame}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
            </View>
          </View>
        </View>

        {phase === 'submitting' ? (
          <View style={styles.submittingOverlay}>
            <ActivityIndicator size="large" color={colors.white} />
            <Text style={styles.submittingText}>Sending request…</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.torchBtn} onPress={() => setTorchOn(!torchOn)}>
          <MaterialCommunityIcons name="flashlight" size={18} color={colors.textSecondary} />
          <Text style={styles.torchLabel}>{torchOn ? 'Light on' : 'Light off'}</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>Customer opens TrustRoute → Business QR (refreshes every 60s)</Text>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (c: ColorScheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    cameraWrap: { flex: 1, marginHorizontal: Spacing.base, borderRadius: BorderRadius.xl, overflow: 'hidden' },
    camera: { flex: 1 },
    placeholder: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surfaceAlt,
      gap: Spacing.md,
    },
    placeholderText: { color: c.textSecondary, fontSize: 14 },
    permissionBtn: {
      backgroundColor: c.primary,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.full,
    },
    permissionBtnText: { color: c.white, fontWeight: '800' },
    overlay: {
      flex: 1,
      backgroundColor: c.overlay,
      alignItems: 'center',
      justifyContent: 'center',
    },
    frame: { width: 240, height: 240 },
    corner: { position: 'absolute', width: 32, height: 32, borderColor: c.primary, borderWidth: 4 },
    cornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
    cornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
    cornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
    cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
    submittingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.65)',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.md,
    },
    submittingText: { color: c.white, fontSize: 16, fontWeight: '700' },
    controls: { padding: Spacing.base, alignItems: 'center', gap: Spacing.sm },
    torchBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
      backgroundColor: c.surface,
      paddingHorizontal: Spacing.base,
      paddingVertical: 8,
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: c.border,
    },
    torchLabel: { fontSize: 13, color: c.textSecondary, fontWeight: '600' },
    hint: { fontSize: 12, color: c.textMuted, textAlign: 'center', paddingHorizontal: Spacing.lg },
    resultWrap: { flex: 1, padding: Spacing.xl, alignItems: 'center', justifyContent: 'center' },
    resultIcon: {
      width: 96,
      height: 96,
      borderRadius: 48,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.lg,
    },
    resultIconOk: { backgroundColor: c.successLight },
    resultIconErr: { backgroundColor: c.errorLight },
    resultCustomer: { fontSize: 20, fontWeight: '800', color: c.textPrimary, marginBottom: Spacing.sm },
    resultText: {
      fontSize: 15,
      color: c.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: Spacing.xl,
    },
    primaryBtn: {
      backgroundColor: c.primary,
      paddingHorizontal: Spacing['2xl'],
      paddingVertical: Spacing.base,
      borderRadius: BorderRadius.full,
      marginBottom: Spacing.md,
    },
    primaryBtnText: { color: c.white, fontWeight: '800', fontSize: 16 },
    secondaryBtn: { padding: Spacing.md },
    secondaryBtnText: { color: c.primary, fontWeight: '700', fontSize: 15 },
  });
