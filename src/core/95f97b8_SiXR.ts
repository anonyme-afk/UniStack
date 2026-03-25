/*
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
 * Language Server Protocol (LSP) Foundation for UniStack
 * Provides intellisense, diagnostics, formatting, and navigation
 */

export interface Position {
  line: number;
  character: number;
}

export interface Range {
  start: Position;
  end: Position;
}

export interface Diagnostic {
  range: Range;
  severity: 'error' | 'warning' | 'info' | 'hint';
  message: string;
  source: string;
}

export interface Documentation {
  kind: 'plaintext' | 'markdown';
  value: string;
}

export interface CompletionItem {
  label: string;
  kind: 'keyword' | 'function' | 'class' | 'variable' | 'module';
  documentation?: Documentation;
  insertText?: string;
  detail?: string;
}

export interface Hover {
  contents: Documentation | string;
  range?: Range;
}

export interface Location {
  uri: string;
  range: Range;
}

export interface Definition extends Location {}

export interface Reference extends Location {}

import { parseUniFile } from '../parser/uniParser.js';
import { StrictTypeInference } from '../compiler/metatypes.js';

/**
 * UniStack Language Server
 */
export class UniStackLanguageServer {
  private keywords = [
    'unistack',
    'app',
    'version',
    'imports',
    'config',
    'html-ui',
    'css',
    'style',
    'py',
    'js',
    'routes',
    'get',
    'post',
    'put',
    'delete',
    'patch',
    'async',
    'def',
    'function',
    'DataSet',
    'json',
    'catch',
  ];

  private builtins = ['DataSet', 'Response', 'Request', 'json', 'error'];
  private primitiveTypes = ['i32','i64','f32','f64','bool','ptr','void'];
  private persistMap: Map<string, string[]> = new Map();

  /**
   * Provide completions at position
   */
  getCompletions(text: string, position: Position): CompletionItem[] {
    const completions: CompletionItem[] = [];

    // refresh metadata (persisted fields, etc.)
    this.updateMetadata(text);

    // Add keywords
    this.keywords.forEach((keyword) => {
      completions.push({
        label: keyword,
        kind: 'keyword',
        detail: 'UniStack language keyword',
        insertText: keyword,
      });
    });

    // Add built-in functions
    this.builtins.forEach((builtin) => {
      completions.push({
        label: builtin,
        kind: 'function',
        detail: 'Built-in function',
        insertText: builtin,
      });
    });

    // Add primitive types from meta-type system
    this.primitiveTypes.forEach((t) => {
      completions.push({
        label: t,
        kind: 'keyword',
        detail: 'primitive type',
        insertText: t,
      });
    });

    // Add persisted-object fields
    this.persistMap.forEach((fields, varName) => {
      fields.forEach((f) => {
        completions.push({
          label: f,
          kind: 'variable',
          detail: `field of ${varName}`,
          insertText: f,
        });
      });
    });

    return completions;
  }

  /**
   * Provide hover information
   */
  getHover(text: string, position: Position): Hover | null {
    // check for primitive types
    for (const t of this.primitiveTypes) {
      if (text.includes(t)) {
        return { contents: `
**${t}** – primitive type inferred by meta-type system
` };
      }
    }

    // check for persisted objects
    for (const [varName, fields] of this.persistMap.entries()) {
      if (text.includes(varName)) {
        return { contents: `
**${varName}** – persisted variable with fields: ${fields.join(', ')}
` };
      }
    }

    const hovers: { [key: string]: string } = {
      DataSet: 'Abstraction layer for database queries with parameterized SQL',
      'html-ui': 'Section for defining HTML user interface',
      'py:': 'Python code section for server-side logic',
      'js:': 'JavaScript code section for client-side interaction',
      routes: 'Section for defining API routes (GET, POST, etc)',
      async: 'Mark function as asynchronous',
      json: 'Return JSON response data',
      catch: 'Error handler block for route errors',
    };

    for (const [key, desc] of Object.entries(hovers)) {
      if (text.includes(key)) {
        return {
          contents: {
            kind: 'markdown',
            value: `**${key}**\n\n${desc}`,
          },
        };
      }
    }

    return null;
  }

