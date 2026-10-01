import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScannedCard } from './nfc/nfcTypes';

const HISTORY_KEY = '@nfc_tooling_scan_history_v1';

export async function getScanHistory(): Promise<ScannedCard[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to load scan history', err);
    return [];
  }
}

export async function saveScanToHistory(card: ScannedCard): Promise<ScannedCard[]> {
  try {
    const existing = await getScanHistory();
    // Keep max 50 items, newest first
    const updated = [card, ...existing.filter(c => c.uid !== card.uid || c.id !== card.id)].slice(0, 50);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Failed to save to history', err);
    return [];
  }
}

export async function clearScanHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (err) {
    console.warn('Failed to clear history', err);
  }
}
