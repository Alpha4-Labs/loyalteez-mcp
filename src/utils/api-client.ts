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
   * Get event configuration (GET /loyalteez-api/event-config)
   */
  async getEventConfig(params: {
    brandId: string;
  }): Promise<{
    success: boolean;
    brandId: string;
    events: Array<{
      eventId: string;
      eventType: string;
      rewardAmount: number;
      maxClaims: number;
      cooldownHours: number;
      detectionMethod: string;
      detectionConfig?: object;
      isCustom: boolean;
    }>;
    count: number;
  }> {
    const url = `${this.getBaseUrl('eventHandler')}/loyalteez-api/event-config?brandId=${params.brandId}`;
    return this.request(url, {
      method: 'GET',
    });
  }

  /**
   * Bulk events (POST /loyalteez-api/bulk-events)
   */
  async bulkEvents(params: {
    events: Array<{
      brandId: string;
      eventType: string;
      userEmail: string;
      domain?: string;
      sourceUrl?: string;
      metadata?: Record<string, unknown>;
    }>;
  }): Promise<{
    success: boolean;
    processed: number;
    failed: number;
    results: Array<{
      success: boolean;
      eventId?: string;
      error?: string;
    }>;
  }> {
    const url = `${this.getBaseUrl('eventHandler')}/loyalteez-api/bulk-events`;
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
   * Get user balance (may require new API endpoint)
   */
  async getUserBalance(params: {
    brandId: string;
    userEmail: string;
    includeHistory?: boolean;
    historyLimit?: number;
  }): Promise<{
    balance: number;
    walletAddress: string;
    history?: Array<{
      transactionHash: string;
      eventType: string;
      amount: number;
      timestamp: string;
    }>;
  }> {
    // Note: This may require a new API endpoint
    // For now, return placeholder structure
    const url = `${this.getBaseUrl('eventHandler')}/loyalteez-api/user-balance`;
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Check eligibility (may require new API endpoint)
   */
  async checkEligibility(params: {
    brandId: string;
    eventType: string;
    userEmail: string;
  }): Promise<{
    eligible: boolean;
    reason?: string;
    cooldownEndsAt?: string;
    claimCount: number;
    maxClaims: number;
    rewardAmount: number;
  }> {
    // Note: This may require a new API endpoint
    const url = `${this.getBaseUrl('eventHandler')}/loyalteez-api/check-eligibility`;
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Get user stats (aggregates from multiple services)
   */
  async getUserStats(params: {
    brandId: string;
    userIdentifier: string;
    platform: string;
  }): Promise<{
    balance: number;
    lifetime: {
      earned: number;
      spent: number;
      claims: number;
    };
    streak: {
      current: number;
      longest: number;
    };
    activity: {
      messages: number;
      voiceMinutes: number;
      reactions: number;
    };
    rank: {
      server: number;
      global: number;
    };
  }> {
    // Aggregate from multiple services
    const url = `${this.getBaseUrl('services')}/user-stats/${params.brandId}/${params.userIdentifier}`;
    return this.request(url, {
      method: 'GET',
    });
  }

  /**
   * Relay transaction (POST /relay)
   */
  async relayTransaction(params: {
    privyAccessToken: string;
    to: string;
    data: string;
    userAddress: string;
    gasLimit?: number;
    permit?: {
      owner: string;
      spender: string;
      value: string;
      deadline: number;
      v: number;
      r: string;
      s: string;
    };
  }): Promise<{
    success: boolean;
    transactionHash: string;
    gasUsed: number;
  }> {
    const gasRelayerUrl = this.network === 'mainnet' 
      ? 'https://relayer.loyalteez.app'
      : 'https://relayer.loyalteez.xyz';
    
    const url = `${gasRelayerUrl}/relay`;
    return this.request(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${params.privyAccessToken}`,
      },
      body: JSON.stringify({
        to: params.to,
        data: params.data,
        userAddress: params.userAddress,
        gasLimit: params.gasLimit,
        permit: params.permit,
      }),
    });
  }

  /**
   * Get streak status (GET /streak/status/:brandId/:userIdentifier)
   */
  async getStreakStatus(params: {
    brandId: string;
    userIdentifier: string;
    streakType?: string;
  }): Promise<{
    currentStreak: number;
    longestStreak: number;
    multiplier: number;
    nextMilestone?: { days: number; bonus: number };
    daysToNextMilestone?: number;
    unclaimedMilestones: Array<{ days: number; bonus: number }>;
    checkedInToday: boolean;
    lastActivityAt: string;
  }> {
    const url = `${this.getBaseUrl('services')}/streak/status/${params.brandId}/${encodeURIComponent(params.userIdentifier)}?streakType=${params.streakType || 'daily'}`;
    return this.request(url, {
      method: 'GET',
    });
  }

  /**
   * Claim streak milestone (POST /streak/claim-milestone)
   */
  async claimStreakMilestone(params: {
    brandId: string;
    userIdentifier: string;
    platform: string;
    milestoneDays: number;
    streakType?: string;
  }): Promise<{
    success: boolean;
    bonus: number;
    milestone: number;
  }> {
    const url = `${this.getBaseUrl('services')}/streak/claim-milestone`;
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Log activity (may require new API endpoint)
   */
  async logActivity(params: {
    brandId: string;
    userIdentifier: string;
    platform: string;
    activityType: 'voice' | 'message' | 'reaction' | 'presence';
    durationMinutes?: number;
    count?: number;
  }): Promise<{
    rewardEarned: number;
    dailyProgress: number;
    dailyCap: number;
    nextRewardIn: number;
    capReached: boolean;
  }> {
    const url = `${this.getBaseUrl('services')}/activity/log`;
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Calculate reward (may be client-side or API call)
   */
  async calculateReward(params: {
    brandId: string;
    userIdentifier: string;
    platform: string;
    baseReward: number;
    eventType: string;
    roles?: string[];
  }): Promise<{
    finalReward: number;
    breakdown: {
      base: number;
      streakMultiplier: number;
      roleMultiplier: number;
      flatBonus: number;
    };
  }> {
    const url = `${this.getBaseUrl('services')}/reward/calculate`;
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Update leaderboard stats (POST /leaderboard/update-stats)
   */
  async updateLeaderboardStats(params: {
    brandId: string;
    userIdentifier: string;
    platform: string;
    ltzAmount: number;
    claimType?: string;
    displayName?: string;
  }): Promise<{
    success: boolean;
    updated: boolean;
  }> {
    const url = `${this.getBaseUrl('services')}/leaderboard/update-stats`;
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Create drop (POST /drops/create)
   */
  async createDrop(params: {
    brandId: string;
    platform: string;
    serverId: string;
    eventType: string;
    reward: number;
    maxClaims: number;
    expiresInSeconds: number;
    triggerType?: string;
    triggerEmoji?: string;
    metadata?: Record<string, unknown>;
  }): Promise<{
    dropId: string;
    claimUrl: string;
    embedData: {
      title: string;
      description: string;
      color: string;
    };
    expiresAt: string;
  }> {
    const url = `${this.getBaseUrl('services')}/drops/create`;
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Claim drop (POST /drops/claim)
   */
  async claimDrop(params: {
    dropId: string;
    platformUserId: string;
    platform: string;
  }): Promise<{
    success: boolean;
    reward: number;
    remainingClaims: number;
    position: number;
    alreadyClaimed: boolean;
  }> {
    const url = `${this.getBaseUrl('services')}/drops/claim`;
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Process third-party event (POST /integrations/process)
   */
  async processThirdPartyEvent(params: {
    brandId: string;
    platform: string;
    sourceBot: string;
    eventType: string;
    targetUserId: string;
    level?: number;
    achievement?: string;
    rawMessage?: string;
    metadata?: Record<string, unknown>;
  }): Promise<{
    processed: boolean;
    reward: number;
    eventTriggered: string;
    message: string;
  }> {
    const url = `${this.getBaseUrl('services')}/integrations/process`;
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Get perks (GET /perks/:brandId)
   */
  async getPerks(params: {
    brandId: string;
    activeOnly?: boolean;
    category?: string;
    userAddress?: string;
  }): Promise<{
    success: boolean;
    perks: Array<{
      id: string;
      name: string;
      description: string;
      cost: number;
      available: number;
      category: string;
      metadata: Record<string, unknown>;
    }>;
  }> {
    const queryParams = new URLSearchParams();
    if (params.activeOnly !== undefined) queryParams.append('activeOnly', String(params.activeOnly));
    if (params.category) queryParams.append('category', params.category);
    if (params.userAddress) queryParams.append('userAddress', params.userAddress);
    
    const url = `${this.getBaseUrl('services')}/perks/${params.brandId}?${queryParams}`;
    return this.request(url, {
      method: 'GET',
    });
  }

  /**
   * Check perk eligibility (POST /perks/check-eligibility)
   */
  async checkPerkEligibility(params: {
    brandId: string;
    userIdentifier: string;
    platform: string;
    perkId: string;
  }): Promise<{
    eligible: boolean;
    reason?: string;
    userBalance: number;
    perkCost: number;
    missingAmount?: number;
  }> {
    const url = `${this.getBaseUrl('services')}/perks/check-eligibility`;
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Redeem perk (POST /perks/redeem)
   */
  async redeemPerk(params: {
    brandId: string;
    userIdentifier: string;
    platform: string;
    perkId: string;
  }): Promise<{
    success: boolean;
    perk: { id: string; name: string };
    redemptionId: string;
    confirmationCode: string;
  }> {
    const url = `${this.getBaseUrl('services')}/perks/redeem`;
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Get user achievements (GET /achievements/:brandId/:userIdentifier)
   */
  async getUserAchievements(params: {
    brandId: string;
    userIdentifier: string;
  }): Promise<{
    success: boolean;
    achievements: Array<{
      achievementType: string;
      currentProgress: number;
      isUnlocked: boolean;
      unlockedAt?: string;
    }>;
  }> {
    const url = `${this.getBaseUrl('services')}/achievements/${params.brandId}/${encodeURIComponent(params.userIdentifier)}`;
    return this.request(url, {
      method: 'GET',
    });
  }

  /**
   * Update achievement progress (POST /achievements/update-progress)
   */
  async updateAchievementProgress(params: {
    brandId: string;
    userIdentifier: string;
    platform: string;
    achievementType: string;
    newValue: number;
    increment?: boolean;
  }): Promise<{
    success: boolean;
    unlocked: Array<{ achievementType: string; threshold: number; progress: number }>;
    currentProgress: number;
    isUnlocked: boolean;
  }> {
    const url = `${this.getBaseUrl('services')}/achievements/update-progress`;
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(params),
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
