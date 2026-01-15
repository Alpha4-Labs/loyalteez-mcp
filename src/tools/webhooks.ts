/**
 * Webhook receiving and validation tools
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { LoyalteezAPIClient } from '../utils/api-client.js';
import { z } from 'zod';
import crypto from 'crypto';

/**
 * Register webhook tools
 */
export function registerWebhookTools(apiClient: LoyalteezAPIClient): Tool[] {
  return [validateWebhookTool(apiClient), webhookExampleTool(apiClient)];
}

/**
 * Validate webhook signature tool
 */
function validateWebhookTool(_apiClient: LoyalteezAPIClient): Tool {
  return {
    name: 'loyalteez_validate_webhook',
    description: `Validate a webhook signature to ensure the request is from Loyalteez. Use this to verify webhook authenticity before processing events.

Webhook signatures use HMAC-SHA256. Always verify signatures to prevent unauthorized requests.

See also: loyalteez://docs/guides/webhooks`,
    inputSchema: {
      type: 'object',
      properties: {
        payload: {
          type: 'string',
          description: 'Raw webhook payload (request body as string)',
        },
        signature: {
          type: 'string',
          description: 'Webhook signature from X-Loyalteez-Signature header',
        },
        secret: {
          type: 'string',
          description: 'Your webhook secret (configured in Partner Portal)',
        },
      },
      required: ['payload', 'signature', 'secret'],
    },
  };
}

/**
 * Generate webhook receiver code tool
 */
function webhookExampleTool(_apiClient: LoyalteezAPIClient): Tool {
  return {
    name: 'loyalteez_webhook_example',
    description: `Generate complete webhook receiver code for your framework. Returns ready-to-use code with signature verification, error handling, and event processing.

Supports: Node.js/Express, Next.js API routes, Python/Flask, Ruby/Rails, PHP.

See also: loyalteez://docs/guides/webhooks`,
    inputSchema: {
      type: 'object',
      properties: {
        framework: {
          type: 'string',
          enum: ['express', 'nextjs', 'flask', 'rails', 'php', 'generic'],
          description: 'Framework for code generation',
        },
        endpoint: {
          type: 'string',
          description: 'Your webhook endpoint URL (e.g., /webhooks/loyalteez)',
        },
      },
      required: ['framework'],
    },
  };
}

/**
 * Handle validate_webhook tool call
 */
export async function handleValidateWebhook(
  _apiClient: LoyalteezAPIClient,
  args: unknown
): Promise<CallToolResult> {
  try {
    const params = z.object({
      payload: z.string(),
      signature: z.string(),
      secret: z.string(),
    }).parse(args);

    // Verify signature using HMAC-SHA256
    const expectedSignature = crypto
      .createHmac('sha256', params.secret)
      .update(params.payload)
      .digest('hex');

    // Handle both formats: raw hex or whsec_ prefixed
    let receivedSig = params.signature;
    if (receivedSig.startsWith('whsec_')) {
      receivedSig = receivedSig.slice(6); // Remove 'whsec_' prefix
    }

    // Normalize both to hex for comparison
    // Handle empty or invalid signatures gracefully
    let isValid = false;
    try {
      if (receivedSig && receivedSig.length > 0 && expectedSignature.length > 0) {
        const receivedBuffer = Buffer.from(receivedSig, 'hex');
        const expectedBuffer = Buffer.from(expectedSignature, 'hex');
        
        // Only compare if buffers are same length (timingSafeEqual requirement)
        if (receivedBuffer.length === expectedBuffer.length) {
          isValid = crypto.timingSafeEqual(receivedBuffer, expectedBuffer);
        }
      }
    } catch {
      // Invalid hex or other error - signature is invalid
      isValid = false;
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              valid: isValid,
              message: isValid
                ? 'Webhook signature is valid'
                : 'Webhook signature is invalid - request may not be from Loyalteez',
              expectedSignature,
              receivedSignature: params.signature,
            },
            null,
            2
          ),
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              error: 'Error validating webhook',
              message: errorMessage,
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
}

/**
 * Handle webhook_example tool call
 */
