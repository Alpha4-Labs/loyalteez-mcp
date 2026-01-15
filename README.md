# Loyalteez MCP Server

Model Context Protocol (MCP) server for Loyalteez - enabling AI assistants to design loyalty programs, create events, track rewards, and access comprehensive documentation.

[![Tests](https://img.shields.io/badge/tests-passing-brightgreen)](./tests)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-1.0-purple)](https://modelcontextprotocol.io)

## Overview

The Loyalteez MCP Server provides AI tools (Claude, ChatGPT, Cursor, etc.) with direct access to Loyalteez's loyalty infrastructure. Design entire programs through natural conversation, create custom events, track rewards, and access full documentation - all via the MCP protocol.

**The First Loyalty Platform with Native AI Integration** - Enable AI assistants to build complete loyalty integrations through natural conversation.

## Features

- **Program Design**: AI-powered loyalty program generation with event structures, tiers, and implementation code
- **Event Management**: Create and track infinitely flexible custom events
- **User Identity**: Resolve platform identities to Loyalteez wallets
- **Engagement Services**: Streak tracking, leaderboards, and achievements
- **Documentation Access**: Full developer docs available as MCP resources
- **Platform Support**: Discord, Telegram, Web, Shopify, Gaming, and more

## Installation

```bash
# Clone or navigate to the repository
cd loyalteez-mcp

# Install dependencies
npm install

# Build the project
npm run build
```

The built server will be available at `dist/index.js`.

## Usage

### With Claude Desktop

Add to your Claude Desktop MCP configuration:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "loyalteez": {
      "command": "node",
      "args": ["/absolute/path/to/loyalteez-mcp/dist/index.js"],
      "env": {
        "LOYALTEEZ_NETWORK": "mainnet",
        "LOYALTEEZ_BRAND_ID": "0x47511fc1c6664c9598974cb112965f8b198e0c725e"
      }
    }
  }
}
```

### Environment Variables

- `LOYALTEEZ_NETWORK`: Network to use - `mainnet` (default) or `testnet`
- `LOYALTEEZ_BRAND_ID`: Your brand wallet address (optional, can also be provided per-tool)

## Available Tools

### Program Design

- **loyalteez_design_program**: Design a complete loyalty program from context

### Event Management

- **loyalteez_create_event**: Create a single custom event
- **loyalteez_create_events_batch**: Create multiple events at once
- **loyalteez_track_event**: Fire any event and reward users
- **loyalteez_get_event_config**: Get all configured events for a brand
- **loyalteez_bulk_events**: Submit multiple events in a single request
- **loyalteez_admin_reward**: Manually reward users (mod/admin triggered)

### User Identity & Balance

- **loyalteez_resolve_user**: Convert platform identity to Loyalteez wallet
- **loyalteez_get_user_balance**: Get user's LTZ balance and transaction history
- **loyalteez_check_eligibility**: Check if user can claim an event reward
- **loyalteez_get_user_stats**: Get comprehensive user statistics

### Engagement Services

- **loyalteez_streak_checkin**: Process streak check-in with multipliers
- **loyalteez_get_streak_status**: Get current streak status
- **loyalteez_claim_streak_milestone**: Claim milestone bonuses (7, 30, 100, 365 days)
- **loyalteez_log_activity**: Track voice time, messages, reactions with daily caps
- **loyalteez_calculate_reward**: Calculate final reward with role multipliers
- **loyalteez_get_leaderboard**: Get ranked leaderboards by metric
- **loyalteez_update_leaderboard_stats**: Update user stats after reward

### Social Features

- **loyalteez_create_drop**: Create time-limited reward drops
- **loyalteez_claim_drop**: Process drop claims from users
- **loyalteez_process_third_party_event**: Handle events from Mee6, Arcane, Tatsu, etc.

### Perks & Redemption

- **loyalteez_list_perks**: Get available perks for a brand
- **loyalteez_check_perk_eligibility**: Check if user can claim a specific perk
- **loyalteez_redeem_perk**: Redeem a perk for a user

### Achievements

- **loyalteez_get_user_achievements**: Get all achievements for a user
- **loyalteez_update_achievement_progress**: Update progress toward achievements

### Transactions

- **loyalteez_relay_transaction**: Execute gasless blockchain transactions

## Available Resources

### Documentation Resources

All developer documentation is available as MCP resources with URIs like:

- `loyalteez://docs/architecture`
- `loyalteez://docs/api/rest-api`
- `loyalteez://docs/integrations/discord`
- `loyalteez://docs/guides/custom-events`
- ... and many more

### Static Resources

- **Contracts**: `loyalteez://contracts/ltz-token`, `loyalteez://contracts/perk-nft`, `loyalteez://contracts/points-sale`, `loyalteez://contracts/all`
- **Network**: `loyalteez://network/config` - Soneium network configuration
- **Event Types**: `loyalteez://events/standard` - Standard event types reference
- **Shared Services**: `loyalteez://shared-services/endpoints` - API endpoints for gamification services
- **OAuth Providers**: `loyalteez://platforms/mappings` - OAuth provider ID formats

## Example Usage

### Design a Discord Program

```
User: "Design a loyalty program for my developer Discord with events for quality contributions"

AI: [Uses loyalteez_design_program tool]
    Returns: Complete program with events, implementation code, and best practices
```

### Create Custom Events

```
User: "Create 5 events for my Telegram trading community"

AI: [Uses loyalteez_create_events_batch tool]
    Returns: All created events + Telegram bot implementation code
```

