#!/usr/bin/env node

/**
 * Test script to verify design system integration
 */

import { promises as fs } from 'node:fs';
import { resolve } from 'node:path';
import { buildUniStack } from './dist/transpiler/index.js';

const tmpDir = resolve('test-output');

async function testDesignSystemIntegration() {
  // Create test directory
  await fs.mkdir(tmpDir, { recursive: true });

  // Create a simple test .uni file
  const testUniCode = `unistack app "TestApp" version 1.0 {
  py-logic:
    def getHome():
      return {"message": "Home page"}
  
  html:
    <div class="container">
      <header class="navbar">
        <h1 class="text-lg">Welcome</h1>
      </header>
      <main>
        <section class="card">
          <h2>Hello World</h2>
          <p>Testing design system integration</p>
          <button class="btn-primary">Click me</button>
        </section>
      </main>
    </div>
  
  routes:
    GET / { return py:getHome; }
}`;

  const entryFile = resolve(tmpDir, 'app.uni');
  await fs.writeFile(entryFile, testUniCode, 'utf8');

  console.log('Building test app...');
  await buildUniStack({
    entryPath: entryFile,
    generatedDir: tmpDir,
  });

  // Check the generated index.html
  const indexHtml = await fs.readFile(resolve(tmpDir, 'index.html'), 'utf8');
  
  console.log('\n=== Generated HTML ===');
  console.log(indexHtml);
  console.log('\n=== Verification ===');
  
  const checks = [
    { name: 'HTML includes base.css', found: indexHtml.includes('base.css') },
    { name: 'HTML includes stylesheet link', found: indexHtml.includes('rel="stylesheet"') },
    { name: 'HTML includes container class usage', found: indexHtml.includes('class="container"') },
    { name: 'HTML includes btn-primary class', found: indexHtml.includes('btn-primary') },
  ];
  
  checks.forEach(check => {
    const status = check.found ? '✓' : '✗';
    console.log(`${status} ${check.name}`);
  });

  const allPassed = checks.every(c => c.found);
  if (allPassed) {
    console.log('\n✓ All design system checks passed!');
  } else {
    console.log('\n✗ Some checks failed!');
    process.exit(1);
  }
  
  // Check if base.css was copied to assets directory
  try {
    const baseCss = await fs.readFile(resolve(tmpDir, 'assets', 'base.css'), 'utf8');
    console.log(`✓ base.css copied to assets (${baseCss.length} bytes)`);
  } catch (e) {
    console.log('✗ base.css not copied to assets');
  }
}

testDesignSystemIntegration().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
