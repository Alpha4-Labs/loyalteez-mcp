/**
 * Engagement tools - streaks and leaderboards
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { LoyalteezAPIClient } from '../utils/api-client.js';
import { periodSchema } from '../utils/validation.js';
import { getBrandId } from '../utils/brand-id.js';
import { z } from 'zod';

/**
 * Register engagement tools
 */
export function registerEngagementTools(apiClient: LoyalteezAPIClient): Tool[] {
  return [
    streakCheckinTool(apiClient),
    getLeaderboardTool(apiClient),
    getStreakStatusTool(apiClient),
    claimStreakMilestoneTool(apiClient),
    logActivityTool(apiClient),
    calculateRewardTool(apiClient),
    updateLeaderboardStatsTool(apiClient),
  ];
}

/**
 * Streak check-in tool
 */
function streakCheckinTool(_apiClient: LoyalteezAPIClient): Tool {
  return {
    name: 'loyalteez_streak_checkin',
    description: `Process a streak check-in with automatic multipliers and milestones. Tracks consecutive daily activity and applies bonus multipliers.

See also: loyalteez://docs/shared-services/streak-service`,
    inputSchema: {
      type: 'object',
      properties: {
        brandId: {
          type: 'string',
          description: 'Your brand wallet address. If not provided, uses LOYALTEEZ_BRAND_ID environment variable.',
        },
        userId: {
          type: 'string',
          description: 'Platform user ID (format: platform_userId or email)',
        },
        platform: {
          type: 'string',
          description: 'Platform: "discord" | "telegram" | "web" | etc.',
        },
      },
      required: ['userId', 'platform'],
    },
  };
}

/**
 * Get leaderboard tool
 */
function getLeaderboardTool(_apiClient: LoyalteezAPIClient): Tool {
  return {
    name: 'loyalteez_get_leaderboard',
    description: `Get ranked leaderboards by any metric. Supports multiple time periods and platform filtering.

See also: loyalteez://docs/shared-services/leaderboard-service`,
    inputSchema: {
      type: 'object',
      properties: {
        brandId: {
          type: 'string',
          description: 'Your brand wallet address. If not provided, uses LOYALTEEZ_BRAND_ID environment variable.',
        },
        metric: {
          type: 'string',
          description: 'Metric to rank by: "ltz_earned" | "streak" | "events_completed" | "referrals" | custom',
        },
        period: {
          type: 'string',
          description: 'Time period: "daily" | "weekly" | "monthly" | "all_time"',
          enum: ['daily', 'weekly', 'monthly', 'all_time'],
        },
        platform: {
          type: 'string',
          description: 'Filter by platform (optional)',
        },
        limit: {
          type: 'number',
          description: 'Number of results (default: 10)',
        },
      },
      required: ['metric', 'period'],
    },
  };
}

/**
 * Handle streak_checkin tool call
 */
