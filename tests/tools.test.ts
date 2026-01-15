/**
 * Tests for tool registration and schemas
 */

import { describe, it, expect } from 'vitest';
import { LoyalteezAPIClient } from '../src/utils/api-client.js';
import { registerEventTools } from '../src/tools/events.js';
import { registerIdentityTool } from '../src/tools/identity.js';
import { registerEngagementTools } from '../src/tools/engagement.js';
import { registerUserTools } from '../src/tools/user.js';
import { registerTransactionTools } from '../src/tools/transactions.js';
import { registerDropTools } from '../src/tools/drops.js';
import { registerIntegrationTools } from '../src/tools/integrations.js';
import { registerPerksTools } from '../src/tools/perks.js';
import { registerAchievementTools } from '../src/tools/achievements.js';
import { registerProgramDesignTool } from '../src/tools/program-design.js';

describe('Tool Registration', () => {
  const apiClient = new LoyalteezAPIClient('mainnet');

  it('should register event tools', () => {
    const tools = registerEventTools(apiClient);
    expect(tools.length).toBeGreaterThan(0);
    expect(tools.some((t) => t.name === 'loyalteez_create_event')).toBe(true);
    expect(tools.some((t) => t.name === 'loyalteez_track_event')).toBe(true);
    expect(tools.some((t) => t.name === 'loyalteez_get_event_config')).toBe(true);
  });

  it('should register identity tools', () => {
    const tools = registerIdentityTool(apiClient);
    expect(tools.length).toBeGreaterThan(0);
    expect(tools.some((t) => t.name === 'loyalteez_resolve_user')).toBe(true);
  });

  it('should register engagement tools', () => {
    const tools = registerEngagementTools(apiClient);
    expect(tools.length).toBeGreaterThan(0);
    expect(tools.some((t) => t.name === 'loyalteez_streak_checkin')).toBe(true);
    expect(tools.some((t) => t.name === 'loyalteez_get_leaderboard')).toBe(true);
  });

  it('should register user tools', () => {
    const tools = registerUserTools(apiClient);
    expect(tools.length).toBeGreaterThan(0);
    expect(tools.some((t) => t.name === 'loyalteez_get_user_balance')).toBe(true);
  });

  it('should register transaction tools', () => {
    const tools = registerTransactionTools(apiClient);
    expect(tools.length).toBeGreaterThan(0);
    expect(tools.some((t) => t.name === 'loyalteez_relay_transaction')).toBe(true);
  });

  it('should register drop tools', () => {
    const tools = registerDropTools(apiClient);
    expect(tools.length).toBeGreaterThan(0);
    expect(tools.some((t) => t.name === 'loyalteez_create_drop')).toBe(true);
  });

  it('should register integration tools', () => {
    const tools = registerIntegrationTools(apiClient);
    expect(tools.length).toBeGreaterThan(0);
    expect(tools.some((t) => t.name === 'loyalteez_process_third_party_event')).toBe(true);
  });

  it('should register perks tools', () => {
    const tools = registerPerksTools(apiClient);
    expect(tools.length).toBeGreaterThan(0);
    expect(tools.some((t) => t.name === 'loyalteez_list_perks')).toBe(true);
  });

  it('should register achievement tools', () => {
    const tools = registerAchievementTools(apiClient);
    expect(tools.length).toBeGreaterThan(0);
    expect(tools.some((t) => t.name === 'loyalteez_get_user_achievements')).toBe(true);
  });

  it('should register program design tools', () => {
    const tools = registerProgramDesignTool(apiClient);
    expect(tools.length).toBeGreaterThan(0);
    expect(tools.some((t) => t.name === 'loyalteez_design_program')).toBe(true);
  });
});

describe('Tool Schemas', () => {
  const apiClient = new LoyalteezAPIClient('mainnet');

  it('should have valid input schemas for all tools', () => {
    const allTools = [
      ...registerEventTools(apiClient),
      ...registerIdentityTool(apiClient),
      ...registerEngagementTools(apiClient),
      ...registerUserTools(apiClient),
      ...registerTransactionTools(apiClient),
      ...registerDropTools(apiClient),
      ...registerIntegrationTools(apiClient),
      ...registerPerksTools(apiClient),
      ...registerAchievementTools(apiClient),
      ...registerProgramDesignTool(apiClient),
    ];

    for (const tool of allTools) {
      expect(tool.name).toBeDefined();
      expect(tool.description).toBeDefined();
      expect(tool.inputSchema).toBeDefined();
      expect(tool.inputSchema.type).toBe('object');
      expect(tool.inputSchema.properties).toBeDefined();
    }
  });

  it('should have brandId as optional in tool schemas', () => {
    const eventTools = registerEventTools(apiClient);
    const createEventTool = eventTools.find((t) => t.name === 'loyalteez_create_event');
    
    if (createEventTool && createEventTool.inputSchema.properties) {
      const brandIdProp = createEventTool.inputSchema.properties.brandId;
      expect(brandIdProp).toBeDefined();
      expect(brandIdProp.description).toContain('If not provided, uses LOYALTEEZ_BRAND_ID');
      
      // Check that brandId is not in required array
      const required = createEventTool.inputSchema.required || [];
      expect(required.includes('brandId')).toBe(false);
    }
  });
});
