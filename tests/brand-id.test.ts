/**
 * Tests for brandId resolution utility
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getBrandId } from '../src/utils/brand-id.js';

describe('getBrandId', () => {
  const originalEnv = process.env.LOYALTEEZ_BRAND_ID;

  beforeEach(() => {
    delete process.env.LOYALTEEZ_BRAND_ID;
  });

  afterEach(() => {
    if (originalEnv) {
      process.env.LOYALTEEZ_BRAND_ID = originalEnv;
    } else {
      delete process.env.LOYALTEEZ_BRAND_ID;
    }
  });

  it('should use provided brandId when valid', () => {
    const brandId = '0x1234567890123456789012345678901234567890';
    expect(getBrandId(brandId)).toBe(brandId.toLowerCase());
  });

  it('should use environment variable when brandId not provided', () => {
    const envBrandId = '0x1234567890123456789012345678901234567890';
    process.env.LOYALTEEZ_BRAND_ID = envBrandId;
    expect(getBrandId()).toBe(envBrandId.toLowerCase());
  });

  it('should prefer provided brandId over environment variable', () => {
    const providedBrandId = '0x1234567890123456789012345678901234567890';
    const envBrandId = '0x0000000000000000000000000000000000000000';
    process.env.LOYALTEEZ_BRAND_ID = envBrandId;
    expect(getBrandId(providedBrandId)).toBe(providedBrandId.toLowerCase());
  });

  it('should throw error for invalid brandId format', () => {
    expect(() => getBrandId('invalid')).toThrow('Invalid brandId provided');
  });

  it('should throw error when neither provided nor in environment', () => {
    expect(() => getBrandId()).toThrow('BrandId is required');
  });

  it('should throw error for invalid environment variable', () => {
    process.env.LOYALTEEZ_BRAND_ID = 'invalid';
    expect(() => getBrandId()).toThrow('Invalid LOYALTEEZ_BRAND_ID');
  });

  it('should normalize brandId to lowercase', () => {
    const brandId = '0xABCDEF1234567890ABCDEF1234567890ABCDEF12';
    expect(getBrandId(brandId)).toBe(brandId.toLowerCase());
  });

  it('should validate brandId length', () => {
    expect(() => getBrandId('0x123')).toThrow('Invalid brandId provided');
    expect(() => getBrandId('0x' + '1'.repeat(41))).toThrow('Invalid brandId provided');
  });
});
