# GitHub Release Guide

## Linking npm Package to GitHub

Your npm package `@loyalteez/mcp-server` is already published, but to show it in GitHub's "Packages" section, you need to create a GitHub Release.

## Option 1: Create GitHub Release (Recommended)

### Step 1: Create a Git Tag

```bash
git tag -a v1.0.0 -m "Release v1.0.0: Initial MCP server with 24+ tools"
git push origin v1.0.0
```

### Step 2: Create Release on GitHub

1. Go to: https://github.com/Alpha4-Labs/loyalteez-mcp/releases/new
2. Select tag: `v1.0.0`
3. Release title: `v1.0.0 - Initial Release`
4. Description:
   ```markdown
   ## 🎉 Initial Release

   The Loyalteez MCP Server enables AI assistants to build complete loyalty integrations through natural conversation.

   ### Features
   - 24+ tools for loyalty program management
   - Comprehensive test suite (109 tests)
   - Full documentation access via MCP resources
   - Support for Discord, Telegram, Web, and more

   ### Installation
   ```bash
   npm install -g @loyalteez/mcp-server
   ```

   ### Links
   - [npm Package](https://www.npmjs.com/package/@loyalteez/mcp-server)
   - [Documentation](https://docs.loyalteez.app/integrations/mcp)
   ```
5. Click "Publish release"

## Option 2: GitHub Packages (Alternative)

If you want to publish to GitHub Packages instead of npm:

1. Update `.npmrc`:
   ```
   @loyalteez:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=YOUR_TOKEN
   ```

2. Update `package.json`:
   ```json
   {
     "publishConfig": {
       "registry": "https://npm.pkg.github.com"
     }
   }
   ```

3. Publish:
   ```bash
   npm publish
   ```

**Note**: GitHub Packages requires authentication and is more complex. npm is recommended for public packages.

## Current Status

✅ Package published to npm: `@loyalteez/mcp-server@1.0.0`
✅ Repository field in package.json correctly set
✅ README and LICENSE included
⏳ GitHub Release not yet created

## Quick Command

To create the release tag and push:

```bash
git tag -a v1.0.0 -m "Release v1.0.0: Initial MCP server"
git push origin v1.0.0
```

Then create the release on GitHub UI.
