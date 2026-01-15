/**
 * TypeScript type definitions for Loyalteez MCP Server
 */

export interface BrandId {
  brandId: string;
}

export interface UserIdentifier {
  email?: string;
  platform?: string;
  platformUserId?: string;
}

export interface EventDefinition {
  name: string;
  eventType?: string;
  description: string;
  category?: string;
  defaultReward: number;
  maxClaimsPerUser: number;
  cooldownHours?: number;
  requiresEmail?: boolean;
  detectionMethods?: DetectionMethod[];
  metadata?: Record<string, unknown>;
}

export interface DetectionMethod {
  method: 'webhook' | 'discord_interaction' | 'url_pattern' | 'form_submission' | 'css_selector';
  config: Record<string, unknown>;
}

export interface EventConfig {
  name: string;
  description: string;
  category: string;
  defaultReward: number;
  maxClaimsPerUser: number;
  cooldownHours: number;
  requiresEmail: boolean;
  detectionMethods?: DetectionMethod[];
  metadata?: Record<string, unknown>;
}

export interface ProgramContext {
  appType: 'discord_community' | 'telegram_group' | 'ecommerce' | 'gaming' | 'saas' | string;
  goals: string[];
  platforms: string[];
  budget?: {
    monthly_ltz: number;
    avg_reward: number;
  };
  audience?: string;
  existingEvents?: string[];
}

export interface ProgramDesign {
  name: string;
  philosophy: string;
  events: EventDefinition[];
  tiers?: TierConfig[];
  streakConfig?: StreakConfig;
  estimatedBudget?: {
    monthly_ltz: number;
    avg_reward: number;
  };
}

export interface TierConfig {
  name: string;
  minPoints: number;
  benefits: string[];
}

export interface StreakConfig {
  baseReward: number;
  multipliers: {
    days: number;
    multiplier: number;
  }[];
  gracePeriod: number;
}

export interface ImplementationCode {
  discord?: string;
  telegram?: string;
  web?: string;
  webhooks?: string;
}

export interface TrackEventResult {
  success: boolean;
  reward: number;
  newBalance: number;
  eventId: string;
  cooldownRemaining?: number;
}

export interface ResolveUserResult {
  loyalteezEmail: string;
  walletAddress: string;
  isNew: boolean;
  balance: number;
}

export interface StreakResult {
  success: boolean;
  streak: {
    current: number;
    longest: number;
    multiplier: number;
    graceUsed: boolean;
  };
  reward: {
    base: number;
    final: number;
    milestone?: number;
  };
  nextMilestone?: {
    days: number;
    bonus: number;
  };
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  value: number;
  change: number;
}

export interface LeaderboardResult {
  rankings: LeaderboardEntry[];
  userRank?: LeaderboardEntry;
}

export interface DocResource {
  uri: string;
  name: string;
  description?: string;
  mimeType: string;
}

export interface NetworkConfig {
  mainnet: {
    eventHandler: string;
    services: string;
    pregen: string;
  };
  testnet: {
    eventHandler: string;
    services: string;
    pregen: string;
  };
}
