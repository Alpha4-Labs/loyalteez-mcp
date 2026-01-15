/**
 * MCP Resources provider for Loyalteez documentation
 */

import type { Resource } from '@modelcontextprotocol/sdk/types.js';
import { loadDocumentation, getDocByURI, type DocIndex } from '../utils/doc-loader.js';
import { getDocStructure } from '../utils/doc-index.js';

let docIndex: DocIndex | null = null;

/**
 * Initialize documentation index (call at server startup)
 */
export function initializeDocs(docsPath?: string): void {
  docIndex = loadDocumentation(docsPath);
}

/**
 * Get documentation index
 */
export function getDocIndex(): DocIndex {
  if (!docIndex) {
    docIndex = loadDocumentation();
  }
  return docIndex;
}

/**
 * List all documentation resources
 */
export function listDocResources(): Resource[] {
  const index = getDocIndex();
  const structure = getDocStructure(index);

  return structure.map((doc) => ({
    uri: doc.uri,
    name: doc.name,
    description: doc.description,
    mimeType: doc.mimeType,
  }));
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
