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
 * FUTURE: Batch User Stats Tool
 * 
 * This tool would allow querying stats for multiple users at once.
 * Currently not implemented as single-user queries cover most use cases.
 * 
 * If demand arises, implement as:
 * - loyalteez_batch_get_user_stats
 * - Accepts array of { userIdentifier, platform }
 * - Returns array of user stats objects
 * 
 * Example:
 * {
 *   "brandId": "0x...",
 *   "users": [
 *     { "userIdentifier": "discord_123@loyalteez.app", "platform": "discord" },
 *     { "userIdentifier": "telegram_456@loyalteez.app", "platform": "telegram" }
 *   ]
 * }
 */

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

**Implementation Note**: LTZ balances are stored on-chain. If the API endpoint is unavailable:
1. Get the user's wallet address via \`loyalteez_resolve_user\` or SDK \`getUserWallet()\`
2. Query the LTZ token contract (\`0x5242b6DB88A72752ac5a54cFe6A7DB8244d743c9\`) using \`balanceOf(address)\` on Soneium Mainnet (Chain ID: 1868)

See also: loyalteez://docs/api/rest-api, loyalteez://contracts/ltz-token`,
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

**Implementation Note**: Eligibility checking requires event configuration (maxClaims, cooldown, reward) and user claim history. If the endpoint is unavailable, eligibility can be determined by:
1. Calling \`loyalteez_get_event_config\` to get event settings
2. Checking user's claim count against maxClaims
3. Verifying cooldown period has elapsed

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

**Implementation Note**: User stats aggregate data from multiple services. If the aggregation endpoint is unavailable, stats can be obtained by calling:
- \`loyalteez_get_streak_status\` for streak data
- \`loyalteez_get_leaderboard\` for rank and lifetime earnings
- \`loyalteez_get_user_balance\` for balance
- Platform-specific APIs for activity (messages, voice, reactions)

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
    const is404 = errorMessage.includes('404') || errorMessage.includes('Not Found');
    const isEndpointError = errorMessage.includes('endpoint') || is404;
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: 'Error getting user balance',
            message: errorMessage,
            ...(isEndpointError && {
              note: 'This endpoint may need backend verification. See ENDPOINT-STATUS.md for details.',
              suggestion: 'The endpoint may require blockchain query or aggregation from multiple services.',
            }),
          }, null, 2),
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
    const is404 = errorMessage.includes('404') || errorMessage.includes('Not Found');
    const isEndpointError = errorMessage.includes('endpoint') || is404;
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: 'Error checking eligibility',
            message: errorMessage,
            ...(isEndpointError && {
              note: 'This endpoint may need backend verification. See ENDPOINT-STATUS.md for details.',
              suggestion: 'The endpoint may need to aggregate data from event configuration and user history.',
            }),
          }, null, 2),
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
    const is404 = errorMessage.includes('404') || errorMessage.includes('Not Found');
    const isEndpointError = errorMessage.includes('endpoint') || is404;
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: 'Error getting user stats',
            message: errorMessage,
            ...(isEndpointError && {
              note: 'This endpoint aggregates data from multiple services. See ENDPOINT-STATUS.md for details.',
              suggestion: 'The endpoint may need to be implemented as a composite endpoint or multiple service calls.',
            }),
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
}
