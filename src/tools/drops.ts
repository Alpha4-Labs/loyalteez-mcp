/**
 * Drop management tools for Loyalteez MCP
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { LoyalteezAPIClient } from '../utils/api-client.js';
import { getBrandId } from '../utils/brand-id.js';
import { z } from 'zod';

/**
 * Register drop tools
 */
export function registerDropTools(apiClient: LoyalteezAPIClient): Tool[] {
  return [createDropTool(apiClient), claimDropTool(apiClient)];
}

/**
 * Create drop tool
 */
function createDropTool(_apiClient: LoyalteezAPIClient): Tool {
  return {
    name: 'loyalteez_create_drop',
    description: `Create time-limited reward drops (reaction drops, claim buttons). Returns drop ID, claim URL, and embed data for posting.

See also: loyalteez://docs/shared-services/drops-service`,
    inputSchema: {
      type: 'object',
      properties: {
        brandId: {
          type: 'string',
          description: 'Your brand wallet address. If not provided, uses LOYALTEEZ_BRAND_ID environment variable.',
        },
        platform: {
          type: 'string',
          description: 'Platform: "discord" | "telegram" | "web" | etc.',
        },
        serverId: {
          type: 'string',
          description: 'Server/community ID (for Discord/Telegram)',
        },
        eventType: {
          type: 'string',
          description: 'Event type to trigger when claimed',
        },
        reward: {
          type: 'number',
          description: 'LTZ reward amount',
        },
        maxClaims: {
          type: 'number',
          description: 'Maximum number of claims',
        },
        expiresInSeconds: {
          type: 'number',
          description: 'Time until drop expires (in seconds)',
        },
        triggerType: {
          type: 'string',
          enum: ['reaction', 'button', 'command'],
          description: 'How users claim the drop',
        },
        triggerEmoji: {
          type: 'string',
          description: 'Emoji for reaction-based drops',
        },
        metadata: {
          type: 'object',
          description: 'Additional drop configuration',
        },
      },
      required: ['platform', 'serverId', 'eventType', 'reward', 'maxClaims', 'expiresInSeconds'],
    },
  };
}

/**
 * Claim drop tool
 */
function claimDropTool(_apiClient: LoyalteezAPIClient): Tool {
  return {
    name: 'loyalteez_claim_drop',
    description: `Process a drop claim from a user. Returns success status, reward amount, position, and remaining claims.

See also: loyalteez://docs/shared-services/drops-service`,
    inputSchema: {
      type: 'object',
      properties: {
        dropId: {
          type: 'string',
          description: 'Drop ID from create_drop response',
        },
        platformUserId: {
          type: 'string',
          description: 'Platform-specific user ID',
        },
        platform: {
          type: 'string',
          description: 'Platform: "discord" | "telegram" | "web" | etc.',
        },
      },
      required: ['dropId', 'platformUserId', 'platform'],
    },
  };
}

/**
 * Handle create_drop tool call
 */
export async function handleCreateDrop(
  apiClient: LoyalteezAPIClient,
  args: unknown
): Promise<CallToolResult> {
  try {
    const params = z.object({
      brandId: z.string().optional(),
      platform: z.string(),
      serverId: z.string(),
      eventType: z.string(),
      reward: z.number().positive(),
      maxClaims: z.number().int().positive(),
      expiresInSeconds: z.number().int().positive(),
      triggerType: z.enum(['reaction', 'button', 'command']).optional(),
      triggerEmoji: z.string().optional(),
      metadata: z.record(z.unknown()).optional(),
    }).parse(args);

    const brandId = getBrandId(params.brandId);

    const result = await apiClient.createDrop({
      brandId,
      platform: params.platform,
      serverId: params.serverId,
      eventType: params.eventType,
      reward: params.reward,
      maxClaims: params.maxClaims,
      expiresInSeconds: params.expiresInSeconds,
      triggerType: params.triggerType,
      triggerEmoji: params.triggerEmoji,
      metadata: params.metadata,
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
          text: `Error creating drop: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Handle claim_drop tool call
 */
export async function handleClaimDrop(
  apiClient: LoyalteezAPIClient,
  args: unknown
): Promise<CallToolResult> {
  try {
    const params = z.object({
      dropId: z.string(),
      platformUserId: z.string(),
      platform: z.string(),
    }).parse(args);

    const result = await apiClient.claimDrop({
      dropId: params.dropId,
      platformUserId: params.platformUserId,
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
          text: `Error claiming drop: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}
