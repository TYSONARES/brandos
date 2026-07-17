import { existsSync } from 'node:fs';

const required = [
  'docs/infrastructure/release-v0.6.0.md',
  'docs/decisions/0019-infrastructure-start.md',
  'docs/decisions/0020-infrastructure-v0.6-complete.md',
  'schemas/environment.schema.json',
  'schemas/deployment-target.schema.json',
  'schemas/observability-signal.schema.json',
  'schemas/secret-policy.schema.json',
  'schemas/backup-policy.schema.json',
  'schemas/incident-procedure.schema.json',
  'schemas/release-operation.schema.json',
  'schemas/cost-control.schema.json',
  'schemas/ci-check.schema.json',
  'docs/infrastructure/environments.md',
  'docs/infrastructure/deployment.md',
  'docs/infrastructure/observability.md',
  'docs/infrastructure/secrets.md',
  'docs/infrastructure/backups.md',
  'docs/infrastructure/incident-response.md',
  'docs/infrastructure/release-management.md',
  'docs/infrastructure/cost-management.md',
  'docs/infrastructure/ci-cd.md'
];

const missing = required.filter((file) => !existsSync(file));

if (missing.length) {
  console.error(`Missing infrastructure release requirements: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('Infrastructure release requirements passed.');
