# GitHub Token Guide for GitHub Packages

## Important: Use Classic Token, Not Fine-Grained

GitHub Packages requires a **Personal Access Token (Classic)**, not a fine-grained token. Fine-grained tokens don't fully support GitHub Packages yet.

## Step-by-Step Instructions

### Step 1: Navigate to Personal Token Settings

**Important**: You must create the token from your **personal account**, not the organization.

1. Go to: https://github.com/settings/tokens
   - This is your **personal** account settings
   - Not the organization settings

### Step 2: Generate Classic Token

1. Click **"Generate new token"** dropdown
2. Select **"Generate new token (classic)"**
   - ⚠️ **NOT** "Generate new token (fine-grained)"

### Step 3: Configure Token

1. **Note**: Give it a name like `GitHub Packages - Loyalteez MCP`
2. **Expiration**: Choose your preference
   - 90 days
   - 1 year
   - No expiration (less secure but convenient)
3. **Select scopes**: Check these boxes:
   - ✅ `write:packages` - **Required** to publish packages
   - ✅ `read:packages` - **Required** to read packages
   - ✅ `delete:packages` - Optional, for cleanup

### Step 4: Generate and Copy

1. Scroll down and click **"Generate token"**
2. **Copy the token immediately** - you won't see it again!
3. It will look like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 5: Update .npmrc

Update your `.npmrc` file with the new token:

```bash
@alpha4-labs:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_NEW_TOKEN_HERE
```

## Troubleshooting

### "I don't see write:packages scope"

- Make sure you're creating a **classic token**, not fine-grained
- Classic tokens have different scope names
- Fine-grained tokens use different permission names

### "Permission denied" when publishing

- Verify the token has `write:packages` scope
- Make sure you're using the token from your personal account
- Check that your personal account has access to the `Alpha4-Labs` organization

### Organization-Level Tokens

If you need organization-level access:

1. The token is still created from your **personal account**
2. But it can access organization resources if:
   - Your personal account is a member of the org
   - The org allows personal access tokens
   - The token has the right scopes

### Alternative: Organization Settings

If you want to manage tokens at the org level:

1. Go to: `https://github.com/organizations/Alpha4-Labs/settings/personal_access_tokens`
2. But note: Organization tokens are still created from personal accounts
3. The org can approve/deny token requests

## Quick Reference

- **Classic Token URL**: https://github.com/settings/tokens
- **Required Scopes**: `write:packages`, `read:packages`
- **Token Format**: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Organization**: Token is personal but can access org resources

## After Getting Token

1. Update `.npmrc` with the token
2. Update `package.json` name to `@alpha4-labs/mcp-server` (temporarily)
3. Run `npm publish`
4. Package will appear in GitHub Packages!
