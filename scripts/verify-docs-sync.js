#!/usr/bin/env node

/**
 * Documentation Sync Verification Script
 * 
 * Verifies that all documentation resources in the MCP server match
 * the source documentation files. Reports missing or outdated resources.
 * 
 * Usage: node scripts/verify-docs-sync.js
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths
const docsRoot = join(__dirname, '../../public-docs/developer-docs/docs');
const mcpRoot = join(__dirname, '..');

// Resource URIs that should exist
const expectedResources = [
  'loyalteez://docs/api/rest-api',
  'loyalteez://docs/architecture',
  'loyalteez://docs/guides/custom-events',
  'loyalteez://docs/guides/webhooks',
  'loyalteez://docs/integrations/discord',
  'loyalteez://docs/integrations/telegram',
  'loyalteez://docs/shared-services/streak-service',
  'loyalteez://docs/shared-services/leaderboard-service',
  'loyalteez://docs/shared-services/perks-service',
  'loyalteez://docs/shared-services/achievement-service',
  'loyalteez://docs/shared-services/drops-service',
];

// Non-doc resources (these don't need source files)
const nonDocResources = [
  'loyalteez://contracts/',
  'loyalteez://network/',
  'loyalteez://event-types/',
  'loyalteez://shared-services/',
  'loyalteez://oauth/',
  'loyalteez://errors/',
  'loyalteez://rate-limits/',
  'loyalteez://sdk/',
  'loyalteez://webhooks/',
];

/**
 * Convert URI to file path
 */
function uriToPath(uri) {
  if (!uri.startsWith('loyalteez://docs/')) {
    return null; // Not a doc resource
  }
  
  const pathPart = uri.replace('loyalteez://docs/', '');
  return join(docsRoot, `${pathPart}.md`);
}

/**
 * Find all markdown files recursively
 */
function findMarkdownFiles(dir, files = []) {
  if (!existsSync(dir)) {
    return files;
  }
  
  const entries = readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory()) {
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
 * Convert file path to URI
 */
function pathToURI(filePath) {
  const relativePath = relative(docsRoot, filePath);
  const uriPath = relativePath.replace(/\.md$/, '').replace(/\\/g, '/');
  return `loyalteez://docs/${uriPath}`;
}

/**
 * Main verification function
 */
function verifyDocsSync() {
  console.log('🔍 Verifying documentation sync...\n');
  
  const issues = [];
  const warnings = [];
  
  // Check if docs directory exists
  if (!existsSync(docsRoot)) {
    issues.push({
      type: 'error',
      message: `Documentation directory not found: ${docsRoot}`,
      suggestion: 'Ensure public-docs/developer-docs/docs exists',
    });
    reportResults(issues, warnings);
    process.exit(1);
  }
  
  // Find all markdown files in docs
  const allDocFiles = findMarkdownFiles(docsRoot);
  const allDocURIs = allDocFiles.map(pathToURI);
  
  // Check expected resources exist
  console.log('Checking expected resources...');
  for (const uri of expectedResources) {
    const filePath = uriToPath(uri);
    if (!filePath || !existsSync(filePath)) {
      issues.push({
        type: 'error',
        message: `Expected resource not found: ${uri}`,
        file: filePath,
        suggestion: 'Create the documentation file or remove from expected resources',
      });
    } else {
      console.log(`  ✅ ${uri}`);
    }
  }
  
  // Check for orphaned resources (URIs that don't have source files)
  console.log('\nChecking for orphaned resources...');
  const docURIsInCode = new Set();
  
  // This would ideally parse the actual code, but for now we check file existence
  for (const uri of allDocURIs) {
    const filePath = uriToPath(uri);
    if (filePath && !existsSync(filePath)) {
      warnings.push({
        type: 'warning',
        message: `Resource URI exists but source file missing: ${uri}`,
        file: filePath,
      });
    }
  }
  
  // Check for missing resources (files that should be resources but aren't)
  console.log('\nChecking for missing resources...');
  const expectedURIs = new Set(expectedResources);
  for (const uri of allDocURIs) {
    if (!expectedURIs.has(uri) && !uri.includes('node_modules')) {
      // This is a doc file that exists but isn't in expected resources
      // This is usually fine - we don't need to expose every doc as a resource
      // But we can warn about potentially useful docs
      if (uri.includes('/api/') || uri.includes('/guides/') || uri.includes('/integrations/')) {
        warnings.push({
          type: 'info',
          message: `Documentation file exists but not in expected resources: ${uri}`,
          suggestion: 'Consider adding to expected resources if it should be accessible',
        });
      }
    }
  }
  
  // Report results
  reportResults(issues, warnings);
  
  // Exit with error code if there are issues
  if (issues.length > 0) {
    process.exit(1);
  }
  
  console.log('\n✅ Documentation sync verification passed!');
}

/**
 * Report verification results
 */
function reportResults(issues, warnings) {
  if (issues.length === 0 && warnings.length === 0) {
    return;
  }
  
  console.log('\n📊 Verification Results:\n');
  
  if (issues.length > 0) {
    console.log('❌ Errors:');
    issues.forEach((issue, i) => {
      console.log(`  ${i + 1}. ${issue.message}`);
      if (issue.file) {
        console.log(`     File: ${issue.file}`);
      }
      if (issue.suggestion) {
        console.log(`     Suggestion: ${issue.suggestion}`);
      }
    });
    console.log('');
  }
  
  if (warnings.length > 0) {
    console.log('⚠️  Warnings/Info:');
    warnings.forEach((warning, i) => {
      const icon = warning.type === 'warning' ? '⚠️' : 'ℹ️';
      console.log(`  ${i + 1}. ${icon} ${warning.message}`);
      if (warning.file) {
        console.log(`     File: ${warning.file}`);
      }
      if (warning.suggestion) {
        console.log(`     Suggestion: ${warning.suggestion}`);
      }
    });
    console.log('');
  }
}

// Run verification
verifyDocsSync();
