# API Versioning Strategy

This document outlines the API versioning strategy for the Loyalteez MCP server.

## Version Header

All API requests include an `X-API-Version` header indicating the API version being used:

```
X-API-Version: v1
```

## Current Version

- **API Version**: `v1`
- **MCP Server Version**: `1.0.0`
- **Status**: Active

## Version Compatibility Matrix

| MCP Server Version | Min API Version | Max API Version | Status |
|-------------------|-----------------|-----------------|--------|
| 1.0.0 | v1 | v1 | Active |

## Versioning Policy

### When to Increment API Version

1. **Breaking Changes**: Any change that requires client code modification
   - Removed endpoints
   - Changed request/response formats
   - Changed authentication requirements
   - Changed error response formats

2. **Non-Breaking Changes**: Do NOT require version increment
   - New endpoints
   - New optional request parameters
   - New response fields
   - Bug fixes

### Deprecation Process

1. **Deprecation Notice**: Announce deprecation with 6+ months notice
2. **Deprecation Header**: Add `X-API-Deprecated: true` header to responses
3. **Documentation**: Update docs with migration guide
4. **Sunset Date**: Set specific date for version removal

### Version Format

- Format: `v{major}.{minor}` (e.g., `v1`, `v2`)
- Major version: Breaking changes
- Minor version: Not used (reserved for future use)

## Handling Version Mismatches

### Server Response Codes

- `200 OK`: Version accepted
- `400 Bad Request`: Invalid version format
- `426 Upgrade Required`: Version no longer supported
- `X-API-Deprecated: true`: Version deprecated but still functional

### Client Behavior

The MCP server will:
1. Always send `X-API-Version: v1` header
2. Handle `426 Upgrade Required` responses gracefully
3. Log deprecation warnings if `X-API-Deprecated` header is present
4. Provide clear error messages for version mismatches

## Migration Guide

When upgrading to a new API version:

1. **Review Changelog**: Check what changed in the new version
2. **Update Code**: Modify MCP server code to use new endpoints/formats
3. **Test Thoroughly**: Test all tools and resources
4. **Update Version**: Update `API_VERSION` constant
5. **Update Compatibility Matrix**: Add entry for new MCP server version

## Example: Version Check in Health Check

The health check tool can verify API version compatibility:

```typescript
const health = await apiClient.healthCheck();
if (health.apiVersion && health.apiVersion !== API_VERSION) {
  console.warn(`API version mismatch: expected ${API_VERSION}, got ${health.apiVersion}`);
}
```

## Future Considerations

- **Version Negotiation**: Future feature to negotiate API version with server
- **Multiple Version Support**: Ability to support multiple API versions simultaneously
- **Automatic Upgrades**: Automatic version upgrade detection and migration

## Related Documentation

- [ENDPOINT-STATUS.md](./ENDPOINT-STATUS.md) - Endpoint availability status
- [MAINTENANCE.md](./MAINTENANCE.md) - Maintenance and update procedures
