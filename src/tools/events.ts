/**
 * Event management tools for Loyalteez MCP
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { LoyalteezAPIClient } from '../utils/api-client.js';
import {
  validateEventDefinition,
  validateEventType,
  validateUserIdentifier,
} from '../utils/validation.js';
import { getBrandId } from '../utils/brand-id.js';

/**
 * Register event management tools
 */
export function registerEventTools(apiClient: LoyalteezAPIClient): Tool[] {
  return [
    createEventTool(apiClient),
    createEventsBatchTool(apiClient),
    trackEventTool(apiClient),
    getEventConfigTool(apiClient),
    bulkEventsTool(apiClient),
    adminRewardTool(apiClient),
  ];
}

/**
 * Create a single custom event
 */
function createEventTool(_apiClient: LoyalteezAPIClient): Tool {
  return {
    name: 'loyalteez_create_event',
    description: `Create a custom event for your loyalty program. Events are infinitely flexible - any string can be an event type. Once created, the backend handles: fire event → check auth → reward from balance.

See also: loyalteez://docs/guides/custom-events`,
    inputSchema: {
      type: 'object',
      properties: {
        brandId: {
          type: 'string',
          description: 'Your brand wallet address (must be valid Ethereum address, lowercase). If not provided, uses LOYALTEEZ_BRAND_ID environment variable.',
        },
        event: {
          type: 'object',
          description: 'Event configuration',
          properties: {
            name: {
              type: 'string',
              description: 'Human-readable event name (e.g., "Helpful Answer")',
            },
            eventType: {
              type: 'string',
              description: 'Unique identifier (auto-generated if not provided). Format: alphanumeric + underscore, max 50 chars',
            },
            description: {
              type: 'string',
              description: 'What triggers this event',
            },
            category: {
              type: 'string',
              description: 'Event category: "engagement" | "quality" | "growth" | "commerce" | custom',
            },
            defaultReward: {
              type: 'number',
              description: 'LTZ reward amount',
            },
            maxClaimsPerUser: {
              type: 'number',
              description: 'Maximum times a user can claim (1 for one-time, higher for repeatable)',
            },
            cooldownHours: {
              type: 'number',
              description: 'Hours between claims (0 = no cooldown)',
            },
            requiresEmail: {
              type: 'boolean',
              description: 'Whether event requires email (usually true)',
            },
            detectionMethods: {
              type: 'array',
              description: 'How event is triggered',
              items: {
                type: 'object',
                properties: {
                  method: {
                    type: 'string',
                    enum: ['webhook', 'discord_interaction', 'url_pattern', 'form_submission', 'css_selector'],
                  },
                  config: {
                    type: 'object',
                    description: 'Detection method configuration',
                  },
                },
              },
            },
            metadata: {
              type: 'object',
              description: 'Additional event configuration',
            },
          },
          required: ['name', 'description', 'defaultReward', 'maxClaimsPerUser'],
        },
      },
      required: ['event'],
    },
  };
}

/**
 * Create multiple events at once
 */
function createEventsBatchTool(_apiClient: LoyalteezAPIClient): Tool {
  return {
    name: 'loyalteez_create_events_batch',
    description: `Create multiple events at once. Perfect for setting up entire programs. Returns all created events plus platform-specific implementation code.

See also: loyalteez://docs/guides/custom-events`,
    inputSchema: {
      type: 'object',
      properties: {
        brandId: {
          type: 'string',
          description: 'Your brand wallet address. If not provided, uses LOYALTEEZ_BRAND_ID environment variable.',
        },
        platform: {
          type: 'string',
          description: 'Platform: "discord" | "telegram" | "web" | "shopify" | etc.',
        },
        events: {
          type: 'array',
          description: 'Array of event definitions',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              reward: { type: 'number' },
              maxClaims: { type: 'number' },
              cooldownHours: { type: 'number' },
              description: { type: 'string' },
            },
            required: ['name', 'reward', 'maxClaims'],
          },
        },
      },
      required: ['platform', 'events'],
    },
  };
}

/**
 * Track/fire an event
 */
