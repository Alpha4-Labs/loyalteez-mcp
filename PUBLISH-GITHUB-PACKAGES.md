# Publishing to GitHub Packages

> **Note**: This package is currently published to **npm** (primary registry). This guide is for reference if you want to also publish to GitHub Packages in the future.

## Quick Setup

### Step 1: Create GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name: `GitHub Packages - Loyalteez MCP`
4. Expiration: Choose your preference (90 days, 1 year, or no expiration)
5. Select scopes:
   - ✅ `write:packages`
   - ✅ `read:packages`
   - ✅ `delete:packages` (optional, for cleanup)
6. Click "Generate token"
7. **Copy the token immediately** (you won't see it again!)

### Step 2: Configure npm

Create `.npmrc` file in the project root:

```bash
@loyalteez:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_TOKEN_HERE
```

**Important**: Add `.npmrc` to `.gitignore` (already done) to avoid committing your token!

### Step 3: Publish to GitHub Packages

```bash
npm publish
```

This will publish to GitHub Packages using the `publishConfig` in `package.json`.

## Publishing to Both Registries

If you want the package available on **both** npm and GitHub Packages:

### Option A: Publish to npm first, then GitHub Packages

1. **Remove publishConfig temporarily** from package.json
2. Publish to npm: `npm publish --access public`
3. **Add publishConfig back** to package.json
4. Configure `.npmrc` for GitHub Packages
5. Publish to GitHub: `npm publish`

### Option B: Use different package names

- npm: `@loyalteez/mcp-server`
- GitHub: `@Alpha4-Labs/loyalteez-mcp-server` (different scope)

## User Installation from GitHub Packages

Users would need to configure their `.npmrc`:

```
@loyalteez:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=USER_GITHUB_TOKEN
```

Then install:
```bash
npm install @loyalteez/mcp-server
```

## Recommendation

**For public packages, npm is better** because:
- ✅ No authentication needed for users
- ✅ Works with `npx` out of the box
- ✅ Better discoverability
- ✅ Standard registry

**GitHub Packages is better for:**
- Private packages
- Internal organization packages
- When you want everything in GitHub ecosystem

## Current Setup

Your `package.json` now has `publishConfig` pointing to GitHub Packages. To publish:

1. Create GitHub token
2. Create `.npmrc` with token
3. Run `npm publish`

The package will appear in the "Packages" section on GitHub!
