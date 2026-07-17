import { existsSync, readFileSync } from 'node:fs';

const requiredFiles = [
  'docs/infrastructure/v0.6-scope.md',
  'docs/infrastructure/environments.md',
  'docs/infrastructure/deployment.md',
  'docs/infrastructure/observability.md',
  'docs/infrastructure/secrets.md',
  'schemas/environment.schema.json',
  'schemas/deployment-target.schema.json',
  'schemas/observability-signal.schema.json',
  'schemas/secret-policy.schema.json',
  'fixtures/environment.example.json',
  'fixtures/deployment-target.example.json',
  'fixtures/observability-signal.example.json',
  'fixtures/secret-policy.example.json',
  'docs/decisions/0019-infrastructure-start.md'
];

const missingFiles = requiredFiles.filter((file) => !existsSync(file));
if (missingFiles.length) {
  console.error(`Missing infrastructure requirements: ${missingFiles.join(', ')}`);
  process.exit(1);
}

const checks = [
  { schema: 'schemas/environment.schema.json', fixture: 'fixtures/environment.example.json' },
  { schema: 'schemas/deployment-target.schema.json', fixture: 'fixtures/deployment-target.example.json' },
  { schema: 'schemas/observability-signal.schema.json', fixture: 'fixtures/observability-signal.example.json' },
  { schema: 'schemas/secret-policy.schema.json', fixture: 'fixtures/secret-policy.example.json' }
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

const environment = readJson('fixtures/environment.example.json');
const deployment = readJson('fixtures/deployment-target.example.json');
if (deployment.environmentId !== environment.id) {
  console.error(`fixtures/deployment-target.example.json references unknown environmentId: ${deployment.environmentId}`);
  process.exit(1);
}

console.log('Infrastructure requirements passed.');
