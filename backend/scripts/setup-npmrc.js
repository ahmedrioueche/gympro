#!/usr/bin/env node

/**
 * Script to create .npmrc file for GitHub Packages authentication
 * Uses NPM_TOKEN or GITHUB_TOKEN environment variable
 * Only creates/updates .npmrc if token is available (for CI/CD environments)
 */

const fs = require('fs');
const path = require('path');

const token = process.env.NPM_TOKEN || process.env.GITHUB_TOKEN;

if (!token) {
  // In local dev, developers use their own .npmrc (gitignored)
  // Only create .npmrc in CI/CD environments where token is provided
  console.log('ℹ NPM_TOKEN/GITHUB_TOKEN not found. Using existing .npmrc if available.');
  process.exit(0);
}

const npmrcPath = path.join(__dirname, '..', '.npmrc');
const npmrcContent = `@ahmedrioueche:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${token}
`;

fs.writeFileSync(npmrcPath, npmrcContent, 'utf8');
console.log('✓ Created .npmrc file for GitHub Packages authentication');
