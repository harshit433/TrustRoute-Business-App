import businessClient, { type ApiEnvelope } from './client';

export type BusinessProfile = {
  business_id: string;
  name: string;
  status: string;
  plan: string;
  usage?: {
    channels: number;
    active_subscribers: number;
    messages_sent_today: number;
  };
  limits?: {
    maxChannels: number;
    maxSubscribers: number;
    maxMessagesPerDay: number;
  };
};

export type BusinessChannel = {
  channel_id: string;
  name: string;
  channel_type: string;
  daily_limit_per_subscriber: number;
  active: boolean;
  subscriber_count?: number;
};

export type ScanResult = {
  subscription_id: string;
  status: 'pending' | 'active';
  already_subscribed?: boolean;
  user_display_name?: string | null;
};

export type SubscriptionRow = {
  subscription_id: string;
  user_id: string;
  channel_id: string;
  status: string;
  subscribed_at: string | null;
  created_at: string;
  handle?: string | null;
  display_name?: string | null;
  channel_name?: string;
};

export const businessApi = {
  async getMe(): Promise<BusinessProfile> {
    const { data } = await businessClient.get<ApiEnvelope<BusinessProfile>>('/me');
    return data.data;
  },

  async listChannels(): Promise<BusinessChannel[]> {
    const { data } = await businessClient.get<ApiEnvelope<BusinessChannel[]>>('/channels');
    return data.data;
  },

  async scanSubscription(token: string, channelId: string): Promise<ScanResult> {
    const { data } = await businessClient.post<ApiEnvelope<ScanResult>>('/subscriptions/scan', {
      token,
      channel_id: channelId,
    });
    return data.data;
  },

  async listSubscriptions(params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<SubscriptionRow[]> {
    const { data } = await businessClient.get<ApiEnvelope<SubscriptionRow[]>>('/subscriptions', {
      params,
    });
    return data.data;
  },
};
