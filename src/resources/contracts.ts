/**
 * Contract address resources for Loyalteez MCP
 */

import type { Resource } from '@modelcontextprotocol/sdk/types.js';

const CONTRACTS = {
  network: 'Soneium Mainnet',
  chainId: 1868,
  contracts: {
    LTZ_TOKEN: {
      address: '0x5242b6DB88A72752ac5a54cFe6A7DB8244d743c9',
      name: 'Loyalteez Token',
      symbol: 'LTZ',
      decimals: 0,
      description: 'ERC-20 loyalty token with EIP-2612 permit support',
    },
    PERK_NFT: {
      address: '0x6ae30d6Dcf3e75456B6582b057f1Bf98A90F2CA0',
      name: 'PerkNFT',
      description: 'ERC-1155 NFT contract for redeemable perks',
    },
    POINTS_SALE: {
      address: '0x5269B83F6A4E31bEdFDf5329DC052FBb661e3c72',
      name: 'PointsSale',
      description: 'Contract for purchasing LTZ with ETH/USDC',
    },
  },
};

/**
 * List contract resources
 */
export function listContractResources(): Resource[] {
  return [
    {
      uri: 'loyalteez://contracts/ltz-token',
      name: 'LTZ Token Contract',
      description: 'ERC-20 token contract address on Soneium',
      mimeType: 'application/json',
    },
    {
      uri: 'loyalteez://contracts/perk-nft',
      name: 'Perk NFT Contract',
      description: 'ERC-1155 perk NFT contract',
      mimeType: 'application/json',
    },
    {
      uri: 'loyalteez://contracts/points-sale',
      name: 'PointsSale Contract',
      description: 'Contract for purchasing LTZ',
      mimeType: 'application/json',
    },
    {
      uri: 'loyalteez://contracts/all',
      name: 'All Contracts',
      description: 'All Loyalteez contract addresses',
      mimeType: 'application/json',
    },
  ];
}

/**
 * Read contract resource
 */
export function readContractResource(uri: string): {
  contents: Array<{
    uri: string;
    mimeType: string;
    text: string;
  }>;
} {
  let content: object;

  if (uri === 'loyalteez://contracts/ltz-token') {
    content = CONTRACTS.contracts.LTZ_TOKEN;
  } else if (uri === 'loyalteez://contracts/perk-nft') {
    content = CONTRACTS.contracts.PERK_NFT;
  } else if (uri === 'loyalteez://contracts/points-sale') {
    content = CONTRACTS.contracts.POINTS_SALE;
  } else if (uri === 'loyalteez://contracts/all') {
    content = CONTRACTS;
  } else {
    throw new Error(`Contract resource not found: ${uri}`);
  }

  return {
    contents: [
      {
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(content, null, 2),
      },
    ],
  };
}

/**
 * Check if URI is a contract resource
 */
export function isContractResource(uri: string): boolean {
  return uri.startsWith('loyalteez://contracts/');
}
