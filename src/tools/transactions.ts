/**
 * Transaction relay tools for Loyalteez MCP
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { LoyalteezAPIClient } from '../utils/api-client.js';
import { z } from 'zod';

/**
 * Register transaction tools
 */
export function registerTransactionTools(apiClient: LoyalteezAPIClient): Tool[] {
  return [relayTransactionTool(apiClient)];
}

/**
 * Relay transaction tool
 */
function relayTransactionTool(_apiClient: LoyalteezAPIClient): Tool {
  return {
    name: 'loyalteez_relay_transaction',
    description: `Execute a gasless blockchain transaction. Users can claim perks, transfer LTZ, or interact with Loyalteez contracts without needing ETH for gas. Requires Privy authentication.

See also: loyalteez://docs/api/gas-relayer`,
    inputSchema: {
      type: 'object',
      properties: {
        privyAccessToken: {
          type: 'string',
          description: 'Privy access token from getAccessToken()',
        },
        to: {
          type: 'string',
          description: 'Contract address to call (must be whitelisted)',
          enum: [
            '0x5242b6DB88A72752ac5a54cFe6A7DB8244d743c9', // LTZ Token
            '0x6ae30d6Dcf3e75456B6582b057f1Bf98A90F2CA0', // PerkNFT
            '0x5269B83F6A4E31bEdFDf5329DC052FBb661e3c72', // PointsSale
          ],
        },
        data: {
          type: 'string',
          description: 'Encoded function call data (hex string)',
        },
        userAddress: {
          type: 'string',
          description: "User's wallet address",
        },
        gasLimit: {
          type: 'number',
          description: 'Maximum gas limit (default: auto-estimate, max: 1000000)',
        },
        permit: {
          type: 'object',
          description: 'EIP-2612 permit for gasless approval (optional)',
          properties: {
            owner: { type: 'string' },
            spender: { type: 'string' },
            value: { type: 'string' },
            deadline: { type: 'number' },
            v: { type: 'number' },
            r: { type: 'string' },
            s: { type: 'string' },
          },
        },
      },
      required: ['privyAccessToken', 'to', 'data', 'userAddress'],
    },
  };
}

/**
 * Handle relay_transaction tool call
 */
export async function handleRelayTransaction(
  apiClient: LoyalteezAPIClient,
  args: unknown
): Promise<CallToolResult> {
  try {
    const params = z.object({
      privyAccessToken: z.string(),
      to: z.enum([
        '0x5242b6DB88A72752ac5a54cFe6A7DB8244d743c9',
        '0x6ae30d6Dcf3e75456B6582b057f1Bf98A90F2CA0',
        '0x5269B83F6A4E31bEdFDf5329DC052FBb661e3c72',
      ]),
      data: z.string(),
      userAddress: z.string(),
      gasLimit: z.number().int().positive().max(1000000).optional(),
      permit: z
        .object({
          owner: z.string(),
          spender: z.string(),
          value: z.string(),
          deadline: z.number(),
          v: z.number(),
          r: z.string(),
          s: z.string(),
        })
        .optional(),
    }).parse(args);

    const result = await apiClient.relayTransaction({
      privyAccessToken: params.privyAccessToken,
      to: params.to,
      data: params.data,
      userAddress: params.userAddress,
      gasLimit: params.gasLimit,
      permit: params.permit,
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
          text: `Error relaying transaction: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}
