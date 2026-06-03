import axios from 'axios';

export function getUserFacingError(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const body = err.response?.data as { error?: { message?: string } } | undefined;
    const msg = body?.error?.message;
    if (typeof msg === 'string' && msg.length > 0) return msg;
    if (err.response?.status === 401) return 'Invalid API key or business not verified.';
    if (err.response?.status === 429) return 'Rate limit exceeded. Wait a minute and try again.';
    if (err.message && err.message !== 'Network Error') return err.message;
    return `Cannot reach server. Check network and API URL.`;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}
