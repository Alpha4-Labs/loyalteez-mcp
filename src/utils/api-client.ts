/**
 * HTTP client for Loyalteez API endpoints
 * Supports both mainnet and testnet environments
 */

import type { NetworkConfig } from '../types/index.js';

const API_BASE_URLS: NetworkConfig = {
  mainnet: {
    eventHandler: 'https://api.loyalteez.app',
    services: 'https://services.loyalteez.app',
    pregen: 'https://register.loyalteez.app',
  },
  testnet: {
    eventHandler: 'https://api.loyalteez.xyz',
    services: 'https://services.loyalteez.xyz',
    pregen: 'https://register.loyalteez.xyz',
  },
};

export type Network = 'mainnet' | 'testnet';

export class LoyalteezAPIClient {
  private network: Network;

  constructor(network: Network = 'mainnet') {
    this.network = network;
  }

  /**
   * Get base URL for a service
   */
  private getBaseUrl(service: 'eventHandler' | 'services' | 'pregen'): string {
    return API_BASE_URLS[this.network][service];
  }

  /**
   * Make HTTP request with error handling
   */
  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as Record<string, unknown>;
        const errorMessage = 
          (typeof errorData.error === 'string' ? errorData.error : null) ||
          (typeof errorData.message === 'string' ? errorData.message : null) ||
          `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Request failed: ${String(error)}`);
    }
  }

  /**
   * Track an event (POST /loyalteez-api/manual-event)
   */
  async trackEvent(params: {
    brandId: string;
    eventType: string;
    userEmail?: string;
    userIdentifier?: string;
    domain?: string;
    sourceUrl?: string;
    metadata?: Record<string, unknown>;
  }): Promise<{
    success: boolean;
    eventId: string;
    message: string;
    rewardAmount: number;
    eventType: string;
    walletAddress?: string;
    transactionHash?: string;
  }> {
    const url = `${this.getBaseUrl('eventHandler')}/loyalteez-api/manual-event`;
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Record streak activity (POST /streak/record-activity)
   */
  async recordStreakActivity(params: {
    brandId: string;
    userIdentifier: string;
    platform: string;
    streakType?: string;
  }): Promise<{
    success: boolean;
    streak: {
      current: number;
      longest: number;
      multiplier: number;
      graceUsed: boolean;
    };
    reward: {
      base: number;
      final: number;
      milestone?: number;
    };
    nextMilestone?: {
      days: number;
      bonus: number;
    };
  }> {
    const url = `${this.getBaseUrl('services')}/streak/record-activity`;
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Get leaderboard (GET /leaderboard/:brandId)
   */
  async getLeaderboard(params: {
    brandId: string;
    metric?: string;
    period?: string;
    platform?: string;
    limit?: number;
  }): Promise<{
    success: boolean;
    rankings: Array<{
      rank: number;
      userId: string;
      username: string;
      value: number;
      change: number;
    }>;
    userRank?: {
      rank: number;
      userId: string;
      username: string;
      value: number;
      change: number;
    };
  }> {
    const { brandId, metric = 'ltz_earned', period = 'all_time', platform, limit = 10 } = params;
    const queryParams = new URLSearchParams({
      metric,
      period,
      ...(platform && { platform }),
      limit: limit.toString(),
    });
    const url = `${this.getBaseUrl('services')}/leaderboard/${brandId}?${queryParams}`;
    return this.request(url, {
      method: 'GET',
    });
  }

  /**
   * Pregenerate user wallet (POST /loyalteez-api/pregenerate-user)
   */
  async pregenerateUser(params: {
    brand_id: string;
    oauth_provider: string;
    oauth_user_id: string;
    oauth_username?: string;
  }): Promise<{
    wallet_address: string;
    created_new: boolean;
  }> {
    const url = `${this.getBaseUrl('pregen')}/loyalteez-api/pregenerate-user`;
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{
    status: string;
    timestamp: string;
    services?: Record<string, string>;
  }> {
    const url = `${this.getBaseUrl('eventHandler')}/loyalteez-api/health`;
    return this.request(url, {
      method: 'GET',
    });
  }

  /**
   * Set network (mainnet or testnet)
   */
  setNetwork(network: Network): void {
    this.network = network;
  }

  /**
   * Get current network
   */
  getNetwork(): Network {
    return this.network;
  }
}
