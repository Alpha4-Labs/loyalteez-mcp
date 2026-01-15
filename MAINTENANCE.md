# Maintenance Guide

This document outlines maintenance procedures, testing checklists, and update protocols for the Loyalteez MCP server.

## Testing Checklist

### Before Committing

- [ ] Run `npm run typecheck` - No TypeScript errors
- [ ] Run `npm test` - All tests pass
- [ ] Run `npm run verify-docs` - Documentation is in sync
- [ ] Build succeeds: `npm run build`
- [ ] No linter errors

### Before Releasing

- [ ] All tests pass (`npm test`)
- [ ] Test coverage >90% (`npm run test:coverage`)
- [ ] Documentation sync verified (`npm run verify-docs`)
- [ ] README.md updated with new features
- [ ] CHANGELOG.md updated (if maintained)
- [ ] Version bumped in `package.json`
- [ ] Build and test in clean environment
- [ ] Test with actual MCP client (Claude Desktop, Cursor)

## Update Procedures

### Adding a New Tool

1. **Create tool file**: `src/tools/{category}.ts`
2. **Register tool**: Add to `src/server.ts` tool registration
3. **Add handler**: Add case to switch statement in `src/server.ts`
4. **Add tests**: Create test file in `tests/`
5. **Update README**: Add tool to tool list
6. **Update docs**: Update `public-docs/developer-docs/docs/integrations/mcp.md`

### Adding a New Resource

1. **Create resource file**: `src/resources/{name}.ts`
2. **Register resource**: Add to `src/server.ts` resource registration
3. **Add handler**: Add case to switch statement in `src/server.ts`
4. **Add tests**: Test resource loading
5. **Update README**: Add resource to resource list

### Updating API Client

1. **Add method**: Add to `src/utils/api-client.ts`
2. **Update ENDPOINT-STATUS.md**: Document endpoint status
3. **Add tests**: Test API client method
4. **Update version**: If breaking change, update `API_VERSION`

## Breaking Change Protocol

### When Making Breaking Changes

1. **Increment API Version**: Update `API_VERSION` in `api-client.ts`
2. **Update Compatibility Matrix**: Add entry to `API_VERSION_COMPATIBILITY`
3. **Update API-VERSIONING.md**: Document the change
4. **Create Migration Guide**: Document how to migrate
5. **Deprecation Notice**: Add deprecation warnings if applicable
6. **Update Tests**: Ensure all tests pass with new version

### Version Bumping

- **Major version** (1.0.0 → 2.0.0): Breaking changes
- **Minor version** (1.0.0 → 1.1.0): New features, backward compatible
- **Patch version** (1.0.0 → 1.0.1): Bug fixes, backward compatible

## Dependency Updates

### Automated Updates

- Dependabot is configured to create PRs for dependency updates
- Review and test all dependency updates before merging

### Manual Updates

1. **Check changelogs**: Review breaking changes in dependencies
2. **Update package.json**: Update version numbers
3. **Run tests**: Ensure everything still works
4. **Update lockfile**: Run `npm install` to update `package-lock.json`

## Performance Monitoring

### Cache Statistics

Monitor documentation cache performance:

```typescript
import { getDocCacheStats } from './src/resources/docs.js';

const stats = getDocCacheStats();
console.log('Cache stats:', stats);
```

### Resource Loading

- Documentation resources are lazy-loaded (loaded on first access)
- Cache TTL: 5 minutes
- Monitor cache hit rates and load times

## Troubleshooting

### Common Issues

1. **Documentation not loading**
   - Check `public-docs/developer-docs/docs` path
   - Run `npm run verify-docs` to check sync
   - Verify file permissions

2. **Tests failing**
   - Run `npm run typecheck` first
   - Check for TypeScript errors
   - Verify test environment setup

3. **Build errors**
   - Clear `dist/` directory
   - Run `npm run build` again
   - Check `tsconfig.json` configuration

## Code Review Checklist

When reviewing PRs:

- [ ] All tests pass
- [ ] Code follows existing patterns
- [ ] TypeScript types are correct
- [ ] Error handling is appropriate
- [ ] Documentation is updated
- [ ] No breaking changes (or properly versioned)
- [ ] Scope is appropriate (see SCOPE.md)
- [ ] Performance considerations addressed

## Release Process

1. **Update version**: Bump version in `package.json`
2. **Update CHANGELOG**: Document changes
3. **Run full test suite**: `npm test`
4. **Build**: `npm run build`
5. **Tag release**: `git tag v{version}`
6. **Publish**: `npm publish`
7. **Create GitHub release**: With release notes

## Related Documentation

- [SCOPE.md](./SCOPE.md) - Scope definition
- [API-VERSIONING.md](./API-VERSIONING.md) - Versioning strategy
- [ENDPOINT-STATUS.md](./ENDPOINT-STATUS.md) - Endpoint status
- [README.md](./README.md) - Overview and usage
