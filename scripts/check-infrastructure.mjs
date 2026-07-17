import { existsSync, readFileSync } from 'node:fs';

const requiredFiles = [
  'docs/infrastructure/v0.6-scope.md',
  'docs/infrastructure/environments.md',
  'docs/infrastructure/environment-set.md',
  'docs/infrastructure/deployment.md',
  'docs/infrastructure/deployment-targets.md',
  'docs/infrastructure/observability.md',
  'docs/infrastructure/observability-signals.md',
  'docs/infrastructure/secrets.md',
  'docs/infrastructure/backups.md',
  'docs/infrastructure/incident-response.md',
  'docs/infrastructure/release-management.md',
  'docs/infrastructure/cost-management.md',
  'docs/infrastructure/ci-cd.md',
  'schemas/environment.schema.json',
  'schemas/deployment-target.schema.json',
  'schemas/observability-signal.schema.json',
  'schemas/secret-policy.schema.json',
  'schemas/backup-policy.schema.json',
  'schemas/incident-procedure.schema.json',
  'schemas/release-operation.schema.json',
  'schemas/cost-control.schema.json',
  'schemas/ci-check.schema.json',
  'fixtures/environment.example.json',
  'fixtures/environments/local.json',
  'fixtures/environments/preview.json',
  'fixtures/environments/staging.json',
  'fixtures/environments/production.json',
  'fixtures/deployment-target.example.json',
  'fixtures/deployments/docs-preview.json',
  'fixtures/deployments/staging-release-candidate.json',
  'fixtures/deployments/production-release.json',
  'fixtures/observability-signal.example.json',
  'fixtures/observability/release-validation.json',
  'fixtures/observability/error-rate.json',
  'fixtures/observability/audit-log.json',
  'fixtures/secret-policy.example.json',
  'fixtures/backup-policy.example.json',
  'fixtures/incident-procedure.example.json',
  'fixtures/release-operation.example.json',
  'fixtures/cost-control.example.json',
  'fixtures/ci-check.example.json',
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
  { schema: 'schemas/secret-policy.schema.json', fixture: 'fixtures/secret-policy.example.json' },
  { schema: 'schemas/backup-policy.schema.json', fixture: 'fixtures/backup-policy.example.json' },
  { schema: 'schemas/incident-procedure.schema.json', fixture: 'fixtures/incident-procedure.example.json' },
  { schema: 'schemas/release-operation.schema.json', fixture: 'fixtures/release-operation.example.json' },
  { schema: 'schemas/cost-control.schema.json', fixture: 'fixtures/cost-control.example.json' },
  { schema: 'schemas/ci-check.schema.json', fixture: 'fixtures/ci-check.example.json' }
];
const environmentFiles = [
  'fixtures/environments/local.json',
  'fixtures/environments/preview.json',
  'fixtures/environments/staging.json',
  'fixtures/environments/production.json'
];
const deploymentFiles = [
  'fixtures/deployments/docs-preview.json',
  'fixtures/deployments/staging-release-candidate.json',
  'fixtures/deployments/production-release.json'
];
const observabilityFiles = [
  'fixtures/observability/release-validation.json',
  'fixtures/observability/error-rate.json',
  'fixtures/observability/audit-log.json'
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

const environmentSchema = readJson('schemas/environment.schema.json');
const deploymentSchema = readJson('schemas/deployment-target.schema.json');
const observabilitySchema = readJson('schemas/observability-signal.schema.json');
const environmentIds = new Set();

for (const file of environmentFiles) {
  const fixture = readJson(file);
  validateFixture(environmentSchema, fixture, file);
  if (environmentIds.has(fixture.id)) {
    console.error(`Duplicate environment id: ${fixture.id}`);
    process.exit(1);
  }
  environmentIds.add(fixture.id);
}

const deploymentIds = new Set();
for (const file of deploymentFiles) {
  const fixture = readJson(file);
  validateFixture(deploymentSchema, fixture, file);
  if (deploymentIds.has(fixture.id)) {
    console.error(`Duplicate deployment id: ${fixture.id}`);
    process.exit(1);
  }
  if (!environmentIds.has(fixture.environmentId)) {
    console.error(`${file} references unknown environmentId: ${fixture.environmentId}`);
    process.exit(1);
  }
  deploymentIds.add(fixture.id);
}

const signalIds = new Set();
for (const file of observabilityFiles) {
  const fixture = readJson(file);
  validateFixture(observabilitySchema, fixture, file);
  if (signalIds.has(fixture.id)) {
    console.error(`Duplicate observability signal id: ${fixture.id}`);
    process.exit(1);
  }
  signalIds.add(fixture.id);
}

console.log('Infrastructure requirements passed.');
