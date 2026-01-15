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
      uri: 'loyalteez://sdk/javascript',
      name: 'JavaScript SDK Reference',
      description: 'Complete JavaScript SDK method reference with examples',
      mimeType: 'text/markdown',
    },
    {
      uri: 'loyalteez://sdk/mobile',
      name: 'Mobile SDK Examples',
      description: 'Mobile integration examples for React Native, iOS, Android, and Flutter',
      mimeType: 'text/markdown',
    },
  ];
}

/**
 * Check if URI is an SDK resource
 */
export function isSDKResource(uri: string): boolean {
  return uri.startsWith('loyalteez://sdk/');
}

const MOBILE_SDK_EXAMPLES = `# Mobile SDK Integration Examples

The Loyalteez JavaScript SDK is browser-only. For mobile apps (React Native, iOS, Android, Flutter), use direct HTTP API calls to our Cloudflare Workers.

## Key Differences from Web

| Feature | Web | Mobile |
|---------|-----|--------|
| **SDK** | JavaScript CDN | Direct API calls |
| **Authentication** | Privy Web SDK | Privy Mobile SDK |
| **Event Tracking** | Auto-detection | Manual calls |
| **Wallet** | Browser extension | In-app wallet (Privy) |
| **Push Notifications** | Not available | Push for rewards |
| **Offline** | Limited | Queue events |
| **Deep Linking** | URLs | App scheme |

## React Native

\`\`\`javascript
import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-native';

function LoyaltyTracker() {
  const { user, getAccessToken } = usePrivy();
  const [balance, setBalance] = useState(0);

  const trackEvent = async (eventType, metadata = {}) => {
    try {
      const response = await fetch('https://api.loyalteez.app/loyalteez-api/manual-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brandId: 'your-brand-id',
          eventType,
          userEmail: user.email?.address,
          metadata: {
            platform: 'mobile',
            os: 'react-native',
            ...metadata,
          },
        }),
      });

      const result = await response.json();
      if (result.success) {
        console.log(\`Earned \${result.rewardAmount} LTZ!\`);
        // Update balance
        await fetchBalance();
      }
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };

  const fetchBalance = async () => {
    // Implementation depends on backend endpoint
    // This is a placeholder
  };

  return (
    <View>
      <Text>Balance: {balance} LTZ</Text>
      <Button onPress={() => trackEvent('account_creation')} title="Track Signup" />
    </View>
  );
}
\`\`\`

## iOS (Swift)

\`\`\`swift
import Foundation

class LoyaltyService {
    private let baseURL = "https://api.loyalteez.app"
    private let brandId = "your-brand-id"
    
    func trackEvent(eventType: String, userEmail: String, metadata: [String: Any] = [:]) async throws {
        let url = URL(string: "\\(baseURL)/loyalteez-api/manual-event")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body: [String: Any] = [
            "brandId": brandId,
            "eventType": eventType,
            "userEmail": userEmail,
            "metadata": [
                "platform": "mobile",
                "os": "iOS",
                "version": UIDevice.current.systemVersion
            ].merging(metadata) { (_, new) in new }
        ]
        
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw NSError(domain: "LoyaltyService", code: -1)
        }
        
        if let result = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
           let success = result["success"] as? Bool, success {
            if let reward = result["rewardAmount"] as? Int {
                print("Earned \\(reward) LTZ!")
            }
        }
    }
}

// Usage
let service = LoyaltyService()
Task {
    try await service.trackEvent(
        eventType: "account_creation",
        userEmail: "user@example.com"
    )
}
\`\`\`

## Android (Kotlin)

\`\`\`kotlin
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject

class LoyaltyService(private val brandId: String) {
    private val baseURL = "https://api.loyalteez.app"
    private val client = OkHttpClient()
    
    suspend fun trackEvent(
        eventType: String,
        userEmail: String,
        metadata: Map<String, Any> = emptyMap()
    ): Result<Int> = withContext(Dispatchers.IO) {
        try {
            val body = JSONObject().apply {
                put("brandId", brandId)
                put("eventType", eventType)
                put("userEmail", userEmail)
                put("metadata", JSONObject().apply {
                    put("platform", "mobile")
                    put("os", "Android")
                    put("version", android.os.Build.VERSION.RELEASE)
                    metadata.forEach { (key, value) -> put(key, value) }
                })
            }
            
            val requestBody = body.toString()
                .toRequestBody("application/json".toMediaType())
            
            val request = Request.Builder()
                .url("$baseURL/loyalteez-api/manual-event")
                .post(requestBody)
                .build()
            
            val response = client.newCall(request).execute()
            val responseBody = response.body?.string()
            
            if (response.isSuccessful && responseBody != null) {
                val result = JSONObject(responseBody)
                if (result.optBoolean("success", false)) {
                    val reward = result.optInt("rewardAmount", 0)
                    Result.success(reward)
                } else {
                    Result.failure(Exception("Event tracking failed"))
                }
            } else {
                Result.failure(Exception("HTTP \${response.code}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

// Usage
val service = LoyaltyService("your-brand-id")
lifecycleScope.launch {
    service.trackEvent("account_creation", "user@example.com")
        .onSuccess { reward -> 
            Log.d("Loyalty", "Earned \$reward LTZ!")
        }
        .onFailure { error ->
            Log.e("Loyalty", "Error: \${error.message}")
        }
}
\`\`\`

## Flutter (Dart)

\`\`\`dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class LoyaltyService {
  final String baseURL = 'https://api.loyalteez.app';
  final String brandId;
  
  LoyaltyService(this.brandId);
  
  Future<Map<String, dynamic>> trackEvent(
    String eventType,
    String userEmail, {
    Map<String, dynamic> metadata = const {},
  }) async {
    try {
      final body = {
        'brandId': brandId,
        'eventType': eventType,
        'userEmail': userEmail,
        'metadata': {
          'platform': 'mobile',
          'os': 'Flutter',
          ...metadata,
        },
      };
      
      final response = await http.post(
        Uri.parse('\$baseURL/loyalteez-api/manual-event'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(body),
      );
      
      if (response.statusCode == 200) {
        final result = jsonDecode(response.body) as Map<String, dynamic>;
        if (result['success'] == true) {
          final reward = result['rewardAmount'] as int? ?? 0;
          print('Earned \$reward LTZ!');
          return result;
        }
      }
      
      throw Exception('Failed to track event: \${response.statusCode}');
    } catch (e) {
      print('Error tracking event: \$e');
      rethrow;
    }
  }
}

// Usage
final service = LoyaltyService('your-brand-id');
await service.trackEvent(
  'account_creation',
  'user@example.com',
);
\`\`\`

## Mobile-Specific Features

### Push Notifications

Notify users when they earn rewards:

\`\`\`javascript
// When LTZ distributed
{
  "title": "You earned 100 LTZ!",
  "body": "Complete your profile to earn more",
  "data": {
    "type": "reward",
    "amount": 100,
    "txHash": "0x..."
  }
}
\`\`\`

### Offline Event Queueing

Queue events when offline, sync when online:

\`\`\`javascript
// Pseudocode
if (isOnline) {
  sendEvent(event);
} else {
  queueEvent(event);
  // Sync later when online
}
\`\`\`

### Deep Linking

Link directly to wallet or perks:

\`\`\`
loyalteez://wallet
loyalteez://perk/123
loyalteez://claim/456
\`\`\`

## Best Practices

1. **Queue events offline** - Don't lose data
2. **Add retry logic** - Handle network failures
3. **Use Privy for wallets** - No wallet complexity
4. **Show rewards in-app** - "You earned X LTZ!"
5. **Add push notifications** - Increase engagement
6. **Use deep linking** - Easy navigation
7. **Cache wallet address** - Reduce API calls
8. **Handle errors gracefully** - Good UX

## API Endpoints for Mobile

| Endpoint | Method | Purpose |
|----------|--------|---------|
| \`/loyalteez-api/manual-event\` | POST | Track user events |
| \`/loyalteez-api/health\` | GET | Health check |
| \`/relay\` | POST | Gasless transactions |

**Base URLs:**
- Event Handler: \`https://api.loyalteez.app\`
- Gas Relayer: \`https://relayer.loyalteez.app\`
`;

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
  if (uri === 'loyalteez://sdk/javascript') {
    return {
      contents: [
        {
          uri,
          mimeType: 'text/markdown',
          text: `# JavaScript SDK Reference

## Installation

\`\`\`html
<script src="https://api.loyalteez.app/sdk.js"></script>
\`\`\`

The SDK automatically creates a global \`LoyalteezAutomation\` object.

## Methods

${JSON.stringify(
            {
              installation: SDK_REFERENCE.installation,
              methods: SDK_REFERENCE.methods,
              autoDetection: SDK_REFERENCE.autoDetection,
              clientSideMethods: SDK_REFERENCE.clientSideMethods,
              troubleshooting: SDK_REFERENCE.troubleshooting,
              frameworkExamples: SDK_REFERENCE.frameworkExamples,
            },
            null,
            2
          )}

## Framework Examples

${JSON.stringify(SDK_REFERENCE.frameworkExamples, null, 2)}
`,
        },
      ],
    };
  }

  if (uri === 'loyalteez://sdk/mobile') {
    return {
      contents: [
        {
          uri,
          mimeType: 'text/markdown',
          text: MOBILE_SDK_EXAMPLES,
        },
      ],
    };
  }

  throw new Error(`Unknown SDK resource: ${uri}`);
}
