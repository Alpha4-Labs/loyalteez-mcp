# Loyalteez MCP Server - Usage Examples

This document provides examples of how to use the Loyalteez MCP server with AI assistants like Claude.

## Example 1: Design a Discord Loyalty Program

**User Prompt:**
```
Design a loyalty program for my developer Discord with 10 events focused on quality contributions
```

**AI Response (using MCP tools):**
```json
{
  "program": {
    "name": "Developer Loyalty Program",
    "philosophy": "Rewarding quality contributions and helpful behavior. Encouraging daily engagement and participation.",
    "events": [
      {
        "name": "Daily Check-in",
        "description": "Daily check-in reward",
        "category": "engagement",
        "defaultReward": 10,
        "maxClaimsPerUser": 1,
        "cooldownHours": 24
      },
      {
        "name": "Helpful Answer",
        "description": "Recognized for helping another member",
        "category": "quality",
        "defaultReward": 50,
        "maxClaimsPerUser": 100,
        "cooldownHours": 1
      }
      // ... more events
    ]
  },
  "implementation": {
    "discord": "// Discord bot code..."
  }
}
```

## Example 2: Create Custom Events for Telegram

**User Prompt:**
```
Create 5 events for my Telegram trading community: daily check-ins, signal reactions, and premium features
```

**AI Response:**
```json
{
  "created": [
    {
      "eventType": "telegram_daily_checkin",
      "name": "Daily Check-in",
      "reward": 10
    },
    {
      "eventType": "telegram_signal_reaction",
      "name": "Signal Reaction",
      "reward": 3
    }
    // ... more events
  ],
  "implementationCode": "// Telegram bot code..."
}
```

## Example 3: Track Events and Check Balances

**User Prompt:**
```
Track a "helpful_answer" event for Discord user 123456789
```

**AI Response:**
```json
{
  "success": true,
  "reward": 50,
  "newBalance": 1250,
  "eventId": "550e8400-e29b-41d4-a716-446655440000",
  "walletAddress": "0x1234...5678"
}
```

## Example 4: Resolve User Identity

**User Prompt:**
```
Resolve Discord user ID 123456789012345678 to their Loyalteez wallet
```

**AI Response:**
```json
{
  "loyalteezEmail": "discord_123456789012345678@loyalteez.app",
  "walletAddress": "0xabc...def",
  "isNew": false,
  "balance": 1250
}
```

## Example 5: Get Leaderboard

**User Prompt:**
```
Show me the weekly LTZ leaderboard for my brand
```

**AI Response:**
```json
{
  "rankings": [
    {
      "rank": 1,
      "userId": "discord_123@loyalteez.app",
      "username": "alice#1234",
      "value": 5000,
      "change": 500
    }
    // ... more rankings
  ]
}
```

## Example 6: Shopify Integration

**User Prompt:**
```
Set up Shopify loyalty rewards for purchases, reviews, and referrals
```

**AI Response:**
The AI would use `loyalteez_create_events_batch` to create:
- First Purchase event (200 LTZ)
- Product Review event (75 LTZ)
- Referral Purchase event (500 LTZ)

And provide webhook implementation code for Shopify.

## Example 7: Gaming Rewards System

**User Prompt:**
```
Make me a gaming rewards system with daily quests, achievements, tournament rewards, and guild contributions
```

**AI Response:**
The AI would design a complete program with:
- Daily quest events
- Achievement unlock events
- Tournament entry/win events
- Guild contribution events

Plus implementation code for game server integration.

## Accessing Documentation

You can also ask the AI to reference specific documentation:

**User Prompt:**
```
Show me the Discord integration documentation
```

The AI can access `loyalteez://docs/integrations/discord` as a resource.

## Best Practices

1. **Be specific about your goals**: Include app type, platforms, and objectives
2. **Provide context**: Mention your audience, budget constraints, existing events
3. **Iterate**: Start with a basic program and refine based on results
4. **Use documentation**: Ask the AI to reference specific docs for detailed implementation
