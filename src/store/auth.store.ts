import { create } from 'zustand';
import { businessApi, type BusinessProfile } from '../api/business.api';
import { clearApiKey, loadApiKey, saveApiKey } from '../services/secureStorage';

type AuthState = {
  apiKey: string | null;
  profile: BusinessProfile | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  bootstrap: () => Promise<void>;
  login: (apiKey: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  apiKey: null,
  profile: null,
  isAuthenticated: false,
  isBootstrapping: true,

  bootstrap: async () => {
    try {
      const stored = await loadApiKey();
      if (!stored) {
        set({ isBootstrapping: false });
        return;
      }
      set({ apiKey: stored });
      const profile = await businessApi.getMe();
      set({ profile, isAuthenticated: true, isBootstrapping: false });
    } catch {
      await clearApiKey();
      set({
        apiKey: null,
        profile: null,
        isAuthenticated: false,
        isBootstrapping: false,
      });
    }
  },

  login: async (apiKey: string) => {
    const trimmed = apiKey.trim();
    if (trimmed.length < 16) {
      throw new Error('Enter a valid API key from your TrustRoute Business dashboard.');
    }
    set({ apiKey: trimmed });
    try {
      const profile = await businessApi.getMe();
      await saveApiKey(trimmed);
      set({ profile, isAuthenticated: true });
    } catch (e) {
      set({ apiKey: null, profile: null, isAuthenticated: false });
      throw e;
    }
  },

  logout: async () => {
    await clearApiKey();
    set({ apiKey: null, profile: null, isAuthenticated: false });
  },

  refreshProfile: async () => {
    if (!get().apiKey) return;
    const profile = await businessApi.getMe();
    set({ profile });
  },
}));
