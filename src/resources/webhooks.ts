/**
 * Webhook event types and examples resource
 */

import type { Resource } from '@modelcontextprotocol/sdk/types.js';

const WEBHOOK_EVENTS = {
  eventTypes: [
    {
      type: 'reward.distributed',
      description: 'Fired when LTZ is distributed to a user',
      data: {
        userEmail: 'string',
        amount: 'number',
        eventType: 'string',
        transactionHash: 'string',
        timestamp: 'string',
      },
      example: {
        id: 'evt_1234567890',
        type: 'reward.distributed',
        created: '2026-01-15T10:30:00Z',
        data: {
          userEmail: 'user@example.com',
          amount: 100,
          eventType: 'account_creation',
          transactionHash: '0x1234...5678',
          timestamp: '2026-01-15T10:30:00Z',
        },
      },
    },
    {
      type: 'perk.redeemed',
      description: 'Fired when a user redeems a perk',
      data: {
        userEmail: 'string',
        perkId: 'string',
        perkName: 'string',
        redemptionCode: 'string',
        timestamp: 'string',
      },
      example: {
        id: 'evt_1234567891',
        type: 'perk.redeemed',
        created: '2026-01-15T10:35:00Z',
        data: {
          userEmail: 'user@example.com',
          perkId: 'perk_abc123',
          perkName: '10% Discount Code',
          redemptionCode: 'SAVE10',
          timestamp: '2026-01-15T10:35:00Z',
        },
      },
    },
    {
      type: 'streak.milestone',
      description: 'Fired when a user reaches a streak milestone',
      data: {
        userEmail: 'string',
        milestoneDays: 'number',
        bonusAmount: 'number',
        timestamp: 'string',
      },
      example: {
        id: 'evt_1234567892',
        type: 'streak.milestone',
        created: '2026-01-15T10:40:00Z',
        data: {
          userEmail: 'user@example.com',
          milestoneDays: 7,
          bonusAmount: 100,
          timestamp: '2026-01-15T10:40:00Z',
        },
      },
    },
    {
      type: 'achievement.unlocked',
      description: 'Fired when a user unlocks an achievement',
      data: {
        userEmail: 'string',
        achievementId: 'string',
        achievementName: 'string',
        timestamp: 'string',
      },
      example: {
        id: 'evt_1234567893',
        type: 'achievement.unlocked',
        created: '2026-01-15T10:45:00Z',
        data: {
          userEmail: 'user@example.com',
          achievementId: 'ach_xyz789',
          achievementName: 'First Purchase',
          timestamp: '2026-01-15T10:45:00Z',
        },
      },
    },
  ],
  signatureVerification: {
    algorithm: 'HMAC-SHA256',
    header: 'X-Loyalteez-Signature',
    description: 'All webhooks include a signature in the X-Loyalteez-Signature header. Always verify this signature before processing events.',
    example: {
      header: 'X-Loyalteez-Signature: abc123def456...',
      verification: 'HMAC-SHA256(webhook_secret, raw_body)',
    },
  },
  bestPractices: [
    'Always verify webhook signatures',
    'Use HTTPS for webhook endpoints',
    'Implement idempotency (store processed webhook IDs)',
    'Add rate limiting to webhook endpoints',
    'Validate webhook payload structure',
    'Handle errors gracefully',
    'Log all webhook events for debugging',
  ],
};

/**
 * List webhook resources
 */
export function listWebhookResources(): Resource[] {
  return [
    {
      uri: 'loyalteez://webhooks/events',
      name: 'Webhook Event Types',
      description: 'Complete reference of webhook event types and their payloads',
      mimeType: 'application/json',
    },
  ];
}

/**
 * Check if URI is a webhook resource
 */
export function isWebhookResource(uri: string): boolean {
  return uri.startsWith('loyalteez://webhooks/');
}

/**
 * Read webhook resource
 */
export function readWebhookResource(uri: string): {
  contents: Array<{
    uri: string;
    mimeType: string;
    text: string;
  }>;
} {
  if (uri === 'loyalteez://webhooks/events') {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(WEBHOOK_EVENTS, null, 2),
        },
      ],
    };
  }

  throw new Error(`Unknown webhook resource: ${uri}`);
}
