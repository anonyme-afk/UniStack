/*
Copyright 2026 anonyme-afk

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
 * ffi.ts – Foreign Function Interface Compiler
 * Parses FFI declarations into a manifest used by the runtime to bind external symbols.
 */

export interface FfiDefinition {
  name: string;
  args: string[];
  returnType: string;
}

export interface FfiManifest {
  version: string;
  functions: FfiDefinition[];
}

export class FfiCompiler {
  /**
   * Compiles FFI declaration lines into a structured manifest.
   * Format expected: "functionName(arg1: type, arg2: type) -> returnType"
   */
  compile(lines: string[]): FfiManifest {
    const functions: FfiDefinition[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('//')) continue;

      const match = trimmed.match(/^([a-zA-Z_]\w*)\s*\(([^)]*)\)\s*(?:->\s*([a-zA-Z_]\w*))?$/);
      if (match) {
        const [_, name, argsStr, returnType] = match;
        const args = argsStr
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
        
        functions.push({
          name,
          args,
          returnType: returnType || 'void'
        });
      }
    }

    return {
      version: "1.0",
      functions
    };
  }
}
