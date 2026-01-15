/**
 * Documentation loader - parses markdown files and builds index
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface DocFile {
  path: string;
  uri: string;
  title: string;
  content: string;
  frontmatter: Record<string, unknown>;
  category?: string;
}

export interface DocIndex {
  [uri: string]: DocFile;
}

/**
 * Parse frontmatter from markdown file
 */
function parseFrontmatter(content: string): {
  frontmatter: Record<string, unknown>;
  body: string;
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const frontmatterText = match[1];
  const body = match[2];

  const frontmatter: Record<string, unknown> = {};
  const lines = frontmatterText.split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value: unknown = line.slice(colonIndex + 1).trim();

    // Remove quotes if present
    if (typeof value === 'string') {
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
    }

    // Try to parse as number or boolean
    if (typeof value === 'string') {
      if (value === 'true') value = true;
      else if (value === 'false') value = false;
      else if (!isNaN(Number(value)) && value !== '') value = Number(value);
    }

    frontmatter[key] = value;
  }

  return { frontmatter, body };
}

/**
 * Convert file path to MCP resource URI
 */
function pathToURI(filePath: string, docsRoot: string): string {
  // Get relative path from docs root
  const relativePath = relative(docsRoot, filePath);
  // Remove .md extension and convert to URI
  const uriPath = relativePath.replace(/\.md$/, '').replace(/\\/g, '/');
  return `loyalteez://docs/${uriPath}`;
}

/**
 * Recursively find all markdown files in a directory
 */
function findMarkdownFiles(dir: string, files: string[] = []): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip certain directories
      if (entry.name.startsWith('.') || entry.name === 'node_modules') {
        continue;
      }
      findMarkdownFiles(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Load all documentation files from the developer-docs directory
 */
export function loadDocumentation(docsPath?: string): DocIndex {
  // Default to public-docs/developer-docs/docs relative to workspace root
  // In production, this should be configurable via environment variable
  const defaultDocsPath = join(
    __dirname,
    '../../../public-docs/developer-docs/docs'
  );

  const docsRoot = docsPath || defaultDocsPath;
  const index: DocIndex = {};

  try {
    // Check if docs directory exists
    if (!statSync(docsRoot).isDirectory()) {
      console.error(`Documentation directory not found: ${docsRoot}`);
      return index;
    }

    // Find all markdown files
    const markdownFiles = findMarkdownFiles(docsRoot);

    for (const filePath of markdownFiles) {
      try {
        const content = readFileSync(filePath, 'utf-8');
        const { frontmatter, body } = parseFrontmatter(content);
        
        const uri = pathToURI(filePath, docsRoot);
        const title = (frontmatter.title as string) || 
                     (frontmatter.label as string) || 
                     filePath.split(/[/\\]/).pop()?.replace(/\.md$/, '') || 
                     'Untitled';

        // Extract category from path
        const relativePath = relative(docsRoot, filePath);
        const pathParts = relativePath.split(/[/\\]/);
        const category = pathParts.length > 1 ? pathParts[0] : undefined;

        index[uri] = {
          path: filePath,
          uri,
          title,
          content: body,
          frontmatter,
          category,
        };
      } catch (error) {
        console.error(`Error loading doc file ${filePath}:`, error);
      }
    }
  } catch (error) {
    console.error(`Error loading documentation from ${docsRoot}:`, error);
  }

  return index;
}

/**
 * Get documentation by URI
 */
export function getDocByURI(uri: string, index: DocIndex): DocFile | undefined {
  return index[uri];
}

/**
 * Search documentation by keyword
 */
export function searchDocs(query: string, index: DocIndex): DocFile[] {
  const lowerQuery = query.toLowerCase();
  const results: DocFile[] = [];

  for (const doc of Object.values(index)) {
    if (
      doc.title.toLowerCase().includes(lowerQuery) ||
      doc.content.toLowerCase().includes(lowerQuery) ||
      doc.uri.toLowerCase().includes(lowerQuery)
    ) {
      results.push(doc);
    }
  }

  return results;
}

/**
 * Get related documentation based on category or keywords
 */
export function getRelatedDocs(doc: DocFile, index: DocIndex, limit = 5): DocFile[] {
  const related: DocFile[] = [];

  // Same category
  if (doc.category) {
    for (const otherDoc of Object.values(index)) {
      if (otherDoc.uri !== doc.uri && otherDoc.category === doc.category) {
        related.push(otherDoc);
        if (related.length >= limit) break;
      }
    }
  }

  return related;
}
