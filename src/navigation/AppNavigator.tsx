import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet, StatusBar } from 'react-native';
import { useAuthStore } from '../store/auth.store';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { MainNavigator } from './RootNavigator';
import { useTheme } from '../theme';
import { TrustRouteBrand } from '../components/TrustRouteBrand';

export const AppNavigator: React.FC = () => {
  const { colors } = useTheme();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isBootstrapping = useAuthStore((s) => s.isBootstrapping);
  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  if (isBootstrapping) {
    return (
      <View style={[styles.boot, { backgroundColor: colors.background }]}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <TrustRouteBrand size="md" stacked productSuffix="Scan" hideSubtitle />
        <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return <MainNavigator />;
};

const styles = StyleSheet.create({
  boot: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 24 },
  spinner: { marginTop: 8 },
});
