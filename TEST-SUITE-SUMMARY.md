# MCP Server Test Suite Summary

## Overview

The Loyalteez MCP Server now includes a comprehensive test suite using Vitest to validate all patterns, tools, and functionality.

## Test Coverage

### ✅ BrandId Resolution (`brand-id.test.ts`)
- Environment variable fallback
- Parameter override
- Error handling for missing/invalid brandId
- Normalization to lowercase
- Length validation

### ✅ Input Validation (`validation.test.ts`)
- BrandId format validation
- Event type validation (alphanumeric + underscore)
- Email validation
- User identifier validation (email or platform+userId)
- Event definition validation
- Program context validation

### ✅ Resource Loading (`resources.test.ts`)
- Contract resources (LTZ Token, PerkNFT, PointsSale)
- Network configuration (Soneium)
- Event types reference
- Shared services API reference
- OAuth provider mappings

### ✅ Tool Registration (`tools.test.ts`)
- All 24+ tools are registered
- Tool schemas are valid JSON Schema
- BrandId is optional in all tool schemas
- Tool descriptions include documentation links

### ✅ API Client (`api-client.test.ts`)
- All API methods exist and are callable
- Network configuration (mainnet/testnet)
- Error handling for HTTP errors
- Error handling for network errors

### ✅ Server Integration (`integration.test.ts`)
- Server initialization
- Default brandId support
- Network configuration
- Tool pattern validation

## Running Tests

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage
```

## Test Patterns Validated

1. **BrandId Resolution Pattern**
   - ✅ Parameter takes precedence over environment variable
   - ✅ Environment variable used when parameter not provided
   - ✅ Helpful error messages when neither available

2. **User Identifier Pattern**
   - ✅ Email format: `user@example.com`
   - ✅ Platform format: `{platform}_{userId}@loyalteez.app`
   - ✅ Either format accepted

3. **Event Type Pattern**
   - ✅ Alphanumeric + underscore only
   - ✅ Max 50 characters
   - ✅ No spaces or special characters

4. **Resource URI Pattern**
   - ✅ Documentation: `loyalteez://docs/{path}`
   - ✅ Contracts: `loyalteez://contracts/{type}`
   - ✅ Network: `loyalteez://network/config`
   - ✅ Events: `loyalteez://events/standard`
   - ✅ Services: `loyalteez://shared-services/endpoints`
   - ✅ OAuth: `loyalteez://platforms/mappings`

## Test Results

All tests should pass when run. The suite validates:
- ✅ All tools are properly registered
- ✅ All resources can be loaded
- ✅ All validation logic works correctly
- ✅ BrandId resolution works as expected
- ✅ API client methods are available
- ✅ Error handling is robust

## Continuous Integration

Tests should be run:
- Before committing code
- In CI/CD pipeline
- Before releases
- When adding new features

## Adding New Tests

When adding new tools or features:

1. Add unit tests for validation logic in `validation.test.ts`
2. Add tool registration tests in `tools.test.ts`
3. Add API client tests in `api-client.test.ts` if new methods are added
4. Add resource tests in `resources.test.ts` if new resources are added
5. Add integration tests in `integration.test.ts` for new patterns

## Test Framework

- **Framework**: Vitest 2.0
- **Coverage**: v8 provider
- **Environment**: Node.js
- **TypeScript**: Full type checking enabled
