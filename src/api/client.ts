import axios, { AxiosInstance } from 'axios';
import {
  BUSINESS_API_HOST,
  BUSINESS_API_HTTPS,
  BUSINESS_API_PORT,
} from '../config/api.config';
import { useAuthStore } from '../store/auth.store';

const protocol = BUSINESS_API_HTTPS ? 'https' : 'http';
const portSuffix =
  (BUSINESS_API_HTTPS && BUSINESS_API_PORT === 443) ||
  (!BUSINESS_API_HTTPS && BUSINESS_API_PORT === 80)
    ? ''
    : `:${BUSINESS_API_PORT}`;

export const BUSINESS_API_URL = `${protocol}://${BUSINESS_API_HOST}${portSuffix}`;

const businessClient: AxiosInstance = axios.create({
  baseURL: BUSINESS_API_URL,
  timeout: 20_000,
  headers: { 'Content-Type': 'application/json' },
});

businessClient.interceptors.request.use((config) => {
  const key = useAuthStore.getState().apiKey;
  if (key) {
    config.headers['x-api-key'] = key;
  }
  return config;
});

export default businessClient;

export type ApiEnvelope<T> = { ok: boolean; data: T };
