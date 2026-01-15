/**
 * Program design tool - AI-powered loyalty program generation
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { LoyalteezAPIClient } from '../utils/api-client.js';
import { validateBrandId, validateProgramContext } from '../utils/validation.js';
import { loadDocumentation, searchDocs, type DocIndex } from '../utils/doc-loader.js';
import type { EventDefinition, ProgramDesign, ImplementationCode } from '../types/index.js';

/**
 * Register program design tool
 */
export function registerProgramDesignTool(apiClient: LoyalteezAPIClient): Tool[] {
  return [designProgramTool(apiClient)];
}

/**
 * Design program tool
 */
function designProgramTool(_apiClient: LoyalteezAPIClient): Tool {
  return {
    name: 'loyalteez_design_program',
    description: `Design a complete loyalty program from context. AI analyzes your app/community and generates optimal event structure, tiers, streaks, and implementation code.

Uses documentation context to generate platform-specific implementations and best practices.

See also: 
- loyalteez://docs/architecture
- loyalteez://docs/integrations/discord
- loyalteez://docs/integrations/telegram
- loyalteez://docs/guides/custom-events`,
    inputSchema: {
      type: 'object',
      properties: {
        brandId: {
          type: 'string',
          description: 'Your brand wallet address',
        },
        context: {
          type: 'object',
          description: 'Program context and requirements',
          properties: {
            appType: {
              type: 'string',
              description: 'Application type: "discord_community" | "telegram_group" | "ecommerce" | "gaming" | "saas"',
            },
            goals: {
              type: 'array',
              description: 'Program goals: ["increase_engagement", "drive_purchases", "reward_quality", etc.]',
              items: { type: 'string' },
            },
            platforms: {
              type: 'array',
              description: 'Target platforms: ["discord", "telegram", "web", etc.]',
              items: { type: 'string' },
            },
            budget: {
              type: 'object',
              description: 'Budget constraints',
              properties: {
                monthly_ltz: { type: 'number' },
                avg_reward: { type: 'number' },
              },
            },
            audience: {
              type: 'string',
              description: 'Target audience: "developers" | "gamers" | "shoppers" | etc.',
            },
            existingEvents: {
              type: 'array',
              description: 'Events you already have (optional)',
              items: { type: 'string' },
            },
          },
          required: ['appType', 'goals', 'platforms'],
        },
      },
      required: ['brandId', 'context'],
    },
  };
}

/**
 * Handle design_program tool call
 */
