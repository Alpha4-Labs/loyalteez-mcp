# Loyalteez MCP Server - Scope Definition

This document defines the scope of the Loyalteez MCP server, clarifying what IS included and what IS NOT included.

## What IS Included

### 3rd-Party Integration APIs
- ✅ Event tracking and management
- ✅ User management and identity resolution
- ✅ Engagement features (streaks, leaderboards, activities)
- ✅ Perks and redemption
- ✅ Achievements
- ✅ Drops (time-limited rewards)
- ✅ Webhook receiving and validation
- ✅ Gasless transaction relaying
- ✅ Program design and code generation
- ✅ Third-party bot integrations (Mee6, Arcane, Tatsu, etc.)

### Developer Resources
- ✅ Complete API documentation access
- ✅ Contract addresses and ABIs
- ✅ Network configuration
- ✅ Event type definitions
- ✅ Error codes and handling
- ✅ Rate limits and strategies
- ✅ SDK examples (JavaScript, React Native, iOS, Android, Flutter)
- ✅ Webhook event types and examples

### Tools for AI Assistants
- ✅ All REST API endpoints wrapped as MCP tools
- ✅ Health checks and diagnostics
- ✅ Code generation for multiple frameworks
- ✅ Webhook validation and examples

## What IS NOT Included

### Brand Admin Features
- ❌ Creating or managing brand accounts
- ❌ Configuring event types in Partner Portal
- ❌ Managing brand settings
- ❌ Viewing brand analytics/dashboards
- ❌ Managing brand team members
- ❌ Brand wallet management (funding, withdrawals)

**Why:** These are brand-specific administrative tasks, not integration APIs. Developers integrate with Loyalteez, they don't manage brands.

### Internal Platform Management
- ❌ Managing platform users
- ❌ Platform-level configuration
- ❌ System administration
- ❌ Internal analytics

**Why:** These are internal Loyalteez platform operations, not developer-facing APIs.

### Client-Side SDK State Management
- ❌ `identify()` - Browser-only session management
- ❌ `reset()` - Browser-only session clearing
- ❌ `startAutoDetection()` - Browser-only event listener management
- ❌ `stopAutoDetection()` - Browser-only event listener management

**Why:** These methods operate in the browser environment and manage local SDK state. They're not backend API calls. The MCP server focuses on backend integration APIs that can be called from any environment.

**Note:** These methods are documented in the SDK resource (`loyalteez://sdk/javascript`) so AI can generate code that uses them, but they're not exposed as MCP tools.

## Decision Framework for New Tools

When considering adding a new tool, ask:

1. **Is it a 3rd-party integration API?**
   - ✅ Yes → Include it
   - ❌ No → Don't include it

2. **Can it be called from any environment?**
   - ✅ Yes → Include it
   - ❌ No (browser-only) → Document it, don't create a tool

3. **Is it brand-specific admin?**
   - ✅ Yes → Don't include it
   - ❌ No → Continue evaluation

4. **Is it internal platform management?**
   - ✅ Yes → Don't include it
   - ❌ No → Continue evaluation

5. **Does it help developers integrate with Loyalteez?**
   - ✅ Yes → Include it
   - ❌ No → Don't include it

## Examples

### ✅ Should Include
- `loyalteez_track_event` - 3rd-party integration API
- `loyalteez_get_user_balance` - 3rd-party integration API
- `loyalteez_validate_webhook` - Helps developers receive webhooks
- `loyalteez_health_check` - Diagnostic tool for developers

### ❌ Should NOT Include
- `loyalteez_create_brand` - Brand admin feature
- `loyalteez_configure_event` - Brand admin feature (use Partner Portal)
- `loyalteez_get_brand_analytics` - Brand admin feature
- `loyalteez_sdk_identify` - Client-side only, browser state management

## Scope Validation

When adding new tools:

1. **Check this document** - Does it fit the scope?
2. **Add scope validation comment** in tool registration
3. **Update this document** if scope boundaries change
4. **Document why** if adding something that seems out of scope

## Scope Enforcement

- **Code Review:** All new tools must be reviewed against this scope
- **Documentation:** Tool descriptions should clarify if they're integration APIs
- **Testing:** Tests should verify tools work for 3rd-party integration use cases

## Last Updated

2026-01-XX - Initial scope definition created
