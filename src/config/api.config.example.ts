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
 * Production (default in api.config.ts — business routes on consumer API):
 *   LOCAL_BUSINESS_API = false
 */
export const LOCAL_BUSINESS_API = false;
export const BUSINESS_API_HOST = 'hospitable-passion-production-fb2f.up.railway.app';
export const BUSINESS_API_PORT = 443;
export const BUSINESS_API_HTTPS = true;
