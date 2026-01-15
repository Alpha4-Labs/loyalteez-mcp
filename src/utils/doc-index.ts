/**
 * Documentation index generator - builds index from sidebars.ts structure
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { DocIndex } from './doc-loader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface SidebarItem {
  type: 'doc' | 'category';
  id?: string;
  label?: string;
  items?: SidebarItem[] | string[];
}

export interface SidebarConfig {
  [key: string]: SidebarItem[];
}

/**
 * Load sidebars configuration
 * Note: This is a simplified parser. For production, consider using a TypeScript parser.
 */
export function loadSidebars(sidebarsPath?: string): SidebarConfig {
  const defaultSidebarsPath = join(
    __dirname,
    '../../../public-docs/developer-docs/sidebars.ts'
  );

  const path = sidebarsPath || defaultSidebarsPath;

  try {
    const content = readFileSync(path, 'utf-8');
    
    // Extract the sidebars object from the TypeScript file
    const match = content.match(/const\s+sidebars[^=]*=\s*({[\s\S]*});/);
    if (!match) {
      console.error('Could not parse sidebars.ts');
      return {};
    }

    // For now, return empty config - we'll rely on file system scanning instead
    // A proper implementation would use a TypeScript parser like @typescript-eslint/parser
    return {};
  } catch (error) {
    // If sidebars file doesn't exist or can't be read, that's okay
    // We'll fall back to file system scanning
    return {};
  }
}

/**
 * Build URI list from sidebars structure
 */
export function buildURIListFromSidebars(sidebars: SidebarConfig): string[] {
  const uris: string[] = [];

  function traverse(items: SidebarItem[], basePath = ''): void {
    for (const item of items) {
      if (item.type === 'doc' && item.id) {
        const uri = `loyalteez://docs/${item.id}`;
        uris.push(uri);
      } else if (item.type === 'category' && item.items) {
        // Handle both string[] and SidebarItem[]
        if (Array.isArray(item.items) && item.items.length > 0) {
          if (typeof item.items[0] === 'string') {
            // String array - convert to URIs directly
            for (const id of item.items as string[]) {
              uris.push(`loyalteez://docs/${id}`);
            }
          } else {
            // SidebarItem array - recurse
            traverse(item.items as SidebarItem[], basePath);
          }
        }
      }
    }
  }

  for (const sidebar of Object.values(sidebars)) {
    traverse(sidebar);
  }

  return uris;
}

/**
 * Get documentation structure for MCP resources
 */
export function getDocStructure(index: DocIndex): Array<{
  uri: string;
  name: string;
  description?: string;
  mimeType: string;
}> {
  return Object.values(index).map((doc) => ({
    uri: doc.uri,
    name: doc.title,
    description: doc.frontmatter.description as string | undefined,
    mimeType: 'text/markdown',
  }));
}
