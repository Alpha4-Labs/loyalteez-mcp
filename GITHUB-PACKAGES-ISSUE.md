# GitHub Packages Publishing Issue

## Problem

The GitHub token doesn't have the required scopes for publishing packages.

## Error Message

```
npm error 403 Permission permission_denied: The token provided does not match expected scopes.
```

## Solution

You need to regenerate your GitHub Personal Access Token with the correct scopes:

### Required Scopes

According to the [GitHub Packages documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry), you need:

- ✅ `write:packages` - Required to publish packages
- ✅ `read:packages` - Required to read packages
- ✅ `delete:packages` - Optional, for cleanup

### Steps to Fix

1. **Go to GitHub Token Settings**:
   - https://github.com/settings/tokens

2. **Generate New Token (Classic)**:
   - Click "Generate new token (classic)"
   - Name: `GitHub Packages - Loyalteez MCP`
   - Expiration: Your choice (90 days, 1 year, or no expiration)

3. **Select Required Scopes**:
   - ✅ `write:packages`
   - ✅ `read:packages`
   - ✅ `delete:packages` (optional)

4. **Generate and Copy Token**:
   - Click "Generate token"
   - **Copy the token immediately** (you won't see it again!)

5. **Update `.npmrc`**:
   ```bash
   @alpha4-labs:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=YOUR_NEW_TOKEN_HERE
   ```

6. **Publish**:
   ```bash
   npm publish
   ```

## Package Name Consideration

**Current Situation:**
- npm: `@loyalteez/mcp-server@1.0.0` ✅ (already published)
- GitHub Packages: Need to decide on scope

**Options:**

### Option A: Publish as `@alpha4-labs/mcp-server` (Recommended)
- Matches your GitHub organization
- Different package name from npm (but that's okay)
- Update `package.json` name to `@alpha4-labs/mcp-server` for GitHub Packages publish
- Users can install from either registry

### Option B: Create `loyalteez` Organization
- Create a GitHub organization named `loyalteez`
- Keep package name as `@loyalteez/mcp-server`
- Publish to GitHub Packages under `loyalteez` org

## Recommendation

**Option A is simpler** - publish as `@alpha4-labs/mcp-server` to GitHub Packages. This way:
- npm package stays as `@loyalteez/mcp-server` (already published)
- GitHub Packages has `@alpha4-labs/mcp-server` (matches your org)
- Both are available, users choose which to use

## After Fixing Token

Once you have a token with correct scopes:

1. Update `.npmrc` with new token
2. Update `package.json` name to `@alpha4-labs/mcp-server` (temporarily)
3. Run `npm publish`
4. Package will appear in GitHub Packages section!
