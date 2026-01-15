/**
 * Shared services reference resources for Loyalteez MCP
 */

import type { Resource } from '@modelcontextprotocol/sdk/types.js';

const SHARED_SERVICES = {
  baseUrl: 'https://services.loyalteez.app',
  userIdentifierFormat: '{platform}_{userId}@loyalteez.app',
  services: {
    streak: {
      endpoints: {
        'POST /streak/record-activity': 'Record daily check-in, extend streak',
        'POST /streak/claim-milestone': 'Claim milestone bonus (7, 30, 100, 365 days)',
        'GET /streak/status/:brandId/:userIdentifier': 'Get current streak status',
      },
      defaultMilestones: [
        { days: 7, bonus: 100 },
        { days: 30, bonus: 500 },
        { days: 100, bonus: 2000 },
        { days: 365, bonus: 10000 },
      ],
      gracePeriodHours: 36,
    },
    leaderboard: {
      endpoints: {
        'GET /leaderboard/:brandId': 'Get ranked leaderboard',
        'POST /leaderboard/update-stats': 'Update user stats after reward',
      },
      metrics: ['ltz_earned', 'activity', 'streak', 'claims'],
      periods: ['week', 'month', 'all'],
    },
    achievements: {
      endpoints: {
        'GET /achievements/:brandId/:userIdentifier': 'Get user achievements',
        'POST /achievements/update-progress': 'Update achievement progress',
      },
      achievementTypes: [
        'message_count',
        'voice_hours',
        'streak_days',
        'events_claimed',
        'gm_count',
        'level_reached',
        'ltz_earned',
        'custom',
      ],
    },
    perks: {
      endpoints: {
        'GET /perks/:brandId': 'Get available perks',
        'POST /perks/redeem': 'Redeem a perk',
      },
      categories: ['discount', 'exclusive', 'merch', 'digital', 'experience', 'general'],
    },
    roleBonuses: {
      description: 'Discord role-based reward multipliers and flat bonuses',
      multiplierRange: '1.0 to 5.0 (1.0 = no bonus, 2.0 = double rewards)',
      flatBonusRange: '0 to 1,000 LTZ per reward',
      stackingModes: ['multiplicative', 'additive', 'highest_only'],
      note: 'Role bonuses apply automatically to all rewards earned by users with that role. Configure via Discord /config role-bonus or Partner Portal.',
    },
  },
  healthCheck: 'GET /health',
};

/**
 * List shared services resources
 */
export function listSharedServicesResources(): Resource[] {
  return [
    {
      uri: 'loyalteez://shared-services/endpoints',
      name: 'Shared Services API Reference',
      description: 'Gamification services: Streaks, Leaderboards, Achievements, Perks',
      mimeType: 'application/json',
    },
  ];
}

/**
 * Read shared services resource
 */
export function readSharedServicesResource(uri: string): {
  contents: Array<{
    uri: string;
    mimeType: string;
    text: string;
  }>;
} {
  if (uri === 'loyalteez://shared-services/endpoints') {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(SHARED_SERVICES, null, 2),
        },
      ],
    };
  }

  throw new Error(`Shared services resource not found: ${uri}`);
}

/**
 * Check if URI is a shared services resource
 */
export function isSharedServicesResource(uri: string): boolean {
  return uri.startsWith('loyalteez://shared-services/');
}
