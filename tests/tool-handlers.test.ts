/**
 * Integration tests for tool handlers
 * These tests verify that tool handlers properly call the API client with correct parameters
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoyalteezAPIClient } from '../src/utils/api-client.js';
import { handleTrackEvent, handleCreateEvent } from '../src/tools/events.js';
import { handleResolveUser } from '../src/tools/identity.js';
import { handleStreakCheckin, handleGetLeaderboard } from '../src/tools/engagement.js';
import { handleGetUserBalance, handleCheckEligibility } from '../src/tools/user.js';
import { handleRelayTransaction } from '../src/tools/transactions.js';
import { handleCreateDrop, handleClaimDrop } from '../src/tools/drops.js';
import { handleProcessThirdPartyEvent } from '../src/tools/integrations.js';
import { handleListPerks, handleCheckPerkEligibility, handleRedeemPerk } from '../src/tools/perks.js';
import { handleGetUserAchievements, handleUpdateAchievementProgress } from '../src/tools/achievements.js';
import { handleGetEventConfig, handleBulkEvents } from '../src/tools/events.js';
import { handleGetStreakStatus, handleClaimStreakMilestone, handleLogActivity, handleCalculateReward, handleUpdateLeaderboardStats } from '../src/tools/engagement.js';

describe('Tool Handler Integration Tests', () => {
  let apiClient: LoyalteezAPIClient;
  const testBrandId = '0x1234567890123456789012345678901234567890';

  beforeEach(() => {
    apiClient = new LoyalteezAPIClient('mainnet');
    // Mock all API client methods
    vi.spyOn(apiClient, 'trackEvent').mockResolvedValue({
      success: true,
      rewardAmount: 100,
      eventId: 'event_123',
      walletAddress: '0xwallet',
      transactionHash: '0xtxhash',
    });
    vi.spyOn(apiClient, 'getEventConfig').mockResolvedValue({
      events: [],
    });
    vi.spyOn(apiClient, 'bulkEvents').mockResolvedValue({
      results: [],
    });
    vi.spyOn(apiClient, 'pregenerateUser').mockResolvedValue({
      email: 'test@loyalteez.app',
      walletAddress: '0xwallet',
    });
    vi.spyOn(apiClient, 'recordStreakActivity').mockResolvedValue({
      success: true,
      currentStreak: 5,
      multiplier: 1.2,
      reward: 60,
    });
    vi.spyOn(apiClient, 'getLeaderboard').mockResolvedValue({
      leaderboard: [],
    });
    vi.spyOn(apiClient, 'getUserBalance').mockResolvedValue({
      balance: 1000,
      walletAddress: '0xwallet',
      transactions: [],
    });
    vi.spyOn(apiClient, 'checkEligibility').mockResolvedValue({
      eligible: true,
      reason: 'User can claim',
    });
    vi.spyOn(apiClient, 'relayTransaction').mockResolvedValue({
      transactionHash: '0xtxhash',
    });
    vi.spyOn(apiClient, 'getStreakStatus').mockResolvedValue({
      currentStreak: 5,
      longestStreak: 10,
      lastCheckIn: new Date().toISOString(),
    });
    vi.spyOn(apiClient, 'claimStreakMilestone').mockResolvedValue({
      success: true,
      reward: 500,
    });
    vi.spyOn(apiClient, 'logActivity').mockResolvedValue({
      success: true,
      reward: 10,
    });
    vi.spyOn(apiClient, 'calculateReward').mockResolvedValue({
      finalReward: 120,
      multipliers: [],
    });
    vi.spyOn(apiClient, 'updateLeaderboardStats').mockResolvedValue({
      success: true,
    });
    vi.spyOn(apiClient, 'createDrop').mockResolvedValue({
      dropId: 'drop_123',
      claimUrl: 'https://claim.url',
    });
    vi.spyOn(apiClient, 'claimDrop').mockResolvedValue({
      success: true,
      reward: 50,
    });
    vi.spyOn(apiClient, 'processThirdPartyEvent').mockResolvedValue({
      success: true,
      reward: 25,
    });
    vi.spyOn(apiClient, 'getPerks').mockResolvedValue({
      perks: [],
    });
    vi.spyOn(apiClient, 'checkPerkEligibility').mockResolvedValue({
      eligible: true,
    });
    vi.spyOn(apiClient, 'redeemPerk').mockResolvedValue({
      success: true,
      transactionHash: '0xtxhash',
    });
    vi.spyOn(apiClient, 'getUserAchievements').mockResolvedValue({
      achievements: [],
    });
    vi.spyOn(apiClient, 'updateAchievementProgress').mockResolvedValue({
      success: true,
    });
  });

  describe('Event Tools', () => {
    it('should call trackEvent with correct parameters', async () => {
      const args = {
        brandId: testBrandId,
        eventType: 'daily_checkin',
        userIdentifier: { email: 'user@example.com' },
      };

      await handleTrackEvent(apiClient, args);

      expect(apiClient.trackEvent).toHaveBeenCalledWith({
        brandId: testBrandId.toLowerCase(),
        eventType: 'daily_checkin',
        userEmail: 'user@example.com',
        userIdentifier: 'user@example.com',
        metadata: undefined,
      });
    });

    it('should resolve platform user identifier correctly', async () => {
      const args = {
        brandId: testBrandId,
        eventType: 'helpful_answer',
        userIdentifier: {
          platform: 'discord',
          platformUserId: '123456789',
        },
      };

      await handleTrackEvent(apiClient, args);

      expect(apiClient.trackEvent).toHaveBeenCalledWith({
        brandId: testBrandId.toLowerCase(),
        eventType: 'helpful_answer',
        userEmail: 'discord_123456789@loyalteez.app',
        userIdentifier: 'discord_123456789@loyalteez.app',
        metadata: undefined,
      });
    });

    it('should use default brandId when not provided', async () => {
      process.env.LOYALTEEZ_BRAND_ID = testBrandId;
      
      const args = {
        eventType: 'daily_checkin',
        userIdentifier: { email: 'user@example.com' },
      };

      await handleTrackEvent(apiClient, args);

      expect(apiClient.trackEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          brandId: testBrandId.toLowerCase(),
        })
      );

      delete process.env.LOYALTEEZ_BRAND_ID;
    });

    it('should call getEventConfig with brandId', async () => {
      const args = { brandId: testBrandId };

      await handleGetEventConfig(apiClient, args);

      expect(apiClient.getEventConfig).toHaveBeenCalledWith({
        brandId: testBrandId.toLowerCase(),
      });
    });

    it('should call bulkEvents with correct structure', async () => {
      const args = {
        events: [
          {
            brandId: testBrandId,
            eventType: 'daily_checkin',
            userEmail: 'user1@example.com',
          },
          {
            brandId: testBrandId,
            eventType: 'helpful_answer',
            userEmail: 'user2@example.com',
          },
        ],
      };

      await handleBulkEvents(apiClient, args);

      expect(apiClient.bulkEvents).toHaveBeenCalledWith({
        events: expect.arrayContaining([
          expect.objectContaining({
            eventType: 'daily_checkin',
            brandId: testBrandId.toLowerCase(),
          }),
          expect.objectContaining({
            eventType: 'helpful_answer',
            brandId: testBrandId.toLowerCase(),
          }),
        ]),
      });
    });
  });

  describe('Identity Tools', () => {
    it('should call pregenerateUser with correct parameters', async () => {
      const args = {
        brandId: testBrandId,
        platform: 'discord',
        platformUserId: '123456789',
        platformUsername: 'testuser',
      };

      await handleResolveUser(apiClient, args, testBrandId);

      expect(apiClient.pregenerateUser).toHaveBeenCalledWith({
        brand_id: testBrandId.toLowerCase(),
        oauth_provider: 'discord',
        oauth_user_id: '123456789',
        oauth_username: 'testuser',
      });
    });
  });

  describe('Engagement Tools', () => {
    it('should call recordStreakActivity with correct parameters', async () => {
      const args = {
        brandId: testBrandId,
        userId: '123456789',
        platform: 'discord',
      };

      await handleStreakCheckin(apiClient, args, testBrandId);

      expect(apiClient.recordStreakActivity).toHaveBeenCalledWith({
        brandId: testBrandId.toLowerCase(),
        userIdentifier: 'discord_123456789@loyalteez.app',
        platform: 'discord',
        streakType: 'daily',
      });
    });

    it('should call getLeaderboard with correct parameters', async () => {
      const args = {
        brandId: testBrandId,
        metric: 'ltz_earned',
        period: 'weekly',
        limit: 10,
      };

      await handleGetLeaderboard(apiClient, args, testBrandId);

      expect(apiClient.getLeaderboard).toHaveBeenCalledWith({
        brandId: testBrandId.toLowerCase(),
        metric: 'ltz_earned',
        period: 'weekly',
        limit: 10,
      });
    });

    it('should call getStreakStatus with correct parameters', async () => {
      const args = {
        brandId: testBrandId,
        userIdentifier: 'user@example.com',
        streakType: 'daily',
      };

      await handleGetStreakStatus(apiClient, args, testBrandId);

      expect(apiClient.getStreakStatus).toHaveBeenCalledWith({
        brandId: testBrandId.toLowerCase(),
        userIdentifier: 'user@example.com',
        streakType: 'daily',
      });
    });

    it('should call claimStreakMilestone with correct parameters', async () => {
      const args = {
        brandId: testBrandId,
        userIdentifier: 'user@example.com',
        platform: 'discord',
        milestoneDays: 7,
        streakType: 'daily',
      };

      await handleClaimStreakMilestone(apiClient, args, testBrandId);

      expect(apiClient.claimStreakMilestone).toHaveBeenCalledWith({
        brandId: testBrandId.toLowerCase(),
        userIdentifier: 'user@example.com',
        platform: 'discord',
        milestoneDays: 7,
        streakType: 'daily',
      });
    });

    it('should call logActivity with correct parameters', async () => {
      const args = {
        brandId: testBrandId,
        userIdentifier: 'user@example.com',
        platform: 'discord',
        activityType: 'voice',
        durationMinutes: 30,
      };

      await handleLogActivity(apiClient, args, testBrandId);

      expect(apiClient.logActivity).toHaveBeenCalledWith({
        brandId: testBrandId.toLowerCase(),
        userIdentifier: 'user@example.com',
        platform: 'discord',
        activityType: 'voice',
        durationMinutes: 30,
        count: undefined,
      });
    });

    it('should call calculateReward with correct parameters', async () => {
      const args = {
        brandId: testBrandId,
        userIdentifier: 'user@example.com',
        platform: 'discord',
        baseReward: 100,
        eventType: 'daily_checkin',
        roles: ['vip', 'moderator'],
      };

      await handleCalculateReward(apiClient, args, testBrandId);

      expect(apiClient.calculateReward).toHaveBeenCalledWith({
        brandId: testBrandId.toLowerCase(),
        userIdentifier: 'user@example.com',
        platform: 'discord',
        baseReward: 100,
        eventType: 'daily_checkin',
        roles: ['vip', 'moderator'],
      });
    });

    it('should call updateLeaderboardStats with correct parameters', async () => {
      const args = {
        brandId: testBrandId,
        userIdentifier: 'user@example.com',
        platform: 'discord',
        ltzAmount: 100,
        claimType: 'daily_checkin',
        displayName: 'TestUser',
      };

      await handleUpdateLeaderboardStats(apiClient, args, testBrandId);

      expect(apiClient.updateLeaderboardStats).toHaveBeenCalledWith({
        brandId: testBrandId.toLowerCase(),
        userIdentifier: 'user@example.com',
        platform: 'discord',
        ltzAmount: 100,
        claimType: 'daily_checkin',
        displayName: 'TestUser',
      });
    });
  });

  describe('User Tools', () => {
    it('should call getUserBalance with correct parameters', async () => {
      const args = {
        brandId: testBrandId,
        userEmail: 'user@example.com',
        includeHistory: true,
        historyLimit: 20,
      };

      await handleGetUserBalance(apiClient, args, testBrandId);

      expect(apiClient.getUserBalance).toHaveBeenCalledWith({
        brandId: testBrandId.toLowerCase(),
        userEmail: 'user@example.com',
        includeHistory: true,
        historyLimit: 20,
      });
    });

    it('should call checkEligibility with correct parameters', async () => {
      const args = {
        brandId: testBrandId,
        userEmail: 'user@example.com',
        eventType: 'daily_checkin',
      };

      await handleCheckEligibility(apiClient, args, testBrandId);

      expect(apiClient.checkEligibility).toHaveBeenCalledWith({
        brandId: testBrandId.toLowerCase(),
        userEmail: 'user@example.com',
        eventType: 'daily_checkin',
      });
    });
  });

  describe('Transaction Tools', () => {
    it('should call relayTransaction with correct parameters', async () => {
      const args = {
        brandId: testBrandId,
        privyAccessToken: 'token123',
        to: '0x5242b6DB88A72752ac5a54cFe6A7DB8244d743c9',
        data: '0x1234',
        userAddress: '0xuser',
        gasLimit: 100000,
      };

      await handleRelayTransaction(apiClient, args, testBrandId);

      expect(apiClient.relayTransaction).toHaveBeenCalledWith({
        privyAccessToken: 'token123',
        to: '0x5242b6DB88A72752ac5a54cFe6A7DB8244d743c9',
        data: '0x1234',
        userAddress: '0xuser',
        gasLimit: 100000,
        permit: undefined,
      });
    });
  });

  describe('Drop Tools', () => {
    it('should call createDrop with correct parameters', async () => {
      const args = {
        brandId: testBrandId,
        platform: 'discord',
        serverId: 'server_123',
        eventType: 'reaction_drop',
        reward: 50,
        maxClaims: 100,
        expiresInSeconds: 3600,
        triggerType: 'reaction',
        triggerEmoji: '🎁',
      };

      await handleCreateDrop(apiClient, args, testBrandId);

      expect(apiClient.createDrop).toHaveBeenCalledWith({
        brandId: testBrandId.toLowerCase(),
        platform: 'discord',
        serverId: 'server_123',
        eventType: 'reaction_drop',
        reward: 50,
        maxClaims: 100,
        expiresInSeconds: 3600,
        triggerType: 'reaction',
        triggerEmoji: '🎁',
        metadata: undefined,
      });
    });

    it('should call claimDrop with correct parameters', async () => {
      const args = {
        dropId: 'drop_123',
        platformUserId: '123456789',
        platform: 'discord',
      };

      await handleClaimDrop(apiClient, args, testBrandId);

      expect(apiClient.claimDrop).toHaveBeenCalledWith({
        dropId: 'drop_123',
        platformUserId: '123456789',
        platform: 'discord',
      });
    });
  });

  describe('Integration Tools', () => {
    it('should call processThirdPartyEvent with correct parameters', async () => {
      const args = {
        brandId: testBrandId,
        platform: 'discord',
        sourceBot: 'mee6',
        eventType: 'level_up',
        targetUserId: '123456789',
        level: 5,
      };

      await handleProcessThirdPartyEvent(apiClient, args, testBrandId);

      expect(apiClient.processThirdPartyEvent).toHaveBeenCalledWith({
        brandId: testBrandId.toLowerCase(),
        platform: 'discord',
        sourceBot: 'mee6',
        eventType: 'level_up',
        targetUserId: '123456789',
        level: 5,
        achievement: undefined,
        rawMessage: undefined,
        metadata: undefined,
      });
    });
  });

  describe('Perk Tools', () => {
    it('should call getPerks with correct parameters', async () => {
      const args = {
        brandId: testBrandId,
        activeOnly: true,
        category: 'discount',
        userAddress: '0xuser',
      };

      await handleListPerks(apiClient, args, testBrandId);

      expect(apiClient.getPerks).toHaveBeenCalledWith({
        brandId: testBrandId.toLowerCase(),
        activeOnly: true,
        category: 'discount',
        userAddress: '0xuser',
      });
    });

    it('should call checkPerkEligibility with correct parameters', async () => {
      const args = {
        brandId: testBrandId,
        userIdentifier: 'user@example.com',
        platform: 'discord',
        perkId: 'perk_123',
      };

      await handleCheckPerkEligibility(apiClient, args, testBrandId);

      expect(apiClient.checkPerkEligibility).toHaveBeenCalledWith({
        brandId: testBrandId.toLowerCase(),
        userIdentifier: 'user@example.com',
        platform: 'discord',
        perkId: 'perk_123',
      });
    });

    it('should call redeemPerk with correct parameters', async () => {
      const args = {
        brandId: testBrandId,
        userIdentifier: 'user@example.com',
        platform: 'discord',
        perkId: 'perk_123',
      };

      await handleRedeemPerk(apiClient, args, testBrandId);

      expect(apiClient.redeemPerk).toHaveBeenCalledWith({
        brandId: testBrandId.toLowerCase(),
        userIdentifier: 'user@example.com',
        platform: 'discord',
        perkId: 'perk_123',
      });
    });
  });

  describe('Achievement Tools', () => {
    it('should call getUserAchievements with correct parameters', async () => {
      const args = {
        brandId: testBrandId,
        userIdentifier: 'user@example.com',
      };

      await handleGetUserAchievements(apiClient, args, testBrandId);

      expect(apiClient.getUserAchievements).toHaveBeenCalledWith({
        brandId: testBrandId.toLowerCase(),
        userIdentifier: 'user@example.com',
      });
    });

    it('should call updateAchievementProgress with correct parameters', async () => {
      const args = {
        brandId: testBrandId,
        userIdentifier: 'user@example.com',
        platform: 'discord',
        achievementType: 'message_count',
        newValue: 50,
        increment: false,
      };

      await handleUpdateAchievementProgress(apiClient, args, testBrandId);

      expect(apiClient.updateAchievementProgress).toHaveBeenCalledWith({
        brandId: testBrandId.toLowerCase(),
        userIdentifier: 'user@example.com',
        platform: 'discord',
        achievementType: 'message_count',
        newValue: 50,
        increment: false,
      });
    });
  });

  describe('BrandId Resolution in Tool Calls', () => {
    it('should normalize brandId to lowercase in all tool calls', async () => {
      const uppercaseBrandId = '0xABCDEF1234567890ABCDEF1234567890ABCDEF12';
      
      const args = {
        brandId: uppercaseBrandId,
        eventType: 'test',
        userIdentifier: { email: 'user@example.com' },
      };

      await handleTrackEvent(apiClient, args);

      expect(apiClient.trackEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          brandId: uppercaseBrandId.toLowerCase(),
        })
      );
    });

    it('should use default brandId when not provided in tool call', async () => {
      process.env.LOYALTEEZ_BRAND_ID = testBrandId;

      const args = {
        eventType: 'test',
        userIdentifier: { email: 'user@example.com' },
      };

      await handleTrackEvent(apiClient, args);

      expect(apiClient.trackEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          brandId: testBrandId.toLowerCase(),
        })
      );

      delete process.env.LOYALTEEZ_BRAND_ID;
    });
  });
});
