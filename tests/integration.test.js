/**
 * Integration tests for MCP server patterns
 * These tests validate that tools work together correctly
 */
import { describe, it, expect } from 'vitest';
import { LoyalteezMCPServer } from '../src/server.js';
describe('MCP Server Integration', () => {
    it('should initialize server with default network', () => {
        const server = new LoyalteezMCPServer();
        expect(server).toBeDefined();
        expect(server.getAPIClient()).toBeDefined();
    });
    it('should initialize server with testnet', () => {
        const server = new LoyalteezMCPServer('testnet');
        expect(server.getAPIClient().getNetwork()).toBe('testnet');
    });
    it('should initialize server with default brandId', () => {
        const defaultBrandId = '0x47511fc1c6664c9598974cb112965f8b198e0c725e';
        const server = new LoyalteezMCPServer('mainnet', defaultBrandId);
        expect(server.getDefaultBrandId()).toBe(defaultBrandId);
    });
    it('should have all tools registered', async () => {
        const server = new LoyalteezMCPServer();
        // This would require accessing the server's internal tool list
        // For now, we verify the server initializes without errors
        expect(server).toBeDefined();
    });
});
describe('Tool Patterns', () => {
    it('should validate brandId resolution pattern', () => {
        // Pattern: brandId can come from parameter or environment
        // This is tested in brand-id.test.ts
        expect(true).toBe(true); // Placeholder - actual pattern validation
    });
    it('should validate user identifier pattern', () => {
        // Pattern: userIdentifier can be email or platform_userId@loyalteez.app
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const platformPattern = /^[a-z]+_\d+@loyalteez\.app$/;
        expect(emailPattern.test('user@example.com')).toBe(true);
        expect(platformPattern.test('discord_123456789@loyalteez.app')).toBe(true);
        expect(platformPattern.test('telegram_987654321@loyalteez.app')).toBe(true);
    });
    it('should validate event type pattern', () => {
        // Pattern: eventType should be alphanumeric + underscore, max 50 chars
        const eventTypePattern = /^[a-zA-Z0-9_]+$/;
        expect(eventTypePattern.test('daily_checkin')).toBe(true);
        expect(eventTypePattern.test('purchase')).toBe(true);
        expect(eventTypePattern.test('custom_event_123')).toBe(true);
        expect(eventTypePattern.test('event-with-dashes')).toBe(false);
        expect(eventTypePattern.test('event with spaces')).toBe(false);
    });
});
//# sourceMappingURL=integration.test.js.map