export async function handleStreakCheckin(
  apiClient: LoyalteezAPIClient,
  args: unknown
): Promise<CallToolResult> {
  try {
    const params = z.object({
      brandId: z.string().optional(),
      userId: z.string(),
      platform: z.string(),
    }).parse(args);

    const brandId = getBrandId(params.brandId);
    const userId = params.userId;
    const platform = params.platform;

    // Determine user identifier format
    let userIdentifier: string;
    if (userId.includes('@')) {
      userIdentifier = userId;
    } else {
      userIdentifier = `${platform}_${userId}@loyalteez.app`;
    }

    // Call streak service
    const result = await apiClient.recordStreakActivity({
      brandId,
      userIdentifier,
      platform,
      streakType: 'daily',
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: result.success,
            streak: result.streak,
            reward: result.reward,
            nextMilestone: result.nextMilestone,
          }, null, 2),
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: `Error processing streak check-in: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Handle get_leaderboard tool call
 */
export async function handleGetLeaderboard(
  apiClient: LoyalteezAPIClient,
  args: unknown
): Promise<CallToolResult> {
  try {
    const params = z.object({
      brandId: z.string().optional(),
      metric: z.string(),
      period: periodSchema,
      platform: z.string().optional(),
      limit: z.number().int().positive().optional(),
    }).parse(args);

    const brandId = getBrandId(params.brandId);
    const metric = params.metric;
    const period = params.period;
    const platform = params.platform;
    const limit = params.limit || 10;

    // Call leaderboard service
    const result = await apiClient.getLeaderboard({
      brandId,
      metric,
      period,
      platform,
      limit,
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            rankings: result.rankings,
            userRank: result.userRank,
          }, null, 2),
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: `Error fetching leaderboard: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Get streak status tool
 */
function getStreakStatusTool(_apiClient: LoyalteezAPIClient): Tool {
  return {
    name: 'loyalteez_get_streak_status',
    description: `Get a user's current streak status including streak length, multiplier, next milestone, and whether they've checked in today.

See also: loyalteez://docs/shared-services/streak-service`,
    inputSchema: {
      type: 'object',
      properties: {
        brandId: {
          type: 'string',
          description: 'Your brand wallet address. If not provided, uses LOYALTEEZ_BRAND_ID environment variable.',
        },
        userIdentifier: {
          type: 'string',
          description: 'User identifier (platform_userId@loyalteez.app or email)',
        },
        streakType: {
          type: 'string',
          description: 'Type of streak (default: "daily")',
          default: 'daily',
        },
      },
      required: ['userIdentifier'],
    },
  };
}

/**
 * Claim streak milestone tool
 */
function claimStreakMilestoneTool(_apiClient: LoyalteezAPIClient): Tool {
  return {
    name: 'loyalteez_claim_streak_milestone',
    description: `Claim a milestone bonus (7, 30, 100, 365 days) for a user's streak. Returns the bonus LTZ amount awarded.

See also: loyalteez://docs/shared-services/streak-service`,
    inputSchema: {
      type: 'object',
      properties: {
        brandId: {
          type: 'string',
          description: 'Your brand wallet address. If not provided, uses LOYALTEEZ_BRAND_ID environment variable.',
        },
        userIdentifier: {
          type: 'string',
          description: 'User identifier (platform_userId@loyalteez.app or email)',
        },
        platform: {
          type: 'string',
          description: 'Platform: "discord" | "telegram" | "web" | etc.',
        },
        milestoneDays: {
          type: 'number',
          description: 'Milestone to claim',
          enum: [7, 30, 100, 365],
        },
        streakType: {
          type: 'string',
          description: 'Type of streak (default: "daily")',
          default: 'daily',
        },
      },
      required: ['userIdentifier', 'platform', 'milestoneDays'],
    },
  };
}

/**
 * Log activity tool
 */
function logActivityTool(_apiClient: LoyalteezAPIClient): Tool {
  return {
    name: 'loyalteez_log_activity',
    description: `Track voice time, messages, reactions with daily caps. Returns reward earned, daily progress, and cap status.

See also: loyalteez://docs/shared-services/activity-service`,
    inputSchema: {
      type: 'object',
      properties: {
        brandId: {
          type: 'string',
          description: 'Your brand wallet address. If not provided, uses LOYALTEEZ_BRAND_ID environment variable.',
        },
        userIdentifier: {
          type: 'string',
          description: 'User identifier (platform_userId@loyalteez.app or email)',
        },
        platform: {
          type: 'string',
          description: 'Platform: "discord" | "telegram" | "web" | etc.',
        },
        activityType: {
          type: 'string',
          enum: ['voice', 'message', 'reaction', 'presence'],
          description: 'Type of activity to log',
        },
        durationMinutes: {
          type: 'number',
          description: 'Duration in minutes (for voice activity)',
        },
        count: {
          type: 'number',
          description: 'Count of activities (for messages/reactions)',
        },
      },
      required: ['userIdentifier', 'platform', 'activityType'],
    },
  };
}

/**
 * Calculate reward tool
 */
function calculateRewardTool(_apiClient: LoyalteezAPIClient): Tool {
  return {
    name: 'loyalteez_calculate_reward',
    description: `Calculate final reward with role multipliers & bonuses. Returns breakdown of base reward, multipliers, and final amount.

Supports Discord role bonuses (multipliers 1.0-5.0x and flat bonuses 0-1000 LTZ). Multiple roles combine based on stacking mode (multiplicative, additive, highest_only).

See also: loyalteez://docs/shared-services/tier-service`,
    inputSchema: {
      type: 'object',
      properties: {
        brandId: {
          type: 'string',
          description: 'Your brand wallet address. If not provided, uses LOYALTEEZ_BRAND_ID environment variable.',
        },
        userIdentifier: {
          type: 'string',
          description: 'User identifier (platform_userId@loyalteez.app or email)',
        },
        platform: {
          type: 'string',
          description: 'Platform: "discord" | "telegram" | "web" | etc.',
        },
        baseReward: {
          type: 'number',
          description: 'Base reward amount before multipliers',
        },
        eventType: {
          type: 'string',
          description: 'Event type for context',
        },
        roles: {
          type: 'array',
          description: 'Platform role IDs (for role multipliers)',
          items: { type: 'string' },
        },
      },
      required: ['userIdentifier', 'platform', 'baseReward', 'eventType'],
    },
  };
}

/**
 * Update leaderboard stats tool
 */
function updateLeaderboardStatsTool(_apiClient: LoyalteezAPIClient): Tool {
  return {
    name: 'loyalteez_update_leaderboard_stats',
    description: `Update user statistics after rewarding them. This keeps leaderboard data current. Call after every reward distribution.

See also: loyalteez://docs/shared-services/leaderboard-service`,
    inputSchema: {
      type: 'object',
      properties: {
        brandId: {
          type: 'string',
          description: 'Your brand wallet address. If not provided, uses LOYALTEEZ_BRAND_ID environment variable.',
        },
        userIdentifier: {
          type: 'string',
          description: 'User identifier (platform_userId@loyalteez.app or email)',
        },
        platform: {
          type: 'string',
          description: 'Platform: "discord" | "telegram" | "web" | etc.',
        },
        ltzAmount: {
          type: 'number',
          description: 'LTZ amount earned',
        },
        claimType: {
          type: 'string',
          description: 'Type of claim/event (e.g., "daily_checkin", "purchase")',
        },
        displayName: {
          type: 'string',
          description: "User's display name for leaderboard",
        },
      },
      required: ['userIdentifier', 'platform', 'ltzAmount'],
    },
  };
}

/**
 * Handle get_streak_status tool call
 */
export async function handleGetStreakStatus(
  apiClient: LoyalteezAPIClient,
  args: unknown
): Promise<CallToolResult> {
  try {
    const params = z.object({
      brandId: z.string().optional(),
      userIdentifier: z.string(),
      streakType: z.string().optional().default('daily'),
    }).parse(args);

    const brandId = getBrandId(params.brandId);

    const result = await apiClient.getStreakStatus({
      brandId,
      userIdentifier: params.userIdentifier,
      streakType: params.streakType,
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: `Error getting streak status: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Handle claim_streak_milestone tool call
 */
export async function handleClaimStreakMilestone(
  apiClient: LoyalteezAPIClient,
  args: unknown
): Promise<CallToolResult> {
  try {
    const params = z.object({
      brandId: z.string().optional(),
      userIdentifier: z.string(),
      platform: z.string(),
      milestoneDays: z.union([z.literal(7), z.literal(30), z.literal(100), z.literal(365)]),
      streakType: z.string().optional().default('daily'),
    }).parse(args);

    const brandId = getBrandId(params.brandId);

    const result = await apiClient.claimStreakMilestone({
      brandId,
      userIdentifier: params.userIdentifier,
      platform: params.platform,
      milestoneDays: params.milestoneDays,
      streakType: params.streakType,
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: `Error claiming streak milestone: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Handle log_activity tool call
 */
export async function handleLogActivity(
  apiClient: LoyalteezAPIClient,
  args: unknown
): Promise<CallToolResult> {
  try {
    const params = z.object({
      brandId: z.string().optional(),
      userIdentifier: z.string(),
      platform: z.string(),
      activityType: z.enum(['voice', 'message', 'reaction', 'presence']),
      durationMinutes: z.number().optional(),
      count: z.number().optional(),
    }).parse(args);

    const brandId = getBrandId(params.brandId);

    const result = await apiClient.logActivity({
      brandId,
      userIdentifier: params.userIdentifier,
      platform: params.platform,
      activityType: params.activityType,
      durationMinutes: params.durationMinutes,
      count: params.count,
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: `Error logging activity: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Handle calculate_reward tool call
 */
export async function handleCalculateReward(
  apiClient: LoyalteezAPIClient,
  args: unknown
): Promise<CallToolResult> {
  try {
    const params = z.object({
      brandId: z.string().optional(),
      userIdentifier: z.string(),
      platform: z.string(),
      baseReward: z.number().positive(),
      eventType: z.string(),
      roles: z.array(z.string()).optional(),
    }).parse(args);

    const brandId = getBrandId(params.brandId);

    const result = await apiClient.calculateReward({
      brandId,
      userIdentifier: params.userIdentifier,
      platform: params.platform,
      baseReward: params.baseReward,
      eventType: params.eventType,
      roles: params.roles,
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: `Error calculating reward: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Handle update_leaderboard_stats tool call
 */
export async function handleUpdateLeaderboardStats(
  apiClient: LoyalteezAPIClient,
  args: unknown
): Promise<CallToolResult> {
  try {
    const params = z.object({
      brandId: z.string().optional(),
      userIdentifier: z.string(),
      platform: z.string(),
      ltzAmount: z.number().positive(),
      claimType: z.string().optional(),
      displayName: z.string().optional(),
    }).parse(args);

    const brandId = getBrandId(params.brandId);

    const result = await apiClient.updateLeaderboardStats({
      brandId,
      userIdentifier: params.userIdentifier,
      platform: params.platform,
      ltzAmount: params.ltzAmount,
      claimType: params.claimType,
      displayName: params.displayName,
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: `Error updating leaderboard stats: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}
