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
 * UniStack Data Abstraction Layer
 * english: ORM-like query builder for SQL
 * french: query builder de style ORM pour SQL
 */

export interface QueryWhere {
  [key: string]: any;
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDir?: 'ASC' | 'DESC';
}

export class DataSet {
  private tableName: string;
  private whereClause: QueryWhere = {};
  private options: QueryOptions = {};

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  /**
   * english: select all records from table
   * french: sélectionner tous les enregistrements
   */
  static all(tableName: string) {
    return new DataSet(tableName);
  }

  /**
   * english: where clause builder
   * french: constructeur de clause where
   */
  where(conditions: QueryWhere): this {
    this.whereClause = { ...this.whereClause, ...conditions };
    return this;
  }

  /**
   * english: limit results
   * french: limiter les résultats
   */
  limit(n: number): this {
    this.options.limit = n;
    return this;
  }

  /**
   * english: offset for pagination
   * french: décalage pour pagination
   */
  offset(n: number): this {
    this.options.offset = n;
    return this;
  }

  /**
   * english: order by column
   * french: trier par colonne
   */
  orderBy(column: string, direction: 'ASC' | 'DESC' = 'ASC'): this {
    this.options.orderBy = column;
    this.options.orderDir = direction;
    return this;
  }

  /**
   * english: generate safe SQL query
   * french: générer requête SQL sécurisée
   */
  toSQL(): { query: string; params: any[] } {
    let query = `SELECT * FROM ${this.tableName}`;
    const params: any[] = [];

    // WHERE clause
    if (Object.keys(this.whereClause).length > 0) {
      const conditions = Object.entries(this.whereClause).map(([key, value]) => {
        params.push(value);
        return `${key} = ?`;
      });
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    // ORDER BY
    if (this.options.orderBy) {
      query += ` ORDER BY ${this.options.orderBy} ${this.options.orderDir || 'ASC'}`;
    }

    // LIMIT / OFFSET
    if (this.options.limit) {
      query += ` LIMIT ${this.options.limit}`;
    }
    if (this.options.offset) {
      query += ` OFFSET ${this.options.offset}`;
    }

    return { query, params };
  }

  /**
   * english: create a new record
   * french: créer un nouvel enregistrement
   */
  static create(tableName: string, data: Record<string, any>) {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = columns.map(() => '?').join(', ');

    const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
    return { query, params: values };
  }

  /**
   * english: update records
   * french: mettre à jour les enregistrements
   */
  static update(tableName: string, data: Record<string, any>, where: QueryWhere) {
    const updates = Object.entries(data).map(([key]) => `${key} = ?`);
    const whereConditions = Object.entries(where).map(([key]) => `${key} = ?`);

    const params = [...Object.values(data), ...Object.values(where)];
    const query = `UPDATE ${tableName} SET ${updates.join(', ')} WHERE ${whereConditions.join(' AND ')}`;

    return { query, params };
  }

  /**
   * english: delete records
   * french: supprimer les enregistrements
   */
  static delete(tableName: string, where: QueryWhere) {
    const whereConditions = Object.entries(where).map(([key]) => `${key} = ?`);
    const params = Object.values(where);
    const query = `DELETE FROM ${tableName} WHERE ${whereConditions.join(' AND ')}`;

    return { query, params };
  }
}

/**
 * english: helper to build queries from UniStack syntax
 * french: helper pour construire des requêtes
 */
export function buildQuery(expression: string, params: any[] = []): { query: string; params: any[] } {
  // Parse simple syntax like: Users.all().where({id: 1})
  // This is a simplified version - Phase 2 will improve this

  if (expression.includes('all()')) {
    const tableName = expression.split('.')[0];
    return { query: `SELECT * FROM ${tableName}`, params };
  }

  // Fallback for direct SQL
  return { query: expression, params };
}
