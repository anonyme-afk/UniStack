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
 * Advanced Type System v2
 * Supports generics, unions, intersections, advanced inference
 */

export type TypeKind = 'primitive' | 'generic' | 'union' | 'intersection' | 'interface' | 'function';

export interface Type {
  kind: TypeKind;
  name: string;
  properties?: Record<string, Type>;
  parameters?: Type[];
  returnType?: Type;
  constraints?: Type[];
}

export interface GenericType<T = unknown> {
  name: string;
  typeParameter: T;
  constraints?: Type[];
}

export interface UnionType {
  types: Type[];
}

export interface IntersectionType {
  types: Type[];
}

/**
 * Type inference engine
 */
export class TypeInference {
  private types: Map<string, Type> = new Map();

  /**
   * Register a type
   */
  registerType(name: string, type: Type): void {
    this.types.set(name, type);
  }

  /**
   * Infer type from value
   */
  inferType(value: any): Type {
    if (typeof value === 'string') {
      return { kind: 'primitive', name: 'string' };
    }
    if (typeof value === 'number') {
      return { kind: 'primitive', name: 'number' };
    }
    if (typeof value === 'boolean') {
      return { kind: 'primitive', name: 'boolean' };
    }
    if (Array.isArray(value)) {
      const itemType = value.length > 0 ? this.inferType(value[0]) : { kind: 'primitive', name: 'unknown' };
      return {
        kind: 'primitive',
        name: 'array',
        parameters: [itemType],
      };
    }
    if (typeof value === 'object') {
      const props: Record<string, Type> = {};
      for (const [key, val] of Object.entries(value)) {
        props[key] = this.inferType(val);
      }
      return { kind: 'interface', name: 'object', properties: props };
    }
    return { kind: 'primitive', name: 'unknown' };
  }

  /**
   * Check type compatibility
   */
  isCompatible(from: Type, to: Type): boolean {
    if (from.name === to.name) return true;
    if (to.name === 'unknown' || to.name === 'any') return true;
    if (from.name === 'null' && to.name.startsWith('Optional')) return true;

    // Check generic compatibility
    if (from.kind === 'generic' && to.kind === 'generic') {
      return from.name === to.name && this.isCompatible(from.parameters![0], to.parameters![0]);
    }

    return false;
  }

  /**
   * Resolve generic type
   */
  resolveGeneric<T>(generic: GenericType<T>, actualType: Type): Type {
    return {
      kind: 'primitive',
      name: `${generic.name}[${actualType.name}]`,
    };
  }

  /**
   * Create union type
   */
  createUnion(...types: Type[]): UnionType {
    return { types };
  }

  /**
   * Create intersection type
   */
  createIntersection(...types: Type[]): IntersectionType {
    return { types };
  }

  /**
   * Get type information
   */
  getType(name: string): Type | undefined {
    return this.types.get(name);
  }

  /**
   * List all registered types
   */
  getAllTypes(): Type[] {
    return Array.from(this.types.values());
  }
}

/**
 * Type checking utilities
 */
export const typeUtils = {
  /**
   * Check if type is nullable
   */
  isNullable(type: Type): boolean {
    if (type.kind === 'union') {
      return (type as any).types.some((t: Type) => t.name === 'null' || t.name === 'undefined');
    }
    return type.name === 'optional' || type.name === 'nullable';
  },

  /**
   * Check if type is optional
   */
  isOptional(type: Type): boolean {
    return type.name.includes('Optional') || type.name.includes('?');
  },

  /**
   * Check if type is generic
   */
  isGeneric(type: Type): boolean {
    return type.kind === 'generic' || (type.parameters && type.parameters.length > 0);
  },

  /**
   * Get type parameters
   */
  getTypeParameters(type: Type): Type[] {
    return type.parameters || [];
  },

  /**
   * Check if type is callable
   */
  isCallable(type: Type): boolean {
    return type.kind === 'function';
  },

  /**
   * Get function signature
   */
  getFunctionSignature(type: Type): string {
    if (type.kind !== 'function') return '';

    const params = type.parameters?.map((p) => p.name).join(', ') || '';
    const returnType = type.returnType?.name || 'void';
    return `(${params}) => ${returnType}`;
  },
};

/**
 * Advanced constraints for generics
 */
export const constraints = {
  /**
   * Type must extend base type
   */
  extends(type: Type, base: Type): boolean {
    return type.name === base.name || type.kind === base.kind;
  },

  /**
   * Type must be assignable to target
   */
  assignableTo(type: Type, target: Type): boolean {
    return type.name === target.name || target.name === 'any';
  },

  /**
   * Type must satisfy predicate
   */
  satisfies(type: Type, predicate: (t: Type) => boolean): boolean {
    return predicate(type);
  },
};

/**
 * Type definitions for common patterns
 */
export const commonTypes = {
  string: { kind: 'primitive' as const, name: 'string' },
  number: { kind: 'primitive' as const, name: 'number' },
  boolean: { kind: 'primitive' as const, name: 'boolean' },
  unknown: { kind: 'primitive' as const, name: 'unknown' },
  any: { kind: 'primitive' as const, name: 'any' },
  null: { kind: 'primitive' as const, name: 'null' },
  undefined: { kind: 'primitive' as const, name: 'undefined' },
  void: { kind: 'primitive' as const, name: 'void' },
};

export default TypeInference;
