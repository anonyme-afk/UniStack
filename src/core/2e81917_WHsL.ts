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
 * Performance Monitoring & Metrics System
 * Tracks build, startup, runtime, and HTTP performance
 */

export interface Metric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
}

export interface PerformanceReport {
  buildTime: number;
  startupTime: number;
  averageResponseTime: number;
  memoryUsage: number;
  cpuUsage: number;
  metrics: Metric[];
}

export class PerformanceMonitor {
  private metrics: Map<string, Metric[]> = new Map();
  private marks: Map<string, number> = new Map();

  /**
   * Mark start of an operation
   */
  mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  /**
   * Record metric for a marked operation
   */
  measure(name: string, markName?: string): number {
    const markKey = markName || name;
    const startTime = this.marks.get(markKey);

    if (!startTime) {
      console.warn(`No mark found for ${markKey}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.recordMetric(name, duration, 'ms');
    return duration;
  }

  /**
   * Record a custom metric
   */
  recordMetric(name: string, value: number, unit: string): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const metric: Metric = {
      name,
      value,
      unit,
      timestamp: new Date(),
    };

    this.metrics.get(name)!.push(metric);
  }

  /**
   * Get all metrics for a name
   */
  getMetrics(name: string): Metric[] {
    return this.metrics.get(name) || [];
  }

  /**
   * Get average value for a metric
   */
  getAverage(name: string): number {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) return 0;
    const sum = metrics.reduce((acc, m) => acc + m.value, 0);
    return sum / metrics.length;
  }

  /**
   * Get percentile value
   */
  getPercentile(name: string, percentile: number): number {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) return 0;

    const sorted = metrics.map((m) => m.value).sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }

  /**
   * Generate performance report
   */
  generateReport(): PerformanceReport {
    const buildMetrics = this.getMetrics('buildTime');
    const startupMetrics = this.getMetrics('startupTime');
    const responseMetrics = this.getMetrics('responseTime');

    return {
      buildTime:
        buildMetrics.length > 0 ? buildMetrics[buildMetrics.length - 1].value : 0,
      startupTime:
        startupMetrics.length > 0 ? startupMetrics[startupMetrics.length - 1].value : 0,
      averageResponseTime: this.getAverage('responseTime'),
      memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024,
      cpuUsage: process.cpuUsage().user / 1000,
      metrics: Array.from(this.metrics.values()).flat(),
    };
  }

  /**
   * Log performance report
   */
  logReport(): void {
    const report = this.generateReport();

    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║      PERFORMANCE REPORT                      ║');
    console.log('╚══════════════════════════════════════════════╝\n');

    console.log(`Build Time:              ${report.buildTime.toFixed(2)}ms`);
    console.log(`Startup Time:            ${report.startupTime.toFixed(2)}ms`);
    console.log(`Avg Response Time:       ${report.averageResponseTime.toFixed(2)}ms`);
    console.log(`Memory Usage:            ${report.memoryUsage.toFixed(2)}MB`);
    console.log(`CPU Usage:               ${report.cpuUsage.toFixed(2)}ms`);

    console.log('\nPercentiles:');
    console.log(`Response Time p50:       ${this.getPercentile('responseTime', 50).toFixed(2)}ms`);
    console.log(`Response Time p95:       ${this.getPercentile('responseTime', 95).toFixed(2)}ms`);
    console.log(`Response Time p99:       ${this.getPercentile('responseTime', 99).toFixed(2)}ms`);
  }

  /**
   * Export metrics as JSON
   */
  exportJSON(): string {
    const report = this.generateReport();
    return JSON.stringify(report, null, 2);
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
    this.marks.clear();
  }
}

/**
 * Global performance monitor instance
 */
export const monitor = new PerformanceMonitor();

/**
 * Decorator to automatically measure function performance
 */
export function measurePerformance(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;

  descriptor.value = function (...args: any[]) {
    const metricName = `${propertyKey}`;
    monitor.mark(metricName);
    const result = original.apply(this, args);
    monitor.measure(metricName);
    return result;
  };

  return descriptor;
}

/**
 * Measure async function performance
 */
export function measureAsyncPerformance(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const metricName = `${propertyKey}`;
    monitor.mark(metricName);
    const result = await original.apply(this, args);
    monitor.measure(metricName);
    return result;
  };

  return descriptor;
}

export default monitor;
