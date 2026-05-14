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
 * english: Basic worker pool implementation for UniStack compute operations.
 * french:  Implémentation de base d'un pool de workers pour les opérations de calcul UniStack.
 */
export class WorkerPool {
  async run(task: { op: string; payload: any }): Promise<any> {
    const { op, payload } = task;
    if (op === 'vector_add') {
      const { a, b } = payload;
      return a.map((val: number, i: number) => val + (b[i] || 0));
    }
    if (op === 'vector_scale') {
      const { a, scalar } = payload;
      return a.map((val: number) => val * scalar);
    }
    throw new Error(`Unsupported worker operation: ${op}`);
  }

  stats(): any {
    return {
      activeWorkers: 0,
      queuedTasks: 0,
      totalProcessed: 0,
      status: 'Ready (Simulation)',
    };
  }
}