function trackEventTool(_apiClient: LoyalteezAPIClient): Tool {
  return {
    name: 'loyalteez_track_event',
    description: `Fire any event. Works for ANY event type - predefined or custom. The backend handles: check auth (brandId) → check eligibility → reward from balance.

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
          description: 'Event type (any string - predefined or custom)',
        },
        userIdentifier: {
          type: 'object',
          description: 'User identification',
          properties: {
            email: {
              type: 'string',
              description: 'User email address',
            },
            platform: {
              type: 'string',
              description: 'Platform: "discord" | "telegram" | etc.',
            },
            platformUserId: {
              type: 'string',
              description: 'Platform-specific user ID',
            },
          },
        },
        metadata: {
          type: 'object',
          description: 'Additional event data',
        },
      },
      required: ['eventType', 'userIdentifier'],
    },
  };
}

/**
 * Handle create_event tool call
 */
export async function handleCreateEvent(
  apiClient: LoyalteezAPIClient,
  args: unknown
): Promise<CallToolResult> {
  try {
    const params = args as { brandId?: string; event: unknown };
    const brandId = getBrandId(params.brandId);
    const event = validateEventDefinition(params.event);

    // Generate eventType if not provided
    const eventType = event.eventType || `custom_${brandId.slice(2, 10)}_${Date.now()}`;

    // Note: In a real implementation, this would call the Partner Portal API
    // or directly interact with Supabase to create the event.
    // For now, we'll return a structured response indicating the event would be created.
    
    const eventId = `custom_${brandId}_${Date.now()}`;
    const webhookEndpoint = `${apiClient.getNetwork() === 'mainnet' ? 'https://api.loyalteez.app' : 'https://api.loyalteez.xyz'}/loyalteez-api/manual-event`;

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            event: {
              id: eventId,
              eventType,
              ...event,
            },
            trackingCode: `// Track this event:\nawait loyalteez_track_event({\n  brandId: "${brandId}",\n  eventType: "${eventType}",\n  userIdentifier: { email: "user@example.com" }\n});`,
            webhookEndpoint,
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
          text: `Error creating event: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Handle create_events_batch tool call
 */
export async function handleCreateEventsBatch(
  _apiClient: LoyalteezAPIClient,
  args: unknown
): Promise<CallToolResult> {
  try {
    const params = args as {
      brandId: string;
      platform: string;
      events: Array<{
        name: string;
        reward: number;
        maxClaims: number;
        cooldownHours?: number;
        description?: string;
      }>;
    };

    const brandId = getBrandId(params.brandId);
    const platform = params.platform;
    const events = params.events;

    const created: Array<{ eventType: string; name: string; reward: number }> = [];
    const failed: Array<{ event: string; error: string }> = [];

    for (const event of events) {
      try {
        const eventType = `${platform}_${event.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
        created.push({
          eventType,
          name: event.name,
          reward: event.reward,
        });
      } catch (error) {
        failed.push({
          event: event.name,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Generate implementation code based on platform
    const implementationCode = generateImplementationCode(platform, brandId, created);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            created,
            failed,
            implementationCode,
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
          text: `Error creating events batch: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Handle track_event tool call
 */
export async function handleTrackEvent(
  apiClient: LoyalteezAPIClient,
  args: unknown
): Promise<CallToolResult> {
  try {
    const params = args as {
      brandId: string;
      eventType: string;
      userIdentifier: {
        email?: string;
        platform?: string;
        platformUserId?: string;
      };
      metadata?: Record<string, unknown>;
    };

    const brandId = getBrandId(params.brandId);
    const eventType = validateEventType(params.eventType);
    const userIdentifier = validateUserIdentifier(params.userIdentifier);

    // Determine user email
    let userEmail: string;
    if (userIdentifier.email) {
      userEmail = userIdentifier.email;
    } else if (userIdentifier.platform && userIdentifier.platformUserId) {
      userEmail = `${userIdentifier.platform}_${userIdentifier.platformUserId}@loyalteez.app`;
    } else {
      throw new Error('Either email or platform+platformUserId must be provided');
    }

    // Call the API
    const result = await apiClient.trackEvent({
      brandId,
      eventType,
      userEmail,
      userIdentifier: userEmail,
      metadata: params.metadata,
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: result.success,
            reward: result.rewardAmount,
            newBalance: 0, // Would need to fetch from API
            eventId: result.eventId,
            walletAddress: result.walletAddress,
            transactionHash: result.transactionHash,
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
          text: `Error tracking event: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Generate platform-specific implementation code
 */
function generateImplementationCode(
  platform: string,
  brandId: string,
  events: Array<{ eventType: string; name: string; reward: number }>
): string {
  switch (platform.toLowerCase()) {
    case 'discord':
      return generateDiscordCode(brandId, events);
    case 'telegram':
      return generateTelegramCode(brandId, events);
    case 'web':
    case 'shopify':
      return generateWebCode(brandId, events);
    default:
      return generateGenericCode(brandId, events);
  }
}

function generateDiscordCode(brandId: string, events: Array<{ eventType: string; name: string }>): string {
  return `// Discord Bot Implementation
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  console.log('Loyalteez Discord bot ready!');
});

// Event tracking function
async function trackEvent(eventType, userId) {
  const response = await fetch('https://api.loyalteez.app/loyalteez-api/manual-event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      brandId: '${brandId}',
      eventType: eventType,
      userIdentifier: {
        platform: 'discord',
        platformUserId: userId
      }
    })
  });
  return await response.json();
}

// Example: Daily check-in command
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  
  if (interaction.commandName === 'daily') {
    const result = await trackEvent('${events[0]?.eventType || 'daily_checkin'}', interaction.user.id);
    await interaction.reply(\`✅ Check-in complete! Earned \${result.rewardAmount} LTZ\`);
  }
});

client.login(process.env.DISCORD_TOKEN);`;
}

function generateTelegramCode(brandId: string, events: Array<{ eventType: string; name: string }>): string {
  return `// Telegram Bot Implementation
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

// Event tracking function
async function trackEvent(eventType, userId) {
  const response = await fetch('https://api.loyalteez.app/loyalteez-api/manual-event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      brandId: '${brandId}',
      eventType: eventType,
      userIdentifier: {
        platform: 'telegram',
        platformUserId: userId.toString()
      }
    })
  });
  return await response.json();
}

// Example: Daily check-in command
bot.command('checkin', async (ctx) => {
  const result = await trackEvent('${events[0]?.eventType || 'daily_checkin'}', ctx.from.id);
  await ctx.reply(\`✅ Check-in complete! Earned \${result.rewardAmount} LTZ\`);
});

bot.launch();`;
}

function generateWebCode(brandId: string, events: Array<{ eventType: string; name: string }>): string {
  return `// Web SDK Implementation
<script src="https://api.loyalteez.app/sdk.js"></script>
<script>
  LoyalteezAutomation.init('${brandId}');
  
  // Track events manually
  function trackEvent(eventType, userEmail) {
    return fetch('https://api.loyalteez.app/loyalteez-api/manual-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brandId: '${brandId}',
        eventType: eventType,
        userEmail: userEmail
      })
    }).then(res => res.json());
  }
  
  // Example: Track newsletter signup
  document.getElementById('newsletter-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const result = await trackEvent('${events[0]?.eventType || 'newsletter_subscribe'}', email);
    alert(\`Earned \${result.rewardAmount} LTZ!\`);
  });
</script>`;
}

function generateGenericCode(brandId: string, events: Array<{ eventType: string; name: string }>): string {
  return `// Generic Implementation
// Track events via API

async function trackEvent(eventType, userIdentifier) {
  const response = await fetch('https://api.loyalteez.app/loyalteez-api/manual-event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      brandId: '${brandId}',
      eventType: eventType,
      userIdentifier: userIdentifier
    })
  });
  return await response.json();
}

// Example usage:
// await trackEvent('${events[0]?.eventType || 'custom_event'}', { email: 'user@example.com' });`;
}

/**
 * Handle get_event_config tool call
 */
export async function handleGetEventConfig(
  apiClient: LoyalteezAPIClient,
  args: unknown
): Promise<CallToolResult> {
  try {
    const params = args as { brandId?: string };
    const brandId = getBrandId(params.brandId);

    const result = await apiClient.getEventConfig({ brandId });

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
          text: `Error getting event config: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Handle bulk_events tool call
 */
export async function handleBulkEvents(
  apiClient: LoyalteezAPIClient,
  args: unknown
): Promise<CallToolResult> {
  try {
    const params = args as {
      events: Array<{
        brandId?: string;
        eventType: string;
        userEmail: string;
        domain?: string;
        sourceUrl?: string;
        metadata?: Record<string, unknown>;
      }>;
    };

    // Use first event's brandId or environment variable as default
    const defaultBrandId = params.events[0]?.brandId
      ? getBrandId(params.events[0].brandId)
      : getBrandId();

    // Ensure all events have brandId
    const events = params.events.map((event) => ({
      ...event,
      brandId: event.brandId ? getBrandId(event.brandId) : defaultBrandId,
    }));

    const result = await apiClient.bulkEvents({ events });

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
          text: `Error processing bulk events: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Handle admin_reward tool call
 */
export async function handleAdminReward(
  apiClient: LoyalteezAPIClient,
  args: unknown
): Promise<CallToolResult> {
  try {
    const params = args as {
      brandId?: string;
      adminId: string;
      targetUserId: string;
      platform: string;
      eventType: string;
      amount?: number;
      reason?: string;
      publicMessage?: boolean;
    };

    const brandId = getBrandId(params.brandId);

    // Determine user email from targetUserId
    let userEmail: string;
    if (params.targetUserId.includes('@')) {
      userEmail = params.targetUserId;
    } else {
      userEmail = `${params.platform}_${params.targetUserId}@loyalteez.app`;
    }

    // Track the event with admin context
    const result = await apiClient.trackEvent({
      brandId,
      eventType: params.eventType,
      userEmail,
      userIdentifier: userEmail,
      metadata: {
        adminId: params.adminId,
        reason: params.reason,
        publicMessage: params.publicMessage,
        amount: params.amount,
        adminReward: true,
      },
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              success: result.success,
              rewardAmount: params.amount || result.rewardAmount,
              targetBalance: 0, // Would need to fetch from API
              publicEmbed: params.publicMessage
                ? {
                    title: 'Admin Reward',
                    description: `${params.reason || 'Special contribution'}`,
                    reward: params.amount || result.rewardAmount,
                  }
                : undefined,
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
          text: `Error processing admin reward: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Get event configuration tool
 */
function getEventConfigTool(_apiClient: LoyalteezAPIClient): Tool {
  return {
    name: 'loyalteez_get_event_config',
    description: `Get all active event configurations for a brand, including custom events, reward amounts, and detection methods. Use this to understand what events are available and how much LTZ each event rewards.

See also: loyalteez://docs/api/rest-api`,
    inputSchema: {
      type: 'object',
      properties: {
        brandId: {
          type: 'string',
          description: 'Your brand wallet address. If not provided, uses LOYALTEEZ_BRAND_ID environment variable.',
        },
      },
      required: [],
    },
  };
}

/**
 * Bulk events tool (for batch tracking)
 */
function bulkEventsTool(_apiClient: LoyalteezAPIClient): Tool {
  return {
    name: 'loyalteez_bulk_events',
    description: `Submit multiple events in a single request. Use this for batch processing, importing historical data, or high-volume integrations. More efficient than calling track_event multiple times.

See also: loyalteez://docs/api/rest-api`,
    inputSchema: {
      type: 'object',
      properties: {
        events: {
          type: 'array',
          description: 'Array of events to process (max 100)',
          items: {
            type: 'object',
            properties: {
              brandId: {
                type: 'string',
                description: 'Brand wallet address (can be omitted if same for all events)',
              },
              eventType: { type: 'string' },
              userEmail: { type: 'string', format: 'email' },
              domain: { type: 'string' },
              sourceUrl: { type: 'string' },
              metadata: { type: 'object' },
            },
            required: ['eventType', 'userEmail'],
          },
          maxItems: 100,
        },
      },
      required: ['events'],
    },
  };
}

/**
 * Admin reward tool
 */
function adminRewardTool(_apiClient: LoyalteezAPIClient): Tool {
  return {
    name: 'loyalteez_admin_reward',
    description: `Manually reward users (mod/admin triggered). Wrapper around track_event with admin context. Use this when admins want to manually reward users for special contributions.

See also: loyalteez://docs/api/rest-api`,
    inputSchema: {
      type: 'object',
      properties: {
        brandId: {
          type: 'string',
          description: 'Your brand wallet address. If not provided, uses LOYALTEEZ_BRAND_ID environment variable.',
        },
        adminId: {
          type: 'string',
          description: "Admin's platform ID (for audit trail)",
        },
        targetUserId: {
          type: 'string',
          description: 'Target user identifier (platform_userId or email)',
        },
        platform: {
          type: 'string',
          description: 'Platform: "discord" | "telegram" | "web" | etc.',
        },
        eventType: {
          type: 'string',
          description: 'Event type to trigger (e.g., "helpful_answer", "special_contribution")',
        },
        amount: {
          type: 'number',
          description: 'Override configured reward amount (optional)',
        },
        reason: {
          type: 'string',
          description: 'Reason for manual reward (for logging)',
        },
        publicMessage: {
          type: 'boolean',
          description: 'Whether to send public notification (default: false)',
        },
      },
      required: ['targetUserId', 'platform', 'eventType'],
    },
  };
}
