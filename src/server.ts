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
import { registerEventTools, handleCreateEvent, handleCreateEventsBatch, handleTrackEvent } from './tools/events.js';
import { registerProgramDesignTool, handleDesignProgram } from './tools/program-design.js';
import { registerIdentityTool, handleResolveUser } from './tools/identity.js';
import { registerEngagementTools, handleStreakCheckin, handleGetLeaderboard } from './tools/engagement.js';

// Resource imports
import { initializeDocs, listDocResources, readDocResource, isDocResource } from './resources/docs.js';

export class LoyalteezMCPServer {
  private server: Server;
  private apiClient: LoyalteezAPIClient;

  constructor(network: Network = 'mainnet') {
    this.apiClient = new LoyalteezAPIClient(network);
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
          case 'loyalteez_design_program':
            return await handleDesignProgram(this.apiClient, args);
          case 'loyalteez_resolve_user':
            return await handleResolveUser(this.apiClient, args);
          case 'loyalteez_streak_checkin':
            return await handleStreakCheckin(this.apiClient, args);
          case 'loyalteez_get_leaderboard':
            return await handleGetLeaderboard(this.apiClient, args);
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
      const resources = listDocResources();
      return { resources };
    });

    // Read a resource
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      try {
        if (isDocResource(uri)) {
          return readDocResource(uri);
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
}
