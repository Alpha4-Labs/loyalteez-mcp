/**
 * Program design tool - AI-powered loyalty program generation
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { LoyalteezAPIClient } from '../utils/api-client.js';
import { validateProgramContext } from '../utils/validation.js';
import { getBrandId } from '../utils/brand-id.js';
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
          description: 'Your brand wallet address. If not provided, uses LOYALTEEZ_BRAND_ID environment variable.',
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
      required: ['context'],
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
      brandId?: string;
      context: {
        appType: string;
        goals: string[];
        platforms: string[];
        budget?: { monthly_ltz: number; avg_reward: number };
        audience?: string;
        existingEvents?: string[];
      };
    };

    const brandId = getBrandId(params.brandId);
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
  const brandId = program.brandId || 'YOUR_BRAND_ID';
  
  return `// Discord Bot Implementation for ${program.name}
// TypeScript types and error handling included

import { Client, GatewayIntentBits, Events, Message } from 'discord.js';

interface TrackEventResult {
  success: boolean;
  rewardAmount?: number;
  eventId?: string;
  error?: string;
}

class LoyaltyBot {
  private client: Client;
  private brandId: string;
  private apiUrl = 'https://api.loyalteez.app';

  constructor(brandId: string) {
    this.brandId = brandId;
    this.client = new Client({ 
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] 
    });
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.client.once(Events.ClientReady, () => {
      console.log('Loyalty bot ready!');
    });

    this.client.on(Events.MessageCreate, async (message: Message) => {
      // Handle message-based events
      if (message.author.bot) return;
      
      // Example: Track helpful answers (you can customize this)
      // await this.trackEvent('helpful_answer', message.author.id);
    });
  }

  async trackEvent(eventType: string, userId: string, metadata?: Record<string, unknown>): Promise<TrackEventResult> {
    try {
      const response = await fetch(\`\${this.apiUrl}/loyalteez-api/manual-event\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandId: this.brandId,
          eventType: eventType,
          userIdentifier: {
            platform: 'discord',
            platformUserId: userId
          },
          metadata: metadata || {}
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(\`API error: \${error.message || response.statusText}\`);
      }

      const result = await response.json();
      return {
        success: result.success || false,
        rewardAmount: result.rewardAmount,
        eventId: result.eventId,
      };
    } catch (error) {
      console.error(\`Error tracking event \${eventType}:\`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async start(): Promise<void> {
    await this.client.login(process.env.DISCORD_TOKEN);
  }
}

// Initialize bot
const bot = new LoyaltyBot('${brandId}');
bot.start().catch(console.error);

// Example commands for your events:
${program.events.map(e => `// ${e.name}: ${e.description}`).join('\n')}

// Test file: bot.test.ts
\`\`\`typescript
import { describe, it, expect, vi } from 'vitest';
import { LoyaltyBot } from './bot';

describe('LoyaltyBot', () => {
  it('should track events successfully', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, rewardAmount: 100 }),
    });

    const bot = new LoyaltyBot('test-brand-id');
    const result = await bot.trackEvent('test_event', '123456');

    expect(result.success).toBe(true);
    expect(result.rewardAmount).toBe(100);
  });

  it('should handle API errors gracefully', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      statusText: 'Bad Request',
      json: async () => ({ message: 'Invalid event type' }),
    });

    const bot = new LoyaltyBot('test-brand-id');
    const result = await bot.trackEvent('invalid_event', '123456');

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
\`\`\``;
}

function generateTelegramBotCode(program: ProgramDesign): string {
  const brandId = program.brandId || 'YOUR_BRAND_ID';
  
  return `// Telegram Bot Implementation for ${program.name}
// TypeScript types and error handling included

import { Telegraf, Context } from 'telegraf';

interface TrackEventResult {
  success: boolean;
  rewardAmount?: number;
  eventId?: string;
  error?: string;
}

class LoyaltyTelegramBot {
  private bot: Telegraf;
  private brandId: string;
  private apiUrl = 'https://api.loyalteez.app';

  constructor(brandId: string, token: string) {
    this.brandId = brandId;
    this.bot = new Telegraf(token);
    this.setupCommands();
  }

  private setupCommands(): void {
    this.bot.command('checkin', async (ctx: Context) => {
      try {
        const result = await this.trackEvent('daily_checkin', ctx.from?.id.toString() || '');
        if (result.success) {
          await ctx.reply(\`✅ Check-in successful! You earned \${result.rewardAmount} LTZ!\`);
        } else {
          await ctx.reply(\`❌ Check-in failed: \${result.error}\`);
        }
      } catch (error) {
        await ctx.reply('❌ An error occurred. Please try again later.');
        console.error('Check-in error:', error);
      }
    });

    this.bot.command('balance', async (ctx: Context) => {
      // Implement balance check
      await ctx.reply('Balance feature coming soon!');
    });
  }

  async trackEvent(eventType: string, userId: string, metadata?: Record<string, unknown>): Promise<TrackEventResult> {
    try {
      const response = await fetch(\`\${this.apiUrl}/loyalteez-api/manual-event\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandId: this.brandId,
          eventType: eventType,
          userIdentifier: {
            platform: 'telegram',
            platformUserId: userId
          },
          metadata: metadata || {}
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(\`API error: \${error.message || response.statusText}\`);
      }

      const result = await response.json();
      return {
        success: result.success || false,
        rewardAmount: result.rewardAmount,
        eventId: result.eventId,
      };
    } catch (error) {
      console.error(\`Error tracking event \${eventType}:\`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async start(): Promise<void> {
    await this.bot.launch();
    console.log('Telegram bot started!');
  }
}

// Initialize bot
const bot = new LoyaltyTelegramBot('${brandId}', process.env.TELEGRAM_TOKEN!);
bot.start().catch(console.error);

// Example events:
${program.events.map(e => `// ${e.name}: ${e.description}`).join('\n')}

// Test file: bot.test.ts
\`\`\`typescript
import { describe, it, expect, vi } from 'vitest';
import { LoyaltyTelegramBot } from './bot';

describe('LoyaltyTelegramBot', () => {
  it('should track events successfully', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, rewardAmount: 50 }),
    });

    const bot = new LoyaltyTelegramBot('test-brand-id', 'test-token');
    const result = await bot.trackEvent('daily_checkin', '123456');

    expect(result.success).toBe(true);
    expect(result.rewardAmount).toBe(50);
  });
});
\`\`\``;
}

function generateWebSDKCode(program: ProgramDesign): string {
  const brandId = program.brandId || 'YOUR_BRAND_ID';
  
  return `// Web SDK Implementation for ${program.name}
// TypeScript types and error handling included

// HTML
<script src="https://api.loyalteez.app/sdk.js"></script>

// TypeScript/JavaScript
interface LoyaltyConfig {
  brandId: string;
  debug?: boolean;
  autoDetect?: boolean;
  onRewardReceived?: (reward: { amount: number; eventType: string }) => void;
  onError?: (error: Error) => void;
}

class LoyaltyTracker {
  private config: LoyaltyConfig;

  constructor(config: LoyaltyConfig) {
    this.config = config;
    this.initialize();
  }

  private initialize(): void {
    try {
      LoyalteezAutomation.init(this.config.brandId, {
        debug: this.config.debug || false,
        autoDetect: this.config.autoDetect !== false,
        onRewardReceived: (reward) => {
          console.log(\`🎉 Earned \${reward.amount} LTZ for \${reward.eventType}!\`);
          this.config.onRewardReceived?.(reward);
        },
        onError: (error) => {
          console.error('Loyalty tracking error:', error);
          this.config.onError?.(error);
        },
      });
    } catch (error) {
      console.error('Failed to initialize Loyalty SDK:', error);
      this.config.onError?.(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  trackEvent(eventType: string, metadata?: Record<string, unknown>): void {
    try {
      LoyalteezAutomation.track(eventType, {
        userEmail: this.getUserEmail(),
        metadata: metadata || {},
      });
    } catch (error) {
      console.error(\`Error tracking event \${eventType}:\`, error);
      this.config.onError?.(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  private getUserEmail(): string {
    // Implement your user email retrieval logic
    // This is a placeholder
    return 'user@example.com';
  }
}

// Initialize tracker
const loyaltyTracker = new LoyaltyTracker({
  brandId: '${brandId}',
  debug: process.env.NODE_ENV === 'development',
  onRewardReceived: (reward) => {
    // Show notification to user
    showNotification(\`You earned \${reward.amount} LTZ!\`);
  },
  onError: (error) => {
    // Handle errors gracefully
    console.error('Loyalty error:', error);
  },
});

// Events configured:
${program.events.map(e => `// ${e.name}: ${e.description}`).join('\n')}

// Test file: loyalty.test.ts
\`\`\`typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoyaltyTracker } from './loyalty';

// Mock SDK
global.LoyalteezAutomation = {
  init: vi.fn(),
  track: vi.fn(),
};

describe('LoyaltyTracker', () => {
  let tracker: LoyaltyTracker;

  beforeEach(() => {
    vi.clearAllMocks();
    tracker = new LoyaltyTracker({
      brandId: 'test-brand-id',
      debug: false,
    });
  });

  it('should initialize SDK on construction', () => {
    expect(global.LoyalteezAutomation.init).toHaveBeenCalledWith(
      'test-brand-id',
      expect.any(Object)
    );
  });

  it('should track events', () => {
    tracker.trackEvent('test_event', { key: 'value' });
    expect(global.LoyalteezAutomation.track).toHaveBeenCalledWith(
      'test_event',
      expect.objectContaining({
        metadata: { key: 'value' },
      })
    );
  });
});
\`\`\``;
}

function generateWebhookCode(program: ProgramDesign): string {
  const brandId = program.brandId || 'YOUR_BRAND_ID';
  
  return `// Webhook Handler for ${program.name}
// POST endpoint: /webhooks/loyalteez
// Includes signature verification and error handling

import express from 'express';
import crypto from 'crypto';

const app = express();

// Middleware to capture raw body for signature verification
app.use('/webhooks/loyalteez', express.raw({ type: 'application/json' }));

interface WebhookEvent {
  type: string;
  data: {
    userEmail: string;
    eventType?: string;
    amount?: number;
    [key: string]: unknown;
  };
}

interface TrackEventResult {
  success: boolean;
  rewardAmount?: number;
  eventId?: string;
  error?: string;
}

async function trackEvent(
  eventType: string,
  userEmail: string,
  metadata?: Record<string, unknown>
): Promise<TrackEventResult> {
  try {
    const response = await fetch('https://api.loyalteez.app/loyalteez-api/manual-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brandId: '${brandId}',
        eventType: eventType,
        userEmail: userEmail,
        metadata: metadata || {}
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(\`API error: \${error.message || response.statusText}\`);
    }

    const result = await response.json();
    return {
      success: result.success || false,
      rewardAmount: result.rewardAmount,
      eventId: result.eventId,
    };
  } catch (error) {
    console.error(\`Error tracking event \${eventType}:\`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

function verifyWebhookSignature(
  payload: Buffer,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

app.post('/webhooks/loyalteez', async (req, res) => {
  try {
    const signature = req.headers['x-loyalteez-signature'] as string;
    const webhookSecret = process.env.LOYALTEEZ_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      return res.status(401).json({ error: 'Missing signature or secret' });
    }

    // Verify signature
    if (!verifyWebhookSignature(req.body as Buffer, signature, webhookSecret)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Parse webhook payload
    const event: WebhookEvent = JSON.parse((req.body as Buffer).toString());

    // Process webhook event
    switch (event.type) {
      case 'reward.distributed':
        console.log(\`User \${event.data.userEmail} earned \${event.data.amount} LTZ\`);
        // Your reward handling logic
        break;

      case 'perk.redeemed':
        console.log(\`User \${event.data.userEmail} redeemed perk\`);
        // Your perk handling logic
        break;

      default:
        console.log(\`Unhandled event type: \${event.type}\`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Test file: webhook.test.ts
\`\`\`typescript
import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from './app';

describe('Webhook Handler', () => {
  it('should verify webhook signature', async () => {
    const payload = JSON.stringify({ type: 'test', data: {} });
    const secret = 'test-secret';
    const signature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    const response = await request(app)
      .post('/webhooks/loyalteez')
      .set('X-Loyalteez-Signature', signature)
      .send(payload);

    expect(response.status).toBe(200);
  });

  it('should reject invalid signature', async () => {
    const response = await request(app)
      .post('/webhooks/loyalteez')
      .set('X-Loyalteez-Signature', 'invalid-signature')
      .send(JSON.stringify({ type: 'test', data: {} }));

    expect(response.status).toBe(401);
  });
});
\`\`\``;
}
