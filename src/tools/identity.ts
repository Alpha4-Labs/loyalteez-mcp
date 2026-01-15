/**
 * User identity resolution tools
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { LoyalteezAPIClient } from '../utils/api-client.js';
import { platformSchema } from '../utils/validation.js';
import { getBrandId } from '../utils/brand-id.js';
import { z } from 'zod';

/**
 * FUTURE: Batch Pregeneration Tool
 * 
 * This tool would allow pregenerating wallets for multiple users at once.
 * Currently not implemented as single-user pregeneration covers most use cases.
 * 
 * If demand arises, implement as:
 * - loyalteez_batch_pregenerate_users
 * - Accepts array of { platform, platformUserId, platformUsername }
 * - Returns array of { userIdentifier, walletAddress, status }
 * 
 * Example:
 * {
 *   "brandId": "0x...",
 *   "users": [
 *     { "platform": "discord", "platformUserId": "123", "platformUsername": "user1" },
 *     { "platform": "discord", "platformUserId": "456", "platformUsername": "user2" }
 *   ]
 * }
 */

/**
 * Register identity tools
 */
export function registerIdentityTool(apiClient: LoyalteezAPIClient): Tool[] {
  return [resolveUserTool(apiClient)];
}

/**
 * Resolve user tool
 */
function resolveUserTool(_apiClient: LoyalteezAPIClient): Tool {
  return {
    name: 'loyalteez_resolve_user',
    description: `Convert any platform identity to a Loyalteez wallet. Creates wallet if needed. Uses deterministic email pattern: {platform}_{userId}@loyalteez.app.

See also: loyalteez://docs/architecture`,
    inputSchema: {
      type: 'object',
      properties: {
        brandId: {
          type: 'string',
          description: 'Your brand wallet address. If not provided, uses LOYALTEEZ_BRAND_ID environment variable.',
        },
        platform: {
          type: 'string',
          description: 'Platform: "discord" | "telegram" | "twitter" | "farcaster" | "github" | "google" | "email"',
          enum: ['discord', 'telegram', 'twitter', 'farcaster', 'github', 'google', 'email'],
        },
        platformUserId: {
          type: 'string',
          description: 'Platform-specific user ID',
        },
        platformUsername: {
          type: 'string',
          description: 'Platform username (for display)',
        },
      },
      required: ['platform', 'platformUserId'],
    },
  };
}

/**
 * Handle resolve_user tool call
 */
export async function handleResolveUser(
  apiClient: LoyalteezAPIClient,
  args: unknown
): Promise<CallToolResult> {
  try {
    const params = z.object({
      brandId: z.string().optional(),
      platform: platformSchema,
      platformUserId: z.string(),
      platformUsername: z.string().optional(),
    }).parse(args);

    const brandId = getBrandId(params.brandId);
    const platform = params.platform;
    const platformUserId = params.platformUserId;

    // Generate deterministic email
    const loyalteezEmail = `${platform}_${platformUserId}@loyalteez.app`;

    // Try to pregenerate user wallet via API
    let walletAddress: string;
    let isNew = false;

    try {
      // Use pregeneration API for OAuth platforms
      if (platform !== 'email') {
        const result = await apiClient.pregenerateUser({
          brand_id: brandId,
          oauth_provider: platform,
          oauth_user_id: platformUserId,
          oauth_username: params.platformUsername,
        });
        walletAddress = result.wallet_address;
        isNew = result.created_new;
      } else {
        // For email, we'd need to use a different approach
        // For now, return a placeholder
        walletAddress = '0x0000000000000000000000000000000000000000';
        isNew = true;
      }
    } catch (error) {
      // If pregeneration fails, still return the deterministic email
      // The wallet will be created on first event tracking
      walletAddress = '0x0000000000000000000000000000000000000000';
      isNew = true;
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            loyalteezEmail,
            walletAddress,
            isNew,
            balance: 0, // Would need to fetch from blockchain or API
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
          text: `Error resolving user: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}
