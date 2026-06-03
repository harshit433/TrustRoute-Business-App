import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@trustroute_scan/selected_channel';

export async function getSelectedChannelId(): Promise<string | null> {
  return AsyncStorage.getItem(KEY);
}

export async function setSelectedChannelId(channelId: string): Promise<void> {
  await AsyncStorage.setItem(KEY, channelId);
}
