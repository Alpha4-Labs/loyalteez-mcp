/**
 * Network configuration resources for Loyalteez MCP
 */

import type { Resource } from '@modelcontextprotocol/sdk/types.js';

const NETWORK_CONFIG = {
  chainId: 1868,
  chainName: 'Soneium Mainnet',
  rpcUrls: ['https://rpc.soneium.org'],
  blockExplorer: 'https://soneium.blockscout.com',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
};

/**
 * List network resources
 */
export function listNetworkResources(): Resource[] {
  return [
    {
      uri: 'loyalteez://network/config',
      name: 'Soneium Network Configuration',
      description: 'Network details for connecting to Soneium Mainnet',
      mimeType: 'application/json',
    },
  ];
}

/**
 * Read network resource
 */
export function readNetworkResource(uri: string): {
  contents: Array<{
    uri: string;
    mimeType: string;
    text: string;
  }>;
} {
  if (uri === 'loyalteez://network/config') {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(NETWORK_CONFIG, null, 2),
        },
      ],
    };
  }

  throw new Error(`Network resource not found: ${uri}`);
}

/**
 * Check if URI is a network resource
 */
export function isNetworkResource(uri: string): boolean {
  return uri.startsWith('loyalteez://network/');
}
