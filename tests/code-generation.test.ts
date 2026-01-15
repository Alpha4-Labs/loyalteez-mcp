/**
 * Tests for code generation functionality
 */

import { describe, it, expect } from 'vitest';
import { handleDesignProgram } from '../src/tools/program-design.js';
import { LoyalteezAPIClient } from '../src/utils/api-client.js';

describe('Code Generation', () => {
  const apiClient = new LoyalteezAPIClient('mainnet');

  describe('Program Design Code Generation', () => {
    it('should generate Discord bot code with TypeScript types', async () => {
      const result = await handleDesignProgram(apiClient, {
        context: {
          appType: 'discord_community',
          goals: ['increase_engagement'],
          platforms: ['discord'],
        },
      });

      expect(result.isError).not.toBe(true);
      const content = JSON.parse(result.content[0].text);
      
      expect(content.implementation).toBeDefined();
      expect(content.implementation.discord).toBeDefined();
      expect(content.implementation.discord).toContain('TypeScript');
      expect(content.implementation.discord).toContain('interface');
      expect(content.implementation.discord).toContain('error handling');
    });

    it('should generate Telegram bot code with error handling', async () => {
      const result = await handleDesignProgram(apiClient, {
        context: {
          appType: 'telegram_group',
          goals: ['increase_engagement'],
          platforms: ['telegram'],
        },
      });

      expect(result.isError).not.toBe(true);
      const content = JSON.parse(result.content[0].text);
      
      expect(content.implementation.telegram).toBeDefined();
      expect(content.implementation.telegram).toContain('TypeScript');
      expect(content.implementation.telegram).toContain('try');
      expect(content.implementation.telegram).toContain('catch');
    });

    it('should generate web SDK code with initialization', async () => {
      const result = await handleDesignProgram(apiClient, {
        context: {
          appType: 'ecommerce',
          goals: ['drive_purchases'],
          platforms: ['web'],
        },
      });

      expect(result.isError).not.toBe(true);
      const content = JSON.parse(result.content[0].text);
      
      expect(content.implementation.web).toBeDefined();
      expect(content.implementation.web).toContain('LoyalteezAutomation');
      expect(content.implementation.web).toContain('init');
    });

    it('should generate webhook code with signature verification', async () => {
      const result = await handleDesignProgram(apiClient, {
        context: {
          appType: 'saas',
          goals: ['increase_engagement'],
          platforms: ['web'],
        },
      });

      expect(result.isError).not.toBe(true);
      const content = JSON.parse(result.content[0].text);
      
      expect(content.implementation.webhooks).toBeDefined();
      expect(content.implementation.webhooks).toContain('verifyWebhookSignature');
      expect(content.implementation.webhooks).toContain('createHmac');
    });

    it('should include test files in generated code', async () => {
      const result = await handleDesignProgram(apiClient, {
        context: {
          appType: 'discord_community',
          goals: ['increase_engagement'],
          platforms: ['discord'],
        },
      });

      expect(result.isError).not.toBe(true);
      const content = JSON.parse(result.content[0].text);
      
      expect(content.implementation.discord).toContain('test');
      expect(content.implementation.discord).toContain('vitest');
      expect(content.implementation.discord).toContain('describe');
    });
  });

  describe('Code Syntax Validation', () => {
    it('should generate valid TypeScript code', async () => {
      const result = await handleDesignProgram(apiClient, {
        context: {
          appType: 'discord_community',
          goals: ['increase_engagement'],
          platforms: ['discord'],
        },
      });

      expect(result.isError).not.toBe(true);
      const content = JSON.parse(result.content[0].text);
      const code = content.implementation.discord;

      // Check for TypeScript syntax
      expect(code).toContain('interface');
      expect(code).toContain('class');
      expect(code).toContain('async');
      expect(code).toContain('await');
    });

    it('should include error handling patterns', async () => {
      const result = await handleDesignProgram(apiClient, {
        context: {
          appType: 'telegram_group',
          goals: ['increase_engagement'],
          platforms: ['telegram'],
        },
      });

      expect(result.isError).not.toBe(true);
      const content = JSON.parse(result.content[0].text);
      const code = content.implementation.telegram;

      expect(code).toContain('try');
      expect(code).toContain('catch');
      expect(code).toContain('error');
    });
  });
});
