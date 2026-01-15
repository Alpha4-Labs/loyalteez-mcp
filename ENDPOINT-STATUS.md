# Endpoint Status Documentation

This document tracks the status of API endpoints used by the Loyalteez MCP server, including verification status and implementation notes.

## Endpoint Status Legend

- ✅ **Verified** - Endpoint exists and is confirmed working
- ⚠️ **Needs Verification** - Endpoint may exist but needs backend confirmation
- 🔄 **Placeholder** - Implementation exists but endpoint may need adjustment
- ❌ **Not Available** - Endpoint does not exist

## Event Handler Endpoints

### Core Event Tracking

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/loyalteez-api/manual-event` | POST | ✅ Verified | Primary event tracking endpoint |
| `/loyalteez-api/bulk-events` | POST | ✅ Verified | Batch event tracking |
| `/loyalteez-api/health` | GET | ✅ Verified | Health check endpoint |
| `/loyalteez-api/debug` | GET | ✅ Verified | Debug information |

### Event Configuration

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/loyalteez-api/event-config` | GET | ✅ Verified | Get all configured events |

### User Management

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/loyalteez-api/user-balance` | POST | ⚠️ Needs Verification | May require new endpoint or blockchain query |
| `/loyalteez-api/check-eligibility` | POST | ⚠️ Needs Verification | May need to aggregate from event config + user history |

**Implementation Notes:**
- `getUserBalance`: Currently attempts POST to `/loyalteez-api/user-balance`. May need to query blockchain directly or use a different endpoint.
- `checkEligibility`: Currently attempts POST to `/loyalteez-api/check-eligibility`. May need to aggregate data from event configuration and user claim history.

### Stripe Integration

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/loyalteez-api/stripe-mint` | POST | ✅ Verified | Called automatically by Stripe webhooks |

## Shared Services Endpoints

### Streak Service

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/streak/record-activity` | POST | ✅ Verified | Record daily check-in |
| `/streak/claim-milestone` | POST | ✅ Verified | Claim milestone bonus |
| `/streak/status/:brandId/:userIdentifier` | GET | ✅ Verified | Get streak status |

### Leaderboard Service

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/leaderboard/:brandId` | GET | ✅ Verified | Get ranked leaderboard |
| `/leaderboard/update-stats` | POST | ✅ Verified | Update user stats |

### User Stats Aggregation

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/user-stats/:brandId/:userIdentifier` | GET | ⚠️ Needs Verification | Aggregates from multiple services - may need adjustment |

**Implementation Notes:**
- `getUserStats`: Currently attempts GET to `/user-stats/:brandId/:userIdentifier`. This aggregates data from streaks, leaderboards, and achievements. May need to be implemented as a composite endpoint or multiple calls.

## Pregeneration Service

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/loyalteez-api/pregenerate-user` | POST | ✅ Verified | Pregenerate wallet for OAuth user |

## Gas Relayer Endpoints

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/relay` | POST | ✅ Verified | Execute gasless transactions |

## Perks Service

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/perks/:brandId` | GET | ✅ Verified | Get available perks |
| `/perks/redeem` | POST | ✅ Verified | Redeem a perk |
| `/perks/check-eligibility` | POST | ✅ Verified | Check perk eligibility |

## Achievements Service

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/achievements/:brandId/:userIdentifier` | GET | ✅ Verified | Get user achievements |
| `/achievements/update-progress` | POST | ✅ Verified | Update achievement progress |

## Drops Service

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/drops/create` | POST | ✅ Verified | Create time-limited drop |
| `/drops/claim` | POST | ✅ Verified | Claim a drop |

## Verification Process

When an endpoint is marked as "Needs Verification":

1. **Check API Documentation**: Verify endpoint exists in `public-docs/developer-docs/docs/api/rest-api.md`
2. **Test Endpoint**: Make a test request to verify endpoint responds correctly
3. **Update Status**: Change status to ✅ Verified or update implementation
4. **Update Implementation**: Adjust `api-client.ts` if endpoint URL or method differs

## Next Steps

- [ ] Verify `getUserBalance` endpoint with backend team
- [ ] Verify `checkEligibility` endpoint with backend team
- [ ] Verify `getUserStats` aggregation endpoint with backend team
- [ ] Add runtime endpoint availability checks
- [ ] Add endpoint health monitoring

## Last Updated

2026-01-XX - Initial documentation created
