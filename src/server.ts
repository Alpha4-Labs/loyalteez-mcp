/**
 * MCP Server setup and initialization
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { LoyalteezAPIClient } from './utils/api-client.js';
import type { Network } from './utils/api-client.js';

// Tool imports
import { registerEventTools, handleCreateEvent, handleCreateEventsBatch, handleTrackEvent, handleGetEventConfig, handleBulkEvents, handleAdminReward } from './tools/events.js';
import { registerProgramDesignTool, handleDesignProgram } from './tools/program-design.js';
import { registerIdentityTool, handleResolveUser } from './tools/identity.js';
import { registerEngagementTools, handleStreakCheckin, handleGetLeaderboard, handleGetStreakStatus, handleClaimStreakMilestone, handleLogActivity, handleCalculateReward, handleUpdateLeaderboardStats } from './tools/engagement.js';
import { registerUserTools, handleGetUserBalance, handleCheckEligibility, handleGetUserStats } from './tools/user.js';
import { registerTransactionTools, handleRelayTransaction } from './tools/transactions.js';
import { registerDropTools, handleCreateDrop, handleClaimDrop } from './tools/drops.js';
import { registerIntegrationTools, handleProcessThirdPartyEvent } from './tools/integrations.js';
import { registerPerksTools, handleListPerks, handleCheckPerkEligibility, handleRedeemPerk } from './tools/perks.js';
import { registerAchievementTools, handleGetUserAchievements, handleUpdateAchievementProgress } from './tools/achievements.js';

// Resource imports
import { initializeDocs, listDocResources, readDocResource, isDocResource } from './resources/docs.js';
import { listContractResources, readContractResource, isContractResource } from './resources/contracts.js';
import { listNetworkResources, readNetworkResource, isNetworkResource } from './resources/network.js';
import { listEventTypeResources, readEventTypeResource, isEventTypeResource } from './resources/event-types.js';
import { listSharedServicesResources, readSharedServicesResource, isSharedServicesResource } from './resources/shared-services.js';
import { listOAuthResources, readOAuthResource, isOAuthResource } from './resources/oauth.js';

export class LoyalteezMCPServer {
  private server: Server;
  private apiClient: LoyalteezAPIClient;
  private defaultBrandId?: string;

  constructor(network: Network = 'mainnet', defaultBrandId?: string) {
    this.apiClient = new LoyalteezAPIClient(network);
    this.defaultBrandId = defaultBrandId;
    this.server = new Server(
      {
        name: 'loyalteez-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    // Initialize documentation
    initializeDocs();

    this.setupErrorHandling();
    this.setupHandlers();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = [];
      
      // Register all tools
      tools.push(...registerEventTools(this.apiClient));
      tools.push(...registerProgramDesignTool(this.apiClient));
      tools.push(...registerIdentityTool(this.apiClient));
      tools.push(...registerEngagementTools(this.apiClient));
      tools.push(...registerUserTools(this.apiClient));
      tools.push(...registerTransactionTools(this.apiClient));
      tools.push(...registerDropTools(this.apiClient));
      tools.push(...registerIntegrationTools(this.apiClient));
      tools.push(...registerPerksTools(this.apiClient));
      tools.push(...registerAchievementTools(this.apiClient));

      return { tools };
    });

    // Call a tool
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'loyalteez_create_event':
            return await handleCreateEvent(this.apiClient, args);
          case 'loyalteez_create_events_batch':
            return await handleCreateEventsBatch(this.apiClient, args);
          case 'loyalteez_track_event':
            return await handleTrackEvent(this.apiClient, args);
          case 'loyalteez_get_event_config':
            return await handleGetEventConfig(this.apiClient, args);
          case 'loyalteez_bulk_events':
            return await handleBulkEvents(this.apiClient, args);
          case 'loyalteez_admin_reward':
            return await handleAdminReward(this.apiClient, args);
          case 'loyalteez_design_program':
            return await handleDesignProgram(this.apiClient, args);
          case 'loyalteez_resolve_user':
            return await handleResolveUser(this.apiClient, args);
          case 'loyalteez_streak_checkin':
            return await handleStreakCheckin(this.apiClient, args);
          case 'loyalteez_get_leaderboard':
            return await handleGetLeaderboard(this.apiClient, args);
          case 'loyalteez_get_streak_status':
            return await handleGetStreakStatus(this.apiClient, args);
          case 'loyalteez_claim_streak_milestone':
            return await handleClaimStreakMilestone(this.apiClient, args);
          case 'loyalteez_log_activity':
            return await handleLogActivity(this.apiClient, args);
          case 'loyalteez_calculate_reward':
            return await handleCalculateReward(this.apiClient, args);
          case 'loyalteez_update_leaderboard_stats':
            return await handleUpdateLeaderboardStats(this.apiClient, args);
          case 'loyalteez_get_user_balance':
            return await handleGetUserBalance(this.apiClient, args);
          case 'loyalteez_check_eligibility':
            return await handleCheckEligibility(this.apiClient, args);
          case 'loyalteez_get_user_stats':
            return await handleGetUserStats(this.apiClient, args);
          case 'loyalteez_relay_transaction':
            return await handleRelayTransaction(this.apiClient, args);
          case 'loyalteez_create_drop':
            return await handleCreateDrop(this.apiClient, args);
          case 'loyalteez_claim_drop':
            return await handleClaimDrop(this.apiClient, args);
          case 'loyalteez_process_third_party_event':
            return await handleProcessThirdPartyEvent(this.apiClient, args);
          case 'loyalteez_list_perks':
            return await handleListPerks(this.apiClient, args);
          case 'loyalteez_check_perk_eligibility':
            return await handleCheckPerkEligibility(this.apiClient, args);
          case 'loyalteez_redeem_perk':
            return await handleRedeemPerk(this.apiClient, args);
          case 'loyalteez_get_user_achievements':
            return await handleGetUserAchievements(this.apiClient, args);
          case 'loyalteez_update_achievement_progress':
            return await handleUpdateAchievementProgress(this.apiClient, args);
          default:
            throw new Error(`Tool "${name}" not yet implemented`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    });

    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      const resources = [];
      resources.push(...listDocResources());
      resources.push(...listContractResources());
      resources.push(...listNetworkResources());
      resources.push(...listEventTypeResources());
      resources.push(...listSharedServicesResources());
      resources.push(...listOAuthResources());
      return { resources };
    });

    // Read a resource
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      try {
        if (isDocResource(uri)) {
          return readDocResource(uri);
        }
        if (isContractResource(uri)) {
          return readContractResource(uri);
        }
        if (isNetworkResource(uri)) {
          return readNetworkResource(uri);
        }
        if (isEventTypeResource(uri)) {
          return readEventTypeResource(uri);
        }
        if (isSharedServicesResource(uri)) {
          return readSharedServicesResource(uri);
        }
        if (isOAuthResource(uri)) {
          return readOAuthResource(uri);
        }

        throw new Error(`Resource "${uri}" not found`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          contents: [
            {
              uri,
              mimeType: 'text/plain',
              text: `Error: ${errorMessage}`,
            },
          ],
        };
      }
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Loyalteez MCP Server running on stdio');
  }

  getAPIClient(): LoyalteezAPIClient {
    return this.apiClient;
  }

  getDefaultBrandId(): string | undefined {
    return this.defaultBrandId;
  }
}
