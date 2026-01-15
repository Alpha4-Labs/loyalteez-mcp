/**
 * MCP Resources provider for Loyalteez documentation
 * Implements lazy loading and caching for performance
 */

import type { Resource } from '@modelcontextprotocol/sdk/types.js';
import { loadDocumentation, getDocByURI, type DocIndex } from '../utils/doc-loader.js';
import { getDocStructure } from '../utils/doc-index.js';

/**
 * Resource cache for loaded documentation
 */
class ResourceCache {
  private docIndex: DocIndex | null = null;
  private structure: Resource[] | null = null;
  private loadTime: number | null = null;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Get documentation index (lazy load)
   */
  getDocIndex(docsPath?: string): DocIndex {
    // Check if cache is valid
    if (this.docIndex && this.loadTime && Date.now() - this.loadTime < this.CACHE_TTL) {
      return this.docIndex;
    }

    // Load documentation
    this.docIndex = loadDocumentation(docsPath);
    this.loadTime = Date.now();
    this.structure = null; // Invalidate structure cache

    return this.docIndex;
  }

  /**
   * Get documentation structure (cached)
   */
  getStructure(docsPath?: string): Resource[] {
    if (this.structure && this.loadTime && Date.now() - this.loadTime < this.CACHE_TTL) {
      return this.structure;
    }

    const index = this.getDocIndex(docsPath);
    this.structure = getDocStructure(index).map((doc) => ({
      uri: doc.uri,
      name: doc.name,
      description: doc.description,
      mimeType: doc.mimeType,
    }));

    return this.structure;
  }

  /**
   * Clear cache (force reload on next access)
   */
  clearCache(): void {
    this.docIndex = null;
    this.structure = null;
    this.loadTime = null;
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    cached: boolean;
    age: number | null;
    docCount: number;
  } {
    return {
      cached: this.docIndex !== null,
      age: this.loadTime ? Date.now() - this.loadTime : null,
      docCount: this.docIndex ? Object.keys(this.docIndex).length : 0,
    };
  }
}

const cache = new ResourceCache();

/**
 * Initialize documentation index (optional - lazy loading is default)
 * @deprecated Use getDocIndex() directly - it will lazy load
 */
export function initializeDocs(docsPath?: string): void {
  cache.getDocIndex(docsPath);
}

/**
 * Get documentation index (lazy loaded and cached)
 */
export function getDocIndex(docsPath?: string): DocIndex {
  return cache.getDocIndex(docsPath);
}

/**
 * List all documentation resources (lazy loaded and cached)
 */
export function listDocResources(docsPath?: string): Resource[] {
  return cache.getStructure(docsPath);
}

/**
 * Read a documentation resource by URI
 */
export function readDocResource(uri: string): {
  contents: Array<{
    uri: string;
    mimeType: string;
    text: string;
  }>;
} {
  const index = getDocIndex();
  const doc = getDocByURI(uri, index);

  if (!doc) {
    throw new Error(`Documentation resource not found: ${uri}`);
  }

  // Format the content with title and metadata
  let formattedContent = `# ${doc.title}\n\n`;

  // Add frontmatter info if available
  if (Object.keys(doc.frontmatter).length > 0) {
    formattedContent += '---\n';
    for (const [key, value] of Object.entries(doc.frontmatter)) {
      if (key !== 'title' && key !== 'label') {
        formattedContent += `${key}: ${String(value)}\n`;
      }
    }
    formattedContent += '---\n\n';
  }

  formattedContent += doc.content;

  return {
    contents: [
      {
        uri: doc.uri,
        mimeType: 'text/markdown',
        text: formattedContent,
      },
    ],
  };
}

/**
 * Check if a URI is a documentation resource
 */
export function isDocResource(uri: string): boolean {
  return uri.startsWith('loyalteez://docs/');
}
