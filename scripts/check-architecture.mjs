import { existsSync, readFileSync } from 'node:fs';

const requiredFiles = [
  'docs/architecture/v0.5-scope.md',
  'docs/architecture/overview.md',
  'docs/architecture/domain-model.md',
  'docs/architecture/service-boundaries.md',
  'docs/architecture/data-model.md',
  'docs/architecture/data-entities.md',
  'docs/architecture/api-principles.md',
  'docs/architecture/api-boundaries.md',
  'schemas/service-boundary.schema.json',
  'schemas/api-boundary.schema.json',
  'schemas/data-entity.schema.json',
  'schemas/event-boundary.schema.json',
  'schemas/auth-boundary.schema.json',
  'schemas/integration-boundary.schema.json',
  'schemas/test-strategy.schema.json',
  'fixtures/service-boundary.example.json',
  'fixtures/services/brand-knowledge-service.json',
  'fixtures/services/workflow-service.json',
  'fixtures/services/agent-context-service.json',
  'fixtures/services/review-service.json',
  'fixtures/services/design-reference-service.json',
  'fixtures/api-boundary.example.json',
  'fixtures/apis/brand-profile-api.json',
  'fixtures/apis/context-pack-api.json',
  'fixtures/apis/review-api.json',
  'fixtures/apis/workflow-run-api.json',
  'fixtures/apis/design-reference-api.json',
  'fixtures/data-entity.example.json',
  'fixtures/event-boundary.example.json',
  'fixtures/auth-boundary.example.json',
  'fixtures/integration-boundary.example.json',
  'fixtures/test-strategy.example.json',
  'fixtures/entities/brand-profile.json',
  'fixtures/entities/claim.json',
  'fixtures/entities/context-pack.json',
  'fixtures/entities/review.json',
  'fixtures/entities/workflow-run.json',
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
  },
  {
    schema: 'schemas/event-boundary.schema.json',
    fixture: 'fixtures/event-boundary.example.json'
  },
  {
    schema: 'schemas/auth-boundary.schema.json',
    fixture: 'fixtures/auth-boundary.example.json'
  },
  {
    schema: 'schemas/integration-boundary.schema.json',
    fixture: 'fixtures/integration-boundary.example.json'
  },
  {
    schema: 'schemas/test-strategy.schema.json',
    fixture: 'fixtures/test-strategy.example.json'
  }
];
const serviceFiles = [
  'fixtures/services/brand-knowledge-service.json',
  'fixtures/services/workflow-service.json',
  'fixtures/services/agent-context-service.json',
  'fixtures/services/review-service.json',
  'fixtures/services/design-reference-service.json'
];
const apiFiles = [
  'fixtures/apis/brand-profile-api.json',
  'fixtures/apis/context-pack-api.json',
  'fixtures/apis/review-api.json',
  'fixtures/apis/workflow-run-api.json',
  'fixtures/apis/design-reference-api.json'
];
const entityFiles = [
  'fixtures/entities/brand-profile.json',
  'fixtures/entities/claim.json',
  'fixtures/entities/context-pack.json',
  'fixtures/entities/review.json',
  'fixtures/entities/workflow-run.json'
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
const apiSchema = readJson('schemas/api-boundary.schema.json');
const entitySchema = readJson('schemas/data-entity.schema.json');
const eventSchema = readJson('schemas/event-boundary.schema.json');
const integrationSchema = readJson('schemas/integration-boundary.schema.json');
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

const apiIds = new Set();
for (const file of apiFiles) {
  const fixture = readJson(file);
  validateFixture(apiSchema, fixture, file);
  if (apiIds.has(fixture.id)) {
    console.error(`Duplicate API id: ${fixture.id}`);
    process.exit(1);
  }
  if (!serviceIds.has(fixture.serviceId)) {
    console.error(`${file} references unknown serviceId: ${fixture.serviceId}`);
    process.exit(1);
  }
  apiIds.add(fixture.id);
}

const entityIds = new Set();
for (const file of entityFiles) {
  const fixture = readJson(file);
  validateFixture(entitySchema, fixture, file);
  if (entityIds.has(fixture.id)) {
    console.error(`Duplicate entity id: ${fixture.id}`);
    process.exit(1);
  }
  if (!serviceIds.has(fixture.ownerService)) {
    console.error(`${file} references unknown ownerService: ${fixture.ownerService}`);
    process.exit(1);
  }
  entityIds.add(fixture.id);
}

const eventFixture = readJson('fixtures/event-boundary.example.json');
validateFixture(eventSchema, eventFixture, 'fixtures/event-boundary.example.json');
if (!serviceIds.has(eventFixture.producerService)) {
  console.error(`fixtures/event-boundary.example.json references unknown producerService: ${eventFixture.producerService}`);
  process.exit(1);
}
for (const consumer of eventFixture.consumers) {
  if (!serviceIds.has(consumer)) {
    console.error(`fixtures/event-boundary.example.json references unknown consumer service: ${consumer}`);
    process.exit(1);
  }
}

const integrationFixture = readJson('fixtures/integration-boundary.example.json');
validateFixture(integrationSchema, integrationFixture, 'fixtures/integration-boundary.example.json');
if (!serviceIds.has(integrationFixture.ownedBy)) {
  console.error(`fixtures/integration-boundary.example.json references unknown ownedBy service: ${integrationFixture.ownedBy}`);
  process.exit(1);
}

console.log('Architecture requirements passed.');
