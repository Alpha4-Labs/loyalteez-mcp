# Maintenance Guide

This document provides maintenance procedures, checklists, and protocols for the Loyalteez MCP server.

## Testing Checklist

Before committing changes:

- [ ] Run `npm run typecheck` - No TypeScript errors
- [ ] Run `npm test` - All tests pass
- [ ] Run `npm run test:coverage` - Coverage meets target (90%+)
- [ ] Run `npm run verify-docs` - Documentation sync verified
- [ ] Run `npm run build` - Build succeeds without errors
- [ ] Test new tools manually (if applicable)
- [ ] Update tests for new features
- [ ] Update documentation if needed

## Update Procedures

### Adding a New Tool

1. **Create tool file** in `src/tools/`
2. **Register tool** in `src/server.ts`
3. **Add handler** in `src/server.ts` switch statement
4. **Add tests** in `tests/`
5. **Update README.md** with new tool
6. **Update tool count** in documentation
7. **Verify scope** - Check `SCOPE.md` to ensure tool fits scope
8. **Add to API client** if new endpoint needed

### Adding a New Resource

1. **Create resource file** in `src/resources/`
2. **Register resource** in `src/server.ts`
3. **Add handler** in `src/server.ts` ReadResourceRequestSchema handler
4. **Add tests** in `tests/`
5. **Update README.md** with new resource
6. **Update resource count** in documentation

### Updating API Client

1. **Update endpoint** in `src/utils/api-client.ts`
2. **Update ENDPOINT-STATUS.md** if endpoint status changes
3. **Update tool handlers** if response format changes
4. **Update tests** to match new API
5. **Test with actual API** if possible

### Updating Documentation

1. **Update source docs** in `public-docs/developer-docs/docs/`
2. **Run `npm run verify-docs`** to verify sync
3. **Update resource content** if needed
4. **Test resource loading** manually

## Breaking Change Protocol

### What Constitutes a Breaking Change

- Removing a tool
- Changing tool input/output schema
- Removing a resource
- Changing resource URI format
- Changing API client method signatures
- Removing API client methods

### Process for Breaking Changes

1. **Create issue** documenting the breaking change
2. **Deprecate first** - Mark as deprecated in current version
3. **Add migration guide** - Document how to migrate
4. **Update version** - Bump major version
5. **Update CHANGELOG.md** - Document breaking changes
6. **Announce** - Notify users of breaking changes
7. **Remove deprecated** - In next major version

### Versioning Strategy

- **Major** (1.0.0 → 2.0.0): Breaking changes
- **Minor** (1.0.0 → 1.1.0): New features, backwards compatible
- **Patch** (1.0.0 → 1.0.1): Bug fixes, backwards compatible

## Dependency Updates

### Automated Updates

- Dependabot is configured for automated dependency updates
- Review and merge PRs for patch/minor updates
- Test major updates thoroughly before merging

### Manual Updates

1. **Check for updates**: `npm outdated`
2. **Update package.json**: Change version numbers
3. **Run `npm install`**: Install new versions
4. **Run tests**: Ensure nothing breaks
5. **Check changelogs**: Review dependency changelogs
6. **Update if needed**: Adjust code for breaking changes

### Security Updates

- **Priority**: High - Update immediately
- **Process**: 
  1. Review security advisory
  2. Update dependency
  3. Run full test suite
  4. Deploy if tests pass

## Code Review Checklist

When reviewing PRs:

- [ ] Code follows TypeScript best practices
- [ ] Tests are included for new features
- [ ] Tests pass
- [ ] Documentation is updated
- [ ] Scope is respected (see `SCOPE.md`)
- [ ] Error handling is appropriate
- [ ] No hardcoded values (use environment variables)
- [ ] API client methods have proper error handling
- [ ] Tool descriptions are clear and helpful
- [ ] Resource content is accurate

## Performance Monitoring

### Metrics to Track

- Server startup time
- Resource load time
- Cache hit rate
- API response times
- Memory usage

### Optimization Opportunities

- Lazy loading (already implemented)
- Caching (already implemented)
- Resource preloading (if needed)
- API request batching (if applicable)

## Troubleshooting

### Common Issues

#### Build Fails

- Check TypeScript errors: `npm run typecheck`
- Verify all imports are correct
- Check for missing dependencies

#### Tests Fail

- Run tests individually: `npm test -- <test-file>`
- Check test environment setup
- Verify mock data is correct

#### Documentation Sync Fails

- Run `npm run verify-docs` to see specific issues
- Check if source docs exist
- Verify URI mappings are correct

#### API Client Errors

- Check `ENDPOINT-STATUS.md` for endpoint status
- Verify network configuration
- Test endpoint manually with curl/Postman

### Getting Help

- Check existing issues on GitHub
- Review documentation
- Check `SCOPE.md` for scope questions
- Review `MCP-SWOT-ANALYSIS.md` for context

## Release Process

1. **Update version** in `package.json`
2. **Update CHANGELOG.md** with changes
3. **Run full test suite**: `npm test`
4. **Build**: `npm run build`
5. **Verify docs**: `npm run verify-docs`
6. **Create git tag**: `git tag v1.0.0`
7. **Push tag**: `git push --tags`
8. **Publish to npm**: `npm publish`
9. **Create GitHub release** with changelog

## Regular Maintenance Tasks

### Weekly

- Review and merge Dependabot PRs
- Check for security advisories
- Review open issues

### Monthly

- Review test coverage
- Update dependencies if needed
- Review and update documentation
- Check endpoint status

### Quarterly

- Review SWOT analysis
- Update metrics dashboard
- Review scope definition
- Performance optimization review

## Last Updated

2026-01-XX - Initial maintenance guide created
