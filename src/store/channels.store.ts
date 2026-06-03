import { create } from 'zustand';
import { businessApi, type BusinessChannel } from '../api/business.api';
import { getSelectedChannelId, setSelectedChannelId } from '../services/channelPrefs';

type ChannelsState = {
  channels: BusinessChannel[];
  selectedChannelId: string | null;
  loading: boolean;
  load: () => Promise<void>;
  selectChannel: (channelId: string) => Promise<void>;
  selectedChannel: () => BusinessChannel | null;
};

export const useChannelsStore = create<ChannelsState>((set, get) => ({
  channels: [],
  selectedChannelId: null,
  loading: false,

  load: async () => {
    set({ loading: true });
    try {
      const channels = await businessApi.listChannels();
      let selected = await getSelectedChannelId();
      if (!selected || !channels.some((c) => c.channel_id === selected)) {
        selected = channels.find((c) => c.active)?.channel_id ?? channels[0]?.channel_id ?? null;
        if (selected) await setSelectedChannelId(selected);
      }
      set({ channels, selectedChannelId: selected, loading: false });
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  selectChannel: async (channelId: string) => {
    await setSelectedChannelId(channelId);
    set({ selectedChannelId: channelId });
  },

  selectedChannel: () => {
    const { channels, selectedChannelId } = get();
    return channels.find((c) => c.channel_id === selectedChannelId) ?? null;
  },
}));
