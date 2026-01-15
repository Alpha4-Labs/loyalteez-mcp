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
  customEvents: {
    description: 'Create custom events in Partner Portal with any name and reward amount',
    idFormat: 'custom_{randomId}_{timestamp}',
    detectionMethods: ['url_pattern', 'css_selector', 'form_submit', 'webhook'],
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
