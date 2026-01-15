/**
 * Tests for validation utilities
 */

import { describe, it, expect } from 'vitest';
import {
  validateBrandId,
  validateEventType,
  validateEmail,
  validateUserIdentifier,
  validateEventDefinition,
  validateProgramContext,
} from '../src/utils/validation.js';

describe('Validation Utilities', () => {
  describe('validateBrandId', () => {
    it('should validate correct brandId', () => {
      const brandId = '0x1234567890123456789012345678901234567890';
      expect(validateBrandId(brandId)).toBe(brandId.toLowerCase());
    });

    it('should reject invalid brandId format', () => {
      expect(() => validateBrandId('invalid')).toThrow();
      expect(() => validateBrandId('0x123')).toThrow();
      expect(() => validateBrandId('')).toThrow();
    });
  });

  describe('validateEventType', () => {
    it('should validate correct event types', () => {
      expect(validateEventType('daily_checkin')).toBe('daily_checkin');
      expect(validateEventType('purchase')).toBe('purchase');
      expect(validateEventType('custom_event_123')).toBe('custom_event_123');
    });

    it('should reject invalid event types', () => {
      expect(() => validateEventType('event with spaces')).toThrow();
      expect(() => validateEventType('event-with-dashes')).toThrow();
      expect(() => validateEventType('a'.repeat(51))).toThrow();
    });
  });

  describe('validateEmail', () => {
    it('should validate correct emails', () => {
      expect(validateEmail('user@example.com')).toBe('user@example.com');
      expect(validateEmail('test.user+tag@example.co.uk')).toBe('test.user+tag@example.co.uk');
    });

    it('should reject invalid emails', () => {
      expect(() => validateEmail('invalid')).toThrow();
      expect(() => validateEmail('@example.com')).toThrow();
      expect(() => validateEmail('user@')).toThrow();
    });
  });

  describe('validateUserIdentifier', () => {
    it('should validate email identifier', () => {
      const result = validateUserIdentifier({ email: 'user@example.com' });
      expect(result.email).toBe('user@example.com');
    });

    it('should validate platform identifier', () => {
      const result = validateUserIdentifier({
        platform: 'discord',
        platformUserId: '123456789',
      });
      expect(result.platform).toBe('discord');
      expect(result.platformUserId).toBe('123456789');
    });

    it('should reject missing identifier', () => {
      expect(() => validateUserIdentifier({})).toThrow();
      expect(() => validateUserIdentifier({ email: '' })).toThrow();
      expect(() => validateUserIdentifier({ platform: 'discord' })).toThrow();
    });
  });

  describe('validateEventDefinition', () => {
    it('should validate correct event definition', () => {
      const event = {
        name: 'Daily Check-in',
        description: 'User checks in daily',
        defaultReward: 50,
        maxClaimsPerUser: 1,
      };
      expect(() => validateEventDefinition(event)).not.toThrow();
    });

    it('should reject invalid event definition', () => {
      expect(() => validateEventDefinition({})).toThrow();
      expect(() => validateEventDefinition({ name: 'ab' })).toThrow(); // Too short
      expect(() => validateEventDefinition({ name: 'Test', description: 'short' })).toThrow(); // Description too short
    });
  });

  describe('validateProgramContext', () => {
    it('should validate correct program context', () => {
      const context = {
        appType: 'discord_community',
        goals: ['increase_engagement'],
        platforms: ['discord'],
      };
      expect(() => validateProgramContext(context)).not.toThrow();
    });

    it('should reject invalid program context', () => {
      expect(() => validateProgramContext({})).toThrow();
      expect(() => validateProgramContext({ appType: 'discord' })).toThrow(); // Missing goals
      expect(() => validateProgramContext({ appType: 'discord', goals: [] })).toThrow(); // Empty goals
    });
  });
});
