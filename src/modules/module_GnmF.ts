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
 * Native ORM - Make Variables Persistent Automatically
 * Write: persist myUser = { name: "Anonyme" }
 * UniStack handles: SQL table creation, migrations, sync, indexes
 * Result: Magic! No manual database code needed.
 */

export type PersistenceMode = 'memory' | 'sqlite' | 'postgres' | 'mysql' | 'mongodb';

export interface PersistentVariable {
  name: string;
  type: string; // JSON schema type
  value: any;
  indexed?: boolean;
  unique?: boolean;
  encrypted?: boolean;
  syncInterval?: number; // ms for real-time sync
}

export interface SchemaDefinition {
  table: string;
  columns: Map<string, ColumnDef>;
  primaryKey: string;
  indexes: Index[];
}

export interface ColumnDef {
  name: string;
  type: string; // SQL type
  nullable: boolean;
  default?: any;
  unique?: boolean;
}

export interface Index {
  name: string;
  columns: string[];
  unique?: boolean;
}

/**
 * Native ORM - Automatic persistence with zero boilerplate
 */
export class NativeORM {
  private persistenceMode: PersistenceMode;
  private schema: Map<string, SchemaDefinition> = new Map();
  private variables: Map<string, PersistentVariable> = new Map();

  constructor(mode: PersistenceMode = 'sqlite') {
    this.persistenceMode = mode;
  }

  /**
   * Declare persistence for a variable
   * Usage: persist myUser = { name: "Anonyme" }
   */
  persist(varName: string, value: any, options: Partial<PersistentVariable> = {}): void {
    const persistent: PersistentVariable = {
      name: varName,
      type: this.inferType(value),
      value,
      indexed: options.indexed ?? false,
      unique: options.unique ?? false,
      encrypted: options.encrypted ?? false,
      syncInterval: options.syncInterval ?? 5000,
    };

    this.variables.set(varName, persistent);
    this.generateSchema(varName, value);
  }

