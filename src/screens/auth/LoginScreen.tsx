import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme, useThemedStyles, Spacing, BorderRadius } from '../../theme';
import type { ColorScheme } from '../../theme/palettes';
import { TrustRouteBrand } from '../../components/TrustRouteBrand';
import { useAuthStore } from '../../store/auth.store';
import { getUserFacingError } from '../../utils/errors';

export const LoginScreen: React.FC = () => {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const login = useAuthStore((s) => s.login);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    try {
      await login(apiKey);
    } catch (e) {
      Alert.alert('Sign in failed', getUserFacingError(e, 'Could not verify API key.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.brand}>
          <TrustRouteBrand
            size="lg"
            stacked
            productSuffix="Scan"
            subtitle="Counter app for business subscriptions"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Business API key</Text>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              value={apiKey}
              onChangeText={setApiKey}
              placeholder="tr_live_…"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={!showKey}
              returnKeyType="go"
              onSubmitEditing={() => {
                if (apiKey.trim() && !loading) void onSubmit();
              }}
            />
            <TouchableOpacity onPress={() => setShowKey(!showKey)} style={styles.eyeBtn}>
              <MaterialCommunityIcons
                name={showKey ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.hint}>
            Use the key from your admin-approved business account. It is stored securely on this
            device.
          </Text>

          <TouchableOpacity
            style={[styles.btn, (!apiKey.trim() || loading) && styles.btnDisabled]}
            onPress={onSubmit}
            disabled={!apiKey.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.btnText}>Continue</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (c: ColorScheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    inner: { flex: 1, padding: Spacing.xl, justifyContent: 'center' },
    brand: { alignItems: 'center', marginBottom: Spacing['2xl'] },
    card: {
      backgroundColor: c.surface,
      borderRadius: BorderRadius.xl,
      padding: Spacing.xl,
      borderWidth: 1.5,
      borderColor: c.border,
    },
    label: { fontSize: 13, fontWeight: '700', color: c.textSecondary, marginBottom: Spacing.sm },
    inputWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.inputBackground,
      borderWidth: 1.5,
      borderColor: c.inputBorder,
      borderRadius: BorderRadius.md,
    },
    input: {
      flex: 1,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
      fontSize: 15,
      color: c.textPrimary,
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    eyeBtn: { padding: Spacing.md },
    hint: { fontSize: 12, color: c.textMuted, marginTop: Spacing.sm, lineHeight: 18 },
    btn: {
      marginTop: Spacing.xl,
      backgroundColor: c.primary,
      borderRadius: BorderRadius.full,
      paddingVertical: Spacing.base,
      alignItems: 'center',
    },
    btnDisabled: { opacity: 0.5 },
    btnText: { color: c.white, fontSize: 16, fontWeight: '800' },
  });
