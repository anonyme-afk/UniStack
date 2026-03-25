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
 * Production Utilities
 * Error recovery, circuit breakers, health checks, graceful shutdown
 */

/**
 * Circuit Breaker pattern for fault tolerance
 */
export class CircuitBreaker {
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private failureCount = 0;
  private lastFailureTime?: Date;
  private failureThreshold: number;
  private resetTimeout: number;
  private successThreshold: number;

  constructor(
    failureThreshold: number = 5,
    resetTimeout: number = 60000,
    successThreshold: number = 2,
  ) {
    this.failureThreshold = failureThreshold;
    this.resetTimeout = resetTimeout;
    this.successThreshold = successThreshold;
  }

  /**
   * Execute function with circuit breaker protection
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - (this.lastFailureTime?.getTime() || 0) > this.resetTimeout) {
        this.state = 'half-open';
        this.failureCount = 0;
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    if (this.state === 'half-open') {
      this.state = 'closed';
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = new Date();
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'open';
    }
  }

  getState(): string {
    return this.state;
  }
}

/**
 * Retry mechanism with exponential backoff
 */
export class Retry {
  constructor(
    private maxAttempts: number = 3,
    private initialDelay: number = 100,
    private maxDelay: number = 10000,
  ) {}

  /**
   * Execute function with retries
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt < this.maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (attempt < this.maxAttempts - 1) {
          const delay = Math.min(this.initialDelay * Math.pow(2, attempt), this.maxDelay);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('Max retry attempts exceeded');
  }
}

/**
 * Health check system
 */
export class HealthCheck {
  private checks: Map<string, () => Promise<boolean>> = new Map();
  private lastResults: Map<string, { healthy: boolean; timestamp: Date }> = new Map();

  /**
   * Register health check
   */
  register(name: string, check: () => Promise<boolean>): void {
    this.checks.set(name, check);
  }

  /**
   * Run all health checks
   */
  async runAll(): Promise<{ name: string; healthy: boolean; timestamp: Date }[]> {
    const results = [];

    for (const [name, check] of this.checks) {
      try {
        const healthy = await check();
        const result = { healthy, timestamp: new Date() };
        this.lastResults.set(name, result);
        results.push({ name, ...result });
      } catch (error) {
        const result = { healthy: false, timestamp: new Date() };
        this.lastResults.set(name, result);
        results.push({ name, ...result });
      }
    }

    return results;
  }

  /**
   * Get overall health status
   */
  async getStatus(): Promise<'healthy' | 'degraded' | 'unhealthy'> {
    const results = await this.runAll();
    const healthy = results.every((r) => r.healthy);
    const allUnhealthy = results.every((r) => !r.healthy);

    if (healthy) return 'healthy';
    if (allUnhealthy) return 'unhealthy';
    return 'degraded';
  }

  /**
   * Get last results
   */
  getLastResults(): Record<string, { healthy: boolean; timestamp: Date }> {
    return Object.fromEntries(this.lastResults);
  }
}

/**
 * Graceful shutdown handler
 */
export class GracefulShutdown {
  private handlers: Map<string, () => Promise<void>> = new Map();
  private isShuttingDown = false;

  /**
   * Register shutdown handler
   */
  register(name: string, handler: () => Promise<void>): void {
    this.handlers.set(name, handler);
  }

  /**
   * Execute all shutdown handlers
   */
  async shutdown(): Promise<void> {
    if (this.isShuttingDown) return;
    this.isShuttingDown = true;

    console.log('Starting graceful shutdown...');

    for (const [name, handler] of this.handlers) {
      try {
        console.log(`Shutting down ${name}...`);
        await handler();
        console.log(`${name} shut down successfully`);
      } catch (error) {
        console.error(`Error during ${name} shutdown:`, error);
      }
    }

    console.log('Graceful shutdown complete');
  }

  /**
   * Setup automatic shutdown on signals
   */
  setupSignalHandlers(): void {
    process.on('SIGTERM', () => this.shutdown());
    process.on('SIGINT', () => this.shutdown());
  }
}

/**
 * Error recovery utilities
 */
export const errorRecovery = {
  /**
   * Safe execute with fallback
   */
  async safeExecute<T>(
    fn: () => Promise<T>,
    fallback: T,
    onError?: (error: Error) => void,
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (onError) onError(error as Error);
      return fallback;
    }
  },

  /**
   * Timeout wrapper
   */
  async withTimeout<T>(fn: () => Promise<T>, timeoutMs: number): Promise<T> {
    return Promise.race([fn(), new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeoutMs))]);
  },

  /**
   * Validate before execution
   */
  async validateAndExecute<T>(
    validator: () => boolean,
    fn: () => Promise<T>,
    fallback: T,
  ): Promise<T> {
    if (!validator()) {
      return fallback;
    }
    return fn();
  },
};

/**
 * Resource management
 */
export class ResourceManager {
  private resources: Map<string, { value: any; cleanup: () => Promise<void> }> = new Map();

  /**
   * Register resource with cleanup handler
   */
  register(name: string, value: any, cleanup: () => Promise<void>): void {
    this.resources.set(name, { value, cleanup });
  }

  /**
   * Get resource
   */
  get(name: string): any {
    return this.resources.get(name)?.value;
  }

  /**
   * Clean up all resources
   */
  async cleanupAll(): Promise<void> {
    for (const [name, { cleanup }] of this.resources) {
      try {
        await cleanup();
      } catch (error) {
        console.error(`Error cleaning up ${name}:`, error);
      }
    }
    this.resources.clear();
  }
}

/**
 * Rate limiting
 */
export class RateLimiter {
  private buckets: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(private maxRequests: number = 100, private windowMs: number = 60000) {}

  /**
   * Check if request is allowed
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const bucket = this.buckets.get(key);

    if (!bucket || now > bucket.resetTime) {
      this.buckets.set(key, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (bucket.count < this.maxRequests) {
      bucket.count++;
      return true;
    }

    return false;
  }

  /**
   * Get current usage for key
   */
  getUsage(key: string): { used: number; remaining: number; resetTime: Date } {
    const bucket = this.buckets.get(key);
    if (!bucket) {
      return { used: 0, remaining: this.maxRequests, resetTime: new Date(Date.now() + this.windowMs) };
    }

    return {
      used: bucket.count,
      remaining: Math.max(0, this.maxRequests - bucket.count),
      resetTime: new Date(bucket.resetTime),
    };
  }
}

export default {
  CircuitBreaker,
  Retry,
  HealthCheck,
  GracefulShutdown,
  errorRecovery,
  ResourceManager,
  RateLimiter,
};
