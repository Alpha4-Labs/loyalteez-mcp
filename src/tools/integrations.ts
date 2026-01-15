/**
 * Third-party integration tools for Loyalteez MCP
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { LoyalteezAPIClient } from '../utils/api-client.js';
import { getBrandId } from '../utils/brand-id.js';
import { z } from 'zod';

/**
 * Register integration tools
 */
export function registerIntegrationTools(apiClient: LoyalteezAPIClient): Tool[] {
  return [processThirdPartyEventTool(apiClient)];
}

/**
 * Process third-party event tool
 */
function processThirdPartyEventTool(_apiClient: LoyalteezAPIClient): Tool {
  return {
    name: 'loyalteez_process_third_party_event',
    description: `Handle events from Mee6, Arcane, Tatsu, etc. Parses bot messages and converts to Loyalteez events. Use this to integrate with existing Discord leveling bots.

See also: loyalteez://docs/integrations/third-party`,
    inputSchema: {
      type: 'object',
      properties: {
        brandId: {
          type: 'string',
          description: 'Your brand wallet address. If not provided, uses LOYALTEEZ_BRAND_ID environment variable.',
        },
        platform: {
          type: 'string',
          description: 'Platform: "discord" | "telegram" | etc.',
        },
        sourceBot: {
          type: 'string',
          enum: ['mee6', 'arcane', 'tatsu', 'carl-bot'],
          description: 'Source bot that generated the event',
        },
        eventType: {
          type: 'string',
          enum: ['level_up', 'achievement', 'streak', 'message'],
          description: 'Type of event from the bot',
        },
        targetUserId: {
          type: 'string',
          description: 'Target user ID (platform format)',
        },
        level: {
          type: 'number',
          description: 'Level reached (for level_up events)',
        },
        achievement: {
          type: 'string',
          description: 'Achievement name (for achievement events)',
        },
        rawMessage: {
          type: 'string',
          description: 'Raw bot message for parsing',
        },
        metadata: {
          type: 'object',
          description: 'Additional event data',
        },
      },
      required: ['platform', 'sourceBot', 'eventType', 'targetUserId'],
    },
  };
}

/**
 * Handle process_third_party_event tool call
 */
export async function handleProcessThirdPartyEvent(
  apiClient: LoyalteezAPIClient,
  args: unknown
): Promise<CallToolResult> {
  try {
    const params = z.object({
      brandId: z.string().optional(),
      platform: z.string(),
      sourceBot: z.enum(['mee6', 'arcane', 'tatsu', 'carl-bot']),
      eventType: z.enum(['level_up', 'achievement', 'streak', 'message']),
      targetUserId: z.string(),
      level: z.number().optional(),
      achievement: z.string().optional(),
      rawMessage: z.string().optional(),
      metadata: z.record(z.unknown()).optional(),
    }).parse(args);

    const brandId = getBrandId(params.brandId);

    const result = await apiClient.processThirdPartyEvent({
      brandId,
      platform: params.platform,
      sourceBot: params.sourceBot,
      eventType: params.eventType,
      targetUserId: params.targetUserId,
      level: params.level,
      achievement: params.achievement,
      rawMessage: params.rawMessage,
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
          text: `Error processing third-party event: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}
