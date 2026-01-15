/**
 * Tests for API client
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoyalteezAPIClient } from '../src/utils/api-client.js';
// Mock fetch globally
global.fetch = vi.fn();
describe('LoyalteezAPIClient', () => {
    let apiClient;
    beforeEach(() => {
        apiClient = new LoyalteezAPIClient('mainnet');
        vi.clearAllMocks();
    });
    describe('Network Configuration', () => {
        it('should default to mainnet', () => {
            const client = new LoyalteezAPIClient();
            expect(client.getNetwork()).toBe('mainnet');
        });
        it('should support testnet', () => {
            const client = new LoyalteezAPIClient('testnet');
            expect(client.getNetwork()).toBe('testnet');
        });
        it('should allow network switching', () => {
            apiClient.setNetwork('testnet');
            expect(apiClient.getNetwork()).toBe('testnet');
            apiClient.setNetwork('mainnet');
            expect(apiClient.getNetwork()).toBe('mainnet');
        });
    });
    describe('API Methods', () => {
        it('should have trackEvent method', () => {
            expect(typeof apiClient.trackEvent).toBe('function');
        });
        it('should have getEventConfig method', () => {
            expect(typeof apiClient.getEventConfig).toBe('function');
        });
        it('should have bulkEvents method', () => {
            expect(typeof apiClient.bulkEvents).toBe('function');
        });
        it('should have recordStreakActivity method', () => {
            expect(typeof apiClient.recordStreakActivity).toBe('function');
        });
        it('should have getLeaderboard method', () => {
            expect(typeof apiClient.getLeaderboard).toBe('function');
        });
        it('should have pregenerateUser method', () => {
            expect(typeof apiClient.pregenerateUser).toBe('function');
        });
        it('should have getUserBalance method', () => {
            expect(typeof apiClient.getUserBalance).toBe('function');
        });
        it('should have checkEligibility method', () => {
            expect(typeof apiClient.checkEligibility).toBe('function');
        });
        it('should have getUserStats method', () => {
            expect(typeof apiClient.getUserStats).toBe('function');
        });
        it('should have relayTransaction method', () => {
            expect(typeof apiClient.relayTransaction).toBe('function');
        });
        it('should have getStreakStatus method', () => {
            expect(typeof apiClient.getStreakStatus).toBe('function');
        });
        it('should have claimStreakMilestone method', () => {
            expect(typeof apiClient.claimStreakMilestone).toBe('function');
        });
        it('should have logActivity method', () => {
            expect(typeof apiClient.logActivity).toBe('function');
        });
        it('should have calculateReward method', () => {
            expect(typeof apiClient.calculateReward).toBe('function');
        });
        it('should have updateLeaderboardStats method', () => {
            expect(typeof apiClient.updateLeaderboardStats).toBe('function');
        });
        it('should have createDrop method', () => {
            expect(typeof apiClient.createDrop).toBe('function');
        });
        it('should have claimDrop method', () => {
            expect(typeof apiClient.claimDrop).toBe('function');
        });
        it('should have processThirdPartyEvent method', () => {
            expect(typeof apiClient.processThirdPartyEvent).toBe('function');
        });
        it('should have getPerks method', () => {
            expect(typeof apiClient.getPerks).toBe('function');
        });
        it('should have checkPerkEligibility method', () => {
            expect(typeof apiClient.checkPerkEligibility).toBe('function');
        });
        it('should have redeemPerk method', () => {
            expect(typeof apiClient.redeemPerk).toBe('function');
        });
        it('should have getUserAchievements method', () => {
            expect(typeof apiClient.getUserAchievements).toBe('function');
        });
        it('should have updateAchievementProgress method', () => {
            expect(typeof apiClient.updateAchievementProgress).toBe('function');
        });
    });
    describe('Error Handling', () => {
        it('should handle HTTP errors', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                status: 400,
                statusText: 'Bad Request',
                json: async () => ({ error: 'Invalid request' }),
            });
            await expect(apiClient.trackEvent({
                brandId: '0x47511fc1c6664c9598974cb112965f8b198e0c725e',
                eventType: 'test',
                userEmail: 'test@example.com',
            })).rejects.toThrow();
        });
        it('should handle network errors', async () => {
            global.fetch.mockRejectedValueOnce(new Error('Network error'));
            await expect(apiClient.trackEvent({
                brandId: '0x47511fc1c6664c9598974cb112965f8b198e0c725e',
                eventType: 'test',
                userEmail: 'test@example.com',
            })).rejects.toThrow();
        });
    });
});
//# sourceMappingURL=api-client.test.js.map