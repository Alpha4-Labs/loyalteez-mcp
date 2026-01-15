/**
 * Error codes and handling reference resource
 */

import type { Resource } from '@modelcontextprotocol/sdk/types.js';

const ERROR_CODES = {
  httpStatusCodes: {
    200: { name: 'OK', description: 'Request succeeded' },
    400: { name: 'Bad Request', description: 'Invalid input data' },
    401: { name: 'Unauthorized', description: 'Missing/invalid auth token' },
    403: { name: 'Forbidden', description: 'Access denied (automation disabled, contract not whitelisted)' },
    404: { name: 'Not Found', description: 'Endpoint does not exist' },
    409: { name: 'Conflict', description: 'Duplicate event detected (same event + user within 60 seconds)' },
    429: { name: 'Too Many Requests', description: 'Rate limit exceeded' },
    500: { name: 'Internal Server Error', description: 'Server error (contact support)' },
    503: { name: 'Service Unavailable', description: 'Service temporarily down' },
  },
  eventHandlerErrors: {
    invalidEventData: {
      status: 400,
      error: 'Invalid event data',
      commonCauses: ['Missing required fields', 'Invalid data format', 'Validation errors'],
      solution: 'Ensure all required fields are present and properly formatted',
      example: {
        wrong: { brandId: 'abc123' },
        correct: { brandId: '0x...', eventType: 'account_creation', userEmail: 'user@example.com' },
      },
    },
    missingRequiredFields: {
      status: 400,
      error: 'Missing required fields',
      requiredFields: ['brandId', 'eventType', 'userEmail'],
      solution: 'Validate all required fields before sending request',
    },
    eventTypeNotConfigured: {
      status: 400,
      error: 'Event type not configured',
      solution: 'Use a supported event type or configure custom event in Partner Portal',
      supportedTypes: ['account_creation', 'complete_survey', 'newsletter_subscribe', 'rate_experience', 'subscribe_renewal', 'form_submit'],
    },
    automationDisabled: {
      status: 403,
      error: 'Automation disabled',
      solution: 'Enable automation in Partner Portal → Automation → Enable Automation',
      handling: 'Check response status and show user-friendly message',
    },
    domainNotAuthorized: {
      status: 403,
      error: 'Domain not authorized',
      solution: 'Add your domain in Partner Portal → Settings → Domain Configuration',
    },
    duplicateEvent: {
      status: 409,
      error: 'Duplicate event detected',
      description: 'Same event type + user email within last 60 seconds',
      solution: 'Implement client-side deduplication or wait 60 seconds',
    },
    rateLimitExceeded: {
      status: 429,
      error: 'Rate limit exceeded',
      description: 'User has already received reward for this event type today',
      solution: 'Implement rate limit checking and user messaging',
    },
  },
  gasRelayerErrors: {
    unauthorized: {
      status: 401,
      error: 'Invalid or expired Privy token',
      solution: 'Get fresh access token using Privy SDK getAccessToken()',
    },
    contractNotWhitelisted: {
      status: 403,
      error: 'Transaction validation failed: Contract not whitelisted',
      whitelistedContracts: [
        '0x5242b6DB88A72752ac5a54cFe6A7DB8244d743c9', // Loyalteez Token
        '0x6ae30d6Dcf3e75456B6582b057f1Bf98A90F2CA0', // PerkNFT
        '0x5269B83F6A4E31bEdFDf5329DC052FBb661e3c72', // PointsSale
      ],
      solution: 'Use one of the whitelisted contract addresses',
    },
    rateLimitExceeded: {
      status: 429,
      error: 'Rate limit exceeded. Max 35 transactions per hour.',
      solution: 'Track transaction count and show user when limit is reached',
    },
  },
  pregenerationErrors: {
    missingFields: {
      status: 400,
      error: 'Missing required fields',
      requiredFields: ['brand_id', 'oauth_provider', 'oauth_user_id'],
    },
    invalidProvider: {
      status: 400,
      error: 'Invalid OAuth provider',
      validProviders: ['discord', 'twitter', 'github', 'google', 'telegram', 'spotify', 'instagram', 'tiktok'],
    },
    invalidDiscordId: {
      status: 400,
      error: 'Invalid Discord user ID',
      description: 'Discord user IDs must be 17-20 digit numeric strings (snowflake IDs)',
    },
    rateLimitExceeded: {
      status: 429,
      error: 'Rate limit exceeded',
      description: 'Maximum 100 requests per minute per brand',
      solution: 'Implement rate limiting or batch requests',
    },
  },
  errorHandlingPatterns: {
    detectAndHandle: `
async function trackEventWithErrorHandling(eventType, userEmail) {
  try {
    const response = await fetch('https://api.loyalteez.app/loyalteez-api/manual-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brandId, eventType, userEmail })
    });
    
    if (!response.ok) {
      const error = await response.json();
      
      switch (response.status) {
        case 400:
          console.error('Invalid request:', error.details);
          break;
        case 403:
          console.error('Access denied:', error.message);
          break;
        case 409:
          console.warn('Duplicate event, ignoring');
          break;
        case 429:
          console.warn('Rate limited, will retry later');
          break;
        default:
          console.error('Unexpected error:', error);
      }
    }
    
    return await response.json();
  } catch (error) {
    console.error('Network error:', error);
    throw error;
  }
}`,
    retryWithBackoff: `
async function trackEventWithRetry(eventType, userEmail, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await trackEvent(eventType, userEmail);
    } catch (error) {
      if (error.status === 429 && attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 30000);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}`,
  },
};

/**
 * List error code resources
 */
export function listErrorResources(): Resource[] {
  return [
    {
      uri: 'loyalteez://errors/codes',
      name: 'Error Codes Reference',
      description: 'Complete reference for HTTP status codes and error responses',
      mimeType: 'application/json',
    },
    {
      uri: 'loyalteez://errors/handling',
      name: 'Error Handling Patterns',
      description: 'Best practices and code examples for handling errors',
      mimeType: 'application/json',
    },
  ];
}

/**
 * Check if URI is an error resource
 */
export function isErrorResource(uri: string): boolean {
  return uri.startsWith('loyalteez://errors/');
}

/**
 * Read error resource
 */
export function readErrorResource(uri: string): {
  contents: Array<{
    uri: string;
    mimeType: string;
    text: string;
  }>;
} {
  if (uri === 'loyalteez://errors/codes') {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(ERROR_CODES, null, 2),
        },
      ],
    };
  }

  if (uri === 'loyalteez://errors/handling') {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(
            {
              patterns: ERROR_CODES.errorHandlingPatterns,
              bestPractices: [
                'Always check response status before parsing JSON',
                'Implement retry logic for transient errors (429, 500, 503)',
                'Show user-friendly error messages',
                'Log errors for debugging',
                'Handle network errors separately from API errors',
              ],
            },
            null,
            2
          ),
        },
      ],
    };
  }

  throw new Error(`Unknown error resource: ${uri}`);
}
