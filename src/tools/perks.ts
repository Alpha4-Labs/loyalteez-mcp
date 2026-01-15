/**
 * Perks & redemption tools for Loyalteez MCP
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { LoyalteezAPIClient } from '../utils/api-client.js';
import { getBrandId } from '../utils/brand-id.js';
import { z } from 'zod';

/**
 * Register perks tools
 */
export function registerPerksTools(apiClient: LoyalteezAPIClient): Tool[] {
  return [listPerksTool(apiClient), checkPerkEligibilityTool(apiClient), redeemPerkTool(apiClient)];
}

/**
 * List perks tool
 */
function listPerksTool(_apiClient: LoyalteezAPIClient): Tool {
  return {
    name: 'loyalteez_list_perks',
    description: `Get all available perks (NFT rewards) that users can claim with their LTZ balance. Returns perk details, pricing, and availability.

See also: loyalteez://docs/shared-services/perks-service`,
    inputSchema: {
      type: 'object',
      properties: {
        brandId: {
          type: 'string',
          description: 'Your brand wallet address. If not provided, uses LOYALTEEZ_BRAND_ID environment variable.',
        },
        activeOnly: {
          type: 'boolean',
          description: 'Only return active perks (default: true)',
        },
        category: {
          type: 'string',
          enum: ['all', 'discount', 'exclusive', 'merch', 'digital', 'experience', 'general'],
          description: 'Filter perks by category',
        },
        userAddress: {
          type: 'string',
          description: "Include user's eligibility and claim count for each perk",
        },
      },
      required: [],
    },
  };
}

/**
 * Check perk eligibility tool
 */
function checkPerkEligibilityTool(_apiClient: LoyalteezAPIClient): Tool {
  return {
    name: 'loyalteez_check_perk_eligibility',
    description: `Check if user can claim a specific perk. Returns eligibility status, balance check, cost, and missing amount.

See also: loyalteez://docs/shared-services/perks-service`,
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
        perkId: {
          type: 'string',
          description: 'UUID of the perk to check',
        },
      },
      required: ['userIdentifier', 'platform', 'perkId'],
    },
  };
}

/**
 * Redeem perk tool
 */
function redeemPerkTool(_apiClient: LoyalteezAPIClient): Tool {
  return {
    name: 'loyalteez_redeem_perk',
    description: `Redeem a perk for a user. Creates a redemption record and returns confirmation code. Note: You must separately deduct LTZ from the user's balance.

See also: loyalteez://docs/shared-services/perks-service`,
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
        perkId: {
          type: 'string',
          description: 'UUID of the perk to redeem',
        },
      },
      required: ['userIdentifier', 'platform', 'perkId'],
    },
  };
}

/**
 * Handle list_perks tool call
 */
export async function handleListPerks(
  apiClient: LoyalteezAPIClient,
  args: unknown
): Promise<CallToolResult> {
  try {
    const params = z.object({
      brandId: z.string().optional(),
      activeOnly: z.boolean().optional().default(true),
      category: z.enum(['all', 'discount', 'exclusive', 'merch', 'digital', 'experience', 'general']).optional(),
      userAddress: z.string().optional(),
    }).parse(args);

    const brandId = getBrandId(params.brandId);

    const result = await apiClient.getPerks({
      brandId,
      activeOnly: params.activeOnly,
      category: params.category,
      userAddress: params.userAddress,
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
          text: `Error listing perks: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Handle check_perk_eligibility tool call
 */
export async function handleCheckPerkEligibility(
  apiClient: LoyalteezAPIClient,
  args: unknown
): Promise<CallToolResult> {
  try {
    const params = z.object({
      brandId: z.string().optional(),
      userIdentifier: z.string(),
      platform: z.string(),
      perkId: z.string(),
    }).parse(args);

    const brandId = getBrandId(params.brandId);

    const result = await apiClient.checkPerkEligibility({
      brandId,
      userIdentifier: params.userIdentifier,
      platform: params.platform,
      perkId: params.perkId,
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
          text: `Error checking perk eligibility: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Handle redeem_perk tool call
 */
export async function handleRedeemPerk(
  apiClient: LoyalteezAPIClient,
  args: unknown
): Promise<CallToolResult> {
  try {
    const params = z.object({
      brandId: z.string().optional(),
      userIdentifier: z.string(),
      platform: z.string(),
      perkId: z.string(),
    }).parse(args);

    const brandId = getBrandId(params.brandId);

    const result = await apiClient.redeemPerk({
      brandId,
      userIdentifier: params.userIdentifier,
      platform: params.platform,
      perkId: params.perkId,
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
          text: `Error redeeming perk: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}
