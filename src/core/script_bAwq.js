#!/usr/bin/env node
/**
 * UniStack Installation Verification Script
 * english: checks that all dependencies and files are correctly set up
 * french: vérifie que toutes les dépendances et fichiers sont correctement configurés
 */

import { promises as fs } from 'fs';
import { resolve } from 'path';

const checks = [];

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1), 10);
if (majorVersion >= 18) {
  checks.push({
    name: 'Node.js version',
    passed: true,
    message: `[Check] Node ${nodeVersion}`,
  });
} else {
  checks.push({
    name: 'Node.js version',
    passed: false,
    message: `[X Mark] Node ${nodeVersion} (require 18+)`,
  });
}

// Check files exist
const filesToCheck = [
  'package.json',
  'src/cli.ts',
  'src/parser/uniParser.ts',
  'src/transpiler/index.ts',
  'src/runtime/server.ts',
  'LICENSE',
  'README.md',
  'GUIDE_COMPLET.md',
];

for (const file of filesToCheck) {
  try {
    await fs.stat(resolve(file));
    checks.push({
      name: `File: ${file}`,
      passed: true,
      message: '[Check]',
    });
  } catch {
    checks.push({
      name: `File: ${file}`,
      passed: false,
      message: '[X Mark] not found',
    });
  }
}

// Check directories
const dirsToCheck = ['node_modules', 'dist', 'src', '.git'];
for (const dir of dirsToCheck) {
  try {
    const stat = await fs.stat(resolve(dir));
    if (stat.isDirectory()) {
      checks.push({
        name: `Directory: ${dir}`,
        passed: true,
        message: '[Check]',
      });
    }
  } catch {
    checks.push({
      name: `Directory: ${dir}`,
      passed: false,
      message: '[X Mark] not found',
    });
  }
}

// Display results
console.log('\n╔════════════════════════════════════════╗');
console.log('║   UniStack Verification Report       ║');
console.log('╚════════════════════════════════════════╝\n');

let allPassed = true;
for (const check of checks) {
  console.log(`${check.message} ${check.name}`);
  if (!check.passed) {
    allPassed = false;
  }
}

console.log('\n' + (allPassed ? '[Check] All checks passed! Ready to develop.' : '[X Mark] Some checks failed. Please review above.'));
process.exit(allPassed ? 0 : 1);
