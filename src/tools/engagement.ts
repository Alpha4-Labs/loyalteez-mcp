/**
 * Engagement tools - streaks and leaderboards
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { LoyalteezAPIClient } from '../utils/api-client.js';
import { validateBrandId, periodSchema } from '../utils/validation.js';
import { z } from 'zod';

/**
 * Register engagement tools
 */
export function registerEngagementTools(apiClient: LoyalteezAPIClient): Tool[] {
  return [
    streakCheckinTool(apiClient),
    getLeaderboardTool(apiClient),
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
          description: 'Your brand wallet address',
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
      required: ['brandId', 'userId', 'platform'],
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
          description: 'Your brand wallet address',
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
      required: ['brandId', 'metric', 'period'],
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
      brandId: z.string(),
      userId: z.string(),
      platform: z.string(),
    }).parse(args);

    const brandId = validateBrandId(params.brandId);
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
      brandId: z.string(),
      metric: z.string(),
      period: periodSchema,
      platform: z.string().optional(),
      limit: z.number().int().positive().optional(),
    }).parse(args);

    const brandId = validateBrandId(params.brandId);
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
