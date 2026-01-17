/**
 * Validation Tests for benchmark JSON schema
 * Tests that all benchmark JSON files conform to the schema
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { validateBenchmarkData } from '../../src/lib/validateJson';

const BENCHMARKS_DIR = join(process.cwd(), 'static', 'data', 'benchmarks');

// Get all JSON files except schema and template
const getBenchmarkFiles = () => {
  const files = readdirSync(BENCHMARKS_DIR).filter(
    f => f.endsWith('.json') && f !== 'schema.json' && f !== 'TEMPLATE.json'
  );
  return files.map(f => ({
    name: f,
    path: join(BENCHMARKS_DIR, f),
  }));
};

describe('Benchmark Schema Validation', () => {
  const benchmarkFiles = getBenchmarkFiles();

  it('should have benchmark data directory', () => {
    expect(benchmarkFiles.length).toBeGreaterThan(0);
  });

  benchmarkFiles.forEach(({ name, path }) => {
    describe(`${name}`, () => {
      let rawData;
      let validationResult;

      beforeAll(() => {
        rawData = JSON.parse(readFileSync(path, 'utf-8'));
        validationResult = validateBenchmarkData(rawData);
      });

      it('should validate against schema', () => {
        expect(validationResult.valid).toBe(true);
        expect(validationResult.errors).toBeNull();
      });

      it('should have required fields', () => {
        expect(rawData).toHaveProperty('cluster');
        expect(rawData).toHaveProperty('nodes');
        expect(rawData).toHaveProperty('fabric');
        expect(rawData).toHaveProperty('topology');
      });

      it('should have latency data', () => {
        expect(rawData).toHaveProperty('latency_us');
        expect(Array.isArray(rawData.latency_us)).toBe(true);
        expect(rawData.latency_us.length).toBeGreaterThan(0);
      });

      it('should have valid latency entries', () => {
        rawData.latency_us.forEach(entry => {
          expect(entry).toHaveProperty('size');
          expect(entry).toHaveProperty('p50');
          expect(entry).toHaveProperty('p95');

          // Check size pattern
          expect(entry.size).toMatch(/^[0-9]+(B|KB|MB|GB)$/);

          // Check numeric values
          expect(typeof entry.p50).toBe('number');
          expect(typeof entry.p95).toBe('number');
          expect(entry.p50).toBeGreaterThanOrEqual(0);
          expect(entry.p95).toBeGreaterThanOrEqual(0);
        });
      });

      it('should have bandwidth data', () => {
        expect(rawData).toHaveProperty('bandwidth_gbps');
        expect(Array.isArray(rawData.bandwidth_gbps)).toBe(true);
      });

      it('should have valid bandwidth entries', () => {
        if (rawData.bandwidth_gbps.length > 0) {
          rawData.bandwidth_gbps.forEach(entry => {
            expect(entry).toHaveProperty('size');
            expect(entry).toHaveProperty('gbps');

            expect(entry.size).toMatch(/^[0-9]+(B|KB|MB|GB)$/);
            expect(typeof entry.gbps).toBe('number');
            expect(entry.gbps).toBeGreaterThanOrEqual(0);
          });
        }
      });

      it('should have valid nodes count', () => {
        expect(rawData.nodes).toBeGreaterThan(0);
        expect(rawData.nodes).toBeLessThanOrEqual(1000000);
      });

      it('should have sanitized data', () => {
        const result = validateBenchmarkData(rawData);
        expect(result.data).toBeDefined();

        // Check for prototype pollution
        expect(result.data.__proto__).toBeUndefined();
        expect(result.data.constructor).toBeUndefined();

        // Check for script tags in strings
        const checkString = obj => {
          Object.values(obj).forEach(val => {
            if (typeof val === 'string') {
              expect(val).not.toContain('<script>');
            } else if (typeof val === 'object' && val !== null) {
              checkString(val);
            }
          });
        };
        checkString(result.data);
      });
    });
  });
});
