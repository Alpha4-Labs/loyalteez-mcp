/**
 * Event types reference resources for Loyalteez MCP
 */

import type { Resource } from '@modelcontextprotocol/sdk/types.js';

const EVENT_TYPES = {
  standardEvents: [
    {
      type: 'account_creation',
      description: 'User creates an account',
      typicalReward: '100-500 LTZ',
      frequency: 'once_per_user',
    },
    {
      type: 'email_verification',
      description: 'User verifies email address',
      typicalReward: '50-200 LTZ',
      frequency: 'once_per_user',
    },
    {
      type: 'purchase',
      description: 'User completes a purchase',
      typicalReward: '1-10 LTZ per dollar',
      frequency: 'per_transaction',
    },
    {
      type: 'referral',
      description: 'User refers a friend who signs up',
      typicalReward: '500-2000 LTZ',
      frequency: 'per_referral',
    },
    {
      type: 'newsletter_subscribe',
      description: 'User subscribes to newsletter',
      typicalReward: '25-100 LTZ',
      frequency: 'once_per_user',
    },
    {
      type: 'review_submission',
      description: 'User submits a product review',
      typicalReward: '50-200 LTZ',
      frequency: 'per_review',
    },
    {
      type: 'profile_completion',
      description: 'User completes their profile',
      typicalReward: '100-300 LTZ',
      frequency: 'once_per_user',
    },
    {
      type: 'form_submit',
      description: 'Generic form submission',
      typicalReward: '10-50 LTZ',
      frequency: 'configurable',
    },
  ],
  discordBoostEvents: [
    {
      type: 'server_boost',
      description: 'Default boost event (all boosts)',
      typicalReward: '500-1000 LTZ',
      frequency: 'per_boost',
      note: 'Default fallback for all server boosts',
    },
    {
      type: 'first_boost',
      description: 'First boost reward',
      typicalReward: '1000 LTZ',
      frequency: 'once_per_user',
      note: "User's first time boosting the server",
    },
    {
      type: 'tier_1_boost',
      description: 'Tier 1 boost reward',
      typicalReward: '500 LTZ',
      frequency: 'when_tier_reached',
      note: 'When server reaches Tier 1 (2 boosts)',
    },
    {
      type: 'tier_2_boost',
      description: 'Tier 2 boost reward',
      typicalReward: '750 LTZ',
      frequency: 'when_tier_reached',
      note: 'When server reaches Tier 2 (7 boosts)',
    },
    {
      type: 'tier_3_boost',
      description: 'Tier 3 boost reward',
      typicalReward: '1000 LTZ',
      frequency: 'when_tier_reached',
      note: 'When server reaches Tier 3 (14 boosts)',
    },
    {
      type: 'boost_tier_upgrade',
      description: 'Tier upgrade reward',
      typicalReward: '500-1000 LTZ',
      frequency: 'when_tier_increases',
      note: 'When server tier increases (Tier 1→2 or 2→3)',
    },
  ],
  discordNaturalParticipation: [
    {
      type: 'gm_checkin',
      description: 'GM (Good Morning) check-in',
      typicalReward: '25 LTZ',
      frequency: 'once_per_24h',
      defaultCooldown: '24 hours',
    },
    {
      type: 'gn_checkin',
      description: 'GN (Good Night) check-in',
      typicalReward: '15 LTZ',
      frequency: 'once_per_24h',
      defaultCooldown: '24 hours',
    },
    {
      type: 'quality_message',
      description: 'Thoughtful, high-quality messages',
      typicalReward: '10 LTZ',
      frequency: 'per_message',
      defaultStatus: 'disabled',
    },
    {
      type: 'popular_message',
      description: 'Messages that reach reaction thresholds',
      typicalReward: '25 LTZ',
      frequency: 'per_message',
      defaultStatus: 'disabled',
    },
    {
      type: 'discord_join',
      description: 'Auto-welcome new members',
      typicalReward: '50 LTZ',
      frequency: 'once_per_user',
      note: 'Automatically rewards new members on join',
    },
    {
      type: 'voice_activity',
      description: 'Time spent in voice channels',
      typicalReward: '25 LTZ per session',
      frequency: 'per_session',
    },
  ],
  customEvents: {
    description: 'Create custom events in Partner Portal with any name and reward amount',
    idFormat: 'custom_{randomId}_{timestamp}',
    detectionMethods: ['url_pattern', 'css_selector', 'form_submit', 'webhook'],
  },
  maxClaimsNote: {
    description: 'Understanding max_claims_per_user',
    clarification: 'For events: max_claims is per-user limit. For reaction drops: event max_claims becomes total drop limit. Use 999999 or -1 for unlimited (both normalized to unlimited).',
  },
  channelConstraints: {
    description: 'Discord events can have channel constraints that restrict where events can be triggered',
    example: {
      eventType: 'helpful_answer',
      detectionConfig: {
        channels: ['#support', '#help', '#general'],
      },
      behavior: 'Event only triggers if channel_id matches one of the allowed channels. If channel_id not provided, event is processed without validation.',
    },
    usage: 'When tracking Discord events with channel constraints, include channel_id parameter in track_event call',
    codeExample: `
// Discord event with channel constraint
await loyalteez_track_event({
  brandId: '0x...',
  eventType: 'helpful_answer',
  userIdentifier: { platform: 'discord', platformUserId: '123456789' },
  channelId: '123456789012345678', // Discord channel ID
  metadata: { messageId: '987654321' }
});`,
  },
  domainValidation: {
    description: 'Web events require domain validation for security',
    requirements: [
      'Domain must be added in Partner Portal → Settings → Domain Configuration',
      'Domain is extracted from: domain field → sourceUrl → Origin header',
      'Returns 403 if domain is not authorized for the brand',
    ],
    example: {
      correct: {
        domain: 'example.com',
        sourceUrl: 'https://example.com/signup',
        note: 'Domain matches configured domain in Partner Portal',
      },
      incorrect: {
        domain: 'evil.com',
        sourceUrl: 'https://evil.com/signup',
        note: 'Domain not authorized → Returns 403 Forbidden',
      },
    },
  },
};

/**
 * List event type resources
 */
export function listEventTypeResources(): Resource[] {
  return [
    {
      uri: 'loyalteez://events/standard',
      name: 'Standard Event Types',
      description: 'Pre-defined event types and their typical reward amounts',
      mimeType: 'application/json',
    },
  ];
}

/**
 * Read event type resource
 */
export function readEventTypeResource(uri: string): {
  contents: Array<{
    uri: string;
    mimeType: string;
    text: string;
  }>;
} {
  if (uri === 'loyalteez://events/standard') {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(EVENT_TYPES, null, 2),
        },
      ],
    };
  }

  throw new Error(`Event type resource not found: ${uri}`);
}

/**
 * Check if URI is an event type resource
 */
export function isEventTypeResource(uri: string): boolean {
  return uri.startsWith('loyalteez://events/');
}
