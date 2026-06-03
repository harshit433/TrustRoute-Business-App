/**
 * Business API — same routes as backend/business-api, served on the consumer API in production.
 *
 * Local USB device (business-api on :3002):
 *   adb reverse tcp:3002 tcp:3002
 *   Set LOCAL_BUSINESS_API = true
 *
 * Android emulator: LOCAL_BUSINESS_API + host 10.0.2.2 (see api.config.example.ts)
 */
import { Platform } from 'react-native';

/** Same Railway host as mobile / business-dashboard (consumer API + business routes). */
const PROD_HOST = 'hospitable-passion-production-fb2f.up.railway.app';

/** Flip to true only when running backend business-api locally with adb reverse. */
export const LOCAL_BUSINESS_API = false;

const localHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const BUSINESS_API_HOST = LOCAL_BUSINESS_API ? localHost : PROD_HOST;
export const BUSINESS_API_PORT: number = LOCAL_BUSINESS_API ? 3002 : 443;
export const BUSINESS_API_HTTPS = !LOCAL_BUSINESS_API;