### Track Events

```
User: "Track a helpful_answer event for Discord user 123456789"

AI: [Uses loyalteez_track_event tool]
    Returns: Success, reward amount, new balance, transaction hash
```

### Daily Check-in with Streaks

```
User: "Set up daily check-ins with streak bonuses for my Telegram bot"

AI: [Uses loyalteez_streak_checkin tool]
    Returns: Current streak, multiplier, reward amount, next milestone
```

### Check User Balance

```
User: "What's the balance for user discord_123456789?"

AI: [Uses loyalteez_get_user_balance tool]
    Returns: Current balance, wallet address, transaction history
```

### Create a Reward Drop

```
User: "Create a reaction drop for 50 LTZ, first 100 users"

AI: [Uses loyalteez_create_drop tool]
    Returns: Drop ID, claim URL, embed data for posting
```

## Architecture

```
AI Assistant (Claude/ChatGPT)
    ↓ MCP Protocol
Loyalteez MCP Server
    ↓ HTTP API
Loyalteez APIs
    - Event Handler (api.loyalteez.app)
    - Shared Services (services.loyalteez.app)
    - Pregeneration (register.loyalteez.app)
```

## Development

### Build

```bash
npm run build
```

### Type Check

```bash
npm run typecheck
```

### Testing

```bash
npm test
```

See [Testing](#testing) section for details.

### Project Structure

```
loyalteez-mcp/
├── src/
│   ├── index.ts              # Entry point
│   ├── server.ts              # MCP server setup
│   ├── tools/                 # MCP tools
│   │   ├── events.ts
│   │   ├── program-design.ts
│   │   ├── identity.ts
│   │   ├── engagement.ts
│   │   ├── user.ts
│   │   ├── transactions.ts
│   │   ├── drops.ts
│   │   ├── integrations.ts
│   │   ├── perks.ts
│   │   └── achievements.ts
│   ├── resources/             # MCP resources
│   │   ├── docs.ts
│   │   ├── contracts.ts
│   │   ├── network.ts
│   │   ├── event-types.ts
│   │   ├── shared-services.ts
│   │   └── oauth.ts
│   ├── utils/                 # Utilities
│   │   ├── api-client.ts
│   │   ├── brand-id.ts
│   │   ├── doc-loader.ts
│   │   ├── doc-index.ts
│   │   └── validation.ts
│   └── types/                  # TypeScript types
│       └── index.ts
├── tests/                      # Test suite
│   ├── brand-id.test.ts
│   ├── validation.test.ts
│   ├── resources.test.ts
│   ├── tools.test.ts
│   ├── api-client.test.ts
│   ├── integration.test.ts
│   └── README.md
├── examples/                   # Usage examples
└── README.md
```

## API Endpoints

The MCP server interacts with these Loyalteez APIs:

- **Event Handler**: `https://api.loyalteez.app` (mainnet) / `https://api.loyalteez.xyz` (testnet)
- **Shared Services**: `https://services.loyalteez.app` (mainnet) / `https://services.loyalteez.xyz` (testnet)
- **Pregeneration**: `https://register.loyalteez.app` (mainnet) / `https://register.loyalteez.xyz` (testnet)

## BrandId Configuration

The `brandId` parameter is required for most operations but can be provided in two ways:

1. **Environment Variable** (Recommended): Set `LOYALTEEZ_BRAND_ID` in your environment
2. **Tool Parameter**: Provide `brandId` as a parameter to each tool call

If neither is provided, tools will return a helpful error message explaining how to set it up.

## Security

- No API keys required - uses public `brandId` identifier
- All inputs validated server-side
- Rate limiting awareness (documented limits)
- Support for testnet/mainnet separation
- BrandId can be set via environment variable for convenience

## Documentation

Full documentation is available as MCP resources. Access via:

```
loyalteez://docs/{path}
```

For example:
- `loyalteez://docs/architecture` - System architecture
- `loyalteez://docs/api/rest-api` - REST API reference
- `loyalteez://docs/integrations/discord` - Discord integration guide

## Testing

The MCP server includes a comprehensive test suite to validate all tools and patterns.

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Coverage

Tests cover:
- **BrandId Resolution**: Environment variable vs parameter handling
- **Input Validation**: All validation utilities (brandId, email, eventType, etc.)
- **Resource Loading**: All MCP resource types (contracts, network, events, etc.)
- **Tool Registration**: All 24+ tools are properly registered
- **Tool Schemas**: Schema validation and brandId optionality
- **API Client**: All API methods and error handling
- **Server Integration**: Server initialization and configuration

See `tests/` directory for detailed test files and `tests/README.md` for test documentation.

## Troubleshooting

### BrandId Not Found

If you see "BrandId is required but not provided":
1. Set `LOYALTEEZ_BRAND_ID` environment variable, or
2. Provide `brandId` as a parameter to the tool call

### Tool Not Found

Ensure you've built the project:
```bash
npm run build
```

### Resource Not Found

Resources are loaded at server startup. Ensure:
- Documentation files exist in the expected location
- Resource URIs match the expected format (e.g., `loyalteez://docs/...`)

## Contributing

This is an internal tool for Alpha4 Labs. For issues or questions, contact the Loyalteez team.

## License

MIT

## Related

- [Loyalteez Developer Docs](https://docs.loyalteez.app)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Loyalteez Partner Portal](https://partners.loyalteez.app)
