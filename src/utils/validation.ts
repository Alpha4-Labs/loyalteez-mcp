/**
 * Input validation using Zod schemas
 */

import { z } from 'zod';

/**
 * Ethereum address validation
 */
export const brandIdSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, 'Brand ID must be a valid Ethereum address (42 characters, starting with 0x)')
  .transform((val) => val.toLowerCase());

/**
 * Event type validation
 */
export const eventTypeSchema = z
  .string()
  .regex(/^[a-zA-Z0-9_]+$/, 'Event type must contain only alphanumeric characters and underscores')
  .max(50, 'Event type must be 50 characters or less');

/**
 * Email validation
 */
export const emailSchema = z
  .string()
  .email('Invalid email format')
  .max(254, 'Email must be 254 characters or less');

/**
 * User identifier schema
 */
export const userIdentifierSchema = z.object({
  email: emailSchema.optional(),
  platform: z.string().optional(),
  platformUserId: z.string().optional(),
}).refine(
  (data) => data.email || (data.platform && data.platformUserId),
  'Either email or platform+platformUserId must be provided'
);

/**
 * Event definition schema
 */
export const eventDefinitionSchema = z.object({
  name: z.string().min(3, 'Event name must be at least 3 characters'),
  eventType: eventTypeSchema.optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().optional(),
  defaultReward: z.number().int().positive('Reward must be a positive integer'),
  maxClaimsPerUser: z.number().int().positive('Max claims must be a positive integer'),
  cooldownHours: z.number().int().nonnegative('Cooldown must be a non-negative integer').optional(),
  requiresEmail: z.boolean().optional().default(true),
  detectionMethods: z.array(z.object({
    method: z.enum(['webhook', 'discord_interaction', 'url_pattern', 'form_submission', 'css_selector']),
    config: z.record(z.unknown()),
  })).optional(),
  metadata: z.record(z.unknown()).optional(),
});

/**
 * Program context schema
 */
export const programContextSchema = z.object({
  appType: z.string(),
  goals: z.array(z.string()).min(1, 'At least one goal must be specified'),
  platforms: z.array(z.string()).min(1, 'At least one platform must be specified'),
  budget: z.object({
    monthly_ltz: z.number().int().positive(),
    avg_reward: z.number().int().positive(),
  }).optional(),
  audience: z.string().optional(),
  existingEvents: z.array(z.string()).optional(),
});

/**
 * Platform validation
 */
export const platformSchema = z.enum([
  'discord',
  'telegram',
  'twitter',
  'farcaster',
  'github',
  'google',
  'email',
  'web',
  'shopify',
  'gaming',
]);

/**
 * Metric validation for leaderboards
 */
export const metricSchema = z.enum([
  'ltz_earned',
  'streak',
  'events_completed',
  'referrals',
]).or(z.string());

/**
 * Period validation for leaderboards
 */
export const periodSchema = z.enum([
  'daily',
  'weekly',
  'monthly',
  'all_time',
]);

/**
 * Validate brand ID
 */
export function validateBrandId(brandId: unknown): string {
  return brandIdSchema.parse(brandId);
}

/**
 * Validate event type
 */
export function validateEventType(eventType: unknown): string {
  return eventTypeSchema.parse(eventType);
}

/**
 * Validate email
 */
export function validateEmail(email: unknown): string {
  return emailSchema.parse(email);
}

/**
 * Validate user identifier
 */
export function validateUserIdentifier(identifier: unknown): {
  email?: string;
  platform?: string;
  platformUserId?: string;
} {
  return userIdentifierSchema.parse(identifier);
}

/**
 * Validate event definition
 */
export function validateEventDefinition(definition: unknown) {
  return eventDefinitionSchema.parse(definition);
}

/**
 * Validate program context
 */
export function validateProgramContext(context: unknown) {
  return programContextSchema.parse(context);
}
