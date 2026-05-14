#!/usr/bin/env node

/**
 * Copyright 2026 anonyme-afk
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * debug.js - Enhanced debugging utility
 * 
 * Usage:
 *   node debug.js parse [file]     - Parse and show AST
 *   node debug.js transpile [file] - Show generated code
 *   node debug.js routes [file]    - List all routes
 *   node debug.js types            - Show TypeInfo
 */

import { promises as fs } from 'node:fs';
import { resolve } from 'node:path';
import { parseUniFile } from './dist/parser/uniParser.js';
import { buildUniStack } from './dist/transpiler/index.js';

const COLOR = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(color, ...args) {
  console.log(`${color}${args.join(' ')}${COLOR.reset}`);
}

function logSection(title) {
  log(COLOR.cyan, `\n${'─'.repeat(60)}`);
  log(COLOR.bright + COLOR.cyan, `  ${title}`);
  log(COLOR.cyan, `${'─'.repeat(60)}\n`);
}

function logSuccess(msg) {
  log(COLOR.green, `[Check] ${msg}`);
}

function logError(msg) {
  log(COLOR.red, `[X Mark] ${msg}`);
}

function logWarning(msg) {
  log(COLOR.yellow, `[Warning] ${msg}`);
}

function logInfo(msg) {
  log(COLOR.blue, `ℹ ${msg}`);
}

async function cmdParse(file) {
  logSection('PARSER OUTPUT');
  
  try {
    const content = await fs.readFile(file, 'utf8');
    logInfo(`Parsing: ${file} (${content.length} bytes)`);
    
    const ast = parseUniFile(content, file);
    
    logSuccess(`Parse successful`);
    logInfo(`Header: app="${ast.header.appName}" v${ast.header.version}`);
    logInfo(`Sections: ${ast.sections.length}`);
    
    ast.sections.forEach((section, i) => {
      const type = section.kind;
      const desc = 
        type === 'routes' ? `${section.routes.length} routes` :
        type === 'py-logic' ? `${section.functions.length} functions` :
        '';
      log(COLOR.dim, `  ${i + 1}. ${type} ${desc ? '(' + desc + ')' : ''}`);
    });
    
    console.log('\nFull AST (JSON):');
    console.log(JSON.stringify(ast, null, 2));
    
  } catch (err) {
    logError(`Parse failed: ${err.message}`);
    if (err.stack) {
      console.error(err.stack);
    }
    process.exit(1);
  }
}

async function cmdTranspile(file) {
  logSection('TRANSPILER OUTPUT');
  
  try {
    const content = await fs.readFile(file, 'utf8');
    logInfo(`Transpiling: ${file}`);
    
    const tmpDir = resolve('debug_temp');
    await fs.mkdir(tmpDir, { recursive: true });
    const tmpFile = resolve(tmpDir, 'app.uni');
    await fs.writeFile(tmpFile, content, 'utf8');
    
    await buildUniStack({
      entryPath: tmpFile,
      generatedDir: tmpDir,
    });
    
    logSuccess(`Transpile successful`);
    
    // Show generated files
    const files = ['app.server.ts', 'app.client.ts', 'index.html', 'app.py'];
    for (const f of files) {
      const path = resolve(tmpDir, f);
      try {
        const content = await fs.readFile(path, 'utf8');
        logInfo(`${f}: ${content.length} bytes`);
      } catch {
        logWarning(`${f}: not generated`);
      }
    }
    
    // Show server TypeScript
    console.log('\n' + COLOR.bright + 'app.server.ts:' + COLOR.reset);
    const serverTs = await fs.readFile(resolve(tmpDir, 'app.server.ts'), 'utf8');
    console.log(serverTs.substring(0, 1000) + '\n...');
    
    // Cleanup
    await fs.rm(tmpDir, { recursive: true });
    
  } catch (err) {
    logError(`Transpile failed: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
  }
}

async function cmdRoutes(file) {
  logSection('ROUTE ANALYSIS');
  
  try {
    const content = await fs.readFile(file, 'utf8');
    logInfo(`Analyzing: ${file}`);
    
    const ast = parseUniFile(content, file);
    const routeSections = ast.sections.filter(s => s.kind === 'routes');
    
    if (routeSections.length === 0) {
      logWarning('No routes section found');
      return;
    }
    
    const routes = routeSections[0].routes;
    logSuccess(`Found ${routes.length} routes`);
    
    console.log('');
    routes.forEach(route => {
      const method = route.method.toUpperCase().padEnd(7);
      const path = route.path.padEnd(30);
      const handler = route.body
        .find(s => s.kind === 'return')
        ?.expr?.name || '(no handler)';
      
      const methodColor = 
        route.method === 'GET' ? COLOR.blue :
        route.method === 'POST' ? COLOR.green :
        route.method === 'PUT' ? COLOR.yellow :
        route.method === 'DELETE' ? COLOR.red :
        COLOR.cyan;
      
      log(COLOR.dim, `  ${methodColor}${method}${COLOR.dim} ${path} → ${handler}`);
    });
    
  } catch (err) {
    logError(`Analysis failed: ${err.message}`);
    process.exit(1);
  }
}

function cmdInfo() {
  logSection('SYSTEM INFORMATION');
  
  log(COLOR.bright, 'Version Information:');
  logInfo(`Node.js: ${process.version}`);
  logInfo(`Platform: ${process.platform}`);
  logInfo(`Architecture: ${process.arch}`);
  
  log('', '');
  log(COLOR.bright, 'UniStack Toolchain:');
  logInfo('Version: 0.1.0 (MVP)');
  logInfo('Parser: Manual TypeScript');
  logInfo('Transpiler: esbuild');
  logInfo('Runtime: Express.js + PyScript (stub)');
  
  log('', '');
  log(COLOR.bright, 'Features:');
  logSuccess('Design System (base.css)');
  logSuccess('Data Abstraction (DataSet ORM)');
  logSuccess('WebAssembly Framework (Phase 2)');
}

function showUsage() {
  log(COLOR.bright + COLOR.cyan, '\nUniStack Debug Utility\n');
  log(COLOR.dim, 'Usage:');
  log(COLOR.dim, '  node debug.js parse <file>     - Parse .uni file and show AST');
  log(COLOR.dim, '  node debug.js transpile <file> - Transpile and show generated code');
  log(COLOR.dim, '  node debug.js routes <file>    - List all routes');
  log(COLOR.dim, '  node debug.js info             - Show system information\n');
  
  log(COLOR.dim, 'Examples:');
  log(COLOR.dim, '  node debug.js parse src/app.uni');
  log(COLOR.dim, '  node debug.js routes src/app.uni\n');
}

async function main() {
  const [cmd, arg] = process.argv.slice(2);
  
  if (!cmd || cmd === '--help' || cmd === '-h') {
    showUsage();
    return;
  }
  
  switch (cmd) {
    case 'parse':
      if (!arg) {
        logError('Missing file argument');
        showUsage();
        process.exit(1);
      }
      await cmdParse(arg);
      break;
      
    case 'transpile':
      if (!arg) {
        logError('Missing file argument');
        showUsage();
        process.exit(1);
      }
      await cmdTranspile(arg);
      break;
      
    case 'routes':
      if (!arg) {
        logError('Missing file argument');
        showUsage();
        process.exit(1);
      }
      await cmdRoutes(arg);
      break;
      
    case 'info':
      cmdInfo();
      break;
      
    default:
      logError(`Unknown command: ${cmd}`);
      showUsage();
      process.exit(1);
  }
}

main().catch(err => {
  logError(`Fatal error: ${err.message}`);
  console.error(err);
  process.exit(1);
});
