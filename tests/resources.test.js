/**
 * Tests for MCP resources
 */
import { describe, it, expect } from 'vitest';
import { listContractResources, readContractResource, isContractResource, } from '../src/resources/contracts.js';
import { listNetworkResources, readNetworkResource, isNetworkResource, } from '../src/resources/network.js';
import { listEventTypeResources, readEventTypeResource, isEventTypeResource, } from '../src/resources/event-types.js';
import { listSharedServicesResources, readSharedServicesResource, isSharedServicesResource, } from '../src/resources/shared-services.js';
import { listOAuthResources, readOAuthResource, isOAuthResource, } from '../src/resources/oauth.js';
describe('Contract Resources', () => {
    it('should list all contract resources', () => {
        const resources = listContractResources();
        expect(resources.length).toBeGreaterThan(0);
        expect(resources.some((r) => r.uri === 'loyalteez://contracts/ltz-token')).toBe(true);
    });
    it('should read contract resource', () => {
        const result = readContractResource('loyalteez://contracts/ltz-token');
        expect(result.contents).toHaveLength(1);
        expect(result.contents[0].mimeType).toBe('application/json');
        const data = JSON.parse(result.contents[0].text);
        expect(data.address).toBeDefined();
    });
    it('should identify contract resources', () => {
        expect(isContractResource('loyalteez://contracts/ltz-token')).toBe(true);
        expect(isContractResource('loyalteez://docs/architecture')).toBe(false);
    });
});
describe('Network Resources', () => {
    it('should list network resources', () => {
        const resources = listNetworkResources();
        expect(resources.length).toBeGreaterThan(0);
    });
    it('should read network resource', () => {
        const result = readNetworkResource('loyalteez://network/config');
        expect(result.contents).toHaveLength(1);
        const data = JSON.parse(result.contents[0].text);
        expect(data.chainId).toBe(1868);
    });
    it('should identify network resources', () => {
        expect(isNetworkResource('loyalteez://network/config')).toBe(true);
        expect(isNetworkResource('loyalteez://contracts/all')).toBe(false);
    });
});
describe('Event Type Resources', () => {
    it('should list event type resources', () => {
        const resources = listEventTypeResources();
        expect(resources.length).toBeGreaterThan(0);
    });
    it('should read event type resource', () => {
        const result = readEventTypeResource('loyalteez://events/standard');
        expect(result.contents).toHaveLength(1);
        const data = JSON.parse(result.contents[0].text);
        expect(data.standardEvents).toBeDefined();
        expect(Array.isArray(data.standardEvents)).toBe(true);
    });
    it('should identify event type resources', () => {
        expect(isEventTypeResource('loyalteez://events/standard')).toBe(true);
        expect(isEventTypeResource('loyalteez://network/config')).toBe(false);
    });
});
describe('Shared Services Resources', () => {
    it('should list shared services resources', () => {
        const resources = listSharedServicesResources();
        expect(resources.length).toBeGreaterThan(0);
    });
    it('should read shared services resource', () => {
        const result = readSharedServicesResource('loyalteez://shared-services/endpoints');
        expect(result.contents).toHaveLength(1);
        const data = JSON.parse(result.contents[0].text);
        expect(data.services).toBeDefined();
        expect(data.services.streak).toBeDefined();
    });
    it('should identify shared services resources', () => {
        expect(isSharedServicesResource('loyalteez://shared-services/endpoints')).toBe(true);
        expect(isSharedServicesResource('loyalteez://events/standard')).toBe(false);
    });
});
describe('OAuth Resources', () => {
    it('should list OAuth resources', () => {
        const resources = listOAuthResources();
        expect(resources.length).toBeGreaterThan(0);
    });
    it('should read OAuth resource', () => {
        const result = readOAuthResource('loyalteez://platforms/mappings');
        expect(result.contents).toHaveLength(1);
        const data = JSON.parse(result.contents[0].text);
        expect(data.providers).toBeDefined();
        expect(data.providers.discord).toBeDefined();
    });
    it('should identify OAuth resources', () => {
        expect(isOAuthResource('loyalteez://platforms/mappings')).toBe(true);
        expect(isOAuthResource('loyalteez://shared-services/endpoints')).toBe(false);
    });
});
//# sourceMappingURL=resources.test.js.map