export async function handleDesignProgram(
  _apiClient: LoyalteezAPIClient,
  args: unknown
): Promise<CallToolResult> {
  try {
    const params = args as {
      brandId: string;
      context: {
        appType: string;
        goals: string[];
        platforms: string[];
        budget?: { monthly_ltz: number; avg_reward: number };
        audience?: string;
        existingEvents?: string[];
      };
    };

    const brandId = validateBrandId(params.brandId);
    const context = validateProgramContext(params.context);

    // Load relevant documentation for context
    const docIndex = loadDocumentation();
    const relevantDocs = searchDocs(context.appType, docIndex);

    // Generate program design based on context
    const program = generateProgramDesign(brandId, context, docIndex);

    // Generate implementation code
    const implementation = generateImplementationCode(context, program);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            program,
            implementation,
            documentation: {
              relevant: relevantDocs.slice(0, 5).map(doc => ({
                uri: doc.uri,
                title: doc.title,
              })),
            },
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
          text: `Error designing program: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Generate program design from context
 */
function generateProgramDesign(
  _brandId: string,
  context: {
    appType: string;
    goals: string[];
    platforms: string[];
    budget?: { monthly_ltz: number; avg_reward: number };
    audience?: string;
    existingEvents?: string[];
  },
  _docIndex: DocIndex
): ProgramDesign {
  const appType = context.appType.toLowerCase();
  const goals = context.goals.map(g => g.toLowerCase());
  const platforms = context.platforms.map(p => p.toLowerCase());
  const budget = context.budget || { monthly_ltz: 50000, avg_reward: 25 };

  // Generate events based on app type and goals
  const events: EventDefinition[] = generateEvents(appType, goals, platforms, budget);

  // Generate program name and philosophy
  const name = generateProgramName(appType, context.audience);
  const philosophy = generatePhilosophy(appType, goals);

  // Generate tiers if applicable
  const tiers = generateTiers(goals);

  // Generate streak config
  const streakConfig = generateStreakConfig(budget);

  return {
    name,
    philosophy,
    events,
    tiers,
    streakConfig,
    estimatedBudget: budget,
  };
}

/**
 * Generate events based on context
 */
function generateEvents(
  appType: string,
  goals: string[],
  platforms: string[],
  budget: { monthly_ltz: number; avg_reward: number }
): EventDefinition[] {
  const events: EventDefinition[] = [];

  // Base events for all platforms
  if (goals.includes('increase_engagement') || goals.includes('engagement')) {
    events.push({
      name: 'Daily Check-in',
      description: 'Daily check-in reward',
      category: 'engagement',
      defaultReward: Math.floor(budget.avg_reward * 0.4),
      maxClaimsPerUser: 1,
      cooldownHours: 24,
      requiresEmail: true,
    });
  }

  // Platform-specific events
  if (platforms.includes('discord')) {
    if (goals.includes('reward_quality') || goals.includes('quality')) {
      events.push({
        name: 'Helpful Answer',
        description: 'Recognized for helping another member',
        category: 'quality',
        defaultReward: Math.floor(budget.avg_reward * 2),
        maxClaimsPerUser: 100,
        cooldownHours: 1,
        requiresEmail: false,
        detectionMethods: [{
          method: 'discord_interaction',
          config: { command: '/reward helpful_answer' },
        }],
      });
    }
  }

  if (platforms.includes('telegram')) {
    events.push({
      name: 'Daily Check-in',
      description: 'Daily /checkin command',
      category: 'engagement',
      defaultReward: Math.floor(budget.avg_reward * 0.4),
      maxClaimsPerUser: 1,
      cooldownHours: 24,
      requiresEmail: false,
    });
  }

  if (appType.includes('ecommerce') || platforms.includes('shopify')) {
    if (goals.includes('drive_purchases') || goals.includes('purchases')) {
      events.push({
        name: 'First Purchase',
        description: 'Customer\'s first order',
        category: 'commerce',
        defaultReward: Math.floor(budget.avg_reward * 8),
        maxClaimsPerUser: 1,
        cooldownHours: 0,
        requiresEmail: true,
      });
    }
  }

  if (appType.includes('gaming')) {
    events.push({
      name: 'Daily Quest',
      description: 'Completed daily quest',
      category: 'engagement',
      defaultReward: Math.floor(budget.avg_reward * 0.6),
      maxClaimsPerUser: 3,
      cooldownHours: 24,
      requiresEmail: false,
    });
  }

  return events;
}

/**
 * Generate program name
 */
function generateProgramName(appType: string, audience?: string): string {
  if (audience) {
    return `${audience.charAt(0).toUpperCase() + audience.slice(1)} Loyalty Program`;
  }
  if (appType.includes('discord')) return 'Community Loyalty Program';
  if (appType.includes('telegram')) return 'Telegram Rewards Program';
  if (appType.includes('ecommerce')) return 'Customer Loyalty Program';
  if (appType.includes('gaming')) return 'Gaming Rewards Program';
  return 'Loyalty Program';
}

/**
 * Generate program philosophy
 */
function generatePhilosophy(_appType: string, goals: string[]): string {
  const parts: string[] = [];
  
  if (goals.includes('reward_quality')) {
    parts.push('Rewarding quality contributions and helpful behavior');
  }
  if (goals.includes('increase_engagement')) {
    parts.push('Encouraging daily engagement and participation');
  }
  if (goals.includes('drive_purchases')) {
    parts.push('Incentivizing purchases and customer loyalty');
  }

  return parts.join('. ') || 'Building a loyal and engaged community';
}

/**
 * Generate tier configuration
 */
function generateTiers(goals: string[]): Array<{ name: string; minPoints: number; benefits: string[] }> {
  if (!goals.includes('tiers') && !goals.includes('progression')) {
    return [];
  }

  return [
    {
      name: 'Bronze',
      minPoints: 0,
      benefits: ['Access to basic perks', 'Entry-level rewards'],
    },
    {
      name: 'Silver',
      minPoints: 1000,
      benefits: ['Exclusive perks', 'Priority support', 'Bonus multipliers'],
    },
    {
      name: 'Gold',
      minPoints: 5000,
      benefits: ['Premium perks', 'VIP access', 'Highest multipliers'],
    },
  ];
}

/**
 * Generate streak configuration
 */
function generateStreakConfig(budget: { monthly_ltz: number; avg_reward: number }): {
  baseReward: number;
  multipliers: Array<{ days: number; multiplier: number }>;
  gracePeriod: number;
} {
  return {
    baseReward: Math.floor(budget.avg_reward * 0.4),
    multipliers: [
      { days: 7, multiplier: 1.25 },
      { days: 14, multiplier: 1.5 },
      { days: 30, multiplier: 2.0 },
    ],
    gracePeriod: 1,
  };
}

/**
 * Generate implementation code
 */
function generateImplementationCode(
  context: {
    appType: string;
    platforms: string[];
  },
  program: ProgramDesign
): ImplementationCode {
  const implementation: ImplementationCode = {};

  if (context.platforms.includes('discord')) {
    implementation.discord = generateDiscordBotCode(program);
  }

  if (context.platforms.includes('telegram')) {
    implementation.telegram = generateTelegramBotCode(program);
  }

  if (context.platforms.includes('web') || context.platforms.includes('shopify')) {
    implementation.web = generateWebSDKCode(program);
  }

  implementation.webhooks = generateWebhookCode(program);

  return implementation;
}

function generateDiscordBotCode(program: ProgramDesign): string {
  return `// Discord Bot Implementation for ${program.name}
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.on('ready', () => {
  console.log('Loyalty bot ready!');
});

// Track event function
async function trackEvent(eventType, userId) {
  const response = await fetch('https://api.loyalteez.app/loyalteez-api/manual-event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      brandId: 'YOUR_BRAND_ID',
      eventType: eventType,
      userIdentifier: {
        platform: 'discord',
        platformUserId: userId
      }
    })
  });
  return await response.json();
}

