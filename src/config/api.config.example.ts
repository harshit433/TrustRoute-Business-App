/**
 * Copy to api.config.ts and adjust.
 *
 * USB physical device (Mac runs business-api on :3002):
 *   adb reverse tcp:3002 tcp:3002
 *   BUSINESS_API_HOST = 'localhost'
 *
 * Android emulator:
 *   BUSINESS_API_HOST = '10.0.2.2'
 *
 * Production (when business-api is deployed):
 *   BUSINESS_API_HOST = 'hospitable-passion-production-fb2f.up.railway.app'
 *   BUSINESS_API_PORT = 443
 *   BUSINESS_API_HTTPS = true
 */
export const BUSINESS_API_HOST = 'localhost';
export const BUSINESS_API_PORT: number = 3002;
export const BUSINESS_API_HTTPS = false;
