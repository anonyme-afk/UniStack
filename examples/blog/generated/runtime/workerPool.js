// ../../src/runtime/workerPool.ts
var WorkerPool = class {
  async run(task) {
    const { op, payload } = task;
    if (op === "vector_add") {
      const { a, b } = payload;
      return a.map((val, i) => val + (b[i] || 0));
    }
    if (op === "vector_scale") {
      const { a, scalar } = payload;
      return a.map((val) => val * scalar);
    }
    throw new Error(`Unsupported worker operation: ${op}`);
  }
  stats() {
    return {
      activeWorkers: 0,
      queuedTasks: 0,
      totalProcessed: 0,
      status: "Ready (Simulation)"
    };
  }
};
export {
  WorkerPool
};
