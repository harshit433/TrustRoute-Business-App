import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ScannerScreen } from '../screens/scanner/ScannerScreen';
import { ChannelSelectorScreen } from '../screens/channels/ChannelSelectorScreen';
import { ScanHistoryScreen } from '../screens/history/ScanHistoryScreen';
import type { RootStackParamList } from './types';
import { useTheme } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const MainNavigator: React.FC = () => {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Scanner" component={ScannerScreen} />
      <Stack.Screen name="ChannelSelector" component={ChannelSelectorScreen} />
      <Stack.Screen name="ScanHistory" component={ScanHistoryScreen} />
    </Stack.Navigator>
  );
};