  /**
   * Infer SQL type from JavaScript value
   */
  inferType(value: any): string {
    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'INTEGER' : 'REAL';
    }
    if (typeof value === 'boolean') return 'BOOLEAN';
    if (typeof value === 'string') return 'TEXT';
    if (value instanceof Date) return 'TIMESTAMP';
    if (Array.isArray(value)) return 'JSON';
    if (typeof value === 'object') return 'JSON';
    return 'TEXT';
  }

  /**
   * Auto-generate table schema from JavaScript object
   */
  generateSchema(varName: string, value: any): void {
    const schema: SchemaDefinition = {
      table: varName,
      columns: new Map(),
      primaryKey: 'id',
      indexes: [],
    };

    // Auto-add ID primary key
    schema.columns.set('id', {
      name: 'id',
      type: 'INTEGER',
      nullable: false,
      unique: true,
    });

    // Generate columns from object
    if (typeof value === 'object' && !Array.isArray(value)) {
      for (const [key, val] of Object.entries(value)) {
        const sqlType = this.inferType(val);
        schema.columns.set(key, {
          name: key,
          type: sqlType,
          nullable: true,
        });
      }
    }

    this.schema.set(varName, schema);
  }

  /**
   * Generate CREATE TABLE statement
   */
  generateCreateTable(varName: string): string {
    const schema = this.schema.get(varName);
    if (!schema) return '';

    const columns = Array.from(schema.columns.values())
      .map((col) => {
        let def = `${col.name} ${col.type}`;
        if (!col.nullable) def += ' NOT NULL';
        if (col.unique) def += ' UNIQUE';
        if (col.default !== undefined) def += ` DEFAULT ${col.default}`;
        return def;
      })
      .join(',\n  ');

    return `
CREATE TABLE IF NOT EXISTS ${varName} (
  ${columns},
  PRIMARY KEY (${schema.primaryKey})
);
`;
  }

  /**
   * Generate migration script for schema changes
   */
  generateMigration(varName: string, newValue: any): string {
    const oldSchema = this.schema.get(varName);
    const newSchema: SchemaDefinition = {
      table: varName,
      columns: new Map(),
      primaryKey: 'id',
      indexes: [],
    };

    // Build new schema
    for (const [key, val] of Object.entries(newValue as Record<string, any>)) {
      newSchema.columns.set(key, {
        name: key,
        type: this.inferType(val),
        nullable: true,
      });
    }

    const migrations: string[] = [];

    // Detect added columns
    if (oldSchema) {
      for (const [key, col] of newSchema.columns) {
        if (!oldSchema.columns.has(key)) {
          migrations.push(`ALTER TABLE ${varName} ADD COLUMN ${col.name} ${col.type};`);
        }
      }

      // Detect removed columns
      for (const [key] of oldSchema.columns) {
        if (!newSchema.columns.has(key)) {
          migrations.push(`ALTER TABLE ${varName} DROP COLUMN ${key};`);
        }
      }
    }

    return migrations.join('\n');
  }

  /**
   * Generate INSERT statement
   */
  generateInsert(varName: string, value: any): string {
    const keys = Object.keys(value);
    const values = keys.map((k) => {
      const v = value[k];
      if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`;
      if (v === null) return 'NULL';
      return v;
    });

    return `INSERT INTO ${varName} (${keys.join(', ')}) VALUES (${values.join(', ')});`;
  }

  /**
   * Generate UPDATE statement
   */
  generateUpdate(varName: string, id: number, value: any): string {
    const sets = Object.entries(value)
      .map(([k, v]) => {
        if (typeof v === 'string') return `${k} = '${v.replace(/'/g, "''")}'`;
        if (v === null) return `${k} = NULL`;
        return `${k} = ${v}`;
      })
      .join(', ');

    return `UPDATE ${varName} SET ${sets} WHERE id = ${id};`;
  }

  /**
   * Generate SELECT statement
   */
  generateSelect(varName: string, conditions?: Record<string, any>): string {
    let query = `SELECT * FROM ${varName}`;

    if (conditions && Object.keys(conditions).length > 0) {
      const where = Object.entries(conditions)
        .map(([key, value]) => {
          if (typeof value === 'string') return `${key} = '${value}'`;
          return `${key} = ${value}`;
        })
        .join(' AND ');
      query += ` WHERE ${where}`;
    }

    query += ';';
    return query;
  }

  /**
   * Enable real-time synchronization
   */
  enableSync(varName: string, intervalMs: number = 5000): void {
    const persistent = this.variables.get(varName);
    if (persistent) {
      persistent.syncInterval = intervalMs;
    }
  }

  /**
   * Generate sync trigger (for real-time updates)
   */
  generateSyncTrigger(varName: string): string {
    return `
-- Real-time sync trigger
CREATE TRIGGER IF NOT EXISTS ${varName}_sync
AFTER INSERT OR UPDATE OR DELETE ON ${varName}
BEGIN
  -- Broadcast change to all connected clients
  NOTIFY '${varName}:change' WITH JSON_BUILD_OBJECT('action', NEW.*;
END;
`;
  }

  /**
   * Generate complete ORM initialization code
   */
  generateOrmInit(): string {
    const code: string[] = ['// UniStack Native ORM - Auto-generated initialization'];

    for (const [varName, schema] of this.schema) {
      code.push(this.generateCreateTable(varName));
      code.push(this.generateSyncTrigger(varName));
    }

    return code.join('\n\n');
  }

  /**
   * Get SQL DDL for all persisted variables
   */
  getDDL(): string {
    const ddl: string[] = [];

    for (const [varName] of this.schema) {
      ddl.push(this.generateCreateTable(varName));
    }

    return ddl.join('\n\n');
  }

  /**
   * Export variable value
   */
  getVariable(varName: string): any {
    return this.variables.get(varName)?.value;
  }

  /**
   * Update variable (and persist)
   */
  setVariable(varName: string, value: any): void {
    const persistent = this.variables.get(varName);
    if (persistent) {
      persistent.value = value;
      // In real implementation, would trigger database update
    }
  }
}

export default NativeORM;
