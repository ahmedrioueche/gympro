#!/usr/bin/env node

/**
 * Script to create .npmrc file for GitHub Packages authentication
 * Uses NPM_TOKEN or GITHUB_TOKEN environment variable
 * Only creates/updates .npmrc if token is available (for CI/CD environments)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const token = process.env.NPM_TOKEN || process.env.GITHUB_TOKEN;
const isCI = process.env.CI || process.env.VERCEL || process.env.GITHUB_ACTIONS;

if (!token) {
  if (isCI) {
    // In CI/CD, we MUST have a token - fail loudly
    console.error(
      '✗ ERROR: NPM_TOKEN or GITHUB_TOKEN environment variable is required for CI/CD builds',
    );
    console.error('  Please set NPM_TOKEN in your Vercel project settings:');
    console.error('  Settings → Environment Variables → Add NPM_TOKEN');
    process.exit(1);
  } else {
    // In local dev, developers use their own .npmrc (gitignored)
    console.log(
      'ℹ NPM_TOKEN/GITHUB_TOKEN not found. Using existing .npmrc if available.',
    );
    process.exit(0);
  }
}

const npmrcPath = path.join(__dirname, '..', '.npmrc');
const npmrcContent = `@ahmedrioueche:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${token}
`;

try {
  fs.writeFileSync(npmrcPath, npmrcContent, 'utf8');
  console.log('✓ Created .npmrc file for GitHub Packages authentication');
} catch (error) {
  console.error('✗ Failed to create .npmrc:', error.message);
  process.exit(1);
}
