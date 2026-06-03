import axios from 'axios';
import {
  BUSINESS_API_HOST,
  BUSINESS_API_HTTPS,
  BUSINESS_API_PORT,
  LOCAL_BUSINESS_API,
} from '../config/api.config';

export function getBusinessApiOrigin(): string {
  const protocol = BUSINESS_API_HTTPS ? 'https' : 'http';
  const defaultPort = BUSINESS_API_HTTPS ? 443 : 80;
  const portSuffix = BUSINESS_API_PORT === defaultPort ? '' : `:${BUSINESS_API_PORT}`;
  return `${protocol}://${BUSINESS_API_HOST}${portSuffix}`;
}

export function getUserFacingError(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const body = err.response?.data as { error?: { message?: string } } | undefined;
    const msg = body?.error?.message;
    if (typeof msg === 'string' && /access token/i.test(msg)) {
      return 'Server routed this request to the wrong API. Redeploy the latest consumer API (business route fix).';
    }
    if (typeof msg === 'string' && msg.length > 0) return msg;
    if (err.response?.status === 401) return 'Invalid API key or business not verified.';
    if (err.response?.status === 429) return 'Rate limit exceeded. Wait a minute and try again.';
    if (err.message && err.message !== 'Network Error') return err.message;
    const origin = getBusinessApiOrigin();
    const localHint = LOCAL_BUSINESS_API
      ? ' For USB dev, run business-api and: adb reverse tcp:3002 tcp:3002.'
      : '';
    return `Cannot reach server at ${origin}.${localHint} Redeploy the API if you just updated the backend.`;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}
