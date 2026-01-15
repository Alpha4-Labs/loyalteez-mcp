# MCP Server Test Suite

Comprehensive test suite for validating all patterns and functionality in the Loyalteez MCP Server.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Structure

### Unit Tests

- **brand-id.test.ts**: Tests for brandId resolution (env var vs parameter)
- **validation.test.ts**: Tests for all validation utilities
- **api-client.test.ts**: Tests for API client methods and error handling
- **resources.test.ts**: Tests for all MCP resource types

### Integration Tests

- **tools.test.ts**: Tests for tool registration and schema validation
- **integration.test.ts**: Tests for server initialization and tool patterns

## Test Coverage

The test suite validates:

1. **BrandId Resolution**
   - Environment variable fallback
   - Parameter override
   - Error handling for missing/invalid brandId

2. **Input Validation**
   - BrandId format validation
   - Event type validation
   - Email validation
   - User identifier validation
   - Event definition validation
   - Program context validation

3. **Resource Loading**
   - Contract resources
   - Network configuration
   - Event types reference
   - Shared services reference
   - OAuth provider mappings

4. **Tool Registration**
   - All tools are registered
   - Tool schemas are valid
   - BrandId is optional in schemas

5. **API Client**
   - All methods exist
   - Network configuration
   - Error handling

6. **Server Integration**
   - Server initialization
   - Default brandId support
   - Network configuration

## Adding New Tests

When adding new tools or features:

1. Add unit tests for validation logic
2. Add integration tests for tool patterns
3. Update API client tests if new methods are added
4. Update resource tests if new resources are added

## Continuous Integration

Tests should be run:
- Before committing code
- In CI/CD pipeline
- Before releases
