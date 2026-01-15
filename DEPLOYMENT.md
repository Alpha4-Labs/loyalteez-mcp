# Deployment Guide for Loyalteez MCP Server

## Overview

MCP servers are **local applications** that run on the user's machine. Unlike web services, they don't need to be deployed to a server. Users install and run them locally, and AI assistants (Claude Desktop, Cursor, etc.) connect to them via stdio.

## Deployment Options

### Option 1: Public GitHub Repository (Recommended)

**What it is**: Make the repository public so users can clone and install it.

**Pros**:
- ✅ Free
- ✅ Easy for users to find and install
- ✅ Version control and issue tracking
- ✅ Community contributions possible

**Steps**:
1. Go to https://github.com/Alpha4-Labs/loyalteez-mcp/settings
2. Scroll to "Danger Zone"
3. Click "Change visibility" → "Make public"
4. Update README with installation instructions

**User Installation**:
```bash
git clone https://github.com/Alpha4-Labs/loyalteez-mcp.git
cd loyalteez-mcp
npm install
npm run build
```

### Option 2: Publish to npm (Optional but Recommended)

**What it is**: Publish the package to npm so users can install it with `npm install -g @loyalteez/mcp-server`.

**Pros**:
- ✅ Easier installation for users
- ✅ Version management via npm
- ✅ Can be installed globally or locally
- ✅ Professional distribution method

**Steps**:
1. Ensure `package.json` has correct name and version
2. Create npm account (if needed): https://www.npmjs.com/signup
3. Login: `npm login`
4. Publish: `npm publish --access public`

**User Installation**:
```bash
npm install -g @loyalteez/mcp-server
# Or locally:
npm install @loyalteez/mcp-server
```

**Configuration** (after npm install):
```json
{
  "mcpServers": {
    "loyalteez": {
      "command": "npx",
      "args": ["@loyalteez/mcp-server"],
      "env": {
        "LOYALTEEZ_NETWORK": "mainnet",
        "LOYALTEEZ_BRAND_ID": "your-brand-id"
      }
    }
  }
}
```

### Option 3: GitHub Releases (For Binary Distribution)

**What it is**: Create GitHub releases with pre-built binaries (optional, mainly for compiled languages).

**When to use**: If you want to provide pre-built executables (not needed for Node.js/TypeScript).

## Recommended Approach

✅ **Repository is public**: https://github.com/Alpha4-Labs/loyalteez-mcp
✅ **Published to npm**: [@loyalteez/mcp-server](https://www.npmjs.com/package/@loyalteez/mcp-server)

Users can now install via npm for easier setup!

## Making the Repository Public

1. **Go to repository settings**:
   - Navigate to: https://github.com/Alpha4-Labs/loyalteez-mcp/settings

2. **Change visibility**:
   - Scroll to "Danger Zone"
   - Click "Change visibility"
   - Select "Make public"
   - Confirm by typing the repository name

3. **Update README** (if needed):
   - Add installation instructions
   - Add link to public repo
   - Add badges (optional)

## Post-Deployment Checklist

- [ ] Repository is public
- [ ] README has clear installation instructions
- [ ] All tests pass (`npm test`)
- [ ] Build works (`npm run build`)
- [ ] Documentation is complete
- [ ] License is set (MIT)
- [ ] Consider adding:
  - [ ] GitHub Actions for CI/CD
  - [ ] Issue templates
  - [ ] Contributing guidelines
  - [ ] Code of conduct

## npm Publishing (Optional)

If you want to publish to npm later:

1. **Prepare package.json**:
   ```json
   {
     "name": "@loyalteez/mcp-server",
     "version": "1.0.0",
     "description": "...",
     "main": "dist/index.js",
     "bin": {
       "loyalteez-mcp": "./dist/index.js"
     },
     "files": ["dist", "README.md"],
     "keywords": ["mcp", "loyalty", "loyalteez"],
     "license": "MIT"
   }
   ```

2. **Test locally**:
   ```bash
   npm pack
   # Creates a tarball you can test
   ```

3. **Publish**:
   ```bash
   npm publish --access public
   ```

4. **Update installation docs** to include npm option

## Continuous Integration (Optional)

Consider adding GitHub Actions for:
- Automated testing on PRs
- Automated releases
- Build verification

Example `.github/workflows/ci.yml`:
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npm run build
```

## Summary

**For MCP servers, deployment = distribution, not hosting**

- ✅ Make repo public (free, easy)
- ✅ Optional: Publish to npm (better UX)
- ❌ No server deployment needed
- ❌ No cloud hosting required

Users install locally → Run locally → AI assistants connect via stdio