  /**
   * Find syntax errors and diagnostics
   */
  getDiagnostics(text: string): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];
    // simple check: if developer uses a field on a persist variable that doesn't exist
    this.updateMetadata(text);
    const fieldAccess = /([a-zA-Z_][\w]*)\.([a-zA-Z_][\w]*)/g;
    let m;
    while ((m = fieldAccess.exec(text)) !== null) {
      const varName = m[1];
      const field = m[2];
      const fields = this.getPersistFields(varName);
      if (fields.length && !fields.includes(field)) {
        // record warning
        diagnostics.push({
          range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
          severity: 'warning',
          message: `Unknown field '${field}' on persisted object '${varName}'`,
          source: 'UniStack-LSP',
        });
      }
    }

    // Check for missing app declaration
    if (!text.includes('unistack app')) {
      diagnostics.push({
        range: { start: { line: 0, character: 0 }, end: { line: 0, character: 10 } },
        severity: 'error',
        message: 'Missing "unistack app" declaration',
        source: 'UniStack-LSP',
      });
    }

    // Check for missing version
    if (!text.includes('version')) {
      diagnostics.push({
        range: { start: { line: 0, character: 0 }, end: { line: 0, character: 50 } },
        severity: 'warning',
        message: 'Missing version specification',
        source: 'UniStack-LSP',
      });
    }

    // Check for unmatched braces
    const openBraces = (text.match(/{/g) || []).length;
    const closeBraces = (text.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
      diagnostics.push({
        range: { start: { line: 0, character: 0 }, end: { line: 0, character: 10 } },
        severity: 'error',
        message: `Unmatched braces: ${openBraces} opening, ${closeBraces} closing`,
        source: 'UniStack-LSP',
      });
    }

    return diagnostics;
  }

  /**
   * Format document
   */
  formatDocument(text: string): string {
    // Basic formatting: indent sections properly
    const lines = text.split('\n');
    const formatted: string[] = [];
    let indentLevel = 0;

    lines.forEach((line) => {
      const trimmed = line.trim();

      if (trimmed.endsWith('}')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      if (trimmed.length > 0) {
        formatted.push('  '.repeat(indentLevel) + trimmed);
      }

      if (trimmed.endsWith('{')) {
        indentLevel++;
      }
    });

    return formatted.join('\n');
  }

  /**
   * Find definition/source of symbol
   */
  findDefinition(text: string, position: Position, symbol: string): Definition | null {
    const lines = text.split('\n');
    const definitionPattern = new RegExp(`\\b${symbol}\\s*[(:=]`, 'g');

    for (let i = 0; i < lines.length; i++) {
      const match = definitionPattern.exec(lines[i]);
      if (match) {
        return {
          uri: 'file:///current',
          range: {
            start: { line: i, character: match.index },
            end: { line: i, character: match.index + symbol.length },
          },
        };
      }
    }

    return null;
  }

  /**
   * Find all references to a symbol
   */
  findReferences(text: string, symbol: string): Reference[] {
    const references: Reference[] = [];
    const lines = text.split('\n');
    const refPattern = new RegExp(`\\b${symbol}\\b`, 'g');

    for (let i = 0; i < lines.length; i++) {
      let match;
      while ((match = refPattern.exec(lines[i])) !== null) {
        references.push({
          uri: 'file:///current',
          range: {
            start: { line: i, character: match.index },
            end: { line: i, character: match.index + symbol.length },
          },
        });
      }
    }

    return references;
  }

  /**
   * Get all symbols in document
   */
  getDocumentSymbols(text: string): Array<{ name: string; kind: string; location: Location }> {
    const symbols: Array<{ name: string; kind: string; location: Location }> = [];
    const lines = text.split('\n');

    // Find function definitions
    const funcPattern = /def\s+(\w+)|function\s+(\w+)/g;
    lines.forEach((line, i) => {
      let match;
      while ((match = funcPattern.exec(line)) !== null) {
        const name = match[1] || match[2];
        symbols.push({
          name,
          kind: 'function',
          location: {
            uri: 'file:///current',
            range: {
              start: { line: i, character: match.index },
              end: { line: i, character: match.index + 20 },
            },
          },
        });
      }
    });

    return symbols;
  }

  /**
   * Parse the source with the hand‑written parser and cache persisted fields
   */
  private updateMetadata(text: string): void {
    this.persistMap.clear();
    const regex = /persist\s+(\w+)\s*=\s*\{([^}]*)\}/g;
    let m;
    while ((m = regex.exec(text)) !== null) {
      const name = m[1];
      const body = m[2];
      const fields = body
        .split(',')
        .map(s => s.trim())
        .map(s => s.split(':')[0].trim())
        .filter(Boolean);
      this.persistMap.set(name, fields);
    }
  }

  private getPersistFields(varName: string): string[] {
    return this.persistMap.get(varName) || [];
  }

  /**
   * Provide semantic tokens for basic highlighting
   */
  getSemanticTokens(text: string): Array<{ line: number; startChar: number; length: number; tokenType: string }> {
    const tokens: Array<{ line: number; startChar: number; length: number; tokenType: string }> = [];
    const lines = text.split('\n');
    lines.forEach((line, li) => {
      // keywords
      this.keywords.forEach(k => {
        let idx = line.indexOf(k);
        if (idx >= 0) tokens.push({ line: li, startChar: idx, length: k.length, tokenType: 'keyword' });
      });
      // types
      this.primitiveTypes.forEach(t => {
        let idx = line.indexOf(t);
        if (idx >= 0) tokens.push({ line: li, startChar: idx, length: t.length, tokenType: 'type' });
      });
      // strings
      const strRegex = /"[^"]*"/g;
      let m;
      while ((m = strRegex.exec(line)) !== null) {
        tokens.push({ line: li, startChar: m.index, length: m[0].length, tokenType: 'string' });
      }
      // numbers
      const numRegex = /\b\d+\b/g;
      while ((m = numRegex.exec(line)) !== null) {
        tokens.push({ line: li, startChar: m.index, length: m[0].length, tokenType: 'number' });
      }
    });
    return tokens;
  }

  /**
   * Rename symbol in document
   */
  renameSymbol(text: string, oldName: string, newName: string): string {
    const pattern = new RegExp(`\\b${oldName}\\b`, 'g');
    return text.replace(pattern, newName);
  }
}

export default UniStackLanguageServer;
