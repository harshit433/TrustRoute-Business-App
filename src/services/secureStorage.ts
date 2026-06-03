import * as Keychain from 'react-native-keychain';

const SERVICE = 'com.trustroute.scan.apikey';

export async function saveApiKey(apiKey: string): Promise<void> {
  await Keychain.setGenericPassword('api_key', apiKey, {
    service: SERVICE,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

export async function loadApiKey(): Promise<string | null> {
  const creds = await Keychain.getGenericPassword({ service: SERVICE });
  if (!creds) return null;
  return creds.password;
}

export async function clearApiKey(): Promise<void> {
  await Keychain.resetGenericPassword({ service: SERVICE });
}
