/**
 * JSON Schema Validation Utility
 * Provides runtime schema validation for fetched JSON data to prevent
 * ReDoS attacks and ensure data integrity before rendering.
 *
 * @module lib/validateJson
 */

import Ajv from 'ajv';
import addFormats from 'ajv-formats';

// Initialize AJV with security options
const ajv = new Ajv({
  // Strict mode for security
  strict: true,
  // Limit allowed schemas for additional properties
  allowMatchingProperties: false,
  // Use own properties only
  ownProperties: true,
  // Remove additional properties for security
  removeAdditional: true,
  // Coerce types to prevent type confusion attacks
  coerceTypes: true,
});
addFormats(ajv);

// Maximum sizes to prevent ReDoS/memory exhaustion
const MAX_ARRAY_LENGTH = 10000;
const MAX_STRING_LENGTH = 100000;
const _MAX_NESTING_DEPTH = 10; // Reserved for future recursive validation

/**
 * Benchmark data schema validation
 */
const benchmarkSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    cluster: { type: 'string', maxLength: 100 },
    nodes: { type: 'integer', minimum: 1, maximum: 1000000 },
    fabric: { type: 'string', maxLength: 100 },
    topology: { type: 'string', maxLength: 100 },
    metadata: {
      type: 'object',
      additionalProperties: false,
      properties: {
        name: { type: 'string', maxLength: 200 },
        date: { type: 'string', format: 'date', maxLength: 50 },
        hardware: {
          type: 'object',
          additionalProperties: false,
          properties: {
            nodes: { type: 'integer', minimum: 1, maximum: 1000000 },
            network: { type: 'string', maxLength: 100 },
            topology: { type: 'string', maxLength: 100 },
          },
        },
      },
    },
    latency_us: {
      type: 'array',
      maxItems: MAX_ARRAY_LENGTH,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['size', 'p50', 'p95'],
        properties: {
          size: { type: 'string', maxLength: 20, pattern: '^[0-9]+(B|KB|MB|GB)$' },
          p50: { type: 'number', minimum: 0 },
          p95: { type: 'number', minimum: 0 },
        },
      },
    },
    bandwidth_gbps: {
      type: 'array',
      maxItems: MAX_ARRAY_LENGTH,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['size', 'gbps'],
        properties: {
          size: { type: 'string', maxLength: 20, pattern: '^[0-9]+(B|KB|MB|GB)$' },
          gbps: { type: 'number', minimum: 0 },
        },
      },
    },
  },
};

/**
 * Generic chart data schema
 */
const chartDataSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    labels: {
      type: 'array',
      maxItems: MAX_ARRAY_LENGTH,
      items: { type: 'string', maxLength: 200 },
    },
    datasets: {
      type: 'array',
      maxItems: 100,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          label: { type: 'string', maxLength: 200 },
          data: {
            type: 'array',
            maxItems: MAX_ARRAY_LENGTH,
            items: { type: ['number', 'null'] },
          },
          backgroundColor: { type: ['string', 'null', 'array'], maxLength: 100 },
          borderColor: { type: ['string', 'null', 'array'], maxLength: 100 },
        },
      },
    },
  },
};

/**
 * Sanitize input to prevent injection attacks
 *
 * @param {*} data - Data to sanitize
 * @returns {*} Sanitized data
 */
function sanitizeData(data) {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'string') {
    // Truncate excessively long strings
    if (data.length > MAX_STRING_LENGTH) {
      return data.substring(0, MAX_STRING_LENGTH);
    }
    // Remove potential script-like patterns
    return data.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }

  if (Array.isArray(data)) {
    // Limit array length
    if (data.length > MAX_ARRAY_LENGTH) {
      return data.slice(0, MAX_ARRAY_LENGTH).map(sanitizeData);
    }
    return data.map(sanitizeData);
  }

  if (typeof data === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      // Sanitize keys to prevent prototype pollution
      const sanitizedKey = key.replace(/__proto__|constructor|prototype/gi, '');
      if (sanitizedKey) {
        sanitized[sanitizedKey] = sanitizeData(value);
      }
    }
    return sanitized;
  }

  return data;
}

/**
 * Validate data size before parsing
 *
 * @param {Response} response - Fetch response object
 * @throws {Error} If content size exceeds limit
 */
function validateContentSize(response) {
  const contentLength = response.headers.get('content-length');
  if (contentLength) {
    const size = parseInt(contentLength, 10);
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (size > MAX_SIZE) {
      throw new Error(`Response size ${size} bytes exceeds maximum ${MAX_SIZE} bytes`);
    }
  }
}

/**
 * Validate benchmark JSON data
 *
 * @param {*} data - Parsed JSON data to validate
 * @returns {Object} Validation result with valid flag and errors
 */
export function validateBenchmarkData(data) {
  const sanitized = sanitizeData(data);
  const validate = ajv.compile(benchmarkSchema);
  const valid = validate(sanitized);

  if (valid) {
    return { valid: true, data: sanitized, errors: null };
  }

  return {
    valid: false,
    data: null,
    errors: validate.errors?.map(e => e.message) || ['Unknown validation error'],
  };
}

/**
 * Validate chart JSON data
 *
 * @param {*} data - Parsed JSON data to validate
 * @returns {Object} Validation result with valid flag and errors
 */
export function validateChartData(data) {
  const sanitized = sanitizeData(data);
  const validate = ajv.compile(chartDataSchema);
  const valid = validate(sanitized);

  if (valid) {
    return { valid: true, data: sanitized, errors: null };
  }

  return {
    valid: false,
    data: null,
    errors: validate.errors?.map(e => e.message) || ['Unknown validation error'],
  };
}

/**
 * Fetch and validate JSON with security checks
 *
 * @param {string} url - URL to fetch
 * @param {Function} validator - Validation function to use
 * @returns {Promise<Object>} Validated data
 * @throws {Error} On fetch or validation failure
 */
export async function fetchValidatedJson(url, validator) {
  const response = await fetch(url);
  validateContentSize(response);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const rawData = await response.json();
  const result = validator(rawData);

  if (!result.valid) {
    throw new Error(`Validation failed: ${result.errors?.join(', ')}`);
  }

  return result.data;
}

export default {
  validateBenchmarkData,
  validateChartData,
  fetchValidatedJson,
};
