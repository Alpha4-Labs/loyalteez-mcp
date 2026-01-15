/**
 * Rate limits reference resource
 */

import type { Resource } from '@modelcontextprotocol/sdk/types.js';

const RATE_LIMITS = {
  eventHandler: {
    endpoints: [
      {
        endpoint: '/loyalteez-api/manual-event',
        limit: '1 per event type',
        scope: 'Per user email',
        resetPeriod: 'Daily (24 hours)',
        description: 'Each user can receive each reward type once per day',
      },
      {
        endpoint: '/loyalteez-api/bulk-events',
        limit: '100 events per request',
        scope: 'Per request',
        resetPeriod: 'N/A',
        description: 'Maximum 100 events in a single bulk request',
      },
      {
        endpoint: '/loyalteez-api/health',
        limit: 'Unlimited',
        scope: 'N/A',
        resetPeriod: 'N/A',
        description: 'Health check endpoint has no rate limits',
      },
    ],
    duplicateDetection: {
      window: '60 seconds',
      behavior: 'Returns 409 Conflict if same event + user within window',
    },
    cooldown: {
      default: '24 hours',
      configurable: true,
      description: 'Based on cooldownHours in event rule configuration',
    },
  },
  gasRelayer: {
    transactions: {
      limit: 35,
      scope: 'Per wallet address',
      resetPeriod: 'Per hour',
      description: 'Users can make 35 gasless transactions per hour',
    },
    gasLimit: {
      max: 1000000,
      description: 'Maximum gas limit per transaction',
    },
    gasPrice: {
      max: '100 Gwei',
      description: 'Maximum gas price per transaction',
    },
  },
  pregeneration: {
    requests: {
      limit: 100,
      scope: 'Per brand',
      resetPeriod: 'Per minute',
      description: 'Maximum 100 pregeneration requests per brand per minute',
    },
    idempotent: true,
    description: 'Same OAuth ID returns same wallet (not counted as new request)',
  },
  headers: {
    description: 'Rate limit information is provided in response headers',
    headers: [
      {
        name: 'X-RateLimit-Limit',
        description: 'Maximum requests allowed',
        example: '35',
      },
      {
        name: 'X-RateLimit-Remaining',
        description: 'Requests left in current window',
        example: '32',
      },
      {
        name: 'X-RateLimit-Reset',
        description: 'Unix timestamp when limit resets',
        example: '1699999999',
      },
      {
        name: 'Retry-After',
        description: 'Seconds to wait before retrying (429 responses)',
        example: '60',
      },
    ],
  },
  strategies: {
    detectRateLimits: `
async function trackEventWithRateLimitCheck(eventType, userEmail) {
  const response = await fetch('https://api.loyalteez.app/loyalteez-api/manual-event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ brandId, eventType, userEmail })
  });
  
  // Check rate limit headers
  const limit = response.headers.get('X-RateLimit-Limit');
  const remaining = response.headers.get('X-RateLimit-Remaining');
  const reset = response.headers.get('X-RateLimit-Reset');
  
  console.log(\`Rate Limit: \${remaining}/\${limit} remaining\`);
  
  if (response.status === 429) {
    const resetDate = new Date(parseInt(reset) * 1000);
    console.warn(\`Rate limited. Resets at \${resetDate.toLocaleString()}\`);
    return { success: false, error: 'rate_limited', resetAt: resetDate };
  }
  
  return await response.json();
}`,
    clientSideDeduplication: `
class EventTracker {
  constructor() {
    this.trackedEvents = new Map();
  }
  
  canTrackEvent(eventType, userEmail) {
    const key = \`\${userEmail}:\${eventType}\`;
    const lastTracked = this.trackedEvents.get(key);
    
    if (!lastTracked) return true;
    
    // Check if 24 hours have passed
    const hoursSinceTracked = (Date.now() - lastTracked) / (1000 * 60 * 60);
    return hoursSinceTracked >= 24;
  }
  
  async trackEvent(eventType, userEmail) {
    if (!this.canTrackEvent(eventType, userEmail)) {
      return { success: false, error: 'already_tracked_today' };
    }
    
    const result = await fetch('https://api.loyalteez.app/loyalteez-api/manual-event', {
      method: 'POST',
      body: JSON.stringify({ brandId, eventType, userEmail })
    });
    
    // Mark as tracked
    const key = \`\${userEmail}:\${eventType}\`;
    this.trackedEvents.set(key, Date.now());
    
    return await result.json();
  }
}`,
    exponentialBackoff: `
async function retryWithBackoff(fn, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429 && i < maxRetries - 1) {
        const delay = Math.min(1000 * Math.pow(2, i), 30000);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}`,
    trackTransactionCount: `
class GasRelayerClient {
  constructor() {
    this.txCount = new Map();
  }
  
  canMakeTransaction(walletAddress) {
    const key = \`\${walletAddress}:\${this.getCurrentHour()}\`;
    const count = this.txCount.get(key) || 0;
    return count < 35; // 35 transactions per hour
  }
  
  async executeTransaction(walletAddress, txData) {
    if (!this.canMakeTransaction(walletAddress)) {
      return {
        success: false,
        error: 'rate_limited',
        message: 'Maximum 35 transactions per hour. Please try again later.',
      };
    }
    
    const result = await fetch('https://relayer.loyalteez.app/relay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${await getPrivyToken()}\`
      },
      body: JSON.stringify(txData)
    });
    
    // Increment count
    const key = \`\${walletAddress}:\${this.getCurrentHour()}\`;
    this.txCount.set(key, (this.txCount.get(key) || 0) + 1);
    
    return await result.json();
  }
  
  getCurrentHour() {
    const now = new Date();
    return \`\${now.getFullYear()}-\${now.getMonth()}-\${now.getDate()}-\${now.getHours()}\`;
  }
}`,
  },
  bestPractices: [
    'Cache locally to prevent duplicate requests',
    'Implement exponential backoff for retries',
    'Track rate limit headers to inform users',
    'Queue failed requests for later retry',
    'Monitor usage to avoid hitting limits',
    'Use bulk endpoints when possible to reduce request count',
  ],
};

/**
 * List rate limit resources
 */
export function listRateLimitResources(): Resource[] {
  return [
    {
      uri: 'loyalteez://rate-limits/endpoints',
      name: 'Rate Limits by Endpoint',
      description: 'Complete rate limit reference for all API endpoints',
      mimeType: 'application/json',
    },
    {
      uri: 'loyalteez://rate-limits/strategies',
      name: 'Rate Limit Handling Strategies',
      description: 'Code examples and best practices for handling rate limits',
      mimeType: 'application/json',
    },
  ];
}

/**
 * Check if URI is a rate limit resource
 */
export function isRateLimitResource(uri: string): boolean {
  return uri.startsWith('loyalteez://rate-limits/');
}

/**
 * Read rate limit resource
 */
export function readRateLimitResource(uri: string): {
  contents: Array<{
    uri: string;
    mimeType: string;
    text: string;
  }>;
} {
  if (uri === 'loyalteez://rate-limits/endpoints') {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(
            {
              eventHandler: RATE_LIMITS.eventHandler,
              gasRelayer: RATE_LIMITS.gasRelayer,
              pregeneration: RATE_LIMITS.pregeneration,
              headers: RATE_LIMITS.headers,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  if (uri === 'loyalteez://rate-limits/strategies') {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(
            {
              strategies: RATE_LIMITS.strategies,
              bestPractices: RATE_LIMITS.bestPractices,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  throw new Error(`Unknown rate limit resource: ${uri}`);
}
