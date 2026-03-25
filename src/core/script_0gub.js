#!/usr/bin/env node
/**
 * Clean script - removes build artifacts
 * english: cross-platform cleanup of dist/ and generated/
 * french: nettoyage multi-plateforme de dist/ et generated/
 */

import { promises as fs } from 'fs';
import { resolve } from 'path';

const dirs = ['dist', 'generated'];

(async () => {
  for (const dir of dirs) {
    const path = resolve(dir);
    try {
      await fs.rm(path, { recursive: true, force: true });
      console.log(`✓ Removed ${path}`);
    } catch (err) {
      console.warn(`✗ Could not remove ${path}:`, err.message);
    }
  }

  // Recreate directories
  for (const dir of dirs) {
    const path = resolve(dir);
    try {
      await fs.mkdir(path, { recursive: true });
      console.log(`✓ Created ${path}`);
    } catch (err) {
      console.warn(`✗ Could not create ${path}:`, err.message);
    }
  }

  console.log('\n✓ Clean complete');
})();
