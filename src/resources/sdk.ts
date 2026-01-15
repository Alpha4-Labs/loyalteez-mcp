/**
 * JavaScript SDK reference resource
 */

import type { Resource } from '@modelcontextprotocol/sdk/types.js';

const SDK_REFERENCE = {
  installation: {
    cdn: '<script src="https://api.loyalteez.app/sdk.js"></script>',
    description: 'The SDK automatically creates a global LoyalteezAutomation object',
  },
  methods: {
    init: {
      signature: 'LoyalteezAutomation.init(brandId, options?)',
      description: 'Initialize the SDK with your Brand ID and configuration',
      parameters: {
        brandId: { type: 'string', required: true, description: 'Your Loyalteez Brand ID' },
        options: {
          type: 'object',
          required: false,
          properties: {
            debug: { type: 'boolean', default: false, description: 'Enable console logging' },
            autoDetect: { type: 'boolean', default: false, description: 'Auto-detect form submissions' },
            endpoint: { type: 'string', default: 'https://api.loyalteez.app', description: 'API endpoint URL' },
            events: { type: 'string', description: 'Event rules (e.g., "form_submit:25,newsletter_signup:50")' },
            eventNameMapping: { type: 'object', description: 'Map custom event names to Loyalteez events' },
          },
        },
      },
      example: `
// Basic initialization
LoyalteezAutomation.init('your-brand-id');

// Advanced initialization
LoyalteezAutomation.init('your-brand-id', {
  debug: true,
  autoDetect: true,
  events: 'newsletter_subscribe:25,form_submit:10',
  eventNameMapping: {
    'newsletter_signup': 'newsletter_subscribe',
    'contact_form': 'form_submit'
  }
});`,
    },
    track: {
      signature: 'LoyalteezAutomation.track(eventType, data)',
      description: 'Track a custom event and reward the user',
      parameters: {
        eventType: { type: 'string', required: true, description: 'Event type to track' },
        data: {
          type: 'object',
          required: true,
          properties: {
            userEmail: { type: 'string', required: true, description: "User's email address" },
            userIdentifier: { type: 'string', description: 'Alternative user identifier' },
            userWallet: { type: 'string', description: "User's wallet address" },
            metadata: { type: 'object', description: 'Additional custom data' },
          },
        },
      },
      supportedEventTypes: [
        { type: 'account_creation', reward: '100 LTZ' },
        { type: 'complete_survey', reward: '75 LTZ' },
        { type: 'newsletter_subscribe', reward: '25 LTZ' },
        { type: 'rate_experience', reward: '50 LTZ' },
        { type: 'subscribe_renewal', reward: '200 LTZ' },
        { type: 'form_submit', reward: '10 LTZ' },
      ],
      example: `
// Basic event tracking
LoyalteezAutomation.track('account_creation', {
  userEmail: 'user@example.com'
});

// With metadata
LoyalteezAutomation.track('complete_survey', {
  userEmail: 'user@example.com',
  metadata: {
    surveyId: 'survey_123',
    score: 5,
    completionTime: 120
  }
});`,
    },
    trackWithWallet: {
      signature: 'LoyalteezAutomation.trackWithWallet(eventType, privy, data?)',
      description: 'Track an event and automatically include user\'s Privy wallet address',
      parameters: {
        eventType: { type: 'string', required: true },
        privy: { type: 'object', required: true, description: 'Privy instance from @privy-io/react-auth' },
        data: { type: 'object', required: false, description: 'Additional event data' },
      },
      example: `
import { usePrivy } from '@privy-io/react-auth';

function MyComponent() {
  const privy = usePrivy();
  
  const handleEvent = async () => {
    await LoyalteezAutomation.trackWithWallet(
      'account_creation',
      privy,
      {
        userEmail: privy.user.email?.address,
        metadata: { source: 'dashboard' }
      }
    );
  };
  
  return <button onClick={handleEvent}>Track Event</button>;
}`,
    },
    identify: {
      signature: 'LoyalteezAutomation.identify(userId, traits?)',
      description: 'Associate SDK session with a user',
      parameters: {
        userId: { type: 'string', required: true },
        traits: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            name: { type: 'string' },
          },
        },
      },
      example: `
// After user logs in
LoyalteezAutomation.identify(user.id, {
  email: user.email,
  name: user.name,
  tier: 'premium'
});`,
    },
    reset: {
      signature: 'LoyalteezAutomation.reset()',
      description: 'Clear user session (call on logout)',
      example: `
// On user logout
function logout() {
  LoyalteezAutomation.reset();
  // Your logout logic
}`,
    },
    getUserWallet: {
      signature: 'LoyalteezAutomation.getUserWallet(email)',
      description: 'Get the user\'s Loyalteez wallet address',
      parameters: {
        email: { type: 'string', required: true },
      },
      returns: {
        walletAddress: { type: 'string' },
        ltzBalance: { type: 'number' },
      },
      example: `
const wallet = await LoyalteezAutomation.getUserWallet('user@example.com');
console.log('Wallet:', wallet.walletAddress);
console.log('Balance:', wallet.ltzBalance, 'LTZ');`,
    },
    startAutoDetection: {
      signature: 'LoyalteezAutomation.startAutoDetection()',
      description: 'Enable automatic form submission detection. This is called automatically if autoDetect: true is passed to init().',
      returns: { type: 'void' },
      example: `
// If you didn't enable auto-detect during init:
LoyalteezAutomation.startAutoDetection();

// What it detects:
// - HTML form submissions
// - AJAX requests (fetch API)
// - XMLHttpRequest submissions
// - Newsletter signups
// - Contact forms`,
      notes: 'Auto-detection ignores Loyalteez API calls (prevents infinite loops), forms without email fields, and requests to same-origin APIs.',
    },
    stopAutoDetection: {
      signature: 'LoyalteezAutomation.stopAutoDetection()',
      description: 'Disable automatic form submission detection',
      returns: { type: 'void' },
      example: `
// Stop auto-detection
LoyalteezAutomation.stopAutoDetection();

// You can restart it later
LoyalteezAutomation.startAutoDetection();`,
    },
  },
  clientSideMethods: {
    note: 'The following methods are client-side only and do not require server-side API calls. They are not available as MCP tools because they manage browser state, not backend operations.',
    whyNotMCPTools: 'These methods operate in the browser environment and manage local SDK state. The MCP server focuses on backend integration APIs that can be called from any environment.',
    methods: [
      {
        name: 'identify()',
        reason: 'Associates SDK session with user - browser-only state management',
      },
      {
        name: 'reset()',
        reason: 'Clears user session - browser-only state management',
      },
      {
        name: 'getUserWallet()',
        reason: 'Fetches wallet from API but is a convenience method for browser SDK',
      },
      {
        name: 'startAutoDetection()',
        reason: 'Manages browser event listeners - browser-only functionality',
      },
      {
        name: 'stopAutoDetection()',
        reason: 'Manages browser event listeners - browser-only functionality',
      },
    ],
  },
  frameworkExamples: {
    react: `
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    LoyalteezAutomation.init(process.env.REACT_APP_BRAND_ID, {
      debug: process.env.NODE_ENV === 'development',
      userId: user?.id,
      userEmail: user?.email,
      onRewardReceived: (reward) => {
        toast.success(\`You earned \${reward.amount} LTZ!\`);
      }
    });
  }, []);

  const handlePurchase = async (orderId, amount) => {
    await processPurchase(orderId, amount);
    await LoyalteezAutomation.track('purchase', {
      orderId,
      amount,
      email: user.email
    });
  };

  return <YourApp />;
}`,
    vue: `
<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  LoyalteezAutomation.init(import.meta.env.VITE_BRAND_ID, {
    autoTrack: true,
    debug: import.meta.env.DEV
  });
});

const trackSignup = () => {
  LoyalteezAutomation.track('account_creation', {
    email: formData.email,
    source: 'signup_form'
  });
};
</script>`,
    nextjs: `
// _app.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    LoyalteezAutomation.init(process.env.NEXT_PUBLIC_BRAND_ID, {
      trackPageViews: false  // Handle manually with router
    });

    const handleRouteChange = (url) => {
      LoyalteezAutomation.track('page_view', {
        path: url
      });
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router]);

  return <Component {...pageProps} />;
}`,
  },
  autoDetection: {
    description: 'The SDK can automatically track events based on configured detection methods',
    methods: [
      {
        type: 'url_pattern',
        description: 'Monitors URL changes and tracks events when patterns match',
        example: 'Configured pattern: /thank-you → Tracks event automatically',
      },
      {
        type: 'css_selector',
        description: 'Attaches click listeners to elements matching CSS selectors',
        example: 'Selector: .download-button → Tracks event on click',
      },
      {
        type: 'form_submission',
        description: 'Intercepts form submissions and tracks events',
        example: 'Form: #contact-form → Tracks event on submit',
      },
    ],
  },
  troubleshooting: {
    sdkNotLoading: {
      issue: 'SDK not loading',
      solutions: [
        'Check script tag is present and correct',
        'Verify network connectivity',
        'Check browser console for errors',
        'Ensure brand ID is correct',
      ],
    },
    eventsNotTracking: {
      issue: 'Events not being tracked',
      solutions: [
        'Check browser console for errors',
        'Verify brand ID is set correctly',
        'Check Partner Portal → Analytics for received events',
        'Ensure event types are configured in Partner Portal',
        'Verify domain is authorized in Partner Portal',
      ],
    },
    corsErrors: {
      issue: 'CORS errors',
      solutions: [
        'Verify domain is authorized in Partner Portal',
        'Ensure using HTTPS (not HTTP)',
        'Check API endpoint URL is correct',
      ],
    },
    browserVsMobile: {
      description: 'The JavaScript SDK is browser-only. For mobile apps, use direct API calls.',
      mobileApproach: 'Mobile apps should use HTTP POST requests to /loyalteez-api/manual-event instead of the SDK.',
      example: `
// Mobile (React Native, iOS, Android)
fetch('https://api.loyalteez.app/loyalteez-api/manual-event', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    brandId: 'your-brand-id',
    eventType: 'account_creation',
    userEmail: 'user@example.com'
  })
});

// Web (Browser)
LoyalteezAutomation.track('account_creation', {
  userEmail: 'user@example.com'
});`,
    },
  },
};

