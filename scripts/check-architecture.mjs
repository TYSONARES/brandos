import { existsSync, readFileSync } from 'node:fs';

const requiredFiles = [
  'docs/architecture/v0.5-scope.md',
  'docs/architecture/overview.md',
  'docs/architecture/domain-model.md',
  'docs/architecture/data-model.md',
  'docs/architecture/api-principles.md',
  'schemas/service-boundary.schema.json',
  'schemas/api-boundary.schema.json',
  'schemas/data-entity.schema.json',
  'fixtures/service-boundary.example.json',
  'fixtures/api-boundary.example.json',
  'fixtures/data-entity.example.json',
  'docs/decisions/0017-architecture-start.md'
];

const missingFiles = requiredFiles.filter((file) => !existsSync(file));
if (missingFiles.length) {
  console.error(`Missing architecture requirements: ${missingFiles.join(', ')}`);
  process.exit(1);
}

const checks = [
  {
    schema: 'schemas/service-boundary.schema.json',
    fixture: 'fixtures/service-boundary.example.json'
  },
  {
    schema: 'schemas/api-boundary.schema.json',
    fixture: 'fixtures/api-boundary.example.json'
  },
  {
    schema: 'schemas/data-entity.schema.json',
    fixture: 'fixtures/data-entity.example.json'
  }
];

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

for (const check of checks) {
  const schema = readJson(check.schema);
  const fixture = readJson(check.fixture);
  const missing = schema.required.filter((key) => !(key in fixture));

  if (missing.length) {
    console.error(`${check.fixture} is missing required fields: ${missing.join(', ')}`);
    process.exit(1);
  }

  for (const [key, definition] of Object.entries(schema.properties)) {
    if (definition.enum && fixture[key] !== undefined && !definition.enum.includes(fixture[key])) {
      console.error(`${check.fixture} has invalid ${key}: ${fixture[key]}`);
      process.exit(1);
    }
  }
}

console.log('Architecture requirements passed.');
