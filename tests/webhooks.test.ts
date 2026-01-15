/**
 * Tests for webhook tools
 */

import { describe, it, expect, vi } from 'vitest';
import { LoyalteezAPIClient } from '../src/utils/api-client.js';
import { handleValidateWebhook, handleWebhookExample } from '../src/tools/webhooks.js';

describe('Webhook Tools', () => {
  const apiClient = new LoyalteezAPIClient('mainnet');

  describe('handleValidateWebhook', () => {
    it('should validate correct webhook signature', async () => {
      const payload = JSON.stringify({ type: 'test', data: {} });
      const secret = 'test-secret';
      
      // Generate expected signature
      const crypto = await import('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

      const result = await handleValidateWebhook(apiClient, {
        payload,
        signature: expectedSignature,
        secret,
      });

      expect(result.isError).toBe(false);
      const content = JSON.parse(result.content[0].text);
      expect(content.valid).toBe(true);
    });

    it('should reject invalid webhook signature', async () => {
      const result = await handleValidateWebhook(apiClient, {
        payload: JSON.stringify({ type: 'test', data: {} }),
        signature: 'invalid-signature',
        secret: 'test-secret',
      });

      expect(result.isError).toBe(false);
      const content = JSON.parse(result.content[0].text);
      expect(content.valid).toBe(false);
    });

    it('should handle missing parameters', async () => {
      const result = await handleValidateWebhook(apiClient, {
        payload: '',
        signature: '',
        secret: '',
      });

      // Should not error, but signature will be invalid
      expect(result.isError).toBe(false);
    });
  });

  describe('handleWebhookExample', () => {
    it('should generate Express webhook code', async () => {
      const result = await handleWebhookExample(apiClient, {
        framework: 'express',
        endpoint: '/webhooks/loyalteez',
      });

      expect(result.isError).toBe(false);
      expect(result.content[0].text).toContain('express');
      expect(result.content[0].text).toContain('/webhooks/loyalteez');
      expect(result.content[0].text).toContain('verifyWebhookSignature');
    });

    it('should generate Next.js webhook code', async () => {
      const result = await handleWebhookExample(apiClient, {
        framework: 'nextjs',
      });

      expect(result.isError).toBe(false);
      expect(result.content[0].text).toContain('Next.js');
      expect(result.content[0].text).toContain('API Route');
    });

    it('should generate Flask webhook code', async () => {
      const result = await handleWebhookExample(apiClient, {
        framework: 'flask',
      });

      expect(result.isError).toBe(false);
      expect(result.content[0].text).toContain('Flask');
      expect(result.content[0].text).toContain('Python');
    });

    it('should generate Rails webhook code', async () => {
      const result = await handleWebhookExample(apiClient, {
        framework: 'rails',
      });

      expect(result.isError).toBe(false);
      expect(result.content[0].text).toContain('Rails');
      expect(result.content[0].text).toContain('Ruby');
    });

    it('should generate PHP webhook code', async () => {
      const result = await handleWebhookExample(apiClient, {
        framework: 'php',
      });

      expect(result.isError).toBe(false);
      expect(result.content[0].text).toContain('PHP');
    });

    it('should generate generic webhook code', async () => {
      const result = await handleWebhookExample(apiClient, {
        framework: 'generic',
      });

      expect(result.isError).toBe(false);
      expect(result.content[0].text).toContain('Generic');
    });

    it('should use default endpoint if not provided', async () => {
      const result = await handleWebhookExample(apiClient, {
        framework: 'express',
      });

      expect(result.isError).toBe(false);
      expect(result.content[0].text).toContain('/webhooks/loyalteez');
    });
  });
});
