import { existsSync, readFileSync } from 'node:fs';

const requiredFiles = [
  'docs/architecture/v0.5-scope.md',
  'docs/architecture/overview.md',
  'docs/architecture/domain-model.md',
  'docs/architecture/service-boundaries.md',
  'docs/architecture/data-model.md',
  'docs/architecture/api-principles.md',
  'schemas/service-boundary.schema.json',
  'schemas/api-boundary.schema.json',
  'schemas/data-entity.schema.json',
  'fixtures/service-boundary.example.json',
  'fixtures/services/brand-knowledge-service.json',
  'fixtures/services/workflow-service.json',
  'fixtures/services/agent-context-service.json',
  'fixtures/services/review-service.json',
  'fixtures/services/design-reference-service.json',
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
const serviceFiles = [
  'fixtures/services/brand-knowledge-service.json',
  'fixtures/services/workflow-service.json',
  'fixtures/services/agent-context-service.json',
  'fixtures/services/review-service.json',
  'fixtures/services/design-reference-service.json'
];

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function validateFixture(schema, fixture, file) {
  const missing = schema.required.filter((key) => !(key in fixture));

  if (missing.length) {
    console.error(`${file} is missing required fields: ${missing.join(', ')}`);
    process.exit(1);
  }

  for (const [key, definition] of Object.entries(schema.properties)) {
    if (definition.enum && fixture[key] !== undefined && !definition.enum.includes(fixture[key])) {
      console.error(`${file} has invalid ${key}: ${fixture[key]}`);
      process.exit(1);
    }
  }
}

for (const check of checks) {
  validateFixture(readJson(check.schema), readJson(check.fixture), check.fixture);
}

const serviceSchema = readJson('schemas/service-boundary.schema.json');
const serviceIds = new Set();

for (const file of serviceFiles) {
  const fixture = readJson(file);
  validateFixture(serviceSchema, fixture, file);
  if (serviceIds.has(fixture.id)) {
    console.error(`Duplicate service id: ${fixture.id}`);
    process.exit(1);
  }
  serviceIds.add(fixture.id);
}

console.log('Architecture requirements passed.');