/**
 * List SDK resources
 */
export function listSDKResources(): Resource[] {
  return [
    {
      uri: 'loyalteez://sdk/methods',
      name: 'SDK Methods Reference',
      description: 'Complete JavaScript SDK method reference with examples',
      mimeType: 'application/json',
    },
    {
      uri: 'loyalteez://sdk/examples',
      name: 'SDK Framework Examples',
      description: 'SDK usage examples for React, Vue, Next.js, and more',
      mimeType: 'application/json',
    },
  ];
}

/**
 * Check if URI is an SDK resource
 */
export function isSDKResource(uri: string): boolean {
  return uri.startsWith('loyalteez://sdk/');
}

/**
 * Read SDK resource
 */
export function readSDKResource(uri: string): {
  contents: Array<{
    uri: string;
    mimeType: string;
    text: string;
  }>;
} {
  if (uri === 'loyalteez://sdk/methods') {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(
            {
              installation: SDK_REFERENCE.installation,
              methods: SDK_REFERENCE.methods,
              autoDetection: SDK_REFERENCE.autoDetection,
              clientSideMethods: SDK_REFERENCE.clientSideMethods,
              troubleshooting: SDK_REFERENCE.troubleshooting,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  if (uri === 'loyalteez://sdk/examples') {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(
            {
              frameworkExamples: SDK_REFERENCE.frameworkExamples,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  throw new Error(`Unknown SDK resource: ${uri}`);
}