// Example commands for your events:
// ${program.events.map(e => `// ${e.name}: ${e.description}`).join('\n// ')}

client.login(process.env.DISCORD_TOKEN);`;
}

function generateTelegramBotCode(program: ProgramDesign): string {
  return `// Telegram Bot Implementation for ${program.name}
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

// Track event function
async function trackEvent(eventType, userId) {
  const response = await fetch('https://api.loyalteez.app/loyalteez-api/manual-event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      brandId: 'YOUR_BRAND_ID',
      eventType: eventType,
      userIdentifier: {
        platform: 'telegram',
        platformUserId: userId.toString()
      }
    })
  });
  return await response.json();
}

// Example commands:
// ${program.events.map(e => `// ${e.name}: ${e.description}`).join('\n// ')}

bot.launch();`;
}

function generateWebSDKCode(program: ProgramDesign): string {
  return `// Web SDK Implementation for ${program.name}
<script src="https://api.loyalteez.app/sdk.js"></script>
<script>
  LoyalteezAutomation.init('YOUR_BRAND_ID');
  
  // Events are automatically tracked based on your configuration
  // ${program.events.map(e => `// ${e.name}: ${e.description}`).join('\n  // ')}
</script>`;
}

function generateWebhookCode(program: ProgramDesign): string {
  return `// Webhook Handler for ${program.name}
// POST endpoint: /webhooks/loyalteez

app.post('/webhooks/loyalteez', async (req, res) => {
  const { eventType, userEmail, metadata } = req.body;
  
  const response = await fetch('https://api.loyalteez.app/loyalteez-api/manual-event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      brandId: 'YOUR_BRAND_ID',
      eventType: eventType,
      userEmail: userEmail,
      metadata: metadata
    })
  });
  
  const result = await response.json();
  res.json(result);
});`;
}
