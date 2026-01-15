/**
 * BrandId resolution utility
 * Handles brandId from parameters or environment variables
 */

import { brandIdSchema } from './validation.js';

/**
 * Get brandId from input parameter or environment variable
 * @param input - Optional brandId from tool parameter
 * @returns Validated brandId
 * @throws Error if neither input nor environment variable is available
 */
export function getBrandId(input?: string): string {
  // First, try the provided input
  if (input) {
    try {
      return brandIdSchema.parse(input);
    } catch (error) {
      throw new Error(
        `Invalid brandId provided: ${input}. BrandId must be a valid Ethereum address (42 characters, starting with 0x). ` +
        `If not providing brandId, ensure LOYALTEEZ_BRAND_ID environment variable is set.`
      );
    }
  }

  // Fall back to environment variable
  const envBrandId = process.env.LOYALTEEZ_BRAND_ID;
  if (envBrandId) {
    try {
      return brandIdSchema.parse(envBrandId);
    } catch (error) {
      throw new Error(
        `Invalid LOYALTEEZ_BRAND_ID environment variable: ${envBrandId}. ` +
        `BrandId must be a valid Ethereum address (42 characters, starting with 0x).`
      );
    }
  }

  // Neither available
  throw new Error(
    'BrandId is required but not provided. Either:\n' +
    '  1. Provide brandId as a tool parameter, or\n' +
    '  2. Set LOYALTEEZ_BRAND_ID environment variable\n\n' +
    'Example: export LOYALTEEZ_BRAND_ID=0x47511fc1c6664c9598974cb112965f8b198e0c725e'
  );
}
