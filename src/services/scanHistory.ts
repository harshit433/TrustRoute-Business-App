import AsyncStorage from '@react-native-async-storage/async-storage';

export type ScanHistoryEntry = {
  id: string;
  subscription_id: string;
  channel_id: string;
  channel_name: string;
  customer_label: string;
  status: 'pending' | 'active' | 'cancelled';
  scanned_at: string;
};

const KEY = '@trustroute_scan/history';

export async function loadScanHistory(): Promise<ScanHistoryEntry[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as ScanHistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function appendScanHistory(entry: Omit<ScanHistoryEntry, 'id'>): Promise<ScanHistoryEntry> {
  const list = await loadScanHistory();
  const row: ScanHistoryEntry = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  };
  const next = [row, ...list].slice(0, 200);
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return row;
}

export async function updateScanHistoryStatus(
  subscriptionId: string,
  status: ScanHistoryEntry['status'],
): Promise<void> {
  const list = await loadScanHistory();
  const next = list.map((e) =>
    e.subscription_id === subscriptionId ? { ...e, status } : e,
  );
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}

export function todayHistory(entries: ScanHistoryEntry[]): ScanHistoryEntry[] {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return entries.filter((e) => new Date(e.scanned_at) >= start);
}
