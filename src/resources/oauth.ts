/**
 * OAuth provider reference resources for Loyalteez MCP
 */

import type { Resource } from '@modelcontextprotocol/sdk/types.js';

const OAUTH_PROVIDERS = {
  providers: {
    discord: {
      idFormat: '17-20 digit numeric string (snowflake)',
      example: '123456789012345678',
      howToGet: 'user.id from Discord API',
    },
    twitter: {
      idFormat: 'numeric string',
      example: '987654321',
      howToGet: 'user.id_str from Twitter API',
    },
    github: {
      idFormat: 'numeric string',
      example: '45678901',
      howToGet: 'user.id from GitHub API',
    },
    google: {
      idFormat: 'long numeric string',
      example: '108012345678901234567',
      howToGet: 'sub claim from OAuth token',
    },
    telegram: {
      idFormat: 'numeric',
      example: '123456789',
      howToGet: 'user.id from Telegram Bot API',
    },
    spotify: {
      idFormat: 'alphanumeric string',
      example: 'abc123xyz',
      howToGet: 'user.id from Spotify API',
    },
    instagram: {
      idFormat: 'numeric string',
      example: '123456789',
      howToGet: 'user.id from Instagram Graph API',
    },
    tiktok: {
      idFormat: 'alphanumeric string',
      example: 'abc123',
      howToGet: 'open_id from TikTok API',
    },
  },
};

/**
 * List OAuth resources
 */
export function listOAuthResources(): Resource[] {
  return [
    {
      uri: 'loyalteez://platforms/mappings',
      name: 'OAuth Provider ID Formats',
      description: 'User ID formats for each supported OAuth provider',
      mimeType: 'application/json',
    },
  ];
}

/**
 * Read OAuth resource
 */
export function readOAuthResource(uri: string): {
  contents: Array<{
    uri: string;
    mimeType: string;
    text: string;
  }>;
} {
  if (uri === 'loyalteez://platforms/mappings') {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(OAUTH_PROVIDERS, null, 2),
        },
      ],
    };
  }

  throw new Error(`OAuth resource not found: ${uri}`);
}

/**
 * Check if URI is an OAuth resource
 */
export function isOAuthResource(uri: string): boolean {
  return uri.startsWith('loyalteez://platforms/');
}
