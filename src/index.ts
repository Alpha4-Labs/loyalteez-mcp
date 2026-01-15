#!/usr/bin/env node

/**
 * Loyalteez MCP Server Entry Point
 * 
 * This server enables AI assistants (Claude, ChatGPT, etc.) to interact with Loyalteez
 * for loyalty program design, event management, and reward distribution.
 */

import { LoyalteezMCPServer } from './server.js';

// Determine network from environment variable (default: mainnet)
const network = (process.env.LOYALTEEZ_NETWORK as 'mainnet' | 'testnet') || 'mainnet';

// Get default brandId from environment variable (optional)
const defaultBrandId = process.env.LOYALTEEZ_BRAND_ID;

// Create and run the server
const server = new LoyalteezMCPServer(network, defaultBrandId);

server.run().catch((error) => {
  console.error('Failed to start MCP server:', error);
  process.exit(1);
});
