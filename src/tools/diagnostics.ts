/**
 * Diagnostic and health check tools
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { LoyalteezAPIClient, API_VERSION, API_VERSION_COMPATIBILITY } from '../utils/api-client.js';

/**
 * Register diagnostic tools
 */
export function registerDiagnosticTools(apiClient: LoyalteezAPIClient): Tool[] {
  return [healthCheckTool(apiClient)];
}

/**
 * Health check tool
 */
function healthCheckTool(_apiClient: LoyalteezAPIClient): Tool {
  return {
    name: 'loyalteez_health_check',
    description: `Check the health status of Loyalteez APIs. Verifies that the Event Handler, database, blockchain, and Privy services are operational. Useful for diagnostics and verifying API availability before making calls.

See also: loyalteez://docs/api/rest-api`,
    inputSchema: {
      type: 'object',
      properties: {
        brandId: {
          type: 'string',
          description: 'Your brand wallet address. Optional - health check works without brandId.',
        },
      },
      required: [],
    },
  };
}

/**
 * Handle health check tool call
 */
export async function handleHealthCheck(
  apiClient: LoyalteezAPIClient,
  _args: unknown
): Promise<CallToolResult> {
  try {
    const result = await apiClient.healthCheck();

    // Check API version compatibility
    const versionInfo = {
      clientVersion: API_VERSION,
      compatibility: API_VERSION_COMPATIBILITY,
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              success: true,
              status: result.status,
              timestamp: result.timestamp,
              services: result.services,
              message: result.status === 'healthy' 
                ? 'All services are operational' 
                : 'Some services may be experiencing issues',
              apiVersion: versionInfo,
            },
            null,
            2
          ),
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              success: false,
              error: 'Health check failed',
              message: errorMessage,
              suggestion: 'The API may be temporarily unavailable. Please try again later.',
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
}
