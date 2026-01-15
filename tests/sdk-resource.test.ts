/**
 * Tests for SDK resource content validation
 */

import { describe, it, expect } from 'vitest';
import { listSDKResources, readSDKResource, isSDKResource } from '../src/resources/sdk.js';

describe('SDK Resources', () => {
  describe('listSDKResources', () => {
    it('should list all SDK resources', () => {
      const resources = listSDKResources();

      expect(resources.length).toBeGreaterThan(0);
      expect(resources.some(r => r.uri === 'loyalteez://sdk/javascript')).toBe(true);
      expect(resources.some(r => r.uri === 'loyalteez://sdk/mobile')).toBe(true);
    });

    it('should have correct resource properties', () => {
      const resources = listSDKResources();

      for (const resource of resources) {
        expect(resource).toHaveProperty('uri');
        expect(resource).toHaveProperty('name');
        expect(resource).toHaveProperty('description');
        expect(resource).toHaveProperty('mimeType');
        expect(resource.uri).toMatch(/^loyalteez:\/\/sdk\//);
      }
    });
  });

  describe('readSDKResource', () => {
    it('should read JavaScript SDK resource', () => {
      const result = readSDKResource('loyalteez://sdk/javascript');

      expect(result.contents).toHaveLength(1);
      expect(result.contents[0].uri).toBe('loyalteez://sdk/javascript');
      expect(result.contents[0].mimeType).toBe('text/markdown');
      expect(result.contents[0].text).toContain('JavaScript SDK');
    });

    it('should read mobile SDK resource', () => {
      const result = readSDKResource('loyalteez://sdk/mobile');

      expect(result.contents).toHaveLength(1);
      expect(result.contents[0].uri).toBe('loyalteez://sdk/mobile');
      expect(result.contents[0].mimeType).toBe('text/markdown');
      expect(result.contents[0].text).toContain('Mobile SDK');
      expect(result.contents[0].text).toContain('React Native');
      expect(result.contents[0].text).toContain('iOS');
      expect(result.contents[0].text).toContain('Android');
      expect(result.contents[0].text).toContain('Flutter');
    });

    it('should throw error for unknown SDK resource', () => {
      expect(() => readSDKResource('loyalteez://sdk/unknown')).toThrow();
    });
  });

  describe('isSDKResource', () => {
    it('should identify SDK resources', () => {
      expect(isSDKResource('loyalteez://sdk/javascript')).toBe(true);
      expect(isSDKResource('loyalteez://sdk/mobile')).toBe(true);
      expect(isSDKResource('loyalteez://sdk/examples')).toBe(true);
    });

    it('should reject non-SDK resources', () => {
      expect(isSDKResource('loyalteez://docs/api')).toBe(false);
      expect(isSDKResource('loyalteez://contracts/ltz-token')).toBe(false);
      expect(isSDKResource('invalid-uri')).toBe(false);
    });
  });

  describe('SDK Resource Content', () => {
    it('should include client-side methods in JavaScript SDK', () => {
      const result = readSDKResource('loyalteez://sdk/javascript');
      const content = result.contents[0].text;

      // Check for client-side methods
      expect(content).toContain('identify');
      expect(content).toContain('reset');
      expect(content).toContain('getUserWallet');
      expect(content).toContain('startAutoDetection');
      expect(content).toContain('stopAutoDetection');
    });

    it('should include mobile examples', () => {
      const result = readSDKResource('loyalteez://sdk/mobile');
      const content = result.contents[0].text;

      expect(content).toContain('React Native');
      expect(content).toContain('iOS');
      expect(content).toContain('Android');
      expect(content).toContain('Flutter');
    });

    it('should include troubleshooting information', () => {
      const result = readSDKResource('loyalteez://sdk/javascript');
      const content = result.contents[0].text;

      expect(content).toContain('troubleshooting');
    });
  });
});
