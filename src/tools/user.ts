/**
 * User management tools for Loyalteez MCP
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { LoyalteezAPIClient } from '../utils/api-client.js';
import { validateEmail } from '../utils/validation.js';
import { getBrandId } from '../utils/brand-id.js';
import { z } from 'zod';

/**
 * Register user tools
 */
export function registerUserTools(apiClient: LoyalteezAPIClient): Tool[] {
  return [getUserBalanceTool(apiClient), checkEligibilityTool(apiClient), getUserStatsTool(apiClient)];
}

/**
 * Get user balance tool
 */
function getUserBalanceTool(_apiClient: LoyalteezAPIClient): Tool {
  return {
    name: 'loyalteez_get_user_balance',
    description: `Get a user's current LTZ balance and recent transaction history. Use this to display balance in your app or verify rewards were distributed.

See also: loyalteez://docs/api/rest-api`,
    inputSchema: {
      type: 'object',
      properties: {
        brandId: {
          type: 'string',
          description: 'Your brand wallet address. If not provided, uses LOYALTEEZ_BRAND_ID environment variable.',
        },
        userEmail: {
          type: 'string',
          format: 'email',
          description: "User's email address",
        },
        includeHistory: {
          type: 'boolean',
          description: 'Include recent transactions (default: false)',
        },
        historyLimit: {
          type: 'number',
          description: 'Max transactions to return (default: 10, max: 50)',
        },
      },
      required: ['userEmail'],
    },
  };
}

/**
 * Check eligibility tool
 */
function checkEligibilityTool(_apiClient: LoyalteezAPIClient): Tool {
  return {
    name: 'loyalteez_check_eligibility',
    description: `Check if a user is eligible to receive a reward for a specific event. Returns eligibility status, cooldown info, and claim history. Use this BEFORE tracking an event to validate the user can receive the reward.

See also: loyalteez://docs/api/rest-api`,
    inputSchema: {
      type: 'object',
      properties: {
        brandId: {
          type: 'string',
          description: 'Your brand wallet address. If not provided, uses LOYALTEEZ_BRAND_ID environment variable.',
        },
        eventType: {
          type: 'string',
          description: 'Event type to check eligibility for',
        },
        userEmail: {
          type: 'string',
          format: 'email',
          description: "User's email address",
        },
      },
      required: ['eventType', 'userEmail'],
    },
  };
}

/**
 * Get user stats tool
 */
function getUserStatsTool(_apiClient: LoyalteezAPIClient): Tool {
  return {
    name: 'loyalteez_get_user_stats',
    description: `Get comprehensive stats for a single user including balance, lifetime earnings, streak, activity, and rank.

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
      },
      required: ['userIdentifier', 'platform'],
    },
  };
}

/**
 * Handle get_user_balance tool call
 */
export async function handleGetUserBalance(
  apiClient: LoyalteezAPIClient,
  args: unknown
): Promise<CallToolResult> {
  try {
    const params = z.object({
      brandId: z.string().optional(),
      userEmail: z.string().email(),
      includeHistory: z.boolean().optional().default(false),
      historyLimit: z.number().int().positive().max(50).optional().default(10),
    }).parse(args);

    const brandId = getBrandId(params.brandId);
    const userEmail = validateEmail(params.userEmail);

    const result = await apiClient.getUserBalance({
      brandId,
      userEmail,
      includeHistory: params.includeHistory,
      historyLimit: params.historyLimit,
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
          text: `Error getting user balance: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Handle check_eligibility tool call
 */
export async function handleCheckEligibility(
  apiClient: LoyalteezAPIClient,
  args: unknown
): Promise<CallToolResult> {
  try {
    const params = z.object({
      brandId: z.string().optional(),
      eventType: z.string(),
      userEmail: z.string().email(),
    }).parse(args);

    const brandId = getBrandId(params.brandId);
    const userEmail = validateEmail(params.userEmail);

    const result = await apiClient.checkEligibility({
      brandId,
      eventType: params.eventType,
      userEmail,
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
          text: `Error checking eligibility: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Handle get_user_stats tool call
 */
export async function handleGetUserStats(
  apiClient: LoyalteezAPIClient,
  args: unknown
): Promise<CallToolResult> {
  try {
    const params = z.object({
      brandId: z.string().optional(),
      userIdentifier: z.string(),
      platform: z.string(),
    }).parse(args);

    const brandId = getBrandId(params.brandId);

    const result = await apiClient.getUserStats({
      brandId,
      userIdentifier: params.userIdentifier,
      platform: params.platform,
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
          text: `Error getting user stats: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}
