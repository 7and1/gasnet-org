#!/usr/bin/env node

/*
 * Validate benchmark JSON files against the schema.
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const DATA_DIR = path.join(__dirname, '..', 'static', 'data', 'benchmarks');
const SCHEMA_PATH = path.join(DATA_DIR, 'schema.json');

function loadJson(filePath) {
  const contents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(contents);
}

function getBenchmarkFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    return [];
  }

  return fs
    .readdirSync(DATA_DIR)
    .filter(file => file.endsWith('.json') && file !== 'schema.json')
    .map(file => path.join(DATA_DIR, file));
}

function main() {
  const schema = loadJson(SCHEMA_PATH);
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);

  const files = getBenchmarkFiles();
  if (files.length === 0) {
    console.info('No benchmark datasets found.');
    return;
  }

  let hasErrors = false;

  files.forEach(filePath => {
    const data = loadJson(filePath);
    const valid = validate(data);

    if (!valid) {
      hasErrors = true;
      const fileName = path.basename(filePath);
      console.error(`\n${fileName} failed validation:`);
      console.error(ajv.errorsText(validate.errors, { separator: '\n' }));
    }
  });

  if (hasErrors) {
    process.exit(1);
  }

  console.info(`Validated ${files.length} benchmark dataset(s).`);
}

main();
