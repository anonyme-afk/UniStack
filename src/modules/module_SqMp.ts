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
 * Meta-Type System v3 - Strict Type Inference Engine
 * Compiles to optimal native code (C++/LLVM) or WebAssembly
 * without requiring user type annotations
 */

export type Primitive = 'i32' | 'i64' | 'f32' | 'f64' | 'bool' | 'ptr' | 'void';
export type TargetArchitecture = 'wasm' | 'native' | 'js' | 'vulkan' | 'webgpu';

export interface MetaType {
  primitive: Primitive;
  width: number; // bits
  alignment: number; // bytes
  layout: 'scalar' | 'struct' | 'array' | 'function';
  isNull: boolean;
  mutability: 'const' | 'mut';
  lifetime?: string;
}

export interface InferenceContext {
  variables: Map<string, MetaType>;
  functions: Map<string, { params: MetaType[]; returns: MetaType }>;
  targetArch: TargetArchitecture;
  optimizationLevel: 0 | 1 | 2 | 3;
}

/**
 * Strict Type Inference Engine - Infers optimal types without user annotation
 */
export class StrictTypeInference {
  private context: InferenceContext;

  constructor(targetArch: TargetArchitecture = 'wasm', optLevel: 0 | 1 | 2 | 3 = 2) {
    this.context = {
      variables: new Map(),
      functions: new Map(),
      targetArch,
      optimizationLevel: optLevel,
    };
  }

  /**
   * Infer minimal type for a literal value
   */
  inferLiteral(value: any): MetaType {
    if (typeof value === 'boolean') {
      return { primitive: 'bool', width: 1, alignment: 1, layout: 'scalar', isNull: false, mutability: 'const' };
    }

    if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        if (value >= -2147483648 && value <= 2147483647) {
          return { primitive: 'i32', width: 32, alignment: 4, layout: 'scalar', isNull: false, mutability: 'const' };
        }
        return { primitive: 'i64', width: 64, alignment: 8, layout: 'scalar', isNull: false, mutability: 'const' };
      }
      if (value >= -3.4e38 && value <= 3.4e38) {
        return { primitive: 'f32', width: 32, alignment: 4, layout: 'scalar', isNull: false, mutability: 'const' };
      }
      return { primitive: 'f64', width: 64, alignment: 8, layout: 'scalar', isNull: false, mutability: 'const' };
    }

    if (typeof value === 'string') {
      return { primitive: 'ptr', width: 64, alignment: 8, layout: 'array', isNull: false, mutability: 'mut' };
    }

    return { primitive: 'void', width: 0, alignment: 1, layout: 'scalar', isNull: true, mutability: 'const' };
  }

  /**
   * Infer type from usage pattern
   */
  inferFromUsage(varName: string, usages: string[]): MetaType {
    let inferredType = this.context.variables.get(varName);

    for (const usage of usages) {
      if (usage.includes('+') || usage.includes('-') || usage.includes('*')) {
        // Arithmetic operation - must be numeric
        if (!inferredType) {
          inferredType = { primitive: 'i32', width: 32, alignment: 4, layout: 'scalar', isNull: false, mutability: 'mut' };
        }
      }
      if (usage.includes('.length') || usage.includes('.charAt')) {
        // String operation
        inferredType = { primitive: 'ptr', width: 64, alignment: 8, layout: 'array', isNull: false, mutability: 'mut' };
      }
      if (usage.includes('[') || usage.includes('.map')) {
        // Array operation
        inferredType = { primitive: 'ptr', width: 64, alignment: 8, layout: 'array', isNull: false, mutability: 'mut' };
      }
    }

    return inferredType || { primitive: 'void', width: 0, alignment: 1, layout: 'scalar', isNull: true, mutability: 'const' };
  }

  /**
   * Validate type safety - Error before runtime!
   */
  validateTypeConsistency(varName: string, operations: Array<{ type: string; value: any }>): string[] {
    const inferredType = this.context.variables.get(varName);
    const errors: string[] = [];

    for (const op of operations) {
      if (op.type === 'arithmetic' && inferredType?.primitive.startsWith('f') === false && !inferredType?.primitive.startsWith('i')) {
        errors.push(`Cannot perform arithmetic on non-numeric type ${inferredType?.primitive}`);
      }
      if (op.type === 'string' && inferredType?.primitive !== 'ptr') {
        errors.push(`Cannot perform string operation on type ${inferredType?.primitive}`);
      }
    }

    return errors;
  }

  /**
   * Optimize for target architecture
   */
  optimizeForTarget(type: MetaType): MetaType {
    if (this.context.targetArch === 'wasm') {
      // WASM prefers i32 for small values (no 8-bit or 16-bit)
      if (type.primitive === 'i64' && type.width <= 32) {
        return { ...type, primitive: 'i32', width: 32 };
      }
    }

    if (this.context.targetArch === 'native') {
      // Native code can use exact sizes
      return type;
    }

    return type;
  }

  /**
   * Generate C++ type string
   */
  toCppType(type: MetaType): string {
    const mapping: Record<Primitive, string> = {
      i32: 'int32_t',
      i64: 'int64_t',
      f32: 'float',
      f64: 'double',
      bool: 'bool',
      ptr: 'void*',
      void: 'void',
    };
    return mapping[type.primitive];
  }

  /**
   * Generate WebAssembly type string
   */
  toWasmType(type: MetaType): string {
    const mapping: Record<Primitive, string> = {
      i32: 'i32',
      i64: 'i64',
      f32: 'f32',
      f64: 'f64',
      bool: 'i32',
      ptr: 'i32',
      void: 'void',
    };
    return mapping[type.primitive];
  }

  /**
   * Register inferred variable
   */
  registerVariable(name: string, type: MetaType): void {
    this.context.variables.set(name, this.optimizeForTarget(type));
  }

  /**
   * Get all inferred types
   */
  getInferredTypes(): Record<string, MetaType> {
    return Object.fromEntries(this.context.variables);
  }
}

export default StrictTypeInference;
