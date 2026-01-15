# Loyalteez MCP Server

Model Context Protocol (MCP) server for Loyalteez - enabling AI assistants to design loyalty programs, create events, track rewards, and access comprehensive documentation.

## Overview

The Loyalteez MCP Server provides AI tools (Claude, ChatGPT, etc.) with direct access to Loyalteez's loyalty infrastructure. Design entire programs through natural conversation, create custom events, track rewards, and access full documentation - all via the MCP protocol.

## Features

- **Program Design**: AI-powered loyalty program generation with event structures, tiers, and implementation code
- **Event Management**: Create and track infinitely flexible custom events
- **User Identity**: Resolve platform identities to Loyalteez wallets
- **Engagement Services**: Streak tracking, leaderboards, and achievements
- **Documentation Access**: Full developer docs available as MCP resources
- **Platform Support**: Discord, Telegram, Web, Shopify, Gaming, and more

## Installation

```bash
npm install
npm run build
```

## Usage

### With Claude Desktop

Add to your Claude Desktop MCP configuration (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "loyalteez": {
      "command": "node",
      "args": ["/path/to/loyalteez-mcp/dist/index.js"],
      "env": {
        "LOYALTEEZ_NETWORK": "mainnet"
      }
    }
  }
}
```

### Environment Variables

- `LOYALTEEZ_NETWORK`: Network to use - `mainnet` (default) or `testnet`

## Available Tools

### Program Design

- **loyalteez_design_program**: Design a complete loyalty program from context

### Event Management

- **loyalteez_create_event**: Create a single custom event
- **loyalteez_create_events_batch**: Create multiple events at once
- **loyalteez_track_event**: Fire any event and reward users

### User Identity

- **loyalteez_resolve_user**: Convert platform identity to Loyalteez wallet

### Engagement Services

- **loyalteez_streak_checkin**: Process streak check-in with multipliers
- **loyalteez_get_leaderboard**: Get ranked leaderboards by metric

## Available Resources

All developer documentation is available as MCP resources with URIs like:

- `loyalteez://docs/architecture`
- `loyalteez://docs/api/rest-api`
- `loyalteez://docs/integrations/discord`
- `loyalteez://docs/guides/custom-events`
- ... and many more

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
│   │   └── engagement.ts
│   ├── resources/             # MCP resources
│   │   └── docs.ts
│   ├── utils/                 # Utilities
│   │   ├── api-client.ts
│   │   ├── doc-loader.ts
│   │   └── validation.ts
│   └── types/                  # TypeScript types
│       └── index.ts
├── examples/                   # Usage examples
└── README.md
```

## API Endpoints

The MCP server interacts with these Loyalteez APIs:

- **Event Handler**: `https://api.loyalteez.app` (mainnet) / `https://api.loyalteez.xyz` (testnet)
- **Shared Services**: `https://services.loyalteez.app` (mainnet) / `https://services.loyalteez.xyz` (testnet)
- **Pregeneration**: `https://register.loyalteez.app` (mainnet) / `https://register.loyalteez.xyz` (testnet)

## Security

- No API keys required - uses public `brandId` identifier
- All inputs validated server-side
- Rate limiting awareness (documented limits)
- Support for testnet/mainnet separation

## Documentation

Full documentation is available as MCP resources. Access via:

```
loyalteez://docs/{path}
```

For example:
- `loyalteez://docs/architecture` - System architecture
- `loyalteez://docs/api/rest-api` - REST API reference
- `loyalteez://docs/integrations/discord` - Discord integration guide

## Contributing

This is an internal tool for Alpha4 Labs. For issues or questions, contact the Loyalteez team.

## License

MIT

## Related

- [Loyalteez Developer Docs](https://docs.loyalteez.app)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Loyalteez Partner Portal](https://partners.loyalteez.app)
