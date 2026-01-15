/**
 * Achievement tools for Loyalteez MCP
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { LoyalteezAPIClient } from '../utils/api-client.js';
import { getBrandId } from '../utils/brand-id.js';
import { z } from 'zod';

/**
 * Register achievement tools
 */
export function registerAchievementTools(apiClient: LoyalteezAPIClient): Tool[] {
  return [getUserAchievementsTool(apiClient), updateAchievementProgressTool(apiClient)];
}

/**
 * Get user achievements tool
 */
function getUserAchievementsTool(_apiClient: LoyalteezAPIClient): Tool {
  return {
    name: 'loyalteez_get_user_achievements',
    description: `Get all achievements for a user, showing progress toward each and which are unlocked.

See also: loyalteez://docs/shared-services/achievement-service`,
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
      },
      required: ['userIdentifier'],
    },
  };
}

/**
 * Update achievement progress tool
 */
function updateAchievementProgressTool(_apiClient: LoyalteezAPIClient): Tool {
  return {
    name: 'loyalteez_update_achievement_progress',
    description: `Update user progress toward an achievement. When progress reaches the threshold, the achievement automatically unlocks. Returns newly unlocked achievements.

See also: loyalteez://docs/shared-services/achievement-service`,
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
        achievementType: {
          type: 'string',
          enum: ['message_count', 'voice_hours', 'streak_days', 'events_claimed', 'gm_count', 'level_reached', 'ltz_earned', 'custom'],
          description: 'Type of achievement to update',
        },
        newValue: {
          type: 'number',
          description: 'New progress value',
        },
        increment: {
          type: 'boolean',
          description: 'If true, adds newValue to current progress. If false, sets progress to newValue.',
          default: false,
        },
      },
      required: ['userIdentifier', 'platform', 'achievementType', 'newValue'],
    },
  };
}

/**
 * Handle get_user_achievements tool call
 */
export async function handleGetUserAchievements(
  apiClient: LoyalteezAPIClient,
  args: unknown
): Promise<CallToolResult> {
  try {
    const params = z.object({
      brandId: z.string().optional(),
      userIdentifier: z.string(),
    }).parse(args);

    const brandId = getBrandId(params.brandId);

    const result = await apiClient.getUserAchievements({
      brandId,
      userIdentifier: params.userIdentifier,
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
          text: `Error getting user achievements: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Handle update_achievement_progress tool call
 */
export async function handleUpdateAchievementProgress(
  apiClient: LoyalteezAPIClient,
  args: unknown
): Promise<CallToolResult> {
  try {
    const params = z.object({
      brandId: z.string().optional(),
      userIdentifier: z.string(),
      platform: z.string(),
      achievementType: z.enum(['message_count', 'voice_hours', 'streak_days', 'events_claimed', 'gm_count', 'level_reached', 'ltz_earned', 'custom']),
      newValue: z.number(),
      increment: z.boolean().optional().default(false),
    }).parse(args);

    const brandId = getBrandId(params.brandId);

    const result = await apiClient.updateAchievementProgress({
      brandId,
      userIdentifier: params.userIdentifier,
      platform: params.platform,
      achievementType: params.achievementType,
      newValue: params.newValue,
      increment: params.increment,
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
          text: `Error updating achievement progress: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}