export async function handleWebhookExample(
  _apiClient: LoyalteezAPIClient,
  args: unknown
): Promise<CallToolResult> {
  try {
    const params = z.object({
      framework: z.enum(['express', 'nextjs', 'flask', 'rails', 'php', 'generic']),
      endpoint: z.string().optional().default('/webhooks/loyalteez'),
    }).parse(args);

    const endpoint = params.endpoint || '/webhooks/loyalteez';
    const code = generateWebhookCode(params.framework, endpoint);

    return {
      content: [
        {
          type: 'text',
          text: code,
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: `Error generating webhook code: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Generate webhook receiver code for a framework
 */
function generateWebhookCode(framework: string, endpoint: string): string {
  const expressCode = `// Node.js/Express Webhook Receiver
const express = require('express');
const crypto = require('crypto');
const app = express();

// Middleware to capture raw body for signature verification
app.use('${endpoint}', express.raw({ type: 'application/json' }));

app.post('${endpoint}', (req, res) => {
  const signature = req.headers['x-loyalteez-signature'];
  const webhookSecret = process.env.LOYALTEEZ_WEBHOOK_SECRET;
  
  if (!signature || !webhookSecret) {
    return res.status(401).json({ error: 'Missing signature or secret' });
  }
  
  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(req.body)
    .digest('hex');
  
  if (!crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Parse webhook payload
  const event = JSON.parse(req.body.toString());
  
  // Process webhook event
  switch (event.type) {
    case 'reward.distributed':
      console.log(\`User \${event.data.userEmail} earned \${event.data.amount} LTZ\`);
      // Your reward handling logic
      break;
    
    case 'perk.redeemed':
      console.log(\`User \${event.data.userEmail} redeemed perk \${event.data.perkId}\`);
      // Your perk handling logic
      break;
    
    default:
      console.log(\`Unhandled event type: \${event.type}\`);
  }
  
  res.json({ received: true });
});

app.listen(3000, () => {
  console.log('Webhook receiver listening on port 3000');
});`;

  const nextjsCode = `// Next.js API Route: pages/api/webhooks/loyalteez.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export const config = {
  api: {
    bodyParser: false, // We need raw body for signature verification
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const signature = req.headers['x-loyalteez-signature'] as string;
  const webhookSecret = process.env.LOYALTEEZ_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return res.status(401).json({ error: 'Missing signature or secret' });
  }

  // Get raw body
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const rawBody = Buffer.concat(chunks);

  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  if (!crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Parse webhook payload
  const event = JSON.parse(rawBody.toString());

  // Process webhook event
  switch (event.type) {
    case 'reward.distributed':
      console.log(\`User \${event.data.userEmail} earned \${event.data.amount} LTZ\`);
      // Your reward handling logic
      break;

    case 'perk.redeemed':
      console.log(\`User \${event.data.userEmail} redeemed perk \${event.data.perkId}\`);
      // Your perk handling logic
      break;

    default:
      console.log(\`Unhandled event type: \${event.type}\`);
  }

  res.json({ received: true });
}`;

  const flaskCode = `# Python/Flask Webhook Receiver
from flask import Flask, request, jsonify
import hmac
import hashlib
import os

app = Flask(__name__)

@app.route('${endpoint}', methods=['POST'])
def webhook():
    signature = request.headers.get('X-Loyalteez-Signature')
    webhook_secret = os.environ.get('LOYALTEEZ_WEBHOOK_SECRET')
    
    if not signature or not webhook_secret:
        return jsonify({'error': 'Missing signature or secret'}), 401
    
    # Get raw body
    raw_body = request.get_data()
    
    # Verify signature
    expected_signature = hmac.new(
        webhook_secret.encode(),
        raw_body,
        hashlib.sha256
    ).hexdigest()
    
    if not hmac.compare_digest(signature, expected_signature):
        return jsonify({'error': 'Invalid signature'}), 401
    
    # Parse webhook payload
    event = request.get_json()
    
    # Process webhook event
    if event['type'] == 'reward.distributed':
        print(f"User {event['data']['userEmail']} earned {event['data']['amount']} LTZ")
        # Your reward handling logic
    elif event['type'] == 'perk.redeemed':
        print(f"User {event['data']['userEmail']} redeemed perk {event['data']['perkId']}")
        # Your perk handling logic
    else:
        print(f"Unhandled event type: {event['type']}")
    
    return jsonify({'received': True})

if __name__ == '__main__':
    app.run(port=3000)`;

  const railsCode = `# Ruby/Rails Webhook Receiver
# config/routes.rb
# post '${endpoint}', to: 'webhooks#loyalteez'

class WebhooksController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :verify_webhook_signature

  def loyalteez
    event = JSON.parse(request.body.read)
    
    case event['type']
    when 'reward.distributed'
      Rails.logger.info("User #{event['data']['userEmail']} earned #{event['data']['amount']} LTZ")
      # Your reward handling logic
    when 'perk.redeemed'
      Rails.logger.info("User #{event['data']['userEmail']} redeemed perk #{event['data']['perkId']}")
      # Your perk handling logic
    else
      Rails.logger.info("Unhandled event type: #{event['type']}")
    end
    
    render json: { received: true }
  end

  private

  def verify_webhook_signature
    signature = request.headers['X-Loyalteez-Signature']
    webhook_secret = ENV['LOYALTEEZ_WEBHOOK_SECRET']
    
    return head :unauthorized unless signature && webhook_secret
    
    expected_signature = OpenSSL::HMAC.hexdigest(
      'sha256',
      webhook_secret,
      request.body.read
    )
    
    unless ActiveSupport::SecurityUtils.secure_compare(signature, expected_signature)
      head :unauthorized
    end
  end
end`;

  const phpCode = `<?php
// PHP Webhook Receiver
header('Content-Type: application/json');

$signature = $_SERVER['HTTP_X_LOYALTEEZ_SIGNATURE'] ?? null;
$webhook_secret = getenv('LOYALTEEZ_WEBHOOK_SECRET');

if (!$signature || !$webhook_secret) {
    http_response_code(401);
    echo json_encode(['error' => 'Missing signature or secret']);
    exit;
}

// Get raw body
$raw_body = file_get_contents('php://input');

// Verify signature
$expected_signature = hash_hmac('sha256', $raw_body, $webhook_secret);

if (!hash_equals($signature, $expected_signature)) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid signature']);
    exit;
}

// Parse webhook payload
$event = json_decode($raw_body, true);

// Process webhook event
switch ($event['type']) {
    case 'reward.distributed':
        error_log("User {$event['data']['userEmail']} earned {$event['data']['amount']} LTZ");
        // Your reward handling logic
        break;
    
    case 'perk.redeemed':
        error_log("User {$event['data']['userEmail']} redeemed perk {$event['data']['perkId']}");
        // Your perk handling logic
        break;
    
    default:
        error_log("Unhandled event type: {$event['type']}");
}

echo json_encode(['received' => true]);
?>`;

  const genericCode = `# Generic Webhook Receiver Template
# This template works for any framework/language

# 1. Get the signature from header
signature = request.headers['X-Loyalteez-Signature']
webhook_secret = os.environ['LOYALTEEZ_WEBHOOK_SECRET']

# 2. Get raw request body (important: must be raw, not parsed)
raw_body = request.raw_body  # Framework-specific

# 3. Verify signature using HMAC-SHA256
expected_signature = hmac.new(
    webhook_secret.encode(),
    raw_body,
    hashlib.sha256
).hexdigest()

if not hmac.compare_digest(signature, expected_signature):
    return 401  # Unauthorized

# 4. Parse webhook payload
event = json.loads(raw_body)

# 5. Process webhook event
if event['type'] == 'reward.distributed':
    # Handle reward distributed
    user_email = event['data']['userEmail']
    amount = event['data']['amount']
    # Your logic here

elif event['type'] == 'perk.redeemed':
    # Handle perk redeemed
    user_email = event['data']['userEmail']
    perk_id = event['data']['perkId']
    # Your logic here

# 6. Return success
return {'received': true}`;

  const codeMap: Record<string, string> = {
    express: expressCode,
    nextjs: nextjsCode,
    flask: flaskCode,
    rails: railsCode,
    php: phpCode,
    generic: genericCode,
  };

  return codeMap[framework] || genericCode;
}
