/**
 * Business API — separate service from consumer API (port 3002 in dev).
 * Local: set BUSINESS_API_PORT = 3002 and BUSINESS_API_HTTPS = false, host 10.0.2.2 (emulator) or LAN IP.
 */
/** USB device: adb reverse tcp:3002 tcp:3002 → use localhost */
export const BUSINESS_API_HOST = 'localhost';
export const BUSINESS_API_PORT: number = 3002;
export const BUSINESS_API_HTTPS = false;

// Production (uncomment when business-api is deployed):
// export const BUSINESS_API_HOST = 'your-business-api.up.railway.app';
// export const BUSINESS_API_PORT = 443;
// export const BUSINESS_API_HTTPS = true;
